<script setup lang="ts">
import { ArrowRight } from '@lucide/vue';
import { navItems, type NavItem } from '../navItems';
import { BLOCKS_SUBMODULES } from './blocks/subModules';
import { PAGES_SUBMODULES } from './pages/subModules';
import { PAGEPILOT_APP_URL } from '../lib/ahd';

/**
 * Home page groups the modules by what a reader is trying to do, rather than
 * listing all of them in one flat grid. Each group is defined by the routes
 * it contains, so the cards themselves still come from `navItems` — there's
 * one source of truth for a module's label, description and icon.
 */
const GROUPS: { title: string; blurb: string; routes: string[] }[] = [
  {
    title: 'Content & pages',
    blurb: 'Author pages in the visual editor and pull them into your app.',
    routes: ['/pages', '/blocks', '/forms'],
  },
  {
    title: 'Navigation',
    blurb: 'In-product help, configured without code changes.',
    routes: ['/context-help-menu'],
  },
  {
    title: 'Onboarding & engagement',
    blurb: 'Guide, announce, and show your product in action.',
    routes: ['/tours', '/tooltips', '/demos', '/app-banner', '/webinar'],
  },
];

const byRoute = new Map(navItems.map((item) => [item.to, item]));

/** Small count chip shown on the cards that lead to a sub-module list. */
const COUNTS: Record<string, string> = {
  '/blocks': `${BLOCKS_SUBMODULES.length} blocks`,
  '/pages': `${PAGES_SUBMODULES.length} guides`,
};

const grouped = new Set(GROUPS.flatMap((g) => g.routes));
const ungrouped = navItems.filter((item) => !grouped.has(item.to));

function groupItems(routes: string[]): NavItem[] {
  return routes
    .map((route) => byRoute.get(route))
    .filter((item): item is NavItem => Boolean(item));
}
</script>

<template>
  <div class="mx-auto max-w-7xl">
    <!-- ── Hero ── -->
    <section class="relative overflow-hidden pb-12 pt-6 text-center">
      <!-- Soft brand glow behind the headline. Decorative only. -->
      <div
        aria-hidden="true"
        class="pointer-events-none absolute left-1/2 top-0 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl"
      />
      <div class="relative">
        <div class="mb-5 inline-flex items-center gap-2 rounded-full border border-brand/20 bg-brand-tint px-3.5 py-1 text-xs font-semibold text-brand">
          Page Pilot · Developer Playground
        </div>
        <h1 class="text-4xl font-extrabold tracking-tight text-ink sm:text-5xl">
          Build smarter in-app experiences
        </h1>
        <p class="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
          Explore live demos of Page Pilot components — tours, tooltips, help
          menus, and more — ready to drop into any Vue application.
        </p>
        <div class="mt-7 flex flex-wrap justify-center gap-3">
          <RouterLink
            to="/tours"
            class="inline-flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-brand-dark"
          >
            Explore demos
            <ArrowRight :size="15" />
          </RouterLink>
          <a
            :href="PAGEPILOT_APP_URL"
            target="_blank"
            rel="noreferrer"
            class="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-300 hover:bg-slate-50"
          >
            Open Page Pilot
          </a>
        </div>
      </div>
    </section>

    <!-- ── Grouped modules ── -->
    <section v-for="group in GROUPS" :key="group.title" class="mb-12">
      <template v-if="groupItems(group.routes).length > 0">
        <div class="mb-5 border-b border-slate-200 pb-3">
          <h2 class="text-lg font-bold text-ink">{{ group.title }}</h2>
          <p class="mt-1 text-sm text-muted">{{ group.blurb }}</p>
        </div>
        <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <RouterLink
            v-for="item in groupItems(group.routes)"
            :key="item.to"
            :to="item.to"
            class="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-soft"
          >
            <div class="flex items-start justify-between gap-3">
              <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
                <component :is="item.icon" class="h-[22px] w-[22px]" />
              </span>
              <span
                v-if="COUNTS[item.to]"
                class="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-muted"
              >
                {{ COUNTS[item.to] }}
              </span>
            </div>

            <div class="flex flex-1 flex-col gap-1.5">
              <span class="text-base font-bold text-ink">{{ item.label }}</span>
              <span class="text-sm leading-relaxed text-muted">{{ item.description }}</span>
            </div>

            <span class="flex items-center gap-1 text-sm font-semibold text-brand">
              {{ item.to === '/webinar' ? 'View docs' : 'View demo' }}
              <ArrowRight :size="14" class="transition-transform duration-200 group-hover:translate-x-1" />
            </span>
          </RouterLink>
        </div>
      </template>
    </section>

    <section v-if="ungrouped.length > 0" class="mb-12">
      <div class="mb-5 border-b border-slate-200 pb-3">
        <h2 class="text-lg font-bold text-ink">More</h2>
      </div>
      <div class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="item in ungrouped"
          :key="item.to"
          :to="item.to"
          class="group relative flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-soft"
        >
          <div class="flex items-start justify-between gap-3">
            <span class="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-tint text-brand transition-colors duration-200 group-hover:bg-brand group-hover:text-white">
              <component :is="item.icon" class="h-[22px] w-[22px]" />
            </span>
            <span
              v-if="COUNTS[item.to]"
              class="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-muted"
            >
              {{ COUNTS[item.to] }}
            </span>
          </div>

          <div class="flex flex-1 flex-col gap-1.5">
            <span class="text-base font-bold text-ink">{{ item.label }}</span>
            <span class="text-sm leading-relaxed text-muted">{{ item.description }}</span>
          </div>

          <span class="flex items-center gap-1 text-sm font-semibold text-brand">
            {{ item.to === '/webinar' ? 'View docs' : 'View demo' }}
            <ArrowRight :size="14" class="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        </RouterLink>
      </div>
    </section>
  </div>
</template>
