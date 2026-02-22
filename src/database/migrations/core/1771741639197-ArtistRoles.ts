import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class ArtistRoles1771741639197 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'artist_roles',
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
            length: '60',
            isUnique: true,
            isNullable: false,
          },
          { name: 'isActive', type: 'boolean', default: true },
          { name: 'displayOrder', type: 'smallint', default: 100 },
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
      'artist_roles',
      new TableIndex({ name: 'idx_artist_roles_id', columnNames: ['id'] }),
    );
    await queryRunner.createIndex(
      'artist_roles',
      new TableIndex({
        name: 'idx_artist_roles_identify',
        columnNames: ['identify'],
      }),
    );
    await queryRunner.createIndex(
      'artist_roles',
      new TableIndex({
        name: 'idx_artist_roles_name',
        columnNames: ['name'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'artist_roles',
      new TableIndex({
        name: 'idx_artist_roles_isDeleted',
        columnNames: ['isDeleted'],
      }),
    );

    // ── FOREIGN KEYS ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'artist_roles',
      new TableForeignKey({
        name: 'fk_artist_roles_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'artist_roles',
      'fk_artist_roles_deleted_by',
    );
    await queryRunner.dropIndex('artist_roles', 'idx_artist_roles_isDeleted');
    await queryRunner.dropIndex('artist_roles', 'idx_artist_roles_name');
    await queryRunner.dropIndex('artist_roles', 'idx_artist_roles_identify');
    await queryRunner.dropIndex('artist_roles', 'idx_artist_roles_id');
    await queryRunner.dropTable('artist_roles');
  }
}
