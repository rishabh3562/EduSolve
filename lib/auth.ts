'use client';

import { create } from 'zustand';
import { User, DUMMY_STUDENTS, TEACHER } from './types';

interface AuthState {
  user: User | null;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  login: (email: string) => {
    if (email === TEACHER.email) {
      set({ user: TEACHER });
    } else {
      const student = DUMMY_STUDENTS.find(s => s.email === email);
      if (student) {
        set({ user: student });
      }
    }
  },
  logout: () => set({ user: null }),
}));