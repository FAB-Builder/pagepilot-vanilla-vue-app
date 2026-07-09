<script setup lang="ts">
/** Port of React's local LiveUpcomingDemo in LiveUpcomingSection.tsx. */
import { ref, onMounted } from 'vue';
import { PAGEPILOT_API_HOST, DEMO_APPLICATION_ID } from '../../../lib/ahd';
import RefreshIcon from './RefreshIcon.vue';
import LiveNowPanel, { type LiveItem } from './LiveNowPanel.vue';
import UpcomingPanel, { type UpcomingItem } from './UpcomingPanel.vue';

const upcoming = ref<UpcomingItem[]>([]);
const live = ref<LiveItem[]>([]);
const loading = ref(true);
const base = `${PAGEPILOT_API_HOST}/tenant/${DEMO_APPLICATION_ID}`;

function load() {
  loading.value = true;
  Promise.all([
    fetch(`${base}/webinars/upcoming?inNextHours=36`).then((r) => r.json()),
    fetch(`${base}/webinars/currently-running`).then((r) => r.json()),
  ])
    .then(([u, l]) => {
      upcoming.value = Array.isArray(u) ? u : [];
      live.value = Array.isArray(l) ? l : [];
    })
    .catch(() => {})
    .finally(() => {
      loading.value = false;
    });
}

onMounted(load);
</script>

<template>
  <div class="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div class="flex items-center justify-between">
      <span class="text-xs font-semibold text-slate-500">Live demo — Page Pilot demo workspace</span>
      <button
        type="button"
        @click="load"
        :disabled="loading"
        class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-slate-500 transition-colors hover:bg-white hover:text-brand disabled:opacity-50"
      >
        <RefreshIcon :class="`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`" />
        Refresh
      </button>
    </div>
    <LiveNowPanel :items="live" :loading="loading" />
    <UpcomingPanel :items="upcoming" :loading="loading" />
  </div>
</template>
