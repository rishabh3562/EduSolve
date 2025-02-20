// "use server";
import { supabase } from "@/lib/supabase";

export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  return { data, error };
};

export const signInWithOAuth = async (provider: "github" | "google") => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider,
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  });
  return { url: data?.url, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const getUsers = async () => {
  const { data, error } = await supabase.from("users").select("*");
  return { data, error };
};

export const updateUser = async (id: string, updates: any) => {
  const { data, error } = await supabase
    .from("users")
    .update(updates)
    .eq("id", id);
  return { data, error };
};

export const deleteUser = async (id: string) => {
  const { error } = await supabase.from("users").delete().eq("id", id);
  return { success: !error, error };
};
