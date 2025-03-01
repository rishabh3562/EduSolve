'use client';

import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { fetchStudentById } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { RoleBasedView } from './RoleBasedView';
import { DoubtCardProps, User } from '@/lib/types';

export function DoubtCard({ doubt, onViewDetails }: DoubtCardProps) {
  const [userData, setUserData] = useState<User[] | null>(null);
  const { user } = useAuth();
  const role = user?.role?.toLowerCase();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchStudentById(doubt.studentId);
      setUserData(data);
    };
    fetchData();
  }, [doubt.studentId]);

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
        <RoleBasedView role={role} doubt={doubt} onViewDetails={onViewDetails} />
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <Badge variant="outline">{doubt.status}</Badge>
        {onViewDetails && (
          <Button variant="outline" size="sm" onClick={() => onViewDetails(doubt.id)}>
            View Details
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
