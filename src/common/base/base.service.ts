import {
  EntityNotFoundException,
  InternalServerException,
  InvalidOperationException,
} from '@exceptions';
import { IApiResponse } from '@interfaces';
import { BaseRepository } from './base.repository';
import { LoggerUtil, ResponseUtil, SlugEncoderUtil } from '@utils';
import { FindManyOptions } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
abstract class BaseService<Entity extends { id: string; is_deleted: boolean }> {
  protected readonly logger: LoggerUtil;
  constructor(
    protected readonly repository: BaseRepository<Entity>,
    protected readonly mapper: any,
    protected readonly Entity: string,
  ) {
    this.logger = new LoggerUtil(`${Entity}Service`);
  }

  protected validateID(id: string) {
    if (!id) {
      this.logger.validationError('id', `${this.Entity} ID is required`, id);
      throw new InvalidOperationException(`${this.Entity} ID is required`);
    }
  }

  protected validatePagination(limit: number, offset: number) {
    if (limit < 1) {
      this.logger.validationError('limit', 'Limit must be >= 1', limit);
      throw new InvalidOperationException('Limit must be >= 1');
    }
    if (offset < 0) {
      this.logger.validationError('offset', 'Offset must be >= 0', offset);
      throw new InvalidOperationException('Offset must be >= 0');
    }
  }

  protected async checkExistsWithID(
    options: FindManyOptions<Entity>,
  ): Promise<Entity> {
    const exists = await this.repository.findOne({
      ...options,
      where: { ...(options?.where ?? {}) },
    });
    if (!exists) {
      this.logger.notFound(this.Entity, 'id', options?.where?.['id']);
      throw new EntityNotFoundException(this.Entity, options?.where?.['id']);
    }
    return exists;
  }

  protected generateSlug(title: string): string {
    return SlugEncoderUtil.generateSlug(title);
  }

  protected generateId(): string {
    return uuidv4();
  }

  /**
   * COMMON DELETE OPERATIONS
   **/

  async softDelete(id: string): Promise<IApiResponse> {
    const start = this.logger.startTiming();
    this.logger.step(1, `Validating ${this.Entity} exists`, { id });
    try {
      const exists = await this.repository.exists({
        where: { id, is_deleted: false },
      } as FindManyOptions<Entity>);
      if (!exists) {
        this.logger.notFound(this.Entity, 'id', id);
        throw new EntityNotFoundException(this.Entity, id);
      }

      this.logger.step(2, 'Calling repository.softDelete');
      await this.repository.softDelete(id);
      this.logger.operation('DELETE', this.Entity, { id });

      const duration = this.logger.endTiming(
        start,
        `${this.Entity} soft delete complete`,
      );
      this.logger.performance(`${this.Entity} softDelete`, duration);
      return ResponseUtil.noContent(`${this.Entity} deleted successfully`);
    } catch (error) {
      this.logger.error(`Failed to soft delete ${this.Entity}`, error as Error);
      throw new InternalServerException(
        `Failed to soft delete ${this.Entity}`,
        error as Error,
        `${this.Entity}Service.softDelete`,
      );
    }
  }

  async hardDelete(id: string): Promise<IApiResponse> {
    const start = this.logger.startTiming();
    this.logger.step(1, `Validating ${this.Entity} exists`, { id });
    try {
      const exists = await this.repository.exists({
        where: { id, is_deleted: false },
      } as FindManyOptions<Entity>);
      if (!exists) {
        this.logger.notFound(this.Entity, 'id', id);
        throw new EntityNotFoundException(this.Entity, id);
      }

      this.logger.step(2, 'Calling repository.hardDelete');
      await this.hardDelete(id);

      this.logger.operation('DELETE', this.Entity, { id });
      const duration = this.logger.endTiming(
        start,
        `${this.Entity} hard delete complete`,
      );

      this.logger.performance(`${this.Entity} hardDelete`, duration);
      return ResponseUtil.noContent(`${this.Entity} permanently deleted`);
    } catch (error) {
      throw new InternalServerException(
        `Failed to hard delete ${this.Entity}`,
        error as Error,
        `${this.Entity}Service.hardDelete`,
      );
    }
  }

  async restore(id: string): Promise<IApiResponse> {
    const start = this.logger.startTiming();
    this.logger.step(1, `Restore ${this.Entity}`, { id });
    try {
      this.logger.step(2, `Validating ${this.Entity} exists`, id);
      const exists = await this.repository.exists({
        where: { id, is_deleted: true },
      } as FindManyOptions<Entity>);
      if (!exists) {
        this.logger.notFound(this.Entity, 'id', id);
        throw new EntityNotFoundException(this.Entity, id);
      }

      this.logger.step(3, 'Calling repository.restore');
      await this.repository.restore(id);

      this.logger.operation('RESTORE', this.Entity, { id });

      const duration = this.logger.endTiming(
        start,
        `${this.Entity} restore complete`,
      );
      this.logger.performance(`${this.Entity} restore`, duration);

      return ResponseUtil.noContent(`${this.Entity} restored successfully`);
    } catch (error) {
      this.logger.error(`Failed to restore ${this.Entity}`, error as Error);
      throw new InternalServerException(
        `Failed to restore ${this.Entity}`,
        error as Error,
        `${this.Entity}Service.restore`,
      );
    }
  }
}
export { BaseService };
