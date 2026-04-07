import { useState, useEffect } from 'react';
import { AppState } from '../types';

const STORAGE_KEY = 'anti_brainwash_state';

const initialState: AppState = {
  checkedItems: {},
  itemNotes: {},
  summaryNotes: {},
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const toggleItem = (id: string) => {
    setState((prev) => ({
      ...prev,
      checkedItems: {
        ...prev.checkedItems,
        [id]: !prev.checkedItems[id],
      },
    }));
  };

  const setItemNote = (id: string, note: string) => {
    setState((prev) => ({
      ...prev,
      itemNotes: {
        ...prev.itemNotes,
        [id]: note,
      },
    }));
  };

  const setSummaryNote = (category: string, note: string) => {
    setState((prev) => ({
      ...prev,
      summaryNotes: {
        ...prev.summaryNotes,
        [category]: note,
      },
    }));
  };

  return { state, toggleItem, setItemNote, setSummaryNote };
}
