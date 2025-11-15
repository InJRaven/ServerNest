import { TracksEntity } from '@entities';
import { TrackListResponseDTO, TrackResponseDTO } from '@modules/server/DTO';
import { Injectable } from '@nestjs/common';
import { StringUtil } from '@utils';

@Injectable()
class TrackMapper {
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
  toResponseDTO(entity: TracksEntity): TrackResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      duration: entity.duration,
      durationFormatted: this.formatDuration(entity.duration),
      trackNo: entity.track_no,
      coverUrl: entity.cover_url,
      isExplicit: entity.is_explicit,
      bpm: entity.bpm,
      lyrics: entity.lyrics,
      stats: {
        playCount: StringUtil.formatNumber(entity.play_count),
        likeCount: StringUtil.formatNumber(entity.like_count),
      },
      popularity: entity.popularity,
      releaseDate: entity.release_date?.toISOString(),
      externalUrls: entity.external_urls,
      status: entity.status,
      createdAt: entity.createdAt.toISOString(),
    };
  }

  /**
   * Entity → List Response DTO
   */
  toListResponseDTO(entity: TracksEntity): TrackListResponseDTO {
    return {
      id: entity.id,
      title: entity.title,
      slug: entity.slug,
      duration: entity.duration,
      durationFormatted: this.formatDuration(entity.duration),
      trackNo: entity.track_no,
      coverUrl: entity.cover_url,
      isExplicit: entity.is_explicit,
      playCount: StringUtil.formatNumber(entity.play_count),
      popularity: entity.popularity,
    };
  }

  /**
   * Entity[] → List Response DTO[]
   */
  toListResponseDTOList(entities: TracksEntity[]): TrackListResponseDTO[] {
    return entities.map((entity) => this.toListResponseDTO(entity));
  }
}
export { TrackMapper };
