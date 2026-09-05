# Emulate the game's palette builder (FUN_4000_12c3) with Ghidra's p-code emulator and
# dump the resulting 256-colour VGA palette for every module/section/water/town combination.
# Output: env UNF_PAL_OUT (JSON).  Run headless: -process unf_pages.exe -noanalysis -postScript EmuPalette.py
# @category Emu
import os, json
from ghidra.app.emulator import EmulatorHelper
from ghidra.pcode.emulate import BreakCallBack
from ghidra.program.model.address import Address

prog = currentProgram
af = prog.getAddressFactory()
mem = prog.getMemory()

DS = 0x6000
PAL = 0xc6eb            # 256 * 3 bytes of 6-bit RGB; entry i at c6eb + 3i
FUNC = "4000:12c3"      # set_palette
RET = "1000:0000"       # fake far return address (never executed)
STUBS = {               # far functions to skip: address -> AX value to return (or None)
    "1000:329a": None,  # int86() - here INT 10h palette writes
    "4000:10c2": None,  # push palette to the DAC
    "1000:18b6": 0x2000,  # rand(): fixed mid value -> random(15) = 3
}
# Borland long division helpers use `retf 8`, which Ghidra's real-mode sleigh mis-emulates
# (it lands in segment 0), so they are computed here instead: (name, signed, want_mod)
LONGDIV = {"1000:1558": (True, False), "1000:155f": (False, False), "1000:1567": (True, True), "1000:156f": (False, True)}

def s32(v):
    v &= 0xffffffff
    return v - 0x100000000 if v & 0x80000000 else v

def A(seg, off):
    return af.getAddress("%04x:%04x" % (seg, off & 0xffff))

def rd(emu, seg, off, n):
    b = emu.readMemory(A(seg, off), n)
    v = 0
    for i in range(n):
        v |= (b[i] & 0xff) << (8 * i)
    return v

def run_once(module, level, water, town, seed_ax=0x2000):
    emu = EmulatorHelper(prog)
    class SegCB(BreakCallBack):
        def pcodeCallback(self, op):
            ms = emu.getEmulator().getMemState()
            ins = op.getInputs()
            seg = ms.getValue(ins[1]); off = ms.getValue(ins[2])
            ms.setValue(op.getOutput(), ((seg & 0xffff) << 4) + (off & 0xffff))
            return True
    emu.registerCallOtherCallback("segment", SegCB())
    try:
        # registers
        emu.writeRegister("DS", DS); emu.writeRegister("ES", DS); emu.writeRegister("SS", DS)
        emu.writeRegister("SP", 0xff00)
        # globals the function reads
        w16 = lambda off, v: emu.writeMemoryValue(A(DS, off), 2, v)
        w8 = lambda off, v: emu.writeMemoryValue(A(DS, off), 1, v)
        w16(0x022d, module)         # module (dungeon) 0..4
        w16(0xc034, level)          # current floor
        w16(0xc6e9, 0x100)          # number of colours = 256
        w16(0xc6a8, 9)              # resmode (>5 = SVGA)
        w16(0x00c7, 0)              # not monochrome
        w16(0x031d, 1 if water else 0)
        w16(0x2505, 1 if town else 0)
        # fake far return address on the stack: push CS then IP (retf pops IP, CS)
        sp = 0xff00 - 4
        emu.writeRegister("SP", sp)
        ret = af.getAddress(RET)
        emu.writeMemoryValue(A(DS, sp), 2, 0x0000)      # IP
        emu.writeMemoryValue(A(DS, sp + 2), 2, 0x1000)  # CS
        # breakpoints
        for s in STUBS: emu.setBreakpoint(af.getAddress(s))
        for s in LONGDIV: emu.setBreakpoint(af.getAddress(s))
        emu.setBreakpoint(ret)
        # start
        start = af.getAddress(FUNC)
        emu.writeRegister(emu.getPCRegister(), start.getOffset())
        emu.writeRegister("CS", 0x4000)
        steps = 0
        while True:
            ok = emu.run(monitor)
            pc = emu.getExecutionAddress()
            steps += 1
            if pc.equals(ret):
                break
            key = str(pc)
            if key in LONGDIV:
                signed, want_mod = LONGDIV[key]
                sp = int(emu.readRegister("SP")) & 0xffff
                ip = rd(emu, DS, sp, 2); cs = rd(emu, DS, sp + 2, 2)
                a = rd(emu, DS, sp + 4, 4); b = rd(emu, DS, sp + 8, 4)
                if signed:
                    a, b = s32(a), s32(b)
                if b == 0:
                    r = 0
                else:
                    q = abs(a) // abs(b)
                    if (a < 0) != (b < 0): q = -q
                    r = (a - q * b) if want_mod else q
                r &= 0xffffffff
                emu.writeRegister("AX", r & 0xffff); emu.writeRegister("DX", (r >> 16) & 0xffff)
                emu.writeRegister("SP", sp + 12)
                emu.writeRegister("CS", cs)
                emu.writeRegister(emu.getPCRegister(), ((cs & 0xffff) << 4) + (ip & 0xffff))
                continue
            if key in STUBS:
                # emulate retf: pop IP, CS
                sp = int(emu.readRegister("SP")) & 0xffff
                ip = rd(emu, DS, sp, 2)
                cs = rd(emu, DS, sp + 2, 2)
                emu.writeRegister("SP", sp + 4)
                if STUBS[key] is not None:
                    emu.writeRegister("AX", STUBS[key])
                emu.writeRegister("CS", cs)
                emu.writeRegister(emu.getPCRegister(), ((cs & 0xffff) << 4) + (ip & 0xffff))
                continue
            if not ok or steps > 100000:
                print("stopped at %s after %d runs: %s" % (pc, steps, emu.getLastError()))
                break
        pal = []
        for i in range(256):
            r = rd(emu, DS, PAL + i * 3, 1)
            g = rd(emu, DS, PAL + i * 3 + 1, 1)
            b = rd(emu, DS, PAL + i * 3 + 2, 1)
            pal.append([r, g, b])
        return pal
    finally:
        emu.dispose()

out = {}
for module in range(5):
    for sec in range(4):
        level = 5 * (module + 1) * sec + 1
        section0 = module * 4 + sec
        water = section0 in (3, 7, 19)
        for town in (0, 1):
            key = "m%d_s%d_%s" % (module + 1, sec + 1, "town" if town else "dungeon")
            out[key] = run_once(module, level, water, town)
            print("done", key, out[key][32], out[key][17])
json.dump(out, open(os.environ.get("UNF_PAL_OUT", "/tmp/palettes.json"), "w"))
print("wrote palettes")
