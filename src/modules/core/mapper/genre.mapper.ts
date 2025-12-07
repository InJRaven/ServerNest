import { GenresEntity } from '@entities';
import { GenreListResponseDTO, GenreResponseDTO } from '@core/DTO';
import { StringUtil } from '@utils';

class GenreMapper {
  /**
   * Entity → Full Response DTO
   */
  toResponseDTO(entity: GenresEntity): GenreResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      description: entity.content,
      coverUrl: entity.cover_url,
      icon: {
        type: entity.icon_type,
        value: entity.icon_value,
      },
      color: entity.color,
      popularity: entity.popularity,
      stats: {
        trackCount: StringUtil.formatNumber(entity.track_count),
        albumCount: StringUtil.formatNumber(entity.album_count),
      },
      relatedGenres: entity.related_genres,
      tags: entity.tags,
      isActive: entity.is_active,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  /**
   * Entity → List Response DTO
   */
  toListResponseDto(entity: GenresEntity): GenreListResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      coverUrl: entity.cover_url,
      color: entity.color,
      trackCount: StringUtil.formatNumber(entity.track_count),
      albumCount: StringUtil.formatNumber(entity.album_count),
      popularity: entity.popularity,
    };
  }

  /**
   * Entity[] → List Response DTO[]
   */
  toListResponseDTOList(entities: GenresEntity[]): GenreListResponseDTO[] {
    return entities.map((entity) => this.toListResponseDto(entity));
  }
}

export { GenreMapper };
