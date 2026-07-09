<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import { Play, CheckCircle2, AlertCircle } from '@lucide/vue';
import { createAhd, AHD_API_HOST, DEMO_APPLICATION_ID, type AhdInstance } from '../lib/ahd';
import DocLayout from '../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import DemoBlock from '../components/DemoBlock.vue';
import ApiTable from '../components/ApiTable.vue';
import PropertyCard from '../components/PropertyCard.vue';
import AiPromptBlock from '../components/AiPromptBlock.vue';

/**
 * The slug a tour is attached to. In PagePilot a "Target Page" is just a
 * slug; the tour for this demo is published against the `/tours` slug.
 */
const TOUR_SLUG = '/tours';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'live-demo', label: 'Live demo' },
  { id: 'integration', label: 'Integration' },
  { id: 'ai-prompt', label: 'Integrate using AI' },
  { id: 'target-page', label: 'Target Page' },
  { id: 'alt-target-page', label: 'Alternative Target Page' },
  { id: 'selector', label: 'Element / Selector' },
  { id: 'position', label: 'Position' },
  { id: 'backdrop', label: 'Backdrop' },
  { id: 'device-language', label: 'Device & Language' },
  { id: 'scheduling', label: 'Scheduling' },
  { id: 'show-once', label: 'Show only once' },
  { id: 'step-style', label: 'Step styling' },
  { id: 'api', label: 'API reference' },
];

const POSITIONS = ['top', 'bottom', 'left', 'right'] as const;

type Status = 'idle' | 'loading' | 'running' | 'error';

const ahdInstance = ref<AhdInstance | null>(null);
const status = ref<Status>('idle');
const error = ref<string | null>(null);

const startTour = async () => {
  error.value = null;
  status.value = 'loading';
  try {
    const ahd = createAhd({ applicationId: DEMO_APPLICATION_ID });
    ahdInstance.value = ahd;
    await ahd.initializeSiteMap(false);
    await ahd.showHighlights(TOUR_SLUG, true);
    status.value = 'running';
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to start the tour.';
    status.value = 'error';
  }
};

onUnmounted(() => ahdInstance.value?.stop());

const STEP_STYLE_ROWS = [
  {
    property: 'canvasColor',
    description: 'Background color of the tooltip card.',
    type: 'string',
    default: "'#FFFFFF'",
  },
  {
    property: 'textColor',
    description: 'Text color inside the card.',
    type: 'string',
    default: "'#262626'",
  },
  {
    property: 'fontFamily',
    description: 'Font family for the card content.',
    type: 'string',
    default: "'MODERN_SANS'",
  },
  {
    property: 'borderRadius / borderColor / borderWidth',
    description: 'Card border styling.',
    type: 'string | number',
  },
  {
    property: 'width / height / top / left',
    description: 'Manual size and offset overrides for the card.',
    type: 'string | number',
  },
];

const CONSTRUCTOR_ROWS = [
  { property: 'applicationId', description: 'Your PagePilot application ID.', type: 'string' },
  { property: 'apiHost', description: 'PagePilot API host.', type: 'string', default: `'${AHD_API_HOST}'` },
  {
    property: 'visitorId',
    description:
      "The current logged-in user's ID from your platform (e.g. user.id or auth.uid). PagePilot uses this to track tour progress per user — so \"show only once\" and analytics work correctly per individual. Pass your own unique user identifier here, not a generic placeholder.",
    type: 'string',
  },
  {
    property: 'showProgressbar',
    description: 'Whether to show a progress bar across tour steps.',
    type: 'boolean',
    default: 'false',
  },
];

const METHOD_ROWS = [
  {
    property: 'initializeSiteMap(refetch)',
    description: 'Builds the sitemap before rendering any experience.',
    type: '(refetch: boolean) => Promise<void>',
  },
  {
    property: 'showHighlights(slug, refetch)',
    description: 'Renders the tour / highlights published for the given slug.',
    type: '(slug: string, refetch: boolean) => Promise<void>',
  },
  {
    property: 'stop()',
    description: 'Stops the currently running tour.',
    type: '() => void',
  },
];

/* ------------------------------- Snippets ------------------------------- */

const AI_PROMPT = `Do the following steps automatically:

Install the ahdjs npm package.

Import AHDjs and its CSS (ahdjs/build/css/index.css) in the application entry file (prefer main.ts or src/main.ts).

Initialize AHDjs with the following configuration:

applicationId: "YOUR_APPLICATION_ID"

apiHost: "${AHD_API_HOST}"

visitorId: "visitor-id"

showProgressbar: false

Call:

initializeSiteMap()

showHighlights("target-page", true) //  Replace 'target-page' with the actual Target Page where you want to show the tour.

Ensure the initialization runs only once when the app loads (use onMounted if needed).

Add brief comments explaining what each step does.`;

const LIVE_DEMO_CODE = `<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import AHDjs from 'ahdjs';
import 'ahdjs/build/css/index.css';

const ahdRef = ref(null);

const startTour = async () => {
  const ahdJs = AHDjs(undefined, {
    applicationId: 'YOUR_APPLICATION_ID',
    apiHost: '${AHD_API_HOST}',
    // visitorId: the current logged-in user's ID from your platform.
    // Pass your own user identifier so PagePilot can track per-user progress.
    visitorId: currentUser.id,
    showProgressbar: false,
  });
  ahdRef.value = ahdJs;

  await ahdJs.initializeSiteMap(false);
  await ahdJs.showHighlights('${TOUR_SLUG}', true);
};

onUnmounted(() => ahdRef.value?.stop());
<\/script>

<template>
  <button @click="startTour">Start Tour</button>
  <button id="demo-create">+ Create project</button>
  <button id="demo-search">Search</button>
</template>`;

const BASIC_CODE = `import AHDjs from 'ahdjs';
import 'ahdjs/build/css/index.css';

const ahdJs = AHDjs(undefined, {
  applicationId: 'YOUR_APPLICATION_ID',
  apiHost: '${AHD_API_HOST}',
  // visitorId: the current logged-in user's ID from your platform.
  // Pass your own user identifier so PagePilot can track per-user progress.
  visitorId: currentUser.id,
  showProgressbar: false,
});

await ahdJs.initializeSiteMap(false);
await ahdJs.showHighlights('${TOUR_SLUG}', true);`;
</script>

<template>
  <DocLayout title="Tours" :sections="SECTIONS">
    <article id="tours-article">
      <header id="tours-header" class="mb-8 border-b border-slate-200 pb-6">
        <h1 id="tours-title" class="mt-1 text-3xl font-bold" style="width: fit-content">
          Tours
        </h1>
        <p id="tours-intro" class="mt-3 text-lg leading-relaxed text-slate-600">
          A tour is a step-by-step guided walkthrough. Each step highlights an element on a page
          and shows a tooltip card with content and next / previous controls. PagePilot fetches the
          tour for a given <strong id="tours-intro-target">Target Page</strong> and renders it over
          your real DOM.
        </p>
      </header>

      <section id="overview" class="mb-12 scroll-mt-24">
        <h2 id="overview-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Overview</h2>
        <div id="overview-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="overview-text">
            A tour has <strong id="overview-tour-level">tour-level</strong> settings (which pages it
            runs on, scheduling, device) and a list of <strong id="overview-steps">steps</strong>.
            Each step points at an element and controls its own placement and styling. The sections
            below document every property you configure in the PagePilot admin.
          </p>
        </div>
      </section>

      <section id="live-demo" class="mb-12 scroll-mt-24">
        <h2 id="live-demo-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Live demo</h2>
        <div id="live-demo-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="live-demo-text">
            Press <strong id="live-demo-cta-text">Start Tour</strong> to run the tour published
            against the <code id="live-demo-slug" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">{{ TOUR_SLUG }}</code> slug for this demo app. It
            highlights the sample buttons below.
          </p>
          <DemoBlock title="Start a tour" :code="LIVE_DEMO_CODE">
            <template #description>
              Calls <code id="live-demo-method" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights("{{ TOUR_SLUG }}", true)</code> after
              initializing the client.
            </template>
            <div id="tours-live-demo" class="flex flex-col gap-4">
              <div id="tours-live-controls" class="flex items-center gap-3">
                <button
                  id="tours-start-button"
                  type="button"
                  @click="startTour"
                  :disabled="status === 'loading'"
                  class="flex items-center gap-2 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
                >
                  <Play :size="15" />
                  {{ status === 'loading' ? 'Starting…' : 'Start Tour' }}
                </button>
                <span
                  v-if="status === 'running'"
                  id="tours-status-running"
                  class="flex items-center gap-1.5 text-sm font-semibold text-emerald-600"
                >
                  <CheckCircle2 :size="15" /> Tour running
                </span>
                <span
                  v-if="error"
                  id="tours-status-error"
                  class="flex items-center gap-1.5 text-sm font-semibold text-rose-600"
                >
                  <AlertCircle :size="15" /> {{ error }}
                </span>
              </div>

              <div
                id="tours-demo-stage"
                class="flex flex-wrap items-center gap-3 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-5"
              >
                <button id="demo-create" type="button" class="rounded-lg bg-brand px-3.5 py-2 text-sm text-white">
                  + Create project
                </button>
                <button id="demo-search" type="button" class="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm">
                  Search
                </button>
                <button id="demo-settings" type="button" class="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm">
                  Settings
                </button>
                <div
                  id="demo-profile"
                  title="Profile"
                  class="ml-auto grid h-9 w-9 place-items-center rounded-full bg-brand-tint text-sm font-bold text-brand"
                >
                  JD
                </div>
              </div>
            </div>
          </DemoBlock>
        </div>
      </section>

      <section id="integration" class="mb-12 scroll-mt-24">
        <h2 id="integration-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Integration</h2>
        <div id="integration-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="integration-text">
            Integrating a tour takes three things: install the SDK, create the client once, then
            call <code id="integration-method" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights(slug, true)</code> for the page you
            want the tour to run on.
          </p>

          <ol id="integration-steps" class="my-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <li>
              <strong class="text-ink">1. Install</strong> — add the package with
              <code id="integration-step-install" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">npm install ahdjs</code>.
            </li>
            <li>
              <strong class="text-ink">2. Configure</strong> — create the client with your
              <code id="integration-step-appid" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">applicationId</code> and pass the logged-in user's
              id as <code id="integration-step-visitor" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">visitorId</code>.
            </li>
            <li>
              <strong class="text-ink">3. Run once</strong> — call
              <code id="integration-step-init" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">initializeSiteMap()</code> then
              <code id="integration-step-show" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights("{{ TOUR_SLUG }}", true)</code> after the
              target elements are mounted (a Vue <code id="integration-step-effect" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">onMounted</code>
              hook is the usual place).
            </li>
          </ol>

          <h3 id="integration-react-heading" class="mt-6 text-base font-semibold text-ink">
            Vue app (npm)
          </h3>
          <p id="integration-react-text" class="text-sm text-slate-600">
            Best when PagePilot lives inside a bundled web app. Import the SDK and its CSS once,
            then run it from a component or your app entry.
          </p>
          <DemoBlock title="Initialize and run a tour" :code="BASIC_CODE">
            <template #description>
              <code id="integration-react-method" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights("{{ TOUR_SLUG }}", true)</code>
              renders the tour for that slug once the sitemap is ready.
            </template>
          </DemoBlock>
        </div>
      </section>

      <section id="ai-prompt" class="mb-12 scroll-mt-24">
        <h2 id="ai-prompt-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Integrate using AI</h2>
        <div id="ai-prompt-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="ai-prompt-text" class="text-sm text-slate-600">
            Don't want to wire it by hand? Hand this prompt to Cursor, Claude, or GitHub Copilot —
            it walks through install, config, and the
            <code id="ai-prompt-call" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights</code> call so the tour loads on the right
            page.
          </p>
          <AiPromptBlock id="tours-ai-prompt" :prompt="AI_PROMPT" />
        </div>
      </section>

      <section id="target-page" class="mb-12 scroll-mt-24">
        <h2 id="target-page-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Target Page</h2>
        <div id="target-page-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="target-page-text">
            The page (slug) where the tour appears. PagePilot matches the visitor's current URL path
            against this slug; when it matches, the tour renders. It must start with a
            <code id="target-page-slash" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">/</code>.
          </p>
          <PropertyCard type="string" :required="true" defaultValue="'/'">
            <span id="target-page-prop">
              The URL path the tour is bound to, e.g. <code id="target-page-eg1" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">/dashboard</code> or
              <code id="target-page-eg2" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">/tours</code>. In code this is the first argument to
              <code id="target-page-method" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights(slug, refetch)</code>.
            </span>
          </PropertyCard>
        </div>
      </section>

      <section id="alt-target-page" class="mb-12 scroll-mt-24">
        <h2 id="alt-target-page-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Alternative Target Page</h2>
        <div id="alt-target-page-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="alt-target-page-text">
            Additional slugs the same tour should also run on. Useful when the same screen is reached
            via multiple URLs (e.g. <code id="alt-eg1" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">/home</code> and
            <code id="alt-eg2" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">/dashboard</code>). Each alternative must also start with
            <code id="alt-slash" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">/</code>.
          </p>
          <PropertyCard type="string[]" defaultValue="[]">
            <span id="alt-target-page-prop">
              A list of extra page slugs. The tour shows if the current URL matches the Target Page
              <em>or</em> any alternative.
            </span>
          </PropertyCard>
        </div>
      </section>

      <section id="selector" class="mb-12 scroll-mt-24">
        <h2 id="selector-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Element / Selector</h2>
        <div id="selector-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="selector-text">
            Per step, the <strong id="selector-element-id">Element ID</strong> (CSS selector) of the
            element to highlight. The tooltip anchors to this element. On this demo page the
            selectors are <code id="selector-eg-create" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">#demo-create</code>,
            <code id="selector-eg-search" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">#demo-search</code>,
            <code id="selector-eg-settings" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">#demo-settings</code> and
            <code id="selector-eg-profile" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">#demo-profile</code>.
          </p>
          <PropertyCard type="string" :required="true">
            <span id="selector-prop">
              Any valid CSS selector. If the element isn't present when the tour runs, that step is
              skipped.
            </span>
          </PropertyCard>
        </div>
      </section>

      <section id="position" class="mb-12 scroll-mt-24">
        <h2 id="position-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Position</h2>
        <div id="position-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="position-text">Where the tooltip card sits relative to the highlighted element.</p>
          <PropertyCard type="'top' | 'bottom' | 'left' | 'right'" defaultValue="'bottom'">
            <span id="position-prop">
              Placement of the step tooltip. Falls back to <code id="position-default" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">bottom</code>
              when not set.
            </span>
          </PropertyCard>
          <div id="position-grid" class="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
            <div
              v-for="p in POSITIONS"
              :key="p"
              :id="`position-option-${p}`"
              class="rounded-lg border border-slate-200 bg-white px-3 py-4 text-center text-sm font-medium capitalize text-slate-700"
            >
              {{ p }}
            </div>
          </div>
        </div>
      </section>

      <section id="backdrop" class="mb-12 scroll-mt-24">
        <h2 id="backdrop-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Backdrop</h2>
        <div id="backdrop-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="backdrop-text">
            The dimmed overlay drawn behind the highlighted element to focus attention. Its color is
            controlled by <code id="backdrop-prop-name" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">backdropColor</code> on the step's layout. A
            cut-out around the target element keeps it bright while the rest of the page is dimmed.
          </p>
          <PropertyCard type="string (hex color)" defaultValue="'#F5F5F5'">
            <span id="backdrop-prop">
              Backdrop / overlay color for the step. Set per step via the step's EmailLayout
              <code id="backdrop-layout-prop" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">backdropColor</code>.
            </span>
          </PropertyCard>
        </div>
      </section>

      <section id="device-language" class="mb-12 scroll-mt-24">
        <h2 id="device-language-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Device & Language</h2>
        <div id="device-language-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="device-language-text">
            Restrict where the tour shows and which localized content is served.
          </p>
          <PropertyCard type="'desktop' | 'tablet' | 'mobile'" defaultValue="'desktop'">
            <span id="device-prop">Device the tour targets.</span>
          </PropertyCard>
          <PropertyCard type="'en' | 'hi'" defaultValue="'en'">
            <span id="language-prop">Language of the tour content.</span>
          </PropertyCard>
        </div>
      </section>

      <section id="scheduling" class="mb-12 scroll-mt-24">
        <h2 id="scheduling-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Scheduling</h2>
        <div id="scheduling-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="scheduling-text">
            Control when a tour is live with a start date, an end date, or "run forever". Outside the
            window the tour is not served.
          </p>
          <PropertyCard type="Date" defaultValue="now">
            <span id="scheduling-start-prop"><strong>Start date</strong> — when the tour goes live.</span>
          </PropertyCard>
          <PropertyCard type="Date | null" defaultValue="null">
            <span id="scheduling-end-prop">
              <strong>End date</strong> — when it stops. Turn on <em>Run forever</em> to leave it
              open.
            </span>
          </PropertyCard>
        </div>
      </section>

      <section id="show-once" class="mb-12 scroll-mt-24">
        <h2 id="show-once-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Show only once</h2>
        <div id="show-once-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="show-once-text">
            When enabled, a visitor sees the tour a single time; once they finish or dismiss it, it
            won't show again for them (tracked per <code id="show-once-visitor" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">visitorId</code>).
          </p>
          <PropertyCard type="boolean" defaultValue="false">
            <span id="show-once-prop">Show the tour only once per visitor.</span>
          </PropertyCard>
        </div>
      </section>

      <section id="step-style" class="mb-12 scroll-mt-24">
        <h2 id="step-style-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">Step styling</h2>
        <div id="step-style-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="step-style-text">Each step's tooltip card can be styled independently.</p>
          <ApiTable :rows="STEP_STYLE_ROWS" />
        </div>
      </section>

      <section id="api" class="mb-12 scroll-mt-24">
        <h2 id="api-heading" style="width: fit-content" class="mb-4 pb-2 text-xl font-bold">API reference</h2>
        <div id="api-body" class="space-y-3 leading-relaxed text-slate-600">
          <h3 id="api-constructor-heading" class="mb-2 mt-2 text-base font-semibold text-ink">Constructor options</h3>
          <ApiTable :rows="CONSTRUCTOR_ROWS" />
          <h3 id="api-methods-heading" class="mb-2 mt-6 text-base font-semibold text-ink">Methods</h3>
          <ApiTable :rows="METHOD_ROWS" />
        </div>
      </section>
    </article>
  </DocLayout>
</template>
