"""The functions of Moraff's World's WORLD.EXE that have been identified.

Keyed by address in the re-laid layout `../decomp/ghidra-scripts/relayout.py`
produces: `(name, one-line purpose)`.  `../decomp/rename_mw.py` substitutes the
names into the decompilation, and the purposes become the trailing comment on
each function's header line.

Only the Borland C++ 3.x runtime is named so far, so 549 of the 580 functions
are still `FUN_`.
"""

KNOWN = {
    # ---- Borland C++ 3.x runtime (segment 1000).  `build.py` gives these their
    # signatures from `../decomp/ghidra-scripts/runtime.py`, so they already
    # carry the name in the decompilation; they are listed here for the catalog.
    "1000:0000": ("entry", "c0 startup: sets DS/SS, clears BSS, calls main"),
    "1000:0f28": ("pow", "libm pow(double, double)"),
    "1000:115b": ("ftol", "double -> long, through the 80x87 emulator"),
    "1000:12c8": ("N_LXMUL", "32-bit multiply helper: DX:AX * CX:BX"),
    "1000:1328": ("F_LDIV", "signed 32-bit divide (far entry, retf 8)"),
    "1000:132f": ("F_LUDIV", "unsigned 32-bit divide"),
    "1000:1337": ("F_LMOD", "signed 32-bit modulo"),
    "1000:133f": ("F_LUMOD", "unsigned 32-bit modulo"),
    "1000:13d6": ("N_LXLSH", "32-bit shift left by CL"),
    "1000:13f7": ("N_LXRSH", "32-bit arithmetic shift right by CL"),
    "1000:165e": ("lmul32", "32x32 multiply used by rand() and fread/fwrite"),
    "1000:1696": ("srand", "seed = value, high word 0"),
    "1000:16a7": ("rand", "seed = seed*0x015A4E35 + 1; return (seed>>16) & 0x7fff"),
    "1000:16fa": ("unlink", "libc (INT 21h AH=41h)"),
    "1000:182b": ("time", "libc time(): DOS date and time -> seconds"),
    "1000:18a4": ("toupper", "libc"),
    "1000:28b4": ("getch", "conio (INT 21h AH=07h)"),
    "1000:2aee": ("kbhit", "conio (INT 21h AH=0Bh)"),
    "1000:2c6c": ("malloc", "libc"),
    "1000:3306": ("sound", "PC speaker: 1193180 / hz into timer 2"),
    "1000:34d9": ("fclose", "libc"),
    "1000:3796": ("fopen", "libc"),
    "1000:38a2": ("fread", "libc"),
    "1000:3a79": ("fwrite", "libc"),
    "1000:3b5c": ("fgetc", "libc"),
    "1000:3c74": ("itoa", "libc"),
    "1000:3cb6": ("ltoa", "libc (long -> string)"),
    "1000:3f3b": ("fputc", "libc"),
    "1000:4432": ("strcat", "libc"),
    "1000:44d0": ("strcpy", "libc"),
    "1000:44f2": ("strlen", "libc"),
}
