"""Rebuild the Ghidra analysis of world_pages_87.exe: import as 16-bit real mode,
disable the analyzers that misfire on Borland code, resolve the switch jump
tables, analyze, then give the Borland C++ 3.x runtime helpers their real
signatures.

The Moraff's World counterpart of `dotu-tools/decomp/ghidra-scripts/build.py`.
Everything binary-specific -- the runtime helper addresses, the functions the
analyzer misses -- lives in `runtime.py` next to this file, so the pipeline
itself is the same for both games.

    MW_WORK=<dir with world_pages_87.exe> python3 build.py [project-name]
"""
import os
import re
import sys
import time

# The working directory holding the re-laid image and the Ghidra project.
SCRATCH = os.environ.get("MW_WORK", os.getcwd())
os.environ.setdefault("GHIDRA_INSTALL_DIR", "/opt/homebrew/Cellar/ghidra/12.1.3/libexec")
os.environ.setdefault("JAVA_HOME", "/opt/homebrew/Cellar/openjdk@21/21.0.12.1/libexec/openjdk.jdk/Contents/Home")
import pyghidra
pyghidra.start(verbose=False)

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import runtime

from ghidra.base.project import GhidraProject
from ghidra.program.model.listing import Program
from ghidra.app.plugin.core.analysis import AutoAnalysisManager
from ghidra.app.cmd.disassemble import DisassembleCommand
from ghidra.util.task import ConsoleTaskMonitor
from ghidra.program.util import DefaultLanguageService
from ghidra.program.model.lang import LanguageID

PROJ_DIR = SCRATCH
PROJ_NAME = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MW_PROJ", "mwrebuild")
LANG_ID = sys.argv[2] if len(sys.argv) > 2 else "x86:LE:16:Real Mode"
BINARY = os.path.join(SCRATCH, os.environ.get("MW_BINARY", "world_pages_87.exe"))

monitor = ConsoleTaskMonitor()


def java_file(path):
    from java.io import File
    return File(path)


def main():
    lang = get_language(LANG_ID)
    print("language:", lang.getLanguageID())
    cspec = lang.getDefaultCompilerSpec()

    import shutil
    for path in (os.path.join(PROJ_DIR, PROJ_NAME + ".rep"), os.path.join(PROJ_DIR, PROJ_NAME + ".gpr")):
        if os.path.isdir(path):
            shutil.rmtree(path)
        elif os.path.exists(path):
            os.remove(path)
    project = GhidraProject.createProject(PROJ_DIR, PROJ_NAME, False)
    program = project.importProgram(java_file(BINARY), lang, cspec)
    print("imported:", program.getName(), program.getExecutableFormat())

    txid = program.startTransaction("rebuild")
    ok = False
    try:
        blocks(program)
        disable_analyzers(program)
        fix_switches(program)
        started = time.time()
        analyze_all(program)
        print("analyzeAll took %.1fs" % (time.time() - started))
        print("functions after analyzeAll:", program.getFunctionManager().getFunctionCount())
        fix_borland(program)
        analyze_changes(program)
        print("functions after FixBorland:", program.getFunctionManager().getFunctionCount())
        ok = True
    finally:
        program.endTransaction(txid, ok)
    project.saveAs(program, "/", os.path.basename(BINARY), True)
    project.close()
    print("saved")


def get_language(language_id):
    return DefaultLanguageService.getLanguageService().getLanguage(LanguageID(language_id))


def blocks(program):
    for b in program.getMemory().getBlocks():
        print("BLOCK %-14s %s - %s size=%d init=%s"
              % (b.getName(), b.getStart(), b.getEnd(), b.getSize(), b.isInitialized()))


def disable_analyzers(program):
    opts = program.getOptions(Program.ANALYSIS_PROPERTIES)
    for name in ("Non-Returning Functions - Discovered", "Non-Returning Functions - Known"):
        try:
            opts.setBoolean(name, False)
            print("disabled", name)
        except Exception as exc:
            print("could not disable", name, exc)


def analyze_all(program):
    mgr = AutoAnalysisManager.getAnalysisManager(program)
    mgr.initializeOptions()
    mgr.reAnalyzeAll(None)
    mgr.startAnalysis(monitor)


def analyze_changes(program):
    AutoAnalysisManager.getAnalysisManager(program).startAnalysis(monitor)


# ---------------------------------------------------------------- FixSwitches
def fix_switches(program):
    """Resolve the `jmp word ptr cs:[bx+disp]` tables Borland emits for switch."""
    from ghidra.program.model.symbol import SourceType, RefType
    from ghidra.program.model.data import WordDataType, ArrayDataType
    import jpype
    mem = program.getMemory()
    af = program.getAddressFactory()
    listing = program.getListing()
    refmgr = program.getReferenceManager()
    fixed = 0
    for blk in mem.getBlocks():
        size = blk.getSize()
        if size > 0x40000 or not blk.isInitialized():
            continue
        segment = str(blk.getStart()).split(":")[0]
        if not re.fullmatch("[0-9a-f]{4}", segment) or int(segment, 16) >= runtime.DATA_SEGMENT:
            continue
        start = blk.getStart()
        data = jpype.JArray(jpype.JByte)(int(size))
        try:
            blk.getBytes(start, data)
        except Exception as exc:
            print("getBytes failed for", blk.getName(), exc)
            continue
        raw = bytes((int(b) & 0xff) for b in data)
        print("scanning block", blk.getName(), start, size)
        for m in re.finditer(b'\x2e\xff\xa7(..)', raw, re.S):
            off = m.start()
            disp = m.group(1)[0] | (m.group(1)[1] << 8)
            jmp_addr = start.add(off)
            back = raw[max(0, off - 16):off]
            count = None
            small = list(re.finditer(b'\x83\xfb(.)', back, re.S))
            if small:
                count = small[-1].group(1)[0] + 1
            big = list(re.finditer(b'\x81\xfb(..)', back, re.S))
            if big:
                count = (big[-1].group(1)[0] | (big[-1].group(1)[1] << 8)) + 1
            if count is None or count > 64:
                print("skip switch at", jmp_addr, "count", count)
                continue
            cs = jmp_addr.getSegment()
            table = af.getAddress("%04x:%04x" % (cs, disp & 0xffff))
            ins = listing.getInstructionAt(jmp_addr)
            if ins is None:
                DisassembleCommand(jmp_addr, None, True).applyTo(program, monitor)
                ins = listing.getInstructionAt(jmp_addr)
            if ins is None:
                print("no instruction at", jmp_addr)
                continue
            targets = []
            for i in range(count):
                ta = table.add(2 * i)
                lo = mem.getByte(ta) & 0xff
                hi = mem.getByte(ta.add(1)) & 0xff
                targets.append(af.getAddress("%04x:%04x" % (cs, lo | (hi << 8))))
            for r in refmgr.getReferencesFrom(jmp_addr):
                refmgr.delete(r)
            for t in targets:
                refmgr.addMemoryReference(jmp_addr, t, RefType.COMPUTED_JUMP, SourceType.USER_DEFINED, 0)
                if listing.getInstructionAt(t) is None:
                    DisassembleCommand(t, None, True).applyTo(program, monitor)
            try:
                listing.clearCodeUnits(table, table.add(2 * count - 1), False)
                listing.createData(table, ArrayDataType(WordDataType.dataType, count, 2))
            except Exception as exc:
                print("table data err", table, exc)
            fixed += 1
            print("switch at %s: table %s x%d" % (jmp_addr, table, count))
    print("fixed switches:", fixed)


# ---------------------------------------------------------------- FixBorland
def jlist(items):
    from java.util import ArrayList
    out = ArrayList()
    for i in items:
        out.add(i)
    return out


def fix_borland(program):
    """Signatures for the runtime helpers, plus the bodies the analyzer misses."""
    import jpype
    from ghidra.program.model.symbol import SourceType
    from ghidra.program.model.listing import ParameterImpl, ReturnParameterImpl, VariableStorage, Function
    from ghidra.program.model.data import (ShortDataType, UnsignedShortDataType, LongDataType,
                                           DoubleDataType, CharDataType, PointerDataType, VoidDataType)
    from ghidra.program.model.lang import Register
    from ghidra.app.cmd.function import CreateFunctionCmd

    fm = program.getFunctionManager()
    af = program.getAddressFactory()
    lang = program.getLanguage()

    types = {
        "long": LongDataType.dataType,
        "int": ShortDataType.dataType,
        "unsigned": UnsignedShortDataType.dataType,
        "double": DoubleDataType.dataType,
        "char": CharDataType.dataType,
        "void": VoidDataType.dataType,
        # medium model: code is far, data is near, so a pointer is two bytes
        "char *": PointerDataType(CharDataType.dataType, 2),
        "void *": PointerDataType(VoidDataType.dataType, 2),
    }

    def storage(*regs):
        return VariableStorage(program, jpype.JArray(Register)([lang.getRegister(r) for r in regs]))

    def ensure(addr, name):
        f = fm.getFunctionAt(addr)
        if f is None:
            CreateFunctionCmd(addr).applyTo(program, monitor)
            f = fm.getFunctionAt(addr)
        if f is not None and name:
            f.setName(name, SourceType.USER_DEFINED)
        return f

    def set_reg_func(where, name, ret_regs, params, purge=0):
        f = ensure(af.getAddress(where), name)
        if f is None:
            print("no function at", where)
            return
        f.setCallingConvention("__cdecl16far")
        f.setCustomVariableStorage(True)
        ps = jlist([ParameterImpl(pn, types[pt], storage(*rg), program) for (pn, pt, rg) in params])
        ret = ReturnParameterImpl(types["long"], storage(*ret_regs), program) if ret_regs else None
        f.updateFunction("__cdecl16far", ret, ps, Function.FunctionUpdateType.CUSTOM_STORAGE, True,
                         SourceType.USER_DEFINED)
        f.setStackPurgeSize(purge)
        print("set", name, f.getSignature())

    def set_stack_func(where, name, conv, ret_type, params, purge=None, ret_regs=None):
        f = ensure(af.getAddress(where), name)
        if f is None:
            print("no function at", where)
            return
        if ret_regs:
            f.setCallingConvention(conv)
            f.setCustomVariableStorage(True)
            ps = []
            off = 4
            for (pn, pt) in params:
                size = types[pt].getLength() if types[pt].getLength() > 0 else 2
                ps.append(ParameterImpl(pn, types[pt], VariableStorage(program, off, size), program))
                off += max(2, size)
            ret = ReturnParameterImpl(types[ret_type], storage(*ret_regs), program)
            f.updateFunction(conv, ret, jlist(ps), Function.FunctionUpdateType.CUSTOM_STORAGE, True,
                             SourceType.USER_DEFINED)
        else:
            ps = jlist([ParameterImpl(pn, types[pt], program) for (pn, pt) in params])
            ret = ReturnParameterImpl(types[ret_type], program)
            f.updateFunction(conv, ret, ps, Function.FunctionUpdateType.DYNAMIC_STORAGE_ALL_PARAMS, True,
                             SourceType.USER_DEFINED)
        if purge is not None:
            f.setStackPurgeSize(purge)
        print("set", name, f.getSignature())

    for where, name, ret_regs, params in runtime.REGISTER_HELPERS:
        set_reg_func(where, name, ret_regs, params)
    for where, name, conv, ret_type, params, purge, ret_regs in runtime.STACK_HELPERS:
        set_stack_func(where, name, conv, ret_type, params, purge=purge, ret_regs=ret_regs)

    mem = program.getMemory()
    removed = 0
    for f in list(fm.getFunctions(True)):
        name = str(f.getName())
        if name.startswith("caseD") or name.startswith("switchD"):
            ep = f.getEntryPoint()
            b = [mem.getByte(ep.add(i)) & 0xff for i in range(3)]
            if not (b[0] == 0x55 and b[1] == 0x8b and b[2] == 0xec):
                fm.removeFunction(ep)
                removed += 1
    print("removed pseudo functions:", removed)

    # relayout.py copies a few bytes past the end of every segment, so that the
    # BYTE-aligned segments keep the preceding segment's last function whole.
    # Anything the analyzer decided was a function out there is not one.
    stray = 0
    for f in list(fm.getFunctions(True)):
        segment, _, offset = str(f.getEntryPoint()).partition(":")
        limit = runtime.SEGMENT_LIMITS.get(int(segment, 16)) if re.fullmatch("[0-9a-f]{4}", segment) else None
        if limit is not None and int(offset, 16) >= limit:
            fm.removeFunction(f.getEntryPoint())
            stray += 1
    print("removed functions past the end of a segment:", stray)

    for where in runtime.MISSED_FUNCTIONS:
        addr = af.getAddress(where)
        if addr is None:
            print("bad addr", where)
            continue
        if fm.getFunctionContaining(addr) is None:
            DisassembleCommand(addr, None, True).applyTo(program, monitor)
            CreateFunctionCmd(addr).applyTo(program, monitor)

    n = 0
    for f in list(fm.getFunctions(True)):
        CreateFunctionCmd(None, f.getEntryPoint(), None, SourceType.DEFAULT, False, True).applyTo(program, monitor)
        n += 1
    print("recreated bodies:", n)


if __name__ == "__main__":
    main()
