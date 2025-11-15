import { IBaseRepository } from '@interfaces';
import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  In,
} from 'typeorm';

abstract class BaseRepository<
  Entity extends { id: string; is_deleted?: boolean },
> implements IBaseRepository<Entity>
{
  constructor(protected repository: Repository<Entity>) {}

  async create(data: DeepPartial<Entity>): Promise<Entity> {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async createMany(data: DeepPartial<Entity>[]): Promise<Entity[]> {
    const entities = this.repository.create(data);
    return await this.repository.save(entities);
  }

  async findById(id: string): Promise<Entity | null> {
    return await this.repository.findOne({
      where: { id, is_deleted: false } as FindOptionsWhere<Entity>,
    });
  }

  async findOne(where: FindOptionsWhere<Entity>): Promise<Entity | null> {
    return await this.repository.findOne({
      where: { ...where, is_deleted: false } as FindOptionsWhere<Entity>,
    });
  }
  async findByIds(ids: string[]): Promise<Entity[]> {
    if (ids.length === 0) return [];

    return await this.repository.find({
      where: {
        id: In(ids),
        is_deleted: false,
      } as FindOptionsWhere<Entity>,
    });
  }
  async findAll(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return await this.repository.find({
      ...options,
      where: {
        ...options?.where,
        is_deleted: false,
      } as FindOptionsWhere<Entity>,
    });
  }

  /* ---------------------------------------------------------
   * ADMIN METHOD
   * --------------------------------------------------------- */
  async findByIdWithDeleted(id: string): Promise<Entity | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<Entity>,
      withDeleted: true,
    });
  }

  async findOneWithDeleted(
    where: FindOptionsWhere<Entity>,
  ): Promise<Entity | null> {
    return await this.repository.findOne({
      where,
      withDeleted: true,
    });
  }

  async findAllWithDeleted(
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find({
      ...options,
      withDeleted: true,
    });
  }

  async findByIdsWithDeleted(ids: string[]): Promise<Entity[]> {
    if (ids.length === 0) return [];

    return await this.repository.find({
      where: { id: In(ids) } as FindOptionsWhere<Entity>,
      withDeleted: true,
    });
  }

  /* ---------------------------------------------------------
   * ADMIN METHOD
   * --------------------------------------------------------- */

  async update(id: string, data: DeepPartial<Entity>): Promise<Entity> {
    await this.repository.update(id, data as any);
    const updated = await this.findById(id);
    if (!updated) {
      throw new Error('Entity not found after update');
    }
    return updated;
  }

  async updateMany(
    where: FindOptionsWhere<Entity>,
    data: DeepPartial<Entity>,
  ): Promise<number> {
    const result = await this.repository.update(where, data as any);
    return result.affected || 0;
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected || 0) > 0;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, {
      is_deleted: true,
    } as any);
    return (result.affected || 0) > 0;
  }

  async deleteMany(where: FindOptionsWhere<Entity>): Promise<number> {
    const result = await this.repository.delete(where);
    return result.affected || 0;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.repository.update(id, {
      is_deleted: false,
    } as any);
    return (result.affected || 0) > 0;
  }

  async count(where?: FindOptionsWhere<Entity>): Promise<number> {
    return await this.repository.count({
      where: { ...where, is_deleted: false } as FindOptionsWhere<Entity>,
    });
  }

  async exists(where: FindOptionsWhere<Entity>): Promise<boolean> {
    const count = await this.repository.count({
      where: { ...where, is_deleted: false } as FindOptionsWhere<Entity>,
    });
    return count > 0;
  }
}
export { BaseRepository };
