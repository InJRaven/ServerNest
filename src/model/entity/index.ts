import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';

type EntitiesArg = Parameters<typeof TypeOrmModule.forFeature>[0];

export { UserEntity };

export const Entities: EntitiesArg = [UserEntity];
