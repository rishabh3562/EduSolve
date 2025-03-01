import { useState } from 'react';
import { Doubt } from '@/lib/types';
import {generateGeminiAnswer} from '@/lib/aiService'
import {updateDoubtStatus } from '@/lib/supabase';
import { toast } from 'sonner';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { RBAC } from '@/lib/rbac';

interface TeacherViewProps {
    doubt: Doubt;
    userData: any;
    onViewDetails?: (id: string) => void;
}

export function TeacherView({ doubt, userData, onViewDetails }: TeacherViewProps) {
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiAnswer, setAiAnswer] = useState(doubt.aiAnswer);

    const generateAnswer = async () => {
        setIsGenerating(true);
        try {
            const newAnswer = await generateGeminiAnswer(doubt.description);
            setAiAnswer(newAnswer);
            toast.success('Answer generated successfully');
        } catch {
            toast.error('Failed to generate answer');
        } finally {
            setIsGenerating(false);
        }
    };

    const handleReview = async () => {
        try {
            await updateDoubtStatus(doubt.id, 'reviewing');
            toast.success('Doubt status updated to reviewing');
            if (onViewDetails) onViewDetails(doubt.id);
        } catch {
            toast.error('Failed to update doubt status');
        }
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl">{doubt.title}</CardTitle>
                    <Badge variant="secondary">{doubt.subject}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                    {doubt.createdAt ? `${formatDistanceToNow(new Date(doubt.createdAt))} ago` : ''}
                    {' • '}
                    {userData ? `By ${userData[0]?.name || 'Unknown'}` : 'Loading...'}
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{doubt.description}</p>
                {RBAC.teacher.canViewAnswers && (
                    <div className="space-y-3">
                        {aiAnswer && (
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
                )}
            </CardContent>

            <CardFooter className="flex gap-2">
                {RBAC.teacher.canGenerateAnswer && (
                    <Button variant="secondary" size="sm" onClick={generateAnswer} disabled={isGenerating}>
                        {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        {aiAnswer ? 'Regenerate' : 'Generate'} Answer
                    </Button>
                )}
                {RBAC.teacher.canReviewDoubt && <Button variant="outline" size="sm" onClick={handleReview}>Review</Button>}
            </CardFooter>
        </Card>
    );
}
