export interface Doubt {
  id: string;
  title: string;
  description: string;
  subject: string;
  studentId: string;
  status: "pending" | "reviewing" | "completed";
  createdAt?: string | null | undefined;
  updatedAt?: string | null | undefined;
  aiAnswer?: string;
  teacherAnswer?: string;
  teacherId?: string;
}
export interface askFormDataType {
  title?: string;
  description: string;
  subject: string;
  studentId?: string;
  teacherId?: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
  isBanned?: boolean;
}
export interface DoubtCardProps {
  doubt: Doubt;
  onViewDetails?: (id: string) => void;
}
export interface ApiUsage {
   id: string; 
   userId: string;
   totalTokens: number;
   maxTokens: number;
   createdAt?: string;
   updatedAt?: string;
}
export interface TeacherViewProps {
  doubt: Doubt;
  userData: User | null;
  onViewDetails?: (id: string) => void;
}

// You can remove these if you're no longer using dummy data:
// export const TEACHER_EMAIL = 'rishabh.dubey@example.com';
// export const DUMMY_STUDENTS = [ ... ];
// export const TEACHER = { ... };

// export interface Doubt {
//   id: string;
//   title: string;
//   description: string;
//   subject: string;
//   studentId: string;
//   status: 'pending' | 'reviewing' | 'completed';
//   createdAt: string;
//   aiAnswer?: string;
//   teacherAnswer?: string;
//   teacherId?: string;
// }

// export interface User {
//   id: string;
//   name: string;
//   email: string;
//   role: "student" | "teacher";
// }

// export const TEACHER_EMAIL = 'rishabh.dubey@example.com';
// export const DUMMY_STUDENTS = [
//   {
//     id: 'student1',
//     name: 'John Doe',
//     email: 'john.doe@example.com',
//     role: 'student' as const,
//   },
//   {
//     id: 'student2',
//     name: 'Jane Smith',
//     email: 'jane.smith@example.com',
//     role: 'student' as const,
//   },
// ];

// export const TEACHER = {
//   id: 'teacher1',
//   name: 'Rishabh Dubey',
//   email: TEACHER_EMAIL,
//   role: 'teacher' as const,
// };
