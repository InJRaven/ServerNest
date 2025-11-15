class TrackResponseDTO {
  id: string;
  title: string;
  slug: string;
  duration: number;
  durationFormatted: string;
  trackNo: number;
  coverUrl?: string;
  isExplicit: boolean;
  bpm?: number;
  lyrics: string;
  stats: {
    playCount: string;
    likeCount: string;
  };
  popularity: number;
  releaseDate?: string;
  externalUrls?: Record<string, string>;
  status: string;
  createdAt: string;
}

class TrackListResponseDTO {
  id: string;
  title: string;
  slug: string;
  duration: number;
  durationFormatted: string;
  trackNo: number;
  coverUrl?: string;
  isExplicit: boolean;
  playCount: string;
  popularity: number;
}

export { TrackResponseDTO, TrackListResponseDTO };
