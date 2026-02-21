import {
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  SelectQueryBuilder,
  ObjectLiteral,
} from 'typeorm';

/* ---------------------------------------------------------
 * SUPPORTING TYPES
 * --------------------------------------------------------- */

interface IJoinDefinition {
  path: string;
  alias: string;
}

interface ISearchableField {
  column: string;
  joins?: IJoinDefinition[];
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

/* ---------------------------------------------------------
 * Interface BaseRepository
 * --------------------------------------------------------- */
interface IBaseRepository<Entity extends ObjectLiteral> {
  /* ---------------------------------------------------------
   * CREATE / UPDATE
   * --------------------------------------------------------- */
  create(data: DeepPartial<Entity>): Promise<Entity>;
  createMany(data: DeepPartial<Entity>[]): Promise<Entity[]>;

  save(data: DeepPartial<Entity>): Promise<Entity>;
  merge(entity: Entity, data: DeepPartial<Entity>): Promise<Entity>;
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

  /* ---------------------------------------------------------
   * SUPPORTING HOOKS
   * --------------------------------------------------------- */
  applyJoins(qb: SelectQueryBuilder<Entity>): void;
  applyBaseConditions(qb: SelectQueryBuilder<Entity>): void;
  applyOrder(qb: SelectQueryBuilder<Entity>): void;
  getFindOptions(): FindManyOptions<Entity>;

  /* ---------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------- */
  search(
    search?: string,
    limit?: number,
    offset?: number,
  ): Promise<IPagination<Entity>>;
}

export { IBaseRepository, IPagination, IJoinDefinition, ISearchableField };
