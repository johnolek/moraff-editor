import { app, currentEntry, type GameId, type RosterEntry } from '../app-state.svelte';
import { MORAFFS_REVENGE } from '../editor/games';
import { isGameId, loadChosenGame, loadLastCharacter, saveChosenGame, saveLastCharacter } from '../game-choice';
import { recordTab } from '../history';
import { revCharacterMap } from '../play/rev/memory';
import { tabFor } from '../tabs';
import { recordName, slotFromFileName } from './record';
import { loadRoster, markDead, markEdited, newEntry, restoreImport, saveRoster, withEntry, withoutEntry } from './roster';

/** Put a save file that has just been read on the roster and start working on it. */
export function importCharacter(game: string, fileName: string, bytes: Uint8Array<ArrayBuffer>): void {
  const entry = newEntry({
    game,
    name: recordName(bytes, game) || fileName,
    slot: slotFromFileName(fileName),
    bytes,
    imported: true,
  });
  app.roster = withEntry(app.roster, entry);
  chooseEntry(entry.id);
}

/**
 * Keep a `<n>.BIN` dropped beside a character as the map that character has discovered, the way
 * Moraff's Revenge keeps one beside `<n>.EXE`.
 *
 * It goes to the character being worked on. The file says which character it belongs to only in
 * its name, and dropping it with the record makes that character the current one, so the two
 * come to the same thing.
 *
 * Returns the character it was kept beside, or null when the one being worked on is not a
 * Moraff's Revenge character.
 */
export function importRevExploredMap(bytes: Uint8Array): RosterEntry | null {
  const entry = currentEntry();
  if (!entry || entry.game !== MORAFFS_REVENGE.id) return null;
  revCharacterMap(entry.id).write(bytes);
  return entry;
}

/** Put a character that has just been rolled on the roster and start working on it. */
export function keepRolledCharacter(game: string, name: string, slot: number | null, bytes: Uint8Array<ArrayBuffer>): void {
  const entry = newEntry({ game, name, slot, bytes, imported: false });
  app.roster = withEntry(app.roster, entry);
  chooseEntry(entry.id);
}

export function chooseCharacter(id: string): void {
  if (app.roster.some((candidate) => candidate.id === id)) chooseEntry(id);
}

/** Put the editor down without taking the character off the roster. */
export function unloadCharacter(): void {
  chooseEntry(null);
}

export function renameCharacter(id: string, name: string): void {
  const entry = app.roster.find((candidate) => candidate.id === id);
  if (!entry || name.trim() === '') return;
  entry.name = name.trim();
  remember();
}

export function forgetCharacter(id: string): void {
  app.roster = withoutEntry(app.roster, id);
  if (app.characterId === id) app.characterId = null;
  app.characterVersion++;
  remember();
}

/** Put the file a character was imported from back as the character. */
export function restoreCharacterImport(id: string): void {
  const entry = app.roster.find((candidate) => candidate.id === id);
  if (!entry || !restoreImport(entry)) return;
  app.characterVersion++;
  remember();
}

/** A field of the current character has been edited in place. */
export function characterEdited(): void {
  const entry = currentEntry();
  if (entry) markEdited(entry);
  app.characterVersion++;
  rememberSoon();
}

/** The character being played has died. */
export function characterDied(): void {
  const entry = currentEntry();
  if (entry) markDead(entry);
  app.characterVersion++;
  remember();
}

/** The editor has swapped in a different set of bytes for the same character. */
export function replaceCharacterBytes(bytes: Uint8Array<ArrayBuffer>): void {
  const entry = currentEntry();
  if (!entry) return;
  entry.bytes = bytes;
  markEdited(entry);
  app.characterVersion++;
  rememberSoon();
}

/** Show the other game. The character becomes the one last worked on under it; the rest of the
 *  roster is left exactly where it is. */
export function switchGame(game: GameId): void {
  if (game === app.game) return;
  setGame(game);
  chooseEntry(lastCharacterOf(game));
}

/**
 * Bring back the game the last visit was looking at. A visit from before the site had a switch
 * has no game stored, so the character that was being worked on says which game it was.
 */
export function restoreGame(): void {
  const current = currentEntry();
  const stored = loadChosenGame() ?? (isGameId(current?.game) ? current.game : app.game);
  setGame(stored);
  if (current && current.game !== stored) chooseEntry(lastCharacterOf(stored));
}

/** Bring back the characters the last visit left behind. */
export function restoreRoster(): void {
  const { entries, currentId } = loadRoster();
  app.roster = entries;
  app.characterId = currentId;
  app.characterVersion++;
}

function chooseEntry(id: string | null): void {
  app.characterId = id;
  app.characterVersion++;
  const entry = currentEntry();
  if (entry && isGameId(entry.game)) {
    // Which game a character belongs to is a fact about the file, so a save of the other game
    // being opened is what moves the site to that game.
    setGame(entry.game);
    saveLastCharacter(entry.game, entry.id);
  }
  remember();
}

function setGame(game: GameId): void {
  app.game = game;
  app.tab = tabFor(game, app.tab);
  saveChosenGame(game);
  // Being moved off a tab the new game does not have is not a jump, so the entry showing is
  // rewritten to name the tab that is now on screen rather than another one being added.
  recordTab(app);
}

/** The character to work on under a game: the one last worked on if it is still on the roster,
 *  and the newest of that game's otherwise. */
function lastCharacterOf(game: GameId): string | null {
  const theirs = app.roster.filter((entry) => entry.game === game);
  const remembered = loadLastCharacter(game);
  return theirs.find((entry) => entry.id === remembered)?.id ?? theirs[theirs.length - 1]?.id ?? null;
}

/**
 * How long an edit waits before the roster is written.
 *
 * Long enough that typing a five digit number is one write rather than five, short enough that
 * the write is done by the time anybody has reached for the keyboard again.
 */
const EDIT_PAUSE_MS = 400;

/** The write an edit has asked for and that has not happened yet. */
let pendingWrite: ReturnType<typeof setTimeout> | null = null;

/** Write the roster now, whatever an edit was waiting for. */
export function rememberNow(): void {
  remember();
}

function remember(): void {
  if (pendingWrite !== null) {
    clearTimeout(pendingWrite);
    pendingWrite = null;
  }
  saveRoster(app.roster, app.characterId);
}

/**
 * Write the roster once the edits have settled.
 *
 * Writing it means base64-ing the bytes of every character on it, and every keystroke in the save
 * editor is an edit, so a burst of them is collected into one write. The first edit of a burst is
 * what sets the timer; the ones after it join the write already coming.
 */
function rememberSoon(): void {
  if (pendingWrite !== null) return;
  pendingWrite = setTimeout(() => {
    pendingWrite = null;
    saveRoster(app.roster, app.characterId);
  }, EDIT_PAUSE_MS);
}
