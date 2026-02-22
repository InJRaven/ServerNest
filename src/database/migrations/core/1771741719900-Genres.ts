import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Genres1771741719900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'genres',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'identify',
            type: 'varchar',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'name',
            type: 'varchar',
            length: '100',
            isUnique: true,
            isNullable: false,
          },
          { name: 'slug', type: 'varchar', isUnique: true, isNullable: true },
          { name: 'description', type: 'text', isNullable: true },
          { name: 'coverUrl', type: 'varchar', isNullable: true },
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
      'genres',
      new TableIndex({ name: 'idx_genre_id', columnNames: ['id'] }),
    );
    await queryRunner.createIndex(
      'genres',
      new TableIndex({
        name: 'idx_genre_identify',
        columnNames: ['identify'],
      }),
    );
    await queryRunner.createIndex(
      'genres',
      new TableIndex({
        name: 'idx_genre_name',
        columnNames: ['name'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'genres',
      new TableIndex({
        name: 'idx_genre_slug',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'genres',
      new TableIndex({
        name: 'idx_genre_isDeleted',
        columnNames: ['isDeleted'],
      }),
    );

    // ── GIN TRIGRAM INDEXES ───────────────────────────────────────────
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_genre_name_trgm ON genres USING gin (name gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_genre_slug_trgm ON genres USING gin (slug gin_trgm_ops)`,
    );

    // ── FOREIGN KEYS ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'genres',
      new TableForeignKey({
        name: 'fk_genres_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('genres', 'fk_genres_deleted_by');
    await queryRunner.query(`DROP INDEX IF EXISTS idx_genre_slug_trgm`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_genre_name_trgm`);
    await queryRunner.dropIndex('genres', 'idx_genre_isDeleted');
    await queryRunner.dropIndex('genres', 'idx_genre_slug');
    await queryRunner.dropIndex('genres', 'idx_genre_name');
    await queryRunner.dropIndex('genres', 'idx_genre_identify');
    await queryRunner.dropIndex('genres', 'idx_genre_id');
    await queryRunner.dropTable('genres');
  }
}
