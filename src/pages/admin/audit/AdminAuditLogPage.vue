<template>
  <div>
    <h1>Audit Log</h1>

    <!-- FILTERS -->
    <div class="preset-filters">
      <button @click="setPreset('creates')">Creates</button>
      <button @click="setPreset('updates')">Updates</button>
      <button @click="setPreset('deletes')">Deletes</button>
      <button @click="setPreset('restores')">Restores</button>
      <button @click="setPreset('last24')">Last 24 Hours</button>
      <button @click="clearFilters">Clear</button>
    </div>

    <div class="filters">
      <div>
        <label>Action</label>
        <select v-model="filters.action">
          <option value="">All</option>
          <option v-for="a in uniqueActions" :key="a" :value="a">{{ a }}</option>
        </select>
      </div>

      <div>
        <label>Entity</label>
        <select v-model="filters.entityType">
          <option value="">All</option>
          <option v-for="e in uniqueEntities" :key="e" :value="e">{{ e }}</option>
        </select>
      </div>

      <div>
        <label>User</label>
        <select v-model="filters.employeeId">
          <option value="">All</option>
          <option v-for="u in uniqueUsers" :key="u.id" :value="u.id">
            {{ u.name }}
          </option>
        </select>
      </div>

      <div>
        <label>Start Date</label>
        <input type="date" v-model="filters.startDate" />
      </div>

      <div>
        <label>End Date</label>
        <input type="date" v-model="filters.endDate" />
      </div>

      <div>
        <label>Search</label>
        <input type="text" v-model="filters.search" placeholder="Search actions or metadata..." />
      </div>

      <button class="clear-btn" @click="clearFilters">Clear Filters</button>
    </div>

    <!-- SORT -->
    <div class="sort-bar">
      <label>Sort by</label>
      <select v-model="sortOrder">
        <option value="desc">Newest First</option>
        <option value="asc">Oldest First</option>
      </select>
    </div>

    <!-- TABLE -->
    <table class="log-table">
      <thead>
        <tr>
          <th>Timestamp</th>
          <th>User</th>
          <th>Action</th>
          <th>Entity</th>
          <th>Metadata</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="log in paginatedLogs" :key="log.id">
          <td>{{ formatDate(log.timestamp) }}</td>
          <td>{{ log.employee?.name }}</td>
          <td>
            <span class="badge" :class="actionClass(log.action)">
              {{ log.action }}
            </span>
          </td>
          <td>{{ log.entityType }} #{{ log.entityId }}</td>
          <td>
            <button v-if="log.metadata" class="meta-btn" @click="toggleMeta(log.id)">
              {{ expandedMeta[log.id] ? 'Hide' : 'View' }}
            </button>

            <pre
              v-if="expandedMeta[log.id]"
              v-html="renderDiff(log.metadata)"
              class="metadata-block diff-block"
            ></pre>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- PAGINATION -->
    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="page === 1" @click="page--">Prev</button>

      <span>Page {{ page }} of {{ totalPages }}</span>

      <button :disabled="page === totalPages" @click="page++">Next</button>
    </div>

    <p v-if="error" class="error">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import http from '@/api/http'

const logs = ref<any[]>([])
const expandedMeta = ref<Record<number, boolean>>({})
const filters = ref({
  action: '',
  entityType: '',
  employeeId: '',
  startDate: '',
  endDate: '',
  search: '',
})
const actionGroups = {
  creates: ['JOB_CREATED', 'EMPLOYEE_CREATED'],
  updates: ['JOB_UPDATED', 'EMPLOYEE_UPDATED'],
  deletes: ['JOB_ARCHIVED', 'EMPLOYEE_ARCHIVED'],
  restores: ['JOB_RESTORED', 'EMPLOYEE_RESTORED'],
}
const sortOrder = ref('desc')
const error = ref('')
const page = ref(1)
const pageSize = 25

async function loadLogs() {
  try {
    const res = await http.get('/admin/audit-log')
    logs.value = res.data
  } catch (err: any) {
    error.value = err.response?.data?.error || 'Failed to load audit log'
  }
}

function setPreset(type: string) {
  const now = new Date()

  if (type === 'creates') {
    filters.value.action = 'EMPLOYEE_CREATED' // or JOB_CREATED
    // leave date open
  }

  if (type === 'updates') {
    filters.value.action = 'EMPLOYEE_UPDATED'
  }

  if (type === 'deletes') {
    filters.value.action = 'EMPLOYEE_ARCHIVED'
  }

  if (type === 'restores') {
    filters.value.action = 'EMPLOYEE_RESTORED'
  }

  if (type === 'last24') {
    const dayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    filters.value.startDate = dayAgo.toISOString().slice(0, 10)
    filters.value.endDate = now.toISOString().slice(0, 10)
  }

  page.value = 1
}

function clearFilters() {
  filters.value = {
    action: '',
    entityType: '',
    employeeId: '',
    startDate: '',
    endDate: '',
    search: '',
  }
  page.value = 1
}

function toggleMeta(id: number) {
  expandedMeta.value[id] = !expandedMeta.value[id]
}

function formattedMetadata(data: any) {
  return JSON.stringify(data, null, 2)
}

function formatDate(d: string) {
  return new Date(d).toLocaleString()
}

function renderDiff(meta: any) {
  if (!meta.before || !meta.after) {
    return JSON.stringify(meta, null, 2)
  }

  const before = meta.before
  const after = meta.after
  const keys = new Set([...Object.keys(before), ...Object.keys(after)])

  let diffText = ''

  keys.forEach((k) => {
    const oldVal = JSON.stringify(before[k])
    const newVal = JSON.stringify(after[k])

    if (oldVal !== newVal) {
      diffText +=
        `\n${k}:\n` +
        `  <span class="removed">- ${oldVal}</span>\n` +
        `  <span class="added">+ ${newVal}</span>\n`
    }
  })

  if (diffText.trim() === '') {
    return '(No changes)'
  }

  return diffText
}

function actionClass(action: string) {
  if (action.includes('CREATED')) return 'created'
  if (action.includes('UPDATED')) return 'updated'
  if (action.includes('ARCHIVED')) return 'archived'
  if (action.includes('RESTORED')) return 'restored'
  return ''
}

const uniqueActions = computed(() => {
  return [...new Set(logs.value.map((l) => l.action))]
})

const uniqueEntities = computed(() => {
  return [...new Set(logs.value.map((l) => l.entityType))]
})

const uniqueUsers = computed(() => {
  const map: Record<number, any> = {}
  logs.value.forEach((l) => {
    if (l.employee) map[l.employee.id] = l.employee
  })
  return Object.values(map)
})

const filteredLogs = computed(() => {
  let out = [...logs.value]

  if (filters.value.action) out = out.filter((l) => l.action === filters.value.action)

  if (filters.value.entityType) out = out.filter((l) => l.entityType === filters.value.entityType)

  if (filters.value.employeeId) out = out.filter((l) => l.employeeId == filters.value.employeeId)

  if (filters.value.startDate) {
    const date = new Date(filters.value.startDate)
    out = out.filter((l) => new Date(l.timestamp) >= date)
  }

  if (filters.value.endDate) {
    const date = new Date(filters.value.endDate)
    out = out.filter((l) => new Date(l.timestamp) <= date)
  }

  if (filters.value.search) {
    const term = filters.value.search.toLowerCase()
    out = out.filter(
      (l) =>
        JSON.stringify(l.metadata)?.toLowerCase().includes(term) ||
        l.action.toLowerCase().includes(term),
    )
  }

  out.sort((a, b) => {
    const aT = new Date(a.timestamp).getTime()
    const bT = new Date(b.timestamp).getTime()
    return sortOrder.value === 'desc' ? bT - aT : aT - bT
  })

  return out
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / pageSize))

const paginatedLogs = computed(() => {
  const start = (page.value - 1) * pageSize
  return filteredLogs.value.slice(start, start + pageSize)
})

onMounted(loadLogs)
</script>

<style scoped>
/* Same styles as before, plus filter and pagination styles */

.filters {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.filters label {
  font-size: 0.85rem;
}

.preset-filters {
  margin-bottom: 10px;
  display: flex;
  gap: 8px;
}

.preset-filters button {
  padding: 5px 10px;
  background: #3b82f6;
  color: white;
  border-radius: 4px;
  border: none;
  cursor: pointer;
}

.preset-filters button:hover {
  background: #2563eb;
}

.log-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.sort-bar {
  margin-bottom: 16px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  gap: 14px;
  align-items: center;
}

.metadata-block {
  background: #f4f4f5;
  padding: 10px;
  border-radius: 6px;
  font-size: 0.85rem;
  white-space: pre-wrap;
  margin-top: 8px;
}

.diff-block {
  font-family: monospace;
  white-space: pre-wrap;
}

.diff-block .removed,
.diff-block .added {
  display: block;
}

.diff-block .removed {
  color: #ef4444; /* red */
}

.diff-block .added {
  color: #22c55e; /* green */
}

.clear-btn {
  background: #ef4444;
  color: white;
  padding: 6px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.clear-btn:hover {
  background: #dc2626;
}
</style>
