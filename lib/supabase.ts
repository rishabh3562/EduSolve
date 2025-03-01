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

export async function fetchDoubtById(
  id: string
): Promise<Doubt | null | undefined | any> {
  const { data, error } = await supabase
    .from("doubts")
    .select("*")
    .eq("studentid", id)
    .maybeSingle(); // safer than .single()

  if (error) {
    console.error("Error fetching doubt:", error);
    return null;
  }
  return data;
}

export async function fetchDoubtsByUserId(userId: string): Promise<Doubt[]> {
  const { data, error } = await supabase
    .from("doubts")
    .select("*")
    .eq("studentid", userId);

  if (error) {
    console.error("Error fetching doubts:", error);
    return [];
  }
  return data || [];
}

export async function fetchDoubtsByStatus(
  status: string,
  teacherId: string | undefined
): Promise<Doubt[]> {
  const { data, error } = await supabase
    .from("doubts")
    .select("*")
    .eq("status", status)
    .eq("teacherid", teacherId); // Ensure field matches DB column name

  if (error) {
    console.error("Error fetching doubts by status:", error);
    return [];
  }
  return data || [];
}


export async function postDoubt(formData: askFormDataType) {
  const { title, description, subject, studentId, teacherId } = formData;
  const { data, error } = await supabase.from("doubts").insert([
    {
      title,
      description,
      subject,
      studentid: studentId,
      teacherid: teacherId,
      status: "pending",
    },
  ]);

  if (error) throw new Error(error.message);
  return data;
}

export const fetchTeachers = async () => {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", "teacher");
  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
};
// export async function postDoubt(formData: askFormDataType) {
//   const { title, description, subject, studentId } = formData;
//   console.log("formData", formData);
//   const { data, error } = await supabase
//     .from("doubts")
//     .insert([
//       { title, description, subject, studentid: studentId, status: "pending" },
//     ]);
//   console.log("data", data);
//   console.log("error", error);
//   if (error) throw new Error(error.message);
//   return data;
// }
