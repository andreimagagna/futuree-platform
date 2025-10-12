import { useState, useCallback, useEffect } from 'react';
import { LandingPageComponent } from '@/types/LandingPage';

interface HistoryState {
  past: LandingPageComponent[][];
  present: LandingPageComponent[];
  future: LandingPageComponent[][];
}

export function useUndoRedo(initialState: LandingPageComponent[], maxHistory: number = 50) {
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: initialState,
    future: [],
  });

  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  // Update present state without adding to history (for internal syncing)
  const setState = useCallback((newState: LandingPageComponent[]) => {
    setHistory((prev) => ({
      ...prev,
      present: newState,
    }));
  }, []);

  // Add action to history
  const addToHistory = useCallback((newState: LandingPageComponent[]) => {
    setHistory((prev) => {
      const newPast = [...prev.past, prev.present].slice(-maxHistory);
      return {
        past: newPast,
        present: newState,
        future: [], // Clear future on new action
      };
    });
  }, [maxHistory]);

  // Undo action
  const undo = useCallback(() => {
    if (!canUndo) return;

    setHistory((prev) => {
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
  }, [canUndo]);

  // Redo action
  const redo = useCallback(() => {
    if (!canRedo) return;

    setHistory((prev) => {
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);

      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
  }, [canRedo]);

  // Clear history
  const clearHistory = useCallback(() => {
    setHistory({
      past: [],
      present: history.present,
      future: [],
    });
  }, [history.present]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z')
      ) {
        e.preventDefault();
        redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    state: history.present,
    setState,
    addToHistory,
    undo,
    redo,
    canUndo,
    canRedo,
    clearHistory,
  };
}
