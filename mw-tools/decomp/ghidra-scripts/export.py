import sys, os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from gh import *
from ghidra.app.decompiler import DecompInterface, DecompileOptions
from ghidra.util.task import ConsoleTaskMonitor

outdir = sys.argv[1] if len(sys.argv) > 1 else os.path.join(SCRATCH, "out")
if not os.path.isdir(outdir):
    os.makedirs(outdir)

project, prog = open_program(True)
fm = prog.getFunctionManager()
refmgr = prog.getReferenceManager()

di = DecompInterface()
opts = DecompileOptions()
di.setOptions(opts)
di.openProgram(prog)
monitor = ConsoleTaskMonitor()

funcs = list(fm.getFunctions(True))
nfail = 0
with open(os.path.join(outdir, "decomp_all.c"), "w") as f, open(os.path.join(outdir, "functions.txt"), "w") as fl:
    for fn in funcs:
        ep = fn.getEntryPoint()
        callers = set()
        for r in refmgr.getReferencesTo(ep):
            c = fm.getFunctionContaining(r.getFromAddress())
            if c:
                callers.add(str(c.getName()))
        body = fn.getBody()
        fl.write("%s\t%s\tsize=%d\tcallers=%s\n" % (ep, fn.getName(), body.getNumAddresses(), ",".join(sorted(callers))))
        res = di.decompileFunction(fn, 120, monitor)
        f.write("\n// ==== %s @ %s (size %d) callers: %s\n" % (fn.getName(), ep, body.getNumAddresses(), ",".join(sorted(callers))))
        if res and res.decompileCompleted():
            f.write(str(res.getDecompiledFunction().getC()))
        else:
            msg = str(res.getErrorMessage()) if res else "none"
            f.write("// DECOMPILE FAILED: %s\n" % msg)
            nfail += 1
            print("FAIL %s %s: %s" % (ep, fn.getName(), msg.strip()))
di.dispose()
project.close()
print("exported %d functions, %d failures -> %s" % (len(funcs), nfail, outdir))
