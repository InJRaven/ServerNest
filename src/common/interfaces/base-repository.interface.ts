import { FindOptionsWhere, FindManyOptions, DeepPartial } from 'typeorm';

interface IBaseRepository<Entity> {
  /* ---------------------------------------------------------
   * CREATE / UPDATE
   * --------------------------------------------------------- */
  create(data: DeepPartial<Entity>): Promise<Entity>;
  createMany(data: DeepPartial<Entity>[]): Promise<Entity[]>;

  update(id: string, data: DeepPartial<Entity>): Promise<Entity>;
  updateMany(
    where: FindOptionsWhere<Entity>,
    data: DeepPartial<Entity>,
  ): Promise<number>;

  /* ---------------------------------------------------------
   * SOFT/HARD DELETE - RESTORE
   * --------------------------------------------------------- */
  hardDelete(id: string): Promise<boolean>;
  softDelete(id: string): Promise<boolean>;
  deleteMany(where: FindOptionsWhere<Entity>): Promise<number>;
  restore(id: string): Promise<boolean>;

  /* ---------------------------------------------------------
   * FIND
   * --------------------------------------------------------- */
  findById(id: string): Promise<Entity | null>;
  findOne(where: FindOptionsWhere<Entity>): Promise<Entity | null>;
  findAll(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  findByIds(ids: string[]): Promise<Entity[]>;

  findByIdWithDeleted(id: string): Promise<Entity | null>;
  findOneWithDeleted(where: FindOptionsWhere<Entity>): Promise<Entity | null>;
  findAllWithDeleted(options?: FindManyOptions<Entity>): Promise<Entity[]>;
  findByIdsWithDeleted(ids: string[]): Promise<Entity[]>;

  count(where?: FindOptionsWhere<Entity>): Promise<number>;
  /* ---------------------------------------------------------
   * EXISTENCE CHECK
   * --------------------------------------------------------- */
  exists(where: FindOptionsWhere<Entity>): Promise<boolean>;
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
export { IBaseRepository, IPagination };
