export interface Doubt {
  id: string;
  title: string;
  description: string;
  subject: string;
  studentId: string;
  status: 'pending' | 'reviewing' | 'completed';
  createdAt: string;
  aiAnswer?: string;
  teacherAnswer?: string;
  teacherId?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: "student" | "teacher";
}


export const TEACHER_EMAIL = 'rishabh.dubey@example.com';
export const DUMMY_STUDENTS = [
  {
    id: 'student1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'student' as const,
  },
  {
    id: 'student2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'student' as const,
  },
];

export const TEACHER = {
  id: 'teacher1',
  name: 'Rishabh Dubey',
  email: TEACHER_EMAIL,
  role: 'teacher' as const,
};