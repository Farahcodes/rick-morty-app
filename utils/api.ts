import type { CharactersResponse } from '~/types/api'

export const API_BASE_URL = 'https://rickandmortyapi.com/api'
export const CHARACTERS_URL = `${API_BASE_URL}/character`

/**
 * Fetches characters from the Rick and Morty API
 * @param url The URL to fetch from (defaults to the characters endpoint)
 * @param filters Optional filters for the API request
 * @returns A promise containing the character results
 */
export async function fetchCharacters(
  url: string = CHARACTERS_URL, 
  filters?: { status?: 'Alive' | 'Dead' | 'unknown' }
) {
  try {
    let finalUrl = url;
    
    if (filters && url === CHARACTERS_URL) {
      const params = new URLSearchParams()
      if (filters.status) {
        params.append('status', filters.status)
      }
      if (params.toString()) {
        finalUrl = `${url}?${params.toString()}`
      }
    }
    
    if (url === CHARACTERS_URL) {
      const separator = finalUrl.includes('?') ? '&' : '?'
      finalUrl = `${finalUrl}${separator}_t=${Date.now()}`;
    }
    
    const response = await $fetch<CharactersResponse>(finalUrl, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
    
    return {
      results: response.results,
      pagination: response.info
    }
  } catch (e) {
    console.error('API error:', e);
    throw new Error(e instanceof Error ? e.message : 'Failed to fetch characters')
  }
} 