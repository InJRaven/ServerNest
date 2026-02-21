import { BaseService } from '@base';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  InternalServerException,
  InvalidOperationException,
} from '@exceptions';
import { IApiResponse } from '@interfaces';
import { Injectable } from '@nestjs/common';
import {
  QuizEntity,
  SubjectEntity,
  SubjectQuizAssignmentsEntity,
} from '@PublicEntities';
import { QuizRepository } from '@PublicRepositories';
import { ResponseUtil } from '@utils';
import { DataSource, In } from 'typeorm';

interface ImportJson {
  identify: string;
  questions: {
    question: string;
    answers: string[];
  }[];
}

@Injectable()
export class QuizServices extends BaseService<QuizEntity> {
  constructor(
    protected readonly quiz: QuizRepository,

    private readonly dataSource: DataSource,
  ) {
    super(quiz, '', 'Quiz');
  }

  /* ======================================================
   * HELPER: PARSE JSON FILE
   ====================================================== */
  private parseJsonFile<T>(file: Express.Multer.File): T {
    try {
      return JSON.parse(file.buffer.toString('utf-8'));
    } catch (error) {
      this.logger.error('Failed to parse JSON file', error as Error);
      throw new InvalidOperationException('Invalid JSON file');
    }
  }

  async createQuizWithFile(file: Express.Multer.File): Promise<IApiResponse> {
    const start = this.logger.startTiming();
    this.logger.operation('CREATE', 'QuizWithFile');
    try {
      this.logger.step(1, 'Validating upload file');
      if (!file) {
        this.logger.validationError('file', 'File is required');
        throw new InvalidOperationException('File is required');
      }
      this.logger.step(2, 'Parsing JSON import file', {
        fileName: file.originalname,
        fileSize: file.size,
      });

      const parsed = this.parseJsonFile<ImportJson>(file);

      this.logger.step(3, 'Validating import payload structure');
      const { identify, questions } = parsed;

      if (!identify || !Array.isArray(questions) || questions.length === 0) {
        this.logger.validationError(
          'payload',
          'Invalid quiz import structure',
          parsed,
        );
        throw new InvalidOperationException('Invalid quiz import structure');
      }

      this.logger.step(4, 'Starting database transaction');

      const result = await this.dataSource.transaction(async (manager) => {
        this.logger.step(5, 'Finding subject', { identify });

        const subjectExit = await manager.findOne(SubjectEntity, {
          where: { identify: identify },
        });

        if (!subjectExit) {
          this.logger.notFound('Subject', 'identify|shortName', identify);
          throw new EntityNotFoundException('Subject', identify);
        }

        this.logger.step(6, 'Finding existing quizzes');

        const questionTexts = questions.map((q) => q.question);

        const quizzes = await manager.find(QuizEntity, {
          where: { question: In(questionTexts) },
        });

        if (quizzes.length > 0) {
          const dupliacateQuestions = quizzes.map((q) => q.question);

          this.logger.duplicateError('Quiz', 'question', dupliacateQuestions);

          throw new EntityAlreadyExistsException(
            'Quiz',
            'question',
            dupliacateQuestions,
            'CODE_DUPLICATE',
          );
        }

        this.logger.step(7, 'Creating new quizzes');
        const newQuizzes = questions.map((q) =>
          manager.create(QuizEntity, {
            subjectId: subjectExit.id,
            question: q.question,
            answers: q.answers,
          }),
        );

        const savedQuizzes = await manager.save(newQuizzes);

        this.logger.step(8, 'Creating subject-quiz assignments');

        const newAssignments = savedQuizzes.map((quiz) =>
          manager.create(SubjectQuizAssignmentsEntity, {
            subjectId: subjectExit.id,
            quizId: quiz.id,
          }),
        );

        await manager.save(newAssignments);

        return {
          subject: subjectExit.name,
          totalQuiz: savedQuizzes.length,
        };
      });
      const duration = this.logger.endTiming(
        start,
        'Create quiz with file completed',
      );

      this.logger.performance('QuizServices.createQuizWithFile', duration);

      return ResponseUtil.success('Create quiz with file successfully', result);
    } catch (error) {
      this.logger.error('Failed to create quiz with file', error as Error);

      if (
        error instanceof InvalidOperationException ||
        error instanceof EntityNotFoundException ||
        error instanceof EntityAlreadyExistsException
      ) {
        throw error;
      }

      throw new InternalServerException(
        'Failed to create quiz with file',
        error as Error,
        'QuizServices.createQuizWithFile',
      );
    }
  }
}
