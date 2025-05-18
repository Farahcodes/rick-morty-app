// Rick and Morty API types
export interface Character {
  id: number
  name: string
  status: 'Alive' | 'Dead' | 'unknown'
  species: string
  type?: string
  gender: string
  origin: {
    name: string
    url: string
  }
  location: {
    name: string
    url: string
  }
  image: string
  episode: string[]
  url: string
  created: string
}

export interface PaginationInfo {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

export interface ApiResponse<T> {
  info: PaginationInfo
  results: T[]
}

export interface CharactersResponse extends ApiResponse<Character> {} 