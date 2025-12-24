class GenreResponseDTO {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverUrl?: string;
  icon?: {
    type: string;
    value: string;
  };
  color?: string;
  popularity: number;
  stats: {
    trackCount: string;
    albumCount: string;
  };
  relatedGenres?: string[];
  tags?: string[];
  isActive: boolean;
  createdAt: string;
}

class GenreListResponseDTO {
  id: string;
  title: string;
  slug: string;
  description?: string;
  coverUrl?: string;
  color?: string;
  trackCount: string;
  albumCount: string;
  popularity: number;
  deleted: boolean;
}

export { GenreResponseDTO, GenreListResponseDTO };
