"use client";

import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

export default function Login() {
  const { login } = useAuth();

  const handleLogin = async () => {
    await login();
    toast.success("Redirecting to Google...");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Login to EduSolve</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={handleLogin}>
            Sign in with Google
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
