'use client';

import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Moon, Sun, BrainCircuit, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { toast } from 'sonner';

export function NavBar() {
  const { setTheme, theme } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
    toast.success('Logged out successfully');
  };

  return (
    <nav className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <BrainCircuit className="h-6 w-6" />
              <span className="font-bold text-xl">EduSolve</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {user.role === 'student' ? (
                  <>
                    <Link href="/dashboard">
                      <Button variant="ghost">Dashboard</Button>
                    </Link>
                    <Link href="/ask">
                      <Button variant="ghost">Ask Doubt</Button>
                    </Link>
                  </>
                ) : (
                  <Link href="/teacher">
                    <Button variant="ghost">Teacher Dashboard</Button>
                  </Link>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-red-500"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button variant="default">Login</Button>
              </Link>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}