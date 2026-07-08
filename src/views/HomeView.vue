<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';
import { navItems } from '../navItems';
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <!-- ── Hero ── -->
    <section class="pb-10 pt-4 text-center">
      <div class="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-tint px-3.5 py-1 text-xs font-semibold text-brand mb-5">
        Page Pilot · Developer Playground
      </div>
      <h1 class="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
        Build smarter in-app experiences
      </h1>
      <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
        Explore live demos of Page Pilot components — tours, tooltips, help
        menus, and more — ready to drop into any Vue application.
      </p>
      <div class="mt-7 flex justify-center gap-3">
        <RouterLink
          to="/tours"
          class="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
        >
          Explore demos
          <ArrowRight :size="15" />
        </RouterLink>
        <a
          href="https://pagepilot.fabbuilder.com/"
          target="_blank"
          rel="noreferrer"
          class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
        >
          Open Page Pilot
        </a>
      </div>
    </section>

    <!-- ── Divider ── -->
    <div class="mb-8 flex items-center gap-3">
      <div class="h-px flex-1 bg-slate-200" />
      <span class="text-xs font-semibold uppercase tracking-widest text-slate-400">
        Components
      </span>
      <div class="h-px flex-1 bg-slate-200" />
    </div>

    <!-- ── Cards ── -->
    <section class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:border-brand/40 hover:shadow-lg"
      >
        <!-- Icon -->
        <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
          <component :is="item.icon" class="h-[22px] w-[22px]" />
        </span>

        <!-- Label + description -->
        <div class="flex flex-1 flex-col gap-1.5">
          <span class="text-base font-bold text-ink">
            {{ item.label }}
          </span>
          <span class="text-sm leading-relaxed text-muted">
            {{ item.description }}
          </span>
        </div>

        <!-- Footer CTA -->
        <span class="flex items-center gap-1 text-sm font-semibold text-brand">
          {{ item.to === '/webinar' ? 'View docs' : 'View demo' }}
          <ArrowRight :size="14" class="transition-transform duration-200 group-hover:translate-x-1" />
        </span>
      </RouterLink>
    </section>
  </div>
</template>
