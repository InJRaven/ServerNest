import { Injectable } from '@nestjs/common';
import { BaseService } from '@base';
import { ArtistRole } from '@CoreEntities';
import { ArtistRolesRepository } from '@CoreRepositories';
import { defaultArtsitRoles } from '@shared';

@Injectable()
class ArtistRolesService extends BaseService<ArtistRole> {
  constructor(protected readonly repository: ArtistRolesRepository) {
    super(repository, '', 'ArtistRoles');
  }

  async onModuleInit() {
    this.logger.log(
      'Checking and seeding artist roles on module initialization...',
    );

    const existingCount = await this.repository.count();
    if (existingCount > 0) {
      this.logger.log(
        `ℹ️ Found ${existingCount} existing roles → skipping seed`,
      );
      return;
    }

    for (const role of defaultArtsitRoles) {
      await this.repository.create(role);
      this.logger.log(
        `Created artist role: ${role.name} (isActive: ${role.isActive})`,
      );
    }
  }
}
export { ArtistRolesService };
