/**
 * Character status values from the Rick and Morty API
 */
export type CharacterStatus = 'Alive' | 'Dead' | 'unknown';

/**
 * Maps character status values to semantic color names
 */
export const statusColorMap: Record<CharacterStatus, string> = {
  'Alive': 'success',
  'Dead': 'error',
  'unknown': 'lovasoa'
}; 