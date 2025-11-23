import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ArtistsRepository } from '@repositories';
import { ArtistsDTO } from '@DTO';
import {
  EntityAlreadyExistsException,
  EntityNotFoundException,
  InvalidOperationException,
} from '@exceptions';
import { ResponseUtil } from '@utils';
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
      throw new InvalidOperationException('Artist title is required');
    }

    const titleExists = await this.repository.findByTitle(data.title);
    if (titleExists) {
      throw new EntityAlreadyExistsException('Artist', 'title', data.title);
    }

    const newArtist = await this.repository.create(data);

    return ResponseUtil.created(
      'Artist created successfully',
      this.mapper.toResponseDTO(newArtist),
    );
  }

  async updateArtist(id: string, data: ArtistsDTO): Promise<IApiResponse> {
    const artist = await this.repository.findById(id);

    if (!artist) {
      throw new EntityNotFoundException('Artist', id);
    }

    if (data.title && data.title !== artist.title) {
      const nameExists = await this.repository.findByTitle(data.title);
      if (nameExists)
        throw new EntityAlreadyExistsException('Artist', 'name', data.title);
    }
    const updatedArtist = await this.repository.update(id, data);

    return ResponseUtil.success(
      'Artist updated successfully',
      this.mapper.toResponseDTO(updatedArtist),
    );
  }

  /**
   * Soft delete artist
   */
  async softDeleteArtist(id: string): Promise<IApiResponse> {
    const artist = await this.repository.findById(id);

    if (!artist) {
      throw new EntityNotFoundException('Artist', id);
    }

    await this.repository.softDelete(id);
    return ResponseUtil.noContent('Artist deleted successfully');
  }

  /**
   * Hard delete artist
   */

  async hardDeleteArtist(id: string): Promise<IApiResponse> {
    const artist = await this.repository.findByIdWithDeleted(id);
    if (!artist) {
      throw new EntityNotFoundException('Artist', id);
    }

    await this.repository.hardDelete(id);

    return ResponseUtil.noContent('Artist permanently deleted');
  }

  /**
   * Restore artist
   */
  async restoreArtist(id: string): Promise<IApiResponse> {
    const artist = await this.repository.findByIdWithDeleted(id);
    if (!artist) {
      throw new EntityNotFoundException('Artist', id);
    }
    if (!artist.is_deleted) {
      throw new InvalidOperationException('Artist is not deleted');
    }

    await this.repository.restore(id);
    const restoredArtist = await this.repository.findById(id);

    return ResponseUtil.success('Artist restored successfully', restoredArtist);
  }

  /**
   * Get all artists
   */
  async getAllArtists(): Promise<IApiResponse> {
    try {
      const astists = await this.repository.findAll();

      return ResponseUtil.success(
        'Artists retrieved successfully',
        this.mapper.toListResponseDTOList(astists),
      );
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Failed to retrieve artists. Please try again later.',
      );
    }
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
