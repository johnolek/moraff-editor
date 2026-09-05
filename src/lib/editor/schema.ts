export type ScalarKind = 'string' | 'uint8' | 'int8' | 'uint16' | 'int16' | 'uint32' | 'int32' | 'float32' | 'float64';

export interface ScalarField {
  kind: ScalarKind;
  offset: number;
  label: string;
  hint?: string;
  /** Byte length, strings only. */
  length?: number;
}

/** Dropdown where the choice's array index is the stored byte. */
export interface EnumField {
  kind: 'enum_uint8';
  offset: number;
  label: string;
  choices: string[];
  hint?: string;
}

/** Dropdown with explicit value mapping, for sparse codes like 0/1/100. */
export interface SelectField {
  kind: 'select_uint8';
  offset: number;
  label: string;
  choices: { value: number; label: string }[];
  hint?: string;
}

/** Items with a "do I own it?" byte and an enchant level byte each. */
export interface OwnedListField {
  kind: 'owned_list';
  ownedOffset: number;
  levelOffset: number;
  count: number;
  names: string[];
}

/** One byte per entry, nonzero = on. */
export interface CheckboxListField {
  kind: 'checkbox_list';
  offset: number;
  names: string[];
}

/** Same-typed counters at a constant stride. */
export interface CounterListField {
  kind: 'counter_list';
  offset: number;
  stride: number;
  itemKind: ScalarKind;
  names: string[];
}

/** A Moraff spell list: 4 sub-categories × 45 byte slots, laid out contiguously. */
export interface SpellListField {
  kind: 'spell_list';
  offset: number;
  /** Spellbook semantics: known or not, instead of a count. */
  binary?: boolean;
}

export type Field = ScalarField | EnumField | SelectField | OwnedListField | CheckboxListField | CounterListField | SpellListField;

export interface Section {
  title: string;
  note?: string;
  fields: Field[];
}

export interface GameSchema {
  id: string;
  displayName: string;
  /** Bytes; used to recognise the game from the file. */
  fileSize: number;
  sections: Section[];
  /** Runs right before download, e.g. to recompute a checksum. */
  onSave?: (bytes: Uint8Array) => void;
}

export const SCALAR_KINDS: ReadonlySet<string> = new Set<ScalarKind>(['string', 'uint8', 'int8', 'uint16', 'int16', 'uint32', 'int32', 'float32', 'float64']);

/** Fields that span the full width of a section instead of sitting in its grid. */
export const WIDE_KINDS: ReadonlySet<Field['kind']> = new Set(['owned_list', 'checkbox_list', 'counter_list', 'spell_list']);
