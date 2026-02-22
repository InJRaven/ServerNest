import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

export class Users1771741408058 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
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
            name: 'profilePictureUrl',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          { name: 'birthDate', type: 'date', isNullable: true },
          { name: 'first_name', type: 'varchar', isNullable: true },
          { name: 'last_name', type: 'varchar', isNullable: true },
          { name: 'full_name', type: 'varchar', isNullable: true },
          { name: 'email_verified', type: 'boolean', default: false },
          { name: 'occupation', type: 'varchar', isNullable: true },
          { name: 'company_name', type: 'varchar', isNullable: true },
          { name: 'phone', type: 'varchar', isNullable: true },
          { name: 'lastLogin', type: 'timestamptz', isNullable: true },
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
      'users',
      new TableIndex({ name: 'idx_user_id', columnNames: ['id'] }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_user_username',
        columnNames: ['username'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_user_email',
        columnNames: ['email'],
        isUnique: true,
      }),
    );
    await queryRunner.createIndex(
      'users',
      new TableIndex({
        name: 'idx_user_isDeleted',
        columnNames: ['isDeleted'],
      }),
    );

    // ── GIN TRIGRAM INDEXES ───────────────────────────────────────────
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_user_username_trgm ON users USING gin (username gin_trgm_ops)`,
    );
    await queryRunner.query(
      `CREATE INDEX IF NOT EXISTS idx_user_email_trgm ON users USING gin (email gin_trgm_ops)`,
    );

    // ── FOREIGN KEYS ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'users',
      new TableForeignKey({
        name: 'fk_users_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('users', 'fk_users_deleted_by');
    await queryRunner.query(`DROP INDEX IF EXISTS idx_user_email_trgm`);
    await queryRunner.query(`DROP INDEX IF EXISTS idx_user_username_trgm`);
    await queryRunner.dropIndex('users', 'idx_user_isDeleted');
    await queryRunner.dropIndex('users', 'idx_user_email');
    await queryRunner.dropIndex('users', 'idx_user_username');
    await queryRunner.dropIndex('users', 'idx_user_id');
    await queryRunner.dropTable('users');
  }
}
