// lib/upgradeToTeacher.ts
import { supabase } from "./supabase";

export const upgradeToTeacher = async (
  userId: string,
  superPassword: string
) => {
  if (superPassword !== process.env.NEXT_PUBLIC_SUPER_PASSWORD) {
    throw new Error("Invalid super password");
  }
  const { data, error } = await supabase
    .from("users")
    .update({ role: "teacher" })
    .eq("id", userId)
    .select()
    .single();
  return { data, error };
};
