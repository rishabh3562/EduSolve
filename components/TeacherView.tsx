import { useState } from 'react';
import { Doubt } from '@/lib/types';
import { updateDoubtStatus } from '@/lib/supabase';
import { toast } from 'sonner';
import { Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {generateGeminiAnswer} from '@/lib/aiService'
interface TeacherViewProps {
    doubt: Doubt;
    onViewDetails?: (id: string) => void;
}

export function TeacherView({ doubt, onViewDetails }: TeacherViewProps) {
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
        <div className="space-y-4">
            {doubt.status === 'pending' && (
                <div className="flex gap-2">
                    <Button variant="secondary" size="sm" onClick={generateAnswer} disabled={isGenerating}>
                        {isGenerating ? <RefreshCw className="h-4 w-4 animate-spin mr-2" /> : <Sparkles className="h-4 w-4 mr-2" />}
                        {aiAnswer ? 'Regenerate' : 'Generate'} Answer
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleReview}>
                        Review
                    </Button>
                </div>
            )}
            {(doubt.status === 'completed' || doubt.status === 'reviewing') && (
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
        </div>
    );
}
