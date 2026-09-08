// Parsers for the Dungeons of the Unforgiven data files that the fan tools read.
// Plain ES module.  Formats recovered from UNF.CPP (save_maps/load_maps, save_player,
// save_monster_map) and the exe; verified against real files.

// ---------------------------------------------------------------- character files 20..29
// 2,695-byte record + 2 checksum bytes.  Full offset table: FAQ v2.2 [CEDB] / RE notes 6.1.
export const SAVE_SIZE = 2697;
export const SAVE_RECORD = 2695;

export function saveChecksum(bytes) {
  let a = 0, c = 0;
  for (let i = 0; i < SAVE_RECORD; i++) { a = (a + bytes[i]) & 0xff; c = (c + a - a * a) & 0xff; }
  return [a, c];
}
export function fixSaveChecksum(bytes) { const [a, c] = saveChecksum(bytes); bytes[SAVE_RECORD] = a; bytes[SAVE_RECORD + 1] = c; }

/** The subset of the character record the map/calculator tools need. */
export function parseSave(bytes) {
  const v = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const s8 = o => v.getInt8(o), s16 = o => v.getInt16(o, true), s32 = o => v.getInt32(o, true);
  const arr = (o, n, f) => Array.from({ length: n }, (_, i) => f(o + i));
  const name = new TextDecoder("latin1").decode(bytes.subarray(0, 40)).split("\0")[0];
  const [a, c] = saveChecksum(bytes);
  return {
    name, checksumOk: bytes[SAVE_RECORD] === a && bytes[SAVE_RECORD + 1] === c,
    race: s8(0x28), sex: s8(0x29), cls: s8(0x2a),
    hp: s16(0x31), maxHp: s16(0x33), sp: v.getFloat32(0x35, true), maxSp: v.getFloat32(0x39, true),
    heightDiv4: s16(0x3d), weight: s16(0x3f), loadedWeight: s16(0x41),
    weaponsOwned: arr(0x81, 8, s8), weaponPlus: arr(0x8e, 8, s8), weapon: s8(0x9b),
    armorOwned: arr(0xb0, 8, s8), armorPlus: arr(0xb8, 8, s8), armor: s8(0xc0),
    potions: arr(0x15d, 6, s8),
    spellbooks: arr(0x177, 180, s8), scrolls: arr(0x22b, 180, s8), wands: arr(0x2df, 180, s8), papers: arr(0x393, 180, s8),
    rubles: s32(0x454), bank: s32(0x458), cultureStock: s32(0x464), children: s32(0x468), crystals: s32(0x46c), dollars: s32(0x470),
    exp: v.getFloat64(0x7a4, true), lev: s16(0x7ac), dir: s16(0x7ae),
    x: s16(0x7b0), y: s16(0x7b2), level: s16(0x7b4), module: s16(0x7b6),
    realtime: s32(0x7c4),
    regenRings: s8(0x7ca), luckyCharms: s8(0x7cb), grenades: s8(0x7cc), seeingStones: s8(0x7cd),
    disease: s16(0x7ce), poison: s16(0x7d0),
    tempWeaponPlus: s8(0x7d2), tempArmorPlus: s8(0x7d3), bodyArmor: s8(0x7d4), protRing: s8(0x7d5), antiMagicRing: s8(0x7d6),
    feather: s8(0x7d7), fastMove: s8(0x7d8), invisible: s8(0x7d9), age: s32(0x7da),
    powerWeapon: s8(0x7e8), powerWeaponTime: s16(0x7e9), protection: s8(0x7eb), protectionTime: s16(0x7ec),
    slosher: s8(0x802), healingPotions: s16(0x812), teleportStones: s16(0x814),
    str: s16(0x816), iq: s16(0x818), wis: s16(0x81a), con: s16(0x81c), dex: s16(0x81e), luck: s16(0x820),
    keys: arr(0x822, 36, s8),                         // keys[floor/5]
    objective: arr(0x849, 5, o => bytes[o]),          // bit 1/2/4/8 = section 1-4 of the module beaten
    gauntlet: s8(0x853),
    bossX: arr(0x855, 80, s8), bossY: arr(0x8a5, 80, s8),   // index = module*8 + (section-in-module 0..3); 0/0 = never placed
    hard: s8(0x8f6), lowestLevel: s16(0x8f9),
  };
}
/** Spell index helper: 45*type + 3*(level-1) + slot (0-based slot). */
export const spellIndex = (type, level, slot) => 45 * type + 3 * (level - 1) + slot;

// ---------------------------------------------------------------- ?##.DUN explored maps
/** File name for a character's map: slot 0..9 -> 'D'..'M', quarter = floor>>5, module 0..4. */
export const dunFileName = (slot, floor, module) => String.fromCharCode(68 + slot) + (floor >> 5) + module + ".DUN";
export const parseDunName = name => ({ slot: name.toUpperCase().charCodeAt(0) - 68, quarter: +name[1], module: +name[2] });

/** Returns Map<floor(0..31 within the quarter), Uint8Array(110*80) of 0/1 explored flags>. */
export function parseDun(bytes) {
  const key = [bytes[3], bytes[2], bytes[1], bytes[0]];
  let pos = 4;
  const levels = new Map();
  for (let l = 0; l < 32; l++) {
    if (key[l >> 3] & (1 << (l & 7))) {
      const lineKey = bytes.subarray(pos, pos + 16); pos += 16;
      const grid = new Uint8Array(110 * 80);
      for (let y = 0; y < 110; y++) {
        if (lineKey[y >> 3] & (1 << (y & 7))) {
          for (let x = 0; x < 80; x++) grid[y * 80 + x] = (bytes[pos + (x >> 3)] >> (x & 7)) & 1;
          pos += 10;
        }
      }
      levels.set(l, grid);
    }
  }
  if (pos !== bytes.length) throw new Error("DUN size mismatch");
  return levels;
}

// ---------------------------------------------------------------- ?MON.MAP monster arrays
/** 3 header bytes (floor of each array, -1 unused) + 3 x 145 x 6 bytes [x, y, hpLo, hpHi, type, level]. */
export function parseMonMap(bytes) {
  const floors = [bytes[0], bytes[1], bytes[2]].map(b => (b === 255 ? -1 : b));
  const arrays = floors.map((floor, a) => {
    const base = 3 + a * 6 * 145, mons = [];
    for (let i = 0; i < 145; i++) {
      const o = base + i * 6;
      const m = { slot: i, x: bytes[o], y: bytes[o + 1], hp: bytes[o + 2] | (bytes[o + 3] << 8), type: bytes[o + 4], level: bytes[o + 5] };
      // type 255 = empty slot; killed monsters are parked at (100,100); never-filled arrays are all zero
      if (m.type !== 255 && !(m.x === 100 && m.y === 100) && !(m.x === 0 && m.y === 0 && m.hp === 0 && m.level === 0)) mons.push(m);
    }
    return { floor, monsters: mons };
  });
  return arrays;
}
/** Monster type index -> name: 0..21 built-in (data.builtinMonsters), 22..26 the current section's five (data.sections[s].monsters). */
export function monsterName(data, module, floor, type) {
  if (type < 22) return data.builtinMonsters[type].name;
  const section = sectionOf(module, floor);
  return data.sections[section - 1].monsters[type - 22].name;
}
/** Section number 1..20 for a module (0..4) and floor -- section_number3() in UNF.CPP:
 *  floors above 19*(module+1) belong to the module's 4th section, otherwise (floor-1)/(5*(module+1)). */
export function sectionOf(module, floor) {
  if (floor > (module + 1) * 19) return module * 4 + 4;
  return Math.trunc((floor - 1) / (5 * (module + 1))) + module * 4 + 1;   // floor 0 -> section 1 (C division)
}
/** Index into save.bossX/bossY for the boss of (module 0..4, section 0..3 within the module),
 *  which is section_number2() in UNF.CPP. */
export const bossIndex = (module, sectionInModule) => module * 8 + sectionInModule;
