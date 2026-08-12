<script setup lang="ts">
/**
 * Link to the Page Pilot app, where a user finds their workspace id.
 * Use inline, mid-sentence.
 */
import { PAGEPILOT_APP_URL } from '../lib/ahd';

withDefaults(
  defineProps<{
    label?: string;
  }>(),
  {
    label: 'pagepilot.fabbuilder.com/tenant',
  },
);
</script>

<template>
  <a
    :href="PAGEPILOT_APP_URL"
    target="_blank"
    rel="noreferrer"
    class="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
  >
    {{ label }}
  </a>
</template>
