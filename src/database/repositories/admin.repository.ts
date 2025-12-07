import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AdminEntity } from '@entities';
import { BaseRepository } from '@base';

@Injectable()
class AdminRepository extends BaseRepository<AdminEntity> {
  constructor(
    @InjectRepository(AdminEntity)
    repository: Repository<AdminEntity>,
  ) {
    super(repository);
  }
}
export { AdminRepository };
