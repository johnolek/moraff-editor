"""The functions of Moraff's World's WORLD.EXE that have been identified.

Keyed by address in the re-laid layout `../decomp/ghidra-scripts/relayout.py`
produces: `(name, one-line purpose)`.  `../decomp/rename_mw.py` substitutes the
names into the decompilation, and the purposes become the trailing comment on
each function's header line.

The reverse engineering has only worked through character creation so far
(`../docs/ROLLER.md`), so most of the 580 functions are still `FUN_`.
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

    # ---- WORLD module (segment 2000)
    "2000:03cb": ("quit", "back to text mode and exit"),
    "2000:240c": ("load_h_bin", "reads H.BIN"),
    "2000:27b8": ("load_world_pic", "reads WORLD.PIC"),
    "2000:2ee7": ("store", "the general store menu"),
    "2000:342d": ("financial_statement", "the money breakdown screen"),
    "2000:35b1": ("inn", "the Flea Bag Inn"),
    "2000:3716": ("bank", "Moraff's First National Bank"),
    "2000:3c8f": ("select_player", "the ten save slots: name, sex, race, class per slot"),
    "2000:4043": ("game_disk_prompt", "the 360K one-character-per-disk notice"),
    "2000:4252": ("load_worldmap_bin", "reads WORLDMAP.BIN"),
    "2000:4292": ("main", "argv handling, video setup, then the slot/roll/play loop"),
    "2000:46a4": ("generate_section", "builds the map and monsters for a floor"),
    "2000:5298": ("save_dun", "writes the <n>.DUN floor file"),
    "2000:542b": ("load_dun", "reads the <n>.DUN floor file"),
    "2000:57d7": ("load_dung_bin", "reads DUNG.BIN"),
    "2000:580e": ("load_player", "fread of the 0x928-byte record from slot file <n>"),
    "2000:58bf": ("save_player", "fwrite of the 0x928-byte record to slot file <n>"),
    "2000:5a42": ("experience_for_level", "the level thresholds"),
    "2000:5bef": ("strike", "the player's attack on a monster"),
    "2000:603f": ("puffball_stat", "the puffball's stat drain/raise, by stat number"),
    "2000:615c": ("monster_turn", "the monster's attack and the experience it gives"),
    "2000:933a": ("view_stats", "the vital-statistics screen"),
    "2000:9d03": ("chute", "falling down a chute"),
    "2000:a19d": ("dig_hole", "digging through the floor"),
    "2000:aad5": ("movecontrol", "the main play loop: keys, movement, menus"),
    "2000:c546": ("cast_spell", "the spell menu"),

    # ---- TOWN/CREATE module (segment 3000)
    "3000:4434": ("read_roll_line", "one line of ROLL.TXT into a buffer, dropping '|'"),
    "3000:4477": ("show_roll", "prints the six characteristics, height, weight, age and sex"),
    "3000:4695": ("roll_char", "character creation: race, stats, name, class, starting kit"),

    # ---- DISP module (segment 4000)
    "4000:0b14": ("print_text", "one line of text at a scaled x,y in a colour"),
    "4000:0d0f": ("print_text_clipped", "print_text with a right-hand limit"),
    "4000:2020": ("fill_rect", "fills a rectangle with a colour"),
    "4000:2ef7": ("mouse_pick", "which entry of a screen-region table the mouse is on"),
    "4000:34d8": ("clear_screen", "blanks the screen and hides the mouse cursor"),
    "4000:3452": ("wait_key", "waits for a key or a mouse button"),
    "4000:3532": ("flush_keys", "drains the keyboard and mouse buffers"),
    "4000:3db9": ("read_string", "types a string: uppercased, letters, digits and space"),
    "4000:42d2": ("format_two_numbers", "builds \"<a><n><b><m>\" in the scratch string"),
    "4000:4147": ("draw_text_box", "prints text into a cleared rectangle"),
}
