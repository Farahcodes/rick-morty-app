import type { Character, PaginationInfo } from '~/types/api'
import { fetchCharacters } from '~/utils/api'
import type { FetchError } from 'ofetch'
import type { CharacterStatus } from '~/types/status'

export function useCharacters() {
  const characters = useState<Character[]>('characters', () => [])
  const paginationInfo = useState<PaginationInfo | null>('paginationInfo', () => null)
  const pending = useState<boolean>('charactersPending', () => false)
  const error = useState<FetchError | Error | null>('charactersError', () => null)
  const pendingMore = useState<boolean>('charactersPendingMore', () => false)
  const errorMore = useState<FetchError | Error | null>('charactersErrorMore', () => null)
  const statusFilter = useState<CharacterStatus | null>('charactersStatusFilter', () => null)

  async function loadCharacters(isInitialLoad = false) {
    if (import.meta.server && !isInitialLoad) {
      return
    }

    pending.value = true
    error.value = null
    if (!isInitialLoad || characters.value.length === 0) {
        characters.value = []
    }

    try {
      const currentFilterValue = statusFilter.value
      const filters = currentFilterValue ? { status: currentFilterValue } : undefined
      
      const response = await fetchCharacters(undefined, filters)
      
      characters.value = response.results
      paginationInfo.value = response.pagination
    } catch (e: unknown) {
      if (e instanceof Error) {
        error.value = e as FetchError | Error
      } else {
        error.value = new Error('An unknown error occurred during loadCharacters')
      }
      console.error('Composable: Error loading characters:', e)
    } finally {
      pending.value = false
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
    } catch (e: unknown) {
       if (e instanceof Error) {
        errorMore.value = e as FetchError | Error
      } else {
        errorMore.value = new Error('An unknown error occurred during loadMoreCharacters')
      }
      console.error('Composable: Error loading more characters:', e)
    } finally {
      pendingMore.value = false
    }
  }

  function setStatusFilter(newStatus: CharacterStatus | null) {
    if (statusFilter.value !== newStatus) {
      statusFilter.value = newStatus
    } else if (newStatus === null && statusFilter.value === null) {
      loadCharacters()
    }
  }

  if (import.meta.client) {
    watch(statusFilter, (_newValue, _oldValue) => {
      loadCharacters()
    }, { immediate: false })
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
  }
} 