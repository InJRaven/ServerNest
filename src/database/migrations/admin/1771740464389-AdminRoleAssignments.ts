import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

/**
 * Dependent:
 * - Admins     (FK adminId, assigned_by_id, deleted_by)
 * - AdminRoles (FK roleId)
 */

export class AdminRoleAssignments1771740464389 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'admin_role_assignments',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            default: 'uuid_generate_v4()',
          },
          {
            name: 'adminId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'roleId',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'assigned_by_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'assignedAt',
            type: 'timestamptz',
            default: 'now()',
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
      'admin_role_assignments',
      new TableIndex({
        name: 'idx_assignment_admin_active',
        columnNames: ['adminId', 'isActive'],
      }),
    );
    await queryRunner.createIndex(
      'admin_role_assignments',
      new TableIndex({
        name: 'idx_assignment_role',
        columnNames: ['roleId'],
      }),
    );
    await queryRunner.createIndex(
      'admin_role_assignments',
      new TableIndex({
        name: 'idx_assignment_assigned_at',
        columnNames: ['assignedAt'],
      }),
    );

    // ── Foreign keys ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'admin_role_assignments',
      new TableForeignKey({
        name: 'fk_assignment_admin',
        columnNames: ['adminId'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'admin_role_assignments',
      new TableForeignKey({
        name: 'fk_assignment_role',
        columnNames: ['roleId'],
        referencedTableName: 'admin_roles',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'admin_role_assignments',
      new TableForeignKey({
        name: 'fk_assignment_assigned_by',
        columnNames: ['assigned_by_id'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
    await queryRunner.createForeignKey(
      'admin_role_assignments',
      new TableForeignKey({
        name: 'fk_admin_role_assignments_deleted_by',
        columnNames: ['deleted_by'],
        referencedTableName: 'admins',
        referencedColumnNames: ['id'],
        onDelete: 'SET NULL',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey(
      'admin_role_assignments',
      'fk_admin_role_assignments_deleted_by',
    );
    await queryRunner.dropForeignKey(
      'admin_role_assignments',
      'fk_assignment_assigned_by',
    );
    await queryRunner.dropForeignKey(
      'admin_role_assignments',
      'fk_assignment_role',
    );
    await queryRunner.dropForeignKey(
      'admin_role_assignments',
      'fk_assignment_admin',
    );
    await queryRunner.dropIndex(
      'admin_role_assignments',
      'idx_assignment_assigned_at',
    );
    await queryRunner.dropIndex(
      'admin_role_assignments',
      'idx_assignment_role',
    );
    await queryRunner.dropIndex(
      'admin_role_assignments',
      'idx_assignment_admin_active',
    );
    await queryRunner.dropTable('admin_role_assignments');
  }
}
