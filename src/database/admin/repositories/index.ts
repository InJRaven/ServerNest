import { AdminRepository } from './admin.repository';
import { AdminRoleRepository } from './admin_role.repository';
import { AdminRoleAssignmentRepository } from './admin_role_assignments.repository';

export { AdminRepository, AdminRoleRepository, AdminRoleAssignmentRepository };

export const AdminRepositories = [
  AdminRoleRepository,
  AdminRoleAssignmentRepository,
  AdminRepository,
];
