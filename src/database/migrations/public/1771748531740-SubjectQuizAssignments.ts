import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableIndex,
  TableForeignKey,
} from 'typeorm';

/**
 * Dependent:
 * - CreateQuiz    (FK quizId)
 * - CreateSubject (FK subjectId)
 */
export class SubjectQuizAssignments1771748531740 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    const schema = process.env.DB_SCHEMA ?? 'public';
    await queryRunner.query(
      `SET search_path TO "${schema}", extensions, public`,
    );

    await queryRunner.createTable(
      new Table({
        name: 'subject_quiz_assignments',
        columns: [
          { name: 'subjectId', type: 'uuid', isPrimary: true },
          { name: 'quizId', type: 'uuid', isPrimary: true },
        ],
      }),
      true,
    );

    // ── Indexes ───────────────────────────────────────────────────────
    await queryRunner.createIndex(
      'subject_quiz_assignments',
      new TableIndex({ name: 'idx_sqa_subject', columnNames: ['subjectId'] }),
    );
    await queryRunner.createIndex(
      'subject_quiz_assignments',
      new TableIndex({ name: 'idx_sqa_quiz', columnNames: ['quizId'] }),
    );

    // ── Foreign keys ──────────────────────────────────────────────────
    await queryRunner.createForeignKey(
      'subject_quiz_assignments',
      new TableForeignKey({
        name: 'fk_sqa_subject',
        columnNames: ['subjectId'],
        referencedTableName: 'subject',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
    await queryRunner.createForeignKey(
      'subject_quiz_assignments',
      new TableForeignKey({
        name: 'fk_sqa_quiz',
        columnNames: ['quizId'],
        referencedTableName: 'quiz',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('subject_quiz_assignments', 'fk_sqa_quiz');
    await queryRunner.dropForeignKey(
      'subject_quiz_assignments',
      'fk_sqa_subject',
    );
    await queryRunner.dropIndex('subject_quiz_assignments', 'idx_sqa_quiz');
    await queryRunner.dropIndex('subject_quiz_assignments', 'idx_sqa_subject');
    await queryRunner.dropTable('subject_quiz_assignments');
  }
}
