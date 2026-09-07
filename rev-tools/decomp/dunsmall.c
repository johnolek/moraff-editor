// The decompilation of DUNSMALL.EXE, Moraff's Revenge Beginner v3.0, as Ghidra
// 12.1.3 produced it.  264 functions: 134 of the game's own and the 130
// one-byte stubs `unthunk.py` planted to stand in for the QuickBASIC run-time.
//
// Read `../docs/SURVEY.md` before trusting any of this.  A compiled QuickBASIC
// program does almost nothing itself: it loads registers and calls the
// run-time, so `qb3f_7b(ax,bx,dx,si,di)` here is one BASIC assignment, and the
// whole of the arithmetic, the screen and the files is on the other side of
// those calls.  The stubs are declared as taking their operands in registers
// but returning nothing, so a value the run-time hands back is not modelled and
// the decompiler will wrongly believe AX and BX survive a call.  Where the C
// and the disassembly disagree, the disassembly is right.
//
// Addresses are offsets in DUNSMALL.EXE's code segment, unchanged from the
// shipped file: 1000:B674 here is 512 + 0xB674 bytes into DUNSMALL.EXE.
// `DAT_2000_xxxx` is a BASIC variable at that offset in DGROUP, and a `lit_`
// symbol is a string literal descriptor.  Regenerate with the recipe in
// `README.md`.

// ==== entry @ 1000:0030 (size 1390) callers: 

/* WARNING: Stack frame is not setup normally: Input value of stackpointer is not used */
/* WARNING: This function may have set the stack pointer */
/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void entry(void)

{
  word dx;
  word dx_00;
  word dx_01;
  word dx_02;
  word dx_03;
  word dx_04;
  word dx_05;
  word dx_06;
  word dx_07;
  word dx_08;
  word dx_09;
  word ax;
  word ax_00;
  word dx_10;
  word in_BX;
  word wVar1;
  word wVar2;
  int iVar3;
  undefined *puVar4;
  word wVar5;
  undefined1 *puVar6;
  undefined1 *puVar7;
  undefined1 *puVar8;
  undefined1 *puVar10;
  undefined1 uVar11;
  undefined1 uVar12;
  undefined4 uVar13;
  undefined2 *puVar9;
  
  _DAT_3000_bd4e = 0x1000;
  puVar6 = (undefined1 *)0x1fc;
  _DAT_3000_bd4c = 0x35;
  func_0x0001d960();
  *(undefined2 *)(puVar6 + -2) = 0x1d96;
  puVar7 = puVar6 + -4;
  *(undefined2 *)(puVar6 + -4) = 0x3a;
  uVar13 = func_0x0001b7c3();
  *(undefined2 *)(puVar7 + -2) = 0x43;
  uVar13 = qb3f_7b((word)uVar13,in_BX,(word)((ulong)uVar13 >> 0x10),0xb7d0,0x4e24);
  *(undefined2 *)(puVar7 + -2) = 0x4c;
  uVar13 = qb3f_7b((word)uVar13,in_BX,(word)((ulong)uVar13 >> 0x10),0xb7d4,0x4e28);
  *(undefined2 *)(puVar7 + -2) = 0x51;
  qb3f_75((word)uVar13,in_BX,(word)((ulong)uVar13 >> 0x10),0x4e28,0x4e28);
  *(word *)(puVar7 + -2) = in_BX + 1;
  *(undefined2 *)(puVar7 + -4) = 2;
  *(undefined2 *)(puVar7 + -6) = 0x10;
  wVar1 = 0x4e16;
  *(undefined2 *)(puVar7 + -8) = 99;
  uVar13 = qb3f_45(0x10,0x4e16,dx,0x4e28,0x4e28);
  *(undefined2 *)(puVar7 + -8) = 0x6a;
  qb3f_75((word)uVar13,wVar1,(word)((ulong)uVar13 >> 0x10),0x4e28,0x4e28);
  *(word *)(puVar7 + -8) = wVar1 + 1;
  wVar2 = 0x4e86;
  *(undefined2 *)(puVar7 + -10) = 0x74;
  uVar13 = qb3f_45(wVar1 + 1,0x4e86,dx_00,0x4e28,0x4e28);
  *(undefined2 *)(puVar7 + -10) = 0x7e;
  uVar13 = qb3f_7b((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb7d8,0x4e28);
  *(undefined2 *)(puVar7 + -10) = 0x87;
  uVar13 = qb3f_7b((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb7dc,0x52fc);
  *(undefined2 *)(puVar7 + -10) = 0x8c;
  qb3f_75((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0x52fc,0x52fc);
  *(word *)(puVar7 + -10) = wVar2 + 1;
  wVar1 = 0x52f2;
  *(undefined2 *)(puVar7 + -0xc) = 0x96;
  uVar13 = qb3f_45(wVar2 + 1,0x52f2,dx_01,0x52fc,0x52fc);
  *(undefined2 *)(puVar7 + -0xc) = 0x9d;
  qb3f_75((word)uVar13,wVar1,(word)((ulong)uVar13 >> 0x10),0x52fc,0x52fc);
  *(word *)(puVar7 + -0xc) = wVar1 + 1;
  wVar2 = 0x5300;
  *(undefined2 *)(puVar7 + -0xe) = 0xa7;
  qb3f_45(wVar1 + 1,0x5300,dx_02,0x52fc,0x52fc);
  *(undefined2 *)(puVar7 + -0xe) = 0x2d;
  *(undefined2 *)(puVar7 + -0x10) = 0xb2;
  qb3f_75(0x2d,wVar2,dx_03,0x4e28,0x52fc);
  *(word *)(puVar7 + -0x10) = wVar2 + 1;
  puVar8 = puVar7 + -0x12;
  *(undefined2 *)(puVar7 + -0x12) = 0x13;
  *(undefined2 *)(puVar7 + -0x14) = 0xc0;
  uVar13 = qb3f_45(0x13,0x5e9e,dx_04,0x4e28,0x52fc);
  wVar2 = 0xd;
  *(undefined2 *)(puVar7 + -0x14) = 199;
  wVar1 = qb3d_05((word)uVar13,0xd,(word)((ulong)uVar13 >> 0x10),0x4e28,0x52fc);
  *(undefined2 *)(puVar7 + -0x14) = 0xcd;
  uVar13 = qb3f_61(wVar1,wVar2,0xb45e,0x4e28,0x52fc);
  *(undefined2 *)(puVar7 + -0x14) = 0xd3;
  uVar13 = qb3e_32((word)uVar13,0xffff,(word)((ulong)uVar13 >> 0x10),0x4e28,0x52fc);
  *(undefined2 *)(puVar7 + -0x14) = 0xd9;
  wVar1 = qb3e_1f((word)uVar13,0xb7e0,(word)((ulong)uVar13 >> 0x10),0x4e28,0x52fc);
  wVar2 = 1;
  uVar11 = 0;
  uVar12 = 1;
  *(undefined2 *)(puVar7 + -0x14) = 0xe4;
  uVar13 = qb3e_1e(wVar1,1,0xb7e6,0x4e28,0x52fc);
  *(undefined2 *)(puVar7 + -0x14) = 0xe7;
  uVar13 = qb3f_b6((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0x4e28,0x52fc);
  *(undefined2 *)(puVar7 + -0x14) = 0xea;
  uVar13 = qb3f_b7((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0x4e28,0x52fc);
  wVar2 = 0xb462;
  *(undefined2 *)(puVar7 + -0x14) = 0xf4;
  wVar1 = qb3f_b8((word)uVar13,0xb462,(word)((ulong)uVar13 >> 0x10),0x4e28,0x52fc);
  *(undefined2 *)(puVar7 + -0x14) = 0xfc;
  uVar13 = qb3f_b8(wVar1,0xb466,wVar2,0x4e28,0x52fc);
  *(undefined2 *)(puVar7 + -0x14) = 0x102;
  uVar13 = qb3f_b8((word)uVar13,0xb46a,(word)((ulong)uVar13 >> 0x10),0x4e28,0x52fc);
  wVar2 = 1;
  *(undefined2 *)(puVar7 + -0x14) = 0x108;
  uVar13 = qb3e_21((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),0x4e28,0x52fc);
  wVar1 = (word)((ulong)uVar13 >> 0x10);
  DAT_2000_19c0 = 2;
  DAT_2000_19c6 = 2;
  *(undefined2 *)(puVar7 + -0x14) = 0x119;
  uVar13 = qb3f_a7((word)uVar13,wVar2,wVar1,wVar1,0x52fc);
  if ((bool)uVar12) {
    DAT_2000_19c8 = 3;
    DAT_2000_19bc = 3;
    wVar1 = 0xb7ee;
    *(undefined2 *)(puVar7 + -0x14) = 0x130;
    uVar13 = qb3f_6f((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb7ee,0x52fc);
    while( true ) {
      *(undefined2 *)(puVar7 + -0x14) = 0x15c;
      uVar13 = qb3f_7d((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),wVar1,0x4e28);
      *(undefined2 *)(puVar7 + -0x14) = 0x164;
      uVar13 = qb3f_9f((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0x4e28,0xb7fa);
      if (!(bool)uVar11 && !(bool)uVar12) break;
      wVar2 = 0x4e28;
      *(undefined2 *)(puVar7 + -0x14) = 0x13e;
      uVar13 = qb3f_75((word)uVar13,0x4e28,0x4e28,0x4e28,0xb7fa);
      uVar11 = 0xe619 < wVar2 * 4;
      wVar1 = wVar2 * 4 + 0x19e6;
      uVar12 = wVar1 == 0;
      *(undefined2 *)(puVar7 + -0x14) = 0x14e;
      uVar13 = qb3f_7b((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb7f2,wVar1);
      wVar1 = (word)((ulong)uVar13 >> 0x10);
      *(undefined2 *)(puVar7 + -0x14) = 0x156;
      uVar13 = qb3f_7f((word)uVar13,wVar2,wVar1,wVar1,0xb7f6);
    }
  }
  *(undefined2 *)(puVar7 + -0x14) = 0x16f;
  uVar13 = qb3f_9f((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb462,0xb7f6);
  if ((bool)uVar12) {
    wVar1 = 0xb7ee;
    *(undefined2 *)(puVar7 + -0x14) = 0x17d;
    uVar13 = qb3f_7b((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb46e);
    DAT_2000_b472 = 2;
    DAT_2000_19c8 = 1;
    DAT_2000_19bc = 2;
    *(undefined2 *)(puVar7 + -0x14) = 0x192;
    uVar13 = qb3f_6f((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb46e);
    while( true ) {
      *(undefined2 *)(puVar7 + -0x14) = 0x1c7;
      uVar13 = qb3f_7d((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),wVar1,0x4e28);
      *(undefined2 *)(puVar7 + -0x14) = 0x1cf;
      uVar13 = qb3f_9f((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0x4e28,0xb7fa);
      if (!(bool)uVar11 && !(bool)uVar12) break;
      iVar3 = 0x4e28;
      *(undefined2 *)(puVar7 + -0x14) = 0x1a0;
      uVar13 = qb3f_75((word)uVar13,0x4e28,0x4e28,0x4e28,0xb7fa);
      wVar1 = (word)((ulong)uVar13 >> 0x10);
      uVar11 = 0xe619 < (uint)(iVar3 * 4);
      wVar2 = iVar3 * 4 + 0x19e6;
      uVar12 = wVar2 == 0;
      *(undefined2 *)(puVar7 + -0x14) = 0x1b4;
      uVar13 = qb3f_7f((word)uVar13,wVar2,wVar1,wVar1,0xb7fe);
      *(undefined2 *)(puVar7 + -0x14) = 0x1b9;
      uVar13 = qb3f_7d((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),wVar1,wVar2);
      wVar1 = (word)((ulong)uVar13 >> 0x10);
      *(undefined2 *)(puVar7 + -0x14) = 0x1c1;
      uVar13 = qb3f_7f((word)uVar13,wVar2,wVar1,wVar1,0xb7f6);
    }
  }
  *(undefined2 *)(puVar7 + -0x14) = 0x1da;
  uVar13 = qb3f_7b((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb7f6,0xb474);
  wVar2 = 0xb7f6;
  *(undefined2 *)(puVar7 + -0x14) = 0x1e5;
  uVar13 = qb3f_7b((word)uVar13,0xb7f6,(word)((ulong)uVar13 >> 0x10),0xb802,0xb478);
  *(undefined2 *)(puVar7 + -0x14) = 0x1ed;
  uVar13 = qb3f_7b((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),wVar2,0xb47c);
  wVar1 = 1;
  *(undefined2 *)(puVar7 + -0x14) = 499;
  qb3e_5b((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),wVar2,0xb47c);
  *(undefined2 *)(puVar7 + -0x14) = 0x1f6;
  FUN_1000_49f8();
  *(undefined2 *)(puVar7 + -0x14) = 0x1f9;
  uVar13 = FUN_1000_4a17();
  *(undefined2 *)(puVar7 + -0x14) = 0x1fc;
  uVar13 = qb3d_43((word)uVar13,wVar1,(word)((ulong)uVar13 >> 0x10),wVar2,0xb47c);
  *(undefined2 *)(puVar7 + -0x14) = 0x202;
  wVar1 = qb3e_09((word)uVar13,0x1a,(word)((ulong)uVar13 >> 0x10),wVar2,0xb47c);
  *(undefined2 *)(puVar7 + -0x14) = 0x20b;
  uVar13 = qb3f_61(wVar1,0xb806,0xb480,wVar2,0xb47c);
  wVar5 = (word)((ulong)uVar13 >> 0x10);
  puVar4 = (undefined *)&lit_Hit_any_key;
  *(undefined2 *)(puVar7 + -0x14) = 0x216;
  uVar13 = qb3f_61((word)uVar13,0xb812,0xb484,wVar2,0xb47c);
  *(undefined2 *)(puVar7 + -0x14) = 0x21f;
  uVar13 = qb3f_7b((word)uVar13,(word)puVar4,(word)((ulong)uVar13 >> 0x10),0xb7d8,0xb488);
  *(undefined2 *)(puVar7 + -0x14) = 0x228;
  wVar1 = qb3f_7b((word)uVar13,(word)puVar4,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x231;
  wVar1 = qb3f_61(wVar1,0xb822,0xb490,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x23a;
  qb3f_61(wVar1,0xb836,0xb494,0xb7ee,0xb48c);
  wVar2 = 0xb45e;
  *(undefined2 *)(puVar7 + -0x14) = 0x243;
  wVar1 = qb3f_55(0xb856,0xb45e,dx_05,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x249;
  wVar1 = qb3f_61(wVar1,wVar2,0xb498,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x252;
  qb3f_61(wVar1,0xb868,0x1f16,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x25a;
  wVar1 = wVar5;
  wVar2 = qb3f_55(0xb876,wVar5,dx_06,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x260;
  qb3f_61(wVar2,wVar1,0x1f1a,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x268;
  wVar1 = wVar5;
  wVar2 = qb3f_55(0xb882,wVar5,dx_07,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x26e;
  qb3f_61(wVar2,wVar1,0x1f1e,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x276;
  wVar1 = wVar5;
  wVar2 = qb3f_55(0xb88c,wVar5,dx_08,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x27c;
  qb3f_61(wVar2,wVar1,0x1f22,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x284;
  wVar1 = qb3f_55(0xb896,wVar5,dx_09,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x28a;
  uVar13 = qb3f_61(wVar1,wVar5,0x1f26,0xb7ee,0xb48c);
  wVar2 = 0;
  *(undefined2 *)(puVar7 + -0x14) = 0x28f;
  wVar1 = qb3d_05((word)uVar13,0,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x295;
  qb3f_61(wVar1,wVar2,0xb49c,0xb7ee,0xb48c);
  puVar4 = (undefined *)&lit_H;
  *(undefined2 *)(puVar7 + -0x14) = 0x29d;
  wVar1 = qb3f_55(ax,0xb8a6,ax,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x2a3;
  uVar13 = qb3f_61(wVar1,(word)puVar4,0xb4a0,0xb7ee,0xb48c);
  puVar4 = (undefined *)&lit_M;
  *(undefined2 *)(puVar7 + -0x14) = 0x2a9;
  wVar1 = qb3f_55((word)uVar13,0xb8ac,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x2af;
  uVar13 = qb3f_61(wVar1,(word)puVar4,0xb4a4,0xb7ee,0xb48c);
  puVar4 = (undefined *)&lit_P;
  *(undefined2 *)(puVar7 + -0x14) = 0x2b5;
  wVar1 = qb3f_55((word)uVar13,0xb8b2,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 699;
  uVar13 = qb3f_61(wVar1,(word)puVar4,0xb4a8,0xb7ee,0xb48c);
  puVar4 = (undefined *)&lit_K;
  *(undefined2 *)(puVar7 + -0x14) = 0x2c1;
  wVar1 = qb3f_55((word)uVar13,0xb8b8,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x2c7;
  uVar13 = qb3f_61(wVar1,(word)puVar4,0xb4ac,0xb7ee,0xb48c);
  wVar2 = 0x3b;
  *(undefined2 *)(puVar7 + -0x14) = 0x2cd;
  uVar13 = qb3d_05((word)uVar13,0x3b,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x2d0;
  wVar1 = qb3f_55((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x2d6;
  wVar1 = qb3f_61(wVar1,wVar2,0xb4b0,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x2df;
  wVar1 = qb3f_61(wVar1,0xb8be,0x19d2,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x2e8;
  wVar1 = qb3f_61(wVar1,0xb8c8,0x19d6,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x2f1;
  wVar1 = qb3f_61(wVar1,0xb8d2,0x19da,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x2fa;
  wVar1 = qb3f_61(wVar1,0xb8dc,0x19de,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x303;
  wVar1 = qb3f_61(wVar1,0xb8e6,0x19e2,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x30c;
  qb3f_61(wVar1,0xb8f0,0xb4b4,0xb7ee,0xb48c);
  puVar4 = (undefined *)&lit_good;
  *(undefined2 *)(puVar7 + -0x14) = 0x314;
  wVar1 = qb3f_55(ax_00,0xb902,ax_00,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x31a;
  wVar1 = qb3f_61(wVar1,(word)puVar4,0xb4b8,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x323;
  wVar1 = qb3f_61(wVar1,0xb90c,0x1b46,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x32c;
  wVar1 = qb3f_61(wVar1,0xb916,0x1b4a,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x335;
  wVar1 = qb3f_61(wVar1,0xb920,0x1b4e,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x33e;
  wVar1 = qb3f_61(wVar1,0xb928,0x1b52,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x347;
  wVar1 = qb3f_61(wVar1,0xb932,0x1b5a,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x350;
  wVar1 = qb3f_61(wVar1,0xb93a,0x1b5e,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x359;
  wVar1 = qb3f_61(wVar1,0xb942,0x1b62,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x362;
  wVar1 = qb3f_61(wVar1,0xb94c,0x1b66,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x36b;
  wVar1 = qb3f_61(wVar1,0xb956,0x1b6a,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x374;
  wVar1 = qb3f_61(wVar1,0xb960,0x1b6e,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x37d;
  wVar1 = qb3f_61(wVar1,0xb96a,0x1b72,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x386;
  wVar1 = qb3f_61(wVar1,0xb974,0x1b76,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x38f;
  wVar1 = qb3f_61(wVar1,0xb97e,0x1b7a,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x398;
  wVar1 = qb3f_61(wVar1,0xb988,0x1b7e,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3a1;
  wVar1 = qb3f_61(wVar1,0xb9a4,0x1b82,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3aa;
  wVar1 = qb3f_61(wVar1,0xb9c0,0x1b86,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3b3;
  wVar1 = qb3f_61(wVar1,0xb9dc,0x1b8a,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3bc;
  qb3f_61(wVar1,0xb9f8,0x1b8e,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3bf;
  FUN_1000_4a7c();
  uVar11 = 1;
  *(undefined2 *)(puVar7 + -0x14) = 0x3ca;
  wVar1 = qb3e_87(0,0,0,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3d3;
  wVar1 = qb3e_88(wVar1,6,5,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3dc;
  wVar1 = qb3e_3a(wVar1,0x52ce,0x12,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3e3;
  wVar1 = qb3e_87(wVar1,wVar1,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3ec;
  wVar1 = qb3e_88(wVar1,0x13,0xd,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3f5;
  wVar1 = qb3e_3a(wVar1,0x4e2c,0x5a,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x3fc;
  wVar1 = qb3e_87(wVar1,wVar1,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x405;
  wVar1 = qb3e_88(wVar1,0x23,0x17,0xb7ee,0xb48c);
  wVar2 = 0x4e86;
  *(undefined2 *)(puVar7 + -0x14) = 0x40d;
  uVar13 = qb3e_3a(wVar1,0x4e86,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x410;
  uVar13 = qb3f_bc((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  puVar4 = (undefined *)&lit_SBTIW;
  *(undefined2 *)(puVar7 + -0x14) = 0x416;
  uVar13 = qb3f_6e((word)uVar13,0xba14,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x419;
  uVar13 = qb3e_79((word)uVar13,(word)puVar4,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x41e;
  wVar1 = qb3e_87((word)uVar13,(word)uVar13,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x426;
  wVar1 = qb3e_88(wVar1,6,6,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x42f;
  wVar1 = qb3e_3a(wVar1,0x522c,0x12,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x437;
  wVar1 = qb3e_87(wVar1,8,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x440;
  wVar1 = qb3e_88(wVar1,0xe,6,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x449;
  wVar1 = qb3e_3a(wVar1,0x523e,0x12,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x451;
  wVar1 = qb3e_87(wVar1,0x10,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x45a;
  wVar1 = qb3e_88(wVar1,0x16,6,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x463;
  wVar1 = qb3e_3a(wVar1,0x5250,0x12,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x46b;
  wVar1 = qb3e_87(wVar1,0x18,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x474;
  wVar1 = qb3e_88(wVar1,0x1e,6,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x47d;
  wVar1 = qb3e_3a(wVar1,0x5262,0x12,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x485;
  wVar1 = qb3e_87(wVar1,0x20,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x48e;
  wVar1 = qb3e_88(wVar1,0x26,6,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x497;
  uVar13 = qb3e_3a(wVar1,0x5274,0x12,0xb7ee,0xb48c);
  wVar1 = 0xffff;
  *(undefined2 *)(puVar7 + -0x14) = 0x49d;
  uVar13 = qb3e_32((word)uVar13,0xffff,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4a0;
  uVar13 = qb3f_bc((word)uVar13,wVar1,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  wVar1 = 0xba1e;
  *(undefined2 *)(puVar7 + -0x14) = 0x4a6;
  uVar13 = qb3f_6e((word)uVar13,0xba1e,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4a9;
  wVar1 = qb3e_79((word)uVar13,wVar1,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4b0;
  wVar1 = qb3e_87(wVar1,wVar1,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4b8;
  wVar1 = qb3e_88(wVar1,6,6,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4c1;
  wVar1 = qb3e_3a(wVar1,0x5286,0x12,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4c9;
  wVar1 = qb3e_87(wVar1,8,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4d2;
  wVar1 = qb3e_88(wVar1,0xe,6,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4db;
  wVar1 = qb3e_3a(wVar1,0x52aa,0x12,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4e3;
  wVar1 = qb3e_87(wVar1,0x10,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4ec;
  wVar1 = qb3e_88(wVar1,0x16,6,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4f5;
  wVar1 = qb3e_3a(wVar1,0x5298,0x12,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x4fd;
  wVar1 = qb3e_87(wVar1,0x18,wVar1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x506;
  wVar1 = qb3e_88(wVar1,0x1e,6,0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x50f;
  uVar13 = qb3e_3a(wVar1,0x52bc,0x12,0xb7ee,0xb48c);
  wVar1 = (word)uVar13;
  *(undefined2 *)(puVar7 + -0x14) = 0x514;
  qb3e_5b(wVar1,wVar1,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x517;
  uVar13 = FUN_1000_b9b3();
  *(undefined2 *)(puVar7 + -0x14) = 0x51a;
  uVar13 = qb3f_bc((word)uVar13,wVar1,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  puVar4 = (undefined *)&lit_Sound_Y_or_N;
  *(undefined2 *)(puVar7 + -0x14) = 0x520;
  uVar13 = qb3f_6e((word)uVar13,0xba26,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar7 + -0x14) = 0x523;
  qb3e_79((word)uVar13,(word)puVar4,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  do {
    puVar9 = (undefined2 *)(puVar8 + -2);
    puVar8 = puVar8 + -2;
    *puVar9 = 0x526;
    FUN_1000_2f71();
    *(undefined2 *)(puVar8 + -2) = 0x52f;
    uVar13 = qb3f_62(0xb49c,0xba3a,dx_10,0xb7ee,0xb48c);
    if ((bool)uVar11) goto LAB_1000_0545;
    *(undefined2 *)(puVar8 + -2) = 0x53d;
    uVar13 = qb3f_62(0xb49c,0xba40,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  } while (!(bool)uVar11);
  DAT_2000_b4bc = 1;
LAB_1000_0545:
  *(undefined2 *)(puVar8 + -2) = 0x54b;
  qb3e_5b((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar8 + -2) = 0x54e;
  wVar1 = FUN_1000_bfba();
  wVar5 = 0xb46a;
  *(undefined2 *)(puVar8 + -2) = 0x556;
  uVar13 = qb3d_11(wVar1,0xb46a,0xb46a,0xb7ee,0xb48c);
  *(undefined2 *)(puVar8 + -2) = 0x559;
  uVar13 = qb3f_ba((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  wVar2 = (word)((ulong)uVar13 >> 0x10);
  *(undefined2 *)(puVar8 + -2) = 0x55f;
  uVar13 = qb3d_11((word)uVar13,wVar2,wVar5 - 1,0xb7ee,0xb48c);
  *(undefined2 *)(puVar8 + -2) = 0x562;
  wVar1 = qb3d_0c((word)uVar13,wVar2,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar8 + -2) = 0x568;
  qb3f_61(wVar1,wVar2,0xb4be,0xb7ee,0xb48c);
  *(undefined2 *)(puVar8 + -2) = 0x56b;
  FUN_1000_ba10();
  *(undefined2 *)(puVar8 + -2) = 0x56e;
  uVar13 = FUN_1000_b674();
  *(undefined2 *)(puVar8 + -2) = 0x574;
  uVar13 = qb3e_42((word)uVar13,0x19,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar8 + -2) = 0x57a;
  uVar13 = qb3e_44((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar8 + -2) = 0x580;
  uVar13 = qb3e_33((word)uVar13,4,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  wVar1 = 0;
  *(undefined2 *)(puVar8 + -2) = 0x585;
  uVar13 = qb3e_35((word)uVar13,0,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar8 + -2) = 0x588;
  uVar13 = qb3f_bc((word)uVar13,wVar1,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  puVar4 = (undefined *)&lit_HIT_ANY_KEY;
  *(undefined2 *)(puVar8 + -2) = 0x58e;
  uVar13 = qb3f_6a((word)uVar13,0xba46,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  *(undefined2 *)(puVar8 + -2) = 0x591;
  qb3e_79((word)uVar13,(word)puVar4,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb48c);
  puVar10 = puVar8 + -2;
  *(undefined2 *)(puVar8 + -2) = 0x594;
  FUN_1000_2f71();
  *(undefined2 *)(puVar10 + -2) = 0x597;
  FUN_1000_2ff7();
  *(undefined2 *)(puVar10 + -2) = 0x59a;
  FUN_1000_4c28();
  *(undefined2 *)(puVar10 + -2) = 0x59d;
  FUN_1000_2fcb();
  FUN_1000_0636();
  return;
}


// ==== FUN_1000_05ac @ 1000:05ac (size 12) callers: FUN_1000_a013

void FUN_1000_05ac(void)

{
  word in_AX;
  word unaff_SI;
  word unaff_DI;
  
  qb3f_61(in_AX,0xbaca,0xb49c,unaff_SI,unaff_DI);
  FUN_1000_05cb();
  return;
}


// ==== FUN_1000_05cb @ 1000:05cb (size 39) callers: FUN_1000_05ac,FUN_1000_ba10

void __cdecl16near FUN_1000_05cb(void)

{
  word in_AX;
  word in_DX;
  word dx;
  word wVar1;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  if (DAT_2000_b4bc != 1) {
    wVar1 = 0xb49c;
    qb3f_18(in_AX,0xb49c,in_DX,unaff_SI,unaff_DI);
    uVar2 = qb3f_55(0xbb4e,wVar1,dx,unaff_SI,unaff_DI);
    wVar1 = qb3e_51((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
    qb3f_61(wVar1,0xbb56,0xb49c,unaff_SI,unaff_DI);
    FUN_1000_2fcb();
    return;
  }
  return;
}


// ==== FUN_1000_0636 @ 1000:0636 (size 933) callers: FUN_1000_0cd2,FUN_1000_1340,FUN_1000_1918,entry

void FUN_1000_0636(void)

{
  int *piVar1;
  uint *puVar2;
  char cVar3;
  bool bVar4;
  bool bVar5;
  byte bVar6;
  word in_AX;
  word wVar7;
  int iVar8;
  undefined2 *in_CX;
  undefined2 *di;
  word in_DX;
  uint dx;
  uint uVar9;
  uint uVar10;
  word in_BX;
  word wVar11;
  undefined *puVar12;
  int unaff_BP;
  word wVar13;
  char *pcVar14;
  undefined2 *puVar15;
  word di_00;
  undefined2 unaff_SS;
  undefined1 in_CF;
  byte bVar16;
  undefined1 in_ZF;
  undefined1 uVar17;
  undefined1 uVar18;
  bool bVar19;
  undefined4 uVar20;
  ulong uVar21;
  
  pcVar14 = (char *)0xb4c2;
  qb3f_7b(in_AX,in_BX,in_DX,0xb7f6,0xb4c2);
  uVar20 = FUN_1000_3ffc();
LAB_1000_0642:
  qb3f_a7((word)uVar20,in_BX,(word)((ulong)uVar20 >> 0x10),0xb48c,(word)pcVar14);
  if ((bool)in_ZF) {
    FUN_1000_12c6();
    return;
  }
  uVar20 = FUN_1000_54cb();
  puVar15 = (undefined2 *)&DAT_2000_bb60;
  wVar13 = 0xb4c6;
  uVar21 = qb3f_9f((word)uVar20,in_BX,(word)((ulong)uVar20 >> 0x10),0xb4c6,0xbb60);
  if (!(bool)in_CF && !(bool)in_ZF) {
    puVar15 = (undefined2 *)0xb4c6;
    wVar13 = qb3f_9f((word)uVar21,0xb4c6,(word)(uVar21 >> 0x10),0xb4ce,0xb4ca);
    wVar7 = 0;
    if ((bool)in_ZF) {
      wVar7 = 0xffff;
    }
    bVar19 = false;
    uVar20 = qb3f_9f(wVar13,(word)puVar15,wVar7,0xb4d6,0xb4d2);
    uVar10 = (uint)((ulong)uVar20 >> 0x10);
    uVar9 = 0;
    if (bVar19) {
      uVar9 = 0xffff;
    }
    bVar19 = false;
    in_CX = (undefined2 *)(uVar9 & uVar10);
    wVar13 = 0xb48c;
    wVar7 = qb3f_9f((word)uVar20,(word)puVar15,uVar10,0xb48c,0xbb64);
    uVar9 = 0;
    if (bVar19) {
      uVar9 = 0xffff;
    }
    in_CF = 0;
    bVar19 = (uVar9 & (uint)in_CX) == 0;
    if (bVar19) {
      uVar21 = (ulong)wVar7;
      in_ZF = 1;
      puVar15 = (undefined2 *)0xbb64;
    }
    else {
      wVar7 = qb3f_9f(wVar7,(word)puVar15,uVar9 & (uint)in_CX,0xb4da,0xb48c);
      wVar11 = 0;
      if (bVar19) {
        wVar11 = 0xffff;
      }
      uVar17 = 0;
      wVar13 = 0xb48c;
      di = (undefined2 *)0xb4da;
      uVar20 = qb3f_7f(wVar7,(word)puVar15,wVar11,0xb48c,0xb7d0);
      in_CX = di;
      qb3f_a1((word)uVar20,(word)puVar15,(word)((ulong)uVar20 >> 0x10),0xb48c,(word)di);
      uVar9 = 0;
      if ((bool)uVar17) {
        uVar9 = 0xffff;
      }
      in_CF = 0;
      in_ZF = (uVar9 | dx) == 0;
      if ((bool)in_ZF) {
        uVar21 = (ulong)dx << 0x10;
        puVar15 = di;
      }
      else {
        wVar13 = 0xb7f6;
        qb3f_7b(uVar9 | dx,(word)puVar15,dx,0xb7f6,(word)puVar15);
        uVar21 = FUN_1000_567c();
      }
    }
  }
  wVar11 = 0xb7f6;
  uVar20 = qb3d_33((word)uVar21,0xb7f6,(word)(uVar21 >> 0x10),wVar13,(word)puVar15);
  wVar7 = qb3f_91((word)uVar20,wVar11,(word)((ulong)uVar20 >> 0x10),wVar13,0xbb68);
  puVar15 = (undefined2 *)0x1a;
  uVar20 = qb3d_03(wVar7,0x1a,wVar11,wVar13,0xbb68);
  wVar7 = (word)((ulong)uVar20 >> 0x10);
  uVar20 = qb3f_81((word)uVar20,(word)puVar15,wVar7,wVar13,wVar7);
  uVar20 = qb3f_7d((word)uVar20,(word)puVar15,(word)((ulong)uVar20 >> 0x10),wVar13,0x52fc);
  uVar20 = qb3f_9f((word)uVar20,(word)puVar15,(word)((ulong)uVar20 >> 0x10),0x52fc,0xbb6c);
  if ((bool)in_CF) {
    wVar7 = 2;
    wVar13 = qb3e_42((word)uVar20,2,(word)((ulong)uVar20 >> 0x10),0x52fc,0xbb6c);
    in_CX = (undefined2 *)0x1;
    uVar20 = qb3e_44(wVar13,1,wVar7,0x52fc,0xbb6c);
    uVar20 = qb3f_bc((word)uVar20,(word)in_CX,(word)((ulong)uVar20 >> 0x10),0x52fc,0xbb6c);
    wVar13 = 0x28;
    uVar20 = qb3d_0d((word)uVar20,0x28,(word)((ulong)uVar20 >> 0x10),0x52fc,0xbb6c);
    uVar20 = qb3f_6e((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0x52fc,0xbb6c);
    uVar20 = qb3e_79((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0x52fc,0xbb6c);
    wVar13 = (word)((ulong)uVar20 >> 0x10);
    uVar20 = qb3e_42((word)uVar20,wVar13,wVar13,0x52fc,0xbb6c);
    puVar15 = in_CX;
    uVar20 = qb3e_44((word)uVar20,(word)in_CX,(word)((ulong)uVar20 >> 0x10),0x52fc,0xbb6c);
  }
  uVar20 = qb3f_9f((word)uVar20,(word)puVar15,(word)((ulong)uVar20 >> 0x10),0x52fc,0xb7f6);
  wVar13 = 0;
  if ((bool)in_ZF) {
    wVar13 = 0xffff;
  }
  uVar20 = qb3f_73((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb4de,0xb7f6);
  uVar20 = qb3f_82((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb4de,0xb4e2);
  uVar20 = qb3f_72((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb4ea,0xbb70);
  wVar7 = qb3f_23((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb4ea,0xbb70);
  uVar20 = qb3f_25(wVar7,wVar13,0xb4ea,0xb4ea,0xbb70);
  uVar20 = qb3f_27((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xbb74,0xbb70);
  uVar20 = qb3f_91((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xbb74,0xbb78);
  wVar7 = (word)((ulong)uVar20 >> 0x10);
  uVar20 = qb3f_71((word)uVar20,wVar13,wVar7,wVar7,0xbb7c);
  uVar20 = qb3f_23((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),wVar7,0xbb7c);
  uVar20 = qb3f_91((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),wVar7,48000);
  uVar20 = qb3f_85((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),wVar7,48000);
  uVar20 = qb3f_81((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),wVar7,0xbb84);
  uVar20 = qb3f_74((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),wVar7,0xbb84);
  uVar20 = qb3f_a6((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),wVar7,0xbb84);
  puVar2 = (uint *)(unaff_BP + wVar7 + 0x23);
  uVar9 = *puVar2;
  *puVar2 = *puVar2 + (int)in_CX;
  uVar10 = *puVar2;
  piVar1 = (int *)(unaff_BP + -0x447c);
  bVar6 = (byte)in_CX & 0x1f;
  iVar8 = *piVar1;
  *piVar1 = *piVar1 << bVar6;
  bVar4 = ((uint)in_CX & 0x1f) == 0;
  bVar19 = ((uint)in_CX & 0x1f) != 0;
  bVar16 = (byte)in_CX & 0x1f;
  cVar3 = DAT_2000_bb87 << bVar16;
  bVar5 = ((uint)in_CX & 0x1f) == 0;
  bVar16 = bVar5 * (bVar4 * CARRY2(uVar9,(uint)in_CX) | !bVar4 * (iVar8 << bVar6 - 1 < 0)) |
           !bVar5 * ((char)(DAT_2000_bb87 << bVar16 - 1) < '\0');
  bVar4 = ((uint)in_CX & 0x1f) != 0;
  uVar17 = !bVar4 && (!bVar19 && uVar10 == 0 || bVar19 && *piVar1 == 0) || bVar4 && cVar3 == '\0';
  DAT_2000_bb87 = cVar3;
  uVar20 = qb3f_8f((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb4ee,0xbba6);
  uVar20 = qb3f_a1((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb4ee,0xb4f2);
  puVar12 = (undefined *)0x0;
  if (!(bool)bVar16 && !(bool)uVar17) {
    puVar12 = (undefined *)0xffff;
    uVar17 = 0;
  }
  wVar13 = qb3f_9f((word)uVar20,(word)puVar12,(word)((ulong)uVar20 >> 0x10),0x52fc,0xb7d8);
  uVar9 = 0;
  if ((bool)uVar17) {
    uVar9 = 0xffff;
  }
  if ((uVar9 & (uint)puVar12) == 0) {
    uVar21 = (ulong)wVar13;
  }
  else {
    uVar20 = qb3f_bc(wVar13,(word)puVar12,uVar9 & (uint)puVar12,0x52fc,0xb7d8);
    puVar12 = (undefined *)&lit_You_could_use_a_cure;
    uVar20 = qb3f_6e((word)uVar20,0xbbaa,(word)((ulong)uVar20 >> 0x10),0x52fc,0xb7d8);
    uVar21 = qb3e_79((word)uVar20,(word)puVar12,(word)((ulong)uVar20 >> 0x10),0x52fc,0xb7d8);
  }
  uVar20 = qb3f_ab((word)uVar21,(word)puVar12,(word)(uVar21 >> 0x10),0xb4ea,0xb7d8);
  puVar2 = (uint *)(puVar12 + (int)(undefined2 *)&DAT_2000_b7d7 + 1);
  uVar17 = 0x4827 < *puVar2;
  *puVar2 = *puVar2 + 0xb7d8;
  uVar18 = *puVar2 == 0;
  uVar20 = qb3f_81((word)uVar20,(word)puVar12,(word)((ulong)uVar20 >> 0x10),0xb4ea,0xb7d8);
  uVar20 = qb3f_a1((word)uVar20,(word)puVar12,(word)((ulong)uVar20 >> 0x10),0xb4ea,0xb48c);
  pcVar14 = (char *)0x0;
  if ((bool)uVar17) {
    pcVar14 = (char *)0xffff;
    uVar18 = 0;
  }
  wVar13 = qb3f_9f((word)uVar20,(word)pcVar14,(word)((ulong)uVar20 >> 0x10),0x52fc,0xbb60);
  uVar9 = 0;
  if ((bool)uVar18) {
    uVar9 = 0xffff;
  }
  uVar17 = 0;
  uVar18 = (uVar9 & (uint)pcVar14) == 0;
  if ((bool)uVar18) {
    uVar21 = (ulong)wVar13;
  }
  else {
    uVar20 = qb3f_bc(wVar13,(word)pcVar14,uVar9 & (uint)pcVar14,0x52fc,0xbb60);
    pcVar14 = (char *)s_You_could_use_a_cure_W__2000_bbae + 0x16;
    uVar20 = qb3f_6e((word)uVar20,0xbbc4,(word)((ulong)uVar20 >> 0x10),0x52fc,0xbb60);
    uVar21 = qb3e_79((word)uVar20,(word)pcVar14,(word)((ulong)uVar20 >> 0x10),0x52fc,0xbb60);
  }
  uVar20 = qb3f_a7((word)uVar21,(word)pcVar14,(word)(uVar21 >> 0x10),0xb4f6,0xbb60);
  puVar12 = (undefined *)0x0;
  if (!(bool)uVar17 && !(bool)uVar18) {
    puVar12 = (undefined *)0xffff;
    uVar18 = 0;
  }
  wVar13 = qb3f_9f((word)uVar20,(word)puVar12,(word)((ulong)uVar20 >> 0x10),0x52fc,0xb802);
  uVar9 = 0;
  if ((bool)uVar18) {
    uVar9 = 0xffff;
  }
  uVar17 = (uVar9 & (uint)puVar12) == 0;
  if ((bool)uVar17) {
    uVar21 = (ulong)wVar13;
  }
  else {
    uVar20 = qb3f_bc(wVar13,(word)puVar12,uVar9 & (uint)puVar12,0x52fc,0xb802);
    puVar12 = (undefined *)&lit_Go_to_bank_to_cash_in_treasure;
    uVar20 = qb3f_6e((word)uVar20,0xbbf0,(word)((ulong)uVar20 >> 0x10),0x52fc,0xb802);
    uVar21 = qb3e_79((word)uVar20,(word)puVar12,(word)((ulong)uVar20 >> 0x10),0x52fc,0xb802);
  }
  uVar20 = qb3f_9f((word)uVar21,(word)puVar12,(word)(uVar21 >> 0x10),0xb48c,0xbb64);
  uVar9 = 0;
  if ((bool)uVar17) {
    uVar9 = 0xffff;
  }
  bVar19 = false;
  wVar13 = qb3f_9f((word)uVar20,uVar9,(word)((ulong)uVar20 >> 0x10),0x1bba,0xb4ca);
  uVar10 = 0;
  if (bVar19) {
    uVar10 = 0xffff;
  }
  bVar19 = (uVar10 & uVar9) == 0;
  pcVar14 = (char *)0xb4d2;
  wVar7 = 0x1bbe;
  uVar20 = qb3f_9f(wVar13,uVar9,uVar10 & uVar9,0x1bbe,0xb4d2);
  uVar9 = 0;
  if (bVar19) {
    uVar9 = 0xffff;
  }
  wVar13 = uVar9 & (uint)((ulong)uVar20 >> 0x10);
  in_ZF = wVar13 == 0;
  if (!(bool)in_ZF) {
    uVar20 = FUN_1000_3d83();
  }
  do {
    wVar11 = qb3d_06((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),wVar7,(word)pcVar14);
    uVar20 = qb3f_61(wVar11,wVar13,0xb49c,wVar7,(word)pcVar14);
    uVar20 = qb3f_7b((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xbc12,0xb4fa);
    pcVar14 = (char *)s_Go_to_bank_to_cash_in_treasure_2000_bbf4 + 0x1e;
    wVar7 = 0xb48c;
    uVar20 = qb3f_9f((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb48c,0xbc12);
    wVar11 = (word)((ulong)uVar20 >> 0x10);
    if (!(bool)in_ZF) {
      uVar20 = qb3f_7f((word)uVar20,wVar13,wVar11,0xb4fe,0xb7f6);
      wVar13 = 0xb7f6;
      uVar20 = qb3f_71((word)uVar20,0xb7f6,(word)((ulong)uVar20 >> 0x10),0xb4fe,0xb502);
      wVar7 = qb3f_a1((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb4fe,0xb502);
      wVar11 = 0;
      if ((bool)in_ZF) {
        wVar11 = 0xffff;
      }
      bVar19 = false;
      di_00 = 0xb506;
      uVar20 = qb3f_9f(wVar7,wVar13,wVar11,0xb7b0,0xb506);
      uVar10 = (uint)((ulong)uVar20 >> 0x10);
      uVar9 = 0;
      if (bVar19) {
        uVar9 = 0xffff;
      }
      in_CX = (undefined2 *)(uVar9 | uVar10);
      uVar17 = 0;
      uVar18 = in_CX == (undefined2 *)0x0;
      if (!(bool)uVar18) {
        wVar7 = wVar13;
        uVar20 = qb3f_6f((word)uVar20,wVar13,uVar10,wVar13,0xb506);
        while( true ) {
          uVar20 = qb3f_7d((word)uVar20,wVar7,(word)((ulong)uVar20 >> 0x10),wVar13,0x4e28);
          di_00 = 0xbc16;
          uVar20 = qb3f_9f((word)uVar20,wVar7,(word)((ulong)uVar20 >> 0x10),0x4e28,0xbc16);
          wVar13 = wVar7;
          if (!(bool)uVar17 && !(bool)uVar18) break;
          wVar13 = 0x4e28;
          uVar20 = qb3f_7f((word)uVar20,wVar7,(word)((ulong)uVar20 >> 0x10),0x4e28,0xb7f6);
        }
      }
      uVar20 = FUN_1000_7eec();
      qb3f_75((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb4d2,di_00);
      wVar11 = (word)((long)(int)wVar13 * 0x16);
      wVar7 = 0xb4ca;
      uVar20 = qb3f_75(wVar11,wVar13,(word)((ulong)((long)(int)wVar13 * 0x16) >> 0x10),0xb4ca,wVar11
                      );
      wVar11 = (word)((ulong)uVar20 >> 0x10);
      in_BX = wVar13 + (int)uVar20;
      pcVar14 = (char *)(in_BX * 2);
      in_CF = 0;
      in_ZF = *(int *)(pcVar14 + 0x4e90) == 0;
      if (0 < *(int *)(pcVar14 + 0x4e90)) break;
    }
    wVar13 = 0xbc1a;
    uVar20 = qb3f_62(0xb49c,0xbc1a,wVar11,wVar7,(word)pcVar14);
    if (!(bool)in_ZF) {
      qb3f_75((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb4d2,(word)pcVar14);
      wVar7 = (word)((long)(int)wVar13 * 0x16);
      iVar8 = qb3f_75(wVar7,wVar13,(word)((ulong)((long)(int)wVar13 * 0x16) >> 0x10),0xb4ca,wVar7);
      wVar13 = wVar13 + iVar8;
      wVar7 = wVar13 * 2;
      uVar17 = 0;
      uVar18 = *(int *)(wVar7 + 0x4e90) == 0;
      if (0 < *(int *)(wVar7 + 0x4e90)) {
        FUN_1000_3ffc();
      }
      uVar20 = FUN_1000_5417();
      uVar20 = qb3f_a7((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb50a,wVar7);
      if ((bool)uVar18) {
        qb3f_75((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb48c,wVar7);
        wVar7 = (word)((long)(int)wVar13 * 0x15);
        uVar20 = qb3f_75(wVar7,wVar13,(word)((ulong)((long)(int)wVar13 * 0x15) >> 0x10),0xb4d2,wVar7
                        );
        uVar9 = (wVar7 + wVar13) * 4;
        uVar17 = 0x64f9 < uVar9;
        wVar7 = uVar9 + 0x9b06;
        uVar18 = wVar7 == 0;
        uVar20 = qb3f_97((word)uVar20,wVar7,(word)((ulong)uVar20 >> 0x10),0xbc1e,0xb4ca);
        uVar20 = qb3f_27((word)uVar20,wVar7,(word)((ulong)uVar20 >> 0x10),0xb7d8,0xb4ca);
        wVar13 = wVar7;
        uVar20 = qb3f_83((word)uVar20,wVar7,(word)((ulong)uVar20 >> 0x10),wVar7,0xb4ca);
        uVar20 = qb3f_7d((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),wVar7,wVar13);
      }
      else {
        uVar18 = 0;
      }
      uVar20 = qb3f_7b((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xbc22,0xb50e);
      uVar20 = qb3f_9f((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb48c,0xbc22);
      wVar13 = 0;
      if ((bool)uVar18) {
        wVar13 = 0xffff;
      }
      wVar7 = qb3f_9f((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xb4c6,0xb7f6);
      uVar9 = 0;
      if ((bool)uVar17) {
        uVar9 = 0xffff;
      }
      if ((uVar9 & wVar13) != 0) {
        qb3f_7b(wVar7,wVar13,uVar9 & wVar13,0xbc26,0xb4c6);
      }
      uVar20 = FUN_1000_3b02();
      qb3f_7b((word)uVar20,wVar13,(word)((ulong)uVar20 >> 0x10),0xbc2a,0xb512);
      FUN_1000_09e8();
      FUN_1000_0cd2();
      return;
    }
  } while( true );
  uVar20 = FUN_1000_3ffc();
  goto LAB_1000_0642;
}


// ==== FUN_1000_09e8 @ 1000:09e8 (size 615) callers: FUN_1000_0636,FUN_1000_09e8,FUN_1000_803a

void __cdecl16near FUN_1000_09e8(void)

{
  undefined2 in_AX;
  word wVar1;
  word wVar2;
  undefined2 in_DX;
  uint uVar3;
  word dx;
  uint uVar4;
  bool bVar5;
  undefined1 uVar6;
  undefined1 uVar7;
  undefined4 uVar8;
  
  uVar8 = CONCAT22(in_DX,in_AX);
code_r0x000109e8:
  do {
    while( true ) {
      uVar4 = 0;
      if (DAT_2000_b516 == 0) {
        uVar4 = 0xffff;
      }
      bVar5 = false;
      wVar1 = qb3f_9f((word)uVar8,uVar4,(word)((ulong)uVar8 >> 0x10),0xb50e,0xb7f6);
      uVar3 = 0;
      if (!bVar5) {
        uVar3 = 0xffff;
      }
      bVar5 = (uVar3 & uVar4) == 0;
      uVar8 = qb3f_9f(wVar1,uVar4,uVar3 & uVar4,0xb518,0xb7f6);
      uVar4 = 0;
      if (bVar5) {
        uVar4 = 0xffff;
      }
      wVar1 = uVar4 & (uint)((ulong)uVar8 >> 0x10);
      uVar6 = wVar1 == 0;
      if (!(bool)uVar6) {
        uVar8 = FUN_1000_0c0b();
      }
      DAT_2000_b516 = 0;
      uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb518);
      uVar8 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb51c,0xb7f6);
      wVar1 = 0;
      if ((bool)uVar6) {
        wVar1 = 0xffff;
      }
      bVar5 = false;
      wVar2 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb50e,0xb7f6);
      uVar4 = 0;
      if (bVar5) {
        uVar4 = 0xffff;
      }
      uVar6 = false;
      uVar7 = (uVar4 & wVar1) == 0;
      if (!(bool)uVar7) {
        return;
      }
      uVar8 = qb3f_9f(wVar2,wVar1,0,0xb474,0xbc2e);
      if (!(bool)uVar6 && !(bool)uVar7) {
        uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb474);
      }
      uVar8 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x6024,0xb474);
      if ((bool)uVar7) {
        uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb7ee,0x6024);
        uVar8 = qb3f_7f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x1fa6,0xbc32);
        qb3f_7d((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x1fa6,0x1fa6);
        uVar8 = FUN_1000_4a9e();
      }
      uVar8 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x6028,0xb474);
      if ((bool)uVar7) {
        uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xbc36,0x6028);
        uVar8 = qb3f_7f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb520,0xbc3a);
        qb3f_7d((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb520,0xb520);
        uVar8 = FUN_1000_4a9e();
      }
      uVar8 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb512,0xb7f6);
      if ((bool)uVar7) {
        return;
      }
      uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb7ee,0xb51c);
      qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb524,0xb7ee);
      wVar1 = dx;
      if (!(bool)uVar7) break;
LAB_1000_0b6d:
      wVar2 = 0xb4a0;
      uVar8 = qb3f_62(0xb49c,0xb4a0,wVar1,0xb524,0xb7ee);
      wVar1 = (word)((ulong)uVar8 >> 0x10);
      if ((bool)uVar7) {
        qb3f_7b((word)uVar8,wVar2,wVar1,0xb7f6,0xb4fa);
        uVar8 = FUN_1000_30c7();
      }
      else {
        wVar2 = 0xb4a4;
        uVar8 = qb3f_62(0xb49c,0xb4a4,wVar1,0xb524,0xb7ee);
        wVar1 = (word)((ulong)uVar8 >> 0x10);
        if ((bool)uVar7) {
          uVar8 = qb3f_7b((word)uVar8,wVar2,wVar1,0xb7f6,0xb4fa);
          uVar8 = qb3f_7f((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb47c,0xb7f6);
          uVar8 = qb3f_7d((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb47c,0xb47c);
        }
        else {
          wVar2 = 0xb4a8;
          uVar8 = qb3f_62(0xb49c,0xb4a8,wVar1,0xb524,0xb7ee);
          wVar1 = (word)((ulong)uVar8 >> 0x10);
          if ((bool)uVar7) {
            uVar8 = qb3f_7b((word)uVar8,wVar2,wVar1,0xb7f6,0xb4fa);
            uVar8 = qb3f_7f((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb47c,0xb7d8);
            uVar8 = qb3f_7d((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb47c,0xb47c);
          }
          else {
            wVar2 = 0xb4ac;
            uVar8 = qb3f_62(0xb49c,0xb4ac,wVar1,0xb524,0xb7ee);
            wVar1 = (word)((ulong)uVar8 >> 0x10);
            if (!(bool)uVar7) {
              qb3f_7b((word)uVar8,wVar2,wVar1,0xbc3e,0xb518);
              return;
            }
            uVar8 = qb3f_7b((word)uVar8,wVar2,wVar1,0xb7f6,0xb4fa);
            uVar8 = qb3f_7f((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb47c,0xb7d0);
            uVar8 = qb3f_7d((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb47c,0xb47c);
          }
        }
        uVar8 = qb3f_9f((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb47c,0xb7f6);
        wVar1 = (word)((ulong)uVar8 >> 0x10);
        if ((bool)uVar6) {
          uVar8 = qb3f_7f((word)uVar8,wVar2,wVar1,0xb47c,0xb802);
          uVar8 = qb3f_7d((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb47c,0xb47c);
        }
        else {
          uVar8 = qb3f_9f((word)uVar8,wVar2,wVar1,0xb47c,0xb802);
          if (!(bool)uVar6 && !(bool)uVar7) {
            uVar8 = qb3f_7f((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb47c,0xbb5c);
            uVar8 = qb3f_7d((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb47c,0xb47c);
          }
        }
        qb3f_7b((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb4c2);
        uVar8 = FUN_1000_3ffc();
      }
    }
    wVar2 = 0xb4a0;
    uVar8 = qb3f_62(0xb49c,0xb4a0,dx,0xb524,0xb7ee);
    wVar1 = (word)((ulong)uVar8 >> 0x10);
    if ((bool)uVar7) {
      uVar8 = qb3f_7b((word)uVar8,wVar2,wVar1,0xb7f6,0xb4fa);
      qb3f_7b((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb47c);
      uVar8 = func_0x000130d9();
      goto code_r0x000109e8;
    }
    wVar2 = 0xb4a4;
    uVar8 = qb3f_62(0xb49c,0xb4a4,wVar1,0xb524,0xb7ee);
    wVar1 = (word)((ulong)uVar8 >> 0x10);
    if ((bool)uVar7) {
      uVar8 = qb3f_7b((word)uVar8,wVar2,wVar1,0xb7f6,0xb4fa);
      qb3f_7b((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb7d8,0xb47c);
      uVar8 = FUN_1000_3192();
    }
    else {
      wVar2 = 0xb4a8;
      uVar8 = qb3f_62(0xb49c,0xb4a8,wVar1,0xb524,0xb7ee);
      wVar1 = (word)((ulong)uVar8 >> 0x10);
      if ((bool)uVar7) {
        uVar8 = qb3f_7b((word)uVar8,wVar2,wVar1,0xb7f6,0xb4fa);
        qb3f_7b((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xbb60,0xb47c);
        uVar8 = FUN_1000_3254();
      }
      else {
        wVar2 = 0xb4ac;
        uVar8 = qb3f_62(0xb49c,0xb4ac,wVar1,0xb524,0xb7ee);
        wVar1 = (word)((ulong)uVar8 >> 0x10);
        if (!(bool)uVar7) goto LAB_1000_0b6d;
        uVar8 = qb3f_7b((word)uVar8,wVar2,wVar1,0xb7f6,0xb4fa);
        qb3f_7b((word)uVar8,wVar2,(word)((ulong)uVar8 >> 0x10),0xb802,0xb47c);
        uVar8 = FUN_1000_3316();
      }
    }
  } while( true );
}


// ==== FUN_1000_0c0b @ 1000:0c0b (size 164) callers: FUN_1000_09e8

void __stdcall16far FUN_1000_0c0b(void)

{
  word in_AX;
  word wVar1;
  int in_CX;
  word in_DX;
  int iVar2;
  uint uVar3;
  word in_BX;
  word wVar4;
  word bx;
  undefined1 in_ZF;
  bool bVar5;
  undefined1 uVar6;
  undefined4 uVar7;
  
  uVar7 = qb3f_9f(in_AX,in_BX,in_DX,0xb50e,0xb7f6);
  wVar4 = 0;
  if ((bool)in_ZF) {
    wVar4 = 0xffff;
  }
  bVar5 = false;
  wVar1 = qb3f_a7((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb48c,0xb7f6);
  iVar2 = 0;
  if (bVar5) {
    iVar2 = -1;
  }
  bVar5 = iVar2 == 0 && wVar4 == 0;
  if (iVar2 != 0 || wVar4 != 0) {
    return;
  }
  uVar7 = qb3f_9f(wVar1,wVar4,0,0xb528,0xb4ca);
  wVar4 = 0;
  if (bVar5) {
    wVar4 = 0xffff;
  }
  bVar5 = false;
  wVar1 = qb3f_9f((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb52c,0xb4d2);
  uVar3 = 0;
  if (bVar5) {
    uVar3 = 0xffff;
  }
  uVar6 = (uVar3 & wVar4) == 0;
  if (!(bool)uVar6) {
    return;
  }
  uVar7 = qb3f_7b(wVar1,wVar4,0,0xb4ca,0xb528);
  wVar1 = 0xb52c;
  uVar7 = qb3f_7b((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb4d2,0xb52c);
  uVar7 = qb3f_a7((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb502,0xb52c);
  if (!(bool)uVar6) {
    wVar1 = 0xb530;
    qb3f_7b((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb502,0xb530);
    uVar7 = FUN_1000_70a1();
  }
  uVar7 = qb3f_a7((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb506,wVar1);
  wVar4 = 0;
  if (!(bool)uVar6) {
    wVar4 = 0xffff;
  }
  wVar1 = qb3f_8f((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb506,0xbc42);
  bx = 0x1a;
  uVar7 = qb3f_71(wVar1,0x1a,wVar4,0xb506,0xbc42);
  uVar7 = qb3d_03((word)uVar7,bx,(word)((ulong)uVar7 >> 0x10),0xb506,0xbc42);
  iVar2 = -0x4afa;
  qb3f_a5((word)uVar7,0xb506,(word)((ulong)uVar7 >> 0x10),0xb506,0xbc42);
  *(int *)(iVar2 + -0x439b) = *(int *)(iVar2 + -0x439b) + in_CX;
  return;
}


// ==== FUN_1000_0cc0 @ 1000:0cc0 (size 18) callers: FUN_1000_0cd2

void __cdecl16near FUN_1000_0cc0(void)

{
  word in_BX;
  word unaff_DI;
  undefined1 in_ZF;
  undefined4 uVar1;
  
  uVar1 = FUN_1000_4c28();
  qb3f_a7((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb48c,unaff_DI);
  if ((bool)in_ZF) {
    FUN_1000_1cf5();
  }
  return;
}


// ==== FUN_1000_0cd2 @ 1000:0cd2 (size 899) callers: FUN_1000_0636

void FUN_1000_0cd2(void)

{
  int *piVar1;
  uint *puVar2;
  char cVar3;
  bool bVar4;
  bool bVar5;
  byte bVar6;
  int iVar7;
  word wVar8;
  undefined2 *di;
  uint uVar9;
  undefined2 *bx;
  uint dx;
  word wVar10;
  uint uVar11;
  word dx_00;
  word extraout_DX;
  word extraout_DX_00;
  word extraout_DX_01;
  word extraout_DX_02;
  word dx_01;
  word extraout_DX_03;
  word extraout_DX_04;
  word extraout_DX_05;
  word dx_02;
  word dx_03;
  word dx_04;
  word wVar12;
  uint dx_05;
  word extraout_DX_06;
  word extraout_DX_07;
  word extraout_DX_08;
  word extraout_DX_09;
  word extraout_DX_10;
  word extraout_DX_11;
  word dx_06;
  word extraout_DX_12;
  word in_BX;
  undefined1 *puVar13;
  undefined1 *puVar14;
  undefined *puVar15;
  int unaff_BP;
  undefined2 *puVar16;
  word di_00;
  char *pcVar17;
  undefined2 unaff_SS;
  byte bVar18;
  undefined1 in_ZF;
  bool bVar19;
  undefined1 uVar20;
  undefined1 uVar21;
  undefined4 uVar22;
  ulong uVar23;
  
  uVar22 = FUN_1000_2f87();
  uVar22 = qb3f_7b((word)uVar22,in_BX,(word)((ulong)uVar22 >> 0x10),0xb7ee,0x52fc);
  puVar13 = (undefined1 *)0x52fc;
  wVar8 = qb3f_9f((word)uVar22,0x52fc,(word)((ulong)uVar22 >> 0x10),0xb48c,0xbb64);
  wVar10 = 0;
  if ((bool)in_ZF) {
    wVar10 = 0xffff;
  }
  bVar19 = false;
  uVar22 = qb3f_9f(wVar8,(word)puVar13,wVar10,0x1bba,0xb4ca);
  uVar11 = (uint)((ulong)uVar22 >> 0x10);
  uVar9 = 0;
  if (bVar19) {
    uVar9 = 0xffff;
  }
  uVar9 = uVar9 & uVar11;
  bVar19 = uVar9 == 0;
  wVar8 = qb3f_9f((word)uVar22,(word)puVar13,uVar11,0x1bbe,0xb4d2);
  uVar11 = 0;
  if (bVar19) {
    uVar11 = 0xffff;
  }
  uVar20 = (uVar11 & uVar9) == 0;
  if ((bool)uVar20) {
    uVar23 = (ulong)wVar8;
    bVar19 = true;
    puVar14 = puVar13;
    puVar13 = (undefined1 *)0xb4d2;
  }
  else {
    qb3f_7b(wVar8,(word)puVar13,uVar11 & uVar9,0xb7f6,(word)puVar13);
    puVar14 = (undefined1 *)&lit_D;
    uVar23 = qb3f_62(0xb49c,0xbc46,dx_00,0xb7f6,(word)puVar13);
    bVar19 = false;
    if ((bool)uVar20) {
      FUN_1000_3dae();
      return;
    }
  }
  wVar10 = 0x52fc;
  wVar8 = qb3f_a7((word)uVar23,(word)puVar14,(word)(uVar23 >> 0x10),0x52fc,(word)puVar13);
  uVar9 = 0;
  if (bVar19) {
    uVar9 = 0xffff;
  }
  uVar11 = 0;
  if (DAT_2000_b534 == 1) {
    uVar11 = 0xffff;
  }
  uVar20 = 0;
  uVar21 = (uVar11 & uVar9) == 0;
  if ((bool)uVar21) {
    wVar8 = 0;
  }
  else {
    DAT_2000_b534 = 0;
    DAT_2000_b536 = 1;
    puVar13 = (undefined1 *)0xb4fa;
    wVar10 = 0xb7ee;
    qb3f_7b(wVar8,uVar9,uVar11 & uVar9,0xb7ee,0xb4fa);
    FUN_1000_3029();
    wVar8 = extraout_DX;
  }
  qb3f_62(0xb49c,0xbc4c,wVar8,wVar10,(word)puVar13);
  wVar8 = extraout_DX_00;
  if ((bool)uVar21) {
    DAT_2000_b538 = 1;
    FUN_1000_19f7();
    wVar8 = extraout_DX_01;
  }
  uVar22 = qb3f_62(0xb49c,0xbc52,wVar8,wVar10,(word)puVar13);
  wVar8 = (word)((ulong)uVar22 >> 0x10);
  if ((bool)uVar21) {
    qb3e_32((word)uVar22,0xffff,wVar8,wVar10,(word)puVar13);
    FUN_1000_b308();
    wVar8 = FUN_1000_b5c8();
    qb3f_61(wVar8,0xbc1a,0xb53a,wVar10,(word)puVar13);
    uVar22 = FUN_1000_a2e5();
    uVar22 = qb3e_32((word)uVar22,0xffff,(word)((ulong)uVar22 >> 0x10),wVar10,(word)puVar13);
    qb3e_0e((word)uVar22,0xbc58,(word)((ulong)uVar22 >> 0x10),wVar10,(word)puVar13);
    wVar8 = extraout_DX_02;
  }
  puVar14 = (undefined1 *)&lit_U;
  uVar23 = qb3f_62(0xb49c,0xbc62,wVar8,wVar10,(word)puVar13);
  if ((bool)uVar21) {
    uVar22 = FUN_1000_10fd();
    puVar14 = (undefined1 *)0x0;
    if (0 < DAT_2000_b53e) {
      puVar14 = (undefined1 *)0xffff;
    }
    bVar19 = DAT_2000_b53e == 0;
    uVar9 = qb3f_a7((word)uVar22,(word)puVar14,(word)((ulong)uVar22 >> 0x10),0xb48c,(word)puVar13);
    uVar11 = 0;
    if (bVar19) {
      uVar11 = 0xffff;
    }
    uVar20 = 0;
    bVar19 = (uVar11 & (uint)puVar14) == 0;
    uVar23 = (ulong)uVar9;
    if (!bVar19) {
      FUN_1000_132a();
      return;
    }
  }
  else {
    bVar19 = false;
  }
  uVar22 = qb3f_a7((word)uVar23,(word)puVar14,(word)(uVar23 >> 0x10),0xb4c6,(word)puVar13);
  puVar13 = (undefined1 *)0x0;
  if (!(bool)uVar20 && !bVar19) {
    puVar13 = (undefined1 *)0xffff;
  }
  pcVar17 = (char *)0xb802;
  uVar9 = qb3f_9f((word)uVar22,(word)puVar13,(word)((ulong)uVar22 >> 0x10),0xb4c6,0xb802);
  uVar11 = 0;
  if ((bool)uVar20) {
    uVar11 = 0xffff;
  }
  uVar11 = uVar11 & (uint)puVar13;
  uVar20 = 0;
  uVar21 = uVar11 == 0;
  if ((bool)uVar21) {
    uVar23 = (ulong)uVar9;
  }
  else {
    puVar13 = (undefined1 *)&lit_D;
    uVar23 = qb3f_62(0xb49c,0xbc46,uVar11,0xb4c6,0xb802);
    if ((bool)uVar21) {
      uVar22 = qb3f_7f((word)uVar23,(word)puVar13,(word)(uVar23 >> 0x10),0xb48c,0xb4c6);
      pcVar17 = (char *)0xb48c;
      qb3f_7d((word)uVar22,(word)puVar13,(word)((ulong)uVar22 >> 0x10),0xb48c,0xb48c);
      uVar23 = FUN_1000_0cc0();
    }
  }
  wVar10 = 0xb4c6;
  qb3f_a7((word)uVar23,(word)puVar13,(word)(uVar23 >> 0x10),0xb4c6,(word)pcVar17);
  wVar8 = dx_01;
  if ((bool)uVar20) {
    puVar13 = (undefined1 *)&lit_U;
    uVar22 = qb3f_62(0xb49c,0xbc62,dx_01,0xb4c6,(word)pcVar17);
    wVar8 = (word)((ulong)uVar22 >> 0x10);
    if ((bool)uVar21) {
      wVar10 = 0xb48c;
      uVar22 = qb3f_7f((word)uVar22,(word)puVar13,wVar8,0xb48c,0xb4c6);
      pcVar17 = (char *)0xb48c;
      qb3f_7d((word)uVar22,(word)puVar13,(word)((ulong)uVar22 >> 0x10),0xb48c,0xb48c);
      FUN_1000_0cc0();
      wVar8 = extraout_DX_03;
    }
  }
  qb3f_62(0xb49c,0xbc68,wVar8,wVar10,(word)pcVar17);
  wVar8 = extraout_DX_04;
  if ((bool)uVar21) {
    DAT_2000_b538 = 1;
    FUN_1000_35ac();
    FUN_1000_3029();
    FUN_1000_3ffc();
    wVar8 = extraout_DX_05;
  }
  qb3f_62(0xb49c,0xb8ac,wVar8,wVar10,(word)pcVar17);
  if ((bool)uVar21) {
    DAT_2000_b538 = 1;
    FUN_1000_3b16();
    FUN_1000_0636();
    return;
  }
  qb3f_62(0xb49c,0xb7e0,dx_02,wVar10,(word)pcVar17);
  if ((bool)uVar21) {
    DAT_2000_b538 = 1;
    FUN_1000_1340();
    return;
  }
  qb3f_62(0xb49c,0xbc6e,dx_03,wVar10,(word)pcVar17);
  if ((bool)uVar21) {
    FUN_1000_1918();
    return;
  }
  wVar8 = qb3f_62(0xb49c,0xb8a6,dx_04,wVar10,(word)pcVar17);
  wVar12 = 0;
  if ((bool)uVar21) {
    wVar12 = 0xffff;
  }
  bVar19 = false;
  qb3f_62(wVar8,0xb4b0,wVar12,wVar10,(word)pcVar17);
  uVar9 = 0;
  if (bVar19) {
    uVar9 = 0xffff;
  }
  bx = (undefined2 *)(uVar9 | dx_05);
  uVar20 = 0;
  uVar21 = bx == (undefined2 *)0x0;
  if (!(bool)uVar21) {
    DAT_2000_b538 = 1;
    FUN_1000_c332();
    FUN_1000_593c();
    FUN_1000_0636();
    return;
  }
  qb3f_62(0xb49c,0xb8b2,dx_05,wVar10,(word)pcVar17);
  wVar8 = extraout_DX_06;
  if ((bool)uVar21) {
    DAT_2000_b538 = 1;
    FUN_1000_7ffb();
    FUN_1000_8fea();
    wVar8 = FUN_1000_593c();
    qb3f_61(wVar8,0xbc1a,0xb49c,wVar10,(word)pcVar17);
    FUN_1000_3ffc();
    wVar8 = extraout_DX_07;
  }
  qb3f_62(0xb49c,0xbc74,wVar8,wVar10,(word)pcVar17);
  wVar8 = extraout_DX_08;
  if ((bool)uVar21) {
    DAT_2000_b536 = 1;
    uVar22 = FUN_1000_3029();
    wVar8 = 1;
    uVar22 = qb3e_42((word)uVar22,1,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    uVar22 = qb3e_44((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    uVar22 = qb3f_bc((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    puVar15 = (undefined *)&lit_Try_delays_between_0_Default_and_3000;
    uVar22 = qb3f_6e((word)uVar22,0xbc7a,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    uVar22 = qb3e_79((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    uVar22 = qb3f_bc((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    puVar15 = (undefined *)&lit_Enter_delay_and_hit_return;
    uVar22 = qb3f_6a((word)uVar22,0xbca6,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    qb3e_79((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    DAT_2000_b540 = 4;
    uVar22 = FUN_1000_21f3();
    qb3f_7b((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb546,0xb542);
    DAT_2000_b536 = 1;
    uVar22 = FUN_1000_3038();
    pcVar17 = (char *)0xbcc6;
    wVar10 = 0xb542;
    uVar22 = qb3f_9f((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb542,0xbcc6);
    wVar8 = (word)((ulong)uVar22 >> 0x10);
    if (!(bool)uVar20 && !(bool)uVar21) {
      pcVar17 = (char *)0xb542;
      wVar10 = 0xbcc6;
      qb3f_7b((word)uVar22,(word)puVar15,wVar8,0xbcc6,0xb542);
      wVar8 = extraout_DX_09;
    }
  }
  qb3f_62(0xb49c,0xbcca,wVar8,wVar10,(word)pcVar17);
  wVar8 = extraout_DX_10;
  if ((bool)uVar21) {
    FUN_1000_7c49();
    DAT_2000_b538 = 1;
    FUN_1000_3029();
    FUN_1000_3ffc();
    wVar8 = extraout_DX_11;
  }
  puVar15 = (undefined *)&lit_W;
  uVar22 = qb3f_62(0xb49c,0xbcd0,wVar8,wVar10,(word)pcVar17);
  if ((bool)uVar21) {
    uVar22 = qb3e_42((word)uVar22,6,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    qb3e_44((word)uVar22,1,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    wVar8 = FUN_1000_7aa1();
    if (DAT_2000_b54a == 1) {
      wVar8 = FUN_1000_0cc0();
    }
    puVar15 = (undefined *)0x0;
    if (5 < DAT_2000_b54c) {
      puVar15 = (undefined *)0xffff;
    }
    uVar9 = 0;
    if (DAT_2000_b54c < 9) {
      uVar9 = 0xffff;
    }
    uVar20 = 0;
    uVar21 = (uVar9 & (uint)puVar15) == 0;
    if (!(bool)uVar21) {
      uVar22 = qb3f_bc(wVar8,(word)puVar15,uVar9 & (uint)puVar15,wVar10,(word)pcVar17);
      puVar15 = (undefined *)&lit_NO_EFFECT;
      uVar22 = qb3f_6e((word)uVar22,0xbcd6,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
      qb3e_79((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
      FUN_1000_2f1a();
    }
    DAT_2000_b538 = 1;
    FUN_1000_3029();
    FUN_1000_3ffc();
  }
  else {
    uVar21 = 0;
  }
  uVar22 = FUN_1000_1055();
  wVar8 = 0xb462;
  qb3f_a7((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb462,(word)pcVar17);
  if (!(bool)uVar21) {
    puVar13 = (undefined1 *)&lit_empty;
    uVar22 = qb3f_62(0xb49c,0xbce4,dx_06,0xb462,(word)pcVar17);
    wVar10 = (word)((ulong)uVar22 >> 0x10);
    if ((bool)uVar21) {
      uVar22 = qb3f_7f((word)uVar22,(word)puVar13,wVar10,0xb46e,0xb7f6);
      qb3f_7d((word)uVar22,(word)puVar13,(word)((ulong)uVar22 >> 0x10),0xb46e,0xb46e);
      uVar22 = FUN_1000_300c();
      pcVar17 = (char *)0xbc2e;
      wVar8 = 0xb46e;
      uVar22 = qb3f_9f((word)uVar22,(word)puVar13,(word)((ulong)uVar22 >> 0x10),0xb46e,0xbc2e);
      wVar10 = (word)((ulong)uVar22 >> 0x10);
      if (!(bool)uVar20 && !(bool)uVar21) {
        pcVar17 = (char *)0xb46e;
        wVar8 = 0xb7ee;
        qb3f_7b((word)uVar22,(word)puVar13,wVar10,0xb7ee,0xb46e);
        wVar10 = extraout_DX_12;
      }
    }
    puVar15 = (undefined *)&lit_empty;
    qb3f_62(0xb49c,0xbcea,wVar10,wVar8,(word)pcVar17);
    if ((bool)uVar21) {
      DAT_2000_b472 = DAT_2000_b472 + 1;
      FUN_1000_300c();
      uVar20 = DAT_2000_b472 < 4;
      uVar21 = DAT_2000_b472 == 4;
      if ((bool)uVar21) {
        DAT_2000_b472 = 2;
      }
    }
    else {
      uVar21 = 0;
    }
  }
  uVar22 = FUN_1000_10be();
LAB_1000_0642:
  qb3f_a7((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb48c,(word)pcVar17);
  if ((bool)uVar21) {
    FUN_1000_12c6();
    return;
  }
  uVar22 = FUN_1000_54cb();
  puVar16 = (undefined2 *)&DAT_2000_bb60;
  wVar8 = 0xb4c6;
  uVar23 = qb3f_9f((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb4c6,0xbb60);
  if (!(bool)uVar20 && !(bool)uVar21) {
    puVar16 = (undefined2 *)0xb4c6;
    wVar8 = qb3f_9f((word)uVar23,0xb4c6,(word)(uVar23 >> 0x10),0xb4ce,0xb4ca);
    wVar10 = 0;
    if ((bool)uVar21) {
      wVar10 = 0xffff;
    }
    bVar19 = false;
    uVar22 = qb3f_9f(wVar8,(word)puVar16,wVar10,0xb4d6,0xb4d2);
    uVar11 = (uint)((ulong)uVar22 >> 0x10);
    uVar9 = 0;
    if (bVar19) {
      uVar9 = 0xffff;
    }
    bVar19 = false;
    bx = (undefined2 *)(uVar9 & uVar11);
    wVar8 = 0xb48c;
    wVar10 = qb3f_9f((word)uVar22,(word)puVar16,uVar11,0xb48c,0xbb64);
    uVar9 = 0;
    if (bVar19) {
      uVar9 = 0xffff;
    }
    uVar20 = 0;
    bVar19 = (uVar9 & (uint)bx) == 0;
    if (bVar19) {
      uVar23 = (ulong)wVar10;
      uVar21 = 1;
      puVar16 = (undefined2 *)0xbb64;
    }
    else {
      wVar10 = qb3f_9f(wVar10,(word)puVar16,uVar9 & (uint)bx,0xb4da,0xb48c);
      wVar12 = 0;
      if (bVar19) {
        wVar12 = 0xffff;
      }
      uVar20 = 0;
      wVar8 = 0xb48c;
      di = (undefined2 *)0xb4da;
      uVar22 = qb3f_7f(wVar10,(word)puVar16,wVar12,0xb48c,0xb7d0);
      bx = di;
      qb3f_a1((word)uVar22,(word)puVar16,(word)((ulong)uVar22 >> 0x10),0xb48c,(word)di);
      uVar9 = 0;
      if ((bool)uVar20) {
        uVar9 = 0xffff;
      }
      uVar20 = 0;
      uVar21 = (uVar9 | dx) == 0;
      if ((bool)uVar21) {
        uVar23 = (ulong)dx << 0x10;
        puVar16 = di;
      }
      else {
        wVar8 = 0xb7f6;
        qb3f_7b(uVar9 | dx,(word)puVar16,dx,0xb7f6,(word)puVar16);
        uVar23 = FUN_1000_567c();
      }
    }
  }
  wVar12 = 0xb7f6;
  uVar22 = qb3d_33((word)uVar23,0xb7f6,(word)(uVar23 >> 0x10),wVar8,(word)puVar16);
  wVar10 = qb3f_91((word)uVar22,wVar12,(word)((ulong)uVar22 >> 0x10),wVar8,0xbb68);
  puVar16 = (undefined2 *)0x1a;
  uVar22 = qb3d_03(wVar10,0x1a,wVar12,wVar8,0xbb68);
  wVar10 = (word)((ulong)uVar22 >> 0x10);
  uVar22 = qb3f_81((word)uVar22,(word)puVar16,wVar10,wVar8,wVar10);
  uVar22 = qb3f_7d((word)uVar22,(word)puVar16,(word)((ulong)uVar22 >> 0x10),wVar8,0x52fc);
  uVar22 = qb3f_9f((word)uVar22,(word)puVar16,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
  if ((bool)uVar20) {
    wVar10 = 2;
    wVar8 = qb3e_42((word)uVar22,2,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
    bx = (undefined2 *)0x1;
    uVar22 = qb3e_44(wVar8,1,wVar10,0x52fc,0xbb6c);
    uVar22 = qb3f_bc((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
    wVar8 = 0x28;
    uVar22 = qb3d_0d((word)uVar22,0x28,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
    uVar22 = qb3f_6e((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
    uVar22 = qb3e_79((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
    wVar8 = (word)((ulong)uVar22 >> 0x10);
    uVar22 = qb3e_42((word)uVar22,wVar8,wVar8,0x52fc,0xbb6c);
    puVar16 = bx;
    uVar22 = qb3e_44((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
  }
  uVar22 = qb3f_9f((word)uVar22,(word)puVar16,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb7f6);
  wVar8 = 0;
  if ((bool)uVar21) {
    wVar8 = 0xffff;
  }
  uVar22 = qb3f_73((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4de,0xb7f6);
  uVar22 = qb3f_82((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4de,0xb4e2);
  uVar22 = qb3f_72((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xbb70);
  wVar10 = qb3f_23((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xbb70);
  uVar22 = qb3f_25(wVar10,wVar8,0xb4ea,0xb4ea,0xbb70);
  uVar22 = qb3f_27((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xbb74,0xbb70);
  uVar22 = qb3f_91((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xbb74,0xbb78);
  wVar10 = (word)((ulong)uVar22 >> 0x10);
  uVar22 = qb3f_71((word)uVar22,wVar8,wVar10,wVar10,0xbb7c);
  uVar22 = qb3f_23((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar10,0xbb7c);
  uVar22 = qb3f_91((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar10,48000);
  uVar22 = qb3f_85((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar10,48000);
  uVar22 = qb3f_81((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar10,0xbb84);
  uVar22 = qb3f_74((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar10,0xbb84);
  uVar22 = qb3f_a6((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar10,0xbb84);
  puVar2 = (uint *)(unaff_BP + wVar10 + 0x23);
  uVar11 = *puVar2;
  *puVar2 = *puVar2 + (int)bx;
  uVar9 = *puVar2;
  piVar1 = (int *)(unaff_BP + -0x447c);
  bVar6 = (byte)bx & 0x1f;
  iVar7 = *piVar1;
  *piVar1 = *piVar1 << bVar6;
  bVar4 = ((uint)bx & 0x1f) == 0;
  bVar19 = ((uint)bx & 0x1f) != 0;
  bVar18 = (byte)bx & 0x1f;
  cVar3 = DAT_2000_bb87 << bVar18;
  bVar5 = ((uint)bx & 0x1f) == 0;
  bVar18 = bVar5 * (bVar4 * CARRY2(uVar11,(uint)bx) | !bVar4 * (iVar7 << bVar6 - 1 < 0)) |
           !bVar5 * ((char)(DAT_2000_bb87 << bVar18 - 1) < '\0');
  bVar4 = ((uint)bx & 0x1f) != 0;
  uVar20 = !bVar4 && (!bVar19 && uVar9 == 0 || bVar19 && *piVar1 == 0) || bVar4 && cVar3 == '\0';
  DAT_2000_bb87 = cVar3;
  uVar22 = qb3f_8f((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xbba6);
  uVar22 = qb3f_a1((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xb4f2);
  puVar15 = (undefined *)0x0;
  if (!(bool)bVar18 && !(bool)uVar20) {
    puVar15 = (undefined *)0xffff;
    uVar20 = 0;
  }
  wVar8 = qb3f_9f((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb7d8);
  uVar9 = 0;
  if ((bool)uVar20) {
    uVar9 = 0xffff;
  }
  if ((uVar9 & (uint)puVar15) == 0) {
    uVar23 = (ulong)wVar8;
  }
  else {
    uVar22 = qb3f_bc(wVar8,(word)puVar15,uVar9 & (uint)puVar15,0x52fc,0xb7d8);
    puVar15 = (undefined *)&lit_You_could_use_a_cure;
    uVar22 = qb3f_6e((word)uVar22,0xbbaa,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb7d8);
    uVar23 = qb3e_79((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb7d8);
  }
  uVar22 = qb3f_ab((word)uVar23,(word)puVar15,(word)(uVar23 >> 0x10),0xb4ea,0xb7d8);
  puVar2 = (uint *)(puVar15 + (int)(undefined2 *)&DAT_2000_b7d7 + 1);
  uVar20 = 0x4827 < *puVar2;
  *puVar2 = *puVar2 + 0xb7d8;
  uVar21 = *puVar2 == 0;
  uVar22 = qb3f_81((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xb7d8);
  uVar22 = qb3f_a1((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xb48c);
  pcVar17 = (char *)0x0;
  if ((bool)uVar20) {
    pcVar17 = (char *)0xffff;
    uVar21 = 0;
  }
  wVar8 = qb3f_9f((word)uVar22,(word)pcVar17,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb60);
  uVar9 = 0;
  if ((bool)uVar21) {
    uVar9 = 0xffff;
  }
  uVar20 = 0;
  uVar21 = (uVar9 & (uint)pcVar17) == 0;
  if ((bool)uVar21) {
    uVar23 = (ulong)wVar8;
  }
  else {
    uVar22 = qb3f_bc(wVar8,(word)pcVar17,uVar9 & (uint)pcVar17,0x52fc,0xbb60);
    pcVar17 = (char *)s_You_could_use_a_cure_W__2000_bbae + 0x16;
    uVar22 = qb3f_6e((word)uVar22,0xbbc4,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb60);
    uVar23 = qb3e_79((word)uVar22,(word)pcVar17,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb60);
  }
  uVar22 = qb3f_a7((word)uVar23,(word)pcVar17,(word)(uVar23 >> 0x10),0xb4f6,0xbb60);
  puVar15 = (undefined *)0x0;
  if (!(bool)uVar20 && !(bool)uVar21) {
    puVar15 = (undefined *)0xffff;
    uVar21 = 0;
  }
  wVar8 = qb3f_9f((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb802);
  uVar9 = 0;
  if ((bool)uVar21) {
    uVar9 = 0xffff;
  }
  uVar20 = (uVar9 & (uint)puVar15) == 0;
  if ((bool)uVar20) {
    uVar23 = (ulong)wVar8;
  }
  else {
    uVar22 = qb3f_bc(wVar8,(word)puVar15,uVar9 & (uint)puVar15,0x52fc,0xb802);
    puVar15 = (undefined *)&lit_Go_to_bank_to_cash_in_treasure;
    uVar22 = qb3f_6e((word)uVar22,0xbbf0,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb802);
    uVar23 = qb3e_79((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb802);
  }
  uVar22 = qb3f_9f((word)uVar23,(word)puVar15,(word)(uVar23 >> 0x10),0xb48c,0xbb64);
  uVar9 = 0;
  if ((bool)uVar20) {
    uVar9 = 0xffff;
  }
  bVar19 = false;
  wVar8 = qb3f_9f((word)uVar22,uVar9,(word)((ulong)uVar22 >> 0x10),0x1bba,0xb4ca);
  uVar11 = 0;
  if (bVar19) {
    uVar11 = 0xffff;
  }
  bVar19 = (uVar11 & uVar9) == 0;
  pcVar17 = (char *)0xb4d2;
  wVar10 = 0x1bbe;
  uVar22 = qb3f_9f(wVar8,uVar9,uVar11 & uVar9,0x1bbe,0xb4d2);
  uVar9 = 0;
  if (bVar19) {
    uVar9 = 0xffff;
  }
  wVar8 = uVar9 & (uint)((ulong)uVar22 >> 0x10);
  uVar21 = wVar8 == 0;
  if (!(bool)uVar21) {
    uVar22 = FUN_1000_3d83();
  }
  do {
    wVar12 = qb3d_06((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar10,(word)pcVar17);
    uVar22 = qb3f_61(wVar12,wVar8,0xb49c,wVar10,(word)pcVar17);
    uVar22 = qb3f_7b((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xbc12,0xb4fa);
    pcVar17 = (char *)s_Go_to_bank_to_cash_in_treasure_2000_bbf4 + 0x1e;
    wVar10 = 0xb48c;
    uVar22 = qb3f_9f((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb48c,0xbc12);
    wVar12 = (word)((ulong)uVar22 >> 0x10);
    if (!(bool)uVar21) {
      uVar22 = qb3f_7f((word)uVar22,wVar8,wVar12,0xb4fe,0xb7f6);
      wVar8 = 0xb7f6;
      uVar22 = qb3f_71((word)uVar22,0xb7f6,(word)((ulong)uVar22 >> 0x10),0xb4fe,0xb502);
      wVar10 = qb3f_a1((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4fe,0xb502);
      wVar12 = 0;
      if ((bool)uVar21) {
        wVar12 = 0xffff;
      }
      bVar19 = false;
      di_00 = 0xb506;
      uVar22 = qb3f_9f(wVar10,wVar8,wVar12,0xb7b0,0xb506);
      uVar11 = (uint)((ulong)uVar22 >> 0x10);
      uVar9 = 0;
      if (bVar19) {
        uVar9 = 0xffff;
      }
      bx = (undefined2 *)(uVar9 | uVar11);
      uVar20 = 0;
      uVar21 = bx == (undefined2 *)0x0;
      if (!(bool)uVar21) {
        wVar10 = wVar8;
        uVar22 = qb3f_6f((word)uVar22,wVar8,uVar11,wVar8,0xb506);
        while( true ) {
          uVar22 = qb3f_7d((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),wVar8,0x4e28);
          di_00 = 0xbc16;
          uVar22 = qb3f_9f((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0x4e28,0xbc16);
          wVar8 = wVar10;
          if (!(bool)uVar20 && !(bool)uVar21) break;
          wVar8 = 0x4e28;
          uVar22 = qb3f_7f((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0x4e28,0xb7f6);
        }
      }
      uVar22 = FUN_1000_7eec();
      qb3f_75((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4d2,di_00);
      wVar12 = (word)((long)(int)wVar8 * 0x16);
      wVar10 = 0xb4ca;
      uVar22 = qb3f_75(wVar12,wVar8,(word)((ulong)((long)(int)wVar8 * 0x16) >> 0x10),0xb4ca,wVar12);
      wVar12 = (word)((ulong)uVar22 >> 0x10);
      puVar15 = (undefined *)(wVar8 + (int)uVar22);
      pcVar17 = (char *)((int)puVar15 * 2);
      uVar20 = 0;
      uVar21 = *(int *)(pcVar17 + 0x4e90) == 0;
      if (0 < *(int *)(pcVar17 + 0x4e90)) break;
    }
    wVar8 = 0xbc1a;
    uVar22 = qb3f_62(0xb49c,0xbc1a,wVar12,wVar10,(word)pcVar17);
    if (!(bool)uVar21) {
      qb3f_75((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4d2,(word)pcVar17);
      wVar10 = (word)((long)(int)wVar8 * 0x16);
      iVar7 = qb3f_75(wVar10,wVar8,(word)((ulong)((long)(int)wVar8 * 0x16) >> 0x10),0xb4ca,wVar10);
      wVar8 = wVar8 + iVar7;
      wVar10 = wVar8 * 2;
      uVar20 = 0;
      uVar21 = *(int *)(wVar10 + 0x4e90) == 0;
      if (0 < *(int *)(wVar10 + 0x4e90)) {
        FUN_1000_3ffc();
      }
      uVar22 = FUN_1000_5417();
      uVar22 = qb3f_a7((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb50a,wVar10);
      if ((bool)uVar21) {
        qb3f_75((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb48c,wVar10);
        wVar10 = (word)((long)(int)wVar8 * 0x15);
        uVar22 = qb3f_75(wVar10,wVar8,(word)((ulong)((long)(int)wVar8 * 0x15) >> 0x10),0xb4d2,wVar10
                        );
        uVar9 = (wVar10 + wVar8) * 4;
        uVar20 = 0x64f9 < uVar9;
        wVar10 = uVar9 + 0x9b06;
        uVar21 = wVar10 == 0;
        uVar22 = qb3f_97((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xbc1e,0xb4ca);
        uVar22 = qb3f_27((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb7d8,0xb4ca);
        wVar8 = wVar10;
        uVar22 = qb3f_83((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),wVar10,0xb4ca);
        uVar22 = qb3f_7d((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar10,wVar8);
      }
      else {
        uVar21 = 0;
      }
      uVar22 = qb3f_7b((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xbc22,0xb50e);
      uVar22 = qb3f_9f((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb48c,0xbc22);
      wVar8 = 0;
      if ((bool)uVar21) {
        wVar8 = 0xffff;
      }
      wVar10 = qb3f_9f((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4c6,0xb7f6);
      uVar9 = 0;
      if ((bool)uVar20) {
        uVar9 = 0xffff;
      }
      if ((uVar9 & wVar8) != 0) {
        qb3f_7b(wVar10,wVar8,uVar9 & wVar8,0xbc26,0xb4c6);
      }
      uVar22 = FUN_1000_3b02();
      qb3f_7b((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xbc2a,0xb512);
      FUN_1000_09e8();
      FUN_1000_0cd2();
      return;
    }
  } while( true );
  uVar22 = FUN_1000_3ffc();
  goto LAB_1000_0642;
}


// ==== FUN_1000_1055 @ 1000:1055 (size 105) callers: FUN_1000_0cd2

void __cdecl16near FUN_1000_1055(void)

{
  word in_DX;
  word bx;
  char *bx_00;
  word wVar1;
  undefined *puVar2;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_ZF;
  undefined4 uVar3;
  
  uVar3 = qb3f_62(0xb49c,0xbcf0,in_DX,unaff_SI,unaff_DI);
  if ((bool)in_ZF) {
    DAT_2000_b4bc = DAT_2000_b4bc + 1;
    if (DAT_2000_b4bc == 2) {
      DAT_2000_b4bc = 0;
    }
    bx = 1;
    uVar3 = qb3e_42((word)uVar3,1,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
    uVar3 = qb3e_44((word)uVar3,bx,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
    wVar1 = (word)((ulong)uVar3 >> 0x10);
    if (DAT_2000_b4bc == 0) {
      uVar3 = qb3f_bc((word)uVar3,bx,wVar1,unaff_SI,unaff_DI);
      puVar2 = (undefined *)&lit_SOUND_ON;
      uVar3 = qb3f_6a((word)uVar3,0xbcf6,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
      qb3e_79((word)uVar3,(word)puVar2,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
    }
    else {
      uVar3 = qb3f_bc((word)uVar3,bx,wVar1,unaff_SI,unaff_DI);
      bx_00 = (char *)s_SOUND_ON_2000_bcfa + 8;
      uVar3 = qb3f_6a((word)uVar3,0xbd02,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
      qb3e_79((word)uVar3,(word)bx_00,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
    }
    uVar3 = FUN_1000_2f1a();
    wVar1 = 1;
    uVar3 = qb3e_42((word)uVar3,1,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
    uVar3 = qb3e_44((word)uVar3,wVar1,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
    uVar3 = qb3f_bc((word)uVar3,wVar1,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
    puVar2 = (undefined *)&lit_empty;
    uVar3 = qb3f_6a((word)uVar3,0xbd10,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
    qb3e_79((word)uVar3,(word)puVar2,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  }
  return;
}


// ==== FUN_1000_10be @ 1000:10be (size 63) callers: FUN_1000_0cd2,FUN_1000_803a

void __cdecl16near FUN_1000_10be(void)

{
  word in_DX;
  word ax;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_ZF;
  undefined1 uVar1;
  undefined4 uVar2;
  
  uVar2 = qb3f_62(0xb49c,0xbc1a,in_DX,unaff_SI,unaff_DI);
  ax = (word)uVar2;
  if (!(bool)in_ZF) {
    uVar2 = qb3f_bb(ax,ax,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
    uVar1 = ax == 0x1b;
    if ((bool)uVar1) {
      uVar2 = qb3f_7f((word)uVar2,0x1b,(word)((ulong)uVar2 >> 0x10),0xb524,0xb7f6);
      uVar2 = qb3f_7d((word)uVar2,ax,(word)((ulong)uVar2 >> 0x10),0xb524,0xb524);
      uVar2 = qb3f_9f((word)uVar2,ax,(word)((ulong)uVar2 >> 0x10),0xb524,0xb7d8);
      if ((bool)uVar1) {
        qb3f_7b((word)uVar2,ax,(word)((ulong)uVar2 >> 0x10),0xb7ee,0xb524);
      }
    }
  }
  return;
}


// ==== FUN_1000_10fd @ 1000:10fd (size 457) callers: FUN_1000_0cd2,FUN_1000_12c6

void __cdecl16near FUN_1000_10fd(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  uint uVar2;
  word in_BX;
  uint uVar3;
  undefined1 in_ZF;
  bool bVar4;
  undefined4 uVar5;
  
  DAT_2000_b53e = 0;
  uVar5 = qb3f_9f(in_AX,in_BX,in_DX,0xb4ca,0xbb68);
  uVar3 = 0;
  if ((bool)in_ZF) {
    uVar3 = 0xffff;
  }
  bVar4 = false;
  wVar1 = qb3f_9f((word)uVar5,uVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xbb60);
  uVar2 = 0;
  if (bVar4) {
    uVar2 = 0xffff;
  }
  bVar4 = (uVar2 & uVar3) == 0;
  if (!bVar4) {
    DAT_2000_b53e = 1;
  }
  uVar5 = qb3f_9f(wVar1,uVar3,uVar2 & uVar3,0xb4ca,0xbb60);
  uVar3 = 0;
  if (bVar4) {
    uVar3 = 0xffff;
  }
  bVar4 = false;
  wVar1 = qb3f_9f((word)uVar5,uVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xb7d8);
  uVar2 = 0;
  if (bVar4) {
    uVar2 = 0xffff;
  }
  bVar4 = (uVar2 & uVar3) == 0;
  if (!bVar4) {
    DAT_2000_b53e = 2;
  }
  uVar5 = qb3f_9f(wVar1,uVar3,uVar2 & uVar3,0xb4ca,0xbd1e);
  uVar3 = 0;
  if (bVar4) {
    uVar3 = 0xffff;
  }
  bVar4 = false;
  wVar1 = qb3f_9f((word)uVar5,uVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xbd22);
  uVar2 = 0;
  if (bVar4) {
    uVar2 = 0xffff;
  }
  bVar4 = (uVar2 & uVar3) == 0;
  if (!bVar4) {
    DAT_2000_b53e = 3;
  }
  uVar5 = qb3f_9f(wVar1,uVar3,uVar2 & uVar3,0xb4ca,0xbd26);
  uVar3 = 0;
  if (bVar4) {
    uVar3 = 0xffff;
  }
  bVar4 = false;
  wVar1 = qb3f_9f((word)uVar5,uVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xbb60);
  uVar2 = 0;
  if (bVar4) {
    uVar2 = 0xffff;
  }
  bVar4 = (uVar2 & uVar3) == 0;
  if (!bVar4) {
    DAT_2000_b53e = 4;
  }
  uVar5 = qb3f_9f(wVar1,uVar3,uVar2 & uVar3,0xb4ca,0xbb68);
  uVar3 = 0;
  if (bVar4) {
    uVar3 = 0xffff;
  }
  bVar4 = false;
  wVar1 = qb3f_9f((word)uVar5,uVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xb7f2);
  uVar2 = 0;
  if (bVar4) {
    uVar2 = 0xffff;
  }
  bVar4 = (uVar2 & uVar3) == 0;
  if (!bVar4) {
    DAT_2000_b53e = 5;
  }
  uVar5 = qb3f_9f(wVar1,uVar3,uVar2 & uVar3,0xb4ca,0xbd2a);
  uVar3 = 0;
  if (bVar4) {
    uVar3 = 0xffff;
  }
  bVar4 = false;
  wVar1 = qb3f_9f((word)uVar5,uVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xbd2e);
  uVar2 = 0;
  if (bVar4) {
    uVar2 = 0xffff;
  }
  bVar4 = (uVar2 & uVar3) == 0;
  if (!bVar4) {
    DAT_2000_b53e = 5;
  }
  uVar5 = qb3f_9f(wVar1,uVar3,uVar2 & uVar3,0xb4ca,0xbd1e);
  uVar3 = 0;
  if (bVar4) {
    uVar3 = 0xffff;
  }
  bVar4 = false;
  wVar1 = qb3f_9f((word)uVar5,uVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xbb60);
  uVar2 = 0;
  if (bVar4) {
    uVar2 = 0xffff;
  }
  bVar4 = (uVar2 & uVar3) == 0;
  if (!bVar4) {
    DAT_2000_b53e = 6;
  }
  uVar5 = qb3f_9f(wVar1,uVar3,uVar2 & uVar3,0xb4ca,0xbd26);
  uVar3 = 0;
  if (bVar4) {
    uVar3 = 0xffff;
  }
  bVar4 = false;
  wVar1 = qb3f_9f((word)uVar5,uVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xbd1e);
  uVar2 = 0;
  if (bVar4) {
    uVar2 = 0xffff;
  }
  bVar4 = (uVar2 & uVar3) == 0;
  if (!bVar4) {
    DAT_2000_b53e = 6;
  }
  uVar5 = qb3f_9f(wVar1,uVar3,uVar2 & uVar3,0xb4ca,0xb7d8);
  uVar3 = 0;
  if (bVar4) {
    uVar3 = 0xffff;
  }
  bVar4 = false;
  wVar1 = qb3f_9f((word)uVar5,uVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xbd32);
  uVar2 = 0;
  if (bVar4) {
    uVar2 = 0xffff;
  }
  bVar4 = (uVar2 & uVar3) == 0;
  if (!bVar4) {
    DAT_2000_b53e = 6;
  }
  uVar5 = qb3f_9f(wVar1,uVar3,uVar2 & uVar3,0xb4ca,0xb7fa);
  uVar3 = 0;
  if (bVar4) {
    uVar3 = 0xffff;
  }
  bVar4 = false;
  qb3f_9f((word)uVar5,uVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xbd2a);
  uVar2 = 0;
  if (bVar4) {
    uVar2 = 0xffff;
  }
  if ((uVar2 & uVar3) != 0) {
    DAT_2000_b53e = 7;
  }
  return;
}


// ==== FUN_1000_12c6 @ 1000:12c6 (size 100) callers: FUN_1000_0636

void FUN_1000_12c6(void)

{
  int *piVar1;
  uint *puVar2;
  char cVar3;
  bool bVar4;
  bool bVar5;
  byte bVar6;
  int iVar7;
  word wVar8;
  undefined2 *di;
  undefined2 *in_CX;
  uint dx;
  uint uVar9;
  uint uVar10;
  undefined2 extraout_DX;
  word wVar11;
  char *pcVar12;
  word wVar13;
  undefined *puVar14;
  undefined1 *bx;
  int unaff_BP;
  word unaff_SI;
  undefined2 *puVar15;
  word di_00;
  word unaff_DI;
  undefined2 unaff_SS;
  byte bVar16;
  undefined1 uVar17;
  bool bVar18;
  undefined1 uVar19;
  undefined1 uVar20;
  ulong uVar21;
  undefined4 uVar22;
  
  uVar22 = FUN_1000_10fd();
  wVar8 = (word)((ulong)uVar22 >> 0x10);
  uVar17 = 0;
  uVar20 = DAT_2000_b53e == 0;
  if ((bool)uVar20) {
    wVar13 = 1;
    uVar22 = qb3e_42((word)uVar22,1,wVar8,unaff_SI,unaff_DI);
    uVar22 = qb3e_44((word)uVar22,wVar13,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    uVar22 = qb3f_bc((word)uVar22,wVar13,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    bx = (undefined1 *)0x28;
    uVar22 = qb3d_0d((word)uVar22,0x28,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    uVar22 = qb3f_6e((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    qb3e_79((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
  }
  else {
    wVar13 = 1;
    uVar22 = qb3e_42((word)uVar22,1,wVar8,unaff_SI,unaff_DI);
    uVar22 = qb3e_44((word)uVar22,wVar13,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    wVar8 = qb3f_bc((word)uVar22,wVar13,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    puVar14 = (undefined *)&lit_There_s_a_rope_above_Hit_U_to_climb_it;
    uVar22 = qb3f_6e(wVar8,0xbd36,wVar13,unaff_SI,unaff_DI);
    uVar22 = qb3e_79((word)uVar22,(word)puVar14,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    DAT_2000_4e08 = 0x28;
    uVar22 = qb3e_42((word)uVar22,0x10,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    wVar8 = 0x1d;
    uVar22 = qb3e_44((word)uVar22,0x1d,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    uVar22 = qb3f_bc((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    bx = (undefined1 *)&lit_ROPE;
    uVar22 = qb3f_6e((word)uVar22,0xbd62,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    qb3e_79((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),unaff_SI,unaff_DI);
    DAT_2000_b54e = extraout_DX;
  }
LAB_1000_064d:
  uVar22 = FUN_1000_54cb();
  puVar15 = (undefined2 *)&DAT_2000_bb60;
  wVar8 = 0xb4c6;
  uVar21 = qb3f_9f((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb4c6,0xbb60);
  if (!(bool)uVar17 && !(bool)uVar20) {
    puVar15 = (undefined2 *)0xb4c6;
    wVar8 = qb3f_9f((word)uVar21,0xb4c6,(word)(uVar21 >> 0x10),0xb4ce,0xb4ca);
    wVar13 = 0;
    if ((bool)uVar20) {
      wVar13 = 0xffff;
    }
    bVar18 = false;
    uVar22 = qb3f_9f(wVar8,(word)puVar15,wVar13,0xb4d6,0xb4d2);
    uVar10 = (uint)((ulong)uVar22 >> 0x10);
    uVar9 = 0;
    if (bVar18) {
      uVar9 = 0xffff;
    }
    bVar18 = false;
    in_CX = (undefined2 *)(uVar9 & uVar10);
    wVar8 = 0xb48c;
    wVar13 = qb3f_9f((word)uVar22,(word)puVar15,uVar10,0xb48c,0xbb64);
    uVar9 = 0;
    if (bVar18) {
      uVar9 = 0xffff;
    }
    uVar17 = 0;
    bVar18 = (uVar9 & (uint)in_CX) == 0;
    if (bVar18) {
      uVar21 = (ulong)wVar13;
      uVar20 = 1;
      puVar15 = (undefined2 *)0xbb64;
    }
    else {
      wVar13 = qb3f_9f(wVar13,(word)puVar15,uVar9 & (uint)in_CX,0xb4da,0xb48c);
      wVar11 = 0;
      if (bVar18) {
        wVar11 = 0xffff;
      }
      uVar20 = 0;
      wVar8 = 0xb48c;
      di = (undefined2 *)0xb4da;
      uVar22 = qb3f_7f(wVar13,(word)puVar15,wVar11,0xb48c,0xb7d0);
      in_CX = di;
      qb3f_a1((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb48c,(word)di);
      uVar9 = 0;
      if ((bool)uVar20) {
        uVar9 = 0xffff;
      }
      uVar17 = 0;
      uVar20 = (uVar9 | dx) == 0;
      if ((bool)uVar20) {
        uVar21 = (ulong)dx << 0x10;
        puVar15 = di;
      }
      else {
        wVar8 = 0xb7f6;
        qb3f_7b(uVar9 | dx,(word)puVar15,dx,0xb7f6,(word)puVar15);
        uVar21 = FUN_1000_567c();
      }
    }
  }
  wVar11 = 0xb7f6;
  uVar22 = qb3d_33((word)uVar21,0xb7f6,(word)(uVar21 >> 0x10),wVar8,(word)puVar15);
  wVar13 = qb3f_91((word)uVar22,wVar11,(word)((ulong)uVar22 >> 0x10),wVar8,0xbb68);
  puVar15 = (undefined2 *)0x1a;
  uVar22 = qb3d_03(wVar13,0x1a,wVar11,wVar8,0xbb68);
  wVar13 = (word)((ulong)uVar22 >> 0x10);
  uVar22 = qb3f_81((word)uVar22,(word)puVar15,wVar13,wVar8,wVar13);
  uVar22 = qb3f_7d((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),wVar8,0x52fc);
  uVar22 = qb3f_9f((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
  if ((bool)uVar17) {
    wVar13 = 2;
    wVar8 = qb3e_42((word)uVar22,2,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
    in_CX = (undefined2 *)0x1;
    uVar22 = qb3e_44(wVar8,1,wVar13,0x52fc,0xbb6c);
    uVar22 = qb3f_bc((word)uVar22,(word)in_CX,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
    wVar8 = 0x28;
    uVar22 = qb3d_0d((word)uVar22,0x28,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
    uVar22 = qb3f_6e((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
    uVar22 = qb3e_79((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
    wVar8 = (word)((ulong)uVar22 >> 0x10);
    uVar22 = qb3e_42((word)uVar22,wVar8,wVar8,0x52fc,0xbb6c);
    puVar15 = in_CX;
    uVar22 = qb3e_44((word)uVar22,(word)in_CX,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb6c);
  }
  uVar22 = qb3f_9f((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb7f6);
  wVar8 = 0;
  if ((bool)uVar20) {
    wVar8 = 0xffff;
  }
  uVar22 = qb3f_73((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4de,0xb7f6);
  uVar22 = qb3f_82((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4de,0xb4e2);
  uVar22 = qb3f_72((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xbb70);
  wVar13 = qb3f_23((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xbb70);
  uVar22 = qb3f_25(wVar13,wVar8,0xb4ea,0xb4ea,0xbb70);
  uVar22 = qb3f_27((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xbb74,0xbb70);
  uVar22 = qb3f_91((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xbb74,0xbb78);
  wVar13 = (word)((ulong)uVar22 >> 0x10);
  uVar22 = qb3f_71((word)uVar22,wVar8,wVar13,wVar13,0xbb7c);
  uVar22 = qb3f_23((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar13,0xbb7c);
  uVar22 = qb3f_91((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar13,48000);
  uVar22 = qb3f_85((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar13,48000);
  uVar22 = qb3f_81((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar13,0xbb84);
  uVar22 = qb3f_74((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar13,0xbb84);
  uVar22 = qb3f_a6((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar13,0xbb84);
  puVar2 = (uint *)(unaff_BP + wVar13 + 0x23);
  uVar9 = *puVar2;
  *puVar2 = *puVar2 + (int)in_CX;
  uVar10 = *puVar2;
  piVar1 = (int *)(unaff_BP + -0x447c);
  bVar6 = (byte)in_CX & 0x1f;
  iVar7 = *piVar1;
  *piVar1 = *piVar1 << bVar6;
  bVar4 = ((uint)in_CX & 0x1f) == 0;
  bVar18 = ((uint)in_CX & 0x1f) != 0;
  bVar16 = (byte)in_CX & 0x1f;
  cVar3 = DAT_2000_bb87 << bVar16;
  bVar5 = ((uint)in_CX & 0x1f) == 0;
  bVar16 = bVar5 * (bVar4 * CARRY2(uVar9,(uint)in_CX) | !bVar4 * (iVar7 << bVar6 - 1 < 0)) |
           !bVar5 * ((char)(DAT_2000_bb87 << bVar16 - 1) < '\0');
  bVar4 = ((uint)in_CX & 0x1f) != 0;
  uVar20 = !bVar4 && (!bVar18 && uVar10 == 0 || bVar18 && *piVar1 == 0) || bVar4 && cVar3 == '\0';
  DAT_2000_bb87 = cVar3;
  uVar22 = qb3f_8f((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xbba6);
  uVar22 = qb3f_a1((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xb4f2);
  puVar14 = (undefined *)0x0;
  if (!(bool)bVar16 && !(bool)uVar20) {
    puVar14 = (undefined *)0xffff;
    uVar20 = 0;
  }
  wVar8 = qb3f_9f((word)uVar22,(word)puVar14,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb7d8);
  uVar9 = 0;
  if ((bool)uVar20) {
    uVar9 = 0xffff;
  }
  if ((uVar9 & (uint)puVar14) == 0) {
    uVar21 = (ulong)wVar8;
  }
  else {
    uVar22 = qb3f_bc(wVar8,(word)puVar14,uVar9 & (uint)puVar14,0x52fc,0xb7d8);
    puVar14 = (undefined *)&lit_You_could_use_a_cure;
    uVar22 = qb3f_6e((word)uVar22,0xbbaa,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb7d8);
    uVar21 = qb3e_79((word)uVar22,(word)puVar14,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb7d8);
  }
  uVar22 = qb3f_ab((word)uVar21,(word)puVar14,(word)(uVar21 >> 0x10),0xb4ea,0xb7d8);
  puVar2 = (uint *)(puVar14 + (int)(undefined2 *)&DAT_2000_b7d7 + 1);
  uVar20 = 0x4827 < *puVar2;
  *puVar2 = *puVar2 + 0xb7d8;
  uVar17 = *puVar2 == 0;
  uVar22 = qb3f_81((word)uVar22,(word)puVar14,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xb7d8);
  uVar22 = qb3f_a1((word)uVar22,(word)puVar14,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xb48c);
  pcVar12 = (char *)0x0;
  if ((bool)uVar20) {
    pcVar12 = (char *)0xffff;
    uVar17 = 0;
  }
  wVar8 = qb3f_9f((word)uVar22,(word)pcVar12,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb60);
  uVar9 = 0;
  if ((bool)uVar17) {
    uVar9 = 0xffff;
  }
  uVar20 = 0;
  uVar17 = (uVar9 & (uint)pcVar12) == 0;
  if ((bool)uVar17) {
    uVar21 = (ulong)wVar8;
  }
  else {
    uVar22 = qb3f_bc(wVar8,(word)pcVar12,uVar9 & (uint)pcVar12,0x52fc,0xbb60);
    pcVar12 = (char *)s_You_could_use_a_cure_W__2000_bbae + 0x16;
    uVar22 = qb3f_6e((word)uVar22,0xbbc4,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb60);
    uVar21 = qb3e_79((word)uVar22,(word)pcVar12,(word)((ulong)uVar22 >> 0x10),0x52fc,0xbb60);
  }
  uVar22 = qb3f_a7((word)uVar21,(word)pcVar12,(word)(uVar21 >> 0x10),0xb4f6,0xbb60);
  puVar14 = (undefined *)0x0;
  if (!(bool)uVar20 && !(bool)uVar17) {
    puVar14 = (undefined *)0xffff;
    uVar17 = 0;
  }
  wVar8 = qb3f_9f((word)uVar22,(word)puVar14,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb802);
  uVar9 = 0;
  if ((bool)uVar17) {
    uVar9 = 0xffff;
  }
  uVar20 = (uVar9 & (uint)puVar14) == 0;
  if ((bool)uVar20) {
    uVar21 = (ulong)wVar8;
  }
  else {
    uVar22 = qb3f_bc(wVar8,(word)puVar14,uVar9 & (uint)puVar14,0x52fc,0xb802);
    puVar14 = (undefined *)&lit_Go_to_bank_to_cash_in_treasure;
    uVar22 = qb3f_6e((word)uVar22,0xbbf0,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb802);
    uVar21 = qb3e_79((word)uVar22,(word)puVar14,(word)((ulong)uVar22 >> 0x10),0x52fc,0xb802);
  }
  uVar22 = qb3f_9f((word)uVar21,(word)puVar14,(word)(uVar21 >> 0x10),0xb48c,0xbb64);
  uVar9 = 0;
  if ((bool)uVar20) {
    uVar9 = 0xffff;
  }
  bVar18 = false;
  wVar8 = qb3f_9f((word)uVar22,uVar9,(word)((ulong)uVar22 >> 0x10),0x1bba,0xb4ca);
  uVar10 = 0;
  if (bVar18) {
    uVar10 = 0xffff;
  }
  bVar18 = (uVar10 & uVar9) == 0;
  pcVar12 = (char *)0xb4d2;
  wVar13 = 0x1bbe;
  uVar22 = qb3f_9f(wVar8,uVar9,uVar10 & uVar9,0x1bbe,0xb4d2);
  uVar9 = 0;
  if (bVar18) {
    uVar9 = 0xffff;
  }
  wVar8 = uVar9 & (uint)((ulong)uVar22 >> 0x10);
  uVar19 = wVar8 == 0;
  if (!(bool)uVar19) {
    uVar22 = FUN_1000_3d83();
  }
  do {
    wVar11 = qb3d_06((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar13,(word)pcVar12);
    uVar22 = qb3f_61(wVar11,wVar8,0xb49c,wVar13,(word)pcVar12);
    uVar22 = qb3f_7b((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xbc12,0xb4fa);
    pcVar12 = (char *)s_Go_to_bank_to_cash_in_treasure_2000_bbf4 + 0x1e;
    wVar13 = 0xb48c;
    uVar22 = qb3f_9f((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb48c,0xbc12);
    wVar11 = (word)((ulong)uVar22 >> 0x10);
    if (!(bool)uVar19) {
      uVar22 = qb3f_7f((word)uVar22,wVar8,wVar11,0xb4fe,0xb7f6);
      wVar8 = 0xb7f6;
      uVar22 = qb3f_71((word)uVar22,0xb7f6,(word)((ulong)uVar22 >> 0x10),0xb4fe,0xb502);
      wVar13 = qb3f_a1((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4fe,0xb502);
      wVar11 = 0;
      if ((bool)uVar19) {
        wVar11 = 0xffff;
      }
      bVar18 = false;
      di_00 = 0xb506;
      uVar22 = qb3f_9f(wVar13,wVar8,wVar11,0xb7b0,0xb506);
      uVar10 = (uint)((ulong)uVar22 >> 0x10);
      uVar9 = 0;
      if (bVar18) {
        uVar9 = 0xffff;
      }
      in_CX = (undefined2 *)(uVar9 | uVar10);
      uVar20 = 0;
      uVar17 = in_CX == (undefined2 *)0x0;
      if (!(bool)uVar17) {
        wVar13 = wVar8;
        uVar22 = qb3f_6f((word)uVar22,wVar8,uVar10,wVar8,0xb506);
        while( true ) {
          uVar22 = qb3f_7d((word)uVar22,wVar13,(word)((ulong)uVar22 >> 0x10),wVar8,0x4e28);
          di_00 = 0xbc16;
          uVar22 = qb3f_9f((word)uVar22,wVar13,(word)((ulong)uVar22 >> 0x10),0x4e28,0xbc16);
          wVar8 = wVar13;
          if (!(bool)uVar20 && !(bool)uVar17) break;
          wVar8 = 0x4e28;
          uVar22 = qb3f_7f((word)uVar22,wVar13,(word)((ulong)uVar22 >> 0x10),0x4e28,0xb7f6);
        }
      }
      uVar22 = FUN_1000_7eec();
      qb3f_75((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4d2,di_00);
      wVar11 = (word)((long)(int)wVar8 * 0x16);
      wVar13 = 0xb4ca;
      uVar22 = qb3f_75(wVar11,wVar8,(word)((ulong)((long)(int)wVar8 * 0x16) >> 0x10),0xb4ca,wVar11);
      wVar11 = (word)((ulong)uVar22 >> 0x10);
      bx = (undefined1 *)(wVar8 + (int)uVar22);
      pcVar12 = (char *)((int)bx * 2);
      uVar17 = 0;
      uVar19 = *(int *)(pcVar12 + 0x4e90) == 0;
      if (0 < *(int *)(pcVar12 + 0x4e90)) break;
    }
    wVar8 = 0xbc1a;
    uVar22 = qb3f_62(0xb49c,0xbc1a,wVar11,wVar13,(word)pcVar12);
    if (!(bool)uVar19) {
      qb3f_75((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4d2,(word)pcVar12);
      wVar13 = (word)((long)(int)wVar8 * 0x16);
      iVar7 = qb3f_75(wVar13,wVar8,(word)((ulong)((long)(int)wVar8 * 0x16) >> 0x10),0xb4ca,wVar13);
      wVar8 = wVar8 + iVar7;
      wVar13 = wVar8 * 2;
      uVar20 = 0;
      uVar17 = *(int *)(wVar13 + 0x4e90) == 0;
      if (0 < *(int *)(wVar13 + 0x4e90)) {
        FUN_1000_3ffc();
      }
      uVar22 = FUN_1000_5417();
      uVar22 = qb3f_a7((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb50a,wVar13);
      if ((bool)uVar17) {
        qb3f_75((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb48c,wVar13);
        wVar13 = (word)((long)(int)wVar8 * 0x15);
        uVar22 = qb3f_75(wVar13,wVar8,(word)((ulong)((long)(int)wVar8 * 0x15) >> 0x10),0xb4d2,wVar13
                        );
        uVar9 = (wVar13 + wVar8) * 4;
        uVar20 = 0x64f9 < uVar9;
        wVar13 = uVar9 + 0x9b06;
        uVar17 = wVar13 == 0;
        uVar22 = qb3f_97((word)uVar22,wVar13,(word)((ulong)uVar22 >> 0x10),0xbc1e,0xb4ca);
        uVar22 = qb3f_27((word)uVar22,wVar13,(word)((ulong)uVar22 >> 0x10),0xb7d8,0xb4ca);
        wVar8 = wVar13;
        uVar22 = qb3f_83((word)uVar22,wVar13,(word)((ulong)uVar22 >> 0x10),wVar13,0xb4ca);
        uVar22 = qb3f_7d((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),wVar13,wVar8);
      }
      else {
        uVar17 = 0;
      }
      uVar22 = qb3f_7b((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xbc22,0xb50e);
      uVar22 = qb3f_9f((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb48c,0xbc22);
      wVar8 = 0;
      if ((bool)uVar17) {
        wVar8 = 0xffff;
      }
      wVar13 = qb3f_9f((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xb4c6,0xb7f6);
      uVar9 = 0;
      if ((bool)uVar20) {
        uVar9 = 0xffff;
      }
      if ((uVar9 & wVar8) != 0) {
        qb3f_7b(wVar13,wVar8,uVar9 & wVar8,0xbc26,0xb4c6);
      }
      uVar22 = FUN_1000_3b02();
      qb3f_7b((word)uVar22,wVar8,(word)((ulong)uVar22 >> 0x10),0xbc2a,0xb512);
      FUN_1000_09e8();
      FUN_1000_0cd2();
      return;
    }
  } while( true );
  uVar22 = FUN_1000_3ffc();
  qb3f_a7((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb48c,(word)pcVar12);
  uVar20 = 0;
  if ((bool)uVar19) {
    FUN_1000_12c6();
    return;
  }
  goto LAB_1000_064d;
}


// ==== FUN_1000_132a @ 1000:132a (size 19) callers: FUN_1000_0cd2

void FUN_1000_132a(void)

{
  uint *puVar1;
  byte bVar2;
  code *pcVar3;
  char cVar4;
  word in_AX;
  uint uVar5;
  word wVar6;
  uint uVar7;
  undefined1 in_CL;
  int iVar8;
  undefined2 uVar9;
  uint uVar10;
  word in_DX;
  word dx;
  word dx_00;
  word dx_01;
  word dx_02;
  word dx_03;
  word dx_04;
  uint dx_05;
  word wVar11;
  undefined1 *bx;
  undefined *puVar12;
  undefined *bx_00;
  uint *bx_01;
  int unaff_BP;
  word unaff_SI;
  undefined *si;
  byte *unaff_DI;
  undefined2 unaff_SS;
  undefined1 uVar13;
  undefined1 uVar14;
  bool bVar15;
  bool bVar16;
  undefined4 uVar17;
  long lVar18;
  
  wVar6 = DAT_2000_b53e;
  qb3f_5e(in_AX,DAT_2000_b53e,in_DX,unaff_SI,(word)unaff_DI);
  puVar12 = (undefined *)CONCAT11((char)(wVar6 >> 8),(byte)wVar6 | DAT_2000_1f3d);
  pcVar3 = (code *)swi(0x1f);
  uVar5 = (*pcVar3)();
  lVar18 = (ulong)uVar5 * (ulong)*(uint *)(unaff_BP + unaff_SI);
  bVar2 = *unaff_DI;
  ((char *)s_You_don_t_feel_any_different__2000_c724 + 7)[(int)(puVar12 + unaff_SI)] =
       ((char *)s_You_don_t_feel_any_different__2000_c724 + 7)[(int)(puVar12 + unaff_SI)] -
       (char)((uint)puVar12 >> 8);
  cVar4 = (char)lVar18 + '\x01';
  wVar6 = CONCAT11((byte)((ulong)lVar18 >> 8) & bVar2,cVar4);
  iVar8 = CONCAT11(1,in_CL) + -1;
  uVar17 = CONCAT22(iVar8,wVar6);
  if (iVar8 == 0 || cVar4 == '\0') {
    wVar11 = 1;
    uVar17 = qb3e_42(wVar6,1,(word)((ulong)lVar18 >> 0x10),unaff_SI,(word)unaff_DI);
    uVar17 = qb3e_44((word)uVar17,wVar11,(word)((ulong)uVar17 >> 0x10),unaff_SI,(word)unaff_DI);
    wVar6 = qb3f_bc((word)uVar17,wVar11,(word)((ulong)uVar17 >> 0x10),unaff_SI,(word)unaff_DI);
    bx = (undefined1 *)&lit_WHICH_ITEM;
    uVar17 = qb3f_6e(wVar6,0xbd6a,wVar11,unaff_SI,(word)unaff_DI);
    uVar17 = qb3e_79((word)uVar17,(word)bx,(word)((ulong)uVar17 >> 0x10),unaff_SI,(word)unaff_DI);
    puVar12 = (undefined *)&lit_empty;
  }
  uVar9 = (undefined2)((ulong)uVar17 >> 0x10);
  wVar6 = qb3f_61((word)uVar17,(word)puVar12,0xb550,unaff_SI,(word)unaff_DI);
  puVar12 = (undefined *)&lit_1_TELEPORT_SCROLL;
  DAT_2000_b536 = uVar9;
  uVar17 = qb3f_61(wVar6,0xbd92,0xb49c,unaff_SI,(word)unaff_DI);
  wVar6 = qb3f_7b((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb7f6,0x52fc);
  qb3f_61(wVar6,0xbdac,0xb554,0xb7f6,0x52fc);
  wVar6 = FUN_1000_18de();
  puVar12 = (undefined *)&lit_2_SCROLL_OF_SEEING;
  uVar17 = qb3f_61(wVar6,0xbdb2,0xb49c,0xb7f6,0x52fc);
  wVar6 = qb3f_7b((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb7d8,0x52fc);
  qb3f_61(wVar6,0xbdcc,0xb554,0xb7d8,0x52fc);
  wVar6 = FUN_1000_18de();
  puVar12 = (undefined *)&lit_3_SCROLL_OF_HEALING;
  uVar17 = qb3f_61(wVar6,0xbdd2,0xb49c,0xb7d8,0x52fc);
  wVar6 = qb3f_7b((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xbb60,0x52fc);
  qb3f_61(wVar6,0xbdec,0xb554,0xbb60,0x52fc);
  wVar6 = FUN_1000_18de();
  puVar12 = (undefined *)&lit_4_SPELL_POINT_SCROLL;
  uVar17 = qb3f_61(wVar6,0xbdf2,0xb49c,0xbb60,0x52fc);
  wVar6 = qb3f_7b((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb802,0x52fc);
  puVar12 = (undefined *)&lit_4;
  qb3f_61(wVar6,0xbe0c,0xb554,0xb802,0x52fc);
  uVar17 = FUN_1000_18de();
  uVar17 = qb3f_75((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
  wVar6 = (word)((ulong)uVar17 >> 0x10);
  if (((uint)puVar12 & 2) == 0) {
    uVar17 = qb3f_bc((word)uVar17,0,wVar6,0xb558,0x52fc);
    uVar17 = qb3f_6a((word)uVar17,0xbe2c,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
    puVar12 = (undefined *)0xb550;
    uVar17 = qb3f_6e((word)uVar17,0xb550,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
    uVar17 = qb3e_79((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
  }
  else {
    uVar17 = qb3f_bc((word)uVar17,(uint)puVar12 & 2,wVar6,0xb558,0x52fc);
    puVar12 = (undefined *)&lit_5_BAG_OF_HOLDING;
    uVar17 = qb3f_6e((word)uVar17,0xbe12,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
    uVar17 = qb3e_79((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
  }
  uVar17 = qb3f_75((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
  wVar6 = (word)((ulong)uVar17 >> 0x10);
  uVar13 = 0;
  uVar14 = ((uint)puVar12 & 0x40) == 0;
  if ((bool)uVar14) {
    uVar17 = qb3f_bc((word)uVar17,0,wVar6,0xb558,0x52fc);
    uVar17 = qb3f_6a((word)uVar17,0xbe4c,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
    puVar12 = (undefined *)0xb550;
    uVar17 = qb3f_6e((word)uVar17,0xb550,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
    uVar17 = qb3e_79((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
  }
  else {
    uVar17 = qb3f_bc((word)uVar17,(uint)puVar12 & 0x40,wVar6,0xb558,0x52fc);
    puVar12 = (undefined *)&lit_6_FLOOR_SLOSHER;
    uVar17 = qb3f_6e((word)uVar17,0xbe32,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
    uVar17 = qb3e_79((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb558,0x52fc);
  }
  uVar17 = qb3f_9f((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
  if ((bool)uVar14) {
    uVar17 = qb3f_bc((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    puVar12 = (undefined *)&lit_L_LEAVE;
    uVar17 = qb3f_6e((word)uVar17,0xbe52,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    qb3e_79((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
  }
  do {
    uVar17 = FUN_1000_2f71();
    uVar17 = qb3f_9f((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    if (!(bool)uVar14) {
      FUN_1000_3029();
      uVar17 = FUN_1000_8fea();
    }
    uVar17 = qb3f_9f((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    if ((bool)uVar14) {
      puVar12 = (undefined *)&lit_L;
      uVar17 = qb3f_62(0xb49c,0xbe60,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
      if ((bool)uVar14) {
        qb3f_7b((word)uVar17,(word)puVar12,(word)((ulong)uVar17 >> 0x10),0xb7ee,0x52fc);
        return;
      }
    }
    uVar14 = 0;
    wVar6 = 0xb49c;
    uVar17 = qb3d_13((word)uVar17,0xb49c,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    uVar17 = qb3f_7a((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    uVar17 = qb3f_7d((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb55c,0x52fc);
    bx_00 = (undefined *)0x52fc;
    wVar6 = 0xb7f6;
    si = (undefined *)0xb55c;
    uVar17 = qb3f_9f((word)uVar17,0x52fc,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    if (!(bool)uVar14) break;
    puVar12 = bx_00;
    wVar11 = qb3f_a7((word)uVar17,(word)bx_00,(word)((ulong)uVar17 >> 0x10),(word)bx_00,0xb7f6);
    dx = 0;
    if ((bool)uVar14) {
      dx = 0xffff;
    }
    bVar15 = false;
    wVar6 = 0xb7fa;
    uVar17 = qb3f_9f(wVar11,(word)puVar12,dx,(word)bx_00,0xb7fa);
    iVar8 = 0;
    if (!(bool)uVar13 && !bVar15) {
      iVar8 = -1;
    }
    uVar13 = 0;
    bVar15 = (int)((ulong)uVar17 >> 0x10) == 0;
    uVar14 = iVar8 == 0 && bVar15;
    si = bx_00;
  } while (iVar8 != 0 || !bVar15);
  wVar11 = 0xb49c;
  uVar17 = qb3d_13((word)uVar17,0xb49c,(word)((ulong)uVar17 >> 0x10),(word)si,wVar6);
  uVar17 = qb3f_7a((word)uVar17,wVar11,(word)((ulong)uVar17 >> 0x10),(word)si,wVar6);
  uVar17 = qb3f_7d((word)uVar17,wVar11,(word)((ulong)uVar17 >> 0x10),(word)si,0x52fc);
  uVar17 = qb3f_a7((word)uVar17,wVar11,(word)((ulong)uVar17 >> 0x10),0x52fc,0x52fc);
  uVar5 = 0;
  if ((bool)uVar14) {
    uVar5 = 0xffff;
  }
  bVar15 = false;
  wVar6 = qb3f_9f((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0x52fc,0xb7fa);
  iVar8 = 0;
  if (!(bool)uVar13 && !bVar15) {
    iVar8 = -1;
  }
  if (iVar8 != 0 || uVar5 != 0) {
    FUN_1000_0636();
    return;
  }
  uVar17 = qb3f_7b(wVar6,uVar5,0,0xbe66,0xb560);
  uVar17 = qb3f_75((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb558,0xb560);
  uVar5 = uVar5 & 2;
  if (uVar5 != 0) {
    uVar17 = qb3f_7b((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb7f6,0xb560);
  }
  uVar17 = qb3f_7b((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb7ee,0xb564);
  uVar17 = qb3f_75((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb558,0xb564);
  wVar6 = uVar5 & 0x40;
  uVar13 = wVar6 == 0;
  if (!(bool)uVar13) {
    uVar17 = qb3f_7b((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb7f6,0xb564);
  }
  lVar18 = qb3f_9f((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
  if ((bool)uVar13) {
    wVar6 = qb3f_9f((word)lVar18,wVar6,(word)((ulong)lVar18 >> 0x10),0x52fc,0xb7f6);
    uVar5 = 0;
    if ((bool)uVar13) {
      uVar5 = 0xffff;
    }
    bVar15 = false;
    uVar17 = qb3f_a7(wVar6,uVar5,0x52fc,0xb2d6,0xb7f6);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    uVar10 = 0;
    if (bVar15) {
      uVar10 = 0xffff;
    }
    uVar10 = uVar10 & uVar5;
    bVar15 = uVar10 == 0;
    uVar17 = qb3f_9f((word)uVar17,uVar5,wVar6,wVar6,0xb7d8);
    uVar5 = 0;
    if (bVar15) {
      uVar5 = 0xffff;
    }
    bVar15 = false;
    qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2da,0xb7d8);
    uVar7 = 0;
    if (bVar15) {
      uVar7 = 0xffff;
    }
    uVar10 = uVar7 & uVar5 | uVar10;
    bVar15 = uVar10 == 0;
    uVar17 = qb3f_9f(uVar10,uVar5,dx_00,dx_00,0xbb60);
    uVar5 = 0;
    if (bVar15) {
      uVar5 = 0xffff;
    }
    bVar15 = false;
    uVar17 = qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2de,0xbb60);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    uVar10 = 0;
    if (bVar15) {
      uVar10 = 0xffff;
    }
    uVar10 = uVar10 & uVar5 | (uint)uVar17;
    bVar15 = uVar10 == 0;
    uVar17 = qb3f_9f((uint)uVar17,uVar5,wVar6,wVar6,0xb802);
    uVar5 = 0;
    if (bVar15) {
      uVar5 = 0xffff;
    }
    bVar15 = false;
    qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2e2,0xb802);
    uVar7 = 0;
    if (bVar15) {
      uVar7 = 0xffff;
    }
    uVar10 = uVar7 & uVar5 | uVar10;
    bVar15 = uVar10 == 0;
    uVar17 = qb3f_9f(uVar10,uVar5,dx_01,dx_01,0xbb6c);
    uVar5 = 0;
    if (bVar15) {
      uVar5 = 0xffff;
    }
    bVar15 = false;
    uVar17 = qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb560,0xbb6c);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    uVar10 = 0;
    if (bVar15) {
      uVar10 = 0xffff;
    }
    uVar10 = uVar10 & uVar5 | (uint)uVar17;
    bVar15 = uVar10 == 0;
    uVar17 = qb3f_9f((uint)uVar17,uVar5,wVar6,wVar6,0xb7fa);
    wVar6 = 0;
    if (bVar15) {
      wVar6 = 0xffff;
    }
    bVar15 = false;
    qb3f_a7((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb564,0xb7fa);
    uVar5 = 0;
    if (bVar15) {
      uVar5 = 0xffff;
    }
    uVar10 = uVar5 & wVar6 | uVar10;
    if (uVar10 != 0) {
      qb3f_7b(uVar10,wVar6,dx_02,0xbe66,dx_02);
      return;
    }
    lVar18 = (ulong)dx_02 << 0x10;
    bVar15 = true;
  }
  else {
    bVar15 = false;
  }
  wVar6 = qb3f_9f((word)lVar18,wVar6,(word)((ulong)lVar18 >> 0x10),0x52fc,0xb7f6);
  uVar5 = 0;
  if (bVar15) {
    uVar5 = 0xffff;
  }
  bVar15 = false;
  uVar17 = qb3f_a7(wVar6,uVar5,0x52fc,0xb2d6,0xb7f6);
  wVar6 = (word)((ulong)uVar17 >> 0x10);
  uVar10 = 0;
  if (bVar15) {
    uVar10 = 0xffff;
  }
  uVar10 = uVar10 & uVar5;
  bVar15 = uVar10 == 0;
  uVar17 = qb3f_9f((word)uVar17,uVar5,wVar6,wVar6,0xb7d8);
  uVar5 = 0;
  if (bVar15) {
    uVar5 = 0xffff;
  }
  bVar15 = false;
  qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2da,0xb7d8);
  uVar7 = 0;
  if (bVar15) {
    uVar7 = 0xffff;
  }
  uVar10 = uVar7 & uVar5 | uVar10;
  bVar15 = uVar10 == 0;
  uVar17 = qb3f_9f(uVar10,uVar5,dx_03,dx_03,0xbb60);
  uVar5 = 0;
  if (bVar15) {
    uVar5 = 0xffff;
  }
  bVar15 = false;
  uVar17 = qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2de,0xbb60);
  wVar6 = (word)((ulong)uVar17 >> 0x10);
  uVar10 = 0;
  if (bVar15) {
    uVar10 = 0xffff;
  }
  uVar10 = uVar10 & uVar5 | (uint)uVar17;
  bVar15 = uVar10 == 0;
  uVar17 = qb3f_9f((uint)uVar17,uVar5,wVar6,wVar6,0xb802);
  uVar5 = 0;
  if (bVar15) {
    uVar5 = 0xffff;
  }
  bVar15 = false;
  qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2e2,0xb802);
  uVar7 = 0;
  if (bVar15) {
    uVar7 = 0xffff;
  }
  uVar10 = uVar7 & uVar5 | uVar10;
  bVar15 = uVar10 == 0;
  uVar17 = qb3f_9f(uVar10,uVar5,dx_04,dx_04,0xbb6c);
  uVar5 = 0;
  if (bVar15) {
    uVar5 = 0xffff;
  }
  bVar15 = false;
  uVar17 = qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb560,0xbb6c);
  wVar6 = (word)((ulong)uVar17 >> 0x10);
  uVar10 = 0;
  if (bVar15) {
    uVar10 = 0xffff;
  }
  uVar10 = uVar10 & uVar5 | (uint)uVar17;
  bVar15 = uVar10 == 0;
  uVar17 = qb3f_9f((uint)uVar17,uVar5,wVar6,wVar6,0xb7fa);
  bx_01 = (uint *)0x0;
  if (bVar15) {
    bx_01 = (uint *)0xffff;
  }
  bVar15 = false;
  wVar6 = qb3f_a7((word)uVar17,(word)bx_01,(word)((ulong)uVar17 >> 0x10),0xb564,0xb7fa);
  uVar5 = 0;
  if (bVar15) {
    uVar5 = 0xffff;
  }
  bVar15 = (uVar5 & (uint)bx_01) == 0;
  bVar16 = bVar15 && uVar10 == 0;
  if (bVar15 && uVar10 == 0) {
    uVar17 = qb3f_9f(wVar6,(word)bx_01,0,0xb55c,0xb7f6);
    if (bVar16) {
      return;
    }
    uVar17 = qb3f_75((word)uVar17,(word)bx_01,(word)((ulong)uVar17 >> 0x10),0x52fc,0xb7f6);
    qb3f_5e((word)uVar17,(word)bx_01,(word)((ulong)uVar17 >> 0x10),0x52fc,0xb7f6);
    puVar1 = bx_01;
    uVar5 = *puVar1;
    *puVar1 = *puVar1 - dx_05;
    bx_01[0x297e] = (uint)bx_01;
    uVar17 = qb3f_7f(CONCAT11(0x17,-(uVar5 < dx_05)),(word)bx_01,dx_05,0xb2d6,0xb7d0);
    uVar17 = qb3f_7d((word)uVar17,(word)bx_01,(word)((ulong)uVar17 >> 0x10),0xb2d6,0xb2d6);
    uVar17 = qb3f_7b((word)uVar17,(word)bx_01,(word)((ulong)uVar17 >> 0x10),0xbc3e,0xb48c);
    uVar17 = qb3f_7b((word)uVar17,(word)bx_01,(word)((ulong)uVar17 >> 0x10),0xbd1e,0xb4ca);
    qb3f_7b((word)uVar17,(word)bx_01,(word)((ulong)uVar17 >> 0x10),0xbd22,0xb4d2);
    FUN_1000_1cf5();
    FUN_1000_0636();
    return;
  }
  FUN_1000_0636();
  return;
}


// ==== FUN_1000_1340 @ 1000:1340 (size 1001) callers: FUN_1000_0cd2

void __cdecl16near FUN_1000_1340(void)

{
  uint *puVar1;
  word wVar2;
  uint uVar3;
  undefined2 uVar4;
  uint uVar5;
  word dx;
  int iVar6;
  word dx_00;
  word dx_01;
  word dx_02;
  word dx_03;
  word dx_04;
  uint dx_05;
  word wVar7;
  undefined1 *bx;
  undefined *puVar8;
  undefined *bx_00;
  uint uVar9;
  uint *bx_01;
  word unaff_SI;
  undefined *si;
  word unaff_DI;
  undefined1 uVar10;
  undefined1 uVar11;
  bool bVar12;
  bool bVar13;
  undefined4 uVar14;
  long lVar15;
  
  DAT_2000_b536 = 1;
  uVar14 = FUN_1000_3029();
  wVar7 = 1;
  uVar14 = qb3e_42((word)uVar14,1,(word)((ulong)uVar14 >> 0x10),unaff_SI,unaff_DI);
  uVar14 = qb3e_44((word)uVar14,wVar7,(word)((ulong)uVar14 >> 0x10),unaff_SI,unaff_DI);
  wVar2 = qb3f_bc((word)uVar14,wVar7,(word)((ulong)uVar14 >> 0x10),unaff_SI,unaff_DI);
  bx = (undefined1 *)&lit_WHICH_ITEM;
  uVar14 = qb3f_6e(wVar2,0xbd6a,wVar7,unaff_SI,unaff_DI);
  uVar14 = qb3e_79((word)uVar14,(word)bx,(word)((ulong)uVar14 >> 0x10),unaff_SI,unaff_DI);
  uVar4 = (undefined2)((ulong)uVar14 >> 0x10);
  wVar2 = qb3f_61((word)uVar14,0xbd7a,0xb550,unaff_SI,unaff_DI);
  puVar8 = (undefined *)&lit_1_TELEPORT_SCROLL;
  DAT_2000_b536 = uVar4;
  uVar14 = qb3f_61(wVar2,0xbd92,0xb49c,unaff_SI,unaff_DI);
  wVar2 = qb3f_7b((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb7f6,0x52fc);
  qb3f_61(wVar2,0xbdac,0xb554,0xb7f6,0x52fc);
  wVar2 = FUN_1000_18de();
  puVar8 = (undefined *)&lit_2_SCROLL_OF_SEEING;
  uVar14 = qb3f_61(wVar2,0xbdb2,0xb49c,0xb7f6,0x52fc);
  wVar2 = qb3f_7b((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb7d8,0x52fc);
  qb3f_61(wVar2,0xbdcc,0xb554,0xb7d8,0x52fc);
  wVar2 = FUN_1000_18de();
  puVar8 = (undefined *)&lit_3_SCROLL_OF_HEALING;
  uVar14 = qb3f_61(wVar2,0xbdd2,0xb49c,0xb7d8,0x52fc);
  wVar2 = qb3f_7b((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xbb60,0x52fc);
  qb3f_61(wVar2,0xbdec,0xb554,0xbb60,0x52fc);
  wVar2 = FUN_1000_18de();
  puVar8 = (undefined *)&lit_4_SPELL_POINT_SCROLL;
  uVar14 = qb3f_61(wVar2,0xbdf2,0xb49c,0xbb60,0x52fc);
  wVar2 = qb3f_7b((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb802,0x52fc);
  puVar8 = (undefined *)&lit_4;
  qb3f_61(wVar2,0xbe0c,0xb554,0xb802,0x52fc);
  uVar14 = FUN_1000_18de();
  uVar14 = qb3f_75((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
  wVar2 = (word)((ulong)uVar14 >> 0x10);
  if (((uint)puVar8 & 2) == 0) {
    uVar14 = qb3f_bc((word)uVar14,0,wVar2,0xb558,0x52fc);
    uVar14 = qb3f_6a((word)uVar14,0xbe2c,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
    puVar8 = (undefined *)0xb550;
    uVar14 = qb3f_6e((word)uVar14,0xb550,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
    uVar14 = qb3e_79((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
  }
  else {
    uVar14 = qb3f_bc((word)uVar14,(uint)puVar8 & 2,wVar2,0xb558,0x52fc);
    puVar8 = (undefined *)&lit_5_BAG_OF_HOLDING;
    uVar14 = qb3f_6e((word)uVar14,0xbe12,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
    uVar14 = qb3e_79((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
  }
  uVar14 = qb3f_75((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
  wVar2 = (word)((ulong)uVar14 >> 0x10);
  uVar10 = 0;
  uVar11 = ((uint)puVar8 & 0x40) == 0;
  if ((bool)uVar11) {
    uVar14 = qb3f_bc((word)uVar14,0,wVar2,0xb558,0x52fc);
    uVar14 = qb3f_6a((word)uVar14,0xbe4c,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
    puVar8 = (undefined *)0xb550;
    uVar14 = qb3f_6e((word)uVar14,0xb550,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
    uVar14 = qb3e_79((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
  }
  else {
    uVar14 = qb3f_bc((word)uVar14,(uint)puVar8 & 0x40,wVar2,0xb558,0x52fc);
    puVar8 = (undefined *)&lit_6_FLOOR_SLOSHER;
    uVar14 = qb3f_6e((word)uVar14,0xbe32,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
    uVar14 = qb3e_79((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb558,0x52fc);
  }
  uVar14 = qb3f_9f((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
  if ((bool)uVar11) {
    uVar14 = qb3f_bc((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
    puVar8 = (undefined *)&lit_L_LEAVE;
    uVar14 = qb3f_6e((word)uVar14,0xbe52,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
    qb3e_79((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
  }
  do {
    uVar14 = FUN_1000_2f71();
    uVar14 = qb3f_9f((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
    if (!(bool)uVar11) {
      FUN_1000_3029();
      uVar14 = FUN_1000_8fea();
    }
    uVar14 = qb3f_9f((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
    if ((bool)uVar11) {
      puVar8 = (undefined *)&lit_L;
      uVar14 = qb3f_62(0xb49c,0xbe60,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
      if ((bool)uVar11) {
        qb3f_7b((word)uVar14,(word)puVar8,(word)((ulong)uVar14 >> 0x10),0xb7ee,0x52fc);
        return;
      }
    }
    uVar11 = 0;
    wVar2 = 0xb49c;
    uVar14 = qb3d_13((word)uVar14,0xb49c,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
    uVar14 = qb3f_7a((word)uVar14,wVar2,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
    uVar14 = qb3f_7d((word)uVar14,wVar2,(word)((ulong)uVar14 >> 0x10),0xb55c,0x52fc);
    bx_00 = (undefined *)0x52fc;
    wVar2 = 0xb7f6;
    si = (undefined *)0xb55c;
    uVar14 = qb3f_9f((word)uVar14,0x52fc,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
    if (!(bool)uVar11) break;
    puVar8 = bx_00;
    wVar7 = qb3f_a7((word)uVar14,(word)bx_00,(word)((ulong)uVar14 >> 0x10),(word)bx_00,0xb7f6);
    dx = 0;
    if ((bool)uVar11) {
      dx = 0xffff;
    }
    bVar12 = false;
    wVar2 = 0xb7fa;
    uVar14 = qb3f_9f(wVar7,(word)puVar8,dx,(word)bx_00,0xb7fa);
    iVar6 = 0;
    if (!(bool)uVar10 && !bVar12) {
      iVar6 = -1;
    }
    uVar10 = 0;
    bVar12 = (int)((ulong)uVar14 >> 0x10) == 0;
    uVar11 = iVar6 == 0 && bVar12;
    si = bx_00;
  } while (iVar6 != 0 || !bVar12);
  wVar7 = 0xb49c;
  uVar14 = qb3d_13((word)uVar14,0xb49c,(word)((ulong)uVar14 >> 0x10),(word)si,wVar2);
  uVar14 = qb3f_7a((word)uVar14,wVar7,(word)((ulong)uVar14 >> 0x10),(word)si,wVar2);
  uVar14 = qb3f_7d((word)uVar14,wVar7,(word)((ulong)uVar14 >> 0x10),(word)si,0x52fc);
  uVar14 = qb3f_a7((word)uVar14,wVar7,(word)((ulong)uVar14 >> 0x10),0x52fc,0x52fc);
  uVar9 = 0;
  if ((bool)uVar11) {
    uVar9 = 0xffff;
  }
  bVar12 = false;
  wVar2 = qb3f_9f((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0x52fc,0xb7fa);
  iVar6 = 0;
  if (!(bool)uVar10 && !bVar12) {
    iVar6 = -1;
  }
  if (iVar6 != 0 || uVar9 != 0) {
    FUN_1000_0636();
    return;
  }
  uVar14 = qb3f_7b(wVar2,uVar9,0,0xbe66,0xb560);
  uVar14 = qb3f_75((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb558,0xb560);
  uVar9 = uVar9 & 2;
  if (uVar9 != 0) {
    uVar14 = qb3f_7b((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb7f6,0xb560);
  }
  uVar14 = qb3f_7b((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb7ee,0xb564);
  uVar14 = qb3f_75((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb558,0xb564);
  wVar2 = uVar9 & 0x40;
  uVar10 = wVar2 == 0;
  if (!(bool)uVar10) {
    uVar14 = qb3f_7b((word)uVar14,wVar2,(word)((ulong)uVar14 >> 0x10),0xb7f6,0xb564);
  }
  lVar15 = qb3f_9f((word)uVar14,wVar2,(word)((ulong)uVar14 >> 0x10),0xb55c,0xb7f6);
  if ((bool)uVar10) {
    wVar2 = qb3f_9f((word)lVar15,wVar2,(word)((ulong)lVar15 >> 0x10),0x52fc,0xb7f6);
    uVar9 = 0;
    if ((bool)uVar10) {
      uVar9 = 0xffff;
    }
    bVar12 = false;
    uVar14 = qb3f_a7(wVar2,uVar9,0x52fc,0xb2d6,0xb7f6);
    wVar2 = (word)((ulong)uVar14 >> 0x10);
    uVar5 = 0;
    if (bVar12) {
      uVar5 = 0xffff;
    }
    uVar5 = uVar5 & uVar9;
    bVar12 = uVar5 == 0;
    uVar14 = qb3f_9f((word)uVar14,uVar9,wVar2,wVar2,0xb7d8);
    uVar9 = 0;
    if (bVar12) {
      uVar9 = 0xffff;
    }
    bVar12 = false;
    qb3f_a7((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb2da,0xb7d8);
    uVar3 = 0;
    if (bVar12) {
      uVar3 = 0xffff;
    }
    uVar5 = uVar3 & uVar9 | uVar5;
    bVar12 = uVar5 == 0;
    uVar14 = qb3f_9f(uVar5,uVar9,dx_00,dx_00,0xbb60);
    uVar9 = 0;
    if (bVar12) {
      uVar9 = 0xffff;
    }
    bVar12 = false;
    uVar14 = qb3f_a7((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb2de,0xbb60);
    wVar2 = (word)((ulong)uVar14 >> 0x10);
    uVar5 = 0;
    if (bVar12) {
      uVar5 = 0xffff;
    }
    uVar5 = uVar5 & uVar9 | (uint)uVar14;
    bVar12 = uVar5 == 0;
    uVar14 = qb3f_9f((uint)uVar14,uVar9,wVar2,wVar2,0xb802);
    uVar9 = 0;
    if (bVar12) {
      uVar9 = 0xffff;
    }
    bVar12 = false;
    qb3f_a7((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb2e2,0xb802);
    uVar3 = 0;
    if (bVar12) {
      uVar3 = 0xffff;
    }
    uVar5 = uVar3 & uVar9 | uVar5;
    bVar12 = uVar5 == 0;
    uVar14 = qb3f_9f(uVar5,uVar9,dx_01,dx_01,0xbb6c);
    uVar9 = 0;
    if (bVar12) {
      uVar9 = 0xffff;
    }
    bVar12 = false;
    uVar14 = qb3f_a7((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb560,0xbb6c);
    wVar2 = (word)((ulong)uVar14 >> 0x10);
    uVar5 = 0;
    if (bVar12) {
      uVar5 = 0xffff;
    }
    uVar5 = uVar5 & uVar9 | (uint)uVar14;
    bVar12 = uVar5 == 0;
    uVar14 = qb3f_9f((uint)uVar14,uVar9,wVar2,wVar2,0xb7fa);
    wVar2 = 0;
    if (bVar12) {
      wVar2 = 0xffff;
    }
    bVar12 = false;
    qb3f_a7((word)uVar14,wVar2,(word)((ulong)uVar14 >> 0x10),0xb564,0xb7fa);
    uVar9 = 0;
    if (bVar12) {
      uVar9 = 0xffff;
    }
    uVar5 = uVar9 & wVar2 | uVar5;
    if (uVar5 != 0) {
      qb3f_7b(uVar5,wVar2,dx_02,0xbe66,dx_02);
      return;
    }
    lVar15 = (ulong)dx_02 << 0x10;
    bVar12 = true;
  }
  else {
    bVar12 = false;
  }
  wVar2 = qb3f_9f((word)lVar15,wVar2,(word)((ulong)lVar15 >> 0x10),0x52fc,0xb7f6);
  uVar9 = 0;
  if (bVar12) {
    uVar9 = 0xffff;
  }
  bVar12 = false;
  uVar14 = qb3f_a7(wVar2,uVar9,0x52fc,0xb2d6,0xb7f6);
  wVar2 = (word)((ulong)uVar14 >> 0x10);
  uVar5 = 0;
  if (bVar12) {
    uVar5 = 0xffff;
  }
  uVar5 = uVar5 & uVar9;
  bVar12 = uVar5 == 0;
  uVar14 = qb3f_9f((word)uVar14,uVar9,wVar2,wVar2,0xb7d8);
  uVar9 = 0;
  if (bVar12) {
    uVar9 = 0xffff;
  }
  bVar12 = false;
  qb3f_a7((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb2da,0xb7d8);
  uVar3 = 0;
  if (bVar12) {
    uVar3 = 0xffff;
  }
  uVar5 = uVar3 & uVar9 | uVar5;
  bVar12 = uVar5 == 0;
  uVar14 = qb3f_9f(uVar5,uVar9,dx_03,dx_03,0xbb60);
  uVar9 = 0;
  if (bVar12) {
    uVar9 = 0xffff;
  }
  bVar12 = false;
  uVar14 = qb3f_a7((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb2de,0xbb60);
  wVar2 = (word)((ulong)uVar14 >> 0x10);
  uVar5 = 0;
  if (bVar12) {
    uVar5 = 0xffff;
  }
  uVar5 = uVar5 & uVar9 | (uint)uVar14;
  bVar12 = uVar5 == 0;
  uVar14 = qb3f_9f((uint)uVar14,uVar9,wVar2,wVar2,0xb802);
  uVar9 = 0;
  if (bVar12) {
    uVar9 = 0xffff;
  }
  bVar12 = false;
  qb3f_a7((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb2e2,0xb802);
  uVar3 = 0;
  if (bVar12) {
    uVar3 = 0xffff;
  }
  uVar5 = uVar3 & uVar9 | uVar5;
  bVar12 = uVar5 == 0;
  uVar14 = qb3f_9f(uVar5,uVar9,dx_04,dx_04,0xbb6c);
  uVar9 = 0;
  if (bVar12) {
    uVar9 = 0xffff;
  }
  bVar12 = false;
  uVar14 = qb3f_a7((word)uVar14,uVar9,(word)((ulong)uVar14 >> 0x10),0xb560,0xbb6c);
  wVar2 = (word)((ulong)uVar14 >> 0x10);
  uVar5 = 0;
  if (bVar12) {
    uVar5 = 0xffff;
  }
  uVar5 = uVar5 & uVar9 | (uint)uVar14;
  bVar12 = uVar5 == 0;
  uVar14 = qb3f_9f((uint)uVar14,uVar9,wVar2,wVar2,0xb7fa);
  bx_01 = (uint *)0x0;
  if (bVar12) {
    bx_01 = (uint *)0xffff;
  }
  bVar12 = false;
  wVar2 = qb3f_a7((word)uVar14,(word)bx_01,(word)((ulong)uVar14 >> 0x10),0xb564,0xb7fa);
  uVar9 = 0;
  if (bVar12) {
    uVar9 = 0xffff;
  }
  bVar12 = (uVar9 & (uint)bx_01) == 0;
  bVar13 = bVar12 && uVar5 == 0;
  if (bVar12 && uVar5 == 0) {
    uVar14 = qb3f_9f(wVar2,(word)bx_01,0,0xb55c,0xb7f6);
    if (bVar13) {
      return;
    }
    uVar14 = qb3f_75((word)uVar14,(word)bx_01,(word)((ulong)uVar14 >> 0x10),0x52fc,0xb7f6);
    qb3f_5e((word)uVar14,(word)bx_01,(word)((ulong)uVar14 >> 0x10),0x52fc,0xb7f6);
    puVar1 = bx_01;
    uVar9 = *puVar1;
    *puVar1 = *puVar1 - dx_05;
    bx_01[0x297e] = (uint)bx_01;
    uVar14 = qb3f_7f(CONCAT11(0x17,-(uVar9 < dx_05)),(word)bx_01,dx_05,0xb2d6,0xb7d0);
    uVar14 = qb3f_7d((word)uVar14,(word)bx_01,(word)((ulong)uVar14 >> 0x10),0xb2d6,0xb2d6);
    uVar14 = qb3f_7b((word)uVar14,(word)bx_01,(word)((ulong)uVar14 >> 0x10),0xbc3e,0xb48c);
    uVar14 = qb3f_7b((word)uVar14,(word)bx_01,(word)((ulong)uVar14 >> 0x10),0xbd1e,0xb4ca);
    qb3f_7b((word)uVar14,(word)bx_01,(word)((ulong)uVar14 >> 0x10),0xbd22,0xb4d2);
    FUN_1000_1cf5();
    FUN_1000_0636();
    return;
  }
  FUN_1000_0636();
  return;
}


// ==== FUN_1000_18de @ 1000:18de (size 58) callers: FUN_1000_1340

void __cdecl16near FUN_1000_18de(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word wVar1;
  word si;
  word unaff_DI;
  bool bVar2;
  bool bVar3;
  undefined4 uVar4;
  
  uVar4 = qb3f_75(in_AX,in_BX,in_DX,0x52fc,unaff_DI);
  bVar2 = 0x4d2d < in_BX * 4;
  si = in_BX * 4 + 0xb2d2;
  bVar3 = si == 0;
  uVar4 = qb3f_a7((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),si,unaff_DI);
  wVar1 = (word)((ulong)uVar4 >> 0x10);
  if (bVar2 || bVar3) {
    uVar4 = qb3f_bc((word)uVar4,in_BX,wVar1,si,unaff_DI);
    uVar4 = qb3f_6a((word)uVar4,0xb554,(word)((ulong)uVar4 >> 0x10),si,unaff_DI);
    wVar1 = 0xb550;
    uVar4 = qb3f_6e((word)uVar4,0xb550,(word)((ulong)uVar4 >> 0x10),si,unaff_DI);
    qb3e_79((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),si,unaff_DI);
  }
  else {
    uVar4 = qb3f_bc((word)uVar4,in_BX,wVar1,si,unaff_DI);
    wVar1 = 0xb49c;
    uVar4 = qb3f_6e((word)uVar4,0xb49c,(word)((ulong)uVar4 >> 0x10),si,unaff_DI);
    qb3e_79((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),si,unaff_DI);
  }
  return;
}


// ==== FUN_1000_1918 @ 1000:1918 (size 223) callers: FUN_1000_0cd2,FUN_1000_1918

void FUN_1000_1918(void)

{
  word wVar1;
  int iVar2;
  uint uVar3;
  word extraout_DX;
  uint extraout_DX_00;
  word wVar4;
  undefined *puVar5;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_ZF;
  undefined1 uVar6;
  bool bVar7;
  undefined4 uVar8;
  
  while( true ) {
    uVar8 = FUN_1000_3029();
    DAT_2000_4e08 = 0x28;
    wVar4 = 1;
    uVar8 = qb3e_42((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    uVar8 = qb3e_44((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    uVar8 = qb3f_a7((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4f6,unaff_DI);
    wVar1 = (word)((ulong)uVar8 >> 0x10);
    if ((bool)in_ZF) {
      uVar8 = qb3f_bc((word)uVar8,wVar4,wVar1,0xb4f6,unaff_DI);
      puVar5 = (undefined *)&lit_You_have_no_treasure;
      uVar8 = qb3f_6e((word)uVar8,0xbec8,(word)((ulong)uVar8 >> 0x10),0xb4f6,unaff_DI);
      qb3e_79((word)uVar8,(word)puVar5,(word)((ulong)uVar8 >> 0x10),0xb4f6,unaff_DI);
      FUN_1000_2f35();
      FUN_1000_3029();
      FUN_1000_0636();
      return;
    }
    uVar8 = qb3f_bc((word)uVar8,wVar4,wVar1,0xb4f6,unaff_DI);
    puVar5 = (undefined *)&lit_Do_you_want_to_drop_all_of_your_coins;
    uVar8 = qb3f_6a((word)uVar8,0xbee2,(word)((ulong)uVar8 >> 0x10),0xb4f6,unaff_DI);
    qb3e_79((word)uVar8,(word)puVar5,(word)((ulong)uVar8 >> 0x10),0xb4f6,unaff_DI);
    uVar8 = FUN_1000_7dc9();
    if (DAT_2000_b578 == 1) break;
    uVar8 = qb3f_8f((word)uVar8,(word)puVar5,(word)((ulong)uVar8 >> 0x10),0xb56c,0xbe76);
    unaff_DI = 0xb57a;
    uVar8 = qb3f_7d((word)uVar8,(word)puVar5,(word)((ulong)uVar8 >> 0x10),0xb56c,0xb57a);
    unaff_SI = 0xb558;
    uVar8 = qb3f_75((word)uVar8,(word)puVar5,(word)((ulong)uVar8 >> 0x10),0xb558,0xb57a);
    wVar1 = (word)((ulong)uVar8 >> 0x10);
    uVar6 = ((uint)puVar5 & 0x20) == 0;
    if (!(bool)uVar6) {
      unaff_SI = 0xbc2a;
      qb3f_7b((word)uVar8,(uint)puVar5 & 0x20,wVar1,0xbc2a,0xb57a);
      wVar1 = extraout_DX;
    }
    wVar1 = qb3f_62(0xb49c,0xba3a,wVar1,unaff_SI,0xb57a);
    wVar4 = 0;
    if ((bool)uVar6) {
      wVar4 = 0xffff;
    }
    bVar7 = false;
    puVar5 = (undefined *)&lit_y;
    uVar8 = qb3f_62(wVar1,0xbf0e,wVar4,unaff_SI,0xb57a);
    wVar1 = (word)((ulong)uVar8 >> 0x10);
    iVar2 = 0;
    if (bVar7) {
      iVar2 = -1;
    }
    uVar6 = iVar2 == 0 && wVar1 == 0;
    if (iVar2 != 0 || wVar1 != 0) {
      uVar8 = qb3f_7b((word)uVar8,(word)puVar5,wVar1,0xbc2a,0xb4f6);
      uVar8 = qb3f_7f((word)uVar8,(word)puVar5,(word)((ulong)uVar8 >> 0x10),0xb57a,0xbf14);
      qb3f_7d((word)uVar8,(word)puVar5,(word)((ulong)uVar8 >> 0x10),0xb57a,0xb570);
      FUN_1000_3029();
      FUN_1000_19f7();
      FUN_1000_0636();
      return;
    }
    wVar1 = qb3f_62(0xb49c,0xba40,wVar1,unaff_SI,0xb57a);
    wVar4 = 0;
    if (!(bool)uVar6) {
      wVar4 = 0xffff;
      uVar6 = 0;
    }
    qb3f_62(wVar1,0xbf18,wVar4,unaff_SI,0xb57a);
    uVar3 = 0;
    if (!(bool)uVar6) {
      uVar3 = 0xffff;
    }
    if ((uVar3 & extraout_DX_00) == 0) {
      FUN_1000_3029();
      FUN_1000_0636();
      return;
    }
    in_ZF = 0;
  }
  FUN_1000_0636();
  return;
}


// ==== FUN_1000_19f7 @ 1000:19f7 (size 638) callers: FUN_1000_0cd2,FUN_1000_1918

void __cdecl16near FUN_1000_19f7(void)

{
  word dx;
  word wVar1;
  undefined *puVar2;
  word wVar3;
  int iVar4;
  uint uVar5;
  word unaff_SI;
  word unaff_DI;
  undefined1 uVar6;
  undefined1 uVar7;
  undefined4 uVar8;
  
  uVar8 = FUN_1000_2fcb();
  wVar1 = 0xffff;
  uVar8 = qb3e_32((word)uVar8,0xffff,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb4c2);
  puVar2 = (undefined *)0xb466;
  uVar8 = qb3f_ba(wVar1,0xb466,0xb466,0xb7f6,0xb4c2);
  wVar1 = (word)((ulong)uVar8 >> 0x10);
  if (0x28 < (int)puVar2) {
    wVar3 = wVar1;
    qb3d_0b((word)uVar8,wVar1,0x25,0xb7f6,0xb4c2);
    puVar2 = (undefined *)&lit_empty;
    wVar3 = qb3f_55(wVar3,0xbf1e,dx,0xb7f6,0xb4c2);
    uVar8 = qb3f_61(wVar3,(word)puVar2,wVar1,0xb7f6,0xb4c2);
  }
  uVar8 = qb3f_bc((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb4c2);
  uVar8 = qb3f_6a((word)uVar8,0xbf26,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb4c2);
  wVar1 = 0xb466;
  uVar8 = qb3f_6e((word)uVar8,0xb466,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb4c2);
  uVar8 = qb3e_79((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb4c2);
  DAT_2000_b536 = 1;
  uVar8 = qb3f_bc((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb4c2);
  puVar2 = (undefined *)&lit_Class;
  uVar8 = qb3f_6a((word)uVar8,0xbf40,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb4c2);
  uVar8 = qb3f_75((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1be6,0xb4c2);
  uVar6 = 0xe4bd < (uint)((int)puVar2 * 4);
  wVar3 = (int)puVar2 * 4 + 0x1b42;
  uVar7 = wVar3 == 0;
  uVar8 = qb3f_6a((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),0x1be6,0xb4c2);
  uVar8 = qb3e_79((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),0x1be6,0xb4c2);
  uVar8 = qb3f_9f((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),0xb57e,0xb7f6);
  wVar1 = (word)((ulong)uVar8 >> 0x10);
  if ((bool)uVar7) {
    uVar8 = qb3f_bc((word)uVar8,wVar3,wVar1,0xb57e,0xb7f6);
    puVar2 = (undefined *)&lit_FIGHTER;
    uVar8 = qb3f_6e((word)uVar8,0xbf4c,(word)((ulong)uVar8 >> 0x10),0xb57e,0xb7f6);
    uVar8 = qb3e_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb57e,0xb7f6);
  }
  else {
    uVar8 = qb3f_bc((word)uVar8,wVar3,wVar1,0xb57e,0xb7f6);
    puVar2 = (undefined *)&lit_WIZARD;
    uVar8 = qb3f_6e((word)uVar8,0xbf58,(word)((ulong)uVar8 >> 0x10),0xb57e,0xb7f6);
    uVar8 = qb3e_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb57e,0xb7f6);
  }
  uVar8 = qb3f_bc((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb57e,0xb7f6);
  wVar1 = 0xbc1a;
  uVar8 = qb3f_6e((word)uVar8,0xbc1a,(word)((ulong)uVar8 >> 0x10),0xb57e,0xb7f6);
  uVar8 = qb3e_79((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb57e,0xb7f6);
  wVar3 = 0xb7f6;
  uVar8 = qb3f_6f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb7f6);
  while( true ) {
    uVar8 = qb3f_7d((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),wVar3,0x4e28);
    uVar8 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x4e28,0xb7fa);
    if (!(bool)uVar6 && !(bool)uVar7) break;
    iVar4 = 0x4e28;
    uVar8 = qb3f_75((word)uVar8,0x4e28,0x4e28,0x4e28,0xb7fa);
    uVar5 = iVar4 * 4;
    uVar8 = qb3f_bd((word)uVar8,uVar5 + 0x2126,(word)((ulong)uVar8 >> 0x10),0x4e28,0xb7fa);
    uVar6 = 0xe06d < uVar5;
    wVar1 = uVar5 + 0x1f92;
    uVar7 = wVar1 == 0;
    uVar8 = qb3f_6b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x4e28,0xb7fa);
    uVar8 = qb3e_79((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x4e28,0xb7fa);
    wVar3 = (word)((ulong)uVar8 >> 0x10);
    uVar8 = qb3f_7f((word)uVar8,wVar1,wVar3,wVar3,0xb7f6);
  }
  uVar8 = qb3f_bc((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x4e28,0xb7fa);
  wVar1 = 0xbc1a;
  uVar8 = qb3f_6e((word)uVar8,0xbc1a,(word)((ulong)uVar8 >> 0x10),0x4e28,0xb7fa);
  uVar8 = qb3e_79((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x4e28,0xb7fa);
  uVar8 = qb3f_bc((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x4e28,0xb7fa);
  puVar2 = (undefined *)&lit_You_are_wearing;
  uVar8 = qb3f_6a((word)uVar8,0xbf64,(word)((ulong)uVar8 >> 0x10),0x4e28,0xb7fa);
  uVar8 = qb3f_75((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb56c,0xb7fa);
  wVar1 = (int)puVar2 * 4 + 0x1f16;
  uVar6 = wVar1 == 0;
  uVar8 = qb3f_6e((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb56c,0xb7fa);
  uVar8 = qb3e_79((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb56c,0xb7fa);
  uVar8 = qb3f_bc((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb56c,0xb7fa);
  puVar2 = (undefined *)&lit_Weapons_owned;
  uVar8 = qb3f_6a((word)uVar8,0xbf78,(word)((ulong)uVar8 >> 0x10),0xb56c,0xb7fa);
  uVar8 = qb3e_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb56c,0xb7fa);
  uVar8 = qb3f_9f((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1b96,0xb7f6);
  if ((bool)uVar6) {
    uVar8 = qb3f_bc((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1b96,0xb7f6);
    puVar2 = (undefined *)&lit_KNIFE;
    uVar8 = qb3f_6a((word)uVar8,0xbf8a,(word)((ulong)uVar8 >> 0x10),0x1b96,0xb7f6);
    uVar8 = qb3e_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1b96,0xb7f6);
  }
  uVar8 = qb3f_9f((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1b9a,0xb7f6);
  if ((bool)uVar6) {
    uVar8 = qb3f_bc((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1b9a,0xb7f6);
    puVar2 = (undefined *)&lit_SWORD;
    uVar8 = qb3f_6a((word)uVar8,0xbf94,(word)((ulong)uVar8 >> 0x10),0x1b9a,0xb7f6);
    uVar8 = qb3e_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1b9a,0xb7f6);
  }
  uVar8 = qb3f_9f((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
  if ((bool)uVar6) {
    uVar8 = qb3f_bc((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
    puVar2 = (undefined *)&lit_MACE;
    uVar8 = qb3f_6a((word)uVar8,0xbf9e,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
    uVar8 = qb3e_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
  }
  uVar6 = DAT_2000_b582 == 0;
  uVar7 = DAT_2000_b582 == 1;
  if ((bool)uVar7) {
    return;
  }
  uVar8 = qb3f_bc((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
  uVar8 = qb3f_6a((word)uVar8,0xb45e,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
  uVar8 = qb3f_6a((word)uVar8,0xbfa6,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
  uVar8 = qb3f_67((word)uVar8,0xb4f2,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
  uVar8 = qb3f_6a((word)uVar8,0xbfba,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
  wVar1 = 0xb4ee;
  uVar8 = qb3f_6b((word)uVar8,0xb4ee,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
  wVar1 = qb3e_79((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x1b9e,0xb7f6);
  wVar1 = qb3f_61(wVar1,0xbfc0,0xb584,0x1b9e,0xb7f6);
  puVar2 = (undefined *)&lit_Spell_points;
  uVar8 = qb3f_61(wVar1,0xbfd2,0xb49c,0x1b9e,0xb7f6);
  qb3f_7b((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb568,0x52fc);
  wVar1 = FUN_1000_1c76();
  puVar2 = (undefined *)&lit_Player_level;
  uVar8 = qb3f_61(wVar1,0xbfe4,0xb49c,0xb568,0x52fc);
  qb3f_7b((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb4ea,0x52fc);
  wVar1 = FUN_1000_1c76();
  puVar2 = (undefined *)&lit_Player_weight;
  uVar8 = qb3f_61(wVar1,0xbff6,0xb49c,0xb4ea,0x52fc);
  qb3f_7b((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb570,0x52fc);
  wVar1 = FUN_1000_1c76();
  puVar2 = (undefined *)&lit_Pocket_money;
  uVar8 = qb3f_61(wVar1,0xc008,0xb49c,0xb570,0x52fc);
  uVar8 = qb3f_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb588,0x52fc);
  qb3f_7d((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb588,0x52fc);
  wVar1 = FUN_1000_1c76();
  puVar2 = (undefined *)&lit_Experience;
  uVar8 = qb3f_61(wVar1,0xc01a,0xb49c,0xb588,0x52fc);
  uVar8 = qb3f_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb4e2,0x52fc);
  qb3f_7d((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb4e2,0x52fc);
  wVar1 = FUN_1000_1c76();
  puVar2 = (undefined *)&lit_Money_in_bank;
  uVar8 = qb3f_61(wVar1,0xc02c,0xb49c,0xb4e2,0x52fc);
  uVar8 = qb3f_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb590,0x52fc);
  qb3f_7d((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb590,0x52fc);
  uVar8 = FUN_1000_1c76();
  uVar8 = qb3f_a7((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1ba2,0x52fc);
  if (!(bool)uVar6 && !(bool)uVar7) {
    uVar8 = qb3f_bc((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1ba2,0x52fc);
    uVar8 = qb3f_6a((word)uVar8,0xb45e,(word)((ulong)uVar8 >> 0x10),0x1ba2,0x52fc);
    puVar2 = (undefined *)&lit_You_are_diseased_Get_a_cure_disease_at;
    uVar8 = qb3f_6a((word)uVar8,0xc03e,(word)((ulong)uVar8 >> 0x10),0x1ba2,0x52fc);
    uVar8 = qb3e_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1ba2,0x52fc);
    uVar8 = qb3f_bc((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1ba2,0x52fc);
    puVar2 = (undefined *)&lit_the_temple_400_JP;
    uVar8 = qb3f_6a((word)uVar8,0xc06a,(word)((ulong)uVar8 >> 0x10),0x1ba2,0x52fc);
    qb3e_79((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0x1ba2,0x52fc);
  }
  uVar8 = FUN_1000_2f3c();
  if (DAT_2000_b598 == 1) {
    DAT_2000_b598 = 0;
  }
  uVar8 = qb3f_7b((word)uVar8,(word)puVar2,(word)((ulong)uVar8 >> 0x10),0xb7ee,0x52fc);
  qb3e_32((word)uVar8,0xffff,(word)((ulong)uVar8 >> 0x10),0xb7ee,0x52fc);
  FUN_1000_5837();
  FUN_1000_3ffc();
  FUN_1000_8fea();
  return;
}


// ==== FUN_1000_1c76 @ 1000:1c76 (size 29) callers: FUN_1000_19f7

void __cdecl16near FUN_1000_1c76(void)

{
  word wVar1;
  word in_DX;
  word bx;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  bx = 0xb584;
  wVar1 = qb3f_55(0xb49c,0xb584,in_DX,unaff_SI,unaff_DI);
  uVar2 = qb3f_61(wVar1,bx,wVar1,unaff_SI,unaff_DI);
  uVar2 = qb3f_bd((word)uVar2,(word)uVar2,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = 0x52fc;
  uVar2 = qb3f_6b((word)uVar2,0x52fc,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_1c93 @ 1000:1c93 (size 98) callers: FUN_1000_3dae

void __cdecl16near FUN_1000_1c93(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word si;
  word bx;
  undefined1 in_ZF;
  undefined4 uVar1;
  
  uVar1 = qb3f_7b(in_AX,in_BX,in_DX,0xb7ee,0x6034);
  si = 0xb7ee;
  uVar1 = qb3f_9f((word)uVar1,0xb7ee,(word)((ulong)uVar1 >> 0x10),0x602c,0xb7f6);
  if ((bool)in_ZF) {
    bx = 0x602c;
    uVar1 = qb3f_7b((word)uVar1,0x602c,(word)((ulong)uVar1 >> 0x10),si,0x602c);
    uVar1 = qb3f_7f((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0x1f96,0xc086);
    uVar1 = qb3f_7d((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0x1f96,0x1f96);
    si = bx;
  }
  uVar1 = qb3f_9f((word)uVar1,si,(word)((ulong)uVar1 >> 0x10),0x6030,0xb7f6);
  if ((bool)in_ZF) {
    uVar1 = qb3f_7b((word)uVar1,si,(word)((ulong)uVar1 >> 0x10),0xb7ee,0x6030);
    uVar1 = qb3f_7f((word)uVar1,si,(word)((ulong)uVar1 >> 0x10),0x1fa6,0xbc3a);
    uVar1 = qb3f_7d((word)uVar1,si,(word)((ulong)uVar1 >> 0x10),0x1fa6,0x1fa6);
    uVar1 = qb3f_7f((word)uVar1,si,(word)((ulong)uVar1 >> 0x10),0xb4ca,0xb7d8);
    qb3f_7d((word)uVar1,si,(word)((ulong)uVar1 >> 0x10),0xb4ca,0xb59a);
  }
  return;
}


// ==== FUN_1000_1cf5 @ 1000:1cf5 (size 161) callers: FUN_1000_0cc0,FUN_1000_1340,FUN_1000_3dae,FUN_1000_a013

void __cdecl16near FUN_1000_1cf5(void)

{
  uint *puVar1;
  word in_AX;
  word in_DX;
  word in_BX;
  word wVar2;
  undefined1 uVar3;
  undefined4 uVar4;
  
  uVar4 = qb3f_7b(in_AX,in_BX,in_DX,0xb7ee,0xb48c);
  uVar4 = qb3f_ab((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0x1fa2,0xb48c);
  puVar1 = (uint *)(in_BX + 0xc08a);
  uVar3 = 0x4b73 < *puVar1;
  *puVar1 = *puVar1 + 0xb48c;
  uVar4 = qb3f_81((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0x1fa2,0xb48c);
  wVar2 = 0x1a;
  uVar4 = qb3d_03((word)uVar4,0x1a,(word)((ulong)uVar4 >> 0x10),0x1fa2,0xb48c);
  uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0x1fa2,0xb59e);
  uVar4 = qb3f_9f((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb59e,0xb7f6);
  if ((bool)uVar3) {
    uVar4 = qb3f_8f((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb59e,0xbc42);
    wVar2 = 0x1a;
    uVar4 = qb3d_01((word)uVar4,0x1a,(word)((ulong)uVar4 >> 0x10),0xb59e,0xbc42);
    uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb59e,0xb59e);
  }
  uVar4 = qb3f_7f((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0x1f96,0xbc32);
  wVar2 = 0x1a;
  uVar4 = qb3d_01((word)uVar4,0x1a,(word)((ulong)uVar4 >> 0x10),0x1f96,0xbc32);
  uVar4 = qb3f_91((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0x1f96,0xc08e);
  uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0x1f96,0xb520);
  uVar4 = qb3f_9f((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb520,0xb7f6);
  if ((bool)uVar3) {
    uVar4 = qb3f_8f((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb520,0xbc42);
    wVar2 = 0x1a;
    uVar4 = qb3d_01((word)uVar4,0x1a,(word)((ulong)uVar4 >> 0x10),0xb520,0xbc42);
    uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb520,0xb520);
  }
  uVar4 = qb3f_7f((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0x1fa6,0xc092);
  uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0x1fa6,0xb5a2);
  uVar4 = qb3f_9f((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb5a2,0xb7f6);
  if ((bool)uVar3) {
    qb3f_7b((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb7ee,0xb5a2);
  }
  FUN_1000_4c28();
  return;
}


// ==== FUN_1000_2115 @ 1000:2115 (size 222) callers: FUN_1000_3dae

void __cdecl16near FUN_1000_2115(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word in_BX;
  undefined2 *bx;
  word wVar2;
  word wVar3;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar4;
  
  uVar4 = qb3f_7f(in_AX,in_BX,in_DX,0x1f9a,0xc092);
  uVar4 = qb3f_89((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0x1f9a,0xbb60);
  bx = (undefined2 *)&DAT_2000_bb60;
  uVar4 = qb3f_71((word)uVar4,0xbb60,(word)((ulong)uVar4 >> 0x10),0x1f9e,0xbba6);
  uVar4 = qb3f_8f((word)uVar4,(word)bx,(word)((ulong)uVar4 >> 0x10),0x1f9e,0xbba6);
  uVar4 = qb3f_85((word)uVar4,(word)bx,(word)((ulong)uVar4 >> 0x10),0x1f9e,0xbba6);
  wVar1 = qb3f_81((word)uVar4,(word)bx,(word)((ulong)uVar4 >> 0x10),0x1f9e,0xc2d8);
  wVar2 = 0x1a;
  uVar4 = qb3d_03(wVar1,0x1a,(word)bx,0x1f9e,0xc2d8);
  uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0x1f9e,0x52fc);
  wVar2 = 0x52fc;
  uVar4 = qb3f_9f((word)uVar4,0x52fc,(word)((ulong)uVar4 >> 0x10),0xb57e,0xb7d8);
  wVar1 = (word)((ulong)uVar4 >> 0x10);
  if ((bool)in_ZF) {
    wVar3 = wVar2;
    uVar4 = qb3f_8f((word)uVar4,wVar2,wVar1,0xb4ea,wVar2);
    wVar1 = (word)((ulong)uVar4 >> 0x10);
    uVar4 = qb3f_89((word)uVar4,wVar3,wVar2,0xb4ea,wVar1);
    wVar2 = 0x1a;
    uVar4 = qb3d_03((word)uVar4,0x1a,(word)((ulong)uVar4 >> 0x10),0xb4ea,wVar1);
    wVar1 = (word)((ulong)uVar4 >> 0x10);
    uVar4 = qb3f_81((word)uVar4,wVar2,wVar1,0xb4ea,wVar1);
    uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb4ea,wVar1);
  }
  else {
    uVar4 = qb3f_8f((word)uVar4,wVar2,wVar1,0xb4ea,0x52fc);
    wVar3 = 0x52fc;
    wVar1 = qb3f_89((word)uVar4,0x52fc,(word)((ulong)uVar4 >> 0x10),0xb4ea,0xb7fa);
    wVar2 = 0x1a;
    uVar4 = qb3d_03(wVar1,0x1a,wVar3,0xb4ea,0xb7fa);
    wVar1 = (word)((ulong)uVar4 >> 0x10);
    uVar4 = qb3f_81((word)uVar4,wVar2,wVar1,0xb4ea,wVar1);
    uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb4ea,wVar1);
  }
  uVar4 = qb3f_9f((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb57e,0xb7d8);
  wVar1 = (word)((ulong)uVar4 >> 0x10);
  if ((bool)in_ZF) {
    uVar4 = qb3f_8f((word)uVar4,wVar2,wVar1,0xb4ea,0xbb60);
    uVar4 = qb3f_81((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb4ea,0xb7d8);
    uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb4ea,0xb568);
  }
  else {
    uVar4 = qb3f_7f((word)uVar4,wVar2,wVar1,0xb4ea,0xbb5c);
    uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb4ea,0xb568);
  }
  uVar4 = qb3f_7f((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb568,0x52fc);
  uVar4 = qb3f_7d((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb568,0xb568);
  uVar4 = qb3f_9f((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb568,0xb7f6);
  if ((bool)in_CF) {
    qb3f_7b((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xb7ee,0xb568);
  }
  return;
}


// ==== FUN_1000_21f3 @ 1000:21f3 (size 260) callers: FUN_1000_0cd2

void __cdecl16near FUN_1000_21f3(void)

{
  word in_AX;
  uint uVar1;
  uint uVar2;
  word dx;
  word bx;
  word dx_00;
  word wVar3;
  word wVar4;
  int iVar5;
  word wVar6;
  undefined *bx_00;
  word unaff_SI;
  word si;
  word unaff_DI;
  word di;
  undefined1 uVar7;
  undefined4 uVar8;
  long lVar9;
  
  wVar3 = 0xbc1a;
  uVar8 = qb3f_61(in_AX,0xbc1a,0xb5a8,unaff_SI,unaff_DI);
  si = 0xb7ee;
  uVar8 = qb3f_7b((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),0xb7ee,0x4e28);
  qb3d_25((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),0xb7ee,0x4e28);
  wVar4 = 0;
  DAT_2000_b5ac = wVar3;
  qb3d_21(wVar3,0,dx,0xb7ee,0x4e28);
  DAT_2000_b5ae = wVar4;
  while( true ) {
    wVar3 = FUN_1000_2f71();
    iVar5 = -0x4b64;
    uVar8 = qb3f_bb(wVar3,0xb49c,0xb49c,si,0x4e28);
    wVar3 = (word)((ulong)uVar8 >> 0x10);
    uVar2 = 0;
    if (0x2f < iVar5) {
      uVar2 = 0xffff;
    }
    qb3f_bb((word)uVar8,wVar3,wVar3,si,0x4e28);
    uVar1 = 0;
    if ((int)wVar3 < 0x3a) {
      uVar1 = 0xffff;
    }
    uVar7 = (uVar1 & uVar2) == 0;
    if ((bool)uVar7) {
      lVar9 = (ulong)bx << 0x10;
    }
    else {
      wVar3 = bx;
      wVar4 = qb3f_55(0xb5a8,bx,bx,si,0x4e28);
      uVar8 = qb3f_61(wVar4,wVar3,wVar4,si,0x4e28);
      si = 0x4e28;
      uVar8 = qb3f_7f((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),0x4e28,0xb7f6);
      lVar9 = qb3f_7d((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),0x4e28,0x4e28);
    }
    wVar3 = 0xb5a8;
    uVar8 = qb3d_13((word)lVar9,0xb5a8,(word)((ulong)lVar9 >> 0x10),si,0x4e28);
    uVar8 = qb3f_7a((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),si,0x4e28);
    di = 0xb546;
    qb3f_7d((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),si,0xb546);
    wVar3 = qb3f_62(wVar3,0xbc1a,dx_00,si,0xb546);
    wVar4 = 0;
    if (!(bool)uVar7) {
      wVar4 = 0xffff;
    }
    wVar6 = 0xb49c;
    uVar8 = qb3f_bb(wVar3,0xb49c,wVar4,si,0xb546);
    uVar1 = (uint)((ulong)uVar8 >> 0x10);
    uVar2 = 0;
    if (wVar6 == 8) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & uVar1) != 0) {
      uVar8 = qb3f_7f((word)uVar8,wVar6,uVar1,0x4e28,0xb7d0);
      di = 0x4e28;
      uVar8 = qb3f_7d((word)uVar8,wVar6,(word)((ulong)uVar8 >> 0x10),0x4e28,0x4e28);
      si = 0x4e28;
      wVar4 = qb3f_75((word)uVar8,wVar6,(word)((ulong)uVar8 >> 0x10),0x4e28,0x4e28);
      wVar3 = wVar4;
      wVar6 = qb3d_0b(wVar6,wVar4,wVar6,0x4e28,0x4e28);
      uVar8 = qb3f_61(wVar6,wVar3,wVar4,0x4e28,0x4e28);
    }
    iVar5 = -0x4b64;
    uVar8 = qb3f_bb((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),si,di);
    uVar7 = iVar5 == 0xd;
    if ((bool)uVar7) break;
    uVar8 = qb3e_42((word)uVar8,DAT_2000_b5ac,(word)((ulong)uVar8 >> 0x10),si,di);
    wVar3 = DAT_2000_b5ae;
    uVar8 = qb3e_44((word)uVar8,DAT_2000_b5ae,(word)((ulong)uVar8 >> 0x10),si,di);
    uVar8 = qb3f_bc((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),si,di);
    uVar8 = qb3f_6a((word)uVar8,0xb5a8,(word)((ulong)uVar8 >> 0x10),si,di);
    bx_00 = (undefined *)&lit_empty;
    uVar8 = qb3f_6a((word)uVar8,0xbb56,(word)((ulong)uVar8 >> 0x10),si,di);
    uVar8 = qb3e_79((word)uVar8,(word)bx_00,(word)((ulong)uVar8 >> 0x10),si,di);
    wVar3 = DAT_2000_b540;
    uVar8 = qb3f_57((word)uVar8,DAT_2000_b540,(word)((ulong)uVar8 >> 0x10),si,di);
    qb3f_a1((word)uVar8,wVar3,(word)((ulong)uVar8 >> 0x10),si,0x4e28);
    if ((bool)uVar7) {
      return;
    }
  }
  return;
}


// ==== FUN_1000_2f1a @ 1000:2f1a (size 27) callers: FUN_1000_0cd2,FUN_1000_1055,FUN_1000_2f35,FUN_1000_35ac,FUN_1000_90d3,FUN_1000_9555,FUN_1000_9569,FUN_1000_9a2f

void __cdecl16near FUN_1000_2f1a(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word unaff_SI;
  word unaff_DI;
  word di;
  undefined1 in_CF;
  undefined1 uVar1;
  undefined4 uVar2;
  
  uVar2 = qb3d_43(in_AX,in_BX,in_DX,unaff_SI,unaff_DI);
  di = 0xb5ba;
  uVar2 = qb3f_7d((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xb5ba);
  do {
    uVar1 = in_CF;
    uVar2 = qb3d_43((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),unaff_SI,di);
    uVar2 = qb3f_99((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xb5ba);
    di = 0xb7d8;
    uVar2 = qb3f_a1((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xb7d8);
    in_CF = 1;
  } while ((bool)uVar1);
  return;
}


// ==== FUN_1000_2f35 @ 1000:2f35 (size 7) callers: FUN_1000_1918,FUN_1000_3dae,FUN_1000_3ffc

void __cdecl16near FUN_1000_2f35(void)

{
  FUN_1000_2f1a();
  FUN_1000_2f1a();
  return;
}


// ==== FUN_1000_2f3c @ 1000:2f3c (size 7) callers: FUN_1000_19f7,FUN_1000_3b16,FUN_1000_a013

void __cdecl16near FUN_1000_2f3c(void)

{
  FUN_1000_c5b0();
  FUN_1000_2ff7();
  return;
}


// ==== FUN_1000_2f43 @ 1000:2f43 (size 45) callers: FUN_1000_2f71,FUN_1000_3ffc,FUN_1000_7c49,FUN_1000_9a2f

void __cdecl16near FUN_1000_2f43(void)

{
  word in_DX;
  word extraout_DX;
  word in_BX;
  word si;
  bool bVar1;
  undefined4 uVar2;
  
  for (DAT_2000_b5be = 1; (int)DAT_2000_b5be < 7; DAT_2000_b5be = DAT_2000_b5be + 1) {
    bVar1 = 0xe06d < DAT_2000_b5be * 4;
    si = DAT_2000_b5be * 4 + 0x1f92;
    uVar2 = qb3f_9f(DAT_2000_b5be,in_BX,in_DX,si,0xb7f6);
    in_DX = (word)((ulong)uVar2 >> 0x10);
    if (bVar1) {
      qb3f_7b((word)uVar2,in_BX,in_DX,0xb7f6,si);
      in_DX = extraout_DX;
    }
  }
  return;
}


// ==== FUN_1000_2f71 @ 1000:2f71 (size 22) callers: FUN_1000_1340,FUN_1000_21f3,FUN_1000_2f71,FUN_1000_35ac,FUN_1000_7dc9,FUN_1000_7ffb,FUN_1000_c33b,FUN_1000_c551,FUN_1000_c5b0,entry

void FUN_1000_2f71(void)

{
  undefined2 in_AX;
  word wVar1;
  word wVar2;
  uint uVar3;
  undefined2 in_DX;
  word ax;
  word dx;
  word dx_00;
  uint dx_01;
  word in_BX;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_ZF;
  undefined1 uVar4;
  undefined4 uVar5;
  
  uVar5 = CONCAT22(in_DX,in_AX);
  do {
    uVar4 = in_ZF;
    wVar1 = qb3d_06((word)uVar5,in_BX,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
    qb3f_61(wVar1,in_BX,0xb49c,unaff_SI,unaff_DI);
    in_BX = 0xbc1a;
    uVar5 = qb3f_62(ax,0xbc1a,ax,unaff_SI,unaff_DI);
    in_ZF = 1;
  } while ((bool)uVar4);
  FUN_1000_2f43();
  uVar5 = qb3f_62(0xb49c,0xbc1a,dx,unaff_SI,unaff_DI);
  wVar1 = (word)uVar5;
  if (!(bool)uVar4) {
    wVar2 = qb3f_bb(wVar1,wVar1,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
    dx_00 = 0;
    if (0x60 < (int)wVar1) {
      dx_00 = 0xffff;
    }
    uVar5 = qb3f_bb(wVar2,wVar2,dx_00,unaff_SI,unaff_DI);
    dx_01 = (uint)((ulong)uVar5 >> 0x10);
    wVar1 = (word)uVar5;
    uVar3 = 0;
    if ((int)wVar2 < 0x7a) {
      uVar3 = 0xffff;
    }
    if ((uVar3 & dx_01) != 0) {
      uVar5 = qb3f_bb(wVar1,wVar1,dx_01,unaff_SI,unaff_DI);
      wVar1 = wVar1 - 0x20;
      wVar2 = qb3d_05((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
      qb3f_61(wVar2,wVar1,wVar2,unaff_SI,unaff_DI);
    }
  }
  return;
}


// ==== FUN_1000_2f87 @ 1000:2f87 (size 68) callers: FUN_1000_0cd2,FUN_1000_803a

void __cdecl16near FUN_1000_2f87(void)

{
  word wVar1;
  uint uVar2;
  word in_DX;
  word dx;
  uint dx_00;
  word wVar3;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_ZF;
  undefined4 uVar4;
  
  uVar4 = qb3f_62(0xb49c,0xbc1a,in_DX,unaff_SI,unaff_DI);
  wVar3 = (word)uVar4;
  if (!(bool)in_ZF) {
    wVar1 = qb3f_bb(wVar3,wVar3,(word)((ulong)uVar4 >> 0x10),unaff_SI,unaff_DI);
    dx = 0;
    if (0x60 < (int)wVar3) {
      dx = 0xffff;
    }
    uVar4 = qb3f_bb(wVar1,wVar1,dx,unaff_SI,unaff_DI);
    dx_00 = (uint)((ulong)uVar4 >> 0x10);
    wVar3 = (word)uVar4;
    uVar2 = 0;
    if ((int)wVar1 < 0x7a) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & dx_00) != 0) {
      uVar4 = qb3f_bb(wVar3,wVar3,dx_00,unaff_SI,unaff_DI);
      wVar3 = wVar3 - 0x20;
      wVar1 = qb3d_05((word)uVar4,wVar3,(word)((ulong)uVar4 >> 0x10),unaff_SI,unaff_DI);
      qb3f_61(wVar1,wVar3,wVar1,unaff_SI,unaff_DI);
    }
  }
  return;
}


// ==== FUN_1000_2fcb @ 1000:2fcb (size 44) callers: FUN_1000_05cb,FUN_1000_19f7,FUN_1000_3b16,FUN_1000_3d83,FUN_1000_54cb,FUN_1000_803a,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_b308,entry

void __cdecl16near FUN_1000_2fcb(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word wVar1;
  word unaff_DI;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar2;
  
  wVar1 = 0xb7f6;
  uVar2 = qb3f_6f(in_AX,in_BX,in_DX,0xb7f6,unaff_DI);
  while( true ) {
    uVar2 = qb3f_7d((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),wVar1,0x4e28);
    uVar2 = qb3f_9f((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0x4e28,0xbd1e);
    if (!(bool)in_CF && !(bool)in_ZF) break;
    wVar1 = qb3d_06((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0x4e28,0xbd1e);
    uVar2 = qb3f_61(wVar1,in_BX,0xb49c,0x4e28,0xbd1e);
    wVar1 = 0x4e28;
    uVar2 = qb3f_7f((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0x4e28,0xb7f6);
  }
  return;
}


// ==== FUN_1000_2ff7 @ 1000:2ff7 (size 21) callers: FUN_1000_2f3c,FUN_1000_c551,entry

void __cdecl16near FUN_1000_2ff7(void)

{
  word in_AX;
  word in_DX;
  word bx;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_ZF;
  undefined4 uVar1;
  
  bx = 1;
  uVar1 = qb3e_5b(in_AX,1,in_DX,unaff_SI,unaff_DI);
  qb3f_9f((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb462,0xb7f6);
  if ((bool)in_ZF) {
    FUN_1000_300c();
    return;
  }
  return;
}


// ==== FUN_1000_300c @ 1000:300c (size 29) callers: FUN_1000_0cd2,FUN_1000_2ff7,FUN_1000_b674

void __cdecl16near FUN_1000_300c(void)

{
  word in_AX;
  word ax;
  word in_DX;
  word in_BX;
  word wVar1;
  word unaff_DI;
  undefined4 uVar2;
  
  uVar2 = qb3f_75(in_AX,in_BX,in_DX,0xb46e,unaff_DI);
  ax = qb3e_33((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb46e,unaff_DI);
  wVar1 = DAT_2000_b472;
  uVar2 = qb3e_35(ax,DAT_2000_b472,in_BX,0xb46e,unaff_DI);
  uVar2 = qb3e_33((word)uVar2,(word)((ulong)uVar2 >> 0x10),wVar1,0xb46e,unaff_DI);
  wVar1 = (word)((ulong)uVar2 >> 0x10);
  qb3e_35((word)uVar2,wVar1,wVar1,0xb46e,unaff_DI);
  return;
}


// ==== FUN_1000_3029 @ 1000:3029 (size 15) callers: FUN_1000_0cd2,FUN_1000_1340,FUN_1000_1918,FUN_1000_35ac,FUN_1000_803a,FUN_1000_8fea

void __cdecl16near FUN_1000_3029(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  undefined1 in_ZF;
  
  qb3f_9f(in_AX,in_BX,in_DX,0xb4fa,0xb7f6);
  if (!(bool)in_ZF) {
    FUN_1000_3038();
    return;
  }
  return;
}


// ==== FUN_1000_3038 @ 1000:3038 (size 143) callers: FUN_1000_0cd2,FUN_1000_3029

void __cdecl16near FUN_1000_3038(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word bx;
  word wVar1;
  word unaff_DI;
  undefined1 uVar2;
  undefined1 uVar3;
  undefined4 uVar4;
  
  if (DAT_2000_b536 == -1) {
    DAT_2000_b536 = 0;
    return;
  }
  uVar2 = DAT_2000_b536 == 0;
  uVar3 = DAT_2000_b536 == 1;
  if ((bool)uVar3) {
    DAT_2000_4e08 = 0x28;
    DAT_2000_4e0a = 0x28;
    DAT_2000_4e0c = 0x28;
    DAT_2000_4e0e = 0x28;
    DAT_2000_b536 = 0;
  }
  wVar1 = 0xb7f6;
  uVar4 = qb3f_6f(in_AX,in_BX,in_DX,0xb7f6,unaff_DI);
  while( true ) {
    uVar4 = qb3f_7d((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),wVar1,0x4e28);
    uVar4 = qb3f_9f((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb802);
    if (!(bool)uVar2 && !(bool)uVar3) break;
    uVar4 = qb3f_75((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb802);
    wVar1 = in_BX * 2;
    uVar2 = 0;
    uVar3 = *(int *)(wVar1 + 0x4e06) == 0;
    if (0 < *(int *)(wVar1 + 0x4e06)) {
      uVar4 = qb3e_42((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0x4e28,wVar1);
      bx = 1;
      uVar4 = qb3e_44((word)uVar4,1,(word)((ulong)uVar4 >> 0x10),0x4e28,wVar1);
      uVar4 = qb3f_bc((word)uVar4,bx,(word)((ulong)uVar4 >> 0x10),0x4e28,wVar1);
      in_BX = *(word *)(wVar1 + 0x4e06);
      uVar4 = qb3d_0d((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0x4e28,wVar1);
      uVar4 = qb3f_6a((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0x4e28,wVar1);
      uVar4 = qb3e_79((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0x4e28,wVar1);
      *(undefined2 *)(wVar1 + 0x4e06) = 0;
    }
    wVar1 = 0x4e28;
    uVar4 = qb3f_7f((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb7f6);
  }
  return;
}


// ==== FUN_1000_30c7 @ 1000:30c7 (size 202) callers: FUN_1000_09e8

void __cdecl16near FUN_1000_30c7(void)

{
  undefined2 *puVar1;
  word in_AX;
  word wVar2;
  int iVar3;
  word in_DX;
  uint extraout_DX;
  word in_BX;
  word wVar4;
  uint uVar5;
  word unaff_DI;
  uint uVar6;
  undefined1 uVar7;
  bool bVar8;
  undefined1 uVar9;
  undefined2 in_FPUControlWord;
  undefined2 in_FPUStatusWord;
  undefined2 in_FPUTagWord;
  undefined2 in_FPULastInstructionOpcode;
  undefined4 in_FPUDataPointer;
  undefined4 in_FPUInstructionPointer;
  undefined4 uVar10;
  
  uVar10 = qb3f_75(in_AX,in_BX,in_DX,0xb47c,unaff_DI);
  uVar10 = qb3f_5e((word)uVar10,in_BX,(word)((ulong)uVar10 >> 0x10),0xb47c,unaff_DI);
  puVar1 = (undefined2 *)(in_BX + 0xb47c);
  *puVar1 = in_FPUControlWord;
  puVar1[2] = in_FPUStatusWord;
  puVar1[4] = in_FPUTagWord;
  *(undefined4 *)(puVar1 + 10) = in_FPUDataPointer;
  *(undefined4 *)(puVar1 + 6) = in_FPUInstructionPointer;
  puVar1[9] = in_FPULastInstructionOpcode;
  DAT_2000_b4ae = DAT_2000_b4ae ^ (uint)uVar10;
  uVar6 = unaff_DI ^ *(uint *)(in_BX + 0xb7f6);
  bVar8 = uVar6 == 0;
  uVar10 = qb3f_9f((word)((ulong)uVar10 >> 0x10),in_BX,(uint)uVar10,0xb50e,uVar6);
  wVar4 = 0;
  if (bVar8) {
    wVar4 = 0xffff;
  }
  wVar2 = qb3f_7f((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0xb4d2,0xb7d0);
  qb3f_77(wVar2,wVar4,wVar4,0xb4d2,0xb7d0);
  wVar2 = (word)((long)(int)wVar4 * 0x16);
  uVar6 = extraout_DX;
  iVar3 = qb3f_75(wVar2,wVar4,(word)((ulong)((long)(int)wVar4 * 0x16) >> 0x10),0xb4ca,wVar2);
  uVar5 = 0;
  if (0 < *(int *)((wVar4 + iVar3) * 2 + 0x4e90)) {
    uVar5 = 0xffff;
  }
  wVar4 = uVar5 & uVar6;
  uVar7 = 0;
  uVar9 = wVar4 == 0;
  if ((bool)uVar9) {
    uVar10 = FUN_1000_340c();
    uVar10 = qb3f_7b((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0xb7f6,0xb47c);
    wVar2 = 0xb7f6;
    uVar10 = qb3f_7b((word)uVar10,0xb7f6,(word)((ulong)uVar10 >> 0x10),0xb4d2,0xb5c0);
    uVar10 = qb3f_7b((word)uVar10,wVar2,(word)((ulong)uVar10 >> 0x10),0xb4ca,0xb5c4);
    qb3f_7b((word)uVar10,wVar2,(word)((ulong)uVar10 >> 0x10),wVar2,0xb5c8);
    uVar10 = FUN_1000_548b();
    uVar10 = qb3f_9f((word)uVar10,wVar2,(word)((ulong)uVar10 >> 0x10),0xb5cc,0xbb68);
    wVar4 = (word)((ulong)uVar10 >> 0x10);
    if (!(bool)uVar7 && !(bool)uVar9) {
      qb3f_7b((word)uVar10,wVar2,wVar4,0xb7f6,0xb4c2);
      FUN_1000_3ffc();
      return;
    }
    uVar10 = qb3f_9f((word)uVar10,wVar2,wVar4,0xb4d2,0xb7f6);
    if (!(bool)uVar7 && !(bool)uVar9) {
      wVar2 = 0xb7f6;
      uVar10 = qb3f_7f((word)uVar10,0xb7f6,(word)((ulong)uVar10 >> 0x10),0xb4d2,0xb7d0);
      uVar10 = qb3f_7d((word)uVar10,wVar2,(word)((ulong)uVar10 >> 0x10),0xb4d2,0xb4d2);
      uVar10 = qb3f_7f((word)uVar10,wVar2,(word)((ulong)uVar10 >> 0x10),0xb474,wVar2);
      uVar10 = qb3f_7d((word)uVar10,wVar2,(word)((ulong)uVar10 >> 0x10),0xb474,0xb474);
    }
    uVar10 = qb3f_7b((word)uVar10,wVar2,(word)((ulong)uVar10 >> 0x10),0xb4ca,0xb5d0);
    wVar4 = qb3f_7b((word)uVar10,wVar2,(word)((ulong)uVar10 >> 0x10),0xb4d2,0xb5d4);
    qb3f_61(wVar4,0xbc1a,0xb49c,0xb4d2,0xb5d4);
    FUN_1000_3ffc();
    return;
  }
  FUN_1000_33ea();
  return;
}


// ==== FUN_1000_3192 @ 1000:3192 (size 194) callers: FUN_1000_09e8

void __cdecl16near FUN_1000_3192(void)

{
  word in_AX;
  word wVar1;
  int iVar2;
  uint uVar3;
  word in_DX;
  uint extraout_DX;
  word in_BX;
  word wVar4;
  uint uVar5;
  undefined1 uVar6;
  undefined1 in_ZF;
  undefined1 uVar7;
  undefined4 uVar8;
  
  wVar1 = qb3f_9f(in_AX,in_BX,in_DX,0xb50e,0xb7f6);
  wVar4 = 0;
  if ((bool)in_ZF) {
    wVar4 = 0xffff;
  }
  qb3f_75(wVar1,wVar4,wVar4,0xb4d2,0xb7f6);
  uVar3 = extraout_DX;
  uVar8 = qb3f_7f((word)((long)(int)wVar4 * 0x16),wVar4,
                  (word)((ulong)((long)(int)wVar4 * 0x16) >> 0x10),0xb4ca,0xb7f6);
  iVar2 = qb3f_77((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb7f6);
  uVar5 = 0;
  if (0 < *(int *)((wVar4 + iVar2) * 2 + 0x4e90)) {
    uVar5 = 0xffff;
  }
  wVar1 = uVar5 & uVar3;
  uVar6 = 0;
  uVar7 = wVar1 == 0;
  if ((bool)uVar7) {
    uVar8 = FUN_1000_340c();
    uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb7d8,0xb47c);
    wVar4 = 0xb7d8;
    uVar8 = qb3f_7f((word)uVar8,0xb7d8,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb7f6);
    uVar8 = qb3f_7d((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb5c4);
    uVar8 = qb3f_7b((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4d2,0xb5c0);
    qb3f_7b((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),wVar4,0xb5c8);
    uVar8 = FUN_1000_548b();
    uVar8 = qb3f_9f((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb5cc,0xbb68);
    wVar1 = (word)((ulong)uVar8 >> 0x10);
    if (!(bool)uVar6 && !(bool)uVar7) {
      qb3f_7b((word)uVar8,wVar4,wVar1,0xb7f6,0xb4c2);
      FUN_1000_3ffc();
      return;
    }
    uVar8 = qb3f_9f((word)uVar8,wVar4,wVar1,0xb4ca,0xbc1e);
    if ((bool)uVar6) {
      uVar8 = qb3f_7b((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb5c4);
      uVar8 = qb3f_7f((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb7f6);
      wVar4 = 0xb7f6;
      uVar8 = qb3f_7d((word)uVar8,0xb7f6,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb4ca);
      uVar8 = qb3f_7f((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb474,wVar4);
      uVar8 = qb3f_7d((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb474,0xb474);
    }
    uVar8 = qb3f_7b((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb5d0);
    wVar1 = qb3f_7b((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4d2,0xb5d4);
    qb3f_61(wVar1,0xbc1a,0xb49c,0xb4d2,0xb5d4);
    FUN_1000_3ffc();
    return;
  }
  FUN_1000_33ea();
  return;
}


// ==== FUN_1000_3254 @ 1000:3254 (size 194) callers: FUN_1000_09e8

void __cdecl16near FUN_1000_3254(void)

{
  word in_AX;
  word wVar1;
  int iVar2;
  uint uVar3;
  word in_DX;
  uint extraout_DX;
  word in_BX;
  word wVar4;
  uint uVar5;
  undefined1 uVar6;
  undefined1 in_ZF;
  undefined1 uVar7;
  undefined4 uVar8;
  
  uVar8 = qb3f_9f(in_AX,in_BX,in_DX,0xb50e,0xb7f6);
  wVar4 = 0;
  if ((bool)in_ZF) {
    wVar4 = 0xffff;
  }
  wVar1 = qb3f_7f((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4d2,0xb7f6);
  qb3f_77(wVar1,wVar4,wVar4,0xb4d2,0xb7f6);
  wVar1 = (word)((long)(int)wVar4 * 0x16);
  uVar3 = extraout_DX;
  iVar2 = qb3f_75(wVar1,wVar4,(word)((ulong)((long)(int)wVar4 * 0x16) >> 0x10),0xb4ca,wVar1);
  uVar5 = 0;
  if (0 < *(int *)((wVar4 + iVar2) * 2 + 0x4e90)) {
    uVar5 = 0xffff;
  }
  wVar4 = uVar5 & uVar3;
  uVar6 = 0;
  uVar7 = wVar4 == 0;
  if ((bool)uVar7) {
    uVar8 = FUN_1000_340c();
    uVar8 = qb3f_7b((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xbb60,0xb47c);
    uVar8 = qb3f_7b((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb5c4);
    uVar8 = qb3f_7f((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4d2,0xb7f6);
    wVar1 = 0xb7f6;
    uVar8 = qb3f_7d((word)uVar8,0xb7f6,(word)((ulong)uVar8 >> 0x10),0xb4d2,0xb5c0);
    qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),wVar1,0xb5c8);
    uVar8 = FUN_1000_548b();
    uVar8 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb5cc,0xbb68);
    wVar4 = (word)((ulong)uVar8 >> 0x10);
    if (!(bool)uVar6 && !(bool)uVar7) {
      qb3f_7b((word)uVar8,wVar1,wVar4,0xb7f6,0xb4c2);
      FUN_1000_3ffc();
      return;
    }
    uVar8 = qb3f_9f((word)uVar8,wVar1,wVar4,0xb4d2,0xcb6a);
    if ((bool)uVar6) {
      uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb4d2,0xb5c0);
      uVar8 = qb3f_7f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb4d2,0xb7f6);
      wVar1 = 0xb7f6;
      uVar8 = qb3f_7d((word)uVar8,0xb7f6,(word)((ulong)uVar8 >> 0x10),0xb7f6,0xb4d2);
      uVar8 = qb3f_7f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb474,wVar1);
      uVar8 = qb3f_7d((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb474,0xb474);
    }
    uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb5d0);
    wVar4 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb4d2,0xb5d4);
    qb3f_61(wVar4,0xbc1a,0xb49c,0xb4d2,0xb5d4);
    FUN_1000_3ffc();
    return;
  }
  FUN_1000_33ea();
  return;
}


// ==== FUN_1000_3316 @ 1000:3316 (size 212) callers: FUN_1000_09e8

void __cdecl16near FUN_1000_3316(void)

{
  word in_AX;
  word wVar1;
  int iVar2;
  uint uVar3;
  word in_DX;
  uint extraout_DX;
  word in_BX;
  word wVar4;
  uint uVar5;
  undefined1 uVar6;
  undefined1 in_ZF;
  undefined1 uVar7;
  undefined4 uVar8;
  
  wVar1 = qb3f_9f(in_AX,in_BX,in_DX,0xb50e,0xb7f6);
  wVar4 = 0;
  if ((bool)in_ZF) {
    wVar4 = 0xffff;
  }
  qb3f_75(wVar1,wVar4,wVar4,0xb4d2,0xb7f6);
  uVar3 = extraout_DX;
  uVar8 = qb3f_7f((word)((long)(int)wVar4 * 0x16),wVar4,
                  (word)((ulong)((long)(int)wVar4 * 0x16) >> 0x10),0xb4ca,0xb7d0);
  iVar2 = qb3f_77((word)uVar8,wVar4,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb7d0);
  uVar5 = 0;
  if (0 < *(int *)((wVar4 + iVar2) * 2 + 0x4e90)) {
    uVar5 = 0xffff;
  }
  wVar1 = uVar5 & uVar3;
  uVar6 = 0;
  uVar7 = wVar1 == 0;
  if ((bool)uVar7) {
    uVar8 = FUN_1000_340c();
    uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb802,0xb47c);
    uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb5c4);
    uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb4d2,0xb5c0);
    qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb7d8,0xb5c8);
    uVar8 = FUN_1000_548b();
    uVar8 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb5cc,0xbb68);
    wVar4 = (word)((ulong)uVar8 >> 0x10);
    if (!(bool)uVar6 && !(bool)uVar7) {
      qb3f_7b((word)uVar8,wVar1,wVar4,0xb7f6,0xb4c2);
      FUN_1000_3ffc();
      return;
    }
    uVar8 = qb3f_9f((word)uVar8,wVar1,wVar4,0xb4ca,0xb7f6);
    if (!(bool)uVar6 && !(bool)uVar7) {
      wVar1 = 0xb7f6;
      uVar8 = qb3f_7f((word)uVar8,0xb7f6,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb7d0);
      uVar8 = qb3f_7d((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb4ca);
      uVar8 = qb3f_7f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb474,wVar1);
      uVar8 = qb3f_7d((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb474,0xb474);
    }
    uVar8 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb4ca,0xb5d0);
    wVar1 = qb3f_7b((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb4d2,0xb5d4);
    qb3f_61(wVar1,0xbc1a,0xb49c,0xb4d2,0xb5d4);
    FUN_1000_3ffc();
    return;
  }
  FUN_1000_33ea();
  return;
}


// ==== FUN_1000_33ea @ 1000:33ea (size 34) callers: FUN_1000_30c7,FUN_1000_3192,FUN_1000_3254,FUN_1000_3316

void __cdecl16near FUN_1000_33ea(void)

{
  word in_AX;
  word in_DX;
  word wVar1;
  undefined *bx;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  uVar2 = qb3e_42(in_AX,6,in_DX,unaff_SI,unaff_DI);
  wVar1 = 0x16;
  uVar2 = qb3e_44((word)uVar2,0x16,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_bc((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  bx = (undefined *)&lit_MONSTER_BLOCKS_WAY;
  uVar2 = qb3f_6e((word)uVar2,0xcb6e,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = qb3e_79((word)uVar2,(word)bx,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  qb3f_61(wVar1,0xbc1a,0xb49c,unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_340c @ 1000:340c (size 28) callers: FUN_1000_30c7,FUN_1000_3192,FUN_1000_3254,FUN_1000_3316,FUN_1000_8f6a

void __cdecl16near FUN_1000_340c(void)

{
  word in_AX;
  word in_DX;
  word wVar1;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  uVar2 = qb3e_42(in_AX,6,in_DX,unaff_SI,unaff_DI);
  wVar1 = 0x16;
  uVar2 = qb3e_44((word)uVar2,0x16,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_bc((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = 0x12;
  uVar2 = qb3d_0d((word)uVar2,0x12,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_6e((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_35ac @ 1000:35ac (size 276) callers: FUN_1000_0cd2

void __cdecl16near FUN_1000_35ac(void)

{
  int *piVar1;
  word in_AX;
  word wVar2;
  word in_DX;
  uint uVar3;
  word in_BX;
  word wVar4;
  undefined *puVar5;
  uint bx;
  undefined1 *bx_00;
  int *bx_01;
  int *bx_02;
  int *bx_03;
  undefined2 unaff_ES;
  undefined2 unaff_SS;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined1 uVar6;
  undefined4 uVar7;
  
  qb3f_7b(in_AX,in_BX,in_DX,0xb7ee,0xb4fa);
  DAT_2000_b5da = 0;
  DAT_2000_b536 = 1;
  uVar7 = FUN_1000_3029();
  wVar4 = 1;
  uVar7 = qb3e_42((word)uVar7,1,(word)((ulong)uVar7 >> 0x10),0xb7ee,0xb4fa);
  uVar7 = qb3e_44((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb7ee,0xb4fa);
  wVar2 = qb3f_bc((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb7ee,0xb4fa);
  puVar5 = (undefined *)&lit_WHAT_LEVEL_SPELL_1_6;
  uVar7 = qb3f_6e(wVar2,0xcba6,wVar4,0xb7ee,0xb4fa);
  uVar7 = qb3e_79((word)uVar7,(word)puVar5,(word)((ulong)uVar7 >> 0x10),0xb7ee,0xb4fa);
  DAT_2000_b536 = (word)((ulong)uVar7 >> 0x10);
  uVar7 = qb3f_bc((word)uVar7,(word)puVar5,DAT_2000_b536,0xb7ee,0xb4fa);
  puVar5 = (undefined *)&lit_ESC_CAST_NO_SPELL;
  uVar7 = qb3f_6e((word)uVar7,0xcbc2,(word)((ulong)uVar7 >> 0x10),0xb7ee,0xb4fa);
  qb3e_79((word)uVar7,(word)puVar5,(word)((ulong)uVar7 >> 0x10),0xb7ee,0xb4fa);
  uVar7 = FUN_1000_7dc9();
  wVar2 = 0xb49c;
  uVar7 = qb3d_13((word)uVar7,0xb49c,(word)((ulong)uVar7 >> 0x10),0xb7ee,0xb4fa);
  uVar7 = qb3f_7a((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0xb7ee,0xb4fa);
  uVar7 = qb3f_7d((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0xb7ee,0xb5b2);
  uVar7 = qb3f_9f((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0xb5b2,0xb7f6);
  if ((bool)in_CF) {
    return;
  }
  uVar7 = qb3f_9f((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0xb5b2,0xb7fa);
  bx = 0;
  if (!(bool)in_CF && !(bool)in_ZF) {
    bx = 0xffff;
    in_ZF = 0;
  }
  wVar2 = qb3f_9f((word)uVar7,bx,(word)((ulong)uVar7 >> 0x10),0xb5b2,0xb568);
  uVar3 = 0;
  if (!(bool)in_CF && !(bool)in_ZF) {
    uVar3 = 0xffff;
  }
  uVar6 = (uVar3 | bx) == 0;
  if (!(bool)uVar6) {
    uVar7 = qb3f_bc(wVar2,bx,uVar3 | bx,0xb5b2,0xb568);
    bx_00 = (undefined1 *)&lit_NOT_ENOUGH_SPELL_POINTS;
    uVar7 = qb3f_6e((word)uVar7,0xcbd8,(word)((ulong)uVar7 >> 0x10),0xb5b2,0xb568);
    qb3e_79((word)uVar7,(word)bx_00,(word)((ulong)uVar7 >> 0x10),0xb5b2,0xb568);
    FUN_1000_2f1a();
    return;
  }
  DAT_2000_b536 = 1;
  uVar7 = FUN_1000_3029();
  DAT_2000_b5dc = 1;
  wVar2 = 1;
  uVar7 = qb3e_42((word)uVar7,1,(word)((ulong)uVar7 >> 0x10),0xb5b2,0xb568);
  qb3e_44((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0xb5b2,0xb568);
  uVar7 = FUN_1000_c5d0();
  DAT_2000_b536 = 1;
  uVar7 = qb3f_9f((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0x52fc,0xbb60);
  if ((bool)uVar6) {
    return;
  }
  uVar7 = qb3f_ab((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0xb5b2,0xbb60);
  piVar1 = (int *)((int)(undefined2 *)&DAT_2000_52fb + wVar2 + 1);
  *piVar1 = (int)(undefined2 *)&DAT_2000_bb60 + *piVar1;
  uVar7 = qb3f_81((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0xb5b2,0xbb60);
  bx_01 = (int *)&DAT_2000_bb60;
  uVar7 = qb3f_81((word)uVar7,0xbb60,(word)((ulong)uVar7 >> 0x10),0xb5b2,0xcbf6);
  bx_02 = bx_01;
  uVar7 = qb3f_7d((word)uVar7,(word)bx_01,(word)((ulong)uVar7 >> 0x10),0xb5b2,(word)bx_01);
  bx_03 = bx_02;
  uVar7 = qb3f_75((word)uVar7,(word)bx_02,(word)((ulong)uVar7 >> 0x10),(word)bx_02,(word)bx_01);
  uVar7 = qb3f_5e((word)uVar7,(word)bx_03,(word)((ulong)uVar7 >> 0x10),(word)bx_02,(word)bx_01);
  wVar2 = (int)bx_01 + 1;
  *(char *)bx_01 = (char)uVar7;
  *(char *)0x36f4 = *(char *)0x36f4 << 1;
  piVar1 = bx_03;
  *piVar1 = *piVar1 - (int)bx_02;
  if (*piVar1 < 0) {
    return;
  }
  uVar7 = qb3f_6a((word)uVar7,0xcbfa,(word)((ulong)uVar7 >> 0x10),(word)bx_02,wVar2);
  wVar4 = 0xb48c;
  uVar7 = qb3f_6b((word)uVar7,0xb48c,(word)((ulong)uVar7 >> 0x10),(word)bx_02,wVar2);
  uVar7 = qb3e_79((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),(word)bx_02,wVar2);
  uVar7 = qb3f_7f((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb568,0xb7d0);
  qb3f_7d((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb568,0xb568);
  FUN_1000_2f71();
  return;
}


// ==== FUN_1000_3b02 @ 1000:3b02 (size 20) callers: FUN_1000_0636,FUN_1000_3ffc,FUN_1000_9a2f

void __cdecl16near FUN_1000_3b02(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar1;
  
  uVar1 = qb3f_9f(in_AX,in_BX,in_DX,0xb4f2,0xb4ee);
  if (!(bool)in_CF && !(bool)in_ZF) {
    qb3f_7b((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb4ee,0xb4f2);
  }
  return;
}


// ==== FUN_1000_3b16 @ 1000:3b16 (size 621) callers: FUN_1000_0cd2

void __cdecl16near FUN_1000_3b16(void)

{
  word in_AX;
  word wVar1;
  undefined *bx;
  word in_DX;
  word extraout_DX;
  word extraout_DX_00;
  undefined1 *puVar2;
  undefined *puVar3;
  word unaff_SI;
  undefined *puVar4;
  uint uVar5;
  word unaff_DI;
  undefined1 uVar6;
  bool bVar7;
  undefined1 uVar8;
  bool bVar9;
  undefined4 uVar10;
  
  wVar1 = qb3e_32(in_AX,0xffff,in_DX,unaff_SI,unaff_DI);
  puVar2 = (undefined1 *)&lit_YOU_HAVE;
  uVar10 = qb3f_61(wVar1,0xcc78,0xb49c,unaff_SI,unaff_DI);
  uVar10 = qb3f_bc((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = (word)((ulong)uVar10 >> 0x10);
  uVar10 = qb3f_6a((word)uVar10,wVar1,wVar1,unaff_SI,unaff_DI);
  puVar2 = (undefined1 *)&lit_THE_FOLLOWING_MAGIC_ITEMS;
  uVar10 = qb3f_6e((word)uVar10,0xcc86,(word)((ulong)uVar10 >> 0x10),unaff_SI,unaff_DI);
  uVar10 = qb3e_79((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),unaff_SI,unaff_DI);
  DAT_2000_b536 = 1;
  uVar10 = qb3f_75((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
  if (((uint)puVar2 & 1) == 0) {
    puVar2 = (undefined1 *)0x0;
  }
  else {
    uVar10 = qb3f_bc((word)uVar10,(uint)puVar2 & 1,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    wVar1 = (word)((ulong)uVar10 >> 0x10);
    uVar10 = qb3f_6a((word)uVar10,wVar1,wVar1,0xb558,unaff_DI);
    uVar10 = qb3f_67((word)uVar10,0xb426,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    puVar2 = (undefined1 *)&lit_RINGS_OF_HEALTH;
    uVar10 = qb3f_6e((word)uVar10,0xcca4,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3e_79((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
  }
  uVar10 = qb3f_75((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
  uVar6 = 0;
  uVar8 = ((uint)puVar2 & 2) == 0;
  if ((bool)uVar8) {
    puVar2 = (undefined1 *)0x0;
  }
  else {
    uVar10 = qb3f_bc((word)uVar10,(uint)puVar2 & 2,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3f_6a((word)uVar10,0xccb8,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    wVar1 = 0xb422;
    uVar10 = qb3f_6b((word)uVar10,0xb422,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3e_79((word)uVar10,wVar1,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3f_bc((word)uVar10,wVar1,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    puVar2 = (undefined1 *)&lit_COINS;
    uVar10 = qb3f_6e((word)uVar10,0xccda,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3e_79((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
  }
  uVar10 = qb3f_a7((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb42a,unaff_DI);
  if (!(bool)uVar6 && !(bool)uVar8) {
    uVar10 = qb3f_bc((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb42a,unaff_DI);
    uVar10 = qb3f_6a((word)uVar10,0xb49c,(word)((ulong)uVar10 >> 0x10),0xb42a,unaff_DI);
    uVar10 = qb3f_6a((word)uVar10,0xccea,(word)((ulong)uVar10 >> 0x10),0xb42a,unaff_DI);
    uVar10 = qb3f_67((word)uVar10,0xb42a,(word)((ulong)uVar10 >> 0x10),0xb42a,unaff_DI);
    puVar2 = (undefined1 *)&lit_MAGIC_SWORD;
    uVar10 = qb3f_6e((word)uVar10,0xccf2,(word)((ulong)uVar10 >> 0x10),0xb42a,unaff_DI);
    uVar10 = qb3e_79((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb42a,unaff_DI);
  }
  uVar10 = qb3f_a7((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb42e,unaff_DI);
  if (!(bool)uVar6 && !(bool)uVar8) {
    uVar10 = qb3f_bc((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb42e,unaff_DI);
    uVar10 = qb3f_6a((word)uVar10,0xb49c,(word)((ulong)uVar10 >> 0x10),0xb42e,unaff_DI);
    uVar10 = qb3f_6a((word)uVar10,0xccea,(word)((ulong)uVar10 >> 0x10),0xb42e,unaff_DI);
    uVar10 = qb3f_67((word)uVar10,0xb42e,(word)((ulong)uVar10 >> 0x10),0xb42e,unaff_DI);
    puVar2 = (undefined1 *)&lit_MAGIC_MACE;
    uVar10 = qb3f_6e((word)uVar10,0xcd02,(word)((ulong)uVar10 >> 0x10),0xb42e,unaff_DI);
    uVar10 = qb3e_79((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb42e,unaff_DI);
  }
  uVar10 = qb3f_75((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
  if (((uint)puVar2 & 0x10) == 0) {
    puVar3 = (undefined *)0x0;
  }
  else {
    uVar10 = qb3f_bc((word)uVar10,(uint)puVar2 & 0x10,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI)
    ;
    uVar10 = qb3f_6a((word)uVar10,0xb49c,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3f_6a((word)uVar10,0xccea,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3f_67((word)uVar10,0xb432,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    puVar3 = (undefined *)&lit_MAGIC_RING;
    uVar10 = qb3f_6e((word)uVar10,0xcd12,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3e_79((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
  }
  uVar10 = qb3f_75((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
  if (((uint)puVar3 & 0x20) == 0) {
    puVar3 = (undefined *)0x0;
  }
  else {
    uVar10 = qb3f_bc((word)uVar10,(uint)puVar3 & 0x20,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI)
    ;
    uVar10 = qb3f_6a((word)uVar10,0xb49c,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3f_6a((word)uVar10,0xcd22,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3f_67((word)uVar10,0xb436,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    puVar3 = (undefined *)&lit_MAGIC_ARMOR;
    uVar10 = qb3f_6e((word)uVar10,0xcd28,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3e_79((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
  }
  uVar10 = qb3f_75((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
  uVar6 = 0;
  uVar8 = ((uint)puVar3 & 0x40) == 0;
  if ((bool)uVar8) {
    puVar3 = (undefined *)0x0;
  }
  else {
    uVar10 = qb3f_bc((word)uVar10,(uint)puVar3 & 0x40,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI)
    ;
    uVar10 = qb3f_6a((word)uVar10,0xb49c,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    puVar3 = (undefined *)&lit_A_FLOOR_SLOSHER;
    uVar10 = qb3f_6e((word)uVar10,0xcd38,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
    uVar10 = qb3e_79((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0xb558,unaff_DI);
  }
  uVar10 = qb3f_a7((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0xb43a,unaff_DI);
  if (!(bool)uVar6 && !(bool)uVar8) {
    uVar10 = qb3f_bc((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0xb43a,unaff_DI);
    uVar10 = qb3f_6a((word)uVar10,0xb49c,(word)((ulong)uVar10 >> 0x10),0xb43a,unaff_DI);
    uVar10 = qb3f_67((word)uVar10,0xb43a,(word)((ulong)uVar10 >> 0x10),0xb43a,unaff_DI);
    puVar3 = (undefined *)&lit_HOLY_HAND_GRENADES;
    uVar10 = qb3f_6e((word)uVar10,0xcd4c,(word)((ulong)uVar10 >> 0x10),0xb43a,unaff_DI);
    uVar10 = qb3e_79((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0xb43a,unaff_DI);
  }
  wVar1 = 0xb7f6;
  uVar10 = qb3f_6f((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0xb7f6,unaff_DI);
  while( true ) {
    uVar10 = qb3f_7d((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),wVar1,0x4e28);
    puVar4 = (undefined *)0x4e28;
    uVar10 = qb3f_9f((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd26);
    if (!(bool)uVar6 && !(bool)uVar8) break;
    uVar10 = qb3f_75((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd26);
    puVar3 = (undefined *)((int)puVar3 * 4);
    uVar6 = (undefined *)0x4d2d < puVar3;
    puVar4 = puVar3 + -0x4d2e;
    uVar8 = puVar4 == (undefined *)0x0;
    uVar10 = qb3f_a7((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),(word)puVar4,0xbd26);
    if (!(bool)uVar6 && !(bool)uVar8) {
      wVar1 = qb3f_bc((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),(word)puVar4,0xbd26);
      uVar10 = qb3f_6a(wVar1,0xbb56,(word)puVar3,(word)puVar4,0xbd26);
      uVar5 = (uint)((ulong)uVar10 >> 0x10);
      uVar6 = 0x4c09 < uVar5;
      wVar1 = uVar5 + 0xb3f6;
      uVar8 = wVar1 == 0;
      uVar10 = qb3f_6a((word)uVar10,wVar1,wVar1,(word)puVar4,0xbd26);
      puVar3 = puVar4;
      uVar10 = qb3f_6b((word)uVar10,(word)puVar4,(word)((ulong)uVar10 >> 0x10),(word)puVar4,0xbd26);
      uVar10 = qb3e_79((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),(word)puVar4,0xbd26);
    }
    wVar1 = 0x4e28;
    uVar10 = qb3f_7f((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7f6);
  }
  uVar10 = FUN_1000_2f3c();
  wVar1 = 0xffff;
  uVar10 = qb3e_32((word)uVar10,0xffff,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd26);
  uVar10 = qb3f_bc((word)uVar10,wVar1,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd26);
  puVar3 = (undefined *)&lit_YOU_ALSO_HAVE;
  uVar10 = qb3f_6e((word)uVar10,0xcd64,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd26);
  qb3e_79((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd26);
  bx = (undefined *)0x1;
  wVar1 = extraout_DX;
  while ((int)bx < 10) {
    uVar5 = (int)(bx + 0x1b) * 4;
    bVar7 = 0xe46d < uVar5;
    puVar4 = (undefined *)(uVar5 + 0x1b92);
    bVar9 = puVar4 == (undefined *)0x0;
    DAT_2000_b5e4 = bx;
    uVar10 = qb3f_a7((word)(bx + 0x1b),(word)bx,wVar1,(word)puVar4,0xbd26);
    wVar1 = (word)((ulong)uVar10 >> 0x10);
    puVar3 = bx;
    if (!bVar7 && !bVar9) {
      uVar10 = qb3f_bc((word)uVar10,(word)bx,wVar1,(word)puVar4,0xbd26);
      uVar10 = qb3f_67((word)uVar10,(word)puVar4,(word)((ulong)uVar10 >> 0x10),(word)bx,0xbd26);
      uVar10 = qb3f_6a((word)uVar10,(10 - (int)bx) * 4 + 0x1b56,(word)((ulong)uVar10 >> 0x10),
                       (word)bx,0xbd26);
      puVar3 = (undefined *)&lit_WAND_CHARGES;
      uVar10 = qb3f_6e((word)uVar10,0xcd78,(word)((ulong)uVar10 >> 0x10),(word)bx,0xbd26);
      qb3e_79((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),(word)bx,0xbd26);
      wVar1 = extraout_DX_00;
      puVar4 = bx;
    }
    bx = DAT_2000_b5e4 + 1;
  }
  DAT_2000_b5e4 = (undefined *)0x1;
  while ((int)DAT_2000_b5e4 < 7) {
    uVar10 = qb3f_bc((word)DAT_2000_b5e4,(word)puVar3,wVar1,(word)puVar4,0xbd26);
    uVar10 = qb3f_67((word)uVar10,((word)uVar10 + 0x15) * 4 + 0x1b92,(word)((ulong)uVar10 >> 0x10),
                     (word)puVar4,0xbd26);
    uVar10 = qb3f_6a((word)uVar10,(word)uVar10 * 4 + 0x1b56,(word)((ulong)uVar10 >> 0x10),
                     (word)puVar4,0xbd26);
    puVar3 = (undefined *)&lit_PILLS;
    uVar10 = qb3f_6e((word)uVar10,0xcd8a,(word)((ulong)uVar10 >> 0x10),(word)puVar4,0xbd26);
    uVar10 = qb3e_79((word)uVar10,(word)puVar3,(word)((ulong)uVar10 >> 0x10),(word)puVar4,0xbd26);
    wVar1 = (word)((ulong)uVar10 >> 0x10);
    DAT_2000_b5e4 = (undefined *)((int)uVar10 + 1);
  }
  FUN_1000_2f3c();
  uVar10 = FUN_1000_2fcb();
  qb3e_32((word)uVar10,0xffff,(word)((ulong)uVar10 >> 0x10),(word)puVar4,0xbd26);
  FUN_1000_593c();
  FUN_1000_8fea();
  return;
}


// ==== FUN_1000_3d83 @ 1000:3d83 (size 43) callers: FUN_1000_0636

void __cdecl16near FUN_1000_3d83(void)

{
  word ax;
  undefined2 extraout_DX;
  word bx;
  undefined *bx_00;
  char *bx_01;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar1;
  
  uVar1 = FUN_1000_2fcb();
  bx = 1;
  uVar1 = qb3e_42((word)uVar1,1,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  uVar1 = qb3e_44((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  ax = qb3f_bc((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  bx_00 = (undefined *)&lit_You_have_found_the_fountain_of_youth;
  uVar1 = qb3f_6e(ax,0xcd94,bx,unaff_SI,unaff_DI);
  uVar1 = qb3e_79((word)uVar1,(word)bx_00,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  uVar1 = qb3f_bc((word)uVar1,(word)bx_00,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  bx_01 = (char *)s_You_have_found_the_fountain_of_y_2000_cd98 + 0x28;
  uVar1 = qb3f_6e((word)uVar1,0xcdc0,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar1,(word)bx_01,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  DAT_2000_b534 = extraout_DX;
  return;
}


// ==== FUN_1000_3dae @ 1000:3dae (size 426) callers: FUN_1000_0cd2

void FUN_1000_3dae(void)

{
  int *piVar1;
  uint *puVar2;
  char cVar3;
  bool bVar4;
  bool bVar5;
  byte bVar6;
  int iVar7;
  word in_AX;
  undefined2 *di;
  undefined2 *in_CX;
  uint dx;
  uint uVar8;
  uint uVar9;
  word in_DX;
  word dx_00;
  word wVar10;
  word wVar11;
  undefined *puVar12;
  word wVar13;
  int unaff_BP;
  word unaff_SI;
  undefined2 *puVar14;
  word di_00;
  word unaff_DI;
  char *pcVar15;
  undefined2 unaff_SS;
  byte bVar16;
  undefined1 in_CF;
  undefined1 uVar17;
  bool bVar18;
  undefined1 in_ZF;
  undefined1 uVar19;
  ulong uVar20;
  undefined4 uVar21;
  
  wVar11 = 0xffff;
  uVar21 = qb3e_32(in_AX,0xffff,in_DX,unaff_SI,unaff_DI);
  uVar21 = qb3f_bc((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),unaff_SI,unaff_DI);
  puVar12 = (undefined *)&lit_YOU_FEEL_STRANGE;
  uVar21 = qb3f_6e((word)uVar21,0xcdec,(word)((ulong)uVar21 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),unaff_SI,unaff_DI);
  uVar21 = FUN_1000_2f35();
  wVar11 = 0xb7f6;
  uVar21 = qb3f_6f((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb7f6,unaff_DI);
  while( true ) {
    uVar21 = qb3f_7d((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),wVar11,0xb5e6);
    uVar21 = qb3f_9f((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb5e6,0xbb64);
    wVar11 = (word)((ulong)uVar21 >> 0x10);
    if (!(bool)in_CF && !(bool)in_ZF) break;
    wVar13 = 0xb7f6;
    uVar21 = qb3f_6f((word)uVar21,(word)puVar12,wVar11,0xb7f6,0xbb64);
    while( true ) {
      uVar21 = qb3f_7d((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),wVar13,0xb5ea);
      uVar21 = qb3f_9f((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb5ea,0xbc1e);
      wVar13 = (word)((ulong)uVar21 >> 0x10);
      if (!(bool)in_CF && !(bool)in_ZF) break;
      qb3f_75((word)uVar21,(word)puVar12,wVar13,0xb5e6,0xbc1e);
      wVar11 = (int)puVar12 * 0x15;
      puVar12 = (undefined *)0xb5ea;
      uVar21 = qb3f_75(wVar11,0xb5ea,0xb5ea,0xb5ea,wVar11);
      in_CF = 0x64f9 < (uint)((int)(puVar12 + wVar11) * 4);
      wVar11 = (int)(puVar12 + wVar11) * 4 + 0x9b06;
      in_ZF = wVar11 == 0;
      uVar21 = qb3f_7b((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb7ee,wVar11);
      wVar13 = (word)((ulong)uVar21 >> 0x10);
      uVar21 = qb3f_7f((word)uVar21,(word)puVar12,wVar13,wVar13,0xb7f6);
    }
    wVar11 = 0xb5e6;
    uVar21 = qb3f_7f((word)uVar21,(word)puVar12,wVar13,0xb5e6,0xb7f6);
  }
  wVar13 = 0xffff;
  qb3e_32((word)uVar21,0xffff,wVar11,0xb5e6,0xbb64);
  uVar21 = FUN_1000_b2cf();
  uVar21 = qb3f_7b((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),0xb7ee,0xb4ea);
  uVar21 = qb3f_7c((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),0xc1c2,0xb4e2);
  uVar21 = qb3f_7b((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),0xbe6e,0xb4ca);
  uVar21 = qb3f_7b((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),0xbe6e,0xb4d2);
  uVar21 = qb3f_73((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),0xb4f6,0xb4d2);
  wVar13 = 0xb4f6;
  uVar21 = qb3f_7e((word)uVar21,0xb4f6,(word)((ulong)uVar21 >> 0x10),0xb4f6,0xb588);
  wVar11 = wVar13;
  uVar21 = qb3f_7b((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),0xbc22,wVar13);
  uVar21 = qb3f_ab((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0x1fa2,wVar13);
  puVar2 = (uint *)(wVar11 + 0xc08a);
  uVar17 = CARRY2(*puVar2,wVar13);
  *puVar2 = *puVar2 + wVar13;
  uVar19 = *puVar2 == 0;
  uVar21 = qb3f_81((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0x1fa2,wVar13);
  wVar11 = 0x1a;
  uVar21 = qb3d_03((word)uVar21,0x1a,(word)((ulong)uVar21 >> 0x10),0x1fa2,wVar13);
  uVar21 = qb3f_7d((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0x1fa2,0xb59e);
  wVar13 = 0xb7f6;
  uVar21 = qb3f_9f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb59e,0xb7f6);
  if ((bool)uVar17) {
    uVar21 = qb3f_8f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb59e,0xbc42);
    wVar11 = 0x1a;
    uVar21 = qb3d_01((word)uVar21,0x1a,(word)((ulong)uVar21 >> 0x10),0xb59e,0xbc42);
    wVar13 = 0xb59e;
    uVar21 = qb3f_7d((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb59e,0xb59e);
  }
  uVar21 = qb3d_34((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb59e,wVar13);
  uVar21 = qb3f_91((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb59e,0xbe6e);
  wVar11 = 0x1a;
  uVar21 = qb3d_03((word)uVar21,0x1a,(word)((ulong)uVar21 >> 0x10),0xb59e,0xbe6e);
  uVar21 = qb3f_81((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb59e,0xb59e);
  uVar21 = qb3f_81((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb59e,0xbb6c);
  uVar21 = qb3f_7d((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb59e,0xb4ee);
  uVar21 = qb3f_7b((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4ee,0xb4f2);
  uVar21 = qb3f_7f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb488,0xb7d8);
  uVar21 = qb3f_7d((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb488,0xb488);
  wVar11 = DAT_2000_b5ee;
  uVar21 = qb3f_57((word)uVar21,DAT_2000_b5ee,(word)((ulong)uVar21 >> 0x10),0xb488,0xb488);
  uVar21 = qb3f_81((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb488,0xce04);
  qb3f_77((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb488,0xce04);
  DAT_2000_b5ee = wVar11;
  uVar21 = qb3f_7b(wVar11,wVar11,dx_00,0xb7ee,0xb4de);
  wVar13 = 0xb7f6;
  uVar21 = qb3f_6f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb7f6,0xb4de);
  while( true ) {
    uVar21 = qb3f_7d((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,0x4e28);
    wVar13 = qb3f_9f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0x4e28,0xb7fa);
    if (!(bool)uVar17 && !(bool)uVar19) break;
    wVar11 = 0x4e28;
    uVar21 = qb3f_75(wVar13,0x4e28,0x4e28,0x4e28,0xb7fa);
    uVar17 = 0xe06d < wVar11 * 4;
    wVar13 = wVar11 * 4 + 0x1f92;
    uVar19 = wVar13 == 0;
    uVar21 = qb3f_7f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,0xbb6c);
    uVar21 = qb3f_7d((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,wVar13);
    wVar13 = (word)((ulong)uVar21 >> 0x10);
    uVar21 = qb3f_7f((word)uVar21,wVar11,wVar13,wVar13,0xb7f6);
  }
  FUN_1000_2115();
  uVar21 = FUN_1000_1c93();
  pcVar15 = (char *)0xb48c;
  qb3f_7b((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xce08,0xb48c);
  FUN_1000_b308();
  FUN_1000_1cf5();
  uVar21 = FUN_1000_4c28();
LAB_1000_0642:
  qb3f_a7((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb48c,(word)pcVar15);
  if ((bool)uVar19) {
    FUN_1000_12c6();
    return;
  }
  uVar21 = FUN_1000_54cb();
  puVar14 = (undefined2 *)&DAT_2000_bb60;
  wVar13 = 0xb4c6;
  uVar20 = qb3f_9f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4c6,0xbb60);
  if (!(bool)uVar17 && !(bool)uVar19) {
    puVar14 = (undefined2 *)0xb4c6;
    wVar11 = qb3f_9f((word)uVar20,0xb4c6,(word)(uVar20 >> 0x10),0xb4ce,0xb4ca);
    wVar13 = 0;
    if ((bool)uVar19) {
      wVar13 = 0xffff;
    }
    bVar18 = false;
    uVar21 = qb3f_9f(wVar11,(word)puVar14,wVar13,0xb4d6,0xb4d2);
    uVar9 = (uint)((ulong)uVar21 >> 0x10);
    uVar8 = 0;
    if (bVar18) {
      uVar8 = 0xffff;
    }
    bVar18 = false;
    in_CX = (undefined2 *)(uVar8 & uVar9);
    wVar13 = 0xb48c;
    wVar11 = qb3f_9f((word)uVar21,(word)puVar14,uVar9,0xb48c,0xbb64);
    uVar8 = 0;
    if (bVar18) {
      uVar8 = 0xffff;
    }
    uVar17 = 0;
    bVar18 = (uVar8 & (uint)in_CX) == 0;
    if (bVar18) {
      uVar20 = (ulong)wVar11;
      uVar19 = 1;
      puVar14 = (undefined2 *)0xbb64;
    }
    else {
      wVar11 = qb3f_9f(wVar11,(word)puVar14,uVar8 & (uint)in_CX,0xb4da,0xb48c);
      wVar10 = 0;
      if (bVar18) {
        wVar10 = 0xffff;
      }
      uVar19 = 0;
      wVar13 = 0xb48c;
      di = (undefined2 *)0xb4da;
      uVar21 = qb3f_7f(wVar11,(word)puVar14,wVar10,0xb48c,0xb7d0);
      in_CX = di;
      qb3f_a1((word)uVar21,(word)puVar14,(word)((ulong)uVar21 >> 0x10),0xb48c,(word)di);
      uVar8 = 0;
      if ((bool)uVar19) {
        uVar8 = 0xffff;
      }
      uVar17 = 0;
      uVar19 = (uVar8 | dx) == 0;
      if ((bool)uVar19) {
        uVar20 = (ulong)dx << 0x10;
        puVar14 = di;
      }
      else {
        wVar13 = 0xb7f6;
        qb3f_7b(uVar8 | dx,(word)puVar14,dx,0xb7f6,(word)puVar14);
        uVar20 = FUN_1000_567c();
      }
    }
  }
  wVar10 = 0xb7f6;
  uVar21 = qb3d_33((word)uVar20,0xb7f6,(word)(uVar20 >> 0x10),wVar13,(word)puVar14);
  wVar11 = qb3f_91((word)uVar21,wVar10,(word)((ulong)uVar21 >> 0x10),wVar13,0xbb68);
  puVar14 = (undefined2 *)0x1a;
  uVar21 = qb3d_03(wVar11,0x1a,wVar10,wVar13,0xbb68);
  wVar11 = (word)((ulong)uVar21 >> 0x10);
  uVar21 = qb3f_81((word)uVar21,(word)puVar14,wVar11,wVar13,wVar11);
  uVar21 = qb3f_7d((word)uVar21,(word)puVar14,(word)((ulong)uVar21 >> 0x10),wVar13,0x52fc);
  uVar21 = qb3f_9f((word)uVar21,(word)puVar14,(word)((ulong)uVar21 >> 0x10),0x52fc,0xbb6c);
  if ((bool)uVar17) {
    wVar13 = 2;
    wVar11 = qb3e_42((word)uVar21,2,(word)((ulong)uVar21 >> 0x10),0x52fc,0xbb6c);
    in_CX = (undefined2 *)0x1;
    uVar21 = qb3e_44(wVar11,1,wVar13,0x52fc,0xbb6c);
    uVar21 = qb3f_bc((word)uVar21,(word)in_CX,(word)((ulong)uVar21 >> 0x10),0x52fc,0xbb6c);
    wVar11 = 0x28;
    uVar21 = qb3d_0d((word)uVar21,0x28,(word)((ulong)uVar21 >> 0x10),0x52fc,0xbb6c);
    uVar21 = qb3f_6e((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0x52fc,0xbb6c);
    uVar21 = qb3e_79((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0x52fc,0xbb6c);
    wVar11 = (word)((ulong)uVar21 >> 0x10);
    uVar21 = qb3e_42((word)uVar21,wVar11,wVar11,0x52fc,0xbb6c);
    puVar14 = in_CX;
    uVar21 = qb3e_44((word)uVar21,(word)in_CX,(word)((ulong)uVar21 >> 0x10),0x52fc,0xbb6c);
  }
  uVar21 = qb3f_9f((word)uVar21,(word)puVar14,(word)((ulong)uVar21 >> 0x10),0x52fc,0xb7f6);
  wVar11 = 0;
  if ((bool)uVar19) {
    wVar11 = 0xffff;
  }
  uVar21 = qb3f_73((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4de,0xb7f6);
  uVar21 = qb3f_82((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4de,0xb4e2);
  uVar21 = qb3f_72((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4ea,0xbb70);
  wVar13 = qb3f_23((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4ea,0xbb70);
  uVar21 = qb3f_25(wVar13,wVar11,0xb4ea,0xb4ea,0xbb70);
  uVar21 = qb3f_27((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xbb74,0xbb70);
  uVar21 = qb3f_91((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xbb74,0xbb78);
  wVar13 = (word)((ulong)uVar21 >> 0x10);
  uVar21 = qb3f_71((word)uVar21,wVar11,wVar13,wVar13,0xbb7c);
  uVar21 = qb3f_23((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,0xbb7c);
  uVar21 = qb3f_91((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,48000);
  uVar21 = qb3f_85((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,48000);
  uVar21 = qb3f_81((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,0xbb84);
  uVar21 = qb3f_74((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,0xbb84);
  uVar21 = qb3f_a6((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,0xbb84);
  puVar2 = (uint *)(unaff_BP + wVar13 + 0x23);
  uVar8 = *puVar2;
  *puVar2 = *puVar2 + (int)in_CX;
  uVar9 = *puVar2;
  piVar1 = (int *)(unaff_BP + -0x447c);
  bVar6 = (byte)in_CX & 0x1f;
  iVar7 = *piVar1;
  *piVar1 = *piVar1 << bVar6;
  bVar4 = ((uint)in_CX & 0x1f) == 0;
  bVar18 = ((uint)in_CX & 0x1f) != 0;
  bVar16 = (byte)in_CX & 0x1f;
  cVar3 = DAT_2000_bb87 << bVar16;
  bVar5 = ((uint)in_CX & 0x1f) == 0;
  bVar16 = bVar5 * (bVar4 * CARRY2(uVar8,(uint)in_CX) | !bVar4 * (iVar7 << bVar6 - 1 < 0)) |
           !bVar5 * ((char)(DAT_2000_bb87 << bVar16 - 1) < '\0');
  bVar4 = ((uint)in_CX & 0x1f) != 0;
  uVar19 = !bVar4 && (!bVar18 && uVar9 == 0 || bVar18 && *piVar1 == 0) || bVar4 && cVar3 == '\0';
  DAT_2000_bb87 = cVar3;
  uVar21 = qb3f_8f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4ee,0xbba6);
  uVar21 = qb3f_a1((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4ee,0xb4f2);
  puVar12 = (undefined *)0x0;
  if (!(bool)bVar16 && !(bool)uVar19) {
    puVar12 = (undefined *)0xffff;
    uVar19 = 0;
  }
  wVar11 = qb3f_9f((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0x52fc,0xb7d8);
  uVar8 = 0;
  if ((bool)uVar19) {
    uVar8 = 0xffff;
  }
  if ((uVar8 & (uint)puVar12) == 0) {
    uVar20 = (ulong)wVar11;
  }
  else {
    uVar21 = qb3f_bc(wVar11,(word)puVar12,uVar8 & (uint)puVar12,0x52fc,0xb7d8);
    puVar12 = (undefined *)&lit_You_could_use_a_cure;
    uVar21 = qb3f_6e((word)uVar21,0xbbaa,(word)((ulong)uVar21 >> 0x10),0x52fc,0xb7d8);
    uVar20 = qb3e_79((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0x52fc,0xb7d8);
  }
  uVar21 = qb3f_ab((word)uVar20,(word)puVar12,(word)(uVar20 >> 0x10),0xb4ea,0xb7d8);
  puVar2 = (uint *)(puVar12 + (int)(undefined2 *)&DAT_2000_b7d7 + 1);
  uVar19 = 0x4827 < *puVar2;
  *puVar2 = *puVar2 + 0xb7d8;
  uVar17 = *puVar2 == 0;
  uVar21 = qb3f_81((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb4ea,0xb7d8);
  uVar21 = qb3f_a1((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb4ea,0xb48c);
  pcVar15 = (char *)0x0;
  if ((bool)uVar19) {
    pcVar15 = (char *)0xffff;
    uVar17 = 0;
  }
  wVar11 = qb3f_9f((word)uVar21,(word)pcVar15,(word)((ulong)uVar21 >> 0x10),0x52fc,0xbb60);
  uVar8 = 0;
  if ((bool)uVar17) {
    uVar8 = 0xffff;
  }
  uVar19 = 0;
  uVar17 = (uVar8 & (uint)pcVar15) == 0;
  if ((bool)uVar17) {
    uVar20 = (ulong)wVar11;
  }
  else {
    uVar21 = qb3f_bc(wVar11,(word)pcVar15,uVar8 & (uint)pcVar15,0x52fc,0xbb60);
    pcVar15 = (char *)s_You_could_use_a_cure_W__2000_bbae + 0x16;
    uVar21 = qb3f_6e((word)uVar21,0xbbc4,(word)((ulong)uVar21 >> 0x10),0x52fc,0xbb60);
    uVar20 = qb3e_79((word)uVar21,(word)pcVar15,(word)((ulong)uVar21 >> 0x10),0x52fc,0xbb60);
  }
  uVar21 = qb3f_a7((word)uVar20,(word)pcVar15,(word)(uVar20 >> 0x10),0xb4f6,0xbb60);
  puVar12 = (undefined *)0x0;
  if (!(bool)uVar19 && !(bool)uVar17) {
    puVar12 = (undefined *)0xffff;
    uVar17 = 0;
  }
  wVar11 = qb3f_9f((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0x52fc,0xb802);
  uVar8 = 0;
  if ((bool)uVar17) {
    uVar8 = 0xffff;
  }
  uVar19 = (uVar8 & (uint)puVar12) == 0;
  if ((bool)uVar19) {
    uVar20 = (ulong)wVar11;
  }
  else {
    uVar21 = qb3f_bc(wVar11,(word)puVar12,uVar8 & (uint)puVar12,0x52fc,0xb802);
    puVar12 = (undefined *)&lit_Go_to_bank_to_cash_in_treasure;
    uVar21 = qb3f_6e((word)uVar21,0xbbf0,(word)((ulong)uVar21 >> 0x10),0x52fc,0xb802);
    uVar20 = qb3e_79((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0x52fc,0xb802);
  }
  uVar21 = qb3f_9f((word)uVar20,(word)puVar12,(word)(uVar20 >> 0x10),0xb48c,0xbb64);
  uVar8 = 0;
  if ((bool)uVar19) {
    uVar8 = 0xffff;
  }
  bVar18 = false;
  wVar11 = qb3f_9f((word)uVar21,uVar8,(word)((ulong)uVar21 >> 0x10),0x1bba,0xb4ca);
  uVar9 = 0;
  if (bVar18) {
    uVar9 = 0xffff;
  }
  bVar18 = (uVar9 & uVar8) == 0;
  pcVar15 = (char *)0xb4d2;
  wVar13 = 0x1bbe;
  uVar21 = qb3f_9f(wVar11,uVar8,uVar9 & uVar8,0x1bbe,0xb4d2);
  uVar8 = 0;
  if (bVar18) {
    uVar8 = 0xffff;
  }
  wVar11 = uVar8 & (uint)((ulong)uVar21 >> 0x10);
  uVar19 = wVar11 == 0;
  if (!(bool)uVar19) {
    uVar21 = FUN_1000_3d83();
  }
  do {
    wVar10 = qb3d_06((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,(word)pcVar15);
    uVar21 = qb3f_61(wVar10,wVar11,0xb49c,wVar13,(word)pcVar15);
    uVar21 = qb3f_7b((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xbc12,0xb4fa);
    pcVar15 = (char *)s_Go_to_bank_to_cash_in_treasure_2000_bbf4 + 0x1e;
    wVar13 = 0xb48c;
    uVar21 = qb3f_9f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb48c,0xbc12);
    wVar10 = (word)((ulong)uVar21 >> 0x10);
    if (!(bool)uVar19) {
      uVar21 = qb3f_7f((word)uVar21,wVar11,wVar10,0xb4fe,0xb7f6);
      wVar11 = 0xb7f6;
      uVar21 = qb3f_71((word)uVar21,0xb7f6,(word)((ulong)uVar21 >> 0x10),0xb4fe,0xb502);
      wVar13 = qb3f_a1((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4fe,0xb502);
      wVar10 = 0;
      if ((bool)uVar19) {
        wVar10 = 0xffff;
      }
      bVar18 = false;
      di_00 = 0xb506;
      uVar21 = qb3f_9f(wVar13,wVar11,wVar10,0xb7b0,0xb506);
      uVar9 = (uint)((ulong)uVar21 >> 0x10);
      uVar8 = 0;
      if (bVar18) {
        uVar8 = 0xffff;
      }
      in_CX = (undefined2 *)(uVar8 | uVar9);
      uVar19 = 0;
      uVar17 = in_CX == (undefined2 *)0x0;
      if (!(bool)uVar17) {
        wVar13 = wVar11;
        uVar21 = qb3f_6f((word)uVar21,wVar11,uVar9,wVar11,0xb506);
        while( true ) {
          uVar21 = qb3f_7d((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),wVar11,0x4e28);
          di_00 = 0xbc16;
          uVar21 = qb3f_9f((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),0x4e28,0xbc16);
          wVar11 = wVar13;
          if (!(bool)uVar19 && !(bool)uVar17) break;
          wVar11 = 0x4e28;
          uVar21 = qb3f_7f((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),0x4e28,0xb7f6);
        }
      }
      uVar21 = FUN_1000_7eec();
      qb3f_75((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4d2,di_00);
      wVar10 = (word)((long)(int)wVar11 * 0x16);
      wVar13 = 0xb4ca;
      uVar21 = qb3f_75(wVar10,wVar11,(word)((ulong)((long)(int)wVar11 * 0x16) >> 0x10),0xb4ca,wVar10
                      );
      wVar10 = (word)((ulong)uVar21 >> 0x10);
      wVar11 = wVar11 + (int)uVar21;
      pcVar15 = (char *)(wVar11 * 2);
      uVar17 = 0;
      uVar19 = *(int *)(pcVar15 + 0x4e90) == 0;
      if (0 < *(int *)(pcVar15 + 0x4e90)) break;
    }
    wVar11 = 0xbc1a;
    uVar21 = qb3f_62(0xb49c,0xbc1a,wVar10,wVar13,(word)pcVar15);
    if (!(bool)uVar19) {
      qb3f_75((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4d2,(word)pcVar15);
      wVar13 = (word)((long)(int)wVar11 * 0x16);
      iVar7 = qb3f_75(wVar13,wVar11,(word)((ulong)((long)(int)wVar11 * 0x16) >> 0x10),0xb4ca,wVar13)
      ;
      wVar11 = wVar11 + iVar7;
      wVar13 = wVar11 * 2;
      uVar19 = 0;
      uVar17 = *(int *)(wVar13 + 0x4e90) == 0;
      if (0 < *(int *)(wVar13 + 0x4e90)) {
        FUN_1000_3ffc();
      }
      uVar21 = FUN_1000_5417();
      uVar21 = qb3f_a7((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb50a,wVar13);
      if ((bool)uVar17) {
        qb3f_75((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb48c,wVar13);
        wVar13 = (word)((long)(int)wVar11 * 0x15);
        uVar21 = qb3f_75(wVar13,wVar11,(word)((ulong)((long)(int)wVar11 * 0x15) >> 0x10),0xb4d2,
                         wVar13);
        uVar8 = (wVar13 + wVar11) * 4;
        uVar19 = 0x64f9 < uVar8;
        wVar13 = uVar8 + 0x9b06;
        uVar17 = wVar13 == 0;
        uVar21 = qb3f_97((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),0xbc1e,0xb4ca);
        uVar21 = qb3f_27((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),0xb7d8,0xb4ca);
        wVar11 = wVar13;
        uVar21 = qb3f_83((word)uVar21,wVar13,(word)((ulong)uVar21 >> 0x10),wVar13,0xb4ca);
        uVar21 = qb3f_7d((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar13,wVar11);
      }
      else {
        uVar17 = 0;
      }
      uVar21 = qb3f_7b((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xbc22,0xb50e);
      uVar21 = qb3f_9f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb48c,0xbc22);
      wVar11 = 0;
      if ((bool)uVar17) {
        wVar11 = 0xffff;
      }
      wVar13 = qb3f_9f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4c6,0xb7f6);
      uVar8 = 0;
      if ((bool)uVar19) {
        uVar8 = 0xffff;
      }
      if ((uVar8 & wVar11) != 0) {
        qb3f_7b(wVar13,wVar11,uVar8 & wVar11,0xbc26,0xb4c6);
      }
      uVar21 = FUN_1000_3b02();
      qb3f_7b((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xbc2a,0xb512);
      FUN_1000_09e8();
      FUN_1000_0cd2();
      return;
    }
  } while( true );
  uVar21 = FUN_1000_3ffc();
  goto LAB_1000_0642;
}


// ==== FUN_1000_3f5a @ 1000:3f5a (size 79) callers: FUN_1000_3ffc,FUN_1000_4c28

void __cdecl16near FUN_1000_3f5a(void)

{
  word wVar1;
  word in_BX;
  word unaff_DI;
  word bx;
  undefined1 in_ZF;
  undefined4 uVar2;
  
  uVar2 = FUN_1000_5417();
  uVar2 = qb3f_a7((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb50a,unaff_DI);
  if ((bool)in_ZF) {
    qb3f_75((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb48c,unaff_DI);
    wVar1 = (word)((long)(int)in_BX * 0x15);
    uVar2 = qb3f_75(wVar1,in_BX,(word)((ulong)((long)(int)in_BX * 0x15) >> 0x10),0xb4d2,wVar1);
    bx = (wVar1 + in_BX) * 4 + 0x9b06;
    uVar2 = qb3f_97((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0xbc1e,0xb4ca);
    uVar2 = qb3f_27((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0xb7d8,0xb4ca);
    wVar1 = bx;
    uVar2 = qb3f_83((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),bx,0xb4ca);
    qb3f_7d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),bx,wVar1);
    DAT_2000_b5f0 = 1;
  }
  return;
}


// ==== FUN_1000_3fa9 @ 1000:3fa9 (size 58) callers: FUN_1000_4275

void __cdecl16near FUN_1000_3fa9(void)

{
  word wVar1;
  word unaff_SI;
  word unaff_DI;
  
  wVar1 = qb3e_89(0,0,0x20,unaff_SI,unaff_DI);
  wVar1 = qb3e_58(wVar1,0x60c4,3,unaff_SI,unaff_DI);
  wVar1 = qb3e_89(wVar1,0xa1,0x20,unaff_SI,unaff_DI);
  wVar1 = qb3e_58(wVar1,0x7c82,3,unaff_SI,unaff_DI);
  wVar1 = qb3e_89(wVar1,0x10a,0x39,unaff_SI,unaff_DI);
  qb3e_58(wVar1,0x8148,3,unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_3fe3 @ 1000:3fe3 (size 25) callers: FUN_1000_4275

void __cdecl16near FUN_1000_3fe3(void)

{
  word ax;
  word unaff_SI;
  word unaff_DI;
  
  ax = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,unaff_SI,unaff_DI);
  qb3e_58(ax,0x52e0,3,unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_3ffc @ 1000:3ffc (size 633) callers: FUN_1000_0636,FUN_1000_09e8,FUN_1000_0cd2,FUN_1000_19f7,FUN_1000_30c7,FUN_1000_3192,FUN_1000_3254,FUN_1000_3316

void __cdecl16near FUN_1000_3ffc(void)

{
  word in_AX;
  word wVar1;
  uint uVar2;
  word in_DX;
  word dx;
  word dx_00;
  word ax;
  word dx_01;
  word dx_02;
  word dx_03;
  word dx_04;
  word dx_05;
  uint extraout_DX;
  uint extraout_DX_00;
  word in_BX;
  uint uVar3;
  undefined *bx;
  undefined *puVar4;
  uint uVar5;
  int iVar6;
  int unaff_BP;
  word wVar7;
  word wVar8;
  undefined2 *di;
  undefined2 unaff_SS;
  undefined1 in_CF;
  undefined1 uVar9;
  undefined1 in_ZF;
  bool bVar10;
  undefined1 uVar11;
  undefined4 uVar12;
  long lVar13;
  ulong uVar14;
  
  wVar7 = 0xb7f6;
  uVar12 = qb3f_9f(in_AX,in_BX,in_DX,0xb50e,0xb7f6);
  wVar1 = (word)((ulong)uVar12 >> 0x10);
  if ((bool)in_ZF) {
    wVar7 = 0xb512;
    uVar12 = qb3f_7b((word)uVar12,in_BX,wVar1,0xb7f6,0xb512);
  }
  else {
    uVar12 = qb3f_a7((word)uVar12,in_BX,wVar1,0xb48c,0xb7f6);
    if ((bool)in_CF) {
      wVar7 = 0xb48c;
      uVar12 = qb3f_7b((word)uVar12,in_BX,(word)((ulong)uVar12 >> 0x10),0xb7ee,0xb48c);
    }
  }
  wVar1 = qb3f_a7((word)uVar12,in_BX,(word)((ulong)uVar12 >> 0x10),0xb426,wVar7);
  uVar3 = 0;
  if (!(bool)in_CF && !(bool)in_ZF) {
    uVar3 = 0xffff;
  }
  uVar12 = qb3f_9f(wVar1,uVar3,0xb426,0xb4f2,0xb4ee);
  uVar2 = 0;
  if ((bool)in_CF) {
    uVar2 = 0xffff;
  }
  uVar2 = uVar2 & uVar3;
  bVar10 = uVar2 == 0;
  bx = (undefined *)0xb4f2;
  qb3f_a7((word)uVar12,0xb4f2,(word)((ulong)uVar12 >> 0x10),0xb4c2,0xb4ee);
  uVar3 = 0;
  if (bVar10) {
    uVar3 = 0xffff;
  }
  uVar9 = 0;
  uVar11 = (uVar3 & uVar2) == 0;
  puVar4 = bx;
  if ((bool)uVar11) {
    lVar13 = (ulong)dx << 0x10;
    bx = (undefined *)0xb4ee;
  }
  else {
    uVar12 = qb3f_7f(uVar3 & uVar2,(word)bx,dx,dx,(word)bx);
    qb3f_7d((word)uVar12,(word)puVar4,(word)((ulong)uVar12 >> 0x10),dx,(word)bx);
    lVar13 = FUN_1000_3b02();
  }
  uVar12 = qb3f_a7((word)lVar13,(word)puVar4,(word)((ulong)lVar13 >> 0x10),0x1ba2,(word)bx);
  if (!(bool)uVar9 && !(bool)uVar11) {
    uVar12 = qb3f_7f((word)uVar12,(word)puVar4,(word)((ulong)uVar12 >> 0x10),0x1ba2,0xb7f6);
    wVar7 = 0xb7f6;
    uVar12 = qb3f_7d((word)uVar12,0xb7f6,(word)((ulong)uVar12 >> 0x10),0xb7f6,0x1ba2);
    wVar1 = qb3f_87((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),0x1ba2,0xce0c);
    wVar8 = 0x1a;
    uVar12 = qb3f_71(wVar1,0x1a,wVar7,0x1ba2,0xce0c);
    uVar12 = qb3d_03((word)uVar12,wVar8,(word)((ulong)uVar12 >> 0x10),0x1ba2,0xce0c);
    qb3f_a5((word)uVar12,wVar8,(word)((ulong)uVar12 >> 0x10),0x1ba2,0xce0c);
    DAT_2000_1ba5 = DAT_2000_1ba5 ^ 0xe9;
    wVar7 = 0x1a;
    uVar12 = qb3d_03(CONCAT11((char)(uVar2 >> 8) + (char)uVar2,(char)uVar2),0x1a,dx_00,0x1ba2,0xce0c
                    );
    wVar1 = (word)((ulong)uVar12 >> 0x10);
    uVar12 = qb3f_81((word)uVar12,wVar7,wVar1,0x1ba2,wVar1);
    uVar12 = qb3f_7d((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),0x1ba2,0xb5f6);
    uVar12 = qb3f_75((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),0xb5f6,0xb5f6);
    uVar9 = 0xe06d < wVar7 * 4;
    wVar8 = wVar7 * 4 + 0x1f92;
    uVar11 = wVar8 == 0;
    uVar12 = qb3f_7f((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),wVar8,0xb7d0);
    uVar12 = qb3f_7d((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),wVar8,wVar8);
    wVar1 = 1;
    uVar12 = qb3e_42((word)uVar12,1,(word)((ulong)uVar12 >> 0x10),wVar8,wVar8);
    uVar12 = qb3e_44((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),wVar8,wVar8);
    uVar12 = qb3f_bc((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),wVar8,wVar8);
    puVar4 = (undefined *)&lit_You_feel_sick_You_need_a_cure_disease;
    uVar12 = qb3f_6e((word)uVar12,0xce10,(word)((ulong)uVar12 >> 0x10),wVar8,wVar8);
    qb3e_79((word)uVar12,(word)puVar4,(word)((ulong)uVar12 >> 0x10),wVar8,wVar8);
    FUN_1000_2f35();
    DAT_2000_4e08 = 0x27;
    uVar12 = FUN_1000_2f43();
  }
  qb3f_7b((word)uVar12,(word)puVar4,(word)((ulong)uVar12 >> 0x10),0xbc3e,0xb4c2);
  uVar12 = FUN_1000_5417();
  uVar12 = qb3f_a7((word)uVar12,(word)puVar4,(word)((ulong)uVar12 >> 0x10),0xb50a,0xb4c2);
  wVar1 = 0;
  if ((bool)uVar11) {
    wVar1 = 0xffff;
  }
  bVar10 = false;
  wVar7 = qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb5fa,0xbb60);
  uVar3 = 0;
  if (!(bool)uVar9 && !bVar10) {
    uVar3 = 0xffff;
  }
  uVar12 = CONCAT22(uVar3 | wVar1,wVar7);
  uVar9 = 0;
  uVar11 = (uVar3 | wVar1) == 0;
  if ((bool)uVar11) {
    uVar12 = qb3f_87(wVar7,wVar1,0,0xb542,0xb7fa);
    uVar12 = qb3d_03((word)uVar12,0x1a,(word)((ulong)uVar12 >> 0x10),0xb542,0xb7fa);
    wVar7 = 0xb542;
    uVar12 = qb3f_91((word)uVar12,0xb542,(word)((ulong)uVar12 >> 0x10),0xb542,0xb5fa);
    wVar1 = wVar7;
    uVar12 = qb3f_9b((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),wVar7,0xb5fa);
    uVar12 = qb3f_7d((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),wVar7,0xb5fe);
    wVar7 = 0xb7f6;
    uVar12 = qb3f_6f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb7f6,0xb5fe);
    while( true ) {
      uVar12 = qb3f_7d((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),wVar7,0x4e28);
      uVar12 = qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0x4e28,0xb5fe);
      if (!(bool)uVar9 && !(bool)uVar11) break;
      wVar7 = 0x4e28;
      uVar12 = qb3f_7f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0x4e28,0xb7f6);
    }
  }
  uVar12 = qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb48c,0xbb64);
  uVar3 = 0;
  if ((bool)uVar11) {
    uVar3 = 0xffff;
  }
  bVar10 = false;
  wVar1 = qb3f_9f((word)uVar12,uVar3,(word)((ulong)uVar12 >> 0x10),0x1bba,0xb4ca);
  uVar2 = 0;
  if (bVar10) {
    uVar2 = 0xffff;
  }
  bVar10 = (uVar2 & uVar3) == 0;
  uVar12 = qb3f_9f(wVar1,uVar3,uVar2 & uVar3,0x1bbe,0xb4d2);
  uVar3 = (uint)((ulong)uVar12 >> 0x10);
  uVar2 = 0;
  if (bVar10) {
    uVar2 = 0xffff;
  }
  wVar1 = uVar2 & uVar3;
  if (wVar1 == 0) {
    qb3f_75((word)uVar12,0,uVar3,0xb4d2,0xb4d2);
    wVar7 = (word)((long)(int)wVar1 * 0x16);
    uVar12 = qb3f_75(wVar7,wVar1,(word)((ulong)((long)(int)wVar1 * 0x16) >> 0x10),0xb4ca,wVar7);
    uVar3 = 0;
    if (*(int *)((wVar1 + (word)uVar12) * 2 + 0x4e90) == 0) {
      uVar3 = 0xffff;
    }
    bVar10 = false;
    wVar7 = qb3f_9f((word)uVar12,uVar3,(word)((ulong)uVar12 >> 0x10),0xb50e,0xb7f6);
    uVar2 = 0;
    if (!bVar10) {
      uVar2 = 0xffff;
    }
    uVar5 = 0;
    if (DAT_2000_b538 == 0) {
      uVar5 = 0xffff;
    }
    wVar1 = uVar5 & uVar2 & uVar3;
    bVar10 = wVar1 == 0;
    wVar7 = qb3f_9f(wVar7,wVar1,uVar2 & uVar3,0xb50a,0xb7f6);
    uVar3 = 0;
    if (bVar10) {
      uVar3 = 0xffff;
    }
    uVar9 = (uVar3 & wVar1) == 0;
    if ((bool)uVar9) {
      uVar14 = (ulong)wVar7;
    }
    else {
      wVar7 = qb3d_06(wVar7,wVar1,uVar3 & wVar1,0xb50a,0xb7f6);
      qb3f_61(wVar7,wVar1,0xb49c,0xb50a,0xb7f6);
      uVar12 = qb3f_62(ax,0xb4ac,ax,0xb50a,0xb7f6);
      uVar3 = 0;
      if ((bool)uVar9) {
        uVar3 = 0xffff;
      }
      bVar10 = false;
      uVar12 = qb3f_62((word)uVar12,0xb4a4,(word)((ulong)uVar12 >> 0x10),0xb50a,0xb7f6);
      uVar2 = 0;
      if (bVar10) {
        uVar2 = 0xffff;
      }
      uVar2 = uVar2 | uVar3;
      bVar10 = uVar2 == 0;
      uVar12 = qb3f_62((word)uVar12,0xb4a0,(word)((ulong)uVar12 >> 0x10),0xb50a,0xb7f6);
      uVar3 = 0;
      if (bVar10) {
        uVar3 = 0xffff;
      }
      uVar3 = uVar3 | uVar2;
      bVar10 = uVar3 == 0;
      uVar14 = qb3f_62((word)uVar12,0xb4a8,(word)((ulong)uVar12 >> 0x10),0xb50a,0xb7f6);
      uVar2 = 0;
      if (bVar10) {
        uVar2 = 0xffff;
      }
      wVar1 = uVar2 | uVar3;
      if (wVar1 != 0) {
        uVar12 = qb3f_7f((word)uVar14,wVar1,(word)(uVar14 >> 0x10),0xb5fa,0xb7f6);
        qb3f_7d((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb5fa,0xb5fa);
        return;
      }
      wVar1 = 0;
    }
  }
  else {
    wVar7 = qb3d_06((word)uVar12,wVar1,uVar3,0x1bbe,0xb4d2);
    uVar14 = qb3f_61(wVar7,wVar1,0xb49c,0x1bbe,0xb4d2);
  }
  qb3f_7b((word)uVar14,wVar1,(word)(uVar14 >> 0x10),0xb7ee,0xb5fa);
  DAT_2000_b5f0 = 0;
  FUN_1000_3f5a();
  uVar12 = FUN_1000_54cb();
  uVar12 = qb3f_ab((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4ca,0xb5fa);
  wVar8 = *(int *)((char *)s_You_feel_sick__You_need_a_cure_d_2000_ce14 + 0x28 + wVar1) + 0xb5fa;
  wVar7 = 0xb4ca;
  wVar1 = qb3f_81((word)uVar12,0xb4ca,(word)((ulong)uVar12 >> 0x10),0xb4ca,wVar8);
  qb3f_77(wVar1,wVar7,wVar7,0xb4ca,wVar8);
  DAT_2000_b604 = wVar7 + 8;
  DAT_2000_b602 = wVar7;
  uVar12 = qb3f_ab(DAT_2000_b604,wVar7,dx_01,0xb4d2,wVar8);
  wVar8 = wVar8 + *(int *)((undefined1 *)&LAB_2000_ce40 + wVar7);
  wVar7 = 0xb4d2;
  uVar12 = qb3f_81((word)uVar12,0xb4d2,(word)((ulong)uVar12 >> 0x10),0xb4d2,wVar8);
  wVar1 = wVar7;
  qb3f_77((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),0xb4d2,wVar8);
  DAT_2000_b608 = wVar1 + 8;
  uVar9 = DAT_2000_b608 == 0;
  DAT_2000_b606 = wVar1;
  uVar12 = qb3f_7b(DAT_2000_b608,wVar1,dx_02,0xce44,0xb4c2);
  wVar8 = 0xce44;
  qb3f_75((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),wVar7,0xb4c2);
  DAT_2000_b60a = wVar1;
  qb3f_75(wVar1,wVar1,dx_03,dx_03,0xb4c2);
  DAT_2000_b60c = wVar1;
  qb3f_75(wVar1,wVar1,dx_04,0xb48c,0xb4c2);
  DAT_2000_b5de = wVar1;
  uVar12 = qb3f_9f(wVar1,wVar1,dx_05,0xb4fa,wVar8);
  uVar3 = 0;
  if ((bool)uVar9) {
    uVar3 = 0xffff;
  }
  bVar10 = false;
  qb3f_9f((word)uVar12,uVar3,(word)((ulong)uVar12 >> 0x10),0xb50e,0xb7f6);
  uVar2 = 0;
  if (bVar10) {
    uVar2 = 0xffff;
  }
  uVar5 = 0;
  if (DAT_2000_b538 == 1) {
    uVar5 = 0xffff;
  }
  wVar1 = uVar5 | uVar2 | uVar3;
  uVar9 = wVar1 == 0;
  if ((bool)uVar9) {
    uVar12 = FUN_1000_3fe3();
  }
  else {
    uVar12 = FUN_1000_3fa9();
  }
  DAT_2000_b538 = 0;
  uVar12 = qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb50e,0xb7f6);
  wVar1 = 0;
  if (!(bool)uVar9) {
    wVar1 = 0xffff;
    uVar9 = 0;
  }
  wVar7 = qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb60e,0xb7f6);
  uVar3 = 0;
  if ((bool)uVar9) {
    uVar3 = 0xffff;
  }
  bVar10 = (uVar3 & wVar1) == 0;
  if (bVar10) {
    uVar12 = qb3f_9f(wVar7,wVar1,0,0xb59a,0xb4ca);
    uVar3 = 0;
    if (bVar10) {
      uVar3 = 0xffff;
    }
    bVar10 = false;
    wVar1 = qb3f_9f((word)uVar12,uVar3,(word)((ulong)uVar12 >> 0x10),0xb616,0xb4d2);
    uVar2 = 0;
    if (bVar10) {
      uVar2 = 0xffff;
    }
    uVar9 = (uVar2 & uVar3) == 0;
    wVar7 = DAT_2000_b5de;
    uVar12 = qb3f_57(wVar1,DAT_2000_b5de,uVar2 & uVar3,0xb616,0xb4d2);
    uVar12 = qb3f_a1((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),0xb616,0xb61a);
    uVar3 = (uint)((ulong)uVar12 >> 0x10);
    uVar2 = 0;
    if ((bool)uVar9) {
      uVar2 = 0xffff;
    }
    wVar1 = uVar2 & uVar3;
    bVar10 = wVar1 == 0;
    uVar3 = qb3f_9f((word)uVar12,wVar1,uVar3,0xb61e,0xb47c);
    uVar2 = 0;
    if (bVar10) {
      uVar2 = 0xffff;
    }
    uVar12 = CONCAT22(uVar2 & wVar1,uVar3);
    uVar14 = (ulong)uVar3;
    if ((uVar2 & wVar1) != 0) goto LAB_1000_4819;
  }
  else {
    uVar12 = qb3f_7b(wVar7,wVar1,uVar3 & wVar1,0xb7ee,0xb60e);
    qb3f_7b((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb7d0,0xb612);
    uVar14 = FUN_1000_593c();
  }
  uVar12 = qb3f_7b((word)uVar14,wVar1,(word)(uVar14 >> 0x10),0xb4ca,0xb59a);
  uVar12 = qb3f_7b((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4d2,0xb616);
  uVar12 = qb3f_7b((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb47c,0xb61e);
  wVar1 = DAT_2000_b5de;
  uVar12 = qb3f_57((word)uVar12,DAT_2000_b5de,(word)((ulong)uVar12 >> 0x10),0xb47c,0xb61e);
  di = (undefined2 *)0xb61a;
  qb3f_7d((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb47c,0xb61a);
  uVar3 = 0;
  if (DAT_2000_b5f0 == 0) {
    uVar3 = 0xffff;
  }
  uVar2 = 0;
  if (DAT_2000_b622 == 0) {
    uVar2 = 0xffff;
  }
  if ((uVar2 & uVar3) == 0) {
    DAT_2000_b622 = 0;
    DAT_2000_b624 = DAT_2000_b60c;
    DAT_2000_b626 = DAT_2000_b60a;
    DAT_2000_b628 = 1;
    uVar3 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar1 = DAT_2000_b602;
      uVar12 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb47c,0xb61a);
      wVar1 = qb3e_85((word)uVar12,wVar1 + 8,(word)((ulong)uVar12 >> 0x10),0xb47c,0xb61a);
      uVar3 = qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb47c,0xb61a);
    }
    wVar1 = 0;
    if (5 < DAT_2000_b62a) {
      wVar1 = 0xffff;
    }
    uVar2 = 0;
    if (DAT_2000_b62a < 8) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & wVar1) == 0) {
      uVar14 = (ulong)uVar3;
      uVar9 = 1;
    }
    else {
      wVar1 = DAT_2000_b602 + 3;
      *(word *)(unaff_BP + -6) = DAT_2000_b602;
      uVar12 = qb3e_84(0,wVar1,DAT_2000_b606,0xb47c,0xb61a);
      wVar7 = qb3e_85((word)uVar12,*(int *)(unaff_BP + -6) + 5,(word)((ulong)uVar12 >> 0x10),0xb47c,
                      0xb61a);
      wVar1 = 0;
      uVar9 = 1;
      uVar14 = qb3e_86(wVar7,0,0xffff,0xb47c,0xb61a);
    }
    qb3f_9f((word)uVar14,wVar1,(word)(uVar14 >> 0x10),0xb4d2,0xb7f6);
    if ((bool)uVar9) {
      wVar1 = DAT_2000_b602;
      uVar12 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb4d2,0xb7f6);
      wVar1 = qb3e_85((word)uVar12,wVar1 + 8,(word)((ulong)uVar12 >> 0x10),0xb4d2,0xb7f6);
      qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4d2,0xb7f6);
    }
    DAT_2000_b624 = DAT_2000_b60c;
    DAT_2000_b626 = DAT_2000_b60a;
    DAT_2000_b628 = 2;
    uVar3 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar1 = DAT_2000_b602;
      uVar12 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb4d2,0xb7f6);
      wVar1 = qb3e_85((word)uVar12,wVar1,(int)((ulong)uVar12 >> 0x10) + 8,0xb4d2,0xb7f6);
      uVar3 = qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4d2,0xb7f6);
    }
    wVar1 = 0;
    if (5 < DAT_2000_b62a) {
      wVar1 = 0xffff;
    }
    uVar2 = 0;
    if (DAT_2000_b62a < 8) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & wVar1) == 0) {
      uVar14 = (ulong)uVar3;
      uVar9 = 1;
    }
    else {
      wVar7 = DAT_2000_b606 + 2;
      *(word *)(unaff_BP + -6) = DAT_2000_b606;
      wVar1 = DAT_2000_b602;
      wVar7 = qb3e_84(0,DAT_2000_b602,wVar7,0xb4d2,0xb7f6);
      wVar7 = qb3e_85(wVar7,wVar1,*(int *)(unaff_BP + -6) + 6,0xb4d2,0xb7f6);
      wVar1 = 0;
      uVar9 = 1;
      uVar14 = qb3e_86(wVar7,0,0xffff,0xb4d2,0xb7f6);
    }
    qb3f_9f((word)uVar14,wVar1,(word)(uVar14 >> 0x10),0xb4ca,0xb7f6);
    if ((bool)uVar9) {
      wVar1 = DAT_2000_b602;
      uVar12 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb4ca,0xb7f6);
      wVar1 = qb3e_85((word)uVar12,wVar1,(int)((ulong)uVar12 >> 0x10) + 8,0xb4ca,0xb7f6);
      qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4ca,0xb7f6);
    }
    DAT_2000_b624 = DAT_2000_b60c + 1;
    DAT_2000_b626 = DAT_2000_b60a;
    DAT_2000_b628 = 2;
    uVar3 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar1 = DAT_2000_b604;
      uVar12 = qb3e_84(0,DAT_2000_b604,DAT_2000_b606,0xb4ca,0xb7f6);
      wVar1 = qb3e_85((word)uVar12,wVar1,(int)((ulong)uVar12 >> 0x10) + 8,0xb4ca,0xb7f6);
      uVar3 = qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4ca,0xb7f6);
    }
    wVar1 = 0;
    if (5 < DAT_2000_b62a) {
      wVar1 = 0xffff;
    }
    uVar2 = 0;
    if (DAT_2000_b62a < 8) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & wVar1) == 0) {
      uVar14 = (ulong)uVar3;
      uVar9 = 1;
    }
    else {
      wVar7 = DAT_2000_b606 + 2;
      *(word *)(unaff_BP + -6) = DAT_2000_b606;
      wVar1 = DAT_2000_b604;
      wVar7 = qb3e_84(0,DAT_2000_b604,wVar7,0xb4ca,0xb7f6);
      wVar7 = qb3e_85(wVar7,wVar1,*(int *)(unaff_BP + -6) + 6,0xb4ca,0xb7f6);
      wVar1 = 0;
      uVar9 = 1;
      uVar14 = qb3e_86(wVar7,0,0xffff,0xb4ca,0xb7f6);
    }
    qb3f_9f((word)uVar14,wVar1,(word)(uVar14 >> 0x10),0xb4ca,0xbc1e);
    if ((bool)uVar9) {
      wVar1 = DAT_2000_b604;
      uVar12 = qb3e_84(0,DAT_2000_b604,DAT_2000_b606,0xb4ca,0xbc1e);
      wVar1 = qb3e_85((word)uVar12,wVar1,(int)((ulong)uVar12 >> 0x10) + 8,0xb4ca,0xbc1e);
      qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4ca,0xbc1e);
    }
    DAT_2000_b626 = DAT_2000_b60a + 1;
    DAT_2000_b624 = DAT_2000_b60c;
    DAT_2000_b628 = 1;
    uVar3 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar1 = DAT_2000_b602;
      uVar12 = qb3e_84(0,DAT_2000_b602,DAT_2000_b608,0xb4ca,0xbc1e);
      wVar1 = qb3e_85((word)uVar12,wVar1 + 8,(word)((ulong)uVar12 >> 0x10),0xb4ca,0xbc1e);
      uVar3 = qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4ca,0xbc1e);
    }
    wVar1 = 0;
    if (5 < DAT_2000_b62a) {
      wVar1 = 0xffff;
    }
    uVar2 = 0;
    if (DAT_2000_b62a < 8) {
      uVar2 = 0xffff;
    }
    uVar9 = 0;
    if ((uVar2 & wVar1) == 0) {
      uVar14 = (ulong)uVar3;
      uVar11 = 1;
    }
    else {
      wVar1 = DAT_2000_b602 + 3;
      *(word *)(unaff_BP + -6) = DAT_2000_b602;
      uVar12 = qb3e_84(0,wVar1,DAT_2000_b608,0xb4ca,0xbc1e);
      wVar7 = qb3e_85((word)uVar12,*(int *)(unaff_BP + -6) + 5,(word)((ulong)uVar12 >> 0x10),0xb4ca,
                      0xbc1e);
      uVar9 = 0;
      wVar1 = 0;
      uVar11 = 1;
      uVar14 = qb3e_86(wVar7,0,0xffff,0xb4ca,0xbc1e);
    }
    uVar12 = qb3f_9f((word)uVar14,wVar1,(word)(uVar14 >> 0x10),0xb4d2,0xcb6a);
    if ((bool)uVar11) {
      wVar1 = DAT_2000_b602;
      uVar12 = qb3e_84(0,DAT_2000_b602,DAT_2000_b608,0xb4d2,0xcb6a);
      uVar9 = 0xfff7 < wVar1;
      uVar11 = wVar1 + 8 == 0;
      wVar7 = qb3e_85((word)uVar12,wVar1 + 8,(word)((ulong)uVar12 >> 0x10),0xb4d2,0xcb6a);
      wVar1 = DAT_2000_19bc;
      uVar12 = qb3e_86(wVar7,DAT_2000_19bc,0xffff,0xb4d2,0xcb6a);
    }
    else {
      uVar11 = 0;
    }
    di = (undefined2 *)&DAT_2000_bb60;
    uVar12 = qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4c6,0xbb60);
    if ((bool)uVar9 || (bool)uVar11) {
      qb3f_a7((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4c6,0xbb60);
      wVar1 = DAT_2000_b602;
      if ((bool)uVar9) {
        wVar8 = DAT_2000_b606 + 2;
        wVar7 = DAT_2000_b602 + 2;
        *(word *)(unaff_BP + -6) = DAT_2000_b606;
        *(word *)(unaff_BP + -8) = wVar1;
        wVar1 = qb3e_84(0,wVar7,wVar8,0xb4c6,0xbb60);
        wVar1 = qb3e_85(wVar1,*(int *)(unaff_BP + -8) + 6,*(int *)(unaff_BP + -6) + 6,0xb4c6,0xbb60)
        ;
        uVar12 = qb3e_86(wVar1,DAT_2000_19c8,wVar1,0xb4c6,0xbb60);
      }
      else {
        wVar8 = DAT_2000_b606 + 2;
        wVar7 = DAT_2000_b602 + 2;
        *(word *)(unaff_BP + -6) = DAT_2000_b606;
        *(word *)(unaff_BP + -8) = wVar1;
        wVar1 = qb3e_84(0,wVar7,wVar8,0xb4c6,0xbb60);
        wVar1 = qb3e_85(wVar1,*(int *)(unaff_BP + -8) + 6,*(int *)(unaff_BP + -6) + 6,0xb4c6,0xbb60)
        ;
        uVar12 = qb3e_86(wVar1,DAT_2000_19c8,1,0xb4c6,0xbb60);
      }
    }
    if (DAT_2000_b5de == 0) {
      wVar1 = DAT_2000_b602 - 1;
      uVar12 = qb3f_57((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4c6,0xbb60);
      uVar12 = qb3f_7d((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4c6,0xb62c);
      wVar1 = DAT_2000_b606;
      uVar12 = qb3f_57((word)uVar12,DAT_2000_b606,(word)((ulong)uVar12 >> 0x10),0xb4c6,0xb62c);
      uVar12 = qb3f_7d((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4c6,0xb630);
      uVar12 = qb3f_7b((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4ca,0xb634);
      di = (undefined2 *)0xb638;
      qb3f_7b((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4d2,0xb638);
      FUN_1000_c102();
    }
  }
  wVar1 = FUN_1000_593c();
  wVar7 = 0;
  if (DAT_2000_b63c == 1) {
    wVar7 = 0xffff;
  }
  qb3f_75(wVar1,wVar7,wVar7,0xb4d2,(word)di);
  wVar1 = (word)((long)(int)wVar7 * 0x16);
  uVar3 = extraout_DX;
  uVar12 = qb3f_75(wVar1,wVar7,(word)((ulong)((long)(int)wVar7 * 0x16) >> 0x10),0xb4ca,wVar1);
  wVar7 = (wVar7 + (int)uVar12) * 2;
  uVar2 = 0;
  if (*(int *)(wVar7 + 0x4e90) == 0) {
    uVar2 = 0xffff;
  }
  wVar1 = uVar2 & uVar3;
  uVar9 = wVar1 == 0;
  if (!(bool)uVar9) {
    DAT_2000_b63c = 0;
    uVar12 = FUN_1000_58f7();
  }
  uVar12 = qb3f_a7((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4fa,wVar7);
  if ((bool)uVar9) {
    uVar12 = FUN_1000_4abd();
  }
  uVar9 = DAT_2000_b5f0 == 1;
  if ((bool)uVar9) {
    uVar12 = FUN_1000_49f8();
  }
  uVar12 = qb3f_a7((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4fa,wVar7);
  if ((bool)uVar9) {
    FUN_1000_4a17();
    uVar12 = FUN_1000_8fea();
  }
LAB_1000_4819:
  uVar9 = DAT_2000_b54e == 0;
  uVar11 = DAT_2000_b54e == 1;
  if ((bool)uVar11) {
    uVar12 = FUN_1000_58f7();
    DAT_2000_b54e = 0;
  }
  qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4c6,0xb802);
  if ((bool)uVar9) {
    DAT_2000_b63e = 1;
    FUN_1000_56cc();
  }
  else {
    uVar11 = DAT_2000_b63e == 1;
    if ((bool)uVar11) {
      DAT_2000_b63e = 0;
      FUN_1000_58f7();
      FUN_1000_49b8();
    }
  }
  uVar12 = FUN_1000_4a52();
  uVar12 = qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb47c,0xb7f6);
  if ((bool)uVar11) {
    uVar9 = 1;
    wVar7 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xb7f6);
    wVar1 = 0x5286;
    uVar12 = qb3e_58(wVar7,0x5286,3,0xb47c,0xb7f6);
  }
  else {
    uVar9 = 0;
  }
  uVar12 = qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb47c,0xb7d8);
  if ((bool)uVar9) {
    uVar9 = 1;
    wVar7 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xb7d8);
    wVar1 = 0x5298;
    uVar12 = qb3e_58(wVar7,0x5298,3,0xb47c,0xb7d8);
  }
  else {
    uVar9 = 0;
  }
  uVar12 = qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb47c,0xbb60);
  if ((bool)uVar9) {
    uVar9 = 1;
    wVar7 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xbb60);
    wVar1 = 0x52aa;
    uVar12 = qb3e_58(wVar7,0x52aa,3,0xb47c,0xbb60);
  }
  else {
    uVar9 = 0;
  }
  uVar12 = qb3f_9f((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb47c,0xb802);
  if ((bool)uVar9) {
    wVar7 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xb802);
    wVar1 = 0x52bc;
    uVar12 = qb3e_58(wVar7,0x52bc,3,0xb47c,0xb802);
  }
  qb3f_75((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4d2,0xb802);
  wVar7 = (word)((long)(int)wVar1 * 0x16);
  uVar12 = qb3f_75(wVar7,wVar1,(word)((ulong)((long)(int)wVar1 * 0x16) >> 0x10),0xb4ca,wVar7);
  iVar6 = wVar1 + (word)uVar12;
  uVar9 = iVar6 < 0;
  wVar7 = iVar6 * 2;
  uVar11 = wVar7 == 0;
  wVar1 = *(word *)(wVar7 + 0x4e90);
  uVar12 = qb3f_57((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4ca,wVar7);
  wVar7 = 0x4e28;
  uVar12 = qb3f_7d((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb4ca,0x4e28);
  uVar12 = qb3f_a7((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0x4e28,0x4e28);
  if (!(bool)uVar11) {
    wVar7 = 0x4e28;
    uVar12 = qb3f_8f((word)uVar12,0x4e28,(word)((ulong)uVar12 >> 0x10),0xb48c,0xbe82);
    uVar12 = qb3f_71((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),0xb48c,0xce48);
    uVar12 = qb3f_81((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),0xb48c,0xce48);
    wVar1 = qb3f_a1((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),0xb48c,wVar7);
    wVar8 = 0;
    if (!(bool)uVar9 && !(bool)uVar11) {
      wVar8 = 0xffff;
    }
    uVar12 = qb3f_7f(wVar1,wVar7,wVar8,0xb7b0,0xb7f6);
    wVar1 = wVar7;
    uVar12 = qb3f_a1((word)uVar12,wVar7,(word)((ulong)uVar12 >> 0x10),0xb7b0,wVar7);
    iVar6 = 0;
    if ((bool)uVar9) {
      iVar6 = -1;
    }
    bVar10 = (int)((ulong)uVar12 >> 0x10) == 0;
    uVar11 = iVar6 == 0 && bVar10;
    if (iVar6 != 0 || !bVar10) {
      uVar12 = FUN_1000_7932();
    }
  }
  wVar1 = qb3f_a7((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),0xb50e,wVar7);
  wVar8 = 0;
  if ((bool)uVar11) {
    wVar8 = 0xffff;
  }
  qb3f_75(wVar1,wVar8,wVar8,0xb4d2,wVar7);
  wVar1 = (word)((long)(int)wVar8 * 0x16);
  uVar3 = extraout_DX_00;
  uVar12 = qb3f_75(wVar1,wVar8,(word)((ulong)((long)(int)wVar8 * 0x16) >> 0x10),0xb4ca,wVar1);
  uVar2 = 0;
  if (0 < *(int *)((wVar8 + (word)uVar12) * 2 + 0x4e90)) {
    uVar2 = 0xffff;
  }
  if ((uVar2 & uVar3) != 0) {
    qb3f_7b((word)uVar12,uVar2 & uVar3,(word)((ulong)uVar12 >> 0x10),0xbc22,0xb4fa);
    FUN_1000_803a();
    return;
  }
  FUN_1000_49d1();
  return;
}


// ==== FUN_1000_4275 @ 1000:4275 (size 1859) callers: FUN_1000_803a,FUN_1000_8f6a

void __cdecl16near FUN_1000_4275(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word dx;
  word dx_00;
  word dx_01;
  word dx_02;
  word dx_03;
  uint uVar2;
  uint extraout_DX;
  uint extraout_DX_00;
  word in_BX;
  word wVar3;
  uint uVar4;
  uint uVar5;
  int iVar6;
  int unaff_BP;
  word unaff_DI;
  word wVar7;
  undefined2 *di;
  undefined2 unaff_SS;
  undefined1 uVar8;
  bool bVar9;
  undefined1 uVar10;
  undefined4 uVar11;
  ulong uVar12;
  
  uVar11 = qb3f_ab(in_AX,in_BX,in_DX,0xb4ca,unaff_DI);
  wVar7 = unaff_DI + *(int *)((char *)s_You_feel_sick__You_need_a_cure_d_2000_ce14 + 0x28 + in_BX);
  wVar3 = 0xb4ca;
  wVar1 = qb3f_81((word)uVar11,0xb4ca,(word)((ulong)uVar11 >> 0x10),0xb4ca,wVar7);
  qb3f_77(wVar1,wVar3,wVar3,0xb4ca,wVar7);
  DAT_2000_b604 = wVar3 + 8;
  DAT_2000_b602 = wVar3;
  uVar11 = qb3f_ab(DAT_2000_b604,wVar3,dx,0xb4d2,wVar7);
  wVar7 = wVar7 + *(int *)((undefined1 *)&LAB_2000_ce40 + wVar3);
  wVar3 = 0xb4d2;
  uVar11 = qb3f_81((word)uVar11,0xb4d2,(word)((ulong)uVar11 >> 0x10),0xb4d2,wVar7);
  wVar1 = wVar3;
  qb3f_77((word)uVar11,wVar3,(word)((ulong)uVar11 >> 0x10),0xb4d2,wVar7);
  DAT_2000_b608 = wVar1 + 8;
  uVar8 = DAT_2000_b608 == 0;
  DAT_2000_b606 = wVar1;
  uVar11 = qb3f_7b(DAT_2000_b608,wVar1,dx_00,0xce44,0xb4c2);
  wVar7 = 0xce44;
  qb3f_75((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),wVar3,0xb4c2);
  DAT_2000_b60a = wVar1;
  qb3f_75(wVar1,wVar1,dx_01,dx_01,0xb4c2);
  DAT_2000_b60c = wVar1;
  qb3f_75(wVar1,wVar1,dx_02,0xb48c,0xb4c2);
  DAT_2000_b5de = wVar1;
  uVar11 = qb3f_9f(wVar1,wVar1,dx_03,0xb4fa,wVar7);
  uVar4 = 0;
  if ((bool)uVar8) {
    uVar4 = 0xffff;
  }
  bVar9 = false;
  qb3f_9f((word)uVar11,uVar4,(word)((ulong)uVar11 >> 0x10),0xb50e,0xb7f6);
  uVar2 = 0;
  if (bVar9) {
    uVar2 = 0xffff;
  }
  uVar5 = 0;
  if (DAT_2000_b538 == 1) {
    uVar5 = 0xffff;
  }
  wVar1 = uVar5 | uVar2 | uVar4;
  uVar8 = wVar1 == 0;
  if ((bool)uVar8) {
    uVar11 = FUN_1000_3fe3();
  }
  else {
    uVar11 = FUN_1000_3fa9();
  }
  DAT_2000_b538 = 0;
  uVar11 = qb3f_9f((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb50e,0xb7f6);
  wVar1 = 0;
  if (!(bool)uVar8) {
    wVar1 = 0xffff;
    uVar8 = 0;
  }
  wVar3 = qb3f_9f((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb60e,0xb7f6);
  uVar4 = 0;
  if ((bool)uVar8) {
    uVar4 = 0xffff;
  }
  bVar9 = (uVar4 & wVar1) == 0;
  if (bVar9) {
    uVar11 = qb3f_9f(wVar3,wVar1,0,0xb59a,0xb4ca);
    uVar4 = 0;
    if (bVar9) {
      uVar4 = 0xffff;
    }
    bVar9 = false;
    wVar1 = qb3f_9f((word)uVar11,uVar4,(word)((ulong)uVar11 >> 0x10),0xb616,0xb4d2);
    uVar2 = 0;
    if (bVar9) {
      uVar2 = 0xffff;
    }
    uVar8 = (uVar2 & uVar4) == 0;
    wVar3 = DAT_2000_b5de;
    uVar11 = qb3f_57(wVar1,DAT_2000_b5de,uVar2 & uVar4,0xb616,0xb4d2);
    uVar11 = qb3f_a1((word)uVar11,wVar3,(word)((ulong)uVar11 >> 0x10),0xb616,0xb61a);
    uVar4 = (uint)((ulong)uVar11 >> 0x10);
    uVar2 = 0;
    if ((bool)uVar8) {
      uVar2 = 0xffff;
    }
    wVar1 = uVar2 & uVar4;
    bVar9 = wVar1 == 0;
    uVar4 = qb3f_9f((word)uVar11,wVar1,uVar4,0xb61e,0xb47c);
    uVar2 = 0;
    if (bVar9) {
      uVar2 = 0xffff;
    }
    uVar11 = CONCAT22(uVar2 & wVar1,uVar4);
    uVar12 = (ulong)uVar4;
    if ((uVar2 & wVar1) != 0) goto LAB_1000_4819;
  }
  else {
    uVar11 = qb3f_7b(wVar3,wVar1,uVar4 & wVar1,0xb7ee,0xb60e);
    qb3f_7b((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb7d0,0xb612);
    uVar12 = FUN_1000_593c();
  }
  uVar11 = qb3f_7b((word)uVar12,wVar1,(word)(uVar12 >> 0x10),0xb4ca,0xb59a);
  uVar11 = qb3f_7b((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4d2,0xb616);
  uVar11 = qb3f_7b((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb47c,0xb61e);
  wVar1 = DAT_2000_b5de;
  uVar11 = qb3f_57((word)uVar11,DAT_2000_b5de,(word)((ulong)uVar11 >> 0x10),0xb47c,0xb61e);
  di = (undefined2 *)0xb61a;
  qb3f_7d((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb47c,0xb61a);
  uVar4 = 0;
  if (DAT_2000_b5f0 == 0) {
    uVar4 = 0xffff;
  }
  uVar2 = 0;
  if (DAT_2000_b622 == 0) {
    uVar2 = 0xffff;
  }
  if ((uVar2 & uVar4) == 0) {
    DAT_2000_b622 = 0;
    DAT_2000_b624 = DAT_2000_b60c;
    DAT_2000_b626 = DAT_2000_b60a;
    DAT_2000_b628 = 1;
    uVar4 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar1 = DAT_2000_b602;
      uVar11 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb47c,0xb61a);
      wVar1 = qb3e_85((word)uVar11,wVar1 + 8,(word)((ulong)uVar11 >> 0x10),0xb47c,0xb61a);
      uVar4 = qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb47c,0xb61a);
    }
    wVar1 = 0;
    if (5 < DAT_2000_b62a) {
      wVar1 = 0xffff;
    }
    uVar2 = 0;
    if (DAT_2000_b62a < 8) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & wVar1) == 0) {
      uVar12 = (ulong)uVar4;
      uVar8 = 1;
    }
    else {
      wVar1 = DAT_2000_b602 + 3;
      *(word *)(unaff_BP + -6) = DAT_2000_b602;
      uVar11 = qb3e_84(0,wVar1,DAT_2000_b606,0xb47c,0xb61a);
      wVar3 = qb3e_85((word)uVar11,*(int *)(unaff_BP + -6) + 5,(word)((ulong)uVar11 >> 0x10),0xb47c,
                      0xb61a);
      wVar1 = 0;
      uVar8 = 1;
      uVar12 = qb3e_86(wVar3,0,0xffff,0xb47c,0xb61a);
    }
    qb3f_9f((word)uVar12,wVar1,(word)(uVar12 >> 0x10),0xb4d2,0xb7f6);
    if ((bool)uVar8) {
      wVar1 = DAT_2000_b602;
      uVar11 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb4d2,0xb7f6);
      wVar1 = qb3e_85((word)uVar11,wVar1 + 8,(word)((ulong)uVar11 >> 0x10),0xb4d2,0xb7f6);
      qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4d2,0xb7f6);
    }
    DAT_2000_b624 = DAT_2000_b60c;
    DAT_2000_b626 = DAT_2000_b60a;
    DAT_2000_b628 = 2;
    uVar4 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar1 = DAT_2000_b602;
      uVar11 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb4d2,0xb7f6);
      wVar1 = qb3e_85((word)uVar11,wVar1,(int)((ulong)uVar11 >> 0x10) + 8,0xb4d2,0xb7f6);
      uVar4 = qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4d2,0xb7f6);
    }
    wVar1 = 0;
    if (5 < DAT_2000_b62a) {
      wVar1 = 0xffff;
    }
    uVar2 = 0;
    if (DAT_2000_b62a < 8) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & wVar1) == 0) {
      uVar12 = (ulong)uVar4;
      uVar8 = 1;
    }
    else {
      wVar3 = DAT_2000_b606 + 2;
      *(word *)(unaff_BP + -6) = DAT_2000_b606;
      wVar1 = DAT_2000_b602;
      wVar3 = qb3e_84(0,DAT_2000_b602,wVar3,0xb4d2,0xb7f6);
      wVar3 = qb3e_85(wVar3,wVar1,*(int *)(unaff_BP + -6) + 6,0xb4d2,0xb7f6);
      wVar1 = 0;
      uVar8 = 1;
      uVar12 = qb3e_86(wVar3,0,0xffff,0xb4d2,0xb7f6);
    }
    qb3f_9f((word)uVar12,wVar1,(word)(uVar12 >> 0x10),0xb4ca,0xb7f6);
    if ((bool)uVar8) {
      wVar1 = DAT_2000_b602;
      uVar11 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb4ca,0xb7f6);
      wVar1 = qb3e_85((word)uVar11,wVar1,(int)((ulong)uVar11 >> 0x10) + 8,0xb4ca,0xb7f6);
      qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4ca,0xb7f6);
    }
    DAT_2000_b624 = DAT_2000_b60c + 1;
    DAT_2000_b626 = DAT_2000_b60a;
    DAT_2000_b628 = 2;
    uVar4 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar1 = DAT_2000_b604;
      uVar11 = qb3e_84(0,DAT_2000_b604,DAT_2000_b606,0xb4ca,0xb7f6);
      wVar1 = qb3e_85((word)uVar11,wVar1,(int)((ulong)uVar11 >> 0x10) + 8,0xb4ca,0xb7f6);
      uVar4 = qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4ca,0xb7f6);
    }
    wVar1 = 0;
    if (5 < DAT_2000_b62a) {
      wVar1 = 0xffff;
    }
    uVar2 = 0;
    if (DAT_2000_b62a < 8) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & wVar1) == 0) {
      uVar12 = (ulong)uVar4;
      uVar8 = 1;
    }
    else {
      wVar3 = DAT_2000_b606 + 2;
      *(word *)(unaff_BP + -6) = DAT_2000_b606;
      wVar1 = DAT_2000_b604;
      wVar3 = qb3e_84(0,DAT_2000_b604,wVar3,0xb4ca,0xb7f6);
      wVar3 = qb3e_85(wVar3,wVar1,*(int *)(unaff_BP + -6) + 6,0xb4ca,0xb7f6);
      wVar1 = 0;
      uVar8 = 1;
      uVar12 = qb3e_86(wVar3,0,0xffff,0xb4ca,0xb7f6);
    }
    qb3f_9f((word)uVar12,wVar1,(word)(uVar12 >> 0x10),0xb4ca,0xbc1e);
    if ((bool)uVar8) {
      wVar1 = DAT_2000_b604;
      uVar11 = qb3e_84(0,DAT_2000_b604,DAT_2000_b606,0xb4ca,0xbc1e);
      wVar1 = qb3e_85((word)uVar11,wVar1,(int)((ulong)uVar11 >> 0x10) + 8,0xb4ca,0xbc1e);
      qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4ca,0xbc1e);
    }
    DAT_2000_b626 = DAT_2000_b60a + 1;
    DAT_2000_b624 = DAT_2000_b60c;
    DAT_2000_b628 = 1;
    uVar4 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar1 = DAT_2000_b602;
      uVar11 = qb3e_84(0,DAT_2000_b602,DAT_2000_b608,0xb4ca,0xbc1e);
      wVar1 = qb3e_85((word)uVar11,wVar1 + 8,(word)((ulong)uVar11 >> 0x10),0xb4ca,0xbc1e);
      uVar4 = qb3e_86(wVar1,DAT_2000_19bc,0xffff,0xb4ca,0xbc1e);
    }
    wVar1 = 0;
    if (5 < DAT_2000_b62a) {
      wVar1 = 0xffff;
    }
    uVar2 = 0;
    if (DAT_2000_b62a < 8) {
      uVar2 = 0xffff;
    }
    uVar8 = 0;
    if ((uVar2 & wVar1) == 0) {
      uVar12 = (ulong)uVar4;
      uVar10 = 1;
    }
    else {
      wVar1 = DAT_2000_b602 + 3;
      *(word *)(unaff_BP + -6) = DAT_2000_b602;
      uVar11 = qb3e_84(0,wVar1,DAT_2000_b608,0xb4ca,0xbc1e);
      wVar3 = qb3e_85((word)uVar11,*(int *)(unaff_BP + -6) + 5,(word)((ulong)uVar11 >> 0x10),0xb4ca,
                      0xbc1e);
      uVar8 = 0;
      wVar1 = 0;
      uVar10 = 1;
      uVar12 = qb3e_86(wVar3,0,0xffff,0xb4ca,0xbc1e);
    }
    uVar11 = qb3f_9f((word)uVar12,wVar1,(word)(uVar12 >> 0x10),0xb4d2,0xcb6a);
    if ((bool)uVar10) {
      wVar1 = DAT_2000_b602;
      uVar11 = qb3e_84(0,DAT_2000_b602,DAT_2000_b608,0xb4d2,0xcb6a);
      uVar8 = 0xfff7 < wVar1;
      uVar10 = wVar1 + 8 == 0;
      wVar3 = qb3e_85((word)uVar11,wVar1 + 8,(word)((ulong)uVar11 >> 0x10),0xb4d2,0xcb6a);
      wVar1 = DAT_2000_19bc;
      uVar11 = qb3e_86(wVar3,DAT_2000_19bc,0xffff,0xb4d2,0xcb6a);
    }
    else {
      uVar10 = 0;
    }
    di = (undefined2 *)&DAT_2000_bb60;
    uVar11 = qb3f_9f((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4c6,0xbb60);
    if ((bool)uVar8 || (bool)uVar10) {
      qb3f_a7((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4c6,0xbb60);
      wVar1 = DAT_2000_b602;
      if ((bool)uVar8) {
        wVar7 = DAT_2000_b606 + 2;
        wVar3 = DAT_2000_b602 + 2;
        *(word *)(unaff_BP + -6) = DAT_2000_b606;
        *(word *)(unaff_BP + -8) = wVar1;
        wVar1 = qb3e_84(0,wVar3,wVar7,0xb4c6,0xbb60);
        wVar1 = qb3e_85(wVar1,*(int *)(unaff_BP + -8) + 6,*(int *)(unaff_BP + -6) + 6,0xb4c6,0xbb60)
        ;
        uVar11 = qb3e_86(wVar1,DAT_2000_19c8,wVar1,0xb4c6,0xbb60);
      }
      else {
        wVar7 = DAT_2000_b606 + 2;
        wVar3 = DAT_2000_b602 + 2;
        *(word *)(unaff_BP + -6) = DAT_2000_b606;
        *(word *)(unaff_BP + -8) = wVar1;
        wVar1 = qb3e_84(0,wVar3,wVar7,0xb4c6,0xbb60);
        wVar1 = qb3e_85(wVar1,*(int *)(unaff_BP + -8) + 6,*(int *)(unaff_BP + -6) + 6,0xb4c6,0xbb60)
        ;
        uVar11 = qb3e_86(wVar1,DAT_2000_19c8,1,0xb4c6,0xbb60);
      }
    }
    if (DAT_2000_b5de == 0) {
      wVar1 = DAT_2000_b602 - 1;
      uVar11 = qb3f_57((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4c6,0xbb60);
      uVar11 = qb3f_7d((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4c6,0xb62c);
      wVar1 = DAT_2000_b606;
      uVar11 = qb3f_57((word)uVar11,DAT_2000_b606,(word)((ulong)uVar11 >> 0x10),0xb4c6,0xb62c);
      uVar11 = qb3f_7d((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4c6,0xb630);
      uVar11 = qb3f_7b((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4ca,0xb634);
      di = (undefined2 *)0xb638;
      qb3f_7b((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4d2,0xb638);
      FUN_1000_c102();
    }
  }
  wVar1 = FUN_1000_593c();
  wVar3 = 0;
  if (DAT_2000_b63c == 1) {
    wVar3 = 0xffff;
  }
  qb3f_75(wVar1,wVar3,wVar3,0xb4d2,(word)di);
  wVar1 = (word)((long)(int)wVar3 * 0x16);
  uVar4 = extraout_DX;
  uVar11 = qb3f_75(wVar1,wVar3,(word)((ulong)((long)(int)wVar3 * 0x16) >> 0x10),0xb4ca,wVar1);
  wVar3 = (wVar3 + (int)uVar11) * 2;
  uVar2 = 0;
  if (*(int *)(wVar3 + 0x4e90) == 0) {
    uVar2 = 0xffff;
  }
  wVar1 = uVar2 & uVar4;
  uVar8 = wVar1 == 0;
  if (!(bool)uVar8) {
    DAT_2000_b63c = 0;
    uVar11 = FUN_1000_58f7();
  }
  uVar11 = qb3f_a7((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4fa,wVar3);
  if ((bool)uVar8) {
    uVar11 = FUN_1000_4abd();
  }
  uVar8 = DAT_2000_b5f0 == 1;
  if ((bool)uVar8) {
    uVar11 = FUN_1000_49f8();
  }
  uVar11 = qb3f_a7((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4fa,wVar3);
  if ((bool)uVar8) {
    FUN_1000_4a17();
    uVar11 = FUN_1000_8fea();
  }
LAB_1000_4819:
  uVar8 = DAT_2000_b54e == 0;
  uVar10 = DAT_2000_b54e == 1;
  if ((bool)uVar10) {
    uVar11 = FUN_1000_58f7();
    DAT_2000_b54e = 0;
  }
  qb3f_9f((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4c6,0xb802);
  if ((bool)uVar8) {
    DAT_2000_b63e = 1;
    FUN_1000_56cc();
  }
  else {
    uVar10 = DAT_2000_b63e == 1;
    if ((bool)uVar10) {
      DAT_2000_b63e = 0;
      FUN_1000_58f7();
      FUN_1000_49b8();
    }
  }
  uVar11 = FUN_1000_4a52();
  uVar11 = qb3f_9f((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb47c,0xb7f6);
  if ((bool)uVar10) {
    uVar8 = 1;
    wVar3 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xb7f6);
    wVar1 = 0x5286;
    uVar11 = qb3e_58(wVar3,0x5286,3,0xb47c,0xb7f6);
  }
  else {
    uVar8 = 0;
  }
  uVar11 = qb3f_9f((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb47c,0xb7d8);
  if ((bool)uVar8) {
    uVar8 = 1;
    wVar3 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xb7d8);
    wVar1 = 0x5298;
    uVar11 = qb3e_58(wVar3,0x5298,3,0xb47c,0xb7d8);
  }
  else {
    uVar8 = 0;
  }
  uVar11 = qb3f_9f((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb47c,0xbb60);
  if ((bool)uVar8) {
    uVar8 = 1;
    wVar3 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xbb60);
    wVar1 = 0x52aa;
    uVar11 = qb3e_58(wVar3,0x52aa,3,0xb47c,0xbb60);
  }
  else {
    uVar8 = 0;
  }
  uVar11 = qb3f_9f((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb47c,0xb802);
  if ((bool)uVar8) {
    wVar3 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xb802);
    wVar1 = 0x52bc;
    uVar11 = qb3e_58(wVar3,0x52bc,3,0xb47c,0xb802);
  }
  qb3f_75((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4d2,0xb802);
  wVar3 = (word)((long)(int)wVar1 * 0x16);
  uVar11 = qb3f_75(wVar3,wVar1,(word)((ulong)((long)(int)wVar1 * 0x16) >> 0x10),0xb4ca,wVar3);
  iVar6 = wVar1 + (word)uVar11;
  uVar8 = iVar6 < 0;
  wVar3 = iVar6 * 2;
  uVar10 = wVar3 == 0;
  wVar1 = *(word *)(wVar3 + 0x4e90);
  uVar11 = qb3f_57((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4ca,wVar3);
  wVar3 = 0x4e28;
  uVar11 = qb3f_7d((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb4ca,0x4e28);
  uVar11 = qb3f_a7((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0x4e28,0x4e28);
  if (!(bool)uVar10) {
    wVar3 = 0x4e28;
    uVar11 = qb3f_8f((word)uVar11,0x4e28,(word)((ulong)uVar11 >> 0x10),0xb48c,0xbe82);
    uVar11 = qb3f_71((word)uVar11,wVar3,(word)((ulong)uVar11 >> 0x10),0xb48c,0xce48);
    uVar11 = qb3f_81((word)uVar11,wVar3,(word)((ulong)uVar11 >> 0x10),0xb48c,0xce48);
    wVar1 = qb3f_a1((word)uVar11,wVar3,(word)((ulong)uVar11 >> 0x10),0xb48c,wVar3);
    wVar7 = 0;
    if (!(bool)uVar8 && !(bool)uVar10) {
      wVar7 = 0xffff;
    }
    uVar11 = qb3f_7f(wVar1,wVar3,wVar7,0xb7b0,0xb7f6);
    wVar1 = wVar3;
    uVar11 = qb3f_a1((word)uVar11,wVar3,(word)((ulong)uVar11 >> 0x10),0xb7b0,wVar3);
    iVar6 = 0;
    if ((bool)uVar8) {
      iVar6 = -1;
    }
    bVar9 = (int)((ulong)uVar11 >> 0x10) == 0;
    uVar10 = iVar6 == 0 && bVar9;
    if (iVar6 != 0 || !bVar9) {
      uVar11 = FUN_1000_7932();
    }
  }
  wVar1 = qb3f_a7((word)uVar11,wVar1,(word)((ulong)uVar11 >> 0x10),0xb50e,wVar3);
  wVar7 = 0;
  if ((bool)uVar10) {
    wVar7 = 0xffff;
  }
  qb3f_75(wVar1,wVar7,wVar7,0xb4d2,wVar3);
  wVar1 = (word)((long)(int)wVar7 * 0x16);
  uVar4 = extraout_DX_00;
  uVar11 = qb3f_75(wVar1,wVar7,(word)((ulong)((long)(int)wVar7 * 0x16) >> 0x10),0xb4ca,wVar1);
  uVar2 = 0;
  if (0 < *(int *)((wVar7 + (word)uVar11) * 2 + 0x4e90)) {
    uVar2 = 0xffff;
  }
  if ((uVar2 & uVar4) != 0) {
    qb3f_7b((word)uVar11,uVar2 & uVar4,(word)((ulong)uVar11 >> 0x10),0xbc22,0xb4fa);
    FUN_1000_803a();
    return;
  }
  FUN_1000_49d1();
  return;
}


// ==== FUN_1000_49b8 @ 1000:49b8 (size 25) callers: FUN_1000_4275,FUN_1000_593c

void __cdecl16near FUN_1000_49b8(void)

{
  word in_AX;
  word in_DX;
  word bx;
  undefined1 *bx_00;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar1;
  
  uVar1 = qb3e_42(in_AX,0x19,in_DX,unaff_SI,unaff_DI);
  bx = 0x16;
  uVar1 = qb3e_44((word)uVar1,0x16,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  uVar1 = qb3f_bc((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  bx_00 = (undefined1 *)&lit_BACK;
  uVar1 = qb3f_6a((word)uVar1,0xce4c,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar1,(word)bx_00,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_49d1 @ 1000:49d1 (size 39) callers: FUN_1000_4275,FUN_1000_803a

void __cdecl16near FUN_1000_49d1(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word bx;
  undefined1 *bx_00;
  undefined1 in_CF;
  undefined4 uVar1;
  
  uVar1 = qb3f_9f(in_AX,in_BX,in_DX,0xb4ea,0xb7d8);
  if ((bool)in_CF) {
    uVar1 = qb3e_42((word)uVar1,0x12,(word)((ulong)uVar1 >> 0x10),0xb4ea,0xb7d8);
    bx = 0x1c;
    uVar1 = qb3e_44((word)uVar1,0x1c,(word)((ulong)uVar1 >> 0x10),0xb4ea,0xb7d8);
    uVar1 = qb3f_bc((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb4ea,0xb7d8);
    bx_00 = (undefined1 *)&lit_H_HELP;
    uVar1 = qb3f_6a((word)uVar1,0xce64,(word)((ulong)uVar1 >> 0x10),0xb4ea,0xb7d8);
    qb3e_79((word)uVar1,(word)bx_00,(word)((ulong)uVar1 >> 0x10),0xb4ea,0xb7d8);
  }
  return;
}


// ==== FUN_1000_49f8 @ 1000:49f8 (size 31) callers: FUN_1000_4275,FUN_1000_4c28,entry

void __cdecl16near FUN_1000_49f8(void)

{
  word wVar1;
  word unaff_SI;
  word unaff_DI;
  
  wVar1 = qb3e_87(0,0,0x20,unaff_SI,unaff_DI);
  wVar1 = qb3e_88(wVar1,0xa0,199,unaff_SI,unaff_DI);
  qb3e_3a(wVar1,0x60c4,0x1bbe,unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_4a17 @ 1000:4a17 (size 59) callers: FUN_1000_4275,FUN_1000_4c28,entry

void __cdecl16near FUN_1000_4a17(void)

{
  word wVar1;
  word unaff_SI;
  word unaff_DI;
  
  wVar1 = qb3e_87(0,0xa1,0x20,unaff_SI,unaff_DI);
  wVar1 = qb3e_88(wVar1,0x13f,0x38,unaff_SI,unaff_DI);
  wVar1 = qb3e_3a(wVar1,0x7c82,0x4c6,unaff_SI,unaff_DI);
  wVar1 = qb3e_87(wVar1,0x10a,0x39,unaff_SI,unaff_DI);
  wVar1 = qb3e_88(wVar1,0x13f,0x5e,unaff_SI,unaff_DI);
  qb3e_3a(wVar1,0x8148,0x21e,unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_4a52 @ 1000:4a52 (size 42) callers: FUN_1000_4275,FUN_1000_4c28

void FUN_1000_4a52(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word dx;
  word in_BX;
  word unaff_DI;
  word wVar2;
  undefined4 uVar3;
  
  uVar3 = qb3f_ab(in_AX,in_BX,in_DX,0xb4ca,unaff_DI);
  wVar2 = unaff_DI + *(int *)(in_BX + 0xbc3a);
  uVar3 = qb3f_81((word)uVar3,in_BX,(word)((ulong)uVar3 >> 0x10),0xb4ca,wVar2);
  qb3f_77((word)uVar3,in_BX,(word)((ulong)uVar3 >> 0x10),0xb4ca,wVar2);
  DAT_2000_b5f2 = in_BX;
  uVar3 = qb3f_ab(in_BX,in_BX,dx,0xb4d2,wVar2);
  wVar2 = wVar2 + *(int *)((char *)s_YOU_FELL_DOWN_A_CHUTE__2000_cb88 + 0x16 + in_BX);
  uVar3 = qb3f_81((word)uVar3,in_BX,(word)((ulong)uVar3 >> 0x10),0xb4d2,wVar2);
  qb3f_77((word)uVar3,in_BX,(word)((ulong)uVar3 >> 0x10),0xb4d2,wVar2);
  wVar1 = DAT_2000_b5f2;
  DAT_2000_b5f4 = in_BX;
  uVar3 = qb3e_87(0,DAT_2000_b5f2,in_BX,0xb4d2,wVar2);
  wVar1 = qb3e_88((word)uVar3,wVar1 + 6,(int)((ulong)uVar3 >> 0x10) + 6,0xb4d2,wVar2);
  qb3e_3a(wVar1,0x52e0,0x12,0xb4d2,wVar2);
  return;
}


// ==== FUN_1000_4a7c @ 1000:4a7c (size 34) callers: entry

void __cdecl16near FUN_1000_4a7c(void)

{
  word wVar1;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  wVar1 = DAT_2000_b5f2;
  uVar2 = qb3e_87(0,DAT_2000_b5f2,DAT_2000_b5f4,unaff_SI,unaff_DI);
  wVar1 = qb3e_88((word)uVar2,wVar1 + 6,(int)((ulong)uVar2 >> 0x10) + 6,unaff_SI,unaff_DI);
  qb3e_3a(wVar1,0x52e0,0x12,unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_4a9e @ 1000:4a9e (size 31) callers: FUN_1000_09e8

void FUN_1000_4a9e(void)

{
  word in_AX;
  word wVar1;
  word ax;
  uint uVar2;
  word wVar3;
  undefined1 *bx;
  int iVar4;
  word unaff_SI;
  word unaff_DI;
  undefined1 uVar5;
  undefined1 uVar6;
  undefined4 uVar7;
  
  wVar1 = qb3e_72(in_AX,0x10b,0x39,unaff_SI,unaff_DI);
  wVar1 = qb3e_73(wVar1,0x13f,0x5e,unaff_SI,unaff_DI);
  wVar3 = 0;
  uVar5 = 0;
  uVar6 = 1;
  uVar7 = qb3e_74(wVar1,0,0xffff,unaff_SI,unaff_DI);
  uVar7 = qb3e_75((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  uVar7 = qb3e_42((word)uVar7,6,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = 0x23;
  uVar7 = qb3e_44((word)uVar7,0x23,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  uVar7 = qb3f_bc((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  bx = (undefined1 *)&lit_CAST;
  uVar7 = qb3f_6e((word)uVar7,0xce6e,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  uVar7 = qb3e_79((word)uVar7,(word)bx,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = 0xb7f6;
  uVar7 = qb3f_6f((word)uVar7,(word)bx,(word)((ulong)uVar7 >> 0x10),0xb7f6,unaff_DI);
  while( true ) {
    uVar7 = qb3f_7d((word)uVar7,(word)bx,(word)((ulong)uVar7 >> 0x10),wVar1,0x4e28);
    wVar1 = qb3f_9f((word)uVar7,(word)bx,(word)((ulong)uVar7 >> 0x10),0x4e28,0xbb6c);
    if (!(bool)uVar5 && !(bool)uVar6) break;
    iVar4 = 0x4e28;
    uVar7 = qb3f_75(wVar1,0x4e28,0x4e28,0x4e28,0xbb6c);
    wVar3 = iVar4 * 4;
    uVar5 = 0x9fdf < wVar3;
    uVar6 = wVar3 + 0x6020 == 0;
    uVar7 = qb3f_a7((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),wVar3 + 0x6020,0xbb6c);
    wVar1 = (word)((ulong)uVar7 >> 0x10);
    if ((bool)uVar5 || (bool)uVar6) {
      uVar7 = qb3f_7f((word)uVar7,wVar3,wVar1,0x4e28,0xb7fa);
      uVar7 = qb3f_77((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7fa);
      uVar7 = qb3e_42((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7fa);
      wVar1 = 0x23;
      uVar7 = qb3e_44((word)uVar7,0x23,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7fa);
      uVar7 = qb3f_bc((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7fa);
      bx = (undefined1 *)&lit_empty;
      uVar7 = qb3f_6e((word)uVar7,0xce76,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7fa);
      uVar7 = qb3e_79((word)uVar7,(word)bx,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7fa);
    }
    else {
      ax = qb3f_7f((word)uVar7,wVar3,wVar1,wVar1,0xb7fa);
      uVar7 = qb3f_77(ax,wVar3,wVar3,wVar1,0xb7fa);
      uVar7 = qb3e_42((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),wVar1,0xb7fa);
      wVar3 = 0x23;
      uVar7 = qb3e_44((word)uVar7,0x23,(word)((ulong)uVar7 >> 0x10),wVar1,0xb7fa);
      uVar7 = qb3f_bc((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),wVar1,0xb7fa);
      uVar2 = (uint)((ulong)uVar7 >> 0x10);
      uVar5 = 0xe631 < uVar2;
      bx = (undefined1 *)(uVar2 + 0x19ce);
      uVar6 = bx == (undefined1 *)0x0;
      uVar7 = qb3f_6e((word)uVar7,(word)bx,(word)bx,wVar1,0xb7fa);
      uVar7 = qb3e_79((word)uVar7,(word)bx,(word)((ulong)uVar7 >> 0x10),wVar1,0xb7fa);
    }
    wVar1 = 0x4e28;
    uVar7 = qb3f_7f((word)uVar7,(word)bx,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7f6);
  }
  return;
}


// ==== FUN_1000_4abd @ 1000:4abd (size 162) callers: FUN_1000_4275,FUN_1000_803a,FUN_1000_92c8

void __cdecl16near FUN_1000_4abd(void)

{
  word in_AX;
  word ax;
  word in_DX;
  uint uVar1;
  word wVar2;
  undefined1 *bx;
  int iVar3;
  word unaff_SI;
  word wVar4;
  word unaff_DI;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar5;
  
  uVar5 = qb3e_42(in_AX,6,in_DX,unaff_SI,unaff_DI);
  wVar2 = 0x23;
  uVar5 = qb3e_44((word)uVar5,0x23,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  uVar5 = qb3f_bc((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  bx = (undefined1 *)&lit_CAST;
  uVar5 = qb3f_6e((word)uVar5,0xce6e,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  uVar5 = qb3e_79((word)uVar5,(word)bx,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  wVar2 = 0xb7f6;
  uVar5 = qb3f_6f((word)uVar5,(word)bx,(word)((ulong)uVar5 >> 0x10),0xb7f6,unaff_DI);
  while( true ) {
    uVar5 = qb3f_7d((word)uVar5,(word)bx,(word)((ulong)uVar5 >> 0x10),wVar2,0x4e28);
    wVar2 = qb3f_9f((word)uVar5,(word)bx,(word)((ulong)uVar5 >> 0x10),0x4e28,0xbb6c);
    if (!(bool)in_CF && !(bool)in_ZF) break;
    iVar3 = 0x4e28;
    uVar5 = qb3f_75(wVar2,0x4e28,0x4e28,0x4e28,0xbb6c);
    wVar4 = iVar3 * 4;
    in_CF = 0x9fdf < wVar4;
    in_ZF = wVar4 + 0x6020 == 0;
    uVar5 = qb3f_a7((word)uVar5,wVar4,(word)((ulong)uVar5 >> 0x10),wVar4 + 0x6020,0xbb6c);
    wVar2 = (word)((ulong)uVar5 >> 0x10);
    if ((bool)in_CF || (bool)in_ZF) {
      uVar5 = qb3f_7f((word)uVar5,wVar4,wVar2,0x4e28,0xb7fa);
      uVar5 = qb3f_77((word)uVar5,wVar4,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7fa);
      uVar5 = qb3e_42((word)uVar5,wVar4,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7fa);
      wVar2 = 0x23;
      uVar5 = qb3e_44((word)uVar5,0x23,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7fa);
      uVar5 = qb3f_bc((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7fa);
      bx = (undefined1 *)&lit_empty;
      uVar5 = qb3f_6e((word)uVar5,0xce76,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7fa);
      uVar5 = qb3e_79((word)uVar5,(word)bx,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7fa);
    }
    else {
      ax = qb3f_7f((word)uVar5,wVar4,wVar2,wVar2,0xb7fa);
      uVar5 = qb3f_77(ax,wVar4,wVar4,wVar2,0xb7fa);
      uVar5 = qb3e_42((word)uVar5,wVar4,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7fa);
      wVar4 = 0x23;
      uVar5 = qb3e_44((word)uVar5,0x23,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7fa);
      uVar5 = qb3f_bc((word)uVar5,wVar4,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7fa);
      uVar1 = (uint)((ulong)uVar5 >> 0x10);
      in_CF = 0xe631 < uVar1;
      bx = (undefined1 *)(uVar1 + 0x19ce);
      in_ZF = bx == (undefined1 *)0x0;
      uVar5 = qb3f_6e((word)uVar5,(word)bx,(word)bx,wVar2,0xb7fa);
      uVar5 = qb3e_79((word)uVar5,(word)bx,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7fa);
    }
    wVar2 = 0x4e28;
    uVar5 = qb3f_7f((word)uVar5,(word)bx,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7f6);
  }
  return;
}


// ==== FUN_1000_4b5f @ 1000:4b5f (size 99) callers: FUN_1000_4275

/* WARNING: Instruction at (ram,0x00014b4e) overlaps instruction at (ram,0x00014b4c)
    */

void __cdecl16near FUN_1000_4b5f(void)

{
  bool bVar1;
  code *pcVar2;
  byte bVar3;
  word ax;
  word in_AX;
  int iVar4;
  uint uVar5;
  word in_DX;
  undefined1 *bx;
  word wVar6;
  word wVar7;
  word unaff_SI;
  word unaff_DI;
  undefined1 uVar8;
  byte in_AF;
  undefined1 uVar9;
  ulong uVar10;
  undefined4 uVar11;
  
  uVar11 = qb3f_57(in_AX,DAT_2000_b628,in_DX,unaff_SI,unaff_DI);
  wVar6 = DAT_2000_b624;
  uVar11 = qb3f_71((word)uVar11,DAT_2000_b624,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  uVar11 = qb3f_57((word)uVar11,wVar6,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  uVar11 = qb3f_95((word)uVar11,wVar6,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  wVar6 = DAT_2000_b626;
  uVar11 = qb3f_71((word)uVar11,DAT_2000_b626,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  uVar11 = qb3f_57((word)uVar11,wVar6,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  uVar11 = qb3f_95((word)uVar11,wVar6,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  wVar6 = DAT_2000_b5de + 2;
  uVar11 = qb3f_71((word)uVar11,wVar6,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  uVar11 = qb3f_57((word)uVar11,wVar6,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  uVar11 = qb3f_95((word)uVar11,wVar6,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  bx = DAT_2000_b5ee;
  uVar11 = qb3f_71((word)uVar11,(word)DAT_2000_b5ee,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI)
  ;
  uVar11 = qb3f_57((word)uVar11,(word)bx,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  bVar3 = qb3f_8d((word)uVar11,(word)bx,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  in_AF = 9 < (bVar3 & 0xf) | in_AF;
  in_AF = 9 < (bVar3 + in_AF * -6 & 0xf) | in_AF;
  pcVar2 = (code *)swi(0x3f);
  uVar11 = (*pcVar2)();
  iVar4 = (int)uVar11 + -0x1abb;
  bVar1 = (bool)(9 < ((byte)iVar4 & 0xf) | in_AF);
  uVar5 = CONCAT11((char)((uint)iVar4 >> 8) - bVar1,(byte)iVar4 + bVar1 * -6);
  uVar10 = CONCAT22((int)((ulong)uVar11 >> 0x10),uVar5) & 0xffffff0f;
  if (bVar1 || iVar4 == -0x32fd) {
    return;
  }
  uVar8 = 0;
  *(uint *)(bx + 0x28bf) = *(uint *)(bx + 0x28bf) ^ uVar5 & 0xff0f;
  wVar6 = unaff_SI - 1;
  uVar9 = wVar6 == 0;
  while( true ) {
    uVar11 = qb3f_7d((word)uVar10,(word)bx,(word)(uVar10 >> 0x10),wVar6,unaff_DI);
    wVar6 = qb3f_9f((word)uVar11,(word)bx,(word)((ulong)uVar11 >> 0x10),unaff_DI,0xbb6c);
    if (!(bool)uVar8 && !(bool)uVar9) break;
    iVar4 = 0x4e28;
    uVar11 = qb3f_75(wVar6,0x4e28,0x4e28,0x4e28,0xbb6c);
    wVar7 = iVar4 * 4;
    uVar8 = 0x9fdf < wVar7;
    uVar9 = wVar7 + 0x6020 == 0;
    uVar11 = qb3f_a7((word)uVar11,wVar7,(word)((ulong)uVar11 >> 0x10),wVar7 + 0x6020,0xbb6c);
    wVar6 = (word)((ulong)uVar11 >> 0x10);
    if ((bool)uVar8 || (bool)uVar9) {
      uVar11 = qb3f_7f((word)uVar11,wVar7,wVar6,0x4e28,0xb7fa);
      uVar11 = qb3f_77((word)uVar11,wVar7,(word)((ulong)uVar11 >> 0x10),0x4e28,0xb7fa);
      uVar11 = qb3e_42((word)uVar11,wVar7,(word)((ulong)uVar11 >> 0x10),0x4e28,0xb7fa);
      wVar6 = 0x23;
      uVar11 = qb3e_44((word)uVar11,0x23,(word)((ulong)uVar11 >> 0x10),0x4e28,0xb7fa);
      uVar11 = qb3f_bc((word)uVar11,wVar6,(word)((ulong)uVar11 >> 0x10),0x4e28,0xb7fa);
      bx = (undefined1 *)&lit_empty;
      uVar11 = qb3f_6e((word)uVar11,0xce76,(word)((ulong)uVar11 >> 0x10),0x4e28,0xb7fa);
      uVar11 = qb3e_79((word)uVar11,(word)bx,(word)((ulong)uVar11 >> 0x10),0x4e28,0xb7fa);
    }
    else {
      ax = qb3f_7f((word)uVar11,wVar7,wVar6,wVar6,0xb7fa);
      uVar11 = qb3f_77(ax,wVar7,wVar7,wVar6,0xb7fa);
      uVar11 = qb3e_42((word)uVar11,wVar7,(word)((ulong)uVar11 >> 0x10),wVar6,0xb7fa);
      wVar7 = 0x23;
      uVar11 = qb3e_44((word)uVar11,0x23,(word)((ulong)uVar11 >> 0x10),wVar6,0xb7fa);
      uVar11 = qb3f_bc((word)uVar11,wVar7,(word)((ulong)uVar11 >> 0x10),wVar6,0xb7fa);
      uVar5 = (uint)((ulong)uVar11 >> 0x10);
      uVar8 = 0xe631 < uVar5;
      bx = (undefined1 *)(uVar5 + 0x19ce);
      uVar9 = bx == (undefined1 *)0x0;
      uVar11 = qb3f_6e((word)uVar11,(word)bx,(word)bx,wVar6,0xb7fa);
      uVar11 = qb3e_79((word)uVar11,(word)bx,(word)((ulong)uVar11 >> 0x10),wVar6,0xb7fa);
    }
    wVar6 = 0x4e28;
    uVar10 = qb3f_7f((word)uVar11,(word)bx,(word)((ulong)uVar11 >> 0x10),0x4e28,0xb7f6);
    unaff_DI = 0x4e28;
  }
  return;
}


// ==== FUN_1000_4bc6 @ 1000:4bc6 (size 98) callers: FUN_1000_4c28,FUN_1000_8fea

void __cdecl16near FUN_1000_4bc6(void)

{
  word in_AX;
  word in_DX;
  word wVar1;
  undefined1 *puVar2;
  word dx;
  word bx;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar3;
  
  uVar3 = qb3e_42(in_AX,7,in_DX,unaff_SI,unaff_DI);
  wVar1 = 0x1c;
  uVar3 = qb3e_44((word)uVar3,0x1c,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3f_bc((word)uVar3,wVar1,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  puVar2 = (undefined1 *)&lit_FRONT;
  uVar3 = qb3f_6a((word)uVar3,0xce80,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3e_79((word)uVar3,(word)puVar2,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  dx = 0x14;
  wVar1 = qb3e_42((word)uVar3,0x14,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  bx = 0x16;
  uVar3 = qb3e_44(wVar1,0x16,dx,unaff_SI,unaff_DI);
  uVar3 = qb3f_bc((word)uVar3,bx,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  puVar2 = (undefined1 *)&lit_LEFT;
  uVar3 = qb3f_6a((word)uVar3,0xce8a,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3e_79((word)uVar3,(word)puVar2,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = (word)((ulong)uVar3 >> 0x10);
  uVar3 = qb3e_42((word)uVar3,wVar1,wVar1,unaff_SI,unaff_DI);
  wVar1 = 0x24;
  uVar3 = qb3e_44((word)uVar3,0x24,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3f_bc((word)uVar3,wVar1,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  puVar2 = (undefined1 *)&lit_RIGHT;
  uVar3 = qb3f_6a((word)uVar3,0xce92,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3e_79((word)uVar3,(word)puVar2,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3e_42((word)uVar3,0x19,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = 0x1d;
  uVar3 = qb3e_44((word)uVar3,0x1d,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3f_bc((word)uVar3,wVar1,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  puVar2 = (undefined1 *)&lit_BACK;
  uVar3 = qb3f_6a((word)uVar3,0xce9c,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar3,(word)puVar2,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_4c28 @ 1000:4c28 (size 1032) callers: FUN_1000_0cc0,FUN_1000_1cf5,FUN_1000_3dae,FUN_1000_54cb,FUN_1000_8f6a,entry

/* WARNING: Instruction at (ram,0x00015052) overlaps instruction at (ram,0x0001504f)
    */
/* WARNING: Control flow encountered bad instruction data */

uint __cdecl16near FUN_1000_4c28(void)

{
  uint *puVar1;
  int *piVar2;
  code *pcVar3;
  byte bVar4;
  byte bVar5;
  word in_AX;
  uint uVar6;
  word wVar7;
  undefined1 extraout_DL;
  word dx;
  word dx_00;
  word dx_01;
  word dx_02;
  word dx_03;
  uint extraout_DX;
  uint extraout_DX_00;
  word in_DX;
  word dx_04;
  uint uVar8;
  word dx_05;
  word extraout_DX_01;
  word extraout_DX_02;
  word extraout_DX_03;
  word bx;
  uint uVar9;
  int iVar10;
  word in_BX;
  word wVar11;
  undefined1 *puVar12;
  undefined1 *bx_00;
  int unaff_BP;
  word wVar13;
  undefined2 *di;
  word wVar14;
  undefined2 unaff_SS;
  undefined1 in_CF;
  undefined1 uVar15;
  char cVar16;
  byte in_AF;
  bool bVar17;
  undefined1 uVar18;
  undefined1 in_ZF;
  char cVar19;
  ulong uVar20;
  undefined4 uVar21;
  
  wVar14 = 0xbb64;
  uVar21 = qb3f_9f(in_AX,in_BX,in_DX,0xb48c,0xbb64);
  if (!(bool)in_CF && !(bool)in_ZF) {
    wVar14 = 0xb48c;
    uVar21 = qb3f_7b((word)uVar21,in_BX,(word)((ulong)uVar21 >> 0x10),0xbb64,0xb48c);
  }
  uVar21 = qb3f_a7((word)uVar21,in_BX,(word)((ulong)uVar21 >> 0x10),0xb48c,wVar14);
  if ((bool)in_CF) {
    uVar21 = qb3f_7b((word)uVar21,in_BX,(word)((ulong)uVar21 >> 0x10),0xbc12,0xb48c);
  }
  uVar6 = qb3f_9f((word)uVar21,in_BX,(word)((ulong)uVar21 >> 0x10),0x4e24,0xb48c);
  if ((bool)in_ZF) {
    return uVar6;
  }
  uVar21 = FUN_1000_7932();
  qb3f_75((word)uVar21,in_BX,(word)((ulong)uVar21 >> 0x10),0xb488,0xb48c);
  DAT_2000_b5ee = in_BX;
  uVar6 = qb3f_9f(in_BX,in_BX,dx_04,0xb48c,0xcea4);
  wVar14 = 0;
  if (!(bool)in_CF && !(bool)in_ZF) {
    wVar14 = 0xffff;
  }
  uVar8 = 0;
  if (DAT_2000_b640 == 1) {
    uVar8 = 0xffff;
  }
  uVar15 = 0;
  if ((uVar8 & wVar14) == 0) {
    uVar20 = (ulong)uVar6;
  }
  else {
    DAT_2000_b640 = 2;
    uVar20 = FUN_1000_c7bb();
  }
  uVar6 = qb3f_9f((word)uVar20,wVar14,(word)(uVar20 >> 0x10),0xb48c,0xcea8);
  wVar14 = 0;
  if ((bool)uVar15) {
    wVar14 = 0xffff;
  }
  uVar8 = 0;
  if (DAT_2000_b640 == 2) {
    uVar8 = 0xffff;
  }
  uVar15 = (uVar8 & wVar14) == 0;
  if ((bool)uVar15) {
    uVar20 = (ulong)uVar6;
  }
  else {
    DAT_2000_b640 = 1;
    uVar20 = FUN_1000_c7a5();
  }
  qb3f_75((word)uVar20,wVar14,(word)(uVar20 >> 0x10),0xb48c,0xcea8);
  DAT_2000_b5de = wVar14;
  uVar21 = qb3f_57(wVar14,wVar14,dx_05,0xb48c,0xcea8);
  uVar21 = qb3f_7d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb48c,0x4e24);
  uVar21 = qb3e_32((word)uVar21,0xffff,(word)((ulong)uVar21 >> 0x10),0xb48c,0x4e24);
  uVar21 = qb3e_42((word)uVar21,5,(word)((ulong)uVar21 >> 0x10),0xb48c,0x4e24);
  wVar11 = 0x23;
  uVar21 = qb3e_44((word)uVar21,0x23,(word)((ulong)uVar21 >> 0x10),0xb48c,0x4e24);
  wVar14 = qb3f_bc((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb48c,0x4e24);
  puVar12 = (undefined1 *)&lit_SPELLS;
  uVar21 = qb3f_6e(wVar14,0xceac,wVar11,0xb48c,0x4e24);
  uVar21 = qb3e_79((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb48c,0x4e24);
  uVar21 = qb3e_42((word)uVar21,6,(word)((ulong)uVar21 >> 0x10),0xb48c,0x4e24);
  wVar14 = (word)((ulong)uVar21 >> 0x10);
  uVar21 = qb3e_44((word)uVar21,wVar14,wVar14,0xb48c,0x4e24);
  uVar21 = qb3f_bc((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb48c,0x4e24);
  puVar12 = (undefined1 *)&lit_CAST;
  uVar21 = qb3f_6e((word)uVar21,0xce6e,(word)((ulong)uVar21 >> 0x10),0xb48c,0x4e24);
  uVar21 = qb3e_79((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb48c,0x4e24);
  qb3f_9f((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb642,0xb7f6);
  if (!(bool)uVar15) {
    FUN_1000_4bc6();
    uVar21 = FUN_1000_3f5a();
    if (DAT_2000_b5de == 0) {
      uVar21 = qb3e_42((word)uVar21,5,(word)((ulong)uVar21 >> 0x10),0xb642,0xb7f6);
      wVar14 = 1;
      uVar21 = qb3e_44((word)uVar21,1,(word)((ulong)uVar21 >> 0x10),0xb642,0xb7f6);
      uVar21 = qb3f_bc((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb642,0xb7f6);
      puVar12 = (undefined1 *)&lit_YOU_RE_IN_TOWN;
      uVar21 = qb3f_6e((word)uVar21,0xceb6,(word)((ulong)uVar21 >> 0x10),0xb642,0xb7f6);
      qb3e_79((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb642,0xb7f6);
    }
    uVar21 = FUN_1000_593c();
    bx_00 = (undefined1 *)0x1;
    uVar21 = qb3e_42((word)uVar21,1,(word)((ulong)uVar21 >> 0x10),0xb642,0xb7f6);
    uVar21 = qb3e_44((word)uVar21,(word)bx_00,(word)((ulong)uVar21 >> 0x10),0xb642,0xb7f6);
    qb3f_7b((word)uVar21,(word)bx_00,(word)((ulong)uVar21 >> 0x10),0xce3c,0xb646);
    wVar14 = extraout_DX_01;
    puVar12 = bx_00;
    while (DAT_2000_b652 = bx_00, (int)bx_00 < 0x15) {
      uVar21 = qb3f_7f((word)bx_00,(word)puVar12,wVar14,0xb646,0xbd32);
      uVar21 = qb3f_7d((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb646,0xb646);
      qb3f_7b((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xce40,0xb64a);
      wVar14 = extraout_DX_02;
      for (DAT_2000_b654 = 1; (int)DAT_2000_b654 < 0x14; DAT_2000_b654 = DAT_2000_b654 + 1) {
        uVar21 = qb3f_7f(DAT_2000_b654,(word)puVar12,wVar14,0xb64a,0xbd32);
        wVar14 = qb3f_7d((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb64a,0xb64a);
        wVar11 = (int)((long)(int)DAT_2000_b5de * 0x15) + wVar14;
        wVar13 = wVar11 * 4 + 0x9b06;
        uVar21 = qb3f_7b(wVar11,wVar14,(word)((ulong)((long)(int)DAT_2000_b5de * 0x15) >> 0x10),
                         wVar13,0xb64e);
        uVar15 = 0x14U - (int)DAT_2000_b652 == 0;
        uVar21 = qb3f_57((word)uVar21,0x14U - (int)DAT_2000_b652,(word)((ulong)uVar21 >> 0x10),
                         wVar13,0xb64e);
        wVar14 = 0xb64e;
        uVar21 = qb3f_27((word)uVar21,0xb64e,(word)((ulong)uVar21 >> 0x10),0xb7d8,0xb64e);
        uVar21 = qb3f_8b((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar14,0xb64e);
        wVar11 = 0x1a;
        uVar21 = qb3d_03((word)uVar21,0x1a,(word)((ulong)uVar21 >> 0x10),wVar14,0xb64e);
        uVar21 = qb3f_7d((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar14,wVar14);
        uVar21 = qb3f_8f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar14,0xbc42);
        puVar12 = (undefined1 *)0x1a;
        uVar21 = qb3f_71((word)uVar21,0x1a,(word)((ulong)uVar21 >> 0x10),wVar14,0xbc42);
        uVar21 = qb3d_03((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),wVar14,0xbc42);
        uVar21 = qb3f_9d((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),wVar14,0xbc42);
        uVar21 = qb3f_ad((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),wVar14,0xbc42);
        uVar21 = qb3f_7d((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),wVar14,0xb50a);
        qb3f_a7((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb50a,0xb50a);
        if (!(bool)uVar15) {
          if (DAT_2000_b654 == 1) {
            wVar11 = 0xb646;
            uVar21 = qb3e_84(0xffff,0xb646,0xb64a,0xb50a,0xb50a);
            wVar13 = 0xbd32;
            uVar21 = qb3f_7f((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
            wVar14 = qb3e_85((word)uVar21,0x1a,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
            uVar21 = qb3e_86(wVar14,DAT_2000_19bc,wVar14,wVar11,0xbd32);
          }
          else {
            wVar14 = (word)((long)(int)DAT_2000_b5de * 0x15);
            wVar11 = (wVar14 + DAT_2000_b654 + -1) * 4 + 0x9b06;
            uVar21 = qb3f_7b(wVar14,(word)puVar12,
                             (word)((ulong)((long)(int)DAT_2000_b5de * 0x15) >> 0x10),wVar11,0xb64e)
            ;
            uVar15 = 0x14U - (int)DAT_2000_b652 == 0;
            uVar21 = qb3f_57((word)uVar21,0x14U - (int)DAT_2000_b652,(word)((ulong)uVar21 >> 0x10),
                             wVar11,0xb64e);
            wVar11 = 0xb64e;
            uVar21 = qb3f_27((word)uVar21,0xb64e,(word)((ulong)uVar21 >> 0x10),0xb7d8,0xb64e);
            uVar21 = qb3f_8b((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),wVar11,0xb64e);
            wVar14 = 0x1a;
            uVar21 = qb3d_03((word)uVar21,0x1a,(word)((ulong)uVar21 >> 0x10),wVar11,0xb64e);
            uVar21 = qb3f_7d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,wVar11);
            wVar13 = 0xbc42;
            uVar21 = qb3f_8f((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbc42);
            wVar14 = 0x1a;
            uVar21 = qb3f_71((word)uVar21,0x1a,(word)((ulong)uVar21 >> 0x10),wVar11,0xbc42);
            uVar21 = qb3d_03((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbc42);
            uVar21 = qb3f_9d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbc42);
            while( true ) {
              uVar21 = qb3f_ad((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,wVar13);
              uVar21 = qb3f_7d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xb656);
              wVar11 = 0xb656;
              wVar13 = 0xb7f6;
              uVar21 = qb3f_9f((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb656,0xb7f6);
              if ((bool)uVar15) break;
              uVar21 = qb3f_57((word)uVar21,(word)DAT_2000_b652,(word)((ulong)uVar21 >> 0x10),0xb656
                               ,0xb7f6);
              wVar14 = DAT_2000_b654;
              uVar21 = qb3f_71((word)uVar21,DAT_2000_b654,(word)((ulong)uVar21 >> 0x10),0xb656,
                               0xb7f6);
              uVar21 = qb3f_57((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb656,0xb7f6);
              wVar7 = qb3f_95((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb656,0xb7f6);
              bx = DAT_2000_b5de + 2;
              uVar21 = qb3f_71(wVar7,bx,wVar14,0xb656,0xb7f6);
              uVar21 = qb3f_57((word)uVar21,bx,(word)((ulong)uVar21 >> 0x10),0xb656,0xb7f6);
              uVar21 = qb3f_95((word)uVar21,bx,(word)((ulong)uVar21 >> 0x10),0xb656,0xb7f6);
              wVar14 = DAT_2000_b5ee;
              uVar21 = qb3f_71((word)uVar21,DAT_2000_b5ee,(word)((ulong)uVar21 >> 0x10),0xb656,
                               0xb7f6);
              uVar21 = qb3f_57((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb656,0xb7f6);
              bVar5 = qb3f_8d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb656,0xb7f6);
              in_AF = 9 < (bVar5 & 0xf) | in_AF;
              in_AF = 9 < (bVar5 + in_AF * -6 & 0xf) | in_AF;
              pcVar3 = (code *)swi(0x3f);
              uVar21 = (*pcVar3)();
              iVar10 = (int)uVar21 + -0x1abb;
              in_AF = 9 < ((byte)iVar10 & 0xf) | in_AF;
              uVar6 = CONCAT11((char)((uint)iVar10 >> 8) - in_AF,(byte)iVar10 + in_AF * -6) & 0xff0f
              ;
              if ((bool)in_AF || iVar10 == -0x32fd) {
                return uVar6;
              }
              iVar10 = uVar6 + 0x7bdb;
              uVar21 = CONCAT22((int)((ulong)uVar21 >> 0x10),iVar10);
              uVar15 = iVar10 == 0;
            }
          }
          cVar16 = DAT_2000_b652 == (undefined1 *)0x0;
          if (DAT_2000_b652 == (undefined1 *)0x1) {
            wVar14 = 0xb646;
            uVar20 = qb3e_84(0xffff,0xb646,0xb64a,wVar11,wVar13);
            wVar11 = (word)(uVar20 >> 0x10);
          }
          else {
            puVar12 = DAT_2000_b652;
            wVar7 = qb3f_57((word)uVar21,(word)DAT_2000_b652,(word)((ulong)uVar21 >> 0x10),wVar11,
                            wVar13);
            wVar14 = DAT_2000_b654;
            uVar21 = qb3f_71(wVar7,DAT_2000_b654,(word)puVar12,wVar11,wVar13);
            uVar21 = qb3f_57((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,wVar13);
            uVar21 = qb3f_95((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,wVar13);
            wVar14 = DAT_2000_b5de + 2;
            uVar21 = qb3f_71((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,wVar13);
            uVar21 = qb3f_57((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,wVar13);
            uVar21 = qb3f_95((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,wVar13);
            uVar21 = qb3f_ad((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,wVar13);
            wVar14 = DAT_2000_b5ee;
            uVar21 = qb3f_71((word)uVar21,DAT_2000_b5ee,(word)((ulong)uVar21 >> 0x10),wVar11,wVar13)
            ;
            uVar21 = qb3f_57((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,wVar13);
            bVar5 = qb3f_8d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,wVar13);
            in_AF = 9 < (bVar5 & 0xf) | in_AF;
            in_AF = 9 < (bVar5 + in_AF * -6 & 0xf) | in_AF;
            pcVar3 = (code *)swi(0x3f);
            uVar21 = (*pcVar3)();
            iVar10 = (int)uVar21 + -0x1abb;
            cVar16 = 9 < ((byte)iVar10 & 0xf) | in_AF;
            uVar6 = CONCAT11((char)((uint)iVar10 >> 8) - cVar16,(byte)iVar10 + cVar16 * -6);
            uVar20 = CONCAT22((int)((ulong)uVar21 >> 0x10),uVar6) & 0xffffff0f;
            in_AF = cVar16;
            if ((bool)cVar16 || iVar10 == -0x32fd) {
              return uVar6 & 0xff0f;
            }
          }
          wVar13 = qb3f_7f(CONCAT11((char)(uVar20 >> 8),
                                    ((char)uVar20 - *(char *)(unaff_BP + wVar11 + -0xd75)) - cVar16)
                           ,wVar14,(word)(uVar20 >> 0x10),wVar11,0xbd32);
          wVar14 = qb3e_85(wVar13,wVar14,0x1a,wVar11,0xbd32);
          wVar14 = qb3e_86(wVar14,DAT_2000_19bc,wVar14,wVar11,0xbd32);
          uVar21 = qb3f_57(wVar14,(word)(DAT_2000_b652 + 1),(word)DAT_2000_b652,wVar11,0xbd32);
          wVar14 = DAT_2000_b654;
          uVar21 = qb3f_71((word)uVar21,DAT_2000_b654,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
          uVar21 = qb3f_57((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
          uVar21 = qb3f_95((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
          while( true ) {
            wVar14 = DAT_2000_b5de + 2;
            uVar21 = qb3f_71((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
            uVar21 = qb3f_57((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
            uVar21 = qb3f_95((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
            uVar21 = qb3f_ad((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
            wVar14 = DAT_2000_b5ee;
            uVar21 = qb3f_71((word)uVar21,DAT_2000_b5ee,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32)
            ;
            uVar21 = qb3f_57((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
            bVar5 = qb3f_8d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xbd32);
            in_AF = 9 < (bVar5 & 0xf) | in_AF;
            bVar5 = bVar5 + in_AF * -6 & 0xf;
            in_AF = 9 < bVar5 | in_AF;
            bVar5 = bVar5 + in_AF * -6 & 0xf;
            pcVar3 = (code *)swi(0x3f);
            iVar10 = (*pcVar3)();
            iVar10 = iVar10 + -0x1abb;
            in_AF = 9 < ((byte)iVar10 & 0xf) | in_AF;
            if ((bool)in_AF || iVar10 == -0x32fd) {
              return CONCAT11((char)((uint)iVar10 >> 8) - in_AF,(byte)iVar10 + in_AF * -6) & 0xff0f;
            }
            pcVar3 = (code *)swi(0x3e);
            (*pcVar3)();
            cVar19 = '\0';
            bVar4 = *(byte *)(wVar14 + 0xb7fa) & (byte)(wVar14 >> 8);
            cVar16 = (char)bVar4 < '\0';
            bVar17 = bVar4 == 0;
            pcVar3 = (code *)swi(0x3f);
            (*pcVar3)();
            if (!bVar17 && cVar19 == cVar16) break;
            pcVar3 = (code *)swi(0x3e);
            iVar10 = (*pcVar3)();
            LOCK();
            bVar4 = *(byte *)(unaff_BP + 0xf50);
            *(byte *)(unaff_BP + 0xf50) = bVar5;
            UNLOCK();
            puVar1 = (uint *)(unaff_BP + -0x42e6);
            bVar5 = bVar4 & 0xf;
            *puVar1 = *puVar1 << bVar5 | *puVar1 >> 0x10 - bVar5;
            uVar6 = *puVar1;
            *(char *)(wVar14 + 0xdbbd) = *(char *)(wVar14 + 0xdbbd) + '\x01';
            piVar2 = (int *)(unaff_BP + wVar11 + -6000);
            *piVar2 = *piVar2 + iVar10 + (uint)(byte)(((bVar4 & 0x1f) != 0) * ((uVar6 & 1) != 0));
            uVar21 = CONCAT22(CONCAT11(0xe8,extraout_DL),iVar10 + 0x7dd2);
          }
                    /* WARNING: Bad instruction - Truncating control flow here */
          halt_baddata();
        }
        wVar14 = extraout_DX_03;
      }
      bx_00 = DAT_2000_b652 + 1;
    }
  }
  FUN_1000_49f8();
  uVar21 = FUN_1000_4a17();
  uVar21 = qb3f_7b((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb4ca,0xb5d0);
  uVar21 = qb3f_7b((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb4d2,0xb5d4);
  qb3f_7b((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xbc26,0xb4c6);
  uVar21 = FUN_1000_4a52();
  qb3f_7b((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb7ee,0xb5fa);
  DAT_2000_b5f0 = 0;
  FUN_1000_3f5a();
  uVar21 = FUN_1000_54cb();
  uVar21 = qb3f_ab((word)uVar21,(word)puVar12,(word)((ulong)uVar21 >> 0x10),0xb4ca,0xb5fa);
  wVar13 = *(int *)((char *)s_You_feel_sick__You_need_a_cure_d_2000_ce14 + 0x28 + (int)puVar12) +
           0xb5fa;
  wVar11 = 0xb4ca;
  wVar14 = qb3f_81((word)uVar21,0xb4ca,(word)((ulong)uVar21 >> 0x10),0xb4ca,wVar13);
  qb3f_77(wVar14,wVar11,wVar11,0xb4ca,wVar13);
  DAT_2000_b604 = wVar11 + 8;
  DAT_2000_b602 = wVar11;
  uVar21 = qb3f_ab(DAT_2000_b604,wVar11,dx,0xb4d2,wVar13);
  wVar13 = wVar13 + *(int *)((undefined1 *)&LAB_2000_ce40 + wVar11);
  wVar11 = 0xb4d2;
  uVar21 = qb3f_81((word)uVar21,0xb4d2,(word)((ulong)uVar21 >> 0x10),0xb4d2,wVar13);
  wVar14 = wVar11;
  qb3f_77((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb4d2,wVar13);
  DAT_2000_b608 = wVar14 + 8;
  uVar15 = DAT_2000_b608 == 0;
  DAT_2000_b606 = wVar14;
  uVar21 = qb3f_7b(DAT_2000_b608,wVar14,dx_00,0xce44,0xb4c2);
  wVar13 = 0xce44;
  qb3f_75((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),wVar11,0xb4c2);
  DAT_2000_b60a = wVar14;
  qb3f_75(wVar14,wVar14,dx_01,dx_01,0xb4c2);
  DAT_2000_b60c = wVar14;
  qb3f_75(wVar14,wVar14,dx_02,0xb48c,0xb4c2);
  DAT_2000_b5de = wVar14;
  uVar21 = qb3f_9f(wVar14,wVar14,dx_03,0xb4fa,wVar13);
  uVar6 = 0;
  if ((bool)uVar15) {
    uVar6 = 0xffff;
  }
  bVar17 = false;
  qb3f_9f((word)uVar21,uVar6,(word)((ulong)uVar21 >> 0x10),0xb50e,0xb7f6);
  uVar8 = 0;
  if (bVar17) {
    uVar8 = 0xffff;
  }
  uVar9 = 0;
  if (DAT_2000_b538 == 1) {
    uVar9 = 0xffff;
  }
  wVar14 = uVar9 | uVar8 | uVar6;
  uVar15 = wVar14 == 0;
  if ((bool)uVar15) {
    uVar21 = FUN_1000_3fe3();
  }
  else {
    uVar21 = FUN_1000_3fa9();
  }
  DAT_2000_b538 = 0;
  uVar21 = qb3f_9f((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb50e,0xb7f6);
  wVar14 = 0;
  if (!(bool)uVar15) {
    wVar14 = 0xffff;
    uVar15 = 0;
  }
  wVar11 = qb3f_9f((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb60e,0xb7f6);
  uVar6 = 0;
  if ((bool)uVar15) {
    uVar6 = 0xffff;
  }
  bVar17 = (uVar6 & wVar14) == 0;
  if (bVar17) {
    uVar21 = qb3f_9f(wVar11,wVar14,0,0xb59a,0xb4ca);
    uVar6 = 0;
    if (bVar17) {
      uVar6 = 0xffff;
    }
    bVar17 = false;
    wVar14 = qb3f_9f((word)uVar21,uVar6,(word)((ulong)uVar21 >> 0x10),0xb616,0xb4d2);
    uVar8 = 0;
    if (bVar17) {
      uVar8 = 0xffff;
    }
    uVar15 = (uVar8 & uVar6) == 0;
    wVar11 = DAT_2000_b5de;
    uVar21 = qb3f_57(wVar14,DAT_2000_b5de,uVar8 & uVar6,0xb616,0xb4d2);
    uVar21 = qb3f_a1((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb616,0xb61a);
    uVar6 = (uint)((ulong)uVar21 >> 0x10);
    uVar8 = 0;
    if ((bool)uVar15) {
      uVar8 = 0xffff;
    }
    wVar14 = uVar8 & uVar6;
    bVar17 = wVar14 == 0;
    uVar6 = qb3f_9f((word)uVar21,wVar14,uVar6,0xb61e,0xb47c);
    uVar8 = 0;
    if (bVar17) {
      uVar8 = 0xffff;
    }
    uVar21 = CONCAT22(uVar8 & wVar14,uVar6);
    uVar20 = (ulong)uVar6;
    if ((uVar8 & wVar14) != 0) goto LAB_1000_4819;
  }
  else {
    uVar21 = qb3f_7b(wVar11,wVar14,uVar6 & wVar14,0xb7ee,0xb60e);
    qb3f_7b((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb7d0,0xb612);
    uVar20 = FUN_1000_593c();
  }
  uVar21 = qb3f_7b((word)uVar20,wVar14,(word)(uVar20 >> 0x10),0xb4ca,0xb59a);
  uVar21 = qb3f_7b((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4d2,0xb616);
  uVar21 = qb3f_7b((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb47c,0xb61e);
  wVar14 = DAT_2000_b5de;
  uVar21 = qb3f_57((word)uVar21,DAT_2000_b5de,(word)((ulong)uVar21 >> 0x10),0xb47c,0xb61e);
  di = (undefined2 *)0xb61a;
  qb3f_7d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb47c,0xb61a);
  uVar6 = 0;
  if (DAT_2000_b5f0 == 0) {
    uVar6 = 0xffff;
  }
  uVar8 = 0;
  if (DAT_2000_b622 == 0) {
    uVar8 = 0xffff;
  }
  if ((uVar8 & uVar6) == 0) {
    DAT_2000_b622 = 0;
    DAT_2000_b624 = DAT_2000_b60c;
    DAT_2000_b626 = DAT_2000_b60a;
    DAT_2000_b628 = 1;
    uVar6 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar14 = DAT_2000_b602;
      uVar21 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb47c,0xb61a);
      wVar14 = qb3e_85((word)uVar21,wVar14 + 8,(word)((ulong)uVar21 >> 0x10),0xb47c,0xb61a);
      uVar6 = qb3e_86(wVar14,DAT_2000_19bc,0xffff,0xb47c,0xb61a);
    }
    wVar14 = 0;
    if (5 < DAT_2000_b62a) {
      wVar14 = 0xffff;
    }
    uVar8 = 0;
    if (DAT_2000_b62a < 8) {
      uVar8 = 0xffff;
    }
    if ((uVar8 & wVar14) == 0) {
      uVar20 = (ulong)uVar6;
      uVar15 = 1;
    }
    else {
      wVar14 = DAT_2000_b602 + 3;
      *(word *)(unaff_BP + -6) = DAT_2000_b602;
      uVar21 = qb3e_84(0,wVar14,DAT_2000_b606,0xb47c,0xb61a);
      wVar11 = qb3e_85((word)uVar21,*(int *)(unaff_BP + -6) + 5,(word)((ulong)uVar21 >> 0x10),0xb47c
                       ,0xb61a);
      wVar14 = 0;
      uVar15 = 1;
      uVar20 = qb3e_86(wVar11,0,0xffff,0xb47c,0xb61a);
    }
    qb3f_9f((word)uVar20,wVar14,(word)(uVar20 >> 0x10),0xb4d2,0xb7f6);
    if ((bool)uVar15) {
      wVar14 = DAT_2000_b602;
      uVar21 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb4d2,0xb7f6);
      wVar14 = qb3e_85((word)uVar21,wVar14 + 8,(word)((ulong)uVar21 >> 0x10),0xb4d2,0xb7f6);
      qb3e_86(wVar14,DAT_2000_19bc,0xffff,0xb4d2,0xb7f6);
    }
    DAT_2000_b624 = DAT_2000_b60c;
    DAT_2000_b626 = DAT_2000_b60a;
    DAT_2000_b628 = 2;
    uVar6 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar14 = DAT_2000_b602;
      uVar21 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb4d2,0xb7f6);
      wVar14 = qb3e_85((word)uVar21,wVar14,(int)((ulong)uVar21 >> 0x10) + 8,0xb4d2,0xb7f6);
      uVar6 = qb3e_86(wVar14,DAT_2000_19bc,0xffff,0xb4d2,0xb7f6);
    }
    wVar14 = 0;
    if (5 < DAT_2000_b62a) {
      wVar14 = 0xffff;
    }
    uVar8 = 0;
    if (DAT_2000_b62a < 8) {
      uVar8 = 0xffff;
    }
    if ((uVar8 & wVar14) == 0) {
      uVar20 = (ulong)uVar6;
      uVar15 = 1;
    }
    else {
      wVar11 = DAT_2000_b606 + 2;
      *(word *)(unaff_BP + -6) = DAT_2000_b606;
      wVar14 = DAT_2000_b602;
      wVar11 = qb3e_84(0,DAT_2000_b602,wVar11,0xb4d2,0xb7f6);
      wVar11 = qb3e_85(wVar11,wVar14,*(int *)(unaff_BP + -6) + 6,0xb4d2,0xb7f6);
      wVar14 = 0;
      uVar15 = 1;
      uVar20 = qb3e_86(wVar11,0,0xffff,0xb4d2,0xb7f6);
    }
    qb3f_9f((word)uVar20,wVar14,(word)(uVar20 >> 0x10),0xb4ca,0xb7f6);
    if ((bool)uVar15) {
      wVar14 = DAT_2000_b602;
      uVar21 = qb3e_84(0,DAT_2000_b602,DAT_2000_b606,0xb4ca,0xb7f6);
      wVar14 = qb3e_85((word)uVar21,wVar14,(int)((ulong)uVar21 >> 0x10) + 8,0xb4ca,0xb7f6);
      qb3e_86(wVar14,DAT_2000_19bc,0xffff,0xb4ca,0xb7f6);
    }
    DAT_2000_b624 = DAT_2000_b60c + 1;
    DAT_2000_b626 = DAT_2000_b60a;
    DAT_2000_b628 = 2;
    uVar6 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar14 = DAT_2000_b604;
      uVar21 = qb3e_84(0,DAT_2000_b604,DAT_2000_b606,0xb4ca,0xb7f6);
      wVar14 = qb3e_85((word)uVar21,wVar14,(int)((ulong)uVar21 >> 0x10) + 8,0xb4ca,0xb7f6);
      uVar6 = qb3e_86(wVar14,DAT_2000_19bc,0xffff,0xb4ca,0xb7f6);
    }
    wVar14 = 0;
    if (5 < DAT_2000_b62a) {
      wVar14 = 0xffff;
    }
    uVar8 = 0;
    if (DAT_2000_b62a < 8) {
      uVar8 = 0xffff;
    }
    if ((uVar8 & wVar14) == 0) {
      uVar20 = (ulong)uVar6;
      uVar15 = 1;
    }
    else {
      wVar11 = DAT_2000_b606 + 2;
      *(word *)(unaff_BP + -6) = DAT_2000_b606;
      wVar14 = DAT_2000_b604;
      wVar11 = qb3e_84(0,DAT_2000_b604,wVar11,0xb4ca,0xb7f6);
      wVar11 = qb3e_85(wVar11,wVar14,*(int *)(unaff_BP + -6) + 6,0xb4ca,0xb7f6);
      wVar14 = 0;
      uVar15 = 1;
      uVar20 = qb3e_86(wVar11,0,0xffff,0xb4ca,0xb7f6);
    }
    qb3f_9f((word)uVar20,wVar14,(word)(uVar20 >> 0x10),0xb4ca,0xbc1e);
    if ((bool)uVar15) {
      wVar14 = DAT_2000_b604;
      uVar21 = qb3e_84(0,DAT_2000_b604,DAT_2000_b606,0xb4ca,0xbc1e);
      wVar14 = qb3e_85((word)uVar21,wVar14,(int)((ulong)uVar21 >> 0x10) + 8,0xb4ca,0xbc1e);
      qb3e_86(wVar14,DAT_2000_19bc,0xffff,0xb4ca,0xbc1e);
    }
    DAT_2000_b626 = DAT_2000_b60a + 1;
    DAT_2000_b624 = DAT_2000_b60c;
    DAT_2000_b628 = 1;
    uVar6 = FUN_1000_4b5f();
    if (5 < DAT_2000_b62a) {
      wVar14 = DAT_2000_b602;
      uVar21 = qb3e_84(0,DAT_2000_b602,DAT_2000_b608,0xb4ca,0xbc1e);
      wVar14 = qb3e_85((word)uVar21,wVar14 + 8,(word)((ulong)uVar21 >> 0x10),0xb4ca,0xbc1e);
      uVar6 = qb3e_86(wVar14,DAT_2000_19bc,0xffff,0xb4ca,0xbc1e);
    }
    wVar14 = 0;
    if (5 < DAT_2000_b62a) {
      wVar14 = 0xffff;
    }
    uVar8 = 0;
    if (DAT_2000_b62a < 8) {
      uVar8 = 0xffff;
    }
    uVar15 = 0;
    if ((uVar8 & wVar14) == 0) {
      uVar20 = (ulong)uVar6;
      uVar18 = 1;
    }
    else {
      wVar14 = DAT_2000_b602 + 3;
      *(word *)(unaff_BP + -6) = DAT_2000_b602;
      uVar21 = qb3e_84(0,wVar14,DAT_2000_b608,0xb4ca,0xbc1e);
      wVar11 = qb3e_85((word)uVar21,*(int *)(unaff_BP + -6) + 5,(word)((ulong)uVar21 >> 0x10),0xb4ca
                       ,0xbc1e);
      uVar15 = 0;
      wVar14 = 0;
      uVar18 = 1;
      uVar20 = qb3e_86(wVar11,0,0xffff,0xb4ca,0xbc1e);
    }
    uVar21 = qb3f_9f((word)uVar20,wVar14,(word)(uVar20 >> 0x10),0xb4d2,0xcb6a);
    if ((bool)uVar18) {
      wVar14 = DAT_2000_b602;
      uVar21 = qb3e_84(0,DAT_2000_b602,DAT_2000_b608,0xb4d2,0xcb6a);
      uVar15 = 0xfff7 < wVar14;
      uVar18 = wVar14 + 8 == 0;
      wVar11 = qb3e_85((word)uVar21,wVar14 + 8,(word)((ulong)uVar21 >> 0x10),0xb4d2,0xcb6a);
      wVar14 = DAT_2000_19bc;
      uVar21 = qb3e_86(wVar11,DAT_2000_19bc,0xffff,0xb4d2,0xcb6a);
    }
    else {
      uVar18 = 0;
    }
    di = (undefined2 *)&DAT_2000_bb60;
    uVar21 = qb3f_9f((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4c6,0xbb60);
    if ((bool)uVar15 || (bool)uVar18) {
      qb3f_a7((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4c6,0xbb60);
      wVar14 = DAT_2000_b602;
      if ((bool)uVar15) {
        wVar13 = DAT_2000_b606 + 2;
        wVar11 = DAT_2000_b602 + 2;
        *(word *)(unaff_BP + -6) = DAT_2000_b606;
        *(word *)(unaff_BP + -8) = wVar14;
        wVar14 = qb3e_84(0,wVar11,wVar13,0xb4c6,0xbb60);
        wVar14 = qb3e_85(wVar14,*(int *)(unaff_BP + -8) + 6,*(int *)(unaff_BP + -6) + 6,0xb4c6,
                         0xbb60);
        uVar21 = qb3e_86(wVar14,DAT_2000_19c8,wVar14,0xb4c6,0xbb60);
      }
      else {
        wVar13 = DAT_2000_b606 + 2;
        wVar11 = DAT_2000_b602 + 2;
        *(word *)(unaff_BP + -6) = DAT_2000_b606;
        *(word *)(unaff_BP + -8) = wVar14;
        wVar14 = qb3e_84(0,wVar11,wVar13,0xb4c6,0xbb60);
        wVar14 = qb3e_85(wVar14,*(int *)(unaff_BP + -8) + 6,*(int *)(unaff_BP + -6) + 6,0xb4c6,
                         0xbb60);
        uVar21 = qb3e_86(wVar14,DAT_2000_19c8,1,0xb4c6,0xbb60);
      }
    }
    if (DAT_2000_b5de == 0) {
      wVar14 = DAT_2000_b602 - 1;
      uVar21 = qb3f_57((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4c6,0xbb60);
      uVar21 = qb3f_7d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4c6,0xb62c);
      wVar14 = DAT_2000_b606;
      uVar21 = qb3f_57((word)uVar21,DAT_2000_b606,(word)((ulong)uVar21 >> 0x10),0xb4c6,0xb62c);
      uVar21 = qb3f_7d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4c6,0xb630);
      uVar21 = qb3f_7b((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4ca,0xb634);
      di = (undefined2 *)0xb638;
      qb3f_7b((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4d2,0xb638);
      FUN_1000_c102();
    }
  }
  wVar14 = FUN_1000_593c();
  wVar11 = 0;
  if (DAT_2000_b63c == 1) {
    wVar11 = 0xffff;
  }
  qb3f_75(wVar14,wVar11,wVar11,0xb4d2,(word)di);
  wVar14 = (word)((long)(int)wVar11 * 0x16);
  uVar6 = extraout_DX;
  uVar21 = qb3f_75(wVar14,wVar11,(word)((ulong)((long)(int)wVar11 * 0x16) >> 0x10),0xb4ca,wVar14);
  wVar11 = (wVar11 + (int)uVar21) * 2;
  uVar8 = 0;
  if (*(int *)(wVar11 + 0x4e90) == 0) {
    uVar8 = 0xffff;
  }
  wVar14 = uVar8 & uVar6;
  uVar15 = wVar14 == 0;
  if (!(bool)uVar15) {
    DAT_2000_b63c = 0;
    uVar21 = FUN_1000_58f7();
  }
  uVar21 = qb3f_a7((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4fa,wVar11);
  if ((bool)uVar15) {
    uVar21 = FUN_1000_4abd();
  }
  uVar15 = DAT_2000_b5f0 == 1;
  if ((bool)uVar15) {
    uVar21 = FUN_1000_49f8();
  }
  uVar21 = qb3f_a7((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4fa,wVar11);
  if ((bool)uVar15) {
    FUN_1000_4a17();
    uVar21 = FUN_1000_8fea();
  }
LAB_1000_4819:
  uVar15 = DAT_2000_b54e == 0;
  uVar18 = DAT_2000_b54e == 1;
  if ((bool)uVar18) {
    uVar21 = FUN_1000_58f7();
    DAT_2000_b54e = 0;
  }
  qb3f_9f((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4c6,0xb802);
  if ((bool)uVar15) {
    DAT_2000_b63e = 1;
    FUN_1000_56cc();
  }
  else {
    uVar18 = DAT_2000_b63e == 1;
    if ((bool)uVar18) {
      DAT_2000_b63e = 0;
      FUN_1000_58f7();
      FUN_1000_49b8();
    }
  }
  uVar21 = FUN_1000_4a52();
  uVar21 = qb3f_9f((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb47c,0xb7f6);
  if ((bool)uVar18) {
    uVar15 = 1;
    wVar11 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xb7f6);
    wVar14 = 0x5286;
    uVar21 = qb3e_58(wVar11,0x5286,3,0xb47c,0xb7f6);
  }
  else {
    uVar15 = 0;
  }
  uVar21 = qb3f_9f((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb47c,0xb7d8);
  if ((bool)uVar15) {
    uVar15 = 1;
    wVar11 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xb7d8);
    wVar14 = 0x5298;
    uVar21 = qb3e_58(wVar11,0x5298,3,0xb47c,0xb7d8);
  }
  else {
    uVar15 = 0;
  }
  uVar21 = qb3f_9f((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb47c,0xbb60);
  if ((bool)uVar15) {
    uVar15 = 1;
    wVar11 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xbb60);
    wVar14 = 0x52aa;
    uVar21 = qb3e_58(wVar11,0x52aa,3,0xb47c,0xbb60);
  }
  else {
    uVar15 = 0;
  }
  uVar21 = qb3f_9f((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb47c,0xb802);
  if ((bool)uVar15) {
    wVar11 = qb3e_89(0,DAT_2000_b5f2,DAT_2000_b5f4,0xb47c,0xb802);
    wVar14 = 0x52bc;
    uVar21 = qb3e_58(wVar11,0x52bc,3,0xb47c,0xb802);
  }
  qb3f_75((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4d2,0xb802);
  wVar11 = (word)((long)(int)wVar14 * 0x16);
  uVar21 = qb3f_75(wVar11,wVar14,(word)((ulong)((long)(int)wVar14 * 0x16) >> 0x10),0xb4ca,wVar11);
  iVar10 = wVar14 + (word)uVar21;
  uVar15 = iVar10 < 0;
  wVar11 = iVar10 * 2;
  uVar18 = wVar11 == 0;
  wVar14 = *(word *)(wVar11 + 0x4e90);
  uVar21 = qb3f_57((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4ca,wVar11);
  wVar11 = 0x4e28;
  uVar21 = qb3f_7d((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb4ca,0x4e28);
  uVar21 = qb3f_a7((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0x4e28,0x4e28);
  if (!(bool)uVar18) {
    wVar11 = 0x4e28;
    uVar21 = qb3f_8f((word)uVar21,0x4e28,(word)((ulong)uVar21 >> 0x10),0xb48c,0xbe82);
    uVar21 = qb3f_71((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb48c,0xce48);
    uVar21 = qb3f_81((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb48c,0xce48);
    wVar14 = qb3f_a1((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb48c,wVar11);
    wVar13 = 0;
    if (!(bool)uVar15 && !(bool)uVar18) {
      wVar13 = 0xffff;
    }
    uVar21 = qb3f_7f(wVar14,wVar11,wVar13,0xb7b0,0xb7f6);
    wVar14 = wVar11;
    uVar21 = qb3f_a1((word)uVar21,wVar11,(word)((ulong)uVar21 >> 0x10),0xb7b0,wVar11);
    iVar10 = 0;
    if ((bool)uVar15) {
      iVar10 = -1;
    }
    bVar17 = (int)((ulong)uVar21 >> 0x10) == 0;
    uVar18 = iVar10 == 0 && bVar17;
    if (iVar10 != 0 || !bVar17) {
      uVar21 = FUN_1000_7932();
    }
  }
  wVar14 = qb3f_a7((word)uVar21,wVar14,(word)((ulong)uVar21 >> 0x10),0xb50e,wVar11);
  wVar13 = 0;
  if ((bool)uVar18) {
    wVar13 = 0xffff;
  }
  qb3f_75(wVar14,wVar13,wVar13,0xb4d2,wVar11);
  wVar14 = (word)((long)(int)wVar13 * 0x16);
  uVar6 = extraout_DX_00;
  uVar21 = qb3f_75(wVar14,wVar13,(word)((ulong)((long)(int)wVar13 * 0x16) >> 0x10),0xb4ca,wVar14);
  uVar8 = 0;
  if (0 < *(int *)((wVar13 + (word)uVar21) * 2 + 0x4e90)) {
    uVar8 = 0xffff;
  }
  if ((uVar8 & uVar6) == 0) {
    uVar6 = FUN_1000_49d1();
    return uVar6;
  }
  qb3f_7b((word)uVar21,uVar8 & uVar6,(word)((ulong)uVar21 >> 0x10),0xbc22,0xb4fa);
  uVar6 = FUN_1000_803a();
  return uVar6;
}


// ==== FUN_1000_5417 @ 1000:5417 (size 50) callers: FUN_1000_0636,FUN_1000_3f5a,FUN_1000_3ffc

void FUN_1000_5417(void)

{
  word in_AX;
  word in_DX;
  word dx;
  word in_BX;
  word wVar1;
  word bx;
  word unaff_DI;
  undefined4 uVar2;
  
  qb3f_75(in_AX,in_BX,in_DX,0xb48c,unaff_DI);
  uVar2 = qb3f_75((word)((long)(int)in_BX * 0x15),in_BX,
                  (word)((ulong)((long)(int)in_BX * 0x15) >> 0x10),0xb4d2,unaff_DI);
  wVar1 = in_BX + (word)uVar2;
  uVar2 = qb3f_7b((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),wVar1 * 4 + 0x9b06,0xb64e);
  qb3f_75((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb4ca,0xb64e);
  bx = 0x14 - wVar1;
  DAT_2000_b60c = wVar1;
  uVar2 = qb3f_57(wVar1,bx,dx,0xb4ca,0xb64e);
  uVar2 = qb3f_27((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0xb7d8,0xb64e);
  uVar2 = qb3f_8b((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0xb64e,0xb64e);
  wVar1 = 0x1a;
  uVar2 = qb3d_03((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),0xb64e,0xb64e);
  uVar2 = qb3f_7d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xb64e);
  uVar2 = qb3f_8f((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xbc42);
  wVar1 = 0x1a;
  uVar2 = qb3f_71((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),0xb64e,0xbc42);
  uVar2 = qb3d_03((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xbc42);
  uVar2 = qb3f_9d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xbc42);
  uVar2 = qb3f_ad((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xbc42);
  qb3f_7d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xb50a);
  return;
}


// ==== FUN_1000_5449 @ 1000:5449 (size 66) callers: FUN_1000_54cb

void __cdecl16near FUN_1000_5449(void)

{
  word in_AX;
  word in_DX;
  word wVar1;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  wVar1 = 0x14 - DAT_2000_b60c;
  uVar2 = qb3f_57(in_AX,wVar1,in_DX,unaff_SI,unaff_DI);
  uVar2 = qb3f_27((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb7d8,unaff_DI);
  uVar2 = qb3f_8b((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,unaff_DI);
  wVar1 = 0x1a;
  uVar2 = qb3d_03((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),0xb64e,unaff_DI);
  uVar2 = qb3f_7d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xb64e);
  uVar2 = qb3f_8f((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xbc42);
  wVar1 = 0x1a;
  uVar2 = qb3f_71((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),0xb64e,0xbc42);
  uVar2 = qb3d_03((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xbc42);
  uVar2 = qb3f_9d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xbc42);
  uVar2 = qb3f_ad((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xbc42);
  qb3f_7d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb64e,0xb50a);
  return;
}


// ==== FUN_1000_548b @ 1000:548b (size 64) callers: FUN_1000_30c7,FUN_1000_3192,FUN_1000_3254,FUN_1000_3316

void __cdecl16near FUN_1000_548b(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word wVar1;
  undefined4 uVar2;
  
  uVar2 = qb3f_7f(in_AX,in_BX,in_DX,0xb48c,0xb7d8);
  uVar2 = qb3f_89((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb48c,0xb488);
  uVar2 = qb3f_91((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb48c,0xb5c8);
  uVar2 = qb3f_91((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb48c,0xb5c4);
  uVar2 = qb3f_91((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb48c,0xb5c0);
  uVar2 = qb3f_81((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb48c,0xbe6e);
  wVar1 = 0x1a;
  uVar2 = qb3d_39((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),0xb48c,0xbe6e);
  uVar2 = qb3f_91((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb48c,0xbe6e);
  uVar2 = qb3f_2d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb48c,0xbe6e);
  wVar1 = 0x1a;
  uVar2 = qb3d_03((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),0xb48c,0xbe6e);
  qb3f_7d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb48c,0xb5cc);
  return;
}


// ==== FUN_1000_54cb @ 1000:54cb (size 770) callers: FUN_1000_0636,FUN_1000_3ffc,FUN_1000_803a,FUN_1000_8fea

void __cdecl16near FUN_1000_54cb(void)

{
  word in_AX;
  uint uVar1;
  word wVar2;
  uint uVar3;
  word dx;
  word dx_00;
  word di;
  word in_DX;
  word dx_01;
  word dx_02;
  word extraout_DX;
  word extraout_DX_00;
  uint extraout_DX_01;
  word in_BX;
  word wVar4;
  int unaff_BP;
  word wVar5;
  word unaff_DI;
  undefined2 unaff_SS;
  undefined1 uVar6;
  undefined1 uVar7;
  bool bVar8;
  undefined4 uVar9;
  
  qb3f_75(in_AX,in_BX,in_DX,0xb48c,unaff_DI);
  uVar9 = qb3f_75((word)((long)(int)in_BX * 0x15),in_BX,
                  (word)((ulong)((long)(int)in_BX * 0x15) >> 0x10),0xb4d2,unaff_DI);
  wVar4 = in_BX + (word)uVar9;
  wVar5 = wVar4 * 4 + 0x8366;
  uVar6 = wVar5 == 0;
  qb3f_7b((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),wVar5,0xb64e);
  uVar9 = FUN_1000_5449();
  uVar9 = qb3f_a7((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb50a,0xb64e);
  wVar5 = (word)((ulong)uVar9 >> 0x10);
  if ((bool)uVar6) {
    qb3f_7b((word)uVar9,wVar4,wVar5,0xbc26,0xb4c6);
    return;
  }
  qb3f_75((word)uVar9,wVar4,wVar5,0xb48c,0xb64e);
  DAT_2000_b5de = wVar4;
  qb3f_75(wVar4,wVar4,dx_01,0xb4ca,0xb64e);
  DAT_2000_b60c = wVar4;
  qb3f_75(wVar4,wVar4,dx_02,0xb4d2,0xb64e);
  uVar6 = 0;
  uVar7 = DAT_2000_b5de == 0;
  uVar1 = extraout_DX;
  DAT_2000_b60a = wVar4;
  if (!(bool)uVar7) {
    DAT_2000_b65c = 0;
    uVar9 = FUN_1000_5793();
    uVar9 = qb3f_a7((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb64e);
    wVar5 = (word)((ulong)uVar9 >> 0x10);
    if ((bool)uVar6) {
      qb3f_7b((word)uVar9,wVar4,wVar5,0xbe76,0xb4c6);
      return;
    }
    uVar9 = qb3f_a7((word)uVar9,wVar4,wVar5,0xb4c6,0xb64e);
    wVar5 = (word)((ulong)uVar9 >> 0x10);
    if ((bool)uVar7) {
      uVar9 = qb3f_9f((word)uVar9,wVar4,wVar5,0xb48c,0xbb64);
      wVar5 = (word)((ulong)uVar9 >> 0x10);
      if ((bool)uVar7) {
        qb3f_7b((word)uVar9,wVar4,wVar5,0xbc26,0xb4c6);
        return;
      }
      bVar8 = DAT_2000_b65a == 1;
      if (bVar8) {
        return;
      }
      uVar9 = qb3f_a7((word)uVar9,wVar4,wVar5,0xb48c,0xbb64);
      if (bVar8) {
        return;
      }
      uVar9 = qb3f_9f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4ce,0xb4ca);
      uVar1 = 0;
      if (bVar8) {
        uVar1 = 0xffff;
      }
      bVar8 = false;
      wVar4 = qb3f_9f((word)uVar9,uVar1,(word)((ulong)uVar9 >> 0x10),0xb4d6,0xb4d2);
      uVar3 = 0;
      if (bVar8) {
        uVar3 = 0xffff;
      }
      bVar8 = (uVar3 & uVar1) == 0;
      uVar9 = qb3f_9f(wVar4,uVar1,uVar3 & uVar1,0xb4da,0xb48c);
      uVar1 = (uint)((ulong)uVar9 >> 0x10);
      uVar3 = 0;
      if (bVar8) {
        uVar3 = 0xffff;
      }
      uVar6 = 0;
      uVar7 = (uVar3 & uVar1) == 0;
      if (!(bool)uVar7) {
        return;
      }
      wVar4 = 1;
      uVar9 = qb3e_42((word)uVar9,1,uVar1,0xb4da,0xb48c);
      uVar9 = qb3e_44((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4da,0xb48c);
      uVar9 = qb3f_bc((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4da,0xb48c);
      uVar9 = qb3f_6a((word)uVar9,0xcb84,(word)((ulong)uVar9 >> 0x10),0xb4da,0xb48c);
      wVar4 = 0x12;
      uVar9 = qb3d_0d((word)uVar9,0x12,(word)((ulong)uVar9 >> 0x10),0xb4da,0xb48c);
      uVar9 = qb3f_6e((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4da,0xb48c);
      qb3e_79((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4da,0xb48c);
      uVar9 = FUN_1000_b308();
      uVar9 = qb3f_7f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb48c,0xb7f6);
      wVar5 = 0xb7f6;
      wVar4 = qb3f_7d((word)uVar9,0xb7f6,(word)((ulong)uVar9 >> 0x10),0xb7f6,0xb48c);
      uVar9 = qb3f_7f(wVar4,wVar5,0xb48c,0xb4ca,0xb4d2);
      wVar2 = 0xb4ca;
      qb3f_91((word)uVar9,wVar5,(word)((ulong)uVar9 >> 0x10),0xb4ca,0xbc42);
      wVar4 = 0x1a;
      uVar9 = qb3f_71(wVar5,0x1a,dx,0xb4ca,0xbc42);
      uVar9 = qb3d_03((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4ca,0xbc42);
      wVar4 = 0xbc42;
      uVar9 = qb3f_a1((word)uVar9,0xbc42,(word)((ulong)uVar9 >> 0x10),0xb4ca,0xb7b0);
      dx_00 = (word)((ulong)uVar9 >> 0x10);
      wVar5 = (word)uVar9;
      if ((bool)uVar7) {
        uVar9 = qb3f_7f(wVar5,wVar4,dx_00,dx_00,wVar5);
        di = (word)((ulong)uVar9 >> 0x10);
        uVar9 = qb3f_7d((word)uVar9,wVar4,wVar5,dx_00,di);
        wVar5 = di;
        uVar9 = qb3f_7f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),di,wVar2);
        uVar9 = qb3f_91((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),di,wVar4);
        wVar2 = 0x1a;
        uVar9 = qb3f_71((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),di,wVar4);
        uVar9 = qb3d_03((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),di,wVar4);
        uVar9 = qb3f_a1((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),di,0xb7b8);
        wVar4 = 0;
        if ((bool)uVar7) {
          wVar4 = 0xffff;
        }
        bVar8 = false;
        wVar2 = wVar5;
        uVar9 = qb3f_9f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),wVar5,0xbe76);
        *(word *)(unaff_BP + -6) = wVar4;
        uVar1 = 0;
        if (!(bool)uVar6 && !bVar8) {
          uVar1 = 0xffff;
        }
        wVar4 = uVar1 & *(uint *)(unaff_BP + -6);
        uVar6 = 0;
        uVar7 = wVar4 == 0;
        if ((bool)uVar7) {
          wVar4 = 0;
          uVar6 = 1;
        }
        else {
          uVar9 = qb3f_7f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),wVar5,(word)uVar9);
          uVar9 = qb3f_7d((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),wVar5,wVar2);
          uVar9 = qb3f_8f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),wVar2,0xbc42);
          wVar4 = 0x1a;
          uVar9 = qb3d_03((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),wVar2,0xbc42);
          uVar9 = qb3f_a1((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),wVar2,wVar2);
          wVar4 = 0;
          if ((bool)uVar7) {
            wVar4 = 0xffff;
          }
          bVar8 = false;
          uVar9 = qb3f_9f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),wVar2,0xbe82);
          *(word *)(unaff_BP + -8) = wVar4;
          uVar1 = 0;
          if (!(bool)uVar6 && !bVar8) {
            uVar1 = 0xffff;
          }
          wVar4 = uVar1 & *(uint *)(unaff_BP + -8);
          uVar6 = wVar4 == 0;
          if (!(bool)uVar6) {
            uVar9 = qb3f_7f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),wVar2,(word)uVar9);
            uVar9 = qb3f_7d((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),wVar2,wVar2);
          }
        }
      }
      else {
        uVar6 = 0;
      }
      uVar9 = qb3f_7b((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xcb9e,0xb4c6);
      uVar9 = qb3f_7b((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xcba2,0xb4fa);
      uVar9 = qb3f_7b((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4ca,0xb4ce);
      uVar9 = qb3f_7b((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4d2,0xb4d6);
      qb3f_7b((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb48c,0xb4da);
      DAT_2000_b538 = 1;
      uVar9 = FUN_1000_2fcb();
      qb3f_9f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb50e,0xb7f6);
      if ((bool)uVar6) {
        DAT_2000_b5d8 = 1;
        return;
      }
      FUN_1000_4c28();
      return;
    }
    qb3f_9f((word)uVar9,wVar4,wVar5,0xb4c6,0xb7fe);
    uVar1 = extraout_DX_00;
    if ((bool)uVar6 || (bool)uVar7) {
      uVar9 = FUN_1000_5649();
      uVar9 = qb3f_af((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb7fe);
      qb3f_7d((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb4c6);
      return;
    }
  }
  DAT_2000_b65c = 1;
  do {
    if (3 < (int)DAT_2000_b65c) {
      qb3f_7b(DAT_2000_b65c,wVar4,uVar1,0xbc26,0xb4c6);
      return;
    }
    uVar1 = DAT_2000_b65c + DAT_2000_b5de;
    uVar6 = uVar1 < 0x46;
    uVar7 = uVar1 == 0x46;
    if (0x46 < (int)uVar1) {
      return;
    }
    uVar9 = FUN_1000_5793();
    uVar9 = qb3f_9f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb7f6);
    wVar4 = 0;
    if ((bool)uVar6) {
      wVar4 = 0xffff;
      uVar7 = 0;
    }
    wVar5 = 0xb7fe;
    qb3f_9f((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb7fe);
    uVar1 = 0;
    if (!(bool)uVar6 && !(bool)uVar7) {
      uVar1 = 0xffff;
    }
    uVar1 = uVar1 | wVar4;
    if (uVar1 == 0) {
      uVar9 = FUN_1000_5649();
      uVar6 = 0;
      uVar7 = DAT_2000_b5de == 0;
      if ((bool)uVar7) {
        uVar9 = qb3f_57((word)uVar9,0,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb7fe);
        wVar4 = DAT_2000_b65c;
        uVar9 = qb3f_71((word)uVar9,DAT_2000_b65c,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb7fe);
        uVar9 = qb3f_57((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb7fe);
        uVar9 = qb3f_71((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb7fe);
        uVar9 = qb3f_85((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb7fe);
        uVar9 = qb3f_99((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb4c6);
        wVar4 = 0xb4c6;
        wVar5 = 0xb7f6;
        uVar9 = qb3f_a1((word)uVar9,0xb4c6,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb7f6);
        if ((bool)uVar6) {
          qb3f_7b((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb7b8,wVar4);
          return;
        }
      }
      wVar4 = DAT_2000_b65c;
      uVar9 = qb3f_57((word)uVar9,DAT_2000_b65c,(word)((ulong)uVar9 >> 0x10),0xb4c6,wVar5);
      qb3f_a1((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0xb4c6,0xb4c6);
      uVar1 = extraout_DX_01;
      if ((bool)uVar7) {
        return;
      }
    }
    DAT_2000_b65c = DAT_2000_b65c + 1;
  } while( true );
}


// ==== FUN_1000_5649 @ 1000:5649 (size 51) callers: FUN_1000_54cb

void __cdecl16near FUN_1000_5649(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar1;
  
  uVar1 = qb3f_9f(in_AX,in_BX,in_DX,0xb4c6,0xbb60);
  if (!(bool)in_CF && !(bool)in_ZF) {
    uVar1 = qb3f_7f((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb4c6,0xc2d8);
    uVar1 = qb3f_7d((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb4c6,0xb4c6);
  }
  uVar1 = qb3f_9f((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb4c6,0xbb60);
  if (!(bool)in_CF && !(bool)in_ZF) {
    uVar1 = qb3f_7f((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb4c6,0xc2d8);
    qb3f_7d((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb4c6,0xb4c6);
  }
  return;
}


// ==== FUN_1000_567c @ 1000:567c (size 80) callers: FUN_1000_0636

void __cdecl16near FUN_1000_567c(void)

{
  word in_AX;
  word in_DX;
  word wVar1;
  undefined1 *bx;
  word bx_00;
  undefined *puVar2;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar3;
  
  DAT_2000_b63e = 1;
  uVar3 = qb3e_42(in_AX,0x19,in_DX,unaff_SI,unaff_DI);
  wVar1 = 0x16;
  uVar3 = qb3e_44((word)uVar3,0x16,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3f_bc((word)uVar3,wVar1,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  bx = (undefined1 *)&lit_False_floor;
  uVar3 = qb3f_6a((word)uVar3,0xcec8,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3e_79((word)uVar3,(word)bx,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3e_42((word)uVar3,0xf,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  bx_00 = 0x1d;
  uVar3 = qb3e_44((word)uVar3,0x1d,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = qb3f_bc((word)uVar3,bx_00,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  puVar2 = (undefined *)&lit_D_GO;
  uVar3 = qb3f_6e(wVar1,0xcede,bx_00,unaff_SI,unaff_DI);
  uVar3 = qb3e_79((word)uVar3,(word)puVar2,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  uVar3 = qb3e_42((word)uVar3,0x10,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = (word)((ulong)uVar3 >> 0x10);
  uVar3 = qb3e_44((word)uVar3,wVar1,wVar1,unaff_SI,unaff_DI);
  uVar3 = qb3f_bc((word)uVar3,wVar1,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  puVar2 = (undefined *)&lit_DOWN;
  uVar3 = qb3f_6e((word)uVar3,0xcee6,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar3,(word)puVar2,(word)((ulong)uVar3 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_56cc @ 1000:56cc (size 199) callers: FUN_1000_4275,FUN_1000_8fea

void __cdecl16near FUN_1000_56cc(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word in_BX;
  word wVar2;
  undefined1 *puVar3;
  word wVar4;
  undefined *puVar5;
  word unaff_DI;
  undefined1 uVar6;
  undefined4 uVar7;
  
  qb3f_75(in_AX,in_BX,in_DX,0xb4d2,unaff_DI);
  wVar1 = (word)((long)(int)in_BX * 0x16);
  uVar7 = qb3f_75(wVar1,in_BX,(word)((ulong)((long)(int)in_BX * 0x16) >> 0x10),0xb4ca,wVar1);
  wVar1 = (in_BX + (word)uVar7) * 2;
  uVar6 = 0;
  if (*(int *)(wVar1 + 0x4e90) < 1) {
    uVar7 = qb3e_42((word)uVar7,0x19,(word)((ulong)uVar7 >> 0x10),0xb4ca,wVar1);
    wVar2 = 0x16;
    uVar7 = qb3e_44((word)uVar7,0x16,(word)((ulong)uVar7 >> 0x10),0xb4ca,wVar1);
    uVar7 = qb3f_bc((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0xb4ca,wVar1);
    puVar3 = (undefined1 *)&lit_Ladder_going;
    uVar7 = qb3f_6a((word)uVar7,0xceee,(word)((ulong)uVar7 >> 0x10),0xb4ca,wVar1);
    uVar7 = qb3e_79((word)uVar7,(word)puVar3,(word)((ulong)uVar7 >> 0x10),0xb4ca,wVar1);
    uVar7 = qb3f_a7((word)uVar7,(word)puVar3,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
    wVar2 = (word)((ulong)uVar7 >> 0x10);
    if ((bool)uVar6) {
      uVar7 = qb3f_bc((word)uVar7,(word)puVar3,wVar2,0xb4c6,wVar1);
      puVar3 = (undefined1 *)&lit_up;
      uVar7 = qb3f_6a((word)uVar7,0xcf00,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      uVar7 = qb3e_79((word)uVar7,(word)puVar3,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      uVar7 = qb3e_42((word)uVar7,0xf,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      wVar4 = 0x1d;
      uVar7 = qb3e_44((word)uVar7,0x1d,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      wVar2 = qb3f_bc((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      puVar3 = (undefined1 *)&lit_U_GO;
      uVar7 = qb3f_6e(wVar2,0xcf0a,wVar4,0xb4c6,wVar1);
      uVar7 = qb3e_79((word)uVar7,(word)puVar3,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      uVar7 = qb3e_42((word)uVar7,0x10,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      wVar2 = (word)((ulong)uVar7 >> 0x10);
      uVar7 = qb3e_44((word)uVar7,wVar2,wVar2,0xb4c6,wVar1);
      uVar7 = qb3f_bc((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      puVar3 = (undefined1 *)&lit_UP;
      uVar7 = qb3f_6e((word)uVar7,0xcf12,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      qb3e_79((word)uVar7,(word)puVar3,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
    }
    else {
      uVar7 = qb3f_bc((word)uVar7,(word)puVar3,wVar2,0xb4c6,wVar1);
      puVar3 = (undefined1 *)&lit_down;
      uVar7 = qb3f_6a((word)uVar7,0xcf1a,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      uVar7 = qb3e_79((word)uVar7,(word)puVar3,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      uVar7 = qb3e_42((word)uVar7,0xf,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      wVar4 = 0x1d;
      uVar7 = qb3e_44((word)uVar7,0x1d,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      wVar2 = qb3f_bc((word)uVar7,wVar4,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      puVar5 = (undefined *)&lit_D_GO;
      uVar7 = qb3f_6e(wVar2,0xcede,wVar4,0xb4c6,wVar1);
      uVar7 = qb3e_79((word)uVar7,(word)puVar5,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      uVar7 = qb3e_42((word)uVar7,0x10,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      wVar2 = (word)((ulong)uVar7 >> 0x10);
      uVar7 = qb3e_44((word)uVar7,wVar2,wVar2,0xb4c6,wVar1);
      uVar7 = qb3f_bc((word)uVar7,wVar2,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      puVar5 = (undefined *)&lit_DOWN;
      uVar7 = qb3f_6e((word)uVar7,0xcee6,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
      qb3e_79((word)uVar7,(word)puVar5,(word)((ulong)uVar7 >> 0x10),0xb4c6,wVar1);
    }
    return;
  }
  return;
}


// ==== FUN_1000_5793 @ 1000:5793 (size 124) callers: FUN_1000_54cb

void __cdecl16near FUN_1000_5793(void)

{
  word in_AX;
  word in_DX;
  word dx;
  word wVar1;
  word bx;
  word bx_00;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  wVar1 = DAT_2000_b60c + 7;
  uVar2 = qb3f_57(in_AX,wVar1,in_DX,unaff_SI,unaff_DI);
  uVar2 = qb3f_25((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xcf24);
  wVar1 = DAT_2000_b60a + 6;
  uVar2 = qb3f_71((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xcf24);
  uVar2 = qb3f_57((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xcf24);
  uVar2 = qb3f_25((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xbb74);
  qb3f_95((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xbb74);
  wVar1 = DAT_2000_b65c + DAT_2000_b5de + 1;
  uVar2 = qb3f_71(wVar1,wVar1,dx,unaff_SI,0xbb74);
  uVar2 = qb3f_57((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xbb74);
  uVar2 = qb3f_25((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xbb70);
  uVar2 = qb3f_95((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xbb70);
  uVar2 = qb3f_7d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xb4c6);
  uVar2 = qb3f_87((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb4c6,0xcf28);
  wVar1 = 0x1a;
  uVar2 = qb3f_71((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),0xb4c6,0xcf28);
  wVar1 = qb3d_03((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb4c6,0xcf28);
  bx = 0xb4c6;
  uVar2 = qb3f_9d(wVar1,0xb4c6,0xcf28,0xb4c6,0xcf28);
  wVar1 = (word)((ulong)uVar2 >> 0x10);
  uVar2 = qb3f_91((word)uVar2,bx,wVar1,0xb4c6,wVar1);
  wVar1 = qb3f_81((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0xb4c6,0xc2d8);
  bx_00 = 0x1a;
  uVar2 = qb3d_03(wVar1,0x1a,bx,0xb4c6,0xc2d8);
  wVar1 = (word)((ulong)uVar2 >> 0x10);
  qb3f_7d((word)uVar2,bx_00,wVar1,0xb4c6,wVar1);
  return;
}


// ==== FUN_1000_580f @ 1000:580f (size 40) callers: FUN_1000_593c,FUN_1000_803a

void FUN_1000_580f(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  int iVar2;
  word wVar3;
  int unaff_BP;
  word unaff_SI;
  word unaff_DI;
  undefined2 unaff_SS;
  undefined1 in_CF;
  undefined4 uVar4;
  
  wVar1 = DAT_2000_b65e;
  uVar4 = qb3f_57(in_AX,DAT_2000_b65e,in_DX,unaff_SI,unaff_DI);
  uVar4 = qb3f_99((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),unaff_SI,0xb47c);
  uVar4 = qb3f_7d((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),unaff_SI,0x52fc);
  uVar4 = qb3f_a7((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),0x52fc,0x52fc);
  if (!(bool)in_CF) {
    FUN_1000_5837();
    return;
  }
  uVar4 = qb3f_7f((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb802);
  uVar4 = qb3f_7d((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),0x52fc,0x52fc);
  wVar1 = qb3f_7f((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb7f6);
  iVar2 = 0x52fc;
  qb3f_77(wVar1,0x52fc,0x52fc,0x52fc,0xb7f6);
  wVar1 = qb3e_89(0xffff,iVar2 * 4 + 0x1a06,iVar2 * 4 + 0x1a26,0x52fc,0xb7f6);
  wVar3 = 0x52f2;
  uVar4 = qb3e_58(wVar1,0x52f2,0xff03,0x52fc,0xb7f6);
  uVar4 = qb3f_7f((word)uVar4,wVar3,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb7d8);
  iVar2 = 0x52fc;
  wVar1 = qb3f_77((word)uVar4,0x52fc,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb7d8);
  *(int *)(unaff_BP + -6) = iVar2 * 4;
  *(int *)(unaff_BP + -8) = iVar2 * 4 + 0x1a26;
  wVar1 = qb3e_89(wVar1,*(int *)(unaff_BP + -6) + 0x1a06,*(word *)(unaff_BP + -8),0x52fc,0xb7d8);
  wVar3 = 0x530a;
  uVar4 = qb3e_58(wVar1,0x530a,3,0x52fc,0xb7d8);
  uVar4 = qb3f_7f((word)uVar4,wVar3,(word)((ulong)uVar4 >> 0x10),0x52fc,0xbb60);
  iVar2 = 0x52fc;
  wVar1 = qb3f_77((word)uVar4,0x52fc,(word)((ulong)uVar4 >> 0x10),0x52fc,0xbb60);
  *(int *)(unaff_BP + -10) = iVar2 * 4;
  *(int *)(unaff_BP + -0xc) = iVar2 * 4 + 0x1a26;
  wVar1 = qb3e_89(wVar1,*(int *)(unaff_BP + -10) + 0x1a06,*(word *)(unaff_BP + -0xc),0x52fc,0xbb60);
  wVar3 = 0x58d4;
  uVar4 = qb3e_58(wVar1,0x58d4,3,0x52fc,0xbb60);
  uVar4 = qb3f_7f((word)uVar4,wVar3,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb802);
  wVar1 = qb3f_77((word)uVar4,wVar3,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb802);
  wVar1 = qb3e_89(wVar1,wVar3 * 4 + 0x1a06,wVar3 * 4 + 0x1a26,0x52fc,0xb802);
  qb3e_58(wVar1,0x5300,0xff03,0x52fc,0xb802);
  return;
}


// ==== FUN_1000_5837 @ 1000:5837 (size 192) callers: FUN_1000_19f7,FUN_1000_580f,FUN_1000_593c

void __cdecl16near FUN_1000_5837(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word in_BX;
  int iVar2;
  word wVar3;
  int unaff_BP;
  undefined2 unaff_SS;
  undefined4 uVar4;
  
  wVar1 = qb3f_7f(in_AX,in_BX,in_DX,0x52fc,0xb7f6);
  iVar2 = 0x52fc;
  qb3f_77(wVar1,0x52fc,0x52fc,0x52fc,0xb7f6);
  wVar1 = qb3e_89(0xffff,iVar2 * 4 + 0x1a06,iVar2 * 4 + 0x1a26,0x52fc,0xb7f6);
  wVar3 = 0x52f2;
  uVar4 = qb3e_58(wVar1,0x52f2,0xff03,0x52fc,0xb7f6);
  uVar4 = qb3f_7f((word)uVar4,wVar3,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb7d8);
  iVar2 = 0x52fc;
  wVar1 = qb3f_77((word)uVar4,0x52fc,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb7d8);
  *(int *)(unaff_BP + -6) = iVar2 * 4;
  *(int *)(unaff_BP + -8) = iVar2 * 4 + 0x1a26;
  wVar1 = qb3e_89(wVar1,*(int *)(unaff_BP + -6) + 0x1a06,*(word *)(unaff_BP + -8),0x52fc,0xb7d8);
  wVar3 = 0x530a;
  uVar4 = qb3e_58(wVar1,0x530a,3,0x52fc,0xb7d8);
  uVar4 = qb3f_7f((word)uVar4,wVar3,(word)((ulong)uVar4 >> 0x10),0x52fc,0xbb60);
  iVar2 = 0x52fc;
  wVar1 = qb3f_77((word)uVar4,0x52fc,(word)((ulong)uVar4 >> 0x10),0x52fc,0xbb60);
  *(int *)(unaff_BP + -10) = iVar2 * 4;
  *(int *)(unaff_BP + -0xc) = iVar2 * 4 + 0x1a26;
  wVar1 = qb3e_89(wVar1,*(int *)(unaff_BP + -10) + 0x1a06,*(word *)(unaff_BP + -0xc),0x52fc,0xbb60);
  wVar3 = 0x58d4;
  uVar4 = qb3e_58(wVar1,0x58d4,3,0x52fc,0xbb60);
  uVar4 = qb3f_7f((word)uVar4,wVar3,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb802);
  wVar1 = qb3f_77((word)uVar4,wVar3,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb802);
  wVar1 = qb3e_89(wVar1,wVar3 * 4 + 0x1a06,wVar3 * 4 + 0x1a26,0x52fc,0xb802);
  qb3e_58(wVar1,0x5300,0xff03,0x52fc,0xb802);
  return;
}


// ==== FUN_1000_58f7 @ 1000:58f7 (size 69) callers: FUN_1000_4275,FUN_1000_593c,FUN_1000_8f6a,FUN_1000_8fea

void __cdecl16near FUN_1000_58f7(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word in_BX;
  word bx;
  word unaff_DI;
  word di;
  undefined4 uVar2;
  
  qb3f_75(in_AX,in_BX,in_DX,0xb4d2,unaff_DI);
  wVar1 = (word)((long)(int)in_BX * 0x16);
  wVar1 = qb3f_75(wVar1,in_BX,(word)((ulong)((long)(int)in_BX * 0x16) >> 0x10),0xb4ca,wVar1);
  di = (in_BX + wVar1) * 2;
  if (*(int *)(di + 0x4e90) == 0) {
    wVar1 = qb3e_72(wVar1,0xd6,0x6f,0xb4ca,di);
    wVar1 = qb3e_73(wVar1,0x10a,0x88,0xb4ca,di);
    bx = 0;
    uVar2 = qb3e_74(wVar1,0,0xffff,0xb4ca,di);
    qb3e_75((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0xb4ca,di);
  }
  return;
}


// ==== FUN_1000_593c @ 1000:593c (size 3508) callers: FUN_1000_0cd2,FUN_1000_3b16,FUN_1000_4275,FUN_1000_4c28

/* WARNING: Instruction at (ram,0x00015bfc) overlaps instruction at (ram,0x00015bfb)
    */
/* WARNING: Control flow encountered bad instruction data */

void FUN_1000_593c(void)

{
  int *piVar1;
  char *pcVar2;
  long lVar3;
  code *pcVar4;
  word in_AX;
  word wVar5;
  undefined2 uVar6;
  undefined2 *di;
  word dx;
  word dx_00;
  word dx_01;
  undefined2 extraout_DX;
  word dx_02;
  word extraout_DX_00;
  int extraout_DX_01;
  word extraout_DX_02;
  uint extraout_DX_03;
  word dx_03;
  int iVar7;
  word dx_04;
  int iVar8;
  word si;
  word di_00;
  word dx_05;
  word dx_06;
  word wVar9;
  uint uVar10;
  word wVar11;
  uint uVar12;
  word wVar13;
  int iVar14;
  int iVar15;
  undefined2 *unaff_BP;
  word unaff_SI;
  word si_00;
  word unaff_DI;
  word wVar16;
  undefined2 unaff_SS;
  byte bVar17;
  byte in_AF;
  undefined1 uVar18;
  char cVar19;
  bool bVar20;
  undefined1 uVar21;
  bool bVar22;
  char cVar23;
  char cVar24;
  bool bVar25;
  unkbyte10 in_ST0;
  unkbyte10 in_ST1;
  unkbyte10 in_ST2;
  unkbyte10 in_ST3;
  unkbyte10 in_ST4;
  unkbyte10 in_ST5;
  unkbyte10 in_ST6;
  unkbyte10 in_ST7;
  unkbyte10 Var26;
  undefined4 uVar27;
  undefined2 *puVar28;
  ulong uVar29;
  word in_stack_00000000;
  
  wVar9 = 0;
  if (DAT_2000_b538 == 1) {
    wVar9 = 0xffff;
  }
  uVar18 = 0;
  wVar11 = DAT_2000_b660;
  uVar27 = qb3f_57(in_AX,DAT_2000_b660,wVar9,unaff_SI,unaff_DI);
  uVar27 = qb3f_a1((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),unaff_SI,0xb48c);
  uVar12 = (uint)((ulong)uVar27 >> 0x10);
  uVar10 = 0;
  if ((bool)uVar18) {
    uVar10 = 0xffff;
  }
  uVar18 = (uVar10 & uVar12) == 0;
  if (!(bool)uVar18) {
    qb3f_7b((word)uVar27,uVar10 & uVar12,uVar12,0xb7ee,0x52fc);
    FUN_1000_5837();
    return;
  }
  wVar9 = DAT_2000_b662;
  uVar27 = qb3f_57((word)uVar27,DAT_2000_b662,uVar12,unaff_SI,0xb48c);
  wVar9 = qb3f_a1((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),unaff_SI,0xb4ca);
  wVar11 = 0;
  if ((bool)uVar18) {
    wVar11 = 0xffff;
  }
  uVar18 = 0;
  wVar13 = DAT_2000_b664;
  uVar27 = qb3f_57(wVar9,DAT_2000_b664,wVar11,unaff_SI,0xb4ca);
  uVar27 = qb3f_a1((word)uVar27,wVar13,(word)((ulong)uVar27 >> 0x10),unaff_SI,0xb4d2);
  uVar12 = 0;
  if ((bool)uVar18) {
    uVar12 = 0xffff;
  }
  uVar12 = uVar12 & (uint)((ulong)uVar27 >> 0x10);
  uVar18 = uVar12 == 0;
  wVar9 = DAT_2000_b660;
  uVar27 = qb3f_57((word)uVar27,DAT_2000_b660,uVar12,unaff_SI,0xb4d2);
  uVar27 = qb3f_a1((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),unaff_SI,0xb48c);
  uVar12 = (uint)((ulong)uVar27 >> 0x10);
  uVar10 = 0;
  if ((bool)uVar18) {
    uVar10 = 0xffff;
  }
  wVar9 = uVar10 & uVar12;
  uVar18 = wVar9 == 0;
  if (!(bool)uVar18) {
    FUN_1000_580f();
    return;
  }
  qb3f_75((word)uVar27,0,uVar12,0xb4ca,0xb48c);
  DAT_2000_b662 = wVar9;
  qb3f_75(wVar9,wVar9,dx,0xb4d2,0xb48c);
  DAT_2000_b664 = wVar9;
  qb3f_75(wVar9,wVar9,dx_00,0xb48c,0xb48c);
  wVar11 = 0xb47c;
  DAT_2000_b660 = wVar9;
  qb3f_75(wVar9,0xb47c,0xb47c,0xb47c,0xb48c);
  DAT_2000_b65e = wVar11;
  uVar27 = qb3f_7b(wVar11,wVar11,dx_01,dx_01,0xb666);
  uVar27 = qb3f_7b((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb7ee,0xb66a);
  uVar27 = qb3f_7b((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb7ee,0xb66e);
  do {
    uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb66e,0xb7f6);
    if ((bool)uVar18) {
      qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb47c,0xb7f6);
      uVar27 = CONCAT22(extraout_DX,wVar11);
      DAT_2000_b65e = wVar11;
    }
    qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xb7f6);
    DAT_2000_b60c = wVar11;
    wVar9 = qb3f_75(wVar11,wVar11,dx_02,0xb4d2,0xb7f6);
    DAT_2000_b60a = wVar11;
    uVar27 = qb3f_75(wVar11,wVar9,wVar9,0xb48c,0xb7f6);
    iVar14 = (int)((ulong)uVar27 >> 0x10);
    lVar3 = (long)(int)uVar27 * 0x16;
    wVar11 = (int)lVar3 + iVar14;
    wVar13 = 0;
    if (*(int *)(wVar11 * 2 + 0x4e90) == 0) {
      wVar13 = 0xffff;
    }
    bVar20 = false;
    DAT_2000_b5de = wVar9;
    uVar12 = qb3f_9f(wVar11,wVar13,(word)((ulong)lVar3 >> 0x10),0xb50e,0xb7f6);
    uVar10 = 0;
    if (bVar20) {
      uVar10 = 0xffff;
    }
    uVar18 = (uVar10 & wVar13) == 0;
    if ((bool)uVar18) {
      uVar29 = (ulong)uVar12;
    }
    else {
      uVar29 = FUN_1000_58f7();
    }
    qb3f_9f((word)uVar29,wVar13,(word)(uVar29 >> 0x10),0xb50e,0xb7f6);
    wVar9 = 0;
    if ((bool)uVar18) {
      wVar9 = 0xffff;
    }
    wVar11 = (DAT_2000_b60a * 0x16 + DAT_2000_b60c) * 2;
    uVar12 = 0;
    if (*(int *)(wVar11 + 0x4e90) != 0) {
      uVar12 = 0xffff;
    }
    if ((uVar12 & wVar9) == 0) {
      uVar29 = (ulong)(DAT_2000_b60a * 0x16);
    }
    else {
      uVar29 = FUN_1000_49b8();
    }
    uVar27 = qb3f_75((word)uVar29,wVar9,(word)(uVar29 >> 0x10),0xb666,wVar11);
    wVar13 = wVar9 * 8 + 0x198a;
    qb3f_7c((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xc1c2,wVar13);
    wVar11 = extraout_DX_00;
    wVar16 = in_stack_00000000;
    for (DAT_2000_b5e4 = 1; wVar5 = DAT_2000_b5e4, in_stack_00000000 = wVar16,
        (int)DAT_2000_b5e4 < 7; DAT_2000_b5e4 = DAT_2000_b5e4 + 1) {
      wVar5 = DAT_2000_b5e4 - 1;
      wVar13 = wVar5 * 2;
      uVar12 = ((undefined2 *)&DAT_2000_1f82)[wVar5];
      bVar17 = uVar12 < 5;
      cVar24 = SBORROW2(uVar12,5);
      cVar23 = (int)(uVar12 - 5) < 0;
      cVar19 = uVar12 == 5;
      if (5 < (int)uVar12) break;
      si_00 = 0xb666;
      uVar27 = qb3f_75(wVar5,wVar9,wVar11,0xb666,wVar13);
      uVar29 = qb3f_5e((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,wVar13);
      iVar14 = iVar14 + -1;
      if (iVar14 != 0 && cVar19 != '\0') goto LAB_1000_5b35;
      if (cVar24 == cVar23) goto LAB_1000_5b39;
      unaff_BP[-0x2e] = unaff_BP[-0x2e] | wVar9;
      wVar9 = qb3f_57((word)uVar29,DAT_2000_b60c,(word)(uVar29 >> 0x10),0xb666,wVar16);
      wVar11 = (DAT_2000_b60a - DAT_2000_b5e4) + 1;
      uVar27 = qb3f_71(wVar9,wVar11,DAT_2000_b60a - DAT_2000_b5e4,0xb666,wVar16);
      uVar27 = qb3f_57((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb666,wVar16);
      uVar27 = qb3f_95((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb666,wVar16);
      wVar9 = DAT_2000_b5de + 2;
      uVar27 = qb3f_71((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,wVar16);
      uVar27 = qb3f_57((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,wVar16);
      uVar27 = qb3f_95((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,wVar16);
      wVar9 = DAT_2000_b5ee;
      uVar27 = qb3f_71((word)uVar27,DAT_2000_b5ee,(word)((ulong)uVar27 >> 0x10),0xb666,wVar16);
      uVar27 = qb3f_57((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,wVar16);
      in_stack_00000000 = 0x5b1e;
      uVar6 = qb3f_8d((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,wVar16);
      in_AF = 9 < ((byte)uVar6 & 0xf) | in_AF;
      uVar12 = CONCAT11((char)((uint)uVar6 >> 8) - in_AF,(byte)uVar6 + in_AF * -6) & 0xff0f;
code_r0x00015b2c:
      in_AF = 9 < ((byte)uVar12 & 0xf) | in_AF;
      bVar17 = (byte)uVar12 + in_AF * -6 & 0xf;
      cVar19 = (char)(uVar12 >> 8) - in_AF;
      pcVar4 = (code *)swi(0x3f);
      uVar27 = (*pcVar4)();
      uVar29 = CONCAT22((int)((ulong)uVar27 >> 0x10),(int)uVar27 + -0x1abb);
      iVar14 = CONCAT11(cVar19 + bVar17,bVar17);
      wVar13 = wVar16;
LAB_1000_5b35:
      cVar19 = (int)uVar29 == -0x32fd;
      bVar17 = 9 < ((byte)uVar29 & 0xf) | in_AF;
      uVar29 = CONCAT22((int)(uVar29 >> 0x10),
                        CONCAT11((char)(uVar29 >> 8) - bVar17,(byte)uVar29 + bVar17 * -6)) &
               0xffffff0f;
      in_AF = bVar17;
LAB_1000_5b39:
      wVar11 = (word)(uVar29 >> 0x10);
      if (!(bool)bVar17 && !(bool)cVar19) {
        unaff_BP = (undefined2 *)&DAT_2000_1f82;
        wVar5 = (int)uVar29 + 0x37e;
        break;
      }
      uVar18 = in(0xb5);
      uVar6 = CONCAT11((char)(uVar29 >> 8),uVar18);
      uVar27 = CONCAT22(wVar11,uVar6);
      wVar16 = wVar13 * 2;
      ((undefined2 *)&DAT_2000_1f82)[wVar13] = wVar9;
      if (wVar11 == 0) {
        ((undefined2 *)&DAT_2000_1f82)[wVar13] = 8;
        uVar27 = CONCAT22(wVar11,uVar6);
      }
      while( true ) {
        wVar11 = (word)((ulong)uVar27 >> 0x10);
        if (DAT_2000_b5e4 == 1) break;
        wVar16 = DAT_2000_b5e4 * 4 + 0x1f62;
        uVar27 = qb3f_57((word)uVar27,DAT_2000_b60c,DAT_2000_b5e4,si_00,wVar16);
        wVar11 = (word)((ulong)uVar27 >> 0x10);
        wVar9 = (DAT_2000_b60a - wVar11) + 1;
        uVar27 = qb3f_71((word)uVar27,wVar9,wVar11,si_00,wVar16);
LAB_1000_5b7f:
        uVar27 = qb3f_57((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),si_00,wVar16);
        wVar11 = wVar16;
        wVar13 = qb3f_95((word)uVar27,wVar16,(word)((ulong)uVar27 >> 0x10),si_00,wVar16);
        wVar9 = DAT_2000_b5de + 2;
        uVar29 = qb3f_71(wVar13,wVar9,wVar11,si_00,wVar16);
code_r0x00015b95:
        uVar27 = qb3f_57((word)uVar29,wVar9,(word)(uVar29 >> 0x10),si_00,wVar16);
        uVar27 = qb3f_95((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),si_00,wVar16);
code_r0x00015b9c:
        uVar27 = qb3f_ad((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),si_00,wVar16);
        wVar9 = DAT_2000_b5ee;
        uVar27 = qb3f_71((word)uVar27,DAT_2000_b5ee,(word)((ulong)uVar27 >> 0x10),si_00,wVar16);
        uVar27 = qb3f_57((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),si_00,wVar16);
        bVar17 = qb3f_8d((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),si_00,wVar16);
        in_AF = 9 < (bVar17 & 0xf) | in_AF;
        bVar17 = bVar17 + in_AF * -6 & 0xf;
        while( true ) {
          in_AF = 9 < (bVar17 & 0xf) | in_AF;
          bVar17 = bVar17 + in_AF * -6 & 0xf;
          pcVar4 = (code *)swi(0x3f);
          iVar14 = (*pcVar4)();
          cVar23 = SBORROW2(iVar14 + -0x1abb,-0x74fd);
          cVar19 = iVar14 + 0x5a42 < 0;
          pcVar4 = (code *)swi(0x3f);
          uVar27 = (*pcVar4)();
          if (cVar23 == cVar19) break;
          *(int *)(si_00 + 3) = *(int *)(si_00 + 3) + si_00;
          while( true ) {
            wVar11 = DAT_2000_b5e4;
            wVar16 = DAT_2000_b5e4 * 4 + 0x1f42;
            pcVar4 = (code *)swi(0x3f);
            wVar13 = DAT_2000_b60c;
            (*pcVar4)();
            bVar20 = SCARRY2(DAT_2000_b60a - extraout_DX_01,1);
            wVar9 = (DAT_2000_b60a - extraout_DX_01) + 1;
            pcVar4 = (code *)swi(0x3f);
            uVar27 = (*pcVar4)();
            if (!bVar20) goto LAB_1000_5b7f;
            pcVar4 = (code *)swi(0x3f);
            (*pcVar4)();
            pcVar4 = (code *)swi(0x3f);
            puVar28 = (undefined2 *)(*pcVar4)();
            uVar12 = (uint)((ulong)puVar28 >> 0x10);
            unaff_BP = (undefined2 *)puVar28;
            *(byte *)(unaff_BP + wVar11 * 2 + -0x154) =
                 *(byte *)(unaff_BP + wVar11 * 2 + -0x154) | 0xb5;
            bVar20 = 0xfffd < uVar12;
            bVar25 = SCARRY2(uVar12,2);
            wVar9 = uVar12 + 2;
            bVar22 = wVar9 == 0;
            pcVar4 = (code *)swi(0x3f);
            uVar27 = (*pcVar4)();
            uVar12 = (uint)uVar27;
            if (!bVar25) {
              wVar16 = 0xe876;
              if (!bVar20 && !bVar22) goto code_r0x00015b9c;
              goto code_r0x00015b2c;
            }
            pcVar4 = (code *)swi(0x3f);
            (*pcVar4)();
            pcVar4 = (code *)swi(0x3f);
            uVar27 = (*pcVar4)();
            unaff_BP = (undefined2 *)((uint)uVar27 | 0xad3f);
            piVar1 = unaff_BP + wVar11 * 2 + 0x6b0;
            iVar14 = *piVar1;
            *piVar1 = *piVar1 + wVar13;
            in_AF = 9 < ((byte)puVar28 & 0xf) | in_AF;
            uVar29 = CONCAT22((int)((ulong)uVar27 >> 0x10),
                              CONCAT11((char)((ulong)puVar28 >> 8) - in_AF,
                                       (byte)puVar28 + in_AF * -6)) & 0xffffff0f;
            if (!SCARRY2(iVar14,wVar13)) break;
            pcVar4 = (code *)swi(0x3f);
            (*pcVar4)();
            pcVar4 = (code *)swi(0x3f);
            (*pcVar4)();
            iVar14 = (int)unaff_BP + si_00 + 0x6ebf;
            si_00 = 0x3fcd;
            bVar17 = (byte)iVar14;
            in_AF = 9 < (bVar17 & 0xf) | in_AF;
            bVar17 = bVar17 + in_AF * -6 & 0xf;
            cVar19 = (char)((uint)iVar14 >> 8) - in_AF;
            pcVar4 = (code *)swi(0x3f);
            iVar8 = (*pcVar4)();
            iVar14 = CONCAT11(cVar19 + bVar17,bVar17);
            cVar24 = SBORROW2(iVar8 + -0x1abb,-0x74fd);
            cVar23 = iVar8 + 0x5a42 < 0;
            pcVar4 = (code *)swi(0x3f);
            (*pcVar4)();
            cVar19 = (char)(wVar9 >> 8);
            if (cVar24 == cVar23) {
              unaff_BP = (undefined2 *)((int)unaff_BP + iVar14);
              pcVar2 = (char *)(unaff_BP + -0x2167);
              *pcVar2 = *pcVar2 + cVar19;
              bVar20 = (POPCOUNT(*pcVar2) & 1U) == 0;
              pcVar4 = (code *)swi(0x3f);
              (*pcVar4)();
              if (!bVar20) {
                    /* WARNING: Bad instruction - Truncating control flow here */
                halt_baddata();
              }
              in(0xb5);
            }
            else {
              unaff_BP = (undefined2 *)((int)unaff_BP + iVar14);
              pcVar2 = (char *)(unaff_BP + -0x2167);
              *pcVar2 = *pcVar2 + cVar19;
              bVar20 = (POPCOUNT(*pcVar2) & 1U) == 0;
              pcVar4 = (code *)swi(0x3f);
              uVar6 = (*pcVar4)();
              if (bVar20) {
                uVar18 = in(0xb5);
                wVar16 = 0x16;
                DAT_2000_b672 =
                     *(undefined2 *)
                      ((CONCAT11((char)((uint)uVar6 >> 8),uVar18) * 0x16 + DAT_2000_b60c + 0x16) * 2
                      + 0x4e90);
                FUN_1000_6cc5();
                wVar11 = extraout_DX_02;
                goto LAB_1000_6135;
              }
              in_AF = 9 < ((byte)uVar6 & 0xf) | in_AF;
            }
          }
          if ((bool)in_AF || *piVar1 == 0) goto code_r0x00015b95;
          Var26 = to_bcd(in_ST0);
          *(unkbyte10 *)(unaff_BP + -0x3f) = Var26;
          wVar16 = 0xbe6e;
          pcVar4 = (code *)swi(0x3f);
          Var26 = in_ST7;
          bVar17 = (*pcVar4)();
          in_ST0 = in_ST1;
          in_ST1 = in_ST2;
          in_ST2 = in_ST3;
          in_ST3 = in_ST4;
          in_ST4 = in_ST5;
          in_ST5 = in_ST6;
          in_ST6 = in_ST7;
          in_ST7 = Var26;
        }
        pcVar2 = (char *)((int)unaff_BP + wVar16 + 0xe43e);
        *pcVar2 = *pcVar2 + (char)uVar27;
        iVar14 = CONCAT11(1,bVar17);
      }
LAB_1000_6135:
      wVar13 = wVar16;
      wVar16 = in_stack_00000000;
    }
    uVar27 = qb3f_75(wVar5,wVar9,wVar11,0xb666,wVar13);
    wVar11 = wVar9 * 8 + 0x198a;
    bVar20 = wVar11 == 0;
    uVar27 = qb3f_a8((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),wVar11,wVar13);
    if (bVar20) {
      uVar21 = 1 < DAT_2000_b5e4;
      wVar9 = DAT_2000_b5e4 - 2;
      uVar18 = wVar9 == 0;
      uVar27 = qb3f_56((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),wVar11,wVar13);
      uVar27 = qb3f_7e((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),wVar11,wVar11);
      uVar27 = qb3f_a0((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),wVar11,0xcf2c);
      if (!(bool)uVar21 && !(bool)uVar18) {
        uVar27 = qb3f_7c((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xcf2c,wVar11);
      }
    }
    else {
      uVar18 = 0;
    }
    uVar27 = qb3f_9f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,0xb47c);
    if ((bool)uVar18) {
      wVar9 = qb3e_72((word)uVar27,0xd6,0x39,0xb666,0xb47c);
      wVar11 = qb3e_73(wVar9,0x10a,0x6e,0xb666,0xb47c);
      wVar9 = 0;
      uVar18 = 1;
      uVar27 = qb3e_74(wVar11,0,0xffff,0xb666,0xb47c);
      DAT_2000_b674 = 1;
    }
    else {
      uVar18 = 0;
    }
    uVar27 = qb3f_7f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,0xb7d0);
    wVar13 = 0xb666;
    wVar9 = qb3f_a1((word)uVar27,0xb666,(word)((ulong)uVar27 >> 0x10),0xb666,0xb47c);
    wVar11 = 0;
    if ((bool)uVar18) {
      wVar11 = 0xffff;
    }
    uVar18 = 0;
    wVar5 = 0xb47c;
    wVar16 = wVar13;
    uVar27 = qb3f_7f(wVar9,wVar13,wVar11,wVar13,0xbb60);
    uVar27 = qb3f_a1((word)uVar27,wVar16,(word)((ulong)uVar27 >> 0x10),wVar13,wVar5);
    iVar14 = 0;
    if ((bool)uVar18) {
      iVar14 = -1;
    }
    if (iVar14 == 0 && (int)((ulong)uVar27 >> 0x10) == 0) {
      wVar9 = 0;
      uVar18 = 1;
    }
    else {
      wVar9 = qb3e_72((word)uVar27,0x10b,0x5f,wVar13,wVar5);
      wVar11 = qb3e_73(wVar9,0x13f,0x95,wVar13,wVar5);
      wVar9 = 0;
      uVar18 = 1;
      uVar27 = qb3e_74(wVar11,0,0xffff,wVar13,wVar5);
      DAT_2000_b674 = 2;
    }
    uVar27 = qb3f_97((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,0xb47c);
    uVar27 = qb3f_2d((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,0xb47c);
    uVar27 = qb3f_a1((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,0xb7d8);
    if ((bool)uVar18) {
      wVar9 = qb3e_72((word)uVar27,0xd6,0x89,0xb666,0xb7d8);
      wVar11 = qb3e_73(wVar9,0x10a,0xbe,0xb666,0xb7d8);
      wVar9 = 0;
      uVar18 = 1;
      uVar27 = qb3e_74(wVar11,0,0xffff,0xb666,0xb7d8);
      DAT_2000_b674 = 3;
    }
    else {
      uVar18 = 0;
    }
    uVar27 = qb3f_7f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb666,0xb7f6);
    wVar13 = 0xb666;
    wVar9 = qb3f_a1((word)uVar27,0xb666,(word)((ulong)uVar27 >> 0x10),0xb666,0xb47c);
    wVar11 = 0;
    if ((bool)uVar18) {
      wVar11 = 0xffff;
    }
    uVar18 = 0;
    wVar5 = 0xb47c;
    wVar16 = wVar13;
    uVar27 = qb3f_7f(wVar9,wVar13,wVar11,wVar13,0xc2d8);
    uVar27 = qb3f_a1((word)uVar27,wVar16,(word)((ulong)uVar27 >> 0x10),wVar13,wVar5);
    iVar14 = 0;
    if ((bool)uVar18) {
      iVar14 = -1;
    }
    if (iVar14 == 0 && (int)((ulong)uVar27 >> 0x10) == 0) {
      wVar9 = 0;
      uVar18 = 1;
    }
    else {
      wVar9 = qb3e_72((word)uVar27,0xa1,0x5f,wVar13,wVar5);
      wVar11 = qb3e_73(wVar9,0xd5,0x95,wVar13,wVar5);
      wVar9 = 0;
      uVar18 = 1;
      uVar27 = qb3e_74(wVar11,0,0xffff,wVar13,wVar5);
      DAT_2000_b674 = 4;
    }
    wVar9 = qb3f_9f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb66e,0xb7f6);
    wVar11 = 0;
    if ((bool)uVar18) {
      wVar11 = 0xffff;
    }
    qb3f_75(wVar9,wVar11,wVar11,0xb4d2,0xb7f6);
    wVar9 = (word)((long)(int)wVar11 * 0x16);
    uVar12 = extraout_DX_03;
    uVar27 = qb3f_75(wVar9,wVar11,(word)((ulong)((long)(int)wVar11 * 0x16) >> 0x10),0xb4ca,wVar9);
    wVar9 = (wVar11 + (word)uVar27) * 2;
    uVar10 = 0;
    if (0 < *(int *)(wVar9 + 0x4e90)) {
      uVar10 = 0xffff;
    }
    wVar11 = uVar10 & uVar12;
    uVar18 = 0;
    uVar21 = wVar11 == 0;
    wVar13 = 0xb7f6;
    uVar27 = qb3f_6f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb7f6,wVar9);
    while( true ) {
      uVar27 = qb3f_7d((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar13,0x4e28);
      wVar9 = 0xb7fa;
      uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb7fa);
      if (!(bool)uVar18 && !(bool)uVar21) break;
      wVar9 = 0x4e28;
      uVar27 = qb3f_75((word)uVar27,0x4e28,0x4e28,0x4e28,0xb7fa);
      bVar20 = 0xe09d < wVar9 * 4;
      qb3f_9f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),wVar9 * 4 + 0x1f62,0xb7fa);
      iVar14 = 0;
      if (bVar20) {
        iVar14 = -1;
      }
      wVar11 = qb3f_7f(0xb7fa,wVar9,dx_03,dx_03,0xb7f6);
      uVar27 = qb3f_77(wVar11,wVar9,wVar9,dx_03,0xb7f6);
      bVar20 = 0xe09d < wVar9 * 4;
      wVar11 = wVar9 * 4 + 0x1f62;
      uVar27 = qb3f_9f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),wVar11,(word)uVar27);
      iVar8 = (int)((ulong)uVar27 >> 0x10);
      wVar9 = (word)uVar27;
      iVar15 = 0;
      if (bVar20) {
        iVar15 = -1;
      }
      wVar13 = iVar8 * 2;
      iVar7 = 0;
      if (5 < (int)((undefined2 *)&DAT_2000_1f82)[iVar8]) {
        iVar7 = -1;
      }
      if (iVar7 != 0 || (iVar15 != 0 || iVar14 != 0)) {
        wVar9 = ((undefined2 *)&DAT_2000_1eb6)[iVar8];
        uVar27 = qb3e_84(0,wVar9,((undefined2 *)&DAT_2000_1ec6)[iVar8],wVar11,wVar13);
        wVar9 = qb3e_85((word)uVar27,wVar9,-((int)((ulong)uVar27 >> 0x10) + -0x35),wVar11,wVar13);
        wVar9 = qb3e_86(wVar9,DAT_2000_19c8,0xffff,wVar11,wVar13);
      }
      wVar11 = 0x4e28;
      uVar27 = qb3f_75(wVar9,0x4e28,0x4e28,0x4e28,wVar13);
      bVar20 = 0xe0bd < wVar11 * 4;
      qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar11 * 4 + 0x1f42,0xb7fa);
      uVar12 = 0;
      if (bVar20) {
        uVar12 = 0xffff;
      }
      wVar9 = qb3f_7f(0xb7fa,wVar11,dx_04,dx_04,0xb7f6);
      uVar27 = qb3f_77(wVar9,wVar11,wVar11,dx_04,0xb7f6);
      bVar20 = 0xe0bd < wVar11 * 4;
      wVar9 = wVar11 * 4 + 0x1f42;
      uVar29 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar9,(word)uVar27);
      iVar14 = (int)(uVar29 >> 0x10);
      uVar10 = 0;
      if (bVar20) {
        uVar10 = 0xffff;
      }
      wVar11 = uVar10 | uVar12;
      wVar13 = iVar14 * 2;
      iVar8 = 0;
      if (5 < (int)((undefined2 *)&DAT_2000_1f82)[iVar14]) {
        iVar8 = -1;
      }
      uVar18 = 0;
      if (iVar8 == 0 && wVar11 == 0) {
        uVar29 = uVar29 & 0xffff;
        uVar21 = 1;
      }
      else {
        wVar16 = 0x34 - ((undefined2 *)&DAT_2000_1eb6)[iVar14];
        uVar27 = qb3e_84(0,wVar16,((undefined2 *)&DAT_2000_1ec6)[iVar14],wVar9,wVar13);
        iVar14 = (int)((ulong)uVar27 >> 0x10) + -0x35;
        uVar18 = iVar14 != 0;
        wVar11 = -iVar14;
        uVar21 = wVar11 == 0;
        wVar16 = qb3e_85((word)uVar27,wVar16,wVar11,wVar9,wVar13);
        wVar11 = DAT_2000_19c8;
        uVar29 = qb3e_86(wVar16,DAT_2000_19c8,0xffff,wVar9,wVar13);
      }
      wVar9 = qb3f_a7((word)uVar29,wVar11,(word)(uVar29 >> 0x10),0xb48c,wVar13);
      wVar11 = 0;
      if (!(bool)uVar18 && !(bool)uVar21) {
        wVar11 = 0xffff;
      }
      uVar27 = qb3f_75(wVar9,wVar11,wVar11,0x4e28,wVar13);
      wVar9 = wVar11 * 2;
      iVar14 = 0;
      if (5 < (int)((undefined2 *)&DAT_2000_1f82)[wVar11]) {
        iVar14 = -1;
      }
      if (iVar14 == 0 && (int)((ulong)uVar27 >> 0x10) == 0) {
        wVar11 = 0;
        uVar18 = 1;
      }
      else {
        uVar18 = 1;
        uVar27 = qb3e_84(0,0x34 - ((undefined2 *)&DAT_2000_1eb6)[wVar11],
                         ((undefined2 *)&DAT_2000_1ec6)[wVar11],0x4e28,wVar9);
        wVar13 = qb3e_85((word)uVar27,((undefined2 *)&DAT_2000_1eb6)[wVar11],
                         (word)((ulong)uVar27 >> 0x10),0x4e28,wVar9);
        wVar11 = DAT_2000_19c8;
        uVar27 = qb3e_86(wVar13,DAT_2000_19c8,0xffff,0x4e28,wVar9);
      }
      wVar9 = 0xb7f6;
      uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb7f6);
      if (!(bool)uVar18) {
        uVar27 = qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb7f6);
        bVar20 = 0xe09d < wVar11 * 4;
        wVar9 = wVar11 * 4 + 0x1f62;
        bVar22 = wVar9 == 0;
        uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar9,0xbb6c);
        if (bVar20 || bVar22) {
          iVar14 = 0x4e28;
          uVar27 = qb3f_75((word)uVar27,0x4e28,0x4e28,0x4e28,0xbb6c);
          wVar11 = (word)((ulong)uVar27 >> 0x10);
          wVar13 = iVar14 << 1;
          wVar9 = qb3f_7f((word)uVar27,wVar13,wVar11,wVar11,0xb7d0);
          qb3f_77(wVar9,wVar13,wVar13,wVar11,0xb7d0);
          wVar16 = wVar13 * 2;
          uVar27 = qb3e_84(0,((undefined2 *)&DAT_2000_1eb6)[wVar13],
                           *(word *)((int)(undefined2 *)&DAT_2000_1ec6 + si),si,wVar16);
          wVar11 = qb3e_85((word)uVar27,*(word *)((int)(undefined2 *)&DAT_2000_1eb6 + si),
                           -((int)((ulong)uVar27 >> 0x10) + -0x35),si,wVar16);
          wVar9 = DAT_2000_19c8;
          uVar27 = qb3e_86(wVar11,DAT_2000_19c8,wVar11,si,wVar16);
        }
        else {
          wVar9 = qb3f_7f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb7d0);
          iVar14 = 0x4e28;
          qb3f_77(wVar9,0x4e28,0x4e28,0x4e28,0xb7d0);
          wVar9 = ((undefined2 *)&DAT_2000_1eb6)[iVar14];
          uVar27 = qb3e_84(0,wVar9,((undefined2 *)&DAT_2000_1ec6)[iVar14],0x4e28,iVar14 * 2);
          unaff_BP[-3] = wVar9;
          uVar27 = qb3f_75((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,iVar14 * 2);
          wVar13 = wVar9 * 2;
          unaff_BP[-4] = wVar9;
          wVar11 = ((undefined2 *)&DAT_2000_1eb6)[wVar9];
          unaff_BP[-5] = (int)((ulong)uVar27 >> 0x10);
          uVar27 = qb3e_85((word)uVar27,wVar11,((undefined2 *)&DAT_2000_1ec6)[wVar9],0x4e28,wVar13);
          unaff_BP[-6] = wVar11;
          wVar9 = DAT_2000_19c8;
          unaff_BP[-7] = (int)((ulong)uVar27 >> 0x10);
          wVar11 = qb3e_86((word)uVar27,wVar9,0xffff,0x4e28,wVar13);
          unaff_BP[-8] = wVar9;
          wVar9 = qb3e_84(wVar11,unaff_BP[-3],0x35 - unaff_BP[-5],0x4e28,wVar13);
          wVar11 = qb3e_85(wVar9,unaff_BP[-6],0x35 - unaff_BP[-7],0x4e28,wVar13);
          wVar9 = unaff_BP[-8];
          uVar27 = qb3e_86(wVar11,wVar9,0xffff,0x4e28,wVar13);
          bVar20 = 0xe09d < (uint)(unaff_BP[-4] * 4);
          wVar11 = unaff_BP[-4] * 4 + 0x1f62;
          uVar18 = wVar11 == 0;
          uVar27 = qb3f_9f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),wVar11,0xbb68);
          wVar9 = 0;
          if (!bVar20 && !(bool)uVar18) {
            wVar9 = 0xffff;
            uVar18 = 0;
          }
          wVar16 = 0xbb6c;
          wVar11 = qb3f_9f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,0xbb6c);
          uVar12 = 0;
          if (!bVar20 && !(bool)uVar18) {
            uVar12 = 0xffff;
          }
          uVar27 = CONCAT22(uVar12 | wVar9,wVar11);
          if ((uVar12 | wVar9) == 0) {
            iVar14 = 0x4e28;
            qb3f_75(wVar11,0x4e28,0x4e28,0x4e28,0xbb6c);
            wVar13 = iVar14 * 2;
            wVar9 = *(word *)(wVar13 + 0x21aa);
            uVar18 = 1;
            wVar11 = qb3e_84(0,wVar9,0x35 - *(int *)(wVar13 + 0x218a),0x4e28,wVar13);
            wVar11 = qb3e_85(wVar11,wVar9,*(word *)(wVar13 + 0x216a),0x4e28,wVar13);
            wVar9 = DAT_2000_19c6;
            uVar27 = qb3e_86(wVar11,DAT_2000_19c6,0xffff,0x4e28,wVar13);
            wVar16 = 0xbb6c;
            uVar27 = qb3f_9f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,0xbb6c);
            if (!(bool)uVar18) {
              iVar14 = 0x4e28;
              qb3f_75((word)uVar27,0x4e28,0x4e28,0x4e28,0xbb6c);
              wVar16 = iVar14 * 2;
              wVar9 = *(word *)(wVar16 + 0x21ba);
              wVar13 = qb3e_85(0,wVar9,*(word *)(wVar16 + 0x217a),0x4e28,wVar16);
              wVar11 = DAT_2000_19c6;
              unaff_BP[-3] = wVar9;
              wVar9 = qb3e_86(wVar13,wVar11,0xffff,0x4e28,wVar16);
              unaff_BP[-4] = wVar11;
              wVar9 = qb3e_85(wVar9,unaff_BP[-3],0x35 - *(int *)(wVar16 + 0x219a),0x4e28,wVar16);
              wVar9 = qb3e_86(wVar9,unaff_BP[-4],0xffff,0x4e28,wVar16);
              uVar18 = 0x35 < *(uint *)(wVar16 + 0x218a);
              wVar11 = qb3e_85(wVar9,*(word *)(wVar16 + 0x21aa),0x35 - *(uint *)(wVar16 + 0x218a),
                               0x4e28,wVar16);
              wVar9 = unaff_BP[-4];
              uVar27 = qb3e_86(wVar11,wVar9,0xffff,0x4e28,wVar16);
              wVar16 = 0xb802;
              uVar27 = qb3f_9f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb802);
              if ((bool)uVar18) {
                qb3f_75((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb802);
                wVar16 = wVar9 * 2;
                wVar11 = qb3e_8d(0,*(int *)(wVar16 + 0x21aa) + 1,*(int *)(wVar16 + 0x216a) + 3,
                                 0x4e28,wVar16);
                wVar9 = DAT_2000_19c6;
                uVar27 = qb3e_48(wVar11,DAT_2000_19c6,DAT_2000_19c6,0x4e28,wVar16);
              }
            }
          }
        }
        uVar27 = qb3f_75((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,wVar16);
        bVar20 = 0xe0bd < wVar9 * 4;
        wVar11 = wVar9 * 4 + 0x1f42;
        bVar22 = wVar11 == 0;
        uVar27 = qb3f_9f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),wVar11,0xbb6c);
        if (bVar20 || bVar22) {
          iVar14 = 0x4e28;
          uVar27 = qb3f_75((word)uVar27,0x4e28,0x4e28,0x4e28,0xbb6c);
          wVar13 = (word)((ulong)uVar27 >> 0x10);
          wVar11 = iVar14 << 1;
          wVar9 = qb3f_7f((word)uVar27,wVar11,wVar13,wVar13,0xb7d0);
          qb3f_77(wVar9,wVar11,wVar11,wVar13,0xb7d0);
          uVar27 = qb3e_84(0,0x34 - ((undefined2 *)&DAT_2000_1eb6)[wVar11],
                           *(word *)((int)(undefined2 *)&DAT_2000_1ec6 + di_00),wVar13,di_00);
          wVar9 = qb3e_85((word)uVar27,0x34 - *(int *)((int)(undefined2 *)&DAT_2000_1eb6 + di_00),
                          -((int)((ulong)uVar27 >> 0x10) + -0x35),wVar13,di_00);
          wVar11 = DAT_2000_19c8;
          uVar27 = qb3e_86(wVar9,DAT_2000_19c8,wVar9,wVar13,di_00);
          wVar9 = di_00;
        }
        else {
          wVar9 = qb3f_7f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb7d0);
          iVar14 = 0x4e28;
          qb3f_77(wVar9,0x4e28,0x4e28,0x4e28,0xb7d0);
          wVar9 = 0x34 - ((undefined2 *)&DAT_2000_1eb6)[iVar14];
          uVar27 = qb3e_84(0,wVar9,((undefined2 *)&DAT_2000_1ec6)[iVar14],0x4e28,iVar14 * 2);
          unaff_BP[-3] = wVar9;
          uVar27 = qb3f_75((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,iVar14 * 2);
          wVar13 = wVar9 * 2;
          unaff_BP[-4] = wVar9;
          wVar11 = 0x34 - ((undefined2 *)&DAT_2000_1eb6)[wVar9];
          unaff_BP[-5] = (int)((ulong)uVar27 >> 0x10);
          uVar27 = qb3e_85((word)uVar27,wVar11,((undefined2 *)&DAT_2000_1ec6)[wVar9],0x4e28,wVar13);
          unaff_BP[-6] = wVar11;
          wVar9 = DAT_2000_19c8;
          unaff_BP[-7] = (int)((ulong)uVar27 >> 0x10);
          wVar11 = qb3e_86((word)uVar27,wVar9,0xffff,0x4e28,wVar13);
          unaff_BP[-8] = wVar9;
          wVar9 = qb3e_84(wVar11,unaff_BP[-3],0x35 - unaff_BP[-5],0x4e28,wVar13);
          wVar11 = qb3e_85(wVar9,unaff_BP[-6],0x35 - unaff_BP[-7],0x4e28,wVar13);
          wVar9 = unaff_BP[-8];
          uVar27 = qb3e_86(wVar11,wVar9,0xffff,0x4e28,wVar13);
          bVar20 = 0xe0bd < (uint)(unaff_BP[-4] * 4);
          wVar11 = unaff_BP[-4] * 4 + 0x1f42;
          uVar18 = wVar11 == 0;
          uVar27 = qb3f_9f((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),wVar11,0xbb68);
          wVar11 = 0;
          if (!bVar20 && !(bool)uVar18) {
            wVar11 = 0xffff;
            uVar18 = 0;
          }
          wVar9 = 0xbb6c;
          wVar13 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,0xbb6c);
          uVar12 = 0;
          if (!bVar20 && !(bool)uVar18) {
            uVar12 = 0xffff;
          }
          uVar27 = CONCAT22(uVar12 | wVar11,wVar13);
          if ((uVar12 | wVar11) == 0) {
            iVar14 = 0x4e28;
            qb3f_75(wVar13,0x4e28,0x4e28,0x4e28,0xbb6c);
            wVar13 = iVar14 * 2;
            wVar11 = 0x34 - *(int *)(wVar13 + 0x21aa);
            uVar18 = 1;
            wVar9 = qb3e_84(0,wVar11,0x35 - *(int *)(wVar13 + 0x218a),0x4e28,wVar13);
            wVar9 = qb3e_85(wVar9,wVar11,*(word *)(wVar13 + 0x216a),0x4e28,wVar13);
            wVar11 = DAT_2000_19c6;
            uVar27 = qb3e_86(wVar9,DAT_2000_19c6,0xffff,0x4e28,wVar13);
            wVar9 = 0xbb6c;
            uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,0xbb6c);
            if (!(bool)uVar18) {
              iVar14 = 0x4e28;
              qb3f_75((word)uVar27,0x4e28,0x4e28,0x4e28,0xbb6c);
              wVar16 = iVar14 * 2;
              wVar13 = 0x34 - *(int *)(wVar16 + 0x21ba);
              wVar11 = qb3e_85(0,wVar13,*(word *)(wVar16 + 0x217a),0x4e28,wVar16);
              wVar9 = DAT_2000_19c6;
              unaff_BP[-3] = wVar13;
              wVar11 = qb3e_86(wVar11,wVar9,0xffff,0x4e28,wVar16);
              unaff_BP[-4] = wVar9;
              wVar9 = qb3e_85(wVar11,unaff_BP[-3],0x35 - *(int *)(wVar16 + 0x219a),0x4e28,wVar16);
              wVar9 = qb3e_86(wVar9,unaff_BP[-4],0xffff,0x4e28,wVar16);
              unaff_BP[-5] = 0x35 - *(int *)(wVar16 + 0x218a);
              uVar18 = 0x34 < *(uint *)(wVar16 + 0x21aa);
              wVar9 = qb3e_85(wVar9,0x34 - *(uint *)(wVar16 + 0x21aa),unaff_BP[-5],0x4e28,wVar16);
              wVar11 = unaff_BP[-4];
              uVar27 = qb3e_86(wVar9,wVar11,0xffff,0x4e28,wVar16);
              wVar9 = 0xb802;
              uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb802);
              if ((bool)uVar18) {
                qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb802);
                wVar9 = wVar11 * 2;
                wVar13 = qb3e_8d(0,0x35 - *(int *)(wVar9 + 0x21ba),*(int *)(wVar9 + 0x216a) + 3,
                                 0x4e28,wVar9);
                wVar11 = DAT_2000_19c6;
                uVar27 = qb3e_48(wVar13,DAT_2000_19c6,DAT_2000_19c6,0x4e28,wVar9);
              }
            }
          }
        }
      }
      uVar27 = qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,wVar9);
      wVar9 = wVar11 * 2;
      if (7 < (int)((undefined2 *)&DAT_2000_1f82)[wVar11]) {
        wVar13 = ((undefined2 *)&DAT_2000_1eb6)[wVar11];
        uVar27 = qb3e_84(0,wVar13,0x35 - ((undefined2 *)&DAT_2000_1ec6)[wVar11],0x4e28,wVar9);
        wVar13 = qb3e_85((word)uVar27,-(wVar13 - 0x34),(word)((ulong)uVar27 >> 0x10),0x4e28,wVar9);
        wVar11 = DAT_2000_19c8;
        uVar27 = qb3e_86(wVar13,DAT_2000_19c8,0xffff,0x4e28,wVar9);
        break;
      }
      uVar27 = qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,wVar9);
      uVar12 = ((undefined2 *)&DAT_2000_1f82)[wVar11];
      uVar18 = uVar12 < 6;
      uVar21 = uVar12 == 6;
      if (5 < (int)uVar12) {
        iVar14 = 0x4e28;
        qb3f_75((word)uVar27,0x4e28,0x4e28,0x4e28,wVar11 * 2);
        wVar13 = iVar14 * 2;
        wVar9 = ((undefined2 *)&DAT_2000_1eb6)[iVar14];
        uVar27 = qb3e_84(0,wVar9,0x35 - ((undefined2 *)&DAT_2000_1ec6)[iVar14],0x4e28,wVar13);
        uVar18 = -(wVar9 - 0x34) == 0;
        wVar11 = qb3e_85((word)uVar27,-(wVar9 - 0x34),(word)((ulong)uVar27 >> 0x10),0x4e28,wVar13);
        wVar9 = DAT_2000_19c8;
        uVar27 = qb3e_86(wVar11,DAT_2000_19c8,0xffff,0x4e28,wVar13);
        uVar27 = qb3f_7b((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb7ee,0xb676);
        wVar13 = 0xb676;
        wVar11 = 0xb7fa;
        uVar27 = qb3f_9f((word)uVar27,0xb676,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb7fa);
        wVar9 = wVar13;
        if ((bool)uVar18) {
          uVar27 = qb3f_7b((word)uVar27,wVar13,(word)((ulong)uVar27 >> 0x10),0xb7f6,wVar13);
          wVar11 = wVar13;
        }
        uVar27 = qb3f_75((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,wVar11);
        wVar16 = wVar9 * 2;
        wVar9 = ((undefined2 *)&DAT_2000_1ec6)[wVar9];
        wVar11 = qb3f_57((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,wVar16);
        wVar13 = -(wVar9 * 2 + -0x35);
        uVar27 = qb3f_71(wVar11,wVar13,wVar9,0x4e28,wVar16);
        uVar27 = qb3f_57((word)uVar27,wVar13,(word)((ulong)uVar27 >> 0x10),0x4e28,wVar16);
        uVar27 = qb3f_89((word)uVar27,wVar16,(word)((ulong)uVar27 >> 0x10),0x4e28,0xbb60);
        di = (undefined2 *)&DAT_2000_bb60;
        uVar27 = qb3f_85((word)uVar27,wVar16,(word)((ulong)uVar27 >> 0x10),0x4e28,0xbb60);
        wVar9 = *(word *)((int)(undefined2 *)&DAT_2000_1eb6 + wVar16);
        uVar27 = qb3f_71((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,wVar16);
        qb3f_57((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,wVar16);
        wVar11 = -(wVar9 * 2 + -0x34);
        uVar27 = qb3f_71(wVar9,wVar11,dx_05,0x4e28,wVar16);
        uVar27 = qb3f_57((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,wVar16);
        uVar27 = qb3f_89((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,(word)di);
        uVar27 = qb3f_71((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,(word)di);
        uVar27 = qb3f_85((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,(word)di);
        uVar27 = qb3f_81((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb676);
        unaff_BP[-3] = (int)uVar27;
        unaff_BP[-4] = (int)((ulong)uVar27 >> 0x10);
        wVar9 = qb3e_84(0xffff,0x1a,0xb7b8,0x4e28,0xb676);
        uVar27 = qb3f_57(wVar9,0x34 - unaff_BP[-3],0x35 - unaff_BP[-4],0x4e28,0xb676);
        wVar9 = 0xb676;
        uVar27 = qb3f_99((word)uVar27,0xb676,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb7c8);
        qb3f_99((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0x4e28,wVar9);
        wVar13 = qb3e_85(0,0x1a,dx_06,0x4e28,wVar9);
        wVar11 = DAT_2000_19c6;
        uVar27 = qb3e_86(wVar13,DAT_2000_19c6,1,0x4e28,wVar9);
        break;
      }
      wVar13 = 0x4e28;
      uVar27 = qb3f_7f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0x4e28,0xb7f6);
    }
    uVar27 = qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb666,wVar9);
    wVar13 = wVar11 * 8 + 0x198a;
    uVar18 = wVar13 == 0;
    uVar27 = qb3f_a8((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar13,wVar9);
    if (!(bool)uVar18) {
      uVar27 = qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb666,wVar9);
      uVar21 = 0xe675 < wVar11 * 8;
      wVar13 = wVar11 * 8 + 0x198a;
      uVar18 = wVar13 == 0;
      uVar27 = qb3f_79((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar13,wVar9);
      uVar27 = qb3f_7d((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar13,0xb67a);
      wVar9 = 0xb7f6;
      uVar27 = qb3f_6f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb7f6,0xb67a);
      while( true ) {
        uVar27 = qb3f_7d((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar9,0xb67e);
        wVar13 = 0xb67e;
        wVar9 = 0xb67a;
        uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb67e,0xb67a);
        if (!(bool)uVar21 && !(bool)uVar18) break;
        uVar27 = qb3f_7f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb67e,0xb7f6);
        uVar27 = qb3f_77((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb67e,0xb7f6);
        uVar21 = 0xe6a1 < wVar11 * 4;
        wVar9 = wVar11 * 4 + 0x195e;
        uVar18 = wVar9 == 0;
        uVar27 = qb3f_a7((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar9,0xb7f6);
        wVar13 = (word)((ulong)uVar27 >> 0x10);
        if (!(bool)uVar18) {
          uVar27 = qb3f_7b((word)uVar27,wVar11,wVar13,0xb67e,0xb682);
          wVar13 = 0xb67e;
          uVar27 = qb3f_9f((word)uVar27,0xb67e,(word)((ulong)uVar27 >> 0x10),0xb682,0xbb60);
          wVar9 = (word)((ulong)uVar27 >> 0x10);
          if ((bool)uVar21) {
            wVar11 = wVar13;
            uVar27 = qb3f_7f((word)uVar27,wVar13,wVar9,wVar13,0xb7f6);
            uVar27 = qb3f_77((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar13,0xb7f6);
            uVar27 = qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar11 * 4 + 0x195e,
                             0xb7f6);
            wVar9 = wVar11 * 4 + 0x18da;
            uVar18 = wVar9 == 0;
            qb3f_7b((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar9,0xb686);
            uVar27 = FUN_1000_6f52();
          }
          else {
            uVar27 = qb3f_7f((word)uVar27,wVar13,wVar9,0xb67e,0xb7f6);
            uVar27 = qb3f_77((word)uVar27,wVar13,(word)((ulong)uVar27 >> 0x10),0xb67e,0xb7f6);
            uVar27 = qb3f_75((word)uVar27,wVar13,(word)((ulong)uVar27 >> 0x10),wVar13 * 4 + 0x195e,
                             0xb7f6);
            wVar9 = wVar13 * 4 + 0x1856;
            uVar18 = wVar9 == 0;
            qb3f_7b((word)uVar27,wVar13,(word)((ulong)uVar27 >> 0x10),wVar9,0xb686);
            uVar27 = FUN_1000_6eee();
            wVar11 = wVar13;
          }
          uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb67e,0xb7f6);
          if ((bool)uVar18) {
            uVar18 = 1;
            wVar9 = qb3e_89(0,0xb,0x19,0xb67e,0xb7f6);
            wVar11 = 0x4e86;
            uVar27 = qb3e_58(wVar9,0x4e86,0xff00,0xb67e,0xb7f6);
          }
          else {
            uVar18 = 0;
          }
          uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb67e,0xb7d8);
          if ((bool)uVar18) {
            uVar18 = 1;
            wVar9 = qb3e_89(0,0xd,0x1a,0xb67e,0xb7d8);
            wVar11 = 0x4e86;
            uVar27 = qb3e_58(wVar9,0x4e86,0xff00,0xb67e,0xb7d8);
          }
          else {
            uVar18 = 0;
          }
          uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb67e,0xbb60);
          if ((bool)uVar18) {
            uVar18 = 1;
            wVar9 = qb3e_89(0,0xf,0x19,0xb67e,0xbb60);
            wVar11 = 0x4e2c;
            uVar27 = qb3e_58(wVar9,0x4e2c,wVar9,0xb67e,0xbb60);
          }
          else {
            uVar18 = 0;
          }
          uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb67e,0xb802);
          if ((bool)uVar18) {
            uVar18 = 1;
            wVar9 = qb3e_89(0,0x11,0x18,0xb67e,0xb802);
            wVar11 = 0x4e2c;
            uVar27 = qb3e_58(wVar9,0x4e2c,wVar9,0xb67e,0xb802);
          }
          else {
            uVar18 = 0;
          }
          wVar9 = 0xbb6c;
          wVar13 = 0xb67e;
          uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb67e,0xbb6c);
          if ((bool)uVar18) {
            uVar18 = 1;
            wVar16 = qb3e_89(0,0x12,0x18,0xb67e,0xbb6c);
            wVar11 = 0x4e2c;
            uVar27 = qb3e_58(wVar16,0x4e2c,wVar16,0xb67e,0xbb6c);
          }
          else {
            uVar18 = 0;
          }
          break;
        }
        wVar9 = 0xb67e;
        uVar27 = qb3f_7f((word)uVar27,wVar11,wVar13,0xb67e,0xb7f6);
      }
    }
    qb3e_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar13,wVar9);
    uVar27 = FUN_1000_6de7();
    wVar13 = 0xb7f6;
    wVar9 = 0xb66e;
    uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb66e,0xb7f6);
    if ((bool)uVar18) {
LAB_1000_6ba3:
      uVar27 = qb3e_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),wVar9,wVar13);
      uVar27 = qb3f_7b((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb7ee,0xb66e);
      qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb4d2,0xb66e);
      wVar9 = (word)((long)(int)wVar11 * 0x16);
      uVar27 = qb3f_75(wVar9,wVar11,(word)((ulong)((long)(int)wVar11 * 0x16) >> 0x10),0xb4ca,wVar9);
      wVar11 = (wVar11 + (int)uVar27) * 2;
      wVar9 = *(word *)(wVar11 + 0x4e90);
      DAT_2000_b68a = wVar9;
      uVar27 = qb3f_57(wVar9,wVar9,(word)((ulong)uVar27 >> 0x10),0xb4ca,wVar11);
      uVar27 = qb3f_7d((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xb68c);
      if ((word)uVar27 != 0) {
        wVar9 = DAT_2000_b68a;
        uVar27 = qb3f_57((word)uVar27,DAT_2000_b68a,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xb68c);
        uVar27 = qb3f_71((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xbc1e);
        uVar27 = qb3f_89((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xbc1e);
        wVar11 = 0x1a;
        uVar27 = qb3d_03((word)uVar27,0x1a,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xbc1e);
        uVar27 = qb3f_91((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xbc1e);
        uVar27 = qb3f_9d((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xbc1e);
        uVar27 = qb3f_81((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xb7f6);
        qb3f_77((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xb7f6);
        wVar9 = 0;
        if ((int)wVar11 < 0x13) {
          wVar9 = 0xffff;
        }
        uVar12 = 0;
        if (0x14 < (int)wVar11) {
          uVar12 = 0xffff;
        }
        uVar27 = CONCAT22(uVar12 | wVar9,wVar11);
        bVar20 = false;
        DAT_2000_b68a = wVar11;
        if ((uVar12 | wVar9) == 0) {
          uVar27 = qb3f_9f(wVar11,wVar9,0,0xb48c,0xbb68);
          if (bVar20) {
            DAT_2000_b68a = DAT_2000_b68a - 8;
          }
          else {
            uVar27 = qb3f_75((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb68c,0xbb68);
            wVar9 = ((undefined2 *)&DAT_2000_3824)[wVar9];
            if ((int)wVar9 < 0) {
              wVar9 = -wVar9;
            }
            if (0x8c < (int)wVar9) {
              DAT_2000_b68a = DAT_2000_b68a + 2;
            }
          }
        }
        uVar27 = qb3f_7b((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb7f6,0xb682);
        wVar13 = DAT_2000_b68a * 4 + 0x18da;
        qb3f_7b((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),wVar13,0xb686);
        FUN_1000_6f52();
        wVar9 = qb3e_89(0,0xe1,0x70,wVar13,0xb686);
        wVar11 = 0x4e86;
        uVar27 = qb3e_58(wVar9,0x4e86,0xff03,wVar13,0xb686);
        DAT_2000_b63c = 1;
        qb3f_75((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb4d2,0xb686);
        wVar9 = (word)((long)(int)wVar11 * 0x16);
        uVar27 = qb3f_75(wVar9,wVar11,(word)((ulong)((long)(int)wVar11 * 0x16) >> 0x10),0xb4ca,wVar9
                        );
        wVar11 = (wVar11 + (word)uVar27) * 2;
        wVar9 = *(word *)(wVar11 + 0x4e90);
        uVar27 = qb3f_57((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb4ca,wVar11);
        qb3f_7d((word)uVar27,wVar9,(word)((ulong)uVar27 >> 0x10),0xb4ca,0xb68c);
      }
      return;
    }
    uVar27 = qb3f_7f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb666,0xb7f6);
    wVar11 = 0xb7f6;
    uVar27 = qb3f_7d((word)uVar27,0xb7f6,(word)((ulong)uVar27 >> 0x10),0xb7f6,0xb666);
    uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb666,0xbb6c);
    if ((bool)uVar18) {
      wVar9 = 0xb666;
      uVar27 = qb3f_7b((word)uVar27,0xb666,(word)((ulong)uVar27 >> 0x10),wVar11,0xb666);
      wVar11 = wVar9;
    }
    wVar13 = 0xb47c;
    wVar9 = 0xb666;
    uVar27 = qb3f_9f((word)uVar27,wVar11,(word)((ulong)uVar27 >> 0x10),0xb666,0xb47c);
    if ((bool)uVar18) goto LAB_1000_6ba3;
    uVar18 = 0;
  } while( true );
}


// ==== FUN_1000_6baf @ 1000:6baf (size 278) callers: FUN_1000_803a

void __cdecl16near FUN_1000_6baf(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  uint uVar2;
  word in_BX;
  word si;
  word unaff_DI;
  word wVar3;
  bool bVar4;
  undefined4 uVar5;
  
  qb3f_75(in_AX,in_BX,in_DX,0xb4d2,unaff_DI);
  wVar1 = (word)((long)(int)in_BX * 0x16);
  uVar5 = qb3f_75(wVar1,in_BX,(word)((ulong)((long)(int)in_BX * 0x16) >> 0x10),0xb4ca,wVar1);
  wVar3 = (in_BX + (int)uVar5) * 2;
  wVar1 = *(word *)(wVar3 + 0x4e90);
  DAT_2000_b68a = wVar1;
  uVar5 = qb3f_57(wVar1,wVar1,(word)((ulong)uVar5 >> 0x10),0xb4ca,wVar3);
  uVar5 = qb3f_7d((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb4ca,0xb68c);
  if ((word)uVar5 != 0) {
    wVar1 = DAT_2000_b68a;
    uVar5 = qb3f_57((word)uVar5,DAT_2000_b68a,(word)((ulong)uVar5 >> 0x10),0xb4ca,0xb68c);
    uVar5 = qb3f_71((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb4ca,0xbc1e);
    uVar5 = qb3f_89((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb4ca,0xbc1e);
    wVar3 = 0x1a;
    uVar5 = qb3d_03((word)uVar5,0x1a,(word)((ulong)uVar5 >> 0x10),0xb4ca,0xbc1e);
    uVar5 = qb3f_91((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb4ca,0xbc1e);
    uVar5 = qb3f_9d((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb4ca,0xbc1e);
    uVar5 = qb3f_81((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb4ca,0xb7f6);
    qb3f_77((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb4ca,0xb7f6);
    wVar1 = 0;
    if ((int)wVar3 < 0x13) {
      wVar1 = 0xffff;
    }
    uVar2 = 0;
    if (0x14 < (int)wVar3) {
      uVar2 = 0xffff;
    }
    uVar5 = CONCAT22(uVar2 | wVar1,wVar3);
    bVar4 = false;
    DAT_2000_b68a = wVar3;
    if ((uVar2 | wVar1) == 0) {
      uVar5 = qb3f_9f(wVar3,wVar1,0,0xb48c,0xbb68);
      if (bVar4) {
        DAT_2000_b68a = DAT_2000_b68a - 8;
      }
      else {
        uVar5 = qb3f_75((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb68c,0xbb68);
        wVar1 = ((undefined2 *)&DAT_2000_3824)[wVar1];
        if ((int)wVar1 < 0) {
          wVar1 = -wVar1;
        }
        if (0x8c < (int)wVar1) {
          DAT_2000_b68a = DAT_2000_b68a + 2;
        }
      }
    }
    uVar5 = qb3f_7b((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb682);
    si = DAT_2000_b68a * 4 + 0x18da;
    qb3f_7b((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),si,0xb686);
    FUN_1000_6f52();
    wVar1 = qb3e_89(0,0xe1,0x70,si,0xb686);
    wVar3 = 0x4e86;
    uVar5 = qb3e_58(wVar1,0x4e86,0xff03,si,0xb686);
    DAT_2000_b63c = 1;
    qb3f_75((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xb686);
    wVar1 = (word)((long)(int)wVar3 * 0x16);
    uVar5 = qb3f_75(wVar1,wVar3,(word)((ulong)((long)(int)wVar3 * 0x16) >> 0x10),0xb4ca,wVar1);
    wVar3 = (wVar3 + (word)uVar5) * 2;
    wVar1 = *(word *)(wVar3 + 0x4e90);
    uVar5 = qb3f_57((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb4ca,wVar3);
    qb3f_7d((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb4ca,0xb68c);
  }
  return;
}


// ==== FUN_1000_6cc5 @ 1000:6cc5 (size 18) callers: FUN_1000_593c

/* WARNING: Control flow encountered bad instruction data */

void FUN_1000_6cc5(void)

{
  code *pcVar1;
  undefined2 uVar2;
  char in_SF;
  char in_OF;
  
  pcVar1 = (code *)swi(0x3f);
  (*pcVar1)();
  pcVar1 = (code *)swi(0x3f);
  uVar2 = (*pcVar1)();
  if (in_OF != in_SF) {
                    /* WARNING: Bad instruction - Truncating control flow here */
    halt_baddata();
  }
  out(0xd1,uVar2);
  out(0x81,uVar2);
                    /* WARNING: Bad instruction - Truncating control flow here */
  halt_baddata();
}


// ==== FUN_1000_6de7 @ 1000:6de7 (size 263) callers: FUN_1000_593c

void __cdecl16near FUN_1000_6de7(void)

{
  word in_AX;
  uint uVar1;
  word in_DX;
  int iVar2;
  word wVar3;
  bool bVar4;
  ulong uVar5;
  
  wVar3 = 0;
  if (DAT_2000_b674 == 1) {
    wVar3 = 0xffff;
  }
  bVar4 = false;
  uVar1 = qb3f_9f(in_AX,wVar3,in_DX,0xb66e,0xb7f6);
  iVar2 = 0;
  if (bVar4) {
    iVar2 = -1;
  }
  if (iVar2 == 0 && wVar3 == 0) {
    uVar5 = (ulong)uVar1;
  }
  else {
    wVar3 = qb3e_87(0,0xd6,0x39,0xb66e,0xb7f6);
    wVar3 = qb3e_88(wVar3,0x10a,0x6e,0xb66e,0xb7f6);
    uVar5 = qb3e_3a(wVar3,0x52f2,wVar3,0xb66e,0xb7f6);
  }
  wVar3 = 0;
  if (DAT_2000_b674 == 2) {
    wVar3 = 0xffff;
  }
  bVar4 = false;
  uVar1 = qb3f_9f((word)uVar5,wVar3,(word)(uVar5 >> 0x10),0xb66e,0xb7f6);
  iVar2 = 0;
  if (bVar4) {
    iVar2 = -1;
  }
  if (iVar2 == 0 && wVar3 == 0) {
    uVar5 = (ulong)uVar1;
  }
  else {
    wVar3 = qb3e_87(0,0x10b,0x5f,0xb66e,0xb7f6);
    wVar3 = qb3e_88(wVar3,0x13f,0x95,0xb66e,0xb7f6);
    uVar5 = qb3e_3a(wVar3,0x530a,0x5ca,0xb66e,0xb7f6);
  }
  wVar3 = 0;
  if (DAT_2000_b674 == 3) {
    wVar3 = 0xffff;
  }
  bVar4 = false;
  uVar1 = qb3f_9f((word)uVar5,wVar3,(word)(uVar5 >> 0x10),0xb66e,0xb7f6);
  iVar2 = 0;
  if (bVar4) {
    iVar2 = -1;
  }
  if (iVar2 == 0 && wVar3 == 0) {
    uVar5 = (ulong)uVar1;
  }
  else {
    wVar3 = qb3e_87(0,0xd6,0x89,0xb66e,0xb7f6);
    wVar3 = qb3e_88(wVar3,0x10a,0xbe,0xb66e,0xb7f6);
    uVar5 = qb3e_3a(wVar3,0x58d4,0x5ca,0xb66e,0xb7f6);
  }
  wVar3 = 0;
  if (DAT_2000_b674 == 4) {
    wVar3 = 0xffff;
  }
  bVar4 = false;
  qb3f_9f((word)uVar5,wVar3,(word)(uVar5 >> 0x10),0xb66e,0xb7f6);
  iVar2 = 0;
  if (bVar4) {
    iVar2 = -1;
  }
  if (iVar2 != 0 || wVar3 != 0) {
    wVar3 = qb3e_87(0,0xa1,0x5f,0xb66e,0xb7f6);
    wVar3 = qb3e_88(wVar3,0xd5,0x95,0xb66e,0xb7f6);
    qb3e_3a(wVar3,0x5300,wVar3,0xb66e,0xb7f6);
  }
  return;
}


// ==== FUN_1000_6eee @ 1000:6eee (size 99) callers: FUN_1000_593c

void __cdecl16near FUN_1000_6eee(void)

{
  word in_AX;
  int iVar1;
  word in_DX;
  word in_BX;
  int iVar2;
  word si;
  word unaff_DI;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar3;
  
  si = 0xb7ee;
  uVar3 = qb3f_6f(in_AX,in_BX,in_DX,0xb7ee,unaff_DI);
  while( true ) {
    uVar3 = qb3f_7d((word)uVar3,in_BX,(word)((ulong)uVar3 >> 0x10),si,0xb694);
    uVar3 = qb3f_9f((word)uVar3,in_BX,(word)((ulong)uVar3 >> 0x10),0xb694,0xcf34);
    if (!(bool)in_CF && !(bool)in_ZF) break;
    qb3f_75((word)uVar3,in_BX,(word)((ulong)uVar3 >> 0x10),0xb686,0xcf34);
    uVar3 = qb3f_7f((word)((long)(int)in_BX * (long)DAT_2000_5ea8),in_BX,
                    (word)((ulong)((long)(int)in_BX * (long)DAT_2000_5ea8) >> 0x10),0xb682,0xc2d8);
    iVar1 = qb3f_77((word)uVar3,in_BX,(word)((ulong)uVar3 >> 0x10),0xb682,0xc2d8);
    iVar2 = -0x496c;
    uVar3 = qb3f_75((iVar1 + in_BX) * DAT_2000_5eaa,0xb694,0xb694,0xb694,0xc2d8);
    in_BX = 0x5e9e;
    uVar3 = qb3f_c4((word)((ulong)uVar3 >> 0x10),0x5e9e,(iVar2 + (int)uVar3) * 2,0xb694,0xc2d8);
    in_CF = iVar2 < 0;
    in_ZF = iVar2 * 2 == 0;
    *(word *)(iVar2 * 2 + 0x4e2c) = (word)uVar3;
    si = 0xb694;
    uVar3 = qb3f_7f((word)uVar3,in_BX,(word)((ulong)uVar3 >> 0x10),0xb694,0xb7f6);
  }
  return;
}


// ==== FUN_1000_6f52 @ 1000:6f52 (size 106) callers: FUN_1000_593c,FUN_1000_6baf

void __cdecl16near FUN_1000_6f52(void)

{
  word in_AX;
  word in_DX;
  word dx;
  word in_BX;
  int iVar1;
  word wVar2;
  word wVar3;
  word unaff_DI;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar4;
  
  wVar3 = 0xb7ee;
  uVar4 = qb3f_6f(in_AX,in_BX,in_DX,0xb7ee,unaff_DI);
  while( true ) {
    uVar4 = qb3f_7d((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),wVar3,0xb694);
    wVar3 = qb3f_9f((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0xb694,0xb7d4);
    if (!(bool)in_CF && !(bool)in_ZF) break;
    iVar1 = -0x496c;
    qb3f_75(wVar3,0xb694,0xb694,0xb694,0xb7d4);
    wVar2 = iVar1 << 1;
    wVar3 = qb3f_75(wVar2,wVar2,dx,0xb686,0xb7d4);
    wVar2 = qb3f_7f((word)((long)(int)wVar2 * (long)DAT_2000_4e20),wVar3,
                    (word)((ulong)((long)(int)wVar2 * (long)DAT_2000_4e20) >> 0x10),0xb682,0xb7d0);
    uVar4 = qb3f_77(wVar2,wVar3,wVar3,0xb682,0xb7d0);
    wVar2 = (word)((ulong)uVar4 >> 0x10);
    iVar1 = ((int)uVar4 + wVar3) * DAT_2000_4e22 + iVar1;
    in_CF = iVar1 < 0;
    wVar3 = iVar1 * 2;
    in_ZF = wVar3 == 0;
    wVar3 = qb3f_c4(wVar3,0x4e16,wVar3,0xb682,0xb7d0);
    in_BX = 0x4e86;
    uVar4 = qb3f_c5(wVar3,0x4e86,wVar2,0xb682,0xb7d0);
    wVar3 = 0xb694;
    uVar4 = qb3f_7f((word)uVar4,in_BX,(word)((ulong)uVar4 >> 0x10),0xb694,0xb7f6);
  }
  return;
}


// ==== FUN_1000_6fbd @ 1000:6fbd (size 68) callers: FUN_1000_70a1,FUN_1000_803a

void __cdecl16near FUN_1000_6fbd(void)

{
  word in_AX;
  word in_DX;
  word dx;
  word in_BX;
  word wVar1;
  word bx;
  word unaff_DI;
  undefined4 uVar2;
  
  uVar2 = qb3f_75(in_AX,in_BX,in_DX,0xb530,unaff_DI);
  wVar1 = *(word *)(in_BX * 2 + 0x2242);
  uVar2 = qb3f_57((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb530,in_BX * 2);
  uVar2 = qb3f_71((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb530,0xcf38);
  uVar2 = qb3f_91((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb530,0xcf38);
  wVar1 = 0x1a;
  uVar2 = qb3f_71((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),0xb530,0xcf38);
  uVar2 = qb3d_03((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb530,0xcf38);
  uVar2 = qb3f_ad((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb530,0xcf38);
  uVar2 = qb3f_9d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb530,0xcf38);
  qb3f_77((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb530,0xcf38);
  bx = 0xb7b8;
  DAT_2000_b698 = wVar1;
  uVar2 = qb3d_03(wVar1,0xb7b8,dx,0xb530,0xcf38);
  qb3f_77((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0xb530,0xcf38);
  DAT_2000_b69a = bx;
  return;
}


// ==== FUN_1000_7001 @ 1000:7001 (size 160) callers: FUN_1000_7eec

void __cdecl16near FUN_1000_7001(void)

{
  word in_AX;
  int iVar1;
  word in_DX;
  word dx;
  word in_BX;
  word wVar2;
  word bx;
  word unaff_DI;
  undefined1 uVar3;
  undefined1 in_ZF;
  bool bVar4;
  undefined4 uVar5;
  
  uVar5 = qb3f_a7(in_AX,in_BX,in_DX,0xb48c,unaff_DI);
  if ((bool)in_ZF) {
    return;
  }
  uVar5 = qb3f_7f((word)uVar5,in_BX,(word)((ulong)uVar5 >> 0x10),0xb4fe,0xb7f6);
  wVar2 = 0xb7f6;
  uVar5 = qb3f_7d((word)uVar5,0xb7f6,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb4fe);
  bx = 0xb4fe;
  uVar5 = qb3f_7f((word)uVar5,0xb4fe,(word)((ulong)uVar5 >> 0x10),0xb4fe,wVar2);
  uVar5 = qb3f_71((word)uVar5,bx,(word)((ulong)uVar5 >> 0x10),0xb4fe,0xb502);
  wVar2 = qb3f_a1((word)uVar5,bx,(word)((ulong)uVar5 >> 0x10),0xb4fe,0xb502);
  dx = 0;
  if ((bool)in_ZF) {
    dx = 0xffff;
  }
  bVar4 = false;
  uVar5 = qb3f_9f(wVar2,bx,dx,0xb7b0,0xb506);
  wVar2 = (word)((ulong)uVar5 >> 0x10);
  iVar1 = 0;
  if (bVar4) {
    iVar1 = -1;
  }
  uVar3 = 0;
  if (iVar1 != 0 || wVar2 != 0) {
    uVar5 = qb3f_7b((word)uVar5,bx,wVar2,0xb7b0,bx);
  }
  uVar5 = qb3f_8f((word)uVar5,bx,(word)((ulong)uVar5 >> 0x10),0xb48c,0xbe82);
  uVar5 = qb3f_71((word)uVar5,bx,(word)((ulong)uVar5 >> 0x10),0xb48c,0xb4fe);
  uVar5 = qb3f_a1((word)uVar5,bx,(word)((ulong)uVar5 >> 0x10),0xb48c,0xb4fe);
  if ((bool)uVar3) {
    bx = 0xb4fe;
    uVar5 = qb3f_7f((word)uVar5,0xb4fe,(word)((ulong)uVar5 >> 0x10),0xb7b0,0xce48);
    uVar5 = qb3f_7d((word)uVar5,bx,(word)((ulong)uVar5 >> 0x10),0xb7b0,bx);
  }
  uVar5 = qb3f_7b((word)uVar5,bx,(word)((ulong)uVar5 >> 0x10),0xb4fe,0xb530);
  uVar5 = qb3f_8f((word)uVar5,bx,(word)((ulong)uVar5 >> 0x10),0xb530,0xbc42);
  wVar2 = 0x1a;
  uVar5 = qb3f_71((word)uVar5,0x1a,(word)((ulong)uVar5 >> 0x10),0xb530,0xbc42);
  uVar5 = qb3d_03((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0xb530,0xbc42);
  iVar1 = qb3f_a5((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0xb530,0xbc42);
  DAT_2000_b533 = DAT_2000_b533 ^ 0xe9;
  *(int *)(wVar2 + 0xb530) = *(int *)(wVar2 + 0xb530) + iVar1;
  return;
}


// ==== FUN_1000_70a1 @ 1000:70a1 (size 2104) callers: FUN_1000_0c0b,FUN_1000_7e8d

/* WARNING: Instruction at (ram,0x00015bfc) overlaps instruction at (ram,0x00015bfb)
    */
/* WARNING: Control flow encountered bad instruction data */

void __cdecl16near FUN_1000_70a1(void)

{
  int *piVar1;
  char *pcVar2;
  byte *pbVar3;
  long lVar4;
  code *pcVar5;
  word wVar6;
  undefined2 uVar7;
  word in_AX;
  word wVar8;
  word wVar9;
  undefined2 extraout_DX;
  word dx;
  word extraout_DX_00;
  int extraout_DX_01;
  word extraout_DX_02;
  uint extraout_DX_03;
  word dx_00;
  int iVar10;
  word dx_01;
  int iVar11;
  word si;
  word di;
  word dx_02;
  word dx_03;
  word in_DX;
  uint uVar12;
  uint extraout_DX_04;
  uint extraout_DX_05;
  word dx_04;
  word dx_05;
  word dx_06;
  int iVar13;
  int iVar14;
  word in_BX;
  word wVar15;
  uint uVar16;
  undefined2 *unaff_BP;
  word si_00;
  undefined2 *puVar17;
  word wVar18;
  undefined2 unaff_SS;
  byte bVar19;
  undefined1 uVar20;
  byte in_AF;
  char cVar21;
  bool bVar22;
  undefined1 in_ZF;
  undefined1 uVar23;
  bool bVar24;
  char cVar25;
  char cVar26;
  bool bVar27;
  unkbyte10 in_ST0;
  unkbyte10 in_ST1;
  unkbyte10 in_ST2;
  unkbyte10 in_ST3;
  unkbyte10 in_ST4;
  unkbyte10 in_ST5;
  unkbyte10 in_ST6;
  unkbyte10 Var28;
  unkbyte10 in_ST7;
  undefined2 *puVar29;
  undefined4 uVar30;
  ulong uVar31;
  word in_stack_00000000;
  
  uVar30 = qb3f_9f(in_AX,in_BX,in_DX,0xb50e,0xb7f6);
  wVar15 = 0;
  if (!(bool)in_ZF) {
    wVar15 = 0xffff;
    in_ZF = 0;
  }
  wVar8 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb530,0xb69c);
  uVar12 = 0;
  if (!(bool)in_ZF) {
    uVar12 = 0xffff;
  }
  uVar20 = 0;
  uVar23 = (uVar12 & wVar15) == 0;
  uVar30 = qb3d_34(wVar8,wVar15,uVar12 & wVar15,0xb530,0xb69c);
  uVar30 = qb3f_91((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb530,0xbc16);
  wVar15 = 0x1a;
  uVar30 = qb3d_03((word)uVar30,0x1a,(word)((ulong)uVar30 >> 0x10),0xb530,0xbc16);
  uVar30 = qb3f_81((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb530,0xcf3c);
  qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb530,0xb570);
  uVar12 = 0;
  if (!(bool)uVar20 && !(bool)uVar23) {
    uVar12 = 0xffff;
  }
  uVar20 = (uVar12 & extraout_DX_04) == 0;
  if (!(bool)uVar20) {
    return;
  }
  uVar30 = FUN_1000_6fbd();
  wVar15 = DAT_2000_b698;
  uVar30 = qb3f_57((word)uVar30,DAT_2000_b698,(word)((ulong)uVar30 >> 0x10),0xb530,0xb570);
  wVar15 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb530,0xb4ca);
  wVar8 = 0;
  if ((bool)uVar20) {
    wVar8 = 0xffff;
  }
  uVar20 = 0;
  wVar18 = DAT_2000_b69a;
  uVar30 = qb3f_57(wVar15,DAT_2000_b69a,wVar8,0xb530,0xb4ca);
  qb3f_a1((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),0xb530,0xb4d2);
  uVar12 = 0;
  if ((bool)uVar20) {
    uVar12 = 0xffff;
  }
  if ((uVar12 & extraout_DX_05) != 0) {
    return;
  }
  wVar8 = (word)((long)(int)DAT_2000_b60a * 0x16);
  wVar18 = (wVar8 + DAT_2000_b60c) * 2;
  uVar20 = wVar18 == 0;
  wVar15 = *(word *)(wVar18 + 0x4e90);
  uVar30 = qb3f_57(wVar8,wVar15,(word)((ulong)((long)(int)DAT_2000_b60a * 0x16) >> 0x10),0xb530,
                   wVar18);
  uVar30 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb530,0xb6a0);
  wVar15 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb50e,0xb7f6);
  wVar8 = 0;
  if ((bool)uVar20) {
    wVar8 = 0xffff;
  }
  bVar24 = false;
  uVar30 = qb3f_9f(wVar15,wVar8,0xb7f6,0xb530,0xb69c);
  wVar15 = (word)((ulong)uVar30 >> 0x10);
  uVar12 = 0;
  if (bVar24) {
    uVar12 = 0xffff;
  }
  uVar20 = (uVar12 & wVar8) == 0;
  if (!(bool)uVar20) {
    uVar30 = qb3f_7b((word)uVar30,wVar8,wVar15,wVar15,0xb6a4);
    uVar30 = qb3f_7b((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),wVar15,0xb6a8);
    qb3f_75((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb6a8);
    DAT_2000_b6ac = wVar8;
    qb3f_75(wVar8,wVar8,dx_04,0xb4ca,0xb6a8);
    DAT_2000_b6ae = wVar8;
    qb3f_7b(wVar8,wVar8,dx_05,0xb7ee,0xb6b0);
    goto LAB_1000_7667;
  }
  wVar8 = DAT_2000_b698;
  uVar30 = qb3f_57((word)uVar30,DAT_2000_b698,wVar15,0xb530,0xb69c);
  wVar15 = qb3f_a1((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb530,0xb4ca);
  wVar8 = 0;
  if (!(bool)uVar20) {
    wVar8 = 0xffff;
    uVar20 = 0;
  }
  wVar18 = DAT_2000_b69a;
  uVar30 = qb3f_57(wVar15,DAT_2000_b69a,wVar8,0xb530,0xb4ca);
  uVar30 = qb3f_a1((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),0xb530,0xb4d2);
  uVar12 = (uint)((ulong)uVar30 >> 0x10);
  uVar16 = 0;
  if (!(bool)uVar20) {
    uVar16 = 0xffff;
  }
  uVar20 = 0;
  uVar23 = (uVar16 & uVar12) == 0;
  if ((bool)uVar23) {
    wVar15 = 0xb7f6;
    uVar30 = qb3f_7b((word)uVar30,0,uVar12,0xb7f6,0xb6a8);
  }
  else {
    wVar15 = 0xb7ee;
    uVar30 = qb3f_7b((word)uVar30,uVar16 & uVar12,uVar12,0xb7ee,0xb6a8);
  }
  wVar8 = DAT_2000_b698;
  uVar30 = qb3f_57((word)uVar30,DAT_2000_b698,(word)((ulong)uVar30 >> 0x10),wVar15,0xb6a8);
  uVar30 = qb3f_9b((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb6a8);
  uVar30 = qb3f_2d((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb6a8);
  wVar15 = DAT_2000_b69a;
  uVar30 = qb3f_71((word)uVar30,DAT_2000_b69a,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb6a8);
  uVar30 = qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb6a8);
  uVar30 = qb3f_9b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb6a8);
  uVar30 = qb3f_2d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb6a8);
  uVar30 = qb3f_85((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb6a8);
  uVar30 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb802);
  uVar12 = 0;
  if ((bool)uVar20) {
    uVar12 = 0xffff;
    uVar23 = 0;
  }
  wVar15 = qb3f_9f((word)uVar30,uVar12,(word)((ulong)uVar30 >> 0x10),0xb502,0xb530);
  uVar16 = 0;
  if ((bool)uVar23) {
    uVar16 = 0xffff;
  }
  uVar20 = 0;
  uVar23 = (uVar16 & uVar12) == 0;
  if ((bool)uVar23) {
    wVar8 = DAT_2000_b698;
    uVar30 = qb3f_57(wVar15,DAT_2000_b698,0,0xb502,0xb530);
    uVar30 = qb3f_9b((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb530);
    uVar30 = qb3f_2d((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb530);
    wVar15 = DAT_2000_b69a;
    uVar30 = qb3f_71((word)uVar30,DAT_2000_b69a,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb530);
    uVar30 = qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb530);
    uVar30 = qb3f_9b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb530);
    uVar30 = qb3f_2d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb530);
    uVar30 = qb3f_85((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb530);
    uVar30 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xbb6c);
    wVar15 = 0;
    if ((bool)uVar20) {
      wVar15 = 0xffff;
      uVar23 = 0;
    }
    wVar9 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb506,0xb530);
    uVar12 = 0;
    if ((bool)uVar23) {
      uVar12 = 0xffff;
    }
    uVar20 = 0;
    uVar23 = (uVar12 & wVar15) == 0;
    if ((bool)uVar23) {
      uVar30 = qb3f_9f(wVar9,wVar15,0,0xb502,0xb530);
      if ((bool)uVar23) {
        uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7ee,0xb502);
      }
      wVar18 = 0xb530;
      uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb506,0xb530);
      if ((bool)uVar23) {
        wVar18 = 0xb506;
        uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7ee,0xb506);
      }
      wVar8 = 0xb6a8;
      uVar30 = qb3f_a7((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6a8,wVar18);
      if (!(bool)uVar23) {
        wVar15 = DAT_2000_b698;
        uVar30 = qb3f_57((word)uVar30,DAT_2000_b698,(word)((ulong)uVar30 >> 0x10),0xb6a8,wVar18);
        uVar30 = qb3f_9b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,wVar18);
        uVar30 = qb3f_2d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,wVar18);
        wVar15 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb7fa);
        wVar8 = 0;
        if ((bool)uVar20) {
          wVar8 = 0xffff;
        }
        uVar30 = qb3f_57(wVar15,DAT_2000_b60a,wVar8,0xb4ca,0xb7fa);
        wVar15 = 0xb7fa;
        uVar30 = qb3f_9b((word)uVar30,0xb7fa,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb7fa);
        uVar30 = qb3f_2d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb7fa);
        uVar30 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,wVar15);
        uVar16 = (uint)((ulong)uVar30 >> 0x10);
        uVar12 = 0;
        if ((bool)uVar20) {
          uVar12 = 0xffff;
        }
        uVar20 = 0;
        uVar23 = (uVar12 & uVar16) == 0;
        if ((bool)uVar23) {
          wVar8 = 0xb7ee;
          uVar30 = qb3f_7b((word)uVar30,wVar15,uVar16,0xb7ee,0xb6a8);
          wVar18 = 0xb6a4;
          uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7ee,0xb6a4);
        }
        else {
          uVar30 = qb3f_7b((word)uVar30,wVar15,uVar16,0xb7f6,0xb6a8);
          uVar30 = qb3d_34((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xb6a8);
          uVar30 = qb3f_91((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xcf40);
          wVar15 = 0x1a;
          uVar30 = qb3d_03((word)uVar30,0x1a,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xcf40);
          uVar30 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xb570);
          if (!(bool)uVar20) {
            wVar8 = 0x6034;
            uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x6034,0xb7f6);
            wVar15 = 0;
            if ((bool)uVar23) {
              wVar15 = 0xffff;
            }
            uVar30 = qb3d_34((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x6034,0xb7f6);
            wVar18 = qb3f_91((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x6034,0xbe6e);
            wVar9 = 0x1a;
            uVar30 = qb3d_03(wVar18,0x1a,wVar15,0x6034,0xbe6e);
            wVar18 = 0xbb6c;
            uVar30 = qb3f_a1((word)uVar30,wVar9,(word)((ulong)uVar30 >> 0x10),0x6034,0xbb6c);
            uVar12 = 0;
            if ((bool)uVar20) {
              uVar12 = 0xffff;
            }
            uVar20 = 0;
            uVar23 = (uVar12 & (uint)((ulong)uVar30 >> 0x10)) == 0;
            wVar15 = 0;
            if (!(bool)uVar23) goto LAB_1000_7390;
          }
          wVar18 = 0xb6a4;
          uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xb6a4);
          wVar8 = 0xb502;
          uVar30 = qb3f_a7((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb502,0xb6a4);
          if ((bool)uVar23) {
            wVar18 = 0xb502;
            wVar8 = 0xb530;
            uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb530,0xb502);
          }
        }
      }
    }
    else {
      wVar18 = 0xb6a4;
      wVar8 = 0xb7f6;
      uVar30 = qb3f_7b(wVar9,wVar15,uVar12 & wVar15,0xb7f6,0xb6a4);
    }
  }
  else {
    wVar18 = 0xb6a4;
    wVar8 = 0xb7f6;
    uVar30 = qb3f_7b(wVar15,uVar12,uVar16 & uVar12,0xb7f6,0xb6a4);
  }
LAB_1000_7390:
  wVar15 = DAT_2000_b698;
  uVar30 = qb3f_57((word)uVar30,DAT_2000_b698,(word)((ulong)uVar30 >> 0x10),wVar8,wVar18);
  uVar30 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,0xb5c4);
  wVar15 = DAT_2000_b69a;
  uVar30 = qb3f_57((word)uVar30,DAT_2000_b69a,(word)((ulong)uVar30 >> 0x10),wVar8,0xb5c4);
  uVar30 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,0xb5c0);
  uVar30 = qb3f_a7((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6a4,0xb5c0);
  wVar15 = 0;
  if ((bool)uVar23) {
    wVar15 = 0xffff;
  }
  uVar30 = qb3d_34((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6a4,0xb5c0);
  uVar30 = qb3f_71((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b4,0xcea8);
  uVar30 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b4,0xcea8);
  wVar8 = qb3f_95((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b4,0xcea8);
  wVar18 = 0x1a;
  uVar30 = qb3d_03(wVar8,0x1a,wVar15,0xb6b4,0xcea8);
  uVar30 = qb3f_a1((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),0xb6b4,0xb7f2);
  uVar12 = (uint)((ulong)uVar30 >> 0x10);
  uVar16 = 0;
  if ((bool)uVar20) {
    uVar16 = 0xffff;
  }
  wVar15 = uVar16 | uVar12;
  uVar20 = 0;
  uVar23 = wVar15 == 0;
  if ((bool)uVar23) {
    puVar17 = (undefined2 *)0xb6a8;
    uVar30 = qb3f_9f((word)uVar30,0,uVar12,0xb6a8,0xb7f6);
    wVar8 = (word)((ulong)uVar30 >> 0x10);
    if ((bool)uVar23) {
      wVar15 = DAT_2000_b698;
      uVar30 = qb3f_57((word)uVar30,DAT_2000_b698,wVar8,0xb6a8,0xb7f6);
      wVar8 = 0xb4ca;
      uVar30 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6a8,0xb4ca);
      if ((bool)uVar23) {
        puVar17 = (undefined2 *)&DAT_2000_bb60;
        uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xbb60,0xb6b0);
        uVar30 = qb3f_57((word)uVar30,DAT_2000_b69a,(word)((ulong)uVar30 >> 0x10),0xbb60,0xb6b0);
        wVar15 = 0xb6b0;
        wVar8 = 0xb4d2;
        uVar30 = qb3f_a1((word)uVar30,0xb6b0,(word)((ulong)uVar30 >> 0x10),0xbb60,0xb4d2);
        if (!(bool)uVar20 && !(bool)uVar23) {
          puVar17 = (undefined2 *)0xb7f6;
          uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7f6,wVar15);
          wVar8 = wVar15;
        }
      }
      wVar15 = DAT_2000_b69a;
      uVar30 = qb3f_57((word)uVar30,DAT_2000_b69a,(word)((ulong)uVar30 >> 0x10),(word)puVar17,wVar8)
      ;
      uVar31 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),(word)puVar17,0xb4d2);
      if ((bool)uVar23) {
        uVar30 = qb3f_7b((word)uVar31,wVar15,(word)(uVar31 >> 0x10),0xb7d8,0xb6b0);
        uVar30 = qb3f_57((word)uVar30,DAT_2000_b698,(word)((ulong)uVar30 >> 0x10),0xb7d8,0xb6b0);
        wVar15 = 0xb6b0;
        uVar31 = qb3f_a1((word)uVar30,0xb6b0,(word)((ulong)uVar30 >> 0x10),0xb7d8,0xb4ca);
        if (!(bool)uVar20 && !(bool)uVar23) {
          uVar31 = qb3f_7b((word)uVar31,wVar15,(word)(uVar31 >> 0x10),0xb802,wVar15);
        }
      }
    }
    else {
      uVar30 = qb3f_9f((word)uVar30,wVar15,wVar8,0xb47c,0xb7f6);
      wVar15 = 0;
      if ((bool)uVar23) {
        wVar15 = 0xffff;
      }
      bVar24 = false;
      wVar8 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb47c,0xbb60);
      uVar12 = 0;
      if (bVar24) {
        uVar12 = 0xffff;
      }
      uVar20 = 0;
      uVar23 = (uVar12 | wVar15) == 0;
      if ((bool)uVar23) {
        uVar31 = (ulong)wVar8;
      }
      else {
        uVar30 = qb3f_7b(wVar8,wVar15,uVar12 | wVar15,0xb7d8,0xb6b0);
        uVar30 = qb3f_57((word)uVar30,DAT_2000_b698,(word)((ulong)uVar30 >> 0x10),0xb7d8,0xb6b0);
        wVar15 = 0xb6b0;
        uVar31 = qb3f_a1((word)uVar30,0xb6b0,(word)((ulong)uVar30 >> 0x10),0xb7d8,0xb4ca);
        if (!(bool)uVar20 && !(bool)uVar23) {
          uVar31 = qb3f_7b((word)uVar31,wVar15,(word)(uVar31 >> 0x10),0xb802,wVar15);
        }
      }
      uVar30 = qb3f_9f((word)uVar31,wVar15,(word)(uVar31 >> 0x10),0xb47c,0xb7d8);
      wVar15 = 0;
      if ((bool)uVar23) {
        wVar15 = 0xffff;
      }
      bVar24 = false;
      wVar8 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb47c,0xb802);
      uVar12 = 0;
      if (bVar24) {
        uVar12 = 0xffff;
      }
      uVar20 = 0;
      uVar23 = (uVar12 | wVar15) == 0;
      if ((bool)uVar23) {
        uVar31 = (ulong)wVar8;
      }
      else {
        uVar30 = qb3f_7b(wVar8,wVar15,uVar12 | wVar15,0xbb60,0xb6b0);
        uVar30 = qb3f_57((word)uVar30,DAT_2000_b69a,(word)((ulong)uVar30 >> 0x10),0xbb60,0xb6b0);
        wVar15 = 0xb6b0;
        uVar31 = qb3f_a1((word)uVar30,0xb6b0,(word)((ulong)uVar30 >> 0x10),0xbb60,0xb4d2);
        if (!(bool)uVar20 && !(bool)uVar23) {
          uVar31 = qb3f_7b((word)uVar31,wVar15,(word)(uVar31 >> 0x10),0xb7f6,wVar15);
        }
      }
    }
  }
  else {
    uVar30 = qb3d_34((word)uVar30,wVar15,uVar12,0xb6b4,0xb7f2);
    uVar30 = qb3f_ad((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b4,0xb7f2);
    wVar15 = 0x1a;
    uVar30 = qb3d_03((word)uVar30,0x1a,(word)((ulong)uVar30 >> 0x10),0xb6b4,0xb7f2);
    uVar30 = qb3f_81((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b4,0xb7f6);
    uVar31 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b4,0xb6b0);
  }
  uVar30 = qb3f_9f((word)uVar31,wVar15,(word)(uVar31 >> 0x10),0xb6b0,0xb7f6);
  if ((bool)uVar23) {
    uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xb5c8);
  }
  uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b0,0xb7d8);
  if ((bool)uVar23) {
    wVar15 = 0xb7d8;
    uVar30 = qb3f_7f((word)uVar30,0xb7d8,(word)((ulong)uVar30 >> 0x10),0xb5c4,0xb7f6);
    uVar30 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb5c4,0xb5c4);
    uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar15,0xb5c8);
  }
  uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b0,0xbb60);
  if ((bool)uVar23) {
    uVar30 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb5c0,0xb7f6);
    wVar15 = 0xb7f6;
    uVar30 = qb3f_7d((word)uVar30,0xb7f6,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xb5c0);
    uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar15,0xb5c8);
  }
  uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b0,0xb802);
  if ((bool)uVar23) {
    uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7d8,0xb5c8);
  }
  uVar30 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb48c,0xb7d8);
  uVar30 = qb3f_89((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb48c,0xb488);
  uVar30 = qb3f_91((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb48c,0xb5c8);
  uVar30 = qb3f_91((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb48c,0xb5c4);
  uVar30 = qb3f_91((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb48c,0xb5c0);
  uVar30 = qb3f_81((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb48c,0xbe6e);
  wVar15 = 0x1a;
  uVar30 = qb3d_39((word)uVar30,0x1a,(word)((ulong)uVar30 >> 0x10),0xb48c,0xbe6e);
  uVar30 = qb3f_91((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb48c,0xbe6e);
  uVar30 = qb3f_2d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb48c,0xbe6e);
  wVar15 = 0x1a;
  uVar30 = qb3d_03((word)uVar30,0x1a,(word)((ulong)uVar30 >> 0x10),0xb48c,0xbe6e);
  qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb48c,0xbb68);
  if (!(bool)uVar20 && !(bool)uVar23) {
    return;
  }
  DAT_2000_b6ae = DAT_2000_b698;
  DAT_2000_b6ac = DAT_2000_b69a;
  uVar30 = qb3f_9f(DAT_2000_b69a,wVar15,dx_06,0xb6b0,0xb7f6);
  wVar8 = (word)uVar30;
  if ((bool)uVar23) {
    wVar8 = wVar8 - 1;
    bVar24 = wVar8 == 1;
    DAT_2000_b6ac = wVar8;
    if ((int)wVar8 < 1) {
      DAT_2000_b6ac = 1;
    }
  }
  else {
    bVar24 = false;
  }
  uVar30 = qb3f_9f(wVar8,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b0,0xb7d8);
  wVar8 = (word)uVar30;
  if (bVar24) {
    wVar8 = DAT_2000_b698 + 1;
    bVar24 = wVar8 == 0x14;
    DAT_2000_b6ae = wVar8;
    if (0x14 < (int)wVar8) {
      DAT_2000_b6ae = 0x14;
    }
  }
  else {
    bVar24 = false;
  }
  uVar30 = qb3f_9f(wVar8,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b0,0xbb60);
  wVar8 = (word)uVar30;
  if (bVar24) {
    wVar8 = DAT_2000_b69a + 1;
    bVar24 = wVar8 == 0x13;
    DAT_2000_b6ac = wVar8;
    if (0x13 < (int)wVar8) {
      DAT_2000_b6ac = 0x13;
    }
  }
  else {
    bVar24 = false;
  }
  qb3f_9f(wVar8,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b0,0xb802);
  if ((bVar24) && (DAT_2000_b6ae = DAT_2000_b698 - 1, (int)DAT_2000_b6ae < 1)) {
    DAT_2000_b6ae = 1;
  }
LAB_1000_7667:
  if (0 < *(int *)((DAT_2000_b6ac * 0x16 + DAT_2000_b6ae) * 2 + 0x4e90)) {
    return;
  }
  uVar12 = 0;
  if (DAT_2000_b6ae == DAT_2000_b698) {
    uVar12 = 0xffff;
  }
  uVar16 = 0;
  if (DAT_2000_b6ac == DAT_2000_b69a) {
    uVar16 = 0xffff;
  }
  if ((uVar16 & uVar12) != 0) {
    return;
  }
  wVar15 = (word)((long)(int)DAT_2000_b69a * 0x16);
  wVar9 = (wVar15 + DAT_2000_b698) * 2 + 0x4e90;
  wVar8 = qb3f_13(wVar15,DAT_2000_b6ac * 0x16,
                  (word)((ulong)((long)(int)DAT_2000_b69a * 0x16) >> 0x10),
                  (DAT_2000_b6ac * 0x16 + DAT_2000_b6ae) * 2 + 0x4e90,wVar9);
  wVar18 = DAT_2000_b6ac * 0x20 + DAT_2000_b6ae;
  wVar15 = wVar18;
  uVar30 = qb3f_75(wVar8,wVar18,0xb530,0xb530,wVar9);
  bVar24 = wVar15 * 2 == 0;
  *(word *)(wVar15 * 2 + 0x2242) = wVar18;
  uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb50e,0xb7f6);
  wVar15 = (word)((ulong)uVar30 >> 0x10);
  uVar12 = 0;
  if (bVar24) {
    uVar12 = 0xffff;
  }
  bVar24 = false;
  uVar30 = qb3f_9f((word)uVar30,uVar12,wVar15,wVar15,0xb69c);
  uVar16 = 0;
  if (bVar24) {
    uVar16 = 0xffff;
  }
  uVar20 = (uVar16 & uVar12) == 0;
  if (!(bool)uVar20) {
    FUN_1000_78ff();
    return;
  }
  wVar8 = DAT_2000_b6ae;
  uVar30 = qb3f_57((word)uVar30,DAT_2000_b6ae,(word)((ulong)uVar30 >> 0x10),wVar15,0xb69c);
  wVar8 = qb3f_a1((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),wVar15,0xb4ca);
  wVar18 = 0;
  if ((bool)uVar20) {
    wVar18 = 0xffff;
  }
  uVar20 = 0;
  wVar9 = DAT_2000_b6ac;
  uVar30 = qb3f_57(wVar8,DAT_2000_b6ac,wVar18,wVar15,0xb4ca);
  uVar30 = qb3f_a1((word)uVar30,wVar9,(word)((ulong)uVar30 >> 0x10),wVar15,0xb4d2);
  uVar12 = (uint)((ulong)uVar30 >> 0x10);
  uVar16 = 0;
  if ((bool)uVar20) {
    uVar16 = 0xffff;
  }
  wVar15 = uVar16 & uVar12;
  uVar23 = 0;
  uVar20 = wVar15 == 0;
  if ((bool)uVar20) {
    uVar30 = qb3f_7b((word)uVar30,0,uVar12,0xb7ee,0xb666);
    wVar15 = DAT_2000_b698;
    uVar30 = qb3f_57((word)uVar30,DAT_2000_b698,(word)((ulong)uVar30 >> 0x10),0xb7ee,0xb666);
    wVar15 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7ee,0xb4ca);
    wVar8 = 0;
    if (!(bool)uVar20) {
      wVar8 = 0xffff;
      uVar20 = 0;
    }
    wVar18 = DAT_2000_b6ae;
    uVar30 = qb3f_57(wVar15,DAT_2000_b6ae,wVar8,0xb7ee,0xb4ca);
    uVar30 = qb3f_a1((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),0xb7ee,0xb4ca);
    uVar12 = (uint)((ulong)uVar30 >> 0x10);
    uVar16 = 0;
    if (!(bool)uVar20) {
      uVar16 = 0xffff;
    }
    uVar20 = (uVar16 & uVar12) == 0;
    if ((bool)uVar20) {
      wVar15 = DAT_2000_b69a;
      uVar30 = qb3f_57((word)uVar30,DAT_2000_b69a,uVar12,0xb7ee,0xb4ca);
      uVar30 = qb3f_9b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb4ca);
      uVar30 = qb3f_71((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb4ca);
      uVar30 = qb3f_2d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb4ca);
      wVar15 = DAT_2000_b6ac;
      uVar30 = qb3f_71((word)uVar30,DAT_2000_b6ac,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb4ca);
      uVar30 = qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb4ca);
      uVar30 = qb3f_9b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb4ca);
      uVar30 = qb3f_2d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb4ca);
      uVar30 = qb3f_a5((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb4ca);
      *(uint *)((int)unaff_BP + -0x4b2b) = *(uint *)((int)unaff_BP + -0x4b2b) ^ 0xce9;
      pbVar3 = (byte *)(wVar15 + 0xb6b8);
      bVar19 = (byte)(wVar15 >> 8);
      uVar20 = CARRY1(*pbVar3,bVar19);
      *pbVar3 = *pbVar3 + bVar19;
      uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7b0,0xb4ca);
      uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b8,0xb7f6);
      wVar8 = (word)((ulong)uVar30 >> 0x10);
      if ((bool)uVar20) {
        wVar9 = 0xb6b8;
        uVar30 = qb3f_7b((word)uVar30,0xb6b8,wVar8,0xbb60,0xb666);
        wVar18 = wVar9;
        uVar30 = qb3f_af((word)uVar30,wVar9,(word)((ulong)uVar30 >> 0x10),wVar9,0xb666);
        wVar15 = wVar18;
        uVar30 = qb3f_7d((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),wVar9,wVar18);
      }
      else {
        wVar18 = 0xb666;
        uVar30 = qb3f_7b((word)uVar30,wVar15,wVar8,0xb7f6,0xb666);
      }
    }
    else {
      wVar15 = DAT_2000_b69a;
      uVar30 = qb3f_57((word)uVar30,DAT_2000_b69a,uVar12,0xb7ee,0xb4ca);
      wVar15 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7ee,0xb4d2);
      wVar8 = 0;
      if (!(bool)uVar20) {
        wVar8 = 0xffff;
        uVar20 = 0;
      }
      wVar18 = DAT_2000_b6ac;
      uVar30 = qb3f_57(wVar15,DAT_2000_b6ac,wVar8,0xb7ee,0xb4d2);
      uVar30 = qb3f_a1((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),0xb7ee,0xb4d2);
      uVar12 = (uint)((ulong)uVar30 >> 0x10);
      uVar16 = 0;
      if (!(bool)uVar20) {
        uVar16 = 0xffff;
      }
      if ((uVar16 & uVar12) != 0) {
        return;
      }
      wVar15 = DAT_2000_b698;
      uVar30 = qb3f_57((word)uVar30,DAT_2000_b698,uVar12,0xb7ee,0xb4d2);
      uVar30 = qb3f_9b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb4d2);
      uVar30 = qb3f_71((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb4d2);
      uVar30 = qb3f_2d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb4d2);
      wVar15 = DAT_2000_b6ae;
      uVar30 = qb3f_71((word)uVar30,DAT_2000_b6ae,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb4d2);
      uVar30 = qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb4d2);
      uVar30 = qb3f_9b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb4d2);
      uVar30 = qb3f_2d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb4d2);
      uVar30 = qb3f_a5((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb4d2);
      *(uint *)((int)unaff_BP + -0x4b33) = *(uint *)((int)unaff_BP + -0x4b33) ^ 0xce9;
      pbVar3 = (byte *)(wVar15 + 0xb6b8);
      bVar19 = (byte)(wVar15 >> 8);
      uVar20 = CARRY1(*pbVar3,bVar19);
      *pbVar3 = *pbVar3 + bVar19;
      uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7b0,0xb4d2);
      uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b8,0xb7f6);
      wVar8 = (word)((ulong)uVar30 >> 0x10);
      if ((bool)uVar20) {
        wVar9 = 0xb6b8;
        uVar30 = qb3f_7b((word)uVar30,0xb6b8,wVar8,0xb7d8,0xb666);
        wVar18 = wVar9;
        uVar30 = qb3f_af((word)uVar30,wVar9,(word)((ulong)uVar30 >> 0x10),wVar9,0xb666);
        wVar15 = wVar18;
        uVar30 = qb3f_7d((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),wVar9,wVar18);
      }
      else {
        wVar18 = 0xb666;
        uVar30 = qb3f_7b((word)uVar30,wVar15,wVar8,0xb802,0xb666);
      }
    }
    uVar30 = qb3f_73((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b8,wVar18);
    uVar30 = qb3f_72((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,wVar18);
    uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,wVar18);
    bVar24 = 0xe675 < wVar15 * 8;
    wVar8 = wVar15 * 8 + 0x198a;
    uVar20 = wVar8 == 0;
    uVar30 = qb3f_a0((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7b0,wVar8);
    if (!bVar24 && !(bool)uVar20) {
      return;
    }
  }
  else {
    uVar30 = qb3f_7f((word)uVar30,wVar15,uVar12,0xb6b0,0xcbf6);
    uVar30 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb6b0,0xb666);
    uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb7f6);
    if ((bool)uVar23) {
      uVar30 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb802);
      uVar30 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb666);
    }
  }
  uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xb66e);
  do {
    uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb66e,0xb7f6);
    if ((bool)uVar20) {
      qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb47c,0xb7f6);
      uVar30 = CONCAT22(extraout_DX,wVar15);
      DAT_2000_b65e = wVar15;
    }
    qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb7f6);
    DAT_2000_b60c = wVar15;
    wVar8 = qb3f_75(wVar15,wVar15,dx,0xb4d2,0xb7f6);
    DAT_2000_b60a = wVar15;
    uVar30 = qb3f_75(wVar15,wVar8,wVar8,0xb48c,0xb7f6);
    iVar13 = (int)((ulong)uVar30 >> 0x10);
    lVar4 = (long)(int)uVar30 * 0x16;
    wVar15 = (int)lVar4 + iVar13;
    wVar18 = 0;
    if (*(int *)(wVar15 * 2 + 0x4e90) == 0) {
      wVar18 = 0xffff;
    }
    bVar24 = false;
    DAT_2000_b5de = wVar8;
    uVar12 = qb3f_9f(wVar15,wVar18,(word)((ulong)lVar4 >> 0x10),0xb50e,0xb7f6);
    uVar16 = 0;
    if (bVar24) {
      uVar16 = 0xffff;
    }
    uVar20 = (uVar16 & wVar18) == 0;
    if ((bool)uVar20) {
      uVar31 = (ulong)uVar12;
    }
    else {
      uVar31 = FUN_1000_58f7();
    }
    qb3f_9f((word)uVar31,wVar18,(word)(uVar31 >> 0x10),0xb50e,0xb7f6);
    wVar15 = 0;
    if ((bool)uVar20) {
      wVar15 = 0xffff;
    }
    wVar8 = (DAT_2000_b60a * 0x16 + DAT_2000_b60c) * 2;
    uVar12 = 0;
    if (*(int *)(wVar8 + 0x4e90) != 0) {
      uVar12 = 0xffff;
    }
    if ((uVar12 & wVar15) == 0) {
      uVar31 = (ulong)(DAT_2000_b60a * 0x16);
    }
    else {
      uVar31 = FUN_1000_49b8();
    }
    uVar30 = qb3f_75((word)uVar31,wVar15,(word)(uVar31 >> 0x10),0xb666,wVar8);
    wVar18 = wVar15 * 8 + 0x198a;
    qb3f_7c((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xc1c2,wVar18);
    wVar8 = extraout_DX_00;
    wVar9 = in_stack_00000000;
    for (DAT_2000_b5e4 = 1; wVar6 = DAT_2000_b5e4, in_stack_00000000 = wVar9, (int)DAT_2000_b5e4 < 7
        ; DAT_2000_b5e4 = DAT_2000_b5e4 + 1) {
      wVar6 = DAT_2000_b5e4 - 1;
      wVar18 = wVar6 * 2;
      uVar12 = ((undefined2 *)&DAT_2000_1f82)[wVar6];
      bVar19 = uVar12 < 5;
      cVar26 = SBORROW2(uVar12,5);
      cVar25 = (int)(uVar12 - 5) < 0;
      cVar21 = uVar12 == 5;
      if (5 < (int)uVar12) break;
      si_00 = 0xb666;
      uVar30 = qb3f_75(wVar6,wVar15,wVar8,0xb666,wVar18);
      uVar31 = qb3f_5e((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,wVar18);
      iVar13 = iVar13 + -1;
      if (iVar13 != 0 && cVar21 != '\0') goto LAB_1000_5b35;
      if (cVar26 == cVar25) goto LAB_1000_5b39;
      unaff_BP[-0x2e] = unaff_BP[-0x2e] | wVar15;
      wVar15 = qb3f_57((word)uVar31,DAT_2000_b60c,(word)(uVar31 >> 0x10),0xb666,wVar9);
      wVar8 = (DAT_2000_b60a - DAT_2000_b5e4) + 1;
      uVar30 = qb3f_71(wVar15,wVar8,DAT_2000_b60a - DAT_2000_b5e4,0xb666,wVar9);
      uVar30 = qb3f_57((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb666,wVar9);
      uVar30 = qb3f_95((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb666,wVar9);
      wVar15 = DAT_2000_b5de + 2;
      uVar30 = qb3f_71((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,wVar9);
      uVar30 = qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,wVar9);
      uVar30 = qb3f_95((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,wVar9);
      wVar15 = DAT_2000_b5ee;
      uVar30 = qb3f_71((word)uVar30,DAT_2000_b5ee,(word)((ulong)uVar30 >> 0x10),0xb666,wVar9);
      uVar30 = qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,wVar9);
      in_stack_00000000 = 0x5b1e;
      uVar7 = qb3f_8d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,wVar9);
      in_AF = 9 < ((byte)uVar7 & 0xf) | in_AF;
      uVar12 = CONCAT11((char)((uint)uVar7 >> 8) - in_AF,(byte)uVar7 + in_AF * -6) & 0xff0f;
code_r0x00015b2c:
      in_AF = 9 < ((byte)uVar12 & 0xf) | in_AF;
      bVar19 = (byte)uVar12 + in_AF * -6 & 0xf;
      cVar21 = (char)(uVar12 >> 8) - in_AF;
      pcVar5 = (code *)swi(0x3f);
      uVar30 = (*pcVar5)();
      uVar31 = CONCAT22((int)((ulong)uVar30 >> 0x10),(int)uVar30 + -0x1abb);
      iVar13 = CONCAT11(cVar21 + bVar19,bVar19);
      wVar18 = wVar9;
LAB_1000_5b35:
      cVar21 = (int)uVar31 == -0x32fd;
      bVar19 = 9 < ((byte)uVar31 & 0xf) | in_AF;
      uVar31 = CONCAT22((int)(uVar31 >> 0x10),
                        CONCAT11((char)(uVar31 >> 8) - bVar19,(byte)uVar31 + bVar19 * -6)) &
               0xffffff0f;
      in_AF = bVar19;
LAB_1000_5b39:
      wVar8 = (word)(uVar31 >> 0x10);
      if (!(bool)bVar19 && !(bool)cVar21) {
        unaff_BP = (undefined2 *)&DAT_2000_1f82;
        wVar6 = (int)uVar31 + 0x37e;
        break;
      }
      uVar20 = in(0xb5);
      uVar7 = CONCAT11((char)(uVar31 >> 8),uVar20);
      uVar30 = CONCAT22(wVar8,uVar7);
      wVar9 = wVar18 * 2;
      ((undefined2 *)&DAT_2000_1f82)[wVar18] = wVar15;
      if (wVar8 == 0) {
        ((undefined2 *)&DAT_2000_1f82)[wVar18] = 8;
        uVar30 = CONCAT22(wVar8,uVar7);
      }
      while( true ) {
        wVar8 = (word)((ulong)uVar30 >> 0x10);
        if (DAT_2000_b5e4 == 1) break;
        wVar9 = DAT_2000_b5e4 * 4 + 0x1f62;
        uVar30 = qb3f_57((word)uVar30,DAT_2000_b60c,DAT_2000_b5e4,si_00,wVar9);
        wVar8 = (word)((ulong)uVar30 >> 0x10);
        wVar15 = (DAT_2000_b60a - wVar8) + 1;
        uVar30 = qb3f_71((word)uVar30,wVar15,wVar8,si_00,wVar9);
LAB_1000_5b7f:
        uVar30 = qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),si_00,wVar9);
        wVar8 = wVar9;
        wVar18 = qb3f_95((word)uVar30,wVar9,(word)((ulong)uVar30 >> 0x10),si_00,wVar9);
        wVar15 = DAT_2000_b5de + 2;
        uVar31 = qb3f_71(wVar18,wVar15,wVar8,si_00,wVar9);
code_r0x00015b95:
        uVar30 = qb3f_57((word)uVar31,wVar15,(word)(uVar31 >> 0x10),si_00,wVar9);
        uVar30 = qb3f_95((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),si_00,wVar9);
code_r0x00015b9c:
        uVar30 = qb3f_ad((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),si_00,wVar9);
        wVar15 = DAT_2000_b5ee;
        uVar30 = qb3f_71((word)uVar30,DAT_2000_b5ee,(word)((ulong)uVar30 >> 0x10),si_00,wVar9);
        uVar30 = qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),si_00,wVar9);
        bVar19 = qb3f_8d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),si_00,wVar9);
        in_AF = 9 < (bVar19 & 0xf) | in_AF;
        bVar19 = bVar19 + in_AF * -6 & 0xf;
        while( true ) {
          in_AF = 9 < (bVar19 & 0xf) | in_AF;
          bVar19 = bVar19 + in_AF * -6 & 0xf;
          pcVar5 = (code *)swi(0x3f);
          iVar13 = (*pcVar5)();
          cVar25 = SBORROW2(iVar13 + -0x1abb,-0x74fd);
          cVar21 = iVar13 + 0x5a42 < 0;
          pcVar5 = (code *)swi(0x3f);
          uVar30 = (*pcVar5)();
          if (cVar25 == cVar21) break;
          *(int *)(si_00 + 3) = *(int *)(si_00 + 3) + si_00;
          while( true ) {
            wVar8 = DAT_2000_b5e4;
            wVar9 = DAT_2000_b5e4 * 4 + 0x1f42;
            pcVar5 = (code *)swi(0x3f);
            wVar18 = DAT_2000_b60c;
            (*pcVar5)();
            bVar24 = SCARRY2(DAT_2000_b60a - extraout_DX_01,1);
            wVar15 = (DAT_2000_b60a - extraout_DX_01) + 1;
            pcVar5 = (code *)swi(0x3f);
            uVar30 = (*pcVar5)();
            if (!bVar24) goto LAB_1000_5b7f;
            pcVar5 = (code *)swi(0x3f);
            (*pcVar5)();
            pcVar5 = (code *)swi(0x3f);
            puVar29 = (undefined2 *)(*pcVar5)();
            uVar12 = (uint)((ulong)puVar29 >> 0x10);
            unaff_BP = (undefined2 *)puVar29;
            *(byte *)(unaff_BP + wVar8 * 2 + -0x154) =
                 *(byte *)(unaff_BP + wVar8 * 2 + -0x154) | 0xb5;
            bVar24 = 0xfffd < uVar12;
            bVar27 = SCARRY2(uVar12,2);
            wVar15 = uVar12 + 2;
            bVar22 = wVar15 == 0;
            pcVar5 = (code *)swi(0x3f);
            uVar30 = (*pcVar5)();
            uVar12 = (uint)uVar30;
            if (!bVar27) {
              wVar9 = 0xe876;
              if (!bVar24 && !bVar22) goto code_r0x00015b9c;
              goto code_r0x00015b2c;
            }
            pcVar5 = (code *)swi(0x3f);
            (*pcVar5)();
            pcVar5 = (code *)swi(0x3f);
            uVar30 = (*pcVar5)();
            unaff_BP = (undefined2 *)((uint)uVar30 | 0xad3f);
            piVar1 = unaff_BP + wVar8 * 2 + 0x6b0;
            iVar13 = *piVar1;
            *piVar1 = *piVar1 + wVar18;
            in_AF = 9 < ((byte)puVar29 & 0xf) | in_AF;
            uVar31 = CONCAT22((int)((ulong)uVar30 >> 0x10),
                              CONCAT11((char)((ulong)puVar29 >> 8) - in_AF,
                                       (byte)puVar29 + in_AF * -6)) & 0xffffff0f;
            if (!SCARRY2(iVar13,wVar18)) break;
            pcVar5 = (code *)swi(0x3f);
            (*pcVar5)();
            pcVar5 = (code *)swi(0x3f);
            (*pcVar5)();
            iVar13 = (int)unaff_BP + si_00 + 0x6ebf;
            si_00 = 0x3fcd;
            bVar19 = (byte)iVar13;
            in_AF = 9 < (bVar19 & 0xf) | in_AF;
            bVar19 = bVar19 + in_AF * -6 & 0xf;
            cVar21 = (char)((uint)iVar13 >> 8) - in_AF;
            pcVar5 = (code *)swi(0x3f);
            iVar11 = (*pcVar5)();
            iVar13 = CONCAT11(cVar21 + bVar19,bVar19);
            cVar26 = SBORROW2(iVar11 + -0x1abb,-0x74fd);
            cVar25 = iVar11 + 0x5a42 < 0;
            pcVar5 = (code *)swi(0x3f);
            (*pcVar5)();
            cVar21 = (char)(wVar15 >> 8);
            if (cVar26 == cVar25) {
              unaff_BP = (undefined2 *)((int)unaff_BP + iVar13);
              pcVar2 = (char *)(unaff_BP + -0x2167);
              *pcVar2 = *pcVar2 + cVar21;
              bVar24 = (POPCOUNT(*pcVar2) & 1U) == 0;
              pcVar5 = (code *)swi(0x3f);
              (*pcVar5)();
              if (!bVar24) {
                    /* WARNING: Bad instruction - Truncating control flow here */
                halt_baddata();
              }
              in(0xb5);
            }
            else {
              unaff_BP = (undefined2 *)((int)unaff_BP + iVar13);
              pcVar2 = (char *)(unaff_BP + -0x2167);
              *pcVar2 = *pcVar2 + cVar21;
              bVar24 = (POPCOUNT(*pcVar2) & 1U) == 0;
              pcVar5 = (code *)swi(0x3f);
              uVar7 = (*pcVar5)();
              if (bVar24) {
                uVar20 = in(0xb5);
                wVar9 = 0x16;
                DAT_2000_b672 =
                     *(undefined2 *)
                      ((CONCAT11((char)((uint)uVar7 >> 8),uVar20) * 0x16 + DAT_2000_b60c + 0x16) * 2
                      + 0x4e90);
                FUN_1000_6cc5();
                wVar8 = extraout_DX_02;
                goto LAB_1000_6135;
              }
              in_AF = 9 < ((byte)uVar7 & 0xf) | in_AF;
            }
          }
          if ((bool)in_AF || *piVar1 == 0) goto code_r0x00015b95;
          Var28 = to_bcd(in_ST0);
          *(unkbyte10 *)(unaff_BP + -0x3f) = Var28;
          wVar9 = 0xbe6e;
          pcVar5 = (code *)swi(0x3f);
          Var28 = in_ST7;
          bVar19 = (*pcVar5)();
          in_ST0 = in_ST1;
          in_ST1 = in_ST2;
          in_ST2 = in_ST3;
          in_ST3 = in_ST4;
          in_ST4 = in_ST5;
          in_ST5 = in_ST6;
          in_ST6 = in_ST7;
          in_ST7 = Var28;
        }
        pcVar2 = (char *)((int)unaff_BP + wVar9 + 0xe43e);
        *pcVar2 = *pcVar2 + (char)uVar30;
        iVar13 = CONCAT11(1,bVar19);
      }
LAB_1000_6135:
      wVar18 = wVar9;
      wVar9 = in_stack_00000000;
    }
    uVar30 = qb3f_75(wVar6,wVar15,wVar8,0xb666,wVar18);
    wVar8 = wVar15 * 8 + 0x198a;
    bVar24 = wVar8 == 0;
    uVar30 = qb3f_a8((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,wVar18);
    if (bVar24) {
      uVar23 = 1 < DAT_2000_b5e4;
      wVar15 = DAT_2000_b5e4 - 2;
      uVar20 = wVar15 == 0;
      uVar30 = qb3f_56((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,wVar18);
      uVar30 = qb3f_7e((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,wVar8);
      uVar30 = qb3f_a0((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,0xcf2c);
      if (!(bool)uVar23 && !(bool)uVar20) {
        uVar30 = qb3f_7c((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xcf2c,wVar8);
      }
    }
    else {
      uVar20 = 0;
    }
    uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb47c);
    if ((bool)uVar20) {
      wVar15 = qb3e_72((word)uVar30,0xd6,0x39,0xb666,0xb47c);
      wVar8 = qb3e_73(wVar15,0x10a,0x6e,0xb666,0xb47c);
      wVar15 = 0;
      uVar20 = 1;
      uVar30 = qb3e_74(wVar8,0,0xffff,0xb666,0xb47c);
      DAT_2000_b674 = 1;
    }
    else {
      uVar20 = 0;
    }
    uVar30 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb7d0);
    wVar18 = 0xb666;
    wVar15 = qb3f_a1((word)uVar30,0xb666,(word)((ulong)uVar30 >> 0x10),0xb666,0xb47c);
    wVar8 = 0;
    if ((bool)uVar20) {
      wVar8 = 0xffff;
    }
    uVar20 = 0;
    wVar6 = 0xb47c;
    wVar9 = wVar18;
    uVar30 = qb3f_7f(wVar15,wVar18,wVar8,wVar18,0xbb60);
    uVar30 = qb3f_a1((word)uVar30,wVar9,(word)((ulong)uVar30 >> 0x10),wVar18,wVar6);
    iVar13 = 0;
    if ((bool)uVar20) {
      iVar13 = -1;
    }
    if (iVar13 == 0 && (int)((ulong)uVar30 >> 0x10) == 0) {
      wVar15 = 0;
      uVar20 = 1;
    }
    else {
      wVar15 = qb3e_72((word)uVar30,0x10b,0x5f,wVar18,wVar6);
      wVar8 = qb3e_73(wVar15,0x13f,0x95,wVar18,wVar6);
      wVar15 = 0;
      uVar20 = 1;
      uVar30 = qb3e_74(wVar8,0,0xffff,wVar18,wVar6);
      DAT_2000_b674 = 2;
    }
    uVar30 = qb3f_97((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb47c);
    uVar30 = qb3f_2d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb47c);
    uVar30 = qb3f_a1((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb7d8);
    if ((bool)uVar20) {
      wVar15 = qb3e_72((word)uVar30,0xd6,0x89,0xb666,0xb7d8);
      wVar8 = qb3e_73(wVar15,0x10a,0xbe,0xb666,0xb7d8);
      wVar15 = 0;
      uVar20 = 1;
      uVar30 = qb3e_74(wVar8,0,0xffff,0xb666,0xb7d8);
      DAT_2000_b674 = 3;
    }
    else {
      uVar20 = 0;
    }
    uVar30 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb7f6);
    wVar18 = 0xb666;
    wVar15 = qb3f_a1((word)uVar30,0xb666,(word)((ulong)uVar30 >> 0x10),0xb666,0xb47c);
    wVar8 = 0;
    if ((bool)uVar20) {
      wVar8 = 0xffff;
    }
    uVar20 = 0;
    wVar6 = 0xb47c;
    wVar9 = wVar18;
    uVar30 = qb3f_7f(wVar15,wVar18,wVar8,wVar18,0xc2d8);
    uVar30 = qb3f_a1((word)uVar30,wVar9,(word)((ulong)uVar30 >> 0x10),wVar18,wVar6);
    iVar13 = 0;
    if ((bool)uVar20) {
      iVar13 = -1;
    }
    if (iVar13 == 0 && (int)((ulong)uVar30 >> 0x10) == 0) {
      wVar15 = 0;
      uVar20 = 1;
    }
    else {
      wVar15 = qb3e_72((word)uVar30,0xa1,0x5f,wVar18,wVar6);
      wVar8 = qb3e_73(wVar15,0xd5,0x95,wVar18,wVar6);
      wVar15 = 0;
      uVar20 = 1;
      uVar30 = qb3e_74(wVar8,0,0xffff,wVar18,wVar6);
      DAT_2000_b674 = 4;
    }
    wVar15 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb66e,0xb7f6);
    wVar8 = 0;
    if ((bool)uVar20) {
      wVar8 = 0xffff;
    }
    qb3f_75(wVar15,wVar8,wVar8,0xb4d2,0xb7f6);
    wVar15 = (word)((long)(int)wVar8 * 0x16);
    uVar12 = extraout_DX_03;
    uVar30 = qb3f_75(wVar15,wVar8,(word)((ulong)((long)(int)wVar8 * 0x16) >> 0x10),0xb4ca,wVar15);
    wVar8 = (wVar8 + (word)uVar30) * 2;
    uVar16 = 0;
    if (0 < *(int *)(wVar8 + 0x4e90)) {
      uVar16 = 0xffff;
    }
    wVar15 = uVar16 & uVar12;
    uVar20 = 0;
    uVar23 = wVar15 == 0;
    wVar18 = 0xb7f6;
    uVar30 = qb3f_6f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7f6,wVar8);
    while( true ) {
      uVar30 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar18,0x4e28);
      wVar8 = 0xb7fa;
      uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb7fa);
      if (!(bool)uVar20 && !(bool)uVar23) break;
      wVar15 = 0x4e28;
      uVar30 = qb3f_75((word)uVar30,0x4e28,0x4e28,0x4e28,0xb7fa);
      bVar24 = 0xe09d < wVar15 * 4;
      qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar15 * 4 + 0x1f62,0xb7fa);
      iVar13 = 0;
      if (bVar24) {
        iVar13 = -1;
      }
      wVar8 = qb3f_7f(0xb7fa,wVar15,dx_00,dx_00,0xb7f6);
      uVar30 = qb3f_77(wVar8,wVar15,wVar15,dx_00,0xb7f6);
      bVar24 = 0xe09d < wVar15 * 4;
      wVar8 = wVar15 * 4 + 0x1f62;
      uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,(word)uVar30);
      iVar11 = (int)((ulong)uVar30 >> 0x10);
      wVar15 = (word)uVar30;
      iVar14 = 0;
      if (bVar24) {
        iVar14 = -1;
      }
      wVar18 = iVar11 * 2;
      iVar10 = 0;
      if (5 < (int)((undefined2 *)&DAT_2000_1f82)[iVar11]) {
        iVar10 = -1;
      }
      if (iVar10 != 0 || (iVar14 != 0 || iVar13 != 0)) {
        wVar15 = ((undefined2 *)&DAT_2000_1eb6)[iVar11];
        uVar30 = qb3e_84(0,wVar15,((undefined2 *)&DAT_2000_1ec6)[iVar11],wVar8,wVar18);
        wVar15 = qb3e_85((word)uVar30,wVar15,-((int)((ulong)uVar30 >> 0x10) + -0x35),wVar8,wVar18);
        wVar15 = qb3e_86(wVar15,DAT_2000_19c8,0xffff,wVar8,wVar18);
      }
      wVar8 = 0x4e28;
      uVar30 = qb3f_75(wVar15,0x4e28,0x4e28,0x4e28,wVar18);
      bVar24 = 0xe0bd < wVar8 * 4;
      qb3f_9f((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),wVar8 * 4 + 0x1f42,0xb7fa);
      uVar12 = 0;
      if (bVar24) {
        uVar12 = 0xffff;
      }
      wVar15 = qb3f_7f(0xb7fa,wVar8,dx_01,dx_01,0xb7f6);
      uVar30 = qb3f_77(wVar15,wVar8,wVar8,dx_01,0xb7f6);
      bVar24 = 0xe0bd < wVar8 * 4;
      wVar15 = wVar8 * 4 + 0x1f42;
      uVar31 = qb3f_9f((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),wVar15,(word)uVar30);
      iVar13 = (int)(uVar31 >> 0x10);
      uVar16 = 0;
      if (bVar24) {
        uVar16 = 0xffff;
      }
      wVar8 = uVar16 | uVar12;
      wVar18 = iVar13 * 2;
      iVar11 = 0;
      if (5 < (int)((undefined2 *)&DAT_2000_1f82)[iVar13]) {
        iVar11 = -1;
      }
      uVar20 = 0;
      if (iVar11 == 0 && wVar8 == 0) {
        uVar31 = uVar31 & 0xffff;
        uVar23 = 1;
      }
      else {
        wVar9 = 0x34 - ((undefined2 *)&DAT_2000_1eb6)[iVar13];
        uVar30 = qb3e_84(0,wVar9,((undefined2 *)&DAT_2000_1ec6)[iVar13],wVar15,wVar18);
        iVar13 = (int)((ulong)uVar30 >> 0x10) + -0x35;
        uVar20 = iVar13 != 0;
        wVar8 = -iVar13;
        uVar23 = wVar8 == 0;
        wVar9 = qb3e_85((word)uVar30,wVar9,wVar8,wVar15,wVar18);
        wVar8 = DAT_2000_19c8;
        uVar31 = qb3e_86(wVar9,DAT_2000_19c8,0xffff,wVar15,wVar18);
      }
      wVar15 = qb3f_a7((word)uVar31,wVar8,(word)(uVar31 >> 0x10),0xb48c,wVar18);
      wVar8 = 0;
      if (!(bool)uVar20 && !(bool)uVar23) {
        wVar8 = 0xffff;
      }
      uVar30 = qb3f_75(wVar15,wVar8,wVar8,0x4e28,wVar18);
      wVar18 = wVar8 * 2;
      iVar13 = 0;
      if (5 < (int)((undefined2 *)&DAT_2000_1f82)[wVar8]) {
        iVar13 = -1;
      }
      if (iVar13 == 0 && (int)((ulong)uVar30 >> 0x10) == 0) {
        wVar15 = 0;
        uVar20 = 1;
      }
      else {
        uVar20 = 1;
        uVar30 = qb3e_84(0,0x34 - ((undefined2 *)&DAT_2000_1eb6)[wVar8],
                         ((undefined2 *)&DAT_2000_1ec6)[wVar8],0x4e28,wVar18);
        wVar8 = qb3e_85((word)uVar30,((undefined2 *)&DAT_2000_1eb6)[wVar8],
                        (word)((ulong)uVar30 >> 0x10),0x4e28,wVar18);
        wVar15 = DAT_2000_19c8;
        uVar30 = qb3e_86(wVar8,DAT_2000_19c8,0xffff,0x4e28,wVar18);
      }
      wVar8 = 0xb7f6;
      uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb7f6);
      if (!(bool)uVar20) {
        uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb7f6);
        bVar24 = 0xe09d < wVar15 * 4;
        wVar8 = wVar15 * 4 + 0x1f62;
        bVar22 = wVar8 == 0;
        uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,0xbb6c);
        if (bVar24 || bVar22) {
          iVar13 = 0x4e28;
          uVar30 = qb3f_75((word)uVar30,0x4e28,0x4e28,0x4e28,0xbb6c);
          wVar8 = (word)((ulong)uVar30 >> 0x10);
          wVar18 = iVar13 << 1;
          wVar15 = qb3f_7f((word)uVar30,wVar18,wVar8,wVar8,0xb7d0);
          qb3f_77(wVar15,wVar18,wVar18,wVar8,0xb7d0);
          wVar9 = wVar18 * 2;
          uVar30 = qb3e_84(0,((undefined2 *)&DAT_2000_1eb6)[wVar18],
                           *(word *)((int)(undefined2 *)&DAT_2000_1ec6 + si),si,wVar9);
          wVar8 = qb3e_85((word)uVar30,*(word *)((int)(undefined2 *)&DAT_2000_1eb6 + si),
                          -((int)((ulong)uVar30 >> 0x10) + -0x35),si,wVar9);
          wVar15 = DAT_2000_19c8;
          uVar30 = qb3e_86(wVar8,DAT_2000_19c8,wVar8,si,wVar9);
        }
        else {
          wVar15 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb7d0);
          iVar13 = 0x4e28;
          qb3f_77(wVar15,0x4e28,0x4e28,0x4e28,0xb7d0);
          wVar15 = ((undefined2 *)&DAT_2000_1eb6)[iVar13];
          uVar30 = qb3e_84(0,wVar15,((undefined2 *)&DAT_2000_1ec6)[iVar13],0x4e28,iVar13 * 2);
          unaff_BP[-3] = wVar15;
          uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,iVar13 * 2);
          wVar18 = wVar15 * 2;
          unaff_BP[-4] = wVar15;
          wVar8 = ((undefined2 *)&DAT_2000_1eb6)[wVar15];
          unaff_BP[-5] = (int)((ulong)uVar30 >> 0x10);
          uVar30 = qb3e_85((word)uVar30,wVar8,((undefined2 *)&DAT_2000_1ec6)[wVar15],0x4e28,wVar18);
          unaff_BP[-6] = wVar8;
          wVar15 = DAT_2000_19c8;
          unaff_BP[-7] = (int)((ulong)uVar30 >> 0x10);
          wVar8 = qb3e_86((word)uVar30,wVar15,0xffff,0x4e28,wVar18);
          unaff_BP[-8] = wVar15;
          wVar15 = qb3e_84(wVar8,unaff_BP[-3],0x35 - unaff_BP[-5],0x4e28,wVar18);
          wVar8 = qb3e_85(wVar15,unaff_BP[-6],0x35 - unaff_BP[-7],0x4e28,wVar18);
          wVar15 = unaff_BP[-8];
          uVar30 = qb3e_86(wVar8,wVar15,0xffff,0x4e28,wVar18);
          bVar24 = 0xe09d < (uint)(unaff_BP[-4] * 4);
          wVar8 = unaff_BP[-4] * 4 + 0x1f62;
          uVar20 = wVar8 == 0;
          uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,0xbb68);
          wVar15 = 0;
          if (!bVar24 && !(bool)uVar20) {
            wVar15 = 0xffff;
            uVar20 = 0;
          }
          wVar9 = 0xbb6c;
          wVar8 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xbb6c);
          uVar12 = 0;
          if (!bVar24 && !(bool)uVar20) {
            uVar12 = 0xffff;
          }
          uVar30 = CONCAT22(uVar12 | wVar15,wVar8);
          if ((uVar12 | wVar15) == 0) {
            iVar13 = 0x4e28;
            qb3f_75(wVar8,0x4e28,0x4e28,0x4e28,0xbb6c);
            wVar18 = iVar13 * 2;
            wVar15 = *(word *)(wVar18 + 0x21aa);
            uVar20 = 1;
            wVar8 = qb3e_84(0,wVar15,0x35 - *(int *)(wVar18 + 0x218a),0x4e28,wVar18);
            wVar8 = qb3e_85(wVar8,wVar15,*(word *)(wVar18 + 0x216a),0x4e28,wVar18);
            wVar15 = DAT_2000_19c6;
            uVar30 = qb3e_86(wVar8,DAT_2000_19c6,0xffff,0x4e28,wVar18);
            wVar9 = 0xbb6c;
            uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xbb6c);
            if (!(bool)uVar20) {
              iVar13 = 0x4e28;
              qb3f_75((word)uVar30,0x4e28,0x4e28,0x4e28,0xbb6c);
              wVar9 = iVar13 * 2;
              wVar15 = *(word *)(wVar9 + 0x21ba);
              wVar18 = qb3e_85(0,wVar15,*(word *)(wVar9 + 0x217a),0x4e28,wVar9);
              wVar8 = DAT_2000_19c6;
              unaff_BP[-3] = wVar15;
              wVar15 = qb3e_86(wVar18,wVar8,0xffff,0x4e28,wVar9);
              unaff_BP[-4] = wVar8;
              wVar15 = qb3e_85(wVar15,unaff_BP[-3],0x35 - *(int *)(wVar9 + 0x219a),0x4e28,wVar9);
              wVar15 = qb3e_86(wVar15,unaff_BP[-4],0xffff,0x4e28,wVar9);
              uVar20 = 0x35 < *(uint *)(wVar9 + 0x218a);
              wVar8 = qb3e_85(wVar15,*(word *)(wVar9 + 0x21aa),0x35 - *(uint *)(wVar9 + 0x218a),
                              0x4e28,wVar9);
              wVar15 = unaff_BP[-4];
              uVar30 = qb3e_86(wVar8,wVar15,0xffff,0x4e28,wVar9);
              wVar9 = 0xb802;
              uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb802);
              if ((bool)uVar20) {
                qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb802);
                wVar9 = wVar15 * 2;
                wVar8 = qb3e_8d(0,*(int *)(wVar9 + 0x21aa) + 1,*(int *)(wVar9 + 0x216a) + 3,0x4e28,
                                wVar9);
                wVar15 = DAT_2000_19c6;
                uVar30 = qb3e_48(wVar8,DAT_2000_19c6,DAT_2000_19c6,0x4e28,wVar9);
              }
            }
          }
        }
        uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,wVar9);
        bVar24 = 0xe0bd < wVar15 * 4;
        wVar8 = wVar15 * 4 + 0x1f42;
        bVar22 = wVar8 == 0;
        uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,0xbb6c);
        if (bVar24 || bVar22) {
          iVar13 = 0x4e28;
          uVar30 = qb3f_75((word)uVar30,0x4e28,0x4e28,0x4e28,0xbb6c);
          wVar18 = (word)((ulong)uVar30 >> 0x10);
          wVar8 = iVar13 << 1;
          wVar15 = qb3f_7f((word)uVar30,wVar8,wVar18,wVar18,0xb7d0);
          qb3f_77(wVar15,wVar8,wVar8,wVar18,0xb7d0);
          uVar30 = qb3e_84(0,0x34 - ((undefined2 *)&DAT_2000_1eb6)[wVar8],
                           *(word *)((int)(undefined2 *)&DAT_2000_1ec6 + di),wVar18,di);
          wVar8 = qb3e_85((word)uVar30,0x34 - *(int *)((int)(undefined2 *)&DAT_2000_1eb6 + di),
                          -((int)((ulong)uVar30 >> 0x10) + -0x35),wVar18,di);
          wVar15 = DAT_2000_19c8;
          uVar30 = qb3e_86(wVar8,DAT_2000_19c8,wVar8,wVar18,di);
          wVar8 = di;
        }
        else {
          wVar15 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb7d0);
          iVar13 = 0x4e28;
          qb3f_77(wVar15,0x4e28,0x4e28,0x4e28,0xb7d0);
          wVar15 = 0x34 - ((undefined2 *)&DAT_2000_1eb6)[iVar13];
          uVar30 = qb3e_84(0,wVar15,((undefined2 *)&DAT_2000_1ec6)[iVar13],0x4e28,iVar13 * 2);
          unaff_BP[-3] = wVar15;
          uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,iVar13 * 2);
          wVar18 = wVar15 * 2;
          unaff_BP[-4] = wVar15;
          wVar8 = 0x34 - ((undefined2 *)&DAT_2000_1eb6)[wVar15];
          unaff_BP[-5] = (int)((ulong)uVar30 >> 0x10);
          uVar30 = qb3e_85((word)uVar30,wVar8,((undefined2 *)&DAT_2000_1ec6)[wVar15],0x4e28,wVar18);
          unaff_BP[-6] = wVar8;
          wVar15 = DAT_2000_19c8;
          unaff_BP[-7] = (int)((ulong)uVar30 >> 0x10);
          wVar8 = qb3e_86((word)uVar30,wVar15,0xffff,0x4e28,wVar18);
          unaff_BP[-8] = wVar15;
          wVar15 = qb3e_84(wVar8,unaff_BP[-3],0x35 - unaff_BP[-5],0x4e28,wVar18);
          wVar8 = qb3e_85(wVar15,unaff_BP[-6],0x35 - unaff_BP[-7],0x4e28,wVar18);
          wVar15 = unaff_BP[-8];
          uVar30 = qb3e_86(wVar8,wVar15,0xffff,0x4e28,wVar18);
          bVar24 = 0xe0bd < (uint)(unaff_BP[-4] * 4);
          wVar8 = unaff_BP[-4] * 4 + 0x1f42;
          uVar20 = wVar8 == 0;
          uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,0xbb68);
          wVar15 = 0;
          if (!bVar24 && !(bool)uVar20) {
            wVar15 = 0xffff;
            uVar20 = 0;
          }
          wVar8 = 0xbb6c;
          wVar18 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xbb6c);
          uVar12 = 0;
          if (!bVar24 && !(bool)uVar20) {
            uVar12 = 0xffff;
          }
          uVar30 = CONCAT22(uVar12 | wVar15,wVar18);
          if ((uVar12 | wVar15) == 0) {
            iVar13 = 0x4e28;
            qb3f_75(wVar18,0x4e28,0x4e28,0x4e28,0xbb6c);
            wVar18 = iVar13 * 2;
            wVar8 = 0x34 - *(int *)(wVar18 + 0x21aa);
            uVar20 = 1;
            wVar15 = qb3e_84(0,wVar8,0x35 - *(int *)(wVar18 + 0x218a),0x4e28,wVar18);
            wVar8 = qb3e_85(wVar15,wVar8,*(word *)(wVar18 + 0x216a),0x4e28,wVar18);
            wVar15 = DAT_2000_19c6;
            uVar30 = qb3e_86(wVar8,DAT_2000_19c6,0xffff,0x4e28,wVar18);
            wVar8 = 0xbb6c;
            uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xbb6c);
            if (!(bool)uVar20) {
              iVar13 = 0x4e28;
              qb3f_75((word)uVar30,0x4e28,0x4e28,0x4e28,0xbb6c);
              wVar9 = iVar13 * 2;
              wVar18 = 0x34 - *(int *)(wVar9 + 0x21ba);
              wVar8 = qb3e_85(0,wVar18,*(word *)(wVar9 + 0x217a),0x4e28,wVar9);
              wVar15 = DAT_2000_19c6;
              unaff_BP[-3] = wVar18;
              wVar8 = qb3e_86(wVar8,wVar15,0xffff,0x4e28,wVar9);
              unaff_BP[-4] = wVar15;
              wVar15 = qb3e_85(wVar8,unaff_BP[-3],0x35 - *(int *)(wVar9 + 0x219a),0x4e28,wVar9);
              wVar15 = qb3e_86(wVar15,unaff_BP[-4],0xffff,0x4e28,wVar9);
              unaff_BP[-5] = 0x35 - *(int *)(wVar9 + 0x218a);
              uVar20 = 0x34 < *(uint *)(wVar9 + 0x21aa);
              wVar8 = qb3e_85(wVar15,0x34 - *(uint *)(wVar9 + 0x21aa),unaff_BP[-5],0x4e28,wVar9);
              wVar15 = unaff_BP[-4];
              uVar30 = qb3e_86(wVar8,wVar15,0xffff,0x4e28,wVar9);
              wVar8 = 0xb802;
              uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb802);
              if ((bool)uVar20) {
                qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb802);
                wVar8 = wVar15 * 2;
                wVar18 = qb3e_8d(0,0x35 - *(int *)(wVar8 + 0x21ba),*(int *)(wVar8 + 0x216a) + 3,
                                 0x4e28,wVar8);
                wVar15 = DAT_2000_19c6;
                uVar30 = qb3e_48(wVar18,DAT_2000_19c6,DAT_2000_19c6,0x4e28,wVar8);
              }
            }
          }
        }
      }
      uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,wVar8);
      wVar8 = wVar15 * 2;
      if (7 < (int)((undefined2 *)&DAT_2000_1f82)[wVar15]) {
        wVar18 = ((undefined2 *)&DAT_2000_1eb6)[wVar15];
        uVar30 = qb3e_84(0,wVar18,0x35 - ((undefined2 *)&DAT_2000_1ec6)[wVar15],0x4e28,wVar8);
        wVar18 = qb3e_85((word)uVar30,-(wVar18 - 0x34),(word)((ulong)uVar30 >> 0x10),0x4e28,wVar8);
        wVar15 = DAT_2000_19c8;
        uVar30 = qb3e_86(wVar18,DAT_2000_19c8,0xffff,0x4e28,wVar8);
        break;
      }
      uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,wVar8);
      uVar12 = ((undefined2 *)&DAT_2000_1f82)[wVar15];
      uVar20 = uVar12 < 6;
      uVar23 = uVar12 == 6;
      if (5 < (int)uVar12) {
        iVar13 = 0x4e28;
        qb3f_75((word)uVar30,0x4e28,0x4e28,0x4e28,wVar15 * 2);
        wVar18 = iVar13 * 2;
        wVar15 = ((undefined2 *)&DAT_2000_1eb6)[iVar13];
        uVar30 = qb3e_84(0,wVar15,0x35 - ((undefined2 *)&DAT_2000_1ec6)[iVar13],0x4e28,wVar18);
        uVar20 = -(wVar15 - 0x34) == 0;
        wVar8 = qb3e_85((word)uVar30,-(wVar15 - 0x34),(word)((ulong)uVar30 >> 0x10),0x4e28,wVar18);
        wVar15 = DAT_2000_19c8;
        uVar30 = qb3e_86(wVar8,DAT_2000_19c8,0xffff,0x4e28,wVar18);
        uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7ee,0xb676);
        wVar18 = 0xb676;
        wVar8 = 0xb7fa;
        uVar30 = qb3f_9f((word)uVar30,0xb676,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb7fa);
        wVar15 = wVar18;
        if ((bool)uVar20) {
          uVar30 = qb3f_7b((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),0xb7f6,wVar18);
          wVar8 = wVar18;
        }
        uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,wVar8);
        wVar9 = wVar15 * 2;
        wVar15 = ((undefined2 *)&DAT_2000_1ec6)[wVar15];
        wVar8 = qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,wVar9);
        wVar18 = -(wVar15 * 2 + -0x35);
        uVar30 = qb3f_71(wVar8,wVar18,wVar15,0x4e28,wVar9);
        uVar30 = qb3f_57((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),0x4e28,wVar9);
        uVar30 = qb3f_89((word)uVar30,wVar9,(word)((ulong)uVar30 >> 0x10),0x4e28,0xbb60);
        puVar17 = (undefined2 *)&DAT_2000_bb60;
        uVar30 = qb3f_85((word)uVar30,wVar9,(word)((ulong)uVar30 >> 0x10),0x4e28,0xbb60);
        wVar15 = *(word *)((int)(undefined2 *)&DAT_2000_1eb6 + wVar9);
        uVar30 = qb3f_71((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,wVar9);
        qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,wVar9);
        wVar8 = -(wVar15 * 2 + -0x34);
        uVar30 = qb3f_71(wVar15,wVar8,dx_02,0x4e28,wVar9);
        uVar30 = qb3f_57((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0x4e28,wVar9);
        uVar30 = qb3f_89((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0x4e28,(word)puVar17);
        uVar30 = qb3f_71((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0x4e28,(word)puVar17);
        uVar30 = qb3f_85((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0x4e28,(word)puVar17);
        uVar30 = qb3f_81((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb676);
        unaff_BP[-3] = (int)uVar30;
        unaff_BP[-4] = (int)((ulong)uVar30 >> 0x10);
        wVar15 = qb3e_84(0xffff,0x1a,0xb7b8,0x4e28,0xb676);
        uVar30 = qb3f_57(wVar15,0x34 - unaff_BP[-3],0x35 - unaff_BP[-4],0x4e28,0xb676);
        wVar8 = 0xb676;
        uVar30 = qb3f_99((word)uVar30,0xb676,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb7c8);
        qb3f_99((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0x4e28,wVar8);
        wVar18 = qb3e_85(0,0x1a,dx_03,0x4e28,wVar8);
        wVar15 = DAT_2000_19c6;
        uVar30 = qb3e_86(wVar18,DAT_2000_19c6,1,0x4e28,wVar8);
        break;
      }
      wVar18 = 0x4e28;
      uVar30 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0x4e28,0xb7f6);
    }
    uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,wVar8);
    wVar18 = wVar15 * 8 + 0x198a;
    uVar20 = wVar18 == 0;
    uVar30 = qb3f_a8((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar18,wVar8);
    if (!(bool)uVar20) {
      uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,wVar8);
      uVar23 = 0xe675 < wVar15 * 8;
      wVar18 = wVar15 * 8 + 0x198a;
      uVar20 = wVar18 == 0;
      uVar30 = qb3f_79((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar18,wVar8);
      uVar30 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar18,0xb67a);
      wVar8 = 0xb7f6;
      uVar30 = qb3f_6f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xb67a);
      while( true ) {
        uVar30 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,0xb67e);
        wVar18 = 0xb67e;
        wVar8 = 0xb67a;
        uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb67e,0xb67a);
        if (!(bool)uVar23 && !(bool)uVar20) break;
        uVar30 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb67e,0xb7f6);
        uVar30 = qb3f_77((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb67e,0xb7f6);
        uVar23 = 0xe6a1 < wVar15 * 4;
        wVar8 = wVar15 * 4 + 0x195e;
        uVar20 = wVar8 == 0;
        uVar30 = qb3f_a7((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,0xb7f6);
        wVar18 = (word)((ulong)uVar30 >> 0x10);
        if (!(bool)uVar20) {
          uVar30 = qb3f_7b((word)uVar30,wVar15,wVar18,0xb67e,0xb682);
          wVar18 = 0xb67e;
          uVar30 = qb3f_9f((word)uVar30,0xb67e,(word)((ulong)uVar30 >> 0x10),0xb682,0xbb60);
          wVar8 = (word)((ulong)uVar30 >> 0x10);
          if ((bool)uVar23) {
            wVar15 = wVar18;
            uVar30 = qb3f_7f((word)uVar30,wVar18,wVar8,wVar18,0xb7f6);
            uVar30 = qb3f_77((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar18,0xb7f6);
            uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar15 * 4 + 0x195e,
                             0xb7f6);
            wVar8 = wVar15 * 4 + 0x18da;
            uVar20 = wVar8 == 0;
            qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,0xb686);
            uVar30 = FUN_1000_6f52();
          }
          else {
            uVar30 = qb3f_7f((word)uVar30,wVar18,wVar8,0xb67e,0xb7f6);
            uVar30 = qb3f_77((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),0xb67e,0xb7f6);
            uVar30 = qb3f_75((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),wVar18 * 4 + 0x195e,
                             0xb7f6);
            wVar15 = wVar18 * 4 + 0x1856;
            uVar20 = wVar15 == 0;
            qb3f_7b((word)uVar30,wVar18,(word)((ulong)uVar30 >> 0x10),wVar15,0xb686);
            uVar30 = FUN_1000_6eee();
            wVar15 = wVar18;
          }
          uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb67e,0xb7f6);
          if ((bool)uVar20) {
            uVar20 = 1;
            wVar8 = qb3e_89(0,0xb,0x19,0xb67e,0xb7f6);
            wVar15 = 0x4e86;
            uVar30 = qb3e_58(wVar8,0x4e86,0xff00,0xb67e,0xb7f6);
          }
          else {
            uVar20 = 0;
          }
          uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb67e,0xb7d8);
          if ((bool)uVar20) {
            uVar20 = 1;
            wVar8 = qb3e_89(0,0xd,0x1a,0xb67e,0xb7d8);
            wVar15 = 0x4e86;
            uVar30 = qb3e_58(wVar8,0x4e86,0xff00,0xb67e,0xb7d8);
          }
          else {
            uVar20 = 0;
          }
          uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb67e,0xbb60);
          if ((bool)uVar20) {
            uVar20 = 1;
            wVar8 = qb3e_89(0,0xf,0x19,0xb67e,0xbb60);
            wVar15 = 0x4e2c;
            uVar30 = qb3e_58(wVar8,0x4e2c,wVar8,0xb67e,0xbb60);
          }
          else {
            uVar20 = 0;
          }
          uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb67e,0xb802);
          if ((bool)uVar20) {
            uVar20 = 1;
            wVar8 = qb3e_89(0,0x11,0x18,0xb67e,0xb802);
            wVar15 = 0x4e2c;
            uVar30 = qb3e_58(wVar8,0x4e2c,wVar8,0xb67e,0xb802);
          }
          else {
            uVar20 = 0;
          }
          wVar8 = 0xbb6c;
          wVar18 = 0xb67e;
          uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb67e,0xbb6c);
          if ((bool)uVar20) {
            uVar20 = 1;
            wVar9 = qb3e_89(0,0x12,0x18,0xb67e,0xbb6c);
            wVar15 = 0x4e2c;
            uVar30 = qb3e_58(wVar9,0x4e2c,wVar9,0xb67e,0xbb6c);
          }
          else {
            uVar20 = 0;
          }
          break;
        }
        wVar8 = 0xb67e;
        uVar30 = qb3f_7f((word)uVar30,wVar15,wVar18,0xb67e,0xb7f6);
      }
    }
    qb3e_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar18,wVar8);
    uVar30 = FUN_1000_6de7();
    wVar18 = 0xb7f6;
    wVar8 = 0xb66e;
    uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb66e,0xb7f6);
    if ((bool)uVar20) {
LAB_1000_6ba3:
      uVar30 = qb3e_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar8,wVar18);
      uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7ee,0xb66e);
      qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb66e);
      wVar8 = (word)((long)(int)wVar15 * 0x16);
      uVar30 = qb3f_75(wVar8,wVar15,(word)((ulong)((long)(int)wVar15 * 0x16) >> 0x10),0xb4ca,wVar8);
      wVar8 = (wVar15 + (int)uVar30) * 2;
      wVar15 = *(word *)(wVar8 + 0x4e90);
      DAT_2000_b68a = wVar15;
      uVar30 = qb3f_57(wVar15,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,wVar8);
      uVar30 = qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb68c);
      if ((word)uVar30 != 0) {
        wVar15 = DAT_2000_b68a;
        uVar30 = qb3f_57((word)uVar30,DAT_2000_b68a,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb68c);
        uVar30 = qb3f_71((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xbc1e);
        uVar30 = qb3f_89((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xbc1e);
        wVar8 = 0x1a;
        uVar30 = qb3d_03((word)uVar30,0x1a,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xbc1e);
        uVar30 = qb3f_91((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xbc1e);
        uVar30 = qb3f_9d((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xbc1e);
        uVar30 = qb3f_81((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb7f6);
        qb3f_77((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb7f6);
        wVar15 = 0;
        if ((int)wVar8 < 0x13) {
          wVar15 = 0xffff;
        }
        uVar12 = 0;
        if (0x14 < (int)wVar8) {
          uVar12 = 0xffff;
        }
        uVar30 = CONCAT22(uVar12 | wVar15,wVar8);
        bVar24 = false;
        DAT_2000_b68a = wVar8;
        if ((uVar12 | wVar15) == 0) {
          uVar30 = qb3f_9f(wVar8,wVar15,0,0xb48c,0xbb68);
          if (bVar24) {
            DAT_2000_b68a = DAT_2000_b68a - 8;
          }
          else {
            uVar30 = qb3f_75((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb68c,0xbb68);
            wVar15 = ((undefined2 *)&DAT_2000_3824)[wVar15];
            if ((int)wVar15 < 0) {
              wVar15 = -wVar15;
            }
            if (0x8c < (int)wVar15) {
              DAT_2000_b68a = DAT_2000_b68a + 2;
            }
          }
        }
        uVar30 = qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xb682);
        wVar18 = DAT_2000_b68a * 4 + 0x18da;
        qb3f_7b((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),wVar18,0xb686);
        FUN_1000_6f52();
        wVar15 = qb3e_89(0,0xe1,0x70,wVar18,0xb686);
        wVar8 = 0x4e86;
        uVar30 = qb3e_58(wVar15,0x4e86,0xff03,wVar18,0xb686);
        DAT_2000_b63c = 1;
        qb3f_75((word)uVar30,wVar8,(word)((ulong)uVar30 >> 0x10),0xb4d2,0xb686);
        wVar15 = (word)((long)(int)wVar8 * 0x16);
        uVar30 = qb3f_75(wVar15,wVar8,(word)((ulong)((long)(int)wVar8 * 0x16) >> 0x10),0xb4ca,wVar15
                        );
        wVar8 = (wVar8 + (word)uVar30) * 2;
        wVar15 = *(word *)(wVar8 + 0x4e90);
        uVar30 = qb3f_57((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,wVar8);
        qb3f_7d((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb4ca,0xb68c);
      }
      return;
    }
    uVar30 = qb3f_7f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb7f6);
    wVar15 = 0xb7f6;
    uVar30 = qb3f_7d((word)uVar30,0xb7f6,(word)((ulong)uVar30 >> 0x10),0xb7f6,0xb666);
    uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xbb6c);
    if ((bool)uVar20) {
      wVar8 = 0xb666;
      uVar30 = qb3f_7b((word)uVar30,0xb666,(word)((ulong)uVar30 >> 0x10),wVar15,0xb666);
      wVar15 = wVar8;
    }
    wVar18 = 0xb47c;
    wVar8 = 0xb666;
    uVar30 = qb3f_9f((word)uVar30,wVar15,(word)((ulong)uVar30 >> 0x10),0xb666,0xb47c);
    if ((bool)uVar20) goto LAB_1000_6ba3;
    uVar20 = 0;
  } while( true );
}


// ==== FUN_1000_78ff @ 1000:78ff (size 51) callers: FUN_1000_70a1,FUN_1000_803a

/* WARNING: Instruction at (ram,0x00015bfc) overlaps instruction at (ram,0x00015bfb)
    */
/* WARNING: Control flow encountered bad instruction data */

void FUN_1000_78ff(void)

{
  int *piVar1;
  char *pcVar2;
  long lVar3;
  code *pcVar4;
  word wVar5;
  word wVar6;
  uint uVar7;
  word wVar8;
  undefined2 uVar9;
  word in_AX;
  undefined2 *di;
  undefined2 extraout_DX;
  word dx;
  uint uVar10;
  word extraout_DX_00;
  int extraout_DX_01;
  word extraout_DX_02;
  uint extraout_DX_03;
  word dx_00;
  int iVar11;
  word dx_01;
  int iVar12;
  word si;
  word di_00;
  word dx_02;
  word dx_03;
  word in_DX;
  word wVar13;
  int iVar14;
  int iVar15;
  word in_BX;
  undefined2 *unaff_BP;
  word si_00;
  word wVar16;
  undefined2 unaff_SS;
  byte bVar17;
  undefined1 in_CF;
  byte in_AF;
  undefined1 uVar18;
  char cVar19;
  bool bVar20;
  undefined1 uVar21;
  bool bVar22;
  undefined1 in_ZF;
  char cVar23;
  char cVar24;
  bool bVar25;
  unkbyte10 in_ST0;
  unkbyte10 in_ST1;
  unkbyte10 in_ST2;
  unkbyte10 in_ST3;
  unkbyte10 in_ST4;
  unkbyte10 in_ST5;
  unkbyte10 in_ST6;
  unkbyte10 Var26;
  unkbyte10 in_ST7;
  undefined2 *puVar27;
  ulong uVar28;
  undefined4 uVar29;
  word in_stack_00000000;
  
  uVar29 = qb3f_7f(in_AX,in_BX,in_DX,0xb47c,0xcbf6);
  uVar29 = qb3f_7d((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb47c,0xb666);
  uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb666,0xb7f6);
  if ((bool)in_CF) {
    uVar29 = qb3f_7f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb666,0xb802);
    uVar29 = qb3f_7d((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb666,0xb666);
  }
  uVar29 = qb3f_7b((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb7f6,0xb66e);
  do {
    uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb66e,0xb7f6);
    if ((bool)in_ZF) {
      qb3f_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb47c,0xb7f6);
      uVar29 = CONCAT22(extraout_DX,in_BX);
      DAT_2000_b65e = in_BX;
    }
    qb3f_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xb7f6);
    DAT_2000_b60c = in_BX;
    wVar5 = qb3f_75(in_BX,in_BX,dx,0xb4d2,0xb7f6);
    DAT_2000_b60a = in_BX;
    uVar29 = qb3f_75(in_BX,wVar5,wVar5,0xb48c,0xb7f6);
    iVar14 = (int)((ulong)uVar29 >> 0x10);
    lVar3 = (long)(int)uVar29 * 0x16;
    wVar6 = (int)lVar3 + iVar14;
    wVar13 = 0;
    if (*(int *)(wVar6 * 2 + 0x4e90) == 0) {
      wVar13 = 0xffff;
    }
    bVar20 = false;
    DAT_2000_b5de = wVar5;
    uVar7 = qb3f_9f(wVar6,wVar13,(word)((ulong)lVar3 >> 0x10),0xb50e,0xb7f6);
    uVar10 = 0;
    if (bVar20) {
      uVar10 = 0xffff;
    }
    uVar18 = (uVar10 & wVar13) == 0;
    if ((bool)uVar18) {
      uVar28 = (ulong)uVar7;
    }
    else {
      uVar28 = FUN_1000_58f7();
    }
    qb3f_9f((word)uVar28,wVar13,(word)(uVar28 >> 0x10),0xb50e,0xb7f6);
    wVar5 = 0;
    if ((bool)uVar18) {
      wVar5 = 0xffff;
    }
    wVar6 = (DAT_2000_b60a * 0x16 + DAT_2000_b60c) * 2;
    uVar7 = 0;
    if (*(int *)(wVar6 + 0x4e90) != 0) {
      uVar7 = 0xffff;
    }
    if ((uVar7 & wVar5) == 0) {
      uVar28 = (ulong)(DAT_2000_b60a * 0x16);
    }
    else {
      uVar28 = FUN_1000_49b8();
    }
    uVar29 = qb3f_75((word)uVar28,wVar5,(word)(uVar28 >> 0x10),0xb666,wVar6);
    wVar13 = wVar5 * 8 + 0x198a;
    qb3f_7c((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xc1c2,wVar13);
    wVar6 = extraout_DX_00;
    wVar16 = in_stack_00000000;
    for (DAT_2000_b5e4 = 1; wVar8 = DAT_2000_b5e4, in_stack_00000000 = wVar16,
        (int)DAT_2000_b5e4 < 7; DAT_2000_b5e4 = DAT_2000_b5e4 + 1) {
      wVar8 = DAT_2000_b5e4 - 1;
      wVar13 = wVar8 * 2;
      uVar7 = ((undefined2 *)&DAT_2000_1f82)[wVar8];
      bVar17 = uVar7 < 5;
      cVar24 = SBORROW2(uVar7,5);
      cVar23 = (int)(uVar7 - 5) < 0;
      cVar19 = uVar7 == 5;
      if (5 < (int)uVar7) break;
      si_00 = 0xb666;
      uVar29 = qb3f_75(wVar8,wVar5,wVar6,0xb666,wVar13);
      uVar28 = qb3f_5e((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,wVar13);
      iVar14 = iVar14 + -1;
      if (iVar14 != 0 && cVar19 != '\0') goto LAB_1000_5b35;
      if (cVar24 == cVar23) goto LAB_1000_5b39;
      unaff_BP[-0x2e] = unaff_BP[-0x2e] | wVar5;
      wVar5 = qb3f_57((word)uVar28,DAT_2000_b60c,(word)(uVar28 >> 0x10),0xb666,wVar16);
      wVar6 = (DAT_2000_b60a - DAT_2000_b5e4) + 1;
      uVar29 = qb3f_71(wVar5,wVar6,DAT_2000_b60a - DAT_2000_b5e4,0xb666,wVar16);
      uVar29 = qb3f_57((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0xb666,wVar16);
      uVar29 = qb3f_95((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0xb666,wVar16);
      wVar5 = DAT_2000_b5de + 2;
      uVar29 = qb3f_71((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,wVar16);
      uVar29 = qb3f_57((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,wVar16);
      uVar29 = qb3f_95((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,wVar16);
      wVar5 = DAT_2000_b5ee;
      uVar29 = qb3f_71((word)uVar29,DAT_2000_b5ee,(word)((ulong)uVar29 >> 0x10),0xb666,wVar16);
      uVar29 = qb3f_57((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,wVar16);
      in_stack_00000000 = 0x5b1e;
      uVar9 = qb3f_8d((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,wVar16);
      in_AF = 9 < ((byte)uVar9 & 0xf) | in_AF;
      uVar7 = CONCAT11((char)((uint)uVar9 >> 8) - in_AF,(byte)uVar9 + in_AF * -6) & 0xff0f;
code_r0x00015b2c:
      in_AF = 9 < ((byte)uVar7 & 0xf) | in_AF;
      bVar17 = (byte)uVar7 + in_AF * -6 & 0xf;
      cVar19 = (char)(uVar7 >> 8) - in_AF;
      pcVar4 = (code *)swi(0x3f);
      uVar29 = (*pcVar4)();
      uVar28 = CONCAT22((int)((ulong)uVar29 >> 0x10),(int)uVar29 + -0x1abb);
      iVar14 = CONCAT11(cVar19 + bVar17,bVar17);
      wVar13 = wVar16;
LAB_1000_5b35:
      cVar19 = (int)uVar28 == -0x32fd;
      bVar17 = 9 < ((byte)uVar28 & 0xf) | in_AF;
      uVar28 = CONCAT22((int)(uVar28 >> 0x10),
                        CONCAT11((char)(uVar28 >> 8) - bVar17,(byte)uVar28 + bVar17 * -6)) &
               0xffffff0f;
      in_AF = bVar17;
LAB_1000_5b39:
      wVar6 = (word)(uVar28 >> 0x10);
      if (!(bool)bVar17 && !(bool)cVar19) {
        unaff_BP = (undefined2 *)&DAT_2000_1f82;
        wVar8 = (int)uVar28 + 0x37e;
        break;
      }
      uVar18 = in(0xb5);
      uVar9 = CONCAT11((char)(uVar28 >> 8),uVar18);
      uVar29 = CONCAT22(wVar6,uVar9);
      wVar16 = wVar13 * 2;
      ((undefined2 *)&DAT_2000_1f82)[wVar13] = wVar5;
      if (wVar6 == 0) {
        ((undefined2 *)&DAT_2000_1f82)[wVar13] = 8;
        uVar29 = CONCAT22(wVar6,uVar9);
      }
      while( true ) {
        wVar6 = (word)((ulong)uVar29 >> 0x10);
        if (DAT_2000_b5e4 == 1) break;
        wVar16 = DAT_2000_b5e4 * 4 + 0x1f62;
        uVar29 = qb3f_57((word)uVar29,DAT_2000_b60c,DAT_2000_b5e4,si_00,wVar16);
        wVar6 = (word)((ulong)uVar29 >> 0x10);
        wVar5 = (DAT_2000_b60a - wVar6) + 1;
        uVar29 = qb3f_71((word)uVar29,wVar5,wVar6,si_00,wVar16);
LAB_1000_5b7f:
        uVar29 = qb3f_57((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),si_00,wVar16);
        wVar6 = wVar16;
        wVar13 = qb3f_95((word)uVar29,wVar16,(word)((ulong)uVar29 >> 0x10),si_00,wVar16);
        wVar5 = DAT_2000_b5de + 2;
        uVar28 = qb3f_71(wVar13,wVar5,wVar6,si_00,wVar16);
code_r0x00015b95:
        uVar29 = qb3f_57((word)uVar28,wVar5,(word)(uVar28 >> 0x10),si_00,wVar16);
        uVar29 = qb3f_95((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),si_00,wVar16);
code_r0x00015b9c:
        uVar29 = qb3f_ad((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),si_00,wVar16);
        wVar5 = DAT_2000_b5ee;
        uVar29 = qb3f_71((word)uVar29,DAT_2000_b5ee,(word)((ulong)uVar29 >> 0x10),si_00,wVar16);
        uVar29 = qb3f_57((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),si_00,wVar16);
        bVar17 = qb3f_8d((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),si_00,wVar16);
        in_AF = 9 < (bVar17 & 0xf) | in_AF;
        bVar17 = bVar17 + in_AF * -6 & 0xf;
        while( true ) {
          in_AF = 9 < (bVar17 & 0xf) | in_AF;
          bVar17 = bVar17 + in_AF * -6 & 0xf;
          pcVar4 = (code *)swi(0x3f);
          iVar14 = (*pcVar4)();
          cVar23 = SBORROW2(iVar14 + -0x1abb,-0x74fd);
          cVar19 = iVar14 + 0x5a42 < 0;
          pcVar4 = (code *)swi(0x3f);
          uVar29 = (*pcVar4)();
          if (cVar23 == cVar19) break;
          *(int *)(si_00 + 3) = *(int *)(si_00 + 3) + si_00;
          while( true ) {
            wVar6 = DAT_2000_b5e4;
            wVar16 = DAT_2000_b5e4 * 4 + 0x1f42;
            pcVar4 = (code *)swi(0x3f);
            wVar13 = DAT_2000_b60c;
            (*pcVar4)();
            bVar20 = SCARRY2(DAT_2000_b60a - extraout_DX_01,1);
            wVar5 = (DAT_2000_b60a - extraout_DX_01) + 1;
            pcVar4 = (code *)swi(0x3f);
            uVar29 = (*pcVar4)();
            if (!bVar20) goto LAB_1000_5b7f;
            pcVar4 = (code *)swi(0x3f);
            (*pcVar4)();
            pcVar4 = (code *)swi(0x3f);
            puVar27 = (undefined2 *)(*pcVar4)();
            uVar7 = (uint)((ulong)puVar27 >> 0x10);
            unaff_BP = (undefined2 *)puVar27;
            *(byte *)(unaff_BP + wVar6 * 2 + -0x154) =
                 *(byte *)(unaff_BP + wVar6 * 2 + -0x154) | 0xb5;
            bVar20 = 0xfffd < uVar7;
            bVar25 = SCARRY2(uVar7,2);
            wVar5 = uVar7 + 2;
            bVar22 = wVar5 == 0;
            pcVar4 = (code *)swi(0x3f);
            uVar29 = (*pcVar4)();
            uVar7 = (uint)uVar29;
            if (!bVar25) {
              wVar16 = 0xe876;
              if (!bVar20 && !bVar22) goto code_r0x00015b9c;
              goto code_r0x00015b2c;
            }
            pcVar4 = (code *)swi(0x3f);
            (*pcVar4)();
            pcVar4 = (code *)swi(0x3f);
            uVar29 = (*pcVar4)();
            unaff_BP = (undefined2 *)((uint)uVar29 | 0xad3f);
            piVar1 = unaff_BP + wVar6 * 2 + 0x6b0;
            iVar14 = *piVar1;
            *piVar1 = *piVar1 + wVar13;
            in_AF = 9 < ((byte)puVar27 & 0xf) | in_AF;
            uVar28 = CONCAT22((int)((ulong)uVar29 >> 0x10),
                              CONCAT11((char)((ulong)puVar27 >> 8) - in_AF,
                                       (byte)puVar27 + in_AF * -6)) & 0xffffff0f;
            if (!SCARRY2(iVar14,wVar13)) break;
            pcVar4 = (code *)swi(0x3f);
            (*pcVar4)();
            pcVar4 = (code *)swi(0x3f);
            (*pcVar4)();
            iVar14 = (int)unaff_BP + si_00 + 0x6ebf;
            si_00 = 0x3fcd;
            bVar17 = (byte)iVar14;
            in_AF = 9 < (bVar17 & 0xf) | in_AF;
            bVar17 = bVar17 + in_AF * -6 & 0xf;
            cVar19 = (char)((uint)iVar14 >> 8) - in_AF;
            pcVar4 = (code *)swi(0x3f);
            iVar12 = (*pcVar4)();
            iVar14 = CONCAT11(cVar19 + bVar17,bVar17);
            cVar24 = SBORROW2(iVar12 + -0x1abb,-0x74fd);
            cVar23 = iVar12 + 0x5a42 < 0;
            pcVar4 = (code *)swi(0x3f);
            (*pcVar4)();
            cVar19 = (char)(wVar5 >> 8);
            if (cVar24 == cVar23) {
              unaff_BP = (undefined2 *)((int)unaff_BP + iVar14);
              pcVar2 = (char *)(unaff_BP + -0x2167);
              *pcVar2 = *pcVar2 + cVar19;
              bVar20 = (POPCOUNT(*pcVar2) & 1U) == 0;
              pcVar4 = (code *)swi(0x3f);
              (*pcVar4)();
              if (!bVar20) {
                    /* WARNING: Bad instruction - Truncating control flow here */
                halt_baddata();
              }
              in(0xb5);
            }
            else {
              unaff_BP = (undefined2 *)((int)unaff_BP + iVar14);
              pcVar2 = (char *)(unaff_BP + -0x2167);
              *pcVar2 = *pcVar2 + cVar19;
              bVar20 = (POPCOUNT(*pcVar2) & 1U) == 0;
              pcVar4 = (code *)swi(0x3f);
              uVar9 = (*pcVar4)();
              if (bVar20) {
                uVar18 = in(0xb5);
                wVar16 = 0x16;
                DAT_2000_b672 =
                     *(undefined2 *)
                      ((CONCAT11((char)((uint)uVar9 >> 8),uVar18) * 0x16 + DAT_2000_b60c + 0x16) * 2
                      + 0x4e90);
                FUN_1000_6cc5();
                wVar6 = extraout_DX_02;
                goto LAB_1000_6135;
              }
              in_AF = 9 < ((byte)uVar9 & 0xf) | in_AF;
            }
          }
          if ((bool)in_AF || *piVar1 == 0) goto code_r0x00015b95;
          Var26 = to_bcd(in_ST0);
          *(unkbyte10 *)(unaff_BP + -0x3f) = Var26;
          wVar16 = 0xbe6e;
          pcVar4 = (code *)swi(0x3f);
          Var26 = in_ST7;
          bVar17 = (*pcVar4)();
          in_ST0 = in_ST1;
          in_ST1 = in_ST2;
          in_ST2 = in_ST3;
          in_ST3 = in_ST4;
          in_ST4 = in_ST5;
          in_ST5 = in_ST6;
          in_ST6 = in_ST7;
          in_ST7 = Var26;
        }
        pcVar2 = (char *)((int)unaff_BP + wVar16 + 0xe43e);
        *pcVar2 = *pcVar2 + (char)uVar29;
        iVar14 = CONCAT11(1,bVar17);
      }
LAB_1000_6135:
      wVar13 = wVar16;
      wVar16 = in_stack_00000000;
    }
    uVar29 = qb3f_75(wVar8,wVar5,wVar6,0xb666,wVar13);
    wVar6 = wVar5 * 8 + 0x198a;
    bVar20 = wVar6 == 0;
    uVar29 = qb3f_a8((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),wVar6,wVar13);
    if (bVar20) {
      uVar21 = 1 < DAT_2000_b5e4;
      wVar5 = DAT_2000_b5e4 - 2;
      uVar18 = wVar5 == 0;
      uVar29 = qb3f_56((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),wVar6,wVar13);
      uVar29 = qb3f_7e((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),wVar6,wVar6);
      uVar29 = qb3f_a0((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),wVar6,0xcf2c);
      if (!(bool)uVar21 && !(bool)uVar18) {
        uVar29 = qb3f_7c((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xcf2c,wVar6);
      }
    }
    else {
      uVar18 = 0;
    }
    uVar29 = qb3f_9f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,0xb47c);
    if ((bool)uVar18) {
      wVar5 = qb3e_72((word)uVar29,0xd6,0x39,0xb666,0xb47c);
      wVar6 = qb3e_73(wVar5,0x10a,0x6e,0xb666,0xb47c);
      wVar5 = 0;
      uVar18 = 1;
      uVar29 = qb3e_74(wVar6,0,0xffff,0xb666,0xb47c);
      DAT_2000_b674 = 1;
    }
    else {
      uVar18 = 0;
    }
    uVar29 = qb3f_7f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,0xb7d0);
    wVar13 = 0xb666;
    wVar5 = qb3f_a1((word)uVar29,0xb666,(word)((ulong)uVar29 >> 0x10),0xb666,0xb47c);
    wVar6 = 0;
    if ((bool)uVar18) {
      wVar6 = 0xffff;
    }
    uVar18 = 0;
    wVar8 = 0xb47c;
    wVar16 = wVar13;
    uVar29 = qb3f_7f(wVar5,wVar13,wVar6,wVar13,0xbb60);
    uVar29 = qb3f_a1((word)uVar29,wVar16,(word)((ulong)uVar29 >> 0x10),wVar13,wVar8);
    iVar14 = 0;
    if ((bool)uVar18) {
      iVar14 = -1;
    }
    if (iVar14 == 0 && (int)((ulong)uVar29 >> 0x10) == 0) {
      wVar5 = 0;
      uVar18 = 1;
    }
    else {
      wVar5 = qb3e_72((word)uVar29,0x10b,0x5f,wVar13,wVar8);
      wVar6 = qb3e_73(wVar5,0x13f,0x95,wVar13,wVar8);
      wVar5 = 0;
      uVar18 = 1;
      uVar29 = qb3e_74(wVar6,0,0xffff,wVar13,wVar8);
      DAT_2000_b674 = 2;
    }
    uVar29 = qb3f_97((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,0xb47c);
    uVar29 = qb3f_2d((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,0xb47c);
    uVar29 = qb3f_a1((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,0xb7d8);
    if ((bool)uVar18) {
      wVar5 = qb3e_72((word)uVar29,0xd6,0x89,0xb666,0xb7d8);
      wVar6 = qb3e_73(wVar5,0x10a,0xbe,0xb666,0xb7d8);
      wVar5 = 0;
      uVar18 = 1;
      uVar29 = qb3e_74(wVar6,0,0xffff,0xb666,0xb7d8);
      DAT_2000_b674 = 3;
    }
    else {
      uVar18 = 0;
    }
    uVar29 = qb3f_7f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb666,0xb7f6);
    wVar13 = 0xb666;
    wVar5 = qb3f_a1((word)uVar29,0xb666,(word)((ulong)uVar29 >> 0x10),0xb666,0xb47c);
    wVar6 = 0;
    if ((bool)uVar18) {
      wVar6 = 0xffff;
    }
    uVar18 = 0;
    wVar8 = 0xb47c;
    wVar16 = wVar13;
    uVar29 = qb3f_7f(wVar5,wVar13,wVar6,wVar13,0xc2d8);
    uVar29 = qb3f_a1((word)uVar29,wVar16,(word)((ulong)uVar29 >> 0x10),wVar13,wVar8);
    iVar14 = 0;
    if ((bool)uVar18) {
      iVar14 = -1;
    }
    if (iVar14 == 0 && (int)((ulong)uVar29 >> 0x10) == 0) {
      wVar5 = 0;
      uVar18 = 1;
    }
    else {
      wVar5 = qb3e_72((word)uVar29,0xa1,0x5f,wVar13,wVar8);
      wVar6 = qb3e_73(wVar5,0xd5,0x95,wVar13,wVar8);
      wVar5 = 0;
      uVar18 = 1;
      uVar29 = qb3e_74(wVar6,0,0xffff,wVar13,wVar8);
      DAT_2000_b674 = 4;
    }
    wVar5 = qb3f_9f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb66e,0xb7f6);
    wVar6 = 0;
    if ((bool)uVar18) {
      wVar6 = 0xffff;
    }
    qb3f_75(wVar5,wVar6,wVar6,0xb4d2,0xb7f6);
    wVar5 = (word)((long)(int)wVar6 * 0x16);
    uVar7 = extraout_DX_03;
    uVar29 = qb3f_75(wVar5,wVar6,(word)((ulong)((long)(int)wVar6 * 0x16) >> 0x10),0xb4ca,wVar5);
    wVar5 = (wVar6 + (word)uVar29) * 2;
    uVar10 = 0;
    if (0 < *(int *)(wVar5 + 0x4e90)) {
      uVar10 = 0xffff;
    }
    in_BX = uVar10 & uVar7;
    uVar18 = 0;
    uVar21 = in_BX == 0;
    wVar6 = 0xb7f6;
    uVar29 = qb3f_6f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb7f6,wVar5);
    while( true ) {
      uVar29 = qb3f_7d((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar6,0x4e28);
      wVar5 = 0xb7fa;
      uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb7fa);
      if (!(bool)uVar18 && !(bool)uVar21) break;
      wVar5 = 0x4e28;
      uVar29 = qb3f_75((word)uVar29,0x4e28,0x4e28,0x4e28,0xb7fa);
      bVar20 = 0xe09d < wVar5 * 4;
      qb3f_9f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),wVar5 * 4 + 0x1f62,0xb7fa);
      iVar14 = 0;
      if (bVar20) {
        iVar14 = -1;
      }
      wVar6 = qb3f_7f(0xb7fa,wVar5,dx_00,dx_00,0xb7f6);
      uVar29 = qb3f_77(wVar6,wVar5,wVar5,dx_00,0xb7f6);
      bVar20 = 0xe09d < wVar5 * 4;
      wVar6 = wVar5 * 4 + 0x1f62;
      uVar29 = qb3f_9f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),wVar6,(word)uVar29);
      iVar12 = (int)((ulong)uVar29 >> 0x10);
      wVar5 = (word)uVar29;
      iVar15 = 0;
      if (bVar20) {
        iVar15 = -1;
      }
      wVar13 = iVar12 * 2;
      iVar11 = 0;
      if (5 < (int)((undefined2 *)&DAT_2000_1f82)[iVar12]) {
        iVar11 = -1;
      }
      if (iVar11 != 0 || (iVar15 != 0 || iVar14 != 0)) {
        wVar5 = ((undefined2 *)&DAT_2000_1eb6)[iVar12];
        uVar29 = qb3e_84(0,wVar5,((undefined2 *)&DAT_2000_1ec6)[iVar12],wVar6,wVar13);
        wVar5 = qb3e_85((word)uVar29,wVar5,-((int)((ulong)uVar29 >> 0x10) + -0x35),wVar6,wVar13);
        wVar5 = qb3e_86(wVar5,DAT_2000_19c8,0xffff,wVar6,wVar13);
      }
      wVar6 = 0x4e28;
      uVar29 = qb3f_75(wVar5,0x4e28,0x4e28,0x4e28,wVar13);
      bVar20 = 0xe0bd < wVar6 * 4;
      qb3f_9f((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),wVar6 * 4 + 0x1f42,0xb7fa);
      uVar7 = 0;
      if (bVar20) {
        uVar7 = 0xffff;
      }
      wVar5 = qb3f_7f(0xb7fa,wVar6,dx_01,dx_01,0xb7f6);
      uVar29 = qb3f_77(wVar5,wVar6,wVar6,dx_01,0xb7f6);
      bVar20 = 0xe0bd < wVar6 * 4;
      wVar5 = wVar6 * 4 + 0x1f42;
      uVar28 = qb3f_9f((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),wVar5,(word)uVar29);
      iVar14 = (int)(uVar28 >> 0x10);
      uVar10 = 0;
      if (bVar20) {
        uVar10 = 0xffff;
      }
      wVar6 = uVar10 | uVar7;
      wVar13 = iVar14 * 2;
      iVar12 = 0;
      if (5 < (int)((undefined2 *)&DAT_2000_1f82)[iVar14]) {
        iVar12 = -1;
      }
      uVar18 = 0;
      if (iVar12 == 0 && wVar6 == 0) {
        uVar28 = uVar28 & 0xffff;
        uVar21 = 1;
      }
      else {
        wVar16 = 0x34 - ((undefined2 *)&DAT_2000_1eb6)[iVar14];
        uVar29 = qb3e_84(0,wVar16,((undefined2 *)&DAT_2000_1ec6)[iVar14],wVar5,wVar13);
        iVar14 = (int)((ulong)uVar29 >> 0x10) + -0x35;
        uVar18 = iVar14 != 0;
        wVar6 = -iVar14;
        uVar21 = wVar6 == 0;
        wVar16 = qb3e_85((word)uVar29,wVar16,wVar6,wVar5,wVar13);
        wVar6 = DAT_2000_19c8;
        uVar28 = qb3e_86(wVar16,DAT_2000_19c8,0xffff,wVar5,wVar13);
      }
      wVar5 = qb3f_a7((word)uVar28,wVar6,(word)(uVar28 >> 0x10),0xb48c,wVar13);
      wVar6 = 0;
      if (!(bool)uVar18 && !(bool)uVar21) {
        wVar6 = 0xffff;
      }
      uVar29 = qb3f_75(wVar5,wVar6,wVar6,0x4e28,wVar13);
      wVar5 = wVar6 * 2;
      iVar14 = 0;
      if (5 < (int)((undefined2 *)&DAT_2000_1f82)[wVar6]) {
        iVar14 = -1;
      }
      if (iVar14 == 0 && (int)((ulong)uVar29 >> 0x10) == 0) {
        in_BX = 0;
        uVar18 = 1;
      }
      else {
        uVar18 = 1;
        uVar29 = qb3e_84(0,0x34 - ((undefined2 *)&DAT_2000_1eb6)[wVar6],
                         ((undefined2 *)&DAT_2000_1ec6)[wVar6],0x4e28,wVar5);
        wVar6 = qb3e_85((word)uVar29,((undefined2 *)&DAT_2000_1eb6)[wVar6],
                        (word)((ulong)uVar29 >> 0x10),0x4e28,wVar5);
        in_BX = DAT_2000_19c8;
        uVar29 = qb3e_86(wVar6,DAT_2000_19c8,0xffff,0x4e28,wVar5);
      }
      wVar5 = 0xb7f6;
      uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb7f6);
      if (!(bool)uVar18) {
        uVar29 = qb3f_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb7f6);
        bVar20 = 0xe09d < in_BX * 4;
        wVar5 = in_BX * 4 + 0x1f62;
        bVar22 = wVar5 == 0;
        uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar5,0xbb6c);
        if (bVar20 || bVar22) {
          iVar14 = 0x4e28;
          uVar29 = qb3f_75((word)uVar29,0x4e28,0x4e28,0x4e28,0xbb6c);
          wVar6 = (word)((ulong)uVar29 >> 0x10);
          wVar13 = iVar14 << 1;
          wVar5 = qb3f_7f((word)uVar29,wVar13,wVar6,wVar6,0xb7d0);
          qb3f_77(wVar5,wVar13,wVar13,wVar6,0xb7d0);
          wVar16 = wVar13 * 2;
          uVar29 = qb3e_84(0,((undefined2 *)&DAT_2000_1eb6)[wVar13],
                           *(word *)((int)(undefined2 *)&DAT_2000_1ec6 + si),si,wVar16);
          wVar6 = qb3e_85((word)uVar29,*(word *)((int)(undefined2 *)&DAT_2000_1eb6 + si),
                          -((int)((ulong)uVar29 >> 0x10) + -0x35),si,wVar16);
          wVar5 = DAT_2000_19c8;
          uVar29 = qb3e_86(wVar6,DAT_2000_19c8,wVar6,si,wVar16);
        }
        else {
          wVar5 = qb3f_7f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb7d0);
          iVar14 = 0x4e28;
          qb3f_77(wVar5,0x4e28,0x4e28,0x4e28,0xb7d0);
          wVar5 = ((undefined2 *)&DAT_2000_1eb6)[iVar14];
          uVar29 = qb3e_84(0,wVar5,((undefined2 *)&DAT_2000_1ec6)[iVar14],0x4e28,iVar14 * 2);
          unaff_BP[-3] = wVar5;
          uVar29 = qb3f_75((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,iVar14 * 2);
          wVar13 = wVar5 * 2;
          unaff_BP[-4] = wVar5;
          wVar6 = ((undefined2 *)&DAT_2000_1eb6)[wVar5];
          unaff_BP[-5] = (int)((ulong)uVar29 >> 0x10);
          uVar29 = qb3e_85((word)uVar29,wVar6,((undefined2 *)&DAT_2000_1ec6)[wVar5],0x4e28,wVar13);
          unaff_BP[-6] = wVar6;
          wVar5 = DAT_2000_19c8;
          unaff_BP[-7] = (int)((ulong)uVar29 >> 0x10);
          wVar6 = qb3e_86((word)uVar29,wVar5,0xffff,0x4e28,wVar13);
          unaff_BP[-8] = wVar5;
          wVar5 = qb3e_84(wVar6,unaff_BP[-3],0x35 - unaff_BP[-5],0x4e28,wVar13);
          wVar6 = qb3e_85(wVar5,unaff_BP[-6],0x35 - unaff_BP[-7],0x4e28,wVar13);
          wVar5 = unaff_BP[-8];
          uVar29 = qb3e_86(wVar6,wVar5,0xffff,0x4e28,wVar13);
          bVar20 = 0xe09d < (uint)(unaff_BP[-4] * 4);
          wVar6 = unaff_BP[-4] * 4 + 0x1f62;
          uVar18 = wVar6 == 0;
          uVar29 = qb3f_9f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),wVar6,0xbb68);
          wVar5 = 0;
          if (!bVar20 && !(bool)uVar18) {
            wVar5 = 0xffff;
            uVar18 = 0;
          }
          wVar16 = 0xbb6c;
          wVar6 = qb3f_9f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,0xbb6c);
          uVar7 = 0;
          if (!bVar20 && !(bool)uVar18) {
            uVar7 = 0xffff;
          }
          uVar29 = CONCAT22(uVar7 | wVar5,wVar6);
          if ((uVar7 | wVar5) == 0) {
            iVar14 = 0x4e28;
            qb3f_75(wVar6,0x4e28,0x4e28,0x4e28,0xbb6c);
            wVar13 = iVar14 * 2;
            wVar5 = *(word *)(wVar13 + 0x21aa);
            uVar18 = 1;
            wVar6 = qb3e_84(0,wVar5,0x35 - *(int *)(wVar13 + 0x218a),0x4e28,wVar13);
            wVar6 = qb3e_85(wVar6,wVar5,*(word *)(wVar13 + 0x216a),0x4e28,wVar13);
            wVar5 = DAT_2000_19c6;
            uVar29 = qb3e_86(wVar6,DAT_2000_19c6,0xffff,0x4e28,wVar13);
            wVar16 = 0xbb6c;
            uVar29 = qb3f_9f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,0xbb6c);
            if (!(bool)uVar18) {
              iVar14 = 0x4e28;
              qb3f_75((word)uVar29,0x4e28,0x4e28,0x4e28,0xbb6c);
              wVar16 = iVar14 * 2;
              wVar5 = *(word *)(wVar16 + 0x21ba);
              wVar13 = qb3e_85(0,wVar5,*(word *)(wVar16 + 0x217a),0x4e28,wVar16);
              wVar6 = DAT_2000_19c6;
              unaff_BP[-3] = wVar5;
              wVar5 = qb3e_86(wVar13,wVar6,0xffff,0x4e28,wVar16);
              unaff_BP[-4] = wVar6;
              wVar5 = qb3e_85(wVar5,unaff_BP[-3],0x35 - *(int *)(wVar16 + 0x219a),0x4e28,wVar16);
              wVar5 = qb3e_86(wVar5,unaff_BP[-4],0xffff,0x4e28,wVar16);
              uVar18 = 0x35 < *(uint *)(wVar16 + 0x218a);
              wVar6 = qb3e_85(wVar5,*(word *)(wVar16 + 0x21aa),0x35 - *(uint *)(wVar16 + 0x218a),
                              0x4e28,wVar16);
              wVar5 = unaff_BP[-4];
              uVar29 = qb3e_86(wVar6,wVar5,0xffff,0x4e28,wVar16);
              wVar16 = 0xb802;
              uVar29 = qb3f_9f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb802);
              if ((bool)uVar18) {
                qb3f_75((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb802);
                wVar16 = wVar5 * 2;
                wVar6 = qb3e_8d(0,*(int *)(wVar16 + 0x21aa) + 1,*(int *)(wVar16 + 0x216a) + 3,0x4e28
                                ,wVar16);
                wVar5 = DAT_2000_19c6;
                uVar29 = qb3e_48(wVar6,DAT_2000_19c6,DAT_2000_19c6,0x4e28,wVar16);
              }
            }
          }
        }
        uVar29 = qb3f_75((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,wVar16);
        bVar20 = 0xe0bd < wVar5 * 4;
        wVar6 = wVar5 * 4 + 0x1f42;
        bVar22 = wVar6 == 0;
        uVar29 = qb3f_9f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),wVar6,0xbb6c);
        if (bVar20 || bVar22) {
          iVar14 = 0x4e28;
          uVar29 = qb3f_75((word)uVar29,0x4e28,0x4e28,0x4e28,0xbb6c);
          wVar6 = (word)((ulong)uVar29 >> 0x10);
          wVar13 = iVar14 << 1;
          wVar5 = qb3f_7f((word)uVar29,wVar13,wVar6,wVar6,0xb7d0);
          qb3f_77(wVar5,wVar13,wVar13,wVar6,0xb7d0);
          uVar29 = qb3e_84(0,0x34 - ((undefined2 *)&DAT_2000_1eb6)[wVar13],
                           *(word *)((int)(undefined2 *)&DAT_2000_1ec6 + di_00),wVar6,di_00);
          wVar5 = qb3e_85((word)uVar29,0x34 - *(int *)((int)(undefined2 *)&DAT_2000_1eb6 + di_00),
                          -((int)((ulong)uVar29 >> 0x10) + -0x35),wVar6,di_00);
          in_BX = DAT_2000_19c8;
          uVar29 = qb3e_86(wVar5,DAT_2000_19c8,wVar5,wVar6,di_00);
          wVar5 = di_00;
        }
        else {
          wVar5 = qb3f_7f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb7d0);
          iVar14 = 0x4e28;
          qb3f_77(wVar5,0x4e28,0x4e28,0x4e28,0xb7d0);
          wVar5 = 0x34 - ((undefined2 *)&DAT_2000_1eb6)[iVar14];
          uVar29 = qb3e_84(0,wVar5,((undefined2 *)&DAT_2000_1ec6)[iVar14],0x4e28,iVar14 * 2);
          unaff_BP[-3] = wVar5;
          uVar29 = qb3f_75((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,iVar14 * 2);
          wVar13 = wVar5 * 2;
          unaff_BP[-4] = wVar5;
          wVar6 = 0x34 - ((undefined2 *)&DAT_2000_1eb6)[wVar5];
          unaff_BP[-5] = (int)((ulong)uVar29 >> 0x10);
          uVar29 = qb3e_85((word)uVar29,wVar6,((undefined2 *)&DAT_2000_1ec6)[wVar5],0x4e28,wVar13);
          unaff_BP[-6] = wVar6;
          wVar5 = DAT_2000_19c8;
          unaff_BP[-7] = (int)((ulong)uVar29 >> 0x10);
          wVar6 = qb3e_86((word)uVar29,wVar5,0xffff,0x4e28,wVar13);
          unaff_BP[-8] = wVar5;
          wVar5 = qb3e_84(wVar6,unaff_BP[-3],0x35 - unaff_BP[-5],0x4e28,wVar13);
          wVar6 = qb3e_85(wVar5,unaff_BP[-6],0x35 - unaff_BP[-7],0x4e28,wVar13);
          wVar5 = unaff_BP[-8];
          uVar29 = qb3e_86(wVar6,wVar5,0xffff,0x4e28,wVar13);
          bVar20 = 0xe0bd < (uint)(unaff_BP[-4] * 4);
          wVar6 = unaff_BP[-4] * 4 + 0x1f42;
          uVar18 = wVar6 == 0;
          uVar29 = qb3f_9f((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),wVar6,0xbb68);
          in_BX = 0;
          if (!bVar20 && !(bool)uVar18) {
            in_BX = 0xffff;
            uVar18 = 0;
          }
          wVar5 = 0xbb6c;
          wVar6 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,0xbb6c);
          uVar7 = 0;
          if (!bVar20 && !(bool)uVar18) {
            uVar7 = 0xffff;
          }
          uVar29 = CONCAT22(uVar7 | in_BX,wVar6);
          if ((uVar7 | in_BX) == 0) {
            iVar14 = 0x4e28;
            qb3f_75(wVar6,0x4e28,0x4e28,0x4e28,0xbb6c);
            wVar13 = iVar14 * 2;
            wVar6 = 0x34 - *(int *)(wVar13 + 0x21aa);
            uVar18 = 1;
            wVar5 = qb3e_84(0,wVar6,0x35 - *(int *)(wVar13 + 0x218a),0x4e28,wVar13);
            wVar5 = qb3e_85(wVar5,wVar6,*(word *)(wVar13 + 0x216a),0x4e28,wVar13);
            in_BX = DAT_2000_19c6;
            uVar29 = qb3e_86(wVar5,DAT_2000_19c6,0xffff,0x4e28,wVar13);
            wVar5 = 0xbb6c;
            uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,0xbb6c);
            if (!(bool)uVar18) {
              iVar14 = 0x4e28;
              qb3f_75((word)uVar29,0x4e28,0x4e28,0x4e28,0xbb6c);
              wVar16 = iVar14 * 2;
              wVar13 = 0x34 - *(int *)(wVar16 + 0x21ba);
              wVar6 = qb3e_85(0,wVar13,*(word *)(wVar16 + 0x217a),0x4e28,wVar16);
              wVar5 = DAT_2000_19c6;
              unaff_BP[-3] = wVar13;
              wVar6 = qb3e_86(wVar6,wVar5,0xffff,0x4e28,wVar16);
              unaff_BP[-4] = wVar5;
              wVar5 = qb3e_85(wVar6,unaff_BP[-3],0x35 - *(int *)(wVar16 + 0x219a),0x4e28,wVar16);
              wVar5 = qb3e_86(wVar5,unaff_BP[-4],0xffff,0x4e28,wVar16);
              unaff_BP[-5] = 0x35 - *(int *)(wVar16 + 0x218a);
              uVar18 = 0x34 < *(uint *)(wVar16 + 0x21aa);
              wVar5 = qb3e_85(wVar5,0x34 - *(uint *)(wVar16 + 0x21aa),unaff_BP[-5],0x4e28,wVar16);
              in_BX = unaff_BP[-4];
              uVar29 = qb3e_86(wVar5,in_BX,0xffff,0x4e28,wVar16);
              wVar5 = 0xb802;
              uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb802);
              if ((bool)uVar18) {
                qb3f_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb802);
                wVar5 = in_BX * 2;
                wVar6 = qb3e_8d(0,0x35 - *(int *)(wVar5 + 0x21ba),*(int *)(wVar5 + 0x216a) + 3,
                                0x4e28,wVar5);
                in_BX = DAT_2000_19c6;
                uVar29 = qb3e_48(wVar6,DAT_2000_19c6,DAT_2000_19c6,0x4e28,wVar5);
              }
            }
          }
        }
      }
      uVar29 = qb3f_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,wVar5);
      wVar5 = in_BX * 2;
      if (7 < (int)((undefined2 *)&DAT_2000_1f82)[in_BX]) {
        wVar6 = ((undefined2 *)&DAT_2000_1eb6)[in_BX];
        uVar29 = qb3e_84(0,wVar6,0x35 - ((undefined2 *)&DAT_2000_1ec6)[in_BX],0x4e28,wVar5);
        wVar6 = qb3e_85((word)uVar29,-(wVar6 - 0x34),(word)((ulong)uVar29 >> 0x10),0x4e28,wVar5);
        in_BX = DAT_2000_19c8;
        uVar29 = qb3e_86(wVar6,DAT_2000_19c8,0xffff,0x4e28,wVar5);
        break;
      }
      uVar29 = qb3f_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,wVar5);
      uVar7 = ((undefined2 *)&DAT_2000_1f82)[in_BX];
      uVar18 = uVar7 < 6;
      uVar21 = uVar7 == 6;
      if (5 < (int)uVar7) {
        iVar14 = 0x4e28;
        qb3f_75((word)uVar29,0x4e28,0x4e28,0x4e28,in_BX * 2);
        wVar13 = iVar14 * 2;
        wVar5 = ((undefined2 *)&DAT_2000_1eb6)[iVar14];
        uVar29 = qb3e_84(0,wVar5,0x35 - ((undefined2 *)&DAT_2000_1ec6)[iVar14],0x4e28,wVar13);
        uVar18 = -(wVar5 - 0x34) == 0;
        wVar6 = qb3e_85((word)uVar29,-(wVar5 - 0x34),(word)((ulong)uVar29 >> 0x10),0x4e28,wVar13);
        wVar5 = DAT_2000_19c8;
        uVar29 = qb3e_86(wVar6,DAT_2000_19c8,0xffff,0x4e28,wVar13);
        uVar29 = qb3f_7b((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb7ee,0xb676);
        wVar13 = 0xb676;
        wVar6 = 0xb7fa;
        uVar29 = qb3f_9f((word)uVar29,0xb676,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb7fa);
        wVar5 = wVar13;
        if ((bool)uVar18) {
          uVar29 = qb3f_7b((word)uVar29,wVar13,(word)((ulong)uVar29 >> 0x10),0xb7f6,wVar13);
          wVar6 = wVar13;
        }
        uVar29 = qb3f_75((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,wVar6);
        wVar16 = wVar5 * 2;
        wVar5 = ((undefined2 *)&DAT_2000_1ec6)[wVar5];
        wVar6 = qb3f_57((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,wVar16);
        wVar13 = -(wVar5 * 2 + -0x35);
        uVar29 = qb3f_71(wVar6,wVar13,wVar5,0x4e28,wVar16);
        uVar29 = qb3f_57((word)uVar29,wVar13,(word)((ulong)uVar29 >> 0x10),0x4e28,wVar16);
        uVar29 = qb3f_89((word)uVar29,wVar16,(word)((ulong)uVar29 >> 0x10),0x4e28,0xbb60);
        di = (undefined2 *)&DAT_2000_bb60;
        uVar29 = qb3f_85((word)uVar29,wVar16,(word)((ulong)uVar29 >> 0x10),0x4e28,0xbb60);
        wVar5 = *(word *)((int)(undefined2 *)&DAT_2000_1eb6 + wVar16);
        uVar29 = qb3f_71((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,wVar16);
        qb3f_57((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,wVar16);
        wVar6 = -(wVar5 * 2 + -0x34);
        uVar29 = qb3f_71(wVar5,wVar6,dx_02,0x4e28,wVar16);
        uVar29 = qb3f_57((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0x4e28,wVar16);
        uVar29 = qb3f_89((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0x4e28,(word)di);
        uVar29 = qb3f_71((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0x4e28,(word)di);
        uVar29 = qb3f_85((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0x4e28,(word)di);
        uVar29 = qb3f_81((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb676);
        unaff_BP[-3] = (int)uVar29;
        unaff_BP[-4] = (int)((ulong)uVar29 >> 0x10);
        wVar5 = qb3e_84(0xffff,0x1a,0xb7b8,0x4e28,0xb676);
        uVar29 = qb3f_57(wVar5,0x34 - unaff_BP[-3],0x35 - unaff_BP[-4],0x4e28,0xb676);
        wVar5 = 0xb676;
        uVar29 = qb3f_99((word)uVar29,0xb676,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb7c8);
        qb3f_99((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0x4e28,wVar5);
        wVar6 = qb3e_85(0,0x1a,dx_03,0x4e28,wVar5);
        in_BX = DAT_2000_19c6;
        uVar29 = qb3e_86(wVar6,DAT_2000_19c6,1,0x4e28,wVar5);
        break;
      }
      wVar6 = 0x4e28;
      uVar29 = qb3f_7f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0x4e28,0xb7f6);
    }
    uVar29 = qb3f_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb666,wVar5);
    wVar6 = in_BX * 8 + 0x198a;
    uVar18 = wVar6 == 0;
    uVar29 = qb3f_a8((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar6,wVar5);
    if (!(bool)uVar18) {
      uVar29 = qb3f_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb666,wVar5);
      uVar21 = 0xe675 < in_BX * 8;
      wVar6 = in_BX * 8 + 0x198a;
      uVar18 = wVar6 == 0;
      uVar29 = qb3f_79((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar6,wVar5);
      uVar29 = qb3f_7d((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar6,0xb67a);
      wVar5 = 0xb7f6;
      uVar29 = qb3f_6f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb7f6,0xb67a);
      while( true ) {
        uVar29 = qb3f_7d((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar5,0xb67e);
        wVar6 = 0xb67e;
        wVar5 = 0xb67a;
        uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb67e,0xb67a);
        if (!(bool)uVar21 && !(bool)uVar18) break;
        uVar29 = qb3f_7f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb67e,0xb7f6);
        uVar29 = qb3f_77((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb67e,0xb7f6);
        uVar21 = 0xe6a1 < in_BX * 4;
        wVar5 = in_BX * 4 + 0x195e;
        uVar18 = wVar5 == 0;
        uVar29 = qb3f_a7((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar5,0xb7f6);
        wVar6 = (word)((ulong)uVar29 >> 0x10);
        if (!(bool)uVar18) {
          uVar29 = qb3f_7b((word)uVar29,in_BX,wVar6,0xb67e,0xb682);
          wVar6 = 0xb67e;
          uVar29 = qb3f_9f((word)uVar29,0xb67e,(word)((ulong)uVar29 >> 0x10),0xb682,0xbb60);
          wVar5 = (word)((ulong)uVar29 >> 0x10);
          if ((bool)uVar21) {
            in_BX = wVar6;
            uVar29 = qb3f_7f((word)uVar29,wVar6,wVar5,wVar6,0xb7f6);
            uVar29 = qb3f_77((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar6,0xb7f6);
            uVar29 = qb3f_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),in_BX * 4 + 0x195e,
                             0xb7f6);
            wVar5 = in_BX * 4 + 0x18da;
            uVar18 = wVar5 == 0;
            qb3f_7b((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar5,0xb686);
            uVar29 = FUN_1000_6f52();
          }
          else {
            uVar29 = qb3f_7f((word)uVar29,wVar6,wVar5,0xb67e,0xb7f6);
            uVar29 = qb3f_77((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0xb67e,0xb7f6);
            uVar29 = qb3f_75((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),wVar6 * 4 + 0x195e,
                             0xb7f6);
            wVar5 = wVar6 * 4 + 0x1856;
            uVar18 = wVar5 == 0;
            qb3f_7b((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),wVar5,0xb686);
            uVar29 = FUN_1000_6eee();
            in_BX = wVar6;
          }
          uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb67e,0xb7f6);
          if ((bool)uVar18) {
            uVar18 = 1;
            wVar5 = qb3e_89(0,0xb,0x19,0xb67e,0xb7f6);
            in_BX = 0x4e86;
            uVar29 = qb3e_58(wVar5,0x4e86,0xff00,0xb67e,0xb7f6);
          }
          else {
            uVar18 = 0;
          }
          uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb67e,0xb7d8);
          if ((bool)uVar18) {
            uVar18 = 1;
            wVar5 = qb3e_89(0,0xd,0x1a,0xb67e,0xb7d8);
            in_BX = 0x4e86;
            uVar29 = qb3e_58(wVar5,0x4e86,0xff00,0xb67e,0xb7d8);
          }
          else {
            uVar18 = 0;
          }
          uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb67e,0xbb60);
          if ((bool)uVar18) {
            uVar18 = 1;
            wVar5 = qb3e_89(0,0xf,0x19,0xb67e,0xbb60);
            in_BX = 0x4e2c;
            uVar29 = qb3e_58(wVar5,0x4e2c,wVar5,0xb67e,0xbb60);
          }
          else {
            uVar18 = 0;
          }
          uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb67e,0xb802);
          if ((bool)uVar18) {
            uVar18 = 1;
            wVar5 = qb3e_89(0,0x11,0x18,0xb67e,0xb802);
            in_BX = 0x4e2c;
            uVar29 = qb3e_58(wVar5,0x4e2c,wVar5,0xb67e,0xb802);
          }
          else {
            uVar18 = 0;
          }
          wVar5 = 0xbb6c;
          wVar6 = 0xb67e;
          uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb67e,0xbb6c);
          if ((bool)uVar18) {
            uVar18 = 1;
            wVar13 = qb3e_89(0,0x12,0x18,0xb67e,0xbb6c);
            in_BX = 0x4e2c;
            uVar29 = qb3e_58(wVar13,0x4e2c,wVar13,0xb67e,0xbb6c);
          }
          else {
            uVar18 = 0;
          }
          break;
        }
        wVar5 = 0xb67e;
        uVar29 = qb3f_7f((word)uVar29,in_BX,wVar6,0xb67e,0xb7f6);
      }
    }
    qb3e_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar6,wVar5);
    uVar29 = FUN_1000_6de7();
    wVar6 = 0xb7f6;
    wVar5 = 0xb66e;
    uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb66e,0xb7f6);
    if ((bool)uVar18) {
LAB_1000_6ba3:
      uVar29 = qb3e_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),wVar5,wVar6);
      uVar29 = qb3f_7b((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb7ee,0xb66e);
      qb3f_75((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb4d2,0xb66e);
      wVar5 = (word)((long)(int)in_BX * 0x16);
      uVar29 = qb3f_75(wVar5,in_BX,(word)((ulong)((long)(int)in_BX * 0x16) >> 0x10),0xb4ca,wVar5);
      wVar6 = (in_BX + (int)uVar29) * 2;
      wVar5 = *(word *)(wVar6 + 0x4e90);
      DAT_2000_b68a = wVar5;
      uVar29 = qb3f_57(wVar5,wVar5,(word)((ulong)uVar29 >> 0x10),0xb4ca,wVar6);
      uVar29 = qb3f_7d((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xb68c);
      if ((word)uVar29 != 0) {
        wVar5 = DAT_2000_b68a;
        uVar29 = qb3f_57((word)uVar29,DAT_2000_b68a,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xb68c);
        uVar29 = qb3f_71((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xbc1e);
        uVar29 = qb3f_89((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xbc1e);
        wVar6 = 0x1a;
        uVar29 = qb3d_03((word)uVar29,0x1a,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xbc1e);
        uVar29 = qb3f_91((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xbc1e);
        uVar29 = qb3f_9d((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xbc1e);
        uVar29 = qb3f_81((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xb7f6);
        qb3f_77((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xb7f6);
        wVar5 = 0;
        if ((int)wVar6 < 0x13) {
          wVar5 = 0xffff;
        }
        uVar7 = 0;
        if (0x14 < (int)wVar6) {
          uVar7 = 0xffff;
        }
        uVar29 = CONCAT22(uVar7 | wVar5,wVar6);
        bVar20 = false;
        DAT_2000_b68a = wVar6;
        if ((uVar7 | wVar5) == 0) {
          uVar29 = qb3f_9f(wVar6,wVar5,0,0xb48c,0xbb68);
          if (bVar20) {
            DAT_2000_b68a = DAT_2000_b68a - 8;
          }
          else {
            uVar29 = qb3f_75((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb68c,0xbb68);
            wVar5 = ((undefined2 *)&DAT_2000_3824)[wVar5];
            if ((int)wVar5 < 0) {
              wVar5 = -wVar5;
            }
            if (0x8c < (int)wVar5) {
              DAT_2000_b68a = DAT_2000_b68a + 2;
            }
          }
        }
        uVar29 = qb3f_7b((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb7f6,0xb682);
        wVar13 = DAT_2000_b68a * 4 + 0x18da;
        qb3f_7b((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),wVar13,0xb686);
        FUN_1000_6f52();
        wVar5 = qb3e_89(0,0xe1,0x70,wVar13,0xb686);
        wVar6 = 0x4e86;
        uVar29 = qb3e_58(wVar5,0x4e86,0xff03,wVar13,0xb686);
        DAT_2000_b63c = 1;
        qb3f_75((word)uVar29,wVar6,(word)((ulong)uVar29 >> 0x10),0xb4d2,0xb686);
        wVar5 = (word)((long)(int)wVar6 * 0x16);
        uVar29 = qb3f_75(wVar5,wVar6,(word)((ulong)((long)(int)wVar6 * 0x16) >> 0x10),0xb4ca,wVar5);
        wVar6 = (wVar6 + (word)uVar29) * 2;
        wVar5 = *(word *)(wVar6 + 0x4e90);
        uVar29 = qb3f_57((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb4ca,wVar6);
        qb3f_7d((word)uVar29,wVar5,(word)((ulong)uVar29 >> 0x10),0xb4ca,0xb68c);
      }
      return;
    }
    uVar29 = qb3f_7f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb666,0xb7f6);
    in_BX = 0xb7f6;
    uVar29 = qb3f_7d((word)uVar29,0xb7f6,(word)((ulong)uVar29 >> 0x10),0xb7f6,0xb666);
    uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb666,0xbb6c);
    if ((bool)uVar18) {
      wVar5 = 0xb666;
      uVar29 = qb3f_7b((word)uVar29,0xb666,(word)((ulong)uVar29 >> 0x10),in_BX,0xb666);
      in_BX = wVar5;
    }
    wVar6 = 0xb47c;
    wVar5 = 0xb666;
    uVar29 = qb3f_9f((word)uVar29,in_BX,(word)((ulong)uVar29 >> 0x10),0xb666,0xb47c);
    if ((bool)uVar18) goto LAB_1000_6ba3;
    in_ZF = 0;
  } while( true );
}


// ==== FUN_1000_7932 @ 1000:7932 (size 365) callers: FUN_1000_4275,FUN_1000_4c28

void __cdecl16near FUN_1000_7932(void)

{
  long lVar1;
  word in_AX;
  word in_DX;
  word dx;
  word in_BX;
  int iVar2;
  word wVar3;
  word bx;
  int unaff_BP;
  word wVar4;
  word wVar5;
  undefined2 unaff_SS;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar6;
  
  uVar6 = qb3f_8f(in_AX,in_BX,in_DX,0xb48c,0xbe82);
  uVar6 = qb3f_81((word)uVar6,in_BX,(word)((ulong)uVar6 >> 0x10),0xb48c,0xce48);
  uVar6 = qb3f_7d((word)uVar6,in_BX,(word)((ulong)uVar6 >> 0x10),0xb48c,0xb4fe);
  wVar4 = 0xb7f6;
  uVar6 = qb3f_6f((word)uVar6,in_BX,(word)((ulong)uVar6 >> 0x10),0xb7f6,0xb4fe);
  while( true ) {
    uVar6 = qb3f_7d((word)uVar6,in_BX,(word)((ulong)uVar6 >> 0x10),wVar4,0xb6bc);
    uVar6 = qb3f_9f((word)uVar6,in_BX,(word)((ulong)uVar6 >> 0x10),0xb6bc,0xcb6a);
    wVar4 = (word)((ulong)uVar6 >> 0x10);
    if (!(bool)in_CF && !(bool)in_ZF) break;
    wVar5 = 0xb7f6;
    uVar6 = qb3f_6f((word)uVar6,in_BX,wVar4,0xb7f6,0xcb6a);
    while( true ) {
      uVar6 = qb3f_7d((word)uVar6,in_BX,(word)((ulong)uVar6 >> 0x10),wVar5,0xb6c0);
      uVar6 = qb3f_9f((word)uVar6,in_BX,(word)((ulong)uVar6 >> 0x10),0xb6c0,0xbc1e);
      wVar5 = (word)((ulong)uVar6 >> 0x10);
      if (!(bool)in_CF && !(bool)in_ZF) break;
      qb3f_75((word)uVar6,in_BX,wVar5,0xb6bc,0xbc1e);
      iVar2 = -0x4940;
      uVar6 = qb3f_75(in_BX * 0x16,0xb6c0,0xb6c0,0xb6c0,in_BX * 0x16);
      wVar5 = (word)((ulong)uVar6 >> 0x10);
      in_BX = iVar2 + (word)uVar6;
      in_CF = (int)in_BX < 0;
      in_ZF = in_BX * 2 == 0;
      *(undefined2 *)(in_BX * 2 + 0x4e90) = 0;
      uVar6 = qb3f_7f((word)uVar6,in_BX,wVar5,wVar5,0xb7f6);
    }
    wVar4 = 0xb6bc;
    uVar6 = qb3f_7f((word)uVar6,in_BX,wVar5,0xb6bc,0xb7f6);
  }
  qb3f_75((word)uVar6,in_BX,wVar4,0xb48c,0xcb6a);
  DAT_2000_b5de = in_BX;
  if (in_BX == 0) {
    return;
  }
  lVar1 = (long)(int)in_BX * 0x28;
  wVar4 = (int)lVar1 - 0x27;
  while( true ) {
    DAT_2000_b6c4 = (int)lVar1;
    DAT_2000_b6c6 = wVar4;
    if (DAT_2000_b6c4 < (int)wVar4) break;
    while( true ) {
      DAT_2000_b6c4 = (int)lVar1;
      wVar5 = DAT_2000_b6c6 * 2;
      uVar6 = qb3f_57(wVar4,*(word *)(wVar5 + 0x2242),(word)((ulong)lVar1 >> 0x10),0xb48c,wVar5);
      uVar6 = qb3f_71((word)uVar6,wVar5,(word)((ulong)uVar6 >> 0x10),0xb48c,0xcf38);
      wVar4 = qb3f_91((word)uVar6,wVar5,(word)((ulong)uVar6 >> 0x10),0xb48c,0xcf38);
      wVar3 = 0x1a;
      uVar6 = qb3f_71(wVar4,0x1a,wVar5,0xb48c,0xcf38);
      uVar6 = qb3d_03((word)uVar6,wVar3,(word)((ulong)uVar6 >> 0x10),0xb48c,0xcf38);
      uVar6 = qb3f_ad((word)uVar6,wVar3,(word)((ulong)uVar6 >> 0x10),0xb48c,0xcf38);
      uVar6 = qb3f_9d((word)uVar6,wVar3,(word)((ulong)uVar6 >> 0x10),0xb48c,0xcf38);
      qb3f_77((word)uVar6,wVar3,(word)((ulong)uVar6 >> 0x10),0xb48c,0xcf38);
      bx = 0xb7b8;
      DAT_2000_b6c8 = wVar3;
      uVar6 = qb3d_03(wVar3,0xb7b8,dx,0xb48c,0xcf38);
      uVar6 = qb3f_77((word)uVar6,bx,(word)((ulong)uVar6 >> 0x10),0xb48c,0xcf38);
      wVar4 = (word)uVar6;
      DAT_2000_b6ca = bx;
      *(undefined2 *)(unaff_BP + -6) = (int)((ulong)uVar6 >> 0x10);
      wVar5 = (int)((long)(int)bx * 0x16) + wVar4;
      wVar3 = wVar5 * 2;
      if (*(int *)(wVar3 + 0x4e90) < 1) break;
      uVar6 = qb3d_34(wVar5,wVar4,(word)((ulong)((long)(int)bx * 0x16) >> 0x10),0xb48c,wVar3);
      uVar6 = qb3f_91((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xb48c,0xbd1e);
      wVar4 = 0x1a;
      uVar6 = qb3d_03((word)uVar6,0x1a,(word)((ulong)uVar6 >> 0x10),0xb48c,0xbd1e);
      uVar6 = qb3f_71((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xb48c,0xbd1e);
      uVar6 = qb3d_34((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xb48c,0xbd1e);
      uVar6 = qb3f_91((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xb48c,0xbd22);
      wVar5 = 0x1a;
      uVar6 = qb3d_03((word)uVar6,0x1a,(word)((ulong)uVar6 >> 0x10),0xb48c,0xbd22);
      uVar6 = qb3f_ad((word)uVar6,wVar5,(word)((ulong)uVar6 >> 0x10),0xb48c,0xbd22);
      uVar6 = qb3f_85((word)uVar6,wVar5,(word)((ulong)uVar6 >> 0x10),0xb48c,0xbd22);
      uVar6 = qb3f_81((word)uVar6,wVar5,(word)((ulong)uVar6 >> 0x10),0xb48c,0xcf44);
      uVar6 = qb3f_77((word)uVar6,wVar5,(word)((ulong)uVar6 >> 0x10),0xb48c,0xcf44);
      wVar4 = (word)uVar6;
      *(word *)(*(int *)(unaff_BP + -6) + 0x2242) = wVar5;
      lVar1 = CONCAT22((int)((ulong)uVar6 >> 0x10),DAT_2000_b6c4);
    }
    lVar1 = (long)(int)DAT_2000_b6ca;
    *(word *)(((int)(lVar1 * 0x16) + DAT_2000_b6c8) * 2 + 0x4e90) = DAT_2000_b6c6;
    lVar1 = CONCAT22((int)((ulong)(lVar1 * 0x16) >> 0x10),DAT_2000_b6c4);
    wVar4 = DAT_2000_b6c6 + 1;
    in_BX = wVar4;
  }
  uVar6 = qb3f_7b(wVar4,in_BX,(word)((ulong)lVar1 >> 0x10),0xcf48,0xb502);
  qb3f_7b((word)uVar6,in_BX,(word)((ulong)uVar6 >> 0x10),0xcf48,0xb506);
  return;
}


// ==== FUN_1000_7aa1 @ 1000:7aa1 (size 391) callers: FUN_1000_0cd2,FUN_1000_803a

void __cdecl16near FUN_1000_7aa1(void)

{
  word in_AX;
  uint uVar1;
  word wVar2;
  word in_DX;
  word extraout_DX;
  word extraout_DX_00;
  word extraout_DX_01;
  int iVar3;
  word extraout_DX_02;
  word in_BX;
  word wVar4;
  undefined1 *bx;
  undefined *bx_00;
  int unaff_BP;
  word unaff_SI;
  word unaff_DI;
  word wVar5;
  undefined2 unaff_SS;
  undefined1 uVar6;
  bool bVar7;
  undefined1 uVar8;
  char cVar9;
  char cVar10;
  undefined4 uVar11;
  
  DAT_2000_b54c = 0;
  uVar11 = qb3f_bc(in_AX,in_BX,in_DX,unaff_SI,unaff_DI);
  uVar11 = qb3f_6a((word)uVar11,0xcf4c,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  wVar4 = 0xb45e;
  uVar11 = qb3f_6e((word)uVar11,0xb45e,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  uVar1 = 1;
  wVar4 = extraout_DX;
  while( true ) {
    uVar6 = uVar1 < 9;
    uVar8 = uVar1 == 9;
    DAT_2000_b5e4 = uVar1;
    if (9 < (int)uVar1) break;
    unaff_SI = (uVar1 + 0x1b) * 4 + 0x1b92;
    bVar7 = unaff_SI == 0;
    uVar11 = qb3f_a7(uVar1 + 0x1b,uVar1,wVar4,unaff_SI,unaff_DI);
    wVar4 = (word)((ulong)uVar11 >> 0x10);
    if (bVar7) {
      uVar11 = qb3f_bc((word)uVar11,uVar1,wVar4,unaff_SI,unaff_DI);
      uVar11 = qb3f_69((word)uVar11,uVar1,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
      bx = (undefined1 *)&lit_empty;
      uVar11 = qb3f_6e((word)uVar11,0xcf5c,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
      qb3e_79((word)uVar11,(word)bx,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
      wVar4 = extraout_DX_00;
    }
    else {
      uVar11 = qb3f_bc((word)uVar11,uVar1,wVar4,unaff_SI,unaff_DI);
      wVar4 = DAT_2000_b5e4;
      wVar2 = qb3f_69((word)uVar11,DAT_2000_b5e4,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
      uVar11 = qb3f_6a(wVar2,(10 - wVar4) * 4 + 0x1b56,wVar4,unaff_SI,unaff_DI);
      wVar4 = ((int)((ulong)uVar11 >> 0x10) + 0x1b) * 4 + 0x1b92;
      uVar11 = qb3f_67((word)uVar11,wVar4,wVar4,unaff_SI,unaff_DI);
      bx_00 = (undefined *)&lit_empty;
      uVar11 = qb3f_6e((word)uVar11,0xbb56,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
      qb3e_79((word)uVar11,(word)bx_00,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
      wVar4 = extraout_DX_01;
    }
    uVar1 = DAT_2000_b5e4 + 1;
  }
  uVar11 = FUN_1000_7dc9();
  wVar4 = 0xb49c;
  uVar11 = qb3d_13((word)uVar11,0xb49c,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  uVar11 = qb3f_7a((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),unaff_SI,unaff_DI);
  uVar11 = qb3f_7d((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),unaff_SI,0x52fc);
  uVar11 = qb3f_9f((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),0x52fc,0xb7f6);
  wVar4 = 0;
  if ((bool)uVar6) {
    wVar4 = 0xffff;
    uVar8 = 0;
  }
  wVar2 = qb3f_9f((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),0x52fc,0xb7fe);
  iVar3 = 0;
  if (!(bool)uVar6 && !(bool)uVar8) {
    iVar3 = -1;
  }
  if (iVar3 != 0 || wVar4 != 0) {
    return;
  }
  wVar4 = 0xbc1a;
  uVar11 = qb3f_61(wVar2,0xbc1a,0xb49c,0x52fc,0xb7fe);
  uVar11 = qb3f_7f((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),0x52fc,0xcf70);
  uVar11 = qb3f_77((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),0x52fc,0xcf70);
  bVar7 = 0xe46d < wVar4 * 4;
  uVar11 = qb3f_9f((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),wVar4 * 4 + 0x1b92,0xb7f6);
  if (bVar7) {
    return;
  }
  wVar2 = qb3f_7f((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),0x52fc,0xcf70);
  wVar4 = 0x52fc;
  uVar11 = qb3f_77(wVar2,0x52fc,0x52fc,0x52fc,0xcf70);
  uVar1 = wVar4 * 4;
  uVar6 = 0xe46d < uVar1;
  cVar10 = SCARRY2(uVar1,0x1b92);
  wVar5 = uVar1 + 0x1b92;
  cVar9 = (int)wVar5 < 0;
  uVar8 = wVar5 == 0;
  uVar11 = qb3f_7f((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),wVar5,0xb7d0);
  uVar11 = qb3f_7d((word)uVar11,wVar4,(word)((ulong)uVar11 >> 0x10),wVar5,wVar5);
  wVar2 = (word)((ulong)uVar11 >> 0x10);
  qb3f_75((word)uVar11,wVar4,wVar2,wVar2,wVar5);
  wVar2 = extraout_DX_02;
  wVar5 = wVar4;
  while( true ) {
    DAT_2000_b54c = wVar4;
    uVar11 = qb3f_9f(wVar4,wVar5,wVar2,wVar2,0xb7fe);
    if ((bool)uVar8) {
      uVar11 = qb3f_7b((word)uVar11,wVar5,(word)((ulong)uVar11 >> 0x10),0xb4ee,0xb4f2);
    }
    uVar11 = qb3f_9f((word)uVar11,wVar5,(word)((ulong)uVar11 >> 0x10),0x52fc,0xbb6c);
    if (!(bool)uVar6 && !(bool)uVar8) {
      return;
    }
    uVar11 = qb3f_75((word)uVar11,wVar5,(word)((ulong)uVar11 >> 0x10),0x52fc,0xbb6c);
    uVar11 = qb3f_5d((word)uVar11,wVar5,(word)((ulong)uVar11 >> 0x10),0x52fc,0xbb6c);
    wVar2 = (word)((ulong)uVar11 >> 0x10);
    wVar4 = CONCAT11((char)((int)uVar11 % (int)*(char *)(unaff_BP + -0x4489)),
                     (char)((int)uVar11 / (int)*(char *)(unaff_BP + -0x4489)));
    uVar11 = CONCAT22(wVar2,wVar4);
    if (cVar10 != cVar9) {
      uVar11 = qb3f_7b(wVar4,wVar5,wVar2,0xbe6e,0xb4ca);
      qb3f_7b((word)uVar11,wVar5,(word)((ulong)uVar11 >> 0x10),0xbe6e,0xb4d2);
      return;
    }
    if (cVar10 != cVar9) break;
    if (cVar10 != cVar9) goto LAB_1000_7c36;
    if (cVar10 == cVar9) {
      uVar11 = qb3f_7f(wVar4,wVar5,wVar2,0xb48c,0xb7d0);
      qb3f_7d((word)uVar11,wVar5,(word)((ulong)uVar11 >> 0x10),0xb48c,0xb48c);
      DAT_2000_b54a = 1;
      return;
    }
  }
  uVar11 = qb3f_9f(wVar4,wVar5,wVar2,0x52fc,0xbb6c);
  if ((bool)uVar6 || (bool)uVar8) {
    return;
  }
LAB_1000_7c36:
  qb3f_7b((word)uVar11,wVar5,(word)((ulong)uVar11 >> 0x10),0xbb6c,0x52fc);
  return;
}


// ==== FUN_1000_7c49 @ 1000:7c49 (size 384) callers: FUN_1000_0cd2,FUN_1000_803a

void __cdecl16near FUN_1000_7c49(void)

{
  word in_AX;
  word wVar1;
  uint bx;
  word in_DX;
  uint extraout_DX;
  word extraout_DX_00;
  word extraout_DX_01;
  int iVar2;
  word wVar3;
  undefined1 *bx_00;
  undefined *bx_01;
  word bx_02;
  word unaff_SI;
  word unaff_DI;
  undefined1 uVar4;
  bool bVar5;
  undefined1 uVar6;
  undefined4 uVar7;
  
  uVar7 = qb3e_42(in_AX,10,in_DX,unaff_SI,unaff_DI);
  wVar3 = 1;
  uVar7 = qb3e_44((word)uVar7,1,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = qb3f_bc((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  uVar7 = qb3f_6a(wVar1,0xcf74,wVar3,unaff_SI,unaff_DI);
  wVar1 = 0xb45e;
  uVar7 = qb3f_6e((word)uVar7,0xb45e,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  bx = extraout_DX;
  wVar1 = extraout_DX;
  while( true ) {
    uVar4 = bx < 6;
    uVar6 = bx == 6;
    DAT_2000_b5e4 = bx;
    if (6 < (int)bx) break;
    unaff_SI = (bx + 0x15) * 4 + 0x1b92;
    bVar5 = unaff_SI == 0;
    uVar7 = qb3f_a7(bx + 0x15,bx,wVar1,unaff_SI,unaff_DI);
    wVar1 = (word)((ulong)uVar7 >> 0x10);
    if (bVar5) {
      uVar7 = qb3f_bc((word)uVar7,bx,wVar1,unaff_SI,unaff_DI);
      uVar7 = qb3f_69((word)uVar7,bx,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
      bx_00 = (undefined1 *)&lit_empty;
      uVar7 = qb3f_6e((word)uVar7,0xcf5c,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
      qb3e_79((word)uVar7,(word)bx_00,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
      wVar1 = extraout_DX_00;
    }
    else {
      uVar7 = qb3f_bc((word)uVar7,bx,wVar1,unaff_SI,unaff_DI);
      wVar1 = DAT_2000_b5e4;
      wVar3 = qb3f_69((word)uVar7,DAT_2000_b5e4,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
      uVar7 = qb3f_6a(wVar3,wVar1 * 4 + 0x1b56,wVar1,unaff_SI,unaff_DI);
      wVar1 = ((int)((ulong)uVar7 >> 0x10) + 0x15) * 4 + 0x1b92;
      uVar7 = qb3f_67((word)uVar7,wVar1,wVar1,unaff_SI,unaff_DI);
      bx_01 = (undefined *)&lit_empty;
      uVar7 = qb3f_6e((word)uVar7,0xbb56,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
      qb3e_79((word)uVar7,(word)bx_01,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
      wVar1 = extraout_DX_01;
    }
    bx = DAT_2000_b5e4 + 1;
  }
  uVar7 = FUN_1000_7dc9();
  wVar1 = 0xb49c;
  uVar7 = qb3d_13((word)uVar7,0xb49c,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  uVar7 = qb3f_7a((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),unaff_SI,unaff_DI);
  uVar7 = qb3f_7d((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),unaff_SI,0x52fc);
  uVar7 = qb3f_9f((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),0x52fc,0xb7f6);
  wVar1 = 0;
  if ((bool)uVar4) {
    wVar1 = 0xffff;
    uVar6 = 0;
  }
  wVar3 = qb3f_9f((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),0x52fc,0xb7fa);
  iVar2 = 0;
  if (!(bool)uVar4 && !(bool)uVar6) {
    iVar2 = -1;
  }
  if (iVar2 != 0 || wVar1 != 0) {
    return;
  }
  wVar1 = 0xbc1a;
  uVar7 = qb3f_61(wVar3,0xbc1a,0xb49c,0x52fc,0xb7fa);
  uVar7 = qb3f_7f((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),0x52fc,0xbe6a);
  uVar7 = qb3f_77((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),0x52fc,0xbe6a);
  bVar5 = 0xe46d < wVar1 * 4;
  uVar7 = qb3f_9f((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),wVar1 * 4 + 0x1b92,0xb7f6);
  if (bVar5) {
    return;
  }
  wVar1 = qb3f_7f((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),0x52fc,0xbe6a);
  bx_02 = 0x52fc;
  uVar7 = qb3f_77(wVar1,0x52fc,0x52fc,0x52fc,0xbe6a);
  uVar4 = 0xe46d < bx_02 * 4;
  wVar1 = bx_02 * 4 + 0x1b92;
  uVar6 = wVar1 == 0;
  uVar7 = qb3f_7f((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),wVar1,0xb7d0);
  uVar7 = qb3f_7d((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),wVar1,wVar1);
  wVar1 = (word)((ulong)uVar7 >> 0x10);
  uVar7 = qb3f_7f((word)uVar7,bx_02,wVar1,wVar1,0xbb60);
  wVar3 = (word)((ulong)uVar7 >> 0x10);
  uVar7 = qb3f_7d((word)uVar7,bx_02,wVar3,wVar1,wVar3);
  wVar1 = (word)((ulong)uVar7 >> 0x10);
  wVar3 = 0xb7fa;
  uVar7 = qb3f_9f((word)uVar7,bx_02,wVar1,wVar1,0xb7fa);
  if (!(bool)uVar4 && !(bool)uVar6) {
    uVar7 = qb3f_7f((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),wVar1,0xc086);
    wVar3 = (word)((ulong)uVar7 >> 0x10);
    uVar7 = qb3f_7d((word)uVar7,bx_02,wVar3,wVar1,wVar3);
  }
  uVar7 = qb3f_75((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),0x52fc,wVar3);
  wVar1 = bx_02 * 4 + 0x1f92;
  uVar7 = qb3f_7f((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),wVar1,0xcbf6);
  qb3f_7d((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),wVar1,wVar1);
  uVar7 = FUN_1000_2f43();
  uVar7 = qb3f_97((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),0xbb68,0x52fc);
  uVar7 = qb3f_7d((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),0xbb68,0x52fc);
  uVar7 = qb3f_75((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),0x52fc,0x52fc);
  wVar1 = bx_02 * 4 + 0x1f92;
  uVar7 = qb3f_7f((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),wVar1,0xb802);
  qb3f_7d((word)uVar7,bx_02,(word)((ulong)uVar7 >> 0x10),wVar1,wVar1);
  return;
}


// ==== FUN_1000_7dc9 @ 1000:7dc9 (size 196) callers: FUN_1000_1918,FUN_1000_35ac,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_7dc9,FUN_1000_90d3,FUN_1000_95ba,FUN_1000_c5d0

void __cdecl16near FUN_1000_7dc9(void)

{
  undefined2 in_AX;
  word wVar1;
  int iVar2;
  undefined2 in_DX;
  uint uVar3;
  word in_BX;
  word bx;
  uint bx_00;
  undefined *bx_01;
  word unaff_SI;
  word unaff_DI;
  bool bVar4;
  undefined4 uVar5;
  
  uVar5 = CONCAT22(in_DX,in_AX);
  while( true ) {
    DAT_2000_b578 = 0;
    wVar1 = qb3d_06((word)uVar5,in_BX,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
    qb3f_61(wVar1,in_BX,0xb49c,unaff_SI,unaff_DI);
    uVar5 = FUN_1000_7eec();
    qb3f_75((word)uVar5,in_BX,(word)((ulong)uVar5 >> 0x10),0xb4d2,unaff_DI);
    wVar1 = (word)((long)(int)in_BX * 0x16);
    unaff_SI = 0xb4ca;
    uVar5 = qb3f_75(wVar1,in_BX,(word)((ulong)((long)(int)in_BX * 0x16) >> 0x10),0xb4ca,wVar1);
    wVar1 = (word)((ulong)uVar5 >> 0x10);
    bx = in_BX + (word)uVar5;
    unaff_DI = bx * 2;
    bVar4 = *(int *)(unaff_DI + 0x4e90) == 0;
    if (0 < *(int *)(unaff_DI + 0x4e90)) break;
    in_BX = 0xbc1a;
    uVar5 = qb3f_62(0xb49c,0xbc1a,wVar1,0xb4ca,unaff_DI);
    if (!bVar4) {
      return;
    }
  }
  qb3f_75((word)uVar5,bx,wVar1,0xb4d2,unaff_DI);
  wVar1 = (word)((long)(int)bx * 0x16);
  uVar5 = qb3f_75(wVar1,bx,(word)((ulong)((long)(int)bx * 0x16) >> 0x10),0xb4ca,wVar1);
  iVar2 = *(int *)((bx + (word)uVar5) * 2 + 0x4e90);
  bx_00 = 0;
  if (0 < iVar2) {
    bx_00 = 0xffff;
  }
  bVar4 = iVar2 == 0;
  qb3f_9f((word)uVar5,bx_00,(word)((ulong)uVar5 >> 0x10),0xb60e,0xb7f6);
  uVar3 = 0;
  if (bVar4) {
    uVar3 = 0xffff;
  }
  bVar4 = (uVar3 & bx_00) == 0;
  if (bVar4) {
    bx_01 = (undefined *)0xbc1a;
    uVar5 = qb3f_62(0xb49c,0xbc1a,0,0xb60e,0xb7f6);
    if (bVar4) {
      bx_01 = (undefined *)&lit_empty;
      uVar5 = qb3f_61((word)uVar5,0xbb56,(word)uVar5,0xb60e,0xb7f6);
    }
    qb3f_75((word)uVar5,(word)bx_01,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xb7f6);
    wVar1 = (word)((long)(int)bx_01 * 0x16);
    iVar2 = qb3f_75(wVar1,(word)bx_01,(word)((ulong)((long)(int)bx_01 * 0x16) >> 0x10),0xb4ca,wVar1)
    ;
    if (0 < *(int *)((int)(bx_01 + iVar2) * 2 + 0x4e90)) {
      DAT_2000_b578 = 1;
      return;
    }
    return;
  }
  FUN_1000_2f71();
  return;
}


// ==== FUN_1000_7e8d @ 1000:7e8d (size 86) callers: FUN_1000_8e76

/* WARNING: Control flow encountered bad instruction data */

void FUN_1000_7e8d(void)

{
  word in_AX;
  word ax;
  int in_CX;
  word in_DX;
  word in_BX;
  word wVar1;
  word bx;
  int unaff_BP;
  undefined2 unaff_SS;
  undefined1 in_ZF;
  undefined4 uVar2;
  
  qb3f_7b(in_AX,in_BX,in_DX,0xb69c,0xb530);
  uVar2 = FUN_1000_70a1();
  uVar2 = qb3d_34((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb69c,0xb530);
  uVar2 = qb3f_ad((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb69c,0xb530);
  wVar1 = 0x1a;
  uVar2 = qb3d_03((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),0xb69c,0xb530);
  uVar2 = qb3f_a1((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb69c,0xb7f6);
  wVar1 = 0;
  if ((bool)in_ZF) {
    wVar1 = 0xffff;
  }
  uVar2 = qb3d_34((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb69c,0xb7f6);
  ax = qb3f_91((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb69c,0xbc26);
  bx = 0x1a;
  uVar2 = qb3d_03(ax,0x1a,wVar1,0xb69c,0xbc26);
  uVar2 = qb3f_81((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0xb69c,0xcc42);
  uVar2 = qb3f_71((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0x1fa6,0xb56c);
  uVar2 = qb3f_97((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0x1fa6,0xb56c);
  qb3f_a5((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0x1fa6,0xb56c);
  *(int *)(unaff_BP + -0x4a89) = *(int *)(unaff_BP + -0x4a89) + in_CX;
                    /* WARNING: Bad instruction - Truncating control flow here */
  halt_baddata();
}


// ==== FUN_1000_7eec @ 1000:7eec (size 87) callers: FUN_1000_0636,FUN_1000_7dc9,FUN_1000_803a

void __cdecl16near FUN_1000_7eec(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word wVar1;
  word si;
  word di;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar2;
  
  uVar2 = qb3f_97(in_AX,in_BX,in_DX,0xcf8c,0xb6b4);
  uVar2 = qb3f_81((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xcf8c,0xb4ea);
  uVar2 = qb3f_91((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xcf8c,0xb6d0);
  uVar2 = qb3f_89((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xcf8c,0xbc1e);
  wVar1 = 0x1a;
  uVar2 = qb3d_03((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),0xcf8c,0xbc1e);
  uVar2 = qb3f_7d((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xcf8c,0xb6d4);
  si = 0xb6d4;
  di = 0xbd32;
  uVar2 = qb3f_9f((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb6d4,0xbd32);
  if ((bool)in_CF) {
    di = 0xb6d4;
    si = 0xbd32;
    uVar2 = qb3f_7b((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xbd32,0xb6d4);
  }
  uVar2 = qb3d_34((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),si,di);
  uVar2 = qb3f_91((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),si,0xb6d4);
  wVar1 = 0x1a;
  uVar2 = qb3d_03((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),si,0xb6d4);
  qb3f_a1((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),si,0xb7f6);
  if ((bool)in_ZF) {
    FUN_1000_7001();
  }
  return;
}


// ==== FUN_1000_7f43 @ 1000:7f43 (size 58) callers: FUN_1000_803a

void __cdecl16near FUN_1000_7f43(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar1;
  
  uVar1 = qb3d_43(in_AX,in_BX,in_DX,unaff_SI,unaff_DI);
  uVar1 = qb3f_7d((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),unaff_SI,0xb6d8);
  uVar1 = qb3f_9f((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0x1bca,0xb6d8);
  if (!(bool)in_CF && !(bool)in_ZF) {
    uVar1 = FUN_1000_7f7d();
  }
  uVar1 = qb3f_9f((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0x1bc6,0xb6d8);
  if (!(bool)in_CF && !(bool)in_ZF) {
    uVar1 = FUN_1000_7f96();
  }
  qb3f_9f((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0x1bc2,0xb6d8);
  if (!(bool)in_CF && !(bool)in_ZF) {
    FUN_1000_7faf();
  }
  return;
}


// ==== FUN_1000_7f7d @ 1000:7f7d (size 25) callers: FUN_1000_7f43,FUN_1000_95ba

void __cdecl16near FUN_1000_7f7d(void)

{
  word in_AX;
  word in_DX;
  word bx;
  undefined1 *bx_00;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar1;
  
  uVar1 = qb3e_42(in_AX,5,in_DX,unaff_SI,unaff_DI);
  bx = 0x14;
  uVar1 = qb3e_44((word)uVar1,0x14,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  uVar1 = qb3f_bc((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  bx_00 = (undefined1 *)&lit_YOU_FEEL_VERY_AGILE;
  uVar1 = qb3f_6e((word)uVar1,0xcf90,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar1,(word)bx_00,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_7f96 @ 1000:7f96 (size 25) callers: FUN_1000_7f43

void __cdecl16near FUN_1000_7f96(void)

{
  word in_AX;
  word in_DX;
  word bx;
  undefined1 *bx_00;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar1;
  
  uVar1 = qb3e_42(in_AX,6,in_DX,unaff_SI,unaff_DI);
  bx = 0x14;
  uVar1 = qb3e_44((word)uVar1,0x14,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  uVar1 = qb3f_bc((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  bx_00 = (undefined1 *)&lit_YOUR_BODY_GLOWS;
  uVar1 = qb3f_6a((word)uVar1,0xcfaa,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar1,(word)bx_00,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_7faf @ 1000:7faf (size 25) callers: FUN_1000_7f43

void __cdecl16near FUN_1000_7faf(void)

{
  word in_AX;
  word in_DX;
  word bx;
  undefined1 *bx_00;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar1;
  
  uVar1 = qb3e_42(in_AX,7,in_DX,unaff_SI,unaff_DI);
  bx = 0x14;
  uVar1 = qb3e_44((word)uVar1,0x14,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  uVar1 = qb3f_bc((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  bx_00 = (undefined1 *)&lit_B_BREATH_FIRE;
  uVar1 = qb3f_6a((word)uVar1,0xcfc4,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar1,(word)bx_00,(word)((ulong)uVar1 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_7fc8 @ 1000:7fc8 (size 51) callers: FUN_1000_803a

void __cdecl16near FUN_1000_7fc8(void)

{
  word in_AX;
  word in_DX;
  word wVar1;
  undefined1 *bx;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  wVar1 = 1;
  uVar2 = qb3e_42(in_AX,1,in_DX,unaff_SI,unaff_DI);
  uVar2 = qb3e_44((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_bc((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_6a((word)uVar2,0xcfd6,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = 0xb6b4;
  uVar2 = qb3f_67((word)uVar2,0xb6b4,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_75((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb6dc,unaff_DI);
  uVar2 = qb3f_6a((word)uVar2,wVar1 * 4 + 0x5f14,(word)((ulong)uVar2 >> 0x10),0xb6dc,unaff_DI);
  bx = (undefined1 *)&lit_IS_ATTACKING;
  uVar2 = qb3f_6e((word)uVar2,0xcfe2,(word)((ulong)uVar2 >> 0x10),0xb6dc,unaff_DI);
  qb3e_79((word)uVar2,(word)bx,(word)((ulong)uVar2 >> 0x10),0xb6dc,unaff_DI);
  return;
}


// ==== FUN_1000_7ffb @ 1000:7ffb (size 63) callers: FUN_1000_0cd2,FUN_1000_803a

void __cdecl16near FUN_1000_7ffb(void)

{
  word in_AX;
  word in_DX;
  word dx;
  word bx;
  undefined1 *puVar1;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_ZF;
  undefined4 uVar2;
  
  uVar2 = qb3e_32(in_AX,0xffff,in_DX,unaff_SI,unaff_DI);
  uVar2 = qb3e_42((word)uVar2,10,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  bx = 0xf;
  uVar2 = qb3e_44((word)uVar2,0xf,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_bc((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  puVar1 = (undefined1 *)&lit_PAUSE_Q_FOR_DOS;
  uVar2 = qb3f_6e((word)uVar2,0xcff4,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar2,(word)puVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  FUN_1000_2f71();
  puVar1 = (undefined1 *)&lit_Q;
  uVar2 = qb3f_62(0xb49c,0xbc52,dx,unaff_SI,unaff_DI);
  if ((bool)in_ZF) {
    FUN_1000_b308();
    uVar2 = FUN_1000_b5c8();
    uVar2 = qb3e_01((word)uVar2,(word)puVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  }
  qb3e_32((word)uVar2,0xffff,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_803a @ 1000:803a (size 2426) callers: FUN_1000_4275

void FUN_1000_803a(void)

{
  byte *pbVar1;
  word wVar2;
  uint uVar3;
  int iVar4;
  word dx;
  word ax;
  word dx_00;
  word extraout_DX;
  word extraout_DX_00;
  word extraout_DX_01;
  word extraout_DX_02;
  word extraout_DX_03;
  word extraout_DX_04;
  word dx_01;
  word dx_02;
  word dx_03;
  word dx_04;
  undefined2 extraout_DX_05;
  word in_BX;
  word wVar5;
  word wVar6;
  word bx;
  uint uVar7;
  undefined *puVar8;
  int unaff_BP;
  word wVar9;
  undefined *di;
  char *di_00;
  undefined2 unaff_SS;
  undefined1 uVar10;
  bool bVar11;
  undefined1 uVar12;
  bool bVar13;
  undefined1 uVar14;
  undefined4 uVar15;
  ulong uVar16;
  
  uVar15 = FUN_1000_78ff();
  uVar15 = qb3f_7b((word)uVar15,in_BX,(word)((ulong)uVar15 >> 0x10),0xce08,0xb6a4);
  qb3f_75((word)uVar15,in_BX,(word)((ulong)uVar15 >> 0x10),0xb4d2,0xb6a4);
  wVar2 = (word)((long)(int)in_BX * 0x16);
  uVar15 = qb3f_75(wVar2,in_BX,(word)((ulong)((long)(int)in_BX * 0x16) >> 0x10),0xb4ca,wVar2);
  wVar9 = (in_BX + (word)uVar15) * 2;
  wVar2 = *(word *)(wVar9 + 0x4e90);
  uVar15 = qb3f_57((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4ca,wVar9);
  uVar15 = qb3f_7d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4ca,0xb69c);
  qb3f_7b((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb7f6,0xb6e0);
  wVar2 = FUN_1000_2fcb();
  wVar2 = qb3e_72(wVar2,0xd6,0x6f,0xb7f6,0xb6e0);
  wVar2 = qb3e_73(wVar2,0x109,0x88,0xb7f6,0xb6e0);
  wVar9 = 0;
  uVar10 = 0;
  uVar12 = 1;
  uVar15 = qb3e_74(wVar2,0,0xffff,0xb7f6,0xb6e0);
  qb3e_75((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb7f6,0xb6e0);
  uVar15 = FUN_1000_6baf();
  uVar15 = qb3f_7b((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb7f6,0xb4c2);
  wVar9 = 0xb7f6;
  uVar15 = qb3f_7b((word)uVar15,0xb7f6,(word)((ulong)uVar15 >> 0x10),0xb7ee,0xb2aa);
  wVar2 = qb3f_7b((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb69c,0xb530);
  uVar15 = qb3f_87(wVar2,wVar9,0xb530,0xb69c,0xbc1e);
  uVar15 = qb3d_03((word)uVar15,0x1a,(word)((ulong)uVar15 >> 0x10),0xb69c,0xbc1e);
  wVar5 = 0xb69c;
  uVar15 = qb3f_91((word)uVar15,0xb69c,(word)((ulong)uVar15 >> 0x10),0xb69c,0xbc1e);
  wVar2 = wVar5;
  uVar15 = qb3f_9b((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),wVar5,0xbc1e);
  uVar15 = qb3f_81((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar5,wVar9);
  uVar15 = qb3f_7d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar5,0xb6dc);
  wVar5 = (word)((ulong)uVar15 >> 0x10);
  uVar15 = qb3f_7f((word)uVar15,wVar2,wVar5,wVar5,0xbe82);
  uVar15 = qb3f_89((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar5,0xbe82);
  wVar2 = 0x1a;
  uVar15 = qb3d_03((word)uVar15,0x1a,(word)((ulong)uVar15 >> 0x10),wVar5,0xbe82);
  uVar15 = qb3f_7d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar5,0xb6b4);
  wVar5 = (word)((ulong)uVar15 >> 0x10);
  wVar6 = 0xb6b4;
  wVar2 = qb3f_8f((word)uVar15,0xb6b4,wVar5,wVar5,0xbc42);
  bx = 0x1a;
  uVar15 = qb3f_71(wVar2,0x1a,wVar6,wVar5,0xbc42);
  uVar15 = qb3d_03((word)uVar15,bx,(word)((ulong)uVar15 >> 0x10),wVar5,0xbc42);
  uVar15 = qb3f_a1((word)uVar15,bx,(word)((ulong)uVar15 >> 0x10),wVar5,0xb7b0);
  wVar2 = (word)((ulong)uVar15 >> 0x10);
  if ((bool)uVar12) {
    uVar15 = qb3f_7f((word)uVar15,bx,wVar2,wVar2,wVar9);
    wVar9 = (word)((ulong)uVar15 >> 0x10);
    uVar15 = qb3f_7d((word)uVar15,bx,wVar9,wVar2,wVar9);
  }
  uVar15 = qb3f_8f((word)uVar15,bx,(word)((ulong)uVar15 >> 0x10),0xb530,0xbba6);
  wVar2 = 0x1a;
  uVar15 = qb3f_71((word)uVar15,0x1a,(word)((ulong)uVar15 >> 0x10),0xb530,0xbba6);
  uVar15 = qb3d_03((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb530,0xbba6);
  uVar15 = qb3f_a1((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb530,0xb7b0);
  if ((bool)uVar12) {
    uVar15 = qb3f_7f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xb7f6);
    uVar15 = qb3f_7d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xb6b4);
  }
  uVar15 = qb3f_8f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb530,0xd00c);
  wVar2 = 0x1a;
  uVar15 = qb3f_71((word)uVar15,0x1a,(word)((ulong)uVar15 >> 0x10),0xb530,0xd00c);
  uVar15 = qb3d_03((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb530,0xd00c);
  uVar15 = qb3f_a1((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb530,0xb7b0);
  if ((bool)uVar12) {
    uVar15 = qb3f_7f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xb7f6);
    uVar15 = qb3f_7d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xb6b4);
  }
  uVar15 = qb3f_8f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb530,0xbe7e);
  wVar2 = 0x1a;
  uVar15 = qb3f_71((word)uVar15,0x1a,(word)((ulong)uVar15 >> 0x10),0xb530,0xbe7e);
  uVar15 = qb3d_03((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb530,0xbe7e);
  uVar15 = qb3f_a1((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb530,0xb7b0);
  if ((bool)uVar12) {
    uVar15 = qb3f_7f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xb7f6);
    uVar15 = qb3f_7d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xb6b4);
  }
  uVar15 = qb3f_9f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xcb6a);
  wVar2 = 0;
  if ((bool)uVar10) {
    wVar2 = 0xffff;
    uVar12 = 0;
  }
  wVar9 = qb3f_9f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xbc1e);
  uVar3 = 0;
  if (!(bool)uVar10 && !(bool)uVar12) {
    uVar3 = 0xffff;
  }
  uVar15 = CONCAT22(uVar3 | wVar2,wVar9);
  bVar11 = false;
  if ((uVar3 | wVar2) == 0) {
    uVar15 = qb3f_9f(wVar9,wVar2,0,0xb48c,0xbb68);
    wVar9 = (word)((ulong)uVar15 >> 0x10);
    if (bVar11) {
      uVar15 = qb3f_7f((word)uVar15,wVar2,wVar9,0xb6dc,0xce3c);
      uVar15 = qb3f_7d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xb6dc);
    }
    else {
      uVar15 = qb3f_75((word)uVar15,wVar2,wVar9,0xb69c,0xbb68);
      wVar2 = ((undefined2 *)&DAT_2000_3824)[wVar2];
      if ((int)wVar2 < 0) {
        wVar2 = -wVar2;
      }
      if (0x8c < (int)wVar2) {
        uVar15 = qb3f_7f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xb7d8);
        uVar15 = qb3f_7d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xb6dc);
      }
    }
  }
  DAT_2000_b5d8 = 0;
  uVar15 = qb3f_7b((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb7ee,0xb518);
  uVar15 = qb3f_75((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb69c,0xb518);
  wVar9 = wVar2 * 2;
  uVar15 = qb3f_57((word)uVar15,((undefined2 *)&DAT_2000_3824)[wVar2],(word)((ulong)uVar15 >> 0x10),
                   0xb69c,wVar9);
  uVar15 = qb3f_71((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xbe6e);
  uVar15 = qb3f_8f((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xbe6e);
  uVar15 = qb3f_71((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xbe6e);
  wVar2 = qb3f_a5((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xbe6e);
  *(byte *)(unaff_BP + -0x418f) = *(byte *)(unaff_BP + -0x418f) ^ 0xe9;
  *(char *)(unaff_BP + -0x4848) = *(char *)(unaff_BP + -0x4848) + (char)(wVar9 >> 8);
  uVar15 = qb3f_75(wVar2,wVar9,wVar9,0xb6b4,0xbe6e);
  wVar2 = (word)((ulong)uVar15 >> 0x10);
  *(word *)((int)(undefined2 *)&DAT_2000_3824 + wVar2) = wVar9;
  uVar15 = qb3f_75((word)uVar15,wVar9,wVar2,0xb69c,wVar2);
  uVar3 = ((undefined2 *)&DAT_2000_3824)[wVar9];
  uVar7 = uVar3;
  if ((int)uVar3 < 0) {
    uVar7 = -uVar3;
  }
  uVar10 = 0x7fff < uVar3;
  uVar15 = qb3f_57((word)uVar15,uVar7,(word)((ulong)uVar15 >> 0x10),0xb69c,wVar9 * 2);
  uVar15 = qb3f_7d((word)uVar15,uVar7,(word)((ulong)uVar15 >> 0x10),0xb69c,0xb6e4);
  uVar15 = qb3f_9f((word)uVar15,uVar7,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xb7f6);
  if ((bool)uVar10) {
    uVar15 = qb3f_7b((word)uVar15,uVar7,(word)((ulong)uVar15 >> 0x10),0xb7f6,0xb6e4);
  }
  uVar15 = qb3f_7b((word)uVar15,uVar7,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xb6e8);
  uVar15 = qb3f_7b((word)uVar15,uVar7,(word)((ulong)uVar15 >> 0x10),0xb7ee,0xb6ec);
  wVar9 = 0xb6ec;
  wVar2 = qb3f_8f((word)uVar15,0xb6ec,(word)((ulong)uVar15 >> 0x10),0xb530,0xbc42);
  wVar5 = 0x1a;
  uVar15 = qb3f_71(wVar2,0x1a,wVar9,0xb530,0xbc42);
  uVar15 = qb3d_03((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb530,0xbc42);
  uVar15 = qb3f_a5((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb530,0xbc42);
  wVar2 = (word)((ulong)uVar15 >> 0x10);
  DAT_2000_b533 = DAT_2000_b533 ^ 0xe9;
  pbVar1 = (byte *)(wVar5 + 0xb530);
  uVar10 = 0;
  *pbVar1 = *pbVar1 | (byte)uVar15;
  uVar12 = *pbVar1 == 0;
  uVar15 = qb3f_7b((word)uVar15,wVar5,wVar2,0xb7f6,wVar2);
  qb3f_7b((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb7f6,0xb50e);
  DAT_2000_b536 = 1;
  FUN_1000_3029();
  uVar15 = FUN_1000_7fc8();
  uVar15 = qb3f_7b((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb7ee,0xb6f0);
  uVar15 = qb3f_9f((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xb7fa);
  if ((bool)uVar10) {
    uVar15 = qb3f_7b((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb7f6,0xb6f4);
  }
  uVar15 = qb3f_9f((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xbb6c);
  wVar2 = 0;
  if (!(bool)uVar10 && !(bool)uVar12) {
    wVar2 = 0xffff;
  }
  wVar9 = qb3f_9f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xb7fe);
  uVar3 = 0;
  if ((bool)uVar10) {
    uVar3 = 0xffff;
  }
  uVar10 = 0;
  uVar12 = (uVar3 & wVar2) == 0;
  if ((bool)uVar12) {
    uVar16 = (ulong)wVar9;
  }
  else {
    uVar16 = qb3f_7b(wVar9,wVar2,uVar3 & wVar2,0xb7d8,0xb6f4);
  }
  uVar15 = qb3f_9f((word)uVar16,wVar2,(word)(uVar16 >> 0x10),0xb6dc,0xbd32);
  wVar2 = 0;
  if (!(bool)uVar10 && !(bool)uVar12) {
    wVar2 = 0xffff;
  }
  wVar9 = qb3f_9f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xbd2a);
  uVar3 = 0;
  if ((bool)uVar10) {
    uVar3 = 0xffff;
  }
  uVar10 = 0;
  uVar12 = (uVar3 & wVar2) == 0;
  if ((bool)uVar12) {
    uVar16 = (ulong)wVar9;
  }
  else {
    uVar15 = qb3f_7b(wVar9,wVar2,uVar3 & wVar2,0xbb60,0xb6f4);
    uVar16 = qb3f_7b((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xbb5c,0xb6f0);
  }
  uVar15 = qb3f_9f((word)uVar16,wVar2,(word)(uVar16 >> 0x10),0xb6dc,0xbd26);
  wVar2 = 0;
  if (!(bool)uVar10 && !(bool)uVar12) {
    wVar2 = 0xffff;
  }
  wVar9 = qb3f_9f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xcb6a);
  uVar3 = 0;
  if ((bool)uVar10) {
    uVar3 = 0xffff;
  }
  uVar10 = 0;
  uVar12 = (uVar3 & wVar2) == 0;
  if ((bool)uVar12) {
    uVar16 = (ulong)wVar9;
  }
  else {
    uVar16 = qb3f_7b(wVar9,wVar2,uVar3 & wVar2,0xb802,0xb6f4);
  }
  uVar15 = qb3f_9f((word)uVar16,wVar2,(word)(uVar16 >> 0x10),0xb6dc,0xbd1e);
  if (!(bool)uVar10 && !(bool)uVar12) {
    uVar15 = qb3f_7b((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xbb6c,0xb6f4);
  }
  wVar2 = qb3f_9f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xb7fa);
  wVar9 = 0;
  if ((bool)uVar10) {
    wVar9 = 0xffff;
  }
  uVar3 = 0;
  if (DAT_2000_b640 == 2) {
    uVar3 = 0xffff;
  }
  uVar10 = 0;
  uVar12 = (uVar3 & wVar9) == 0;
  if ((bool)uVar12) {
    uVar16 = (ulong)wVar2;
  }
  else {
    uVar16 = qb3f_7b(wVar2,wVar9,uVar3 & wVar9,0xb7fa,0xb6f4);
  }
  uVar15 = qb3f_9f((word)uVar16,wVar9,(word)(uVar16 >> 0x10),0xb6dc,0xbd26);
  uVar3 = 0;
  if (!(bool)uVar10 && !(bool)uVar12) {
    uVar3 = 0xffff;
  }
  wVar2 = qb3f_9f((word)uVar15,uVar3,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xcb6a);
  uVar7 = 0;
  if ((bool)uVar10) {
    uVar7 = 0xffff;
  }
  uVar7 = uVar7 & uVar3;
  uVar15 = CONCAT22(uVar7,wVar2);
  uVar3 = 0;
  if (DAT_2000_b640 == 2) {
    uVar3 = 0xffff;
  }
  wVar9 = uVar3 & uVar7;
  uVar10 = wVar9 == 0;
  if (!(bool)uVar10) {
    uVar15 = qb3f_7b(wVar2,wVar9,uVar7,0xbb68,0xb6f4);
  }
  uVar15 = qb3f_9f((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb6f4,0xb7d8);
  if ((bool)uVar10) {
    uVar15 = qb3f_7b((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb802,0xb6f0);
  }
  DAT_2000_b6f8 = (undefined *)0x0;
  wVar2 = 0;
  if (DAT_2000_b640 == 2) {
    wVar2 = 0xffff;
  }
  bVar11 = false;
  wVar9 = qb3f_9f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6dc,0xbc2e);
  uVar3 = 0;
  if (bVar11) {
    uVar3 = 0xffff;
  }
  uVar10 = 0;
  uVar12 = (uVar3 & wVar2) == 0;
  if (!(bool)uVar12) {
    DAT_2000_b6f8 = (undefined *)0x14;
  }
  qb3f_7b(wVar9,wVar2,uVar3 & wVar2,0xb7f6,0xb60e);
  FUN_1000_2fcb();
  uVar15 = FUN_1000_7f43();
  uVar15 = qb3f_23((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6b4,0xd010);
  wVar5 = 0xb6b4;
  uVar15 = qb3f_27((word)uVar15,0xb6b4,(word)((ulong)uVar15 >> 0x10),0xce04,0xd010);
  wVar9 = qb3f_91((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xce04,0xbb6c);
  wVar2 = wVar5;
  uVar15 = qb3f_71(wVar9,wVar5,0xbb6c,wVar5,0xb7d0);
  uVar15 = qb3f_7f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar5,0xb7d0);
  uVar15 = qb3f_25((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar5,0xd014);
  uVar15 = qb3f_91((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar5,0xcc52);
  uVar15 = qb3f_85((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar5,0xcc52);
  uVar15 = qb3f_81((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar5,0xb7f2);
  puVar8 = (undefined *)0x1a;
  uVar15 = qb3d_03((word)uVar15,0x1a,(word)((ulong)uVar15 >> 0x10),wVar5,0xb7f2);
  uVar15 = qb3f_74((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar5,0xb7f2);
  uVar15 = qb3f_7e((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar5,0xb6fa);
  di_00 = (char *)((ulong)uVar15 >> 0x10);
  uVar15 = qb3f_9f((word)uVar15,(word)puVar8,0xb6fa,0xb6f4,(word)di_00);
  wVar2 = (word)((ulong)uVar15 >> 0x10);
  if ((bool)uVar12) {
    uVar15 = qb3f_90((word)uVar15,(word)puVar8,wVar2,wVar2,0xc156);
    di_00 = (char *)((ulong)uVar15 >> 0x10);
    uVar15 = qb3f_7e((word)uVar15,(word)puVar8,(word)di_00,wVar2,(word)di_00);
  }
LAB_1000_84c1:
  while( true ) {
    uVar15 = qb3f_a7((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb4ea,(word)di_00);
    wVar2 = 0;
    if ((bool)uVar10) {
      wVar2 = 0xffff;
    }
    wVar9 = 0xb4f2;
    qb3f_a7((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    iVar4 = 0;
    if ((bool)uVar10) {
      iVar4 = -1;
    }
    if (iVar4 != 0 || wVar2 != 0) {
      FUN_1000_a013();
      return;
    }
    if (DAT_2000_b702 == 1) {
      DAT_2000_b702 = 0;
      DAT_2000_b536 = 0xffff;
      FUN_1000_8fea();
      FUN_1000_4275();
      FUN_1000_580f();
      FUN_1000_7fc8();
    }
    uVar12 = DAT_2000_b704 == 0;
    uVar10 = DAT_2000_b704 == 1;
    if ((bool)uVar10) {
      FUN_1000_4abd();
      DAT_2000_b704 = 0;
    }
    FUN_1000_7f43();
    uVar15 = FUN_1000_49d1();
    uVar15 = qb3e_42((word)uVar15,0x18,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = 1;
    uVar15 = qb3e_44((word)uVar15,1,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar2 = qb3f_bc((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    puVar8 = (undefined *)&lit_EXP_VALUE;
    uVar15 = qb3f_6a(wVar2,0xd018,wVar5,0xb4f2,(word)di_00);
    uVar15 = qb3e_79((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3e_42((word)uVar15,0x19,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = 3;
    uVar15 = qb3e_44((word)uVar15,3,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3f_bc((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar2 = 0xb6fa;
    uVar15 = qb3f_68((word)uVar15,0xb6fa,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3e_79((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar2 = wVar5;
    uVar15 = qb3e_42((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar6 = (word)((ulong)uVar15 >> 0x10);
    uVar15 = qb3e_44((word)uVar15,wVar6,wVar2,0xb4f2,(word)di_00);
    uVar15 = qb3f_bc((word)uVar15,wVar6,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    qb3f_6a((word)uVar15,0xd028,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar2 = 0x15;
    uVar15 = qb3d_0d(0x15,0x15,dx,0xb4f2,(word)di_00);
    uVar15 = qb3f_6a((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3e_79((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3e_42((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar2 = (word)uVar15;
    uVar15 = qb3e_44(wVar2,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3f_bc((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar2 = 0xb4f2;
    uVar15 = qb3f_6b((word)uVar15,0xb4f2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3e_79((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3f_bc((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3f_6a((word)uVar15,0xd040,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar2 = 0x16;
    uVar15 = qb3d_0d((word)uVar15,0x16,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3f_6a((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3e_79((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3e_42((word)uVar15,4,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar2 = (word)uVar15;
    uVar15 = qb3e_44(wVar2,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3f_bc((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    wVar2 = 0xb6e4;
    uVar15 = qb3f_6b((word)uVar15,0xb6e4,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    uVar15 = qb3e_79((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb4f2,(word)di_00);
    DAT_2000_b536 = 0;
    do {
      uVar15 = qb3d_43((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar9,(word)di_00);
      uVar15 = qb3f_7d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar9,0xb6d8);
      uVar15 = qb3f_9f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0x1bc2,0xb6d8);
      uVar3 = 0;
      if ((bool)uVar12) {
        uVar3 = 0xffff;
        uVar10 = 0;
      }
      uVar15 = qb3d_43((word)uVar15,uVar3,(word)((ulong)uVar15 >> 0x10),0x1bc2,0xb6d8);
      wVar2 = qb3f_9b((word)uVar15,uVar3,(word)((ulong)uVar15 >> 0x10),0x1bc2,0xb6d8);
      uVar15 = qb3f_a1(wVar2,uVar3,0x1bc2,0x1bc2,0xd056);
      wVar2 = (word)((ulong)uVar15 >> 0x10);
      uVar7 = 0;
      if (!(bool)uVar12 && !(bool)uVar10) {
        uVar7 = 0xffff;
      }
      bVar11 = false;
      uVar7 = uVar7 | uVar3;
      bVar13 = uVar7 == 0;
      uVar15 = qb3f_a7((word)uVar15,uVar3,wVar2,wVar2,0xd056);
      wVar2 = (word)((ulong)uVar15 >> 0x10);
      uVar3 = 0;
      if (!bVar11 && !bVar13) {
        uVar3 = 0xffff;
      }
      uVar10 = 0;
      uVar12 = (uVar3 & uVar7) == 0;
      if ((bool)uVar12) {
        wVar9 = 0;
      }
      else {
        uVar15 = qb3f_7b((word)uVar15,uVar3 & uVar7,wVar2,0xbc2a,wVar2);
        uVar15 = qb3e_42((word)uVar15,7,(word)((ulong)uVar15 >> 0x10),0xbc2a,wVar2);
        wVar9 = 0x14;
        uVar15 = qb3e_44((word)uVar15,0x14,(word)((ulong)uVar15 >> 0x10),0xbc2a,wVar2);
        uVar15 = qb3f_bc((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xbc2a,wVar2);
        wVar9 = 0xe;
        uVar15 = qb3d_0d((word)uVar15,0xe,(word)((ulong)uVar15 >> 0x10),0xbc2a,wVar2);
        uVar15 = qb3f_6a((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xbc2a,wVar2);
        uVar15 = qb3e_79((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xbc2a,wVar2);
      }
      uVar15 = qb3f_9f((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0x1bc6,0xb6d8);
      uVar3 = 0;
      if ((bool)uVar10) {
        uVar3 = 0xffff;
        uVar12 = 0;
      }
      uVar15 = qb3d_43((word)uVar15,uVar3,(word)((ulong)uVar15 >> 0x10),0x1bc6,0xb6d8);
      wVar2 = qb3f_9b((word)uVar15,uVar3,(word)((ulong)uVar15 >> 0x10),0x1bc6,0xb6d8);
      uVar15 = qb3f_a1(wVar2,uVar3,0x1bc6,0x1bc6,0xd056);
      wVar2 = (word)((ulong)uVar15 >> 0x10);
      uVar7 = 0;
      if (!(bool)uVar10 && !(bool)uVar12) {
        uVar7 = 0xffff;
      }
      bVar11 = false;
      uVar7 = uVar7 | uVar3;
      bVar13 = uVar7 == 0;
      uVar15 = qb3f_a7((word)uVar15,uVar3,wVar2,wVar2,0xd056);
      wVar2 = (word)((ulong)uVar15 >> 0x10);
      uVar3 = 0;
      if (!bVar11 && !bVar13) {
        uVar3 = 0xffff;
      }
      wVar9 = uVar3 & uVar7;
      uVar10 = 0;
      uVar12 = wVar9 == 0;
      if ((bool)uVar12) {
        wVar2 = 0;
      }
      else {
        uVar15 = qb3f_7b((word)uVar15,wVar9,wVar2,0xbc2a,wVar2);
        uVar15 = qb3f_7b((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xbc2a,0xb706);
        uVar15 = qb3e_42((word)uVar15,6,(word)((ulong)uVar15 >> 0x10),0xbc2a,0xb706);
        wVar2 = 0x14;
        uVar15 = qb3e_44((word)uVar15,0x14,(word)((ulong)uVar15 >> 0x10),0xbc2a,0xb706);
        uVar15 = qb3f_bc((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xbc2a,0xb706);
        uVar15 = qb3d_0d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xbc2a,0xb706);
        uVar15 = qb3f_6a((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xbc2a,0xb706);
        uVar15 = qb3e_79((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xbc2a,0xb706);
      }
      uVar15 = qb3f_9f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0x1bca,0xb6d8);
      uVar3 = 0;
      if ((bool)uVar10) {
        uVar3 = 0xffff;
        uVar12 = 0;
      }
      uVar15 = qb3d_43((word)uVar15,uVar3,(word)((ulong)uVar15 >> 0x10),0x1bca,0xb6d8);
      wVar2 = qb3f_9b((word)uVar15,uVar3,(word)((ulong)uVar15 >> 0x10),0x1bca,0xb6d8);
      di_00 = (char *)s_ITS_HEALTH_POINTS__2000_d044 + 0x12;
      uVar15 = qb3f_a1(wVar2,uVar3,0x1bca,0x1bca,0xd056);
      wVar9 = (word)((ulong)uVar15 >> 0x10);
      uVar7 = 0;
      if (!(bool)uVar10 && !(bool)uVar12) {
        uVar7 = 0xffff;
      }
      bVar11 = false;
      uVar7 = uVar7 | uVar3;
      bVar13 = uVar7 == 0;
      uVar15 = qb3f_a7((word)uVar15,uVar3,wVar9,wVar9,0xd056);
      wVar2 = (word)((ulong)uVar15 >> 0x10);
      uVar3 = 0;
      if (!bVar11 && !bVar13) {
        uVar3 = 0xffff;
      }
      wVar5 = uVar3 & uVar7;
      uVar12 = 0;
      uVar14 = wVar5 == 0;
      if ((bool)uVar14) {
        wVar2 = 0;
      }
      else {
        uVar15 = qb3f_7b((word)uVar15,wVar5,wVar2,0xbc2a,wVar2);
        wVar9 = 0x1fa6;
        uVar15 = qb3f_7f((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0x1fa6,0xd05a);
        di_00 = (char *)0x1fa6;
        uVar15 = qb3f_7d((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0x1fa6,0x1fa6);
        uVar15 = qb3e_42((word)uVar15,5,(word)((ulong)uVar15 >> 0x10),0x1fa6,0x1fa6);
        wVar2 = 0x14;
        uVar15 = qb3e_44((word)uVar15,0x14,(word)((ulong)uVar15 >> 0x10),0x1fa6,0x1fa6);
        uVar15 = qb3f_bc((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0x1fa6,0x1fa6);
        uVar15 = qb3d_0d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0x1fa6,0x1fa6);
        uVar15 = qb3f_6e((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0x1fa6,0x1fa6);
        qb3e_79((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0x1fa6,0x1fa6);
      }
      uVar15 = FUN_1000_7eec();
      wVar5 = qb3d_06((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar9,(word)di_00);
      qb3f_61(wVar5,wVar2,0xb49c,wVar9,(word)di_00);
      wVar2 = 0xbc1a;
      uVar15 = qb3f_62(ax,0xbc1a,ax,wVar9,(word)di_00);
      uVar10 = 1;
    } while ((bool)uVar14);
    DAT_2000_b54c = 0;
    FUN_1000_10be();
    uVar15 = FUN_1000_2f87();
    uVar15 = qb3f_7b((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xd05e,0xb51c);
    uVar15 = qb3f_7b((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xd05e,0xb512);
    qb3f_7b((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb7f6,0xb50e);
    uVar15 = FUN_1000_09e8();
    uVar15 = qb3f_7b((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb7ee,0xb4fa);
    wVar9 = 0xb512;
    uVar15 = qb3f_9f((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb512,0xb7f6);
    if ((bool)uVar14) {
      uVar15 = FUN_1000_54cb();
      wVar5 = (word)uVar15;
      if (DAT_2000_b5d8 == 1) {
        uVar10 = 1;
        uVar12 = 0;
        goto LAB_1000_8f70;
      }
    }
    uVar10 = 0;
    qb3f_7b((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb69c,0xb530);
    uVar15 = FUN_1000_6fbd();
    wVar2 = DAT_2000_b698;
    uVar15 = qb3f_57((word)uVar15,DAT_2000_b698,(word)((ulong)uVar15 >> 0x10),0xb69c,0xb530);
    wVar2 = qb3f_a1((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb69c,0xb4ca);
    wVar9 = 0;
    if (!(bool)uVar10) {
      wVar9 = 0xffff;
      uVar10 = 0;
    }
    wVar5 = DAT_2000_b69a;
    uVar15 = qb3f_57(wVar2,DAT_2000_b69a,wVar9,0xb69c,0xb4ca);
    uVar15 = qb3f_a1((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb69c,0xb4d2);
    wVar2 = (word)((ulong)uVar15 >> 0x10);
    iVar4 = 0;
    if (!(bool)uVar10) {
      iVar4 = -1;
    }
    bVar11 = iVar4 == 0 && wVar2 == 0;
    if (iVar4 != 0 || wVar2 != 0) {
      FUN_1000_8e76();
      return;
    }
    wVar9 = 0xb51c;
    qb3f_9f((word)uVar15,0,wVar2,0xb51c,0xb7f6);
    if (bVar11) {
      FUN_1000_9a2f();
      return;
    }
    wVar2 = qb3f_62(0xb49c,0xb8a6,dx_00,0xb51c,0xb7f6);
    wVar5 = 0;
    if (bVar11) {
      wVar5 = 0xffff;
    }
    bVar11 = false;
    uVar15 = qb3f_62(wVar2,0xb4b0,wVar5,0xb51c,0xb7f6);
    wVar2 = (word)((ulong)uVar15 >> 0x10);
    iVar4 = 0;
    if (bVar11) {
      iVar4 = -1;
    }
    uVar10 = 0;
    uVar12 = iVar4 == 0 && wVar2 == 0;
    if (iVar4 != 0 || wVar2 != 0) {
      qb3f_61((word)uVar15,0xd062,0xb70a,0xb51c,0xb7f6);
      FUN_1000_c33b();
      DAT_2000_b702 = 1;
      FUN_1000_6baf();
      wVar2 = extraout_DX;
    }
    puVar8 = (undefined *)&lit_S;
    uVar15 = qb3f_62(0xb49c,0xd068,wVar2,0xb51c,0xb7f6);
    wVar2 = (word)((ulong)uVar15 >> 0x10);
    if ((bool)uVar12) {
      wVar9 = 0x1b9a;
      uVar15 = qb3f_9f((word)uVar15,(word)puVar8,wVar2,0x1b9a,0xb7f6);
      if ((bool)uVar12) {
        qb3f_7b((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb7f6,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar2 = extraout_DX_00;
    }
    puVar8 = (undefined *)&lit_M;
    uVar15 = qb3f_62(0xb49c,0xb8ac,wVar2,wVar9,0xb7f6);
    wVar2 = (word)((ulong)uVar15 >> 0x10);
    if ((bool)uVar12) {
      wVar9 = 0x1b9e;
      uVar15 = qb3f_9f((word)uVar15,(word)puVar8,wVar2,0x1b9e,0xb7f6);
      if ((bool)uVar12) {
        qb3f_7b((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb7d8,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar2 = extraout_DX_01;
    }
    puVar8 = (undefined *)&lit_K;
    uVar15 = qb3f_62(0xb49c,0xb8b8,wVar2,wVar9,0xb7f6);
    wVar2 = (word)((ulong)uVar15 >> 0x10);
    if ((bool)uVar12) {
      wVar9 = 0x1b96;
      uVar15 = qb3f_9f((word)uVar15,(word)puVar8,wVar2,0x1b96,0xb7f6);
      if ((bool)uVar12) {
        qb3f_7b((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xbb60,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar2 = extraout_DX_02;
    }
    di_00 = (char *)0xb7f6;
    qb3f_62(0xb49c,0xb8b2,wVar2,wVar9,0xb7f6);
    wVar2 = extraout_DX_03;
    if ((bool)uVar12) {
      FUN_1000_7ffb();
      DAT_2000_b702 = 1;
      FUN_1000_6baf();
      wVar2 = extraout_DX_04;
    }
    puVar8 = (undefined *)&lit_F;
    uVar15 = qb3f_62(0xb49c,0xd06e,wVar2,wVar9,0xb7f6);
    wVar2 = (word)((ulong)uVar15 >> 0x10);
    if ((bool)uVar12) {
      qb3f_7b((word)uVar15,(word)puVar8,wVar2,0xb802,0xb478);
      FUN_1000_89d9();
      return;
    }
    qb3f_62(0xb49c,0xbc68,wVar2,wVar9,0xb7f6);
    if ((bool)uVar12) {
      DAT_2000_b702 = 1;
      FUN_1000_90d3();
      return;
    }
    qb3f_62(0xb49c,0xb7e0,dx_01,wVar9,0xb7f6);
    if ((bool)uVar12) {
      DAT_2000_b702 = 1;
      FUN_1000_95ba();
      return;
    }
    puVar8 = (undefined *)&lit_T;
    qb3f_62(0xb49c,0xbcca,dx_02,wVar9,0xb7f6);
    if (!(bool)uVar12) break;
    uVar15 = FUN_1000_7c49();
    DAT_2000_b702 = 1;
  }
  DAT_2000_b54c = 0;
  puVar8 = (undefined *)&lit_W;
  uVar15 = qb3f_62(0xb49c,0xbcd0,dx_03,wVar9,0xb7f6);
  if ((bool)uVar12) {
    DAT_2000_b702 = 1;
    uVar15 = qb3e_42((word)uVar15,10,(word)((ulong)uVar15 >> 0x10),wVar9,0xb7f6);
    puVar8 = (undefined *)0x1;
    qb3e_44((word)uVar15,1,(word)((ulong)uVar15 >> 0x10),wVar9,0xb7f6);
    uVar15 = FUN_1000_7aa1();
    wVar5 = (word)((ulong)uVar15 >> 0x10);
    wVar2 = (word)uVar15;
    uVar12 = DAT_2000_b54c == 0;
    uVar10 = DAT_2000_b54c == 1;
    if ((bool)uVar10) {
      wVar5 = qb3e_32(wVar2,0xffff,wVar5,wVar9,0xb7f6);
      DAT_2000_b5d8 = 1;
LAB_1000_8f70:
      puVar8 = (undefined *)&lit_empty;
      qb3f_61(wVar5,0xbb56,0xb49c,wVar9,0xb7f6);
      uVar15 = FUN_1000_340c();
      uVar15 = qb3f_7b((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb7ee,0xb4fa);
      uVar15 = qb3f_7b((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb7ee,0xb50e);
      wVar9 = 0xb7ee;
      uVar15 = qb3f_7b((word)uVar15,0xb7ee,(word)((ulong)uVar15 >> 0x10),0xb7f6,0xb4c2);
      wVar2 = wVar9;
      uVar15 = qb3f_9f((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb6e4,wVar9);
      if (!(bool)uVar12 && !(bool)uVar10) {
        wVar5 = qb3f_75((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6e4,wVar9);
        qb3f_75(wVar5,wVar2,wVar2,0xb69c,wVar9);
        ((undefined2 *)&DAT_2000_3824)[wVar2] = extraout_DX_05;
      }
      if (DAT_2000_b5d8 == 1) {
        DAT_2000_b5d8 = 0;
        DAT_2000_b702 = 0;
        FUN_1000_4c28();
        return;
      }
      FUN_1000_8fea();
      DAT_2000_b660 = 0;
      DAT_2000_b536 = 1;
      DAT_2000_b702 = 0;
      FUN_1000_58f7();
      FUN_1000_4275();
      return;
    }
    if (DAT_2000_b54c == 2) {
      FUN_1000_8f6a();
      return;
    }
    if (DAT_2000_b54c == 3) {
      uVar10 = 0;
      goto LAB_1000_84c1;
    }
    if (DAT_2000_b54c == 6) {
      uVar15 = qb3f_7f(wVar2,(word)puVar8,wVar5,0xb568,0xbb60);
      qb3f_7d((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb568,0xb568);
      FUN_1000_92c8();
      return;
    }
    if (DAT_2000_b54c == 7) {
      uVar15 = qb3f_7f(wVar2,(word)puVar8,wVar5,0xb568,0xbb60);
      qb3f_7d((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb568,0xb568);
      FUN_1000_9298();
      return;
    }
    if (DAT_2000_b54c == 8) {
      uVar15 = qb3f_7f(wVar2,(word)puVar8,wVar5,0xb568,0xbb6c);
      qb3f_7d((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb568,0xb568);
      FUN_1000_93e9();
      return;
    }
    uVar10 = DAT_2000_b54c < 9;
    if (DAT_2000_b54c == 9) goto LAB_1000_84c1;
  }
  uVar12 = 0;
  uVar15 = qb3d_43((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar9,0xb7f6);
  uVar15 = qb3f_a3((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0x1bc2,0xb7f6);
  if (!(bool)uVar10 && !(bool)uVar12) {
    puVar8 = (undefined *)&lit_B;
    uVar15 = qb3f_62(0xb49c,0xca72,(word)((ulong)uVar15 >> 0x10),0x1bc2,0xb7f6);
    if ((bool)uVar12) {
      uVar15 = qb3d_34((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0x1bc2,0xb7f6);
      uVar15 = qb3f_91((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0x1bc2,0xcc52);
      wVar2 = 0x1a;
      uVar15 = qb3d_03((word)uVar15,0x1a,(word)((ulong)uVar15 >> 0x10),0x1bc2,0xcc52);
      uVar15 = qb3f_81((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0x1bc2,0xbe6e);
      uVar15 = qb3f_7d((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0x1bc2,0xb574);
      uVar15 = qb3f_97((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xb574);
      wVar5 = 0xb6e4;
      wVar9 = 0xb574;
      wVar2 = qb3f_7d((word)uVar15,0xb574,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      uVar15 = qb3e_42(wVar2,0xb,wVar9,0xb574,0xb6e4);
      wVar2 = 1;
      uVar15 = qb3e_44((word)uVar15,1,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      qb3f_bc((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      wVar9 = 0x19;
      uVar15 = qb3d_0d(0x19,0x19,dx_04,0xb574,0xb6e4);
      uVar15 = qb3f_6e((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      uVar15 = qb3e_79((word)uVar15,wVar9,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      uVar15 = qb3e_42((word)uVar15,10,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      uVar15 = qb3e_44((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      uVar15 = qb3f_bc((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      wVar2 = (word)uVar15;
      uVar15 = qb3d_0d(wVar2,wVar2,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      uVar15 = qb3f_6e((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      uVar15 = qb3e_79((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb574,0xb6e4);
      wVar9 = (word)((ulong)uVar15 >> 0x10);
      qb3f_a7((word)uVar15,wVar2,wVar9,wVar9,0xb6e4);
      wVar2 = 0;
      if ((bool)uVar12) {
        wVar2 = 0xffff;
      }
      bVar11 = false;
      puVar8 = (undefined *)&lit_B;
      uVar15 = qb3f_62(0xb49c,0xca72,wVar2,wVar9,0xb6e4);
      uVar7 = (uint)((ulong)uVar15 >> 0x10);
      uVar3 = 0;
      if (!bVar11) {
        uVar3 = 0xffff;
      }
      uVar10 = 0;
      uVar12 = (uVar3 & uVar7) == 0;
      if (!(bool)uVar12) {
        uVar15 = qb3f_bc((word)uVar15,(word)puVar8,uVar7,wVar9,0xb6e4);
        uVar15 = qb3d_34((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar9,0xb6e4);
        uVar15 = qb3f_91((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar9,0xbb6c);
        wVar2 = 0x1a;
        uVar15 = qb3d_03((word)uVar15,0x1a,(word)((ulong)uVar15 >> 0x10),wVar9,0xbb6c);
        wVar5 = 0xb7f6;
        uVar15 = qb3f_81((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar9,0xb7f6);
        uVar15 = qb3f_77((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),wVar9,0xb7f6);
        uVar10 = 0xa01f < wVar2 * 4;
        puVar8 = (undefined *)(wVar2 * 4 + 0x5fe0);
        uVar12 = puVar8 == (undefined *)0x0;
        uVar15 = qb3f_6e((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar9,0xb7f6);
        uVar15 = qb3e_79((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar9,0xb7f6);
      }
      uVar15 = qb3f_a7((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb574,wVar5);
      if (!(bool)uVar10 && !(bool)uVar12) {
        uVar15 = qb3f_bc((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb574,wVar5);
        uVar15 = qb3d_34((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb574,wVar5);
        wVar9 = 0xb574;
        wVar2 = qb3f_91((word)uVar15,0xb574,(word)((ulong)uVar15 >> 0x10),0xb574,0xbb6c);
        wVar5 = 0x1a;
        uVar15 = qb3d_03(wVar2,0x1a,wVar9,0xb574,0xbb6c);
        uVar15 = qb3f_81((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb574,0xb7fa);
        uVar15 = qb3f_77((word)uVar15,wVar5,(word)((ulong)uVar15 >> 0x10),0xb574,0xb7fa);
        uVar10 = 0xa01f < wVar5 * 4;
        wVar2 = wVar5 * 4 + 0x5fe0;
        uVar12 = wVar2 == 0;
        uVar15 = qb3f_6e((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb574,0xb7fa);
        uVar15 = qb3e_79((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb574,0xb7fa);
        uVar15 = qb3e_42((word)uVar15,10,(word)((ulong)uVar15 >> 0x10),0xb574,0xb7fa);
        wVar2 = 1;
        uVar15 = qb3e_44((word)uVar15,1,(word)((ulong)uVar15 >> 0x10),0xb574,0xb7fa);
        uVar15 = qb3f_bc((word)uVar15,wVar2,(word)((ulong)uVar15 >> 0x10),0xb574,0xb7fa);
        uVar15 = qb3f_6a((word)uVar15,0xd0a6,(word)((ulong)uVar15 >> 0x10),0xb574,0xb7fa);
        wVar2 = (word)((ulong)uVar15 >> 0x10);
        uVar15 = qb3f_67((word)uVar15,wVar2,wVar2,0xb574,0xb7fa);
        puVar8 = (undefined *)&lit_POINT;
        uVar15 = qb3f_6a((word)uVar15,0xd0b2,(word)((ulong)uVar15 >> 0x10),0xb574,0xb7fa);
        uVar15 = qb3e_79((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb574,0xb7fa);
        wVar2 = (word)((ulong)uVar15 >> 0x10);
        uVar15 = qb3f_9f((word)uVar15,(word)puVar8,wVar2,wVar2,0xb7f6);
        wVar9 = (word)((ulong)uVar15 >> 0x10);
        if ((bool)uVar10 || (bool)uVar12) {
          uVar15 = qb3f_bc((word)uVar15,(word)puVar8,wVar9,wVar2,0xb7f6);
          puVar8 = (undefined *)&lit_empty;
          uVar15 = qb3f_6e((word)uVar15,0xc910,(word)((ulong)uVar15 >> 0x10),wVar2,0xb7f6);
          uVar15 = qb3e_79((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar2,0xb7f6);
        }
        else {
          uVar15 = qb3f_bc((word)uVar15,(word)puVar8,wVar9,wVar2,0xb7f6);
          puVar8 = (undefined *)&lit_S;
          uVar15 = qb3f_6e((word)uVar15,0xd0bc,(word)((ulong)uVar15 >> 0x10),wVar2,0xb7f6);
          uVar15 = qb3e_79((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar2,0xb7f6);
        }
      }
      wVar2 = 0xb7ee;
      uVar15 = qb3f_7b((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb7ee,0xb574);
      uVar15 = qb3d_43((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb7ee,0xb574);
      di = (undefined *)0xb71a;
      uVar15 = qb3f_7d((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb7ee,0xb71a);
      do {
        uVar15 = qb3d_43((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar2,(word)di);
        uVar15 = qb3f_7d((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),wVar2,0xb71e);
        di = (undefined *)0xb71e;
        wVar2 = 0xb71a;
        uVar15 = qb3f_7f((word)uVar15,0xb71e,(word)((ulong)uVar15 >> 0x10),0xb71a,0xb7f6);
        puVar8 = di;
        uVar15 = qb3f_a1((word)uVar15,(word)di,(word)((ulong)uVar15 >> 0x10),0xb71a,(word)di);
      } while ((bool)uVar10);
      uVar15 = qb3f_9f((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xb7f6);
      if ((bool)uVar10) {
        FUN_1000_a335();
        return;
      }
      uVar15 = qb3d_34((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xb7f6);
      uVar15 = qb3f_91((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xbc26);
      uVar15 = qb3d_03((word)uVar15,0x1a,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xbc26);
      puVar8 = DAT_2000_b6f8;
      uVar15 = qb3f_71((word)uVar15,(word)DAT_2000_b6f8,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xbc26)
      ;
      uVar15 = qb3f_57((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xbc26);
      uVar15 = qb3f_85((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xbc26);
      uVar15 = qb3f_81((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb6e4,0xb7f6);
      di_00 = (char *)0x1fa6;
      uVar15 = qb3f_a1((word)uVar15,(word)puVar8,(word)((ulong)uVar15 >> 0x10),0xb6e4,0x1fa6);
      if (!(bool)uVar10) {
        FUN_1000_9a2f();
        return;
      }
    }
  }
  goto LAB_1000_84c1;
}


// ==== FUN_1000_89b4 @ 1000:89b4 (size 37) callers: FUN_1000_803a

void __cdecl16near FUN_1000_89b4(void)

{
  word in_AX;
  word in_DX;
  word bx;
  undefined *puVar1;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  uVar2 = qb3e_42(in_AX,10,in_DX,unaff_SI,unaff_DI);
  bx = 1;
  uVar2 = qb3e_44((word)uVar2,1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_bc((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  puVar1 = (undefined *)&lit_YOU_DO_NOT_HAVE_THAT;
  uVar2 = qb3f_6e((word)uVar2,0xd074,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3e_79((word)uVar2,(word)puVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_bc((word)uVar2,(word)puVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  puVar1 = (undefined *)&lit_WEAPON;
  uVar2 = qb3f_6e((word)uVar2,0xd08c,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar2,(word)puVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_89d9 @ 1000:89d9 (size 1181) callers: FUN_1000_803a

void FUN_1000_89d9(void)

{
  uint *puVar1;
  byte bVar2;
  byte bVar3;
  word in_AX;
  uint uVar4;
  uint uVar5;
  int iVar6;
  word dx;
  word ax;
  word dx_00;
  word extraout_DX;
  word extraout_DX_00;
  word extraout_DX_01;
  word extraout_DX_02;
  word extraout_DX_03;
  word extraout_DX_04;
  word dx_01;
  word dx_02;
  word dx_03;
  word extraout_DX_05;
  word dx_04;
  word dx_05;
  undefined2 extraout_DX_06;
  word extraout_DX_07;
  word extraout_DX_08;
  word dx_06;
  undefined2 extraout_DX_09;
  word wVar7;
  undefined *puVar8;
  undefined *puVar9;
  word wVar10;
  int unaff_BP;
  word unaff_SI;
  word wVar11;
  word unaff_DI;
  word wVar12;
  char *di;
  undefined2 unaff_SS;
  bool bVar13;
  undefined1 uVar14;
  byte in_AF;
  bool bVar15;
  undefined1 uVar16;
  undefined1 in_ZF;
  undefined1 uVar17;
  undefined4 uVar18;
  
  wVar7 = 0xb49c;
  uVar18 = qb3f_61(in_AX,0xb49c,0xb70e,unaff_SI,unaff_DI);
  wVar11 = 0xbc22;
  uVar18 = qb3f_7b((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xbc22,0xb712);
  uVar18 = qb3f_7b((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xbc22,0xb716);
  uVar18 = qb3f_7b((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xbc22,0xb2aa);
  wVar12 = 0xb574;
  uVar18 = qb3f_7b((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xbc22,0xb574);
  do {
    uVar18 = qb3d_34((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar11,wVar12);
    uVar18 = qb3f_91((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar11,0xbc1e);
    uVar18 = qb3d_03((word)uVar18,0x1a,(word)((ulong)uVar18 >> 0x10),wVar11,0xbc1e);
    wVar12 = 0xbc1e;
    uVar18 = qb3f_81((word)uVar18,0xbc1e,(word)((ulong)uVar18 >> 0x10),wVar11,0xb7f6);
    wVar7 = qb3f_7d((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),wVar11,0x52fc);
    uVar18 = qb3f_8f(wVar7,wVar12,0x52fc,0xb520,0xc08e);
    wVar7 = 0x1a;
    uVar18 = qb3d_03((word)uVar18,0x1a,(word)((ulong)uVar18 >> 0x10),0xb520,0xc08e);
    uVar18 = qb3f_81((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb520,0xb712);
    wVar11 = (word)((ulong)uVar18 >> 0x10);
    uVar18 = qb3f_81((word)uVar18,wVar7,0xb712,0xb520,wVar11);
    uVar18 = qb3f_81((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),0xb520,0xb4ea);
    wVar7 = (word)((ulong)uVar18 >> 0x10);
    uVar18 = qb3f_7d((word)uVar18,wVar11,wVar7,0xb520,wVar7);
    wVar10 = wVar12;
    wVar7 = wVar11;
    uVar18 = qb3f_9f((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),wVar11,wVar12);
  } while ((bool)in_ZF);
  puVar8 = (undefined *)&lit_S;
  uVar18 = qb3f_62(0xb49c,0xd068,(word)((ulong)uVar18 >> 0x10),wVar11,wVar12);
  wVar7 = (word)((ulong)uVar18 >> 0x10);
  if ((bool)in_ZF) {
    wVar12 = 0xb712;
    wVar11 = 0xb42a;
    uVar18 = qb3f_7f((word)uVar18,(word)puVar8,wVar7,0xb42a,0xb712);
    qb3f_7d((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb42a,0xb712);
    wVar7 = extraout_DX_05;
  }
  puVar8 = (undefined *)&lit_M;
  uVar18 = qb3f_62(0xb49c,0xb8ac,wVar7,wVar11,wVar12);
  if ((bool)in_ZF) {
    uVar18 = qb3f_7f((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb42e,0xb712);
    uVar18 = qb3f_7d((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb42e,0xb712);
  }
  uVar18 = qb3f_97((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6b4,0xb4ea);
  uVar18 = qb3f_91((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6b4,0xc08e);
  qb3f_77((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6b4,0xc08e);
  DAT_2000_b5e4 = puVar8;
  if (5 < (int)puVar8) {
    DAT_2000_b5e4 = (undefined *)0x5;
  }
  uVar14 = (undefined *)0xfffa < DAT_2000_b5e4;
  puVar9 = DAT_2000_b5e4 + 5;
  uVar17 = puVar9 == (undefined *)0x0;
  uVar18 = qb3f_57((word)puVar8,(word)puVar9,dx_04,0xb6b4,0xc08e);
  uVar18 = qb3f_71((word)uVar18,(word)puVar9,(word)((ulong)uVar18 >> 0x10),0xb48c,0xbba6);
  uVar18 = qb3f_8f((word)uVar18,(word)puVar9,(word)((ulong)uVar18 >> 0x10),0xb48c,0xbba6);
  wVar7 = 0x1a;
  uVar18 = qb3d_03((word)uVar18,0x1a,(word)((ulong)uVar18 >> 0x10),0xb48c,0xbba6);
  uVar18 = qb3f_85((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb48c,0xbba6);
  uVar18 = qb3f_81((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb48c,0xb6f0);
  uVar18 = qb3f_81((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb48c,0xb6b4);
  qb3f_77((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb48c,0xb6b4);
  wVar11 = 0xb7f6;
  wVar12 = 0xb57e;
  DAT_2000_b5e4 = (undefined *)wVar7;
  uVar18 = qb3f_9f(wVar7,wVar7,dx_05,0xb57e,0xb7f6);
  if ((bool)uVar17) {
    uVar14 = 4 < (uint)uVar18;
    wVar7 = (uint)uVar18 - 5;
    uVar18 = qb3f_57(wVar7,wVar7,(word)((ulong)uVar18 >> 0x10),0xb57e,0xb7f6);
    wVar11 = 0xb7fa;
    wVar12 = 0xb4ea;
    uVar18 = qb3f_71((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4ea,0xb7fa);
    uVar18 = qb3f_87((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4ea,0xb7fa);
    wVar7 = 0x1a;
    uVar18 = qb3d_03((word)uVar18,0x1a,(word)((ulong)uVar18 >> 0x10),0xb4ea,0xb7fa);
    uVar18 = qb3f_9d((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4ea,0xb7fa);
    qb3f_77((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4ea,0xb7fa);
    uVar18 = CONCAT22(extraout_DX_06,wVar7);
    DAT_2000_b5e4 = (undefined *)wVar7;
  }
  wVar7 = (word)DAT_2000_b5e4;
  uVar18 = qb3f_57((word)uVar18,(word)DAT_2000_b5e4,(word)((ulong)uVar18 >> 0x10),wVar12,wVar11);
  uVar18 = qb3f_a1((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,0xb712);
  if ((bool)uVar14) {
    uVar18 = qb3d_34((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,0xb712);
    uVar18 = qb3f_91((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,0xbe6e);
    uVar18 = qb3f_81((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,0xb574);
    wVar7 = 0xb574;
    uVar18 = qb3f_81((word)uVar18,0xb574,(word)((ulong)uVar18 >> 0x10),wVar12,0xb520);
    uVar18 = qb3f_81((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,0xb7f6);
    uVar18 = qb3f_7d((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,wVar7);
  }
  uVar18 = qb3f_7f((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xd09e);
  wVar7 = (word)DAT_2000_b5e4;
  uVar18 = qb3f_71((word)uVar18,(word)DAT_2000_b5e4,(word)((ulong)uVar18 >> 0x10),0xb712,0xd09e);
  uVar18 = qb3f_57((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xd09e);
  uVar18 = qb3f_a5((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xd09e);
  *(byte *)(wVar7 + 3) = *(byte *)(wVar7 + 3) ^ 0xe9;
  uVar18 = qb3d_34(CONCAT11((char)((ulong)uVar18 >> 8),(byte)uVar18 & *(byte *)(wVar7 + 0xb712)),
                   wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xd09e);
  uVar18 = qb3f_91((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xbe6e);
  uVar18 = qb3f_81((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xb574);
  wVar7 = 0xb574;
  uVar18 = qb3f_81((word)uVar18,0xb574,(word)((ulong)uVar18 >> 0x10),0xb712,0xb520);
  uVar18 = qb3f_81((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xb7f6);
  uVar18 = qb3f_7d((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,wVar7);
  uVar18 = qb3f_7f((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xd0a2);
  wVar7 = (word)DAT_2000_b5e4;
  uVar18 = qb3f_71((word)uVar18,(word)DAT_2000_b5e4,(word)((ulong)uVar18 >> 0x10),0xb712,0xd0a2);
  uVar18 = qb3f_57((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xd0a2);
  uVar18 = qb3f_a5((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xd0a2);
  *(byte *)(wVar7 + 3) = *(byte *)(wVar7 + 3) ^ 0xe9;
  uVar18 = qb3d_34((int)uVar18 - *(int *)(wVar7 + 0xb712),wVar7,(word)((ulong)uVar18 >> 0x10),0xb712
                   ,0xd0a2);
  uVar18 = qb3f_91((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb712,0xbd2e);
  uVar18 = qb3f_71((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb520,0xbd2e);
  uVar18 = qb3f_ab((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb520,0xbd2e);
  in_AF = 9 < ((byte)uVar18 & 0xf) | in_AF;
  bVar3 = (byte)uVar18 + in_AF * -6 & 0xf;
  bVar2 = 9 < bVar3 | in_AF;
  puVar1 = (uint *)(unaff_BP + wVar10 + 0x7d0d);
  uVar14 = 0;
  *puVar1 = *puVar1 | 0xb7f6;
  uVar17 = *puVar1 == 0;
  uVar18 = qb3f_81(CONCAT11(((char)((ulong)uVar18 >> 8) - in_AF) - bVar2,bVar3 + bVar2 * -6) &
                   0xff0f,wVar7,(word)((ulong)uVar18 >> 0x10),0xb520,0xbd2e);
  uVar18 = qb3f_7d((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb520,wVar7);
  wVar12 = 0xb574;
  uVar18 = qb3d_03((word)uVar18,0xb574,(word)((ulong)uVar18 >> 0x10),0xb520,wVar7);
  uVar18 = qb3f_7d((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xb520,wVar12);
  wVar7 = 0xb7f6;
  uVar18 = qb3f_9f((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),wVar12,0xb7f6);
  if (!(bool)uVar14) {
    wVar7 = 0xb7f6;
    wVar11 = 0xb6f4;
    qb3f_9f((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xb6f4,0xb7f6);
    wVar12 = 0;
    if ((bool)uVar17) {
      wVar12 = 0xffff;
    }
    bVar13 = false;
    uVar18 = qb3f_62(0xb70e,0xb8ac,wVar12,0xb6f4,0xb7f6);
    wVar12 = (word)((ulong)uVar18 >> 0x10);
    uVar5 = 0;
    if (bVar13) {
      uVar5 = 0xffff;
    }
    uVar14 = (uVar5 & wVar12) == 0;
    if (!(bool)uVar14) {
      wVar10 = 0xb7f6;
      wVar11 = 0xb574;
      wVar7 = qb3f_8f((word)uVar18,0xb7f6,wVar12,0xb574,0xbc42);
      uVar18 = qb3f_81(wVar7,wVar10,0xb574,0xb574,wVar10);
      wVar12 = 0x1a;
      uVar18 = qb3d_03((word)uVar18,0x1a,(word)((ulong)uVar18 >> 0x10),0xb574,wVar10);
      wVar7 = (word)((ulong)uVar18 >> 0x10);
      qb3f_7d((word)uVar18,wVar12,wVar7,0xb574,wVar7);
      wVar12 = extraout_DX_07;
    }
    puVar8 = (undefined *)&lit_K;
    uVar18 = qb3f_62(0xb70e,0xb8b8,wVar12,wVar11,wVar7);
    wVar12 = (word)((ulong)uVar18 >> 0x10);
    if ((bool)uVar14) {
      wVar11 = 0xb574;
      uVar18 = qb3f_8f((word)uVar18,(word)puVar8,wVar12,0xb574,0xbc42);
      uVar18 = qb3d_03((word)uVar18,0x1a,(word)((ulong)uVar18 >> 0x10),0xb574,0xbc42);
      wVar7 = 0xb574;
      uVar18 = qb3f_81((word)uVar18,0xb574,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7f6);
      qb3f_7d((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb574,wVar7);
      wVar12 = extraout_DX_08;
    }
    puVar8 = (undefined *)&lit_F;
    uVar18 = qb3f_62(0xb70e,0xd06e,wVar12,wVar11,wVar7);
    if ((bool)uVar14) {
      uVar18 = qb3f_87((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb574,0xbb60);
      uVar18 = qb3d_03((word)uVar18,0x1a,(word)((ulong)uVar18 >> 0x10),0xb574,0xbb60);
      puVar8 = (undefined *)0xb574;
      uVar18 = qb3f_81((word)uVar18,0xb574,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7f6);
      uVar18 = qb3f_7d((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb574,(word)puVar8);
    }
    wVar7 = 0xb7d8;
    wVar11 = 0xb6f4;
    qb3f_9f((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6f4,0xb7d8);
    wVar12 = 0;
    if ((bool)uVar14) {
      wVar12 = 0xffff;
    }
    bVar13 = false;
    puVar8 = (undefined *)&lit_S;
    uVar18 = qb3f_62(0xb70e,0xd068,wVar12,0xb6f4,0xb7d8);
    uVar4 = (uint)((ulong)uVar18 >> 0x10);
    uVar5 = 0;
    if (bVar13) {
      uVar5 = 0xffff;
    }
    uVar14 = 0;
    uVar17 = (uVar5 & uVar4) == 0;
    if (!(bool)uVar17) {
      wVar11 = 0xb574;
      uVar18 = qb3f_8f((word)uVar18,(word)puVar8,uVar4,0xb574,0xbc42);
      wVar12 = 0xb574;
      wVar7 = qb3f_81((word)uVar18,0xb574,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7f6);
      wVar10 = 0x1a;
      uVar18 = qb3d_03(wVar7,0x1a,wVar12,0xb574,0xb7f6);
      wVar7 = (word)((ulong)uVar18 >> 0x10);
      uVar18 = qb3f_7d((word)uVar18,wVar10,wVar7,0xb574,wVar7);
    }
    wVar12 = DAT_2000_b6ce;
    uVar18 = qb3f_57((word)uVar18,DAT_2000_b6ce,(word)((ulong)uVar18 >> 0x10),wVar11,wVar7);
    wVar7 = 0xb574;
    uVar18 = qb3f_81((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),wVar11,0xb574);
    uVar18 = qb3f_7d((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),wVar11,0xb574);
    DAT_2000_b6ce = 0;
  }
  uVar18 = qb3f_a7((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xb574,wVar7);
  if ((bool)uVar14) {
    uVar18 = qb3f_7b((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xb7ee,0xb574);
  }
  do {
    uVar18 = qb3f_97((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xb6e4,0xb574);
    wVar11 = 0xb6e4;
    wVar12 = 0xb574;
    wVar7 = qb3f_7d((word)uVar18,0xb574,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    uVar18 = qb3e_42(wVar7,0xb,wVar12,0xb574,0xb6e4);
    wVar7 = 1;
    uVar18 = qb3e_44((word)uVar18,1,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    qb3f_bc((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    wVar12 = 0x19;
    uVar18 = qb3d_0d(0x19,0x19,dx_06,0xb574,0xb6e4);
    uVar18 = qb3f_6e((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    uVar18 = qb3e_79((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    uVar18 = qb3e_42((word)uVar18,10,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    uVar18 = qb3e_44((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    uVar18 = qb3f_bc((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    wVar7 = (word)uVar18;
    uVar18 = qb3d_0d(wVar7,wVar7,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    uVar18 = qb3f_6e((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    uVar18 = qb3e_79((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb574,0xb6e4);
    wVar12 = (word)((ulong)uVar18 >> 0x10);
    qb3f_a7((word)uVar18,wVar7,wVar12,wVar12,0xb6e4);
    wVar7 = 0;
    if ((bool)uVar17) {
      wVar7 = 0xffff;
    }
    bVar13 = false;
    puVar8 = (undefined *)&lit_B;
    uVar18 = qb3f_62(0xb49c,0xca72,wVar7,wVar12,0xb6e4);
    uVar4 = (uint)((ulong)uVar18 >> 0x10);
    uVar5 = 0;
    if (!bVar13) {
      uVar5 = 0xffff;
    }
    uVar14 = 0;
    uVar17 = (uVar5 & uVar4) == 0;
    if (!(bool)uVar17) {
      uVar18 = qb3f_bc((word)uVar18,(word)puVar8,uVar4,wVar12,0xb6e4);
      uVar18 = qb3d_34((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),wVar12,0xb6e4);
      uVar18 = qb3f_91((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),wVar12,0xbb6c);
      wVar7 = 0x1a;
      uVar18 = qb3d_03((word)uVar18,0x1a,(word)((ulong)uVar18 >> 0x10),wVar12,0xbb6c);
      wVar11 = 0xb7f6;
      uVar18 = qb3f_81((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,0xb7f6);
      uVar18 = qb3f_77((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,0xb7f6);
      uVar14 = 0xa01f < wVar7 * 4;
      puVar8 = (undefined *)(wVar7 * 4 + 0x5fe0);
      uVar17 = puVar8 == (undefined *)0x0;
      uVar18 = qb3f_6e((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),wVar12,0xb7f6);
      uVar18 = qb3e_79((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),wVar12,0xb7f6);
    }
    uVar18 = qb3f_a7((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb574,wVar11);
    if (!(bool)uVar14 && !(bool)uVar17) {
      uVar18 = qb3f_bc((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb574,wVar11);
      uVar18 = qb3d_34((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb574,wVar11);
      wVar12 = 0xb574;
      wVar7 = qb3f_91((word)uVar18,0xb574,(word)((ulong)uVar18 >> 0x10),0xb574,0xbb6c);
      wVar11 = 0x1a;
      uVar18 = qb3d_03(wVar7,0x1a,wVar12,0xb574,0xbb6c);
      uVar18 = qb3f_81((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7fa);
      uVar18 = qb3f_77((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7fa);
      uVar14 = 0xa01f < wVar11 * 4;
      wVar7 = wVar11 * 4 + 0x5fe0;
      uVar17 = wVar7 == 0;
      uVar18 = qb3f_6e((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7fa);
      uVar18 = qb3e_79((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7fa);
      uVar18 = qb3e_42((word)uVar18,10,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7fa);
      wVar7 = 1;
      uVar18 = qb3e_44((word)uVar18,1,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7fa);
      uVar18 = qb3f_bc((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7fa);
      uVar18 = qb3f_6a((word)uVar18,0xd0a6,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7fa);
      wVar7 = (word)((ulong)uVar18 >> 0x10);
      uVar18 = qb3f_67((word)uVar18,wVar7,wVar7,0xb574,0xb7fa);
      puVar8 = (undefined *)&lit_POINT;
      uVar18 = qb3f_6a((word)uVar18,0xd0b2,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7fa);
      uVar18 = qb3e_79((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb574,0xb7fa);
      wVar7 = (word)((ulong)uVar18 >> 0x10);
      uVar18 = qb3f_9f((word)uVar18,(word)puVar8,wVar7,wVar7,0xb7f6);
      wVar12 = (word)((ulong)uVar18 >> 0x10);
      if ((bool)uVar14 || (bool)uVar17) {
        uVar18 = qb3f_bc((word)uVar18,(word)puVar8,wVar12,wVar7,0xb7f6);
        puVar8 = (undefined *)&lit_empty;
        uVar18 = qb3f_6e((word)uVar18,0xc910,(word)((ulong)uVar18 >> 0x10),wVar7,0xb7f6);
        uVar18 = qb3e_79((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),wVar7,0xb7f6);
      }
      else {
        uVar18 = qb3f_bc((word)uVar18,(word)puVar8,wVar12,wVar7,0xb7f6);
        puVar8 = (undefined *)&lit_S;
        uVar18 = qb3f_6e((word)uVar18,0xd0bc,(word)((ulong)uVar18 >> 0x10),wVar7,0xb7f6);
        uVar18 = qb3e_79((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),wVar7,0xb7f6);
      }
    }
    wVar7 = 0xb7ee;
    uVar18 = qb3f_7b((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb7ee,0xb574);
    uVar18 = qb3d_43((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb7ee,0xb574);
    puVar9 = (undefined *)0xb71a;
    uVar18 = qb3f_7d((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb7ee,0xb71a);
    do {
      uVar18 = qb3d_43((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),wVar7,(word)puVar9);
      uVar18 = qb3f_7d((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),wVar7,0xb71e);
      puVar9 = (undefined *)0xb71e;
      wVar7 = 0xb71a;
      uVar18 = qb3f_7f((word)uVar18,0xb71e,(word)((ulong)uVar18 >> 0x10),0xb71a,0xb7f6);
      puVar8 = puVar9;
      uVar18 = qb3f_a1((word)uVar18,(word)puVar9,(word)((ulong)uVar18 >> 0x10),0xb71a,(word)puVar9);
    } while ((bool)uVar14);
    uVar18 = qb3f_9f((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6e4,0xb7f6);
    if ((bool)uVar14) {
      FUN_1000_a335();
      return;
    }
    uVar18 = qb3d_34((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6e4,0xb7f6);
    uVar18 = qb3f_91((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6e4,0xbc26);
    uVar18 = qb3d_03((word)uVar18,0x1a,(word)((ulong)uVar18 >> 0x10),0xb6e4,0xbc26);
    puVar8 = DAT_2000_b6f8;
    uVar18 = qb3f_71((word)uVar18,(word)DAT_2000_b6f8,(word)((ulong)uVar18 >> 0x10),0xb6e4,0xbc26);
    uVar18 = qb3f_57((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6e4,0xbc26);
    uVar18 = qb3f_85((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6e4,0xbc26);
    uVar18 = qb3f_81((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6e4,0xb7f6);
    di = (char *)0x1fa6;
    uVar18 = qb3f_a1((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb6e4,0x1fa6);
    if (!(bool)uVar14) {
      FUN_1000_9a2f();
      return;
    }
LAB_1000_84c1:
    do {
      while( true ) {
        uVar18 = qb3f_a7((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb4ea,(word)di);
        wVar7 = 0;
        if ((bool)uVar14) {
          wVar7 = 0xffff;
        }
        wVar12 = 0xb4f2;
        qb3f_a7((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        iVar6 = 0;
        if ((bool)uVar14) {
          iVar6 = -1;
        }
        if (iVar6 != 0 || wVar7 != 0) {
          FUN_1000_a013();
          return;
        }
        if (DAT_2000_b702 == 1) {
          DAT_2000_b702 = 0;
          DAT_2000_b536 = 0xffff;
          FUN_1000_8fea();
          FUN_1000_4275();
          FUN_1000_580f();
          FUN_1000_7fc8();
        }
        uVar17 = DAT_2000_b704 == 0;
        uVar14 = DAT_2000_b704 == 1;
        if ((bool)uVar14) {
          FUN_1000_4abd();
          DAT_2000_b704 = 0;
        }
        FUN_1000_7f43();
        uVar18 = FUN_1000_49d1();
        uVar18 = qb3e_42((word)uVar18,0x18,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar11 = 1;
        uVar18 = qb3e_44((word)uVar18,1,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar7 = qb3f_bc((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        puVar8 = (undefined *)&lit_EXP_VALUE;
        uVar18 = qb3f_6a(wVar7,0xd018,wVar11,0xb4f2,(word)di);
        uVar18 = qb3e_79((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3e_42((word)uVar18,0x19,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar11 = 3;
        uVar18 = qb3e_44((word)uVar18,3,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3f_bc((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar7 = 0xb6fa;
        uVar18 = qb3f_68((word)uVar18,0xb6fa,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3e_79((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar7 = wVar11;
        uVar18 = qb3e_42((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar10 = (word)((ulong)uVar18 >> 0x10);
        uVar18 = qb3e_44((word)uVar18,wVar10,wVar7,0xb4f2,(word)di);
        uVar18 = qb3f_bc((word)uVar18,wVar10,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        qb3f_6a((word)uVar18,0xd028,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar7 = 0x15;
        uVar18 = qb3d_0d(0x15,0x15,dx,0xb4f2,(word)di);
        uVar18 = qb3f_6a((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3e_79((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3e_42((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar7 = (word)uVar18;
        uVar18 = qb3e_44(wVar7,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3f_bc((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar7 = 0xb4f2;
        uVar18 = qb3f_6b((word)uVar18,0xb4f2,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3e_79((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3f_bc((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3f_6a((word)uVar18,0xd040,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar7 = 0x16;
        uVar18 = qb3d_0d((word)uVar18,0x16,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3f_6a((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3e_79((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3e_42((word)uVar18,4,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar7 = (word)uVar18;
        uVar18 = qb3e_44(wVar7,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3f_bc((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        wVar7 = 0xb6e4;
        uVar18 = qb3f_6b((word)uVar18,0xb6e4,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        uVar18 = qb3e_79((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb4f2,(word)di);
        DAT_2000_b536 = 0;
        do {
          uVar18 = qb3d_43((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,(word)di);
          uVar18 = qb3f_7d((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,0xb6d8);
          uVar18 = qb3f_9f((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0x1bc2,0xb6d8);
          uVar5 = 0;
          if ((bool)uVar17) {
            uVar5 = 0xffff;
            uVar14 = 0;
          }
          uVar18 = qb3d_43((word)uVar18,uVar5,(word)((ulong)uVar18 >> 0x10),0x1bc2,0xb6d8);
          wVar7 = qb3f_9b((word)uVar18,uVar5,(word)((ulong)uVar18 >> 0x10),0x1bc2,0xb6d8);
          uVar18 = qb3f_a1(wVar7,uVar5,0x1bc2,0x1bc2,0xd056);
          wVar7 = (word)((ulong)uVar18 >> 0x10);
          uVar4 = 0;
          if (!(bool)uVar17 && !(bool)uVar14) {
            uVar4 = 0xffff;
          }
          bVar13 = false;
          uVar4 = uVar4 | uVar5;
          bVar15 = uVar4 == 0;
          uVar18 = qb3f_a7((word)uVar18,uVar5,wVar7,wVar7,0xd056);
          wVar7 = (word)((ulong)uVar18 >> 0x10);
          uVar5 = 0;
          if (!bVar13 && !bVar15) {
            uVar5 = 0xffff;
          }
          uVar14 = 0;
          uVar17 = (uVar5 & uVar4) == 0;
          if ((bool)uVar17) {
            wVar12 = 0;
          }
          else {
            uVar18 = qb3f_7b((word)uVar18,uVar5 & uVar4,wVar7,0xbc2a,wVar7);
            uVar18 = qb3e_42((word)uVar18,7,(word)((ulong)uVar18 >> 0x10),0xbc2a,wVar7);
            wVar12 = 0x14;
            uVar18 = qb3e_44((word)uVar18,0x14,(word)((ulong)uVar18 >> 0x10),0xbc2a,wVar7);
            uVar18 = qb3f_bc((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xbc2a,wVar7);
            wVar12 = 0xe;
            uVar18 = qb3d_0d((word)uVar18,0xe,(word)((ulong)uVar18 >> 0x10),0xbc2a,wVar7);
            uVar18 = qb3f_6a((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xbc2a,wVar7);
            uVar18 = qb3e_79((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xbc2a,wVar7);
          }
          uVar18 = qb3f_9f((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0x1bc6,0xb6d8);
          uVar5 = 0;
          if ((bool)uVar14) {
            uVar5 = 0xffff;
            uVar17 = 0;
          }
          uVar18 = qb3d_43((word)uVar18,uVar5,(word)((ulong)uVar18 >> 0x10),0x1bc6,0xb6d8);
          wVar7 = qb3f_9b((word)uVar18,uVar5,(word)((ulong)uVar18 >> 0x10),0x1bc6,0xb6d8);
          uVar18 = qb3f_a1(wVar7,uVar5,0x1bc6,0x1bc6,0xd056);
          wVar7 = (word)((ulong)uVar18 >> 0x10);
          uVar4 = 0;
          if (!(bool)uVar14 && !(bool)uVar17) {
            uVar4 = 0xffff;
          }
          bVar13 = false;
          uVar4 = uVar4 | uVar5;
          bVar15 = uVar4 == 0;
          uVar18 = qb3f_a7((word)uVar18,uVar5,wVar7,wVar7,0xd056);
          wVar7 = (word)((ulong)uVar18 >> 0x10);
          uVar5 = 0;
          if (!bVar13 && !bVar15) {
            uVar5 = 0xffff;
          }
          wVar12 = uVar5 & uVar4;
          uVar14 = 0;
          uVar17 = wVar12 == 0;
          if ((bool)uVar17) {
            wVar7 = 0;
          }
          else {
            uVar18 = qb3f_7b((word)uVar18,wVar12,wVar7,0xbc2a,wVar7);
            uVar18 = qb3f_7b((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xbc2a,0xb706);
            uVar18 = qb3e_42((word)uVar18,6,(word)((ulong)uVar18 >> 0x10),0xbc2a,0xb706);
            wVar7 = 0x14;
            uVar18 = qb3e_44((word)uVar18,0x14,(word)((ulong)uVar18 >> 0x10),0xbc2a,0xb706);
            uVar18 = qb3f_bc((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xbc2a,0xb706);
            uVar18 = qb3d_0d((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xbc2a,0xb706);
            uVar18 = qb3f_6a((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xbc2a,0xb706);
            uVar18 = qb3e_79((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xbc2a,0xb706);
          }
          uVar18 = qb3f_9f((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0x1bca,0xb6d8);
          uVar5 = 0;
          if ((bool)uVar14) {
            uVar5 = 0xffff;
            uVar17 = 0;
          }
          uVar18 = qb3d_43((word)uVar18,uVar5,(word)((ulong)uVar18 >> 0x10),0x1bca,0xb6d8);
          wVar7 = qb3f_9b((word)uVar18,uVar5,(word)((ulong)uVar18 >> 0x10),0x1bca,0xb6d8);
          di = (char *)s_ITS_HEALTH_POINTS__2000_d044 + 0x12;
          uVar18 = qb3f_a1(wVar7,uVar5,0x1bca,0x1bca,0xd056);
          wVar12 = (word)((ulong)uVar18 >> 0x10);
          uVar4 = 0;
          if (!(bool)uVar14 && !(bool)uVar17) {
            uVar4 = 0xffff;
          }
          bVar13 = false;
          uVar4 = uVar4 | uVar5;
          bVar15 = uVar4 == 0;
          uVar18 = qb3f_a7((word)uVar18,uVar5,wVar12,wVar12,0xd056);
          wVar7 = (word)((ulong)uVar18 >> 0x10);
          uVar5 = 0;
          if (!bVar13 && !bVar15) {
            uVar5 = 0xffff;
          }
          wVar11 = uVar5 & uVar4;
          uVar17 = 0;
          uVar16 = wVar11 == 0;
          if ((bool)uVar16) {
            wVar7 = 0;
          }
          else {
            uVar18 = qb3f_7b((word)uVar18,wVar11,wVar7,0xbc2a,wVar7);
            wVar12 = 0x1fa6;
            uVar18 = qb3f_7f((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),0x1fa6,0xd05a);
            di = (char *)0x1fa6;
            uVar18 = qb3f_7d((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),0x1fa6,0x1fa6);
            uVar18 = qb3e_42((word)uVar18,5,(word)((ulong)uVar18 >> 0x10),0x1fa6,0x1fa6);
            wVar7 = 0x14;
            uVar18 = qb3e_44((word)uVar18,0x14,(word)((ulong)uVar18 >> 0x10),0x1fa6,0x1fa6);
            uVar18 = qb3f_bc((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0x1fa6,0x1fa6);
            uVar18 = qb3d_0d((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0x1fa6,0x1fa6);
            uVar18 = qb3f_6e((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0x1fa6,0x1fa6);
            qb3e_79((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0x1fa6,0x1fa6);
          }
          uVar18 = FUN_1000_7eec();
          wVar11 = qb3d_06((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),wVar12,(word)di);
          qb3f_61(wVar11,wVar7,0xb49c,wVar12,(word)di);
          wVar7 = 0xbc1a;
          uVar18 = qb3f_62(ax,0xbc1a,ax,wVar12,(word)di);
          uVar14 = 1;
        } while ((bool)uVar16);
        DAT_2000_b54c = 0;
        FUN_1000_10be();
        uVar18 = FUN_1000_2f87();
        uVar18 = qb3f_7b((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xd05e,0xb51c);
        uVar18 = qb3f_7b((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xd05e,0xb512);
        qb3f_7b((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb7f6,0xb50e);
        uVar18 = FUN_1000_09e8();
        uVar18 = qb3f_7b((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb7ee,0xb4fa);
        wVar12 = 0xb512;
        uVar18 = qb3f_9f((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb512,0xb7f6);
        if ((bool)uVar16) {
          uVar18 = FUN_1000_54cb();
          wVar11 = (word)uVar18;
          if (DAT_2000_b5d8 == 1) {
            uVar14 = 1;
            uVar17 = 0;
            goto LAB_1000_8f70;
          }
        }
        uVar14 = 0;
        qb3f_7b((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb69c,0xb530);
        uVar18 = FUN_1000_6fbd();
        wVar7 = DAT_2000_b698;
        uVar18 = qb3f_57((word)uVar18,DAT_2000_b698,(word)((ulong)uVar18 >> 0x10),0xb69c,0xb530);
        wVar7 = qb3f_a1((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb69c,0xb4ca);
        wVar12 = 0;
        if (!(bool)uVar14) {
          wVar12 = 0xffff;
          uVar14 = 0;
        }
        wVar11 = DAT_2000_b69a;
        uVar18 = qb3f_57(wVar7,DAT_2000_b69a,wVar12,0xb69c,0xb4ca);
        uVar18 = qb3f_a1((word)uVar18,wVar11,(word)((ulong)uVar18 >> 0x10),0xb69c,0xb4d2);
        wVar7 = (word)((ulong)uVar18 >> 0x10);
        iVar6 = 0;
        if (!(bool)uVar14) {
          iVar6 = -1;
        }
        bVar13 = iVar6 == 0 && wVar7 == 0;
        if (iVar6 != 0 || wVar7 != 0) {
          FUN_1000_8e76();
          return;
        }
        wVar12 = 0xb51c;
        qb3f_9f((word)uVar18,0,wVar7,0xb51c,0xb7f6);
        if (bVar13) {
          FUN_1000_9a2f();
          return;
        }
        wVar7 = qb3f_62(0xb49c,0xb8a6,dx_00,0xb51c,0xb7f6);
        wVar11 = 0;
        if (bVar13) {
          wVar11 = 0xffff;
        }
        bVar13 = false;
        uVar18 = qb3f_62(wVar7,0xb4b0,wVar11,0xb51c,0xb7f6);
        wVar7 = (word)((ulong)uVar18 >> 0x10);
        iVar6 = 0;
        if (bVar13) {
          iVar6 = -1;
        }
        uVar14 = 0;
        uVar17 = iVar6 == 0 && wVar7 == 0;
        if (iVar6 != 0 || wVar7 != 0) {
          qb3f_61((word)uVar18,0xd062,0xb70a,0xb51c,0xb7f6);
          FUN_1000_c33b();
          DAT_2000_b702 = 1;
          FUN_1000_6baf();
          wVar7 = extraout_DX;
        }
        puVar8 = (undefined *)&lit_S;
        uVar18 = qb3f_62(0xb49c,0xd068,wVar7,0xb51c,0xb7f6);
        wVar7 = (word)((ulong)uVar18 >> 0x10);
        if ((bool)uVar17) {
          wVar12 = 0x1b9a;
          uVar18 = qb3f_9f((word)uVar18,(word)puVar8,wVar7,0x1b9a,0xb7f6);
          if ((bool)uVar17) {
            qb3f_7b((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb7f6,0xb478);
            FUN_1000_89d9();
            return;
          }
          FUN_1000_89b4();
          wVar7 = extraout_DX_00;
        }
        puVar8 = (undefined *)&lit_M;
        uVar18 = qb3f_62(0xb49c,0xb8ac,wVar7,wVar12,0xb7f6);
        wVar7 = (word)((ulong)uVar18 >> 0x10);
        if ((bool)uVar17) {
          wVar12 = 0x1b9e;
          uVar18 = qb3f_9f((word)uVar18,(word)puVar8,wVar7,0x1b9e,0xb7f6);
          if ((bool)uVar17) {
            qb3f_7b((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb7d8,0xb478);
            FUN_1000_89d9();
            return;
          }
          FUN_1000_89b4();
          wVar7 = extraout_DX_01;
        }
        puVar8 = (undefined *)&lit_K;
        uVar18 = qb3f_62(0xb49c,0xb8b8,wVar7,wVar12,0xb7f6);
        wVar7 = (word)((ulong)uVar18 >> 0x10);
        if ((bool)uVar17) {
          wVar12 = 0x1b96;
          uVar18 = qb3f_9f((word)uVar18,(word)puVar8,wVar7,0x1b96,0xb7f6);
          if ((bool)uVar17) {
            qb3f_7b((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xbb60,0xb478);
            FUN_1000_89d9();
            return;
          }
          FUN_1000_89b4();
          wVar7 = extraout_DX_02;
        }
        di = (char *)0xb7f6;
        qb3f_62(0xb49c,0xb8b2,wVar7,wVar12,0xb7f6);
        wVar7 = extraout_DX_03;
        if ((bool)uVar17) {
          FUN_1000_7ffb();
          DAT_2000_b702 = 1;
          FUN_1000_6baf();
          wVar7 = extraout_DX_04;
        }
        puVar8 = (undefined *)&lit_F;
        uVar18 = qb3f_62(0xb49c,0xd06e,wVar7,wVar12,0xb7f6);
        wVar7 = (word)((ulong)uVar18 >> 0x10);
        if ((bool)uVar17) {
          qb3f_7b((word)uVar18,(word)puVar8,wVar7,0xb802,0xb478);
          FUN_1000_89d9();
          return;
        }
        qb3f_62(0xb49c,0xbc68,wVar7,wVar12,0xb7f6);
        if ((bool)uVar17) {
          DAT_2000_b702 = 1;
          FUN_1000_90d3();
          return;
        }
        qb3f_62(0xb49c,0xb7e0,dx_01,wVar12,0xb7f6);
        if ((bool)uVar17) {
          DAT_2000_b702 = 1;
          FUN_1000_95ba();
          return;
        }
        puVar8 = (undefined *)&lit_T;
        qb3f_62(0xb49c,0xbcca,dx_02,wVar12,0xb7f6);
        if (!(bool)uVar17) break;
        uVar18 = FUN_1000_7c49();
        DAT_2000_b702 = 1;
      }
      DAT_2000_b54c = 0;
      puVar8 = (undefined *)&lit_W;
      uVar18 = qb3f_62(0xb49c,0xbcd0,dx_03,wVar12,0xb7f6);
      if ((bool)uVar17) {
        DAT_2000_b702 = 1;
        uVar18 = qb3e_42((word)uVar18,10,(word)((ulong)uVar18 >> 0x10),wVar12,0xb7f6);
        puVar8 = (undefined *)0x1;
        qb3e_44((word)uVar18,1,(word)((ulong)uVar18 >> 0x10),wVar12,0xb7f6);
        uVar18 = FUN_1000_7aa1();
        wVar11 = (word)((ulong)uVar18 >> 0x10);
        wVar7 = (word)uVar18;
        uVar17 = DAT_2000_b54c == 0;
        uVar14 = DAT_2000_b54c == 1;
        if ((bool)uVar14) {
          wVar11 = qb3e_32(wVar7,0xffff,wVar11,wVar12,0xb7f6);
          DAT_2000_b5d8 = 1;
LAB_1000_8f70:
          puVar8 = (undefined *)&lit_empty;
          qb3f_61(wVar11,0xbb56,0xb49c,wVar12,0xb7f6);
          uVar18 = FUN_1000_340c();
          uVar18 = qb3f_7b((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb7ee,0xb4fa);
          uVar18 = qb3f_7b((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb7ee,0xb50e);
          wVar12 = 0xb7ee;
          uVar18 = qb3f_7b((word)uVar18,0xb7ee,(word)((ulong)uVar18 >> 0x10),0xb7f6,0xb4c2);
          wVar7 = wVar12;
          uVar18 = qb3f_9f((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0xb6e4,wVar12);
          if (!(bool)uVar17 && !(bool)uVar14) {
            wVar11 = qb3f_75((word)uVar18,wVar7,(word)((ulong)uVar18 >> 0x10),0xb6e4,wVar12);
            qb3f_75(wVar11,wVar7,wVar7,0xb69c,wVar12);
            ((undefined2 *)&DAT_2000_3824)[wVar7] = extraout_DX_09;
          }
          if (DAT_2000_b5d8 == 1) {
            DAT_2000_b5d8 = 0;
            DAT_2000_b702 = 0;
            FUN_1000_4c28();
            return;
          }
          FUN_1000_8fea();
          DAT_2000_b660 = 0;
          DAT_2000_b536 = 1;
          DAT_2000_b702 = 0;
          FUN_1000_58f7();
          FUN_1000_4275();
          return;
        }
        if (DAT_2000_b54c == 2) {
          FUN_1000_8f6a();
          return;
        }
        if (DAT_2000_b54c == 3) {
          uVar14 = 0;
          goto LAB_1000_84c1;
        }
        if (DAT_2000_b54c == 6) {
          uVar18 = qb3f_7f(wVar7,(word)puVar8,wVar11,0xb568,0xbb60);
          qb3f_7d((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb568,0xb568);
          FUN_1000_92c8();
          return;
        }
        if (DAT_2000_b54c == 7) {
          uVar18 = qb3f_7f(wVar7,(word)puVar8,wVar11,0xb568,0xbb60);
          qb3f_7d((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb568,0xb568);
          FUN_1000_9298();
          return;
        }
        if (DAT_2000_b54c == 8) {
          uVar18 = qb3f_7f(wVar7,(word)puVar8,wVar11,0xb568,0xbb6c);
          qb3f_7d((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0xb568,0xb568);
          FUN_1000_93e9();
          return;
        }
        uVar14 = DAT_2000_b54c < 9;
        if (DAT_2000_b54c == 9) goto LAB_1000_84c1;
      }
      uVar17 = 0;
      uVar18 = qb3d_43((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),wVar12,0xb7f6);
      uVar18 = qb3f_a3((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0x1bc2,0xb7f6);
      if ((bool)uVar14 || (bool)uVar17) goto LAB_1000_84c1;
      puVar8 = (undefined *)&lit_B;
      uVar18 = qb3f_62(0xb49c,0xca72,(word)((ulong)uVar18 >> 0x10),0x1bc2,0xb7f6);
    } while (!(bool)uVar17);
    uVar18 = qb3d_34((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0x1bc2,0xb7f6);
    uVar18 = qb3f_91((word)uVar18,(word)puVar8,(word)((ulong)uVar18 >> 0x10),0x1bc2,0xcc52);
    wVar12 = 0x1a;
    uVar18 = qb3d_03((word)uVar18,0x1a,(word)((ulong)uVar18 >> 0x10),0x1bc2,0xcc52);
    uVar18 = qb3f_81((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0x1bc2,0xbe6e);
    uVar18 = qb3f_7d((word)uVar18,wVar12,(word)((ulong)uVar18 >> 0x10),0x1bc2,0xb574);
  } while( true );
}


// ==== FUN_1000_8e76 @ 1000:8e76 (size 244) callers: FUN_1000_803a

void FUN_1000_8e76(void)

{
  byte *pbVar1;
  word in_AX;
  word wVar2;
  word wVar3;
  word in_DX;
  uint uVar4;
  uint extraout_DX;
  word in_BX;
  uint uVar5;
  byte bVar6;
  word bx;
  int unaff_BP;
  undefined2 unaff_SS;
  undefined1 in_ZF;
  bool bVar7;
  undefined1 uVar8;
  undefined4 uVar9;
  
  uVar9 = qb3f_9f(in_AX,in_BX,in_DX,0xb48c,0xbb64);
  uVar5 = 0;
  if ((bool)in_ZF) {
    uVar5 = 0xffff;
  }
  bVar7 = false;
  wVar2 = qb3f_9f((word)uVar9,uVar5,(word)((ulong)uVar9 >> 0x10),0x1bba,0xb4ca);
  uVar4 = 0;
  if (bVar7) {
    uVar4 = 0xffff;
  }
  bVar7 = (uVar4 & uVar5) == 0;
  uVar9 = qb3f_9f(wVar2,uVar5,uVar4 & uVar5,0x1bbe,0xb4d2);
  uVar5 = (uint)((ulong)uVar9 >> 0x10);
  uVar4 = 0;
  if (bVar7) {
    uVar4 = 0xffff;
  }
  bVar7 = false;
  uVar8 = (uVar4 & uVar5) == 0;
  if (!(bool)uVar8) {
    FUN_1000_8f6a();
    return;
  }
  uVar9 = qb3f_a7((word)uVar9,0,uVar5,0xb2aa,0xb4d2);
  wVar2 = 0;
  if (!bVar7 && !(bool)uVar8) {
    wVar2 = 0xffff;
    uVar8 = 0;
  }
  wVar3 = qb3f_9f((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xbb60);
  uVar5 = 0;
  if ((bool)uVar8) {
    uVar5 = 0xffff;
  }
  uVar8 = (uVar5 & wVar2) == 0;
  if (!(bool)uVar8) {
    FUN_1000_7e8d();
    return;
  }
  uVar9 = qb3d_34(wVar3,wVar2,0,0xb6f4,0xbb60);
  uVar9 = qb3f_91((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xbb60);
  wVar2 = 0x1a;
  uVar9 = qb3d_03((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xbb60);
  uVar9 = qb3f_a1((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xb7f6);
  if ((bool)uVar8) {
    FUN_1000_8f6a();
    return;
  }
  uVar9 = qb3d_34((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xb7f6);
  uVar9 = qb3f_71((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xb7f6);
  uVar9 = qb3d_34((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xb7f6);
  uVar9 = qb3f_95((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xb7f6);
  uVar9 = qb3f_91((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xce0c);
  wVar2 = 0x1a;
  uVar9 = qb3d_03((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xce0c);
  uVar9 = qb3f_81((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0xbc32);
  uVar9 = qb3f_7d((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0x52fc);
  wVar2 = DAT_2000_b6f8;
  uVar9 = qb3f_57((word)uVar9,DAT_2000_b6f8,(word)((ulong)uVar9 >> 0x10),0xb6f4,0x52fc);
  uVar9 = qb3f_81((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0xb6f4,0x52fc);
  uVar9 = qb3f_71((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0x1fa6,0xb56c);
  uVar9 = qb3f_97((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0x1fa6,0xb56c);
  uVar9 = qb3f_a5((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0x1fa6,0xb56c);
  *(uint *)(unaff_BP + -0x4a91) = *(uint *)(unaff_BP + -0x4a91) ^ 0x38e9;
  pbVar1 = (byte *)(wVar2 + 0xb7f6);
  bVar6 = (byte)(wVar2 >> 8);
  uVar8 = CARRY1(*pbVar1,bVar6);
  *pbVar1 = *pbVar1 + bVar6;
  bVar7 = *pbVar1 == 0;
  uVar9 = qb3f_9f((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0x6034,0xb56c);
  wVar2 = 0;
  if (bVar7) {
    wVar2 = 0xffff;
  }
  uVar9 = qb3d_34((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0x6034,0xb56c);
  wVar3 = qb3f_91((word)uVar9,wVar2,(word)((ulong)uVar9 >> 0x10),0x6034,0xbb6c);
  bx = 0x1a;
  uVar9 = qb3d_03(wVar3,0x1a,wVar2,0x6034,0xbb6c);
  qb3f_a1((word)uVar9,bx,(word)((ulong)uVar9 >> 0x10),0x6034,0xb7d8);
  uVar5 = 0;
  if ((bool)uVar8) {
    uVar5 = 0xffff;
  }
  if ((uVar5 & extraout_DX) != 0) {
    FUN_1000_8f6a();
    return;
  }
  FUN_1000_7e8d();
  return;
}


// ==== FUN_1000_8f6a @ 1000:8f6a (size 128) callers: FUN_1000_803a,FUN_1000_8e76

void FUN_1000_8f6a(void)

{
  word in_AX;
  word ax;
  undefined2 extraout_DX;
  undefined *bx;
  word bx_00;
  word bx_01;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar1;
  
  DAT_2000_b516 = 1;
  bx = (undefined *)&lit_empty;
  qb3f_61(in_AX,0xbb56,0xb49c,unaff_SI,unaff_DI);
  uVar1 = FUN_1000_340c();
  uVar1 = qb3f_7b((word)uVar1,(word)bx,(word)((ulong)uVar1 >> 0x10),0xb7ee,0xb4fa);
  uVar1 = qb3f_7b((word)uVar1,(word)bx,(word)((ulong)uVar1 >> 0x10),0xb7ee,0xb50e);
  bx_00 = 0xb7ee;
  uVar1 = qb3f_7b((word)uVar1,0xb7ee,(word)((ulong)uVar1 >> 0x10),0xb7f6,0xb4c2);
  bx_01 = bx_00;
  uVar1 = qb3f_9f((word)uVar1,bx_00,(word)((ulong)uVar1 >> 0x10),0xb6e4,bx_00);
  if (!(bool)in_CF && !(bool)in_ZF) {
    ax = qb3f_75((word)uVar1,bx_01,(word)((ulong)uVar1 >> 0x10),0xb6e4,bx_00);
    qb3f_75(ax,bx_01,bx_01,0xb69c,bx_00);
    ((undefined2 *)&DAT_2000_3824)[bx_01] = extraout_DX;
  }
  if (DAT_2000_b5d8 == 1) {
    DAT_2000_b5d8 = 0;
    DAT_2000_b702 = 0;
    FUN_1000_4c28();
    return;
  }
  FUN_1000_8fea();
  DAT_2000_b660 = 0;
  DAT_2000_b536 = 1;
  DAT_2000_b702 = 0;
  FUN_1000_58f7();
  FUN_1000_4275();
  return;
}


// ==== FUN_1000_8fea @ 1000:8fea (size 202) callers: FUN_1000_0cd2,FUN_1000_1340,FUN_1000_19f7,FUN_1000_3b16,FUN_1000_4275,FUN_1000_803a,FUN_1000_8f6a

void __cdecl16near FUN_1000_8fea(void)

{
  word in_AX;
  word wVar1;
  int iVar2;
  word in_DX;
  word ax;
  word in_BX;
  word wVar3;
  undefined1 uVar4;
  undefined1 in_ZF;
  undefined4 uVar5;
  
  wVar1 = qb3f_9f(in_AX,in_BX,in_DX,0xb4fa,0xb7f6);
  if ((bool)in_ZF) {
    return;
  }
  wVar1 = qb3e_72(wVar1,0xa1,0x39,0xb4fa,0xb7f6);
  wVar3 = 0xd5;
  qb3e_73(wVar1,0xd5,0x5e,0xb4fa,0xb7f6);
  wVar1 = qb3e_74(wVar3,0,0xffff,0xb4fa,0xb7f6);
  wVar1 = qb3e_72(wVar1,0xa1,0x96,0xb4fa,0xb7f6);
  qb3e_73(wVar1,wVar1,199,0xb4fa,0xb7f6);
  wVar1 = qb3e_74(ax,0,0xffff,0xb4fa,0xb7f6);
  wVar1 = qb3e_72(wVar1,0x10b,0x96,0xb4fa,0xb7f6);
  wVar1 = qb3e_73(wVar1,0x13f,wVar1,0xb4fa,0xb7f6);
  uVar5 = qb3e_74(wVar1,0,0xffff,0xb4fa,0xb7f6);
  uVar5 = qb3e_42((word)uVar5,0x19,(word)((ulong)uVar5 >> 0x10),0xb4fa,0xb7f6);
  wVar1 = 0x16;
  uVar5 = qb3e_44((word)uVar5,0x16,(word)((ulong)uVar5 >> 0x10),0xb4fa,0xb7f6);
  uVar5 = qb3f_bc((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb4fa,0xb7f6);
  wVar3 = 0x13;
  uVar5 = qb3d_0d((word)uVar5,0x13,(word)((ulong)uVar5 >> 0x10),0xb4fa,0xb7f6);
  uVar5 = qb3f_6a((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb4fa,0xb7f6);
  qb3e_79((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb4fa,0xb7f6);
  FUN_1000_4bc6();
  uVar5 = FUN_1000_3029();
  qb3f_75((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb4d2,0xb7f6);
  wVar1 = (word)((long)(int)wVar3 * 0x16);
  iVar2 = qb3f_75(wVar1,wVar3,(word)((ulong)((long)(int)wVar3 * 0x16) >> 0x10),0xb4ca,wVar1);
  wVar3 = wVar3 + iVar2;
  uVar4 = 0;
  if (*(int *)(wVar3 * 2 + 0x4e90) == 0) {
    FUN_1000_58f7();
  }
  uVar5 = FUN_1000_54cb();
  uVar5 = qb3f_9f((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb4c6,0xb802);
  if ((bool)uVar4) {
    DAT_2000_b63e = 1;
    uVar5 = FUN_1000_56cc();
  }
  qb3e_75((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb4c6,0xb802);
  return;
}


// ==== FUN_1000_90b4 @ 1000:90b4 (size 31) callers: FUN_1000_90d3

void __cdecl16near FUN_1000_90b4(void)

{
  word in_AX;
  word wVar1;
  word bx;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  wVar1 = qb3e_72(in_AX,0,0x48,unaff_SI,unaff_DI);
  wVar1 = qb3e_73(wVar1,0x98,0x5d,unaff_SI,unaff_DI);
  bx = 0;
  uVar2 = qb3e_74(wVar1,0,0xffff,unaff_SI,unaff_DI);
  qb3e_75((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_90d3 @ 1000:90d3 (size 218) callers: FUN_1000_803a

void FUN_1000_90d3(void)

{
  uint uVar1;
  int iVar2;
  word dx;
  word ax;
  word dx_00;
  word extraout_DX;
  word extraout_DX_00;
  word extraout_DX_01;
  word extraout_DX_02;
  word extraout_DX_03;
  word extraout_DX_04;
  word dx_01;
  word dx_02;
  word dx_03;
  word dx_04;
  undefined2 extraout_DX_05;
  uint uVar3;
  word wVar4;
  word bx;
  word wVar5;
  undefined *puVar6;
  undefined2 *bx_00;
  undefined2 *bx_01;
  undefined2 *bx_02;
  word wVar7;
  word unaff_SI;
  undefined *di;
  word unaff_DI;
  char *di_00;
  bool bVar8;
  undefined1 in_CF;
  undefined1 uVar9;
  bool bVar10;
  undefined1 uVar11;
  undefined1 in_ZF;
  undefined1 uVar12;
  undefined4 uVar13;
  
  DAT_2000_b704 = 1;
  uVar13 = FUN_1000_90b4();
  uVar13 = qb3e_42((word)uVar13,10,(word)((ulong)uVar13 >> 0x10),unaff_SI,unaff_DI);
  wVar5 = 1;
  uVar13 = qb3e_44((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),unaff_SI,unaff_DI);
  uVar13 = qb3f_bc((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),unaff_SI,unaff_DI);
  puVar6 = (undefined *)&lit_WHAT_LEVEL_1_6;
  uVar13 = qb3f_6e((word)uVar13,0xd0c2,(word)((ulong)uVar13 >> 0x10),unaff_SI,unaff_DI);
  uVar13 = qb3e_79((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),unaff_SI,unaff_DI);
  uVar13 = qb3f_bc((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),unaff_SI,unaff_DI);
  puVar6 = (undefined *)&lit_ESC_CAST_NO_SPELL;
  uVar13 = qb3f_6e((word)uVar13,0xcbc2,(word)((ulong)uVar13 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),unaff_SI,unaff_DI);
  uVar13 = FUN_1000_7dc9();
  wVar5 = 0xb49c;
  uVar13 = qb3d_13((word)uVar13,0xb49c,(word)((ulong)uVar13 >> 0x10),unaff_SI,unaff_DI);
  uVar13 = qb3f_7a((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),unaff_SI,unaff_DI);
  uVar13 = qb3f_7d((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),unaff_SI,0xb5b2);
  uVar13 = qb3f_9f((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb5b2,0xb7f6);
  puVar6 = (undefined *)0x0;
  if ((bool)in_CF) {
    puVar6 = (undefined *)0xffff;
    in_ZF = 0;
  }
  di_00 = (char *)0xb7fa;
  wVar5 = qb3f_9f((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb5b2,0xb7fa);
  uVar3 = 0;
  if (!(bool)in_CF && !(bool)in_ZF) {
    uVar3 = 0xffff;
  }
  uVar13 = CONCAT22(uVar3 | (uint)puVar6,wVar5);
  uVar9 = false;
  uVar12 = (uVar3 | (uint)puVar6) == 0;
  if ((bool)uVar12) {
    di_00 = (char *)0xb568;
    uVar13 = qb3f_9f(wVar5,(word)puVar6,0,0xb5b2,0xb568);
    wVar5 = (word)((ulong)uVar13 >> 0x10);
    if ((bool)uVar9 || (bool)uVar12) {
      uVar13 = qb3e_42((word)uVar13,10,wVar5,0xb5b2,0xb568);
      puVar6 = (undefined *)0x1;
      qb3e_44((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),0xb5b2,0xb568);
      FUN_1000_90b4();
      DAT_2000_b5dc = 2;
      uVar13 = FUN_1000_c5d0();
      di_00 = (char *)&DAT_2000_bb60;
      uVar13 = qb3f_9f((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0x52fc,0xbb60);
      if (!(bool)uVar12) {
        uVar13 = qb3f_ab((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb5b2,0xbb60);
        *(int *)(puVar6 + (int)(undefined2 *)&DAT_2000_52fb + 1) =
             (int)(undefined2 *)&DAT_2000_bb60 +
             *(int *)(puVar6 + (int)(undefined2 *)&DAT_2000_52fb + 1);
        uVar13 = qb3f_81((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb5b2,0xbb60);
        bx_00 = (undefined2 *)&DAT_2000_bb60;
        uVar13 = qb3f_81((word)uVar13,0xbb60,(word)((ulong)uVar13 >> 0x10),0xb5b2,0xcbf6);
        bx_01 = bx_00;
        uVar13 = qb3f_7d((word)uVar13,(word)bx_00,(word)((ulong)uVar13 >> 0x10),0xb5b2,(word)bx_00);
        bx_02 = bx_01;
        uVar13 = qb3f_75((word)uVar13,(word)bx_01,(word)((ulong)uVar13 >> 0x10),(word)bx_01,
                         (word)bx_00);
        qb3f_5e((word)uVar13,(word)bx_02,(word)((ulong)uVar13 >> 0x10),(word)bx_01,(word)bx_00);
        return;
      }
    }
    else {
      uVar13 = qb3e_42((word)uVar13,0xc,wVar5,0xb5b2,0xb568);
      wVar5 = 1;
      uVar13 = qb3e_44((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),0xb5b2,0xb568);
      uVar13 = qb3f_bc((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb5b2,0xb568);
      puVar6 = (undefined *)&lit_NOT_ENOUGH_SPELL_POINTS;
      uVar13 = qb3f_6e((word)uVar13,0xcbd8,(word)((ulong)uVar13 >> 0x10),0xb5b2,0xb568);
      qb3e_79((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb5b2,0xb568);
      uVar13 = FUN_1000_2f1a();
    }
  }
LAB_1000_84c1:
  while( true ) {
    uVar13 = qb3f_a7((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb4ea,(word)di_00);
    wVar5 = 0;
    if ((bool)uVar9) {
      wVar5 = 0xffff;
    }
    wVar7 = 0xb4f2;
    qb3f_a7((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    iVar2 = 0;
    if ((bool)uVar9) {
      iVar2 = -1;
    }
    if (iVar2 != 0 || wVar5 != 0) {
      FUN_1000_a013();
      return;
    }
    if (DAT_2000_b702 == 1) {
      DAT_2000_b702 = 0;
      DAT_2000_b536 = 0xffff;
      FUN_1000_8fea();
      FUN_1000_4275();
      FUN_1000_580f();
      FUN_1000_7fc8();
    }
    uVar12 = DAT_2000_b704 == 0;
    uVar9 = DAT_2000_b704 == 1;
    if ((bool)uVar9) {
      FUN_1000_4abd();
      DAT_2000_b704 = 0;
    }
    FUN_1000_7f43();
    uVar13 = FUN_1000_49d1();
    uVar13 = qb3e_42((word)uVar13,0x18,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar4 = 1;
    uVar13 = qb3e_44((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = qb3f_bc((word)uVar13,wVar4,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    puVar6 = (undefined *)&lit_EXP_VALUE;
    uVar13 = qb3f_6a(wVar5,0xd018,wVar4,0xb4f2,(word)di_00);
    uVar13 = qb3e_79((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3e_42((word)uVar13,0x19,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar4 = 3;
    uVar13 = qb3e_44((word)uVar13,3,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3f_bc((word)uVar13,wVar4,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = 0xb6fa;
    uVar13 = qb3f_68((word)uVar13,0xb6fa,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3e_79((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = wVar4;
    uVar13 = qb3e_42((word)uVar13,wVar4,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    bx = (word)((ulong)uVar13 >> 0x10);
    uVar13 = qb3e_44((word)uVar13,bx,wVar5,0xb4f2,(word)di_00);
    uVar13 = qb3f_bc((word)uVar13,bx,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    qb3f_6a((word)uVar13,0xd028,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = 0x15;
    uVar13 = qb3d_0d(0x15,0x15,dx,0xb4f2,(word)di_00);
    uVar13 = qb3f_6a((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3e_79((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3e_42((word)uVar13,wVar4,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = (word)uVar13;
    uVar13 = qb3e_44(wVar5,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3f_bc((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = 0xb4f2;
    uVar13 = qb3f_6b((word)uVar13,0xb4f2,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3e_79((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3f_bc((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3f_6a((word)uVar13,0xd040,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = 0x16;
    uVar13 = qb3d_0d((word)uVar13,0x16,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3f_6a((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3e_79((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3e_42((word)uVar13,4,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = (word)uVar13;
    uVar13 = qb3e_44(wVar5,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3f_bc((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    wVar5 = 0xb6e4;
    uVar13 = qb3f_6b((word)uVar13,0xb6e4,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    uVar13 = qb3e_79((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb4f2,(word)di_00);
    DAT_2000_b536 = 0;
    do {
      uVar13 = qb3d_43((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),wVar7,(word)di_00);
      uVar13 = qb3f_7d((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),wVar7,0xb6d8);
      uVar13 = qb3f_9f((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0x1bc2,0xb6d8);
      uVar3 = 0;
      if ((bool)uVar12) {
        uVar3 = 0xffff;
        uVar9 = 0;
      }
      uVar13 = qb3d_43((word)uVar13,uVar3,(word)((ulong)uVar13 >> 0x10),0x1bc2,0xb6d8);
      wVar5 = qb3f_9b((word)uVar13,uVar3,(word)((ulong)uVar13 >> 0x10),0x1bc2,0xb6d8);
      uVar13 = qb3f_a1(wVar5,uVar3,0x1bc2,0x1bc2,0xd056);
      wVar5 = (word)((ulong)uVar13 >> 0x10);
      uVar1 = 0;
      if (!(bool)uVar12 && !(bool)uVar9) {
        uVar1 = 0xffff;
      }
      bVar8 = false;
      uVar1 = uVar1 | uVar3;
      bVar10 = uVar1 == 0;
      uVar13 = qb3f_a7((word)uVar13,uVar3,wVar5,wVar5,0xd056);
      wVar5 = (word)((ulong)uVar13 >> 0x10);
      uVar3 = 0;
      if (!bVar8 && !bVar10) {
        uVar3 = 0xffff;
      }
      uVar9 = 0;
      uVar12 = (uVar3 & uVar1) == 0;
      if ((bool)uVar12) {
        wVar7 = 0;
      }
      else {
        uVar13 = qb3f_7b((word)uVar13,uVar3 & uVar1,wVar5,0xbc2a,wVar5);
        uVar13 = qb3e_42((word)uVar13,7,(word)((ulong)uVar13 >> 0x10),0xbc2a,wVar5);
        wVar7 = 0x14;
        uVar13 = qb3e_44((word)uVar13,0x14,(word)((ulong)uVar13 >> 0x10),0xbc2a,wVar5);
        uVar13 = qb3f_bc((word)uVar13,wVar7,(word)((ulong)uVar13 >> 0x10),0xbc2a,wVar5);
        wVar7 = 0xe;
        uVar13 = qb3d_0d((word)uVar13,0xe,(word)((ulong)uVar13 >> 0x10),0xbc2a,wVar5);
        uVar13 = qb3f_6a((word)uVar13,wVar7,(word)((ulong)uVar13 >> 0x10),0xbc2a,wVar5);
        uVar13 = qb3e_79((word)uVar13,wVar7,(word)((ulong)uVar13 >> 0x10),0xbc2a,wVar5);
      }
      uVar13 = qb3f_9f((word)uVar13,wVar7,(word)((ulong)uVar13 >> 0x10),0x1bc6,0xb6d8);
      uVar3 = 0;
      if ((bool)uVar9) {
        uVar3 = 0xffff;
        uVar12 = 0;
      }
      uVar13 = qb3d_43((word)uVar13,uVar3,(word)((ulong)uVar13 >> 0x10),0x1bc6,0xb6d8);
      wVar5 = qb3f_9b((word)uVar13,uVar3,(word)((ulong)uVar13 >> 0x10),0x1bc6,0xb6d8);
      uVar13 = qb3f_a1(wVar5,uVar3,0x1bc6,0x1bc6,0xd056);
      wVar5 = (word)((ulong)uVar13 >> 0x10);
      uVar1 = 0;
      if (!(bool)uVar9 && !(bool)uVar12) {
        uVar1 = 0xffff;
      }
      bVar8 = false;
      uVar1 = uVar1 | uVar3;
      bVar10 = uVar1 == 0;
      uVar13 = qb3f_a7((word)uVar13,uVar3,wVar5,wVar5,0xd056);
      wVar5 = (word)((ulong)uVar13 >> 0x10);
      uVar3 = 0;
      if (!bVar8 && !bVar10) {
        uVar3 = 0xffff;
      }
      wVar7 = uVar3 & uVar1;
      uVar9 = 0;
      uVar12 = wVar7 == 0;
      if ((bool)uVar12) {
        wVar5 = 0;
      }
      else {
        uVar13 = qb3f_7b((word)uVar13,wVar7,wVar5,0xbc2a,wVar5);
        uVar13 = qb3f_7b((word)uVar13,wVar7,(word)((ulong)uVar13 >> 0x10),0xbc2a,0xb706);
        uVar13 = qb3e_42((word)uVar13,6,(word)((ulong)uVar13 >> 0x10),0xbc2a,0xb706);
        wVar5 = 0x14;
        uVar13 = qb3e_44((word)uVar13,0x14,(word)((ulong)uVar13 >> 0x10),0xbc2a,0xb706);
        uVar13 = qb3f_bc((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xbc2a,0xb706);
        uVar13 = qb3d_0d((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xbc2a,0xb706);
        uVar13 = qb3f_6a((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xbc2a,0xb706);
        uVar13 = qb3e_79((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xbc2a,0xb706);
      }
      uVar13 = qb3f_9f((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0x1bca,0xb6d8);
      uVar3 = 0;
      if ((bool)uVar9) {
        uVar3 = 0xffff;
        uVar12 = 0;
      }
      uVar13 = qb3d_43((word)uVar13,uVar3,(word)((ulong)uVar13 >> 0x10),0x1bca,0xb6d8);
      wVar5 = qb3f_9b((word)uVar13,uVar3,(word)((ulong)uVar13 >> 0x10),0x1bca,0xb6d8);
      di_00 = (char *)s_ITS_HEALTH_POINTS__2000_d044 + 0x12;
      uVar13 = qb3f_a1(wVar5,uVar3,0x1bca,0x1bca,0xd056);
      wVar7 = (word)((ulong)uVar13 >> 0x10);
      uVar1 = 0;
      if (!(bool)uVar9 && !(bool)uVar12) {
        uVar1 = 0xffff;
      }
      bVar8 = false;
      uVar1 = uVar1 | uVar3;
      bVar10 = uVar1 == 0;
      uVar13 = qb3f_a7((word)uVar13,uVar3,wVar7,wVar7,0xd056);
      wVar5 = (word)((ulong)uVar13 >> 0x10);
      uVar3 = 0;
      if (!bVar8 && !bVar10) {
        uVar3 = 0xffff;
      }
      wVar4 = uVar3 & uVar1;
      uVar12 = 0;
      uVar11 = wVar4 == 0;
      if ((bool)uVar11) {
        wVar5 = 0;
      }
      else {
        uVar13 = qb3f_7b((word)uVar13,wVar4,wVar5,0xbc2a,wVar5);
        wVar7 = 0x1fa6;
        uVar13 = qb3f_7f((word)uVar13,wVar4,(word)((ulong)uVar13 >> 0x10),0x1fa6,0xd05a);
        di_00 = (char *)0x1fa6;
        uVar13 = qb3f_7d((word)uVar13,wVar4,(word)((ulong)uVar13 >> 0x10),0x1fa6,0x1fa6);
        uVar13 = qb3e_42((word)uVar13,5,(word)((ulong)uVar13 >> 0x10),0x1fa6,0x1fa6);
        wVar5 = 0x14;
        uVar13 = qb3e_44((word)uVar13,0x14,(word)((ulong)uVar13 >> 0x10),0x1fa6,0x1fa6);
        uVar13 = qb3f_bc((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0x1fa6,0x1fa6);
        uVar13 = qb3d_0d((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0x1fa6,0x1fa6);
        uVar13 = qb3f_6e((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0x1fa6,0x1fa6);
        qb3e_79((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0x1fa6,0x1fa6);
      }
      uVar13 = FUN_1000_7eec();
      wVar4 = qb3d_06((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),wVar7,(word)di_00);
      qb3f_61(wVar4,wVar5,0xb49c,wVar7,(word)di_00);
      wVar5 = 0xbc1a;
      uVar13 = qb3f_62(ax,0xbc1a,ax,wVar7,(word)di_00);
      uVar9 = 1;
    } while ((bool)uVar11);
    DAT_2000_b54c = 0;
    FUN_1000_10be();
    uVar13 = FUN_1000_2f87();
    uVar13 = qb3f_7b((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xd05e,0xb51c);
    uVar13 = qb3f_7b((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xd05e,0xb512);
    qb3f_7b((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb7f6,0xb50e);
    uVar13 = FUN_1000_09e8();
    uVar13 = qb3f_7b((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb4fa);
    wVar7 = 0xb512;
    uVar13 = qb3f_9f((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb512,0xb7f6);
    if ((bool)uVar11) {
      uVar13 = FUN_1000_54cb();
      wVar4 = (word)uVar13;
      if (DAT_2000_b5d8 == 1) {
        uVar9 = 1;
        uVar12 = 0;
        goto LAB_1000_8f70;
      }
    }
    uVar9 = 0;
    qb3f_7b((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb69c,0xb530);
    uVar13 = FUN_1000_6fbd();
    wVar5 = DAT_2000_b698;
    uVar13 = qb3f_57((word)uVar13,DAT_2000_b698,(word)((ulong)uVar13 >> 0x10),0xb69c,0xb530);
    wVar5 = qb3f_a1((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb69c,0xb4ca);
    wVar7 = 0;
    if (!(bool)uVar9) {
      wVar7 = 0xffff;
      uVar9 = 0;
    }
    wVar4 = DAT_2000_b69a;
    uVar13 = qb3f_57(wVar5,DAT_2000_b69a,wVar7,0xb69c,0xb4ca);
    uVar13 = qb3f_a1((word)uVar13,wVar4,(word)((ulong)uVar13 >> 0x10),0xb69c,0xb4d2);
    wVar5 = (word)((ulong)uVar13 >> 0x10);
    iVar2 = 0;
    if (!(bool)uVar9) {
      iVar2 = -1;
    }
    bVar8 = iVar2 == 0 && wVar5 == 0;
    if (iVar2 != 0 || wVar5 != 0) {
      FUN_1000_8e76();
      return;
    }
    wVar7 = 0xb51c;
    qb3f_9f((word)uVar13,0,wVar5,0xb51c,0xb7f6);
    if (bVar8) {
      FUN_1000_9a2f();
      return;
    }
    wVar5 = qb3f_62(0xb49c,0xb8a6,dx_00,0xb51c,0xb7f6);
    wVar4 = 0;
    if (bVar8) {
      wVar4 = 0xffff;
    }
    bVar8 = false;
    uVar13 = qb3f_62(wVar5,0xb4b0,wVar4,0xb51c,0xb7f6);
    wVar5 = (word)((ulong)uVar13 >> 0x10);
    iVar2 = 0;
    if (bVar8) {
      iVar2 = -1;
    }
    uVar9 = 0;
    uVar12 = iVar2 == 0 && wVar5 == 0;
    if (iVar2 != 0 || wVar5 != 0) {
      qb3f_61((word)uVar13,0xd062,0xb70a,0xb51c,0xb7f6);
      FUN_1000_c33b();
      DAT_2000_b702 = 1;
      FUN_1000_6baf();
      wVar5 = extraout_DX;
    }
    puVar6 = (undefined *)&lit_S;
    uVar13 = qb3f_62(0xb49c,0xd068,wVar5,0xb51c,0xb7f6);
    wVar5 = (word)((ulong)uVar13 >> 0x10);
    if ((bool)uVar12) {
      wVar7 = 0x1b9a;
      uVar13 = qb3f_9f((word)uVar13,(word)puVar6,wVar5,0x1b9a,0xb7f6);
      if ((bool)uVar12) {
        qb3f_7b((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb7f6,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar5 = extraout_DX_00;
    }
    puVar6 = (undefined *)&lit_M;
    uVar13 = qb3f_62(0xb49c,0xb8ac,wVar5,wVar7,0xb7f6);
    wVar5 = (word)((ulong)uVar13 >> 0x10);
    if ((bool)uVar12) {
      wVar7 = 0x1b9e;
      uVar13 = qb3f_9f((word)uVar13,(word)puVar6,wVar5,0x1b9e,0xb7f6);
      if ((bool)uVar12) {
        qb3f_7b((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb7d8,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar5 = extraout_DX_01;
    }
    puVar6 = (undefined *)&lit_K;
    uVar13 = qb3f_62(0xb49c,0xb8b8,wVar5,wVar7,0xb7f6);
    wVar5 = (word)((ulong)uVar13 >> 0x10);
    if ((bool)uVar12) {
      wVar7 = 0x1b96;
      uVar13 = qb3f_9f((word)uVar13,(word)puVar6,wVar5,0x1b96,0xb7f6);
      if ((bool)uVar12) {
        qb3f_7b((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xbb60,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar5 = extraout_DX_02;
    }
    di_00 = (char *)0xb7f6;
    qb3f_62(0xb49c,0xb8b2,wVar5,wVar7,0xb7f6);
    wVar5 = extraout_DX_03;
    if ((bool)uVar12) {
      FUN_1000_7ffb();
      DAT_2000_b702 = 1;
      FUN_1000_6baf();
      wVar5 = extraout_DX_04;
    }
    puVar6 = (undefined *)&lit_F;
    uVar13 = qb3f_62(0xb49c,0xd06e,wVar5,wVar7,0xb7f6);
    wVar5 = (word)((ulong)uVar13 >> 0x10);
    if ((bool)uVar12) {
      qb3f_7b((word)uVar13,(word)puVar6,wVar5,0xb802,0xb478);
      FUN_1000_89d9();
      return;
    }
    qb3f_62(0xb49c,0xbc68,wVar5,wVar7,0xb7f6);
    if ((bool)uVar12) {
      DAT_2000_b702 = 1;
      FUN_1000_90d3();
      return;
    }
    qb3f_62(0xb49c,0xb7e0,dx_01,wVar7,0xb7f6);
    if ((bool)uVar12) {
      DAT_2000_b702 = 1;
      FUN_1000_95ba();
      return;
    }
    puVar6 = (undefined *)&lit_T;
    qb3f_62(0xb49c,0xbcca,dx_02,wVar7,0xb7f6);
    if (!(bool)uVar12) break;
    uVar13 = FUN_1000_7c49();
    DAT_2000_b702 = 1;
  }
  DAT_2000_b54c = 0;
  puVar6 = (undefined *)&lit_W;
  uVar13 = qb3f_62(0xb49c,0xbcd0,dx_03,wVar7,0xb7f6);
  if ((bool)uVar12) {
    DAT_2000_b702 = 1;
    uVar13 = qb3e_42((word)uVar13,10,(word)((ulong)uVar13 >> 0x10),wVar7,0xb7f6);
    puVar6 = (undefined *)0x1;
    qb3e_44((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),wVar7,0xb7f6);
    uVar13 = FUN_1000_7aa1();
    wVar4 = (word)((ulong)uVar13 >> 0x10);
    wVar5 = (word)uVar13;
    uVar12 = DAT_2000_b54c == 0;
    uVar9 = DAT_2000_b54c == 1;
    if ((bool)uVar9) {
      wVar4 = qb3e_32(wVar5,0xffff,wVar4,wVar7,0xb7f6);
      DAT_2000_b5d8 = 1;
LAB_1000_8f70:
      puVar6 = (undefined *)&lit_empty;
      qb3f_61(wVar4,0xbb56,0xb49c,wVar7,0xb7f6);
      uVar13 = FUN_1000_340c();
      uVar13 = qb3f_7b((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb4fa);
      uVar13 = qb3f_7b((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb50e);
      wVar7 = 0xb7ee;
      uVar13 = qb3f_7b((word)uVar13,0xb7ee,(word)((ulong)uVar13 >> 0x10),0xb7f6,0xb4c2);
      wVar5 = wVar7;
      uVar13 = qb3f_9f((word)uVar13,wVar7,(word)((ulong)uVar13 >> 0x10),0xb6e4,wVar7);
      if (!(bool)uVar12 && !(bool)uVar9) {
        wVar4 = qb3f_75((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb6e4,wVar7);
        qb3f_75(wVar4,wVar5,wVar5,0xb69c,wVar7);
        ((undefined2 *)&DAT_2000_3824)[wVar5] = extraout_DX_05;
      }
      if (DAT_2000_b5d8 == 1) {
        DAT_2000_b5d8 = 0;
        DAT_2000_b702 = 0;
        FUN_1000_4c28();
        return;
      }
      FUN_1000_8fea();
      DAT_2000_b660 = 0;
      DAT_2000_b536 = 1;
      DAT_2000_b702 = 0;
      FUN_1000_58f7();
      FUN_1000_4275();
      return;
    }
    if (DAT_2000_b54c == 2) {
      FUN_1000_8f6a();
      return;
    }
    if (DAT_2000_b54c == 3) {
      uVar9 = 0;
      goto LAB_1000_84c1;
    }
    if (DAT_2000_b54c == 6) {
      uVar13 = qb3f_7f(wVar5,(word)puVar6,wVar4,0xb568,0xbb60);
      qb3f_7d((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb568,0xb568);
      FUN_1000_92c8();
      return;
    }
    if (DAT_2000_b54c == 7) {
      uVar13 = qb3f_7f(wVar5,(word)puVar6,wVar4,0xb568,0xbb60);
      qb3f_7d((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb568,0xb568);
      FUN_1000_9298();
      return;
    }
    if (DAT_2000_b54c == 8) {
      uVar13 = qb3f_7f(wVar5,(word)puVar6,wVar4,0xb568,0xbb6c);
      qb3f_7d((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb568,0xb568);
      FUN_1000_93e9();
      return;
    }
    uVar9 = DAT_2000_b54c < 9;
    if (DAT_2000_b54c == 9) goto LAB_1000_84c1;
  }
  uVar12 = 0;
  uVar13 = qb3d_43((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),wVar7,0xb7f6);
  uVar13 = qb3f_a3((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0x1bc2,0xb7f6);
  if (!(bool)uVar9 && !(bool)uVar12) {
    puVar6 = (undefined *)&lit_B;
    uVar13 = qb3f_62(0xb49c,0xca72,(word)((ulong)uVar13 >> 0x10),0x1bc2,0xb7f6);
    if ((bool)uVar12) {
      uVar13 = qb3d_34((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0x1bc2,0xb7f6);
      uVar13 = qb3f_91((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0x1bc2,0xcc52);
      wVar5 = 0x1a;
      uVar13 = qb3d_03((word)uVar13,0x1a,(word)((ulong)uVar13 >> 0x10),0x1bc2,0xcc52);
      uVar13 = qb3f_81((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0x1bc2,0xbe6e);
      uVar13 = qb3f_7d((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0x1bc2,0xb574);
      uVar13 = qb3f_97((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb6e4,0xb574);
      wVar4 = 0xb6e4;
      wVar7 = 0xb574;
      wVar5 = qb3f_7d((word)uVar13,0xb574,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      uVar13 = qb3e_42(wVar5,0xb,wVar7,0xb574,0xb6e4);
      wVar5 = 1;
      uVar13 = qb3e_44((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      qb3f_bc((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      wVar7 = 0x19;
      uVar13 = qb3d_0d(0x19,0x19,dx_04,0xb574,0xb6e4);
      uVar13 = qb3f_6e((word)uVar13,wVar7,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      uVar13 = qb3e_79((word)uVar13,wVar7,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      uVar13 = qb3e_42((word)uVar13,10,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      uVar13 = qb3e_44((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      uVar13 = qb3f_bc((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      wVar5 = (word)uVar13;
      uVar13 = qb3d_0d(wVar5,wVar5,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      uVar13 = qb3f_6e((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      uVar13 = qb3e_79((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb574,0xb6e4);
      wVar7 = (word)((ulong)uVar13 >> 0x10);
      qb3f_a7((word)uVar13,wVar5,wVar7,wVar7,0xb6e4);
      wVar5 = 0;
      if ((bool)uVar12) {
        wVar5 = 0xffff;
      }
      bVar8 = false;
      puVar6 = (undefined *)&lit_B;
      uVar13 = qb3f_62(0xb49c,0xca72,wVar5,wVar7,0xb6e4);
      uVar1 = (uint)((ulong)uVar13 >> 0x10);
      uVar3 = 0;
      if (!bVar8) {
        uVar3 = 0xffff;
      }
      uVar9 = 0;
      uVar12 = (uVar3 & uVar1) == 0;
      if (!(bool)uVar12) {
        uVar13 = qb3f_bc((word)uVar13,(word)puVar6,uVar1,wVar7,0xb6e4);
        uVar13 = qb3d_34((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),wVar7,0xb6e4);
        uVar13 = qb3f_91((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),wVar7,0xbb6c);
        wVar5 = 0x1a;
        uVar13 = qb3d_03((word)uVar13,0x1a,(word)((ulong)uVar13 >> 0x10),wVar7,0xbb6c);
        wVar4 = 0xb7f6;
        uVar13 = qb3f_81((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),wVar7,0xb7f6);
        uVar13 = qb3f_77((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),wVar7,0xb7f6);
        uVar9 = 0xa01f < wVar5 * 4;
        puVar6 = (undefined *)(wVar5 * 4 + 0x5fe0);
        uVar12 = puVar6 == (undefined *)0x0;
        uVar13 = qb3f_6e((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),wVar7,0xb7f6);
        uVar13 = qb3e_79((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),wVar7,0xb7f6);
      }
      uVar13 = qb3f_a7((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb574,wVar4);
      if (!(bool)uVar9 && !(bool)uVar12) {
        uVar13 = qb3f_bc((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb574,wVar4);
        uVar13 = qb3d_34((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb574,wVar4);
        wVar7 = 0xb574;
        wVar5 = qb3f_91((word)uVar13,0xb574,(word)((ulong)uVar13 >> 0x10),0xb574,0xbb6c);
        wVar4 = 0x1a;
        uVar13 = qb3d_03(wVar5,0x1a,wVar7,0xb574,0xbb6c);
        uVar13 = qb3f_81((word)uVar13,wVar4,(word)((ulong)uVar13 >> 0x10),0xb574,0xb7fa);
        uVar13 = qb3f_77((word)uVar13,wVar4,(word)((ulong)uVar13 >> 0x10),0xb574,0xb7fa);
        uVar9 = 0xa01f < wVar4 * 4;
        wVar5 = wVar4 * 4 + 0x5fe0;
        uVar12 = wVar5 == 0;
        uVar13 = qb3f_6e((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb574,0xb7fa);
        uVar13 = qb3e_79((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb574,0xb7fa);
        uVar13 = qb3e_42((word)uVar13,10,(word)((ulong)uVar13 >> 0x10),0xb574,0xb7fa);
        wVar5 = 1;
        uVar13 = qb3e_44((word)uVar13,1,(word)((ulong)uVar13 >> 0x10),0xb574,0xb7fa);
        uVar13 = qb3f_bc((word)uVar13,wVar5,(word)((ulong)uVar13 >> 0x10),0xb574,0xb7fa);
        uVar13 = qb3f_6a((word)uVar13,0xd0a6,(word)((ulong)uVar13 >> 0x10),0xb574,0xb7fa);
        wVar5 = (word)((ulong)uVar13 >> 0x10);
        uVar13 = qb3f_67((word)uVar13,wVar5,wVar5,0xb574,0xb7fa);
        puVar6 = (undefined *)&lit_POINT;
        uVar13 = qb3f_6a((word)uVar13,0xd0b2,(word)((ulong)uVar13 >> 0x10),0xb574,0xb7fa);
        uVar13 = qb3e_79((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb574,0xb7fa);
        wVar5 = (word)((ulong)uVar13 >> 0x10);
        uVar13 = qb3f_9f((word)uVar13,(word)puVar6,wVar5,wVar5,0xb7f6);
        wVar7 = (word)((ulong)uVar13 >> 0x10);
        if ((bool)uVar9 || (bool)uVar12) {
          uVar13 = qb3f_bc((word)uVar13,(word)puVar6,wVar7,wVar5,0xb7f6);
          puVar6 = (undefined *)&lit_empty;
          uVar13 = qb3f_6e((word)uVar13,0xc910,(word)((ulong)uVar13 >> 0x10),wVar5,0xb7f6);
          uVar13 = qb3e_79((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),wVar5,0xb7f6);
        }
        else {
          uVar13 = qb3f_bc((word)uVar13,(word)puVar6,wVar7,wVar5,0xb7f6);
          puVar6 = (undefined *)&lit_S;
          uVar13 = qb3f_6e((word)uVar13,0xd0bc,(word)((ulong)uVar13 >> 0x10),wVar5,0xb7f6);
          uVar13 = qb3e_79((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),wVar5,0xb7f6);
        }
      }
      wVar5 = 0xb7ee;
      uVar13 = qb3f_7b((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb574);
      uVar13 = qb3d_43((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb574);
      di = (undefined *)0xb71a;
      uVar13 = qb3f_7d((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb7ee,0xb71a);
      do {
        uVar13 = qb3d_43((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),wVar5,(word)di);
        uVar13 = qb3f_7d((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),wVar5,0xb71e);
        di = (undefined *)0xb71e;
        wVar5 = 0xb71a;
        uVar13 = qb3f_7f((word)uVar13,0xb71e,(word)((ulong)uVar13 >> 0x10),0xb71a,0xb7f6);
        puVar6 = di;
        uVar13 = qb3f_a1((word)uVar13,(word)di,(word)((ulong)uVar13 >> 0x10),0xb71a,(word)di);
      } while ((bool)uVar9);
      uVar13 = qb3f_9f((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb6e4,0xb7f6);
      if ((bool)uVar9) {
        FUN_1000_a335();
        return;
      }
      uVar13 = qb3d_34((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb6e4,0xb7f6);
      uVar13 = qb3f_91((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb6e4,0xbc26);
      uVar13 = qb3d_03((word)uVar13,0x1a,(word)((ulong)uVar13 >> 0x10),0xb6e4,0xbc26);
      puVar6 = DAT_2000_b6f8;
      uVar13 = qb3f_71((word)uVar13,(word)DAT_2000_b6f8,(word)((ulong)uVar13 >> 0x10),0xb6e4,0xbc26)
      ;
      uVar13 = qb3f_57((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb6e4,0xbc26);
      uVar13 = qb3f_85((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb6e4,0xbc26);
      uVar13 = qb3f_81((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb6e4,0xb7f6);
      di_00 = (char *)0x1fa6;
      uVar13 = qb3f_a1((word)uVar13,(word)puVar6,(word)((ulong)uVar13 >> 0x10),0xb6e4,0x1fa6);
      if (!(bool)uVar9) {
        FUN_1000_9a2f();
        return;
      }
    }
  }
  goto LAB_1000_84c1;
}


// ==== FUN_1000_9298 @ 1000:9298 (size 46) callers: FUN_1000_803a

/* WARNING: Instruction at (ram,0x000192af) overlaps instruction at (ram,0x000192ad)
    */
/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void FUN_1000_9298(void)

{
  byte bVar1;
  byte bVar2;
  word in_AX;
  word in_DX;
  byte bVar3;
  word in_BX;
  word wVar4;
  word unaff_SI;
  word unaff_DI;
  undefined2 unaff_ES;
  byte in_AF;
  bool bVar5;
  undefined4 uVar6;
  
  while( true ) {
    uVar6 = qb3d_34(in_AX,in_BX,in_DX,unaff_SI,unaff_DI);
    unaff_DI = 0xb4ea;
    uVar6 = qb3f_91((word)uVar6,in_BX,(word)((ulong)uVar6 >> 0x10),unaff_SI,0xb4ea);
    uVar6 = qb3f_ad((word)uVar6,in_BX,(word)((ulong)uVar6 >> 0x10),unaff_SI,0xb4ea);
    wVar4 = 0x1a;
    uVar6 = qb3d_03((word)uVar6,0x1a,(word)((ulong)uVar6 >> 0x10),unaff_SI,0xb4ea);
    uVar6 = qb3f_71((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xb4ea,0xb4ea);
    uVar6 = qb3f_ab((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xb4ea,0xb4ea);
    in_DX = (word)((ulong)uVar6 >> 0x10);
    bVar1 = 9 < ((byte)uVar6 & 0xf) | in_AF;
    bVar2 = (byte)uVar6 + bVar1 * -6 & 0xf;
    in_BX = 0x3fcd;
    if (_DAT_2000_f541 < 0x3fcd) break;
    in_AF = 9 < bVar2 | bVar1;
    in_AX = CONCAT11(((char)((ulong)uVar6 >> 8) - bVar1) - in_AF,bVar2 + in_AF * -6) & 0xff0f;
    unaff_SI = unaff_DI;
  }
  bVar3 = (byte)((ulong)uVar6 >> 0x18) & bRam0002b48b;
  bVar5 = bVar3 == 0;
  bVar2 = (byte)uRam0002bf02;
  wVar4 = 0xb4eb;
  *(byte *)0xb4ea = bVar2;
  bVar1 = 9 < (bVar2 & 0xf) | bVar1;
  uVar6 = qb3f_9f(CONCAT11(-0x18 - bVar1,bVar2 + bVar1 * -6) & 0xff0f,0xb4eb,
                  CONCAT11(bVar3,(char)((ulong)uVar6 >> 0x10)),0xb4ea,0xb7f6);
  if (bVar5) {
    uVar6 = qb3f_7b((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xbc2e,wVar4);
  }
  uVar6 = qb3f_7f((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xb722,0xb7d0);
  uVar6 = qb3f_7d((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xb722,0x6028);
  uVar6 = qb3f_7f((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xb520,0xbb68);
  qb3f_7d((word)uVar6,wVar4,(word)((ulong)uVar6 >> 0x10),0xb520,0xb520);
  FUN_1000_4abd();
  FUN_1000_9555();
  return;
}


// ==== FUN_1000_92c8 @ 1000:92c8 (size 65) callers: FUN_1000_803a

void FUN_1000_92c8(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word bx;
  undefined1 in_ZF;
  undefined4 uVar1;
  
  uVar1 = qb3f_7b(in_AX,in_BX,in_DX,0xb474,0xb722);
  bx = 0xb722;
  uVar1 = qb3f_9f((word)uVar1,0xb722,(word)((ulong)uVar1 >> 0x10),0xb474,0xb7f6);
  if ((bool)in_ZF) {
    uVar1 = qb3f_7b((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xbc2e,bx);
  }
  uVar1 = qb3f_7f((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb722,0xb7d0);
  uVar1 = qb3f_7d((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb722,0x6028);
  uVar1 = qb3f_7f((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb520,0xbb68);
  qb3f_7d((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb520,0xb520);
  FUN_1000_4abd();
  FUN_1000_9555();
  return;
}


// ==== FUN_1000_93e9 @ 1000:93e9 (size 50) callers: FUN_1000_803a

void FUN_1000_93e9(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word bx;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar1;
  
  uVar1 = qb3d_34(in_AX,in_BX,in_DX,unaff_SI,unaff_DI);
  uVar1 = qb3f_91((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),unaff_SI,0xb4ea);
  uVar1 = qb3f_ad((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),unaff_SI,0xb4ea);
  bx = 0x1a;
  uVar1 = qb3d_03((word)uVar1,0x1a,(word)((ulong)uVar1 >> 0x10),unaff_SI,0xb4ea);
  uVar1 = qb3f_71((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb4ea,0xbb60);
  uVar1 = qb3f_8f((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb4ea,0xbb60);
  uVar1 = qb3f_85((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb4ea,0xbb60);
  uVar1 = qb3f_81((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb4ea,0xbc1e);
  qb3f_7d((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),0xb4ea,0xb574);
  FUN_1000_9569();
  return;
}


// ==== FUN_1000_9555 @ 1000:9555 (size 20) callers: FUN_1000_92c8

void FUN_1000_9555(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  undefined4 uVar1;
  
  uVar1 = qb3f_97(in_AX,in_BX,in_DX,0xb568,0xb5b2);
  qb3f_7d((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb568,0xb568);
  FUN_1000_2f1a();
  FUN_1000_9a2f();
  return;
}


// ==== FUN_1000_9569 @ 1000:9569 (size 81) callers: FUN_1000_93e9

void FUN_1000_9569(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word in_BX;
  word bx;
  undefined1 in_CF;
  undefined4 uVar2;
  
  uVar2 = qb3f_97(in_AX,in_BX,in_DX,0xb568,0xb5b2);
  uVar2 = qb3f_7d((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb568,0xb568);
  uVar2 = qb3f_97((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb6e4,0xb574);
  bx = 0xb574;
  uVar2 = qb3f_7d((word)uVar2,0xb574,(word)((ulong)uVar2 >> 0x10),0xb574,0xb6e4);
  wVar1 = qb3f_bc((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),0xb574,0xb6e4);
  uVar2 = qb3f_6a(wVar1,0xd136,bx,0xb574,0xb6e4);
  wVar1 = (word)((ulong)uVar2 >> 0x10);
  uVar2 = qb3f_67((word)uVar2,wVar1,wVar1,0xb574,0xb6e4);
  uVar2 = qb3f_6a((word)uVar2,0xd140,(word)((ulong)uVar2 >> 0x10),0xb574,0xb6e4);
  wVar1 = 0xb45e;
  uVar2 = qb3f_6e((word)uVar2,0xb45e,(word)((ulong)uVar2 >> 0x10),0xb574,0xb6e4);
  qb3e_79((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb574,0xb6e4);
  uVar2 = FUN_1000_2f1a();
  qb3f_9f((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),0xb6e4,0xb7f6);
  if ((bool)in_CF) {
    FUN_1000_a335();
    return;
  }
  FUN_1000_9a2f();
  return;
}


// ==== FUN_1000_95ba @ 1000:95ba (size 884) callers: FUN_1000_803a

/* WARNING: Instruction at (ram,0x00019892) overlaps instruction at (ram,0x00019891)
    */

void __cdecl16near FUN_1000_95ba(void)

{
  char cVar1;
  word in_AX;
  uint uVar2;
  uint uVar3;
  int iVar4;
  word dx;
  word ax;
  word dx_00;
  word extraout_DX;
  word extraout_DX_00;
  word extraout_DX_01;
  word extraout_DX_02;
  word extraout_DX_03;
  word extraout_DX_04;
  word dx_01;
  word dx_02;
  word dx_03;
  word dx_04;
  undefined2 extraout_DX_05;
  word in_DX;
  word dx_05;
  word dx_06;
  word extraout_DX_06;
  word extraout_DX_07;
  word extraout_DX_08;
  uint uVar5;
  word dx_07;
  word dx_08;
  word dx_09;
  word dx_10;
  word dx_11;
  word bx;
  word wVar6;
  undefined *puVar7;
  word wVar8;
  word unaff_SI;
  undefined *di;
  word unaff_DI;
  word wVar9;
  char *di_00;
  undefined1 uVar10;
  bool bVar11;
  undefined1 uVar12;
  undefined1 uVar13;
  bool bVar14;
  char cVar15;
  char cVar16;
  undefined4 uVar17;
  ulong uVar18;
  long lVar19;
  
  DAT_2000_b72a = 1;
  uVar17 = qb3e_42(in_AX,10,in_DX,unaff_SI,unaff_DI);
  wVar6 = 1;
  uVar17 = qb3e_44((word)uVar17,1,(word)((ulong)uVar17 >> 0x10),unaff_SI,unaff_DI);
  uVar17 = qb3f_bc((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),unaff_SI,unaff_DI);
  puVar7 = (undefined *)&lit_WHICH_ITEM;
  uVar17 = qb3f_6e((word)uVar17,0xd14c,(word)((ulong)uVar17 >> 0x10),unaff_SI,unaff_DI);
  uVar17 = qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),unaff_SI,unaff_DI);
  uVar17 = qb3f_bc((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),unaff_SI,unaff_DI);
  wVar6 = 0x10;
  uVar17 = qb3d_0d((word)uVar17,0x10,(word)((ulong)uVar17 >> 0x10),unaff_SI,unaff_DI);
  uVar17 = qb3f_6e((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),unaff_SI,unaff_DI);
  wVar6 = 0xb490;
  qb3f_55(0xd15e,0xb490,dx_05,unaff_SI,unaff_DI);
  puVar7 = (undefined *)&lit_empty;
  wVar6 = qb3f_55(wVar6,0xd164,dx_06,unaff_SI,unaff_DI);
  qb3f_61(wVar6,(word)puVar7,0xb49c,unaff_SI,unaff_DI);
  DAT_2000_b5e4 = 5;
  wVar6 = extraout_DX_06;
  while( true ) {
    uVar10 = DAT_2000_b5e4 < 9;
    uVar13 = DAT_2000_b5e4 == 9;
    if (9 < (int)DAT_2000_b5e4) break;
    bVar14 = 0x4d2d < DAT_2000_b5e4 * 4;
    wVar9 = DAT_2000_b5e4 * 4 + 0xb2d2;
    bVar11 = wVar9 == 0;
    uVar17 = qb3f_a7(DAT_2000_b5e4,(word)puVar7,wVar6,wVar9,unaff_DI);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    if (bVar14 || bVar11) {
      wVar6 = qb3f_bc((word)uVar17,(word)puVar7,wVar6,wVar9,unaff_DI);
      wVar8 = (DAT_2000_b5e4 - 5) * 4 + 0x1b7e;
      uVar17 = qb3d_0b(wVar6,wVar8,1,wVar9,unaff_DI);
      uVar17 = qb3f_6a((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),wVar9,unaff_DI);
      puVar7 = (undefined *)0xb49c;
      uVar17 = qb3f_6e((word)uVar17,0xb49c,(word)((ulong)uVar17 >> 0x10),wVar9,unaff_DI);
      qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar9,unaff_DI);
      wVar6 = extraout_DX_08;
    }
    else {
      uVar17 = qb3f_bc((word)uVar17,(word)puVar7,wVar6,wVar9,unaff_DI);
      puVar7 = (undefined *)(((int)uVar17 + -5) * 4 + 0x1b7e);
      uVar17 = qb3f_6e((word)puVar7,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar9,unaff_DI);
      qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar9,unaff_DI);
      wVar6 = extraout_DX_07;
    }
    DAT_2000_b5e4 = DAT_2000_b5e4 + 1;
  }
  uVar17 = qb3f_a7(DAT_2000_b5e4,(word)puVar7,wVar6,0xb43a,unaff_DI);
  wVar6 = (word)((ulong)uVar17 >> 0x10);
  if ((bool)uVar10 || (bool)uVar13) {
    uVar17 = qb3f_bc((word)uVar17,(word)puVar7,wVar6,0xb43a,unaff_DI);
    uVar17 = qb3f_6a((word)uVar17,0xd18a,(word)((ulong)uVar17 >> 0x10),0xb43a,unaff_DI);
    puVar7 = (undefined *)0xb49c;
    uVar17 = qb3f_6e((word)uVar17,0xb49c,(word)((ulong)uVar17 >> 0x10),0xb43a,unaff_DI);
    uVar17 = qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb43a,unaff_DI);
  }
  else {
    uVar17 = qb3f_bc((word)uVar17,(word)puVar7,wVar6,0xb43a,unaff_DI);
    puVar7 = (undefined *)&lit_6_HOLY_HAND_GRENADE;
    uVar17 = qb3f_6e((word)uVar17,0xd16e,(word)((ulong)uVar17 >> 0x10),0xb43a,unaff_DI);
    uVar17 = qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb43a,unaff_DI);
  }
  uVar17 = qb3f_9f((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
  if ((bool)uVar13) {
    uVar17 = qb3f_bc((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    puVar7 = (undefined *)&lit_L_LEAVE;
    uVar17 = qb3f_6e((word)uVar17,0xbe52,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
  }
  do {
    uVar17 = FUN_1000_7dc9();
    uVar17 = qb3f_9f((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    if ((bool)uVar13) {
      wVar6 = qb3f_62(0xb49c,0xbe60,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
      wVar9 = 0;
      if ((bool)uVar13) {
        wVar9 = 0xffff;
      }
      bVar14 = false;
      puVar7 = (undefined *)&lit_l;
      uVar17 = qb3f_62(wVar6,0xd190,wVar9,0xb55c,0xb7f6);
      wVar6 = (word)((ulong)uVar17 >> 0x10);
      iVar4 = 0;
      if (bVar14) {
        iVar4 = -1;
      }
      uVar10 = 0;
      uVar13 = iVar4 == 0 && wVar6 == 0;
      if (iVar4 != 0 || wVar6 != 0) {
        qb3f_7b((word)uVar17,(word)puVar7,wVar6,0xb7ee,0x52fc);
        return;
      }
    }
    else {
      uVar13 = false;
    }
    wVar9 = 0xb7f6;
    wVar6 = 0xb55c;
    uVar18 = qb3f_9f((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    if (!(bool)uVar13) break;
    wVar9 = 0xb49c;
    uVar17 = qb3d_13((word)uVar18,0xb49c,(word)(uVar18 >> 0x10),0xb55c,0xb7f6);
    uVar17 = qb3f_7a((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0xb55c,0xb7f6);
    uVar17 = qb3f_7d((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0xb55c,0x52fc);
    wVar6 = 0x52fc;
    uVar17 = qb3f_a7((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0x52fc,0x52fc);
    puVar7 = (undefined *)0x0;
    if ((bool)uVar13) {
      puVar7 = (undefined *)0xffff;
    }
    bVar14 = false;
    wVar9 = 0xb7fa;
    uVar5 = qb3f_9f((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x52fc,0xb7fa);
    iVar4 = 0;
    if (!(bool)uVar10 && !bVar14) {
      iVar4 = -1;
    }
    uVar10 = 0;
    uVar13 = iVar4 == 0 && puVar7 == (undefined *)0x0;
    uVar18 = (ulong)uVar5;
  } while (iVar4 != 0 || puVar7 != (undefined *)0x0);
  wVar8 = 0xb49c;
  uVar17 = qb3d_13((word)uVar18,0xb49c,(word)(uVar18 >> 0x10),wVar6,wVar9);
  uVar17 = qb3f_7a((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),wVar6,wVar9);
  uVar17 = qb3f_7d((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),wVar6,0x52fc);
  uVar17 = qb3f_a7((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),0x52fc,0x52fc);
  puVar7 = (undefined *)0x0;
  if ((bool)uVar13) {
    puVar7 = (undefined *)0xffff;
  }
  bVar14 = false;
  di_00 = (char *)0xb7fa;
  wVar6 = qb3f_9f((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x52fc,0xb7fa);
  uVar5 = 0;
  if (!(bool)uVar10 && !bVar14) {
    uVar5 = 0xffff;
  }
  uVar17 = CONCAT22(uVar5 | (uint)puVar7,wVar6);
  uVar13 = 0;
  bVar14 = (uVar5 | (uint)puVar7) == 0;
  if (bVar14) {
    lVar19 = qb3f_9f(wVar6,(word)puVar7,0,0xb55c,0xb7f6);
    if (bVar14) {
      wVar6 = qb3f_9f((word)lVar19,(word)puVar7,(word)((ulong)lVar19 >> 0x10),0x52fc,0xb7f6);
      uVar5 = 0;
      if (bVar14) {
        uVar5 = 0xffff;
      }
      bVar14 = false;
      uVar17 = qb3f_a7(wVar6,uVar5,0x52fc,0xb2e6,0xb7f6);
      wVar6 = (word)((ulong)uVar17 >> 0x10);
      uVar3 = 0;
      if (bVar14) {
        uVar3 = 0xffff;
      }
      uVar3 = uVar3 & uVar5;
      bVar14 = uVar3 == 0;
      uVar17 = qb3f_9f((word)uVar17,uVar5,wVar6,wVar6,0xb7d8);
      uVar5 = 0;
      if (bVar14) {
        uVar5 = 0xffff;
      }
      bVar14 = false;
      qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2ea,0xb7d8);
      uVar2 = 0;
      if (bVar14) {
        uVar2 = 0xffff;
      }
      uVar3 = uVar2 & uVar5 | uVar3;
      bVar14 = uVar3 == 0;
      uVar17 = qb3f_9f(uVar3,uVar5,dx_07,dx_07,0xbb60);
      uVar5 = 0;
      if (bVar14) {
        uVar5 = 0xffff;
      }
      bVar14 = false;
      uVar17 = qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2ee,0xbb60);
      wVar6 = (word)((ulong)uVar17 >> 0x10);
      uVar3 = 0;
      if (bVar14) {
        uVar3 = 0xffff;
      }
      uVar3 = uVar3 & uVar5 | (uint)uVar17;
      bVar14 = uVar3 == 0;
      uVar17 = qb3f_9f((uint)uVar17,uVar5,wVar6,wVar6,0xb802);
      uVar5 = 0;
      if (bVar14) {
        uVar5 = 0xffff;
      }
      bVar14 = false;
      qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2f2,0xb802);
      uVar2 = 0;
      if (bVar14) {
        uVar2 = 0xffff;
      }
      uVar3 = uVar2 & uVar5 | uVar3;
      bVar14 = uVar3 == 0;
      uVar17 = qb3f_9f(uVar3,uVar5,dx_08,dx_08,0xbb6c);
      uVar5 = 0;
      if (bVar14) {
        uVar5 = 0xffff;
      }
      bVar14 = false;
      uVar17 = qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2f6,0xbb6c);
      wVar6 = (word)((ulong)uVar17 >> 0x10);
      uVar3 = 0;
      if (bVar14) {
        uVar3 = 0xffff;
      }
      uVar3 = uVar3 & uVar5 | (uint)uVar17;
      bVar14 = uVar3 == 0;
      uVar17 = qb3f_9f((uint)uVar17,uVar5,wVar6,wVar6,0xb7fa);
      puVar7 = (undefined *)0x0;
      if (bVar14) {
        puVar7 = (undefined *)0xffff;
      }
      bVar14 = false;
      qb3f_a7((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb43a,0xb7fa);
      uVar5 = 0;
      if (bVar14) {
        uVar5 = 0xffff;
      }
      uVar3 = uVar5 & (uint)puVar7 | uVar3;
      if (uVar3 != 0) {
        qb3f_7b(uVar3,(word)puVar7,dx_09,0xbe66,dx_09);
        return;
      }
      lVar19 = (ulong)dx_09 << 0x10;
      bVar14 = true;
    }
    else {
      bVar14 = false;
    }
    wVar6 = qb3f_9f((word)lVar19,(word)puVar7,(word)((ulong)lVar19 >> 0x10),0x52fc,0xb7f6);
    uVar5 = 0;
    if (bVar14) {
      uVar5 = 0xffff;
    }
    bVar14 = false;
    uVar17 = qb3f_a7(wVar6,uVar5,0x52fc,0xb2e6,0xb7f6);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    uVar3 = 0;
    if (bVar14) {
      uVar3 = 0xffff;
    }
    uVar3 = uVar3 & uVar5;
    bVar14 = uVar3 == 0;
    uVar17 = qb3f_9f((word)uVar17,uVar5,wVar6,wVar6,0xb7d8);
    uVar5 = 0;
    if (bVar14) {
      uVar5 = 0xffff;
    }
    bVar14 = false;
    qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2ea,0xb7d8);
    uVar2 = 0;
    if (bVar14) {
      uVar2 = 0xffff;
    }
    uVar3 = uVar2 & uVar5 | uVar3;
    bVar14 = uVar3 == 0;
    uVar17 = qb3f_9f(uVar3,uVar5,dx_10,dx_10,0xbb60);
    uVar5 = 0;
    if (bVar14) {
      uVar5 = 0xffff;
    }
    bVar14 = false;
    uVar17 = qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2ee,0xbb60);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    uVar3 = 0;
    if (bVar14) {
      uVar3 = 0xffff;
    }
    uVar3 = uVar3 & uVar5 | (uint)uVar17;
    bVar14 = uVar3 == 0;
    uVar17 = qb3f_9f((uint)uVar17,uVar5,wVar6,wVar6,0xb802);
    uVar5 = 0;
    if (bVar14) {
      uVar5 = 0xffff;
    }
    bVar14 = false;
    qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2f2,0xb802);
    uVar2 = 0;
    if (bVar14) {
      uVar2 = 0xffff;
    }
    uVar3 = uVar2 & uVar5 | uVar3;
    bVar14 = uVar3 == 0;
    uVar17 = qb3f_9f(uVar3,uVar5,dx_11,dx_11,0xbb6c);
    uVar5 = 0;
    if (bVar14) {
      uVar5 = 0xffff;
    }
    bVar14 = false;
    uVar17 = qb3f_a7((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0xb2f6,0xbb6c);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    uVar3 = 0;
    if (bVar14) {
      uVar3 = 0xffff;
    }
    uVar3 = uVar3 & uVar5 | (uint)uVar17;
    bVar14 = uVar3 == 0;
    di_00 = (char *)0xb7fa;
    uVar17 = qb3f_9f((uint)uVar17,uVar5,wVar6,wVar6,0xb7fa);
    puVar7 = (undefined *)0x0;
    if (bVar14) {
      puVar7 = (undefined *)0xffff;
    }
    bVar14 = false;
    wVar6 = qb3f_a7((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb43a,0xb7fa);
    uVar5 = 0;
    if (bVar14) {
      uVar5 = 0xffff;
    }
    uVar5 = uVar5 & (uint)puVar7 | uVar3;
    uVar17 = CONCAT22(uVar5,wVar6);
    uVar13 = 0;
    cVar16 = '\0';
    cVar15 = (int)uVar5 < 0;
    bVar14 = uVar5 == 0;
    if (bVar14) {
      uVar17 = qb3f_9f(wVar6,(word)puVar7,0,0xb55c,0xb7f6);
      if (bVar14) {
        return;
      }
      uVar17 = qb3f_75((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x52fc,0xb7f6);
      cVar1 = qb3f_5e((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x52fc,0xb7f6);
      if (cVar16 == cVar15) {
        return;
      }
      puVar7 = (undefined *)CONCAT11(0x99,(char)puVar7);
      uVar17 = qb3f_7f((int)cVar1,(word)puVar7,(int)cVar1 >> 0xf,0xb2e6,0xb7d0);
      qb3f_7d((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb2e6,0xb2e6);
      uVar17 = FUN_1000_7f7d(uVar3);
      uVar17 = qb3f_7f((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x1fa6,0xbd26);
      uVar17 = qb3f_7d((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x1fa6,0x1fa6);
      uVar17 = qb3d_43((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x1fa6,0x1fa6);
      uVar17 = qb3f_81((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x1fa6,0xce0c);
      di_00 = (char *)0x1bca;
      uVar17 = qb3f_7d((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x1fa6,0x1bca);
    }
  }
LAB_1000_84c1:
  while( true ) {
    uVar17 = qb3f_a7((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb4ea,(word)di_00);
    wVar6 = 0;
    if ((bool)uVar13) {
      wVar6 = 0xffff;
    }
    wVar9 = 0xb4f2;
    qb3f_a7((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    iVar4 = 0;
    if ((bool)uVar13) {
      iVar4 = -1;
    }
    if (iVar4 != 0 || wVar6 != 0) {
      FUN_1000_a013();
      return;
    }
    if (DAT_2000_b702 == 1) {
      DAT_2000_b702 = 0;
      DAT_2000_b536 = 0xffff;
      FUN_1000_8fea();
      FUN_1000_4275();
      FUN_1000_580f();
      FUN_1000_7fc8();
    }
    uVar10 = DAT_2000_b704 == 0;
    uVar13 = DAT_2000_b704 == 1;
    if ((bool)uVar13) {
      FUN_1000_4abd();
      DAT_2000_b704 = 0;
    }
    FUN_1000_7f43();
    uVar17 = FUN_1000_49d1();
    uVar17 = qb3e_42((word)uVar17,0x18,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar8 = 1;
    uVar17 = qb3e_44((word)uVar17,1,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar6 = qb3f_bc((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    puVar7 = (undefined *)&lit_EXP_VALUE;
    uVar17 = qb3f_6a(wVar6,0xd018,wVar8,0xb4f2,(word)di_00);
    uVar17 = qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3e_42((word)uVar17,0x19,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar8 = 3;
    uVar17 = qb3e_44((word)uVar17,3,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3f_bc((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar6 = 0xb6fa;
    uVar17 = qb3f_68((word)uVar17,0xb6fa,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3e_79((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar6 = wVar8;
    uVar17 = qb3e_42((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    bx = (word)((ulong)uVar17 >> 0x10);
    uVar17 = qb3e_44((word)uVar17,bx,wVar6,0xb4f2,(word)di_00);
    uVar17 = qb3f_bc((word)uVar17,bx,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    qb3f_6a((word)uVar17,0xd028,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar6 = 0x15;
    uVar17 = qb3d_0d(0x15,0x15,dx,0xb4f2,(word)di_00);
    uVar17 = qb3f_6a((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3e_79((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3e_42((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar6 = (word)uVar17;
    uVar17 = qb3e_44(wVar6,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3f_bc((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar6 = 0xb4f2;
    uVar17 = qb3f_6b((word)uVar17,0xb4f2,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3e_79((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3f_bc((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3f_6a((word)uVar17,0xd040,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar6 = 0x16;
    uVar17 = qb3d_0d((word)uVar17,0x16,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3f_6a((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3e_79((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3e_42((word)uVar17,4,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar6 = (word)uVar17;
    uVar17 = qb3e_44(wVar6,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3f_bc((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    wVar6 = 0xb6e4;
    uVar17 = qb3f_6b((word)uVar17,0xb6e4,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    uVar17 = qb3e_79((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb4f2,(word)di_00);
    DAT_2000_b536 = 0;
    do {
      uVar17 = qb3d_43((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),wVar9,(word)di_00);
      uVar17 = qb3f_7d((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),wVar9,0xb6d8);
      uVar17 = qb3f_9f((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0x1bc2,0xb6d8);
      uVar5 = 0;
      if ((bool)uVar10) {
        uVar5 = 0xffff;
        uVar13 = 0;
      }
      uVar17 = qb3d_43((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0x1bc2,0xb6d8);
      wVar6 = qb3f_9b((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0x1bc2,0xb6d8);
      uVar17 = qb3f_a1(wVar6,uVar5,0x1bc2,0x1bc2,0xd056);
      wVar6 = (word)((ulong)uVar17 >> 0x10);
      uVar3 = 0;
      if (!(bool)uVar10 && !(bool)uVar13) {
        uVar3 = 0xffff;
      }
      bVar14 = false;
      uVar3 = uVar3 | uVar5;
      bVar11 = uVar3 == 0;
      uVar17 = qb3f_a7((word)uVar17,uVar5,wVar6,wVar6,0xd056);
      wVar6 = (word)((ulong)uVar17 >> 0x10);
      uVar5 = 0;
      if (!bVar14 && !bVar11) {
        uVar5 = 0xffff;
      }
      uVar13 = 0;
      uVar10 = (uVar5 & uVar3) == 0;
      if ((bool)uVar10) {
        wVar9 = 0;
      }
      else {
        uVar17 = qb3f_7b((word)uVar17,uVar5 & uVar3,wVar6,0xbc2a,wVar6);
        uVar17 = qb3e_42((word)uVar17,7,(word)((ulong)uVar17 >> 0x10),0xbc2a,wVar6);
        wVar9 = 0x14;
        uVar17 = qb3e_44((word)uVar17,0x14,(word)((ulong)uVar17 >> 0x10),0xbc2a,wVar6);
        uVar17 = qb3f_bc((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0xbc2a,wVar6);
        wVar9 = 0xe;
        uVar17 = qb3d_0d((word)uVar17,0xe,(word)((ulong)uVar17 >> 0x10),0xbc2a,wVar6);
        uVar17 = qb3f_6a((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0xbc2a,wVar6);
        uVar17 = qb3e_79((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0xbc2a,wVar6);
      }
      uVar17 = qb3f_9f((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0x1bc6,0xb6d8);
      uVar5 = 0;
      if ((bool)uVar13) {
        uVar5 = 0xffff;
        uVar10 = 0;
      }
      uVar17 = qb3d_43((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0x1bc6,0xb6d8);
      wVar6 = qb3f_9b((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0x1bc6,0xb6d8);
      uVar17 = qb3f_a1(wVar6,uVar5,0x1bc6,0x1bc6,0xd056);
      wVar6 = (word)((ulong)uVar17 >> 0x10);
      uVar3 = 0;
      if (!(bool)uVar13 && !(bool)uVar10) {
        uVar3 = 0xffff;
      }
      bVar14 = false;
      uVar3 = uVar3 | uVar5;
      bVar11 = uVar3 == 0;
      uVar17 = qb3f_a7((word)uVar17,uVar5,wVar6,wVar6,0xd056);
      wVar6 = (word)((ulong)uVar17 >> 0x10);
      uVar5 = 0;
      if (!bVar14 && !bVar11) {
        uVar5 = 0xffff;
      }
      wVar9 = uVar5 & uVar3;
      uVar13 = 0;
      uVar10 = wVar9 == 0;
      if ((bool)uVar10) {
        wVar6 = 0;
      }
      else {
        uVar17 = qb3f_7b((word)uVar17,wVar9,wVar6,0xbc2a,wVar6);
        uVar17 = qb3f_7b((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0xbc2a,0xb706);
        uVar17 = qb3e_42((word)uVar17,6,(word)((ulong)uVar17 >> 0x10),0xbc2a,0xb706);
        wVar6 = 0x14;
        uVar17 = qb3e_44((word)uVar17,0x14,(word)((ulong)uVar17 >> 0x10),0xbc2a,0xb706);
        uVar17 = qb3f_bc((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xbc2a,0xb706);
        uVar17 = qb3d_0d((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xbc2a,0xb706);
        uVar17 = qb3f_6a((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xbc2a,0xb706);
        uVar17 = qb3e_79((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xbc2a,0xb706);
      }
      uVar17 = qb3f_9f((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0x1bca,0xb6d8);
      uVar5 = 0;
      if ((bool)uVar13) {
        uVar5 = 0xffff;
        uVar10 = 0;
      }
      uVar17 = qb3d_43((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0x1bca,0xb6d8);
      wVar6 = qb3f_9b((word)uVar17,uVar5,(word)((ulong)uVar17 >> 0x10),0x1bca,0xb6d8);
      di_00 = (char *)s_ITS_HEALTH_POINTS__2000_d044 + 0x12;
      uVar17 = qb3f_a1(wVar6,uVar5,0x1bca,0x1bca,0xd056);
      wVar9 = (word)((ulong)uVar17 >> 0x10);
      uVar3 = 0;
      if (!(bool)uVar13 && !(bool)uVar10) {
        uVar3 = 0xffff;
      }
      bVar14 = false;
      uVar3 = uVar3 | uVar5;
      bVar11 = uVar3 == 0;
      uVar17 = qb3f_a7((word)uVar17,uVar5,wVar9,wVar9,0xd056);
      wVar6 = (word)((ulong)uVar17 >> 0x10);
      uVar5 = 0;
      if (!bVar14 && !bVar11) {
        uVar5 = 0xffff;
      }
      wVar8 = uVar5 & uVar3;
      uVar10 = 0;
      uVar12 = wVar8 == 0;
      if ((bool)uVar12) {
        wVar6 = 0;
      }
      else {
        uVar17 = qb3f_7b((word)uVar17,wVar8,wVar6,0xbc2a,wVar6);
        wVar9 = 0x1fa6;
        uVar17 = qb3f_7f((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),0x1fa6,0xd05a);
        di_00 = (char *)0x1fa6;
        uVar17 = qb3f_7d((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),0x1fa6,0x1fa6);
        uVar17 = qb3e_42((word)uVar17,5,(word)((ulong)uVar17 >> 0x10),0x1fa6,0x1fa6);
        wVar6 = 0x14;
        uVar17 = qb3e_44((word)uVar17,0x14,(word)((ulong)uVar17 >> 0x10),0x1fa6,0x1fa6);
        uVar17 = qb3f_bc((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0x1fa6,0x1fa6);
        uVar17 = qb3d_0d((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0x1fa6,0x1fa6);
        uVar17 = qb3f_6e((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0x1fa6,0x1fa6);
        qb3e_79((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0x1fa6,0x1fa6);
      }
      uVar17 = FUN_1000_7eec();
      wVar8 = qb3d_06((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),wVar9,(word)di_00);
      qb3f_61(wVar8,wVar6,0xb49c,wVar9,(word)di_00);
      wVar6 = 0xbc1a;
      uVar17 = qb3f_62(ax,0xbc1a,ax,wVar9,(word)di_00);
      uVar13 = 1;
    } while ((bool)uVar12);
    DAT_2000_b54c = 0;
    FUN_1000_10be();
    uVar17 = FUN_1000_2f87();
    uVar17 = qb3f_7b((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xd05e,0xb51c);
    uVar17 = qb3f_7b((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xd05e,0xb512);
    qb3f_7b((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb7f6,0xb50e);
    uVar17 = FUN_1000_09e8();
    uVar17 = qb3f_7b((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb7ee,0xb4fa);
    wVar9 = 0xb512;
    uVar17 = qb3f_9f((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb512,0xb7f6);
    if ((bool)uVar12) {
      uVar17 = FUN_1000_54cb();
      wVar8 = (word)uVar17;
      if (DAT_2000_b5d8 == 1) {
        uVar13 = 1;
        uVar10 = 0;
        goto LAB_1000_8f70;
      }
    }
    uVar13 = 0;
    qb3f_7b((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb69c,0xb530);
    uVar17 = FUN_1000_6fbd();
    wVar6 = DAT_2000_b698;
    uVar17 = qb3f_57((word)uVar17,DAT_2000_b698,(word)((ulong)uVar17 >> 0x10),0xb69c,0xb530);
    wVar6 = qb3f_a1((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb69c,0xb4ca);
    wVar9 = 0;
    if (!(bool)uVar13) {
      wVar9 = 0xffff;
      uVar13 = 0;
    }
    wVar8 = DAT_2000_b69a;
    uVar17 = qb3f_57(wVar6,DAT_2000_b69a,wVar9,0xb69c,0xb4ca);
    uVar17 = qb3f_a1((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),0xb69c,0xb4d2);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    iVar4 = 0;
    if (!(bool)uVar13) {
      iVar4 = -1;
    }
    bVar14 = iVar4 == 0 && wVar6 == 0;
    if (iVar4 != 0 || wVar6 != 0) {
      FUN_1000_8e76();
      return;
    }
    wVar9 = 0xb51c;
    qb3f_9f((word)uVar17,0,wVar6,0xb51c,0xb7f6);
    if (bVar14) {
      FUN_1000_9a2f();
      return;
    }
    wVar6 = qb3f_62(0xb49c,0xb8a6,dx_00,0xb51c,0xb7f6);
    wVar8 = 0;
    if (bVar14) {
      wVar8 = 0xffff;
    }
    bVar14 = false;
    uVar17 = qb3f_62(wVar6,0xb4b0,wVar8,0xb51c,0xb7f6);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    iVar4 = 0;
    if (bVar14) {
      iVar4 = -1;
    }
    uVar13 = 0;
    uVar10 = iVar4 == 0 && wVar6 == 0;
    if (iVar4 != 0 || wVar6 != 0) {
      qb3f_61((word)uVar17,0xd062,0xb70a,0xb51c,0xb7f6);
      FUN_1000_c33b();
      DAT_2000_b702 = 1;
      FUN_1000_6baf();
      wVar6 = extraout_DX;
    }
    puVar7 = (undefined *)&lit_S;
    uVar17 = qb3f_62(0xb49c,0xd068,wVar6,0xb51c,0xb7f6);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    if ((bool)uVar10) {
      wVar9 = 0x1b9a;
      uVar17 = qb3f_9f((word)uVar17,(word)puVar7,wVar6,0x1b9a,0xb7f6);
      if ((bool)uVar10) {
        qb3f_7b((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb7f6,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar6 = extraout_DX_00;
    }
    puVar7 = (undefined *)&lit_M;
    uVar17 = qb3f_62(0xb49c,0xb8ac,wVar6,wVar9,0xb7f6);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    if ((bool)uVar10) {
      wVar9 = 0x1b9e;
      uVar17 = qb3f_9f((word)uVar17,(word)puVar7,wVar6,0x1b9e,0xb7f6);
      if ((bool)uVar10) {
        qb3f_7b((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb7d8,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar6 = extraout_DX_01;
    }
    puVar7 = (undefined *)&lit_K;
    uVar17 = qb3f_62(0xb49c,0xb8b8,wVar6,wVar9,0xb7f6);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    if ((bool)uVar10) {
      wVar9 = 0x1b96;
      uVar17 = qb3f_9f((word)uVar17,(word)puVar7,wVar6,0x1b96,0xb7f6);
      if ((bool)uVar10) {
        qb3f_7b((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xbb60,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar6 = extraout_DX_02;
    }
    di_00 = (char *)0xb7f6;
    qb3f_62(0xb49c,0xb8b2,wVar6,wVar9,0xb7f6);
    wVar6 = extraout_DX_03;
    if ((bool)uVar10) {
      FUN_1000_7ffb();
      DAT_2000_b702 = 1;
      FUN_1000_6baf();
      wVar6 = extraout_DX_04;
    }
    puVar7 = (undefined *)&lit_F;
    uVar17 = qb3f_62(0xb49c,0xd06e,wVar6,wVar9,0xb7f6);
    wVar6 = (word)((ulong)uVar17 >> 0x10);
    if ((bool)uVar10) {
      qb3f_7b((word)uVar17,(word)puVar7,wVar6,0xb802,0xb478);
      FUN_1000_89d9();
      return;
    }
    qb3f_62(0xb49c,0xbc68,wVar6,wVar9,0xb7f6);
    if ((bool)uVar10) {
      DAT_2000_b702 = 1;
      FUN_1000_90d3();
      return;
    }
    qb3f_62(0xb49c,0xb7e0,dx_01,wVar9,0xb7f6);
    if ((bool)uVar10) {
      DAT_2000_b702 = 1;
      FUN_1000_95ba();
      return;
    }
    puVar7 = (undefined *)&lit_T;
    qb3f_62(0xb49c,0xbcca,dx_02,wVar9,0xb7f6);
    if (!(bool)uVar10) break;
    uVar17 = FUN_1000_7c49();
    DAT_2000_b702 = 1;
  }
  DAT_2000_b54c = 0;
  puVar7 = (undefined *)&lit_W;
  uVar17 = qb3f_62(0xb49c,0xbcd0,dx_03,wVar9,0xb7f6);
  if ((bool)uVar10) {
    DAT_2000_b702 = 1;
    uVar17 = qb3e_42((word)uVar17,10,(word)((ulong)uVar17 >> 0x10),wVar9,0xb7f6);
    puVar7 = (undefined *)0x1;
    qb3e_44((word)uVar17,1,(word)((ulong)uVar17 >> 0x10),wVar9,0xb7f6);
    uVar17 = FUN_1000_7aa1();
    wVar8 = (word)((ulong)uVar17 >> 0x10);
    wVar6 = (word)uVar17;
    uVar10 = DAT_2000_b54c == 0;
    uVar13 = DAT_2000_b54c == 1;
    if ((bool)uVar13) {
      wVar8 = qb3e_32(wVar6,0xffff,wVar8,wVar9,0xb7f6);
      DAT_2000_b5d8 = 1;
LAB_1000_8f70:
      puVar7 = (undefined *)&lit_empty;
      qb3f_61(wVar8,0xbb56,0xb49c,wVar9,0xb7f6);
      uVar17 = FUN_1000_340c();
      uVar17 = qb3f_7b((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb7ee,0xb4fa);
      uVar17 = qb3f_7b((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb7ee,0xb50e);
      wVar9 = 0xb7ee;
      uVar17 = qb3f_7b((word)uVar17,0xb7ee,(word)((ulong)uVar17 >> 0x10),0xb7f6,0xb4c2);
      wVar6 = wVar9;
      uVar17 = qb3f_9f((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0xb6e4,wVar9);
      if (!(bool)uVar10 && !(bool)uVar13) {
        wVar8 = qb3f_75((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb6e4,wVar9);
        qb3f_75(wVar8,wVar6,wVar6,0xb69c,wVar9);
        ((undefined2 *)&DAT_2000_3824)[wVar6] = extraout_DX_05;
      }
      if (DAT_2000_b5d8 == 1) {
        DAT_2000_b5d8 = 0;
        DAT_2000_b702 = 0;
        FUN_1000_4c28();
        return;
      }
      FUN_1000_8fea();
      DAT_2000_b660 = 0;
      DAT_2000_b536 = 1;
      DAT_2000_b702 = 0;
      FUN_1000_58f7();
      FUN_1000_4275();
      return;
    }
    if (DAT_2000_b54c == 2) {
      FUN_1000_8f6a();
      return;
    }
    if (DAT_2000_b54c == 3) {
      uVar13 = 0;
      goto LAB_1000_84c1;
    }
    if (DAT_2000_b54c == 6) {
      uVar17 = qb3f_7f(wVar6,(word)puVar7,wVar8,0xb568,0xbb60);
      qb3f_7d((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb568,0xb568);
      FUN_1000_92c8();
      return;
    }
    if (DAT_2000_b54c == 7) {
      uVar17 = qb3f_7f(wVar6,(word)puVar7,wVar8,0xb568,0xbb60);
      qb3f_7d((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb568,0xb568);
      FUN_1000_9298();
      return;
    }
    if (DAT_2000_b54c == 8) {
      uVar17 = qb3f_7f(wVar6,(word)puVar7,wVar8,0xb568,0xbb6c);
      qb3f_7d((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb568,0xb568);
      FUN_1000_93e9();
      return;
    }
    uVar13 = DAT_2000_b54c < 9;
    if (DAT_2000_b54c == 9) goto LAB_1000_84c1;
  }
  uVar10 = 0;
  uVar17 = qb3d_43((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar9,0xb7f6);
  uVar17 = qb3f_a3((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x1bc2,0xb7f6);
  if (!(bool)uVar13 && !(bool)uVar10) {
    puVar7 = (undefined *)&lit_B;
    uVar17 = qb3f_62(0xb49c,0xca72,(word)((ulong)uVar17 >> 0x10),0x1bc2,0xb7f6);
    if ((bool)uVar10) {
      uVar17 = qb3d_34((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x1bc2,0xb7f6);
      uVar17 = qb3f_91((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0x1bc2,0xcc52);
      wVar6 = 0x1a;
      uVar17 = qb3d_03((word)uVar17,0x1a,(word)((ulong)uVar17 >> 0x10),0x1bc2,0xcc52);
      uVar17 = qb3f_81((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0x1bc2,0xbe6e);
      uVar17 = qb3f_7d((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0x1bc2,0xb574);
      uVar17 = qb3f_97((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb6e4,0xb574);
      wVar8 = 0xb6e4;
      wVar9 = 0xb574;
      wVar6 = qb3f_7d((word)uVar17,0xb574,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      uVar17 = qb3e_42(wVar6,0xb,wVar9,0xb574,0xb6e4);
      wVar6 = 1;
      uVar17 = qb3e_44((word)uVar17,1,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      qb3f_bc((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      wVar9 = 0x19;
      uVar17 = qb3d_0d(0x19,0x19,dx_04,0xb574,0xb6e4);
      uVar17 = qb3f_6e((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      uVar17 = qb3e_79((word)uVar17,wVar9,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      uVar17 = qb3e_42((word)uVar17,10,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      uVar17 = qb3e_44((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      uVar17 = qb3f_bc((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      wVar6 = (word)uVar17;
      uVar17 = qb3d_0d(wVar6,wVar6,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      uVar17 = qb3f_6e((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      uVar17 = qb3e_79((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb574,0xb6e4);
      wVar9 = (word)((ulong)uVar17 >> 0x10);
      qb3f_a7((word)uVar17,wVar6,wVar9,wVar9,0xb6e4);
      wVar6 = 0;
      if ((bool)uVar10) {
        wVar6 = 0xffff;
      }
      bVar14 = false;
      puVar7 = (undefined *)&lit_B;
      uVar17 = qb3f_62(0xb49c,0xca72,wVar6,wVar9,0xb6e4);
      uVar3 = (uint)((ulong)uVar17 >> 0x10);
      uVar5 = 0;
      if (!bVar14) {
        uVar5 = 0xffff;
      }
      uVar13 = 0;
      uVar10 = (uVar5 & uVar3) == 0;
      if (!(bool)uVar10) {
        uVar17 = qb3f_bc((word)uVar17,(word)puVar7,uVar3,wVar9,0xb6e4);
        uVar17 = qb3d_34((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar9,0xb6e4);
        uVar17 = qb3f_91((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar9,0xbb6c);
        wVar6 = 0x1a;
        uVar17 = qb3d_03((word)uVar17,0x1a,(word)((ulong)uVar17 >> 0x10),wVar9,0xbb6c);
        wVar8 = 0xb7f6;
        uVar17 = qb3f_81((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),wVar9,0xb7f6);
        uVar17 = qb3f_77((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),wVar9,0xb7f6);
        uVar13 = 0xa01f < wVar6 * 4;
        puVar7 = (undefined *)(wVar6 * 4 + 0x5fe0);
        uVar10 = puVar7 == (undefined *)0x0;
        uVar17 = qb3f_6e((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar9,0xb7f6);
        uVar17 = qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar9,0xb7f6);
      }
      uVar17 = qb3f_a7((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb574,wVar8);
      if (!(bool)uVar13 && !(bool)uVar10) {
        uVar17 = qb3f_bc((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb574,wVar8);
        uVar17 = qb3d_34((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb574,wVar8);
        wVar9 = 0xb574;
        wVar6 = qb3f_91((word)uVar17,0xb574,(word)((ulong)uVar17 >> 0x10),0xb574,0xbb6c);
        wVar8 = 0x1a;
        uVar17 = qb3d_03(wVar6,0x1a,wVar9,0xb574,0xbb6c);
        uVar17 = qb3f_81((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),0xb574,0xb7fa);
        uVar17 = qb3f_77((word)uVar17,wVar8,(word)((ulong)uVar17 >> 0x10),0xb574,0xb7fa);
        uVar13 = 0xa01f < wVar8 * 4;
        wVar6 = wVar8 * 4 + 0x5fe0;
        uVar10 = wVar6 == 0;
        uVar17 = qb3f_6e((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb574,0xb7fa);
        uVar17 = qb3e_79((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb574,0xb7fa);
        uVar17 = qb3e_42((word)uVar17,10,(word)((ulong)uVar17 >> 0x10),0xb574,0xb7fa);
        wVar6 = 1;
        uVar17 = qb3e_44((word)uVar17,1,(word)((ulong)uVar17 >> 0x10),0xb574,0xb7fa);
        uVar17 = qb3f_bc((word)uVar17,wVar6,(word)((ulong)uVar17 >> 0x10),0xb574,0xb7fa);
        uVar17 = qb3f_6a((word)uVar17,0xd0a6,(word)((ulong)uVar17 >> 0x10),0xb574,0xb7fa);
        wVar6 = (word)((ulong)uVar17 >> 0x10);
        uVar17 = qb3f_67((word)uVar17,wVar6,wVar6,0xb574,0xb7fa);
        puVar7 = (undefined *)&lit_POINT;
        uVar17 = qb3f_6a((word)uVar17,0xd0b2,(word)((ulong)uVar17 >> 0x10),0xb574,0xb7fa);
        uVar17 = qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb574,0xb7fa);
        wVar6 = (word)((ulong)uVar17 >> 0x10);
        uVar17 = qb3f_9f((word)uVar17,(word)puVar7,wVar6,wVar6,0xb7f6);
        wVar9 = (word)((ulong)uVar17 >> 0x10);
        if ((bool)uVar13 || (bool)uVar10) {
          uVar17 = qb3f_bc((word)uVar17,(word)puVar7,wVar9,wVar6,0xb7f6);
          puVar7 = (undefined *)&lit_empty;
          uVar17 = qb3f_6e((word)uVar17,0xc910,(word)((ulong)uVar17 >> 0x10),wVar6,0xb7f6);
          uVar17 = qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar6,0xb7f6);
        }
        else {
          uVar17 = qb3f_bc((word)uVar17,(word)puVar7,wVar9,wVar6,0xb7f6);
          puVar7 = (undefined *)&lit_S;
          uVar17 = qb3f_6e((word)uVar17,0xd0bc,(word)((ulong)uVar17 >> 0x10),wVar6,0xb7f6);
          uVar17 = qb3e_79((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar6,0xb7f6);
        }
      }
      wVar6 = 0xb7ee;
      uVar17 = qb3f_7b((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb7ee,0xb574);
      uVar17 = qb3d_43((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb7ee,0xb574);
      di = (undefined *)0xb71a;
      uVar17 = qb3f_7d((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb7ee,0xb71a);
      do {
        uVar17 = qb3d_43((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar6,(word)di);
        uVar17 = qb3f_7d((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),wVar6,0xb71e);
        di = (undefined *)0xb71e;
        wVar6 = 0xb71a;
        uVar17 = qb3f_7f((word)uVar17,0xb71e,(word)((ulong)uVar17 >> 0x10),0xb71a,0xb7f6);
        puVar7 = di;
        uVar17 = qb3f_a1((word)uVar17,(word)di,(word)((ulong)uVar17 >> 0x10),0xb71a,(word)di);
      } while ((bool)uVar13);
      uVar17 = qb3f_9f((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb6e4,0xb7f6);
      if ((bool)uVar13) {
        FUN_1000_a335();
        return;
      }
      uVar17 = qb3d_34((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb6e4,0xb7f6);
      uVar17 = qb3f_91((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb6e4,0xbc26);
      uVar17 = qb3d_03((word)uVar17,0x1a,(word)((ulong)uVar17 >> 0x10),0xb6e4,0xbc26);
      puVar7 = DAT_2000_b6f8;
      uVar17 = qb3f_71((word)uVar17,(word)DAT_2000_b6f8,(word)((ulong)uVar17 >> 0x10),0xb6e4,0xbc26)
      ;
      uVar17 = qb3f_57((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb6e4,0xbc26);
      uVar17 = qb3f_85((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb6e4,0xbc26);
      uVar17 = qb3f_81((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb6e4,0xb7f6);
      di_00 = (char *)0x1fa6;
      uVar17 = qb3f_a1((word)uVar17,(word)puVar7,(word)((ulong)uVar17 >> 0x10),0xb6e4,0x1fa6);
      if (!(bool)uVar13) {
        FUN_1000_9a2f();
        return;
      }
    }
  }
  goto LAB_1000_84c1;
}


// ==== FUN_1000_9a2f @ 1000:9a2f (size 1507) callers: FUN_1000_803a,FUN_1000_89d9,FUN_1000_9555,FUN_1000_9569,FUN_1000_9a2f

/* WARNING: Instruction at (ram,0x00019d3a) overlaps instruction at (ram,0x00019d39)
    */

void FUN_1000_9a2f(void)

{
  int *piVar1;
  uint *puVar2;
  byte *pbVar3;
  undefined2 uVar4;
  byte bVar5;
  undefined2 in_AX;
  word wVar6;
  word dx;
  word ax;
  word dx_00;
  word extraout_DX;
  word extraout_DX_00;
  word extraout_DX_01;
  word extraout_DX_02;
  word extraout_DX_03;
  word extraout_DX_04;
  word dx_01;
  word dx_02;
  word dx_03;
  word dx_04;
  undefined2 extraout_DX_05;
  undefined2 in_DX;
  uint uVar7;
  word dx_05;
  int iVar8;
  char *pcVar9;
  char *in_BX;
  undefined1 *bx;
  word wVar10;
  word wVar11;
  undefined *puVar12;
  uint uVar13;
  int unaff_BP;
  word unaff_SI;
  word wVar14;
  undefined *di;
  undefined2 *unaff_DI;
  undefined1 *puVar15;
  undefined2 unaff_ES;
  undefined2 unaff_SS;
  undefined1 uVar16;
  undefined1 uVar17;
  byte in_AF;
  byte bVar18;
  bool bVar19;
  undefined1 uVar20;
  bool bVar21;
  undefined4 uVar22;
  ulong uVar23;
  
  uVar22 = CONCAT22(in_DX,in_AX);
  do {
    wVar6 = (word)((ulong)uVar22 >> 0x10);
    uVar16 = DAT_2000_b6cc == 0;
    bVar21 = DAT_2000_b6cc == 1;
    if (DAT_2000_b6cc < 2) {
      uVar22 = qb3f_9f((word)uVar22,(word)in_BX,wVar6,0xb6f4,0xbb60);
      bx = (undefined1 *)0x0;
      if (bVar21) {
        bx = (undefined1 *)0xffff;
      }
      bVar21 = false;
      wVar6 = qb3f_a7((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xbb60);
      uVar7 = 0;
      if (!(bool)uVar16 && !bVar21) {
        uVar7 = 0xffff;
      }
      uVar17 = 0;
      uVar16 = (uVar7 & (uint)bx) == 0;
      if ((bool)uVar16) {
        wVar14 = 0xd1ce;
        uVar22 = qb3f_7b(wVar6,(word)bx,0,0xd1ce,0xb2ae);
        puVar15 = (undefined1 *)0xb2aa;
        uVar22 = qb3f_7b((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xd1ce,0xb2aa);
        do {
          uVar17 = uVar16;
          uVar22 = qb3d_34((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),wVar14,(word)puVar15)
          ;
          uVar22 = qb3f_91((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),wVar14,0xbc1e);
          uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),wVar14,0xbc1e);
          puVar15 = (undefined1 *)0xbc1e;
          wVar6 = qb3f_81((word)uVar22,0xbc1e,(word)((ulong)uVar22 >> 0x10),wVar14,0x52fc);
          uVar22 = qb3f_81(wVar6,(word)puVar15,0x52fc,wVar14,0xb7f6);
          wVar6 = (word)((ulong)uVar22 >> 0x10);
          uVar22 = qb3f_7d((word)uVar22,(word)puVar15,wVar6,wVar14,wVar6);
          uVar22 = qb3f_7f((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb2ae,0xb6b4);
          wVar6 = 0xb2ae;
          uVar22 = qb3f_81((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb2ae,0xb7d0);
          uVar22 = qb3f_7d((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb2ae,wVar6);
          wVar14 = (word)((ulong)uVar22 >> 0x10);
          bx = puVar15;
          uVar22 = qb3f_9f((word)uVar22,(word)puVar15,wVar14,wVar14,(word)puVar15);
          uVar16 = 1;
        } while ((bool)uVar17);
        uVar22 = qb3f_7f((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb2ae,0x52fc);
        wVar10 = 0xb2ae;
        uVar22 = qb3f_81((word)uVar22,0xb2ae,(word)((ulong)uVar22 >> 0x10),0xb2ae,0xcbf6);
        wVar11 = 0xcbf6;
        wVar6 = qb3f_7d((word)uVar22,0xcbf6,(word)((ulong)uVar22 >> 0x10),0xb2ae,wVar10);
        wVar14 = 0xb7f6;
        uVar22 = qb3f_9f(wVar6,wVar11,wVar10,0xb6b4,0xb7f6);
        wVar6 = (word)((ulong)uVar22 >> 0x10);
        if ((bool)uVar17) {
          uVar22 = qb3f_7f((word)uVar22,wVar11,wVar6,wVar6,wVar11);
          wVar14 = (word)((ulong)uVar22 >> 0x10);
          uVar22 = qb3f_7d((word)uVar22,wVar11,wVar14,wVar6,wVar14);
        }
        uVar22 = qb3f_ab((word)uVar22,wVar11,(word)((ulong)uVar22 >> 0x10),0xb56c,wVar14);
        puVar2 = (uint *)(wVar11 + 0xb42e);
        uVar17 = CARRY2(*puVar2,wVar14);
        *puVar2 = *puVar2 + wVar14;
        uVar16 = *puVar2 == 0;
        uVar22 = qb3f_81((word)uVar22,wVar11,(word)((ulong)uVar22 >> 0x10),0xb56c,wVar14);
        uVar22 = qb3f_81((word)uVar22,wVar11,(word)((ulong)uVar22 >> 0x10),0xb56c,0xb432);
        uVar22 = qb3f_81((word)uVar22,wVar11,(word)((ulong)uVar22 >> 0x10),0xb56c,0xb5a2);
        uVar22 = qb3f_81((word)uVar22,wVar11,(word)((ulong)uVar22 >> 0x10),0xb56c,0xbd22);
        uVar22 = qb3f_7d((word)uVar22,wVar11,(word)((ulong)uVar22 >> 0x10),0xb56c,0xb72c);
        bx = (undefined1 *)&DAT_2000_b72c;
        uVar22 = qb3f_9f((word)uVar22,0xb72c,(word)((ulong)uVar22 >> 0x10),0xb57e,0xb7f6);
        if ((bool)uVar16) {
          wVar6 = qb3f_87((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xb7fa);
          puVar15 = (undefined1 *)0x1a;
          uVar22 = qb3d_03(wVar6,0x1a,(word)bx,0xb4ea,0xb7fa);
          wVar6 = (word)((ulong)uVar22 >> 0x10);
          uVar22 = qb3f_81((word)uVar22,(word)puVar15,wVar6,0xb4ea,wVar6);
          uVar22 = qb3f_81((word)uVar22,(word)puVar15,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xbb6c);
          wVar6 = (word)((ulong)uVar22 >> 0x10);
          uVar22 = qb3f_7d((word)uVar22,(word)puVar15,wVar6,0xb4ea,wVar6);
          bx = puVar15;
        }
      }
      else {
        uVar22 = qb3f_7b(wVar6,(word)bx,uVar7 & (uint)bx,0xbe66,0xb2aa);
      }
      uVar22 = qb3f_7f((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb72c,0xb706);
      uVar22 = qb3f_a3((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb2ae,0xb706);
      bVar18 = in_AF;
      if (!(bool)uVar17 && !(bool)uVar16) {
        uVar22 = qb3d_34((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb2ae,0xb706);
        uVar22 = qb3f_ad((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb2ae,0xb706);
        wVar6 = 0x1a;
        uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0xb2ae,0xb706);
        uVar22 = qb3f_83((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb706);
        bx = (undefined1 *)0xb2aa;
        uVar22 = qb3f_81((word)uVar22,0xb2aa,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb7f6);
        uVar22 = qb3f_7d((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb2aa,(word)bx);
        bVar18 = in_AF;
      }
      uVar22 = qb3f_9f((word)uVar22,(word)bx,(word)((ulong)uVar22 >> 0x10),0xb6b4,0xb802);
      wVar6 = 0;
      if ((bool)uVar17) {
        wVar6 = 0xffff;
        uVar16 = 0;
      }
      wVar14 = qb3f_9f((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb802);
      uVar7 = 0;
      if (!(bool)uVar17 && !(bool)uVar16) {
        uVar7 = 0xffff;
      }
      uVar16 = 0;
      uVar17 = (uVar7 & wVar6) == 0;
      if ((bool)uVar17) {
        uVar23 = (ulong)wVar14;
      }
      else {
        uVar22 = qb3f_7f(wVar14,wVar6,uVar7 & wVar6,0xb2aa,0xc2d8);
        uVar23 = qb3f_7d((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb2aa);
      }
      uVar22 = qb3f_9f((word)uVar23,wVar6,(word)(uVar23 >> 0x10),0xb6f4,0xbb60);
      puVar12 = (undefined *)0x0;
      if ((bool)uVar17) {
        puVar12 = (undefined *)0xffff;
      }
      bVar21 = false;
      wVar6 = qb3f_a7((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xbb60);
      uVar7 = 0;
      if (!(bool)uVar16 && !bVar21) {
        uVar7 = 0xffff;
      }
      if ((uVar7 & (uint)puVar12) == 0) {
        uVar23 = (ulong)wVar6;
      }
      else {
        uVar22 = qb3e_42(wVar6,5,uVar7 & (uint)puVar12,0xb2aa,0xbb60);
        wVar6 = 1;
        uVar22 = qb3e_44((word)uVar22,1,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xbb60);
        uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xbb60);
        puVar12 = (undefined *)&lit_IT_S_STUCK_TO_YOU;
        uVar22 = qb3f_6e((word)uVar22,0xd1d2,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xbb60);
        uVar23 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xbb60);
      }
      uVar22 = qb3f_7f((word)uVar23,(word)puVar12,(word)(uVar23 >> 0x10),0xb2ae,0xd09e);
      uVar22 = qb3f_71((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb72c,0xb706);
      uVar22 = qb3f_7f((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb72c,0xb706);
      uVar22 = qb3f_a5((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb72c,0xb706);
      puVar12[3] = puVar12[3] ^ 0xe9;
      uVar22 = qb3d_34(CONCAT11((char)((ulong)uVar22 >> 8),
                                (byte)uVar22 & ((undefined1 *)&DAT_2000_b72c)[(int)puVar12]),
                       (word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb72c,0xb706);
      uVar22 = qb3f_91((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb72c,0xbd2e);
      wVar6 = 0x1a;
      uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0xb72c,0xbd2e);
      uVar22 = qb3f_83((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xbd2e);
      wVar6 = 0xb2aa;
      uVar22 = qb3f_81((word)uVar22,0xb2aa,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb7f6);
      uVar22 = qb3f_7d((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,wVar6);
      uVar22 = qb3f_7f((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2ae,0xd0a2);
      uVar22 = qb3f_71((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb72c,0xb706);
      uVar22 = qb3f_7f((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb72c,0xb706);
      uVar22 = qb3f_a5((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb72c,0xb706);
      *(byte *)(wVar6 + 3) = *(byte *)(wVar6 + 3) ^ 0xe9;
      uVar22 = qb3d_34(CONCAT11((char)((ulong)uVar22 >> 8),
                                (byte)uVar22 & ((undefined1 *)&DAT_2000_b72c)[wVar6]),wVar6,
                       (word)((ulong)uVar22 >> 0x10),0xb72c,0xb706);
      uVar22 = qb3f_91((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb72c,0xd1e8);
      wVar6 = 0x1a;
      uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0xb72c,0xd1e8);
      uVar22 = qb3f_83((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xd1e8);
      wVar6 = 0xb2aa;
      uVar22 = qb3f_81((word)uVar22,0xb2aa,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb7f6);
      uVar22 = qb3f_7d((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,wVar6);
      uVar22 = qb3f_97((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb6b4,0xb4ea);
      uVar22 = qb3f_ad((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb6b4,0xb4ea);
      qb3f_77((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb6b4,0xb4ea);
      DAT_2000_b5e4 = wVar6;
      if ((int)wVar6 < -10) {
        DAT_2000_b5e4 = 10;
      }
      uVar17 = wVar6 == 0xfff6;
      in_AF = wVar6 < 0xfff6;
      uVar22 = qb3d_34(DAT_2000_b5e4,wVar6,dx_05,0xb6b4,0xb4ea);
      uVar22 = qb3f_91((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb6b4,0xb6b4);
      uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0xb6b4,0xb6b4);
      wVar10 = 0xb6b4;
      uVar22 = qb3f_83((word)uVar22,0xb6b4,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb6b4);
      uVar22 = qb3f_71((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb6b4);
      wVar14 = qb3d_34((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb6b4);
      wVar6 = DAT_2000_b5e4;
      uVar22 = qb3f_71(wVar14,DAT_2000_b5e4,wVar10,0xb2aa,0xb6b4);
      uVar22 = qb3f_57((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb6b4);
      wVar6 = 0xb2aa;
      uVar22 = qb3f_95((word)uVar22,0xb2aa,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb6b4);
      wVar10 = 0x1a;
      uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb6b4);
      uVar22 = qb3f_85((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb6b4);
      uVar23 = qb3f_7d((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb2aa,wVar6);
      wVar14 = (word)(uVar23 >> 0x10);
      unaff_DI = (undefined2 *)0xd1ec;
      do {
        uVar22 = qb3f_9f((word)uVar23,wVar10,(word)(uVar23 >> 0x10),wVar14,(word)unaff_DI);
        uVar16 = in_AF;
        if (!(bool)in_AF && !(bool)uVar17) {
          uVar22 = qb3d_34((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),wVar14,(word)unaff_DI);
          uVar22 = qb3f_91((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),wVar14,0xd1f0);
          wVar10 = 0x1a;
          uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),wVar14,0xd1f0);
          wVar14 = wVar6;
          uVar22 = qb3f_83((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),wVar6,0xd1f0);
          uVar22 = qb3f_81((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),wVar6,0xbd1e);
          uVar22 = qb3f_7d((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),wVar6,wVar14);
          wVar6 = wVar14;
          uVar16 = in_AF;
        }
        in_AF = bVar18;
        unaff_DI = (undefined2 *)0xb7fa;
        uVar22 = qb3f_9f((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb6f4,0xb7fa);
        wVar11 = (word)((ulong)uVar22 >> 0x10);
        if (!(bool)uVar17) {
          wVar6 = 0xb2aa;
          uVar23 = qb3f_a7((word)uVar22,wVar10,wVar11,0xb2aa,0xb7fa);
          if (!(bool)uVar16) goto LAB_1000_9d4c;
          goto LAB_1000_9d44;
        }
        wVar14 = 0xb2aa;
        uVar22 = qb3f_ab((word)uVar22,wVar10,wVar11,0xb2aa,0xb7fa);
        piVar1 = (int *)(unaff_BP + -0x7a08);
        iVar8 = *piVar1;
        *piVar1 = *piVar1 + wVar6;
        uVar17 = *piVar1 == 0;
        in_AF = 9 < ((byte)uVar22 & 0xf) | in_AF;
        bVar18 = (byte)uVar22 + in_AF * -6;
        bVar5 = bVar18 & 0xf;
        uVar4 = CONCAT11((char)((ulong)uVar22 >> 8) - in_AF,bVar18);
        uVar23 = CONCAT22((int)((ulong)uVar22 >> 0x10),uVar4) & 0xffffff0f;
        bVar18 = in_AF;
      } while (SCARRY2(iVar8,wVar6) == *piVar1 < 0);
      *(byte *)0xb7fa = bVar5;
      uVar23 = CONCAT22(CONCAT11((char)((ulong)uVar22 >> 0x18),0xe8),uVar4) & 0xffffff0f;
      unaff_BP = unaff_BP + wVar6;
      pbVar3 = (byte *)(wVar10 + 0xb2aa);
      uVar16 = 0;
      *pbVar3 = *pbVar3 | bVar5;
      uVar17 = *pbVar3 == 0;
LAB_1000_9d44:
      unaff_DI = (undefined2 *)0xb2aa;
      wVar6 = 0xb7ee;
      uVar23 = qb3f_7b((word)uVar23,wVar10,(word)(uVar23 >> 0x10),0xb7ee,0xb2aa);
LAB_1000_9d4c:
      uVar22 = qb3e_42((word)uVar23,7,(word)(uVar23 >> 0x10),wVar6,(word)unaff_DI);
      wVar14 = 1;
      uVar22 = qb3e_44((word)uVar22,1,(word)((ulong)uVar22 >> 0x10),wVar6,(word)unaff_DI);
      uVar22 = qb3f_a7((word)uVar22,wVar14,(word)((ulong)uVar22 >> 0x10),0xb2aa,(word)unaff_DI);
      wVar6 = (word)((ulong)uVar22 >> 0x10);
      if ((bool)uVar17) {
        uVar22 = qb3f_bc((word)uVar22,wVar14,wVar6,0xb2aa,(word)unaff_DI);
        puVar12 = (undefined *)&lit_IT_MISSED;
        uVar22 = qb3f_6e((word)uVar22,0xd1f4,(word)((ulong)uVar22 >> 0x10),0xb2aa,(word)unaff_DI);
        qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb2aa,(word)unaff_DI);
      }
      else {
        wVar11 = 0xbd1e;
        wVar10 = 0xb6dc;
        wVar6 = qb3f_9f((word)uVar22,wVar14,wVar6,0xb6dc,0xbd1e);
        puVar12 = (undefined *)0x0;
        if ((bool)uVar17) {
          puVar12 = (undefined *)0xffff;
        }
        uVar7 = 0;
        if (DAT_2000_b640 == 2) {
          uVar7 = 0xffff;
        }
        uVar16 = (uVar7 & (uint)puVar12) == 0;
        if ((bool)uVar16) {
          uVar23 = (ulong)wVar6;
        }
        else {
          uVar22 = qb3f_8f(wVar6,(word)puVar12,uVar7 & (uint)puVar12,0xb4f2,0xbba6);
          wVar6 = 0x1a;
          uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0xb4f2,0xbba6);
          wVar10 = 0xb2aa;
          uVar22 = qb3f_83((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xbba6);
          wVar11 = 0xb2aa;
          uVar22 = qb3f_7d((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb2aa);
          uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb2aa);
          puVar12 = (undefined *)&lit_SQUASH;
          uVar22 = qb3f_6e((word)uVar22,0xd210,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb2aa);
          uVar23 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb2aa,0xb2aa);
          DAT_2000_b730 = 1;
        }
        uVar22 = qb3f_bc((word)uVar23,(word)puVar12,(word)(uVar23 >> 0x10),wVar10,wVar11);
        uVar22 = qb3f_6a((word)uVar22,0xd21c,(word)((ulong)uVar22 >> 0x10),wVar10,wVar11);
        wVar14 = 0xb2aa;
        wVar6 = qb3f_67((word)uVar22,0xb2aa,(word)((ulong)uVar22 >> 0x10),wVar10,wVar11);
        puVar12 = (undefined *)&lit_POINTS;
        uVar22 = qb3f_6e(wVar6,0xd226,wVar14,wVar10,wVar11);
        uVar22 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),wVar10,wVar11);
        wVar6 = (word)((ulong)uVar22 >> 0x10);
        uVar22 = qb3f_97((word)uVar22,(word)puVar12,wVar6,0xb4f2,wVar6);
        uVar22 = qb3f_7d((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb4f2,0xb4f2);
        uVar22 = qb3e_42((word)uVar22,0x14,(word)((ulong)uVar22 >> 0x10),0xb4f2,0xb4f2);
        puVar12 = (undefined *)0x1;
        uVar22 = qb3e_44((word)uVar22,1,(word)((ulong)uVar22 >> 0x10),0xb4f2,0xb4f2);
        unaff_DI = (undefined2 *)0xbb6c;
        uVar22 = qb3f_9f((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb6f4,0xbb6c);
        if ((bool)uVar16) {
          wVar14 = 0xbb6c;
          wVar6 = qb3f_90((word)uVar22,0xbb6c,(word)((ulong)uVar22 >> 0x10),0xb4e2,0xd232);
          wVar10 = 0x16;
          uVar22 = qb3d_04(wVar6,0x16,wVar14,0xb4e2,0xd232);
          uVar22 = qb3f_7e((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb4e2,0xb4e2);
          uVar22 = qb3f_7f((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xb7d0);
          uVar22 = qb3f_7d((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xb4ea);
          uVar22 = qb3d_34((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xb4ea);
          wVar14 = 0xb4ea;
          uVar22 = qb3f_91((word)uVar22,0xb4ea,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xbe6e);
          wVar6 = 0x1a;
          uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xbe6e);
          uVar22 = qb3f_9b((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xbe6e);
          wVar10 = 0xb4ee;
          uVar22 = qb3f_99((word)uVar22,0xb4ee,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xb59e);
          uVar22 = qb3f_81((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xb7f6);
          wVar6 = wVar10;
          uVar22 = qb3f_7d((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb4ee,wVar10);
          uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4ee,wVar10);
          uVar22 = qb3d_34((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4ee,wVar10);
          wVar10 = (word)((ulong)uVar22 >> 0x10);
          uVar22 = qb3f_91((word)uVar22,wVar6,wVar10,0xb4ee,wVar10);
          wVar6 = 0x1a;
          uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0xb4ee,wVar10);
          unaff_DI = (undefined2 *)0xd0fc;
          uVar22 = qb3f_81((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xd0fc);
          uVar22 = qb3f_77((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xd0fc);
          uVar16 = 0xa01f < wVar6 * 4;
          wVar6 = wVar6 * 4 + 0x5fe0;
          uVar22 = qb3f_6e((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xd0fc);
          uVar22 = qb3e_79((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xd0fc);
          uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xd0fc);
          puVar12 = (undefined *)&lit_LEVEL_DRAINED;
          uVar22 = qb3f_6e((word)uVar22,0xd23a,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xd0fc);
          uVar22 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb4ee,0xd0fc);
          uVar22 = qb3f_a7((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),wVar14,0xd0fc);
          if (!(bool)uVar16) {
            uVar22 = FUN_1000_b308();
          }
        }
        uVar16 = DAT_2000_b640 < 2;
        bVar21 = DAT_2000_b640 == 2;
        if (bVar21) {
          uVar22 = qb3f_9f((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb6dc,0xbd2a);
          puVar12 = (undefined *)0x0;
          if (bVar21) {
            puVar12 = (undefined *)0xffff;
          }
          wVar6 = qb3f_9f((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xbe76);
          uVar7 = 0;
          if ((bool)uVar16) {
            uVar7 = 0xffff;
          }
          uVar16 = 0;
          uVar17 = (uVar7 & (uint)puVar12) == 0;
          if ((bool)uVar17) {
            uVar23 = (ulong)wVar6;
          }
          else {
            uVar22 = qb3f_bc(wVar6,(word)puVar12,uVar7 & (uint)puVar12,0xb4ea,0xbe76);
            puVar12 = (undefined *)&lit_YOU_FEEL_UNHEALTHY;
            uVar22 = qb3f_6e((word)uVar22,0xd24c,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xbe76);
            uVar22 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb4ea,0xbe76)
            ;
            uVar22 = qb3f_7f((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0x1fa2,0xcc42)
            ;
            qb3f_7d((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0x1fa2,0x1fa2);
            uVar23 = FUN_1000_2f43();
            DAT_2000_b730 = 1;
          }
          uVar22 = qb3f_9f((word)uVar23,(word)puVar12,(word)(uVar23 >> 0x10),0xb6f4,0xbb6c);
          if ((bool)uVar17) {
            uVar22 = qb3f_7f((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0x1f96,0xb7d0)
            ;
            uVar22 = qb3f_7d((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0x1f96,0x1f96)
            ;
            uVar22 = qb3f_bc((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0x1f96,0x1f96)
            ;
            puVar12 = (undefined *)&lit_STRENGTH_DRAINED;
            uVar22 = qb3f_6e((word)uVar22,0xd264,(word)((ulong)uVar22 >> 0x10),0x1f96,0x1f96);
            qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0x1f96,0x1f96);
            uVar22 = FUN_1000_2f43();
            DAT_2000_b730 = 1;
          }
          unaff_DI = (undefined2 *)&DAT_2000_b7f2;
          uVar22 = qb3f_9f((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb6dc,0xb7f2);
          if ((bool)uVar17) {
            uVar22 = qb3f_bc((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb6dc,0xb7f2)
            ;
            puVar12 = (undefined *)&lit_YOU_FEEL_SICK;
            uVar22 = qb3f_6e((word)uVar22,0xd27a,(word)((ulong)uVar22 >> 0x10),0xb6dc,0xb7f2);
            uVar22 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb6dc,0xb7f2)
            ;
            uVar22 = qb3f_bc((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb6dc,0xb7f2)
            ;
            puVar12 = (undefined *)&lit_AGILITY_IS_DRAINED;
            uVar22 = qb3f_6e((word)uVar22,0xd28c,(word)((ulong)uVar22 >> 0x10),0xb6dc,0xb7f2);
            uVar22 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb6dc,0xb7f2)
            ;
            DAT_2000_b730 = 1;
            uVar22 = qb3f_7b((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb7f6,0x1ba2)
            ;
            uVar22 = qb3f_7f((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0x1fa6,0xb7d0)
            ;
            unaff_DI = (undefined2 *)0x1fa6;
            qb3f_7d((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0x1fa6,0x1fa6);
            FUN_1000_2f43();
          }
        }
      }
    }
    else {
      DAT_2000_b6cc = DAT_2000_b6cc + -1;
      uVar22 = qb3e_42((word)uVar22,7,wVar6,unaff_SI,(word)unaff_DI);
      wVar6 = 1;
      uVar22 = qb3e_44((word)uVar22,1,(word)((ulong)uVar22 >> 0x10),unaff_SI,(word)unaff_DI);
      uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),unaff_SI,(word)unaff_DI);
      puVar12 = (undefined *)&lit_IT_CAN_T_STRIKE;
      uVar22 = qb3f_6e((word)uVar22,0xd1b2,(word)((ulong)uVar22 >> 0x10),unaff_SI,(word)unaff_DI);
      qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),unaff_SI,(word)unaff_DI);
    }
    uVar22 = FUN_1000_3b02();
    uVar22 = qb3f_a7((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb4ea,(word)unaff_DI)
    ;
    wVar6 = 0;
    if ((bool)uVar16) {
      wVar6 = 0xffff;
    }
    unaff_SI = 0xb4f2;
    uVar7 = qb3f_a7((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)unaff_DI);
    iVar8 = 0;
    if ((bool)uVar16) {
      iVar8 = -1;
    }
    if (iVar8 != 0 || wVar6 != 0) {
      FUN_1000_a013();
      return;
    }
    if (DAT_2000_b730 == 1) {
      FUN_1000_2f1a();
      uVar23 = FUN_1000_2fcb();
      DAT_2000_b730 = 0;
    }
    else {
      uVar23 = (ulong)uVar7;
    }
    wVar6 = 0;
    if (DAT_2000_b732 == 0) {
      wVar6 = 0xffff;
    }
    wVar14 = qb3d_34((word)uVar23,wVar6,(word)(uVar23 >> 0x10),0xb4f2,(word)unaff_DI);
    uVar16 = (char *)0xfff2 < DAT_2000_b6f8;
    pcVar9 = DAT_2000_b6f8 + 0xd;
    uVar17 = pcVar9 == (char *)0x0;
    uVar22 = qb3f_71(wVar14,(word)pcVar9,wVar6,0xb4f2,(word)unaff_DI);
    uVar22 = qb3f_57((word)uVar22,(word)pcVar9,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)unaff_DI);
    uVar22 = qb3f_95((word)uVar22,(word)pcVar9,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)unaff_DI);
    wVar6 = 0x1a;
    uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)unaff_DI);
    uVar22 = qb3f_81((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,0xb7f6);
    unaff_DI = (undefined2 *)0x1fa6;
    uVar22 = qb3f_a1((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,0x1fa6);
    uVar7 = (uint)((ulong)uVar22 >> 0x10);
    uVar13 = 0;
    if (!(bool)uVar16 && !(bool)uVar17) {
      uVar13 = 0xffff;
    }
    in_BX = (char *)(uVar13 & uVar7);
    uVar16 = 0;
    if (in_BX == (char *)0x0) break;
    DAT_2000_b732 = 1;
  } while( true );
  DAT_2000_b732 = 0;
  uVar22 = qb3d_43((word)uVar22,0,uVar7,0xb4f2,0x1fa6);
  pcVar9 = (char *)0xb71a;
  uVar22 = qb3f_7d((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0xb4f2,0xb71a);
  do {
    uVar17 = uVar16;
    uVar22 = qb3d_43((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),unaff_SI,(word)pcVar9);
    uVar22 = qb3f_7d((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),unaff_SI,0xb71e);
    pcVar9 = (char *)0xb71e;
    unaff_SI = 0xb71a;
    uVar22 = qb3f_7f((word)uVar22,0xb71e,(word)((ulong)uVar22 >> 0x10),0xb71a,0xb7f6);
    in_BX = pcVar9;
    uVar22 = qb3f_a1((word)uVar22,(word)pcVar9,(word)((ulong)uVar22 >> 0x10),0xb71a,(word)pcVar9);
    uVar16 = 1;
  } while ((bool)uVar17);
  uVar16 = 0;
LAB_1000_84c1:
  while( true ) {
    uVar22 = qb3f_a7((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0xb4ea,(word)pcVar9);
    wVar6 = 0;
    if ((bool)uVar16) {
      wVar6 = 0xffff;
    }
    wVar14 = 0xb4f2;
    qb3f_a7((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    iVar8 = 0;
    if ((bool)uVar16) {
      iVar8 = -1;
    }
    if (iVar8 != 0 || wVar6 != 0) {
      FUN_1000_a013();
      return;
    }
    if (DAT_2000_b702 == 1) {
      DAT_2000_b702 = 0;
      DAT_2000_b536 = 0xffff;
      FUN_1000_8fea();
      FUN_1000_4275();
      FUN_1000_580f();
      FUN_1000_7fc8();
    }
    uVar17 = DAT_2000_b704 == 0;
    uVar16 = DAT_2000_b704 == 1;
    if ((bool)uVar16) {
      FUN_1000_4abd();
      DAT_2000_b704 = 0;
    }
    FUN_1000_7f43();
    uVar22 = FUN_1000_49d1();
    uVar22 = qb3e_42((word)uVar22,0x18,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar10 = 1;
    uVar22 = qb3e_44((word)uVar22,1,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar6 = qb3f_bc((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    puVar12 = (undefined *)&lit_EXP_VALUE;
    uVar22 = qb3f_6a(wVar6,0xd018,wVar10,0xb4f2,(word)pcVar9);
    uVar22 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3e_42((word)uVar22,0x19,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar10 = 3;
    uVar22 = qb3e_44((word)uVar22,3,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3f_bc((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar6 = 0xb6fa;
    uVar22 = qb3f_68((word)uVar22,0xb6fa,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3e_79((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar6 = wVar10;
    uVar22 = qb3e_42((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar11 = (word)((ulong)uVar22 >> 0x10);
    uVar22 = qb3e_44((word)uVar22,wVar11,wVar6,0xb4f2,(word)pcVar9);
    uVar22 = qb3f_bc((word)uVar22,wVar11,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    qb3f_6a((word)uVar22,0xd028,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar6 = 0x15;
    uVar22 = qb3d_0d(0x15,0x15,dx,0xb4f2,(word)pcVar9);
    uVar22 = qb3f_6a((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3e_79((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3e_42((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar6 = (word)uVar22;
    uVar22 = qb3e_44(wVar6,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar6 = 0xb4f2;
    uVar22 = qb3f_6b((word)uVar22,0xb4f2,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3e_79((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3f_6a((word)uVar22,0xd040,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar6 = 0x16;
    uVar22 = qb3d_0d((word)uVar22,0x16,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3f_6a((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3e_79((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3e_42((word)uVar22,4,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar6 = (word)uVar22;
    uVar22 = qb3e_44(wVar6,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    wVar6 = 0xb6e4;
    uVar22 = qb3f_6b((word)uVar22,0xb6e4,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    uVar22 = qb3e_79((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb4f2,(word)pcVar9);
    DAT_2000_b536 = 0;
    do {
      uVar22 = qb3d_43((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),wVar14,(word)pcVar9);
      uVar22 = qb3f_7d((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),wVar14,0xb6d8);
      uVar22 = qb3f_9f((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0x1bc2,0xb6d8);
      uVar7 = 0;
      if ((bool)uVar17) {
        uVar7 = 0xffff;
        uVar16 = 0;
      }
      uVar22 = qb3d_43((word)uVar22,uVar7,(word)((ulong)uVar22 >> 0x10),0x1bc2,0xb6d8);
      wVar6 = qb3f_9b((word)uVar22,uVar7,(word)((ulong)uVar22 >> 0x10),0x1bc2,0xb6d8);
      uVar22 = qb3f_a1(wVar6,uVar7,0x1bc2,0x1bc2,0xd056);
      wVar6 = (word)((ulong)uVar22 >> 0x10);
      uVar13 = 0;
      if (!(bool)uVar17 && !(bool)uVar16) {
        uVar13 = 0xffff;
      }
      bVar21 = false;
      uVar13 = uVar13 | uVar7;
      bVar19 = uVar13 == 0;
      uVar22 = qb3f_a7((word)uVar22,uVar7,wVar6,wVar6,0xd056);
      wVar6 = (word)((ulong)uVar22 >> 0x10);
      uVar7 = 0;
      if (!bVar21 && !bVar19) {
        uVar7 = 0xffff;
      }
      uVar16 = 0;
      uVar17 = (uVar7 & uVar13) == 0;
      if ((bool)uVar17) {
        wVar14 = 0;
      }
      else {
        uVar22 = qb3f_7b((word)uVar22,uVar7 & uVar13,wVar6,0xbc2a,wVar6);
        uVar22 = qb3e_42((word)uVar22,7,(word)((ulong)uVar22 >> 0x10),0xbc2a,wVar6);
        wVar14 = 0x14;
        uVar22 = qb3e_44((word)uVar22,0x14,(word)((ulong)uVar22 >> 0x10),0xbc2a,wVar6);
        uVar22 = qb3f_bc((word)uVar22,wVar14,(word)((ulong)uVar22 >> 0x10),0xbc2a,wVar6);
        wVar14 = 0xe;
        uVar22 = qb3d_0d((word)uVar22,0xe,(word)((ulong)uVar22 >> 0x10),0xbc2a,wVar6);
        uVar22 = qb3f_6a((word)uVar22,wVar14,(word)((ulong)uVar22 >> 0x10),0xbc2a,wVar6);
        uVar22 = qb3e_79((word)uVar22,wVar14,(word)((ulong)uVar22 >> 0x10),0xbc2a,wVar6);
      }
      uVar22 = qb3f_9f((word)uVar22,wVar14,(word)((ulong)uVar22 >> 0x10),0x1bc6,0xb6d8);
      uVar7 = 0;
      if ((bool)uVar16) {
        uVar7 = 0xffff;
        uVar17 = 0;
      }
      uVar22 = qb3d_43((word)uVar22,uVar7,(word)((ulong)uVar22 >> 0x10),0x1bc6,0xb6d8);
      wVar6 = qb3f_9b((word)uVar22,uVar7,(word)((ulong)uVar22 >> 0x10),0x1bc6,0xb6d8);
      uVar22 = qb3f_a1(wVar6,uVar7,0x1bc6,0x1bc6,0xd056);
      wVar6 = (word)((ulong)uVar22 >> 0x10);
      uVar13 = 0;
      if (!(bool)uVar16 && !(bool)uVar17) {
        uVar13 = 0xffff;
      }
      bVar21 = false;
      uVar13 = uVar13 | uVar7;
      bVar19 = uVar13 == 0;
      uVar22 = qb3f_a7((word)uVar22,uVar7,wVar6,wVar6,0xd056);
      wVar6 = (word)((ulong)uVar22 >> 0x10);
      uVar7 = 0;
      if (!bVar21 && !bVar19) {
        uVar7 = 0xffff;
      }
      wVar14 = uVar7 & uVar13;
      uVar16 = 0;
      uVar17 = wVar14 == 0;
      if ((bool)uVar17) {
        wVar6 = 0;
      }
      else {
        uVar22 = qb3f_7b((word)uVar22,wVar14,wVar6,0xbc2a,wVar6);
        uVar22 = qb3f_7b((word)uVar22,wVar14,(word)((ulong)uVar22 >> 0x10),0xbc2a,0xb706);
        uVar22 = qb3e_42((word)uVar22,6,(word)((ulong)uVar22 >> 0x10),0xbc2a,0xb706);
        wVar6 = 0x14;
        uVar22 = qb3e_44((word)uVar22,0x14,(word)((ulong)uVar22 >> 0x10),0xbc2a,0xb706);
        uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xbc2a,0xb706);
        uVar22 = qb3d_0d((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xbc2a,0xb706);
        uVar22 = qb3f_6a((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xbc2a,0xb706);
        uVar22 = qb3e_79((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xbc2a,0xb706);
      }
      uVar22 = qb3f_9f((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0x1bca,0xb6d8);
      uVar7 = 0;
      if ((bool)uVar16) {
        uVar7 = 0xffff;
        uVar17 = 0;
      }
      uVar22 = qb3d_43((word)uVar22,uVar7,(word)((ulong)uVar22 >> 0x10),0x1bca,0xb6d8);
      wVar6 = qb3f_9b((word)uVar22,uVar7,(word)((ulong)uVar22 >> 0x10),0x1bca,0xb6d8);
      pcVar9 = (char *)s_ITS_HEALTH_POINTS__2000_d044 + 0x12;
      uVar22 = qb3f_a1(wVar6,uVar7,0x1bca,0x1bca,0xd056);
      wVar14 = (word)((ulong)uVar22 >> 0x10);
      uVar13 = 0;
      if (!(bool)uVar16 && !(bool)uVar17) {
        uVar13 = 0xffff;
      }
      bVar21 = false;
      uVar13 = uVar13 | uVar7;
      bVar19 = uVar13 == 0;
      uVar22 = qb3f_a7((word)uVar22,uVar7,wVar14,wVar14,0xd056);
      wVar6 = (word)((ulong)uVar22 >> 0x10);
      uVar7 = 0;
      if (!bVar21 && !bVar19) {
        uVar7 = 0xffff;
      }
      wVar10 = uVar7 & uVar13;
      uVar17 = 0;
      uVar20 = wVar10 == 0;
      if ((bool)uVar20) {
        wVar6 = 0;
      }
      else {
        uVar22 = qb3f_7b((word)uVar22,wVar10,wVar6,0xbc2a,wVar6);
        wVar14 = 0x1fa6;
        uVar22 = qb3f_7f((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0x1fa6,0xd05a);
        pcVar9 = (char *)0x1fa6;
        uVar22 = qb3f_7d((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0x1fa6,0x1fa6);
        uVar22 = qb3e_42((word)uVar22,5,(word)((ulong)uVar22 >> 0x10),0x1fa6,0x1fa6);
        wVar6 = 0x14;
        uVar22 = qb3e_44((word)uVar22,0x14,(word)((ulong)uVar22 >> 0x10),0x1fa6,0x1fa6);
        uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0x1fa6,0x1fa6);
        uVar22 = qb3d_0d((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0x1fa6,0x1fa6);
        uVar22 = qb3f_6e((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0x1fa6,0x1fa6);
        qb3e_79((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0x1fa6,0x1fa6);
      }
      uVar22 = FUN_1000_7eec();
      wVar10 = qb3d_06((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),wVar14,(word)pcVar9);
      qb3f_61(wVar10,wVar6,0xb49c,wVar14,(word)pcVar9);
      wVar6 = 0xbc1a;
      uVar22 = qb3f_62(ax,0xbc1a,ax,wVar14,(word)pcVar9);
      uVar16 = 1;
    } while ((bool)uVar20);
    DAT_2000_b54c = 0;
    FUN_1000_10be();
    uVar22 = FUN_1000_2f87();
    uVar22 = qb3f_7b((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xd05e,0xb51c);
    uVar22 = qb3f_7b((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xd05e,0xb512);
    qb3f_7b((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb7f6,0xb50e);
    uVar22 = FUN_1000_09e8();
    uVar22 = qb3f_7b((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb7ee,0xb4fa);
    wVar14 = 0xb512;
    uVar22 = qb3f_9f((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb512,0xb7f6);
    if ((bool)uVar20) {
      uVar22 = FUN_1000_54cb();
      wVar10 = (word)uVar22;
      if (DAT_2000_b5d8 == 1) {
        uVar16 = 1;
        uVar17 = 0;
        goto LAB_1000_8f70;
      }
    }
    uVar16 = 0;
    qb3f_7b((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb69c,0xb530);
    uVar22 = FUN_1000_6fbd();
    wVar6 = DAT_2000_b698;
    uVar22 = qb3f_57((word)uVar22,DAT_2000_b698,(word)((ulong)uVar22 >> 0x10),0xb69c,0xb530);
    wVar6 = qb3f_a1((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb69c,0xb4ca);
    wVar14 = 0;
    if (!(bool)uVar16) {
      wVar14 = 0xffff;
      uVar16 = 0;
    }
    wVar10 = DAT_2000_b69a;
    uVar22 = qb3f_57(wVar6,DAT_2000_b69a,wVar14,0xb69c,0xb4ca);
    uVar22 = qb3f_a1((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb69c,0xb4d2);
    wVar6 = (word)((ulong)uVar22 >> 0x10);
    iVar8 = 0;
    if (!(bool)uVar16) {
      iVar8 = -1;
    }
    bVar21 = iVar8 == 0 && wVar6 == 0;
    if (iVar8 != 0 || wVar6 != 0) {
      FUN_1000_8e76();
      return;
    }
    wVar14 = 0xb51c;
    qb3f_9f((word)uVar22,0,wVar6,0xb51c,0xb7f6);
    if (bVar21) {
      FUN_1000_9a2f();
      return;
    }
    wVar6 = qb3f_62(0xb49c,0xb8a6,dx_00,0xb51c,0xb7f6);
    wVar10 = 0;
    if (bVar21) {
      wVar10 = 0xffff;
    }
    bVar21 = false;
    uVar22 = qb3f_62(wVar6,0xb4b0,wVar10,0xb51c,0xb7f6);
    wVar6 = (word)((ulong)uVar22 >> 0x10);
    iVar8 = 0;
    if (bVar21) {
      iVar8 = -1;
    }
    uVar16 = 0;
    uVar17 = iVar8 == 0 && wVar6 == 0;
    if (iVar8 != 0 || wVar6 != 0) {
      qb3f_61((word)uVar22,0xd062,0xb70a,0xb51c,0xb7f6);
      FUN_1000_c33b();
      DAT_2000_b702 = 1;
      FUN_1000_6baf();
      wVar6 = extraout_DX;
    }
    puVar12 = (undefined *)&lit_S;
    uVar22 = qb3f_62(0xb49c,0xd068,wVar6,0xb51c,0xb7f6);
    wVar6 = (word)((ulong)uVar22 >> 0x10);
    if ((bool)uVar17) {
      wVar14 = 0x1b9a;
      uVar22 = qb3f_9f((word)uVar22,(word)puVar12,wVar6,0x1b9a,0xb7f6);
      if ((bool)uVar17) {
        qb3f_7b((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb7f6,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar6 = extraout_DX_00;
    }
    puVar12 = (undefined *)&lit_M;
    uVar22 = qb3f_62(0xb49c,0xb8ac,wVar6,wVar14,0xb7f6);
    wVar6 = (word)((ulong)uVar22 >> 0x10);
    if ((bool)uVar17) {
      wVar14 = 0x1b9e;
      uVar22 = qb3f_9f((word)uVar22,(word)puVar12,wVar6,0x1b9e,0xb7f6);
      if ((bool)uVar17) {
        qb3f_7b((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb7d8,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar6 = extraout_DX_01;
    }
    puVar12 = (undefined *)&lit_K;
    uVar22 = qb3f_62(0xb49c,0xb8b8,wVar6,wVar14,0xb7f6);
    wVar6 = (word)((ulong)uVar22 >> 0x10);
    if ((bool)uVar17) {
      wVar14 = 0x1b96;
      uVar22 = qb3f_9f((word)uVar22,(word)puVar12,wVar6,0x1b96,0xb7f6);
      if ((bool)uVar17) {
        qb3f_7b((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xbb60,0xb478);
        FUN_1000_89d9();
        return;
      }
      FUN_1000_89b4();
      wVar6 = extraout_DX_02;
    }
    pcVar9 = (char *)0xb7f6;
    qb3f_62(0xb49c,0xb8b2,wVar6,wVar14,0xb7f6);
    wVar6 = extraout_DX_03;
    if ((bool)uVar17) {
      FUN_1000_7ffb();
      DAT_2000_b702 = 1;
      FUN_1000_6baf();
      wVar6 = extraout_DX_04;
    }
    puVar12 = (undefined *)&lit_F;
    uVar22 = qb3f_62(0xb49c,0xd06e,wVar6,wVar14,0xb7f6);
    wVar6 = (word)((ulong)uVar22 >> 0x10);
    if ((bool)uVar17) {
      qb3f_7b((word)uVar22,(word)puVar12,wVar6,0xb802,0xb478);
      FUN_1000_89d9();
      return;
    }
    qb3f_62(0xb49c,0xbc68,wVar6,wVar14,0xb7f6);
    if ((bool)uVar17) {
      DAT_2000_b702 = 1;
      FUN_1000_90d3();
      return;
    }
    qb3f_62(0xb49c,0xb7e0,dx_01,wVar14,0xb7f6);
    if ((bool)uVar17) {
      DAT_2000_b702 = 1;
      FUN_1000_95ba();
      return;
    }
    in_BX = (char *)&lit_T;
    qb3f_62(0xb49c,0xbcca,dx_02,wVar14,0xb7f6);
    if (!(bool)uVar17) break;
    uVar22 = FUN_1000_7c49();
    DAT_2000_b702 = 1;
  }
  DAT_2000_b54c = 0;
  in_BX = (char *)&lit_W;
  uVar22 = qb3f_62(0xb49c,0xbcd0,dx_03,wVar14,0xb7f6);
  if ((bool)uVar17) {
    DAT_2000_b702 = 1;
    uVar22 = qb3e_42((word)uVar22,10,(word)((ulong)uVar22 >> 0x10),wVar14,0xb7f6);
    in_BX = (char *)0x1;
    qb3e_44((word)uVar22,1,(word)((ulong)uVar22 >> 0x10),wVar14,0xb7f6);
    uVar22 = FUN_1000_7aa1();
    wVar10 = (word)((ulong)uVar22 >> 0x10);
    wVar6 = (word)uVar22;
    uVar17 = DAT_2000_b54c == 0;
    uVar16 = DAT_2000_b54c == 1;
    if ((bool)uVar16) {
      wVar10 = qb3e_32(wVar6,0xffff,wVar10,wVar14,0xb7f6);
      DAT_2000_b5d8 = 1;
LAB_1000_8f70:
      puVar12 = (undefined *)&lit_empty;
      qb3f_61(wVar10,0xbb56,0xb49c,wVar14,0xb7f6);
      uVar22 = FUN_1000_340c();
      uVar22 = qb3f_7b((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb7ee,0xb4fa);
      uVar22 = qb3f_7b((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb7ee,0xb50e);
      wVar14 = 0xb7ee;
      uVar22 = qb3f_7b((word)uVar22,0xb7ee,(word)((ulong)uVar22 >> 0x10),0xb7f6,0xb4c2);
      wVar6 = wVar14;
      uVar22 = qb3f_9f((word)uVar22,wVar14,(word)((ulong)uVar22 >> 0x10),0xb6e4,wVar14);
      if (!(bool)uVar17 && !(bool)uVar16) {
        wVar10 = qb3f_75((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb6e4,wVar14);
        qb3f_75(wVar10,wVar6,wVar6,0xb69c,wVar14);
        ((undefined2 *)&DAT_2000_3824)[wVar6] = extraout_DX_05;
      }
      if (DAT_2000_b5d8 != 1) {
        FUN_1000_8fea();
        DAT_2000_b660 = 0;
        DAT_2000_b536 = 1;
        DAT_2000_b702 = 0;
        FUN_1000_58f7();
        FUN_1000_4275();
        return;
      }
      DAT_2000_b5d8 = 0;
      DAT_2000_b702 = 0;
      FUN_1000_4c28();
      return;
    }
    if (DAT_2000_b54c == 2) {
      FUN_1000_8f6a();
      return;
    }
    if (DAT_2000_b54c == 3) {
      uVar16 = 0;
      goto LAB_1000_84c1;
    }
    if (DAT_2000_b54c == 6) {
      uVar22 = qb3f_7f(wVar6,(word)in_BX,wVar10,0xb568,0xbb60);
      qb3f_7d((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0xb568,0xb568);
      FUN_1000_92c8();
      return;
    }
    if (DAT_2000_b54c == 7) {
      uVar22 = qb3f_7f(wVar6,(word)in_BX,wVar10,0xb568,0xbb60);
      qb3f_7d((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0xb568,0xb568);
      FUN_1000_9298();
      return;
    }
    if (DAT_2000_b54c == 8) {
      uVar22 = qb3f_7f(wVar6,(word)in_BX,wVar10,0xb568,0xbb6c);
      qb3f_7d((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0xb568,0xb568);
      FUN_1000_93e9();
      return;
    }
    uVar16 = DAT_2000_b54c < 9;
    if (DAT_2000_b54c == 9) goto LAB_1000_84c1;
  }
  uVar17 = 0;
  uVar22 = qb3d_43((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),wVar14,0xb7f6);
  uVar22 = qb3f_a3((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0x1bc2,0xb7f6);
  if (!(bool)uVar16 && !(bool)uVar17) {
    in_BX = (char *)&lit_B;
    uVar22 = qb3f_62(0xb49c,0xca72,(word)((ulong)uVar22 >> 0x10),0x1bc2,0xb7f6);
    if ((bool)uVar17) {
      uVar22 = qb3d_34((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0x1bc2,0xb7f6);
      uVar22 = qb3f_91((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0x1bc2,0xcc52);
      wVar6 = 0x1a;
      uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0x1bc2,0xcc52);
      uVar22 = qb3f_81((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0x1bc2,0xbe6e);
      uVar22 = qb3f_7d((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0x1bc2,0xb574);
      uVar22 = qb3f_97((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb6e4,0xb574);
      wVar10 = 0xb6e4;
      wVar14 = 0xb574;
      wVar6 = qb3f_7d((word)uVar22,0xb574,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      uVar22 = qb3e_42(wVar6,0xb,wVar14,0xb574,0xb6e4);
      wVar6 = 1;
      uVar22 = qb3e_44((word)uVar22,1,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      wVar14 = 0x19;
      uVar22 = qb3d_0d(0x19,0x19,dx_04,0xb574,0xb6e4);
      uVar22 = qb3f_6e((word)uVar22,wVar14,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      uVar22 = qb3e_79((word)uVar22,wVar14,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      uVar22 = qb3e_42((word)uVar22,10,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      uVar22 = qb3e_44((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      wVar6 = (word)uVar22;
      uVar22 = qb3d_0d(wVar6,wVar6,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      uVar22 = qb3f_6e((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      uVar22 = qb3e_79((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb574,0xb6e4);
      wVar14 = (word)((ulong)uVar22 >> 0x10);
      qb3f_a7((word)uVar22,wVar6,wVar14,wVar14,0xb6e4);
      wVar6 = 0;
      if ((bool)uVar17) {
        wVar6 = 0xffff;
      }
      bVar21 = false;
      puVar12 = (undefined *)&lit_B;
      uVar22 = qb3f_62(0xb49c,0xca72,wVar6,wVar14,0xb6e4);
      uVar13 = (uint)((ulong)uVar22 >> 0x10);
      uVar7 = 0;
      if (!bVar21) {
        uVar7 = 0xffff;
      }
      uVar16 = 0;
      uVar17 = (uVar7 & uVar13) == 0;
      if (!(bool)uVar17) {
        uVar22 = qb3f_bc((word)uVar22,(word)puVar12,uVar13,wVar14,0xb6e4);
        uVar22 = qb3d_34((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),wVar14,0xb6e4);
        uVar22 = qb3f_91((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),wVar14,0xbb6c);
        wVar6 = 0x1a;
        uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),wVar14,0xbb6c);
        wVar10 = 0xb7f6;
        uVar22 = qb3f_81((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),wVar14,0xb7f6);
        uVar22 = qb3f_77((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),wVar14,0xb7f6);
        uVar16 = 0xa01f < wVar6 * 4;
        puVar12 = (undefined *)(wVar6 * 4 + 0x5fe0);
        uVar17 = puVar12 == (undefined *)0x0;
        uVar22 = qb3f_6e((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),wVar14,0xb7f6);
        uVar22 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),wVar14,0xb7f6);
      }
      uVar22 = qb3f_a7((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb574,wVar10);
      if (!(bool)uVar16 && !(bool)uVar17) {
        uVar22 = qb3f_bc((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb574,wVar10);
        uVar22 = qb3d_34((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb574,wVar10);
        wVar14 = 0xb574;
        wVar6 = qb3f_91((word)uVar22,0xb574,(word)((ulong)uVar22 >> 0x10),0xb574,0xbb6c);
        wVar10 = 0x1a;
        uVar22 = qb3d_03(wVar6,0x1a,wVar14,0xb574,0xbb6c);
        uVar22 = qb3f_81((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb574,0xb7fa);
        uVar22 = qb3f_77((word)uVar22,wVar10,(word)((ulong)uVar22 >> 0x10),0xb574,0xb7fa);
        uVar16 = 0xa01f < wVar10 * 4;
        wVar6 = wVar10 * 4 + 0x5fe0;
        uVar17 = wVar6 == 0;
        uVar22 = qb3f_6e((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb574,0xb7fa);
        uVar22 = qb3e_79((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb574,0xb7fa);
        uVar22 = qb3e_42((word)uVar22,10,(word)((ulong)uVar22 >> 0x10),0xb574,0xb7fa);
        wVar6 = 1;
        uVar22 = qb3e_44((word)uVar22,1,(word)((ulong)uVar22 >> 0x10),0xb574,0xb7fa);
        uVar22 = qb3f_bc((word)uVar22,wVar6,(word)((ulong)uVar22 >> 0x10),0xb574,0xb7fa);
        uVar22 = qb3f_6a((word)uVar22,0xd0a6,(word)((ulong)uVar22 >> 0x10),0xb574,0xb7fa);
        wVar6 = (word)((ulong)uVar22 >> 0x10);
        uVar22 = qb3f_67((word)uVar22,wVar6,wVar6,0xb574,0xb7fa);
        puVar12 = (undefined *)&lit_POINT;
        uVar22 = qb3f_6a((word)uVar22,0xd0b2,(word)((ulong)uVar22 >> 0x10),0xb574,0xb7fa);
        uVar22 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb574,0xb7fa);
        wVar6 = (word)((ulong)uVar22 >> 0x10);
        uVar22 = qb3f_9f((word)uVar22,(word)puVar12,wVar6,wVar6,0xb7f6);
        wVar14 = (word)((ulong)uVar22 >> 0x10);
        if ((bool)uVar16 || (bool)uVar17) {
          uVar22 = qb3f_bc((word)uVar22,(word)puVar12,wVar14,wVar6,0xb7f6);
          puVar12 = (undefined *)&lit_empty;
          uVar22 = qb3f_6e((word)uVar22,0xc910,(word)((ulong)uVar22 >> 0x10),wVar6,0xb7f6);
          uVar22 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),wVar6,0xb7f6);
        }
        else {
          uVar22 = qb3f_bc((word)uVar22,(word)puVar12,wVar14,wVar6,0xb7f6);
          puVar12 = (undefined *)&lit_S;
          uVar22 = qb3f_6e((word)uVar22,0xd0bc,(word)((ulong)uVar22 >> 0x10),wVar6,0xb7f6);
          uVar22 = qb3e_79((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),wVar6,0xb7f6);
        }
      }
      wVar6 = 0xb7ee;
      uVar22 = qb3f_7b((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb7ee,0xb574);
      uVar22 = qb3d_43((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb7ee,0xb574);
      di = (undefined *)0xb71a;
      uVar22 = qb3f_7d((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb7ee,0xb71a);
      do {
        uVar22 = qb3d_43((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),wVar6,(word)di);
        uVar22 = qb3f_7d((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),wVar6,0xb71e);
        di = (undefined *)0xb71e;
        wVar6 = 0xb71a;
        uVar22 = qb3f_7f((word)uVar22,0xb71e,(word)((ulong)uVar22 >> 0x10),0xb71a,0xb7f6);
        puVar12 = di;
        uVar22 = qb3f_a1((word)uVar22,(word)di,(word)((ulong)uVar22 >> 0x10),0xb71a,(word)di);
      } while ((bool)uVar16);
      uVar22 = qb3f_9f((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb6e4,0xb7f6);
      if ((bool)uVar16) {
        FUN_1000_a335();
        return;
      }
      uVar22 = qb3d_34((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb6e4,0xb7f6);
      uVar22 = qb3f_91((word)uVar22,(word)puVar12,(word)((ulong)uVar22 >> 0x10),0xb6e4,0xbc26);
      uVar22 = qb3d_03((word)uVar22,0x1a,(word)((ulong)uVar22 >> 0x10),0xb6e4,0xbc26);
      in_BX = DAT_2000_b6f8;
      uVar22 = qb3f_71((word)uVar22,(word)DAT_2000_b6f8,(word)((ulong)uVar22 >> 0x10),0xb6e4,0xbc26)
      ;
      uVar22 = qb3f_57((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0xb6e4,0xbc26);
      uVar22 = qb3f_85((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0xb6e4,0xbc26);
      uVar22 = qb3f_81((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0xb6e4,0xb7f6);
      pcVar9 = (char *)0x1fa6;
      uVar22 = qb3f_a1((word)uVar22,(word)in_BX,(word)((ulong)uVar22 >> 0x10),0xb6e4,0x1fa6);
      if (!(bool)uVar16) {
        FUN_1000_9a2f();
        return;
      }
    }
  }
  goto LAB_1000_84c1;
}


// ==== FUN_1000_a013 @ 1000:a013 (size 565) callers: FUN_1000_803a,FUN_1000_9a2f

void __cdecl16near FUN_1000_a013(void)

{
  word wVar1;
  word dx;
  word dx_00;
  word bx;
  word wVar2;
  undefined *puVar3;
  word bx_00;
  word unaff_SI;
  word unaff_DI;
  char *di;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined1 uVar4;
  undefined4 uVar5;
  undefined4 uVar6;
  
  uVar5 = FUN_1000_05ac();
  uVar5 = qb3e_32((word)uVar5,0xffff,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  uVar5 = qb3e_42((word)uVar5,0xf,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  wVar2 = 1;
  uVar5 = qb3e_44((word)uVar5,1,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  uVar5 = qb3f_bc((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  puVar3 = (undefined *)&lit_YOU_RE_DEAD_HA_HA_HA;
  uVar5 = qb3f_6e((word)uVar5,0xd2a4,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  uVar5 = qb3e_79((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  uVar5 = qb3f_a7((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb4ea,unaff_DI);
  if ((bool)in_CF) {
    unaff_DI = 0xb4ea;
    uVar5 = qb3f_7b((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xd2c0,0xb4ea);
  }
  uVar5 = qb3f_a8((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb4e2,unaff_DI);
  if ((bool)in_CF) {
    uVar5 = qb3f_7c((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xd2c4,0xb4e2);
  }
  uVar5 = qb3f_7b((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xd2c0,0xb4de);
  di = (char *)s_YOU_RE_DEAD_HA_HA_HA___U_2000_d2a8 + 0x18;
  uVar5 = qb3f_9f((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0x6024,0xd2c0);
  if (!(bool)in_CF && !(bool)in_ZF) {
    uVar5 = qb3f_7b((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xd2c0,0x6024);
    uVar5 = qb3f_7f((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0x1fa6,0xbc32);
    di = (char *)0x1fa6;
    uVar5 = qb3f_7d((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0x1fa6,0x1fa6);
  }
  wVar2 = 0x6028;
  uVar5 = qb3f_a7((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0x6028,(word)di);
  if (!(bool)in_CF && !(bool)in_ZF) {
    uVar5 = qb3f_7b((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xbc36,0x6028);
    wVar2 = 0xb520;
    uVar5 = qb3f_7f((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb520,0xbc3a);
    di = (char *)0xb520;
    uVar5 = qb3f_7d((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb520,0xb520);
  }
  uVar5 = qb3d_34((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,(word)di);
  uVar5 = qb3f_ad((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,(word)di);
  puVar3 = (undefined *)0x1a;
  uVar5 = qb3d_03((word)uVar5,0x1a,(word)((ulong)uVar5 >> 0x10),wVar2,(word)di);
  uVar5 = qb3f_81((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7f6);
  uVar5 = qb3f_a1((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7d8);
  if ((bool)in_CF || (bool)in_ZF) {
    uVar5 = qb3d_34((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7d8);
    uVar5 = qb3f_ad((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7d8);
    bx_00 = 0x1a;
    uVar5 = qb3d_03((word)uVar5,0x1a,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7d8);
    uVar5 = qb3f_81((word)uVar5,bx_00,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7f6);
    uVar5 = qb3f_a1((word)uVar5,bx_00,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7f6);
    wVar1 = (word)((ulong)uVar5 >> 0x10);
    if ((bool)in_ZF) {
      uVar5 = qb3f_bc((word)uVar5,bx_00,wVar1,wVar2,0xb7f6);
      puVar3 = (undefined *)&lit_You_ve_been_reincarnated;
      uVar5 = qb3f_6e((word)uVar5,0xd334,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7f6);
      uVar5 = qb3e_79((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7f6);
      uVar5 = qb3f_7b((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb4ee,0xb4f2);
      uVar5 = qb3f_7b((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb7ee,0xb4ea);
      uVar5 = qb3f_7c((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xc1c2,0xb4e2);
      wVar2 = 0xb7f6;
      uVar5 = qb3f_6f((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb4e2);
      while( true ) {
        uVar5 = qb3f_7d((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,0x4e28);
        uVar5 = qb3f_9f((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7fa);
        if (!(bool)in_CF && !(bool)in_ZF) break;
        wVar1 = 0x4e28;
        uVar5 = qb3f_75((word)uVar5,0x4e28,0x4e28,0x4e28,0xb7fa);
        in_CF = 0xe06d < wVar1 * 4;
        wVar2 = wVar1 * 4 + 0x1f92;
        in_ZF = wVar2 == 0;
        uVar5 = qb3d_34((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0x4e28,wVar2);
        uVar5 = qb3f_91((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0x4e28,0xbd26);
        puVar3 = (undefined *)0x1a;
        uVar5 = qb3d_03((word)uVar5,0x1a,(word)((ulong)uVar5 >> 0x10),0x4e28,0xbd26);
        uVar5 = qb3f_81((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0x4e28,0xbb60);
        uVar5 = qb3f_7d((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0x4e28,wVar2);
        wVar2 = (word)((ulong)uVar5 >> 0x10);
        uVar5 = qb3f_7f((word)uVar5,(word)puVar3,wVar2,wVar2,0xb7f6);
      }
      uVar5 = qb3d_34((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7fa);
      uVar5 = qb3f_91((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7fa);
      wVar2 = 0x1a;
      uVar5 = qb3d_03((word)uVar5,0x1a,(word)((ulong)uVar5 >> 0x10),0x4e28,0xb7fa);
      uVar5 = qb3f_7d((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0x4e28,0x52fc);
      uVar5 = qb3f_75((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0x52fc,0x52fc);
      wVar1 = wVar2 * 4 + 0x1f92;
      uVar5 = qb3f_7f((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),wVar1,0xbe6e);
      qb3f_7d((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),wVar1,wVar1);
      uVar5 = FUN_1000_2f3c();
      uVar5 = qb3f_7b((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0xbc22,0xb48c);
      uVar5 = qb3f_7b((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0xbd2a,0xb4ca);
      qb3f_7b((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0xbd2e,0xb4d2);
      FUN_1000_1cf5();
      return;
    }
    uVar5 = qb3f_bc((word)uVar5,bx_00,wVar1,wVar2,0xb7f6);
    puVar3 = (undefined *)&lit_Someone_carries_you_out_and_tries_to;
    uVar5 = qb3f_6e((word)uVar5,0xd2cc,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7f6);
    uVar5 = qb3e_79((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7f6);
    uVar5 = qb3f_bc((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7f6);
    puVar3 = (undefined *)&lit_raise_you_from_the_dead;
    uVar5 = qb3f_6e((word)uVar5,0xd2f6,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7f6);
    uVar5 = qb3e_79((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),wVar2,0xb7f6);
    uVar5 = qb3f_7b((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb4ee,0xb4f2);
    uVar5 = qb3d_34((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb4ee,0xb4f2);
    uVar5 = qb3f_91((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb4ee,0xd312);
    wVar1 = 0x1a;
    uVar5 = qb3d_03((word)uVar5,0x1a,(word)((ulong)uVar5 >> 0x10),0xb4ee,0xd312);
    uVar5 = qb3f_81((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb4ee,0xb7f6);
    uVar5 = qb3f_a1((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb4ee,0x1fa2);
    wVar2 = (word)((ulong)uVar5 >> 0x10);
    if ((bool)in_CF || (bool)in_ZF) {
      uVar5 = qb3f_7b((word)uVar5,wVar1,wVar2,0xce44,0xb48c);
      uVar5 = qb3f_7b((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xbd2a,0xb4ca);
      uVar5 = qb3f_7b((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xbd2e,0xb4d2);
      uVar5 = qb3f_7f((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0x1fa2,0xb7d0);
      qb3f_7d((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0x1fa2,0x1fa2);
      FUN_1000_2f3c();
      FUN_1000_1cf5();
      return;
    }
    uVar5 = qb3f_bc((word)uVar5,wVar1,wVar2,0xb4ee,0x1fa2);
    puVar3 = (undefined *)&lit_The_raise_doesn_t_work;
    uVar5 = qb3f_6e((word)uVar5,0xd316,(word)((ulong)uVar5 >> 0x10),0xb4ee,0x1fa2);
    qb3e_79((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb4ee,0x1fa2);
  }
  uVar5 = FUN_1000_a249();
  qb3f_7b((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb734);
  FUN_1000_b5c8();
  FUN_1000_2fcb();
  uVar5 = FUN_1000_2f3c();
  uVar5 = qb3e_0c((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb734);
  puVar3 = (undefined *)&lit_F8;
  uVar5 = qb3e_0e((word)uVar5,0xd352,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb734);
  uVar5 = qb3f_7f((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb738,0xb7d0);
  uVar5 = qb3f_7d((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb738,0xb738);
  qb3f_7b((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  FUN_1000_c02d();
  puVar3 = (undefined *)&lit_EXE;
  uVar5 = qb3f_55(0xb4be,0xd358,dx,0xb7f6,0xb73c);
  uVar5 = qb3e_24((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  puVar3 = (undefined *)&lit_BIN;
  uVar5 = qb3f_55((word)uVar5,0xd360,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  wVar1 = qb3e_24((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  wVar2 = DAT_2000_b740;
  uVar5 = qb3d_10(wVar1,DAT_2000_b740,DAT_2000_b740,0xb7f6,0xb73c);
  uVar5 = qb3f_ba((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  wVar1 = (word)((ulong)uVar5 >> 0x10);
  uVar5 = qb3d_10((word)uVar5,wVar1,wVar2 - 1,0xb7f6,0xb73c);
  wVar2 = qb3d_0c((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  uVar5 = qb3f_61(wVar2,wVar1,0xb742,0xb7f6,0xb73c);
  wVar2 = qb3f_75((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb6dc,0xb73c);
  wVar1 = wVar1 * 4 + 0x5f14;
  uVar4 = wVar1 == 0;
  qb3f_61(wVar2,wVar1,0xb53a,0xb6dc,0xb73c);
  FUN_1000_a2e5();
  qb3f_62(0xb742,0xb4be,dx_00,0xb6dc,0xb73c);
  if ((bool)uVar4) {
    return;
  }
  puVar3 = (undefined *)&lit_EXE;
  uVar5 = qb3f_55(0xb4be,0xd358,0xd358,0xb6dc,0xb73c);
  uVar6 = qb3f_55(0xb742,(word)((ulong)uVar5 >> 0x10),(word)puVar3,0xb6dc,0xb73c);
  wVar2 = (word)uVar5;
  wVar1 = qb3e_23((word)uVar6,(word)((ulong)uVar5 >> 0x10),(word)((ulong)uVar6 >> 0x10),0xb6dc,
                  0xb73c);
  puVar3 = (undefined *)&lit_BIN;
  qb3f_55(wVar2,0xd360,0xd360,0xb6dc,0xb73c);
  wVar2 = bx;
  uVar5 = qb3f_55(wVar1,bx,(word)puVar3,0xb6dc,0xb73c);
  qb3e_23((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0xb6dc,0xb73c);
  return;
}


// ==== FUN_1000_a249 @ 1000:a249 (size 156) callers: FUN_1000_a013

void __cdecl16near FUN_1000_a249(void)

{
  word in_AX;
  word wVar1;
  word wVar2;
  word in_DX;
  word dx;
  word dx_00;
  word bx;
  word in_BX;
  undefined *puVar3;
  undefined1 uVar4;
  undefined4 uVar5;
  undefined4 uVar6;
  
  uVar5 = qb3f_7f(in_AX,in_BX,in_DX,0xb738,0xb7d0);
  uVar5 = qb3f_7d((word)uVar5,in_BX,(word)((ulong)uVar5 >> 0x10),0xb738,0xb738);
  qb3f_7b((word)uVar5,in_BX,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  FUN_1000_c02d();
  puVar3 = (undefined *)&lit_EXE;
  uVar5 = qb3f_55(0xb4be,0xd358,dx,0xb7f6,0xb73c);
  uVar5 = qb3e_24((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  puVar3 = (undefined *)&lit_BIN;
  uVar5 = qb3f_55((word)uVar5,0xd360,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  wVar1 = qb3e_24((word)uVar5,(word)puVar3,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  wVar2 = DAT_2000_b740;
  uVar5 = qb3d_10(wVar1,DAT_2000_b740,DAT_2000_b740,0xb7f6,0xb73c);
  uVar5 = qb3f_ba((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  wVar1 = (word)((ulong)uVar5 >> 0x10);
  uVar5 = qb3d_10((word)uVar5,wVar1,wVar2 - 1,0xb7f6,0xb73c);
  wVar2 = qb3d_0c((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb7f6,0xb73c);
  uVar5 = qb3f_61(wVar2,wVar1,0xb742,0xb7f6,0xb73c);
  wVar2 = qb3f_75((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb6dc,0xb73c);
  wVar1 = wVar1 * 4 + 0x5f14;
  uVar4 = wVar1 == 0;
  qb3f_61(wVar2,wVar1,0xb53a,0xb6dc,0xb73c);
  FUN_1000_a2e5();
  qb3f_62(0xb742,0xb4be,dx_00,0xb6dc,0xb73c);
  if (!(bool)uVar4) {
    puVar3 = (undefined *)&lit_EXE;
    uVar5 = qb3f_55(0xb4be,0xd358,0xd358,0xb6dc,0xb73c);
    uVar6 = qb3f_55(0xb742,(word)((ulong)uVar5 >> 0x10),(word)puVar3,0xb6dc,0xb73c);
    wVar2 = (word)uVar5;
    wVar1 = qb3e_23((word)uVar6,(word)((ulong)uVar5 >> 0x10),(word)((ulong)uVar6 >> 0x10),0xb6dc,
                    0xb73c);
    puVar3 = (undefined *)&lit_BIN;
    qb3f_55(wVar2,0xd360,0xd360,0xb6dc,0xb73c);
    wVar2 = bx;
    uVar5 = qb3f_55(wVar1,bx,(word)puVar3,0xb6dc,0xb73c);
    qb3e_23((word)uVar5,wVar2,(word)((ulong)uVar5 >> 0x10),0xb6dc,0xb73c);
    return;
  }
  return;
}


// ==== FUN_1000_a2e5 @ 1000:a2e5 (size 80) callers: FUN_1000_0cd2,FUN_1000_a249

void __cdecl16near FUN_1000_a2e5(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word bx;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  wVar1 = qb3e_1f(in_AX,0xbcf0,in_DX,unaff_SI,unaff_DI);
  bx = 1;
  uVar2 = qb3e_1e(wVar1,1,0xb7e6,unaff_SI,unaff_DI);
  wVar1 = qb3e_07((word)uVar2,bx,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_67(wVar1,0xb462,bx,unaff_SI,unaff_DI);
  uVar2 = qb3f_67((word)uVar2,0xb4ea,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_67((word)uVar2,0xb57e,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_6a((word)uVar2,0xb466,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_68((word)uVar2,0xb588,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_68((word)uVar2,0xb590,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_69((word)uVar2,DAT_2000_b5de,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = 0xb53a;
  uVar2 = qb3f_6e((word)uVar2,0xb53a,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3e_79((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = (word)((ulong)uVar2 >> 0x10);
  qb3e_21((word)uVar2,wVar1,wVar1,unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_a335 @ 1000:a335 (size 307) callers: FUN_1000_89d9,FUN_1000_9569

/* WARNING: Instruction at (ram,0x0001a3f2) overlaps instruction at (ram,0x0001a3f1)
    */

void __cdecl16near FUN_1000_a335(void)

{
  uint *puVar1;
  code *pcVar2;
  byte bVar3;
  word in_AX;
  word wVar4;
  uint uVar5;
  word in_CX;
  word in_DX;
  uint in_BX;
  word wVar6;
  uint unaff_BP;
  word di;
  word di_00;
  undefined2 unaff_ES;
  undefined2 unaff_SS;
  byte in_AF;
  undefined1 in_ZF;
  bool bVar7;
  char cVar8;
  char cVar9;
  undefined4 uVar10;
  
  DAT_2000_b746 = 0;
  DAT_2000_b748 = 0;
  uVar10 = qb3f_9f(in_AX,in_BX,in_DX,0xb6f4,0xbb6c);
  if ((bool)in_ZF) {
    DAT_2000_b746 = 1;
    DAT_2000_b748 = 1;
  }
  uVar10 = qb3f_9f((word)uVar10,in_BX,(word)((ulong)uVar10 >> 0x10),0xb6f4,0xbb68);
  if ((bool)in_ZF) {
    DAT_2000_b748 = 1;
  }
LAB_1000_a36f:
  uVar10 = qb3f_7b((word)uVar10,in_BX,(word)((ulong)uVar10 >> 0x10),0xce44,0xb6a4);
  wVar6 = 0xce44;
  wVar4 = qb3f_73((word)uVar10,0xce44,(word)((ulong)uVar10 >> 0x10),0xb4de,0xb6a4);
  uVar10 = qb3f_82(wVar4,wVar6,0xb4de,0xb4de,0xb6fa);
  uVar10 = qb3f_7a((word)uVar10,wVar6,(word)((ulong)uVar10 >> 0x10),0xb4de,0xb6fa);
  wVar4 = (word)((ulong)uVar10 >> 0x10);
  uVar10 = qb3f_7d((word)uVar10,wVar6,wVar4,0xb4de,wVar4);
  DAT_2000_b536 = 1;
  uVar10 = qb3f_7b((word)uVar10,wVar6,(word)((ulong)uVar10 >> 0x10),wVar6,0xb50e);
  uVar10 = qb3f_7b((word)uVar10,wVar6,(word)((ulong)uVar10 >> 0x10),0xb7f6,0xb4c2);
  qb3f_75((word)uVar10,wVar6,(word)((ulong)uVar10 >> 0x10),0xb4d2,0xb4c2);
  wVar4 = (word)((long)(int)wVar6 * 0x16);
  uVar10 = qb3f_75(wVar4,wVar6,(word)((ulong)((long)(int)wVar6 * 0x16) >> 0x10),0xb4ca,wVar4);
  wVar6 = wVar6 + (word)uVar10;
  *(undefined2 *)(wVar6 * 2 + 0x4e90) = 0;
  di = 0xb6b4;
  wVar4 = 0xb48c;
  uVar10 = qb3f_7b((word)uVar10,wVar6,(word)((ulong)uVar10 >> 0x10),0xb48c,0xb6b4);
  uVar10 = qb3d_34((word)uVar10,wVar6,(word)((ulong)uVar10 >> 0x10),0xb48c,0xb6b4);
code_r0x0001a3d4:
  uVar10 = qb3f_91((word)uVar10,wVar6,(word)((ulong)uVar10 >> 0x10),wVar4,di);
  uVar10 = qb3f_ad((word)uVar10,wVar6,(word)((ulong)uVar10 >> 0x10),wVar4,di);
  in_BX = 0x1a;
  uVar10 = qb3d_03((word)uVar10,0x1a,(word)((ulong)uVar10 >> 0x10),wVar4,di);
  uVar10 = qb3f_71((word)uVar10,in_BX,(word)((ulong)uVar10 >> 0x10),di,di);
  di_00 = di;
code_r0x0001a3e7:
  bVar3 = qb3f_ab((word)uVar10,in_BX,(word)((ulong)uVar10 >> 0x10),di,di_00);
  unaff_BP = unaff_BP + in_CX;
  in_AF = 9 < (bVar3 & 0xf) | in_AF;
  bVar3 = bVar3 + in_AF * -6 & 0xf;
  in_BX = CONCAT11(0xcd,(char)in_BX);
  do {
    in_AF = 9 < (bVar3 & 0xf) | in_AF;
    while( true ) {
      unaff_BP = unaff_BP | 0x773f;
      bVar7 = unaff_BP == 0;
      wVar4 = 0xb69c;
      pcVar2 = (code *)swi(0x3f);
      uVar10 = (*pcVar2)();
      if (!bVar7) goto LAB_1000_a36f;
      ((undefined2 *)&DAT_2000_3824)[di_00] = (int)((ulong)uVar10 >> 0x10);
      pcVar2 = (code *)swi(0x3d);
      uVar5 = (*pcVar2)();
      in_CX = uVar5 ^ 0xbf;
      unaff_BP = 0x3fcd;
      in_BX = 0x1a;
      pcVar2 = (code *)swi(0x3d);
      (*pcVar2)();
      di_00 = di_00 * 2 + *(int *)((int)(undefined2 *)&DAT_2000_b7d7 + in_BX + 1);
      pcVar2 = (code *)swi(0x3f);
      (*pcVar2)();
      puVar1 = (uint *)(di_00 - 0x54);
      cVar9 = '\0';
      *puVar1 = *puVar1 | 0xb74a;
      cVar8 = (int)*puVar1 < 0;
      pcVar2 = (code *)swi(0x3f);
      bVar3 = (*pcVar2)();
      if (cVar9 == cVar8) break;
      di_00 = 0xbd22;
      pcVar2 = (code *)swi(0x3f);
      (*pcVar2)();
      wVar6 = 0x1a;
      pcVar2 = (code *)swi(0x3d);
      uVar10 = (*pcVar2)();
      in_CX = in_BX + *(int *)0xcae8;
      in_AF = 9 < ((byte)uVar10 & 0xf) | in_AF;
      bVar3 = (byte)uVar10 + in_AF * -6;
      if (0x3fcc < *(int *)(wVar6 + 0xb74e)) {
        di = 0xbd23;
        *(byte *)0xbd22 = bVar3 & 0xf;
        uVar10 = qb3d_34(CONCAT11((char)((ulong)uVar10 >> 8) - in_AF,bVar3) & 0xff0f,wVar6,
                         (word)((ulong)uVar10 >> 0x10),0xb69c,0xbd23);
        goto code_r0x0001a3d4;
      }
      pcVar2 = (code *)swi(0x3f);
      in_CX = wVar6;
      (*pcVar2)();
      unaff_BP = 0x7fff;
      bVar7 = false;
      di = 0xb69c;
      pcVar2 = (code *)swi(0x3f);
      in_BX = in_CX;
      uVar10 = (*pcVar2)();
      if (!bVar7) goto code_r0x0001a3e7;
      bVar7 = false;
      pcVar2 = (code *)swi(0x3f);
      DAT_2000_8f7a = in_CX;
      (*pcVar2)();
      if (bVar7) {
        return;
      }
      pcVar2 = (code *)swi(0x3f);
      (*pcVar2)();
    }
  } while( true );
}


// ==== FUN_1000_b2cf @ 1000:b2cf (size 57) callers: FUN_1000_3dae,FUN_1000_b674

void __cdecl16near FUN_1000_b2cf(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word in_BX;
  undefined2 *bx;
  word bx_00;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  uVar2 = qb3d_34(in_AX,in_BX,in_DX,unaff_SI,unaff_DI);
  uVar2 = qb3f_91((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xb7f2);
  uVar2 = qb3d_03((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xb7f2);
  bx = (undefined2 *)&DAT_2000_b7f2;
  wVar1 = qb3f_81((word)uVar2,0xb7f2,(word)((ulong)uVar2 >> 0x10),unaff_SI,0xb7d8);
  uVar2 = qb3f_7d(wVar1,(word)bx,0xb7d8,unaff_SI,0x1bba);
  uVar2 = qb3d_34((word)uVar2,(word)bx,(word)((ulong)uVar2 >> 0x10),unaff_SI,0x1bba);
  uVar2 = qb3f_91((word)uVar2,(word)bx,(word)((ulong)uVar2 >> 0x10),unaff_SI,(word)bx);
  bx_00 = 0x1a;
  uVar2 = qb3d_03((word)uVar2,0x1a,(word)((ulong)uVar2 >> 0x10),unaff_SI,(word)bx);
  wVar1 = (word)((ulong)uVar2 >> 0x10);
  uVar2 = qb3f_81((word)uVar2,bx_00,wVar1,unaff_SI,wVar1);
  qb3f_7d((word)uVar2,bx_00,(word)((ulong)uVar2 >> 0x10),unaff_SI,0x1bbe);
  return;
}


// ==== FUN_1000_b308 @ 1000:b308 (size 698) callers: FUN_1000_0cd2,FUN_1000_3dae,FUN_1000_54cb,FUN_1000_7ffb,FUN_1000_9a2f

void __cdecl16near FUN_1000_b308(void)

{
  word wVar1;
  word dx;
  word dx_00;
  undefined *puVar2;
  word wVar3;
  int iVar4;
  uint uVar5;
  word unaff_SI;
  word wVar6;
  word unaff_DI;
  undefined1 uVar7;
  undefined1 uVar8;
  undefined4 uVar9;
  
  uVar9 = FUN_1000_2fcb();
  qb3e_1f((word)uVar9,0xbcf0,(word)((ulong)uVar9 >> 0x10),unaff_SI,unaff_DI);
  puVar2 = (undefined *)&lit_EXE;
  wVar1 = qb3f_55(0xb4be,0xd358,dx,unaff_SI,unaff_DI);
  wVar3 = 1;
  uVar7 = 0;
  uVar8 = 1;
  uVar9 = qb3e_1e(wVar1,1,(word)puVar2,unaff_SI,unaff_DI);
  wVar1 = 0xb7f6;
  uVar9 = qb3f_6f((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),0xb7f6,unaff_DI);
  while( true ) {
    uVar9 = qb3f_7d((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),wVar1,0x4e28);
    uVar9 = qb3f_9f((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb7fa);
    if (!(bool)uVar7 && !(bool)uVar8) break;
    wVar1 = 0x4e28;
    uVar9 = qb3f_75((word)uVar9,0x4e28,0x4e28,0x4e28,0xb7fa);
    uVar7 = 0xe06d < wVar1 * 4;
    wVar6 = wVar1 * 4 + 0x1f92;
    uVar8 = wVar6 == 0;
    uVar9 = qb3f_8f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),wVar6,0xbb60);
    uVar9 = qb3f_81((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),wVar6,0xd6c4);
    uVar9 = qb3f_7d((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),wVar6,0x52fc);
    uVar9 = qb3e_07((word)uVar9,1,(word)((ulong)uVar9 >> 0x10),wVar6,0x52fc);
    wVar3 = 0x52fc;
    uVar9 = qb3f_6b((word)uVar9,0x52fc,(word)((ulong)uVar9 >> 0x10),wVar6,0x52fc);
    uVar9 = qb3e_79((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),wVar6,0x52fc);
    wVar1 = (word)((ulong)uVar9 >> 0x10);
    uVar9 = qb3f_7f((word)uVar9,wVar3,wVar1,wVar1,0xb7f6);
  }
  wVar3 = 1;
  wVar1 = qb3e_07((word)uVar9,1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb7fa);
  uVar9 = qb3f_67(wVar1,0xb520,wVar3,0x4e28,0xb7fa);
  uVar9 = qb3f_67((word)uVar9,0xb59e,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb7fa);
  uVar9 = qb3f_67((word)uVar9,0xb5a2,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb7fa);
  uVar9 = qb3f_67((word)uVar9,0xb57e,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb7fa);
  wVar1 = 0xb56c;
  uVar9 = qb3f_6b((word)uVar9,0xb56c,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb7fa);
  uVar9 = qb3e_79((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb7fa);
  wVar1 = (word)((ulong)uVar9 >> 0x10);
  uVar9 = qb3e_07((word)uVar9,wVar1,wVar1,0x4e28,0xb7fa);
  uVar9 = qb3f_80((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0xb4e2,0xd6c8);
  wVar1 = 0x16;
  uVar9 = qb3f_68((word)uVar9,0x16,(word)((ulong)uVar9 >> 0x10),0xb4e2,0xd6c8);
  uVar9 = qb3f_7f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0xb4ea,0xd6d0);
  wVar1 = 0x1a;
  uVar9 = qb3f_67((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),0xb4ea,0xd6d0);
  uVar9 = qb3f_7f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0xb4ee,0xd6d4);
  wVar1 = 0x1a;
  uVar9 = qb3f_67((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),0xb4ee,0xd6d4);
  uVar9 = qb3f_7f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0xb4f2,55000);
  uVar9 = qb3f_67((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),0xb4f2,55000);
  wVar1 = 0xb558;
  uVar9 = qb3f_6b((word)uVar9,0xb558,(word)((ulong)uVar9 >> 0x10),0xb4f2,55000);
  uVar9 = qb3e_79((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0xb4f2,55000);
  wVar1 = (word)((ulong)uVar9 >> 0x10);
  uVar9 = qb3e_07((word)uVar9,wVar1,wVar1,0xb4f2,55000);
  uVar9 = qb3f_7f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0xb570,0xd6dc);
  wVar1 = 0x1a;
  uVar9 = qb3f_67((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),0xb570,0xd6dc);
  uVar9 = qb3f_7f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0xb4f6,0xd6e0);
  wVar1 = 0x1a;
  uVar9 = qb3f_67((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),0xb4f6,0xd6e0);
  uVar9 = qb3f_80((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0xb588,0xd6e4);
  uVar9 = qb3f_68((word)uVar9,0x16,(word)((ulong)uVar9 >> 0x10),0xb588,0xd6e4);
  uVar9 = qb3f_68((word)uVar9,0xb590,(word)((ulong)uVar9 >> 0x10),0xb588,0xd6e4);
  uVar9 = qb3f_67((word)uVar9,0xb4de,(word)((ulong)uVar9 >> 0x10),0xb588,0xd6e4);
  uVar9 = qb3f_67((word)uVar9,0xb568,(word)((ulong)uVar9 >> 0x10),0xb588,0xd6e4);
  uVar9 = qb3f_67((word)uVar9,0xb4ca,(word)((ulong)uVar9 >> 0x10),0xb588,0xd6e4);
  uVar9 = qb3f_67((word)uVar9,0xb4d2,(word)((ulong)uVar9 >> 0x10),0xb588,0xd6e4);
  uVar9 = qb3f_67((word)uVar9,0xb48c,(word)((ulong)uVar9 >> 0x10),0xb588,0xd6e4);
  wVar1 = 0xb488;
  uVar9 = qb3f_6b((word)uVar9,0xb488,(word)((ulong)uVar9 >> 0x10),0xb588,0xd6e4);
  uVar9 = qb3e_79((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0xb588,0xd6e4);
  wVar3 = 0xb7f6;
  uVar9 = qb3f_6f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0xb7f6,0xd6e4);
  while( true ) {
    uVar9 = qb3f_7d((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),wVar3,0x4e28);
    uVar9 = qb3f_9f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbe6e);
    wVar3 = (word)((ulong)uVar9 >> 0x10);
    if (!(bool)uVar7 && !(bool)uVar8) break;
    wVar1 = qb3e_07((word)uVar9,1,wVar3,0x4e28,0xbe6e);
    iVar4 = 0x4e28;
    uVar9 = qb3f_75(wVar1,0x4e28,0x4e28,0x4e28,0xbe6e);
    uVar7 = 0x9fdf < (uint)(iVar4 * 4);
    wVar1 = iVar4 * 4 + 0x6020;
    uVar8 = wVar1 == 0;
    uVar9 = qb3f_6b((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbe6e);
    uVar9 = qb3e_79((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbe6e);
    wVar3 = (word)((ulong)uVar9 >> 0x10);
    uVar9 = qb3f_7f((word)uVar9,wVar1,wVar3,wVar3,0xb7f6);
  }
  wVar6 = 0xb7f6;
  uVar9 = qb3f_6f((word)uVar9,wVar1,wVar3,0xb7f6,0xbe6e);
  while( true ) {
    uVar9 = qb3f_7d((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),wVar6,0x4e28);
    uVar9 = qb3f_9f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbe6e);
    wVar3 = (word)((ulong)uVar9 >> 0x10);
    if (!(bool)uVar7 && !(bool)uVar8) break;
    wVar1 = qb3e_07((word)uVar9,1,wVar3,0x4e28,0xbe6e);
    iVar4 = 0x4e28;
    uVar9 = qb3f_75(wVar1,0x4e28,0x4e28,0x4e28,0xbe6e);
    uVar7 = 0x4be1 < (uint)(iVar4 * 4);
    wVar1 = iVar4 * 4 + 0xb41e;
    uVar8 = wVar1 == 0;
    uVar9 = qb3f_6b((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbe6e);
    uVar9 = qb3e_79((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbe6e);
    wVar6 = (word)((ulong)uVar9 >> 0x10);
    uVar9 = qb3f_7f((word)uVar9,wVar1,wVar6,wVar6,0xb7f6);
  }
  wVar6 = 0xb7f6;
  uVar9 = qb3f_6f((word)uVar9,wVar1,wVar3,0xb7f6,0xbe6e);
  while( true ) {
    uVar9 = qb3f_7d((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),wVar6,0x4e28);
    uVar9 = qb3f_9f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbb64);
    wVar3 = (word)((ulong)uVar9 >> 0x10);
    if (!(bool)uVar7 && !(bool)uVar8) break;
    wVar1 = qb3e_07((word)uVar9,1,wVar3,0x4e28,0xbb64);
    iVar4 = 0x4e28;
    uVar9 = qb3f_75(wVar1,0x4e28,0x4e28,0x4e28,0xbb64);
    uVar7 = 0x4d2d < (uint)(iVar4 * 4);
    wVar1 = iVar4 * 4 + 0xb2d2;
    uVar8 = wVar1 == 0;
    uVar9 = qb3f_6b((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbb64);
    uVar9 = qb3e_79((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbb64);
    wVar6 = (word)((ulong)uVar9 >> 0x10);
    uVar9 = qb3f_7f((word)uVar9,wVar1,wVar6,wVar6,0xb7f6);
  }
  wVar6 = 0xb7f6;
  uVar9 = qb3f_6f((word)uVar9,wVar1,wVar3,0xb7f6,0xbb64);
  while( true ) {
    uVar9 = qb3f_7d((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),wVar6,0x4e28);
    uVar9 = qb3f_9f((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbd2e);
    wVar1 = (word)((ulong)uVar9 >> 0x10);
    if (!(bool)uVar7 && !(bool)uVar8) break;
    wVar1 = qb3e_07((word)uVar9,1,wVar1,0x4e28,0xbd2e);
    iVar4 = 0x4e28;
    uVar9 = qb3f_75(wVar1,0x4e28,0x4e28,0x4e28,0xbd2e);
    uVar5 = iVar4 * 4;
    uVar9 = qb3f_67((word)uVar9,uVar5 + 0x5ee0,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbd2e);
    uVar7 = 0xa153 < uVar5;
    wVar1 = uVar5 + 0x5eac;
    uVar8 = wVar1 == 0;
    uVar9 = qb3f_6b((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbd2e);
    uVar9 = qb3e_79((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbd2e);
    wVar6 = (word)((ulong)uVar9 >> 0x10);
    uVar9 = qb3f_7f((word)uVar9,wVar1,wVar6,wVar6,0xb7f6);
  }
  DAT_2000_b5e4 = 1;
  while ((int)DAT_2000_b5e4 < 0xc9) {
    uVar9 = qb3e_07(DAT_2000_b5e4,1,wVar1,0x4e28,0xbd2e);
    wVar1 = (word)uVar9 * 4 + 0x1b92;
    uVar9 = qb3f_6b((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbd2e);
    uVar9 = qb3e_79((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbd2e);
    wVar1 = (word)((ulong)uVar9 >> 0x10);
    DAT_2000_b5e4 = (int)uVar9 + 1;
  }
  uVar9 = qb3e_21(DAT_2000_b5e4,1,wVar1,0x4e28,0xbd2e);
  wVar1 = 0x9b06;
  uVar9 = qb3f_57((word)uVar9,0x9b06,(word)((ulong)uVar9 >> 0x10),0x4e28,0xbd2e);
  uVar9 = qb3f_7d((word)uVar9,wVar1,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb774);
  uVar9 = qb3f_57((word)uVar9,0xb2a2,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb774);
  wVar3 = 0xb774;
  uVar9 = qb3f_7d((word)uVar9,0xb774,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb778);
  uVar9 = qb3f_97((word)uVar9,0xb778,(word)((ulong)uVar9 >> 0x10),0xb778,wVar3);
  uVar9 = qb3f_81((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),0xb778,0xb7f6);
  wVar1 = qb3f_7d((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),0xb778,0xb77c);
  qb3f_21(wVar1,wVar3,wVar3,0xb77c,0xb77c);
  puVar2 = (undefined *)&lit_BIN;
  uVar9 = qb3f_55(0xb4be,0xd360,dx_00,0xb77c,0xb77c);
  qb3e_1b((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),0xb77c,0xb77c);
  return;
}


// ==== FUN_1000_b5c8 @ 1000:b5c8 (size 172) callers: FUN_1000_0cd2,FUN_1000_7ffb,FUN_1000_a013

void __cdecl16near FUN_1000_b5c8(void)

{
  word in_AX;
  word in_DX;
  word dx;
  word dx_00;
  word in_BX;
  word wVar1;
  undefined *puVar2;
  word wVar3;
  word wVar4;
  undefined2 *bx;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_ZF;
  undefined4 uVar5;
  
  uVar5 = qb3f_bc(in_AX,in_BX,in_DX,unaff_SI,unaff_DI);
  wVar1 = 0xbc1a;
  uVar5 = qb3f_6e((word)uVar5,0xbc1a,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  uVar5 = qb3e_79((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  uVar5 = qb3f_a7((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),0xb734,unaff_DI);
  wVar3 = (word)((ulong)uVar5 >> 0x10);
  if ((bool)in_ZF) {
    uVar5 = qb3f_bc((word)uVar5,wVar1,wVar3,0xb734,unaff_DI);
    puVar2 = (undefined *)&lit_Why_don_t_you_go_grab_a_sandwich;
    uVar5 = qb3f_6e((word)uVar5,0xd6ec,(word)((ulong)uVar5 >> 0x10),0xb734,unaff_DI);
    uVar5 = qb3e_79((word)uVar5,(word)puVar2,(word)((ulong)uVar5 >> 0x10),0xb734,unaff_DI);
  }
  else {
    uVar5 = qb3f_bc((word)uVar5,wVar1,wVar3,0xb734,unaff_DI);
    puVar2 = (undefined *)&lit_Better_luck_next_time;
    uVar5 = qb3f_6e((word)uVar5,0xd712,(word)((ulong)uVar5 >> 0x10),0xb734,unaff_DI);
    uVar5 = qb3e_79((word)uVar5,(word)puVar2,(word)((ulong)uVar5 >> 0x10),0xb734,unaff_DI);
  }
  wVar3 = 0x2242;
  uVar5 = qb3f_57((word)uVar5,0x2242,(word)((ulong)uVar5 >> 0x10),0xb734,unaff_DI);
  uVar5 = qb3f_7d((word)uVar5,wVar3,(word)((ulong)uVar5 >> 0x10),0xb734,0xb774);
  uVar5 = qb3f_57((word)uVar5,0x3822,(word)((ulong)uVar5 >> 0x10),0xb734,0xb774);
  wVar1 = 0xb774;
  uVar5 = qb3f_7d((word)uVar5,0xb774,(word)((ulong)uVar5 >> 0x10),0xb734,0xb778);
  wVar4 = 0xb778;
  wVar3 = qb3f_97((word)uVar5,0xb778,(word)((ulong)uVar5 >> 0x10),0xb778,wVar1);
  uVar5 = qb3f_81(wVar3,wVar4,wVar1,0xb778,0xb7f6);
  qb3f_7d((word)uVar5,wVar4,(word)((ulong)uVar5 >> 0x10),0xb778,0xb77c);
  uVar5 = qb3f_21(wVar4,wVar4,dx,0xb77c,0xb77c);
  uVar5 = qb3e_1b((word)uVar5,0xd730,(word)((ulong)uVar5 >> 0x10),0xb77c,0xb77c);
  bx = (undefined2 *)&DAT_2000_3824;
  uVar5 = qb3f_57((word)uVar5,0x3824,(word)((ulong)uVar5 >> 0x10),0xb77c,0xb77c);
  wVar1 = (word)((ulong)uVar5 >> 0x10);
  uVar5 = qb3f_7d((word)uVar5,(word)bx,0xb77c,0xb77c,wVar1);
  wVar4 = 0x4e04;
  uVar5 = qb3f_57((word)uVar5,0x4e04,(word)((ulong)uVar5 >> 0x10),0xb77c,wVar1);
  wVar3 = (word)uVar5;
  uVar5 = qb3f_7d(wVar1,wVar4,(word)((ulong)uVar5 >> 0x10),0xb77c,wVar3);
  wVar1 = (word)uVar5;
  uVar5 = qb3f_97(wVar3,wVar4,(word)((ulong)uVar5 >> 0x10),wVar3,wVar1);
  uVar5 = qb3f_81((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),wVar3,0xb7f6);
  wVar4 = (word)((ulong)uVar5 >> 0x10);
  uVar5 = qb3f_7d((word)uVar5,wVar1,wVar4,wVar3,wVar4);
  dx_00 = (word)((ulong)uVar5 >> 0x10);
  wVar3 = qb3f_21((word)uVar5,wVar1,dx_00,dx_00,wVar4);
  qb3e_1b(wVar3,0xd73a,wVar1,dx_00,wVar4);
  return;
}


// ==== FUN_1000_b674 @ 1000:b674 (size 826) callers: entry

void __cdecl16near FUN_1000_b674(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word dx;
  word dx_00;
  word dx_01;
  int extraout_DX;
  word dx_02;
  undefined *puVar2;
  word wVar3;
  word wVar4;
  word wVar5;
  int iVar6;
  uint uVar7;
  word unaff_SI;
  word unaff_DI;
  undefined1 uVar8;
  undefined1 uVar9;
  undefined4 uVar10;
  
  qb3e_1f(in_AX,0xb7e0,in_DX,unaff_SI,unaff_DI);
  puVar2 = (undefined *)&lit_EXE;
  wVar1 = qb3f_55(0xb4be,0xd358,dx,unaff_SI,unaff_DI);
  wVar3 = 3;
  uVar8 = 0;
  uVar9 = 1;
  uVar10 = qb3e_1e(wVar1,3,(word)puVar2,unaff_SI,unaff_DI);
  wVar1 = 0xb7f6;
  uVar10 = qb3f_6f((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),0xb7f6,unaff_DI);
  while( true ) {
    uVar10 = qb3f_7d((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),wVar1,0x4e28);
    uVar10 = qb3f_9f((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
    wVar1 = (word)((ulong)uVar10 >> 0x10);
    if (!(bool)uVar8 && !(bool)uVar9) break;
    wVar3 = 3;
    uVar10 = qb3f_b6((word)uVar10,3,wVar1,0x4e28,0xb7fa);
    uVar10 = qb3f_b7((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
    wVar4 = 0x52fc;
    wVar3 = qb3f_b8((word)uVar10,0x52fc,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
    wVar1 = wVar4;
    uVar10 = qb3f_75(wVar3,wVar4,0x4e28,0x4e28,0xb7fa);
    uVar8 = 0xe06d < wVar1 * 4;
    wVar3 = wVar1 * 4 + 0x1f92;
    uVar9 = wVar3 == 0;
    uVar10 = qb3f_7f((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),wVar4,0xd744);
    uVar10 = qb3f_89((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),wVar4,0xbb60);
    uVar10 = qb3f_7d((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),wVar4,wVar3);
    wVar1 = (word)((ulong)uVar10 >> 0x10);
    uVar10 = qb3f_7f((word)uVar10,wVar3,wVar1,wVar1,0xb7f6);
  }
  wVar3 = 3;
  uVar10 = qb3f_b6((word)uVar10,3,wVar1,0x4e28,0xb7fa);
  uVar10 = qb3f_b7((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  uVar10 = qb3f_b8((word)uVar10,0xb520,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  uVar10 = qb3f_b8((word)uVar10,0xb59e,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  uVar10 = qb3f_b8((word)uVar10,0xb5a2,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  uVar10 = qb3f_b8((word)uVar10,0xb57e,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  uVar10 = qb3f_b8((word)uVar10,0xb56c,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  wVar1 = 3;
  uVar10 = qb3f_b6((word)uVar10,3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  uVar10 = qb3f_b7((word)uVar10,wVar1,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  wVar4 = 0xb4e2;
  wVar1 = qb3f_b8((word)uVar10,0xb4e2,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  wVar3 = 0xb4ea;
  uVar10 = qb3f_b8(wVar1,0xb4ea,wVar4,0x4e28,0xb7fa);
  wVar1 = 0xb4ee;
  qb3f_b8((word)uVar10,0xb4ee,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  uVar10 = qb3f_b8(wVar1,0xb4f2,dx_00,0x4e28,0xb7fa);
  wVar5 = 0xb558;
  uVar10 = qb3f_b8((word)uVar10,0xb558,(word)((ulong)uVar10 >> 0x10),0x4e28,0xb7fa);
  wVar1 = (word)((ulong)uVar10 >> 0x10);
  uVar10 = qb3f_80((word)uVar10,wVar5,wVar1,wVar1,0xd748);
  wVar4 = (word)((ulong)uVar10 >> 0x10);
  uVar10 = qb3f_7e((word)uVar10,wVar5,wVar4,wVar1,wVar4);
  wVar1 = wVar3;
  uVar10 = qb3f_7f((word)uVar10,wVar5,(word)((ulong)uVar10 >> 0x10),wVar3,0xd750);
  uVar10 = qb3f_7d((word)uVar10,wVar5,(word)((ulong)uVar10 >> 0x10),wVar3,wVar1);
  wVar1 = (word)uVar10;
  uVar10 = qb3f_7f(wVar1,wVar5,(word)((ulong)uVar10 >> 0x10),wVar1,0xd754);
  uVar10 = qb3f_7d((word)uVar10,wVar5,(word)((ulong)uVar10 >> 0x10),wVar1,(word)uVar10);
  uVar10 = qb3f_7f((word)uVar10,wVar5,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xd758);
  uVar10 = qb3f_7d((word)uVar10,wVar5,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  wVar1 = 3;
  uVar10 = qb3f_b6((word)uVar10,3,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  uVar10 = qb3f_b7((word)uVar10,wVar1,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  wVar4 = 0xb570;
  wVar1 = qb3f_b8((word)uVar10,0xb570,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  wVar3 = 0xb4f6;
  uVar10 = qb3f_b8(wVar1,0xb4f6,wVar4,0xb4f2,0xb4f2);
  wVar1 = 0xb588;
  qb3f_b8((word)uVar10,0xb588,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  uVar10 = qb3f_b8(wVar1,0xb590,dx_01,0xb4f2,0xb4f2);
  uVar10 = qb3f_b8((word)uVar10,0xb4de,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  uVar10 = qb3f_b8((word)uVar10,0xb568,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  uVar10 = qb3f_b8((word)uVar10,0xb4ca,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  uVar10 = qb3f_b8((word)uVar10,0xb4d2,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  uVar10 = qb3f_b8((word)uVar10,0xb48c,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  wVar4 = 0xb488;
  uVar10 = qb3f_b8((word)uVar10,0xb488,(word)((ulong)uVar10 >> 0x10),0xb4f2,0xb4f2);
  wVar1 = (word)((ulong)uVar10 >> 0x10);
  uVar10 = qb3f_7f((word)uVar10,wVar4,wVar1,wVar1,0xd75c);
  wVar5 = (word)((ulong)uVar10 >> 0x10);
  uVar10 = qb3f_7d((word)uVar10,wVar4,wVar5,wVar1,wVar5);
  wVar1 = wVar3;
  uVar10 = qb3f_7f((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),wVar3,0xd760);
  uVar10 = qb3f_7d((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),wVar3,wVar1);
  wVar1 = (word)uVar10;
  uVar10 = qb3f_80(wVar1,wVar4,(word)((ulong)uVar10 >> 0x10),wVar1,0xd764);
  wVar3 = (word)uVar10;
  uVar10 = qb3f_7e(wVar3,wVar4,(word)((ulong)uVar10 >> 0x10),wVar1,wVar3);
  wVar1 = 0xb7f6;
  uVar10 = qb3f_6f((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0xb7f6,wVar3);
  while( true ) {
    uVar10 = qb3f_7d((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),wVar1,0x4e28);
    uVar10 = qb3f_9f((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbe6e);
    wVar1 = (word)((ulong)uVar10 >> 0x10);
    if (!(bool)uVar8 && !(bool)uVar9) break;
    wVar3 = 3;
    uVar10 = qb3f_b6((word)uVar10,3,wVar1,0x4e28,0xbe6e);
    wVar1 = qb3f_b7((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbe6e);
    iVar6 = 0x4e28;
    uVar10 = qb3f_75(wVar1,0x4e28,0x4e28,0x4e28,0xbe6e);
    uVar8 = 0x9fdf < (uint)(iVar6 * 4);
    wVar4 = iVar6 * 4 + 0x6020;
    uVar9 = wVar4 == 0;
    uVar10 = qb3f_b8((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbe6e);
    wVar1 = (word)((ulong)uVar10 >> 0x10);
    uVar10 = qb3f_7f((word)uVar10,wVar4,wVar1,wVar1,0xb7f6);
  }
  wVar3 = 0xb7f6;
  uVar10 = qb3f_6f((word)uVar10,wVar4,wVar1,0xb7f6,0xbe6e);
  while( true ) {
    uVar10 = qb3f_7d((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),wVar3,0x4e28);
    uVar10 = qb3f_9f((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbe6e);
    wVar1 = (word)((ulong)uVar10 >> 0x10);
    if (!(bool)uVar8 && !(bool)uVar9) break;
    wVar3 = 3;
    uVar10 = qb3f_b6((word)uVar10,3,wVar1,0x4e28,0xbe6e);
    wVar1 = qb3f_b7((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbe6e);
    iVar6 = 0x4e28;
    uVar10 = qb3f_75(wVar1,0x4e28,0x4e28,0x4e28,0xbe6e);
    uVar8 = 0x4be1 < (uint)(iVar6 * 4);
    wVar4 = iVar6 * 4 + 0xb41e;
    uVar9 = wVar4 == 0;
    uVar10 = qb3f_b8((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbe6e);
    wVar3 = (word)((ulong)uVar10 >> 0x10);
    uVar10 = qb3f_7f((word)uVar10,wVar4,wVar3,wVar3,0xb7f6);
  }
  wVar3 = 0xb7f6;
  uVar10 = qb3f_6f((word)uVar10,wVar4,wVar1,0xb7f6,0xbe6e);
  while( true ) {
    uVar10 = qb3f_7d((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),wVar3,0x4e28);
    uVar10 = qb3f_9f((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbb64);
    wVar1 = (word)((ulong)uVar10 >> 0x10);
    if (!(bool)uVar8 && !(bool)uVar9) break;
    wVar3 = 3;
    uVar10 = qb3f_b6((word)uVar10,3,wVar1,0x4e28,0xbb64);
    wVar1 = qb3f_b7((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbb64);
    iVar6 = 0x4e28;
    uVar10 = qb3f_75(wVar1,0x4e28,0x4e28,0x4e28,0xbb64);
    uVar8 = 0x4d2d < (uint)(iVar6 * 4);
    wVar4 = iVar6 * 4 + 0xb2d2;
    uVar9 = wVar4 == 0;
    uVar10 = qb3f_b8((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbb64);
    wVar3 = (word)((ulong)uVar10 >> 0x10);
    uVar10 = qb3f_7f((word)uVar10,wVar4,wVar3,wVar3,0xb7f6);
  }
  wVar3 = 0xb7f6;
  uVar10 = qb3f_6f((word)uVar10,wVar4,wVar1,0xb7f6,0xbb64);
  while( true ) {
    uVar10 = qb3f_7d((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),wVar3,0x4e28);
    uVar10 = qb3f_9f((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd2e);
    wVar1 = (word)((ulong)uVar10 >> 0x10);
    if (!(bool)uVar8 && !(bool)uVar9) break;
    wVar3 = 3;
    uVar10 = qb3f_b6((word)uVar10,3,wVar1,0x4e28,0xbd2e);
    wVar1 = qb3f_b7((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd2e);
    iVar6 = 0x4e28;
    uVar10 = qb3f_75(wVar1,0x4e28,0x4e28,0x4e28,0xbd2e);
    uVar7 = iVar6 * 4;
    uVar10 = qb3f_b8((word)uVar10,uVar7 + 0x5ee0,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd2e);
    uVar8 = 0xa153 < uVar7;
    wVar4 = uVar7 + 0x5eac;
    uVar9 = wVar4 == 0;
    uVar10 = qb3f_b8((word)uVar10,wVar4,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd2e);
    wVar3 = (word)((ulong)uVar10 >> 0x10);
    uVar10 = qb3f_7f((word)uVar10,wVar4,wVar3,wVar3,0xb7f6);
  }
  DAT_2000_b5e4 = 1;
  while( true ) {
    uVar8 = DAT_2000_b5e4 < 200;
    uVar9 = DAT_2000_b5e4 == 200;
    if (200 < (int)DAT_2000_b5e4) break;
    wVar3 = 3;
    uVar10 = qb3f_b6(DAT_2000_b5e4,3,wVar1,0x4e28,0xbd2e);
    wVar1 = qb3f_b7((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),0x4e28,0xbd2e);
    qb3f_b8(wVar1,DAT_2000_b5e4 * 4 + 0x1b92,DAT_2000_b5e4,0x4e28,0xbd2e);
    DAT_2000_b5e4 = extraout_DX + 1;
    wVar1 = DAT_2000_b5e4;
  }
  wVar3 = 3;
  uVar10 = qb3e_21(DAT_2000_b5e4,3,wVar1,0x4e28,0xbd2e);
  qb3f_9f((word)uVar10,wVar3,(word)((ulong)uVar10 >> 0x10),0xb48c,0xcea8);
  if ((bool)uVar8) {
    DAT_2000_b640 = 1;
    uVar10 = FUN_1000_c7a5();
  }
  else {
    DAT_2000_b640 = 2;
    uVar10 = FUN_1000_c7bb();
  }
  wVar1 = 0x9b06;
  uVar10 = qb3f_57((word)uVar10,0x9b06,(word)((ulong)uVar10 >> 0x10),0xb48c,0xcea8);
  qb3f_7d((word)uVar10,wVar1,(word)((ulong)uVar10 >> 0x10),0xb48c,0xb774);
  puVar2 = (undefined *)&lit_BIN;
  wVar1 = qb3f_55(0xb4be,0xd360,dx_02,0xb48c,0xb774);
  uVar10 = qb3e_1a(wVar1,(word)puVar2,0xb774,0xb48c,0xb774);
  uVar10 = qb3f_9f((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb462,0xb7f6);
  if ((bool)uVar9) {
    uVar10 = FUN_1000_300c();
  }
  uVar10 = qb3f_a7((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0x1bba,0xb7f6);
  if ((bool)uVar9) {
    uVar10 = FUN_1000_b2cf();
  }
  uVar10 = qb3f_7b((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb7ee,0x1bc2);
  uVar10 = qb3f_7b((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb7ee,0x1bc6);
  qb3f_7b((word)uVar10,(word)puVar2,(word)((ulong)uVar10 >> 0x10),0xb7ee,0x1bca);
  return;
}


// ==== FUN_1000_b9b3 @ 1000:b9b3 (size 35) callers: FUN_1000_ba10,entry

void __cdecl16near FUN_1000_b9b3(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word bx;
  word unaff_SI;
  word si;
  word unaff_DI;
  undefined4 uVar1;
  
  uVar1 = qb3d_34(in_AX,in_BX,in_DX,unaff_SI,unaff_DI);
  uVar1 = qb3f_91((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),unaff_SI,0xb7fa);
  bx = 0x1a;
  uVar1 = qb3d_03((word)uVar1,0x1a,(word)((ulong)uVar1 >> 0x10),unaff_SI,0xb7fa);
  uVar1 = qb3f_77((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),unaff_SI,0xb7fa);
  si = bx * 4 + 0x19e6;
  uVar1 = qb3f_75((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),si,0xb7fa);
  qb3e_35((word)uVar1,bx,(word)((ulong)uVar1 >> 0x10),si,0xb7fa);
  return;
}


// ==== FUN_1000_b9d6 @ 1000:b9d6 (size 58) callers: FUN_1000_c33b

void __cdecl16near FUN_1000_b9d6(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  word si;
  word di;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar1;
  
  uVar1 = qb3f_7f(in_AX,in_BX,in_DX,0xb780,0xb7f6);
  uVar1 = qb3f_7d((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb780,0xb780);
  di = 0xb7fa;
  uVar1 = qb3f_9f((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb780,0xb7fa);
  if (!(bool)in_CF && !(bool)in_ZF) {
    di = 0xb780;
    uVar1 = qb3f_7b((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xbe66,0xb780);
  }
  uVar1 = qb3f_75((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),0xb780,di);
  si = in_BX * 4 + 0x19e6;
  uVar1 = qb3f_75((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),si,di);
  qb3e_35((word)uVar1,in_BX,(word)((ulong)uVar1 >> 0x10),si,di);
  return;
}


// ==== FUN_1000_ba10 @ 1000:ba10 (size 1352) callers: entry

void __cdecl16near FUN_1000_ba10(void)

{
  word in_AX;
  undefined *bx;
  uint bx_00;
  word in_DX;
  word dx;
  word ax;
  word extraout_DX;
  word ax_00;
  uint uVar1;
  word extraout_DX_00;
  word extraout_DX_01;
  word extraout_DX_02;
  word extraout_DX_03;
  int extraout_DX_04;
  int extraout_DX_05;
  int extraout_DX_06;
  int extraout_DX_07;
  int extraout_DX_08;
  word extraout_DX_09;
  int extraout_DX_10;
  int extraout_DX_11;
  int extraout_DX_12;
  undefined *puVar2;
  word wVar3;
  word wVar4;
  word ax_01;
  int iVar5;
  undefined2 *bx_01;
  word unaff_SI;
  word unaff_DI;
  word wVar6;
  undefined1 uVar7;
  undefined1 uVar8;
  undefined4 uVar9;
  ulong uVar10;
  undefined *puVar11;
  
  qb3e_5b(in_AX,0,in_DX,unaff_SI,unaff_DI);
  uVar9 = FUN_1000_b9b3();
  puVar2 = (undefined *)&lit_I;
  uVar9 = qb3e_1f((word)uVar9,0xb7e0,(word)((ulong)uVar9 >> 0x10),unaff_SI,unaff_DI);
  uVar9 = qb3d_34((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),unaff_SI,unaff_DI);
  uVar9 = qb3f_91((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb7fa);
  wVar3 = 0x1a;
  uVar9 = qb3d_03((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb7fa);
  wVar6 = 0xb7f6;
  uVar9 = qb3f_81((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb7f6);
  wVar4 = 0x1a;
  wVar3 = qb3d_11((word)uVar9,0x1a,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb7f6);
  qb3d_0a(wVar3,wVar4,2,unaff_SI,0xb7f6);
  wVar3 = qb3f_55(0xd76c,wVar4,dx,unaff_SI,0xb7f6);
  uVar7 = 0;
  uVar10 = qb3e_1e(wVar3,1,wVar4,unaff_SI,0xb7f6);
  do {
    DAT_2000_b784 = DAT_2000_b784 + 1;
    uVar8 = DAT_2000_b784 == 0;
    wVar3 = 1;
    uVar9 = qb3f_b6((word)uVar10,1,(word)(uVar10 >> 0x10),unaff_SI,wVar6);
    uVar9 = qb3f_b7((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
    puVar2 = (undefined *)0xb49c;
    uVar9 = qb3f_b8((word)uVar9,0xb49c,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
    uVar9 = qb3f_ba((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
    uVar9 = qb3f_57((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
    uVar9 = qb3f_7d((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb786);
    wVar3 = 0xb7f6;
    uVar9 = qb3f_6f((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),0xb7f6,0xb786);
    while( true ) {
      uVar9 = qb3f_7d((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),wVar3,0x4e28);
      wVar3 = qb3f_9f((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb786);
      if (!(bool)uVar7 && !(bool)uVar8) break;
      wVar4 = 0x4e28;
      qb3f_75(wVar3,0x4e28,0x4e28,0x4e28,0xb786);
      wVar6 = 0xb49c;
      wVar3 = qb3d_0a(ax,0xb49c,wVar4,0x4e28,0xb786);
      puVar2 = (undefined *)&lit_empty;
      uVar9 = qb3f_62(wVar6,0xd778,wVar3,0x4e28,0xb786);
      wVar3 = (word)((ulong)uVar9 >> 0x10);
      if ((bool)uVar8) {
        uVar9 = qb3f_7f((word)uVar9,(word)puVar2,wVar3,wVar3,0xb7d0);
        qb3f_77((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),wVar3,0xb7d0);
        ax_01 = 0xb49c;
        wVar4 = extraout_DX;
        wVar6 = qb3d_0b(0xb49c,0xb49c,(word)puVar2,wVar3,0xb7d0);
        puVar2 = (undefined *)&lit_empty;
        qb3f_55(ax_01,0xd77e,wVar6,wVar3,0xb7d0);
        wVar6 = ax_00;
        uVar9 = qb3f_ba(ax_00,ax_00,(word)puVar2,wVar3,0xb7d0);
        uVar9 = qb3f_57((word)uVar9,wVar6,(word)((ulong)uVar9 >> 0x10),wVar3,0xb7d0);
        uVar9 = qb3f_99((word)uVar9,wVar6,(word)((ulong)uVar9 >> 0x10),wVar3,wVar4);
        puVar11 = (undefined *)qb3f_77((word)uVar9,wVar6,(word)((ulong)uVar9 >> 0x10),wVar3,wVar4);
        bx = (undefined *)puVar11;
        puVar2 = bx;
        uVar9 = qb3d_0c((word)((ulong)puVar11 >> 0x10),(word)bx,wVar6,wVar3,wVar4);
        wVar6 = qb3f_55((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),wVar3,wVar4);
        uVar9 = qb3f_61(wVar6,(word)puVar2,(word)bx,wVar3,wVar4);
      }
      wVar3 = 0x4e28;
      uVar9 = qb3f_7f((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb7f6);
    }
    wVar4 = 0xb49c;
    bx_00 = 0xb49c;
    uVar9 = qb3d_0b(wVar3,0xb49c,1,0x4e28,0xb786);
    uVar9 = qb3d_13((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb786);
    uVar9 = qb3f_7a((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0x4e28,0xb786);
    uVar9 = qb3f_7d((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0x4e28,0x52fc);
    unaff_SI = 0x52fc;
    uVar9 = qb3f_a7((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),0x52fc,0x52fc);
    wVar3 = 0;
    if (!(bool)uVar7 && !(bool)uVar8) {
      wVar3 = 0xffff;
    }
    wVar6 = 0xbd32;
    wVar4 = qb3f_9f((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),0x52fc,0xbd32);
    uVar1 = 0;
    if ((bool)uVar7) {
      uVar1 = 0xffff;
    }
    if ((uVar1 & wVar3) == 0) {
      uVar10 = (ulong)wVar4;
      bx_00 = wVar3;
    }
    else {
      wVar6 = 0xb7d0;
      uVar9 = qb3f_7f(wVar4,wVar3,uVar1 & wVar3,0x52fc,0xb7d0);
      uVar9 = qb3f_77((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),0x52fc,0xb7d0);
      unaff_SI = wVar3 * 4 + 0x19e6;
      uVar9 = qb3f_75((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb7d0);
      uVar9 = qb3e_35((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb7d0);
      wVar3 = bx_00;
      qb3f_ba((word)uVar9,bx_00,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb7d0);
      wVar3 = qb3d_0c(bx_00,bx_00,wVar3 - 1,unaff_SI,0xb7d0);
      uVar10 = qb3f_61(wVar3,bx_00,wVar3,unaff_SI,0xb7d0);
    }
    wVar3 = (word)(uVar10 >> 0x10);
    if (0x18 < DAT_2000_b784) break;
    if (DAT_2000_b784 < 0x18) {
      uVar9 = qb3f_bc((word)uVar10,bx_00,wVar3,unaff_SI,wVar6);
      wVar3 = 0xb49c;
      uVar9 = qb3f_6e((word)uVar9,0xb49c,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
      uVar9 = qb3e_79((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
    }
    else {
      uVar9 = qb3f_bc((word)uVar10,bx_00,wVar3,unaff_SI,wVar6);
      wVar3 = 0xb49c;
      uVar9 = qb3f_6a((word)uVar9,0xb49c,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
      uVar9 = qb3e_79((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
    }
    iVar5 = 1;
    uVar10 = qb3d_2f((word)uVar9,1,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
    uVar7 = 0;
  } while (iVar5 == 0);
  uVar9 = qb3e_21((word)uVar10,1,(word)(uVar10 >> 0x10),unaff_SI,wVar6);
  uVar9 = qb3e_42((word)uVar9,0x19,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
  wVar3 = 1;
  uVar9 = qb3e_44((word)uVar9,1,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
  uVar9 = qb3f_bc((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
  puVar2 = (undefined *)&lit_Please_read_this;
  uVar9 = qb3f_6a((word)uVar9,0xd784,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
  wVar3 = qb3e_79((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
  qb3f_61(wVar3,0xd79c,0xb49c,unaff_SI,wVar6);
  uVar9 = FUN_1000_05cb();
  wVar3 = 0x8366;
  uVar9 = qb3f_57((word)uVar9,0x8366,(word)((ulong)uVar9 >> 0x10),unaff_SI,wVar6);
  wVar3 = qb3f_7d((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
  uVar9 = qb3e_1a(wVar3,0xd7c2,0xb774,unaff_SI,0xb774);
  wVar3 = qb3e_1f((word)uVar9,0xb7e0,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
  qb3e_1e(wVar3,1,0xd7cc,unaff_SI,0xb774);
  wVar3 = extraout_DX_00;
  for (DAT_2000_b5e4 = 1; (int)DAT_2000_b5e4 < 7; DAT_2000_b5e4 = DAT_2000_b5e4 + 1) {
    wVar4 = 1;
    uVar9 = qb3f_b6(DAT_2000_b5e4,1,wVar3,unaff_SI,0xb774);
    wVar3 = qb3f_b7((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    uVar9 = qb3f_b8(wVar3,DAT_2000_b5e4 * 4 + 0x2126,DAT_2000_b5e4,unaff_SI,0xb774);
    wVar3 = (word)((ulong)uVar9 >> 0x10);
    if (wVar3 == 3) {
      qb3f_61((word)uVar9,0xd7d6,0xb49c,unaff_SI,0xb774);
      FUN_1000_05cb();
      wVar3 = extraout_DX_01;
    }
    for (DAT_2000_b65c = 1; (int)DAT_2000_b65c < 3; DAT_2000_b65c = DAT_2000_b65c + 1) {
      wVar4 = 1;
      uVar9 = qb3f_b6(DAT_2000_b65c,1,wVar3,unaff_SI,0xb774);
      qb3f_b7((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
      wVar3 = ((int)((long)(int)DAT_2000_b65c * 7) + DAT_2000_b5e4) * 4 + 0x2006;
      uVar9 = qb3f_b8(wVar3,wVar3,(word)((ulong)((long)(int)DAT_2000_b65c * 7) >> 0x10),unaff_SI,
                      0xb774);
      wVar3 = 1;
      uVar9 = qb3f_b6((word)uVar9,1,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
      qb3f_b7((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
      wVar3 = ((int)((long)(int)DAT_2000_b65c * 7) + DAT_2000_b5e4) * 4 + 0x1fb2;
      uVar9 = qb3f_b8(wVar3,wVar3,(word)((ulong)((long)(int)DAT_2000_b65c * 7) >> 0x10),unaff_SI,
                      0xb774);
      wVar3 = 1;
      uVar9 = qb3f_b6((word)uVar9,1,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
      qb3f_b7((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
      wVar3 = ((int)((long)(int)DAT_2000_b65c * 0x15) + DAT_2000_b5e4 + 7) * 4 + 0x1a46;
      uVar9 = qb3f_b8(wVar3,wVar3,(word)((ulong)((long)(int)DAT_2000_b65c * 0x15) >> 0x10),unaff_SI,
                      0xb774);
      wVar3 = 1;
      uVar9 = qb3f_b6((word)uVar9,1,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
      qb3f_b7((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
      wVar3 = ((int)((long)(int)DAT_2000_b65c * 0x15) + DAT_2000_b5e4 + 0xe) * 4 + 0x1a46;
      qb3f_b8(wVar3,wVar3,(word)((ulong)((long)(int)DAT_2000_b65c * 0x15) >> 0x10),unaff_SI,0xb774);
      wVar3 = extraout_DX_02;
    }
  }
  wVar3 = qb3e_21(DAT_2000_b5e4,1,wVar3,unaff_SI,0xb774);
  qb3f_61(wVar3,0xd7ec,0xb49c,unaff_SI,0xb774);
  uVar9 = FUN_1000_05cb();
  wVar3 = qb3e_1f((word)uVar9,0xb7e0,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
  qb3e_1e(wVar3,1,0xd802,unaff_SI,0xb774);
  DAT_2000_b5e4 = 1;
  wVar3 = extraout_DX_03;
  while ((int)DAT_2000_b5e4 < 7) {
    wVar4 = 1;
    uVar9 = qb3f_b6(DAT_2000_b5e4,1,wVar3,unaff_SI,0xb774);
    wVar3 = qb3f_b7((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    iVar5 = DAT_2000_b5e4 * 2;
    uVar9 = qb3f_b8(wVar3,(word)((undefined2 *)&DAT_2000_1ec6 + DAT_2000_b5e4),DAT_2000_b5e4,
                    unaff_SI,0xb774);
    qb3f_b8((word)uVar9,(int)(undefined2 *)&DAT_2000_1eb6 + iVar5,(word)((ulong)uVar9 >> 0x10),
            unaff_SI,0xb774);
    DAT_2000_b5e4 = extraout_DX_04 + 1;
    wVar3 = DAT_2000_b5e4;
  }
  DAT_2000_b5e4 = 1;
  while ((int)DAT_2000_b5e4 < 8) {
    wVar4 = 1;
    uVar9 = qb3f_b6(DAT_2000_b5e4,1,wVar3,unaff_SI,0xb774);
    wVar3 = qb3f_b7((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    iVar5 = DAT_2000_b5e4 * 4;
    uVar9 = qb3f_b8(wVar3,iVar5 + 0x1a06,DAT_2000_b5e4,unaff_SI,0xb774);
    qb3f_b8((word)uVar9,iVar5 + 0x1a26,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    DAT_2000_b5e4 = extraout_DX_05 + 1;
    wVar3 = DAT_2000_b5e4;
  }
  DAT_2000_b5e4 = 1;
  while ((int)DAT_2000_b5e4 < 6) {
    wVar4 = 1;
    uVar9 = qb3f_b6(DAT_2000_b5e4,1,wVar3,unaff_SI,0xb774);
    wVar3 = qb3f_b7((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    iVar5 = DAT_2000_b5e4 * 2;
    uVar9 = qb3f_b8(wVar3,(word)((undefined2 *)&DAT_2000_1eb6 + DAT_2000_b5e4),DAT_2000_b5e4,
                    unaff_SI,0xb774);
    uVar9 = qb3f_b8((word)uVar9,(int)(undefined2 *)&DAT_2000_1ec6 + iVar5,
                    (word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    uVar9 = qb3f_b8((word)uVar9,iVar5 + 0x21aa,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    uVar9 = qb3f_b8((word)uVar9,iVar5 + 0x21ba,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    uVar9 = qb3f_b8((word)uVar9,iVar5 + 0x216a,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    uVar9 = qb3f_b8((word)uVar9,iVar5 + 0x217a,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    uVar9 = qb3f_b8((word)uVar9,iVar5 + 0x218a,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    qb3f_b8((word)uVar9,iVar5 + 0x219a,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    DAT_2000_b5e4 = extraout_DX_06 + 1;
    wVar3 = DAT_2000_b5e4;
  }
  DAT_2000_b5e4 = 1;
  while ((int)DAT_2000_b5e4 < 10) {
    wVar4 = 1;
    uVar9 = qb3f_b6(DAT_2000_b5e4,1,wVar3,unaff_SI,0xb774);
    wVar3 = qb3f_b7((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    qb3f_b8(wVar3,DAT_2000_b5e4 * 4 + 0xb3f6,DAT_2000_b5e4,unaff_SI,0xb774);
    DAT_2000_b5e4 = extraout_DX_07 + 1;
    wVar3 = DAT_2000_b5e4;
  }
  DAT_2000_b5e4 = 1;
  while ((int)DAT_2000_b5e4 < 10) {
    wVar4 = 1;
    uVar9 = qb3f_b6(DAT_2000_b5e4,1,wVar3,unaff_SI,0xb774);
    wVar3 = qb3f_b7((word)uVar9,wVar4,(word)((ulong)uVar9 >> 0x10),unaff_SI,0xb774);
    qb3f_b8(wVar3,DAT_2000_b5e4 * 4 + 0x2142,DAT_2000_b5e4,unaff_SI,0xb774);
    DAT_2000_b5e4 = extraout_DX_08 + 1;
    wVar3 = DAT_2000_b5e4;
  }
  puVar2 = (undefined *)&lit_G8F8_G16F8G8L8D_4_C8D_4_L4C8D;
  uVar9 = qb3f_61(DAT_2000_b5e4,0xd80c,0xb49c,unaff_SI,0xb774);
  uVar9 = qb3f_7b((word)uVar9,(word)puVar2,(word)((ulong)uVar9 >> 0x10),0xd82e,0x1a0a);
  wVar4 = 0xd82e;
  uVar9 = qb3f_7b((word)uVar9,0xd82e,(word)((ulong)uVar9 >> 0x10),0xd832,0x1a0e);
  wVar6 = 0xd832;
  wVar3 = qb3f_7b((word)uVar9,0xd832,(word)((ulong)uVar9 >> 0x10),wVar4,0x1a12);
  uVar9 = qb3f_7b(wVar3,wVar6,wVar4,0xd836,0x1a16);
  wVar3 = (word)((ulong)uVar9 >> 0x10);
  uVar9 = qb3f_7b((word)uVar9,wVar6,wVar3,wVar3,0x1a1a);
  uVar9 = qb3f_7b((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),wVar6,0x1a1e);
  wVar4 = (word)((ulong)uVar9 >> 0x10);
  qb3f_7b((word)uVar9,wVar3,wVar4,wVar4,0x1a22);
  FUN_1000_05cb();
  DAT_2000_b5e4 = 1;
  wVar3 = extraout_DX_09;
  while ((int)DAT_2000_b5e4 < 8) {
    wVar6 = 1;
    uVar9 = qb3f_b6(DAT_2000_b5e4,1,wVar3,wVar4,0x1a22);
    wVar3 = qb3f_b7((word)uVar9,wVar6,(word)((ulong)uVar9 >> 0x10),wVar4,0x1a22);
    qb3f_b8(wVar3,DAT_2000_b5e4 * 4 + 0x21ea,DAT_2000_b5e4,wVar4,0x1a22);
    DAT_2000_b5e4 = extraout_DX_10 + 1;
    wVar3 = DAT_2000_b5e4;
  }
  DAT_2000_b5e4 = 1;
  while ((int)DAT_2000_b5e4 < 7) {
    wVar6 = 1;
    uVar9 = qb3f_b6(DAT_2000_b5e4,1,wVar3,wVar4,0x1a22);
    wVar3 = qb3f_b7((word)uVar9,wVar6,(word)((ulong)uVar9 >> 0x10),wVar4,0x1a22);
    qb3f_b8(wVar3,DAT_2000_b5e4 * 4 + 0x2216,DAT_2000_b5e4,wVar4,0x1a22);
    DAT_2000_b5e4 = extraout_DX_11 + 1;
    wVar3 = DAT_2000_b5e4;
  }
  DAT_2000_b5e4 = 1;
  while ((int)DAT_2000_b5e4 < 0x10) {
    wVar6 = 1;
    uVar9 = qb3f_b6(DAT_2000_b5e4,1,wVar3,wVar4,0x1a22);
    wVar3 = qb3f_b7((word)uVar9,wVar6,(word)((ulong)uVar9 >> 0x10),wVar4,0x1a22);
    qb3f_b8(wVar3,DAT_2000_b5e4 * 4 + 0x5fe0,DAT_2000_b5e4,wVar4,0x1a22);
    DAT_2000_b5e4 = extraout_DX_12 + 1;
    wVar3 = DAT_2000_b5e4;
  }
  wVar3 = qb3e_21(DAT_2000_b5e4,1,wVar3,wVar4,0x1a22);
  qb3f_61(wVar3,0xd83a,0xb49c,wVar4,0x1a22);
  FUN_1000_05cb();
  wVar3 = FUN_1000_bf60();
  qb3f_61(wVar3,0xd860,0xb49c,wVar4,0x1a22);
  uVar9 = FUN_1000_05cb();
  wVar3 = 0x2242;
  uVar9 = qb3f_57((word)uVar9,0x2242,(word)((ulong)uVar9 >> 0x10),wVar4,0x1a22);
  wVar3 = qb3f_7d((word)uVar9,wVar3,(word)((ulong)uVar9 >> 0x10),wVar4,0xb774);
  uVar9 = qb3e_1a(wVar3,0xd730,0xb774,wVar4,0xb774);
  bx_01 = (undefined2 *)&DAT_2000_3824;
  uVar9 = qb3f_57((word)uVar9,0x3824,(word)((ulong)uVar9 >> 0x10),wVar4,0xb774);
  uVar9 = qb3f_7d((word)uVar9,(word)bx_01,(word)((ulong)uVar9 >> 0x10),wVar4,0xb774);
  qb3e_1a((word)uVar9,0xd73a,(word)((ulong)uVar9 >> 0x10),wVar4,0xb774);
  return;
}


// ==== FUN_1000_bf60 @ 1000:bf60 (size 90) callers: FUN_1000_ba10

void __cdecl16near FUN_1000_bf60(void)

{
  word in_AX;
  word in_DX;
  word in_BX;
  undefined1 *bx;
  undefined1 *bx_00;
  int unaff_BP;
  undefined2 unaff_ES;
  undefined2 unaff_SS;
  undefined1 in_ZF;
  undefined1 uVar1;
  undefined4 uVar2;
  
  uVar2 = qb3f_7b(in_AX,in_BX,in_DX,0xd8a6,0xb6d0);
  uVar2 = qb3d_43((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xd8a6,0xb6d0);
  uVar2 = qb3f_7d((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xd8a6,0x52fc);
  do {
    uVar1 = in_ZF;
    uVar2 = qb3d_43((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xd8a6,0x52fc);
    uVar2 = qb3f_a1((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xd8a6,0x52fc);
    in_ZF = 1;
  } while ((bool)uVar1);
  uVar2 = qb3d_43((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xd8a6,0x52fc);
  uVar2 = qb3f_7d((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xd8a6,0x52fc);
  uVar2 = qb3f_7f((word)uVar2,in_BX,(word)((ulong)uVar2 >> 0x10),0xb6d0,0xb7f6);
  bx = (undefined1 *)0xb7f6;
  uVar2 = qb3f_7d((word)uVar2,0xb7f6,(word)((ulong)uVar2 >> 0x10),0xb7f6,0xb6d0);
  uVar2 = qb3d_43((word)uVar2,(word)bx,(word)((ulong)uVar2 >> 0x10),0xb7f6,0xb6d0);
  bx_00 = bx;
  uVar2 = qb3f_71((word)uVar2,(word)bx,(word)((ulong)uVar2 >> 0x10),0x52fc,(word)bx);
  uVar2 = qb3f_7f((word)uVar2,(word)bx_00,(word)((ulong)uVar2 >> 0x10),0x52fc,(word)bx);
  uVar2 = qb3f_a5((word)uVar2,(word)bx_00,(word)((ulong)uVar2 >> 0x10),0x52fc,(word)bx);
  *(byte *)(unaff_BP + 0x52d7) = *(byte *)(unaff_BP + 0x52d7) ^ 0xbf;
  *bx = (char)uVar2;
  uVar2 = qb3f_87((word)uVar2,(word)bx_00,(word)((ulong)uVar2 >> 0x10),0x52fc,(word)(bx + 1));
  qb3f_7d((word)uVar2,(word)bx_00,(word)((ulong)uVar2 >> 0x10),0x52fc,0x52fc);
  return;
}


// ==== FUN_1000_bfba @ 1000:bfba (size 115) callers: entry

void __cdecl16near FUN_1000_bfba(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word dx;
  word dx_00;
  word in_BX;
  undefined *bx;
  word si;
  word wVar2;
  undefined1 uVar3;
  undefined4 uVar4;
  
  wVar2 = 0x4e28;
  si = 0xd8ae;
  uVar4 = qb3f_7b(in_AX,in_BX,in_DX,0xd8ae,0x4e28);
  wVar1 = qb3e_1f((word)uVar4,0xb7e0,(word)((ulong)uVar4 >> 0x10),0xd8ae,0x4e28);
  uVar4 = qb3e_1e(wVar1,2,0xd8b2,0xd8ae,0x4e28);
  while( true ) {
    wVar1 = 2;
    uVar4 = qb3f_b6((word)uVar4,2,(word)((ulong)uVar4 >> 0x10),si,wVar2);
    uVar4 = qb3f_b7((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),si,wVar2);
    wVar1 = qb3f_7f((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb7f6);
    wVar2 = 0x4e28;
    uVar4 = qb3f_71(wVar1,0x4e28,0x4e28,0x4e28,0xb7f6);
    uVar4 = qb3f_77((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb7f6);
    wVar1 = wVar2 * 4 + 0x205a;
    uVar3 = wVar1 == 0;
    qb3f_b8((word)uVar4,wVar1,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb7f6);
    bx = (undefined *)&lit_END;
    uVar4 = qb3f_62(wVar1,0xd8bc,dx,0x4e28,0xb7f6);
    wVar2 = (word)((ulong)uVar4 >> 0x10);
    if ((bool)uVar3) break;
    si = 0xb7b0;
    uVar4 = qb3f_7b((word)uVar4,(word)bx,wVar2,0xb7b0,wVar2);
  }
  uVar4 = qb3f_7b((word)uVar4,(word)bx,wVar2,0x4e28,0xb738);
  qb3f_75((word)uVar4,(word)bx,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb738);
  DAT_2000_b740 = bx;
  qb3e_21((word)bx,2,dx_00,0x4e28,0xb738);
  return;
}


// ==== FUN_1000_c02d @ 1000:c02d (size 213) callers: FUN_1000_a249

void __cdecl16near FUN_1000_c02d(void)

{
  word in_AX;
  word wVar1;
  uint uVar2;
  word in_DX;
  word dx;
  uint dx_00;
  word in_BX;
  word wVar3;
  undefined *bx;
  word si;
  undefined1 uVar4;
  undefined1 uVar5;
  bool bVar6;
  undefined4 uVar7;
  
  uVar7 = qb3f_7b(in_AX,in_BX,in_DX,0xb7ee,0x4e28);
  wVar1 = qb3e_1f((word)uVar7,0xbcf0,(word)((ulong)uVar7 >> 0x10),0xb7ee,0x4e28);
  wVar3 = 2;
  uVar4 = 0;
  uVar5 = 1;
  uVar7 = qb3e_1e(wVar1,2,0xd8b2,0xb7ee,0x4e28);
  uVar7 = qb3f_9f((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),0xb738,0xb7ee);
  if ((bool)uVar5) {
    uVar7 = qb3f_7b((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),0xb7f6,0xb738);
  }
  uVar7 = qb3f_7b((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),0xb738,0xb78a);
  wVar1 = 0xb7f6;
  uVar7 = qb3f_6f((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),0xb7f6,0xb78a);
  while( true ) {
    uVar7 = qb3f_7d((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),wVar1,0x4e28);
    uVar7 = qb3f_9f((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb78a);
    wVar1 = (word)((ulong)uVar7 >> 0x10);
    if (!(bool)uVar4 && !(bool)uVar5) break;
    wVar1 = qb3f_9f((word)uVar7,wVar3,wVar1,0xb73c,0xb7f6);
    wVar3 = 0;
    if ((bool)uVar5) {
      wVar3 = 0xffff;
    }
    si = 0x4e28;
    qb3f_75(wVar1,wVar3,wVar3,0x4e28,0xb7f6);
    wVar1 = wVar3 * 4 + 0x205a;
    bVar6 = wVar1 == 0;
    uVar7 = qb3f_62(0xb466,wVar1,dx,0x4e28,0xb7f6);
    dx_00 = (uint)((ulong)uVar7 >> 0x10);
    uVar2 = 0;
    if (bVar6) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & dx_00) != 0) {
      si = 0xb738;
      wVar3 = qb3f_7f((word)uVar7,wVar1,dx_00,0xb738,0xb7f6);
      uVar7 = qb3f_77(wVar3,wVar1,wVar1,0xb738,0xb7f6);
      uVar7 = qb3f_61((word)uVar7,wVar1 * 4 + 0x205a,(word)((ulong)uVar7 >> 0x10),0xb738,0xb7f6);
    }
    wVar1 = 2;
    uVar7 = qb3e_07((word)uVar7,2,(word)((ulong)uVar7 >> 0x10),si,0xb7f6);
    uVar7 = qb3f_75((word)uVar7,wVar1,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7f6);
    uVar4 = 0xdfa5 < wVar1 * 4;
    wVar3 = wVar1 * 4 + 0x205a;
    uVar5 = wVar3 == 0;
    uVar7 = qb3f_6e((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7f6);
    uVar7 = qb3e_79((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7f6);
    wVar1 = 0x4e28;
    uVar7 = qb3f_7f((word)uVar7,wVar3,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb7f6);
  }
  wVar3 = 2;
  wVar1 = qb3e_07((word)uVar7,2,wVar1,0x4e28,0xb78a);
  bx = (undefined *)&lit_END;
  uVar7 = qb3f_6e(wVar1,0xd8bc,wVar3,0x4e28,0xb78a);
  uVar7 = qb3e_79((word)uVar7,(word)bx,(word)((ulong)uVar7 >> 0x10),0x4e28,0xb78a);
  wVar1 = (word)((ulong)uVar7 >> 0x10);
  qb3e_21((word)uVar7,wVar1,wVar1,0x4e28,0xb78a);
  return;
}


// ==== FUN_1000_c102 @ 1000:c102 (size 560) callers: FUN_1000_4275

void __cdecl16near FUN_1000_c102(void)

{
  word in_AX;
  word wVar1;
  word wVar2;
  word in_DX;
  uint uVar3;
  word in_BX;
  uint uVar4;
  undefined2 *puVar5;
  undefined1 in_ZF;
  bool bVar6;
  undefined1 uVar7;
  undefined4 uVar8;
  ulong uVar9;
  
  uVar8 = qb3f_7f(in_AX,in_BX,in_DX,0xb62c,0xb7d8);
  uVar8 = qb3f_7d((word)uVar8,in_BX,(word)((ulong)uVar8 >> 0x10),0xb62c,0xb78e);
  uVar8 = qb3f_7f((word)uVar8,in_BX,(word)((ulong)uVar8 >> 0x10),0xb630,0xb7f6);
  uVar8 = qb3f_7d((word)uVar8,in_BX,(word)((ulong)uVar8 >> 0x10),0xb630,0xb792);
  uVar8 = qb3f_9f((word)uVar8,in_BX,(word)((ulong)uVar8 >> 0x10),0xb634,0xbb68);
  uVar4 = 0;
  if ((bool)in_ZF) {
    uVar4 = 0xffff;
  }
  bVar6 = false;
  puVar5 = (undefined2 *)&DAT_2000_bb60;
  wVar1 = qb3f_9f((word)uVar8,uVar4,(word)((ulong)uVar8 >> 0x10),0xb638,0xbb60);
  uVar3 = 0;
  if (bVar6) {
    uVar3 = 0xffff;
  }
  bVar6 = (uVar3 & uVar4) == 0;
  if (bVar6) {
    uVar8 = qb3f_9f(wVar1,uVar4,0,0xb634,0xbb60);
    uVar4 = 0;
    if (bVar6) {
      uVar4 = 0xffff;
    }
    bVar6 = false;
    puVar5 = (undefined2 *)0xb7d8;
    wVar1 = qb3f_9f((word)uVar8,uVar4,(word)((ulong)uVar8 >> 0x10),0xb638,0xb7d8);
    uVar3 = 0;
    if (bVar6) {
      uVar3 = 0xffff;
    }
    bVar6 = (uVar3 & uVar4) == 0;
    if (bVar6) {
      uVar8 = qb3f_9f(wVar1,uVar4,0,0xb634,0xbd1e);
      uVar4 = 0;
      if (bVar6) {
        uVar4 = 0xffff;
      }
      bVar6 = false;
      puVar5 = (undefined2 *)0xbd22;
      wVar1 = qb3f_9f((word)uVar8,uVar4,(word)((ulong)uVar8 >> 0x10),0xb638,0xbd22);
      uVar3 = 0;
      if (bVar6) {
        uVar3 = 0xffff;
      }
      bVar6 = (uVar3 & uVar4) == 0;
      if (bVar6) {
        uVar8 = qb3f_9f(wVar1,uVar4,0,0xb634,0xbd26);
        wVar1 = 0;
        if (bVar6) {
          wVar1 = 0xffff;
        }
        bVar6 = false;
        uVar4 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb638,0xbb60);
        uVar3 = 0;
        if (bVar6) {
          uVar3 = 0xffff;
        }
        uVar7 = (uVar3 & wVar1) == 0;
        if ((bool)uVar7) {
          uVar9 = (ulong)uVar4;
        }
        else {
          wVar2 = qb3e_89(0xffff,0xb78e,0xb792,0xb638,0xbb60);
          wVar1 = 0x523e;
          uVar9 = qb3e_58(wVar2,0x523e,3,0xb638,0xbb60);
        }
        uVar8 = qb3f_9f((word)uVar9,wVar1,(word)(uVar9 >> 0x10),0xb634,0xbb68);
        wVar1 = 0;
        if ((bool)uVar7) {
          wVar1 = 0xffff;
        }
        bVar6 = false;
        uVar4 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb638,0xb7f2);
        uVar3 = 0;
        if (bVar6) {
          uVar3 = 0xffff;
        }
        uVar7 = (uVar3 & wVar1) == 0;
        if ((bool)uVar7) {
          uVar9 = (ulong)uVar4;
        }
        else {
          wVar2 = qb3e_89(0xffff,0xb78e,0xb792,0xb638,0xb7f2);
          wVar1 = 0x5250;
          uVar9 = qb3e_58(wVar2,0x5250,3,0xb638,0xb7f2);
        }
        uVar8 = qb3f_9f((word)uVar9,wVar1,(word)(uVar9 >> 0x10),0xb634,0xbd2a);
        wVar1 = 0;
        if ((bool)uVar7) {
          wVar1 = 0xffff;
        }
        bVar6 = false;
        uVar4 = qb3f_9f((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0xb638,0xbd2e);
        uVar3 = 0;
        if (bVar6) {
          uVar3 = 0xffff;
        }
        uVar7 = (uVar3 & wVar1) == 0;
        if ((bool)uVar7) {
          uVar9 = (ulong)uVar4;
        }
        else {
          wVar2 = qb3e_89(0xffff,0xb78e,0xb792,0xb638,0xbd2e);
          wVar1 = 0x5250;
          uVar9 = qb3e_58(wVar2,0x5250,3,0xb638,0xbd2e);
        }
        uVar8 = qb3f_9f((word)uVar9,wVar1,(word)(uVar9 >> 0x10),0xb634,0xbd1e);
        uVar4 = 0;
        if ((bool)uVar7) {
          uVar4 = 0xffff;
        }
        bVar6 = false;
        puVar5 = (undefined2 *)&DAT_2000_bb60;
        wVar1 = qb3f_9f((word)uVar8,uVar4,(word)((ulong)uVar8 >> 0x10),0xb638,0xbb60);
        uVar3 = 0;
        if (bVar6) {
          uVar3 = 0xffff;
        }
        bVar6 = (uVar3 & uVar4) == 0;
        if (bVar6) {
          uVar8 = qb3f_9f(wVar1,uVar4,0,0xb634,0xbd26);
          uVar4 = 0;
          if (bVar6) {
            uVar4 = 0xffff;
          }
          bVar6 = false;
          puVar5 = (undefined2 *)0xbd1e;
          wVar1 = qb3f_9f((word)uVar8,uVar4,(word)((ulong)uVar8 >> 0x10),0xb638,0xbd1e);
          uVar3 = 0;
          if (bVar6) {
            uVar3 = 0xffff;
          }
          bVar6 = (uVar3 & uVar4) == 0;
          if (bVar6) {
            uVar8 = qb3f_9f(wVar1,uVar4,0,0xb634,0xb7d8);
            uVar4 = 0;
            if (bVar6) {
              uVar4 = 0xffff;
            }
            bVar6 = false;
            puVar5 = (undefined2 *)0xbd32;
            wVar1 = qb3f_9f((word)uVar8,uVar4,(word)((ulong)uVar8 >> 0x10),0xb638,0xbd32);
            uVar3 = 0;
            if (bVar6) {
              uVar3 = 0xffff;
            }
            bVar6 = (uVar3 & uVar4) == 0;
            if (bVar6) {
              uVar8 = qb3f_9f(wVar1,uVar4,0,0xb634,0xb7fa);
              uVar4 = 0;
              if (bVar6) {
                uVar4 = 0xffff;
              }
              bVar6 = false;
              qb3f_9f((word)uVar8,uVar4,(word)((ulong)uVar8 >> 0x10),0xb638,0xbd2a);
              uVar3 = 0;
              if (bVar6) {
                uVar3 = 0xffff;
              }
              if ((uVar3 & uVar4) != 0) {
                wVar1 = qb3e_89(0xffff,0xb78e,0xb792,0xb638,0xbd2a);
                qb3e_58(wVar1,0x5274,3,0xb638,0xbd2a);
              }
              return;
            }
          }
        }
        wVar1 = qb3e_89(0xffff,0xb78e,0xb792,0xb638,(word)puVar5);
        qb3e_58(wVar1,0x522c,3,0xb638,(word)puVar5);
        return;
      }
    }
  }
  wVar1 = qb3e_89(0xffff,0xb78e,0xb792,0xb638,(word)puVar5);
  qb3e_58(wVar1,0x5262,0,0xb638,(word)puVar5);
  return;
}


// ==== FUN_1000_c332 @ 1000:c332 (size 9) callers: FUN_1000_0cd2,FUN_1000_c33b

void FUN_1000_c332(void)

{
  word in_AX;
  word wVar1;
  uint uVar2;
  word dx;
  word ax;
  word dx_00;
  word extraout_DX;
  word extraout_DX_00;
  undefined *puVar3;
  word wVar4;
  int iVar5;
  word unaff_SI;
  word unaff_DI;
  undefined1 uVar6;
  bool bVar7;
  undefined4 uVar8;
  
  uVar8 = qb3f_61(in_AX,0xd8c4,0xb70a,unaff_SI,unaff_DI);
  wVar1 = qb3e_5b((word)uVar8,0,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
  uVar8 = qb3e_04(wVar1,0x50,0xffff,unaff_SI,unaff_DI);
  DAT_2000_b796 = 0x19;
  wVar1 = qb3e_32((word)uVar8,0xffff,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
  DAT_2000_b784 = 0;
  uVar8 = qb3e_a1(wVar1,1,0x19,unaff_SI,unaff_DI);
  qb3e_1f((word)uVar8,0xb7e0,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
  puVar3 = (undefined *)&lit_OVL;
  wVar1 = qb3f_55(0xb70a,0xd8ca,dx,unaff_SI,unaff_DI);
  uVar8 = qb3e_1e(wVar1,1,(word)puVar3,unaff_SI,unaff_DI);
  do {
    DAT_2000_b784 = DAT_2000_b784 + 1;
    uVar6 = DAT_2000_b784 == 0;
    uVar8 = qb3f_b6((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    wVar4 = 0xb49c;
    wVar1 = qb3f_5a((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    wVar1 = qb3d_0b(wVar1,wVar4,1,unaff_SI,unaff_DI);
    qb3f_61(wVar1,wVar4,47000,unaff_SI,unaff_DI);
    puVar3 = (undefined *)&lit_empty;
    uVar8 = qb3f_62(ax,0xd8d2,ax,unaff_SI,unaff_DI);
    if ((bool)uVar6) {
      FUN_1000_b9d6();
      uVar8 = FUN_1000_c465();
    }
    wVar1 = (word)((ulong)uVar8 >> 0x10);
    if (DAT_2000_b784 == 0x19) {
      uVar8 = qb3e_42((word)uVar8,0x19,wVar1,unaff_SI,unaff_DI);
      wVar1 = 1;
      uVar8 = qb3e_44((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
      uVar8 = qb3f_bc((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
      wVar1 = 0xb49c;
      uVar8 = qb3f_6a((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
      qb3e_79((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    }
    else {
      uVar8 = qb3f_bc((word)uVar8,(word)puVar3,wVar1,unaff_SI,unaff_DI);
      wVar1 = 0xb49c;
      uVar8 = qb3f_6e((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
      qb3e_79((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    }
    wVar1 = 0;
    if (DAT_2000_b784 == 0x19) {
      wVar1 = 0xffff;
    }
    bVar7 = false;
    uVar8 = qb3f_62(0xb70a,0xd8c4,wVar1,unaff_SI,unaff_DI);
    uVar2 = 0;
    if (!bVar7) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & (uint)((ulong)uVar8 >> 0x10)) != 0) {
      uVar8 = FUN_1000_2f71();
      DAT_2000_b784 = 0;
      uVar8 = qb3e_32((word)uVar8,0xffff,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    }
    iVar5 = 1;
    uVar8 = qb3d_2f((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    uVar6 = iVar5 == 0;
  } while ((bool)uVar6);
  qb3e_21((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = qb3f_62(0xb70a,0xd8c4,dx_00,unaff_SI,unaff_DI);
  wVar4 = 0;
  if ((bool)uVar6) {
    wVar4 = 0xffff;
  }
  bVar7 = false;
  qb3f_62(wVar1,0xd062,wVar4,unaff_SI,unaff_DI);
  iVar5 = 0;
  if (bVar7) {
    iVar5 = -1;
  }
  uVar6 = iVar5 == 0 && extraout_DX == 0;
  wVar1 = extraout_DX;
  if (iVar5 != 0 || extraout_DX != 0) {
    FUN_1000_c47b();
    wVar1 = extraout_DX_00;
  }
  qb3f_62(0xb70a,0xd8c4,wVar1,unaff_SI,unaff_DI);
  if (!(bool)uVar6) {
    FUN_1000_b9d6();
    FUN_1000_c5b0();
    FUN_1000_c332();
    return;
  }
  FUN_1000_c551();
  return;
}


// ==== FUN_1000_c33b @ 1000:c33b (size 298) callers: FUN_1000_803a

void FUN_1000_c33b(void)

{
  word in_AX;
  word wVar1;
  uint uVar2;
  word in_DX;
  word dx;
  word ax;
  word dx_00;
  word extraout_DX;
  word extraout_DX_00;
  undefined *puVar3;
  word wVar4;
  int iVar5;
  word unaff_SI;
  word unaff_DI;
  undefined1 uVar6;
  bool bVar7;
  undefined4 uVar8;
  
  wVar1 = qb3e_5b(in_AX,0,in_DX,unaff_SI,unaff_DI);
  uVar8 = qb3e_04(wVar1,0x50,0xffff,unaff_SI,unaff_DI);
  DAT_2000_b796 = 0x19;
  wVar1 = qb3e_32((word)uVar8,0xffff,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
  DAT_2000_b784 = 0;
  uVar8 = qb3e_a1(wVar1,1,0x19,unaff_SI,unaff_DI);
  qb3e_1f((word)uVar8,0xb7e0,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
  puVar3 = (undefined *)&lit_OVL;
  wVar1 = qb3f_55(0xb70a,0xd8ca,dx,unaff_SI,unaff_DI);
  uVar8 = qb3e_1e(wVar1,1,(word)puVar3,unaff_SI,unaff_DI);
  do {
    DAT_2000_b784 = DAT_2000_b784 + 1;
    uVar6 = DAT_2000_b784 == 0;
    uVar8 = qb3f_b6((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    wVar4 = 0xb49c;
    wVar1 = qb3f_5a((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    wVar1 = qb3d_0b(wVar1,wVar4,1,unaff_SI,unaff_DI);
    qb3f_61(wVar1,wVar4,47000,unaff_SI,unaff_DI);
    puVar3 = (undefined *)&lit_empty;
    uVar8 = qb3f_62(ax,0xd8d2,ax,unaff_SI,unaff_DI);
    if ((bool)uVar6) {
      FUN_1000_b9d6();
      uVar8 = FUN_1000_c465();
    }
    wVar1 = (word)((ulong)uVar8 >> 0x10);
    if (DAT_2000_b784 == 0x19) {
      uVar8 = qb3e_42((word)uVar8,0x19,wVar1,unaff_SI,unaff_DI);
      wVar1 = 1;
      uVar8 = qb3e_44((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
      uVar8 = qb3f_bc((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
      wVar1 = 0xb49c;
      uVar8 = qb3f_6a((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
      qb3e_79((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    }
    else {
      uVar8 = qb3f_bc((word)uVar8,(word)puVar3,wVar1,unaff_SI,unaff_DI);
      wVar1 = 0xb49c;
      uVar8 = qb3f_6e((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
      qb3e_79((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    }
    wVar1 = 0;
    if (DAT_2000_b784 == 0x19) {
      wVar1 = 0xffff;
    }
    bVar7 = false;
    uVar8 = qb3f_62(0xb70a,0xd8c4,wVar1,unaff_SI,unaff_DI);
    uVar2 = 0;
    if (!bVar7) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & (uint)((ulong)uVar8 >> 0x10)) != 0) {
      uVar8 = FUN_1000_2f71();
      DAT_2000_b784 = 0;
      uVar8 = qb3e_32((word)uVar8,0xffff,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    }
    iVar5 = 1;
    uVar8 = qb3d_2f((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
    uVar6 = iVar5 == 0;
  } while ((bool)uVar6);
  qb3e_21((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = qb3f_62(0xb70a,0xd8c4,dx_00,unaff_SI,unaff_DI);
  wVar4 = 0;
  if ((bool)uVar6) {
    wVar4 = 0xffff;
  }
  bVar7 = false;
  qb3f_62(wVar1,0xd062,wVar4,unaff_SI,unaff_DI);
  iVar5 = 0;
  if (bVar7) {
    iVar5 = -1;
  }
  uVar6 = iVar5 == 0 && extraout_DX == 0;
  wVar1 = extraout_DX;
  if (iVar5 != 0 || extraout_DX != 0) {
    FUN_1000_c47b();
    wVar1 = extraout_DX_00;
  }
  qb3f_62(0xb70a,0xd8c4,wVar1,unaff_SI,unaff_DI);
  if (!(bool)uVar6) {
    FUN_1000_b9d6();
    FUN_1000_c5b0();
    FUN_1000_c332();
    return;
  }
  FUN_1000_c551();
  return;
}


// ==== FUN_1000_c465 @ 1000:c465 (size 22) callers: FUN_1000_c33b

void __cdecl16near FUN_1000_c465(void)

{
  word in_AX;
  word ax;
  word bx;
  int iVar1;
  word bx_00;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  iVar1 = -0x4b64;
  uVar2 = qb3f_ba(in_AX,0xb49c,0xb49c,unaff_SI,unaff_DI);
  bx = (word)((ulong)uVar2 >> 0x10);
  bx_00 = bx;
  ax = qb3d_0c((word)uVar2,bx,iVar1 - 1,unaff_SI,unaff_DI);
  qb3f_61(ax,bx_00,bx,unaff_SI,unaff_DI);
  return;
}


// ==== FUN_1000_c47b @ 1000:c47b (size 214) callers: FUN_1000_c33b

void __cdecl16near FUN_1000_c47b(void)

{
  word in_AX;
  word in_DX;
  word extraout_DX;
  word extraout_DX_00;
  word ax;
  word in_BX;
  undefined *puVar1;
  undefined1 *bx;
  word wVar2;
  int unaff_BP;
  word wVar3;
  word unaff_DI;
  undefined2 unaff_SS;
  undefined1 in_CF;
  undefined1 in_ZF;
  undefined4 uVar4;
  
  uVar4 = qb3f_a7(in_AX,in_BX,in_DX,0xb462,unaff_DI);
  wVar2 = (word)((ulong)uVar4 >> 0x10);
  if ((bool)in_ZF) {
    qb3e_35((word)uVar4,7,wVar2,0xb462,unaff_DI);
    wVar2 = extraout_DX;
  }
  else {
    qb3e_35((word)uVar4,0xf,wVar2,0xb462,unaff_DI);
    wVar2 = extraout_DX_00;
  }
  puVar1 = (undefined *)&lit_H1;
  uVar4 = qb3f_62(0xb70a,0xd8c4,wVar2,0xb462,unaff_DI);
  wVar2 = (word)((ulong)uVar4 >> 0x10);
  if ((bool)in_ZF) {
    wVar3 = 0xbc2e;
    uVar4 = qb3f_7b((word)uVar4,(word)puVar1,wVar2,0xbc2e,0x52fc);
    uVar4 = qb3e_42((word)uVar4,0xd,(word)((ulong)uVar4 >> 0x10),0xbc2e,0x52fc);
    wVar2 = 3;
    uVar4 = qb3e_44((word)uVar4,3,(word)((ulong)uVar4 >> 0x10),0xbc2e,0x52fc);
    uVar4 = qb3f_bc((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0xbc2e,0x52fc);
    bx = (undefined1 *)&lit_empty;
    uVar4 = qb3f_6e((word)uVar4,0xbce4,(word)((ulong)uVar4 >> 0x10),0xbc2e,0x52fc);
    uVar4 = qb3e_79((word)uVar4,(word)bx,(word)((ulong)uVar4 >> 0x10),0xbc2e,0x52fc);
    uVar4 = qb3e_42((word)uVar4,0x11,(word)((ulong)uVar4 >> 0x10),0xbc2e,0x52fc);
    wVar2 = 1;
    uVar4 = qb3e_44((word)uVar4,1,(word)((ulong)uVar4 >> 0x10),0xbc2e,0x52fc);
  }
  else {
    wVar3 = 0xbd26;
    uVar4 = qb3f_7b((word)uVar4,(word)puVar1,wVar2,0xbd26,0x52fc);
    wVar2 = 0xd;
    uVar4 = qb3e_44((word)uVar4,0xd,(word)((ulong)uVar4 >> 0x10),0xbd26,0x52fc);
  }
  uVar4 = qb3f_bc((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),wVar3,0x52fc);
  puVar1 = (undefined *)&lit_Esc;
  uVar4 = qb3f_6e((word)uVar4,0xd8d8,(word)((ulong)uVar4 >> 0x10),wVar3,0x52fc);
  uVar4 = qb3e_79((word)uVar4,(word)puVar1,(word)((ulong)uVar4 >> 0x10),wVar3,0x52fc);
  uVar4 = qb3f_7b((word)uVar4,(word)puVar1,(word)((ulong)uVar4 >> 0x10),0x52fc,0xb79c);
  wVar2 = 0xb7f6;
  uVar4 = qb3f_6f((word)uVar4,(word)puVar1,(word)((ulong)uVar4 >> 0x10),0xb7f6,0xb79c);
  while( true ) {
    uVar4 = qb3f_7d((word)uVar4,(word)puVar1,(word)((ulong)uVar4 >> 0x10),wVar2,0x4e28);
    wVar2 = qb3f_9f((word)uVar4,(word)puVar1,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb79c);
    if (!(bool)in_CF && !(bool)in_ZF) break;
    wVar3 = 0x4e28;
    qb3f_75(wVar2,0x4e28,0x4e28,0x4e28,0xb79c);
    in_CF = 0;
    in_ZF = 1;
    *(word *)(unaff_BP + -6) = wVar3;
    uVar4 = qb3d_2c(ax,wVar3,1,0x4e28,0xb79c);
    uVar4 = qb3d_05((word)uVar4,wVar3,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb79c);
    wVar2 = (word)((ulong)uVar4 >> 0x10);
    uVar4 = qb3f_61((word)uVar4,wVar3,0xb49c,0x4e28,0xb79c);
    uVar4 = qb3e_42((word)uVar4,*(word *)(unaff_BP + -6),(word)((ulong)uVar4 >> 0x10),0x4e28,0xb79c)
    ;
    uVar4 = qb3e_44((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb79c);
    uVar4 = qb3f_bc((word)uVar4,wVar2,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb79c);
    puVar1 = (undefined *)((ulong)uVar4 >> 0x10);
    uVar4 = qb3f_6e((word)uVar4,(word)puVar1,(word)puVar1,0x4e28,0xb79c);
    uVar4 = qb3e_79((word)uVar4,(word)puVar1,(word)((ulong)uVar4 >> 0x10),0x4e28,0xb79c);
    wVar2 = (word)uVar4;
    uVar4 = qb3f_7f(wVar2,(word)puVar1,(word)((ulong)uVar4 >> 0x10),wVar2,0xb7f6);
  }
  return;
}


// ==== FUN_1000_c551 @ 1000:c551 (size 95) callers: FUN_1000_c33b

void FUN_1000_c551(void)

{
  word wVar1;
  uint uVar2;
  word dx;
  word ax;
  word dx_00;
  word extraout_DX;
  word extraout_DX_00;
  int iVar3;
  word dx_01;
  undefined *puVar4;
  word wVar5;
  word unaff_SI;
  word unaff_DI;
  undefined1 in_CF;
  undefined1 uVar6;
  bool bVar7;
  undefined1 in_ZF;
  undefined4 uVar8;
  
  uVar8 = FUN_1000_2f71();
  wVar5 = 0xb49c;
  uVar8 = qb3d_13((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
  uVar8 = qb3f_7a((word)uVar8,wVar5,(word)((ulong)uVar8 >> 0x10),unaff_SI,unaff_DI);
  uVar8 = qb3f_7d((word)uVar8,wVar5,(word)((ulong)uVar8 >> 0x10),unaff_SI,0x52fc);
  uVar8 = qb3f_9f((word)uVar8,wVar5,(word)((ulong)uVar8 >> 0x10),0x52fc,0xb7f6);
  wVar5 = 0;
  if ((bool)in_CF) {
    wVar5 = 0xffff;
    in_ZF = 0;
  }
  wVar1 = qb3f_9f((word)uVar8,wVar5,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
  iVar3 = 0;
  if (!(bool)in_CF && !(bool)in_ZF) {
    iVar3 = -1;
  }
  if (iVar3 != 0 || wVar5 != 0) {
    DAT_2000_b796 = 0;
    qb3e_a1(wVar1,0xffff,0xffff,0x52fc,0xbb68);
    FUN_1000_2ff7();
    return;
  }
  iVar3 = -0x4b64;
  uVar8 = qb3f_bb(wVar1,0xb49c,0,0x52fc,0xbb68);
  wVar1 = iVar3 + 1;
  qb3d_05((word)uVar8,wVar1,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
  wVar5 = qb3f_55(0xb8a6,wVar1,dx_01,0x52fc,0xbb68);
  uVar8 = qb3f_61(wVar5,wVar1,0xb70a,0x52fc,0xbb68);
  wVar5 = qb3e_32((word)uVar8,0xffff,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
  DAT_2000_b784 = 0;
  uVar8 = qb3e_a1(wVar5,1,0x19,0x52fc,0xbb68);
  qb3e_1f((word)uVar8,0xb7e0,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
  puVar4 = (undefined *)&lit_OVL;
  wVar5 = qb3f_55(0xb70a,0xd8ca,dx,0x52fc,0xbb68);
  uVar8 = qb3e_1e(wVar5,1,(word)puVar4,0x52fc,0xbb68);
  do {
    DAT_2000_b784 = DAT_2000_b784 + 1;
    uVar6 = DAT_2000_b784 == 0;
    uVar8 = qb3f_b6((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
    wVar1 = 0xb49c;
    wVar5 = qb3f_5a((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
    wVar5 = qb3d_0b(wVar5,wVar1,1,0x52fc,0xbb68);
    qb3f_61(wVar5,wVar1,47000,0x52fc,0xbb68);
    puVar4 = (undefined *)&lit_empty;
    uVar8 = qb3f_62(ax,0xd8d2,ax,0x52fc,0xbb68);
    if ((bool)uVar6) {
      FUN_1000_b9d6();
      uVar8 = FUN_1000_c465();
    }
    wVar5 = (word)((ulong)uVar8 >> 0x10);
    if (DAT_2000_b784 == 0x19) {
      uVar8 = qb3e_42((word)uVar8,0x19,wVar5,0x52fc,0xbb68);
      wVar5 = 1;
      uVar8 = qb3e_44((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
      uVar8 = qb3f_bc((word)uVar8,wVar5,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
      wVar5 = 0xb49c;
      uVar8 = qb3f_6a((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
      qb3e_79((word)uVar8,wVar5,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
    }
    else {
      uVar8 = qb3f_bc((word)uVar8,(word)puVar4,wVar5,0x52fc,0xbb68);
      wVar5 = 0xb49c;
      uVar8 = qb3f_6e((word)uVar8,0xb49c,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
      qb3e_79((word)uVar8,wVar5,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
    }
    wVar5 = 0;
    if (DAT_2000_b784 == 0x19) {
      wVar5 = 0xffff;
    }
    bVar7 = false;
    uVar8 = qb3f_62(0xb70a,0xd8c4,wVar5,0x52fc,0xbb68);
    uVar2 = 0;
    if (!bVar7) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & (uint)((ulong)uVar8 >> 0x10)) != 0) {
      uVar8 = FUN_1000_2f71();
      DAT_2000_b784 = 0;
      uVar8 = qb3e_32((word)uVar8,0xffff,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
    }
    iVar3 = 1;
    uVar8 = qb3d_2f((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
    uVar6 = iVar3 == 0;
  } while ((bool)uVar6);
  qb3e_21((word)uVar8,1,(word)((ulong)uVar8 >> 0x10),0x52fc,0xbb68);
  wVar5 = qb3f_62(0xb70a,0xd8c4,dx_00,0x52fc,0xbb68);
  wVar1 = 0;
  if ((bool)uVar6) {
    wVar1 = 0xffff;
  }
  bVar7 = false;
  qb3f_62(wVar5,0xd062,wVar1,0x52fc,0xbb68);
  iVar3 = 0;
  if (bVar7) {
    iVar3 = -1;
  }
  uVar6 = iVar3 == 0 && extraout_DX == 0;
  wVar5 = extraout_DX;
  if (iVar3 != 0 || extraout_DX != 0) {
    FUN_1000_c47b();
    wVar5 = extraout_DX_00;
  }
  qb3f_62(0xb70a,0xd8c4,wVar5,0x52fc,0xbb68);
  if (!(bool)uVar6) {
    FUN_1000_b9d6();
    FUN_1000_c5b0();
    FUN_1000_c332();
    return;
  }
  FUN_1000_c551();
  return;
}


// ==== FUN_1000_c5b0 @ 1000:c5b0 (size 32) callers: FUN_1000_2f3c,FUN_1000_c33b

void __cdecl16near FUN_1000_c5b0(void)

{
  word in_AX;
  word in_DX;
  word wVar1;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar2;
  
  uVar2 = qb3e_42(in_AX,0x19,in_DX,unaff_SI,unaff_DI);
  wVar1 = DAT_2000_b796 + 10;
  uVar2 = qb3e_44((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  uVar2 = qb3f_bc((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  wVar1 = 0xb484;
  uVar2 = qb3f_6a((word)uVar2,0xb484,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  qb3e_79((word)uVar2,wVar1,(word)((ulong)uVar2 >> 0x10),unaff_SI,unaff_DI);
  FUN_1000_2f71();
  return;
}


// ==== FUN_1000_c5d0 @ 1000:c5d0 (size 469) callers: FUN_1000_35ac,FUN_1000_90d3

void __cdecl16near FUN_1000_c5d0(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  uint uVar2;
  int iVar3;
  uint dx;
  uint in_BX;
  uint uVar4;
  word wVar5;
  undefined *puVar6;
  uint uVar7;
  word wVar8;
  word unaff_DI;
  undefined2 *di;
  undefined1 uVar9;
  undefined1 uVar10;
  bool bVar11;
  undefined4 uVar12;
  
  if (DAT_2000_b5dc == 1) {
    uVar12 = qb3f_75(in_AX,in_BX,in_DX,0xb5b2,unaff_DI);
    uVar12 = qb3f_7b((word)uVar12,in_BX,(word)((ulong)uVar12 >> 0x10),in_BX * 4 + 0x5eac,0x52fc);
  }
  else {
    uVar12 = qb3f_75(in_AX,in_BX,in_DX,0xb5b2,unaff_DI);
    uVar12 = qb3f_7b((word)uVar12,in_BX,(word)((ulong)uVar12 >> 0x10),in_BX * 4 + 0x5ee0,0x52fc);
  }
  di = (undefined2 *)0x52fc;
  wVar1 = qb3f_75((word)uVar12,in_BX,(word)((ulong)uVar12 >> 0x10),0x52fc,0x52fc);
  uVar4 = in_BX & 1;
  if (uVar4 == 0) {
    uVar4 = 0xb490;
    uVar12 = qb3f_61(wVar1,0xb490,0xb7a0,0x52fc,0x52fc);
  }
  else {
    wVar1 = qb3f_75((word)((long)DAT_2000_b5dc * 7),uVar4,
                    (word)((ulong)((long)DAT_2000_b5dc * 7) >> 0x10),0xb5b2,0x52fc);
    uVar4 = (uVar4 + wVar1 + 0x15) * 4 + 0x1a46;
    uVar12 = qb3f_61(wVar1,uVar4,0xb7a0,0xb5b2,0x52fc);
  }
  wVar8 = 0x52fc;
  wVar1 = qb3f_75((word)uVar12,uVar4,(word)((ulong)uVar12 >> 0x10),0x52fc,0x52fc);
  uVar4 = uVar4 & 2;
  if (uVar4 == 0) {
    wVar5 = 0xb490;
    uVar12 = qb3f_61(wVar1,0xb490,0xb7a4,0x52fc,0x52fc);
  }
  else {
    wVar8 = 0xb5b2;
    wVar1 = qb3f_75((word)((long)DAT_2000_b5dc * 7),uVar4,
                    (word)((ulong)((long)DAT_2000_b5dc * 7) >> 0x10),0xb5b2,0x52fc);
    wVar5 = (uVar4 + wVar1 + 0x2a) * 4 + 0x1a46;
    uVar12 = qb3f_61(wVar1,wVar5,0xb7a4,0xb5b2,0x52fc);
  }
  uVar12 = qb3f_bc((word)uVar12,wVar5,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  uVar12 = qb3f_6a((word)uVar12,0xd8e0,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  uVar12 = qb3f_67((word)uVar12,0xb5b2,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  puVar6 = (undefined *)&lit_SELECT_ONE;
  uVar12 = qb3f_6e((word)uVar12,0xd8ea,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  uVar12 = qb3e_79((word)uVar12,(word)puVar6,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  uVar12 = qb3f_bc((word)uVar12,(word)puVar6,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  uVar12 = qb3f_6a((word)uVar12,0xd8fe,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  wVar1 = 0xb7a0;
  uVar12 = qb3f_6e((word)uVar12,0xb7a0,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  uVar12 = qb3e_79((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  uVar12 = qb3f_bc((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  uVar12 = qb3f_6a((word)uVar12,0xd906,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  wVar1 = 0xb7a4;
  uVar12 = qb3f_6e((word)uVar12,0xb7a4,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  uVar12 = qb3e_79((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  uVar12 = qb3f_bc((word)uVar12,wVar1,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  puVar6 = (undefined *)&lit_3_CAST_NO_SPELL;
  uVar12 = qb3f_6e((word)uVar12,0xd90e,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  qb3e_79((word)uVar12,(word)puVar6,(word)((ulong)uVar12 >> 0x10),wVar8,0x52fc);
  do {
    uVar12 = FUN_1000_7dc9();
    qb3f_75((word)uVar12,(word)puVar6,(word)((ulong)uVar12 >> 0x10),0xb4d2,(word)di);
    wVar1 = (word)((long)(int)puVar6 * 0x16);
    uVar12 = qb3f_75(wVar1,(word)puVar6,(word)((ulong)((long)(int)puVar6 * 0x16) >> 0x10),0xb4ca,
                     wVar1);
    wVar1 = (int)(puVar6 + (word)uVar12) * 2;
    uVar4 = 0;
    if (0 < *(int *)(wVar1 + 0x4e90)) {
      uVar4 = 0xffff;
    }
    bVar11 = *(int *)(wVar1 + 0x4e90) == 0;
    wVar8 = qb3f_a7((word)uVar12,uVar4,(word)((ulong)uVar12 >> 0x10),0xb50e,wVar1);
    uVar2 = 0;
    if (bVar11) {
      uVar2 = 0xffff;
    }
    if ((uVar2 & uVar4) != 0) {
      qb3f_7b(wVar8,uVar4,uVar2 & uVar4,0xbb60,0x52fc);
      return;
    }
    uVar4 = 0xb49c;
    uVar12 = qb3f_bb(wVar8,0xb49c,0xb49c,0xb50e,wVar1);
    uVar9 = uVar4 < 0x1b;
    uVar10 = uVar4 == 0x1b;
    if ((bool)uVar10) {
      uVar12 = qb3f_61((word)uVar12,0xd922,(word)((ulong)uVar12 >> 0x10),0xb50e,wVar1);
    }
    wVar8 = 0xb49c;
    uVar12 = qb3d_13((word)uVar12,0xb49c,(word)((ulong)uVar12 >> 0x10),0xb50e,wVar1);
    uVar12 = qb3f_7a((word)uVar12,wVar8,(word)((ulong)uVar12 >> 0x10),0xb50e,wVar1);
    uVar12 = qb3f_7d((word)uVar12,wVar8,(word)((ulong)uVar12 >> 0x10),0xb50e,0x52fc);
    uVar12 = qb3f_9f((word)uVar12,wVar8,(word)((ulong)uVar12 >> 0x10),0x52fc,0xb7f6);
    puVar6 = (undefined *)0x0;
    if ((bool)uVar9) {
      puVar6 = (undefined *)0xffff;
      uVar10 = 0;
    }
    di = (undefined2 *)&DAT_2000_bb60;
    qb3f_9f((word)uVar12,(word)puVar6,(word)((ulong)uVar12 >> 0x10),0x52fc,0xbb60);
    iVar3 = 0;
    if (!(bool)uVar9 && !(bool)uVar10) {
      iVar3 = -1;
    }
    bVar11 = iVar3 == 0 && puVar6 == (undefined *)0x0;
  } while (iVar3 != 0 || puVar6 != (undefined *)0x0);
  wVar5 = 0xb490;
  wVar1 = qb3f_62(0xb7a0,0xb490,0,0x52fc,0xbb60);
  wVar8 = 0;
  if (bVar11) {
    wVar8 = 0xffff;
  }
  bVar11 = false;
  qb3f_9f(wVar1,wVar5,wVar8,0x52fc,0xb7f6);
  uVar4 = 0;
  if (bVar11) {
    uVar4 = 0xffff;
  }
  uVar4 = uVar4 & dx;
  bVar11 = uVar4 == 0;
  wVar1 = qb3f_62(0xb7a4,wVar5,dx,0x52fc,0xb7f6);
  wVar8 = 0;
  if (bVar11) {
    wVar8 = 0xffff;
  }
  bVar11 = false;
  uVar12 = qb3f_9f(wVar1,wVar5,wVar8,0x52fc,0xb7d8);
  uVar2 = (uint)((ulong)uVar12 >> 0x10);
  uVar7 = 0;
  if (bVar11) {
    uVar7 = 0xffff;
  }
  uVar4 = uVar7 & uVar2 | uVar4;
  if (uVar4 != 0) {
    qb3f_7b((word)uVar12,uVar4,uVar2,0xbb60,0x52fc);
  }
  return;
}


// ==== FUN_1000_c7a5 @ 1000:c7a5 (size 22) callers: FUN_1000_4c28,FUN_1000_b674

void __cdecl16near FUN_1000_c7a5(void)

{
  word in_AX;
  word ax;
  word unaff_SI;
  word unaff_DI;
  
  ax = qb3f_61(in_AX,0xd928,0xb7a8,unaff_SI,unaff_DI);
  qb3f_61(ax,0xbc1a,0xb7ac,unaff_SI,unaff_DI);
  FUN_1000_c7d1();
  return;
}


// ==== FUN_1000_c7bb @ 1000:c7bb (size 22) callers: FUN_1000_4c28,FUN_1000_b674

void __cdecl16near FUN_1000_c7bb(void)

{
  word in_AX;
  word ax;
  word unaff_SI;
  word unaff_DI;
  
  ax = qb3f_61(in_AX,0xd92e,0xb7a8,unaff_SI,unaff_DI);
  qb3f_61(ax,0xbc6e,0xb7ac,unaff_SI,unaff_DI);
  FUN_1000_c7d1();
  return;
}


// ==== FUN_1000_c7d1 @ 1000:c7d1 (size 220) callers: FUN_1000_c7a5,FUN_1000_c7bb

void __cdecl16near FUN_1000_c7d1(void)

{
  word in_AX;
  word wVar1;
  word in_DX;
  word dx;
  word extraout_DX;
  int extraout_DX_00;
  word dx_00;
  word ax;
  word dx_01;
  word dx_02;
  word dx_03;
  word dx_04;
  word dx_05;
  undefined *puVar2;
  undefined *bx;
  word wVar3;
  word wVar4;
  word bx_00;
  word unaff_SI;
  word unaff_DI;
  undefined4 uVar5;
  
  qb3e_1f(in_AX,0xb7e0,in_DX,unaff_SI,unaff_DI);
  puVar2 = (undefined *)&lit_COM;
  wVar1 = qb3f_55(0xb7a8,0xd934,dx,unaff_SI,unaff_DI);
  qb3e_1e(wVar1,1,(word)puVar2,unaff_SI,unaff_DI);
  DAT_2000_b5e4 = 1;
  wVar1 = extraout_DX;
  while ((int)DAT_2000_b5e4 < 0x17) {
    wVar4 = 1;
    uVar5 = qb3f_b6(DAT_2000_b5e4,1,wVar1,unaff_SI,unaff_DI);
    wVar1 = qb3f_b7((word)uVar5,wVar4,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
    qb3f_b8(wVar1,DAT_2000_b5e4 * 4 + 0x5f14,DAT_2000_b5e4,unaff_SI,unaff_DI);
    DAT_2000_b5e4 = extraout_DX_00 + 1;
    wVar1 = DAT_2000_b5e4;
  }
  uVar5 = qb3e_21(DAT_2000_b5e4,1,wVar1,unaff_SI,unaff_DI);
  wVar1 = 0x1856;
  uVar5 = qb3f_57((word)uVar5,0x1856,(word)((ulong)uVar5 >> 0x10),unaff_SI,unaff_DI);
  qb3f_7d((word)uVar5,wVar1,(word)((ulong)uVar5 >> 0x10),unaff_SI,0xb774);
  wVar1 = 0xb7ac;
  qb3f_55(0xd93c,0xb7ac,0xb7ac,unaff_SI,0xb774);
  bx = (undefined *)&lit_NUM;
  puVar2 = (undefined *)&lit_NUM;
  uVar5 = qb3f_55(wVar1,0xd942,dx_00,unaff_SI,0xb774);
  wVar4 = (word)((ulong)uVar5 >> 0x10);
  qb3e_1a((word)uVar5,(word)bx,0xb774,unaff_SI,wVar4);
  wVar3 = 0x5e9e;
  uVar5 = qb3f_c9(ax,0x5e9e,0,unaff_SI,wVar4);
  wVar1 = (word)uVar5;
  uVar5 = qb3f_7d(wVar4,wVar3,(word)((ulong)uVar5 >> 0x10),unaff_SI,wVar1);
  wVar4 = (word)uVar5;
  qb3f_55(0xd18a,wVar4,(word)((ulong)uVar5 >> 0x10),unaff_SI,wVar1);
  uVar5 = qb3f_55(wVar4,(word)puVar2,dx_01,unaff_SI,wVar1);
  wVar4 = (word)((ulong)uVar5 >> 0x10);
  uVar5 = qb3e_1a((word)uVar5,(word)puVar2,wVar1,unaff_SI,wVar4);
  wVar1 = 0x18da;
  uVar5 = qb3f_57((word)uVar5,0x18da,(word)((ulong)uVar5 >> 0x10),unaff_SI,wVar4);
  wVar3 = (word)((ulong)uVar5 >> 0x10);
  qb3f_7d((word)uVar5,wVar1,wVar4,unaff_SI,wVar3);
  wVar4 = 0xb7ac;
  wVar1 = 0xb7ac;
  qb3f_55(0xd922,0xb7ac,dx_02,unaff_SI,wVar3);
  puVar2 = (undefined *)&lit_NUM;
  uVar5 = qb3f_55(wVar4,0xd942,dx_03,unaff_SI,wVar3);
  wVar4 = (word)((ulong)uVar5 >> 0x10);
  uVar5 = qb3e_1a((word)uVar5,(word)puVar2,wVar3,unaff_SI,wVar4);
  wVar3 = (word)((ulong)uVar5 >> 0x10);
  bx_00 = 0x4e16;
  uVar5 = qb3f_c9((word)uVar5,0x4e16,wVar4,unaff_SI,wVar3);
  qb3f_7d((word)uVar5,bx_00,(word)((ulong)uVar5 >> 0x10),unaff_SI,wVar3);
  qb3f_55(0xd94a,wVar1,dx_04,unaff_SI,wVar3);
  puVar2 = (undefined *)&lit_NUM;
  wVar1 = qb3f_55(wVar1,0xd942,dx_05,unaff_SI,wVar3);
  qb3e_1a(wVar1,(word)puVar2,wVar3,unaff_SI,wVar3);
  return;
}


// ==== qb3d_01 @ 1000:d001 (size 1) callers: FUN_1000_1cf5,FUN_1000_3dae

void __cdecl16near qb3d_01(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_03 @ 1000:d003 (size 1) callers: FUN_1000_0636,FUN_1000_0c0b,FUN_1000_1cf5,FUN_1000_2115,FUN_1000_3dae,FUN_1000_3ffc,FUN_1000_4c28,FUN_1000_5449,FUN_1000_548b,FUN_1000_54cb,FUN_1000_5793,FUN_1000_6baf,FUN_1000_6fbd,FUN_1000_7001,FUN_1000_70a1,FUN_1000_7932,FUN_1000_7e8d,FUN_1000_7eec,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_9298,FUN_1000_93e9,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_a335,FUN_1000_b2cf,FUN_1000_b9b3,FUN_1000_ba10

void __cdecl16near qb3d_03(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_04 @ 1000:d004 (size 1) callers: FUN_1000_9a2f

void __cdecl16near qb3d_04(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_05 @ 1000:d005 (size 1) callers: FUN_1000_2f87,FUN_1000_c47b,FUN_1000_c551,entry

void __cdecl16near qb3d_05(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_06 @ 1000:d006 (size 1) callers: FUN_1000_0636,FUN_1000_2f71,FUN_1000_2fcb,FUN_1000_3ffc,FUN_1000_7dc9,FUN_1000_803a

void __cdecl16near qb3d_06(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_0a @ 1000:d00a (size 1) callers: FUN_1000_ba10

void __cdecl16near qb3d_0a(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_0b @ 1000:d00b (size 1) callers: FUN_1000_19f7,FUN_1000_21f3,FUN_1000_95ba,FUN_1000_ba10,FUN_1000_c33b

void __cdecl16near qb3d_0b(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_0c @ 1000:d00c (size 1) callers: FUN_1000_a249,FUN_1000_ba10,FUN_1000_c465,entry

void __cdecl16near qb3d_0c(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_0d @ 1000:d00d (size 1) callers: FUN_1000_0636,FUN_1000_12c6,FUN_1000_3038,FUN_1000_340c,FUN_1000_54cb,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8fea,FUN_1000_95ba

void __cdecl16near qb3d_0d(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_10 @ 1000:d010 (size 1) callers: FUN_1000_a249

void __cdecl16near qb3d_10(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_11 @ 1000:d011 (size 1) callers: FUN_1000_ba10,entry

void __cdecl16near qb3d_11(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_13 @ 1000:d013 (size 1) callers: FUN_1000_1340,FUN_1000_21f3,FUN_1000_35ac,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_90d3,FUN_1000_95ba,FUN_1000_ba10,FUN_1000_c551,FUN_1000_c5d0

void __cdecl16near qb3d_13(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_21 @ 1000:d021 (size 1) callers: FUN_1000_21f3

void __cdecl16near qb3d_21(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_25 @ 1000:d025 (size 1) callers: FUN_1000_21f3

void __cdecl16near qb3d_25(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_2c @ 1000:d02c (size 1) callers: FUN_1000_c47b

void __cdecl16near qb3d_2c(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_2f @ 1000:d02f (size 1) callers: FUN_1000_ba10,FUN_1000_c33b

void __cdecl16near qb3d_2f(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_33 @ 1000:d033 (size 1) callers: FUN_1000_0636

void __cdecl16near qb3d_33(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_34 @ 1000:d034 (size 1) callers: FUN_1000_3dae,FUN_1000_70a1,FUN_1000_7932,FUN_1000_7e8d,FUN_1000_7eec,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_9298,FUN_1000_93e9,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_a335,FUN_1000_b2cf,FUN_1000_b9b3,FUN_1000_ba10

void __cdecl16near qb3d_34(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_39 @ 1000:d039 (size 1) callers: FUN_1000_548b,FUN_1000_70a1

void __cdecl16near qb3d_39(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3d_43 @ 1000:d043 (size 1) callers: FUN_1000_2f1a,FUN_1000_7f43,FUN_1000_803a,FUN_1000_89d9,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_bf60,entry

void __cdecl16near qb3d_43(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_01 @ 1000:d101 (size 1) callers: FUN_1000_7ffb

void __cdecl16near qb3e_01(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_04 @ 1000:d104 (size 1) callers: FUN_1000_c33b

void __cdecl16near qb3e_04(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_07 @ 1000:d107 (size 1) callers: FUN_1000_a2e5,FUN_1000_b308,FUN_1000_c02d

void __cdecl16near qb3e_07(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_09 @ 1000:d109 (size 1) callers: entry

void __cdecl16near qb3e_09(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_0c @ 1000:d10c (size 1) callers: FUN_1000_a013

void __cdecl16near qb3e_0c(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_0e @ 1000:d10e (size 1) callers: FUN_1000_0cd2,FUN_1000_a013

void __cdecl16near qb3e_0e(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_1a @ 1000:d11a (size 1) callers: FUN_1000_b674,FUN_1000_ba10,FUN_1000_c7d1

void __cdecl16near qb3e_1a(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_1b @ 1000:d11b (size 1) callers: FUN_1000_b308,FUN_1000_b5c8

void __cdecl16near qb3e_1b(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_1e @ 1000:d11e (size 1) callers: FUN_1000_a2e5,FUN_1000_b308,FUN_1000_b674,FUN_1000_ba10,FUN_1000_bfba,FUN_1000_c02d,FUN_1000_c33b,FUN_1000_c7d1,entry

void __cdecl16near qb3e_1e(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_1f @ 1000:d11f (size 1) callers: FUN_1000_a2e5,FUN_1000_b308,FUN_1000_b674,FUN_1000_ba10,FUN_1000_bfba,FUN_1000_c02d,FUN_1000_c33b,FUN_1000_c7d1,entry

void __cdecl16near qb3e_1f(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_21 @ 1000:d121 (size 1) callers: FUN_1000_a2e5,FUN_1000_b308,FUN_1000_b674,FUN_1000_ba10,FUN_1000_bfba,FUN_1000_c02d,FUN_1000_c33b,FUN_1000_c7d1,entry

void __cdecl16near qb3e_21(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_23 @ 1000:d123 (size 1) callers: FUN_1000_a249

void __cdecl16near qb3e_23(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_24 @ 1000:d124 (size 1) callers: FUN_1000_a249

void __cdecl16near qb3e_24(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_32 @ 1000:d132 (size 1) callers: FUN_1000_0cd2,FUN_1000_19f7,FUN_1000_3b16,FUN_1000_3dae,FUN_1000_4c28,FUN_1000_7ffb,FUN_1000_803a,FUN_1000_a013,FUN_1000_c33b,entry

void __cdecl16near qb3e_32(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_33 @ 1000:d133 (size 1) callers: FUN_1000_300c,entry

void __cdecl16near qb3e_33(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_35 @ 1000:d135 (size 1) callers: FUN_1000_300c,FUN_1000_b9b3,FUN_1000_b9d6,FUN_1000_ba10,FUN_1000_c47b,entry

void __cdecl16near qb3e_35(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_3a @ 1000:d13a (size 1) callers: FUN_1000_49f8,FUN_1000_4a17,FUN_1000_4a7c,FUN_1000_6de7,entry

void __cdecl16near qb3e_3a(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_42 @ 1000:d142 (size 1) callers: FUN_1000_0636,FUN_1000_0cd2,FUN_1000_1055,FUN_1000_12c6,FUN_1000_1340,FUN_1000_1918,FUN_1000_21f3,FUN_1000_3038,FUN_1000_33ea,FUN_1000_340c,FUN_1000_35ac,FUN_1000_3d83,FUN_1000_3ffc,FUN_1000_49b8,FUN_1000_49d1,FUN_1000_4abd,FUN_1000_4bc6,FUN_1000_4c28,FUN_1000_54cb,FUN_1000_567c,FUN_1000_56cc,FUN_1000_7c49,FUN_1000_7f7d,FUN_1000_7f96,FUN_1000_7faf,FUN_1000_7fc8,FUN_1000_7ffb,FUN_1000_803a,FUN_1000_89b4,FUN_1000_89d9,FUN_1000_8fea,FUN_1000_90d3,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_ba10,FUN_1000_c33b,FUN_1000_c47b,FUN_1000_c5b0,entry

void __cdecl16near qb3e_42(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_44 @ 1000:d144 (size 1) callers: FUN_1000_0636,FUN_1000_0cd2,FUN_1000_1055,FUN_1000_12c6,FUN_1000_1340,FUN_1000_1918,FUN_1000_21f3,FUN_1000_3038,FUN_1000_33ea,FUN_1000_340c,FUN_1000_35ac,FUN_1000_3d83,FUN_1000_3ffc,FUN_1000_49b8,FUN_1000_49d1,FUN_1000_4abd,FUN_1000_4bc6,FUN_1000_4c28,FUN_1000_54cb,FUN_1000_567c,FUN_1000_56cc,FUN_1000_7c49,FUN_1000_7f7d,FUN_1000_7f96,FUN_1000_7faf,FUN_1000_7fc8,FUN_1000_7ffb,FUN_1000_803a,FUN_1000_89b4,FUN_1000_89d9,FUN_1000_8fea,FUN_1000_90d3,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_ba10,FUN_1000_c33b,FUN_1000_c47b,FUN_1000_c5b0,entry

void __cdecl16near qb3e_44(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_48 @ 1000:d148 (size 1) callers: FUN_1000_593c

void __cdecl16near qb3e_48(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_51 @ 1000:d151 (size 1) callers: FUN_1000_05cb

void __cdecl16near qb3e_51(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_58 @ 1000:d158 (size 1) callers: FUN_1000_3fa9,FUN_1000_3fe3,FUN_1000_4275,FUN_1000_5837,FUN_1000_593c,FUN_1000_6baf,FUN_1000_c102

void __cdecl16near qb3e_58(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_5b @ 1000:d15b (size 1) callers: FUN_1000_2ff7,FUN_1000_ba10,FUN_1000_c33b,entry

void __cdecl16near qb3e_5b(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_72 @ 1000:d172 (size 1) callers: FUN_1000_4a9e,FUN_1000_58f7,FUN_1000_593c,FUN_1000_803a,FUN_1000_8fea,FUN_1000_90b4

void __cdecl16near qb3e_72(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_73 @ 1000:d173 (size 1) callers: FUN_1000_4a9e,FUN_1000_58f7,FUN_1000_593c,FUN_1000_803a,FUN_1000_8fea,FUN_1000_90b4

void __cdecl16near qb3e_73(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_74 @ 1000:d174 (size 1) callers: FUN_1000_4a9e,FUN_1000_58f7,FUN_1000_593c,FUN_1000_803a,FUN_1000_8fea,FUN_1000_90b4

void __cdecl16near qb3e_74(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_75 @ 1000:d175 (size 1) callers: FUN_1000_4a9e,FUN_1000_58f7,FUN_1000_593c,FUN_1000_803a,FUN_1000_8fea,FUN_1000_90b4

void __cdecl16near qb3e_75(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_79 @ 1000:d179 (size 1) callers: FUN_1000_0636,FUN_1000_0cd2,FUN_1000_1055,FUN_1000_12c6,FUN_1000_1340,FUN_1000_18de,FUN_1000_1918,FUN_1000_19f7,FUN_1000_1c76,FUN_1000_21f3,FUN_1000_3038,FUN_1000_33ea,FUN_1000_340c,FUN_1000_35ac,FUN_1000_3b16,FUN_1000_3d83,FUN_1000_3dae,FUN_1000_3ffc,FUN_1000_49b8,FUN_1000_49d1,FUN_1000_4abd,FUN_1000_4bc6,FUN_1000_4c28,FUN_1000_54cb,FUN_1000_567c,FUN_1000_56cc,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_7f7d,FUN_1000_7f96,FUN_1000_7faf,FUN_1000_7fc8,FUN_1000_7ffb,FUN_1000_803a,FUN_1000_89b4,FUN_1000_89d9,FUN_1000_8fea,FUN_1000_90d3,FUN_1000_9569,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_a2e5,FUN_1000_b308,FUN_1000_b5c8,FUN_1000_ba10,FUN_1000_c02d,FUN_1000_c33b,FUN_1000_c47b,FUN_1000_c5b0,FUN_1000_c5d0,entry

void __cdecl16near qb3e_79(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_84 @ 1000:d184 (size 1) callers: FUN_1000_4275,FUN_1000_4c28,FUN_1000_593c

void __cdecl16near qb3e_84(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_85 @ 1000:d185 (size 1) callers: FUN_1000_4275,FUN_1000_4c28,FUN_1000_593c

void __cdecl16near qb3e_85(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_86 @ 1000:d186 (size 1) callers: FUN_1000_4275,FUN_1000_4c28,FUN_1000_593c

void __cdecl16near qb3e_86(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_87 @ 1000:d187 (size 1) callers: FUN_1000_49f8,FUN_1000_4a17,FUN_1000_4a7c,FUN_1000_6de7,entry

void __cdecl16near qb3e_87(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_88 @ 1000:d188 (size 1) callers: FUN_1000_49f8,FUN_1000_4a17,FUN_1000_4a7c,FUN_1000_6de7,entry

void __cdecl16near qb3e_88(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_89 @ 1000:d189 (size 1) callers: FUN_1000_3fa9,FUN_1000_3fe3,FUN_1000_4275,FUN_1000_5837,FUN_1000_593c,FUN_1000_6baf,FUN_1000_c102

void __cdecl16near qb3e_89(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_8d @ 1000:d18d (size 1) callers: FUN_1000_593c

void __cdecl16near qb3e_8d(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3e_a1 @ 1000:d1a1 (size 1) callers: FUN_1000_c33b,FUN_1000_c551

void __cdecl16near qb3e_a1(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_13 @ 1000:d213 (size 1) callers: FUN_1000_70a1

void __cdecl16near qb3f_13(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_18 @ 1000:d218 (size 1) callers: FUN_1000_05cb

void __cdecl16near qb3f_18(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_21 @ 1000:d221 (size 1) callers: FUN_1000_b308,FUN_1000_b5c8

void __cdecl16near qb3f_21(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_23 @ 1000:d223 (size 1) callers: FUN_1000_0636,FUN_1000_803a

void __cdecl16near qb3f_23(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_25 @ 1000:d225 (size 1) callers: FUN_1000_0636,FUN_1000_5793,FUN_1000_803a

void __cdecl16near qb3f_25(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_27 @ 1000:d227 (size 1) callers: FUN_1000_0636,FUN_1000_3f5a,FUN_1000_4c28,FUN_1000_5449,FUN_1000_803a

void __cdecl16near qb3f_27(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_2d @ 1000:d22d (size 1) callers: FUN_1000_548b,FUN_1000_593c,FUN_1000_70a1

void __cdecl16near qb3f_2d(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_45 @ 1000:d245 (size 1) callers: entry

void __cdecl16near qb3f_45(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_55 @ 1000:d255 (size 1) callers: FUN_1000_05cb,FUN_1000_19f7,FUN_1000_1c76,FUN_1000_21f3,FUN_1000_95ba,FUN_1000_a249,FUN_1000_b308,FUN_1000_b674,FUN_1000_ba10,FUN_1000_c33b,FUN_1000_c551,FUN_1000_c7d1,entry

void __cdecl16near qb3f_55(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_56 @ 1000:d256 (size 1) callers: FUN_1000_593c

void __cdecl16near qb3f_56(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_57 @ 1000:d257 (size 1) callers: FUN_1000_21f3,FUN_1000_3dae,FUN_1000_4275,FUN_1000_4b5f,FUN_1000_4c28,FUN_1000_5449,FUN_1000_54cb,FUN_1000_5793,FUN_1000_580f,FUN_1000_593c,FUN_1000_6baf,FUN_1000_6fbd,FUN_1000_70a1,FUN_1000_7932,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_9a2f,FUN_1000_b308,FUN_1000_b5c8,FUN_1000_b674,FUN_1000_ba10,FUN_1000_c7d1

void __cdecl16near qb3f_57(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_5a @ 1000:d25a (size 1) callers: FUN_1000_c33b

void __cdecl16near qb3f_5a(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_5d @ 1000:d25d (size 1) callers: FUN_1000_7aa1

void __cdecl16near qb3f_5d(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_5e @ 1000:d25e (size 1) callers: FUN_1000_132a,FUN_1000_1340,FUN_1000_30c7,FUN_1000_35ac,FUN_1000_593c,FUN_1000_90d3,FUN_1000_95ba

void __cdecl16near qb3f_5e(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_61 @ 1000:d261 (size 1) callers: FUN_1000_05ac,FUN_1000_05cb,FUN_1000_0636,FUN_1000_0cd2,FUN_1000_1340,FUN_1000_19f7,FUN_1000_1c76,FUN_1000_21f3,FUN_1000_2f71,FUN_1000_2f87,FUN_1000_2fcb,FUN_1000_3316,FUN_1000_33ea,FUN_1000_3b16,FUN_1000_3ffc,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_7dc9,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8f6a,FUN_1000_95ba,FUN_1000_a249,FUN_1000_ba10,FUN_1000_c02d,FUN_1000_c332,FUN_1000_c33b,FUN_1000_c465,FUN_1000_c47b,FUN_1000_c551,FUN_1000_c5d0,FUN_1000_c7a5,FUN_1000_c7bb,entry

void __cdecl16near qb3f_61(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_62 @ 1000:d262 (size 1) callers: FUN_1000_0636,FUN_1000_09e8,FUN_1000_0cd2,FUN_1000_1055,FUN_1000_10be,FUN_1000_1340,FUN_1000_1918,FUN_1000_21f3,FUN_1000_2f71,FUN_1000_2f87,FUN_1000_3ffc,FUN_1000_7dc9,FUN_1000_7ffb,FUN_1000_803a,FUN_1000_89d9,FUN_1000_95ba,FUN_1000_a249,FUN_1000_ba10,FUN_1000_bfba,FUN_1000_c02d,FUN_1000_c33b,FUN_1000_c47b,FUN_1000_c5d0,entry

void __cdecl16near qb3f_62(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_67 @ 1000:d267 (size 1) callers: FUN_1000_19f7,FUN_1000_3b16,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_7fc8,FUN_1000_89d9,FUN_1000_9569,FUN_1000_9a2f,FUN_1000_a2e5,FUN_1000_b308,FUN_1000_c5d0

void __cdecl16near qb3f_67(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_68 @ 1000:d268 (size 1) callers: FUN_1000_803a,FUN_1000_a2e5,FUN_1000_b308

void __cdecl16near qb3f_68(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_69 @ 1000:d269 (size 1) callers: FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_a2e5

void __cdecl16near qb3f_69(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_6a @ 1000:d26a (size 1) callers: FUN_1000_0cd2,FUN_1000_1055,FUN_1000_1340,FUN_1000_18de,FUN_1000_1918,FUN_1000_19f7,FUN_1000_21f3,FUN_1000_3038,FUN_1000_35ac,FUN_1000_3b16,FUN_1000_49b8,FUN_1000_49d1,FUN_1000_4bc6,FUN_1000_54cb,FUN_1000_567c,FUN_1000_56cc,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_7f96,FUN_1000_7faf,FUN_1000_7fc8,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8fea,FUN_1000_9569,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a2e5,FUN_1000_ba10,FUN_1000_c33b,FUN_1000_c5b0,FUN_1000_c5d0,entry

void __cdecl16near qb3f_6a(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_6b @ 1000:d26b (size 1) callers: FUN_1000_19f7,FUN_1000_1c76,FUN_1000_35ac,FUN_1000_3b16,FUN_1000_803a,FUN_1000_b308

void __cdecl16near qb3f_6b(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_6e @ 1000:d26e (size 1) callers: FUN_1000_0636,FUN_1000_0cd2,FUN_1000_12c6,FUN_1000_1340,FUN_1000_18de,FUN_1000_1918,FUN_1000_19f7,FUN_1000_33ea,FUN_1000_340c,FUN_1000_35ac,FUN_1000_3b16,FUN_1000_3d83,FUN_1000_3dae,FUN_1000_3ffc,FUN_1000_4abd,FUN_1000_4c28,FUN_1000_54cb,FUN_1000_567c,FUN_1000_56cc,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_7f7d,FUN_1000_7fc8,FUN_1000_7ffb,FUN_1000_803a,FUN_1000_89b4,FUN_1000_89d9,FUN_1000_90d3,FUN_1000_9569,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_a2e5,FUN_1000_b5c8,FUN_1000_ba10,FUN_1000_c02d,FUN_1000_c33b,FUN_1000_c47b,FUN_1000_c5d0,entry

void __cdecl16near qb3f_6e(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_6f @ 1000:d26f (size 1) callers: FUN_1000_0636,FUN_1000_19f7,FUN_1000_2fcb,FUN_1000_3038,FUN_1000_3b16,FUN_1000_3dae,FUN_1000_3ffc,FUN_1000_4abd,FUN_1000_593c,FUN_1000_6eee,FUN_1000_6f52,FUN_1000_7932,FUN_1000_a013,FUN_1000_b308,FUN_1000_b674,FUN_1000_ba10,FUN_1000_c02d,FUN_1000_c47b,entry

void __cdecl16near qb3f_6f(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_71 @ 1000:d271 (size 1) callers: FUN_1000_0636,FUN_1000_0c0b,FUN_1000_2115,FUN_1000_3ffc,FUN_1000_4275,FUN_1000_4b5f,FUN_1000_4c28,FUN_1000_5449,FUN_1000_54cb,FUN_1000_5793,FUN_1000_593c,FUN_1000_6baf,FUN_1000_6fbd,FUN_1000_7001,FUN_1000_70a1,FUN_1000_7932,FUN_1000_7e8d,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_9298,FUN_1000_93e9,FUN_1000_9a2f,FUN_1000_a335,FUN_1000_bf60,FUN_1000_bfba

void __cdecl16near qb3f_71(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_72 @ 1000:d272 (size 1) callers: FUN_1000_0636,FUN_1000_70a1

void __cdecl16near qb3f_72(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_73 @ 1000:d273 (size 1) callers: FUN_1000_0636,FUN_1000_3dae,FUN_1000_70a1,FUN_1000_a335

void __cdecl16near qb3f_73(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_74 @ 1000:d274 (size 1) callers: FUN_1000_0636,FUN_1000_803a

void __cdecl16near qb3f_74(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_75 @ 1000:d275 (size 1) callers: FUN_1000_0636,FUN_1000_1340,FUN_1000_18de,FUN_1000_1918,FUN_1000_19f7,FUN_1000_21f3,FUN_1000_300c,FUN_1000_3038,FUN_1000_30c7,FUN_1000_3192,FUN_1000_3254,FUN_1000_3316,FUN_1000_35ac,FUN_1000_3b16,FUN_1000_3dae,FUN_1000_3f5a,FUN_1000_3ffc,FUN_1000_4275,FUN_1000_4abd,FUN_1000_4c28,FUN_1000_5417,FUN_1000_54cb,FUN_1000_56cc,FUN_1000_58f7,FUN_1000_593c,FUN_1000_6baf,FUN_1000_6eee,FUN_1000_6f52,FUN_1000_6fbd,FUN_1000_70a1,FUN_1000_7932,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_7dc9,FUN_1000_7fc8,FUN_1000_803a,FUN_1000_8f6a,FUN_1000_8fea,FUN_1000_90d3,FUN_1000_95ba,FUN_1000_a013,FUN_1000_a249,FUN_1000_a335,FUN_1000_b308,FUN_1000_b674,FUN_1000_b9b3,FUN_1000_b9d6,FUN_1000_ba10,FUN_1000_bfba,FUN_1000_c02d,FUN_1000_c47b,FUN_1000_c5d0,entry

void __cdecl16near qb3f_75(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_77 @ 1000:d277 (size 1) callers: FUN_1000_30c7,FUN_1000_3192,FUN_1000_3254,FUN_1000_3316,FUN_1000_3dae,FUN_1000_4275,FUN_1000_4a52,FUN_1000_4abd,FUN_1000_5837,FUN_1000_593c,FUN_1000_6baf,FUN_1000_6eee,FUN_1000_6f52,FUN_1000_6fbd,FUN_1000_7932,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_89d9,FUN_1000_9a2f,FUN_1000_b9b3,FUN_1000_ba10,FUN_1000_bfba,FUN_1000_c02d

void __cdecl16near qb3f_77(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_79 @ 1000:d279 (size 1) callers: FUN_1000_19f7,FUN_1000_593c

void __cdecl16near qb3f_79(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_7a @ 1000:d27a (size 1) callers: FUN_1000_1340,FUN_1000_21f3,FUN_1000_35ac,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_90d3,FUN_1000_95ba,FUN_1000_a335,FUN_1000_ba10,FUN_1000_c551,FUN_1000_c5d0

void __cdecl16near qb3f_7a(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_7b @ 1000:d27b (size 1) callers: FUN_1000_0636,FUN_1000_09e8,FUN_1000_0c0b,FUN_1000_0cd2,FUN_1000_10be,FUN_1000_1340,FUN_1000_1918,FUN_1000_19f7,FUN_1000_1c93,FUN_1000_1cf5,FUN_1000_2115,FUN_1000_21f3,FUN_1000_2f43,FUN_1000_30c7,FUN_1000_3192,FUN_1000_3254,FUN_1000_3316,FUN_1000_35ac,FUN_1000_3b02,FUN_1000_3dae,FUN_1000_3ffc,FUN_1000_4275,FUN_1000_4c28,FUN_1000_5417,FUN_1000_54cb,FUN_1000_593c,FUN_1000_6baf,FUN_1000_7001,FUN_1000_70a1,FUN_1000_78ff,FUN_1000_7932,FUN_1000_7aa1,FUN_1000_7e8d,FUN_1000_7eec,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8f6a,FUN_1000_92c8,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_a249,FUN_1000_a335,FUN_1000_b674,FUN_1000_b9d6,FUN_1000_ba10,FUN_1000_bf60,FUN_1000_bfba,FUN_1000_c02d,FUN_1000_c47b,FUN_1000_c5d0,entry

void __cdecl16near qb3f_7b(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_7c @ 1000:d27c (size 1) callers: FUN_1000_3dae,FUN_1000_593c,FUN_1000_a013

void __cdecl16near qb3f_7c(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_7d @ 1000:d27d (size 1) callers: FUN_1000_0636,FUN_1000_09e8,FUN_1000_0cd2,FUN_1000_10be,FUN_1000_1340,FUN_1000_1918,FUN_1000_19f7,FUN_1000_1c93,FUN_1000_1cf5,FUN_1000_2115,FUN_1000_21f3,FUN_1000_2f1a,FUN_1000_2fcb,FUN_1000_3038,FUN_1000_30c7,FUN_1000_3192,FUN_1000_3254,FUN_1000_3316,FUN_1000_35ac,FUN_1000_3b16,FUN_1000_3dae,FUN_1000_3f5a,FUN_1000_3ffc,FUN_1000_4275,FUN_1000_4abd,FUN_1000_4c28,FUN_1000_5449,FUN_1000_548b,FUN_1000_54cb,FUN_1000_5649,FUN_1000_5793,FUN_1000_580f,FUN_1000_593c,FUN_1000_6baf,FUN_1000_6eee,FUN_1000_6f52,FUN_1000_7001,FUN_1000_70a1,FUN_1000_78ff,FUN_1000_7932,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_7eec,FUN_1000_7f43,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_90d3,FUN_1000_92c8,FUN_1000_93e9,FUN_1000_9555,FUN_1000_9569,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_a249,FUN_1000_a335,FUN_1000_b2cf,FUN_1000_b308,FUN_1000_b5c8,FUN_1000_b674,FUN_1000_b9d6,FUN_1000_ba10,FUN_1000_bf60,FUN_1000_c02d,FUN_1000_c102,FUN_1000_c47b,FUN_1000_c551,FUN_1000_c5d0,FUN_1000_c7d1,entry

void __cdecl16near qb3f_7d(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_7e @ 1000:d27e (size 1) callers: FUN_1000_3dae,FUN_1000_593c,FUN_1000_803a,FUN_1000_9a2f,FUN_1000_b674

void __cdecl16near qb3f_7e(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_7f @ 1000:d27f (size 1) callers: FUN_1000_0636,FUN_1000_09e8,FUN_1000_0cd2,FUN_1000_10be,FUN_1000_1340,FUN_1000_1918,FUN_1000_19f7,FUN_1000_1c93,FUN_1000_1cf5,FUN_1000_2115,FUN_1000_21f3,FUN_1000_2fcb,FUN_1000_3038,FUN_1000_30c7,FUN_1000_3192,FUN_1000_3254,FUN_1000_3316,FUN_1000_35ac,FUN_1000_3b16,FUN_1000_3dae,FUN_1000_3ffc,FUN_1000_4275,FUN_1000_4abd,FUN_1000_4c28,FUN_1000_548b,FUN_1000_54cb,FUN_1000_5649,FUN_1000_580f,FUN_1000_5837,FUN_1000_593c,FUN_1000_6eee,FUN_1000_6f52,FUN_1000_7001,FUN_1000_70a1,FUN_1000_78ff,FUN_1000_7932,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_803a,FUN_1000_89d9,FUN_1000_92c8,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_a249,FUN_1000_b308,FUN_1000_b674,FUN_1000_b9d6,FUN_1000_ba10,FUN_1000_bf60,FUN_1000_bfba,FUN_1000_c02d,FUN_1000_c102,FUN_1000_c47b,entry

void __cdecl16near qb3f_7f(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_80 @ 1000:d280 (size 1) callers: FUN_1000_b308,FUN_1000_b674

void __cdecl16near qb3f_80(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_81 @ 1000:d281 (size 1) callers: FUN_1000_0636,FUN_1000_1cf5,FUN_1000_2115,FUN_1000_35ac,FUN_1000_3dae,FUN_1000_3ffc,FUN_1000_4275,FUN_1000_4a52,FUN_1000_548b,FUN_1000_5793,FUN_1000_593c,FUN_1000_6baf,FUN_1000_70a1,FUN_1000_7932,FUN_1000_7e8d,FUN_1000_7eec,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_90d3,FUN_1000_93e9,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_b2cf,FUN_1000_b308,FUN_1000_b5c8,FUN_1000_ba10

void __cdecl16near qb3f_81(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_82 @ 1000:d282 (size 1) callers: FUN_1000_0636,FUN_1000_a335

void __cdecl16near qb3f_82(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_83 @ 1000:d283 (size 1) callers: FUN_1000_0636,FUN_1000_3f5a,FUN_1000_9a2f

void __cdecl16near qb3f_83(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_85 @ 1000:d285 (size 1) callers: FUN_1000_0636,FUN_1000_2115,FUN_1000_54cb,FUN_1000_593c,FUN_1000_70a1,FUN_1000_7932,FUN_1000_803a,FUN_1000_89d9,FUN_1000_93e9,FUN_1000_9a2f

void __cdecl16near qb3f_85(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_87 @ 1000:d287 (size 1) callers: FUN_1000_3ffc,FUN_1000_5793,FUN_1000_803a,FUN_1000_89d9,FUN_1000_9a2f,FUN_1000_bf60

void __cdecl16near qb3f_87(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_89 @ 1000:d289 (size 1) callers: FUN_1000_2115,FUN_1000_548b,FUN_1000_593c,FUN_1000_6baf,FUN_1000_70a1,FUN_1000_7eec,FUN_1000_803a,FUN_1000_b674

void __cdecl16near qb3f_89(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_8b @ 1000:d28b (size 1) callers: FUN_1000_4c28,FUN_1000_5449

void __cdecl16near qb3f_8b(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_8d @ 1000:d28d (size 1) callers: FUN_1000_4b5f,FUN_1000_4c28,FUN_1000_593c

void __cdecl16near qb3f_8d(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_8f @ 1000:d28f (size 1) callers: FUN_1000_0636,FUN_1000_0c0b,FUN_1000_1918,FUN_1000_1cf5,FUN_1000_2115,FUN_1000_3dae,FUN_1000_4275,FUN_1000_4c28,FUN_1000_5449,FUN_1000_54cb,FUN_1000_7001,FUN_1000_7932,FUN_1000_803a,FUN_1000_89d9,FUN_1000_93e9,FUN_1000_9a2f,FUN_1000_b308

void __cdecl16near qb3f_8f(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_90 @ 1000:d290 (size 1) callers: FUN_1000_803a,FUN_1000_9a2f

void __cdecl16near qb3f_90(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_91 @ 1000:d291 (size 1) callers: FUN_1000_0636,FUN_1000_1cf5,FUN_1000_3dae,FUN_1000_3ffc,FUN_1000_548b,FUN_1000_54cb,FUN_1000_5793,FUN_1000_6baf,FUN_1000_6fbd,FUN_1000_70a1,FUN_1000_7932,FUN_1000_7e8d,FUN_1000_7eec,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_9298,FUN_1000_93e9,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_a335,FUN_1000_b2cf,FUN_1000_b9b3,FUN_1000_ba10

void __cdecl16near qb3f_91(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_95 @ 1000:d295 (size 1) callers: FUN_1000_4b5f,FUN_1000_4c28,FUN_1000_5793,FUN_1000_593c,FUN_1000_70a1,FUN_1000_8e76,FUN_1000_9a2f

void __cdecl16near qb3f_95(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_97 @ 1000:d297 (size 1) callers: FUN_1000_0636,FUN_1000_3f5a,FUN_1000_593c,FUN_1000_7c49,FUN_1000_7e8d,FUN_1000_7eec,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_9555,FUN_1000_9569,FUN_1000_9a2f,FUN_1000_b308,FUN_1000_b5c8

void __cdecl16near qb3f_97(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_99 @ 1000:d299 (size 1) callers: FUN_1000_2f1a,FUN_1000_54cb,FUN_1000_580f,FUN_1000_593c,FUN_1000_9a2f,FUN_1000_ba10

void __cdecl16near qb3f_99(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_9b @ 1000:d29b (size 1) callers: FUN_1000_3ffc,FUN_1000_70a1,FUN_1000_803a,FUN_1000_9a2f

void __cdecl16near qb3f_9b(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_9d @ 1000:d29d (size 1) callers: FUN_1000_4c28,FUN_1000_5449,FUN_1000_5793,FUN_1000_6baf,FUN_1000_6fbd,FUN_1000_7932,FUN_1000_89d9

void __cdecl16near qb3f_9d(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_9f @ 1000:d29f (size 1) callers: FUN_1000_0636,FUN_1000_09e8,FUN_1000_0c0b,FUN_1000_0cd2,FUN_1000_10be,FUN_1000_10fd,FUN_1000_1340,FUN_1000_19f7,FUN_1000_1c93,FUN_1000_1cf5,FUN_1000_2115,FUN_1000_2f43,FUN_1000_2fcb,FUN_1000_2ff7,FUN_1000_3029,FUN_1000_3038,FUN_1000_30c7,FUN_1000_3192,FUN_1000_3254,FUN_1000_3316,FUN_1000_35ac,FUN_1000_3b02,FUN_1000_3b16,FUN_1000_3dae,FUN_1000_3ffc,FUN_1000_4275,FUN_1000_49d1,FUN_1000_4abd,FUN_1000_4c28,FUN_1000_54cb,FUN_1000_5649,FUN_1000_593c,FUN_1000_6baf,FUN_1000_6de7,FUN_1000_6eee,FUN_1000_6f52,FUN_1000_7001,FUN_1000_70a1,FUN_1000_78ff,FUN_1000_7932,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_7dc9,FUN_1000_7eec,FUN_1000_7f43,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_8f6a,FUN_1000_8fea,FUN_1000_90d3,FUN_1000_92c8,FUN_1000_9569,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_a335,FUN_1000_b308,FUN_1000_b674,FUN_1000_b9d6,FUN_1000_ba10,FUN_1000_c02d,FUN_1000_c102,FUN_1000_c47b,FUN_1000_c551,FUN_1000_c5d0,entry

void __cdecl16near qb3f_9f(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_a0 @ 1000:d2a0 (size 1) callers: FUN_1000_593c,FUN_1000_70a1

void __cdecl16near qb3f_a0(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_a1 @ 1000:d2a1 (size 1) callers: FUN_1000_0636,FUN_1000_21f3,FUN_1000_2f1a,FUN_1000_4275,FUN_1000_54cb,FUN_1000_593c,FUN_1000_7001,FUN_1000_70a1,FUN_1000_7e8d,FUN_1000_7eec,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_bf60

void __cdecl16near qb3f_a1(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_a3 @ 1000:d2a3 (size 1) callers: FUN_1000_803a,FUN_1000_9a2f

void __cdecl16near qb3f_a3(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_a5 @ 1000:d2a5 (size 1) callers: FUN_1000_0c0b,FUN_1000_3ffc,FUN_1000_7001,FUN_1000_70a1,FUN_1000_7e8d,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_9a2f,FUN_1000_bf60

void __cdecl16near qb3f_a5(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_a6 @ 1000:d2a6 (size 1) callers: FUN_1000_0636

void __cdecl16near qb3f_a6(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_a7 @ 1000:d2a7 (size 1) callers: FUN_1000_0636,FUN_1000_0c0b,FUN_1000_0cc0,FUN_1000_0cd2,FUN_1000_1340,FUN_1000_18de,FUN_1000_1918,FUN_1000_19f7,FUN_1000_3b16,FUN_1000_3f5a,FUN_1000_3ffc,FUN_1000_4275,FUN_1000_4abd,FUN_1000_4c28,FUN_1000_54cb,FUN_1000_56cc,FUN_1000_580f,FUN_1000_593c,FUN_1000_7001,FUN_1000_70a1,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_803a,FUN_1000_89d9,FUN_1000_8e76,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_b5c8,FUN_1000_b674,FUN_1000_ba10,FUN_1000_c47b,FUN_1000_c5d0,entry

void __cdecl16near qb3f_a7(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_a8 @ 1000:d2a8 (size 1) callers: FUN_1000_593c,FUN_1000_a013

void __cdecl16near qb3f_a8(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_ab @ 1000:d2ab (size 1) callers: FUN_1000_0636,FUN_1000_1cf5,FUN_1000_35ac,FUN_1000_3dae,FUN_1000_4275,FUN_1000_4a52,FUN_1000_89d9,FUN_1000_90d3,FUN_1000_9298,FUN_1000_9a2f,FUN_1000_a335

void __cdecl16near qb3f_ab(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_ad @ 1000:d2ad (size 1) callers: FUN_1000_4c28,FUN_1000_5449,FUN_1000_593c,FUN_1000_6fbd,FUN_1000_70a1,FUN_1000_7932,FUN_1000_7e8d,FUN_1000_9298,FUN_1000_93e9,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_a335

void __cdecl16near qb3f_ad(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_af @ 1000:d2af (size 1) callers: FUN_1000_54cb,FUN_1000_70a1

void __cdecl16near qb3f_af(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_b6 @ 1000:d2b6 (size 1) callers: FUN_1000_b674,FUN_1000_ba10,FUN_1000_bfba,FUN_1000_c33b,FUN_1000_c7d1,entry

void __cdecl16near qb3f_b6(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_b7 @ 1000:d2b7 (size 1) callers: FUN_1000_b674,FUN_1000_ba10,FUN_1000_bfba,FUN_1000_c7d1,entry

void __cdecl16near qb3f_b7(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_b8 @ 1000:d2b8 (size 1) callers: FUN_1000_b674,FUN_1000_ba10,FUN_1000_bfba,FUN_1000_c7d1,entry

void __cdecl16near qb3f_b8(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_ba @ 1000:d2ba (size 1) callers: FUN_1000_19f7,FUN_1000_a249,FUN_1000_ba10,FUN_1000_c465,entry

void __cdecl16near qb3f_ba(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_bb @ 1000:d2bb (size 1) callers: FUN_1000_10be,FUN_1000_21f3,FUN_1000_2f87,FUN_1000_c551,FUN_1000_c5d0

void __cdecl16near qb3f_bb(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_bc @ 1000:d2bc (size 1) callers: FUN_1000_0636,FUN_1000_0cd2,FUN_1000_1055,FUN_1000_12c6,FUN_1000_1340,FUN_1000_18de,FUN_1000_1918,FUN_1000_19f7,FUN_1000_21f3,FUN_1000_3038,FUN_1000_33ea,FUN_1000_340c,FUN_1000_35ac,FUN_1000_3b16,FUN_1000_3d83,FUN_1000_3dae,FUN_1000_3ffc,FUN_1000_49b8,FUN_1000_49d1,FUN_1000_4abd,FUN_1000_4bc6,FUN_1000_4c28,FUN_1000_54cb,FUN_1000_567c,FUN_1000_56cc,FUN_1000_7aa1,FUN_1000_7c49,FUN_1000_7f7d,FUN_1000_7f96,FUN_1000_7faf,FUN_1000_7fc8,FUN_1000_7ffb,FUN_1000_803a,FUN_1000_89b4,FUN_1000_89d9,FUN_1000_8fea,FUN_1000_90d3,FUN_1000_9569,FUN_1000_95ba,FUN_1000_9a2f,FUN_1000_a013,FUN_1000_b5c8,FUN_1000_ba10,FUN_1000_c33b,FUN_1000_c47b,FUN_1000_c5b0,FUN_1000_c5d0,entry

void __cdecl16near qb3f_bc(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_bd @ 1000:d2bd (size 1) callers: FUN_1000_19f7,FUN_1000_1c76

void __cdecl16near qb3f_bd(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_c4 @ 1000:d2c4 (size 1) callers: FUN_1000_6eee,FUN_1000_6f52

void __cdecl16near qb3f_c4(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_c5 @ 1000:d2c5 (size 1) callers: FUN_1000_6f52

void __cdecl16near qb3f_c5(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== qb3f_c9 @ 1000:d2c9 (size 1) callers: FUN_1000_c7d1

void __cdecl16near qb3f_c9(word ax,word bx,word dx,word si,word di)

{
  return;
}


// ==== FUN_2000_e0a5 @ 2000:e0a5 (size 296) callers: 

/* WARNING: Control flow encountered bad instruction data */
/* WARNING: Instruction at (ram,0x0002e1c0) overlaps instruction at (ram,0x0002e1bf)
    */
/* WARNING: Unable to track spacebase fully for stack */
/* WARNING: Removing unreachable block (ram,0x0002e136) */
/* WARNING: Removing unreachable block (ram,0x0002e123) */
/* WARNING: Removing unreachable block (ram,0x0002e145) */
/* WARNING: Removing unreachable block (ram,0x0002e125) */
/* WARNING: Removing unreachable block (ram,0x0002e0f2) */
/* WARNING: Removing unreachable block (ram,0x0002e0f4) */
/* WARNING: Removing unreachable block (ram,0x0002e114) */
/* WARNING: Removing unreachable block (ram,0x0002e179) */
/* WARNING: Removing unreachable block (ram,0x0002e161) */

void FUN_2000_e0a5(undefined1 *param_1,uint param_2,undefined2 param_3,int param_4,
                  undefined2 param_5,undefined2 param_6,uint param_7)

{
  byte *pbVar1;
  uint *puVar2;
  char *pcVar3;
  undefined2 *puVar4;
  undefined1 uVar5;
  undefined2 *puVar6;
  undefined2 uVar7;
  int iVar8;
  char cVar9;
  uint in_AX;
  uint uVar10;
  undefined2 in_CX;
  byte bVar11;
  undefined2 in_DX;
  byte bVar12;
  int in_BX;
  int iVar13;
  undefined2 *unaff_SI;
  undefined2 *unaff_DI;
  undefined2 unaff_ES;
  undefined2 unaff_SS;
  undefined2 in_GS;
  bool in_CF;
  bool bVar14;
  uint in_stack_00000000;
  
  if (in_CF) {
LAB_2000_e11a:
    in_BX = in_BX + 1;
    in_AX = in_AX | 0x750a;
    cVar9 = (char)in_AX;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
LAB_2000_e197_1:
    cVar9 = (char)in_AX;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
    *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  }
  else {
    iVar8 = *(int *)(in_BX + 0x6e);
    iVar13 = iVar8 * 0x6f20;
    pbVar1 = (byte *)((int)unaff_SI + iVar13 + 0x75);
    bVar12 = (byte)((uint)in_DX >> 8);
    *pbVar1 = *pbVar1 & bVar12;
    puVar4 = unaff_SI;
    unaff_SI = (undefined2 *)((int)unaff_SI + 1);
    out(*(undefined1 *)puVar4,in_DX);
    if (*pbVar1 == 0) {
      in_AX = in_AX & 0xff;
      goto LAB_2000_e11a;
    }
    puVar6 = unaff_DI + 1;
    uVar7 = in(in_DX);
    *unaff_DI = uVar7;
    pbVar1 = (byte *)((int)unaff_DI + 0x71);
    bVar11 = (byte)((uint)in_CX >> 8);
    *pbVar1 = *pbVar1 & bVar11;
    if (*pbVar1 == 0) {
      out(*unaff_SI,in_DX);
      pbVar1 = (byte *)(*(int *)(iVar13 + 0x20) * 0x5845 + 0x6a);
      *pbVar1 = *pbVar1 & ((byte)(in_AX >> 8) | 0x65);
      uVar5 = in(in_DX);
      *(undefined1 *)puVar6 = uVar5;
      out(*param_1,param_5);
      out(param_1[1],param_5);
      out(*(undefined2 *)(param_1 + 2),param_5);
      if ((in_AX | 0x670a) == 0) {
        pbVar1 = (byte *)(param_4 + in_stack_00000000 + 0x6e);
        *pbVar1 = *pbVar1 & (byte)((uint)param_6 >> 8);
        puVar4 = (undefined2 *)((long)*(int *)(param_2 + in_stack_00000000 + 0x20) * 0x6e69);
        unaff_SI = (undefined2 *)puVar4;
        puVar2 = (uint *)(param_4 + 0x6d);
        iVar8 = (param_2 & 3) - (*puVar2 & 3);
        *puVar2 = *puVar2 + (uint)(0 < iVar8) * iVar8;
        if (((undefined2 *)(long)(int)unaff_SI != puVar4) || (0 < iVar8)) {
          unaff_SI = (undefined2 *)
                     ((uint)((int)unaff_SI + -1) ^
                     *(uint *)((undefined1 *)((int)unaff_SI + -1) + param_4));
          param_7 = param_2;
        }
        else {
          pbVar1 = (byte *)(param_4 + 0x69);
          *pbVar1 = *pbVar1 & (byte)((uint)param_5 >> 8);
          if (*pbVar1 != 0) {
            pbVar1 = (byte *)(param_4 + in_stack_00000000 + 0x75);
            *pbVar1 = *pbVar1 & (byte)param_5;
            in_AX = param_7;
            in_BX = param_4;
            goto LAB_2000_e11a;
          }
        }
      }
      else {
        unaff_SI = (undefined2 *)((uint)(param_1 + 3) ^ *(uint *)(param_1 + 3 + param_4));
        uVar10 = in_stack_00000000 | 0x550a;
        bVar14 = uVar10 == 0;
LAB_2000_e157:
        cVar9 = (char)uVar10;
        puVar4 = unaff_SI;
        unaff_SI = (undefined2 *)((int)unaff_SI + 1);
        out(*(undefined1 *)puVar4,param_5);
        in_BX = param_4;
        if (bVar14) goto LAB_2000_e1c8_1;
      }
      pcVar3 = (char *)((int)unaff_SI + param_4 + 0x41);
      *pcVar3 = *pcVar3 + (char)param_5;
      in_AX = param_7 - 1;
      cVar9 = (char)in_AX;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      *(char *)(param_4 + (int)unaff_SI) = *(char *)(param_4 + (int)unaff_SI) + cVar9;
      in_BX = param_4;
LAB_2000_e1a9:
      cVar9 = (char)in_AX;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
LAB_2000_e1c8_1:
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
      *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
                    /* WARNING: Bad instruction - Truncating control flow here */
      halt_baddata();
    }
    pbVar1 = (byte *)((int)puVar6 + in_BX + 0x73);
    *pbVar1 = *pbVar1 & bVar11;
    pbVar1 = (byte *)((int)puVar6 + in_BX + 0x6e);
    *pbVar1 = *pbVar1 & bVar11;
    iVar8 = puVar6[iVar8 * 0x3790 + 0x10];
    unaff_SI = (undefined2 *)(undefined2 *)((long)iVar8 * 0x6e69);
    puVar2 = (uint *)(in_BX + 0x6d);
    iVar13 = -(*puVar2 & 3);
    *puVar2 = *puVar2 + (uint)(0 < iVar13) * iVar13;
    if ((undefined2 *)(long)(int)unaff_SI != (undefined2 *)((long)iVar8 * 0x6e69))
    goto LAB_2000_e197_1;
    if (0 >= iVar13) {
      pbVar1 = (byte *)(in_BX + 0x69);
      *pbVar1 = *pbVar1 & bVar12;
      if (*pbVar1 != 0) {
        *(byte *)((int)unaff_DI + 0x75) = *(byte *)((int)unaff_DI + 0x75) & (byte)in_DX;
        uVar7 = in(in_DX);
        *puVar6 = uVar7;
        uVar10 = in_AX | 0x650a;
        puVar4 = unaff_SI;
        unaff_SI = (undefined2 *)((int)unaff_SI + 1);
        out(*(undefined1 *)puVar4,in_DX);
        cVar9 = '\0';
        bVar14 = false;
        param_5 = in_DX;
        param_4 = in_BX;
        param_7 = in_AX;
        if (uVar10 == 0) goto LAB_2000_e1bc;
        goto LAB_2000_e157;
      }
      goto LAB_2000_e1a9;
    }
  }
  cVar9 = (char)in_AX;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
LAB_2000_e1bc:
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
  *(char *)(in_BX + (int)unaff_SI) = *(char *)(in_BX + (int)unaff_SI) + cVar9;
                    /* WARNING: Bad instruction - Truncating control flow here */
  halt_baddata();
}

