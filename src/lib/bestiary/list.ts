/** What the monster list needs of a monster: something to call it and something to key it by. */
export interface ListEntry {
  id: string;
  name: string;
}

/** One heading of the list and the monsters under it. */
export interface ListGroup {
  label: string;
  monsters: ListEntry[];
}
