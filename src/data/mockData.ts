import { User, Trip, MemoryPin } from '../types'

export const currentUser: User = {
  id: 'u-self',
  name: 'Rajveer Jadeja',
  handle: '@rajveer',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80',
  bio: 'Visual travel journal & alpine trails. Currently exploring Northern Coast.',
  isPro: true,
  stats: {
    countries: 14,
    cities: 38,
    totalPins: 142
  }
}

export const mockFriends: User[] = [
  {
    id: 'u-1',
    name: 'Elena Rostova',
    handle: '@elena_wander',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Photographer & coffee seeker in Kyoto & Bali.'
  },
  {
    id: 'u-2',
    name: 'Marcus Vance',
    handle: '@marcus.v',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Surfing the Pacific & motorcycle road trips.'
  },
  {
    id: 'u-3',
    name: 'Sofia Chen',
    handle: '@sofiachen',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Architecture scout | Nordic minimalism.'
  },
  {
    id: 'u-4',
    name: 'Kai Lindqvist',
    handle: '@kailind',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=256&h=256&q=80',
    bio: 'Lofoten islands local & expedition lead.'
  }
]

export const mockTrips: Trip[] = [
  {
    id: 'trip-bali',
    title: 'Bali Island Traverse',
    location: 'Bali, Indonesia',
    dateRange: 'Nov 12 – Nov 24, 2026',
    coverImage: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=800&q=80',
    collaborators: [currentUser, mockFriends[0], mockFriends[1]],
    pinsCount: 18,
    isCollaborative: true,
    routeCoordinates: [
      [-8.5069, 115.2625],
      [-8.6478, 115.1385],
      [-8.8291, 115.0849]
    ]
  },
  {
    id: 'trip-norway',
    title: 'Lofoten Arctic Roadtrip',
    location: 'Nordland, Norway',
    dateRange: 'Sep 28 – Oct 6, 2026',
    coverImage: 'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80',
    collaborators: [currentUser, mockFriends[2], mockFriends[3]],
    pinsCount: 24,
    isCollaborative: true,
    routeCoordinates: [
      [67.9333, 13.0833],
      [68.1542, 14.2042]
    ]
  },
  {
    id: 'trip-california',
    title: 'Pacific Highway & SF Coast',
    location: 'California, USA',
    dateRange: 'Active Now',
    coverImage: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80',
    collaborators: [currentUser, mockFriends[1]],
    pinsCount: 12,
    isCollaborative: true,
    routeCoordinates: [
      [37.7544, -122.4477],
      [37.8270, -122.4990],
      [37.7847, -122.5058]
    ]
  }
]

export const mockPins: MemoryPin[] = [
  {
    id: 'pin-1',
    tripId: 'trip-california',
    tripTitle: 'Pacific Highway & SF Coast',
    userId: 'u-1',
    user: mockFriends[0],
    title: 'Fog rolling over Marin Headlands',
    caption: 'Arrived right as the Pacific marine layer swept through the golden gate cliffs. Pure silence up here.',
    locationName: 'Hawk Hill, Marin Headlands',
    city: 'San Francisco Bay',
    country: 'United States',
    coordinates: [37.8270, -122.4990],
    photos: [
      'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1449034446853-66c86144b0ad?auto=format&fit=crop&w=900&q=80'
    ],
    createdAt: '2026-11-24T09:15:00Z',
    relativeTime: '2h ago',
    category: 'nature',
    reactions: [
      { emoji: '🔥', count: 14, hasReacted: true },
      { emoji: '✨', count: 8, hasReacted: false },
      { emoji: '🌊', count: 21, hasReacted: true }
    ],
    companions: [currentUser]
  },
  {
    id: 'pin-2',
    tripId: 'trip-california',
    tripTitle: 'Pacific Highway & SF Coast',
    userId: 'u-2',
    user: mockFriends[1],
    title: 'Sunset viewpoint at Twin Peaks',
    caption: 'Catching the panoramic city glow with warm matcha before heading downtown.',
    locationName: 'Twin Peaks Summit',
    city: 'San Francisco',
    country: 'United States',
    coordinates: [37.7544, -122.4477],
    photos: [
      'https://images.unsplash.com/photo-1521464302861-ce943917d1c3?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1506146332389-18140dc7b2fb?auto=format&fit=crop&w=900&q=80'
    ],
    createdAt: '2026-11-24T05:30:00Z',
    relativeTime: '6h ago',
    category: 'activity',
    reactions: [
      { emoji: '🌅', count: 19, hasReacted: true },
      { emoji: '❤️', count: 12, hasReacted: false }
    ]
  },
  {
    id: 'pin-3',
    tripId: 'trip-california',
    tripTitle: 'Pacific Highway & SF Coast',
    userId: 'u-self',
    user: currentUser,
    title: 'Ocean cliffs at Lands End Lookout',
    caption: 'Cypress trees framing the Pacific swells. The air smells like eucalyptus and sea salt.',
    locationName: 'Lands End Coastal Trail',
    city: 'San Francisco',
    country: 'United States',
    coordinates: [37.7847, -122.5058],
    photos: [
      'https://images.unsplash.com/photo-1426604966848-d7adac402bff?auto=format&fit=crop&w=900&q=80'
    ],
    createdAt: '2026-11-23T20:00:00Z',
    relativeTime: '1d ago',
    category: 'nature',
    reactions: [
      { emoji: '🌿', count: 26, hasReacted: true },
      { emoji: '📸', count: 15, hasReacted: true }
    ]
  },
  {
    id: 'pin-4',
    tripId: 'trip-bali',
    tripTitle: 'Bali Island Traverse',
    userId: 'u-1',
    user: mockFriends[0],
    title: 'Morning mist above Tegalalang Terraces',
    caption: 'Hiked in at 5:45 AM before any tourists. First light catching the dew on green palms.',
    locationName: 'Tegalalang Rice Terraces, Ubud',
    city: 'Ubud',
    country: 'Indonesia',
    coordinates: [-8.5069, 115.2625],
    photos: [
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=900&q=80',
      'https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?auto=format&fit=crop&w=900&q=80'
    ],
    createdAt: '2026-11-22T12:00:00Z',
    relativeTime: '2d ago',
    category: 'nature',
    reactions: [
      { emoji: '🌴', count: 42, hasReacted: true },
      { emoji: '☕', count: 18, hasReacted: false }
    ],
    companions: [currentUser, mockFriends[1]]
  },
  {
    id: 'pin-5',
    tripId: 'trip-bali',
    tripTitle: 'Bali Island Traverse',
    userId: 'u-2',
    user: mockFriends[1],
    title: 'Surfing the reef break at Echo Beach',
    caption: 'Glassy 5-foot swell and sunset coconut stands. Canggu never gets old.',
    locationName: 'Echo Beach, Canggu',
    city: 'Canggu',
    country: 'Indonesia',
    coordinates: [-8.6478, 115.1385],
    photos: [
      'https://images.unsplash.com/photo-1502680390469-be75c86b636f?auto=format&fit=crop&w=900&q=80'
    ],
    createdAt: '2026-11-21T08:00:00Z',
    relativeTime: '3d ago',
    category: 'activity',
    reactions: [
      { emoji: '🏄‍♂️', count: 33, hasReacted: true },
      { emoji: '🤙', count: 27, hasReacted: true }
    ]
  },
  {
    id: 'pin-6',
    tripId: 'trip-bali',
    tripTitle: 'Bali Island Traverse',
    userId: 'u-self',
    user: currentUser,
    title: 'Cliffside sunset at Uluwatu Temple',
    caption: 'Sitting 70 meters above the breaking Indian Ocean waves during golden hour chant.',
    locationName: 'Uluwatu Temple Cliff',
    city: 'Uluwatu',
    country: 'Indonesia',
    coordinates: [-8.8291, 115.0849],
    photos: [
      'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=900&q=80'
    ],
    createdAt: '2026-11-20T11:00:00Z',
    relativeTime: '4d ago',
    category: 'architecture',
    reactions: [
      { emoji: '✨', count: 39, hasReacted: true },
      { emoji: '🌊', count: 24, hasReacted: true }
    ]
  },
  {
    id: 'pin-7',
    tripId: 'trip-norway',
    tripTitle: 'Lofoten Arctic Roadtrip',
    userId: 'u-3',
    user: mockFriends[2],
    title: 'Reflections in Reinefjorden',
    caption: 'Sub-zero morning air, mirror reflections of snow-capped granite peaks.',
    locationName: 'Reinebringen Trailhead',
    city: 'Reine',
    country: 'Norway',
    coordinates: [67.9333, 13.0833],
    photos: [
      'https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=900&q=80'
    ],
    createdAt: '2026-11-18T14:00:00Z',
    relativeTime: '6d ago',
    category: 'nature',
    reactions: [
      { emoji: '❄️', count: 54, hasReacted: true },
      { emoji: '🏔️', count: 38, hasReacted: true }
    ]
  },
  {
    id: 'pin-8',
    tripId: 'trip-norway',
    tripTitle: 'Lofoten Arctic Roadtrip',
    userId: 'u-4',
    user: mockFriends[3],
    title: 'World famous football pitch in the sea',
    caption: 'Wooden cod racks and ocean surrounding this tiny rocky island stadium.',
    locationName: 'Henningsvær Stadium',
    city: 'Henningsvær',
    country: 'Norway',
    coordinates: [68.1542, 14.2042],
    photos: [
      'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=900&q=80'
    ],
    createdAt: '2026-11-17T15:30:00Z',
    relativeTime: '1w ago',
    category: 'activity',
    reactions: [
      { emoji: '⚽', count: 48, hasReacted: true },
      { emoji: '🇳🇴', count: 29, hasReacted: true }
    ]
  },
  {
    id: 'pin-9',
    userId: 'u-1',
    user: mockFriends[0],
    title: 'Hidden alleyways of Yanaka Ginza',
    caption: 'Preserved old Tokyo vibes, wooden craft shops, and street-level dorayaki.',
    locationName: 'Yanaka Ginza',
    city: 'Tokyo',
    country: 'Japan',
    coordinates: [35.7262, 139.7687],
    photos: [
      'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=900&q=80'
    ],
    createdAt: '2026-11-10T10:00:00Z',
    relativeTime: '2w ago',
    category: 'architecture',
    reactions: [
      { emoji: '🏮', count: 31, hasReacted: true },
      { emoji: '🍵', count: 19, hasReacted: false }
    ]
  },
  {
    id: 'pin-10',
    userId: 'u-3',
    user: mockFriends[2],
    title: 'Cliffside lemons & pastel villas',
    caption: 'Espresso with cliff views over the Tyrrhenian Sea.',
    locationName: 'Positano Spiaggia Grande',
    city: 'Positano',
    country: 'Italy',
    coordinates: [40.6281, 14.4850],
    photos: [
      'https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=900&q=80'
    ],
    createdAt: '2026-11-05T16:00:00Z',
    relativeTime: '2w ago',
    category: 'stay',
    reactions: [
      { emoji: '🍋', count: 45, hasReacted: true },
      { emoji: '🇮🇹', count: 32, hasReacted: true }
    ]
  }
]
