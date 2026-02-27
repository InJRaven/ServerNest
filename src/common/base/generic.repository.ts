import { IBaseRepository, IPagination } from '@base';
import {
  DeepPartial,
  FindManyOptions,
  ObjectLiteral,
  Repository,
} from 'typeorm';

export abstract class GenericRepository<Entity extends ObjectLiteral>
  implements
    Pick<
      IBaseRepository<Entity>,
      | 'create'
      | 'save'
      | 'merge'
      | 'findOne'
      | 'findAll'
      | 'findAllPagination'
      | 'count'
      | 'exists'
      | 'hardDelete'
      | 'softDelete'
    >
{
  constructor(protected readonly repository: Repository<Entity>) {}

  /* ---------------------------------------------------------
   * CREATE
   * --------------------------------------------------------- */
  async create(data: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(data);
  }

  async save(data: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(data);
  }

  async merge(entity: Entity, data: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(this.repository.merge(entity, data));
  }

  /* ---------------------------------------------------------
   * FIND
   * --------------------------------------------------------- */
  async findOne(options?: FindManyOptions<Entity>): Promise<Entity | null> {
    return await this.repository.findOne({
      ...options,
      where: options?.where ?? {},
    });
  }

  async findAll(options?: FindManyOptions<Entity>): Promise<Entity[]> {
    return this.repository.find(options);
  }

  async findAllPagination(
    limit = 10,
    offset = 0,
    options?: FindManyOptions<Entity>,
  ): Promise<IPagination<Entity>> {
    const [data, total] = await this.repository.findAndCount({
      ...options,
      take: limit,
      skip: offset,
    });

    const totalPages = Math.ceil(total / limit);
    const page = Math.floor(offset / limit) + 1;

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: offset + limit < total,
        hasPreviousPage: page > 1,
      },
    };
  }

  async count(options?: FindManyOptions<Entity>): Promise<number> {
    return this.repository.count(options);
  }

  async exists(options?: FindManyOptions<Entity>): Promise<boolean> {
    return (await this.count(options)) > 0;
  }

  /* ---------------------------------------------------------
   * DELETE (WHERE-BASED)
   * --------------------------------------------------------- */
  async hardDelete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected || 0) > 0;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, {
      isDeleted: true,
      deletedAt: new Date(),
    } as any);
    return (result.affected || 0) > 0;
  }
}
