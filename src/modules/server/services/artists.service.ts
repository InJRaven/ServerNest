import { Injectable } from '@nestjs/common';
import { ArtistsRepository } from '@repositories';
import { ArtistsDTO } from '@DTO';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  InvalidOperationException,
} from '@exceptions';
import { ResponseUtil, StringUtil } from '@utils';
import { ArtistMapper } from '@modules/server/mapper';
import { IApiResponse } from '@interfaces';

@Injectable()
class ArtistsService {
  constructor(
    private readonly repository: ArtistsRepository,
    private readonly mapper: ArtistMapper,
  ) {}

  async createArtist(data: ArtistsDTO): Promise<IApiResponse> {
    if (!data.title) {
      throw new InvalidOperationException('Name is required');
    }

    const titleExists = await this.repository.findArtistByTitle(data.title);
    if (titleExists) {
      throw new EntityAlreadyExistsException('Artist', 'title', data.title);
    }

    const convertNameToSlug = StringUtil.slugify(data.title);

    const newArtist = await this.repository.createArtist({
      ...data,
      slug: convertNameToSlug,
    });

    return ResponseUtil.created('Artist created successfully', {
      artistId: newArtist.id,
    });
  }

  async updateArtist(id: string, data: ArtistsDTO): Promise<IApiResponse> {
    const artist = await this.repository.findArtistById(id);

    if (!artist) {
      throw new EntityNotFoundException('Artist', id);
    }

    if (data.title && data.title !== artist.title) {
      const nameExists = await this.repository.findArtistByTitle(data.title);
      if (nameExists)
        throw new EntityAlreadyExistsException('Artist', 'name', data.title);
    }
    const updated = { slug: StringUtil.slugify(data.title), ...data };
    const updatedArtist = await this.repository.updateArtist(id, updated);

    return ResponseUtil.success('Artist updated successfully', updatedArtist);
  }

  /**
   * Soft delete artist
   */
  async softDeleteArtist(id: string): Promise<IApiResponse> {
    const artist = await this.repository.findArtistById(id);

    if (!artist) {
      throw new EntityNotFoundException('Artist', id);
    }

    await this.repository.softDeleteArtist(id);
    return ResponseUtil.noContent('Artist deleted successfully');
  }

  /**
   * Hard delete artist
   */

  async hardDeleteArtist(id: string): Promise<IApiResponse> {
    const artist = await this.repository.findArtistByIdIncludingDeleted(
      id,
      false,
    );
    if (!artist) {
      throw new EntityNotFoundException('Artist', id);
    }

    await this.repository.hardDeleteArtist(id);

    return ResponseUtil.noContent('Artist permanently deleted');
  }

  /**
   * Restore artist
   */
  async restoreArtist(id: string): Promise<IApiResponse> {
    const artist = await this.repository.findArtistByIdIncludingDeleted(
      id,
      false,
    );
    if (!artist) {
      throw new EntityNotFoundException('Artist', id);
    }
    if (!artist.is_deleted) {
      throw new InvalidOperationException('Artist is not deleted');
    }

    await this.repository.restoreArtist(id);
    const restoredArtist = await this.repository.findArtistById(id);

    return ResponseUtil.success('Artist restored successfully', restoredArtist);
  }

  /**
   * Get top artists
   */
  async getTopArtists(limit: number = 10): Promise<IApiResponse> {
    const artists = await this.repository.getTopArtists(limit);

    return ResponseUtil.success('Top artists retrieved successfully', artists);
  }

  /**
   * Get trending artists
   */
  async getTrendingArtists(limit: number = 10): Promise<IApiResponse> {
    const artists = await this.repository.getTrendingArtists(limit);

    return ResponseUtil.success(
      'Trending artists retrieved successfully',
      artists,
    );
  }
}

export { ArtistsService };
