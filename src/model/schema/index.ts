import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.schema';

type EntitiesArg = Parameters<typeof TypeOrmModule.forFeature>[0];

export { User };
export const schema: EntitiesArg = [User];
