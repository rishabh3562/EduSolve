import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: Request) {
  const { data, error } = await supabase.auth.getUser();
  if (!data?.user) return NextResponse.redirect("/login");

  return NextResponse.redirect("/dashboard");
}
export async function POST(req: Request) {
  const { data, error } = await supabase.auth.getUser();
  if (!data?.user) return NextResponse.redirect("/login");

  return NextResponse.redirect("/dashboard");
}