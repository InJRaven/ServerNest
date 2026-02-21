import {
  IBaseRepository,
  IPagination,
  ISearchableField,
} from './base-repository.interface';
import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  In,
  ObjectLiteral,
  SelectQueryBuilder,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

abstract class BaseRepository<Entity extends ObjectLiteral & { id: string }>
  implements IBaseRepository<Entity>
{
  constructor(protected repository: Repository<Entity>) {}

  /* ---------------------------------------------------------
   * PROTECTED
   * --------------------------------------------------------- */
  protected alias: string = '';
  protected searchableFields: ISearchableField[] = [];

  protected buildResult(
    data: Entity[],
    total: number,
    limit: number,
    offset: number,
  ): IPagination<Entity> {
    return {
      data,
      meta: {
        total,
        page: Math.floor(offset / limit) + 1,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNextPage: offset + limit < total,
        hasPreviousPage: offset > 0,
      },
    };
  }

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

    return this.buildResult(data, total, limit, offset);
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
  async save(data: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(data);
  }

  async merge(entity: Entity, data: DeepPartial<Entity>): Promise<Entity> {
    const merged = this.repository.merge(entity, data);
    return this.repository.save(merged);
  }

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected || 0) > 0;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, {
      isDeleted: true,
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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyJoins(_qb: SelectQueryBuilder<Entity>): void {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyBaseConditions(_qb: SelectQueryBuilder<Entity>): void {}

  applyOrder(qb: SelectQueryBuilder<Entity>): void {
    qb.orderBy(`${this.alias}.id`, 'ASC');
  }

  getFindOptions(): FindManyOptions<Entity> {
    return {};
  }

  async search(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<IPagination<Entity>> {
    limit = Math.min(Number(limit) || 10, 50);
    offset = Math.max(Number(offset) || 0, 0);

    const qb = this.repository.createQueryBuilder(this.alias);

    this.applyBaseConditions(qb);
    this.applyJoins(qb);

    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      const joined = new Set<string>();

      this.searchableFields.forEach((field) => {
        field.joins?.forEach((join) => {
          if (!joined.has(join.alias)) {
            qb.leftJoin(join.path, join.alias);
            joined.add(join.alias);
          }
        });
      });

      const conditions = this.searchableFields
        .map((f) => `${f.column} ILIKE :search`)
        .join(' OR ');

      qb.andWhere(`(${conditions})`, { search: `%${trimmedSearch}%` });
    }

    this.applyOrder(qb);

    // ===== Phase 1: total + ids =====
    const total = await qb.clone().getCount();

    const idRows = await qb
      .clone()
      .select(`${this.alias}.id`, 'id')
      .skip(offset)
      .take(limit)
      .getRawMany();

    const ids: any[] = idRows.map((row) => row.id);

    if (!ids.length) {
      return this.buildResult([], total, limit, offset);
    }

    // ===== Phase 2: full entity với relations =====
    const rawData = await this.repository.find({
      ...this.getFindOptions(),
      where: { id: In(ids) } as any,
    });

    const dataMap = new Map<any, Entity>(rawData.map((e) => [e.id, e]));
    const data = ids
      .map((id) => dataMap.get(id))
      .filter((e): e is Entity => !!e);

    return this.buildResult(data, total, limit, offset);
  }
}
export { BaseRepository };
