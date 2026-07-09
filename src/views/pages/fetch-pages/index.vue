<script setup lang="ts">
/**
 * Fetch Pages — a sub-module of "Pages". Documents how to read pages (blogs,
 * FAQs, landing pages, etc.) published in Page Pilot from your own app.
 *
 * The page is composed of one component per doc section (see ./sections); the
 * code snippets live in ./snippets.
 */
import DocLayout from '../../../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import { PAGES_SUBMODULES } from '../subModules';
import Overview from './sections/Overview.vue';
import Endpoint from './sections/Endpoint.vue';
import FullExample from './sections/FullExample.vue';
import Includes from './sections/Includes.vue';
import MultipleIncludes from './sections/MultipleIncludes.vue';
import FetchFaqs from './sections/FetchFaqs.vue';
import FetchMenu from './sections/FetchMenu.vue';
import AllTogether from './sections/AllTogether.vue';
import Filter from './sections/Filter.vue';
import SelectFields from './sections/SelectFields.vue';
import PageSelect from './sections/PageSelect.vue';
import AiPrompt from './sections/AiPrompt.vue';
import ApiReference from './sections/ApiReference.vue';
import PageFields from './sections/PageFields.vue';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'endpoint', label: 'The endpoint' },
  { id: 'example', label: 'Full example' },
  { id: 'includes', label: 'Includes' },
  { id: 'multiple-includes', label: 'Multiple includes' },
  { id: 'faqs', label: 'Fetch FAQs' },
  { id: 'menu', label: 'Fetch a menu' },
  { id: 'all-together', label: 'Everything at once' },
  { id: 'filter', label: 'Filter' },
  { id: 'select', label: 'Select fields' },
  { id: 'page-select', label: 'Page select' },
  { id: 'ai-prompt', label: 'Integrate using AI' },
  { id: 'api', label: 'API reference' },
  { id: 'page-fields', label: 'What you can fetch' },
];
</script>

<template>
  <DocLayout
    title="Fetch Pages"
    :sections="SECTIONS"
    :subModules="PAGES_SUBMODULES"
    subModulesLabel="Pages"
  >
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">
          Fetch Pages List using Page Pilot API
        </h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          Read content you've published in Page Pilot — blog posts, FAQs, landing pages, and more —
          straight from your own app with a single API call. Pull one page by its slug and, in the
          same request, fetch related lists of pages filtered by group and status.
        </p>
      </header>

      <Overview />
      <Endpoint />
      <FullExample />
      <Includes />
      <MultipleIncludes />
      <FetchFaqs />
      <FetchMenu />
      <AllTogether />
      <Filter />
      <SelectFields />
      <PageSelect />
      <AiPrompt />
      <ApiReference />
      <PageFields />
    </article>
  </DocLayout>
</template>
