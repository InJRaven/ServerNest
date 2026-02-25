import {
  IBaseRepository,
  IPagination,
  ISearchableField,
  ISearchQuery,
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
   * ABSTRACT — must be declared in subclass
   * --------------------------------------------------------- */
  protected abstract alias: string;
  protected abstract allowedColumns: string[];
  protected abstract searchableFields: ISearchableField[];

  /* ---------------------------------------------------------
   * PRIVATE UTILS
   * --------------------------------------------------------- */

  // Prevents SQL injection when using dynamic column names
  protected isSafeColumn(column: string): boolean {
    return this.allowedColumns.includes(column);
  }

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

  /* ---------------------------------------------------------
   * CREATE
   * --------------------------------------------------------- */

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
   * UPDATE
   * --------------------------------------------------------- */

  async save(data: DeepPartial<Entity>): Promise<Entity> {
    return this.repository.save(data);
  }

  async merge(entity: Entity, data: DeepPartial<Entity>): Promise<Entity> {
    const merged = this.repository.merge(entity, data);
    return this.repository.save(merged);
  }

  async updateField(
    id: string,
    field: keyof Entity,
    value: any,
  ): Promise<void> {
    await this.repository.update(id, { [field]: value } as any);
  }

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

  /* ---------------------------------------------------------
   * DELETE / RESTORE
   * --------------------------------------------------------- */

  async hardDelete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return (result.affected || 0) > 0;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.update(id, { isDeleted: true } as any);
    return (result.affected || 0) > 0;
  }

  async deleteMany(where: FindOptionsWhere<Entity>): Promise<number> {
    const result = await this.repository.delete(where);
    return result.affected || 0;
  }

  async restore(id: string): Promise<boolean> {
    const result = await this.repository.update(id, {
      isDeleted: false,
    } as any);
    return (result.affected || 0) > 0;
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
    return await this.repository.find(options);
  }

  async findByIds(
    ids: string[],
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find({
      ...options,
      where: { id: In(ids) } as FindOptionsWhere<Entity>,
    });
  }

  async findByField(field: keyof Entity, value: any): Promise<Entity | null> {
    return await this.repository.findOne({
      where: {
        [field]: value,
        isDeleted: false,
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
        [field]: value,
        ...(options?.where ?? {}),
      } as unknown as FindOptionsWhere<Entity>,
    });
  }

  // Sorted by createdAt DESC
  async findRecent(
    limit: number = 10,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find({
      ...options,
      where: { ...(options?.where ?? {}) } as FindOptionsWhere<Entity>,
      order: { createdAt: 'DESC' } as any,
      take: limit,
    });
  }

  // Sorted by popularity DESC
  async findPopular(
    limit: number = 10,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]> {
    return await this.repository.find({
      ...options,
      where: { ...(options?.where ?? {}) } as FindOptionsWhere<Entity>,
      order: { popularity: 'DESC' } as any,
      take: limit,
    });
  }

  /* ---------------------------------------------------------
   * PAGINATION
   * --------------------------------------------------------- */

  // Uses findAndCount to avoid running two separate queries
  async findAllPagination(
    limit: number = 10,
    offset: number = 0,
    options?: FindManyOptions<Entity>,
  ): Promise<IPagination<Entity>> {
    const [data, total] = await this.repository.findAndCount({
      ...options,
      where: { ...(options?.where ?? {}) },
      take: limit,
      skip: offset,
    });
    return this.buildResult(data, total, limit, offset);
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
   * SEARCH HOOKS — override in subclass if needed
   * --------------------------------------------------------- */

  // Add joins required for Phase 1 query (filter/sort by related entity)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyJoins(_qb: SelectQueryBuilder<Entity>): void {}

  // Add fixed WHERE conditions independent of search (e.g. soft-delete, status)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  applyBaseConditions(_qb: SelectQueryBuilder<Entity>): void {}

  // Default sort by id ASC. Override to sort by other fields.
  applyOrder(
    qb: SelectQueryBuilder<Entity>,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'ASC',
  ): void {
    if (sortBy && this.isSafeColumn(sortBy)) {
      qb.orderBy(`${this.alias}.${sortBy}`, sortOrder).addOrderBy(
        `${this.alias}.id`,
        'ASC',
      ); // tiebreaker for stable pagination
    } else {
      qb.orderBy(`${this.alias}.id`, 'ASC');
    }
  }

  // Return FindManyOptions for Phase 2 (relations, select fields, etc.)
  getFindOptions(): FindManyOptions<Entity> {
    return {};
  }

  /* ---------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------- */

  async search(query: ISearchQuery<Entity>): Promise<IPagination<Entity>> {
    const {
      search,
      searchFields,
      filters,
      sortBy,
      sortOrder = 'ASC',
      limit: rawLimit = 10,
      offset: rawOffset = 0,
    } = query;

    const limit = Math.min(Number(rawLimit) || 10, 50);
    const offset = Math.max(Number(rawOffset) || 0, 0);

    const qb = this.repository.createQueryBuilder(this.alias);

    this.applyBaseConditions(qb);
    this.applyJoins(qb);

    // -- keyword search --------------------------------------------------
    const trimmedSearch = search?.trim();
    if (trimmedSearch) {
      const joined = new Set<string>();

      // Use searchFields if provided, otherwise fall back to searchableFields
      const fields = searchFields?.length
        ? searchFields
            .filter((f) => this.isSafeColumn(String(f)))
            .map((f) => `${this.alias}.${String(f)}`)
        : this.searchableFields.map((f) => {
            f.joins?.forEach((join) => {
              if (!joined.has(join.alias)) {
                qb.leftJoin(join.path, join.alias);
                joined.add(join.alias);
              }
            });
            return f.column;
          });

      if (fields.length) {
        const conditions = fields
          .map((col) => `${col} ILIKE :search`)
          .join(' OR ');
        qb.andWhere(`(${conditions})`, { search: `%${trimmedSearch}%` });
      }
    }

    // -- dynamic filters -------------------------------------------------
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value === undefined || value === null) return;
        if (!this.isSafeColumn(key)) return; // skip unsafe columns
        qb.andWhere(`${this.alias}.${key} = :${key}`, { [key]: value });
      });
    }

    // -- sort ------------------------------------------------------------
    this.applyOrder(qb, sortBy as string, sortOrder);

    // Phase 1: run total count and id list in parallel
    const [total, idRows] = await Promise.all([
      qb.clone().getCount(),
      qb
        .clone()
        .select(`${this.alias}.id`, 'id')
        .skip(offset)
        .take(limit)
        .getRawMany(),
    ]);

    const ids: string[] = idRows.map((row) => row.id);

    if (!ids.length) {
      return this.buildResult([], total, limit, offset);
    }

    // Phase 2: load full entities with relations using ids from Phase 1
    const rawData = await this.repository.find({
      ...this.getFindOptions(),
      where: { id: In(ids) } as any,
    });

    // Preserve the sort order returned by Phase 1
    const dataMap = new Map<string, Entity>(rawData.map((e) => [e.id, e]));
    const data = ids
      .map((id) => dataMap.get(id))
      .filter((e): e is Entity => !!e);

    return this.buildResult(data, total, limit, offset);
  }
}

export { BaseRepository };
