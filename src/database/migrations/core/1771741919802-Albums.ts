import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Albums1771741919802 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DB_SCHEMA ?? 'public';
    await queryRunner.query(
      `SET search_path TO "${schema}", extensions, public`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'albums',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'title', type: 'varchar', length: '255', isNullable: false },
          { name: 'slug', type: 'varchar', isUnique: true, isNullable: true },
          { name: 'releaseDate', type: 'date', isNullable: true },
          {
            name: 'type',
            type: 'enum',
            enum: ['album', 'single', 'ep', 'compilation'],
            default: "'album'",
          },
          { name: 'label', type: 'varchar', isNullable: true },
          {
            name: 'coverUrl',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          { name: 'totalTracks', type: 'integer', default: 0 },
          { name: 'totalDuration', type: 'integer', default: 0 },
          {
            name: 'popularity',
            type: 'numeric',
            precision: 5,
            scale: 2,
            default: 0,
          },
          { name: 'release_date', type: 'date', isNullable: false },
          {
            name: 'status',
            type: 'enum',
            enum: ['public', 'private', 'unlisted'],
            default: "'public'",
          },
          { name: 'external_urls', type: 'json', isNullable: true },
          { name: 'main_artist_id', type: 'uuid', isNullable: true },
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
      'albums',
      new TableIndex({ name: 'idx_album_id', columnNames: ['id'] }),
    );
    await queryRunner.createIndex(
      'albums',
      new TableIndex({
        name: 'idx_album_slug',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'albums',
      new TableIndex({
        name: 'idx_album_releaseDate',
        columnNames: ['releaseDate'],
      }),
    );
    await queryRunner.createIndex(
      'albums',
      new TableIndex({
        name: 'idx_album_popularity',
        columnNames: ['popularity'],
      }),
    );
    await queryRunner.createIndex(
      'albums',
      new TableIndex({
        name: 'idx_album_isDeleted',
        columnNames: ['isDeleted'],
      }),
    );
    await queryRunner.createIndex(
      'albums',
      new TableIndex({ name: 'idx_album_type', columnNames: ['type'] }),
    );

    // ── GIN trigram indexes ───────────────────────────────────────────
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_album_title_trgm ON albums USING gin (title gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_album_slug_trgm ON albums USING gin (slug gin_trgm_ops)`,
    );

    // ── Foreign keys ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'albums',
      new TableForeignKey({
        name: 'fk_albums_main_artist',
        columnNames: ['main_artist_id'],
        referencedTableName: 'artists',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createForeignKey(
      'albums',
      new TableForeignKey({
        name: 'fk_albums_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('albums', 'fk_albums_deleted_by');
    await queryRunner.dropForeignKey('albums', 'fk_albums_main_artist');
    await queryRunner.query(`DROP INDEX IF EXISTS idx_album_slug_trgm`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_album_title_trgm`);
    await queryRunner.dropIndex('albums', 'idx_album_type');
    await queryRunner.dropIndex('albums', 'idx_album_isDeleted');
    await queryRunner.dropIndex('albums', 'idx_album_popularity');
    await queryRunner.dropIndex('albums', 'idx_album_releaseDate');
    await queryRunner.dropIndex('albums', 'idx_album_slug');
    await queryRunner.dropIndex('albums', 'idx_album_id');
    await queryRunner.dropTable('albums');
  }
}
