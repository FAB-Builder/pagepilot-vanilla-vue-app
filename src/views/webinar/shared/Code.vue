<script setup lang="ts">
/**
 * Webinar-page-local inline code chip — distinct from the global
 * components/doc/Code.vue. Mirrors React's local shared.tsx Code.
 */
</script>

<template>
  <code
    class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand"
  >
    <slot />
  </code>
</template>
