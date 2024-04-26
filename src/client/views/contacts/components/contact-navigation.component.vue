<template>
  <div class="toolbar box">
    <div class="select is-small">
      <select v-model="selectedSortOption" @update:model-value="sort">
        <option
          v-for="option in sortOptions"
          :value="option.id"
          :disabled="option.id === selectedSortOption"
          :key="option.id"
        >
          {{ option.title }}
        </option>
      </select>
    </div>

    <label class="checkbox">
      <input
        type="checkbox"
        v-model="isFilteredByEmployment"
        @update:model-value="filterByEmployment"
      />
      Показати тільки співробітників
    </label>

    <button type="button" class="add-contact-button button is-small is-dark" @click="openAddForm">
      Додати контакт
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useContacts } from '@/store/contacts'
import { sortOptions } from '@/consts/sortOptions'
import { router } from '@/router'
import { useRoute } from 'vue-router'

const emit = defineEmits(['open-added-form'])
const route = useRoute()

const contactsStore = useContacts()
const { loadContacts } = contactsStore

const getSortOptionByQuery = (): number => {
  if (typeof route.query.criterion === 'string' && typeof route.query.direction === 'string') {
    return (
      sortOptions.find(
        (option) =>
          option?.value?.criterion === Number(route.query.direction) &&
          option?.value?.direction === Number(route.query.direction)
      )?.id || 1
    )
  }

  return 1
}

const sortOptionsMap = new Map(sortOptions.map((option) => [option.id, option]))
const selectedSortOption = ref(getSortOptionByQuery())

const isFilteredByEmployment = ref(Boolean(route.query.isEmployee))

const sort = async (selectedOption: number): Promise<void> => {
  router.push({
    query: {
      fromPageNumber: 1,
      toPageNumber: 1,
      criterion: sortOptionsMap.get(selectedOption)?.value?.criterion,
      direction: sortOptionsMap.get(selectedOption)?.value?.direction,
      isEmployee: Number(isFilteredByEmployment.value)
    }
  })

  await loadContacts({
    fromPageNumber: 1,
    toPageNumber: 1,
    sorting: sortOptionsMap.get(selectedOption)?.value,
    isEmployee: isFilteredByEmployment.value
  })
}

const filterByEmployment = async (isEmployee: boolean): Promise<void> => {
  router.push({
    query: {
      fromPageNumber: 1,
      toPageNumber: 1,
      criterion: sortOptionsMap.get(selectedSortOption.value)?.value?.criterion,
      direction: sortOptionsMap.get(selectedSortOption.value)?.value?.criterion,
      isEmployee: Number(isEmployee)
    }
  })

  await loadContacts({
    fromPageNumber: 1,
    toPageNumber: 1,
    sorting: sortOptionsMap.get(selectedSortOption.value)?.value,
    isEmployee
  })
}

const openAddForm = (): void => {
  emit('open-added-form')
}
</script>

<style>
.toolbar {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}
.add-contact-button {
  margin-inline-start: auto;
}
@media only screen and (max-width: 768px) {
  .add-contact-button {
    flex: 1 1 100%;
  }
}
</style>
