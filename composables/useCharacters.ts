import type { Character, PaginationInfo } from '~/types/api'
import { fetchCharacters } from '~/utils/api'

export function useCharacters() {
  const characters = ref<Character[]>([])
  const paginationInfo = ref<PaginationInfo | null>(null)
  const pending = ref(true)
  const error = ref<Error | null>(null)

  const pendingMore = ref(false)
  const errorMore = ref<Error | null>(null)

  async function loadCharacters() {
    pending.value = true
    error.value = null
    
    try {
      const { results, pagination } = await fetchCharacters()
      characters.value = results
      paginationInfo.value = pagination
    } catch (e: any) {
      error.value = e
    } finally {
      pending.value = false
    }
  }

  async function loadMoreCharacters() {
    if (!paginationInfo.value?.next) return

    pendingMore.value = true
    errorMore.value = null
    
    try {
      const { results, pagination } = await fetchCharacters(paginationInfo.value.next)
      characters.value.push(...results)
      paginationInfo.value = pagination
    } catch (e: any) {
      errorMore.value = e
    } finally {
      pendingMore.value = false
    }
  }

  return {
    characters,
    paginationInfo,
    pending,
    error,
    pendingMore,
    errorMore,
    loadCharacters,
    loadMoreCharacters,
  }
} 