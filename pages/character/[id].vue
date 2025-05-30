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
      color="error"
      variant="soft"
      :title="errorTitle"
      :description="errorMessage"
      class="my-8 p-6"
    />

    <div v-if="character">
      <UTitle class="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-6 sm:mb-8">{{ character.name }}</UTitle>
      <UCard :ui="{
        root: 'overflow-hidden',
        header: 'p-4 sm:px-6 sm:py-5',
        body: 'p-4 sm:p-6',
        footer: 'p-4 sm:px-6 sm:py-5'
      }">
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
import type { Character } from '~/types/api'
import type { FetchError } from 'ofetch'

const route = useRoute()
const characterId = computed(() => route.params.id as string)

const character = ref<Character | null>(null)
const pending = ref(true)
const error = ref<FetchError | Error | null>(null)

const fetchCharacterDetails = async () => {
  pending.value = true
  error.value = null
  try {
    const currentId = characterId.value;
    const data = await $fetch<Character>(`https://rickandmortyapi.com/api/character/${currentId}`)
    if (characterId.value === currentId) {
        character.value = data
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      if ('response' in e && (e as FetchError).response?._data) {
        const fetchError = e as FetchError;
        if (characterId.value === (fetchError.response?._data?.id?.toString() || route.params.id as string) || !character.value) {
          error.value = fetchError;
          character.value = null;
        }
      } else {
        error.value = e;
        character.value = null;
      }
    } else {
      error.value = new Error('An unknown error occurred');
      character.value = null;
    }
  } finally {
     if (characterId.value === (character.value?.id.toString() || route.params.id as string) || error.value ){
        pending.value = false
     }
  }
}

const getStatusColor = computed(() => {
  return getStatusColorHelper(character.value?.status || null)
})

const errorTitle = computed(() => {
  const id = characterId.value;
  if (error.value && 'data' in error.value && (error.value as FetchError).data?.error === 'Character not found') {
    return `Character with ID ${id} Not Found`
  }
  if (error.value && 'statusCode' in error.value && (error.value as FetchError).statusCode === 404) {
    return `Character with ID ${id} Not Found`
  }
  return 'Error Fetching Character'
})

const errorMessage = computed(() => {
  const id = characterId.value;
  if (error.value && 'data' in error.value && (error.value as FetchError).data?.error === 'Character not found') {
    return `The character you are looking for (ID: ${id}) does not exist. Please check the ID or go back to the character list.`
  }
  if (error.value && 'statusCode' in error.value && (error.value as FetchError).statusCode === 404) {
    return `The character you are looking for (ID: ${id}) does not exist. Please check the ID or go back to the character list.`
  }
  return error.value?.message || 'Could not load character details. Please try again later.'
})

onMounted(fetchCharacterDetails)

watch(characterId, (newId, oldId) => {
  if (newId !== oldId) {
    character.value = null;
    fetchCharacterDetails();
  }
});

useHead(() => ({
  title: character.value ? `${character.value.name} | Character Details` : (pending.value ? 'Loading Character...' : (error.value ? 'Error' : 'Character Details'))
}))
</script>

<style scoped>
.max-h-72 {
  max-height: 18rem;
}

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