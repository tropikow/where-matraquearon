<template>
  <div class="layout">
    <AppHeader />
    <slot />
  </div>
</template>

<style scoped>
.layout {
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
}
</style>
