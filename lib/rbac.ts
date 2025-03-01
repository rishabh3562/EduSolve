//code detached and dumped here for reference in the future

export const RBAC = {
  student: {
    canViewAnswers: false,
    canGenerateAnswer: false,
    canReviewDoubt: false,
    canViewDetails: false,
  },
  teacher: {
    canViewAnswers: true,
    canGenerateAnswer: true,
    canReviewDoubt: true,
    canViewDetails: true,
  },
  admin: {
    canViewAnswers: true,
    canGenerateAnswer: true,
    canReviewDoubt: true,
    canViewDetails: true,
  },
};




//this code is used to define the roles and permissions for the application
// and to check if a user has permission to perform a certain action.
// The hasPermission function checks if the user's role has the specified action in the permissions object.
// The AccessControl component uses the hasPermission function to conditionally render its children based on the user's role and the specified action.
// The RoleBasedView component uses the user's role to determine which view to render for a given doubt.

// src/lib/rbac.ts
// const permissions = {
//   student: ["view_doubt"],
//   teacher: ["view_doubt", "answer_doubt", "review_doubt"],
//   admin: ["view_doubt", "answer_doubt", "review_doubt", "manage_users"], // Example of a third role
// };

// export const hasPermission = (role: string | undefined, action: string) => {
//   return role ? permissions[role]?.includes(action) : false;
// };

// src/components/RoleBasedView.tsx
// import { StudentView } from './StudentView';
// import { TeacherView } from './TeacherView';
// import { AccessControl } from '@/components/AccessControl';
// import { Doubt } from '@/lib/types';

// interface RoleBasedViewProps {
//   role?: string;
//   doubt: Doubt;
//   onViewDetails?: (id: string) => void;
// }

// export function RoleBasedView({ role, doubt, onViewDetails }: RoleBasedViewProps) {
//   return (
//     <>
//       <AccessControl action="view_doubt">
//         {role === 'student' && <StudentView doubt={doubt} />}
//         {role === 'teacher' && <TeacherView doubt={doubt} onViewDetails={onViewDetails} />}
//         {/* Future role views can be added here */}
//       </AccessControl>
//     </>
//   );
// }
