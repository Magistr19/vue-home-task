<template>
  <div class="contact-listing">
    <RouterLink
      v-for="contact in parsedContacts"
      :key="contact.id"
      :to="{
        name: RouteName.Contact,
        params: { id: contact.id }
      }"
      class="box"
    >
      <p class="has-text-weight-bold">
        {{
          `${contact.personalization.name.firstname} ${contact.personalization.name.lastname}${
            contact.personalization.name.middlename
              ? ' ' + contact.personalization.name.middlename
              : ''
          }`
        }}
      </p>

      <p>{{ contact.telephone }}</p>

      <p class="is-italic">{{ contact.email }}</p>

      <p v-if="contact.employeeId" class="is-size-7 has-text-weight-medium has-text-grey">
        Співробітник підприємства
      </p>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/router'
import { useContacts } from '@/store/contacts'
import { storeToRefs } from 'pinia'

const contactsStore = useContacts()
const { parsedContacts } = storeToRefs(contactsStore)
</script>

<style>
.contact-listing {
  display: grid;
  gap: 16px;
}
</style>
