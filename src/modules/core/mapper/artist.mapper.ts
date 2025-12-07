import { ArtistsEntity } from '@entities';
import { ArtistListResponseDTO, ArtistResponseDTO } from '@core/DTO';
import { Injectable } from '@nestjs/common';
import { StringUtil } from '@utils';

@Injectable()
class ArtistMapper {
  /**
   * Entity → Full Response DTO
   */

  toResponseDTO(entity: ArtistsEntity): ArtistResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      summary: entity.summary,
      avatarUrl: entity.avatar_url,
      headerImageUrl: entity.header_image_url,
      verified: entity.verified,
      popularity: entity.popularity,
      images: entity.images || [],
      stats: {
        followers: StringUtil.formatNumber(entity.followers),
        monthlyListeners: StringUtil.formatNumber(entity.monthly_listeners),
      },
      genres: entity.genres || [],
      externalUrls: entity.external_urls || {},
      country: entity.country,
      debutDate: entity.debut_date?.toISOString(),
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  /**
   * Entity → List Response DTO
   */
  toListResponseDTO(entity: ArtistsEntity): ArtistListResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      avatarUrl: entity.avatar_url,
      verified: entity.verified,
      popularity: entity.popularity,
      followerCount: StringUtil.formatNumber(entity.followers),
      genres: entity.genres || [],
    };
  }

  /**
   * Entity[] → List Response DTO[]
   */
  toListResponseDTOList(entities: ArtistsEntity[]): ArtistListResponseDTO[] {
    return entities.map((entity) => this.toListResponseDTO(entity));
  }

  /**
   * Entity → Response DTO with relations
   */
  // eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
  toResponseDTOWithRelations(entity: ArtistsEntity): ArtistResponseDTO & {
    albumCount?: number;
    songCount?: number;
  } {
    const baseDTO = this.toResponseDTO(entity);

    return {
      ...baseDTO,
      albumCount: entity.albums?.length || entity['albumsCount'] || 0,
      songCount: entity['songsCount'] || 0,
    };
  }
}

export { ArtistMapper };
