<script setup lang="ts">
import { Check } from '@lucide/vue';
import { useToast } from '../composables/useToast';

const { message, visible } = useToast();
</script>

<template>
  <div
    aria-live="polite"
    class="fixed bottom-6 left-1/2 z-50 -translate-x-1/2 transition-all duration-300"
    :class="visible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0 pointer-events-none'"
  >
    <div class="flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-soft">
      <Check :size="15" class="text-emerald-400 shrink-0" />
      {{ message }}
    </div>
  </div>
</template>
