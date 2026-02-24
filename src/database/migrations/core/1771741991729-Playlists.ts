import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
  TableIndex,
} from 'typeorm';

export class Playlists1771741991729 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DB_SCHEMA ?? 'public';
    await queryRunner.query(
      `SET search_path TO "${schema}", extensions, public`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'playlists',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          { name: 'name', type: 'varchar', length: '255', isNullable: false },
          { name: 'description', type: 'text', isNullable: true },
          {
            name: 'coverUrl',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          { name: 'isPublic', type: 'boolean', default: true },
          { name: 'isCollaborative', type: 'boolean', default: false },
          { name: 'followerCount', type: 'integer', default: 0 },
          { name: 'creatorId', type: 'uuid', isNullable: true },
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
      'playlists',
      new TableIndex({ name: 'idx_playlist_id', columnNames: ['id'] }),
    );
    await queryRunner.createIndex(
      'playlists',
      new TableIndex({
        name: 'idx_playlist_creator',
        columnNames: ['creatorId'],
      }),
    );
    await queryRunner.createIndex(
      'playlists',
      new TableIndex({
        name: 'idx_playlist_is_public',
        columnNames: ['isPublic'],
      }),
    );
    await queryRunner.createIndex(
      'playlists',
      new TableIndex({
        name: 'idx_playlist_isDeleted',
        columnNames: ['isDeleted'],
      }),
    );

    // ── GIN trigram indexes ───────────────────────────────────────────
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_playlist_name_trgm ON playlists USING gin (name gin_trgm_ops)`,
    );

    // ── Foreign keys ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'playlists',
      new TableForeignKey({
        name: 'fk_playlists_creator',
        columnNames: ['creatorId'],
        referencedTableName: 'users',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createForeignKey(
      'playlists',
      new TableForeignKey({
        name: 'fk_playlists_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('playlists', 'fk_playlists_deleted_by');
    await queryRunner.dropForeignKey('playlists', 'fk_playlists_creator');
    await queryRunner.query(`DROP INDEX IF EXISTS idx_playlist_name_trgm`);
    await queryRunner.dropIndex('playlists', 'idx_playlist_isDeleted');
    await queryRunner.dropIndex('playlists', 'idx_playlist_is_public');
    await queryRunner.dropIndex('playlists', 'idx_playlist_creator');
    await queryRunner.dropIndex('playlists', 'idx_playlist_id');
    await queryRunner.dropTable('playlists');
  }
}
