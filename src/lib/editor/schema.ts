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

/**
 * One number of a text record, which is what a Moraff's Revenge character file is.
 *
 * The file holds a run of numbers rather than a byte at a fixed offset, so a field names the
 * number's place in that run rather than an offset, and carries the arithmetic the game does on
 * the way in and out: the value the player sees is `(stored - shift) / scale`.
 */
export interface TextNumberField {
  kind: 'text_number';
  /** Which number of the record it is, counting from one. */
  value: number;
  label: string;
  hint?: string;
  /** What the file adds to the number on the way out. */
  shift?: number;
  /** What it multiplies it by, which only the six characteristics have. */
  scale?: number;
  /** The range the input holds the number to, when the game has one. */
  min?: number;
  max?: number;
}

/** A number of a text record that stands for a choice, such as the class. */
export interface TextEnumField {
  kind: 'text_enum';
  value: number;
  label: string;
  hint?: string;
  choices: { value: number; label: string }[];
}

/** The numbers of a text record, which its fields read and write in place. */
export interface TextRecord {
  values: number[];
}

export type Field =
  | ScalarField
  | EnumField
  | SelectField
  | OwnedListField
  | CheckboxListField
  | CounterListField
  | SpellListField
  | TextNumberField
  | TextEnumField;

export interface Section {
  title: string;
  note?: string;
  fields: Field[];
}

export interface GameSchema {
  id: string;
  displayName: string;
  /**
   * How the fields reach the file. A byte record is a fixed run of bytes at fixed offsets; a text
   * record is the numbers of a file BASIC's WRITE # wrote, which are not a fixed size.
   */
  record?: 'bytes' | 'text';
  /** Bytes; used to recognise the game from the file. Byte records only. */
  fileSize?: number;
  /**
   * How a text record is read out of a file and written back, which is also what says whether a
   * file is one of this game's when its files are not all the same size. Text records only.
   */
  readRecord?: (bytes: Uint8Array) => number[] | null;
  writeRecord?: (values: number[]) => Uint8Array<ArrayBuffer>;
  sections: Section[];
  /** Runs right before download, e.g. to recompute a checksum. */
  onSave?: (bytes: Uint8Array) => void;
}

export const SCALAR_KINDS: ReadonlySet<string> = new Set<ScalarKind>(['string', 'uint8', 'int8', 'uint16', 'int16', 'uint32', 'int32', 'float32', 'float64']);

/** Fields that span the full width of a section instead of sitting in its grid. */
export const WIDE_KINDS: ReadonlySet<Field['kind']> = new Set(['owned_list', 'checkbox_list', 'counter_list', 'spell_list']);

/** Fields that read a text record rather than the bytes. */
export const TEXT_KINDS: ReadonlySet<Field['kind']> = new Set(['text_number', 'text_enum']);
