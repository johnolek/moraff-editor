import { app, type RosterEntry } from '../app-state.svelte';
import { recordName, slotFromFileName } from './record';
import { loadRoster, markEdited, newEntry, restoreImport, saveRoster, withEntry, withoutEntry } from './roster';

/** Put a save file that has just been read on the roster and start working on it. */
export function importCharacter(game: string, fileName: string, bytes: Uint8Array<ArrayBuffer>): RosterEntry {
  const entry = newEntry({
    game,
    name: recordName(bytes) || fileName,
    slot: slotFromFileName(fileName),
    bytes,
    imported: true,
  });
  app.roster = withEntry(app.roster, entry);
  chooseEntry(entry);
  return entry;
}

/** Put a character that has just been rolled on the roster and start working on it. */
export function keepRolledCharacter(game: string, name: string, slot: number | null, bytes: Uint8Array<ArrayBuffer>): RosterEntry {
  const entry = newEntry({ game, name, slot, bytes, imported: false });
  app.roster = withEntry(app.roster, entry);
  chooseEntry(entry);
  return entry;
}

export function chooseCharacter(id: string): void {
  const entry = app.roster.find((candidate) => candidate.id === id);
  if (entry) chooseEntry(entry);
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
  if (app.character?.id === id) app.character = null;
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
  if (app.character) markEdited(app.character);
  app.characterVersion++;
  remember();
}

/** The editor has swapped in a different set of bytes for the same character. */
export function replaceCharacterBytes(bytes: Uint8Array<ArrayBuffer>): void {
  if (!app.character) return;
  app.character.bytes = bytes;
  markEdited(app.character);
  app.characterVersion++;
  remember();
}

/** Bring back the characters the last visit left behind. */
export function restoreRoster(): void {
  const { entries, currentId } = loadRoster();
  app.roster = entries;
  app.character = entries.find((entry) => entry.id === currentId) ?? null;
  app.characterVersion++;
}

function chooseEntry(entry: RosterEntry | null): void {
  app.character = entry;
  app.characterVersion++;
  remember();
}

function remember(): void {
  saveRoster(app.roster, app.character?.id ?? null);
}
