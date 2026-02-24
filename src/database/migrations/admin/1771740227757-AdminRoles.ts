import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

/**
 * Phụ thuộc: 1771739976895-Admins (FK deleted_by)
 */
export class AdminRoles1771740227757 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DB_SCHEMA ?? 'public';
    await queryRunner.query(
      `SET search_path TO "${schema}", extensions, public`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'admin_roles',
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
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'displayOrder',
            type: 'integer',
            isNullable: true,
          },
          {
            name: 'isSuperAdmin',
            type: 'boolean',
            default: false,
            isNullable: true,
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'revokedAt',
            type: 'timestamptz',
            isNullable: true,
          },
          // ── BaseEntity ──────────────────────────────────────────────
          {
            name: 'isDeleted',
            type: 'boolean',
            default: false,
          },
          {
            name: 'createdAt',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'updatedAt',
            type: 'timestamptz',
            default: 'now()',
          },
          {
            name: 'deletedAt',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'deleted_by',
            type: 'uuid',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    // ── Indexes ───────────────────────────────────────────────────────
    await queryRunner.createIndex(
      'admin_roles',
      new TableIndex({
        name: 'idx_admin_role_identify',
        columnNames: ['identify'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'admin_roles',
      new TableIndex({
        name: 'idx_admin_role_name',
        columnNames: ['name'],
        isUnique: true,
      }),
    );

    // ── GIN trigram indexes ───────────────────────────────────────────
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_admin_role_name_trgm ON admin_roles USING gin (name gin_trgm_ops)`,
    );

    // ── Foreign keys ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'admin_roles',
      new TableForeignKey({
        name: 'fk_admin_roles_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'admin_roles',
      'fk_admin_roles_deleted_by',
    );
    await queryRunner.query(`DROP INDEX IF EXISTS idx_admin_role_name_trgm`);
    await queryRunner.dropIndex('admin_roles', 'idx_admin_role_name');
    await queryRunner.dropIndex('admin_roles', 'idx_admin_role_identify');
    await queryRunner.dropTable('admin_roles');
  }
}
