"""Rebuild the Ghidra analysis of dunsmall_calls.exe.

Import as 16-bit real mode, point DS at DGROUP so the BASIC variables read as
`DAT_2000_xxxx`, name the run-time call stubs `unthunk.py` planted, disassemble
from the entry point and from every near-call target the walk found, then
analyze.  Seeding the disassembly matters: Ghidra's own entry-point analysis
finds only a fraction of the module, because compiled QuickBASIC reaches most of
its procedures through the run-time rather than through instructions Ghidra can
follow.

The Moraff's Revenge counterpart of `mw-tools/decomp/ghidra-scripts/build.py`.

    REV_WORK=<dir with dunsmall_calls.exe> python3 build.py [project-name]
"""
import os
import struct
import sys
import time

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gh import SCRATCH, PROJ_DIR, PROGRAM          # noqa: E402  (starts the JVM)

PROJ_NAME = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("REV_PROJ", "revrebuild")
LANG_ID = "x86:LE:16:Real Mode"
BINARY = os.path.join(SCRATCH, PROGRAM)

CODE_SEGMENT = 0x1000
DGROUP_SEGMENT = 0x2000  # DS for the whole module
CODE_END = 0x0C8B0
ENTRY = 0x30

from ghidra.app.plugin.core.analysis import AutoAnalysisManager
from ghidra.base.project import GhidraProject
from ghidra.program.model.lang import LanguageID
from ghidra.program.model.listing import Program
from ghidra.program.util import DefaultLanguageService
from ghidra.util.task import ConsoleTaskMonitor

monitor = ConsoleTaskMonitor()


def java_file(path):
    from java.io import File
    return File(path)


def main():
    language = DefaultLanguageService.getLanguageService().getLanguage(LanguageID(LANG_ID))
    import shutil
    for path in (os.path.join(PROJ_DIR, PROJ_NAME + ".rep"), os.path.join(PROJ_DIR, PROJ_NAME + ".gpr")):
        if os.path.isdir(path):
            shutil.rmtree(path)
        elif os.path.exists(path):
            os.remove(path)
    project = GhidraProject.createProject(PROJ_DIR, PROJ_NAME, False)
    program = project.importProgram(java_file(BINARY), language, language.getDefaultCompilerSpec())
    print("imported:", program.getName(), program.getExecutableFormat())

    txid = program.startTransaction("rebuild")
    ok = False
    try:
        for block in program.getMemory().getBlocks():
            print("BLOCK %-14s %s - %s size=%d init=%s"
                  % (block.getName(), block.getStart(), block.getEnd(),
                     block.getSize(), block.isInitialized()))
        disable_analyzers(program)
        set_data_segment(program)
        name_stubs(program)
        seed_disassembly(program)
        sign_stubs(program)
        label_literals(program)
        started = time.time()
        analyze(program)
        print("analyzeAll took %.1fs, %d functions"
              % (time.time() - started, program.getFunctionManager().getFunctionCount()))
        drop_stray_functions(program)
        print("functions after cleanup: %d" % program.getFunctionManager().getFunctionCount())
        ok = True
    finally:
        program.endTransaction(txid, ok)
    project.saveAs(program, "/", os.path.basename(BINARY), True)
    project.close()
    print("saved")


def disable_analyzers(program):
    options = program.getOptions(Program.ANALYSIS_PROPERTIES)
    for name in ("Non-Returning Functions - Discovered", "Non-Returning Functions - Known"):
        try:
            options.setBoolean(name, False)
        except Exception as exc:
            print("could not disable", name, exc)


def code_address(program, offset):
    """An address on the code page.  The string form avoids the ambiguity
    between SegmentedAddressSpace.getAddress(int, int) and its inherited
    getAddress(long, boolean), which JPype cannot resolve."""
    return program.getAddressFactory().getAddress("%04x:%04x" % (CODE_SEGMENT, offset))


def set_data_segment(program):
    """DS holds DGROUP for the whole module, so tell the decompiler that."""
    from ghidra.program.model.lang import RegisterValue
    from java.math import BigInteger
    context = program.getProgramContext()
    ds = context.getRegister("DS")
    memory = program.getMemory()
    value = RegisterValue(ds, BigInteger.valueOf(DGROUP_SEGMENT))
    for block in memory.getBlocks():
        context.setRegisterValue(block.getStart(), block.getEnd(), value)
    print("DS = %04x over the whole image" % DGROUP_SEGMENT)


def stub_list():
    path = os.path.join(SCRATCH, os.path.splitext(PROGRAM)[0] + ".stubs")
    for line in open(path):
        offset, name = line.split()
        yield int(offset, 16), name


def name_stubs(program):
    """Give each run-time stub its `qb3f_7b` name and make it a function."""
    from ghidra.app.cmd.disassemble import DisassembleCommand
    from ghidra.program.model.symbol import SourceType
    from ghidra.app.cmd.function import CreateFunctionCmd
    count = 0
    for offset, name in stub_list():
        where = code_address(program, offset)
        DisassembleCommand(where, None, True).applyTo(program, monitor)
        CreateFunctionCmd(name, where, None, SourceType.USER_DEFINED).applyTo(program, monitor)
        function = program.getFunctionManager().getFunctionAt(where)
        if function is not None:
            function.setName(name, SourceType.USER_DEFINED)
            count += 1
    print("named %d run-time stubs" % count)


# The registers a compiled BASIC statement loads before it calls the run-time.
# AX also arrives on the stack for some routines, and a few take a far pointer in
# ES:BX, but these five carry the operands that identify what the statement is
# working on -- above all SI and DI, which hold DGROUP offsets.
STUB_REGISTERS = ("AX", "BX", "DX", "SI", "DI")


def sign_stubs(program):
    """Declare the run-time stubs as taking their operands in registers.

    Without this the decompiler sees a call that reads nothing, deletes the
    `mov si,0B7D0h` in front of it as a dead store, and prints `qb3f_7b()` --
    the control flow survives but every operand is gone.

    The values the run-time hands *back* are not modelled: the stubs are
    declared void, so the decompiler wrongly believes AX and BX survive a call.
    Read a returned value out of the disassembly, not out of the C.
    """
    from ghidra.program.model.data import WordDataType, VoidDataType
    from ghidra.program.model.listing import Function, ParameterImpl, ReturnParameterImpl, VariableStorage
    from ghidra.program.model.symbol import SourceType
    from java.util import ArrayList
    context = program.getProgramContext()
    word = WordDataType.dataType
    signed = 0
    for offset, name in stub_list():
        function = program.getFunctionManager().getFunctionAt(code_address(program, offset))
        if function is None:
            continue
        parameters = ArrayList()
        for register in STUB_REGISTERS:
            parameters.add(ParameterImpl(register.lower(), word,
                                         VariableStorage(program, context.getRegister(register)),
                                         program))
        function.updateFunction(None, ReturnParameterImpl(VoidDataType.dataType, program),
                                parameters, Function.FunctionUpdateType.CUSTOM_STORAGE,
                                True, SourceType.USER_DEFINED)
        signed += 1
    print("gave %d run-time stubs a register signature" % signed)


# `<length word><offset word><text>`: how the compiler stores a string literal.
# The offset field is the text's run-time address, which is DGROUP_LOAD above its
# position in the file -- see relayout.py.
DGROUP_LOAD = 0xB690
DGROUP_SEGMENT_BASE = 0x1000   # DGROUP's page in the file, before Ghidra's base


def label_literals(program):
    """Name every string literal descriptor after the string it points at.

    The compiled code never mentions a literal's text; it passes the address of
    the four-byte descriptor in front of it.  Labelling the descriptors is what
    turns `qb3e_84(..,0xd040,..)` into `qb3e_84(..,&lit_ITS_HEALTH_POINTS,..)`,
    and it is the single change that makes the decompilation navigable.
    """
    import re
    import struct
    from ghidra.program.model.symbol import SourceType
    # The data image as relayout.py placed it: past the MZ header, past the code
    # page, past the DGROUP variables the file does not carry.
    blob = open(BINARY, "rb").read()
    header = struct.unpack("<H", blob[8:10])[0] * 16
    data = blob[header + DGROUP_SEGMENT_BASE * 16 + DGROUP_LOAD:]
    table = program.getSymbolTable()
    space = program.getAddressFactory()
    labelled = 0
    for i in range(len(data) - 4):
        length, offset = struct.unpack("<HH", data[i:i + 4])
        if not (1 <= length <= 120 and i + 4 + length <= len(data)):
            continue
        if offset != i + 4 + DGROUP_LOAD:
            continue
        text = data[i + 4:i + 4 + length]
        if not all(32 <= c < 127 for c in text):
            continue
        name = re.sub(r"[^A-Za-z0-9]+", "_", text.decode("ascii")).strip("_")[:40]
        where = space.getAddress("%04x:%04x" % (DGROUP_SEGMENT, i + DGROUP_LOAD))
        table.createLabel(where, "lit_" + (name or "empty"), SourceType.USER_DEFINED)
        labelled += 1
    print("labelled %d string literals" % labelled)


def drop_stray_functions(program):
    """Remove the functions Ghidra invents in the padding above the code.

    `relayout.py` pads the code page out to 64 KB and `unthunk.py` puts the
    run-time stubs at D000; everything else up there is zero, and a function
    Ghidra starts in it runs for thousands of `add [bx+si],al` before the
    decompiler gives up.
    """
    manager = program.getFunctionManager()
    stubs = {offset for offset, _ in stub_list()}
    doomed = []
    for function in manager.getFunctions(True):
        entry = function.getEntryPoint()
        if entry.getSegment() != CODE_SEGMENT:
            continue
        offset = entry.getSegmentOffset()
        if offset >= CODE_END and offset not in stubs:
            doomed.append(entry)
    for entry in doomed:
        manager.removeFunction(entry)
    print("dropped %d functions from the padding" % len(doomed))


def seed_disassembly(program):
    """Disassemble from the entry point and every call target `unthunk.py` found.

    Ghidra's own flow analysis reaches only part of the module, because compiled
    QuickBASIC hands control to procedures through the run-time rather than
    through instructions Ghidra can follow.  The seed list is written before the
    thunks are rewritten, when the game's own procedures can still be told apart
    from the run-time stubs.
    """
    from ghidra.app.cmd.disassemble import DisassembleCommand
    from ghidra.app.cmd.function import CreateFunctionCmd
    from ghidra.program.model.symbol import SourceType
    path = os.path.join(SCRATCH, os.path.splitext(PROGRAM)[0] + ".seeds")
    seeds = [int(line, 16) for line in open(path)]
    for offset in seeds:
        where = code_address(program, offset)
        DisassembleCommand(where, None, True).applyTo(program, monitor)
        CreateFunctionCmd(None, where, None, SourceType.ANALYSIS).applyTo(program, monitor)
    print("seeded disassembly at %d addresses" % len(seeds))


def analyze(program):
    manager = AutoAnalysisManager.getAnalysisManager(program)
    manager.initializeOptions()
    manager.reAnalyzeAll(None)
    manager.startAnalysis(monitor)


if __name__ == "__main__":
    main()
