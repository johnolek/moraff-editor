"""What each Microsoft QuickBASIC 3.0 run-time routine is, and what it reads.

A BRUN30-linked module reaches the run-time through `INT 3Dh`, `INT 3Eh` and
`INT 3Fh` followed by a one-byte function code.  Each interrupt has its own
dispatch table inside `BRUN30.EXE` -- CS:0171 for 3Dh, CS:0243 for 3Eh, CS:038D
for 3Fh -- and this module says which BASIC statement, function or operator each
entry of those tables is.  `../docs/BRUN30.md` carries the evidence for every
name and the calling convention the names sit on top of.

Three things live here:

* `ROUTINE`, the table.  `(vector, function) -> Routine`, holding the BRUN30
  address the dispatch table points at, the name to print, a note, how many
  bytes of inline argument the routine reads out of the instruction stream, and
  how sure the name is.
* `INLINE`, derived from the table: the inline-argument sizes a disassembler
  needs to stay in step.  `qbthunk.py` takes its default from here.
* `thunk_length`, the one function that knows how long a thunk is, including the
  two variable-length forms (`INT 3Fh $B7`, the `INPUT #` item list, and
  `INT 3Fh $5D`/`$5E`, the `ON ... GOSUB`/`ON ... GOTO` jump tables).

Confidence is one of:

    high    the routine's own code settles it -- a DOS or BIOS call, the BASIC
            error number it raises, or an unmistakable body -- usually together
            with a call site in DUNSMALL that reads as the matching statement.
    medium  the name comes from the routine's position in a family whose other
            members are certain, or from a call site that admits one reading.
    low     the shape of the routine is understood but the BASIC keyword is not.
"""
import collections

RT_INTS = (0x3D, 0x3E, 0x3F)

# The dispatch tables, and how many entries each has.  The last entry of the
# INT 3Fh table is $CB: CS:0525 is a pad byte and CS:0526 is code again.  Entry
# 0 of the INT 3Dh table doubles as the handler's saved-DS slot, which is why
# function 0 is special-cased in the handler rather than dispatched.
TABLES = {0x3D: (0x0171, 0x69), 0x3E: (0x0243, 0xA5), 0x3F: (0x038D, 0xCC)}

# Every table slot BRUN30 does not implement points here: `mov bl,73` and into
# the error handler, which is BASIC error 73, "Advanced feature error".
UNIMPLEMENTED = 0x09FA

Routine = collections.namedtuple(
    "Routine", "address name note inline confidence")


def _r(address, name, note="", inline=0, confidence="high"):
    return Routine(address, name, note, inline, confidence)


# The two variable-length thunks.  Neither can be given a byte count here
# because the count is in the stream; `thunk_length` handles both.
ITEM_LIST = (0x3F, 0xB7)     # count byte, then one type byte per item
JUMP_TABLE = {(0x3F, 0x5D), (0x3F, 0x5E)}   # count byte, then that many words

# INT 3Dh function 0 is the external-call form: the handler at BRUN30 CS:0082
# adds 3 to the return address and back-patches the site into a far call.
EXTERNAL_CALL = (0x3D, 0x00)


ROUTINE = {

    # ------------------------------------------------------------------
    # INT 3Dh -- functions that return a value
    # ------------------------------------------------------------------
    # Not a table entry: the handler at BRUN30 CS:0082 deals with function 0
    # itself, back-patching the five-byte site into a `9A` far call.
    (0x3D, 0x00): _r(0x0082, "CALL", "external procedure, back-patched to a far call"),
    (0x3D, 0x01): _r(0xAC92, "FIX", "single", confidence="medium"),
    (0x3D, 0x02): _r(0xACA2, "FIX", "double", confidence="medium"),
    (0x3D, 0x03): _r(0xACB2, "INT", "single"),
    (0x3D, 0x04): _r(0xAD0A, "INT", "double", confidence="medium"),
    (0x3D, 0x05): _r(0x9C08, "CHR$", "BX = the code point"),
    (0x3D, 0x06): _r(0x9BD6, "INKEY$", "no argument"),
    (0x3D, 0x0A): _r(0x9CE8, "MID$", "BX = string, DX = start, CX = length"),
    (0x3D, 0x0B): _r(0x9CCE, "LEFT$", "BX = string, DX = count"),
    (0x3D, 0x0C): _r(0x9CD7, "RIGHT$", "BX = string, DX = count"),
    (0x3D, 0x0D): _r(0x9D1B, "SPACE$", "BX = count"),
    (0x3D, 0x10): _r(0xB1CE, "STR$", "integer in BX"),
    (0x3D, 0x11): _r(0xB1D5, "STR$", "single at BX"),
    (0x3D, 0x12): _r(0xB1DC, "STR$", "double at BX", confidence="medium"),
    (0x3D, 0x13): _r(0x4667, "VAL", "BX = string; result in the double accumulator"),
    (0x3D, 0x21): _r(0x6267, "POS", "BX = the dummy argument", confidence="medium"),
    (0x3D, 0x25): _r(0x4448, "CSRLIN", "no argument", confidence="medium"),
    (0x3D, 0x2C): _r(0x44FF, "SCREEN", "function: the character at a row and column"),
    (0x3D, 0x2F): _r(0xC736, "EOF", "BX = the file number"),
    (0x3D, 0x30): _r(0xC74B, "LOC", "BX = the file number", confidence="medium"),
    (0x3D, 0x31): _r(0xC750, "LOF", "BX = the file number", confidence="medium"),
    (0x3D, 0x33): _r(0xB2C7, "RND", "with an argument at BX"),
    (0x3D, 0x34): _r(0xB2C2, "RND", "no argument"),
    (0x3D, 0x39): _r(0xBF0C, "SIN", "single at BX"),
    (0x3D, 0x43): _r(0xC12F, "TIMER", "no argument"),

    # ------------------------------------------------------------------
    # INT 3Eh -- statements
    # ------------------------------------------------------------------
    (0x3E, 0x01): _r(0x0B25, "END", "stop the program", confidence="medium"),
    (0x3E, 0x04): _r(0x6260, "WIDTH", "BX = columns, DX = rows or -1"),
    (0x3E, 0x07): _r(0x9B03, "WRITE #", "BX = the file number; items follow"),
    (0x3E, 0x09): _r(0xB349, "RANDOMIZE", "BX = the seed"),
    (0x3E, 0x0A): _r(0x95FA, "PRINT", "redirected output", confidence="low"),
    (0x3E, 0x0C): _r(0x0EAD, "(unidentified)",
                     "reserves a run-time buffer; only ever emitted before CHAIN",
                     confidence="low"),
    (0x3E, 0x0E): _r(0x1441, "CHAIN", "BX = the module name"),
    (0x3E, 0x1A): _r(0x92F3, "BLOAD", "BX = the file name, offset already set"),
    (0x3E, 0x1B): _r(0x92FF, "BSAVE", "BX = the file name", confidence="medium"),
    (0x3E, 0x1E): _r(0xC859, "OPEN", "BX = the file number, DX = the name"),
    (0x3E, 0x1F): _r(0xC7A0, "OPEN",
                     'the mode string in BX: "I", "O", "R" or "A"'),
    (0x3E, 0x21): _r(0xC755, "CLOSE", "BX = the file number"),
    (0x3E, 0x23): _r(0xD1F0, "NAME", "old name in DX, new name in BX"),
    (0x3E, 0x24): _r(0xD17D, "KILL", "BX = the file name"),
    (0x3E, 0x32): _r(0x43D2, "CLS", "BX = 0, 1, 2 or -1 for no argument"),
    (0x3E, 0x33): _r(0x4313, "COLOR", "argument given, more to come"),
    (0x3E, 0x34): _r(0x432D, "COLOR", "argument omitted, more to come"),
    (0x3E, 0x35): _r(0x42C8, "COLOR", "last argument in BX; execute"),
    (0x3E, 0x3A): _r(0xE6F6, "GET", "graphics: BX = the array, DX = its type",
                     confidence="medium"),
    (0x3E, 0x42): _r(0x4313, "LOCATE", "argument given, more to come"),
    (0x3E, 0x43): _r(0x432D, "LOCATE", "argument omitted, more to come"),
    (0x3E, 0x44): _r(0x4333, "LOCATE", "last argument in BX; execute"),
    (0x3E, 0x48): _r(0xE243, "PAINT", "BX = the fill colour, DX = the border",
                     confidence="medium"),
    (0x3E, 0x51): _r(0xF301, "PLAY", "BX = the tune string"),
    (0x3E, 0x58): _r(0xE808, "PUT", "graphics: BX = the array, DX = the action",
                     confidence="medium"),
    (0x3E, 0x59): _r(0x4313, "SCREEN", "argument given, more to come"),
    (0x3E, 0x5A): _r(0x432D, "SCREEN", "argument omitted, more to come"),
    (0x3E, 0x5B): _r(0x42FE, "SCREEN", "last argument in BX; execute"),
    (0x3E, 0x72): _r(0x3CC3, "VIEW", "first corner", confidence="medium"),
    (0x3E, 0x73): _r(0x3CD9, "VIEW", "second corner", confidence="medium"),
    (0x3E, 0x74): _r(0x3D11, "VIEW", "BX = fill, DX = border; execute",
                     confidence="medium"),
    (0x3E, 0x75): _r(0x3DA2, "VIEW", "no arguments: back to the whole screen",
                     confidence="medium"),
    (0x3E, 0x79): _r(0x3C9B, "PRINT", "end of the item list: newline"),
    (0x3E, 0x84): _r(0xEB23, "LINE", "first corner"),
    (0x3E, 0x85): _r(0xEA22, "LINE", "second corner"),
    (0x3E, 0x86): _r(0xEA39, "LINE",
                     "BX = colour, CX = style, DX = -1 plain / 0 B / 1 BF; draw"),
    (0x3E, 0x87): _r(0xE6CB, "GET", "graphics: first corner", confidence="medium"),
    (0x3E, 0x88): _r(0xE6DC, "GET", "graphics: second corner", confidence="medium"),
    (0x3E, 0x89): _r(0xE7FA, "PUT", "graphics: the destination point",
                     confidence="medium"),
    (0x3E, 0x8C): _r(0xE346, "CIRCLE", "BX = the radius", confidence="medium"),
    (0x3E, 0x8D): _r(0xEB1E, "(point)", "the (x, y) a PAINT or CIRCLE starts from",
                     confidence="medium"),
    (0x3E, 0xA1): _r(0x3DB3, "VIEW PRINT", "BX = top row, DX = bottom row"),

    # ------------------------------------------------------------------
    # INT 3Fh -- operators, assignment and the rest of the expression machinery
    # ------------------------------------------------------------------
    (0x3F, 0x13): _r(0x9561, "SWAP", "integer: DS:SI <-> ES:DI"),
    (0x3F, 0x18): _r(0x9D78, "VARPTR$", "BX = the variable"),
    (0x3F, 0x21): _r(0xA97A, "CINT",
                     "single at DS:SI to an unsigned 16-bit address",
                     confidence="medium"),
    (0x3F, 0x22): _r(0xA987, "CINT", "the single accumulator to an unsigned address",
                     confidence="medium"),
    (0x3F, 0x23): _r(0xB8A9, "^", "single: DS:SI ^ ES:DI"),
    (0x3F, 0x24): _r(0xBD25, "^", "double: DS:SI ^ ES:DI", confidence="medium"),
    (0x3F, 0x25): _r(0xB89E, "^", "single: accumulator ^ ES:DI"),
    (0x3F, 0x26): _r(0xBD1A, "^", "double: accumulator ^ ES:DI", confidence="medium"),
    (0x3F, 0x27): _r(0xB8A6, "^", "single: DS:SI ^ accumulator"),
    (0x3F, 0x28): _r(0xBD22, "^", "double: DS:SI ^ accumulator", confidence="medium"),
    (0x3F, 0x29): _r(0xB8A3, "^", "single: DS:SI ^ accumulator, local operand",
                     inline=1, confidence="medium"),
    (0x3F, 0x2A): _r(0xBD1F, "^", "double: DS:SI ^ accumulator, local operand",
                     inline=1, confidence="medium"),
    (0x3F, 0x2B): _r(0xAC51, "ABS", "single at DS:SI"),
    (0x3F, 0x2C): _r(0xAC5A, "ABS", "double at DS:SI"),
    (0x3F, 0x2D): _r(0xAC54, "ABS", "the single accumulator"),
    (0x3F, 0x2E): _r(0xAC5D, "ABS", "the double accumulator"),
    (0x3F, 0x2F): _r(0xABF2, "SGN", "single at DS:SI"),
    (0x3F, 0x30): _r(0xAC14, "SGN", "double at DS:SI"),
    (0x3F, 0x31): _r(0xABF8, "SGN", "the accumulator"),
    (0x3F, 0x32): _r(0xABF8, "SGN", "the accumulator"),
    (0x3F, 0x43): _r(0xC227, "DIM", "single array; inline dimension count", inline=1),
    (0x3F, 0x44): _r(0xC22A, "DIM", "double array; inline dimension count", inline=1),
    (0x3F, 0x45): _r(0xC22D, "DIM", "integer array; inline dimension count", inline=1),
    (0x3F, 0x46): _r(0xC230, "DIM", "string array; inline dimension count", inline=1),
    (0x3F, 0x55): _r(0x9DE5, "+", "string concatenation: AX + BX"),
    (0x3F, 0x56): _r(0xA880, "CSNG", "integer in BX to the single accumulator"),
    (0x3F, 0x57): _r(0xA880, "CSNG", "integer in BX to the single accumulator"),
    (0x3F, 0x5A): _r(0xDB61, "LINE INPUT #", "BX = the string variable",
                     confidence="medium"),
    (0x3F, 0x5D): _r(0x9504, "ON GOSUB", "inline: count byte, then that many targets"),
    (0x3F, 0x5E): _r(0x950B, "ON GOTO", "inline: count byte, then that many targets"),
    (0x3F, 0x61): _r(0x9DAF, "LET", "string: DX = the variable, BX = the value"),
    (0x3F, 0x62): _r(0x9E1F, "=", "string comparison: AX against BX"),
    (0x3F, 0x63): _r(0x9990, "PRINT", "single, then a comma"),
    (0x3F, 0x64): _r(0x9995, "PRINT", "double, then a comma"),
    (0x3F, 0x65): _r(0x999A, "PRINT", "integer, then a comma"),
    (0x3F, 0x66): _r(0x999F, "PRINT", "string, then a comma"),
    (0x3F, 0x67): _r(0x99A4, "PRINT", "single, then a semicolon"),
    (0x3F, 0x68): _r(0x99A9, "PRINT", "double, then a semicolon"),
    (0x3F, 0x69): _r(0x99AE, "PRINT", "integer, then a semicolon"),
    (0x3F, 0x6A): _r(0x99B3, "PRINT", "string, then a semicolon"),
    (0x3F, 0x6B): _r(0x99B8, "PRINT", "single, no separator"),
    (0x3F, 0x6C): _r(0x99BD, "PRINT", "double, no separator"),
    (0x3F, 0x6D): _r(0x99C2, "PRINT", "integer, no separator"),
    (0x3F, 0x6E): _r(0x99C7, "PRINT", "string, no separator"),
    (0x3F, 0x6F): _r(0x1E47, "LOAD", "single at DS:SI to the accumulator"),
    (0x3F, 0x70): _r(0x1E50, "LOAD", "double at DS:SI to the accumulator"),
    (0x3F, 0x71): _r(0x1E5B, "STORE", "single accumulator to a local slot", inline=1),
    (0x3F, 0x72): _r(0x1E74, "STORE", "double accumulator to a local slot", inline=1),
    (0x3F, 0x73): _r(0xA869, "CDBL", "single at DS:SI"),
    (0x3F, 0x74): _r(0xA873, "CDBL", "clear the low half of the double accumulator"),
    (0x3F, 0x75): _r(0xA8C8, "CINT", "single at DS:SI"),
    (0x3F, 0x76): _r(0xA8D5, "CINT", "double at DS:SI"),
    (0x3F, 0x77): _r(0xA911, "CINT", "the single accumulator"),
    (0x3F, 0x78): _r(0xA8E0, "CINT", "the double accumulator"),
    (0x3F, 0x79): _r(0xA896, "CSNG", "double at DS:SI"),
    (0x3F, 0x7A): _r(0xA8A2, "CSNG", "the double accumulator"),
    (0x3F, 0x7B): _r(0x1E30, "LET", "single: ES:DI <- DS:SI"),
    (0x3F, 0x7C): _r(0x1E3C, "LET", "double: ES:DI <- DS:SI"),
    (0x3F, 0x7D): _r(0x1E2D, "LET", "single: ES:DI <- the accumulator"),
    (0x3F, 0x7E): _r(0x1E39, "LET", "double: ES:DI <- the accumulator"),
    (0x3F, 0xA7): _r(0xAC1A, "IF", "test the single at DS:SI against zero"),
    (0x3F, 0xA8): _r(0xAC26, "IF", "test the double at DS:SI against zero"),
    (0x3F, 0xA9): _r(0xAC2C, "IF", "test the accumulator against zero"),
    (0x3F, 0xAA): _r(0xAC2C, "IF", "test the accumulator against zero"),
    (0x3F, 0xAB): _r(0xAC63, "SCALE",
                     "load the single at DS:SI and multiply it by 2^n", inline=1),
    (0x3F, 0xAC): _r(0xAC8D, "SCALE",
                     "load the double at DS:SI and multiply it by 2^n", inline=1),
    (0x3F, 0xAD): _r(0xAC66, "SCALE", "multiply the accumulator by 2^n", inline=1),
    (0x3F, 0xAE): _r(0xAC66, "SCALE", "multiply the accumulator by 2^n", inline=1),
    (0x3F, 0xAF): _r(0xABE0, "NEG", "single at DS:SI"),
    (0x3F, 0xB0): _r(0xABE9, "NEG", "double at DS:SI"),
    (0x3F, 0xB6): _r(0x5CFD, "INPUT #", "BX = the file number"),
    (0x3F, 0xB7): _r(0xC529, "INPUT #",
                     "item list: a count byte, then one type byte per item"),
    (0x3F, 0xB8): _r(0xC5FB, "INPUT #", "store one item into the variable at BX"),
    (0x3F, 0xBA): _r(0x9BBB, "LEN", "BX = the string"),
    (0x3F, 0xBB): _r(0x9BC2, "ASC", "BX = the string"),
    (0x3F, 0xBC): _r(0x9B6D, "PRINT", "start one: output goes to the screen"),
    (0x3F, 0xBD): _r(0x9B96, "PRINT USING", "start one with a format string (CHCHAR passes it \"Strength:    ### \")",
                     confidence="high"),
    (0x3F, 0xC4): _r(0xC324, "GET", "far array: read the element at DX into AX"),
    (0x3F, 0xC5): _r(0xC378, "PUT", "far array: write AX into the element at DX"),
    (0x3F, 0xC9): _r(0xC443, "VARPTR",
                     "the array at BX, as a single in the accumulator",
                     confidence="medium"),
    (0x3F, 0xCA): _r(0x1E8F, "LOAD", "single from a local slot to the accumulator",
                     inline=1, confidence="medium"),
    (0x3F, 0xCB): _r(0x1EA8, "LOAD", "double from a local slot to the accumulator",
                     inline=1, confidence="medium"),
}


# The five arithmetic families.  Each is eight consecutive slots: single and
# double alternating, and within a type four ways of naming the operands.  The
# entry stubs make this plain -- BRUN30 CS:B354-B380 has all four subtract stubs
# falling into one body -- so the whole of $7F..$A6 comes from the four bodies
# at B374 (add), B52B (divide), B4AB (multiply), B35F (subtract) and A837
# (compare).
_ARITHMETIC = [
    (0x7F, "+", (0xB374, 0xADAD, 0xB369, 0xADA2, 0xB371, 0xADAA, 0xB36E, 0xADA7)),
    (0x87, "/", (0xB52B, 0xAF94, 0xB520, 0xAF89, 0xB528, 0xAF91, 0xB525, 0xAF8E)),
    (0x8F, "*", (0xB4AB, 0xAF46, 0xB4A0, 0xAF3B, 0xB4A8, 0xAF43, 0xB4A5, 0xAF40)),
    (0x97, "-", (0xB35F, 0xAD8C, 0xB354, 0xAD81, 0xB35C, 0xAD89, 0xB359, 0xAD86)),
    (0x9F, "CMP", (0xA837, 0xA81E, 0xA82C, 0xA813, 0xA834, 0xA81B, 0xA831, 0xA818)),
]

_OPERANDS = ("DS:SI, ES:DI", "DS:SI, ES:DI",
             "accumulator, ES:DI", "accumulator, ES:DI",
             "DS:SI, accumulator", "DS:SI, accumulator",
             "a local slot, accumulator", "a local slot, accumulator")

# The G+6 and G+7 stubs call CS:1EC3, which reads the inline byte and puts the
# address of that local slot in SI, then fall into the "accumulator on the
# right" stub: the slot is the LEFT operand and the accumulator the right. Slot
# n is the eight bytes at DGROUP B7B0 + 8 * (n - 0x80), so 0x80 is B7B0 and
# 0x81 is B7B8. Reading it the other way round turns `slot - acc` into
# `acc - slot` and reverses every comparison against a slot.

for _base, _op, _addresses in _ARITHMETIC:
    for _i, _address in enumerate(_addresses):
        _kind = "double" if _i % 2 else "single"
        ROUTINE[(0x3F, _base + _i)] = _r(
            _address, _op, "%s: %s" % (_kind, _OPERANDS[_i]),
            inline=1 if _i >= 6 else 0)


NAMES = {key: routine.name for key, routine in ROUTINE.items()}

# What a disassembler needs: the routines that eat a fixed number of further
# bytes out of the instruction stream.  Every one of them either does its own
# `pop si; pop ds; lodsb` or reaches BRUN30 CS:1EC3, which does it for them.
INLINE = {key: routine.inline for key, routine in ROUTINE.items() if routine.inline}


def table_entries(image, vector):
    """The dispatch table for `vector`, read out of an unpacked BRUN30 image."""
    import struct
    base, count = TABLES[vector]
    return [struct.unpack("<H", image[base + 2 * i:base + 2 * i + 2])[0]
            for i in range(count)]


def thunk_length(code, pc, inline=None):
    """Length of the run-time thunk at `pc`, or None if there is not one there."""
    if code[pc] != 0xCD:
        return None
    vector = code[pc + 1]
    if vector not in RT_INTS:
        return None
    function = code[pc + 2]
    if (vector, function) == EXTERNAL_CALL:
        return 5
    if (vector, function) == ITEM_LIST:
        return 4 + code[pc + 3]
    if (vector, function) in JUMP_TABLE:
        return 4 + 2 * code[pc + 3]
    table = INLINE if inline is None else inline
    return 3 + table.get((vector, function), 0)


def jump_table_targets(code, pc):
    """The code offsets an `ON ... GOTO` / `ON ... GOSUB` thunk at `pc` can reach.

    The routine at BRUN30 CS:9504 pops the return address, reads a count byte,
    and jumps to the count'th word behind it -- so the words are code addresses
    in the module's own segment and nothing follows the table for `ON ... GOTO`.
    `ON ... GOSUB` pushes the byte after the table as its return address, which
    is why that address is in the list too.
    """
    import struct
    count = code[pc + 3]
    targets = [struct.unpack("<H", code[pc + 4 + 2 * i:pc + 6 + 2 * i])[0]
               for i in range(count)]
    if (code[pc + 1], code[pc + 2]) == (0x3F, 0x5D):
        targets.append(pc + 4 + 2 * count)
    return targets


# The operators, spelled out, because a C identifier cannot hold `+` or `^`.
_SPELLED = {"+": "add", "-": "sub", "*": "mul", "/": "div", "^": "pow",
            "=": "streq", "CMP": "cmp"}


def stub_name(vector, function):
    """The name to give this routine's call stub in the decompilation.

    C identifiers, so `PRINT` becomes `qb_PRINT_6e` and `+` becomes `qb_add_7f`.
    The function code stays on the end because a dozen codes share a name.
    """
    routine = ROUTINE.get((vector, function))
    if routine is None:
        return "qb%02x_%02x" % (vector, function)
    name = _SPELLED.get(routine.name, routine.name)
    letters = "".join(c if c.isalnum() else "_" for c in name).strip("_")
    return "qb_%s_%02x" % (letters or "fn", function)
