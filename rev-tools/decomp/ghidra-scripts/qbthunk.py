"""The QuickBASIC 3.0 run-time call convention, and a disassembler that follows it.

A BRUN30-linked module reaches the run-time through three software interrupts
rather than through calls.  BRUN30 hooks INT 3Dh, INT 3Eh and INT 3Fh at startup
(`mov ax,253Dh/253Eh/253Fh; int 21h` at BRUN30 CS:052E-0545) and each handler
reads one byte out of the instruction stream behind the interrupt:

    CD 3F 7B            single-precision assignment: ES:DI <- DS:SI
    CD 3E 84            print the string built in DX
    CD 3D 03            call a compiled procedure

The handler at BRUN30 CS:00E9 (INT 3Fh) does `pop bx; pop ds; inc bx; push bx;
mov bl,[bx-1]` -- so the return address is bumped past the function byte -- then
`shl bx,1; push cs:[bx+038Dh]; ret`, dispatching through a word table.  INT 3Eh
uses the table at CS:0243 and INT 3Dh the one at CS:0171.

Two wrinkles decide whether a disassembly stays in step:

* some run-time routines read *further* bytes of their own out of the stream.
  `$45` (array allocation) does `pop si; pop ds; lodsb` at BRUN30 CS:C237 to
  fetch a dimension count.  Others reach the same bytes through a helper, so
  they cannot all be found by pattern-matching the run-time; `INLINE` below is
  the table this package uses, and `learn_inline` re-derives it from the game.
* INT 3Dh function 0 is the five-byte external-call form: the handler adds 3 to
  the return address (BRUN30 CS:0082) and back-patches the site into a far call.

Get the argument size wrong and the disassembler swallows the next thunk within
a couple of instructions, which is what `desync` looks for.
"""
import collections

import capstone
from capstone import x86

RT_INTS = (0x3D, 0x3E, 0x3F)

# Run-time functions that read one further byte out of the instruction stream.
INLINE = {
    (0x3E, 0xE8): 1, (0x3E, 0xE9): 1, (0x3E, 0xEA): 1, (0x3E, 0xEB): 1,
    (0x3F, 0x43): 1, (0x3F, 0x44): 1, (0x3F, 0x45): 1, (0x3F, 0x46): 1,
    (0x3F, 0x5D): 1, (0x3F, 0x5E): 1, (0x3F, 0x71): 1, (0x3F, 0x72): 1,
    (0x3F, 0x85): 1, (0x3F, 0x95): 1, (0x3F, 0x9D): 1, (0x3F, 0xAD): 1,
    (0x3F, 0xB5): 1,
}

_STOP = {"ret", "retf", "iret", "hlt"}
_COND = {"ja", "jae", "jb", "jbe", "jcxz", "je", "jg", "jge", "jl", "jle", "jne",
         "jno", "jnp", "jns", "jo", "jp", "js", "loop", "loope", "loopne"}


def near_target(operand):
    """A near branch target.  Capstone sign-extends the displacement, but a real
    mode near branch wraps inside the segment, so bring it back into 0..FFFF."""
    return operand.imm & 0xFFFF


def disassembler():
    md = capstone.Cs(capstone.CS_ARCH_X86, capstone.CS_MODE_16)
    md.detail = True
    return md


# INT 3F $B7 opens an INPUT # / READ item list: one count byte, then that many
# type bytes (02 = integer, 03 = single), then one `mov bx,<variable>` plus an
# INT 3F $B8 for each item.  It is the only variable-length thunk in DUNSMALL,
# and it is what makes the character file's field list readable.
ITEM_LIST = (0x3F, 0xB7)


def thunk_length(code, pc, inline=INLINE):
    """Length of the run-time thunk at `pc`, or None if there is not one there."""
    if code[pc] != 0xCD:
        return None
    vector = code[pc + 1]
    if vector not in RT_INTS:
        return None
    function = code[pc + 2]
    if vector == 0x3D and function == 0:
        return 5
    if (vector, function) == ITEM_LIST:
        return 4 + code[pc + 3]
    return 3 + inline.get((vector, function), 0)


def desync(instruction):
    """True if a decoded instruction has swallowed the `CD 3x` of a later thunk."""
    b = instruction.bytes
    return any(b[i] == 0xCD and b[i + 1] in RT_INTS for i in range(1, len(b) - 1))


class Walk:
    """The result of `walk`: what was reached and what stopped it."""

    def __init__(self):
        self.sizes = {}         # address -> instruction length
        self.thunks = {}        # address -> (vector, function)
        self.calls = set()      # near call targets
        self.indirect = []      # (address, kind, operand) for computed flow
        self.dead_ends = []     # (address, address of the thunk just before it)

    @property
    def covered(self):
        return sum(self.sizes.values())


def walk(code, entries, end, inline=INLINE):
    """Recursive-descent disassembly from `entries`, following the thunk table."""
    md = disassembler()
    out = Walk()
    pending = list(entries)
    while pending:
        pc = pending.pop()
        previous_thunk = None
        while True:
            if pc < 0 or pc >= end or pc in out.sizes:
                break
            length = thunk_length(code, pc, inline)
            if length:
                out.sizes[pc] = length
                out.thunks[pc] = (code[pc + 1], code[pc + 2])
                previous_thunk = pc
                pc += length
                continue
            instruction = next(md.disasm(code[pc:pc + 16], pc), None)
            if instruction is None or desync(instruction):
                out.dead_ends.append((pc, previous_thunk))
                break
            out.sizes[pc] = instruction.size
            mnemonic = instruction.mnemonic
            if mnemonic in _COND:
                target = instruction.operands[0]
                if target.type == x86.X86_OP_IMM:
                    pending.append(near_target(target))
                pc += instruction.size
                continue
            if mnemonic == "call":
                target = instruction.operands[0]
                if target.type == x86.X86_OP_IMM:
                    out.calls.add(near_target(target))
                    pending.append(near_target(target))
                else:
                    out.indirect.append((pc, "call", instruction.op_str))
                pc += instruction.size
                continue
            if mnemonic == "lcall":
                pc += instruction.size
                continue
            if mnemonic == "jmp":
                target = instruction.operands[0]
                if target.type == x86.X86_OP_IMM:
                    pending.append(near_target(target))
                else:
                    out.indirect.append((pc, "jmp", instruction.op_str))
                break
            if mnemonic == "ljmp" or mnemonic in _STOP:
                break
            pc += instruction.size
    return out


def learn_inline(code, entries, end, seed=None, rounds=60):
    """Re-derive the inline-argument table by walking and blaming what broke.

    A dead end within eight bytes of a thunk is that thunk's fault: its argument
    size is too small, so the next instruction started inside its argument.
    """
    inline = collections.Counter(seed if seed is not None else {})
    for _ in range(rounds):
        out = walk(code, entries, end, inline)
        blame = collections.Counter()
        for address, thunk in out.dead_ends:
            if thunk is not None and thunk >= address - 8:
                blame[(code[thunk + 1], code[thunk + 2])] += 1
        raised = False
        for key in blame:
            if inline[key] < 2:
                inline[key] += 1
                raised = True
        if not raised:
            return dict(inline), out
    return dict(inline), walk(code, entries, end, inline)
