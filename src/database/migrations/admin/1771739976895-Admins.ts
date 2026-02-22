import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Admins1771739976895 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admins',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'username',
            type: 'varchar',
            length: '50',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'email',
            type: 'varchar',
            length: '255',
            isUnique: true,
            isNullable: false,
          },
          {
            name: 'password',
            type: 'varchar',
            length: '255',
            isNullable: false,
          },
          {
            name: 'firstName',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'lastName',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'occupation',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'company_name',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'language',
            type: 'varchar',
            default: "'en'",
            isNullable: true,
          },
          {
            name: 'lastLogin',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'verified',
            type: 'boolean',
            default: false,
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
    // ── INDEXES ──────────────────────────────────────────────────── //
    await queryRunner.createIndex(
      'admins',
      new TableIndex({
        name: 'idx_admin_username',
        columnNames: ['username'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'admins',
      new TableIndex({
        name: 'idx_admin_email',
        columnNames: ['email'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'admins',
      new TableIndex({
        name: 'idx_admin_isDeleted',
        columnNames: ['isDeleted'],
      }),
    );

    // ── GIN TRIGRAM INDEXES ───────────────────────────────────────────
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_admin_username_trgm ON admins USING gin (username gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_admin_email_trgm ON admins USING gin (email gin_trgm_ops)`,
    );

    // ── FOREIGN KEYS ──────────────────────────────────────────────────── //
    // Who Removed This Administrator
    await queryRunner.createForeignKey(
      'admins',
      new TableForeignKey({
        name: 'fk_admins_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('admins', 'fk_admins_deleted_by');
    await queryRunner.dropIndex('admins', 'idx_admin_isDeleted');
    await queryRunner.dropIndex('admins', 'idx_admin_email');
    await queryRunner.dropIndex('admins', 'idx_admin_username');
    await queryRunner.dropTable('admins');
  }
}
