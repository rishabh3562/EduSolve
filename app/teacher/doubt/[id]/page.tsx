'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { NavBar } from '@/components/nav-bar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, RefreshCw, CheckCircle, XCircle, User } from 'lucide-react';
import { formatDistanceToNow,parseISO } from 'date-fns';
import { toast } from 'sonner';
import { Doubt } from '@/lib/types';
import { getDoubtById ,approveDoubt,updateDoubtWithAIAnswer} from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
export default function DoubtReview({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [doubt, setDoubt] = useState<Doubt | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teacherAnswer, setTeacherAnswer] = useState('');
const {user:Teacher} =useAuth();
  useEffect(() => {
    const fetchDoubt = async () => {
      const doubtData = await getDoubtById(params.id);
      if (doubtData) setDoubt(doubtData);
    };
    fetchDoubt();
  }, [params.id]);


  const generateAnswer = async () => {
    if (!doubt) return; // Ensure doubt is available
    setIsGenerating(true);
    try {
      const aiAnswer = 'This is a simulated AI-generated answer using Gemini...';

      await updateDoubtWithAIAnswer(doubt.id, aiAnswer); // Only called if doubt exists

      setDoubt((prev) => (prev ? { ...prev, aiAnswer } : prev));
      setTeacherAnswer(aiAnswer);
      toast.success('Answer generated successfully');
    } catch (error) {
      toast.error('Failed to generate answer');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async () => {
    if (!doubt) return; // Ensure doubt is available before proceeding
    setIsSubmitting(true);
    try {
      await approveDoubt(doubt.id, teacherAnswer,Teacher?.id as string ); // Only called if doubt exists
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
                  Posted {doubt.createdAt
                    ? `Posted ${formatDistanceToNow(new Date(doubt.createdAt))} ago ago`
                    : 'Unknown Date'} ago
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

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">AI-Generated Answer:</h3>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={generateAnswer}
                  disabled={isGenerating}
                >
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
                  <p className="text-sm">{doubt.aiAnswer}</p>
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
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => router.push('/teacher')}
              disabled={isSubmitting}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isSubmitting || !teacherAnswer}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Approve & Send
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}