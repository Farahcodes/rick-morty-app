import type { CharacterStatus } from '~/types/status';
import { statusColorMap } from '~/types/status';
import type { AllowedThemeColor } from '~/types/ui';

/**
 * Returns the semantic color for a given character status
 * @param status Character status ('Alive', 'Dead', 'unknown', or null)
 * @returns Semantic color name that matches the theme configuration
 */
export function getStatusColor(status: CharacterStatus | null): AllowedThemeColor {
  if (!status) return 'primary';
  return statusColorMap[status as CharacterStatus] || 'primary';
} 