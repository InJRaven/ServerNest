class AlbumResponseDTO {
  id: string;
  title: string;
  slug: string;
  coverUrl: string;
  coverHighResUrl?: string;
  releaseDate: string;
  albumType: string;
  label?: string;
  totalTracks: number;
  durationTotal?: number;
  durationTotalFormatted?: string;
  stats: {
    totalPlays: string;
    totalLikes: string;
  };
  popularity: number;
  genres?: string[];
  externalUrls?: Record<string, string>;
  tags?: string[];
  status: string;
  createdAt: string;
}

class AlbumListResponseDTO {
  id: string;
  title: string;
  slug: string;
  coverUrl: string;
  releaseDate: string;
  albumType: string;
  totalTracks: number;
  popularity: number;
}
export { AlbumResponseDTO, AlbumListResponseDTO };
