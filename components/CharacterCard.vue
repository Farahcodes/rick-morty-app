<template>
  <UCard
    :ui="{ body: { padding: 'px-4 py-5 sm:p-6' }, header: { padding: 'px-4 py-4 sm:px-6' }, footer: { padding: 'px-4 py-4 sm:px-6' } }">
    <template #header>
      <div class="flex justify-between items-center">
        <h3 class="text-base sm:text-lg font-semibold truncate" :title="character.name">{{ character.name }}</h3>
        <NuxtLink :to="`/character/${character.id}`" class="flex-shrink-0">
          <UButton variant="link" icon="i-heroicons-arrow-right-circle" size="sm">Details</UButton>
        </NuxtLink>
      </div>
    </template>

    <div class="flex flex-col sm:flex-row gap-4 sm:gap-6">
      <div class="w-full sm:w-1/3 flex-shrink-0">
        <NuxtImg :src="character.image" :alt="character.name"
          class="w-full h-auto aspect-square object-cover rounded-lg shadow-md" sizes="100vw sm:33vw md:25vw"
          loading="lazy" />
      </div>
      <div class="flex-1 space-y-1.5 text-sm overflow-hidden">
        <p>
          <span class="font-medium text-gray-700 dark:text-gray-300">Status:</span>
          <UBadge variant="subtle" size="xs" class="ml-1" :color="getStatusBadgeColor">{{ character.status
            }}
          </UBadge>
        </p>
        <p class="flex">
          <span class="font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">Species:</span>
          <span class="truncate ml-1" :title="character.species">{{ character.species }}</span>
        </p>
        <p class="flex">
          <span class="font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">Gender:</span>
          <span class="truncate ml-1" :title="character.gender">{{ character.gender }}</span>
        </p>
        <p v-if="character.type" class="flex">
          <span class="font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">Type:</span>
          <span class="truncate ml-1" :title="character.type">{{ character.type }}</span>
        </p>
        <p class="flex">
          <span class="font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">Origin:</span>
          <span class="truncate ml-1" :title="character.origin?.name">{{ character.origin?.name }}</span>
        </p>
        <p class="flex">
          <span class="font-medium text-gray-700 dark:text-gray-300 flex-shrink-0">Location:</span>
          <span class="truncate ml-1" :title="character.location?.name">{{ character.location?.name }}</span>
        </p>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { PropType } from 'vue'

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

const props = defineProps({
  character: {
    type: Object as PropType<Character>,
    required: true
  }
})

const getStatusBadgeColor = computed(() => {
  switch (props.character.status) {
    case 'Alive':
      return 'success'
    case 'Dead':
      return 'error'
    default:
      return 'lovasoa'
  }
})
</script>

<style scoped>
/* Component-specific styles can go here if Tailwind/NuxtUI isn't enough */
.truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>