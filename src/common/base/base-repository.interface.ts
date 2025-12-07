import { FindOptionsWhere, FindManyOptions, DeepPartial } from 'typeorm';

interface IBaseRepository<Entity> {
  /* ---------------------------------------------------------
   * CREATE / UPDATE
   * --------------------------------------------------------- */
  create(data: DeepPartial<Entity>): Promise<Entity>;
  createMany(data: DeepPartial<Entity>[]): Promise<Entity[]>;

  update(data: DeepPartial<Entity>): Promise<Entity>;
  updateMany(
    where: FindOptionsWhere<Entity>,
    data: DeepPartial<Entity>,
  ): Promise<number>;

  /* ---------------------------------------------------------
   * SOFT/HARD DELETE - RESTORE
   * --------------------------------------------------------- */
  hardDelete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  deleteMany(options: FindOptionsWhere<Entity>): Promise<number>;
  restore(id: string): Promise<boolean>;

  /* ---------------------------------------------------------
   * FIND OPERATIONS
   * --------------------------------------------------------- */
  findOne(options?: FindManyOptions<Entity>): Promise<Entity | null>;
  findAll(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  findAllPagination(
    limit: number,
    offset: number,
    options?: FindManyOptions<Entity>,
  ): Promise<IPagination<Entity>>;
  findByIds(
    ids: string[],
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]>;

  count(options?: FindManyOptions<Entity>): Promise<number>;
  /* ---------------------------------------------------------
   * EXISTENCE CHECK
   * --------------------------------------------------------- */
  exists(options?: FindManyOptions<Entity>): Promise<boolean>;

  /* ---------------------------------------------------------
   * UTILITY OPERATIONS
   * --------------------------------------------------------- */
  increment(id: string, field: keyof Entity, value?: number): Promise<void>;
  decrement(id: string, field: keyof Entity, value?: number): Promise<void>;
  updateField(id: string, field: keyof Entity, value: any): Promise<void>;

  /* ---------------------------------------------------------
   * QUERY OPERATIONS
   * --------------------------------------------------------- */
  findByField(field: keyof Entity, value: any): Promise<Entity | null>;
  findAllByField(
    field: keyof Entity,
    value: any,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]>;
  findRecent(
    limit?: number,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]>;
  findPopular(
    limit?: number,
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]>;
}

interface ISearchOptions<Entity> {
  where?: FindOptionsWhere<Entity> | FindOptionsWhere<Entity>[];
  search?: string;
  searchFields?: (keyof Entity)[];
  page?: number;
  limit?: number;
  sortBy?: keyof Entity;
  sortOrder?: 'ASC' | 'DESC';
  relations?: string[];
}

interface IPagination<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
export { IBaseRepository, ISearchOptions, IPagination };
