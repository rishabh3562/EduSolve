'use client';

import { useState, useEffect } from 'react';
import { Doubt, User } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { DoubtCardProps } from '@/lib/types';
import { fetchStudentById } from '@/lib/supabase';
import { generateGeminiAnswer } from '@/lib/aiService';
import { useAuth } from '@/lib/auth';

export function DoubtCard({ doubt, onViewDetails }: DoubtCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAnswer, setAiAnswer] = useState(doubt.aiAnswer);
  const [userData, setUserData] = useState<User[] | null>(null);
  const { user } = useAuth();
  const role = user?.role;

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStudentById(doubt.studentId);
      setUserData(data);
    };
    fetchData();
  }, [doubt.studentId]);

  const generateAnswer = async () => {
    setIsGenerating(true);
    try {
      const newAnswer = await generateGeminiAnswer(doubt.description);
      setAiAnswer(newAnswer);
      toast.success('Answer generated successfully');
    } catch (error) {
      toast.error('Failed to generate answer');
    } finally {
      setIsGenerating(false);
    }
  };

  const renderAnswers = () => {
    if (doubt.status === 'completed' || (role === 'teacher' && doubt.status === 'reviewing')) {
      return (
        <div className="space-y-3">
          {role === 'teacher' && aiAnswer && (
            <div className="bg-blue-100 p-4 rounded-lg border border-blue-400 shadow-md">
              <h4 className="font-semibold text-blue-900 mb-2">AI Answer:</h4>
              <p className="text-sm text-blue-800">{aiAnswer}</p>
            </div>
          )}
          {doubt.teacherAnswer && (
            <div className="bg-green-100 p-4 rounded-lg border border-green-400 shadow-md">
              <h4 className="font-semibold text-green-900 mb-2">Teacher's Answer:</h4>
              <p className="text-sm text-green-800">{doubt.teacherAnswer}</p>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{doubt.title}</CardTitle>
          <Badge variant="secondary">{doubt.subject}</Badge>
        </div>
        <div className="text-sm text-muted-foreground">
          {doubt.createdAt ? `${formatDistanceToNow(new Date(doubt.createdAt))} ago` : ' '}
          {' • '}
          {userData ? `By ${userData[0]?.name || 'Unknown'}` : 'Loading...'}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">{doubt.description}</p>
        {renderAnswers()}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <Badge variant="outline">{doubt.status}</Badge>
        <div className="flex gap-2">
          {doubt.status === 'pending' && role === 'teacher' && (
            <Button variant="secondary" size="sm" onClick={generateAnswer} disabled={isGenerating}>
              {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
              {aiAnswer ? 'Regenerate' : 'Generate'} Answer
            </Button>
          )}
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={() => onViewDetails(doubt.id)}>
              View Details
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}
