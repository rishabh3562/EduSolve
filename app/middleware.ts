import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function middleware(req: NextRequest) {
  const { data } = await supabase.auth.getUser();

  if (!data?.user) return NextResponse.redirect("/login");

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"], // Protect dashboard routes
};

// import { NextRequest, NextResponse } from "next/server";
// import { supabase } from "@/lib/supabase";

// export async function middleware(req: NextRequest) {
//   const { data } = await supabase.auth.getUser();

//   if (!data?.user) return NextResponse.redirect("/login");

//   return NextResponse.next();
// }

// export const config = {
//   matcher: ["/dashboard/:path*"], // Protect dashboard routes
// };
