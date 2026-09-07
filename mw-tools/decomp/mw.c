
// ==== entry @ 1000:0000 (size 355) callers:   // c0 startup: sets DS/SS, clears BSS, calls main

/* WARNING: Stack frame is not setup normally: Input value of stackpointer is not used */
/* WARNING: This function may have set the stack pointer */

void entry(void)

{
  char *pcVar1;
  undefined2 *puVar2;
  code *pcVar3;
  char cVar4;
  int iVar5;
  undefined2 uVar6;
  byte bVar7;
  uint uVar8;
  int iVar9;
  undefined2 extraout_DX;
  undefined2 extraout_DX_00;
  int iVar10;
  undefined2 *puVar11;
  int *piVar12;
  undefined1 *puVar13;
  char *pcVar14;
  uint uVar15;
  undefined1 *puVar16;
  undefined2 *puVar17;
  undefined2 unaff_ES;
  bool bVar18;
  undefined4 uVar19;
  
  puVar11 = (undefined2 *)&DAT_6000_0080;
                    /* WARNING: Read-only address (ram,0x000102c4) is written */
  uRam000102c4 = 0x6000;
  pcVar3 = (code *)swi(0x21);
  uVar19 = (*pcVar3)();
  uVar6 = s_Borland_C_____Copyright_1991_Bor_6000_0004._40_2_;
  iVar5 = DAT_6000_0002;
  iVar9 = (int)((ulong)uVar19 >> 0x10);
  *(undefined2 *)&DAT_6000_0092 = (int)uVar19;
  *(undefined2 *)&DAT_6000_0090 = unaff_ES;
  *(undefined2 *)(char *)&DAT_6000_008c = uVar6;
  *(int *)&DAT_6000_00a8 = iVar5;
  *(undefined2 *)((int)puVar11 + -2) = 0x28;
  FUN_1000_01b0();
  iVar10 = 0;
  pcVar14 = (char *)0x0;
  uVar8 = 0x7fff;
LAB_1000_0037:
  do {
    if (uVar8 != 0) {
      uVar8 = uVar8 - 1;
      pcVar1 = pcVar14;
      pcVar14 = pcVar14 + 1;
      if (*pcVar1 != '\0') goto LAB_1000_0037;
    }
    if (uVar8 == 0) goto LAB_1000_009c;
    iVar10 = iVar10 + 1;
  } while (*pcVar14 != '\0');
  *(int *)&DAT_6000_008a = -(uVar8 | 0x8000);
  *(uint *)&DAT_6000_008e = iVar10 * 2 + 8U & 0xfff8;
  uVar8 = iVar5 - iVar9;
  pcVar14 = (char *)*(uint *)&DAT_6000_90ac;
  if (pcVar14 < (char *)0x200) {
    pcVar14 = (char *)0x200;
    *(undefined2 *)&DAT_6000_90ac = 0x200;
  }
  if ((pcVar14 < (char *)s_ZOOM_IN_ON_A_VIEW__6000_2e01 + 0xb) &&
     (!CARRY2((uint)(pcVar14 + -0x2e0c),*(uint *)&DAT_6000_9040))) {
    bVar7 = 4;
    uVar15 = ((uint)(pcVar14 + -0x2e0c + *(uint *)&DAT_6000_9040) >> 4) + 1;
    if (uVar15 <= uVar8) {
      if (((*(int *)&DAT_6000_90ac == 0) || (*(int *)&DAT_6000_9040 == 0)) &&
         (uVar15 = 0x1000, uVar8 < 0x1001)) {
        uVar15 = uVar8;
      }
      *(int *)&DAT_6000_00a0 = uVar15 + iVar9;
      *(int *)&DAT_6000_00a4 = uVar15 + iVar9;
      piVar12 = (int *)((int)puVar11 + -2);
      *(uint *)((int)puVar11 + -2) = uVar15;
      pcVar3 = (code *)swi(0x21);
      (*pcVar3)();
      puVar16 = (undefined1 *)(*piVar12 << (bVar7 & 0x1f));
      puVar17 = (undefined2 *)&DAT_6000_9208;
      for (pcVar14 = (char *)s_AN_ELECTRIC_CHARGE_LEAPS_6000_3fe6 + 6; pcVar14 != (char *)0x0;
          pcVar14 = pcVar14 + -1) {
        puVar2 = puVar17;
        puVar17 = (undefined2 *)((int)puVar17 + 1);
        *(undefined1 *)puVar2 = 0;
      }
      if (0x14 < *(uint *)&DAT_6000_9010) {
        bVar18 = *(byte *)&DAT_6000_0092 < 3;
        if ((!bVar18) &&
           ((3 < *(byte *)&DAT_6000_0092 || (bVar18 = *(byte *)&DAT_6000_0093 < 0x1e, !bVar18)))) {
          pcVar3 = (code *)swi(0x21);
          (*pcVar3)();
          if (!bVar18) {
            pcVar3 = (code *)swi(0x21);
            (*pcVar3)();
            if (!bVar18) {
              pcVar3 = (code *)swi(0x21);
              iVar5 = (*pcVar3)();
              if (!bVar18) {
                *(int *)&DAT_6000_00a8 = iVar5 + 1;
                pcVar3 = (code *)swi(0x21);
                (*pcVar3)();
                if (!bVar18) {
                  pcVar3 = (code *)swi(0x21);
                  (*pcVar3)();
                  if (!bVar18) goto LAB_1000_0120;
                }
              }
            }
          }
          FUN_1000_02ad();
          return;
        }
      }
LAB_1000_0120:
      pcVar3 = (code *)swi(0x1a);
      cVar4 = (*pcVar3)();
      *(undefined2 *)&DAT_6000_0096 = extraout_DX_00;
      *(undefined2 *)&DAT_6000_0098 = pcVar14;
      if (cVar4 != '\0') {
        DAT_0000_0470 = 1;
      }
      *(undefined2 *)(puVar16 + -2) = 0x14c;
      FUN_1000_0220();
      *(undefined2 *)(puVar16 + -2) = *(undefined2 *)&DAT_6000_0088;
      *(undefined2 *)(puVar16 + -4) = *(undefined2 *)&DAT_6000_0086;
      *(undefined2 *)(puVar16 + -6) = *(undefined2 *)&DAT_6000_0084;
      *(undefined2 *)(puVar16 + -8) = 0x1000;
      puVar13 = puVar16 + -10;
      *(undefined2 *)(puVar16 + -10) = 0x15d;
      uVar6 = main();
      *(undefined2 *)(puVar13 + -2) = uVar6;
      *(undefined2 *)(puVar13 + -4) = 0x2000;
      *(undefined2 *)(puVar13 + -6) = 0x163;
      FUN_1000_128d();
      *(undefined2 *)(puVar13 + -4) = 0x91d2;
      *(undefined2 *)(puVar13 + -6) = 0x9202;
      *(undefined2 *)(puVar13 + -8) = 0x173;
      FUN_1000_0264();
      return;
    }
  }
LAB_1000_009c:
  FUN_1000_02ad();
  return;
}


// ==== FUN_1000_0163 @ 1000:0163 (size 19) callers: FUN_1000_1236

void __cdecl16far FUN_1000_0163(void)

{
  FUN_1000_0264();
  return;
}


// ==== FUN_1000_0176 @ 1000:0176 (size 40) callers: FUN_1000_1236

void __cdecl16far FUN_1000_0176(void)

{
  int iVar1;
  int iVar2;
  byte *pbVar3;
  
  iVar1 = 0;
  pbVar3 = (byte *)0x0;
  iVar2 = 0x2f;
  do {
    iVar1 = CONCAT11((char)((uint)iVar1 >> 8) + CARRY1((byte)iVar1,*pbVar3),(byte)iVar1 + *pbVar3);
    pbVar3 = pbVar3 + 1;
    iVar2 = iVar2 + -1;
  } while (iVar2 != 0);
  if (iVar1 != 0xd5c) {
    FUN_1000_02a5();
  }
  return;
}


// ==== FUN_1000_019e @ 1000:019e (size 18) callers: FUN_1000_1236

void FUN_1000_019e(void)

{
  code *pcVar1;
  char cVar2;
  int in_BX;
  int unaff_SI;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  FUN_1000_02a5();
  cVar2 = FUN_1000_129c();
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  cVar2 = cVar2 + *(char *)(in_BX + unaff_SI);
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  out(0xa0,0x20);
  out(0x20,0x20);
  pcVar1 = (code *)swi(2);
  (*pcVar1)();
  return;
}


// ==== FUN_1000_01b0 @ 1000:01b0 (size 67) callers: entry

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16near FUN_1000_01b0(void)

{
  code *pcVar1;
  undefined2 in_BX;
  undefined2 unaff_ES;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  pcVar1 = (code *)swi(0x21);
  unique0x10000025 = in_BX;
  _DAT_6000_0076 = unaff_ES;
  (*pcVar1)();
  pcVar1 = (code *)swi(0x21);
  DAT_6000_0078 = in_BX;
  DAT_6000_007a = unaff_ES;
  (*pcVar1)();
  pcVar1 = (code *)swi(0x21);
  DAT_6000_007c = in_BX;
  DAT_6000_007e = unaff_ES;
  (*pcVar1)();
  pcVar1 = (code *)swi(0x21);
  DAT_6000_0080 = in_BX;
  DAT_6000_0082 = unaff_ES;
  (*pcVar1)();
  return;
}


// ==== FUN_1000_01f3 @ 1000:01f3 (size 45) callers: FUN_1000_1236

void __cdecl16far FUN_1000_01f3(void)

{
  code *pcVar1;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  return;
}


// ==== FUN_1000_0220 @ 1000:0220 (size 68) callers: FUN_1000_0220,entry

void __cdecl16near FUN_1000_0220(void)

{
  char cVar1;
  uint uVar2;
  char *pcVar3;
  char *pcVar4;
  char *unaff_SI;
  char *unaff_DI;
  undefined2 unaff_ES;
  
  while( true ) {
    uVar2 = 0x100;
    pcVar3 = unaff_DI;
    for (pcVar4 = unaff_SI; pcVar4 != unaff_DI; pcVar4 = pcVar4 + 6) {
      if ((*pcVar4 != -1) && ((byte)pcVar4[1] < uVar2)) {
        uVar2 = (uint)(byte)pcVar4[1];
        pcVar3 = pcVar4;
      }
    }
    if (pcVar3 == unaff_DI) break;
    cVar1 = *pcVar3;
    *pcVar3 = -1;
    if (cVar1 == '\0') {
      (**(code **)(pcVar3 + 2))();
    }
    else {
      (**(code **)(pcVar3 + 2))(0x1000);
    }
  }
  return;
}


// ==== FUN_1000_0264 @ 1000:0264 (size 65) callers: FUN_1000_0163,FUN_1000_0264

void __cdecl16near FUN_1000_0264(void)

{
  char cVar1;
  byte bVar2;
  char *pcVar3;
  char *pcVar4;
  char *unaff_SI;
  char *unaff_DI;
  undefined2 unaff_ES;
  
  while( true ) {
    bVar2 = 0;
    pcVar3 = unaff_DI;
    for (pcVar4 = unaff_SI; pcVar4 != unaff_DI; pcVar4 = pcVar4 + 6) {
      if ((*pcVar4 != -1) && (bVar2 <= (byte)pcVar4[1])) {
        bVar2 = pcVar4[1];
        pcVar3 = pcVar4;
      }
    }
    if (pcVar3 == unaff_DI) break;
    cVar1 = *pcVar3;
    *pcVar3 = -1;
    if (cVar1 == '\0') {
      (**(code **)(pcVar3 + 2))();
    }
    else {
      (**(code **)(pcVar3 + 2))(0x1000);
    }
  }
  return;
}


// ==== FUN_1000_02a5 @ 1000:02a5 (size 8) callers: FUN_1000_0176,FUN_1000_02ad

void __cdecl16near FUN_1000_02a5(void)

{
  code *pcVar1;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  return;
}


// ==== FUN_1000_02ad @ 1000:02ad (size 63) callers: FUN_1000_0d04,entry

void FUN_1000_02ad(void)

{
  code *pcVar1;
  char cVar2;
  int in_BX;
  int unaff_SI;
  
  FUN_1000_02a5();
  cVar2 = FUN_1000_129c(3);
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  cVar2 = cVar2 + *(char *)(in_BX + unaff_SI);
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  *(char *)(in_BX + unaff_SI) = *(char *)(in_BX + unaff_SI) + cVar2;
  out(0xa0,0x20);
  out(0x20,0x20);
  pcVar1 = (code *)swi(2);
  (*pcVar1)();
  return;
}


// ==== FUN_1000_051c @ 1000:051c (size 4) callers: FUN_5120_2714

undefined2 __cdecl16far FUN_1000_051c(void)

{
  return 2;
}


// ==== FUN_1000_0520 @ 1000:0520 (size 154) callers: FUN_1000_0a80

void FUN_1000_0520(void)

{
  char *pcVar1;
  char *pcVar2;
  char *pcVar3;
  int in_stack_0000000a;
  int in_stack_0000000c;
  int in_stack_0000000e;
  int in_stack_00000010;
  uint in_stack_00000012;
  int in_stack_00000014;
  
  pcVar1 = (char *)0x43fe;
  pcVar3 = (char *)0xdf9b;
  if (in_stack_00000014 == 0) {
    pcVar1 = (char *)s_SPELLS_BY_USING_MAGIC_6000_407b + 3;
    pcVar3 = (char *)s_FORTH_FROM_YOUR_FINGERTIPS_6000_3f66 + 4;
  }
  pcVar2 = (char *)(in_stack_00000012 & 0x7fff);
  if (((pcVar2 != (char *)0x7fff) && (pcVar2 != pcVar1)) &&
     ((pcVar1 < pcVar2 ||
      (((((pcVar2 != (char *)0x0 || in_stack_00000010 != 0) || in_stack_0000000e != 0) ||
        in_stack_0000000c != 0) || in_stack_0000000a != 0 && ((int)pcVar2 < (int)pcVar3)))))) {
    DAT_6000_0094 = 0x22;
  }
  return;
}


// ==== FUN_1000_05ba @ 1000:05ba (size 33) callers: FUN_1000_05db

void __cdecl16near FUN_1000_05ba(void)

{
  uint in_CX;
  byte in_DL;
  uint in_BX;
  
  if ((in_DL & 0x5f) == 0x47) {
    do {
      if (*(char *)(in_BX - 1) != '0') {
        return;
      }
      in_BX = in_BX - 1;
    } while (in_CX < in_BX);
  }
  return;
}


// ==== FUN_1000_05db @ 1000:05db (size 399) callers: thunk_FUN_1000_05db

void FUN_1000_05db(undefined2 param_1,char param_2,byte param_3,byte *param_4,uint param_5,
                  undefined2 param_6)

{
  byte *pbVar1;
  ulong uVar2;
  uint uVar3;
  int iVar4;
  char *pcVar5;
  byte bVar6;
  int iVar7;
  int iVar8;
  byte *pbVar9;
  byte *pbVar10;
  byte *pbVar11;
  byte local_32 [2];
  byte abStack_30 [42];
  uint local_6;
  int local_4;
  
  if (0x28 < param_5) {
    param_5 = 0x28;
  }
  local_6 = param_5;
  if ((param_3 & 0xdf) == 0x46) {
    uVar3 = -param_5;
    if (-param_5 != 0 && (int)param_5 < 1) {
      param_5 = 0;
      uVar3 = 0;
    }
LAB_1000_0616:
    if ((param_3 & 0xdf) == 0x45) {
      uVar3 = uVar3 + 1;
      param_5 = param_5 + 1;
    }
  }
  else {
    uVar3 = param_5;
    if (0 < (int)param_5) goto LAB_1000_0616;
    uVar3 = 1;
  }
  pbVar10 = local_32;
  iVar4 = FUN_1000_0afb(param_1,pbVar10,&local_4,uVar3,param_6);
  if (iVar4 == 0x7fff) {
    pcVar5 = (char *)s_DO_YOU_WISH_TO_LEAVE_YOUR_6000_4925 + 6;
    if (local_4 != 0) {
      pcVar5 = (char *)s_DO_YOU_WISH_TO_LEAVE_YOUR_6000_4925 + 8;
    }
    *(char **)param_4 = pcVar5;
    pbVar9 = param_4 + 4;
    *(char **)(param_4 + 2) = (char *)s_I_CAN_T_FIND_THE_FILE_ROLL_TXT__T_6000_464b + 3;
    goto LAB_1000_075e;
  }
  if (iVar4 == 0x7ffe) {
    pcVar5 = (char *)s_FOR_BLACK_OR_GREEN_MONSTERS__6000_4e26 + 5;
    if (local_4 != 0) {
      pcVar5 = (char *)s_FOR_BLACK_OR_GREEN_MONSTERS__6000_4e26 + 7;
    }
    *(char **)param_4 = pcVar5;
    pbVar9 = param_4 + 4;
    *(uint *)(param_4 + 2) = CONCAT11((char)((uint)pcVar5 >> 8),0x41);
    goto LAB_1000_075e;
  }
  pbVar11 = param_4;
  if ((char)local_4 != '\0') {
    pbVar11 = param_4 + 1;
    *param_4 = 0x2d;
  }
  if ((param_3 & 0x5f) == 0x46) {
LAB_1000_0694:
    if (iVar4 < 0x29) {
      if (iVar4 < 1) {
        pbVar1 = pbVar11;
        pbVar11 = pbVar11 + 2;
        *(char **)pbVar1 = (char *)s_BETWEEN_COMPRESSED_6000_2e26 + 10;
        iVar7 = 1;
        iVar8 = iVar4;
        if (iVar4 != 0) {
          do {
            pbVar1 = pbVar11;
            pbVar11 = pbVar11 + 1;
            *pbVar1 = 0x30;
            iVar8 = iVar8 + 1;
            iVar4 = 0;
          } while (iVar8 != 0);
          goto LAB_1000_06ac;
        }
      }
      else {
LAB_1000_06ac:
        iVar7 = 0;
      }
      while( true ) {
        pbVar9 = pbVar11;
        pbVar1 = pbVar10;
        pbVar10 = pbVar10 + 1;
        if (*pbVar1 == 0) break;
        *pbVar9 = *pbVar1;
        iVar4 = iVar4 + -1;
        pbVar11 = pbVar9 + 1;
        if (iVar4 == 0) {
          pbVar9[1] = 0x2e;
          iVar7 = iVar7 + 1;
          pbVar11 = pbVar9 + 2;
        }
      }
      if (iVar7 + local_6 < param_5) {
        iVar8 = param_5 - (iVar7 + local_6);
        iVar4 = iVar4 + iVar8;
        for (; iVar8 != 0; iVar8 = iVar8 + -1) {
          pbVar1 = pbVar9;
          pbVar9 = pbVar9 + 1;
          *pbVar1 = 0x30;
        }
        iVar4 = iVar4 + -1;
        if (iVar4 != 0) goto LAB_1000_06d5;
      }
      else {
LAB_1000_06d5:
        if ((iVar4 != 1) && (param_2 == '\0')) {
          FUN_1000_05ba();
        }
      }
      if (pbVar9 == param_4) {
        pbVar1 = pbVar9;
        pbVar9 = pbVar9 + 1;
        *pbVar1 = 0x30;
      }
      goto LAB_1000_075e;
    }
  }
  else if (((param_3 & 0x5f) != 0x45) && (-4 < iVar4)) {
    uVar3 = param_5;
    if (param_5 == 0) {
      uVar3 = 1;
    }
    if (iVar4 <= (int)uVar3) goto LAB_1000_0694;
  }
  pbVar10 = abStack_30;
  pbVar9 = pbVar11 + 1;
  *pbVar11 = local_32[0];
  bVar6 = local_32[1];
  if (bVar6 == 0) {
    if (param_2 != '\0') {
      pbVar1 = pbVar9;
      pbVar9 = pbVar11 + 2;
      *pbVar1 = 0x2e;
    }
  }
  else {
    pbVar1 = pbVar9;
    pbVar9 = pbVar11 + 2;
    *pbVar1 = 0x2e;
    do {
      pbVar1 = pbVar9;
      pbVar9 = pbVar9 + 1;
      *pbVar1 = bVar6;
      pbVar1 = pbVar10;
      pbVar10 = pbVar10 + 1;
      bVar6 = *pbVar1;
    } while (bVar6 != 0);
    if (param_2 == '\0') {
      FUN_1000_05ba();
    }
  }
  *pbVar9 = param_3 & 0x20 | 0x45;
  bVar6 = 0x2b;
  uVar3 = iVar4 - 1;
  if (iVar4 < 1) {
    bVar6 = 0x2d;
    uVar3 = -uVar3;
  }
  pbVar10 = pbVar9 + 2;
  pbVar9[1] = bVar6;
  if (99 < uVar3) {
    if (999 < uVar3) {
      uVar2 = (ulong)(int)uVar3;
      uVar3 = (uint)(uVar2 % 1000);
      pbVar1 = pbVar10;
      pbVar10 = pbVar9 + 3;
      *pbVar1 = (char)(uVar2 / 1000) + 0x30;
    }
    pbVar1 = pbVar10;
    pbVar10 = pbVar10 + 1;
    *pbVar1 = (char)(uVar3 / 100) + 0x30;
    uVar3 = (uint)(char)(uVar3 % 100);
  }
  pbVar9 = pbVar10 + 2;
  *(char **)pbVar10 =
       (char *)s_YOU_HAVE_NO_CHOICE__6000_302b + 5 + CONCAT11((char)(uVar3 % 10),(char)(uVar3 / 10))
  ;
LAB_1000_075e:
  *pbVar9 = 0;
  return;
}


// ==== FUN_1000_076a @ 1000:076a (size 5) callers: 

void __cdecl16near FUN_1000_076a(void)

{
  return;
}


// ==== FUN_1000_076f @ 1000:076f (size 43) callers: FUN_1000_0ea4,FUN_1000_1141

void __cdecl16near FUN_1000_076f(void)

{
  return;
}


// ==== FUN_1000_079a @ 1000:079a (size 734) callers: 

uint __cdecl16near
FUN_1000_079a(code *param_1,code *param_2,undefined2 param_3,int param_4,int *param_5,
             undefined2 *param_6)

{
  int iVar1;
  bool bVar2;
  bool bVar3;
  bool bVar4;
  int iVar5;
  int iVar6;
  char cVar7;
  byte bVar8;
  uint uVar9;
  uint uVar10;
  uint uVar11;
  uint uVar12;
  int iVar13;
  undefined2 local_10;
  int local_e;
  char local_b;
  
  bVar2 = true;
  bVar3 = false;
  bVar4 = false;
  local_b = '\0';
  local_e = 0;
  local_10 = 1;
  uVar10 = 0x8000;
  uVar11 = 0xfffe;
  do {
    local_e = local_e + 1;
    uVar9 = (*param_1)(param_3);
    if ((int)uVar9 < 0) {
      local_10 = 0xffff;
      goto LAB_1000_08d0;
    }
    cVar7 = (char)uVar9;
    uVar9 = (uint)cVar7;
  } while (((uVar9 & 0x80) == 0) && ((*(byte *)(uVar9 + 0x8dc3) & 1) != 0));
  iVar13 = param_4 + -1;
  if (0 < param_4) {
    if ((cVar7 != '+') && (uVar12 = uVar11, iVar1 = local_e, cVar7 != '-')) goto LAB_1000_082c;
    bVar3 = true;
    param_4 = iVar13;
    while (iVar13 = param_4 + -1, 0 < param_4) {
      iVar1 = local_e + 1;
      uVar9 = (*param_1)(param_3);
      uVar12 = uVar11;
      if ((bVar2) && (bVar3)) {
        if ((char)uVar9 == 'I') {
          uVar9 = (*param_1)(param_3);
          iVar1 = param_4 + -2;
          iVar5 = iVar1;
          iVar6 = local_e + 2;
          if ((iVar13 < 1) || ((char)uVar9 != 'N')) goto LAB_1000_08cb;
          local_e = local_e + 3;
          uVar9 = (*param_1)(param_3);
          iVar5 = param_4 + -3;
          iVar6 = local_e;
          if ((iVar1 < 1) || ((char)uVar9 != 'F')) goto LAB_1000_08cb;
          goto LAB_1000_09e3;
        }
        if ((char)uVar9 == 'N') {
          uVar9 = (*param_1)(param_3);
          iVar1 = param_4 + -2;
          iVar5 = iVar1;
          iVar6 = local_e + 2;
          if ((iVar13 < 1) || ((char)uVar9 != 'A')) goto LAB_1000_08cb;
          local_e = local_e + 3;
          uVar9 = (*param_1)(param_3);
          iVar5 = param_4 + -3;
          iVar6 = local_e;
          if ((iVar1 < 1) || ((char)uVar9 != 'N')) goto LAB_1000_08cb;
          goto LAB_1000_09e3;
        }
      }
LAB_1000_082c:
      local_e = iVar1;
      param_4 = iVar13;
      bVar2 = false;
      bVar8 = (byte)uVar9;
      uVar11 = uVar12;
      if (bVar8 == 0x2e) {
        if (uVar10 != 0x8000) goto LAB_1000_08e8;
        uVar10 = 0;
        if (0 < (int)uVar12) {
          uVar10 = uVar12;
        }
      }
      else {
        if ((0x39 < bVar8) || (bVar8 < 0x30)) goto LAB_1000_08e8;
        uVar11 = uVar12 + 1;
        if ((uVar11 == 0 || (int)uVar12 < -1) &&
           ((uVar11 = 1, bVar8 == 0x30 && (uVar11 = 0xffff, uVar10 != 0x8000)))) {
          uVar10 = uVar10 - 1;
        }
      }
    }
  }
  param_4 = iVar13;
  uVar9 = 0x65;
LAB_1000_08e8:
  iVar5 = param_4;
  iVar6 = local_e;
  if (uVar11 == 0xfffe) {
LAB_1000_08cb:
    local_e = iVar6;
    param_4 = iVar5;
    local_10 = 0;
LAB_1000_08d0:
    if (-1 < param_4) {
      uVar9 = (*param_2)(uVar9,param_3);
      local_e = local_e + -1;
    }
  }
  else {
    if (uVar10 == 0x8000) {
      uVar10 = uVar11;
    }
    iVar13 = 0;
    if (((char)uVar9 == 'E') || ((char)uVar9 == 'e')) {
      iVar1 = param_4 + -1;
      if (0 < param_4) {
        local_e = local_e + 1;
        uVar9 = (*param_1)(param_3);
        param_4 = iVar1;
        if ((char)uVar9 != '+') {
          if ((char)uVar9 != '-') goto LAB_1000_092e;
          bVar4 = true;
        }
        while (0 < param_4) {
          local_e = local_e + 1;
          uVar9 = (*param_1)(param_3);
          param_4 = param_4 + -1;
LAB_1000_092e:
          bVar8 = (byte)uVar9;
          if ((0x39 < bVar8) || (bVar8 < 0x30)) goto LAB_1000_094f;
          uVar9 = iVar13 * 10;
          iVar13 = (int)(char)(bVar8 - 0x30) + uVar9;
          if (0x1344 < iVar13) {
            iVar13 = 0;
            local_b = '\x01';
          }
        }
      }
    }
    else {
LAB_1000_094f:
      uVar9 = (*param_2)(uVar9,param_3);
      local_e = local_e + -1;
    }
    if (bVar4) {
      iVar13 = -iVar13;
      local_b = -local_b;
    }
    if (-1 < (int)uVar11) {
      uVar9 = uVar10 + iVar13;
      if (local_b == '\x01') {
        uVar9 = 0xffff;
      }
      else if (local_b != -1) {
        if (0x12 < uVar11) {
          uVar11 = 0x12;
        }
        uVar9 = iVar13 + (uVar10 - uVar11);
        if (uVar9 != 0) {
          if ((int)uVar9 < 0) {
            uVar9 = -uVar9;
          }
          FUN_1000_0e73();
        }
        goto LAB_1000_09e3;
      }
      local_10 = 2;
    }
  }
LAB_1000_09e3:
  *param_5 = *param_5 + local_e;
  *param_6 = local_10;
  return uVar9;
}


// ==== FUN_1000_0a78 @ 1000:0a78 (size 8) callers: 

void __cdecl16near FUN_1000_0a78(void)

{
  return;
}


// ==== FUN_1000_0a80 @ 1000:0a80 (size 118) callers: 

void __cdecl16near FUN_1000_0a80(double *param_1,uint param_2)

{
  unkbyte10 in_ST0;
  longdouble in_ST1;
  
  if ((param_2 & 4) == 0) {
    if ((param_2 & 8) == 0) {
      FUN_1000_0520(DAT_6000_8b72,in_ST0,0);
      *(float *)param_1 = (float)in_ST1;
    }
    else {
      *(unkbyte10 *)param_1 = in_ST0;
    }
  }
  else {
    FUN_1000_0520(DAT_6000_8b0a,in_ST0,1);
    *param_1 = (double)in_ST1;
  }
  return;
}


// ==== FUN_1000_0af6 @ 1000:0af6 (size 5) callers: 

void __cdecl16far FUN_1000_0af6(void)

{
  return;
}


// ==== FUN_1000_0afb @ 1000:0afb (size 52) callers: FUN_1000_05db

void FUN_1000_0afb(uint param_1)

{
  int in_stack_0000000a;
  
  *(uint *)(param_1 + in_stack_0000000a) = *(uint *)(param_1 + in_stack_0000000a) & 0x7fff;
                    /* WARNING: Could not recover jumptable at 0x00010b2a. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*(code *)*(undefined2 *)((param_1 >> 2) * 2 + 0xb2f))();
  return;
}


// ==== FUN_1000_0d04 @ 1000:0d04 (size 164) callers: 

void __cdecl16near FUN_1000_0d04(void)

{
  code *pcVar1;
  int *in_BX;
  undefined2 unaff_SS;
  code *pcVar2;
  int local_8;
  int *local_6;
  
  _local_6 = (int *)CONCAT22(unaff_SS,in_BX);
  if (DAT_6000_d1e4 != (code *)0x0 || DAT_6000_d1e6 != 0) {
    pcVar2 = (code *)(*DAT_6000_d1e4)(0x1000,8,0,0);
    local_8 = (int)((ulong)pcVar2 >> 0x10);
    pcVar1 = (code *)pcVar2;
    (*DAT_6000_d1e4)(0x1000,8,pcVar2);
    if ((local_8 == 0) && (pcVar1 == (code *)((int)(undefined2 *)&DAT_6000_0000 + 1))) {
      return;
    }
    if (pcVar1 != (code *)0x0 || local_8 != 0) {
      (*DAT_6000_d1e4)(0x1000,8,0,0);
      (*pcVar1)(0x1000,8,*(undefined2 *)((int)(undefined8 *)&DAT_6000_8b72 + *_local_6 * 4 + 4));
      return;
    }
  }
  FUN_1000_37b5(0x8ef0,(char *)s_Floating_point_error___s__6000_8beb,
                *(undefined2 *)((int)(undefined8 *)&DAT_6000_8b72 + *_local_6 * 4 + 6));
  FUN_1000_02ad(0x1000);
  return;
}


// ==== FUN_1000_0daa @ 1000:0daa (size 201) callers: FUN_1000_0e73

uint FUN_1000_0daa(uint param_1)

{
  if (((-0x1345 < (int)param_1) && ((int)param_1 < 0x1345)) && (param_1 != 0)) {
    if ((int)param_1 < 0) {
      param_1 = -param_1;
    }
    if (param_1 >> 4 == 0) {
      param_1 = 0;
    }
    else {
      param_1 = param_1 >> 0xd;
    }
  }
  return param_1;
}


// ==== FUN_1000_0e73 @ 1000:0e73 (size 11) callers: FUN_1000_079a

void __cdecl16far FUN_1000_0e73(undefined2 param_1)

{
  FUN_1000_0daa(param_1);
  return;
}


// ==== FUN_1000_0e7e @ 1000:0e7e (size 38) callers: FUN_1000_10b1

undefined2 __cdecl16far FUN_1000_0e7e(int *param_1)

{
  int *piVar1;
  
  if (*param_1 == 4) {
    piVar1 = param_1 + 10;
    piVar1[0] = 0;
    piVar1[1] = 0;
    piVar1[2] = 0;
    piVar1[3] = 0;
  }
  else if (*param_1 != 5) {
    return 0;
  }
  return 1;
}


// ==== FUN_1000_0ea4 @ 1000:0ea4 (size 26) callers: FUN_3000_2770,FUN_3000_30d7

void __cdecl16far FUN_1000_0ea4(void)

{
  int in_stack_0000000a;
  
  if ((uint)(in_stack_0000000a * 2) < 0x8681) {
    FUN_1000_076f();
  }
  return;
}


// ==== FUN_1000_0ebe @ 1000:0ebe (size 106) callers: 

void FUN_1000_0ebe(void)

{
  code *pcVar1;
  undefined8 uVar2;
  uint uVar3;
  int iVar4;
  uint in_stack_00000008;
  uint in_stack_0000000a;
  
  if ((char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 8 < (char *)(in_stack_0000000a & 0x7fff)) {
    uVar3 = 0xffff;
    if ((char *)(in_stack_0000000a & 0x7fff) < (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 10)
    {
      uVar3 = in_stack_00000008;
    }
    if ((in_stack_0000000a & 0x8000) == 0) {
      if (0xb171 < uVar3) {
        iVar4 = 3;
code_r0x00010ef8:
        uVar2 = DAT_6000_8b0a;
        if (iVar4 == 4) {
          uVar2 = 0;
        }
        FUN_1000_10b1(iVar4,0x8c8e,0,0,uVar2);
        return;
      }
    }
    else if (0xb171 < uVar3) {
      iVar4 = 4;
      goto code_r0x00010ef8;
    }
  }
  pcVar1 = (code *)swi(0x3e);
  (*pcVar1)();
  return;
}


// ==== pow @ 1000:0f28 (size 363) callers: FUN_2000_59fd,FUN_2000_5ae2,FUN_2000_5b41,FUN_3000_b8d4  // libm pow(double, double)

/* WARNING: Removing unreachable block (ram,0x00010fed) */

double __cdecl16far pow(double x,double y)

{
  code *pcVar1;
  char cVar2;
  byte bVar3;
  uint uVar4;
  uint uVar5;
  int iVar6;
  undefined2 uVar7;
  bool bVar8;
  longdouble in_ST0;
  longdouble lVar9;
  double local_a;
  
  lVar9 = (longdouble)x;
  uVar5 = (uint)((qword)x >> 0x30);
  uVar4 = (uint)((qword)y >> 0x30);
  if (((qword)x & 0x7ff0000000000000) == 0) {
    if (0 < (int)uVar4) {
      in_ST0 = (longdouble)0;
      goto LAB_1000_10ac;
    }
    uVar7 = 1;
    if (uVar4 == 0) {
      local_a = 1.0;
    }
    else {
      local_a = DAT_6000_8b0a;
    }
  }
  else if ((uVar5 & 0x7ff0) == 0x7ff0) {
    local_a = x;
    if ((sqword)y < 0) {
      uVar7 = 4;
      local_a = 0.0;
    }
    else {
LAB_1000_0f85:
      uVar7 = 3;
    }
  }
  else {
    local_a = y;
    if (((qword)y & 0x7ff0000000000000) == 0) {
      in_ST0 = (longdouble)1;
      goto LAB_1000_10ac;
    }
    if ((uVar4 & 0x7ff0) == 0x7ff0) goto LAB_1000_0f85;
    uVar4 = (uVar4 & 0x7ff0) >> 4;
    if (uVar4 - 0x3ff < 0x3f) {
      if (((byte)(uVar4 - 0x3ff) < 0xc) &&
         (iVar6 = uVar5 * 2 + -0x7fe0, bVar3 = (char)uVar4 + 2, uVar4 = uVar4 - 0x3ff,
         (iVar6 << (bVar3 & 0x1f)) >> (bVar3 & 0x1f) == iVar6)) {
        uVar5 = CONCAT11((char)((y._4_2_ & 0xfff0) >> 8),(byte)(y._4_2_ & 0xfff0) | y._6_1_ & 0xf);
        uVar5 = uVar5 >> 4 | uVar5 << 0xc;
        in_ST0 = lVar9;
        while (cVar2 = (char)uVar4, uVar4 = (uint)(byte)(cVar2 - 1), '\0' < cVar2) {
          in_ST0 = in_ST0 * in_ST0;
          bVar8 = (int)uVar5 < 0;
          uVar5 = uVar5 << 1;
          if (bVar8) {
            in_ST0 = in_ST0 * lVar9;
          }
        }
        if (((qword)y & 0x8000000000000000) != 0) {
          in_ST0 = (longdouble)1 / in_ST0;
        }
        goto LAB_1000_10ac;
      }
      if (((qword)x & 0x8000000000000000) != 0) {
        lVar9 = -lVar9;
      }
    }
    if ((longdouble)0 <= lVar9) {
      pcVar1 = (code *)swi(0x3e);
      (*pcVar1)();
      do {
                    /* WARNING: Do nothing block with infinite loop */
      } while( true );
    }
    local_a = DAT_6000_8c86;
    uVar7 = 1;
  }
  FUN_1000_10b1(uVar7,0x8c92,&x,&y,local_a);
LAB_1000_10ac:
  return (double)in_ST0;
}


// ==== FUN_1000_10b1 @ 1000:10b1 (size 144) callers: FUN_1000_0ebe,pow

void __cdecl16far
FUN_1000_10b1(int param_1,undefined2 param_2,undefined8 *param_3,undefined8 *param_4,
             undefined8 param_5)

{
  int iVar1;
  int local_1e;
  undefined2 local_1c;
  undefined8 local_1a;
  undefined8 local_12;
  undefined8 local_a;
  
  local_1e = param_1;
  local_1c = param_2;
  if (param_3 == (undefined8 *)0x0) {
    local_1a = 0;
  }
  else {
    local_1a = *param_3;
  }
  if (param_4 == (undefined8 *)0x0) {
    local_12 = 0;
  }
  else {
    local_12 = *param_4;
  }
  local_a = param_5;
  iVar1 = FUN_1000_0e7e(&local_1e);
  if (iVar1 == 0) {
    FUN_1000_37b5(0x8ef0,(char *)s__s___s_error_6000_8c96,param_2,
                  *(undefined2 *)(param_1 * 2 + -0x74d8));
    if ((param_1 == 3) || (param_1 == 4)) {
      DAT_6000_0094 = 0x22;
    }
    else {
      DAT_6000_0094 = 0x21;
    }
  }
  return;
}


// ==== FUN_1000_1141 @ 1000:1141 (size 26) callers: FUN_3000_274a,FUN_3000_30d7

void __cdecl16far FUN_1000_1141(void)

{
  int in_stack_0000000a;
  
  if ((uint)(in_stack_0000000a * 2) < 0x8681) {
    FUN_1000_076f();
  }
  return;
}


// ==== ftol @ 1000:115b (size 44) callers: FUN_2000_97b8,movecontrol,FUN_2000_f853,FUN_3000_12ca,FUN_3000_1a08,FUN_3000_2796,FUN_3000_30d7,FUN_3000_31f3,roll_char,FUN_3000_8235,FUN_3000_9cfb,FUN_4000_0699  // double -> long, through the 80x87 emulator

long __cdecl16far ftol(double x)

{
  longdouble in_ST0;
  
  return (long)(sqword)ROUND(in_ST0);
}


// ==== FUN_1000_1187 @ 1000:1187 (size 45) callers: 

bool __cdecl16far FUN_1000_1187(undefined2 param_1,undefined2 param_2)

{
  int iVar1;
  bool bVar2;
  
  bVar2 = DAT_6000_8dc0 != 0x20;
  if (bVar2) {
    iVar1 = DAT_6000_8dc0 * 4;
    *(undefined2 *)(iVar1 + -0x2eaa) = param_2;
    *(undefined2 *)(iVar1 + -0x2eac) = param_1;
    DAT_6000_8dc0 = DAT_6000_8dc0 + 1;
  }
  return !bVar2;
}


// ==== clock_ticks @ 1000:11b4 (size 73) callers: random_n,generate_section,strike,monster_turn  // BIOS tick count (INT 1Ah) less a baseline; the seed source

int __cdecl16far clock_ticks(void)

{
  code *pcVar1;
  char cVar2;
  int extraout_DX;
  undefined2 local_6;
  
  pcVar1 = (code *)swi(0x1a);
  cVar2 = (*pcVar1)();
  DAT_6000_d1d4 = DAT_6000_d1d4 + cVar2;
  if (cVar2 != '\0') {
    DAT_0000_0470 = 1;
    pcVar1 = (code *)swi(0x21);
    (*pcVar1)();
  }
  local_6 = extraout_DX;
  if (DAT_6000_d1d4 != '\0') {
    local_6 = extraout_DX + 0xb0;
  }
  return local_6 - DAT_6000_0096;
}


// ==== FUN_1000_11fd @ 1000:11fd (size 29) callers: FUN_1000_161b

undefined2 __cdecl16far FUN_1000_11fd(undefined2 param_1,undefined2 *param_2)

{
  code *pcVar1;
  undefined2 uVar2;
  undefined2 in_CX;
  bool bVar3;
  
  bVar3 = false;
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  if (bVar3) {
    uVar2 = FUN_1000_14f6();
  }
  else {
    *param_2 = in_CX;
    uVar2 = 0;
  }
  return uVar2;
}


// ==== FUN_1000_121a @ 1000:121a (size 27) callers: 

undefined2 __cdecl16far FUN_1000_121a(void)

{
  code *pcVar1;
  undefined2 uVar2;
  undefined1 in_CF;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  if ((bool)in_CF) {
    uVar2 = FUN_1000_14f6();
  }
  else {
    uVar2 = 0;
  }
  return uVar2;
}


// ==== FUN_1000_1235 @ 1000:1235 (size 1) callers: FUN_1000_1236

void __cdecl16far FUN_1000_1235(void)

{
  return;
}


// ==== FUN_1000_1236 @ 1000:1236 (size 87) callers: FUN_1000_128d,FUN_1000_129c

void FUN_1000_1236(undefined2 param_1,int param_2,int param_3)

{
  undefined2 *puVar1;
  
  if (param_3 == 0) {
    while (DAT_6000_8dc0 != 0) {
      DAT_6000_8dc0 = DAT_6000_8dc0 + -1;
      puVar1 = (undefined2 *)(DAT_6000_8dc0 * 4 + -0x2eac);
      (*(code *)*puVar1)(0x1000);
    }
    FUN_1000_0163();
    (*DAT_6000_8ec4)(0x1000);
  }
  FUN_1000_01f3();
  FUN_1000_0176();
  if (param_2 == 0) {
    if (param_3 == 0) {
      (*DAT_6000_8ec8)(0x1000);
      (*DAT_6000_8ecc)(0x1000);
    }
    FUN_1000_019e(0x1000,param_1);
  }
  return;
}


// ==== FUN_1000_128d @ 1000:128d (size 15) callers: FUN_2000_037f,FUN_2000_03a5,quit,load_world_pic,main,FUN_2000_7b86,entry

void __cdecl16far FUN_1000_128d(undefined2 param_1)

{
  FUN_1000_1236(param_1,0,0);
  return;
}


// ==== FUN_1000_129c @ 1000:129c (size 18) callers: FUN_1000_02ad

void __cdecl16far FUN_1000_129c(undefined2 param_1)

{
  FUN_1000_1236(param_1,0,1);
  return;
}


// ==== N_LXMUL @ 1000:12c8 (size 23) callers: FUN_2000_04ee,FUN_2000_0837,FUN_2000_0ed9,FUN_2000_1d0b,FUN_2000_1fbd,FUN_2000_216b,FUN_2000_22ff,FUN_2000_248e,random_n,FUN_2000_3085,financial_statement,inn,bank,FUN_2000_3ae1,main,pick_monster,generate_section,random_walk,roll_dice,strike,monster_turn,FUN_2000_726f,FUN_2000_7421,FUN_2000_7756,FUN_2000_81cd,FUN_2000_8728,FUN_2000_8aab,FUN_2000_8f95,show_help,FUN_2000_9968,chute,FUN_2000_9ed9,dig_hole,FUN_2000_a57e,FUN_2000_a6fa,FUN_2000_a9bd,movecontrol,FUN_2000_ea27,FUN_2000_f853,FUN_3000_0105,FUN_3000_0b3b,FUN_3000_12ca,FUN_3000_1a08,FUN_3000_2796,FUN_3000_31f3,roll_char,FUN_3000_5d06,FUN_3000_7e52,FUN_3000_8235,FUN_3000_8b27,FUN_3000_9383,FUN_3000_a047,seeded_pick,FUN_3000_b066,FUN_3000_b1d6,FUN_3000_b99e,FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_bdb5,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a,FUN_3000_d0b9,FUN_3000_d37f,FUN_3000_d43b,FUN_3000_d51c,FUN_3000_e221,FUN_3000_e5f5,FUN_3000_e8ee,FUN_4000_0034,FUN_4000_0699,print_text,print_text_clipped,FUN_4000_2dc1,FUN_4000_2dea,mouse_pick,FUN_4000_3a72,read_string,FUN_4000_4016,draw_text_box  // 32-bit multiply helper: DX:AX * CX:BX

long __cdecl16far N_LXMUL(long a,long b)

{
  long lVar1;
  int iVar2;
  int iVar3;
  int iVar4;
  
  iVar3 = (int)((ulong)b >> 0x10);
  iVar4 = (int)((ulong)a >> 0x10);
  iVar2 = 0;
  if (iVar4 != 0) {
    iVar2 = iVar4 * (int)b;
  }
  if (iVar3 != 0) {
    iVar2 = iVar3 * (int)a + iVar2;
  }
  lVar1 = (a & 0xffffU) * (b & 0xffffU);
  return CONCAT22((int)((ulong)lVar1 >> 0x10) + iVar2,(int)lVar1);
}


// ==== FUN_1000_12df @ 1000:12df (size 19) callers: time

void __cdecl16far FUN_1000_12df(undefined2 *param_1)

{
  code *pcVar1;
  undefined2 in_CX;
  undefined2 extraout_DX;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  *param_1 = in_CX;
  param_1[1] = extraout_DX;
  return;
}


// ==== FUN_1000_12f2 @ 1000:12f2 (size 19) callers: time

void __cdecl16far FUN_1000_12f2(undefined2 *param_1)

{
  code *pcVar1;
  undefined2 in_CX;
  undefined2 extraout_DX;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  *param_1 = in_CX;
  param_1[1] = extraout_DX;
  return;
}


// ==== FUN_1000_1305 @ 1000:1305 (size 15) callers: FUN_2000_0004

undefined2 __cdecl16far FUN_1000_1305(void)

{
  code *pcVar1;
  undefined2 in_BX;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  return in_BX;
}


// ==== FUN_1000_1314 @ 1000:1314 (size 17) callers: 

void __cdecl16far FUN_1000_1314(void)

{
  code *pcVar1;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  return;
}


// ==== FUN_1000_1325 @ 1000:1325 (size 3) callers: FUN_1000_4651

void FUN_1000_1325(void)

{
  FUN_1000_1342();
  return;
}


// ==== F_LDIV @ 1000:1328 (size 4) callers: FUN_2000_04ee,FUN_2000_0837,FUN_2000_0ed9,FUN_2000_1485,FUN_2000_1d0b,FUN_2000_1fbd,FUN_2000_216b,FUN_2000_22ff,FUN_2000_248e,random_n,FUN_2000_2d8e,FUN_2000_3085,financial_statement,inn,bank,FUN_2000_3ae1,main,pick_monster,generate_section,random_walk,random_run,roll_dice,strike,monster_turn,FUN_2000_726f,FUN_2000_7421,FUN_2000_7756,FUN_2000_7fb1,FUN_2000_81cd,FUN_2000_8728,FUN_2000_8aab,FUN_2000_8f95,show_help,FUN_2000_9968,chute,FUN_2000_9ed9,dig_hole,FUN_2000_a57e,FUN_2000_a64b,FUN_2000_a6fa,FUN_2000_a9bd,movecontrol,FUN_2000_ea27,FUN_2000_f853,FUN_3000_0105,FUN_3000_0b3b,FUN_3000_12ca,FUN_3000_1a08,FUN_3000_31f3,roll_char,FUN_3000_5d06,FUN_3000_7e52,FUN_3000_8235,FUN_3000_8b27,FUN_3000_9383,FUN_3000_a047,seeded_pick,FUN_3000_b066,FUN_3000_b1d6,FUN_3000_b99e,FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_bdb5,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a,FUN_3000_d0b9,FUN_3000_d37f,FUN_3000_d43b,FUN_3000_d51c,FUN_3000_e221,FUN_3000_e5f5,FUN_3000_e8ee,FUN_4000_0699,print_text,print_text_clipped,FUN_4000_100f,FUN_4000_2dc1,FUN_4000_2dea,mouse_pick,FUN_4000_3a72,read_string,FUN_4000_4016,draw_text_box  // signed 32-bit divide (far entry, retf 8)

long __stdcall16far F_LDIV(long a,long b)

{
  long lVar1;
  
  lVar1 = FUN_1000_1342();
  return lVar1;
}


// ==== F_LUDIV @ 1000:132f (size 5) callers: show_roll  // unsigned 32-bit divide

long __stdcall16far F_LUDIV(long a,long b)

{
  long lVar1;
  
  lVar1 = FUN_1000_1342();
  return lVar1;
}


// ==== FUN_1000_1334 @ 1000:1334 (size 3) callers: FUN_1000_4651

void FUN_1000_1334(void)

{
  FUN_1000_1342();
  return;
}


// ==== F_LMOD @ 1000:1337 (size 5) callers:   // signed 32-bit modulo

long __stdcall16far F_LMOD(long a,long b)

{
  long lVar1;
  
  lVar1 = FUN_1000_1342();
  return lVar1;
}


// ==== F_LUMOD @ 1000:133f (size 1) callers:   // unsigned 32-bit modulo

/* WARNING: Removing unreachable block (ram,0x00011367) */
/* WARNING: Removing unreachable block (ram,0x0001136b) */
/* WARNING: Removing unreachable block (ram,0x00011375) */
/* WARNING: Removing unreachable block (ram,0x00011379) */
/* WARNING: Removing unreachable block (ram,0x0001139b) */
/* WARNING: Removing unreachable block (ram,0x000113b9) */

long __stdcall16far F_LUMOD(long a,long b)

{
  ulong uVar1;
  ulong uVar2;
  int iVar3;
  int iVar5;
  uint uVar6;
  uint uVar7;
  bool bVar8;
  int iVar4;
  
  if ((b._2_2_ == 0) && ((a._2_2_ == 0 || ((uint)b == 0)))) {
    uVar6 = (uint)((ulong)a % (b & 0xffffU));
    uVar7 = 0;
  }
  else {
    iVar5 = 0x20;
    uVar7 = 0;
    uVar6 = 0;
    do {
      iVar4 = (int)a;
      iVar3 = iVar4 * 2;
      uVar1 = (ulong)CONCAT12(iVar4 < 0,(int)((ulong)a >> 0x10)) << 1;
      bVar8 = (uVar1 & 0x10000) != 0;
      uVar2 = (ulong)CONCAT12(bVar8,uVar6) << 1;
      uVar6 = (uint)uVar2 | (uint)bVar8;
      uVar7 = uVar7 << 1 | (uint)((uVar2 & 0x10000) != 0);
      if ((ulong)b <= CONCAT22(uVar7,uVar6)) {
        bVar8 = uVar6 < (uint)b;
        uVar6 = uVar6 - (uint)b;
        uVar7 = (uVar7 - b._2_2_) - (uint)bVar8;
        iVar3 = iVar3 + 1;
      }
      a = CONCAT22((int)(uVar1 | iVar4 < 0),iVar3);
      iVar5 = iVar5 + -1;
    } while (iVar5 != 0);
  }
  return CONCAT22(uVar7,uVar6);
}


// ==== FUN_1000_1342 @ 1000:1342 (size 145) callers: F_LDIV,F_LMOD,F_LUDIV

undefined4 __stdcall16far FUN_1000_1342(uint param_1,uint param_2,uint param_3,uint param_4)

{
  ulong uVar1;
  uint uVar2;
  uint in_CX;
  int iVar3;
  uint uVar4;
  uint uVar5;
  bool bVar6;
  
  if ((param_4 == 0) && ((param_2 == 0 || (param_3 == 0)))) {
    uVar2 = (uint)(CONCAT22(param_2,param_1) / (ulong)param_3);
    if ((in_CX & 2) != 0) {
      uVar2 = (uint)(CONCAT22(param_2,param_1) % (ulong)param_3);
    }
    param_2 = 0;
  }
  else {
    if ((in_CX & 1) == 0) {
      if ((int)param_2 < 0) {
        bVar6 = param_1 != 0;
        param_1 = -param_1;
        param_2 = -(uint)bVar6 - param_2;
        in_CX = in_CX | 0xc;
      }
      if ((int)param_4 < 0) {
        bVar6 = param_3 != 0;
        param_3 = -param_3;
        param_4 = -(uint)bVar6 - param_4;
        in_CX = in_CX ^ 4;
      }
    }
    iVar3 = 0x20;
    uVar5 = 0;
    uVar4 = 0;
    do {
      bVar6 = (int)param_1 < 0;
      param_1 = param_1 * 2;
      uVar1 = (ulong)CONCAT12(bVar6,param_2) << 1;
      param_2 = (uint)uVar1 | (uint)bVar6;
      bVar6 = (uVar1 & 0x10000) != 0;
      uVar1 = (ulong)CONCAT12(bVar6,uVar4) << 1;
      uVar4 = (uint)uVar1 | (uint)bVar6;
      uVar5 = uVar5 << 1 | (uint)((uVar1 & 0x10000) != 0);
      if ((param_4 <= uVar5) && ((param_4 < uVar5 || (param_3 <= uVar4)))) {
        bVar6 = uVar4 < param_3;
        uVar4 = uVar4 - param_3;
        uVar5 = (uVar5 - param_4) - (uint)bVar6;
        param_1 = param_1 + 1;
      }
      iVar3 = iVar3 + -1;
    } while (iVar3 != 0);
    uVar2 = param_1;
    if ((in_CX & 2) != 0) {
      in_CX = in_CX >> 1;
      uVar2 = uVar4;
      param_2 = uVar5;
    }
    if ((in_CX & 4) != 0) {
      bVar6 = uVar2 != 0;
      uVar2 = -uVar2;
      param_2 = -(uint)bVar6 - param_2;
    }
  }
  return CONCAT22(param_2,uVar2);
}


// ==== FUN_1000_13d3 @ 1000:13d3 (size 3) callers: FUN_1000_27d9

long FUN_1000_13d3(void)

{
  uint in_AX;
  byte in_CL;
  int in_DX;
  
  if (in_CL < 0x10) {
    return CONCAT22(in_DX << (in_CL & 0x1f) | in_AX >> (0x10 - in_CL & 0x1f),in_AX << (in_CL & 0x1f)
                   );
  }
  return (ulong)(in_AX << (in_CL - 0x10 & 0x1f)) << 0x10;
}


// ==== N_LXLSH @ 1000:13d6 (size 30) callers: FUN_2000_0ed9,FUN_2000_248e,inn,monster_turn,FUN_2000_7fb1,FUN_2000_81cd,FUN_3000_0b3b,FUN_3000_12ca,FUN_3000_9383,FUN_3000_bdb5,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cf3a,FUN_3000_d37f  // 32-bit shift left by CL

long __cdecl16far N_LXLSH(long a,char n)

{
  uint uVar1;
  
  uVar1 = (uint)a;
  if ((byte)n < 0x10) {
    return CONCAT22((int)((ulong)a >> 0x10) << (n & 0x1fU) | uVar1 >> (0x10U - n & 0x1f),
                    uVar1 << (n & 0x1fU));
  }
  return (ulong)(uVar1 << (n - 0x10U & 0x1f)) << 0x10;
}


// ==== N_LXRSH @ 1000:13f7 (size 29) callers: FUN_2000_0ed9,FUN_2000_1485,FUN_3000_0105,FUN_3000_0b3b,FUN_3000_12ca,FUN_3000_1a08,FUN_3000_2796,FUN_4000_0034  // 32-bit arithmetic shift right by CL

long __cdecl16far N_LXRSH(long a,char n)

{
  int iVar1;
  
  iVar1 = (int)((ulong)a >> 0x10);
  if ((byte)n < 0x10) {
    return CONCAT22(iVar1 >> (n & 0x1fU),(uint)a >> (n & 0x1fU) | iVar1 << (0x10U - n & 0x1f));
  }
  return CONCAT22(iVar1 >> 0xf,iVar1 >> (n - 0x10U & 0x1f));
}


// ==== FUN_1000_1417 @ 1000:1417 (size 30) callers: FUN_2000_d358

uint __cdecl16far FUN_1000_1417(void)

{
  uint in_AX;
  byte in_CL;
  uint in_DX;
  
  if (in_CL < 0x10) {
    return in_AX >> (in_CL & 0x1f) | in_DX << (0x10 - in_CL & 0x1f);
  }
  return in_DX >> (in_CL - 0x10 & 0x1f);
}


// ==== FUN_1000_1435 @ 1000:1435 (size 77) callers: FUN_1000_27d9

byte __cdecl16far FUN_1000_1435(void)

{
  char in_AL;
  int in_CX;
  byte in_BL;
  
  if (in_CX < 0) {
    return in_AL - (~in_BL + 1) & 0xf;
  }
  return in_AL + in_BL & 0xf;
}


// ==== FUN_1000_1495 @ 1000:1495 (size 40) callers: FUN_1000_2864

int __cdecl16far FUN_1000_1495(void)

{
  int in_AX;
  int in_CX;
  int in_DX;
  int in_BX;
  
  return (in_DX * 0x10 + in_AX) - (in_BX + in_CX * 0x10);
}


// ==== FUN_1000_14bd @ 1000:14bd (size 57) callers: FUN_1000_14f6,FUN_1000_15b3,FUN_1000_16cd,unlink,FUN_1000_18d0,FUN_1000_2a2b,FUN_1000_2ac7,FUN_1000_328d,FUN_1000_3401,FUN_1000_341c,FUN_1000_3444,FUN_1000_3462,FUN_1000_3d3b,FUN_1000_3d66,FUN_1000_3ebe,FUN_1000_422b,FUN_1000_4a81,FUN_1000_4b8f

undefined2 FUN_1000_14bd(int param_1)

{
  if (param_1 < 0) {
    if (param_1 == -0x30 || -param_1 < 0x30) {
      DAT_6000_0094 = -param_1;
      DAT_6000_9042 = 0xffff;
      return 0xffff;
    }
  }
  else if (param_1 < 0x59) goto LAB_1000_14d0;
  param_1 = 0x57;
LAB_1000_14d0:
  DAT_6000_9042 = param_1;
  DAT_6000_0094 = (int)*(char *)(param_1 + -0x6fbc);
  return 0xffff;
}


// ==== FUN_1000_14f6 @ 1000:14f6 (size 18) callers: FUN_1000_11fd,FUN_1000_121a

undefined2 FUN_1000_14f6(undefined2 param_1)

{
  FUN_1000_14bd(param_1);
  return param_1;
}


// ==== FUN_1000_1508 @ 1000:1508 (size 17) callers: FUN_1000_36cf

uint __cdecl16far FUN_1000_1508(void)

{
  code *pcVar1;
  uint extraout_DX;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  return extraout_DX & 0x80;
}


// ==== FUN_1000_1519 @ 1000:1519 (size 125) callers: FUN_1000_1596,FUN_1000_195e,FUN_1000_3c9c,ltoa,itoa

char * FUN_1000_1519(char param_1,char param_2,uint param_3,char *param_4,uint param_5,uint param_6)

{
  char *pcVar1;
  byte bVar2;
  ulong uVar3;
  char cVar4;
  int iVar5;
  byte *pbVar6;
  char *pcVar7;
  bool bVar8;
  byte local_24 [34];
  
  pcVar7 = param_4;
  if ((param_3 < 0x25) && (1 < (byte)param_3)) {
    if (((int)param_6 < 0) && (param_2 != '\0')) {
      *param_4 = '-';
      pcVar7 = param_4 + 1;
      bVar8 = param_5 != 0;
      param_5 = -param_5;
      param_6 = -(uint)bVar8 - param_6;
    }
    pbVar6 = local_24;
    if (param_6 == 0) goto LAB_1000_1563;
    do {
      uVar3 = (ulong)param_6;
      param_6 = param_6 / param_3;
      uVar3 = uVar3 % (ulong)param_3 << 0x10 | (ulong)param_5;
      param_5 = (uint)(uVar3 / param_3);
      *pbVar6 = (byte)(uVar3 % (ulong)param_3);
      pbVar6 = pbVar6 + 1;
    } while (param_6 != 0);
    while (param_5 != 0) {
LAB_1000_1563:
      *pbVar6 = (byte)(param_5 % param_3);
      pbVar6 = pbVar6 + 1;
      param_5 = param_5 / param_3;
    }
    iVar5 = (int)pbVar6 - (int)local_24;
    do {
      pbVar6 = pbVar6 + -1;
      bVar2 = *pbVar6;
      if (bVar2 < 10) {
        cVar4 = bVar2 + 0x30;
      }
      else {
        cVar4 = (bVar2 - 10) + param_1;
      }
      pcVar1 = pcVar7;
      pcVar7 = pcVar7 + 1;
      *pcVar1 = cVar4;
      iVar5 = iVar5 + -1;
    } while (iVar5 != 0);
  }
  *pcVar7 = '\0';
  return param_4;
}


// ==== FUN_1000_1596 @ 1000:1596 (size 29) callers: FUN_1000_15dc

void FUN_1000_1596(undefined2 param_1,undefined2 param_2)

{
  FUN_1000_1519(0x61,0,10,param_1,param_2,0);
  return;
}


// ==== FUN_1000_15b3 @ 1000:15b3 (size 41) callers: FUN_1000_394a,FUN_1000_39b2,FUN_1000_4083,FUN_1000_422b,FUN_1000_4a81,fputc

void __cdecl16far FUN_1000_15b3(int param_1)

{
  uint *puVar1;
  code *pcVar2;
  bool bVar3;
  
  puVar1 = (uint *)(param_1 * 2 + -0x6fee);
  bVar3 = false;
  *puVar1 = *puVar1 & 0xfdff;
  pcVar2 = (code *)swi(0x21);
  (*pcVar2)();
  if (bVar3) {
    FUN_1000_14bd();
  }
  return;
}


// ==== FUN_1000_15dc @ 1000:15dc (size 63) callers: FUN_1000_161b,fclose

char * FUN_1000_15dc(undefined2 param_1,int param_2,char *param_3)

{
  undefined2 uVar1;
  
  if (param_3 == (char *)0x0) {
    param_3 = (char *)0xd1d6;
  }
  if (param_2 == 0) {
    param_2 = -0x6f62;
  }
  uVar1 = FUN_1000_1e50(param_3,param_2,param_1);
  FUN_1000_1596(uVar1,param_1);
  strcat(param_3,(char *)0x90a2);
  return param_3;
}


// ==== FUN_1000_161b @ 1000:161b (size 67) callers: 

undefined2 FUN_1000_161b(int *param_1,undefined2 param_2)

{
  int iVar1;
  undefined1 local_4 [2];
  
  do {
    if (*param_1 == -1) {
      iVar1 = 2;
    }
    else {
      iVar1 = 1;
    }
    *param_1 = *param_1 + iVar1;
    param_2 = FUN_1000_15dc(*param_1,0,param_2);
    iVar1 = FUN_1000_11fd(param_2,local_4);
  } while (iVar1 == 0);
  return param_2;
}


// ==== lmul32 @ 1000:165e (size 23) callers: FUN_1000_22a2,FUN_1000_4538,FUN_1000_4821,fread,fwrite,rand  // 32x32 multiply used by rand() and fread/fwrite

undefined4 __cdecl16near lmul32(void)

{
  uint in_AX;
  int iVar1;
  int in_CX;
  int in_DX;
  uint in_BX;
  
  iVar1 = 0;
  if (in_DX != 0) {
    iVar1 = in_DX * in_BX;
  }
  if (in_CX != 0) {
    iVar1 = in_CX * in_AX + iVar1;
  }
  return CONCAT22((int)((ulong)in_AX * (ulong)in_BX >> 0x10) + iVar1,
                  (int)((ulong)in_AX * (ulong)in_BX));
}


// ==== FUN_1000_1675 @ 1000:1675 (size 33) callers: FUN_1000_279a,FUN_1000_27d9

uint __cdecl16near FUN_1000_1675(void)

{
  uint in_AX;
  
  return in_AX & 0xf;
}


// ==== srand @ 1000:1696 (size 17) callers: random_n,main,generate_section,strike,monster_turn,FUN_2000_a6fa,roll_char,FUN_3000_5d06,seeded_pick,FUN_3000_b1d6,FUN_3000_bdb5  // seed = value, high word 0

void __cdecl16far srand(ushort seed)

{
  DAT_6000_90aa = 0;
  DAT_6000_90a8 = seed;
  return;
}


// ==== rand @ 1000:16a7 (size 38) callers: FUN_2000_248e,random_n,FUN_2000_3085,main,pick_monster,generate_section,random_walk,random_run,roll_dice,strike,monster_turn,FUN_2000_7fb1,FUN_2000_81cd,FUN_2000_9ed9,FUN_2000_a64b,FUN_2000_a6fa,movecontrol,roll_char,FUN_3000_5d06,FUN_3000_9383,seeded_pick,FUN_3000_b1d6,FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_bdb5,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a,FUN_3000_d0b9,FUN_3000_d37f,FUN_3000_d43b,FUN_3000_d51c,FUN_3000_e5f5,FUN_3000_e8ee  // seed = seed*0x015A4E35 + 1; return (seed>>16) & 0x7fff

short __cdecl16far rand(void)

{
  long lVar1;
  
  lVar1 = lmul32();
  DAT_6000_90aa = (uint)((ulong)(lVar1 + 1) >> 0x10);
  DAT_6000_90a8 = (int)(lVar1 + 1);
  return DAT_6000_90aa & 0x7fff;
}


// ==== FUN_1000_16cd @ 1000:16cd (size 45) callers: FUN_1000_37cb,FUN_1000_422b

void __cdecl16far FUN_1000_16cd(int param_1)

{
  code *pcVar1;
  bool bVar2;
  undefined2 uVar3;
  
  bVar2 = false;
  if ((*(uint *)(param_1 * 2 + -0x6fee) & 2) == 0) {
    pcVar1 = (code *)swi(0x21);
    uVar3 = (*pcVar1)();
    if (!bVar2) {
      return;
    }
  }
  else {
    uVar3 = 5;
  }
  FUN_1000_14bd(uVar3);
  return;
}


// ==== unlink @ 1000:16fa (size 22) callers: FUN_2000_70ef,FUN_2000_726f  // libc (INT 21h AH=41h)

undefined2 __cdecl16far unlink(void)

{
  code *pcVar1;
  undefined2 uVar2;
  undefined1 in_CF;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  if ((bool)in_CF) {
    uVar2 = FUN_1000_14bd();
  }
  else {
    uVar2 = 0;
  }
  return uVar2;
}


// ==== FUN_1000_1710 @ 1000:1710 (size 24) callers: FUN_1000_2a03

void __cdecl16far FUN_1000_1710(undefined2 *param_1)

{
  undefined2 unaff_ES;
  undefined2 unaff_SS;
  undefined2 in_stack_00000002;
  
  *param_1 = unaff_ES;
  param_1[1] = in_stack_00000002;
  param_1[2] = unaff_SS;
  param_1[3] = 0x6000;
  return;
}


// ==== FUN_1000_1728 @ 1000:1728 (size 19) callers: FUN_1000_17f3

void __cdecl16far FUN_1000_1728(void)

{
  code *pcVar1;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  return;
}


// ==== FUN_1000_173b @ 1000:173b (size 19) callers: FUN_1000_17f3

void __cdecl16far FUN_1000_173b(void)

{
  code *pcVar1;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  return;
}


// ==== FUN_1000_17f3 @ 1000:17f3 (size 56) callers: 

undefined2 __cdecl16far FUN_1000_17f3(undefined2 *param_1)

{
  undefined1 local_a [4];
  undefined1 local_6 [4];
  
  FUN_1000_4651(*param_1,param_1[1],local_6,local_a);
  FUN_1000_1728(local_6);
  FUN_1000_173b(local_a);
  return 0;
}


// ==== time @ 1000:182b (size 77) callers: main,generate_section,roll_char,FUN_3000_b1d6,FUN_3000_bdb5  // libc time(): DOS date and time -> seconds

long __cdecl16far time(void *t)

{
  undefined2 uVar1;
  undefined2 in_DX;
  undefined1 local_a [4];
  undefined1 local_6 [4];
  
  FUN_1000_12df(local_6);
  FUN_1000_12f2(local_a);
  uVar1 = FUN_1000_4538(local_6,local_a);
  if (t != (void *)0x0) {
    *(undefined2 *)((int)t + 2) = in_DX;
    *(undefined2 *)t = uVar1;
  }
  return CONCAT22(in_DX,uVar1);
}


// ==== FUN_1000_1878 @ 1000:1878 (size 44) callers: FUN_2000_919a,movecontrol,FUN_3000_8235

uint __cdecl16far FUN_1000_1878(uint param_1)

{
  if (param_1 == 0xffff) {
    param_1 = 0xffff;
  }
  else if ((*(byte *)((param_1 & 0xff) + 0x8dc3) & 4) == 0) {
    param_1 = param_1 & 0xff;
  }
  else {
    param_1 = (param_1 & 0xff) + 0x20;
  }
  return param_1;
}


// ==== toupper @ 1000:18a4 (size 44) callers: FUN_2000_ea27,roll_char,FUN_3000_bdb5,read_string,FUN_4000_4016,draw_text_box  // libc

short __cdecl16far toupper(short c)

{
  uint uVar1;
  
  if (c == -1) {
    uVar1 = 0xffff;
  }
  else if ((*(byte *)((c & 0xffU) + 0x8dc3) & 8) == 0) {
    uVar1 = c & 0xff;
  }
  else {
    uVar1 = (c & 0xffU) - 0x20;
  }
  return uVar1;
}


// ==== FUN_1000_18d0 @ 1000:18d0 (size 22) callers: fclose

undefined2 __cdecl16far FUN_1000_18d0(void)

{
  code *pcVar1;
  undefined2 uVar2;
  undefined1 in_CF;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  if ((bool)in_CF) {
    uVar2 = FUN_1000_14bd();
  }
  else {
    uVar2 = 0;
  }
  return uVar2;
}


// ==== FUN_1000_18e6 @ 1000:18e6 (size 7) callers: FUN_1000_195e

void FUN_1000_18e6(void)

{
  bool bVar1;
  byte bVar2;
  byte bVar3;
  byte bVar4;
  byte extraout_AH;
  char *unaff_DI;
  undefined2 unaff_ES;
  byte in_AF;
  
  FUN_1000_18ed();
  FUN_1000_18f6();
  bVar2 = extraout_AH + 0x90;
  in_AF = 9 < (bVar2 & 0xf) | in_AF;
  bVar1 = 0x99 < bVar2 || 0x6f < extraout_AH;
  bVar3 = bVar2 + in_AF * '\x06' + bVar1 * '`';
  bVar2 = bVar3 + 0x40;
  bVar4 = bVar2 + bVar1;
  *unaff_DI = bVar4 + (9 < (bVar4 & 0xf) | in_AF) * '\x06' +
              (0x99 < bVar4 || (0xbf < bVar3 || CARRY1(bVar2,bVar1))) * '`';
  return;
}


// ==== FUN_1000_18ed @ 1000:18ed (size 9) callers: FUN_1000_18e6

void FUN_1000_18ed(void)

{
  bool bVar1;
  byte bVar2;
  byte bVar3;
  byte bVar4;
  byte extraout_AH;
  char *unaff_DI;
  undefined2 unaff_ES;
  byte in_AF;
  
  FUN_1000_18f6();
  bVar2 = extraout_AH + 0x90;
  in_AF = 9 < (bVar2 & 0xf) | in_AF;
  bVar1 = 0x99 < bVar2 || 0x6f < extraout_AH;
  bVar3 = bVar2 + in_AF * '\x06' + bVar1 * '`';
  bVar2 = bVar3 + 0x40;
  bVar4 = bVar2 + bVar1;
  *unaff_DI = bVar4 + (9 < (bVar4 & 0xf) | in_AF) * '\x06' +
              (0x99 < bVar4 || (0xbf < bVar3 || CARRY1(bVar2,bVar1))) * '`';
  return;
}


// ==== FUN_1000_18f6 @ 1000:18f6 (size 8) callers: FUN_1000_18ed

void __cdecl16near FUN_1000_18f6(void)

{
  byte bVar1;
  byte in_AL;
  byte bVar3;
  byte bVar4;
  byte bVar5;
  char *unaff_DI;
  undefined2 unaff_ES;
  byte in_AF;
  bool bVar2;
  
  bVar3 = in_AL + 0x90;
  bVar1 = 9 < (bVar3 & 0xf) | in_AF;
  bVar2 = 0x99 < bVar3 || 0x6f < in_AL;
  bVar4 = bVar3 + bVar1 * '\x06' + bVar2 * '`';
  bVar3 = bVar4 + 0x40;
  bVar5 = bVar3 + bVar2;
  *unaff_DI = bVar5 + (9 < (bVar5 & 0xf) | bVar1) * '\x06' +
              (0x99 < bVar5 || (0xbf < bVar4 || CARRY1(bVar3,bVar2))) * '`';
  return;
}


// ==== FUN_1000_18fe @ 1000:18fe (size 26) callers: FUN_1000_2090,FUN_1000_37b5,FUN_1000_3f0b,FUN_1000_43f9,FUN_1000_4416

void FUN_1000_18fe(void)

{
  undefined2 unaff_SI;
  
  FUN_1000_195e(unaff_SI);
  return;
}


// ==== FUN_1000_1918 @ 1000:1918 (size 13) callers: FUN_1000_195e

void __cdecl16near FUN_1000_1918(void)

{
  char *pcVar1;
  int iVar2;
  char *unaff_DI;
  undefined2 unaff_ES;
  
  iVar2 = -1;
  do {
    if (iVar2 == 0) {
      return;
    }
    iVar2 = iVar2 + -1;
    pcVar1 = unaff_DI;
    unaff_DI = unaff_DI + 1;
  } while (*pcVar1 != '\0');
  return;
}


// ==== FUN_1000_1925 @ 1000:1925 (size 9) callers: FUN_1000_195e

void __cdecl16near FUN_1000_1925(void)

{
  char *pcVar1;
  undefined1 in_AL;
  int iVar2;
  int unaff_BP;
  undefined1 *unaff_DI;
  undefined2 unaff_SS;
  
  *unaff_DI = in_AL;
  pcVar1 = (char *)(unaff_BP + -0x14);
  *pcVar1 = *pcVar1 + -1;
  if (*pcVar1 == '\0') {
    iVar2 = (*(code *)*(undefined2 *)(unaff_BP + 10))
                      (*(undefined2 *)(unaff_BP + 8),unaff_DI + (1 - (unaff_BP + -0x96)),
                       unaff_BP + -0x96);
    if (iVar2 == 0) {
      *(undefined2 *)(unaff_BP + -0x16) = 1;
    }
    *(undefined2 *)(unaff_BP + -0x14) = 0x50;
    *(int *)(unaff_BP + -0x12) =
         (int)(unaff_DI + (1 - (unaff_BP + -0x96)) + *(int *)(unaff_BP + -0x12));
  }
  return;
}


// ==== FUN_1000_192e @ 1000:192e (size 48) callers: FUN_1000_195e

void __cdecl16near FUN_1000_192e(void)

{
  int iVar1;
  int unaff_BP;
  int unaff_DI;
  int iVar2;
  undefined2 unaff_SS;
  
  iVar2 = unaff_DI - (unaff_BP + -0x96);
  iVar1 = (*(code *)*(undefined2 *)(unaff_BP + 10))
                    (*(undefined2 *)(unaff_BP + 8),iVar2,unaff_BP + -0x96);
  if (iVar1 == 0) {
    *(undefined2 *)(unaff_BP + -0x16) = 1;
  }
  *(undefined2 *)(unaff_BP + -0x14) = 0x50;
  *(int *)(unaff_BP + -0x12) = *(int *)(unaff_BP + -0x12) + iVar2;
  return;
}


// ==== FUN_1000_195e @ 1000:195e (size 1059) callers: FUN_1000_18fe

/* WARNING (jumptable): Unable to track spacebase fully for stack */

undefined2 FUN_1000_195e(void)

{
  char *pcVar1;
  uint *puVar2;
  undefined1 *puVar3;
  char cVar4;
  undefined2 *puVar5;
  uint uVar6;
  int *piVar7;
  char cVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  uint uVar11;
  byte bVar14;
  int iVar12;
  int iVar13;
  int extraout_DX;
  int extraout_DX_00;
  int extraout_DX_01;
  char cVar15;
  int iVar16;
  int unaff_BP;
  char *pcVar17;
  char *pcVar18;
  char *pcVar19;
  int *piVar20;
  undefined1 *puVar21;
  uint *puVar22;
  int *piVar23;
  int iVar24;
  int unaff_SS;
  bool bVar25;
  
  *(int *)(unaff_BP + -4) = unaff_BP + -0x96;
LAB_1000_1967:
  pcVar19 = (char *)*(undefined2 *)(unaff_BP + -4);
LAB_1000_196a:
  pcVar17 = (char *)*(undefined2 *)(unaff_BP + 6);
LAB_1000_196d:
  pcVar18 = pcVar17 + 1;
  cVar8 = *pcVar17;
  if (cVar8 == '\0') goto LAB_1000_1d61;
  if (cVar8 == '%') {
    *(int *)(unaff_BP + -0x10) = (int)pcVar18;
    pcVar1 = pcVar18;
    pcVar18 = pcVar17 + 2;
    cVar8 = *pcVar1;
    if (cVar8 != '%') goto code_r0x0001198f;
  }
  *pcVar19 = cVar8;
  pcVar19 = pcVar19 + 1;
  pcVar1 = (char *)(unaff_BP + -0x14);
  cVar8 = *pcVar1;
  *pcVar1 = *pcVar1 + -1;
  pcVar17 = pcVar18;
  if (*pcVar1 == '\0' || SBORROW1(cVar8,'\x01') != *pcVar1 < '\0') {
    FUN_1000_192e();
  }
  goto LAB_1000_196d;
code_r0x0001198f:
  *(undefined2 *)(unaff_BP + -4) = pcVar19;
  uVar11 = 0;
  *(undefined2 *)(unaff_BP + -0xe) = 0;
  *(undefined2 *)(unaff_BP + -2) = 0;
  *(undefined1 *)(unaff_BP + -0xb) = 0;
  *(undefined2 *)(unaff_BP + -8) = 0xffff;
  *(undefined2 *)(unaff_BP + -10) = 0xffff;
  do {
    if (0x5f < (byte)(cVar8 - 0x20U)) goto LAB_1000_1d51;
    cVar4 = *(char *)((byte)(cVar8 - 0x20U) + 0x90b5);
    cVar15 = cVar4 * '\x02';
    bVar14 = (byte)(uVar11 >> 8);
    iVar24 = unaff_SS;
    switch(cVar4) {
    case '\0':
      if (bVar14 != 0) goto LAB_1000_1d51;
      if (*(char *)(unaff_BP + -0xb) != '+') {
        *(char *)(unaff_BP + -0xb) = cVar8;
      }
      break;
    case '\x01':
      if (bVar14 != 0) goto LAB_1000_1d51;
      *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) | 1;
      break;
    case '\x02':
      iVar24 = *(int *)*(undefined2 *)(unaff_BP + 4);
      *(int *)(unaff_BP + 4) = *(int *)(unaff_BP + 4) + 2;
      if (bVar14 < 2) {
        if (iVar24 < 0) {
          iVar24 = -iVar24;
          *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) | 2;
        }
        *(int *)(unaff_BP + -8) = iVar24;
        uVar11 = 0x300;
      }
      else {
        if (bVar14 != 4) goto LAB_1000_1d51;
        *(int *)(unaff_BP + -10) = iVar24;
        uVar11 = 0x500;
      }
      break;
    case '\x03':
      if (bVar14 != 0) goto LAB_1000_1d51;
      *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) | 2;
      break;
    case '\x04':
      if (3 < bVar14) goto LAB_1000_1d51;
      uVar11 = 0x400;
      *(int *)(unaff_BP + -10) = *(int *)(unaff_BP + -10) + 1;
      break;
    case '\x05':
LAB_1000_1a54:
      if (bVar14 < 3) {
        uVar11 = 0x200;
        LOCK();
        iVar24 = *(int *)(unaff_BP + -8);
        *(int *)(unaff_BP + -8) = (int)(char)(cVar8 + -0x30);
        UNLOCK();
        if (-1 < iVar24) {
          *(int *)(unaff_BP + -8) = *(int *)(unaff_BP + -8) + iVar24 * 10;
        }
      }
      else {
        if (bVar14 != 4) {
LAB_1000_1d51:
          pcVar19 = (char *)*(undefined2 *)(unaff_BP + -0x10);
          do {
            FUN_1000_1925();
            pcVar1 = pcVar19;
            pcVar19 = pcVar19 + 1;
          } while (*pcVar1 != '\0');
LAB_1000_1d61:
          if (*(char *)(unaff_BP + -0x14) < 'P') {
            FUN_1000_192e();
          }
          if (*(int *)(unaff_BP + -0x16) == 0) {
            uVar10 = *(undefined2 *)(unaff_BP + -0x12);
          }
          else {
            uVar10 = 0xffff;
          }
          return uVar10;
        }
        LOCK();
        iVar24 = *(int *)(unaff_BP + -10);
        *(int *)(unaff_BP + -10) = (int)(char)(cVar8 + -0x30);
        UNLOCK();
        if (iVar24 != 0) {
          *(int *)(unaff_BP + -10) = *(int *)(unaff_BP + -10) + iVar24 * 10;
        }
      }
      break;
    case '\x06':
      *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) | 0x10;
      goto LAB_1000_19fe;
    case '\a':
      *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) | 0x100;
    case '\b':
      *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) & 0xffef;
      goto LAB_1000_19fe;
    case '\t':
      if (bVar14 != 0) goto LAB_1000_1a54;
      if ((*(uint *)(unaff_BP + -2) & 2) == 0) {
        *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) | 8;
        uVar11 = 0x100;
      }
      break;
    case '\n':
      goto LAB_1000_1ac7;
    case '\v':
      uVar10 = CONCAT11(8,cVar15);
      goto LAB_1000_1ab3;
    case '\f':
      uVar10 = CONCAT11(10,cVar15);
      goto LAB_1000_1ab7;
    case '\r':
      uVar10 = CONCAT11(0x10,cVar8 + -0x17);
LAB_1000_1ab3:
      *(undefined1 *)(unaff_BP + -0xb) = 0;
LAB_1000_1ab7:
      *(char *)(unaff_BP + -5) = cVar8;
      iVar12 = 0;
      *(undefined1 *)(unaff_BP + -6) = 0;
      piVar23 = (int *)*(undefined2 *)(unaff_BP + 4);
      iVar16 = *piVar23;
      goto LAB_1000_1ad7;
    case '\x0e':
      *(char *)(unaff_BP + -5) = cVar8;
      *(undefined2 *)(unaff_BP + 6) = pcVar18;
      puVar21 = (undefined1 *)(unaff_BP + -0x46);
      puVar5 = (undefined2 *)*(int *)(unaff_BP + 4);
      uVar10 = *puVar5;
      *(undefined2 *)(unaff_BP + 4) = puVar5 + 1;
      if ((*(uint *)(unaff_BP + -2) & 0x20) != 0) {
        *(undefined2 *)(unaff_BP + 4) = puVar5 + 2;
        FUN_1000_18e6(uVar10);
        puVar3 = puVar21;
        puVar21 = (undefined1 *)(unaff_BP + -0x45);
        *puVar3 = 0x3a;
      }
      FUN_1000_18e6();
      *puVar21 = 0;
      *(undefined1 *)(unaff_BP + -6) = 0;
      *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) & 0xfffb;
      puVar22 = (uint *)(unaff_BP + -0x46);
      uVar11 = (int)puVar21 - (int)puVar22;
      goto LAB_1000_1c15;
    case '\x0f':
      *(undefined2 *)(unaff_BP + 6) = pcVar18;
      *(char *)(unaff_BP + -5) = cVar8;
      uVar10 = *(undefined2 *)(unaff_BP + 4);
      uVar11 = *(uint *)(unaff_BP + -10);
      if ((int)uVar11 < 0) {
        uVar11 = 6;
      }
      uVar6 = *(uint *)(unaff_BP + -2);
      if ((*(uint *)(unaff_BP + -2) & 0x100) == 0) {
        *(int *)(unaff_BP + 4) = *(int *)(unaff_BP + 4) + 8;
        uVar9 = 6;
      }
      else {
        uVar9 = 8;
        *(int *)(unaff_BP + 4) = *(int *)(unaff_BP + 4) + 10;
      }
      thunk_FUN_1000_05db(uVar9,uVar6 & 1,cVar8,unaff_BP + -0x45,uVar11,uVar10);
      puVar22 = (uint *)(unaff_BP + -0x45);
      goto LAB_1000_1c15;
    case '\x10':
      *(undefined2 *)(unaff_BP + 6) = pcVar18;
      *(char *)(unaff_BP + -5) = cVar8;
      uVar11 = *(uint *)*(undefined2 *)(unaff_BP + 4);
      *(int *)(unaff_BP + 4) = *(int *)(unaff_BP + 4) + 2;
      puVar22 = (uint *)(unaff_BP + -0x45);
      *puVar22 = uVar11 & 0xff;
      uVar11 = 1;
      goto LAB_1000_1c58;
    case '\x11':
      *(undefined2 *)(unaff_BP + 6) = pcVar18;
      *(char *)(unaff_BP + -5) = cVar8;
      if ((*(uint *)(unaff_BP + -2) & 0x20) == 0) {
        puVar22 = *(uint **)(undefined4 *)*(undefined2 *)(unaff_BP + 4);
        *(int *)(unaff_BP + 4) = *(int *)(unaff_BP + 4) + 2;
        iVar24 = 0x6000;
        bVar25 = puVar22 == (uint *)0x0;
      }
      else {
        puVar2 = (uint *)*(undefined4 *)*(undefined2 *)(unaff_BP + 4);
        iVar24 = (int)((ulong)puVar2 >> 0x10);
        puVar22 = (uint *)puVar2;
        *(int *)(unaff_BP + 4) = *(int *)(unaff_BP + 4) + 4;
        bVar25 = iVar24 == 0 && puVar22 == (uint *)0x0;
      }
      if (bVar25) {
        iVar24 = 0x6000;
        puVar22 = (uint *)&DAT_6000_90ae;
      }
      FUN_1000_1918();
      if (*(uint *)(unaff_BP + -10) < uVar11) {
        uVar11 = *(uint *)(unaff_BP + -10);
      }
      goto LAB_1000_1c58;
    case '\x12':
      *(undefined2 *)(unaff_BP + 6) = pcVar18;
      if ((*(uint *)(unaff_BP + -2) & 0x20) == 0) {
        piVar23 = *(int **)(undefined4 *)*(undefined2 *)(unaff_BP + 4);
        *(int *)(unaff_BP + 4) = *(int *)(unaff_BP + 4) + 2;
        uVar10 = 0x6000;
      }
      else {
        piVar7 = (int *)*(undefined4 *)*(undefined2 *)(unaff_BP + 4);
        uVar10 = (undefined2)((ulong)piVar7 >> 0x10);
        piVar23 = (int *)piVar7;
        *(int *)(unaff_BP + 4) = *(int *)(unaff_BP + 4) + 4;
      }
      *piVar23 = (uint)(byte)(0x50 - *(char *)(unaff_BP + -0x14)) + *(int *)(unaff_BP + -0x12);
      if ((*(uint *)(unaff_BP + -2) & 0x10) != 0) {
        piVar23[1] = 0;
      }
      goto LAB_1000_1967;
    default:
      goto LAB_1000_1d51;
    case '\x16':
      *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) & 0xffdf;
      goto LAB_1000_19fe;
    case '\x17':
      *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) | 0x20;
LAB_1000_19fe:
      uVar11 = 0x500;
    }
    pcVar1 = pcVar18;
    pcVar18 = pcVar18 + 1;
    cVar8 = *pcVar1;
  } while( true );
LAB_1000_1ac7:
  uVar10 = CONCAT11(10,cVar15);
  *(undefined1 *)(unaff_BP + -6) = 1;
  *(char *)(unaff_BP + -5) = cVar8;
  piVar23 = (int *)*(undefined2 *)(unaff_BP + 4);
  iVar16 = *piVar23;
  iVar12 = iVar16 >> 0xf;
LAB_1000_1ad7:
  piVar20 = piVar23 + 1;
  *(undefined2 *)(unaff_BP + 6) = pcVar18;
  if ((*(uint *)(unaff_BP + -2) & 0x10) != 0) {
    iVar12 = *piVar20;
    piVar20 = piVar23 + 2;
  }
  *(undefined2 *)(unaff_BP + 4) = piVar20;
  puVar22 = (uint *)(unaff_BP + -0x45);
  if ((iVar16 == 0) && (iVar12 == 0)) {
    if (*(int *)(unaff_BP + -10) != 0) goto LAB_1000_1b08;
    *(char *)puVar22 = '\0';
  }
  else {
    *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) | 4;
LAB_1000_1b08:
    FUN_1000_1519(uVar10,*(undefined1 *)(unaff_BP + -6),(char)((uint)uVar10 >> 8),puVar22,iVar16,
                  iVar12);
  }
  if (*(int *)(unaff_BP + -10) < 0) {
LAB_1000_1c15:
    if (((*(uint *)(unaff_BP + -2) & 8) != 0) && (0 < *(int *)(unaff_BP + -8))) goto LAB_1000_1c23;
  }
  else {
LAB_1000_1c23:
    FUN_1000_1918();
    if ((char)*puVar22 == '-') {
      uVar11 = uVar11 - 1;
    }
    if (extraout_DX - uVar11 != 0 && (int)uVar11 <= extraout_DX) {
      *(int *)(unaff_BP + -0xe) = extraout_DX - uVar11;
    }
  }
  if ((char)*puVar22 != '-') {
    if (*(char *)(unaff_BP + -0xb) == '\0') goto LAB_1000_1c55;
    puVar22 = (uint *)((int)puVar22 + -1);
    *(char *)puVar22 = *(char *)(unaff_BP + -0xb);
  }
  if ((0 < *(int *)(unaff_BP + -0xe)) && (uVar11 = *(uint *)(unaff_BP + -10), (int)uVar11 < 0)) {
    *(int *)(unaff_BP + -0xe) = *(int *)(unaff_BP + -0xe) + -1;
  }
LAB_1000_1c55:
  FUN_1000_1918();
LAB_1000_1c58:
  pcVar19 = (char *)*(undefined2 *)(unaff_BP + -4);
  iVar16 = *(int *)(unaff_BP + -8);
  if ((*(uint *)(unaff_BP + -2) & 5) == 5) {
    cVar8 = *(char *)(unaff_BP + -5);
    if (cVar8 == 'o') {
      if (*(int *)(unaff_BP + -0xe) < 1) {
        *(undefined2 *)(unaff_BP + -0xe) = 1;
      }
    }
    else if ((cVar8 == 'x') || (cVar8 == 'X')) {
      *(uint *)(unaff_BP + -2) = *(uint *)(unaff_BP + -2) | 0x40;
      iVar16 = iVar16 + -2;
      piVar7 = (int *)(unaff_BP + -0xe);
      iVar12 = *piVar7;
      *piVar7 = *piVar7 + -2;
      if (SBORROW2(iVar12,2) != *piVar7 < 0) {
        *(undefined2 *)(unaff_BP + -0xe) = 0;
      }
    }
  }
  iVar12 = uVar11 + *(int *)(unaff_BP + -0xe);
  if ((*(uint *)(unaff_BP + -2) & 2) == 0) {
    for (; iVar12 < iVar16; iVar16 = iVar16 + -1) {
      FUN_1000_1925();
    }
  }
  if ((*(uint *)(unaff_BP + -2) & 0x40) != 0) {
    FUN_1000_1925();
    FUN_1000_1925();
  }
  iVar13 = *(int *)(unaff_BP + -0xe);
  if (0 < iVar13) {
    iVar12 = iVar12 - iVar13;
    iVar16 = iVar16 - iVar13;
    cVar8 = (char)*puVar22;
    if (((cVar8 == '-') || (cVar8 == ' ')) || (cVar8 == '+')) {
      puVar22 = (uint *)((int)puVar22 + 1);
      FUN_1000_1925();
      iVar12 = iVar12 + -1;
      iVar16 = iVar16 + -1;
      iVar13 = extraout_DX_00;
    }
    for (; iVar13 != 0; iVar13 = iVar13 + -1) {
      FUN_1000_1925();
      iVar12 = extraout_DX_01;
    }
  }
  if (iVar12 != 0) {
    iVar16 = iVar16 - iVar12;
    do {
      puVar2 = puVar22;
      puVar22 = (uint *)((int)puVar22 + 1);
      *pcVar19 = (char)*puVar2;
      pcVar19 = pcVar19 + 1;
      pcVar1 = (char *)(unaff_BP + -0x14);
      cVar8 = *pcVar1;
      *pcVar1 = *pcVar1 + -1;
      if (*pcVar1 == '\0' || SBORROW1(cVar8,'\x01') != *pcVar1 < '\0') {
        FUN_1000_192e();
      }
      iVar12 = iVar12 + -1;
    } while (iVar12 != 0);
  }
  if (0 < iVar16) {
    do {
      FUN_1000_1925();
      iVar16 = iVar16 + -1;
    } while (iVar16 != 0);
  }
  goto LAB_1000_196a;
}


// ==== FUN_1000_1db1 @ 1000:1db1 (size 37) callers: FUN_1000_1f5d,FUN_1000_295b,FUN_1000_29af,FUN_1000_2b00

undefined4 FUN_1000_1db1(int param_1,int param_2)

{
  return CONCAT22(DAT_6000_9125,
                  (DAT_6000_9123 + (uint)DAT_6000_9120 * (param_1 + -1) + param_2 + -1) * 2);
}


// ==== FUN_1000_1dd6 @ 1000:1dd6 (size 122) callers: FUN_1000_1f5d,FUN_1000_2f5b

uint FUN_1000_1dd6(int param_1,uint *param_2,uint *param_3)

{
  uint *puVar1;
  uint *puVar2;
  byte bVar3;
  uint uVar4;
  int iVar5;
  uint uVar6;
  uint *puVar7;
  uint *puVar8;
  uint uVar9;
  uint uVar10;
  bool bVar11;
  
  uVar4 = (uint)DAT_6000_9122;
  uVar6 = uVar4;
  if (param_1 != 0) {
    uVar9 = (uint)((ulong)param_3 >> 0x10);
    puVar8 = (uint *)param_3;
    uVar10 = (uint)((ulong)param_2 >> 0x10);
    puVar7 = (uint *)param_2;
    bVar11 = puVar7 < puVar8;
    if (bVar11) {
      iVar5 = param_1 + -1;
      uVar6 = iVar5 * 2;
      puVar7 = puVar7 + iVar5;
      puVar8 = puVar8 + iVar5;
    }
    if (uVar4 == 0) {
      for (; param_1 != 0; param_1 = param_1 + -1) {
        puVar2 = puVar8;
        puVar8 = puVar8 + (uint)bVar11 * -2 + 1;
        puVar1 = puVar7;
        puVar7 = puVar7 + (uint)bVar11 * -2 + 1;
        *puVar2 = *puVar1;
      }
    }
    else {
      uVar6 = uVar9;
      if (uVar9 == uVar10) {
        do {
          do {
            bVar3 = in(0x3da);
          } while ((bool)(bVar3 & 1));
          do {
            bVar3 = in(0x3da);
          } while (!(bool)(bVar3 & 1));
          puVar1 = puVar7;
          puVar7 = puVar7 + (uint)bVar11 * -2 + 1;
          uVar6 = *puVar1;
          do {
            bVar3 = in(0x3da);
          } while ((bool)(bVar3 & 1));
          do {
            bVar3 = in(0x3da);
          } while (!(bool)(bVar3 & 1));
          puVar1 = puVar8;
          puVar8 = puVar8 + (uint)bVar11 * -2 + 1;
          *puVar1 = uVar6;
          param_1 = param_1 + -1;
        } while (param_1 != 0);
      }
      else {
        do {
          do {
            bVar3 = in(0x3da);
            uVar6 = uVar6 & 0xff00;
          } while ((bool)(bVar3 & 1));
          do {
            bVar3 = in(0x3da);
            uVar6 = CONCAT11((char)(uVar6 >> 8),bVar3 >> 1 | bVar3 << 7);
          } while (!(bool)(bVar3 & 1));
          puVar2 = puVar8;
          puVar8 = puVar8 + (uint)bVar11 * -2 + 1;
          puVar1 = puVar7;
          puVar7 = puVar7 + (uint)bVar11 * -2 + 1;
          *puVar2 = *puVar1;
          param_1 = param_1 + -1;
        } while (param_1 != 0);
      }
    }
  }
  return uVar6;
}


// ==== FUN_1000_1e50 @ 1000:1e50 (size 41) callers: FUN_1000_15dc

int __cdecl16far FUN_1000_1e50(int param_1,char *param_2)

{
  short sVar1;
  
  sVar1 = strlen(param_2);
  FUN_1000_3cdb(param_1,param_2,sVar1 + 1);
  return param_1 + sVar1;
}


// ==== FUN_1000_1e79 @ 1000:1e79 (size 34) callers: FUN_1000_1ecc,FUN_1000_2bba

undefined2 __cdecl16near FUN_1000_1e79(undefined1 *param_1)

{
  undefined2 uVar1;
  undefined1 auStack_202 [512];
  
  if (param_1 < auStack_202) {
    DAT_6000_009c = param_1;
    uVar1 = 0;
  }
  else {
    DAT_6000_0094 = 8;
    uVar1 = 0xffff;
  }
  return uVar1;
}


// ==== FUN_1000_1e9b @ 1000:1e9b (size 49) callers: FUN_1000_1ed8,FUN_1000_2ccc,FUN_1000_2d0c

uint __cdecl16near FUN_1000_1e9b(uint param_1,int param_2)

{
  uint uVar1;
  uint uVar2;
  
  uVar1 = param_1 + DAT_6000_009c;
  if (((param_2 + (uint)CARRY2(param_1,DAT_6000_009c) == 0) && (uVar1 < 0xfe00)) &&
     ((undefined1 *)(uVar1 + 0x200) < &stack0xfffe)) {
    LOCK();
    UNLOCK();
    uVar2 = DAT_6000_009c;
    DAT_6000_009c = uVar1;
  }
  else {
    DAT_6000_0094 = 8;
    uVar2 = 0xffff;
  }
  return uVar2;
}


// ==== FUN_1000_1ecc @ 1000:1ecc (size 12) callers: 

void __cdecl16far FUN_1000_1ecc(undefined2 param_1)

{
  FUN_1000_1e79(param_1);
  return;
}


// ==== FUN_1000_1ed8 @ 1000:1ed8 (size 16) callers: 

void __cdecl16far FUN_1000_1ed8(int param_1)

{
  FUN_1000_1e9b(param_1,param_1 >> 0xf);
  return;
}


// ==== FUN_1000_1ee8 @ 1000:1ee8 (size 41) callers: load_world_pic,main

void __cdecl16far FUN_1000_1ee8(void)

{
  undefined2 in_AX;
  byte bVar1;
  
  bVar1 = (byte)((uint)in_AX >> 8);
  FUN_1000_300e((uint)bVar1 << 8,CONCAT11(bVar1,DAT_6000_911b),CONCAT11(bVar1,DAT_6000_911a),
                CONCAT11(bVar1,DAT_6000_9119),CONCAT11(bVar1,DAT_6000_9118),CONCAT11(bVar1,6));
  FUN_1000_20de();
  return;
}


// ==== FUN_1000_1f11 @ 1000:1f11 (size 21) callers: load_world_pic,check_v_file

void __cdecl16far FUN_1000_1f11(byte param_1)

{
  DAT_6000_911c = DAT_6000_911c & 0x70 | param_1 & 0x8f;
  return;
}


// ==== FUN_1000_1f26 @ 1000:1f26 (size 25) callers: 

void __cdecl16far FUN_1000_1f26(byte param_1)

{
  DAT_6000_911c = DAT_6000_911c & 0x8f | (param_1 & 7) << 4;
  return;
}


// ==== FUN_1000_1f3f @ 1000:1f3f (size 11) callers: 

void __cdecl16far FUN_1000_1f3f(undefined1 param_1)

{
  DAT_6000_911c = param_1;
  return;
}


// ==== FUN_1000_1f5d @ 1000:1f5d (size 293) callers: FUN_1000_2e18

undefined1 FUN_1000_1f5d(undefined2 param_1,int param_2,undefined1 *param_3)

{
  byte bVar1;
  undefined1 *puVar2;
  int iVar3;
  undefined2 unaff_SS;
  undefined4 uVar4;
  undefined2 local_a;
  undefined1 local_7;
  uint local_6;
  uint local_4;
  
  local_7 = 0;
  bVar1 = FUN_1000_3358();
  local_4 = (uint)bVar1;
  local_6 = FUN_1000_3358();
  local_6 = local_6 >> 8;
  while (iVar3 = param_2 + -1, param_2 != 0) {
    puVar2 = param_3 + 1;
    local_7 = *param_3;
    switch(local_7) {
    case 7:
      FUN_1000_20de();
      break;
    case 8:
      if ((int)(uint)DAT_6000_9118 < (int)local_4) {
        local_4 = local_4 - 1;
      }
      break;
    default:
      if ((DAT_6000_9121 == '\0') && (DAT_6000_9127 != 0)) {
        local_a = CONCAT11(DAT_6000_911c,local_7);
        uVar4 = FUN_1000_1db1(local_6 + 1,local_4 + 1);
        FUN_1000_1dd6(1,&local_a,unaff_SS,uVar4);
      }
      else {
        FUN_1000_20de();
        FUN_1000_20de();
      }
      local_4 = local_4 + 1;
      break;
    case 10:
      local_6 = local_6 + 1;
      break;
    case 0xd:
      local_4 = (uint)DAT_6000_9118;
    }
    if ((int)(uint)DAT_6000_911a < (int)local_4) {
      local_4 = (uint)DAT_6000_9118;
      local_6 = local_6 + DAT_6000_9116;
    }
    param_3 = puVar2;
    param_2 = iVar3;
    if ((int)(uint)DAT_6000_911b < (int)local_6) {
      FUN_1000_300e(1,DAT_6000_911b,DAT_6000_911a,DAT_6000_9119,DAT_6000_9118,6);
      local_6 = local_6 - 1;
    }
  }
  FUN_1000_20de();
  return local_7;
}


// ==== FUN_1000_2090 @ 1000:2090 (size 22) callers: check_v_file

void __cdecl16far FUN_1000_2090(undefined2 param_1)

{
  FUN_1000_18fe(&stack0x0006,param_1,0,(char *)s_3__CHAIN_________300_JP_6000_1f54 + 9);
  return;
}


// ==== FUN_1000_20a6 @ 1000:20a6 (size 42) callers: FUN_1000_2186

undefined2 FUN_1000_20a6(char *param_1,char *param_2)

{
  char *pcVar1;
  char *pcVar2;
  
  do {
    pcVar2 = param_2;
    if (*param_1 == '\0') {
      return 1;
    }
    param_2 = (char *)CONCAT22(param_2._2_2_,(char *)param_2 + 1);
    pcVar1 = param_1;
    param_1 = param_1 + 1;
  } while (*pcVar2 == *pcVar1);
  return 0;
}


// ==== FUN_1000_20d0 @ 1000:20d0 (size 14) callers: FUN_1000_20de,FUN_1000_2186

char __cdecl16near FUN_1000_20d0(void)

{
  char cVar1;
  
  cVar1 = '\x10';
  FUN_1000_20de();
  return cVar1 + -0x10;
}


// ==== FUN_1000_20de @ 1000:20de (size 139) callers: FUN_1000_1ee8,FUN_1000_1f5d,FUN_1000_20d0,FUN_1000_2186,FUN_1000_2912,FUN_1000_2e67,FUN_1000_2e95,FUN_1000_300e,FUN_1000_3358

char __cdecl16near FUN_1000_20de(void)

{
  code *pcVar1;
  char cVar2;
  char cVar3;
  undefined2 in_AX;
  
  cVar2 = (char)((uint)in_AX >> 8);
  if (cVar2 == '\0') {
    cVar2 = (char)in_AX;
    if ((cVar2 == '\x02') || (cVar2 == '\x03')) {
      pcVar1 = (code *)swi(0x10);
      cVar2 = (*pcVar1)(0x6000);
      if (cVar2 != '\x1a') {
        DAT_0000_0487 = DAT_0000_0487 & 0xfe;
      }
      pcVar1 = (code *)swi(0x10);
      (*pcVar1)();
    }
    else if (cVar2 == '@') {
      cVar3 = '\x10';
      pcVar1 = (code *)swi(0x10);
      cVar2 = (*pcVar1)();
      if (cVar3 == '\x10') {
        return cVar2;
      }
      pcVar1 = (code *)swi(0x10);
      (*pcVar1)();
      pcVar1 = (code *)swi(0x10);
      (*pcVar1)();
      pcVar1 = (code *)swi(0x10);
      cVar2 = (*pcVar1)();
      if (cVar2 == '\x1a') {
        return '\x1a';
      }
      DAT_0000_0487 = DAT_0000_0487 | 1;
      pcVar1 = (code *)swi(0x10);
      cVar2 = (*pcVar1)();
      return cVar2;
    }
  }
  else if (cVar2 == '\x0f') {
    pcVar1 = (code *)swi(0x10);
    cVar2 = (*pcVar1)();
    if ((cVar2 != '\x02') && (cVar2 != '\x03')) {
      return cVar2;
    }
    cVar3 = FUN_1000_20d0();
    if (cVar3 == '\0') {
      return cVar2;
    }
    if (DAT_0000_0484 == '\x18') {
      return cVar2;
    }
    return '@';
  }
  pcVar1 = (code *)swi(0x10);
  cVar2 = (*pcVar1)();
  return cVar2;
}


// ==== FUN_1000_2186 @ 1000:2186 (size 193) callers: FUN_1000_3339

void __cdecl16near FUN_1000_2186(byte param_1)

{
  undefined2 uVar1;
  int iVar2;
  
  DAT_6000_911e = param_1;
  uVar1 = FUN_1000_20de();
  DAT_6000_9120 = (char)((uint)uVar1 >> 8);
  if ((byte)uVar1 != DAT_6000_911e) {
    FUN_1000_20de();
    uVar1 = FUN_1000_20de();
    DAT_6000_911e = (byte)uVar1;
    DAT_6000_9120 = (char)((uint)uVar1 >> 8);
  }
  if (((DAT_6000_911e < 4) || (0x3f < DAT_6000_911e)) || (DAT_6000_911e == 7)) {
    DAT_6000_9121 = 0;
  }
  else {
    DAT_6000_9121 = 1;
  }
  if (DAT_6000_911e == 0x40) {
    DAT_6000_911f = DAT_0000_0484 + '\x01';
  }
  else {
    DAT_6000_911f = '\x19';
  }
  if (DAT_6000_911e != 7) {
    iVar2 = FUN_1000_20a6(0x9129,0xffea,0xf000);
    if (iVar2 == 0) {
      iVar2 = FUN_1000_20d0();
      if (iVar2 == 0) {
        DAT_6000_9122 = 1;
        goto LAB_1000_2212;
      }
    }
  }
  DAT_6000_9122 = 0;
LAB_1000_2212:
  if (DAT_6000_911e == 7) {
    DAT_6000_9125 = 0xb000;
  }
  else {
    DAT_6000_9125 = 0xb800;
  }
  DAT_6000_9123 = 0;
  DAT_6000_9119 = 0;
  DAT_6000_9118 = 0;
  DAT_6000_911a = DAT_6000_9120 + -1;
  DAT_6000_911b = DAT_6000_911f + -1;
  return;
}


// ==== FUN_1000_2266 @ 1000:2266 (size 1) callers: FUN_1000_2267

void __cdecl16near FUN_1000_2266(void)

{
  return;
}


// ==== FUN_1000_2267 @ 1000:2267 (size 26) callers: FUN_1000_22a2

uint __cdecl16near FUN_1000_2267(void)

{
  undefined1 uVar1;
  undefined1 uVar2;
  byte in_CF;
  byte in_PF;
  byte in_AF;
  byte in_ZF;
  byte in_SF;
  byte in_TF;
  byte in_IF;
  byte in_OF;
  byte in_NT;
  
  out(0x43,0);
  FUN_1000_2266((uint)(in_NT & 1) * 0x4000 | (uint)(in_OF & 1) * 0x800 | (uint)(in_IF & 1) * 0x200 |
                (uint)(in_TF & 1) * 0x100 | (uint)(in_SF & 1) * 0x80 | (uint)(in_ZF & 1) * 0x40 |
                (uint)(in_AF & 1) * 0x10 | (uint)(in_PF & 1) * 4 | (uint)(in_CF & 1));
  uVar1 = in(0x40);
  FUN_1000_2266();
  uVar2 = in(0x40);
  return ~CONCAT11(uVar2,uVar1);
}


// ==== FUN_1000_22a2 @ 1000:22a2 (size 97) callers: FUN_2000_1d0b,FUN_2000_5bb6,strike,FUN_2000_6123,monster_turn,FUN_2000_722c,chute,dig_hole,movecontrol,FUN_3000_b1d6,FUN_3000_b89b,FUN_3000_b99e,FUN_3000_d4d9,FUN_3000_d51c

void __cdecl16far FUN_1000_22a2(void)

{
  uint uVar1;
  uint uVar2;
  uint uVar3;
  bool bVar4;
  long lVar5;
  uint local_4;
  
  uVar1 = FUN_1000_2267();
  lVar5 = lmul32();
  local_4 = (uint)(lVar5 + (ulong)uVar1 >> 0x10);
  uVar3 = uVar1;
  while( true ) {
    do {
      uVar2 = FUN_1000_2267();
      if ((local_4 == 0) && ((uint)(lVar5 + (ulong)uVar1) <= uVar2)) {
        return;
      }
      bVar4 = uVar3 <= uVar2;
      uVar3 = uVar2;
    } while (bVar4);
    if ((local_4 < 2) && (local_4 == 0)) break;
    local_4 = local_4 - 1;
  }
  return;
}


// ==== FUN_1000_230f @ 1000:230f (size 99) callers: FUN_1000_2443

void __cdecl16near FUN_1000_230f(void)

{
  int in_DX;
  undefined2 uVar1;
  int iVar2;
  
  if (in_DX == DAT_1000_2303) {
LAB_1000_234d:
    DAT_1000_2303 = 0;
    DAT_1000_2305 = 0;
    DAT_1000_2307 = 0;
  }
  else {
    iVar2 = *(int *)&DAT_6000_0002;
    DAT_1000_2305 = iVar2;
    if (*(int *)&DAT_6000_0002 == 0) {
      in_DX = DAT_1000_2303;
      if (iVar2 != DAT_1000_2303) {
        DAT_1000_2305 = *(int *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 4);
        uVar1 = 0;
        FUN_1000_23e3(0,iVar2);
        goto LAB_1000_236b;
      }
      goto LAB_1000_234d;
    }
  }
  uVar1 = 0;
  iVar2 = in_DX;
LAB_1000_236b:
  FUN_1000_279a(uVar1,iVar2);
  return;
}


// ==== FUN_1000_2372 @ 1000:2372 (size 113) callers: FUN_1000_2443

void __cdecl16near FUN_1000_2372(void)

{
  undefined2 uVar1;
  int in_DX;
  int iVar2;
  int iStack_2;
  
  iStack_2 = *(int *)&DAT_6000_0002;
  *(undefined2 *)&DAT_6000_0002 = 0;
  *(int *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 4) = iStack_2;
  if ((in_DX == DAT_1000_2303) || (*(int *)&DAT_6000_0002 != 0)) {
    FUN_1000_240c();
    iStack_2 = in_DX;
  }
  else {
    iVar2 = *(int *)0x0;
    *(int *)0x0 = *(int *)0x0 + iVar2;
    iVar2 = in_DX + iVar2;
    if (*(int *)&DAT_6000_0002 == 0) {
      *(int *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 4) = iStack_2;
    }
    else {
      *(int *)&DAT_6000_0002 = iStack_2;
    }
  }
  iVar2 = iStack_2 + *(int *)0x0;
  if (*(int *)&DAT_6000_0002 != 0) {
    return;
  }
  *(int *)0x0 = *(int *)0x0 + *(int *)0x0;
  *(int *)&DAT_6000_0002 = iStack_2;
  if (iVar2 != *(int *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 2)) {
    uVar1 = *(undefined2 *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 2);
    DAT_1000_2307 = *(undefined2 *)(char *)s_Borland_C_____Copyright_1991_Bor_6000_0004;
    *(undefined2 *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 2) = uVar1;
    *(undefined2 *)(char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 = DAT_1000_2307;
    return;
  }
  DAT_1000_2307 = 0;
  return;
}


// ==== FUN_1000_23e3 @ 1000:23e3 (size 41) callers: FUN_1000_230f,FUN_1000_254d

void __cdecl16near FUN_1000_23e3(void)

{
  undefined2 uVar1;
  
  uVar1 = s_Borland_C_____Copyright_1991_Bor_6000_0004._2_2_;
  DAT_1000_2307 = s_Borland_C_____Copyright_1991_Bor_6000_0004._0_2_;
  if (s_Borland_C_____Copyright_1991_Bor_6000_0004._2_2_ != 0x6000) {
    *(undefined2 *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 2) =
         s_Borland_C_____Copyright_1991_Bor_6000_0004._2_2_;
    *(undefined2 *)(char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 = DAT_1000_2307;
    return;
  }
  DAT_1000_2307 = 0;
  return;
}


// ==== FUN_1000_240c @ 1000:240c (size 55) callers: FUN_1000_2372

void __cdecl16near FUN_1000_240c(void)

{
  char *pcVar1;
  undefined2 uVar2;
  
  s_Borland_C_____Copyright_1991_Bor_6000_0004._0_2_ = DAT_1000_2307;
  if (DAT_1000_2307 != 0) {
    uVar2 = *(undefined2 *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 2);
    pcVar1 = (char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 2;
    pcVar1[0] = '\0';
    pcVar1[1] = '`';
    ((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004)[0] = '\0';
    ((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004)[1] = '`';
    s_Borland_C_____Copyright_1991_Bor_6000_0004[2] = (char)uVar2;
    s_Borland_C_____Copyright_1991_Bor_6000_0004[3] = SUB21(uVar2,1);
    return;
  }
  DAT_1000_2307 = 0x6000;
  s_Borland_C_____Copyright_1991_Bor_6000_0004[0] = '\0';
  s_Borland_C_____Copyright_1991_Bor_6000_0004[1] = '`';
  s_Borland_C_____Copyright_1991_Bor_6000_0004[2] = '\0';
  s_Borland_C_____Copyright_1991_Bor_6000_0004[3] = '`';
  return;
}


// ==== FUN_1000_2443 @ 1000:2443 (size 41) callers: FUN_1000_25ca,FUN_1000_2646,FUN_1000_26aa

void __cdecl16far FUN_1000_2443(undefined2 param_1,int param_2)

{
  DAT_1000_2309 = 0x6000;
  if (param_2 != 0) {
    if (param_2 == DAT_1000_2305) {
      FUN_1000_230f();
    }
    else {
      FUN_1000_2372();
    }
  }
  return;
}


// ==== FUN_1000_246c @ 1000:246c (size 100) callers: FUN_1000_254d

undefined2 __cdecl16near FUN_1000_246c(void)

{
  uint in_AX;
  uint uVar1;
  undefined2 uVar2;
  undefined4 uVar3;
  
  uVar1 = FUN_1000_27d9(0,0);
  if ((uVar1 & 0xf) != 0) {
    FUN_1000_27d9(0x10 - (uVar1 & 0xf),0);
  }
  uVar3 = FUN_1000_27d9(in_AX << 4,in_AX >> 0xc);
  uVar2 = (undefined2)((ulong)uVar3 >> 0x10);
  if ((int)uVar3 != -1) {
    DAT_1000_2303 = uVar2;
    DAT_1000_2305 = uVar2;
    *(uint *)0x0 = in_AX;
    *(undefined2 *)&DAT_6000_0002 = uVar2;
    return 4;
  }
  return 0;
}


// ==== FUN_1000_24d0 @ 1000:24d0 (size 90) callers: FUN_1000_254d

undefined2 __cdecl16near FUN_1000_24d0(void)

{
  undefined2 uVar1;
  uint in_AX;
  int iVar2;
  int iVar3;
  ulong uVar4;
  
  uVar4 = FUN_1000_27d9(in_AX << 4,in_AX >> 0xc);
  iVar3 = (int)(uVar4 >> 0x10);
  if ((uint)uVar4 == 0xffff) {
    return 0;
  }
  if ((uVar4 & 0xf) != 0) {
    iVar2 = FUN_1000_27d9(0x10 - ((uint)uVar4 & 0xf),0);
    if (iVar2 == -1) {
      return 0;
    }
    iVar3 = iVar3 + 1;
  }
  uVar1 = DAT_1000_2305;
  DAT_1000_2305 = iVar3;
  *(uint *)0x0 = in_AX;
  *(undefined2 *)&DAT_6000_0002 = uVar1;
  return 4;
}


// ==== FUN_1000_252a @ 1000:252a (size 35) callers: FUN_1000_254d

undefined2 __cdecl16near FUN_1000_252a(void)

{
  int in_AX;
  int in_DX;
  int iVar1;
  
  DAT_6000_0000 = DAT_6000_0000 - in_AX;
  iVar1 = in_DX + DAT_6000_0000;
  *(int *)0x0 = in_AX;
  *(int *)&DAT_6000_0002 = in_DX;
  *(int *)&DAT_6000_0002 = iVar1;
  return 4;
}


// ==== FUN_1000_254d @ 1000:254d (size 125) callers: FUN_1000_25ca,FUN_1000_26aa,load_world_pic,FUN_2000_2b73,load_font

uint __cdecl16far FUN_1000_254d(uint param_1,uint param_2)

{
  int *piVar1;
  uint uVar2;
  int iVar3;
  
  DAT_1000_2309 = 0x6000;
  if (param_1 != 0 || param_2 != 0) {
    uVar2 = param_2 + (0xffec < param_1);
    if ((CARRY2(param_2,(uint)(0xffec < param_1))) || ((uVar2 & 0xfff0) != 0)) {
      param_1 = 0;
    }
    else {
      uVar2 = CONCAT11((byte)(param_1 + 0x13 >> 0xc) | (char)uVar2 * '\x10',
                       (char)(param_1 + 0x13 >> 4));
      if (DAT_1000_2303 == 0) {
        param_1 = FUN_1000_246c();
      }
      else {
        iVar3 = DAT_1000_2307;
        if (DAT_1000_2307 != 0) {
          do {
            if (uVar2 <= *(uint *)0x0) {
              if (*(uint *)0x0 <= uVar2) {
                FUN_1000_23e3();
                *(undefined2 *)&DAT_6000_0002 =
                     *(undefined2 *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 4);
                return 4;
              }
              uVar2 = FUN_1000_252a();
              return uVar2;
            }
            piVar1 = (int *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 2);
            iVar3 = *piVar1;
          } while (*piVar1 != DAT_1000_2307);
        }
        param_1 = FUN_1000_24d0();
      }
    }
  }
  return param_1;
}


// ==== FUN_1000_25ca @ 1000:25ca (size 124) callers: FUN_1000_26aa

ulong __cdecl16near FUN_1000_25ca(void)

{
  char *pcVar1;
  undefined2 *puVar2;
  char *pcVar3;
  undefined2 *puVar4;
  uint uVar5;
  int iVar6;
  int iVar7;
  uint uVar8;
  int iVar9;
  int in_DX;
  int in_BX;
  int iVar10;
  char *pcVar11;
  undefined2 *puVar12;
  char *pcVar13;
  undefined2 *puVar14;
  bool bVar15;
  
  iVar10 = in_BX;
  uVar5 = FUN_1000_254d(DAT_1000_230d,DAT_1000_230b);
  if (in_DX == 0) {
    return (ulong)uVar5;
  }
  uVar5 = *(int *)0x0 - 1;
  pcVar13 = (char *)s_Borland_C_____Copyright_1991_Bor_6000_0004;
  pcVar11 = (char *)s_Borland_C_____Copyright_1991_Bor_6000_0004;
  for (iVar7 = 6; iVar7 != 0; iVar7 = iVar7 + -1) {
    pcVar3 = pcVar13;
    pcVar13 = pcVar13 + 2;
    pcVar1 = pcVar11;
    pcVar11 = pcVar11 + 2;
    *(undefined2 *)pcVar3 = *(undefined2 *)pcVar1;
  }
  if (uVar5 != 0) {
    iVar7 = in_DX + 1;
    iVar6 = in_BX + 1;
    while( true ) {
      puVar14 = (undefined2 *)0x0;
      puVar12 = (undefined2 *)0x0;
      uVar8 = uVar5;
      if (0x1000 < uVar5) {
        uVar8 = 0x1000;
      }
      for (iVar9 = uVar8 << 3; iVar9 != 0; iVar9 = iVar9 + -1) {
        puVar4 = puVar14;
        puVar14 = puVar14 + 1;
        puVar2 = puVar12;
        puVar12 = puVar12 + 1;
        *puVar4 = *puVar2;
      }
      bVar15 = uVar5 < 0x1000;
      uVar5 = uVar5 - 0x1000;
      if (bVar15 || uVar5 == 0) break;
      iVar7 = iVar7 + 0x1000;
      iVar6 = iVar6 + 0x1000;
    }
  }
  FUN_1000_2443(iVar10,in_BX);
  return CONCAT22(in_DX,4);
}


// ==== FUN_1000_2646 @ 1000:2646 (size 100) callers: FUN_1000_26aa

undefined4 __cdecl16near FUN_1000_2646(void)

{
  int in_AX;
  int in_CX;
  int iVar1;
  int in_BX;
  int iVar2;
  
  if (in_BX != DAT_1000_2305) {
    iVar2 = in_BX + in_AX;
    *(int *)0x0 = in_CX - in_AX;
    *(int *)&DAT_6000_0002 = in_BX;
    *(int *)0x0 = in_AX;
    iVar1 = in_BX + in_CX;
    if (*(int *)&DAT_6000_0002 == 0) {
      *(int *)((char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 4) = iVar2;
    }
    else {
      *(int *)&DAT_6000_0002 = iVar2;
    }
    FUN_1000_2443();
    return CONCAT22(in_BX,4);
  }
  *(int *)0x0 = in_AX;
  FUN_1000_279a(0,in_BX + in_AX);
  return CONCAT22(in_BX,4);
}


// ==== FUN_1000_26aa @ 1000:26aa (size 122) callers: 

undefined2 __cdecl16far FUN_1000_26aa(undefined2 param_1,int param_2,uint param_3,uint param_4)

{
  undefined2 uVar1;
  uint uVar2;
  
  DAT_1000_2309 = 0x6000;
  DAT_1000_230b = param_4;
  DAT_1000_230d = param_3;
  if (param_2 == 0) {
    uVar1 = FUN_1000_254d(param_3,param_4);
  }
  else {
    if (param_3 == 0 && param_4 == 0) {
      FUN_1000_2443(param_3,param_2);
    }
    else {
      uVar2 = param_4 + (0xffec < param_3);
      if ((!CARRY2(param_4,(uint)(0xffec < param_3))) && ((uVar2 & 0xfff0) == 0)) {
        uVar2 = CONCAT11((byte)(param_3 + 0x13 >> 0xc) | (char)uVar2 * '\x10',
                         (char)(param_3 + 0x13 >> 4));
        if (*(uint *)0x0 < uVar2) {
          uVar1 = FUN_1000_25ca();
          return uVar1;
        }
        if (*(uint *)0x0 == uVar2) {
          DAT_1000_2309 = 0x6000;
          return 4;
        }
        uVar1 = FUN_1000_2646();
        return uVar1;
      }
    }
    uVar1 = 0;
  }
  return uVar1;
}


// ==== FUN_1000_2724 @ 1000:2724 (size 118) callers: FUN_1000_279a,FUN_1000_27d9

undefined2 FUN_1000_2724(undefined2 param_1,int param_2)

{
  int iVar1;
  uint uVar2;
  
  uVar2 = (param_2 - DAT_6000_0090) + 0x40U >> 6;
  if (uVar2 != DAT_6000_9166) {
    uVar2 = uVar2 * 0x40;
    if (DAT_6000_00a8 < uVar2 + DAT_6000_0090) {
      uVar2 = DAT_6000_00a8 - DAT_6000_0090;
    }
    iVar1 = FUN_1000_328d(DAT_6000_0090,uVar2);
    if (iVar1 != -1) {
      DAT_6000_00a6 = 0;
      DAT_6000_00a8 = DAT_6000_0090 + iVar1;
      return 0;
    }
    DAT_6000_9166 = uVar2 >> 6;
  }
  DAT_6000_00a4 = param_2;
  DAT_6000_00a2 = param_1;
  return 1;
}


// ==== FUN_1000_279a @ 1000:279a (size 63) callers: FUN_1000_230f,FUN_1000_2646

undefined2 __cdecl16near FUN_1000_279a(undefined2 param_1,undefined2 param_2)

{
  int iVar1;
  undefined1 in_CF;
  undefined1 in_ZF;
  
  FUN_1000_1675();
  if (((!(bool)in_CF) && (FUN_1000_1675(), (bool)in_CF || (bool)in_ZF)) &&
     (iVar1 = FUN_1000_2724(param_1,param_2), iVar1 != 0)) {
    return 0;
  }
  return 0xffff;
}


// ==== FUN_1000_27d9 @ 1000:27d9 (size 139) callers: FUN_1000_246c,FUN_1000_24d0

undefined4 __cdecl16near FUN_1000_27d9(uint param_1,int param_2)

{
  uint uVar1;
  int iVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined1 uVar5;
  undefined1 uVar6;
  undefined4 uVar7;
  
  uVar7 = FUN_1000_13d3();
  uVar1 = (uint)uVar7 + DAT_6000_00a2;
  iVar2 = uVar1 + param_1;
  uVar1 = (int)((ulong)uVar7 >> 0x10) + (uint)CARRY2((uint)uVar7,DAT_6000_00a2) + param_2 +
          (uint)CARRY2(uVar1,param_1);
  uVar5 = uVar1 < 0xf;
  uVar6 = uVar1 == 0xf;
  if ((int)uVar1 < 0xf) {
LAB_1000_280a:
    uVar4 = DAT_6000_00a4;
    uVar3 = FUN_1000_1435();
    FUN_1000_1675();
    if (((!(bool)uVar5) && (FUN_1000_1675(), (bool)uVar5 || (bool)uVar6)) &&
       (iVar2 = FUN_1000_2724(uVar3,uVar4), iVar2 != 0)) goto LAB_1000_2860;
  }
  else if ((int)uVar1 < 0x10) {
    uVar5 = iVar2 != -1;
    uVar6 = iVar2 == -1;
    goto LAB_1000_280a;
  }
  uVar4 = 0xffff;
  uVar3 = 0xffff;
LAB_1000_2860:
  return CONCAT22(uVar4,uVar3);
}


// ==== FUN_1000_2864 @ 1000:2864 (size 80) callers: FUN_2000_2b73

uint __cdecl16far FUN_1000_2864(void)

{
  int iVar1;
  undefined2 local_6;
  
  iVar1 = DAT_6000_00a8;
  local_6 = FUN_1000_1495(0);
  if ((iVar1 != 0) || (0x10 < local_6)) {
    local_6 = local_6 - 0x10;
  }
  return local_6 & 0xfff0;
}


// ==== getch @ 1000:28b4 (size 25) callers: FUN_2000_1d0b,FUN_2000_1fbd,select_player,game_disk_prompt,strike,FUN_2000_919a,FUN_2000_9968,movecontrol,cast_spell,FUN_2000_ea27,roll_char,FUN_3000_8235,FUN_3000_bdb5,wait_key,flush_keys,read_string  // conio (INT 21h AH=07h)

short __cdecl16far getch(void)

{
  code *pcVar1;
  byte bVar2;
  
  if (DAT_6000_9168 == '\0') {
    pcVar1 = (code *)swi(0x21);
    bVar2 = (*pcVar1)();
  }
  else {
    DAT_6000_9168 = '\0';
    bVar2 = DAT_6000_9169;
  }
  return (uint)bVar2;
}


// ==== FUN_1000_28f4 @ 1000:28f4 (size 30) callers: select_player

uint __cdecl16far FUN_1000_28f4(byte param_1)

{
  uint uVar1;
  
  if (DAT_6000_9168 == '\0') {
    DAT_6000_9168 = '\x01';
    DAT_6000_9169 = param_1;
    uVar1 = (uint)param_1;
  }
  else {
    uVar1 = 0xffff;
  }
  return uVar1;
}


// ==== FUN_1000_2912 @ 1000:2912 (size 73) callers: FUN_2000_264e,FUN_2000_2697,FUN_2000_2723,load_world_pic

void __cdecl16far FUN_1000_2912(char param_1,char param_2)

{
  byte bVar1;
  byte bVar2;
  
  bVar2 = param_2 + -1 + DAT_6000_9119;
  bVar1 = param_1 + -1 + DAT_6000_9118;
  if ((((DAT_6000_9119 <= bVar2) && (bVar2 <= DAT_6000_911b)) && (DAT_6000_9118 <= bVar1)) &&
     (bVar1 <= DAT_6000_911a)) {
    FUN_1000_20de();
  }
  return;
}


// ==== FUN_1000_295b @ 1000:295b (size 84) callers: FUN_1000_300e

undefined2 __cdecl16far FUN_1000_295b(int param_1,int param_2,int param_3,int param_4,int param_5)

{
  int iVar1;
  undefined2 uVar2;
  undefined4 uVar3;
  int iVar4;
  
  iVar1 = FUN_1000_2f97(param_4,param_3,param_2,param_1);
  if (iVar1 == 0) {
    uVar2 = 0;
  }
  else {
    iVar1 = (param_3 - param_1) + 1;
    for (; param_2 <= param_4; param_2 = param_2 + 1) {
      uVar2 = 0x6000;
      iVar4 = param_5;
      uVar3 = FUN_1000_1db1(param_2,param_1);
      FUN_1000_2f5b(iVar1,uVar3,iVar4,uVar2);
      param_5 = param_5 + iVar1 * 2;
    }
    uVar2 = 1;
  }
  return uVar2;
}


// ==== FUN_1000_29af @ 1000:29af (size 84) callers: FUN_1000_300e

undefined2 __cdecl16far FUN_1000_29af(int param_1,int param_2,int param_3,int param_4,int param_5)

{
  int iVar1;
  undefined2 uVar2;
  undefined4 uVar3;
  
  iVar1 = FUN_1000_2f97(param_4,param_3,param_2,param_1);
  if (iVar1 == 0) {
    uVar2 = 0;
  }
  else {
    iVar1 = (param_3 - param_1) + 1;
    for (; param_2 <= param_4; param_2 = param_2 + 1) {
      uVar3 = FUN_1000_1db1(param_2,param_1);
      FUN_1000_2f5b(iVar1,param_5,0x6000,uVar3);
      param_5 = param_5 + iVar1 * 2;
    }
    uVar2 = 1;
  }
  return uVar2;
}


// ==== FUN_1000_2a03 @ 1000:2a03 (size 40) callers: FUN_2000_0004,FUN_2000_0434,FUN_2000_1459,FUN_2000_260d,FUN_3000_66b7,FUN_4000_0ee1,FUN_4000_0f0d,FUN_4000_0f7a,FUN_4000_0fd1,FUN_4000_2cbc,FUN_4000_2cf4,FUN_4000_2d34,FUN_4000_2d71

void __cdecl16far FUN_1000_2a03(undefined2 param_1,undefined2 param_2,undefined2 param_3)

{
  undefined1 local_a [8];
  
  FUN_1000_1710(local_a);
  FUN_1000_2a2b(param_1,param_2,param_3,local_a);
  return;
}


// ==== FUN_1000_2a2b @ 1000:2a2b (size 156) callers: FUN_1000_2a03,FUN_4000_100f

undefined2 __cdecl16far
FUN_1000_2a2b(byte param_1,int param_2,undefined2 *param_3,undefined2 *param_4)

{
  uint *puVar1;
  uint uVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  undefined2 uVar6;
  char cVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  byte bVar11;
  byte bVar12;
  byte in_AF;
  byte bVar13;
  byte bVar14;
  byte in_TF;
  byte in_IF;
  byte bVar15;
  byte in_NT;
  undefined4 uVar16;
  undefined1 local_10;
  undefined1 local_f;
  byte local_e;
  undefined3 local_d;
  code *local_a;
  undefined2 local_8;
  code *local_6;
  
  local_6 = (code *)&local_10;
  local_10 = (code)0x55;
  local_f = 0xcd;
  local_e = param_1;
  local_d = CONCAT12(local_d._2_1_,0xcb5d);
  bVar11 = param_1 < 0x25;
  bVar15 = SBORROW1(param_1,'%');
  cVar7 = param_1 - 0x25;
  bVar14 = cVar7 < '\0';
  bVar13 = cVar7 == '\0';
  bVar12 = (POPCOUNT(cVar7) & 1U) == 0;
  if (!(bool)bVar11) {
    bVar11 = param_1 < 0x26;
    bVar15 = SBORROW1(param_1,'&');
    cVar7 = param_1 - 0x26;
    bVar14 = cVar7 < '\0';
    bVar13 = cVar7 == '\0';
    bVar12 = (POPCOUNT(cVar7) & 1U) == 0;
    if ((bool)bVar11 || (bool)bVar13) {
      local_d = 0x68f36;
      local_8 = 0xcb5d;
      local_a = local_6;
    }
  }
  uVar3 = *param_4;
  uVar4 = param_4[3];
  uVar10 = *(undefined2 *)(param_2 + 2);
  uVar9 = *(undefined2 *)(param_2 + 4);
  uVar5 = *(undefined2 *)(param_2 + 10);
  uVar6 = *(undefined2 *)(param_2 + 8);
  uVar16 = (*local_6)(0x1000);
  uVar8 = (undefined2)uVar16;
  *param_4 = uVar3;
  param_4[3] = uVar4;
  param_3[4] = uVar6;
  param_3[7] = (uint)(in_NT & 1) * 0x4000 | (uint)(bVar15 & 1) * 0x800 | (uint)(in_IF & 1) * 0x200 |
               (uint)(in_TF & 1) * 0x100 | (uint)(bVar14 & 1) * 0x80 | (uint)(bVar13 & 1) * 0x40 |
               (uint)(in_AF & 1) * 0x10 | (uint)(bVar12 & 1) * 4 | (uint)(bVar11 & 1);
  param_3[6] = (uint)(in_NT & 1) * 0x4000 | (uint)(bVar15 & 1) * 0x800 | (uint)(in_IF & 1) * 0x200 |
               (uint)(in_TF & 1) * 0x100 | (uint)(bVar14 & 1) * 0x80 | (uint)(bVar13 & 1) * 0x40 |
               (uint)(in_AF & 1) * 0x10 | (uint)(bVar12 & 1) * 4 | (uint)(bVar11 & 1);
  puVar1 = param_3 + 6;
  *puVar1 = *puVar1 & 1;
  uVar2 = *puVar1;
  param_3[5] = uVar5;
  param_3[3] = (int)((ulong)uVar16 >> 0x10);
  param_3[2] = uVar9;
  param_3[1] = uVar10;
  *param_3 = uVar8;
  if (uVar2 != 0) {
    FUN_1000_14bd(uVar8);
  }
  return uVar8;
}


// ==== FUN_1000_2ac7 @ 1000:2ac7 (size 39) callers: FUN_1000_3d66

undefined2 __cdecl16far FUN_1000_2ac7(undefined2 param_1,int param_2)

{
  code *pcVar1;
  undefined2 uVar2;
  undefined1 in_CF;
  undefined4 uVar3;
  
  pcVar1 = (code *)swi(0x21);
  uVar3 = (*pcVar1)();
  uVar2 = (undefined2)uVar3;
  if ((bool)in_CF) {
    uVar2 = FUN_1000_14bd();
  }
  else if (param_2 == 0) {
    uVar2 = (int)((ulong)uVar3 >> 0x10);
  }
  return uVar2;
}


// ==== kbhit @ 1000:2aee (size 18) callers: FUN_2000_1d0b,FUN_2000_1fbd,select_player,game_disk_prompt,strike,FUN_2000_919a,FUN_2000_9968,movecontrol,FUN_2000_ea27,roll_char,FUN_3000_8235,FUN_3000_b89b,FUN_3000_bdb5,wait_key,FUN_4000_3498,flush_keys  // conio (INT 21h AH=0Bh)

short __cdecl16far kbhit(void)

{
  code *pcVar1;
  char cVar2;
  short sVar3;
  
  if (DAT_6000_9168 == '\0') {
    pcVar1 = (code *)swi(0x21);
    cVar2 = (*pcVar1)();
    sVar3 = (short)cVar2;
  }
  else {
    sVar3 = 1;
  }
  return sVar3;
}


// ==== FUN_1000_2b00 @ 1000:2b00 (size 157) callers: FUN_1000_300e

undefined2 __cdecl16far
FUN_1000_2b00(int param_1,int param_2,int param_3,int param_4,int param_5,int param_6)

{
  int iVar1;
  undefined2 uVar2;
  undefined4 uVar3;
  undefined4 uVar4;
  int local_6;
  int local_4;
  
  iVar1 = FUN_1000_2f97(param_4,param_3,param_2,param_1);
  if ((iVar1 == 0) ||
     (iVar1 = FUN_1000_2f97(param_6 + (param_4 - param_2),param_5 + (param_3 - param_1),param_6,
                            param_5), iVar1 == 0)) {
    uVar2 = 0;
  }
  else {
    local_4 = param_4;
    local_6 = 1;
    iVar1 = param_2;
    if (param_2 < param_6) {
      local_4 = param_2;
      local_6 = -1;
      iVar1 = param_4;
    }
    for (; local_4 + local_6 != iVar1; iVar1 = iVar1 + local_6) {
      uVar3 = FUN_1000_1db1(param_6 + (iVar1 - param_2),param_5);
      uVar4 = FUN_1000_1db1(iVar1,param_1);
      FUN_1000_2f5b((param_3 - param_1) + 1,uVar4,uVar3);
    }
    uVar2 = 1;
  }
  return uVar2;
}


// ==== FUN_1000_2b9d @ 1000:2b9d (size 29) callers: FUN_1000_42f9,FUN_2000_01d5,FUN_2000_0348,fclose

void __cdecl16far FUN_1000_2b9d(uint param_1)

{
  if (3 < param_1) {
    if (param_1 - 4 == DAT_6000_916c) {
      FUN_1000_2bba();
    }
    else {
      FUN_1000_2bf4();
    }
  }
  return;
}


// ==== FUN_1000_2bba @ 1000:2bba (size 58) callers: FUN_1000_2b9d

void __cdecl16near FUN_1000_2bba(void)

{
  byte *in_BX;
  byte *pbVar1;
  
  pbVar1 = in_BX;
  if (DAT_6000_916a != in_BX) {
    pbVar1 = *(byte **)(in_BX + 2);
    if ((*pbVar1 & 1) != 0) goto LAB_1000_2bee;
    if (pbVar1 != DAT_6000_916a) {
      FUN_1000_2c2d();
      in_BX = pbVar1;
      pbVar1 = *(byte **)(pbVar1 + 2);
      goto LAB_1000_2bee;
    }
  }
  DAT_6000_916a = (byte *)0x0;
  DAT_6000_916c = (byte *)0x0;
  DAT_6000_916e = 0;
  in_BX = pbVar1;
  pbVar1 = DAT_6000_916c;
LAB_1000_2bee:
  DAT_6000_916c = pbVar1;
  FUN_1000_1e79(in_BX);
  return;
}


// ==== FUN_1000_2bf4 @ 1000:2bf4 (size 57) callers: FUN_1000_2b9d

void __cdecl16near FUN_1000_2bf4(void)

{
  uint uVar1;
  uint *puVar2;
  uint *in_BX;
  uint *puVar3;
  
  *in_BX = *in_BX - 1;
  if (in_BX != DAT_6000_916a) {
    puVar3 = (uint *)in_BX[1];
    if ((*puVar3 & 1) == 0) {
      *puVar3 = *puVar3 + *in_BX;
      *(undefined2 *)((int)in_BX + *in_BX + 2) = puVar3;
      in_BX = puVar3;
      goto LAB_1000_2c17;
    }
  }
  FUN_1000_2c49();
LAB_1000_2c17:
  puVar3 = (uint *)(*in_BX + (int)in_BX);
  uVar1 = *puVar3;
  if ((uVar1 & 1) != 0) {
    return;
  }
  *in_BX = *in_BX + uVar1;
  *(undefined2 *)((int)puVar3 + uVar1 + 2) = in_BX;
  puVar2 = (uint *)puVar3[3];
  if (puVar3 != puVar2) {
    uVar1 = puVar3[2];
    DAT_6000_916e = puVar2;
    puVar2[2] = uVar1;
    *(undefined2 *)(uVar1 + 6) = puVar2;
    return;
  }
  DAT_6000_916e = (uint *)0x0;
  return;
}


// ==== FUN_1000_2c2d @ 1000:2c2d (size 28) callers: FUN_1000_2bba,malloc

void __cdecl16near FUN_1000_2c2d(void)

{
  int iVar1;
  int iVar2;
  int in_BX;
  
  iVar1 = *(int *)(in_BX + 6);
  if (in_BX != iVar1) {
    iVar2 = *(int *)(in_BX + 4);
    DAT_6000_916e = iVar1;
    *(int *)(iVar1 + 4) = iVar2;
    *(int *)(iVar2 + 6) = iVar1;
    return;
  }
  DAT_6000_916e = 0;
  return;
}


// ==== FUN_1000_2c49 @ 1000:2c49 (size 35) callers: FUN_1000_2bf4

void __cdecl16near FUN_1000_2c49(void)

{
  int iVar1;
  int iVar2;
  int in_BX;
  
  iVar2 = DAT_6000_916e;
  if (DAT_6000_916e != 0) {
    iVar1 = *(int *)(DAT_6000_916e + 6);
    *(int *)(DAT_6000_916e + 6) = in_BX;
    *(int *)(iVar1 + 4) = in_BX;
    *(int *)(in_BX + 6) = iVar1;
    *(int *)(in_BX + 4) = iVar2;
    return;
  }
  DAT_6000_916e = in_BX;
  *(int *)(in_BX + 4) = in_BX;
  *(int *)(in_BX + 6) = in_BX;
  return;
}


// ==== malloc @ 1000:2c6c (size 96) callers: FUN_1000_42f9,FUN_2000_01d5,FUN_2000_2b73,main  // libc

void * __cdecl16far malloc(ushort size)

{
  uint *puVar1;
  uint uVar2;
  void *pvVar3;
  uint *puVar4;
  
  pvVar3 = (void *)0x0;
  if (size != 0) {
    if (size < 0xfffb) {
      uVar2 = size + 5 & 0xfffe;
      if (uVar2 < 8) {
        uVar2 = 8;
      }
      if (DAT_6000_916a == 0) {
        pvVar3 = (void *)FUN_1000_2ccc();
      }
      else {
        puVar4 = DAT_6000_916e;
        if (DAT_6000_916e != (uint *)0x0) {
          do {
            if (uVar2 <= *puVar4) {
              if (*puVar4 < uVar2 + 8) {
                FUN_1000_2c2d();
                *puVar4 = *puVar4 + 1;
                return puVar4 + 2;
              }
              pvVar3 = (void *)FUN_1000_2d35();
              return pvVar3;
            }
            puVar1 = puVar4 + 3;
            puVar4 = (uint *)*puVar1;
          } while ((uint *)*puVar1 != DAT_6000_916e);
        }
        pvVar3 = (void *)FUN_1000_2d0c();
      }
    }
    else {
      pvVar3 = (void *)0x0;
    }
  }
  return pvVar3;
}


// ==== FUN_1000_2ccc @ 1000:2ccc (size 64) callers: malloc

int * __cdecl16near FUN_1000_2ccc(void)

{
  int in_AX;
  uint uVar1;
  int *piVar2;
  
  uVar1 = FUN_1000_1e9b(0,0);
  if ((uVar1 & 1) != 0) {
    FUN_1000_1e9b(uVar1 & 1,0);
  }
  piVar2 = (int *)FUN_1000_1e9b(in_AX,0);
  if (piVar2 != (int *)0xffff) {
    DAT_6000_916a = piVar2;
    DAT_6000_916c = piVar2;
    *piVar2 = in_AX + 1;
    return piVar2 + 2;
  }
  return (int *)0x0;
}


// ==== FUN_1000_2d0c @ 1000:2d0c (size 41) callers: malloc

int * __cdecl16near FUN_1000_2d0c(void)

{
  int in_AX;
  int *piVar1;
  
  piVar1 = (int *)FUN_1000_1e9b();
  if (piVar1 != (int *)0xffff) {
    piVar1[1] = (int)DAT_6000_916c;
    DAT_6000_916c = piVar1;
    *piVar1 = in_AX + 1;
    return piVar1 + 2;
  }
  return (int *)0x0;
}


// ==== FUN_1000_2d35 @ 1000:2d35 (size 25) callers: malloc

int * __cdecl16near FUN_1000_2d35(void)

{
  int in_AX;
  int *in_BX;
  int *piVar1;
  
  *in_BX = *in_BX - in_AX;
  piVar1 = (int *)((int)in_BX + *in_BX);
  *piVar1 = in_AX + 1;
  piVar1[1] = (int)in_BX;
  *(undefined2 *)((int)piVar1 + in_AX + 2) = piVar1;
  return piVar1 + 2;
}


// ==== FUN_1000_2e18 @ 1000:2e18 (size 19) callers: 

void __cdecl16far FUN_1000_2e18(void)

{
  FUN_1000_1f5d(0,1,&stack0x0004);
  return;
}


// ==== thunk_FUN_1000_05db @ 1000:2e2b (size 4) callers: FUN_1000_195e

void thunk_FUN_1000_05db(void)

{
                    /* WARNING: Could not recover jumptable at 0x00012e2b. Too many branches */
                    /* WARNING: Treating indirect jump as call */
  (*DAT_6000_91c2)();
  return;
}


// ==== FUN_1000_2e2f @ 1000:2e2f (size 56) callers: FUN_1000_2e95

undefined2 FUN_1000_2e2f(uint param_1)

{
  char cVar1;
  
  cVar1 = (char)((param_1 >> 1) / (uint)DAT_6000_9120);
  return CONCAT11(cVar1,(char)(param_1 >> 1) - cVar1 * DAT_6000_9120);
}


// ==== FUN_1000_2e67 @ 1000:2e67 (size 46) callers: FUN_1000_2e95

void FUN_1000_2e67(int *param_1,int *param_2)

{
  byte bVar1;
  int extraout_DX;
  char cVar3;
  int iVar2;
  
  iVar2 = *param_2;
  if (iVar2 != *param_1) {
    FUN_1000_20de();
    *param_1 = extraout_DX;
    iVar2 = extraout_DX;
  }
  cVar3 = (char)((uint)iVar2 >> 8);
  bVar1 = (char)iVar2 + 1;
  iVar2 = CONCAT11(cVar3,bVar1);
  if (DAT_6000_9120 <= bVar1) {
    iVar2 = (uint)(byte)(cVar3 + 1) << 8;
  }
  *param_2 = iVar2;
  return;
}


// ==== FUN_1000_2e95 @ 1000:2e95 (size 198) callers: FUN_1000_2f5b

void FUN_1000_2e95(int param_1,undefined2 *param_2,undefined2 *param_3)

{
  undefined2 uVar1;
  bool bVar2;
  bool bVar3;
  undefined2 local_8;
  undefined2 local_6;
  undefined2 local_4;
  
  local_8 = FUN_1000_3358();
  bVar2 = param_3._2_2_ == DAT_6000_9125;
  if (bVar2) {
    local_4 = FUN_1000_2e2f((undefined2 *)param_3,param_3._2_2_);
  }
  bVar3 = param_2._2_2_ == DAT_6000_9125;
  if (bVar3) {
    local_6 = FUN_1000_2e2f((undefined2 *)param_2,param_2._2_2_);
  }
  while (param_1 != 0) {
    if (bVar3) {
      FUN_1000_2e67(&local_8,&local_6);
      uVar1 = FUN_1000_20de();
    }
    else {
      uVar1 = *param_2;
      param_2 = (undefined2 *)CONCAT22(param_2._2_2_,(undefined2 *)param_2 + 1);
    }
    if (bVar2) {
      FUN_1000_2e67(&local_8,&local_4);
      FUN_1000_20de();
      param_1 = param_1 + -1;
    }
    else {
      *param_3 = uVar1;
      param_3 = (undefined2 *)CONCAT22(param_3._2_2_,(undefined2 *)param_3 + 1);
      param_1 = param_1 + -1;
    }
  }
  FUN_1000_20de();
  return;
}


// ==== FUN_1000_2f5b @ 1000:2f5b (size 60) callers: FUN_1000_295b,FUN_1000_29af,FUN_1000_2b00

void FUN_1000_2f5b(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
                  undefined2 param_5)

{
  if ((DAT_6000_9121 == '\0') && (DAT_6000_9127 != 0)) {
    FUN_1000_1dd6(param_1,param_2,param_3,param_4,param_5);
  }
  else {
    FUN_1000_2e95(param_1,param_2,param_3,param_4,param_5);
  }
  return;
}


// ==== FUN_1000_2f97 @ 1000:2f97 (size 85) callers: FUN_1000_295b,FUN_1000_29af,FUN_1000_2b00

undefined2 FUN_1000_2f97(uint param_1,uint param_2,uint param_3,uint param_4)

{
  undefined2 uVar1;
  
  if ((((((DAT_6000_9120 < param_4) || (DAT_6000_9120 < param_2)) || ((int)param_2 < (int)param_4))
       || ((DAT_6000_911f < param_3 || (DAT_6000_911f < param_1)))) ||
      (((int)param_1 < (int)param_3 || (((int)param_4 < 1 || ((int)param_2 < 1)))))) ||
     (((int)param_3 < 1 || ((int)param_1 < 1)))) {
    uVar1 = 0;
  }
  else {
    uVar1 = 1;
  }
  return uVar1;
}


// ==== FUN_1000_2fec @ 1000:2fec (size 34) callers: FUN_1000_300e

void FUN_1000_2fec(int param_1,int param_2,undefined2 *param_3)

{
  undefined2 uVar1;
  
  uVar1 = CONCAT11(DAT_6000_911c,0x20);
  for (; param_2 <= param_1; param_2 = param_2 + 1) {
    *param_3 = uVar1;
    param_3 = param_3 + 1;
  }
  return;
}


// ==== FUN_1000_300e @ 1000:300e (size 358) callers: FUN_1000_1ee8,FUN_1000_1f5d

void FUN_1000_300e(char param_1,char param_2,char param_3,char param_4,char param_5,char param_6)

{
  byte bVar1;
  byte bVar2;
  undefined1 local_a2 [160];
  
  if (((DAT_6000_9121 == '\0') && (DAT_6000_9127 != 0)) && (param_1 == '\x01')) {
    param_5 = param_5 + '\x01';
    bVar1 = param_4 + 1;
    param_3 = param_3 + '\x01';
    bVar2 = param_2 + 1;
    if (param_6 == '\x06') {
      FUN_1000_2b00(param_5,bVar1 + 1,param_3,bVar2,param_5,bVar1);
      FUN_1000_295b(param_5,bVar2,param_5,bVar2,local_a2);
      FUN_1000_2fec(param_3,param_5,local_a2);
    }
    else {
      FUN_1000_2b00(param_5,bVar1,param_3,bVar2 - 1,param_5,bVar1 + 1);
      FUN_1000_295b(param_5,bVar1,param_5,bVar1,local_a2);
      FUN_1000_2fec(param_3,param_5,local_a2);
      bVar2 = bVar1;
    }
    FUN_1000_29af(param_5,bVar2,param_3,bVar2,local_a2);
  }
  else {
    FUN_1000_20de();
  }
  return;
}


// ==== FUN_1000_328d @ 1000:328d (size 28) callers: FUN_1000_2724

undefined2 __cdecl16far FUN_1000_328d(undefined2 param_1,undefined2 param_2)

{
  code *pcVar1;
  undefined2 uVar2;
  undefined1 in_CF;
  
  pcVar1 = (code *)swi(0x21);
  uVar2 = (*pcVar1)();
  if ((bool)in_CF) {
    FUN_1000_14bd(uVar2);
  }
  else {
    param_2 = 0xffff;
  }
  return param_2;
}


// ==== sound @ 1000:3306 (size 44) callers: FUN_2000_5bb6,FUN_2000_6123,FUN_2000_722c,FUN_3000_d4d9  // PC speaker: 1193180 / hz into timer 2

void __cdecl16far sound(short hz)

{
  byte bVar1;
  
  if (0x12 < (uint)hz) {
    bVar1 = in(0x61);
    if ((bVar1 & 3) == 0) {
      out(0x61,bVar1 | 3);
      out(0x43,0xb6);
    }
    out(0x42,(char)(0x1234dd / (ulong)(uint)hz));
    out(0x42,(char)(0x1234dd / (ulong)(uint)hz >> 8));
  }
  return;
}


// ==== FUN_1000_3332 @ 1000:3332 (size 7) callers: FUN_2000_5bb6,FUN_2000_6123,FUN_2000_722c,FUN_3000_d4d9

byte __cdecl16far FUN_1000_3332(void)

{
  byte bVar1;
  
  bVar1 = in(0x61);
  out(0x61,bVar1 & 0xfc);
  return bVar1 & 0xfc;
}


// ==== FUN_1000_3339 @ 1000:3339 (size 31) callers: FUN_2000_7b86,FUN_3000_8235

void __cdecl16far FUN_1000_3339(uint param_1)

{
  if (param_1 == 0xffff) {
    param_1 = (uint)DAT_6000_911e;
  }
  FUN_1000_2186(param_1);
  DAT_6000_911c = DAT_6000_911d;
  return;
}


// ==== FUN_1000_3358 @ 1000:3358 (size 10) callers: FUN_1000_1f5d,FUN_1000_2e95

undefined2 __cdecl16near FUN_1000_3358(void)

{
  undefined2 extraout_DX;
  
  FUN_1000_20de();
  return extraout_DX;
}


// ==== FUN_1000_3384 @ 1000:3384 (size 112) callers: FUN_1000_33f4,FUN_1000_4821,bank,main

uint __cdecl16far FUN_1000_3384(byte *param_1)

{
  ulong uVar1;
  bool bVar2;
  uint uVar3;
  uint uVar4;
  byte bVar5;
  
  uVar3 = 0;
  do {
    bVar5 = *param_1;
    param_1 = param_1 + 1;
  } while ((*(byte *)(bVar5 + 0x8dc3) & 1) != 0);
  bVar2 = false;
  if (bVar5 != 0x2b) {
    if (bVar5 != 0x2d) goto LAB_1000_33b2;
    bVar2 = true;
  }
  do {
    bVar5 = *param_1;
    param_1 = param_1 + 1;
LAB_1000_33b2:
    if ((0x39 < bVar5) || (bVar5 < 0x30)) goto LAB_1000_33e5;
    uVar1 = (ulong)uVar3;
    uVar4 = (uint)(uVar1 * 10);
    uVar3 = uVar4 + (byte)(bVar5 - 0x30);
  } while ((char)((char)(uVar1 * 10 >> 0x10) + CARRY2(uVar4,(uint)(byte)(bVar5 - 0x30))) == '\0');
  while( true ) {
    bVar5 = *param_1;
    param_1 = param_1 + 1;
    if ((0x39 < bVar5) || (bVar5 < 0x30)) break;
    uVar3 = uVar3 * 10 + (uint)(byte)(bVar5 - 0x30);
  }
LAB_1000_33e5:
  if (bVar2) {
    uVar3 = -uVar3;
  }
  return uVar3;
}


// ==== FUN_1000_33f4 @ 1000:33f4 (size 13) callers: 

void __cdecl16far FUN_1000_33f4(undefined2 param_1)

{
  FUN_1000_3384(param_1);
  return;
}


// ==== FUN_1000_3401 @ 1000:3401 (size 27) callers: FUN_1000_3d66

undefined2 __cdecl16far FUN_1000_3401(undefined2 param_1,undefined2 param_2,undefined2 param_3)

{
  code *pcVar1;
  undefined1 in_CF;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  if ((bool)in_CF) {
    param_3 = FUN_1000_14bd();
  }
  return param_3;
}


// ==== FUN_1000_341c @ 1000:341c (size 40) callers: fclose

void __cdecl16far FUN_1000_341c(uint param_1)

{
  if (param_1 < DAT_6000_9010) {
    *(undefined2 *)(param_1 * 2 + -0x6fee) = 0;
    FUN_1000_3444(param_1);
  }
  else {
    FUN_1000_14bd(6);
  }
  return;
}


// ==== FUN_1000_3444 @ 1000:3444 (size 30) callers: FUN_1000_341c,FUN_1000_3d66

undefined2 __cdecl16far FUN_1000_3444(int param_1)

{
  code *pcVar1;
  undefined2 uVar2;
  undefined1 in_CF;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  if ((bool)in_CF) {
    uVar2 = FUN_1000_14bd();
  }
  else {
    *(undefined2 *)(param_1 * 2 + -0x6fee) = 0;
    uVar2 = 0;
  }
  return uVar2;
}


// ==== FUN_1000_3462 @ 1000:3462 (size 119) callers: fgetc

/* WARNING: Removing unreachable block (ram,0x000134c6) */

undefined2 __cdecl16far FUN_1000_3462(uint param_1)

{
  code *pcVar1;
  bool bVar2;
  ulong uVar3;
  undefined4 uVar4;
  ulong uVar5;
  undefined2 uVar6;
  
  if (param_1 < DAT_6000_9010) {
    bVar2 = false;
    if ((*(uint *)(param_1 * 2 + -0x6fee) & 0x200) != 0) {
      return 1;
    }
    pcVar1 = (code *)swi(0x21);
    uVar3 = (*pcVar1)();
    uVar6 = (undefined2)uVar3;
    if (!bVar2) {
      if ((uVar3 & 0x800000) != 0) {
        return 0;
      }
      bVar2 = false;
      pcVar1 = (code *)swi(0x21);
      uVar4 = (*pcVar1)();
      uVar6 = (undefined2)uVar4;
      if (!bVar2) {
        bVar2 = false;
        pcVar1 = (code *)swi(0x21);
        uVar3 = (*pcVar1)((int)((ulong)uVar4 >> 0x10));
        uVar6 = (undefined2)uVar3;
        if (!bVar2) {
          pcVar1 = (code *)swi(0x21);
          uVar5 = (*pcVar1)();
          uVar6 = (undefined2)uVar5;
          if (!bVar2) {
            if (uVar5 < uVar3) {
              return 0;
            }
            return 1;
          }
        }
      }
    }
  }
  else {
    uVar6 = 6;
  }
  uVar6 = FUN_1000_14bd(uVar6);
  return uVar6;
}


// ==== fclose @ 1000:34d9 (size 129) callers: FUN_1000_36cf,load_h_bin,load_world_pic,select_player,game_disk_prompt,check_v_file,load_worldmap_bin,main,save_mon_map,load_mon_map,save_dun,load_dun,load_dung_bin,load_player,save_player,load_spell_text,show_help,roll_char,load_font  // libc

short __cdecl16far fclose(void *f)

{
  int iVar1;
  undefined2 uVar2;
  short sVar3;
  
  sVar3 = -1;
  if ((f != (void *)0x0) && ((void *)*(int *)((int)f + 0xe) == f)) {
    if (*(int *)((int)f + 6) != 0) {
      if ((*(int *)f < 0) && (iVar1 = FUN_1000_355a(f), iVar1 != 0)) {
        return -1;
      }
      if ((*(uint *)((int)f + 2) & 4) != 0) {
        FUN_1000_2b9d(*(undefined2 *)((int)f + 8));
      }
    }
    if (-1 < *(char *)((int)f + 4)) {
      sVar3 = FUN_1000_341c((int)*(char *)((int)f + 4));
    }
    *(undefined2 *)((int)f + 2) = 0;
    *(undefined2 *)((int)f + 6) = 0;
    *(undefined2 *)f = 0;
    *(undefined1 *)((int)f + 4) = 0xff;
    if (*(int *)((int)f + 0xc) != 0) {
      uVar2 = FUN_1000_15dc(*(undefined2 *)((int)f + 0xc),0,0);
      FUN_1000_18d0(uVar2);
      *(undefined2 *)((int)f + 0xc) = 0;
    }
  }
  return sVar3;
}


// ==== FUN_1000_355a @ 1000:355a (size 127) callers: FUN_1000_35db,FUN_1000_394a,FUN_1000_3ac5,FUN_1000_4083,fclose,fputc

undefined2 __cdecl16far FUN_1000_355a(int *param_1)

{
  int iVar1;
  int iVar2;
  
  if (param_1 == (int *)0x0) {
    FUN_1000_35db();
  }
  else {
    if ((int *)param_1[7] != param_1) {
      return 0xffff;
    }
    if (*param_1 < 0) {
      iVar1 = param_1[3] + *param_1 + 1;
      *param_1 = *param_1 - iVar1;
      iVar2 = param_1[4];
      param_1[5] = iVar2;
      iVar2 = FUN_1000_4a81((int)(char)param_1[2],iVar2,iVar1);
      if ((iVar2 != iVar1) && ((param_1[1] & 0x200U) == 0)) {
        param_1[1] = param_1[1] | 0x10;
        return 0xffff;
      }
    }
    else if ((((param_1[1] & 8U) != 0) || (param_1[5] == (int)param_1 + 5)) &&
            (*param_1 = 0, param_1[5] == (int)param_1 + 5)) {
      param_1[5] = param_1[4];
    }
  }
  return 0;
}


// ==== FUN_1000_35db @ 1000:35db (size 58) callers: FUN_1000_355a

int __cdecl16far FUN_1000_35db(void)

{
  int iVar1;
  int iVar2;
  undefined2 local_4;
  
  local_4 = 0;
  iVar1 = -0x7130;
  iVar2 = DAT_6000_9010;
  while (iVar2 != 0) {
    if ((*(uint *)(iVar1 + 2) & 3) != 0) {
      FUN_1000_355a(iVar1);
      local_4 = local_4 + 1;
    }
    iVar1 = iVar1 + 0x10;
    iVar2 = iVar2 + -1;
  }
  return local_4;
}


// ==== FUN_1000_3615 @ 1000:3615 (size 186) callers: FUN_1000_36cf

uint FUN_1000_3615(undefined2 *param_1,uint *param_2,char *param_3)

{
  char cVar1;
  uint uVar2;
  uint uVar3;
  undefined2 local_4;
  
  local_4 = 0;
  cVar1 = *param_3;
  if (cVar1 == 'r') {
    uVar2 = 1;
    uVar3 = 1;
  }
  else {
    if (cVar1 == 'w') {
      uVar2 = 0x302;
    }
    else {
      if (cVar1 != 'a') {
        return 0;
      }
      uVar2 = 0x902;
    }
    local_4 = 0x80;
    uVar3 = 2;
  }
  cVar1 = param_3[1];
  if ((cVar1 == '+') || ((param_3[2] == '+' && ((cVar1 == 't' || (cVar1 == 'b')))))) {
    if (cVar1 == '+') {
      cVar1 = param_3[2];
    }
    uVar2 = uVar2 & 0xfffc | 4;
    local_4 = 0x180;
    uVar3 = 3;
  }
  if (cVar1 == 't') {
    uVar2 = uVar2 | 0x4000;
  }
  else {
    if (cVar1 == 'b') {
      uVar2 = uVar2 | 0x8000;
    }
    else {
      uVar2 = uVar2 | DAT_6000_903a & 0xc000;
      if ((DAT_6000_903a & 0x8000) == 0) goto LAB_1000_36ac;
    }
    uVar3 = uVar3 | 0x40;
  }
LAB_1000_36ac:
  DAT_6000_8eca = 0x1000;
  DAT_6000_8ec8 = (char *)s_UP_IS_NORTH__DOWN_IS_SOUTH__6000_4bc1 + 8;
  *param_2 = uVar2;
  *param_1 = local_4;
  return uVar3;
}


// ==== FUN_1000_36cf @ 1000:36cf (size 156) callers: fopen

void * FUN_1000_36cf(uint param_1,undefined2 param_2,undefined2 param_3,void *param_4)

{
  char cVar1;
  int iVar2;
  undefined2 local_6;
  uint local_4;
  
  iVar2 = FUN_1000_3615(&local_6,&local_4,param_2);
  *(int *)((int)param_4 + 2) = iVar2;
  if (iVar2 == 0) {
LAB_1000_3710:
    *(undefined1 *)((int)param_4 + 4) = 0xff;
    *(undefined2 *)((int)param_4 + 2) = 0;
  }
  else {
    if (*(char *)((int)param_4 + 4) < '\0') {
      cVar1 = FUN_1000_3d66(param_3,local_4 | param_1,local_6);
      *(char *)((int)param_4 + 4) = cVar1;
      if (cVar1 < '\0') goto LAB_1000_3710;
    }
    iVar2 = FUN_1000_1508((int)*(char *)((int)param_4 + 4));
    if (iVar2 != 0) {
      *(uint *)((int)param_4 + 2) = *(uint *)((int)param_4 + 2) | 0x200;
    }
    iVar2 = FUN_1000_42f9(param_4,0,(*(uint *)((int)param_4 + 2) & 0x200) != 0,0x200);
    if (iVar2 == 0) {
      *(undefined2 *)((int)param_4 + 0xc) = 0;
      return param_4;
    }
    fclose(param_4);
  }
  return (void *)0x0;
}


// ==== FUN_1000_376b @ 1000:376b (size 43) callers: fopen

uint __cdecl16near FUN_1000_376b(void)

{
  bool bVar1;
  uint uVar2;
  uint uVar3;
  
  uVar2 = 0x8ed0;
  do {
    uVar3 = uVar2;
    if (*(char *)(uVar2 + 4) < '\0') break;
    uVar3 = uVar2 + 0x10;
    bVar1 = uVar2 < DAT_6000_9010 * 0x10 + 0x8ed0U;
    uVar2 = uVar3;
  } while (bVar1);
  if (-1 < *(char *)(uVar3 + 4)) {
    uVar3 = 0;
  }
  return uVar3;
}


// ==== fopen @ 1000:3796 (size 31) callers: load_h_bin,load_world_pic,select_player,game_disk_prompt,check_v_file,load_worldmap_bin,main,save_mon_map,load_mon_map,save_dun,load_dun,load_dung_bin,load_player,save_player,spells_hlp_probe,load_spell_text,show_help,roll_char,load_font  // libc

void * __cdecl16far fopen(char *name,char *mode)

{
  int iVar1;
  void *pvVar2;
  
  iVar1 = FUN_1000_376b();
  if (iVar1 == 0) {
    pvVar2 = (void *)0x0;
  }
  else {
    pvVar2 = (void *)FUN_1000_36cf(0,mode,name,iVar1);
  }
  return pvVar2;
}


// ==== FUN_1000_37b5 @ 1000:37b5 (size 22) callers: FUN_1000_0d04,FUN_1000_10b1

void __cdecl16far FUN_1000_37b5(undefined2 param_1,undefined2 param_2)

{
  FUN_1000_18fe(&stack0x0008,param_2,param_1,(char *)s_SPELLS_BY_USING_MAGIC_6000_407b + 8);
  return;
}


// ==== FUN_1000_37cb @ 1000:37cb (size 215) callers: fread

uint FUN_1000_37cb(int *param_1,uint param_2,undefined1 *param_3)

{
  int *piVar1;
  int iVar2;
  byte *pbVar3;
  uint in_DX;
  uint uVar4;
  uint uVar5;
  
  do {
    while( true ) {
      if (param_2 == 0) {
        return 0;
      }
      uVar4 = param_2 + 1;
      uVar5 = uVar4;
      if ((uint)param_1[3] <= uVar4) {
        uVar5 = param_1[3];
      }
      if (((((param_1[1] & 0x40U) == 0) || (param_1[3] == 0)) || (uVar4 <= (uint)param_1[3])) ||
         (*param_1 != 0)) break;
      uVar4 = 0;
      for (; (uint)param_1[3] <= param_2; param_2 = param_2 - param_1[3]) {
        uVar4 = uVar4 + param_1[3];
      }
      in_DX = FUN_1000_16cd((int)(char)param_1[2],param_3,uVar4);
      param_3 = param_3 + in_DX;
      if (in_DX != uVar4) {
        param_2 = param_2 + (uVar4 - in_DX);
        goto LAB_1000_384a;
      }
    }
    while ((param_2 = uVar4, param_2 = param_2 - 1, param_2 != 0 && (uVar5 = uVar5 - 1, uVar5 != 0))
          ) {
      piVar1 = param_1;
      iVar2 = *piVar1;
      *piVar1 = *piVar1 + -1;
      if (SBORROW2(iVar2,1) == *piVar1 < 0) {
        pbVar3 = (byte *)param_1[5];
        param_1[5] = param_1[5] + 1;
        in_DX = (uint)*pbVar3;
      }
      else {
        in_DX = FUN_1000_3b47(param_1);
      }
      if (in_DX == 0xffff) break;
      *param_3 = (char)in_DX;
      param_3 = param_3 + 1;
      uVar4 = param_2;
    }
  } while (in_DX != 0xffff);
LAB_1000_384a:
  param_1[1] = param_1[1] | 0x20;
  return param_2;
}


// ==== fread @ 1000:38a2 (size 75) callers: load_dung_bin,load_player  // libc

short __cdecl16far fread(void *p,short size,short n,void *f)

{
  int iVar1;
  ulong uVar2;
  
  if (size != 0) {
    uVar2 = lmul32();
    if ((uVar2 < 0x20000) && ((int)(uVar2 >> 0x10) == 0)) {
      iVar1 = FUN_1000_37cb(f,(int)uVar2,p);
      return (uint)((int)uVar2 - iVar1) / (uint)size;
    }
  }
  return 0;
}


// ==== FUN_1000_38ed @ 1000:38ed (size 93) callers: FUN_1000_394a,FUN_1000_39b2

int FUN_1000_38ed(uint *param_1)

{
  char *pcVar1;
  char *pcVar2;
  char *pcVar3;
  int iVar4;
  uint uVar5;
  int iVar6;
  int iVar7;
  int iVar8;
  
  if ((int)*param_1 < 0) {
    iVar4 = param_1[3] + *param_1 + 1;
  }
  else {
    uVar5 = (int)*param_1 >> 0xf;
    iVar4 = (*param_1 ^ uVar5) - uVar5;
  }
  iVar8 = iVar4;
  if ((param_1[1] & 0x40) == 0) {
    pcVar2 = (char *)param_1[5];
    iVar6 = iVar4;
    if ((int)*param_1 < 0) {
      while (iVar6 = iVar4 + -1, iVar4 != 0) {
        pcVar2 = pcVar2 + -1;
        iVar4 = iVar6;
        if (*pcVar2 == '\n') {
          iVar8 = iVar8 + 1;
        }
      }
    }
    else {
      while (iVar7 = iVar6 + -1, iVar8 = iVar4, iVar6 != 0) {
        pcVar3 = pcVar2 + 1;
        pcVar1 = pcVar2;
        pcVar2 = pcVar3;
        iVar6 = iVar7;
        if (*pcVar1 == '\n') {
          iVar4 = iVar4 + 1;
        }
      }
    }
  }
  return iVar8;
}


// ==== FUN_1000_394a @ 1000:394a (size 104) callers: FUN_1000_42f9

undefined2 __cdecl16far FUN_1000_394a(int *param_1,uint param_2,int param_3,int param_4)

{
  int iVar1;
  undefined2 uVar2;
  uint uVar3;
  int in_DX;
  bool bVar4;
  
  iVar1 = FUN_1000_355a(param_1);
  if (iVar1 == 0) {
    if ((param_4 == 1) && (0 < *param_1)) {
      uVar3 = FUN_1000_38ed(param_1);
      in_DX = (int)uVar3 >> 0xf;
      bVar4 = param_2 < uVar3;
      param_2 = param_2 - uVar3;
      param_3 = (param_3 - in_DX) - (uint)bVar4;
    }
    param_1[1] = param_1[1] & 0xfe5f;
    *param_1 = 0;
    param_1[5] = param_1[4];
    iVar1 = FUN_1000_15b3((int)(char)param_1[2],param_2,param_3,param_4);
    if ((in_DX == -1) && (iVar1 == -1)) {
      uVar2 = 0xffff;
    }
    else {
      uVar2 = 0;
    }
  }
  else {
    uVar2 = 0xffff;
  }
  return uVar2;
}


// ==== FUN_1000_39b2 @ 1000:39b2 (size 199) callers: 

int __cdecl16far FUN_1000_39b2(int *param_1)

{
  int iVar1;
  int iVar2;
  int iVar3;
  int local_6;
  
  iVar2 = 0;
  iVar1 = FUN_1000_15b3((int)(char)param_1[2],0,0,1);
  if ((iVar2 == -1) && (iVar1 == -1)) {
    local_6 = -1;
  }
  else if (*param_1 < 0) {
    local_6 = iVar1;
    if ((*(uint *)((char)param_1[2] * 2 + -0x6fee) & 0x800) != 0) {
      iVar3 = 0;
      local_6 = FUN_1000_15b3((int)(char)param_1[2],0,0,2);
      if ((iVar3 == -1) && (local_6 == -1)) {
        return -1;
      }
      iVar1 = FUN_1000_15b3((int)(char)param_1[2],iVar1,iVar2,0);
      if ((iVar3 == -1) && (iVar1 == -1)) {
        return -1;
      }
    }
    iVar1 = FUN_1000_38ed(param_1);
    local_6 = local_6 + iVar1;
  }
  else {
    local_6 = FUN_1000_38ed(param_1);
    local_6 = iVar1 - local_6;
  }
  return local_6;
}


// ==== fwrite @ 1000:3a79 (size 76) callers: save_player  // libc

short __cdecl16far fwrite(void *p,short size,short n,void *f)

{
  uint uVar1;
  ulong uVar2;
  
  if (size != 0) {
    uVar2 = lmul32();
    if ((uVar2 < 0x20000) && ((int)(uVar2 >> 0x10) == 0)) {
      uVar1 = FUN_1000_4083(f,(int)uVar2,p);
      n = uVar1 / (uint)size;
    }
    else {
      n = 0;
    }
  }
  return n;
}


// ==== FUN_1000_3ac5 @ 1000:3ac5 (size 41) callers: FUN_1000_3aee,fgetc

void __cdecl16near FUN_1000_3ac5(void)

{
  int iVar1;
  int iVar2;
  
  iVar1 = -0x7130;
  iVar2 = 0x14;
  while (iVar2 != 0) {
    if ((*(uint *)(iVar1 + 2) & 0x300) == 0x300) {
      FUN_1000_355a(iVar1);
    }
    iVar1 = iVar1 + 0x10;
    iVar2 = iVar2 + -1;
  }
  return;
}


// ==== FUN_1000_3aee @ 1000:3aee (size 89) callers: fgetc

undefined2 FUN_1000_3aee(int *param_1)

{
  int iVar1;
  int iVar2;
  undefined2 uVar3;
  
  if ((param_1[1] & 0x200U) != 0) {
    FUN_1000_3ac5();
  }
  iVar2 = param_1[3];
  iVar1 = param_1[4];
  param_1[5] = iVar1;
  iVar2 = FUN_1000_422b((int)(char)param_1[2],iVar1,iVar2);
  *param_1 = iVar2;
  if (iVar2 < 1) {
    if (*param_1 == 0) {
      param_1[1] = param_1[1] & 0xfe7fU | 0x20;
    }
    else {
      *param_1 = 0;
      param_1[1] = param_1[1] | 0x10;
    }
    uVar3 = 0xffff;
  }
  else {
    param_1[1] = param_1[1] & 0xffdf;
    uVar3 = 0;
  }
  return uVar3;
}


// ==== FUN_1000_3b47 @ 1000:3b47 (size 18) callers: FUN_1000_37cb

void __cdecl16far FUN_1000_3b47(int *param_1)

{
  *param_1 = *param_1 + 1;
  fgetc(param_1);
  return;
}


// ==== fgetc @ 1000:3b5c (size 173) callers: FUN_1000_3b47,load_world_pic,select_player,check_v_file,load_worldmap_bin,load_mon_map,load_dun,load_spell_text,show_help,read_roll_line,load_font  // libc

short __cdecl16far fgetc(void *f)

{
  byte *pbVar1;
  byte bVar2;
  int iVar3;
  
  if (f == (void *)0x0) {
    return -1;
  }
  if (*(int *)f < 1) {
    if (((*(int *)f < 0) || ((*(uint *)((int)f + 2) & 0x110) != 0)) ||
       ((*(uint *)((int)f + 2) & 1) == 0)) {
LAB_1000_3bdc:
      *(uint *)((int)f + 2) = *(uint *)((int)f + 2) | 0x10;
      return -1;
    }
    *(uint *)((int)f + 2) = *(uint *)((int)f + 2) | 0x80;
    if (*(int *)((int)f + 6) == 0) {
      do {
        if ((*(uint *)((int)f + 2) & 0x200) != 0) {
          FUN_1000_3ac5();
        }
        iVar3 = FUN_1000_422b((int)*(char *)((int)f + 4),(undefined1 *)&DAT_6000_d1e8,1);
        if (iVar3 == 0) {
          iVar3 = FUN_1000_3462((int)*(char *)((int)f + 4));
          if (iVar3 == 1) {
            *(uint *)((int)f + 2) = *(uint *)((int)f + 2) & 0xfe7f | 0x20;
            return -1;
          }
          goto LAB_1000_3bdc;
        }
      } while ((DAT_6000_d1e8 == 0xd) && ((*(uint *)((int)f + 2) & 0x40) == 0));
      *(uint *)((int)f + 2) = *(uint *)((int)f + 2) & 0xffdf;
      bVar2 = DAT_6000_d1e8;
      goto LAB_1000_3c06;
    }
    iVar3 = FUN_1000_3aee(f);
    if (iVar3 != 0) {
      return -1;
    }
  }
  *(int *)f = *(int *)f + -1;
  pbVar1 = (byte *)*(undefined2 *)((int)f + 10);
  *(int *)((int)f + 10) = *(int *)((int)f + 10) + 1;
  bVar2 = *pbVar1;
LAB_1000_3c06:
  return (uint)bVar2;
}


// ==== FUN_1000_3c15 @ 1000:3c15 (size 95) callers: FUN_1000_4821

char * __cdecl16far FUN_1000_3c15(char *param_1)

{
  char *pcVar1;
  char *pcVar2;
  uint uVar3;
  int iVar4;
  int iVar5;
  char *pcVar6;
  char *pcVar7;
  bool bVar8;
  undefined2 *local_4;
  
  if (param_1 != (char *)0x0) {
    uVar3 = 0xffff;
    pcVar7 = param_1;
    do {
      if (uVar3 == 0) break;
      uVar3 = uVar3 - 1;
      pcVar1 = pcVar7;
      pcVar7 = pcVar7 + 1;
    } while (*pcVar1 != '\0');
    iVar4 = ~uVar3 - 1;
    if ((iVar4 != 0) && (local_4 = DAT_6000_917e, DAT_6000_917e != (undefined2 *)0x0)) {
      while ((pcVar7 = (char *)*local_4, pcVar7 != (char *)0x0 && (*pcVar7 != '\0'))) {
        if ((*param_1 == *pcVar7) && (pcVar7[iVar4] == '=')) {
          bVar8 = true;
          iVar5 = iVar4;
          pcVar6 = param_1;
          do {
            if (iVar5 == 0) break;
            iVar5 = iVar5 + -1;
            pcVar2 = pcVar7;
            pcVar7 = pcVar7 + 1;
            pcVar1 = pcVar6;
            pcVar6 = pcVar6 + 1;
            bVar8 = *pcVar1 == *pcVar2;
          } while (bVar8);
          if (bVar8) {
            return pcVar7 + 1;
          }
        }
        local_4 = local_4 + 1;
      }
    }
  }
  return (char *)0x0;
}


// ==== itoa @ 1000:3c74 (size 40) callers: load_world_pic,select_player,load_player,save_player,experience_for_level,strike,monster_turn,FUN_2000_7756,FUN_2000_8728,FUN_2000_892d,show_help,FUN_2000_a791,movecontrol,FUN_2000_c30e,FUN_2000_c3d5,cast_spell,FUN_2000_c9d2,FUN_2000_d358,show_roll,roll_char,FUN_3000_9cfb,FUN_3000_c8e6,FUN_3000_cd34,FUN_3000_d51c  // libc

char * __cdecl16far itoa(short v,char *s,short radix)

{
  char *pcVar1;
  int iVar2;
  
  if (radix == 10) {
    iVar2 = v >> 0xf;
  }
  else {
    iVar2 = 0;
  }
  pcVar1 = (char *)FUN_1000_1519(0x61,1,radix,s,v,iVar2);
  return pcVar1;
}


// ==== FUN_1000_3c9c @ 1000:3c9c (size 26) callers: 

void __cdecl16far
FUN_1000_3c9c(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4)

{
  uint in_AX;
  
  FUN_1000_1519(0x61,in_AX & 0xff00,param_4,param_3,param_1,param_2);
  return;
}


// ==== ltoa @ 1000:3cb6 (size 37) callers: bank,FUN_3000_bdb5,FUN_4000_428f,format_two_numbers  // libc (long -> string)

void __cdecl16far
ltoa(undefined2 param_1,undefined2 param_2,undefined2 param_3,int param_4)

{
  FUN_1000_1519(0x61,param_4 == 10,param_4,param_3,param_1,param_2);
  return;
}


// ==== FUN_1000_3cdb @ 1000:3cdb (size 31) callers: FUN_1000_1e50,FUN_1000_4083,FUN_1000_43d1

undefined2 * __cdecl16far FUN_1000_3cdb(undefined2 *param_1,undefined2 *param_2,uint param_3)

{
  undefined2 *puVar1;
  undefined2 *puVar2;
  uint uVar3;
  undefined2 *puVar4;
  
  puVar4 = param_1;
  for (uVar3 = param_3 >> 1; uVar3 != 0; uVar3 = uVar3 - 1) {
    puVar2 = puVar4;
    puVar4 = puVar4 + 1;
    puVar1 = param_2;
    param_2 = param_2 + 1;
    *puVar2 = *puVar1;
  }
  if ((param_3 & 1) != 0) {
    *(undefined1 *)puVar4 = *(undefined1 *)param_2;
  }
  return param_1;
}


// ==== FUN_1000_3cfa @ 1000:3cfa (size 38) callers: FUN_1000_3d20

void __cdecl16far FUN_1000_3cfa(undefined2 *param_1,uint param_2,undefined1 param_3)

{
  undefined2 *puVar1;
  uint uVar2;
  
  if (((uint)param_1 & 1) != 0) {
    if (param_2 == 0) {
      return;
    }
    puVar1 = param_1;
    param_1 = (undefined2 *)((int)param_1 + 1);
    *(undefined1 *)puVar1 = param_3;
    param_2 = param_2 - 1;
  }
  for (uVar2 = param_2 >> 1; uVar2 != 0; uVar2 = uVar2 - 1) {
    puVar1 = param_1;
    param_1 = param_1 + 1;
    *puVar1 = CONCAT11(param_3,param_3);
  }
  if ((param_2 & 1) != 0) {
    *(undefined1 *)param_1 = param_3;
  }
  return;
}


// ==== FUN_1000_3d20 @ 1000:3d20 (size 27) callers: FUN_1000_4821

undefined2 __cdecl16far FUN_1000_3d20(undefined2 param_1,undefined1 param_2,undefined2 param_3)

{
  FUN_1000_3cfa(param_1,param_3,param_2);
  return param_1;
}


// ==== FUN_1000_3d3b @ 1000:3d3b (size 25) callers: FUN_1000_3d66

void FUN_1000_3d3b(void)

{
  code *pcVar1;
  undefined1 in_CF;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  if ((bool)in_CF) {
    FUN_1000_14bd();
  }
  return;
}


// ==== FUN_1000_3d54 @ 1000:3d54 (size 18) callers: FUN_1000_3d66

void FUN_1000_3d54(void)

{
  code *pcVar1;
  
  pcVar1 = (code *)swi(0x21);
  (*pcVar1)();
  return;
}


// ==== FUN_1000_3d66 @ 1000:3d66 (size 344) callers: FUN_1000_36cf

int __cdecl16far FUN_1000_3d66(undefined2 param_1,uint param_2,uint param_3)

{
  byte bVar1;
  int iVar2;
  uint uVar3;
  uint uVar4;
  uint local_4;
  
  if ((param_2 & 0xc000) == 0) {
    param_2 = param_2 | DAT_6000_903a & 0xc000;
  }
  local_4 = FUN_1000_3401(param_1,0);
  if ((param_2 & 0x100) == 0) {
LAB_1000_3e12:
    iVar2 = FUN_1000_3ebe(param_1,param_2);
    if (-1 < iVar2) {
      bVar1 = FUN_1000_2ac7(iVar2,0);
      if ((bVar1 & 0x80) == 0) {
        if ((param_2 & 0x200) != 0) {
          FUN_1000_3d54(iVar2);
        }
      }
      else {
        uVar4 = param_2 | 0x2000;
        uVar3 = param_2 & 0x8000;
        param_2 = uVar4;
        if (uVar3 != 0) {
          FUN_1000_2ac7(iVar2,1,bVar1 | 0x20);
        }
      }
      if ((((local_4 & 1) != 0) && ((param_2 & 0x100) != 0)) && ((param_2 & 0xf0) != 0)) {
        FUN_1000_3401(param_1,1,1);
      }
    }
LAB_1000_3e83:
    if (-1 < iVar2) {
      if ((param_2 & 0x300) == 0) {
        uVar3 = 0;
      }
      else {
        uVar3 = 0x1000;
      }
      if ((local_4 & 1) == 0) {
        uVar4 = 0x100;
      }
      else {
        uVar4 = 0;
      }
      *(uint *)(iVar2 * 2 + -0x6fee) = param_2 & 0xf8ff | uVar3 | uVar4;
    }
  }
  else {
    param_3 = param_3 & DAT_6000_903c;
    if ((param_3 & 0x180) == 0) {
      FUN_1000_14bd(1);
    }
    if (local_4 == 0xffff) {
      iVar2 = DAT_6000_9042;
      if (DAT_6000_9042 == 2) {
        local_4 = (uint)((param_3 & 0x80) == 0);
        if ((param_2 & 0xf0) != 0) {
          iVar2 = FUN_1000_3d3b(0,param_1);
          if (iVar2 < 0) {
            return iVar2;
          }
          FUN_1000_3444(iVar2);
          goto LAB_1000_3e12;
        }
        iVar2 = FUN_1000_3d3b(local_4,param_1);
        if (iVar2 < 0) {
          return iVar2;
        }
        goto LAB_1000_3e83;
      }
    }
    else {
      if ((param_2 & 0x400) == 0) goto LAB_1000_3e12;
      iVar2 = 0x50;
    }
    iVar2 = FUN_1000_14bd(iVar2);
  }
  return iVar2;
}


// ==== FUN_1000_3ebe @ 1000:3ebe (size 77) callers: FUN_1000_3d66

int __cdecl16far FUN_1000_3ebe(undefined2 param_1,uint param_2)

{
  code *pcVar1;
  int iVar2;
  bool bVar3;
  
  bVar3 = false;
  pcVar1 = (code *)swi(0x21);
  iVar2 = (*pcVar1)();
  if (bVar3) {
    iVar2 = FUN_1000_14bd(iVar2);
  }
  else {
    *(uint *)(iVar2 * 2 + -0x6fee) = param_2 & 0xb8ff | 0x8000;
  }
  return iVar2;
}


// ==== FUN_1000_3f0b @ 1000:3f0b (size 23) callers: FUN_2000_036e,load_world_pic

void __cdecl16far FUN_1000_3f0b(undefined2 param_1)

{
  FUN_1000_18fe(&stack0x0006,param_1,0x8ee0,(char *)s_SPELLS_BY_USING_MAGIC_6000_407b + 8);
  return;
}


// ==== FUN_1000_3f22 @ 1000:3f22 (size 25) callers: FUN_1000_4083

void __cdecl16far FUN_1000_3f22(char param_1,int *param_2)

{
  *param_2 = *param_2 + -1;
  fputc((int)param_1,param_2);
  return;
}


// ==== fputc @ 1000:3f3b (size 305) callers: FUN_1000_3f22,FUN_1000_4071,FUN_1000_4083,save_mon_map,save_dun  // libc

short __cdecl16far fputc(short c,void *f)

{
  byte *pbVar1;
  int iVar2;
  
  DAT_6000_d1ea = (byte)c;
  if (*(int *)f < -1) {
    *(int *)f = *(int *)f + 1;
    pbVar1 = (byte *)*(undefined2 *)((int)f + 10);
    *(int *)((int)f + 10) = *(int *)((int)f + 10) + 1;
    *pbVar1 = (byte)c;
    if (((*(uint *)((int)f + 2) & 8) == 0) || ((DAT_6000_d1ea != 10 && (DAT_6000_d1ea != 0xd))))
    goto LAB_1000_4068;
    iVar2 = FUN_1000_355a(f);
joined_r0x00013f7c:
    if (iVar2 == 0) {
LAB_1000_4068:
      return (uint)DAT_6000_d1ea;
    }
  }
  else {
    if (((*(uint *)((int)f + 2) & 0x90) == 0) && ((*(uint *)((int)f + 2) & 2) != 0)) {
      *(uint *)((int)f + 2) = *(uint *)((int)f + 2) | 0x100;
      if (*(int *)((int)f + 6) != 0) {
        if ((*(int *)f != 0) && (iVar2 = FUN_1000_355a(f), iVar2 != 0)) {
          return -1;
        }
        *(int *)f = -*(int *)((int)f + 6);
        pbVar1 = (byte *)*(undefined2 *)((int)f + 10);
        *(int *)((int)f + 10) = *(int *)((int)f + 10) + 1;
        *pbVar1 = DAT_6000_d1ea;
        if (((*(uint *)((int)f + 2) & 8) == 0) || ((DAT_6000_d1ea != 10 && (DAT_6000_d1ea != 0xd))))
        goto LAB_1000_4068;
        iVar2 = FUN_1000_355a(f);
        goto joined_r0x00013f7c;
      }
      if ((*(uint *)(*(char *)((int)f + 4) * 2 + -0x6fee) & 0x800) != 0) {
        FUN_1000_15b3((int)*(char *)((int)f + 4),0,0,2);
      }
      if (((((DAT_6000_d1ea != 10) || ((*(uint *)((int)f + 2) & 0x40) != 0)) ||
           (iVar2 = FUN_1000_4b8f((int)*(char *)((int)f + 4),0x9180,1), iVar2 == 1)) &&
          (iVar2 = FUN_1000_4b8f((int)*(char *)((int)f + 4),(undefined1 *)&DAT_6000_d1ea,1),
          iVar2 == 1)) || ((*(uint *)((int)f + 2) & 0x200) != 0)) goto LAB_1000_4068;
    }
    *(uint *)((int)f + 2) = *(uint *)((int)f + 2) | 0x10;
  }
  return -1;
}


// ==== FUN_1000_4071 @ 1000:4071 (size 18) callers: 

void __cdecl16far FUN_1000_4071(short param_1)

{
  fputc(param_1,(void *)0x8ee0);
  return;
}


// ==== FUN_1000_4083 @ 1000:4083 (size 419) callers: fwrite

/* WARNING: Type propagation algorithm not settling */

uint FUN_1000_4083(int *param_1,uint param_2,byte *param_3)

{
  int *piVar1;
  byte bVar2;
  byte *pbVar3;
  short sVar4;
  int iVar5;
  uint uVar6;
  uint uVar7;
  
  uVar7 = param_2;
  if ((param_1[1] & 8U) == 0) {
    if ((param_1[1] & 0x40U) == 0) {
      if (param_1[3] != 0) {
        do {
          if (param_2 == 0) {
            return uVar7;
          }
          piVar1 = param_1;
          iVar5 = *piVar1;
          *piVar1 = *piVar1 + 1;
          if (SCARRY2(iVar5,1) == *piVar1 < 0) {
            uVar6 = FUN_1000_3f22(*param_3,param_1);
          }
          else {
            pbVar3 = (byte *)param_1[5];
            param_1[5] = param_1[5] + 1;
            bVar2 = *param_3;
            *pbVar3 = bVar2;
            uVar6 = (uint)bVar2;
          }
          param_3 = param_3 + 1;
          param_2 = param_2 - 1;
        } while (uVar6 != 0xffff);
        return 0;
      }
      uVar7 = FUN_1000_4a81((int)(char)param_1[2],param_3,param_2);
    }
    else if (param_1[3] == 0) {
      if ((*(uint *)((char)param_1[2] * 2 + -0x6fee) & 0x800) != 0) {
        FUN_1000_15b3((int)(char)param_1[2],0,0,2);
      }
      uVar7 = FUN_1000_4b8f((int)(char)param_1[2],param_3,param_2);
    }
    else {
      if (param_2 <= (uint)param_1[3]) {
        if (SCARRY2(*param_1,param_2) == (int)(*param_1 + param_2) < 0) {
          if (*param_1 == 0) {
            *param_1 = -1 - param_1[3];
          }
          else {
            iVar5 = FUN_1000_355a(param_1);
            if (iVar5 != 0) {
              return 0;
            }
          }
        }
        FUN_1000_3cdb(param_1[5],param_3,param_2);
        *param_1 = *param_1 + param_2;
        param_1[5] = param_1[5] + param_2;
        return param_2;
      }
      if ((*param_1 != 0) && (iVar5 = FUN_1000_355a(param_1), iVar5 != 0)) {
        return 0;
      }
      if ((*(uint *)((char)param_1[2] * 2 + -0x6fee) & 0x800) != 0) {
        FUN_1000_15b3((int)(char)param_1[2],0,0,2);
      }
      uVar7 = FUN_1000_4b8f((int)(char)param_1[2],param_3,param_2);
    }
    if (uVar7 == param_2) {
      return param_2;
    }
  }
  else {
    do {
      if (param_2 == 0) {
        return uVar7;
      }
      sVar4 = fputc((int)(char)*param_3,param_1);
      param_2 = param_2 - 1;
      param_3 = param_3 + 1;
    } while (sVar4 != -1);
  }
  return 0;
}


// ==== FUN_1000_422b @ 1000:422b (size 206) callers: FUN_1000_3aee,fgetc

int __cdecl16far FUN_1000_422b(uint param_1,char *param_2,int param_3)

{
  uint *puVar1;
  char cVar2;
  char *pcVar3;
  int iVar4;
  char *pcVar5;
  char *pcVar6;
  char *pcVar7;
  undefined2 uVar8;
  char local_5;
  int local_4;
  
  if (param_1 < DAT_6000_9010) {
    if ((param_3 + 1U < 2) || ((*(uint *)(param_1 * 2 + -0x6fee) & 0x200) != 0)) {
      iVar4 = 0;
    }
    else {
      do {
        local_4 = FUN_1000_16cd(param_1,param_2,param_3);
        if (local_4 + 1U < 2) {
          return local_4;
        }
        iVar4 = local_4;
        pcVar6 = param_2;
        pcVar3 = param_2;
        if ((*(uint *)(param_1 * 2 + -0x6fee) & 0x4000) == 0) {
          return local_4;
        }
        do {
          while( true ) {
            pcVar7 = pcVar3;
            cVar2 = *pcVar6;
            pcVar5 = param_2;
            if (cVar2 == '\x1a') {
              FUN_1000_15b3(param_1,-iVar4,-(uint)(iVar4 != 0),1);
              puVar1 = (uint *)(param_1 * 2 + -0x6fee);
              *puVar1 = *puVar1 | 0x200;
              goto LAB_1000_42f0;
            }
            if (cVar2 == '\r') break;
            *pcVar7 = cVar2;
            iVar4 = iVar4 + -1;
            pcVar6 = pcVar6 + 1;
            pcVar3 = pcVar7 + 1;
            if (iVar4 == 0) goto LAB_1000_42c6;
          }
          iVar4 = iVar4 + -1;
          pcVar6 = pcVar6 + 1;
          pcVar3 = pcVar7;
        } while (iVar4 != 0);
        uVar8 = 0x6000;
        FUN_1000_16cd(param_1,&local_5,1);
        *pcVar7 = local_5;
LAB_1000_42c6:
        pcVar7 = pcVar7 + 1;
      } while (pcVar7 == pcVar5);
LAB_1000_42f0:
      iVar4 = (int)pcVar7 - (int)pcVar5;
    }
  }
  else {
    iVar4 = FUN_1000_14bd(6);
  }
  return iVar4;
}


// ==== FUN_1000_42f9 @ 1000:42f9 (size 213) callers: FUN_1000_36cf

undefined2 __cdecl16far FUN_1000_42f9(int *param_1,void *param_2,int param_3,uint param_4)

{
  undefined2 uVar1;
  
  if ((((int *)param_1[7] == param_1) && (param_3 < 3)) && (param_4 < 0x8000)) {
    if ((DAT_6000_9184 == 0) && (param_1 == (int *)0x8ee0)) {
      DAT_6000_9184 = 1;
    }
    else if ((DAT_6000_9182 == 0) && (param_1 == (int *)0x8ed0)) {
      DAT_6000_9182 = 1;
    }
    if (*param_1 != 0) {
      FUN_1000_394a(param_1,0,0,1);
    }
    if ((param_1[1] & 4U) != 0) {
      FUN_1000_2b9d(param_1[4]);
    }
    param_1[1] = param_1[1] & 0xfff3;
    param_1[3] = 0;
    param_1[4] = (int)param_1 + 5;
    param_1[5] = (int)param_1 + 5;
    if ((param_3 != 2) && (param_4 != 0)) {
      DAT_6000_8ec6 = 0x1000;
      DAT_6000_8ec4 = (char *)s_LEFT_IS_EAST__RIGHT_IS_WEST__6000_4bdd + 0x14;
      if (param_2 == (void *)0x0) {
        param_2 = malloc(param_4);
        if (param_2 == (void *)0x0) goto LAB_1000_4315;
        param_1[1] = param_1[1] | 4;
      }
      param_1[5] = (int)param_2;
      param_1[4] = (int)param_2;
      param_1[3] = param_4;
      if (param_3 == 1) {
        param_1[1] = param_1[1] | 8;
      }
    }
    uVar1 = 0;
  }
  else {
LAB_1000_4315:
    uVar1 = 0xffff;
  }
  return uVar1;
}


// ==== FUN_1000_43d1 @ 1000:43d1 (size 40) callers: 

int FUN_1000_43d1(int *param_1,int param_2,undefined2 param_3)

{
  FUN_1000_3cdb(*param_1,param_3,param_2);
  *param_1 = *param_1 + param_2;
  *(undefined1 *)*param_1 = 0;
  return param_2;
}


// ==== FUN_1000_43f9 @ 1000:43f9 (size 29) callers: experience_for_level,FUN_2000_892d,FUN_2000_f853

void __cdecl16far FUN_1000_43f9(undefined1 *param_1,undefined2 param_2)

{
  *param_1 = 0;
  FUN_1000_18fe(&stack0x0008,param_2,&param_1,0x43d1);
  return;
}


// ==== FUN_1000_4416 @ 1000:4416 (size 28) callers: 

void __cdecl16far FUN_1000_4416(undefined1 *param_1,undefined2 param_2,undefined2 param_3)

{
  *param_1 = 0;
  FUN_1000_18fe(param_3,param_2,&param_1,0x43d1);
  return;
}


// ==== strcat @ 1000:4432 (size 57) callers: FUN_1000_15dc,load_world_pic,bank,select_player,FUN_2000_3fcf,check_v_file,experience_for_level,strike,monster_turn,FUN_2000_7756,show_help,FUN_2000_9ed9,FUN_2000_a791,movecontrol,FUN_2000_c30e,FUN_2000_c3d5,cast_spell,FUN_2000_d358,FUN_2000_e94e,FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_bdb5,FUN_3000_cd34,FUN_3000_d51c,FUN_4000_426a,FUN_4000_428f,format_two_numbers  // libc

char * __cdecl16far strcat(char *dst,char *src)

{
  char *pcVar1;
  char *pcVar2;
  int iVar3;
  uint uVar4;
  uint uVar5;
  char *pcVar6;
  char *pcVar7;
  char *pcVar8;
  
  iVar3 = -1;
  pcVar6 = dst;
  do {
    if (iVar3 == 0) break;
    iVar3 = iVar3 + -1;
    pcVar1 = pcVar6;
    pcVar6 = pcVar6 + 1;
  } while (*pcVar1 != '\0');
  uVar4 = 0xffff;
  do {
    if (uVar4 == 0) break;
    uVar4 = uVar4 - 1;
    pcVar1 = src;
    src = src + 1;
  } while (*pcVar1 != '\0');
  uVar4 = ~uVar4;
  pcVar7 = src + -uVar4;
  pcVar8 = pcVar6 + -1;
  if (((uint)pcVar7 & 1) != 0) {
    pcVar1 = pcVar7;
    pcVar7 = pcVar7 + 1;
    pcVar6[-1] = *pcVar1;
    uVar4 = uVar4 - 1;
    pcVar8 = pcVar6;
  }
  for (uVar5 = uVar4 >> 1; uVar5 != 0; uVar5 = uVar5 - 1) {
    pcVar2 = pcVar8;
    pcVar8 = pcVar8 + 2;
    pcVar1 = pcVar7;
    pcVar7 = pcVar7 + 2;
    *(undefined2 *)pcVar2 = *(undefined2 *)pcVar1;
  }
  if ((uVar4 & 1) != 0) {
    *pcVar8 = *pcVar7;
  }
  return dst;
}


// ==== FUN_1000_446b @ 1000:446b (size 54) callers: show_help,FUN_3000_bdb5

char * __cdecl16far FUN_1000_446b(char *param_1,char param_2)

{
  char *pcVar1;
  char cVar2;
  char cVar3;
  
  if (((uint)param_1 & 1) == 0) goto LAB_1000_4485;
  pcVar1 = param_1;
  param_1 = param_1 + 1;
  cVar3 = *pcVar1;
  while (cVar3 != param_2) {
    if (cVar3 == '\0') {
      return (char *)0x0;
    }
LAB_1000_4485:
    pcVar1 = param_1;
    param_1 = param_1 + 2;
    cVar2 = (char)*(undefined2 *)pcVar1;
    if (cVar2 == param_2) goto LAB_1000_449b;
    cVar3 = (char)((uint)*(undefined2 *)pcVar1 >> 8);
    if (cVar2 == '\0') {
      return (char *)0x0;
    }
  }
  param_1 = param_1 + 1;
LAB_1000_449b:
  return param_1 + -2;
}


// ==== FUN_1000_44a1 @ 1000:44a1 (size 47) callers: print_text,print_text_clipped

int __cdecl16far FUN_1000_44a1(char *param_1,char *param_2)

{
  char *pcVar1;
  char *pcVar2;
  uint uVar3;
  char *pcVar4;
  
  uVar3 = 0xffff;
  pcVar4 = param_2;
  do {
    if (uVar3 == 0) break;
    uVar3 = uVar3 - 1;
    pcVar1 = pcVar4;
    pcVar4 = pcVar4 + 1;
  } while (*pcVar1 != '\0');
  uVar3 = ~uVar3;
  do {
    if (uVar3 == 0) break;
    uVar3 = uVar3 - 1;
    pcVar2 = param_2;
    param_2 = param_2 + 1;
    pcVar1 = param_1;
    param_1 = param_1 + 1;
  } while (*pcVar1 == *pcVar2);
  return (uint)(byte)param_1[-1] - (uint)(byte)param_2[-1];
}


// ==== strcpy @ 1000:44d0 (size 34) callers: FUN_1000_4821,FUN_2000_1c86,FUN_2000_20da,FUN_2000_216b,FUN_2000_22ff,financial_statement,bank,select_player,FUN_2000_3fcf,save_mon_map,load_mon_map,save_dun,load_dun,experience_for_level,strike,puffball_stat,monster_turn,FUN_2000_70ef,FUN_2000_726f,FUN_2000_7e4f,FUN_2000_8728,FUN_2000_892d,FUN_2000_9ed9,FUN_2000_a791,cast_spell,FUN_2000_c9d2,FUN_2000_caba,FUN_2000_d358,FUN_2000_e94e,FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_bdb5,FUN_3000_c8e6,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a,FUN_3000_d51c,FUN_4000_4016,FUN_4000_426a,FUN_4000_428f,format_two_numbers  // libc

char * __cdecl16far strcpy(char *dst,char *src)

{
  char *pcVar1;
  char *pcVar2;
  uint uVar3;
  char *pcVar4;
  
  uVar3 = 0xffff;
  pcVar4 = src;
  do {
    if (uVar3 == 0) break;
    uVar3 = uVar3 - 1;
    pcVar1 = pcVar4;
    pcVar4 = pcVar4 + 1;
  } while (*pcVar1 != '\0');
  pcVar4 = dst;
  for (uVar3 = ~uVar3; uVar3 != 0; uVar3 = uVar3 - 1) {
    pcVar2 = pcVar4;
    pcVar4 = pcVar4 + 1;
    pcVar1 = src;
    src = src + 1;
    *pcVar2 = *pcVar1;
  }
  return dst;
}


// ==== strlen @ 1000:44f2 (size 26) callers: FUN_1000_1e50,FUN_1000_4821,FUN_2000_03e7,FUN_2000_1d0b,FUN_2000_216b,FUN_2000_264e,FUN_2000_2697,FUN_2000_2723,select_player,FUN_2000_3fcf,load_spell_text,experience_for_level,strike,monster_turn,FUN_2000_8728,FUN_2000_892d,show_help,FUN_2000_a791,cast_spell,FUN_2000_c9d2,FUN_2000_d358,FUN_2000_e91e,roll_char,FUN_3000_bdb5,FUN_3000_c8e6,FUN_3000_cd34,FUN_3000_d51c,FUN_4000_0699,print_text,print_text_clipped,draw_text_box  // libc

short __cdecl16far strlen(char *s)

{
  char *pcVar1;
  uint uVar2;
  
  uVar2 = 0xffff;
  do {
    if (uVar2 == 0) break;
    uVar2 = uVar2 - 1;
    pcVar1 = s;
    s = s + 1;
  } while (*pcVar1 != '\0');
  return ~uVar2 - 1;
}


// ==== FUN_1000_450c @ 1000:450c (size 44) callers: FUN_1000_4821

char * __cdecl16far FUN_1000_450c(char *param_1,char *param_2,int param_3)

{
  char *pcVar1;
  char *pcVar2;
  int iVar3;
  char *pcVar4;
  
  iVar3 = param_3;
  pcVar4 = param_2;
  do {
    if (iVar3 == 0) break;
    iVar3 = iVar3 + -1;
    pcVar1 = pcVar4;
    pcVar4 = pcVar4 + 1;
  } while (*pcVar1 != '\0');
  pcVar4 = param_1;
  for (param_3 = param_3 - iVar3; param_3 != 0; param_3 = param_3 + -1) {
    pcVar2 = pcVar4;
    pcVar4 = pcVar4 + 1;
    pcVar1 = param_2;
    param_2 = param_2 + 1;
    *pcVar2 = *pcVar1;
  }
  for (; iVar3 != 0; iVar3 = iVar3 + -1) {
    pcVar1 = pcVar4;
    pcVar4 = pcVar4 + 1;
    *pcVar1 = '\0';
  }
  return param_1;
}


// ==== FUN_1000_4538 @ 1000:4538 (size 281) callers: time

char * __cdecl16far FUN_1000_4538(uint *param_1,int param_2)

{
  uint uVar1;
  int iVar2;
  int iVar3;
  int iVar4;
  char *local_6;
  
  FUN_1000_4821();
  iVar4 = DAT_6000_91b0 + -0x5a00;
  uVar1 = *param_1;
  iVar2 = lmul32();
  iVar3 = lmul32();
  local_6 = (char *)(iVar4 + iVar2 + iVar3);
  if ((uVar1 - 0x7bc & 3) != 0) {
    local_6 = (char *)s_IT_HELPS_A_LOT_WHEN_YOU_DIE__6000_5179 + 7 + (int)local_6;
  }
  iVar3 = 0;
  iVar2 = (int)*(char *)((int)param_1 + 3);
  while (0 < iVar2 + -1) {
    iVar3 = iVar3 + *(char *)((int)(undefined2 *)&DAT_6000_9184 + iVar2);
    iVar2 = iVar2 + -1;
  }
  iVar3 = iVar3 + (char)param_1[1] + -1;
  if (('\x02' < *(char *)((int)param_1 + 3)) && ((*param_1 & 3) == 0)) {
    iVar3 = iVar3 + 1;
  }
  if (DAT_6000_91b4 != 0) {
    FUN_1000_49a2(*param_1 - 0x7b2,0,iVar3,*(undefined1 *)(param_2 + 1));
  }
  iVar2 = lmul32();
  iVar3 = lmul32();
  return local_6 + iVar3 + (uint)*(byte *)(param_2 + 3) + iVar2;
}


// ==== FUN_1000_4651 @ 1000:4651 (size 464) callers: FUN_1000_17f3

/* WARNING: Removing unreachable block (ram,0x000147bb) */
/* WARNING: Removing unreachable block (ram,0x00014701) */
/* WARNING: Removing unreachable block (ram,0x0001480f) */

void __cdecl16far FUN_1000_4651(char *param_1,int param_2,uint *param_3,undefined1 *param_4)

{
  char *pcVar1;
  char cVar2;
  long lVar3;
  undefined1 uVar4;
  int iVar5;
  int iVar6;
  undefined2 uVar7;
  undefined4 uVar8;
  char *pcVar9;
  long lVar10;
  undefined2 uVar11;
  
  FUN_1000_4821();
  iVar5 = (int)param_1 - (int)(DAT_6000_91b0 + -0x5a00);
  iVar6 = (param_2 -
          (DAT_6000_91b2 + 0x12ce +
          (uint)((char *)s_ENCHANT_WEAPON_LEVEL_4_6000_59f6 + 9 < DAT_6000_91b0))) -
          (uint)(param_1 < DAT_6000_91b0 + -0x5a00);
  param_4[2] = 0;
  uVar4 = FUN_1000_1334(iVar5,iVar6,0x3c,0);
  param_4[3] = uVar4;
  uVar8 = FUN_1000_1325(iVar5,iVar6,0x3c,0);
  uVar4 = FUN_1000_1334(uVar8,0x3c,0);
  *param_4 = uVar4;
  uVar8 = FUN_1000_1325(uVar8,0x3c,0);
  iVar5 = FUN_1000_1325(uVar8,(char *)s_OF_THIS_GAME_TO_EVERYONE_YOU_KNO_6000_88dd + 0x1b,0);
  *param_3 = iVar5 * 4 + 0x7bc;
  pcVar9 = (char *)FUN_1000_1334(uVar8,(char *)s_OF_THIS_GAME_TO_EVERYONE_YOU_KNO_6000_88dd + 0x1b,0
                                );
  if (0x224f < (long)pcVar9) {
    pcVar1 = (char *)pcVar9 + -0x2250;
    iVar5 = (int)((ulong)pcVar9 >> 0x10) -
            (uint)((char *)pcVar9 < (char *)s_THE_ROOMS_IN_THIS_FINE_HOTEL_6000_2242 + 0xe);
    *param_3 = *param_3 + 1;
    iVar6 = FUN_1000_1325(pcVar1,iVar5,(char *)s_FOR_YOUR_POSSESSIONS__6000_222c + 0xc,0);
    *param_3 = *param_3 + iVar6;
    pcVar9 = (char *)FUN_1000_1334(pcVar1,iVar5,(char *)s_FOR_YOUR_POSSESSIONS__6000_222c + 0xc,0);
  }
  if (DAT_6000_91b4 != 0) {
    uVar11 = 0;
    uVar7 = FUN_1000_1334(pcVar9,0x18,0);
    uVar7 = FUN_1000_1325(pcVar9,0x18,0,uVar7);
    iVar5 = FUN_1000_49a2(*param_3 - 0x7b2,0,uVar7,uVar11);
    if (iVar5 != 0) {
      pcVar9 = pcVar9 + 1;
    }
  }
  uVar4 = FUN_1000_1334(pcVar9,0x18,0);
  param_4[1] = uVar4;
  lVar10 = FUN_1000_1325(pcVar9,0x18,0);
  lVar3 = lVar10 + 1;
  if ((*param_3 & 3) == 0) {
    if (lVar3 < 0x3d) {
      if (lVar3 == 0x3c) {
        *(undefined1 *)((int)param_3 + 3) = 2;
        *(undefined1 *)(param_3 + 1) = 0x1d;
        return;
      }
    }
    else {
      lVar3 = CONCAT22((int)((ulong)lVar3 >> 0x10) - (uint)((int)lVar3 == 0),(int)lVar10);
    }
  }
  *(undefined1 *)((int)param_3 + 3) = 0;
  for (; (int)*(char *)(*(char *)((int)param_3 + 3) + -0x6e7a) < lVar3; lVar3 = lVar3 - (int)cVar2)
  {
    cVar2 = *(char *)(*(char *)((int)param_3 + 3) + -0x6e7a);
    *(char *)((int)param_3 + 3) = *(char *)((int)param_3 + 3) + '\x01';
  }
  *(char *)((int)param_3 + 3) = *(char *)((int)param_3 + 3) + '\x01';
  param_1._0_1_ = (undefined1)lVar3;
  *(undefined1 *)(param_3 + 1) = param_1._0_1_;
  return;
}


// ==== FUN_1000_4821 @ 1000:4821 (size 385) callers: FUN_1000_4538,FUN_1000_4651

void __cdecl16far FUN_1000_4821(void)

{
  char *s;
  uint uVar1;
  int iVar2;
  undefined4 uVar3;
  
  s = (char *)FUN_1000_3c15(0x91b6);
  if ((((((s == (char *)0x0) || (uVar1 = strlen(s), uVar1 < 4)) ||
        ((*(byte *)(*s + -0x723d) & 0xc) == 0)) ||
       (((*(byte *)(s[1] + -0x723d) & 0xc) == 0 || ((*(byte *)(s[2] + -0x723d) & 0xc) == 0)))) ||
      ((s[3] != '-' && ((s[3] != '+' && ((*(byte *)(s[3] + -0x723d) & 2) == 0)))))) ||
     (((*(byte *)(s[3] + -0x723d) & 2) == 0 && ((*(byte *)(s[4] + -0x723d) & 2) == 0)))) {
    DAT_6000_91b4 = 1;
    DAT_6000_91b2 = 0;
    DAT_6000_91b0 = (char *)s_I_CAN_T_FIND_THE_FILE_ROLL_TXT__T_6000_464b + 5;
    strcpy(DAT_6000_91ac,(char *)0x91b9);
    strcpy(DAT_6000_91ae,(char *)0x91bd);
    return;
  }
  FUN_1000_3d20(DAT_6000_91ae,0,4);
  FUN_1000_450c(DAT_6000_91ac,s,3);
  DAT_6000_91ac[3] = '\0';
  FUN_1000_3384(s + 3);
  uVar3 = lmul32();
  DAT_6000_91b2 = (undefined2)((ulong)uVar3 >> 0x10);
  DAT_6000_91b0 = (char *)uVar3;
  DAT_6000_91b4 = 0;
  iVar2 = 3;
  while( true ) {
    if (s[iVar2] == '\0') {
      DAT_6000_91b4 = 0;
      return;
    }
    if ((*(byte *)(s[iVar2] + -0x723d) & 0xc) != 0) break;
    iVar2 = iVar2 + 1;
  }
  uVar1 = strlen(s + iVar2);
  if (uVar1 < 3) {
    return;
  }
  if ((*(byte *)(s[iVar2 + 1] + -0x723d) & 0xc) == 0) {
    return;
  }
  if ((*(byte *)(s[iVar2 + 2] + -0x723d) & 0xc) == 0) {
    return;
  }
  FUN_1000_450c(DAT_6000_91ae,s + iVar2,3);
  DAT_6000_91ae[3] = '\0';
  DAT_6000_91b4 = 1;
  return;
}


// ==== FUN_1000_49a2 @ 1000:49a2 (size 223) callers: FUN_1000_4538,FUN_1000_4651

undefined2 FUN_1000_49a2(int param_1,uint param_2,uint param_3,byte param_4)

{
  int iVar1;
  uint uVar2;
  
  if (param_2 == 0) {
    uVar2 = param_3;
    if ((0x3a < param_3) && ((param_1 + 0x46U & 3) == 0)) {
      uVar2 = param_3 - 1;
    }
    param_2 = 0;
    while (*(uint *)(param_2 * 2 + -0x6e6e) <= uVar2) {
      param_2 = param_2 + 1;
    }
  }
  else {
    param_3 = param_3 + *(int *)((param_2 - 1) * 2 + -0x6e6e);
    if ((3 < param_2) && ((param_1 + 0x46U & 3) == 0)) {
      param_3 = param_3 + 1;
    }
  }
  if (3 < param_2) {
    if (param_2 != 4) {
      if (10 < param_2) {
        return 0;
      }
      if (param_2 != 10) {
        return 1;
      }
    }
    if ((param_1 < 0x11) || (param_2 != 4)) {
      iVar1 = *(int *)(param_2 * 2 + -0x6e6e);
    }
    else {
      iVar1 = iRam00069198 + 7;
    }
    if ((param_1 + 0x7b2U & 3) != 0) {
      iVar1 = iVar1 + -1;
    }
    uVar2 = iVar1 - (param_1 * 0x16d + (param_1 + 1 >> 2) + iVar1 + 4U) % 7;
    if (param_2 == 4) {
      if ((uVar2 < param_3) || ((param_3 == uVar2 && (1 < param_4)))) {
        return 1;
      }
    }
    else {
      if (param_3 < uVar2) {
        return 1;
      }
      if ((param_3 == uVar2) && (param_4 < 2)) {
        return 1;
      }
    }
  }
  return 0;
}


// ==== FUN_1000_4a81 @ 1000:4a81 (size 270) callers: FUN_1000_355a,FUN_1000_4083

int __cdecl16far FUN_1000_4a81(uint param_1,char *param_2,int param_3)

{
  uint *puVar1;
  char *pcVar2;
  int iVar3;
  int iVar4;
  char *pcVar5;
  char local_8a [130];
  char *local_8;
  char local_5;
  int local_4;
  
  if (param_1 < DAT_6000_9010) {
    if (param_3 + 1U < 2) {
      iVar3 = 0;
    }
    else {
      if ((*(uint *)(param_1 * 2 + -0x6fee) & 0x800) != 0) {
        FUN_1000_15b3(param_1,0,0,2);
      }
      if ((*(uint *)(param_1 * 2 + -0x6fee) & 0x4000) == 0) {
        iVar3 = FUN_1000_4b8f(param_1,param_2,param_3);
      }
      else {
        puVar1 = (uint *)(param_1 * 2 + -0x6fee);
        *puVar1 = *puVar1 & 0xfdff;
        local_8 = param_2;
        local_4 = param_3;
        do {
          pcVar5 = local_8a;
          do {
            if (local_4 == 0) {
              iVar3 = (int)pcVar5 - (int)local_8a;
              if (iVar3 == 0) {
                return param_3;
              }
              iVar4 = FUN_1000_4b8f(param_1,local_8a,iVar3);
              if (iVar4 == iVar3) {
                return param_3;
              }
              if (iVar4 == -1) goto LAB_1000_4b40;
              goto LAB_1000_4b80;
            }
            local_4 = local_4 + -1;
            pcVar2 = local_8 + 1;
            local_5 = *local_8;
            local_8 = pcVar2;
            if (local_5 == '\n') {
              *pcVar5 = '\r';
              pcVar5 = pcVar5 + 1;
            }
            *pcVar5 = local_5;
            pcVar5 = pcVar5 + 1;
          } while ((int)pcVar5 - (int)local_8a < 0x80);
          iVar3 = (int)pcVar5 - (int)local_8a;
          iVar4 = FUN_1000_4b8f(param_1,local_8a,iVar3);
        } while (iVar4 == iVar3);
        if (iVar4 == -1) {
LAB_1000_4b40:
          iVar3 = -1;
        }
        else {
          param_3 = param_3 - local_4;
LAB_1000_4b80:
          iVar3 = (param_3 + iVar4) - iVar3;
        }
      }
    }
  }
  else {
    iVar3 = FUN_1000_14bd(6);
  }
  return iVar3;
}


// ==== FUN_1000_4b8f @ 1000:4b8f (size 58) callers: FUN_1000_4083,FUN_1000_4a81,fputc

undefined2 __cdecl16far FUN_1000_4b8f(int param_1)

{
  uint *puVar1;
  code *pcVar2;
  bool bVar3;
  undefined2 uVar4;
  
  bVar3 = false;
  if ((*(uint *)(param_1 * 2 + -0x6fee) & 1) == 0) {
    pcVar2 = (code *)swi(0x21);
    uVar4 = (*pcVar2)();
    if (!bVar3) {
      puVar1 = (uint *)(param_1 * 2 + -0x6fee);
      *puVar1 = *puVar1 | 0x1000;
      return uVar4;
    }
  }
  else {
    uVar4 = 5;
  }
  uVar4 = FUN_1000_14bd(uVar4);
  return uVar4;
}


// ==== FUN_2000_0004 @ 2000:0004 (size 98) callers: FUN_2000_037f,FUN_2000_03a5

undefined2 __cdecl16far FUN_2000_0004(void)

{
  int iVar1;
  int in_DX;
  undefined2 local_12 [2];
  undefined2 local_e;
  undefined2 local_c;
  int local_6;
  
  iVar1 = FUN_1000_1305(0x7f);
  if (iVar1 == 0 && in_DX == 0) {
    return 0;
  }
  local_12[0] = 0x105;
  FUN_1000_2a03(0x7f,local_12,local_12);
  if (local_6 != 0) {
    return 0;
  }
  DAT_6000_00aa._2_2_ = local_e;
  DAT_6000_00aa._0_2_ = local_c;
  return local_c;
}


// ==== FUN_2000_006a @ 2000:006a (size 39) callers: FUN_4000_1cbd

void __cdecl16far FUN_2000_006a(undefined1 param_1)

{
  undefined2 *puVar1;
  undefined1 local_6 [2];
  undefined1 local_4;
  undefined1 local_3;
  
  local_4 = param_1;
  local_3 = 5;
  puVar1 = (undefined2 *)((int)DAT_6000_00aa + 0x24);
  (*(code *)*puVar1)(0x2000,local_6);
  return;
}


// ==== FUN_2000_0091 @ 2000:0091 (size 41) callers: FUN_2000_00ba,FUN_2000_01af

void __cdecl16far FUN_2000_0091(byte param_1)

{
  undefined2 *puVar1;
  undefined2 local_8;
  uint local_6;
  undefined2 local_4;
  
  local_8 = 4;
  local_6 = (uint)param_1;
  local_4 = 0;
  puVar1 = (undefined2 *)((int)DAT_6000_00aa + 0x1c);
  (*(code *)*puVar1)(0x2000,&local_8);
  return;
}


// ==== FUN_2000_00ba @ 2000:00ba (size 136) callers: FUN_2000_0142

void __cdecl16far
FUN_2000_00ba(int param_1,int param_2,uint param_3,uint param_4,undefined1 param_5)

{
  int iVar1;
  undefined2 local_c;
  int local_a;
  int local_8;
  uint local_6;
  uint local_4;
  
  if (param_1 < 0) {
    param_1 = 0;
  }
  if (param_2 < 0) {
    param_2 = 0;
  }
  if ((DAT_6000_cd9c <= (int)param_4 >> 0xf) &&
     ((DAT_6000_cd9c < (int)param_4 >> 0xf || (DAT_6000_cd9a < param_4)))) {
    param_4 = DAT_6000_cd9a;
  }
  iVar1 = DAT_6000_cd98 + (uint)(0xfffe < DAT_6000_cd96);
  if ((iVar1 <= (int)param_3 >> 0xf) &&
     ((iVar1 < (int)param_3 >> 0xf || (DAT_6000_cd96 + 1 < param_3)))) {
    param_3 = DAT_6000_cd96;
  }
  FUN_2000_0091(param_5);
  local_c = 8;
  local_6 = param_3;
  local_4 = param_4;
  local_a = param_1;
  local_8 = param_2;
  (*(code *)*(undefined2 *)DAT_6000_00aa)(0x2000,&local_c);
  return;
}


// ==== FUN_2000_0142 @ 2000:0142 (size 33) callers: 

void __cdecl16far FUN_2000_0142(int param_1,undefined2 param_2,undefined1 param_3)

{
  FUN_2000_00ba(param_1,param_2,param_1 + 1,param_2,param_3);
  return;
}


// ==== FUN_2000_0163 @ 2000:0163 (size 41) callers: FUN_2000_01af

void __cdecl16far FUN_2000_0163(byte param_1)

{
  undefined2 *puVar1;
  undefined2 local_8;
  uint local_6;
  undefined2 local_4;
  
  local_8 = 4;
  local_6 = (uint)param_1;
  local_4 = 0;
  puVar1 = (undefined2 *)((int)DAT_6000_00aa + 0x28);
  (*(code *)*puVar1)(0x2000,&local_8);
  return;
}


// ==== FUN_2000_018c @ 2000:018c (size 35) callers: FUN_2000_01af

void __cdecl16far FUN_2000_018c(undefined1 param_1,undefined1 param_2)

{
  undefined2 *puVar1;
  undefined1 local_6 [2];
  undefined1 local_4;
  undefined1 local_3;
  
  local_4 = param_1;
  local_3 = param_2;
  puVar1 = (undefined2 *)((int)DAT_6000_00aa + 0x24);
  (*(code *)*puVar1)(0x2000,local_6);
  return;
}


// ==== FUN_2000_01af @ 2000:01af (size 38) callers: FUN_2000_01d5

void __cdecl16far FUN_2000_01af(void)

{
  byte extraout_AH;
  undefined1 extraout_AH_00;
  
  FUN_2000_0091(7);
  FUN_2000_0163((uint)extraout_AH << 8);
  FUN_2000_018c(CONCAT11(extraout_AH_00,2),CONCAT11(extraout_AH_00,5));
  return;
}


// ==== FUN_2000_01d5 @ 2000:01d5 (size 146) callers: FUN_2000_037f,FUN_2000_03a5

char __cdecl16far FUN_2000_01d5(undefined1 param_1)

{
  undefined2 *puVar1;
  
  puVar1 = (undefined2 *)((int)DAT_6000_00aa + 0x7c);
  (*(code *)*puVar1)(0x2000,0xae,0x6000);
  DAT_6000_9208 = malloc(DAT_6000_00b0 + 0xf);
  if (DAT_6000_9208 == (void *)0x0) {
    return '\x01';
  }
  DAT_6000_920c = 0x6000;
  DAT_6000_00bd = ((int)DAT_6000_9208 + 0xfU >> 4) + 0x6000;
  DAT_6000_00b8 = 0;
  DAT_6000_00b9 = param_1;
  puVar1 = (undefined2 *)((int)DAT_6000_00aa + 0x20);
  DAT_6000_920a = DAT_6000_9208;
  (*(code *)*puVar1)(0x1000,0xb6,0x6000);
  if (DAT_6000_00ba != '\0') {
    FUN_1000_2b9d(DAT_6000_9208);
    return DAT_6000_00ba;
  }
  puVar1 = (undefined2 *)((int)DAT_6000_00aa + 0xc0);
  (*(code *)*puVar1)(0x1000,0xbb,0x6000);
  FUN_2000_01af();
  return DAT_6000_00ba;
}


// ==== FUN_2000_0269 @ 2000:0269 (size 104) callers: FUN_4000_100f,FUN_4000_2e29

void __cdecl16far FUN_2000_0269(int param_1)

{
  undefined2 *puVar1;
  int iVar2;
  
  DAT_6000_920e = 0x300;
  for (iVar2 = 0; iVar2 < 0x100; iVar2 = iVar2 + 1) {
    ((undefined1 *)&DAT_6000_9211)[iVar2 * 3] = *(undefined1 *)(iVar2 * 3 + param_1);
    ((undefined1 *)&DAT_6000_9212)[iVar2 * 3] = *(undefined1 *)(iVar2 * 3 + param_1 + 1);
    ((undefined1 *)&DAT_6000_9213)[iVar2 * 3] = *(undefined1 *)(iVar2 * 3 + param_1 + 2);
  }
  DAT_6000_9210 = 0xff;
  puVar1 = (undefined2 *)((int)DAT_6000_00aa + 0xe8);
  (*(code *)*puVar1)(0x2000,(undefined2 *)&DAT_6000_920e,0x6000);
  return;
}


// ==== FUN_2000_02d1 @ 2000:02d1 (size 119) callers: 

void __cdecl16far FUN_2000_02d1(int param_1,int param_2,int param_3)

{
  undefined2 *puVar1;
  int iVar2;
  
  param_3 = param_3 + param_1 * -3;
  DAT_6000_920e = 0x300;
  for (iVar2 = param_1; iVar2 < param_1 + param_2; iVar2 = iVar2 + 1) {
    ((undefined1 *)&DAT_6000_9211)[iVar2 * 3] = *(undefined1 *)(iVar2 * 3 + param_3);
    ((undefined1 *)&DAT_6000_9212)[iVar2 * 3] = *(undefined1 *)(iVar2 * 3 + param_3 + 1);
    ((undefined1 *)&DAT_6000_9213)[iVar2 * 3] = *(undefined1 *)(iVar2 * 3 + param_3 + 2);
  }
  DAT_6000_9210 = 0xff;
  puVar1 = (undefined2 *)((int)DAT_6000_00aa + 0xe8);
  (*(code *)*puVar1)(0x2000,(undefined2 *)&DAT_6000_920e,0x6000);
  return;
}


// ==== FUN_2000_0348 @ 2000:0348 (size 38) callers: FUN_2000_1ac1

void __cdecl16far FUN_2000_0348(void)

{
  undefined2 *puVar1;
  
  puVar1 = (undefined2 *)((int)DAT_6000_00aa + 0x88);
  (*(code *)*puVar1)(0x2000,0xbf,0x6000);
  if (DAT_6000_9208 != 0) {
    FUN_1000_2b9d(DAT_6000_9208);
  }
  return;
}


// ==== FUN_2000_036e @ 2000:036e (size 17) callers: FUN_2000_037f,FUN_2000_03a5

void __cdecl16far FUN_2000_036e(void)

{
  FUN_1000_3f0b((char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f);
  return;
}


// ==== FUN_2000_037f @ 2000:037f (size 38) callers: FUN_2000_1485

void __cdecl16far FUN_2000_037f(void)

{
  char cVar1;
  byte extraout_AH;
  
  FUN_2000_0004();
  cVar1 = FUN_2000_01d5((uint)extraout_AH << 8);
  if (cVar1 != '\0') {
    FUN_2000_036e();
    FUN_1000_128d(0);
  }
  return;
}


// ==== FUN_2000_03a5 @ 2000:03a5 (size 38) callers: FUN_2000_1485

void __cdecl16far FUN_2000_03a5(void)

{
  char cVar1;
  undefined1 extraout_AH;
  
  FUN_2000_0004();
  cVar1 = FUN_2000_01d5(CONCAT11(extraout_AH,1));
  if (cVar1 != '\0') {
    FUN_2000_036e();
    FUN_1000_128d(0);
  }
  return;
}


// ==== quit @ 2000:03cb (size 28) callers: load_world_pic,FUN_2000_2b73,select_player,game_disk_prompt,roll_char,FUN_3000_8235  // back to text mode and exit

void __cdecl16far quit(void)

{
  FUN_4000_0f0d(3);
  FUN_1000_128d(0);
  return;
}


// ==== FUN_2000_03e7 @ 2000:03e7 (size 77) callers: 

void __cdecl16far
FUN_2000_03e7(undefined2 param_1,undefined2 param_2,undefined2 param_3,char *param_4,
             undefined2 param_5)

{
  uint uVar1;
  uint uVar2;
  
  uVar1 = strlen(param_4);
  for (uVar2 = 0; uVar2 < uVar1; uVar2 = uVar2 + 1) {
    if (param_4[uVar2] != ' ') {
      param_4[uVar2] = param_4[uVar2] + '\x01';
    }
  }
  print_text(param_1,param_2,param_3,param_4,param_5);
  return;
}


// ==== FUN_2000_0434 @ 2000:0434 (size 51) callers: 

void __cdecl16far FUN_2000_0434(void)

{
  undefined1 local_12;
  undefined1 local_11;
  undefined1 local_10;
  undefined1 local_f;
  undefined2 local_e;
  
  local_11 = 9;
  local_12 = 0x20;
  local_10 = 0;
  local_f = 0;
  local_e = 0x7d1;
  FUN_1000_2a03(0x10,&local_12,&local_12);
  return;
}


// ==== FUN_2000_0467 @ 2000:0467 (size 135) callers: FUN_2000_04ee

void __cdecl16far
FUN_2000_0467(int param_1,int param_2,int param_3,int param_4,undefined1 param_5,uint param_6)

{
  undefined2 in_AX;
  undefined1 extraout_AH;
  undefined1 extraout_AH_00;
  undefined1 extraout_AH_01;
  undefined1 uVar1;
  
  uVar1 = (undefined1)((uint)in_AX >> 8);
  if ((param_6 & 8) != 0) {
    (*DAT_6000_9632)(0x2000,param_3 + param_1,param_4 + param_2,CONCAT11(uVar1,param_5));
    uVar1 = extraout_AH;
  }
  if ((param_6 & 2) != 0) {
    (*DAT_6000_9632)(0x2000,param_3 - param_1,param_4 + param_2,CONCAT11(uVar1,param_5));
    uVar1 = extraout_AH_00;
  }
  if ((param_6 & 4) != 0) {
    (*DAT_6000_9632)(0x2000,param_3 + param_1,param_4 - param_2,CONCAT11(uVar1,param_5));
    uVar1 = extraout_AH_01;
  }
  if ((param_6 & 1) != 0) {
    (*DAT_6000_9632)(0x2000,param_3 - param_1,param_4 - param_2,CONCAT11(uVar1,param_5));
  }
  return;
}


// ==== FUN_2000_04ee @ 2000:04ee (size 497) callers: FUN_2000_073f,FUN_2000_07ff

/* WARNING: Removing unreachable block (ram,0x00020627) */
/* WARNING: Removing unreachable block (ram,0x000205dc) */

void __cdecl16far
FUN_2000_04ee(undefined2 param_1,undefined2 param_2,int param_3,int param_4,char param_5,
             char param_6)

{
  int iVar1;
  uint uVar2;
  uint uVar3;
  uint uVar4;
  uint uVar5;
  undefined2 uVar6;
  int iVar7;
  bool bVar8;
  long b;
  long lVar9;
  long lVar10;
  long lVar11;
  long b_00;
  undefined2 uVar12;
  long b_01;
  uint local_26;
  int local_24;
  uint local_22;
  int local_20;
  
  iVar7 = 0;
  b = N_LXMUL((long)param_3,(long)param_3);
  iVar1 = (int)b;
  uVar4 = iVar1 * 2;
  uVar2 = (int)((ulong)b >> 0x10) << 1 | (uint)(iVar1 < 0);
  lVar9 = N_LXMUL((long)param_4,(long)param_4);
  uVar5 = (int)lVar9 * 2;
  uVar3 = (int)((ulong)lVar9 >> 0x10) << 1 | (uint)((int)lVar9 < 0);
  lVar10 = N_LXMUL((long)param_4,b);
  uVar6 = (undefined2)((ulong)(lVar9 - lVar10) >> 0x10);
  uVar12 = (undefined2)(lVar9 - lVar10);
  lVar10 = F_LDIV(b,4);
  lVar10 = lVar10 + CONCAT22(uVar6,uVar12);
  local_20 = 0;
  local_22 = 0;
  lVar11 = N_LXMUL((long)param_4,CONCAT22(uVar2,uVar4));
  while( true ) {
    local_24 = (int)((ulong)lVar11 >> 0x10);
    local_26 = (uint)lVar11;
    if (lVar11 <= CONCAT22(local_20,local_22)) break;
    FUN_2000_0467(iVar7,param_4,param_1,param_2,(int)param_5);
    if (0 < lVar10) {
      param_4 = param_4 + -1;
      lVar11 = CONCAT22((local_24 - uVar2) - (uint)(local_26 < uVar4),local_26 + iVar1 * -2);
      lVar10 = lVar10 - lVar11;
    }
    iVar7 = iVar7 + 1;
    bVar8 = CARRY2(local_22,uVar5);
    local_22 = local_22 + uVar5;
    local_20 = local_20 + uVar3 + (uint)bVar8;
    lVar10 = lVar10 + lVar9 + CONCAT22(local_20,local_22);
  }
  b_01 = 2;
  b_00 = 2;
  lVar9 = N_LXMUL(3,b - lVar9);
  lVar9 = F_LDIV(lVar9,b_00);
  lVar9 = F_LDIV(lVar9 - (lVar11 + CONCAT22(local_20,local_22)),b_01);
  lVar9 = lVar9 + lVar10;
  while( true ) {
    local_24 = (int)((ulong)lVar11 >> 0x10);
    local_26 = (uint)lVar11;
    if (param_4 < 0) break;
    FUN_2000_0467(iVar7,param_4,param_1,param_2,(int)param_5,(int)param_6);
    if ((lVar9 < 0x10000) && (lVar9 < 0)) {
      iVar7 = iVar7 + 1;
      bVar8 = CARRY2(local_22,uVar5);
      local_22 = local_22 + uVar5;
      local_20 = local_20 + uVar3 + (uint)bVar8;
      lVar9 = lVar9 + CONCAT22(local_20,local_22);
    }
    param_4 = param_4 + -1;
    lVar11 = lVar11 - CONCAT22(uVar2,uVar4);
    lVar9 = lVar9 + (b - CONCAT22((local_24 - uVar2) - (uint)(local_26 < uVar4),
                                  local_26 + iVar1 * -2));
  }
  return;
}


// ==== FUN_2000_06df @ 2000:06df (size 96) callers: 

void __cdecl16far
FUN_2000_06df(undefined2 param_1,int param_2,undefined2 param_3,int param_4,char param_5)

{
  undefined2 in_AX;
  undefined1 uVar1;
  
  uVar1 = (undefined1)((uint)in_AX >> 8);
  if ('\0' < param_5) {
    param_5 = '\x01';
  }
  if (((DAT_6000_00c7 == 1) && (param_2 == param_4)) && (param_5 == '\x01')) {
    uVar1 = (undefined1)((uint)(param_2 / 2) >> 8);
    if (param_2 % 2 == 1) {
      FUN_5000_09c9(param_1,param_2,param_3,param_4,param_2 / 2 & 0xff00);
      return;
    }
  }
  FUN_5000_09c9(param_1,param_2,param_3,param_4,CONCAT11(uVar1,param_5));
  return;
}


// ==== FUN_2000_073f @ 2000:073f (size 42) callers: 

void __cdecl16far
FUN_2000_073f(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             char param_5,undefined1 param_6)

{
  if ('\0' < param_5) {
    param_5 = '\x01';
  }
  FUN_2000_04ee(param_1,param_2,param_3,param_4,param_5,param_6);
  return;
}


// ==== FUN_2000_0769 @ 2000:0769 (size 106) callers: FUN_2000_0769

void __cdecl16far
FUN_2000_0769(undefined2 param_1,int param_2,undefined2 param_3,int param_4,char param_5)

{
  undefined2 in_AX;
  undefined1 uVar1;
  
  uVar1 = (undefined1)((uint)in_AX >> 8);
  if ('\0' < param_5) {
    uVar1 = (undefined1)((uint)((int)param_5 / 3) >> 8);
    param_5 = param_5 % '\x03' + '\x01';
  }
  if (((DAT_6000_00c7 == 1) && (param_2 == param_4)) && ('\0' < param_5)) {
    uVar1 = (undefined1)((uint)(param_2 / 2) >> 8);
    if (param_2 % 2 == 1) {
      FUN_2000_0769(param_1,param_2,param_3,param_4,param_2 / 2 & 0xff00);
      return;
    }
  }
  FUN_5000_07f3(param_1,param_2,param_3,param_4,CONCAT11(uVar1,param_5));
  return;
}


// ==== FUN_2000_07d3 @ 2000:07d3 (size 44) callers: 

void __cdecl16far FUN_2000_07d3(undefined2 param_1,undefined2 param_2,char param_3)

{
  undefined2 in_AX;
  undefined1 uVar1;
  
  uVar1 = (undefined1)((uint)in_AX >> 8);
  if ('\0' < param_3) {
    uVar1 = (undefined1)((uint)((int)param_3 / 3) >> 8);
    param_3 = param_3 % '\x03' + '\x01';
  }
  FUN_5000_0986(param_1,param_2,CONCAT11(uVar1,param_3));
  return;
}


// ==== FUN_2000_07ff @ 2000:07ff (size 56) callers: 

void __cdecl16far
FUN_2000_07ff(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             char param_5,undefined1 param_6)

{
  undefined2 in_AX;
  undefined1 uVar1;
  
  uVar1 = (undefined1)((uint)in_AX >> 8);
  if ('\0' < param_5) {
    uVar1 = (undefined1)((uint)((param_5 + 2) / 3) >> 8);
    param_5 = (char)((param_5 + 2) % 3) + '\x01';
  }
  FUN_2000_04ee(param_1,param_2,param_3,param_4,CONCAT11(uVar1,param_5),CONCAT11(uVar1,param_6));
  return;
}


// ==== FUN_2000_0837 @ 2000:0837 (size 227) callers: 

void __cdecl16far FUN_2000_0837(int param_1,int param_2,int param_3,int param_4,undefined1 param_5)

{
  undefined2 uVar1;
  undefined1 extraout_AH;
  undefined1 extraout_AH_00;
  long lVar2;
  
  if (((param_2 < 0x200) && (param_4 < 0x200)) || ((0x1ff < param_2 && (0x1ff < param_4)))) {
    FUN_5000_01da(param_1,param_2,param_3,param_4,param_5);
  }
  else {
    lVar2 = N_LXMUL((long)(param_3 - param_1),(long)(0x200 - param_2));
    lVar2 = F_LDIV(lVar2,(long)(param_4 - param_2));
    uVar1 = (undefined2)(lVar2 + param_1);
    if (param_2 < param_4) {
      FUN_5000_01da(param_1,param_2,uVar1,0x1ff,param_5);
      FUN_5000_01da(uVar1,0x200,param_3,param_4,CONCAT11(extraout_AH,param_5));
    }
    else {
      FUN_5000_01da(param_1,param_2,uVar1,0x200,param_5);
      FUN_5000_01da(uVar1,0x1ff,param_3,param_4,CONCAT11(extraout_AH_00,param_5));
    }
  }
  return;
}


// ==== FUN_2000_091a @ 2000:091a (size 445) callers: FUN_2000_0ed9
// recovered from the protected-mode build (build_pm.py)

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_2000_091a(int param_1,uint param_2,uint param_3,undefined1 param_4)

{
  undefined2 *puVar1;
  byte bVar2;
  undefined2 *puVar3;
  uint uVar4;
  int iVar5;
  char local_6;
  
  iVar5 = (int)(param_1 + param_3) >> 0xf;
  if ((DAT_6000_cd98 <= iVar5) && ((DAT_6000_cd98 < iVar5 || (DAT_6000_cd96 < param_1 + param_3))))
  {
    param_3 = (DAT_6000_cd96 - param_1) + 1;
  }
  if (param_2 >> 6 != DAT_6000_7f7e) {
    if (DAT_6000_9636 == 0) {
      out(0x3cd,(char)(param_2 >> 6) + (char)(param_2 >> 6) * '\x10');
    }
    if (DAT_6000_9636 == 1) {
      out(0x3c4,0xe);
      bVar2 = in(0x3c5);
      out(0x3c5,(bVar2 & 0xf0) + (char)(param_2 >> 6) ^ 2);
    }
    if (DAT_6000_9636 == 2) {
      out(0x3ce,(param_2 >> 6) * 0x1100 + 0xd);
    }
    if (DAT_6000_9636 == 3) {
      out(_DAT_c000_0010,0xb2);
      bVar2 = in(_DAT_c000_0010 + 1);
      out(_DAT_c000_0010,(bVar2 & 0xe1 | (param_2 >> 6) << 1) * 0x100 + 0xb2);
    }
    if ((DAT_6000_9636 == 4) || (DAT_6000_9636 == 5)) {
      out(0x3d4,0x38);
      out(0x3d5,0x48);
      out(0x3d4,0x31);
      bVar2 = in(0x3d5);
      out(0x3d4,0x31);
      out(0x3d5,bVar2 | 1);
      out(0x3d4,0x35);
      bVar2 = in(0x3d5);
      out(0x3d4,0x35);
      local_6 = (char)((int)(uint)bVar2 >> 4);
      out(0x3d5,(char)(param_2 >> 6) + local_6 * '\x10');
    }
    if ((DAT_6000_9636 == 6) || (DAT_6000_9636 == 7)) {
      out(0x3ce,(param_2 >> 6) * 0x1000 + 9);
    }
    DAT_6000_7f7e = param_2 >> 6;
  }
  puVar3 = (undefined2 *)(param_2 * 0x400 + param_1);
  uVar4 = param_3 >> 1;
  if ((param_3 & 1) != 0) {
    *(undefined1 *)puVar3 = param_4;
    puVar3 = (undefined2 *)((int)puVar3 + 1);
  }
  for (; uVar4 != 0; uVar4 = uVar4 - 1) {
    puVar1 = puVar3;
    puVar3 = puVar3 + 1;
    *puVar1 = CONCAT11(param_4,param_4);
  }
  return;
}


// ==== FUN_2000_0ad7 @ 2000:0ad7 (size 448) callers: FUN_3000_1a08
// recovered from the protected-mode build (build_pm.py)

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_2000_0ad7(int param_1,int param_2,uint param_3,undefined2 param_4)

{
  undefined2 *puVar1;
  byte bVar2;
  int iVar3;
  uint uVar4;
  undefined2 *puVar5;
  char local_6;
  
  if (param_1 < 0) {
    param_1 = 0;
  }
  if (0x3ff < (int)(param_1 + param_3)) {
    param_3 = 0x3ff - param_1;
  }
  iVar3 = param_2 >> 6;
  if (iVar3 != DAT_6000_7f7e) {
    if (DAT_6000_9636 == 0) {
      out(0x3cd,(char)iVar3 * '\x11');
    }
    if (DAT_6000_9636 == 1) {
      out(0x3c4,0xe);
      bVar2 = in(0x3c5);
      out(0x3c5,(bVar2 & 0xf0) + (char)(param_2 / 0x40) ^ 2);
    }
    if (DAT_6000_9636 == 2) {
      out(0x3ce,iVar3 * 0x1100 + 0xd);
    }
    if (DAT_6000_9636 == 3) {
      out(_DAT_c000_0010,0xb2);
      bVar2 = in(_DAT_c000_0010 + 1);
      out(_DAT_c000_0010,(bVar2 & 0xe1 | iVar3 << 1) * 0x100 + 0xb2);
    }
    if ((DAT_6000_9636 == 4) || (DAT_6000_9636 == 5)) {
      out(0x3d4,0x38);
      out(0x3d5,0x48);
      out(0x3d4,0x31);
      bVar2 = in(0x3d5);
      out(0x3d4,0x31);
      out(0x3d5,bVar2 | 1);
      out(0x3d4,0x35);
      bVar2 = in(0x3d5);
      out(0x3d4,0x35);
      local_6 = (char)((int)(uint)bVar2 >> 4);
      out(0x3d5,(char)iVar3 + local_6 * '\x10');
    }
    DAT_6000_7f7e = iVar3;
    if ((DAT_6000_9636 == 6) || (DAT_6000_9636 == 7)) {
      out(0x3ce,iVar3 * 0x1000 + 9);
    }
  }
  puVar5 = (undefined2 *)((param_2 % 0x40) * 0x400 + param_1);
  uVar4 = param_3 >> 1;
  if ((param_3 & 1) != 0) {
    *(char *)puVar5 = (char)param_4;
    puVar5 = (undefined2 *)((int)puVar5 + 1);
  }
  for (; uVar4 != 0; uVar4 = uVar4 - 1) {
    puVar1 = puVar5;
    puVar5 = puVar5 + 1;
    *puVar1 = param_4;
  }
  return;
}


// ==== FUN_2000_0c97 @ 2000:0c97 (size 303) callers: FUN_2000_0dd6,FUN_3000_04d3
// recovered from the protected-mode build (build_pm.py)

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_2000_0c97(int param_1)

{
  byte bVar1;
  char local_4;
  
  if (param_1 != DAT_6000_7f7e) {
    switch(DAT_6000_9636) {
    case 0:
      out(0x3cd,(char)param_1 * '\x11');
      break;
    case 1:
      out(0x3c4,0xe);
      bVar1 = in(0x3c5);
      out(0x3c5,(bVar1 & 0xf0) + (char)param_1 ^ 2);
      break;
    case 2:
      out(0x3ce,param_1 * 0x1100 + 0xd);
      break;
    case 3:
      out(_DAT_c000_0010,0xb2);
      bVar1 = in(_DAT_c000_0010 + 1);
      out(_DAT_c000_0010,(bVar1 & 0xe1 | param_1 << 1) * 0x100 + 0xb2);
      break;
    case 4:
    case 5:
      out(0x3d4,0x38);
      out(0x3d5,0x48);
      out(0x3d4,0x31);
      bVar1 = in(0x3d5);
      out(0x3d4,0x31);
      out(0x3d5,bVar1 | 1);
      out(0x3d4,0x35);
      bVar1 = in(0x3d5);
      out(0x3d4,0x35);
      local_4 = (char)((int)(uint)bVar1 >> 4);
      out(0x3d5,(char)param_1 + local_4 * '\x10');
      break;
    case 6:
    case 7:
      out(0x3ce,param_1 * 0x1000 + 9);
    }
    DAT_6000_7f7e = param_1;
    return;
  }
  return;
}


// ==== FUN_2000_0dd6 @ 2000:0dd6 (size 259) callers: FUN_2000_0ed9

int __cdecl16far FUN_2000_0dd6(undefined1 *param_1,uint param_2,uint param_3,undefined1 param_4)

{
  char cVar1;
  char cVar2;
  int iVar3;
  int iVar4;
  undefined1 *puVar5;
  int local_4;
  
  cVar1 = (char)((int)param_2 >> 6);
  cVar2 = (char)((int)param_3 >> 6);
  if (cVar1 == cVar2) {
    local_4 = param_3 - param_2;
  }
  else {
    local_4 = 0x40 - (param_2 & 0x3f);
  }
  FUN_2000_0c97((int)cVar1);
  puVar5 = param_1 + param_2 * 0x400;
  do {
    *puVar5 = param_4;
    puVar5 = puVar5 + 0x400;
    local_4 = local_4 + -1;
  } while (local_4 != 0);
  iVar3 = CONCAT11((char)((uint)(param_1 + param_2 * 0x400) >> 8),cVar1);
  if (cVar1 != cVar2) {
    if (cVar1 + 1 != (int)cVar2) {
      iVar3 = (int)cVar1;
      while (iVar3 = iVar3 + 1, iVar3 <= cVar2 + -1) {
        FUN_2000_0c97(iVar3);
        iVar4 = 0x40;
        puVar5 = param_1;
        do {
          *puVar5 = param_4;
          puVar5 = puVar5 + 0x400;
          iVar4 = iVar4 + -1;
        } while (iVar4 != 0);
      }
    }
    FUN_2000_0c97((int)cVar2);
    iVar3 = (param_3 & 0x3f) + 1;
    iVar4 = iVar3;
    do {
      *param_1 = param_4;
      param_1 = param_1 + 0x400;
      iVar4 = iVar4 + -1;
    } while (iVar4 != 0);
  }
  return iVar3;
}


// ==== FUN_2000_0ed9 @ 2000:0ed9 (size 549) callers: 

void __cdecl16far FUN_2000_0ed9(int param_1,int param_2,int param_3,int param_4,char param_5)

{
  int iVar1;
  undefined2 uVar2;
  uint uVar3;
  uint uVar4;
  int iVar5;
  long lVar6;
  long lVar7;
  long lVar8;
  undefined4 uVar9;
  undefined2 local_e;
  undefined2 local_c;
  undefined2 local_8;
  
  iVar5 = param_4;
  iVar1 = param_1;
  if ((param_1 == param_3) && (param_4 < param_2)) {
    param_4 = param_2;
    param_2 = iVar5;
  }
  if (param_1 == param_3) {
    if (DAT_6000_cd94 == 9) {
      if (param_2 == param_4) {
        (*DAT_6000_9632)(0x2000,param_1,param_2,param_5);
      }
      else {
        FUN_2000_0dd6(param_1,param_2,param_4,(int)param_5);
      }
    }
    else {
      for (; param_2 <= param_4; param_2 = param_2 + 1) {
        (*DAT_6000_9632)(0x2000,param_1,param_2,param_5);
      }
    }
  }
  else {
    iVar5 = param_2;
    if (param_3 < param_1) {
      param_1 = param_3;
      param_3 = iVar1;
      iVar5 = param_4;
      param_4 = param_2;
    }
    iVar1 = param_4 - iVar5;
    if (iVar5 == param_4) {
      if (DAT_6000_cd94 == 4) {
        for (; param_1 <= param_3; param_1 = param_1 + 1) {
          (*DAT_6000_9632)(0x2000,param_1,iVar5,param_5);
        }
      }
      else {
        FUN_2000_091a(param_1,iVar5,(param_3 - param_1) + 1,
                      CONCAT11((char)((uint)iVar1 >> 8),param_5));
      }
    }
    else {
      uVar3 = param_4 - iVar5 >> 0xf;
      uVar4 = param_3 - param_1 >> 0xf;
      if ((int)((param_3 - param_1 ^ uVar4) - uVar4) < (int)((param_4 - iVar5 ^ uVar3) - uVar3)) {
        lVar7 = (long)iVar1;
        lVar6 = N_LXLSH((long)(param_3 - param_1),'\f');
        lVar7 = F_LDIV(lVar6,lVar7);
        lVar6 = N_LXLSH((long)param_1,'\f');
        local_8 = (undefined2)((ulong)lVar7 >> 0x10);
        local_e = (undefined2)lVar6;
        if (iVar5 < param_4) {
          while( true ) {
            local_c = (undefined2)((ulong)lVar6 >> 0x10);
            if (param_4 < iVar5) break;
            uVar9 = CONCAT22(CONCAT11((char)((ulong)lVar6 >> 8),param_5),iVar5);
            lVar6 = N_LXRSH(CONCAT22(local_c,local_e),'\f');
            (*DAT_6000_9632)(0x1000,(int)lVar6,uVar9);
            lVar6 = lVar7 + CONCAT22(local_c,local_e);
            local_e = (undefined2)lVar6;
            lVar6 = CONCAT22((int)((ulong)lVar6 >> 0x10),local_8);
            iVar5 = iVar5 + 1;
          }
        }
        else {
          lVar8 = N_LXMUL(lVar7,(long)(param_4 - iVar5));
          lVar6 = lVar8 + lVar6;
          uVar2 = (int)lVar8;
          for (; param_4 <= iVar5; param_4 = param_4 + 1) {
            uVar9 = CONCAT22(CONCAT11((char)((uint)uVar2 >> 8),param_5),param_4);
            lVar8 = N_LXRSH(lVar6,'\f');
            (*DAT_6000_9632)(0x1000,(int)lVar8,uVar9);
            lVar6 = lVar6 + lVar7;
            uVar2 = local_8;
          }
        }
      }
      else {
        lVar7 = (long)(param_3 - param_1);
        lVar6 = N_LXLSH((long)iVar1,'\f');
        lVar7 = F_LDIV(lVar6,lVar7);
        lVar6 = N_LXLSH((long)iVar5,'\f');
        for (; param_1 <= param_3; param_1 = param_1 + 1) {
          lVar8 = N_LXRSH(lVar6,'\f');
          (*DAT_6000_9632)(0x1000,param_1,(int)lVar8);
          lVar6 = lVar6 + lVar7;
        }
      }
    }
  }
  return;
}


// ==== FUN_2000_10fe @ 2000:10fe (size 424) callers: 
// recovered from the protected-mode build (build_pm.py)

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_2000_10fe(int param_1,int param_2,undefined1 param_3)

{
  byte bVar1;
  int iVar2;
  uint uVar3;
  char local_a;
  
  iVar2 = param_2 >> 6;
  if (iVar2 != DAT_6000_7f7e) {
    if (DAT_6000_9636 == 0) {
      out(0x3cd,(char)iVar2 * '\x11');
    }
    if (DAT_6000_9636 == 1) {
      out(0x3c4,0xe);
      bVar1 = in(0x3c5);
      out(0x3c5,(bVar1 & 0xf0) + (char)(param_2 / 0x40) ^ 2);
    }
    if (DAT_6000_9636 == 2) {
      out(0x3ce,iVar2 * 0x1100 + 0xd);
    }
    if (DAT_6000_9636 == 3) {
      out(_DAT_c000_0010,0xb2);
      bVar1 = in(_DAT_c000_0010 + 1);
      out(_DAT_c000_0010,(bVar1 & 0xe1 | iVar2 << 1) * 0x100 + 0xb2);
    }
    if ((DAT_6000_9636 == 4) || (DAT_6000_9636 == 5)) {
      out(0x3d4,0x38);
      out(0x3d5,0x48);
      out(0x3d4,0x31);
      bVar1 = in(0x3d5);
      out(0x3d4,0x31);
      out(0x3d5,bVar1 | 1);
      out(0x3d4,0x35);
      bVar1 = in(0x3d5);
      out(0x3d4,0x35);
      local_a = (char)((int)(uint)bVar1 >> 4);
      out(0x3d5,(char)iVar2 + local_a * '\x10');
    }
    DAT_6000_7f7e = iVar2;
    if ((DAT_6000_9636 == 6) || (DAT_6000_9636 == 7)) {
      out(0x3ce,iVar2 * 0x1000 + 9);
    }
  }
  if ((DAT_6000_cd94 == 9) && (DAT_6000_9636 == 4)) {
    do {
      uVar3 = in(0x9ae8);
    } while ((uVar3 & 0x200) != 0);
  }
  *(undefined1 *)(param_2 * 0x400 + param_1) = param_3;
  return;
}


// ==== FUN_2000_12a6 @ 2000:12a6 (size 435) callers: FUN_4000_209a,FUN_4000_22a3
// recovered from the protected-mode build (build_pm.py)

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_2000_12a6(int param_1,int param_2,int param_3,byte param_4)

{
  byte bVar1;
  int iVar2;
  char local_c;
  undefined4 local_8;
  
  if (0x3ff < param_1 + param_3) {
    param_3 = 0x3ff - param_1;
  }
  local_8 = (byte *)CONCAT22(0xa000,(byte *)((param_2 % 0x40) * 0x400 + param_1));
  iVar2 = param_2 >> 6;
  if (iVar2 != DAT_6000_7f7e) {
    if (DAT_6000_9636 == 0) {
      out(0x3cd,(char)iVar2 * '\x11');
    }
    if (DAT_6000_9636 == 1) {
      out(0x3c4,0xe);
      bVar1 = in(0x3c5);
      out(0x3c5,(bVar1 & 0xf0) + (char)(param_2 / 0x40) ^ 2);
    }
    if (DAT_6000_9636 == 2) {
      out(0x3ce,iVar2 * 0x1100 + 0xd);
    }
    if (DAT_6000_9636 == 3) {
      out(_DAT_c000_0010,0xb2);
      bVar1 = in(_DAT_c000_0010 + 1);
      out(_DAT_c000_0010,(bVar1 & 0xe1 | iVar2 << 1) * 0x100 + 0xb2);
    }
    if ((DAT_6000_9636 == 4) || (DAT_6000_9636 == 5)) {
      out(0x3d4,0x38);
      out(0x3d5,0x48);
      out(0x3d4,0x31);
      bVar1 = in(0x3d5);
      out(0x3d4,0x31);
      out(0x3d5,bVar1 | 1);
      out(0x3d4,0x35);
      bVar1 = in(0x3d5);
      out(0x3d4,0x35);
      local_c = (char)((int)(uint)bVar1 >> 4);
      out(0x3d5,(char)iVar2 + local_c * '\x10');
    }
    DAT_6000_7f7e = iVar2;
    if ((DAT_6000_9636 == 6) || (DAT_6000_9636 == 7)) {
      out(0x3ce,iVar2 * 0x1000 + 9);
    }
  }
  for (; -1 < param_3; param_3 = param_3 + -1) {
    *local_8 = *local_8 ^ param_4;
    local_8 = (byte *)CONCAT22(local_8._2_2_,(byte *)local_8 + 1);
  }
  return;
}


// ==== FUN_2000_1459 @ 2000:1459 (size 44) callers: FUN_2000_1485

void __cdecl16far FUN_2000_1459(void)

{
  undefined2 local_12;
  undefined2 local_10;
  
  local_12 = 0xb04;
  local_10 = 0x100;
  FUN_1000_2a03(0x10,&local_12,&local_12);
  return;
}


// ==== FUN_2000_1485 @ 2000:1485 (size 1572) callers: main

void __cdecl16far FUN_2000_1485(void)

{
  byte bVar1;
  long lVar2;
  
  switch(DAT_6000_cd94) {
  case 0:
    DAT_6000_cd7a = 0x5e;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)0x77b2;
    FUN_5000_0b79();
    DAT_6000_962c = (char *)0x2000;
    DAT_6000_962a = (char *)0x6df;
    DAT_6000_9630 = (char *)0x2000;
    DAT_6000_962e = 0x73f;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x2cf;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 0x15b;
    DAT_6000_cdd5 = 2;
    FUN_4000_08bc();
    DAT_6000_cda0 = 0x5a;
    DAT_6000_9634 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_9632 = 0xb57;
    clear_screen();
    break;
  case 1:
    DAT_6000_cd7a = 0x48;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)0x7cb2;
    DAT_6000_962c = (char *)0x2000;
    DAT_6000_962a = (char *)0x769;
    DAT_6000_9630 = (char *)0x2000;
    DAT_6000_962e = 0x7ff;
    DAT_6000_9634 = (char *)0x2000;
    DAT_6000_9632 = 0x7d3;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x13f;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 199;
    DAT_6000_cdd5 = 4;
    FUN_4000_0f0d();
    FUN_2000_1459();
    FUN_4000_08bc();
    DAT_6000_cda0 = 0x50;
    break;
  case 2:
    DAT_6000_cd7a = 0x48;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)0x7cb2;
    DAT_6000_962c = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_962a = (char *)0x1da;
    DAT_6000_9630 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_962e = 0x386;
    DAT_6000_9634 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_9632 = 0x17e;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x13f;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 199;
    DAT_6000_cdd5 = 0x10;
    FUN_4000_0f0d();
    FUN_4000_08bc();
    DAT_6000_cda0 = 0x28;
    DAT_6000_9634 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_9632 = 0x17e;
    break;
  case 3:
    DAT_6000_cd7a = 0x48;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)0x7cb2;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x13f;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 199;
    DAT_6000_9630 = (char *)0x2000;
    DAT_6000_962e = 0x4ee;
    DAT_6000_cdd5 = 0x100;
    DAT_6000_9634 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_9632 = 0xbb6;
    DAT_6000_962c = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_962a = (char *)0x6ef;
    FUN_4000_0f0d();
    FUN_4000_08bc();
    DAT_6000_cda0 = 0x140;
    break;
  case 4:
    DAT_6000_cd7a = 0xe0;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)0x7af1;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x167;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 0x1df;
    DAT_6000_cdd5 = 0x100;
    FUN_4000_08bc();
    DAT_6000_962c = (char *)0x2000;
    DAT_6000_962a = (char *)0xed9;
    DAT_6000_9630 = (char *)0x2000;
    DAT_6000_962e = 0x4ee;
    FUN_5110_0000();
    DAT_6000_9634 = (char *)s_GET_A_CURE_DISEASE_AT_A_6000_510f + 1;
    DAT_6000_9632 = 0x3e;
    DAT_6000_cda0 = 0x5a;
    break;
  case 5:
    DAT_6000_cd7a = 0x5e;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)0x77b2;
    DAT_6000_962c = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_962a = (char *)0x1da;
    DAT_6000_9630 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_962e = 0x386;
    DAT_6000_9634 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_9632 = 0x17e;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x27f;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 0x15d;
    DAT_6000_cdd5 = 0x10;
    FUN_4000_0f0d();
    FUN_4000_08bc();
    DAT_6000_cda0 = 0x50;
    break;
  case 6:
    DAT_6000_cd7a = 0xe0;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)0x77b2;
    DAT_6000_962c = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_962a = (char *)0x1da;
    DAT_6000_9630 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_962e = 0x386;
    DAT_6000_9634 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_9632 = 0x17e;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x27f;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 0x1df;
    DAT_6000_cdd5 = 0x10;
    FUN_4000_0f0d();
    FUN_4000_08bc();
    DAT_6000_cda0 = 0x50;
    DAT_6000_9634 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_9632 = 0x17e;
    break;
  case 7:
    DAT_6000_cd7a = 0xd9;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)s_DOESN_T_WORK_THIS_DEEP__6000_71c5 + 0x16;
    DAT_6000_962c = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_962a = (char *)0x1da;
    DAT_6000_9630 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_962e = 0x386;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 799;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 599;
    DAT_6000_cdd5 = 0x10;
    FUN_4000_0f0d();
    FUN_4000_08bc();
    DAT_6000_cda0 = 100;
    DAT_6000_9634 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_9632 = 0x17e;
    break;
  case 8:
    DAT_6000_cd7a = 0xff;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)s_USEFUL_IN_THE_200_PLUS_LEVEL_6000_6b4a + 0x11;
    DAT_6000_962c = (char *)0x2000;
    DAT_6000_962a = (char *)0x837;
    DAT_6000_9630 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_962e = 0x386;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x3ff;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 0x2ff;
    DAT_6000_cdd5 = 0x10;
    FUN_4000_0f0d();
    if (DAT_6000_9636 == 3) {
      out(0x3ce,0x50f);
    }
    if (DAT_6000_9636 == 4) {
      out(0x3c4,0xea06);
    }
    if (DAT_6000_9636 == 5) {
      out(0x46e8,0x18);
      out(0x103,0x80);
      out(0x46e8,8);
      out(0x3d6,0xb);
      bVar1 = in(0x3d7);
      out(0x3d7,bVar1 | 1);
    }
    FUN_4000_08bc();
    DAT_6000_cda0 = 0x80;
    DAT_6000_9634 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_9632 = 0x17e;
    break;
  case 9:
    DAT_6000_cd7a = 0xff;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)s_USEFUL_IN_THE_200_PLUS_LEVEL_6000_6b4a + 0x11;
    if (DAT_6000_9636 == 4) {
      DAT_6000_962c = (char *)0x4000;
      DAT_6000_962a = (char *)s_4__KNIFE_________30_JP_6000_1eba + 3;
    }
    else {
      DAT_6000_962c = (char *)0x2000;
      DAT_6000_962a = (char *)0xed9;
    }
    DAT_6000_9630 = (char *)0x2000;
    DAT_6000_962e = 0x4ee;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x3ff;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 0x2ff;
    DAT_6000_cdd5 = 0x100;
    FUN_4000_0f0d();
    FUN_4000_08bc();
    DAT_6000_cda0 = 0x80;
    DAT_6000_9634 = (char *)0x2000;
    DAT_6000_9632 = 0x10fe;
    break;
  case 10:
    DAT_6000_cd7a = 0xff;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)s_USEFUL_IN_THE_200_PLUS_LEVEL_6000_6b4a + 0x11;
    DAT_6000_962c = (char *)0x2000;
    DAT_6000_962a = (char *)0xba;
    DAT_6000_9630 = (char *)0x2000;
    DAT_6000_962e = 0x4ee;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x3ff;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 0x2ff;
    DAT_6000_cdd5 = 0x100;
    FUN_2000_037f();
    FUN_4000_08bc();
    DAT_6000_cda0 = 0x80;
    DAT_6000_9634 = (char *)0x2000;
    DAT_6000_9632 = 0x142;
    break;
  case 0xb:
    DAT_6000_cd7a = 0xe0;
    DAT_6000_cd78 = 0x3000;
    DAT_6000_cd76 = (char *)0x77b2;
    DAT_6000_962c = (char *)0x2000;
    DAT_6000_962a = (char *)0xba;
    DAT_6000_9630 = (char *)0x2000;
    DAT_6000_962e = 0x4ee;
    DAT_6000_cd98 = 0;
    DAT_6000_cd96 = 0x27f;
    DAT_6000_cd9c = 0;
    DAT_6000_cd9a = 0x1df;
    DAT_6000_cdd5 = 0x100;
    FUN_2000_03a5();
    FUN_4000_08bc();
    DAT_6000_cda0 = 0x80;
    DAT_6000_9634 = (char *)0x2000;
    DAT_6000_9632 = 0x142;
  }
  FUN_2000_1b29();
  lVar2 = N_LXRSH(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),'\x06');
  DAT_6000_d0dc = (undefined2)lVar2;
  lVar2 = F_LDIV(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),0x30);
  DAT_6000_d0de = (int)lVar2;
  return;
}


// ==== FUN_2000_1ac1 @ 2000:1ac1 (size 9) callers: FUN_4000_0f0d

void __cdecl16far FUN_2000_1ac1(void)

{
  FUN_2000_0348();
  return;
}


// ==== FUN_2000_1aca @ 2000:1aca (size 95) callers: FUN_2000_1b29

void __cdecl16far FUN_2000_1aca(void)

{
  int iVar1;
  int iVar2;
  
  for (iVar2 = 1; iVar2 < 0xc; iVar2 = iVar2 + 1) {
    for (iVar1 = 0; iVar1 < 0x30; iVar1 = iVar1 + 1) {
      if (iVar2 * 2 < (int)(char)((undefined1 *)&DAT_6000_cdd7)[iVar1]) {
        ((undefined1 *)&DAT_6000_cdd7)[iVar2 * 0x30 + iVar1] =
             ((undefined1 *)&DAT_6000_cdd7)[iVar1] + (char)iVar2 * -3;
      }
      else {
        ((undefined1 *)&DAT_6000_cdd7)[iVar2 * 0x30 + iVar1] = 0;
      }
    }
  }
  FUN_4000_100f();
  return;
}


// ==== FUN_2000_1b29 @ 2000:1b29 (size 250) callers: FUN_2000_1485

void __cdecl16far FUN_2000_1b29(void)

{
  undefined2 in_AX;
  byte bVar1;
  byte extraout_AH;
  undefined1 extraout_AH_00;
  undefined1 extraout_AH_01;
  undefined1 extraout_AH_02;
  undefined1 extraout_AH_03;
  undefined1 extraout_AH_04;
  undefined1 extraout_AH_05;
  undefined1 extraout_AH_06;
  undefined1 extraout_AH_07;
  undefined1 extraout_AH_08;
  undefined1 extraout_AH_09;
  undefined1 extraout_AH_10;
  undefined1 extraout_AH_11;
  undefined1 extraout_AH_12;
  undefined1 extraout_AH_13;
  undefined1 extraout_AH_14;
  
  bVar1 = (byte)((uint)in_AX >> 8);
  if (DAT_6000_cd94 < 2) {
    return;
  }
  if (DAT_6000_cdd5 == 0x100) {
    FUN_2000_1aca();
    bVar1 = extraout_AH;
  }
  FUN_4000_0f7a((uint)bVar1 << 8,(uint)bVar1 << 8);
  FUN_4000_0f7a(CONCAT11(extraout_AH_00,1),CONCAT11(extraout_AH_00,8));
  FUN_4000_0f7a(CONCAT11(extraout_AH_01,2),CONCAT11(extraout_AH_01,1));
  FUN_4000_0f7a(CONCAT11(extraout_AH_02,3),CONCAT11(extraout_AH_02,9));
  FUN_4000_0f7a(CONCAT11(extraout_AH_03,4),CONCAT11(extraout_AH_03,0x19));
  FUN_4000_0f7a(CONCAT11(extraout_AH_04,5),CONCAT11(extraout_AH_04,0x11));
  FUN_4000_0f7a(CONCAT11(extraout_AH_05,6),CONCAT11(extraout_AH_05,0x18));
  FUN_4000_0f7a(CONCAT11(extraout_AH_06,7),CONCAT11(extraout_AH_06,0x10));
  FUN_4000_0f7a(CONCAT11(extraout_AH_07,8),CONCAT11(extraout_AH_07,2));
  FUN_4000_0f7a(CONCAT11(extraout_AH_08,9),CONCAT11(extraout_AH_08,0x12));
  FUN_4000_0f7a(CONCAT11(extraout_AH_09,10),CONCAT11(extraout_AH_09,0x16));
  FUN_4000_0f7a(CONCAT11(extraout_AH_10,0xb),CONCAT11(extraout_AH_10,6));
  FUN_4000_0f7a(CONCAT11(extraout_AH_11,0xc),CONCAT11(extraout_AH_11,0x14));
  FUN_4000_0f7a(CONCAT11(extraout_AH_12,0xd),CONCAT11(extraout_AH_12,0x24));
  FUN_4000_0f7a(CONCAT11(extraout_AH_13,0xe),CONCAT11(extraout_AH_13,4));
  FUN_4000_0f7a(CONCAT11(extraout_AH_14,0xf),CONCAT11(extraout_AH_14,0x20));
  return;
}


// ==== FUN_2000_1c23 @ 2000:1c23 (size 75) callers: main

void __cdecl16far FUN_2000_1c23(void)

{
  switch(DAT_6000_cd94) {
  case 0:
  case 5:
  case 6:
  case 0xb:
    load_font(2);
    break;
  case 1:
  case 2:
  case 3:
    load_font(0);
    break;
  case 4:
    load_font(1);
  }
  if (DAT_6000_9638 == 0) {
    DAT_6000_9638 = 1;
  }
  return;
}


// ==== FUN_2000_1c86 @ 2000:1c86 (size 133) callers: FUN_2000_7756,movecontrol,FUN_2000_c30e,FUN_2000_c3d5,FUN_3000_d51c

void __cdecl16far FUN_2000_1c86(void)

{
  strcpy(DAT_6000_cd80,(char *)0x1ba5);
  strcpy(DAT_6000_cd82,(char *)0x1ba9);
  strcpy(DAT_6000_cd84,(char *)0x1bad);
  strcpy(DAT_6000_cd86,(char *)0x1bb1);
  strcpy(DAT_6000_cd88,(char *)0x1bb5);
  strcpy(DAT_6000_cd8a,(char *)0x1bb9);
  strcpy(DAT_6000_cd8c,(char *)0x1bbd);
  strcpy(DAT_6000_cd8e,(char *)0x1bc1);
  return;
}


// ==== FUN_2000_1d0b @ 2000:1d0b (size 684) callers: FUN_2000_20da,FUN_2000_7756,movecontrol,FUN_2000_c30e,FUN_2000_c3d5,cast_spell,FUN_2000_d358,FUN_2000_ea27,FUN_3000_bdb5,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a

int __cdecl16far FUN_2000_1d0b(int param_1,int param_2,int param_3)

{
  short sVar1;
  int iVar2;
  uint uVar3;
  int iVar4;
  long lVar5;
  undefined2 uVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  
  uVar9 = 0;
  uVar7 = 0x4af;
  lVar5 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar5 = F_LDIV(lVar5,CONCAT22(uVar9,uVar7));
  uVar7 = (undefined2)lVar5;
  uVar8 = 0;
  uVar9 = 0x63f;
  lVar5 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar5 = F_LDIV(lVar5,CONCAT22(uVar8,uVar9));
  uVar9 = (undefined2)lVar5;
  uVar6 = 0;
  uVar8 = 0x4af;
  lVar5 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar5 = F_LDIV(lVar5,CONCAT22(uVar6,uVar8));
  fill_rect(0,(int)lVar5,uVar9,uVar7);
  iVar4 = 0;
  while ((iVar2 = -1, iVar4 < 8 &&
         ((sVar1 = kbhit(), sVar1 == 0 ||
          ((iVar2 = getch(), param_2 != -1 &&
           (((param_3 < iVar2 + -0x30 || (iVar2 + -0x30 < param_2)) && (iVar2 != 0x1b))))))))) {
    uVar3 = strlen((char *)*(undefined2 *)(param_1 + iVar4 * 2));
    if (uVar3 < 0x1b) {
      print_text(0,iVar4 * 0x32 + 0x28,0,*(undefined2 *)(param_1 + iVar4 * 2),5);
    }
    else {
      iVar2 = iVar4 * 0x32 + 0x28;
      draw_text_box(*(undefined2 *)(param_1 + iVar4 * 2),0,0,iVar2,iVar2 >> 0xf,0x29e,0,0,5);
    }
    iVar4 = iVar4 + 1;
  }
  if (iVar2 == -1) {
    if (param_2 == -1) {
      do {
        do {
          sVar1 = kbhit();
          if (sVar1 != 0) {
            sVar1 = getch();
            iVar2 = sVar1 + 0x30;
            goto LAB_2000_1f21;
          }
        } while (DAT_6000_d0da == 0);
        iVar4 = FUN_4000_2d34(0);
        if (iVar4 != 0) {
          iVar2 = 0x20;
          goto LAB_2000_1f21;
        }
        iVar4 = FUN_4000_2d34(1);
      } while (iVar4 == 0);
      iVar2 = 0x1b;
    }
    else {
      if (DAT_6000_d0da != 0) {
        for (iVar4 = 0; iVar4 < 8; iVar4 = iVar4 + 1) {
          if ((iVar4 < param_2 + -1) || (param_3 + -1 < iVar4)) {
            ((undefined1 *)&DAT_6000_d0ee)[iVar4] = 0xff;
          }
        }
      }
      do {
        iVar2 = -1;
        sVar1 = kbhit();
        if (sVar1 == 0) {
          if (DAT_6000_d0da != 0) {
            iVar2 = mouse_pick(0x11a3);
            if (-1 < iVar2) {
              iVar2 = iVar2 + 0x31;
            }
            iVar4 = FUN_4000_2d34(1);
            if (iVar4 != 0) {
              iVar2 = 0x1b;
            }
          }
        }
        else {
          iVar2 = getch();
        }
      } while (((param_3 < iVar2 + -0x30) || (iVar2 + -0x30 < param_2)) && (iVar2 != 0x1b));
    }
  }
LAB_2000_1f21:
  if (DAT_6000_d0da != 0) {
    FUN_4000_2e13();
    FUN_4000_3435();
  }
  uVar6 = 0;
  uVar9 = 0;
  uVar7 = 0x4af;
  lVar5 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar5 = F_LDIV(lVar5,CONCAT22(uVar9,uVar7));
  uVar7 = (undefined2)lVar5;
  uVar8 = 0;
  uVar9 = 0x63f;
  lVar5 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar5 = F_LDIV(lVar5,CONCAT22(uVar8,uVar9));
  fill_rect(0,0,(int)lVar5,uVar7,uVar6);
  if ((param_2 == -1) && (param_3 < 0)) {
    FUN_1000_22a2(-param_3);
    flush_keys();
  }
  if (iVar2 != 0x1b) {
    return iVar2 + -0x30;
  }
  return -1;
}


// ==== FUN_2000_1fbd @ 2000:1fbd (size 281) callers: store,FUN_2000_3085,inn,bank,FUN_2000_7756,FUN_2000_7b4f,dig_hole,movecontrol,cast_spell,FUN_2000_d195,FUN_3000_9ac0,FUN_3000_a047,FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_d51c,FUN_3000_e221

short __cdecl16far FUN_2000_1fbd(int param_1,int param_2)

{
  short sVar1;
  int iVar2;
  int iVar3;
  long lVar4;
  undefined2 uVar5;
  undefined2 uVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  
  iVar2 = -1;
  if (DAT_6000_d0da != 0) {
    for (iVar3 = 0; iVar3 < 8; iVar3 = iVar3 + 1) {
      if ((iVar3 < param_1) || (param_2 < iVar3)) {
        ((undefined1 *)&DAT_6000_d0ee)[iVar3] = 0xff;
      }
    }
  }
LAB_2000_2064:
  do {
    if (iVar2 != -1) {
LAB_2000_206c:
      if (DAT_6000_d0da != 0) {
        FUN_4000_3435();
        FUN_4000_2e13();
      }
      uVar8 = 0;
      uVar7 = 0;
      uVar5 = 0x4af;
      lVar4 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar4 = F_LDIV(lVar4,CONCAT22(uVar7,uVar5));
      uVar5 = (undefined2)lVar4;
      uVar6 = 0;
      uVar7 = 0x63f;
      lVar4 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar4 = F_LDIV(lVar4,CONCAT22(uVar6,uVar7));
      fill_rect(0,0,(int)lVar4,uVar5,uVar8);
      return iVar2;
    }
    iVar2 = -1;
    sVar1 = kbhit();
    if (sVar1 == 0) {
      if (DAT_6000_d0da != 0) {
        iVar2 = FUN_4000_2d34(1);
        if (iVar2 != 0) {
          iVar2 = 0x1b;
          goto LAB_2000_206c;
        }
        iVar2 = mouse_pick(0x11a3);
        if (iVar2 != -1) {
          iVar2 = (iVar2 - param_1) + 0x31;
        }
      }
      goto LAB_2000_2064;
    }
    iVar2 = getch();
    if (iVar2 == 0x1b) goto LAB_2000_206c;
    if (iVar2 == 0) {
      iVar2 = -1;
      getch();
    }
    if ((iVar2 + -0x30 < 1) || (param_2 - param_1 < iVar2 + -0x31)) {
      iVar2 = -1;
    }
  } while( true );
}


// ==== FUN_2000_20da @ 2000:20da (size 143) callers: bank

void __cdecl16far
FUN_2000_20da(char *param_1,char *param_2,char *param_3,char *param_4,char *param_5,char *param_6,
             char *param_7,char *param_8)

{
  strcpy(DAT_6000_cd80,param_1);
  strcpy(DAT_6000_cd82,param_2);
  strcpy(DAT_6000_cd84,param_3);
  strcpy(DAT_6000_cd86,param_4);
  strcpy(DAT_6000_cd88,param_5);
  strcpy(DAT_6000_cd8a,param_6);
  strcpy(DAT_6000_cd8c,param_7);
  strcpy(DAT_6000_cd8e,param_8);
  FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,0xffff,0);
  return;
}


// ==== FUN_2000_216b @ 2000:216b (size 364) callers: FUN_2000_22d7,store,FUN_2000_3085,inn,bank,monster_turn,FUN_2000_7756,dig_hole,movecontrol,FUN_2000_d195,FUN_3000_8235,FUN_3000_9ac0,FUN_3000_a047

void __cdecl16far
FUN_2000_216b(char *param_1,char *param_2,char *param_3,char *param_4,char *param_5,char *param_6,
             char *param_7,char *param_8)

{
  uint uVar1;
  int iVar2;
  int iVar3;
  long lVar4;
  undefined2 uVar5;
  undefined2 uVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  
  strcpy(DAT_6000_cd80,param_1);
  strcpy(DAT_6000_cd82,param_2);
  strcpy(DAT_6000_cd84,param_3);
  strcpy(DAT_6000_cd86,param_4);
  strcpy(DAT_6000_cd88,param_5);
  strcpy(DAT_6000_cd8a,param_6);
  strcpy(DAT_6000_cd8c,param_7);
  strcpy(DAT_6000_cd8e,param_8);
  uVar8 = 0;
  uVar6 = 0x4af;
  lVar4 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar4 = F_LDIV(lVar4,CONCAT22(uVar8,uVar6));
  uVar6 = (undefined2)lVar4;
  uVar7 = 0;
  uVar8 = 0x63f;
  lVar4 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar4 = F_LDIV(lVar4,CONCAT22(uVar7,uVar8));
  uVar8 = (undefined2)lVar4;
  uVar5 = 0;
  uVar7 = 0x4af;
  lVar4 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar4 = F_LDIV(lVar4,CONCAT22(uVar5,uVar7));
  fill_rect(0,(int)lVar4,uVar8,uVar6);
  for (iVar3 = 0; iVar3 < 8; iVar3 = iVar3 + 1) {
    uVar1 = strlen((char *)((undefined2 *)&DAT_6000_cd80)[iVar3]);
    if (uVar1 < 0x1b) {
      print_text(0,iVar3 * 0x32 + 0x28,0,((undefined2 *)&DAT_6000_cd80)[iVar3],5);
    }
    else {
      iVar2 = iVar3 * 0x32 + 0x28;
      draw_text_box(((undefined2 *)&DAT_6000_cd80)[iVar3],0,0,iVar2,iVar2 >> 0xf,0x29e,0,0,5);
    }
  }
  flush_keys();
  return;
}


// ==== FUN_2000_22d7 @ 2000:22d7 (size 40) callers: FUN_2000_22ff,load_h_bin,financial_statement,experience_for_level,monster_turn,FUN_2000_a791,cast_spell,FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_bdb5,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a,FUN_3000_d51c

void __cdecl16far FUN_2000_22d7(undefined2 *param_1)

{
  FUN_2000_216b(*param_1,param_1[1],param_1[2],param_1[3],param_1[4],param_1[5],param_1[6],
                param_1[7]);
  return;
}


// ==== FUN_2000_22ff @ 2000:22ff (size 265) callers: FUN_2000_3085,inn,game_disk_prompt,dig_hole,movecontrol,FUN_2000_c28a,FUN_2000_c2b6,FUN_2000_c2e2,cast_spell,FUN_2000_c97a,FUN_2000_c9a6,FUN_2000_c9d2,FUN_2000_caba,FUN_2000_cc66,FUN_2000_cdc5,FUN_2000_cedc,FUN_2000_cf08,FUN_2000_cf6c,FUN_2000_cfd0,FUN_2000_d006,FUN_2000_d03c,FUN_2000_d072,FUN_2000_d0a8,FUN_2000_d358,FUN_2000_ea27,FUN_3000_9a93,FUN_3000_9ac0,FUN_3000_d0b9,FUN_3000_d37f,FUN_3000_d43b,FUN_3000_d51c,FUN_3000_e221

undefined2 __cdecl16far
FUN_2000_22ff(char *param_1,char *param_2,char *param_3,char *param_4,char *param_5,char *param_6,
             char *param_7,char *param_8)

{
  undefined2 uVar1;
  long lVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  undefined2 uVar6;
  
  strcpy(DAT_6000_cd80,param_1);
  strcpy(DAT_6000_cd82,param_2);
  strcpy(DAT_6000_cd84,param_3);
  strcpy(DAT_6000_cd86,param_4);
  strcpy(DAT_6000_cd88,param_5);
  strcpy(DAT_6000_cd8a,param_6);
  strcpy(DAT_6000_cd8c,param_7);
  strcpy(DAT_6000_cd8e,param_8);
  FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
  uVar1 = wait_key();
  uVar6 = 0;
  uVar4 = 0x4af;
  lVar2 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar2 = F_LDIV(lVar2,CONCAT22(uVar6,uVar4));
  uVar4 = (undefined2)lVar2;
  uVar5 = 0;
  uVar6 = 0x63f;
  lVar2 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar2 = F_LDIV(lVar2,CONCAT22(uVar5,uVar6));
  uVar6 = (undefined2)lVar2;
  uVar3 = 0;
  uVar5 = 0x4af;
  lVar2 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar2 = F_LDIV(lVar2,CONCAT22(uVar3,uVar5));
  fill_rect(0,(int)lVar2,uVar6,uVar4);
  return uVar1;
}


// ==== load_h_bin @ 2000:240c (size 130) callers: FUN_2000_248e,game_disk_prompt,FUN_2000_70da,FUN_2000_726f,FUN_2000_7756,FUN_2000_7b4f,FUN_2000_81cd,FUN_3000_e221  // reads H.BIN

void __cdecl16far load_h_bin(int param_1)

{
  void *f;
  int iVar1;
  undefined1 local_54 [80];
  int local_4;
  
  f = fopen((char *)0x1bc5,(char *)0x1bcb);
  if (f == (void *)0x0) {
    return;
  }
  for (local_4 = 0; local_4 < param_1; local_4 = local_4 + 1) {
    for (iVar1 = 0; iVar1 < 8; iVar1 = iVar1 + 1) {
      read_roll_line(local_54,f);
    }
  }
  for (iVar1 = 0; iVar1 < 8; iVar1 = iVar1 + 1) {
    read_roll_line(((undefined2 *)&DAT_6000_cd80)[iVar1],f);
  }
  FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
  fclose(f);
  return;
}


// ==== FUN_2000_248e @ 2000:248e (size 383) callers: movecontrol

void __cdecl16far FUN_2000_248e(int param_1)

{
  short sVar1;
  long lVar2;
  long lVar3;
  
  DAT_6000_11e5 = 1;
  if (param_1 == 0) {
    load_h_bin();
    return;
  }
  if ((param_1 == 4) && ((uint)DAT_6000_c937 % 2 == 0)) {
    load_h_bin();
    return;
  }
  if ((param_1 == 8) && ((uint)DAT_6000_c937 % 4 < 2)) {
    load_h_bin();
    return;
  }
  if ((param_1 == 0xc) && ((uint)DAT_6000_c937 % 8 < 4)) {
    load_h_bin();
    return;
  }
  if ((param_1 == 0x10) && ((uint)DAT_6000_c937 % 0x10 < 8)) {
    load_h_bin();
    return;
  }
  if ((param_1 == 0x7d) && ((uint)DAT_6000_c937 % 0x20 < 0x10)) {
    load_h_bin();
    return;
  }
  if ((param_1 == 0x96) && ((uint)DAT_6000_c937 % 0x40 < 0x20)) {
    load_h_bin();
    return;
  }
  if ((param_1 == 0xaf) && ((uint)DAT_6000_c937 % 0x80 < 0x40)) {
    load_h_bin();
    return;
  }
  if ((param_1 == 200) && (DAT_6000_c937 < 0x80)) {
    load_h_bin();
    return;
  }
  lVar3 = 0x8000;
  sVar1 = rand();
  lVar2 = N_LXMUL(0xc,(long)sVar1);
  lVar2 = F_LDIV(lVar2,lVar3);
  if ((int)lVar2 == 1) {
    lVar3 = 0x8000;
    sVar1 = rand();
    lVar2 = N_LXLSH((long)sVar1,'\x03');
    F_LDIV(lVar2,lVar3);
    load_h_bin();
  }
  return;
}


// ==== FUN_2000_260d @ 2000:260d (size 65) callers: FUN_2000_264e,FUN_2000_2697,FUN_2000_2723

void __cdecl16far FUN_2000_260d(undefined1 param_1)

{
  undefined1 local_12;
  undefined1 local_11;
  char local_10;
  undefined1 local_f;
  undefined2 local_e;
  
  local_11 = 9;
  local_12 = param_1;
  local_10 = (char)DAT_6000_11e7 + (char)DAT_6000_11e9 * '\x10';
  local_f = 0;
  local_e = 1;
  FUN_1000_2a03(0x10,&local_12,&local_12);
  return;
}


// ==== FUN_2000_264e @ 2000:264e (size 73) callers: FUN_2000_2b73

void __cdecl16far FUN_2000_264e(char *param_1)

{
  uint uVar1;
  uint uVar2;
  
  uVar2 = 0;
  while( true ) {
    uVar1 = strlen(param_1);
    if (uVar1 <= uVar2) break;
    FUN_1000_2912(DAT_6000_11eb,DAT_6000_11ed);
    FUN_2000_260d((int)param_1[uVar2]);
    DAT_6000_11eb = DAT_6000_11eb + 1;
    uVar2 = uVar2 + 1;
  }
  DAT_6000_11ed = DAT_6000_11ed + 1;
  DAT_6000_11eb = 1;
  return;
}


// ==== FUN_2000_2697 @ 2000:2697 (size 140) callers: load_world_pic,FUN_2000_2b73,main

void __cdecl16far FUN_2000_2697(char *param_1)

{
  uint uVar1;
  uint uVar2;
  
  if (DAT_6000_00c5 == 1) {
    DAT_6000_11e7 = 0xf;
    DAT_6000_11e9 = 0;
  }
  uVar2 = 0;
  while( true ) {
    uVar1 = strlen(param_1);
    if (uVar1 <= uVar2) break;
    FUN_1000_2912(DAT_6000_11eb,DAT_6000_11ed);
    uVar1 = (uint)(byte)param_1[uVar2];
    if ((uVar1 < 0xc9) || (0xd7 < uVar1)) {
      if (DAT_6000_cd94 == 0) {
        DAT_6000_11e7 = 0xe;
      }
      FUN_2000_260d((int)param_1[uVar2]);
      DAT_6000_11eb = DAT_6000_11eb + 1;
    }
    else {
      DAT_6000_11e7 = uVar1 - 200;
    }
    uVar2 = uVar2 + 1;
  }
  DAT_6000_11ed = DAT_6000_11ed + 1;
  DAT_6000_11eb = 1;
  return;
}


// ==== FUN_2000_2723 @ 2000:2723 (size 130) callers: load_world_pic

void __cdecl16far FUN_2000_2723(char *param_1)

{
  uint uVar1;
  uint uVar2;
  
  if (DAT_6000_00c5 == 1) {
    DAT_6000_11e7 = 0xf;
    DAT_6000_11e9 = 0;
  }
  uVar2 = 0;
  while( true ) {
    uVar1 = strlen(param_1);
    if (uVar1 <= uVar2) break;
    FUN_1000_2912(DAT_6000_11eb,DAT_6000_11ed);
    uVar1 = (uint)(byte)param_1[uVar2];
    if ((uVar1 < 0xc9) || (0xd7 < uVar1)) {
      if (DAT_6000_cd94 == 0) {
        DAT_6000_11e7 = 0xe;
      }
      FUN_2000_260d((int)param_1[uVar2]);
      DAT_6000_11eb = DAT_6000_11eb + 1;
    }
    else {
      DAT_6000_11e7 = uVar1 - 200;
    }
    uVar2 = uVar2 + 1;
  }
  return;
}


// ==== FUN_2000_27a5 @ 2000:27a5 (size 17) callers: load_world_pic,FUN_2000_2b73,main

void __cdecl16far FUN_2000_27a5(undefined2 param_1,undefined2 param_2)

{
  DAT_6000_11eb = param_1;
  DAT_6000_11ed = param_2;
  return;
}


// ==== load_world_pic @ 2000:27b8 (size 955) callers: FUN_2000_2b73  // reads WORLD.PIC

void __cdecl16far load_world_pic(void)

{
  int *piVar1;
  int iVar2;
  int iVar3;
  char *pcVar4;
  short sVar5;
  short sVar6;
  undefined2 uVar7;
  void *f;
  undefined2 uVar8;
  uint uVar9;
  uint uVar10;
  int iVar11;
  char *src;
  int local_c;
  void *local_4;
  
  local_4 = fopen((char *)s_world_pic_6000_1bce,(char *)0x1bd8);
  if ((DAT_6000_cd94 != 10) && (DAT_6000_cd94 != 0xb)) {
    FUN_4000_0f0d(3);
  }
  flush_keys();
  if (local_4 == (void *)0x0) {
    FUN_1000_1f11(10);
    DAT_6000_11e7 = 10;
    FUN_1000_2912(1,1);
    FUN_1000_1ee8();
    FUN_2000_2697((char *)s_INSERT_THE_MORAFF_S_WORLD_DATA_D_6000_1bdb);
    FUN_1000_2912(1,2);
    FUN_2000_2697((char *)s_YOU_MIGHT_WANT_TO_GRAB_A_SANDWIC_6000_1c21);
    wait_key();
    local_4 = fopen((char *)s_world_pic_6000_1bce,(char *)0x1bd8);
    if (local_4 == (void *)0x0) {
      FUN_1000_2912(1,10);
      FUN_2000_2697((char *)s_I_CAN_NOT_FIND_THE_NEEDED_FILES__6000_1c60);
      FUN_1000_2912(1,0xb);
      FUN_2000_2697((char *)s_BE_COPIED_INTO_THE_SAME_SUBDIREC_6000_1ca7);
      FUN_1000_2912(1,0xd);
      FUN_2000_2697((char *)s_PERHAPS_YOU_SHOULD_TRY_REINSTALL_6000_1cd2);
      quit(0);
    }
  }
  FUN_1000_1f11(0xe);
  DAT_6000_11e7 = 0xe;
  FUN_2000_27a5(1,1);
  FUN_2000_2697((char *)s_LOADING____PLEASE_BE_PATIENT_6000_1d00);
  for (iVar11 = 0; iVar11 < DAT_6000_1235; iVar11 = iVar11 + 1) {
    if ((iVar11 < 2) || (*(char *)((int)(undefined2 *)&DAT_6000_11ed + iVar11) != '\0')) {
      FUN_1000_1f11(0xe);
      FUN_2000_27a5(1,2);
      src = (char *)0x1ba7;
      pcVar4 = itoa(DAT_6000_1235 - iVar11,DAT_6000_cb52,10);
      pcVar4 = strcat(pcVar4,src);
      FUN_2000_2723(pcVar4);
      if (iVar11 % 10 == 0) {
        DAT_6000_11eb = 1;
        DAT_6000_11ed = DAT_6000_11ed + 1;
      }
      sVar5 = fgetc(local_4);
      sVar6 = fgetc(local_4);
      iVar2 = sVar5 * 0x100 + sVar6;
      uVar8 = 0;
      uVar7 = FUN_1000_254d(iVar2 + 400,0);
      ((undefined2 *)&DAT_6000_ca3c)[iVar11 * 2] = uVar8;
      ((undefined2 *)&DAT_6000_ca3a)[iVar11 * 2] = uVar7;
      uVar7 = ((undefined2 *)&DAT_6000_ca3c)[iVar11 * 2];
      iVar3 = ((undefined2 *)&DAT_6000_ca3a)[iVar11 * 2];
      if (((undefined2 *)&DAT_6000_ca3a)[iVar11 * 2] == 0 &&
          ((undefined2 *)&DAT_6000_ca3c)[iVar11 * 2] == 0) {
        FUN_2000_27a5(0x1e,10);
        FUN_2000_2697((char *)s_out_of_memory___sorry_6000_1d1d);
        quit(0);
      }
      for (uVar9 = 0; uVar9 < iVar2 + 400U; uVar9 = uVar9 + 1) {
        sVar5 = fgetc(local_4);
        *(undefined1 *)(iVar3 + uVar9) = (char)sVar5;
      }
    }
  }
  fclose(local_4);
  pcVar4 = (char *)s_I_DON_T_SEE_ANY_TRAP_6000_32b7 + 0x11;
  DAT_6000_ca1a = FUN_1000_254d((char *)s_I_DON_T_SEE_ANY_TRAP_6000_32b7 + 0x11,0);
  DAT_6000_ca1c = pcVar4;
  if (DAT_6000_ca1a == 0 && pcVar4 == (char *)0x0) {
    FUN_2000_27a5(0x1e,10);
    FUN_2000_2697((char *)s_out_of_memory_in_wall_pic___sorr_6000_1d33);
    quit(0);
  }
  f = fopen((char *)s_wall_pic_6000_1d55,(char *)0x1bd8);
  local_c = 0;
  for (iVar11 = 0; iVar11 < 2; iVar11 = iVar11 + 1) {
    sVar5 = fgetc(f);
    sVar6 = fgetc(f);
    uVar9 = sVar5 * 0x100 + sVar6;
    uVar10 = *(uint *)(local_c * 2 + -0x35d6);
    if ((char)(CARRY2(uVar10,uVar9) + (0xfe6f < uVar10 + uVar9)) != '\0') {
      local_c = local_c + 1;
      *(undefined2 *)(local_c * 2 + -0x35d6) = 0;
      if (3 < local_c) {
        FUN_1000_3f0b((char *)s_programming_allocation_error_6000_1d5e);
        FUN_1000_128d(0);
      }
    }
    iVar2 = ((undefined2 *)&DAT_6000_ca1a)[local_c * 2];
    iVar3 = *(int *)(local_c * 2 + -0x35d6);
    ((undefined2 *)&DAT_6000_ca34)[iVar11 * 2] = ((undefined2 *)&DAT_6000_ca1c)[local_c * 2];
    ((undefined2 *)&DAT_6000_ca32)[iVar11 * 2] = iVar2 + iVar3;
    piVar1 = (int *)(local_c * 2 + -0x35d6);
    *piVar1 = *piVar1 + uVar9 + 400;
    uVar7 = ((undefined2 *)&DAT_6000_ca34)[iVar11 * 2];
    iVar2 = ((undefined2 *)&DAT_6000_ca32)[iVar11 * 2];
    for (uVar10 = 0; uVar10 < uVar9 + 400; uVar10 = uVar10 + 1) {
      sVar5 = fgetc(f);
      *(undefined1 *)(iVar2 + uVar10) = (char)sVar5;
    }
  }
  fclose(f);
  return;
}


// ==== FUN_2000_2b73 @ 2000:2b73 (size 451) callers: main

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_2000_2b73(void)

{
  void *pvVar1;
  undefined2 uVar2;
  char *pcVar3;
  undefined2 uVar4;
  int iVar5;
  int iVar6;
  int local_4;
  
  pcVar3 = (char *)s_WORLD__A_LITTLE_MOUSE_ASKS_YOU__6000_899a + 9;
  DAT_6000_cd12 = FUN_1000_254d((char *)s_WORLD__A_LITTLE_MOUSE_ASKS_YOU__6000_899a + 9,0);
  _DAT_6000_cd14 = pcVar3;
  DAT_6000_cd16 = malloc(0x15e);
  DAT_6000_cbee = malloc(0x32);
  for (iVar6 = 0; iVar6 < 8; iVar6 = iVar6 + 1) {
    pvVar1 = malloc(0x37);
    ((undefined2 *)&DAT_6000_cd80)[iVar6] = pvVar1;
  }
  load_world_pic();
  pcVar3 = (char *)s_COST_10_JP_PER_NIGHT__6000_225f + 1;
  DAT_6000_cbe2._0_2_ = FUN_1000_254d((char *)s_COST_10_JP_PER_NIGHT__6000_225f + 1,0);
  DAT_6000_11eb = 1;
  DAT_6000_11ed = 0x14;
  DAT_6000_cbe2._2_2_ = pcVar3;
  if ((int)DAT_6000_cbe2 == 0 && pcVar3 == (char *)0x0) {
    FUN_2000_27a5(0x1e,10);
    FUN_2000_2697((char *)s_out_of_mem_in_do_allocs_1_6000_1d7b);
    quit(0);
  }
  uVar4 = 0x366;
  uVar2 = FUN_1000_254d(0x366,0);
  DAT_6000_cbde = CONCAT22(uVar4,uVar2);
  uVar2 = 0x366;
  DAT_6000_cbe6._0_2_ = FUN_1000_254d(0x366,0);
  iVar6 = 0x366;
  DAT_6000_cbe6._2_2_ = uVar2;
  DAT_6000_cbea._0_2_ = FUN_1000_254d(0x366,0);
  DAT_6000_cbea._2_2_ = iVar6;
  if ((int)DAT_6000_cbea == 0 && iVar6 == 0) {
    FUN_2000_264e((char *)s_out_of_mem_in_do_allocs_2_6000_1d95);
    quit(0);
  }
  for (iVar6 = 0; iVar6 < 0x366; iVar6 = iVar6 + 1) {
    *(undefined1 *)((int)DAT_6000_cbde + iVar6) = 0;
  }
  FUN_1000_2864();
  if (DAT_6000_cd12 == 0 && _DAT_6000_cd14 == (char *)0x0) {
    FUN_2000_264e((char *)s_out_of_mem_in_do_allocs_3_6000_1daf);
    quit(0);
  }
  DAT_6000_cbdc = malloc(0x44c);
  if (DAT_6000_cbdc == (void *)0x0) {
    FUN_2000_264e((char *)s_out_of_mem_in_do_allocs_4_6000_1dca);
    quit(0);
  }
  for (iVar6 = 0; iVar6 < 0x20; iVar6 = iVar6 + 1) {
    iVar5 = DAT_6000_cd12 + iVar6 * 0x44c;
    *(undefined2 *)((int)(undefined4 *)&DAT_6000_cb58 + iVar6 * 4 + 2) = _DAT_6000_cd14;
    *(int *)((undefined4 *)&DAT_6000_cb58 + iVar6) = iVar5;
    for (local_4 = 0; local_4 < 0x44c; local_4 = local_4 + 1) {
      *(undefined1 *)((int)((undefined4 *)&DAT_6000_cb58)[iVar6] + local_4) = 0;
    }
  }
  return;
}


// ==== random_n @ 2000:2d36 (size 84) callers: generate_section,monster_turn,FUN_2000_9ed9,movecontrol,FUN_2000_c9d2,FUN_2000_caba,FUN_2000_cbdf,FUN_2000_cccc,FUN_2000_cdc5,FUN_2000_d358,FUN_3000_9383,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a,FUN_3000_d51c,FUN_3000_e221  // reseeds from the clock, then returns rand() * n / 32768

undefined2 __cdecl16far random_n(int param_1)

{
  int iVar1;
  short sVar2;
  long lVar3;
  long b;
  
  iVar1 = clock_ticks();
  srand(DAT_6000_cd1a + iVar1);
  iVar1 = clock_ticks();
  DAT_6000_cd1a = DAT_6000_cd1a + iVar1;
  b = 0x8000;
  sVar2 = rand();
  lVar3 = N_LXMUL((long)param_1,(long)sVar2);
  lVar3 = F_LDIV(lVar3,b);
  return (int)lVar3;
}


// ==== FUN_2000_2d8e @ 2000:2d8e (size 222) callers: FUN_2000_2e6c,bank,FUN_2000_7756,movecontrol,FUN_2000_d358,FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_bdb5

void __cdecl16far FUN_2000_2d8e(void)

{
  int iVar1;
  int iVar2;
  long lVar3;
  
  iVar2 = DAT_6000_c131;
  if (DAT_6000_c8c5 != '\0') {
    iVar2 = 0;
  }
  lVar3 = F_LDIV(CONCAT22(DAT_6000_c550,DAT_6000_c54e),0x10);
  iVar1 = (int)lVar3;
  lVar3 = F_LDIV(CONCAT22(DAT_6000_c554,DAT_6000_c552),0x10);
  iVar1 = iVar1 + (int)lVar3;
  lVar3 = F_LDIV(CONCAT22(DAT_6000_c558,DAT_6000_c556),0x10);
  iVar1 = iVar1 + (int)lVar3;
  lVar3 = F_LDIV(CONCAT22(DAT_6000_c55c,DAT_6000_c55a),0x10);
  iVar1 = iVar1 + (int)lVar3;
  lVar3 = F_LDIV(CONCAT22(DAT_6000_c560,DAT_6000_c55e),0x10);
  DAT_6000_c133 = iVar1 + (int)lVar3 + iVar2;
  for (iVar2 = 0; iVar2 < 7; iVar2 = iVar2 + 1) {
    DAT_6000_c133 =
         DAT_6000_c133 +
         (int)(char)((undefined1 *)&DAT_6000_c1a2)[iVar2] * (int)*(char *)(iVar2 * 5 + 0x218);
  }
  for (iVar2 = 0; iVar2 < 8; iVar2 = iVar2 + 1) {
    DAT_6000_c133 =
         DAT_6000_c133 +
         (int)(char)((undefined1 *)&DAT_6000_c173)[iVar2] * (int)*(char *)(iVar2 * 7 + 0x1c6);
  }
  return;
}


// ==== FUN_2000_2e6c @ 2000:2e6c (size 123) callers: inn

void __cdecl16far FUN_2000_2e6c(void)

{
  DAT_6000_c8c1 = 0;
  DAT_6000_c8c0 = 0;
  if (DAT_6000_c8cc != '\0') {
    DAT_6000_c904 = DAT_6000_c904 + -5;
    DAT_6000_c8cc = '\0';
  }
  if (DAT_6000_c8cd != '\0') {
    DAT_6000_c90c = DAT_6000_c90c + -5;
    DAT_6000_c8cd = '\0';
  }
  if (DAT_6000_c8ce != '\0') {
    DAT_6000_c904 = DAT_6000_c904 + -10;
    DAT_6000_c8ce = '\0';
  }
  if (DAT_6000_c8cf != '\0') {
    DAT_6000_c90c = DAT_6000_c90c + -10;
    DAT_6000_c8cf = '\0';
  }
  if (DAT_6000_c8c5 == '\x01') {
    FUN_2000_2d8e();
    DAT_6000_c8c5 = '\0';
  }
  if (DAT_6000_c8c7 == '\x01') {
    DAT_6000_c8c7 = '\0';
  }
  if (DAT_6000_c8c6 == '\x01') {
    DAT_6000_c8c6 = '\0';
  }
  return;
}


// ==== store @ 2000:2ee7 (size 414) callers: movecontrol  // the general store menu

void __cdecl16far store(void)

{
  uint *puVar1;
  uint *puVar2;
  uint uVar3;
  int iVar4;
  int iVar5;
  uint *puVar6;
  uint *puVar7;
  undefined2 unaff_SS;
  bool bVar8;
  uint local_82 [7];
  uint local_74 [30];
  char *pcStack_38;
  undefined2 uStack_36;
  char *pcStack_34;
  char *pcStack_32;
  char *pcStack_30;
  char *pcStack_2e;
  char *pcStack_2c;
  char *pcStack_2a;
  char *pcStack_28;
  uint local_20 [7];
  uint local_12 [7];
  int local_4;
  
  puVar6 = (uint *)&DAT_6000_1265;
  puVar7 = local_12;
  for (iVar4 = 7; iVar4 != 0; iVar4 = iVar4 + -1) {
    puVar2 = puVar7;
    puVar7 = puVar7 + 1;
    puVar1 = puVar6;
    puVar6 = puVar6 + 1;
    *puVar2 = *puVar1;
  }
  puVar6 = (uint *)&DAT_6000_1273;
  puVar7 = local_20;
  for (iVar4 = 7; iVar4 != 0; iVar4 = iVar4 + -1) {
    puVar2 = puVar7;
    puVar7 = puVar7 + 1;
    puVar1 = puVar6;
    puVar6 = puVar6 + 1;
    *puVar2 = *puVar1;
  }
  pcStack_28 = (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47;
  pcStack_2a = (char *)s_3__EXIT_STORE__OR_ESC__6000_1e2e;
  pcStack_2c = (char *)s_2__ARMOR_6000_1e25;
  pcStack_2e = (char *)s_1__WEAPONS_6000_1e1a;
  pcStack_30 = (char *)s_WHAT_WOULD_YOU_LIKE_TO_BUY__6000_1dfe;
  pcStack_32 = (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47;
  pcStack_34 = (char *)s_YOU_HAVE_ENTERED_A_STORE_6000_1de5;
  uStack_36 = 0x2000;
  pcStack_38 = (char *)s_IN_THE_NORTH_6000_2f22 + 0xb;
  FUN_2000_216b();
  pcStack_28 = (char *)0x3;
  pcStack_2a = (char *)0x2000;
  pcStack_2c = (char *)s_IN_THE_SOUTH_6000_2f30 + 0xc;
  local_4 = FUN_2000_1fbd();
  if (local_4 == 0x31) {
    pcStack_28 = (char *)DAT_6000_c546;
    pcStack_2a = (char *)s_MONEY_ON_HAND__6000_1eff;
    pcStack_2c = (char *)0x2000;
    pcStack_2e = (char *)s_THE_FLOOR_SEEMS_TO_BE_MADE_6000_2f4d + 0xf;
    FUN_4000_428f();
    pcStack_28 = (char *)s_6__LONG_SWORD___450_JP_6000_1ee8;
    pcStack_2a = (char *)s_5__SHORTSWORD___250_JP_6000_1ed1;
    pcStack_2c = (char *)s_4__KNIFE_________30_JP_6000_1eba;
    pcStack_2e = (char *)s_3__MACE_________300_JP_6000_1ea3;
    pcStack_30 = (char *)s_2__CLUB__________15_JP_6000_1e8c;
    pcStack_32 = (char *)s_1__STICK__________1_JP_6000_1e75;
    pcStack_34 = (char *)s_PLEASE_SELECT_A_WEAPON__6000_1e5d;
    uStack_36 = 0x4000;
    pcStack_38 = (char *)s_OF_SOLID_ROCK__IT_IS_NOT_6000_2f68 + 0x18;
    FUN_2000_216b();
    pcStack_28 = (char *)0x1;
    pcStack_2a = (char *)0x4000;
    pcStack_2c = (char *)s_POSSIBLE_TO_DIG_HERE__6000_2f83 + 0xc;
    iVar4 = FUN_2000_1fbd();
    local_4 = iVar4;
    if ((0x30 < iVar4) && (iVar4 < 0x37)) {
      iVar5 = (int)local_74[iVar4] >> 0xf;
      if ((iVar5 <= (int)DAT_6000_c548) &&
         ((iVar5 < (int)DAT_6000_c548 || (local_74[iVar4] < DAT_6000_c546)))) {
        local_4 = iVar4 + -0x31;
        *(char *)(iVar4 + -0x3ebd) = *(char *)(iVar4 + -0x3ebd) + '\x01';
        uVar3 = local_12[iVar4 + -0x31];
        bVar8 = DAT_6000_c546 < uVar3;
        DAT_6000_c546 = DAT_6000_c546 - uVar3;
        DAT_6000_c548 = (DAT_6000_c548 - ((int)uVar3 >> 0xf)) - (uint)bVar8;
      }
    }
  }
  else if (local_4 == 0x32) {
    pcStack_28 = (char *)DAT_6000_c546;
    pcStack_2a = (char *)s_MONEY_ON_HAND__6000_1eff;
    pcStack_2c = (char *)0x2000;
    pcStack_2e = (char *)s_IT_MAY_TAKE_SOME_TIME__BUT_6000_2ff5 + 4;
    FUN_4000_428f();
    pcStack_28 = (char *)s_6__FIELD_PLATE__9900_JP_6000_1f9c;
    pcStack_2a = (char *)s_5__PLATE________4000_JP_6000_1f84;
    pcStack_2c = (char *)s_4__SCALE________1500_JP_6000_1f6c;
    pcStack_2e = (char *)s_3__CHAIN_________300_JP_6000_1f54;
    pcStack_30 = (char *)s_2__LEATHER________50_JP_6000_1f3c;
    pcStack_32 = (char *)s_1__ROBES__USELESS__1_JP_6000_1f24;
    pcStack_34 = (char *)s_PLEASE_SELECT_ARMOR__6000_1f0f;
    uStack_36 = 0x4000;
    pcStack_38 = (char *)s_IF_YOU_ARE_TRAPPED__THEN_6000_3010 + 0xd;
    FUN_2000_216b();
    pcStack_28 = (char *)0x1;
    pcStack_2a = (char *)0x4000;
    pcStack_2c = (char *)s_YOU_HAVE_NO_CHOICE__6000_302b + 1;
    iVar4 = FUN_2000_1fbd();
    local_4 = iVar4;
    if ((((0x30 < iVar4) && (iVar4 < 0x37)) && (DAT_6000_c548 < 0x8000)) &&
       ((0 < (int)DAT_6000_c548 || (local_82[iVar4] < DAT_6000_c546)))) {
      local_4 = iVar4 + -0x31;
      *(char *)(iVar4 + -0x3e8f) = *(char *)(iVar4 + -0x3e8f) + '\x01';
      bVar8 = DAT_6000_c546 < local_20[iVar4 + -0x31];
      DAT_6000_c546 = DAT_6000_c546 - local_20[iVar4 + -0x31];
      DAT_6000_c548 = DAT_6000_c548 - bVar8;
    }
  }
  pcStack_28 = (char *)s_A_MONSTER_WANTS_TO_HELP_6000_3074 + 0xb;
  flush_keys();
  return;
}


// ==== FUN_2000_3085 @ 2000:3085 (size 924) callers: movecontrol

void __cdecl16far FUN_2000_3085(void)

{
  uint *puVar1;
  uint *puVar2;
  short sVar3;
  int iVar4;
  uint *puVar5;
  uint *puVar6;
  undefined2 unaff_SS;
  bool bVar7;
  long lVar8;
  uint local_e0 [86];
  char *pcStackY_34;
  undefined2 uStackY_32;
  char *pcStackY_30;
  char *pcStackY_2e;
  undefined2 uVar9;
  undefined2 uVar10;
  uint local_1c [10];
  int local_8;
  int local_6;
  int local_4;
  
  puVar5 = (uint *)&DAT_6000_1281;
  puVar6 = local_1c;
  for (iVar4 = 0xc; iVar4 != 0; iVar4 = iVar4 + -1) {
    puVar2 = puVar6;
    puVar6 = puVar6 + 1;
    puVar1 = puVar5;
    puVar5 = puVar5 + 1;
    *puVar2 = *puVar1;
  }
  uVar10 = 0;
  uVar9 = 0x8000;
  sVar3 = rand();
  lVar8 = N_LXMUL(0x14,(long)sVar3);
  lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
  DAT_6000_c8fc = DAT_6000_c89a * 500 + (int)lVar8;
  DAT_6000_c8fe = DAT_6000_c8fc >> 0xf;
  if ((DAT_6000_c8fe < 1) && (DAT_6000_c8fe < 0)) {
    DAT_6000_c8fe = 1;
    DAT_6000_c8fc = -0x7960;
  }
  if (0x3c < DAT_6000_c89a) {
    DAT_6000_c8fe = 7;
    DAT_6000_c8fc = -0x5ee0;
  }
  local_6 = DAT_6000_c8fe;
  local_8 = DAT_6000_c8fc;
  uVar10 = 0;
  uVar9 = 0x4af;
  lVar8 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  pcStackY_2e = (char *)s_DIFFICULT_TO_HOLD_YOUR_6000_311e + 0x11;
  F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
  uVar10 = 0;
  uVar9 = 0x63f;
  lVar8 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  pcStackY_2e = (char *)0x1000;
  pcStackY_30 = (char *)s_YOU_HAVE_FOUND_A_TRAP_DOOR_6000_3142 + 0xe;
  F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
  pcStackY_2e = (char *)s_YOU_HAVE_FOUND_A_TRAP_DOOR_6000_3142 + 0x1a;
  fill_rect();
  FUN_4000_428f();
  pcStackY_2e = (char *)s_UNFORTUNATELY__YOU_DO_6000_3177 + 0xf;
  print_text();
  FUN_4000_428f();
  pcStackY_2e = (char *)s_PLEASE_SELECT_A_SPELL_6000_1fd9;
  pcStackY_30 = (char *)s_YOU_ARE_IN_A_TEMPLE_6000_1fc5;
  uStackY_32 = 0x4000;
  pcStackY_34 = (char *)s_THIS_KEY_CAN_ONLY_BE_6000_31a9 + 0x13;
  FUN_2000_216b();
  local_4 = FUN_2000_1fbd();
  if ((0x30 < local_4) && (local_4 < 0x37)) {
    if (((int)local_e0[local_4 * 2 + 1] <= (int)DAT_6000_c548) &&
       ((local_e0[local_4 * 2 + 1] != DAT_6000_c548 || (local_e0[local_4 * 2] <= DAT_6000_c546)))) {
      local_4 = local_4 + -0x31;
      bVar7 = DAT_6000_c546 < local_1c[local_4 * 2];
      DAT_6000_c546 = DAT_6000_c546 - local_1c[local_4 * 2];
      DAT_6000_c548 = (DAT_6000_c548 - local_1c[local_4 * 2 + 1]) - (uint)bVar7;
      switch(local_4) {
      case 0:
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar3 = rand();
        lVar8 = N_LXMUL(10,(long)sVar3);
        lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
        DAT_6000_c123 = DAT_6000_c123 + (int)lVar8 + 1;
        if (DAT_6000_c125 < DAT_6000_c123) {
          DAT_6000_c123 = DAT_6000_c125;
        }
        break;
      case 1:
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar3 = rand();
        lVar8 = N_LXMUL(0xf,(long)sVar3);
        lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
        iVar4 = (int)lVar8;
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar3 = rand();
        lVar8 = N_LXMUL(0xf,(long)sVar3);
        pcStackY_2e = (char *)s_HIT__D__TO_DIG_A_HOLE_6000_32a1 + 0x15;
        lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
        iVar4 = iVar4 + (int)lVar8;
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar3 = rand();
        lVar8 = N_LXMUL(0xf,(long)sVar3);
        pcStackY_2e = (char *)s_DOOR_HERE__KEEP_SEARCHING_6000_32cc + 0x10;
        lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
        iVar4 = iVar4 + (int)lVar8;
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar3 = rand();
        lVar8 = N_LXMUL(0xf,(long)sVar3);
        pcStackY_2e = (char *)s_PLEASE_SELECT_YOUR_ARMOR__6000_32fd + 5;
        lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
        iVar4 = iVar4 + (int)lVar8;
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar3 = rand();
        lVar8 = N_LXMUL(0xf,(long)sVar3);
        pcStackY_2e = (char *)s_CHARACTERS_OF_YOUR_PROFESSION_6000_3317 + 0x11;
        lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
        DAT_6000_c123 = DAT_6000_c123 + iVar4 + (int)lVar8 + 10;
        if (DAT_6000_c125 < DAT_6000_c123) {
          DAT_6000_c123 = DAT_6000_c125;
        }
        break;
      case 2:
        DAT_6000_c123 = DAT_6000_c125;
        break;
      case 3:
        DAT_6000_c8be = 0xffff;
        break;
      case 4:
        DAT_6000_c8bc = 0xffff;
        break;
      case 5:
        DAT_6000_c8f8 = DAT_6000_c89e;
        DAT_6000_c8fa = DAT_6000_c8a0;
        DAT_6000_c8f6 = DAT_6000_c8a4;
      }
      goto LAB_2000_33c3;
    }
  }
  if ((0x30 < local_4) && (local_4 < 0x37)) {
    if (((int)DAT_6000_c548 <= (int)local_1c[local_4 * 2 + 1]) &&
       (((int)DAT_6000_c548 < (int)local_1c[local_4 * 2 + 1] ||
        (DAT_6000_c546 < local_1c[local_4 * 2])))) {
      pcStackY_2e = (char *)s_HERE__6000_20b5;
      pcStackY_30 = (char *)s_SORRY__CAN_T_BUY_ON_CREDIT_6000_209a;
      uStackY_32 = 0x4000;
      pcStackY_34 = (char *)s_CAN_NOT_USE_THAT_WEAPON__6000_33b4 + 0xc;
      FUN_2000_22ff();
    }
  }
LAB_2000_33c3:
  uVar10 = 0;
  uVar9 = 0x4af;
  lVar8 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  pcStackY_2e = (char *)s_YOU_SHOULD__THEREFORE_6000_33cf + 0x17;
  F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
  uVar10 = 0;
  uVar9 = 0x63f;
  lVar8 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  pcStackY_2e = (char *)0x1000;
  pcStackY_30 = (char *)s_WEIGHT__6000_3401 + 6;
  F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
  pcStackY_2e = (char *)s_EXPANDED_DUNGEON_MAP__HIT_ANY_KE_6000_340b + 8;
  fill_rect();
  flush_keys();
  return;
}


// ==== financial_statement @ 2000:342d (size 388) callers: bank,movecontrol,FUN_3000_bdb5  // the money breakdown screen

void __cdecl16far financial_statement(void)

{
  char *pcVar1;
  long lVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  undefined2 uVar6;
  
  uVar6 = 0;
  uVar5 = 0;
  uVar3 = 0x4af;
  lVar2 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar2 = F_LDIV(lVar2,CONCAT22(uVar5,uVar3));
  uVar3 = (undefined2)lVar2;
  uVar4 = 0;
  uVar5 = 0x63f;
  lVar2 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar2 = F_LDIV(lVar2,CONCAT22(uVar4,uVar5));
  fill_rect(0,0,(int)lVar2,uVar3,uVar6);
  print_text(0,0,0,(char *)s_YOUR_FINANCIAL_STATEMENT__6000_20cc,4);
  pcVar1 = (char *)FUN_4000_428f((char *)s_COPPER_STONES__6000_20e6,DAT_6000_c54e,DAT_6000_c550);
  strcpy(DAT_6000_cd80,pcVar1);
  pcVar1 = (char *)FUN_4000_428f((char *)s_SILVER_STONES__6000_20f8,DAT_6000_c552,DAT_6000_c554);
  strcpy(DAT_6000_cd82,pcVar1);
  pcVar1 = (char *)FUN_4000_428f((char *)s_IVORY_STONES__6000_210a,DAT_6000_c556,DAT_6000_c558);
  strcpy(DAT_6000_cd84,pcVar1);
  pcVar1 = (char *)FUN_4000_428f((char *)s_GOLD_STONES__6000_211c,DAT_6000_c55a,DAT_6000_c55c);
  strcpy(DAT_6000_cd86,pcVar1);
  pcVar1 = (char *)FUN_4000_428f((char *)s_PLATINUM_STONES__6000_212e,DAT_6000_c55e,DAT_6000_c560);
  strcpy(DAT_6000_cd88,pcVar1);
  pcVar1 = (char *)FUN_4000_428f((char *)s_JEWEL_STONES__6000_2140,DAT_6000_c562,DAT_6000_c564);
  strcpy(DAT_6000_cd8a,pcVar1);
  pcVar1 = (char *)FUN_4000_428f((char *)s_JEWELS_IN_POCKET__6000_2152,DAT_6000_c546,DAT_6000_c548);
  strcpy(DAT_6000_cd8c,pcVar1);
  pcVar1 = (char *)FUN_4000_428f((char *)s_JEWELS_IN_BANK__6000_2164,DAT_6000_c54a,DAT_6000_c54c);
  strcpy(DAT_6000_cd8e,pcVar1);
  FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
  return;
}


// ==== inn @ 2000:35b1 (size 357) callers: movecontrol  // the Flea Bag Inn

/* WARNING: Removing unreachable block (ram,0x00023649) */

void __cdecl16far inn(void)

{
  undefined2 uVar1;
  int iVar2;
  bool bVar3;
  long lVar4;
  
  FUN_2000_22ff((char *)s_WELCOME_TO_THE_FLEA_BAG_INN_6000_2176,
                (char *)s_A_WOODEN_SIGN_READS__6000_2192,
                (char *)s_OUR_FINE_ACCOMODATIONS_WILL_6000_21aa,
                (char *)s_COST_10_JEWEL_PIECES__PLEASE_6000_21c6,
                (char *)s_CHECK_THE_BED_CAREFULLY_BEFORE_6000_21e3,(char *)s_LYING_DOWN__6000_2202,
                (char *)s_ALSO__WE_ARE_NOT_RESPONSIBLE_6000_220f);
  uVar1 = FUN_4000_428f((char *)s_MONEY_ON_HAND__6000_1eff,DAT_6000_c546,DAT_6000_c548,
                        (char *)s_WOULD_YOU_LIKE_TO_STAY__6000_2275,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_1__STAY_FOR_THE_NIGHT_6000_228d,
                        (char *)s_2__RUN_FOR_YOUR_LIFE_6000_22a3);
  FUN_2000_216b((char *)s_THE_ROOMS_IN_THIS_FINE_HOTEL_6000_2242,
                (char *)s_COST_10_JP_PER_NIGHT__6000_225f,uVar1);
  iVar2 = FUN_2000_1fbd(5);
  if (iVar2 == 0x31) {
    lVar4 = N_LXMUL(10,1);
    if (CONCAT22(DAT_6000_c548,DAT_6000_c546) < lVar4) {
      F_LDIV(CONCAT22(DAT_6000_c548,DAT_6000_c546),10);
      FUN_2000_22ff((char *)s_THREE_BIG_THUGS_BEAT_YOU_6000_22d1,
                    (char *)s_UP_AND_THROW_YOU_OUT_BECAUSE_6000_22ea,
                    (char *)s_YOU_CAN_T_PAY_YOUR_BILL__6000_2307,
                    (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                    (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                    (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                    (char *)s_HIT_ANY_KEY____6000_20bd,
                    (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
    }
    else {
      bVar3 = DAT_6000_c546 < 10;
      DAT_6000_c546 = DAT_6000_c546 - 10;
      DAT_6000_c548 = DAT_6000_c548 - (uint)bVar3;
      lVar4 = N_LXLSH(1,'\x03');
      lVar4 = N_LXMUL(0xe10,lVar4);
      lVar4 = lVar4 + CONCAT22(DAT_6000_c8b4,DAT_6000_c8b2);
      DAT_6000_c8b2 = (undefined2)lVar4;
      DAT_6000_c8b4 = (undefined2)((ulong)lVar4 >> 0x10);
      DAT_6000_c129 = DAT_6000_c12d;
      DAT_6000_c127 = DAT_6000_c12b;
      FUN_2000_86b9();
      FUN_2000_2e6c();
      iVar2 = FUN_2000_5ae2();
      if (iVar2 != 0) {
        DAT_6000_c89a = FUN_2000_5b41();
        FUN_2000_22ff((char *)s_CONGRATULATIONS__YOU_HAVE_BECOME_6000_2320,
                      (char *)s_MORE_POWERFUL__WHEN_YOU_GAIN_6000_2341,
                      (char *)s_LEVELS__YOU_GAIN_HEALTH_POINTS_6000_235e,
                      (char *)s_AND_YOU_FIGHT_BETTER__NOW_YOU_6000_237d,
                      (char *)s_SHOULD_BE_ABLE_TO_BEAT_MONSTERS_6000_239b,
                      (char *)s_MORE_EASILY__OR_YOU_CAN_FIGHT_6000_23bb,
                      (char *)s_NASTIER_MONSTERS__6000_23d9,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
      }
    }
  }
  flush_keys();
  return;
}


// ==== bank @ 2000:3716 (size 963) callers: movecontrol  // Moraff's First National Bank

void __cdecl16far bank(void)

{
  int iVar1;
  char *pcVar2;
  char *pcVar3;
  int iVar4;
  bool bVar5;
  long lVar6;
  long lVar7;
  char local_60 [60];
  undefined1 local_24 [30];
  uint local_6;
  int local_4;
  
  do {
    FUN_2000_216b((char *)s_WELCOME_TO_MORAFF_S_FIRST_6000_23eb,(char *)s_NATIONAL_BANK__6000_2405,
                  (char *)s_OPTIONS__6000_2416,(char *)s_1__CONVERT_TO_JEWEL_PIECES_6000_241f,
                  (char *)s_2__DEPOSIT_MONEY_6000_243a,(char *)s_3__WITHDRAW_MONEY_6000_244b,
                  (char *)s_4__ROB_BANK_6000_245d,(char *)s_5__LEAVE_BANK_6000_2469);
    iVar1 = FUN_2000_1fbd(3,7);
    switch(iVar1) {
    case 0x31:
      lVar6 = N_LXMUL(5,CONCAT22(DAT_6000_c560,DAT_6000_c55e));
      lVar6 = lVar6 + CONCAT22(DAT_6000_c564,DAT_6000_c562);
      lVar7 = F_LDIV(CONCAT22(DAT_6000_c55c,DAT_6000_c55a),2);
      lVar7 = lVar7 + lVar6;
      lVar6 = F_LDIV(CONCAT22(DAT_6000_c558,DAT_6000_c556),4);
      lVar6 = lVar6 + lVar7;
      lVar7 = F_LDIV(CONCAT22(DAT_6000_c554,DAT_6000_c552),0xc);
      lVar7 = lVar7 + lVar6;
      lVar6 = F_LDIV(CONCAT22(DAT_6000_c550,DAT_6000_c54e),200);
      lVar6 = lVar6 + lVar7 + CONCAT22(DAT_6000_c548,DAT_6000_c546);
      DAT_6000_c546 = (uint)lVar6;
      DAT_6000_c548 = (int)((ulong)lVar6 >> 0x10);
      DAT_6000_c564 = 0;
      DAT_6000_c562 = 0;
      DAT_6000_c560 = 0;
      DAT_6000_c55e = 0;
      DAT_6000_c55c = 0;
      DAT_6000_c55a = 0;
      DAT_6000_c558 = 0;
      DAT_6000_c556 = 0;
      DAT_6000_c554 = 0;
      DAT_6000_c552 = 0;
      DAT_6000_c550 = 0;
      DAT_6000_c54e = 0;
      financial_statement();
      wait_key();
      FUN_2000_2d8e();
      break;
    case 0x32:
      pcVar2 = (char *)ltoa(DAT_6000_c546,DAT_6000_c548,local_24,10);
      pcVar3 = strcpy(DAT_6000_cb52,(char *)s_MONEY_AVAILABLE__6000_2477);
      pcVar2 = strcat(pcVar3,pcVar2);
      strcpy(local_60,pcVar2);
      print_text();
      print_text();
      print_text();
      iVar4 = 0;
      read_string(local_24,0,0,0x186);
      local_6 = FUN_1000_3384(local_24);
      if (((DAT_6000_c548 < iVar4) || ((iVar4 == DAT_6000_c548 && (DAT_6000_c546 < local_6)))) ||
         ((local_4 = iVar4, iVar4 < 1 && (iVar4 < 0)))) {
        local_4 = DAT_6000_c548;
        local_6 = DAT_6000_c546;
      }
      bVar5 = DAT_6000_c546 < local_6;
      DAT_6000_c546 = DAT_6000_c546 - local_6;
      DAT_6000_c548 = (DAT_6000_c548 - local_4) - (uint)bVar5;
      bVar5 = CARRY2(DAT_6000_c54a,local_6);
      DAT_6000_c54a = DAT_6000_c54a + local_6;
      DAT_6000_c54c = DAT_6000_c54c + local_4 + (uint)bVar5;
      financial_statement();
      wait_key();
      break;
    case 0x33:
      pcVar2 = (char *)ltoa(DAT_6000_c54a,DAT_6000_c54c,local_24,10);
      pcVar3 = strcpy(DAT_6000_cb52,(char *)s_MONEY_AVAILABLE__6000_2477);
      pcVar2 = strcat(pcVar3,pcVar2);
      strcpy(local_60,pcVar2);
      print_text();
      print_text();
      print_text();
      iVar4 = 0;
      read_string(local_24,0,0,0x186);
      local_6 = FUN_1000_3384(local_24);
      if (((DAT_6000_c54c < iVar4) || ((iVar4 == DAT_6000_c54c && (DAT_6000_c54a < local_6)))) ||
         ((local_4 = iVar4, iVar4 < 1 && (iVar4 < 0)))) {
        local_4 = DAT_6000_c54c;
        local_6 = DAT_6000_c54a;
      }
      bVar5 = CARRY2(DAT_6000_c546,local_6);
      DAT_6000_c546 = DAT_6000_c546 + local_6;
      DAT_6000_c548 = DAT_6000_c548 + local_4 + (uint)bVar5;
      bVar5 = DAT_6000_c54a < local_6;
      DAT_6000_c54a = DAT_6000_c54a - local_6;
      DAT_6000_c54c = (DAT_6000_c54c - local_4) - (uint)bVar5;
      financial_statement();
      wait_key();
      break;
    case 0x34:
      FUN_2000_20da((char *)s_COME_ON__DO_YOU_REALLY_6000_24b1,
                    (char *)s_THINK_I_D_LET_YOU_ROB_6000_24c8);
    }
  } while ((iVar1 != 0x1b) && (iVar1 != 0x35));
  flush_keys();
  return;
}


// ==== FUN_2000_3ae1 @ 2000:3ae1 (size 430) callers: main,movecontrol

void __cdecl16far FUN_2000_3ae1(int param_1)

{
  long lVar1;
  long b;
  
  if (param_1 == 0) {
    DAT_6000_cd7e = 4;
    if (DAT_6000_cd94 == 0) {
      DAT_6000_4488 = 3;
      DAT_6000_4489 = 0x50;
      DAT_6000_448a = 0x6e;
    }
    if ((0 < DAT_6000_cd94) && (DAT_6000_cd94 < 4)) {
      DAT_6000_4488 = 4;
      DAT_6000_4489 = 0x50;
      DAT_6000_448a = 0x25;
    }
    if (DAT_6000_cd94 == 4) {
      DAT_6000_4488 = 4;
      DAT_6000_4489 = 0x50;
      DAT_6000_448a = 0x6e;
    }
    if (DAT_6000_cd94 == 5) {
      DAT_6000_4488 = 3;
      DAT_6000_4489 = 0x50;
      DAT_6000_448a = 0x6e;
    }
    if ((DAT_6000_cd94 == 6) || (DAT_6000_cd94 == 0xb)) {
      DAT_6000_4488 = 4;
      DAT_6000_4489 = 0x50;
      DAT_6000_448a = 0x6e;
    }
    if (DAT_6000_cd94 == 7) {
      DAT_6000_4488 = 5;
      DAT_6000_4489 = 0x50;
      DAT_6000_448a = 0x6e;
    }
    if (((DAT_6000_cd94 == 8) || (DAT_6000_cd94 == 9)) || (DAT_6000_cd94 == 10)) {
      DAT_6000_4488 = 7;
      DAT_6000_4489 = 0x50;
      DAT_6000_448a = 0x6e;
    }
  }
  if (param_1 == 1) {
    b = 0x4b0;
    lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,b);
    DAT_6000_cd7e = (undefined2)lVar1;
    if (DAT_6000_cd94 == 0) {
      DAT_6000_4488 = 8;
      DAT_6000_4489 = 0x10;
      DAT_6000_448a = 0x16;
    }
    if ((0 < DAT_6000_cd94) && (DAT_6000_cd94 < 4)) {
      DAT_6000_4488 = 4;
      DAT_6000_4489 = 0xd;
      DAT_6000_448a = 0x18;
    }
    if (DAT_6000_cd94 == 4) {
      DAT_6000_4488 = 8;
      DAT_6000_4489 = 8;
      DAT_6000_448a = 0x1e;
    }
    if (DAT_6000_cd94 == 5) {
      DAT_6000_4488 = 8;
      DAT_6000_4489 = 0xe;
      DAT_6000_448a = 0x16;
    }
    if ((DAT_6000_cd94 == 6) || (DAT_6000_cd94 == 0xb)) {
      DAT_6000_4488 = 8;
      DAT_6000_4489 = 0xe;
      DAT_6000_448a = 0x1e;
    }
    if (DAT_6000_cd94 == 7) {
      DAT_6000_4488 = 8;
      DAT_6000_4489 = 0x10;
      DAT_6000_448a = 0x25;
    }
    if (((DAT_6000_cd94 == 8) || (DAT_6000_cd94 == 9)) || (DAT_6000_cd94 == 10)) {
      DAT_6000_4488 = 10;
      DAT_6000_4489 = 0x12;
      DAT_6000_448a = 0x26;
    }
  }
  return;
}


// ==== select_player @ 2000:3c8f (size 832) callers: main  // the ten save slots: name, sex, race, class per slot

void __cdecl16far select_player(void)

{
  void *f;
  short sVar1;
  char *pcVar2;
  int iVar3;
  undefined2 unaff_SS;
  char *pcVar4;
  char local_26 [13];
  undefined1 local_19;
  short local_c;
  int local_a;
  short local_8;
  int local_6;
  int local_4;
  
  print_text(0,0,2,(char *)s_PLEASE_SELECT_A_PLAYER__6000_24ef,4);
  print_text(0,100,1,(char *)s_NUMBER_NAME_SEX_RACE_CLASS_6000_2507,5);
  for (local_4 = 0; local_4 < 10; local_4 = local_4 + 1) {
    itoa(local_4,DAT_6000_cb52,10);
    f = fopen(DAT_6000_cb52,(char *)0x1bd8);
    if (f == (void *)0x0) {
      strcat(DAT_6000_cb52,(char *)s___SELECT_TO_CREATE_A_NEW_CHARACT_6000_2531);
      ((undefined1 *)&DAT_6000_cd1c)[local_4] = 0;
      print_text(0,local_4 * 0x37 + 0xa5,0,DAT_6000_cb52,0xe);
    }
    else {
      ((undefined1 *)&DAT_6000_cd1c)[local_4] = 1;
      for (iVar3 = 0; iVar3 < 0x14; iVar3 = iVar3 + 1) {
        sVar1 = fgetc(f);
        local_26[iVar3] = (char)sVar1;
      }
      local_19 = 0;
      strcat(DAT_6000_cb52,(char *)0x2554);
      pcVar4 = local_26;
      sVar1 = strlen(DAT_6000_cb52);
      pcVar2 = DAT_6000_cb52 + sVar1;
      sVar1 = strlen(local_26);
      strcpy(pcVar2 + -sVar1,pcVar4);
      for (iVar3 = 0; iVar3 < 0x14; iVar3 = iVar3 + 1) {
        fgetc(f);
      }
      local_8 = fgetc(f);
      local_a = fgetc(f);
      local_c = fgetc(f);
      if (local_a == 0) {
        strcat(DAT_6000_cb52,(char *)s_MALE_6000_256b);
      }
      else {
        strcat(DAT_6000_cb52,(char *)s_FEMALE_6000_2563);
      }
      strcat(DAT_6000_cb52,(char *)0x255b);
      pcVar4 = (char *)*(undefined2 *)(local_8 * 0xe + 0x150);
      sVar1 = strlen(DAT_6000_cb52);
      pcVar2 = DAT_6000_cb52 + sVar1;
      sVar1 = strlen((char *)*(undefined2 *)(local_8 * 0xe + 0x150));
      strcpy(pcVar2 + -sVar1,pcVar4);
      strcat(DAT_6000_cb52,(char *)s_COPPER_STONES__6000_20e6 + 0xf);
      strcat(DAT_6000_cb52,(char *)0x2558);
      pcVar4 = (char *)*(undefined2 *)(local_c * 2 + 0x118d);
      sVar1 = strlen(DAT_6000_cb52);
      pcVar2 = DAT_6000_cb52 + sVar1;
      sVar1 = strlen((char *)*(undefined2 *)(local_c * 2 + 0x118d));
      strcpy(pcVar2 + -sVar1,pcVar4);
      strcat(DAT_6000_cb52,(char *)s_COPPER_STONES__6000_20e6 + 0xf);
      print_text(0,local_4 * 0x37 + 0x9b,1,DAT_6000_cb52,6);
      while( true ) {
        sVar1 = kbhit();
        if (sVar1 == 0) break;
        local_6 = getch();
        if (local_6 != 0x1b) {
          sVar1 = kbhit();
          if (sVar1 == 0) {
            FUN_1000_28f4(local_6);
          }
        }
      }
      fclose(f);
    }
  }
  print_text(0,0x44c,2,(char *)s_HIT_ESCAPE_TO_QUIT_6000_2573,5);
  do {
    local_6 = -1;
    sVar1 = kbhit();
    if (sVar1 == 0) {
      if (DAT_6000_d0da != 0) {
        local_6 = mouse_pick(0x1299);
        if (local_6 == 10) {
          local_6 = 0x1b;
        }
        if ((-1 < local_6) && (local_6 < 10)) {
          local_6 = local_6 + 0x30;
        }
      }
    }
    else {
      local_6 = getch();
    }
  } while (((local_6 < 0x30) || (0x39 < local_6)) && (local_6 != 0x1b));
  if (local_6 == 0x1b) {
    if (DAT_6000_cd94 < 1) {
      FUN_4000_0f0d(0);
    }
    else {
      FUN_4000_0f0d(2);
    }
    quit(0);
  }
  DAT_6000_125c = (char)local_6 + -0x30;
  return;
}


// ==== FUN_2000_3fcf @ 2000:3fcf (size 116) callers: FUN_2000_7b86,FUN_3000_b1d6

void __cdecl16far FUN_2000_3fcf(void)

{
  uint uVar1;
  uint uVar2;
  
  strcpy(DAT_6000_cb52,(char *)0x2586);
  strcat(DAT_6000_cb52,(char *)0x2591);
  strcat(DAT_6000_cb52,(char *)0x259d);
  uVar2 = 0;
  while( true ) {
    uVar1 = strlen(DAT_6000_cb52);
    if (uVar1 <= uVar2) break;
    if (DAT_6000_cb52[uVar2] == '`') {
      DAT_6000_cb52[uVar2] = ' ';
    }
    else {
      DAT_6000_cb52[uVar2] = DAT_6000_cb52[uVar2] + '\x02';
    }
    uVar2 = uVar2 + 1;
  }
  return;
}


// ==== game_disk_prompt @ 2000:4043 (size 232) callers: main  // the 360K one-character-per-disk notice

void __cdecl16far game_disk_prompt(void)

{
  void *f;
  short sVar1;
  int iVar2;
  
  f = fopen((char *)0x25ab,(char *)0x1bd8);
  if (f == (void *)0x0) {
    DAT_6000_12f3 = 1;
    flush_keys();
    FUN_4000_10ee();
    FUN_2000_22ff((char *)s_INSERT_THE_GAME_DISK_IN_6000_25b2,
                  (char *)s_THE_DISKETTE_DRIVE_AND_6000_25ca,(char *)s_HIT_ANY_KEY____6000_25e3,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_NOTE_THAT_YOU_CAN_ONLY_6000_25f4,
                  (char *)s_HAVE_ONE_CHARACTER_PER_6000_260b,(char *)s_GAME_DISK_ON_360K_6000_2624,
                  (char *)s_DRIVES__6000_2638);
    f = fopen((char *)0x25ab,(char *)0x1bd8);
LAB_2000_411b:
    if (f == (void *)0x0) {
      f = fopen((char *)0x25ab,(char *)0x1bd8);
      load_h_bin(0x1d);
      do {
        do {
          sVar1 = kbhit();
          if (sVar1 != 0) {
            sVar1 = getch();
            if (sVar1 == 0x1b) {
              quit(0);
            }
            goto LAB_2000_411b;
          }
        } while (DAT_6000_d0da == 0);
        iVar2 = FUN_4000_2d34(1);
        if (iVar2 != 0) {
          quit(0);
        }
        iVar2 = FUN_4000_2d34(0);
      } while (iVar2 == 0);
      goto LAB_2000_411b;
    }
  }
  fclose(f);
  return;
}


// ==== check_v_file @ 2000:412b (size 295) callers: main  // prints and checksums the file V; the registration check

void __cdecl16far check_v_file(void)

{
  void *f;
  short sVar1;
  bool bVar2;
  char local_10;
  char local_d;
  uint local_c;
  int local_a;
  uint local_8;
  char local_5;
  int local_4;
  
  local_5 = '\0';
  local_8 = 0;
  local_a = 0;
  local_c = 0;
  local_d = '\0';
  f = fopen((char *)0x2642,(char *)0x1bcb);
  FUN_1000_1f11(0xe);
  while( true ) {
    local_4 = 0;
    do {
      sVar1 = fgetc(f);
      local_10 = (char)sVar1;
      if (sVar1 == 10) {
        DAT_6000_cb52[local_4] = '\0';
        strcat(DAT_6000_cb52,(char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x45);
      }
      else if (sVar1 != 0x7e) {
        DAT_6000_cb52[local_4] = local_10;
      }
      local_5 = local_5 + local_10;
      local_8 = local_8 + (int)local_5;
      if ((int)local_5 % 2 == 1) {
        bVar2 = CARRY2(local_c,local_8);
        local_c = local_c + local_8;
        local_a = local_a + ((int)local_8 >> 0xf) + (uint)bVar2;
      }
      local_d = (char)local_c + (char)local_8 + local_5 + (char)local_4 + local_d;
      local_4 = local_4 + 1;
    } while ((sVar1 != 10) && (sVar1 != 0x7e));
    if (sVar1 == 0x7e) break;
    FUN_1000_2090(DAT_6000_cb52);
  }
  fclose(f);
  wait_key();
  if ((((local_5 != '\x01') || (local_8 != 0x16f)) || (local_a != 4)) ||
     ((local_c != 0xaf2c || (local_d != -0x52)))) {
    DAT_6000_12f7 = 1;
  }
  return;
}


// ==== load_worldmap_bin @ 2000:4252 (size 64) callers: main,FUN_2000_7b20,movecontrol  // reads WORLDMAP.BIN

void __cdecl16far load_worldmap_bin(void)

{
  void *f;
  short sVar1;
  int iVar2;
  
  f = fopen((char *)s_worldmap_bin_6000_2644,(char *)0x1bd8);
  for (iVar2 = 0; iVar2 < 0x1000; iVar2 = iVar2 + 1) {
    sVar1 = fgetc(f);
    *(undefined1 *)(DAT_6000_cd74 + iVar2) = (char)sVar1;
  }
  fclose(f);
  return;
}


// ==== main @ 2000:4292 (size 672) callers: entry  // argv handling, video setup, then the slot/roll/play loop

void main(undefined2 param_1,undefined2 param_2,int param_3)

{
  short sVar1;
  void *f;
  int iVar2;
  long lVar3;
  long lVar4;
  
  for (iVar2 = 0; iVar2 < 0x68; iVar2 = iVar2 + 1) {
    if (0x78 < *(uint *)(iVar2 * 0x23 + 0x23f)) {
      *(undefined2 *)(iVar2 * 0x23 + 0x23f) = 0xfe;
    }
  }
  if (*(char *)*(undefined2 *)(param_3 + 2) != '~') {
    FUN_2000_27a5(0x1e);
    FUN_2000_2697();
    FUN_1000_128d();
  }
  if (*(char *)*(undefined2 *)(param_3 + 4) == 'S') {
    DAT_6000_12f5 = 1;
  }
  if (*(char *)*(undefined2 *)(param_3 + 4) == 'T') {
    DAT_6000_12f9 = 1;
  }
  DAT_6000_cd94 = *(char *)*(undefined2 *)(param_3 + 6) + -0x30;
  DAT_6000_9636 = FUN_1000_3384();
  DAT_6000_cb52 = malloc(0x6e);
  if (DAT_6000_12f9 == 0) {
    iVar2 = FUN_4000_2cbc();
    if (iVar2 != 0) {
      DAT_6000_d0da = 1;
    }
  }
  if (DAT_6000_d0da != 0) {
    FUN_4000_2d71();
  }
  FUN_1000_1ee8();
  check_v_file();
  if (DAT_6000_cd94 < 0) {
    DAT_6000_cd94 = -DAT_6000_cd94;
    DAT_6000_00c5 = 1;
  }
  if (DAT_6000_cd94 == 7) {
    DAT_6000_9628 = *(undefined2 *)(DAT_6000_9636 * 2 + 0xe1);
  }
  if (DAT_6000_cd94 == 8) {
    DAT_6000_9628 = *(undefined2 *)(DAT_6000_9636 * 2 + 0xf5);
  }
  if (DAT_6000_cd94 == 9) {
    DAT_6000_9628 = *(undefined2 *)(DAT_6000_9636 * 2 + 0x10b);
  }
  FUN_2000_2b73();
  flush_keys();
  FUN_2000_1485();
  FUN_4000_2bd7();
  FUN_2000_1c23();
  lVar4 = 0x4b0;
  lVar3 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar3 = F_LDIV(lVar3,lVar4);
  DAT_6000_cd7e = (undefined2)lVar3;
  FUN_2000_3ae1();
  if (DAT_6000_12f7 != 0) {
    FUN_1000_128d();
  }
  load_dung_bin();
  DAT_6000_cd74 = 0x9af2;
  game_disk_prompt();
  load_worldmap_bin();
  load_dung_bin();
  lVar3 = time((void *)0x0);
  srand((ushort)lVar3);
  lVar4 = 0x8000;
  sVar1 = rand();
  lVar3 = N_LXMUL(2000,(long)sVar1);
  lVar3 = F_LDIV(lVar3,lVar4);
  DAT_6000_cd1a = (undefined2)lVar3;
  FUN_4000_10ee();
  if (DAT_6000_12f5 == 0) {
    FUN_3000_b8cb();
  }
  if (DAT_6000_12f7 == 1) {
    FUN_1000_128d();
  }
  clear_screen();
  flush_keys();
  do {
    if (DAT_6000_12f3 == 0) {
      select_player();
    }
    else {
      DAT_6000_125c = '\0';
    }
    if (DAT_6000_12f3 != 0) {
      f = fopen((char *)0x1485,(char *)0x1bd8);
      if (f == (void *)0x0) {
        DAT_6000_cd1c = 0;
      }
      else {
        DAT_6000_cd1c = 1;
        fclose(f);
      }
    }
    if (((undefined1 *)&DAT_6000_cd1c)[DAT_6000_125c] == '\0') {
      roll_char();
    }
    else {
      load_player();
    }
    enter_level();
    if (DAT_6000_cd94 == 1) {
      DAT_6000_4390 = 1;
    }
    FUN_4000_10ee();
    clear_screen();
    FUN_2000_f853();
    movecontrol();
    clear_screen();
  } while( true );
}


// ==== FUN_2000_4538 @ 2000:4538 (size 59) callers: FUN_3000_1a08,FUN_3000_2796

uint __cdecl16far FUN_2000_4538(int param_1,int param_2)

{
  uint uVar1;
  
  uVar1 = (uint)*(byte *)((int)DAT_6000_cbe2 + param_2 * 0x50 + param_1);
  if (uVar1 != 0xff) {
    return (uint)*(byte *)((int)DAT_6000_cbde + uVar1 * 6 + 4);
  }
  return 0xffff;
}


// ==== FUN_2000_4575 @ 2000:4575 (size 42) callers: FUN_2000_7d60,FUN_2000_81cd,FUN_2000_892d,FUN_2000_97b8,movecontrol,FUN_2000_cbdf,FUN_2000_d195

uint __cdecl16far FUN_2000_4575(int param_1,int param_2)

{
  uint uVar1;
  
  uVar1 = (uint)*(byte *)((int)DAT_6000_cbe2 + param_2 * 0x50 + param_1);
  if (uVar1 == 0xff) {
    return 0xffff;
  }
  return uVar1;
}


// ==== set_occupant @ 2000:45a1 (size 28) callers: generate_section,load_mon_map,FUN_2000_81cd,FUN_2000_a57e,FUN_2000_a64b,movecontrol,FUN_2000_cbdf,FUN_2000_d195  // writes a monster index into the 80x110 occupancy grid

void __cdecl16far set_occupant(int param_1,int param_2,undefined1 param_3)

{
  *(undefined1 *)((int)DAT_6000_cbe2 + param_2 * 0x50 + param_1) = param_3;
  return;
}


// ==== pick_monster @ 2000:45bd (size 227) callers: generate_section  // rolls a monster type the level and WORLD.PIC both allow

int __cdecl16far pick_monster(int param_1)

{
  short sVar1;
  int iVar2;
  long lVar3;
  long lVar4;
  
  do {
    lVar3 = 0x8000;
    sVar1 = rand();
    lVar3 = F_LDIV(CONCAT22((sVar1 >> 0xf) << 1 | (uint)(sVar1 < 0),sVar1 << 1),lVar3);
    iVar2 = param_1;
    if ((int)lVar3 == 1) {
      lVar4 = 0x8000;
      sVar1 = rand();
      lVar3 = N_LXMUL(9,(long)sVar1);
      lVar3 = F_LDIV(lVar3,lVar4);
      iVar2 = (int)lVar3;
    }
    lVar4 = 0x8000;
    sVar1 = rand();
    lVar3 = N_LXMUL(3,(long)sVar1);
    lVar3 = F_LDIV(lVar3,lVar4);
    if ((int)lVar3 == 0) {
      lVar4 = 0x8000;
      sVar1 = rand();
      lVar3 = N_LXMUL(0x68,(long)sVar1);
      lVar3 = F_LDIV(lVar3,lVar4);
      iVar2 = (int)lVar3;
    }
  } while (((DAT_6000_c8a2 < *(uint *)(iVar2 * 0x23 + 0x23d)) ||
           (*(uint *)(iVar2 * 0x23 + 0x23f) < DAT_6000_c8a2)) ||
          (*(char *)(*(char *)(iVar2 * 0x23 + 0x259) + 0x11ef) == '\0'));
  return iVar2;
}


// ==== generate_section @ 2000:46a4 (size 2294) callers: load_mon_map,enter_level,roll_char  // stocks a floor with 145 monsters; never touches the map

void __cdecl16far generate_section(int param_1)

{
  byte *pbVar1;
  undefined2 uVar2;
  char cVar3;
  int iVar4;
  short sVar5;
  uint uVar6;
  int iVar7;
  long lVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  uint local_a;
  int local_8;
  int local_6;
  int local_4;
  
  local_4 = 10;
  lVar8 = time((void *)0x0);
  srand((ushort)lVar8);
  uVar2 = DAT_6000_cbea._2_2_;
  pbVar1 = (byte *)DAT_6000_cbea;
  uVar9 = (byte *)DAT_6000_cbde;
  uVar10 = DAT_6000_cbde._2_2_;
  if (param_1 == DAT_6000_1239) {
    DAT_6000_cbde = (byte *)CONCAT22(DAT_6000_cbe6._2_2_,(undefined2)DAT_6000_cbe6);
    DAT_6000_cbe6._2_2_ = uVar10;
    DAT_6000_cbe6._0_2_ = uVar9;
    DAT_6000_1239 = DAT_6000_1237;
    DAT_6000_1237 = param_1;
    for (iVar7 = 0; iVar7 < 0x2260; iVar7 = iVar7 + 1) {
      *(undefined1 *)((int)DAT_6000_cbe2 + iVar7) = 0xff;
    }
    for (iVar7 = 0; iVar7 < 0x91; iVar7 = iVar7 + 1) {
      uVar9 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
      set_occupant(*(undefined1 *)((int)DAT_6000_cbde + iVar7 * 6),
                    *(undefined1 *)((int)DAT_6000_cbde + iVar7 * 6 + 1),iVar7);
    }
    return;
  }
  if (param_1 != DAT_6000_123b) {
    DAT_6000_123b = DAT_6000_1239;
    DAT_6000_1239 = DAT_6000_1237;
    DAT_6000_cbea._2_2_ = DAT_6000_cbe6._2_2_;
    DAT_6000_cbea._0_2_ = (byte *)(undefined2)DAT_6000_cbe6;
    DAT_6000_cbe6._2_2_ = DAT_6000_cbde._2_2_;
    DAT_6000_cbe6._0_2_ = (byte *)DAT_6000_cbde;
    DAT_6000_cbde._2_2_ = uVar2;
    DAT_6000_cbde._0_2_ = pbVar1;
    for (iVar7 = 0; iVar7 < 0x366; iVar7 = iVar7 + 1) {
      ((byte *)DAT_6000_cbde)[iVar7] = 0;
    }
    for (iVar7 = 0; iVar7 < 0x2260; iVar7 = iVar7 + 1) {
      *(undefined1 *)((int)DAT_6000_cbe2 + iVar7) = 0xff;
    }
    DAT_6000_1237 = param_1;
    if (param_1 == 0) {
      return;
    }
    local_6 = (DAT_6000_c8a4 + 6) % 9;
    while (iVar7 = random_n(2), iVar7 == 0) {
      uVar10 = 0;
      uVar9 = 0x8000;
      sVar5 = rand();
      lVar8 = N_LXMUL(3,(long)sVar5);
      lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
      local_6 = local_6 + (int)lVar8 + -1;
      if (local_6 < 0) {
        local_6 = 8;
      }
      if (8 < local_6) {
        local_6 = 0;
      }
    }
    set_occupant(DAT_6000_c89e,DAT_6000_c8a0,0xfe);
    for (iVar7 = 0; iVar7 < 0x91; iVar7 = iVar7 + 1) {
      do {
        do {
          local_4 = local_4 + 1;
          iVar4 = clock_ticks();
          srand(iVar4 + iVar7 + local_4);
          uVar10 = 0;
          uVar9 = 0x8000;
          sVar5 = rand();
          lVar8 = N_LXMUL(0x50,(long)sVar5);
          lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
          ((byte *)DAT_6000_cbde)[iVar7 * 6] = (byte)lVar8;
          uVar10 = 0;
          uVar9 = 0x8000;
          sVar5 = rand();
          lVar8 = N_LXMUL(0x6e,(long)sVar5);
          lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
          ((byte *)DAT_6000_cbde)[iVar7 * 6 + 1] = (byte)lVar8;
          cVar3 = is_solid(((byte *)DAT_6000_cbde)[iVar7 * 6],
                                ((byte *)DAT_6000_cbde)[iVar7 * 6 + 1],DAT_6000_c8a2,DAT_6000_c8a4);
        } while (cVar3 != '\0');
      } while (*(char *)((int)DAT_6000_cbe2 + (uint)((byte *)DAT_6000_cbde)[iVar7 * 6 + 1] * 0x50 +
                        (uint)((byte *)DAT_6000_cbde)[iVar7 * 6]) != -1);
      set_occupant(((byte *)DAT_6000_cbde)[iVar7 * 6],((byte *)DAT_6000_cbde)[iVar7 * 6 + 1],iVar7)
      ;
      local_8 = pick_monster(local_6);
      if (iVar7 == 0) {
        if (param_1 == 0x7d) {
          if ((DAT_6000_c937 & 0x10) == 0) {
            local_8 = 0x6c;
          }
        }
        else if (param_1 < 0x7e) {
          switch(param_1) {
          case 4:
            if ((DAT_6000_c937 & 1) == 0) {
              local_8 = 0x68;
            }
            break;
          case 8:
            if ((DAT_6000_c937 & 2) == 0) {
              local_8 = 0x69;
            }
            break;
          case 0xc:
            if ((DAT_6000_c937 & 4) == 0) {
              local_8 = 0x6a;
            }
            break;
          case 0x10:
            if ((DAT_6000_c937 & 8) == 0) {
              local_8 = 0x6b;
            }
          }
        }
        else if (param_1 == 0x96) {
          if ((DAT_6000_c937 & 0x20) == 0) {
            local_8 = 0x6d;
          }
        }
        else if (param_1 == 0xaf) {
          if ((DAT_6000_c937 & 0x40) == 0) {
            local_8 = 0x6e;
          }
        }
        else if ((param_1 == 200) && ((DAT_6000_c937 & 0x80) == 0)) {
          local_8 = 0x6f;
        }
        if ((local_8 < 0x70) && (0x67 < local_8)) {
          set_occupant(*(byte *)DAT_6000_cbde,((byte *)DAT_6000_cbde)[1],0xff);
          if ((*(char *)((int)(undefined2 *)&DAT_6000_c8da + local_8) == '\0') &&
             (*(char *)((int)(undefined2 *)&DAT_6000_c8d2 + local_8) == '\0')) {
            do {
              do {
                uVar10 = 0;
                uVar9 = 0x8000;
                sVar5 = rand();
                lVar8 = N_LXMUL(0x32,(long)sVar5);
                lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
                ((byte *)DAT_6000_cbde)[1] = (char)lVar8 + 0x19;
                uVar10 = 0;
                uVar9 = 0x8000;
                sVar5 = rand();
                lVar8 = N_LXMUL(0x32,(long)sVar5);
                lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
                *(byte *)DAT_6000_cbde = (char)lVar8 + 0x19;
                cVar3 = is_solid(*(byte *)DAT_6000_cbde,((byte *)DAT_6000_cbde)[1],
                                      DAT_6000_c8a2,DAT_6000_c8a4);
              } while (cVar3 != '\0');
            } while (*(char *)((int)DAT_6000_cbe2 + (uint)((byte *)DAT_6000_cbde)[1] * 0x50 +
                              (uint)*(byte *)DAT_6000_cbde) != -1);
          }
          else {
            do {
              do {
                uVar10 = 0;
                uVar9 = 0x8000;
                sVar5 = rand();
                lVar8 = N_LXMUL(0xf,(long)sVar5);
                lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
                ((byte *)DAT_6000_cbde)[1] =
                     (*(char *)((int)(undefined2 *)&DAT_6000_c8da + local_8) + (char)lVar8) - 7;
                uVar10 = 0;
                uVar9 = 0x8000;
                sVar5 = rand();
                lVar8 = N_LXMUL(0xf,(long)sVar5);
                lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
                *(byte *)DAT_6000_cbde =
                     (*(char *)((int)(undefined2 *)&DAT_6000_c8d2 + local_8) + (char)lVar8) - 7;
                cVar3 = is_solid(*(byte *)DAT_6000_cbde,((byte *)DAT_6000_cbde)[1],
                                      DAT_6000_c8a2,DAT_6000_c8a4);
              } while (cVar3 != '\0');
            } while (*(char *)((int)DAT_6000_cbe2 + (uint)((byte *)DAT_6000_cbde)[1] * 0x50 +
                              (uint)*(byte *)DAT_6000_cbde) != -1);
          }
          set_occupant(*(byte *)DAT_6000_cbde,((byte *)DAT_6000_cbde)[1],0);
          *(byte *)((int)(undefined2 *)&DAT_6000_c8da + local_8) = ((byte *)DAT_6000_cbde)[1];
          *(byte *)((int)(undefined2 *)&DAT_6000_c8d2 + local_8) = *(byte *)DAT_6000_cbde;
        }
      }
      cVar3 = *(char *)(local_8 * 0x23 + 0x248);
      uVar10 = 0;
      uVar9 = 0x8000;
      sVar5 = rand();
      lVar8 = N_LXMUL((long)(cVar3 * param_1 + 1),(long)sVar5);
      lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
      iVar4 = (int)lVar8;
      cVar3 = *(char *)(local_8 * 0x23 + 0x248);
      uVar10 = 0;
      uVar9 = 0x8000;
      sVar5 = rand();
      lVar8 = N_LXMUL((long)(cVar3 * param_1 + 1),(long)sVar5);
      lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
      local_a = iVar4 + (int)lVar8 + 2 >> 1;
      if ((0x67 < local_8) && (local_8 < 0x70)) {
        local_a = local_a + param_1 * 0x14;
      }
      if (local_a == 0) {
        local_a = 1;
      }
      if (32000 < local_a) {
        local_a = 32000;
      }
      ((byte *)DAT_6000_cbde)[iVar7 * 6 + 2] = (byte)local_a;
      ((byte *)DAT_6000_cbde)[iVar7 * 6 + 3] = (byte)(local_a >> 8);
      ((byte *)DAT_6000_cbde)[iVar7 * 6 + 4] = (byte)local_8;
      if (param_1 < 0xfb) {
        ((byte *)DAT_6000_cbde)[iVar7 * 6 + 5] = (byte)param_1;
      }
      else {
        ((byte *)DAT_6000_cbde)[iVar7 * 6 + 5] = 0xf2;
      }
      while( true ) {
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar5 = rand();
        lVar8 = N_LXMUL(3,(long)sVar5);
        lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
        if ((int)lVar8 != 0) break;
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar5 = rand();
        lVar8 = N_LXMUL(3,(long)sVar5);
        lVar8 = F_LDIV(lVar8,CONCAT22(uVar10,uVar9));
        ((byte *)DAT_6000_cbde)[iVar7 * 6 + 5] =
             ((char)lVar8 + ((byte *)DAT_6000_cbde)[iVar7 * 6 + 5]) - 1;
      }
      if (((byte *)DAT_6000_cbde)[iVar7 * 6 + 5] == 0) {
        ((byte *)DAT_6000_cbde)[iVar7 * 6 + 5] = 1;
      }
      if (0xf2 < ((byte *)DAT_6000_cbde)[iVar7 * 6 + 5]) {
        ((byte *)DAT_6000_cbde)[iVar7 * 6 + 5] = 0xf2;
      }
      uVar6 = (int)((uint)((byte *)DAT_6000_cbde)[iVar7 * 6 + 5] - param_1) >> 0xf;
      if (10 < (int)(((uint)((byte *)DAT_6000_cbde)[iVar7 * 6 + 5] - param_1 ^ uVar6) - uVar6)) {
        ((byte *)DAT_6000_cbde)[iVar7 * 6 + 5] = (byte)param_1;
      }
    }
    return;
  }
  DAT_6000_cbde = (byte *)CONCAT22(DAT_6000_cbea._2_2_,(byte *)DAT_6000_cbea);
  DAT_6000_cbea._2_2_ = uVar10;
  DAT_6000_cbea._0_2_ = (byte *)uVar9;
  DAT_6000_123b = DAT_6000_1237;
  DAT_6000_1237 = param_1;
  for (iVar7 = 0; iVar7 < 0x2260; iVar7 = iVar7 + 1) {
    *(undefined1 *)((int)DAT_6000_cbe2 + iVar7) = 0xff;
  }
  for (iVar7 = 0; iVar7 < 0x91; iVar7 = iVar7 + 1) {
    uVar9 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
    set_occupant(((byte *)DAT_6000_cbde)[iVar7 * 6],((byte *)DAT_6000_cbde)[iVar7 * 6 + 1],iVar7);
  }
  return;
}


// ==== save_mon_map @ 2000:4fb4 (size 198) callers: FUN_2000_7b86  // writes <slot>MON.MAP: three levels, three monster lists

void __cdecl16far save_mon_map(void)

{
  void *f;
  int iVar1;
  
  strcpy(DAT_6000_cb52,(char *)s_mon_map_6000_2678);
  *DAT_6000_cb52 = DAT_6000_125c + '0';
  f = fopen(DAT_6000_cb52,(char *)0x2681);
  fputc(DAT_6000_1237,f);
  fputc(DAT_6000_1239,f);
  fputc(DAT_6000_123b,f);
  for (iVar1 = 0; iVar1 < 0x366; iVar1 = iVar1 + 1) {
    fputc((uint)*(byte *)((int)DAT_6000_cbde + iVar1),f);
  }
  for (iVar1 = 0; iVar1 < 0x366; iVar1 = iVar1 + 1) {
    fputc((uint)*(byte *)((int)DAT_6000_cbe6 + iVar1),f);
  }
  for (iVar1 = 0; iVar1 < 0x366; iVar1 = iVar1 + 1) {
    fputc((uint)*(byte *)((int)DAT_6000_cbea + iVar1),f);
  }
  fclose(f);
  return;
}


// ==== load_mon_map @ 2000:507a (size 284) callers: enter_level  // reads <slot>MON.MAP, or stocks the floor if it is missing

void __cdecl16far load_mon_map(void)

{
  void *f;
  short sVar1;
  int iVar2;
  undefined2 uVar3;
  
  strcpy(DAT_6000_cb52,(char *)s_mon_map_6000_2678);
  *DAT_6000_cb52 = DAT_6000_125c + '0';
  f = fopen(DAT_6000_cb52,(char *)0x1bd8);
  if (f == (void *)0x0) {
    generate_section(DAT_6000_c8a2);
    return;
  }
  DAT_6000_1237 = fgetc(f);
  DAT_6000_1239 = fgetc(f);
  DAT_6000_123b = fgetc(f);
  for (iVar2 = 0; iVar2 < 0x366; iVar2 = iVar2 + 1) {
    sVar1 = fgetc(f);
    *(undefined1 *)((int)DAT_6000_cbde + iVar2) = (char)sVar1;
  }
  for (iVar2 = 0; iVar2 < 0x366; iVar2 = iVar2 + 1) {
    sVar1 = fgetc(f);
    *(undefined1 *)((int)DAT_6000_cbe6 + iVar2) = (char)sVar1;
  }
  for (iVar2 = 0; iVar2 < 0x366; iVar2 = iVar2 + 1) {
    sVar1 = fgetc(f);
    *(undefined1 *)((int)DAT_6000_cbea + iVar2) = (char)sVar1;
  }
  fclose(f);
  for (iVar2 = 0; iVar2 < 0x2260; iVar2 = iVar2 + 1) {
    *(undefined1 *)((int)DAT_6000_cbe2 + iVar2) = 0xff;
  }
  for (iVar2 = 0; iVar2 < 0x91; iVar2 = iVar2 + 1) {
    uVar3 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
    set_occupant(*(undefined1 *)((int)DAT_6000_cbde + iVar2 * 6),
                  *(undefined1 *)((int)DAT_6000_cbde + iVar2 * 6 + 1),iVar2);
  }
  return;
}


// ==== FUN_2000_5196 @ 2000:5196 (size 99) callers: movecontrol,FUN_3000_2796,FUN_3000_b066

undefined2 __cdecl16far FUN_2000_5196(int param_1,int param_2)

{
  if ((((-1 < param_1) && (param_1 <= DAT_6000_448b)) && (-1 < param_2)) &&
     (param_2 <= DAT_6000_448d)) {
    if ((1 << ((byte)(param_1 % 8) & 0x1f) &
        (uint)*(byte *)((int)DAT_6000_cbd8 + param_2 * 10 + param_1 / 8)) != 0) {
      return 1;
    }
    return 0;
  }
  return 0;
}


// ==== is_explored @ 2000:51fd (size 98) callers: draw_map_square  // bit test on the current floor's explored-squares bitmap

undefined2 __cdecl16far is_explored(int param_1,int param_2)

{
  if ((((-1 < param_1) && (param_1 <= DAT_6000_448b)) && (-1 < param_2)) &&
     (param_2 <= DAT_6000_448d)) {
    if ((1 << ((byte)(param_1 % 8) & 0x1f) &
        (uint)*(byte *)(DAT_6000_cbdc + param_2 * 10 + param_1 / 8)) != 0) {
      return 1;
    }
    return 0;
  }
  return 0;
}


// ==== FUN_2000_5263 @ 2000:5263 (size 53) callers: movecontrol,FUN_3000_2796,FUN_3000_e221

void __cdecl16far FUN_2000_5263(int param_1,int param_2)

{
  byte *pbVar1;
  
  pbVar1 = (byte *)((int)DAT_6000_cbd8 + param_2 * 10 + param_1 / 8);
  *pbVar1 = *pbVar1 | '\x01' << ((byte)(param_1 % 8) & 0x1f);
  return;
}


// ==== save_dun @ 2000:5298 (size 403) callers: enter_level,FUN_2000_7b20,FUN_2000_7b86  // writes the <n>.DUN floor file

void __cdecl16far save_dun(char param_1)

{
  int iVar1;
  int iVar2;
  undefined2 unaff_SS;
  byte local_20 [16];
  void *local_10;
  int local_e;
  char local_c;
  char local_b;
  char local_a [8];
  
  local_c = DAT_6000_125c + '0';
  local_b = param_1 + '0';
  strcpy(local_a,(char *)0x2684);
  local_10 = fopen(&local_c,(char *)0x2681);
  fputc((uint)DAT_6000_cb57,local_10);
  fputc((uint)DAT_6000_cb56,local_10);
  fputc((uint)DAT_6000_cb55,local_10);
  fputc((uint)DAT_6000_cb54,local_10);
  for (local_e = 0; local_e < 0x20; local_e = local_e + 1) {
    if ((1 << ((byte)(local_e % 8) & 0x1f) & (uint)(byte)((undefined1 *)&DAT_6000_cb54)[local_e / 8]
        ) != 0) {
      for (iVar1 = 0; iVar1 < 0x10; iVar1 = iVar1 + 1) {
        local_20[iVar1] = 0;
      }
      for (iVar1 = 0; iVar1 < 0x6e; iVar1 = iVar1 + 1) {
        for (iVar2 = 0; iVar2 < 10; iVar2 = iVar2 + 1) {
          if (iVar2 != 0) {
            local_20[iVar1 / 8] = local_20[iVar1 / 8] | '\x01' << ((byte)(iVar1 % 8) & 0x1f);
          }
        }
      }
      for (iVar1 = 0; iVar1 < 0x10; iVar1 = iVar1 + 1) {
        fputc((uint)local_20[iVar1],local_10);
      }
      for (iVar1 = 0; iVar1 < 0x6e; iVar1 = iVar1 + 1) {
        if ((1 << ((byte)(iVar1 % 8) & 0x1f) & (uint)local_20[iVar1 / 8]) != 0) {
          for (iVar2 = 0; iVar2 < 10; iVar2 = iVar2 + 1) {
            fputc((uint)*(byte *)((int)((undefined4 *)&DAT_6000_cb58)[local_e] + iVar1 * 10 + iVar2)
                  ,local_10);
          }
        }
      }
    }
  }
  fclose(local_10);
  return;
}


// ==== load_dun @ 2000:542b (size 465) callers: enter_level  // reads the <n>.DUN floor file

void __cdecl16far load_dun(char param_1)

{
  short sVar1;
  int iVar2;
  int iVar3;
  undefined2 unaff_SS;
  byte local_20 [16];
  void *local_10;
  int local_e;
  char local_c;
  char local_b;
  char local_a [8];
  
  local_c = DAT_6000_125c + '0';
  local_b = param_1 + '0';
  strcpy(local_a,(char *)0x2684);
  local_10 = fopen(&local_c,(char *)0x1bd8);
  if (local_10 != (void *)0x0) {
    sVar1 = fgetc(local_10);
    DAT_6000_cb57 = (undefined1)sVar1;
    sVar1 = fgetc(local_10);
    DAT_6000_cb56 = (undefined1)sVar1;
    sVar1 = fgetc(local_10);
    DAT_6000_cb55 = (undefined1)sVar1;
    sVar1 = fgetc(local_10);
    DAT_6000_cb54 = (undefined1)sVar1;
    for (iVar3 = 0; iVar3 < 0x20; iVar3 = iVar3 + 1) {
      if ((1 << ((byte)(iVar3 % 8) & 0x1f) & (uint)(byte)((undefined1 *)&DAT_6000_cb54)[iVar3 / 8])
          == 0) {
        for (iVar2 = 0; iVar2 < 0x44c; iVar2 = iVar2 + 1) {
          *(undefined1 *)((int)((undefined4 *)&DAT_6000_cb58)[iVar3] + iVar2) = 0;
        }
      }
      else {
        for (iVar2 = 0; iVar2 < 0x10; iVar2 = iVar2 + 1) {
          sVar1 = fgetc(local_10);
          local_20[iVar2] = (byte)sVar1;
        }
        for (local_e = 0; local_e < 0x6e; local_e = local_e + 1) {
          if ((1 << ((byte)(local_e % 8) & 0x1f) & (uint)local_20[local_e / 8]) == 0) {
            for (iVar2 = 0; iVar2 < 10; iVar2 = iVar2 + 1) {
              *(undefined1 *)((int)((undefined4 *)&DAT_6000_cb58)[iVar3] + local_e * 10 + iVar2) = 0
              ;
            }
          }
          else {
            for (iVar2 = 0; iVar2 < 10; iVar2 = iVar2 + 1) {
              sVar1 = fgetc(local_10);
              *(undefined1 *)((int)((undefined4 *)&DAT_6000_cb58)[iVar3] + local_e * 10 + iVar2) =
                   (char)sVar1;
            }
          }
        }
      }
    }
    fclose(local_10);
    return;
  }
  DAT_6000_cb57 = 0;
  DAT_6000_cb56 = 0;
  DAT_6000_cb55 = 0;
  DAT_6000_cb54 = 0;
  for (iVar3 = 0; iVar3 < 0x20; iVar3 = iVar3 + 1) {
    for (iVar2 = 0; iVar2 < 0x44c; iVar2 = iVar2 + 1) {
      *(undefined1 *)((int)((undefined4 *)&DAT_6000_cb58)[iVar3] + iVar2) = 0;
    }
  }
  for (iVar3 = 0; iVar3 < 4; iVar3 = iVar3 + 1) {
    ((undefined1 *)&DAT_6000_cb54)[iVar3] = 0;
  }
  return;
}


// ==== enter_level @ 2000:55fc (size 268) callers: main,FUN_2000_726f,chute,dig_hole,movecontrol,FUN_2000_d358,FUN_3000_8235,FUN_3000_e221  // switches floor: monsters, .DUN block and explored map

void __cdecl16far enter_level(int param_1)

{
  int iVar1;
  undefined2 uVar2;
  
  DAT_6000_cd26 = DAT_6000_c8a2;
  FUN_4000_10ee();
  if ((param_1 == 0) || (DAT_6000_12fd != -1)) {
    generate_section(param_1);
  }
  else {
    load_mon_map();
  }
  for (iVar1 = 0; iVar1 < 0x91; iVar1 = iVar1 + 1) {
    uVar2 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
    if (*(char *)(*(char *)((uint)*(byte *)((int)DAT_6000_cbde + iVar1 * 6 + 4) * 0x23 + 0x259) +
                 0x11ef) == '\0') {
      *(undefined1 *)((int)DAT_6000_cbde + iVar1 * 6 + 4) = 0;
    }
  }
  if (param_1 / 0x20 != DAT_6000_12fd) {
    if (DAT_6000_12fd != -1) {
      save_dun(DAT_6000_12fd);
    }
    DAT_6000_12fd = param_1 / 0x20;
    load_dun(DAT_6000_12fd);
  }
  ((undefined1 *)&DAT_6000_cb54)[(param_1 % 0x20) / 8] =
       ((undefined1 *)&DAT_6000_cb54)[(param_1 % 0x20) / 8] | '\x01' << ((byte)(param_1 % 8) & 0x1f)
  ;
  DAT_6000_cbd8._2_2_ =
       *(undefined2 *)((int)(undefined4 *)&DAT_6000_cb58 + (param_1 % 0x20) * 4 + 2);
  DAT_6000_cbd8._0_2_ = *(int *)((undefined4 *)&DAT_6000_cb58 + param_1 % 0x20);
  for (iVar1 = 0; iVar1 < 0x44c; iVar1 = iVar1 + 1) {
    *(undefined1 *)(DAT_6000_cbdc + iVar1) = *(undefined1 *)((int)DAT_6000_cbd8 + iVar1);
  }
  return;
}


// ==== random_walk @ 2000:5708 (size 78) callers:   // steps +/-1 while random(3) is non-zero; no callers

int __cdecl16far random_walk(int param_1)

{
  short sVar1;
  int iVar2;
  long lVar3;
  long b;
  
  iVar2 = 0;
  while( true ) {
    b = 0x8000;
    sVar1 = rand();
    lVar3 = N_LXMUL(3,(long)sVar1);
    lVar3 = F_LDIV(lVar3,b);
    if (((int)lVar3 == 0) || ((param_1 <= iVar2 && (iVar2 <= -param_1)))) break;
    if ((int)lVar3 == 1) {
      iVar2 = iVar2 + 1;
    }
    else {
      iVar2 = iVar2 + -1;
    }
  }
  return iVar2;
}


// ==== random_run @ 2000:575a (size 47) callers:   // the number of consecutive coin flips won, capped at n

int __cdecl16far random_run(int param_1)

{
  short sVar1;
  int iVar2;
  long lVar3;
  
  iVar2 = 0;
  while( true ) {
    lVar3 = 0x8000;
    sVar1 = rand();
    lVar3 = F_LDIV(CONCAT22((sVar1 >> 0xf) << 1 | (uint)(sVar1 < 0),sVar1 << 1),lVar3);
    if (((int)lVar3 == 0) || (param_1 <= iVar2)) break;
    iVar2 = iVar2 + 1;
  }
  return iVar2;
}


// ==== roll_dice @ 2000:578c (size 69) callers:   // the sum of n rolls of random(d)

int __cdecl16far roll_dice(int param_1,int param_2)

{
  short sVar1;
  int iVar2;
  int iVar3;
  long lVar4;
  long b;
  
  iVar3 = 0;
  for (iVar2 = 0; iVar2 < param_1; iVar2 = iVar2 + 1) {
    b = 0x8000;
    sVar1 = rand();
    lVar4 = N_LXMUL((long)param_2,(long)sVar1);
    lVar4 = F_LDIV(lVar4,b);
    iVar3 = iVar3 + (int)lVar4;
  }
  return iVar3;
}


// ==== load_dung_bin @ 2000:57d7 (size 55) callers: main,FUN_2000_7b20,movecontrol  // reads DUNG.BIN

void __cdecl16far load_dung_bin(void)

{
  void *f;
  
  f = fopen((char *)s_dung_bin_6000_2689,(char *)0x1bd8);
  fread((void *)0x9af2,0x200,0x13,f);
  fclose(f);
  return;
}


// ==== load_player @ 2000:580e (size 177) callers: main  // fread of the 0x928-byte record from slot file <n>

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far load_player(short param_1)

{
  char *name;
  void *f;
  char *mode;
  char local_18 [22];
  
  mode = (char *)0x1bd8;
  name = itoa(param_1,local_18,10);
  f = fopen(name,mode);
  fread((undefined1 *)&DAT_6000_c0f2,0x928,1,f);
  fclose(f);
  if (_DAT_6000_c896 != 0.0) {
    DAT_6000_c94a = (double)_DAT_6000_c896;
    _DAT_6000_c896 = 0.0;
  }
  if (DAT_6000_c11d != '\0') {
    DAT_6000_c90e = (int)DAT_6000_c122;
    DAT_6000_c90c = (int)DAT_6000_c121;
    DAT_6000_c90a = (int)DAT_6000_c120;
    DAT_6000_c908 = (int)DAT_6000_c11f;
    DAT_6000_c904 = (int)DAT_6000_c11d;
    DAT_6000_c906 = (int)DAT_6000_c11e;
    DAT_6000_c11d = '\0';
  }
  return;
}


// ==== save_player @ 2000:58bf (size 76) callers: monster_turn,FUN_2000_726f,FUN_2000_7b20,FUN_2000_7b86,FUN_2000_81cd,chute,movecontrol,roll_char,FUN_3000_8235  // fwrite of the 0x928-byte record to slot file <n>

void __cdecl16far save_player(short param_1)

{
  char *name;
  void *f;
  char *mode;
  char local_16 [20];
  
  mode = (char *)0x2681;
  name = itoa(param_1,local_16,10);
  f = fopen(name,mode);
  fwrite((undefined1 *)&DAT_6000_c0f2,0x928,1,f);
  fclose(f);
  return;
}


// ==== spells_hlp_probe @ 2000:590b (size 45) callers:   // opens SPELLS.HLP twice, drops both handles; no callers

void __cdecl16far spells_hlp_probe(void)

{
  fopen((char *)s_spells_hlp_6000_2692,(char *)0x1bcb);
  fopen((char *)s_spells_hlp_6000_2692,(char *)0x1bd8);
  return;
}


// ==== load_spell_text @ 2000:5938 (size 197) callers: FUN_3000_b7fd  // SPELLS.HLP record n (0..119) into the spell text buffer

void __cdecl16far load_spell_text(int param_1)

{
  short sVar1;
  int iVar2;
  undefined2 unaff_SS;
  char local_134 [300];
  short local_8;
  int local_6;
  void *local_4;
  
  local_4 = fopen((char *)s_spells_hlp_6000_2692,(char *)0x1bcb);
  local_6 = 0;
  while( true ) {
    if (0x77 < local_6) {
      fclose(local_4);
      return;
    }
    iVar2 = 0;
    while( true ) {
      sVar1 = fgetc(local_4);
      local_134[iVar2] = (char)sVar1;
      if (local_134[iVar2] == '~') break;
      if (local_134[iVar2] == '\n') {
        local_134[iVar2] = '@';
      }
      iVar2 = iVar2 + 1;
    }
    if (local_6 == param_1) break;
    local_6 = local_6 + 1;
  }
  fgetc(local_4);
  fgetc(local_4);
  local_134[iVar2] = '\0';
  local_8 = strlen(local_134);
  for (iVar2 = 0; iVar2 <= local_8; iVar2 = iVar2 + 1) {
    *(char *)(DAT_6000_cd16 + iVar2) = local_134[iVar2];
  }
  fclose(local_4);
  return;
}


// ==== FUN_2000_59fd @ 2000:59fd (size 65) callers: experience_for_level,monster_turn

void __cdecl16far FUN_2000_59fd(int param_1)

{
  pow(DAT_6000_269d,(double)param_1 - 1.0);
  return;
}


// ==== experience_for_level @ 2000:5a42 (size 160) callers: movecontrol  // the level thresholds

void __cdecl16far experience_for_level(void)

{
  short sVar1;
  int iVar2;
  longdouble in_ST0;
  longdouble in_ST1;
  longdouble in_ST2;
  longdouble in_ST3;
  longdouble in_ST4;
  longdouble in_ST5;
  longdouble in_ST6;
  longdouble in_ST7;
  longdouble lVar3;
  undefined2 uVar4;
  double dVar5;
  
  DAT_6000_45c7 = 1;
  strcpy(DAT_6000_cd80,(char *)s_CEXPERIENCE_NEEDED_FOR_LEVEL__6000_26ac + 1);
  for (iVar2 = 0; iVar2 < 7; iVar2 = iVar2 + 1) {
    itoa(iVar2 + DAT_6000_c89a + 1,(char *)((undefined2 *)&DAT_6000_cd82)[iVar2],10);
    strcat((char *)((undefined2 *)&DAT_6000_cd82)[iVar2],(char *)0x1ba6);
    FUN_2000_59fd();
    dVar5 = (double)in_ST0;
    uVar4 = 0x26ca;
    lVar3 = in_ST7;
    sVar1 = strlen((char *)((undefined2 *)&DAT_6000_cd82)[iVar2]);
    FUN_1000_43f9(((undefined2 *)&DAT_6000_cd82)[iVar2] + sVar1,uVar4,dVar5);
    in_ST0 = in_ST1;
    in_ST1 = in_ST2;
    in_ST2 = in_ST3;
    in_ST3 = in_ST4;
    in_ST4 = in_ST5;
    in_ST5 = in_ST6;
    in_ST6 = in_ST7;
    in_ST7 = lVar3;
  }
  FUN_2000_22d7();
  return;
}


// ==== FUN_2000_5ae2 @ 2000:5ae2 (size 91) callers: inn,FUN_3000_9383,FUN_3000_d51c

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

undefined2 __cdecl16far FUN_2000_5ae2(void)

{
  double dVar1;
  
  dVar1 = pow(DAT_6000_269d,(double)DAT_6000_c89a - 1.0);
  if (dVar1 * (double)DAT_6000_26a5 - (double)_DAT_6000_26a9 < DAT_6000_c94a) {
    return 1;
  }
  return 0;
}


// ==== FUN_2000_5b41 @ 2000:5b41 (size 112) callers: inn

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

int __cdecl16far FUN_2000_5b41(void)

{
  int iVar1;
  double dVar2;
  
  iVar1 = 0;
  while( true ) {
    if (999 < iVar1) {
      return 0;
    }
    if (DAT_6000_c89a < iVar1) {
      FUN_3000_e5f5();
    }
    dVar2 = pow(DAT_6000_269d,(double)iVar1 - 1.0);
    if (DAT_6000_c94a < dVar2 * (double)DAT_6000_26a5 - (double)_DAT_6000_26a9) break;
    iVar1 = iVar1 + 1;
  }
  return iVar1;
}


// ==== FUN_2000_5bb6 @ 2000:5bb6 (size 57) callers: strike

void __cdecl16far FUN_2000_5bb6(void)

{
  int hz;
  
  if (DAT_6000_119f == 0) {
    return;
  }
  for (hz = 0x78; hz < 0xd2; hz = hz + 10) {
    sound(hz);
    FUN_1000_22a2(8);
  }
  FUN_1000_3332();
  return;
}


// ==== strike @ 2000:5bef (size 1098) callers: movecontrol  // the player's attack on a monster

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

int __cdecl16far strike(void)

{
  int iVar1;
  ushort seed;
  uint uVar2;
  short sVar3;
  int iVar4;
  int iVar5;
  long lVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  short radix;
  int local_6;
  
  DAT_6000_cd2e = 1;
  local_6 = (int)DAT_6000_c18d;
  if (DAT_6000_c8d6 != 0) {
    local_6 = DAT_6000_c8d6 + 8;
  }
  seed = clock_ticks();
  srand(seed);
  uVar2 = (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 4);
  uVar10 = 0;
  uVar9 = 0x8000;
  sVar3 = rand();
  lVar6 = N_LXMUL(0x50,(long)sVar3);
  lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
  iVar4 = (int)lVar6 + DAT_6000_c89a * 2 + DAT_6000_c904 + DAT_6000_c90e + (uint)DAT_6000_c8b9 +
          (int)*(char *)(DAT_6000_c18d * 7 + 0x1c4) +
          (int)DAT_6000_c938 + (int)(char)((undefined1 *)&DAT_6000_c180)[DAT_6000_c18d] +
          (uint)DAT_6000_c8c0;
  if (0x4b < DAT_6000_c8a2) {
    uVar10 = 0;
    uVar9 = 0x8000;
    sVar3 = rand();
    lVar6 = N_LXMUL(0x1e,(long)sVar3);
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
    if ((int)lVar6 == 1) {
      iVar4 = iVar4 + 0x28;
    }
  }
  iVar5 = 0;
  for (iVar4 = (((iVar4 + (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 5) * -2) -
                *(int *)(uVar2 * 0x23 + 0x239)) - (int)*(char *)(uVar2 * 0x23 + 0x24d)) -
               (int)*(char *)(uVar2 * 0x23 + 0x24e); 0x28 < iVar4; iVar4 = iVar4 + -0x28) {
    iVar1 = *(int *)(local_6 * 7 + 0x1c2);
    uVar10 = 0;
    uVar9 = 0x8000;
    sVar3 = rand();
    lVar6 = N_LXMUL((long)iVar1,(long)sVar3);
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
    iVar5 = iVar5 + (int)lVar6;
  }
  if (0 < iVar5) {
    uVar10 = 0;
    uVar9 = 0x8000;
    sVar3 = rand();
    lVar6 = N_LXMUL(0x14,(long)sVar3);
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
    iVar4 = DAT_6000_c904;
    if ((int)lVar6 < DAT_6000_c89a) {
      uVar10 = 0;
      uVar9 = 0x8000;
      sVar3 = rand();
      lVar6 = N_LXMUL((long)iVar4,(long)sVar3);
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
      iVar4 = (int)lVar6;
    }
    else {
      iVar4 = DAT_6000_c904 / 3;
      uVar10 = 0;
      uVar9 = 0x8000;
      sVar3 = rand();
      lVar6 = N_LXMUL((long)iVar4,(long)sVar3);
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
      iVar4 = (int)lVar6;
    }
    iVar5 = iVar5 + iVar4;
    if ((0 < iVar5) && (DAT_6000_c89a < 5)) {
      iVar4 = 5 - DAT_6000_c89a;
      uVar10 = 0;
      uVar9 = 0x8000;
      sVar3 = rand();
      lVar6 = N_LXMUL((long)iVar4,(long)sVar3);
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
      iVar5 = iVar5 + (int)lVar6;
    }
    iVar4 = DAT_6000_c89a;
    uVar10 = 0;
    uVar9 = 0x8000;
    sVar3 = rand();
    lVar6 = N_LXMUL((long)iVar4,(long)sVar3);
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
    iVar5 = iVar5 + (int)lVar6;
  }
  uVar10 = 0;
  uVar9 = 0x4af;
  lVar6 = N_LXMUL(0x78,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
  uVar9 = (undefined2)lVar6;
  uVar8 = 0;
  uVar10 = 0x63f;
  lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar10));
  uVar10 = (undefined2)lVar6;
  uVar7 = 0;
  uVar8 = 0x4af;
  lVar6 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar8));
  fill_rect(0,(int)lVar6,uVar10,uVar9);
  if (DAT_6000_45c9 == 0) {
    FUN_1000_22a2(100);
  }
  if (iVar5 < 1) {
    strcpy(DAT_6000_cb52,(char *)s_YOU_MISSED_THE_MONSTER_6000_271e);
  }
  else {
    if (DAT_6000_c8a2 < 5) {
      print_text(0,0x28,0,(char *)s_YOU_HIT__THE_MONSTER_IN_THE_6000_26d2,DAT_6000_1303);
    }
    uVar9 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
    iVar4 = (int)DAT_6000_cbde;
    if ((int)(uint)*(byte *)(iVar4 + DAT_6000_4593 * 6) < DAT_6000_c89e) {
      strcpy(DAT_6000_cb52,(char *)s_WEST_6000_26ee);
    }
    else if (DAT_6000_c89e < (int)(uint)*(byte *)(iVar4 + DAT_6000_4593 * 6)) {
      strcpy(DAT_6000_cb52,(char *)0x26f4);
    }
    else if ((int)(uint)*(byte *)(iVar4 + DAT_6000_4593 * 6 + 1) < DAT_6000_c8a0) {
      strcpy(DAT_6000_cb52,(char *)s_NORTH_6000_26fa);
    }
    else if (DAT_6000_c8a0 < (int)(uint)*(byte *)(iVar4 + DAT_6000_4593 * 6 + 1)) {
      strcpy(DAT_6000_cb52,(char *)s_SOUTH_6000_2701);
    }
    if (DAT_6000_c8a2 < 5) {
      strcat(DAT_6000_cb52,(char *)s_TAKES_6000_2708);
    }
    radix = 10;
    sVar3 = strlen(DAT_6000_cb52);
    itoa(iVar5,DAT_6000_cb52 + sVar3,radix);
    strcat(DAT_6000_cb52,(char *)s_POINTS_DAMAGE_6000_270f);
  }
  if (0 < iVar5) {
    FUN_2000_5bb6();
  }
  print_text(0,0x50,0,DAT_6000_cb52,DAT_6000_1303);
  while (sVar3 = kbhit(), sVar3 != 0) {
    getch();
  }
  *_DAT_6000_cd28 = *_DAT_6000_cd28 - iVar5;
  return iVar5;
}


// ==== puffball_stat @ 2000:603f (size 216) callers: monster_turn  // the puffball's stat drain/raise, by stat number

void __cdecl16far puffball_stat(uint param_1)

{
  switch((param_1 ^ (int)param_1 >> 0xf) - ((int)param_1 >> 0xf)) {
  case 1:
    DAT_6000_c904 = DAT_6000_c904 + param_1;
    strcpy(DAT_6000_cb52,(char *)s_STRENGTH_6000_2735);
    break;
  case 2:
    DAT_6000_c906 = DAT_6000_c906 + (int)param_1 / 2;
    strcpy(DAT_6000_cb52,(char *)s_INTELLIGENCE_6000_273e);
    break;
  case 3:
    DAT_6000_c908 = DAT_6000_c908 + (int)param_1 / 3;
    strcpy(DAT_6000_cb52,(char *)0x274b);
    break;
  case 4:
    DAT_6000_c90a = DAT_6000_c90a + (int)param_1 / 4;
    strcpy(DAT_6000_cb52,(char *)s_CONSTITUTION_6000_2752);
    break;
  case 5:
    DAT_6000_c90c = DAT_6000_c90c + (int)param_1 / 5;
    strcpy(DAT_6000_cb52,(char *)s_DEXTERITY_6000_275f);
    break;
  case 6:
    DAT_6000_c90e = DAT_6000_c90e + (int)param_1 / 6;
    strcpy(DAT_6000_cb52,(char *)0x2769);
  }
  return;
}


// ==== FUN_2000_6123 @ 2000:6123 (size 57) callers: monster_turn

void __cdecl16far FUN_2000_6123(void)

{
  int hz;
  
  if (DAT_6000_119f == 0) {
    return;
  }
  for (hz = 700; 400 < hz; hz = hz + -0x14) {
    sound(hz);
    FUN_1000_22a2(8);
  }
  FUN_1000_3332();
  return;
}


// ==== monster_turn @ 2000:615c (size 3960) callers: FUN_2000_7fb1  // the monster's attack and the experience it gives

int __cdecl16far monster_turn(int param_1)

{
  byte bVar1;
  char cVar2;
  uint uVar3;
  short sVar4;
  int iVar5;
  int iVar6;
  longdouble in_ST0;
  long lVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  undefined2 uVar11;
  short sVar12;
  int local_a;
  int local_8;
  int local_4;
  
  flush_keys();
  uVar3 = (uint)*(byte *)((int)DAT_6000_cbde + param_1 * 6 + 4);
  if (*(char *)(uVar3 * 0x23 + 0x247) == '\x06') {
    iVar5 = (int)*(char *)(uVar3 * 0x23 + 0x245);
    puffball_stat(iVar5);
    uVar11 = 0;
    uVar10 = 0;
    uVar9 = 0x4af;
    lVar7 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
    uVar9 = (undefined2)lVar7;
    uVar8 = 0;
    uVar10 = 0x63f;
    lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar7 = F_LDIV(lVar7,CONCAT22(uVar8,uVar10));
    fill_rect(0,0,(int)lVar7,uVar9,uVar11);
    if (iVar5 < 0) {
      strcat(DAT_6000_cb52,(char *)s_DRAINED_BY_PUFFBALL__6000_276e);
    }
    else {
      strcat(DAT_6000_cb52,(char *)s_RAISED_BY_PUFFBALL__6000_2784);
    }
    uVar9 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
    *(undefined1 *)
     ((int)DAT_6000_cbe2 + (uint)*(byte *)((int)DAT_6000_cbde + param_1 * 6 + 1) * 0x50 +
     (uint)*(byte *)((int)DAT_6000_cbde + param_1 * 6)) = 0xff;
    *(undefined1 *)((int)DAT_6000_cbde + param_1 * 6) = 100;
    *(undefined1 *)((int)DAT_6000_cbde + param_1 * 6 + 1) = 100;
    *(undefined1 *)((int)DAT_6000_cbde + param_1 * 6 + 2) = 0;
    *(undefined1 *)((int)DAT_6000_cbde + param_1 * 6 + 3) = 0;
    *(undefined1 *)((int)DAT_6000_cbde + param_1 * 6 + 4) = 0;
    *(undefined1 *)((int)DAT_6000_cbde + param_1 * 6 + 5) = 0;
    DAT_6000_cd18 = 1;
    uVar10 = 0;
    uVar9 = 0x4af;
    lVar7 = N_LXMUL(0x78,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
    uVar9 = (undefined2)lVar7;
    uVar8 = 0;
    uVar10 = 0x63f;
    lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar7 = F_LDIV(lVar7,CONCAT22(uVar8,uVar10));
    uVar10 = (undefined2)lVar7;
    uVar11 = 0;
    uVar8 = 0x4af;
    lVar7 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar7 = F_LDIV(lVar7,CONCAT22(uVar11,uVar8));
    fill_rect(0,(int)lVar7,uVar10,uVar9);
    print_text(0,0,0,DAT_6000_cb52,6);
    FUN_1000_22a2(0x4ec);
    flush_keys();
    return 0;
  }
  if (DAT_6000_c8e6 < 1) {
    if (DAT_6000_c8e8 < 1) {
      iVar5 = clock_ticks();
      srand(iVar5 + 100);
      uVar3 = (uint)*(byte *)((int)DAT_6000_cbde + param_1 * 6 + 4);
      iVar6 = random_n(0x50);
      iVar5 = DAT_6000_c906;
      local_4 = iVar6 + (uint)*(byte *)((int)DAT_6000_cbde + param_1 * 6 + 5) * 2 +
                (int)*(char *)(uVar3 * 0x23 + 0x249) + (int)*(char *)(uVar3 * 0x23 + 0x24e);
      if (DAT_6000_c11c == '\x02') {
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar4 = rand();
        lVar7 = N_LXMUL((long)iVar5,(long)sVar4);
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
        local_4 = local_4 + (int)lVar7;
      }
      local_4 = ((((((((local_4 + DAT_6000_c89a * -2) - (DAT_6000_c90c + DAT_6000_c90e)) -
                     (uint)DAT_6000_c8b9) - (int)*(char *)(DAT_6000_c1b2 * 5 + 0x216)) -
                   (uint)DAT_6000_c8c1) - (int)DAT_6000_c1cf) - (uint)DAT_6000_c8c2) -
                (uint)DAT_6000_c8c3) + (uint)DAT_6000_c8d9 * (uint)DAT_6000_c8d9 * -2;
      DAT_6000_cd2c = 1;
      iVar5 = 0;
      if (0x4b < DAT_6000_c8a2) {
        local_4 = local_4 + (DAT_6000_c8a2 + -0x4b) / 2;
      }
      for (; 0x20 < local_4; local_4 = local_4 + -0x28) {
        iVar6 = *(int *)(uVar3 * 0x23 + 0x23b);
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar4 = rand();
        lVar7 = N_LXMUL((long)iVar6,(long)sVar4);
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
        iVar5 = iVar5 + (int)lVar7;
      }
      uVar10 = 0;
      uVar9 = 0x8000;
      sVar4 = rand();
      lVar7 = N_LXMUL(500,(long)sVar4);
      lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
      if ((int)lVar7 < DAT_6000_c8a2) {
        iVar5 = iVar5 + 1;
      }
      uVar10 = 0;
      uVar9 = 0x8000;
      sVar4 = rand();
      lVar7 = N_LXLSH((long)sVar4,'\x02');
      lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
      if ((int)lVar7 == 1) {
        iVar5 = DAT_6000_c8a2 / 2;
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar4 = rand();
        lVar7 = N_LXMUL((long)(iVar5 + 3),(long)sVar4);
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
        iVar5 = (int)lVar7;
      }
      if ((0 < iVar5) && (DAT_6000_c89a < DAT_6000_c8a2)) {
        iVar6 = DAT_6000_c8a2 - DAT_6000_c89a;
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar4 = rand();
        lVar7 = N_LXMUL((long)iVar6,(long)sVar4);
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
        iVar5 = iVar5 + (int)lVar7;
        if (0x19 < DAT_6000_c8a2) {
          iVar6 = DAT_6000_c8a2 << 2;
          uVar10 = 0;
          uVar9 = 0x8000;
          sVar4 = rand();
          lVar7 = N_LXMUL((long)iVar6,(long)sVar4);
          lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
          iVar5 = iVar5 + (int)lVar7;
        }
        if (100 < DAT_6000_c8a2) {
          iVar6 = DAT_6000_c8a2 * 5;
          uVar10 = 0;
          uVar9 = 0x8000;
          sVar4 = rand();
          lVar7 = N_LXMUL((long)iVar6,(long)sVar4);
          lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
          iVar5 = iVar5 + (int)lVar7;
        }
        bVar1 = *(byte *)((int)DAT_6000_cbde + param_1 * 6 + 5);
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar4 = rand();
        lVar7 = N_LXMUL((long)(int)(uint)bVar1,(long)sVar4);
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
        local_8 = 100 - DAT_6000_c90a;
        if (local_8 < 1) {
          local_8 = 1;
        }
        iVar5 = ((local_8 + 0x32) * (iVar5 + (int)lVar7)) / 0x96;
        if (iVar5 < 1) {
          iVar5 = 1;
        }
      }
      if ((DAT_6000_c89a == 0) && (4 < iVar5)) {
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar4 = rand();
        lVar7 = N_LXLSH((long)sVar4,'\x02');
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
        iVar5 = (int)lVar7 + 1;
      }
      cVar2 = *(char *)(uVar3 * 0x23 + 0x246);
      if ((cVar2 == '\0') || (iVar6 = random_n(2), iVar6 == 0)) {
        uVar11 = 0;
        uVar10 = 0;
        uVar9 = 0x4af;
        lVar7 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
        uVar9 = (undefined2)lVar7;
        uVar8 = 0;
        uVar10 = 0x63f;
        lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar8,uVar10));
        fill_rect(0,0,(int)lVar7,uVar9,uVar11);
        FUN_1000_22a2(0x6e);
        uVar9 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
        iVar6 = (int)DAT_6000_cbde;
        if ((int)(uint)*(byte *)(iVar6 + param_1 * 6) < DAT_6000_c89e) {
          strcpy(DAT_6000_cb52,(char *)s_WEST_6000_26ee);
        }
        else if (DAT_6000_c89e < (int)(uint)*(byte *)(iVar6 + param_1 * 6)) {
          strcpy(DAT_6000_cb52,(char *)0x26f4);
        }
        else if ((int)(uint)*(byte *)(iVar6 + param_1 * 6 + 1) < DAT_6000_c8a0) {
          strcpy(DAT_6000_cb52,(char *)s_NORTH_6000_26fa);
        }
        else if (DAT_6000_c8a0 < (int)(uint)*(byte *)(iVar6 + param_1 * 6 + 1)) {
          strcpy(DAT_6000_cb52,(char *)s_SOUTH_6000_2701);
        }
        if (DAT_6000_c89a == 0) {
          strcat(DAT_6000_cb52,(char *)s_MONSTER_6000_28a9);
        }
        if (iVar5 < 1) {
          strcat(DAT_6000_cb52,(char *)s_MISSES_YOU__6000_28b9);
        }
        else {
          strcat(DAT_6000_cb52,(char *)s_ON_YOU__IT_DOES_6000_27d6 + 0xd);
          sVar12 = 10;
          sVar4 = strlen(DAT_6000_cb52);
          itoa(iVar5,DAT_6000_cb52 + sVar4,sVar12);
          if (iVar5 == 1) {
            strcat(DAT_6000_cb52,(char *)s_POINT_6000_28b2);
          }
          else {
            strcat(DAT_6000_cb52,(char *)s_LEVELS__YOU_GAIN_HEALTH_POINTS_6000_235e + 0x17);
          }
        }
        if (0 < iVar5) {
          FUN_2000_6123();
        }
        print_text(0,0,0,DAT_6000_cb52,DAT_6000_1303);
        strcpy(DAT_6000_cb52,(char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        if (0 < iVar5) {
          if (((*(char *)(uVar3 * 0x23 + 0x244) != '\0') && (0 < DAT_6000_c89a)) &&
             (DAT_6000_c8e4 < 1)) {
            FUN_1000_22a2(0xfa);
            DAT_6000_c89a = DAT_6000_c89a - *(char *)(uVar3 * 0x23 + 0x244);
            FUN_2000_59fd(DAT_6000_c89a + -1);
            DAT_6000_c94a = (double)in_ST0;
            for (local_a = 0; local_a < *(char *)(uVar3 * 0x23 + 0x244); local_a = local_a + 1) {
              FUN_3000_e8ee();
            }
            save_player((int)DAT_6000_125c);
            strcpy(DAT_6000_cb52,(char *)s_YOU_LOSE_6000_28c5);
            sVar12 = 10;
            sVar4 = strlen(DAT_6000_cb52);
            itoa((int)*(char *)(uVar3 * 0x23 + 0x244),DAT_6000_cb52 + sVar4,sVar12);
            if (*(char *)(uVar3 * 0x23 + 0x244) < '\x02') {
              strcat(DAT_6000_cb52,(char *)0x28da);
            }
            else {
              strcat(DAT_6000_cb52,(char *)s_LEVELS__6000_28d1);
            }
            FUN_2000_216b((char *)s_OH_NO__HIT_BY_LEVEL_DRAINER__6000_28e2,DAT_6000_cb52,
                          (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                          (char *)s_HIT_ANY_KEY_6000_28ff,
                          (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                          (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                          (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                          (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
            flush_keys();
            wait_key();
            uVar11 = 0;
            uVar10 = 0;
            uVar9 = 0x4af;
            lVar7 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
            lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
            uVar9 = (undefined2)lVar7;
            uVar8 = 0;
            uVar10 = 0x63f;
            lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
            lVar7 = F_LDIV(lVar7,CONCAT22(uVar8,uVar10));
            fill_rect(0,0,(int)lVar7,uVar9,uVar11);
          }
          iVar6 = (int)*(char *)(uVar3 * 0x23 + 0x245);
          if (iVar6 != 0) {
            FUN_1000_22a2(500);
            flush_keys();
            uVar11 = 0;
            uVar10 = 0;
            uVar9 = 0x4af;
            lVar7 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
            lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
            uVar9 = (undefined2)lVar7;
            uVar8 = 0;
            uVar10 = 0x63f;
            lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
            lVar7 = F_LDIV(lVar7,CONCAT22(uVar8,uVar10));
            fill_rect(0,0,(int)lVar7,uVar9,uVar11);
            puffball_stat(iVar6);
            if (iVar6 < 0) {
              strcat(DAT_6000_cb52,(char *)s_HAS_BEEN_DRAINED__6000_290b);
            }
            else {
              strcat(DAT_6000_cb52,(char *)s_HAS_BEEN_RAISED__6000_291e);
            }
            uVar10 = 0;
            uVar9 = 0x4af;
            lVar7 = N_LXMUL(0x78,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
            lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
            uVar9 = (undefined2)lVar7;
            uVar8 = 0;
            uVar10 = 0x63f;
            lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
            lVar7 = F_LDIV(lVar7,CONCAT22(uVar8,uVar10));
            uVar10 = (undefined2)lVar7;
            uVar11 = 0;
            uVar8 = 0x4af;
            lVar7 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
            lVar7 = F_LDIV(lVar7,CONCAT22(uVar11,uVar8));
            fill_rect(0,(int)lVar7,uVar10,uVar9);
            save_player((int)DAT_6000_125c);
            print_text(0,0,0,DAT_6000_cb52,6);
            flush_keys();
            wait_key();
            uVar11 = 0;
            uVar10 = 0;
            uVar9 = 0x4af;
            lVar7 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
            lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
            uVar9 = (undefined2)lVar7;
            uVar8 = 0;
            uVar10 = 0x63f;
            lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
            lVar7 = F_LDIV(lVar7,CONCAT22(uVar8,uVar10));
            fill_rect(0,0,(int)lVar7,uVar9,uVar11);
          }
          cVar2 = *(char *)(uVar3 * 0x23 + 0x247);
          if (cVar2 != '\0') {
            if (cVar2 != 'c') {
              save_player((int)DAT_6000_125c);
            }
            FUN_1000_22a2(0xfa);
            if ((cVar2 == '\x01') && (DAT_6000_c8dc < 1)) {
              FUN_2000_216b((char *)s_OH_NO__YOU_HAVE_BEEN_6000_2930,(char *)s_POISONED__6000_2945,
                            (char *)s_YOU_CAN_GET_A_CURE_POISON_6000_2951,
                            (char *)s_AT_THE_TEMPLE_IN_THE_TOWN__6000_296b,
                            (char *)s_THERE_IS_ALSO_A_CURE_POISON_6000_2988,
                            (char *)s_SPELL__6000_29a4,
                            (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                            (char *)s_HIT_ANY_KEY_6000_28ff);
              flush_keys();
              wait_key();
              uVar11 = 0;
              uVar10 = 0;
              uVar9 = 0x4af;
              lVar7 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
              lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
              uVar9 = (undefined2)lVar7;
              uVar8 = 0;
              uVar10 = 0x63f;
              lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
              lVar7 = F_LDIV(lVar7,CONCAT22(uVar8,uVar10));
              fill_rect(0,0,(int)lVar7,uVar9,uVar11);
              if (DAT_6000_c8be < 1) {
                DAT_6000_c8be = 0x1c2;
              }
            }
            if ((cVar2 == '\x02') && (DAT_6000_c8de < 1)) {
              FUN_2000_216b((char *)s_OH_NO__YOU_HAVE_CAUGHT_A_6000_29ad,
                            (char *)s_DISEASE__6000_29c6,
                            (char *)s_YOU_CAN_GET_A_CURE_DISEASE_6000_29d1,
                            (char *)s_AT_THE_TEMPLE_IN_THE_TOWN__6000_296b,
                            (char *)s_THERE_IS_ALSO_A_CURE_DISEASE_6000_29ec,
                            (char *)s_SPELL__6000_29a4,
                            (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                            (char *)s_HIT_ANY_KEY_6000_28ff);
              flush_keys();
              wait_key();
              uVar11 = 0;
              uVar10 = 0;
              uVar9 = 0x4af;
              lVar7 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
              lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
              uVar9 = (undefined2)lVar7;
              uVar8 = 0;
              uVar10 = 0x63f;
              lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
              lVar7 = F_LDIV(lVar7,CONCAT22(uVar8,uVar10));
              fill_rect(0,0,(int)lVar7,uVar9,uVar11);
              if (DAT_6000_c8bc < 1) {
                DAT_6000_c8bc = 0x1c2;
              }
            }
          }
        }
        print_text(0,0,0,DAT_6000_cb52,DAT_6000_1303);
        if (iVar5 < 1) {
          FUN_1000_22a2(100);
        }
        else {
          FUN_1000_22a2(0x15e);
        }
      }
      else {
        for (local_a = 0; local_a < 8; local_a = local_a + 1) {
          strcpy((char *)((undefined2 *)&DAT_6000_cd80)[local_a],
                 (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        }
        strcpy(DAT_6000_cd80,(char *)s_THE_MONSTER_BREATHES_6000_2799);
        if (cVar2 == '\x01') {
          strcat(DAT_6000_cd80,(char *)0x27af);
        }
        if (cVar2 == '\x02') {
          strcat(DAT_6000_cd80,(char *)0x27b4);
        }
        if (cVar2 == '\x03') {
          strcat(DAT_6000_cd80,(char *)0x27b8);
        }
        if (cVar2 == '\x04') {
          strcat(DAT_6000_cd80,(char *)s_GREEN_PHLEGM_6000_27bd);
        }
        if (cVar2 == '\x05') {
          strcat(DAT_6000_cd80,(char *)s_BLACK_SLIME_6000_27ca);
        }
        strcpy(DAT_6000_cd82,(char *)s_ON_YOU__IT_DOES_6000_27d6);
        uVar9 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
        uVar3 = (uint)*(byte *)((int)DAT_6000_cbde + param_1 * 6 + 5);
        iVar5 = random_n(*(undefined1 *)((int)DAT_6000_cbde + param_1 * 6 + 5));
        iVar5 = uVar3 + iVar5;
        if ((cVar2 == '\x01') && (0 < DAT_6000_c8e2)) {
          iVar5 = iVar5 / 2;
        }
        if ((cVar2 == '\x02') && (0 < DAT_6000_c8e0)) {
          iVar5 = iVar5 / 2;
        }
        if ((cVar2 == '\x04') && (0 < DAT_6000_c8de)) {
          iVar5 = iVar5 / 2;
        }
        if ((cVar2 == '\x05') && (0 < DAT_6000_c8dc)) {
          iVar5 = iVar5 / 2;
        }
        sVar12 = 10;
        sVar4 = strlen(DAT_6000_cd82);
        itoa(iVar5,DAT_6000_cd82 + sVar4,sVar12);
        strcat(DAT_6000_cd82,(char *)s_LEVELS__YOU_GAIN_HEALTH_POINTS_6000_235e + 0x17);
        strcpy(DAT_6000_cd84,(char *)s_OF_DAMAGE_TO_YOU__6000_27e9);
        if ((cVar2 == '\x01') && (DAT_6000_c8e2 < 1)) {
          strcat(DAT_6000_cd86,(char *)s_YOU_FEEL_TOASTED__6000_27fd);
        }
        if ((cVar2 == '\x02') && (DAT_6000_c8e0 < 1)) {
          strcat(DAT_6000_cd86,(char *)s_YOU_FEEL_CHILLED__6000_280f);
        }
        if ((cVar2 == '\x03') && (DAT_6000_c1b2 != '\0')) {
          strcpy(DAT_6000_cd86,(char *)s_THE_ACID_DISOLVES_YOUR_ARMOR_6000_2821);
          ((undefined1 *)&DAT_6000_c1aa)[DAT_6000_c1b2] = 0;
          ((undefined1 *)&DAT_6000_c1a2)[DAT_6000_c1b2] =
               ((undefined1 *)&DAT_6000_c1a2)[DAT_6000_c1b2] + -1;
          DAT_6000_c1b2 = '\0';
        }
        if ((cVar2 == '\x04') && (DAT_6000_c8de < 1)) {
          if (DAT_6000_c8bc < 1) {
            DAT_6000_c8bc = 0x1c2;
          }
          save_player((int)DAT_6000_125c);
          strcpy(DAT_6000_cd86,(char *)s_YOU_FEEL_VERY_SICK__YOU_NEED_6000_283e);
          strcpy(DAT_6000_cd88,(char *)s_A_CURE_DISEASE_SPELL__6000_285b);
        }
        if ((cVar2 == '\x05') && (DAT_6000_c8dc < 1)) {
          if (DAT_6000_c8be < 1) {
            DAT_6000_c8be = 0x1c2;
          }
          save_player((int)DAT_6000_125c);
          strcpy(DAT_6000_cd86,(char *)s_YOU_FEEL_KIND_OF_WEAK__YOU_6000_2873);
          strcpy(DAT_6000_cd88,(char *)s_MIGHT_GET_A_CURE_POISON__6000_288e);
        }
        FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
        wait_key();
        flush_keys();
        uVar11 = 0;
        uVar10 = 0;
        uVar9 = 0x4af;
        lVar7 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
        uVar9 = (undefined2)lVar7;
        uVar8 = 0;
        uVar10 = 0x63f;
        lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar8,uVar10));
        fill_rect(0,0,(int)lVar7,uVar9,uVar11);
      }
      if (0 < iVar5) {
        DAT_6000_c123 = DAT_6000_c123 - iVar5;
      }
      return iVar5;
    }
    DAT_6000_c8e8 = DAT_6000_c8e8 + -1;
    uVar10 = 0;
    uVar9 = 0x8000;
    sVar4 = rand();
    lVar7 = N_LXMUL(500,(long)sVar4);
    lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
    if ((int)lVar7 < DAT_6000_c8a2) {
      DAT_6000_c8e8 = 0;
    }
    return 0;
  }
  DAT_6000_c8e6 = DAT_6000_c8e6 + -1;
  uVar10 = 0;
  uVar9 = 0x8000;
  sVar4 = rand();
  lVar7 = N_LXMUL(500,(long)sVar4);
  lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar9));
  if ((int)lVar7 < DAT_6000_c8a2) {
    DAT_6000_c8e6 = 0;
  }
  return 0;
}


// ==== FUN_2000_70da @ 2000:70da (size 21) callers: FUN_2000_726f

void __cdecl16far FUN_2000_70da(void)

{
  load_h_bin(0x10);
  wait_key();
  return;
}


// ==== FUN_2000_70ef @ 2000:70ef (size 317) callers: FUN_2000_726f,FUN_3000_8235

void __cdecl16far FUN_2000_70ef(void)

{
  strcpy(DAT_6000_cb52,(char *)0x2a09);
  *DAT_6000_cb52 = DAT_6000_125c + '0';
  unlink(DAT_6000_cb52);
  strcpy(DAT_6000_cb52,(char *)0x2a10);
  *DAT_6000_cb52 = DAT_6000_125c + '0';
  unlink(DAT_6000_cb52);
  strcpy(DAT_6000_cb52,(char *)0x2a17);
  *DAT_6000_cb52 = DAT_6000_125c + '0';
  unlink(DAT_6000_cb52);
  strcpy(DAT_6000_cb52,(char *)0x2a1e);
  *DAT_6000_cb52 = DAT_6000_125c + '0';
  unlink(DAT_6000_cb52);
  strcpy(DAT_6000_cb52,(char *)0x2a25);
  *DAT_6000_cb52 = DAT_6000_125c + '0';
  unlink(DAT_6000_cb52);
  strcpy(DAT_6000_cb52,(char *)0x2a2c);
  *DAT_6000_cb52 = DAT_6000_125c + '0';
  unlink(DAT_6000_cb52);
  strcpy(DAT_6000_cb52,(char *)0x2a33);
  *DAT_6000_cb52 = DAT_6000_125c + '0';
  unlink(DAT_6000_cb52);
  strcpy(DAT_6000_cb52,(char *)0x2a3a);
  *DAT_6000_cb52 = DAT_6000_125c + '0';
  unlink(DAT_6000_cb52);
  return;
}


// ==== FUN_2000_722c @ 2000:722c (size 67) callers: FUN_2000_726f

void __cdecl16far FUN_2000_722c(void)

{
  if (DAT_6000_119f == 0) {
    return;
  }
  sound(0x8c);
  FUN_1000_22a2(0x2e4);
  sound(0x5a);
  FUN_1000_22a2(0x29e);
  FUN_1000_3332();
  return;
}


// ==== FUN_2000_726f @ 2000:726f (size 434) callers: movecontrol

void __cdecl16far FUN_2000_726f(void)

{
  int iVar1;
  int iVar2;
  long lVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  undefined2 uVar6;
  undefined2 uVar7;
  
  FUN_2000_722c();
  if (DAT_6000_c8f8 == -1) {
    strcpy(DAT_6000_cb52,(char *)0x1ba7);
    *DAT_6000_cb52 = DAT_6000_125c + '0';
    unlink(DAT_6000_cb52);
    strcpy(DAT_6000_cb52,(char *)s_mon_map_6000_2678);
    *DAT_6000_cb52 = DAT_6000_125c + '0';
    unlink(DAT_6000_cb52);
    FUN_2000_70ef();
    DAT_6000_12fd = 0xffff;
    DAT_6000_c123 = 0xff9c;
    FUN_2000_70da();
    load_h_bin(0x20);
    enter_level(0);
  }
  else {
    DAT_6000_c89e = DAT_6000_c8f8;
    DAT_6000_c8a0 = DAT_6000_c8fa;
    DAT_6000_c8a2 = 0;
    if (DAT_6000_c8a4 != DAT_6000_c8f6) {
      FUN_2000_70ef();
      for (iVar2 = 0; iVar2 < 0x20; iVar2 = iVar2 + 1) {
        for (iVar1 = 0; iVar1 < 0x44c; iVar1 = iVar1 + 1) {
          *(undefined1 *)((int)((undefined4 *)&DAT_6000_cb58)[iVar2] + iVar1) = 0;
        }
      }
      for (iVar2 = 0; iVar2 < 4; iVar2 = iVar2 + 1) {
        ((undefined1 *)&DAT_6000_cb54)[iVar2] = 0;
      }
      DAT_6000_12fd = 0xffff;
    }
    DAT_6000_c8a4 = DAT_6000_c8f6;
    DAT_6000_c8f8 = -1;
    DAT_6000_4593 = 0xffff;
    DAT_6000_cd18 = 1;
    DAT_6000_123d = 1;
    if (2 < DAT_6000_c90a) {
      DAT_6000_c90a = DAT_6000_c90a + -1;
    }
    DAT_6000_c123 = DAT_6000_c125;
    DAT_6000_c129 = DAT_6000_c12d;
    DAT_6000_c127 = DAT_6000_c12b;
    save_player((int)DAT_6000_125c);
    FUN_2000_70da();
    load_h_bin(0x1e);
    wait_key();
    load_h_bin(0x1f);
    enter_level(0);
  }
  wait_key();
  uVar7 = 0;
  uVar6 = 0;
  uVar4 = 0x4af;
  lVar3 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar4));
  uVar4 = (undefined2)lVar3;
  uVar5 = 0;
  uVar6 = 0x63f;
  lVar3 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar3 = F_LDIV(lVar3,CONCAT22(uVar5,uVar6));
  fill_rect(0,0,(int)lVar3,uVar4,uVar7);
  return;
}


// ==== FUN_2000_7421 @ 2000:7421 (size 821) callers: movecontrol

void __cdecl16far FUN_2000_7421(int param_1)

{
  long lVar1;
  undefined2 uVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  
  uVar5 = 0;
  uVar4 = 0;
  uVar2 = 0x4af;
  lVar1 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
  uVar2 = (undefined2)lVar1;
  uVar3 = 0;
  uVar4 = 0x63f;
  lVar1 = N_LXMUL(0x2cb,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
  fill_rect(0,0,(int)lVar1,uVar2,uVar5);
  if (param_1 == 0) {
    if (DAT_6000_c8c0 != '\0') {
      uVar2 = FUN_4000_428f((char *)s_WEAPONS__PLUS_6000_2a41,DAT_6000_c8c0,0,3);
      print_text(0,0,0,uVar2);
    }
    if (DAT_6000_c8c1 != '\0') {
      uVar2 = FUN_4000_428f((char *)s_ARMOR__PLUS_6000_2a50,DAT_6000_c8c1,0,3);
      print_text(0,0x26,0,uVar2);
    }
    if (DAT_6000_c8c5 != '\0') {
      print_text(0,0x4c,0,(char *)s_FEATHER_6000_2a5d,7);
    }
    if (DAT_6000_c8c7 != '\0') {
      print_text(0,0x72,0,(char *)s_INVISIBILITY_6000_2a65,7);
    }
    if (DAT_6000_c8c6 != '\0') {
      print_text(0,0x98,0,(char *)s_FAST___MOVE_6000_2a72,7);
    }
    if (DAT_6000_c8cc != '\0') {
      print_text(0,0xbe,0,(char *)s_STRENGTH__PREP__6000_2a7e,6);
    }
    if (DAT_6000_c8cd != '\0') {
      print_text(0,0xe4,0,(char *)s_AGILITY__PREP__6000_2a8e,6);
    }
    if (DAT_6000_c8ce != '\0') {
      print_text(0,0x10a,0,(char *)s_SUPER_STRENGTH_6000_2a9d,6);
    }
    if (DAT_6000_c8cf != '\0') {
      print_text(0,0x130,0,(char *)s_SUPER_AGILITY_6000_2aac,6);
    }
    if (0 < DAT_6000_c8d0) {
      print_text(0,0x156,0,(char *)s_BATTLE_STRENGTH_6000_2aba,3);
    }
    if (0 < DAT_6000_c8d2) {
      print_text(0,0x17c,0,(char *)s_BATTLE_SPEED_6000_2aca,3);
    }
  }
  else {
    if (DAT_6000_c8d9 != '\0') {
      uVar2 = FUN_4000_428f((char *)s_PROTECT__LEVEL_6000_2ad7,DAT_6000_c8d9,0,5);
      print_text(0,0,0,uVar2);
    }
    if (DAT_6000_c8d6 != '\0') {
      uVar2 = FUN_4000_428f((char *)s_POWER_WEAPON_6000_2ae7,DAT_6000_c8d6,0,5);
      print_text(0,0x26,0,uVar2);
    }
    if (0 < DAT_6000_c8d4) {
      print_text(0,0x4c,0,(char *)s_SLOW_MONSTER_6000_2af5,7);
    }
    if (0 < DAT_6000_c8e8) {
      print_text(0,0x72,0,(char *)s_HOLD_MONSTER_6000_2b02,7);
    }
    if (0 < DAT_6000_c8e6) {
      print_text(0,0x98,0,(char *)s_STOP_MONSTER_6000_2b0f,7);
    }
    if (0 < DAT_6000_c8dc) {
      print_text(0,0xbe,0,(char *)s_RESIST_POISON_6000_2b1c,6);
    }
    if (0 < DAT_6000_c8de) {
      print_text(0,0xe4,0,(char *)s_RESIST_DISEASE_6000_2b2a,6);
    }
    if (0 < DAT_6000_c8e4) {
      print_text(0,0x10a,0,(char *)s_RESIST_DRAIN_6000_2b39,6);
    }
    if (0 < DAT_6000_c8e0) {
      print_text(0,0x130,0,(char *)s_ANTI_COLD_6000_2b46,6);
    }
    if (0 < DAT_6000_c8e2) {
      print_text(0,0x17c,0,(char *)s_ANTI_FIRE_6000_2b50,6);
    }
  }
  return;
}


// ==== FUN_2000_7756 @ 2000:7756 (size 960) callers: movecontrol

void __cdecl16far FUN_2000_7756(void)

{
  int iVar1;
  char *pcVar2;
  undefined2 uVar3;
  int iVar4;
  long lVar5;
  undefined2 uVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  
  FUN_2000_216b((char *)s_WHICH_TYPE_OF_ITEM_WOULD_YOU_6000_2b5a,(char *)s_LIKE_TO_DROP__6000_2b77,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_1__ARMOR_6000_2b87,(char *)s_2__WEAPON_6000_2b90,
                (char *)s_3__MONEY_6000_2b9a,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  iVar1 = FUN_2000_1fbd(3,5);
  if (iVar1 == 0x31) {
    FUN_2000_1c86();
    for (iVar4 = 0; iVar4 < 8; iVar4 = iVar4 + 1) {
      if ((char)((undefined1 *)&DAT_6000_c1a2)[iVar4] < '\x01') {
        strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)s__________6000_2ba3);
      }
      else {
        strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],
               (char *)*(undefined2 *)(iVar4 * 5 + 0x214));
        if (((undefined1 *)&DAT_6000_c1aa)[iVar4] != '\0') {
          strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)s_WEAPONS__PLUS_6000_2a41 + 7
                );
          pcVar2 = itoa((int)(char)((undefined1 *)&DAT_6000_c1aa)[iVar4],DAT_6000_cb52,10);
          strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],pcVar2);
        }
      }
    }
    iVar4 = FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,1,8);
    if (iVar4 == 1) {
      print_text(0,0x28,0,(char *)s_OWE__IT_JUST_WON_T_COME_OFF__6000_2bac,4);
      print_text(0,0x78,0,(char *)s_HIT_ANY_KEY____6000_20bd,4);
      wait_key();
      uVar8 = 0;
      uVar3 = 0x4af;
      lVar5 = N_LXMUL(0xa0,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar5 = F_LDIV(lVar5,CONCAT22(uVar8,uVar3));
      uVar3 = (undefined2)lVar5;
      uVar7 = 0;
      uVar8 = 0x63f;
      lVar5 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar5 = F_LDIV(lVar5,CONCAT22(uVar7,uVar8));
      uVar8 = (undefined2)lVar5;
      uVar6 = 0;
      uVar7 = 0x4af;
      lVar5 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar5 = F_LDIV(lVar5,CONCAT22(uVar6,uVar7));
      fill_rect(0,(int)lVar5,uVar8,uVar3);
    }
    else {
      if ('\0' < *(char *)(iVar4 + -0x3e5f)) {
        *(char *)(iVar4 + -0x3e5f) = *(char *)(iVar4 + -0x3e5f) + -1;
      }
      if (((int)DAT_6000_c1b2 == iVar4 + -1) && (*(char *)(iVar4 + -0x3e5f) == '\0')) {
        DAT_6000_c1b2 = '\0';
      }
    }
  }
  if (iVar1 == 0x32) {
    FUN_2000_1c86();
    for (iVar4 = 0; iVar4 < 8; iVar4 = iVar4 + 1) {
      if ((char)((undefined1 *)&DAT_6000_c173)[iVar4] < '\x01') {
        strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)s__________6000_2ba3);
      }
      else {
        strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],
               (char *)*(undefined2 *)(iVar4 * 7 + 0x1c0));
        if (((undefined1 *)&DAT_6000_c180)[iVar4] != '\0') {
          strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)s_WEAPONS__PLUS_6000_2a41 + 7
                );
          pcVar2 = itoa((int)(char)((undefined1 *)&DAT_6000_c180)[iVar4],DAT_6000_cb52,10);
          strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],pcVar2);
        }
      }
    }
    iVar4 = FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,1,8);
    if (iVar4 == 1) {
      print_text(0,0x28,0,(char *)s_OWE__IT_JUST_WON_T_COME_OFF__6000_2bac,4);
      print_text(0,0x78,0,(char *)s_HIT_ANY_KEY____6000_20bd,4);
      wait_key();
      uVar8 = 0;
      uVar3 = 0x4af;
      lVar5 = N_LXMUL(0xa0,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar5 = F_LDIV(lVar5,CONCAT22(uVar8,uVar3));
      uVar3 = (undefined2)lVar5;
      uVar7 = 0;
      uVar8 = 0x63f;
      lVar5 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar5 = F_LDIV(lVar5,CONCAT22(uVar7,uVar8));
      uVar8 = (undefined2)lVar5;
      uVar6 = 0;
      uVar7 = 0x4af;
      lVar5 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar5 = F_LDIV(lVar5,CONCAT22(uVar6,uVar7));
      fill_rect(0,(int)lVar5,uVar8,uVar3);
    }
    else {
      if ('\0' < *(char *)(iVar4 + -0x3e8e)) {
        *(char *)(iVar4 + -0x3e8e) = *(char *)(iVar4 + -0x3e8e) + -1;
      }
      if (((int)DAT_6000_c18d == iVar4 + -1) && (*(char *)(iVar4 + -0x3e8e) == '\0')) {
        DAT_6000_c18d = '\0';
      }
    }
  }
  if (iVar1 == 0x33) {
    load_h_bin(0x21);
    uVar3 = FUN_2000_1fbd(1,5);
    switch(uVar3) {
    case 0x31:
      DAT_6000_c550 = 0;
      DAT_6000_c54e = 0;
      break;
    case 0x32:
      DAT_6000_c554 = 0;
      DAT_6000_c552 = 0;
      break;
    case 0x33:
      DAT_6000_c558 = 0;
      DAT_6000_c556 = 0;
      break;
    case 0x34:
      DAT_6000_c55c = 0;
      DAT_6000_c55a = 0;
      break;
    case 0x35:
      DAT_6000_c560 = 0;
      DAT_6000_c55e = 0;
    }
  }
  FUN_2000_2d8e();
  return;
}


// ==== FUN_2000_7b20 @ 2000:7b20 (size 47) callers: FUN_2000_7b4f

void __cdecl16far FUN_2000_7b20(void)

{
  load_worldmap_bin();
  DAT_6000_c8ee = 1;
  save_player((int)DAT_6000_125c);
  save_dun(DAT_6000_12fd);
  FUN_3000_8235();
  load_dung_bin();
  return;
}


// ==== FUN_2000_7b4f @ 2000:7b4f (size 55) callers: movecontrol

void __cdecl16far FUN_2000_7b4f(void)

{
  int iVar1;
  
  load_h_bin(0x22);
  iVar1 = FUN_2000_1fbd(2,3);
  if (iVar1 == 0x31) {
    FUN_2000_7b20();
    return;
  }
  return;
}


// ==== FUN_2000_7b86 @ 2000:7b86 (size 167) callers: movecontrol

void __cdecl16far FUN_2000_7b86(void)

{
  save_dun(DAT_6000_12fd);
  save_mon_map();
  clear_screen();
  FUN_2000_3fcf();
  print_text(0x163,900,0,DAT_6000_cb52,0xf);
  print_text(0x26c,1000,0,(char *)s_HIT_ANY_KEY_6000_28ff,4);
  wait_key();
  save_player((int)DAT_6000_125c);
  if (DAT_6000_cd94 < 1) {
    FUN_4000_0f0d(0);
    FUN_1000_3339(2);
  }
  else {
    FUN_4000_0f0d(3);
    FUN_1000_3339(3);
  }
  FUN_1000_128d(0);
  return;
}


// ==== surface_feature @ 2000:7c2d (size 87) callers: movecontrol,FUN_3000_2796,FUN_3000_8235,draw_map_square  // the terrain 0..5 of a surface square, from its position

int __cdecl16far surface_feature(int param_1,int param_2)

{
  undefined2 local_4;
  
  if ((((0 < param_1) && (param_1 < DAT_6000_448b)) && (0 < param_2)) && (param_2 < DAT_6000_448d))
  {
    local_4 = myrand(param_1,param_2,DAT_6000_c8a2,DAT_6000_c8a4,0x6e);
    if (5 < local_4) {
      local_4 = 0;
    }
    return local_4;
  }
  return 0;
}


// ==== FUN_2000_7c8a @ 2000:7c8a (size 116) callers: movecontrol

void __cdecl16far FUN_2000_7c8a(char param_1)

{
  fill_rect(DAT_6000_448f + (int)DAT_6000_c8a6 * (int)DAT_6000_4488 + 2,
                DAT_6000_cd7e + (int)DAT_6000_c8a7 * (int)DAT_6000_4488 + 2,
                DAT_6000_448f + (DAT_6000_c8a6 + 1) * (int)DAT_6000_4488,
                DAT_6000_cd7e + (DAT_6000_c8a7 + 1) * (int)DAT_6000_4488,(int)param_1 % 0x10);
  return;
}


// ==== FUN_2000_7d00 @ 2000:7d00 (size 92) callers: movecontrol

void __cdecl16far FUN_2000_7d00(char param_1,int param_2,int param_3)

{
  fill_rect(DAT_6000_448f + DAT_6000_4488 * param_2 + 2,
                DAT_6000_cd7e + DAT_6000_4488 * param_3 + 2,
                DAT_6000_448f + (int)DAT_6000_4488 * (param_2 + 1),
                DAT_6000_cd7e + (int)DAT_6000_4488 * (param_3 + 1),(int)param_1);
  return;
}


// ==== FUN_2000_7d60 @ 2000:7d60 (size 233) callers: FUN_2000_9ed9

int __cdecl16far FUN_2000_7d60(void)

{
  char cVar1;
  uint in_AX;
  int iVar2;
  int iVar3;
  
  iVar3 = DAT_6000_c8a0;
  iVar2 = DAT_6000_c89e;
  if (DAT_6000_c89c == 0) {
    in_AX = wall_side(DAT_6000_c89e,DAT_6000_c8a0,1,DAT_6000_c8a2,DAT_6000_c8a4);
    if ((char)in_AX != '\x03') {
      return -1;
    }
    iVar3 = iVar3 + -1;
  }
  if (DAT_6000_c89c == 1) {
    in_AX = wall_side(iVar2,iVar3 + 1,1,DAT_6000_c8a2,DAT_6000_c8a4);
    if ((char)in_AX != '\x03') {
      return -1;
    }
    iVar3 = iVar3 + 1;
  }
  if (DAT_6000_c89c == 2) {
    in_AX = wall_side(iVar2,iVar3,in_AX & 0xff00,DAT_6000_c8a2,DAT_6000_c8a4);
    if ((char)in_AX != '\x03') {
      return -1;
    }
    iVar2 = iVar2 + -1;
  }
  if (DAT_6000_c89c == 3) {
    cVar1 = wall_side(iVar2 + 1,iVar3,in_AX & 0xff00,DAT_6000_c8a2,DAT_6000_c8a4);
    if (cVar1 != '\x03') {
      return -1;
    }
    iVar2 = iVar2 + 1;
  }
  iVar2 = FUN_2000_4575(iVar2,iVar3);
  if ((iVar2 != -1) && (iVar2 != 0xfe)) {
    return iVar2;
  }
  return -1;
}


// ==== FUN_2000_7e4f @ 2000:7e4f (size 354) callers: FUN_2000_81cd

void __cdecl16far FUN_2000_7e4f(int param_1)

{
  if ((0 < DAT_6000_c8d4) && (DAT_6000_c8d4 = DAT_6000_c8d4 - param_1, DAT_6000_c8d4 < 0)) {
    DAT_6000_c8d4 = 0;
  }
  if (0 < DAT_6000_c8d0) {
    if (param_1 < DAT_6000_c8d0) {
      DAT_6000_c8d0 = DAT_6000_c8d0 - param_1;
    }
    else {
      DAT_6000_c8d0 = 0;
      DAT_6000_c904 = DAT_6000_c904 + -7;
    }
  }
  if (0 < DAT_6000_c8d2) {
    if (param_1 < DAT_6000_c8d2) {
      DAT_6000_c8d2 = DAT_6000_c8d2 - param_1;
    }
    else {
      DAT_6000_c8d2 = 0;
      DAT_6000_c90c = DAT_6000_c90c + -7;
    }
  }
  if ((0 < DAT_6000_c8d7) && (DAT_6000_c8d7 = DAT_6000_c8d7 - param_1, DAT_6000_c8d7 < 1)) {
    DAT_6000_c8d6 = 0;
    DAT_6000_c8d7 = 0;
  }
  if ((0 < DAT_6000_c8da) && (DAT_6000_c8da = DAT_6000_c8da - param_1, DAT_6000_c8da < 1)) {
    DAT_6000_c8d9 = 0;
    DAT_6000_c8da = 0;
  }
  if ((0 < DAT_6000_c8e2) && (DAT_6000_c8e2 = DAT_6000_c8e2 - param_1, DAT_6000_c8e2 < 0)) {
    DAT_6000_c8e2 = 0;
  }
  if ((0 < DAT_6000_c8e0) && (DAT_6000_c8e0 = DAT_6000_c8e0 - param_1, DAT_6000_c8e0 < 0)) {
    DAT_6000_c8e0 = 0;
  }
  if ((0 < DAT_6000_c8e4) && (DAT_6000_c8e4 = DAT_6000_c8e4 - param_1, DAT_6000_c8e4 < 0)) {
    DAT_6000_c8e4 = 0;
  }
  if ((0 < DAT_6000_c8dc) && (DAT_6000_c8dc = DAT_6000_c8dc - param_1, DAT_6000_c8dc < 0)) {
    DAT_6000_c8dc = 0;
  }
  if ((0 < DAT_6000_c8de) && (DAT_6000_c8de = DAT_6000_c8de - param_1, DAT_6000_c8de < 0)) {
    DAT_6000_c8de = 0;
  }
  if (0 < DAT_6000_c8e6) {
    if (param_1 < DAT_6000_c8e6) {
      DAT_6000_c8e6 = DAT_6000_c8e6 - param_1;
    }
    else {
      DAT_6000_c8e6 = 0;
      strcpy(DAT_6000_cbee,(char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
    }
  }
  if (0 < DAT_6000_c8e8) {
    if (param_1 < DAT_6000_c8e8) {
      DAT_6000_c8e8 = DAT_6000_c8e8 - param_1;
    }
    else {
      DAT_6000_c8e8 = 0;
      strcpy(DAT_6000_cbee,(char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
    }
  }
  return;
}


// ==== FUN_2000_7fb1 @ 2000:7fb1 (size 540) callers: FUN_2000_a64b,movecontrol

void __cdecl16far FUN_2000_7fb1(int param_1)

{
  char cVar1;
  short sVar2;
  uint uVar3;
  uint uVar4;
  int iVar5;
  int iVar6;
  int iVar7;
  int iVar8;
  undefined2 uVar9;
  long lVar10;
  long b;
  
  DAT_6000_1305 = (float)param_1 + DAT_6000_1305;
  if (DAT_6000_c8a2 != 0) {
    for (iVar7 = 0; iVar7 < 0x91; iVar7 = iVar7 + 1) {
      ((undefined2 *)&DAT_6000_cbf0)[iVar7] = ((undefined2 *)&DAT_6000_cbf0)[iVar7] - param_1;
      if (0 < DAT_6000_c8d4) {
        b = 0x8000;
        sVar2 = rand();
        lVar10 = N_LXLSH((long)sVar2,'\x02');
        lVar10 = F_LDIV(lVar10,b);
        if ((int)lVar10 == 0) {
          ((undefined2 *)&DAT_6000_cbf0)[iVar7] =
               ((undefined2 *)&DAT_6000_cbf0)[iVar7] + DAT_6000_c90c / 3;
        }
      }
      uVar9 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
      uVar3 = (uint)*(byte *)((int)DAT_6000_cbde + iVar7 * 6) - DAT_6000_c89e;
      uVar4 = (uint)*(byte *)((int)DAT_6000_cbde + iVar7 * 6 + 1) - DAT_6000_c8a0;
      if ((((uVar4 == 0) && ((uVar3 ^ (int)uVar3 >> 0xf) - ((int)uVar3 >> 0xf) == 1)) ||
          ((uVar3 == 0 && ((uVar4 ^ (int)uVar4 >> 0xf) - ((int)uVar4 >> 0xf) == 1)))) &&
         ((((uVar4 == 0xffff &&
            (cVar1 = wall_side(DAT_6000_c89e,DAT_6000_c8a0), cVar1 == '\x03')) ||
           ((uVar4 == 1 && (cVar1 = wall_side(DAT_6000_c89e,DAT_6000_c8a0 + 1), cVar1 == '\x03')
            ))) || (((uVar3 == 0xffff &&
                     (cVar1 = wall_side(DAT_6000_c89e,DAT_6000_c8a0), cVar1 == '\x03')) ||
                    ((uVar3 == 1 &&
                     (cVar1 = wall_side(DAT_6000_c89e + 1,DAT_6000_c8a0), cVar1 == '\x03')))))))
         ) {
        iVar8 = 0;
        while ((int)((undefined2 *)&DAT_6000_cbf0)[iVar7] < 0) {
          iVar8 = iVar8 + 1;
          if (iVar8 == 3) {
            ((undefined2 *)&DAT_6000_cbf0)[iVar7] = DAT_6000_c90c;
          }
          ((undefined2 *)&DAT_6000_cbf0)[iVar7] =
               ((undefined2 *)&DAT_6000_cbf0)[iVar7] +
               (0x55 - *(char *)((uint)*(byte *)((int)DAT_6000_cbde + iVar7 * 6 + 4) * 0x23 + 0x24d)
               ) / 3 + 10;
          uVar9 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
          iVar5 = (uint)*(byte *)((int)DAT_6000_cbde + iVar7 * 6 + 3) * 0x100;
          uVar3 = (uint)*(byte *)((int)DAT_6000_cbde + iVar7 * 6 + 2);
          iVar6 = uVar3 + iVar5;
          if (iVar6 != 0 && SCARRY2(uVar3,iVar5) == iVar6 < 0) {
            DAT_6000_12ff = monster_turn();
          }
        }
      }
    }
  }
  return;
}


// ==== FUN_2000_81cd @ 2000:81cd (size 1260) callers: dig_hole,FUN_2000_a64b,movecontrol

void __cdecl16far FUN_2000_81cd(void)

{
  char cVar1;
  short sVar2;
  uint uVar3;
  int iVar4;
  uint uVar5;
  uint uVar6;
  int iVar7;
  undefined2 uVar8;
  long lVar9;
  long lVar10;
  
  FUN_2000_7e4f();
  if (DAT_6000_c8c6 == '\x01') {
    lVar10 = 0x8000;
    sVar2 = rand();
    lVar9 = N_LXLSH((long)sVar2,'\x02');
    lVar9 = F_LDIV(lVar9,lVar10);
    if ((int)lVar9 == 1) {
      return;
    }
  }
  if (((0 < DAT_6000_c8bc) && (DAT_6000_c8de < 1)) &&
     (DAT_6000_c8bc = DAT_6000_c8bc + -1, DAT_6000_c8bc == 1)) {
    DAT_6000_c8bc = 0x1c2;
    DAT_6000_c90a = DAT_6000_c90a + -1;
    if (DAT_6000_c90a < 2) {
      DAT_6000_c90a = 1;
    }
    save_player();
    load_h_bin();
    wait_key();
  }
  if (((0 < DAT_6000_c8be) && (DAT_6000_c8dc < 1)) &&
     (DAT_6000_c8be = DAT_6000_c8be + -1, DAT_6000_c8be == 1)) {
    DAT_6000_c8be = 0x1c2;
    DAT_6000_c904 = DAT_6000_c904 + -1;
    if (DAT_6000_c904 < 2) {
      DAT_6000_c904 = 1;
    }
    save_player();
    load_h_bin();
    wait_key();
  }
  if (DAT_6000_c8c7 == '\x01') {
    lVar10 = 0x8000;
    sVar2 = rand();
    lVar9 = N_LXLSH((long)sVar2,'\x02');
    lVar9 = F_LDIV(lVar9,lVar10);
    if ((int)lVar9 == 1) {
      return;
    }
  }
  for (iVar7 = 0; iVar7 < 0x91; iVar7 = iVar7 + 1) {
    if (0 < DAT_6000_c8d4) {
      lVar10 = 0x8000;
      sVar2 = rand();
      lVar9 = N_LXLSH((long)sVar2,'\x02');
      lVar9 = F_LDIV(lVar9,lVar10);
      if ((int)lVar9 == 0) {
        ((undefined2 *)&DAT_6000_cbf0)[iVar7] =
             ((undefined2 *)&DAT_6000_cbf0)[iVar7] + DAT_6000_c90c / 3;
      }
    }
    lVar10 = 0x8000;
    sVar2 = rand();
    lVar9 = N_LXMUL(5,(long)sVar2);
    lVar9 = F_LDIV(lVar9,lVar10);
    if ((int)lVar9 != 1) {
      uVar8 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
      uVar5 = DAT_6000_c89e - (uint)*(byte *)((int)DAT_6000_cbde + iVar7 * 6);
      uVar6 = DAT_6000_c8a0 - (uint)*(byte *)((int)DAT_6000_cbde + iVar7 * 6 + 1);
      if ((int)(((uVar5 ^ (int)uVar5 >> 0xf) - ((int)uVar5 >> 0xf)) +
               ((uVar6 ^ (int)uVar6 >> 0xf) - ((int)uVar6 >> 0xf))) < DAT_6000_c8a2 / 10 + 10) {
        ((undefined2 *)&DAT_6000_cbf0)[iVar7] = 0;
        uVar3 = set_occupant();
        if ((((int)uVar5 < 0) &&
            (uVar8 = (undefined2)((ulong)DAT_6000_cbde >> 0x10),
            uVar3 = wall_side(*(undefined1 *)((int)DAT_6000_cbde + iVar7 * 6),
                                  *(undefined1 *)((int)DAT_6000_cbde + iVar7 * 6 + 1),uVar3 & 0xff00
                                  ,DAT_6000_c8a2), (char)uVar3 != '\0')) &&
           (uVar3 = FUN_2000_4575(), uVar3 == 0xffff)) {
          uVar8 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
          *(char *)((int)DAT_6000_cbde + iVar7 * 6) = *(char *)((int)DAT_6000_cbde + iVar7 * 6) + -1
          ;
        }
        else if ((((int)uVar5 < 1) ||
                 (uVar8 = (undefined2)((ulong)DAT_6000_cbde >> 0x10),
                 cVar1 = wall_side(*(byte *)((int)DAT_6000_cbde + iVar7 * 6) + 1,
                                       *(undefined1 *)((int)DAT_6000_cbde + iVar7 * 6 + 1),
                                       uVar3 & 0xff00,DAT_6000_c8a2), cVar1 == '\0')) ||
                (iVar4 = FUN_2000_4575(), iVar4 != -1)) {
          if ((((int)uVar6 < 0) &&
              (uVar8 = (undefined2)((ulong)DAT_6000_cbde >> 0x10),
              cVar1 = wall_side(*(undefined1 *)((int)DAT_6000_cbde + iVar7 * 6),
                                    *(undefined1 *)((int)DAT_6000_cbde + iVar7 * 6 + 1),1,
                                    DAT_6000_c8a2), cVar1 != '\0')) &&
             (iVar4 = FUN_2000_4575(), iVar4 == -1)) {
            uVar8 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
            *(char *)((int)DAT_6000_cbde + iVar7 * 6 + 1) =
                 *(char *)((int)DAT_6000_cbde + iVar7 * 6 + 1) + -1;
          }
          else if (((0 < (int)uVar6) &&
                   (uVar8 = (undefined2)((ulong)DAT_6000_cbde >> 0x10),
                   cVar1 = wall_side(*(undefined1 *)((int)DAT_6000_cbde + iVar7 * 6),
                                         *(byte *)((int)DAT_6000_cbde + iVar7 * 6 + 1) + 1,1,
                                         DAT_6000_c8a2), cVar1 != '\0')) &&
                  (iVar4 = FUN_2000_4575(), iVar4 == -1)) {
            uVar8 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
            *(char *)((int)DAT_6000_cbde + iVar7 * 6 + 1) =
                 *(char *)((int)DAT_6000_cbde + iVar7 * 6 + 1) + '\x01';
          }
        }
        else {
          uVar8 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
          *(char *)((int)DAT_6000_cbde + iVar7 * 6) =
               *(char *)((int)DAT_6000_cbde + iVar7 * 6) + '\x01';
        }
        set_occupant();
      }
      else if ((int)((undefined2 *)&DAT_6000_cbf0)[iVar7] < 0) {
        ((undefined2 *)&DAT_6000_cbf0)[iVar7] = 1;
      }
    }
  }
  return;
}


// ==== FUN_2000_86b9 @ 2000:86b9 (size 111) callers: inn,dig_hole

void __cdecl16far FUN_2000_86b9(void)

{
  if (0 < DAT_6000_c8d0) {
    DAT_6000_c8d0 = 0;
    DAT_6000_c904 = DAT_6000_c904 + -7;
  }
  if (0 < DAT_6000_c8d2) {
    DAT_6000_c8d2 = 0;
    DAT_6000_c90c = DAT_6000_c90c + -7;
  }
  DAT_6000_c8d4 = 0;
  DAT_6000_c8e6 = 0;
  DAT_6000_c8e8 = 0;
  DAT_6000_c8d7 = 0;
  DAT_6000_c8d6 = 0;
  DAT_6000_c8da = 0;
  DAT_6000_c8d9 = 0;
  DAT_6000_c8de = 0;
  DAT_6000_c8dc = 0;
  DAT_6000_c8e0 = 0;
  DAT_6000_c8e2 = 0;
  DAT_6000_c8e4 = 0;
  return;
}


// ==== FUN_2000_8728 @ 2000:8728 (size 517) callers: FUN_2000_892d,movecontrol

void __cdecl16far FUN_2000_8728(int param_1,int param_2,int param_3)

{
  short sVar1;
  int unaff_SI;
  int unaff_DI;
  long lVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  undefined2 uVar6;
  short radix;
  
  if (param_2 < DAT_6000_c8a0) {
    unaff_SI = 0x2d4;
    unaff_DI = 4;
  }
  if (DAT_6000_c8a0 < param_2) {
    unaff_SI = 0x2d4;
    unaff_DI = 0x260;
  }
  if (param_1 < DAT_6000_c89e) {
    unaff_SI = 0x11d;
    unaff_DI = 0x1b2;
  }
  if (DAT_6000_c89e < param_1) {
    unaff_SI = 0x48b;
    unaff_DI = 0x1b2;
  }
  if (DAT_6000_cd94 == 0) {
    uVar6 = 0;
    uVar5 = 0x4af;
    lVar2 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)(unaff_DI + 0x28));
    F_LDIV(lVar2,CONCAT22(uVar6,uVar5));
    uVar6 = 0;
    uVar5 = 0x63f;
    lVar2 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)(unaff_SI + 0x18a));
    lVar2 = F_LDIV(lVar2,CONCAT22(uVar6,uVar5));
    uVar5 = (undefined2)lVar2;
    uVar4 = 0;
    uVar6 = 0x4af;
    lVar2 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)unaff_DI);
    lVar2 = F_LDIV(lVar2,CONCAT22(uVar4,uVar6));
    uVar6 = (undefined2)lVar2;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar2 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)(unaff_SI + 0xdb));
    lVar2 = F_LDIV(lVar2,CONCAT22(uVar3,uVar4));
    fill_rect((int)lVar2,uVar6,uVar5);
  }
  else {
    uVar6 = 0;
    uVar5 = 0x4af;
    lVar2 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)(unaff_DI + 0x28));
    F_LDIV(lVar2,CONCAT22(uVar6,uVar5));
    uVar6 = 0;
    uVar5 = 0x63f;
    lVar2 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)(unaff_SI + 0x18a));
    lVar2 = F_LDIV(lVar2,CONCAT22(uVar6,uVar5));
    uVar5 = (undefined2)lVar2;
    uVar4 = 0;
    uVar6 = 0x4af;
    lVar2 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)unaff_DI);
    lVar2 = F_LDIV(lVar2,CONCAT22(uVar4,uVar6));
    uVar6 = (undefined2)lVar2;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar2 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)(unaff_SI + 0xdb));
    lVar2 = F_LDIV(lVar2,CONCAT22(uVar3,uVar4));
    fill_rect((int)lVar2,uVar6,uVar5);
  }
  strcpy(DAT_6000_cb52,(char *)0x2bc9);
  radix = 10;
  sVar1 = strlen(DAT_6000_cb52);
  uVar5 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
  itoa((uint)*(byte *)((int)DAT_6000_cbde + param_3 * 6 + 2) +
       (uint)*(byte *)((int)DAT_6000_cbde + param_3 * 6 + 3) * 0x100,DAT_6000_cb52 + sVar1,radix);
  print_text(unaff_SI + 0xdb,unaff_DI,0,DAT_6000_cb52,DAT_6000_1303);
  return;
}


// ==== FUN_2000_892d @ 2000:892d (size 382) callers: FUN_2000_8b3f

void __cdecl16far FUN_2000_892d(undefined2 param_1,int param_2)

{
  int iVar1;
  short sVar2;
  short sVar3;
  longdouble in_ST0;
  undefined2 uVar4;
  double dVar5;
  
  iVar1 = FUN_2000_4575();
  if (iVar1 == -1) {
    return;
  }
  if (*(byte *)((int)DAT_6000_cbde + iVar1 * 6 + 5) < 10) {
    strcpy(DAT_6000_cb52,(char *)s_CEXPERIENCE_NEEDED_FOR_LEVEL__6000_26ac + 0x17);
  }
  else {
    strcpy(DAT_6000_cb52,(char *)0x2bcd);
  }
  sVar3 = 10;
  sVar2 = strlen(DAT_6000_cb52);
  itoa((uint)*(byte *)((int)DAT_6000_cbde + iVar1 * 6 + 5),DAT_6000_cb52 + sVar2,sVar3);
  print_text(param_1,param_2);
  FUN_2000_8728();
  if (DAT_6000_c8a2 < 0x51) {
    if (DAT_6000_c8a2 < 0x29) {
      if (DAT_6000_c8a2 < 0xb) {
        strcpy(DAT_6000_cb52,(char *)s_EXP__VALUE__6000_2bdc);
      }
      else {
        strcpy(DAT_6000_cb52,(char *)0x2bd6);
      }
    }
    else {
      strcpy(DAT_6000_cb52,(char *)0x2bd2);
    }
  }
  else {
    strcpy(DAT_6000_cb52,(char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  }
  FUN_3000_b8d4();
  dVar5 = (double)in_ST0;
  uVar4 = 0x26ca;
  sVar3 = strlen(DAT_6000_cb52);
  FUN_1000_43f9(DAT_6000_cb52 + sVar3,uVar4,dVar5);
  if (param_2 < 0x24e) {
    print_text(param_1,param_2 + 0x226);
  }
  else {
    print_text(param_1,param_2 + 0x201);
  }
  return;
}


// ==== FUN_2000_8aab @ 2000:8aab (size 148) callers: FUN_2000_8b3f

void __cdecl16far
FUN_2000_8aab(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             undefined2 param_5,undefined2 param_6,undefined2 param_7,undefined2 param_8)

{
  long lVar1;
  undefined2 uVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  
  uVar5 = 0;
  uVar4 = 0x4af;
  lVar1 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),CONCAT22(param_8,param_7));
  F_LDIV(lVar1,CONCAT22(uVar5,uVar4));
  uVar5 = 0;
  uVar4 = 0x63f;
  lVar1 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),CONCAT22(param_6,param_5));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar5,uVar4));
  uVar4 = (undefined2)lVar1;
  uVar3 = 0;
  uVar5 = 0x4af;
  lVar1 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),CONCAT22(param_4,param_3));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar5));
  uVar5 = (undefined2)lVar1;
  uVar2 = 0;
  uVar3 = 0x63f;
  lVar1 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),CONCAT22(param_2,param_1));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar2,uVar3));
  fill_rect((int)lVar1,uVar5,uVar4);
  return;
}


// ==== FUN_2000_8b3f @ 2000:8b3f (size 1110) callers: movecontrol,FUN_2000_d195

void __cdecl16far
FUN_2000_8b3f(undefined2 *param_1,undefined2 *param_2,undefined2 *param_3,undefined2 *param_4)

{
  char cVar1;
  undefined1 extraout_AH;
  undefined1 extraout_AH_00;
  undefined2 uVar2;
  undefined1 extraout_AH_01;
  undefined1 uVar4;
  uint uVar3;
  
  DAT_6000_cd18 = 0;
  if ((DAT_6000_45cb != DAT_6000_45c9) && (DAT_6000_45c9 != 0)) {
    FUN_2000_8aab(0x2d1,0,0,0,0x486,0,0x25a,0,0);
    FUN_2000_8aab(0x117,0,0x1ac,0,0x2cf,0,0x408,0,0);
    FUN_2000_8aab(0x2d1,0,0x25b,0,0x486,0,0x4af,0,0);
    FUN_2000_8aab(0x488,0,0x1ac,0,0x63f,0,0x408,0,0);
  }
  if ((DAT_6000_45c9 == 0) || (DAT_6000_4593 != -1)) {
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,0,0x2d3,0,0x484,
                          600,*param_1);
    *param_1 = uVar2;
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,2,0x11b,0x1ae,
                          0x2cd,0x406,*param_2);
    *param_2 = uVar2;
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,1,0x2d3,0x25d,
                          0x484,0x487,*param_4);
    *param_4 = uVar2;
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,3,0x48a,0x1ae,
                          0x63e,0x406,*param_3);
    *param_3 = uVar2;
    DAT_6000_45cb = 0;
    FUN_4000_3873(0);
    uVar4 = extraout_AH;
  }
  else if (DAT_6000_45c9 == 1) {
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,0,0x2d3,300,0x484,
                          600,*param_1);
    *param_1 = uVar2;
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,2,0x11b,0x1ae,
                          0x2cd,0x2da,*param_2);
    *param_2 = uVar2;
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,1,0x2d3,0x25d,
                          0x484,0x389,*param_4);
    *param_4 = uVar2;
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,3,0x48a,0x1ae,
                          0x63e,0x2da,*param_3);
    *param_3 = uVar2;
    DAT_6000_45cb = 1;
    FUN_4000_3873(1);
    uVar4 = extraout_AH_00;
  }
  else {
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,0,0x340,300,0x417,
                          600,*param_1);
    *param_1 = uVar2;
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,2,0x260,0x1ae,
                          0x33a,0x2da,*param_2);
    *param_2 = uVar2;
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,1,0x340,0x25d,
                          0x417,900,*param_4);
    *param_4 = uVar2;
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,3,0x41d,0x1ae,
                          0x4f7,0x2da,*param_3);
    *param_3 = uVar2;
    DAT_6000_45cb = 2;
    FUN_4000_3873(2);
    uVar4 = extraout_AH_01;
  }
  cVar1 = wall_side(DAT_6000_c89e,DAT_6000_c8a0,CONCAT11(uVar4,1),DAT_6000_c8a2,DAT_6000_c8a4);
  if (cVar1 == '\x03') {
    FUN_2000_892d(0x2d4,7,DAT_6000_c89e,DAT_6000_c8a0 + -1);
  }
  uVar3 = wall_side(DAT_6000_c89e,DAT_6000_c8a0 + 1,1,DAT_6000_c8a2,DAT_6000_c8a4);
  if ((char)uVar3 == '\x03') {
    uVar3 = FUN_2000_892d(0x2d4,0x25f,DAT_6000_c89e,DAT_6000_c8a0 + 1);
  }
  uVar3 = wall_side(DAT_6000_c89e,DAT_6000_c8a0,uVar3 & 0xff00,DAT_6000_c8a2,DAT_6000_c8a4);
  if ((char)uVar3 == '\x03') {
    uVar3 = FUN_2000_892d(0x11d,0x1b5,DAT_6000_c89e + -1,DAT_6000_c8a0);
  }
  cVar1 = wall_side(DAT_6000_c89e + 1,DAT_6000_c8a0,uVar3 & 0xff00,DAT_6000_c8a2,DAT_6000_c8a4);
  if (cVar1 == '\x03') {
    FUN_2000_892d(0x48b,0x1b5,DAT_6000_c89e + 1,DAT_6000_c8a0);
  }
  return;
}


// ==== FUN_2000_8f95 @ 2000:8f95 (size 67) callers: show_help,FUN_2000_919a,view_stats,FUN_2000_9968

void __cdecl16far FUN_2000_8f95(void)

{
  long a;
  long b;
  
  b = 0x63f;
  a = N_LXMUL(0x2ce,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  F_LDIV(a,b);
  fill_rect();
  DAT_6000_130d = 900;
  return;
}


// ==== show_help @ 2000:8fd8 (size 450) callers: FUN_2000_919a,FUN_3000_8235  // prints <n>.HLP a page at a time, in the colours it names

void __cdecl16far show_help(short param_1)

{
  int iVar1;
  short sVar2;
  undefined2 uVar3;
  int iVar4;
  long lVar5;
  undefined2 uVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  char local_18 [16];
  int local_8;
  int local_6;
  void *local_4;
  
  uVar3 = 0xf;
  itoa(param_1,local_18,10);
  strcat(local_18,(char *)s_spells_hlp_6000_2692 + 6);
  local_4 = fopen(local_18,(char *)0x1bcb);
  if (local_4 == (void *)0x0) {
    uVar8 = 0;
    uVar7 = 0;
    uVar3 = 0x4af;
    lVar5 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar5 = F_LDIV(lVar5,CONCAT22(uVar7,uVar3));
    uVar3 = (undefined2)lVar5;
    uVar6 = 0;
    uVar7 = 0x63f;
    lVar5 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar5 = F_LDIV(lVar5,CONCAT22(uVar6,uVar7));
    fill_rect(0,0,(int)lVar5,uVar3,uVar8);
    print_text(0,0,0,(char *)s_HELP_FILE_NOT_FOUND_6000_2be9,DAT_6000_1303);
    wait_key();
  }
  else {
    do {
      local_8 = 0;
      iVar4 = 0;
      FUN_2000_8f95();
      do {
        local_6 = fgetc(local_4);
        iVar1 = FUN_1000_446b(0x2bfd,local_6);
        if (iVar1 == 0) {
          if (local_6 == 10) {
            DAT_6000_cb52[iVar4] = '\0';
            sVar2 = strlen(DAT_6000_cb52);
            if (sVar2 != 0) {
              print_text(0x2d0,local_8 * 0x28,0,DAT_6000_cb52,uVar3);
            }
            local_8 = local_8 + 1;
            iVar4 = 0;
          }
          else {
            DAT_6000_cb52[iVar4] = (char)local_6;
            iVar4 = iVar4 + 1;
          }
        }
        else {
          if (local_6 == 0x72) {
            uVar3 = 6;
          }
          if (local_6 == 0x67) {
            uVar3 = 8;
          }
          if (local_6 == 0x62) {
            uVar3 = 3;
          }
          if (local_6 == 0x79) {
            uVar3 = 4;
          }
          if (local_6 == 0x6e) {
            uVar3 = 7;
          }
          if (local_6 == 0x6f) {
            uVar3 = 5;
          }
          if (local_6 == 0x77) {
            uVar3 = 0xf;
          }
        }
      } while (local_6 != 0x65);
      wait_key();
      local_6 = fgetc(local_4);
      if (local_6 != 0x65) {
        fgetc(local_4);
      }
    } while (local_6 != 0x65);
    fclose(local_4);
    FUN_2000_8f95();
  }
  return;
}


// ==== FUN_2000_919a @ 2000:919a (size 324) callers: movecontrol

void __cdecl16far FUN_2000_919a(void)

{
  short sVar1;
  int iVar2;
  int iVar3;
  int iVar4;
  
  DAT_6000_cd18 = 1;
  DAT_6000_1248 = 0xffff;
  DAT_6000_1246 = 0xffff;
  DAT_6000_1244 = 0xffff;
  DAT_6000_1242 = 0xffff;
  DAT_6000_1240 = 0xffff;
  DAT_6000_123e = 0xffff;
  do {
    FUN_2000_8f95();
    FUN_4000_3563();
    iVar4 = -1;
    do {
      do {
        sVar1 = kbhit();
        if (sVar1 != 0) {
          sVar1 = getch();
          iVar2 = FUN_1000_1878(sVar1);
          goto LAB_2000_922e;
        }
      } while (DAT_6000_d0da == 0);
      iVar2 = mouse_pick(0x130f);
      if ((iVar2 == 0x1c) || (iVar3 = FUN_4000_2d34(1), iVar3 != 0)) {
        FUN_4000_3435();
        FUN_2000_8f95();
        return;
      }
      if (0x11 < iVar2) {
        iVar2 = iVar2 + 0x1e;
      }
    } while (iVar2 == -1);
LAB_2000_922e:
    if (DAT_6000_d0da != 0) {
      FUN_4000_3435();
    }
    if (iVar2 == 0x61) {
LAB_2000_9271:
      iVar4 = 4;
    }
    else if (iVar2 < 0x62) {
      switch(iVar2) {
      case 0:
        goto LAB_2000_9271;
      case 1:
LAB_2000_9294:
        iVar4 = 0xb;
        break;
      case 2:
LAB_2000_929e:
        iVar4 = 0xd;
        break;
      case 3:
LAB_2000_928a:
        iVar4 = 9;
        break;
      case 4:
LAB_2000_9299:
        iVar4 = 0xc;
        break;
      case 5:
LAB_2000_9267:
        iVar4 = 2;
        break;
      case 6:
LAB_2000_927b:
        iVar4 = 6;
        break;
      case 7:
LAB_2000_9285:
        iVar4 = 8;
        break;
      case 8:
LAB_2000_9276:
        iVar4 = 5;
        break;
      case 9:
LAB_2000_9262:
        iVar4 = 1;
        break;
      case 10:
LAB_2000_925e:
        iVar4 = 0;
        break;
      case 0xb:
LAB_2000_928f:
        iVar4 = 10;
        break;
      case 0xc:
LAB_2000_9280:
        iVar4 = 7;
        break;
      case 0xd:
LAB_2000_926c:
        iVar4 = 3;
        break;
      case 0xe:
LAB_2000_92a3:
        iVar4 = 0xe;
        break;
      case 0xf:
LAB_2000_92b2:
        iVar4 = 0x10;
        break;
      case 0x10:
LAB_2000_92ad:
        iVar4 = 0x11;
        break;
      case 0x11:
LAB_2000_92a8:
        iVar4 = 0xf;
      }
    }
    else {
      switch(iVar2) {
      case 0x62:
        goto LAB_2000_9294;
      case 99:
        goto LAB_2000_929e;
      case 100:
        goto LAB_2000_928a;
      case 0x65:
        goto LAB_2000_9299;
      case 0x66:
        goto LAB_2000_9267;
      case 0x69:
        goto LAB_2000_927b;
      case 0x6c:
        goto LAB_2000_9285;
      case 0x6d:
        goto LAB_2000_9276;
      case 0x6f:
        goto LAB_2000_92b2;
      case 0x70:
        goto LAB_2000_92a3;
      case 0x71:
        goto LAB_2000_9262;
      case 0x73:
        goto LAB_2000_925e;
      case 0x75:
        goto LAB_2000_928f;
      case 0x76:
        goto LAB_2000_9280;
      case 0x77:
        goto LAB_2000_926c;
      case 0x78:
        goto LAB_2000_92ad;
      case 0x7a:
        goto LAB_2000_92a8;
      }
    }
    if ((0x2f < iVar2) && (iVar2 < 0x3a)) {
      iVar4 = iVar2 + -0x1c;
    }
    if (iVar4 == -1) {
      FUN_2000_8f95();
      return;
    }
    show_help(iVar4);
  } while( true );
}


// ==== view_stats @ 2000:933a (size 1150) callers: movecontrol  // the vital-statistics screen

void __cdecl16far view_stats(void)

{
  undefined2 uVar1;
  
  DAT_6000_cd18 = 1;
  DAT_6000_1248 = 0xffff;
  DAT_6000_1246 = 0xffff;
  DAT_6000_1244 = 0xffff;
  DAT_6000_1242 = 0xffff;
  DAT_6000_1240 = 0xffff;
  DAT_6000_123e = 0xffff;
  FUN_2000_8f95();
  uVar1 = FUN_4000_426a((char *)s_VIEW_STATS_FOR_6000_2c05,(undefined1 *)&DAT_6000_c0f2,3);
  print_text(0x2d0,0,0,uVar1);
  uVar1 = FUN_4000_426a((char *)s_RACE__6000_2c15,*(undefined2 *)(DAT_6000_c11a * 0xe + 0x150),4);
  print_text(0x2d0,0x3c,0,uVar1);
  uVar1 = FUN_4000_426a(0x2c1c,*(undefined2 *)(DAT_6000_c11b * 2 + 0x119b),4);
  print_text(0x2d0,100,0,uVar1);
  uVar1 = FUN_4000_426a((char *)s_CLASS__6000_2c22,*(undefined2 *)(DAT_6000_c11c * 2 + 0x118d),4);
  print_text(0x2d0,0x8c,0,uVar1);
  uVar1 = FUN_4000_428f((char *)s_MONEY_IN_POCKET__6000_2c2a,DAT_6000_c546,DAT_6000_c548,8);
  print_text(0x2d0,0xbe,0,uVar1);
  uVar1 = FUN_4000_428f((char *)s_MONEY_IN_BANK__6000_2c3c,DAT_6000_c54a,DAT_6000_c54c,8);
  print_text(0x2d0,0xe6,0,uVar1);
  uVar1 = FUN_4000_428f((char *)s_TOTAL_MONEY__6000_2c4c,DAT_6000_c54a + DAT_6000_c546,
                        DAT_6000_c54c + DAT_6000_c548 + (uint)CARRY2(DAT_6000_c54a,DAT_6000_c546),8)
  ;
  print_text(0x2d0,0x10e,0,uVar1);
  uVar1 = FUN_4000_428f((char *)s_LOADED_WEIGHT__6000_2c5a,DAT_6000_c133,DAT_6000_c133 >> 0xf,5);
  print_text(0x2d0,0x140,0,uVar1);
  uVar1 = FUN_4000_428f((char *)s_NAKED_WEIGHT__6000_2c6a,DAT_6000_c131,DAT_6000_c131 >> 0xf,5);
  print_text(0x2d0,0x168,0,uVar1);
  uVar1 = FUN_4000_428f((char *)s_HEIGHT__INCHES___6000_2c79,DAT_6000_c12f,DAT_6000_c12f >> 0xf,5);
  print_text(0x2d0,400,0,uVar1);
  uVar1 = FUN_4000_428f((char *)s_STRENGTH__6000_2c8b,DAT_6000_c904,DAT_6000_c904 >> 0xf,6);
  print_text(0x2d0,0x1c2,0,uVar1);
  uVar1 = FUN_4000_428f((char *)s_INTELLIGENCE__6000_2c96,DAT_6000_c906,DAT_6000_c906 >> 0xf,6);
  print_text(0x2d0,0x1ea,0,uVar1);
  uVar1 = FUN_4000_428f(0x2ca5,DAT_6000_c908,DAT_6000_c908 >> 0xf,6);
  print_text(0x2d0,0x212,0,uVar1);
  uVar1 = FUN_4000_428f((char *)s_CONSTITUTION__6000_2cae,DAT_6000_c90a,DAT_6000_c90a >> 0xf,6);
  print_text(0x2d0,0x23a,0,uVar1);
  uVar1 = FUN_4000_428f((char *)s_AGILITY__6000_2cbd,DAT_6000_c90c,DAT_6000_c90c >> 0xf,6);
  print_text(0x2d0,0x262,0,uVar1);
  uVar1 = FUN_4000_428f(0x2cc7,DAT_6000_c90e,DAT_6000_c90e >> 0xf,6);
  print_text(0x2d0,0x28a,0,uVar1);
  uVar1 = FUN_4000_426a((char *)s_WEAPON_IN_HAND__6000_2cce,
                        *(undefined2 *)(DAT_6000_c18d * 7 + 0x1c0),4);
  print_text(0x2d0,700,0,uVar1);
  uVar1 = FUN_4000_426a((char *)s_CURRENT_ARMOR__6000_2cdf,
                        *(undefined2 *)(DAT_6000_c1b2 * 5 + 0x214),4);
  print_text(0x2d0,0x2e4,0,uVar1);
  if (0 < DAT_6000_c8bc) {
    print_text(0x2d0,0x316,0,(char *)s_YOU_ARE_DISEASED_MOVES_LEFT_UNTI_6000_2cef,8);
    uVar1 = FUN_4000_428f((char *)s_CONSTITUTION_DRAINED__6000_2d11,DAT_6000_c8bc,
                          DAT_6000_c8bc >> 0xf,8);
    print_text(0x2d0,0x33e,0,uVar1);
  }
  if (0 < DAT_6000_c8be) {
    print_text(0x2d0,0x370,0,(char *)s_YOU_ARE_POISONED_MOVES_LEFT_UNTI_6000_2d2a,6);
    uVar1 = FUN_4000_428f((char *)s_STRENGTH_DRAINED__6000_2d4c,DAT_6000_c8be,DAT_6000_c8be >> 0xf,6
                         );
    print_text(0x2d0,0x398,0,uVar1);
  }
  if (DAT_6000_c8c2 != '\0') {
    uVar1 = FUN_4000_428f((char *)s_BODY_ARMOR___PLUS_6000_2d61,DAT_6000_c8c2,0,6);
    print_text(0x2d0,0x3ca,0,uVar1);
  }
  if (DAT_6000_c8f8 == -1) {
    print_text(0x2d0,0x460,0,(char *)s_NO_RAISE_DEAD_CONTRACT_IS_IN_EFF_6000_2d95,6);
  }
  else {
    print_text(0x2d0,0x460,0,(char *)s_RAISE_DEAD_CONTRACT_IS_IN_EFFECT_6000_2d74,6);
  }
  print_text(0x2d0,0x488,0,(char *)s_HIT_ANY_KEY_TO_RETURN_TO_GAME____6000_2db9,3);
  wait_key();
  FUN_2000_8f95();
  flush_keys();
  return;
}


// ==== FUN_2000_97b8 @ 2000:97b8 (size 424) callers: FUN_2000_9968

void __cdecl16far FUN_2000_97b8(int param_1)

{
  char cVar1;
  uint uVar2;
  undefined2 unaff_BP;
  undefined2 unaff_SI;
  int unaff_DI;
  long lVar3;
  int iVar4;
  
  iVar4 = unaff_DI;
  if (param_1 != -1) {
    clear_screen();
    uVar2 = FUN_3000_1a08(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,param_1,0,0,0x63f,
                          0x4af,100);
    if (((((param_1 == 0) &&
          (uVar2 = wall_side(DAT_6000_c89e,DAT_6000_c8a0,1,DAT_6000_c8a2,DAT_6000_c8a4),
          (char)uVar2 == '\x03')) ||
         ((param_1 == 1 &&
          (uVar2 = wall_side(DAT_6000_c89e,DAT_6000_c8a0 + 1,1,DAT_6000_c8a2,DAT_6000_c8a4),
          (char)uVar2 == '\x03')))) ||
        ((param_1 == 2 &&
         (uVar2 = wall_side(DAT_6000_c89e,DAT_6000_c8a0,uVar2 & 0xff00,DAT_6000_c8a2,
                                DAT_6000_c8a4), (char)uVar2 == '\x03')))) ||
       ((param_1 == 3 &&
        (cVar1 = wall_side(DAT_6000_c89e + 1,DAT_6000_c8a0,uVar2 & 0xff00,DAT_6000_c8a2,
                               DAT_6000_c8a4), cVar1 == '\x03')))) {
      switch(param_1) {
      case 0:
        unaff_DI = FUN_2000_4575(DAT_6000_c89e,DAT_6000_c8a0 + -1);
        break;
      case 1:
        unaff_DI = FUN_2000_4575(DAT_6000_c89e,DAT_6000_c8a0 + 1);
        break;
      case 2:
        unaff_DI = FUN_2000_4575(DAT_6000_c89e + -1,DAT_6000_c8a0);
        break;
      case 3:
        unaff_DI = FUN_2000_4575(DAT_6000_c89e + 1,DAT_6000_c8a0);
      }
      if (unaff_DI != -1) {
        print_text(0x2da,10,1,
                      *(undefined2 *)
                       ((uint)*(byte *)((int)DAT_6000_cbde + unaff_DI * 6 + 4) * 0x23 + 0x237),
                      DAT_6000_1303);
      }
    }
  }
  flush_keys();
  DAT_6000_125a = 0xffff;
  DAT_6000_1258 = 0xffff;
  DAT_6000_1256 = 0xffff;
  DAT_6000_1254 = 0xffff;
  DAT_6000_124c = 0xbff0000000000000;
  lVar3 = ftol((double)CONCAT26(unaff_BP,CONCAT24(0xffff,CONCAT22(unaff_SI,iVar4))));
  DAT_6000_124a = (int)lVar3;
  DAT_6000_123d = 1;
  return;
}


// ==== FUN_2000_9968 @ 2000:9968 (size 848) callers: movecontrol

void __cdecl16far FUN_2000_9968(void)

{
  short sVar1;
  int iVar2;
  long lVar3;
  long lVar4;
  
  iVar2 = -1;
  DAT_6000_cd18 = 1;
  DAT_6000_1248 = 0xffff;
  DAT_6000_1246 = 0xffff;
  DAT_6000_1244 = 0xffff;
  DAT_6000_1242 = 0xffff;
  DAT_6000_1240 = 0xffff;
  DAT_6000_123e = 0xffff;
  FUN_2000_8f95();
  if ((DAT_6000_13f9 == -1) || (DAT_6000_13f9 == 4)) {
    if (DAT_6000_13f9 == 4) {
      sVar1 = 0x7a;
    }
    else {
      sVar1 = kbhit();
      if (sVar1 == 0) {
        print_text();
      }
      sVar1 = kbhit();
      if (sVar1 == 0) {
        print_text();
      }
      sVar1 = kbhit();
      if (sVar1 == 0) {
        print_text();
      }
      sVar1 = kbhit();
      if (sVar1 == 0) {
        print_text();
      }
      sVar1 = kbhit();
      if (sVar1 == 0) {
        print_text();
      }
      sVar1 = kbhit();
      if (sVar1 == 0) {
        print_text();
      }
      sVar1 = kbhit();
      if (sVar1 == 0) {
        print_text();
      }
      if (DAT_6000_d0da != 0) {
        print_text_clipped(0x2d5,700,0x63f,2,(char *)s_NORTH_6000_2e5d,7);
        print_text_clipped(0x2d5,800,0x63f,2,(char *)s_WEST_EAST_6000_2e69,7);
        print_text_clipped(0x2d5,900,0x63f,2,(char *)s_SOUTH_6000_2e75,7);
        print_text_clipped(0x2d5,0x41a,0x63f,1,(char *)s_CHANGE_VIEW_SIZE_6000_2e81,7);
      }
      do {
        sVar1 = kbhit();
        if (sVar1 != 0) {
          sVar1 = getch();
          if (sVar1 == 0) {
            sVar1 = getch();
            if (sVar1 == 0x48) {
              iVar2 = 0;
            }
            if (sVar1 == 0x4b) {
              iVar2 = 2;
            }
            if (sVar1 == 0x4d) {
              iVar2 = 3;
            }
            if (sVar1 == 0x50) {
              iVar2 = 1;
            }
          }
          goto LAB_2000_9bbb;
        }
      } while ((DAT_6000_d0da == 0) || (sVar1 = mouse_pick(0x13fb), sVar1 == -1));
      if (sVar1 == 0) {
        iVar2 = 0;
      }
      if (sVar1 == 1) {
        iVar2 = 2;
      }
      if (sVar1 == 2) {
        iVar2 = 3;
      }
      if (sVar1 == 3) {
        iVar2 = 1;
      }
      if (sVar1 == 4) {
        sVar1 = 0x7a;
      }
LAB_2000_9bbb:
      if (DAT_6000_d0da != 0) {
        FUN_4000_3435();
      }
    }
    DAT_6000_13f9 = -1;
    if ((sVar1 == 0x7a) || (sVar1 == 0x5a)) {
      DAT_6000_45c9 = (DAT_6000_45c9 + 1) % 3;
      flush_keys();
      lVar4 = 0x63f;
      lVar3 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      F_LDIV(lVar3,lVar4);
      fill_rect();
      return;
    }
  }
  else {
    if (DAT_6000_13f9 == 0) {
      iVar2 = 0;
    }
    if (DAT_6000_13f9 == 1) {
      iVar2 = 2;
    }
    if (DAT_6000_13f9 == 2) {
      iVar2 = 1;
    }
    if (DAT_6000_13f9 == 3) {
      iVar2 = 3;
    }
  }
  if (iVar2 == -1) {
    lVar4 = 0x63f;
    lVar3 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    F_LDIV(lVar3,lVar4);
    fill_rect();
  }
  else {
    FUN_2000_97b8(iVar2);
    wait_key();
    clear_screen();
  }
  DAT_6000_130d = 900;
  DAT_6000_13f9 = 0xffff;
  flush_keys();
  return;
}


// ==== FUN_2000_9cb8 @ 2000:9cb8 (size 39) callers: FUN_2000_a64b

int __cdecl16far FUN_2000_9cb8(void)

{
  int iVar1;
  
  iVar1 = DAT_6000_c133 + 100 + DAT_6000_c90c * -10;
  if (iVar1 < 0) {
    iVar1 = 0;
  }
  return iVar1 / 100 + 1;
}


// ==== FUN_2000_9ce1 @ 2000:9ce1 (size 34) callers: movecontrol

void __cdecl16far FUN_2000_9ce1(void)

{
  bRam00000417 = bRam00000417 & 0xdf;
  return;
}


// ==== chute @ 2000:9d03 (size 327) callers: movecontrol  // falling down a chute

void __cdecl16far chute(int param_1)

{
  long lVar1;
  undefined2 uVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  
  if (param_1 == DAT_6000_c8a2) {
    return;
  }
  DAT_6000_c8a2 = param_1;
  enter_level(param_1);
  save_player((int)DAT_6000_125c);
  uVar5 = 0;
  uVar4 = 0;
  uVar2 = 0x4af;
  lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
  uVar2 = (undefined2)lVar1;
  uVar3 = 0;
  uVar4 = 0x63f;
  lVar1 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
  fill_rect(0,0,(int)lVar1,uVar2,uVar5);
  print_text(0,0,0,(char *)s_UH_OH____A_SINKING_FEELING____6000_2e92,5);
  FUN_1000_22a2(0x5dc);
  print_text(0,0x28,0,(char *)s_YOU_HAVE_FALLEN_DOWN_A_CHUTE__6000_2eb0,5);
  print_text(0,0x50,0,(char *)s_HIT_ANY_KEY_TO_CONTINUE____6000_2ece,5);
  flush_keys();
  wait_key();
  flush_keys();
  uVar5 = 0;
  uVar4 = 0;
  uVar2 = 0x4af;
  lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
  uVar2 = (undefined2)lVar1;
  uVar3 = 0;
  uVar4 = 0x63f;
  lVar1 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
  fill_rect(0,0,(int)lVar1,uVar2,uVar5);
  DAT_6000_123d = 1;
  DAT_6000_cd18 = 1;
  return;
}


// ==== chute_target @ 2000:9e4a (size 137) callers: movecontrol,draw_map_square  // the level a chute on this square drops to, or this one

int __cdecl16far chute_target(undefined2 param_1,undefined2 param_2,int param_3,undefined2 param_4)

{
  char cVar1;
  int iVar2;
  int local_4;
  
  local_4 = 3;
  iVar2 = 0xe6 - param_3 / 3;
  if (iVar2 < 0x14) {
    iVar2 = 0x14;
  }
  iVar2 = myrand(param_1,param_2,param_3,param_4,iVar2);
  if (iVar2 < 5) {
    iVar2 = param_3;
    if (9 < param_3) {
      local_4 = 5;
    }
    while ((iVar2 = iVar2 + 1, iVar2 < param_3 + local_4 && (iVar2 < 0xb5))) {
      cVar1 = is_solid(param_1,param_2,iVar2,param_4);
      if (cVar1 == '\0') {
        return iVar2;
      }
    }
  }
  return param_3;
}


// ==== FUN_2000_9ed9 @ 2000:9ed9 (size 703) callers: dig_hole,movecontrol

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

int __cdecl16far FUN_2000_9ed9(void)

{
  int iVar1;
  int iVar2;
  short sVar3;
  char *dst;
  char *pcVar4;
  long lVar5;
  undefined2 uVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  undefined2 uVar11;
  undefined2 uVar12;
  undefined2 uVar13;
  
  iVar1 = FUN_2000_7d60();
  if (iVar1 == -1) {
    DAT_6000_cd40 = -1;
    DAT_6000_c89c = (DAT_6000_c89c + 1) % 4;
    iVar1 = FUN_2000_7d60();
    if (iVar1 == -1) {
      DAT_6000_c89c = (DAT_6000_c89c + 1) % 4;
      iVar1 = FUN_2000_7d60();
      if (iVar1 == -1) {
        DAT_6000_c89c = (DAT_6000_c89c + 1) % 4;
        iVar1 = FUN_2000_7d60();
        if (iVar1 == -1) {
          DAT_6000_c89c = DAT_6000_c89c + 1;
        }
        DAT_6000_c89c = DAT_6000_c89c % 4;
      }
    }
  }
  if (iVar1 == DAT_6000_4593) goto LAB_2000_a002;
  DAT_6000_cd28 = (int)DAT_6000_cbde + iVar1 * 6 + 2;
  _DAT_6000_cd2a = DAT_6000_cbde._2_2_;
  DAT_6000_4593 = iVar1;
  iVar2 = random_n(3);
  if (iVar2 == 0) {
    if (DAT_6000_c8c7 == '\0') goto LAB_2000_a002;
    iVar2 = DAT_6000_c8a2 + DAT_6000_c8a2 / 2;
    uVar12 = 0;
    uVar9 = 0x8000;
    sVar3 = rand();
    lVar5 = N_LXMUL((long)iVar2,(long)sVar3);
    lVar5 = F_LDIV(lVar5,CONCAT22(uVar12,uVar9));
    if ((int)lVar5 <= DAT_6000_c89a) goto LAB_2000_a002;
  }
  iVar2 = DAT_6000_c90c;
  uVar12 = 0;
  uVar9 = 0x8000;
  sVar3 = rand();
  lVar5 = N_LXMUL((long)iVar2,(long)sVar3);
  lVar5 = F_LDIV(lVar5,CONCAT22(uVar12,uVar9));
  ((undefined2 *)&DAT_6000_cbf0)[DAT_6000_4593] = (int)lVar5;
LAB_2000_a002:
  if ((DAT_6000_4593 != -1) && (DAT_6000_c89c != DAT_6000_cd40)) {
    DAT_6000_cd40 = DAT_6000_c89c;
    uVar12 = 0;
    uVar9 = 0x4af;
    lVar5 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar5 = F_LDIV(lVar5,CONCAT22(uVar12,uVar9));
    uVar9 = (undefined2)lVar5;
    uVar10 = 0;
    uVar12 = 0x63f;
    lVar5 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar5 = F_LDIV(lVar5,CONCAT22(uVar10,uVar12));
    uVar12 = (undefined2)lVar5;
    uVar7 = 0;
    uVar10 = 0x4af;
    lVar5 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar5 = F_LDIV(lVar5,CONCAT22(uVar7,uVar10));
    fill_rect(0,(int)lVar5,uVar12,uVar9);
    print_text(0,0x28,0,(char *)s_YOU_ARE_FIGHTING_THE_MONSTER_6000_2eeb,DAT_6000_1303);
    if (DAT_6000_c89c == 2) {
      strcpy(DAT_6000_cb52,(char *)s_IN_THE_WEST_6000_2f08);
    }
    else if (DAT_6000_c89c == 3) {
      strcpy(DAT_6000_cb52,(char *)s_IN_THE_EAST_6000_2f15);
    }
    else if (DAT_6000_c89c == 0) {
      strcpy(DAT_6000_cb52,(char *)s_IN_THE_NORTH_6000_2f22);
    }
    else if (DAT_6000_c89c == 1) {
      strcpy(DAT_6000_cb52,(char *)s_IN_THE_SOUTH_6000_2f30);
    }
    strcat(DAT_6000_cb52,(char *)s_ZOOM_IN_ON_A_VIEW__6000_2e01 + 0xd);
    print_text(0,0x50,0,DAT_6000_cb52,DAT_6000_1303);
    uVar13 = 0;
    uVar11 = 0;
    uVar8 = 0x2d0;
    uVar6 = 0;
    uVar7 = 0x78;
    uVar10 = 0;
    uVar12 = 0;
    pcVar4 = (char *)*(undefined2 *)
                      ((uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 4) * 0x23 + 0x237);
    uVar9 = DAT_6000_1303;
    dst = strcpy(DAT_6000_cb52,(char *)s_MONSTER_TYPE__6000_2f3e);
    pcVar4 = strcat(dst,pcVar4);
    draw_text_box(pcVar4,uVar12,uVar10,uVar7,uVar6,uVar8,uVar11,uVar13,uVar9);
  }
  return iVar1;
}


// ==== dig_hole @ 2000:a19d (size 987) callers: movecontrol  // digging through the floor

undefined2 __cdecl16far dig_hole(void)

{
  char cVar1;
  int iVar2;
  int iVar3;
  long lVar4;
  undefined2 uVar5;
  undefined2 uVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  int local_8;
  int local_6;
  
  if (0x78 < DAT_6000_c8a2) {
    FUN_2000_22ff((char *)s_THE_FLOOR_SEEMS_TO_BE_MADE_6000_2f4d,
                  (char *)s_OF_SOLID_ROCK__IT_IS_NOT_6000_2f68,
                  (char *)s_POSSIBLE_TO_DIG_HERE__6000_2f83,
                  (char *)s_A_LITTLE_MOUSE_SUGGESTS_6000_2f9b,
                  (char *)s_YOU_USE_A_LADDER_OR_A_6000_2fb3,(char *)s_SPELL__6000_29a4,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_HIT_ANY_KEY____6000_20bd);
    return 0;
  }
  FUN_2000_216b((char *)s_DO_YOU_WISH_TO_DIG_A_HOLE_6000_2fcb,(char *)s_IN_THE_FLOOR__6000_2fe5,
                (char *)s_IT_MAY_TAKE_SOME_TIME__BUT_6000_2ff5,
                (char *)s_IF_YOU_ARE_TRAPPED__THEN_6000_3010,(char *)s_YOU_HAVE_NO_CHOICE__6000_302b
                ,(char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_1__DIG_A_HOLE_IN_THE_FLOOR_6000_3041,
                (char *)s_2__FORGET_THE_HOLE_IDEA_6000_305c);
  iVar2 = FUN_2000_1fbd(6,7);
  if (iVar2 == 0x31) {
    for (iVar2 = 0; iVar2 < 0x91; iVar2 = iVar2 + 1) {
      ((undefined2 *)&DAT_6000_cbf0)[iVar2] = 0xfb50;
    }
    for (iVar2 = 0; iVar2 < 6; iVar2 = iVar2 + 1) {
      FUN_2000_81cd();
    }
    for (iVar2 = 0; iVar2 < 0x91; iVar2 = iVar2 + 1) {
      ((undefined2 *)&DAT_6000_cbf0)[iVar2] = 0;
    }
    iVar2 = FUN_2000_9ed9();
    if (iVar2 != -1) {
      DAT_6000_cd18 = 1;
      uVar8 = 0;
      uVar7 = 0;
      uVar5 = 0x4af;
      lVar4 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar4 = F_LDIV(lVar4,CONCAT22(uVar7,uVar5));
      uVar5 = (undefined2)lVar4;
      uVar6 = 0;
      uVar7 = 0x63f;
      lVar4 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar4 = F_LDIV(lVar4,CONCAT22(uVar6,uVar7));
      fill_rect(0,0,(int)lVar4,uVar5,uVar8);
      print_text(0,0,0,(char *)s_A_MONSTER_WANTS_TO_HELP_6000_3074,4);
      FUN_1000_22a2(1000);
      return 0;
    }
    for (iVar2 = 0; iVar2 < 4; iVar2 = iVar2 + 1) {
      uVar8 = 0;
      uVar7 = 0;
      uVar5 = 0x4af;
      lVar4 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar4 = F_LDIV(lVar4,CONCAT22(uVar7,uVar5));
      uVar5 = (undefined2)lVar4;
      uVar6 = 0;
      uVar7 = 0x63f;
      lVar4 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar4 = F_LDIV(lVar4,CONCAT22(uVar6,uVar7));
      fill_rect(0,0,(int)lVar4,uVar5,uVar8);
      FUN_1000_22a2(300);
      print_text(0,0,0,(char *)s_DIGGING____DIGGING____6000_308c,DAT_6000_1303);
      FUN_1000_22a2(0x5dc);
    }
    FUN_2000_22ff((char *)s_BOY_THIS_IS_HARD_WORK__6000_30a2,
                  (char *)s_YOUR_HANDS_ARE_RAW_FROM_6000_30b9,
                  (char *)s_DIGGING__BLISTERS_ARE_6000_30d1,
                  (char *)s_DEVELOPING_ON_YOUR_HANDS_6000_30e9,
                  (char *)s_MAKING_IT_A_LITTLE_MORE_6000_3104,
                  (char *)s_DIFFICULT_TO_HOLD_YOUR_6000_311e,(char *)s_WEAPONS__6000_3137,
                  (char *)s_HIT_ANY_KEY____6000_20bd);
    if (DAT_6000_c8a2 < 0x10) {
      for (iVar2 = 0; iVar2 < 4; iVar2 = iVar2 + 1) {
        uVar8 = 0;
        uVar7 = 0;
        uVar5 = 0x4af;
        lVar4 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
        lVar4 = F_LDIV(lVar4,CONCAT22(uVar7,uVar5));
        uVar5 = (undefined2)lVar4;
        uVar6 = 0;
        uVar7 = 0x63f;
        lVar4 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
        lVar4 = F_LDIV(lVar4,CONCAT22(uVar6,uVar7));
        fill_rect(0,0,(int)lVar4,uVar5,uVar8);
        FUN_1000_22a2(300);
        print_text(0,0,0,(char *)s_DIGGING____DIGGING____6000_308c,DAT_6000_1303);
        FUN_1000_22a2(2000);
      }
    }
    flush_keys();
    uVar8 = 0;
    uVar7 = 0;
    uVar5 = 0x4af;
    lVar4 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar4 = F_LDIV(lVar4,CONCAT22(uVar7,uVar5));
    uVar5 = (undefined2)lVar4;
    uVar6 = 0;
    uVar7 = 0x63f;
    lVar4 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar4 = F_LDIV(lVar4,CONCAT22(uVar6,uVar7));
    fill_rect(0,0,(int)lVar4,uVar5,uVar8);
    DAT_6000_4593 = 0xffff;
    enter_level(DAT_6000_c8a2);
    DAT_6000_123d = 1;
    iVar2 = DAT_6000_c8a2;
    if (DAT_6000_c8a2 < 0x96) {
      local_6 = 1;
    }
    else {
      local_6 = -1;
    }
    while( true ) {
      iVar2 = iVar2 + local_6;
      if (iVar2 == 0x7c) {
        local_6 = -1;
      }
      if (iVar2 == 1) {
        local_6 = 1;
      }
      cVar1 = is_solid(DAT_6000_c89e,DAT_6000_c8a0,iVar2,DAT_6000_c8a4);
      if (cVar1 == '\0') break;
      if (0x82 < local_8) {
        if (DAT_6000_c8a2 < 0x96) {
          DAT_6000_c8a2 = DAT_6000_c8a2 + 1;
        }
        for (iVar2 = 0x15; iVar2 < 0x3b; iVar2 = iVar2 + 1) {
          for (iVar3 = 0x15; iVar3 < 0x59; iVar3 = iVar3 + 1) {
            cVar1 = is_solid(iVar2,iVar3,DAT_6000_c8a2,DAT_6000_c8a4);
            if (cVar1 == '\0') {
              DAT_6000_c89e = iVar2;
              DAT_6000_c8a0 = iVar3;
              enter_level(DAT_6000_c8a2);
              return 1;
            }
          }
        }
      }
      local_8 = local_8 + 1;
    }
    FUN_2000_86b9();
    DAT_6000_c8a2 = iVar2;
    enter_level(iVar2);
    return 1;
  }
  return 0;
}


// ==== FUN_2000_a57e @ 2000:a57e (size 205) callers: movecontrol

void __cdecl16far FUN_2000_a57e(void)

{
  long lVar1;
  undefined2 uVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  
  if (DAT_6000_45c7 == 1) {
    DAT_6000_45c7 = 0;
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
  }
  else {
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
  }
  set_occupant(DAT_6000_c89e,DAT_6000_c8a0,0xffff);
  return;
}


// ==== FUN_2000_a64b @ 2000:a64b (size 77) callers: movecontrol

void __cdecl16far FUN_2000_a64b(void)

{
  short sVar1;
  long lVar2;
  
  set_occupant();
  DAT_6000_c123 = DAT_6000_c123 + (uint)DAT_6000_c8b8;
  lVar2 = 0x8000;
  sVar1 = rand();
  lVar2 = F_LDIV(CONCAT22((sVar1 >> 0xf) << 1 | (uint)(sVar1 < 0),sVar1 << 1),lVar2);
  if ((int)lVar2 != 0) {
    FUN_2000_9cb8();
    FUN_2000_7fb1();
  }
  FUN_2000_81cd();
  return;
}


// ==== trapdoor_target @ 2000:a698 (size 94) callers: movecontrol,draw_map_square  // the level a trap door on this square leads to, or -1

int __cdecl16far trapdoor_target(undefined2 param_1,undefined2 param_2,int param_3,undefined2 param_4)

{
  int iVar1;
  
  iVar1 = myrand(param_1,param_2,param_3,param_4,0x960);
  iVar1 = iVar1 * 10;
  if ((9 < iVar1) && (iVar1 < 0xb4)) {
    if (iVar1 / 10 == param_3 / 10) {
      return -1;
    }
    return iVar1;
  }
  return -1;
}


// ==== FUN_2000_a6fa @ 2000:a6fa (size 145) callers: movecontrol

undefined2 __cdecl16far FUN_2000_a6fa(int *param_1,int *param_2,undefined2 param_3)

{
  char cVar1;
  short sVar2;
  int iVar3;
  int iVar4;
  ushort seed;
  long lVar5;
  long lVar6;
  
  seed = 10;
  do {
    srand(seed);
    lVar6 = 0x8000;
    sVar2 = rand();
    lVar5 = N_LXMUL(0x3c,(long)sVar2);
    lVar5 = F_LDIV(lVar5,lVar6);
    iVar3 = (int)lVar5 + 10;
    lVar6 = 0x8000;
    sVar2 = rand();
    lVar5 = N_LXMUL(0x5a,(long)sVar2);
    lVar5 = F_LDIV(lVar5,lVar6);
    iVar4 = (int)lVar5 + 10;
    seed = seed + 1;
    cVar1 = is_solid(iVar3,iVar4,param_3);
  } while (cVar1 != '\0');
  *param_1 = iVar3;
  *param_2 = iVar4;
  return param_3;
}


// ==== FUN_2000_a791 @ 2000:a791 (size 320) callers: movecontrol

undefined2 __cdecl16far FUN_2000_a791(int param_1)

{
  short sVar1;
  int iVar2;
  short radix;
  
  DAT_6000_45c7 = 1;
  for (iVar2 = 0; iVar2 < 8; iVar2 = iVar2 + 1) {
    strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar2],
           (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  }
  strcpy(DAT_6000_cd80,(char *)s_YOU_HAVE_FOUND_A_TRAP_DOOR_6000_3142);
  strcat(DAT_6000_cd82,(char *)s_WITH_A_KEYHOLE_LABELED_6000_315f);
  radix = 10;
  sVar1 = strlen(DAT_6000_cd82);
  itoa(param_1,DAT_6000_cd82 + sVar1,radix);
  strcat(DAT_6000_cd82,(char *)s_INSERT_THE_MORAFF_S_WORLD_DATA_D_6000_1bdb + 0x44);
  if (*(char *)(param_1 / 10 + -0x36f0) == '\0') {
    strcpy(DAT_6000_cd84,(char *)s_UNFORTUNATELY__YOU_DO_6000_3177);
    strcpy(DAT_6000_cd86,(char *)s_NOT_HAVE_THE_CORRECT_KEY__6000_318f);
    strcpy(DAT_6000_cd88,(char *)s_THIS_KEY_CAN_ONLY_BE_6000_31a9);
    strcpy(DAT_6000_cd8a,(char *)s_FOUND_BY_KILLING_A_LEVEL_6000_31c0);
    strcpy(DAT_6000_cd8c,(char *)s_DRAINER_NEAR_THE_LEVEL_6000_31d9);
    strcpy(DAT_6000_cd8e,(char *)s_THIS_TRAP_DOOR_LEADS_TO__6000_31f0);
    FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
    return 0;
  }
  strcpy(DAT_6000_cd86,(char *)s_TO_USE_THE_KEY_YOU_FOUND_6000_3209);
  strcpy(DAT_6000_cd88,(char *)s_EARLIER__HIT__K__TO_USE_6000_3222);
  strcpy(DAT_6000_cd8a,(char *)s_DOOR____6000_323a);
  FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
  return 1;
}


// ==== FUN_2000_a8d7 @ 2000:a8d7 (size 230) callers: movecontrol

void __cdecl16far FUN_2000_a8d7(void)

{
  uint uVar1;
  uint uVar2;
  uint uVar3;
  uint uVar4;
  byte *pbVar5;
  undefined2 uVar6;
  
  uVar6 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
  pbVar5 = (byte *)DAT_6000_cbde;
  if ((0x67 < pbVar5[4]) && (pbVar5[4] < 0x70)) {
    uVar1 = DAT_6000_c89e - (uint)*DAT_6000_cbde;
    uVar2 = (int)uVar1 >> 0xf;
    uVar3 = DAT_6000_c8a0 - (uint)pbVar5[1];
    uVar4 = (int)uVar3 >> 0xf;
    if ((int)((uVar3 ^ uVar4) - uVar4) < (int)((uVar1 ^ uVar2) - uVar2)) {
      if ((int)(uint)*DAT_6000_cbde < DAT_6000_c89e) {
        print_text(0x4b0,0x442,0,(char *)s_GO_WEST_6000_3242,4);
      }
      else {
        print_text(0x4b0,0x442,0,(char *)s_GO_EAST_6000_324a,4);
      }
    }
    else if ((int)(uint)pbVar5[1] < DAT_6000_c8a0) {
      print_text(0x4b0,0x442,0,(char *)s_GO_NORTH_6000_3252,4);
    }
    else {
      print_text(0x4b0,0x442,0,(char *)s_GO_SOUTH_6000_325b,4);
    }
  }
  return;
}


// ==== FUN_2000_a9bd @ 2000:a9bd (size 280) callers: movecontrol

void __cdecl16far FUN_2000_a9bd(int param_1)

{
  long lVar1;
  undefined2 uVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  
  if (param_1 != DAT_6000_130d) {
    DAT_6000_130d = param_1;
    uVar5 = 0;
    uVar3 = 0x63f;
    lVar1 = N_LXMUL(0x47e,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar5,uVar3));
    uVar3 = (undefined2)lVar1;
    uVar4 = 0;
    uVar5 = 0x4af;
    lVar1 = N_LXMUL(0x48a,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar5));
    uVar5 = (undefined2)lVar1;
    uVar2 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2da,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar2,uVar4));
    fill_rect((int)lVar1,uVar5,uVar3);
    if (param_1 == -0xf) {
      print_text_clipped(0x2da,0x48d,0x47e,0,(char *)s_HIT__K__TO_USE_TRAP_DOOR_6000_3264,5);
    }
    else {
      if (0 < param_1) {
        print_text_clipped(0x2da,0x48d,0x47e,0,(char *)s_HIT__D__TO_GO_DOWN_6000_327d,5);
      }
      if (param_1 < 0) {
        print_text_clipped(0x2da,0x48d,0x47e,0,(char *)s_HIT__U__TO_GO_UP_6000_3290,5);
      }
      if (param_1 == 0) {
        print_text_clipped(0x2da,0x48d,0x47e,0,(char *)s_HIT__D__TO_DIG_A_HOLE_6000_32a1,5);
      }
    }
  }
  return;
}


// ==== movecontrol @ 2000:aad5 (size 6003) callers: main  // the main play loop: keys, movement, menus

/* WARNING: Removing unreachable block (ram,0x0002bbf2) */
/* WARNING: Removing unreachable block (ram,0x0002bd28) */
/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

undefined2 __cdecl16far movecontrol(void)

{
  byte bVar1;
  int iVar2;
  undefined1 extraout_AH;
  undefined2 uVar3;
  undefined1 extraout_AH_00;
  undefined1 extraout_AH_01;
  undefined1 extraout_AH_02;
  undefined1 extraout_AH_03;
  undefined1 extraout_AH_04;
  undefined1 uVar11;
  uint uVar4;
  uint uVar5;
  uint uVar6;
  uint uVar7;
  short sVar8;
  char *pcVar9;
  uint uVar10;
  int iVar12;
  undefined2 unaff_SI;
  int iVar13;
  undefined2 unaff_DI;
  long lVar14;
  undefined2 uVar15;
  undefined2 uVar16;
  int iVar17;
  undefined2 uVar18;
  int in_stack_0000ffce;
  int in_stack_0000ffd0;
  undefined2 local_20;
  undefined2 local_1e;
  undefined2 local_1c;
  undefined2 local_1a;
  int local_18;
  int local_16;
  int local_14;
  int local_12;
  int local_10;
  uint local_e;
  int local_c;
  uint local_a;
  int local_8;
  int local_6;
  int local_4;
  
  local_4 = 0;
  local_6 = 0;
  local_8 = 0;
  local_a = 0;
  local_c = 0;
  local_16 = -1;
  local_1a = 0;
  local_1c = 0;
  local_1e = 0;
  local_20 = 0;
  local_12 = 0;
  if (DAT_6000_c8ee == 1) {
    load_worldmap_bin();
    FUN_3000_8235();
    load_dung_bin();
  }
  else {
    FUN_4000_3873(DAT_6000_45c9);
  }
  set_occupant(DAT_6000_c89e,DAT_6000_c8a0,0xfe);
  DAT_6000_c8a7 = DAT_6000_448a >> 1;
  DAT_6000_c8a6 = DAT_6000_4489 >> 1;
  FUN_3000_b066(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
  FUN_2000_2d8e();
  FUN_4000_3a72();
  do {
    if (DAT_6000_c123 < 0) {
      FUN_1000_22a2(0x514);
      flush_keys();
      FUN_2000_726f();
      if (DAT_6000_c123 < 0) {
        return 0xff;
      }
    }
    local_18 = 0;
    FUN_2000_9ce1();
    FUN_2000_f853();
    iVar2 = FUN_2000_5196(DAT_6000_c89e,DAT_6000_c8a0);
    if (iVar2 == 0) {
      FUN_2000_5263(DAT_6000_c89e,DAT_6000_c8a0);
      draw_map_square(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,
                    CONCAT11(extraout_AH,DAT_6000_c8a6),CONCAT11(extraout_AH,DAT_6000_c8a7));
    }
    local_16 = -1;
    local_14 = ladder_delta(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
    if (((local_14 == 0) &&
        (local_16 = trapdoor_target(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4),
        local_16 != -1)) && (iVar2 = FUN_2000_a791(local_16), iVar2 == 0)) {
      local_16 = -1;
    }
    if (((local_14 == 0) && (0 < DAT_6000_c8a2)) && (local_16 == -1)) {
      uVar3 = chute_target(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
      chute(uVar3);
    }
    if (DAT_6000_c8a2 == 0) {
      local_18 = surface_feature(DAT_6000_c89e,DAT_6000_c8a0);
    }
    FUN_2000_9ed9();
    if (DAT_6000_4593 != -1) {
      DAT_6000_45c7 = 1;
    }
    DAT_6000_c939 = 0;
    if (local_16 == -1) {
      if ((local_14 < 0) || (local_18 != 0)) {
        FUN_2000_a9bd(0xffff);
        uVar11 = extraout_AH_01;
      }
      else if (local_14 < 1) {
        FUN_2000_a9bd(0);
        uVar11 = extraout_AH_03;
      }
      else {
        FUN_2000_a9bd(1);
        uVar11 = extraout_AH_02;
      }
    }
    else {
      FUN_2000_a9bd(0xfff1);
      uVar11 = extraout_AH_00;
    }
    if (DAT_6000_cd18 == 1) {
      FUN_4000_3a72();
      uVar11 = extraout_AH_04;
    }
    bVar1 = wall_side(DAT_6000_c89e,DAT_6000_c8a0,CONCAT11(uVar11,1),DAT_6000_c8a2,DAT_6000_c8a4
                         );
    uVar4 = (uint)bVar1;
    bVar1 = wall_side(DAT_6000_c89e,DAT_6000_c8a0 + 1,1,DAT_6000_c8a2,DAT_6000_c8a4);
    uVar5 = (uint)bVar1;
    bVar1 = wall_side(DAT_6000_c89e + 1,DAT_6000_c8a0,0,DAT_6000_c8a2,DAT_6000_c8a4);
    uVar6 = (uint)bVar1;
    bVar1 = wall_side(DAT_6000_c89e,DAT_6000_c8a0,0,DAT_6000_c8a2,DAT_6000_c8a4);
    uVar7 = (uint)bVar1;
    if ((DAT_6000_cd94 == 9) && (DAT_6000_9636 == 3)) {
      FUN_4000_10ee();
    }
    DAT_6000_1425 = 1;
    do {
      if (DAT_6000_123d != '\0') {
        DAT_6000_c8a7 = DAT_6000_448a >> 1;
        DAT_6000_c8a6 = DAT_6000_4489 >> 1;
        FUN_3000_b066(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
        DAT_6000_123d = '\0';
      }
      iVar2 = local_12;
      local_12 = local_12 + 1;
      FUN_2000_7c8a(iVar2);
      local_e = 0xffff;
      iVar2 = -1;
      sVar8 = kbhit();
      if (sVar8 == 0) {
        if (DAT_6000_d0da != 0) {
          for (iVar13 = 0; iVar13 < 4; iVar13 = iVar13 + 1) {
            ((undefined1 *)&DAT_6000_d0ee)[iVar13] = 0;
          }
          if ((uVar4 != 3) ||
             (iVar13 = FUN_2000_4575(DAT_6000_c89e,DAT_6000_c8a0 + -1), iVar13 != -1)) {
            DAT_6000_d0ee = 0xff;
          }
          if ((uVar7 != 3) ||
             (iVar13 = FUN_2000_4575(DAT_6000_c89e - 1,DAT_6000_c8a0), iVar13 != -1)) {
            DAT_6000_d0ef = 0xff;
          }
          if ((uVar5 != 3) ||
             (iVar13 = FUN_2000_4575(DAT_6000_c89e,DAT_6000_c8a0 + 1), iVar13 != -1)) {
            DAT_6000_d0f0 = 0xff;
          }
          if ((uVar6 != 3) ||
             (iVar13 = FUN_2000_4575(DAT_6000_c89e + 1,DAT_6000_c8a0), iVar13 != -1)) {
            DAT_6000_d0f1 = 0xff;
          }
          DAT_6000_1425 = (DAT_6000_1425 + 1) % 2;
          if (DAT_6000_1427 == 0xffff) {
            local_e = mouse_pick(0x7f91);
          }
          else {
            local_e = DAT_6000_1427;
          }
          for (iVar13 = 0; iVar13 < 4; iVar13 = iVar13 + 1) {
            ((undefined1 *)&DAT_6000_d0ee)[iVar13] = 0;
          }
          if ((int)local_e < -9) {
            local_e = -local_e - 10;
            if ((-1 < (int)local_e) && ((int)local_e < 4)) {
              DAT_6000_13f9 = 4;
              iVar2 = 0x7a;
            }
            if ((3 < (int)local_e) && ((int)local_e < 8)) {
              if (local_e == 4) {
                DAT_6000_13f9 = 0;
              }
              if (local_e == 5) {
                DAT_6000_13f9 = 1;
              }
              if (local_e == 6) {
                DAT_6000_13f9 = 2;
              }
              if (local_e == 7) {
                DAT_6000_13f9 = 3;
              }
              iVar2 = 0x7a;
            }
          }
          else if (local_e != 0xffff) {
            if (((int)local_e < 0) || (3 < (int)local_e)) {
              local_e = local_e - 4;
            }
            else {
              DAT_6000_1427 = local_e;
            }
            if (local_e == 0) {
              if ((uVar4 == 3) &&
                 (iVar2 = FUN_2000_4575(DAT_6000_c89e,DAT_6000_c8a0 + -1), iVar2 != -1)) {
                iVar2 = 0x66;
              }
              else {
                iVar2 = -0x48;
              }
              DAT_6000_c89c = 0;
              FUN_2000_9ed9();
              if (DAT_6000_4593 != -1) {
                DAT_6000_45c7 = 1;
              }
            }
            if (local_e == 1) {
              if ((uVar7 == 3) &&
                 (iVar2 = FUN_2000_4575(DAT_6000_c89e - 1,DAT_6000_c8a0), iVar2 != -1)) {
                iVar2 = 0x66;
              }
              else {
                iVar2 = -0x4b;
              }
              DAT_6000_c89c = 2;
              FUN_2000_9ed9();
              if (DAT_6000_4593 != -1) {
                DAT_6000_45c7 = 1;
              }
            }
            if (local_e == 2) {
              if ((uVar5 == 3) &&
                 (iVar2 = FUN_2000_4575(DAT_6000_c89e,DAT_6000_c8a0 + 1), iVar2 != -1)) {
                iVar2 = 0x66;
              }
              else {
                iVar2 = -0x50;
              }
              DAT_6000_c89c = 1;
              FUN_2000_9ed9();
              if (DAT_6000_4593 != -1) {
                DAT_6000_45c7 = 1;
              }
            }
            if (local_e == 3) {
              if ((uVar6 == 3) &&
                 (iVar2 = FUN_2000_4575(DAT_6000_c89e + 1,DAT_6000_c8a0), iVar2 != -1)) {
                iVar2 = 0x66;
              }
              else {
                iVar2 = -0x4d;
              }
              DAT_6000_c89c = 3;
              FUN_2000_9ed9();
              if (DAT_6000_4593 != -1) {
                DAT_6000_45c7 = 1;
              }
            }
            if ((DAT_6000_1427 != 0xffff) && (iVar2 == 0x66)) {
              iVar2 = -1;
              DAT_6000_1427 = 0xffff;
              FUN_4000_3435();
            }
            if ((local_e == 4) || (local_e == 5)) {
              iVar2 = 0x76;
            }
            if (local_e == 6) {
              iVar2 = 0x78;
            }
            if (local_e == 7) {
              iVar2 = 0x62;
            }
            if (local_e == 8) {
              iVar2 = 0x6d;
            }
            if (local_e == 9) {
              iVar2 = 0x77;
            }
            if (local_e == 10) {
              iVar2 = 0x76;
            }
            if (local_e == 0xb) {
              iVar2 = 0x7a;
            }
            if (local_e == 0xc) {
              iVar2 = 99;
            }
            if (local_e == 0xd) {
              iVar2 = 0x69;
            }
            if (local_e == 0xe) {
              iVar2 = 0x78;
            }
            if (local_e == 0xf) {
              iVar2 = 0x61;
            }
            if (local_e == 0x10) {
              iVar2 = 0x6c;
            }
            if (local_e == 0x11) {
              iVar2 = 0x66;
            }
            if (local_e == 0x12) {
              iVar2 = 0x70;
            }
            if (local_e == 0x13) {
              iVar2 = 0x20;
            }
            if (local_e == 0x14) {
              iVar2 = 0x65;
            }
            if (local_e == 0x15) {
              iVar2 = 0x6f;
            }
            if (local_e == 0x16) {
              FUN_4000_3435();
              FUN_2000_7421(0);
              FUN_4000_3a72();
            }
            if (local_e == 0x17) {
              FUN_4000_3435();
              FUN_2000_7421(1);
              FUN_4000_3a72();
            }
            if (local_e == 0x18) {
              iVar2 = 0x71;
            }
            if (local_e == 0x19) {
              iVar2 = -0x3b;
            }
            if (local_e == 0x1a) {
              if (local_16 == -1) {
                if ((local_14 < 0) || (local_18 != 0)) {
                  iVar2 = 0x75;
                }
                else {
                  iVar2 = 100;
                }
              }
              else {
                iVar2 = 0x6b;
              }
            }
          }
        }
      }
      else {
        sVar8 = getch();
        iVar2 = FUN_1000_1878(sVar8);
      }
      if (DAT_6000_c8a2 != local_8) {
        DAT_6000_1427 = 0xffff;
      }
      if ((iVar2 == -1) &&
         ((((DAT_6000_cd18 != 0 || (local_8 != DAT_6000_c8a2)) || (local_a != DAT_6000_c89e)) ||
          (local_c != DAT_6000_c8a0)))) {
        FUN_4000_3435();
        FUN_2000_8b3f(&local_1a,&local_1c,&local_20,&local_1e);
        local_a = DAT_6000_c89e;
        local_c = DAT_6000_c8a0;
        local_8 = DAT_6000_c8a2;
      }
    } while (iVar2 == -1);
    DAT_6000_1425 = 1;
    if (DAT_6000_d0da != 0) {
      FUN_4000_3435();
    }
    if (iVar2 == 0) {
      sVar8 = getch();
      iVar2 = -sVar8;
    }
    draw_map_square(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4,DAT_6000_c8a6,
                  DAT_6000_c8a7);
    local_4 = 0;
    local_6 = 0;
    if (iVar2 == 0x66) {
      if (DAT_6000_4593 != -1) {
        DAT_6000_1301 = strike();
        FUN_2000_7fb1((int)*(char *)(DAT_6000_c18d * 7 + 0x1c5));
        if (1 < 0x55 - DAT_6000_c90c) {
          FUN_2000_7fb1((0x55 - DAT_6000_c90c) / 5);
        }
      }
    }
    else if (iVar2 < 0x67) {
      if (iVar2 == 0x29) {
        DAT_6000_cdd9 = DAT_6000_cdd9 + '\x10';
        FUN_4000_10ee();
      }
      else if (iVar2 < 0x2a) {
        if (iVar2 == -0x3b) goto LAB_2000_b39b;
        if (iVar2 < -0x3a) {
          switch(iVar2) {
          case -0x50:
            DAT_6000_c89c = 1;
            local_6 = 1;
            break;
          case -0x4d:
            DAT_6000_c89c = 3;
            local_4 = 1;
            break;
          case -0x4b:
            DAT_6000_c89c = 2;
            local_4 = -1;
            break;
          case -0x48:
            DAT_6000_c89c = 0;
            local_6 = -1;
          }
        }
        else if (iVar2 == 0x1b) {
          uVar18 = 0;
          uVar16 = 0;
          uVar3 = 0x4af;
          lVar14 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
          lVar14 = F_LDIV(lVar14,CONCAT22(uVar16,uVar3));
          uVar3 = (undefined2)lVar14;
          uVar15 = 0;
          uVar16 = 0x63f;
          lVar14 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
          lVar14 = F_LDIV(lVar14,CONCAT22(uVar15,uVar16));
          fill_rect(0,0,(int)lVar14,uVar3,uVar18);
        }
        else {
          if (iVar2 == 0x20) goto LAB_2000_bd6c;
          if (iVar2 == 0x28) {
            DAT_6000_cdd8 = DAT_6000_cdd8 + '\x10';
            FUN_4000_10ee();
          }
        }
      }
      else if (iVar2 == 0x62) {
        DAT_6000_cd70 = 0;
        DAT_6000_cd6e = 0;
        DAT_6000_cd6c = 0;
        DAT_6000_cd6a = 0;
        DAT_6000_cd68 = 0;
        DAT_6000_cd66 = 0;
        DAT_6000_cd64 = 0;
        DAT_6000_cd62 = 0;
        DAT_6000_4390 = (DAT_6000_4390 + 1) % 3;
        DAT_6000_cd18 = 1;
      }
      else if (iVar2 < 99) {
        if (iVar2 == 0x32) {
          FUN_4000_3435();
          FUN_2000_7421(1);
          FUN_4000_3a72();
        }
        else if (iVar2 < 0x33) {
          if (iVar2 == 0x2a) {
            DAT_6000_cdd7 = DAT_6000_cdd7 + '\x10';
            FUN_4000_10ee();
          }
          else if (iVar2 == 0x31) {
            FUN_4000_3435();
            FUN_2000_7421(0);
            FUN_4000_3a72();
          }
        }
        else if (iVar2 == 0x61) {
          FUN_2000_1c86();
          for (iVar2 = 0; iVar2 < 8; iVar2 = iVar2 + 1) {
            if ((char)((undefined1 *)&DAT_6000_c1a2)[iVar2] < '\x01') {
              strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar2],(char *)s__________6000_2ba3);
            }
            else {
              strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar2],
                     (char *)*(undefined2 *)(iVar2 * 5 + 0x214));
              if (((undefined1 *)&DAT_6000_c1aa)[iVar2] != '\0') {
                strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar2],
                       (char *)s_WEAPONS__PLUS_6000_2a41 + 7);
                pcVar9 = itoa((int)(char)((undefined1 *)&DAT_6000_c1aa)[iVar2],DAT_6000_cb52,10);
                strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar2],pcVar9);
              }
            }
          }
          uVar18 = 0;
          uVar16 = 0;
          uVar3 = 0x4af;
          lVar14 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
          lVar14 = F_LDIV(lVar14,CONCAT22(uVar16,uVar3));
          uVar3 = (undefined2)lVar14;
          uVar15 = 0;
          uVar16 = 0x63f;
          lVar14 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
          lVar14 = F_LDIV(lVar14,CONCAT22(uVar15,uVar16));
          fill_rect(0,0,(int)lVar14,uVar3,uVar18);
          print_text(0,0,0,(char *)s_PLEASE_SELECT_YOUR_ARMOR__6000_32fd,DAT_6000_1303);
          iVar2 = FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,1,8);
          local_e = iVar2 - 1;
          if ('\0' < *(char *)(iVar2 + -0x3e5f)) {
            if ((((int)local_e < 1) || ((DAT_6000_c11c != '\x01' && (DAT_6000_c11c != '\x03')))) &&
               (((int)local_e < 2 || ((DAT_6000_c11c != '\x02' && (DAT_6000_c11c != '\x05')))))) {
              DAT_6000_c1b2 = (char)local_e;
            }
            else {
              FUN_2000_22ff((char *)s_CHARACTERS_OF_YOUR_PROFESSION_6000_3317,
                            (char *)s_CAN_NOT_WEAR_ARMOR_OF_THIS_TYPE_6000_3335,
                            (char *)s_YOU_CONTINUE_TO_WEAR_YOUR_OLD_6000_3357,
                            (char *)s_ARMOR__6000_3377,
                            (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                            (char *)s_HIT_ANY_KEY____6000_20bd,
                            (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                            (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
            }
          }
        }
      }
      else if (iVar2 == 99) {
        iVar2 = 0;
        DAT_6000_cd70 = 0;
        DAT_6000_cd6e = 0;
        DAT_6000_cd6c = 0;
        DAT_6000_cd6a = 0;
        DAT_6000_cd68 = 0;
        DAT_6000_cd66 = 0;
        DAT_6000_cd64 = 0;
        DAT_6000_cd62 = 0;
        uVar10 = FUN_2000_ea27(1);
        if (uVar10 != 0 || iVar2 != 0) {
          if ((iVar2 < 1) && ((iVar2 < 0 || (uVar10 < 0x3c)))) {
            FUN_2000_7fb1(uVar10);
          }
          else if ((iVar2 < 1) && ((iVar2 < 0 || (uVar10 < 30000)))) {
            iVar13 = 0;
            while( true ) {
              iVar12 = iVar13 >> 0xf;
              iVar17 = iVar13;
              lVar14 = F_LDIV(CONCAT22(iVar2,uVar10),0x3c);
              if (lVar14 <= CONCAT22(iVar12,iVar17)) break;
              FUN_2000_7fb1(0x3c);
              iVar13 = iVar13 + 1;
            }
          }
          FUN_2000_81cd();
          DAT_6000_cd18 = 1;
        }
      }
      else if (iVar2 == 100) {
        if (local_14 < 1) {
          iVar2 = dig_hole();
          if (iVar2 == 1) {
            local_18 = 0;
          }
        }
        else {
          DAT_6000_4593 = -1;
          DAT_6000_c8a2 = DAT_6000_c8a2 + local_14;
          enter_level(DAT_6000_c8a2);
          FUN_2000_248e(DAT_6000_c8a2);
          DAT_6000_123d = '\x01';
        }
      }
      else if (iVar2 == 0x65) {
        experience_for_level();
      }
    }
    else {
      switch(iVar2) {
      case 0x68:
LAB_2000_b39b:
        FUN_2000_919a();
        DAT_6000_cd70 = 0;
        DAT_6000_cd6e = 0;
        DAT_6000_cd6c = 0;
        DAT_6000_cd6a = 0;
        DAT_6000_cd68 = 0;
        DAT_6000_cd66 = 0;
        DAT_6000_cd64 = 0;
        DAT_6000_cd62 = 0;
        break;
      case 0x69:
        uVar18 = 0;
        uVar16 = 0;
        uVar3 = 0x4af;
        lVar14 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
        lVar14 = F_LDIV(lVar14,CONCAT22(uVar16,uVar3));
        uVar3 = (undefined2)lVar14;
        uVar15 = 0;
        uVar16 = 0x63f;
        lVar14 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
        lVar14 = F_LDIV(lVar14,CONCAT22(uVar15,uVar16));
        iVar13 = (int)((ulong)lVar14 >> 0x10);
        fill_rect(0,0,(int)lVar14,uVar3,uVar18);
        print_text(0,0,0,(char *)s_USE_MAGIC_MENU__6000_34ab,DAT_6000_1303);
        FUN_2000_216b((char *)s_WHICH_TYPE_OF_ITEM__6000_34bb,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_1__SCROLL_6000_34cf,(char *)s_2__WAND_6000_34d9,
                      (char *)s_3__PAPER_6000_34e1,(char *)s_4__MAGIC_VITAMIN_PILL_6000_34ea,
                      (char *)s_5__OTHER_6000_3500,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        iVar2 = FUN_2000_1fbd(2,6);
        local_e = iVar2 - 0x30;
        if (((local_e == 1) || (local_e == 2)) || (local_e == 3)) {
          uVar10 = FUN_2000_ea27(iVar2 + -0x2f);
          if ((iVar13 < 1) && ((iVar13 < 0 || (uVar10 < 0x3c)))) {
            FUN_2000_7fb1(uVar10);
          }
          else if ((iVar13 < 1) && ((iVar13 < 0 || (uVar10 < 30000)))) {
            iVar2 = 0;
            while( true ) {
              iVar12 = iVar2 >> 0xf;
              iVar17 = iVar2;
              lVar14 = F_LDIV(CONCAT22(iVar13,uVar10),0x3c);
              if (lVar14 <= CONCAT22(iVar12,iVar17)) break;
              FUN_2000_7fb1(0x3c);
              iVar2 = iVar2 + 1;
            }
          }
        }
        if (local_e == 4) {
          FUN_3000_9ac0();
        }
        if (local_e == 5) {
          FUN_3000_e221();
        }
        break;
      case 0x6b:
        if (local_16 < 1) {
          FUN_2000_22ff((char *)s_I_DON_T_SEE_ANY_TRAP_6000_32b7,
                        (char *)s_DOOR_HERE__KEEP_SEARCHING_6000_32cc,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY____6000_32e8,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        }
        else {
          DAT_6000_4593 = -1;
          DAT_6000_c8a2 = FUN_2000_a6fa(&local_e,&local_10,local_16);
          DAT_6000_c89e = local_e;
          DAT_6000_c8a0 = local_10;
          enter_level(DAT_6000_c8a2);
          FUN_2000_248e(DAT_6000_c8a2);
          DAT_6000_123d = '\x01';
        }
        break;
      case 0x6c:
        FUN_2000_7756();
        break;
      case 0x6d:
        financial_statement();
        break;
      case 0x6f:
        DAT_6000_119f = (DAT_6000_119f + 1) % 2;
        FUN_4000_3a72();
        break;
      case 0x70:
        DAT_6000_cd70 = 0;
        DAT_6000_cd6e = 0;
        DAT_6000_cd6c = 0;
        DAT_6000_cd6a = 0;
        DAT_6000_cd68 = 0;
        DAT_6000_cd66 = 0;
        DAT_6000_cd64 = 0;
        DAT_6000_cd62 = 0;
        FUN_3000_a047();
        break;
      case 0x71:
        FUN_2000_7b86();
        break;
      case 0x73:
        save_player((int)DAT_6000_125c);
        break;
      case 0x74:
LAB_2000_bd6c:
        FUN_2000_a57e();
        DAT_6000_cd18 = 1;
        FUN_2000_a64b();
        break;
      case 0x75:
        uVar18 = 0;
        uVar16 = 0;
        uVar3 = 0x4af;
        lVar14 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
        lVar14 = F_LDIV(lVar14,CONCAT22(uVar16,uVar3));
        uVar3 = (undefined2)lVar14;
        uVar15 = 0;
        uVar16 = 0x63f;
        lVar14 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
        lVar14 = F_LDIV(lVar14,CONCAT22(uVar15,uVar16));
        fill_rect(0,0,(int)lVar14,uVar3,uVar18);
        if (local_14 < 0) {
          DAT_6000_4593 = -1;
          DAT_6000_c8a2 = DAT_6000_c8a2 + local_14;
          enter_level(DAT_6000_c8a2);
          FUN_2000_248e(DAT_6000_c8a2);
          DAT_6000_123d = '\x01';
        }
        else if (local_18 != 0) {
          if (local_18 == 1) {
            store();
          }
          if (local_18 == 2) {
            FUN_2000_3085();
          }
          if (local_18 == 3) {
            bank();
          }
          if (local_18 == 4) {
            inn();
          }
          if (local_18 == 5) {
            FUN_2000_7b4f();
          }
        }
        flush_keys();
        break;
      case 0x76:
        view_stats();
        DAT_6000_cd70 = 0;
        DAT_6000_cd6e = 0;
        DAT_6000_cd6c = 0;
        DAT_6000_cd6a = 0;
        DAT_6000_cd68 = 0;
        DAT_6000_cd66 = 0;
        DAT_6000_cd64 = 0;
        DAT_6000_cd62 = 0;
        break;
      case 0x77:
        FUN_2000_1c86();
        for (iVar2 = 0; iVar2 < 8; iVar2 = iVar2 + 1) {
          if ((char)((undefined1 *)&DAT_6000_c173)[iVar2] < '\x01') {
            strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar2],(char *)s__________6000_2ba3);
          }
          else {
            strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar2],
                   (char *)*(undefined2 *)(iVar2 * 7 + 0x1c0));
            if (((undefined1 *)&DAT_6000_c180)[iVar2] != '\0') {
              strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar2],
                     (char *)s_WEAPONS__PLUS_6000_2a41 + 7);
              pcVar9 = itoa((int)(char)((undefined1 *)&DAT_6000_c180)[iVar2],DAT_6000_cb52,10);
              strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar2],pcVar9);
            }
          }
        }
        uVar18 = 0;
        uVar16 = 0;
        uVar3 = 0x4af;
        lVar14 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
        lVar14 = F_LDIV(lVar14,CONCAT22(uVar16,uVar3));
        uVar3 = (undefined2)lVar14;
        uVar15 = 0;
        uVar16 = 0x63f;
        lVar14 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
        lVar14 = F_LDIV(lVar14,CONCAT22(uVar15,uVar16));
        fill_rect(0,0,(int)lVar14,uVar3,uVar18);
        print_text(0,0,0,(char *)s_PLEASE_SELECT_YOUR_WEAPON__6000_3380,DAT_6000_1303);
        iVar2 = FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,1,8);
        local_e = iVar2 - 1;
        if ('\0' < *(char *)(iVar2 + -0x3e8e)) {
          if (((((int)local_e < 1) || ((DAT_6000_c11c != '\x01' && (DAT_6000_c11c != '\x02')))) &&
              (((int)local_e < 2 ||
               ((local_e == 4 || ((DAT_6000_c11c != '\x03' && (DAT_6000_c11c != '\x05')))))))) &&
             ((local_e != 7 || (DAT_6000_c11c == '\0')))) {
            DAT_6000_c18d = (char)local_e;
          }
          else {
            FUN_2000_22ff((char *)s_CHARACTERS_OF_YOUR_CLASS_6000_339b,
                          (char *)s_CAN_NOT_USE_THAT_WEAPON__6000_33b4,
                          (char *)s_YOU_SHOULD__THEREFORE_6000_33cf,
                          (char *)s_DROP_THE_WEAPON_TO_SAVE_6000_33e7,(char *)s_WEIGHT__6000_3401,
                          (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                          (char *)s_HIT_ANY_KEY____6000_20bd,
                          (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          }
        }
        flush_keys();
        break;
      case 0x78:
        DAT_6000_cd70 = 0;
        DAT_6000_cd6e = 0;
        DAT_6000_cd6c = 0;
        DAT_6000_cd6a = 0;
        DAT_6000_cd68 = 0;
        DAT_6000_cd66 = 0;
        DAT_6000_cd64 = 0;
        DAT_6000_cd62 = 0;
        DAT_6000_130d = 900;
        DAT_6000_cd18 = 1;
        DAT_6000_1248 = 0xffff;
        DAT_6000_1246 = 0xffff;
        DAT_6000_1244 = 0xffff;
        DAT_6000_1242 = 0xffff;
        DAT_6000_1240 = 0xffff;
        DAT_6000_123e = 0xffff;
        clear_screen();
        FUN_2000_3ae1(0);
        if ((DAT_6000_cd98 < 0) || ((DAT_6000_cd98 < 1 && (DAT_6000_cd96 < 0x141)))) {
          FUN_3000_b066(0x28,0x12,DAT_6000_c8a2,DAT_6000_c8a4);
          print_text(0,0x46a,1,(char *)s_DUNGEON_MAP__TOP_THIRD__HIT_ANY_K_6000_3430,0xb);
          FUN_2000_a8d7();
          if (DAT_6000_c8a0 < 0x25) {
            while (iVar13 = FUN_4000_3498(), iVar2 = local_12, iVar13 == 0) {
              local_12 = local_12 + 1;
              FUN_2000_7d00(iVar2,DAT_6000_c89e,DAT_6000_c8a0);
            }
          }
          else {
            wait_key();
          }
          flush_keys();
          clear_screen();
          FUN_3000_b066(0x28,0x37,DAT_6000_c8a2,DAT_6000_c8a4);
          print_text(0,0x46a,1,(char *)s_DUNGEON_MAP__MIDDLE_THIRD__HIT_A_6000_3457,0xb);
          FUN_2000_a8d7();
          if ((DAT_6000_c8a0 < 0x25) || (0x49 < DAT_6000_c8a0)) {
            wait_key();
          }
          else {
            while (iVar13 = FUN_4000_3498(), iVar2 = local_12, iVar13 == 0) {
              local_12 = local_12 + 1;
              FUN_2000_7d00(iVar2,DAT_6000_c89e,DAT_6000_c8a0 + -0x25);
            }
          }
          flush_keys();
          clear_screen();
          FUN_3000_b066(0x28,0x5c,DAT_6000_c8a2,DAT_6000_c8a4);
          print_text(0,0x46a,1,(char *)s_DUNGEON_MAP__BOTTOM_THIRD__HIT_A_6000_3481,0xb);
          FUN_2000_a8d7();
          if (DAT_6000_c8a0 < 0x4a) {
            wait_key();
          }
          else {
            while (iVar13 = FUN_4000_3498(), iVar2 = local_12, iVar13 == 0) {
              local_12 = local_12 + 1;
              FUN_2000_7d00(iVar2,DAT_6000_c89e,DAT_6000_c8a0 + -0x4a);
            }
          }
        }
        else {
          FUN_3000_b066(0x28,0x37,DAT_6000_c8a2,DAT_6000_c8a4);
          print_text(0,0x47e,0,(char *)s_EXPANDED_DUNGEON_MAP__HIT_ANY_KE_6000_340b,0xf);
          FUN_2000_a8d7();
          while (iVar13 = FUN_4000_3498(), iVar2 = local_12, iVar13 == 0) {
            local_12 = local_12 + 1;
            FUN_2000_7d00(iVar2,DAT_6000_c89e,DAT_6000_c8a0);
          }
          flush_keys();
        }
        FUN_2000_3ae1(1);
        clear_screen();
        DAT_6000_125a = 0xffff;
        DAT_6000_1258 = 0xffff;
        DAT_6000_1256 = 0xffff;
        DAT_6000_1254 = 0xffff;
        DAT_6000_124c = 0xbff0000000000000;
        lVar14 = ftol((double)CONCAT26(in_stack_0000ffd0,
                                       CONCAT24(in_stack_0000ffce,CONCAT22(unaff_SI,unaff_DI))));
        DAT_6000_124a = (undefined2)lVar14;
        DAT_6000_123d = '\x01';
        flush_keys();
        break;
      case 0x7a:
        FUN_2000_9968();
        DAT_6000_cd70 = 0;
        DAT_6000_cd6e = 0;
        DAT_6000_cd6c = 0;
        DAT_6000_cd6a = 0;
        DAT_6000_cd68 = 0;
        DAT_6000_cd66 = 0;
        DAT_6000_cd64 = 0;
        DAT_6000_cd62 = 0;
        break;
      case 0x7c:
        DAT_6000_c123 = DAT_6000_c123 + 10;
      }
    }
    if ((local_4 != 0) || (local_6 != 0)) {
      if (DAT_6000_11e5 == 1) {
        DAT_6000_11e5 = 0;
      }
      else {
        FUN_3000_9383();
      }
    }
    if ((uVar7 == 3) && (iVar2 = FUN_2000_4575(DAT_6000_c89e - 1,DAT_6000_c8a0), iVar2 != -1)) {
      FUN_2000_8728(DAT_6000_c89e - 1,DAT_6000_c8a0,iVar2);
    }
    if ((uVar6 == 3) && (iVar2 = FUN_2000_4575(DAT_6000_c89e + 1,DAT_6000_c8a0), iVar2 != -1)) {
      FUN_2000_8728(DAT_6000_c89e + 1,DAT_6000_c8a0,iVar2);
    }
    if ((uVar4 == 3) && (iVar2 = FUN_2000_4575(DAT_6000_c89e,DAT_6000_c8a0 + -1), iVar2 != -1)) {
      FUN_2000_8728(DAT_6000_c89e,DAT_6000_c8a0 + -1,iVar2);
    }
    if ((uVar5 == 3) && (iVar2 = FUN_2000_4575(DAT_6000_c89e,DAT_6000_c8a0 + 1), iVar2 != -1)) {
      FUN_2000_8728(DAT_6000_c89e,DAT_6000_c8a0 + 1,iVar2);
    }
    if ((DAT_6000_4593 != -1) && (*_DAT_6000_cd28 < 1)) {
      FUN_3000_d51c();
    }
    if ((DAT_6000_c123 < 0) && (FUN_2000_726f(), DAT_6000_c123 < 0)) {
      return 0xff;
    }
    local_e = 0xffff;
    if (local_6 < 0) {
      local_e = uVar4;
    }
    if (0 < local_6) {
      local_e = uVar5;
    }
    if (0 < local_4) {
      local_e = uVar6;
    }
    if (local_4 < 0) {
      local_e = uVar7;
    }
    if (local_e == 0) {
      DAT_6000_1427 = 0xffff;
      uVar18 = 0;
      uVar16 = 0;
      uVar3 = 0x4af;
      lVar14 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar14 = F_LDIV(lVar14,CONCAT22(uVar16,uVar3));
      uVar3 = (undefined2)lVar14;
      uVar15 = 0;
      uVar16 = 0x63f;
      lVar14 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar14 = F_LDIV(lVar14,CONCAT22(uVar15,uVar16));
      fill_rect(0,0,(int)lVar14,uVar3,uVar18);
      print_text(0,0,0,(char *)s_THE_WALL_REFUSES_TO_MOVE_6000_3509,DAT_6000_1303);
    }
    else {
      iVar2 = FUN_2000_4575(DAT_6000_c89e + local_4,DAT_6000_c8a0 + local_6);
      if (iVar2 == -1) {
        if ((DAT_6000_4593 != -1) && (local_6 != local_4)) {
          iVar2 = random_n(3);
          if (iVar2 == 0) {
            if (DAT_6000_c8c7 != '\0') {
              in_stack_0000ffd0 = DAT_6000_c8a2 + DAT_6000_c8a2 / 2;
              uVar16 = 0;
              uVar3 = 0x8000;
              sVar8 = rand();
              lVar14 = N_LXMUL((long)in_stack_0000ffd0,(long)sVar8);
              lVar14 = F_LDIV(lVar14,CONCAT22(uVar16,uVar3));
              if (DAT_6000_c89a < (int)lVar14) goto LAB_2000_c0f8;
            }
          }
          else {
LAB_2000_c0f8:
            in_stack_0000ffce = DAT_6000_c90c + 0x14;
            uVar16 = 0;
            uVar3 = 0x8000;
            sVar8 = rand();
            lVar14 = N_LXMUL((long)in_stack_0000ffce,(long)sVar8);
            lVar14 = F_LDIV(lVar14,CONCAT22(uVar16,uVar3));
            ((undefined2 *)&DAT_6000_cbf0)[DAT_6000_4593] = (int)lVar14;
          }
        }
        if (((local_6 < 0) && (local_e != 0)) && (0 < DAT_6000_c8a0)) {
          FUN_2000_a57e();
          DAT_6000_c8a0 = DAT_6000_c8a0 + -1;
          DAT_6000_c8a7 = DAT_6000_c8a7 + -1;
          FUN_2000_a64b();
          if (DAT_6000_c8a7 < '\x01') {
            DAT_6000_123d = '\x01';
          }
        }
        if (((0 < local_6) && (local_e != 0)) && (DAT_6000_c8a0 < DAT_6000_448d)) {
          FUN_2000_a57e();
          DAT_6000_c8a0 = DAT_6000_c8a0 + 1;
          DAT_6000_c8a7 = DAT_6000_c8a7 + '\x01';
          FUN_2000_a64b();
          if (DAT_6000_448a + -2 < (int)DAT_6000_c8a7) {
            DAT_6000_123d = '\x01';
          }
        }
        if (((0 < local_4) && (local_e != 0)) && ((int)DAT_6000_c89e < DAT_6000_448b)) {
          FUN_2000_a57e();
          DAT_6000_c89e = DAT_6000_c89e + 1;
          DAT_6000_c8a6 = DAT_6000_c8a6 + '\x01';
          FUN_2000_a64b();
          if (DAT_6000_4489 + -2 < (int)DAT_6000_c8a6) {
            DAT_6000_123d = '\x01';
          }
        }
        if (((local_4 < 0) && (local_e != 0)) && (0 < (int)DAT_6000_c89e)) {
          FUN_2000_a57e();
          DAT_6000_c89e = DAT_6000_c89e - 1;
          DAT_6000_c8a6 = DAT_6000_c8a6 + -1;
          FUN_2000_a64b();
          if (DAT_6000_c8a6 < '\x01') {
            DAT_6000_123d = '\x01';
          }
        }
        if (DAT_6000_c125 < DAT_6000_c123) {
          DAT_6000_c123 = DAT_6000_c125;
        }
      }
      else {
        DAT_6000_1427 = 0xffff;
        local_6 = 0;
        local_4 = 0;
        if ((local_e == 1) || (local_e == 2)) {
          uVar18 = 0;
          uVar16 = 0;
          uVar3 = 0x4af;
          lVar14 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
          lVar14 = F_LDIV(lVar14,CONCAT22(uVar16,uVar3));
          uVar3 = (undefined2)lVar14;
          uVar15 = 0;
          uVar16 = 0x63f;
          lVar14 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
          lVar14 = F_LDIV(lVar14,CONCAT22(uVar15,uVar16));
          fill_rect(0,0,(int)lVar14,uVar3,uVar18);
        }
        if (local_e == 1) {
          print_text(0,0,0,(char *)s_THE_DOOR_IS_JAMMED_6000_3522,DAT_6000_1303);
          FUN_1000_22a2(0x15e);
        }
        if (local_e == 2) {
          print_text(0,0,0,(char *)s_THE_SECRET_DOOR_IS_JAMMED_6000_3535,DAT_6000_1303);
          FUN_1000_22a2(0x15e);
        }
      }
    }
    if (DAT_6000_123d != '\0') {
      DAT_6000_c8a7 = DAT_6000_448a >> 1;
      DAT_6000_c8a6 = DAT_6000_4489 >> 1;
      FUN_3000_b066(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
      DAT_6000_123d = '\0';
    }
  } while( true );
}


// ==== FUN_2000_c28a @ 2000:c28a (size 44) callers: FUN_2000_c9d2,FUN_2000_caba,FUN_2000_cccc,FUN_2000_cdc5,FUN_2000_d0de,FUN_2000_d358

void __cdecl16far FUN_2000_c28a(void)

{
  FUN_2000_22ff((char *)s_YOU_ARE_NOT_CURRENTLY_6000_354f,(char *)s_ENGAGING_ANY_MONSTER__6000_3565,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY____6000_20bd,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return;
}


// ==== FUN_2000_c2b6 @ 2000:c2b6 (size 44) callers: FUN_2000_c49c,FUN_2000_c4be,FUN_2000_c4e0,FUN_2000_c502,FUN_2000_c524,FUN_2000_caba,FUN_2000_cf08,FUN_2000_cf6c,FUN_2000_d358

void __cdecl16far FUN_2000_c2b6(void)

{
  FUN_2000_22ff((char *)s_CASTING_THIS_SPELL_WOULD_6000_357e,(char *)s_BE_REDUNDANT__6000_3597,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY____6000_20bd,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return;
}


// ==== FUN_2000_c2e2 @ 2000:c2e2 (size 44) callers: FUN_2000_cb43,FUN_2000_cb6d,FUN_2000_cb97,FUN_2000_d358

void __cdecl16far FUN_2000_c2e2(void)

{
  FUN_2000_22ff((char *)s_YOU_HAVE_ALREADY_CAST_6000_35a8,(char *)s_THIS_SPELL__6000_35be,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY____6000_20bd,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return;
}


// ==== FUN_2000_c30e @ 2000:c30e (size 195) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_c30e(undefined1 param_1)

{
  char *src;
  int iVar1;
  
  FUN_2000_1c86();
  for (iVar1 = 0; iVar1 < 8; iVar1 = iVar1 + 1) {
    if ((char)((undefined1 *)&DAT_6000_c173)[iVar1] < '\x01') {
      strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar1],(char *)s__________6000_2ba3);
    }
    else {
      strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar1],
             (char *)*(undefined2 *)(iVar1 * 7 + 0x1c0));
      if (((undefined1 *)&DAT_6000_c180)[iVar1] != '\0') {
        strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar1],(char *)s_WEAPONS__PLUS_6000_2a41 + 7);
        src = itoa((int)(char)((undefined1 *)&DAT_6000_c180)[iVar1],DAT_6000_cb52,10);
        strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar1],src);
      }
    }
  }
  iVar1 = FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,1,8);
  if (*(char *)(iVar1 + -0x3e8e) != '\0') {
    *(undefined1 *)(iVar1 + -0x3e81) = param_1;
    return 1;
  }
  return 0;
}


// ==== FUN_2000_c3d5 @ 2000:c3d5 (size 195) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_c3d5(undefined1 param_1)

{
  char *src;
  int iVar1;
  
  FUN_2000_1c86();
  for (iVar1 = 0; iVar1 < 8; iVar1 = iVar1 + 1) {
    if ((char)((undefined1 *)&DAT_6000_c1a2)[iVar1] < '\x01') {
      strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar1],(char *)s__________6000_2ba3);
    }
    else {
      strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar1],
             (char *)*(undefined2 *)(iVar1 * 5 + 0x214));
      if (((undefined1 *)&DAT_6000_c1aa)[iVar1] != '\0') {
        strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar1],(char *)s_WEAPONS__PLUS_6000_2a41 + 7);
        src = itoa((int)(char)((undefined1 *)&DAT_6000_c1aa)[iVar1],DAT_6000_cb52,10);
        strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar1],src);
      }
    }
  }
  iVar1 = FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,1,8);
  if (*(char *)(iVar1 + -0x3e5f) != '\0') {
    *(undefined1 *)(iVar1 + -0x3e57) = param_1;
    return 1;
  }
  return 0;
}


// ==== FUN_2000_c49c @ 2000:c49c (size 32) callers: FUN_2000_d358

int __cdecl16far FUN_2000_c49c(int param_1)

{
  if (param_1 <= (int)(uint)DAT_6000_c8c1) {
    FUN_2000_c2b6();
    return 0;
  }
  DAT_6000_c8c1 = (undefined1)param_1;
  return param_1;
}


// ==== FUN_2000_c4be @ 2000:c4be (size 32) callers: FUN_2000_d358

int __cdecl16far FUN_2000_c4be(int param_1)

{
  if (param_1 <= (int)(uint)DAT_6000_c8c0) {
    FUN_2000_c2b6();
    return 0;
  }
  DAT_6000_c8c0 = (undefined1)param_1;
  return param_1;
}


// ==== FUN_2000_c4e0 @ 2000:c4e0 (size 32) callers: FUN_2000_d358

int __cdecl16far FUN_2000_c4e0(int param_1)

{
  if (param_1 <= (int)(uint)DAT_6000_c8c2) {
    FUN_2000_c2b6();
    return 0;
  }
  DAT_6000_c8c2 = (undefined1)param_1;
  return param_1;
}


// ==== FUN_2000_c502 @ 2000:c502 (size 32) callers: FUN_2000_d358

int __cdecl16far FUN_2000_c502(int param_1)

{
  if (param_1 <= (int)(uint)DAT_6000_c8c3) {
    FUN_2000_c2b6();
    return 0;
  }
  DAT_6000_c8c3 = (undefined1)param_1;
  return param_1;
}


// ==== FUN_2000_c524 @ 2000:c524 (size 32) callers: FUN_2000_d358

int __cdecl16far FUN_2000_c524(int param_1)

{
  if (param_1 <= (int)(uint)DAT_6000_c8c4) {
    FUN_2000_c2b6();
    return 0;
  }
  DAT_6000_c8c4 = (undefined1)param_1;
  return param_1;
}


// ==== cast_spell @ 2000:c546 (size 1070) callers: FUN_2000_d358  // the spell menu

undefined2 __cdecl16far cast_spell(int param_1,int param_2)

{
  char *pcVar1;
  bool bVar2;
  bool bVar3;
  short sVar4;
  int iVar5;
  int iVar6;
  int iVar7;
  short radix;
  
  bVar3 = false;
  bVar2 = false;
  do {
    for (iVar5 = 0; iVar5 < 8; iVar5 = iVar5 + 1) {
      strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar5],
             (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
    }
    strcpy(DAT_6000_cd80,(char *)0xd99b);
    strcpy(DAT_6000_cd82,(char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
    strcpy(DAT_6000_cd84,(char *)s_1__PREPARATION_SPELLS_6000_35ec);
    if ((((DAT_6000_c11c == '\x02') || (DAT_6000_c11c == '\x03')) || (DAT_6000_c11c == '\x05')) ||
       (DAT_6000_c11c == '\x06')) {
      bVar2 = true;
    }
    if (bVar2) {
      strcpy(DAT_6000_cd86,(char *)s_2__WIZARD_SPELLS_6000_3602);
    }
    else {
      strcpy(DAT_6000_cd86,(char *)s_2________________6000_3613);
      if (DAT_6000_d0da != 0) {
        DAT_6000_d0f1 = 0xff;
      }
    }
    if (((DAT_6000_c11c == '\x01') || (DAT_6000_c11c == '\x02')) ||
       ((DAT_6000_c11c == '\x04' || (DAT_6000_c11c == '\x05')))) {
      bVar3 = true;
    }
    if (bVar3) {
      strcpy(DAT_6000_cd88,(char *)s_3__PRIESTLY_SPELLS_6000_3624);
    }
    else {
      strcpy(DAT_6000_cd88,(char *)s_3________________6000_3637);
      if (DAT_6000_d0da != 0) {
        DAT_6000_d0f2 = 0xff;
      }
    }
    FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
    iVar5 = FUN_2000_1fbd(2,4);
    if (DAT_6000_d0da != 0) {
      FUN_4000_2e13();
    }
    if (iVar5 == 0x1b) {
      return 0;
    }
    iVar5 = iVar5 + -0x30;
    if ((iVar5 < 1) || (3 < iVar5)) {
      return 0;
    }
    while( true ) {
      for (iVar6 = 0; iVar6 < 8; iVar6 = iVar6 + 1) {
        strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar6],
               (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
      }
      strcpy(DAT_6000_cd80,(char *)s_PLEASE_SELECT_A_THE_LEVEL_6000_3648);
      strcpy(DAT_6000_cd82,(char *)s_SPELL_YOU_WISH_ENCHANT__6000_3662);
      strcpy(DAT_6000_cd84,(char *)s_MAXIMUM_LEVEL__6000_367d);
      radix = 10;
      sVar4 = strlen(DAT_6000_cd84);
      itoa(param_1,DAT_6000_cd84 + sVar4,radix);
      if (9 < param_1) {
        strcpy(DAT_6000_cd88,(char *)s_HIT_0_FOR_10_TH_LEVEL_6000_368d);
      }
      strcpy(DAT_6000_cd8c,(char *)s_HIT_ESC_FOR_PREVIOUS_MENU_6000_36a3);
      if (DAT_6000_d0da != 0) {
        strcpy(DAT_6000_cd8e,(char *)s__TYPE_NUMBER_ON_KEYBOARD__6000_36bd);
      }
      FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
      do {
        sVar4 = getch();
        if (sVar4 == 0x1b) {
          sVar4 = -1;
        }
      } while (((sVar4 != -1) && ((sVar4 != 0x30 || (param_1 < 10)))) &&
              ((sVar4 < 0x31 || (param_1 + 0x30 < sVar4))));
      if (sVar4 == -1) break;
      iVar6 = sVar4 + -0x30;
      if (iVar6 == 0) {
        iVar6 = 10;
      }
      iVar6 = iVar6 + -1;
      while( true ) {
        strcpy(DAT_6000_cd80,(char *)0x1ba5);
        strcpy(DAT_6000_cd82,(char *)0x1ba9);
        strcpy(DAT_6000_cd84,(char *)0x1bad);
        strcpy(DAT_6000_cd8a,(char *)s_SELECT_ONE_OF_THE_ABOVE_6000_36d7);
        strcat(DAT_6000_cd80,(char *)*(undefined2 *)((iVar5 % 4) * 0x3c + iVar6 * 6 + 0x4493));
        strcat(DAT_6000_cd82,(char *)*(undefined2 *)((iVar5 % 4) * 0x3c + iVar6 * 6 + 0x4495));
        strcat(DAT_6000_cd84,(char *)*(undefined2 *)((iVar5 % 4) * 0x3c + iVar6 * 6 + 0x4497));
        strcpy(DAT_6000_cd86,(char *)s_4__PREVIOUS_MENU_6000_36ef);
        for (iVar7 = 5; iVar7 < 8; iVar7 = iVar7 + 1) {
          strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar7],
                 (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        }
        iVar7 = FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,1,4);
        if ((iVar7 == -1) || (iVar7 == 4)) break;
        iVar7 = iVar7 + -1;
        if (param_2 == 1) {
          pcVar1 = (char *)(iVar5 * 0x2d + iVar6 * 3 + iVar7 + -0x3ce3);
          *pcVar1 = *pcVar1 + '\x01';
          FUN_2000_22ff((char *)s_THE_SCROLL_HAS_BEEN_6000_3700,
                        (char *)s_SUCCESSFULLY_WRITTEN__6000_3714,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY_6000_28ff,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          return 1;
        }
        if (param_2 == 2) {
          *(char *)(iVar5 * 0x2d + iVar6 * 3 + iVar7 + -0x3c2f) =
               *(char *)(iVar5 * 0x2d + iVar6 * 3 + iVar7 + -0x3c2f) + '\x05';
          FUN_2000_22ff((char *)s_YOU_NOW_HOLD_A_GLOWING__6000_372d,
                        (char *)s_CHARGED_WAND_IN_HAND__6000_3745,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY_6000_28ff,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          return 1;
        }
      }
    }
  } while( true );
}


// ==== FUN_2000_c97a @ 2000:c97a (size 44) callers: FUN_2000_d358

void __cdecl16far FUN_2000_c97a(void)

{
  FUN_2000_22ff((char *)s_YOU_FEEL_GOOD___HIT_ANY_KEY_6000_375e,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return;
}


// ==== FUN_2000_c9a6 @ 2000:c9a6 (size 44) callers: FUN_2000_cb43,FUN_2000_cb6d,FUN_2000_cb97,FUN_2000_d358

void __cdecl16far FUN_2000_c9a6(void)

{
  FUN_2000_22ff((char *)s_YOU_FEEL_VERY_GOOD__6000_377a,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY____6000_20bd,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return;
}


// ==== FUN_2000_c9d2 @ 2000:c9d2 (size 225) callers: FUN_2000_d358

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

undefined2 __cdecl16far FUN_2000_c9d2(int param_1)

{
  short sVar1;
  char *unaff_DI;
  short radix;
  
  if (DAT_6000_4593 == -1) {
    FUN_2000_c28a();
    return 0;
  }
  if (param_1 == 0) {
    unaff_DI = (char *)s_A_SMALL_EXPLOSION_OCCURS_6000_378e;
  }
  if (param_1 == 1) {
    unaff_DI = (char *)s_A_LARGE_EXPLOSION_OCCURS_6000_37a7;
  }
  if (param_1 == 2) {
    unaff_DI = (char *)s_A_HUGE_EXPLOSION_OCCURS_6000_37c0;
  }
  if (DAT_6000_4593 == -1) {
    FUN_2000_c28a();
    return 0;
  }
  if (param_1 == 0) {
    param_1 = random_n(0x65);
    param_1 = param_1 + 0x4b;
  }
  if (param_1 == 1) {
    param_1 = random_n(0x65);
    param_1 = param_1 + 0x7d;
  }
  if (param_1 == 2) {
    param_1 = random_n(0x12d);
    param_1 = param_1 + 200;
  }
  *_DAT_6000_cd28 = *_DAT_6000_cd28 - param_1;
  strcpy(DAT_6000_cb52,(char *)s_THE_EXPLOSION_DOES_6000_37d8);
  radix = 10;
  sVar1 = strlen(DAT_6000_cb52);
  itoa(param_1,DAT_6000_cb52 + sVar1,radix);
  FUN_2000_22ff(unaff_DI,(char *)s_ON_THE_GROUND_DIRECTLY_6000_37ef,
                (char *)s_BELOW_THE_MONSTER__6000_3809,DAT_6000_cb52,
                (char *)s_POINTS_OF_DAMAGE__6000_381f,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY_6000_28ff,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return 1;
}


// ==== FUN_2000_caba @ 2000:caba (size 133) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_caba(void)

{
  int iVar1;
  
  if (DAT_6000_4593 == -1) {
    FUN_2000_c28a();
    return 0;
  }
  if (DAT_6000_c8e6 == 1) {
    FUN_2000_c2b6();
    return 0;
  }
  iVar1 = random_n(*(undefined1 *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 5));
  if (iVar1 == 0) {
    DAT_6000_c8e6 = 10;
    strcpy(DAT_6000_cbee,(char *)s_MONSTER_IS_SLEEPING_6000_3834);
  }
  else {
    FUN_2000_22ff((char *)s_THE_SPELL_FAILS__6000_3848,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_HIT_ANY_KEY_6000_28ff,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  }
  return 1;
}


// ==== FUN_2000_cb43 @ 2000:cb43 (size 38) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_cb43(void)

{
  if (DAT_6000_c8d0 == 0) {
    DAT_6000_c8d0 = 0x3c;
    DAT_6000_c904 = DAT_6000_c904 + 7;
    FUN_2000_c9a6();
    return 1;
  }
  FUN_2000_c2e2();
  return 0;
}


// ==== FUN_2000_cb6d @ 2000:cb6d (size 38) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_cb6d(void)

{
  if (DAT_6000_c8d2 == 0) {
    DAT_6000_c8d2 = 0x3c;
    DAT_6000_c90c = DAT_6000_c90c + 7;
    FUN_2000_c9a6();
    return 1;
  }
  FUN_2000_c2e2();
  return 0;
}


// ==== FUN_2000_cb97 @ 2000:cb97 (size 68) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_cb97(void)

{
  if ((DAT_6000_c8d2 != 0) && (DAT_6000_c8d0 != 0)) {
    FUN_2000_c2e2();
    return 0;
  }
  DAT_6000_c8d2 = DAT_6000_c8d2 + 0x3c;
  DAT_6000_c8d0 = DAT_6000_c8d0 + 0x3c;
  if (DAT_6000_c8d2 == 0x3c) {
    DAT_6000_c90c = DAT_6000_c90c + 7;
  }
  if (DAT_6000_c8d0 == 0x3c) {
    DAT_6000_c904 = DAT_6000_c904 + 7;
  }
  FUN_2000_c9a6();
  return 1;
}


// ==== FUN_2000_cbdf @ 2000:cbdf (size 133) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_cbdf(void)

{
  char cVar1;
  int iVar2;
  
  set_occupant(DAT_6000_c89e,DAT_6000_c8a0,0xffff);
  do {
    do {
      DAT_6000_c89e = random_n(DAT_6000_448b);
      DAT_6000_c8a0 = random_n(DAT_6000_448d);
      cVar1 = is_solid(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
    } while (cVar1 != '\0');
    iVar2 = FUN_2000_4575(DAT_6000_c89e,DAT_6000_c8a0);
  } while (iVar2 != -1);
  set_occupant(DAT_6000_c89e,DAT_6000_c8a0,0xfe);
  DAT_6000_123d = 1;
  DAT_6000_cd18 = 1;
  return 1;
}


// ==== FUN_2000_cc66 @ 2000:cc66 (size 98) callers: FUN_2000_cccc,FUN_2000_cdc5,FUN_2000_d0de,FUN_2000_d358

undefined2 __cdecl16far FUN_2000_cc66(void)

{
  if (*(char *)((uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 4) * 0x23 + 0x247) == 'd')
  {
    FUN_2000_22ff((char *)s_WHEN_YOU_BEGIN_TO_CAST_THE_6000_3859,
                  (char *)s_SPELL_THE_MONSTER_STOPS_YOU_6000_3876,
                  (char *)s_AND_SAYS___NO__THAT_SILLY_6000_3892,
                  (char *)s_SPELL_DOESTN_T_WORK_ON_ME__6000_38ac,
                  (char *)s_TRY_SOMETHING_ELSE_WHILE_I_6000_38c7,
                  (char *)s_TEAR_YOUR_LIMBS_FROM_ONE_6000_38e2,
                  (char *)s_ANOTHER__HEE_HEE_HEE__6000_38fb,(char *)s_HIT_ANY_KEY_6000_28ff);
    return 1;
  }
  return 0;
}


// ==== FUN_2000_cccc @ 2000:cccc (size 246) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_cccc(void)

{
  undefined1 uVar1;
  char cVar2;
  int iVar3;
  undefined2 uVar4;
  
  if (DAT_6000_4593 == -1) {
    FUN_2000_c28a();
    return 0;
  }
  iVar3 = FUN_2000_cc66();
  if (iVar3 != 0) {
    return 0;
  }
  uVar4 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
  *(undefined1 *)
   ((int)DAT_6000_cbe2 + (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 1) * 0x50 +
   (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6)) = 0xff;
  do {
    uVar1 = random_n(DAT_6000_448b);
    *(undefined1 *)((int)DAT_6000_cbde + DAT_6000_4593 * 6) = uVar1;
    uVar1 = random_n(DAT_6000_448d);
    *(undefined1 *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 1) = uVar1;
    cVar2 = is_solid(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
  } while (cVar2 != '\0');
  uVar4 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
  *(undefined1 *)
   ((int)DAT_6000_cbe2 + (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 1) * 0x50 +
   (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6)) = (undefined1)DAT_6000_4593;
  return 1;
}


// ==== FUN_2000_cdc5 @ 2000:cdc5 (size 276) callers: FUN_2000_d358

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

undefined2 __cdecl16far FUN_2000_cdc5(void)

{
  int iVar1;
  uint uVar2;
  int iVar3;
  int iVar4;
  
  if (DAT_6000_4593 == -1) {
    FUN_2000_c28a();
    return 0;
  }
  iVar1 = FUN_2000_cc66();
  if (iVar1 != 0) {
    return 0;
  }
  uVar2 = (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 4);
  iVar1 = random_n((int)*(char *)(uVar2 * 0x23 + 0x24a) + (int)*(char *)(uVar2 * 0x23 + 0x24b))
  ;
  iVar1 = random_n((uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 5) + iVar1);
  iVar3 = random_n(DAT_6000_c906 + DAT_6000_c908);
  iVar3 = random_n(DAT_6000_c89a + iVar3);
  iVar4 = random_n(DAT_6000_c8a2);
  if (iVar1 < iVar3 + iVar4) {
    *_DAT_6000_cd28 = 0xff9c;
    FUN_2000_22ff((char *)s_THE_MONSTER_S_BRAIN_EXPLODES_6000_3911,
                  (char *)s_FROM_ULTRA_INTENSE_BRAIN_6000_392e,
                  (char *)s_WAVES_WHICH_EMINATE_FROM_6000_394a,(char *)s_YOUR_MIND__6000_3966,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_HIT_ANY_KEY_6000_28ff,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
    return 1;
  }
  FUN_2000_22ff((char *)s_THE_SPELL_FAILS____TOUGH_LUCK_6000_3974,(char *)s_CHARLIE__6000_3992,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY_6000_28ff,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return 1;
}


// ==== FUN_2000_cedc @ 2000:cedc (size 44) callers: FUN_2000_cf08,FUN_2000_cf6c

void __cdecl16far FUN_2000_cedc(void)

{
  FUN_2000_22ff((char *)s_YOU_HAD_ALREADY_CAST_THIS_6000_399e,
                (char *)s_SPELL__SO_NOW_IT_WILL_LAST_6000_39b8,(char *)s_60_MOVES_LONGER__6000_39d5,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY____6000_20bd,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return;
}


// ==== FUN_2000_cf08 @ 2000:cf08 (size 98) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_cf08(uint param_1)

{
  if ((int)param_1 < (int)(uint)DAT_6000_c8d6) {
    FUN_2000_c2b6();
    return 0;
  }
  if (DAT_6000_c8d6 == param_1) {
    DAT_6000_c8d7 = DAT_6000_c8d7 + 0x3c;
    FUN_2000_cedc();
  }
  else {
    DAT_6000_c8d6 = (byte)param_1;
    DAT_6000_c8d7 = 0x3c;
    FUN_2000_22ff((char *)s_YOUR_WEAPON_BEGINS_TO_6000_39e8,
                  (char *)s_SHIMMER_WITH_POWER__THIS_6000_39fe,
                  (char *)s_WEAPON_IS_AUTOMATICALLY_6000_3a1a,
                  (char *)s_IN_USE_UNTIL_THE_SPELL_6000_3a35,0x3a4f,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_HIT_ANY_KEY_6000_28ff,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  }
  return 1;
}


// ==== FUN_2000_cf6c @ 2000:cf6c (size 98) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_cf6c(uint param_1)

{
  if ((int)param_1 < (int)(uint)DAT_6000_c8d9) {
    FUN_2000_c2b6();
    return 0;
  }
  if (DAT_6000_c8d9 == param_1) {
    DAT_6000_c8da = DAT_6000_c8da + 0x3c;
    FUN_2000_cedc();
  }
  else {
    DAT_6000_c8d9 = (byte)param_1;
    DAT_6000_c8da = 0x3c;
    FUN_2000_22ff((char *)s_YOUR_BODY_BEGINS_TO_SHIMMER_6000_3a58,
                  (char *)s_WITH_SHIFTING_COLORS_OF_6000_3a74,
                  (char *)s_LIGHT__THIS_PROTECTION_6000_3a8f,
                  (char *)s_WILL_LAST_FOR_60_MOVES_6000_3aa9,(char *)s_OR_STEPS__6000_3ac3,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_HIT_ANY_KEY_6000_28ff,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  }
  return 1;
}


// ==== FUN_2000_cfd0 @ 2000:cfd0 (size 52) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_cfd0(void)

{
  DAT_6000_c8dc = DAT_6000_c8dc + 0x3c;
  FUN_2000_22ff((char *)s_YOU_FEEL_A_WARMTH_IN_YOUR_6000_3ad0,
                (char *)s_BLOOD_AS_THE_RESIST_6000_3aea,(char *)s_POISON_TAKES_EFFECT__6000_3b01,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY_6000_28ff,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return 1;
}


// ==== FUN_2000_d006 @ 2000:d006 (size 52) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_d006(void)

{
  DAT_6000_c8de = DAT_6000_c8de + 0x3c;
  FUN_2000_22ff((char *)s_YOU_FEEL_A_TINGLING_IN_YOUR_6000_3b19,
                (char *)s_BODY_AS_THE_RESIST_6000_3b35,(char *)s_DISEASE_TAKES_EFFECT__6000_3b4b,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY_6000_28ff,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return 1;
}


// ==== FUN_2000_d03c @ 2000:d03c (size 52) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_d03c(void)

{
  DAT_6000_c8e0 = DAT_6000_c8e0 + 0x3c;
  FUN_2000_22ff((char *)s_YOU_FEEL_A_WARM_FEELING_AS_6000_3b64,
                (char *)s_YOUR_BODY_PREPARES_6000_3b7f,(char *)s_FOR_AN_ICE_ATTACK__6000_3b95,
                (char *)s_SPELL_WILL_LAST_60_MOVES__6000_3bab,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY_6000_28ff,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return 1;
}


// ==== FUN_2000_d072 @ 2000:d072 (size 52) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_d072(void)

{
  DAT_6000_c8e2 = DAT_6000_c8e2 + 0x3c;
  FUN_2000_22ff((char *)s_YOU_FEEL_A_COOL_FEELING_AS_6000_3bc8,
                (char *)s_YOUR_BODY_PREPARES_6000_3b7f,(char *)s_FOR_A_FIRE_ATTACK__6000_3be3,
                (char *)s_SPELL_WILL_LAST_60_MOVES__6000_3bab,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY_6000_28ff,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return 1;
}


// ==== FUN_2000_d0a8 @ 2000:d0a8 (size 52) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_d0a8(void)

{
  DAT_6000_c8e4 = DAT_6000_c8e4 + 0x3c;
  FUN_2000_22ff((char *)s_YOU_FEEL_A_HEAVENLY_6000_3bf9,(char *)s_PRESENCE_AS_THE_FORCES_6000_3c0d,
                (char *)s_OF_GOOD_GATHER_TO_DEFEND_6000_3c27,
                (char *)s_YOU_AGAINST_LEVEL_DRAIN__6000_3c43,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_HIT_ANY_KEY_6000_28ff,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  return 1;
}


// ==== FUN_2000_d0de @ 2000:d0de (size 181) callers: FUN_2000_d358

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

undefined2 __cdecl16far FUN_2000_d0de(void)

{
  int iVar1;
  undefined2 uVar2;
  
  if (DAT_6000_4593 == -1) {
    FUN_2000_c28a();
    return 0;
  }
  iVar1 = FUN_2000_cc66();
  if (iVar1 != 0) {
    return 0;
  }
  uVar2 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
  iVar1 = (int)DAT_6000_cbde;
  if ((int)(uint)*(byte *)(iVar1 + DAT_6000_4593 * 6 + 5) < DAT_6000_c908) {
    *(undefined1 *)(iVar1 + DAT_6000_4593 * 6 + 5) = 0;
    *_DAT_6000_cd28 = 0;
  }
  else {
    *(char *)(iVar1 + DAT_6000_4593 * 6 + 5) =
         *(char *)(iVar1 + DAT_6000_4593 * 6 + 5) - (char)DAT_6000_c908;
    *_DAT_6000_cd28 =
         *_DAT_6000_cd28 -
         ((int)*(char *)((uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 4) * 0x23 + 0x248)
         / 2) * DAT_6000_c908;
  }
  return 1;
}


// ==== FUN_2000_d195 @ 2000:d195 (size 437) callers: FUN_2000_d358

undefined2 __cdecl16far FUN_2000_d195(void)

{
  char cVar1;
  int iVar2;
  int iVar3;
  int iVar4;
  int iVar5;
  int local_a;
  int local_8;
  int local_4;
  
  local_8 = 0;
  local_a = 0;
  FUN_2000_216b((char *)s_SELECT_A_DIRECTION__6000_3c5f,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                (char *)s_1__NORTH__UP__6000_3c73,(char *)s_2__SOUTH__DOWN__6000_3c81,
                (char *)s_3__EAST__RIGHT__6000_3c91,(char *)s_4__WEST__LEFT__6000_3ca1,
                (char *)s_5__CANCEL_SPELL__ESCAPE__6000_3cb0,
                (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  iVar2 = FUN_2000_1fbd(2,6);
  local_4 = iVar2 + -0x30;
  if ((0 < local_4) && (local_4 < 5)) {
    switch(iVar2) {
    case 0x31:
      local_a = -1;
      break;
    case 0x32:
      local_a = 1;
      break;
    case 0x33:
      local_8 = 1;
      break;
    case 0x34:
      local_8 = -1;
    }
    for (iVar2 = 2; iVar2 < 0x14; iVar2 = iVar2 + 1) {
      iVar4 = DAT_6000_c89e + local_8 * iVar2;
      iVar5 = DAT_6000_c8a0 + local_a * iVar2;
      if (((((-1 < iVar4) && (iVar4 < DAT_6000_448b)) && (-1 < iVar5)) &&
          ((iVar5 < DAT_6000_448d &&
           (cVar1 = is_solid(iVar4,iVar5,DAT_6000_c8a2,DAT_6000_c8a4), cVar1 == '\0')))) &&
         (iVar3 = FUN_2000_4575(iVar4,iVar5), iVar3 == -1)) {
        DAT_6000_c8a6 = DAT_6000_c8a6 + (char)local_8 * (char)iVar2;
        DAT_6000_c8a7 = DAT_6000_c8a7 + (char)local_a * (char)iVar2;
        if (((DAT_6000_c8a6 < '\x01') || (DAT_6000_c8a7 < '\x01')) ||
           ((DAT_6000_4489 + -2 < (int)DAT_6000_c8a6 || (DAT_6000_448a + -2 < (int)DAT_6000_c8a7))))
        {
          DAT_6000_123d = 1;
        }
        set_occupant(DAT_6000_c89e,DAT_6000_c8a0,0xffff);
        DAT_6000_c89e = iVar4;
        DAT_6000_c8a0 = iVar5;
        set_occupant(iVar4,iVar5,0xfe);
        FUN_2000_8b3f(&local_4,&local_4,&local_4,&local_4);
        return 1;
      }
    }
  }
  return 0;
}


// ==== FUN_2000_d358 @ 2000:d358 (size 5474) callers: FUN_2000_ea27

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

int __cdecl16far FUN_2000_d358(undefined2 param_1,undefined2 param_2,int param_3)

{
  char cVar1;
  int in_AX;
  int iVar2;
  short sVar3;
  int iVar4;
  short sVar5;
  int local_4;
  
  local_4 = 0;
  switch(param_1) {
  case 0:
    switch(param_2) {
    case 0:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c30e(1);
        return iVar4;
      }
      if (param_3 == 1) {
        DAT_6000_c125 = DAT_6000_c125 + 1;
        return 1;
      }
      if (param_3 == 2) {
        iVar4 = cast_spell(3,1);
        return iVar4;
      }
    case 1:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c3d5(1);
        return iVar4;
      }
      if (param_3 == 1) {
        DAT_6000_c125 = DAT_6000_c125 + 3;
        return 1;
      }
      if (param_3 == 2) {
        iVar4 = cast_spell(3,2);
        return iVar4;
      }
    case 2:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c30e(2);
        return iVar4;
      }
      if (param_3 == 1) {
        DAT_6000_c125 = DAT_6000_c125 + 5;
        return 1;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_c502(1);
        return iVar4;
      }
    case 3:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c3d5(2);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c524(1);
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = cast_spell(10,1);
        return iVar4;
      }
    case 4:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c30e(3);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c502(2);
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_c4e0(1);
        return iVar4;
      }
    case 5:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c3d5(3);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c524(2);
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = cast_spell(8,2);
        return iVar4;
      }
    case 6:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c502(3);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c524(3);
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_c4e0(2);
        return iVar4;
      }
    case 7:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c30e(4);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c3d5(4);
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = cast_spell(10,2);
        return iVar4;
      }
    case 8:
      if (param_3 == 0) {
        if (DAT_6000_c8c5 != 'd') {
          DAT_6000_c8c5 = 100;
          FUN_2000_2d8e();
          return 1;
        }
        FUN_2000_c2b6();
        return 0;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c524(5);
        return iVar4;
      }
      if (param_3 == 2) {
        DAT_6000_c125 = DAT_6000_c125 + 0x19;
        return 1;
      }
    case 9:
      if (param_3 == 0) {
        if (DAT_6000_c8c7 != 'd') {
          DAT_6000_c8c7 = 100;
          return 1;
        }
        FUN_2000_c2b6();
        return 0;
      }
      if (param_3 == 1) {
        DAT_6000_c8c8 = FUN_1000_1417();
        if ((DAT_6000_c8ca == 0) && (DAT_6000_c8c8 < 0x3d80)) {
          DAT_6000_c8ca = 0;
          DAT_6000_c8c8 = 0x3d80;
        }
        return 1;
      }
      in_AX = param_3;
      if (param_3 == 2) {
        iVar4 = FUN_2000_c4e0(4);
        return iVar4;
      }
    }
  case 1:
    switch(param_2) {
    case 0:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c49c(1);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c4be(1);
        return iVar4;
      }
      if (param_3 == 2) {
        DAT_6000_c123 = DAT_6000_c123 + DAT_6000_c908 / 2;
        if (DAT_6000_c125 < DAT_6000_c123) {
          DAT_6000_c123 = DAT_6000_c125;
        }
        FUN_2000_c97a();
        return 1;
      }
    case 1:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c4be(2);
        return iVar4;
      }
      if (param_3 == 1) {
        FUN_2000_cbdf();
        return 1;
      }
      if (param_3 == 2) {
        strcpy(DAT_6000_cb52,(char *)s_YOU_ARE_ON_LEVEL__6000_3cc9);
        sVar5 = 10;
        sVar3 = strlen(DAT_6000_cb52);
        itoa(DAT_6000_c8a2,DAT_6000_cb52 + sVar3,sVar5);
        FUN_2000_22ff(DAT_6000_cb52,(char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
    case 2:
      if (param_3 == 0) {
        local_4 = random_n(DAT_6000_c908);
        local_4 = local_4 + 10;
        if (0x28 < local_4) {
          local_4 = 0x28;
        }
        DAT_6000_c123 = DAT_6000_c123 + local_4;
        if (DAT_6000_c125 < DAT_6000_c123) {
          DAT_6000_c123 = DAT_6000_c125;
        }
        FUN_2000_c97a();
        return 1;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c49c(2);
        return iVar4;
      }
      if (param_3 == 2) {
        if (DAT_6000_c8cc != '\x05') {
          DAT_6000_c8cc = 5;
          DAT_6000_c904 = DAT_6000_c904 + 5;
          FUN_2000_c9a6();
          return 1;
        }
        FUN_2000_c2e2();
        return 0;
      }
    case 3:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c4be(3);
        return iVar4;
      }
      if (param_3 == 1) {
        if (DAT_6000_c8cd != '\x05') {
          DAT_6000_c8cd = 5;
          DAT_6000_c90c = DAT_6000_c90c + 5;
          FUN_2000_c9a6();
          return 1;
        }
        FUN_2000_c2e2();
        return 0;
      }
      if (param_3 == 2) {
        if (0x7b < DAT_6000_c8a2) {
          FUN_2000_22ff((char *)s_THAT_SPELL_DOES_NOT_6000_3cdc,(char *)s_WORK_THIS_DEEP__6000_3cf0,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY____6000_20bd,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          return 0;
        }
        DAT_6000_c8a2 = DAT_6000_c8a2 + 1;
        do {
          DAT_6000_c89e = random_n(DAT_6000_448b);
          DAT_6000_c8a0 = random_n(DAT_6000_448d);
          cVar1 = is_solid(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
        } while (cVar1 != '\0');
        enter_level(DAT_6000_c8a2);
        DAT_6000_123d = 1;
        return 1;
      }
    case 4:
      if (param_3 == 0) {
        if (0x41 < DAT_6000_c8a2) {
          FUN_2000_22ff((char *)s_THAT_SPELL_DOES_NOT_6000_3cdc,
                        (char *)s_WORK_BELOW_THE_64_TH_6000_3d02,(char *)s_LEVEL__6000_3d19,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY____6000_20bd,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          return 0;
        }
        if (DAT_6000_c8a2 < 1) {
          FUN_2000_22ff((char *)s_THIS_SPELL_CAN_NOT_BE_6000_3d22,
                        (char *)s_USED_TO_MAKE_YOU_FLOAT_6000_3d38,
                        (char *)s_ABOVE_THE_TOWN__6000_3d51,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY____6000_20bd,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          return 0;
        }
        DAT_6000_c8a2 = DAT_6000_c8a2 + -1;
        do {
          DAT_6000_c89e = random_n(DAT_6000_448b);
          DAT_6000_c8a0 = random_n(DAT_6000_448d);
          cVar1 = is_solid(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
        } while (cVar1 != '\0');
        enter_level(DAT_6000_c8a2);
        DAT_6000_123d = 1;
        return 1;
      }
      if (param_3 == 1) {
        for (iVar4 = 3; iVar4 < 8; iVar4 = iVar4 + 1) {
          strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],
                 (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        }
        strcpy(DAT_6000_cd80,(char *)s_YOU_ARE_ON_LEVEL__6000_3cc9);
        sVar5 = 10;
        sVar3 = strlen(DAT_6000_cd80);
        itoa(DAT_6000_c8a2,DAT_6000_cd80 + sVar3,sVar5);
        strcpy(DAT_6000_cd82,(char *)s_YOUR_X_AND_Y_COORDINATES_6000_3d63);
        strcpy(DAT_6000_cd84,(char *)0x3d7c);
        sVar5 = 10;
        sVar3 = strlen(DAT_6000_cd84);
        itoa(DAT_6000_c89e,DAT_6000_cd84 + sVar3,sVar5);
        strcat(DAT_6000_cd84,(char *)0x3d87);
        sVar5 = 10;
        sVar3 = strlen(DAT_6000_cd84);
        itoa(DAT_6000_c8a0,DAT_6000_cd84 + sVar3,sVar5);
        FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,0xffff,0);
        return 1;
      }
      if (param_3 == 2) {
        if (DAT_6000_c8c5 != '\0') {
          FUN_2000_c2b6();
          return 0;
        }
        DAT_6000_c8c5 = 1;
        FUN_2000_2d8e();
        return 1;
      }
    case 5:
      if (param_3 == 0) {
        local_4 = random_n(DAT_6000_c908 << 2);
        local_4 = local_4 + 0x14;
        if (0x5a < local_4) {
          local_4 = 0x5a;
        }
        DAT_6000_c123 = DAT_6000_c123 + local_4;
        if (DAT_6000_c125 < DAT_6000_c123) {
          DAT_6000_c123 = DAT_6000_c125;
        }
        FUN_2000_c9a6();
        return 1;
      }
      if (param_3 == 1) {
        if (0x41 < DAT_6000_c8a2) {
          FUN_2000_22ff((char *)s_THAT_SPELL_DOES_NOT_6000_3cdc,
                        (char *)s_WORK_BELOW_THE_64_TH_6000_3d02,(char *)s_LEVEL__6000_3d19,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY____6000_20bd,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          return 0;
        }
        if (DAT_6000_c8a2 < 1) {
          FUN_2000_22ff((char *)s_THIS_SPELL_CAN_NOT_BE_6000_3d22,
                        (char *)s_USED_TO_MAKE_YOU_FLOAT_6000_3d38,
                        (char *)s_ABOVE_THE_TOWN__6000_3d51,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY____6000_20bd,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          return 0;
        }
        if (DAT_6000_c8a2 < 2) {
          DAT_6000_c8a2 = DAT_6000_c8a2 + -1;
        }
        else {
          DAT_6000_c8a2 = DAT_6000_c8a2 + -2;
        }
        do {
          DAT_6000_c89e = random_n(DAT_6000_448b);
          DAT_6000_c8a0 = random_n(DAT_6000_448d);
          cVar1 = is_solid(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
        } while (cVar1 != '\0');
        enter_level(DAT_6000_c8a2);
        DAT_6000_123d = 1;
        return 1;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_c4be(4);
        return iVar4;
      }
    case 6:
      if (param_3 == 0) {
        if (DAT_6000_c8c7 != '\0') {
          FUN_2000_c2b6();
          return 0;
        }
        DAT_6000_c8c7 = 1;
        return 1;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c49c(3);
        return iVar4;
      }
      if (param_3 == 2) {
        if (DAT_6000_c8c6 != '\0') {
          FUN_2000_c2b6();
          return 0;
        }
        DAT_6000_c8c6 = 1;
        return 1;
      }
    case 7:
      if (param_3 == 0) {
        if (DAT_6000_c8ce != '\n') {
          DAT_6000_c8ce = 10;
          DAT_6000_c904 = DAT_6000_c904 + 10;
          FUN_2000_c9a6();
          return 1;
        }
        FUN_2000_c2e2();
        return 0;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c4be(5);
        return iVar4;
      }
      if (param_3 == 2) {
        if (0x41 < DAT_6000_c8a2) {
          FUN_2000_22ff((char *)s_THAT_SPELL_DOES_NOT_6000_3cdc,
                        (char *)s_WORK_BELOW_THE_64_TH_6000_3d02,(char *)s_LEVEL__6000_3d19,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY____6000_20bd,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          return 0;
        }
        DAT_6000_c8a2 = DAT_6000_c8a2 + 0x19;
        if (0x4b < DAT_6000_c8a2) {
          DAT_6000_c8a2 = 0x4b;
        }
        do {
          DAT_6000_c89e = random_n(DAT_6000_448b);
          DAT_6000_c8a0 = random_n(DAT_6000_448d);
          cVar1 = is_solid(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
        } while (cVar1 != '\0');
        enter_level(DAT_6000_c8a2);
        DAT_6000_123d = 1;
        return 1;
      }
    case 8:
      if (param_3 == 0) {
        if (DAT_6000_c8cf != '\n') {
          DAT_6000_c8cf = 10;
          DAT_6000_c90c = DAT_6000_c90c + 10;
          FUN_2000_c9a6();
          return 1;
        }
        FUN_2000_c2e2();
        return 0;
      }
      if (param_3 == 1) {
        DAT_6000_c8be = 0xffff;
        return 1;
      }
      if (param_3 == 2) {
        DAT_6000_c123 = DAT_6000_c125;
        return 1;
      }
    case 9:
      if (param_3 == 0) {
        if (0x41 < DAT_6000_c8a2) {
          FUN_2000_22ff((char *)s_THAT_SPELL_DOES_NOT_6000_3cdc,
                        (char *)s_WORK_BELOW_THE_64_TH_6000_3d02,(char *)s_LEVEL__6000_3d19,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY____6000_20bd,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          return 0;
        }
        if (DAT_6000_c8a2 < 1) {
          FUN_2000_22ff((char *)s_THIS_SPELL_CAN_NOT_BE_6000_3d22,
                        (char *)s_USED_TO_MAKE_YOU_FLOAT_6000_3d38,
                        (char *)s_ABOVE_THE_TOWN__6000_3d51,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_HIT_ANY_KEY____6000_20bd,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                        (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
          return 0;
        }
        DAT_6000_c8a2 = DAT_6000_c8a2 + -0x19;
        if (DAT_6000_c8a2 < 0) {
          DAT_6000_c8a2 = 0;
        }
        do {
          DAT_6000_c89e = random_n(DAT_6000_448b);
          DAT_6000_c8a0 = random_n(DAT_6000_448d);
          cVar1 = is_solid(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4);
        } while (cVar1 != '\0');
        enter_level(DAT_6000_c8a2);
        DAT_6000_123d = 1;
        return 1;
      }
      if (param_3 == 1) {
        DAT_6000_c8bc = 0xffff;
        return 1;
      }
      in_AX = param_3;
      if (param_3 == 2) {
        iVar4 = FUN_2000_c49c(4);
        return iVar4;
      }
    }
  case 2:
    switch(param_2) {
    case 0:
      if (param_3 == 0) {
        iVar4 = FUN_2000_caba();
        return iVar4;
      }
      if (param_3 == 1) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 - (DAT_6000_c89a * 2 + 2);
        strcpy(DAT_6000_cb52,(char *)s_THE_MONSTER_FOR_6000_3d8b);
        sVar5 = 10;
        sVar3 = strlen(DAT_6000_cb52);
        itoa(DAT_6000_c89a * 2 + 2,DAT_6000_cb52 + sVar3,sVar5);
        FUN_2000_22ff((char *)s_WISPS_OF_COLORFUL_LIGHT_6000_3d9f,
                      (char *)s_GATHER_TOGETHER_AND_ZAP_6000_3db7,DAT_6000_cb52,
                      (char *)s_POINTS_OF_DAMAGE__6000_3dd2,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_cf6c(1);
        return iVar4;
      }
    case 1:
      if (param_3 == 0) {
        DAT_6000_c8d4 = 0x3c;
        FUN_2000_22ff((char *)s_ALL_YOUR_ENEMIES_SEEM_6000_3de7,
                      (char *)s_TO_SLOW_DOWN_TO_ABOUT_6000_3dfd,(char *)s_HALF_SPEED__6000_3e16,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_cb43();
        return iVar4;
      }
      if (param_3 == 2) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 + -0x19;
        FUN_2000_22ff((char *)s_YOU_TOUCH_THE_MONSTER_6000_3e25,
                      (char *)s_AND_ELECTRICITY_FLOWS_6000_3e3b,
                      (char *)s_THROUGH_YOUR_HANDS__6000_3e54,
                      (char *)s_SHOCKING_YOUR_OPPONENT_6000_3e6b,
                      (char *)s_FOR_25_POINTS_OF_DAMAGE__6000_3e85,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
    case 2:
      if (param_3 == 0) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 - (DAT_6000_c89a * 4 + 4);
        strcpy(DAT_6000_cb52,(char *)s_THE_MONSTER_FOR_6000_3d8b);
        sVar5 = 10;
        sVar3 = strlen(DAT_6000_cb52);
        itoa(DAT_6000_c89a * 4 + 4,DAT_6000_cb52 + sVar3,sVar5);
        FUN_2000_22ff((char *)s_YOU_FORM_A_BALL_WITH_YOUR_6000_3ea1,
                      (char *)s_HANDS_AND_ELECTRICITY_6000_3ebb,
                      (char *)s_BOLTS_FORWARD__BURNING_6000_3ed4,DAT_6000_cb52,
                      (char *)s_POINTS_OF_DAMAGE__6000_381f,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
      if (param_3 == 1) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 + -0x32;
        FUN_2000_22ff((char *)s_A_MISSLE_BOLTS_FORWARD_6000_3eee,
                      (char *)s_FROM_YOUR_FOREHEAD_AND_6000_3f05,
                      (char *)s_STABS_THE_ENEMY_FOR_50_6000_3f1f,
                      (char *)s_POINTS_OF_DAMAGE__6000_381f,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_cb6d();
        return iVar4;
      }
    case 3:
      if (param_3 == 0) {
        FUN_2000_cccc();
        return 1;
      }
      if (param_3 == 1) {
        FUN_2000_cbdf();
        return 1;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_cf08(1);
        return iVar4;
      }
    case 4:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c9d2(0);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_cf6c(2);
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_cfd0();
        return iVar4;
      }
    case 5:
      if (param_3 == 0) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        for (iVar4 = 0; iVar4 < DAT_6000_c89a + 1; iVar4 = iVar4 + 1) {
          iVar2 = random_n(5);
          local_4 = local_4 + iVar2 + 4;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 - local_4;
        strcpy(DAT_6000_cb52,(char *)s_THE_MISSLES_DO_6000_3f39);
        sVar5 = 10;
        sVar3 = strlen(DAT_6000_cb52);
        itoa(local_4,DAT_6000_cb52 + sVar3,sVar5);
        FUN_2000_22ff((char *)s_A_GROUP_OF_MISSLES_SPRING_6000_3f4c,
                      (char *)s_FORTH_FROM_YOUR_FINGERTIPS_6000_3f66,
                      (char *)s_AND_PLUNGE_DIRECTLY_INTO_6000_3f84,
                      (char *)s_THE_ENEMY_S_BODY__6000_3fa0,DAT_6000_cb52,
                      (char *)s_POINTS_OF_DAMAGE__6000_381f,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff);
        return 1;
      }
      if (param_3 == 1) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 + -0x7d;
        FUN_2000_22ff((char *)s_YOU_TOUCH_THE_MONSTER_6000_3e25,
                      (char *)s_AND_ELECTRICITY_FLOWS_6000_3e3b,
                      (char *)s_THROUGH_YOUR_HANDS__6000_3e54,
                      (char *)s_SHOCKING_YOUR_OPPONENT_6000_3e6b,
                      (char *)s_FOR_125_POINTS_OF_DAMAGE__6000_3fb5,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_d03c();
        return iVar4;
      }
    case 6:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c9d2(1);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_d195();
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_d072();
        return iVar4;
      }
    case 7:
      if (param_3 == 0) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        for (iVar4 = 0; iVar4 < DAT_6000_c89a + 1; iVar4 = iVar4 + 1) {
          iVar2 = random_n(5);
          local_4 = local_4 + iVar2 + 7;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 - local_4;
        strcpy(DAT_6000_cb52,(char *)s_THE_CHARGE_DOES_6000_3fd2);
        sVar5 = 10;
        sVar3 = strlen(DAT_6000_cb52);
        itoa(local_4,DAT_6000_cb52 + sVar3,sVar5);
        FUN_2000_22ff((char *)s_AN_ELECTRIC_CHARGE_LEAPS_6000_3fe6,
                      (char *)s_FORTH_FROM_YOUR_FINGERTIPS_6000_3f66,0x3fff,
                      (char *)s_MONSTER__6000_401d,DAT_6000_cb52,
                      (char *)s_POINTS_OF_DAMAGE__6000_381f,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff);
        return 1;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_cf6c(3);
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_cf08(2);
        return iVar4;
      }
    case 8:
      if (param_3 == 0) {
        iVar4 = FUN_2000_cc66();
        if (iVar4 != 0) {
          return 0;
        }
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        strcpy(DAT_6000_cbee,(char *)s_MONSTER_IS_HELD_6000_4029);
        DAT_6000_c8e8 = 0xf;
        return 1;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_d0de();
        return iVar4;
      }
      if (param_3 == 2) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 + -300;
        FUN_2000_22ff((char *)s_YOU_TOUCH_THE_MONSTER_6000_3e25,
                      (char *)s_AND_ELECTRICITY_FLOWS_6000_3e3b,
                      (char *)s_THROUGH_YOUR_HANDS__6000_3e54,
                      (char *)s_SHOCKING_YOUR_OPPONENT_6000_3e6b,
                      (char *)s_FOR_300_POINTS_OF_DAMAGE__6000_4039,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
    case 9:
      if (param_3 == 0) {
        iVar4 = FUN_2000_c9d2(2);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_cdc5();
        return iVar4;
      }
      in_AX = param_3;
      if (param_3 == 2) {
        iVar4 = FUN_2000_cf08(3);
        return iVar4;
      }
    }
  case 3:
    switch(param_2) {
    case 0:
      if (param_3 == 0) {
        iVar4 = FUN_2000_caba();
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_cf6c(1);
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_cb43();
        return iVar4;
      }
    case 1:
      if (param_3 == 0) {
        iVar4 = FUN_2000_cfd0();
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_cb6d();
        return iVar4;
      }
      if (param_3 == 2) {
        DAT_6000_c123 = DAT_6000_c123 + DAT_6000_c908 / 2;
        if (DAT_6000_c125 < DAT_6000_c123) {
          DAT_6000_c123 = DAT_6000_c125;
        }
        FUN_2000_c97a();
        return 1;
      }
    case 2:
      if (param_3 == 0) {
        iVar4 = FUN_2000_d006();
        return iVar4;
      }
      if (param_3 == 1) {
        FUN_2000_cbdf();
        return 1;
      }
      if (param_3 == 2) {
        DAT_6000_c8d4 = 0x3c;
        FUN_2000_22ff((char *)s_ALL_YOUR_ENEMIES_SEEM_6000_3de7,
                      (char *)s_TO_SLOW_DOWN_TO_ABOUT_6000_3dfd,(char *)s_HALF_SPEED__6000_3e16,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
    case 3:
      if (param_3 == 0) {
        iVar4 = FUN_2000_d03c();
        return iVar4;
      }
      if (param_3 == 1) {
        FUN_2000_cccc();
        return 1;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_cf08(1);
        return iVar4;
      }
    case 4:
      if (param_3 == 0) {
        iVar4 = FUN_2000_cf6c(1);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_d072();
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_d195();
        return iVar4;
      }
    case 5:
      if (param_3 == 0) {
        iVar4 = FUN_2000_d0a8();
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_d0de();
        return iVar4;
      }
      if (param_3 == 2) {
        local_4 = random_n(DAT_6000_c908 << 2);
        local_4 = local_4 + 0x14;
        if (0x5a < local_4) {
          local_4 = 0x5a;
        }
        DAT_6000_c123 = DAT_6000_c123 + local_4;
        if (DAT_6000_c125 < DAT_6000_c123) {
          DAT_6000_c123 = DAT_6000_c125;
        }
        FUN_2000_c9a6();
        return 1;
      }
    case 6:
      if (param_3 == 0) {
        iVar4 = FUN_2000_cc66();
        if (iVar4 != 0) {
          return 0;
        }
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        strcpy(DAT_6000_cbee,(char *)s_MONSTER_IS_HELD_6000_4029);
        DAT_6000_c8e8 = 0xf;
        return 1;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_cf08(2);
        return iVar4;
      }
      if (param_3 == 2) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 + -0x7d;
        FUN_2000_22ff((char *)s_YOU_TOUCH_THE_MONSTER_6000_3e25,
                      (char *)s_AND_ELECTRICITY_FLOWS_6000_3e3b,
                      (char *)s_THROUGH_YOUR_HANDS__6000_3e54,
                      (char *)s_SHOCKING_YOUR_OPPONENT_6000_3e6b,
                      (char *)s_FOR_125_POINTS_OF_DAMAGE__6000_3fb5,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
    case 7:
      if (param_3 == 0) {
        iVar4 = FUN_2000_cf6c(3);
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_c9d2(1);
        return iVar4;
      }
      if (param_3 == 2) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        for (iVar4 = 0; iVar4 < DAT_6000_c89a + 1; iVar4 = iVar4 + 1) {
          iVar2 = random_n(5);
          local_4 = local_4 + iVar2 + 4;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 - local_4;
        strcpy(DAT_6000_cb52,(char *)s_THE_MISSLES_DO_6000_3f39);
        sVar5 = 10;
        sVar3 = strlen(DAT_6000_cb52);
        itoa(local_4,DAT_6000_cb52 + sVar3,sVar5);
        FUN_2000_22ff((char *)s_A_GROUP_OF_MISSLES_SPRING_6000_3f4c,
                      (char *)s_FORTH_FROM_YOUR_FINGERTIPS_6000_3f66,
                      (char *)s_AND_PLUNGE_DIRECTLY_INTO_6000_3f84,
                      (char *)s_THE_ENEMY_S_BODY__6000_3fa0,DAT_6000_cb52,
                      (char *)s_POINTS_OF_DAMAGE__6000_381f,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff);
        return 1;
      }
    case 8:
      if (param_3 == 0) {
        iVar4 = FUN_2000_cdc5();
        return iVar4;
      }
      if (param_3 == 1) {
        iVar4 = FUN_2000_cf08(3);
        return iVar4;
      }
      if (param_3 == 2) {
        iVar4 = FUN_2000_cb97();
        return iVar4;
      }
    case 9:
      if (param_3 == 0) {
        iVar4 = FUN_2000_cf6c(4);
        return iVar4;
      }
      if (param_3 == 1) {
        DAT_6000_c123 = DAT_6000_c125;
        return 1;
      }
      in_AX = param_3;
      if (param_3 == 2) {
        if (DAT_6000_4593 == -1) {
          FUN_2000_c28a();
          return 0;
        }
        *_DAT_6000_cd28 = *_DAT_6000_cd28 + -300;
        FUN_2000_22ff((char *)s_YOU_TOUCH_THE_MONSTER_6000_3e25,
                      (char *)s_AND_ELECTRICITY_FLOWS_6000_3e3b,
                      (char *)s_THROUGH_YOUR_HANDS__6000_3e54,
                      (char *)s_SHOCKING_YOUR_OPPONENT_6000_3e6b,
                      (char *)s_FOR_300_POINTS_OF_DAMAGE__6000_4039,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                      (char *)s_HIT_ANY_KEY_6000_28ff,
                      (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
        return 1;
      }
    }
  default:
    return in_AX;
  }
}


// ==== FUN_2000_e91e @ 2000:e91e (size 44) callers: FUN_2000_e94e

char * __cdecl16far FUN_2000_e91e(char *param_1,int param_2)

{
  short sVar1;
  
  for (sVar1 = strlen(param_1); sVar1 < param_2; sVar1 = sVar1 + 1) {
    param_1[sVar1] = ' ';
  }
  param_1[param_2] = '\0';
  return param_1;
}


// ==== FUN_2000_e94e @ 2000:e94e (size 215) callers: FUN_2000_ea27

char * __cdecl16far
FUN_2000_e94e(char *param_1,int param_2,char *param_3,char *param_4,int param_5,char *param_6,
             char *param_7,int param_8,char *param_9)

{
  strcpy(DAT_6000_cb52,param_1);
  if (param_2 == 0) {
    strcat(DAT_6000_cb52,(char *)s_NOT_YET_FOUND_6000_4056);
  }
  else {
    strcat(DAT_6000_cb52,param_3);
  }
  FUN_2000_e91e(DAT_6000_cb52,0x1b);
  strcat(DAT_6000_cb52,param_4);
  if (param_5 == 0) {
    strcat(DAT_6000_cb52,(char *)s_NOT_YET_FOUND_6000_4056);
  }
  else {
    strcat(DAT_6000_cb52,param_6);
  }
  FUN_2000_e91e(DAT_6000_cb52,0x35);
  strcat(DAT_6000_cb52,param_7);
  if (param_8 == 0) {
    strcat(DAT_6000_cb52,(char *)s_NOT_YET_FOUND_6000_4056);
  }
  else {
    strcat(DAT_6000_cb52,param_9);
  }
  FUN_2000_e91e(DAT_6000_cb52,0x4f);
  return DAT_6000_cb52;
}


// ==== FUN_2000_ea27 @ 2000:ea27 (size 3620) callers: movecontrol

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

undefined2 __cdecl16far FUN_2000_ea27(int param_1)

{
  int iVar1;
  int iVar2;
  short sVar3;
  int iVar4;
  int iVar5;
  int iVar6;
  long lVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  undefined2 uVar11;
  int local_c;
  int local_8;
  
  iVar1 = DAT_6000_c8a2;
  if (param_1 == 1) {
    local_c = -0x3d97;
  }
  if (param_1 == 2) {
    local_c = -0x3ce3;
  }
  if (param_1 == 3) {
    local_c = -0x3c2f;
  }
  if (param_1 == 4) {
    local_c = -0x3b7b;
  }
  if ((((param_1 == 1) || (param_1 == 2)) || (param_1 == 3)) && (DAT_6000_c11c == '\0')) {
    FUN_2000_22ff((char *)s_FIGHTERS_CAN_ONLY_CAST_6000_4064,
                  (char *)s_SPELLS_BY_USING_MAGIC_6000_407b,(char *)s_PAPER__KEEP_LOOKING__6000_4093
                  ,(char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_HIT_ANY_KEY____6000_20bd,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
    return 0;
  }
  uVar11 = 0;
  uVar10 = 0;
  uVar8 = 0x4af;
  lVar7 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar8));
  uVar8 = (undefined2)lVar7;
  uVar9 = 0;
  uVar10 = 0x63f;
  lVar7 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar7 = F_LDIV(lVar7,CONCAT22(uVar9,uVar10));
  fill_rect(0,0,(int)lVar7,uVar8,uVar11);
  if (param_1 == 1) {
    print_text(0,0,0,(char *)s_SELECT_THE_TYPE_OF_SPELL__6000_40aa,8);
  }
  if (param_1 == 2) {
    print_text(0,0,0,(char *)s_SELECT_THE_TYPE_OF_SCROLL__6000_40c4,8);
  }
  if (param_1 == 3) {
    print_text(0,0,0,(char *)s_SELECT_THE_TYPE_OF_WAND__6000_40df,8);
  }
  if (param_1 == 4) {
    print_text(0,0,0,(char *)s_SELECT_THE_TYPE_OF_PAPER__6000_40f8,8);
  }
  iVar2 = FUN_2000_1d0b(0x4583,1,8);
  if (iVar2 == -1) {
    return 0;
  }
  iVar6 = iVar2 + -1;
  if ((iVar6 == 0) && (DAT_6000_c8a2 != 0)) {
    FUN_2000_22ff((char *)s_THESE_SPELLS_TAKE_ONE_MONTH_6000_4112,
                  (char *)s_TO_CAST_AND_CAN_NOT_BE_6000_412e,
                  (char *)s_USED_IN_THE_DUNGEON__6000_4148,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_HIT_ANY_KEY____6000_20bd,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
    return 0;
  }
  if ((iVar6 == 1) && (DAT_6000_4593 != -1)) {
    FUN_2000_22ff((char *)s_THESE_SPELLS_TAKE_3_MINUTES_6000_4160,
                  (char *)s_TO_CAST__THIS_CAN_NOT_6000_417c,
                  (char *)s_BE_DONE_DURING_BATTLE__6000_4195,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_HIT_ANY_KEY____6000_20bd,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
    return 0;
  }
  if ((param_1 < 2) &&
     (((((iVar6 == 2 || (iVar6 == 6)) && (DAT_6000_c11c != '\x02')) &&
       (((DAT_6000_c11c != '\x03' && (DAT_6000_c11c != '\x05')) && (DAT_6000_c11c != '\x06')))) ||
      (((iVar6 == 3 || (iVar6 == 7)) &&
       ((DAT_6000_c11c != '\x01' &&
        (((DAT_6000_c11c != '\x02' && (DAT_6000_c11c != '\x04')) && (DAT_6000_c11c != '\x05'))))))))
     )) {
    FUN_2000_22ff((char *)s_YOU_ARE_UNABLE_TO_CAST_THIS_6000_41af,
                  (char *)s_TYPE_OF_SPELLS__6000_41cb,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_HIT_ANY_KEY____6000_20bd,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
    return 0;
  }
  uVar9 = 0;
  uVar10 = 0;
  uVar8 = 0x4af;
  lVar7 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar8));
  fill_rect(0,0,DAT_6000_cd96,(int)lVar7,uVar9);
  if (param_1 == 1) {
    if (iVar6 < 4) {
      print_text(0,0,0,(char *)s_SELECT_A_SPELL_SPELLS_USE_ONE_SP_6000_4201,4);
    }
    else {
      print_text(0,0,0,(char *)s_PRESS_A_LETTER_OR_A_NUMBER_TO_GE_6000_4236,4);
    }
  }
  else {
    print_text(0,0,0,(char *)s_SELECT_A_SPELL_FROM_THE_FOLLOWIN_6000_41de,4);
  }
  print_text_clipped(0x5be,0,0x63f,0,(char *)s_ESCAPE_6000_4267,3);
  uVar8 = FUN_2000_e94e(0x426e,(int)*(char *)(local_c + (iVar6 % 4) * 0x2d),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x4493),0x4274,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 1),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x4495),0x4278,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 2),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x4497),8);
  print_text_clipped(0,0x28,0x640,0,uVar8);
  uVar8 = FUN_2000_e94e(0x427c,(int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 3),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x4499),0x4282,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 4),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x449b),0x4286,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 5),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x449d),8);
  print_text_clipped(0,0x4f,0x640,0,uVar8);
  uVar8 = FUN_2000_e94e(0x428a,(int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 6),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x449f),0x4290,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 7),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44a1),0x4294,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 8),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44a3),8);
  print_text_clipped(0,0x76,0x640,0,uVar8);
  uVar8 = FUN_2000_e94e(0x4298,(int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 9),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44a5),0x429e,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 10),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44a7),0x42a2,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0xb),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44a9),8);
  print_text_clipped(0,0x9d,0x640,0,uVar8);
  uVar8 = FUN_2000_e94e(0x42a6,(int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0xc),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44ab),0x42ac,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0xd),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44ad),0x42b0,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0xe),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44af),8);
  print_text_clipped(0,0xc4,0x640,0,uVar8);
  uVar8 = FUN_2000_e94e(0x42b4,(int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0xf),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44b1),0x42ba,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x10),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44b3),0x42be,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x11),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44b5),8);
  print_text_clipped(0,0xea,0x640,0,uVar8);
  uVar8 = FUN_2000_e94e(0x42c2,(int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x12),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44b7),0x42c8,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x13),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44b9),0x42cc,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x14),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44bb),8);
  print_text_clipped(0,0x114,0x640,0,uVar8);
  uVar8 = FUN_2000_e94e(0x42d0,(int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x15),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44bd),0x42d6,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x16),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44bf),0x42da,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x17),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44c1),8);
  print_text_clipped(0,0x13b,0x640,0,uVar8);
  uVar8 = FUN_2000_e94e(0x42de,(int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x18),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44c3),0x42e4,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x19),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44c5),0x42e8,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x1a),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44c7),8);
  print_text_clipped(0,0x162,0x640,0,uVar8);
  uVar8 = FUN_2000_e94e(0x42ec,(int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x1b),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44c9),0x42f2,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x1c),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44cb),0x42f6,
                        (int)*(char *)(local_c + (iVar6 % 4) * 0x2d + 0x1d),
                        *(undefined2 *)((iVar6 % 4) * 0x3c + 0x44cd),8);
  print_text_clipped(0,0x188,0x640,0,uVar8);
  DAT_6000_cd18 = 1;
  for (local_8 = 0; local_8 < 10; local_8 = local_8 + 1) {
    for (iVar5 = 0; iVar5 < 3; iVar5 = iVar5 + 1) {
      if (*(char *)(local_c + (iVar6 % 4) * 0x2d + local_8 * 3 + iVar5) == '\0') {
        ((undefined1 *)&DAT_6000_d0ee)[local_8 * 3 + iVar5] = 0xff;
      }
    }
  }
  do {
    iVar5 = -1;
    sVar3 = kbhit();
    if (sVar3 == 0) {
      if ((DAT_6000_d0da != 0) &&
         ((iVar5 = mouse_pick(0x808b), iVar5 == 0x1e || (iVar4 = FUN_4000_2d34(1), iVar4 != 0))))
      {
        FUN_4000_3435();
        FUN_4000_2e13();
        uVar9 = 0;
        uVar10 = 0;
        uVar8 = 0x4af;
        lVar7 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar8));
        fill_rect(0,0,DAT_6000_cd96,(int)lVar7,uVar9);
        return 0;
      }
    }
    else {
      sVar3 = getch();
      sVar3 = toupper(sVar3);
      if (sVar3 == 0x1b) {
        FUN_4000_3435();
        FUN_4000_2e13();
        uVar9 = 0;
        uVar10 = 0;
        uVar8 = 0x4af;
        lVar7 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
        lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar8));
        fill_rect(0,0,DAT_6000_cd96,(int)lVar7,uVar9);
        return 0;
      }
      if ((0x30 < sVar3) && (sVar3 < 0x35)) {
        sVar3 = sVar3 + 0x2a;
      }
      iVar5 = sVar3 + -0x41;
    }
    if (((-1 < iVar5) && (iVar5 < 0x1e)) &&
       (*(char *)(local_c + (iVar6 % 4) * 0x2d + (iVar5 / 3) * 3 + iVar5 % 3) == '\0')) {
      iVar5 = -1;
    }
  } while ((iVar5 < 0) || (0x1d < iVar5));
  iVar4 = iVar5 / 3;
  iVar5 = iVar5 % 3;
  if (DAT_6000_d0da != 0) {
    FUN_4000_2e13();
    FUN_4000_3435();
  }
  uVar9 = 0;
  uVar10 = 0;
  uVar8 = 0x4af;
  lVar7 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar7 = F_LDIV(lVar7,CONCAT22(uVar10,uVar8));
  fill_rect(0,0,DAT_6000_cd96,(int)lVar7,uVar9);
  if (((param_1 != 1) || ((float)(iVar4 + 1) <= _DAT_6000_c127)) || (3 < iVar6)) {
    if (iVar6 < 4) {
      iVar2 = FUN_2000_d358(iVar6,iVar4,iVar5);
      if (iVar2 == 0) {
        return 0;
      }
      if (param_1 == 1) {
        _DAT_6000_c127 = _DAT_6000_c127 - (float)(iVar4 + 1);
      }
      if (param_1 == 2) {
        *(char *)(iVar6 * 0x2d + iVar4 * 3 + iVar5 + -0x3ce3) =
             *(char *)(iVar6 * 0x2d + iVar4 * 3 + iVar5 + -0x3ce3) + -1;
      }
      if (param_1 == 3) {
        *(char *)(iVar6 * 0x2d + iVar4 * 3 + iVar5 + -0x3c2f) =
             *(char *)(iVar6 * 0x2d + iVar4 * 3 + iVar5 + -0x3c2f) + -1;
      }
      if (param_1 == 4) {
        *(char *)(iVar6 * 0x2d + iVar4 * 3 + iVar5 + -0x3b7b) =
             *(char *)(iVar6 * 0x2d + iVar4 * 3 + iVar5 + -0x3b7b) + -1;
      }
      if (DAT_6000_c8a2 != iVar1) {
        return 1;
      }
      if (iVar6 == 0) {
        if (param_1 == 1) {
          _DAT_6000_c12b = _DAT_6000_c12b - (float)(iVar4 + 1);
        }
        return 0x8d00;
      }
      if (iVar6 != 1) {
        return 10;
      }
      return 100;
    }
    FUN_3000_b7fd(iVar2 + -5,iVar4,iVar5);
    FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,0xffff,0);
  }
  else {
    FUN_2000_22ff((char *)s_YOU_DO_NOT_HAVE_ENOUGH_6000_42fa,
                  (char *)s_SPELL_POINTS_TO_CAST_6000_4311,(char *)s_THIS_SPELL__6000_4329,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_HIT_ANY_KEY____6000_20bd,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47,
                  (char *)s_Error__Can_t_open_the_AI__Do_you_6000_142f + 0x47);
  }
  return 0;
}


// ==== FUN_2000_f853 @ 2000:f853 (size 1578) callers: main,movecontrol

/* WARNING: This function may have set the stack pointer */
/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_2000_f853(void)

{
  float fVar1;
  undefined2 uVar2;
  undefined2 uVar3;
  undefined2 unaff_BP;
  uint uVar4;
  long lVar5;
  undefined4 in_stack_00000000;
  undefined2 uVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  
  if (DAT_6000_124a != DAT_6000_c89a) {
    if ((DAT_6000_124a < 0x29) && (0x28 < DAT_6000_c89a)) {
      uVar8 = 0;
      uVar2 = 0;
      uVar3 = 0x4af;
      lVar5 = N_LXMUL(0x442,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar5 = F_LDIV(lVar5,CONCAT22(uVar2,uVar3));
      uVar3 = (undefined2)lVar5;
      uVar7 = 0x2c6;
      uVar6 = 0;
      uVar2 = 0x4af;
      lVar5 = N_LXMUL(0x41a,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar5 = F_LDIV(lVar5,CONCAT22(uVar6,uVar2));
      fill_rect(0,(int)lVar5,uVar7,uVar3,uVar8);
      DAT_6000_124c = DAT_6000_4338;
    }
    if (DAT_6000_124a < 0x29) {
      uVar3 = FUN_4000_428f((char *)s_MAXIMUM_LEVEL__6000_367d + 8,DAT_6000_124a,
                            DAT_6000_124a >> 0xf,0);
      print_text(0,0x41a,0,uVar3);
    }
    else {
      uVar3 = FUN_4000_428f((char *)s_CEXPERIENCE_NEEDED_FOR_LEVEL__6000_26ac + 0x1b,DAT_6000_124a,
                            DAT_6000_124a >> 0xf,0);
      print_text(0,0x41a,0,uVar3);
    }
    DAT_6000_124a = DAT_6000_c89a;
    if (DAT_6000_c89a < 0x29) {
      uVar3 = FUN_4000_428f((char *)s_MAXIMUM_LEVEL__6000_367d + 8,DAT_6000_c89a,
                            DAT_6000_c89a >> 0xf,DAT_6000_142b);
      print_text(0,0x41a,0,uVar3);
    }
    else {
      uVar3 = FUN_4000_428f((char *)s_CEXPERIENCE_NEEDED_FOR_LEVEL__6000_26ac + 0x1b,DAT_6000_c89a,
                            DAT_6000_c89a >> 0xf,DAT_6000_142b);
      print_text(0,0x41a,0,uVar3);
    }
  }
  if (DAT_6000_124c != DAT_6000_c94a) {
    if (DAT_6000_124a < 0x29) {
      print_text(0x118,0x41a,0,0x2bd6,0);
    }
    else {
      print_text(0x96,0x41a,0,0x2bd3,0);
    }
    FUN_1000_43f9();
    if (DAT_6000_124a < 0x29) {
      print_text(0x186,0x41a,0,DAT_6000_cb52,0);
    }
    else {
      print_text(200,0x41a,0,DAT_6000_cb52,0);
    }
    DAT_6000_124c = DAT_6000_c94a;
    if (DAT_6000_c89a < 0x29) {
      print_text(0x118,0x41a,0,0x4340,DAT_6000_142b);
    }
    else {
      print_text(0x96,0x41a,0,0x2bd3,DAT_6000_142b);
    }
    FUN_1000_43f9();
    if (DAT_6000_c89a < 0x29) {
      print_text(0x186,0x41a,0,DAT_6000_cb52,DAT_6000_142b);
    }
    else {
      print_text(200,0x41a,0,DAT_6000_cb52,DAT_6000_142b);
    }
  }
  fVar1 = (float)DAT_6000_1254;
  uVar4 = (uint)(fVar1 < _DAT_6000_c127) << 8 | (uint)(NAN(fVar1) || NAN(_DAT_6000_c127)) << 10 |
          (uint)(fVar1 == _DAT_6000_c127) << 0xe;
  if ((fVar1 == _DAT_6000_c127) != 0) {
    fVar1 = (float)DAT_6000_1258;
    uVar4 = (uint)(fVar1 < _DAT_6000_c12b) << 8 | (uint)(NAN(fVar1) || NAN(_DAT_6000_c12b)) << 10 |
            (uint)(fVar1 == _DAT_6000_c12b) << 0xe;
    if ((fVar1 == _DAT_6000_c12b) != 0) goto LAB_2000_fbaa;
  }
  uVar3 = format_two_numbers((char *)s_SPELL_POINTS__6000_4345,DAT_6000_1254,DAT_6000_1254 >> 0xf,0x4354,
                        DAT_6000_1258,DAT_6000_1258 >> 0xf,0);
  print_text(0,0x44c,0,uVar3);
  lVar5 = ftol((double)CONCAT44(in_stack_00000000,CONCAT22(unaff_BP,uVar4)));
  DAT_6000_1254 = (int)lVar5;
  lVar5 = ftol((double)CONCAT44(in_stack_00000000,CONCAT22(unaff_BP,uVar4)));
  DAT_6000_1258 = (int)lVar5;
  uVar3 = DAT_6000_142b;
  lVar5 = ftol((double)CONCAT26((int)in_stack_00000000,
                                CONCAT24(unaff_BP,CONCAT22(uVar4,DAT_6000_142b))));
  lVar5 = ftol((double)CONCAT26(uVar3,CONCAT24((int)((ulong)lVar5 >> 0x10),
                                               CONCAT22((int)lVar5,0x4354))));
  uVar2 = format_two_numbers((char *)s_SPELL_POINTS__6000_4345,(int)lVar5,(int)((ulong)lVar5 >> 0x10));
  print_text(0,0x44c,0,uVar2,uVar3,uVar4,unaff_BP);
LAB_2000_fbaa:
  if ((DAT_6000_1256 != DAT_6000_c123) || (DAT_6000_125a != DAT_6000_c125)) {
    uVar3 = format_two_numbers((char *)s_HEALTH_POINTS__6000_4359,DAT_6000_1256,DAT_6000_1256 >> 0xf,
                          0x4354,DAT_6000_125a,DAT_6000_125a >> 0xf,0);
    print_text(0,0x47e,0,uVar3);
    DAT_6000_1256 = DAT_6000_c123;
    DAT_6000_125a = DAT_6000_c125;
    uVar3 = format_two_numbers((char *)s_HEALTH_POINTS__6000_4359,DAT_6000_c123,DAT_6000_c123 >> 0xf,
                          0x4354,DAT_6000_c125,DAT_6000_c125 >> 0xf,DAT_6000_142b);
    print_text(0,0x47e,0,uVar3);
  }
  if (DAT_6000_123e != DAT_6000_c904) {
    uVar3 = FUN_4000_428f(0x4369,DAT_6000_123e,DAT_6000_123e >> 0xf,0);
    print_text(0x49c,0x41a,0,uVar3);
    DAT_6000_123e = DAT_6000_c904;
    uVar3 = FUN_4000_428f(0x4369,DAT_6000_c904,DAT_6000_c904 >> 0xf,DAT_6000_142d);
    print_text(0x49c,0x41a,0,uVar3);
  }
  if (DAT_6000_1240 != DAT_6000_c906) {
    uVar3 = FUN_4000_428f(0x436f,DAT_6000_1240,DAT_6000_1240 >> 0xf,0);
    print_text(0x49c,0x44c,0,uVar3);
    DAT_6000_1240 = DAT_6000_c906;
    uVar3 = FUN_4000_428f(0x436f,DAT_6000_c906,DAT_6000_c906 >> 0xf,DAT_6000_142d);
    print_text(0x49c,0x44c,0,uVar3);
  }
  if (DAT_6000_1242 != DAT_6000_c908) {
    uVar3 = FUN_4000_428f(0x4375,DAT_6000_1242,DAT_6000_1242 >> 0xf,0);
    print_text(0x49c,0x47e,0,uVar3);
    DAT_6000_1242 = DAT_6000_c908;
    uVar3 = FUN_4000_428f(0x4375,DAT_6000_c908,DAT_6000_c908 >> 0xf,DAT_6000_142d);
    print_text(0x49c,0x47e,0,uVar3);
  }
  if (DAT_6000_1244 != DAT_6000_c90a) {
    uVar3 = FUN_4000_428f(0x437b,DAT_6000_1244,DAT_6000_1244 >> 0xf,0);
    print_text(0x578,0x41a,0,uVar3);
    DAT_6000_1244 = DAT_6000_c90a;
    uVar3 = FUN_4000_428f(0x437b,DAT_6000_c90a,DAT_6000_c90a >> 0xf,DAT_6000_142d);
    print_text(0x578,0x41a,0,uVar3);
  }
  if (DAT_6000_1246 != DAT_6000_c90c) {
    uVar3 = FUN_4000_428f(0x4381,DAT_6000_1246,DAT_6000_1246 >> 0xf,0);
    print_text(0x578,0x44c,0,uVar3);
    DAT_6000_1246 = DAT_6000_c90c;
    uVar3 = FUN_4000_428f(0x4381,DAT_6000_c90c,DAT_6000_c90c >> 0xf,DAT_6000_142d);
    print_text(0x578,0x44c,0,uVar3);
  }
  if (DAT_6000_1248 != DAT_6000_c90e) {
    uVar3 = FUN_4000_428f(0x4387,DAT_6000_1248,DAT_6000_1248 >> 0xf,0);
    print_text(0x578,0x47e,0,uVar3);
    DAT_6000_1248 = DAT_6000_c90e;
    uVar3 = FUN_4000_428f(0x4387,DAT_6000_c90e,DAT_6000_c90e >> 0xf,DAT_6000_142d);
    print_text(0x578,0x47e,0,uVar3);
  }
  return;
}


// ==== FUN_3000_000d @ 3000:000d (size 248) callers: 

void __cdecl16far FUN_3000_000d(int param_1,int param_2)

{
  if (param_2 < 0x21) {
    if (param_1 < 0x24) {
      DAT_6000_c8f4 = 3;
      DAT_6000_4394 = 0xe;
      DAT_6000_4396 = 0xd;
      DAT_6000_4398 = 0xd;
    }
    else {
      DAT_6000_c8f4 = 5;
      DAT_6000_4394 = 4;
      DAT_6000_4396 = 0xc;
      DAT_6000_4398 = 0xc;
    }
  }
  else if (param_1 < 0x17) {
    DAT_6000_c8f4 = 1;
    DAT_6000_4394 = 2;
    DAT_6000_4396 = 1;
    DAT_6000_4398 = 1;
  }
  else if (param_1 < 0x2e) {
    DAT_6000_c8f4 = 4;
    DAT_6000_4394 = 9;
    DAT_6000_4396 = 0xb;
    DAT_6000_4398 = 0xb;
  }
  else {
    DAT_6000_c8f4 = 2;
    DAT_6000_4394 = 10;
    DAT_6000_4396 = 0xc;
    DAT_6000_4398 = 0xc;
  }
  if ((DAT_6000_cd94 == 0) || (DAT_6000_00c5 == 1)) {
    DAT_6000_4396 = 0;
  }
  if (DAT_6000_00c5 == 1) {
    DAT_6000_4398 = 0;
    DAT_6000_4394 = 0xe;
    if (DAT_6000_4390 == 3) {
      DAT_6000_439a = 0;
      DAT_6000_439c = 0;
    }
    else {
      DAT_6000_439c = 0xf;
      DAT_6000_439a = 0xf;
    }
  }
  if (DAT_6000_cd94 == 1) {
    DAT_6000_4398 = 1;
    DAT_6000_4396 = 1;
  }
  return;
}


// ==== FUN_3000_0105 @ 3000:0105 (size 972) callers: FUN_3000_1a08,FUN_3000_2796,FUN_3000_b1d6

void __cdecl16far
FUN_3000_0105(int param_1,int param_2,int param_3,int param_4,undefined4 param_5,int param_6,
             int param_7)

{
  bool bVar1;
  int iVar2;
  int iVar3;
  int iVar4;
  int iVar5;
  int iVar6;
  int iVar7;
  byte *pbVar8;
  int iVar9;
  int iVar10;
  long lVar11;
  long lVar12;
  int local_16;
  uint local_14;
  undefined4 local_e;
  uint local_a;
  int local_4;
  
  bVar1 = false;
  if ((0 < param_6) || (param_7 < 0xff)) {
    bVar1 = true;
  }
  iVar7 = (int)param_5 + 400;
  lVar12 = 0x63f;
  lVar11 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)param_1);
  lVar11 = F_LDIV(lVar11,lVar12);
  iVar2 = (int)lVar11;
  lVar12 = 0x63f;
  lVar11 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)param_3);
  lVar11 = F_LDIV(lVar11,lVar12);
  iVar3 = (int)lVar11;
  lVar12 = 0x4af;
  lVar11 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)param_2);
  lVar11 = F_LDIV(lVar11,lVar12);
  iVar4 = (int)lVar11;
  lVar12 = 0x4af;
  lVar11 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)param_4);
  lVar11 = F_LDIV(lVar11,lVar12);
  if ((iVar3 <= iVar2) || ((int)lVar11 <= iVar4)) {
    return;
  }
  iVar5 = iVar3 - iVar2;
  iVar6 = (int)lVar11 - iVar4;
  for (local_4 = 0; local_4 < iVar6; local_4 = local_4 + 1) {
    lVar12 = (long)iVar6;
    lVar11 = N_LXMUL(200,(long)local_4);
    lVar11 = F_LDIV(lVar11,lVar12);
    *(undefined2 *)(local_4 * 2 + -0x69c0) = (int)lVar11;
  }
  local_4 = 0;
  do {
    if (iVar6 <= local_4) {
      return;
    }
    pbVar8 = (byte *)(iVar7 + *(int *)((int)param_5 + *(int *)(local_4 * 2 + -0x69c0) * 2));
    local_e = (byte *)CONCAT22(param_5._2_2_,pbVar8);
    if ((byte *)(iVar7 + *(int *)((int)param_5 + *(int *)(local_4 * 2 + -0x69c0) * 2 + 2)) != pbVar8
       ) {
      local_a = (uint)*local_e;
      local_e = (byte *)CONCAT22(param_5._2_2_,pbVar8 + 1);
      iVar10 = iVar2;
      while (pbVar8 = (byte *)local_e,
            (byte *)local_e <
            (byte *)(iVar7 + *(int *)((int)param_5 + *(int *)(local_4 * 2 + -0x69c0) * 2 + 2))) {
        local_14 = (uint)*local_e;
        local_e = (byte *)CONCAT22(local_e._2_2_,(byte *)local_e + 1);
        if (local_14 < 0x20) {
          iVar9 = local_a + *local_e + -1;
          if (local_a - 1 == iVar9) {
            iVar9 = local_a + *local_e + 0xfe;
          }
          local_e = (byte *)CONCAT22(local_e._2_2_,pbVar8 + 2);
        }
        else {
          iVar9 = local_a + ((int)local_14 >> 5) + -1;
          local_14 = local_14 % 0x20;
        }
        if (bVar1) {
          if (param_7 < (int)local_a) break;
          local_16 = iVar2;
          if ((param_6 <= (int)local_a) && (local_16 = iVar10, iVar10 <= iVar2)) {
            lVar12 = (long)(param_7 - param_6);
            lVar11 = N_LXMUL((long)iVar5,(long)(int)(local_a - param_6));
            lVar11 = F_LDIV(lVar11,lVar12);
            local_16 = iVar2 + (int)lVar11;
          }
          iVar10 = iVar3;
          if (iVar9 <= param_7) {
            lVar12 = (long)(param_7 - param_6);
            lVar11 = N_LXMUL((long)iVar5,(long)(iVar9 - param_6));
            lVar11 = F_LDIV(lVar11,lVar12);
            iVar10 = iVar2 + (int)lVar11;
          }
        }
        else {
          local_16 = iVar10;
          if (iVar10 <= iVar2) {
            lVar11 = N_LXMUL((long)iVar5,(long)(int)local_a);
            lVar11 = N_LXRSH(lVar11,'\b');
            local_16 = iVar2 + (int)lVar11;
          }
          lVar11 = N_LXMUL((long)iVar5,(long)iVar9);
          lVar11 = N_LXRSH(lVar11,'\b');
          iVar10 = iVar2 + (int)lVar11;
        }
        if (((param_6 <= iVar9) && (local_14 != 0)) &&
           ((local_14 != 0x11 || (DAT_6000_43a0 != 0x20)))) {
          if (local_16 == iVar10) {
            (*DAT_6000_9632)(0x1000,local_16,iVar4 + local_4);
          }
          else {
            (*DAT_6000_962a)(0x1000,local_16,iVar4 + local_4,iVar10,iVar4 + local_4);
          }
        }
        local_a = iVar9 + 1;
      }
    }
    local_4 = local_4 + 1;
  } while( true );
}


// ==== FUN_3000_04d3 @ 3000:04d3 (size 1517) callers: FUN_3000_31f3

/* WARNING: Removing unreachable block (ram,0x0003058e) */
/* WARNING: Removing unreachable block (ram,0x00030593) */

int __cdecl16far
FUN_3000_04d3(int param_1,int param_2,int param_3,int param_4,int param_5,int param_6,
             undefined4 param_7,int param_8,int param_9)

{
  bool bVar1;
  char cVar2;
  uint uVar3;
  uint uVar4;
  uint uVar5;
  uint uVar6;
  undefined1 uVar8;
  int iVar7;
  int iVar9;
  byte bVar10;
  byte *pbVar11;
  undefined2 uVar12;
  int local_2c;
  uint local_2a;
  int local_28;
  uint local_1c;
  uint local_1a;
  uint local_18;
  byte local_15;
  undefined4 local_10;
  uint local_c;
  uint local_a;
  uint local_4;
  
  uVar12 = 0x3000;
  bVar1 = false;
  if ((DAT_6000_11a1 == 0) && (DAT_6000_43a6 == 1)) {
    if (DAT_6000_cd72 == 0) {
      if (DAT_6000_9b62 == (int)param_7) {
        return DAT_6000_cd64;
      }
      DAT_6000_cd64 = param_7._2_2_;
      DAT_6000_cd62 = (int)param_7;
    }
    else if (DAT_6000_cd72 == 1) {
      if (DAT_6000_9b66 == (int)param_7) {
        return DAT_6000_cd68;
      }
      DAT_6000_cd68 = param_7._2_2_;
      DAT_6000_cd66 = (int)param_7;
    }
    else if (DAT_6000_cd72 == 2) {
      if (DAT_6000_9b6a == (int)param_7) {
        return DAT_6000_cd6c;
      }
      DAT_6000_cd6c = param_7._2_2_;
      DAT_6000_cd6a = (int)param_7;
    }
    else {
      DAT_6000_cd70 = param_7._2_2_;
      DAT_6000_cd6e = (int)param_7;
    }
  }
  else if (DAT_6000_cd72 == 0) {
    DAT_6000_cd64 = 0;
    DAT_6000_cd62 = 0;
  }
  else if (DAT_6000_cd72 == 1) {
    DAT_6000_cd68 = 0;
    DAT_6000_cd66 = 0;
  }
  else if (DAT_6000_cd72 == 2) {
    DAT_6000_cd6c = 0;
    DAT_6000_cd6a = 0;
  }
  else {
    DAT_6000_cd70 = 0;
    DAT_6000_cd6e = 0;
  }
  if (0x186 < param_9) {
    param_9 = 399;
  }
  if ((0 < param_8) || (param_9 < 0x18e)) {
    bVar1 = true;
  }
  iVar7 = param_3;
  if ((param_3 < param_5) && (iVar7 = param_1, param_1 < param_2)) {
    param_2 = param_2 - param_1;
    local_2a = param_5 - param_3;
    if ((int)local_2a < param_6 - param_4) {
      local_2a = param_6 - param_4;
      local_2c = param_5 - param_3;
    }
    else {
      local_2c = param_6 - param_4;
    }
    for (local_4 = 0; (int)local_4 <= param_2; local_4 = local_4 + 1) {
      uVar3 = (int)(((long)(int)local_4 * (long)(param_4 - param_3)) / (long)param_2) + param_3;
      uVar4 = ((int)(((long)(int)local_4 * (long)(param_6 - param_5)) / (long)param_2) + param_5) -
              uVar3;
      if (bVar1) {
        local_28 = (int)(((long)(param_9 - param_8) * (long)(int)local_4) / (long)param_2) + param_8
        ;
      }
      else if (param_4 < param_3) {
        local_28 = 399 - (int)(((long)(int)(((long)(int)((((local_2c + local_2a) - uVar4) * 9 >> 3)
                                                        - (local_2a >> 3)) * 399) /
                                           (long)(int)local_2a) * (long)(int)(param_2 - local_4)) /
                              (long)param_2);
      }
      else {
        local_28 = (int)(((long)(int)(((long)(int)((((local_2c + local_2a) - uVar4) * 9 >> 3) -
                                                  (local_2a >> 3)) * 399) / (long)(int)local_2a) *
                         (long)(int)local_4) / (long)param_2);
      }
      pbVar11 = (byte *)((int)param_7 + 400 + *(int *)((int)param_7 + (local_28 % 200) * 2));
      local_10 = (byte *)CONCAT22(param_7._2_2_,pbVar11);
      local_a = (uint)*local_10;
      local_10 = (byte *)CONCAT22(param_7._2_2_,pbVar11 + 1);
      local_1a = uVar3;
      while (pbVar11 = (byte *)local_10,
            (byte *)local_10 <
            (byte *)((int)param_7 + 400 + *(int *)((int)param_7 + (local_28 % 200) * 2 + 2))) {
        local_15 = *local_10;
        local_10 = (byte *)CONCAT22(local_10._2_2_,(byte *)local_10 + 1);
        if (local_15 < 0x20) {
          local_c = (local_a + *local_10) - 1;
          if (local_a - 1 == local_c) {
            local_c = local_a + *local_10 + 0xfe;
          }
          local_10 = (byte *)CONCAT22(local_10._2_2_,pbVar11 + 2);
        }
        else {
          local_c = (local_a + ((int)(uint)local_15 >> 5)) - 1;
          local_15 = local_15 & 0x1f;
        }
        uVar5 = (int)((ulong)local_c * (ulong)uVar4 >> 8) + uVar3;
        uVar6 = uVar5;
        if (DAT_6000_cd94 < 2) {
          if (((DAT_6000_cd94 == 0) && (local_15 != 0)) && (local_15 != 0x10)) {
            uVar6 = 0;
            if ((uint)local_15 % 3 == 1) {
              local_15 = (local_4 & 1) != 0;
            }
            else {
              uVar6 = 0;
              if ((uint)local_15 % 3 == 2) {
                uVar6 = (int)local_4 / 3;
                local_15 = (int)local_4 % 3 != 0;
              }
              else {
                local_15 = 1;
              }
            }
          }
          if (DAT_6000_cd94 == 1) {
            if (0xf < local_15) {
              local_15 = 0;
            }
            if (local_15 / 4 == 1) {
              local_15 = local_15 * (char)((int)(param_1 + local_4) % 2);
            }
            if (local_15 / 4 == 2) {
              local_15 = local_15 + (char)((int)(param_1 + local_4) % 2);
            }
            uVar6 = local_15 / 4;
            if (local_15 / 4 == 3) {
              local_15 = local_15 + (char)((int)(param_1 + local_4) % 3);
              uVar6 = CONCAT11((char)((uint)((int)(param_1 + local_4) / 3) >> 8),local_15);
            }
          }
        }
        uVar8 = (undefined1)(uVar6 >> 8);
        if (local_15 < 0x10) {
          if (DAT_6000_cdd5 == 0x100) {
            local_15 = local_15 + DAT_6000_43a4;
          }
        }
        else {
          if (local_15 == 0x10) {
            local_15 = 0;
          }
          if (local_15 == 0x11) {
            local_15 = (byte)DAT_6000_43a0;
          }
          if (local_15 == 0x12) {
            if (DAT_6000_cdd5 == 0x100) {
              if ((DAT_6000_cd98 < 0) || ((DAT_6000_cd98 < 1 && (DAT_6000_cd96 < 0x3e9)))) {
                uVar6 = (int)(param_1 + local_4) >> 2 & 0xff7f;
                cVar2 = (char)uVar6;
                uVar8 = (undefined1)(uVar6 >> 8);
              }
              else {
                uVar6 = CONCAT11((char)((int)(param_1 + local_4) >> 9),
                                 (char)((int)(param_1 + local_4) >> 1)) & 0xff7f;
                cVar2 = (char)uVar6;
                uVar8 = (undefined1)(uVar6 >> 8);
              }
              local_15 = cVar2 + 0x40;
            }
            else {
              local_15 = 4;
            }
          }
          else if (local_15 == 0x13) {
            if (DAT_6000_cdd5 == 0x100) {
              if ((DAT_6000_cd98 < 0) || ((DAT_6000_cd98 < 1 && (DAT_6000_cd96 < 0x3e9)))) {
                bVar10 = (byte)((int)(0x400 - (param_1 + local_4)) >> 2);
              }
              else {
                bVar10 = (byte)((int)(0x400 - (param_1 + local_4)) >> 3);
              }
              local_15 = (bVar10 & 0x7f) + 0x40;
              uVar8 = (undefined1)(param_1 + local_4 >> 8);
            }
            else {
              local_15 = 4;
            }
          }
        }
        if (DAT_6000_cd94 == 9) {
          local_18 = local_1a;
          iVar7 = (int)local_1a >> 6;
          if (iVar7 != DAT_6000_7f7e) {
            uVar12 = 0x2000;
            FUN_2000_0c97(iVar7);
          }
          while( true ) {
            local_1c = uVar5;
            if ((int)local_18 >> 6 != (int)uVar5 >> 6) {
              local_1c = ((int)local_18 >> 6) * 0x40 + 0x3f;
            }
            pbVar11 = (byte *)((uint)(byte)((char)local_18 << 2) * 0x100 + param_1 + local_4);
            if (local_1c - local_18 == 0) {
              *pbVar11 = local_15;
            }
            else {
              iVar9 = (local_1c - local_18) + 1;
              do {
                *pbVar11 = local_15;
                pbVar11 = pbVar11 + 0x400;
                iVar9 = iVar9 + -1;
              } while (iVar9 != 0);
            }
            if (local_1c == uVar5) break;
            local_18 = local_1c + 1;
            iVar7 = iVar7 + 1;
            uVar12 = 0x2000;
            FUN_2000_0c97(iVar7);
          }
        }
        else if (local_1a == uVar5) {
          (*DAT_6000_9632)(uVar12,param_1 + local_4,local_1a,CONCAT11(uVar8,local_15));
        }
        else {
          (*DAT_6000_962a)(uVar12,param_1 + local_4,local_1a,param_1 + local_4,uVar5,
                           CONCAT11(uVar8,local_15));
        }
        local_a = local_c + 1;
        local_1a = uVar5;
      }
    }
    return param_2;
  }
  return iVar7;
}


// ==== FUN_3000_0ace @ 3000:0ace (size 40) callers: FUN_3000_0b3b,FUN_3000_12ca

int __cdecl16far FUN_3000_0ace(int param_1)

{
  if ((char)param_1 != -0x80) {
    return ((int)((char *)s_SPELLS_BY_USING_MAGIC_6000_407b + 5 + param_1) >> 8) * 0x100 + -0x3f80;
  }
  return param_1;
}


// ==== FUN_3000_0afa @ 3000:0afa (size 24) callers: FUN_3000_0b3b,FUN_3000_12ca

int __cdecl16far FUN_3000_0afa(int param_1)

{
  return ((param_1 + 0x3f80) / 0x100) * 0x100 + -0x3f80;
}


// ==== FUN_3000_0b14 @ 3000:0b14 (size 35) callers: FUN_3000_0b3b

int __cdecl16far FUN_3000_0b14(int param_1)

{
  if ((char)param_1 != '\0') {
    return ((param_1 >> 8) + 1) * 0x100;
  }
  return (param_1 >> 8) << 8;
}


// ==== FUN_3000_0b3b @ 3000:0b3b (size 1895) callers: FUN_3000_0b3b,FUN_3000_1a08

int __cdecl16far
FUN_3000_0b3b(uint param_1,int param_2,uint param_3,int param_4,uint param_5,int param_6,
             uint param_7,int param_8)

{
  float fVar1;
  float fVar2;
  float fVar3;
  int iVar4;
  uint uVar5;
  undefined2 uVar6;
  int iVar7;
  int iVar8;
  int iVar9;
  int iVar10;
  int iVar11;
  uint uVar12;
  int iVar13;
  long lVar14;
  long lVar15;
  undefined2 uVar16;
  undefined2 uVar17;
  undefined4 local_10;
  
  if (&stack0x0000 != (char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 0x18 &&
      0x19 < (int)&stack0xfffe) {
    return DAT_6000_9b60;
  }
  DAT_6000_cd60 = DAT_6000_cd60 + 1;
  iVar4 = DAT_6000_cd50 + DAT_6000_cd4c >> 1;
  lVar14 = N_LXMUL((long)DAT_6000_cd4e,(long)DAT_6000_43aa);
  lVar15 = N_LXMUL((long)DAT_6000_cd52,(long)(0x20 - DAT_6000_43aa));
  lVar14 = N_LXRSH(lVar15 + lVar14,'\x05');
  iVar7 = (int)lVar14;
  uVar5 = param_3;
  iVar9 = param_4;
  lVar14 = N_LXLSH((long)(0x10 - DAT_6000_43aa),'\x06');
  lVar14 = N_LXMUL((long)DAT_6000_cd56,lVar14);
  lVar14 = F_LDIV(lVar14,CONCAT22(iVar9,uVar5));
  lVar14 = N_LXRSH(lVar14,'\x04');
  iVar7 = iVar7 - (int)lVar14;
  lVar14 = N_LXMUL((long)DAT_6000_cd4e,(long)DAT_6000_43aa);
  lVar15 = N_LXMUL((long)DAT_6000_cd52,(long)(0x20 - DAT_6000_43aa));
  lVar14 = N_LXRSH(lVar15 + lVar14,'\x05');
  iVar8 = (int)lVar14;
  uVar5 = param_7;
  iVar9 = param_8;
  lVar14 = N_LXLSH((long)(0x10 - DAT_6000_43aa),'\x06');
  lVar14 = N_LXMUL((long)DAT_6000_cd56,lVar14);
  lVar14 = F_LDIV(lVar14,CONCAT22(iVar9,uVar5));
  lVar14 = N_LXRSH(lVar14,'\x04');
  iVar8 = iVar8 - (int)lVar14;
  iVar9 = param_3 << 1;
  uVar5 = param_4 << 1 | (uint)((int)param_3 < 0);
  lVar14 = N_LXMUL(CONCAT22(param_2,param_1),(long)DAT_6000_cd54);
  lVar14 = F_LDIV(lVar14,CONCAT22(uVar5,iVar9));
  iVar9 = iVar4 + (int)lVar14;
  iVar10 = param_7 << 1;
  uVar5 = param_8 << 1 | (uint)((int)param_7 < 0);
  lVar14 = N_LXMUL(CONCAT22(param_6,param_5),(long)DAT_6000_cd54);
  lVar14 = F_LDIV(lVar14,CONCAT22(uVar5,iVar10));
  iVar4 = iVar4 + (int)lVar14;
  if (iVar4 < iVar9) {
    uVar5 = param_3;
    iVar10 = param_4;
    lVar14 = N_LXLSH((long)DAT_6000_cd56,'\x06');
    lVar14 = F_LDIV(lVar14,CONCAT22(iVar10,uVar5));
    iVar11 = iVar7 - (int)lVar14;
    uVar5 = param_3;
    iVar10 = param_4;
    lVar14 = N_LXLSH((long)DAT_6000_cd56,'\x06');
    lVar14 = F_LDIV(lVar14,CONCAT22(iVar10,uVar5));
    iVar7 = iVar7 + (int)lVar14;
    uVar5 = param_7;
    iVar10 = param_8;
    lVar14 = N_LXLSH((long)DAT_6000_cd56,'\x06');
    lVar14 = F_LDIV(lVar14,CONCAT22(iVar10,uVar5));
    DAT_6000_cd58 = iVar8 - (int)lVar14;
    uVar5 = param_7;
    iVar10 = param_8;
    lVar14 = N_LXLSH((long)DAT_6000_cd56,'\x06');
    lVar14 = F_LDIV(lVar14,CONCAT22(iVar10,uVar5));
    DAT_6000_cd5a = iVar8 + (int)lVar14;
    if ((param_2 == param_6) && (param_1 == param_5)) {
      uVar5 = FUN_3000_0afa(param_3);
      lVar14 = N_LXMUL(100,CONCAT22(-(uint)(0x100 < param_3 - uVar5) -
                                    ((param_4 - ((int)uVar5 >> 0xf)) - (uint)(param_3 < uVar5)),
                                    0x100 - (param_3 - uVar5)));
      lVar14 = N_LXRSH(lVar14,'\b');
      uVar5 = FUN_3000_0afa(param_3,(int)lVar14);
      lVar14 = N_LXMUL(100,CONCAT22(-(uint)(0x100 < param_7 - uVar5) -
                                    ((param_8 - ((int)uVar5 >> 0xf)) - (uint)(param_7 < uVar5)),
                                    0x100 - (param_7 - uVar5)));
      lVar14 = N_LXRSH(lVar14,'\b');
      uVar6 = (undefined2)lVar14;
      uVar16 = 1;
      iVar8 = iVar4;
      iVar10 = iVar9;
      lVar14 = F_LDIV(CONCAT22(-(uint)(param_7 + 0x7f != 0) - (param_8 + (uint)(0xff80 < param_7)),
                               -(param_7 + 0x7f)),0x100);
      uVar17 = (undefined2)lVar14;
      lVar14 = F_LDIV(CONCAT22(param_2 + (uint)(0xfe80 < param_1),param_1 + 0x17f),0x100);
      iVar7 = FUN_3000_31f3((int)lVar14,uVar17,uVar16,iVar8,iVar11,iVar10,iVar7,uVar6);
      if (iVar7 == 0) {
        local_10 = CONCAT22(param_8,param_7);
        fVar1 = (float)local_10;
        local_10 = CONCAT22(param_6,param_5);
        fVar2 = (float)local_10;
        local_10 = CONCAT22(param_4,param_3);
        fVar3 = (float)local_10;
        local_10 = CONCAT22(param_2,param_1);
        iVar9 = FUN_3000_2796((float)local_10 / DAT_6000_45cd,fVar3 / DAT_6000_45cd,
                              fVar2 / DAT_6000_45cd,fVar1 / DAT_6000_45cd,iVar4,iVar9);
        return iVar9;
      }
      iVar8 = FUN_3000_0ace(param_7);
      uVar5 = param_7;
      iVar7 = param_8;
      iVar8 = FUN_3000_0ace(param_7,param_7,param_8,iVar8,iVar8 >> 0xf);
      lVar14 = N_LXMUL(CONCAT22(param_6,param_5),(long)iVar8);
      lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
      iVar8 = FUN_3000_0ace(param_7,lVar14);
      uVar5 = param_3;
      iVar7 = param_4;
      iVar8 = FUN_3000_0ace(param_7,param_3,param_4,iVar8,iVar8 >> 0xf);
      lVar14 = N_LXMUL(CONCAT22(param_2,param_1),(long)iVar8);
      lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
      FUN_3000_0b3b(lVar14);
    }
    else {
      uVar5 = FUN_3000_0afa(param_5);
      lVar14 = N_LXMUL(100,CONCAT22((param_2 - ((int)uVar5 >> 0xf)) - (uint)(param_1 < uVar5),
                                    param_1 - uVar5));
      lVar14 = N_LXRSH(lVar14,'\b');
      uVar5 = FUN_3000_0afa(param_5,(int)lVar14);
      lVar14 = N_LXMUL(100,CONCAT22((param_6 - ((int)uVar5 >> 0xf)) - (uint)(param_5 < uVar5),
                                    param_5 - uVar5));
      lVar14 = N_LXRSH(lVar14,'\b');
      uVar6 = (undefined2)lVar14;
      uVar17 = 0;
      iVar8 = iVar4;
      iVar10 = iVar9;
      lVar14 = F_LDIV(CONCAT22(-(uint)(param_7 != 0) - param_8,-param_7),0x100);
      iVar7 = FUN_3000_0b14(param_5 - 0x7f,(int)lVar14,uVar17,iVar8,iVar11,iVar10,iVar7,uVar6);
      iVar7 = FUN_3000_31f3(iVar7 / 0x100);
      if (iVar7 != 0) {
        uVar12 = (int)param_1 >> 0xf;
        iVar7 = FUN_3000_0ace((param_1 ^ uVar12) - uVar12);
        iVar8 = iVar7 >> 0xf;
        lVar14 = N_LXLSH(CONCAT22(param_4 + (uint)(0xfeff < param_3),param_3 + 0x100),'\b');
        lVar14 = F_LDIV(lVar14,CONCAT22(iVar8,iVar7));
        uVar5 = (int)(uint)lVar14 >> 0xf;
        iVar8 = ((uint)lVar14 ^ uVar5) - uVar5;
        uVar5 = param_1;
        iVar7 = param_2;
        lVar14 = N_LXLSH(CONCAT22(param_4,param_3),'\b');
        lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
        uVar5 = (int)(uint)lVar14 >> 0xf;
        if ((int)(((uint)lVar14 ^ uVar5) - uVar5) < iVar8) {
          iVar7 = FUN_3000_0ace((param_1 ^ uVar12) - uVar12);
          iVar8 = iVar7 >> 0xf;
          lVar14 = N_LXLSH(CONCAT22(param_4 + (uint)(0xfeff < param_3),param_3 + 0x100),'\b');
          lVar14 = F_LDIV(lVar14,CONCAT22(iVar8,iVar7));
          uVar5 = (int)(uint)lVar14 >> 0xf;
          iVar8 = ((uint)lVar14 ^ uVar5) - uVar5;
          uVar5 = param_5;
          iVar7 = param_6;
          lVar14 = N_LXLSH(CONCAT22(param_8,param_7),'\b');
          lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
          uVar5 = (int)(uint)lVar14 >> 0xf;
          if (iVar8 < (int)(((uint)lVar14 ^ uVar5) - uVar5)) {
            iVar10 = param_7 + 0x100;
            iVar8 = param_8 + (uint)(0xfeff < param_7);
            uVar5 = param_7;
            iVar7 = param_8;
            lVar14 = N_LXMUL(CONCAT22(param_6,param_5),
                             CONCAT22(param_8 + (uint)(0xfeff < param_7),param_7 + 0x100));
            lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
            iVar7 = FUN_3000_0ace(param_1,param_3 + 0x100,param_4 + (uint)(0xfeff < param_3),lVar14,
                                  iVar10,iVar8);
            FUN_3000_0b3b(iVar7,iVar7 >> 0xf);
            iVar8 = FUN_3000_0ace(param_1,param_7 + 0x100,param_8 + (uint)(0xfeff < param_7));
            uVar5 = param_1;
            iVar7 = param_2;
            iVar8 = FUN_3000_0ace(param_1,param_1,param_2,iVar8,iVar8 >> 0xf);
            lVar14 = N_LXMUL(CONCAT22(param_4,param_3),(long)iVar8);
            lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
            iVar7 = FUN_3000_0ace(param_1,lVar14);
            FUN_3000_0b3b(iVar7,iVar7 >> 0xf);
          }
          else {
            uVar5 = param_5;
            iVar7 = param_6;
            iVar8 = FUN_3000_0ace(param_1);
            lVar14 = N_LXMUL(CONCAT22(param_8,param_7),(long)iVar8);
            lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
            iVar8 = FUN_3000_0ace(param_1,lVar14);
            uVar5 = param_1;
            iVar7 = param_2;
            iVar8 = FUN_3000_0ace(param_1,param_1,param_2,iVar8,iVar8 >> 0xf);
            lVar14 = N_LXMUL(CONCAT22(param_4,param_3),(long)iVar8);
            lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
            iVar7 = FUN_3000_0ace(param_1,lVar14);
            FUN_3000_0b3b(iVar7,iVar7 >> 0xf);
          }
        }
        else {
          iVar11 = param_7 + 0x100;
          iVar8 = param_8 + (uint)(0xfeff < param_7);
          uVar5 = param_7;
          iVar7 = param_8;
          lVar14 = N_LXMUL(CONCAT22(param_6,param_5),
                           CONCAT22(param_8 + (uint)(0xfeff < param_7),param_7 + 0x100));
          lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
          iVar13 = param_3 + 0x100;
          iVar10 = param_4 + (uint)(0xfeff < param_3);
          uVar5 = param_3;
          iVar7 = param_4;
          lVar15 = N_LXMUL(CONCAT22(param_2,param_1),
                           CONCAT22(param_4 + (uint)(0xfeff < param_3),param_3 + 0x100));
          lVar15 = F_LDIV(lVar15,CONCAT22(iVar7,uVar5));
          FUN_3000_0b3b(lVar15,iVar13,iVar10,lVar14,iVar11,iVar8);
        }
      }
    }
    local_10 = CONCAT22(param_8,param_7);
    fVar1 = (float)local_10;
    local_10 = CONCAT22(param_6,param_5);
    fVar2 = (float)local_10;
    local_10 = CONCAT22(param_4,param_3);
    fVar3 = (float)local_10;
    local_10 = CONCAT22(param_2,param_1);
    iVar9 = FUN_3000_2796((float)local_10 / DAT_6000_45cd,fVar3 / DAT_6000_45cd,
                          fVar2 / DAT_6000_45cd,fVar1 / DAT_6000_45cd,iVar4,iVar9);
    return iVar9;
  }
  return (int)lVar14;
}


// ==== FUN_3000_12a2 @ 3000:12a2 (size 38) callers: FUN_3000_12ca

int __cdecl16far FUN_3000_12a2(int param_1)

{
  if ((char)param_1 == '\0') {
    return param_1;
  }
  return (param_1 + 0x4000 >> 8) * 0x100 + -0x4000;
}


// ==== FUN_3000_12ca @ 3000:12ca (size 1854) callers: FUN_3000_12ca,FUN_3000_1a08

int __cdecl16far
FUN_3000_12ca(uint param_1,int param_2,uint param_3,int param_4,uint param_5,int param_6,
             uint param_7,int param_8)

{
  float fVar1;
  float fVar2;
  float fVar3;
  int iVar4;
  uint uVar5;
  undefined2 uVar6;
  int iVar7;
  int iVar8;
  int iVar9;
  int iVar10;
  int iVar11;
  uint uVar12;
  int iVar13;
  undefined2 unaff_SI;
  undefined2 unaff_DI;
  long lVar14;
  long lVar15;
  undefined2 uVar16;
  undefined2 in_stack_0000ffe4;
  undefined2 in_stack_0000ffe6;
  undefined4 local_10;
  
  if (&stack0x0000 != (char *)s_Borland_C_____Copyright_1991_Bor_6000_0004 + 0x18 &&
      0x19 < (int)&stack0xfffe) {
    return DAT_6000_9b60;
  }
  DAT_6000_cd60 = DAT_6000_cd60 + 1;
  iVar4 = DAT_6000_cd50 + DAT_6000_cd4c >> 1;
  lVar14 = N_LXMUL((long)DAT_6000_cd4e,(long)DAT_6000_43aa);
  lVar15 = N_LXMUL((long)DAT_6000_cd52,(long)(0x20 - DAT_6000_43aa));
  lVar14 = N_LXRSH(lVar15 + lVar14,'\x05');
  iVar7 = (int)lVar14;
  uVar5 = param_3;
  iVar9 = param_4;
  lVar14 = N_LXLSH((long)(0x10 - DAT_6000_43aa),'\x06');
  lVar14 = N_LXMUL((long)DAT_6000_cd56,lVar14);
  lVar14 = F_LDIV(lVar14,CONCAT22(iVar9,uVar5));
  lVar14 = N_LXRSH(lVar14,'\x04');
  iVar7 = iVar7 - (int)lVar14;
  lVar14 = N_LXMUL((long)DAT_6000_cd4e,(long)DAT_6000_43aa);
  lVar15 = N_LXMUL((long)DAT_6000_cd52,(long)(0x20 - DAT_6000_43aa));
  lVar14 = N_LXRSH(lVar15 + lVar14,'\x05');
  iVar8 = (int)lVar14;
  uVar5 = param_7;
  iVar9 = param_8;
  lVar14 = N_LXLSH((long)(0x10 - DAT_6000_43aa),'\x06');
  lVar14 = N_LXMUL((long)DAT_6000_cd56,lVar14);
  lVar14 = F_LDIV(lVar14,CONCAT22(iVar9,uVar5));
  lVar14 = N_LXRSH(lVar14,'\x04');
  iVar8 = iVar8 - (int)lVar14;
  iVar9 = param_3 << 1;
  uVar5 = param_4 << 1 | (uint)((int)param_3 < 0);
  lVar14 = N_LXMUL(CONCAT22(param_2,param_1),(long)DAT_6000_cd54);
  lVar14 = F_LDIV(lVar14,CONCAT22(uVar5,iVar9));
  iVar9 = iVar4 + (int)lVar14;
  iVar10 = param_7 << 1;
  uVar5 = param_8 << 1 | (uint)((int)param_7 < 0);
  lVar14 = N_LXMUL(CONCAT22(param_6,param_5),(long)DAT_6000_cd54);
  lVar14 = F_LDIV(lVar14,CONCAT22(uVar5,iVar10));
  iVar4 = iVar4 + (int)lVar14;
  if (iVar9 < iVar4) {
    uVar5 = param_3;
    iVar10 = param_4;
    lVar14 = N_LXLSH((long)DAT_6000_cd56,'\x06');
    lVar14 = F_LDIV(lVar14,CONCAT22(iVar10,uVar5));
    iVar11 = iVar7 - (int)lVar14;
    uVar5 = param_3;
    iVar10 = param_4;
    lVar14 = N_LXLSH((long)DAT_6000_cd56,'\x06');
    lVar14 = F_LDIV(lVar14,CONCAT22(iVar10,uVar5));
    iVar7 = iVar7 + (int)lVar14;
    uVar5 = param_7;
    iVar10 = param_8;
    lVar14 = N_LXLSH((long)DAT_6000_cd56,'\x06');
    lVar14 = F_LDIV(lVar14,CONCAT22(iVar10,uVar5));
    DAT_6000_cd58 = iVar8 - (int)lVar14;
    uVar5 = param_7;
    iVar10 = param_8;
    lVar14 = N_LXLSH((long)DAT_6000_cd56,'\x06');
    lVar14 = F_LDIV(lVar14,CONCAT22(iVar10,uVar5));
    DAT_6000_cd5a = iVar8 + (int)lVar14;
    if ((param_2 == param_6) && (param_1 == param_5)) {
      FUN_3000_0afa(param_3);
      lVar14 = ftol((double)CONCAT26(in_stack_0000ffe6,
                                     CONCAT24(in_stack_0000ffe4,CONCAT22(unaff_SI,unaff_DI))));
      uVar6 = (undefined2)lVar14;
      FUN_3000_0afa(param_3);
      lVar14 = ftol((double)CONCAT26(in_stack_0000ffe4,CONCAT24(unaff_SI,CONCAT22(unaff_DI,uVar6))))
      ;
      uVar6 = (undefined2)lVar14;
      uVar16 = 0xffff;
      iVar8 = iVar9;
      iVar10 = iVar4;
      lVar14 = F_LDIV(CONCAT22(-(uint)(param_7 + 0x7f != 0) - (param_8 + (uint)(0xff80 < param_7)),
                               -(param_7 + 0x7f)),0x100);
      iVar7 = FUN_3000_12a2(param_1 + 0x17f,(int)lVar14,uVar16,iVar8,iVar11,iVar10,iVar7,uVar6);
      iVar7 = FUN_3000_31f3(iVar7 / 0x100);
      if (iVar7 == 0) {
        local_10 = CONCAT22(param_8,param_7);
        fVar1 = (float)local_10;
        local_10 = CONCAT22(param_6,param_5);
        fVar2 = (float)local_10;
        local_10 = CONCAT22(param_4,param_3);
        fVar3 = (float)local_10;
        local_10 = CONCAT22(param_2,param_1);
        iVar9 = FUN_3000_2796((float)local_10 / DAT_6000_45cd,fVar3 / DAT_6000_45cd,
                              fVar2 / DAT_6000_45cd,fVar1 / DAT_6000_45cd,iVar9,iVar4);
        return iVar9;
      }
      iVar8 = FUN_3000_0ace(param_7);
      uVar5 = param_7;
      iVar7 = param_8;
      iVar8 = FUN_3000_0ace(param_7,param_7,param_8,iVar8,iVar8 >> 0xf);
      lVar14 = N_LXMUL(CONCAT22(param_6,param_5),(long)iVar8);
      lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
      iVar8 = FUN_3000_0ace(param_7,lVar14);
      uVar5 = param_3;
      iVar7 = param_4;
      iVar8 = FUN_3000_0ace(param_7,param_3,param_4,iVar8,iVar8 >> 0xf);
      lVar14 = N_LXMUL(CONCAT22(param_2,param_1),(long)iVar8);
      lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
      FUN_3000_12ca(lVar14);
    }
    else {
      FUN_3000_0afa(param_1);
      lVar14 = ftol((double)CONCAT26(in_stack_0000ffe6,
                                     CONCAT24(in_stack_0000ffe4,CONCAT22(unaff_SI,unaff_DI))));
      uVar6 = (undefined2)lVar14;
      FUN_3000_0afa(param_1);
      lVar14 = ftol((double)CONCAT26(in_stack_0000ffe4,CONCAT24(unaff_SI,CONCAT22(unaff_DI,uVar6))))
      ;
      uVar6 = (undefined2)lVar14;
      uVar16 = 0;
      iVar8 = iVar9;
      iVar10 = iVar4;
      lVar14 = F_LDIV(CONCAT22(-(uint)(param_7 != 0) - param_8,-param_7),0x100);
      iVar7 = FUN_3000_12a2(param_1 + 0x81,(int)lVar14,uVar16,iVar8,iVar11,iVar10,iVar7,uVar6);
      iVar7 = FUN_3000_31f3(iVar7 / 0x100);
      if (iVar7 != 0) {
        uVar12 = (int)param_1 >> 0xf;
        iVar7 = FUN_3000_0ace((param_1 ^ uVar12) - uVar12);
        iVar8 = iVar7 >> 0xf;
        lVar14 = N_LXLSH(CONCAT22(param_4 + (uint)(0xfeff < param_3),param_3 + 0x100),'\b');
        lVar14 = F_LDIV(lVar14,CONCAT22(iVar8,iVar7));
        uVar5 = (int)(uint)lVar14 >> 0xf;
        iVar8 = ((uint)lVar14 ^ uVar5) - uVar5;
        uVar5 = param_1;
        iVar7 = param_2;
        lVar14 = N_LXLSH(CONCAT22(param_4,param_3),'\b');
        lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
        uVar5 = (int)(uint)lVar14 >> 0xf;
        if ((int)(((uint)lVar14 ^ uVar5) - uVar5) < iVar8) {
          iVar7 = FUN_3000_0ace((param_1 ^ uVar12) - uVar12);
          iVar8 = iVar7 >> 0xf;
          lVar14 = N_LXLSH(CONCAT22(param_4 + (uint)(0xfeff < param_3),param_3 + 0x100),'\b');
          lVar14 = F_LDIV(lVar14,CONCAT22(iVar8,iVar7));
          uVar5 = (int)(uint)lVar14 >> 0xf;
          iVar8 = ((uint)lVar14 ^ uVar5) - uVar5;
          uVar5 = param_5;
          iVar7 = param_6;
          lVar14 = N_LXLSH(CONCAT22(param_8,param_7),'\b');
          lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
          uVar5 = (int)(uint)lVar14 >> 0xf;
          if (iVar8 < (int)(((uint)lVar14 ^ uVar5) - uVar5)) {
            iVar10 = param_7 + 0x100;
            iVar8 = param_8 + (uint)(0xfeff < param_7);
            uVar5 = param_7;
            iVar7 = param_8;
            lVar14 = N_LXMUL(CONCAT22(param_6,param_5),
                             CONCAT22(param_8 + (uint)(0xfeff < param_7),param_7 + 0x100));
            lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
            iVar7 = FUN_3000_0afa(param_1,param_3 + 0x100,param_4 + (uint)(0xfeff < param_3),lVar14,
                                  iVar10,iVar8);
            FUN_3000_12ca(iVar7,iVar7 >> 0xf);
            iVar8 = FUN_3000_0afa(param_1,param_7 + 0x100,param_8 + (uint)(0xfeff < param_7));
            uVar5 = param_1;
            iVar7 = param_2;
            iVar8 = FUN_3000_0afa(param_1,param_1,param_2,iVar8,iVar8 >> 0xf);
            lVar14 = N_LXMUL(CONCAT22(param_4,param_3),(long)iVar8);
            lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
            iVar7 = FUN_3000_0afa(param_1,lVar14);
            FUN_3000_12ca(iVar7,iVar7 >> 0xf);
          }
          else {
            uVar5 = param_5;
            iVar7 = param_6;
            iVar8 = FUN_3000_0afa(param_1);
            lVar14 = N_LXMUL(CONCAT22(param_8,param_7),(long)iVar8);
            lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
            iVar8 = FUN_3000_0afa(param_1,lVar14);
            uVar5 = param_1;
            iVar7 = param_2;
            iVar8 = FUN_3000_0afa(param_1,param_1,param_2,iVar8,iVar8 >> 0xf);
            lVar14 = N_LXMUL(CONCAT22(param_4,param_3),(long)iVar8);
            lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
            iVar7 = FUN_3000_0afa(param_1,lVar14);
            FUN_3000_12ca(iVar7,iVar7 >> 0xf);
          }
        }
        else {
          iVar11 = param_7 + 0x100;
          iVar8 = param_8 + (uint)(0xfeff < param_7);
          uVar5 = param_7;
          iVar7 = param_8;
          lVar14 = N_LXMUL(CONCAT22(param_6,param_5),
                           CONCAT22(param_8 + (uint)(0xfeff < param_7),param_7 + 0x100));
          lVar14 = F_LDIV(lVar14,CONCAT22(iVar7,uVar5));
          iVar13 = param_3 + 0x100;
          iVar10 = param_4 + (uint)(0xfeff < param_3);
          uVar5 = param_3;
          iVar7 = param_4;
          lVar15 = N_LXMUL(CONCAT22(param_2,param_1),
                           CONCAT22(param_4 + (uint)(0xfeff < param_3),param_3 + 0x100));
          lVar15 = F_LDIV(lVar15,CONCAT22(iVar7,uVar5));
          FUN_3000_12ca(lVar15,iVar13,iVar10,lVar14,iVar11,iVar8);
        }
      }
    }
    local_10 = CONCAT22(param_8,param_7);
    fVar1 = (float)local_10;
    local_10 = CONCAT22(param_6,param_5);
    fVar2 = (float)local_10;
    local_10 = CONCAT22(param_4,param_3);
    fVar3 = (float)local_10;
    local_10 = CONCAT22(param_2,param_1);
    iVar9 = FUN_3000_2796((float)local_10 / DAT_6000_45cd,fVar3 / DAT_6000_45cd,
                          fVar2 / DAT_6000_45cd,fVar1 / DAT_6000_45cd,iVar9,iVar4);
    return iVar9;
  }
  return (int)lVar14;
}


// ==== FUN_3000_1a08 @ 3000:1a08 (size 3388) callers: FUN_2000_8b3f,FUN_2000_97b8

/* WARNING: Removing unreachable block (ram,0x0003217a) */
/* WARNING: Removing unreachable block (ram,0x00031ec6) */

undefined2 __cdecl16far
FUN_3000_1a08(int param_1,int param_2,undefined2 param_3,undefined2 param_4,int param_5,int param_6,
             int param_7,int param_8,int param_9,undefined2 param_10)

{
  byte bVar1;
  uint uVar2;
  int iVar3;
  undefined1 extraout_AH;
  undefined1 extraout_AH_00;
  int iVar4;
  int iVar5;
  uint uVar6;
  undefined2 unaff_SI;
  int iVar7;
  undefined2 unaff_DI;
  long lVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  undefined2 uVar11;
  undefined2 uVar12;
  undefined1 in_stack_0000ffd2;
  undefined1 in_stack_0000ffd3;
  int in_stack_0000ffd4;
  uint local_28;
  float local_26;
  float local_22;
  int local_1e;
  int local_1c;
  int local_1a;
  int local_18;
  uint local_16;
  uint local_14;
  float local_12;
  float local_e;
  int local_a;
  uint local_8;
  float local_6;
  
  local_e = 0.0;
  local_12 = 0.0;
  DAT_6000_43aa = DAT_6000_c12f / 5 + 6;
  if (DAT_6000_cd94 < 2) {
    DAT_6000_4394 = 0;
  }
  else {
    DAT_6000_4394 = 0xc;
  }
  DAT_6000_439a = 0xf;
  DAT_6000_439c = 0xf;
  DAT_6000_4398 = 0xd;
  DAT_6000_4396 = 0xe;
  if ((param_6 < 100) && (param_7 < 100)) {
    DAT_6000_cd72 = 0xffff;
  }
  else if (param_7 < 100) {
    DAT_6000_cd72 = 0;
  }
  else if (param_6 < 600) {
    DAT_6000_cd72 = 1;
  }
  else if (param_8 < 0x5dd) {
    DAT_6000_cd72 = 3;
  }
  else {
    DAT_6000_cd72 = 2;
  }
  if (DAT_6000_c8a2 == 0) {
    DAT_6000_4396 = 3;
  }
  uVar11 = 0;
  uVar9 = 0x4af;
  lVar8 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)param_7);
  lVar8 = F_LDIV(lVar8,CONCAT22(uVar11,uVar9));
  local_16 = (uint)lVar8;
  uVar11 = 0;
  uVar9 = 0x4af;
  lVar8 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)param_9);
  lVar8 = F_LDIV(lVar8,CONCAT22(uVar11,uVar9));
  local_18 = (int)lVar8;
  uVar11 = 0;
  uVar9 = 0x63f;
  lVar8 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)param_6);
  lVar8 = F_LDIV(lVar8,CONCAT22(uVar11,uVar9));
  local_1a = (int)lVar8;
  uVar11 = 0;
  uVar9 = 0x63f;
  lVar8 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)param_8);
  lVar8 = F_LDIV(lVar8,CONCAT22(uVar11,uVar9));
  uVar6 = CONCAT11(in_stack_0000ffd3,in_stack_0000ffd2);
  local_1c = (int)lVar8;
  local_14 = (int)(DAT_6000_43aa * local_16 + (0x20 - DAT_6000_43aa) * local_18) >> 5;
  DAT_6000_cd42 = param_1;
  DAT_6000_cd44 = param_2;
  DAT_6000_cd46 = param_3;
  DAT_6000_cd48 = param_4;
  DAT_6000_cd4a = param_5;
  DAT_6000_cd4c = param_6;
  DAT_6000_cd50 = param_8;
  DAT_6000_cd4e = param_7;
  DAT_6000_cd52 = param_9;
  DAT_6000_cd54 = param_8 - param_6;
  DAT_6000_cd56 = param_9 - param_7;
  DAT_6000_cd5c = param_10;
  local_6 = 0.0;
  do {
    if ((float)(DAT_6000_43a8 / 0x14 + 3) <= local_6) {
code_r0x000324b2:
      lVar8 = ftol((double)CONCAT26(in_stack_0000ffd4,
                                    CONCAT15((char)(uVar6 >> 8),
                                             CONCAT14((char)uVar6,CONCAT22(unaff_SI,unaff_DI)))));
      local_8 = (uint)lVar8;
      local_6 = (float)(int)local_8;
      while( true ) {
        if (local_6 <= 0.0) break;
        local_e = ((float)DAT_6000_cd54 * local_6) / (DAT_6000_45d9 * local_6 + 1.0);
        local_12 = ((float)(int)DAT_6000_cd56 * local_6) / (DAT_6000_45d9 * local_6 + 1.0);
        if (local_6 == 1.0) {
          local_22 = 0.0;
          local_26 = 1.0;
          FUN_3000_30d7(&local_22,&local_26);
          local_22 = (float)DAT_6000_c89e + local_22;
          local_26 = (float)DAT_6000_c8a0 + local_26;
          lVar8 = ftol((double)CONCAT26(in_stack_0000ffd4,
                                        CONCAT15((char)(uVar6 >> 8),
                                                 CONCAT14((char)uVar6,CONCAT22(unaff_SI,unaff_DI))))
                      );
          lVar8 = ftol((double)CONCAT17((char)(uVar6 >> 8),
                                        CONCAT16((char)uVar6,
                                                 CONCAT24(unaff_SI,CONCAT22(unaff_DI,(int)lVar8)))))
          ;
          FUN_3000_2796(DAT_6000_45ed,local_6 + DAT_6000_45e9,SUB42(DAT_6000_45e9,0),
                        (int)((ulong)DAT_6000_45e9 >> 0x10),local_6 + DAT_6000_45e9,(int)lVar8);
          lVar8 = ftol((double)CONCAT26(in_stack_0000ffd4,
                                        CONCAT15((char)(uVar6 >> 8),
                                                 CONCAT14((char)uVar6,CONCAT22(unaff_SI,unaff_DI))))
                      );
          lVar8 = ftol((double)CONCAT17((char)(uVar6 >> 8),
                                        CONCAT16((char)uVar6,
                                                 CONCAT24(unaff_SI,CONCAT22(unaff_DI,(int)lVar8)))))
          ;
          local_1e = FUN_2000_4538((int)lVar8);
          DAT_6000_43a0 = (int)*(char *)(local_1e * 0x23 + 600);
          if (local_1e != -1) {
            iVar4 = *(char *)(local_1e * 0x23 + 0x259) * 4;
            uVar9 = *(undefined2 *)(iVar4 + -0x35be);
            iVar5 = param_9 + -0xf;
            lVar8 = ftol((double)(qword)CONCAT24(*(undefined2 *)(iVar4 + -0x35bc),
                                                 CONCAT22(uVar9,iVar5)));
            lVar8 = ftol((double)CONCAT26(uVar9,CONCAT24(iVar5,CONCAT22((int)lVar8,
                                                                        param_9 + param_7 * 7 >> 3))
                                         ));
            FUN_3000_0105((int)lVar8);
          }
        }
        else {
          lVar8 = ftol((double)CONCAT26(in_stack_0000ffd4,
                                        CONCAT15((char)(uVar6 >> 8),
                                                 CONCAT14((char)uVar6,CONCAT22(unaff_SI,unaff_DI))))
                      );
          lVar8 = ftol((double)CONCAT17((char)(uVar6 >> 8),
                                        CONCAT16((char)uVar6,
                                                 CONCAT24(unaff_SI,CONCAT22(unaff_DI,(int)lVar8)))))
          ;
          FUN_3000_2796(DAT_6000_45ed,local_6 + DAT_6000_45e9,SUB42(DAT_6000_45e9,0),
                        (int)((ulong)DAT_6000_45e9 >> 0x10),local_6 + DAT_6000_45e9,(int)lVar8);
        }
        local_6 = local_6 - 1.0;
      }
      return 0;
    }
    local_e = ((float)DAT_6000_cd54 * local_6) / (DAT_6000_45d9 * local_6 + 1.0);
    local_12 = ((float)(int)DAT_6000_cd56 * local_6) / (DAT_6000_45d9 * local_6 + 1.0);
    uVar2 = DAT_6000_cd56;
    if (param_5 == 0) {
      bVar1 = wall_side(param_1,param_2,1,param_3,param_4);
      uVar2 = (uint)bVar1;
      local_28 = uVar2;
    }
    if (param_5 == 2) {
      bVar1 = wall_side(param_1,param_2,uVar2 & 0xff00,param_3,param_4);
      uVar2 = (uint)bVar1;
      local_28 = uVar2;
    }
    if (param_5 == 1) {
      bVar1 = wall_side(param_1,param_2 + 1,1,param_3,param_4);
      uVar2 = (uint)bVar1;
      local_28 = uVar2;
    }
    if (param_5 == 3) {
      bVar1 = wall_side(param_1 + 1,param_2,uVar2 & 0xff00,param_3,param_4);
      local_28 = (uint)bVar1;
    }
    if ((local_6 == 0.0) && ((local_28 == 3 || (1 < DAT_6000_4390)))) {
      DAT_6000_cd5c = 0;
      if ((DAT_6000_cd94 == 0) || (DAT_6000_4390 < 1)) {
        if ((DAT_6000_4390 == 2) || (DAT_6000_cd94 == 0)) {
          fill_rect(local_1a,local_16,local_1c,local_18,0);
        }
        else if (DAT_6000_cd94 == 1) {
          for (local_8 = local_16; (int)local_8 <= local_18; local_8 = local_8 + 1) {
            (*DAT_6000_962a)(0x1000,local_1a,local_8,local_1c,local_8,(int)local_8 % 3 & 0xff01);
          }
        }
        else {
          for (local_8 = local_16; (int)local_8 < (int)local_14; local_8 = local_8 + 1) {
            iVar4 = ((int)((local_16 - local_14) * 4) / (int)((local_8 - local_14) + -1)) / 3;
            if (DAT_6000_cd94 == 9) {
              if ((param_5 == 0) || (param_5 == 2)) {
                iVar4 = -iVar4;
              }
              iVar5 = DAT_6000_c89e;
              if (param_5 < 2) {
                iVar5 = DAT_6000_c8a0;
              }
              uVar6 = ((iVar4 + iVar5 * 3) % 0x10 + 0x30) * 0x100 + 0x30;
            }
            else {
              if (((param_5 < 2) && (DAT_6000_c8a0 % 2 == 0)) ||
                 ((1 < param_5 && (DAT_6000_c89e % 2 == 1)))) {
                iVar4 = iVar4 + 1;
              }
              if (DAT_6000_cd94 == 0) {
                uVar6 = (uint)(iVar4 % 2 == 1);
              }
              else if (iVar4 % 2 == 1) {
                uVar6 = 0x1b;
              }
              else {
                uVar6 = 0x1a;
              }
            }
            iVar4 = local_14 - local_16;
            iVar5 = iVar4 >> 0xf;
            lVar8 = N_LXMUL((long)(int)(local_14 - local_8),
                            CONCAT22(local_1c - local_1a >> 0xf,local_1c - local_1a >> 1));
            lVar8 = F_LDIV(lVar8,CONCAT22(iVar5,iVar4));
            iVar4 = (int)lVar8;
            iVar5 = iVar4 >> 0xf;
            uVar9 = 0x1000;
            local_a = iVar4;
            lVar8 = N_LXRSH(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),'\x06');
            if ((CONCAT22(iVar5,iVar4) < lVar8) ||
               ((DAT_6000_cd98 < 1 && ((DAT_6000_cd98 < 0 || (DAT_6000_cd96 < 0x172)))))) {
              (*DAT_6000_962a)(0x1000,local_1a,local_8,local_1c,local_8,uVar6 & 0xff);
            }
            else {
              iVar5 = local_1a + local_1c >> 1;
              iVar4 = local_a >> 1;
              if (DAT_6000_cd94 == 9) {
                uVar9 = 0x2000;
                FUN_2000_0ad7(iVar5 - iVar4,local_8,iVar4 * 2,uVar6);
              }
              else {
                (*DAT_6000_962a)(0x1000,iVar5 - iVar4,local_8,iVar5 + iVar4,local_8,
                                 CONCAT11((char)(local_a >> 9),(char)uVar6));
              }
              do {
                if (DAT_6000_cd94 == 9) {
                  if (DAT_6000_c8a2 == 0) {
                    uVar6 = (uVar6 - 0x1f & 0x3f1f) + 0x20;
                  }
                  else if (DAT_6000_c8a2 == 1) {
                    uVar6 = (uVar6 - 0x2f & 0x3f0f) + 0x30;
                  }
                  else {
                    uVar6 = (uVar6 - 0xf & 0x3f2f) + 0x10;
                  }
                }
                else if (uVar6 == 0x1b) {
                  uVar6 = 0x1a;
                }
                else {
                  uVar6 = 0x1b;
                }
                iVar3 = iVar5 - (iVar4 + local_a);
                iVar7 = iVar4 + local_a;
                if (iVar3 <= local_1a) {
                  iVar3 = (iVar5 - local_1a) + -1;
                  iVar7 = iVar3;
                }
                if (DAT_6000_cd94 == 9) {
                  FUN_2000_0ad7(iVar5 + iVar4,local_8,iVar7 - iVar4,uVar6);
                  uVar9 = 0x2000;
                  FUN_2000_0ad7(iVar5 - iVar7,local_8,iVar7 - iVar4,uVar6);
                  in_stack_0000ffd4 = iVar4;
                }
                else {
                  (*DAT_6000_962a)(uVar9,iVar5 + iVar4,local_8,iVar5 + iVar7,local_8,
                                   CONCAT11((char)((uint)iVar3 >> 8),(char)uVar6));
                  (*DAT_6000_962a)(uVar9,iVar5 - iVar7,local_8,iVar5 - iVar4,local_8,
                                   CONCAT11(extraout_AH,(char)uVar6));
                  in_stack_0000ffd4 = iVar4;
                }
                iVar4 = iVar7;
              } while ((iVar5 - local_1a) + -1 != iVar7);
            }
          }
          for (local_8 = local_14; (int)local_8 <= local_18; local_8 = local_8 + 1) {
            iVar4 = ((int)((local_18 - local_14) * 4) / (int)((local_8 - local_14) + 1)) / 3;
            if (DAT_6000_cd94 == 9) {
              if ((param_5 == 0) || (param_5 == 2)) {
                iVar4 = -iVar4;
              }
              iVar5 = DAT_6000_c89e;
              if (param_5 < 2) {
                iVar5 = DAT_6000_c8a0;
              }
              uVar6 = ((iVar4 + iVar5 * 3) % 0x10 + 0x30) * 0x100 + 0x30;
            }
            else {
              if (((param_5 < 2) && (DAT_6000_c8a0 % 2 == 0)) ||
                 ((1 < param_5 && (DAT_6000_c89e % 2 == 1)))) {
                iVar4 = iVar4 + 1;
              }
              if (DAT_6000_cd94 == 0) {
                uVar6 = (uint)(iVar4 % 2 == 1);
              }
              else if (iVar4 % 2 == 1) {
                uVar6 = 0x1b;
              }
              else {
                uVar6 = 0x1a;
              }
            }
            iVar4 = local_18 - local_14;
            iVar5 = iVar4 >> 0xf;
            lVar8 = N_LXMUL((long)(int)(local_8 - local_14),
                            CONCAT22(local_1c - local_1a >> 0xf,local_1c - local_1a >> 1));
            lVar8 = F_LDIV(lVar8,CONCAT22(iVar5,iVar4));
            iVar4 = (int)lVar8;
            iVar5 = iVar4 >> 0xf;
            uVar9 = 0x1000;
            local_a = iVar4;
            lVar8 = N_LXRSH(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),'\x06');
            if ((CONCAT22(iVar5,iVar4) < lVar8) ||
               ((DAT_6000_cd98 < 1 && ((DAT_6000_cd98 < 0 || (DAT_6000_cd96 < 0x172)))))) {
              (*DAT_6000_962a)(0x1000,local_1a,local_8,local_1c,local_8,uVar6 & 0xff);
            }
            else {
              iVar5 = local_1a + local_1c >> 1;
              iVar4 = local_a >> 1;
              if (DAT_6000_cd94 == 9) {
                uVar9 = 0x2000;
                FUN_2000_0ad7(iVar5 - iVar4,local_8,iVar4 * 2,uVar6);
              }
              else {
                (*DAT_6000_962a)(0x1000,iVar5 - iVar4,local_8,iVar5 + iVar4,local_8,
                                 CONCAT11((char)(local_a >> 9),(char)uVar6));
              }
              do {
                if (DAT_6000_cd94 == 9) {
                  if (DAT_6000_c8a2 == 0) {
                    uVar6 = (uVar6 - 0x1f & 0x3f1f) + 0x20;
                  }
                  else if (DAT_6000_c8a2 == 1) {
                    uVar6 = (uVar6 - 0xf & 0x3f0f) + 0x10;
                  }
                  else {
                    uVar6 = (uVar6 - 0x2f & 0x3f2f) + 0x30;
                  }
                }
                else if (uVar6 == 0x1b) {
                  uVar6 = 0x1a;
                }
                else {
                  uVar6 = 0x1b;
                }
                iVar3 = iVar5 - (iVar4 + local_a);
                iVar7 = iVar4 + local_a;
                if (iVar3 <= local_1a) {
                  iVar3 = (iVar5 - local_1a) + -1;
                  iVar7 = iVar3;
                }
                if (DAT_6000_cd94 == 9) {
                  FUN_2000_0ad7(iVar5 + iVar4,local_8,iVar7 - iVar4,uVar6);
                  uVar9 = 0x2000;
                  FUN_2000_0ad7(iVar5 - iVar7,local_8,iVar7 - iVar4,uVar6);
                  in_stack_0000ffd4 = iVar4;
                }
                else {
                  (*DAT_6000_962a)(uVar9,iVar5 + iVar4,local_8,iVar5 + iVar7,local_8,
                                   CONCAT11((char)((uint)iVar3 >> 8),(char)uVar6));
                  (*DAT_6000_962a)(uVar9,iVar5 - iVar7,local_8,iVar5 - iVar4,local_8,
                                   CONCAT11(extraout_AH_00,(char)uVar6));
                  in_stack_0000ffd4 = iVar4;
                }
                iVar4 = iVar7;
              } while ((iVar5 - local_1a) + -1 != iVar7);
            }
          }
        }
      }
      else if (DAT_6000_4390 == 1) {
        for (local_8 = local_16; (int)local_8 <= local_18; local_8 = local_8 + 1) {
          (*DAT_6000_962a)(0x1000,local_1a,local_8,local_1c,local_8,local_8 & 0xff00);
        }
      }
      else {
        for (local_8 = local_16; (int)local_8 <= local_18; local_8 = local_8 + 1) {
          (*DAT_6000_962a)(0x1000,local_1a,local_8,local_1c,local_8,local_8 & 0xff01);
        }
      }
    }
    if (local_6 == 0.0) {
      DAT_6000_43a6 = 1;
    }
    if (DAT_6000_43ac == 1) {
      return 0xffff;
    }
    uVar12 = 99;
    uVar10 = 0;
    lVar8 = ftol((double)CONCAT26(unaff_SI,CONCAT24(unaff_DI,0x630000)));
    uVar9 = (undefined2)lVar8;
    lVar8 = ftol((double)CONCAT26(unaff_DI,CONCAT24(uVar12,CONCAT22(uVar10,uVar9))));
    uVar11 = (undefined2)lVar8;
    lVar8 = ftol((double)CONCAT26(uVar12,CONCAT24(uVar10,CONCAT22(uVar9,uVar11))));
    uVar12 = (undefined2)lVar8;
    lVar8 = ftol((double)CONCAT26(uVar10,CONCAT24(uVar9,CONCAT22(uVar11,uVar12))));
    ftol((double)((qword)CONCAT24(uVar11,CONCAT22(uVar12,(int)lVar8)) << 0x10));
    iVar4 = FUN_3000_31f3();
    if (iVar4 == 0) {
      if (local_6 == 0.0) {
        return 0xffff;
      }
      goto code_r0x000324b2;
    }
    DAT_6000_43a6 = 0;
    DAT_6000_cd60 = 0;
    lVar8 = ftol((double)CONCAT26(in_stack_0000ffd4,
                                  CONCAT15((char)(uVar6 >> 8),
                                           CONCAT14((char)uVar6,CONCAT22(unaff_SI,unaff_DI)))));
    lVar8 = ftol((double)CONCAT26((int)((ulong)lVar8 >> 0x10),CONCAT24((int)lVar8,0xffffff80)));
    FUN_3000_12ca(0xff80,0xffff,lVar8);
    DAT_6000_cd60 = 0;
    lVar8 = ftol((double)CONCAT26(in_stack_0000ffd4,
                                  CONCAT15((char)(uVar6 >> 8),
                                           CONCAT14((char)uVar6,CONCAT22(unaff_SI,unaff_DI)))));
    lVar8 = ftol((double)CONCAT26((int)((ulong)lVar8 >> 0x10),CONCAT24((int)lVar8,0x80)));
    FUN_3000_0b3b(0x80,0,lVar8);
    local_6 = local_6 + 1.0;
  } while( true );
}


// ==== FUN_3000_274a @ 3000:274a (size 36) callers: FUN_3000_2796

void __cdecl16far FUN_3000_274a(float param_1)

{
  FUN_1000_1141((double)(param_1 - DAT_6000_45e9));
  return;
}


// ==== FUN_3000_2770 @ 3000:2770 (size 36) callers: FUN_3000_2796

void __cdecl16far FUN_3000_2770(float param_1)

{
  FUN_1000_0ea4((double)(param_1 - DAT_6000_45e9));
  return;
}


// ==== FUN_3000_2796 @ 3000:2796 (size 2366) callers: FUN_3000_0b3b,FUN_3000_12ca,FUN_3000_1a08

void __cdecl16far
FUN_3000_2796(float param_1,float param_2,float param_3,float param_4,undefined2 param_5,
             undefined2 param_6)

{
  int iVar1;
  undefined2 uVar2;
  undefined2 uVar3;
  undefined2 unaff_SI;
  undefined2 unaff_DI;
  bool bVar4;
  longdouble in_ST0;
  longdouble lVar5;
  longdouble in_ST1;
  longdouble in_ST2;
  long lVar6;
  long lVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  undefined2 in_stack_0000ffc4;
  undefined2 uVar10;
  undefined2 in_stack_0000ffc6;
  undefined2 uVar11;
  undefined6 uStack_38;
  int local_2e;
  float local_2c;
  float local_28;
  undefined2 local_24;
  int local_22;
  int local_20;
  float local_1e;
  float local_1a;
  float local_16;
  float local_12;
  float local_e;
  float local_a;
  float local_6;
  
  bVar4 = 0xfffe < DAT_6000_43ae;
  DAT_6000_43ae = DAT_6000_43ae + 1;
  DAT_6000_43b0 = DAT_6000_43b0 + (uint)bVar4;
  local_28 = (param_1 + param_3) / DAT_6000_45d9;
  local_2c = (param_2 + param_4) / DAT_6000_45d9;
  FUN_3000_30d7(&local_28,&local_2c);
  local_28 = (float)DAT_6000_c89e + local_28;
  local_2c = (float)DAT_6000_c8a0 + local_2c;
  if (((param_3 == DAT_6000_45e9) && (param_1 == DAT_6000_45e9)) ||
     ((param_3 == (float)DAT_6000_45f5 && (param_1 == (float)DAT_6000_45f5)))) {
    return;
  }
  local_1e = 0.15;
  uVar8 = SUB42(param_4,0);
  uVar9 = (undefined2)((ulong)param_4 >> 0x10);
  if ((0.0 <= param_1) || (param_3 <= 0.0)) {
    if (param_1 == param_3) {
      if (param_1 < 0.0) {
        lVar5 = (longdouble)param_1 * (longdouble)DAT_6000_45e9;
        uVar10 = SUB102(lVar5,0);
        uVar11 = (undefined2)((unkuint10)lVar5 >> 0x10);
        uStack_38 = (undefined6)((unkuint10)lVar5 >> 0x20);
        FUN_3000_2770(SUB42(param_2,0),(int)((ulong)param_2 >> 0x10));
        local_6 = (float)((longdouble)CONCAT64(uStack_38,CONCAT22(uVar11,uVar10)) / in_ST0);
        lVar5 = ((longdouble)1 + (longdouble)param_1) * (longdouble)DAT_6000_45e9;
        in_stack_0000ffc4 = SUB102(lVar5,0);
        in_stack_0000ffc6 = (undefined2)((unkuint10)lVar5 >> 0x10);
        uStack_38 = (undefined6)((unkuint10)lVar5 >> 0x20);
        FUN_3000_274a(uVar8,uVar9);
        in_ST1 = (longdouble)CONCAT64(uStack_38,CONCAT22(in_stack_0000ffc6,in_stack_0000ffc4)) /
                 in_ST1;
        local_e = (param_1 * DAT_6000_45e9) / param_2;
        local_12 = (param_3 * DAT_6000_45e9) / param_4;
      }
      else {
        lVar5 = ((longdouble)param_3 - (longdouble)1) * (longdouble)DAT_6000_45e9;
        uVar10 = SUB102(lVar5,0);
        uVar11 = (undefined2)((unkuint10)lVar5 >> 0x10);
        uStack_38 = (undefined6)((unkuint10)lVar5 >> 0x20);
        FUN_3000_274a(uVar8,uVar9);
        local_6 = (float)((longdouble)CONCAT64(uStack_38,CONCAT22(uVar11,uVar10)) / in_ST0);
        lVar5 = (longdouble)param_1 * (longdouble)DAT_6000_45e9;
        in_stack_0000ffc4 = SUB102(lVar5,0);
        in_stack_0000ffc6 = (undefined2)((unkuint10)lVar5 >> 0x10);
        uStack_38 = (undefined6)((unkuint10)lVar5 >> 0x20);
        FUN_3000_2770(param_2 + DAT_6000_45e9);
        in_ST1 = (longdouble)CONCAT64(uStack_38,CONCAT22(in_stack_0000ffc6,in_stack_0000ffc4)) /
                 in_ST1;
        local_e = (param_3 * DAT_6000_45e9) / param_4;
        local_12 = (param_1 * DAT_6000_45e9) / param_2;
      }
      local_a = (float)in_ST1;
    }
    else {
      uVar10 = SUB42(param_1,0);
      uVar2 = (undefined2)((ulong)param_1 >> 0x10);
      uVar11 = (undefined2)((ulong)param_3 >> 0x10);
      if (param_1 < 0.0) {
        FUN_3000_2770(uVar10,uVar2);
        if (-(longdouble)param_4 == in_ST0) {
          FUN_3000_2770(param_1 - 1.0);
          lVar5 = (in_ST1 * (longdouble)DAT_6000_45e9) / (longdouble)param_4;
        }
        else {
          FUN_3000_2770(uVar10,uVar2);
          lVar5 = (in_ST1 * (longdouble)DAT_6000_45e9) / ((longdouble)param_2 - (longdouble)1);
        }
        local_6 = (float)lVar5;
        FUN_3000_274a(SUB42(param_3,0),uVar11);
        local_a = (float)((in_ST2 * (longdouble)DAT_6000_45e9) / (longdouble)param_2);
        local_e = (param_1 * DAT_6000_45e9) / param_2;
        local_12 = (param_3 * DAT_6000_45e9) / param_4;
      }
      else {
        FUN_3000_2770(SUB42(param_3,0),uVar11);
        local_6 = (float)((in_ST0 * (longdouble)DAT_6000_45e9) / (longdouble)param_2);
        FUN_3000_274a(uVar10,uVar2);
        if (in_ST1 == (longdouble)param_4) {
          FUN_3000_274a(param_1 + 1.0);
          lVar5 = (in_ST2 * (longdouble)DAT_6000_45e9) / (longdouble)param_4;
        }
        else {
          FUN_3000_274a(uVar10,uVar2);
          lVar5 = (in_ST2 * (longdouble)DAT_6000_45e9) / ((longdouble)param_2 - (longdouble)1);
        }
        local_a = (float)lVar5;
        local_e = (param_3 * DAT_6000_45e9) / param_4;
        local_12 = (param_1 * DAT_6000_45e9) / param_2;
      }
    }
    local_6 = (local_a - local_6) * local_1e + local_6;
    local_a = local_a - (local_a - local_6) * local_1e;
    if (0.0 < param_1) {
      local_a = local_a - (local_a - local_6) * (float)DAT_6000_45fd;
    }
    if (param_3 < 0.0) {
      local_6 = (local_a - local_6) * (float)DAT_6000_45fd + local_6;
    }
    if (local_a == local_6) {
      return;
    }
    local_e = (local_e - local_6) / (local_a - local_6);
    local_12 = (local_12 - local_6) / (local_a - local_6);
  }
  else {
    local_e = 0.0;
    local_12 = 1.0;
  }
  if ((local_e < 0.0) || (1.0 < local_12)) {
    if ((1.0 < local_e) || (local_12 < 0.0)) {
      return;
    }
    if (0.0 <= local_e) {
      local_16 = local_e;
      local_1a = 1.0;
      lVar6 = ftol((double)CONCAT26(in_stack_0000ffc6,
                                    CONCAT24(in_stack_0000ffc4,CONCAT22(unaff_SI,unaff_DI))));
      param_6 = (undefined2)lVar6;
    }
    else {
      local_16 = 0.0;
      local_1a = local_12;
      lVar6 = ftol((double)CONCAT26(in_stack_0000ffc6,
                                    CONCAT24(in_stack_0000ffc4,CONCAT22(unaff_SI,unaff_DI))));
      param_5 = (undefined2)lVar6;
    }
  }
  else {
    local_16 = local_e;
    local_1a = local_12;
  }
  lVar6 = N_LXMUL((long)DAT_6000_cd4e,(long)DAT_6000_43aa);
  lVar7 = N_LXMUL((long)DAT_6000_cd52,(long)(0x20 - DAT_6000_43aa));
  lVar6 = N_LXRSH(lVar7 + lVar6,'\x05');
  local_24 = (undefined2)lVar6;
  lVar6 = N_LXMUL((long)DAT_6000_cd56,(long)(0x20 - DAT_6000_43aa));
  uVar10 = SUB102((longdouble)lVar6,0);
  uVar11 = (undefined2)((unkuint10)(longdouble)lVar6 >> 0x10);
  FUN_3000_274a(uVar8,uVar9);
  lVar6 = ftol((double)CONCAT26(uVar11,CONCAT24(uVar10,CONCAT22(unaff_SI,unaff_DI))));
  local_20 = (int)lVar6;
  lVar6 = N_LXMUL((long)DAT_6000_cd56,(long)DAT_6000_43aa);
  uVar10 = SUB102((longdouble)lVar6,0);
  uVar11 = (undefined2)((unkuint10)(longdouble)lVar6 >> 0x10);
  FUN_3000_274a(uVar8,uVar9);
  lVar6 = ftol((double)CONCAT26(uVar11,CONCAT24(uVar10,CONCAT22(unaff_SI,unaff_DI))));
  local_22 = (int)lVar6;
  lVar6 = ftol((double)CONCAT26(uVar11,CONCAT24(uVar10,CONCAT22(unaff_SI,unaff_DI))));
  lVar6 = ftol((double)CONCAT26(uVar10,CONCAT24(unaff_SI,CONCAT22(unaff_DI,(int)lVar6))));
  iVar1 = FUN_2000_4538((int)lVar6);
  if ((iVar1 != -1) && ((param_1 != (float)DAT_6000_45f5 || (param_2 != DAT_6000_4611)))) {
    DAT_6000_43a0 = (int)*(char *)(iVar1 * 0x23 + 600);
    lVar6 = ftol((double)CONCAT26(uVar11,CONCAT24(uVar10,CONCAT22(unaff_SI,unaff_DI))));
    lVar6 = ftol((double)CONCAT26(uVar10,CONCAT24(unaff_SI,CONCAT22(unaff_DI,(int)lVar6))));
    iVar1 = *(char *)(iVar1 * 0x23 + 0x259) * 4;
    FUN_3000_0105(param_5,local_20,param_6,local_22,*(undefined2 *)(iVar1 + -0x35be),
                  *(undefined2 *)(iVar1 + -0x35bc),(int)lVar6);
  }
  lVar6 = ftol((double)CONCAT26(uVar11,CONCAT24(uVar10,CONCAT22(unaff_SI,unaff_DI))));
  lVar6 = ftol((double)CONCAT26(uVar10,CONCAT24(unaff_SI,CONCAT22(unaff_DI,(int)lVar6))));
  iVar1 = FUN_2000_5196((int)lVar6);
  if (iVar1 == 0) {
    lVar6 = ftol((double)CONCAT26(uVar11,CONCAT24(uVar10,CONCAT22(unaff_SI,unaff_DI))));
    lVar6 = ftol((double)CONCAT26(uVar10,CONCAT24(unaff_SI,CONCAT22(unaff_DI,(int)lVar6))));
    FUN_2000_5263((int)lVar6);
    if (DAT_6000_11a1 == 0) {
      lVar6 = ftol((double)CONCAT26(uVar11,CONCAT24(uVar10,CONCAT22(unaff_SI,unaff_DI))));
      uVar2 = (undefined2)lVar6;
      lVar6 = ftol((double)CONCAT26(uVar10,CONCAT24(unaff_SI,CONCAT22(unaff_DI,uVar2))));
      uVar3 = (undefined2)lVar6;
      uVar8 = DAT_6000_cd46;
      uVar9 = DAT_6000_cd48;
      lVar6 = ftol((double)CONCAT26(uVar2,CONCAT24(uVar3,CONCAT22(DAT_6000_cd48,DAT_6000_cd46))));
      lVar6 = ftol((double)CONCAT26(uVar3,CONCAT24(uVar9,CONCAT22(uVar8,(int)lVar6))));
      draw_map_square((int)lVar6);
    }
  }
  if (local_16 != local_1a) {
    DAT_6000_43a2 = 0;
    uVar8 = DAT_6000_cd46;
    uVar9 = DAT_6000_cd48;
    lVar6 = ftol((double)CONCAT26(unaff_SI,CONCAT24(unaff_DI,CONCAT22(DAT_6000_cd48,DAT_6000_cd46)))
                );
    lVar6 = ftol((double)CONCAT26(unaff_DI,CONCAT24(uVar9,CONCAT22(uVar8,(int)lVar6))));
    local_2e = ladder_delta((int)lVar6);
    if (0 < local_2e) {
      lVar6 = ftol((double)CONCAT26(uVar11,CONCAT24(uVar10,CONCAT22(unaff_SI,unaff_DI))));
      lVar6 = ftol((double)CONCAT26(uVar10,CONCAT24(unaff_SI,CONCAT22(unaff_DI,(int)lVar6))));
      FUN_3000_0105(param_5,(local_20 + local_22 * 2) / 3,param_6,local_22,DAT_6000_ca3e,
                    DAT_6000_ca40,(int)lVar6);
    }
    if (DAT_6000_c8a2 == 0) {
      lVar6 = ftol((double)CONCAT26(uVar11,CONCAT24(uVar10,CONCAT22(unaff_SI,unaff_DI))));
      lVar6 = ftol((double)CONCAT26(uVar10,CONCAT24(unaff_SI,CONCAT22(unaff_DI,(int)lVar6))));
      local_2e = surface_feature((int)lVar6);
      local_2e = -local_2e;
    }
    if (local_2e < 0) {
      lVar6 = ftol((double)CONCAT26(uVar11,CONCAT24(uVar10,CONCAT22(unaff_SI,unaff_DI))));
      lVar6 = ftol((double)CONCAT26(uVar10,CONCAT24(unaff_SI,CONCAT22(unaff_DI,(int)lVar6))));
      FUN_3000_0105(param_5,local_20,param_6,(local_20 * 2 + local_22) / 3,DAT_6000_ca3a,
                    DAT_6000_ca3c,(int)lVar6);
    }
  }
  return;
}


// ==== FUN_3000_30d7 @ 3000:30d7 (size 284) callers: FUN_3000_1a08,FUN_3000_2796

void __cdecl16far FUN_3000_30d7(float *param_1,float *param_2)

{
  float fVar1;
  undefined2 unaff_SI;
  undefined2 unaff_DI;
  uint uVar2;
  longdouble in_ST0;
  longdouble in_ST1;
  long lVar3;
  int in_stack_0000fffc;
  
  *param_2 = *param_2 + (float)DAT_6000_4619;
  FUN_1000_0ea4((double)*param_2);
  *param_2 = (float)in_ST0;
  fVar1 = *param_1;
  uVar2 = (uint)(0.0 < fVar1) << 8 | (uint)NAN(fVar1) << 10 | (uint)(fVar1 == 0.0) << 0xe;
  if (0.0 < fVar1) {
    *param_1 = *param_1 + (float)DAT_6000_4619;
    FUN_1000_0ea4((double)*param_1);
    *param_1 = (float)in_ST1;
  }
  else {
    *param_1 = *param_1 - (float)DAT_6000_4619;
    FUN_1000_1141((double)*param_1);
    *param_1 = (float)in_ST1;
  }
  if (DAT_6000_cd4a == 0) {
    *param_2 = -*param_2;
    return;
  }
  if (DAT_6000_cd4a == 1) {
    *param_1 = -*param_1;
    return;
  }
  if (DAT_6000_cd4a == 2) {
    lVar3 = ftol((double)CONCAT26(in_stack_0000fffc,CONCAT24(uVar2,CONCAT22(unaff_SI,unaff_DI))));
    in_stack_0000fffc = (int)lVar3;
    *param_2 = -*param_1;
    uVar2 = -in_stack_0000fffc;
    *param_1 = (float)(int)uVar2;
  }
  if (DAT_6000_cd4a == 3) {
    lVar3 = ftol((double)CONCAT26(in_stack_0000fffc,CONCAT24(uVar2,CONCAT22(unaff_SI,unaff_DI))));
    *param_2 = *param_1;
    *param_1 = (float)(int)lVar3;
  }
  return;
}


// ==== FUN_3000_31f3 @ 3000:31f3 (size 4667) callers: FUN_3000_0b3b,FUN_3000_12ca,FUN_3000_1a08

undefined2 __cdecl16far
FUN_3000_31f3(int param_1,int param_2,int param_3,int param_4,int param_5,int param_6,int param_7,
             int param_8,int param_9)

{
  char cVar1;
  int iVar2;
  uint uVar3;
  int iVar4;
  int iVar5;
  uint uVar6;
  uint uVar7;
  undefined1 extraout_AH;
  undefined1 extraout_AH_00;
  undefined1 extraout_AH_01;
  undefined1 extraout_AH_02;
  int iVar8;
  undefined1 extraout_AH_03;
  undefined1 extraout_AH_04;
  undefined1 extraout_AH_05;
  undefined1 extraout_AH_06;
  undefined1 extraout_AH_07;
  int iVar9;
  int iVar10;
  int iVar11;
  int iVar12;
  int iVar13;
  int iVar14;
  int iVar15;
  int iVar16;
  int iVar17;
  undefined2 unaff_SI;
  undefined2 unaff_DI;
  undefined1 uVar18;
  char cVar19;
  char cVar20;
  uint in_FPUStatusWord;
  long lVar21;
  long lVar22;
  long lVar23;
  long lVar24;
  undefined2 uVar25;
  undefined2 uVar26;
  uint in_stack_0000ffc6;
  int local_36;
  uint local_22;
  uint local_20;
  int local_16;
  int local_14;
  int local_12;
  int local_10;
  int local_e;
  uint local_c;
  int local_6;
  
  local_c = (uint)(param_3 == 0);
  if (DAT_6000_cd4a == 1) {
    if (param_3 == 0) {
      param_2 = 1 - param_2;
      param_1 = -param_1;
    }
    else {
      param_2 = -param_2;
      param_1 = 1 - param_1;
    }
  }
  iVar2 = param_1;
  if (DAT_6000_cd4a == 2) {
    local_c = (local_c + 1) % 2;
    if (param_3 == 0) {
      param_1 = param_2;
      param_2 = -iVar2;
    }
    else {
      param_1 = param_2;
      param_2 = 1 - iVar2;
    }
  }
  if (DAT_6000_cd4a == 3) {
    local_c = (local_c + 1) % 2;
    if (param_3 == 0) {
      iVar2 = 1 - param_2;
      param_2 = param_1;
      param_1 = iVar2;
    }
    else {
      iVar2 = -param_2;
      param_2 = param_1;
      param_1 = iVar2;
    }
  }
  cVar1 = wall_side(DAT_6000_cd42 + param_1,DAT_6000_cd44 + param_2,local_c,DAT_6000_cd46,
                        DAT_6000_cd48);
  if ((cVar1 == '\0') &&
     (((DAT_6000_cd42 + param_1) * (DAT_6000_cd44 + param_2) + DAT_6000_c8a2 * DAT_6000_c8a4) % 0x80
      == 1)) {
    cVar1 = '\x04';
  }
  if (cVar1 == '\x03') {
    return 1;
  }
  if (DAT_6000_cd46 % 10 < 5) {
    local_36 = (DAT_6000_cd42 + param_1 + DAT_6000_cd44 + param_2) / 3 + DAT_6000_cd46 * 0x3d + 5;
  }
  else if (DAT_6000_cd46 % 10 < 6) {
    local_36 = (DAT_6000_cd42 + param_1 + 0x43) / 5 + (DAT_6000_cd44 + param_2 + 0x2f) / 5 +
               DAT_6000_cd46 * 0x3d;
  }
  else if (DAT_6000_cd46 % 10 < 8) {
    local_36 = (DAT_6000_cd42 + param_1 + 0x15) / 4 + (DAT_6000_cd44 + param_2 + 0x25) / 4 +
               DAT_6000_cd46 * 0x3d;
  }
  else {
    local_36 = DAT_6000_cd42 + param_1 + DAT_6000_cd44 + param_2 + DAT_6000_cd46 + 0x3a;
  }
  if (1 < DAT_6000_cd94) {
    if ((local_36 * 0x11) % 0xd < 4) {
      in_stack_0000ffc6 = local_36 * 0x115;
      DAT_6000_4394 =
           (int)((in_stack_0000ffc6 ^ (int)in_stack_0000ffc6 >> 0xf) -
                ((int)in_stack_0000ffc6 >> 0xf)) % 0xb + 0x10;
    }
    else {
      DAT_6000_4394 = 0xd;
    }
  }
  iVar2 = (local_36 / 3) % 5;
  local_6 = param_9;
  if (param_9 == 0) {
    local_6 = 99;
  }
  uVar26 = 0;
  uVar25 = 0x640;
  lVar21 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)param_4);
  lVar21 = F_LDIV(lVar21,CONCAT22(uVar26,uVar25));
  uVar3 = (uint)lVar21;
  uVar26 = 0;
  uVar25 = 0x640;
  lVar21 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)param_6);
  F_LDIV(lVar21,CONCAT22(uVar26,uVar25));
  uVar26 = 0;
  uVar25 = 0x4b0;
  lVar21 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)param_5);
  lVar21 = F_LDIV(lVar21,CONCAT22(uVar26,uVar25));
  iVar4 = (int)lVar21;
  uVar26 = 0;
  uVar25 = 0x4b0;
  lVar21 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)param_7);
  lVar21 = F_LDIV(lVar21,CONCAT22(uVar26,uVar25));
  iVar5 = (int)lVar21;
  uVar26 = 0;
  uVar25 = 0x4b0;
  lVar21 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)DAT_6000_cd58);
  lVar21 = F_LDIV(lVar21,CONCAT22(uVar26,uVar25));
  DAT_6000_cd58 = (int)lVar21;
  cVar20 = '\0';
  cVar19 = '\0';
  uVar18 = 1;
  uVar26 = 0;
  uVar25 = 0x4b0;
  lVar21 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)DAT_6000_cd5a);
  lVar21 = F_LDIV(lVar21,CONCAT22(uVar26,uVar25));
  DAT_6000_9b5a = (undefined2)lVar21;
  if (!(bool)uVar18 && cVar20 == cVar19) {
    if (param_3 == 1) {
      local_10 = DAT_6000_cd58;
      local_14 = DAT_6000_cd5a;
      local_16 = iVar5;
      local_12 = iVar4;
    }
    if (param_3 == 0) {
      local_16 = iVar5;
      local_14 = iVar5;
      local_12 = iVar4;
      local_10 = iVar4;
    }
    if (param_3 == -1) {
      local_12 = DAT_6000_cd58;
      local_16 = DAT_6000_cd5a;
      local_14 = iVar5;
      local_10 = iVar4;
    }
    if (param_8 != local_6) {
      if (DAT_6000_4390 == 0) {
        DAT_6000_43a0 = 0xc;
        if (cVar1 == '\x01') {
          FUN_3000_04d3(uVar3,in_FPUStatusWord,local_10,local_12,local_14,local_16,DAT_6000_ca32,
                        DAT_6000_ca34,param_8 << 1,local_6 << 1);
        }
        else {
          FUN_3000_04d3(uVar3,in_FPUStatusWord,local_10,local_12,local_14,local_16,DAT_6000_ca36,
                        DAT_6000_ca38,param_8 << 2,local_6 << 2);
        }
      }
      else {
        if (DAT_6000_cd94 == 0) {
          if (DAT_6000_4390 < 2) {
            iVar8 = local_10;
            if (local_16 - local_12 < local_14 - local_10) {
              if (local_12 != local_10) {
                for (; iVar8 <= local_12; iVar8 = iVar8 + 1) {
                  iVar11 = iVar8 % 2;
                  iVar10 = local_12 - local_10;
                  iVar12 = iVar10 >> 0xf;
                  iVar9 = iVar8;
                  lVar21 = N_LXMUL((long)(int)(in_FPUStatusWord - uVar3),(long)(iVar8 - local_10));
                  lVar21 = F_LDIV(lVar21,CONCAT22(iVar12,iVar10));
                  (*DAT_6000_962a)(0x1000,uVar3,iVar8,uVar3 + (int)lVar21,iVar9,iVar11);
                }
              }
              iVar8 = local_12;
              iVar9 = local_16;
              if (local_14 != local_16) {
                for (; iVar9 <= local_14; iVar9 = iVar9 + 1) {
                  iVar12 = iVar9 % 2;
                  iVar11 = local_14 - local_16;
                  iVar13 = iVar11 >> 0xf;
                  iVar10 = iVar9;
                  lVar21 = N_LXMUL((long)(int)(in_FPUStatusWord - uVar3),(long)(local_14 - iVar9));
                  lVar21 = F_LDIV(lVar21,CONCAT22(iVar13,iVar11));
                  (*DAT_6000_962a)(0x1000,uVar3,iVar9,uVar3 + (int)lVar21,iVar10,iVar12);
                }
              }
              for (; iVar8 <= local_16; iVar8 = iVar8 + 1) {
                (*DAT_6000_962a)(0x1000,uVar3,iVar8,in_FPUStatusWord,iVar8,iVar8 % 2);
              }
            }
            else {
              for (; iVar8 <= local_14; iVar8 = iVar8 + 1) {
                (*DAT_6000_962a)(0x1000,uVar3,iVar8,in_FPUStatusWord,iVar8,iVar8 % 2);
              }
              iVar8 = local_12;
              if (local_10 != local_12) {
                for (; iVar8 <= local_10; iVar8 = iVar8 + 1) {
                  iVar12 = iVar8 % 2;
                  iVar11 = local_10 - local_12;
                  iVar13 = iVar11 >> 0xf;
                  iVar9 = iVar8;
                  uVar6 = in_FPUStatusWord;
                  iVar10 = iVar8;
                  lVar21 = N_LXMUL((long)(int)(in_FPUStatusWord - uVar3),(long)(iVar8 - local_12));
                  lVar21 = F_LDIV(lVar21,CONCAT22(iVar13,iVar11));
                  (*DAT_6000_962a)(0x1000,in_FPUStatusWord - (int)lVar21,iVar9,uVar6,iVar10,iVar12);
                }
              }
              iVar8 = local_14;
              if (local_14 != local_16) {
                for (; iVar8 <= local_16; iVar8 = iVar8 + 1) {
                  iVar12 = iVar8 % 2;
                  iVar11 = local_16 - local_14;
                  iVar13 = iVar11 >> 0xf;
                  iVar9 = iVar8;
                  uVar6 = in_FPUStatusWord;
                  iVar10 = iVar8;
                  lVar21 = N_LXMUL((long)(int)(in_FPUStatusWord - uVar3),(long)(local_16 - iVar8));
                  lVar21 = F_LDIV(lVar21,CONCAT22(iVar13,iVar11));
                  (*DAT_6000_962a)(0x1000,in_FPUStatusWord - (int)lVar21,iVar9,uVar6,iVar10,iVar12);
                }
              }
            }
          }
        }
        else if (DAT_6000_4390 < 2) {
          iVar8 = local_10;
          if (local_16 - local_12 < local_14 - local_10) {
            if (local_12 != local_10) {
              for (; iVar8 <= local_12; iVar8 = iVar8 + 1) {
                uVar6 = DAT_6000_4394 & 0xff;
                iVar10 = local_12 - local_10;
                iVar11 = iVar10 >> 0xf;
                iVar9 = iVar8;
                lVar21 = N_LXMUL((long)(int)(in_FPUStatusWord - uVar3),(long)(iVar8 - local_10));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar11,iVar10));
                (*DAT_6000_962a)(0x1000,uVar3,iVar8,uVar3 + (int)lVar21,iVar9,uVar6);
              }
            }
            iVar8 = local_12;
            iVar9 = local_16;
            if (local_14 != local_16) {
              for (; iVar9 <= local_14; iVar9 = iVar9 + 1) {
                uVar6 = DAT_6000_4394 & 0xff;
                iVar11 = local_14 - local_16;
                iVar12 = iVar11 >> 0xf;
                iVar10 = iVar9;
                lVar21 = N_LXMUL((long)(int)(in_FPUStatusWord - uVar3),(long)(local_14 - iVar9));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar12,iVar11));
                (*DAT_6000_962a)(0x1000,uVar3,iVar9,uVar3 + (int)lVar21,iVar10,uVar6);
              }
            }
            for (; iVar8 <= local_16; iVar8 = iVar8 + 1) {
              (*DAT_6000_962a)(0x1000,uVar3,iVar8,in_FPUStatusWord,iVar8,DAT_6000_4394 & 0xff);
            }
          }
          else {
            for (; iVar8 <= local_14; iVar8 = iVar8 + 1) {
              (*DAT_6000_962a)(0x1000,uVar3,iVar8,in_FPUStatusWord,iVar8,DAT_6000_4394 & 0xff);
            }
            iVar8 = local_12;
            if (local_10 != local_12) {
              for (; iVar8 <= local_10; iVar8 = iVar8 + 1) {
                uVar7 = DAT_6000_4394 & 0xff;
                iVar11 = local_10 - local_12;
                iVar12 = iVar11 >> 0xf;
                iVar9 = iVar8;
                uVar6 = in_FPUStatusWord;
                iVar10 = iVar8;
                lVar21 = N_LXMUL((long)(int)(in_FPUStatusWord - uVar3),(long)(iVar8 - local_12));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar12,iVar11));
                (*DAT_6000_962a)(0x1000,in_FPUStatusWord - (int)lVar21,iVar9,uVar6,iVar10,uVar7);
              }
            }
            iVar8 = local_14;
            if (local_14 != local_16) {
              for (; iVar8 <= local_16; iVar8 = iVar8 + 1) {
                uVar7 = DAT_6000_4394 & 0xff;
                iVar11 = local_16 - local_14;
                iVar12 = iVar11 >> 0xf;
                iVar9 = iVar8;
                uVar6 = in_FPUStatusWord;
                iVar10 = iVar8;
                lVar21 = N_LXMUL((long)(int)(in_FPUStatusWord - uVar3),(long)(local_16 - iVar8));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar12,iVar11));
                (*DAT_6000_962a)(0x1000,in_FPUStatusWord - (int)lVar21,iVar9,uVar6,iVar10,uVar7);
              }
            }
          }
        }
        (*DAT_6000_962a)(0x1000,uVar3,local_10,in_FPUStatusWord,local_12,(undefined1)DAT_6000_439a);
        (*DAT_6000_962a)(0x1000,uVar3,local_14,in_FPUStatusWord,local_16,
                         CONCAT11(extraout_AH,(undefined1)DAT_6000_439a));
        if ((iVar2 != 3) || (DAT_6000_4390 == 2)) {
          if (param_8 == 0) {
            (*DAT_6000_962a)(0x1000,uVar3,local_10,uVar3,local_14,(undefined1)DAT_6000_439a);
          }
          if (0x62 < local_6) {
            (*DAT_6000_962a)(0x1000,in_FPUStatusWord,local_12,in_FPUStatusWord,local_16,
                             (undefined1)DAT_6000_439a);
          }
        }
        if (DAT_6000_4390 != 2) {
          if (iVar2 == 2) {
            for (iVar8 = 0; iVar8 < 5; iVar8 = iVar8 + 1) {
              (*DAT_6000_962a)(0x1000,uVar3,local_10 + ((local_14 - local_10) * iVar8) / 5,
                               in_FPUStatusWord,local_12 + ((local_16 - local_12) * iVar8) / 5,
                               (undefined1)DAT_6000_439a);
            }
          }
          if (iVar2 < 4) {
            iVar8 = (int)(in_FPUStatusWord - uVar3) / 3;
            (*DAT_6000_962a)(0x1000,uVar3 + iVar8,(local_10 * 2 + local_12) / 3,uVar3 + iVar8,
                             (local_14 * 2 + local_16) / 3,
                             CONCAT11((char)((uint)iVar8 >> 8),(undefined1)DAT_6000_439a));
            (*DAT_6000_962a)(0x1000,in_FPUStatusWord - iVar8,(local_10 + local_12 * 2) / 3,
                             in_FPUStatusWord - iVar8,(local_14 + local_16 * 2) / 3,
                             CONCAT11(extraout_AH_00,(undefined1)DAT_6000_439a));
            uVar18 = extraout_AH_01;
          }
          else if (iVar2 == 4) {
            DAT_6000_438e = 5;
            for (iVar8 = 0; iVar8 < DAT_6000_438e; iVar8 = iVar8 + 1) {
              (*DAT_6000_962a)(0x1000,uVar3,
                               local_10 + ((local_14 - local_10) * iVar8) / DAT_6000_438e,
                               in_FPUStatusWord,
                               local_12 + ((local_16 - local_12) * iVar8) / DAT_6000_438e,
                               (undefined1)DAT_6000_439c);
            }
            local_e = DAT_6000_438e + -1;
            for (iVar8 = 0; uVar18 = (undefined1)((uint)local_e >> 8), iVar8 < DAT_6000_438e;
                iVar8 = iVar8 + 1) {
              for (local_e = iVar8 % 2; local_e < DAT_6000_438e; local_e = local_e + 2) {
                lVar21 = ftol((double)CONCAT26(in_stack_0000ffc6,
                                               CONCAT24(local_e,CONCAT22(unaff_SI,unaff_DI))));
                iVar9 = (int)lVar21;
                if ((param_8 <= iVar9) && (iVar9 <= local_6)) {
                  iVar10 = (int)((in_FPUStatusWord - uVar3) * (iVar9 - param_8)) /
                           (local_6 - param_8);
                  iVar11 = DAT_6000_438e >> 0xf;
                  iVar9 = DAT_6000_438e;
                  lVar21 = N_LXMUL((long)(local_14 - local_10),(long)(iVar8 + 1));
                  lVar22 = F_LDIV(lVar21,CONCAT22(iVar11,iVar9));
                  iVar11 = DAT_6000_438e >> 0xf;
                  iVar9 = DAT_6000_438e;
                  lVar21 = N_LXMUL((long)(local_14 - local_10),(long)iVar8);
                  lVar23 = F_LDIV(lVar21,CONCAT22(iVar11,iVar9));
                  iVar11 = DAT_6000_438e >> 0xf;
                  iVar9 = DAT_6000_438e;
                  lVar21 = N_LXMUL((long)(local_16 - local_12),(long)iVar8);
                  lVar21 = F_LDIV(lVar21,CONCAT22(iVar11,iVar9));
                  lVar24 = N_LXMUL((long)iVar10,(lVar21 + local_12) - (long)(local_10 + (int)lVar23)
                                  );
                  iVar11 = DAT_6000_438e >> 0xf;
                  iVar9 = DAT_6000_438e;
                  lVar21 = N_LXMUL((long)(local_16 - local_12),(long)(iVar8 + 1));
                  lVar21 = F_LDIV(lVar21,CONCAT22(iVar11,iVar9));
                  lVar21 = N_LXMUL((long)iVar10,(lVar21 + local_12) - (long)(local_10 + (int)lVar22)
                                  );
                  if ((int)uVar3 < (int)in_FPUStatusWord) {
                    lVar24 = F_LDIV(lVar24,CONCAT22((((int)in_FPUStatusWord >> 0xf) -
                                                    ((int)uVar3 >> 0xf)) -
                                                    (uint)(in_FPUStatusWord < uVar3),
                                                    in_FPUStatusWord - uVar3));
                    lVar21 = F_LDIV(lVar21,CONCAT22((((int)in_FPUStatusWord >> 0xf) -
                                                    ((int)uVar3 >> 0xf)) -
                                                    (uint)(in_FPUStatusWord < uVar3),
                                                    in_FPUStatusWord - uVar3));
                  }
                  iVar9 = local_10 + (int)lVar22;
                  (*DAT_6000_962a)(0x1000,uVar3 + iVar10,(int)(lVar24 + (local_10 + (int)lVar23)),
                                   uVar3 + iVar10,(int)(lVar21 + iVar9),
                                   CONCAT11((char)((uint)iVar9 >> 8),(undefined1)DAT_6000_439c));
                }
              }
            }
          }
          else {
            lVar21 = F_LDIV(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),0x32);
            iVar8 = (int)lVar21;
            DAT_6000_438e = iVar8;
            for (iVar9 = 0; uVar18 = (undefined1)((uint)iVar8 >> 8), iVar9 < DAT_6000_438e;
                iVar9 = iVar9 + 1) {
              iVar8 = (*DAT_6000_962a)(0x1000,uVar3,
                                       local_10 + ((local_14 - local_10) * iVar9) / DAT_6000_438e,
                                       in_FPUStatusWord,
                                       local_12 + ((local_16 - local_12) * iVar9) / DAT_6000_438e,
                                       CONCAT11(uVar18,(undefined1)DAT_6000_439a));
            }
            DAT_6000_438e = 3;
          }
          if (iVar2 == 1) {
            (*DAT_6000_962a)(0x1000,uVar3,local_10,in_FPUStatusWord,local_16,CONCAT11(uVar18,0xc));
            (*DAT_6000_962a)(0x1000,uVar3,local_14,in_FPUStatusWord,local_12,
                             CONCAT11(extraout_AH_02,0xc));
          }
        }
        DAT_6000_438e = 3;
        if (((cVar1 == '\x01') && (0x12 < local_6)) && (param_8 < 0x50)) {
          iVar8 = local_6 - param_8;
          iVar9 = iVar8 >> 0xf;
          lVar21 = N_LXMUL((long)(0x50 - param_8),(long)(int)(in_FPUStatusWord - uVar3));
          lVar21 = F_LDIV(lVar21,CONCAT22(iVar9,iVar8));
          local_22 = uVar3 + (int)lVar21;
          if ((int)in_FPUStatusWord < (int)local_22) {
            local_22 = in_FPUStatusWord;
          }
          iVar8 = in_FPUStatusWord - uVar3;
          iVar9 = iVar8 >> 0xf;
          lVar21 = N_LXMUL((long)(int)(local_22 - uVar3),(long)(local_12 - local_10));
          lVar21 = F_LDIV(lVar21,CONCAT22(iVar9,iVar8));
          iVar8 = in_FPUStatusWord - uVar3;
          iVar9 = iVar8 >> 0xf;
          lVar24 = N_LXMUL((long)(int)(local_22 - uVar3),(long)(local_16 - local_14));
          lVar24 = F_LDIV(lVar24,CONCAT22(iVar9,iVar8));
          iVar10 = local_14 + (int)lVar24;
          lVar21 = ftol((double)CONCAT26(in_stack_0000ffc6,
                                         CONCAT24((local_10 + (int)lVar21) * 3 + iVar10,
                                                  CONCAT22(unaff_SI,unaff_DI))));
          iVar8 = (int)lVar21;
          iVar9 = local_6 - param_8;
          iVar11 = iVar9 >> 0xf;
          lVar21 = N_LXMUL((long)(0x14 - param_8),(long)(int)(in_FPUStatusWord - uVar3));
          lVar21 = F_LDIV(lVar21,CONCAT22(iVar11,iVar9));
          local_20 = uVar3 + (int)lVar21;
          if ((int)local_20 < (int)uVar3) {
            local_20 = uVar3;
          }
          iVar9 = in_FPUStatusWord - uVar3;
          iVar11 = iVar9 >> 0xf;
          lVar21 = N_LXMUL((long)(int)(local_20 - uVar3),(long)(local_12 - local_10));
          lVar21 = F_LDIV(lVar21,CONCAT22(iVar11,iVar9));
          iVar9 = in_FPUStatusWord - uVar3;
          iVar11 = iVar9 >> 0xf;
          lVar24 = N_LXMUL((long)(int)(local_20 - uVar3),(long)(local_16 - local_14));
          lVar24 = F_LDIV(lVar24,CONCAT22(iVar11,iVar9));
          iVar12 = local_14 + (int)lVar24;
          lVar21 = ftol((double)CONCAT26(in_stack_0000ffc6,
                                         CONCAT24((local_10 + (int)lVar21) * 3 + iVar12,
                                                  CONCAT22(unaff_SI,unaff_DI))));
          iVar11 = (int)lVar21;
          iVar9 = iVar11;
          if (iVar10 - iVar8 < iVar12 - iVar11) {
            if (iVar8 != iVar11) {
              for (; iVar9 <= iVar8; iVar9 = iVar9 + 1) {
                uVar6 = (uint)DAT_6000_439e;
                iVar15 = iVar8 - iVar11;
                iVar14 = iVar15 >> 0xf;
                iVar13 = iVar9;
                lVar21 = N_LXMUL((long)(int)(local_22 - local_20),(long)(iVar9 - iVar11));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar14,iVar15));
                (*DAT_6000_962a)(0x1000,local_20,iVar9,local_20 + (int)lVar21,iVar13,uVar6);
              }
            }
            iVar9 = iVar8;
            iVar13 = iVar10;
            if (iVar12 != iVar10) {
              for (; iVar13 <= iVar12; iVar13 = iVar13 + 1) {
                uVar6 = (uint)DAT_6000_439e;
                iVar14 = iVar12 - iVar10;
                iVar16 = iVar14 >> 0xf;
                iVar15 = iVar13;
                lVar21 = N_LXMUL((long)(int)(local_22 - local_20),(long)(iVar12 - iVar13));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar16,iVar14));
                (*DAT_6000_962a)(0x1000,local_20,iVar13,local_20 + (int)lVar21,iVar15,uVar6);
              }
            }
            for (; iVar9 <= iVar10; iVar9 = iVar9 + 1) {
              (*DAT_6000_962a)(0x1000,local_20,iVar9,local_22,iVar9,DAT_6000_439e);
            }
          }
          else {
            for (; iVar9 <= iVar12; iVar9 = iVar9 + 1) {
              (*DAT_6000_962a)(0x1000,local_20,iVar9,local_22,iVar9,DAT_6000_439e);
            }
            iVar9 = iVar8;
            if (iVar11 != iVar8) {
              for (; iVar9 <= iVar11; iVar9 = iVar9 + 1) {
                uVar7 = (uint)DAT_6000_439e;
                iVar14 = iVar11 - iVar8;
                iVar16 = iVar14 >> 0xf;
                iVar13 = iVar9;
                uVar6 = local_22;
                iVar15 = iVar9;
                lVar21 = N_LXMUL((long)(int)(local_22 - local_20),(long)(iVar9 - iVar8));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar16,iVar14));
                (*DAT_6000_962a)(0x1000,local_22 - (int)lVar21,iVar13,uVar6,iVar15,uVar7);
              }
            }
            iVar9 = iVar12;
            if (iVar12 != iVar10) {
              for (; iVar9 <= iVar10; iVar9 = iVar9 + 1) {
                uVar7 = (uint)DAT_6000_439e;
                iVar14 = iVar10 - iVar12;
                iVar16 = iVar14 >> 0xf;
                iVar13 = iVar9;
                uVar6 = local_22;
                iVar15 = iVar9;
                lVar21 = N_LXMUL((long)(int)(local_22 - local_20),(long)(iVar10 - iVar9));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar16,iVar14));
                (*DAT_6000_962a)(0x1000,local_22 - (int)lVar21,iVar13,uVar6,iVar15,uVar7);
              }
            }
          }
          if ((iVar2 == 2) || (iVar2 == 4)) {
            for (iVar2 = 0x1e; iVar2 < 0x47; iVar2 = iVar2 + 10) {
              if (((param_8 <= iVar2) && (iVar2 <= local_6)) && (local_22 != local_20)) {
                iVar9 = local_6 - param_8;
                iVar13 = iVar9 >> 0xf;
                lVar21 = N_LXMUL((long)(iVar2 - param_8),(long)(int)(in_FPUStatusWord - uVar3));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar13,iVar9));
                iVar14 = uVar3 + (int)lVar21;
                iVar13 = (uint)(byte)((ulong)lVar21 >> 8) << 8;
                iVar9 = local_22 - local_20;
                iVar15 = iVar9 >> 0xf;
                lVar21 = N_LXMUL((long)(int)(iVar14 - local_20),(long)(iVar10 - iVar12));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar15,iVar9));
                iVar16 = iVar12 + (int)lVar21;
                iVar15 = local_22 - local_20;
                iVar17 = iVar15 >> 0xf;
                iVar9 = iVar14;
                lVar21 = N_LXMUL((long)(int)(iVar14 - local_20),(long)(iVar8 - iVar11));
                lVar21 = F_LDIV(lVar21,CONCAT22(iVar17,iVar15));
                (*DAT_6000_962a)(0x1000,iVar14,iVar11 + (int)lVar21,iVar9,iVar16,iVar13);
              }
            }
            if (iVar10 - iVar8 < iVar12 - iVar11) {
              (*DAT_6000_962a)(0x1000,local_20,iVar11,local_22 - (int)(local_22 - local_20) / 5,
                               iVar10,CONCAT11((char)((uint)(iVar12 - iVar11) >> 8),0xd));
              (*DAT_6000_962a)(0x1000,local_20,iVar12,local_22 - (int)(local_22 - local_20) / 5,
                               iVar8,CONCAT11(extraout_AH_03,0xd));
            }
            else {
              uVar18 = (undefined1)((uint)(iVar12 - iVar11) >> 8);
              if (iVar12 - iVar11 < iVar10 - iVar8) {
                (*DAT_6000_962a)(0x1000,local_20 + (int)(local_22 - local_20) / 5,iVar11,local_22,
                                 iVar10,CONCAT11(uVar18,0xd));
                (*DAT_6000_962a)(0x1000,local_20 + (int)(local_22 - local_20) / 5,iVar12,local_22,
                                 iVar8,CONCAT11(extraout_AH_04,0xd));
              }
              else {
                (*DAT_6000_962a)(0x1000,local_20,iVar11,local_22,iVar10,CONCAT11(uVar18,0xd));
                (*DAT_6000_962a)(0x1000,local_20,iVar12,local_22,iVar8,CONCAT11(extraout_AH_05,0xd))
                ;
              }
            }
          }
          for (iVar2 = 1; iVar2 < 6; iVar2 = iVar2 + 2) {
            (*DAT_6000_962a)(0x1000,local_20,iVar11 + ((iVar12 - iVar11) * iVar2) / 6,local_22,
                             iVar8 + ((iVar10 - iVar8) * iVar2) / 6,0xf);
            if (0x1e < iVar5 - iVar4) {
              (*DAT_6000_962a)(0x1000,local_20,iVar11 + ((iVar12 - iVar11) * iVar2) / 6 + 1,local_22
                               ,iVar8 + ((iVar10 - iVar8) * iVar2) / 6 + 1,
                               CONCAT11((char)((uint)(iVar5 - iVar4) >> 8),DAT_6000_4392));
            }
          }
          if (param_3 != 0) {
            for (iVar2 = 0; lVar21 = (long)(iVar5 - iVar4) / 0x23, iVar2 < (int)lVar21;
                iVar2 = iVar2 + 1) {
              (*DAT_6000_962a)(0x1000,local_20,iVar12 - iVar2,local_22,iVar10 - iVar2,
                               CONCAT11((char)((ulong)lVar21 >> 8),(undefined1)DAT_6000_4398));
            }
          }
          for (iVar2 = 0; iVar9 = (iVar5 - iVar4) / 0x23, iVar2 < iVar9; iVar2 = iVar2 + 1) {
            uVar18 = (undefined1)((uint)iVar9 >> 8);
            if (iVar2 == 0) {
              (*DAT_6000_962a)(0x1000,local_20,iVar11,local_20,iVar12,CONCAT11(uVar18,0xe));
              (*DAT_6000_962a)(0x1000,local_22,iVar8,local_22,iVar10,CONCAT11(extraout_AH_06,0xe));
              (*DAT_6000_962a)(0x1000,local_20,iVar11,local_22,iVar8,CONCAT11(extraout_AH_07,0xe));
            }
            else if (param_3 != 0) {
              if ((local_20 != uVar3) && (param_3 != -1)) {
                (*DAT_6000_962a)(0x1000,local_20 + iVar2,iVar11,local_20 + iVar2,iVar12,
                                 CONCAT11(uVar18,(undefined1)DAT_6000_4394));
              }
              if ((local_22 != in_FPUStatusWord) && (param_3 != 1)) {
                (*DAT_6000_962a)(0x1000,local_22 - iVar2,iVar8,local_22 - iVar2,iVar10,
                                 DAT_6000_4394 & 0xff);
              }
              (*DAT_6000_962a)(0x1000,local_20 + 1,iVar11 + iVar2,local_22 - 1,iVar8 + iVar2,
                               DAT_6000_4394 & 0xff);
            }
          }
        }
      }
      return 0;
    }
    return 0;
  }
  return 0;
}


// ==== read_roll_line @ 3000:4434 (size 61) callers: load_h_bin,roll_char  // one line of ROLL.TXT into a buffer, dropping '|'

int __cdecl16far read_roll_line(int param_1,void *param_2)

{
  short sVar1;
  int iVar2;
  undefined1 local_4;
  
  iVar2 = 0;
  do {
    sVar1 = fgetc(param_2);
    if (sVar1 != 0x7c) {
      local_4 = (undefined1)sVar1;
      *(undefined1 *)(iVar2 + param_1) = local_4;
      iVar2 = iVar2 + 1;
    }
  } while (sVar1 != 10);
  *(undefined1 *)(param_1 + iVar2 + -1) = 0;
  return param_1;
}


// ==== show_roll @ 3000:4477 (size 542) callers: roll_char  // prints the six characteristics, height, weight, age and sex

void __cdecl16far show_roll(int param_1)

{
  int iVar1;
  char *pcVar2;
  long lVar3;
  short radix;
  char local_1c [26];
  
  iVar1 = param_1 * 6;
  pcVar2 = itoa(DAT_6000_c904,local_1c,10);
  print_text(0x212,100,1,pcVar2,iVar1);
  iVar1 = param_1 * 6;
  pcVar2 = itoa(DAT_6000_c906,local_1c,10);
  print_text(0x212,0xa0,1,pcVar2,iVar1);
  iVar1 = param_1 * 6;
  pcVar2 = itoa(DAT_6000_c908,local_1c,10);
  print_text(0x212,0xdc,1,pcVar2,iVar1);
  iVar1 = param_1 * 6;
  pcVar2 = itoa(DAT_6000_c90a,local_1c,10);
  print_text(0x212,0x118,1,pcVar2,iVar1);
  iVar1 = param_1 * 6;
  pcVar2 = itoa(DAT_6000_c90c,local_1c,10);
  print_text(0x212,0x154,1,pcVar2,iVar1);
  iVar1 = param_1 * 6;
  pcVar2 = itoa(DAT_6000_c90e,local_1c,10);
  print_text(0x212,400,1,pcVar2,iVar1);
  iVar1 = param_1 << 3;
  pcVar2 = itoa(DAT_6000_c12f,local_1c,10);
  print_text(0x438,100,1,pcVar2,iVar1);
  iVar1 = param_1 << 3;
  pcVar2 = itoa(DAT_6000_c131,local_1c,10);
  print_text(0x438,0xaa,1,pcVar2,iVar1);
  iVar1 = param_1 << 3;
  radix = 10;
  pcVar2 = local_1c;
  lVar3 = F_LUDIV(CONCAT22(DAT_6000_c8ca,DAT_6000_c8c8),0x80520);
  pcVar2 = itoa((short)lVar3,pcVar2,radix);
  print_text(0x438,0xf0,1,pcVar2,iVar1);
  if (DAT_6000_c11b == '\0') {
    print_text(900,0,2,(char *)s_SEX__MALE_6000_4635,param_1 * 0xf);
  }
  else {
    print_text(0x2ee,0,2,(char *)s_>SEX__FEMALE_6000_4628 + 1,param_1 * 0xf);
  }
  return;
}


// ==== roll_char @ 3000:4695 (size 5686) callers: main  // character creation: race, stats, name, class, starting kit

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void roll_char(void)

{
  undefined2 uVar1;
  short sVar2;
  char *pcVar3;
  undefined2 unaff_SI;
  int iVar4;
  undefined2 unaff_DI;
  int iVar5;
  long lVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  undefined4 in_stack_0000ff78;
  char local_2e [26];
  int local_14;
  int local_12;
  int local_10;
  int local_e;
  int local_c;
  void *local_a;
  undefined1 *local_8;
  int local_6;
  int local_4;
  
  local_c = 0;
  local_8 = (undefined1 *)&DAT_6000_c0f2;
  for (iVar5 = 0; iVar5 < 0x928; iVar5 = iVar5 + 1) {
    ((undefined1 *)&DAT_6000_c0f2)[iVar5] = 0;
  }
  clear_screen();
  local_a = fopen((char *)s_roll_txt_6000_463f,(char *)0x4648);
  if (local_a == (void *)0x0) {
    print_text(0,0,0,(char *)s_I_CAN_T_FIND_THE_FILE_ROLL_TXT__T_6000_464b,4);
    wait_key();
    quit(0);
  }
  uVar1 = read_roll_line(&stack0xff78,local_a,3);
  print_text(0,0,2,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,5);
  print_text(0,0x78,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,5);
  print_text(0,0xdc,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,5);
  print_text(0,0x140,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,5);
  print_text(0,0x1a4,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,5);
  print_text(0,0x208,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,5);
  print_text(0,0x26c,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,5);
  print_text(0,0x2d0,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x334,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x398,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x3fc,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,4);
  print_text(0,0x47e,0,uVar1);
  flush_keys();
  wait_key();
  clear_screen();
  lVar6 = time((void *)0x0);
  srand((ushort)lVar6);
  uVar1 = read_roll_line(&stack0xff78,local_a,3);
  print_text(0,0,2,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,4);
  print_text(0,100,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,4);
  print_text(0,0x96,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,5);
  print_text(0,0xdc,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x140,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x1a4,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x208,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x26c,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x2d0,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x334,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x398,0,uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,8);
  print_text(0,0x3fc,0,uVar1);
  do {
    local_6 = -1;
    sVar2 = kbhit();
    if (sVar2 == 0) {
      if (DAT_6000_d0da != 0) {
        local_6 = mouse_pick(0x4440);
      }
    }
    else {
      local_6 = getch();
      if ((0x30 < local_6) && (local_6 < 0x39)) {
        local_6 = local_6 + -0x31;
      }
    }
  } while ((local_6 != 0x1b) && ((local_6 < 0 || (7 < local_6))));
  if (local_6 == 0x1b) {
    quit(0);
  }
  DAT_6000_c11a = (char)local_6;
  clear_screen();
  if (DAT_6000_d0da != 0) {
    FUN_4000_3435();
  }
  do {
    do {
      print_text(0,0,2,(char *)s_RACE__6000_4688,5);
      print_text(0x14a,0,2,*(undefined2 *)(DAT_6000_c11a * 0xe + 0x150),5);
      print_text(0,100,1,(char *)s_STRENGTH__6000_468e,6);
      print_text(0,0xa0,1,(char *)s_INTELLIGENCE__6000_4698,6);
      print_text(0,0xdc,1,0x46a6,6);
      print_text(0,0x118,1,(char *)s_CONSTITUTION__6000_46ae,6);
      print_text(0,0x154,1,(char *)s_AGILITY__6000_46bc,6);
      print_text(0,400,1,0x46c5,6);
      print_text(0x2ee,100,1,(char *)s_HEIGHT__INCHES_6000_46cb,8);
      print_text(0x2ee,0xaa,1,(char *)s_WEIGHT__POUNDS_6000_46df,8);
      print_text(0x2ee,0xf0,1,(char *)s_AGE__YEARS_6000_46f3,8);
      local_c = 0;
      iVar5 = *(int *)(DAT_6000_c11a * 0xe + 0x15c);
      uVar9 = 0;
      uVar1 = 0x8000;
      sVar2 = rand();
      lVar6 = N_LXMUL(10,(long)sVar2);
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar1));
      DAT_6000_c8c8 = (iVar5 * ((int)lVar6 + 0x19)) / 100;
      DAT_6000_c8ca = DAT_6000_c8c8 >> 0xf;
      lVar6 = N_LXMUL((long)DAT_6000_c8c8,0x80520);
      DAT_6000_c8ca = (int)((ulong)lVar6 >> 0x10);
      DAT_6000_c8c8 = (int)lVar6;
      DAT_6000_c131 = *(int *)(DAT_6000_c11a * 0xe + 0x15a);
      local_e = DAT_6000_c131 / 5;
      uVar9 = 0;
      uVar1 = 0x8000;
      sVar2 = rand();
      lVar6 = N_LXMUL((long)local_e,(long)sVar2);
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar1));
      DAT_6000_c131 = DAT_6000_c131 + ((int)lVar6 - DAT_6000_c131 / 10);
      DAT_6000_c12f = *(int *)(DAT_6000_c11a * 0xe + 0x158);
      local_10 = DAT_6000_c12f / 5;
      uVar9 = 0;
      uVar1 = 0x8000;
      sVar2 = rand();
      lVar6 = N_LXMUL((long)local_10,(long)sVar2);
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar1));
      DAT_6000_c12f = DAT_6000_c12f + ((int)lVar6 - DAT_6000_c12f / 10);
      uVar9 = 0;
      uVar1 = 0x8000;
      sVar2 = rand();
      lVar6 = F_LDIV(CONCAT22((sVar2 >> 0xf) << 1 | (uint)(sVar2 < 0),sVar2 << 1),
                     CONCAT22(uVar9,uVar1));
      DAT_6000_c11b = (undefined1)lVar6;
      DAT_6000_c904 = (int)*(char *)(DAT_6000_c11a * 0xe + 0x152);
      DAT_6000_c906 = (int)*(char *)(DAT_6000_c11a * 0xe + 0x153);
      DAT_6000_c908 = (int)*(char *)(DAT_6000_c11a * 0xe + 0x154);
      DAT_6000_c90a = (int)*(char *)(DAT_6000_c11a * 0xe + 0x155);
      DAT_6000_c90c = (int)*(char *)(DAT_6000_c11a * 0xe + 0x156);
      DAT_6000_c90e = (int)*(char *)(DAT_6000_c11a * 0xe + 0x157);
      for (iVar5 = 0; iVar5 < 0x3c; iVar5 = iVar5 + 1) {
        uVar9 = 0;
        uVar1 = 0x8000;
        sVar2 = rand();
        lVar6 = N_LXMUL(6,(long)sVar2);
        lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar1));
        switch((int)lVar6) {
        case 0:
          DAT_6000_c904 = DAT_6000_c904 + 1;
          break;
        case 1:
          DAT_6000_c906 = DAT_6000_c906 + 1;
          break;
        case 2:
          DAT_6000_c908 = DAT_6000_c908 + 1;
          break;
        case 3:
          DAT_6000_c90a = DAT_6000_c90a + 1;
          break;
        case 4:
          DAT_6000_c90c = DAT_6000_c90c + 1;
          break;
        case 5:
          DAT_6000_c90e = DAT_6000_c90e + 1;
        }
      }
      show_roll(1);
      print_text(0xbe,700,1,(char *)s_Y__KEEP_THIS_CHARACTER_6000_4706,4);
      print_text(0xbe,0x302,1,(char *)s_N__ROLL_A_NEW_CHARACTER_6000_471d,4);
      print_text(0xbe,0x348,1,(char *)s_D__DESIGN_YOUR_OWN_CHARACTER_6000_4735,4);
      print_text(0xbe,0x44c,1,(char *)s_PLEASE_SELECT_ONE_OF_THE_ABOVE_6000_4752,4);
      flush_keys();
      do {
        local_6 = -1;
        sVar2 = kbhit();
        if (sVar2 == 0) {
          if (DAT_6000_d0da != 0) {
            local_6 = mouse_pick(0x43b2);
          }
        }
        else {
          sVar2 = getch();
          local_6 = toupper(sVar2);
          if (local_6 == 0x59) {
            local_6 = 0;
          }
          if (local_6 == 0x4e) {
            local_6 = 1;
          }
          if (local_6 == 0x44) {
            local_6 = 2;
          }
        }
      } while ((local_6 < 0) || (2 < local_6));
      if (DAT_6000_d0da != 0) {
        FUN_4000_3435();
      }
      if (local_6 == 0) goto LAB_3000_54c0;
      if (local_6 == 1) {
        show_roll(0);
      }
    } while (local_6 != 2);
    uVar10 = 0;
    uVar8 = 0;
    uVar7 = 0x4af;
    uVar1 = DAT_6000_cd96;
    uVar9 = DAT_6000_cd9a;
    lVar6 = N_LXMUL(0x2b2,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar7));
    fill_rect(0,(int)lVar6,uVar1,uVar9,uVar10);
    show_roll(0);
    DAT_6000_c904 = DAT_6000_c904 + -4;
    DAT_6000_c906 = DAT_6000_c906 + -4;
    DAT_6000_c908 = DAT_6000_c908 + -4;
    DAT_6000_c90a = DAT_6000_c90a + -4;
    DAT_6000_c90c = DAT_6000_c90c + -4;
    DAT_6000_c90e = DAT_6000_c90e + -4;
    show_roll(1);
    print_text(0x96,0x226,1,(char *)s_ESC_CANCEL_THIS_CHARACTER_6000_4771,4);
    print_text_clipped(0,700,0x63f,1,(char *)s_YOU_MAY_ASSIGN_24_ADDITIONAL_POI_6000_478b,3);
    print_text_clipped(200,0x302,0x578,1,(char *)s_TO_THE_ABOVE_CHARACTERISTICS__6000_47af,3);
    print_text_clipped(0,0x348,1000,1,(char *)s_CHARACTERISTIC_POINTS_LEFT__6000_47cd,6);
    print_text_clipped(0,0x3a2,0x63f,1,(char *)s_PRESS__S____I____W____C____D___O_6000_47ea,4);
    print_text_clipped(0x78,1000,0x63f,1,(char *)s_STRENGTH__INTELLIGENCE__WIZDOM_6000_4814,4);
    print_text_clipped(0x78,0x42e,0x63f,1,(char *)s_CONSTITUTION__AGILITY_OR_LUCK_6000_4833,4);
    if (DAT_6000_d0da != 0) {
      print_text_clipped(0,0x47e,0x63f,0,(char *)s_OR_POINT_THE_MOUSE_TO_A_CHARACTE_6000_4851,4);
    }
    for (iVar5 = 0x18; 0 < iVar5; iVar5 = iVar5 + -1) {
      itoa(iVar5 + 1,DAT_6000_cb52,10);
      uVar9 = 0;
      uVar1 = 0x4af;
      lVar6 = N_LXMUL(900,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      F_LDIV(lVar6,CONCAT22(uVar9,uVar1));
      uVar9 = 0;
      uVar1 = 0x63f;
      lVar6 = N_LXMUL(0x4b0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar1));
      uVar1 = (undefined2)lVar6;
      uVar7 = 0;
      uVar9 = 0x4af;
      lVar6 = N_LXMUL(0x343,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar9));
      uVar9 = (undefined2)lVar6;
      uVar8 = 0;
      uVar7 = 0x63f;
      lVar6 = N_LXMUL(0x3e6,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar7));
      fill_rect((int)lVar6,uVar9,uVar1);
      itoa(iVar5,DAT_6000_cb52,10);
      print_text(1000,0x348,1,DAT_6000_cb52,6);
      do {
        local_6 = -1;
        sVar2 = kbhit();
        if (sVar2 == 0) {
          if (DAT_6000_d0da != 0) {
            local_6 = mouse_pick(0x43cc);
          }
        }
        else {
          sVar2 = getch();
          local_6 = toupper(sVar2);
          if (local_6 == 0x1b) {
            local_6 = 6;
          }
          if (local_6 == 0x53) {
            local_6 = 0;
          }
          if (local_6 == 0x49) {
            local_6 = 1;
          }
          if (local_6 == 0x57) {
            local_6 = 2;
          }
          if (local_6 == 0x43) {
            local_6 = 3;
          }
          if (local_6 == 0x41) {
            local_6 = 4;
          }
          if (local_6 == 0x4c) {
            local_6 = 5;
          }
        }
      } while ((local_6 < 0) || (6 < local_6));
      if (local_6 == 6) {
        clear_screen();
        local_c = 1;
        break;
      }
      if (DAT_6000_d0da != 0) {
        FUN_4000_3435();
      }
      if (local_6 == 0) {
        uVar1 = 0;
        pcVar3 = itoa(DAT_6000_c904,local_2e,10);
        print_text(0x212,100,1,pcVar3,uVar1);
        DAT_6000_c904 = DAT_6000_c904 + 1;
        uVar1 = 6;
        pcVar3 = itoa(DAT_6000_c904,local_2e,10);
        print_text(0x212,100,1,pcVar3,uVar1);
      }
      if (local_6 == 1) {
        uVar1 = 0;
        pcVar3 = itoa(DAT_6000_c906,local_2e,10);
        print_text(0x212,0xa0,1,pcVar3,uVar1);
        DAT_6000_c906 = DAT_6000_c906 + 1;
        uVar1 = 6;
        pcVar3 = itoa(DAT_6000_c906,local_2e,10);
        print_text(0x212,0xa0,1,pcVar3,uVar1);
      }
      if (local_6 == 2) {
        uVar1 = 0;
        pcVar3 = itoa(DAT_6000_c908,local_2e,10);
        print_text(0x212,0xdc,1,pcVar3,uVar1);
        DAT_6000_c908 = DAT_6000_c908 + 1;
        uVar1 = 6;
        pcVar3 = itoa(DAT_6000_c908,local_2e,10);
        print_text(0x212,0xdc,1,pcVar3,uVar1);
      }
      if (local_6 == 3) {
        uVar1 = 0;
        pcVar3 = itoa(DAT_6000_c90a,local_2e,10);
        print_text(0x212,0x118,1,pcVar3,uVar1);
        DAT_6000_c90a = DAT_6000_c90a + 1;
        uVar1 = 6;
        pcVar3 = itoa(DAT_6000_c90a,local_2e,10);
        print_text(0x212,0x118,1,pcVar3,uVar1);
      }
      if (local_6 == 4) {
        uVar1 = 0;
        pcVar3 = itoa(DAT_6000_c90c,local_2e,10);
        print_text(0x212,0x154,1,pcVar3,uVar1);
        DAT_6000_c90c = DAT_6000_c90c + 1;
        uVar1 = 6;
        pcVar3 = itoa(DAT_6000_c90c,local_2e,10);
        print_text(0x212,0x154,1,pcVar3,uVar1);
      }
      if (local_6 == 5) {
        uVar1 = 0;
        pcVar3 = itoa(DAT_6000_c90e,local_2e,10);
        print_text(0x212,400,1,pcVar3,uVar1);
        DAT_6000_c90e = DAT_6000_c90e + 1;
        uVar1 = 6;
        pcVar3 = itoa(DAT_6000_c90e,local_2e,10);
        print_text(0x212,400,1,pcVar3,uVar1);
      }
    }
  } while (local_c != 0);
LAB_3000_54c0:
  uVar10 = 0;
  uVar8 = 0;
  uVar7 = 0x4af;
  uVar1 = DAT_6000_cd96;
  uVar9 = DAT_6000_cd9a;
  lVar6 = N_LXMUL(0x212,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar7));
  fill_rect(0,(int)lVar6,uVar1,uVar9,uVar10);
  print_text(0,700,1,(char *)s_PLEASE_TYPE_YOUR_NAME__6000_488d,7);
  read_string((undefined1 *)&DAT_6000_c0f2,0,0,1000,0,0x44c,0,2,0x12,4);
  uVar10 = 0;
  uVar8 = 0;
  uVar7 = 0x4af;
  uVar1 = DAT_6000_cd96;
  uVar9 = DAT_6000_cd9a;
  lVar6 = N_LXMUL(0x29e,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar7));
  fill_rect(0,(int)lVar6,uVar1,uVar9,uVar10);
  draw_text_box((char *)s_PLEASE_TYPE_YOUR_NAME__6000_488d + 0x11,700,0,0x136,0,0x370,0,1,8);
  uVar9 = 8;
  uVar1 = 1;
  sVar2 = strlen((char *)&DAT_6000_c0f2);
  draw_text_box((undefined1 *)&DAT_6000_c0f2,0x38e,0,0x136,0,sVar2 * 0x24 + 0x38e,0,uVar1,uVar9);
  uVar1 = read_roll_line(&stack0xff78,local_a,0,0,0x1e0,0,0x5dc,0,1,2);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0,0,0x226,0,0x640,0,0,3);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0x5a,0,0x24e,0,0x640,0,0,3);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0,0,0x280,0,0x640,0,0,4);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0x5a,0,0x2a8,0,0x640,0,0,4);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0,0,0x2da,0,0x640,0,0,5);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0x5a,0,0x302,0,0x640,0,0,5);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0,0,0x334,0,0x640,0,0,6);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0x5a,0,0x35c,0,0x640,0,0,6);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0,0,0x38e,0,0x640,0,0,8);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0x5a,0,0x3b6,0,0x640,0,0,8);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0,0,1000,0,0x640,0,0,7);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0x5a,0,0x410,0,0x640,0,0,7);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0x5a,0,0x438,0,0x640,0,0,7);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0,0,0x465,0,0x640,0,0,2);
  draw_text_box(uVar1);
  uVar1 = read_roll_line(&stack0xff78,local_a,0x5a,0,0x48d,0,0x640,0,0,2);
  draw_text_box(uVar1);
  fclose(local_a);
  flush_keys();
  do {
    local_6 = -1;
    sVar2 = kbhit();
    if (sVar2 == 0) {
      if (DAT_6000_d0da != 0) {
        local_6 = mouse_pick(0x4406);
      }
    }
    else {
      local_6 = getch();
      if ((0x30 < local_6) && (local_6 < 0x38)) {
        local_6 = local_6 + -0x31;
      }
    }
  } while ((local_6 != 0x1b) && ((local_6 < 0 || (6 < local_6))));
  if (local_6 == 0x1b) {
    quit(0);
  }
  DAT_6000_c11c = (char)local_6;
  if (DAT_6000_d0da != 0) {
    FUN_4000_3435();
  }
  if (DAT_6000_c11c == '\x02') {
    for (iVar5 = 0; iVar5 < 3; iVar5 = iVar5 + 1) {
      for (local_4 = 0; local_4 < 0xf; local_4 = local_4 + 1) {
        for (iVar4 = 0; iVar4 < 4; iVar4 = iVar4 + 1) {
          *(undefined1 *)(iVar4 * 0x2d + local_4 * 3 + iVar5 + -0x3d97) = 1;
        }
      }
    }
  }
  if (DAT_6000_c11c != '\0') {
    DAT_6000_c298 = 1;
  }
  if (((DAT_6000_c11c == '\x03') || (DAT_6000_c11c == '\x05')) || (DAT_6000_c11c == '\x06')) {
    DAT_6000_c2c4 = 1;
  }
  if (((DAT_6000_c11c == '\x01') || (DAT_6000_c11c == '\x04')) || (DAT_6000_c11c == '\x05')) {
    DAT_6000_c2f2 = 1;
  }
  draw_text_box((char *)s_CLASS__6000_48a4,700,0,0x17c,0,0x398,0,1,8);
  print_text(0x3d4,0x17c,1,*(undefined2 *)(DAT_6000_c11c * 2 + 0x118d),8);
  _DAT_6000_c12b = 0.0;
  DAT_6000_c123 = DAT_6000_c90a + DAT_6000_c90e;
  switch(DAT_6000_c11c) {
  case '\0':
    _DAT_6000_c12b = 0.0;
    break;
  case '\x01':
    local_12 = (DAT_6000_c908 * 2 + DAT_6000_c906) / 4;
    _DAT_6000_c12b = (float)local_12;
    break;
  case '\x02':
    local_12 = (DAT_6000_c908 + DAT_6000_c906) / 0x11 + 1;
    _DAT_6000_c12b = (float)local_12;
    break;
  case '\x03':
    local_12 = (DAT_6000_c908 + DAT_6000_c906 * 2) / 7;
    _DAT_6000_c12b = (float)local_12;
    break;
  case '\x04':
    local_12 = (DAT_6000_c908 * 2 + DAT_6000_c906) / 8;
    _DAT_6000_c12b = (float)local_12;
    break;
  case '\x05':
    local_12 = (DAT_6000_c908 + DAT_6000_c906) / 0x12;
    _DAT_6000_c12b = (float)local_12;
    break;
  case '\x06':
    local_12 = (DAT_6000_c908 + DAT_6000_c906 * 2) / 0xc;
    _DAT_6000_c12b = (float)local_12;
  }
  DAT_6000_c129 = DAT_6000_c12d;
  DAT_6000_c127 = DAT_6000_c12b;
  DAT_6000_c125 = DAT_6000_c123;
  draw_text_box((char *)s_PLEASE_SELECT_A_CLASS_BY_HITTING_6000_48ab,0,0,0x1e0,0,0x5dc,0,1,0);
  lVar6 = ftol((double)CONCAT26(4,CONCAT24(DAT_6000_c125 >> 0xf,
                                           (char *)CONCAT22(DAT_6000_c125,
                                                            (char *)s_HEALTH_POINTS__6000_48e9))));
  uVar1 = format_two_numbers((char *)s_SPELL_POINTS__6000_48da,lVar6);
  print_text(0,0x1cc,1,uVar1);
  wait_key();
  DAT_6000_c89e = 0x38;
  DAT_6000_c8a0 = 0x3c;
  DAT_6000_c8a2 = 0;
  DAT_6000_c8a4 = 0;
  DAT_6000_c8a7 = DAT_6000_448a >> 1;
  DAT_6000_c8a6 = DAT_6000_4489 >> 1;
  DAT_6000_c8ea = 0x862;
  DAT_6000_c8ec = 0x597;
  DAT_6000_c173 = 1;
  DAT_6000_c1a2 = 1;
  DAT_6000_c8f6 = 0;
  DAT_6000_c8f8 = 0x38;
  DAT_6000_c8fa = 0x3c;
  DAT_6000_c8fe = 0;
  DAT_6000_c8fc = 300;
  local_14 = DAT_6000_c90e << 1;
  uVar9 = 0;
  uVar1 = 0x8000;
  sVar2 = rand();
  lVar6 = N_LXMUL((long)local_14,(long)sVar2);
  lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar1));
  DAT_6000_c546 = DAT_6000_c90e * 2 + (int)lVar6;
  DAT_6000_c548 = DAT_6000_c546 >> 0xf;
  DAT_6000_1248 = 0xffff;
  DAT_6000_1246 = 0xffff;
  DAT_6000_1244 = 0xffff;
  DAT_6000_1242 = 0xffff;
  DAT_6000_1240 = 0xffff;
  DAT_6000_123e = 0xffff;
  DAT_6000_125a = 0xffff;
  DAT_6000_1258 = 0xffff;
  DAT_6000_1256 = 0xffff;
  DAT_6000_1254 = 0xffff;
  local_12 = 0xffff;
  DAT_6000_124c = 0xbff0000000000000;
  lVar6 = ftol((double)CONCAT44(in_stack_0000ff78,CONCAT22(unaff_SI,unaff_DI)));
  DAT_6000_124a = (undefined2)lVar6;
  save_player((int)DAT_6000_125c);
  generate_section(0);
  clear_screen();
  return;
}


// ==== FUN_3000_5ce5 @ 3000:5ce5 (size 31) callers: FUN_3000_5dc1,FUN_3000_6331

undefined2 __cdecl16far FUN_3000_5ce5(int param_1)

{
  if (param_1 == 0x4f) {
    return 0xe;
  }
  if (param_1 == 0x50) {
    return 0x1c;
  }
  return 0xffec;
}


// ==== FUN_3000_5d06 @ 3000:5d06 (size 181) callers: FUN_3000_5dc1,FUN_3000_6331

int __cdecl16far FUN_3000_5d06(int param_1,int param_2,int param_3,int param_4,int param_5)

{
  short sVar1;
  int iVar2;
  int iVar3;
  long lVar4;
  long lVar5;
  
  if (0x24 < param_5) {
    param_5 = 0x24;
  }
  srand(param_3 + 100);
  lVar5 = 0x8000;
  sVar1 = rand();
  lVar4 = N_LXMUL((long)(param_4 + 100),(long)sVar1);
  lVar4 = F_LDIV(lVar4,lVar5);
  srand((ushort)lVar4);
  lVar5 = 0x8000;
  sVar1 = rand();
  lVar4 = N_LXMUL((long)param_5,(long)sVar1);
  lVar4 = F_LDIV(lVar4,lVar5);
  iVar2 = (int)lVar4 - (param_5 >> 1);
  iVar3 = param_1 + param_2 >> 1;
  if (0x7d < iVar3 + iVar2) {
    iVar2 = -iVar2;
  }
  if (iVar3 + iVar2 < -0x7d) {
    iVar2 = -iVar2;
  }
  return iVar2 + iVar3;
}


// ==== FUN_3000_5dc1 @ 3000:5dc1 (size 1392) callers: FUN_3000_8235

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_5dc1(int param_1,int param_2)

{
  undefined1 uVar1;
  char cVar2;
  char *pcVar3;
  uint uVar4;
  int iVar5;
  undefined2 uVar6;
  undefined4 local_18;
  undefined4 local_14;
  undefined4 local_10;
  undefined4 local_c;
  int local_8;
  int local_6;
  int local_4;
  
  uVar4 = 8;
  print_text(0,0,0,(char *)s_CALCULATING_THE_LANDSCAPE___PLEA_6000_48fd,1);
  for (local_4 = 0; local_4 < 0x40; local_4 = local_4 + 1) {
    for (iVar5 = 0; iVar5 < 0x40; iVar5 = iVar5 + 1) {
      uVar1 = FUN_3000_5ce5((int)*(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4));
      *(undefined1 *)((int)_DAT_6000_cd12 + iVar5 * 0x202 + local_4 * 4) = uVar1;
      uVar1 = FUN_3000_5ce5(((int)*(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4) +
                            (int)*(char *)(iVar5 * 0x40 + DAT_6000_cd74 + local_4 + 0x40)) / 2);
      *(undefined1 *)(iVar5 * 0x202 + DAT_6000_cd12 + local_4 * 4 + 0x202) = uVar1;
      uVar1 = FUN_3000_5ce5((*(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4) * 3 +
                            (int)*(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4)) / 4);
      *(undefined1 *)((int)_DAT_6000_cd12 + iVar5 * 0x202 + local_4 * 4 + 1) = uVar1;
      uVar1 = FUN_3000_5ce5((*(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4) * 3 +
                            (int)*(char *)(iVar5 * 0x40 + DAT_6000_cd74 + local_4 + 0x40)) / 4);
      *(undefined1 *)(iVar5 * 0x202 + DAT_6000_cd12 + local_4 * 4 + 0x203) = uVar1;
      uVar1 = FUN_3000_5ce5(((int)*(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4) +
                            (int)*(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4 + 1)) / 2);
      *(undefined1 *)((int)_DAT_6000_cd12 + iVar5 * 0x202 + local_4 * 4 + 2) = uVar1;
      uVar1 = FUN_3000_5ce5(((int)*(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4) +
                            (int)*(char *)(iVar5 * 0x40 + DAT_6000_cd74 + local_4 + 0x41)) / 2);
      *(undefined1 *)(iVar5 * 0x202 + DAT_6000_cd12 + local_4 * 4 + 0x204) = uVar1;
      uVar1 = FUN_3000_5ce5(((int)*(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4) +
                            *(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4) * 3) / 4);
      *(undefined1 *)((int)_DAT_6000_cd12 + iVar5 * 0x202 + local_4 * 4 + 3) = uVar1;
      uVar1 = FUN_3000_5ce5(((int)*(char *)(DAT_6000_cd74 + iVar5 * 0x40 + local_4) +
                            *(char *)(iVar5 * 0x40 + DAT_6000_cd74 + local_4 + 0x40) * 3) / 4);
      *(undefined1 *)(iVar5 * 0x202 + DAT_6000_cd12 + local_4 * 4 + 0x205) = uVar1;
    }
  }
  for (local_4 = 0; local_4 < 0x40; local_4 = local_4 + 1) {
    *(undefined1 *)((int)_DAT_6000_cd12 + local_4 * 0x202 + 0x100) = 0xfb;
    *(undefined1 *)((int)_DAT_6000_cd12 + local_4 * 4 + -0x7f80) = 0xfb;
  }
  while( true ) {
    if (uVar4 < 2) {
      return;
    }
    uVar4 = (int)uVar4 >> 1;
    if (uVar4 == 0) break;
    local_8 = 0;
    do {
      local_6 = 0;
      local_c = (char *)CONCAT22(_DAT_6000_cd14,(char *)(DAT_6000_cd12 + local_8 * 0x101));
      local_10 = (char *)CONCAT22(_DAT_6000_cd14,
                                  (char *)(uVar4 * 2 + DAT_6000_cd12 + local_8 * 0x101));
      local_14 = (char *)CONCAT22(_DAT_6000_cd14,
                                  (char *)(DAT_6000_cd12 + uVar4 * 0x202 + local_8 * 0x101));
      local_18 = (char *)CONCAT22(_DAT_6000_cd14,
                                  (char *)(DAT_6000_cd12 + uVar4 * 0x204 + local_8 * 0x101));
      while( true ) {
        cVar2 = FUN_3000_5d06((int)*local_14,(int)*local_18,param_1 + local_6 + uVar4,
                              param_2 + local_8 + uVar4 * 2,uVar4,param_1 + local_6 + uVar4,
                              param_2 + local_8 + uVar4,uVar4);
        ((char *)local_14)[uVar4] = cVar2;
        cVar2 = FUN_3000_5d06((int)*local_c,(int)*local_10,param_1 + local_6 + uVar4,
                              param_2 + local_8,uVar4,(int)cVar2);
        uVar6 = (undefined2)((ulong)local_c >> 0x10);
        pcVar3 = (char *)local_c;
        pcVar3[uVar4] = cVar2;
        cVar2 = FUN_3000_5d06((int)cVar2);
        pcVar3[uVar4 * 0x102] = cVar2;
        cVar2 = FUN_3000_5d06((int)*local_c,(int)*local_14,param_1 + local_6,
                              param_2 + local_8 + uVar4,uVar4);
        pcVar3[uVar4 * 0x101] = cVar2;
        cVar2 = FUN_3000_5d06((int)*local_10,(int)*local_18,param_1 + local_6 + uVar4 * 2,
                              param_2 + local_8 + uVar4,uVar4);
        uVar6 = (undefined2)((ulong)local_10 >> 0x10);
        ((char *)local_10)[uVar4 * 0x101] = cVar2;
        local_6 = local_6 + uVar4 * 2;
        if (0xff < local_6) break;
        local_c = local_10;
        local_14 = local_18;
        local_10 = (char *)CONCAT22(uVar6,(char *)local_10 + uVar4 * 2);
        local_18 = (char *)CONCAT22(local_18._2_2_,(char *)local_18 + uVar4 * 2);
      }
      local_8 = local_8 + uVar4 * 2;
    } while (local_8 < 0x80);
  }
  return;
}


// ==== FUN_3000_6331 @ 3000:6331 (size 902) callers: FUN_3000_8235

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_6331(int param_1,int param_2)

{
  char cVar1;
  char *pcVar2;
  uint uVar3;
  int iVar4;
  undefined2 uVar5;
  undefined4 local_14;
  undefined4 local_10;
  undefined4 local_c;
  undefined4 local_8;
  int local_4;
  
  uVar3 = 0x80;
  print_text(0,0,0,(char *)s_CALCULATING_THE_LANDSCAPE___PLEA_6000_48fd,1);
  cVar1 = FUN_3000_5ce5((int)*(char *)(DAT_6000_cd74 + (param_2 / 0x80) * 0x40 + param_1 / 0x100));
  *_DAT_6000_cd12 = cVar1;
  cVar1 = FUN_3000_5ce5((int)*(char *)(DAT_6000_cd74 + (param_2 / 0x80) * 0x40 + param_1 / 0x100 + 1
                                      ));
  ((char *)_DAT_6000_cd12)[0x100] = cVar1;
  cVar1 = FUN_3000_5ce5((int)*(char *)(DAT_6000_cd74 + (param_2 / 0x80) * 0x40 + param_1 / 0x100 +
                                      0x40));
  ((char *)_DAT_6000_cd12)[-0x7f80] = cVar1;
  cVar1 = FUN_3000_5ce5((int)*(char *)(DAT_6000_cd74 + (param_2 / 0x80) * 0x40 + param_1 / 0x100 +
                                      0x41));
  ((char *)_DAT_6000_cd12)[-0x7e80] = cVar1;
  cVar1 = FUN_3000_5d06((int)*_DAT_6000_cd12,(int)((char *)_DAT_6000_cd12)[0x100],param_1 + 0x80,
                        param_2,0x80);
  ((char *)_DAT_6000_cd12)[0x80] = cVar1;
  cVar1 = FUN_3000_5d06((int)*_DAT_6000_cd12,(int)((char *)_DAT_6000_cd12)[0x100],param_1 + 0x80,
                        param_2 + 0x80,0x80);
  ((char *)_DAT_6000_cd12)[-0x7f00] = cVar1;
  while( true ) {
    if (uVar3 < 2) {
      return;
    }
    uVar3 = (int)uVar3 >> 1;
    if (uVar3 == 0) break;
    local_4 = 0;
    do {
      iVar4 = 0;
      local_8 = (char *)CONCAT22(_DAT_6000_cd14,DAT_6000_cd12 + local_4 * 0x101);
      local_c = (char *)CONCAT22(_DAT_6000_cd14,DAT_6000_cd12 + local_4 * 0x101 + uVar3 * 2);
      local_10 = (char *)CONCAT22(_DAT_6000_cd14,DAT_6000_cd12 + local_4 * 0x101 + uVar3 * 0x202);
      local_14 = (char *)CONCAT22(_DAT_6000_cd14,DAT_6000_cd12 + local_4 * 0x101 + uVar3 * 0x204);
      while( true ) {
        cVar1 = FUN_3000_5d06((int)*local_10,(int)*local_14,param_1 + iVar4 + uVar3,
                              param_2 + local_4 + uVar3 * 2,uVar3,param_1 + iVar4 + uVar3,
                              param_2 + local_4 + uVar3,uVar3);
        ((char *)local_10)[uVar3] = cVar1;
        cVar1 = FUN_3000_5d06((int)*local_8,(int)*local_c,param_1 + iVar4 + uVar3,param_2 + local_4,
                              uVar3,(int)cVar1);
        uVar5 = (undefined2)((ulong)local_8 >> 0x10);
        pcVar2 = (char *)local_8;
        pcVar2[uVar3] = cVar1;
        cVar1 = FUN_3000_5d06((int)cVar1);
        pcVar2[uVar3 * 0x102] = cVar1;
        cVar1 = FUN_3000_5d06((int)*local_8,(int)*local_10,param_1 + iVar4,param_2 + local_4 + uVar3
                              ,uVar3);
        pcVar2[uVar3 * 0x101] = cVar1;
        cVar1 = FUN_3000_5d06((int)*local_c,(int)*local_14,param_1 + iVar4 + uVar3 * 2,
                              param_2 + local_4 + uVar3,uVar3);
        uVar5 = (undefined2)((ulong)local_c >> 0x10);
        ((char *)local_c)[uVar3 * 0x101] = cVar1;
        iVar4 = iVar4 + uVar3 * 2;
        if (0xff < iVar4) break;
        local_8 = local_c;
        local_10 = local_14;
        local_c = (char *)CONCAT22(uVar5,(char *)local_c + uVar3 * 2);
        local_14 = (char *)CONCAT22(local_14._2_2_,(char *)local_14 + uVar3 * 2);
      }
      local_4 = local_4 + uVar3 * 2;
    } while (local_4 < 0x80);
  }
  return;
}


// ==== FUN_3000_66b7 @ 3000:66b7 (size 50) callers: FUN_3000_66e9,FUN_4000_10ee

void __cdecl16far FUN_3000_66b7(undefined1 param_1,undefined1 param_2)

{
  undefined1 local_12;
  undefined1 local_11;
  undefined1 local_10;
  undefined1 local_f;
  
  local_10 = param_1;
  local_f = param_2;
  local_12 = 0;
  local_11 = 0x10;
  FUN_1000_2a03(0x10,&local_12,&local_12);
  return;
}


// ==== FUN_3000_66e9 @ 3000:66e9 (size 923) callers: FUN_3000_6b5b,FUN_3000_71db,FUN_3000_77b2,FUN_3000_7af1,FUN_3000_7cb2

void __cdecl16far FUN_3000_66e9(void)

{
  char cVar1;
  char local_6;
  uint local_4;
  
  for (local_4 = 0; (int)local_4 < 0x300; local_4 = local_4 + 1) {
    ((undefined1 *)&DAT_6000_cdd7)[local_4] = 0;
  }
  DAT_6000_cddb = 5;
  DAT_6000_9bdc = 0xd9;
  DAT_6000_cddd = 0x3f;
  DAT_6000_cdde = 0x3f;
  DAT_6000_cddf = 0x17;
  DAT_6000_cde0 = 0x3f;
  DAT_6000_cde1 = 0x3f;
  DAT_6000_cde2 = 0x17;
  if (DAT_6000_cdd5 < 0x100) {
    DAT_6000_cde3 = 0;
    DAT_6000_cde4 = 0x1e;
    DAT_6000_cde5 = 0;
    DAT_6000_cde6 = 0;
    DAT_6000_cde7 = 0x27;
    DAT_6000_cde8 = 0;
    DAT_6000_cde9 = 0;
    DAT_6000_cdea = 0x33;
    DAT_6000_cdeb = 0;
    DAT_6000_cdec = 0;
    DAT_6000_cded = 0x3f;
    DAT_6000_cdee = 0;
    DAT_6000_cdef = 10;
    DAT_6000_9bf0 = 0xda;
    DAT_6000_cdf1 = 0;
    DAT_6000_cdf2 = 0x11;
    DAT_6000_cdf3 = 0x2f;
    DAT_6000_cdf4 = 0;
    DAT_6000_cdf5 = 0x15;
    DAT_6000_9bf6 = 0xda;
    DAT_6000_cdf7 = 0;
    DAT_6000_cdf8 = 0x12;
    DAT_6000_cdf9 = 0x2e;
    DAT_6000_cdfa = 5;
    DAT_6000_cdfb = 0x18;
    DAT_6000_cdfc = 0x29;
    DAT_6000_cdfd = 10;
    DAT_6000_cdfe = 0x16;
    DAT_6000_cdff = 0x16;
    DAT_6000_ce00 = 0x16;
    DAT_6000_ce01 = 0x2c;
    DAT_6000_ce02 = 0x30;
    DAT_6000_ce03 = 0x2c;
    DAT_6000_ce04 = 0x3f;
    DAT_6000_ce05 = 0x3f;
    DAT_6000_ce06 = 0x3f;
    for (local_4 = 0; (int)local_4 < 0x10; local_4 = local_4 + 1) {
      FUN_3000_66b7(local_4 & 0xff,local_4 & 0xff);
    }
  }
  else {
    for (local_4 = 4; (int)local_4 < 0x10; local_4 = local_4 + 1) {
      ((undefined1 *)&DAT_6000_cdd7)[local_4 * 3] = (char)local_4 * -4 + '?';
    }
    for (local_4 = 0x30; (int)local_4 < 0x40; local_4 = local_4 + 1) {
      ((undefined1 *)&DAT_6000_cdd7)[local_4 * 3] = 0x28;
    }
    for (local_4 = 0x10; (int)local_4 < 0x20; local_4 = local_4 + 1) {
      ((undefined1 *)&DAT_6000_cdd7)[local_4 * 3] = (char)local_4 + -6;
    }
    for (local_4 = 4; (int)local_4 < 0x10; local_4 = local_4 + 1) {
      ((undefined1 *)&DAT_6000_cdd8)[local_4 * 3] = (char)local_4 * '\x02' + ' ';
    }
    for (local_4 = 0x10; (int)local_4 < 0x30; local_4 = local_4 + 1) {
      ((undefined1 *)&DAT_6000_cdd8)[local_4 * 3] = '@' - (char)((int)local_4 / 2);
    }
    for (local_4 = 0x30; (int)local_4 < 0x40; local_4 = local_4 + 1) {
      ((undefined1 *)&DAT_6000_cdd8)[local_4 * 3] = 'Z' - (char)local_4;
    }
    for (local_4 = 0x40; (int)local_4 < 0x60; local_4 = local_4 + 1) {
      cVar1 = (char)local_4 + -0x20;
      ((undefined1 *)&DAT_6000_cdd9)[local_4 * 3] = cVar1;
      ((undefined1 *)&DAT_6000_cdd8)[local_4 * 3] = cVar1;
      ((undefined1 *)&DAT_6000_cdd7)[local_4 * 3] = cVar1;
    }
    for (local_4 = 0x60; (int)local_4 < 0x80; local_4 = local_4 + 1) {
      cVar1 = -0x61 - (char)local_4;
      ((undefined1 *)&DAT_6000_cdd9)[local_4 * 3] = cVar1;
      ((undefined1 *)&DAT_6000_cdd8)[local_4 * 3] = cVar1;
      ((undefined1 *)&DAT_6000_cdd7)[local_4 * 3] = cVar1;
    }
    for (local_4 = 0x80; (int)local_4 < 0x100; local_4 = local_4 + 1) {
      ((undefined1 *)&DAT_6000_cdd7)[local_4 * 3] = *(undefined1 *)(local_4 * 3 + -0x33a9);
      ((undefined1 *)&DAT_6000_cdd8)[local_4 * 3] = *(undefined1 *)(local_4 * 3 + -0x33a8);
      ((undefined1 *)&DAT_6000_cdd9)[local_4 * 3] = *(undefined1 *)(local_4 * 3 + -0x33a7);
      local_6 = (char)((int)(0x200 - local_4) / 0x60);
      if ((char)((undefined1 *)&DAT_6000_cdd7)[local_4 * 3] < '\v') {
        ((undefined1 *)&DAT_6000_cdd7)[local_4 * 3] = 0;
      }
      else {
        ((undefined1 *)&DAT_6000_cdd7)[local_4 * 3] =
             ((undefined1 *)&DAT_6000_cdd7)[local_4 * 3] - local_6;
      }
      if ((char)((undefined1 *)&DAT_6000_cdd8)[local_4 * 3] < '\v') {
        ((undefined1 *)&DAT_6000_cdd8)[local_4 * 3] = 0;
      }
      else {
        ((undefined1 *)&DAT_6000_cdd8)[local_4 * 3] =
             ((undefined1 *)&DAT_6000_cdd8)[local_4 * 3] - local_6;
      }
      if ((char)((undefined1 *)&DAT_6000_cdd9)[local_4 * 3] < '\v') {
        ((undefined1 *)&DAT_6000_cdd9)[local_4 * 3] = 0;
      }
      else {
        ((undefined1 *)&DAT_6000_cdd9)[local_4 * 3] =
             ((undefined1 *)&DAT_6000_cdd9)[local_4 * 3] - local_6;
      }
    }
  }
  DAT_6000_d0d4 = 9;
  DAT_6000_d0d5 = 8;
  DAT_6000_d0d6 = 8;
  FUN_4000_100f();
  return;
}


// ==== FUN_3000_6a84 @ 3000:6a84 (size 215) callers: FUN_3000_77b2,FUN_3000_7cb2

void __cdecl16far FUN_3000_6a84(void)

{
  undefined1 extraout_AH;
  undefined1 extraout_AH_00;
  undefined1 extraout_AH_01;
  undefined1 extraout_AH_02;
  undefined1 extraout_AH_03;
  undefined1 extraout_AH_04;
  undefined1 extraout_AH_05;
  undefined1 extraout_AH_06;
  undefined1 extraout_AH_07;
  undefined1 extraout_AH_08;
  undefined1 extraout_AH_09;
  undefined1 extraout_AH_10;
  undefined1 extraout_AH_11;
  undefined1 extraout_AH_12;
  
  FUN_4000_0f7a(1,9);
  FUN_4000_0f7a(CONCAT11(extraout_AH,2),CONCAT11(extraout_AH,0x3e));
  FUN_4000_0f7a(CONCAT11(extraout_AH_00,3),CONCAT11(extraout_AH_00,0x32));
  FUN_4000_0f7a(CONCAT11(extraout_AH_01,4),CONCAT11(extraout_AH_01,0x12));
  FUN_4000_0f7a(CONCAT11(extraout_AH_02,5),CONCAT11(extraout_AH_02,0x10));
  FUN_4000_0f7a(CONCAT11(extraout_AH_03,6),CONCAT11(extraout_AH_03,10));
  FUN_4000_0f7a(CONCAT11(extraout_AH_04,7),CONCAT11(extraout_AH_04,2));
  FUN_4000_0f7a(CONCAT11(extraout_AH_05,8),CONCAT11(extraout_AH_05,0x22));
  FUN_4000_0f7a(CONCAT11(extraout_AH_06,9),CONCAT11(extraout_AH_06,0x1a));
  FUN_4000_0f7a(CONCAT11(extraout_AH_07,10),CONCAT11(extraout_AH_07,0x2a));
  FUN_4000_0f7a(CONCAT11(extraout_AH_08,0xb),CONCAT11(extraout_AH_08,0x30));
  FUN_4000_0f7a(CONCAT11(extraout_AH_09,0xc),CONCAT11(extraout_AH_09,0x38));
  FUN_4000_0f7a(CONCAT11(extraout_AH_10,0xd),CONCAT11(extraout_AH_10,7));
  FUN_4000_0f7a(CONCAT11(extraout_AH_11,0xe),CONCAT11(extraout_AH_11,0x3f));
  FUN_4000_0f7a(CONCAT11(extraout_AH_12,0xf),CONCAT11(extraout_AH_12,0x3f));
  return;
}


// ==== FUN_3000_6b5b @ 3000:6b5b (size 1475) callers: 

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_6b5b(int param_1,int param_2)

{
  uint uVar1;
  char *pcVar2;
  int iVar3;
  int iVar4;
  undefined2 uVar5;
  undefined1 local_1c;
  int local_1a;
  int local_12;
  int local_10;
  int local_e;
  undefined4 local_c;
  int local_8;
  int local_6;
  int local_4;
  
  local_1a = 4;
  local_1c = 0xff;
  FUN_3000_66e9();
  if (DAT_6000_cdd5 != 0x100) {
    local_1a = 0x20;
    local_1c = 0xd;
  }
  fill_rect(param_1,param_2,param_1 + 0x2ff,param_2 + 0x1ff,1);
  for (iVar3 = 0; iVar3 < 0x100; iVar3 = iVar3 + 1) {
    local_c = (char *)CONCAT22(_DAT_6000_cd14,
                               (char *)((int)(undefined2 *)&DAT_6000_7f7e +
                                       DAT_6000_cd12 + iVar3 + 1));
    local_8 = 0x1ff;
    local_6 = 0x1ff;
    local_4 = 0x1ff;
    for (iVar4 = 0x1ff; -1 < iVar4; iVar4 = iVar4 + -1) {
      if (iVar4 % 4 == 0) {
        uVar5 = (undefined2)((ulong)local_c >> 0x10);
        pcVar2 = (char *)local_c;
        local_12 = ((int)*local_c + (int)pcVar2[1] + (int)pcVar2[1]) * 2;
        local_10 = ((int)*local_c + (int)*local_c + (int)pcVar2[1]) * 2;
        local_e = *local_c * 6;
        local_c = (char *)CONCAT22(uVar5,pcVar2 + -0x101);
      }
      pcVar2 = (char *)local_c;
      uVar5 = (undefined2)((ulong)local_c >> 0x10);
      if ((iVar4 % 4 == 1) || (iVar4 % 4 == 2)) {
        local_12 = (*local_c * 3 + pcVar2[1] * 6 + (int)pcVar2[0x101] + (int)pcVar2[0x102] +
                   (int)pcVar2[0x102]) / 2;
        local_10 = (*local_c * 6 + pcVar2[1] * 3 + (int)pcVar2[0x101] + (int)pcVar2[0x101] +
                   (int)pcVar2[0x102]) / 2;
        local_e = (((int)*local_c + (int)*local_c + (int)*local_c + (int)pcVar2[0x101]) * 3) / 2;
      }
      if (iVar4 % 4 == 3) {
        local_12 = ((int)*local_c + (int)pcVar2[1] + (int)pcVar2[1] + pcVar2[0x101] * 3 +
                   pcVar2[0x102] * 6) / 2;
        local_10 = ((int)*local_c + (int)*local_c + (int)pcVar2[1] + pcVar2[0x101] * 6 +
                   pcVar2[0x102] * 3) / 2;
        local_e = (((int)*local_c + pcVar2[0x101] * 3) * 3) / 2;
      }
      if (iVar4 - local_e < local_4) {
        if (iVar4 == 0x1ff) {
          (*DAT_6000_962a)(0x4000,param_1 + iVar3 * 3,(param_2 + 0x1ff) - local_e,
                           param_1 + iVar3 * 3,param_2 + 0x200,
                           CONCAT11((char)((uint)(iVar4 - local_e) >> 8),local_1c));
        }
        else if (0 < local_e) {
          (*DAT_6000_9632)(0x4000,param_1 + iVar3 * 3,(param_2 + iVar4) - local_e,
                           CONCAT11((char)((uint)(local_e / local_1a) >> 8),
                                    (char)(local_e / local_1a) + '\x02'));
          uVar1 = ((param_2 + iVar4) - local_e) + 1;
          if (uVar1 == (param_2 + local_4) - 1U) {
            (*DAT_6000_9632)(0x4000,param_1 + iVar3 * 3,((param_2 + iVar4) - local_e) + 1,
                             uVar1 & 0xff00);
          }
          else {
            uVar1 = ((param_2 + iVar4) - local_e) + 1;
            if ((int)uVar1 < param_2 + local_4 + -1) {
              (*DAT_6000_962a)(0x4000,param_1 + iVar3 * 3,((param_2 + iVar4) - local_e) + 1,
                               param_1 + iVar3 * 3,param_2 + local_4,uVar1 & 0xff00);
            }
          }
        }
        local_4 = iVar4 - local_e;
      }
      if (iVar4 - local_10 < local_6) {
        if (iVar4 == 0x1ff) {
          (*DAT_6000_962a)(0x4000,param_1 + iVar3 * 3 + 1,(param_2 + 0x1ff) - local_10,
                           param_1 + iVar3 * 3 + 1,param_2 + 0x200,
                           CONCAT11((char)((uint)(iVar4 - local_10) >> 8),local_1c));
        }
        else if (0 < local_10) {
          (*DAT_6000_9632)(0x4000,param_1 + iVar3 * 3 + 1,(param_2 + iVar4) - local_10,
                           CONCAT11((char)((uint)(local_10 / local_1a) >> 8),
                                    (char)(local_10 / local_1a) + '\x02'));
          uVar1 = ((param_2 + iVar4) - local_10) + 1;
          if (uVar1 == (param_2 + local_6) - 1U) {
            (*DAT_6000_9632)(0x4000,param_1 + iVar3 * 3 + 1,((param_2 + iVar4) - local_10) + 1,
                             uVar1 & 0xff00);
          }
          else {
            uVar1 = ((param_2 + iVar4) - local_10) + 1;
            if ((int)uVar1 < param_2 + local_6 + -1) {
              (*DAT_6000_962a)(0x4000,param_1 + iVar3 * 3 + 1,((param_2 + iVar4) - local_10) + 1,
                               param_1 + iVar3 * 3 + 1,param_2 + local_6,uVar1 & 0xff00);
            }
          }
        }
        local_6 = iVar4 - local_10;
      }
      if (iVar4 - local_12 < local_8) {
        if (iVar4 == 0x1ff) {
          (*DAT_6000_962a)(0x4000,param_1 + iVar3 * 3 + 2,(param_2 + 0x1ff) - local_12,
                           param_1 + iVar3 * 3 + 2,param_2 + 0x200,
                           CONCAT11((char)((uint)(iVar4 - local_12) >> 8),local_1c));
        }
        else if (0 < local_12) {
          (*DAT_6000_9632)(0x4000,param_1 + iVar3 * 3 + 2,(param_2 + iVar4) - local_12,
                           CONCAT11((char)((uint)(local_12 / local_1a) >> 8),
                                    (char)(local_12 / local_1a) + '\x02'));
          uVar1 = ((param_2 + iVar4) - local_12) + 1;
          if (uVar1 == (param_2 + local_8) - 1U) {
            (*DAT_6000_9632)(0x4000,param_1 + iVar3 * 3 + 2,((param_2 + iVar4) - local_12) + 1,
                             uVar1 & 0xff00);
          }
          else {
            uVar1 = ((param_2 + iVar4) - local_12) + 1;
            if ((int)uVar1 < param_2 + local_8 + -1) {
              (*DAT_6000_962a)(0x4000,param_1 + iVar3 * 3 + 2,((param_2 + iVar4) - local_12) + 1,
                               param_1 + iVar3 * 3 + 2,param_2 + local_8,uVar1 & 0xff00);
            }
          }
        }
        local_8 = iVar4 - local_12;
      }
    }
  }
  return;
}


// ==== FUN_3000_71db @ 3000:71db (size 1495) callers: 

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

int __cdecl16far FUN_3000_71db(int param_1,int param_2)

{
  int iVar1;
  uint uVar2;
  int iVar3;
  int iVar4;
  char *pcVar5;
  int iVar6;
  int iVar7;
  undefined2 uVar8;
  int local_12;
  int local_10;
  int local_e;
  undefined4 local_c;
  int local_8;
  int local_6;
  int local_4;
  
  FUN_3000_66e9();
  iVar1 = fill_rect(param_1,param_2,param_1 + 0x2ff,param_2 + 0x17f,1);
  for (iVar6 = 0; iVar6 < 0x100; iVar6 = iVar6 + 1) {
    local_c = (char *)CONCAT22(_DAT_6000_cd14,
                               (char *)((int)(undefined2 *)&DAT_6000_7f7e +
                                       DAT_6000_cd12 + iVar6 + 1));
    iVar1 = 0x17f;
    local_8 = 0x17f;
    local_6 = 0x17f;
    local_4 = 0x17f;
    for (iVar7 = 0x17f; -1 < iVar7; iVar7 = iVar7 + -1) {
      uVar8 = (undefined2)((ulong)local_c >> 0x10);
      pcVar5 = (char *)local_c;
      if ((((int)pcVar5[-2] <= *local_c + 1) || (iVar1 = iVar7 / 3, iVar7 % 3 != 2)) ||
         (iVar7 == 0x17f)) {
        if (iVar7 % 3 == 0) {
          local_12 = (int)*local_c + (int)pcVar5[1] + (int)pcVar5[1];
          local_10 = (int)*local_c + (int)*local_c + (int)pcVar5[1];
          local_e = *local_c * 3;
          local_c = (char *)CONCAT22(uVar8,pcVar5 + -0x101);
        }
        pcVar5 = (char *)local_c;
        uVar8 = (undefined2)((ulong)local_c >> 0x10);
        if (iVar7 % 3 == 1) {
          local_12 = (((int)*local_c + (int)pcVar5[1] + (int)pcVar5[1]) * 2 + (int)pcVar5[0x101] +
                      (int)pcVar5[0x102] + (int)pcVar5[0x102]) / 3;
          local_10 = (((int)*local_c + (int)*local_c + (int)pcVar5[1]) * 2 + (int)pcVar5[0x101] +
                      (int)pcVar5[0x101] + (int)pcVar5[0x102]) / 3;
          local_e = (int)*local_c + (int)*local_c + (int)pcVar5[0x101];
        }
        if (iVar7 % 3 == 2) {
          local_12 = ((int)*local_c + (int)pcVar5[1] + (int)pcVar5[1] +
                     ((int)pcVar5[0x101] + (int)pcVar5[0x102] + (int)pcVar5[0x102]) * 2) / 3;
          local_10 = ((int)*local_c + (int)*local_c + (int)pcVar5[1] +
                     ((int)pcVar5[0x101] + (int)pcVar5[0x101] + (int)pcVar5[0x102]) * 2) / 3;
          local_e = (int)*local_c + (int)pcVar5[0x101] + (int)pcVar5[0x101];
        }
        iVar1 = local_e + local_e / 2;
        iVar3 = local_10 + local_10 / 2;
        iVar4 = local_12 + local_12 / 2;
        if (iVar7 - iVar1 < local_4) {
          if (iVar7 == 0x17f) {
            (*DAT_6000_962a)(0x4000,param_1 + iVar6 * 3,(param_2 + 0x17f) - iVar1,
                             param_1 + iVar6 * 3,param_2 + 0x17f,
                             CONCAT11((char)((uint)(iVar7 - iVar1) >> 8),0xd));
          }
          else if (0 < local_e) {
            (*DAT_6000_9632)(0x4000,param_1 + iVar6 * 3,(param_2 + iVar7) - iVar1,
                             CONCAT11((char)((uint)(local_e / 0x10) >> 8),
                                      (char)(local_e / 0x10) + '\x02'));
            uVar2 = ((param_2 + iVar7) - iVar1) + 1;
            if (uVar2 == (param_2 + local_4) - 1U) {
              (*DAT_6000_9632)(0x4000,param_1 + iVar6 * 3,((param_2 + iVar7) - iVar1) + 1,
                               uVar2 & 0xff00);
            }
            else {
              uVar2 = ((param_2 + iVar7) - iVar1) + 1;
              if ((int)uVar2 < param_2 + local_4 + -1) {
                (*DAT_6000_962a)(0x4000,param_1 + iVar6 * 3,((param_2 + iVar7) - iVar1) + 1,
                                 param_1 + iVar6 * 3,param_2 + local_4 + -1,uVar2 & 0xff00);
              }
            }
          }
          local_4 = iVar7 - iVar1;
        }
        if (iVar7 - iVar3 < local_6) {
          if (iVar7 == 0x17f) {
            (*DAT_6000_962a)(0x4000,param_1 + iVar6 * 3 + 1,(param_2 + 0x17f) - iVar3,
                             param_1 + iVar6 * 3 + 1,param_2 + 0x17f,
                             CONCAT11((char)((uint)(iVar7 - iVar3) >> 8),0xd));
          }
          else if (0 < local_10) {
            (*DAT_6000_9632)(0x4000,param_1 + iVar6 * 3 + 1,(param_2 + iVar7) - iVar3,
                             CONCAT11((char)((uint)(local_10 / 0x10) >> 8),
                                      (char)(local_10 / 0x10) + '\x02'));
            uVar2 = ((param_2 + iVar7) - iVar3) + 1;
            if (uVar2 == (param_2 + local_6) - 1U) {
              (*DAT_6000_9632)(0x4000,param_1 + iVar6 * 3 + 1,((param_2 + iVar7) - iVar3) + 1,
                               uVar2 & 0xff00);
            }
            else {
              uVar2 = ((param_2 + iVar7) - iVar3) + 1;
              if ((int)uVar2 < param_2 + local_6 + -1) {
                (*DAT_6000_962a)(0x4000,param_1 + iVar6 * 3 + 1,((param_2 + iVar7) - iVar3) + 1,
                                 param_1 + iVar6 * 3 + 1,param_2 + local_6 + -1,uVar2 & 0xff00);
              }
            }
          }
          local_6 = iVar7 - iVar3;
        }
        iVar1 = iVar7 - iVar4;
        if (iVar1 < local_8) {
          if (iVar7 == 0x17f) {
            (*DAT_6000_962a)(0x4000,param_1 + iVar6 * 3 + 2,(param_2 + 0x17f) - iVar4,
                             param_1 + iVar6 * 3 + 2,param_2 + 0x17f,
                             CONCAT11((char)((uint)iVar1 >> 8),0xd));
          }
          else if (0 < local_12) {
            (*DAT_6000_9632)(0x4000,param_1 + iVar6 * 3 + 2,(param_2 + iVar7) - iVar4,
                             CONCAT11((char)((uint)(local_12 / 0x10) >> 8),
                                      (char)(local_12 / 0x10) + '\x02'));
            uVar2 = ((param_2 + iVar7) - iVar4) + 1;
            if (uVar2 == (param_2 + local_8) - 1U) {
              (*DAT_6000_9632)(0x4000,param_1 + iVar6 * 3 + 2,((param_2 + iVar7) - iVar4) + 1,
                               uVar2 & 0xff00);
            }
            else {
              uVar2 = ((param_2 + iVar7) - iVar4) + 1;
              if ((int)uVar2 < param_2 + local_8 + -1) {
                (*DAT_6000_962a)(0x4000,param_1 + iVar6 * 3 + 2,((param_2 + iVar7) - iVar4) + 1,
                                 param_1 + iVar6 * 3 + 2,param_2 + local_8 + -1,uVar2 & 0xff00);
              }
            }
          }
          iVar1 = iVar7 - iVar4;
          local_8 = iVar1;
        }
      }
    }
  }
  return iVar1;
}


// ==== FUN_3000_77b2 @ 3000:77b2 (size 831) callers: 

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

int __cdecl16far FUN_3000_77b2(int param_1,int param_2)

{
  int iVar1;
  uint uVar2;
  char *pcVar3;
  int iVar4;
  int iVar5;
  undefined2 uVar6;
  undefined1 local_14;
  int local_12;
  int local_10;
  int local_e;
  int local_c;
  undefined4 local_a;
  int local_6;
  int local_4;
  
  if (DAT_6000_cd94 == 0) {
    local_14 = 0;
  }
  else {
    local_14 = 0xc;
  }
  if (DAT_6000_cd94 < 6) {
    FUN_3000_6a84();
  }
  else {
    FUN_3000_66e9();
    local_14 = 0xd;
  }
  iVar1 = fill_rect(param_1,param_2,param_1 + 0x1ff,param_2 + 0xff,1);
  for (iVar4 = 0; iVar4 < 0x100; iVar4 = iVar4 + 1) {
    local_a = (char *)CONCAT22(_DAT_6000_cd14,
                               (char *)((int)(undefined2 *)&DAT_6000_7f7e +
                                       DAT_6000_cd12 + iVar4 + 1));
    iVar1 = 0xff;
    local_6 = 0xff;
    local_4 = 0xff;
    for (iVar5 = 0xff; -1 < iVar5; iVar5 = iVar5 + -1) {
      uVar6 = (undefined2)((ulong)local_a >> 0x10);
      pcVar3 = (char *)local_a;
      if ((((int)pcVar3[-2] <= *local_a + 1) || (iVar1 = iVar5 / 2, iVar5 % 2 == 0)) ||
         (iVar5 == 0xff)) {
        if (iVar5 % 2 == 0) {
          local_e = ((int)*local_a + (int)pcVar3[1]) * 2;
          local_c = (int)*local_a << 2;
          local_a = (char *)CONCAT22(uVar6,pcVar3 + -0x101);
        }
        if (iVar5 % 2 == 1) {
          uVar6 = (undefined2)((ulong)local_a >> 0x10);
          pcVar3 = (char *)local_a;
          local_e = (int)*local_a + (int)pcVar3[1] + (int)pcVar3[0x101] + (int)pcVar3[0x102];
          local_c = ((int)*local_a + (int)pcVar3[0x101]) * 2;
        }
        if (DAT_6000_cd94 == 6) {
          local_10 = local_c;
          local_12 = local_e;
        }
        else {
          local_10 = local_c >> 1;
          local_12 = local_e >> 1;
        }
        if (iVar5 - local_10 < local_4) {
          if (iVar5 == 0xff) {
            (*DAT_6000_962a)(0x4000,param_1 + iVar4 * 2,(param_2 + 0xff) - local_10,
                             param_1 + iVar4 * 2,param_2 + 0xff,
                             CONCAT11((char)((uint)(iVar5 - local_10) >> 8),local_14));
          }
          else if (0 < local_c) {
            (*DAT_6000_9632)(0x4000,param_1 + iVar4 * 2,(param_2 + iVar5) - local_10,
                             CONCAT11((char)((uint)(local_c / 0x14) >> 8),
                                      (char)(local_c / 0x14) + '\x02'));
            uVar2 = ((param_2 + iVar5) - local_10) + 1;
            if (uVar2 == (param_2 + local_4) - 1U) {
              (*DAT_6000_9632)(0x4000,param_1 + iVar4 * 2,((param_2 + iVar5) - local_10) + 1,
                               uVar2 & 0xff00);
            }
            else {
              uVar2 = ((param_2 + iVar5) - local_10) + 1;
              if ((int)uVar2 < param_2 + local_4 + -1) {
                (*DAT_6000_962a)(0x4000,param_1 + iVar4 * 2,((param_2 + iVar5) - local_10) + 1,
                                 param_1 + iVar4 * 2,param_2 + local_4 + -1,uVar2 & 0xff00);
              }
            }
          }
          local_4 = iVar5 - local_10;
        }
        iVar1 = iVar5 - local_12;
        if (iVar1 < local_6) {
          if (iVar5 == 0xff) {
            (*DAT_6000_962a)(0x4000,param_1 + iVar4 * 2 + 1,(param_2 + 0xff) - local_12,
                             param_1 + iVar4 * 2 + 1,param_2 + 0xff,
                             CONCAT11((char)((uint)iVar1 >> 8),local_14));
          }
          else if (0 < local_e) {
            (*DAT_6000_9632)(0x4000,param_1 + iVar4 * 2 + 1,(param_2 + iVar5) - local_12,
                             CONCAT11((char)((uint)(local_e / 0x14) >> 8),
                                      (char)(local_e / 0x14) + '\x02'));
            uVar2 = ((param_2 + iVar5) - local_12) + 1;
            if (uVar2 == (param_2 + local_6) - 1U) {
              (*DAT_6000_9632)(0x4000,param_1 + iVar4 * 2 + 1,((param_2 + iVar5) - local_12) + 1,
                               uVar2 & 0xff00);
            }
            else {
              uVar2 = ((param_2 + iVar5) - local_12) + 1;
              if ((int)uVar2 < param_2 + local_6 + -1) {
                (*DAT_6000_962a)(0x4000,param_1 + iVar4 * 2 + 1,((param_2 + iVar5) - local_12) + 1,
                                 param_1 + iVar4 * 2 + 1,param_2 + local_6 + -1,uVar2 & 0xff00);
              }
            }
          }
          iVar1 = iVar5 - local_12;
          local_6 = iVar1;
        }
      }
    }
  }
  return iVar1;
}


// ==== FUN_3000_7af1 @ 3000:7af1 (size 406) callers: 

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_7af1(int param_1,int param_2)

{
  uint uVar1;
  int iVar2;
  int local_e;
  undefined4 local_c;
  int local_6;
  int local_4;
  
  FUN_3000_66e9();
  fill_rect(param_1,param_2,param_1 + 0xff,param_2 + 0xff,1);
  for (local_4 = 0; local_4 < 0x100; local_4 = local_4 + 1) {
    local_c = (char *)CONCAT22(_DAT_6000_cd14,
                               (char *)((int)(undefined2 *)&DAT_6000_7f7e +
                                       DAT_6000_cd12 + local_4 + 1));
    local_6 = 0xff;
    for (iVar2 = 0xff; -1 < iVar2; iVar2 = iVar2 + -1) {
      if (iVar2 % 2 == 0) {
        local_e = (int)*local_c << 2;
        local_c = (char *)CONCAT22(local_c._2_2_,(char *)local_c + -0x101);
      }
      if (iVar2 % 2 == 1) {
        local_e = ((int)*local_c + (int)((char *)local_c)[0x101]) * 2;
      }
      if (iVar2 - local_e < local_6) {
        if (iVar2 == 0xff) {
          (*DAT_6000_962a)(0x4000,param_1 + local_4,(param_2 + 0xff) - local_e,param_1 + local_4,
                           param_2 + 0xff,CONCAT11((char)((uint)(iVar2 - local_e) >> 8),0xff));
        }
        else if (0 < local_e) {
          (*DAT_6000_9632)(0x4000,param_1 + local_4,(param_2 + iVar2) - local_e,
                           CONCAT11((char)((uint)(local_e / 3) >> 8),(char)(local_e / 3) + '\x02'));
          uVar1 = ((param_2 + iVar2) - local_e) + 1;
          if (uVar1 == (param_2 + local_6) - 1U) {
            (*DAT_6000_9632)(0x4000,param_1 + local_4,((param_2 + iVar2) - local_e) + 1,
                             uVar1 & 0xff00);
          }
          else {
            uVar1 = ((param_2 + iVar2) - local_e) + 1;
            if ((int)uVar1 < param_2 + local_6 + -1) {
              (*DAT_6000_962a)(0x4000,param_1 + local_4,((param_2 + iVar2) - local_e) + 1,
                               param_1 + local_4,param_2 + local_6 + -1,uVar1 & 0xff00);
            }
          }
        }
        local_6 = iVar2 - local_e;
      }
    }
  }
  return;
}


// ==== FUN_3000_7cb2 @ 3000:7cb2 (size 416) callers: 

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

int __cdecl16far FUN_3000_7cb2(int param_1,int param_2)

{
  char *pcVar1;
  int iVar2;
  int iVar3;
  uint uVar4;
  int iVar5;
  undefined1 local_12;
  int local_10;
  undefined4 local_a;
  int local_6;
  int local_4;
  
  local_10 = 1;
  local_12 = 0xff;
  if (DAT_6000_cdd5 == 0x100) {
    FUN_3000_66e9();
  }
  else {
    FUN_3000_6a84();
    local_10 = 5;
    local_12 = 0xc;
  }
  iVar2 = fill_rect(param_1,param_2,param_1 + 0xff,param_2 + 0x7f,1);
  for (local_4 = 0; local_4 < 0x100; local_4 = local_4 + 1) {
    local_a = (char *)CONCAT22(_DAT_6000_cd14,
                               (char *)((int)(undefined2 *)&DAT_6000_7f7e +
                                       DAT_6000_cd12 + local_4 + 1));
    local_6 = 0x7f;
    iVar2 = _DAT_6000_cd14;
    for (iVar5 = 0x7e; -1 < iVar5; iVar5 = iVar5 + -1) {
      pcVar1 = (char *)local_a;
      local_a = (char *)CONCAT22(local_a._2_2_,(char *)local_a + -0x101);
      if (((int)pcVar1[-0x103] <= *local_a + 1) || (iVar2 = iVar5 / 2, iVar5 % 2 == 0)) {
        iVar3 = (int)*local_a;
        iVar2 = iVar5 - iVar3;
        if (iVar2 < local_6) {
          if (iVar5 == 0xff) {
            (*DAT_6000_962a)(0x4000,param_1 + local_4,(param_2 + 0xff) - iVar3,param_1 + local_4,
                             param_2 + 0xff,CONCAT11((char)((uint)iVar2 >> 8),local_12));
          }
          else if (0 < iVar3) {
            (*DAT_6000_9632)(0x4000,param_1 + local_4,(param_2 + iVar5) - iVar3,
                             CONCAT11((char)((uint)(iVar3 / local_10) >> 8),
                                      (char)(iVar3 / local_10) + '\x02'));
            uVar4 = ((param_2 + iVar5) - iVar3) + 1;
            if (uVar4 == (param_2 + local_6) - 1U) {
              (*DAT_6000_9632)(0x4000,param_1 + local_4,((param_2 + iVar5) - iVar3) + 1,
                               uVar4 & 0xff00);
            }
            else {
              uVar4 = ((param_2 + iVar5) - iVar3) + 1;
              if ((int)uVar4 < param_2 + local_6 + -1) {
                (*DAT_6000_962a)(0x4000,param_1 + local_4,((param_2 + iVar5) - iVar3) + 1,
                                 param_1 + local_4,param_2 + local_6 + -1,uVar4 & 0xff00);
              }
            }
          }
          iVar2 = iVar5 - iVar3;
          local_6 = iVar2;
        }
      }
    }
  }
  return iVar2;
}


// ==== FUN_3000_7e52 @ 3000:7e52 (size 90) callers: FUN_3000_7eac,FUN_3000_80bd

void __cdecl16far
FUN_3000_7e52(int param_1,int param_2,undefined2 param_3,undefined2 param_4,undefined2 param_5)

{
  undefined2 uVar1;
  long lVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  
  uVar3 = DAT_6000_cd9a;
  uVar4 = DAT_6000_cd9c;
  lVar2 = N_LXMUL(0x4af,(long)param_2);
  lVar2 = F_LDIV(lVar2,CONCAT22(uVar4,uVar3));
  uVar1 = (undefined2)lVar2;
  uVar3 = DAT_6000_cd96;
  uVar4 = DAT_6000_cd98;
  lVar2 = N_LXMUL(0x63f,(long)param_1);
  lVar2 = F_LDIV(lVar2,CONCAT22(uVar4,uVar3));
  print_text((int)lVar2,uVar1,param_3,param_4,param_5);
  return;
}


// ==== FUN_3000_7eac @ 3000:7eac (size 529) callers: FUN_3000_8235

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_7eac(int param_1,int param_2,char param_3,undefined2 param_4)

{
  int iVar1;
  undefined2 uVar2;
  char local_6 [2];
  uint local_4;
  
  local_6[1] = 0;
  local_6[0] = param_3;
  local_4 = (uint)(param_3 == 'D');
  iVar1 = (int)_DAT_6000_cd12;
  uVar2 = (undefined2)((ulong)_DAT_6000_cd12 >> 0x10);
  if (((DAT_6000_cd94 == 8) || (DAT_6000_cd94 == 9)) || (DAT_6000_cd94 == 10)) {
    FUN_3000_7e52(param_1 * 3 + -5,
                  DAT_6000_cd7a + param_2 * 4 + *(char *)(iVar1 + param_2 * 0x101 + param_1) * -6 +
                  -4,local_4,local_6,param_4);
  }
  else if (DAT_6000_cd94 == 7) {
    FUN_3000_7e52(param_1 * 3 + -5,
                  ((DAT_6000_cd7a + param_2 * 3) -
                  (*(char *)(iVar1 + param_2 * 0x101 + param_1) * 9) / 2) + -4,local_4,local_6,
                  param_4);
  }
  else if ((DAT_6000_cd94 == 6) || (DAT_6000_cd94 == 0xb)) {
    FUN_3000_7e52(param_1 * 2 + -4,
                  DAT_6000_cd7a + param_2 * 2 + *(char *)(iVar1 + param_2 * 0x101 + param_1) * -4 +
                  -4,local_4,local_6,param_4);
  }
  else if ((DAT_6000_cd94 == 0) || (DAT_6000_cd94 == 5)) {
    FUN_3000_7e52(param_1 * 2 + -4,
                  DAT_6000_cd7a + param_2 * 2 + *(char *)(iVar1 + param_2 * 0x101 + param_1) * -2 +
                  -3,local_4,local_6,param_4);
  }
  else if (DAT_6000_cd94 == 4) {
    FUN_3000_7e52(param_1 + -2,
                  DAT_6000_cd7a + param_2 * 2 + *(char *)(iVar1 + param_2 * 0x101 + param_1) * -4 +
                  -4,0,local_6,param_4);
  }
  else if (((DAT_6000_cd94 == 1) || (DAT_6000_cd94 == 2)) || (DAT_6000_cd94 == 3)) {
    FUN_3000_7e52(param_1 + -2,
                  ((DAT_6000_cd7a + param_2) - (int)*(char *)(iVar1 + param_2 * 0x101 + param_1)) +
                  -2,local_4,local_6,param_4);
  }
  return;
}


// ==== FUN_3000_80bd @ 3000:80bd (size 376) callers: FUN_3000_8235

void __cdecl16far FUN_3000_80bd(int param_1,int param_2,char param_3,undefined2 param_4)

{
  char local_6 [2];
  uint local_4;
  
  local_6[1] = 0;
  local_6[0] = param_3;
  local_4 = (uint)(param_3 == 'D');
  if (((DAT_6000_cd94 == 8) || (DAT_6000_cd94 == 9)) || (DAT_6000_cd94 == 10)) {
    FUN_3000_7e52(param_1 * 3 + -5,DAT_6000_cd7a + param_2 * 4 + -4,local_4,local_6,param_4);
  }
  else if (DAT_6000_cd94 == 7) {
    FUN_3000_7e52(param_1 * 3 + -5,DAT_6000_cd7a + param_2 * 3 + -4,local_4,local_6,param_4);
  }
  else if ((DAT_6000_cd94 == 6) || (DAT_6000_cd94 == 0xb)) {
    FUN_3000_7e52(param_1 * 2 + -4,DAT_6000_cd7a + param_2 * 2 + -4,local_4,local_6,param_4);
  }
  else if ((DAT_6000_cd94 == 0) || (DAT_6000_cd94 == 5)) {
    FUN_3000_7e52(param_1 * 2 + -4,DAT_6000_cd7a + param_2 * 2 + -3,local_4,local_6,param_4);
  }
  else if (DAT_6000_cd94 == 4) {
    FUN_3000_7e52(param_1 + -2,DAT_6000_cd7a + param_2 * 2 + -4,0,local_6,param_4);
  }
  else if (((DAT_6000_cd94 == 1) || (DAT_6000_cd94 == 2)) || (DAT_6000_cd94 == 3)) {
    FUN_3000_7e52(param_1 + -2,DAT_6000_cd7a + param_2 + -2,local_4,local_6,param_4);
  }
  return;
}


// ==== FUN_3000_8235 @ 3000:8235 (size 2284) callers: FUN_2000_7b20,movecontrol

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_8235(void)

{
  char cVar1;
  short sVar2;
  char *pcVar3;
  uint uVar4;
  int iVar5;
  uint uVar6;
  undefined2 unaff_SI;
  int iVar7;
  undefined2 unaff_DI;
  int iVar8;
  int iVar9;
  undefined2 uVar10;
  bool bVar11;
  long lVar12;
  undefined2 uVar13;
  undefined2 uVar14;
  undefined2 uVar15;
  uint local_18;
  int local_16;
  int local_14;
  int local_12;
  int local_10;
  int local_c;
  int local_a;
  int local_8;
  int local_6;
  int local_4;
  
  bVar11 = false;
  uVar10 = 0x4000;
  clear_screen();
  do {
    do {
      if ((DAT_6000_c8ea - DAT_6000_c8ea % 0x100 == local_4) &&
         (DAT_6000_c8ec - DAT_6000_c8ec % 0x80 == local_6)) {
        if (bVar11) {
          (*DAT_6000_cd76)(uVar10,0,DAT_6000_cd7a);
          bVar11 = false;
        }
      }
      else {
        local_4 = DAT_6000_c8ea - DAT_6000_c8ea % 0x100;
        local_6 = DAT_6000_c8ec - DAT_6000_c8ec % 0x80;
        FUN_3000_6331(local_4,local_6);
        clear_screen();
        (*DAT_6000_cd76)(0x4000,0,DAT_6000_cd7a);
        bVar11 = false;
        local_16 = local_4 / 0x100;
        local_18 = local_6 / 0x80;
        uVar4 = local_16 + local_18 * local_16;
        uVar6 = (int)uVar4 >> 0xf;
        uVar4 = (int)(local_16 * local_16 * local_18 * 0xad) / (int)(((uVar4 ^ uVar6) - uVar6) + 1);
        uVar6 = (int)uVar4 >> 0xf;
        local_12 = (int)((uVar4 ^ uVar6) - uVar6) % 0xfa + 3;
        uVar4 = local_16 + local_18 + 1;
        uVar6 = (int)uVar4 >> 0xf;
        uVar4 = (int)(local_16 * local_18 * local_16 * local_18) / (int)((uVar4 ^ uVar6) - uVar6);
        uVar6 = (int)uVar4 >> 0xf;
        local_14 = (int)((uVar4 ^ uVar6) - uVar6) % 0x7a + 3;
        if (*(char *)((int)_DAT_6000_cd12 + local_14 * 0x101 + local_12) < '\x01') {
          local_12 = -1;
          local_14 = -1;
        }
      }
      do {
        if (local_14 != -1) {
          FUN_3000_7eac(local_12,local_14,0x44,0);
          FUN_3000_7eac(local_12,local_14,0x44,1);
        }
        if (DAT_6000_c8f2 == 0) {
          FUN_3000_7eac(DAT_6000_c8ea % 0x100,DAT_6000_c8ec % 0x80,0x58,local_10);
        }
        else {
          FUN_3000_80bd(DAT_6000_c8ea % 0x100,DAT_6000_c8ec % 0x80,0x58,local_10);
        }
        local_10 = local_10 + 1;
        sVar2 = kbhit();
      } while (sVar2 == 0);
      sVar2 = getch();
      local_8 = FUN_1000_1878(sVar2);
      if (local_8 == 0x77) {
        FUN_3000_5dc1(0x100,0x100);
        clear_screen();
        (*DAT_6000_cd76)(0x4000,0,DAT_6000_cd7a);
        FUN_3000_7eac(DAT_6000_c8ea / 0x40,DAT_6000_c8ec / 0x40,0x4f,1);
        FUN_3000_7eac(DAT_6000_c8ea / 0x40,DAT_6000_c8ec / 0x40,0x58,0xf);
        local_4 = -1;
        getch();
      }
      uVar10 = 0x1000;
      local_c = 0;
      local_a = 0;
      if (((local_8 == 0x31) || (local_8 == 0x34)) || (local_8 == 0x37)) {
        local_a = -3;
      }
      if (((local_8 == 0x33) || (local_8 == 0x36)) || (local_8 == 0x39)) {
        local_a = 3;
      }
      if (((local_8 == 0x37) || (local_8 == 0x38)) || (local_8 == 0x39)) {
        local_c = -3;
      }
      if (((local_8 == 0x31) || (local_8 == 0x32)) || (local_8 == 0x33)) {
        local_c = 3;
      }
      if (local_8 == 0) {
        uVar10 = 0x1000;
        local_8 = getch();
        if (((local_8 == 0x47) || (local_8 == 0x4b)) || (local_8 == 0x4f)) {
          local_a = -1;
        }
        if (((local_8 == 0x49) || (local_8 == 0x4d)) || (local_8 == 0x51)) {
          local_a = 1;
        }
        if (((local_8 == 0x4f) || (local_8 == 0x50)) || (local_8 == 0x51)) {
          local_c = 1;
        }
        if (((local_8 == 0x47) || (local_8 == 0x48)) || (local_8 == 0x49)) {
          local_c = -1;
        }
        if (local_8 == 0x3b) {
          uVar10 = 0x2000;
          show_help(0x18);
          bVar11 = true;
        }
      }
      if (DAT_6000_c8f2 == 0) {
        FUN_3000_7eac(DAT_6000_c8ea % 0x100,DAT_6000_c8ec % 0x80,0x58,0);
      }
      else {
        FUN_3000_80bd(DAT_6000_c8ea % 0x100,DAT_6000_c8ec % 0x80,0x58,0);
      }
      if (((DAT_6000_c8ea + local_a) - (DAT_6000_c8ea + local_a) % 0x100 == local_4) &&
         ((DAT_6000_c8ec + local_c) - (DAT_6000_c8ec + local_c) % 0x80 == local_6)) {
        if (DAT_6000_c8f2 == 1) {
          if (*(char *)((int)_DAT_6000_cd12 + ((DAT_6000_c8ec + local_c) % 0x80) * 0x101 +
                       (DAT_6000_c8ea + local_a) % 0x100) < '\x01') {
            DAT_6000_c8ea = DAT_6000_c8ea + local_a;
            DAT_6000_c8ec = DAT_6000_c8ec + local_c;
          }
          else {
            FUN_2000_216b((char *)s_DO_YOU_WISH_TO_LEAVE_YOUR_6000_4925,
                          (char *)s_BOAT__THE_CREW_MAY_STEAL_6000_493f,
                          (char *)s_IT_WHILE_YOU_RE_GONE__6000_495a,
                          (char *)s_HIT__L__TO_LEAVE_THE_BOAT_6000_4972,
                          (char *)s_OR_ANY_OTHER_KEY_TO_REMAIN_6000_498c,
                          (char *)s_ON_BOARD__6000_49a9,(undefined4 *)&DAT_6000_45cd,
                          (undefined4 *)&DAT_6000_45cd);
            local_8 = getch();
            uVar15 = 0;
            uVar10 = 0x4af;
            lVar12 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
            lVar12 = F_LDIV(lVar12,CONCAT22(uVar15,uVar10));
            uVar15 = (undefined2)lVar12;
            uVar14 = 0;
            uVar10 = 0x63f;
            lVar12 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
            lVar12 = F_LDIV(lVar12,CONCAT22(uVar14,uVar10));
            uVar14 = (undefined2)lVar12;
            uVar13 = 0;
            uVar10 = 0x4af;
            lVar12 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
            lVar12 = F_LDIV(lVar12,CONCAT22(uVar13,uVar10));
            uVar10 = 0x4000;
            fill_rect(0,(int)lVar12,uVar14,uVar15);
            if ((local_8 == 0x6c) || (local_8 == 0x4c)) {
              DAT_6000_c8f2 = 0;
            }
            bVar11 = true;
          }
        }
        if (DAT_6000_c8f2 == 0) {
          if (*(char *)((int)_DAT_6000_cd12 + ((DAT_6000_c8ec + local_c) % 0x80) * 0x101 +
                       (DAT_6000_c8ea + local_a) % 0x100) < '\0') {
            iVar9 = (int)((char *)s_POINTS_DAMAGE_6000_270f + 1 +
                         (DAT_6000_c8a2 / 2 + 1) * (DAT_6000_c8a2 + 1) * (DAT_6000_c8a2 + 1)) >> 0xf
            ;
            if ((DAT_6000_c548 < iVar9) ||
               ((DAT_6000_c548 <= iVar9 &&
                (DAT_6000_c546 <=
                 (char *)s_POINTS_DAMAGE_6000_270f + 1 +
                 (DAT_6000_c8a2 / 2 + 1) * (DAT_6000_c8a2 + 1) * (DAT_6000_c8a2 + 1))))) {
              uVar10 = FUN_4000_428f((char *)s_WILL_COST_YOU_6000_49ee,
                                     (char *)s_POINTS_DAMAGE_6000_270f + 1 +
                                     (DAT_6000_c8a2 / 2 + 1) * (DAT_6000_c8a2 + 1) *
                                     (DAT_6000_c8a2 + 1),
                                     (int)((char *)s_POINTS_DAMAGE_6000_270f + 1 +
                                          (DAT_6000_c8a2 / 2 + 1) * (DAT_6000_c8a2 + 1) *
                                          (DAT_6000_c8a2 + 1)) >> 0xf,
                                     (char *)s_JEWEL_STONES__6000_49ff,
                                     (char *)s_COME_BACK_WHEN_YOU_HAVE_SOME_6000_4a4a,
                                     (char *)s_MORE_MONEY__6000_4a67,(undefined4 *)&DAT_6000_45cd,
                                     (char *)s_HIT_ANY_KEY____6000_4a75);
              FUN_2000_216b((char *)s_YOU_WILL_HAVE_TO_BUY_A_BOAT_6000_49b5,
                            (char *)s_TO_TRAVEL_IN_THE_WATER__IT_6000_49d1,uVar10);
              local_8 = getch();
            }
            else {
              uVar10 = FUN_4000_428f((char *)s_WILL_COST_YOU_6000_49ee,
                                     (char *)s_POINTS_DAMAGE_6000_270f + 1 +
                                     (DAT_6000_c8a2 / 2 + 1) * (DAT_6000_c8a2 + 1) *
                                     (DAT_6000_c8a2 + 1),
                                     (int)((char *)s_POINTS_DAMAGE_6000_270f + 1 +
                                          (DAT_6000_c8a2 / 2 + 1) * (DAT_6000_c8a2 + 1) *
                                          (DAT_6000_c8a2 + 1)) >> 0xf,
                                     (char *)s_JEWEL_STONES__6000_49ff,
                                     (char *)s_HIT__B__TO_BUY_A_BOAT_AND_ANY_6000_4a0f,
                                     (char *)s_OTHER_KEY_TO_STAY_ON_LAND__6000_4a2d,
                                     (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd);
              FUN_2000_216b((char *)s_YOU_WILL_HAVE_TO_BUY_A_BOAT_6000_49b5,
                            (char *)s_TO_TRAVEL_IN_THE_WATER__IT_6000_49d1,uVar10);
              local_8 = getch();
              if ((local_8 == 0x42) || (local_8 == 0x62)) {
                pcVar3 = (char *)s_POINTS_DAMAGE_6000_270f + 1 +
                         (DAT_6000_c8a2 / 2 + 1) * (DAT_6000_c8a2 + 1) * (DAT_6000_c8a2 + 1);
                bVar11 = DAT_6000_c546 < pcVar3;
                DAT_6000_c546 = DAT_6000_c546 + -(int)pcVar3;
                DAT_6000_c548 = (DAT_6000_c548 - ((int)pcVar3 >> 0xf)) - (uint)bVar11;
                DAT_6000_c8f2 = 1;
              }
            }
            uVar15 = 0;
            uVar10 = 0x4af;
            lVar12 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
            lVar12 = F_LDIV(lVar12,CONCAT22(uVar15,uVar10));
            uVar15 = (undefined2)lVar12;
            uVar14 = 0;
            uVar10 = 0x63f;
            lVar12 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
            lVar12 = F_LDIV(lVar12,CONCAT22(uVar14,uVar10));
            uVar14 = (undefined2)lVar12;
            uVar13 = 0;
            uVar10 = 0x4af;
            lVar12 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
            lVar12 = F_LDIV(lVar12,CONCAT22(uVar13,uVar10));
            uVar10 = 0x4000;
            fill_rect(0,(int)lVar12,uVar14,uVar15);
            bVar11 = true;
          }
          else {
            DAT_6000_c8ea = DAT_6000_c8ea + local_a;
            DAT_6000_c8ec = DAT_6000_c8ec + local_c;
          }
        }
      }
      else {
        DAT_6000_c8ea = DAT_6000_c8ea + local_a;
        DAT_6000_c8ec = DAT_6000_c8ec + local_c;
      }
      if (DAT_6000_c8ea < 0x40) {
        DAT_6000_c8ea = DAT_6000_c8ea + 0x3f80;
      }
      if (DAT_6000_c8ec < 0x40) {
        DAT_6000_c8ec = DAT_6000_c8ec + 0x1f80;
      }
      if (0x3f80 < DAT_6000_c8ea) {
        DAT_6000_c8ea = DAT_6000_c8ea + -0x3f80;
      }
      if (0x1f80 < DAT_6000_c8ec) {
        DAT_6000_c8ec = DAT_6000_c8ec + -0x1f80;
      }
      if (local_8 == 0x68) {
        uVar10 = 0x2000;
        show_help(0x18);
        bVar11 = true;
      }
      if (local_8 == 0x71) {
        save_player((int)DAT_6000_125c);
        if (DAT_6000_cd94 < 1) {
          FUN_4000_0f0d(0);
          FUN_1000_3339(2);
        }
        else {
          FUN_4000_0f0d(3);
          FUN_1000_3339(3);
        }
        uVar10 = 0x2000;
        quit(0);
      }
      uVar4 = local_12 - DAT_6000_c8ea % 0x100;
      uVar6 = (int)uVar4 >> 0xf;
    } while ((0xe < (int)((uVar4 ^ uVar6) - uVar6)) ||
            (uVar4 = local_14 - DAT_6000_c8ec % 0x80, uVar6 = (int)uVar4 >> 0xf,
            0xd < (int)((uVar4 ^ uVar6) - uVar6)));
    if (local_14 != -1) {
      FUN_3000_7eac(local_12,local_14,0x44,1);
    }
    iVar9 = DAT_6000_c8a4;
  } while (local_8 != 0x65);
  DAT_6000_c89e = -1;
  DAT_6000_c8a4 =
       ((int)(local_16 * local_18 * local_16) /
       (int)(((local_18 ^ (int)local_18 >> 0xf) - ((int)local_18 >> 0xf)) + 1)) % 31000;
  while( true ) {
    for (iVar8 = 1; iVar8 < 0x4f; iVar8 = iVar8 + 1) {
      for (iVar7 = 1; iVar7 < 0x6d; iVar7 = iVar7 + 1) {
        iVar5 = surface_feature(iVar8,iVar7);
        if ((iVar5 == 5) && (cVar1 = is_solid(iVar8,iVar7,0,DAT_6000_c8a4), cVar1 == '\0')) {
          DAT_6000_c89e = iVar8;
          DAT_6000_c8a0 = iVar7;
        }
      }
    }
    if (DAT_6000_c89e != -1) break;
    DAT_6000_c8a4 = DAT_6000_c8a4 + 1;
  }
  if (iVar9 != DAT_6000_c8a4) {
    FUN_2000_70ef();
  }
  DAT_6000_c8ee = 0;
  clear_screen();
  DAT_6000_1248 = 0xffff;
  DAT_6000_1246 = 0xffff;
  DAT_6000_1244 = 0xffff;
  DAT_6000_1242 = 0xffff;
  DAT_6000_1240 = 0xffff;
  DAT_6000_123e = 0xffff;
  DAT_6000_125a = 0xffff;
  DAT_6000_1258 = 0xffff;
  DAT_6000_1256 = 0xffff;
  DAT_6000_1254 = 0xffff;
  DAT_6000_124c = 0xbff0000000000000;
  lVar12 = ftol((double)CONCAT26(local_18,CONCAT24(0xffff,CONCAT22(unaff_SI,unaff_DI))));
  DAT_6000_124a = (undefined2)lVar12;
  DAT_6000_cd18 = 1;
  DAT_6000_123d = 1;
  for (iVar9 = 0; iVar9 < 0x20; iVar9 = iVar9 + 1) {
    for (iVar8 = 0; iVar8 < 0x44c; iVar8 = iVar8 + 1) {
      *(undefined1 *)((int)((undefined4 *)&DAT_6000_cb58)[iVar9] + iVar8) = 0;
    }
  }
  for (iVar9 = 0; iVar9 < 4; iVar9 = iVar9 + 1) {
    ((undefined1 *)&DAT_6000_cb54)[iVar9] = 0;
  }
  DAT_6000_12fd = 0xffff;
  enter_level(0);
  FUN_4000_10ee();
  return;
}


// ==== FUN_3000_8b27 @ 3000:8b27 (size 2112) callers: FUN_3000_9383

void __cdecl16far FUN_3000_8b27(undefined2 param_1)

{
  long lVar1;
  undefined2 uVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  
  switch(param_1) {
  case 0:
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
    print_text(0,0xf0,0,(char *)s_OBJECTIVE__USE_ARROW_KEYS_TO_6000_4a84,3);
    print_text(0,0x122,0,(char *)s_EXPLORE_THE_DUNGEON__USE_THE_6000_4aa1,3);
    print_text(0,0x154,0,(char *)s_LADDERS_TO_DESCEND_TO_DEEPER__6000_4abe,3);
    print_text(0,0x186,0,(char *)s_MORE_DANGEROUS_PLACES__6000_4adc,3);
    break;
  case 1:
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
    print_text(0,0xf0,0,(char *)s_IF_YOU_HAVE_A_MOUSE__JUST_6000_4af3,3);
    print_text(0,0x122,0,(char *)s_POINT_TO_THINGS_AND_PRESS_6000_4b0d,3);
    print_text(0,0x154,0,(char *)s_BUTTONS_TO_SEE_WHAT_HAPPENS__6000_4b27,3);
    break;
  case 2:
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
    print_text(0,0xf0,0,(char *)s_ON_THE_LEFT_IS_A_MAP_SHOWING_6000_4b44,3);
    print_text(0,0x122,0,(char *)s_THE_AREA_AROUND_YOU__SLANTED_6000_4b61,3);
    print_text(0,0x154,0,(char *)s_LINES_SHOW_LADDERS_GOING_UP_6000_4b7e,3);
    print_text(0,0x186,0,(char *)s_AND_DOWN__6000_4b9a,3);
    break;
  case 3:
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
    print_text(0,0xf0,0,(char *)s_USE_THE_CURSOR_KEYS_TO_MOVE__6000_4ba4,3);
    print_text(0,0x122,0,(char *)s_UP_IS_NORTH__DOWN_IS_SOUTH__6000_4bc1,3);
    print_text(0,0x154,0,(char *)s_LEFT_IS_EAST__RIGHT_IS_WEST__6000_4bdd,3);
    print_text(0,0x186,0,(char *)s_HIT_F1_FOR_MORE_INFORMATION__6000_4bfa,3);
    break;
  case 4:
    if (DAT_6000_c8a2 == 0) {
      uVar5 = 0;
      uVar4 = 0;
      uVar2 = 0x4af;
      lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
      uVar2 = (undefined2)lVar1;
      uVar3 = 0;
      uVar4 = 0x63f;
      lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
      fill_rect(0,0,(int)lVar1,uVar2,uVar5);
      print_text(0,0xf0,0,(char *)s_MONSTERS_ARE_ONLY_FOUND_IN_6000_4c17,3);
      print_text(0,0x122,0,(char *)s_THE_DUNGEON__YOU_ARE_IN_THE_6000_4c32,3);
      print_text(0,0x154,0,(char *)s_TOWN_NOW__SO_YOU_MUST_FIND_A_6000_4c4e,3);
      print_text(0,0x186,0,(char *)s_LADDER_AND_GO_DOWN_IT__6000_4c6b,3);
    }
    break;
  case 5:
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
    print_text(0,0xf0,0,(char *)s_YOUR_MISSION__FIND_TREASURES_6000_4c82,3);
    print_text(0,0x122,0,(char *)s_AND_MONEY__GAIN_POWER_BY_6000_4c9f,3);
    print_text(0,0x154,0,(char *)s_DEFEATING_MONSTERS__ENJOY_6000_4cb8,3);
    print_text(0,0x186,0,(char *)s_THE_FUN_AND_EXCITEMENT__6000_4cd2,3);
    break;
  case 6:
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
    print_text(0,0xf0,0,(char *)s_YOU_NEED_HEALTH_POINTS_TO_6000_4cea,3);
    print_text(0,0x122,0,(char *)s_STAY_ALIVE__IF_YOUR_HEALTH_6000_4d04,3);
    print_text(0,0x154,0,(char *)s_POINTS_FALL_BELOW_ZERO__YOU_6000_4d1f,3);
    print_text(0,0x186,0,(char *)s_WILL_DIE__6000_4d3b,3);
    break;
  case 7:
    if (DAT_6000_c11c != '\0') {
      uVar5 = 0;
      uVar4 = 0;
      uVar2 = 0x4af;
      lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
      uVar2 = (undefined2)lVar1;
      uVar3 = 0;
      uVar4 = 0x63f;
      lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
      fill_rect(0,0,(int)lVar1,uVar2,uVar5);
      print_text(0,0xf0,0,(char *)s_IF_YOU_ARE_DAMAGED__CAST_A_6000_4d45,3);
      print_text(0,0x122,0,(char *)s_CURE_BY_HITTING__C__FOR_CAST_6000_4d60,3);
      print_text(0,0x154,0,(char *)s_SPELL__THEN__2__FOR_PREP__6000_4d7d,3);
      print_text(0,0x186,0,(char *)s_SPELL__6000_4d97,3);
    }
    break;
  case 8:
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
    print_text(0,0xf0,0,(char *)s_TO_VISIT_AN_INN__LOOK_FOR_6000_4d9e,3);
    print_text(0,0x122,0,(char *)s_SPECIALLY_MARKED_SQUARES_IN_6000_4db8,3);
    print_text(0,0x154,0,(char *)s_IN_THE_TOWN__THEY_REPRESENT_6000_4dd4,3);
    print_text(0,0x186,0,(char *)s_INNS__TEMPLES__BANKS__ETC__6000_4df0,3);
    break;
  case 9:
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
    print_text(0,0xf0,0,(char *)s_PIECE_OF_ADVICE__WATCH_OUT_6000_4e0b,3);
    print_text(0,0x122,0,(char *)s_FOR_BLACK_OR_GREEN_MONSTERS__6000_4e26,3);
    print_text(0,0x154,0,(char *)s_HE_WHO_LEARNS_TO_RUN_AWAY_6000_4e43,3);
    print_text(0,0x186,0,(char *)s_LIVES_TO_FIGHT_ANOTHER_DAY__6000_4e5d,3);
    break;
  case 10:
    uVar5 = 0;
    uVar4 = 0;
    uVar2 = 0x4af;
    lVar1 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
    uVar2 = (undefined2)lVar1;
    uVar3 = 0;
    uVar4 = 0x63f;
    lVar1 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
    fill_rect(0,0,(int)lVar1,uVar2,uVar5);
    print_text(0,0xf0,0,(char *)s_WHEN_YOU_FIND_WEAPONS_OR_6000_4e79,3);
    print_text(0,0x122,0,(char *)s_ARMOR__REMEMBER_TO_HIT__W__6000_4e92,3);
    print_text(0,0x154,0,(char *)s_OR__A__TO_ACTUALLY_USE_THESE_6000_4ead,3);
    print_text(0,0x186,0,(char *)s_VERY_IMPORTANT_ITEMS__6000_4eca,3);
    break;
  case 0xb:
    break;
  case 0xc:
    break;
  case 0xd:
  }
  return;
}


// ==== FUN_3000_9383 @ 3000:9383 (size 1792) callers: movecontrol

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_9383(void)

{
  int iVar1;
  short sVar2;
  long lVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  undefined2 uVar6;
  undefined2 uVar7;
  
  if (DAT_6000_4484 == 1) {
    FUN_3000_8b27(0);
    DAT_6000_4484 = 0;
  }
  else {
    iVar1 = random_n(5);
    if (iVar1 != 0) {
      return;
    }
    if (DAT_6000_c89a < 3) {
      uVar6 = 0;
      uVar5 = 0x8000;
      sVar2 = rand();
      lVar3 = N_LXMUL(6,(long)sVar2);
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar5));
      if ((int)lVar3 == 1) {
        iVar1 = DAT_6000_4482 % 0xe;
        DAT_6000_4482 = DAT_6000_4482 + 1;
        FUN_3000_8b27(iVar1);
        return;
      }
    }
  }
  uVar6 = 0;
  uVar5 = 0x8000;
  sVar2 = rand();
  lVar3 = N_LXLSH((long)sVar2,'\x03');
  lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar5));
  switch((int)lVar3) {
  case 0:
    if (DAT_6000_c123 < DAT_6000_c125 / 4) {
      uVar7 = 0;
      uVar6 = 0;
      uVar5 = 0x4af;
      lVar3 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar5));
      uVar5 = (undefined2)lVar3;
      uVar4 = 0;
      uVar6 = 0x63f;
      lVar3 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar4,uVar6));
      fill_rect(0,0,(int)lVar3,uVar5,uVar7);
      print_text(0,0xf0,0,(char *)s_YOU_ARE_BADLY_DAMAGED__YOU_6000_4ee0,3);
      print_text(0,0x122,0,(char *)s_SHOULD_CURE_YOURSELF_WITH_6000_4efb,3);
      print_text(0,0x154,0,(char *)s_THE_CURE_SPELL_OR_GO_SEARCH_6000_4f15,3);
      print_text(0,0x186,0,(char *)s_THE_TOWN_FOR_A_TEMPLE__6000_4f31,3);
    }
    break;
  case 1:
    if (DAT_6000_c89a * 3 + 3 < DAT_6000_c8a2) {
      uVar7 = 0;
      uVar6 = 0;
      uVar5 = 0x4af;
      lVar3 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar5));
      uVar5 = (undefined2)lVar3;
      uVar4 = 0;
      uVar6 = 0x63f;
      lVar3 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar4,uVar6));
      fill_rect(0,0,(int)lVar3,uVar5,uVar7);
      print_text(0,0xf0,0,(char *)s_I_THINK_YOU_WILL_NOT_SURVIVE_6000_4f48,4);
      print_text(0,0x122,0,(char *)s_THIS_DEEP___THE_DEEPER_YOU_6000_4f65,4);
      print_text(0,0x154,0,(char *)s_GO__THE_MORE_POWERFUL_THE_6000_4f80,4);
      print_text(0,0x186,0,(char *)s_FOR_BLACK_OR_GREEN_MONSTERS__6000_4e26 + 0x13,4);
    }
    break;
  case 2:
    if (DAT_6000_c131 * 2 < DAT_6000_c133) {
      uVar7 = 0;
      uVar6 = 0;
      uVar5 = 0x4af;
      lVar3 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar5));
      uVar5 = (undefined2)lVar3;
      uVar4 = 0;
      uVar6 = 0x63f;
      lVar3 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar4,uVar6));
      fill_rect(0,0,(int)lVar3,uVar5,uVar7);
      print_text(0,0xf0,0,(char *)s_YOU_ARE_CARRYING_A_LOT_OF_6000_4f9a,5);
      print_text(0,0x122,0,(char *)s_WEIGHT__THIS_ALLOWS_MONSTERS_6000_4fb4,5);
      print_text(0,0x154,0,(char *)s_TO_TAKE_MORE_STRIKES_AT_YOU__6000_4fd1,5);
      print_text(0,0x186,0,(char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee,5);
    }
    break;
  case 3:
    iVar1 = FUN_2000_5ae2();
    if (iVar1 != 0) {
      uVar7 = 0;
      uVar6 = 0;
      uVar5 = 0x4af;
      lVar3 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar5));
      uVar5 = (undefined2)lVar3;
      uVar4 = 0;
      uVar6 = 0x63f;
      lVar3 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar4,uVar6));
      fill_rect(0,0,(int)lVar3,uVar5,uVar7);
      print_text(0,0xf0,0,(char *)s_YOU_ARE_READY_TO_GAIN_A_6000_5009,6);
      print_text(0,0x122,0,(char *)s_LEVEL__WHICH_WILL_MAKE_YOU_6000_5021,6);
      print_text(0,0x154,0,(char *)s_MORE_POWERFUL__YOU_MUST_STAY_6000_503c,6);
      print_text(0,0x186,0,(char *)s_AT_AN_INN_TO_GAIN_A_LEVEL__6000_5059,6);
    }
    break;
  case 4:
    if (_DAT_6000_c127 * DAT_6000_45f1 < _DAT_6000_c12b) {
      uVar7 = 0;
      uVar6 = 0;
      uVar5 = 0x4af;
      lVar3 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar5));
      uVar5 = (undefined2)lVar3;
      uVar4 = 0;
      uVar6 = 0x63f;
      lVar3 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar4,uVar6));
      fill_rect(0,0,(int)lVar3,uVar5,uVar7);
      print_text(0,0xf0,0,(char *)s_YOU_ARE_RUNNING_LOW_ON_SPELL_6000_5074,6);
      print_text(0,0x122,0,(char *)s_POINTS__YOU_CAN_REGAIN_YOUR_6000_5091,6);
      print_text(0,0x154,0,(char *)s_SPELL_POINTS_BY_STAYING_AT_6000_50ad,6);
      print_text(0,0x186,0,(char *)s_AN_INN_IN_THE_TOWN__6000_50c8,6);
    }
    break;
  case 5:
    if (0 < DAT_6000_c8bc) {
      uVar7 = 0;
      uVar6 = 0;
      uVar5 = 0x4af;
      lVar3 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar5));
      uVar5 = (undefined2)lVar3;
      uVar4 = 0;
      uVar6 = 0x63f;
      lVar3 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar4,uVar6));
      fill_rect(0,0,(int)lVar3,uVar5,uVar7);
      print_text(0,0xf0,0,(char *)s_YOU_DON_T_FEEL_VERY_WELL__6000_50dc,8);
      print_text(0,0x122,0,(char *)s_YOU_SHOULD_REALLY_TRY_TO_6000_50f6,8);
      print_text(0,0x154,0,(char *)s_GET_A_CURE_DISEASE_AT_A_6000_510f,8);
      print_text(0,0x186,0,(char *)s_THE_TOWN_FOR_A_TEMPLE__6000_4f31 + 0xf,8);
    }
    break;
  case 6:
    if (DAT_6000_c8f8 == -1) {
      uVar7 = 0;
      uVar6 = 0;
      uVar5 = 0x4af;
      lVar3 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar5));
      uVar5 = (undefined2)lVar3;
      uVar4 = 0;
      uVar6 = 0x63f;
      lVar3 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar4,uVar6));
      fill_rect(0,0,(int)lVar3,uVar5,uVar7);
      print_text(0,0xf0,0,(char *)s_DON_T_YOU_THINK_YOU_SHOULD_6000_5127,3);
      print_text(0,0x122,0,(char *)s_BUY_A_RAISE_DEAD_CONTRACT_6000_5142,3);
      print_text(0,0x154,0,(char *)s_WITH_THE_TEMPLE_IN_THE_TOWN__6000_515c,3);
      print_text(0,0x186,0,(char *)s_IT_HELPS_A_LOT_WHEN_YOU_DIE__6000_5179,3);
    }
    break;
  case 7:
    if (0 < DAT_6000_c8be) {
      uVar7 = 0;
      uVar6 = 0;
      uVar5 = 0x4af;
      lVar3 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar6,uVar5));
      uVar5 = (undefined2)lVar3;
      uVar4 = 0;
      uVar6 = 0x63f;
      lVar3 = N_LXMUL(0x2cd,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar3 = F_LDIV(lVar3,CONCAT22(uVar4,uVar6));
      fill_rect(0,0,(int)lVar3,uVar5,uVar7);
      print_text(0,0xf0,0,(char *)s_YOU_HAVE_BEEN_POISONED__FOR_6000_5196,7);
      print_text(0,0x122,0,(char *)s_A_FEW_JEWELS_YOU_CAN_GET_A_6000_51b2,7);
      print_text(0,0x154,0,(char *)s_CURE_POISON_AT_A_TEMPLE__6000_51cd,7);
    }
  }
  return;
}


// ==== FUN_3000_9a93 @ 3000:9a93 (size 45) callers: FUN_3000_9ac0

void __cdecl16far FUN_3000_9a93(void)

{
  FUN_2000_22ff((char *)s_DON_T_YOU_THINK_YOU_D_BETTER_6000_51e6,
                (char *)s_FIND_ONE_FIRST__TRY_KILLING_6000_5203,(char *)s_LEVEL_DRAINERS__6000_5221,
                (undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75,
                (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd,
                (undefined4 *)&DAT_6000_45cd);
  return;
}


// ==== FUN_3000_9ac0 @ 3000:9ac0 (size 519) callers: movecontrol

void __cdecl16far FUN_3000_9ac0(void)

{
  int iVar1;
  
  FUN_2000_216b((char *)s_PRESS_1_6_TO_TAKE_A_PILL__6000_5233,(char *)s_1__GREEN_PILL_6000_524d,
                (char *)s_2__ORANGE_PILL_6000_525b,(char *)s_3__YELLOW_PILL_6000_526a,
                (char *)s_4__RED_PILL_6000_5279,(char *)s_5__BLUE_PILL_6000_5285,
                (char *)s_6__WHITE_PILL_6000_5292,(char *)s_HIT_ESCAPE_TO_RETURN_TO_GAME_6000_52a0);
  iVar1 = FUN_2000_1fbd(1,6);
  if ((0x30 < iVar1) && (iVar1 < 0x37)) {
    switch(iVar1) {
    case 0x31:
      if (DAT_6000_c250 < '\x01') {
        FUN_3000_9a93();
      }
      else {
        DAT_6000_c250 = DAT_6000_c250 + -1;
        DAT_6000_c906 = DAT_6000_c906 + 4;
        DAT_6000_c90c = DAT_6000_c90c + -2;
        FUN_2000_22ff((char *)s_YOUR_INTELLIGENCE_HAS_BEEN_6000_52bd,
                      (char *)s_RAISED_FOUR_AND_YOUR_6000_52d8,
                      (char *)s_DEXTERITY_HAS_DROPPED_TWO_6000_52ef,(char *)s_POINTS__6000_530b,
                      (undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75,
                      (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd);
      }
      break;
    case 0x32:
      if (DAT_6000_c24f < '\x01') {
        FUN_3000_9a93();
      }
      else {
        DAT_6000_c24f = DAT_6000_c24f + -1;
        DAT_6000_c904 = DAT_6000_c904 + 4;
        DAT_6000_c90e = DAT_6000_c90e + -2;
        FUN_2000_22ff((char *)s_YOUR_STRENGTH_HAS_BEEN_RAISED_6000_5315,
                      (char *)s_FOUR_AND_YOUR_LUCK_HAS_6000_5333,
                      (char *)s_DROPPED_TWO_POINTS__6000_534c,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd);
      }
      break;
    case 0x33:
      if (DAT_6000_c254 < '\x01') {
        FUN_3000_9a93();
      }
      else {
        DAT_6000_c254 = DAT_6000_c254 + -1;
        DAT_6000_c90e = DAT_6000_c90e + 4;
        DAT_6000_c904 = DAT_6000_c904 + -2;
        FUN_2000_22ff((char *)s_YOUR_LUCK_HAS_BEEN_RAISED_6000_5362,
                      (char *)s_FOUR_AND_YOUR_STRENGTH_HAS_6000_537c,
                      (char *)s_DROPPED_TWO_POINTS__6000_534c,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd);
      }
      break;
    case 0x34:
      if (DAT_6000_c252 < '\x01') {
        FUN_3000_9a93();
      }
      else {
        DAT_6000_c252 = DAT_6000_c252 + -1;
        DAT_6000_c90a = DAT_6000_c90a + 4;
        DAT_6000_c908 = DAT_6000_c908 + -2;
        FUN_2000_22ff((char *)s_YOUR_CONSTITUTION_HAS_BEEN_6000_5399,
                      (char *)s_RAISED_FOUR_AND_YOUR_WISDOM_6000_53b4,
                      (char *)s_HAS_DROPPED_TWO_POINTS__6000_53d2,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd);
      }
      break;
    case 0x35:
      if (DAT_6000_c251 < '\x01') {
        FUN_3000_9a93();
      }
      else {
        DAT_6000_c251 = DAT_6000_c251 + -1;
        DAT_6000_c908 = DAT_6000_c908 + 4;
        DAT_6000_c90a = DAT_6000_c90a + -2;
        FUN_2000_22ff((char *)s_YOUR_WISDOM_HAS_BEEN_RAISED_6000_53ec,
                      (char *)s_FOUR_AND_YOUR_CONSTITUTION_6000_5408,
                      (char *)s_HAS_DROPPED_TWO_POINTS__6000_53d2,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd);
      }
      break;
    case 0x36:
      if (DAT_6000_c253 < '\x01') {
        FUN_3000_9a93();
      }
      else {
        DAT_6000_c253 = DAT_6000_c253 + -1;
        DAT_6000_c90c = DAT_6000_c90c + 4;
        DAT_6000_c906 = DAT_6000_c906 + -2;
        FUN_2000_22ff((char *)s_YOUR_DEXTERITY_HAS_BEEN_6000_5425,
                      (char *)s_RAISED_FOUR_AND_YOUR_6000_52d8,
                      (char *)s_INTELLIGENCE_HAS_DROPPED_6000_543d,(char *)s_TWO_POINTS__6000_5458,
                      (undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75,
                      (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd);
      }
    }
  }
  return;
}


// ==== FUN_3000_9cd3 @ 3000:9cd3 (size 40) callers: FUN_3000_a047

void __cdecl16far FUN_3000_9cd3(undefined2 param_1)

{
  print_text(0x2d3,DAT_6000_cd7c * 0x28,0,param_1,4);
  DAT_6000_cd7c = DAT_6000_cd7c + 1;
  return;
}


// ==== FUN_3000_9cfb @ 3000:9cfb (size 844) callers: FUN_3000_a047

void __cdecl16far FUN_3000_9cfb(int param_1)

{
  char *pcVar1;
  int iVar2;
  undefined2 unaff_BP;
  undefined2 unaff_SI;
  int iVar3;
  undefined2 unaff_DI;
  long lVar4;
  
  clear_screen();
  print_text(0,0,0,(char *)s_LEVEL_6000_5466,4);
  print_text(0xb4,0,0,(char *)s_PERMANENT_SPELLS_6000_546c,4);
  print_text(900,0,0,(char *)s_PREPARATION_SPELLS_6000_547d,4);
  for (iVar3 = 0; iVar3 < 0x1e; iVar3 = iVar3 + 1) {
    iVar2 = (iVar3 / 3) % 3 + 6;
    pcVar1 = itoa(iVar3 / 3 + 1,DAT_6000_cb52,10);
    print_text(0x1e,iVar3 * 0x26 + 0x3c,0,pcVar1,iVar2);
    if (*(char *)(param_1 + (iVar3 / 3) * 3 + iVar3 % 3) != '\0') {
      print_text(0xb4,iVar3 * 0x26 + 0x3c,0,
                    *(undefined2 *)((iVar3 / 3) * 6 + (iVar3 % 3) * 2 + 0x4493),(iVar3 / 3) % 3 + 6)
      ;
    }
    if (*(char *)(param_1 + (iVar3 / 3) * 3 + iVar3 % 3 + 0x2d) != '\0') {
      print_text(900,iVar3 * 0x26 + 0x3c,0,
                    *(undefined2 *)((iVar3 / 3) * 6 + (iVar3 % 3) * 2 + 0x44cf),(iVar3 / 3) % 3 + 6)
      ;
    }
  }
  wait_key();
  clear_screen();
  print_text(0,0,0,(char *)s_LEVEL_6000_5466,4);
  print_text(0xb4,0,0,(char *)s_WIZARD_BATTLE_SPELLS_6000_5490,4);
  print_text(900,0,0,(char *)s_PRIEST_BATTLE_SPELLS_6000_54a5,4);
  for (iVar3 = 0; iVar3 < 0x1e; iVar3 = iVar3 + 1) {
    iVar2 = (iVar3 / 3) % 3 + 6;
    pcVar1 = itoa(iVar3 / 3 + 1,DAT_6000_cb52,10);
    print_text(0x1e,iVar3 * 0x26 + 0x3c,0,pcVar1,iVar2);
    if (*(char *)(param_1 + (iVar3 / 3) * 3 + iVar3 % 3 + 0x5a) != '\0') {
      print_text(0xb4,iVar3 * 0x26 + 0x3c,0,
                    *(undefined2 *)((iVar3 / 3) * 6 + (iVar3 % 3) * 2 + 0x450b),(iVar3 / 3) % 3 + 6)
      ;
    }
    if (*(char *)(param_1 + (iVar3 / 3) * 3 + iVar3 % 3 + 0x87) != '\0') {
      print_text(900,iVar3 * 0x26 + 0x3c,0,
                    *(undefined2 *)((iVar3 / 3) * 6 + (iVar3 % 3) * 2 + 0x4547),(iVar3 / 3) % 3 + 6)
      ;
    }
  }
  wait_key();
  clear_screen();
  DAT_6000_125a = 0xffff;
  DAT_6000_1258 = 0xffff;
  DAT_6000_1256 = 0xffff;
  DAT_6000_1254 = 0xffff;
  DAT_6000_124c = 0xbff0000000000000;
  lVar4 = ftol((double)CONCAT26(unaff_BP,CONCAT24(0xffff,CONCAT22(unaff_SI,unaff_DI))));
  DAT_6000_124a = (int)lVar4;
  DAT_6000_123d = 1;
  return;
}


// ==== FUN_3000_a047 @ 3000:a047 (size 819) callers: movecontrol

void __cdecl16far FUN_3000_a047(void)

{
  int iVar1;
  undefined2 uVar2;
  long lVar3;
  long lVar4;
  
  DAT_6000_130d = 900;
  FUN_2000_216b((char *)s_WHICH_DO_YOU_WISH_TO_SEE__6000_54ba,(char *)s_1__SPELLBOOKS_6000_54d4,
                (char *)s_2__SCROLLS_6000_54e2,(char *)s_3__WANDS_6000_54ed,
                (char *)s_4__PAPERS_6000_54f6,(char *)s_5__MISC__MAGIC_ITEMS_6000_5500,
                (undefined4 *)&DAT_6000_45cd,(char *)s_ANY_OTHER_KEY_TO_RETURNS____6000_5515);
  iVar1 = FUN_2000_1fbd(1,5);
  if ((0 < iVar1 + -0x30) && (iVar1 + -0x30 < 6)) {
    DAT_6000_cd18 = 1;
    DAT_6000_1248 = 0xffff;
    DAT_6000_1246 = 0xffff;
    DAT_6000_1244 = 0xffff;
    DAT_6000_1242 = 0xffff;
    DAT_6000_1240 = 0xffff;
    DAT_6000_123e = 0xffff;
    switch(iVar1) {
    case 0x31:
      FUN_3000_9cfb(0xc269);
      break;
    case 0x32:
      FUN_3000_9cfb(0xc31d);
      break;
    case 0x33:
      FUN_3000_9cfb(0xc3d1);
      break;
    case 0x34:
      FUN_3000_9cfb(0xc485);
      break;
    case 0x35:
      lVar4 = 0x63f;
      lVar3 = N_LXMUL(0x2ce,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      F_LDIV(lVar3,lVar4);
      fill_rect();
      DAT_6000_cd7c = 0;
      FUN_3000_9cd3((char *)s_MISC__MAGIC_ITEMS__6000_5531);
      DAT_6000_cd7c = DAT_6000_cd7c + 1;
      FUN_3000_9cd3((char *)s_HIT__I__AND__5__TO_USE_THESE__6000_5544);
      uVar2 = FUN_4000_428f((char *)s_1__HOLY_HAND_GRENADES__6000_5562,DAT_6000_c8ba,0);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_2__STONES_OF_TELEPORTATION__6000_557a,DAT_6000_c902,
                            DAT_6000_c902 >> 0xf);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_3__STONES_OF_SEEING__6000_5597,DAT_6000_c8bb,0);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_4__FLOOR_SLOSHERS__6000_55ad,DAT_6000_c8f0,
                            DAT_6000_c8f0 >> 0xf);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_5__POTION_OF_HEALING__6000_55c1,DAT_6000_c900,
                            DAT_6000_c900 >> 0xf);
      FUN_3000_9cd3(uVar2);
      DAT_6000_cd7c = DAT_6000_cd7c + 1;
      FUN_3000_9cd3((char *)s_HIT__I__AND__4__TO_USE_THESE__6000_55d8);
      uVar2 = FUN_4000_428f((char *)s_6__GREEN_PILLS__6000_55f6,(int)DAT_6000_c250,
                            (int)DAT_6000_c250 >> 0xf);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_7__ORANGE_PILLS__6000_5607,(int)DAT_6000_c24f,
                            (int)DAT_6000_c24f >> 0xf);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_8__YELLOW_PILLS__6000_5619,(int)DAT_6000_c254,
                            (int)DAT_6000_c254 >> 0xf);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_9__RED_PILLS__6000_562b,(int)DAT_6000_c252,
                            (int)DAT_6000_c252 >> 0xf);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_10__BLUE_PILLS__6000_563a,(int)DAT_6000_c251,
                            (int)DAT_6000_c251 >> 0xf);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_11__WHITE_PILLS__6000_564b,(int)DAT_6000_c253,
                            (int)DAT_6000_c253 >> 0xf);
      FUN_3000_9cd3(uVar2);
      DAT_6000_cd7c = DAT_6000_cd7c + 1;
      FUN_3000_9cd3((char *)s_THESE_ARE_AUTOMATICALLY_IN_USE__6000_565d);
      uVar2 = FUN_4000_428f((char *)s_12__RINGS_OF_REGENERATION__6000_567d,DAT_6000_c8b8,0);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_13__RING_OF_PROTECTION__PLUS_6000_5699,DAT_6000_c8c3,0);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_14__ANTI_MAGIC_RING__PLUS_6000_56b7,DAT_6000_c8c4,0);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_15__BODY_ARMOR__LEVEL_6000_56d2,DAT_6000_c8c2,0);
      FUN_3000_9cd3(uVar2);
      uVar2 = FUN_4000_428f((char *)s_16__GAUNTLET__PLUS_6000_56e9,(int)DAT_6000_c938,
                            (int)DAT_6000_c938 >> 0xf);
      FUN_3000_9cd3(uVar2);
      DAT_6000_cd7c = DAT_6000_cd7c + 1;
      FUN_3000_9cd3((char *)s_HIT_ANY_KEY____6000_4a75);
      wait_key();
      lVar4 = 0x63f;
      lVar3 = N_LXMUL(0x2ce,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      F_LDIV(lVar3,lVar4);
      fill_rect();
    }
    return;
  }
  return;
}


// ==== myrand @ 3000:a384 (size 191) callers: surface_feature,chute_target,trapdoor_target,ladder_delta,wall_side  // the dungeon hash over (x, y, level, dungeon); DotU's, exactly

int __cdecl16far myrand(int param_1,int param_2,int param_3,int param_4,int param_5)

{
  uint uVar1;
  uint uVar2;
  int iVar3;
  
  if ((-1 < param_1) && (-1 < param_2)) {
    param_1 = param_1 + 9;
    param_2 = param_2 + 7;
    param_3 = param_3 + 0xd;
    uVar1 = ((param_1 * 0x19) / param_2 + (param_4 + 0xf) * 7) * param_3 +
            (param_3 * 0x1b) % (param_4 + 0xf) + (param_2 * 0x1f) % param_3 +
            (param_1 * param_2 * param_3) / 0x11 + param_1 * 0xd + param_2 * 0xb + param_3 * 0x11;
    uVar2 = (int)uVar1 >> 0xf;
    iVar3 = (int)((uVar1 ^ uVar2) - uVar2) % param_5;
    if (iVar3 < 0) {
      iVar3 = 0;
    }
    if (param_5 <= iVar3) {
      iVar3 = param_5 + -1;
    }
    return iVar3;
  }
  return 0;
}


// ==== ladder_delta @ 3000:a449 (size 215) callers: movecontrol,FUN_3000_2796,draw_map_square  // how far a ladder here leads: + down, - up, 0 no ladder

int __cdecl16far ladder_delta(undefined2 param_1,undefined2 param_2,int param_3,undefined2 param_4)

{
  char cVar1;
  int iVar2;
  int iVar3;
  int iVar4;
  
  iVar4 = param_3;
  do {
    do {
      iVar4 = iVar4 + -1;
      if ((iVar4 <= param_3 + -4) || (iVar4 < 0)) {
        iVar3 = myrand(param_1,param_2,param_3,param_4,0x1f);
        iVar4 = param_3;
        if (iVar3 == 1) {
          while ((iVar4 = iVar4 + 1, iVar4 < param_3 + 3 && (iVar4 < 0xca))) {
            cVar1 = is_solid(param_1,param_2,iVar4,param_4);
            if (cVar1 == '\0') {
              return iVar4 - param_3;
            }
          }
        }
        return 0;
      }
      if (iVar4 < 0) {
        iVar4 = 0;
      }
      cVar1 = is_solid(param_1,param_2,iVar4,param_4);
    } while ((cVar1 != '\0') ||
            (iVar2 = myrand(param_1,param_2,iVar4,param_4,0x1f), iVar3 = iVar4, iVar2 != 1));
    do {
      iVar3 = iVar3 + 1;
      cVar1 = is_solid(param_1,param_2,iVar3,param_4);
    } while (cVar1 != '\0');
  } while (iVar3 != param_3);
  return iVar4 - param_3;
}


// ==== wall_side @ 3000:a524 (size 205) callers: FUN_2000_7d60,FUN_2000_7fb1,FUN_2000_81cd,FUN_2000_8b3f,FUN_2000_97b8,movecontrol,FUN_3000_1a08,FUN_3000_31f3,is_solid,FUN_3000_a8d5,draw_map_square  // the wall value 0..3 on one side of a square, from DUNG.BIN

int __cdecl16far
wall_side(uint param_1,uint param_2,char param_3,undefined2 param_4,undefined2 param_5)

{
  undefined2 in_AX;
  byte bVar2;
  int iVar1;
  undefined1 local_3;
  
  local_3 = 0;
  bVar2 = (byte)((uint)in_AX >> 8);
  if (((param_1 == 0) || (DAT_6000_448b <= param_1)) && (param_3 == '\0')) {
    return (uint)bVar2 << 8;
  }
  if (((param_2 == 0) || (DAT_6000_448d <= param_2)) && (param_3 == '\x01')) {
    return (uint)bVar2 << 8;
  }
  if (param_3 != '\0') {
    local_3 = 2;
  }
  if ((param_1 & 1) != 0) {
    local_3 = local_3 + 4;
  }
  iVar1 = myrand(param_1 >> 4,param_2 >> 4,param_4,param_5,DAT_6000_4486 + -1);
  return ((int)(uint)*(byte *)(iVar1 * 0x200 + (param_1 >> 4 & 1) * 0x100 +
                               (param_2 >> 4 & 1) * 0x80 + (param_1 >> 1 & 7) * 0x10 +
                               (param_2 & 0xf) + -0x630e) >> local_3) % 4;
}


// ==== draw_wall_side @ 3000:a5f7 (size 605) callers: FUN_3000_a8d5,draw_map_square  // draws one wall of a map cell, door marks and all

void __cdecl16far draw_wall_side(char param_1,int param_2,int param_3,char param_4)

{
  undefined1 uVar2;
  undefined1 extraout_AH;
  int iVar1;
  undefined1 extraout_AH_00;
  undefined1 extraout_AH_01;
  
  param_2 = DAT_6000_4488 * param_2;
  param_3 = DAT_6000_4488 * param_3;
  uVar2 = (undefined1)((uint)param_3 >> 8);
  if (param_4 == '\0') {
    iVar1 = param_3;
    if (param_1 != '\x03') {
      iVar1 = (*DAT_6000_962a)(0x3000,DAT_6000_448f + param_2,DAT_6000_4491 + param_3 + 1,
                               DAT_6000_448f + param_2,
                               DAT_6000_4491 + param_3 + (int)DAT_6000_4488 + -1,CONCAT11(uVar2,0xf)
                              );
    }
    uVar2 = (undefined1)((uint)iVar1 >> 8);
    if (param_1 == '\x01') {
      if ('\a' < DAT_6000_4488) {
        (*DAT_6000_962a)(0x3000,(DAT_6000_448f + param_2) - (int)DAT_6000_4488 / 3,
                         DAT_6000_4491 + param_3 + ((int)DAT_6000_4488 >> 1) + 1,
                         DAT_6000_448f + param_2 + (int)DAT_6000_4488 / 3,
                         DAT_6000_4491 + param_3 + ((int)DAT_6000_4488 >> 1) + 1,CONCAT11(uVar2,0xf)
                        );
        (*DAT_6000_962a)(0x3000,(DAT_6000_448f + param_2) - (int)DAT_6000_4488 / 3,
                         DAT_6000_4491 + param_3 + ((int)DAT_6000_4488 >> 1) + -1,
                         DAT_6000_448f + param_2 + (int)DAT_6000_4488 / 3,
                         DAT_6000_4491 + param_3 + ((int)DAT_6000_4488 >> 1) + -1,
                         CONCAT11(extraout_AH_00,0xf));
        uVar2 = extraout_AH_01;
      }
      (*DAT_6000_962a)(0x3000,DAT_6000_448f + param_2 + -1,
                       DAT_6000_4491 + param_3 + ((int)DAT_6000_4488 >> 1),
                       DAT_6000_448f + param_2 + 1,
                       DAT_6000_4491 + param_3 + ((int)DAT_6000_4488 >> 1),CONCAT11(uVar2,0xf));
    }
  }
  else {
    if (param_1 != '\x03') {
      (*DAT_6000_962a)(0x3000,DAT_6000_448f + param_2 + 1,DAT_6000_4491 + param_3,
                       DAT_6000_448f + param_2 + (int)DAT_6000_4488 + -1,DAT_6000_4491 + param_3,
                       CONCAT11(uVar2,0xf));
    }
    if (param_1 == '\x01') {
      if (DAT_6000_4488 < '\b') {
        (*DAT_6000_962a)(0x3000,DAT_6000_448f + param_2 + ((int)DAT_6000_4488 >> 1),
                         DAT_6000_4491 + param_3 + -1,
                         DAT_6000_448f + param_2 + ((int)DAT_6000_4488 >> 1),
                         DAT_6000_4491 + param_3 + 1,0xf);
      }
      else {
        (*DAT_6000_962a)(0x3000,DAT_6000_448f + param_2 + ((int)DAT_6000_4488 >> 1) + -1,
                         (DAT_6000_4491 + param_3) - (int)DAT_6000_4488 / 3,
                         DAT_6000_448f + param_2 + ((int)DAT_6000_4488 >> 1) + -1,
                         DAT_6000_4491 + param_3 + (int)DAT_6000_4488 / 3,0xf);
        (*DAT_6000_962a)(0x3000,DAT_6000_448f + param_2 + ((int)DAT_6000_4488 >> 1) + 1,
                         (DAT_6000_4491 + param_3) - (int)DAT_6000_4488 / 3,
                         DAT_6000_448f + param_2 + ((int)DAT_6000_4488 >> 1) + 1,
                         DAT_6000_4491 + param_3 + (int)DAT_6000_4488 / 3,CONCAT11(extraout_AH,0xf))
        ;
      }
    }
  }
  return;
}


// ==== is_solid @ 3000:a854 (size 125) callers: generate_section,chute_target,dig_hole,FUN_2000_a6fa,FUN_2000_cbdf,FUN_2000_cccc,FUN_2000_d195,FUN_2000_d358,FUN_3000_8235,ladder_delta,FUN_3000_e221  // true when all four sides of a square are walls

undefined2 __cdecl16far is_solid(int param_1,int param_2,undefined2 param_3,undefined2 param_4)

{
  char cVar1;
  uint in_AX;
  
  cVar1 = wall_side(param_1,param_2,in_AX & 0xff00,param_3,param_4);
  if (cVar1 == '\0') {
    cVar1 = wall_side(param_1,param_2,1,param_3,param_4);
    if (cVar1 == '\0') {
      cVar1 = wall_side(param_1 + 1,param_2,0,param_3,param_4);
      if (cVar1 == '\0') {
        cVar1 = wall_side(param_1,param_2 + 1,1,param_3,param_4);
        if (cVar1 == '\0') {
          return 1;
        }
      }
    }
  }
  return 0;
}


// ==== FUN_3000_a8d5 @ 3000:a8d5 (size 93) callers: 

void __cdecl16far
FUN_3000_a8d5(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             char param_5,char param_6)

{
  uint in_AX;
  undefined2 uVar1;
  undefined1 extraout_AH;
  
  uVar1 = wall_side(param_1,param_2,(uint)(byte)(param_5 >> 7) << 8,param_3,param_4,(int)param_5
                        ,(int)param_6,in_AX & 0xff00);
  draw_wall_side(uVar1);
  uVar1 = wall_side(param_1,param_2,CONCAT11(param_5 >> 7,1),param_3,param_4,(int)param_5,
                        (int)param_6,CONCAT11(extraout_AH,1));
  draw_wall_side(uVar1);
  return;
}


// ==== draw_cell_corners @ 3000:a932 (size 75) callers: draw_map_square  // the four corner dots of a map cell at high zoom

void __cdecl16far
draw_cell_corners(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             undefined1 param_5)

{
  undefined1 extraout_AH;
  undefined1 extraout_AH_00;
  undefined1 extraout_AH_01;
  
  (*DAT_6000_9632)(0x3000,param_1,param_2,param_5);
  (*DAT_6000_9632)(0x3000,param_3,param_2,CONCAT11(extraout_AH,param_5));
  (*DAT_6000_9632)(0x3000,param_1,param_4,CONCAT11(extraout_AH_00,param_5));
  (*DAT_6000_9632)(0x3000,param_3,param_4,CONCAT11(extraout_AH_01,param_5));
  return;
}


// ==== draw_map_square @ 3000:a97d (size 1522) callers: movecontrol,FUN_3000_2796,FUN_3000_b066  // one automap cell: terrain, walls, ladder, trap door, chute

void __cdecl16far
draw_map_square(int param_1,int param_2,int param_3,undefined2 param_4,char param_5,char param_6)

{
  int iVar1;
  byte extraout_AH;
  byte extraout_AH_00;
  byte bVar4;
  byte bVar5;
  undefined2 uVar2;
  undefined1 extraout_AH_01;
  byte extraout_AH_02;
  undefined1 extraout_AH_03;
  int iVar3;
  undefined1 extraout_AH_04;
  undefined1 uVar6;
  undefined1 extraout_AH_05;
  undefined1 extraout_AH_06;
  undefined1 extraout_AH_07;
  undefined2 uVar7;
  undefined1 local_8;
  int local_6;
  int local_4;
  
  local_4 = 0;
  local_6 = -1;
  local_8 = 4;
  if ((DAT_6000_c8a2 == 0) && (iVar1 = surface_feature(param_1,param_2), iVar1 != 0)) {
    if ((DAT_6000_cd94 < 2) || (DAT_6000_00c5 == 1)) {
      local_4 = 0xf;
    }
    else {
      local_4 = surface_feature(param_1,param_2);
      local_4 = local_4 + 2;
    }
  }
  if ((((-1 < param_5) && (param_5 < DAT_6000_4489)) && (-1 < param_6)) && (param_6 < DAT_6000_448a)
     ) {
    if ((DAT_6000_cd98 < 1) && ((DAT_6000_cd98 < 0 || (DAT_6000_cd96 < 0x14a)))) {
      fill_rect(DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 + 1,
                    DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + 1,
                    DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 + (int)DAT_6000_4488,
                    DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + (int)DAT_6000_4488 + 1,
                    local_4);
      bVar4 = extraout_AH;
    }
    else {
      fill_rect(DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 + 1,
                    DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + 1,
                    DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 + (int)DAT_6000_4488,
                    DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + (int)DAT_6000_4488,local_4);
      bVar4 = extraout_AH_00;
    }
    uVar7 = 0x4000;
    bVar5 = param_5 >> 7;
    uVar2 = wall_side(param_1,param_2,(uint)bVar5 << 8,param_3,param_4,(int)param_5,(int)param_6
                          ,(uint)bVar4 << 8);
    draw_wall_side(uVar2);
    uVar2 = wall_side(param_1,param_2,CONCAT11(bVar5,1),param_3,param_4,(int)param_5,
                          (int)param_6,CONCAT11(extraout_AH_01,1));
    draw_wall_side(uVar2);
    uVar2 = wall_side(param_1 + 1,param_2,(int)param_5 + 1U & 0xff00,param_3,param_4,
                          (int)param_5 + 1U,(int)param_6,(uint)extraout_AH_02 << 8);
    draw_wall_side(uVar2);
    uVar2 = wall_side(param_1,param_2 + 1,CONCAT11(bVar5,1),param_3,param_4,(int)param_5,
                          param_6 + 1,CONCAT11(extraout_AH_03,1));
    draw_wall_side(uVar2);
    if (4 < DAT_6000_cd94) {
      draw_cell_corners(DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488,
                    DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488,
                    DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 + (int)DAT_6000_4488,
                    DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + (int)DAT_6000_4488,6);
    }
    iVar3 = ladder_delta(param_1,param_2,param_3,param_4);
    iVar1 = iVar3;
    if (iVar3 == 0) {
      uVar7 = 0x2000;
      local_6 = trapdoor_target(param_1,param_2,param_3,param_4);
      iVar1 = local_6;
      if ((local_6 == -1) && (param_3 != 0)) {
        uVar7 = 0x2000;
        iVar1 = is_explored(param_1,param_2);
        if (iVar1 == 0) {
          iVar1 = 0;
        }
        else {
          uVar7 = 0x2000;
          iVar1 = chute_target(param_1,param_2,param_3,param_4);
          if (iVar1 != param_3) {
            local_6 = 1;
            local_8 = 3;
            (*DAT_6000_962a)(0x2000,DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 +
                                    (int)DAT_6000_4488 / 2,
                             DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488,
                             DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 +
                             (int)DAT_6000_4488 / 2,
                             DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + (int)DAT_6000_4488,
                             3);
            iVar1 = (*DAT_6000_962a)(0x2000,DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488,
                                     DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 +
                                     (int)DAT_6000_4488 / 2,
                                     DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 +
                                     (int)DAT_6000_4488,
                                     DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 +
                                     (int)DAT_6000_4488 / 2,CONCAT11(extraout_AH_04,3));
          }
        }
      }
    }
    uVar6 = (undefined1)((uint)iVar1 >> 8);
    if ((((0 < iVar3) || (local_6 != -1)) &&
        ((*DAT_6000_962a)(uVar7,DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488,
                          DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488,
                          DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 + (int)DAT_6000_4488,
                          DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + (int)DAT_6000_4488,
                          CONCAT11(uVar6,local_8)), uVar6 = extraout_AH_05, -1 < DAT_6000_cd98)) &&
       ((0 < DAT_6000_cd98 || (1000 < DAT_6000_cd96)))) {
      (*DAT_6000_962a)(uVar7,DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488,
                       DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + 1,
                       DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 + (int)DAT_6000_4488,
                       DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + (int)DAT_6000_4488 + 1,
                       CONCAT11(extraout_AH_05,local_8));
      uVar6 = extraout_AH_06;
    }
    if (((iVar3 < 0) || (local_6 != -1)) &&
       (((*DAT_6000_962a)(uVar7,DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488,
                          DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + (int)DAT_6000_4488,
                          DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 + (int)DAT_6000_4488,
                          DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488,CONCAT11(uVar6,local_8))
        , -1 < DAT_6000_cd98 && ((0 < DAT_6000_cd98 || (1000 < DAT_6000_cd96)))))) {
      (*DAT_6000_962a)(uVar7,DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488,
                       DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + (int)DAT_6000_4488 + 1,
                       DAT_6000_448f + (int)param_5 * (int)DAT_6000_4488 + (int)DAT_6000_4488,
                       DAT_6000_4491 + (int)param_6 * (int)DAT_6000_4488 + 1,
                       CONCAT11(extraout_AH_07,local_8));
    }
    return;
  }
  return;
}


// ==== seeded_pick @ 3000:af6f (size 243) callers:   // chained srand/rand over (x, y, level, dungeon); no callers

undefined2 __cdecl16far seeded_pick(int param_1,int param_2,int param_3,int param_4,int param_5)

{
  short sVar1;
  long lVar2;
  long lVar3;
  
  srand(param_1 * 5 + 4);
  lVar3 = 0x8000;
  sVar1 = rand();
  lVar2 = N_LXMUL((long)(param_4 * 5 + 0x10),(long)sVar1);
  lVar2 = F_LDIV(lVar2,lVar3);
  srand((ushort)lVar2);
  lVar3 = 0x8000;
  sVar1 = rand();
  lVar2 = N_LXMUL((long)(param_3 * 5 + 0x10),(long)sVar1);
  lVar2 = F_LDIV(lVar2,lVar3);
  srand((ushort)lVar2);
  lVar3 = 0x8000;
  sVar1 = rand();
  lVar2 = N_LXMUL((long)(param_2 * 5 + 4),(long)sVar1);
  lVar2 = F_LDIV(lVar2,lVar3);
  srand((ushort)lVar2);
  lVar3 = 0x8000;
  sVar1 = rand();
  lVar2 = N_LXMUL((long)param_5,(long)sVar1);
  lVar2 = F_LDIV(lVar2,lVar3);
  return (int)lVar2;
}


// ==== FUN_3000_b066 @ 3000:b066 (size 368) callers: movecontrol

void __cdecl16far FUN_3000_b066(int param_1,int param_2,undefined2 param_3,undefined2 param_4)

{
  int iVar1;
  long lVar2;
  long lVar3;
  char local_4;
  char local_3;
  
  if (DAT_6000_4489 < 'P') {
    lVar3 = 0x640;
    lVar2 = N_LXMUL(0x119,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    F_LDIV(lVar2,lVar3);
    fill_rect();
    lVar3 = 0x4b0;
    lVar2 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar2 = F_LDIV(lVar2,lVar3);
    DAT_6000_4491 = (undefined2)lVar2;
  }
  else {
    fill_rect();
    DAT_6000_4491 = 4;
  }
  for (local_3 = '\0'; local_3 < DAT_6000_4489; local_3 = local_3 + '\x01') {
    for (local_4 = '\0'; local_4 < DAT_6000_448a; local_4 = local_4 + '\x01') {
      iVar1 = FUN_2000_5196((param_1 + local_3) - (int)DAT_6000_4489 / 2);
      if (iVar1 != 0) {
        draw_map_square((param_1 + local_3) - (int)DAT_6000_4489 / 2,
                      (param_2 + local_4) - (int)DAT_6000_448a / 2,param_3,param_4,local_3);
      }
    }
  }
  return;
}


// ==== FUN_3000_b1d6 @ 3000:b1d6 (size 1564) callers: FUN_3000_b8cb

void __cdecl16far FUN_3000_b1d6(void)

{
  short sVar1;
  int iVar2;
  int iVar3;
  int iVar4;
  uint uVar5;
  long lVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  undefined2 uVar11;
  int local_8;
  
  flush_keys();
  lVar6 = time((void *)0x0);
  srand((ushort)lVar6);
  do {
    print_text(0x14b,0,2,(char *)s_MORAFF_S_WORLD_6000_56fd,5);
    print_text(0x104,0x6e,1,(char *)s_VERSION_6_1__COPYRIGHT_1993__6000_570c,3);
    print_text(0x18e,0xaf,1,(char *)s_ALL_RIGHTS_RESERVED_6000_5729,3);
    local_8 = 0xf;
    if (DAT_6000_cd94 < 2) {
      uVar10 = 0;
      uVar9 = 0x4af;
      lVar6 = N_LXMUL(0xe6,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
      for (uVar5 = (uint)lVar6;
          ((int)uVar5 >> 0xf < DAT_6000_cd9c ||
          (((int)uVar5 >> 0xf == DAT_6000_cd9c && (uVar5 < DAT_6000_cd9a)))); uVar5 = uVar5 + 2) {
        (*DAT_6000_962a)(0x1000,0,uVar5,DAT_6000_cd96,uVar5,CONCAT11((char)(uVar5 >> 8),1));
      }
    }
    else {
      uVar11 = 1;
      uVar10 = 0;
      uVar9 = 0x4af;
      lVar6 = N_LXMUL(0x1c2,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
      uVar10 = (undefined2)lVar6;
      uVar7 = 0;
      uVar8 = 0x4af;
      uVar9 = DAT_6000_cd96;
      lVar6 = N_LXMUL(0xe6,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar8));
      fill_rect(0,(int)lVar6,uVar9,uVar10,uVar11);
      uVar7 = 0xd;
      uVar8 = 0;
      uVar10 = 0x4af;
      uVar9 = DAT_6000_cd96;
      uVar5 = DAT_6000_cd9a;
      lVar6 = N_LXMUL(0x1c2,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar10));
      fill_rect(0,(int)lVar6,uVar9,uVar5,uVar7);
    }
    if (DAT_6000_d0da == 0) {
      print_text_clipped(400,0x488,0x4b0,0,(char *)s_HIT_ANY_KEY_TO_SKIP_INTRODUCTION_6000_576f,5);
    }
    else {
      print_text_clipped(200,0x488,0x578,0,(char *)s_HIT_ESCAPE_OR_A_MOUSE_BUTTON_TO_S_6000_573d,5);
    }
    flush_keys();
    while (local_8 < 0x127) {
      if (local_8 < 0x46) {
        local_8 = local_8 + 3;
      }
      else {
        local_8 = local_8 + 8;
      }
      FUN_1000_22a2(0x1a4 - local_8);
      do {
        uVar10 = 0;
        uVar9 = 0x8000;
        sVar1 = rand();
        lVar6 = F_LDIV(CONCAT22((sVar1 >> 0xf) << 1 | (uint)(sVar1 < 0),sVar1 << 1),
                       CONCAT22(uVar10,uVar9));
        if ((int)lVar6 == 0) {
          uVar10 = 0;
          uVar9 = 0x8000;
          sVar1 = rand();
          lVar6 = N_LXMUL(3,(long)sVar1);
          lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
          if ((int)lVar6 == 0) {
            uVar10 = 0;
            uVar9 = 0x8000;
            sVar1 = rand();
            lVar6 = N_LXMUL(100,(long)sVar1);
            lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
            iVar4 = (int)lVar6;
          }
          else {
            uVar10 = 0;
            uVar9 = 0x8000;
            sVar1 = rand();
            lVar6 = N_LXMUL(0x39,(long)sVar1);
            lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
            iVar4 = (int)lVar6;
          }
        }
        else {
          uVar10 = 0;
          uVar9 = 0x8000;
          sVar1 = rand();
          lVar6 = N_LXMUL(9,(long)sVar1);
          lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
          iVar4 = (int)lVar6;
        }
      } while (*(char *)(*(char *)(iVar4 * 0x23 + 0x259) + 0x11ef) == '\0');
      DAT_6000_43a0 = (int)*(char *)(iVar4 * 0x23 + 600);
      uVar10 = 0;
      uVar9 = 0x8000;
      sVar1 = rand();
      lVar6 = N_LXMUL((long)(local_8 * -2 + 0x62c),(long)sVar1);
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
      iVar2 = (int)lVar6 + 10;
      iVar3 = FUN_4000_3498();
      if (iVar3 != 0) {
        return;
      }
      iVar4 = *(char *)(iVar4 * 0x23 + 0x259) * 4;
      FUN_3000_0105(iVar2,(0x230 - local_8) - (0x96 - local_8 / 2),iVar2 + local_8 * 2,
                    (local_8 * 2 + 0x230) - (0x96 - local_8 / 2),*(undefined2 *)(iVar4 + -0x35be),
                    *(undefined2 *)(iVar4 + -0x35bc),0,0xff);
    }
    for (iVar4 = 0; iVar4 < 0xc; iVar4 = iVar4 + 1) {
      iVar2 = FUN_4000_3498();
      if (iVar2 != 0) {
        return;
      }
      FUN_1000_22a2(0xfa);
    }
    uVar10 = 0;
    uVar9 = 0x4af;
    lVar6 = N_LXMUL(0x447,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
    uVar10 = 0;
    uVar9 = 0x63f;
    lVar6 = N_LXMUL(0x514,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
    uVar9 = (undefined2)lVar6;
    uVar8 = 0;
    uVar10 = 0x4af;
    lVar6 = N_LXMUL(0x308,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar10));
    uVar10 = (undefined2)lVar6;
    uVar7 = 0;
    uVar8 = 0x63f;
    lVar6 = N_LXMUL(300,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar8));
    fill_rect((int)lVar6,uVar10,uVar9);
    uVar10 = 0;
    uVar9 = 0x4af;
    lVar6 = N_LXMUL(0x438,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
    uVar10 = 0;
    uVar9 = 0x63f;
    lVar6 = N_LXMUL(0x50a,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
    uVar9 = (undefined2)lVar6;
    uVar8 = 0;
    uVar10 = 0x4af;
    lVar6 = N_LXMUL(0x312,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar10));
    uVar10 = (undefined2)lVar6;
    uVar7 = 0;
    uVar8 = 0x63f;
    lVar6 = N_LXMUL(0x136,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar8));
    fill_rect((int)lVar6,uVar10,uVar9);
    uVar10 = 0;
    uVar9 = 0x4af;
    lVar6 = N_LXMUL(0x429,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
    uVar10 = 0;
    uVar9 = 0x63f;
    lVar6 = N_LXMUL(0x500,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar10,uVar9));
    uVar9 = (undefined2)lVar6;
    uVar8 = 0;
    uVar10 = 0x4af;
    lVar6 = N_LXMUL(0x326,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar10));
    uVar10 = (undefined2)lVar6;
    uVar7 = 0;
    uVar8 = 0x63f;
    lVar6 = N_LXMUL(0x140,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar8));
    fill_rect((int)lVar6,uVar10,uVar9);
    print_text(0x163,0x334,0,(char *)s_WRITTEN_AND_PRODUCED_BY_STEVE_MO_6000_5790,6);
    print_text(0x163,0x35c,0,(char *)s_ARTWORK_BY_RODNEY_PAGE_6000_57b5,3);
    print_text(0x163,900,0,(char *)s_ADDITIONAL_ARTWORK_AND_TESTING_B_6000_57cc,8);
    print_text(0x163,0x3ac,0,(char *)s_MARTIN_AND_LAURIE_NOEL_6000_57ee,8);
    print_text(0x163,0x3d4,0,(char *)s_FINANCED_BY_OUR_REGISTERED_USERS_6000_5808,5);
    FUN_2000_3fcf();
    print_text(0x163,0x3fc,0,DAT_6000_cb52,0xf);
    for (iVar4 = 0; iVar4 < 0x20; iVar4 = iVar4 + 1) {
      iVar2 = FUN_4000_3498();
      if (iVar2 != 0) {
        return;
      }
      FUN_1000_22a2(0xfa);
    }
    clear_screen();
  } while( true );
}


// ==== FUN_3000_b7fd @ 3000:b7fd (size 152) callers: FUN_2000_ea27,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a

void __cdecl16far FUN_3000_b7fd(int param_1,int param_2,int param_3)

{
  char cVar1;
  int iVar2;
  int iVar3;
  int local_4;
  
  load_spell_text(param_1 * 0x1e + param_2 * 3 + param_3);
  for (iVar2 = 0; iVar2 < 8; iVar2 = iVar2 + 1) {
    *(undefined1 *)((undefined2 *)&DAT_6000_cd80)[iVar2] = 0;
  }
  iVar3 = 0;
  local_4 = 1;
  iVar2 = 0;
  while (cVar1 = *(char *)(DAT_6000_cd16 + local_4), cVar1 != '\0') {
    if (cVar1 == '@') {
      cVar1 = '\0';
    }
    *(char *)(((undefined2 *)&DAT_6000_cd80)[iVar3] + iVar2) = cVar1;
    local_4 = local_4 + 1;
    iVar2 = iVar2 + 1;
    if (cVar1 == '\0') {
      iVar2 = 0;
      iVar3 = iVar3 + 1;
    }
  }
  *(undefined1 *)(((undefined2 *)&DAT_6000_cd80)[iVar3] + iVar2) = 0;
  return;
}


// ==== FUN_3000_b89b @ 3000:b89b (size 48) callers: 

void __cdecl16far FUN_3000_b89b(int param_1)

{
  short sVar1;
  int iVar2;
  
  iVar2 = 0;
  while( true ) {
    if (param_1 <= iVar2) {
      return;
    }
    sVar1 = kbhit();
    if (sVar1 != 0) break;
    FUN_1000_22a2(0x32);
    iVar2 = iVar2 + 0x32;
  }
  return;
}


// ==== FUN_3000_b8cb @ 3000:b8cb (size 9) callers: main

void __cdecl16far FUN_3000_b8cb(void)

{
  FUN_3000_b1d6();
  return;
}


// ==== FUN_3000_b8d4 @ 3000:b8d4 (size 196) callers: FUN_2000_892d,FUN_3000_d51c

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_b8d4(int param_1)

{
  byte bVar1;
  undefined2 uVar2;
  
  uVar2 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
  bVar1 = *(byte *)((int)DAT_6000_cbde + param_1 * 6 + 5);
  if (0x82 < bVar1) {
    bVar1 = 0x82;
  }
  if (*(int *)((uint)*(byte *)((int)DAT_6000_cbde + param_1 * 6 + 4) * 0x23 + 0x256) == -1) {
    return;
  }
  pow(DAT_6000_5df1,(double)bVar1);
  return;
}


// ==== FUN_3000_b99e @ 3000:b99e (size 137) callers: FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a

void __cdecl16far FUN_3000_b99e(void)

{
  long lVar1;
  undefined2 uVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  
  FUN_1000_22a2(1000);
  uVar5 = 0;
  uVar4 = 0;
  uVar2 = 0x4af;
  lVar1 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar2));
  uVar2 = (undefined2)lVar1;
  uVar3 = 0;
  uVar4 = 0x63f;
  lVar1 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar3,uVar4));
  fill_rect(0,0,(int)lVar1,uVar2,uVar5);
  print_text(0,0,0,(char *)s__GOOD_NEWS____6000_5dfc + 1,0xf);
  FUN_1000_22a2(0x514);
  return;
}


// ==== FUN_3000_ba27 @ 3000:ba27 (size 442) callers: FUN_3000_d51c

void __cdecl16far FUN_3000_ba27(void)

{
  short sVar1;
  int iVar2;
  int iVar3;
  long lVar4;
  undefined2 uVar5;
  undefined2 uVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  
  if (DAT_6000_c11c == '\x02') {
    return;
  }
  uVar7 = 0;
  uVar6 = 0x8000;
  sVar1 = rand();
  lVar4 = N_LXMUL(7,(long)sVar1);
  lVar4 = F_LDIV(lVar4,CONCAT22(uVar7,uVar6));
  iVar2 = (int)lVar4;
  uVar7 = 0;
  uVar6 = 0x8000;
  sVar1 = rand();
  lVar4 = N_LXMUL((long)((iVar2 + 1) * 100),(long)sVar1);
  lVar4 = F_LDIV(lVar4,CONCAT22(uVar7,uVar6));
  if ((int)(*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 5) + 10) < (int)lVar4) {
    return;
  }
  if ('\0' < *(char *)(iVar2 + -0x3e8c)) {
    return;
  }
  FUN_3000_b99e();
  for (iVar3 = 0; iVar3 < 8; iVar3 = iVar3 + 1) {
    strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar3],(char *)&DAT_6000_45cd);
  }
  strcpy(DAT_6000_cd80,(char *)s_YOU_FIND_A_6000_5e0a);
  strcat(DAT_6000_cd80,(char *)*(undefined2 *)((iVar2 + 1) * 7 + 0x1c0));
  strcpy(DAT_6000_cd84,(char *)s_1__TAKE_THE_WEAPON_6000_5e16);
  strcpy(DAT_6000_cd86,(char *)s_2__LEAVE_THE_WEAPON_6000_5e29);
  strcpy(DAT_6000_cd8a,(char *)s_NOTE_THAT_YOU_MAY_END_UP_6000_5e3d);
  strcpy(DAT_6000_cd8c,(char *)s_WITH_SEVERAL_WEAPONS_WHICH_6000_5e56);
  strcpy(DAT_6000_cd8e,(char *)s_WILL_WEIGH_YOU_DOWN__6000_5e71);
  FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
  flush_keys();
  iVar3 = FUN_2000_1fbd(2,3);
  if (iVar3 == 0x31) {
    *(char *)(iVar2 + -0x3e8c) = *(char *)(iVar2 + -0x3e8c) + '\x01';
    FUN_2000_2d8e();
  }
  uVar8 = 0;
  uVar7 = 0;
  uVar6 = 0x4af;
  lVar4 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar4 = F_LDIV(lVar4,CONCAT22(uVar7,uVar6));
  uVar6 = (undefined2)lVar4;
  uVar5 = 0;
  uVar7 = 0x63f;
  lVar4 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar4 = F_LDIV(lVar4,CONCAT22(uVar5,uVar7));
  fill_rect(0,0,(int)lVar4,uVar6,uVar8);
  return;
}


// ==== FUN_3000_bbe1 @ 3000:bbe1 (size 445) callers: FUN_3000_d51c

void __cdecl16far FUN_3000_bbe1(void)

{
  char *pcVar1;
  short sVar2;
  int iVar3;
  int iVar4;
  long lVar5;
  long lVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  
  if (DAT_6000_c11c == '\x02') {
    return;
  }
  uVar9 = 0;
  uVar8 = 0x8000;
  sVar2 = rand();
  lVar5 = N_LXMUL(6,(long)sVar2);
  lVar5 = F_LDIV(lVar5,CONCAT22(uVar9,uVar8));
  iVar3 = (int)lVar5 + 1;
  uVar9 = 0;
  uVar8 = 0x8000;
  sVar2 = rand();
  lVar6 = N_LXMUL((long)(iVar3 * 100),(long)sVar2);
  lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar8));
  if ((int)(*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 5) + 10) < (int)lVar6) {
    return;
  }
  FUN_3000_b99e();
  for (iVar4 = 0; iVar4 < 8; iVar4 = iVar4 + 1) {
    strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)&DAT_6000_45cd);
  }
  strcpy(DAT_6000_cd80,(char *)s_YOU_FIND_A_SUIT_OF_6000_5e86);
  strcat(DAT_6000_cd80,(char *)*(undefined2 *)(iVar3 * 5 + 0x214));
  strcpy(DAT_6000_cd82,(char *)s_ARMOR__6000_5e9a);
  strcpy(DAT_6000_cd84,(char *)s_1__TAKE_THE_ARMOR_6000_5ea3);
  strcpy(DAT_6000_cd86,(char *)s_2__LEAVE_THE_ARMOR_6000_5eb5);
  strcpy(DAT_6000_cd8a,(char *)s_NOTE_THAT_YOU_MAY_END_UP_6000_5e3d);
  strcpy(DAT_6000_cd8c,(char *)s_WITH_SEVERAL_SUITS_OF_6000_5ec8);
  strcpy(DAT_6000_cd8e,(char *)s_ARMOR_WEIGHING_YOU_DOWN__6000_5ede);
  FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
  flush_keys();
  iVar3 = FUN_2000_1fbd(2,3);
  if (iVar3 == 0x31) {
    pcVar1 = (char *)((int)lVar5 + -0x3e5d);
    *pcVar1 = *pcVar1 + '\x01';
    FUN_2000_2d8e();
  }
  uVar10 = 0;
  uVar9 = 0;
  uVar8 = 0x4af;
  lVar5 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar5 = F_LDIV(lVar5,CONCAT22(uVar9,uVar8));
  uVar8 = (undefined2)lVar5;
  uVar7 = 0;
  uVar9 = 0x63f;
  lVar5 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar5 = F_LDIV(lVar5,CONCAT22(uVar7,uVar9));
  fill_rect(0,0,(int)lVar5,uVar8,uVar10);
  return;
}


// ==== FUN_3000_bd9e @ 3000:bd9e (size 21) callers: FUN_3000_bdb5

int __cdecl16far FUN_3000_bd9e(int param_1,int param_2)

{
  if (param_2 < param_1) {
    return param_2;
  }
  return param_1;
}


// ==== FUN_3000_bdb5 @ 3000:bdb5 (size 2865) callers: FUN_3000_d51c

/* WARNING: Removing unreachable block (ram,0x0003c64a) */
/* WARNING: Removing unreachable block (ram,0x0003c621) */
/* WARNING: Removing unreachable block (ram,0x0003c5f8) */
/* WARNING: Removing unreachable block (ram,0x0003c5ce) */
/* WARNING: Removing unreachable block (ram,0x0003c5aa) */
/* WARNING: Removing unreachable block (ram,0x0003c598) */
/* WARNING: Removing unreachable block (ram,0x0003c5bc) */
/* WARNING: Removing unreachable block (ram,0x0003c5e6) */
/* WARNING: Removing unreachable block (ram,0x0003c60a) */
/* WARNING: Removing unreachable block (ram,0x0003c633) */
/* WARNING: Removing unreachable block (ram,0x0003c661) */

void __cdecl16far FUN_3000_bdb5(void)

{
  long lVar1;
  uint uVar2;
  short sVar3;
  int iVar4;
  int iVar5;
  char *pcVar6;
  int iVar7;
  short sVar8;
  long lVar9;
  long lVar10;
  long lVar11;
  long lVar12;
  long lVar13;
  long lVar14;
  long lVar15;
  long lVar16;
  undefined2 uVar17;
  undefined2 uVar18;
  undefined2 uVar19;
  undefined2 uVar20;
  
  lVar10 = 0;
  lVar11 = 0;
  lVar12 = 0;
  lVar13 = 0;
  lVar14 = 0;
  lVar16 = 0;
  lVar9 = time((void *)0x0);
  srand((ushort)lVar9);
  uVar2 = (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 5);
  uVar19 = 0;
  uVar18 = 0x8000;
  sVar3 = rand();
  lVar9 = N_LXMUL(3,(long)sVar3);
  lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
  if ((int)lVar9 != 0) {
    return;
  }
  uVar19 = 0;
  uVar18 = 0x8000;
  sVar3 = rand();
  lVar9 = N_LXMUL(3,(long)sVar3);
  lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
  if ((int)lVar9 == 0) {
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar10 = N_LXMUL((long)(int)(uVar2 + 0x3d),(long)sVar3);
    lVar10 = F_LDIV(lVar10,CONCAT22(uVar19,uVar18));
    iVar4 = (int)lVar10;
    iVar5 = iVar4 >> 0xf;
    iVar7 = DAT_6000_c8a2 + 1;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar10 = N_LXMUL((long)iVar7,(long)sVar3);
    lVar10 = F_LDIV(lVar10,CONCAT22(uVar19,uVar18));
    lVar10 = N_LXMUL((long)(int)lVar10,CONCAT22(iVar5,iVar4));
    iVar4 = FUN_3000_bd9e(DAT_6000_c8a2,0x8c);
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar9 = N_LXMUL((long)(iVar4 * 200 + 500),(long)sVar3);
    lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
    lVar10 = lVar10 + (int)lVar9;
  }
  uVar19 = 0;
  uVar18 = 0x8000;
  sVar3 = rand();
  lVar9 = N_LXMUL(3,(long)sVar3);
  lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
  if ((int)lVar9 == 0) {
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar11 = N_LXMUL((long)(int)(uVar2 + 0x33),(long)sVar3);
    lVar11 = F_LDIV(lVar11,CONCAT22(uVar19,uVar18));
    iVar4 = (int)lVar11;
    iVar5 = iVar4 >> 0xf;
    iVar7 = DAT_6000_c8a2 + 1;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar11 = N_LXMUL((long)iVar7,(long)sVar3);
    lVar11 = F_LDIV(lVar11,CONCAT22(uVar19,uVar18));
    lVar11 = N_LXMUL((long)(int)lVar11,CONCAT22(iVar5,iVar4));
    iVar4 = FUN_3000_bd9e(DAT_6000_c8a2,0x8c);
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar9 = N_LXMUL((long)(iVar4 * 200 + 0x32),(long)sVar3);
    lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
    lVar11 = lVar11 + (int)lVar9;
  }
  uVar19 = 0;
  uVar18 = 0x8000;
  sVar3 = rand();
  lVar9 = N_LXLSH((long)sVar3,'\x02');
  lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
  if ((int)lVar9 == 0) {
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar12 = N_LXMUL((long)(int)(uVar2 + 0x1f),(long)sVar3);
    lVar12 = F_LDIV(lVar12,CONCAT22(uVar19,uVar18));
    iVar4 = (int)lVar12;
    iVar5 = iVar4 >> 0xf;
    iVar7 = DAT_6000_c8a2 + 1;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar12 = N_LXMUL((long)iVar7,(long)sVar3);
    lVar12 = F_LDIV(lVar12,CONCAT22(uVar19,uVar18));
    lVar12 = N_LXMUL((long)(int)lVar12,CONCAT22(iVar5,iVar4));
    iVar4 = DAT_6000_c8a2 * 10;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar9 = N_LXMUL((long)(iVar4 + 10),(long)sVar3);
    lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
    lVar12 = lVar12 + (int)lVar9;
  }
  uVar19 = 0;
  uVar18 = 0x8000;
  sVar3 = rand();
  lVar9 = N_LXLSH((long)sVar3,'\x02');
  lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
  if ((int)lVar9 == 0) {
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar13 = N_LXMUL((long)(int)(uVar2 + 0xb),(long)sVar3);
    lVar13 = F_LDIV(lVar13,CONCAT22(uVar19,uVar18));
    iVar4 = (int)lVar13;
    iVar5 = iVar4 >> 0xf;
    iVar7 = DAT_6000_c8a2 + 1;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar13 = N_LXMUL((long)iVar7,(long)sVar3);
    lVar13 = F_LDIV(lVar13,CONCAT22(uVar19,uVar18));
    lVar13 = N_LXMUL((long)(int)lVar13,CONCAT22(iVar5,iVar4));
    iVar4 = DAT_6000_c8a2 * 5;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar9 = N_LXMUL((long)(iVar4 + 3),(long)sVar3);
    lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
    lVar13 = lVar13 + (int)lVar9;
  }
  uVar19 = 0;
  uVar18 = 0x8000;
  sVar3 = rand();
  lVar9 = N_LXMUL(5,(long)sVar3);
  lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
  if ((int)lVar9 == 0) {
    iVar4 = DAT_6000_c8a2 * 2;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar14 = N_LXMUL((long)(iVar4 + 6),(long)sVar3);
    lVar14 = F_LDIV(lVar14,CONCAT22(uVar19,uVar18));
    iVar4 = (int)lVar14;
    iVar5 = iVar4 >> 0xf;
    iVar7 = DAT_6000_c8a2 + 1;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar14 = N_LXMUL((long)iVar7,(long)sVar3);
    lVar14 = F_LDIV(lVar14,CONCAT22(uVar19,uVar18));
    lVar14 = N_LXMUL((long)(int)lVar14,CONCAT22(iVar5,iVar4));
  }
  uVar19 = 0;
  uVar18 = 0x8000;
  sVar3 = rand();
  lVar9 = N_LXMUL(5,(long)sVar3);
  lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
  if ((int)lVar9 == 0) {
    iVar4 = DAT_6000_c8a2 / 2;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar16 = N_LXMUL((long)(iVar4 + 1),(long)sVar3);
    lVar16 = F_LDIV(lVar16,CONCAT22(uVar19,uVar18));
    iVar4 = (int)lVar16;
    iVar5 = iVar4 >> 0xf;
    iVar7 = DAT_6000_c8a2 + 1;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar16 = N_LXMUL((long)iVar7,(long)sVar3);
    lVar16 = F_LDIV(lVar16,CONCAT22(uVar19,uVar18));
    lVar16 = N_LXMUL((long)(int)lVar16,CONCAT22(iVar5,iVar4));
    iVar4 = DAT_6000_c8a2 + 1;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar9 = N_LXMUL((long)iVar4,(long)sVar3);
    lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
    lVar9 = N_LXMUL((long)(int)lVar9,lVar16);
    iVar4 = DAT_6000_c8a2 + 10;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar16 = N_LXMUL((long)iVar4,(long)sVar3);
    lVar16 = F_LDIV(lVar16,CONCAT22(uVar19,uVar18));
    lVar16 = N_LXMUL(0x14,(long)(int)lVar16);
    lVar16 = lVar16 + lVar9;
  }
  uVar19 = 0;
  uVar18 = 0x8000;
  sVar3 = rand();
  lVar9 = N_LXMUL(0x4e2,(long)sVar3);
  lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
  iVar4 = DAT_6000_c8a2;
  iVar5 = (int)(uint)lVar9 >> 0xf;
  iVar7 = (int)(DAT_6000_c8a2 - 10U) >> 0xf;
  if ((iVar5 <= iVar7) && ((iVar5 < iVar7 || ((uint)lVar9 < DAT_6000_c8a2 - 10U)))) {
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar9 = N_LXMUL((long)iVar4,(long)sVar3);
    lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
    iVar4 = (int)lVar9;
    iVar7 = iVar4 >> 0xf;
    iVar5 = DAT_6000_c8a2 / 4;
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar9 = N_LXMUL((long)(iVar5 + 10),(long)sVar3);
    lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
    lVar9 = N_LXMUL((long)(int)lVar9,CONCAT22(iVar7,iVar4));
    lVar9 = N_LXMUL(100,lVar9);
    uVar19 = 0;
    uVar18 = 0x8000;
    sVar3 = rand();
    lVar15 = N_LXMUL(10000,(long)sVar3);
    lVar15 = F_LDIV(lVar15,CONCAT22(uVar19,uVar18));
    lVar16 = lVar16 + lVar9 + (int)lVar15;
  }
  if (lVar14 + lVar13 + lVar12 + lVar10 + lVar11 == 0) {
    return;
  }
  uVar20 = 0;
  uVar19 = 0;
  uVar18 = 0x4af;
  lVar9 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar9 = F_LDIV(lVar9,CONCAT22(uVar19,uVar18));
  uVar18 = (undefined2)lVar9;
  uVar17 = 0;
  uVar19 = 0x63f;
  lVar9 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar9 = F_LDIV(lVar9,CONCAT22(uVar17,uVar19));
  fill_rect(0,0,(int)lVar9,uVar18,uVar20);
  strcpy(DAT_6000_cd80,(char *)s_YOU_FIND_6000_5ef7);
  strlen(DAT_6000_cd80);
  lVar15 = F_LDIV(lVar10,200);
  lVar9 = F_LDIV(lVar11,0xc);
  lVar9 = lVar9 + lVar15;
  lVar15 = F_LDIV(lVar12,4);
  lVar15 = lVar15 + lVar9;
  lVar9 = F_LDIV(lVar13,2);
  lVar9 = lVar16 + lVar9 + lVar15;
  lVar15 = N_LXMUL(5,lVar14);
  ltoa(lVar15 + lVar9);
  strcat(DAT_6000_cd80,(char *)s_STONES__THE_6000_5f01);
  strcpy(DAT_6000_cd82,(char *)s_PILE_WEIGHS_ABOUT_6000_5f0e);
  uVar18 = 10;
  sVar3 = strlen(DAT_6000_cd82);
  pcVar6 = DAT_6000_cd82 + sVar3;
  lVar9 = F_LDIV(lVar14 + lVar13 + lVar12 + lVar10 + lVar11,0x10);
  ltoa(lVar9,pcVar6,uVar18);
  strcpy(DAT_6000_cd84,(char *)s_POUNDS__THEY_ARE_MOSTLY_6000_5f23);
  if ((((lVar11 < lVar10) && (lVar12 < lVar10)) && (lVar13 < lVar10)) && (lVar14 < lVar10)) {
    pcVar6 = (char *)s_COPPER_6000_5f3d;
  }
  else if (((lVar12 < lVar11) && (lVar13 < lVar11)) && (lVar14 < lVar11)) {
    pcVar6 = (char *)s_SILVER_6000_5f46;
  }
  else if ((lVar13 < lVar12) && (lVar14 < lVar12)) {
    pcVar6 = (char *)s_IVORY_6000_5f4f;
  }
  else if (lVar14 < lVar13) {
    pcVar6 = (char *)0x5f57;
  }
  else if (lVar16 < lVar14) {
    pcVar6 = (char *)s_PLATINUM_6000_5f5e;
  }
  else {
    pcVar6 = (char *)s_JEWEL_6000_5f69;
  }
  strcpy(DAT_6000_cd86,pcVar6);
  strcat(DAT_6000_cd86,(char *)s_JEWEL_STONES__6000_49ff + 7);
  if (DAT_6000_c131 * 3 < DAT_6000_c133) {
    strcpy(DAT_6000_cd88,(char *)s_IT_IS_TOO_HEAVY_FOR_YOU_6000_5f71);
    strcpy(DAT_6000_cd8a,(char *)s_YOU_TO_CARRY__6000_5f89);
    strcpy(DAT_6000_cd8c,(char *)&DAT_6000_45cd);
    strcpy(DAT_6000_cd8e,(char *)s_HIT_ANY_KEY____6000_4a75);
    FUN_2000_1d0b((undefined2 *)&DAT_6000_cd80,0xffff,0);
    return;
  }
  strcpy(DAT_6000_cd88,(char *)s_A__TAKE_ALL_L__LEAVE_ALL_6000_5f99);
  strcpy(DAT_6000_cd8a,(char *)s_J__JEWELS_ONLY_P__PL_AND_JWL_6000_5fb6);
  strcpy(DAT_6000_cd8c,(char *)0x5fd3);
  strcpy(DAT_6000_cd8e,(char *)s_NOTE___SORTING_TAKES_TIME_6000_5ff0);
  FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
  do {
    sVar8 = -1;
    sVar3 = kbhit();
    if (sVar3 == 0) {
      if (DAT_6000_d0da != 0) {
        iVar4 = FUN_4000_2d34(1);
        if (iVar4 == 0) {
          sVar8 = mouse_pick(0x4595);
          if (sVar8 == 0) {
            sVar8 = 0x41;
          }
          if (sVar8 == 1) {
            sVar8 = 0x4c;
          }
          if (sVar8 == 2) {
            sVar8 = 0x4a;
          }
          if (sVar8 == 3) {
            sVar8 = 0x50;
          }
          if (sVar8 == 4) {
            sVar8 = 0x47;
          }
          if (sVar8 == 5) {
            sVar8 = 0x49;
          }
        }
        else {
          sVar8 = 0x1b;
        }
      }
    }
    else {
      sVar3 = getch();
      sVar8 = toupper(sVar3);
    }
    iVar4 = FUN_1000_446b(0x600a,sVar8);
  } while ((iVar4 == 0) && (sVar8 != 0x1b));
  if (DAT_6000_d0da != 0) {
    FUN_4000_3435();
  }
  lVar1 = CONCAT22(DAT_6000_c558,DAT_6000_c556);
  lVar15 = CONCAT22(DAT_6000_c550,DAT_6000_c54e);
  lVar9 = CONCAT22(DAT_6000_c554,DAT_6000_c552);
  if ((sVar8 == 0x4c) || (sVar8 == 0x1b)) {
    uVar20 = 0;
    uVar19 = 0;
    uVar18 = 0x4af;
    lVar16 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar16 = F_LDIV(lVar16,CONCAT22(uVar19,uVar18));
    uVar18 = (undefined2)lVar16;
    uVar17 = 0;
    uVar19 = 0x63f;
    lVar16 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar16 = F_LDIV(lVar16,CONCAT22(uVar17,uVar19));
    fill_rect(0,0,(int)lVar16,uVar18,uVar20);
    return;
  }
  if (sVar8 == 0x41) {
    lVar15 = lVar10 + lVar15;
    lVar9 = lVar11 + lVar9;
  }
  else if (sVar8 != 0x49) goto LAB_3000_c874;
  lVar1 = lVar12 + lVar1;
LAB_3000_c874:
  DAT_6000_c558 = (undefined2)((ulong)lVar1 >> 0x10);
  DAT_6000_c556 = (undefined2)lVar1;
  DAT_6000_c554 = (undefined2)((ulong)lVar9 >> 0x10);
  DAT_6000_c552 = (undefined2)lVar9;
  DAT_6000_c550 = (undefined2)((ulong)lVar15 >> 0x10);
  DAT_6000_c54e = (undefined2)lVar15;
  iVar4 = FUN_1000_446b(0x6011,sVar8);
  lVar10 = CONCAT22(DAT_6000_c55c,DAT_6000_c55a);
  if (iVar4 != 0) {
    lVar10 = lVar13 + lVar10;
  }
  DAT_6000_c55c = (undefined2)((ulong)lVar10 >> 0x10);
  DAT_6000_c55a = (undefined2)lVar10;
  iVar4 = FUN_1000_446b(0x6015,sVar8);
  lVar10 = CONCAT22(DAT_6000_c560,DAT_6000_c55e);
  if (iVar4 != 0) {
    lVar10 = lVar14 + lVar10;
  }
  DAT_6000_c560 = (undefined2)((ulong)lVar10 >> 0x10);
  DAT_6000_c55e = (undefined2)lVar10;
  iVar4 = FUN_1000_446b(0x601a,sVar8);
  lVar14 = CONCAT22(DAT_6000_c564,DAT_6000_c562);
  if (iVar4 != 0) {
    lVar14 = lVar16 + lVar14;
  }
  DAT_6000_c564 = (undefined2)((ulong)lVar14 >> 0x10);
  DAT_6000_c562 = (undefined2)lVar14;
  FUN_2000_2d8e();
  financial_statement();
  wait_key();
  return;
}


// ==== FUN_3000_c8e6 @ 3000:c8e6 (size 145) callers: FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a

void __cdecl16far FUN_3000_c8e6(int param_1,int param_2)

{
  short sVar1;
  short radix;
  
  strcpy(DAT_6000_cd82,(char *)s_THE_SPELL_IS_A_LEVEL_6000_6020);
  radix = 10;
  sVar1 = strlen(DAT_6000_cd82);
  itoa(param_1 + 1,DAT_6000_cd82 + sVar1,radix);
  if (param_2 == 0) {
    strcpy(DAT_6000_cd84,(char *)s_PERMANENT_SPELL__6000_6038);
  }
  if (param_2 == 1) {
    strcpy(DAT_6000_cd84,(char *)s_PREPARATION_SPELL__6000_604b);
  }
  if (param_2 == 2) {
    strcpy(DAT_6000_cd84,(char *)s_WIZARD_SPELL__6000_6060);
  }
  if (param_2 == 3) {
    strcpy(DAT_6000_cd84,(char *)s_PRIESTLY_SPELL_6000_6070);
  }
  return;
}


// ==== FUN_3000_c977 @ 3000:c977 (size 513) callers: FUN_3000_d51c

void __cdecl16far FUN_3000_c977(void)

{
  int iVar1;
  short sVar2;
  int iVar3;
  int iVar4;
  long lVar5;
  long lVar6;
  
  if ((DAT_6000_c11c == '\0') || (DAT_6000_c11c == '\x02')) {
    return;
  }
  if (DAT_6000_c11c == '\x05') {
    iVar1 = random_n();
    if (0xaf < iVar1) {
      return;
    }
    iVar1 = random_n();
    if (0x8c < iVar1) {
      return;
    }
  }
  iVar1 = DAT_6000_c8a2 << 1;
  lVar6 = 0x8000;
  sVar2 = rand();
  lVar5 = N_LXMUL((long)(iVar1 / 3),(long)sVar2);
  lVar5 = F_LDIV(lVar5,lVar6);
  iVar1 = (int)lVar5;
  if (9 < iVar1) {
    lVar6 = 0x8000;
    sVar2 = rand();
    lVar5 = N_LXMUL(10,(long)sVar2);
    lVar5 = F_LDIV(lVar5,lVar6);
    iVar1 = (int)lVar5;
  }
  lVar6 = 0x8000;
  sVar2 = rand();
  lVar5 = N_LXLSH((long)sVar2,'\x02');
  lVar5 = F_LDIV(lVar5,lVar6);
  iVar3 = (int)lVar5;
  if ((iVar3 == 2) && ((DAT_6000_c11c == '\x01' || (DAT_6000_c11c == '\x04')))) {
    return;
  }
  if ((iVar3 == 3) && ((DAT_6000_c11c == '\x03' || (DAT_6000_c11c == '\x06')))) {
    return;
  }
  lVar6 = 0x8000;
  sVar2 = rand();
  lVar5 = N_LXMUL(3,(long)sVar2);
  lVar5 = F_LDIV(lVar5,lVar6);
  if ('\0' < *(char *)(iVar3 * 0x2d + iVar1 * 3 + (int)lVar5 + -0x3d97)) {
    return;
  }
  FUN_3000_b99e();
  strcpy(DAT_6000_cd80,(char *)s_YOU_HAVE_FOUND_A_SPELLBOOK__6000_6081);
  FUN_3000_c8e6(iVar1);
  strcpy(DAT_6000_cd86,(char *)s_HIT_ANY_KEY_FOR_A_DESCRIPTION_6000_609d);
  strcpy(DAT_6000_cd88,(char *)s_OF_THE_SPELL__6000_60bb);
  for (iVar4 = 5; iVar4 < 8; iVar4 = iVar4 + 1) {
    strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)&DAT_6000_45cd);
  }
  FUN_2000_22d7();
  wait_key();
  flush_keys();
  *(undefined1 *)(iVar3 * 0x2d + iVar1 * 3 + (int)lVar5 + -0x3d97) = 1;
  FUN_3000_b7fd();
  FUN_2000_1d0b();
  return;
}


// ==== FUN_3000_cb7a @ 3000:cb7a (size 442) callers: FUN_3000_d51c

void __cdecl16far FUN_3000_cb7a(void)

{
  char *pcVar1;
  int iVar2;
  short sVar3;
  int iVar4;
  int iVar5;
  long lVar6;
  long lVar7;
  
  if ((DAT_6000_c11c == '\0') || (DAT_6000_c11c == '\x02')) {
    return;
  }
  iVar2 = random_n();
  if (0xf < iVar2) {
    return;
  }
  iVar2 = DAT_6000_c8a2 / 3;
  lVar7 = 0x8000;
  sVar3 = rand();
  lVar6 = N_LXMUL((long)iVar2,(long)sVar3);
  lVar6 = F_LDIV(lVar6,lVar7);
  iVar2 = (int)lVar6;
  if (9 < iVar2) {
    lVar7 = 0x8000;
    sVar3 = rand();
    lVar6 = N_LXMUL(10,(long)sVar3);
    lVar6 = F_LDIV(lVar6,lVar7);
    iVar2 = (int)lVar6;
  }
  lVar7 = 0x8000;
  sVar3 = rand();
  lVar6 = N_LXLSH((long)sVar3,'\x02');
  lVar6 = F_LDIV(lVar6,lVar7);
  iVar4 = (int)lVar6;
  if ((iVar4 == 2) && ((DAT_6000_c11c == '\x01' || (DAT_6000_c11c == '\x04')))) {
    return;
  }
  if ((iVar4 == 3) && ((DAT_6000_c11c == '\x03' || (DAT_6000_c11c == '\x06')))) {
    return;
  }
  FUN_3000_b99e();
  lVar7 = 0x8000;
  sVar3 = rand();
  lVar6 = N_LXMUL(3,(long)sVar3);
  lVar6 = F_LDIV(lVar6,lVar7);
  strcpy(DAT_6000_cd80,(char *)s_YOU_HAVE_FOUND_A_SCROLL__6000_60cb);
  FUN_3000_c8e6(iVar2);
  strcpy(DAT_6000_cd86,(char *)s_HIT_ANY_KEY_FOR_A_DESCRIPTION_6000_609d);
  strcpy(DAT_6000_cd88,(char *)s_OF_THE_SCROLL__6000_60e4);
  for (iVar5 = 5; iVar5 < 8; iVar5 = iVar5 + 1) {
    strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar5],(char *)&DAT_6000_45cd);
  }
  FUN_2000_22d7();
  wait_key();
  flush_keys();
  pcVar1 = (char *)(iVar4 * 0x2d + iVar2 * 3 + (int)lVar6 + -0x3ce3);
  *pcVar1 = *pcVar1 + '\x01';
  FUN_3000_b7fd();
  FUN_2000_1d0b();
  return;
}


// ==== FUN_3000_cd34 @ 3000:cd34 (size 518) callers: FUN_3000_d51c

void __cdecl16far FUN_3000_cd34(void)

{
  int iVar1;
  short sVar2;
  int iVar3;
  int v;
  int iVar4;
  long lVar5;
  long lVar6;
  long b;
  short radix;
  char local_8;
  
  if ((DAT_6000_c11c != '\0') && (DAT_6000_c11c != '\x02')) {
    iVar1 = random_n();
    if (0xf < iVar1) {
      return;
    }
    FUN_3000_b99e();
    iVar1 = DAT_6000_c8a2 / 0x3c;
    lVar6 = 0x8000;
    sVar2 = rand();
    lVar5 = N_LXMUL((long)iVar1,(long)sVar2);
    lVar5 = F_LDIV(lVar5,lVar6);
    iVar1 = (int)lVar5;
    if (9 < iVar1) {
      lVar6 = 0x8000;
      sVar2 = rand();
      lVar5 = N_LXMUL(10,(long)sVar2);
      lVar5 = F_LDIV(lVar5,lVar6);
      iVar1 = (int)lVar5;
    }
    lVar6 = 0x8000;
    sVar2 = rand();
    lVar5 = N_LXMUL(3,(long)sVar2);
    lVar5 = F_LDIV(lVar5,lVar6);
    iVar3 = (int)lVar5 + 1;
    lVar6 = 0x8000;
    sVar2 = rand();
    lVar5 = N_LXMUL(3,(long)sVar2);
    lVar5 = F_LDIV(lVar5,lVar6);
    strcpy(DAT_6000_cd80,(char *)s_YOU_FOUND_A_WAND_WITH_6000_60f5);
    b = 0x8000;
    sVar2 = rand();
    lVar6 = N_LXMUL(5,(long)sVar2);
    lVar6 = F_LDIV(lVar6,b);
    v = (int)lVar6 + 2;
    radix = 10;
    sVar2 = strlen(DAT_6000_cd80);
    itoa(v,DAT_6000_cd80 + sVar2,radix);
    strcat(DAT_6000_cd80,(char *)s_CHARGES__6000_610c);
    FUN_3000_c8e6(iVar1);
    strcpy(DAT_6000_cd86,(char *)s_HIT_ANY_KEY_FOR_A_DESCRIPTION_6000_609d);
    strcpy(DAT_6000_cd88,(char *)s_OF_THE_WAND__6000_6116);
    for (iVar4 = 5; iVar4 < 8; iVar4 = iVar4 + 1) {
      strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)&DAT_6000_45cd);
    }
    FUN_2000_22d7();
    wait_key();
    flush_keys();
    local_8 = (char)v;
    *(char *)(iVar3 * 0x2d + iVar1 * 3 + (int)lVar5 + -0x3c2f) =
         *(char *)(iVar3 * 0x2d + iVar1 * 3 + (int)lVar5 + -0x3c2f) + local_8;
    FUN_3000_b7fd();
    FUN_2000_1d0b();
    return;
  }
  return;
}


// ==== FUN_3000_cf3a @ 3000:cf3a (size 383) callers: FUN_3000_d51c

void __cdecl16far FUN_3000_cf3a(void)

{
  char *pcVar1;
  int iVar2;
  short sVar3;
  int iVar4;
  long lVar5;
  long lVar6;
  long b;
  
  if (DAT_6000_c11c == '\x02') {
    return;
  }
  iVar2 = random_n();
  if (0xf < iVar2) {
    return;
  }
  FUN_3000_b99e();
  iVar2 = DAT_6000_c8a2 / 8;
  lVar6 = 0x8000;
  sVar3 = rand();
  lVar5 = N_LXMUL((long)iVar2,(long)sVar3);
  lVar5 = F_LDIV(lVar5,lVar6);
  iVar2 = (int)lVar5;
  if (9 < iVar2) {
    lVar6 = 0x8000;
    sVar3 = rand();
    lVar5 = N_LXMUL(10,(long)sVar3);
    lVar5 = F_LDIV(lVar5,lVar6);
    iVar2 = (int)lVar5;
  }
  lVar6 = 0x8000;
  sVar3 = rand();
  lVar5 = N_LXLSH((long)sVar3,'\x02');
  lVar5 = F_LDIV(lVar5,lVar6);
  b = 0x8000;
  sVar3 = rand();
  lVar6 = N_LXMUL(3,(long)sVar3);
  lVar6 = F_LDIV(lVar6,b);
  strcpy(DAT_6000_cd80,(char *)s_YOU_FIND_A_SPELL_PAPER__6000_6125);
  FUN_3000_c8e6(iVar2);
  strcpy(DAT_6000_cd86,(char *)s_HIT_ANY_KEY_FOR_A_DESCRIPTION_6000_609d);
  strcpy(DAT_6000_cd88,(char *)s_OF_THE_SPELL_ON_THE_PAPER__6000_613d);
  for (iVar4 = 5; iVar4 < 8; iVar4 = iVar4 + 1) {
    strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)&DAT_6000_45cd);
  }
  FUN_2000_22d7();
  wait_key();
  flush_keys();
  pcVar1 = (char *)((int)lVar5 * 0x2d + iVar2 * 3 + (int)lVar6 + -0x3b7b);
  *pcVar1 = *pcVar1 + '\x01';
  FUN_3000_b7fd();
  FUN_2000_1d0b();
  return;
}


// ==== FUN_3000_d0b9 @ 3000:d0b9 (size 686) callers: FUN_3000_d51c

void __cdecl16far FUN_3000_d0b9(void)

{
  short sVar1;
  long lVar2;
  long b;
  
  if (DAT_6000_c11c != '\x02') {
    b = 0x8000;
    sVar1 = rand();
    lVar2 = N_LXMUL(0xc,(long)sVar1);
    lVar2 = F_LDIV(lVar2,b);
    switch((int)lVar2) {
    case 0:
      DAT_6000_c8ba = DAT_6000_c8ba + '\x01';
      FUN_2000_22ff((char *)s_A_HOLY_HAND_GRENADE__6000_615a,
                    (char *)s_HOLY_HAND_GRENADES_ARE_THE_6000_616f,
                    (char *)s_THE_MOST_POWERFUL_ATTACK_6000_618a,
                    (char *)s_DEVICE_IN_MORAFF_S_WORLD__6000_61a5,
                    (char *)s_USE_IT_BY_HITTING__I__THEN_6000_61c1,
                    (char *)s_SELECT__OTHER___IT_WILL_6000_61dc,
                    (char *)s_INSTANTLY_KILL_THE_MONSTER__6000_61f6,
                    (char *)s_PERIOD__HIT_ANY_KEY____6000_6214);
      break;
    case 1:
      DAT_6000_c902 = DAT_6000_c902 + 1;
      FUN_2000_22ff((char *)s_A_STONE_OF_TELEPORTATION__6000_6230,
                    (char *)s_THIS_STONE_WILL_PROBABLY_6000_624a,
                    (char *)s_SAVE_YOUR_LIFE__USE_IT_6000_6265,
                    (char *)s_WHEN_YOU_ARE_ABSOLUTELY_6000_627e,
                    (char *)s_DESPERATE_AND_IT_WILL_6000_6298,
                    (char *)s_RAISE_YOU_TO_LEVEL_ZERO__6000_62b0,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_HIT_ANY_KEY____6000_4a75);
      break;
    case 2:
      DAT_6000_c8bb = DAT_6000_c8bb + '\x01';
      FUN_2000_22ff((char *)s_A_STONE_OF_SEEING__6000_62cb,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_USE_THIS_ITEM_TO_MAP_AN_6000_62de,
                    (char *)s_ENTIRE_LEVEL_OF_A_DUNGEON_6000_62f6,
                    (char *)s_THIS_ITEM_IS_ONLY_GOOD_FOR_6000_6312,(char *)s_ONE_USE__6000_632d,
                    (undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75);
      break;
    case 3:
      if (DAT_6000_c8f0 < 1) {
        DAT_6000_c8f0 = DAT_6000_c8f0 + 1;
        FUN_2000_22ff((char *)s_THE_FAMOUS_FLOOR_SLOSHER__6000_638e,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_EACH_TIME_YOU_USE_THIS_ITEM__6000_63a8,
                      (char *)s_THE_FLOOR_TURNS_TO_MUSH__6000_63c5,
                      (char *)s_AND_YOU_SLIP_DOWN_AT_LEAST_6000_63e0,
                      (char *)s_ONE_LEVEL__THIS_ITEM_MAY_6000_63fd,
                      (char *)s_USED_LIMITLESSLY__6000_6418,(char *)s_HIT_ANY_KEY____6000_4a75);
      }
      else {
        FUN_2000_22ff((char *)s_OH_WELL__YOU_ALREADY_HAVE_6000_6338,
                      (char *)s_A_FLOOR_SLOSHER__AND_TWO_6000_6352,
                      (char *)s_ARE_NO_BETTER_THAN_ONE__6000_636d,(undefined4 *)&DAT_6000_45cd,
                      0x6387,(undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75,
                      (undefined4 *)&DAT_6000_45cd);
      }
      break;
    case 4:
      DAT_6000_c900 = DAT_6000_c900 + 1;
      FUN_2000_22ff((char *)s_A_POTION_OF_HEALING__6000_642c,
                    (char *)s_THIS_POTION_WILL_HEAL_ALL_6000_6441,
                    (char *)s_OF_YOUR_WOUNDS_INSTANTLY__6000_645d,
                    (char *)s_YOU_MAY_DRINK_THIS_POTION_SO_6000_6479,
                    (char *)s_QUICKLY_THAT_MONSTERS_WILL_6000_6496,
                    (char *)s_NOT_GET_ANY_EXTRA_STRIKES__6000_64b3,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_HIT_ANY_KEY____6000_4a75);
      break;
    case 5:
      DAT_6000_c8b8 = DAT_6000_c8b8 + '\x01';
      FUN_2000_22ff((char *)s_A_RING_OF_REGENERATION__6000_64d0,
                    (char *)s_AS_TIME_PASSES_YOU_WILL_6000_64e8,
                    (char *)s_REGENERATE_ONE_HEALTH_6000_6502,
                    (char *)s_POINT_PER_RING_OF_REGEN__6000_651a,
                    (char *)s_THIS_IS_ONE_OF_THE_MOST_6000_6535,
                    (char *)s_SOUGHT_AFTER_MAGIC_ITEMS_6000_654d,
                    (char *)s_IN_MORAFF_S_WORLD__6000_6568,(char *)s_HIT_ANY_KEY____6000_4a75);
      break;
    case 6:
      DAT_6000_c904 = DAT_6000_c904 + 1;
      FUN_2000_22ff((char *)s_A_BOOK_OF_STRENGTH__6000_657d,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_PRESS_ANY_KEY_TO_READ_6000_6591,
                    (char *)s_THE_BOOK_AND_INCREASE_6000_65a7,
                    (char *)s_YOUR_STRENGTH_BY_ONE_6000_65bf,(char *)s_POINT__6000_65d6,
                    (undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75);
      break;
    case 7:
      DAT_6000_c906 = DAT_6000_c906 + 1;
      FUN_2000_22ff((char *)s_A_BOOK_OF_INTELLIGENCE__6000_65df,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_PRESS_ANY_KEY_TO_READ_6000_6591,
                    (char *)s_THE_BOOK_AND_INCREASE_6000_65a7,
                    (char *)s_YOUR_INTELLIGENCE_BY_ONE_6000_65f7,(char *)s_POINT__6000_65d6,
                    (undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75);
      break;
    case 8:
      DAT_6000_c908 = DAT_6000_c908 + 1;
      FUN_2000_22ff((char *)s_A_BOOK_OF_WISDOM__6000_6612,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_PRESS_ANY_KEY_TO_READ_6000_6591,
                    (char *)s_THE_BOOK_AND_INCREASE_6000_65a7,(char *)s_YOUR_WISDOM_BY_ONE_6000_6624
                    ,(char *)s_POINT__6000_65d6,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_HIT_ANY_KEY____6000_4a75);
      break;
    case 9:
      DAT_6000_c90a = DAT_6000_c90a + 1;
      FUN_2000_22ff((char *)s_A_BOOK_OF_CONSTITUTION__6000_6639,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_PRESS_ANY_KEY_TO_READ_6000_6591,
                    (char *)s_THE_BOOK_AND_INCREASE_6000_65a7,
                    (char *)s_YOUR_CONSTITUTION_BY_ONE_6000_6651,(char *)s_POINT__6000_65d6,
                    (undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75);
      break;
    case 10:
      DAT_6000_c90c = DAT_6000_c90c + 1;
      FUN_2000_22ff((char *)s_A_BOOK_OF_DEXTERITY__6000_666c,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_PRESS_ANY_KEY_TO_READ_6000_6591,
                    (char *)s_THE_BOOK_AND_INCREASE_6000_65a7,
                    (char *)s_YOUR_DEXTERITY_BY_ONE_6000_6681,(char *)s_POINT__6000_65d6,
                    (undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75);
      break;
    case 0xb:
      DAT_6000_c90e = DAT_6000_c90e + 1;
      FUN_2000_22ff((char *)s_A_BOOK_OF_LUCK__6000_6699,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_PRESS_ANY_KEY_TO_READ_6000_6591,
                    (char *)s_THE_BOOK_AND_INCREASE_6000_65a7,
                    (char *)s_YOUR_LUCK_BY_ONE_POINT__6000_66a9,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd);
    }
    return;
  }
  return;
}


// ==== FUN_3000_d37f @ 3000:d37f (size 188) callers: FUN_3000_d51c

void __cdecl16far FUN_3000_d37f(void)

{
  short sVar1;
  long lVar2;
  long lVar3;
  
  lVar3 = 0x8000;
  sVar1 = rand();
  lVar2 = N_LXMUL(5,(long)sVar1);
  lVar2 = F_LDIV(lVar2,lVar3);
  if (((int)lVar2 == 0) && (DAT_6000_c123 != DAT_6000_c125)) {
    lVar3 = 0x8000;
    sVar1 = rand();
    lVar2 = N_LXMUL(0xb,(long)sVar1);
    lVar2 = F_LDIV(lVar2,lVar3);
    DAT_6000_c123 = DAT_6000_c123 + (int)lVar2 + 3;
    if (6 < DAT_6000_c8a2) {
      lVar3 = 0x8000;
      sVar1 = rand();
      lVar2 = N_LXLSH((long)sVar1,'\x02');
      lVar2 = F_LDIV(lVar2,lVar3);
      DAT_6000_c123 = DAT_6000_c123 + (int)lVar2;
    }
    FUN_2000_22ff((char *)s_YOU_FOUND_A_CUP_OF_HEALTH__6000_66c3,(undefined4 *)&DAT_6000_45cd,
                  (char *)s_PRESS_ANY_KEY_TO_DRINK_6000_66de,
                  (char *)s_THE_WONDERFUL_LIQUID_6000_66f5,(char *)s_AND_GAIN_A_FEW_HEALTH_6000_670c
                  ,(char *)s_POINTS__6000_530b,(undefined4 *)&DAT_6000_45cd,
                  (char *)s_HIT_ANY_KEY____6000_4a75);
    if (DAT_6000_c125 < DAT_6000_c123) {
      DAT_6000_c123 = DAT_6000_c125;
    }
    return;
  }
  return;
}


// ==== FUN_3000_d43b @ 3000:d43b (size 158) callers: FUN_3000_d51c

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_d43b(void)

{
  short sVar1;
  long lVar2;
  long b;
  
  b = 0x8000;
  sVar1 = rand();
  lVar2 = N_LXMUL(7,(long)sVar1);
  lVar2 = F_LDIV(lVar2,b);
  if ((int)lVar2 == 0) {
    if ((_DAT_6000_c127 != _DAT_6000_c12b) && (DAT_6000_c11c != '\0')) {
      if (_DAT_6000_c127 != _DAT_6000_c12b) {
        _DAT_6000_c127 = _DAT_6000_c127 + 1.0;
        FUN_2000_22ff((char *)s_YOU_FOUND_A_SHIMMERING_BALL_6000_6724,
                      (char *)s_OF_THOUGHT__6000_6740,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_PRESS_ANY_KEY_TO_ABSORD_6000_674e,
                      (char *)s_THE_ENERGY_AND_GAIN_A_6000_6766,(char *)s_SPELL_POINT__6000_677e,
                      (undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75);
        return;
      }
    }
  }
  return;
}


// ==== FUN_3000_d4d9 @ 3000:d4d9 (size 67) callers: FUN_3000_d51c

void __cdecl16far FUN_3000_d4d9(void)

{
  if (DAT_6000_119f == 0) {
    return;
  }
  sound(0x2a8);
  FUN_1000_22a2(0x8c);
  sound(0x2c6);
  FUN_1000_22a2(0x6e);
  FUN_1000_3332();
  return;
}


// ==== FUN_3000_d51c @ 3000:d51c (size 3305) callers: movecontrol

void __cdecl16far FUN_3000_d51c(void)

{
  uint uVar1;
  short sVar2;
  char *pcVar3;
  int iVar4;
  undefined2 uVar5;
  longdouble in_ST0;
  long lVar6;
  undefined2 uVar7;
  short radix;
  undefined2 uVar8;
  undefined2 uVar9;
  
  FUN_3000_d4d9();
  if (*(char *)((uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 4) * 0x23 + 0x247) !=
      '\x06') {
    uVar8 = 0;
    uVar9 = 0;
    uVar5 = 0x4af;
    lVar6 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
    uVar5 = (undefined2)lVar6;
    uVar7 = 0;
    uVar9 = 0x63f;
    lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar9));
    fill_rect(0,0,(int)lVar6,uVar5,uVar8);
    print_text(0,0,0,(char *)s_YOU_KILLED_IT__6000_678d,8);
    if (DAT_6000_45c9 == 0) {
      FUN_1000_22a2(0x41a);
    }
    uVar9 = 0;
    uVar5 = 0x4af;
    lVar6 = N_LXMUL(0x78,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
    uVar5 = (undefined2)lVar6;
    uVar7 = 0;
    uVar9 = 0x63f;
    lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar9));
    uVar9 = (undefined2)lVar6;
    uVar8 = 0;
    uVar7 = 0x4af;
    lVar6 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar7));
    fill_rect(0,(int)lVar6,uVar9,uVar5);
  }
  FUN_3000_b8d4(DAT_6000_4593);
  DAT_6000_c94a = (double)(in_ST0 + (longdouble)DAT_6000_c94a);
  uVar1 = (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 4);
  if ('\0' < *(char *)(uVar1 * 0x23 + 0x244)) {
    uVar9 = 0;
    uVar5 = 0x8000;
    sVar2 = rand();
    lVar6 = N_LXMUL(0x177,(long)sVar2);
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
    if ((int)lVar6 < DAT_6000_c8a2 + 0xaf) {
      uVar9 = 0;
      uVar5 = 0x8000;
      sVar2 = rand();
      lVar6 = N_LXMUL(6,(long)sVar2);
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
      ((undefined1 *)&DAT_6000_c24f)[(int)lVar6] =
           ((undefined1 *)&DAT_6000_c24f)[(int)lVar6] + '\x01';
      switch((int)lVar6) {
      case 0:
        FUN_2000_22ff((char *)s_YOU_FOUND_AN_ORANGE_PILL__6000_679c,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_USE_THE__USE_ITEM__MENU_TO_6000_67b6,
                      (char *)s_TAKE_THE_PILL__HIT__I____6000_67d1,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd);
        break;
      case 1:
        FUN_2000_22ff((char *)s_YOU_FOUND_A_GREEN_PILL__6000_67ec,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_USE_THE__USE_ITEM__MENU_TO_6000_67b6,
                      (char *)s_TAKE_THE_PILL__HIT__I____6000_67d1,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd);
        break;
      case 2:
        FUN_2000_22ff((char *)s_YOU_FOUND_A_BLUE_PILL__6000_6804,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_USE_THE__USE_ITEM__MENU_TO_6000_67b6,
                      (char *)s_TAKE_THE_PILL__HIT__I____6000_67d1,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd);
        break;
      case 3:
        FUN_2000_22ff((char *)s_YOU_FOUND_A_RED_PILL__6000_681b,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_USE_THE__USE_ITEM__MENU_TO_6000_67b6,
                      (char *)s_TAKE_THE_PILL__HIT__I____6000_67d1,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd);
        break;
      case 4:
        FUN_2000_22ff((char *)s_YOU_FOUND_A_WHITE_PILL__6000_6831,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_USE_THE__USE_ITEM__MENU_TO_6000_67b6,
                      (char *)s_TAKE_THE_PILL__HIT__I____6000_67d1,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd);
        break;
      case 5:
        FUN_2000_22ff((char *)s_YOU_FOUND_A_YELLOW_PILL__6000_6849,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_USE_THE__USE_ITEM__MENU_TO_6000_67b6,
                      (char *)s_TAKE_THE_PILL__HIT__I____6000_67d1,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd);
      }
    }
    if (((*(char *)(DAT_6000_c8a2 / 10 + -0x36f0) != '\x01') && (9 < DAT_6000_c8a2)) &&
       (DAT_6000_c8a2 < 0xb3)) {
      for (iVar4 = 0; iVar4 < 8; iVar4 = iVar4 + 1) {
        strcpy((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)&DAT_6000_45cd);
      }
      strcpy(DAT_6000_cd80,(char *)s_YOU_HAVE_FOUND_A_KEY__IT_6000_6862);
      strcat(DAT_6000_cd82,(char *)s_IS_LABELED_NUMBER_6000_687d);
      radix = 10;
      sVar2 = strlen(DAT_6000_cd82);
      itoa((DAT_6000_c8a2 / 10) * 10,DAT_6000_cd82 + sVar2,radix);
      strcat(DAT_6000_cd82,(char *)s_I_CAN_T_FIND_THE_FILE_ROLL_TXT__T_6000_464b + 0x3b);
      strcpy(DAT_6000_cd86,(char *)s_THIS_KEY_WILL_ALLOW_YOU_6000_6890);
      strcpy(DAT_6000_cd88,(char *)s_TO_USE_TRAP_DOORS_LABELED_6000_68aa);
      strcpy(DAT_6000_cd8a,(char *)s_WITH_THIS_NUMBER__6000_68c4);
      strcpy(DAT_6000_cd8e,(char *)s_PERIOD__HIT_ANY_KEY____6000_6214 + 7);
      FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
      wait_key();
      flush_keys();
      *(undefined1 *)(DAT_6000_c8a2 / 10 + -0x36f0) = 1;
    }
  }
  uVar5 = (undefined2)((ulong)DAT_6000_cbde >> 0x10);
  *(undefined1 *)
   ((int)DAT_6000_cbe2 + (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 1) * 0x50 +
   (uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6)) = 0xff;
  *(undefined1 *)((int)DAT_6000_cbde + DAT_6000_4593 * 6) = 100;
  *(undefined1 *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 1) = 100;
  *(undefined1 *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 2) = 0;
  *(undefined1 *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 3) = 0;
  *(undefined1 *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 4) = 0;
  *(undefined1 *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 5) = 0;
  DAT_6000_cd18 = 1;
  flush_keys();
  FUN_3000_ba27();
  FUN_3000_bbe1();
  FUN_3000_bdb5();
  FUN_3000_d37f();
  FUN_3000_d43b();
  if ((DAT_6000_c11c != '\x02') && (iVar4 = random_n(0x3b6), iVar4 < DAT_6000_c8a2 + 0x28)) {
    uVar9 = 0;
    uVar5 = 0x8000;
    sVar2 = rand();
    lVar6 = N_LXMUL(0x14,(long)sVar2);
    lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
    if ((int)lVar6 < DAT_6000_c8a2) {
      FUN_1000_22a2(0x2ee);
      uVar8 = 0;
      uVar9 = 0;
      uVar5 = 0x4af;
      lVar6 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
      uVar5 = (undefined2)lVar6;
      uVar7 = 0;
      uVar9 = 0x63f;
      lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar9));
      fill_rect(0,0,(int)lVar6,uVar5,uVar8);
      print_text(0,0,0,(char *)s_YOU_FIND____6000_68d6,8);
      FUN_1000_22a2(3000);
      uVar8 = 0;
      uVar9 = 0;
      uVar5 = 0x4af;
      lVar6 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
      uVar5 = (undefined2)lVar6;
      uVar7 = 0;
      uVar9 = 0x63f;
      lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar9));
      fill_rect(0,0,(int)lVar6,uVar5,uVar8);
      uVar9 = 0;
      uVar5 = 0x8000;
      sVar2 = rand();
      lVar6 = F_LDIV(CONCAT22((sVar2 >> 0xf) << 1 | (uint)(sVar2 < 0),sVar2 << 1),
                     CONCAT22(uVar9,uVar5));
      if ((int)lVar6 == 0) {
        FUN_3000_d0b9();
      }
      else {
        print_text(0,0,0,(char *)s_NOTHING___HIT_ANY_KEY__6000_68e2,8);
        flush_keys();
        wait_key();
        flush_keys();
        uVar8 = 0;
        uVar9 = 0;
        uVar5 = 0x4af;
        lVar6 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
        lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
        uVar5 = (undefined2)lVar6;
        uVar7 = 0;
        uVar9 = 0x63f;
        lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
        lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar9));
        fill_rect(0,0,(int)lVar6,uVar5,uVar8);
      }
    }
  }
  FUN_3000_c977();
  uVar9 = 0;
  uVar5 = 0x8000;
  sVar2 = rand();
  lVar6 = N_LXMUL(3,(long)sVar2);
  lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
  iVar4 = (int)lVar6;
  if (iVar4 == 0) {
    FUN_3000_cb7a();
  }
  if (iVar4 == 1) {
    FUN_3000_cd34();
  }
  if (iVar4 == 2) {
    FUN_3000_cf3a();
  }
  if ((0x67 < uVar1) && (uVar1 < 0x70)) {
    switch(uVar1) {
    case 0x68:
      DAT_6000_c937 = DAT_6000_c937 | 1;
      FUN_2000_22ff((char *)s_YOU_HAVE_FOUND_THE_PLUS_6000_68f9,
                    (char *)s_9_BODY_ARMOR__THIS_ITEM_6000_6913,
                    (char *)s_WILL_MAKE_IT_HARDER_FOR_6000_692b,
                    (char *)s_ENEMY_MONSTERS_TO_HIT_6000_6943,
                    (char *)s_TO_TAKE_MORE_STRIKES_AT_YOU__6000_4fd1 + 0x18,
                    (char *)s_NOW_LOOK_FOR_THE_SHADOW_6000_6959,
                    (char *)s_MINI_DRAGON_ON_LEVEL_8__6000_6973,
                    (char *)s_HE_HAS_NICE_GLOVES__6000_698b);
      DAT_6000_c8c2 = 9;
      break;
    case 0x69:
      DAT_6000_c937 = DAT_6000_c937 | 2;
      FUN_2000_22ff((char *)s_YOU_HAVE_FOUND_THE_PLUS_6000_68f9,
                    (char *)s_12_GAUNTLET__WHEN_YOU_PUT_6000_699f,
                    (char *)s_IT_ON__YOUR_HAND_SEEMS_6000_69b9,
                    (char *)s_STRONGER_AND_MUCH_MORE_6000_69d0,(char *)s_ACCURATE__6000_69e7,
                    (char *)s_NOW_LOOK_FOR_THE_SHADOW_6000_6959,
                    (char *)s_MAJOR_DRAGON_ON_LEVEL_12__6000_69f1,
                    (char *)s_HE_HAS_A_NICE_RING__6000_6a0b);
      DAT_6000_c938 = 0xc;
      break;
    case 0x6a:
      DAT_6000_c937 = DAT_6000_c937 | 4;
      FUN_2000_22ff((char *)s_YOU_HAVE_FOUND_THE_PLUS_6000_68f9,
                    (char *)s_15_RING_OF_PROTECTION__IT_6000_6a1f,
                    (char *)s_MAKES_YOU_FEEL_LIKE_YOU_6000_6a39,
                    (char *)s_CAN_DODGE_ATTACKS_MORE_6000_6a51,(char *)s_EASILY__6000_6a68,
                    (char *)s_NOW_FIND_THE_SHADOW_6000_6a70,
                    (char *)s_DRAGON_KING_ON_LEVEL_16__HE_6000_6a86,
                    (char *)s_HAS_SOMETHING_SPECIAL____6000_6aa2);
      DAT_6000_c8c3 = 0xf;
      break;
    case 0x6b:
      DAT_6000_c937 = DAT_6000_c937 | 8;
      FUN_2000_22ff((char *)s_FINALLY__YOU_NOW_HAVE_THE_6000_6abb,
                    (char *)s_MIGHTY_ORB_OF_WEAPON_6000_6ad7,
                    (char *)s_ENHANCEMENT__IT_WILL_TURN_6000_6aec,
                    (char *)s_ANY_WEAPON_INTO_A_PLUS_25_6000_6b06,(char *)s_ATTACK_WEAPON__6000_6b20
                    ,(char *)s_THIS_WEAPON_IS_EXTREMELY_6000_6b2f,
                    (char *)s_USEFUL_IN_THE_200_PLUS_LEVEL_6000_6b4a,
                    (char *)s_ADVANCED_VERSION_OF_WORLD__6000_6b67);
      FUN_2000_1c86();
      for (iVar4 = 0; iVar4 < 8; iVar4 = iVar4 + 1) {
        if ((char)((undefined1 *)&DAT_6000_c173)[iVar4] < '\x01') {
          strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)s__________6000_6b82);
        }
        else {
          strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],
                 (char *)*(undefined2 *)(iVar4 * 7 + 0x1c0));
          if (((undefined1 *)&DAT_6000_c180)[iVar4] != '\0') {
            strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],
                   (char *)s_13__RING_OF_PROTECTION__PLUS_6000_5699 + 0x16);
            pcVar3 = itoa((int)(char)((undefined1 *)&DAT_6000_c180)[iVar4],DAT_6000_cb52,10);
            strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],pcVar3);
          }
        }
      }
      uVar8 = 0;
      uVar9 = 0;
      uVar5 = 0x4af;
      lVar6 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
      uVar5 = (undefined2)lVar6;
      uVar7 = 0;
      uVar9 = 0x63f;
      lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar9));
      fill_rect(0,0,(int)lVar6,uVar5,uVar8);
      do {
        do {
          FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
          print_text(0,0,0,(char *)s_SELECT_A_WEAPON_TO_ENHANCE__6000_6b8b,5);
          iVar4 = FUN_2000_1fbd(0,7);
        } while (iVar4 < 0x31);
      } while ((0x38 < iVar4) || (*(char *)(iVar4 + -0x3ebe) == '\0'));
      flush_keys();
      *(undefined1 *)(iVar4 + -0x3eb1) = 0x19;
      uVar9 = 0;
      uVar5 = 0x4af;
      lVar6 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
      uVar5 = (undefined2)lVar6;
      uVar7 = 0;
      uVar9 = 0x63f;
      lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar9));
      uVar9 = (undefined2)lVar6;
      uVar8 = 0;
      uVar7 = 0x4af;
      lVar6 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar7));
      fill_rect(0,(int)lVar6,uVar9,uVar5);
      break;
    case 0x6c:
      DAT_6000_c937 = DAT_6000_c937 | 0x10;
      FUN_2000_22ff((char *)s_YOU_HAVE_FOUND_THE_PLUS_6000_68f9,
                    (char *)s_25_BODY_ARMOR__THIS_ITEM_6000_6ba7,
                    (char *)s_WILL_MAKE_IT_MUCH_HARDER_6000_6bc0,
                    (char *)s_FOR_ENEMY_MONSTERS_TO_6000_6bd9,(char *)s_HIT_YOU__6000_6bef,
                    (char *)s_NOW_LOOK_FOR_THE_RED_6000_6bf8,
                    (char *)s_MINI_DRAGON_ON_LEVEL_150__6000_6c0f,
                    (char *)s_HE_IS_ONE_TOUGH_COOKIE__6000_6c29);
      DAT_6000_c8c2 = 0x19;
      break;
    case 0x6d:
      DAT_6000_c937 = DAT_6000_c937 | 0x20;
      FUN_2000_22ff((char *)s_YOU_HAVE_FOUND_THE_PLUS_6000_68f9,
                    (char *)s_50_GAUNTLET__WHEN_YOU_PUT_6000_6c41,
                    (char *)s_IT_ON__YOUR_HAND_SEEMS_6000_69b9,
                    (char *)s_STRONGER_AND_INCREDIBLY_6000_6c5b,(char *)s_MORE_ACCURATE__6000_6c73,
                    (char *)s_NOW_LOOK_FOR_THE_RED_6000_6bf8,
                    (char *)s_MAJOR_DRAGON_ON_LEVEL_175__6000_6c82,
                    (char *)s_HE_HAS_A_NICE_RING__6000_6a0b);
      DAT_6000_c938 = 0x32;
      break;
    case 0x6e:
      DAT_6000_c937 = DAT_6000_c937 | 0x40;
      FUN_2000_22ff((char *)s_YOU_HAVE_FOUND_THE_PLUS_6000_68f9,
                    (char *)s_50_RING_OF_PROTECTION__IT_6000_6c9d,
                    (char *)s_MAKES_YOU_FEEL_LIKE_YOU_6000_6a39,
                    (char *)s_CAN_DODGE_ATTACKS_MUCH_MORE_6000_6cb7,(char *)s_EASILY__6000_6a68,
                    (char *)s_NOW_FIND_AND_DESTROY_THE_6000_6cd3,
                    (char *)s_MOST_POWERFUL_MONSTER_IN_THE_6000_6cee,
                    (char *)s_WORLD__HE_S_ON_LEVEL_200____6000_6d0b);
      DAT_6000_c8c3 = 0x32;
      break;
    case 0x6f:
      DAT_6000_c937 = DAT_6000_c937 | 0x80;
      FUN_2000_22ff((char *)s_THE_GROUND_BEGINS_TO_RUMBLE__6000_6d27,
                    (char *)s_AND_SUDDENLY_THE_BODY_OF_THE_6000_6d44,
                    (char *)s_GREAT_DRAGON_KING_TURNS_INTO_6000_6d61,
                    (char *)s_A_SMALL_RAT_WHICH_SCURRIES_6000_6d7e,
                    (char *)s_OFF_INTO_A_HOLE_IN_THE_WALL__6000_6d99,
                    (char *)s_YOU_HAVE_DEFEATED_THE_MOST_6000_6db6,
                    (char *)s_POWERFUL_MONSTER_IN_MORAFF_S_6000_6dd1,
                    (char *)s_WORLD__HIT_ANY_KEY____6000_6dee);
      FUN_2000_22ff((char *)s_FINALLY__YOU_NOW_HAVE_THE_6000_6abb,
                    (char *)s_MIGHTY_ORB_OF_EXPLOSIVE_6000_6e09,
                    (char *)s_WEAPON_ENHANCEMENT__IT_WILL_6000_6e21,
                    (char *)s_TURN_ANY_WEAPON_INTO_A_PLUS_6000_6e3d,
                    (char *)s_100_ATTACK_WEAPON__6000_6e59,
                    (char *)s_THIS_WEAPON_IS_BY_FAR_THE_6000_6e6c,
                    (char *)s_MOST_POWERFUL_WEAPON_EVER__6000_6e88,
                    (char *)s_PERIOD__HIT_ANY_KEY____6000_6214 + 7);
      FUN_2000_1c86();
      uVar8 = 0;
      uVar9 = 0;
      uVar5 = 0x4af;
      lVar6 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
      uVar5 = (undefined2)lVar6;
      uVar7 = 0;
      uVar9 = 0x63f;
      lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar9));
      fill_rect(0,0,(int)lVar6,uVar5,uVar8);
      for (iVar4 = 0; iVar4 < 8; iVar4 = iVar4 + 1) {
        if ((char)((undefined1 *)&DAT_6000_c173)[iVar4] < '\x01') {
          strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],(char *)s__________6000_6b82);
        }
        else {
          strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],
                 (char *)*(undefined2 *)(iVar4 * 7 + 0x1c0));
          if (((undefined1 *)&DAT_6000_c180)[iVar4] != '\0') {
            strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],
                   (char *)s_13__RING_OF_PROTECTION__PLUS_6000_5699 + 0x16);
            pcVar3 = itoa((int)(char)((undefined1 *)&DAT_6000_c180)[iVar4],DAT_6000_cb52,10);
            strcat((char *)((undefined2 *)&DAT_6000_cd80)[iVar4],pcVar3);
          }
        }
      }
      do {
        do {
          FUN_2000_22d7((undefined2 *)&DAT_6000_cd80);
          print_text(0,0,0,(char *)s_SELECT_A_WEAPON_TO_ENHANCE__6000_6b8b,5);
          iVar4 = FUN_2000_1fbd(0,7);
        } while (iVar4 < 0x31);
      } while ((0x38 < iVar4) || (*(char *)(iVar4 + -0x3ebe) == '\0'));
      flush_keys();
      *(undefined1 *)(iVar4 + -0x3eb1) = 100;
      uVar9 = 0;
      uVar5 = 0x4af;
      lVar6 = N_LXMUL(0x1ae,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar5));
      uVar5 = (undefined2)lVar6;
      uVar7 = 0;
      uVar9 = 0x63f;
      lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar7,uVar9));
      uVar9 = (undefined2)lVar6;
      uVar8 = 0;
      uVar7 = 0x4af;
      lVar6 = N_LXMUL(0x26,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar7));
      fill_rect(0,(int)lVar6,uVar9,uVar5);
      FUN_2000_22ff((char *)s_YOU_HAVE_BEATEN_THE_GREAT_6000_6ea3,
                    (char *)s_RED_DRAGON_KING__YOU_MAY_6000_6ebf,
                    (char *)s_CONTINUE_TO_WANDER_THROUGH_6000_6ed8,
                    (char *)s_MORAFF_S_WORLD_IN_SEARCH_OF_6000_6ef3,
                    (char *)s_LOOT_AND_TREASURE__OR_YOU_6000_6f0f,
                    (char *)s_MAY_ATTEMPT_TO_COMPLETE_THIS_6000_6f29,
                    (char *)s_GREAT_ADVENTURE_WITH_A_NEW_6000_6f46,
                    (char *)s_AND_DIFFERENT_CHARACTER__6000_6f61);
    }
  }
  DAT_6000_45c7 = 1;
  DAT_6000_4593 = 0xffff;
  flush_keys();
  FUN_1000_22a2(500);
  if (DAT_6000_c89a == 0) {
    if (DAT_6000_c123 + 0xf < DAT_6000_c125) {
      if (DAT_6000_c11c == '\0') {
        FUN_2000_22ff((char *)s_YOU_KILLED_THAT_MONSTER__6000_6f7a,
                      (char *)s_BUT_YOU_ARE_INJURED__YOU_6000_6f95,
                      (char *)s_SHOULD_GO_TO_THE_TEMPLE_IN_6000_6fae,
                      (char *)s_TOWN_AND_BUY_A_CURE_SPELL__6000_6fc9,
                      (char *)s_IF_YOUR_HEALTH_POINTS_DROP_6000_6fe4,
                      (char *)s_BELOW_0__YOU_WILL_DIE__CURES_6000_6fff,
                      (char *)s_ARE_EXPENSIVE__BUT_THEY_ARE_6000_701c,
                      (char *)s_WELL_WORTH_THE_MONEY__6000_7038);
      }
      else {
        FUN_2000_22ff((char *)s_YOU_KILLED_THAT_MONSTER__6000_6f7a,
                      (char *)s_BUT_YOU_ARE_INJURED__YOU_6000_6f95,
                      (char *)s_SHOULD_CAST_A_CURE_SPELL_TO_6000_704e,
                      (char *)s_INCREASE_YOUR_HEALTH_POINTS__6000_706a,
                      (char *)s_IF_YOUR_HEALTH_POINTS_FALL_6000_7087,
                      (char *)s_BELOW_0__YOU_WILL_DIE__USE_6000_70a4,
                      (char *)s_THE_CAST_SPELL_MENU_AND_THEN_6000_70bf,
                      (char *)s_SELECT__2__TO_CAST_A_CURE__6000_70dc);
      }
    }
    iVar4 = FUN_2000_5ae2();
    if (iVar4 != 0) {
      flush_keys();
      FUN_2000_22ff((char *)s_GOOD_NEWS__6000_70f7,(char *)s_YOU_ARE_READY_TO_BECOME_1_ST_6000_7102,
                    (char *)s_LEVEL__GO_TO_THE_TOWN__FIND_6000_711f,
                    (char *)s_AN_INN__AND_STAY_THE_NIGHT__6000_713b,
                    (char *)s_WHEN_YOU_WAKE_THE_NEXT_6000_7157,
                    (char *)s_MORNING__YOU_LL_BE_MUCH_MORE_6000_7170,
                    (char *)s_POWERFUL__THEN_THE_MONSTERS_6000_718d,
                    (char *)s_WILL_REALLY_COME_AFTER_YOU__6000_71a9);
    }
  }
  flush_keys();
  return;
}


// ==== FUN_3000_e221 @ 3000:e221 (size 980) callers: movecontrol

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_e221(void)

{
  bool bVar1;
  char cVar2;
  int iVar3;
  int iVar4;
  int iVar5;
  long lVar6;
  undefined2 uVar7;
  undefined2 uVar8;
  undefined2 uVar9;
  undefined2 uVar10;
  
  bVar1 = false;
  load_h_bin(0x13);
  iVar3 = FUN_2000_1fbd(1,6);
  if (iVar3 == 0x31) {
    if (DAT_6000_c8f0 == 0) {
      bVar1 = true;
    }
    else if (DAT_6000_c8a2 < 0x4c) {
      FUN_2000_22ff((char *)s_YOU_ARE_SLIPPING_THROUGH_THE_6000_71dd,
                    (char *)s_FLOOR__HIT_ANY_KEY____6000_71fa,(undefined4 *)&DAT_6000_45cd,
                    (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd,
                    (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd,
                    (undefined4 *)&DAT_6000_45cd);
      DAT_6000_c8a2 = DAT_6000_c8a2 + 1;
      while (cVar2 = is_solid(DAT_6000_c89e,DAT_6000_c8a0,DAT_6000_c8a2,DAT_6000_c8a4),
            cVar2 != '\0') {
        iVar4 = random_n(DAT_6000_448b + -5);
        DAT_6000_c89e = iVar4 + 2;
        iVar4 = random_n(DAT_6000_448d + -5);
        DAT_6000_c8a0 = iVar4 + 2;
      }
      enter_level(DAT_6000_c8a2);
      DAT_6000_123d = 1;
    }
    else {
      FUN_2000_22ff((char *)s_DOESN_T_WORK_THIS_DEEP__6000_71c5,(undefined4 *)&DAT_6000_45cd,
                    (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                    (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd,
                    (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd);
    }
  }
  if (iVar3 == 0x32) {
    if (DAT_6000_c900 < 1) {
      bVar1 = true;
    }
    else {
      uVar10 = 0;
      uVar9 = 0;
      uVar7 = 0x4af;
      lVar6 = N_LXMUL(0x28,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar9,uVar7));
      uVar7 = (undefined2)lVar6;
      uVar8 = 0;
      uVar9 = 0x63f;
      lVar6 = N_LXMUL(0x2d0,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
      lVar6 = F_LDIV(lVar6,CONCAT22(uVar8,uVar9));
      fill_rect(0,0,(int)lVar6,uVar7,uVar10);
      print_text(0,0,0,(char *)s_YOU_FEEL_GREAT__HIT_A_KEY____6000_7212,DAT_6000_1303);
      wait_key();
      DAT_6000_c123 = DAT_6000_c125;
      DAT_6000_c900 = DAT_6000_c900 + -1;
    }
  }
  if (iVar3 == 0x33) {
    load_h_bin(0x14);
    iVar4 = FUN_2000_1fbd(2,6);
    if ((0x30 < iVar4) && (iVar4 < 0x35)) {
      load_h_bin(0x15);
      wait_key();
      load_h_bin(0x16);
      wait_key();
    }
  }
  if (iVar3 == 0x34) {
    if (DAT_6000_c8bb == '\0') {
      bVar1 = true;
    }
    else {
      DAT_6000_c8bb = DAT_6000_c8bb + -1;
      for (iVar4 = 0; iVar4 < DAT_6000_448b; iVar4 = iVar4 + 1) {
        for (iVar5 = 0; iVar5 < DAT_6000_448d; iVar5 = iVar5 + 1) {
          cVar2 = is_solid(iVar4,iVar5,DAT_6000_c8a2,DAT_6000_c8a4);
          if (cVar2 == '\0') {
            FUN_2000_5263(iVar4,iVar5);
          }
        }
      }
      DAT_6000_123d = 1;
      load_h_bin(0x17);
      wait_key();
    }
  }
  if (iVar3 == 0x35) {
    if (DAT_6000_c902 < 1) {
      bVar1 = true;
    }
    else {
      DAT_6000_c902 = DAT_6000_c902 + -1;
      DAT_6000_c8a2 = 0;
      enter_level(0);
      for (iVar4 = 0x14; iVar4 < DAT_6000_448b + -0x14; iVar4 = iVar4 + 1) {
        for (iVar5 = 0x14; iVar5 < DAT_6000_448d + -0x14; iVar5 = iVar5 + 1) {
          cVar2 = is_solid(iVar4,iVar5,DAT_6000_c8a2,DAT_6000_c8a4);
          if (cVar2 == '\0') {
            DAT_6000_c89e = iVar4;
            DAT_6000_c8a0 = iVar5;
          }
        }
      }
      DAT_6000_4593 = -1;
      DAT_6000_cd18 = 1;
      DAT_6000_123d = 1;
      load_h_bin(0x18);
      wait_key();
    }
  }
  if (iVar3 == 0x36) {
    if ((DAT_6000_c8ba == '\0') || (DAT_6000_4593 != -1)) {
      if (DAT_6000_c8ba == '\0') {
        bVar1 = true;
      }
      else if (*(char *)((uint)*(byte *)((int)DAT_6000_cbde + DAT_6000_4593 * 6 + 4) * 0x23 + 0x247)
               == 'd') {
        FUN_2000_22ff((char *)s_THE_MONSTER_CATCHES_THE_6000_722f,(char *)s_GRADADE__6000_724a,
                      (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd,(char *)s_PERIOD__HIT_ANY_KEY____6000_6214 + 7,
                      (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd);
        load_h_bin(0x1a);
        wait_key();
      }
      else {
        DAT_6000_c8ba = DAT_6000_c8ba + -1;
        *_DAT_6000_cd28 = 0xff9c;
        FUN_2000_22ff((char *)s_A_MASSIVE_EXPLOSION_KILLS_6000_7253,
                      (char *)s_THE_MONSTER_INSTANTLY__6000_726d,(undefined4 *)&DAT_6000_45cd,
                      (char *)s_HIT_ANY_KEY____6000_4a75,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd,(undefined4 *)&DAT_6000_45cd,
                      (undefined4 *)&DAT_6000_45cd);
      }
    }
    else {
      load_h_bin(0x19);
      wait_key();
    }
  }
  if (bVar1) {
    FUN_2000_22ff((char *)s_MAGIC_ITEMS_ARE_MUCH_MORE_6000_7286,
                  (char *)s_EFFECTIVE_WHEN_YOU_6000_72a0,(char *)s_ACTUALLY_POSESS_THEM__6000_72b5,
                  (char *)s_KILL_SOME_MORE_MONSTERS__6000_72cd,
                  (char *)s_YOU_RE_BOUND_FIND_ONE_6000_72e6,(char *)s_EVENTUALLY__6000_72fe,
                  (undefined4 *)&DAT_6000_45cd,(char *)s_HIT_ANY_KEY____6000_4a75);
  }
  return;
}


// ==== FUN_3000_e5f5 @ 3000:e5f5 (size 747) callers: FUN_2000_5b41

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_e5f5(void)

{
  int iVar1;
  int iVar2;
  int iVar3;
  short sVar4;
  long lVar5;
  long lVar6;
  
  iVar1 = DAT_6000_c125;
  DAT_6000_c89a = DAT_6000_c89a + 1;
  switch(DAT_6000_c11c) {
  case 0:
    iVar2 = DAT_6000_c90a * 2;
    iVar3 = DAT_6000_c90e / 2;
    lVar6 = 0x8000;
    sVar4 = rand();
    lVar5 = N_LXMUL((long)(iVar2 + iVar3 + 10),(long)sVar4);
    lVar5 = F_LDIV(lVar5,lVar6);
    DAT_6000_c125 = DAT_6000_c125 + (int)lVar5 + 0x23;
    break;
  case 1:
    iVar2 = DAT_6000_c90a / 2;
    iVar3 = DAT_6000_c90e / 2;
    lVar6 = 0x8000;
    sVar4 = rand();
    lVar5 = N_LXMUL((long)(iVar2 + iVar3 + 10),(long)sVar4);
    lVar5 = F_LDIV(lVar5,lVar6);
    DAT_6000_c125 = DAT_6000_c125 + (int)lVar5 + 0xf;
    _DAT_6000_c12b = (float)((DAT_6000_c908 * 2 + DAT_6000_c906) / 3) + _DAT_6000_c12b;
    break;
  case 2:
    iVar2 = DAT_6000_c90a / 2;
    iVar3 = DAT_6000_c90e / 3;
    lVar6 = 0x8000;
    sVar4 = rand();
    lVar5 = N_LXMUL((long)(iVar2 + iVar3 + 5),(long)sVar4);
    lVar5 = F_LDIV(lVar5,lVar6);
    DAT_6000_c125 = DAT_6000_c125 + (int)lVar5 + 0xe;
    _DAT_6000_c12b = (float)((DAT_6000_c908 + DAT_6000_c906) / 0xd) + _DAT_6000_c12b;
    break;
  case 3:
    iVar2 = DAT_6000_c90a / 3;
    iVar3 = DAT_6000_c90e / 5;
    lVar6 = 0x8000;
    sVar4 = rand();
    lVar5 = N_LXMUL((long)(iVar2 + iVar3 + 4),(long)sVar4);
    lVar5 = F_LDIV(lVar5,lVar6);
    DAT_6000_c125 = DAT_6000_c125 + (int)lVar5 + 0xd;
    _DAT_6000_c12b = (float)((DAT_6000_c908 + DAT_6000_c906 * 2) / 5) + _DAT_6000_c12b;
    break;
  case 4:
    iVar2 = DAT_6000_c90a / 2;
    iVar3 = DAT_6000_c90e / 3;
    lVar6 = 0x8000;
    sVar4 = rand();
    lVar5 = N_LXMUL((long)(iVar2 + iVar3 + 4),(long)sVar4);
    lVar5 = F_LDIV(lVar5,lVar6);
    DAT_6000_c125 = DAT_6000_c125 + (int)lVar5 + 0xe;
    _DAT_6000_c12b = (float)((DAT_6000_c908 * 2 + DAT_6000_c906) / 5) + _DAT_6000_c12b;
    break;
  case 5:
    iVar2 = DAT_6000_c90a * 3 + DAT_6000_c90e;
    lVar6 = 0x8000;
    sVar4 = rand();
    lVar5 = N_LXMUL((long)(iVar2 + 0x11),(long)sVar4);
    lVar5 = F_LDIV(lVar5,lVar6);
    DAT_6000_c125 = DAT_6000_c125 + (int)lVar5 + 0x37;
    _DAT_6000_c12b = (float)((DAT_6000_c908 + DAT_6000_c906) / 0xe) + _DAT_6000_c12b;
    break;
  case 6:
    iVar2 = DAT_6000_c90a / 2;
    iVar3 = DAT_6000_c90e / 3;
    lVar6 = 0x8000;
    sVar4 = rand();
    lVar5 = N_LXMUL((long)(iVar2 + iVar3 + 7),(long)sVar4);
    lVar5 = F_LDIV(lVar5,lVar6);
    DAT_6000_c125 = DAT_6000_c125 + (int)lVar5 + 0xe;
    _DAT_6000_c12b = (float)((DAT_6000_c908 + DAT_6000_c906 * 2) / 8) + _DAT_6000_c12b;
  }
  DAT_6000_c129 = DAT_6000_c12d;
  DAT_6000_c127 = DAT_6000_c12b;
  DAT_6000_c123 = DAT_6000_c123 + (DAT_6000_c125 - iVar1);
  return;
}


// ==== FUN_3000_e8ee @ 3000:e8ee (size 764) callers: monster_turn

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_3000_e8ee(void)

{
  int iVar1;
  int iVar2;
  short sVar3;
  long lVar4;
  long lVar5;
  
  switch(DAT_6000_c11c) {
  case 0:
    iVar1 = DAT_6000_c90a * 2;
    iVar2 = DAT_6000_c90e / 2;
    lVar5 = 0x8000;
    sVar3 = rand();
    lVar4 = N_LXMUL((long)(iVar1 + iVar2 + 10),(long)sVar3);
    lVar4 = F_LDIV(lVar4,lVar5);
    DAT_6000_c125 = DAT_6000_c125 - ((int)lVar4 + 0x23);
    break;
  case 1:
    iVar1 = DAT_6000_c90a / 2;
    iVar2 = DAT_6000_c90e / 2;
    lVar5 = 0x8000;
    sVar3 = rand();
    lVar4 = N_LXMUL((long)(iVar1 + iVar2 + 10),(long)sVar3);
    lVar4 = F_LDIV(lVar4,lVar5);
    DAT_6000_c125 = DAT_6000_c125 - ((int)lVar4 + 0xf);
    _DAT_6000_c12b = _DAT_6000_c12b - (float)((DAT_6000_c908 * 2 + DAT_6000_c906) / 3);
    break;
  case 2:
    iVar1 = DAT_6000_c90a / 2;
    iVar2 = DAT_6000_c90e / 3;
    lVar5 = 0x8000;
    sVar3 = rand();
    lVar4 = N_LXMUL((long)(iVar1 + iVar2 + 5),(long)sVar3);
    lVar4 = F_LDIV(lVar4,lVar5);
    DAT_6000_c125 = DAT_6000_c125 - ((int)lVar4 + 0xe);
    _DAT_6000_c12b = _DAT_6000_c12b - (float)((DAT_6000_c908 + DAT_6000_c906) / 0xd);
    break;
  case 3:
    iVar1 = DAT_6000_c90a / 3;
    iVar2 = DAT_6000_c90e / 5;
    lVar5 = 0x8000;
    sVar3 = rand();
    lVar4 = N_LXMUL((long)(iVar1 + iVar2 + 4),(long)sVar3);
    lVar4 = F_LDIV(lVar4,lVar5);
    DAT_6000_c125 = DAT_6000_c125 - ((int)lVar4 + 0xd);
    _DAT_6000_c12b = _DAT_6000_c12b - (float)((DAT_6000_c908 + DAT_6000_c906 * 2) / 5);
    break;
  case 4:
    iVar1 = DAT_6000_c90a / 2;
    iVar2 = DAT_6000_c90e / 3;
    lVar5 = 0x8000;
    sVar3 = rand();
    lVar4 = N_LXMUL((long)(iVar1 + iVar2 + 4),(long)sVar3);
    lVar4 = F_LDIV(lVar4,lVar5);
    DAT_6000_c125 = DAT_6000_c125 - ((int)lVar4 + 0xe);
    _DAT_6000_c12b = _DAT_6000_c12b - (float)((DAT_6000_c908 * 2 + DAT_6000_c906) / 5);
    break;
  case 5:
    iVar1 = DAT_6000_c90a * 3 + DAT_6000_c90e;
    lVar5 = 0x8000;
    sVar3 = rand();
    lVar4 = N_LXMUL((long)(iVar1 + 0x11),(long)sVar3);
    lVar4 = F_LDIV(lVar4,lVar5);
    DAT_6000_c125 = DAT_6000_c125 - ((int)lVar4 + 0x37);
    _DAT_6000_c12b = _DAT_6000_c12b - (float)((DAT_6000_c908 + DAT_6000_c906) / 0xe);
    break;
  case 6:
    iVar1 = DAT_6000_c90a / 2;
    iVar2 = DAT_6000_c90e / 3;
    lVar5 = 0x8000;
    sVar3 = rand();
    lVar4 = N_LXMUL((long)(iVar1 + iVar2 + 7),(long)sVar3);
    lVar4 = F_LDIV(lVar4,lVar5);
    DAT_6000_c125 = DAT_6000_c125 - ((int)lVar4 + 0xe);
    _DAT_6000_c12b = _DAT_6000_c12b - (float)((DAT_6000_c908 + DAT_6000_c906 * 2) / 8);
  }
  if (_DAT_6000_c12b < _DAT_6000_c127) {
    _DAT_6000_c127 = _DAT_6000_c12b;
  }
  if (DAT_6000_c125 < DAT_6000_c123) {
    DAT_6000_c123 = DAT_6000_c125;
  }
  return;
}


// ==== FUN_4000_0000 @ 4000:0000 (size 52) callers: FUN_4000_0034

void __cdecl16far
FUN_4000_0000(undefined2 param_1,undefined2 param_2,int param_3,int param_4,undefined1 param_5,
             undefined1 param_6)

{
  if ((0 < param_3) && (0 < param_4)) {
    (*DAT_6000_962e)(0x4000,param_1,param_2,param_3,param_4,param_5,param_6);
    return;
  }
  return;
}


// ==== FUN_4000_0034 @ 4000:0034 (size 1637) callers: FUN_4000_0699

void __cdecl16far FUN_4000_0034(char param_1,int param_2,int param_3)

{
  char cVar1;
  int iVar2;
  int iVar3;
  int iVar4;
  int iVar5;
  int iVar6;
  undefined1 uVar7;
  undefined1 extraout_AH;
  undefined1 extraout_AH_00;
  uint uVar8;
  uint uVar9;
  long lVar10;
  
  uVar9 = 0;
  if ((DAT_6000_cd94 == 0) && (DAT_6000_cda6 != '\0')) {
    DAT_6000_cda6 = '\x01';
  }
  else if ((DAT_6000_cd94 == 1) && (('\x03' < DAT_6000_cda6 || (DAT_6000_cda6 < '\0')))) {
    DAT_6000_cda6 = DAT_6000_cda6 % '\x03' + '\x01';
  }
  if ((DAT_6000_00c5 == 1) && (DAT_6000_cda6 != '\0')) {
    DAT_6000_cda6 = '\x0f';
  }
  do {
    if (*(char *)(param_1 * 0x1e + uVar9 + 0x730c) == '\x10') {
      return;
    }
    if ((*(char *)(param_1 * 0x1e + uVar9 + 0x730c) == '\x01') &&
       (*(char *)(param_1 * 0x1e + uVar9 + 0x7310) == '\x01')) {
      param_3 = param_3 + ((DAT_6000_cda9 << 6) >> 7);
    }
    else if (*(byte *)(param_1 * 0x1e + uVar9 + 0x730c) < 0x10) {
      cVar1 = DAT_6000_cdac;
      if ((DAT_6000_cdac == '\x01') && (cVar1 = DAT_6000_cdab, DAT_6000_cdab == '\x01')) {
        FUN_4000_0000(((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730d) * DAT_6000_cda7) >> 7)
                      + param_2,
                      ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730e) * DAT_6000_cda9) >> 7)
                      + param_3,
                      (int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730f) * DAT_6000_cda7) >> 7,
                      (int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x7310) * DAT_6000_cda9) >> 7,
                      (int)DAT_6000_cda6,*(undefined1 *)(param_1 * 0x1e + uVar9 + 0x730c));
      }
      else if (cVar1 < '\x01') {
        for (uVar8 = 0; uVar8 < (uint)(int)DAT_6000_cdab; uVar8 = uVar8 + 1) {
          FUN_4000_0000(((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730d) * DAT_6000_cda7) >>
                        7) + param_2,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730e) * DAT_6000_cda9) >>
                        7) + param_3,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730f) * DAT_6000_cda7) >>
                        7) + uVar8,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x7310) * DAT_6000_cda9) >>
                        7) + uVar8,(int)DAT_6000_cda6,
                        *(undefined1 *)(param_1 * 0x1e + uVar9 + 0x730c));
          FUN_4000_0000(((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730d) * DAT_6000_cda7) >>
                        7) + param_2,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730e) * DAT_6000_cda9) >>
                        7) + param_3,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730f) * DAT_6000_cda7) >>
                        7) - uVar8,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x7310) * DAT_6000_cda9) >>
                        7) - uVar8,(int)DAT_6000_cda6,
                        *(undefined1 *)(param_1 * 0x1e + uVar9 + 0x730c));
        }
      }
      else {
        for (uVar8 = 0; uVar8 < (uint)(int)DAT_6000_cdab; uVar8 = uVar8 + 1) {
          FUN_4000_0000(((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730d) * DAT_6000_cda7) >>
                        7) + param_2,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730e) * DAT_6000_cda9) >>
                        7) + param_3,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730f) * DAT_6000_cda7) >>
                        7) + uVar8,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x7310) * DAT_6000_cda9) >>
                        7) + uVar8,(int)DAT_6000_cda6,
                        *(undefined1 *)(param_1 * 0x1e + uVar9 + 0x730c));
          FUN_4000_0000(((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730d) * DAT_6000_cda7) >>
                        7) + param_2,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730e) * DAT_6000_cda9) >>
                        7) + param_3,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x730f) * DAT_6000_cda7) >>
                        7) - uVar8,
                        ((int)((uint)*(byte *)(param_1 * 0x1e + uVar9 + 0x7310) * DAT_6000_cda9) >>
                        7) - uVar8,(int)DAT_6000_cda6,
                        *(undefined1 *)(param_1 * 0x1e + uVar9 + 0x730c));
        }
      }
    }
    else {
      lVar10 = N_LXMUL((long)DAT_6000_cda7,(ulong)*(byte *)(param_1 * 0x1e + uVar9 + 0x730d));
      lVar10 = N_LXRSH(lVar10,'\a');
      iVar2 = (int)lVar10 + param_2;
      lVar10 = N_LXMUL((long)DAT_6000_cda9,(ulong)*(byte *)(param_1 * 0x1e + uVar9 + 0x730e));
      lVar10 = N_LXRSH(lVar10,'\a');
      iVar3 = (int)lVar10 + param_3;
      lVar10 = N_LXMUL((long)DAT_6000_cda7,(ulong)*(byte *)(param_1 * 0x1e + uVar9 + 0x730f));
      lVar10 = N_LXRSH(lVar10,'\a');
      iVar4 = (int)lVar10 + param_2;
      lVar10 = N_LXMUL((long)DAT_6000_cda9,(ulong)*(byte *)(param_1 * 0x1e + uVar9 + 0x7310));
      lVar10 = N_LXRSH(lVar10,'\a');
      iVar5 = (int)lVar10 + param_3;
      iVar6 = param_1 * 0x1e + uVar9;
      uVar7 = (undefined1)((uint)iVar6 >> 8);
      if (*(char *)(iVar6 + 0x730c) == -2) {
        if (DAT_6000_cdac == '\x01') {
          (*DAT_6000_962a)(0x1000,iVar2,iVar3,iVar4,iVar5,CONCAT11(uVar7,DAT_6000_cda6));
        }
        else {
          for (uVar8 = 0; uVar8 < (uint)(int)DAT_6000_cdac; uVar8 = uVar8 + 1) {
            (*DAT_6000_962a)(0x1000,(iVar2 - DAT_6000_cdab) + 1,iVar3 - uVar8,
                             iVar4 + DAT_6000_cdab + -1,iVar5 - uVar8,
                             CONCAT11(DAT_6000_cdac >> 7,DAT_6000_cda6));
            (*DAT_6000_962a)(0x1000,(iVar2 - DAT_6000_cdab) + 1,iVar3 + uVar8,
                             iVar4 + DAT_6000_cdab + -1,iVar5 + uVar8,
                             CONCAT11(extraout_AH,DAT_6000_cda6));
          }
        }
      }
      else if (DAT_6000_cdab == '\x01') {
        (*DAT_6000_962a)(0x1000,iVar2,iVar3,iVar4,iVar5,CONCAT11(uVar7,DAT_6000_cda6));
      }
      else {
        for (uVar8 = 0; uVar8 < (uint)(int)DAT_6000_cdab; uVar8 = uVar8 + 1) {
          (*DAT_6000_962a)(0x1000,iVar2 - uVar8,(iVar3 - DAT_6000_cdac) + 1,iVar4 - uVar8,
                           iVar5 + DAT_6000_cdac + -1,CONCAT11(DAT_6000_cdab >> 7,DAT_6000_cda6));
          (*DAT_6000_962a)(0x1000,iVar2 + uVar8,(iVar3 - DAT_6000_cdac) + 1,iVar4 + uVar8,
                           iVar5 + DAT_6000_cdac + -1,CONCAT11(extraout_AH_00,DAT_6000_cda6));
        }
      }
    }
    uVar9 = uVar9 + 5;
  } while (uVar9 < 0x1a);
  return;
}


// ==== FUN_4000_0699 @ 4000:0699 (size 491) callers: FUN_4000_0884,print_text,print_text_clipped,FUN_4000_4347

void __cdecl16far FUN_4000_0699(char *param_1)

{
  short sVar1;
  int iVar2;
  undefined2 unaff_SI;
  int iVar3;
  undefined2 unaff_DI;
  long lVar4;
  long lVar5;
  long lVar6;
  long lVar7;
  int iVar8;
  
  iVar3 = 0;
  sVar1 = strlen(param_1);
  lVar4 = ftol((double)CONCAT26(DAT_6000_cd98,CONCAT24(DAT_6000_cd96,CONCAT22(unaff_SI,unaff_DI))));
  iVar2 = (int)lVar4;
  lVar4 = ftol((double)CONCAT26(DAT_6000_cd9c,CONCAT24(DAT_6000_cd9a,CONCAT22(unaff_SI,unaff_DI))));
  lVar5 = ftol((double)CONCAT26(DAT_6000_cd98,CONCAT24(DAT_6000_cd96,CONCAT22(unaff_SI,unaff_DI))));
  lVar6 = ftol((double)CONCAT26(DAT_6000_cd9c,CONCAT24(DAT_6000_cd9a,CONCAT22(unaff_SI,unaff_DI))));
  lVar7 = ftol((double)CONCAT26(DAT_6000_cd98,CONCAT24(DAT_6000_cd96,CONCAT22(unaff_SI,unaff_DI))));
  DAT_6000_cdab = (char)lVar7;
  if (DAT_6000_cdab < '\x01') {
    DAT_6000_cdab = '\x01';
  }
  lVar7 = ftol((double)CONCAT26(DAT_6000_cd9c,CONCAT24(DAT_6000_cd9a,CONCAT22(unaff_SI,unaff_DI))));
  DAT_6000_cdac = (char)lVar7;
  if (DAT_6000_cdac < '\x01') {
    DAT_6000_cdac = '\x01';
  }
  DAT_6000_cda7 = (((int)lVar5 - iVar2) * 3) / sVar1 >> 3;
  DAT_6000_cda9 = (int)lVar6 - (int)lVar4 >> 1;
  for (; param_1[iVar3] != '\0'; iVar3 = iVar3 + 1) {
    if (param_1[iVar3] != ' ') {
      lVar7 = (long)sVar1;
      iVar8 = (int)lVar4;
      lVar6 = N_LXMUL((long)iVar3,(long)((int)lVar5 - iVar2));
      lVar6 = F_LDIV(lVar6,lVar7);
      FUN_4000_0034(CONCAT11((char)((uint)(param_1[iVar3] * 2) >> 8),
                             *(undefined1 *)(param_1[iVar3] * 2 + 0x7da0)),iVar2 + (int)lVar6,iVar8)
      ;
    }
  }
  return;
}


// ==== FUN_4000_0884 @ 4000:0884 (size 56) callers: 

void __cdecl16far
FUN_4000_0884(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             undefined2 param_5,undefined4 param_6)

{
  DAT_6000_cda6 = DAT_6000_cda6 + '\x01';
  if ('\x0f' < DAT_6000_cda6) {
    DAT_6000_cda6 = '\x01';
  }
  FUN_4000_0699(param_1,param_2,param_3,param_4,param_5,param_6);
  return;
}


// ==== FUN_4000_08bc @ 4000:08bc (size 74) callers: FUN_2000_1485

void __cdecl16far FUN_4000_08bc(int param_1)

{
  int iVar1;
  
  for (iVar1 = 0; iVar1 < 3; iVar1 = iVar1 + 1) {
    ((undefined2 *)&DAT_6000_cdb1)[iVar1] = *(undefined2 *)(param_1 * 6 + iVar1 * 2 + 0x7eb2);
    ((undefined2 *)&DAT_6000_cdb7)[iVar1] = *(undefined2 *)(param_1 * 6 + iVar1 * 2 + 0x7eee);
  }
  return;
}


// ==== FUN_4000_0906 @ 4000:0906 (size 282) callers: print_text,print_text_clipped,read_string,FUN_4000_4016,draw_text_box

undefined2 __cdecl16far FUN_4000_0906(int param_1,int param_2,int param_3,char param_4,int param_5)

{
  char cVar1;
  undefined2 in_AX;
  uint uVar2;
  undefined1 uVar3;
  int iVar4;
  int local_4;
  
  if ((DAT_6000_cd94 == 0) && (param_5 != 0)) {
    param_5 = 1;
  }
  else if ((DAT_6000_00c5 == 1) && (param_5 != 0)) {
    param_5 = 0xf;
  }
  if (DAT_6000_7f78 != 0) {
    param_5._0_1_ = 0;
  }
  if (param_4 == ' ') {
    return in_AX;
  }
  cVar1 = *(char *)(param_4 + 0x7f0d);
  local_4 = 0;
  while( true ) {
    iVar4 = param_3 * 2;
    if (iVar4 == 0 || (param_3 < 0 != iVar4 < 0) != iVar4 < 0) break;
    for (iVar4 = 0; iVar4 < (int)((undefined2 *)&DAT_6000_cdb1)[param_3]; iVar4 = iVar4 + 1) {
      uVar2 = 1 << ((byte)(iVar4 % 0x10) & 0x1f);
      uVar3 = (undefined1)(uVar2 >> 8);
      if ((*(uint *)((int)*(undefined4 *)((undefined2 *)&DAT_6000_cdbd + param_3 * 2) +
                     (iVar4 / 0x10) * 2 +
                    ((int)cVar1 * ((undefined2 *)&DAT_6000_cdb7)[param_3] + local_4) *
                    ((int)((undefined2 *)&DAT_6000_cdb1)[param_3] / 0x10 + 1) * 2) & uVar2) == 0) {
        if (DAT_6000_7f78 != 0) {
          (*DAT_6000_9632)(0x4000,param_1 + iVar4,param_2 + local_4,CONCAT11(uVar3,0xf));
        }
      }
      else {
        (*DAT_6000_9632)(0x4000,param_1 + iVar4,param_2 + local_4,
                         CONCAT11(uVar3,(undefined1)param_5));
      }
    }
    local_4 = local_4 + 1;
  }
  return *(undefined2 *)(iVar4 + -0x6449);
}


// ==== load_font @ 4000:0a20 (size 244) callers: FUN_2000_1c23  // reads .FNT file n into the three glyph buffers

void __cdecl16far load_font(int param_1)

{
  undefined2 uVar1;
  void *f;
  short sVar2;
  int iVar3;
  int iVar4;
  int iVar5;
  
  if (DAT_6000_7f2a == 0) {
    for (iVar4 = 2; -1 < iVar4; iVar4 = iVar4 + -1) {
      iVar5 = *(int *)(iVar4 * 2 + 0x7f06) * (*(int *)(iVar4 * 2 + 0x7eca) / 0x10 + 1) * 0x5c;
      iVar3 = iVar5 >> 0xf;
      uVar1 = FUN_1000_254d(iVar5,iVar3);
      ((undefined2 *)&DAT_6000_cdbf)[iVar4 * 2] = iVar3;
      ((undefined2 *)&DAT_6000_cdbd)[iVar4 * 2] = uVar1;
    }
  }
  DAT_6000_7f2a = 1;
  f = fopen((char *)*(undefined2 *)(param_1 * 2 + 0x7e9e),(char *)0x81e5);
  for (iVar4 = 0; iVar4 < 3; iVar4 = iVar4 + 1) {
    uVar1 = ((undefined2 *)&DAT_6000_cdbd)[iVar4 * 2];
    *(undefined2 *)((int)(undefined4 *)&DAT_6000_cdc9 + iVar4 * 4 + 2) =
         ((undefined2 *)&DAT_6000_cdbf)[iVar4 * 2];
    *(undefined2 *)((undefined4 *)&DAT_6000_cdc9 + iVar4) = uVar1;
    for (iVar5 = 0;
        iVar3 = ((undefined2 *)&DAT_6000_cdb7)[iVar4] *
                ((int)((undefined2 *)&DAT_6000_cdb1)[iVar4] / 0x10 + 1) * 0x5c,
        iVar3 - iVar5 != 0 && iVar5 <= iVar3; iVar5 = iVar5 + 1) {
      sVar2 = fgetc(f);
      *(undefined1 *)((int)((undefined4 *)&DAT_6000_cdc9)[iVar4] + iVar5) = (char)sVar2;
    }
  }
  fclose(f);
  DAT_6000_7f2c = param_1;
  return;
}


// ==== print_text @ 4000:0b14 (size 507) callers: FUN_2000_03e7,FUN_2000_1d0b,FUN_2000_216b,FUN_2000_3085,financial_statement,bank,select_player,strike,monster_turn,FUN_2000_7421,FUN_2000_7756,FUN_2000_7b86,FUN_2000_8728,FUN_2000_892d,show_help,view_stats,FUN_2000_97b8,FUN_2000_9968,chute,FUN_2000_9ed9,dig_hole,FUN_2000_a8d7,movecontrol,FUN_2000_ea27,FUN_2000_f853,show_roll,roll_char,FUN_3000_5dc1,FUN_3000_6331,FUN_3000_7e52,FUN_3000_8b27,FUN_3000_9383,FUN_3000_9cd3,FUN_3000_9cfb,FUN_3000_b1d6,FUN_3000_b99e,FUN_3000_d51c,FUN_3000_e221,FUN_4000_3563,read_string,FUN_4000_4547  // one line of text at a scaled x,y in a colour

void __cdecl16far
print_text(int param_1,int param_2,int param_3,char *param_4,undefined1 param_5)

{
  int iVar1;
  undefined2 uVar2;
  uint uVar3;
  int iVar4;
  int iVar5;
  uint uVar6;
  long lVar7;
  float fVar8;
  long lVar9;
  
  iVar5 = 4;
  iVar1 = FUN_1000_44a1(param_4);
  if (iVar1 == 0) {
    return;
  }
  if ((-1 < DAT_6000_cd98) && ((0 < DAT_6000_cd98 || (0x2da < DAT_6000_cd96)))) {
    if (param_1 < 4) {
      param_1 = 4;
    }
    if ((-1 < DAT_6000_cd98) && ((0 < DAT_6000_cd98 || (800 < DAT_6000_cd96)))) {
      iVar5 = 3;
    }
    DAT_6000_cda6 = param_5;
    fVar8 = (float)iVar5;
    iVar5 = param_2 + (int)(0x44c / (long)*(int *)(param_3 * 2 + 0x7f70));
    iVar1 = *(int *)(param_3 * 2 + 0x7f6a);
    iVar4 = iVar1 >> 0xf;
    uVar6 = strlen(param_4);
    lVar7 = N_LXMUL(0x640,(ulong)uVar6);
    lVar7 = F_LDIV(lVar7,CONCAT22(iVar4,iVar1));
    FUN_4000_0699(param_4,param_1,param_2,param_1 + (int)lVar7,iVar5,fVar8);
    return;
  }
  lVar9 = 0x640;
  lVar7 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)param_1);
  lVar7 = F_LDIV(lVar7,lVar9);
  iVar1 = (int)lVar7;
  lVar9 = 0x4b0;
  lVar7 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)param_2);
  lVar7 = F_LDIV(lVar7,lVar9);
  uVar2 = (undefined2)lVar7;
  for (uVar6 = 0; uVar3 = strlen(param_4), uVar6 < uVar3; uVar6 = uVar6 + 1) {
    if (DAT_6000_cd94 == 4) {
      FUN_4000_0906(iVar1 + (((undefined2 *)&DAT_6000_cdb1)[param_3] +
                            ((int)((undefined2 *)&DAT_6000_cdb1)[param_3] >> 4)) * uVar6,uVar2,
                    param_3,param_4[uVar6]);
    }
    else if ((DAT_6000_cd94 < 8) || (DAT_6000_cd94 == 0xb)) {
      FUN_4000_0906(iVar1 + (((undefined2 *)&DAT_6000_cdb1)[param_3] +
                            ((int)((undefined2 *)&DAT_6000_cdb1)[param_3] >> 3)) * uVar6,uVar2,
                    param_3,param_4[uVar6]);
    }
    else {
      FUN_4000_0906(iVar1 + (((undefined2 *)&DAT_6000_cdb1)[param_3] +
                            ((int)((undefined2 *)&DAT_6000_cdb1)[param_3] >> 2)) * uVar6,uVar2,
                    param_3,param_4[uVar6]);
    }
  }
  return;
}


// ==== print_text_clipped @ 4000:0d0f (size 412) callers: FUN_2000_9968,FUN_2000_a9bd,FUN_2000_ea27,roll_char,FUN_3000_b1d6,FUN_4000_3a72,FUN_4000_4016,draw_text_box,FUN_4000_4347  // print_text with a right-hand limit

void __cdecl16far
print_text_clipped(int param_1,int param_2,int param_3,undefined2 param_4,char *param_5,
             undefined1 param_6)

{
  int iVar1;
  int iVar2;
  long lVar3;
  long lVar4;
  long lVar5;
  long b;
  
  iVar1 = FUN_1000_44a1(param_5);
  if (iVar1 == 0) {
    return;
  }
  if ((-1 < DAT_6000_cd98) && ((0 < DAT_6000_cd98 || (0x2da < DAT_6000_cd96)))) {
    DAT_6000_cda6 = param_6;
    strlen(param_5);
    FUN_4000_0699();
    return;
  }
  for (iVar1 = 0; param_5[iVar1] != '\0'; iVar1 = iVar1 + 1) {
  }
  lVar4 = 0x640;
  lVar3 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)param_1);
  lVar3 = F_LDIV(lVar3,lVar4);
  lVar5 = 0x4b0;
  lVar4 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)param_2);
  F_LDIV(lVar4,lVar5);
  lVar5 = 0x640;
  lVar4 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)param_3);
  lVar4 = F_LDIV(lVar4,lVar5);
  for (iVar2 = 0; iVar2 < iVar1; iVar2 = iVar2 + 1) {
    b = (long)iVar1;
    lVar5 = N_LXMUL((long)((int)lVar4 - (int)lVar3),(long)iVar2);
    F_LDIV(lVar5,b);
    FUN_4000_0906();
  }
  return;
}


// ==== FUN_4000_0eab @ 4000:0eab (size 54) callers: clear_screen

void __cdecl16far
FUN_4000_0eab(undefined2 param_1,int param_2,undefined2 param_3,int param_4,undefined1 param_5)

{
  int iVar1;
  
  iVar1 = param_2;
  if (param_4 < param_2) {
    iVar1 = param_4;
    param_4 = param_2;
  }
  for (; iVar1 <= param_4; iVar1 = iVar1 + 1) {
    (*DAT_6000_962a)(0x4000,param_1,iVar1,param_3,iVar1,param_5);
  }
  return;
}


// ==== FUN_4000_0ee1 @ 4000:0ee1 (size 44) callers: FUN_4000_0f0d

void __cdecl16far FUN_4000_0ee1(undefined1 param_1)

{
  undefined1 local_12;
  undefined1 local_11;
  undefined1 local_10;
  
  local_12 = 5;
  local_11 = 0x6f;
  local_10 = param_1;
  FUN_1000_2a03(0x10,&local_12,&local_12);
  return;
}


// ==== FUN_4000_0f0d @ 4000:0f0d (size 109) callers: quit,FUN_2000_1485,load_world_pic,select_player,FUN_2000_7b86,FUN_3000_8235

void __cdecl16far FUN_4000_0f0d(char *param_1)

{
  undefined2 in_AX;
  undefined1 uVar1;
  undefined1 extraout_AH;
  char *local_12;
  char *local_10;
  
  uVar1 = (undefined1)((uint)in_AX >> 8);
  if ((DAT_6000_cd94 == 10) || (DAT_6000_cd94 == 0xb)) {
    FUN_2000_1ac1();
    uVar1 = extraout_AH;
  }
  if ((int)param_1 < 0x101) {
    if (((param_1 == (char *)0x62) || (param_1 == (char *)0x65)) && (DAT_6000_9636 == 4)) {
      FUN_4000_0ee1(CONCAT11(uVar1,param_1._0_1_));
      return;
    }
    local_12 = param_1;
  }
  else {
    local_12 = (char *)s_SHOULD_CURE_YOURSELF_WITH_6000_4efb + 7;
    local_10 = param_1;
  }
  FUN_1000_2a03(0x10,&local_12,&local_12);
  return;
}


// ==== FUN_4000_0f7a @ 4000:0f7a (size 87) callers: FUN_2000_1b29,FUN_3000_6a84,FUN_4000_10ee

void __cdecl16far FUN_4000_0f7a(undefined1 param_1,undefined1 param_2)

{
  undefined1 local_12;
  undefined1 local_11;
  undefined1 local_10;
  undefined1 local_f;
  
  if (DAT_6000_00c5 == 1) {
    return;
  }
  if ((DAT_6000_cdd5 != 0x100) && (DAT_6000_cd94 < 6)) {
    if (DAT_6000_cd94 < 2) {
      return;
    }
    local_10 = param_1;
    local_f = param_2;
    local_12 = 0;
    local_11 = 0x10;
    FUN_1000_2a03(0x10,&local_12,&local_12);
  }
  return;
}


// ==== FUN_4000_0fd1 @ 4000:0fd1 (size 62) callers: 

void __cdecl16far
FUN_4000_0fd1(undefined2 param_1,undefined1 param_2,undefined1 param_3,undefined1 param_4)

{
  undefined1 local_12;
  undefined1 local_11;
  undefined2 local_10;
  undefined1 local_e;
  undefined1 local_d;
  undefined1 local_b;
  
  local_12 = 0x10;
  local_11 = 0x10;
  local_10 = param_1;
  local_b = param_2;
  local_d = param_3;
  local_e = param_4;
  FUN_1000_2a03(0x10,&local_12,&local_12);
  return;
}


// ==== FUN_4000_100f @ 4000:100f (size 142) callers: FUN_2000_1aca,FUN_3000_66e9,FUN_4000_10ee

void __cdecl16far FUN_4000_100f(void)

{
  long lVar1;
  long b;
  undefined1 local_1e;
  undefined1 local_1d;
  undefined2 local_1c;
  undefined2 local_1a;
  undefined1 *local_18;
  undefined1 *local_e;
  undefined2 local_c;
  undefined2 local_a [4];
  
  if ((DAT_6000_cd94 != 10) && (DAT_6000_cd94 != 0xb)) {
    if (DAT_6000_00c5 == 1) {
      return;
    }
    local_c = 0x6000;
    local_e = (undefined1 *)&DAT_6000_cdd7;
    local_1d = 0x10;
    local_1e = 0x12;
    local_1c = 0;
    local_1a = 0x100;
    b = 0x100;
    lVar1 = F_LDIV(0x6000cdd7,0x100);
    lVar1 = F_LDIV(lVar1,b);
    local_a[0] = (undefined2)lVar1;
    local_18 = local_e;
    FUN_1000_2a2b(0x10,&local_1e,&local_1e,local_a);
    return;
  }
  FUN_2000_0269();
  return;
}


// ==== FUN_4000_109d @ 4000:109d (size 81) callers: FUN_4000_10ee

void __cdecl16far FUN_4000_109d(void)

{
  int iVar1;
  
  for (iVar1 = 1; iVar1 < 0x100; iVar1 = iVar1 + 1) {
    ((undefined1 *)&DAT_6000_cdd7)[iVar1 * 3] = '?' - (char)(((iVar1 * 3) / 4) % 0x3f);
    ((undefined1 *)&DAT_6000_cdd8)[iVar1 * 3] = (char)(iVar1 / 4);
    ((undefined1 *)&DAT_6000_cdd9)[iVar1 * 3] = 0;
  }
  return;
}


// ==== FUN_4000_10ee @ 4000:10ee (size 2985) callers: game_disk_prompt,main,enter_level,movecontrol,FUN_3000_8235,clear_screen

int __cdecl16far FUN_4000_10ee(void)

{
  undefined1 extraout_AH;
  int iVar1;
  byte extraout_AH_00;
  undefined1 extraout_AH_01;
  undefined1 extraout_AH_02;
  undefined1 uVar2;
  undefined1 extraout_AH_03;
  undefined1 extraout_AH_04;
  undefined1 extraout_AH_05;
  undefined1 extraout_AH_06;
  undefined1 extraout_AH_07;
  undefined1 extraout_AH_08;
  undefined1 extraout_AH_09;
  undefined1 extraout_AH_10;
  undefined1 extraout_AH_11;
  undefined1 extraout_AH_12;
  undefined1 extraout_AH_13;
  undefined1 extraout_AH_14;
  undefined1 extraout_AH_15;
  char cVar3;
  uint local_4;
  
  if (DAT_6000_00c5 == 1) {
    FUN_3000_66b7(1,7);
    iVar1 = FUN_3000_66b7(CONCAT11(extraout_AH,0xe),CONCAT11(extraout_AH,0x35));
    return iVar1;
  }
  if ((DAT_6000_cd94 < 6) && (DAT_6000_cdd5 != 0x100)) {
    if (DAT_6000_00c5 == 1) {
      FUN_4000_0f7a(1,0x3f);
      uVar2 = extraout_AH_01;
    }
    else {
      FUN_4000_0f7a(1,9);
      uVar2 = extraout_AH_02;
    }
    FUN_4000_0f7a(CONCAT11(uVar2,2),CONCAT11(uVar2,0x1b));
    FUN_4000_0f7a(CONCAT11(extraout_AH_03,3),CONCAT11(extraout_AH_03,0x2b));
    FUN_4000_0f7a(CONCAT11(extraout_AH_04,4),CONCAT11(extraout_AH_04,0x3e));
    FUN_4000_0f7a(CONCAT11(extraout_AH_05,5),CONCAT11(extraout_AH_05,0x34));
    FUN_4000_0f7a(CONCAT11(extraout_AH_06,6),CONCAT11(extraout_AH_06,0x24));
    FUN_4000_0f7a(CONCAT11(extraout_AH_07,7),CONCAT11(extraout_AH_07,0x26));
    FUN_4000_0f7a(CONCAT11(extraout_AH_08,8),CONCAT11(extraout_AH_08,0x12));
    FUN_4000_0f7a(CONCAT11(extraout_AH_09,9),CONCAT11(extraout_AH_09,2));
    FUN_4000_0f7a(CONCAT11(extraout_AH_10,10),CONCAT11(extraout_AH_10,4));
    FUN_4000_0f7a(CONCAT11(extraout_AH_11,0xb),CONCAT11(extraout_AH_11,0x10));
    FUN_4000_0f7a(CONCAT11(extraout_AH_12,0xc),CONCAT11(extraout_AH_12,0x20));
    FUN_4000_0f7a(CONCAT11(extraout_AH_13,0xd),CONCAT11(extraout_AH_13,0x38));
    FUN_4000_0f7a(CONCAT11(extraout_AH_14,0xe),CONCAT11(extraout_AH_14,7));
    iVar1 = FUN_4000_0f7a(CONCAT11(extraout_AH_15,0xf),CONCAT11(extraout_AH_15,0x3f));
  }
  else {
    for (local_4 = 3; (int)local_4 < 0x300; local_4 = local_4 + 1) {
      ((undefined1 *)&DAT_6000_cdd7)[local_4] = 0;
    }
    FUN_4000_109d();
    if (DAT_6000_00c5 == 1) {
      DAT_6000_cdda = 0x3f;
      DAT_6000_cddb = 0x3f;
      DAT_6000_cddc = 0x3f;
    }
    else {
      DAT_6000_cdda = 0;
      DAT_6000_cddb = 0;
      DAT_6000_cddc = 0x26;
    }
    DAT_6000_cddd = 0;
    DAT_6000_cdde = 0;
    DAT_6000_cddf = 0x3f;
    DAT_6000_cde0 = 0x14;
    DAT_6000_cde1 = DAT_6000_7f7c;
    DAT_6000_cde2 = 0x3f;
    DAT_6000_cde3 = 0x3f;
    DAT_6000_cde4 = 0x3f;
    DAT_6000_cde5 = 0x14;
    DAT_6000_9be6 = 0xd9;
    DAT_6000_cde7 = 0x14;
    DAT_6000_cde8 = 10;
    DAT_6000_cde9 = 0x3f;
    DAT_6000_cdea = 0;
    DAT_6000_cdeb = 10;
    DAT_6000_cdec = 0x3f;
    DAT_6000_cded = 0x2d;
    DAT_6000_cdee = 0;
    DAT_6000_cdef = 0;
    DAT_6000_cdf0 = 0x3f;
    DAT_6000_cdf1 = 0;
    DAT_6000_cdf2 = 0;
    DAT_6000_cdf3 = DAT_6000_7f7c;
    DAT_6000_cdf4 = 0;
    DAT_6000_cdf5 = 0x1c;
    DAT_6000_cdf6 = 0;
    DAT_6000_cdf7 = 0;
    DAT_6000_cdf8 = 0;
    DAT_6000_cdf9 = 0x1c;
    DAT_6000_cdfa = 0;
    DAT_6000_cdfb = 0x10;
    DAT_6000_cdfc = 0;
    DAT_6000_cdfd = 0;
    DAT_6000_cdfe = 0xd;
    DAT_6000_cdff = 0xd;
    DAT_6000_ce00 = 0xd;
    DAT_6000_ce01 = 0x2a;
    DAT_6000_ce02 = 0x2a;
    DAT_6000_ce03 = 0x2a;
    DAT_6000_ce04 = 0x3f;
    DAT_6000_ce05 = 0x3f;
    DAT_6000_ce06 = 0x3f;
    iVar1 = FUN_3000_66b7((uint)extraout_AH_00 << 8,(uint)extraout_AH_00 << 8);
    for (local_4 = 0; (int)local_4 < 0x10; local_4 = local_4 + 1) {
      iVar1 = FUN_3000_66b7(local_4 & 0xff,local_4 & 0xff);
    }
  }
  if (DAT_6000_cdd5 == 0x100) {
    iVar1 = DAT_6000_cd26 / 0xb;
    switch(DAT_6000_cd26 % 0xb) {
    case 0:
      DAT_6000_ce07 = 0xf;
      DAT_6000_ce08 = 7;
      DAT_6000_ce09 = 7;
      DAT_6000_ce0a = 0x14;
      DAT_6000_ce0b = 0xc;
      DAT_6000_ce0c = 0xc;
      DAT_6000_ce0d = 7;
      DAT_6000_ce0e = 0xf;
      DAT_6000_ce0f = 7;
      DAT_6000_ce10 = 0xc;
      DAT_6000_ce11 = 0x14;
      DAT_6000_ce12 = 0xc;
      DAT_6000_ce13 = 7;
      DAT_6000_ce14 = 7;
      DAT_6000_ce15 = 0xf;
      DAT_6000_ce16 = 0xc;
      DAT_6000_ce17 = 0xc;
      DAT_6000_ce18 = 0x14;
      DAT_6000_ce19 = 7;
      DAT_6000_ce1a = 7;
      DAT_6000_ce1b = 0;
      DAT_6000_ce1c = 0xc;
      DAT_6000_ce1d = 0xc;
      DAT_6000_ce1e = 0;
      DAT_6000_ce1f = 0x12;
      DAT_6000_ce20 = 0x12;
      DAT_6000_ce21 = 0;
      DAT_6000_ce22 = 0;
      DAT_6000_ce23 = 0xc;
      DAT_6000_ce24 = 0;
      DAT_6000_ce25 = 0;
      DAT_6000_ce26 = 0x14;
      DAT_6000_ce27 = 0;
      DAT_6000_ce28 = 7;
      DAT_6000_ce29 = 7;
      DAT_6000_ce2a = 7;
      DAT_6000_ce2b = 0xc;
      DAT_6000_ce2c = 0xc;
      DAT_6000_ce2d = 0xc;
      DAT_6000_ce2f = 0x11;
      DAT_6000_ce2e = 0x11;
      DAT_6000_ce31 = 0x16;
      DAT_6000_ce32 = 0x16;
      DAT_6000_ce33 = 0x16;
      DAT_6000_ce34 = 0x1b;
      DAT_6000_ce35 = 0x1b;
      DAT_6000_ce36 = 0x1b;
      break;
    case 1:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        cVar3 = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = cVar3;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = cVar3;
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = cVar3;
        cVar3 = (char)local_4 * -8 + '<';
        iVar1 = CONCAT11((char)(local_4 * 6 >> 8),cVar3);
        ((undefined1 *)&DAT_6000_ce0c)[local_4 * 6] = cVar3;
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = cVar3;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = cVar3;
      }
      break;
    case 2:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = 0;
        iVar1 = local_4 * 6;
        ((undefined1 *)&DAT_6000_ce0c)[iVar1] = 0;
      }
      break;
    case 3:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = (char)local_4 << 3;
        iVar1 = local_4 * 6;
        ((undefined1 *)&DAT_6000_ce0c)[iVar1] = 0;
      }
      break;
    case 4:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = (char)local_4 << 3;
        iVar1 = local_4 * 6;
        ((undefined1 *)&DAT_6000_ce0c)[iVar1] = 0;
      }
      break;
    case 5:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = 0;
        iVar1 = local_4 * 6;
        ((undefined1 *)&DAT_6000_ce0c)[iVar1] = (char)local_4 << 3;
      }
      break;
    case 6:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = 0;
        iVar1 = local_4 * 6;
        ((undefined1 *)&DAT_6000_ce0c)[iVar1] = 0;
      }
      break;
    case 7:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = 0;
        iVar1 = local_4 * 6;
        ((undefined1 *)&DAT_6000_ce0c)[iVar1] = (char)local_4 << 3;
      }
      break;
    case 8:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = (char)local_4 * -8 + '<';
        iVar1 = local_4 * 6;
        ((undefined1 *)&DAT_6000_ce0c)[iVar1] = 0;
      }
      break;
    case 9:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = (char)local_4 * -8 + '<';
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = 0;
        iVar1 = local_4 * 6;
        ((undefined1 *)&DAT_6000_ce0c)[iVar1] = 0;
      }
      break;
    case 10:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = (char)local_4 * -8 + '<';
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = (char)local_4 * -8 + '<';
        iVar1 = local_4 * 6;
        ((undefined1 *)&DAT_6000_ce0c)[iVar1] = 0;
      }
      break;
    case 0xb:
      for (local_4 = 0; (int)local_4 < 8; local_4 = local_4 + 1) {
        ((undefined1 *)&DAT_6000_ce07)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce08)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce09)[local_4 * 6] = (char)local_4 << 3;
        ((undefined1 *)&DAT_6000_ce0a)[local_4 * 6] = 0;
        ((undefined1 *)&DAT_6000_ce0b)[local_4 * 6] = 0;
        cVar3 = (char)local_4 * -8 + '<';
        iVar1 = CONCAT11((char)(local_4 * 6 >> 8),cVar3);
        ((undefined1 *)&DAT_6000_ce0c)[local_4 * 6] = cVar3;
      }
    }
  }
  if (DAT_6000_cdd5 == 0x100) {
    DAT_6000_ce37 = 0;
    DAT_6000_ce38 = 0;
    DAT_6000_ce39 = 0;
    DAT_6000_ce3a = 0x3f;
    DAT_6000_ce3b = 0x28;
    DAT_6000_ce3c = 0x14;
    DAT_6000_ce3d = 0x3f;
    DAT_6000_ce3e = 0x32;
    DAT_6000_ce3f = 0x1e;
    DAT_6000_ce40 = 0x3f;
    DAT_6000_ce41 = 0x3c;
    DAT_6000_ce42 = 0x28;
    DAT_6000_ce43 = 0xb;
    DAT_6000_ce44 = 0xb;
    DAT_6000_ce45 = 0;
    DAT_6000_ce46 = 0x18;
    DAT_6000_ce47 = 0x18;
    DAT_6000_ce48 = 0;
    DAT_6000_ce49 = 0x25;
    DAT_6000_ce4a = 0x25;
    DAT_6000_ce4b = 0;
    DAT_6000_ce4c = 0x32;
    DAT_6000_ce4d = 0x32;
    DAT_6000_ce4e = 0;
    DAT_6000_ce4f = 0x3f;
    DAT_6000_ce50 = 0x3f;
    DAT_6000_ce51 = 0;
    DAT_6000_ce52 = 0x38;
    DAT_6000_ce53 = 0x2d;
    DAT_6000_ce54 = 0;
    DAT_6000_ce55 = 0x31;
    DAT_6000_ce56 = 0x1e;
    DAT_6000_ce57 = 0;
    DAT_6000_ce58 = 0x2b;
    DAT_6000_ce59 = 0xf;
    DAT_6000_ce5a = 0;
    DAT_6000_ce5b = 0;
    DAT_6000_ce5c = 0x28;
    DAT_6000_ce5d = 0;
    DAT_6000_ce5f = 0x25;
    DAT_6000_ce5e = 0x25;
    DAT_6000_ce61 = 0x32;
    DAT_6000_ce62 = 0x32;
    DAT_6000_ce63 = 0x32;
    DAT_6000_ce64 = 0x3f;
    DAT_6000_ce65 = 0x3f;
    DAT_6000_ce66 = 0x3f;
    iVar1 = DAT_6000_cd26 / 7;
    switch(DAT_6000_cd26 % 7) {
    case 0:
      for (local_4 = 0x90; (int)local_4 < 0xc0; local_4 = local_4 + 1) {
        iVar1 = (int)(local_4 + -0x82) / 2;
        ((undefined1 *)&DAT_6000_cdd7)[local_4] = (char)iVar1;
      }
      break;
    case 1:
      for (local_4 = 0x90; (int)local_4 < 0xc0; local_4 = local_4 + 2) {
        ((undefined1 *)&DAT_6000_cdd7)[local_4] = (char)((int)(local_4 + -0x82) / 2);
        iVar1 = (int)(0xc2 - local_4) / 2;
        ((undefined1 *)&DAT_6000_cdd8)[local_4] = (char)iVar1;
      }
      break;
    case 2:
      for (local_4 = 0x90; (int)local_4 < 0xc0; local_4 = local_4 + 3) {
        ((undefined1 *)&DAT_6000_cdd7)[local_4] = (char)((int)(local_4 + -0x82) / 2);
        iVar1 = (int)(0xc2 - local_4) / 2;
        ((undefined1 *)&DAT_6000_cdd8)[local_4] = (char)iVar1;
      }
      break;
    case 3:
      for (local_4 = 0x90; (int)local_4 < 0xc0; local_4 = local_4 + 3) {
        ((undefined1 *)&DAT_6000_cdd7)[local_4] = (char)((int)(local_4 + -0x82) / 2);
        iVar1 = (int)(local_4 + -0x82) / 2;
        ((undefined1 *)&DAT_6000_cdd8)[local_4] = (char)iVar1;
      }
      break;
    case 4:
      for (local_4 = 0x90; (int)local_4 < 0xc0; local_4 = local_4 + 3) {
        iVar1 = (int)(local_4 + -0x82) / 2;
        ((undefined1 *)&DAT_6000_cdd7)[local_4] = (char)iVar1;
      }
      break;
    case 5:
      for (local_4 = 0x90; (int)local_4 < 0xc0; local_4 = local_4 + 3) {
        iVar1 = (int)(local_4 + -0x82) / 2;
        ((undefined1 *)&DAT_6000_cdd8)[local_4] = (char)iVar1;
      }
      break;
    case 6:
      for (local_4 = 0x90; (int)local_4 < 0xc0; local_4 = local_4 + 3) {
        ((undefined1 *)&DAT_6000_cdd7)[local_4] = (char)((int)(local_4 + -0x82) / 2);
        ((undefined1 *)&DAT_6000_cdd8)[local_4] = (char)((int)(local_4 + -0x82) / 2);
        iVar1 = (int)(0xc2 - local_4) / 2;
        ((undefined1 *)&DAT_6000_cdd9)[local_4] = (char)iVar1;
      }
    }
  }
  if ((5 < DAT_6000_cd94) || (DAT_6000_cdd5 == 0x100)) {
    iVar1 = FUN_4000_100f();
  }
  return iVar1;
}


// ==== FUN_4000_1cbd @ 4000:1cbd (size 78) callers: FUN_4000_20d2,FUN_4000_22a3

void __cdecl16far FUN_4000_1cbd(int param_1,undefined2 param_2,int param_3,undefined1 param_4)

{
  undefined1 extraout_AH;
  
  if (0x3fe < param_1 + param_3) {
    param_3 = 0x3fe - param_1;
  }
  FUN_2000_006a(0x16);
  (*DAT_6000_962a)(0x2000,param_1,param_2,param_1 + param_3,param_2,CONCAT11(extraout_AH,param_4));
  FUN_2000_006a(2);
  return;
}


// ==== FUN_4000_1d0b @ 4000:1d0b (size 64) callers: FUN_4000_2109,FUN_4000_22a3

void __cdecl16far FUN_4000_1d0b(int param_1,int param_2,int param_3,byte param_4)

{
  undefined4 local_6;
  
  local_6 = (byte *)CONCAT22(0xa000,(byte *)(param_2 * 0x140 + param_1));
  for (; -1 < param_3; param_3 = param_3 + -1) {
    *local_6 = *local_6 ^ param_4;
    local_6 = (byte *)CONCAT22(local_6._2_2_,(byte *)local_6 + 1);
  }
  return;
}


// ==== FUN_4000_1d4b @ 4000:1d4b (size 57) callers: FUN_4000_2140,FUN_4000_22a3

void __cdecl16far FUN_4000_1d4b(int param_1,undefined2 param_2,int param_3,byte param_4)

{
  byte bVar1;
  
  for (; -1 < param_3; param_3 = param_3 + -1) {
    bVar1 = FUN_5110_006f(param_1 + param_3,param_2);
    (*DAT_6000_9632)((char *)s_GET_A_CURE_DISEASE_AT_A_6000_510f + 1,param_1 + param_3,param_2,
                     bVar1 ^ param_4);
  }
  return;
}


// ==== FUN_4000_1d84 @ 4000:1d84 (size 110) callers: fill_rect

char * __cdecl16far FUN_4000_1d84(int param_1,int param_2,int param_3,int param_4,char param_5)

{
  uint uVar1;
  int iVar2;
  
  iVar2 = 0x40;
  do {
    uVar1 = in(0x9ae8);
  } while ((uVar1 & 0x200) != 0);
  out(0xbae8,0x27);
  out(0xa6e8,(int)param_5);
  out(0xbee8,0xa000);
  out(0x82e8,param_2);
  out(0x86e8,param_1);
  out(0x96e8,(param_3 - param_1) + -1);
  out(0xbee8,(param_4 - param_2) + -1);
  if (param_2 < param_4) {
    iVar2 = 0x60;
  }
  if (param_1 < param_3) {
    iVar2 = iVar2 + 0x80;
  }
  out(0x9ae8,(char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 0x14 + iVar2);
  return (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 0x14 + iVar2;
}


// ==== FUN_4000_1df2 @ 4000:1df2 (size 110) callers: FUN_4000_1ebd

char * __cdecl16far FUN_4000_1df2(int param_1,undefined2 param_2,int param_3,char param_4)

{
  uint uVar1;
  int iVar2;
  int iVar3;
  
  iVar3 = 0x60;
  iVar2 = param_1;
  if (param_3 < param_1) {
    iVar2 = param_3;
    param_3 = param_1;
  }
  do {
    uVar1 = in(0x9ae8);
  } while ((uVar1 & 0x200) != 0);
  out(0xbae8,0x27);
  out(0xa6e8,(int)param_4);
  out(0xbee8,0xa000);
  out(0x82e8,param_2);
  out(0x86e8,iVar2);
  out(0x96e8,param_3 - iVar2);
  out(0xbee8,0);
  if (iVar2 < param_3) {
    iVar3 = 0xe0;
  }
  out(0x9ae8,(char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 0x14 + iVar3);
  return (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 0x14 + iVar3;
}


// ==== FUN_4000_1e60 @ 4000:1e60 (size 93) callers: FUN_4000_1ebd

char * __cdecl16far FUN_4000_1e60(undefined2 param_1,int param_2,int param_3,char param_4)

{
  uint uVar1;
  int iVar2;
  
  iVar2 = 0xc0;
  do {
    uVar1 = in(0x9ae8);
  } while ((uVar1 & 0x200) != 0);
  out(0xbae8,0x27);
  out(0xa6e8,(int)param_4);
  out(0xbee8,0xa000);
  out(0x82e8,param_2);
  out(0x86e8,param_1);
  out(0x96e8,0);
  out(0xbee8,(param_3 - param_2) + -1);
  if (param_2 < param_3) {
    iVar2 = 0xe0;
  }
  out(0x9ae8,(char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 0x14 + iVar2);
  return (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 0x14 + iVar2;
}


// ==== FUN_4000_1ebd @ 4000:1ebd (size 355) callers: 

char * __cdecl16far FUN_4000_1ebd(int param_1,int param_2,int param_3,int param_4,char param_5)

{
  byte bVar1;
  undefined2 in_AX;
  undefined1 uVar2;
  undefined1 extraout_AH;
  uint uVar3;
  uint uVar4;
  int local_8;
  int local_6;
  int local_4;
  
  uVar2 = (undefined1)((uint)in_AX >> 8);
  local_8 = 0;
  if (param_2 == param_4) {
    FUN_4000_1df2(param_1,param_2,param_3,CONCAT11(uVar2,param_5));
    uVar2 = extraout_AH;
  }
  if (param_1 == param_3) {
    FUN_4000_1e60(param_1,param_2,param_4,CONCAT11(uVar2,param_5));
  }
  uVar3 = param_4 - param_2 >> 0xf;
  uVar4 = param_3 - param_1 >> 0xf;
  if ((int)((param_3 - param_1 ^ uVar4) - uVar4) < (int)((param_4 - param_2 ^ uVar3) - uVar3)) {
    local_8 = 0x40;
  }
  uVar3 = param_3 - param_1 >> 0xf;
  local_6 = (param_3 - param_1 ^ uVar3) - uVar3;
  uVar3 = param_4 - param_2 >> 0xf;
  if (local_6 < (int)((param_4 - param_2 ^ uVar3) - uVar3)) {
    uVar3 = param_4 - param_2 >> 0xf;
    local_6 = (param_4 - param_2 ^ uVar3) - uVar3;
  }
  uVar3 = param_3 - param_1 >> 0xf;
  local_4 = (param_3 - param_1 ^ uVar3) - uVar3;
  uVar3 = param_4 - param_2 >> 0xf;
  if ((int)((param_4 - param_2 ^ uVar3) - uVar3) < local_4) {
    uVar3 = param_4 - param_2 >> 0xf;
    local_4 = (param_4 - param_2 ^ uVar3) - uVar3;
  }
  do {
    uVar3 = in(0x9ae8);
  } while ((uVar3 & 0x200) != 0);
  out(0xbae8,0x27);
  out(0xa6e8,(int)param_5);
  out(0xbee8,0xa000);
  do {
    bVar1 = in(0x9ae8);
  } while ((bVar1 & 0x40) != 0);
  out(0x82e8,param_2);
  out(0x86e8,param_1);
  out(0x96e8,local_6);
  out(0x8ee8,(local_4 - local_6) * 2);
  out(0x8ae8,local_4 << 1);
  out(0x92e8,local_4 * 2 - local_6);
  if (param_2 < param_4) {
    local_8 = local_8 + 0x80;
  }
  if (param_1 < param_3) {
    local_8 = local_8 + 0x20;
  }
  out(0x9ae8,(char *)s_2__CURE_SERIOUS_WOUNDS_200_JP_6000_200d + 6 + local_8);
  return (char *)s_2__CURE_SERIOUS_WOUNDS_200_JP_6000_200d + 6 + local_8;
}


// ==== fill_rect @ 4000:2020 (size 77) callers: FUN_2000_1d0b,FUN_2000_1fbd,FUN_2000_216b,FUN_2000_22ff,FUN_2000_3085,financial_statement,strike,monster_turn,FUN_2000_726f,FUN_2000_7421,FUN_2000_7756,FUN_2000_7c8a,FUN_2000_7d00,FUN_2000_8728,FUN_2000_8aab,FUN_2000_8f95,show_help,FUN_2000_9968,chute,FUN_2000_9ed9,dig_hole,FUN_2000_a57e,FUN_2000_a9bd,movecontrol,FUN_2000_ea27,FUN_2000_f853,FUN_3000_1a08,roll_char,FUN_3000_6b5b,FUN_3000_71db,FUN_3000_77b2,FUN_3000_7af1,FUN_3000_7cb2,FUN_3000_8235,FUN_3000_8b27,FUN_3000_9383,FUN_3000_a047,draw_map_square,FUN_3000_b066,FUN_3000_b1d6,FUN_3000_b99e,FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_bdb5,FUN_3000_d51c,FUN_3000_e221,FUN_4000_3a72  // fills a rectangle with a colour

void __cdecl16far
fill_rect(undefined2 param_1,int param_2,undefined2 param_3,int param_4,undefined1 param_5)

{
  if ((DAT_6000_cd94 == 9) && (DAT_6000_9636 == 4)) {
    FUN_4000_1d84(param_1,param_2,param_3,param_4,param_5);
  }
  else {
    for (; param_2 < param_4; param_2 = param_2 + 1) {
      (*DAT_6000_962a)(0x4000,param_1,param_2,param_3,param_2,param_5);
    }
  }
  return;
}


// ==== FUN_4000_206d @ 4000:206d (size 45) callers: 

void __cdecl16far
FUN_4000_206d(undefined2 param_1,int param_2,undefined2 param_3,int param_4,undefined1 param_5)

{
  int iVar1;
  
  for (iVar1 = param_2; iVar1 <= param_2 + param_4; iVar1 = iVar1 + 1) {
    (*DAT_6000_962a)(0x4000,param_1,iVar1,param_3,iVar1,
                     CONCAT11((char)((uint)(param_2 + param_4) >> 8),param_5));
  }
  return;
}


// ==== FUN_4000_209a @ 4000:209a (size 56) callers: 

void __cdecl16far FUN_4000_209a(int param_1,int param_2)

{
  int iVar1;
  int iVar2;
  
  for (iVar2 = param_2 >> 4; iVar1 = (param_2 >> 4) + DAT_6000_d0de, iVar2 <= iVar1;
      iVar2 = iVar2 + 1) {
    FUN_2000_12a6(param_1 >> 4,iVar2,DAT_6000_d0dc,CONCAT11((char)((uint)iVar1 >> 8),DAT_6000_7f86))
    ;
  }
  return;
}


// ==== FUN_4000_20d2 @ 4000:20d2 (size 55) callers: 

void __cdecl16far FUN_4000_20d2(int param_1,int param_2)

{
  int iVar1;
  int iVar2;
  
  for (iVar2 = param_2 >> 4; iVar1 = (param_2 >> 4) + DAT_6000_d0de, iVar2 <= iVar1;
      iVar2 = iVar2 + 1) {
    FUN_4000_1cbd(param_1 >> 4,iVar2,DAT_6000_d0dc,CONCAT11((char)((uint)iVar1 >> 8),DAT_6000_7f86))
    ;
  }
  return;
}


// ==== FUN_4000_2109 @ 4000:2109 (size 55) callers: 

void __cdecl16far FUN_4000_2109(int param_1,int param_2)

{
  int iVar1;
  int iVar2;
  
  for (iVar2 = param_2 >> 4; iVar1 = (param_2 >> 4) + DAT_6000_d0de, iVar2 <= iVar1;
      iVar2 = iVar2 + 1) {
    FUN_4000_1d0b(param_1 >> 4,iVar2,DAT_6000_d0dc,CONCAT11((char)((uint)iVar1 >> 8),DAT_6000_7f86))
    ;
  }
  return;
}


// ==== FUN_4000_2140 @ 4000:2140 (size 55) callers: 

void __cdecl16far FUN_4000_2140(int param_1,int param_2)

{
  int iVar1;
  int iVar2;
  
  for (iVar2 = param_2 >> 4; iVar1 = (param_2 >> 4) + DAT_6000_d0de, iVar2 <= iVar1;
      iVar2 = iVar2 + 1) {
    FUN_4000_1d4b(param_1 >> 4,iVar2,DAT_6000_d0dc,CONCAT11((char)((uint)iVar1 >> 8),DAT_6000_7f86))
    ;
  }
  return;
}


// ==== FUN_4000_2177 @ 4000:2177 (size 51) callers: 

void __cdecl16far FUN_4000_2177(int param_1,int param_2)

{
  FUN_5000_0ec7(param_1 >> 4,param_2 >> 4,(param_1 >> 4) + DAT_6000_d0dc,DAT_6000_d0de,2);
  return;
}


// ==== FUN_4000_21aa @ 4000:21aa (size 51) callers: 

void __cdecl16far FUN_4000_21aa(int param_1,int param_2)

{
  FUN_5000_0ff0(param_1 >> 4,param_2 >> 4,(param_1 >> 4) + DAT_6000_d0dc,DAT_6000_d0de,1);
  return;
}


// ==== FUN_4000_21dd @ 4000:21dd (size 46) callers: 

void __cdecl16far
FUN_4000_21dd(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             int param_5)

{
  int iVar1;
  
  iVar1 = 0;
  if (param_5 != 0) {
    iVar1 = param_5 % 3 + 1;
  }
  FUN_5000_0e2e(param_1,param_2,param_3,param_4,iVar1);
  return;
}


// ==== FUN_4000_220b @ 4000:220b (size 46) callers: 

void __cdecl16far
FUN_4000_220b(undefined2 param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             int param_5)

{
  int iVar1;
  
  iVar1 = 0;
  if (param_5 != 0) {
    iVar1 = param_5 % 3 + 1;
  }
  FUN_5000_0f65(param_1,param_2,param_3,param_4,iVar1);
  return;
}


// ==== FUN_4000_2239 @ 4000:2239 (size 48) callers: 

void __cdecl16far FUN_4000_2239(int param_1,int param_2)

{
  FUN_5000_0cca(param_1 >> 4,param_2 >> 4,(param_1 >> 4) + DAT_6000_d0dc,DAT_6000_d0de);
  return;
}


// ==== FUN_4000_2269 @ 4000:2269 (size 58) callers: 

void __cdecl16far FUN_4000_2269(int param_1,int param_2)

{
  uint uVar1;
  int iVar2;
  
  for (iVar2 = param_2 >> 4; uVar1 = (param_2 >> 4) + DAT_6000_d0de, iVar2 <= (int)uVar1;
      iVar2 = iVar2 + 1) {
    (*DAT_6000_962a)(0x4000,param_1 >> 4,iVar2,(param_1 >> 4) + DAT_6000_d0dc,iVar2,uVar1 & 0xff00);
  }
  return;
}


// ==== FUN_4000_22a3 @ 4000:22a3 (size 1675) callers: mouse_pick,FUN_4000_3381

void __cdecl16far FUN_4000_22a3(int param_1,int param_2,int param_3,int param_4)

{
  int iVar1;
  int iVar2;
  
  if (param_1 < 0) {
    param_1 = 0;
  }
  if (param_2 < 0) {
    param_2 = 0;
  }
  switch(DAT_6000_cd94) {
  case 0:
    FUN_5000_0ff0(param_1,param_2,param_3,param_4 - param_2,1);
    break;
  case 1:
    FUN_5000_0ec7(param_1,param_2,param_3,param_4 - param_2,2);
    break;
  case 2:
  case 5:
  case 6:
  case 7:
  case 8:
    FUN_5000_0cca(param_1,param_2,param_3,param_4 - param_2);
    break;
  case 3:
    for (iVar2 = param_2; iVar2 <= param_2 + (param_4 - param_2) / 10; iVar2 = iVar2 + 1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_4000_1d0b(param_1,iVar2,param_3 - param_1,
                    CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    for (iVar2 = param_2 + ((param_4 - param_2) * 9) / 10; iVar2 <= param_4; iVar2 = iVar2 + 1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_4000_1d0b(param_1,iVar2,param_3 - param_1,
                    CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    iVar2 = param_2 + (param_4 - param_2) / 10;
    while (iVar2 = iVar2 + 1, iVar2 < (param_4 - (param_4 - param_2) / 10) + -1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_4000_1d0b(param_1,iVar2,(param_3 - param_1) / 10,
                    CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    iVar2 = param_2 + (param_4 - param_2) / 10;
    while (iVar2 = iVar2 + 1, iVar2 < (param_4 - (param_4 - param_2) / 10) + -1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_4000_1d0b(param_1 + ((param_3 - param_1) * 9) / 10,iVar2,(param_3 - param_1) / 10,
                    CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    break;
  case 4:
    for (iVar2 = param_2; iVar2 <= param_2 + (param_4 - param_2) / 10; iVar2 = iVar2 + 1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_4000_1d4b(param_1,iVar2,param_3 - param_1,
                    CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    for (iVar2 = param_2 + ((param_4 - param_2) * 9) / 10; iVar2 <= param_4; iVar2 = iVar2 + 1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_4000_1d4b(param_1,iVar2,param_3 - param_1,
                    CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    iVar2 = param_2 + (param_4 - param_2) / 10;
    while (iVar2 = iVar2 + 1, iVar2 < (param_4 - (param_4 - param_2) / 10) + -1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_4000_1d4b(param_1,iVar2,(param_3 - param_1) / 10,
                    CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    iVar2 = param_2 + (param_4 - param_2) / 10;
    while (iVar2 = iVar2 + 1, iVar2 < (param_4 - (param_4 - param_2) / 10) + -1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_4000_1d4b(param_1 + ((param_3 - param_1) * 9) / 10,iVar2,(param_3 - param_1) / 10,
                    CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    break;
  case 9:
    for (iVar2 = param_2; iVar2 <= param_2 + 10; iVar2 = iVar2 + 1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_2000_12a6(param_1,iVar2,param_3 - param_1,
                    CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    for (iVar2 = param_4 + -10; iVar2 <= param_4; iVar2 = iVar2 + 1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_2000_12a6(param_1,iVar2,param_3 - param_1,
                    CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    for (iVar2 = param_2 + 10; iVar2 < param_4 + -10; iVar2 = iVar2 + 1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_2000_12a6(param_1,iVar2,10,CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    for (iVar2 = param_2 + 10; iVar2 < param_4 + -10; iVar2 = iVar2 + 1) {
      iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
      FUN_2000_12a6(param_3 + -10,iVar2,10,CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
    }
    break;
  case 10:
  case 0xb:
    iVar2 = param_2;
    if (param_4 - param_2 < 200) {
      for (; iVar2 <= param_2 + (param_4 - param_2) / 10; iVar2 = iVar2 + 1) {
        iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
        FUN_4000_1cbd(param_1,iVar2,param_3 - param_1,
                      CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
      }
      for (iVar2 = param_2 + ((param_4 - param_2) * 9) / 10; iVar2 <= param_4; iVar2 = iVar2 + 1) {
        iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
        FUN_4000_1cbd(param_1,iVar2,param_3 - param_1,
                      CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
      }
      iVar2 = param_2 + (param_4 - param_2) / 10;
      while (iVar2 = iVar2 + 1, iVar2 < (param_4 - (param_4 - param_2) / 10) + -1) {
        iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
        FUN_4000_1cbd(param_1,iVar2,(((param_3 - param_1) + param_4) - param_2) / 0x14,
                      CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
      }
      iVar2 = param_2 + (param_4 - param_2) / 10;
      while (iVar2 = iVar2 + 1, iVar2 < (param_4 - (param_4 - param_2) / 10) + -1) {
        iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
        FUN_4000_1cbd(param_3 - (((param_3 - param_1) + param_4) - param_2) / 0x14,iVar2,
                      (((param_3 - param_1) + param_4) - param_2) / 0x14,
                      CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
      }
    }
    else {
      for (; iVar2 <= param_2 + (param_4 - param_2 >> 4); iVar2 = iVar2 + 1) {
        iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
        FUN_4000_1cbd(param_1,iVar2,param_3 - param_1,
                      CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
      }
      for (iVar2 = param_2 + ((param_4 - param_2) * 0xf >> 4); iVar2 <= param_4; iVar2 = iVar2 + 1)
      {
        iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
        FUN_4000_1cbd(param_1,iVar2,param_3 - param_1,
                      CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
      }
      iVar2 = param_2 + (param_4 - param_2 >> 4);
      while (iVar2 = iVar2 + 1, iVar2 < (param_4 - (param_4 - param_2 >> 4)) + -1) {
        iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
        FUN_4000_1cbd(param_1,iVar2,param_4 - param_2 >> 4,
                      CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
      }
      iVar2 = param_2 + (param_4 - param_2 >> 4);
      while (iVar2 = iVar2 + 1, iVar2 < (param_4 - (param_4 - param_2 >> 4)) + -1) {
        iVar1 = ((iVar2 - param_2) % 0xc0) * DAT_6000_7f8b;
        FUN_4000_1cbd(param_3 - (param_4 - param_2 >> 4),iVar2,param_4 - param_2 >> 4,
                      CONCAT11((char)((uint)iVar1 >> 8),(char)iVar1 + '@'));
      }
    }
  }
  return;
}


// ==== FUN_4000_2bd7 @ 4000:2bd7 (size 229) callers: main

void __cdecl16far FUN_4000_2bd7(void)

{
  if (DAT_6000_cd94 == 3) {
    DAT_6000_d0e8 = (char *)0x4000;
    DAT_6000_d0e6 = (char *)s_5__CURE_DISEASE________500_JP_6000_2067 + 6;
    DAT_6000_d0ec = 0x4000;
    DAT_6000_d0ea = (char *)s_SILVER_STONES__6000_20f8 + 0x11;
  }
  if (DAT_6000_cd94 == 4) {
    DAT_6000_d0e8 = (char *)0x4000;
    DAT_6000_d0e6 = (char *)s_5__CURE_DISEASE________500_JP_6000_2067 + 6;
    DAT_6000_d0ec = 0x4000;
    DAT_6000_d0ea = (char *)s_JEWEL_STONES__6000_2140;
  }
  if (DAT_6000_cd94 == 9) {
    DAT_6000_d0e8 = (char *)0x4000;
    DAT_6000_d0e6 = (char *)s_5__CURE_DISEASE________500_JP_6000_2067 + 6;
    DAT_6000_d0ec = 0x4000;
    DAT_6000_d0ea = (char *)s_SORRY__CAN_T_BUY_ON_CREDIT_6000_209a;
  }
  if ((DAT_6000_cd94 == 10) || (DAT_6000_cd94 == 0xb)) {
    DAT_6000_d0e8 = (char *)0x4000;
    DAT_6000_d0e6 = (char *)s_5__CURE_DISEASE________500_JP_6000_2067 + 6;
    DAT_6000_d0ec = 0x4000;
    DAT_6000_d0ea = (char *)s_YOUR_FINANCIAL_STATEMENT__6000_20cc + 6;
  }
  if (DAT_6000_cdd5 == 0x10) {
    DAT_6000_d0e8 = (char *)s_YOU_SHOULD_GO_FIND_A_BANK__6000_4fee + 0x12;
    DAT_6000_d0e6 = (char *)0xd7b;
    DAT_6000_d0ec = 0x4000;
    DAT_6000_d0ea = (char *)s_FOR_YOUR_POSSESSIONS__6000_222c + 0xd;
  }
  if (DAT_6000_cdd5 == 4) {
    DAT_6000_d0e8 = (char *)0x4000;
    DAT_6000_d0e6 = (char *)s_COST_10_JEWEL_PIECES__PLEASE_6000_21c6 + 0x17;
    DAT_6000_d0ec = 0x4000;
    DAT_6000_d0ea = (char *)s_WELCOME_TO_THE_FLEA_BAG_INN_6000_2176 + 1;
  }
  if (DAT_6000_cdd5 == 2) {
    DAT_6000_d0e8 = (char *)0x4000;
    DAT_6000_d0e6 = (char *)s_LYING_DOWN__6000_2202 + 9;
    DAT_6000_d0ec = 0x4000;
    DAT_6000_d0ea = (char *)s_OUR_FINE_ACCOMODATIONS_WILL_6000_21aa;
  }
  return;
}


// ==== FUN_4000_2cbc @ 4000:2cbc (size 50) callers: main

undefined2 __cdecl16far FUN_4000_2cbc(void)

{
  int local_12;
  undefined2 local_10;
  
  local_12 = 0;
  FUN_1000_2a03(0x33,&local_12,&local_12);
  if (local_12 == 0) {
    return 0;
  }
  return local_10;
}


// ==== FUN_4000_2cf4 @ 4000:2cf4 (size 58) callers: mouse_pick

undefined2 __cdecl16far FUN_4000_2cf4(undefined2 *param_1,undefined2 *param_2)

{
  undefined2 local_12;
  undefined2 local_10;
  undefined2 local_e;
  undefined2 local_c;
  
  local_12 = 3;
  FUN_1000_2a03(0x33,&local_12,&local_12);
  *param_1 = local_e;
  *param_2 = local_c;
  return local_10;
}


// ==== FUN_4000_2d34 @ 4000:2d34 (size 57) callers: FUN_2000_1d0b,FUN_2000_1fbd,game_disk_prompt,FUN_2000_919a,FUN_2000_ea27,FUN_3000_bdb5,mouse_pick,wait_key,FUN_4000_3498,clear_screen,flush_keys

undefined2 __cdecl16far FUN_4000_2d34(undefined2 param_1)

{
  undefined2 local_12;
  undefined2 local_10;
  
  if (DAT_6000_d0da == 0) {
    return 0;
  }
  local_12 = 5;
  local_10 = param_1;
  FUN_1000_2a03(0x33,&local_12,&local_12);
  return local_10;
}


// ==== FUN_4000_2d71 @ 4000:2d71 (size 80) callers: main,mouse_pick

void __cdecl16far FUN_4000_2d71(void)

{
  undefined2 local_12 [2];
  undefined2 local_e;
  undefined2 local_c;
  
  local_e = 0;
  local_c = 500;
  local_12[0] = 7;
  FUN_1000_2a03(0x33,local_12,local_12);
  local_e = 0;
  local_c = 500;
  local_12[0] = 8;
  FUN_1000_2a03(0x33,local_12,local_12);
  return;
}


// ==== FUN_4000_2dc1 @ 4000:2dc1 (size 39) callers: mouse_pick,FUN_4000_3381

undefined2 __cdecl16far FUN_4000_2dc1(int param_1)

{
  long lVar1;
  long b;
  
  b = 0x63f;
  lVar1 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)param_1);
  lVar1 = F_LDIV(lVar1,b);
  return (int)lVar1;
}


// ==== FUN_4000_2dea @ 4000:2dea (size 39) callers: mouse_pick,FUN_4000_3381

undefined2 __cdecl16far FUN_4000_2dea(int param_1)

{
  long lVar1;
  long b;
  
  b = 0x4af;
  lVar1 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)param_1);
  lVar1 = F_LDIV(lVar1,b);
  return (int)lVar1;
}


// ==== FUN_4000_2e13 @ 4000:2e13 (size 22) callers: FUN_2000_1d0b,FUN_2000_1fbd,cast_spell,FUN_2000_ea27

void __cdecl16far FUN_4000_2e13(void)

{
  int iVar1;
  
  for (iVar1 = 0; iVar1 < 100; iVar1 = iVar1 + 1) {
    ((undefined1 *)&DAT_6000_d0ee)[iVar1] = 0;
  }
  return;
}


// ==== FUN_4000_2e29 @ 4000:2e29 (size 176) callers: mouse_pick

void __cdecl16far FUN_4000_2e29(void)

{
  int iVar1;
  
  if (DAT_6000_cdd5 != 0x100) {
    return;
  }
  if ((DAT_6000_cd94 == 10) || (DAT_6000_cd94 == 0xb)) {
    FUN_2000_0269((undefined1 *)&DAT_6000_cdd7);
  }
  else {
    FUN_5110_009c(0,0x80,(undefined1 *)&DAT_6000_cdd7,0x6000);
    FUN_5110_009c(0x80,0x80,(undefined1 *)&DAT_6000_cf57,0x6000);
  }
  for (iVar1 = 0x100; 0x40 < iVar1; iVar1 = iVar1 + -1) {
    ((undefined1 *)&DAT_6000_cdd7)[iVar1 * 3] = *(undefined1 *)(iVar1 * 3 + -0x322c);
    ((undefined1 *)&DAT_6000_cdd8)[iVar1 * 3] =
         *(undefined1 *)((int)(undefined2 *)&DAT_6000_cdd5 + iVar1 * 3);
    ((undefined1 *)&DAT_6000_cdd9)[iVar1 * 3] =
         *(undefined1 *)((int)(undefined2 *)&DAT_6000_cdd5 + iVar1 * 3 + 1);
  }
  DAT_6000_ce97 = DAT_6000_d0d7;
  DAT_6000_ce98 = DAT_6000_d0d8;
  DAT_6000_ce99 = DAT_6000_d0d9;
  return;
}


// ==== FUN_4000_2ed9 @ 4000:2ed9 (size 28) callers: mouse_pick

int __cdecl16far FUN_4000_2ed9(int param_1,int param_2,int param_3)

{
  if (param_3 < param_1) {
    param_3 = param_1;
  }
  if (param_2 < param_3) {
    param_3 = param_2;
  }
  return param_3;
}


// ==== mouse_pick @ 4000:2ef7 (size 1154) callers: FUN_2000_1d0b,FUN_2000_1fbd,select_player,FUN_2000_919a,FUN_2000_9968,movecontrol,FUN_2000_ea27,roll_char,FUN_3000_bdb5  // which entry of a screen-region table the mouse is on

int __cdecl16far mouse_pick(int *param_1)

{
  int iVar1;
  int iVar2;
  undefined2 uVar3;
  int iVar4;
  long lVar5;
  long lVar6;
  undefined2 uVar8;
  undefined4 uVar7;
  int local_6;
  int local_4;
  
  if (DAT_6000_d0da == 0) {
    return -1;
  }
  DAT_6000_7f8d = DAT_6000_7f8d + 1;
  if (0x14 < DAT_6000_7f8d) {
    DAT_6000_7f8d = 0;
    FUN_4000_2d71();
  }
  FUN_4000_2cf4(&local_4);
  lVar6 = 0x1fb;
  lVar5 = N_LXMUL(CONCAT22(DAT_6000_cd98,DAT_6000_cd96),(long)local_4);
  lVar5 = F_LDIV(lVar5,lVar6);
  local_4 = (int)lVar5;
  lVar6 = 0x1fb;
  lVar5 = N_LXMUL(CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a),(long)local_6);
  F_LDIV(lVar5,lVar6);
  local_4 = FUN_4000_2ed9();
  iVar1 = FUN_4000_2ed9();
  if (((DAT_6000_d0e0 == param_1) && (DAT_6000_7f82 != -1)) && (DAT_6000_7f84 != -1)) {
    (*DAT_6000_d0ea)();
  }
  DAT_6000_d0e0 = param_1;
  DAT_6000_7f82 = local_4;
  DAT_6000_7f84 = iVar1;
  (*DAT_6000_d0ea)();
  if (DAT_6000_cdd5 == 0x100) {
    FUN_4000_2e29();
  }
  if ((DAT_6000_7f80 != -1) &&
     (((iVar4 = FUN_4000_2dc1(), local_4 < iVar4 || (iVar4 = FUN_4000_2dea(), iVar1 < iVar4)) ||
      ((iVar4 = FUN_4000_2dc1(), iVar4 <= local_4 || (iVar4 = FUN_4000_2dea(), iVar4 <= iVar1))))))
  {
    uVar8 = 0xf;
    uVar3 = FUN_4000_2dea(DAT_6000_d0e0[DAT_6000_7f80 * 4 + 4],0xf);
    uVar7 = CONCAT22(uVar8,uVar3);
    uVar3 = FUN_4000_2dc1();
    uVar3 = FUN_4000_2dea(DAT_6000_d0e0[DAT_6000_7f80 * 4 + 2],uVar3,uVar7);
    uVar3 = FUN_4000_2dc1(DAT_6000_d0e0[DAT_6000_7f80 * 4 + 1],uVar3);
    FUN_4000_22a3(uVar3);
    DAT_6000_7f80 = -1;
  }
  iVar4 = 0;
  while( true ) {
    if (*param_1 <= iVar4) {
      DAT_6000_7f8f = 0;
      if (DAT_6000_7f80 == -1) {
        iVar1 = FUN_4000_2d34();
        if (iVar1 != 0) {
          DAT_6000_7f8f = 1;
        }
        if (param_1 == (int *)0x7f91) {
          FUN_4000_2d34();
        }
      }
      return -1;
    }
    if (((((undefined1 *)&DAT_6000_d0ee)[iVar4] == '\0') &&
        (iVar2 = FUN_4000_2dc1(), iVar2 <= local_4)) &&
       ((iVar2 = FUN_4000_2dea(), iVar2 <= iVar1 &&
        ((iVar2 = FUN_4000_2dc1(), local_4 < iVar2 && (iVar2 = FUN_4000_2dea(), iVar1 < iVar2))))))
    break;
    iVar4 = iVar4 + 1;
  }
  if (DAT_6000_1425 == 1) {
    if (((((DAT_6000_d0e0 == param_1) && (DAT_6000_7f80 != iVar4)) &&
         (iVar2 = FUN_4000_2dc1(), iVar2 <= local_4)) &&
        ((iVar2 = FUN_4000_2dea(), iVar2 <= iVar1 && (iVar2 = FUN_4000_2dc1(), local_4 < iVar2))))
       && (iVar2 = FUN_4000_2dea(), iVar1 < iVar2)) {
      uVar8 = 0xf;
      uVar3 = FUN_4000_2dea(DAT_6000_d0e0[DAT_6000_7f80 * 4 + 4],0xf);
      uVar7 = CONCAT22(uVar8,uVar3);
      uVar3 = FUN_4000_2dc1();
      uVar3 = FUN_4000_2dea(DAT_6000_d0e0[DAT_6000_7f80 * 4 + 2],uVar3,uVar7);
      uVar3 = FUN_4000_2dc1(DAT_6000_d0e0[DAT_6000_7f80 * 4 + 1],uVar3);
      FUN_4000_22a3(uVar3);
    }
    if (((DAT_6000_d0e0 != param_1) && (DAT_6000_d0e0 != (int *)0x0)) || (iVar4 != DAT_6000_7f80)) {
      uVar8 = 0xf;
      uVar3 = FUN_4000_2dea(param_1[iVar4 * 4 + 4],0xf);
      uVar7 = CONCAT22(uVar8,uVar3);
      uVar3 = FUN_4000_2dc1();
      uVar3 = FUN_4000_2dea(param_1[iVar4 * 4 + 2],uVar3,uVar7);
      uVar3 = FUN_4000_2dc1(param_1[iVar4 * 4 + 1],uVar3);
      FUN_4000_22a3(uVar3);
      DAT_6000_7f80 = iVar4;
    }
  }
  iVar1 = FUN_4000_2d34();
  if (iVar1 == 0) {
    if ((param_1 == (int *)0x7f91) && (iVar1 = FUN_4000_2d34(), iVar1 != 0)) {
      return -10 - iVar4;
    }
    return -1;
  }
  return iVar4;
}


// ==== FUN_4000_3381 @ 4000:3381 (size 152) callers: FUN_4000_3435

void __cdecl16far FUN_4000_3381(void)

{
  undefined2 uVar1;
  
  (*DAT_6000_d0ea)(0x4000,DAT_6000_7f82 << 4,DAT_6000_7f84 << 4);
  if (DAT_6000_7f80 != -1) {
    uVar1 = FUN_4000_2dea(*(undefined2 *)(DAT_6000_7f80 * 8 + DAT_6000_d0e0 + 8),0xf);
    uVar1 = FUN_4000_2dc1(*(undefined2 *)(DAT_6000_7f80 * 8 + DAT_6000_d0e0 + 6),uVar1);
    uVar1 = FUN_4000_2dea(*(undefined2 *)(DAT_6000_7f80 * 8 + DAT_6000_d0e0 + 4),uVar1);
    uVar1 = FUN_4000_2dc1(*(undefined2 *)(DAT_6000_7f80 * 8 + DAT_6000_d0e0 + 2),uVar1);
    FUN_4000_22a3(uVar1);
  }
  DAT_6000_7f80 = 0xffff;
  return;
}


// ==== FUN_4000_3419 @ 4000:3419 (size 28) callers: 

void __cdecl16far FUN_4000_3419(void)

{
  (*DAT_6000_d0ea)(0x4000,DAT_6000_7f82 << 4,DAT_6000_7f84 << 4);
  return;
}


// ==== FUN_4000_3435 @ 4000:3435 (size 29) callers: FUN_2000_1d0b,FUN_2000_1fbd,FUN_2000_919a,FUN_2000_9968,movecontrol,FUN_2000_ea27,roll_char,FUN_3000_bdb5

void __cdecl16far FUN_4000_3435(void)

{
  if ((DAT_6000_d0da != 0) && (DAT_6000_d0e0 != 0)) {
    FUN_4000_3381();
    DAT_6000_d0e0 = 0;
  }
  return;
}


// ==== wait_key @ 4000:3452 (size 66) callers: FUN_2000_22ff,load_world_pic,bank,check_v_file,monster_turn,FUN_2000_70da,FUN_2000_726f,FUN_2000_7756,FUN_2000_7b86,FUN_2000_81cd,show_help,view_stats,FUN_2000_9968,chute,movecontrol,roll_char,FUN_3000_9cfb,FUN_3000_a047,FUN_3000_bdb5,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a,FUN_3000_d51c,FUN_3000_e221  // waits for a key or a mouse button

short __cdecl16far wait_key(void)

{
  short sVar1;
  int iVar2;
  
  while( true ) {
    do {
      sVar1 = kbhit();
      if (sVar1 != 0) {
        sVar1 = getch();
        return sVar1;
      }
    } while (DAT_6000_d0da == 0);
    iVar2 = FUN_4000_2d34(1);
    if (iVar2 != 0) break;
    iVar2 = FUN_4000_2d34(0);
    if (iVar2 != 0) {
      return 0;
    }
  }
  return 1;
}


// ==== FUN_4000_3498 @ 4000:3498 (size 62) callers: movecontrol,FUN_3000_b1d6

undefined2 __cdecl16far FUN_4000_3498(void)

{
  short sVar1;
  int iVar2;
  
  sVar1 = kbhit();
  if (sVar1 != 0) {
    return 1;
  }
  if (DAT_6000_d0da == 0) {
    return 0;
  }
  iVar2 = FUN_4000_2d34(1);
  if ((iVar2 == 0) && (iVar2 = FUN_4000_2d34(0), iVar2 == 0)) {
    return 0;
  }
  return 2;
}


// ==== clear_screen @ 4000:34d8 (size 90) callers: FUN_2000_1485,main,FUN_2000_7b86,FUN_2000_97b8,FUN_2000_9968,movecontrol,roll_char,FUN_3000_8235,FUN_3000_9cfb,FUN_3000_b1d6  // blanks the screen and hides the mouse cursor

void __cdecl16far clear_screen(void)

{
  uint in_AX;
  
  if (DAT_6000_d0da != 0) {
    FUN_4000_2d34(0);
    FUN_4000_2d34(1);
    DAT_6000_d0e0 = 0;
    in_AX = 0xffff;
    DAT_6000_7f82 = 0xffff;
    DAT_6000_7f80 = 0xffff;
  }
  if (DAT_6000_cd94 == 4) {
    FUN_5110_0000();
    FUN_4000_10ee();
  }
  else {
    FUN_4000_0eab(0,0,DAT_6000_cd96,DAT_6000_cd9a,in_AX & 0xff00);
  }
  return;
}


// ==== flush_keys @ 4000:3532 (size 49) callers: FUN_2000_1d0b,FUN_2000_216b,load_world_pic,store,FUN_2000_3085,inn,bank,game_disk_prompt,main,monster_turn,view_stats,FUN_2000_97b8,FUN_2000_9968,chute,dig_hole,movecontrol,roll_char,FUN_3000_b1d6,FUN_3000_ba27,FUN_3000_bbe1,FUN_3000_c977,FUN_3000_cb7a,FUN_3000_cd34,FUN_3000_cf3a,FUN_3000_d51c  // drains the keyboard and mouse buffers

void __cdecl16far flush_keys(void)

{
  short sVar1;
  
  if (DAT_6000_d0da != 0) {
    FUN_4000_2d34(1);
    FUN_4000_2d34(0);
  }
  while (sVar1 = kbhit(), sVar1 != 0) {
    getch();
  }
  return;
}


// ==== FUN_4000_3563 @ 4000:3563 (size 784) callers: FUN_2000_919a

void __cdecl16far FUN_4000_3563(void)

{
  print_text(0x2d0,0,0,(char *)s_HELP_MENU_HIT_ESC_TO_RETURN_TO_G_6000_81e8,4);
  print_text(0x2d0,0x28,0,(char *)s_HIT_LETTER_OR_NUMBER_FOR_MORE_HE_6000_820c,5);
  print_text(0x2d0,0x50,0,(char *)s_A_CHANGE_ARMOR_6000_822f,8);
  print_text(0x2d0,0x78,0,(char *)s_B_BRICK_SPEED_CHANGE__4_SETTINGS_6000_823e,8);
  print_text(0x2d0,0xa0,0,(char *)s_C_CAST_SPELL_OR_GET_HELP_ON_SPEL_6000_8260,8);
  print_text(0x2d0,200,0,(char *)s_D_GO_DOWN_LADDER_OR_DIG_HOLE_6000_8283,8);
  print_text(0x2d0,0xf0,0,(char *)s_E_EXPERIENCE_NEEDED_TO_GAIN_LEVE_6000_82a0,8);
  print_text(0x2d0,0x118,0,(char *)s_F_ATTACK_MONSTER_IF_POSSIBLE_6000_82c2,8);
  print_text(0x2d0,0x140,0,(char *)s_I_USE_ITEM_6000_82df,8);
  print_text(0x2d0,0x168,0,(char *)s_L_LOSE__DROP__ITEM_6000_82ea,8);
  print_text(0x2d0,400,0,(char *)s_M_VIEW_MONETARY_BREAKDOWN_6000_82fd,8);
  print_text(0x2d0,0x1b8,0,(char *)s_Q_QUIT_AND_SAVE_POSITION_6000_8317,8);
  print_text(0x2d0,0x1e0,0,(char *)s_S_SAVE_AND_CONTINUE_PLAYING_6000_8330,8);
  print_text(0x2d0,0x208,0,(char *)s_U_CLIMB_UP_LADDER_OR_ROPE_6000_834c,8);
  print_text(0x2d0,0x230,0,(char *)s_V_VIEW_PLAYER_S_VITAL_STATISTICS_6000_8366,8);
  print_text(0x2d0,600,0,(char *)s_W_SELECT_WEAPON_6000_8387,8);
  print_text(0x2d0,0x280,0,(char *)s_P_VIEW_CONTENTS_OF_POCKETS_6000_8397,8);
  print_text(0x2d0,0x2a8,0,(char *)s_O_ON_OFF_SWITCH_FOR_THE_SOUND_6000_83b2,8);
  print_text(0x2d0,0x2d0,0,(char *)s_X_EXPAND_THE_2D_MAP_6000_83d0,8);
  print_text(0x2d0,0x2f8,0,(char *)s_Z_ZOOM_IN_ON_A_3D_VIEW_6000_83e4,8);
  print_text(0x2d0,800,0,(char *)s_0_OBJECTIVE_OF_THE_GAME_6000_83fb,8);
  print_text(0x2d0,0x348,0,(char *)s_1_GENERAL_PLAY_OF_GAME_6000_8413,8);
  print_text(0x2d0,0x370,0,(char *)s_2_A_GUIDE_TO_THE_TOWNS_6000_842a,8);
  print_text(0x2d0,0x398,0,(char *)s_3_THE_DUNGEONS_AND_THE_VIEWS_6000_8441,8);
  print_text(0x2d0,0x3c0,0,(char *)s_4_TRAVELLING_IN_THE_WILDERNESS_6000_845e,8);
  print_text(0x2d0,1000,0,(char *)s_5_GENERAL_STRATEGY_6000_847d,8);
  print_text(0x2d0,0x410,0,(char *)s_6_SPELLS__SCROLLS__WANDS__PAPERS_6000_8490,8);
  print_text(0x2d0,0x438,0,(char *)s_7_MAGIC_ITEMS_6000_84b1,8);
  print_text(0x2d0,0x460,0,(char *)s_8_TIMING_AND_FIGHTING_6000_84bf,8);
  print_text(0x2d0,0x488,0,(char *)s_9_MORE_HINTS_AND_STRATEGIES_6000_84d5,8);
  return;
}


// ==== FUN_4000_3873 @ 4000:3873 (size 511) callers: FUN_2000_8b3f,movecontrol

void __cdecl16far FUN_4000_3873(int param_1)

{
  int iVar1;
  
  if (param_1 == 0) {
    DAT_6000_7fb3 = 0x2d3;
    DAT_6000_7fb5 = 0;
    DAT_6000_7fb7 = 0x484;
    DAT_6000_7fb9 = 600;
    DAT_6000_7fbb = 0x11b;
    DAT_6000_7fbd = 0x1ae;
    DAT_6000_7fbf = 0x2cd;
    DAT_6000_7fc1 = 0x406;
    DAT_6000_7fc3 = 0x2d3;
    DAT_6000_7fc5 = 0x25d;
    DAT_6000_7fc7 = 0x484;
    DAT_6000_7fc9 = 0x487;
    DAT_6000_7fcb = 0x48a;
    DAT_6000_7fcd = 0x1ae;
    DAT_6000_7fcf = 0x63e;
    DAT_6000_7fd1 = 0x406;
  }
  if (param_1 == 1) {
    DAT_6000_7fb3 = 0x2d3;
    DAT_6000_7fb5 = 300;
    DAT_6000_7fb7 = 0x484;
    DAT_6000_7fb9 = 600;
    DAT_6000_7fbb = 0x11b;
    DAT_6000_7fbd = 0x1ae;
    DAT_6000_7fbf = 0x2cd;
    DAT_6000_7fc1 = 0x2da;
    DAT_6000_7fc3 = 0x2d3;
    DAT_6000_7fc5 = 0x25d;
    DAT_6000_7fc7 = 0x484;
    DAT_6000_7fc9 = 0x389;
    DAT_6000_7fcb = 0x48a;
    DAT_6000_7fcd = 0x1ae;
    DAT_6000_7fcf = 0x63e;
    DAT_6000_7fd1 = 0x2da;
  }
  if (param_1 == 2) {
    DAT_6000_7fb3 = 0x340;
    DAT_6000_7fb5 = 300;
    DAT_6000_7fb7 = 0x417;
    DAT_6000_7fb9 = 600;
    DAT_6000_7fbb = 0x260;
    DAT_6000_7fbd = 0x1ae;
    DAT_6000_7fbf = 0x33a;
    DAT_6000_7fc1 = 0x2da;
    DAT_6000_7fc3 = 0x340;
    DAT_6000_7fc5 = 0x25d;
    DAT_6000_7fc7 = 0x417;
    DAT_6000_7fc9 = 900;
    DAT_6000_7fcb = 0x41d;
    DAT_6000_7fcd = 0x1ae;
    DAT_6000_7fcf = 0x4f7;
    DAT_6000_7fd1 = 0x2da;
  }
  for (iVar1 = 1; iVar1 < 0x10; iVar1 = iVar1 + 4) {
    *(int *)(iVar1 * 2 + 0x7f91) =
         *(int *)(iVar1 * 2 + 0x7fb1) +
         ((((undefined2 *)&DAT_6000_7fb5)[iVar1] - *(int *)(iVar1 * 2 + 0x7fb1)) * 3) / 8;
    ((undefined2 *)&DAT_6000_7f93)[iVar1] =
         ((undefined2 *)&DAT_6000_7fb3)[iVar1] +
         ((((undefined2 *)&DAT_6000_7fb7)[iVar1] - ((undefined2 *)&DAT_6000_7fb3)[iVar1]) * 3) / 8;
    ((undefined2 *)&DAT_6000_7f95)[iVar1] =
         *(int *)(iVar1 * 2 + 0x7fb1) +
         ((((undefined2 *)&DAT_6000_7fb5)[iVar1] - *(int *)(iVar1 * 2 + 0x7fb1)) * 5) / 8;
    ((undefined2 *)&DAT_6000_7f97)[iVar1] =
         ((undefined2 *)&DAT_6000_7fb3)[iVar1] +
         ((((undefined2 *)&DAT_6000_7fb7)[iVar1] - ((undefined2 *)&DAT_6000_7fb3)[iVar1]) * 5) / 8;
  }
  return;
}


// ==== FUN_4000_3a72 @ 4000:3a72 (size 839) callers: movecontrol

void __cdecl16far FUN_4000_3a72(void)

{
  long lVar1;
  long lVar2;
  undefined2 uVar3;
  undefined2 uVar4;
  undefined2 uVar5;
  undefined4 uVar6;
  
  lVar2 = 0x4af;
  lVar1 = N_LXMUL(0x1ac,CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  lVar1 = F_LDIV(lVar1,lVar2);
  uVar6 = CONCAT22((int)lVar1,DAT_6000_cd96);
  uVar5 = 0;
  uVar4 = 0;
  uVar3 = 0x63f;
  lVar2 = 2;
  lVar1 = N_LXMUL(0x915,CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar1 = F_LDIV(lVar1,lVar2);
  lVar1 = F_LDIV(lVar1,CONCAT22(uVar4,uVar3));
  fill_rect((int)lVar1,uVar5,uVar6);
  print_text_clipped(0x48c,0,0x63f,0,(char *)s_RICKS_VIEW_ONEY_6000_84f1,8);
  print_text_clipped(0x48c,0x28,0x63f,0,(char *)s_EAPONS_IEW_STATS_6000_8505,8);
  print_text_clipped(0x48c,0x4f,0x63f,0,(char *)s_OOM_AST_SPELL_6000_8519,8);
  print_text_clipped(0x48c,0x76,0x63f,0,(char *)s_USE_TEM_E_PAND_MAP_6000_852d,8);
  print_text_clipped(0x48c,0x9d,0x63f,0,(char *)s_RMOR_OSE_ITEM_6000_8541,8);
  print_text_clipped(0x48c,0xc4,0x63f,0,(char *)s_IGHT_OCKETS_6000_8555,8);
  print_text_clipped(0x48c,0xea,0x63f,0,(char *)s_WAI_XP_NEEDED_6000_8569,8);
  if (DAT_6000_119f == 0) {
    print_text_clipped(0x48c,0x114,0x63f,0,(char *)s_TURN_SOUND_N_6000_858f,8);
  }
  else {
    print_text_clipped(0x48c,0x114,0x63f,0,(char *)s_TURN_SOUND_FF_6000_857d,8);
  }
  print_text_clipped(0x48c,0x13b,0x63f,0,(char *)s_SPELLS_IN_EFFECT_6000_85a1,8);
  print_text_clipped(0x48c,0x162,0x63f,0,(char *)s_SPELLS_IN_EFFECT_6000_85a1,8);
  print_text_clipped(0x48c,0x188,0x63f,0,(char *)s_UIT_SAVE_ELP_____6000_85b4,8);
  if ((DAT_6000_00c5 == 1) || (DAT_6000_cd94 == 0)) {
    DAT_6000_7f78 = 1;
  }
  print_text_clipped(0x48c,0,0x63f,0,0x85c8,4);
  print_text_clipped(0x48c,0x28,0x63f,0,0x85dc,4);
  print_text_clipped(0x48c,0x4f,0x63f,0,0x85f0,4);
  print_text_clipped(0x48c,0x76,0x63f,0,0x8604,4);
  print_text_clipped(0x48c,0x9d,0x63f,0,0x8618,4);
  print_text_clipped(0x48c,0xc4,0x63f,0,0x862c,4);
  print_text_clipped(0x48c,0xea,0x63f,0,0x8640,4);
  print_text_clipped(0x48c,0x114,0x63f,0,0x8654,4);
  print_text_clipped(0x48c,0x13b,0x63f,0,0x8666,4);
  print_text_clipped(0x48c,0x162,0x63f,0,0x8679,4);
  print_text_clipped(0x48c,0x188,0x63f,0,0x868c,4);
  if ((DAT_6000_00c5 == 1) || (DAT_6000_cd94 == 0)) {
    DAT_6000_7f78 = 0;
  }
  return;
}


// ==== read_string @ 4000:3db9 (size 599) callers: bank,roll_char  // types a string: uppercased, letters, digits and space

void __cdecl16far
read_string(int param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             undefined2 param_5,undefined2 param_6,undefined2 param_7,undefined2 param_8,int param_9
             )

{
  short sVar1;
  int iVar2;
  long lVar3;
  long lVar4;
  long lVar5;
  long lVar6;
  undefined1 local_4;
  
  lVar4 = CONCAT22(param_7,param_6);
  lVar3 = CONCAT22(param_3,param_2);
  iVar2 = 0;
  if ((DAT_6000_cd98 < 1) &&
     ((DAT_6000_cd98 < 0 ||
      (lVar3 = CONCAT22(param_3,param_2), lVar4 = CONCAT22(param_7,param_6), DAT_6000_cd96 < 0x2da))
     )) {
    lVar4 = 0x640;
    lVar3 = N_LXMUL(CONCAT22(param_3,param_2),CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar3 = F_LDIV(lVar3,lVar4);
    lVar5 = 0x640;
    lVar4 = N_LXMUL(CONCAT22(param_7,param_6),CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
    lVar4 = F_LDIV(lVar4,lVar5);
    lVar6 = 0x4b0;
    lVar5 = N_LXMUL(CONCAT22(param_5,param_4),CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
    F_LDIV(lVar5,lVar6);
  }
  do {
    sVar1 = getch();
    sVar1 = toupper(sVar1);
    if (0 < iVar2) {
      if (sVar1 == 0x1b) {
        return;
      }
      if (sVar1 == 0xd) {
        *(undefined1 *)(param_1 + iVar2) = 0;
        return;
      }
      if (sVar1 == 8) {
        iVar2 = iVar2 + -1;
        if ((DAT_6000_cd98 < 0) || ((DAT_6000_cd98 < 1 && (DAT_6000_cd96 < 0x2db)))) {
          toupper((int)*(char *)(param_1 + iVar2));
          lVar6 = (long)param_9;
          lVar5 = N_LXMUL(lVar4 - lVar3,(long)iVar2);
          F_LDIV(lVar5,lVar6);
          FUN_4000_0906();
        }
        else {
          lVar6 = (long)param_9;
          lVar5 = N_LXMUL(lVar4 - lVar3,(long)iVar2);
          F_LDIV(lVar5,lVar6);
          print_text();
        }
      }
    }
    if ((((*(byte *)(sVar1 + -0x723d) & 0xe) != 0) || (sVar1 == 0x20)) && (iVar2 != param_9)) {
      local_4 = (undefined1)sVar1;
      *(undefined1 *)(param_1 + iVar2) = local_4;
      if ((DAT_6000_cd98 < 0) || ((DAT_6000_cd98 < 1 && (DAT_6000_cd96 < 0x2db)))) {
        toupper(sVar1);
        lVar6 = (long)param_9;
        lVar5 = N_LXMUL(lVar4 - lVar3,(long)iVar2);
        F_LDIV(lVar5,lVar6);
        FUN_4000_0906();
      }
      else {
        toupper(sVar1);
        lVar6 = (long)param_9;
        lVar5 = N_LXMUL(lVar4 - lVar3,(long)iVar2);
        F_LDIV(lVar5,lVar6);
        print_text();
      }
      iVar2 = iVar2 + 1;
    }
  } while( true );
}


// ==== FUN_4000_4016 @ 4000:4016 (size 305) callers: 

void __cdecl16far
FUN_4000_4016(char *param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             undefined2 param_5,undefined2 param_6,undefined2 param_7,undefined2 param_8,int param_9
             ,undefined2 param_10)

{
  int iVar1;
  undefined2 unaff_SS;
  long lVar2;
  long lVar3;
  long lVar4;
  long lVar5;
  char local_66 [100];
  
  if ((-1 < DAT_6000_cd98) && ((0 < DAT_6000_cd98 || (0x2da < DAT_6000_cd96)))) {
    strcpy(local_66,param_1);
    local_66[param_9] = '\0';
    print_text_clipped(param_2,param_4,param_6,param_8,local_66,param_10);
    return;
  }
  lVar3 = 0x640;
  lVar2 = N_LXMUL(CONCAT22(param_3,param_2),CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar2 = F_LDIV(lVar2,lVar3);
  lVar4 = 0x640;
  lVar3 = N_LXMUL(CONCAT22(param_7,param_6),CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar3 = F_LDIV(lVar3,lVar4);
  lVar5 = 0x4b0;
  lVar4 = N_LXMUL(CONCAT22(param_5,param_4),CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  F_LDIV(lVar4,lVar5);
  iVar1 = 0;
  while( true ) {
    if (param_9 <= iVar1) {
      return;
    }
    if (param_1[iVar1] == '\0') break;
    toupper((int)param_1[iVar1]);
    lVar5 = (long)param_9;
    lVar4 = N_LXMUL(lVar3 - lVar2,(long)iVar1);
    F_LDIV(lVar4,lVar5);
    FUN_4000_0906();
    iVar1 = iVar1 + 1;
  }
  return;
}


// ==== draw_text_box @ 4000:4147 (size 291) callers: FUN_2000_1d0b,FUN_2000_216b,FUN_2000_9ed9,roll_char  // prints text into a cleared rectangle

void __cdecl16far
draw_text_box(char *param_1,undefined2 param_2,undefined2 param_3,undefined2 param_4,
             undefined2 param_5,undefined2 param_6,undefined2 param_7,undefined2 param_8,
             undefined2 param_9)

{
  short sVar1;
  int iVar2;
  long lVar3;
  long lVar4;
  long lVar5;
  long lVar6;
  
  if ((-1 < DAT_6000_cd98) && ((0 < DAT_6000_cd98 || (0x2da < DAT_6000_cd96)))) {
    print_text_clipped(param_2,param_4,param_6,param_8,param_1,param_9);
    return;
  }
  lVar4 = 0x640;
  lVar3 = N_LXMUL(CONCAT22(param_3,param_2),CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar3 = F_LDIV(lVar3,lVar4);
  lVar5 = 0x640;
  lVar4 = N_LXMUL(CONCAT22(param_7,param_6),CONCAT22(DAT_6000_cd98,DAT_6000_cd96));
  lVar4 = F_LDIV(lVar4,lVar5);
  lVar6 = 0x4b0;
  lVar5 = N_LXMUL(CONCAT22(param_5,param_4),CONCAT22(DAT_6000_cd9c,DAT_6000_cd9a));
  F_LDIV(lVar5,lVar6);
  sVar1 = strlen(param_1);
  iVar2 = 0;
  while( true ) {
    if (sVar1 <= iVar2) {
      return;
    }
    if (param_1[iVar2] == '\0') break;
    toupper((int)param_1[iVar2]);
    lVar6 = (long)sVar1;
    lVar5 = N_LXMUL(lVar4 - lVar3,(long)iVar2);
    F_LDIV(lVar5,lVar6);
    FUN_4000_0906();
    iVar2 = iVar2 + 1;
  }
  return;
}


// ==== FUN_4000_426a @ 4000:426a (size 35) callers: view_stats

void __cdecl16far FUN_4000_426a(char *param_1,char *param_2)

{
  strcpy(DAT_6000_cb52,param_1);
  strcat(DAT_6000_cb52,param_2);
  return;
}


// ==== FUN_4000_428f @ 4000:428f (size 63) callers: store,FUN_2000_3085,financial_statement,inn,FUN_2000_7421,view_stats,FUN_2000_f853,FUN_3000_8235,FUN_3000_a047

char * __cdecl16far FUN_4000_428f(char *param_1,undefined2 param_2,undefined2 param_3)

{
  char *src;
  undefined1 local_3e [60];
  
  strcpy(DAT_6000_cb52,param_1);
  src = (char *)ltoa(param_2,param_3,local_3e,10);
  strcat(DAT_6000_cb52,src);
  return DAT_6000_cb52;
}


// ==== format_two_numbers @ 4000:42d2 (size 113) callers: FUN_2000_f853,roll_char  // builds "<a><n><b><m>" in the scratch string

char * __cdecl16far
format_two_numbers(char *param_1,undefined2 param_2,undefined2 param_3,char *param_4,undefined2 param_5,
             undefined2 param_6)

{
  char *pcVar1;
  undefined1 local_3e [60];
  
  strcpy(DAT_6000_cb52,param_1);
  pcVar1 = (char *)ltoa(param_2,param_3,local_3e,10);
  strcat(DAT_6000_cb52,pcVar1);
  strcat(DAT_6000_cb52,param_4);
  pcVar1 = (char *)ltoa(param_5,param_6,local_3e,10);
  strcat(DAT_6000_cb52,pcVar1);
  return DAT_6000_cb52;
}


// ==== FUN_4000_4347 @ 4000:4347 (size 512) callers: 

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

void __cdecl16far FUN_4000_4347(void)

{
  FUN_4000_0699(0x86a0,0x19,0x19,0x433,0x82,DAT_6000_86a6);
  DAT_6000_cda6 = 4;
  FUN_4000_0699(0x86a0,0x19,0x19,0x433,0x82,_DAT_6000_86aa);
  print_text_clipped(10,0xa0,1099,0,(char *)s_PA_WE_AT_MORAFFWARE_MAKE_OUR_LIV_6000_86ac + 2,4);
  print_text_clipped(10,0xe1,1099,0,(char *)s_AWAY_THE_COMPLETE_SHAREWARE_EDIT_6000_86dc,4);
  print_text_clipped(10,0x122,1099,0,(char *)s_HIGH_RES_GAMES__AND_THEN_RECEIVI_6000_8708,4);
  print_text_clipped(10,0x163,1099,0,(char *)s_EVEN_LARGER_COMMERCIAL_EDITIONS_O_6000_8736,4);
  print_text_clipped(10,0x1cc,1099,0,(char *)s_SHAREWARE_EDITIONS_OF_OTHER_MORA_6000_8765,4);
  print_text_clipped(10,0x20d,1099,0,(char *)s_MAY_BE_OBTAINED_FREE_BY_CALLING_E_6000_8795,4);
  print_text_clipped(10,0x24e,1099,0,(char *)s_EXEC_PC_IS_THE_LARGEST_BBS_IN_TH_6000_87c2,4);
  print_text_clipped(10,0x28f,1099,0,(char *)s__414__789_4210_WITH_YOUR_MODEM__O_6000_87f3,4);
  print_text_clipped(10,0x2d0,1099,0,(char *)s_MORAFFWARE_VOICE_NUMBER__1_800_V_6000_881f,4);
  print_text_clipped(10,0x311,1099,0,(char *)s_A_COUPLE_OF_DOLLARS_PER_GAME_WE__6000_8850,4);
  print_text_clipped(10,0x352,1099,0,(char *)s_OF_OUR_SHAREWARE_EDITIONS_THROUG_6000_8880,4);
  print_text_clipped(10,0x3bb,1099,0,(char *)s_SO_PLEASE_HELP_US_SUCCEED_BY_GIV_6000_88af,4);
  print_text_clipped(10,0x3fc,1099,0,(char *)s_OF_THIS_GAME_TO_EVERYONE_YOU_KNO_6000_88dd,4);
  print_text_clipped(10,0x474,0x63f,0,(char *)s_DELETE_THE_FILE__INTRO_TXT__TO_R_6000_8909,4);
  return;
}


// ==== FUN_4000_4547 @ 4000:4547 (size 263) callers: 

void __cdecl16far FUN_4000_4547(void)

{
  print_text(0,0,1,(char *)s_AS_YOU_STEP_FROM_THE_TELEPORTER_6000_8957,8);
  print_text(0,0x46,1,(char *)s_THROUGH_WHICH_YOU_ENTERED_MORAFF_6000_8977,8);
  print_text(0,0x8c,1,(char *)s_WORLD__A_LITTLE_MOUSE_ASKS_YOU__6000_899a,8);
  print_text(0,0xf0,1,(char *)s__DO_YOU_REALLY_THINK_YOU_CAN_DEF_6000_89ba,3);
  print_text(0,0x136,1,(char *)s_THE_SHADOW_DRAGON_KING_ON_LEVEL_1_6000_89de,3);
  print_text(0,0x17c,1,(char *)s_MANY_HAVE_TRIED__BUT_FEW_HAVE_EV_6000_8a02,3);
  print_text(0,0x1c2,1,(char *)s_SUCCEEDED___6000_8a25,3);
  print_text(0,0x226,1,(char *)s_THEN_THE_MOUSE_SAYS__I_LL_BE_BAC_6000_8a31,8);
  print_text(0,0x26c,1,(char *)s_CHUCKLES_AS_HE_QUICKLY_SCURRIES_A_6000_8a58,8);
  print_text(0,0x47e,0,(char *)s_HIT_ANY_KEY_6000_8a80,6);
  return;
}


// ==== FUN_5000_000e @ 5000:000e (size 326) callers: FUN_5000_01da,FUN_5000_052a,FUN_5000_0cca,FUN_5000_0d7b

undefined2 __cdecl16far FUN_5000_000e(void)

{
  byte bVar1;
  undefined1 uVar2;
  undefined2 in_AX;
  uint in_CX;
  
  if (DAT_6000_9636 == 4) {
    out(0x3c4,0xf6);
    bVar1 = in(0x3c5);
    out(0x3c5,bVar1 & 0xf0 | 0x1ff < in_CX | (0x1ff < in_CX) << 2);
  }
  else if (DAT_6000_9636 == 7) {
    if (in_CX < 0x200) {
      out(0x3c4,6);
    }
    else {
      out(0x3c4,0x4906);
    }
  }
  else if (DAT_6000_9636 == 2) {
    out(0x3ce,0x50f);
    uVar2 = in(0x3ce);
    out(0x3ce,CONCAT11((0x1ff < in_CX) << 4,9));
    out(0x3ce,uVar2);
  }
  else if (DAT_6000_9636 != 3) {
    if (DAT_6000_9636 == 8) {
      out(0x3c4,0xe);
      bVar1 = in(0x3c5);
      if (in_CX < 0x200) {
        out(0x3c5,bVar1 & 0xf0);
      }
      else {
        out(0x3c5,bVar1 & 0xf0 | 1);
      }
    }
    else if (DAT_6000_9636 == 0) {
      out(0x3cd,0x40);
      if (0x1ff < in_CX) {
        out(0x3cd,0x49);
      }
    }
    else if (DAT_6000_9636 == 9) {
      out(0x3cd,0);
      if (0x1ff < in_CX) {
        out(0x3cd,0x11);
      }
    }
    else if (DAT_6000_9636 == 10) {
      out(0x3df,0);
      if (0x1ff < in_CX) {
        out(0x3df,0x11);
      }
    }
    else if (DAT_6000_9636 == 6) {
      if (in_CX < 0x200) {
        out(0x3ce,0xd);
      }
      else {
        out(0x3ce,0x110d);
      }
    }
    else if (DAT_6000_9636 == 5) {
      out(0x3d6,0x10);
      bVar1 = in(0x3d7);
      if (in_CX < 0x200) {
        out(0x3d7,bVar1 & 0xc0);
      }
      else {
        out(0x3d7,bVar1 & 0xc0 | 0x10);
      }
    }
  }
  return in_AX;
}


// ==== FUN_5000_015b @ 5000:015b (size 35) callers: FUN_5000_01da,FUN_5000_0386,FUN_5000_0cca,FUN_5000_0d7b

undefined2 __cdecl16far FUN_5000_015b(void)

{
  return 0x100;
}


// ==== FUN_5000_01da @ 5000:01da (size 365) callers: FUN_2000_0837

undefined2 __cdecl16far
FUN_5000_01da(byte *param_1,int param_2,byte *param_3,int param_4,byte param_5)

{
  byte *pbVar1;
  byte *pbVar2;
  char extraout_AH;
  char extraout_AH_00;
  char cVar4;
  byte extraout_AH_01;
  byte extraout_AH_02;
  undefined2 uVar3;
  int iVar5;
  int iVar6;
  int iVar7;
  byte bVar8;
  undefined2 uVar9;
  byte bVar10;
  byte bVar11;
  byte *pbVar12;
  byte *pbVar13;
  undefined2 unaff_ES;
  code *local_a;
  
  iVar6 = param_2;
  pbVar12 = param_1;
  iVar7 = DAT_6000_cda0;
  uVar9 = 0x3ce;
  out(0x3ce,(uint)param_5 << 8);
  out(0x3ce,0xf01);
  out(0x3ce,CONCAT11(DAT_6000_7f88,3));
  iVar5 = (int)param_3 - (int)param_1;
  if (iVar5 == 0) {
    iVar6 = param_4 - param_2;
    if (param_4 < param_2) {
      iVar6 = -iVar6;
    }
    iVar6 = iVar6 + 1;
    iVar5 = iVar6;
    FUN_5000_015b();
    cVar4 = extraout_AH;
    if (DAT_6000_cda0 == 0x80) {
      FUN_5000_000e(iVar6);
      cVar4 = extraout_AH_00;
    }
    out(uVar9,CONCAT11(cVar4 << ((byte)iVar6 & 0x1f),8));
    do {
      *param_1 = *param_1 | 8;
      param_1 = param_1 + iVar7;
      iVar5 = iVar5 + -1;
    } while (iVar5 != 0);
    goto LAB_5000_0374;
  }
  if (iVar5 < 0) {
    iVar5 = -iVar5;
    LOCK();
    param_1 = param_3;
    UNLOCK();
    param_3 = pbVar12;
    LOCK();
    param_2 = param_4;
    UNLOCK();
    param_4 = iVar6;
  }
  param_4 = param_4 - param_2;
  if (param_4 != 0) {
    if (param_4 < 0) {
      param_4 = -param_4;
    }
    local_a = (code *)0x317;
    if (iVar5 < param_4) {
      local_a = (code *)0x356;
      iVar5 = param_4;
    }
    FUN_5000_015b(iVar5);
    if (DAT_6000_cda0 == 0x80) {
      FUN_5000_000e(iVar5);
    }
                    /* WARNING: Could not recover jumptable at 0x0005026d. Too many branches */
                    /* WARNING: Treating indirect jump as call */
    uVar9 = (*local_a)();
    return uVar9;
  }
  pbVar12 = param_1;
  FUN_5000_015b(0x6000);
  bVar10 = (byte)iVar5;
  bVar8 = extraout_AH_01;
  if (DAT_6000_cda0 == 0x80) {
    FUN_5000_000e();
    bVar8 = extraout_AH_02;
  }
  bVar10 = ~bVar8 << (bVar10 & 0x1f);
  bVar11 = ~bVar10;
  bVar8 = -1 << ((byte)param_3 & 7 ^ 7);
  iVar7 = ((uint)param_3 >> 3) - ((uint)param_1 >> 3);
  uVar9 = 0x3ce;
  uVar3 = 8;
  if ((char)bVar10 < '\0') {
    if (iVar7 != 0) {
      uVar3 = CONCAT11(bVar11,8);
      out(0x3ce,uVar3);
      *pbVar12 = *pbVar12;
      iVar7 = iVar7 + -1;
      pbVar12 = pbVar12 + 1;
      goto LAB_5000_030b;
    }
    bVar8 = bVar8 & bVar11;
    pbVar13 = pbVar12;
  }
  else {
LAB_5000_030b:
    uVar3 = CONCAT11(0xff,(char)uVar3);
    out(0x3ce,uVar3);
    pbVar13 = pbVar12;
    for (; iVar7 != 0; iVar7 = iVar7 + -1) {
      pbVar2 = pbVar13;
      pbVar13 = pbVar13 + 1;
      pbVar1 = pbVar12;
      pbVar12 = pbVar12 + 1;
      *pbVar2 = *pbVar1;
    }
  }
  out(0x3ce,CONCAT11(bVar8,(char)uVar3));
  *pbVar13 = *pbVar12;
LAB_5000_0374:
  out(uVar9,0);
  out(uVar9,1);
  out(uVar9,3);
  out(uVar9,0xff08);
  return 0xff08;
}


// ==== FUN_5000_0386 @ 5000:0386 (size 420) callers: 

undefined2 __cdecl16far
FUN_5000_0386(undefined2 param_1,undefined2 param_2,uint param_3,uint param_4,byte param_5)

{
  ulong uVar1;
  long lVar2;
  long lVar3;
  uint uVar4;
  uint uVar5;
  uint uVar6;
  int iVar7;
  uint uVar8;
  uint uVar9;
  int iVar10;
  bool bVar11;
  long lVar12;
  uint local_1a;
  int local_18;
  uint local_16;
  int local_14;
  
  out(0x3ce,5);
  out(0x3ce,3);
  out(0x3ce,(uint)param_5 << 8);
  out(0x3ce,0xf01);
  uVar1 = (ulong)param_3 * (ulong)param_3;
  iVar7 = (int)(uVar1 >> 0x10);
  uVar4 = (uint)uVar1;
  uVar8 = iVar7 << 1 | (uint)((int)uVar4 < 0);
  lVar2 = (ulong)param_4 * (ulong)param_4;
  uVar5 = (int)lVar2 * 2;
  uVar9 = (int)((ulong)lVar2 >> 0x10) << 1 | (uint)((int)lVar2 < 0);
  FUN_5000_015b();
  local_16 = 0;
  local_14 = 0;
  lVar12 = FUN_5000_0693();
  lVar3 = FUN_5000_0693();
  lVar3 = (lVar2 + CONCAT22(iVar7 >> 2,
                            (int)(((ulong)((iVar7 >> 1 & 1U) != 0) << 0x10 |
                                  (ulong)(CONCAT12((uVar1 & 0x10000) != 0,uVar4) >> 1)) >> 1))) -
          lVar3;
  while (local_18 = (int)((ulong)lVar12 >> 0x10), local_1a = (uint)lVar12,
        (int)((local_14 - local_18) - (uint)(local_16 < local_1a)) < 0) {
    FUN_5000_052a();
    if (-1 < lVar3) {
      param_4 = param_4 - 1;
      lVar12 = CONCAT22((local_18 - uVar8) - (uint)(local_1a < uVar4 * 2),local_1a + uVar4 * -2);
      lVar3 = lVar3 - lVar12;
    }
    bVar11 = CARRY2(local_16,uVar5);
    local_16 = local_16 + uVar5;
    local_14 = local_14 + uVar9 + (uint)bVar11;
    lVar3 = lVar3 + lVar2 + CONCAT22(local_14,local_16);
  }
  uVar1 = uVar1 - lVar2;
  uVar1 = ((uVar1 + CONCAT22((int)((long)uVar1 >> 0x11),
                             (int)(CONCAT12((uVar1 & 0x10000) != 0,(int)uVar1) >> 1))) -
          CONCAT22(local_14,local_16)) - lVar12;
  lVar3 = lVar3 + CONCAT22((int)((long)uVar1 >> 0x11),
                           (int)(CONCAT12((uVar1 & 0x10000) != 0,(int)uVar1) >> 1));
  do {
    local_18 = (int)((ulong)lVar12 >> 0x10);
    local_1a = (uint)lVar12;
    FUN_5000_052a();
    if (lVar3 < 0) {
      bVar11 = CARRY2(local_16,uVar5);
      local_16 = local_16 + uVar5;
      local_14 = local_14 + uVar9 + (uint)bVar11;
      lVar3 = lVar3 + CONCAT22(local_14,local_16);
    }
    uVar6 = local_1a + uVar4 * -2;
    iVar10 = (local_18 - uVar8) - (uint)(local_1a < uVar4 * 2);
    lVar12 = CONCAT22(iVar10,uVar6);
    lVar3 = lVar3 - CONCAT22((iVar10 - iVar7) - (uint)(uVar6 < uVar4),uVar6 - uVar4);
    param_4 = param_4 - 1;
  } while (-1 < (int)param_4);
  out(0x3ce,0xff08);
  out(0x3ce,3);
  out(0x3ce,1);
  return 1;
}


// ==== FUN_5000_052a @ 5000:052a (size 361) callers: FUN_5000_0386

undefined4 __cdecl16near FUN_5000_052a(void)

{
  byte *pbVar1;
  uint uVar2;
  undefined2 in_AX;
  undefined2 uVar3;
  uint in_CX;
  undefined2 in_DX;
  int iVar5;
  int unaff_BP;
  int iVar6;
  undefined1 *puVar7;
  undefined2 unaff_ES;
  undefined2 unaff_SS;
  byte bVar4;
  
  iVar5 = 0;
  if ((char)(in_CX >> 8) != '\0') {
    iVar5 = -DAT_6000_cda0;
  }
  bVar4 = (byte)in_CX & 7;
  bVar4 = *(byte *)(unaff_BP + -10) << bVar4 | *(byte *)(unaff_BP + -10) >> 8 - bVar4;
  uVar3 = CONCAT11(bVar4,8);
  iVar6 = -(uint)(byte)(((in_CX & 0x1f) != 0) * ((bVar4 & 1) != 0));
  *(byte *)(unaff_BP + -10) = bVar4;
  out(0x3ce,uVar3);
  pbVar1 = (byte *)(unaff_BP + 0x10);
  bVar4 = *pbVar1;
  *pbVar1 = *pbVar1 >> 1 | bVar4 << 7;
  if ((bool)(bVar4 & 1)) {
    puVar7 = (undefined1 *)((iVar6 + *(int *)(unaff_BP + -6)) - iVar5);
    if (((DAT_6000_cda0 == 0x80) && (FUN_5000_000e(), 0x1ff < *(int *)(unaff_BP + 8))) &&
       (FUN_5000_000e(), *(uint *)(unaff_BP + 8) < ((uint)puVar7 >> 7) + 0x200)) {
      FUN_5000_000e();
    }
    *(undefined2 *)(unaff_BP + -6) = puVar7;
    in_CX = CONCAT11(*puVar7,(char)in_CX);
    *puVar7 = *puVar7;
  }
  pbVar1 = (byte *)(unaff_BP + 0x10);
  bVar4 = *pbVar1;
  *pbVar1 = *pbVar1 >> 1 | bVar4 << 7;
  if ((bool)(bVar4 & 1)) {
    puVar7 = (undefined1 *)(iVar6 + *(int *)(unaff_BP + -2) + iVar5);
    if (((DAT_6000_cda0 == 0x80) && (FUN_5000_000e(in_CX,uVar3), *(int *)(unaff_BP + 8) < 0x200)) &&
       (FUN_5000_000e(in_CX,uVar3), (int)((uint)puVar7 >> 7) < *(int *)(unaff_BP + 8))) {
      FUN_5000_000e(in_CX,uVar3);
    }
    *(undefined2 *)(unaff_BP + -2) = puVar7;
    in_CX = CONCAT11(*puVar7,(char)in_CX);
    *puVar7 = *puVar7;
  }
  bVar4 = (byte)in_CX & 7;
  bVar4 = *(byte *)(unaff_BP + -0xc) >> bVar4 | *(byte *)(unaff_BP + -0xc) << 8 - bVar4;
  uVar3 = CONCAT11(bVar4,(char)uVar3);
  uVar2 = (uint)(byte)(((in_CX & 0x1f) != 0) * ((char)bVar4 < '\0'));
  *(byte *)(unaff_BP + -0xc) = bVar4;
  out(0x3ce,uVar3);
  pbVar1 = (byte *)(unaff_BP + 0x10);
  bVar4 = *pbVar1;
  *pbVar1 = *pbVar1 >> 1 | bVar4 << 7;
  if ((bool)(bVar4 & 1)) {
    puVar7 = (undefined1 *)((uVar2 + *(int *)(unaff_BP + -8)) - iVar5);
    if (((DAT_6000_cda0 == 0x80) && (FUN_5000_000e(in_CX,uVar3), 0x1ff < *(int *)(unaff_BP + 8))) &&
       (FUN_5000_000e(in_CX,uVar3), *(uint *)(unaff_BP + 8) < ((uint)puVar7 >> 7) + 0x200)) {
      FUN_5000_000e(in_CX,uVar3);
    }
    *(undefined2 *)(unaff_BP + -8) = puVar7;
    in_CX = CONCAT11(*puVar7,(char)in_CX);
    *puVar7 = *puVar7;
  }
  pbVar1 = (byte *)(unaff_BP + 0x10);
  bVar4 = *pbVar1;
  *pbVar1 = *pbVar1 >> 1 | bVar4 << 7;
  if ((bool)(bVar4 & 1)) {
    puVar7 = (undefined1 *)(uVar2 + *(int *)(unaff_BP + -4) + iVar5);
    if (((DAT_6000_cda0 == 0x80) && (FUN_5000_000e(in_CX,uVar3), *(int *)(unaff_BP + 8) < 0x200)) &&
       (FUN_5000_000e(in_CX,uVar3), (int)((uint)puVar7 >> 7) < *(int *)(unaff_BP + 8))) {
      FUN_5000_000e(in_CX,uVar3);
    }
    *(undefined2 *)(unaff_BP + -4) = puVar7;
    *puVar7 = *puVar7;
  }
  pbVar1 = (byte *)(unaff_BP + 0x10);
  *pbVar1 = *pbVar1 >> 1 | *pbVar1 << 7;
  pbVar1 = (byte *)(unaff_BP + 0x10);
  *pbVar1 = *pbVar1 >> 1 | *pbVar1 << 7;
  pbVar1 = (byte *)(unaff_BP + 0x10);
  *pbVar1 = *pbVar1 >> 1 | *pbVar1 << 7;
  pbVar1 = (byte *)(unaff_BP + 0x10);
  *pbVar1 = *pbVar1 >> 1 | *pbVar1 << 7;
  return CONCAT22(in_DX,in_AX);
}


// ==== FUN_5000_0693 @ 5000:0693 (size 12) callers: FUN_5000_0386

undefined4 __cdecl16near FUN_5000_0693(void)

{
  uint in_AX;
  uint in_CX;
  int in_DX;
  
  return CONCAT22((int)((ulong)in_CX * (ulong)in_AX >> 0x10) + in_DX * in_CX,
                  (int)((ulong)in_CX * (ulong)in_AX));
}


// ==== FUN_5000_07cc @ 5000:07cc (size 39) callers: FUN_5000_07f3,FUN_5000_0986,FUN_5000_0e2e,FUN_5000_0ec7

undefined2 __cdecl16far FUN_5000_07cc(void)

{
  return 0x300;
}


// ==== FUN_5000_07f3 @ 5000:07f3 (size 329) callers: FUN_2000_0769

void __cdecl16far FUN_5000_07f3(byte *param_1,int param_2,byte *param_3,int param_4,byte param_5)

{
  byte *pbVar1;
  byte bVar2;
  undefined1 extraout_AH;
  int iVar3;
  byte extraout_AH_00;
  int iVar4;
  int iVar5;
  int iVar6;
  byte bVar7;
  byte bVar8;
  int iVar9;
  byte *pbVar10;
  undefined2 unaff_ES;
  code *local_a;
  
  iVar6 = param_2;
  pbVar10 = param_1;
  iVar4 = (int)param_3 - (int)param_1;
  if (iVar4 == 0) {
    iVar6 = param_4 - param_2;
    if (param_4 < param_2) {
      iVar6 = -iVar6;
    }
    iVar6 = iVar6 + 1;
    iVar5 = iVar6;
    FUN_5000_07cc();
    iVar3 = CONCAT11(extraout_AH,param_5) << ((byte)iVar6 & 0x1f);
    iVar6 = 0x2000;
    iVar4 = -0x1fb0;
    if (((uint)param_1 & 0x2000) != 0) {
      iVar6 = -0x1fb0;
      iVar4 = 0x2000;
    }
    do {
      iVar9 = iVar6;
      *param_1 = *param_1 & ~(byte)((uint)iVar3 >> 8);
      *param_1 = *param_1 | (byte)iVar3;
      param_1 = param_1 + iVar9;
      iVar5 = iVar5 + -1;
      iVar6 = iVar4;
      iVar4 = iVar9;
    } while (iVar5 != 0);
    return;
  }
  if (iVar4 < 0) {
    iVar4 = -iVar4;
    LOCK();
    param_1 = param_3;
    UNLOCK();
    param_3 = pbVar10;
    LOCK();
    param_2 = param_4;
    UNLOCK();
    param_4 = iVar6;
  }
  param_4 = param_4 - param_2;
  if (param_4 != 0) {
    if (param_4 < 0) {
      param_4 = -param_4;
    }
    local_a = (code *)0x910;
    if (iVar4 < param_4) {
      local_a = (code *)0x959;
      iVar4 = param_4;
    }
    FUN_5000_07cc(iVar4);
    if (((uint)param_1 & 0x2000) != 0) {
      LOCK();
      UNLOCK();
    }
                    /* WARNING: Could not recover jumptable at 0x00050874. Too many branches */
                    /* WARNING: Treating indirect jump as call */
    (*local_a)();
    return;
  }
  pbVar10 = param_1;
  FUN_5000_07cc();
  bVar8 = ~extraout_AH_00 << ((byte)iVar4 & 0x1f);
  bVar7 = -1 << (((byte)param_3 & 3 ^ 3) << 1);
  iVar6 = ((uint)param_3 >> 2) - ((uint)param_1 >> 2);
  bVar2 = *(byte *)(ulong)(param_5 + 0x8a8c);
  if ((char)bVar8 < '\0') {
    if (iVar6 == 0) {
      bVar7 = bVar7 & ~bVar8;
      goto LAB_5000_0903;
    }
    *pbVar10 = *pbVar10 & bVar8;
    *pbVar10 = *pbVar10 | bVar2 & ~bVar8;
    pbVar10 = pbVar10 + 1;
    iVar6 = iVar6 + -1;
  }
  for (; iVar6 != 0; iVar6 = iVar6 + -1) {
    pbVar1 = pbVar10;
    pbVar10 = pbVar10 + 1;
    *pbVar1 = bVar2;
  }
LAB_5000_0903:
  *pbVar10 = *pbVar10 & ~bVar7;
  *pbVar10 = *pbVar10 | bVar2 & bVar7;
  return;
}


// ==== FUN_5000_0986 @ 5000:0986 (size 32) callers: FUN_2000_07d3

void __cdecl16far FUN_5000_0986(byte *param_1,undefined2 param_2,undefined1 param_3)

{
  undefined1 extraout_AH;
  int iVar1;
  byte in_CL;
  undefined2 unaff_ES;
  
  FUN_5000_07cc();
  iVar1 = (CONCAT11(extraout_AH,param_3) & 0xff03) << (in_CL & 0x1f);
  *param_1 = *param_1 & ~(byte)((uint)iVar1 >> 8);
  *param_1 = *param_1 | (byte)iVar1;
  return;
}


// ==== FUN_5000_09a6 @ 5000:09a6 (size 35) callers: FUN_5000_09c9,FUN_5000_0b57,FUN_5000_0f65,FUN_5000_0ff0

undefined2 __cdecl16far FUN_5000_09a6(void)

{
  return 0x100;
}


// ==== FUN_5000_09c9 @ 5000:09c9 (size 324) callers: FUN_2000_06df

void __cdecl16far FUN_5000_09c9(byte *param_1,int param_2,byte *param_3,int param_4,byte param_5)

{
  byte *pbVar1;
  byte bVar2;
  undefined1 extraout_AH;
  byte extraout_AH_00;
  int iVar3;
  int iVar4;
  byte bVar5;
  byte bVar6;
  byte *pbVar7;
  undefined2 unaff_ES;
  code *local_a;
  
  iVar4 = param_2;
  pbVar7 = param_1;
  iVar3 = (int)param_3 - (int)param_1;
  if (iVar3 == 0) {
    iVar4 = param_4 - param_2;
    if (param_4 < param_2) {
      iVar4 = -iVar4;
    }
    iVar4 = iVar4 + 1;
    iVar3 = iVar4;
    FUN_5000_09a6();
    iVar4 = CONCAT11(extraout_AH,param_5) << ((byte)iVar4 & 0x1f);
    bVar2 = (byte)iVar4;
    if (bVar2 != 0) {
      do {
        *param_1 = *param_1 | bVar2;
        pbVar7 = param_1 + 0x2000;
        if ((int)pbVar7 < 0) {
          pbVar7 = param_1 + -0x5fa6;
        }
        iVar3 = iVar3 + -1;
        param_1 = pbVar7;
      } while (iVar3 != 0);
      return;
    }
    do {
      *param_1 = *param_1 & ~(byte)((uint)iVar4 >> 8);
      pbVar7 = param_1 + 0x2000;
      if ((int)pbVar7 < 0) {
        pbVar7 = param_1 + -0x5fa6;
      }
      iVar3 = iVar3 + -1;
      param_1 = pbVar7;
    } while (iVar3 != 0);
    return;
  }
  if (iVar3 < 0) {
    iVar3 = -iVar3;
    LOCK();
    param_1 = param_3;
    UNLOCK();
    param_3 = pbVar7;
    LOCK();
    param_2 = param_4;
    UNLOCK();
    param_4 = iVar4;
  }
  param_4 = param_4 - param_2;
  if (param_4 != 0) {
    if (param_4 < 0) {
      param_4 = -param_4;
    }
    local_a = (code *)0xae3;
    if (iVar3 < param_4) {
      local_a = (code *)0xb2c;
      iVar3 = param_4;
    }
    FUN_5000_09a6(iVar3);
                    /* WARNING: Could not recover jumptable at 0x00050a3f. Too many branches */
                    /* WARNING: Treating indirect jump as call */
    (*local_a)();
    return;
  }
  pbVar7 = param_1;
  FUN_5000_09a6();
  bVar6 = ~extraout_AH_00 << ((byte)iVar3 & 0x1f);
  bVar5 = -1 << ((byte)param_3 & 7 ^ 7);
  iVar4 = ((uint)param_3 >> 3) - ((uint)param_1 >> 3);
  bVar2 = *(byte *)(ulong)(param_5 + 0x8a90);
  if ((char)bVar6 < '\0') {
    if (iVar4 == 0) {
      bVar5 = bVar5 & ~bVar6;
      goto LAB_5000_0ad6;
    }
    *pbVar7 = *pbVar7 & bVar6;
    *pbVar7 = *pbVar7 | bVar2 & ~bVar6;
    pbVar7 = pbVar7 + 1;
    iVar4 = iVar4 + -1;
  }
  for (; iVar4 != 0; iVar4 = iVar4 + -1) {
    pbVar1 = pbVar7;
    pbVar7 = pbVar7 + 1;
    *pbVar1 = bVar2;
  }
LAB_5000_0ad6:
  *pbVar7 = *pbVar7 & ~bVar5;
  *pbVar7 = *pbVar7 | bVar2 & bVar5;
  return;
}


// ==== FUN_5000_0b57 @ 5000:0b57 (size 34) callers: 

void __cdecl16far FUN_5000_0b57(byte *param_1,undefined2 param_2,undefined1 param_3)

{
  undefined1 extraout_AH;
  int iVar1;
  byte in_CL;
  undefined2 unaff_ES;
  
  FUN_5000_09a6();
  iVar1 = (CONCAT11(extraout_AH,param_3) & 0xff01) << (in_CL & 0x1f);
  *param_1 = *param_1 & ~(byte)((uint)iVar1 >> 8);
  *param_1 = *param_1 | (byte)iVar1;
  return;
}


// ==== FUN_5000_0b79 @ 5000:0b79 (size 61) callers: FUN_2000_1485

undefined2 __cdecl16far FUN_5000_0b79(void)

{
  char *pcVar1;
  undefined2 *puVar2;
  char *pcVar3;
  int iVar4;
  char *pcVar5;
  undefined2 *puVar6;
  char *pcVar7;
  
  pcVar7 = (char *)s_Null_pointer_assignment_Divide_e_6000_002f + 0x1a;
  pcVar5 = (char *)&DAT_6000_8aa4;
  for (iVar4 = 0x1e; iVar4 != 0; iVar4 = iVar4 + -1) {
    pcVar3 = pcVar7;
    pcVar7 = pcVar7 + 1;
    pcVar1 = pcVar5;
    pcVar5 = pcVar5 + 1;
    *pcVar3 = *pcVar1;
  }
  out(0x3bf,1);
  out(0x3b8,0);
  puVar6 = (undefined2 *)&DAT_6000_8a92;
  iVar4 = 9;
  do {
    puVar2 = puVar6;
    puVar6 = puVar6 + 1;
    out(0x3b4,*puVar2);
    iVar4 = iVar4 + -1;
  } while (iVar4 != 0);
  out(0x3b8,DAT_6000_8ac0);
  return CONCAT11((char)((uint)*puVar2 >> 8),DAT_6000_8ac0);
}


// ==== FUN_5000_0bb6 @ 5000:0bb6 (size 34) callers: 

void __cdecl16far FUN_5000_0bb6(int param_1,undefined2 param_2,undefined1 param_3)

{
  uint uVar1;
  
  uVar1 = CONCAT11((char)param_2,(char)((uint)param_2 >> 8));
  *(undefined1 *)(param_1 + uVar1 + (uVar1 >> 2)) = param_3;
  return;
}


// ==== FUN_5000_0bd8 @ 5000:0bd8 (size 34) callers: 

void __cdecl16far FUN_5000_0bd8(undefined2 *param_1,uint param_2,undefined1 param_3)

{
  undefined2 *puVar1;
  uint uVar2;
  
  uVar2 = param_2 >> 1;
  if ((param_2 & 1) != 0) {
    *(undefined1 *)param_1 = param_3;
    param_1 = (undefined2 *)((int)param_1 + 1);
  }
  for (; uVar2 != 0; uVar2 = uVar2 - 1) {
    puVar1 = param_1;
    param_1 = param_1 + 1;
    *puVar1 = CONCAT11(param_3,param_3);
  }
  return;
}


// ==== FUN_5000_0bfa @ 5000:0bfa (size 48) callers: 

void __cdecl16far FUN_5000_0bfa(void)

{
  FUN_5000_0c60();
  return;
}


// ==== FUN_5000_0c60 @ 5000:0c60 (size 14) callers: FUN_5000_0bfa

void __cdecl16near FUN_5000_0c60(void)

{
  byte bVar1;
  undefined2 unaff_ES;
  
  do {
    bVar1 = in(CONCAT11((char)((uint)*(undefined2 *)
                                      ((char *)s_Null_pointer_assignment_Divide_e_6000_002f + 0x34)
                              >> 8),
                        (char)*(undefined2 *)
                               ((char *)s_Null_pointer_assignment_Divide_e_6000_002f + 0x34) +
                        '\x06'));
  } while ((bVar1 & 8) == 0);
  return;
}


// ==== FUN_5000_0cca @ 5000:0cca (size 177) callers: FUN_4000_2239,FUN_4000_22a3

undefined2 __cdecl16far
FUN_5000_0cca(undefined1 *param_1,undefined2 param_2,uint param_3,int param_4)

{
  undefined1 *puVar1;
  undefined1 *puVar2;
  int iVar3;
  byte extraout_AH;
  undefined2 uVar4;
  byte in_CL;
  int iVar5;
  int iVar6;
  int iVar7;
  undefined2 uVar8;
  byte bVar9;
  undefined1 *puVar10;
  undefined1 *puVar11;
  undefined1 *puVar12;
  undefined2 unaff_ES;
  
  iVar3 = DAT_6000_cda0;
  out(0x3ce,0x100);
  out(0x3ce,0xf01);
  out(0x3ce,0x1803);
  puVar12 = param_1;
  FUN_5000_015b(0x6000);
  iVar7 = CONCAT11(~(~extraout_AH << (in_CL & 0x1f)),-1 << ((byte)param_3 & 7 ^ 7));
  iVar5 = (param_3 >> 3) - ((uint)param_1 >> 3);
  uVar8 = 0x3ce;
  uVar4 = 8;
  do {
    if (iVar3 == 0x80) {
      uVar4 = FUN_5000_000e();
    }
    iVar6 = iVar5;
    puVar10 = puVar12;
    if (iVar7 < 0) {
LAB_5000_0d53:
      uVar4 = CONCAT11(0xff,(char)uVar4);
      out(uVar8,uVar4);
      puVar11 = puVar10;
      for (; iVar6 != 0; iVar6 = iVar6 + -1) {
        puVar2 = puVar11;
        puVar11 = puVar11 + 1;
        puVar1 = puVar10;
        puVar10 = puVar10 + 1;
        *puVar2 = *puVar1;
      }
    }
    else {
      bVar9 = (byte)((uint)iVar7 >> 8);
      if (iVar5 != 0) {
        uVar4 = CONCAT11(bVar9,(char)uVar4);
        out(uVar8,uVar4);
        puVar10 = puVar12 + 1;
        *puVar12 = *puVar12;
        iVar6 = iVar5 + -1;
        goto LAB_5000_0d53;
      }
      iVar7 = CONCAT11(bVar9,(byte)iVar7 & bVar9);
      puVar11 = puVar12;
    }
    uVar4 = CONCAT11((char)iVar7,(char)uVar4);
    out(uVar8,uVar4);
    *puVar11 = *puVar10;
    puVar12 = puVar12 + iVar3;
    param_4 = param_4 + -1;
    if (param_4 == 0) {
      out(uVar8,0);
      out(uVar8,1);
      out(uVar8,3);
      out(uVar8,0xff08);
      return 0xff08;
    }
  } while( true );
}


// ==== FUN_5000_0d7b @ 5000:0d7b (size 179) callers: 

undefined2 __cdecl16far
FUN_5000_0d7b(undefined1 *param_1,undefined2 param_2,uint param_3,int param_4,byte param_5)

{
  undefined1 *puVar1;
  undefined1 *puVar2;
  int iVar3;
  byte extraout_AH;
  undefined2 uVar4;
  byte in_CL;
  int iVar5;
  int iVar6;
  int iVar7;
  undefined2 uVar8;
  byte bVar9;
  undefined1 *puVar10;
  undefined1 *puVar11;
  undefined1 *puVar12;
  undefined2 unaff_ES;
  
  iVar3 = DAT_6000_cda0;
  out(0x3ce,(uint)param_5 << 8);
  out(0x3ce,0xf01);
  out(0x3ce,3);
  puVar12 = param_1;
  FUN_5000_015b(0x6000);
  iVar7 = CONCAT11(~(~extraout_AH << (in_CL & 0x1f)),-1 << ((byte)param_3 & 7 ^ 7));
  iVar5 = (param_3 >> 3) - ((uint)param_1 >> 3);
  uVar8 = 0x3ce;
  uVar4 = 8;
  do {
    if (iVar3 == 0x80) {
      uVar4 = FUN_5000_000e();
    }
    iVar6 = iVar5;
    puVar10 = puVar12;
    if (iVar7 < 0) {
LAB_5000_0e06:
      uVar4 = CONCAT11(0xff,(char)uVar4);
      out(uVar8,uVar4);
      puVar11 = puVar10;
      for (; iVar6 != 0; iVar6 = iVar6 + -1) {
        puVar2 = puVar11;
        puVar11 = puVar11 + 1;
        puVar1 = puVar10;
        puVar10 = puVar10 + 1;
        *puVar2 = *puVar1;
      }
    }
    else {
      bVar9 = (byte)((uint)iVar7 >> 8);
      if (iVar5 != 0) {
        uVar4 = CONCAT11(bVar9,(char)uVar4);
        out(uVar8,uVar4);
        puVar10 = puVar12 + 1;
        *puVar12 = *puVar12;
        iVar6 = iVar5 + -1;
        goto LAB_5000_0e06;
      }
      iVar7 = CONCAT11(bVar9,(byte)iVar7 & bVar9);
      puVar11 = puVar12;
    }
    uVar4 = CONCAT11((char)iVar7,(char)uVar4);
    out(uVar8,uVar4);
    *puVar11 = *puVar10;
    puVar12 = puVar12 + iVar3;
    param_4 = param_4 + -1;
    if (param_4 == 0) {
      out(uVar8,0);
      out(uVar8,1);
      out(uVar8,3);
      out(uVar8,0xff08);
      return 0xff08;
    }
  } while( true );
}


// ==== FUN_5000_0e2e @ 5000:0e2e (size 153) callers: FUN_4000_21dd

void __cdecl16far
FUN_5000_0e2e(byte *param_1,undefined2 param_2,uint param_3,int param_4,byte param_5)

{
  byte *pbVar1;
  byte extraout_AH;
  byte bVar2;
  int iVar3;
  int iVar4;
  byte bVar5;
  byte bVar6;
  byte bVar7;
  int iVar8;
  int iVar9;
  byte *pbVar10;
  byte *pbVar11;
  undefined2 unaff_ES;
  
  bVar2 = (byte)param_3 - (char)param_1;
  pbVar11 = param_1;
  FUN_5000_07cc();
  bVar7 = ~extraout_AH << (bVar2 & 0x1f);
  bVar5 = -1 << (((byte)param_3 & 3 ^ 3) << 1);
  iVar3 = (param_3 >> 2) - ((uint)param_1 >> 2);
  bVar2 = *(byte *)(ulong)(param_5 + 0x8ae4);
  iVar4 = 0x2000;
  iVar9 = -0x1fb0;
  if (0x1fff < (int)pbVar11) {
    iVar4 = -0x1fb0;
    iVar9 = 0x2000;
  }
  do {
    iVar8 = iVar4;
    iVar4 = iVar3;
    pbVar10 = pbVar11;
    if ((char)bVar7 < '\0') {
      if (iVar3 != 0) {
        *pbVar11 = *pbVar11 & bVar7;
        *pbVar11 = *pbVar11 ^ bVar2 & ~bVar7;
        pbVar10 = pbVar11 + 1;
        iVar4 = iVar3 + -1;
        goto LAB_5000_0ea8;
      }
      bVar6 = bVar5 & ~bVar7;
    }
    else {
LAB_5000_0ea8:
      for (; bVar6 = bVar5, iVar4 != 0; iVar4 = iVar4 + -1) {
        pbVar1 = pbVar10;
        pbVar10 = pbVar10 + 1;
        *pbVar1 = bVar2;
      }
    }
    *pbVar10 = *pbVar10 & ~bVar6;
    *pbVar10 = *pbVar10 ^ bVar2 & bVar6;
    pbVar11 = pbVar11 + iVar8;
    param_4 = param_4 + -1;
    iVar4 = iVar9;
    iVar9 = iVar8;
    if (param_4 == 0) {
      return;
    }
  } while( true );
}


// ==== FUN_5000_0ec7 @ 5000:0ec7 (size 158) callers: FUN_4000_2177,FUN_4000_22a3

void __cdecl16far
FUN_5000_0ec7(byte *param_1,undefined2 param_2,uint param_3,int param_4,byte param_5)

{
  byte extraout_AH;
  byte bVar1;
  int iVar2;
  int iVar3;
  byte bVar4;
  byte bVar5;
  byte bVar6;
  byte bVar7;
  int iVar8;
  int iVar9;
  byte *pbVar10;
  byte *pbVar11;
  undefined2 unaff_ES;
  
  bVar1 = (byte)param_3 - (char)param_1;
  pbVar11 = param_1;
  FUN_5000_07cc();
  bVar6 = ~extraout_AH << (bVar1 & 0x1f);
  bVar7 = ~bVar6;
  bVar4 = -1 << (((byte)param_3 & 3 ^ 3) << 1);
  iVar2 = (param_3 >> 2) - ((uint)param_1 >> 2);
  bVar1 = *(byte *)(ulong)(param_5 + 0x8ae4);
  iVar3 = 0x2000;
  iVar9 = -0x1fb0;
  if (0x1fff < (int)pbVar11) {
    iVar3 = -0x1fb0;
    iVar9 = 0x2000;
  }
  do {
    iVar8 = iVar3;
    iVar3 = iVar2;
    pbVar10 = pbVar11;
    if ((char)bVar6 < '\0') {
      if (iVar2 != 0) {
        *pbVar11 = *pbVar11 ^ bVar1 & bVar7;
        pbVar10 = pbVar11 + 1;
        iVar3 = iVar2 + -1;
        goto LAB_5000_0f3e;
      }
      bVar5 = bVar4 & bVar7;
    }
    else {
LAB_5000_0f3e:
      do {
        bVar5 = bVar4;
        if (iVar3 == 0) break;
        *pbVar10 = *pbVar10 ^ bVar1;
        pbVar10 = pbVar10 + 1;
        iVar3 = iVar3 + -1;
      } while (iVar3 != 0);
    }
    *pbVar10 = *pbVar10 ^ bVar1 & bVar5;
    pbVar11 = pbVar11 + iVar8;
    param_4 = param_4 + -1;
    iVar3 = iVar9;
    iVar9 = iVar8;
    if (param_4 == 0) {
      return;
    }
  } while( true );
}


// ==== FUN_5000_0f65 @ 5000:0f65 (size 139) callers: FUN_4000_220b

void __cdecl16far
FUN_5000_0f65(byte *param_1,undefined2 param_2,uint param_3,int param_4,byte param_5)

{
  byte *pbVar1;
  byte bVar2;
  byte extraout_AH;
  byte in_CL;
  int iVar3;
  int iVar4;
  byte bVar5;
  byte bVar6;
  byte bVar7;
  byte *pbVar8;
  byte *pbVar9;
  undefined2 unaff_ES;
  
  pbVar8 = param_1;
  FUN_5000_09a6();
  bVar7 = ~extraout_AH << (in_CL & 0x1f);
  bVar5 = -1 << ((byte)param_3 & 7 ^ 7);
  iVar3 = (param_3 >> 3) - ((uint)param_1 >> 3);
  bVar2 = *(byte *)(ulong)(param_5 + 0x8ae4);
  do {
    iVar4 = iVar3;
    pbVar9 = pbVar8;
    if ((char)bVar7 < '\0') {
      if (iVar3 != 0) {
        *pbVar8 = *pbVar8 & bVar7;
        *pbVar8 = *pbVar8 | bVar2 & ~bVar7;
        pbVar9 = pbVar8 + 1;
        iVar4 = iVar3 + -1;
        goto LAB_5000_0fcf;
      }
      bVar6 = bVar5 & ~bVar7;
    }
    else {
LAB_5000_0fcf:
      for (; bVar6 = bVar5, iVar4 != 0; iVar4 = iVar4 + -1) {
        pbVar1 = pbVar9;
        pbVar9 = pbVar9 + 1;
        *pbVar1 = bVar2;
      }
    }
    *pbVar9 = *pbVar9 & ~bVar6;
    *pbVar9 = *pbVar9 | bVar2 & bVar6;
    pbVar9 = pbVar8 + 0x2000;
    if ((int)pbVar9 < 0) {
      pbVar9 = pbVar8 + -0x5fa6;
    }
    param_4 = param_4 + -1;
    pbVar8 = pbVar9;
    if (param_4 == 0) {
      return;
    }
  } while( true );
}


// ==== FUN_5000_0ff0 @ 5000:0ff0 (size 144) callers: FUN_4000_21aa,FUN_4000_22a3

void __cdecl16far
FUN_5000_0ff0(byte *param_1,undefined2 param_2,uint param_3,int param_4,byte param_5)

{
  byte bVar1;
  byte extraout_AH;
  byte in_CL;
  int iVar2;
  int iVar3;
  byte bVar4;
  byte bVar5;
  byte bVar6;
  byte bVar7;
  byte *pbVar8;
  byte *pbVar9;
  undefined2 unaff_ES;
  
  pbVar8 = param_1;
  FUN_5000_09a6();
  bVar6 = ~extraout_AH << (in_CL & 0x1f);
  bVar7 = ~bVar6;
  bVar4 = -1 << ((byte)param_3 & 7 ^ 7);
  iVar2 = (param_3 >> 3) - ((uint)param_1 >> 3);
  bVar1 = *(byte *)(ulong)(param_5 + 0x8aec);
  do {
    iVar3 = iVar2;
    pbVar9 = pbVar8;
    if ((char)bVar6 < '\0') {
      if (iVar2 != 0) {
        *pbVar8 = *pbVar8 ^ bVar1 & bVar7;
        pbVar9 = pbVar8 + 1;
        iVar3 = iVar2 + -1;
        goto LAB_5000_1057;
      }
      bVar5 = bVar4 & bVar7;
    }
    else {
LAB_5000_1057:
      do {
        bVar5 = bVar4;
        if (iVar3 == 0) break;
        *pbVar9 = *pbVar9 ^ 0xff;
        pbVar9 = pbVar9 + 1;
        iVar3 = iVar3 + -1;
      } while (iVar3 != 0);
    }
    *pbVar9 = *pbVar9 ^ bVar1 & bVar5;
    pbVar9 = pbVar8 + 0x2000;
    if ((int)pbVar9 < 0) {
      pbVar9 = pbVar8 + -0x5fa6;
    }
    param_4 = param_4 + -1;
    pbVar8 = pbVar9;
    if (param_4 == 0) {
      return;
    }
  } while( true );
}


// ==== FUN_5110_0000 @ 5110:0000 (size 62) callers: FUN_2000_1485,clear_screen

undefined2 __cdecl16far FUN_5110_0000(void)

{
  undefined2 *puVar1;
  code *pcVar2;
  byte bVar3;
  int iVar4;
  undefined2 *puVar5;
  
  pcVar2 = (code *)swi(0x10);
  (*pcVar2)();
  pcVar2 = (code *)swi(0x10);
  (*pcVar2)();
  out(0x3c4,0x604);
  out(0x3c4,0x100);
  out(0x3c2,0xe7);
  out(0x3c4,0x300);
  out(0x3d4,0x11);
  bVar3 = in(0x3d5);
  out(0x3d5,bVar3 & 0x7f);
  puVar5 = (undefined2 *)&DAT_6000_8ac2;
  iVar4 = 0x11;
  do {
    puVar1 = puVar5;
    puVar5 = puVar5 + 1;
    out(0x3d4,*puVar1);
    iVar4 = iVar4 + -1;
  } while (iVar4 != 0);
  return *puVar1;
}


// ==== FUN_5110_003e @ 5110:003e (size 49) callers: 

void __cdecl16far FUN_5110_003e(uint param_1,int param_2,undefined1 param_3)

{
  out(0x3c4,CONCAT11('\x01' << ((byte)param_1 & 3),2));
  *(undefined1 *)((param_1 >> 2) + param_2 * 0x5a) = param_3;
  return;
}


// ==== FUN_5110_006f @ 5110:006f (size 45) callers: FUN_4000_1d4b

undefined1 __cdecl16far FUN_5110_006f(uint param_1,int param_2)

{
  out(0x3ce,CONCAT11((byte)param_1 & 3,4));
  return *(undefined1 *)((param_1 >> 2) + param_2 * 0x5a);
}


// ==== FUN_5110_009c @ 5110:009c (size 55) callers: FUN_4000_2e29

/* WARNING: Globals starting with '_' overlap smaller symbols at the same address */

undefined1 __cdecl16far FUN_5110_009c(undefined1 param_1,int param_2,undefined1 *param_3)

{
  undefined1 *puVar1;
  byte bVar2;
  undefined1 *puVar3;
  undefined2 uVar4;
  
  uVar4 = (undefined2)((ulong)param_3 >> 0x10);
  puVar3 = (undefined1 *)param_3;
  do {
    bVar2 = in(CONCAT11((char)((uint)_DAT_0000_0463 >> 8),(char)_DAT_0000_0463 + '\x06'));
  } while ((bVar2 & 8) == 0);
  out(0x3c8,param_1);
  do {
    out(0x3c9,*puVar3);
    puVar1 = puVar3 + 2;
    out(0x3c9,puVar3[1]);
    puVar3 = puVar3 + 3;
    out(0x3c9,*puVar1);
    param_2 = param_2 + -1;
  } while (param_2 != 0);
  return *puVar1;
}


// ==== FUN_5120_0012 @ 5120:0012 (size 132) callers: FUN_5120_00f3,FUN_5120_02bd,FUN_5120_048a

void __cdecl16near FUN_5120_0012(void)

{
  uint *puVar1;
  uint *puVar2;
  int iVar3;
  uint *in_BX;
  uint *unaff_SI;
  uint *unaff_DI;
  undefined2 unaff_ES;
  
  if ((((unaff_SI[3] & 0x7fff) == 0 && *unaff_SI == 0) && unaff_SI[1] == 0) && unaff_SI[2] == 0) {
    if (in_BX == (uint *)0xffff) {
      return;
    }
    if ((int)in_BX[4] < 0x4001) {
      return;
    }
    if ((((in_BX[3] & 0x7fff) == 0 && *in_BX == 0) && in_BX[1] == 0) && in_BX[2] == 0) {
      return;
    }
  }
  else if (((((in_BX == (uint *)0xffff) || ((int)in_BX[4] < 0x4001)) ||
            ((((in_BX[3] & 0x7fff) == 0 && *in_BX == 0) && in_BX[1] == 0) && in_BX[2] == 0)) ||
           (in_BX[3] < unaff_SI[3])) ||
          ((in_BX[3] <= unaff_SI[3] &&
           ((in_BX[2] < unaff_SI[2] ||
            ((in_BX[2] <= unaff_SI[2] &&
             ((in_BX[1] < unaff_SI[1] || ((in_BX[1] <= unaff_SI[1] && (*in_BX < *unaff_SI)))))))))))
          ) goto LAB_5120_0086;
  unaff_SI = in_BX;
LAB_5120_0086:
  FUN_5120_2714();
  for (iVar3 = 6; iVar3 != 0; iVar3 = iVar3 + -1) {
    puVar2 = unaff_DI;
    unaff_DI = unaff_DI + 1;
    puVar1 = unaff_SI;
    unaff_SI = unaff_SI + 1;
    *puVar2 = *puVar1;
  }
  return;
}


// ==== FUN_5120_00f3 @ 5120:00f3 (size 463) callers: FUN_5120_1b96

void FUN_5120_00f3(uint *param_1,uint *param_2,uint *param_3)

{
  char *pcVar1;
  ulong uVar2;
  byte bVar3;
  char *pcVar4;
  uint uVar5;
  uint uVar6;
  byte bVar7;
  uint uVar8;
  uint uVar9;
  uint uVar10;
  uint uVar11;
  uint uVar12;
  uint uVar13;
  char *pcVar14;
  uint uVar15;
  uint uVar16;
  uint *puVar17;
  int iVar18;
  undefined2 unaff_ES;
  bool bVar19;
  byte local_7;
  char *local_6;
  char local_4;
  
  bVar3 = (byte)param_2[5] ^ (byte)param_3[5];
  pcVar1 = (char *)param_3[4];
  pcVar14 = (char *)param_2[4];
  bVar19 = pcVar1 < (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 2;
  puVar17 = param_3;
  if ((int)pcVar1 < 0x4001) {
    if (0x4000 < (int)pcVar14) {
      bVar19 = false;
      local_7 = FUN_5120_0012();
      puVar17 = param_2;
      if (bVar19) {
        return;
      }
      goto LAB_5120_0099;
    }
    if ((int)pcVar1 < (int)pcVar14) {
      bVar7 = (byte)param_2[5];
      pcVar4 = pcVar14;
      pcVar14 = pcVar1;
      puVar17 = param_2;
    }
    else {
      bVar7 = (byte)param_3[5];
      pcVar4 = pcVar1;
      param_3 = param_2;
    }
    local_6 = (char *)puVar17[4];
    local_7 = bVar7;
    if ((-0x3fff < (int)pcVar14) && (uVar5 = (int)pcVar4 - (int)pcVar14, (int)uVar5 < 0x42)) {
      uVar9 = param_3[1];
      uVar13 = param_3[2];
      uVar11 = param_3[3];
      uVar16 = *param_3;
      local_4 = '\0';
      while (bVar19 = 7 < (int)uVar5, uVar5 = uVar5 - 8, bVar19) {
        local_4 = (char)uVar16;
        uVar16 = CONCAT11((char)uVar9,(char)(uVar16 >> 8));
        uVar9 = CONCAT11((char)uVar13,(char)(uVar9 >> 8));
        uVar13 = CONCAT11((char)uVar11,(char)(uVar13 >> 8));
        uVar11 = uVar11 >> 8;
      }
      for (uVar5 = uVar5 & 7; uVar5 != 0; uVar5 = uVar5 - 1) {
        uVar10 = uVar11 & 1;
        uVar11 = uVar11 >> 1;
        uVar6 = uVar13 & 1;
        local_4 = (char)(CONCAT11((uVar16 & 1) != 0,local_4) >> 1);
        uVar16 = (uint)(CONCAT12((uVar9 & 1) != 0,uVar16) >> 1);
        uVar13 = (uint)(CONCAT12(uVar10 != 0,uVar13) >> 1);
        uVar9 = (uint)(CONCAT12(uVar6 != 0,uVar9) >> 1);
      }
      if (bVar3 != 0) {
        uVar5 = uVar16 - *puVar17;
        uVar10 = (uint)(uVar16 < *puVar17);
        uVar6 = uVar9 - puVar17[1];
        uVar16 = uVar6 - uVar10;
        uVar10 = (uint)(uVar9 < puVar17[1] || uVar6 < uVar10);
        uVar6 = uVar13 - puVar17[2];
        uVar9 = uVar6 - uVar10;
        uVar10 = (uint)(uVar13 < puVar17[2] || uVar6 < uVar10);
        uVar6 = uVar11 - puVar17[3];
        uVar13 = uVar6 - uVar10;
        local_7 = bVar7 ^ 1;
        if (uVar11 < puVar17[3] || uVar6 < uVar10) {
          uVar10 = ~uVar9;
          uVar11 = ~uVar16;
          uVar9 = ~uVar5;
          bVar19 = local_4 == '\0';
          local_4 = -local_4;
          uVar5 = uVar9 + bVar19;
          uVar9 = (uint)CARRY2(uVar9,(uint)bVar19);
          uVar16 = uVar11 + uVar9;
          uVar11 = (uint)CARRY2(uVar11,uVar9);
          uVar9 = uVar10 + uVar11;
          uVar13 = ~uVar13 + (uint)CARRY2(uVar10,uVar11);
          local_7 = bVar7;
        }
        iVar18 = 8;
        do {
          if ((char)(uVar13 >> 8) != '\0') goto LAB_5120_020c;
          uVar13 = CONCAT11((char)uVar13,(char)(uVar9 >> 8));
          uVar9 = CONCAT11((char)uVar9,(char)(uVar16 >> 8));
          uVar16 = CONCAT11((char)uVar16,(char)(uVar5 >> 8));
          uVar5 = CONCAT11((char)uVar5,local_4);
          local_4 = '\0';
          local_6 = local_6 + -8;
          bVar19 = 0 < iVar18;
          iVar18 = iVar18 + -1;
        } while (bVar19);
        local_6 = (char *)0xc001;
        local_7 = 0;
        goto LAB_5120_022e;
      }
      uVar6 = uVar16 + *puVar17;
      uVar5 = (uint)CARRY2(uVar16,*puVar17);
      uVar16 = uVar9 + puVar17[1];
      uVar15 = uVar16 + uVar5;
      uVar5 = (uint)(CARRY2(uVar9,puVar17[1]) || CARRY2(uVar16,uVar5));
      uVar9 = uVar13 + puVar17[2];
      uVar8 = uVar9 + uVar5;
      uVar10 = (uint)(CARRY2(uVar13,puVar17[2]) || CARRY2(uVar9,uVar5));
      bVar19 = CARRY2(uVar11,puVar17[3]);
      uVar11 = uVar11 + puVar17[3];
      uVar12 = uVar11 + uVar10;
      uVar5 = uVar6;
      uVar9 = uVar8;
      uVar13 = uVar12;
      uVar16 = uVar15;
      if (bVar19 || CARRY2(uVar11,uVar10)) {
        uVar13 = (uint)(CONCAT12(bVar19 || CARRY2(uVar11,uVar10),uVar12) >> 1);
        uVar9 = (uint)(CONCAT12((uVar12 & 1) != 0,uVar8) >> 1);
        uVar16 = (uint)(CONCAT12((uVar8 & 1) != 0,uVar15) >> 1);
        uVar5 = (uint)(CONCAT12((uVar15 & 1) != 0,uVar6) >> 1);
        local_4 = (char)(CONCAT11((uVar6 & 1) != 0,local_4) >> 1);
        local_6 = local_6 + 1;
      }
      goto LAB_5120_020e;
    }
  }
  else {
    FUN_5120_0012(param_2);
    if (bVar19) {
      return;
    }
    if ((0x4000 < (int)pcVar14) && (bVar3 != 0)) {
      FUN_5120_0e53();
      return;
    }
    local_7 = (byte)param_3[5];
LAB_5120_0099:
    local_6 = (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 2;
  }
  uVar5 = *puVar17;
  uVar16 = puVar17[1];
  uVar9 = puVar17[2];
  uVar13 = puVar17[3];
LAB_5120_022e:
  *param_1 = uVar5;
  param_1[1] = uVar16;
  param_1[2] = uVar9;
  param_1[3] = uVar13;
  param_1[4] = (uint)local_6;
  *(byte *)(param_1 + 5) = local_7;
  return;
LAB_5120_020c:
  for (; -1 < (int)uVar13; uVar13 = uVar13 * 2 + (uint)((uVar2 & 0x10000) != 0)) {
    local_6 = local_6 + -1;
    bVar19 = local_4 < '\0';
    local_4 = local_4 << 1;
    uVar2 = (ulong)CONCAT12(bVar19,uVar5) << 1;
    uVar5 = (uint)uVar2 | (uint)bVar19;
    bVar19 = (uVar2 & 0x10000) != 0;
    uVar2 = (ulong)CONCAT12(bVar19,uVar16) << 1;
    uVar16 = (uint)uVar2 | (uint)bVar19;
    bVar19 = (uVar2 & 0x10000) != 0;
    uVar2 = (ulong)CONCAT12(bVar19,uVar9) << 1;
    uVar9 = (uint)uVar2 | (uint)bVar19;
  }
LAB_5120_020e:
  bVar19 = CARRY2(uVar5,(uint)(local_4 < '\0'));
  uVar5 = uVar5 + (local_4 < '\0');
  uVar11 = (uint)bVar19;
  uVar10 = (uint)CARRY2(uVar16,uVar11);
  uVar6 = (uint)CARRY2(uVar9,uVar10);
  bVar19 = CARRY2(uVar13,uVar6);
  uVar13 = uVar13 + uVar6;
  if (bVar19) {
    uVar13 = (uint)(CONCAT12(1,uVar13) >> 1);
    local_6 = local_6 + 1;
  }
  if ((int)local_6 < 0x4001) {
    uVar9 = uVar9 + uVar10;
    uVar16 = uVar16 + uVar11;
    if (-0x3fff < (int)local_6) goto LAB_5120_022e;
    local_6 = (char *)0xc001;
  }
  else {
    local_6 = (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 2;
  }
  FUN_5120_2714();
  local_7 = 0;
  uVar5 = 0;
  uVar13 = 0;
  uVar9 = uVar5;
  uVar16 = uVar5;
  goto LAB_5120_022e;
}


// ==== FUN_5120_02bd @ 5120:02bd (size 234) callers: FUN_5120_1b5d,FUN_5120_1b96

byte FUN_5120_02bd(uint *param_1,undefined2 *param_2,int param_3)

{
  int iVar1;
  uint uVar2;
  char *pcVar3;
  uint uVar4;
  ulong uVar5;
  ulong uVar6;
  char *pcVar7;
  uint uVar8;
  byte bVar9;
  uint uVar10;
  uint uVar11;
  char *pcVar12;
  undefined2 unaff_ES;
  bool bVar13;
  bool bVar14;
  long lVar15;
  
  bVar9 = *(byte *)(param_3 + 10) ^ *(byte *)(param_2 + 5);
  pcVar12 = (char *)param_2[4];
  uVar10 = 0xc001;
  pcVar7 = (char *)*(uint *)(param_3 + 8);
  bVar13 = pcVar7 < (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 2;
  if ((int)pcVar7 < 0x4001) {
    bVar13 = pcVar12 < (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 2;
    if ((int)pcVar12 < 0x4001) {
      if ((-0x3fff < (int)pcVar7) && (-0x3fff < (int)pcVar12)) {
        pcVar7 = pcVar7 + (int)pcVar12;
        if ((int)(pcVar7 + -1) < 0x4001) {
          if (-0x3fff < (int)pcVar7) {
            lVar15 = FUN_5120_0353(*param_2,param_2[1],param_2[2],param_2[3]);
            if (-1 < lVar15) {
              pcVar7 = pcVar7 + -1;
              bVar14 = param_3 < 0;
              param_3 = param_3 << 1;
              uVar5 = (ulong)CONCAT12(bVar14,(int)lVar15) << 1;
              bVar13 = (uVar5 & 0x10000) != 0;
              uVar6 = (ulong)CONCAT12(bVar13,pcVar12) << 1;
              pcVar12 = (char *)((uint)uVar6 | (uint)bVar13);
              bVar13 = (uVar6 & 0x10000) != 0;
              uVar6 = (ulong)CONCAT12(bVar13,uVar10) << 1;
              uVar10 = (uint)uVar6 | (uint)bVar13;
              lVar15 = CONCAT22((int)((ulong)lVar15 >> 0x10) << 1 | (uint)((uVar6 & 0x10000) != 0),
                                (uint)uVar5 | (uint)bVar14);
            }
            uVar11 = (uint)((ulong)lVar15 >> 0x10);
            uVar8 = (uint)lVar15 + (uint)(param_3 < 0);
            if (CARRY2((uint)lVar15,(uint)(param_3 < 0))) {
              bVar13 = CARRY2((uint)pcVar12,uVar8);
              pcVar3 = pcVar12 + uVar8;
              pcVar12 = pcVar3 + 1;
              uVar2 = (uint)(bVar13 || (char *)0xfffe < pcVar3);
              bVar13 = CARRY2(uVar10,uVar8);
              uVar4 = uVar10 + uVar8;
              uVar10 = uVar4 + uVar2;
              uVar2 = (uint)(bVar13 || CARRY2(uVar4,uVar2));
              bVar13 = CARRY2(uVar11,uVar8);
              uVar4 = uVar11 + uVar8;
              uVar11 = uVar4 + uVar2;
              if (bVar13 || CARRY2(uVar4,uVar2)) {
                uVar11 = (uint)(CONCAT12(bVar13 || CARRY2(uVar4,uVar2),uVar11) >> 1);
                pcVar7 = pcVar7 + 1;
              }
            }
            *param_1 = uVar8;
            param_1[1] = (uint)pcVar12;
            param_1[2] = uVar10;
            param_1[3] = uVar11;
            param_1[4] = (uint)pcVar7;
            *(byte *)(param_1 + 5) = bVar9;
            return bVar9;
          }
          FUN_5120_2714();
        }
        else {
          FUN_5120_2714();
        }
      }
      goto LAB_5120_026c;
    }
    FUN_5120_0012();
    if (bVar13) {
      return bVar9;
    }
    iVar1 = *(int *)(param_3 + 8);
  }
  else {
    FUN_5120_0012();
    if (bVar13) {
      return bVar9;
    }
    iVar1 = param_2[4];
  }
  if (iVar1 < -0x3ffe) {
    FUN_5120_0e53();
    return bVar9;
  }
LAB_5120_026c:
  FUN_5120_0e3d();
  return bVar9;
}


// ==== FUN_5120_0353 @ 5120:0353 (size 225) callers: FUN_5120_02bd,FUN_5120_154e

undefined4 __cdecl16near FUN_5120_0353(void)

{
  long lVar1;
  uint uVar2;
  uint uVar3;
  uint uVar4;
  uint uVar5;
  uint uVar6;
  uint *unaff_BP;
  uint uVar7;
  uint uVar8;
  uint uVar9;
  uint uVar10;
  uint uVar11;
  uint uVar12;
  uint uVar13;
  undefined2 unaff_SS;
  bool bVar14;
  
  uVar10 = 0;
  uVar3 = 0;
  uVar7 = 0;
  if ((*(byte *)((int)unaff_BP + 0xf) & 0x80) != 0) {
    uVar3 = *unaff_BP;
    uVar7 = unaff_BP[1];
  }
  if ((*(byte *)((int)unaff_BP + 3) & 0x80) != 0) {
    bVar14 = CARRY2(uVar3,unaff_BP[6]);
    uVar3 = uVar3 + unaff_BP[6];
    uVar10 = (uint)bVar14;
    bVar14 = CARRY2(uVar7,unaff_BP[7]);
    uVar5 = uVar7 + unaff_BP[7];
    uVar7 = uVar5 + uVar10;
    uVar10 = (uint)(bVar14 || CARRY2(uVar5,uVar10));
    if ((*(byte *)((int)unaff_BP + 0xf) & 0x80) != 0) {
      uVar10 = uVar10 - 1;
    }
  }
  uVar6 = 0;
  uVar4 = (uint)((ulong)unaff_BP[6] * (ulong)unaff_BP[2] >> 0x10);
  uVar2 = (uint)((ulong)unaff_BP[6] * (ulong)unaff_BP[2]);
  uVar5 = (uint)CARRY2(uVar3,uVar2);
  uVar11 = uVar7 + uVar4;
  uVar8 = uVar11 + uVar5;
  uVar10 = uVar10 + (CARRY2(uVar7,uVar4) || CARRY2(uVar11,uVar5));
  if (unaff_BP[8] != 0) {
    lVar1 = (ulong)unaff_BP[8] * (ulong)*unaff_BP;
    uVar5 = (uint)((ulong)lVar1 >> 0x10);
    uVar3 = (uint)CARRY2(uVar3 + uVar2,(uint)lVar1);
    uVar7 = uVar8 + uVar5;
    uVar6 = uVar7 + uVar3;
    uVar11 = uVar10 + (CARRY2(uVar8,uVar5) || CARRY2(uVar7,uVar3));
    uVar5 = (uint)((ulong)unaff_BP[8] * (ulong)unaff_BP[1] >> 0x10);
    uVar3 = (uint)((ulong)unaff_BP[8] * (ulong)unaff_BP[1]);
    uVar8 = uVar6 + uVar3;
    uVar3 = (uint)CARRY2(uVar6,uVar3);
    uVar7 = uVar11 + uVar5;
    uVar10 = uVar7 + uVar3;
    uVar6 = (uint)(CARRY2(uVar11,uVar5) || CARRY2(uVar7,uVar3));
  }
  uVar4 = (uint)((ulong)unaff_BP[6] * (ulong)unaff_BP[3] >> 0x10);
  uVar3 = (uint)((ulong)unaff_BP[6] * (ulong)unaff_BP[3]);
  uVar9 = uVar8 + uVar3;
  uVar3 = (uint)CARRY2(uVar8,uVar3);
  uVar5 = uVar10 + uVar4;
  uVar12 = uVar5 + uVar3;
  uVar8 = (uint)((ulong)unaff_BP[7] * (ulong)unaff_BP[2] >> 0x10);
  uVar2 = (uint)((ulong)unaff_BP[7] * (ulong)unaff_BP[2]);
  uVar7 = (uint)CARRY2(uVar9,uVar2);
  uVar11 = uVar12 + uVar8;
  uVar13 = uVar11 + uVar7;
  uVar3 = uVar6 + (CARRY2(uVar10,uVar4) || CARRY2(uVar5,uVar3)) +
          (uint)(CARRY2(uVar12,uVar8) || CARRY2(uVar11,uVar7));
  if (unaff_BP[9] != 0) {
    lVar1 = (ulong)unaff_BP[9] * (ulong)*unaff_BP;
    uVar10 = (uint)((ulong)lVar1 >> 0x10);
    uVar7 = (uint)CARRY2(uVar9 + uVar2,(uint)lVar1);
    bVar14 = CARRY2(uVar13,uVar10);
    uVar10 = uVar13 + uVar10;
    uVar13 = uVar10 + uVar7;
    uVar3 = uVar3 + (bVar14 || CARRY2(uVar10,uVar7));
  }
  uVar10 = 0;
  uVar6 = (uint)((ulong)unaff_BP[7] * (ulong)unaff_BP[3] >> 0x10);
  uVar7 = (uint)((ulong)unaff_BP[7] * (ulong)unaff_BP[3]);
  uVar2 = uVar13 + uVar7;
  uVar7 = (uint)CARRY2(uVar13,uVar7);
  uVar5 = uVar3 + uVar6;
  uVar11 = uVar5 + uVar7;
  uVar3 = (uint)(CARRY2(uVar3,uVar6) || CARRY2(uVar5,uVar7));
  if (unaff_BP[8] != 0) {
    lVar1 = (ulong)unaff_BP[8] * (ulong)unaff_BP[2];
    uVar5 = (uint)((ulong)lVar1 >> 0x10);
    uVar7 = (uint)lVar1;
    bVar14 = CARRY2(uVar2,uVar7);
    uVar2 = uVar2 + uVar7;
    uVar7 = (uint)bVar14;
    uVar10 = uVar11 + uVar5;
    uVar4 = uVar10 + uVar7;
    uVar5 = uVar3 + (CARRY2(uVar11,uVar5) || CARRY2(uVar10,uVar7));
    uVar6 = (uint)((ulong)unaff_BP[8] * (ulong)unaff_BP[3] >> 0x10);
    uVar3 = (uint)((ulong)unaff_BP[8] * (ulong)unaff_BP[3]);
    uVar11 = uVar4 + uVar3;
    uVar7 = (uint)CARRY2(uVar4,uVar3);
    uVar10 = uVar5 + uVar6;
    uVar3 = uVar10 + uVar7;
    uVar10 = (uint)(CARRY2(uVar5,uVar6) || CARRY2(uVar10,uVar7));
  }
  if (unaff_BP[9] != 0) {
    lVar1 = (ulong)unaff_BP[9] * (ulong)unaff_BP[1];
    uVar5 = (uint)((ulong)lVar1 >> 0x10);
    uVar7 = (uint)lVar1;
    bVar14 = CARRY2(uVar2,uVar7);
    uVar2 = uVar2 + uVar7;
    uVar7 = (uint)bVar14;
    uVar6 = uVar11 + uVar5;
    uVar5 = (uint)(CARRY2(uVar11,uVar5) || CARRY2(uVar6,uVar7));
    uVar11 = uVar3 + uVar5;
    uVar4 = (uint)((ulong)unaff_BP[9] * (ulong)unaff_BP[2] >> 0x10);
    uVar7 = (uint)CARRY2(uVar6 + uVar7,(uint)((ulong)unaff_BP[9] * (ulong)unaff_BP[2]));
    uVar6 = uVar11 + uVar4;
    uVar10 = uVar10 + CARRY2(uVar3,uVar5) + (uint)(CARRY2(uVar11,uVar4) || CARRY2(uVar6,uVar7)) +
             (int)((ulong)unaff_BP[9] * (ulong)unaff_BP[3] >> 0x10) +
             (uint)CARRY2(uVar6 + uVar7,(uint)((ulong)unaff_BP[9] * (ulong)unaff_BP[3]));
  }
  return CONCAT22(uVar10,uVar2);
}


// ==== FUN_5120_048a @ 5120:048a (size 973) callers: FUN_5120_1b96

void FUN_5120_048a(uint *param_1,uint *param_2,uint *param_3)

{
  char *pcVar1;
  char *pcVar2;
  uint uVar3;
  ulong uVar4;
  long lVar5;
  long lVar6;
  uint uVar7;
  uint uVar8;
  uint uVar9;
  uint uVar10;
  uint uVar11;
  uint uVar12;
  uint uVar13;
  uint uVar14;
  uint uVar15;
  byte bVar17;
  uint uVar16;
  uint uVar18;
  uint uVar19;
  uint uVar20;
  uint uVar21;
  uint uVar22;
  uint uVar23;
  uint uVar24;
  uint uVar25;
  uint uVar26;
  uint uVar27;
  int iVar28;
  uint uVar29;
  uint uVar30;
  undefined2 unaff_ES;
  bool bVar31;
  bool bVar32;
  uint local_e;
  uint local_c;
  byte local_a;
  uint local_8;
  
  uVar7 = param_3[5];
  uVar8 = param_2[5];
  pcVar1 = (char *)param_2[4];
  pcVar2 = (char *)param_3[4];
  bVar31 = pcVar1 < (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 2;
  if (0x4000 < (int)pcVar1) {
    FUN_5120_0012();
    if (bVar31) {
      return;
    }
    if (0x4000 < (int)param_3[4]) {
      FUN_5120_0e53();
      return;
    }
    goto LAB_5120_0463;
  }
  bVar31 = pcVar2 < (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 2;
  if (0x4000 < (int)pcVar2) {
    FUN_5120_0012();
    if (bVar31) {
      return;
    }
    goto LAB_5120_0463;
  }
  if ((int)pcVar1 < -0x3ffe) {
LAB_5120_045d:
    FUN_5120_2714();
    goto LAB_5120_0463;
  }
  if ((int)pcVar2 < -0x3ffe) goto LAB_5120_0463;
  local_8 = (int)pcVar2 - (int)pcVar1;
  if (0x4000 < (int)local_8) goto LAB_5120_045d;
  if ((int)local_8 < -0x3ffe) {
    FUN_5120_2714();
    goto LAB_5120_0463;
  }
  uVar3 = param_2[3];
  uVar9 = param_2[2];
  uVar16 = param_2[1];
  uVar15 = *param_2;
  local_a = 0;
  uVar27 = param_3[3];
  uVar22 = param_3[2];
  if ((uVar9 == 0) && (uVar16 == 0 && uVar15 == 0)) {
    local_a = uVar3 <= uVar27;
    if ((bool)local_a) {
      uVar27 = uVar27 - uVar3;
    }
    local_c = (uint)(CONCAT22(uVar27,uVar22) / (ulong)uVar3);
    uVar4 = CONCAT22(uVar27,uVar22) % (ulong)uVar3 << 0x10 | (ulong)param_3[1];
    local_e = (uint)(uVar4 / uVar3);
    uVar4 = uVar4 % (ulong)uVar3 << 0x10 | (ulong)*param_3;
    uVar15 = (uint)(uVar4 / uVar3);
    uVar4 = uVar4 % (ulong)uVar3 << 0x10;
    uVar9 = (uint)(uVar4 / uVar3);
    bVar17 = (byte)(uVar4 % (ulong)uVar3 >> 8);
  }
  else {
    uVar10 = param_3[1];
    uVar18 = *param_3;
    if (uVar27 < uVar3) {
LAB_5120_056a:
      uVar4 = CONCAT22(uVar27,uVar22) / (ulong)uVar3;
      local_c = (uint)uVar4;
      lVar5 = (uVar4 & 0xffff) * (ulong)uVar3;
      uVar24 = (uint)lVar5;
      uVar30 = uVar22 - uVar24;
      lVar6 = (ulong)uVar9 * (uVar4 & 0xffff);
      uVar20 = (uint)((ulong)lVar6 >> 0x10);
      uVar11 = (uint)lVar6;
      uVar12 = uVar10 - uVar11;
      uVar13 = (uint)(uVar10 < uVar11);
      uVar23 = uVar30 - uVar20;
      uVar25 = uVar23 - uVar13;
      lVar6 = (ulong)uVar16 * (uVar4 & 0xffff);
      uVar11 = (uint)((ulong)lVar6 >> 0x10);
      uVar10 = (uint)lVar6;
      uVar29 = uVar18 - uVar10;
      uVar10 = (uint)(uVar18 < uVar10);
      uVar18 = uVar12 - uVar11;
      uVar19 = uVar18 - uVar10;
      uVar14 = (uint)(uVar12 < uVar11 || uVar18 < uVar10);
      uVar26 = uVar25 - uVar14;
      lVar6 = (ulong)uVar15 * (uVar4 & 0xffff);
      uVar21 = (uint)((ulong)lVar6 >> 0x10);
      iVar28 = (int)lVar6;
      uVar10 = -iVar28;
      uVar18 = (uint)(iVar28 != 0);
      uVar12 = uVar29 - uVar21;
      uVar11 = uVar12 - uVar18;
      uVar12 = (uint)(uVar29 < uVar21 || uVar12 < uVar18);
      uVar18 = uVar19 - uVar12;
      uVar19 = (uint)(uVar19 < uVar12);
      uVar12 = uVar26 - uVar19;
      if ((int)(uint)(uVar26 < uVar19) <=
          (int)((((uVar27 - (int)((ulong)lVar5 >> 0x10)) - (uint)(uVar22 < uVar24)) -
                (uint)(uVar30 < uVar20 || uVar23 < uVar13)) - (uint)(uVar25 < uVar14)))
      goto LAB_5120_0636;
      if (uVar3 <= -uVar12) {
        bVar31 = local_c == 0;
        local_c = local_c - 1;
        local_a = local_a - bVar31;
        bVar31 = CARRY2(uVar10,uVar15);
        uVar10 = uVar10 + uVar15;
        bVar32 = CARRY2(uVar11,uVar16);
        uVar27 = uVar11 + uVar16;
        uVar11 = uVar27 + bVar31;
        uVar27 = (uint)(bVar32 || CARRY2(uVar27,(uint)bVar31));
        bVar31 = CARRY2(uVar18,uVar9);
        uVar22 = uVar18 + uVar9;
        uVar18 = uVar22 + uVar27;
        uVar27 = (uint)(bVar31 || CARRY2(uVar22,uVar27));
        bVar31 = SCARRY2(uVar12,uVar3);
        iVar28 = uVar12 + uVar3;
        uVar12 = iVar28 + uVar27;
        if ((bVar31 != SCARRY2(iVar28,uVar27)) == (int)uVar12 < 0) goto LAB_5120_0636;
      }
LAB_5120_05cd:
      uVar4 = CONCAT22(-(uint)(uVar18 != 0) - uVar12,-uVar18) / (ulong)uVar3;
      lVar6 = (uVar4 & 0xffff) * (ulong)uVar3 + CONCAT22(uVar12,uVar18);
      uVar12 = (uint)lVar6;
      lVar5 = (ulong)uVar9 * (uVar4 & 0xffff);
      uVar13 = (uint)((ulong)lVar5 >> 0x10);
      uVar27 = (uint)lVar5;
      uVar19 = uVar11 + uVar27;
      uVar27 = (uint)CARRY2(uVar11,uVar27);
      uVar18 = uVar12 + uVar13;
      uVar11 = uVar18 + uVar27;
      lVar5 = (ulong)uVar16 * (uVar4 & 0xffff);
      uVar14 = (uint)((ulong)lVar5 >> 0x10);
      uVar22 = (uint)lVar5;
      uVar24 = uVar10 + uVar22;
      uVar22 = (uint)CARRY2(uVar10,uVar22);
      uVar10 = uVar19 + uVar14;
      uVar23 = uVar10 + uVar22;
      uVar22 = (uint)(CARRY2(uVar19,uVar14) || CARRY2(uVar10,uVar22));
      uVar10 = uVar11 + uVar22;
      iVar28 = (int)((ulong)lVar6 >> 0x10) + (uint)(CARRY2(uVar12,uVar13) || CARRY2(uVar18,uVar27))
               + (uint)CARRY2(uVar11,uVar22);
      uVar27 = (uint)((ulong)uVar15 * (uVar4 & 0xffff) >> 0x10);
      local_e = -(int)uVar4;
      uVar15 = (uint)((int)uVar4 != 0);
      bVar31 = local_c < uVar15;
      local_c = local_c - uVar15;
      local_a = local_a - bVar31;
      uVar30 = uVar24 + uVar27;
      uVar15 = (uint)CARRY2(uVar24,uVar27);
      uVar20 = uVar23 + uVar15;
      uVar15 = (uint)CARRY2(uVar23,uVar15);
      uVar23 = uVar10 + uVar15;
      uVar15 = (uint)CARRY2(uVar10,uVar15);
      if (SCARRY2(iVar28,uVar15) != (int)(iVar28 + uVar15) < 0) goto LAB_5120_0694;
      if (uVar3 <= uVar23) {
        bVar32 = 0xfffe < local_e;
        local_e = local_e + 1;
        bVar31 = CARRY2(local_c,(uint)bVar32);
        local_c = local_c + bVar32;
        local_a = local_a + bVar31;
        bVar31 = uVar30 < uVar16;
        uVar30 = uVar30 - uVar16;
        bVar32 = uVar20 < uVar9;
        uVar15 = uVar20 - uVar9;
        uVar20 = uVar15 - bVar31;
        uVar15 = (uint)(bVar32 || uVar15 < bVar31);
        bVar31 = SBORROW2(uVar23,uVar3);
        iVar28 = uVar23 - uVar3;
        uVar23 = iVar28 - uVar15;
        if ((bVar31 != SBORROW2(iVar28,uVar15)) != (int)uVar23 < 0) goto LAB_5120_0694;
      }
LAB_5120_06e9:
      uVar4 = CONCAT22(uVar23,uVar20) / (ulong)uVar3;
      uVar15 = (uint)uVar4;
      lVar5 = (uVar4 & 0xffff) * (ulong)uVar3;
      uVar11 = (uint)lVar5;
      uVar13 = uVar20 - uVar11;
      lVar6 = (ulong)uVar9 * (uVar4 & 0xffff);
      uVar12 = (uint)((ulong)lVar6 >> 0x10);
      uVar27 = (uint)lVar6;
      uVar19 = uVar30 - uVar27;
      uVar10 = (uint)(uVar30 < uVar27);
      uVar18 = uVar13 - uVar12;
      uVar14 = uVar18 - uVar10;
      uVar16 = (uint)((ulong)uVar16 * (uVar4 & 0xffff) >> 0x10);
      uVar22 = uVar19 - uVar16;
      uVar16 = (uint)(uVar19 < uVar16);
      uVar27 = uVar14 - uVar16;
      if ((int)(((uVar23 - (int)((ulong)lVar5 >> 0x10)) - (uint)(uVar20 < uVar11)) -
               (uint)(uVar13 < uVar12 || uVar18 < uVar10)) < (int)(uint)(uVar14 < uVar16)) {
        if (uVar3 <= -uVar27) {
          bVar32 = uVar15 == 0;
          uVar15 = uVar15 - 1;
          bVar31 = local_e < bVar32;
          local_e = local_e - bVar32;
          uVar16 = (uint)bVar31;
          bVar31 = local_c < uVar16;
          local_c = local_c - uVar16;
          local_a = local_a - bVar31;
          bVar31 = CARRY2(uVar22,uVar9);
          uVar22 = uVar22 + uVar9;
          bVar32 = SCARRY2(uVar27,uVar3);
          iVar28 = uVar27 + uVar3;
          uVar27 = iVar28 + (uint)bVar31;
          if ((bVar32 != SCARRY2(iVar28,(uint)bVar31)) == (int)uVar27 < 0) goto LAB_5120_0773;
        }
LAB_5120_0731:
        uVar9 = uVar3 - (uVar9 >> 1);
        uVar27 = -(uint)(uVar9 < uVar22) - uVar27;
        if (uVar27 < uVar3) {
          uVar4 = CONCAT22(uVar27,uVar9 - uVar22);
          iVar28 = (int)(uVar4 / uVar3);
          bVar17 = (byte)(-((int)(uVar4 % (ulong)uVar3) - uVar3) >> 8);
          bVar31 = iVar28 != 0;
          uVar9 = -iVar28;
        }
        else {
          uVar9 = 0;
          bVar17 = 0;
          bVar31 = true;
        }
        bVar32 = uVar15 < bVar31;
        uVar15 = uVar15 - bVar31;
        if (bVar32) {
          bVar31 = local_e == 0;
          local_e = local_e - 1;
          bVar32 = local_c < bVar31;
          local_c = local_c - bVar31;
          local_a = local_a - bVar32;
        }
        goto LAB_5120_0791;
      }
    }
    else {
      local_a = 1;
      bVar31 = uVar18 < uVar15;
      uVar18 = uVar18 - uVar15;
      bVar32 = uVar10 < uVar16;
      uVar11 = uVar10 - uVar16;
      uVar10 = uVar11 - bVar31;
      uVar11 = (uint)(bVar32 || uVar11 < bVar31);
      bVar31 = uVar22 < uVar9;
      uVar12 = uVar22 - uVar9;
      uVar22 = uVar12 - uVar11;
      uVar11 = (uint)(bVar31 || uVar12 < uVar11);
      bVar31 = uVar3 <= uVar27;
      uVar12 = uVar27 - uVar3;
      uVar27 = uVar12 - uVar11;
      if (bVar31 && uVar11 <= uVar12) goto LAB_5120_056a;
      uVar4 = CONCAT22(-(uint)(uVar22 != 0) - uVar27,-uVar22) / (ulong)uVar3;
      lVar6 = (uVar4 & 0xffff) * (ulong)uVar3 + CONCAT22(uVar27,uVar22);
      uVar23 = (uint)lVar6;
      lVar5 = (ulong)uVar9 * (uVar4 & 0xffff);
      uVar13 = (uint)((ulong)lVar5 >> 0x10);
      uVar27 = (uint)lVar5;
      uVar11 = uVar10 + uVar27;
      uVar27 = (uint)CARRY2(uVar10,uVar27);
      uVar10 = uVar23 + uVar13;
      uVar24 = uVar10 + uVar27;
      lVar5 = (ulong)uVar16 * (uVar4 & 0xffff);
      uVar14 = (uint)((ulong)lVar5 >> 0x10);
      uVar22 = (uint)lVar5;
      uVar19 = uVar18 + uVar22;
      uVar22 = (uint)CARRY2(uVar18,uVar22);
      uVar18 = uVar11 + uVar14;
      uVar12 = uVar18 + uVar22;
      uVar22 = (uint)(CARRY2(uVar11,uVar14) || CARRY2(uVar18,uVar22));
      uVar14 = uVar24 + uVar22;
      iVar28 = (int)((ulong)lVar6 >> 0x10) + (uint)(CARRY2(uVar23,uVar13) || CARRY2(uVar10,uVar27))
               + (uint)CARRY2(uVar24,uVar22);
      lVar5 = (ulong)uVar15 * (uVar4 & 0xffff);
      uVar27 = (uint)((ulong)lVar5 >> 0x10);
      uVar10 = (uint)lVar5;
      local_c = -(int)uVar4;
      local_a = 1 - ((int)uVar4 != 0);
      uVar11 = uVar19 + uVar27;
      uVar27 = (uint)CARRY2(uVar19,uVar27);
      uVar18 = uVar12 + uVar27;
      uVar27 = (uint)CARRY2(uVar12,uVar27);
      uVar12 = uVar14 + uVar27;
      uVar27 = (uint)CARRY2(uVar14,uVar27);
      bVar31 = SCARRY2(iVar28,uVar27);
      bVar32 = (int)(iVar28 + uVar27) < 0;
      if (bVar31 != bVar32) {
LAB_5120_0565:
        if (bVar31 == bVar32) goto LAB_5120_0636;
        goto LAB_5120_05cd;
      }
      if (uVar3 <= uVar12) {
        bVar31 = 0xfffe < local_c;
        local_c = local_c + 1;
        local_a = local_a + bVar31;
        bVar31 = uVar10 < uVar15;
        uVar10 = uVar10 - uVar15;
        bVar32 = uVar11 < uVar16;
        uVar27 = uVar11 - uVar16;
        uVar11 = uVar27 - bVar31;
        uVar27 = (uint)(bVar32 || uVar27 < bVar31);
        bVar31 = uVar18 < uVar9;
        uVar22 = uVar18 - uVar9;
        uVar18 = uVar22 - uVar27;
        uVar27 = (uint)(bVar31 || uVar22 < uVar27);
        bVar31 = SBORROW2(uVar12,uVar3) != SBORROW2(uVar12 - uVar3,uVar27);
        uVar12 = (uVar12 - uVar3) - uVar27;
        bVar32 = (int)uVar12 < 0;
        goto LAB_5120_0565;
      }
LAB_5120_0636:
      uVar4 = CONCAT22(uVar12,uVar18) / (ulong)uVar3;
      local_e = (uint)uVar4;
      lVar5 = (uVar4 & 0xffff) * (ulong)uVar3;
      uVar13 = (uint)lVar5;
      uVar14 = uVar18 - uVar13;
      lVar6 = (ulong)uVar9 * (uVar4 & 0xffff);
      uVar24 = (uint)((ulong)lVar6 >> 0x10);
      uVar27 = (uint)lVar6;
      uVar20 = uVar11 - uVar27;
      uVar27 = (uint)(uVar11 < uVar27);
      uVar11 = uVar14 - uVar24;
      uVar19 = uVar11 - uVar27;
      lVar6 = (ulong)uVar16 * (uVar4 & 0xffff);
      uVar23 = (uint)((ulong)lVar6 >> 0x10);
      uVar22 = (uint)lVar6;
      uVar29 = uVar10 - uVar22;
      uVar22 = (uint)(uVar10 < uVar22);
      uVar10 = uVar20 - uVar23;
      uVar21 = uVar10 - uVar22;
      uVar22 = (uint)(uVar20 < uVar23 || uVar10 < uVar22);
      uVar10 = uVar19 - uVar22;
      uVar15 = (uint)((ulong)uVar15 * (uVar4 & 0xffff) >> 0x10);
      uVar30 = uVar29 - uVar15;
      uVar15 = (uint)(uVar29 < uVar15);
      uVar20 = uVar21 - uVar15;
      uVar15 = (uint)(uVar21 < uVar15);
      uVar23 = uVar10 - uVar15;
      if ((int)(uint)(uVar10 < uVar15) <=
          (int)((((uVar12 - (int)((ulong)lVar5 >> 0x10)) - (uint)(uVar18 < uVar13)) -
                (uint)(uVar14 < uVar24 || uVar11 < uVar27)) - (uint)(uVar19 < uVar22)))
      goto LAB_5120_06e9;
      if (uVar3 <= -uVar23) {
        bVar32 = local_e == 0;
        local_e = local_e - 1;
        bVar31 = local_c < bVar32;
        local_c = local_c - bVar32;
        local_a = local_a - bVar31;
        bVar31 = CARRY2(uVar30,uVar16);
        uVar30 = uVar30 + uVar16;
        bVar32 = CARRY2(uVar20,uVar9);
        uVar15 = uVar20 + uVar9;
        uVar20 = uVar15 + bVar31;
        uVar15 = (uint)(bVar32 || CARRY2(uVar15,(uint)bVar31));
        bVar31 = SCARRY2(uVar23,uVar3);
        iVar28 = uVar23 + uVar3;
        uVar23 = iVar28 + uVar15;
        if ((bVar31 != SCARRY2(iVar28,uVar15)) == (int)uVar23 < 0) goto LAB_5120_06e9;
      }
LAB_5120_0694:
      uVar4 = CONCAT22(-(uint)(uVar20 != 0) - uVar23,-uVar20) / (ulong)uVar3;
      lVar6 = (uVar4 & 0xffff) * (ulong)uVar3 + CONCAT22(uVar23,uVar20);
      uVar10 = (uint)lVar6;
      lVar5 = (ulong)uVar9 * (uVar4 & 0xffff);
      uVar22 = (uint)((ulong)lVar5 >> 0x10);
      uVar15 = (uint)lVar5;
      uVar11 = uVar30 + uVar15;
      uVar15 = (uint)CARRY2(uVar30,uVar15);
      uVar27 = uVar10 + uVar22;
      uVar18 = uVar27 + uVar15;
      iVar28 = (int)((ulong)lVar6 >> 0x10) + (uint)(CARRY2(uVar10,uVar22) || CARRY2(uVar27,uVar15));
      uVar27 = (uint)((ulong)uVar16 * (uVar4 & 0xffff) >> 0x10);
      uVar15 = -(int)uVar4;
      uVar16 = (uint)((int)uVar4 != 0);
      bVar31 = local_e < uVar16;
      local_e = local_e - uVar16;
      uVar16 = (uint)bVar31;
      bVar31 = local_c < uVar16;
      local_c = local_c - uVar16;
      local_a = local_a - bVar31;
      uVar22 = uVar11 + uVar27;
      uVar16 = (uint)CARRY2(uVar11,uVar27);
      uVar27 = uVar18 + uVar16;
      uVar16 = (uint)CARRY2(uVar18,uVar16);
      if (SCARRY2(iVar28,uVar16) != (int)(iVar28 + uVar16) < 0) goto LAB_5120_0731;
      if (uVar3 <= uVar27) {
        bVar32 = 0xfffe < uVar15;
        uVar15 = uVar15 + 1;
        bVar31 = CARRY2(local_e,(uint)bVar32);
        local_e = local_e + bVar32;
        uVar16 = (uint)bVar31;
        bVar31 = CARRY2(local_c,uVar16);
        local_c = local_c + uVar16;
        local_a = local_a + bVar31;
        bVar31 = uVar22 < uVar9;
        uVar22 = uVar22 - uVar9;
        bVar32 = SBORROW2(uVar27,uVar3);
        iVar28 = uVar27 - uVar3;
        uVar27 = iVar28 - (uint)bVar31;
        if ((bVar32 != SBORROW2(iVar28,(uint)bVar31)) != (int)uVar27 < 0) goto LAB_5120_0731;
      }
    }
LAB_5120_0773:
    uVar9 = -(uVar9 >> 1);
    uVar16 = ((int)uVar9 >> 0xf) + uVar27 + (uint)CARRY2(uVar9,uVar22);
    if (uVar16 < uVar3) {
      uVar4 = CONCAT22(uVar16,uVar9 + uVar22);
      uVar9 = (uint)(uVar4 / uVar3);
      bVar17 = (byte)(uVar4 % (ulong)uVar3 >> 8);
    }
    else {
      uVar9 = 0;
      bVar17 = 0;
    }
  }
LAB_5120_0791:
  uVar10 = uVar9;
  uVar27 = local_e;
  uVar22 = uVar15;
  uVar16 = local_c;
  if ((bool)(local_a & 1)) {
    uVar16 = (uint)((CONCAT12(local_a,local_c) & 0x1ffff) >> 1);
    uVar27 = (uint)(CONCAT12((local_c & 1) != 0,local_e) >> 1);
    uVar22 = (uint)(CONCAT12((local_e & 1) != 0,uVar15) >> 1);
    uVar10 = (uint)(CONCAT12((uVar15 & 1) != 0,uVar9) >> 1);
    bVar17 = (byte)(CONCAT11((uVar9 & 1) != 0,bVar17) >> 1);
    local_8 = local_8 + 1;
  }
  uVar3 = (uint)((byte)(uVar3 >> 9) < bVar17);
  uVar9 = uVar10 + uVar3;
  if (CARRY2(uVar10,uVar3)) {
    bVar31 = CARRY2(uVar22,uVar9);
    uVar3 = uVar22 + uVar9;
    uVar22 = uVar3 + 1;
    uVar3 = (uint)(bVar31 || 0xfffe < uVar3);
    bVar31 = CARRY2(uVar27,uVar9);
    uVar15 = uVar27 + uVar9;
    uVar27 = uVar15 + uVar3;
    uVar3 = (uint)(bVar31 || CARRY2(uVar15,uVar3));
    bVar31 = CARRY2(uVar16,uVar9);
    uVar15 = uVar16 + uVar9;
    uVar16 = uVar15 + uVar3;
    if (bVar31 || CARRY2(uVar15,uVar3)) {
      uVar16 = (uint)(CONCAT12(bVar31 || CARRY2(uVar15,uVar3),uVar16) >> 1);
      local_8 = local_8 + 1;
    }
  }
  if ((int)local_8 < 0x4001) {
    *param_1 = uVar9;
    param_1[1] = uVar22;
    param_1[2] = uVar27;
    param_1[3] = uVar16;
    param_1[4] = local_8;
    *(byte *)(param_1 + 5) = (byte)uVar7 ^ (byte)uVar8;
    return;
  }
LAB_5120_0463:
  FUN_5120_0e3d();
  return;
}


// ==== FUN_5120_0dc1 @ 5120:0dc1 (size 24) callers: FUN_5120_1b96

undefined1 * __cdecl16near FUN_5120_0dc1(void)

{
  undefined2 *puVar1;
  undefined2 *puVar2;
  int iVar3;
  undefined2 *puVar4;
  undefined2 *unaff_DI;
  undefined2 unaff_ES;
  
  puVar4 = (undefined2 *)0xdb5;
  for (iVar3 = 5; iVar3 != 0; iVar3 = iVar3 + -1) {
    puVar2 = unaff_DI;
    unaff_DI = unaff_DI + 1;
    puVar1 = puVar4;
    puVar4 = puVar4 + 1;
    *puVar2 = *puVar1;
  }
  *(undefined1 *)unaff_DI = *(undefined1 *)puVar4;
  return (undefined1 *)((int)puVar4 + 1);
}


// ==== FUN_5120_0e3d @ 5120:0e3d (size 22) callers: FUN_5120_02bd,FUN_5120_048a

void __cdecl16near FUN_5120_0e3d(void)

{
  uint in_AX;
  undefined1 in_CL;
  undefined2 *unaff_DI;
  undefined2 unaff_ES;
  
  *unaff_DI = 0;
  unaff_DI[1] = 0;
  unaff_DI[2] = 0;
  unaff_DI[3] = (uint)(in_AX < 0xc001) << 0xf;
  unaff_DI[4] = in_AX;
  *(undefined1 *)(unaff_DI + 5) = in_CL;
  return;
}


// ==== FUN_5120_0e53 @ 5120:0e53 (size 24) callers: FUN_5120_00f3,FUN_5120_02bd,FUN_5120_048a

void __cdecl16near FUN_5120_0e53(void)

{
  undefined2 *unaff_DI;
  undefined2 unaff_ES;
  
  FUN_5120_2714();
  *unaff_DI = 0;
  unaff_DI[1] = 0;
  unaff_DI[2] = 0;
  unaff_DI[3] = 0xc000;
  unaff_DI[4] = (char *)s_INTO_THE_BODY_OF_THE_ENEMY_6000_3fff + 2;
  *(undefined1 *)(unaff_DI + 5) = 1;
  return;
}


// ==== FUN_5120_0e6b @ 5120:0e6b (size 28) callers: FUN_5120_1b5d

void __cdecl16near FUN_5120_0e6b(void)

{
  undefined2 *puVar1;
  undefined2 *puVar2;
  int iVar3;
  undefined2 *unaff_SI;
  undefined2 *puVar4;
  undefined2 unaff_SS;
  
  puVar4 = (undefined2 *)((int)DAT_6000_8cbc + -0xc);
  DAT_6000_8cbc = puVar4;
  for (iVar3 = 5; iVar3 != 0; iVar3 = iVar3 + -1) {
    puVar2 = puVar4;
    puVar4 = puVar4 + 1;
    puVar1 = unaff_SI;
    unaff_SI = unaff_SI + 1;
    *puVar2 = *puVar1;
  }
  *(undefined1 *)puVar4 = *(undefined1 *)unaff_SI;
  return;
}


// ==== FUN_5120_0e87 @ 5120:0e87 (size 29) callers: FUN_5120_154e,FUN_5120_1b5d

void __cdecl16near FUN_5120_0e87(void)

{
  undefined2 *puVar1;
  undefined2 *puVar2;
  int iVar3;
  undefined2 *unaff_SI;
  undefined2 *puVar4;
  
  puVar4 = (undefined2 *)((int)DAT_6000_8cbc + -0xc);
  DAT_6000_8cbc = puVar4;
  for (iVar3 = 5; iVar3 != 0; iVar3 = iVar3 + -1) {
    puVar2 = puVar4;
    puVar4 = puVar4 + 1;
    puVar1 = unaff_SI;
    unaff_SI = unaff_SI + 1;
    *puVar2 = *puVar1;
  }
  *(undefined1 *)puVar4 = *(undefined1 *)unaff_SI;
  return;
}


// ==== FUN_5120_0eba @ 5120:0eba (size 29) callers: FUN_5120_1b96

void __cdecl16near FUN_5120_0eba(void)

{
  undefined2 *puVar1;
  undefined2 *puVar2;
  int iVar3;
  undefined2 *puVar4;
  undefined2 *puVar5;
  undefined2 unaff_SS;
  
  puVar5 = DAT_6000_8cbc + -6;
  puVar4 = DAT_6000_8cbc;
  DAT_6000_8cbc = puVar5;
  for (iVar3 = 5; iVar3 != 0; iVar3 = iVar3 + -1) {
    puVar2 = puVar5;
    puVar5 = puVar5 + 1;
    puVar1 = puVar4;
    puVar4 = puVar4 + 1;
    *puVar2 = *puVar1;
  }
  *(undefined1 *)puVar5 = *(undefined1 *)puVar4;
  return;
}


// ==== FUN_5120_1446 @ 5120:1446 (size 264) callers: FUN_5120_1b96

void __cdecl16near FUN_5120_1446(void)

{
  long lVar1;
  uint *puVar2;
  uint uVar3;
  uint uVar4;
  uint uVar5;
  uint uVar6;
  uint uVar7;
  uint uVar8;
  uint uVar9;
  uint uVar10;
  uint uVar11;
  uint uVar12;
  uint uVar13;
  uint uVar14;
  uint uVar15;
  uint uVar16;
  uint uVar17;
  uint uVar18;
  uint uVar19;
  undefined2 unaff_SS;
  
  puVar2 = DAT_6000_8cbc;
  uVar4 = *DAT_6000_8cbc;
  uVar14 = DAT_6000_8cbc[1];
  uVar15 = DAT_6000_8cbc[2];
  uVar16 = DAT_6000_8cbc[3];
  uVar19 = 0;
  uVar3 = DAT_6000_8cbc[4];
  uVar5 = uVar4;
  uVar11 = uVar15;
  uVar10 = uVar16;
  if (uVar3 != 0xc001) {
    if ((int)uVar3 < -0xf) {
      uVar10 = 0;
      uVar5 = uVar14;
      uVar11 = uVar16;
      uVar14 = uVar15;
      uVar3 = uVar3 + 0x10;
      uVar19 = uVar4;
    }
    while (uVar3 + 1 == 0 || (int)uVar3 < -1) {
      uVar4 = uVar10 & 1;
      uVar10 = uVar10 >> 1;
      uVar15 = uVar11 & 1;
      uVar19 = (uint)(CONCAT12((uVar5 & 1) != 0,uVar19) >> 1);
      uVar5 = (uint)(CONCAT12((uVar14 & 1) != 0,uVar5) >> 1);
      uVar11 = (uint)(CONCAT12(uVar4 != 0,uVar11) >> 1);
      uVar14 = (uint)(CONCAT12(uVar15 != 0,uVar14) >> 1);
      uVar3 = uVar3 + 1;
    }
  }
  uVar4 = (uint)CARRY2(uVar5,(uint)((int)uVar19 < 0));
  uVar15 = (uint)CARRY2(uVar14,uVar4);
  *DAT_6000_8cbc = uVar5 + ((int)uVar19 < 0);
  puVar2[1] = uVar14 + uVar4;
  puVar2[2] = uVar11 + uVar15;
  puVar2[3] = uVar10 + CARRY2(uVar11,uVar15);
  uVar14 = 0;
  uVar4 = 0;
  if ((*(byte *)((int)puVar2 + 3) & 0x80) != 0) {
    uVar14 = *puVar2 << 1;
    uVar4 = puVar2[1] << 1 | (uint)((int)*puVar2 < 0);
  }
  uVar11 = (uint)((ulong)*puVar2 * (ulong)puVar2[2] >> 0x10);
  uVar3 = (uint)((ulong)*puVar2 * (ulong)puVar2[2]);
  uVar19 = uVar4 + uVar11 + (uint)CARRY2(uVar14,uVar3);
  uVar15 = (uint)CARRY2(uVar14 + uVar3,uVar3);
  uVar16 = uVar19 + uVar11;
  uVar5 = uVar16 + uVar15;
  uVar18 = (uint)(CARRY2(uVar4,uVar11) || CARRY2(uVar4 + uVar11,(uint)CARRY2(uVar14,uVar3))) +
           (uint)(CARRY2(uVar19,uVar11) || CARRY2(uVar16,uVar15));
  uVar12 = (uint)((ulong)puVar2[1] * (ulong)puVar2[2] >> 0x10);
  uVar14 = (uint)((ulong)puVar2[1] * (ulong)puVar2[2]);
  uVar15 = uVar5 + uVar14;
  uVar4 = (uint)CARRY2(uVar5,uVar14);
  uVar19 = uVar18 + uVar12;
  uVar6 = uVar19 + uVar4;
  uVar16 = uVar15 + uVar14;
  uVar14 = (uint)CARRY2(uVar15,uVar14);
  uVar5 = uVar6 + uVar12;
  uVar7 = uVar5 + uVar14;
  uVar13 = (uint)((ulong)*puVar2 * (ulong)puVar2[3] >> 0x10);
  uVar3 = (uint)((ulong)*puVar2 * (ulong)puVar2[3]);
  uVar17 = uVar16 + uVar3;
  uVar15 = (uint)CARRY2(uVar16,uVar3);
  uVar11 = uVar7 + uVar13;
  uVar8 = uVar11 + uVar15;
  uVar16 = (uint)CARRY2(uVar17,uVar3);
  uVar10 = uVar8 + uVar13;
  uVar9 = uVar10 + uVar16;
  uVar3 = (uint)((int)(uVar17 + uVar3) < 0);
  uVar17 = uVar9 + uVar3;
  uVar12 = (uint)(CARRY2(uVar18,uVar12) || CARRY2(uVar19,uVar4)) +
           (uint)(CARRY2(uVar6,uVar12) || CARRY2(uVar5,uVar14)) +
           (uint)(CARRY2(uVar7,uVar13) || CARRY2(uVar11,uVar15)) +
           (uint)(CARRY2(uVar8,uVar13) || CARRY2(uVar10,uVar16)) + (uint)CARRY2(uVar9,uVar3);
  lVar1 = (ulong)puVar2[2] * (ulong)puVar2[2];
  uVar7 = (uint)((ulong)lVar1 >> 0x10);
  uVar4 = (uint)lVar1;
  uVar14 = uVar17 + uVar4;
  uVar4 = (uint)CARRY2(uVar17,uVar4);
  uVar16 = uVar12 + uVar7;
  uVar11 = uVar16 + uVar4;
  uVar8 = (uint)((ulong)puVar2[3] * (ulong)puVar2[1] >> 0x10);
  uVar5 = (uint)((ulong)puVar2[3] * (ulong)puVar2[1]);
  uVar9 = uVar14 + uVar5;
  uVar14 = (uint)CARRY2(uVar14,uVar5);
  uVar3 = uVar11 + uVar8;
  uVar10 = uVar3 + uVar14;
  uVar15 = (uint)CARRY2(uVar9,uVar5);
  uVar19 = uVar10 + uVar8;
  uVar6 = uVar19 + uVar15;
  uVar10 = (uint)(CARRY2(uVar12,uVar7) || CARRY2(uVar16,uVar4)) +
           (uint)(CARRY2(uVar11,uVar8) || CARRY2(uVar3,uVar14)) +
           (uint)(CARRY2(uVar10,uVar8) || CARRY2(uVar19,uVar15));
  uVar11 = (uint)((ulong)puVar2[3] * (ulong)puVar2[2] >> 0x10);
  uVar3 = (uint)((ulong)puVar2[3] * (ulong)puVar2[2]);
  uVar19 = uVar6 + uVar3;
  uVar4 = (uint)CARRY2(uVar6,uVar3);
  uVar15 = uVar10 + uVar11;
  uVar6 = uVar15 + uVar4;
  uVar14 = (uint)CARRY2(uVar19,uVar3);
  uVar16 = uVar6 + uVar11;
  lVar1 = (ulong)puVar2[3] * (ulong)puVar2[3] +
          CONCAT22((uint)(CARRY2(uVar10,uVar11) || CARRY2(uVar15,uVar4)) +
                   (uint)(CARRY2(uVar6,uVar11) || CARRY2(uVar16,uVar14)),uVar16 + uVar14);
  *puVar2 = uVar9 + uVar5;
  puVar2[1] = uVar19 + uVar3;
  puVar2[2] = (uint)lVar1;
  puVar2[3] = (uint)((ulong)lVar1 >> 0x10);
  *(undefined1 *)(puVar2 + 5) = 0;
  puVar2[4] = 0;
  return;
}


// ==== FUN_5120_154e @ 5120:154e (size 237) callers: FUN_5120_1b96

/* WARNING: Restarted to delay deadcode elimination for space: stack */

void FUN_5120_154e(int param_1,byte param_2)

{
  uint *puVar1;
  byte bVar2;
  uint uVar3;
  uint *puVar4;
  byte bVar5;
  uint in_CX;
  uint uVar6;
  uint uVar7;
  uint uVar8;
  uint uVar9;
  uint in_BX;
  uint uVar10;
  uint uVar11;
  uint *puVar12;
  uint *puVar13;
  undefined2 unaff_ES;
  undefined2 unaff_SS;
  bool bVar14;
  undefined4 uVar15;
  
  FUN_5120_0e87();
  puVar12 = (uint *)((uint)param_2 * 0xc + -0xc + param_1);
  while( true ) {
    puVar4 = DAT_6000_8cbc;
    bVar2 = param_2 - 1;
    if (bVar2 == 0 || (char)param_2 < '\x01') break;
    *(byte *)(DAT_6000_8cbc + 5) = (byte)DAT_6000_8cbc[5] ^ (byte)DAT_6000_8cbc[0xb];
    uVar15 = FUN_5120_0353();
    *puVar4 = (uint)uVar15;
    puVar4[1] = in_BX;
    puVar4[2] = in_CX;
    puVar4[3] = (uint)((ulong)uVar15 >> 0x10);
    puVar13 = puVar12 + -6;
    in_BX = *puVar13;
    in_CX = puVar12[-5];
    uVar6 = puVar12[-4];
    uVar9 = puVar12[-3];
    bVar5 = (byte)puVar12[-1];
    puVar12 = puVar13;
    param_2 = bVar2;
    if (bVar5 == (byte)puVar4[5]) {
      puVar1 = puVar4;
      uVar3 = *puVar1;
      *puVar1 = *puVar1 + in_BX;
      puVar1 = puVar4 + 1;
      uVar8 = *puVar1;
      uVar11 = *puVar1;
      *puVar1 = uVar11 + in_CX + (uint)CARRY2(uVar3,in_BX);
      puVar1 = puVar4 + 2;
      uVar8 = (uint)(CARRY2(uVar8,in_CX) || CARRY2(uVar11 + in_CX,(uint)CARRY2(uVar3,in_BX)));
      uVar11 = *puVar1;
      uVar3 = *puVar1;
      *puVar1 = uVar3 + uVar6 + uVar8;
      puVar4[3] = puVar4[3] + uVar9 + (uint)(CARRY2(uVar11,uVar6) || CARRY2(uVar3 + uVar6,uVar8));
    }
    else {
      bVar14 = in_BX < *puVar4;
      in_BX = in_BX - *puVar4;
      uVar3 = (uint)bVar14;
      bVar14 = in_CX < puVar4[1];
      uVar11 = in_CX - puVar4[1];
      in_CX = uVar11 - uVar3;
      uVar3 = (uint)(bVar14 || uVar11 < uVar3);
      uVar11 = uVar6 - puVar4[2];
      uVar8 = uVar11 - uVar3;
      uVar6 = (uint)(uVar6 < puVar4[2] || uVar11 < uVar3);
      uVar3 = uVar9 - puVar4[3];
      uVar11 = uVar3 - uVar6;
      if (uVar9 < puVar4[3] || uVar3 < uVar6) {
        uVar9 = ~uVar8;
        uVar6 = ~in_CX;
        bVar14 = in_BX == 0;
        in_BX = -in_BX;
        in_CX = uVar6 + bVar14;
        uVar6 = (uint)CARRY2(uVar6,(uint)bVar14);
        uVar8 = uVar9 + uVar6;
        uVar11 = ~uVar11 + (uint)CARRY2(uVar9,uVar6);
        bVar5 = bVar5 ^ 1;
      }
      *puVar4 = in_BX;
      puVar4[1] = in_CX;
      puVar4[2] = uVar8;
      puVar4[3] = uVar11;
      *(byte *)(puVar4 + 5) = bVar5;
    }
  }
  uVar6 = *DAT_6000_8cbc;
  uVar9 = DAT_6000_8cbc[1];
  uVar3 = DAT_6000_8cbc[2];
  uVar11 = DAT_6000_8cbc[3];
  puVar12 = DAT_6000_8cbc + 6;
  bVar14 = (char)DAT_6000_8cbc[5] != '\x01';
  if (bVar14) {
    uVar8 = (uint)(CONCAT12((uVar11 & 1) != 0,uVar3) >> 1);
    uVar3 = (uint)(CONCAT12((uVar3 & 1) != 0,uVar9) >> 1);
    uVar9 = (uint)(CONCAT12((uVar9 & 1) != 0,uVar6) >> 1);
    uVar6 = (uint)((uVar6 & 1) != 0);
    uVar10 = uVar9 + uVar6;
    uVar6 = (uint)CARRY2(uVar9,uVar6);
    uVar7 = uVar3 + uVar6;
    uVar6 = (uint)CARRY2(uVar3,uVar6);
    uVar9 = uVar8 + uVar6;
    uVar6 = (int)(((ulong)uVar11 | 0x10000) >> 1) + (uint)CARRY2(uVar8,uVar6);
  }
  else {
    uVar10 = -uVar6;
    uVar7 = ~uVar9 + (uint)(uVar6 == 0);
    uVar6 = (uint)CARRY2(~uVar9,(uint)(uVar6 == 0));
    uVar9 = ~uVar3 + uVar6;
    uVar6 = ~uVar11 + (uint)CARRY2(~uVar3,uVar6);
  }
  puVar13 = DAT_6000_8cbc + 7;
  DAT_6000_8cbc = puVar12;
  *puVar12 = uVar10;
  *puVar13 = uVar7;
  puVar4[8] = uVar9;
  puVar4[9] = uVar6;
  puVar4[10] = (uint)bVar14;
  *(undefined1 *)(puVar4 + 0xb) = 0;
  return;
}


// ==== FUN_5120_1b5d @ 5120:1b5d (size 57) callers: 

void __cdecl16near FUN_5120_1b5d(void)

{
  int iVar1;
  undefined2 unaff_SI;
  
  FUN_5120_0e6b();
  FUN_5120_1b96();
  FUN_5120_0e87();
  iVar1 = DAT_6000_8cbc + 0xc;
  FUN_5120_02bd(iVar1,iVar1,DAT_6000_8cbc);
  FUN_5120_02bd(unaff_SI,unaff_SI,iVar1);
  DAT_6000_8cbc = DAT_6000_8cbc + 0x18;
  return;
}


// ==== FUN_5120_1b96 @ 5120:1b96 (size 87) callers: FUN_5120_1b5d

void __cdecl16near FUN_5120_1b96(void)

{
  int iVar1;
  int iVar2;
  int unaff_SI;
  
  iVar2 = DAT_6000_8cbc;
  if (-0x40 < *(int *)(unaff_SI + 8)) {
    iVar1 = DAT_6000_8cbc + -0xc;
    DAT_6000_8cbc = iVar1;
    FUN_5120_0dc1();
    *(int *)(iVar2 + -4) = *(int *)(iVar2 + -4) + 1;
    FUN_5120_00f3(iVar1,iVar1,unaff_SI);
    FUN_5120_048a(iVar1,iVar1,unaff_SI);
    FUN_5120_0eba();
    *(int *)(DAT_6000_8cbc + 8) = *(int *)(DAT_6000_8cbc + 8) + 2;
    FUN_5120_1446();
    FUN_5120_154e((char *)s_WHITE_DRAGONFLY_6000_1a2c + 0xe,DAT_5120_0838);
    FUN_5120_02bd(unaff_SI,iVar1,DAT_6000_8cbc);
    *(int *)(unaff_SI + 8) = *(int *)(unaff_SI + 8) + 1;
    DAT_6000_8cbc = DAT_6000_8cbc + 0x18;
  }
  return;
}


// ==== FUN_5120_1eb8 @ 5120:1eb8 (size 47) callers: FUN_5120_1ee7

undefined4 __cdecl16near FUN_5120_1eb8(void)

{
  uint uVar1;
  undefined2 in_DX;
  byte bVar2;
  uint *unaff_SI;
  undefined2 unaff_ES;
  
  uVar1 = *unaff_SI;
  bVar2 = (byte)(uVar1 >> 8);
  return CONCAT22(in_DX,((uint)(byte)((bVar2 >> 4) * '\n' + (bVar2 & 0xf)) * 10 + (uVar1 >> 4 & 0xf)
                        ) * 10 + (uVar1 & 0xf));
}


// ==== FUN_5120_1ee7 @ 5120:1ee7 (size 203) callers: 

void __cdecl16near FUN_5120_1ee7(void)

{
  long lVar1;
  ulong uVar2;
  long lVar3;
  uint uVar4;
  int iVar5;
  uint uVar6;
  uint uVar7;
  uint uVar8;
  uint uVar9;
  char cVar10;
  uint uVar11;
  int unaff_SI;
  uint *unaff_DI;
  uint uVar12;
  undefined2 unaff_ES;
  bool bVar13;
  undefined4 uVar14;
  
  *(bool *)(unaff_DI + 5) = *(char *)(unaff_SI + 9) < '\0';
  iVar5 = (uint)*(byte *)(unaff_SI + 8) << 4;
  uVar9 = (uint)(byte)(((byte)iVar5 >> 4) + (char)((uint)iVar5 >> 8) * '\n') * 10000;
  uVar14 = FUN_5120_1eb8();
  cVar10 = (char)((ulong)uVar14 >> 0x18);
  lVar1 = (ulong)((uint)uVar14 + uVar9) * 10000;
  uVar6 = (uint)lVar1;
  uVar8 = (int)((ulong)lVar1 >> 0x10) +
          CONCAT11(cVar10,(char)((ulong)uVar14 >> 0x10) + cVar10 + CARRY2((uint)uVar14,uVar9)) *
          10000;
  uVar14 = FUN_5120_1eb8();
  uVar9 = (uint)CARRY2((uint)uVar14,uVar6);
  cVar10 = (char)((ulong)uVar14 >> 0x18);
  lVar1 = (ulong)((uint)uVar14 + uVar6) * 10000;
  uVar6 = (uint)lVar1;
  lVar3 = (ulong)(uVar8 + uVar9) * 10000 +
          CONCAT22(CONCAT11(cVar10,(char)((ulong)uVar14 >> 0x10) + cVar10 + CARRY2(uVar8,uVar9)) *
                   10000,(int)((ulong)lVar1 >> 0x10));
  uVar11 = (uint)lVar3;
  uVar14 = FUN_5120_1eb8();
  uVar8 = (uint)((ulong)uVar14 >> 0x10);
  uVar9 = (uint)CARRY2((uint)uVar14,uVar6);
  lVar1 = (ulong)((uint)uVar14 + uVar6) * 10000;
  uVar7 = (uint)lVar1;
  lVar1 = (ulong)(uVar11 + uVar8 + uVar9) * 10000 +
          CONCAT22(((int)((ulong)lVar3 >> 0x10) + uVar8 +
                   (uint)(CARRY2(uVar11,uVar8) || CARRY2(uVar11 + uVar8,uVar9))) * 10000,
                   (int)((ulong)lVar1 >> 0x10));
  uVar11 = (uint)lVar1;
  uVar12 = (uint)((ulong)lVar1 >> 0x10);
  uVar14 = FUN_5120_1eb8();
  uVar9 = (uint)CARRY2(uVar7,(uint)uVar14);
  uVar6 = (uint)CARRY2(uVar11,uVar9);
  uVar8 = 0x40;
  uVar11 = uVar11 + uVar9;
  uVar4 = (int)((ulong)uVar14 >> 0x10) + (uint)CARRY2(uVar12,uVar6);
  uVar7 = uVar7 + (uint)uVar14;
  uVar9 = uVar12 + uVar6;
  do {
    uVar12 = uVar9;
    uVar6 = uVar7;
    uVar7 = uVar4;
    uVar9 = uVar11;
    if (uVar7 != 0) goto joined_r0x00053189;
    uVar8 = uVar8 - 0x10;
    uVar11 = uVar6;
    uVar4 = uVar12;
  } while (uVar8 != 0);
  uVar8 = 0xc001;
LAB_5120_1f96:
  *unaff_DI = uVar6;
  unaff_DI[1] = uVar9;
  unaff_DI[2] = uVar12;
  unaff_DI[3] = uVar7;
  unaff_DI[4] = uVar8;
  return;
joined_r0x00053189:
  for (; -1 < (int)uVar7; uVar7 = uVar7 * 2 + (uint)((uVar2 & 0x10000) != 0)) {
    uVar8 = uVar8 - 1;
    bVar13 = (int)uVar6 < 0;
    uVar6 = uVar6 << 1;
    uVar2 = (ulong)CONCAT12(bVar13,uVar9) << 1;
    uVar9 = (uint)uVar2 | (uint)bVar13;
    bVar13 = (uVar2 & 0x10000) != 0;
    uVar2 = (ulong)CONCAT12(bVar13,uVar12) << 1;
    uVar12 = (uint)uVar2 | (uint)bVar13;
  }
  goto LAB_5120_1f96;
}


// ==== FUN_5120_1fb2 @ 5120:1fb2 (size 30) callers: FUN_5120_1fd0

undefined4 __cdecl16near FUN_5120_1fb2(void)

{
  byte bVar1;
  undefined2 in_AX;
  byte bVar2;
  byte bVar3;
  uint in_DX;
  undefined2 *unaff_DI;
  undefined2 unaff_ES;
  
  bVar3 = (byte)(in_DX / 100);
  bVar2 = (byte)(in_DX % 100);
  bVar1 = bVar3 % 10;
  bVar3 = bVar3 / 10 << 4 | bVar1;
  *unaff_DI = CONCAT11(bVar3,bVar2 % 10 | bVar2 / 10 << 4);
  return CONCAT22(CONCAT11(bVar3,bVar1),in_AX);
}


// ==== FUN_5120_1fd0 @ 5120:1fd0 (size 204) callers: 

void __cdecl16near FUN_5120_1fd0(void)

{
  byte *pbVar1;
  uint uVar2;
  bool bVar3;
  char cVar4;
  char cVar5;
  byte bVar6;
  int iVar7;
  uint *unaff_SI;
  byte *unaff_DI;
  undefined2 unaff_ES;
  
  uVar2 = unaff_SI[4];
  if ((int)uVar2 < 0) {
    bVar6 = 0;
  }
  else {
    if (((int)uVar2 < 0x3c) ||
       ((uVar2 - 0x3c == 0 || (int)uVar2 < 0x3c &&
        ((unaff_SI[3] < 0xde0b ||
         ((unaff_SI[3] < 0xde0c &&
          (((char *)unaff_SI[2] < (char *)s_THIS_WEAPON_IS_EXTREMELY_6000_6b2f + 0xb ||
           (((char *)unaff_SI[2] < (char *)s_THIS_WEAPON_IS_EXTREMELY_6000_6b2f + 0xc &&
            ((unaff_SI[1] < 0x763f || ((unaff_SI[1] < 0x7640 && (*unaff_SI < 0xfff1))))))))))))))))
    {
      cVar4 = (char)(uVar2 - 0x3c) + -4;
      do {
        cVar5 = cVar4;
        cVar4 = cVar5 + '\x10';
      } while (cVar4 == '\0' || cVar5 < -0x10);
      if (cVar4 < '\x10') {
        do {
          bVar3 = cVar5 < -1;
          cVar5 = cVar5 + '\x01';
        } while (bVar3);
      }
      FUN_5120_1fb2();
      FUN_5120_1fb2();
      FUN_5120_1fb2();
      bVar6 = FUN_5120_1fb2();
      pbVar1 = unaff_DI;
      unaff_DI = unaff_DI + 1;
      *pbVar1 = bVar6 % 10 | bVar6 / 10 << 4;
      goto LAB_5120_207d;
    }
    FUN_5120_2714();
    bVar6 = 0x99;
  }
  for (iVar7 = 9; iVar7 != 0; iVar7 = iVar7 + -1) {
    pbVar1 = unaff_DI;
    unaff_DI = unaff_DI + 1;
    *pbVar1 = bVar6;
  }
LAB_5120_207d:
  *unaff_DI = (byte)unaff_SI[5] >> 1 | (byte)unaff_SI[5] << 7;
  return;
}


// ==== FUN_5120_2714 @ 5120:2714 (size 99) callers: FUN_5120_0012,FUN_5120_00f3,FUN_5120_02bd,FUN_5120_048a,FUN_5120_0e53,FUN_5120_1fd0

/* WARNING: Unable to track spacebase fully for stack */

undefined2 __cdecl16near FUN_5120_2714(void)

{
  code *pcVar1;
  byte bVar2;
  undefined2 in_AX;
  undefined2 uVar3;
  byte bVar4;
  undefined2 in_CX;
  uint uVar5;
  undefined2 in_BX;
  undefined2 unaff_ES;
  undefined2 unaff_SS;
  
  uVar5 = CONCAT11((char)((uint)in_CX >> 8),*(undefined1 *)0x8cb2) & 0xff7f;
  bVar4 = (byte)uVar5 ^ 0x7f;
  bVar2 = *(byte *)0x8cb0 | (byte)(uVar5 >> 8);
  if (((bVar2 & bVar4 ^ bVar2) & 8) != 0) {
    bVar2 = bVar2 | 0x20;
  }
  if ((bVar4 & bVar2) != 0) {
    *(byte *)0x8cb0 = bVar2 | 0x80;
    if ((bVar2 & bVar4) == 0x20) {
      return in_AX;
    }
    FUN_1000_051c(0x6000);
    pcVar1 = (code *)swi(0x21);
    (*pcVar1)();
    *(undefined2 *)0x8cf0 = in_BX;
    *(undefined2 *)0x8cf2 = unaff_ES;
                    /* WARNING: Could not recover jumptable at 0x00053972. Too many branches */
                    /* WARNING: Treating indirect jump as call */
    uVar3 = (*(code *)(ulong)*(uint *)0x8cf0)();
    return uVar3;
  }
  *(byte *)0x8cb0 = bVar2 & 0x7f;
  return in_AX;
}


// ==== FUN_5400_02f0 @ 5400:02f0 (size 22) callers: FUN_5400_0306

void __cdecl16near FUN_5400_02f0(void)

{
  undefined2 unaff_SS;
  
  ((char *)s_NOTE___SORTING_TAKES_TIME_6000_5ff0)[0x15] =
       ((char *)s_NOTE___SORTING_TAKES_TIME_6000_5ff0)[0x15] ^ *(byte *)0x8cb7;
  return;
}


// ==== FUN_5400_0306 @ 5400:0306 (size 170) callers: 

undefined2 FUN_5400_0306(void)

{
  code *pcVar1;
  byte bVar2;
  undefined2 in_AX;
  undefined1 uVar4;
  uint uVar3;
  int iVar5;
  undefined2 unaff_SS;
  undefined2 uVar6;
  undefined2 in_FPUStatusWord;
  undefined4 in_stack_00000000;
  undefined2 uVar7;
  undefined2 local_4;
  
  uVar7 = 0x6000;
  uVar6 = (undefined2)((ulong)in_stack_00000000 >> 0x10);
  iVar5 = (int)in_stack_00000000;
  FUN_5400_02f0(0x6000);
  uVar3 = *(uint *)(iVar5 + -1);
  uVar4 = (undefined1)(uVar3 >> 8);
  bVar2 = (char)uVar3 - 0x34;
  local_4 = in_AX;
  if (bVar2 < 8) {
    if (CONCAT11(uVar4,bVar2) == -0x1cfd) {
      *(undefined2 *)0x8cb0 = (char *)s_SELECT_THE_TYPE_OF_PAPER__6000_40f8 + 8;
      *(undefined2 *)0x8cb2 = 0x3f;
      *(undefined2 *)0x8cd4 = 0;
      *(undefined2 *)&DAT_6000_8cbc = *(undefined2 *)0x8cc0;
      *(undefined2 *)0x8cb4 = 0;
    }
    else if ((CONCAT11(uVar4,bVar2) != -0x1ff9) ||
            (local_4 = in_FPUStatusWord, '\x01' < *(char *)0x8cb6)) {
      *(undefined1 *)(iVar5 + -2) = 0x9b;
      *(char *)(iVar5 + -1) = *(char *)(iVar5 + -1) + -0x5c;
      local_4 = in_AX;
    }
  }
  else if (bVar2 < 9) {
    if ((uVar3 & 0x2000) != 0) goto LAB_5400_03af;
    *(undefined1 *)(iVar5 + -2) = 0x9b;
    uVar3 = CONCAT11(uVar4,uVar4) & 0x7c0;
    *(int *)(iVar5 + -1) = (CONCAT11((char)(uVar3 >> 8),(byte)uVar3 >> 3) ^ 0x18) + 0xd826;
  }
  else {
    if (9 < bVar2) {
LAB_5400_03af:
      pcVar1 = (code *)swi(3);
      uVar6 = (*pcVar1)();
      return uVar6;
    }
    *(undefined2 *)(iVar5 + -2) = 0x9b90;
  }
  FUN_5400_02f0(uVar7);
  return local_4;
}

