"use client"
import { useEffect, useState } from 'react';
import { NavBar } from '@/components/nav-bar';
import { DoubtCard } from '@/components/doubt-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { PlusCircle, Info } from 'lucide-react';
import { Doubt } from '@/lib/types';
import Link from 'next/link';
import { fetchDoubtsByUserId } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export default function Dashboard() {
  const [doubts, setDoubts] = useState<Doubt[] | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadDoubts = async () => {
      if (user?.id) {
        const data = await fetchDoubtsByUserId(user.id);
        setDoubts(data);
      }
    };
    loadDoubts();
  }, [user]);

  if (doubts === null) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading doubts...</p>
      </div>
    );
  }

  const pendingDoubts = doubts.filter(d => d.status === 'pending');
  const completedDoubts = doubts.filter(d => d.status === 'completed');
  const reviewingDoubts = doubts.filter(d => d.status === 'reviewing')
  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Your Doubts</h1>
          <Link href="/ask">
            <Button className="gap-2">
              <PlusCircle className="h-5 w-5" />
              Ask New Doubt
            </Button>
          </Link>
        </div>

        {/* Info message about Reviewing stage */}
        <div className="bg-yellow-100 border-l-4 border-yellow-500 p-4 mb-6 rounded-md flex items-start">
          <Info className="h-5 w-5 text-yellow-600 mr-2" />
          <p className="text-sm text-yellow-800">
            If you don’t see your doubts in the <strong>Pending</strong> or <strong>Completed</strong> columns, they might be in the <strong>Reviewing</strong> stage. You will get them soon!
          </p>
        </div>

        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">
              Pending ({pendingDoubts.length})
            </TabsTrigger>
            <TabsTrigger value="reviewing">
              Reviewing ({reviewingDoubts.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedDoubts.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="space-y-4">
            {pendingDoubts.length > 0 ? (
              pendingDoubts.map(doubt => (
                <DoubtCard key={doubt.id} doubt={doubt} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No pending doubts</p>
            )}
          </TabsContent>
          <TabsContent value="reviewing" className="space-y-4">
            {reviewingDoubts.length > 0 ? (
              reviewingDoubts.map(doubt => (
                <DoubtCard key={doubt.id} doubt={doubt} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No pending doubts</p>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            {completedDoubts.length > 0 ? (
              completedDoubts.map(doubt => (
                <DoubtCard key={doubt.id} doubt={doubt} />
              ))
            ) : (
              <p className="text-center text-muted-foreground py-8">No completed doubts</p>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
