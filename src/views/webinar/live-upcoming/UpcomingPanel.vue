<script setup lang="ts">
/** Port of React's local UpcomingPanel in LiveUpcomingSection.tsx. */
import ClockIcon from './ClockIcon.vue';
import ArrowRightIcon from './ArrowRightIcon.vue';
import Countdown from './Countdown.vue';
import SpinnerIcon from '../../../components/icons/SpinnerIcon.vue';

export interface UpcomingItem {
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
  items: UpcomingItem[];
  loading: boolean;
}>();

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}
function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
}
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-indigo-200 bg-white shadow-sm">
    <div class="flex items-center gap-2.5 border-b border-indigo-100 bg-indigo-50 px-5 py-3.5">
      <ClockIcon class="h-4 w-4 text-brand" />
      <span class="text-sm font-bold text-indigo-800">Upcoming — next 36 h</span>
      <span class="ml-auto rounded-full bg-brand-tint px-2 py-0.5 text-xs font-semibold text-brand">
        {{ loading ? '…' : items.length }}
      </span>
    </div>
    <div class="p-4">
      <div v-if="loading" class="flex items-center justify-center py-6">
        <SpinnerIcon class="h-5 w-5 animate-spin text-indigo-300" />
      </div>
      <div
        v-else-if="items.length === 0"
        class="rounded-lg border border-dashed border-indigo-200 bg-indigo-50/50 px-4 py-5 text-center"
      >
        <ClockIcon class="mx-auto mb-1.5 h-6 w-6 text-indigo-300" />
        <p class="text-sm font-medium text-slate-500">No upcoming webinars in the next 36 hours</p>
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="{ event, nextOccurrence } in items"
          :key="event._id"
          class="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white px-4 py-4"
        >
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0 flex-1">
              <p class="text-[10px] font-bold uppercase tracking-widest text-brand">Upcoming</p>
              <p class="mt-0.5 truncate text-sm font-bold text-slate-800">{{ event.name }}</p>
              <p class="mt-0.5 flex items-center gap-1 text-xs text-slate-500">
                <ClockIcon class="h-3 w-3 shrink-0" />
                {{ fmtDate(nextOccurrence) }} · {{ fmtTime(nextOccurrence) }}
              </p>
            </div>
            <a
              :href="`https://webinar-fab-builder.web.app/?w=${event._id}&type=webinar`"
              target="_blank"
              rel="noopener noreferrer"
              class="flex shrink-0 items-center gap-1.5 rounded-lg border border-brand px-3.5 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
            >
              Register <ArrowRightIcon class="h-3 w-3" />
            </a>
          </div>
          <div class="mt-3 border-t border-indigo-100 pt-3">
            <Countdown :to="nextOccurrence" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
