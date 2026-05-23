<script setup lang="ts">
import { ref } from 'vue'
import AHDjsLib from 'ahdjs'
import 'ahdjs/build/css/index.css';
const AHDjs = (AHDjsLib as any).default ?? AHDjsLib

const PAGE_PILOT_API_HOST = 'https://pagepilot.fabbuilder.com'
const currentUser = { id: 'visitor-id' }

const applicationId = ref('')
const slug = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'failed'>('idle')

const runTour = async () => {
  try {
    status.value = 'loading'
    const ahdJS = AHDjs(undefined, {
      applicationId: applicationId.value,
      apiHost: PAGE_PILOT_API_HOST,
      visitorId: currentUser.id,
      showProgressbar: false,
    })
    await ahdJS.showHighlights(slug.value, true)
    status.value = 'success'
  } catch (error) {
    console.error(error)
    status.value = 'failed'
  }
}
</script>

<template>
  <div class="view-container">
    <h1 class="view-title">Tour</h1>
    <p class="view-subtitle">Enter your Application ID and Tour slug, then click Run</p>

    <div class="controls-bar">
      <div class="input-group">
        <label class="input-label">Application ID</label>
        <input
          class="text-input"
          type="text"
          placeholder="Enter Application ID"
          v-model="applicationId"
        />
      </div>
      <div class="input-group">
        <label class="input-label">Slug</label>
        <input
          class="text-input"
          type="text"
          placeholder="Enter Tour Slug"
          v-model="slug"
        />
      </div>
      <div class="input-group input-group--btn">
        <button
          class="run-btn"
          :disabled="!applicationId || !slug || status === 'loading'"
          @click="runTour"
        >
          {{ status === 'loading' ? 'Running…' : 'Run Tour' }}
        </button>
      </div>
    </div>

    <div v-if="status === 'failed'" class="status-msg status-msg--error">
      Failed to load tour. Check your Application ID and Slug.
    </div>
  </div>
</template>

<style scoped>
.view-container {
  max-width: 720px;
  margin: 0 auto;
}

.view-title {
  font-size: 22px;
  font-weight: 700;
  color: #111827;
  margin-bottom: 6px;
}

.view-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 24px;
}

.controls-bar {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.input-group--btn {
  justify-content: flex-end;
}

.input-label {
  font-size: 12px;
  font-weight: 500;
  color: #6b7280;
}

.text-input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 14px;
  min-width: 220px;
  outline: none;
  transition: border-color 0.2s;
}

.text-input:focus {
  border-color: #6366f1;
  box-shadow: 0 0 0 2px rgba(99, 102, 241, 0.2);
}

.run-btn {
  padding: 7px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: #6366f1;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  height: 34px;
}

.run-btn:hover:not(:disabled) {
  background: #4f46e5;
}

.run-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.status-msg--error {
  font-size: 13px;
  color: #ef4444;
}
</style>
