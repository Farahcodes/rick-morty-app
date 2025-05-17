<template>
  <UCard :ui="{ body: { padding: 'px-4 py-5 sm:p-6' }, header: { padding: 'px-4 py-4 sm:px-6' }, footer: { padding: 'px-4 py-4 sm:px-6' } }">
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
        <NuxtImg
          :src="character.image"
          :alt="character.name"
          class="w-full h-auto aspect-square object-cover rounded-lg shadow-md"
          sizes="100vw sm:33vw md:25vw"
          loading="lazy"
        />
      </div>
      <div class="flex-1 space-y-1.5 text-sm">
        <p>
          <span class="font-medium text-gray-700 dark:text-gray-300">Status:</span>
          <UBadge :color="statusColor" variant="subtle" size="xs" class="ml-1">{{ character.status }}</UBadge>
        </p>
        <p><span class="font-medium text-gray-700 dark:text-gray-300">Species:</span> {{ character.species }}</p>
        <p><span class="font-medium text-gray-700 dark:text-gray-300">Gender:</span> {{ character.gender }}</p>
        <p v-if="character.type"><span class="font-medium text-gray-700 dark:text-gray-300">Type:</span> {{ character.type }}</p>
        <p><span class="font-medium text-gray-700 dark:text-gray-300">Origin:</span> {{ character.origin?.name }}</p>
        <p class="truncate" :title="character.location?.name"><span class="font-medium text-gray-700 dark:text-gray-300">Location:</span> {{ character.location?.name }}</p>
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

const statusColor = computed(() => {
  switch (props.character.status) {
    case 'Alive':
      return 'green'
    case 'Dead':
      return 'red'
    default:
      return 'primary' // Using a Nuxt UI primary color for unknown
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