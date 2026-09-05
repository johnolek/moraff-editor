# The .FNT bitmap fonts

Three font files ship with the game; `reference/extract_fnt.py` decodes them into
`data/dotu-fonts.json`.

| file | glyph | rows | words per glyph | used for |
|---|---|---|---|---|
| `320x200.fnt` | 3×5 | 5 | 6 | text in the 320×200 mode |
| `360x480.fnt` | 4×13 | 13 | 14 | text in the 360×480 mode |
| `ehout.fnt` | 7×10 bold | 10 | 11 | headlines such as "EXPANDED DUNGEON MAP" |

Format: no header, just glyphs back to back. Each glyph is `rows + 1` little-endian
16-bit words, one word per pixel row, the last word a blank separator. Bit 0 of a word
is the leftmost pixel, so a row reads left to right from the least significant bit; the
game leaves bit 0 clear as a one-pixel left margin. A handful of glyphs use more than
8 bits.

Glyph order is the same in all three files: `-` first, then `A`..`Z`, `0`..`9`, then
`, . ? ! ( ) ' & : = /`, then lowercase letters and a few more symbols; the exporter
stops after the first 48. A few words are left over at the end of each file.

`dotu-fonts.json`: `{ small | tall | bold: { source, height, advance, glyphs: { char: [row words] } } }`,
where `advance` is the pixel step between characters that reproduces the game's spacing.
