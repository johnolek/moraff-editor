"""The same analysis as build.py, but with the image laid out as
x86:LE:16:Protected Mode -- one memory block per segment page -- so that a
constant far pointer to the video BIOS at C000:0010 has a representable address.

Five of the SVGA bank-switch helpers build that pointer, and in real mode the
decompiler aborts on the whole function with `AddressOutOfBoundsException:
Offset must be between 0x0 and 0x10ffef, got 0xc0000010`.  In protected mode an
address is `(segment << 16) | offset`, so 0xc0000010 is legal and the five
decompile.  Nothing else about the analysis changes.

Ghidra's MZ loader refuses the page-sparse layout in protected mode ("Blocks are
not contiguous"), so the blocks are cut by hand, and the hand-built program has
to do three things the loader would have done: apply the relocations, set the CS
and DS register context, and create the BSS block after the image.
"""
import os
import struct
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build
from build import (SCRATCH, BINARY, monitor, blocks, disable_analyzers, fix_switches,
                   analyze_all, analyze_changes, fix_borland, get_language)
import runtime
import jpype
from ghidra.program.database import ProgramDB
from ghidra.base.project import GhidraProject
from ghidra.program.model.symbol import SourceType
from java.io import ByteArrayInputStream
from java.lang import Object

PROJ_NAME = os.environ.get("MW_PROJ_PM", "mwprot")
LOAD_SEGMENT = 0x1000   # what Ghidra's MzLoader uses, so seg:off matches the real-mode project

# segment -> (image start, image end), cut where the real-mode blocks were cut
LAYOUT = [(0x1000, 0x00000, 0x10000), (0x2000, 0x10000, 0x20000), (0x3000, 0x20000, 0x30000),
          (0x4000, 0x30000, 0x40000), (0x5000, 0x40000, 0x41100), (0x5110, 0x41100, 0x41200),
          (0x5120, 0x41200, 0x44000), (0x5400, 0x44000, 0x50000), (0x6000, 0x50000, None)]


def jbytes(data):
    return jpype.JArray(jpype.JByte)([b - 256 if b > 127 else b for b in data])


def set_segment_registers(program, blk, segment):
    from java.math import BigInteger
    context = program.getProgramContext()
    for name, value in (("CS", segment), ("DS", runtime.DATA_SEGMENT)):
        context.setValue(program.getRegister(name), blk.getStart(), blk.getEnd(),
                         BigInteger.valueOf(value))


def main():
    import shutil
    import time
    for path in (os.path.join(SCRATCH, PROJ_NAME + ".rep"), os.path.join(SCRATCH, PROJ_NAME + ".gpr")):
        if os.path.isdir(path):
            shutil.rmtree(path)
        elif os.path.exists(path):
            os.remove(path)

    lang = get_language("x86:LE:16:Protected Mode")
    consumer = Object()
    program = ProgramDB(os.path.basename(BINARY), lang, lang.getDefaultCompilerSpec(), consumer)
    txid = program.startTransaction("build")
    ok = False
    try:
        raw = open(BINARY, "rb").read()
        header = struct.unpack("<14H", raw[:28])
        image = bytearray(raw[header[4] * 16:])
        nreloc, reloff = header[3], header[12]
        for i in range(nreloc):
            off, seg = struct.unpack("<HH", raw[reloff + 4 * i: reloff + 4 * i + 4])
            at = seg * 16 + off
            value = struct.unpack_from("<H", image, at)[0]
            struct.pack_into("<H", image, at, (value + LOAD_SEGMENT) & 0xffff)
        print("relocations applied:", nreloc)

        af = program.getAddressFactory()
        mem = program.getMemory()
        for i, (segment, start, end) in enumerate(LAYOUT):
            chunk = image[start:end] if end is not None else image[start:]
            blk = mem.createInitializedBlock("CODE_%d" % i, af.getAddress("%04x:0000" % segment),
                                             ByteArrayInputStream(jbytes(chunk)), len(chunk),
                                             monitor, False)
            blk.setExecute(True)
            blk.setWrite(True)
            set_segment_registers(program, blk, segment)
        bss_start = af.getAddress("%04x:%04x" % (runtime.DATA_SEGMENT, len(image) - LAYOUT[-1][1]))
        bss = mem.createUninitializedBlock("DATA", bss_start, header[5] * 16, False)
        bss.setWrite(True)
        set_segment_registers(program, bss, runtime.DATA_SEGMENT)

        entry = af.getAddress("%04x:%04x" % (header[11] + LOAD_SEGMENT, header[10]))
        program.getSymbolTable().createLabel(entry, "entry", SourceType.IMPORTED)
        program.getSymbolTable().addExternalEntryPoint(entry)
        blocks(program)
        print("entry:", entry)
        disable_analyzers(program)
        fix_switches(program)
        started = time.time()
        analyze_all(program)
        print("analyzeAll took %.1fs, functions: %d"
              % (time.time() - started, program.getFunctionManager().getFunctionCount()))
        fix_borland(program)
        analyze_changes(program)
        print("functions after FixBorland:", program.getFunctionManager().getFunctionCount())
        ok = True
    finally:
        program.endTransaction(txid, ok)
    project = GhidraProject.createProject(SCRATCH, PROJ_NAME, False)
    project.saveAs(program, "/", os.path.basename(BINARY), True)
    print("saved")
    # The hand-built ProgramDB has two consumers by now (this script and the
    # project), and closing the project releases one it does not recognise.
    try:
        program.release(consumer)
        project.close()
    except Exception as exc:
        print("closing the project:", exc)


main()
