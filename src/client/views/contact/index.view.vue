<template>
  <AppLoadingScreen v-if="!parsedContact?.id" />

  <section v-else class="section">
    <div class="container">
      <h1 class="title is-size-5">
        {{
          `${parsedContact.personalization.name.firstname} ${parsedContact.personalization.name.lastname}${
            parsedContact.personalization.name.middlename
              ? ' ' + parsedContact.personalization.name.middlename
              : ''
          }`
        }}
      </h1>
      <p>
        <span class="has-text-grey">Телефон:</span>
        {{ parsedContact.telephone }}
      </p>
      <p>
        <span class="has-text-grey">E-mail:</span>
        {{ parsedContact.email }}
      </p>
      <p>
        <span class="has-text-grey">Є співробітником:</span>
        {{ parsedContact.employeeId ? 'Так' : 'Ні' }}
      </p>

      <div class="is-flex is-align-items-center is-flex-wrap-wrap mt-6">
        <button
          :disabled="!!parsedContact.employeeId"
          type="button"
          class="button is-small is-outlined"
          @click="activateEmployment"
          :class="{ 'is-loading': activatingEmployment }"
        >
          Розпочати співпрацю
        </button>

        <button
          :disabled="!parsedContact.employeeId"
          type="button"
          class="button is-small is-outlined ml-3"
          :class="{ 'is-loading': deactivatingEmployment }"
          @click="deactivateEmployment"
        >
          Припинити співпрацю
        </button>
      </div>

      <div v-if="!isEditFormOpened" class="is-flex is-align-items-center is-flex-wrap-wrap mt-2">
        <button type="button" class="button is-small is-light" @click="isDeletionRequested = true">
          Видалити контакт
        </button>

        <button type="button" class="button is-small is-dark ml-3" @click="isEditFormOpened = true">
          Редагувати контакт
        </button>
      </div>

      <div class="modal confirmation-modal" :class="{ 'is-active': isDeletionRequested }">
        <div class="modal-background"></div>
        <div class="modal-content">
          <div class="box">
            <p class="has-text-weight-medium mb-1">Ви дійсно бажаєте видалити даний контакт?</p>
            <p>Контакт не буде доступним в списку після видалення.</p>

            <div class="is-flex is-align-items-center is-justify-content-end mt-4">
              <button
                type="button"
                class="button is-small is-light"
                :class="{ 'is-loading': deleting }"
                @click="deleteContact"
              >
                Так, видалити контакт
              </button>

              <button
                type="button"
                class="button is-small is-dark ml-2"
                @click="isDeletionRequested = false"
              >
                Ні, скасувати
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="isEditFormOpened" class="box mt-6">
        <p class="title is-size-6">Редагувати контакт:</p>
        <form class="form" @submit.prevent="save">
          <div v-for="(field, index) in fields" :key="index" class="field">
            <label :for="field.name" class="label is-size-7">
              {{ field.label + (field.required ? ' *' : '') }}
            </label>

            <div class="control">
              <input
                :type="field.type"
                :id="field.name"
                class="input is-small"
                v-model="field.value"
                :disabled="saving"
                :required="field.required"
              />
            </div>
          </div>

          <div v-if="error" class="field box has-background-danger-light">
            <p class="help is-danger">
              {{ error }}
            </p>
          </div>

          <div class="field is-grouped mt-5">
            <div class="control">
              <button type="button" class="button is-small is-light" @click="cancelEditing">
                Скасувати
              </button>
            </div>
            <div class="control">
              <button
                type="submit"
                class="button is-small is-dark"
                :class="{ 'is-loading': saving }"
              >
                Зберегти
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import AppLoadingScreen from '@/components/app-loading-screen.component.vue'
import { RouteName } from '@/router'
import { useRouter } from 'vue-router'
import { useContacts } from '@/store/contacts'
import { storeToRefs } from 'pinia'
import { httpClient } from '@/services/api/httpClient'
import {
  contactActivateEmploymentEndpoint,
  contactDeActivateEmploymentEndpoint,
  contactsEndpoint
} from '@/services/api/endpoint'

const route = useRoute()
const router = useRouter()

const contactsStore = useContacts()
const { parsedContact } = storeToRefs(contactsStore)
const { loadContactById, resetContact } = contactsStore

const isEditFormOpened = ref(false)
const saving = ref(false)

let fields = ref([
  {
    label: `Ім'я`,
    name: 'firstname',
    value: '',
    initialValue: '',
    required: true,
    type: 'text'
  },
  {
    label: `Прізвище`,
    name: 'lastname',
    value: '',
    initialValue: '',
    required: true,
    type: 'text'
  },
  {
    label: `По-батькові`,
    name: 'middlename',
    value: '',
    initialValue: '',
    required: false,
    type: 'text'
  },
  {
    label: `E-mail`,
    name: 'email',
    value: '',
    initialValue: '',
    required: false,
    type: 'email'
  }
])
let error = ref<string | null>(null)

const cancelEditing = () => {
  fields.value.forEach((field) => (field.value = field.initialValue))
  isEditFormOpened.value = false
  error.value = null
}

onMounted(async () => {
  await loadContactById(route.params.id as string)

  fields.value[0].value = fields.value[0].initialValue =
    parsedContact.value.personalization.name.firstname
  fields.value[1].value = fields.value[1].initialValue =
    parsedContact.value.personalization.name.lastname
  fields.value[2].value = fields.value[2].initialValue =
    parsedContact.value.personalization.name.middlename || ''
  fields.value[3].value = fields.value[3].initialValue = parsedContact.value?.email || ''
})

onUnmounted(() => {
  resetContact()
})

const save = async () => {
  error.value = null
  saving.value = true

  const data = fields.value.reduce(
    (acc, field) => {
      acc[field.name] = field.value?.trim()
      return acc
    },
    {} as Record<string, string | undefined>
  )

  try {
    await httpClient.put({
      url: contactsEndpoint + route.params.id,
      payload: data
    })
    loadContactById(route.params.id as string)
    isEditFormOpened.value = false
  } catch (err: any) {
    error.value = err?.response?.data?.localizedMessage ?? null
  } finally {
    saving.value = false
  }
}

const isDeletionRequested = ref(false)
const deleting = ref(false)

const deleteContact = async () => {
  deleting.value = true

  try {
    await httpClient.delete({
      url: contactsEndpoint + route.params.id
    })
    router.push({ name: RouteName.Contacts })
  } catch (err: any) {
    error.value = err?.response?.data?.localizedMessage ?? null
  } finally {
    deleting.value = false
    isDeletionRequested.value = false
  }
}

const activatingEmployment = ref(false)
const activateEmployment = async () => {
  activatingEmployment.value = true

  activatingEmployment.value = false

  try {
    await httpClient.post({
      url: contactActivateEmploymentEndpoint,
      payload: {
        id: route.params.id
      }
    })
    loadContactById(route.params.id as string)
  } catch (err: any) {
    error.value = err?.response?.data?.localizedMessage ?? null
  } finally {
    activatingEmployment.value = false
  }
}

const deactivatingEmployment = ref(false)
const deactivateEmployment = async () => {
  deactivatingEmployment.value = true

  try {
    await httpClient.post({
      url: contactDeActivateEmploymentEndpoint,
      payload: {
        id: route.params.id
      }
    })
    loadContactById(route.params.id as string)
  } catch (err: any) {
    error.value = err?.response?.data?.localizedMessage ?? null
  } finally {
    deactivatingEmployment.value = false
  }
}
</script>

<style>
.confirmation-modal .modal-content {
  max-inline-size: 420px;
}
</style>
