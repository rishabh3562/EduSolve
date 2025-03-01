'use client';

import { useState } from 'react';
import { Doubt } from '@/lib/types';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Sparkles, RefreshCw } from 'lucide-react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { toast } from 'sonner';
import { DoubtCardProps } from '@/lib/types';

export function DoubtCard({ doubt, onViewDetails }: DoubtCardProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiAnswer, setAiAnswer] = useState(doubt.aiAnswer);

  const generateAnswer = async () => {
    setIsGenerating(true);
    try {
      // Simulate API call to Gemini
      await new Promise(resolve => setTimeout(resolve, 2000));
      const newAnswer = 'This is a simulated AI-generated answer using Gemini...';
      setAiAnswer(newAnswer);
      toast.success('Answer generated successfully');
    } catch (error) {
      toast.error('Failed to generate answer');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{doubt.title}</CardTitle>
          <Badge variant="secondary">{doubt.subject}</Badge>
        </div>
        <CardDescription>
          Posted {doubt.createdAt
            ? `Posted ${formatDistanceToNow(parseISO(doubt.createdAt))} ago`
            : 'Unknown Date'} ago
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {doubt.description}
        </p>
        {aiAnswer && (
          <div className="bg-secondary p-4 rounded-lg">
            <h4 className="font-medium mb-2">AI Answer:</h4>
            <p className="text-sm">{aiAnswer}</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        <Badge variant="outline">{doubt.status}</Badge>
        <div className="flex gap-2">
          {doubt.status === 'pending' && (
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
              {aiAnswer ? 'Regenerate' : 'Generate'} Answer
            </Button>
          )}
          {onViewDetails && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onViewDetails(doubt.id)}
            >
              View Details
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
}