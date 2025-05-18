<template>
  <div class="container mx-auto p-4">
    <UTitle class="text-3xl font-bold text-center mb-12">Rick and Morty Characters</UTitle>

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
      <UButton @click="loadMoreCharacters" :loading="pendingMore">Load More</UButton>
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
// Use our character composable
const {
  characters,
  paginationInfo,
  pending,
  error,
  pendingMore,
  errorMore,
  loadCharacters,
  loadMoreCharacters
} = useCharacters()

// Fetch initial characters on component mount
onMounted(() => {
  loadCharacters()
})

// Use a more descriptive page title
useHead({
  title: 'Characters | Rick and Morty API Viewer'
})
</script>

<style scoped>
/* Scoped styles for the homepage */
</style> 