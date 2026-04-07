export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  category: 'FAT' | 'TREPAN' | 'PROTECTION';
}

export interface AppState {
  checkedItems: Record<string, boolean>;
  itemNotes: Record<string, string>;
  summaryNotes: Record<string, string>;
}
