<template>
  <div class="app-header">
    <div class="container">
      <RouterLink :to="{ name: RouteName.Home }" class="app-logo has-text-dark is-size-5">
        ContactApp
      </RouterLink>

      <RouterLink :to="RouteName.Contacts" class="button is-small is-dark">
        До списку контактів
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouteName } from '@/router'
</script>
