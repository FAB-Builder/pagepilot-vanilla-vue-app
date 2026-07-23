<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { Lightbulb, AlertCircle, AlertTriangle, HelpCircle, CircleDot, Info } from '@lucide/vue';
import { createAhd, AHD_API_HOST, DEMO_APPLICATION_ID, type AhdInstance } from '../lib/ahd';
import DocLayout from '../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import DemoBlock from '../components/DemoBlock.vue';
import ApiTable from '../components/ApiTable.vue';
import PropertyCard from '../components/PropertyCard.vue';
import AiPromptBlock from '../components/AiPromptBlock.vue';

const TOOLTIP_SLUG = '/tooltips';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'live-demo', label: 'Live demo' },
  { id: 'integration', label: 'Integration' },
  { id: 'ai-prompt', label: 'Integrate using AI' },
  { id: 'target-page', label: 'Target Page' },
  { id: 'selector', label: 'Element / Selector' },
  { id: 'trigger', label: 'Trigger behaviour' },
  { id: 'position', label: 'Position' },
  { id: 'backdrop', label: 'Backdrop' },
  { id: 'device-language', label: 'Device & Language' },
  { id: 'scheduling', label: 'Scheduling' },
  { id: 'show-once', label: 'Show only once' },
  { id: 'styling', label: 'Styling' },
  { id: 'api', label: 'API reference' },
];

type Status = 'idle' | 'loading' | 'running' | 'error';

const ahdInstance = ref<AhdInstance | null>(null);
const status = ref<Status>('loading');
const error = ref<string | null>(null);
let cancelled = false;

onMounted(async () => {
  error.value = null;
  status.value = 'loading';
  try {
    const ahd = createAhd({ applicationId: DEMO_APPLICATION_ID });
    ahdInstance.value = ahd;
    await ahd.initializeSiteMap(false);
    await ahd.showHighlights(TOOLTIP_SLUG, true);
    if (!cancelled) status.value = 'running';
  } catch (err) {
    if (cancelled) return;
    error.value = err instanceof Error ? err.message : 'Failed to load tooltips.';
    status.value = 'error';
  }
});

onUnmounted(() => {
  cancelled = true;
  ahdInstance.value?.stop();
});

const TRIGGER_ROWS = [
  {
    property: 'triggerBehaviour',
    description: 'Interaction that opens the tooltip card. "onPageLoad" is only available for tooltips.',
    type: "'onClick' | 'onHover' | 'onMouseEnter' | 'onMouseLeave' | 'onPageLoad'",
    default: "'onClick'",
  },
  {
    property: 'triggerMode',
    description:
      'How users discover the tooltip. "icon" shows an icon/beacon; "label" shows a text label; "noIcon" attaches the trigger to the element itself with no marker.',
    type: "'icon' | 'noIcon' | 'label'",
    default: "'noIcon'",
  },
  {
    property: 'triggerIcon.type',
    description: 'Icon variant shown when triggerMode is "icon" (see styles below).',
    type: "'warning' | 'helpIcon' | 'beacon' | 'info'",
    default: "'helpIcon'",
  },
  { property: 'triggerIcon.color', description: 'Icon / beacon color.', type: 'string (hex)', default: "'#6366F1'" },
  {
    property: 'triggerIcon.isAnimated',
    description: 'Pulse animation — only applies to the "beacon" icon type.',
    type: 'boolean',
    default: 'false',
  },
  { property: 'triggerLabel.text', description: 'Text shown when triggerMode is "label".', type: 'string' },
  { property: 'triggerLabel.color', description: 'Text color of the label trigger.', type: 'string (hex)', default: "'#FFFFFF'" },
  {
    property: 'triggerLabel.background',
    description: 'Background color of the label trigger.',
    type: 'string (hex)',
    default: "'#000000'",
  },
  { property: 'delay', description: 'Milliseconds to wait before showing the card.', type: 'number', default: '300' },
];

const ICON_STYLES = [
  { type: 'warning', label: 'Warning', icon: AlertTriangle },
  { type: 'helpIcon', label: 'Help', icon: HelpCircle },
  { type: 'beacon', label: 'Beacon', icon: CircleDot },
  { type: 'info', label: 'Info', icon: Info },
] as const;

const POSITIONS = [
  'top-left',
  'top',
  'top-right',
  'left',
  'center',
  'right',
  'bottom-left',
  'bottom',
  'bottom-right',
] as const;

const STYLING_ROWS = [
  { property: 'canvasColor', description: 'Background color of the tooltip card.', type: 'string (hex)', default: "'#FFFFFF'" },
  { property: 'textColor', description: 'Text color inside the card.', type: 'string (hex)', default: "'#262626'" },
  { property: 'fontFamily', description: 'Font family for the card content.', type: 'string', default: "'MODERN_SANS'" },
  { property: 'borderRadius', description: 'Card corner radius in pixels.', type: 'number', default: '8' },
  { property: 'borderColor', description: 'Card border color.', type: 'string (hex)' },
  { property: 'borderWidth', description: 'Card border width in pixels.', type: 'number', default: '0' },
  { property: 'width / height', description: 'Manual size overrides for the card.', type: 'number (px)' },
  { property: 'iconCloseColor', description: 'Color of the close (×) icon.', type: 'string (hex)', default: "'#64748B'" },
  { property: 'showCloseIcon', description: 'Whether the close icon is visible.', type: 'boolean', default: 'true' },
  { property: 'closeIconPosition', description: 'Where the close icon sits on the card.', type: "'left' | 'center' | 'right'", default: "'right'" },
  {
    property: 'animationType',
    description: 'How the card enters the screen. "slide" supports a direction (slideDown / slideLeft / slideRight).',
    type: "'instant' | 'fadeIn' | 'slide' | 'slideDown' | 'slideLeft' | 'slideRight'",
    default: "'fadeIn'",
  },
  {
    property: 'dismissSettings',
    description: 'How the visitor is allowed to close the tooltip card.',
    type: "'onOutSideClick' | 'dismissButtonClickOnly' | 'buttonClickOnly'",
    default: "'onOutSideClick'",
  },
];

const CONSTRUCTOR_ROWS = [
  { property: 'applicationId', description: 'Your PagePilot application ID.', type: 'string' },
  { property: 'apiHost', description: 'PagePilot API host.', type: 'string', default: `'${AHD_API_HOST}'` },
  { property: 'visitorId', description: 'Per-visitor identifier used for "show once" tracking.', type: 'string' },
];

const METHOD_ROWS = [
  {
    property: 'initializeSiteMap(refetch)',
    description: 'Fetches the sitemap before rendering any experience.',
    type: '(refetch: boolean) => Promise<void>',
  },
  {
    property: 'showHighlights(slug, refetch)',
    description: 'Registers and renders all tooltips (and tours) published for the given slug.',
    type: '(slug: string, refetch: boolean) => Promise<void>',
  },
  { property: 'stop()', description: 'Removes all active tooltips from the page.', type: '() => void' },
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

showHighlights("target-page", true) //  Replace 'target-page' with the actual Target Page where you want to show tooltips.

Ensure the initialization runs only once when the app loads (use onMounted if needed).

Add brief comments explaining what each step does.`;

const LIVE_DEMO_CODE = `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import AHDjs from 'ahdjs';
import 'ahdjs/build/css/index.css';

// Tooltips load automatically when the route mounts — no button needed.
const ahdRef = ref(null);
let cancelled = false;

onMounted(async () => {
  const ahdJs = AHDjs(undefined, {
    applicationId: '${DEMO_APPLICATION_ID}',
    apiHost: '${AHD_API_HOST}',
    visitorId: 'visitor-id',
  });
  ahdRef.value = ahdJs;

  await ahdJs.initializeSiteMap(false);
  if (!cancelled) await ahdJs.showHighlights('${TOOLTIP_SLUG}', true);
});

onUnmounted(() => {
  cancelled = true;
  ahdRef.value?.stop();
});
<\/script>

<template>
  <button id="tooltip-new-project">+ New project</button>
  <button id="tooltip-invite">Invite members</button>
</template>`;

const BASIC_CODE = `import { ref, onMounted, onUnmounted, watch } from 'vue';
import AHDjs from 'ahdjs';
import 'ahdjs/build/css/index.css';

export function useTooltips(slug) {
  const ahdRef = ref(null);
  let cancelled = false;

  const load = async () => {
    const ahdJs = AHDjs(undefined, {
      applicationId: 'YOUR_APPLICATION_ID',
      apiHost: '${AHD_API_HOST}',
      // Pass the logged-in user's id from your auth system so PagePilot
      // can track "show only once" per user. e.g. currentUser.id
      visitorId: currentUser.id,
    });
    ahdRef.value = ahdJs;

    await ahdJs.initializeSiteMap(false);
    if (!cancelled) await ahdJs.showHighlights(slug, true);
  };

  onMounted(load);

  // Clean up tooltips when the component unmounts.
  onUnmounted(() => {
    cancelled = true;
    ahdRef.value?.stop();
  });
}

// Usage: call it on the page where the tooltips are published.
// useTooltips('${TOOLTIP_SLUG}');`;
</script>

<template>
  <DocLayout title="Tooltips" :sections="SECTIONS">
    <article id="tooltips-article">
      <header id="tooltips-header" class="mb-8 border-b border-slate-200 pb-6">
        <h1 id="tooltips-title" class="mt-1 text-3xl font-bold" style="width: fit-content">
          Tooltips
        </h1>
        <p id="tooltips-intro" class="mt-3 text-lg leading-relaxed text-slate-600">
          A tooltip is a contextual hint anchored to a single element in your UI. It can be
          triggered by a hover, a click, or an icon beacon — giving users just-in-time guidance
          without interrupting their flow.
        </p>
      </header>

      <section id="overview" class="mb-12 scroll-mt-24">
        <h2 id="overview-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Overview</h2>
        <div id="overview-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="overview-text">
            Unlike a tour (which walks users through multiple steps), a tooltip is
            <strong id="overview-single">single-step</strong> and always attached to one DOM
            element. You configure its <strong id="overview-trigger">trigger behaviour</strong> (what makes it appear), its
            <strong id="overview-placement">placement</strong> relative to the element, and its
            <strong id="overview-style">visual style</strong>. PagePilot resolves which tooltips to
            show based on the current page slug.
          </p>
        </div>
      </section>

      <section id="live-demo" class="mb-12 scroll-mt-24">
        <h2 id="live-demo-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Live demo</h2>
        <div id="live-demo-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="live-demo-text" style="width: fit-content">
            The tooltips published against the <code id="live-demo-slug" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">{{ TOOLTIP_SLUG }}</code> slug
            load <strong id="live-demo-cta-text">automatically</strong> as soon as you open this
            page — exactly as they would on a real route. Hover or click the sample buttons below to
            see them in action.
          </p>
          <DemoBlock title="Show tooltips" :code="LIVE_DEMO_CODE">
            <template #description>
              Calls <code id="live-demo-method" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights("{{ TOOLTIP_SLUG }}", true)</code> after
              initializing the client.
            </template>
            <div id="tooltips-live-demo" class="flex flex-col gap-4">
              <div id="tooltips-live-controls" class="flex items-center gap-3">
                <span v-if="status === 'loading'" id="tooltips-status-loading" class="flex items-center gap-1.5 text-sm font-semibold text-slate-500">
                  <Lightbulb :size="15" /> Loading tooltips…
                </span>
                <span v-if="error" id="tooltips-status-error" class="flex items-center gap-1.5 text-sm font-semibold text-rose-600">
                  <AlertCircle :size="15" /> {{ error }}
                </span>
              </div>

              <div id="tooltips-demo-stage" class="flex flex-wrap items-center gap-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6">
                <button id="tooltip-new-project" type="button" class="rounded-lg bg-brand px-3.5 py-2 text-sm text-white">
                  + New project
                </button>
                <button id="tooltip-invite" type="button" class="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm">
                  Invite members
                </button>
                <button id="tooltip-settings" type="button" class="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-sm">
                  Settings
                </button>
                <div id="tooltip-help" title="Help" class="ml-auto grid h-9 w-9 place-items-center rounded-full border border-slate-200 bg-white text-sm font-semibold text-slate-600">
                  ?
                </div>
              </div>
            </div>
          </DemoBlock>
        </div>
      </section>

      <section id="integration" class="mb-12 scroll-mt-24">
        <h2 id="integration-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Integration</h2>
        <div id="integration-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="integration-text">
            Tooltips use the exact same SDK call as tours —
            <code id="integration-method" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights(slug, true)</code>. PagePilot looks up
            everything published for that slug (tooltips and tours) and renders it. So if you've
            already wired PagePilot for tours, tooltips work with no extra code.
          </p>

          <ol id="integration-steps" class="my-4 space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
            <li>
              <strong class="text-ink">1. Install</strong> — add the package with
              <code id="integration-step-install" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">npm install ahdjs</code>.
            </li>
            <li>
              <strong class="text-ink">2. Configure</strong> — create the client with your
              <code id="integration-step-appid" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">applicationId</code> and pass the logged-in user's
              id as <code id="integration-step-visitor" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">visitorId</code> (used for "show only once"
              tracking).
            </li>
            <li>
              <strong class="text-ink">3. Run on mount</strong> — call
              <code id="integration-step-init" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">initializeSiteMap()</code> then
              <code id="integration-step-show" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights("{{ TOOLTIP_SLUG }}", true)</code> once
              the target elements exist on the page.
            </li>
          </ol>

          <h3 id="integration-react-heading" class="mt-6 text-base font-semibold text-ink">Vue app (npm)</h3>
          <p id="integration-react-text" class="text-sm text-slate-600">
            Call <code id="integration-react-method" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights("{{ TOOLTIP_SLUG }}", true)</code>
            after the page mounts to register every tooltip published for that slug.
          </p>
          <DemoBlock
            title="Initialize and load tooltips"
            description="Runs once when the component mounts; cleans up on unmount."
            :code="BASIC_CODE"
          />
        </div>
      </section>

      <section id="ai-prompt" class="mb-12 scroll-mt-24">
        <h2 id="ai-prompt-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Integrate using AI</h2>
        <div id="ai-prompt-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="ai-prompt-text" class="text-sm text-slate-600">
            Don't want to wire it by hand? Hand this prompt to Cursor, Claude, or GitHub Copilot —
            it covers install, config, and the
            <code id="ai-prompt-call" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights</code> call so tooltips load on the right page.
          </p>
          <AiPromptBlock id="tooltips-ai-prompt" :prompt="AI_PROMPT" />
        </div>
      </section>

      <section id="target-page" class="mb-12 scroll-mt-24">
        <h2 id="target-page-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Target Page</h2>
        <div id="target-page-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="target-page-text">
            The page slug where the tooltip is active. PagePilot matches the visitor's URL path
            against this value; when it matches, the tooltip is registered on the page. It must
            start with a <code id="target-page-slash" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">/</code>.
          </p>
          <PropertyCard type="string" :required="true" defaultValue="'/'">
            <span id="target-page-prop">
              URL path the tooltip is bound to, e.g.
              <code id="target-page-eg1" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">/dashboard</code> or
              <code id="target-page-eg2" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">/settings</code>. Passed as the first argument to
              <code id="target-page-method" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights(slug, refetch)</code>.
            </span>
          </PropertyCard>
          <PropertyCard type="string[]" defaultValue="[]">
            <span id="alt-slugs-prop">
              <strong>Alternative slugs</strong> — additional paths the same tooltip should appear
              on. Useful when the same screen is accessible via multiple routes.
            </span>
          </PropertyCard>
        </div>
      </section>

      <section id="selector" class="mb-12 scroll-mt-24">
        <h2 id="selector-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Element / Selector</h2>
        <div id="selector-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="selector-text">
            The CSS selector for the element the tooltip is anchored to. The tooltip card and any
            optional trigger icon are positioned relative to this element.
          </p>
          <PropertyCard type="string" :required="true">
            <span id="selector-prop">
              Any valid CSS selector, e.g. <code id="selector-eg1" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">#tooltip-help</code> or
              <code id="selector-eg2" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">.invite-button</code>. If the element is absent when the page
              loads, the tooltip is silently skipped.
            </span>
          </PropertyCard>
        </div>
      </section>

      <section id="trigger" class="mb-12 scroll-mt-24">
        <h2 id="trigger-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Trigger behaviour</h2>
        <div id="trigger-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="trigger-text">
            Two settings work together: <strong>Trigger Behaviour</strong> decides
            <em>which interaction</em> opens the tooltip card, and
            <strong>Trigger Label and Icons</strong> decides <em>what the visitor sees</em> on the
            element beforehand to discover it.
          </p>
          <ApiTable :rows="TRIGGER_ROWS" />

          <h3 id="trigger-icon-styles-heading" class="mb-3 mt-6 text-base font-semibold text-ink">Icon styles</h3>
          <p id="trigger-icon-styles-text" class="mb-3">
            When <code id="trigger-icon-mode" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">triggerMode</code> is
            <code id="trigger-icon-icon" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">'icon'</code>, pick one of four beacon styles. The
            <strong>Animated Beacon</strong> toggle is only shown for the
            <code id="trigger-icon-beacon" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">beacon</code> style.
          </p>
          <div id="trigger-icon-grid" class="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div
              v-for="item in ICON_STYLES"
              :key="item.type"
              :id="`trigger-icon-option-${item.type}`"
              class="flex flex-col items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-4 text-center"
            >
              <component :is="item.icon" :size="22" class="text-brand" />
              <span class="text-sm font-medium text-slate-700">{{ item.label }}</span>
              <code class="font-mono text-[11px] text-slate-400">{{ item.type }}</code>
            </div>
          </div>
        </div>
      </section>

      <section id="position" class="mb-12 scroll-mt-24">
        <h2 id="position-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Position</h2>
        <div id="position-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="position-text">Where the tooltip card is placed relative to its target element.</p>
          <PropertyCard
            type="'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | 'center'"
            defaultValue="'right'"
          >
            <span id="position-prop">
              Stored as <code id="position-preferred" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">preferredPosition</code>. PagePilot uses it as
              the <em>preferred</em> placement — if there is not enough viewport space the card
              automatically flips to the opposite side. Available placements depend on the anchor
              element's room on screen.
            </span>
          </PropertyCard>
          <PropertyCard type="boolean" defaultValue="false">
            <span id="caret-prop">
              <strong>Caret (isCaret)</strong> — show a small pointer arrow between the card and the
              element.
            </span>
          </PropertyCard>
          <div id="position-grid" class="mt-4 grid grid-cols-3 gap-2">
            <div
              v-for="p in POSITIONS"
              :key="p"
              :id="`position-option-${p}`"
              class="rounded-lg border border-slate-200 bg-white px-3 py-4 text-center text-sm font-medium text-slate-700"
            >
              {{ p }}
            </div>
          </div>
        </div>
      </section>

      <section id="backdrop" class="mb-12 scroll-mt-24">
        <h2 id="backdrop-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Backdrop</h2>
        <div id="backdrop-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="backdrop-text">
            An optional dimmed overlay behind the target element. Enabling the backdrop focuses the
            visitor's attention on the highlighted element just like a tour step.
          </p>
          <PropertyCard type="boolean" defaultValue="false">
            <span id="backdrop-enabled-prop">
              <strong>isBackdrop</strong> — render the overlay. The target element is cut out and
              remains fully visible.
            </span>
          </PropertyCard>
        </div>
      </section>

      <section id="device-language" class="mb-12 scroll-mt-24">
        <h2 id="device-language-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Device & Language</h2>
        <div id="device-language-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="device-language-text">Limit which devices see the tooltip and which localized copy is served.</p>
          <PropertyCard type="'desktop' | 'tablet' | 'mobile'" defaultValue="'desktop'">
            <span id="device-prop">Target device for this tooltip.</span>
          </PropertyCard>
          <PropertyCard type="'en' | 'hi'" defaultValue="'en'">
            <span id="language-prop">Language of the tooltip content.</span>
          </PropertyCard>
        </div>
      </section>

      <section id="scheduling" class="mb-12 scroll-mt-24">
        <h2 id="scheduling-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Scheduling</h2>
        <div id="scheduling-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="scheduling-text">
            Control the window during which the tooltip is served. Outside this window PagePilot
            does not return the tooltip.
          </p>
          <PropertyCard type="Date" defaultValue="now">
            <span id="scheduling-start-prop"><strong>Start date</strong> — when the tooltip goes live.</span>
          </PropertyCard>
          <PropertyCard type="Date | null" defaultValue="null">
            <span id="scheduling-end-prop">
              <strong>End date</strong> — when it stops. Leave as <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">null</code> to run forever.
            </span>
          </PropertyCard>
        </div>
      </section>

      <section id="show-once" class="mb-12 scroll-mt-24">
        <h2 id="show-once-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Show only once</h2>
        <div id="show-once-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="show-once-text">
            When enabled a visitor sees the tooltip once; on subsequent page loads it is suppressed
            (tracked per <code id="show-once-visitor" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">visitorId</code>).
          </p>
          <PropertyCard type="boolean" defaultValue="false">
            <span id="show-once-prop">Show the tooltip only once per visitor.</span>
          </PropertyCard>

          <h3 id="show-once-where-heading" class="mt-6 text-base font-semibold text-ink">
            Where to set it
          </h3>
          <ol id="show-once-where-steps" class="mt-2 space-y-3 leading-relaxed text-slate-600">
            <li class="flex gap-3">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">1</span>
              <span>
                Open the tooltip in <strong>Page Pilot → Tooltips</strong> and click
                <strong>Edit Design</strong> to enter the tooltip editor.
              </span>
            </li>
            <li class="flex gap-3">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">2</span>
              <span>
                Click <strong>Publish</strong> to open the publish dialog.
              </span>
            </li>
            <li class="flex gap-3">
              <span class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand text-[11px] font-bold text-white">3</span>
              <span>
                Toggle <strong>Show Only Once</strong> on or off, then save. The change applies
                the next time the tooltip is fetched — no code changes are needed on your end.
              </span>
            </li>
          </ol>
          <p id="show-once-where-note" class="mt-4">
            This is a per-tooltip setting authored in Page Pilot, not a parameter of
            <code id="show-once-where-method" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">showHighlights()</code>. "Once per visitor" is
            tracked against the <code id="show-once-where-visitor" class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">visitorId</code> you pass when
            initializing the SDK, so make sure it's a stable, unique id per user.
          </p>
        </div>
      </section>

      <section id="styling" class="mb-12 scroll-mt-24">
        <h2 id="styling-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">Styling</h2>
        <div id="styling-body" class="space-y-3 leading-relaxed text-slate-600">
          <p id="styling-text">The tooltip card can be styled independently of your app's CSS.</p>
          <ApiTable :rows="STYLING_ROWS" />
        </div>
      </section>

      <section id="api" class="mb-12 scroll-mt-24">
        <h2 id="api-heading" class="mb-4 w-fit border-b border-slate-200 pb-2 text-xl font-bold">API reference</h2>
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
