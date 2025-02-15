'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/nav-bar';
import { DoubtCard } from '@/components/doubt-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Doubt } from '@/lib/types';

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
    status: 'reviewing',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    aiAnswer: 'Integration by parts is used when...',
  },
];

export default function TeacherDashboard() {
  const router = useRouter();
  const [doubts, setDoubts] = useState<Doubt[]>([]);

  useEffect(() => {
    // Simulate API call
    setDoubts(dummyDoubts);
  }, []);

  const pendingDoubts = doubts.filter(d => d.status === 'pending');
  const reviewingDoubts = doubts.filter(d => d.status === 'reviewing');
  const completedDoubts = doubts.filter(d => d.status === 'completed');

  const handleViewDetails = (id: string) => {
    router.push(`/teacher/doubt/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>
        
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              New ({pendingDoubts.length})
            </TabsTrigger>
            <TabsTrigger value="reviewing">
              Reviewing ({reviewingDoubts.length})
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
                onViewDetails={handleViewDetails}
              />
            ))}
            {pendingDoubts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No new doubts to review
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="reviewing" className="space-y-4">
            {reviewingDoubts.map(doubt => (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                onViewDetails={handleViewDetails}
              />
            ))}
            {reviewingDoubts.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No doubts under review
              </p>
            )}
          </TabsContent>
          
          <TabsContent value="completed" className="space-y-4">
            {completedDoubts.map(doubt => (
              <DoubtCard
                key={doubt.id}
                doubt={doubt}
                onViewDetails={handleViewDetails}
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