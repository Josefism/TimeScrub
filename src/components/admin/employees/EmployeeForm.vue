<template>
  <form @submit.prevent="handleSubmit" class="form">
    <div class="field">
      <label>Name</label>
      <input v-model="localForm.name" required />
    </div>

    <div class="field">
      <label>Email</label>
      <input v-model="localForm.email" type="email" required />
    </div>

    <div class="field">
      <label>Role</label>
      <select v-model="localForm.role" required>
        <option value="EMPLOYEE">Employee</option>
        <option value="ADMIN">Admin</option>
      </select>
    </div>

    <!-- Password only shown when creating -->
    <div class="field" v-if="showPassword">
      <label>Password</label>
      <input
        v-model="localForm.password"
        type="password"
        minlength="6"
        placeholder="Minimum 6 characters"
        required
      />
    </div>

    <p v-if="error" class="error">{{ error }}</p>

    <button class="btn primary">{{ submitText }}</button>
  </form>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'

interface EmployeeFormModel {
  name: string
  email: string
  role: 'EMPLOYEE' | 'ADMIN'
  password?: string
}

interface Props {
  modelValue: EmployeeFormModel
  submitText: string
  isCreate?: boolean
}

const props = defineProps<Props>()
const emit = defineEmits(['update:modelValue', 'submit'])

const error = ref('')

// clone input to avoid mutating parent state directly
const localForm = ref({
  name: '',
  email: '',
  role: 'EMPLOYEE',
  password: '', // only used on create
})

watch(
  () => props.modelValue,
  (val) => {
    if (val) localForm.value = { ...localForm.value, ...val }
  },
  { immediate: true },
)

watch(
  () => localForm.value,
  (val) => emit('update:modelValue', val),
  { deep: true },
)

const showPassword = computed(() => props.isCreate)

function handleSubmit() {
  error.value = ''

  if (props.isCreate && !localForm.value.password) {
    error.value = 'Password is required.'
    return
  }

  emit('submit', {
    name: localForm.value.name,
    email: localForm.value.email,
    role: localForm.value.role,
    ...(props.isCreate ? { password: localForm.value.password } : {}),
  })
}
</script>

<style scoped>
.form {
  max-width: 400px;
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
