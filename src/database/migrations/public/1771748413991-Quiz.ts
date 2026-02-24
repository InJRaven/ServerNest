import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Quiz1771748413991 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DB_SCHEMA ?? 'public';
    await queryRunner.query(
      `SET search_path TO "${schema}", extensions, public`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'quiz',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'question',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'answers',
            type: 'text',
            isArray: true,
            isNullable: true,
            default: 'ARRAY[]::text[]',
          },
          // ── BaseEntity ────────────────────────────────────────────
          { name: 'isDeleted', type: 'boolean', default: false },
          { name: 'createdAt', type: 'timestamptz', default: 'now()' },
          { name: 'updatedAt', type: 'timestamptz', default: 'now()' },
          { name: 'deletedAt', type: 'timestamptz', isNullable: true },
          { name: 'deleted_by', type: 'uuid', isNullable: true },
        ],
      }),
      true,
    );

    // ── Indexes ───────────────────────────────────────────────────────
    await queryRunner.createIndex(
      'quiz',
      new TableIndex({ name: 'idx_quiz_id', columnNames: ['id'] }),
    );

    // ── GIN trigram indexes ───────────────────────────────────────────
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_quiz_question_trgm ON quiz USING gin (question gin_trgm_ops)`,
    );

    // ── Foreign keys ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'quiz',
      new TableForeignKey({
        name: 'fk_quiz_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('quiz', 'fk_quiz_deleted_by');
    await queryRunner.query(`DROP INDEX IF EXISTS idx_quiz_question_trgm`);
    await queryRunner.dropIndex('quiz', 'idx_quiz_id');
    await queryRunner.dropTable('quiz');
  }
}
