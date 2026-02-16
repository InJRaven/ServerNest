import { BaseService } from '@base';
import { defaultSubjects } from '@shared';
import { Injectable } from '@nestjs/common';
import { SubjectEntity } from '@PublicEntities';
import { SubjectRepository } from '@PublicRepositories';

@Injectable()
class SubjectServices extends BaseService<SubjectEntity> {
  constructor(protected readonly repository: SubjectRepository) {
    super(repository, '', 'Subject');
  }

  async onModuleInit() {
    this.logger.log('Checking and seeding subject on module initialization...');

    const existingCount = await this.repository.count();

    if (existingCount > 0) {
      this.logger.log(
        `ℹ️ Found ${existingCount} existing subject → skipping seed`,
      );
      return;
    }

    for (const subject of defaultSubjects) {
      await this.repository.create(subject);
      this.logger.log(`Created subject: ${subject.identify})`);
    }
  }
}
export { SubjectServices };
