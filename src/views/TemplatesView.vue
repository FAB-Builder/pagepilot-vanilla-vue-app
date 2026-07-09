<script setup lang="ts">
import { ref, onMounted, onUnmounted, type Component } from 'vue';
import { AlertCircle, LayoutTemplate } from '@lucide/vue';
import DocLayout from '../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import SpinnerIcon from '../components/icons/SpinnerIcon.vue';
import ToursIcon from '../components/icons/ToursIcon.vue';
import TooltipsIcon from '../components/icons/TooltipsIcon.vue';
import DemosIcon from '../components/icons/DemosIcon.vue';
import AppBannerIcon from '../components/icons/AppBannerIcon.vue';
import PagesIcon from '../components/icons/PagesIcon.vue';
import { PAGEPILOT_API_HOST } from '../lib/ahd';

/** Maps a global-template `type` to the icon used elsewhere for that module. */
const TYPE_ICONS: Record<string, Component> = {
  tour: ToursIcon,
  tooltip: TooltipsIcon,
  demo: DemosIcon,
  'app-banner': AppBannerIcon,
  page: PagesIcon,
  block: LayoutTemplate,
};

const SECTIONS: DocSection[] = [{ id: 'overview', label: 'Overview' }];

const TEMPLATES_ENDPOINT = `${PAGEPILOT_API_HOST}/global-template?orderBy=&offset=0`;

interface GlobalTemplateImage {
  publicUrl: string;
}

interface GlobalTemplate {
  _id: string;
  name: string;
  description?: string;
  tags?: string[];
  type: string;
  image?: GlobalTemplateImage[];
}

interface GlobalTemplateResponse {
  rows: GlobalTemplate[];
  count: number;
}

type Status = 'loading' | 'success' | 'error';

const templates = ref<GlobalTemplate[]>([]);
const status = ref<Status>('loading');

let cancelled = false;

onMounted(() => {
  status.value = 'loading';
  fetch(TEMPLATES_ENDPOINT)
    .then((r) => r.json())
    .then((data: GlobalTemplateResponse) => {
      if (cancelled) return;
      templates.value = Array.isArray(data.rows) ? data.rows : [];
      status.value = 'success';
    })
    .catch(() => {
      if (!cancelled) status.value = 'error';
    });
});

onUnmounted(() => {
  cancelled = true;
});
</script>

<template>
  <DocLayout title="Templates" :sections="SECTIONS">
    <article id="templates-article">
      <header id="templates-header" class="mb-8 border-b border-slate-200 pb-6">
        <h1 id="templates-title" class="mt-1 text-3xl font-bold" style="width: fit-content">
          Templates
        </h1>
        <p id="templates-intro" class="mt-3 text-lg leading-relaxed text-slate-600">
          Every global template available in your Page Pilot workspace — tours, tooltips,
          demos, banners, and pages — ready to reuse.
        </p>
      </header>

      <section id="overview" class="scroll-mt-24">
        <div v-if="status === 'loading'" id="templates-loading" class="flex items-center justify-center py-16">
          <SpinnerIcon class="h-6 w-6 animate-spin text-brand" />
        </div>

        <div
          v-else-if="status === 'error'"
          id="templates-error"
          class="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700"
        >
          <AlertCircle :size="16" />
          Couldn't load templates. Please try again later.
        </div>

        <div
          v-else-if="status === 'success' && templates.length === 0"
          id="templates-empty"
          class="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center"
        >
          <span class="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-brand-tint text-brand">
            <LayoutTemplate :size="26" />
          </span>
          <h2 class="mt-4 text-lg font-bold">No templates yet</h2>
          <p class="mt-1 text-sm text-slate-500">
            Global templates published in Page Pilot will show up here.
          </p>
        </div>

        <div
          v-else-if="status === 'success' && templates.length > 0"
          id="templates-grid"
          class="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          <div
            v-for="template in templates"
            :key="template._id"
            :id="`template-card-${template._id}`"
            class="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card transition-all duration-200 hover:border-brand/40 hover:shadow-lg"
          >
            <div class="flex aspect-[16/10] items-center justify-center overflow-hidden bg-slate-50">
              <img
                v-if="template.image?.[0]?.publicUrl"
                :src="template.image[0].publicUrl"
                :alt="template.name"
                loading="lazy"
                class="h-full w-full object-cover"
              />
              <LayoutTemplate v-else class="h-8 w-8 text-slate-300" />
            </div>
            <div class="flex flex-1 flex-col gap-2 p-4">
              <div class="flex items-start justify-between gap-2">
                <span class="text-sm font-bold text-ink">{{ template.name }}</span>
                <span class="flex shrink-0 items-center gap-1 rounded-full bg-brand-tint px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-brand">
                  <component :is="TYPE_ICONS[template.type] ?? LayoutTemplate" class="h-3 w-3" />
                  {{ template.type }}
                </span>
              </div>
              <p v-if="template.description" class="line-clamp-2 text-xs leading-relaxed text-muted">
                {{ template.description }}
              </p>
              <div v-if="template.tags && template.tags.length > 0" class="mt-auto flex flex-wrap gap-1.5 pt-1">
                <span
                  v-for="tag in template.tags"
                  :key="tag"
                  class="rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-500"
                >
                  {{ tag }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  </DocLayout>
</template>
