<script setup lang="ts">
import { ref, nextTick, onMounted, onUnmounted } from 'vue'
import 'ahdjs/build/css/index.css'
import AHDjsService from '@/services/AHDjsService'
import { PAGE_PILOT_API_HOST } from '@/shared/constants/constants'

const currentUser = { id: 'visitor-id' }

const applicationId = ref('')
const slug = ref('')
const status = ref<'idle' | 'loading' | 'success' | 'failed'>('idle')
const errorMsg = ref('')

interface PreviewStep {
  id: string
  originalSelector: string
  title: string
}

const previewSteps = ref<PreviewStep[]>([])

const runTooltip = async () => {
  if (!applicationId.value || !slug.value) return

  try {
    status.value = 'loading'
    previewSteps.value = []
    errorMsg.value = ''

    // 1. Fetch tooltip data directly from the API
    const apiUrl = `${PAGE_PILOT_API_HOST}/api/tenant/${applicationId.value}/client/unacknowledged?filter[slug]=${encodeURIComponent(slug.value)}&filter[userId]=${currentUser.id}&filter[device]=desktop`
    const response = await fetch(apiUrl).then(res => res.json())

    const tooltips: any[] = response?.tooltips || []
    if (!tooltips.length) {
      errorMsg.value = 'No tooltips found for this application ID and slug.'
      status.value = 'failed'
      return
    }

    // 2. Build preview steps and a beacons array referencing our placeholder IDs
    const steps: PreviewStep[] = []
    const beacons: any[] = []

    tooltips.forEach((tooltip: any) => {
      const stepsArray = Array.isArray(tooltip.step)
        ? tooltip.step
        : tooltip.step ? [tooltip.step] : []

      stepsArray.forEach((step: any) => {
        const behavior = step.contentMetadata?.document?.root?.data?.behaviour || {}
        const originalSelector = step.selector || behavior.selector || ''
        const previewId = `pp-tooltip-preview-${steps.length}`

        steps.push({
          id: previewId,
          originalSelector,
          title: step.title || `Step ${steps.length + 1}`,
        })

        beacons.push({
          element: `#${previewId}`,
          position: step.position || behavior.position || 'right',
          boundary: 'outer',
          class: 'beacon-labs64',
          triggerMode: step.triggerMode || behavior.triggerMode,
          trigger: step.triggerBehaviour || behavior.triggerBehaviour,
          tour: {
            steps: [{
              element: `#${previewId}`,
              title: step.title,
              description: step.content,
              animationType: step.animationType || behavior.animationType || 'fadeIn',
              isBackdrop:false,
              isCaret: step.isCaret ?? behavior.isCaret ?? true,
              position: step.position || behavior.position,
              type: 'tooltip',
              showProgressbar: false,
            }],
            options: {
              applicationId: applicationId.value,
              apiHost: PAGE_PILOT_API_HOST,
              visitorId: currentUser.id,
              showProgressbar: false,
            },
          },
        })

        if (step.triggerMode === 'icon' && step.triggerIcon) {
          beacons[beacons.length - 1].triggerIcon = {
            type: step.triggerIcon.type || 'beacon',
            color: step.triggerIcon.color || '#000000',
            isAnimated: step.triggerIcon.isAnimated || false,
          }
        } else if (step.triggerMode === 'label' && step.triggerLabel) {
          beacons[beacons.length - 1].triggerLabel = {
            text: step.triggerLabel.text,
            color: step.triggerLabel.color || '#000000',
            background: step.triggerLabel.background || '#d01e1e',
          }
        }
      })
    })

    previewSteps.value = steps

    // 3. Wait for Vue to render the placeholder elements, then attach beacons
    await nextTick()

    const ahdJS = AHDjsService.getInstance().init(currentUser.id, applicationId.value)
    await ahdJS.setBeacons(beacons)

    status.value = 'success'
  } catch (error) {
    console.error(error)
    errorMsg.value = 'Failed to load tooltips. Check your Application ID and Slug.'
    status.value = 'failed'
  }
}

const stopTooltip = () => {
  AHDjsService.getInstance().getClient()?.stop()
  status.value = 'idle'
}

const handlePagePilotEvent = (event: MessageEvent) => {
  if (event.data?.type === 'closeTooltip') {
    stopTooltip()
  }
}

onMounted(() => window.addEventListener('message', handlePagePilotEvent))
onUnmounted(() => window.removeEventListener('message', handlePagePilotEvent))
</script>

<template>
  <div class="view-container">
    <h1 class="view-title">Tooltip</h1>
    <p class="view-subtitle">Enter your Application ID and Tooltip slug, then click Run</p>

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
          placeholder="Enter Tooltip Slug"
          v-model="slug"
        />
      </div>
      <div class="input-group input-group--btn">
        <button
          class="run-btn"
          :disabled="!applicationId || !slug || status === 'loading'"
          @click="runTooltip"
        >
          {{ status === 'loading' ? 'Running…' : 'Run Tooltip' }}
        </button>
        <button
          class="stop-btn"
          :disabled="status !== 'success'"
          @click="stopTooltip"
        >
          Stop
        </button>
      </div>
    </div>

    <div v-if="status === 'failed'" class="status-msg status-msg--error">
      {{ errorMsg }}
    </div>

    <!-- Preview placeholders: one card per tooltip step, beacons attach here -->
    <div v-if="previewSteps.length" class="preview-area">
      <div
        v-for="step in previewSteps"
        :key="step.id"
        :id="step.id"
        class="preview-step"
      >
        <span class="preview-step-title">{{ step.title }}</span>
        <span class="preview-step-selector" v-if="step.originalSelector">
          selector: <code>{{ step.originalSelector }}</code>
        </span>
      </div>
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

.stop-btn {
  padding: 7px 20px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
  background: #ef4444;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  height: 34px;
}

.stop-btn:hover:not(:disabled) {
  background: #dc2626;
}

.stop-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.status-msg--error {
  font-size: 13px;
  color: #ef4444;
  margin-bottom: 16px;
}

.preview-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 8px;
}

.preview-step {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #f9fafb;
  min-height: 52px;
}

.preview-step-title {
  font-size: 14px;
  font-weight: 500;
  color: #111827;
}

.preview-step-selector {
  font-size: 12px;
  color: #6b7280;
}

.preview-step-selector code {
  background: #e5e7eb;
  padding: 2px 5px;
  border-radius: 4px;
  font-family: monospace;
}
</style>
