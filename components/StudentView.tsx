import { Doubt } from '@/lib/types';

interface StudentViewProps {
    doubt: Doubt;
}

export function StudentView({ doubt }: StudentViewProps) {
    if (doubt.status === 'reviewing') {
        return (
            <div className="bg-yellow-100 p-3 rounded-md border border-yellow-400">
                <p className="text-yellow-800 text-sm font-medium">
                    Your doubt is currently under review. You will get an answer soon!
                </p>
            </div>
        );
    }
    return null;
}
