<script setup lang="ts">
/**
 * Port of React's CalendarDemo.tsx. React used `react-big-calendar` +
 * `moment-timezone`, neither of which is installed in this Vue app, so this
 * is a self-contained Month / Week / Day / Agenda calendar built on the
 * native `Date` API. All data-fetch and event-generation logic —
 * `buildRange`, `generateEventsFromItem`, `fetchWebinars` — is an exact port
 * of the same functions in React's CalendarDemo.tsx, including the
 * month-view multi-day-segment splitting behaviour.
 */
import { ref, computed, watch, onMounted } from 'vue';
import { PAGEPILOT_API_HOST, DEMO_APPLICATION_ID } from '../../lib/ahd';
import CalendarIcon from '../../components/icons/CalendarIcon.vue';
import LinkIcon from '../../components/icons/LinkIcon.vue';
import XIcon from '../../components/icons/XIcon.vue';
import SpinnerIcon from '../../components/icons/SpinnerIcon.vue';
import './calendar-overrides.css';

type ViewName = 'month' | 'week' | 'day' | 'agenda';

interface WebinarRecord {
  id?: string;
  _id?: string;
  name?: string;
  occurrenceStart?: string;
  occurrenceEnd?: string;
}

interface CalEvent {
  title: string;
  start: Date;
  end: Date;
  actualStart: Date;
  actualEnd: Date;
  webinarId: string;
  url: string;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function buildWebinarUrl(id: string) {
  return `https://webinar-fab-builder.web.app/?w=${id}&type=webinar`;
}

function startOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(0, 0, 0, 0);
  return c;
}
function endOfDay(d: Date) {
  const c = new Date(d);
  c.setHours(23, 59, 59, 999);
  return c;
}
function addDays(d: Date, n: number) {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c;
}
function startOfWeek(d: Date) {
  const c = startOfDay(d);
  c.setDate(c.getDate() - c.getDay());
  return c;
}
function endOfWeek(d: Date) {
  const c = endOfDay(startOfWeek(d));
  c.setDate(c.getDate() + 6);
  return c;
}
function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}
function endOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}
function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function diffDays(a: Date, b: Date) {
  return Math.round((startOfDay(a).getTime() - startOfDay(b).getTime()) / 86400000);
}

function buildRange(date: Date, view: ViewName): { start: Date; end: Date } {
  if (view === 'week') return { start: startOfWeek(date), end: endOfWeek(date) };
  if (view === 'day') return { start: startOfDay(date), end: endOfDay(date) };
  return { start: startOfMonth(date), end: endOfMonth(date) };
}

// Exact port of ahd-fe's generateEventsFromItem
function generateEventsFromItem(item: WebinarRecord, view: ViewName): CalEvent[] {
  const startString = item.occurrenceStart || '';
  const endString = item.occurrenceEnd || '';

  const startMoment = startString ? new Date(startString) : new Date();
  let endMoment = endString ? new Date(endString) : new Date(startMoment.getTime() + 3600000);

  const startValid = !isNaN(startMoment.getTime());
  const endValid = !isNaN(endMoment.getTime());

  if (!endValid || !startValid || endMoment.getTime() <= startMoment.getTime()) {
    endMoment = new Date(startMoment.getTime() + 3600000);
  }

  const title = item.name || 'Webinar';
  const id = item.id || item._id || '';
  const url = buildWebinarUrl(id);

  // For week/day/agenda views return a single event as-is
  if (view !== 'month') {
    return [
      {
        title,
        url,
        webinarId: id,
        start: startMoment,
        end: endMoment,
        actualStart: startMoment,
        actualEnd: endMoment,
      },
    ];
  }

  // Month view: split multi-day occurrences into one segment per day
  const startDay = startOfDay(startMoment);
  const lastDay = startOfDay(endMoment);
  const dayCount = diffDays(lastDay, startDay) + 1;

  const out: CalEvent[] = [];
  for (let index = 0; index < dayCount; index++) {
    const cursor = addDays(startDay, index);
    const isStartDay = isSameDay(cursor, startMoment);
    const isEndDay = isSameDay(cursor, endMoment);
    const segmentStart = isStartDay ? new Date(startMoment) : startOfDay(cursor);
    const segmentEnd = isEndDay ? new Date(endMoment) : endOfDay(cursor);

    if (!(segmentEnd.getTime() > segmentStart.getTime())) continue;

    out.push({
      title,
      url,
      webinarId: id,
      start: segmentStart,
      end: segmentEnd,
      actualStart: startMoment,
      actualEnd: endMoment,
    });
  }
  return out;
}

async function fetchWebinars(rangeStart: Date, rangeEnd: Date, view: ViewName): Promise<CalEvent[]> {
  const startTime = rangeStart.toISOString();
  const endTime = rangeEnd.toISOString();

  const qs = `filter[startTime]=${startTime}&filter[endTime]=${endTime}`;

  const res = await fetch(`${PAGEPILOT_API_HOST}/tenant/${DEMO_APPLICATION_ID}/get-webinars-schedule?${qs}`);
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);

  const payload = await res.json();
  const items: WebinarRecord[] = payload?.occurrences ?? [];

  return items.flatMap((item) => generateEventsFromItem(item, view));
}

// ─── Formatting ────────────────────────────────────────────────────────────

const WEEKDAY_LABELS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const MONTH_LABELS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const DAY_LABELS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function fmtTime(d: Date) {
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' }).toLowerCase();
}
function fmtDateLong(d: Date) {
  const dayName = DAY_LABELS[d.getDay()];
  const month = MONTH_LABELS[d.getMonth()];
  const day = d.getDate();
  const suffix = day % 10 === 1 && day !== 11 ? 'st' : day % 10 === 2 && day !== 12 ? 'nd' : day % 10 === 3 && day !== 13 ? 'rd' : 'th';
  return `${dayName}, ${month} ${day}${suffix}`;
}

// ─── State ──────────────────────────────────────────────────────────────────

const view = ref<ViewName>('month');
const date = ref(new Date());
const events = ref<CalEvent[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

const selectedEvent = ref<CalEvent | null>(null);
const moreEvents = ref<CalEvent[]>([]);
const moreDate = ref<Date | null>(null);

async function load(d: Date, v: ViewName) {
  loading.value = true;
  error.value = null;
  try {
    const { start, end } = buildRange(d, v);
    events.value = await fetchWebinars(start, end, v);
  } catch (e: any) {
    error.value = e?.message || 'Could not load schedule';
    events.value = [];
  } finally {
    loading.value = false;
  }
}

watch([date, view], () => { load(date.value, view.value); });
onMounted(() => { load(date.value, view.value); });

function handleClose() {
  selectedEvent.value = null;
  moreEvents.value = [];
  moreDate.value = null;
}

function goToday() {
  date.value = new Date();
}
function goPrev() {
  if (view.value === 'month') date.value = new Date(date.value.getFullYear(), date.value.getMonth() - 1, 1);
  else if (view.value === 'week') date.value = addDays(date.value, -7);
  else date.value = addDays(date.value, -1);
}
function goNext() {
  if (view.value === 'month') date.value = new Date(date.value.getFullYear(), date.value.getMonth() + 1, 1);
  else if (view.value === 'week') date.value = addDays(date.value, 7);
  else date.value = addDays(date.value, 1);
}
function setView(v: ViewName) {
  view.value = v;
}
function drillDown(d: Date) {
  date.value = d;
  view.value = 'day';
}

const toolbarLabel = computed(() => {
  const d = date.value;
  if (view.value === 'month') return `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
  if (view.value === 'week') {
    const s = startOfWeek(d);
    const e = endOfWeek(d);
    const sameMonth = s.getMonth() === e.getMonth();
    return sameMonth
      ? `${MONTH_LABELS[s.getMonth()]} ${s.getDate()} – ${e.getDate()}, ${e.getFullYear()}`
      : `${MONTH_LABELS[s.getMonth()]} ${s.getDate()} – ${MONTH_LABELS[e.getMonth()]} ${e.getDate()}, ${e.getFullYear()}`;
  }
  if (view.value === 'day') return `${DAY_LABELS[d.getDay()]}, ${MONTH_LABELS[d.getMonth()]} ${d.getDate()}, ${d.getFullYear()}`;
  return `Agenda — ${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`;
});

// Month grid: 6 rows x 7 days, always starting on Sunday of the first week.
const MAX_VISIBLE_PER_DAY = 3;

const monthWeeks = computed(() => {
  if (view.value !== 'month') return [];
  const gridStart = startOfWeek(startOfMonth(date.value));
  const weeks: { date: Date; inMonth: boolean; dayEvents: CalEvent[] }[][] = [];
  let cursor = gridStart;
  for (let w = 0; w < 6; w++) {
    const row: { date: Date; inMonth: boolean; dayEvents: CalEvent[] }[] = [];
    for (let d = 0; d < 7; d++) {
      const cellDate = cursor;
      const dayEvents = events.value
        .filter((ev) => isSameDay(ev.start, cellDate))
        .sort((a, b) => a.start.getTime() - b.start.getTime());
      row.push({ date: cellDate, inMonth: cellDate.getMonth() === date.value.getMonth(), dayEvents });
      cursor = addDays(cursor, 1);
    }
    weeks.push(row);
  }
  return weeks;
});

const weekDays = computed(() => {
  if (view.value !== 'week') return [];
  const s = startOfWeek(date.value);
  return Array.from({ length: 7 }, (_, i) => {
    const d = addDays(s, i);
    const dayEvents = events.value
      .filter((ev) => isSameDay(ev.start, d))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
    return { date: d, dayEvents };
  });
});

const dayEvents = computed(() => {
  if (view.value !== 'day') return [];
  return events.value
    .filter((ev) => isSameDay(ev.start, date.value))
    .sort((a, b) => a.start.getTime() - b.start.getTime());
});

const agendaEvents = computed(() => {
  if (view.value !== 'agenda') return [];
  return [...events.value].sort((a, b) => a.start.getTime() - b.start.getTime());
});

function isToday(d: Date) {
  return isSameDay(d, new Date());
}

function onShowMore(dayEventsList: CalEvent[], d: Date) {
  moreEvents.value = dayEventsList;
  moreDate.value = d;
  selectedEvent.value = null;
}

function onSelectEvent(ev: CalEvent) {
  selectedEvent.value = ev;
  moreEvents.value = [];
  moreDate.value = null;
}

const dialogItems = computed(() => (selectedEvent.value ? [selectedEvent.value] : moreEvents.value));
const dialogOpen = computed(() => dialogItems.value.length > 0);

function joinWebinar(url: string) {
  window.open(url, '_blank');
}
</script>

<template>
  <div class="overflow-hidden border border-slate-200 bg-white">
    <!-- Session dialog -->
    <div
      v-if="dialogOpen"
      class="fixed inset-0 z-50 flex items-center justify-center p-4"
      @click="handleClose"
    >
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        class="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white shadow-2xl"
        @click.stop
      >
        <button
          type="button"
          @click="handleClose"
          class="absolute right-3 top-3 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-slate-500 shadow-sm transition hover:bg-slate-100 hover:text-slate-800"
          aria-label="Close"
        >
          <XIcon class="h-4 w-4" />
        </button>

        <div class="flex justify-center bg-slate-50 py-8">
          <div class="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-lg">
            <CalendarIcon class="h-8 w-8 text-brand" />
          </div>
        </div>

        <div class="max-h-[60vh] overflow-y-auto px-6 py-6">
          <div v-if="moreDate && !selectedEvent" class="mb-4">
            <p class="text-base font-bold text-slate-800">{{ fmtDateLong(moreDate) }}</p>
            <p class="text-sm text-slate-400">
              {{ dialogItems.length }} webinar{{ dialogItems.length !== 1 ? 's' : '' }}
            </p>
          </div>

          <div class="space-y-6">
            <div
              v-for="(item, i) in dialogItems"
              :key="i"
              :class="i > 0 ? 'border-t border-slate-100 pt-6' : ''"
            >
              <p class="text-base font-bold text-slate-800">{{ item.title }}</p>
              <p class="mt-1 text-sm text-slate-500">
                {{ fmtDateLong(item.actualStart) }} at {{ fmtTime(item.actualStart) }}
                –
                {{ fmtTime(item.actualEnd) }}
              </p>
              <div class="mt-3 flex items-center gap-2 overflow-hidden">
                <LinkIcon class="h-4 w-4 shrink-0 text-brand" />
                <a
                  :href="item.url"
                  target="_blank"
                  rel="noreferrer"
                  class="truncate text-sm text-brand underline underline-offset-2 hover:text-brand-dark"
                >
                  {{ item.url }}
                </a>
              </div>
              <button
                type="button"
                @click="joinWebinar(item.url)"
                class="mt-4 w-full rounded-lg bg-brand py-2.5 text-sm font-bold text-white transition-colors hover:bg-brand-dark"
              >
                Join webinar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="relative">
      <div v-if="loading" class="absolute inset-0 z-10 flex items-center justify-center bg-white/70">
        <SpinnerIcon class="h-7 w-7 animate-spin text-brand" />
      </div>

      <p v-if="error" class="p-6 text-sm text-rose-600">{{ error }}</p>

      <div v-else class="rbc-calendar" style="height: 580px; display: flex; flex-direction: column">
        <!-- Toolbar -->
        <div class="rbc-toolbar">
          <span class="rbc-btn-group">
            <button type="button" @click="goToday">Today</button>
            <button type="button" @click="goPrev">Back</button>
            <button type="button" @click="goNext">Next</button>
          </span>
          <span class="rbc-toolbar-label">{{ toolbarLabel }}</span>
          <span class="rbc-btn-group">
            <button type="button" :class="{ 'rbc-active': view === 'month' }" @click="setView('month')">Month</button>
            <button type="button" :class="{ 'rbc-active': view === 'week' }" @click="setView('week')">Week</button>
            <button type="button" :class="{ 'rbc-active': view === 'day' }" @click="setView('day')">Day</button>
            <button type="button" :class="{ 'rbc-active': view === 'agenda' }" @click="setView('agenda')">Agenda</button>
          </span>
        </div>

        <!-- Month view -->
        <div v-if="view === 'month'" class="rbc-month-view" style="flex: 1; display: flex; flex-direction: column">
          <div class="rbc-month-header" style="display: grid; grid-template-columns: repeat(7, 1fr)">
            <div v-for="wd in WEEKDAY_LABELS" :key="wd" class="rbc-header" style="text-align: center">{{ wd }}</div>
          </div>
          <div
            v-for="(weekRow, wi) in monthWeeks"
            :key="wi"
            class="rbc-month-row"
            style="flex: 1; display: grid; grid-template-columns: repeat(7, 1fr); min-height: 90px"
          >
            <div
              v-for="cell in weekRow"
              :key="cell.date.toISOString()"
              class="rbc-day-bg"
              :class="{ 'rbc-today': isToday(cell.date), 'rbc-off-range-bg': !cell.inMonth }"
              style="border: 1px solid; padding: 2px; display: flex; flex-direction: column; overflow: hidden; cursor: pointer"
              @click="drillDown(cell.date)"
            >
              <div class="rbc-date-cell" :class="{ 'rbc-now': isToday(cell.date) }">
                {{ cell.date.getDate() }}
              </div>
              <div style="flex: 1; overflow: hidden">
                <div
                  v-for="(ev, ei) in cell.dayEvents.slice(0, MAX_VISIBLE_PER_DAY)"
                  :key="ei"
                  class="rbc-event"
                  @click.stop="onSelectEvent(ev)"
                >
                  <div class="py-0.5">
                    <span class="block truncate text-[0.72rem] font-bold leading-tight text-brand">
                      {{ fmtTime(ev.actualStart) }} – {{ ev.title }}
                    </span>
                  </div>
                </div>
                <button
                  v-if="cell.dayEvents.length > MAX_VISIBLE_PER_DAY"
                  type="button"
                  class="rbc-show-more"
                  @click.stop="onShowMore(cell.dayEvents, cell.date)"
                >
                  +{{ cell.dayEvents.length - MAX_VISIBLE_PER_DAY }} more
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Week view -->
        <div v-else-if="view === 'week'" class="rbc-time-view" style="flex: 1; display: flex; flex-direction: column; overflow-y: auto">
          <div class="rbc-time-header" style="display: grid; grid-template-columns: repeat(7, 1fr)">
            <div v-for="d in weekDays" :key="d.date.toISOString()" class="rbc-header" style="text-align: center; padding: 8px 0">
              <div :class="isToday(d.date) ? 'font-bold text-brand' : ''">
                {{ WEEKDAY_LABELS[d.date.getDay()] }} {{ d.date.getDate() }}
              </div>
            </div>
          </div>
          <div class="rbc-time-content" style="display: grid; grid-template-columns: repeat(7, 1fr); flex: 1">
            <div
              v-for="d in weekDays"
              :key="'body-' + d.date.toISOString()"
              class="rbc-day-bg"
              :class="{ 'rbc-today': isToday(d.date) }"
              style="border: 1px solid; padding: 6px; cursor: pointer"
              @click="drillDown(d.date)"
            >
              <div
                v-for="(ev, ei) in d.dayEvents"
                :key="ei"
                class="rbc-event"
                @click.stop="onSelectEvent(ev)"
              >
                <span class="block truncate text-[0.72rem] font-bold leading-tight text-brand">
                  {{ fmtTime(ev.actualStart) }} – {{ ev.title }}
                </span>
              </div>
              <p v-if="!d.dayEvents.length" class="text-xs text-slate-300">—</p>
            </div>
          </div>
        </div>

        <!-- Day view -->
        <div v-else-if="view === 'day'" class="rbc-time-view" style="flex: 1; overflow-y: auto; padding: 12px">
          <div v-if="!dayEvents.length" class="p-6 text-center text-sm text-slate-400">
            No webinars scheduled on this day.
          </div>
          <div v-else class="space-y-2">
            <div
              v-for="(ev, ei) in dayEvents"
              :key="ei"
              class="rbc-event cursor-pointer rounded-md px-2 py-2"
              @click="onSelectEvent(ev)"
            >
              <span class="block text-sm font-bold leading-tight text-brand">
                {{ fmtTime(ev.actualStart) }} – {{ fmtTime(ev.actualEnd) }} · {{ ev.title }}
              </span>
            </div>
          </div>
        </div>

        <!-- Agenda view -->
        <div v-else class="rbc-agenda-view" style="flex: 1; overflow-y: auto">
          <table class="rbc-agenda-table w-full">
            <thead>
              <tr>
                <th class="px-3 py-2 text-left">Date</th>
                <th class="px-3 py-2 text-left">Time</th>
                <th class="px-3 py-2 text-left">Event</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="!agendaEvents.length">
                <td colspan="3" class="px-3 py-6 text-center text-sm text-slate-400">
                  No webinars scheduled in this range.
                </td>
              </tr>
              <tr
                v-for="(ev, ei) in agendaEvents"
                :key="ei"
                class="cursor-pointer hover:bg-slate-50"
                @click="onSelectEvent(ev)"
              >
                <td class="rbc-agenda-date-cell px-3 py-2">{{ fmtDateLong(ev.actualStart) }}</td>
                <td class="rbc-agenda-time-cell px-3 py-2">{{ fmtTime(ev.actualStart) }} – {{ fmtTime(ev.actualEnd) }}</td>
                <td class="rbc-agenda-event-cell px-3 py-2">{{ ev.title }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
