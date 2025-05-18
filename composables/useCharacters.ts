import type { Character, PaginationInfo } from '~/types/api'
import { fetchCharacters } from '~/utils/api'

export function useCharacters() {
  // Shared state using Nuxt's useState - MOVED INSIDE THE FUNCTION
  const characters = useState<Character[]>('characters', () => [])
  const paginationInfo = useState<PaginationInfo | null>('paginationInfo', () => null)
  const pending = useState<boolean>('charactersPending', () => false)
  const error = useState<Error | null>('charactersError', () => null)
  const pendingMore = useState<boolean>('charactersPendingMore', () => false)
  const errorMore = useState<Error | null>('charactersErrorMore', () => null)
  const statusFilter = useState<'Alive' | 'Dead' | 'unknown' | null>('charactersStatusFilter', () => null)

  const isMounted = ref(false)
  // Ensure onMounted is only called on the client
  if (process.client) {
    onMounted(() => {
      isMounted.value = true
    })
  }

  async function loadCharacters(isInitialLoad = false) {
    // Guard against running on server if not intended, or if component not mounted yet for client-side
    // Allow initial load to proceed if it's explicitly marked, even if isMounted isn't true yet (e.g. from server-side call or immediate client-side needs)
    if (process.client && !isMounted.value && !isInitialLoad) {
      // console.log('Composable: loadCharacters skipped: not mounted and not initial load'); // Optional: keep for deeper debugging
      return;
    }

    // console.log('Composable: loadCharacters called. Current filter:', statusFilter.value, 'Is initial:', isInitialLoad); // Debug
    pending.value = true
    error.value = null
    // Only reset characters if it's a new filter load, not for initial load if already populated (e.g. SSR)
    if (!isInitialLoad || characters.value.length === 0) {
        characters.value = []
    }

    try {
      const currentFilterValue = statusFilter.value
      const filters = currentFilterValue ? { status: currentFilterValue } : undefined
      // console.log('Composable: Fetching with filter:', filters); // Debug
      
      const response = await fetchCharacters(undefined, filters)
      // console.log('Composable: Received character results:', response.results.length); // Debug
      
      characters.value = response.results
      paginationInfo.value = response.pagination
    } catch (e: any) {
      error.value = e
      console.error('Composable: Error loading characters:', e); // Keep for actual errors
    } finally {
      pending.value = false
      // console.log('Composable: loadCharacters finished. Pending:', pending.value, 'Chars:', characters.value.length); // Debug
    }
  }

  async function loadMoreCharacters() {
    if (!paginationInfo.value?.next) return

    pendingMore.value = true
    errorMore.value = null
    try {
      const response = await fetchCharacters(paginationInfo.value.next)
      characters.value.push(...response.results)
      paginationInfo.value = response.pagination
    } catch (e: any) {
      errorMore.value = e
      console.error('Composable: Error loading more characters:', e); // Keep for actual errors
    } finally {
      pendingMore.value = false
    }
  }

  function setStatusFilter(newStatus: 'Alive' | 'Dead' | 'unknown' | null) {
    // console.log('Composable: Attempting to set status filter to:', newStatus); // Debug
    if (statusFilter.value !== newStatus) {
      statusFilter.value = newStatus
      // console.log('Composable: statusFilter changed to:', newStatus); // Debug (Watcher will trigger loadCharacters)
    } else if (newStatus === null && statusFilter.value === null) {
      // console.log('Composable: statusFilter is already null, forcing reload for "all".'); // Debug
      loadCharacters(); 
    }
  }

  // Watch for changes in statusFilter (shared state) to reload characters
  if (process.client) {
    watch(statusFilter, (newValue, oldValue) => {
      // console.log(`Composable Watch: statusFilter changed from "${oldValue}" to "${newValue}". Reloading characters.`); // Debug
      loadCharacters(); // Do not pass isInitialLoad here, it's a filter change
    }, { immediate: false });
  }
  
  return {
    characters,
    paginationInfo,
    pending,
    error,
    pendingMore,
    errorMore,
    statusFilter,
    loadCharacters,
    loadMoreCharacters,
    setStatusFilter,
    isMounted // Expose isMounted if needed by calling components, though direct use might be an anti-pattern
  }
} 