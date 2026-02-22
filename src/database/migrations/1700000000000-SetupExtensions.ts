import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * First Migration — Set Up The Necessary PostgreSQL Extensions.
 * IT MUST BE DONE BEFORE ALL OTHER MIGRATIONS.
 *
 * - uuid-ossp : Generate UUID for primary key (uuid_generate_v4())
 * - pg_trgm   : GIN trigram index for ILIKE '%abc%' search
 */
export class SetupExtensions1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`);
    await queryRunner.query(`CREATE EXTENSION IF NOT EXISTS "pg_trgm"`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
