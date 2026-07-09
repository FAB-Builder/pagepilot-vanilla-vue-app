<script setup lang="ts">
/**
 * Port of React's CalendarSection.tsx `CalendarViewSection` export. Split
 * into its own SFC (mirroring ScheduleApiSection.vue) since a single Vue
 * SFC can only export one component.
 */
import CalendarDemo from './CalendarDemo.vue';
import AiPromptBlock from '../../components/AiPromptBlock.vue';
import Section from './shared/Section.vue';
import Code from './shared/Code.vue';
import { LEAD_APPLICATION_ID, PAGEPILOT_APP_URL } from '../../lib/ahd';

const CALENDAR_AI_PROMPT = `Build a WebinarCalendar Vue 3 component using a calendar UI and the Page Pilot schedule API.

API
- Endpoint: GET https://pagepilot.fabbuilder.com/api/tenant/${LEAD_APPLICATION_ID}/get-webinars-schedule?filter[startTime]=<ISO_8601_UTC>&filter[endTime]=<ISO_8601_UTC>
- Replace ${LEAD_APPLICATION_ID} with my workspace id (found in Page Pilot: ${PAGEPILOT_APP_URL}).
- Response: { occurrences: [{ _id, name, occurrenceStart, occurrenceEnd }] }

Requirements
- Support Month, Week, Day, and Agenda views
- Re-fetch on every view or date navigation, deriving filter[startTime]/filter[endTime] from the visible range
- Pass the date range filters as literal bracket-notation query params (not URLSearchParams — it percent-encodes the brackets and the server ignores them)
- Map each occurrence to { title: name, start: new Date(occurrenceStart), end: new Date(occurrenceEnd) }
- Show a loading overlay while fetching
- Handle errors gracefully with a visible error state`;
</script>

<template>
  <Section id="calendar" title="Calendar view">
    <p>
      Webinar sessions — including every individual occurrence of a recurring webinar — can
      be rendered on a full interactive calendar. The live demo below is powered by the
      Page Pilot demo workspace.
    </p>
    <p>
      Switch between <strong>Month</strong>, <strong>Week</strong>, <strong>Day</strong>,
      and <strong>Agenda</strong> views. Navigate forward and backward to see how occurrences
      are distributed across the schedule.
    </p>
    <AiPromptBlock id="calendar-view-ai-prompt" :prompt="CALENDAR_AI_PROMPT" />
    <CalendarDemo />
  </Section>
</template>
