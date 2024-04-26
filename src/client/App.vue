<template>
  <AppHeader />

  <div class="app-body">
    <RouterView />
  </div>

  <div class="app-footer">
    <div class="container">
      <p>NexCore Take Home Test</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '@/layout/app-header.component.vue'
</script>
