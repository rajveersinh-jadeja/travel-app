export interface User {
  id: string
  name: string
  handle: string
  avatarUrl: string
  bio?: string
  isPro?: boolean
  stats?: {
    countries: number
    cities: number
    totalPins: number
  }
}

export interface Reaction {
  emoji: string
  count: number
  hasReacted: boolean
}

export interface MemoryPin {
  id: string
  tripId?: string
  tripTitle?: string
  userId: string
  user: User
  title: string
  caption: string
  locationName: string
  city: string
  country: string
  coordinates: [number, number]
  photos: string[]
  createdAt: string
  relativeTime: string
  reactions: Reaction[]
  companions?: User[]
  category?: 'nature' | 'food' | 'architecture' | 'stay' | 'activity'
}

export interface Trip {
  id: string
  title: string
  location: string
  dateRange: string
  coverImage: string
  collaborators: User[]
  pinsCount: number
  routeCoordinates: [number, number][]
  isCollaborative: boolean
}

export interface TripInvite {
  id: string
  tripId: string
  tripTitle: string
  location: string
  inviter: User
  invitedAt: string
  status: 'pending' | 'accepted' | 'declined'
}
