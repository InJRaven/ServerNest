import { Injectable } from '@nestjs/common';
import { BaseService } from '@base';
import { AdminRole } from '@AdminEntities';
import { AdminRoleRepository } from '@AdminRepositories';
import { defaultAdminRoles } from '@shared';

@Injectable()
class AdminRoleService extends BaseService<AdminRole> {
  constructor(protected readonly repository: AdminRoleRepository) {
    super(repository, '', 'AdminRole');
  }

  async onModuleInit() {
    this.logger.log(
      'Checking and seeding admin roles on module initialization...',
    );
    const existingCount = await this.repository.count();

    if (existingCount > 0) {
      this.logger.log(
        `ℹ️ Found ${existingCount} existing roles → skipping seed`,
      );
      return;
    }

    for (const role of defaultAdminRoles) {
      await this.repository.create(role);
      this.logger.log(
        `Created role: ${role.name} (isSuperAdmin: ${role.isSuperAdmin})`,
      );
    }
    this.logger.log(`✅ Admin roles seeding completed! Created`);
  }
}
export { AdminRoleService };
