<template>
  <form @submit.prevent="emitSubmit" class="form">
    <h3>Basic Info</h3>

    <div class="field">
      <label>Location Name</label>
      <input v-model="local.name" placeholder="Main Office / Warehouse / Job Site" />
    </div>

    <h3>Address</h3>

    <div class="field">
      <label>Address Line 1 *</label>
      <input v-model="local.addressLine1" required />
    </div>

    <div class="field">
      <label>Address Line 2</label>
      <input v-model="local.addressLine2" />
    </div>

    <div class="split">
      <div class="field">
        <label>City *</label>
        <input v-model="local.city" required />
      </div>

      <div class="field">
        <label>State *</label>
        <input v-model="local.state" required />
      </div>

      <div class="field">
        <label>ZIP *</label>
        <input v-model="local.postalCode" required />
      </div>
    </div>

    <div class="field">
      <label>Country</label>
      <input v-model="local.country" />
    </div>

    <h3>Administrative Fields</h3>

    <div class="field">
      <label>Location Type</label>
      <select v-model="local.locationType">
        <option value="">(none)</option>
        <option>Office</option>
        <option>Warehouse</option>
        <option>Construction Site</option>
        <option>Retail</option>
        <option>Customer Home</option>
        <option>Other</option>
      </select>
    </div>

    <div class="field">
      <label>Internal Note (Admin Only)</label>
      <textarea v-model="local.internalNote" rows="3" />
    </div>

    <div class="field">
      <label>Access Instructions (Visible to Employees)</label>
      <textarea v-model="local.accessInstruction" rows="3" />
    </div>

    <h3>Coordinates (Optional)</h3>

    <div class="split">
      <div class="field">
        <label>Latitude</label>
        <input v-model.number="local.latitude" type="number" step="0.000001" />
      </div>

      <div class="field">
        <label>Longitude</label>
        <input v-model.number="local.longitude" type="number" step="0.000001" />
      </div>
    </div>

    <div class="field checkbox">
      <label>
        <input type="checkbox" v-model="local.isPrimary" />
        Mark as primary location for customer
      </label>
    </div>

    <h3>Tags</h3>
    <div class="field">
      <input
        v-model="tagInput"
        @keyup.enter.prevent="addTag"
        placeholder="Add tag and press Enter"
      />
      <div class="tag-list">
        <span v-for="tag in local.tags" :key="tag" class="tag" @click="removeTag(tag)">
          {{ tag }} ✕
        </span>
      </div>
    </div>

    <button class="btn primary" type="submit">
      {{ submitText }}
    </button>
  </form>
</template>

<script setup lang="ts">
import { reactive, watch, ref } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  submitText: {
    type: String,
    default: 'Save',
  },
})

const emit = defineEmits(['update:modelValue', 'submit'])

const tagInput = ref('')

const local = reactive(JSON.parse(JSON.stringify(props.modelValue)))

watch(
  () => props.modelValue,
  (newVal) => {
    Object.assign(local, JSON.parse(JSON.stringify(newVal)))
  },
)

watch(
  local,
  () => {
    emit('update:modelValue', JSON.parse(JSON.stringify(local)))
  },
  { deep: true },
)

function emitSubmit() {
  emit('submit', JSON.parse(JSON.stringify(local)))
}

function addTag() {
  if (!tagInput.value.trim()) return
  if (!local.tags) local.tags = []
  if (!local.tags.includes(tagInput.value)) local.tags.push(tagInput.value)
  tagInput.value = ''
}

function removeTag(t: string) {
  local.tags = local.tags.filter((x: string) => x !== t)
}
</script>

<style scoped>
.field {
  margin-bottom: 1rem;
  display: flex;
  flex-direction: column;
}
.checkbox {
  flex-direction: row;
  align-items: center;
}
.split {
  display: flex;
  gap: 1rem;
}
.tag-list {
  margin-top: 0.5rem;
}
.tag {
  background: #3b82f6;
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  margin-right: 4px;
  cursor: pointer;
}
.btn.primary {
  background: #3b82f6;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
