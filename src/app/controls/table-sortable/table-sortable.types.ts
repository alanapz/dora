export type SortDirection = 'asc' | 'desc' | '';

export interface SortEvent {
  columnName: string;
  direction: SortDirection;
}
