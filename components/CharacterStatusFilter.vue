<template>
  <div class="mb-6">
    <UFormGroup label="Filter by status" name="status-filter">
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="s in statuses"
          :key="s.value"
          :variant="isStatusActive(s.value) ? 'solid' : 'outline'"
          :color="s.color"
          size="sm"
          @click="selectStatus(s.value)"
        >
          <span>{{ s.label }}</span>
          <span v-if="isStatusActive(s.value)" class="ml-1">✓</span>
        </UButton>
        <UButton
          variant="outline"
          color="gray"
          size="sm"
          @click="clearFilter"
          v-if="statusFilter !== null"
        >
          Clear Filter
        </UButton>
      </div>
    </UFormGroup>
  </div>
</template>

<script setup lang="ts">
// Get the composable functions and shared state
const { statusFilter, setStatusFilter } = useCharacters()

// Status options with colors matching the character card
const statuses = [
  { value: 'Alive', label: 'Alive', color: 'green' },
  { value: 'Dead', label: 'Dead', color: 'red' },
  { value: 'unknown', label: 'Unknown', color: 'gray' }
] as const; // Use const assertion for stricter type on s.value

// Helper function to check if a status is active
function isStatusActive(statusValue: 'Alive' | 'Dead' | 'unknown'): boolean {
  return statusFilter.value === statusValue;
}

// Method to select a status
function selectStatus(selected: 'Alive' | 'Dead' | 'unknown') {
  if (statusFilter.value === selected) {
    setStatusFilter(null);
  } else {
    setStatusFilter(selected);
  }
}

// Method to clear the filter
function clearFilter() {
  setStatusFilter(null);
}
</script>