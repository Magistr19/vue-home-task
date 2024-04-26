<template>
  <section class="section">
    <div class="container">
      <h1 class="title is-size-4">Список контактів</h1>

      <ContactNavigation @open-added-form="openAddForm" />

      <template v-if="parsedContacts.length">
        <ContactListing />

        <AppPagination
          :load="loadContacts"
          :parsedPagination="parsedPagination"
          :getNextPageSize="getNextPageSize"
          :getPagesToShow="getPagesToShow"
        />
      </template>
    </div>
  </section>

  <AddContactForm ref="addFormComponent" @contact-added="load" />
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import AddContactForm from '@/views/contacts/components/add-contact-form.component.vue'
import { useContacts } from '@/store/contacts'
import { storeToRefs } from 'pinia'
import AppPagination from '@/components/app-pagination.component.vue'
import ContactListing from '@/views/contacts/components/contact-listing.component.vue'
import ContactNavigation from '@/views/contacts/components/contact-navigation.component.vue'
import { useRoute } from 'vue-router'
import { router } from '@/router'

const contactsStore = useContacts()
const { parsedContacts, parsedPagination, getNextPageSize, getPagesToShow } =
  storeToRefs(contactsStore)
const { loadContacts } = contactsStore

const route = useRoute()

onMounted(async () => {
  let sort: null | {
    criterion: number
    direction: number
  } = null

  if (route.query.criterion && route.query.direction) {
    sort = {
      criterion: Number(route.query.criterion),
      direction: Number(route.query.direction)
    }
  }

  await loadContacts({
    fromPageNumber: Number(route.query.fromPageNumber) || 1,
    toPageNumber: Number(route.query.toPageNumber) || 1,
    ...(sort ? { sorting: sort } : {}),
    ...(route.query.isEmployee ? { isEmployee: Boolean(route.query.isEmployee) } : {})
  })
})

const addFormComponent = ref()

const openAddForm = () => {
  addFormComponent.value?.open()
}

const load = async () => {
  router.push({
    query: {
      fromPageNumber: 1,
      toPageNumber: 1
    }
  })

  await loadContacts({ fromPageNumber: 1, toPageNumber: 1 })
}
</script>
