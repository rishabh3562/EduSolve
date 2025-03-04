import { Skeleton } from "@/components/ui/skeleton";

export function DoubtCardSkeleton() {
    return (
        <div className="p-4 border rounded-lg bg-card shadow-sm">
            {/* Title Skeleton */}
            <Skeleton className="h-6 w-3/4 mb-2" />

            {/* Metadata Skeleton (Date & Author) */}
            <Skeleton className="h-4 w-1/3 mb-4" />

            {/* Description Skeleton */}
            <Skeleton className="h-4 w-2/3 mb-4" />

            {/* Buttons Skeleton */}
            <div className="flex gap-4">
                <Skeleton className="h-8 w-24 rounded-md" />
                <Skeleton className="h-8 w-20 rounded-md" />
                <Skeleton className="h-8 w-24 rounded-md" />
            </div>
        </div>
    );
}
