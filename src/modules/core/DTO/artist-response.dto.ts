class ArtistResponseDTO {
  id: string;
  title: string;
  slug: string;
  avatarUrl?: string;
  headerImageUrl?: string;
  summary?: string;
  verified: boolean;
  popularity: number;
  images?: Array<{
    url: string;
    height: number;
    width: number;
  }>;
  stats: {
    followers: string;
    monthlyListeners: string;
  };
  genres: string[];
  externalUrls?: Record<string, string>;
  country?: string;
  debutDate?: string;
  status: string;
  createdAt: string;
}

class ArtistListResponseDTO {
  id: string;
  title: string;
  slug: string;
  avatarUrl?: string;
  verified: boolean;
  popularity: number;
  followerCount: string;
  genres: string[];
}
export { ArtistResponseDTO, ArtistListResponseDTO };
