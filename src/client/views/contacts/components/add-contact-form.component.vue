<template>
  <div class="modal" :class="{ 'is-active': opened }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <p class="title is-size-6 mb-3">Додати новий контакт</p>

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

          <div class="is-flex is-align-items-center is-justify-content-end mt-4">
            <button type="button" class="button is-small is-light" @click="cancel">
              Скасувати
            </button>

            <button
              type="submit"
              class="button is-small is-dark ml-2"
              :class="{ 'is-loading': saving }"
            >
              Зберегти
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { httpClient } from '@/services/api/httpClient'
import { contactsEndpoint } from '@/services/api/endpoint'

const emit = defineEmits(['contact-added'])

const saving = ref(false)

const fields = ref([
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
    label: `Телефон`,
    name: 'telephone',
    value: '',
    initialValue: '',
    required: true,
    type: 'tel'
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

const error = ref<string | null>(null)

async function save() {
  try {
    saving.value = true

    const data = fields.value.reduce(
      (acc, field) => {
        acc[field.name] = typeof field.value == 'string' ? field.value?.trim() : field.value
        return acc
      },
      {} as Record<string, string | boolean | undefined>
    )

    await httpClient.post({
      url: contactsEndpoint,
      payload: data
    })
    emit('contact-added')
    close()
  } catch (err: any) {
    error.value = err?.response?.data?.message ?? null
  } finally {
    saving.value = false
  }
}

function cancel() {
  close()
}

const opened = ref(false)
function open() {
  opened.value = true
}
function close() {
  opened.value = false
}

defineExpose({
  open,
  close
})
</script>
