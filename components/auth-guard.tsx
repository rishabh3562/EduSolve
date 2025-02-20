"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const publicRoutes = ["/", "/login", "/auth/callback"];
const studentRoutes = ["/dashboard", "/ask"];
const teacherRoutes = ["/teacher", "/teacher/doubt"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, init } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Run initialization to set the user state.
  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    // If not logged in and not on a public route, redirect to login.
    if (!user && !publicRoutes.includes(pathname)) {
      router.push("/login");
      return;
    }
    // Prevent students from accessing teacher routes.
    if (user?.role === "student" && pathname.startsWith("/teacher")) {
      router.push("/dashboard");
      return;
    }
    // Prevent teachers from accessing student routes.
    if (user?.role === "teacher" && studentRoutes.includes(pathname)) {
      router.push("/teacher");
      return;
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}
