<script setup lang="ts">
import type { Report } from '~/composables/useReports'
import { alertMinutesLeft } from '~/composables/useReports'

useHead({ title: 'Mapa de Reportes — Dónde Matraquearon' })

const { fetchReports } = useReports()

const reports = ref<Report[]>([])
const loading = ref(true)
const error = ref('')

async function loadReports() {
  try {
    reports.value = await fetchReports()
  } catch {
    error.value = 'No se pudieron cargar los reportes.'
  } finally {
    loading.value = false
  }
}

let refreshTimer: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  loadReports()
  // Re-fetch every 60s so expired alerts disappear without manual reload
  refreshTimer = setInterval(loadReports, 60_000)
})

onUnmounted(() => {
  if (refreshTimer) clearInterval(refreshTimer)
})

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-VE', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

function formatExpiry(iso: string) {
  const min = alertMinutesLeft(iso)
  if (min <= 0) return 'expirando'
  if (min < 60) return `${min} min`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

const recentReports = computed(() => reports.value.slice(0, 5))
</script>

<template>
  <div class="map-page">
    <!-- Floating info panel -->
    <div class="map-panel">
      <div class="map-panel__header">
        <span class="map-panel__dot" />
        <span class="map-panel__title">Alertas activas</span>
      </div>

      <div v-if="loading" class="map-panel__loading">
        <span class="spinner" />
        Cargando...
      </div>
      <div v-else-if="error" class="map-panel__error">{{ error }}</div>

      <template v-else>
        <div class="map-panel__count">{{ reports.length.toLocaleString('es-VE') }}</div>

        <ul v-if="recentReports.length" class="map-panel__list">
          <li v-for="r in recentReports" :key="r.id" class="map-panel__item">
            <span class="map-panel__item-addr">
              {{ r.address || `${r.lat.toFixed(3)}, ${r.lng.toFixed(3)}` }}
            </span>
            <span class="map-panel__item-meta">
              <span class="map-panel__item-date">{{ formatDate(r.created_at) }}</span>
              <span class="map-panel__item-expiry">vence en {{ formatExpiry(r.created_at) }}</span>
            </span>
          </li>
        </ul>

        <p v-else class="map-panel__empty">Aún no hay reportes.<br />¡Sé el primero!</p>

        <NuxtLink to="/" class="map-panel__report-btn">+ Nuevo reporte</NuxtLink>
      </template>
    </div>

    <!-- Map -->
    <div class="map-wrap">
      <div v-if="loading" class="map-placeholder">
        <span class="spinner" style="width:32px;height:32px;border-width:3px;" />
      </div>
      <div v-else-if="error" class="map-placeholder">
        <p style="color:var(--text-muted)">{{ error }}</p>
      </div>
      <ClientOnly v-else>
        <MapView :reports="reports" />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped>
.map-page {
  position: relative;
  flex: 1;
  height: calc(100dvh - var(--header-h));
}

.map-wrap {
  position: absolute;
  inset: 0;
  z-index: 1;
}
.map-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--surface);
}

/* ---- Floating panel ---- */
.map-panel {
  position: absolute;
  top: 16px;
  right: 16px;
  z-index: 500;
  width: 260px;
  background: rgba(13, 13, 13, 0.93);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 18px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

@media (max-width: 480px) {
  .map-panel {
    top: auto;
    bottom: 16px;
    left: 16px;
    right: 16px;
    width: auto;
  }
}

.map-panel__header {
  display: flex;
  align-items: center;
  gap: 8px;
}
.map-panel__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--red);
  flex-shrink: 0;
}
.map-panel__title {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-muted);
}

.map-panel__loading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.map-panel__error { font-size: 0.85rem; color: #f87171; }
.map-panel__empty { font-size: 0.82rem; color: var(--text-muted); line-height: 1.5; }

.map-panel__count {
  font-size: 2.2rem;
  font-weight: 800;
  color: var(--red);
  line-height: 1;
}

.map-panel__list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 8px;
  border-top: 1px solid var(--border);
  padding-top: 10px;
}
.map-panel__item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.map-panel__item-addr {
  font-size: 0.8rem;
  color: var(--text);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.map-panel__item-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 6px;
}
.map-panel__item-date {
  font-size: 0.72rem;
  color: var(--text-muted);
}
.map-panel__item-expiry {
  font-size: 0.68rem;
  color: #f59e0b;
  white-space: nowrap;
}

.map-panel__report-btn {
  display: block;
  text-align: center;
  padding: 10px;
  border-radius: 10px;
  background: var(--red);
  color: #fff;
  font-size: 0.85rem;
  font-weight: 700;
  transition: background 0.15s;
  margin-top: 4px;
}
.map-panel__report-btn:hover { background: var(--red-dark); }
</style>
