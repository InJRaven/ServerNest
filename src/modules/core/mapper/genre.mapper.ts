import { GenreListResponseDTO, GenreResponseDTO } from '@core/DTO';
// import { StringUtil } from '@utils';
import { Genre } from '@CoreEntities';

class GenreMapper {
  /**
   * Entity → Full Response DTO
   */
  toResponseDTO(entity: Genre): GenreResponseDTO {
    return {
      id: entity.id,
      identify: entity.identify,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      coverUrl: entity.coverUrl,
      // icon: {
      //   type: entity.icon_type,
      //   value: entity.icon_value,
      // },
      // color: entity.color,
      popularity: 0,
      stats: {
        trackCount: entity.trackGenres?.length.toString() || '0',
        albumCount: entity.albumGenres?.length.toString() || '0',
      },
      // relatedGenres: entity.related_genres,
      // tags: entity.tags,
      // isActive: entity.is_active,
      deleted: entity.isDeleted,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  /**
   * Entity → List Response DTO
   */
  toListResponseDto(entity: Genre): GenreListResponseDTO {
    return {
      id: entity.id,
      identify: entity.identify,
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      coverUrl: entity.coverUrl,
      // color: entity.color,
      trackCount: entity.trackGenres?.length.toString() || '0',
      albumCount: entity.albumGenres?.length.toString() || '0',
      popularity: 0,
      deleted: entity.isDeleted,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  /**
   * Entity[] → List Response DTO[]
   */
  toListResponseDTOList(entities: Genre[]): GenreListResponseDTO[] {
    return entities.map((entity) => this.toListResponseDto(entity));
  }
}

export { GenreMapper };
