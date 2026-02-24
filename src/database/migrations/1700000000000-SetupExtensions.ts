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
    const schema = process.env.DB_SCHEMA ?? 'public';

    // Tạo schema nếu chưa có
    await queryRunner.query(`CREATE SCHEMA IF NOT EXISTS "${schema}"`);

    // Extensions cài ở schema extensions (Supabase default)
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA extensions`,
    );
    await queryRunner.query(
      `CREATE EXTENSION IF NOT EXISTS "pg_trgm" SCHEMA extensions`,
    );

    // Set search_path để tìm thấy uuid_generate_v4() và gin_trgm_ops
    await queryRunner.query(
      `SET search_path TO "${schema}", extensions, public`,
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async down(queryRunner: QueryRunner): Promise<void> {}
}
