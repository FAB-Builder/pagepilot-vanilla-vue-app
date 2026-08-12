<script setup lang="ts">
/**
 * Standard callout explaining where to get a workspace id. Shown on every
 * page that documents an API call, so the answer is always one scroll away
 * and worded identically everywhere.
 */
import WorkspaceIdLink from './WorkspaceIdLink.vue';
</script>

<template>
  <div class="my-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
    <strong class="text-ink">Where to find your workspace id:</strong> open the Page Pilot
    app at <WorkspaceIdLink /> and select your workspace — the long string that appears in the
    address bar is the id. It isn't sensitive; it shows up in every dashboard URL.
  </div>
</template>
