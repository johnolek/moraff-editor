"""The QuickBASIC 3.0 run-time call convention, and a disassembler that follows it.

A BRUN30-linked module reaches the run-time through three software interrupts
rather than through calls.  BRUN30 hooks INT 3Dh, INT 3Eh and INT 3Fh at startup
(`mov ax,253Dh/253Eh/253Fh; int 21h` at BRUN30 CS:052E-0545) and each handler
reads one byte out of the instruction stream behind the interrupt:

    CD 3F 7B            single-precision assignment: ES:DI <- DS:SI
    CD 3E 84            the first corner of a LINE
    CD 3D 34            RND

The handler at BRUN30 CS:00E9 (INT 3Fh) does `pop bx; pop ds; inc bx; push bx;
mov bl,[bx-1]` -- so the return address is bumped past the function byte -- then
`shl bx,1; push cs:[bx+038Dh]; ret`, dispatching through a word table.  INT 3Eh
uses the table at CS:0243 and INT 3Dh the one at CS:0171.

`../../reference/brun30.py` says what each entry of those three tables is, and
owns everything that varies per function: the names, the inline-argument sizes
and the two variable-length forms.  What is here is the walk over a module that
uses them.

Three wrinkles decide whether a disassembly stays in step:

* some run-time routines read *further* bytes of their own out of the stream.
  `$45` (array allocation) does `pop si; pop ds; lodsb` at BRUN30 CS:C237 to
  fetch a dimension count; the arithmetic routines whose right operand is a
  local slot reach the same bytes through BRUN30 CS:1EC3.  `learn_inline`
  re-derives the sizes from the module rather than trusting the table.
* INT 3Fh `$5D` and `$5E`, `ON ... GOSUB` and `ON ... GOTO`, carry a count byte
  and then that many jump targets.  They are the only thunks that transfer
  control, and following them is worth six percent of the code segment.
* INT 3Dh function 0 is the five-byte external-call form: the handler adds 3 to
  the return address (BRUN30 CS:0082) and back-patches the site into a far call.

Get the argument size wrong and the disassembler swallows the next thunk within
a couple of instructions, which is what `desync` looks for.
"""
import collections
import os
import sys

import capstone
from capstone import x86

sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                "..", "..", "reference"))
import brun30                                              # noqa: E402

RT_INTS = brun30.RT_INTS
INLINE = brun30.INLINE
ITEM_LIST = brun30.ITEM_LIST
JUMP_TABLE = brun30.JUMP_TABLE
thunk_length = brun30.thunk_length

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
        self.jumps = set()      # ON ... GOTO / GOSUB targets
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
                thunk = (code[pc + 1], code[pc + 2])
                out.thunks[pc] = thunk
                previous_thunk = pc
                if thunk in JUMP_TABLE:
                    targets = brun30.jump_table_targets(code, pc)
                    out.jumps.update(targets)
                    pending.extend(targets)
                    break
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

    A dead end within a dozen bytes of a thunk is that thunk's fault: its
    argument size is too small, so the next instruction started inside its
    argument.  The window has to be that wide because an argument byte read as
    an opcode can decode as two or three plausible instructions before the
    stream runs into the next `CD 3x`.
    """
    inline = collections.Counter(seed if seed is not None else {})
    for _ in range(rounds):
        out = walk(code, entries, end, inline)
        blame = collections.Counter()
        for address, thunk in out.dead_ends:
            if thunk is not None and thunk >= address - 12:
                blame[(code[thunk + 1], code[thunk + 2])] += 1
        raised = False
        for key in blame:
            if inline[key] < 2:
                inline[key] += 1
                raised = True
        if not raised:
            return dict(inline), out
    return dict(inline), walk(code, entries, end, inline)
