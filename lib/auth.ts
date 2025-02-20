"use client";

import { create } from "zustand";
import { supabase } from "./supabase";
import { User } from "./types";

interface AuthState {
  user: User | null;
  init: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,

  // Initialize user state on app load or after OAuth redirect.
  init: async () => {
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      // Check if the user exists in our "users" table.
      const { data: userData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single();
      if (error || !userData) {
        // Not found? Insert the user as a student.
        const { data: insertedData, error: insertError } = await supabase
          .from("users")
          .insert({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata.full_name || data.user.email,
            role: "student",
          })
          .select()
          .single();
        if (!insertError) {
          set({ user: insertedData });
        }
      } else {
        set({ user: userData });
      }
    } else {
      set({ user: null });
    }
  },

  // Start OAuth flow for Google.
  login: async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      },
    });
    if (error) {
      console.error("Login failed:", error);
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ user: null });
  },
}));
