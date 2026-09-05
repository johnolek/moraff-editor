# Ghidra post-script for a fresh -noanalysis import: disable bad analyzers,
# resolve Borland jump tables, then run full auto-analysis.
# @category Setup
for o in ["Non-Returning Functions - Discovered", "Non-Returning Functions - Known"]:
    try:
        setAnalysisOption(currentProgram, o, "false"); print("disabled", o)
    except Exception as e:
        print("could not set", o, e)
# Ghidra Jython post-script: resolve Borland "jmp word ptr cs:[bx+disp]" jump tables
# by adding COMPUTED_JUMP references to every case target, then rebuild function bodies.
# @category Fixup
import re
from ghidra.program.model.symbol import SourceType, RefType
from ghidra.app.cmd.function import CreateFunctionCmd

prog = currentProgram
mem = prog.getMemory()
fm = prog.getFunctionManager()
refmgr = prog.getReferenceManager()
af = prog.getAddressFactory()
listing = prog.getListing()

def addr(seg, off):
    return af.getAddress("%04x:%04x" % (seg, off & 0xffff))

# read the whole code region once
blocks = list(mem.getBlocks())
fixed = 0
for blk in blocks:
    start = blk.getStart()
    size = blk.getSize()
    if size > 0x40000 or not blk.getName().startswith("CODE") or not blk.isInitialized():
        continue
    from jarray import zeros
    data = zeros(size, 'b')
    try:
        blk.getBytes(start, data)
    except Exception as e:
        print("getBytes failed for block", blk.getName(), e)
        continue
    raw = ''.join(chr(b & 0xff) for b in data)
    print("scanning block", blk.getName(), start, size)
    for m in re.finditer(b'\x2e\xff\xa7(..)', raw, re.S):
        off = m.start()
        disp = ord(m.group(1)[0]) | (ord(m.group(1)[1]) << 8)
        jmp_addr = start.add(off)
        # find count from preceding cmp bx, imm8 / imm16 within 16 bytes
        back = raw[max(0, off - 16):off]
        cnt = None
        mm = list(re.finditer(b'\x83\xfb(.)', back, re.S))
        if mm:
            cnt = ord(mm[-1].group(1)) + 1
        mm2 = list(re.finditer(b'\x81\xfb(..)', back, re.S))
        if mm2:
            cnt = (ord(mm2[-1].group(1)[0]) | (ord(mm2[-1].group(1)[1]) << 8)) + 1
        if cnt is None or cnt > 64:
            print("skip switch at", jmp_addr, "cnt", cnt)
            continue
        cs = jmp_addr.getSegment()
        table = af.getAddress("%04x:%04x" % (cs, disp & 0xffff))
        ins = listing.getInstructionAt(jmp_addr)
        if ins is None:
            disassemble(jmp_addr)
            ins = listing.getInstructionAt(jmp_addr)
        if ins is None:
            print("no instruction at", jmp_addr)
            continue
        targets = []
        for i in range(cnt):
            ta = table.add(2 * i)
            lo = mem.getByte(ta) & 0xff
            hi = mem.getByte(ta.add(1)) & 0xff
            t = af.getAddress("%04x:%04x" % (cs, lo | (hi << 8)))
            targets.append(t)
        # clear existing refs from jmp, add computed jumps
        for r in refmgr.getReferencesFrom(jmp_addr):
            refmgr.delete(r)
        for t in targets:
            refmgr.addMemoryReference(jmp_addr, t, RefType.COMPUTED_JUMP, SourceType.USER_DEFINED, 0)
            if listing.getInstructionAt(t) is None:
                disassemble(t)
        # mark table as data (words) so it is not disassembled
        try:
            listing.clearCodeUnits(table, table.add(2 * cnt - 1), False)
            from ghidra.program.model.data import WordDataType, ArrayDataType
            listing.createData(table, ArrayDataType(WordDataType.dataType, cnt, 2))
        except Exception as e:
            print("table data err", table, e)
        fixed += 1
        print("switch at %s: table %s x%d -> %s" % (jmp_addr, table, cnt, ",".join(str(t) for t in targets)))

print("fixed switches:", fixed)


analyzeAll(prog)
print("Setup done")
