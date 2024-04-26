<template>
  <div class="app-pagination py-6">
    <div class="is-flex is-justify-content-center mb-4">
      <button
        :disabled="getNextPageSize === 0"
        type="button"
        class="button"
        :class="{ 'is-loading': loadingMore }"
        @click="loadMore"
      >
        Показати ще {{ getNextPageSize }}
      </button>
    </div>

    <div class="is-flex is-justify-content-center">
      <button
        :disabled="parsedPagination.toPageNumber === 1"
        type="button"
        class="button mx-2"
        @click="loadPage({ fromPageNumber: 1, toPageNumber: 1 })"
      >
        &lt;&lt;
      </button>
      <button
        :disabled="parsedPagination.toPageNumber === 1"
        type="button"
        class="button mx-2"
        @click="
          loadPage({
            fromPageNumber: parsedPagination.fromPageNumber - 1,
            toPageNumber: parsedPagination.fromPageNumber - 1
          })
        "
      >
        &lt;
      </button>
      <button
        v-for="pageNumber in getPagesToShow"
        :key="pageNumber"
        type="button"
        class="button mx-2"
        :class="{
          'is-dark':
            pageNumber <= parsedPagination.toPageNumber &&
            pageNumber >= parsedPagination.fromPageNumber
        }"
        @click="
          loadPage({
            fromPageNumber: pageNumber,
            toPageNumber: pageNumber
          })
        "
      >
        {{ pageNumber }}
      </button>

      <button
        :disabled="getNextPageSize === 0"
        type="button"
        class="button mx-2"
        @click="
          loadPage({
            fromPageNumber: parsedPagination.fromPageNumber + 1,
            toPageNumber: parsedPagination.fromPageNumber + 1
          })
        "
      >
        &gt;
      </button>
      <button
        :disabled="getNextPageSize === 0"
        type="button"
        class="button mx-2"
        @click="
          loadPage({
            fromPageNumber: parsedPagination.last || 1,
            toPageNumber: parsedPagination.last || 1
          })
        "
      >
        &gt;&gt;
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { AppPagination } from '@/models/contact.model'
import { router } from '@/router'
import { ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const props = defineProps<{
  load: (queryIncoming: AppPagination) => Promise<void>
  parsedPagination: AppPagination
  getNextPageSize: number
  getPagesToShow: number[]
}>()

let loadingMore = ref(false)

const loadPage = async (query: AppPagination): Promise<void> => {
  router.push({
    query: {
      fromPageNumber: query.fromPageNumber,
      toPageNumber: query.toPageNumber,
      ...(route.query.isEmployee ? { isEmployee: route.query.isEmployee } : {}),
      ...(route.query.criterion ? { criterion: route.query.criterion } : {}),
      ...(route.query.direction ? { direction: route.query.direction } : {})
    }
  })

  await props.load({
    fromPageNumber: query.fromPageNumber,
    toPageNumber: query.toPageNumber
  })
}

const loadMore = async () => {
  loadingMore.value = true
  await loadPage({
    fromPageNumber: props.parsedPagination.fromPageNumber,
    toPageNumber: props.parsedPagination.toPageNumber + 1
  })
  loadingMore.value = false
}
</script>
