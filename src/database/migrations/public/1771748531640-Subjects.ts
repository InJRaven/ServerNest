import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Subjects1771748531640 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'subject',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'identify', type: 'varchar', isNullable: false },
          {
            name: 'shortName',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          { name: 'name', type: 'varchar', isNullable: true },
          {
            name: 'urlSubject',
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

    // ── INDEXES ───────────────────────────────────────────────────────
    await queryRunner.createIndex(
      'subject',
      new TableIndex({
        name: 'idx_quiz_identify',
        columnNames: ['identify'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'subject',
      new TableIndex({
        name: 'idx_quiz_shortName',
        columnNames: ['shortName'],
      }),
    );

    // ── GIN TRIGRAM INDEXES ───────────────────────────────────────────
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_subject_name_trgm ON subject USING gin (name gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_subject_shortName_trgm ON subject USING gin ("shortName" gin_trgm_ops)`,
    );

    // ── FOREIGN KEYS ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'subject',
      new TableForeignKey({
        name: 'fk_subject_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('subject', 'fk_subject_deleted_by');
    await queryRunner.query(`DROP INDEX IF EXISTS idx_subject_shortName_trgm`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_subject_name_trgm`);
    await queryRunner.dropIndex('subject', 'idx_quiz_shortName');
    await queryRunner.dropIndex('subject', 'idx_quiz_identify');
    await queryRunner.dropTable('subject');
  }
}
