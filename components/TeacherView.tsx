import { useState } from 'react';
import { Doubt } from '@/lib/types';
import { generateGeminiAnswer } from '@/lib/aiService';
import { updateDoubtStatus } from '@/lib/supabase';
import { toast } from 'sonner';
import { Sparkles, RefreshCw, Eye } from 'lucide-react';
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
    const [isUpdating, setIsUpdating] = useState(false);
    const [showFullDesc, setShowFullDesc] = useState(false);

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
        setIsUpdating(true);
        try {
            await updateDoubtStatus(doubt.id, 'reviewing');
            toast.success('Doubt status updated to Reviewing');
        } catch {
            toast.error('Failed to update status');
        } finally {
            setIsUpdating(false);
        }
    };

    return (
        <Card className="w-full shadow-md">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold">{doubt.title}</CardTitle>
                    <Badge variant="secondary">{doubt.subject}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                    {doubt.createdAt ? `${formatDistanceToNow(new Date(doubt.createdAt))} ago` : ''}
                    {' • '}
                    {userData ? `By ${userData[0]?.name || 'Unknown'}` : 'Loading...'}
                </p>
            </CardHeader>

            <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                    {showFullDesc ? doubt.description : doubt.description.slice(0, 200) + (doubt.description.length > 200 ? '...' : '')}
                    {doubt.description.length > 200 && (
                        <Button variant="link" size="sm" className="ml-1 text-blue-600" onClick={() => setShowFullDesc(!showFullDesc)}>
                            {showFullDesc ? 'Show Less' : 'Read More'}
                        </Button>
                    )}
                </p>

                {RBAC.teacher.canViewAnswers && (
                    <div className="space-y-3">
                        {aiAnswer && (
                            <div className="bg-blue-100 p-3 rounded-md border border-blue-400">
                                <h4 className="font-medium text-blue-900 mb-1">AI Answer:</h4>
                                <p className="text-sm text-blue-800">{aiAnswer}</p>
                            </div>
                        )}
                        {doubt.teacherAnswer && (
                            <div className="bg-green-100 p-3 rounded-md border border-green-400">
                                <h4 className="font-medium text-green-900 mb-1">Teacher's Answer:</h4>
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
                {RBAC.teacher.canReviewDoubt && (
                    <Button variant="outline" size="sm" onClick={handleReview} disabled={isUpdating}>
                        {isUpdating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : 'Review'}
                    </Button>
                )}
                {RBAC.teacher.canViewDetails && onViewDetails && (
                    <Button variant="ghost" size="sm" onClick={() => onViewDetails(doubt.id)}>
                        <Eye className="h-4 w-4 mr-1" /> View Details
                    </Button>
                )}
            </CardFooter>
        </Card>
    );
}
