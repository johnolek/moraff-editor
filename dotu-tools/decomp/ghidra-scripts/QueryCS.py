# @category Debug
import os
prog = currentProgram
ctx = prog.getProgramContext()
af = prog.getAddressFactory()
cs = prog.getLanguage().getRegister("CS")
for spec in os.environ.get("UNF_Q", "").split(","):
    if not spec: continue
    a = af.getAddress(spec)
    v = ctx.getValue(cs, a, False)
    print("CS at %s = %s" % (a, hex(int(v)) if v is not None else None))
