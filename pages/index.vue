<template>
  <div class="container mx-auto p-4">
    <UTitle class="text-3xl font-bold text-center mb-12">Rick and Morty Characters</UTitle>

    <!-- Filter Component -->
    <CharacterStatusFilter />

    <div class="flex gap-2 my-8">
      <UBadge label="Lova le BG in solid" color="lovasoa" />
      <UBadge label="Lova le BG in subtle" color="lovasoa" variant="subtle" />
      <UBadge label="Lova le BG in outline" color="lovasoa" variant="outline" />
      <UBadge label="Lova le BG in ghost" color="lovasoa" variant="soft" />
    </div>

    <!-- Display Active Filter -->
    <div v-if="statusFilter" class="text-center mb-4">
      <UBadge class="text-sm" :class="getStatusBadgeClass(statusFilter)">
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

// Use our character composable
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

// Fetch initial characters on component mount
onMounted(() => {
  if (characters.value.length === 0) {
    loadCharacters(true); // Pass true for isInitialLoad
  }
})

function getStatusBadgeClass(status: string | null): string {
  if (!status) return 'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-600/10'; // Default styling
  switch (status) {
    case 'Alive': return 'bg-green-50 text-green-600 ring-1 ring-inset ring-green-600/10';
    case 'Dead': return 'bg-red-50 text-red-600 ring-1 ring-inset ring-red-600/10';
    case 'unknown': return 'bg-gray-50 text-gray-600 ring-1 ring-inset ring-gray-600/10';
    default: return 'bg-blue-50 text-blue-600 ring-1 ring-inset ring-blue-600/10';
  }
}

function resetFilter() {
  setStatusFilter(null);
}

// Set a descriptive page title
useHead({
  title: 'Characters | Rick and Morty API Viewer'
})
</script>

<style scoped>
/* Scoped styles for the homepage */
</style> 