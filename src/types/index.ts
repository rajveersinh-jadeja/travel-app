export interface User {
  id: string
  name: string
  handle: string
  avatarUrl: string
  bio?: string
  isPro?: boolean
  currentCity?: string
  coordinates?: [number, number]
  stats?: {
    posts?: number
    followers?: string
    following?: number
    countries?: number
    cities?: number
    totalPins?: number
  }
}

export interface Story {
  id: string
  user: User
  hasUnseen: boolean
  isLive?: boolean
  thumbnailUrl: string
}

export interface FeedPost {
  id: string
  author: User
  locationName: string
  timeAgo: string
  imageUrl: string
  caption: string
  likesCount: number
  commentsCount: number
  hasLiked?: boolean
  hasBookmarked?: boolean
}

export interface PlaceDetail {
  id: string
  name: string
  country: string
  countryFlag: string
  distanceAway: string
  caption: string
  heroImage: string
  galleryPhotos: string[]
  friendsVisitingCount: number
  friendAvatars: string[]
  coordinates: [number, number]
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
  imageUrl?: string
  createdAt: string
  relativeTime: string
  reactions: Reaction[]
  companions?: User[]
  category?: 'nature' | 'food' | 'architecture' | 'stay' | 'activity' | 'culture'
  stats?: {
    likes?: number
    comments?: number
    saves?: number
  }
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
