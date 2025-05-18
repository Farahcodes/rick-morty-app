<template>
  <div class="container mx-auto p-4">
    <UTitle class="text-3xl font-bold text-center my-8">Rick and Morty Characters</UTitle>

    <div v-if="pending && !characters.length" class="flex justify-center my-8">
      <UProgress animation="carousel" />
    </div>

    <UAlert
      v-if="error && !characters.length"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      title="Error fetching characters"
      :description="error.message || 'Could not load character data. Please try again later.'"
      class="my-8"
    />

    <div v-if="characters.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <CharacterCard
        v-for="character in characters"
        :key="character.id"
        :character="character"
      />
    </div>

    <div v-if="!pending && characters.length && paginationInfo?.next" class="flex justify-center my-8">
      <UButton @click="loadMore" :loading="pendingMore">Load More</UButton>
    </div>

     <UAlert
      v-if="errorMore"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      title="Error fetching more characters"
      :description="errorMore.message || 'Could not load more character data. Please try again later.'"
      class="my-4"
    />
  </div>
</template>

<script setup lang="ts">
// Define the Character interface according to the API response
interface Character {
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

interface Info {
  count: number
  pages: number
  next: string | null
  prev: string | null
}

interface ApiResponse {
  info: Info
  results: Character[]
}

const characters = ref<Character[]>([])
const paginationInfo = ref<Info | null>(null)
const pending = ref(true)
const error = ref<Error | null>(null)

const pendingMore = ref(false)
const errorMore = ref<Error | null>(null)

const API_BASE_URL = 'https://rickandmortyapi.com/api/character'

async function fetchCharacters(url: string = API_BASE_URL) {
  try {
    const response = await $fetch<ApiResponse>(url)
    paginationInfo.value = response.info
    return response.results
  } catch (e) {
    throw new Error(e instanceof Error ? e.message : 'Failed to fetch characters')
  }
}

async function initialLoad() {
  pending.value = true
  error.value = null
  try {
    const initialCharacters = await fetchCharacters()
    characters.value = initialCharacters
  } catch (e: any) {
    error.value = e
  } finally {
    pending.value = false
  }
}

async function loadMore() {
  if (!paginationInfo.value?.next) return

  pendingMore.value = true
  errorMore.value = null
  try {
    const moreCharacters = await fetchCharacters(paginationInfo.value.next)
    characters.value.push(...moreCharacters)
  } catch (e: any) {
    errorMore.value = e
  } finally {
    pendingMore.value = false
  }
}

// Fetch initial characters on component mount
onMounted(() => {
  initialLoad()
})

// Use a more descriptive page title
useHead({
  title: 'Characters | Rick and Morty API Viewer'
})
</script>

<style scoped>
/* Scoped styles for the homepage */
</style> 