<template>
  <div class="mb-6 status-filter-buttons">
    <UFormGroup label="Filter by status" name="status-filter">
      <div class="flex flex-wrap gap-2">
        <UButton
          v-for="s in statuses"
          :key="s.value"
          :variant="isStatusActive(s.value) ? 'solid' : 'outline'"
          :class="getButtonClass(s)"
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

// Method to get appropriate CSS classes for button based on status
function getButtonClass(status: typeof statuses[number]) {
  const isActive = isStatusActive(status.value);
  const baseClasses = 'focus:outline-none focus:ring-2';
  
  switch(status.color) {
    case 'green':
      return isActive 
        ? 'bg-green-500 text-white hover:bg-green-600 focus:ring-green-300'
        : 'border border-green-500 text-green-500 hover:bg-green-50 focus:ring-green-200';
    case 'red':
      return isActive
        ? 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-300'
        : 'border border-red-500 text-red-500 hover:bg-red-50 focus:ring-red-200';
    case 'gray':
    default:
      return isActive
        ? 'bg-gray-500 text-white hover:bg-gray-600 focus:ring-gray-300'
        : 'border border-gray-500 text-gray-500 hover:bg-gray-50 focus:ring-gray-200';
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