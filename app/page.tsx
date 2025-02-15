import { NavBar } from '@/components/nav-bar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <NavBar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Get Your Doubts Solved
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Connect with expert teachers and get instant solutions to your academic questions.
            Our AI-powered platform ensures quick and accurate responses.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/ask">
              <Button size="lg">Ask a Doubt</Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg">View Dashboard</Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}