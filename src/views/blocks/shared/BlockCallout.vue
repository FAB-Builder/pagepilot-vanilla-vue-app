<script setup lang="ts">
/**
 * Tinted callout box used across the block documentation pages.
 * Extracted from the Button page so every block doc shares one implementation.
 */
withDefaults(
  defineProps<{
    title?: string;
    variant?: 'info' | 'tip' | 'warning';
  }>(),
  {
    variant: 'info',
  },
);

const colors = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  tip: 'border-green-200 bg-green-50 text-green-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
};
</script>

<template>
  <div :class="`my-4 rounded-xl border p-4 text-sm ${colors[variant]}`">
    <p v-if="title" class="mb-1 font-semibold">{{ title }}</p>
    <div class="leading-relaxed">
      <slot />
    </div>
  </div>
</template>
