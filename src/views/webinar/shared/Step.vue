<script setup lang="ts">
/**
 * Numbered step list item used in webinar's step-by-step instructions.
 * Mirrors React's local shared.tsx Step.
 */
defineProps<{
  n: number;
}>();
</script>

<template>
  <li class="flex gap-3">
    <span
      class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white"
    >
      {{ n }}
    </span>
    <span><slot /></span>
  </li>
</template>
