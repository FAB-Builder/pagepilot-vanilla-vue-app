<script setup lang="ts">
import { Construction } from '@lucide/vue';
import DocLayout from './DocLayout.vue';

defineProps<{
  title: string;
  description: string;
}>();
</script>

<template>
  <DocLayout :title="title" :sections="[{ id: 'overview', label: 'Overview' }]">
    <article class="max-w-3xl">
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold">{{ title }}</h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">{{ description }}</p>
      </header>
      <section id="overview" class="scroll-mt-24">
        <div class="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-50 text-amber-500">
            <Construction :size="28" />
          </span>
          <h2 class="mt-4 text-lg font-bold">Demo coming soon</h2>
          <p class="mt-1 text-sm text-slate-500">This section is being built out next.</p>
        </div>
      </section>
    </article>
  </DocLayout>
</template>
