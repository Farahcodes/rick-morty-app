/**
 * Returns the semantic color for a given character status
 * @param status Character status ('Alive', 'Dead', 'unknown', or null)
 * @returns Semantic color name that matches the theme configuration
 */
export function getStatusColor(status: string | null): string {
  if (!status) return 'primary';
  
  switch (status) {
    case 'Alive': return 'success';
    case 'Dead': return 'error';
    case 'unknown': return 'lovasoa';
    default: return 'primary';
  }
} 