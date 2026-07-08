<script setup lang="ts">
/** A meta strip describing a single tour property (type / required / default). */
defineProps<{
  /** e.g. "string", "string[]", "'top' | 'bottom' | 'left' | 'right'" */
  type: string;
  required?: boolean;
  defaultValue?: string;
}>();
</script>

<template>
  <div class="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
    <div class="mb-2 flex flex-wrap items-center gap-2 text-xs">
      <span class="rounded-md bg-emerald-50 px-2 py-0.5 font-mono text-emerald-700">
        {{ type }}
      </span>
      <span v-if="required" class="rounded-md bg-rose-50 px-2 py-0.5 font-medium text-rose-600">
        required
      </span>
      <span v-else class="rounded-md bg-slate-200 px-2 py-0.5 font-medium text-slate-600">
        optional
      </span>
      <span v-if="defaultValue" class="text-slate-500">
        default: <code class="font-mono text-slate-700">{{ defaultValue }}</code>
      </span>
    </div>
    <div class="text-sm leading-relaxed text-slate-600">
      <slot />
    </div>
  </div>
</template>
