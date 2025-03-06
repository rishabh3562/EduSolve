"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { DoubtCard } from "@/components/doubt-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Doubt } from "@/lib/types";
import { fetchDoubtsByStatus } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { Skeleton } from "@/components/ui/skeleton"; // Import your Skeleton component
import { DoubtCardSkeleton } from "@/components/skeletons/DoubtCardSkeleton";
import { Loader2 } from "lucide-react"; // Loader icon from shadcn/ui
import { SearchBar } from "@/components/SearchBar";
export default function TeacherDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingDoubts, setPendingDoubts] = useState<Doubt[]>([]);
  const [reviewingDoubts, setReviewingDoubts] = useState<Doubt[]>([]);
  const [completedDoubts, setCompletedDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { user } = useAuth();
  const filteredDoubts = (doubts: Doubt[]) =>
    doubts.filter((doubt) =>
      doubt.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  useEffect(() => {
    const loadDoubts = async () => {
      try {
        const teacherId = user?.id; // Get teacher ID
        const pending = await fetchDoubtsByStatus("pending", teacherId);
        const reviewing = await fetchDoubtsByStatus("reviewing", teacherId);
        const completed = await fetchDoubtsByStatus("completed", teacherId);

        setPendingDoubts(pending);
        setReviewingDoubts(reviewing);
        setCompletedDoubts(completed);
      } catch (error) {
        console.error("Error fetching doubts:", error);
      } finally {
        setLoading(false); // Stop loading after fetch
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

        <SearchBar onSearch={setSearchQuery} />

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">New ({pendingDoubts.length})</TabsTrigger>
            <TabsTrigger value="reviewing">Reviewing ({reviewingDoubts.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedDoubts.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {filteredDoubts(pendingDoubts).map((doubt) => (
              <DoubtCard key={doubt.id} doubt={doubt} onViewDetails={handleViewDetails} />
            ))}
          </TabsContent>

          <TabsContent value="reviewing">
            {filteredDoubts(reviewingDoubts).map((doubt) => (
              <DoubtCard key={doubt.id} doubt={doubt} onViewDetails={handleViewDetails} />
            ))}
          </TabsContent>

          <TabsContent value="completed">
            {filteredDoubts(completedDoubts).map((doubt) => (
              <DoubtCard key={doubt.id} doubt={doubt} onViewDetails={handleViewDetails} />
            ))}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
