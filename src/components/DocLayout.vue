<script setup lang="ts">
/**
 * Ant-Design-style documentation shell. The left rail shows the current
 * page's sub-modules and on-this-page sections (with scroll-spy
 * highlighting); the right rail shows the top-level component list.
 *
 * Port of React's DocLayout.tsx. Spiked vue-router's `route.hash` behavior
 * under `createWebHashHistory()`: for a URL like `.../#/tours#step-id`,
 * `route.path` is `/tours` and `route.hash` is `#step-id` — vue-router's
 * hash-history strips only the leading history-mode `#`, then parses the
 * remainder with normal path/query/hash rules, so the second `#` survives
 * as `route.hash` exactly like React Router's `useLocation().hash`. No
 * fallback to raw `window.location.hash` splitting is needed.
 */
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router';
import { navItems } from '../navItems';
import type { DocSection, SubModule } from '../types/doc';

const props = defineProps<{
  /** The page title shown above the section list. */
  title: string;
  /** Section anchors — drive BOTH the left nav and scroll-spy highlighting. */
  sections: DocSection[];
  /**
   * Optional sub-modules for a parent module (e.g. "Pages" → Fetch Pages,
   * Template Variables). When provided they render as a list in the left
   * rail, above the on-this-page sections.
   */
  subModules?: SubModule[];
  /** Heading shown above the sub-module list. Defaults to the title. */
  subModulesLabel?: string;
}>();

const route = useRoute();

const initialId = () => (route.hash ? route.hash.slice(1) : props.sections[0]?.id);
const activeId = ref(initialId());

function normalizedLinkId(to: string) {
  return to.replace(/\//g, '-').replace(/^-/, '');
}

function onSectionClick(e: MouseEvent, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    activeId.value = id;
    window.history.replaceState(null, '', `#${id}`);
  }
}

// On hash change (including on mount) scroll to the hash section, after the
// DOM is painted, retrying a few times in case content is still rendering.
watch(
  () => route.hash,
  (hash) => {
    if (!hash) return;
    const id = hash.slice(1);

    const attempt = (tries: number) => {
      const el = document.getElementById(id);
      const scrollRoot = document.querySelector('main') as HTMLElement | null;
      if (el && scrollRoot) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        activeId.value = id;
      } else if (tries > 0) {
        setTimeout(() => attempt(tries - 1), 150);
      }
    };
    attempt(5);
  },
  { immediate: true },
);

// Scroll-spy: highlight the active section as the user scrolls `main`.
let scrollRoot: HTMLElement | null = null;
let ticking = false;

function updateActiveFromScroll() {
  ticking = false;
  if (!scrollRoot) return;

  const TRIGGER_OFFSET = 120;

  const els = props.sections
    .map((s) => document.getElementById(s.id))
    .filter((el): el is HTMLElement => Boolean(el));
  if (!els.length) return;

  // If we're scrolled to (or near) the bottom, the last section is active
  // even if it never reaches the trigger line — short trailing sections
  // can't scroll all the way to the top.
  const atBottom = scrollRoot.scrollTop + scrollRoot.clientHeight >= scrollRoot.scrollHeight - 2;
  if (atBottom) {
    const last = els[els.length - 1];
    if (last) {
      activeId.value = last.id;
    }
    return;
  }

  const rootTop = scrollRoot.getBoundingClientRect().top;

  // Active = the last section whose top has crossed the trigger line.
  const first = els[0];
  if (!first) return;
  let current = first.id;
  for (const el of els) {
    const top = el.getBoundingClientRect().top - rootTop;
    if (top <= TRIGGER_OFFSET) current = el.id;
    else break;
  }
  activeId.value = current;
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(updateActiveFromScroll);
}

onMounted(() => {
  scrollRoot = document.querySelector('main');
  if (!scrollRoot) return;
  scrollRoot.addEventListener('scroll', onScroll, { passive: true });
  // When no hash, set active section based on current scroll position
  // immediately. When there's a hash, the hash watcher handles the initial
  // activeId.
  if (!route.hash) updateActiveFromScroll();
});

onUnmounted(() => {
  scrollRoot?.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <div class="flex gap-6 lg:gap-10">
    <!-- Left rail: sub-modules + on-this-page sections for the current page -->
    <aside id="doc-left-rail" class="hidden w-56 shrink-0 lg:block xl:w-64">
      <!-- fixed so it never scrolls with the content; scrollable since 24+ blocks overflow the viewport -->
      <div
        class="scroll-slim fixed top-14 max-h-[calc(100vh-3.5rem)] w-56 overflow-y-auto overscroll-contain pb-6 pr-2 pt-6 xl:w-64"
      >
        <!-- Sub-modules of the current module (e.g. Pages → Fetch Pages) -->
        <template v-if="subModules && subModules.length > 0">
          <span class="mb-2 block px-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted/70">
            {{ subModulesLabel ?? title }}
          </span>
          <nav id="doc-submodule-nav" class="mb-6 flex flex-col gap-0.5">
            <RouterLink
              v-for="sm in subModules"
              :key="sm.to"
              :to="sm.to"
              :id="`submodule-link-${normalizedLinkId(sm.to)}`"
              custom
              v-slot="{ isActive, href, navigate }"
            >
              <a
                :href="href"
                @click="navigate"
                :class="[
                  'flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                  isActive
                    ? 'bg-brand-tint font-semibold text-brand'
                    : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-ink',
                ]"
              >
                <component :is="sm.icon" v-if="sm.icon" class="h-4 w-4 shrink-0 opacity-80" />
                {{ sm.label }}
              </a>
            </RouterLink>
          </nav>
        </template>

        <!-- On-this-page sections for the current component -->
        <span
          :class="[
            'mb-2 block px-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted/70',
            subModules && subModules.length > 0 ? 'border-t border-slate-200/80 pt-5' : '',
          ]"
        >
          {{ title }}
        </span>
        <nav id="doc-section-nav" class="flex flex-col">
          <a
            v-for="s in sections"
            :key="s.id"
            :id="`section-link-${s.id}`"
            :href="`#${s.id}`"
            @click="onSectionClick($event, s.id)"
            :class="[
              'cursor-pointer border-l-2 py-1.5 pl-4 pr-2 text-sm transition-colors',
              activeId === s.id
                ? 'border-brand font-semibold text-brand'
                : 'border-slate-200 text-muted hover:border-slate-300 hover:text-ink',
            ]"
          >
            {{ s.label }}
          </a>
        </nav>
      </div>
    </aside>

    <!-- Center: the page content -->
    <div class="min-w-0 w-0 flex-1 overflow-x-hidden">
      <slot />
    </div>

    <!-- Right rail: the top-level component list -->
    <aside id="doc-right-rail" class="hidden w-56 shrink-0 xl:block">
      <div class="sticky top-6 pt-6">
        <span class="mb-2 block px-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted/70">
          Components
        </span>
        <nav id="doc-components-nav" class="flex flex-col gap-0.5">
          <RouterLink
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            :id="`component-link-${normalizedLinkId(item.to)}`"
            custom
            v-slot="{ isActive, href, navigate }"
          >
            <a
              :href="href"
              @click="navigate"
              :class="[
                'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                isActive
                  ? 'bg-brand-tint font-semibold text-brand'
                  : 'font-medium text-slate-600 hover:bg-slate-100 hover:text-ink',
              ]"
            >
              <component :is="item.icon" class="h-4 w-4 shrink-0" />
              {{ item.label }}
            </a>
          </RouterLink>
        </nav>
      </div>
    </aside>
  </div>
</template>
