<script setup lang="ts">
import type { Report } from '~/composables/useReports'
import { alertMinutesLeft } from '~/composables/useReports'

const props = defineProps<{ reports: Report[] }>()

const mapEl = ref<HTMLDivElement | null>(null)
let map: any = null

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('es-VE', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

onMounted(async () => {
  const L = (await import('leaflet')).default

  // Fix default marker icon paths broken by bundlers
  delete (L.Icon.Default.prototype as any)._getIconUrl
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  })

  map = L.map(mapEl.value!, { zoomControl: true }).setView([7.5, -66.0], 6)

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
    maxZoom: 19,
  }).addTo(map)

  for (const r of props.reports) {
    const min = alertMinutesLeft(r.created_at)
    const expiryLabel = min <= 0 ? 'expirando' : min < 60 ? `vence en ${min} min` : `vence en ${Math.floor(min / 60)}h ${min % 60}m`
    const popup = `
      <div class="lf-popup">
        <div class="lf-popup__icon">⚠</div>
        <p class="lf-popup__addr">${r.address || 'Ubicación reportada'}</p>
        ${r.description ? `<p class="lf-popup__desc">${r.description}</p>` : ''}
        <p class="lf-popup__date">${formatDate(r.created_at)}</p>
        <p class="lf-popup__expiry">${expiryLabel}</p>
      </div>`

    L.circleMarker([r.lat, r.lng], {
      radius: 9,
      color: '#e63946',
      fillColor: '#e63946',
      fillOpacity: 0.72,
      weight: 2,
    })
      .bindPopup(popup)
      .addTo(map)
  }
})

onUnmounted(() => {
  if (map) {
    map.remove()
    map = null
  }
})
</script>

<template>
  <div ref="mapEl" class="map-canvas" />
</template>

<style>
/* Popup styles — not scoped so Leaflet's DOM can pick them up */
.lf-popup { display: flex; flex-direction: column; gap: 4px; min-width: 160px; }
.lf-popup__icon { font-size: 1.2rem; }
.lf-popup__addr { font-size: 0.85rem; font-weight: 600; color: #111; }
.lf-popup__desc { font-size: 0.8rem; color: #444; max-width: 200px; }
.lf-popup__date { font-size: 0.75rem; color: #888; }
.lf-popup__expiry { font-size: 0.72rem; color: #f59e0b; font-weight: 600; }
</style>

<style scoped>
.map-canvas { width: 100%; height: 100%; }
</style>
