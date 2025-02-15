'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth';

const publicRoutes = ['/', '/login'];
const studentRoutes = ['/dashboard', '/ask'];
const teacherRoutes = ['/teacher', '/teacher/doubt'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!user && !publicRoutes.includes(pathname)) {
      router.push('/login');
      return;
    }

    if (user?.role === 'student' && pathname.startsWith('/teacher')) {
      router.push('/dashboard');
      return;
    }

    if (user?.role === 'teacher' && studentRoutes.includes(pathname)) {
      router.push('/teacher');
      return;
    }
  }, [user, pathname, router]);

  return <>{children}</>;
}