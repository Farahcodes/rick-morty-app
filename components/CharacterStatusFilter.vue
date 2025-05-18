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
import { getStatusColor } from '~/utils/status'
import type { CharacterStatus } from '~/types/status'

const { statusFilter, setStatusFilter } = useCharacters()

// Status options with labels
const statuses = [
  { value: 'Alive' as CharacterStatus, label: 'Alive' },
  { value: 'Dead' as CharacterStatus, label: 'Dead' },
  { value: 'unknown' as CharacterStatus, label: 'Unknown' }
];

// Helper function to check if a status is active
function isStatusActive(statusValue: CharacterStatus): boolean {
  return statusFilter.value === statusValue;
}

// Method to select a status
function selectStatus(selected: CharacterStatus) {
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