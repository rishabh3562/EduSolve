"use client";
import { useEffect, useState } from "react";
import { NavBar } from "@/components/nav-bar";
import { DoubtCard } from "@/components/doubt-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { Doubt } from "@/lib/types";
import Link from "next/link";
import { fetchDoubtsByUserId } from "@/lib/supabase";
import { useAuth } from "@/lib/auth";
import ReactPaginate from "react-paginate";
import { SearchBar } from "@/components/SearchBar";

export default function Dashboard() {
  const [doubts, setDoubts] = useState<Doubt[] | null>(null);
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  useEffect(() => {
    const loadDoubts = async () => {
      if (user?.id) {
        const data: Doubt[] | null = await fetchDoubtsByUserId(user.id);
        setDoubts(data);
      }
    };
    loadDoubts();
  }, [user]);

  if (!doubts) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading doubts...</p>
      </div>
    );
  }

  const filteredDoubts = doubts.filter((d) =>
    d.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const pendingDoubts = filteredDoubts.filter((d) => d.status === "pending");
  const completedDoubts = filteredDoubts.filter((d) => d.status === "completed");
  const reviewingDoubts = filteredDoubts.filter((d) => d.status === "reviewing");

  const paginatedDoubts = (doubts: Doubt[]) => {
    const start = currentPage * itemsPerPage;
    return doubts.slice(start, start + itemsPerPage);
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between items-center mb-4 gap-4">
          <h1 className="text-3xl font-bold">Your Doubts</h1>
         
          <Link href="/ask">
            <Button className="gap-2">
              <PlusCircle className="h-5 w-5" />
              Ask New Doubt
            </Button>
          </Link>
        </div>
        <SearchBar onSearch={setSearchTerm} />
        <Tabs defaultValue="pending" className="w-full">
          <TabsList>
            <TabsTrigger value="pending">Pending ({pendingDoubts.length})</TabsTrigger>
            <TabsTrigger value="reviewing">Reviewing ({reviewingDoubts.length})</TabsTrigger>
            <TabsTrigger value="completed">Completed ({completedDoubts.length})</TabsTrigger>
          </TabsList>

          {['pending', 'reviewing', 'completed'].map((status) => {
            const statusDoubts = status === "pending" ? pendingDoubts : status === "reviewing" ? reviewingDoubts : completedDoubts;
            return (
              <TabsContent key={status} value={status} className="space-y-4">
                {statusDoubts.length > 0 ? (
                  paginatedDoubts(statusDoubts).map((doubt) => (
                    <Link key={doubt.id} href={`/dashboard/${doubt.id}`}>
                      <DoubtCard doubt={doubt} />
                    </Link>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-8">No {status} doubts</p>
                )}
                <ReactPaginate
                  previousLabel={"←"}
                  nextLabel={"→"}
                  pageCount={Math.ceil(statusDoubts.length / itemsPerPage)}
                  onPageChange={({ selected }) => setCurrentPage(selected)}
                  containerClassName="flex justify-center space-x-2 mt-4"
                  pageClassName="border rounded-md px-3 py-1"
                  activeClassName="bg-gray-200 font-bold"
                  disabledClassName="text-gray-400"
                />
              </TabsContent>
            );
          })}
        </Tabs>
      </main>
    </div>
  );
}