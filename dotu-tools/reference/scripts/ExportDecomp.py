# Ghidra Jython script: export decompiled C for all functions + string xrefs
# @category Export
import os
from ghidra.app.decompiler import DecompInterface, DecompileOptions
from ghidra.util.task import ConsoleTaskMonitor
from ghidra.program.model.symbol import RefType

outdir = os.environ.get("UNF_OUT", "/home/claude/unf/ghidra_out")
if not os.path.isdir(outdir):
    os.makedirs(outdir)

prog = currentProgram
fm = prog.getFunctionManager()
listing = prog.getListing()
mem = prog.getMemory()
refmgr = prog.getReferenceManager()

# ---- 1. strings with xrefs ----
with open(os.path.join(outdir, "strings_xrefs.txt"), "w") as f:
    for d in listing.getDefinedData(True):
        dt = d.getDataType().getName().lower()
        if "string" in dt or dt in ("char", "ds"):
            try:
                val = d.getValue()
            except:
                val = None
            if val is None:
                continue
            s = str(val)
            refs = refmgr.getReferencesTo(d.getAddress())
            callers = []
            for r in refs:
                fa = fm.getFunctionContaining(r.getFromAddress())
                callers.append("%s@%s" % (fa.getName() if fa else "?", r.getFromAddress()))
            f.write("%s\t%r\t%s\n" % (d.getAddress(), s, ",".join(callers)))

# ---- 2. decompile every function ----
di = DecompInterface()
opts = DecompileOptions()
di.setOptions(opts)
di.openProgram(prog)
monitor = ConsoleTaskMonitor()

funcs = list(fm.getFunctions(True))
with open(os.path.join(outdir, "decomp_all.c"), "w") as f, open(os.path.join(outdir, "functions.txt"), "w") as fl:
    for fn in funcs:
        ep = fn.getEntryPoint()
        callers = set()
        for r in refmgr.getReferencesTo(ep):
            c = fm.getFunctionContaining(r.getFromAddress())
            if c:
                callers.add(c.getName())
        body = fn.getBody()
        fl.write("%s\t%s\tsize=%d\tcallers=%s\n" % (ep, fn.getName(), body.getNumAddresses(), ",".join(sorted(callers))))
        res = di.decompileFunction(fn, 120, monitor)
        f.write("\n// ==== %s @ %s (size %d) callers: %s\n" % (fn.getName(), ep, body.getNumAddresses(), ",".join(sorted(callers))))
        if res and res.decompileCompleted():
            f.write(res.getDecompiledFunction().getC())
        else:
            f.write("// DECOMPILE FAILED: %s\n" % (res.getErrorMessage() if res else "none"))
di.dispose()
print("exported %d functions" % len(funcs))
