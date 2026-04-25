<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <header class="header">
    <div class="header__inner">
      <NuxtLink to="/" class="header__logo">
        <span class="header__logo-icon">⚠</span>
        <span class="header__logo-text">Dónde<strong>Matraquearon</strong></span>
      </NuxtLink>

      <nav class="header__nav">
        <NuxtLink
          to="/"
          class="header__link"
          :class="{ 'header__link--active': route.path === '/' }"
        >
          Reportar
        </NuxtLink>
        <NuxtLink
          to="/mapa"
          class="header__link"
          :class="{ 'header__link--active': route.path === '/mapa' }"
        >
          Ver mapa
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-h);
  background: rgba(13, 13, 13, 0.92);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.header__inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header__logo {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1rem;
  color: var(--text);
}
.header__logo-icon {
  font-size: 1.3rem;
  color: var(--red);
  line-height: 1;
}
.header__logo-text {
  letter-spacing: -0.01em;
  color: var(--text-muted);
}
.header__logo-text strong {
  color: var(--text);
  font-weight: 700;
}

.header__nav {
  display: flex;
  gap: 4px;
}

.header__link {
  padding: 7px 16px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-muted);
  transition: color 0.15s, background 0.15s;
}
.header__link:hover {
  color: var(--text);
  background: var(--surface-2);
}
.header__link--active {
  color: var(--text);
  background: var(--surface-2);
}
</style>
