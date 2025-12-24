import { Injectable } from '@nestjs/common';
import { GenresRepository } from '@repositories';
import { GenresDTO } from '@DTO';
import { GenreMapper } from '@core/mapper';
import { ResponseUtil, StringUtil } from '@utils';
import { IApiResponse } from '@interfaces';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  InternalServerException,
  InvalidOperationException,
} from '@exceptions';
import { FindManyOptions } from 'typeorm';
import { GenresEntity } from '@entities';
import { BaseService } from '@base';

// interface ICreateResult {
//   success: number;
//   failed: number;
//   createGenres?: GenreResponseDTO[];
//   updateGenres?: GenreResponseDTO[];
//   failedGenres?: Array<{
//     title?: string;
//     reason: string;
//   }>;
//   failedUpdateGenres?: Array<{
//     id: string;
//     reason: string;
//   }>;
// }
@Injectable()
class GenresService extends BaseService<GenresEntity> {
  constructor(
    protected readonly repository: GenresRepository,
    protected readonly mapper: GenreMapper,
  ) {
    super(repository, mapper, 'Genres');
  }

  async createGenre(data: GenresDTO): Promise<IApiResponse> {
    try {
      const startTime = this.logger.startTiming();
      this.logger.step(1, 'Validata Title Exist', data.title);

      const exists = await this.repository.findOne({
        where: { title: data.title },
      });
      if (exists) {
        this.logger.duplicateError('Genres', 'title', data.title);
        throw new EntityAlreadyExistsException(
          'Genres',
          'title',
          data.title,
          'TITLE_ALREADY_EXISTS',
        );
      }

      this.logger.step(2, 'Create id and slug');
      const id = this.generateId();
      const slug = StringUtil.slugify(data.title);

      this.logger.step(3, 'Create genre');
      const genre = await this.repository.create({ id, slug, ...data });

      this.logger.step(4, 'Mapping data to DTO');
      const mapData = this.mapper.toResponseDTO(genre);

      const duration = this.logger.endTiming(
        startTime,
        'create genre completed',
      );
      this.logger.performance('createGenre', duration);
      return ResponseUtil.created('Genre created successfully', {
        genre: mapData,
      });
    } catch (error) {
      this.logger.error('Failed to create genres batch', error as Error);
      if (
        error instanceof InvalidOperationException ||
        error instanceof EntityAlreadyExistsException
      ) {
        throw error;
      }

      throw new InternalServerException(
        'Failed to create genres batch',
        error as Error,
        'GenresService.createGenre',
      );
    }
  }

  async updateGenre(
    id: string,
    data: GenresDTO,
    options?: FindManyOptions<GenresEntity>,
  ): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    this.logger.step(1, 'BEGIN: Update Genre', { id });
    try {
      this.logger.step(2, 'Validating genre exists', { id });
      const exists = await this.checkExistsWithID({
        where: { id, ...(options?.where ?? {}) },
      });

      if (!exists) {
        this.logger.notFound('Genres', 'id', id);
        throw new EntityNotFoundException('Genre', id, 'NOT_FOUND');
      }
      const isTitleChanged = exists.title !== data.title;
      this.logger.step(
        3,
        isTitleChanged
          ? 'Title changed → regenerating slug'
          : 'Title unchanged → keeping existing slug',
        { id },
      );
      const payload = isTitleChanged
        ? { ...data, slug: StringUtil.slugify(data.title) }
        : data;

      this.logger.step(4, 'Merge and Save genre', { id });
      const updatedGenre = await this.repository.mergeAndSave(exists, payload);

      this.logger.operation('UPDATE', 'Genres', { id });
      const mapData = this.mapper.toResponseDTO(updatedGenre);

      const duration = this.logger.endTiming(startTime, 'update completed');
      this.logger.performance('updateGenre', duration);

      return ResponseUtil.success('Genre updated successfully', mapData);
    } catch (error) {
      this.logger.error('Failed to update genre', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to update genre',
        error as Error,
        'GenresService.updateGenre',
      );
    }
  }

  async getGenreById(
    id: string,
    options: FindManyOptions<GenresEntity>,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Finding Genre By Id', { id });
      const genre = await this.checkExistsWithID({
        ...options,
        where: { id, ...(options?.where ?? {}) },
      });

      if (!genre) {
        this.logger.notFound('Genres', 'id', id);
        throw new EntityNotFoundException('Genres', id);
      }

      this.logger.operation('READ', 'Genres', { id });
      const res = this.mapper.toResponseDTO(genre);
      return ResponseUtil.success('Genre Found', res);
    } catch (error) {
      this.logger.error('Failed to get genre by ID', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to get genre',
        error as Error,
        'GenresService.getGenreById',
      );
    }
  }

  async getGenreBySlug(
    slug: string,
    options: FindManyOptions<GenresEntity>,
  ): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    try {
      this.logger.step(1, 'Finding Genre By Slug', { slug });
      const genre = await this.repository.findOne({
        ...options,
        where: { slug, ...(options?.where ?? {}) },
      });
      if (!genre) {
        this.logger.notFound('Genres', 'slug', slug);
        throw new EntityNotFoundException('Genres', slug);
      }

      this.logger.step(2, 'Map data to DTO');
      const mapData = this.mapper.toResponseDTO(genre);

      const duration = this.logger.endTiming(startTime, 'Get Genre completed');
      this.logger.performance('getGenreBySlug', duration);
      this.logger.operation('READ', 'Genres', { slug });
      return ResponseUtil.success('Genre Found', mapData);
    } catch (error) {
      this.logger.error('Failed to get genre by ID', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to get genre',
        error as Error,
        'GenresService.getGenreById',
      );
    }
  }

  async getTopGenres(
    limit: number = 10,
    options?: FindManyOptions<GenresEntity>,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Fetching Top Genres', { limit });
      const genres = await this.repository.getTopEntity({
        ...options,
        where: {
          is_deleted: false,
          is_active: true,
          ...(options?.where ?? {}),
        },
        order: { popularity: 'DESC', track_count: 'DESC' },
        take: limit,
      });

      this.logger.operation('READ', 'Genres', {
        type: 'top',
        count: genres.length,
      });
      const res = this.mapper.toListResponseDTOList(genres);
      return ResponseUtil.success(`Found ${genres.length} top genres`, res);
    } catch (error) {
      this.logger.error('Failed to get top genres', error as Error);
      throw new InternalServerException(
        'Failed to get top genres',
        error as Error,
        'GenresService.getTopGenres',
      );
    }
  }

  async getActiveGenres(): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Fetching Active Genres');
      const genres = await this.repository.getTopEntity({
        where: {
          is_deleted: false,
          is_active: true,
        },
        order: { title: 'ASC' },
      });
      this.logger.operation('READ', 'Genres', {
        type: 'active',
        count: genres.length,
      });
      const res = this.mapper.toListResponseDTOList(genres);

      return ResponseUtil.success(`Found ${genres.length} active genres`, res);
    } catch (error) {
      this.logger.error('Failed to get active genres', error as Error);
      throw new InternalServerException(
        'Failed to get active genres',
        error as Error,
        'GenresService.getActiveGenres',
      );
    }
  }
  async getAllGenres(
    options?: FindManyOptions<GenresEntity>,
  ): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    try {
      this.logger.step(1, 'Start retrieving genre list');
      const genres = await this.repository.findAll(options);

      this.logger.step(2, 'Genre records retrieved from database', {
        totalRecords: genres.length,
      });

      const mappedGenres = this.mapper.toListResponseDTOList(genres);
      this.logger.transform(
        'GenresEntity[]',
        'GenreListResponseDTO[]',
        genres.length,
      );

      this.logger.operation(
        'READ',
        'Genres',
        { totalRecords: genres.length },
        this.logger.endTiming(startTime, 'Retrieve genre list completed'),
      );
      return ResponseUtil.success('Get Success', {
        genres: mappedGenres,
      });
    } catch (error) {
      this.logger.error('Error fetching all genres', error as Error);
      if (error instanceof EntityNotFoundException) throw error;
      throw new InternalServerException(
        'Failed to fetch all genres',
        error as Error,
        'GenresService.getAllGenres',
      );
    }
  }

  async updatePopularity(
    id: string,
    popularity: number,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Validating genre exists', { id });

      const exists = await this.checkExistsWithID({
        where: { id, is_deleted: false },
      });
      if (!exists) {
        this.logger.notFound('Genres', 'id', id);
        throw new EntityNotFoundException('Genres', id);
      }

      if (popularity < 0 || popularity > 100) {
        this.logger.validationError(
          'popularity',
          'Must be between 0 and 100',
          popularity,
        );
        throw new Error('Popularity must be between 0 and 100');
      }

      this.logger.step(2, 'Updating popularity', { id, popularity });
      await this.repository.updatePopularity(id, popularity);

      this.logger.operation('UPDATE', 'Genres', { id, popularity });

      return ResponseUtil.noContent('Popularity updated');
    } catch (error) {
      this.logger.error('Failed to update popularity', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to update popularity',
        error as Error,
        'GenresService.updatePopularity',
      );
    }
  }

  async incrementTrackCount(
    id: string,
    count: number = 1,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Validating genre exists', { id });

      const exists = await this.checkExistsWithID({
        where: { id, is_deleted: false },
      });
      if (!exists) {
        this.logger.notFound('Genre', 'id', id);
        throw new EntityNotFoundException('Genre', id);
      }

      this.logger.step(2, 'Incrementing track count', { id, count });
      await this.repository.incrementTrackCount(id, count);

      this.logger.operation('UPDATE', 'Genres_track_count', { id, count });

      return ResponseUtil.noContent('Track count incremented');
    } catch (error) {
      this.logger.error('Failed to increment track count', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to increment track count',
        error as Error,
        'GenresService.incrementTrackCount',
      );
    }
  }

  async incrementAlbumCount(
    id: string,
    count: number = 1,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Validating genre exists', { id });

      const exists = await this.repository.exists({
        where: { id, is_deleted: false },
      });
      if (!exists) {
        this.logger.notFound('Genre', 'id', id);
        throw new EntityNotFoundException('Genre', id);
      }

      this.logger.step(2, 'Incrementing album count', { id, count });
      await this.repository.incrementAlbumCount(id, count);

      this.logger.operation('UPDATE', 'Genres_album_count', { id, count });

      return ResponseUtil.noContent('Album count incremented');
    } catch (error) {
      this.logger.error('Failed to increment album count', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to increment album count',
        error as Error,
        'GenresService.incrementAlbumCount',
      );
    }
  }

  // async updateGenres(
  //   updates: Array<{ id: string; data: GenresDTO }>,
  // ): Promise<IApiResponse> {
  //   try {
  //     this.logger.step(1, 'Validating batch update input', {
  //       count: updates?.length || 0,
  //     });

  //     if (!updates || updates.length === 0) {
  //       this.logger.validationError('updates', 'No genres to update');
  //       throw new InvalidOperationException(
  //         'No genres to update',
  //         'GenresService.updateGenres',
  //       );
  //     }
  //     this.logger.step(2, `Processing ${updates.length} genre(s) update`);

  //     const result: ICreateResult = {
  //       success: 0,
  //       failed: 0,
  //       updateGenres: [],
  //       failedUpdateGenres: [],
  //     };
  //     for (const { id, data } of updates) {
  //       try {
  //         const existing = await this.repository.findOne({ where: { id } });
  //         if (!existing) {
  //           result.failed++;
  //           result.failedUpdateGenres?.push({
  //             id,
  //             reason: 'Genre not found',
  //           });
  //           this.logger.notFound('Genres', 'id', id);
  //           continue;
  //         }

  //         const updated = await this.repository.update(data);
  //         result.success++;
  //         result.updateGenres?.push(this.mapper.toResponseDTO(updated));
  //         this.logger.operation('UPDATE', 'Genres', { id });
  //       } catch (error) {
  //         result.failed++;
  //         const errorMessage =
  //           error instanceof Error ? error.message : 'Unknown error';

  //         result.failedUpdateGenres?.push({
  //           id,
  //           reason: errorMessage,
  //         });
  //         this.logger.error(`Failed to update genre '${id}'`, error as Error);
  //       }
  //     }
  //     const message =
  //       result.failed === 0
  //         ? `✅ Successfully updated all ${result.success} genre(s)`
  //         : result.success === 0
  //           ? `❌ Failed to update all ${result.failed} genre(s)`
  //           : `⚠️  Updated ${result.success}/${updates.length} genre(s) successfully. ${result.failed} failed. See details for reasons.`;

  //     this.logger.operation('UPDATE', 'Genres', {
  //       success: result.success,
  //       failed: result.failed,
  //       total: updates.length,
  //     });

  //     return ResponseUtil.success(message, result);
  //   } catch (error) {
  //     this.logger.error('Failed to update genres batch', error as Error);

  //     if (error instanceof InvalidOperationException) {
  //       throw error;
  //     }

  //     throw new InternalServerException(
  //       'Failed to update genres batch',
  //       error as Error,
  //       'GenresService.updateGenres',
  //     );
  //   }
  // }
}

export { GenresService };
