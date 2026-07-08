<script setup lang="ts">
import { ref } from 'vue';
import { Code2, ChevronUp } from '@lucide/vue';
import CodeSnippet from './CodeSnippet.vue';

withDefaults(
  defineProps<{
    title: string;
    code: string;
    language?: string;
  }>(),
  {
    language: 'ts',
  },
);

const showCode = ref(true);
</script>

<template>
  <div class="mb-6 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-card">
    <div v-if="$slots.default" class="px-6 py-6">
      <slot />
    </div>

    <div class="border-t border-dashed border-slate-200 px-6 pb-4 pt-4">
      <div class="flex items-start justify-between gap-3">
        <div>
          <span class="text-sm font-semibold text-ink">{{ title }}</span>
          <p v-if="$slots.description" class="mt-1 text-sm leading-relaxed text-slate-500">
            <slot name="description" />
          </p>
        </div>
        <button
          type="button"
          @click="showCode = !showCode"
          :aria-expanded="showCode"
          :title="showCode ? 'Hide code' : 'Show code'"
          class="flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-brand"
        >
          <ChevronUp v-if="showCode" :size="14" />
          <Code2 v-else :size="14" />
          {{ showCode ? 'Hide code' : 'Show code' }}
        </button>
      </div>
    </div>

    <div v-if="showCode" class="bg-slate-50 px-6 pb-6 pt-4">
      <CodeSnippet :code="code" :language="language" />
    </div>
  </div>
</template>
