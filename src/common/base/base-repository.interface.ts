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
  path: string; // e.g. 'track.genres'
  alias: string; // e.g. 'genres'
}

interface ISearchableField {
  column: string; // e.g. 'track.title'
  joins?: IJoinDefinition[]; // required joins to access this field
}

interface ISearchQuery<Entity extends ObjectLiteral> {
  search?: string;
  searchFields?: (keyof Entity | string)[];
  filters?: Partial<Record<keyof Entity | string, any>>;
  sortBy?: keyof Entity | string;
  sortOrder?: 'ASC' | 'DESC';
  limit?: number;
  offset?: number;
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
 * INTERFACE BASE REPOSITORY
 * --------------------------------------------------------- */

interface IBaseRepository<Entity extends ObjectLiteral> {
  /* ---------------------------------------------------------
   * CREATE
   * --------------------------------------------------------- */
  create(data: DeepPartial<Entity>): Promise<Entity>;
  createMany(data: DeepPartial<Entity>[]): Promise<Entity[]>;

  /* ---------------------------------------------------------
   * UPDATE
   * --------------------------------------------------------- */
  save(data: DeepPartial<Entity>): Promise<Entity>;
  merge(entity: Entity, data: DeepPartial<Entity>): Promise<Entity>;
  updateField(id: string, field: keyof Entity, value: any): Promise<void>;
  increment(id: string, field: keyof Entity, value?: number): Promise<void>;
  decrement(id: string, field: keyof Entity, value?: number): Promise<void>;

  /* ---------------------------------------------------------
   * DELETE / RESTORE
   * --------------------------------------------------------- */
  hardDelete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  deleteMany(options: FindOptionsWhere<Entity>): Promise<number>;
  restore(id: string): Promise<boolean>;

  /* ---------------------------------------------------------
   * FIND
   * --------------------------------------------------------- */
  findOne(options?: FindManyOptions<Entity>): Promise<Entity | null>;
  findAll(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  findByIds(
    ids: string[],
    options?: FindManyOptions<Entity>,
  ): Promise<Entity[]>;
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
   * PAGINATION
   * --------------------------------------------------------- */
  findAllPagination(
    limit: number,
    offset: number,
    options?: FindManyOptions<Entity>,
  ): Promise<IPagination<Entity>>;
  count(options?: FindManyOptions<Entity>): Promise<number>;
  exists(options?: FindManyOptions<Entity>): Promise<boolean>;

  /* ---------------------------------------------------------
   * SEARCH HOOKS
   * --------------------------------------------------------- */
  applyJoins(qb: SelectQueryBuilder<Entity>): void;
  applyBaseConditions(qb: SelectQueryBuilder<Entity>): void;
  applyOrder(
    qb: SelectQueryBuilder<Entity>,
    sortBy?: string,
    sortOrder?: 'ASC' | 'DESC',
  ): void;
  getFindOptions(): FindManyOptions<Entity>;

  /* ---------------------------------------------------------
   * SEARCH
   * --------------------------------------------------------- */
  search(query: ISearchQuery<Entity>): Promise<IPagination<Entity>>;
}

export {
  IBaseRepository,
  IPagination,
  IJoinDefinition,
  ISearchQuery,
  ISearchableField,
};
