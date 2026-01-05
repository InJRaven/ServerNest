export const defaultAdminRoles = [
  {
    identify: 'system_admin',
    name: 'System Admin',
    description:
      'Highest privileges: full system management, create/delete admins, data recovery',
    displayOrder: 0,
    isActive: true,
    isSuperAdmin: true,
  },
  {
    identify: 'admin',
    name: 'Admin',
    description: 'Administrator: manage content, users, artists',
    displayOrder: 10,
    isActive: true,
    isSuperAdmin: false,
  },
  {
    identify: 'mod',
    name: 'Moderator',
    description: 'Moderation: delete comments, handle reports',
    displayOrder: 20,
    isActive: true,
    isSuperAdmin: false,
  },
  {
    identify: 'manager',
    name: 'Manager',
    description: 'management: upload songs, albums, artists',
    displayOrder: 30,
    isActive: true,
    isSuperAdmin: false,
  },
  {
    identify: 'analyst',
    name: 'Analyst',
    description: 'Data analysis: view reports, statistics',
    displayOrder: 40,
    isActive: true,
    isSuperAdmin: false,
  },
  {
    identify: 'guest',
    name: 'Guest',
    description:
      'Limited access: view-only, no editing or moderation privileges',
    displayOrder: 50,
    isActive: true,
    isSuperAdmin: false,
  },
];

export const defaultGenres = [
  // Pop & Mainstream
  {
    name: 'Pop',
    slug: 'pop',
    identify: 'POP',
    description: 'Catchy mainstream music',
  },
  {
    name: 'K-Pop',
    slug: 'k-pop',
    identify: 'K_POP',
    description: 'Korean idol pop',
  },
  {
    name: 'J-Pop',
    slug: 'j-pop',
    identify: 'J_POP',
    description: 'Japanese popular music',
  },
  {
    name: 'Dance Pop',
    slug: 'dance-pop',
    identify: 'DANCE_POP',
    description: 'Upbeat pop with dance elements',
  },
  {
    name: 'Teen Pop',
    slug: 'teen-pop',
    identify: 'TEEN_POP',
    description: 'Pop for teenagers',
  },
  {
    name: 'Synthpop',
    slug: 'synthpop',
    identify: 'SYNTHPOP',
    description: '80s-inspired synth pop',
  },
  {
    name: 'Bubblegum Pop',
    slug: 'bubblegum-pop',
    identify: 'BUBBLEGUM_POP',
    description: 'Sweet catchy pop',
  },

  // Hip-Hop / Rap
  {
    name: 'Hip-Hop',
    slug: 'hip-hop',
    identify: 'HIP_HOP',
    description: 'Rhythmic lyrics over beats',
  },
  {
    name: 'Rap',
    slug: 'rap',
    identify: 'RAP',
    description: 'Vocal rhythm and rhyme',
  },
  {
    name: 'Trap',
    slug: 'trap',
    identify: 'TRAP',
    description: 'Southern hip-hop with 808s',
  },
  {
    name: 'Drill',
    slug: 'drill',
    identify: 'DRILL',
    description: 'Aggressive hip-hop',
  },
  {
    name: 'UK Drill',
    slug: 'uk-drill',
    identify: 'UK_DRILL',
    description: 'UK aggressive drill',
  },
  {
    name: 'Boom Bap',
    slug: 'boom-bap',
    identify: 'BOOM_BAP',
    description: 'Classic hip-hop drums',
  },
  {
    name: 'Cloud Rap',
    slug: 'cloud-rap',
    identify: 'CLOUD_RAP',
    description: 'Dreamy atmospheric rap',
  },
  {
    name: 'Emo Rap',
    slug: 'emo-rap',
    identify: 'EMO_RAP',
    description: 'Emotional melodic rap',
  },
  {
    name: 'Mumble Rap',
    slug: 'mumble-rap',
    identify: 'MUMBLE_RAP',
    description: 'Melodic slurred rap',
  },

  // Rock & Alternative
  {
    name: 'Rock',
    slug: 'rock',
    identify: 'ROCK',
    description: 'Guitar-driven rock',
  },
  {
    name: 'Alternative Rock',
    slug: 'alternative-rock',
    identify: 'ALT_ROCK',
    description: 'Non-mainstream rock',
  },
  {
    name: 'Indie Rock',
    slug: 'indie-rock',
    identify: 'INDIE_ROCK',
    description: 'DIY independent rock',
  },
  {
    name: 'Punk Rock',
    slug: 'punk-rock',
    identify: 'PUNK_ROCK',
    description: 'Fast rebellious rock',
  },
  {
    name: 'Post-Punk',
    slug: 'post-punk',
    identify: 'POST_PUNK',
    description: 'Dark angular rock',
  },
  {
    name: 'Grunge',
    slug: 'grunge',
    identify: 'GRUNGE',
    description: '90s Seattle distorted rock',
  },
  {
    name: 'Metal',
    slug: 'metal',
    identify: 'METAL',
    description: 'Heavy distorted guitars',
  },
  {
    name: 'Heavy Metal',
    slug: 'heavy-metal',
    identify: 'HEAVY_METAL',
    description: 'Intense powerful metal',
  },
  {
    name: 'Death Metal',
    slug: 'death-metal',
    identify: 'DEATH_METAL',
    description: 'Extreme growling metal',
  },
  {
    name: 'Black Metal',
    slug: 'black-metal',
    identify: 'BLACK_METAL',
    description: 'Dark atmospheric metal',
  },

  // Electronic / Dance
  {
    name: 'Electronic',
    slug: 'electronic',
    identify: 'ELECTRONIC',
    description: 'Electronic instruments',
  },
  {
    name: 'EDM',
    slug: 'edm',
    identify: 'EDM',
    description: 'Electronic Dance Music',
  },
  {
    name: 'House',
    slug: 'house',
    identify: 'HOUSE',
    description: '4-on-the-floor dance',
  },
  {
    name: 'Techno',
    slug: 'techno',
    identify: 'TECHNO',
    description: 'Minimal repetitive electronic',
  },
  {
    name: 'Trance',
    slug: 'trance',
    identify: 'TRANCE',
    description: 'Uplifting melodic EDM',
  },
  {
    name: 'Dubstep',
    slug: 'dubstep',
    identify: 'DUBSTEP',
    description: 'Heavy bass drops',
  },
  {
    name: 'Future Bass',
    slug: 'future-bass',
    identify: 'FUTURE_BASS',
    description: 'Melodic EDM with supersaw',
  },
  {
    name: 'Drum and Bass',
    slug: 'drum-and-bass',
    identify: 'DRUM_AND_BASS',
    description: 'Fast breakbeats',
  },
  {
    name: 'Hardstyle',
    slug: 'hardstyle',
    identify: 'HARDSTYLE',
    description: 'Hard-hitting EDM',
  },

  // R&B / Soul / Funk
  {
    name: 'R&B',
    slug: 'r-and-b',
    identify: 'R_AND_B',
    description: 'Soulful vocals and rhythm',
  },
  {
    name: 'Soul',
    slug: 'soul',
    identify: 'SOUL',
    description: 'Emotional vocal music',
  },
  {
    name: 'Neo-Soul',
    slug: 'neo-soul',
    identify: 'NEO_SOUL',
    description: 'Modern soul with jazz',
  },
  {
    name: 'Funk',
    slug: 'funk',
    identify: 'FUNK',
    description: 'Groovy bass-driven music',
  },

  // Country / Folk / Blues
  {
    name: 'Country',
    slug: 'country',
    identify: 'COUNTRY',
    description: 'Storytelling acoustic',
  },
  {
    name: 'Folk',
    slug: 'folk',
    identify: 'FOLK',
    description: 'Traditional acoustic',
  },
  {
    name: 'Blues',
    slug: 'blues',
    identify: 'BLUES',
    description: 'Soulful 12-bar music',
  },

  // World / Latin / African
  {
    name: 'Latin',
    slug: 'latin',
    identify: 'LATIN',
    description: 'Latin American rhythms',
  },
  {
    name: 'Reggaeton',
    slug: 'reggaeton',
    identify: 'REGGAETON',
    description: 'Latin urban dembow',
  },
  {
    name: 'Afrobeats',
    slug: 'afrobeats',
    identify: 'AFROBEATS',
    description: 'West African dance',
  },
  {
    name: 'Amapiano',
    slug: 'amapiano',
    identify: 'AMAPIANO',
    description: 'South African house',
  },
  {
    name: 'Reggae',
    slug: 'reggae',
    identify: 'REGGAE',
    description: 'Offbeat rhythmic music',
  },

  // Modern / Niche / Trending (2026)
  {
    name: 'Lo-fi',
    slug: 'lo-fi',
    identify: 'LOFI',
    description: 'Relaxed nostalgic beats',
  },
  {
    name: 'Hyperpop',
    slug: 'hyperpop',
    identify: 'HYPERPOP',
    description: 'Futuristic glitch pop',
  },
  {
    name: 'Phonk',
    slug: 'phonk',
    identify: 'PHONK',
    description: 'Memphis drift rap',
  },
  {
    name: 'Synthwave',
    slug: 'synthwave',
    identify: 'SYNTHWAVE',
    description: '80s retro electronic',
  },
  {
    name: 'Vaporwave',
    slug: 'vaporwave',
    identify: 'VAPORWAVE',
    description: 'Aesthetic slowed 80s/90s',
  },
  {
    name: 'Chillhop',
    slug: 'chillhop',
    identify: 'CHILLHOP',
    description: 'Relaxed hip-hop jazz',
  },
  {
    name: 'Bedroom Pop',
    slug: 'bedroom-pop',
    identify: 'BEDROOM_POP',
    description: 'DIY home-recorded pop',
  },
  {
    name: 'Plugg',
    slug: 'plugg',
    identify: 'PLUGG',
    description: 'Cloudy atmospheric trap',
  },
  {
    name: 'Jersey Club',
    slug: 'jersey-club',
    identify: 'JERSEY_CLUB',
    description: 'Fast bass-heavy dance',
  },
  {
    name: 'Nightcore',
    slug: 'nightcore',
    identify: 'NIGHTCORE',
    description: 'Sped-up high-pitched remixes',
  },
  {
    name: 'Wave',
    slug: 'wave',
    identify: 'WAVE',
    description: 'Dreamy atmospheric electronic',
  },
  {
    name: 'Future Funk',
    slug: 'future-funk',
    identify: 'FUTURE_FUNK',
    description: 'Funky disco samples',
  },
];
