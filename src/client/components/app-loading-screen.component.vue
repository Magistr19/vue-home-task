<template>
  <Transition appear name="fade">
    <div class="app-loading-screen">
      <progress class="app-loading-screen-bar progress is-small is-dark" max="100">
        Зачекайте...
      </progress>
    </div>
  </Transition>
</template>

<style>
.app-loading-screen {
  position: fixed;
  z-index: 100;
  inset: 0;
  display: grid;
  place-items: center;
  background-color: var(--app-color-bg-primary);
}
.app-loading-screen-bar {
  max-inline-size: 300px;
}
</style>
