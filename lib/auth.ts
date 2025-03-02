"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { supabase } from "./supabase";
import { User } from "./types";

interface AuthState {
  user: User | null;
  init: () => Promise<void>;
  login: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,

      init: async () => {
        const { data } = await supabase.auth.getUser();
        if (data.user) {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();

          if (error || !userData) {
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
            if (!insertError) set({ user: insertedData });
          } else {
            set({ user: userData });
          }
        } else {
          set({ user: null });
        }
      },

      login: async () => {
        const redirectUrl =
          process.env.SUPABASE_REDIRECT_URL ||
          `${process.env.NEXT_PUBLIC_SITE_URL}/api/auth/callback`;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: "google",
          options: { redirectTo: redirectUrl },
        });

        if (error) console.error("Login failed:", error);
      },

      logout: async () => {
        await supabase.auth.signOut();
        set({ user: null });
      },
    }),
    { name: "auth-store" } // Persist state in localStorage
  )
);
