"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { NavBar } from "@/components/nav-bar";
import { DoubtCard } from "@/components/doubt-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Doubt } from "@/lib/types";
import { fetchDoubtsByStatus } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import { SearchBar } from "@/components/SearchBar";
import ReactPaginate from "react-paginate";

const itemsPerPage = 5; // Show 5 doubts per page

export default function TeacherDashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingDoubts, setPendingDoubts] = useState<Doubt[]>([]);
  const [reviewingDoubts, setReviewingDoubts] = useState<Doubt[]>([]);
  const [completedDoubts, setCompletedDoubts] = useState<Doubt[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const loadDoubts = async () => {
      try {
        const teacherId = user?.id;
        const pending = await fetchDoubtsByStatus("pending", teacherId);
        const reviewing = await fetchDoubtsByStatus("reviewing", teacherId);
        const completed = await fetchDoubtsByStatus("completed", teacherId);

        setPendingDoubts(pending);
        setReviewingDoubts(reviewing);
        setCompletedDoubts(completed);
      } catch (error) {
        console.error("Error fetching doubts:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDoubts();
  }, []);

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

        <SearchBar onSearch={setSearchQuery} />

        <Tabs defaultValue="pending">
          <TabsList>
            <TabsTrigger value="pending">New ({pendingDoubts.length})</TabsTrigger>
            <TabsTrigger value="reviewing">Reviewing ({reviewingDoubts.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedDoubts.length})</TabsTrigger>
          </TabsList>

          {[
            { value: "pending", doubts: pendingDoubts },
            { value: "reviewing", doubts: reviewingDoubts },
            { value: "completed", doubts: completedDoubts },
          ].map(({ value, doubts }) => {
            const { displayedDoubts, pageCount } = paginateDoubts(doubts);
            return (
              <TabsContent key={value} value={value}>
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
