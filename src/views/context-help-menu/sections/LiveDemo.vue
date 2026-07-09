<script setup lang="ts">
/**
 * Section (the trigger button + live drawer live in the page header via
 * OpenHelpButton.vue — this component just anchors the "Live demo" nav
 * entry and prose, matching React's LiveDemo.tsx default export).
 */
import Section from '../../../components/doc/Section.vue';
</script>

<template>
  <Section id="live-demo" title="Live demo">
    <p>
      The drawer above fetches the <strong>fab-docs-site</strong> menu from Page Pilot. Click
      any item to load its full page content inline. The menu is cached in
      <strong>localStorage</strong> for 1 hour so the API is only called once per session.
    </p>
  </Section>
</template>
