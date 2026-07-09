<script setup lang="ts">
/** Port of React's local LiveNowPanel in LiveUpcomingSection.tsx. */
import SpinnerIcon from '../../../components/icons/SpinnerIcon.vue';
import RadioIcon from './RadioIcon.vue';
import ClockIcon from './ClockIcon.vue';
import ArrowRightIcon from './ArrowRightIcon.vue';

export interface LiveItem {
  event: {
    _id: string;
    name: string;
    startDate: string;
    endDate: string;
    formUrl?: string;
  };
  nextOccurrence: string;
}

defineProps<{
  items: LiveItem[];
  loading: boolean;
}>();

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-green-200 bg-white shadow-sm">
    <div class="flex items-center gap-2.5 border-b border-green-100 bg-green-50 px-5 py-3.5">
      <span class="relative flex h-3 w-3">
        <span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
        <span class="relative inline-flex h-3 w-3 rounded-full bg-green-500" />
      </span>
      <RadioIcon class="h-4 w-4 text-green-600" />
      <span class="text-sm font-bold text-green-800">Live now</span>
      <span class="ml-auto rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
        {{ loading ? '…' : items.length }}
      </span>
    </div>
    <div class="p-4">
      <div v-if="loading" class="flex items-center justify-center py-6">
        <SpinnerIcon class="h-5 w-5 animate-spin text-green-400" />
      </div>
      <div
        v-else-if="items.length === 0"
        class="rounded-lg border border-dashed border-green-200 bg-green-50/50 px-4 py-5 text-center"
      >
        <RadioIcon class="mx-auto mb-1.5 h-6 w-6 text-green-300" />
        <p class="text-sm font-medium text-slate-500">No sessions currently running</p>
      </div>
      <div v-else class="space-y-2.5">
        <div
          v-for="{ event } in items"
          :key="event._id"
          class="flex items-center justify-between gap-3 rounded-lg border border-green-200 bg-green-50 px-4 py-3"
        >
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-semibold text-slate-800">{{ event.name }}</p>
            <p class="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
              <ClockIcon class="h-3 w-3 shrink-0" />
              {{ fmtDate(event.startDate) }} · {{ fmtTime(event.startDate) }} – {{ fmtTime(event.endDate) }}
            </p>
          </div>
          <a
            :href="`https://webinar-fab-builder.web.app/?w=${event._id}&type=webinar`"
            target="_blank"
            rel="noopener noreferrer"
            class="flex shrink-0 items-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700"
          >
            Join now <ArrowRightIcon class="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  </div>
</template>
