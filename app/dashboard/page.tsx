'use client';

import { useState, useEffect } from 'react';
import { NavBar } from '@/components/nav-bar';
import { DoubtCard } from '@/components/doubt-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { Doubt } from '@/lib/types';
import Link from 'next/link';

// Dummy data for demonstration
const dummyDoubts: Doubt[] = [
  {
    id: '1',
    title: 'Understanding Quantum Mechanics',
    description: 'I\'m having trouble understanding the concept of quantum superposition...',
    subject: 'Physics',
    studentId: 'student1',
    status: 'pending',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Integration by Parts',
    description: 'Can someone explain when to use integration by parts?',
    subject: 'Mathematics',
    studentId: 'student1',
    status: 'completed',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    aiAnswer: 'Integration by parts is used when...',
    teacherAnswer: 'Great explanation! Also consider...',
    teacherId: 'teacher1',
  },
];

export default function Dashboard() {
  const [doubts, setDoubts] = useState<Doubt[]>([]);

  useEffect(() => {
    // Simulate API call
    setDoubts(dummyDoubts);
  }, []);

  const pendingDoubts = doubts.filter(d => d.status === 'pending');
  const completedDoubts = doubts.filter(d => d.status === 'completed');

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Your Doubts</h1>
          <Link href="/ask">
            <Button className="gap-2">
              <PlusCircle className="h-5 w-5" />
              Ask New Doubt
            </Button>
          </Link>
        </div>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingDoubts.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedDoubts.length})
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-4">
            {pendingDoubts.map(doubt => (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                onViewDetails={(id) => console.log('View details:', id)}
              />
            ))}
            {pendingDoubts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No pending doubts
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedDoubts.map(doubt => (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                onViewDetails={(id) => console.log('View details:', id)}
              />
            ))}
            {completedDoubts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No completed doubts
              </p>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}