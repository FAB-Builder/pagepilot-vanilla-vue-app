<script setup lang="ts">
export interface ApiRow {
  property: string;
  description: string;
  type: string;
  default?: string;
}

defineProps<{
  rows: ApiRow[];
}>();
</script>

<template>
  <div class="scroll-slim overflow-x-auto rounded-xl border border-slate-200">
    <table class="w-full border-collapse text-sm">
      <thead>
        <tr class="bg-slate-50 text-left text-slate-500">
          <th class="whitespace-nowrap border-b border-slate-200 px-4 py-2.5 font-semibold">
            Property
          </th>
          <th class="border-b border-slate-200 px-4 py-2.5 font-semibold">Description</th>
          <th class="whitespace-nowrap border-b border-slate-200 px-4 py-2.5 font-semibold">
            Type
          </th>
          <th class="whitespace-nowrap border-b border-slate-200 px-4 py-2.5 font-semibold">
            Default
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.property" class="align-top last:[&>td]:border-b-0">
          <td class="border-b border-slate-200 px-4 py-2.5">
            <code
              class="inline-block whitespace-nowrap rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand"
            >
              {{ row.property }}
            </code>
          </td>
          <td class="border-b border-slate-200 px-4 py-2.5 leading-relaxed text-slate-600">
            {{ row.description }}
          </td>
          <td class="border-b border-slate-200 px-4 py-2.5">
            <code class="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[13px] text-emerald-700">
              {{ row.type }}
            </code>
          </td>
          <td class="border-b border-slate-200 px-4 py-2.5">
            <code v-if="row.default" class="font-mono text-[13px] text-slate-700">{{ row.default }}</code>
            <span v-else class="text-slate-400">—</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
