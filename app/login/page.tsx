'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth';
import { DUMMY_STUDENTS, TEACHER } from '@/lib/types';
import { NavBar } from '@/components/nav-bar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (email: string) => {
    setIsLoading(true);
    try {
      login(email);
      if (email === TEACHER.email) {
        router.push('/teacher');
      } else {
        router.push('/dashboard');
      }
      toast.success('Logged in successfully');
    } catch (error) {
      toast.error('Failed to log in');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Login to EduSolve</CardTitle>
            <CardDescription>
              Choose an account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Teacher Account</h3>
              <Button
                className="w-full justify-start"
                variant="outline"
                disabled={isLoading}
                onClick={() => handleLogin(TEACHER.email)}
              >
                {TEACHER.name} ({TEACHER.email})
              </Button>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Student Accounts</h3>
              <div className="space-y-2">
                {DUMMY_STUDENTS.map((student) => (
                  <Button
                    key={student.id}
                    className="w-full justify-start"
                    variant="outline"
                    disabled={isLoading}
                    onClick={() => handleLogin(student.email)}
                  >
                    {student.name} ({student.email})
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}