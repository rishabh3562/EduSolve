"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { notFound } from "next/navigation";
import { fetchDoubtById } from "@/lib/supabase";
import { Doubt } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import { NavBar } from "@/components/nav-bar";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface PageProps {
    params: { id: string };
}

export default function Page({ params }: PageProps) {
    const [doubt, setDoubt] = useState<Doubt | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadDoubt = async () => {
            try {
                const data: Doubt | null = await fetchDoubtById(params.id);
                setDoubt(data);
            } catch (error) {
                console.error("Error fetching doubt:", error);
            } finally {
                setLoading(false);
            }
        };
        loadDoubt();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-muted-foreground">Loading...</p>
            </div>
        );
    }

    if (!doubt) return notFound();

    return (
        <>
            <NavBar />

            <main className="max-w-2xl mx-auto p-6">
                {/* Back Button */}
                <Button variant="outline" onClick={() => router.back()} className="mb-4 flex items-center gap-2">
                    <ArrowLeft className="h-5 w-5" />
                    Back
                </Button>

                <h1 className="text-2xl font-bold">{doubt.title}</h1>
                <p className="text-muted-foreground text-sm">
                    {doubt.createdAt ? `${formatDistanceToNow(new Date(doubt.createdAt))} ago` : ""} • Subject: {doubt.subject}
                </p>

                <section className="mt-4">
                    <h2 className="text-lg font-semibold">Student's Question:</h2>
                    <ReactMarkdown>{doubt.description}</ReactMarkdown>
                </section>

                {doubt.teacherAnswer && (
                    <section className="mt-6 p-4 bg-blue-100 rounded-md">
                        <h2 className="text-lg font-semibold">Teacher's Answer:</h2>
                        <ReactMarkdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeHighlight]}>
                            {doubt.teacherAnswer}
                        </ReactMarkdown>
                    </section>
                )}
            </main>
        </>
    );
}
