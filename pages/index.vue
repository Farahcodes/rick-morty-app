<template>
  <div class="container mx-auto p-4">
    <UTitle class="text-3xl font-bold text-center mb-12">Rick and Morty Characters</UTitle>

    <!-- Filter Component -->
    <CharacterStatusFilter />

    <!-- Display Active Filter -->
    <div v-if="statusFilter" class="text-center mb-4">
      <UBadge class="text-sm" :color="getStatusColor(statusFilter)" variant="subtle">
        Filtered by status: {{ statusFilter }}
      </UBadge>
    </div>

    <!-- Loading Indicator -->
    <div v-if="pending" class="flex justify-center my-8">
      <UProgress animation="carousel" />
    </div>

    <!-- Initial Load Error -->
    <UAlert
      v-if="error && !characters.length && !pending"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      title="Error fetching characters"
      :description="error.message || 'Could not load character data. Please try again later.'"
      class="my-8"
    />

    <!-- Character Grid -->
    <div v-if="!pending && characters.length" class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <CharacterCard
        v-for="character in characters"
        :key="character.id" 
        :character="character"
      />
    </div>

    <!-- Load More Button -->
    <div v-if="!pending && characters.length && paginationInfo?.next" class="flex justify-center my-8">
      <UButton @click="loadMoreCharacters" :loading="pendingMore">Load More</UButton>
    </div>

    <!-- Load More Error -->
    <UAlert
      v-if="errorMore"
      icon="i-heroicons-exclamation-triangle"
      color="red"
      variant="soft"
      title="Error fetching more characters"
      :description="errorMore.message || 'Could not load more character data. Please try again later.'"
      class="my-4"
    />

    <!-- No Results Message -->
    <div v-if="!pending && characters.length === 0 && !error" class="text-center my-8">
      <p>No characters found with the selected filter.</p>
      <UButton @click="resetFilter" class="mt-4">Reset Filter</UButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { getStatusColor } from '~/utils/status'

const {
  characters,
  paginationInfo,
  pending,
  error,
  pendingMore,
  errorMore,
  statusFilter,
  loadCharacters,
  loadMoreCharacters,
  setStatusFilter
} = useCharacters()

onMounted(() => {
  if (characters.value.length === 0) {
    loadCharacters(true);
  }
})

function resetFilter() {
  setStatusFilter(null);
}

useHead({
  title: 'Characters | Rick and Morty API Viewer'
})
</script>

<style scoped>
/* Scoped styles for the homepage */
</style> 