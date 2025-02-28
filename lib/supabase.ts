import { createClient } from "@supabase/supabase-js";
import { askFormDataType, Doubt } from "@/lib/types";
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      persistSession: true, // Enable session persistence
      autoRefreshToken: true, // Enable auto-refreshing of tokens
      detectSessionInUrl: true, // Detect session in URL
    },
    global: {
      headers: { "x-ttl": "86400" }, // Set session TTL to 1 day (86400 seconds)
    },
  }
);

export async function fetchDoubts(): Promise<Doubt[]> {
  const { data, error } = await supabase.from("doubts").select("*");
  if (error) throw error;
  return data || [];
}

export async function fetchDoubtById(id: string): Promise<Doubt | null> {
  const { data, error } = await supabase
    .from("doubts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data || null;
}

export async function postDoubt(formData: askFormDataType) {
  const { title, description, subject, studentId } = formData;
  console.log("formData", formData);
  const { data, error } = await supabase
    .from("doubts")
    .insert([
      { title, description, subject, studentid: studentId, status: "pending" },
    ]);
  console.log("data", data);
  console.log("error", error);
  if (error) throw new Error(error.message);
  return data;
}
