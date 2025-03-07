'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/nav-bar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Doubt } from '@/lib/types';
import { getDoubtById, approveDoubt, updateDoubtWithAIAnswer } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { generateGeminiAnswer } from '@/lib/aiService';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';

export default function DoubtReview({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [doubt, setDoubt] = useState<Doubt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherAnswer, setTeacherAnswer] = useState('');
  const [context, setContext] = useState('');
  const { user: Teacher } = useAuth();

  useEffect(() => {
    const fetchDoubt = async () => {
      const doubtData = await getDoubtById(params.id);
      if (doubtData) setDoubt(doubtData);
    };
    fetchDoubt();
  }, [params.id]);

  const generateAnswer = async () => {
    if (!doubt) return;
    setIsGenerating(true);
    try {
      const aiAnswer = await generateGeminiAnswer(doubt.title, doubt.description, context);
      await updateDoubtWithAIAnswer(doubt.id, aiAnswer);
      setDoubt((prev) => (prev ? { ...prev, aiAnswer } : prev));
      setTeacherAnswer(aiAnswer || '');
      toast.success('Answer generated successfully');
    } catch (error) {
      toast.error('Failed to generate answer');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (!doubt) return;
    setIsSubmitting(true);
    try {
      await approveDoubt(doubt.id, teacherAnswer, Teacher?.id as string);
      toast.success('Doubt approved and sent to student');
      router.push('/teacher');
    } catch (error) {
      toast.error('Failed to approve doubt');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!doubt) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-2xl">{doubt.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  {doubt.createdAt
                    ? `Posted ${formatDistanceToNow(new Date(doubt.createdAt))} ago`
                    : 'Unknown Date'}
                </p>
              </div>
              <Badge variant="secondary">{doubt.subject}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-medium mb-2">Student's Question:</h3>
              <p className="text-sm">{doubt.description}</p>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Additional Context:</h3>
              <Textarea
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="Provide extra details to improve AI's response..."
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">AI-Generated Answer:</h3>
                <Button variant="secondary" size="sm" onClick={generateAnswer} disabled={isGenerating}>
                  {isGenerating ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {doubt.aiAnswer ? 'Regenerate' : 'Generate'} Answer
                </Button>
              </div>
              {doubt.aiAnswer && (
                <div className="bg-secondary p-4 rounded-lg">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm, remarkMath]}
                    rehypePlugins={[rehypeHighlight]}
                   
                  >
                    {doubt.aiAnswer}
                  </ReactMarkdown>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <h3 className="font-medium">Your Response:</h3>
              <Textarea
                value={teacherAnswer}
                onChange={(e) => setTeacherAnswer(e.target.value)}
                placeholder="Edit or write your own answer..."
                className="min-h-[200px]"
              />
              {teacherAnswer && (
                <div className="bg-secondary p-4 rounded-lg">
                  <ReactMarkdown>{teacherAnswer}</ReactMarkdown>
                </div>
              )}
            </div>


          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button variant="outline" onClick={() => router.push('/teacher')} disabled={isSubmitting}>
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button onClick={handleApprove} disabled={isSubmitting}>
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Send
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}