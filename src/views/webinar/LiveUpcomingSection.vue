<script setup lang="ts">
/** Port of React's LiveUpcomingSection.tsx default export. */
import DemoBlock from '../../components/DemoBlock.vue';
import AiPromptBlock from '../../components/AiPromptBlock.vue';
import Section from './shared/Section.vue';
import Code from './shared/Code.vue';
import { LEAD_APPLICATION_ID, PAGEPILOT_APP_URL } from '../../lib/ahd';
import LiveUpcomingDemo from './live-upcoming/LiveUpcomingDemo.vue';

const LIVE_UPCOMING_AI_PROMPT = `Build a live and upcoming webinar widget using the Page Pilot API.

API
- Upcoming: GET https://pagepilot.fabbuilder.com/api/tenant/${LEAD_APPLICATION_ID}/webinars/upcoming?inNextHours=36
- Currently running: GET https://pagepilot.fabbuilder.com/api/tenant/${LEAD_APPLICATION_ID}/webinars/currently-running
- Replace ${LEAD_APPLICATION_ID} with my workspace id (found in Page Pilot: ${PAGEPILOT_APP_URL}).
- Both endpoints return an array of { event: { _id, name, startDate, endDate }, nextOccurrence }.
- Viewer URL pattern: https://webinar-fab-builder.web.app/?w=<EVENT_ID>&type=webinar

Requirements
- Fetch both endpoints in parallel using Promise.all
- Show a "Live now" panel with an animated green ping indicator and a "Join now" button
- Show an "Upcoming" panel with a live countdown timer (days / hours / mins / secs) and a "Register" button
- Both buttons link to the viewer URL using event._id
- Auto-refresh every 60 seconds
- Handle loading and empty states for each panel independently`;

// ── Code snippets ────────────────────────────────────────────────────────────

const UPCOMING_ENDPOINT_CODE = `GET https://pagepilot.fabbuilder.com/api/tenant/${LEAD_APPLICATION_ID}/webinars/upcoming?inNextHours=36`;

const LIVE_ENDPOINT_CODE = `GET https://pagepilot.fabbuilder.com/api/tenant/${LEAD_APPLICATION_ID}/webinars/currently-running`;

const UPCOMING_COMPONENT_CODE = `<script setup lang="ts">
import { ref, onMounted } from 'vue';

// Replace ${LEAD_APPLICATION_ID} with your workspace id.
const WORKSPACE_ID = '${LEAD_APPLICATION_ID}';
const API_BASE = \`https://pagepilot.fabbuilder.com/api/tenant/\${WORKSPACE_ID}\`;

const webinars = ref([]);
const loading = ref(true);

onMounted(() => {
  fetch(\`\${API_BASE}/webinars/upcoming?inNextHours=36\`)
    .then((r) => r.json())
    .then((data) => (webinars.value = Array.isArray(data) ? data : []))
    .finally(() => (loading.value = false));
});
<\/script>

<template>
  <p v-if="loading">Loading…</p>
  <p v-else-if="!webinars.length">No upcoming webinars in the next 36 hours.</p>
  <ul v-else>
    <li v-for="{ event, nextOccurrence } in webinars" :key="event._id">
      <strong>{{ event.name }}</strong> — {{ new Date(nextOccurrence).toLocaleString() }}
    </li>
  </ul>
</template>`;
</script>

<template>
  <Section id="live-upcoming" title="Live & Upcoming API">
    <p>
      Page Pilot exposes two lightweight endpoints that let you surface live
      and upcoming webinar sessions anywhere in your product — a banner, a
      sidebar widget, a notification badge, or a dashboard card.
    </p>
    <p>
      Both endpoints are scoped to your <strong>workspace&nbsp;id</strong>. Replace
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

    <h3 class="pt-2 text-base font-bold text-slate-800">Upcoming webinars</h3>
    <p>
      Returns all sessions whose next occurrence falls within the next
      <Code>inNextHours</Code> hours. Default is <Code>36</Code>. Use this to
      power countdown banners or "starting soon" widgets.
    </p>
    <DemoBlock title="Endpoint" :code="UPCOMING_ENDPOINT_CODE" language="bash">
      <template #description> Pass <Code>inNextHours</Code> to control the look-ahead window. </template>
    </DemoBlock>

    <h3 class="pt-4 text-base font-bold text-slate-800">Currently running</h3>
    <p>
      Returns all sessions that are currently inside their scheduled window —
      i.e. started but not yet ended. Use this to show a live badge or "Join
      now" prompt in real time.
    </p>
    <DemoBlock
      title="Endpoint"
      description="No query params required. Returns sessions happening right now."
      :code="LIVE_ENDPOINT_CODE"
      language="bash"
    />

    <h3 class="pt-4 text-base font-bold text-slate-800">Interactive preview</h3>
    <p>
      The widget below calls both endpoints in real time against the Page
      Pilot demo workspace and renders the results.
    </p>
    <LiveUpcomingDemo />

    <h3 class="pt-4 text-base font-bold text-slate-800">Vue component</h3>
    <DemoBlock title="UpcomingWebinars component" :code="UPCOMING_COMPONENT_CODE" language="vue">
      <template #description>
        Fetches from <Code>/webinars/upcoming</Code> on mount and renders a
        list with name and start time.
      </template>
    </DemoBlock>
    <AiPromptBlock id="live-upcoming-ai-prompt" :prompt="LIVE_UPCOMING_AI_PROMPT" />
  </Section>
</template>
