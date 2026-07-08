<script setup lang="ts">
/**
 * A titled documentation section with an anchor id (used by DocLayout's
 * scroll-spy) and a divider heading. Shared across doc pages.
 */
defineProps<{
  id: string;
  title: string;
}>();
</script>

<template>
  <section :id="id" class="mb-12 scroll-mt-24">
    <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">{{ title }}</h2>
    <div class="space-y-3 leading-relaxed text-slate-600">
      <slot />
    </div>
  </section>
</template>
