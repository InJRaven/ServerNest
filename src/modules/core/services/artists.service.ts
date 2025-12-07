import { Injectable } from '@nestjs/common';
import { FindManyOptions } from 'typeorm';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  InternalServerException,
  InvalidOperationException,
} from '@exceptions';
import { BaseService } from '@base';
import { ResponseUtil, StringUtil } from '@utils';
import { IApiResponse } from '@interfaces';
import { ArtistsRepository } from '@repositories';
import { ArtistsDTO } from '@DTO';
import { ArtistsEntity } from '@entities';
import { ArtistMapper } from '@core/mapper';
@Injectable()
class ArtistsService extends BaseService<ArtistsEntity> {
  constructor(
    protected readonly repository: ArtistsRepository,
    protected readonly mapper: ArtistMapper,
  ) {
    super(repository, mapper, 'Artists');
  }

  async createArtist(data: ArtistsDTO): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Validating artist data', { title: data.title });
      if (!data.title) {
        throw new InvalidOperationException('Artist title is required');
      }

      this.logger.step(2, 'Check artist exists', { title: data.title });
      const titleExists = await this.repository.findOne({
        where: { title: data.title },
      });
      if (titleExists) {
        throw new EntityAlreadyExistsException('Artist', 'title', data.title);
      }
      this.logger.step(3, 'Creating id and slug');
      const id = this.generateId();
      const slug = StringUtil.slugify(data.title);
      this.logger.step(4, 'Creating artist entity');
      const artist = await this.repository.create({
        id,
        slug,
        ...data,
      });

      this.logger.operation('CREATE', 'Artists', {
        id: artist.id,
        title: artist.title,
      });
      return ResponseUtil.created(
        'Artist created successfully',
        this.mapper.toResponseDTO(artist),
      );
    } catch (error) {
      this.logger.error('Failed to create artist', error as Error);
      if (error instanceof EntityAlreadyExistsException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to create artist',
        error as Error,
        'ArtistsService.createArtist',
      );
    }
  }

  async updateArtist(
    id: string,
    data: ArtistsDTO,
    options?: FindManyOptions<ArtistsEntity>,
  ): Promise<IApiResponse> {
    const startTime = this.logger.startTiming();
    this.logger.log('BEGIN: Update Artist', { id });
    try {
      this.logger.step(1, 'Validating artist exists', { id });
      const exists = await this.checkExistsWithID({
        where: { id, ...(options?.where ?? {}) },
      });

      const isTitleChanged = exists.title !== data.title;
      this.logger.step(
        2,
        isTitleChanged
          ? 'Title changed → regenerating slug'
          : 'Title unchanged → keeping existing slug',
        { id },
      );

      const payload = isTitleChanged
        ? { ...data, slug: StringUtil.slugify(data.title) }
        : data;

      this.logger.step(3, 'Updating artist', { id });
      const updatedArtist = await this.repository.update(payload);

      this.logger.operation('UPDATE', 'Artists', { id });
      const mapData = this.mapper.toResponseDTO(updatedArtist);

      const duration = this.logger.endTiming(startTime, 'update completed');
      this.logger.performance('updateArtist', duration);
      return ResponseUtil.success('Artist updated successfully', mapData);
    } catch (error) {
      this.logger.error('Failed to update artist', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to update artist',
        error as Error,
        'ArtistsService.updateArtist',
      );
    }
  }
  async getArtistById(
    id: string,
    options?: FindManyOptions<ArtistsEntity>,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Finding artist by ID', { id });
      const artist = await this.checkExistsWithID({
        ...options,
        where: { id, ...(options?.where ?? {}) },
      });

      this.logger.operation('READ', 'Artist', { id });
      const mapData = this.mapper.toResponseDTO(artist);
      return ResponseUtil.success('Artist Found', mapData);
    } catch (error) {
      this.logger.error('Failed to get artist by ID', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to get artist',
        error as Error,
        'ArtistsService.getArtistById',
      );
    }
  }

  async getArtistBySlug(
    slug: string,
    options?: FindManyOptions<ArtistsEntity>,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Finding artist by slug', { slug });
      const artist = await this.repository.findOne({
        ...options,
        where: { slug, ...(options?.where ?? {}) },
      });

      if (!artist) {
        this.logger.notFound('Artists', 'slug', slug);
        throw new EntityNotFoundException('Artists', slug);
      }

      this.logger.operation('READ', 'Artists', { slug });
      const res = this.mapper.toResponseDTO(artist);
      return ResponseUtil.success('Artist Found', res);
    } catch (error) {
      this.logger.error('Failed to get artist by slug', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to get artist',
        error as Error,
        'ArtistsService.getArtistBySlug',
      );
    }
  }

  async getTopArtists(
    limit: number = 10,
    options?: FindManyOptions<ArtistsEntity>,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Fetching top artists', { limit });
      const artists = await this.repository.getTopEntity({
        ...options,
        where: {
          is_deleted: false,
          status: 'active',
          ...(options?.where ?? {}),
        },
        order: { popularity: 'DESC', monthly_listeners: 'DESC' },
        take: limit,
      });

      this.logger.operation('READ', 'Artist', {
        type: 'top',
        count: artists.length,
      });
      const res = this.mapper.toListResponseDTOList(artists);
      return ResponseUtil.success(`Found ${artists.length} top artists`, res);
    } catch (error) {
      this.logger.error('Failed to get top artists', error as Error);
      throw new InternalServerException(
        'Failed to get top artists',
        error as Error,
        'ArtistsService.getTopArtists',
      );
    }
  }

  async getTrendingArtists(
    limit: number = 10,
    options?: FindManyOptions<ArtistsEntity>,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Fetch Trending Artists', { limit });
      const artists = await this.repository.getTopEntity({
        ...options,
        where: {
          is_deleted: false,
          status: 'active',
          ...(options?.where ?? {}),
        },
        order: {
          monthly_listeners: 'DESC', // ← Hot right now!
          followers: 'DESC',
          popularity: 'DESC',
        },
        take: limit,
      });

      this.logger.operation('READ', 'Artists', {
        type: 'trending',
        count: artists.length,
      });
      const res = this.mapper.toListResponseDTOList(artists);
      return ResponseUtil.success(
        'Trending artists retrieved successfully',
        res,
      );
    } catch (error) {
      this.logger.error('Failed to get trending artists', error as Error);
      throw new InternalServerException(
        'Failed to get trending artists',
        error as Error,
        'ArtistsService.getTrendingArtists',
      );
    }
  }

  async getAllArtists(
    limit: number = 10,
    offset: number = 0,
    options?: FindManyOptions<ArtistsEntity>,
  ): Promise<IApiResponse> {
    try {
      this.logger.log('Fetching All Artists');
      const result = await this.repository.findAllPagination(limit, offset, {
        ...options,
        order: { popularity: 'DESC' },
      });
      const data = this.mapper.toListResponseDTOList(result.data);
      const meta = result.meta;
      this.logger.log(
        `Retrieved ${result.data.length} artist(s) | Total: ${result.meta.total}`,
      );

      const response = ResponseUtil.success(
        `Retrieved ${result.data.length} artist(s) | Total: ${result.meta.total}`,
        data,
      );
      return {
        ...response,
        meta,
      };
    } catch (error) {
      this.logger.error('Error fetching all artists', error as Error);
      throw new InternalServerException(
        'Failed to get trending artists',
        error as Error,
        'ArtistsService.getAllArtist',
      );
    }
  }

  async getArtistByGenre(
    genre: string,
    limit: number = 10,
    offset: number = 0,
    options?: FindManyOptions<ArtistsEntity>,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Fetching artists by genre', { genre, limit });
      const result = await this.repository.findAllPagination(limit, offset, {
        ...options,
        where: { genres: genre },
        order: { popularity: 'DESC' },
      });
      const data = this.mapper.toListResponseDTOList(result.data);
      this.logger.operation('READ', 'Artists', {
        genre,
        count: result.data.length,
      });

      const response = ResponseUtil.success(
        `Retrieved ${result.data.length} artist(s)`,
        data,
      );
      return {
        ...response,
        meta: result.meta,
      };
    } catch (error) {
      this.logger.error('Error fetching all artists by genre', error as Error);
      throw new InternalServerException(
        'Failed to get trending artists',
        error as Error,
        'ArtistsService.getArtistByGenre',
      );
    }
  }

  async incrementMonthlyListeners(
    id: string,
    count: number = 1,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Validating artist exists', { id });
      const exists = await this.repository.exists({
        where: { id, is_deleted: false },
      });
      if (!exists) {
        this.logger.notFound('Artists', 'id', id);
        throw new EntityNotFoundException('Artist', id);
      }
      this.logger.step(2, 'Incrementing monthly listeners', { id, count });
      await this.repository.incrementMonthlyListeners(id, count);

      this.logger.operation('UPDATE', 'Artists_monthly_listeners', {
        id,
        count,
      });

      return ResponseUtil.noContent('Monthly listeners incremented');
    } catch (error) {
      this.logger.error(
        'Failed to increment monthly listeners',
        error as Error,
      );
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to increment monthly listeners',
        error as Error,
        'ArtistsService.incrementMonthlyListeners',
      );
    }
  }

  async incrementFollowers(
    id: string,
    count: number = 1,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Validating artist exists', { id });

      const exists = await this.repository.exists({
        where: { id, is_deleted: false },
      });
      if (!exists) {
        this.logger.notFound('Artist', 'id', id);
        throw new EntityNotFoundException('Artist', id);
      }

      this.logger.step(2, 'Incrementing followers', { id, count });
      await this.repository.incrementFollowers(id, count);

      this.logger.operation('UPDATE', 'Artists_followers', { id, count });

      return ResponseUtil.noContent('Followers incremented');
    } catch (error) {
      this.logger.error('Failed to increment followers', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to increment followers',
        error as Error,
        'ArtistsService.incrementFollowers',
      );
    }
  }

  async updatePopularity(
    id: string,
    popularity: number,
  ): Promise<IApiResponse> {
    try {
      this.logger.step(1, 'Validating artist exists', { id });

      const exists = await this.repository.exists({
        where: { id, is_deleted: false },
      });
      if (!exists) {
        this.logger.notFound('Artist', 'id', id);
        throw new EntityNotFoundException('Artist', id);
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

      this.logger.operation('UPDATE', 'Artist_popularity', { id, popularity });

      return ResponseUtil.noContent('Popularity updated');
    } catch (error) {
      this.logger.error('Failed to update popularity', error as Error);
      if (error instanceof EntityNotFoundException) {
        throw error;
      }
      throw new InternalServerException(
        'Failed to update popularity',
        error as Error,
        'ArtistsService.updatePopularity',
      );
    }
  }
}

export { ArtistsService };
