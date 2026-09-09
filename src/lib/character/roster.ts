import type { RosterEntry } from '../app-state.svelte';
import { fromBase64, readStored, toBase64, writeStored } from './storage';

/** Where the characters kept in the browser live. */
const ROSTER_KEY = 'moraff-tools.roster';

/** A roster as it goes into storage: the byte arrays as base64, everything else as it is. */
interface StoredRoster {
  entries: StoredEntry[];
  currentId: string | null;
}

interface StoredEntry {
  id: string;
  game: string;
  name: string;
  slot: number | null;
  importedBytes: string | null;
  bytes: string;
  createdAt: string;
  editedAt: string;
  dead?: boolean;
}

/** What is needed to put a character on the roster. */
export interface NewCharacter {
  game: string;
  name: string;
  slot: number | null;
  bytes: Uint8Array<ArrayBuffer>;
  /** Whether the bytes are a file that was imported, rather than a character rolled here. */
  imported: boolean;
}

export function newId(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function newEntry(character: NewCharacter, now = new Date(), id = newId()): RosterEntry {
  const stamp = now.toISOString();
  return {
    id,
    game: character.game,
    name: character.name,
    slot: character.slot,
    importedBytes: character.imported ? character.bytes.slice() : null,
    bytes: character.bytes,
    createdAt: stamp,
    editedAt: stamp,
    dead: false,
  };
}

export function withEntry(entries: RosterEntry[], entry: RosterEntry): RosterEntry[] {
  return [...entries, entry];
}

export function withoutEntry(entries: RosterEntry[], id: string): RosterEntry[] {
  return entries.filter((entry) => entry.id !== id);
}

/** The character has died. Nothing takes it back: the entry keeps its bytes and is marked. */
export function markDead(entry: RosterEntry, now = new Date()): void {
  entry.dead = true;
  markEdited(entry, now);
}

/** Stamp the time a character was last changed. */
export function markEdited(entry: RosterEntry, now = new Date()): void {
  entry.editedAt = now.toISOString();
}

/**
 * Put the file the character was imported from back as the character, leaving the import itself
 * where it is so it can be gone back to again. The bytes are a fresh array, which is what tells
 * the editor to open the character again.
 */
export function restoreImport(entry: RosterEntry, now = new Date()): boolean {
  if (!entry.importedBytes) return false;
  entry.bytes = entry.importedBytes.slice();
  markEdited(entry, now);
  return true;
}

/** Keep the roster in the browser. Says whether it went in. */
export function saveRoster(entries: RosterEntry[], currentId: string | null): boolean {
  const stored: StoredRoster = {
    currentId,
    entries: entries.map((entry) => ({
      id: entry.id,
      game: entry.game,
      name: entry.name,
      slot: entry.slot,
      importedBytes: entry.importedBytes ? toBase64(entry.importedBytes) : null,
      bytes: toBase64(entry.bytes),
      createdAt: entry.createdAt,
      editedAt: entry.editedAt,
      dead: entry.dead,
    })),
  };
  return writeStored(ROSTER_KEY, JSON.stringify(stored));
}

/** What was stored, with anything this build cannot read left out. */
export function loadRoster(): { entries: RosterEntry[]; currentId: string | null } {
  const empty = { entries: [], currentId: null };
  const text = readStored(ROSTER_KEY);
  if (!text) return empty;
  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    return empty;
  }
  if (typeof parsed !== 'object' || parsed === null) return empty;
  const { entries, currentId } = parsed as Partial<StoredRoster>;
  if (!Array.isArray(entries)) return empty;
  const restored = entries.map(entryFrom).filter((entry): entry is RosterEntry => entry !== null);
  const current = restored.some((entry) => entry.id === currentId) ? currentId! : null;
  return { entries: restored, currentId: current };
}

function entryFrom(value: unknown): RosterEntry | null {
  if (typeof value !== 'object' || value === null) return null;
  const { id, game, name, slot, importedBytes, bytes, createdAt, editedAt, dead } = value as Partial<StoredEntry>;
  if (typeof id !== 'string' || typeof game !== 'string' || typeof name !== 'string') return null;
  if (typeof createdAt !== 'string' || typeof editedAt !== 'string' || typeof bytes !== 'string') return null;
  if (slot !== null && !Number.isInteger(slot)) return null;
  const decoded = fromBase64(bytes);
  if (!decoded || decoded.length === 0) return null;
  return {
    id,
    game,
    name,
    slot: slot ?? null,
    importedBytes: typeof importedBytes === 'string' ? fromBase64(importedBytes) : null,
    bytes: decoded,
    createdAt,
    editedAt,
    dead: dead === true,
  };
}
