<script setup lang="ts">
/**
 * Port of React's CalendarSection.tsx `ScheduleApiSection` export. Split
 * into its own SFC (mirroring CalendarViewSection.vue) since a single Vue
 * SFC can only export one component.
 */
import DemoBlock from '../../components/DemoBlock.vue';
import AiPromptBlock from '../../components/AiPromptBlock.vue';
import Section from './shared/Section.vue';
import Code from './shared/Code.vue';
import { LEAD_APPLICATION_ID, PAGEPILOT_APP_URL } from '../../lib/ahd';

const SCHEDULE_ENDPOINT_CODE = `GET https://pagepilot.fabbuilder.com/api/tenant/${LEAD_APPLICATION_ID}/get-webinars-schedule?filter[startTime]=2026-06-01T00:00:00.000Z&filter[endTime]=2026-06-30T23:59:59.999Z`;

const SCHEDULE_API_AI_PROMPT = `Build a reusable useWebinarSchedule Vue 3 composable for the Page Pilot schedule API.

API
- Endpoint: GET https://pagepilot.fabbuilder.com/api/tenant/${LEAD_APPLICATION_ID}/get-webinars-schedule?filter[startTime]=<ISO_8601_UTC>&filter[endTime]=<ISO_8601_UTC>
- Replace ${LEAD_APPLICATION_ID} with my workspace id (found in Page Pilot: ${PAGEPILOT_APP_URL}).
- Response: { occurrences: [{ _id, name, occurrenceStart, occurrenceEnd }] }

Requirements
- Accept startTime and endTime (ISO 8601 UTC) as parameters
- Return { occurrences, loading, error }
- Pass the date filters as literal bracket-notation query params (not URLSearchParams — it percent-encodes the brackets and the server ignores them)
- Abort in-flight requests on re-fetch using AbortController`;

const SCHEDULE_RESPONSE_CODE = `{
  "occurrences": [
    {
      "_id": "664a1f2e9b3c4e001f8a7d12",
      "name": "Product Deep Dive",
      "occurrenceStart": "2026-06-10T14:00:00.000Z",
      "occurrenceEnd":   "2026-06-10T15:30:00.000Z"
    },
    {
      "_id": "664a1f2e9b3c4e001f8a7d13",
      "name": "Onboarding Live",
      "occurrenceStart": "2026-06-18T09:00:00.000Z",
      "occurrenceEnd":   "2026-06-18T10:00:00.000Z"
    }
  ]
}`;

const SCHEDULE_CALENDAR_CODE = `<script setup lang="ts">
import { ref, watch } from 'vue';

// Replace ${LEAD_APPLICATION_ID} with your workspace id.
const WORKSPACE_ID = '${LEAD_APPLICATION_ID}';
const API_BASE = \`https://pagepilot.fabbuilder.com/api/tenant/\${WORKSPACE_ID}\`;

const events = ref([]);
const date = ref(new Date());
const view = ref('month'); // 'month' | 'week' | 'day'

function rangeFor(d, v) {
  const start = new Date(d);
  const end = new Date(d);
  if (v === 'month') {
    start.setDate(1); start.setHours(0, 0, 0, 0);
    end.setMonth(end.getMonth() + 1, 0); end.setHours(23, 59, 59, 999);
  } else if (v === 'week') {
    start.setDate(start.getDate() - start.getDay()); start.setHours(0, 0, 0, 0);
    end.setDate(start.getDate() + 6); end.setHours(23, 59, 59, 999);
  } else {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }
  return { start, end };
}

async function load() {
  const { start, end } = rangeFor(date.value, view.value);

  // Use literal bracket notation — URLSearchParams percent-encodes brackets
  // and the server will ignore the filters.
  const res = await fetch(
    \`\${API_BASE}/get-webinars-schedule?filter[startTime]=\${start.toISOString()}&filter[endTime]=\${end.toISOString()}\`,
  );
  const { occurrences = [] } = await res.json();

  events.value = occurrences.map((item) => ({
    title: item.name,
    start: new Date(item.occurrenceStart),
    end: new Date(item.occurrenceEnd),
  }));
}

watch([date, view], load, { immediate: true });
<\/script>

<template>
  <WebinarCalendar
    :events="events"
    :date="date"
    :view="view"
    @navigate="(d) => (date = d)"
    @update:view="(v) => (view = v)"
    style="height: 600px"
  />
</template>`;
</script>

<template>
  <Section id="schedule-api" title="Schedule API">
    <p>
      The <Code>GET /get-webinars-schedule</Code> endpoint returns every scheduled occurrence
      within a requested time window — including individual recurrences of repeating webinars.
      Each item in the response carries its own <Code>occurrenceStart</Code> and
      <Code>occurrenceEnd</Code> timestamps, ready to map directly to a calendar event without
      any extra computation.
    </p>
    <p>
      Requests are scoped to your <strong>workspace&nbsp;id</strong>. Replace
      <Code>{{ LEAD_APPLICATION_ID }}</Code> in the URL with yours — find it in
      <a
        :href="PAGEPILOT_APP_URL"
        target="_blank"
        rel="noreferrer"
        class="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
      >
        Page Pilot
      </a>
      .
    </p>

    <DemoBlock
      title="Endpoint"
      description="Supply the date range as ISO 8601 UTC strings using bracket-notation query params."
      :code="SCHEDULE_ENDPOINT_CODE"
      language="bash"
    />

    <DemoBlock title="Response" :code="SCHEDULE_RESPONSE_CODE" language="json">
      <template #description>
        The root key is <Code>occurrences</Code>. Each item is a flat object with a stable
        <Code>_id</Code>, display name, and precise start/end timestamps.
      </template>
    </DemoBlock>

    <h3 class="pt-2 text-base font-semibold text-slate-800">Query parameters</h3>
    <div class="overflow-hidden rounded-lg border border-slate-200">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-slate-200 bg-slate-50 text-left">
            <th class="px-4 py-2.5 font-semibold text-slate-700">Parameter</th>
            <th class="px-4 py-2.5 font-semibold text-slate-700">Type</th>
            <th class="px-4 py-2.5 font-semibold text-slate-700">Description</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-slate-100">
          <tr>
            <td class="px-4 py-2.5"><Code>filter[startTime]</Code></td>
            <td class="px-4 py-2.5 text-slate-500">ISO 8601 UTC</td>
            <td class="px-4 py-2.5 text-slate-600">Return only occurrences that end after this time.</td>
          </tr>
          <tr>
            <td class="px-4 py-2.5"><Code>filter[endTime]</Code></td>
            <td class="px-4 py-2.5 text-slate-500">ISO 8601 UTC</td>
            <td class="px-4 py-2.5 text-slate-600">Return only occurrences that start before this time.</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p class="text-xs text-slate-500">
      Pass brackets literally in the URL — do not use <Code>URLSearchParams</Code> as it
      percent-encodes <Code>[</Code> and <Code>]</Code> and the server will ignore the filter.
    </p>

    <h3 class="pt-2 text-base font-semibold text-slate-800">Vue integration</h3>
    <p>
      The component below wires the API to a calendar view. It re-fetches
      automatically whenever the user navigates to a different month, week, or day.
    </p>
    <DemoBlock title="WebinarCalendar component" :code="SCHEDULE_CALENDAR_CODE" language="vue">
      <template #description>
        Fetches <Code>get-webinars-schedule</Code> on every view or date change and maps each
        occurrence to a calendar event.
      </template>
    </DemoBlock>
    <AiPromptBlock id="schedule-api-ai-prompt" :prompt="SCHEDULE_API_AI_PROMPT" />
  </Section>
</template>
