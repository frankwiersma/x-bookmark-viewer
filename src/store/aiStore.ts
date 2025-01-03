import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AIState {
  queryCount: number;
  customApiKey: string | null;
  incrementQueryCount: () => void;
  setCustomApiKey: (key: string | null) => void;
  resetQueryCount: () => void;
}

export const useAIStore = create<AIState>()(
  persist(
    (set) => ({
      queryCount: 0,
      customApiKey: null,
      incrementQueryCount: () => set((state) => ({ queryCount: state.queryCount + 1 })),
      setCustomApiKey: (key) => set({ customApiKey: key }),
      resetQueryCount: () => set({ queryCount: 0 }),
    }),
    {
      name: 'ai-store',
    }
  )
);