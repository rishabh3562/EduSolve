"use client";

import { useAuth } from "@/lib/auth";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-md mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Login to EduSolve</CardTitle>
          </CardHeader>
          <CardContent>
            <Button className="w-full" onClick={login}>
              Sign in with Google
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
