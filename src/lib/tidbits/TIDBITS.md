<!--
  How to add a tidbit
  -------------------
  Put a `### Some title` under one of the `## Section` headings and write a paragraph or two
  under it. Blank lines separate paragraphs, a line starting `- ` is a list item, `backticks`
  make inline code and **stars** make bold. Every paragraph has to sit under a `###`; anything
  written between a `##` and the first `###` under it is dropped.

  Links are ordinary Markdown, `[text](https://example.com/)`. Three link forms point inside
  this app instead of at the web:

      [text](source:ts/magic.ts/writeScrollOrWand)   a function of the TypeScript port
      [text](source:c/write_scroll_or_wand)          a function of the decompiled game
      [text](formula:spell-cost)                     an entry of the Formulas tab

  The file names come from the Source tab and the ids from src/lib/formulas/formulas.ts; a
  test checks that every link in this file still points at something.

  That is the whole of the Markdown this file understands. Nothing else is a heading, and a
  link to anything but an http address is shown as plain text.
-->

## Exploits and shortcuts

### A priest can write wizard scrolls, and a wizard priest ones

Write Scroll and Enchant Wand ask three questions in a row: which spell book, which level, and
which of the three spells on that line. The first menu draws the book your class cannot cast as
a row of dashes and gives it no mouse hot-spot, so it reads as switched off. It is not. The
keyboard is still listening, and typing the number for the other book writes the scroll or
charges the wand without a word of complaint.

That matters more than it sounds. A priest has no real damage spell until very deep, and a
wizard has no cure at all; a wand holds five charges of whatever you put in it and does not care
whose list the spell came from. Fighters can do it too, off a menu that on the face of it offers
them nothing.

In the code: [writeScrollOrWand](source:ts/magic.ts/writeScrollOrWand) and
[write_scroll_or_wand](source:c/write_scroll_or_wand).
