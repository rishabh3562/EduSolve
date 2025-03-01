import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import { Doubt } from '@/lib/types';

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
            </CardContent>

            <CardFooter className="flex justify-between items-center">
                <Badge variant="outline">{doubt.status}</Badge>
            </CardFooter>
        </Card>
    );
}
