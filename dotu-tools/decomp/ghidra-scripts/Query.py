# Query listing state around given addresses (env UNF_Q="seg:off,seg:off")
# @category Debug
import os
prog = currentProgram
listing = prog.getListing()
refmgr = prog.getReferenceManager()
fm = prog.getFunctionManager()
af = prog.getAddressFactory()
for spec in os.environ.get("UNF_Q", "").split(","):
    if not spec: continue
    a = af.getAddress(spec)
    print("=== %s" % a)
    f = fm.getFunctionContaining(a)
    if f:
        print("in function %s body=%s" % (f.getName(), f.getBody()))
    cu = listing.getCodeUnitAt(a)
    n = 0
    while cu is not None and n < 12:
        print("  %s  %s  refs->%s" % (cu.getAddress(), cu, [str(r.getToAddress()) + ":" + str(r.getReferenceType()) for r in refmgr.getReferencesFrom(cu.getAddress())]))
        cu = listing.getCodeUnitAfter(cu.getAddress())
        n += 1
