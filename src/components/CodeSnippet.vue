<script setup lang="ts">
import { ref, computed } from 'vue';
import { Copy, Check } from '@lucide/vue';
import { useToast } from '../composables/useToast';

const props = withDefaults(
  defineProps<{
    code: string;
    language?: string;
    title?: string;
  }>(),
  {
    language: 'ts',
  },
);

const { show } = useToast();
const copied = ref(false);

const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(props.code);
    copied.value = true;
    show('Code copied to clipboard');
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch {
    /* clipboard unavailable */
  }
};

const lines = computed(() => props.code.split('\n'));
</script>

<template>
  <div class="overflow-hidden rounded-xl border border-slate-800 shadow-sm">
    <div class="flex items-center justify-between border-b border-white/5 bg-[#1e1e2e] px-4 py-2">
      <div class="flex items-center gap-1.5">
        <span class="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span class="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span class="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
        <span class="ml-2 font-mono text-xs text-slate-400">{{ title ?? language }}</span>
      </div>
      <button
        type="button"
        @click="handleCopy"
        class="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs text-slate-300 transition-colors hover:bg-white/10"
      >
        <template v-if="copied">
          <Check :size="13" class="text-emerald-400" /> Copied
        </template>
        <template v-else>
          <Copy :size="13" /> Copy
        </template>
      </button>
    </div>
    <pre class="scroll-slim overflow-x-auto bg-[#181825] py-3"><code class="block font-mono text-[13px] leading-relaxed text-slate-200"><span v-for="(line, idx) in lines" :key="idx" class="flex"><span class="w-10 flex-none select-none pr-4 text-right text-slate-600">{{ idx + 1 }}</span><span class="whitespace-pre pr-4">{{ line || ' ' }}</span></span></code></pre>
  </div>
</template>
