"""Same analysis as build.py, but the image is laid out as x86:LE:16:Protected Mode:
one memory block per 64 KB segment page, so a constant far pointer (C000:0010, the
video BIOS) has a representable address.  Ghidra's MzLoader refuses this layout
("Blocks are not contiguous"), so the blocks are cut by hand from the load image."""
import os, struct, sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
import build
from build import (SCRATCH, BINARY, monitor, blocks, disable_analyzers, fix_switches,
                   analyze_all, analyze_changes, fix_borland, get_language)
import jpype
from ghidra.program.database import ProgramDB
from ghidra.base.project import GhidraProject
from ghidra.program.model.symbol import SourceType
from java.io import ByteArrayInputStream
from java.lang import Object

PROJ_NAME = "unfprot"
LOAD_SEGMENT = 0x1000   # what Ghidra's MzLoader uses, so seg:off matches the real-mode project

# segment -> (image start, image end), cut where the real-mode blocks were cut
LAYOUT = [(0x1000, 0x00000, 0x10000), (0x2000, 0x10000, 0x20000), (0x3000, 0x20000, 0x30000),
          (0x4000, 0x30000, 0x40000), (0x5000, 0x40000, 0x41100), (0x5110, 0x41100, 0x41200),
          (0x5120, 0x41200, 0x44000), (0x5400, 0x44000, 0x50000), (0x6000, 0x50000, None)]

def jbytes(bs):
    return jpype.JArray(jpype.JByte)([b - 256 if b > 127 else b for b in bs])

def set_segment_registers(program, blk, seg):
    """MzLoader tracks CS per segment and DS across the image; the hand-built
    protected-mode program has to do the same or near data references never
    resolve to the data segment."""
    from java.math import BigInteger
    pc = program.getProgramContext()
    for name, val in (("CS", seg), ("DS", 0x6000)):
        pc.setValue(program.getRegister(name), blk.getStart(), blk.getEnd(), BigInteger.valueOf(val))

def main():
    import shutil, time
    for p in (os.path.join(SCRATCH, PROJ_NAME + ".rep"), os.path.join(SCRATCH, PROJ_NAME + ".gpr")):
        if os.path.isdir(p):
            shutil.rmtree(p)
        elif os.path.exists(p):
            os.remove(p)

    lang = get_language("x86:LE:16:Protected Mode")
    consumer = Object()
    program = ProgramDB("unf_pages.exe", lang, lang.getDefaultCompilerSpec(), consumer)
    txid = program.startTransaction("build")
    ok = False
    try:
        raw = open(BINARY, "rb").read()
        hdr = struct.unpack("<14H", raw[:28])
        image = bytearray(raw[hdr[4] * 16:])
        nrel, reloff = hdr[3], hdr[12]
        for i in range(nrel):
            off, seg = struct.unpack("<HH", raw[reloff + 4 * i: reloff + 4 * i + 4])
            at = seg * 16 + off
            val = struct.unpack_from("<H", image, at)[0]
            struct.pack_into("<H", image, at, (val + LOAD_SEGMENT) & 0xffff)
        print("relocations applied:", nrel)
        af = program.getAddressFactory()
        mem = program.getMemory()
        for i, (seg, a, b) in enumerate(LAYOUT):
            chunk = image[a:b] if b is not None else image[a:]
            addr = af.getAddress("%04x:0000" % seg)
            blk = mem.createInitializedBlock("CODE_%d" % i, addr, ByteArrayInputStream(jbytes(chunk)),
                                             len(chunk), monitor, False)
            blk.setExecute(True)
            blk.setWrite(True)
            set_segment_registers(program, blk, seg)
        # MzLoader also makes an uninitialized BSS block of minalloc paragraphs
        # right after the image; most of the game's globals live in it.
        bss_start = af.getAddress("6000:%04x" % (len(image) - LAYOUT[-1][1]))
        bss = mem.createUninitializedBlock("DATA", bss_start, hdr[5] * 16, False)
        bss.setWrite(True)
        set_segment_registers(program, bss, 0x6000)
        entry = af.getAddress("%04x:%04x" % (hdr[11] + LOAD_SEGMENT, hdr[10]))
        program.getSymbolTable().createLabel(entry, "entry", SourceType.IMPORTED)
        program.getSymbolTable().addExternalEntryPoint(entry)
        blocks(program)
        print("entry:", entry)
        disable_analyzers(program)
        fix_switches(program)
        t = time.time()
        analyze_all(program)
        print("analyzeAll took %.1fs, functions: %d" % (time.time() - t, program.getFunctionManager().getFunctionCount()))
        fix_borland(program)
        analyze_changes(program)
        print("functions after FixBorland:", program.getFunctionManager().getFunctionCount())
        ok = True
    finally:
        program.endTransaction(txid, ok)
    project = GhidraProject.createProject(SCRATCH, PROJ_NAME, False)
    project.saveAs(program, "/", "unf_pages.exe", True)
    program.release(consumer)
    project.close()
    print("saved")

main()
