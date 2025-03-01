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
export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;

  const { data: userData } = await supabase
    .from("users")
    .select("id, role")
    .eq("id", data.user.id)
    .single();
  return userData;
}
// Fetch doubt by ID
export const getDoubtById = async (id: string): Promise<Doubt | null> => {
  const { data, error } = await supabase.from('doubts').select('*').eq('id', id).single();
  if (error) {
    console.error('Error fetching doubt:', error);
    return null;
  }
  return data;
};
// Update doubt with AI-generated answer
export const updateDoubtWithAIAnswer = async (id: string |null, aiAnswer: string) => {
  const { error } = await supabase.from('doubts').update({ aiAnswer }).eq('id', id);
  if (error) {
    console.error('Error updating AI answer:', error);
    throw error;
  }
};
// Approve doubt and update teacher's answer
export const approveDoubt = async (id: string, teacherAnswer: string, teacherId: string) => {
  const { error } = await supabase.from('doubts').update({
    teacherAnswer,
    teacherId,
    status: 'completed',
    updatedAt: new Date().toISOString(),
  }).eq('id', id);
  
  if (error) {
    console.error('Error approving doubt:', error);
    throw error;
  }
};
export async function fetchDoubtsByUserId(userId: string): Promise<Doubt[]> {
  const { data, error } = await supabase
    .from("doubts")
    .select("*")
    .eq("studentId", userId);

  if (error) {
    console.error("Error fetching doubts:", error);
    return [];
  }
  return data || [];
}

//fetchuserbyid
export async function fetchStudentById(studentId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", studentId)
  if (error) {
    throw error;
  } else {
    return data;
  }
}
export async function fetchTeacherById(teacherId: string) {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("teacherId", teacherId)
    .single();
  if (error) {
    throw new Error(error.message);
  } else {
    return data;
  }
}
export async function fetchDoubtsByStatus(
  status: string,
  teacherId: string | undefined
): Promise<Doubt[]> {
  const { data, error } = await supabase
    .from("doubts")
    .select("*")
    .eq("status", status)
    .eq("teacherId", teacherId); // Ensure field matches DB column name

  if (error) {
    console.error("Error fetching doubts by status:", error);
    return [];
  }
  return data || [];
}

export const updateDoubtStatus = async (id: string, status: string) => {
  const { error } = await supabase
    .from("doubts")
    .update({ status })
    .eq("id", id);

  if (error) {
    console.error("Error updating doubt status:", error);
    throw error;
  }
};
export async function postDoubt(formData: askFormDataType) {
  const { title, description, subject, studentId, teacherId } = formData;
  const { data, error } = await supabase.from("doubts").insert([
    {
      title,
      description,
      subject,
      studentId: studentId,
      teacherId: teacherId,
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
//       { title, description, subject, studentId: studentId, status: "pending" },
//     ]);
//   console.log("data", data);
//   console.log("error", error);
//   if (error) throw new Error(error.message);
//   return data;
// }
