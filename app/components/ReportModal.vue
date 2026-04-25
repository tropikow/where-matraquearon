<script setup lang="ts">
interface Props {
  lat: number
  lng: number
  address: string
  loadingAddress: boolean
}
const props = defineProps<Props>()
const emit = defineEmits<{
  confirm: [description: string]
  cancel: []
}>()

const description = ref('')
</script>

<template>
  <Teleport to="body">
    <div class="overlay" @click.self="emit('cancel')">
      <div class="modal animate-fade-in">
        <div class="modal__icon">📍</div>

        <h2 class="modal__title">¿Confirmar reporte?</h2>
        <p class="modal__subtitle">Se registrará tu ubicación actual como punto de matraca.</p>

        <div class="modal__location">
          <span v-if="loadingAddress" class="modal__location-loading">
            <span class="spinner" style="width:14px;height:14px;border-width:2px;" />
            Obteniendo dirección...
          </span>
          <span v-else class="modal__location-text">{{ address }}</span>
        </div>

        <div class="modal__field">
          <label class="modal__label">¿Qué pasó? <span>(opcional)</span></label>
          <textarea
            v-model="description"
            class="modal__textarea"
            rows="3"
            placeholder="Ej: Alcabala en la autopista, solicitaron dinero..."
            maxlength="280"
          />
        </div>

        <div class="modal__actions">
          <button class="modal__btn modal__btn--cancel" @click="emit('cancel')">
            Cancelar
          </button>
          <button class="modal__btn modal__btn--confirm" @click="emit('confirm', description)">
            Confirmar reporte
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  z-index: 200;
  background: rgba(0, 0, 0, 0.75);
  display: flex;
  align-items: flex-end;
  justify-content: center;
  padding: 0 0 16px;
}

@media (min-width: 600px) {
  .overlay {
    align-items: center;
    padding: 24px;
  }
}

.modal {
  width: 100%;
  max-width: 480px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 20px 20px 12px 12px;
  padding: 28px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

@media (min-width: 600px) {
  .modal { border-radius: 20px; }
}

.modal__icon {
  font-size: 2.2rem;
  text-align: center;
}
.modal__title {
  font-size: 1.25rem;
  font-weight: 700;
  text-align: center;
}
.modal__subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: center;
  margin-top: -8px;
}

.modal__location {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 12px 14px;
  min-height: 44px;
  display: flex;
  align-items: center;
}
.modal__location-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.85rem;
  color: var(--text-muted);
}
.modal__location-text {
  font-size: 0.88rem;
  color: var(--text);
  line-height: 1.4;
}

.modal__field { display: flex; flex-direction: column; gap: 6px; }
.modal__label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.modal__label span { font-weight: 400; text-transform: none; }

.modal__textarea {
  background: var(--surface-2);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 10px 12px;
  color: var(--text);
  font-size: 0.88rem;
  font-family: inherit;
  resize: none;
  width: 100%;
  transition: border-color 0.15s;
}
.modal__textarea:focus {
  outline: none;
  border-color: var(--red);
}
.modal__textarea::placeholder { color: var(--text-muted); }

.modal__actions {
  display: flex;
  gap: 10px;
  margin-top: 4px;
}
.modal__btn {
  flex: 1;
  padding: 13px;
  border-radius: 12px;
  font-size: 0.92rem;
  font-weight: 600;
  transition: opacity 0.15s, transform 0.1s;
}
.modal__btn:active { transform: scale(0.97); }
.modal__btn--cancel {
  background: var(--surface-2);
  color: var(--text-muted);
  border: 1px solid var(--border);
}
.modal__btn--cancel:hover { color: var(--text); }
.modal__btn--confirm {
  background: var(--red);
  color: #fff;
}
.modal__btn--confirm:hover { background: var(--red-dark); }
</style>
