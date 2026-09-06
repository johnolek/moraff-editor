# Ghidra Jython post-script: apply Borland C++ 3.x large-model runtime helper
# signatures (register args / callee-cleanup), remove bogus case-label functions,
# and re-create function bodies so the decompiler's stack tracking works.
# @category Fixup
from ghidra.program.model.symbol import SourceType
from ghidra.program.model.listing import ParameterImpl, ReturnParameterImpl, VariableStorage, Function
from ghidra.program.model.data import ShortDataType, UnsignedShortDataType, LongDataType, IntegerDataType, UnsignedIntegerDataType, DoubleDataType, CharDataType, PointerDataType, VoidDataType, DataType, FloatDataType
from ghidra.program.model.lang import Register
from ghidra.app.cmd.function import CreateFunctionCmd
from ghidra.program.model.address import AddressSet
from jarray import array as jarray_array

prog = currentProgram
fm = prog.getFunctionManager()
af = prog.getAddressFactory()
lang = prog.getLanguage()

def addr(s):
    return af.getAddress(s)

def reg(name):
    return lang.getRegister(name)

def storage(*regs):
    return VariableStorage(prog, jarray_array([reg(r) for r in regs], Register))

def ensure_func(a, name):
    f = fm.getFunctionAt(a)
    if f is None:
        cmd = CreateFunctionCmd(a)
        cmd.applyTo(prog)
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
    ps = []
    for (pname, ptype, regs) in params:
        ps.append(ParameterImpl(pname, ptype, storage(*regs), prog))
    ret = ReturnParameterImpl(LongDataType.dataType, storage(*ret_regs), prog) if ret_regs else None
    if ret is not None:
        f.updateFunction("__cdecl16far", ret, ps, Function.FunctionUpdateType.CUSTOM_STORAGE, True, SourceType.USER_DEFINED)
    else:
        f.updateFunction("__cdecl16far", None, ps, Function.FunctionUpdateType.CUSTOM_STORAGE, True, SourceType.USER_DEFINED)
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
        off = 4  # stack offset of first param relative to SP at entry (far return address)
        for (pn, pt) in params:
            sz = pt.getLength() if pt.getLength() > 0 else 2
            ps.append(ParameterImpl(pn, pt, VariableStorage(prog, off, sz), prog))
            off += max(2, sz)
        ret = ReturnParameterImpl(ret_type, storage(*ret_regs), prog)
        f.updateFunction(conv, ret, ps, Function.FunctionUpdateType.CUSTOM_STORAGE, True, SourceType.USER_DEFINED)
    else:
        ps = [ParameterImpl(pn, pt, prog) for (pn, pt) in params]
        ret = ReturnParameterImpl(ret_type, prog)
        f.updateFunction(conv, ret, ps, Function.FunctionUpdateType.DYNAMIC_STORAGE_ALL_PARAMS, True, SourceType.USER_DEFINED)
    if purge is not None:
        f.setStackPurgeSize(purge)
    print("set", name, f.getSignature())

L = LongDataType.dataType
I = ShortDataType.dataType
U = UnsignedShortDataType.dataType
D = DoubleDataType.dataType
V = VoidDataType.dataType
CP = PointerDataType(CharDataType.dataType, 4)   # far char*
VP = PointerDataType(VoidDataType.dataType, 4)

# long helpers with stack args, callee pops 8
for a, n in (("1000:1558", "N_LDIV"), ("1000:155f", "N_LUDIV"), ("1000:1567", "N_LMOD"), ("1000:156f", "N_LUMOD")):
    set_stack_func(a, n, "__stdcall16far", L, [("a", L), ("b", L)], purge=8)

# register-based helpers
set_reg_func("1000:14f8", "N_LXMUL", ("DX", "AX"), [("a", L, ("DX", "AX")), ("b", L, ("CX", "BX"))])
set_reg_func("1000:1606", "N_LXLSH", ("DX", "AX"), [("a", L, ("DX", "AX")), ("n", CharDataType.dataType, ("CL",))])
set_reg_func("1000:1627", "N_LXRSH", ("DX", "AX"), [("a", L, ("DX", "AX")), ("n", CharDataType.dataType, ("CL",))])

# libc
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

# remove bogus switch-case pseudo functions
removed = 0
for f in list(fm.getFunctions(True)):
    if f.getName().startswith("caseD") or f.getName().startswith("switchD"):
        # only remove if it does not start with push bp / mov bp,sp
        mem = prog.getMemory(); ep = f.getEntryPoint()
        b = [mem.getByte(ep) & 0xff, mem.getByte(ep.add(1)) & 0xff, mem.getByte(ep.add(2)) & 0xff]
        if not (b[0] == 0x55 and b[1] == 0x8b and b[2] == 0xec):
            fm.removeFunction(f.getEntryPoint())
            removed += 1
print("removed pseudo functions:", removed)

# create functions at known prologues that were missed
missed = ["2000:4fe7", "3000:6a6a", "3000:703c", "5000:0176", "5000:06e7", "5000:0cc2",
          "5120:0805", "5120:08d1", "5120:09d9", "5120:1013", "5120:1826"]
for m in missed:
    a = addr(m)
    if fm.getFunctionContaining(a) is None:
        disassemble(a)
        CreateFunctionCmd(a).applyTo(prog)

# re-create every function body (recreate=True re-follows flow)
n = 0
for f in list(fm.getFunctions(True)):
    ep = f.getEntryPoint()
    cmd = CreateFunctionCmd(None, ep, None, SourceType.DEFAULT, False, True)
    cmd.applyTo(prog)
    n += 1
print("recreated bodies:", n)

analyzeChanges(prog)
print("FixBorland done")
