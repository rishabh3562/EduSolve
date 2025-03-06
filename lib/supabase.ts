import { createClient } from "@supabase/supabase-js";
import { ApiUsage, askFormDataType, Doubt } from "@/lib/types";

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
export async function fetchApiUsage(teacherId: string) {
  const { data, error } = await supabase
    .from("apiUsage")
    .select("id, userId, totalTokens, maxTokens, createdAt, updatedAt") // Fetch all required fields
    .eq("userId", teacherId)
    .maybeSingle();

  if (error) {
    console.error("Error fetching API usage:", error);
    return null;
  }
  return data as ApiUsage; // Explicitly cast to ApiUsage
}


// Fetch doubt by ID
export const getDoubtById = async (id: string): Promise<Doubt | null> => {
  const { data, error } = await supabase
    .from("doubts")
    .select("*")
    .eq("id", id)
    .single();
  if (error) {
    console.error("Error fetching doubt:", error);
    return null;
  }
  return data;
};
// Update doubt with AI-generated answer
export const updateDoubtWithAIAnswer = async (
  id: string | null,
  aiAnswer: string
) => {
  const { error } = await supabase
    .from("doubts")
    .update({ aiAnswer })
    .eq("id", id);
  if (error) {
    console.error("Error updating AI answer:", error);
    throw error;
  }
};
// Approve doubt and update teacher's answer
export const approveDoubt = async (
  id: string,
  teacherAnswer: string,
  teacherId: string
) => {
  const { error } = await supabase
    .from("doubts")
    .update({
      teacherAnswer,
      teacherId,
      status: "completed",
      updatedAt: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Error approving doubt:", error);
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
    .eq("id", studentId);
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
    .eq("teacherId", teacherId)
    .order("createdAt", { ascending: false }); // Sort by most recent

  if (error) {
    console.error("Error fetching doubts by status:", error);
    return [];
  }
  return data || [];
}
export async function updateAiAnswer(id: string, aiAnswer: string) {
  const { error } = await supabase
    .from("doubts")
    .update({ aiAnswer })
    .eq("id", id);

  if (error) throw new Error("Failed to update AI answer");
}
export async function updateApiUsage(
  userId: string | null,
  tokensUsed: number
) {
  if (!userId) {
    console.error("User ID is null or undefined");
    return;
  }

  // Check if user exists in apiUsage
  const { data: usage, error: fetchError } = await supabase
    .from("apiUsage")
    .select("totalTokens, maxTokens")
    .eq("userId", userId)
    .maybeSingle(); // Use maybeSingle() to avoid error

  if (fetchError) {
    console.error("Error fetching API usage:", fetchError);
    return;
  }

  if (!usage) {
    console.log("User not found in apiUsage, creating new entry...");

    // Insert new record if not found
    const { error: insertError } = await supabase.from("apiUsage").insert([
      {
        userId,
        totalTokens: tokensUsed,
        maxTokens: 10000,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ]);

    if (insertError) {
      console.error("Error inserting new API usage record:", insertError);
      return;
    }

    return;
  }

  // If user exists, update totalTokens
  const newTotalTokens = (usage.totalTokens ?? 0) + tokensUsed;

  const { data, error } = await supabase
    .from("apiUsage")
    .update({
      totalTokens: newTotalTokens,
      updatedAt: new Date().toISOString(),
    })
    .eq("userId", userId)
    .select();

  if (error) {
    console.error("Error updating API usage:", error);
  }

  return data;
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

export async function trackApiUsage(userId: string, tokensUsed: number) {
  const { data, error } = await supabase
    .from("apiUsage")
    .select("totalTokens, maxTokens")
    .eq("userId", userId)
    .single();

  if (error || !data) throw new Error("User API record not found.");

  if (data.totalTokens + tokensUsed > data.maxTokens) {
    throw new Error("API limit exceeded.");
  }

  await supabase
    .from("apiUsage")
    .update({ totalTokens: data.totalTokens + tokensUsed })
    .eq("userId", userId);
}

export async function checkApiLimit(userId: string) {
  const { data, error } = await supabase
    .from("apiUsage")
    .select("totalTokens, maxTokens")
    .eq("userId", userId)
    .single();

  if (error || !data) throw new Error("User API record not found.");
  return data.totalTokens < data.maxTokens;
}

export async function updateUserBanStatus(userId: string, isBanned: boolean) {
  const { error } = await supabase
    .from("users")
    .update({ isBanned })
    .eq("id", userId);

  if (error) throw new Error("Failed to update ban status.");
}

export async function fetchUsersByRole(role: "student" | "teacher") {
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("role", role);

  if (error) throw new Error("Failed to fetch users.");
  return data;
}

export async function resetApiUsage() {
  const { error } = await supabase.from("apiUsage").update({ totalTokens: 0 });

  if (error) throw new Error("Failed to reset API usage.");
}

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
