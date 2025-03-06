"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { DoubtCard } from "@/components/doubt-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiUsage, Doubt } from "@/lib/types";
import { fetchDoubtsByStatus, fetchApiUsage } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { SearchBar } from "@/components/SearchBar";
import ReactPaginate from "react-paginate";

const itemsPerPage = 5;

export default function TeacherDashboard() {
  const router = useRouter();
  const { user } = useAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [doubts, setDoubts] = useState<{
    pending: Doubt[];
    reviewing: Doubt[];
    completed: Doubt[];
  }>({
    pending: [],
    reviewing: [],
    completed: [],
  });

  const [apiUsage, setApiUsage] = useState<ApiUsage | null>(null);


  useEffect(() => {
    if (!user?.id) return;

    const loadDoubts = async () => {
      setLoading(true);
      try {
        const [pending, reviewing, completed] = await Promise.all([
          fetchDoubtsByStatus("pending", user.id),
          fetchDoubtsByStatus("reviewing", user.id),
          fetchDoubtsByStatus("completed", user.id),
        ]);

        setDoubts({ pending, reviewing, completed });
      } catch (error) {
        console.error("Error fetching doubts:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDoubts();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    const loadApiUsage = async () => {
      try {
        const apiData = await fetchApiUsage(user.id);
        if (apiData) {
          setApiUsage({
            id: "", // Placeholder, since it's missing in API response
            userId: user.id, // Set from context
            totalTokens: apiData.totalTokens,
            maxTokens: apiData.maxTokens,
            createdAt: "", // Placeholder
            updatedAt: "", // Placeholder
          });
        }
      } catch (error) {
        console.error("Error loading API usage:", error);
      }
    };

    loadApiUsage();
  }, [user?.id]);

  const filteredDoubts = (doubts: Doubt[]) =>
    doubts.filter((doubt) =>
      doubt.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const paginateDoubts = (doubts: Doubt[]) => {
    const filtered = filteredDoubts(doubts);
    const pageCount = Math.ceil(filtered.length / itemsPerPage);
    const displayedDoubts = filtered.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
    return { displayedDoubts, pageCount };
  };

  const handlePageChange = ({ selected }: { selected: number }) => {
    setCurrentPage(selected);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/teacher/doubt/${id}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-8">Teacher Dashboard</h1>

        {apiUsage && (
          <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-4">
            <h2 className="text-xl font-semibold mb-2">API Usage</h2>
            <p><strong>Used Tokens:</strong> {apiUsage.totalTokens}</p>
            <p><strong>Allowed Tokens:</strong> {apiUsage.maxTokens}</p>
          </div>
        )}



        <SearchBar onSearch={setSearchQuery} />

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">New ({doubts.pending.length})</TabsTrigger>
            <TabsTrigger value="reviewing">Reviewing ({doubts.reviewing.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({doubts.completed.length})</TabsTrigger>
          </TabsList>

          {["pending", "reviewing", "completed"].map((status) => {
            const { displayedDoubts, pageCount } = paginateDoubts(doubts[status as keyof typeof doubts]);
            return (
              <TabsContent key={status} value={status}>
                {displayedDoubts.map((doubt) => (
                  <DoubtCard key={doubt.id} doubt={doubt} onViewDetails={handleViewDetails} />
                ))}
                <ReactPaginate
                  previousLabel={"←"}
                  nextLabel={"→"}
                  breakLabel={"..."}
                  pageCount={pageCount}
                  onPageChange={handlePageChange}
                  containerClassName={"flex gap-2 mt-4"}
                  activeClassName={"font-bold"}
                  pageClassName={"px-3 py-1 border rounded-md"}
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </main>
    </div>
  );
}
