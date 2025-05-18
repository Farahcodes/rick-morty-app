import type { CharactersResponse } from '~/types/api'

export const API_BASE_URL = 'https://rickandmortyapi.com/api'
export const CHARACTERS_URL = `${API_BASE_URL}/character`

/**
 * Fetches characters from the Rick and Morty API
 * @param url The URL to fetch from (defaults to the characters endpoint)
 * @returns A promise containing the character results
 */
export async function fetchCharacters(url: string = CHARACTERS_URL) {
  try {
    const response = await $fetch<CharactersResponse>(url)
    return {
      results: response.results,
      pagination: response.info
    }
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to fetch characters')
  }
} 