import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Artists1771741542429 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'artists',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'slug',
            type: 'varchar',
            isUnique: true,
            isNullable: true,
          },
          { name: 'bio', type: 'text', isNullable: true },
          {
            name: 'summary',
            type: 'varchar',
            length: '500',
            isNullable: true,
          },
          {
            name: 'profilePictureUrl',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          {
            name: 'bannerUrl',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          { name: 'verified', type: 'boolean', default: false },
          { name: 'monthlyListeners', type: 'bigint', default: 0 },
          {
            name: 'popularity',
            type: 'numeric',
            precision: 5,
            scale: 2,
            default: 0,
          },
          { name: 'external_urls', type: 'json', isNullable: true },
          { name: 'country', type: 'varchar', isNullable: true },
          { name: 'debut_date', type: 'date', isNullable: true },
          {
            name: 'status',
            type: 'enum',
            enum: ['active', 'inactive'],
            default: "'active'",
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
      'artists',
      new TableIndex({ name: 'idx_artist_id', columnNames: ['id'] }),
    );
    await queryRunner.createIndex(
      'artists',
      new TableIndex({
        name: 'idx_artist_slug',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'artists',
      new TableIndex({
        name: 'idx_artist_popularity',
        columnNames: ['popularity'],
      }),
    );
    await queryRunner.createIndex(
      'artists',
      new TableIndex({
        name: 'idx_artist_isDeleted',
        columnNames: ['isDeleted'],
      }),
    );

    // ── GIN TRIGRAM INDEXES ───────────────────────────────────────────
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_artist_name_trgm ON artists USING gin (name gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_artist_slug_trgm ON artists USING gin (slug gin_trgm_ops)`,
    );

    // ── FOREIGN KEYS ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'artists',
      new TableForeignKey({
        name: 'fk_artists_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('artists', 'fk_artists_deleted_by');
    await queryRunner.query(`DROP INDEX IF EXISTS idx_artist_slug_trgm`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_artist_name_trgm`);
    await queryRunner.dropIndex('artists', 'idx_artist_isDeleted');
    await queryRunner.dropIndex('artists', 'idx_artist_popularity');
    await queryRunner.dropIndex('artists', 'idx_artist_slug');
    await queryRunner.dropIndex('artists', 'idx_artist_id');
    await queryRunner.dropTable('artists');
  }
}
