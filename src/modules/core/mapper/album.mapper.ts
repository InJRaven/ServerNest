import { Injectable } from '@nestjs/common';
import { StringUtil } from '@utils';
import { AlbumsEntity } from '@entities';
import { AlbumResponseDTO, AlbumListResponseDTO } from '@core/DTO';

@Injectable()
class AlbumMapper {
  /**
   * Format duration (seconds) to MM:SS
   */
  private formatDuration(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  }
  /**
   * Entity → Full Response DTO
   */
  toResponseDTO(entity: AlbumsEntity): AlbumResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      coverUrl: entity.cover_url,
      coverHighResUrl: entity.cover_high_res_url,
      releaseDate: entity.release_date.toISOString(),
      albumType: entity.album_type,
      label: entity.label,
      totalTracks: entity.total_tracks,
      durationTotal: entity.duration_total,
      durationTotalFormatted: this.formatDuration(entity.duration_total),
      stats: {
        totalPlays: StringUtil.formatNumber(entity.total_plays),
        totalLikes: StringUtil.formatNumber(entity.total_likes),
      },
      popularity: entity.popularity,
      genres: entity.genres,
      externalUrls: entity.external_urls,
      tags: entity.tags,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  /**
   * Entity → List Response DTO
   */
  toListResponseDTO(entity: AlbumsEntity): AlbumListResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      coverUrl: entity.cover_url,
      releaseDate: entity.release_date.toISOString(),
      albumType: entity.album_type,
      totalTracks: entity.total_tracks,
      popularity: entity.popularity,
    };
  }

  /**
   * Entity[] → List Response DTO[]
   */
  toListResponseDTOList(entities: AlbumsEntity[]): AlbumListResponseDTO[] {
    return entities.map((entity) => this.toListResponseDTO(entity));
  }

  /**
   * Entity → Response DTO with relations
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  toResponseDTOWithRelations(entity: AlbumsEntity): AlbumResponseDTO & {
    trackCount?: number;
  } {
    const baseDTO = this.toResponseDTO(entity);
    return {
      ...baseDTO,
      trackCount: entity.total_tracks || 0,
    };
  }
}

export { AlbumMapper };
