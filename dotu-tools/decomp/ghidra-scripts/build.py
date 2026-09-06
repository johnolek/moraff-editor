"""Rebuild the Ghidra analysis of unf_pages.exe: import, fix switches, analyze,
apply Borland runtime signatures.  Port of PreOpts.py + Setup.py + FixBorland.py
(Jython) to PyGhidra, since Ghidra 12 no longer ships Jython."""
import os, re, sys, time

# The working directory holding unf_pages.exe and the Ghidra project.
SCRATCH = os.environ.get("UNF_WORK", os.getcwd())
os.environ.setdefault("GHIDRA_INSTALL_DIR", "/opt/homebrew/Cellar/ghidra/12.1.3/libexec")
os.environ.setdefault("JAVA_HOME", "/opt/homebrew/Cellar/openjdk@21/21.0.12.1/libexec/openjdk.jdk/Contents/Home")
import pyghidra
pyghidra.start(verbose=False)

from ghidra.base.project import GhidraProject
from ghidra.app.util.opinion import MzLoader
from ghidra.program.model.listing import Program
from ghidra.app.plugin.core.analysis import AutoAnalysisManager
from ghidra.app.cmd.disassemble import DisassembleCommand
from ghidra.util.task import ConsoleTaskMonitor
from ghidra.program.util import DefaultLanguageService
from ghidra.program.model.lang import LanguageID

PROJ_DIR = SCRATCH
PROJ_NAME = sys.argv[1] if len(sys.argv) > 1 else "unfrebuild"
LANG_ID = sys.argv[2] if len(sys.argv) > 2 else "x86:LE:16:Real Mode"
BINARY = os.path.join(SCRATCH, "unf_pages.exe")

monitor = ConsoleTaskMonitor()

def get_language(lid):
    return DefaultLanguageService.getLanguageService().getLanguage(LanguageID(lid))

def main():
    lang = get_language(LANG_ID)
    print("language:", lang.getLanguageID())
    for cs in lang.getCompatibleCompilerSpecDescriptions():
        print("  compiler spec:", cs)
    cspec = lang.getDefaultCompilerSpec()

    import shutil
    for p in (os.path.join(PROJ_DIR, PROJ_NAME + ".rep"), os.path.join(PROJ_DIR, PROJ_NAME + ".gpr")):
        if os.path.isdir(p):
            shutil.rmtree(p)
        elif os.path.exists(p):
            os.remove(p)
    project = GhidraProject.createProject(PROJ_DIR, PROJ_NAME, False)
    program = project.importProgram(java_file(BINARY), lang, cspec)
    print("imported:", program.getName(), program.getExecutableFormat())

    txid = program.startTransaction("rebuild")
    ok = False
    try:
        blocks(program)
        disable_analyzers(program)
        fix_switches(program)
        t = time.time()
        analyze_all(program)
        print("analyzeAll took %.1fs" % (time.time() - t))
        print("functions after analyzeAll:", program.getFunctionManager().getFunctionCount())
        fix_borland(program)
        analyze_changes(program)
        print("functions after FixBorland:", program.getFunctionManager().getFunctionCount())
        ok = True
    finally:
        program.endTransaction(txid, ok)
    project.saveAs(program, "/", "unf_pages.exe", True)
    project.close()
    print("saved")

def java_file(p):
    from java.io import File
    return File(p)

def blocks(program):
    for b in program.getMemory().getBlocks():
        print("BLOCK %-14s %s - %s size=%d init=%s" % (b.getName(), b.getStart(), b.getEnd(), b.getSize(), b.isInitialized()))

def disable_analyzers(program):
    opts = program.getOptions(Program.ANALYSIS_PROPERTIES)
    for name in ("Non-Returning Functions - Discovered", "Non-Returning Functions - Known"):
        try:
            opts.setBoolean(name, False)
            print("disabled", name)
        except Exception as e:
            print("could not disable", name, e)

def analyze_all(program):
    mgr = AutoAnalysisManager.getAnalysisManager(program)
    mgr.initializeOptions()
    mgr.reAnalyzeAll(None)
    mgr.startAnalysis(monitor)

def analyze_changes(program):
    mgr = AutoAnalysisManager.getAnalysisManager(program)
    mgr.startAnalysis(monitor)

# ---------------------------------------------------------------- FixSwitches
def fix_switches(program):
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
        if size > 0x40000 or not str(blk.getName()).startswith("CODE") or not blk.isInitialized():
            continue
        start = blk.getStart()
        data = jpype.JArray(jpype.JByte)(int(size))
        try:
            blk.getBytes(start, data)
        except Exception as e:
            print("getBytes failed for", blk.getName(), e)
            continue
        raw = bytes((int(b) & 0xff) for b in data)
        print("scanning block", blk.getName(), start, size)
        for m in re.finditer(b'\x2e\xff\xa7(..)', raw, re.S):
            off = m.start()
            disp = m.group(1)[0] | (m.group(1)[1] << 8)
            jmp_addr = start.add(off)
            back = raw[max(0, off - 16):off]
            cnt = None
            mm = list(re.finditer(b'\x83\xfb(.)', back, re.S))
            if mm:
                cnt = mm[-1].group(1)[0] + 1
            mm2 = list(re.finditer(b'\x81\xfb(..)', back, re.S))
            if mm2:
                cnt = (mm2[-1].group(1)[0] | (mm2[-1].group(1)[1] << 8)) + 1
            if cnt is None or cnt > 64:
                print("skip switch at", jmp_addr, "cnt", cnt)
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
            for i in range(cnt):
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
                listing.clearCodeUnits(table, table.add(2 * cnt - 1), False)
                listing.createData(table, ArrayDataType(WordDataType.dataType, cnt, 2))
            except Exception as e:
                print("table data err", table, e)
            fixed += 1
            print("switch at %s: table %s x%d" % (jmp_addr, table, cnt))
    print("fixed switches:", fixed)

# ---------------------------------------------------------------- FixBorland
def jlist(items):
    from java.util import ArrayList
    l = ArrayList()
    for i in items:
        l.add(i)
    return l

def fix_borland(program):
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

    def addr(s):
        return af.getAddress(s)

    def storage(*regs):
        arr = jpype.JArray(Register)([lang.getRegister(r) for r in regs])
        return VariableStorage(program, arr)

    def ensure_func(a, name):
        f = fm.getFunctionAt(a)
        if f is None:
            CreateFunctionCmd(a).applyTo(program, monitor)
            f = fm.getFunctionAt(a)
        if f is not None and name:
            f.setName(name, SourceType.USER_DEFINED)
        return f

    def set_reg_func(a, name, ret_regs, params, purge=0):
        f = ensure_func(addr(a), name)
        if f is None:
            print("no function at", a); return
        f.setCallingConvention("__cdecl16far")
        f.setCustomVariableStorage(True)
        ps = jlist([ParameterImpl(pn, pt, storage(*rg), program) for (pn, pt, rg) in params])
        ret = ReturnParameterImpl(LongDataType.dataType, storage(*ret_regs), program) if ret_regs else None
        f.updateFunction("__cdecl16far", ret, ps, Function.FunctionUpdateType.CUSTOM_STORAGE, True, SourceType.USER_DEFINED)
        f.setStackPurgeSize(purge)
        print("set", name, f.getSignature())

    def set_stack_func(a, name, conv, ret_type, params, purge=None, ret_regs=None):
        f = ensure_func(addr(a), name)
        if f is None:
            print("no function at", a); return
        if ret_regs:
            f.setCallingConvention(conv)
            f.setCustomVariableStorage(True)
            ps = []
            off = 4
            for (pn, pt) in params:
                sz = pt.getLength() if pt.getLength() > 0 else 2
                ps.append(ParameterImpl(pn, pt, VariableStorage(program, off, sz), program))
                off += max(2, sz)
            ps = jlist(ps)
            ret = ReturnParameterImpl(ret_type, storage(*ret_regs), program)
            f.updateFunction(conv, ret, ps, Function.FunctionUpdateType.CUSTOM_STORAGE, True, SourceType.USER_DEFINED)
        else:
            ps = jlist([ParameterImpl(pn, pt, program) for (pn, pt) in params])
            ret = ReturnParameterImpl(ret_type, program)
            f.updateFunction(conv, ret, ps, Function.FunctionUpdateType.DYNAMIC_STORAGE_ALL_PARAMS, True, SourceType.USER_DEFINED)
        if purge is not None:
            f.setStackPurgeSize(purge)
        print("set", name, f.getSignature())

    L = LongDataType.dataType
    I = ShortDataType.dataType
    U = UnsignedShortDataType.dataType
    D = DoubleDataType.dataType
    V = VoidDataType.dataType
    CP = PointerDataType(CharDataType.dataType, 4)
    VP = PointerDataType(VoidDataType.dataType, 4)

    for a, n in (("1000:1558", "N_LDIV"), ("1000:155f", "N_LUDIV"), ("1000:1567", "N_LMOD"), ("1000:156f", "N_LUMOD")):
        set_stack_func(a, n, "__stdcall16far", L, [("a", L), ("b", L)], purge=8)

    set_reg_func("1000:14f8", "N_LXMUL", ("DX", "AX"), [("a", L, ("DX", "AX")), ("b", L, ("CX", "BX"))])
    set_reg_func("1000:1606", "N_LXLSH", ("DX", "AX"), [("a", L, ("DX", "AX")), ("n", CharDataType.dataType, ("CL",))])
    set_reg_func("1000:1627", "N_LXRSH", ("DX", "AX"), [("a", L, ("DX", "AX")), ("n", CharDataType.dataType, ("CL",))])

    set_stack_func("1000:18b6", "rand", "__cdecl16far", I, [])
    set_stack_func("1000:18a5", "srand", "__cdecl16far", V, [("seed", U)])
    set_stack_func("1000:14bd", "exit", "__cdecl16far", V, [("code", I)])
    set_stack_func("1000:0f28", "pow", "__cdecl16far", D, [("x", D), ("y", D)], ret_regs=("ST0",))
    set_stack_func("1000:5089", "strcpy", "__cdecl16far", CP, [("dst", CP), ("src", CP)], ret_regs=("DX","AX"))
    set_stack_func("1000:50ab", "strlen", "__cdecl16far", I, [("s", CP)])
    set_stack_func("1000:4604", "itoa", "__cdecl16far", CP, [("v", I), ("s", CP), ("radix", I)], ret_regs=("DX","AX"))
    set_stack_func("1000:44ec", "fgetc", "__cdecl16far", I, [("f", VP)])
    set_stack_func("1000:4126", "fopen", "__cdecl16far", VP, [("name", CP), ("mode", CP)], ret_regs=("DX","AX"))
    set_stack_func("1000:3e07", "fclose", "__cdecl16far", I, [("f", VP)])

    mem = program.getMemory()
    removed = 0
    for f in list(fm.getFunctions(True)):
        nm = str(f.getName())
        if nm.startswith("caseD") or nm.startswith("switchD"):
            ep = f.getEntryPoint()
            b = [mem.getByte(ep) & 0xff, mem.getByte(ep.add(1)) & 0xff, mem.getByte(ep.add(2)) & 0xff]
            if not (b[0] == 0x55 and b[1] == 0x8b and b[2] == 0xec):
                fm.removeFunction(f.getEntryPoint())
                removed += 1
    print("removed pseudo functions:", removed)

    missed = ["2000:4fe7", "3000:6a6a", "3000:703c", "5000:0176", "5000:06e7", "5000:0cc2",
              "5120:0805", "5120:08d1", "5120:09d9", "5120:1013", "5120:1826"]
    for m in missed:
        a = addr(m)
        if a is None:
            print("bad addr", m); continue
        if fm.getFunctionContaining(a) is None:
            DisassembleCommand(a, None, True).applyTo(program, monitor)
            CreateFunctionCmd(a).applyTo(program, monitor)

    n = 0
    for f in list(fm.getFunctions(True)):
        ep = f.getEntryPoint()
        CreateFunctionCmd(None, ep, None, SourceType.DEFAULT, False, True).applyTo(program, monitor)
        n += 1
    print("recreated bodies:", n)

if __name__ == "__main__":
    main()
