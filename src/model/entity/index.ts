import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEnity } from './user.enity';

type EntitiesArg = Parameters<typeof TypeOrmModule.forFeature>[0];

export { UserEnity };
export const modeEntities: EntitiesArg = [UserEnity];
