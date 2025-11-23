import { IBaseRepository } from '@interfaces';
import { SlugEncoderUtil } from '@utils';
import {
  Repository,
  FindOptionsWhere,
  FindManyOptions,
  DeepPartial,
  In,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

abstract class BaseRepository<
  Entity extends { id: string; is_deleted?: boolean },
> implements IBaseRepository<Entity>
{
  constructor(protected repository: Repository<Entity>) {}

  /**
   * Generate slug if entity has title or name field and no slug yet
   * Uses SlugEncoderUtil to create readable + encoded ID slug
   *
   * @private
   */
  private generateSlug(entity: any): void {
    if ('slug' in entity && !entity.slug) {
      const textField = entity.title || entity.name;

      if (textField && entity.id) {
        entity.slug = SlugEncoderUtil.generateSlug(textField, entity.id);
      }
    }
  }

  /**
   * Regenerate slug if title or name was updated
   * Uses SlugEncoderUtil to create new slug from updated text
   *
   * @private
   */
  private updateSlug(entity: any, updateData: DeepPartial<Entity>): void {
    // Check if entity has slug field
    if ('slug' in entity) {
      // Check if title or name was updated
      const titleUpdated = 'title' in updateData && updateData.title;
      const nameUpdated = 'name' in updateData && updateData.name;

      if (titleUpdated || nameUpdated) {
        const textField = entity.title || entity.name;

        if (textField && entity.id) {
          entity.slug = SlugEncoderUtil.generateSlug(textField, entity.id);
        }
      }
    }
  }
  async create(data: DeepPartial<Entity>): Promise<Entity> {
    if (!data.id) {
      data.id = uuidv4();
    }
    const entity = this.repository.create(data);
    this.generateSlug(entity);
    return await this.repository.save(entity);
  }

  async createMany(data: DeepPartial<Entity>[]): Promise<Entity[]> {
    const dataWithIds = data.map((item) => ({
      ...item,
      id: item.id || uuidv4(),
    }));

    const entities = this.repository.create(dataWithIds);

    entities.forEach((entity) => this.generateSlug(entity));
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

  async findBySlug(slug: string): Promise<Entity | null> {
    const id = SlugEncoderUtil.extractId(slug);

    if (id) {
      return await this.findById(id);
    }
    return await this.repository.findOne({
      where: { slug, is_deleted: false } as unknown as FindOptionsWhere<Entity>,
    });
  }
  /* ---------------------------------------------------------
   * FIND METHOD
   * --------------------------------------------------------- */
  async findByIdWithDeleted(id: string): Promise<Entity | null> {
    return await this.repository.findOne({
      where: { id } as FindOptionsWhere<Entity>,
      withDeleted: true,
    });
  }

  async findBySlugWithDeleted(slug: string): Promise<Entity | null> {
    const id = SlugEncoderUtil.extractId(slug);
    if (id) {
      return await this.findById(id);
    }
    return await this.repository.findOne({
      where: { slug } as unknown as FindOptionsWhere<Entity>,
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
    const entity = await this.findById(id);

    if (!entity) {
      throw new Error(`Entity with id ${id} not found`);
    }

    Object.assign(entity, data);

    this.updateSlug(entity, data);
    return await this.repository.save(entity);
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
        [field]: value,
        is_deleted: false,
      } as unknown as FindOptionsWhere<Entity>,
    });
  }

  async findRecent(
    limit: number = 10,
    sortField: keyof Entity = 'createdAt' as keyof Entity,
  ): Promise<Entity[]> {
    return await this.repository.find({
      where: { is_deleted: false } as unknown as FindOptionsWhere<Entity>,
      order: { [sortField]: 'DESC' } as any,
      take: limit,
    });
  }

  async findPopular(
    limit: number = 10,
    popularityField: keyof Entity = 'popularity' as keyof Entity,
  ): Promise<Entity[]> {
    return await this.repository.find({
      where: { is_deleted: false } as unknown as FindOptionsWhere<Entity>,
      order: { [popularityField]: 'DESC' } as any,
      take: limit,
    });
  }
}
export { BaseRepository };
