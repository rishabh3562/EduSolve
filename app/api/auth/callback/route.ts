import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req: NextRequest) {
  const { data, error } = await supabase.auth.getUser();

  if (!data?.user) {
    return NextResponse.redirect(new URL("/", req.nextUrl));
  }

  return NextResponse.redirect(new URL("/", req.nextUrl)); // Redirect to home after login
}
