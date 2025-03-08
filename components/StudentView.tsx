import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Doubt } from '@/lib/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github-dark.css';
interface StudentViewProps {
    doubt: Doubt;
    userData: any;
}

export function StudentView({ doubt, userData }: StudentViewProps) {
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

                {doubt.status === 'reviewing' && (
                    <div className="bg-yellow-100 p-3 rounded-md border border-yellow-400">
                        <p className="text-yellow-800 text-sm font-medium">
                            Your doubt is currently under review. You will get an answer soon!
                        </p>
                    </div>
                )}

                {/* Show Teacher's Answer when completed */}
                {doubt.status === 'completed' && doubt.teacherAnswer && (
                    <div className="bg-green-100 p-4 rounded-lg border border-green-400 shadow-md">
                        <h4 className="font-semibold text-green-900 mb-2">Teacher's Answer:</h4>
                        <p className="text-sm text-green-800">
                            <ReactMarkdown
                                remarkPlugins={[remarkGfm, remarkMath]}
                                rehypePlugins={[rehypeHighlight]}
                            >
                                {doubt.teacherAnswer}
                            </ReactMarkdown>
                            </p>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                <Badge variant="outline">{doubt.status}</Badge>
            </CardFooter>
        </Card>
    );
}
