<script setup lang="ts">
useHead({ title: '¿Dónde Matraquearon? — Reportar' })

const { getCurrentPosition, reverseGeocode } = useGeolocation()
const { createReport, fetchReports } = useReports()

// UI state
const step = ref<'idle' | 'locating' | 'modal' | 'saving' | 'success'>('idle')
const errorMsg = ref('')
const toastVisible = ref(false)
const toastType = ref<'success' | 'error'>('success')
const toastText = ref('')

// Report data
const coords = ref<{ lat: number; lng: number } | null>(null)
const address = ref('')
const loadingAddress = ref(false)

// Stats
const totalReports = ref<number | null>(null)

onMounted(async () => {
  try {
    const reports = await fetchReports()
    totalReports.value = reports.length
  } catch {}
})

async function handleReport() {
  if (step.value !== 'idle') return
  step.value = 'locating'
  errorMsg.value = ''

  try {
    const pos = await getCurrentPosition()
    coords.value = { lat: pos.latitude, lng: pos.longitude }

    loadingAddress.value = true
    step.value = 'modal'
    address.value = await reverseGeocode(pos.latitude, pos.longitude)
    loadingAddress.value = false
  } catch (err: any) {
    step.value = 'idle'
    showToast('error', err.message || 'Error al obtener la ubicación')
  }
}

async function handleConfirm(description: string) {
  if (!coords.value) return
  step.value = 'saving'

  try {
    await createReport({
      lat: coords.value.lat,
      lng: coords.value.lng,
      address: address.value,
      description: description || undefined,
    })
    step.value = 'success'
    if (totalReports.value !== null) totalReports.value++
    showToast('success', '¡Reporte enviado! Gracias por avisar a la comunidad.')
    setTimeout(() => (step.value = 'idle'), 3000)
  } catch (err: any) {
    step.value = 'modal'
    showToast('error', 'No se pudo guardar el reporte. Intenta de nuevo.')
  }
}

function handleCancel() {
  step.value = 'idle'
  coords.value = null
  address.value = ''
}

function showToast(type: 'success' | 'error', text: string) {
  toastType.value = type
  toastText.value = text
  toastVisible.value = true
  setTimeout(() => (toastVisible.value = false), 4000)
}
</script>

<template>
  <main class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero__content animate-fade-in">
        <!-- Eyebrow -->
        <p class="hero__eyebrow">🇻🇪 Venezuela · Comunidad</p>

        <!-- Title -->
        <h1 class="hero__title">
          ¿Dónde<br /><span class="hero__title--red">matraquearon?</span>
        </h1>

        <p class="hero__desc">
          Reporta puntos de matraca, alcabalas o extorsión policial.<br />
          Ayuda a otros venezolanos a prevenir y estar alertas.
        </p>

        <!-- Report Button -->
        <button
          class="report-btn"
          :class="{
            'report-btn--locating': step === 'locating',
            'report-btn--success': step === 'success',
          }"
          :disabled="step === 'locating' || step === 'saving'"
          @click="handleReport"
        >
          <span v-if="step === 'locating'" class="report-btn__inner">
            <span class="spinner" />
            Obteniendo ubicación...
          </span>
          <span v-else-if="step === 'success'" class="report-btn__inner">
            ✓ &nbsp;Reporte enviado
          </span>
          <span v-else class="report-btn__inner">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            REPORTAR
          </span>
        </button>

        <NuxtLink to="/mapa" class="hero__map-link">
          Ver mapa de reportes →
        </NuxtLink>

        <!-- Stats -->
        <div v-if="totalReports !== null" class="hero__stats">
          <span class="hero__stats-dot" />
          {{ totalReports.toLocaleString('es-VE') }}
          {{ totalReports === 1 ? 'reporte registrado' : 'reportes registrados' }} en Venezuela
        </div>
      </div>

      <!-- Background decoration -->
      <div class="hero__bg-glow" aria-hidden="true" />
    </section>

    <!-- How it works -->
    <section class="how">
      <div class="how__inner">
        <div class="how__step">
          <div class="how__step-num">1</div>
          <p>Toca <strong>REPORTAR</strong> cuando sufras una matraca</p>
        </div>
        <div class="how__divider" />
        <div class="how__step">
          <div class="how__step-num">2</div>
          <p>Acepta el acceso a tu <strong>ubicación</strong></p>
        </div>
        <div class="how__divider" />
        <div class="how__step">
          <div class="how__step-num">3</div>
          <p>Confirma y <strong>alerta a la comunidad</strong></p>
        </div>
      </div>
    </section>
  </main>

  <!-- Modal -->
  <ReportModal
    v-if="step === 'modal' || step === 'saving'"
    :lat="coords!.lat"
    :lng="coords!.lng"
    :address="address"
    :loading-address="loadingAddress"
    @confirm="handleConfirm"
    @cancel="handleCancel"
  />

  <!-- Toast -->
  <Transition name="toast">
    <div v-if="toastVisible" :class="['toast', `toast--${toastType}`]">
      <span>{{ toastType === 'success' ? '✓' : '✕' }}</span>
      {{ toastText }}
    </div>
  </Transition>
</template>

<style scoped>
/* ---- Home ---- */
.home {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* ---- Hero ---- */
.hero {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100dvh - var(--header-h) - 100px);
  padding: 48px 24px;
  overflow: hidden;
  text-align: center;
}

.hero__bg-glow {
  position: absolute;
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(230, 57, 70, 0.08) 0%, transparent 70%);
  pointer-events: none;
}

.hero__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  max-width: 520px;
}

.hero__eyebrow {
  font-size: 0.82rem;
  font-weight: 600;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-muted);
}

.hero__title {
  font-size: clamp(2.4rem, 8vw, 3.8rem);
  font-weight: 800;
  line-height: 1.1;
  letter-spacing: -0.03em;
}
.hero__title--red { color: var(--red); }

.hero__desc {
  font-size: 0.95rem;
  color: var(--text-muted);
  line-height: 1.6;
}

/* ---- Report button ---- */
.report-btn {
  margin-top: 8px;
  width: 200px;
  height: 200px;
  border-radius: 50%;
  background: var(--red);
  color: #fff;
  font-size: 1.15rem;
  font-weight: 800;
  letter-spacing: 0.06em;
  transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
  animation: pulse-ring 2.4s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite;
  box-shadow: 0 0 0 0 var(--red-glow);
  display: flex;
  align-items: center;
  justify-content: center;
}

.report-btn:hover:not(:disabled) {
  background: var(--red-dark);
  transform: scale(1.04);
}
.report-btn:active:not(:disabled) { transform: scale(0.97); }
.report-btn:disabled { opacity: 0.85; animation: none; cursor: default; }
.report-btn--locating { background: #444; animation: none; }
.report-btn--success {
  background: #1a3a1f;
  border: 2px solid #2d5a35;
  color: #4ade80;
  animation: none;
}

.report-btn__inner {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.hero__map-link {
  font-size: 0.88rem;
  color: var(--text-muted);
  border-bottom: 1px solid transparent;
  transition: color 0.15s, border-color 0.15s;
}
.hero__map-link:hover {
  color: var(--text);
  border-color: var(--border);
}

.hero__stats {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  color: var(--text-muted);
}
.hero__stats-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--red);
  animation: pulse-ring 2s infinite;
}

/* ---- How it works ---- */
.how {
  border-top: 1px solid var(--border);
  padding: 32px 24px;
}
.how__inner {
  max-width: 700px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  flex-wrap: wrap;
  gap: 16px;
}
.how__step {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 0.85rem;
  color: var(--text-muted);
  flex: 1;
  min-width: 160px;
}
.how__step p strong { color: var(--text); }
.how__step-num {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--surface-2);
  border: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--red);
  flex-shrink: 0;
}
.how__divider {
  width: 32px;
  height: 1px;
  background: var(--border);
  flex-shrink: 0;
}

@media (max-width: 500px) {
  .how__divider { display: none; }
}

/* ---- Toast transition ---- */
.toast-enter-active, .toast-leave-active { transition: opacity 0.3s, transform 0.3s; }
.toast-enter-from, .toast-leave-to { opacity: 0; transform: translateX(-50%) translateY(16px); }
</style>
