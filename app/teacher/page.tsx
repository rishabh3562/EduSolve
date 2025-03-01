'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/nav-bar';
import { DoubtCard } from '@/components/doubt-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Doubt } from '@/lib/types';
import { fetchDoubtsByStatus } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';


export default function TeacherDashboard() {
  const router = useRouter();
  const [pendingDoubts, setPendingDoubts] = useState<Doubt[]>([]);
  const [reviewingDoubts, setReviewingDoubts] = useState<Doubt[]>([]);
  const [completedDoubts, setCompletedDoubts] = useState<Doubt[]>([]);
const {user}=useAuth()
  useEffect(() => {
    const loadDoubts = async () => {
      try {
        const teacherId = user?.id; // Replace with actual teacher's ID (e.g., from auth)
        const pending = await fetchDoubtsByStatus("pending", teacherId);
        console.log("pending",pending)
        const reviewing = await fetchDoubtsByStatus("reviewing", teacherId);
        const completed = await fetchDoubtsByStatus("completed", teacherId);
        setPendingDoubts(pending);
        setReviewingDoubts(reviewing);
        setCompletedDoubts(completed);
      } catch (error) {
        console.error("Error fetching doubts:", error);
      }
    };
    loadDoubts();
  }, []);

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