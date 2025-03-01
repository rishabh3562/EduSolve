import { StudentView } from './StudentView';
import { TeacherView } from './TeacherView';
import { Doubt } from '@/lib/types';

interface RoleBasedViewProps {
    role?: string;
    doubt: Doubt;
    userData: any;
    onViewDetails?: (id: string) => void;
}

export function RoleBasedView({ role, doubt, userData, onViewDetails }: RoleBasedViewProps) {
    if (role === 'student') return <StudentView doubt={doubt} userData={userData} />;
    if (role === 'teacher') return <TeacherView doubt={doubt} userData={userData} onViewDetails={onViewDetails} />;
    return null; // Future roles can be added
}
