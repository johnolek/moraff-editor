"""What is binary-specific about Moraff's World's `WORLD.EXE`: the DGROUP
segment, the Borland C++ 3.x runtime helpers whose signatures the decompiler
cannot infer, and any function Ghidra's analyzer does not find on its own.

`WORLD.EXE` is a medium-model program -- far code, near data -- so every pointer
here is two bytes and every function is `__cdecl16far`.  The helpers were
identified the way METHOD.md describes: `rand` by Borland's 0x015A4E35
multiplier (loaded as DX=0x015a, AX=0x4e35), the long-arithmetic helpers by
their register conventions, the rest by their libc code.

Addresses are in the re-laid layout `relayout.py` produces.
"""

DATA_SEGMENT = 0x6000

# How long each code segment really is, so the functions the analyzer invents in
# the bytes `relayout.py` copies past a segment's end can be thrown away again.
SEGMENT_LIMITS = {
    0x1000: 0x4c10,
    0x2000: 0xfe70,
    0x3000: 0xec20,
    0x4000: 0x4640,
    0x5000: 0x1080,
    0x5110: 0x00e0,
    0x5120: 0x2780,
    0x5400: 0x05d0,
}

# (address, name, return registers, [(parameter, type, registers)]) -- the long
# helpers, which take their arguments in registers and clean up after themselves.
REGISTER_HELPERS = [
    ("1000:12c8", "N_LXMUL", ("DX", "AX"), [("a", "long", ("DX", "AX")), ("b", "long", ("CX", "BX"))]),
    ("1000:13d6", "N_LXLSH", ("DX", "AX"), [("a", "long", ("DX", "AX")), ("n", "char", ("CL",))]),
    ("1000:13f7", "N_LXRSH", ("DX", "AX"), [("a", "long", ("DX", "AX")), ("n", "char", ("CL",))]),
]

# (address, name, convention, return type, [(parameter, type)], purge, return regs)
STACK_HELPERS = [
    # 1000:1328 is Borland's F_LDIV@; F_LUDIV@, F_LMOD@ and F_LUMOD@ are the
    # three following entry points into the same routine, each preceded by the
    # three-byte near-to-far stub (pop cx / push cs / push cx).
    ("1000:1328", "F_LDIV", "__stdcall16far", "long", [("a", "long"), ("b", "long")], 8, None),
    ("1000:132f", "F_LUDIV", "__stdcall16far", "long", [("a", "long"), ("b", "long")], 8, None),
    ("1000:1337", "F_LMOD", "__stdcall16far", "long", [("a", "long"), ("b", "long")], 8, None),
    ("1000:133f", "F_LUMOD", "__stdcall16far", "long", [("a", "long"), ("b", "long")], 8, None),
    ("1000:115b", "ftol", "__cdecl16far", "long", [("x", "double")], None, ("DX", "AX")),
    ("1000:0f28", "pow", "__cdecl16far", "double", [("x", "double"), ("y", "double")], None, ("ST0",)),
    ("1000:1696", "srand", "__cdecl16far", "void", [("seed", "unsigned")], None, None),
    ("1000:16a7", "rand", "__cdecl16far", "int", [], 0, None),
    ("1000:2aee", "kbhit", "__cdecl16far", "int", [], 0, None),
    ("1000:28b4", "getch", "__cdecl16far", "int", [], 0, None),
    ("1000:3306", "sound", "__cdecl16far", "void", [("hz", "int")], None, None),
    ("1000:34d9", "fclose", "__cdecl16far", "int", [("f", "void *")], None, None),
    ("1000:3796", "fopen", "__cdecl16far", "void *", [("name", "char *"), ("mode", "char *")], None, None),
    ("1000:182b", "time", "__cdecl16far", "long", [("t", "void *")], None, ("DX", "AX")),
    ("1000:18a4", "toupper", "__cdecl16far", "int", [("c", "int")], None, None),
    ("1000:2c6c", "malloc", "__cdecl16far", "void *", [("size", "unsigned")], 0, None),
    ("1000:38a2", "fread", "__cdecl16far", "int",
     [("p", "void *"), ("size", "int"), ("n", "int"), ("f", "void *")], None, None),
    ("1000:3a79", "fwrite", "__cdecl16far", "int",
     [("p", "void *"), ("size", "int"), ("n", "int"), ("f", "void *")], None, None),
    ("1000:3b5c", "fgetc", "__cdecl16far", "int", [("f", "void *")], None, None),
    ("1000:3c74", "itoa", "__cdecl16far", "char *", [("v", "int"), ("s", "char *"), ("radix", "int")], None, None),
    ("1000:3f3b", "fputc", "__cdecl16far", "int", [("c", "int"), ("f", "void *")], None, None),
    ("1000:4432", "strcat", "__cdecl16far", "char *", [("dst", "char *"), ("src", "char *")], None, ("AX",)),
    ("1000:44d0", "strcpy", "__cdecl16far", "char *", [("dst", "char *"), ("src", "char *")], None, ("AX",)),
    ("1000:44f2", "strlen", "__cdecl16far", "int", [("s", "char *")], None, None),
]

# Functions the analyzer leaves as unreachable code.  3000:000d is the first
# function of the character-creation segment; nothing references it directly, so
# only the protected-mode build finds it on its own.
MISSED_FUNCTIONS = [
    "3000:000d",
]
