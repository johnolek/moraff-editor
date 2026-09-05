#!/usr/bin/env python3
"""Build dotu-data.json (+ unfdung.b64.js) for the fan-tools page from the game files
and the unpacked exe.  Usage: build_data.py <game dir> <unpacked unf.000.exe> <out dir>"""
import sys, os, json, struct, base64, re

game, exe, out = sys.argv[1:4]
d = open(exe, 'rb').read()
hdr = struct.unpack('<14H', d[:28]); img = d[hdr[4] * 16:]; ds = 0x30a0 * 16
def rd(off, n): return img[ds + off: ds + off + n]
def cstr(ptr): return img[ds + ptr: ds + ptr + 40].split(b'\0')[0].decode('latin1')

data = {
    "source": "1993 registered unf.exe (Copyright 1993 Steve Moraff) + MD.BIN + USPELLS.HLP",
    "constants": {
        "modules": 5, "bottomLevel": [25, 45, 65, 85, 105],
        "width": 80, "height": 110, "dungeonXmax": 79, "dungeonYmax": 104,
        "numPatterns": 25, "monsterSlotsPerFloor": 145,
        "expFactorNormal": 1.4, "expFactorHard": 2.0, "expBase": 250, "expOffsetNormal": -80,
        "expValueBase": 1.23, "expValueMult": 5, "expValueLevelCap": 130,
        "monsterLevelPerModule": 15, "monsterLevelMax": 210, "monsterHpMax": 32000,
        "poisonDiseasePeriod": 450, "innSeconds": 28800,
        "spellDuration": 60, "sleepMoves": 25, "holdMoves": 15,
        "moneyCap": 107000000, "dollarsCap": 2000000000,
    },
    "classes": [
        {"id": 0, "name": "Fighter", "weapons": "any", "armor": "any", "spells": "papers only"},
        {"id": 1, "name": "Worshipper", "weapons": "fist", "armor": "skin", "spells": "priest (books/scrolls); wands/papers any"},
        {"id": 2, "name": "Monk", "weapons": "fist", "armor": "skin, leather", "spells": "all (starts with every book); never finds items"},
        {"id": 3, "name": "Wizard", "weapons": "fist, stick, knife", "armor": "skin", "spells": "wizard"},
        {"id": 4, "name": "Priest", "weapons": "all but great sword", "armor": "any", "spells": "priest"},
        {"id": 5, "name": "Sage", "weapons": "fist, stick, knife", "armor": "skin, leather", "spells": "wizard and priest"},
        {"id": 6, "name": "Mage", "weapons": "all but great sword", "armor": "any", "spells": "wizard"},
    ],
    "races": [], "weapons": [], "armor": [], "temple": [], "monsterTypes": [],
    "builtinMonsters": [], "sections": [], "spells": [], "bossRewards": [],
}

for i in range(8):
    e = rd(0x130 + i * 14, 14)
    ptr = struct.unpack('<H', e[:2])[0]
    s, iq, w, c, a, l = e[2:8]
    height, weight, age = struct.unpack('<3h', e[8:14])
    data["races"].append({"id": i, "name": cstr(ptr).title(), "str": s, "int": iq, "wis": w, "con": c,
                          "agi": a, "luck": l, "height": height, "weight": weight, "age": age})

wprices = struct.unpack('<7h', rd(0x363, 14))
aprices = struct.unpack('<7H', rd(0x371, 14))
for i in range(12):
    e = rd(0x1a0 + i * 7, 7)
    ptr, dmg, hit, tm, wt = struct.unpack('<HhBBB', e)
    data["weapons"].append({"id": i, "name": cstr(ptr).title(), "damageDie": dmg, "hit": hit, "speed": tm,
                            "weight": wt, "price": (None if i == 0 else wprices[i - 1]) if i <= 7 else None,
                            "inStore": 1 <= i <= 6})
for i in range(7):
    e = rd(0x1f4 + i * 5, 5)
    ptr, ac, tm, wt = struct.unpack('<HBBB', e)
    data["armor"].append({"id": i, "name": cstr(ptr).title(), "armor": ac, "speed": tm, "weight": wt,
                          "price": aprices[i], "inStore": i <= 5})
tp = struct.unpack('<7l', rd(0x37f, 28))
for i, nm in enumerate(["Cure wounds", "Cure serious wounds", "Heal all wounds", "Cure poison", "Cure disease", "Help a needy child"]):
    data["temple"].append({"key": i + 1, "name": nm, "price": tp[i]})

for i in range(16):
    armor, dmg, hp, dex, ptr = struct.unpack('<hhhhH', rd(0x5402 + i * 10, 10))
    data["monsterTypes"].append({"type": i, "hex": "%X" % i, "defense": armor, "damageDie": dmg, "hpPerLevel": hp,
                                 "speed": dex, "text": cstr(ptr)})

def monrec(e):
    name = e[:19].split(b'\0')[0].decode('latin1').strip()
    picnum, cset, ldrain, chrdrain, breath, special, typ = struct.unpack('<7b', e[19:26])
    exp = struct.unpack('<h', e[26:28])[0]
    return {"name": name.title(), "picnum": picnum, "colorSet": cset, "levelDrain": ldrain, "statDrain": chrdrain,
            "breath": breath, "special": special, "type": typ, "expMult": exp + 1, "color": e[28]}
for i in range(22):
    m = monrec(rd(0x4fc9 + i * 29, 29)); m["id"] = i
    data["builtinMonsters"].append(m)

# MD.BIN: 20 sections x (5 x 29-byte records + 24 fgets(40) lines)
md = open(os.path.join(game, 'md.bin'), 'rb').read()
pos = 0
for s in range(20):
    mons = []
    for k in range(5):
        m = monrec(md[pos:pos + 29]); m["slot"] = 22 + k; pos += 29
        mons.append(m)
    lines = []
    for k in range(24):
        # fgets(buf, 40): reads up to 39 chars or through '\n'
        end = pos
        while end < len(md) and end - pos < 39 and md[end] != 0x0a:
            end += 1
        if end < len(md) and md[end] == 0x0a and end - pos < 39:
            end += 1
        lines.append(md[pos:end].decode('latin1').rstrip('\r\n')); pos = end
    module, part = s // 4, s % 4
    data["sections"].append({"section": s + 1, "module": module + 1, "part": part + 1,
                             "bossFloor": 5 * (module + 1) * (part + 1),
                             "monsters": mons, "intro": [l.strip() for l in lines[:4]],
                             "descriptions": [l.rstrip() for l in lines[4:]]})

# USPELLS.HLP: 120 '~'-terminated entries, type-major, then level, then slot
txt = open(os.path.join(game, 'uspells.hlp'), 'rb').read().decode('latin1')
entries = txt.split('~')[:120]
TYPES = ["Permanent", "Preparation", "Wizard battle", "Priest battle"]
for i, e in enumerate(entries):
    e = e.replace('\r', '').strip('\n')
    lines = [l.rstrip() for l in e.split('\n')]
    first = lines[0].strip()
    name, _, rest = first.partition(':')
    name = name.strip().title()
    desc = ' '.join([rest.strip()] + [l.strip() for l in lines[1:]]).strip()
    desc = re.sub(r'\s+', ' ', desc)
    t, rest = divmod(i, 30); lv, slot = divmod(rest, 3)
    data["spells"].append({"index": i, "saveIndex": t * 45 + lv * 3 + slot, "type": t, "typeName": TYPES[t],
                           "level": lv + 1, "slot": slot + 1, "spCost": lv + 1, "name": name, "description": desc})

rewards = [
    ("Shadow Gargalon", "maxHp", 30), ("Shadow Elemental", "wis", 12), ("Shadow Vulture", "str", 12),
    ("Shadow Demon Queen", "armorPlus", 25), ("Shadow Troggisher", "bodyArmor", 9), ("Shadow Giant Worm", "gauntlet", 12),
    ("Shadow Scorpion", "protRing", 15), ("Shadow Skeeter", "weaponPlus", 25), ("Shadow Head Hunter", "luck", 10),
    ("Shadow Khagistoll", "con", 10), ("Shadow Eyeball", "int", 10), ("Shadow Mr. Fang", "seeingStones", 10),
    ("Shadow Warrior", "bodyArmor", 25), ("Shadow Ape-Man", "gauntlet", 50), ("Shadow Dragon King", "protRing", 50),
    ("Shadow Evil God", "armorPlus", 50), ("Shadow Ogre", "maxHp", 300), ("Shadow Stone Giant", "agi", 20),
    ("Shadow Centipede", "str", 25), ("Shadow Ogeroth", "weaponPlus", 101),
]
for i, (boss, what, amt) in enumerate(rewards):
    data["bossRewards"].append({"section": i + 1, "module": i // 4 + 1, "floor": 5 * (i // 4 + 1) * (i % 4 + 1),
                               "boss": boss, "reward": what, "amount": amt})

os.makedirs(out, exist_ok=True)
json.dump(data, open(os.path.join(out, 'dotu-data.json'), 'w'), indent=1)
b64 = base64.b64encode(open(os.path.join(game, 'unfdung.bin'), 'rb').read()).decode()
open(os.path.join(out, 'unfdung.b64.js'), 'w').write(
    "// UNFDUNG.BIN (12,800 bytes) from Dungeons of the Unforgiven, base64.\n"
    "// Decode with: Uint8Array.from(atob(UNFDUNG_B64), c => c.charCodeAt(0))\n"
    "export const UNFDUNG_B64 = \"%s\";\n" % b64)
print("wrote", out, "sections", len(data["sections"]), "spells", len(data["spells"]))
