'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { fetchStudentById } from '@/lib/supabase';
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

  return <RoleBasedView role={role} doubt={doubt} userData={userData} onViewDetails={onViewDetails} />;
}
