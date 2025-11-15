class GenreResponseDTO {
  id: string;
  name: string;
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
    songCount: string;
    albumCount: string;
  };
  relatedGenres?: string[];
  tags?: string[];
  isActive: boolean;
  createdAt: string;
}

class GenreListResponseDTO {
  id: string;
  name: string;
  slug: string;
  coverUrl?: string;
  color?: string;
  songCount: string;
  popularity: number;
}

export { GenreResponseDTO, GenreListResponseDTO };
