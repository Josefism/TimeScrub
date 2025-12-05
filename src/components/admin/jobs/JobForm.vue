<template>
  <form @submit.prevent="handleSubmit" class="form">
    <div class="field">
      <label>Customer</label>
      <select v-model="localForm.customerId" @change="onCustomerChange" required>
        <option disabled value="">Select customer...</option>
        <option v-for="c in customers" :key="c.id" :value="c.id">
          {{ c.name }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Location</label>
      <select v-model="localForm.locationId" required>
        <option disabled value="">Select location...</option>
        <option v-for="loc in filteredLocations" :key="loc.id" :value="loc.id">
          {{ loc.name || loc.addressLine1 }}
        </option>
      </select>
    </div>

    <div class="field">
      <label>Job Name</label>
      <input v-model="localForm.name" required />
    </div>

    <div class="field">
      <label>Job Note</label>
      <textarea v-model="localForm.jobNote" rows="3"></textarea>
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <button class="btn primary">{{ submitText }}</button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import type { Customer } from '@/types/Customer'
import type { JobLocation } from '@/types/JobLocation'

// Form model uses STRINGS for select bindings
interface JobFormModel {
  customerId: string
  locationId: string
  name: string
  jobNote?: string
}

interface Props {
  modelValue: JobFormModel
  submitText: string
  customers: Customer[]
  locations: JobLocation[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  (e: 'update:modelValue', v: JobFormModel): void
  (
    e: 'submit',
    payload: {
      customerId: number
      locationId: number
      name: string
      jobNote?: string
    },
  ): void
}>()

const error = ref('')

const localForm = ref<JobFormModel>({
  customerId: '',
  locationId: '',
  name: '',
  jobNote: '',
})

// Sync incoming form data
watch(
  () => props.modelValue,
  (val) => {
    if (val) localForm.value = { ...localForm.value, ...val }
  },
  { immediate: true },
)

// Sync outgoing updates
watch(
  localForm,
  (val) => {
    emit('update:modelValue', val)
  },
  { deep: true },
)

// Filter locations belonging to the selected customer
const filteredLocations = computed(() =>
  props.locations.filter((loc) => loc.customerId === Number(localForm.value.customerId)),
)

function onCustomerChange() {
  localForm.value.locationId = ''
}

function handleSubmit() {
  if (!localForm.value.customerId || !localForm.value.locationId) {
    error.value = 'Customer and Location are required.'
    return
  }

  emit('submit', {
    customerId: Number(localForm.value.customerId),
    locationId: Number(localForm.value.locationId),
    name: localForm.value.name,
    jobNote: localForm.value.jobNote,
  })
}
</script>

<style scoped>
.form {
  max-width: 450px;
}
.field {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.error {
  color: red;
  margin-bottom: 1rem;
}
.btn.primary {
  background: #3b82f6;
  color: white;
  padding: 8px 14px;
  border-radius: 4px;
}
</style>
