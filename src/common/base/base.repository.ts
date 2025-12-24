import { IBaseRepository, IPagination } from './base-repository.interface';
import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  In,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

abstract class BaseRepository<Entity extends { id: string }>
  implements IBaseRepository<Entity>
{
  constructor(protected repository: Repository<Entity>) {}
  async create(data: DeepPartial<Entity>): Promise<Entity> {
    return await this.repository.save(data);
  }

  async createMany(data: DeepPartial<Entity>[]): Promise<Entity[]> {
    const dataWithIds = data.map((item) => ({
      ...item,
      id: item.id || uuidv4(),
    }));

    const entities = this.repository.create(dataWithIds);
    return await this.repository.save(entities);
  }

  /* ---------------------------------------------------------
   * FIND METHOD
   * --------------------------------------------------------- */

  async findOne(options?: FindManyOptions<Entity>): Promise<Entity | null> {
    return await this.repository.findOne({
      ...options,
      where: options?.where ?? {},
    });
  }
  async findByIds(ids: string[]): Promise<Entity[]> {
    return await this.repository.find({
      where: {
        id: In(ids),
      } as FindOptionsWhere<Entity>,
    });
  }
  async findAllPagination(
    limit: number = 10,
    offset: number = 0,
    options?: FindManyOptions<Entity>,
  ): Promise<IPagination<Entity>> {
    const total = await this.count({ where: { ...(options?.where ?? {}) } });
    const data = await this.repository.find({
      ...options,
      where: {
        ...(options?.where ?? {}),
      },
      take: limit,
      skip: offset,
    });

    const totalPages = Math.ceil(total / limit);
    const page = Math.floor(offset / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: offset + limit < total,
        hasPreviousPage: page > 0,
      },
    };
  }
  async findAll(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return await this.repository.find(options);
  }

  async getTopEntity(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return await this.repository.find(options);
  }
  /* ---------------------------------------------------------
   * ADMIN METHOD
   * --------------------------------------------------------- */
  async update(data: DeepPartial<Entity>): Promise<Entity> {
    return await this.repository.save(data);
  }

  async save(data: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(data);
  }

  async mergeAndSave(
    entity: Entity,
    data: DeepPartial<Entity>,
  ): Promise<Entity> {
    const merged = this.repository.merge(entity, data);
    return this.repository.save(merged);
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

  async count(options?: FindManyOptions<Entity>): Promise<number> {
    return await this.repository.count({
      where: { ...(options?.where ?? {}) },
    });
  }

  async exists(options?: FindManyOptions<Entity>): Promise<boolean> {
    const count = await this.repository.count(options);
    return count > 0;
  }

  /* ---------------------------------------------------------
   * UTILITY OPERATIONS
   * --------------------------------------------------------- */
  async increment(
    id: string,
    field: keyof Entity,
    value: number = 1,
  ): Promise<void> {
    await this.repository.increment({ id } as any, field as string, value);
  }

  async decrement(
    id: string,
    field: keyof Entity,
    value: number = 1,
  ): Promise<void> {
    await this.repository.decrement({ id } as any, field as string, value);
  }

  async updateField(
    id: string,
    field: keyof Entity,
    value: any,
  ): Promise<void> {
    await this.repository.update(id, { [field]: value } as any);
  }

  /* ---------------------------------------------------------
   * QUERY OPERATIONS
   * --------------------------------------------------------- */

  async findByField(field: keyof Entity, value: any): Promise<Entity | null> {
    return await this.repository.findOne({
      where: {
        [field]: value,
        is_deleted: false,
      } as unknown as FindOptionsWhere<Entity>,
    });
  }

  async findAllByField(
    field: keyof Entity,
    value: any,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find({
      ...options,
      where: {
        // [field]: value,
        // is_deleted: false,
        ...(options?.where ?? {}),
      },
    });
  }

  async findRecent(
    limit: number = 10,
    // sortField: keyof Entity = 'createdAt' as keyof Entity,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find({
      ...options,
      where: {
        ...(options?.where ?? {}),
      } as unknown as FindOptionsWhere<Entity>,
      // order: { [sortField]: 'DESC' } as any,
      take: limit,
    });
  }

  async findPopular(
    limit: number = 10,
    // popularityField: keyof Entity = 'popularity' as keyof Entity,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find({
      ...options,
      where: {
        ...(options?.where ?? {}),
      },
      // order: { [popularityField]: 'DESC' } as any,
      take: limit,
    });
  }
}
export { BaseRepository };
