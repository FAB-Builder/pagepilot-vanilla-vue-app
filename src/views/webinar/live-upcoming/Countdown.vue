<script setup lang="ts">
/** Live countdown timer (days/hours/mins/secs). Port of React's local Countdown in LiveUpcomingSection.tsx. */
import { ref, onMounted, onUnmounted, watch } from 'vue';

const props = defineProps<{
  to: string;
}>();

interface Parts {
  d: number;
  h: number;
  m: number;
  s: number;
}

function calc(): Parts | null {
  const diff = new Date(props.to).getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff % 86400000) / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

const parts = ref<Parts | null>(calc());
let intervalId: ReturnType<typeof setInterval> | undefined;

function restart() {
  parts.value = calc();
  if (intervalId) clearInterval(intervalId);
  intervalId = setInterval(() => {
    parts.value = calc();
  }, 1000);
}

onMounted(restart);
watch(() => props.to, restart);
onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
});

function pad(n: number) {
  return String(n).padStart(2, '0');
}
</script>

<template>
  <span v-if="!parts" class="text-xs font-semibold text-green-600">Starting now</span>
  <div v-else class="flex items-center gap-1.5">
    <div
      v-if="parts.d > 0"
      class="flex min-w-[44px] flex-col items-center rounded-lg border border-indigo-100 bg-white px-2.5 py-1.5 shadow-sm"
    >
      <span class="text-base font-bold leading-none text-slate-800">{{ pad(parts.d) }}</span>
      <span class="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-slate-400">Days</span>
    </div>
    <div
      v-for="key in (['h', 'm', 's'] as const)"
      :key="key"
      class="flex min-w-[44px] flex-col items-center rounded-lg border border-indigo-100 bg-white px-2.5 py-1.5 shadow-sm"
    >
      <span class="text-base font-bold leading-none text-slate-800">{{ pad(parts[key]) }}</span>
      <span class="mt-0.5 text-[9px] font-semibold uppercase tracking-widest text-slate-400">
        {{ key === 'h' ? 'Hours' : key === 'm' ? 'Mins' : 'Secs' }}
      </span>
    </div>
  </div>
</template>
