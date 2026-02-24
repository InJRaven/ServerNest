import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Tracks1771741919702 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DB_SCHEMA ?? 'public';
    await queryRunner.query(
      `SET search_path TO "${schema}", extensions, public`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'tracks',
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
          { name: 'duration', type: 'integer', isNullable: false },
          { name: 'summary', type: 'varchar', length: '500', isNullable: true },
          { name: 'releaseDate', type: 'date', isNullable: true },
          { name: 'lyrics', type: 'text', isNullable: true },
          {
            name: 'audioUrl',
            type: 'varchar',
            length: '512',
            isNullable: false,
          },
          {
            name: 'coverUrl',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          { name: 'explicit', type: 'boolean', default: false },
          { name: 'bpm', type: 'integer', isNullable: true },
          { name: 'playCount', type: 'bigint', default: 0 },
          { name: 'likeCount', type: 'integer', default: 0 },
          {
            name: 'popularity',
            type: 'numeric',
            precision: 5,
            scale: 2,
            default: 0,
          },
          { name: 'status', type: 'varchar', default: "'active'" },
          { name: 'external_urls', type: 'json', isNullable: true },
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
      'tracks',
      new TableIndex({ name: 'idx_track_id', columnNames: ['id'] }),
    );
    await queryRunner.createIndex(
      'tracks',
      new TableIndex({
        name: 'idx_track_slug',
        columnNames: ['slug'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'tracks',
      new TableIndex({
        name: 'idx_track_popularity',
        columnNames: ['popularity'],
      }),
    );
    await queryRunner.createIndex(
      'tracks',
      new TableIndex({
        name: 'idx_track_playCount',
        columnNames: ['playCount'],
      }),
    );
    await queryRunner.createIndex(
      'tracks',
      new TableIndex({ name: 'idx_track_status', columnNames: ['status'] }),
    );
    await queryRunner.createIndex(
      'tracks',
      new TableIndex({
        name: 'idx_track_releaseDate',
        columnNames: ['releaseDate'],
      }),
    );
    await queryRunner.createIndex(
      'tracks',
      new TableIndex({
        name: 'idx_track_isDeleted',
        columnNames: ['isDeleted'],
      }),
    );

    // ── GIN trigram indexes ───────────────────────────────────────────
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_track_title_trgm ON tracks USING gin (title gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_track_slug_trgm ON tracks USING gin (slug gin_trgm_ops)`,
    );

    // ── Foreign keys ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'tracks',
      new TableForeignKey({
        name: 'fk_tracks_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('tracks', 'fk_tracks_deleted_by');
    await queryRunner.query(`DROP INDEX IF EXISTS idx_track_slug_trgm`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_track_title_trgm`);
    await queryRunner.dropIndex('tracks', 'idx_track_isDeleted');
    await queryRunner.dropIndex('tracks', 'idx_track_releaseDate');
    await queryRunner.dropIndex('tracks', 'idx_track_status');
    await queryRunner.dropIndex('tracks', 'idx_track_playCount');
    await queryRunner.dropIndex('tracks', 'idx_track_popularity');
    await queryRunner.dropIndex('tracks', 'idx_track_slug');
    await queryRunner.dropIndex('tracks', 'idx_track_id');
    await queryRunner.dropTable('tracks');
  }
}
