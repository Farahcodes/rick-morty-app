<template>
  <div class="container mx-auto p-4 sm:p-6 lg:p-8">
    <div class="my-6">
      <UButton to="/" icon="i-heroicons-arrow-left-solid" variant="outline" size="sm">Back to Characters</UButton>
    </div>

    <div v-if="pending" class="flex justify-center items-center min-h-[300px]">
      <UProgress animation="carousel" size="lg" />
    </div>

    <UAlert
      v-if="error && !character"
      icon="i-heroicons-exclamation-triangle-solid"
      color="red"
      variant="soft"
      :title="errorTitle"
      :description="errorMessage"
      class="my-8 p-6"
    />

    <div v-if="character">
      <UTitle class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">{{ character.name }}</UTitle>
      <UCard :ui="{ base: 'overflow-hidden', body: { padding: 'sm:p-6' }, header: { padding: 'sm:px-6 sm:py-5' }, footer: { padding: 'sm:px-6 sm:py-5' } }">
        <div class="flex flex-col md:flex-row md:gap-8">
          <div class="md:w-1/3 mb-6 md:mb-0 flex-shrink-0">
            <NuxtImg 
              :src="character.image" 
              :alt="character.name" 
              class="rounded-xl shadow-lg w-full h-auto object-cover aspect-square"
              sizes="(max-width: 768px) 100vw, 33vw"
              loading="lazy"
            />
          </div>
          <div class="md:w-2/3 space-y-4 text-sm sm:text-base">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
              <p>
                <span class="font-semibold text-gray-800 dark:text-gray-200">Status:</span> 
                <UBadge variant="subtle" size="sm" class="ml-1.5" :color="getStatusColor">{{ character.status }}</UBadge>
              </p>
              <p><span class="font-semibold text-gray-800 dark:text-gray-200">Species:</span> {{ character.species }}</p>
              <p><span class="font-semibold text-gray-800 dark:text-gray-200">Gender:</span> {{ character.gender }}</p>
              <p v-if="character.type"><span class="font-semibold text-gray-800 dark:text-gray-200">Type:</span> {{ character.type || 'N/A' }}</p>
            </div>
            <hr class="dark:border-gray-700 my-3 sm:my-4" />
            <div>
              <p><span class="font-semibold text-gray-800 dark:text-gray-200">Origin:</span> {{ character.origin?.name }}</p>
              <p><span class="font-semibold text-gray-800 dark:text-gray-200">Last Known Location:</span> {{ character.location?.name }}</p>
            </div>
            <hr class="dark:border-gray-700 my-3 sm:my-4" />
            <p><span class="font-semibold text-gray-800 dark:text-gray-200">Created:</span> {{ new Date(character.created).toLocaleDateString() }}</p>
          </div>
        </div>
        
        <template #footer v-if="character.episode && character.episode.length > 0">
          <div class="pt-4">
            <h4 class="text-lg sm:text-xl font-semibold mb-3 text-gray-800 dark:text-gray-200">Episode Appearances ({{ character.episode.length }})</h4>
            <div class="max-h-72 overflow-y-auto space-y-2 pr-3 text-sm sm:text-base">
              <ul class="list-disc list-inside text-gray-700 dark:text-gray-300">
                <li v-for="(episodeUrl, index) in character.episode" :key="index" class="hover:text-primary-500 dark:hover:text-primary-400">
                  Episode {{ episodeUrl.split('/').pop() }}
                  <!-- Potential future enhancement: Link to episode details if API supports -->
                </li>
              </ul>
            </div>
          </div>
        </template>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { getStatusColor as getStatusColorHelper } from '~/utils/status'

// Interface for Character details based on API response
interface Character {
  id: number;
  name: string;
  status: 'Alive' | 'Dead' | 'unknown';
  species: string;
  type: string;
  gender: string;
  origin: { name: string; url: string };
  location: { name: string; url: string };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

const route = useRoute()
const characterId = computed(() => route.params.id as string)

const character = ref<Character | null>(null)
const pending = ref(true)
const error = ref<any>(null) // Can be FetchError or other error types

const fetchCharacterDetails = async () => {
  pending.value = true
  error.value = null
  // Do not set character.value to null here if you want to show stale data while loading new ID
  // character.value = null 
  try {
    // Ensure we use the latest characterId value if it changes
    const currentId = characterId.value;
    const data = await $fetch<Character>(`https://rickandmortyapi.com/api/character/${currentId}`)
    if (characterId.value === currentId) { // check if the id is still the same after await
        character.value = data
    }
  } catch (e: any) {
    if (characterId.value === (e.response?._data?.id?.toString() || route.params.id as string) || !character.value) {
      error.value = e
      character.value = null // Clear character on error for the current ID
    }
    // console.error("Failed to fetch character details:", e);
  } finally {
     if (characterId.value === (character.value?.id.toString() || route.params.id as string) || error.value ){
        pending.value = false
     }
  }
}

const getStatusBadgeClass = computed(() => {
  if (!character.value) return 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-600/10'
  switch (character.value.status) {
    case 'Alive': return 'bg-green-50 text-green-600 ring-1 ring-inset ring-green-600/10'
    case 'Dead': return 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10'
    default: return 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-600/10'
  }
})

const getStatusColor = computed(() => {
  return getStatusColorHelper(character.value?.status || null)
})

const errorTitle = computed(() => {
  const id = characterId.value;
  if (error.value?.data?.error === 'Character not found' || error.value?.statusCode === 404) {
    return `Character with ID ${id} Not Found`
  }
  return 'Error Fetching Character'
})

const errorMessage = computed(() => {
  const id = characterId.value;
  if (error.value?.data?.error === 'Character not found' || error.value?.statusCode === 404) {
    return `The character you are looking for (ID: ${id}) does not exist. Please check the ID or go back to the character list.`
  }
  return error.value?.message || 'Could not load character details. Please try again later.'
})

// Fetch character details when the component is mounted
onMounted(fetchCharacterDetails)

// And when the characterId computed property changes
watch(characterId, (newId, oldId) => {
  if (newId !== oldId) {
    character.value = null; // Clear previous character data for a cleaner loading state
    fetchCharacterDetails();
  }
});

// Update page title dynamically
useHead(() => ({
  title: character.value ? `${character.value.name} | Character Details` : (pending.value ? 'Loading Character...' : (error.value ? 'Error' : 'Character Details'))
}))

</script>

<style scoped>
/* Add any page-specific styles here */
.max-h-72 {
  max-height: 18rem; /* 288px */
}

/* Styling for a better scrollbar (optional, browser-dependent) */
.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
  border-radius: 4px;
}
.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.2);
}
</style>