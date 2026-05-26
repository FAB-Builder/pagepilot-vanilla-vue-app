<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import 'ahdjs/build/css/index.css'
import AHDjsService from '@/services/AHDjsService'

const CS_APP_ID = '6754c71afc22646fb4a77d0b'
const currentUser = { id: 'visitor-id' }

const CS_BANNERS = [
  { title: 'Channel',  mobileIdentifier: 'CHANNEL_M',  identifier: 'COMMUNICATION_CHANNEL' },
  { title: 'Insight',  mobileIdentifier: 'INSIGHT_M',  identifier: 'INSIGHT' },
  { title: 'Gallery',  mobileIdentifier: 'GALLERY_M',  identifier: 'GALLERY' },
  { title: 'Form',     mobileIdentifier: 'FORM_M',     identifier: 'FUNNEL' },
  { title: 'General',  mobileIdentifier: 'GENERAL_M',  identifier: '#FUNNELS' },
  { title: 'Apps',     mobileIdentifier: 'APPS_M',     identifier: 'APPS' },
  { title: 'Workflow', mobileIdentifier: 'WORKFLOW_M', identifier: 'WORKFLOW' },
  { title: 'Chat',     mobileIdentifier: 'CHAT_M',     identifier: 'TAGS' },
  { title: 'Contact',  mobileIdentifier: 'CONTACT_M',  identifier: 'CONTACT' },
]

const showCSBanners = ref(true)
const applicationId = ref('')
const identifier = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'failed'>('idle')

const activeBanners = computed(() => {
  if (showCSBanners.value) return CS_BANNERS
  if (identifier.value) return [{ identifier: identifier.value, mobileIdentifier: identifier.value + '_M', title: identifier.value }]
  return []
})

const activeAppId = computed(() =>
  showCSBanners.value ? CS_APP_ID : applicationId.value
)

const renderBanners = async () => {
  if (!activeBanners.value.length || (!showCSBanners.value && !activeAppId.value)) {
    status.value = 'failed'
    return
  }
  try {
    status.value = 'loading'
    const ahdJS = AHDjsService.getInstance().init(currentUser.id, activeAppId.value)
    await Promise.all(
      activeBanners.value.flatMap(b => [
        ahdJS.renderAppBanner(b.mobileIdentifier, true),
        ahdJS.renderAppBanner(b.identifier, true),
      ])
    )
    status.value = 'success'
  } catch (error) {
    console.error(error)
    status.value = 'failed'
  }
}

watch(showCSBanners, () => { renderBanners() })

onMounted(() => { renderBanners() })
</script>

<template>
  <div class="view-container">
    <h1 class="view-title">App Banner</h1>
    <p class="view-subtitle">Preview app banners by identifier</p>

    <div class="controls-bar">
      <label class="toggle-label">
        <input type="checkbox" v-model="showCSBanners" />
        <span class="toggle-text">Show CS Banners</span>
      </label>

      <template v-if="!showCSBanners">
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
          <label class="input-label">Identifier</label>
          <input
            class="text-input"
            type="text"
            placeholder="Enter Identifier"
            v-model="identifier"
          />
        </div>
        <div class="input-group input-group--btn">
          <button
            class="run-btn"
            :disabled="!applicationId || !identifier || status === 'loading'"
            @click="renderBanners"
          >
            {{ status === 'loading' ? 'Loading…' : 'Run Banner' }}
          </button>
        </div>
      </template>
    </div>

    <div v-if="status === 'failed' && !showCSBanners" class="status-msg--error">
      Failed to load banner. Check your Application ID and Identifier.
    </div>

    <div class="banner-wrapper">
      <template v-for="banner in activeBanners" :key="banner.identifier">
        <div class="banner-pair">
          <div class="banner-slot">
            <span class="banner-label">{{ banner.mobileIdentifier }}</span>
            <hr class="banner-divider" />
            <div :id="banner.mobileIdentifier" class="banner-div" />
          </div>
          <div class="banner-slot">
            <span class="banner-label">{{ banner.identifier }}</span>
            <hr class="banner-divider" />
            <div :id="banner.identifier" class="banner-div" />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.view-container {
  max-width: 100%;
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
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
  margin-bottom: 24px;
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  font-weight: 600;
  font-size: 14px;
  user-select: none;
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
  margin-bottom: 16px;
}

.banner-wrapper {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.banner-pair {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.banner-slot {
  flex: 1;
  min-width: 280px;
}

.banner-label {
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.banner-divider {
  border: none;
  border-top: 1px solid #e5e7eb;
  margin: 8px 0 12px;
}

.banner-div {
  min-height: 40px;
}
</style>
