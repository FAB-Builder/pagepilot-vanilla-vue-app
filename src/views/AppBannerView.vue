<script setup lang="ts">
import DocLayout from '../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import ApiTable from '../components/ApiTable.vue';
import CodeSnippet from '../components/CodeSnippet.vue';
import AiPromptBlock from '../components/AiPromptBlock.vue';
import TypeBannerDemo from './TypeBannerDemo.vue';
import { BANNER_TYPES } from './appBannerTypes';
import { VUE_CODE, AI_PROMPT } from './appBannerSnippets';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'integration', label: 'Integration' },
  { id: 'ai-prompt', label: 'Integrate using AI' },
  { id: 'types', label: 'Banner types & demos' },
  { id: 'configure', label: 'Configuring a banner' },
  { id: 'show-once', label: 'Show only once' },
  { id: 'api', label: 'API reference' },
];

const CONFIG_FIELDS: { field: string; type: string; description: string }[] = [
  {
    field: 'identifier',
    type: 'string',
    description:
      'The unique key you pass to renderAppBanner(). The banner renders into the matching <div id="{identifier}" />.',
  },
  {
    field: 'type',
    type: 'simpleBanner | carousel | modal | floater',
    description: 'The banner layout. See Banner types below.',
  },
  {
    field: 'content',
    type: 'reference',
    description: 'The content (text / images) shown in the banner, authored in Page Pilot.',
  },
  { field: 'buttonText', type: 'string', description: 'Label for the call-to-action button.' },
  { field: 'buttonColor', type: 'string', description: 'Background color of the call-to-action button.' },
  { field: 'buttonTextColor', type: 'string', description: 'Text color of the call-to-action button.' },
  { field: 'link', type: 'string', description: 'URL the banner / button navigates to when clicked.' },
  {
    field: 'sequence',
    type: 'number',
    description: 'Order used when more than one banner can render in the same place.',
  },
  {
    field: 'start / end',
    type: 'datetime',
    description: 'Optional schedule window — the banner only shows live between these times.',
  },
  { field: 'isActive', type: 'boolean', description: 'Whether the banner is live. Inactive banners are not rendered.' },
  {
    field: 'oneTimeOnly',
    type: 'boolean',
    description:
      'Show this banner only once per visitor. Turn it off if you want the banner to appear every time they visit the page.',
  },
];

const CONFIG_ROWS = CONFIG_FIELDS.map((f) => ({
  property: f.field,
  description: f.description,
  type: f.type,
}));

const API_ROWS = [
  {
    property: 'renderAppBanner(identifier, refetch)',
    description:
      'Renders the banner into <div id="{identifier}" /> in your DOM. Works for all banner types (simpleBanner, carousel, modal, floater).',
    type: '(identifier: string, refetch: boolean) => Promise<unknown>',
  },
  {
    property: 'initializeSiteMap(refetch)',
    description: 'Builds the sitemap before rendering. Call once after init.',
    type: '(refetch: boolean) => Promise<void>',
  },
];
</script>

<template>
  <DocLayout title="App Banner" :sections="SECTIONS">
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold">App Banner</h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          App banners are announcement blocks fetched by <strong>identifier</strong> and rendered
          into a container in your app — great for promotions, release notes, or channel-specific
          messaging. Banners come in several layouts, and one integration call —
          <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">renderAppBanner(identifier, true)</code>
          — renders whichever type you configured in Page Pilot.
        </p>
      </header>

      <section id="overview" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Overview</h2>
        <ul class="list-disc space-y-2 pl-5 leading-relaxed text-slate-600">
          <li>Announce a promotion, update, or maintenance window.</li>
          <li>Show channel- or audience-specific messaging by identifier.</li>
          <li>
            Choose the layout that fits — an inline <strong>Simple Banner</strong>, a rotating
            <strong>Carousel</strong>, an attention-grabbing <strong>Modal</strong>, or a
            persistent <strong>Floater</strong>.
          </li>
          <li>The layout is decided in Page Pilot; your app code stays the same regardless of type.</li>
        </ul>
        <p class="mt-3 leading-relaxed text-slate-600">
          Banners are authored in
          <a
            href="https://pagepilot.fabbuilder.com"
            target="_blank"
            rel="noreferrer"
            class="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
          >
            Page Pilot → App Banners
          </a>
          , then rendered into your app with the AHDjs SDK.
        </p>

        <h3 class="mt-6 font-semibold text-slate-800">What is an identifier?</h3>
        <p class="mt-2 leading-relaxed text-slate-600">
          The <strong>identifier</strong> is the unique name you give a banner in Page Pilot (for
          example
          <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">FAB_BANNER_TYPE_SIMPLE</code>
          ). It is the single link between the banner you author and the spot in your app where it
          appears: you create a container with that same
          <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">id</code>,
          and AHDjs injects the banner into it. <strong>Identifiers must be unique</strong> —
          one identifier maps to exactly one banner and one container.
        </p>

        <h3 class="mt-6 font-semibold text-slate-800">How to embed a banner — in 3 steps</h3>
        <ol class="mt-2 space-y-3 leading-relaxed text-slate-600">
          <li class="flex gap-3">
            <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">1</span>
            <span>
              <strong>Create the banner</strong> in Page Pilot → App Banners, pick a
              <strong>type</strong>, and give it an <strong>identifier</strong>.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">2</span>
            <span>
              <strong>Add a container</strong> with the matching id where you want it to show:
              <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">&lt;div id="FAB_BANNER_TYPE_SIMPLE"&gt;&lt;/div&gt;</code>.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">3</span>
            <span>
              <strong>Initialize AHDjs and render</strong> — call
              <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">initializeSiteMap()</code>
              then
              <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">renderAppBanner("FAB_BANNER_TYPE_SIMPLE", true)</code>.
              The same call works for <strong>every banner type</strong>.
            </span>
          </li>
        </ol>
      </section>

      <section id="integration" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Integration</h2>
        <p class="mb-4 leading-relaxed text-slate-600">
          Integrating a banner takes three things: install the SDK, render an empty container whose
          <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">id</code>
          matches the identifier, then call
          <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">renderAppBanner(identifier, true)</code>
          from an <code class="font-mono text-[13px]">onMounted</code> hook so it runs after mount.
          The second argument (<code class="font-mono text-[13px]">refetch</code>) forces a
          fresh fetch instead of using a cached copy.
        </p>

        <ol class="my-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <strong class="text-ink">1. Install</strong> —
            <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">npm install ahdjs</code>.
          </li>
          <li>
            <strong class="text-ink">2. Add a container</strong> — render
            <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">&lt;div :id="identifier" /&gt;</code>
            where the banner should appear.
          </li>
          <li>
            <strong class="text-ink">3. Render</strong> — call
            <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">initializeSiteMap()</code>
            then
            <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">renderAppBanner(identifier, true)</code>
            in an <code class="font-mono text-[13px]">onMounted</code> hook.
          </li>
        </ol>

        <p class="mb-2 text-sm leading-relaxed text-slate-600">
          This example uses the simple banner's
          <code class="font-mono text-[13px]">FAB_BANNER_TYPE_SIMPLE</code> identifier — swap
          it for any other (carousel, modal, floater). <strong>The code is identical for every
          type.</strong>
        </p>
        <CodeSnippet :code="VUE_CODE" language="vue" />
      </section>

      <section id="ai-prompt" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Integrate using AI</h2>
        <p class="mb-4 text-sm leading-relaxed text-slate-600">
          Don't want to wire it by hand? Hand this prompt to Cursor, Claude, or GitHub
          Copilot — it walks through install, config, the container, and the
          <code class="font-mono text-[13px]">renderAppBanner</code> call.
        </p>
        <AiPromptBlock id="app-banner-ai-prompt" :prompt="AI_PROMPT" />
      </section>

      <section id="types" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Banner types & demos</h2>
        <p class="mb-6 leading-relaxed text-slate-600">
          The four banner types and a live demo of each. The type only controls <em>how</em> the
          banner is presented — the integration code above is the same for all of them; just change
          the identifier.
        </p>

        <div v-for="t in BANNER_TYPES" :key="t.value" class="mb-10 scroll-mt-24" :id="`type-${t.value}`">
          <div class="mb-2 flex flex-wrap items-center gap-2">
            <h3 class="text-lg font-bold text-ink">{{ t.name }}</h3>
            <code class="rounded bg-emerald-50 px-1.5 py-0.5 font-mono text-[11px] text-emerald-700">
              type: {{ t.value }}
            </code>
            <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[12px] text-brand">
              {{ t.identifier }}
            </code>
          </div>
          <p class="mb-1 text-sm font-medium text-slate-700">{{ t.summary }}</p>
          <p class="mb-3 text-sm leading-relaxed text-slate-500">{{ t.description }}</p>
          <dl class="mb-4 space-y-1.5 text-sm">
            <div class="flex gap-2">
              <dt class="w-20 shrink-0 font-semibold text-slate-500">Best for</dt>
              <dd class="text-slate-600">{{ t.bestFor }}</dd>
            </div>
            <div class="flex gap-2">
              <dt class="w-20 shrink-0 font-semibold text-slate-500">Placement</dt>
              <dd class="text-slate-600">{{ t.placement }}</dd>
            </div>
          </dl>
          <TypeBannerDemo :type="t" />
        </div>
      </section>

      <section id="configure" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Configuring a banner</h2>
        <p class="mb-4 leading-relaxed text-slate-600">
          In Page Pilot → App Banners, create a banner and fill in these fields. The
          <strong>identifier</strong> and <strong>type</strong> are the ones that matter most for
          integration — the rest control content, styling, scheduling, and ordering.
        </p>
        <ApiTable :rows="CONFIG_ROWS" />
      </section>

      <section id="show-once" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Show only once</h2>
        <p class="mb-4 leading-relaxed text-slate-600">
          By default a banner keeps showing every time a visitor loads a matching page. Turn on
          <strong>Show Only Once</strong> to have it show a single time per visitor — once they
          see it (and dismiss it, click it, or navigate away), it won't be rendered again
          for that same visitor.
        </p>
        <h3 class="mt-6 font-semibold text-slate-800">Where to set it</h3>
        <ol class="mt-2 space-y-3 leading-relaxed text-slate-600">
          <li class="flex gap-3">
            <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">1</span>
            <span>
              Open <strong>Page Pilot → App Banners</strong> and select the banner you want to
              configure (or create a new one).
            </span>
          </li>
          <li class="flex gap-3">
            <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">2</span>
            <span>
              Open the banner in the editor and click <strong>Publish</strong> (or the Save /
              Settings action) to open the publish dialog.
            </span>
          </li>
          <li class="flex gap-3">
            <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">3</span>
            <span>
              In the publish dialog, toggle <strong>Show Only Once</strong> on or off, then save.
              The change applies the next time the banner is fetched — no code changes are
              needed on your end.
            </span>
          </li>
        </ol>
        <p class="mt-4 leading-relaxed text-slate-600">
          This is a per-banner setting authored in Page Pilot, not a parameter of
          <code class="rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">renderAppBanner()</code>
          — your integration code stays the same either way. "Once per visitor" is tracked
          against the visitor identity AHDjs already uses for the rest of your integration, so no
          extra setup is required.
        </p>
      </section>

      <section id="api" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">API reference</h2>
        <ApiTable :rows="API_ROWS" />
      </section>
    </article>
  </DocLayout>
</template>
