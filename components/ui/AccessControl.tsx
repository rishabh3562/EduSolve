//code detached and dumped here for reference in the future



// // src/components/AccessControl.tsx
// import { ReactNode } from 'react';
// import { useAuth } from '@/lib/auth';
// import { hasPermission } from '@/lib/rbac';

// interface AccessControlProps {
//     action: string;
//     children: ReactNode;
// }

// export function AccessControl({ action, children }: AccessControlProps) {
//     const { user } = useAuth();
//     const role = user?.role?.toLowerCase();

//     if (!hasPermission(role, action)) {
//         return null; // Hide content if the user lacks permission
//     }

//     return <>{children}</>;
// }
