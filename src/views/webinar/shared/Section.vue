<script setup lang="ts">
/**
 * Webinar-page-local Section helper — distinct from the global
 * components/doc/Section.vue. Mirrors React's local shared.tsx Section.
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
