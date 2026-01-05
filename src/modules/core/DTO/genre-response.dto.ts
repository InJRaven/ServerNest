class GenreResponseDTO {
  id: string;
  identify: string;
  name: string;
  slug: string;
  description?: string;
  coverUrl?: string;
  // icon?: {
  //   type: string;
  //   value: string;
  // };
  // color?: string;
  popularity: number;
  stats: {
    trackCount: string;
    albumCount: string;
  };
  // relatedGenres?: string[];
  // tags?: string[];
  // isActive: boolean;
  deleted?: boolean;
  createdAt: string;
}

class GenreListResponseDTO {
  id: string;
  identify: string;
  name: string;
  slug: string;
  description?: string;
  coverUrl?: string;
  color?: string;
  trackCount?: string;
  albumCount?: string;
  popularity?: number;
  deleted?: boolean;
  createdAt: string;
}

export { GenreResponseDTO, GenreListResponseDTO };
