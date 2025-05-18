<template>
  <div class="mb-6 status-filter-buttons">
    <UFormGroup label="Filter by status" name="status-filter">
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="s in statuses"
          :key="s.value"
          :variant="isStatusActive(s.value) ? 'solid' : 'outline'"
          :color="getStatusColor(s.value)"
          size="sm"
          @click="selectStatus(s.value)"
        >
          <span>{{ s.label }}</span>
          <span v-if="isStatusActive(s.value)" class="ml-1">✓</span>
        </UButton>
        <UButton
          variant="outline"
          color="neutral"
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

// Status options with labels
const statuses = [
  { value: 'Alive', label: 'Alive' },
  { value: 'Dead', label: 'Dead' },
  { value: 'unknown', label: 'Unknown' }
] as const; // Use const assertion for stricter type on s.value

// Helper function to check if a status is active
function isStatusActive(statusValue: 'Alive' | 'Dead' | 'unknown'): boolean {
  return statusFilter.value === statusValue;
}

// Method to get semantic color based on status
function getStatusColor(status: 'Alive' | 'Dead' | 'unknown') {
  switch (status) {
    case 'Alive':
      return 'success'
    case 'Dead':
      return 'error'
    default:
      return 'lovasoa'
  }
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