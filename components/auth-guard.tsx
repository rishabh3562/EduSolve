"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const publicRoutes = ["/", "/login", "/auth/callback"];
const studentRoutes = ["/dashboard", "/ask"];
const teacherRoutes = ["/teacher", "/teacher/doubt"];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, init } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      await init();
      setLoading(false);
    };
    initialize();
  }, [init]);

  useEffect(() => {
    if (loading) return;

    if (!user && !publicRoutes.includes(pathname)) {
      router.push("/login");
      return;
    }
    if (user?.role === "student" && pathname.startsWith("/teacher")) {
      router.push("/dashboard");
      return;
    }
    if (user?.role === "teacher" && studentRoutes.includes(pathname)) {
      router.push("/teacher");
      return;
    }
  }, [user, pathname, router, loading]);

  if (loading) return <div>Loading...</div>; // Prevents flashing

  return <>{children}</>;
}
