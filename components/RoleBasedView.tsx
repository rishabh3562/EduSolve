import { StudentView } from './StudentView';
import { TeacherView } from './TeacherView';
import { Doubt } from '@/lib/types';

interface RoleBasedViewProps {
    role?: string;
    doubt: Doubt;
    onViewDetails?: (id: string) => void;
}

export function RoleBasedView({ role, doubt, onViewDetails }: RoleBasedViewProps) {
    if (role === 'student') {
        return <StudentView doubt={doubt} />;
    } else if (role === 'teacher') {
        return <TeacherView doubt={doubt} onViewDetails={onViewDetails} />;
    } else {
        return null; // Future roles can be added here
    }
}
