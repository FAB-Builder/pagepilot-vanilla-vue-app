<script setup lang="ts">
import { ref } from 'vue';
import { Sparkles, Check, Copy, ChevronDown, ChevronUp } from '@lucide/vue';
import { useToast } from '../composables/useToast';

const props = withDefaults(
  defineProps<{
    /** The full prompt copied to the clipboard / shown when expanded. */
    prompt: string;
    /** Optional id prefix so multiple blocks on a page stay unique. */
    id?: string;
  }>(),
  {
    id: 'ai-prompt',
  },
);

const { show } = useToast();
const copied = ref(false);
const open = ref(false);

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.prompt);
    copied.value = true;
    show('AI prompt copied to clipboard');
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    /* clipboard unavailable — no-op */
  }
};
</script>

<template>
  <div
    :id="id"
    class="mb-6 overflow-hidden rounded-xl border border-brand/20 bg-gradient-to-b from-brand-tint/70 to-white shadow-card"
  >
    <div class="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-start gap-3">
        <div class="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand text-white">
          <Sparkles :size="17" />
        </div>
        <div>
          <p class="text-sm font-semibold text-ink">Integrate using AI</p>
          <p class="mt-0.5 text-sm leading-relaxed text-slate-500">
            Copy this prompt into Cursor, Claude, or GitHub Copilot and let it wire PagePilot
            into your codebase, step by step.
          </p>
        </div>
      </div>
      <button
        :id="`${id}-copy`"
        type="button"
        @click="handleCopy"
        class="flex shrink-0 items-center gap-1.5 self-start rounded-lg bg-brand px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark sm:self-center"
      >
        <Check v-if="copied" :size="15" />
        <Copy v-else :size="15" />
        {{ copied ? 'Prompt copied' : 'Copy AI prompt' }}
      </button>
    </div>

    <button
      :id="`${id}-toggle`"
      type="button"
      @click="open = !open"
      :aria-expanded="open"
      class="flex w-full items-center gap-1.5 border-t border-brand/15 px-5 py-2.5 text-xs font-medium text-brand transition-colors hover:bg-brand-tint"
    >
      <ChevronUp v-if="open" :size="14" />
      <ChevronDown v-else :size="14" />
      {{ open ? 'Hide prompt' : 'Preview prompt' }}
    </button>

    <pre
      v-if="open"
      class="max-h-80 overflow-auto whitespace-pre-wrap border-t border-brand/15 bg-slate-900 px-5 py-4 font-mono text-[12.5px] leading-relaxed text-slate-100"
    >{{ prompt }}</pre>
  </div>
</template>
