
"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { Loader2 } from "lucide-react"; // Loader icon from shadcn/ui
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
  }, []);

  useEffect(() => {
    if (loading) return;

    if (!user && !publicRoutes.includes(pathname)) {
      router.push("/login");
    } else if (user?.role === "student" && pathname.startsWith("/teacher")) {
      router.push("/dashboard");
    } else if (user?.role === "teacher" && studentRoutes.includes(pathname)) {
      router.push("/teacher");
    }
  }, [user, pathname, router, loading]);

  return loading ? (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-500" />
    </div>
  ) : (
    <>{children}</>
  );
}
