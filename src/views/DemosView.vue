<script setup lang="ts">
import { ExternalLink } from '@lucide/vue';
import { DEMO_APPLICATION_ID } from '../lib/ahd';
import DocLayout from '../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import DemoBlock from '../components/DemoBlock.vue';
import ApiTable from '../components/ApiTable.vue';
import PropertyCard from '../components/PropertyCard.vue';
import AiPromptBlock from '../components/AiPromptBlock.vue';

const DEMO_ID = '6a22c1d7b237c3d4ae94bf2f';
const DEMO_VIEWER_URL = `https://pagepilot-demo-viewer-prod.web.app//?tid=${DEMO_APPLICATION_ID}&did=${DEMO_ID}&type=demo&status=live`;

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'live-demo', label: 'Live demo' },
  { id: 'integration', label: 'Integration' },
  { id: 'embed-visibility', label: 'Conditional visibility' },
  { id: 'ai-prompt', label: 'Integrate using AI' },
  { id: 'steps', label: 'Steps' },
  { id: 'navigation', label: 'Navigation' },
  { id: 'backdrop', label: 'Backdrop' },
  { id: 'device-language', label: 'Device & Language' },
  { id: 'scheduling', label: 'Scheduling' },
  { id: 'styling', label: 'Step styling' },
];

const SHARE_LINK_ROWS = [
  { property: 'tid', description: 'Your PagePilot tenant ID.', type: 'string' },
  { property: 'did', description: 'The demo record ID.', type: 'string' },
  { property: 'type', description: 'Always "demo".', type: "'demo'" },
  { property: 'status', description: 'Always "live".', type: "'live'" },
];

const MESSAGE_ROWS = [
  { property: 'DEMO_LOAD_STARTED', description: 'Iframe has mounted, before any API call.', type: 'type' },
  { property: 'DEMO_LOADING', description: 'API call is in-flight.', type: 'type' },
  { property: 'DEMO_STATUS', description: "Publish state resolved. Extra field: status: 'live' | 'draft'", type: 'type' },
  { property: 'DEMO_LOADED', description: 'Demo content is fully rendered inside the iframe.', type: 'type' },
];

const STEP_ROWS = [
  { property: 'title', description: 'Heading text shown at the top of the step card.', type: 'string' },
  { property: 'content', description: 'Body copy for the step (supports rich text / HTML).', type: 'string | HTML' },
  { property: 'backgroundImage', description: 'URL of an image rendered as the step card background.', type: 'string (URL)' },
  { property: 'position', description: 'Placement of the card on screen.', type: "'top' | 'bottom' | 'left' | 'right' | 'center'", default: "'center'" },
  { property: 'width / height', description: 'Canvas dimensions of the step card in pixels.', type: 'number (px)' },
  { property: 'top / left', description: 'Absolute canvas offset for the step card.', type: 'number (px)' },
  { property: 'canvasWidth / canvasHeight', description: 'Reference canvas size used to scale the step proportionally.', type: 'number (px)' },
];

const NAV_ROWS = [
  {
    property: 'navigationMode',
    description: '"manual" — visitor clicks next/previous. "auto" — steps advance automatically after a delay. "both" — auto-advance while still letting the visitor navigate manually.',
    type: "'manual' | 'auto' | 'both'",
    default: "'manual'",
  },
  { property: 'navigationDelay', description: 'Milliseconds between auto-advance steps (auto / both modes only).', type: 'number', default: '3000' },
  {
    property: 'dismissSettings',
    description: 'How the visitor can close the demo mid-flow.',
    type: "'onOutSideClick' | 'dismissButtonClickOnly' | 'buttonClickOnly'",
    default: "'onOutSideClick'",
  },
  { property: 'showCloseIcon', description: 'Whether the close (×) button is visible on each step.', type: 'boolean', default: 'true' },
];

const STYLING_ROWS = [
  { property: 'canvasColor', description: 'Background color of the step card.', type: 'string (hex)', default: "'#FFFFFF'" },
  { property: 'textColor', description: 'Text color inside the card.', type: 'string (hex)', default: "'#262626'" },
  { property: 'fontFamily', description: 'Font family for the card content.', type: 'string', default: "'MODERN_SANS'" },
  { property: 'borderRadius', description: 'Card corner radius in pixels.', type: 'number', default: '8' },
  { property: 'borderColor', description: 'Card border color.', type: 'string (hex)' },
  { property: 'borderWidth', description: 'Card border width in pixels.', type: 'number', default: '0' },
  { property: 'iconCloseColor', description: 'Color of the close (×) icon.', type: 'string (hex)', default: "'#64748B'" },
  {
    property: 'animationType',
    description: 'How each step card enters the screen. "slide" supports a direction (slideDown / slideLeft / slideRight).',
    type: "'instant' | 'fadeIn' | 'slide'",
    default: "'fadeIn'",
  },
];

/* ------------------------------- Snippets ------------------------------- */

const AI_PROMPT = `Embed a PagePilot demo into my application. Do the following steps automatically:

No npm install or SDK setup is required. PagePilot demos are embedded via an iframe.

Add the following responsive iframe embed to the page where the demo should appear:

<div style="position:relative;padding-bottom:calc(54.75% + 25px);width:100%;height:0;">
  <iframe
    loading="lazy"
    src="https://pagepilot-demo-viewer-prod.web.app/?tid=YOUR_TENANT_ID&did=YOUR_DEMO_ID&type=demo&status=live"
    style="position:absolute;top:0;left:0;width:100%;height:100%;"
    frameborder="0"
    allowfullscreen
  ></iframe>
</div>

Replace YOUR_TENANT_ID and YOUR_DEMO_ID with the values shown in the PagePilot admin integration dialog after publishing the demo.

If my project uses Vue, convert the markup into a <script setup lang="ts"> + <template> component with the style attribute written as a Vue inline style binding.

Detect my framework (React, Next.js, Vue, plain HTML, etc.) and produce the embed in the correct syntax.`;

const SHARE_LINK = `https://pagepilot-demo-viewer-prod.web.app/?tid=YOUR_TENANT_ID&did=YOUR_DEMO_ID&type=demo&status=live`;

const EMBED_CODE = `<script setup lang="ts">
<\/script>

<template>
  <div style="position: relative; padding-bottom: calc(54.75% + 25px); width: 100%; height: 0">
    <iframe
      loading="lazy"
      src="https://pagepilot-demo-viewer-prod.web.app/?tid=YOUR_TENANT_ID&did=YOUR_DEMO_ID&type=demo&status=live"
      style="position: absolute; top: 0; left: 0; width: 100%; height: 100%"
      frameborder="0"
      allowfullscreen
    />
  </div>
</template>`;

const VISIBILITY_EMBED_CODE = `<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const status = ref<'live' | 'draft' | null>(null); // null | 'live' | 'draft'

function handleMessage(event: MessageEvent) {
  const msg = event.data;
  if (!msg || msg.source !== 'pagepilot-demo-viewer') return;

  if (msg.type === 'DEMO_STATUS') {
    status.value = msg.status;
  }
}

onMounted(() => window.addEventListener('message', handleMessage));
onUnmounted(() => window.removeEventListener('message', handleMessage));
<\/script>

<template>
  <div
    v-if="status !== 'draft'"
    :style="{
      visibility: status === 'live' ? 'visible' : 'hidden',
      position: 'relative',
      paddingBottom: 'calc(54.75% + 25px)',
      width: '100%',
      height: 0,
      marginTop: '40px',
    }"
  >
    <iframe
      loading="lazy"
      src="https://pagepilot-demo-viewer-prod.web.app/?tid=YOUR_TID&did=YOUR_DID&type=demo"
      allow="fullscreen"
      style="
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        border: 1px solid rgba(63, 95, 172, 0.35);
        box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);
        border-radius: 10px;
        box-sizing: border-box;
      "
    />
  </div>
</template>`;
</script>

<template>
  <DocLayout title="Demos" :sections="SECTIONS">
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold">Demos</h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          A demo is a multi-step interactive presentation that showcases product features in
          sequence. Demo steps are <strong>not bound to page elements</strong> — they float freely
          as a story-like slideshow. Once published, share it via a <strong>link</strong> or embed
          it anywhere as an <strong>iframe</strong> — no SDK integration required.
        </p>
      </header>

      <section id="overview" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Overview</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p>
            A demo has <strong>demo-level settings</strong> (device, language, scheduling) and a list
            of <strong>steps</strong>. Each step is a canvas card with its own content, background
            image, and dimensions. The sections below document every property you configure in the
            PagePilot admin.
          </p>
          <p>
            <strong>Demo vs. Tour</strong> — use a <em>tour</em> to walk users through a real task
            in your app using element selectors. Use a <em>demo</em> for a controlled, self-contained
            presentation that works independently of the page DOM.
          </p>
        </div>
      </section>

      <section id="live-demo" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Live demo</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p>
            The demo below is embedded live — the same iframe your users see after you publish and
            share. Click through it to experience the step-by-step flow.
          </p>
          <div class="mb-3 flex justify-end">
            <a
              :href="DEMO_VIEWER_URL"
              target="_blank"
              rel="noopener noreferrer"
              class="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 transition-colors hover:border-brand hover:text-brand"
            >
              <ExternalLink :size="14" />
              Show on full page
            </a>
          </div>
          <div style="position: relative; padding-bottom: calc(54.75% + 25px); width: 100%; height: 0">
            <iframe
              loading="lazy"
              :src="DEMO_VIEWER_URL"
              allow="fullscreen"
              style="
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                border: 1px solid rgba(63, 95, 172, 0.35);
                box-shadow: 0px 0px 18px rgba(26, 19, 72, 0.15);
                border-radius: 10px;
                box-sizing: border-box;
              "
            />
          </div>
        </div>
      </section>

      <section id="integration" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Integration</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p>
            After publishing, PagePilot shows an integration dialog with two options. No SDK or build
            step is required.
          </p>

          <h3 class="mt-6 text-base font-semibold text-ink">Share link</h3>
          <p class="text-sm">
            A direct URL that opens the demo in the PagePilot viewer. Share it in emails, Slack, or
            anywhere.
          </p>
          <DemoBlock
            title="Share link"
            description="Copy from the Share Link tab in the integration dialog after publishing."
            :code="SHARE_LINK"
            language="text"
          />
          <ApiTable :rows="SHARE_LINK_ROWS" />

          <h3 class="mt-6 text-base font-semibold text-ink">Embed (iframe)</h3>
          <p class="text-sm">
            Drop this snippet into your app to render the demo inline. Copy the values from the
            <strong>Embed Demo</strong> tab in the integration dialog.
          </p>

          <DemoBlock
            title="Embed component"
            description="Drop this component anywhere in your Vue tree — no SDK needed."
            :code="EMBED_CODE"
          />
          <p class="text-sm text-slate-600">
            Replace <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">YOUR_TENANT_ID</code> and <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">YOUR_DEMO_ID</code> with the values shown
            in the PagePilot admin after publishing.
          </p>
        </div>
      </section>

      <section id="embed-visibility" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Conditional visibility</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p>
            By default the embed is always visible — even while the iframe is loading or if the demo
            is in <strong>draft</strong>. Use the <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">postMessage</code> event from the viewer to
            keep the wrapper hidden until the demo is confirmed live, avoiding a flash of a loading or
            draft state.
          </p>

          <h3 class="mt-6 text-base font-semibold text-ink">How it works</h3>
          <ol class="mt-2 list-decimal space-y-1 pl-5 text-sm text-slate-600">
            <li>The wrapper starts with <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">visibility: hidden</code> — the iframe loads in the background, invisible to the user.</li>
            <li>The iframe posts a <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">DEMO_STATUS</code> message once it knows its publish state.</li>
            <li>If <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">status === 'live'</code> the wrapper becomes visible. Otherwise it is removed from layout with <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">display: none</code>.</li>
          </ol>

          <p class="mt-3 rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Use <strong>visibility: hidden</strong>, not <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">display: none</code>, on the wrapper.
            <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">display: none</code> prevents the browser from loading the iframe at all, so
            <code class="inline-block max-w-full break-all rounded bg-brand-tint px-1.5 py-0.5 font-mono text-[13px] text-brand">DEMO_STATUS</code> never fires and the demo stays hidden forever.
          </p>

          <DemoBlock
            title="Embed with conditional visibility"
            description="The wrapper is hidden until the viewer confirms the demo is live."
            :code="VISIBILITY_EMBED_CODE"
          />

          <h3 class="mt-6 text-base font-semibold text-ink">postMessage event reference</h3>
          <p class="text-sm text-slate-600">All messages posted by the demo viewer share this shape:</p>
          <DemoBlock
            title="Message shape"
            code="{&#10;  source: 'pagepilot-demo-viewer',&#10;  type: string,&#10;  // additional fields depending on type&#10;}"
            language="js"
          />
          <ApiTable :rows="MESSAGE_ROWS" />

          <h3 class="mt-6 text-base font-semibold text-ink">Filtering messages safely</h3>
          <p class="text-sm text-slate-600">
            Always guard against messages from other sources (analytics, extensions, other iframes):
          </p>
          <DemoBlock
            title="Safe message guard"
            code="if (!msg || msg.source !== 'pagepilot-demo-viewer') return;"
            language="js"
          />
        </div>
      </section>

      <section id="ai-prompt" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Integrate using AI</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p class="text-sm text-slate-600">
            Want the embed dropped into the right place automatically? Hand this prompt to Cursor,
            Claude, or GitHub Copilot — it adds the responsive iframe (or share link) to your page.
          </p>
          <AiPromptBlock id="demos-ai-prompt" :prompt="AI_PROMPT" />
        </div>
      </section>

      <section id="steps" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Steps</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p>
            A demo is made up of one or more steps. Each step is a full-canvas card that floats on
            screen — <strong>no element selector is needed or used</strong>. Steps are shown in order;
            visitors advance with next / previous controls or automatically.
          </p>
          <ApiTable :rows="STEP_ROWS" />
        </div>
      </section>

      <section id="navigation" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Navigation</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p>Control how users move between steps.</p>
          <ApiTable :rows="NAV_ROWS" />
        </div>
      </section>

      <section id="backdrop" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Backdrop</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p>
            An optional dimmed overlay behind the step card. Because demo steps don't target specific
            elements, the backdrop dims the entire page behind the floating card.
          </p>
          <PropertyCard type="boolean" defaultValue="false">
            <strong>isBackdrop</strong> — render the full-page dimmed overlay behind the card.
          </PropertyCard>
        </div>
      </section>

      <section id="device-language" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Device & Language</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p>Restrict the demo to a specific device type and serve localised content.</p>
          <PropertyCard type="'desktop' | 'tablet' | 'mobile'" defaultValue="'desktop'">
            <strong>device</strong> — the demo is only served on the matching device type.
          </PropertyCard>
          <PropertyCard type="'en' | 'hi'" defaultValue="'en'">
            <strong>language</strong> — locale of the demo content.
          </PropertyCard>
        </div>
      </section>

      <section id="scheduling" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Scheduling</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p>
            Control the window during which the demo is served. Outside this window PagePilot does not
            return the demo.
          </p>
          <PropertyCard type="Date" defaultValue="now">
            <strong>Start date</strong> — when the demo goes live.
          </PropertyCard>
          <PropertyCard type="Date | null" defaultValue="null">
            <strong>End date</strong> — when it stops. Toggle <strong>Run Forever</strong> to keep it
            active indefinitely.
          </PropertyCard>
          <p class="rounded-lg border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Demos always run every time a visitor triggers them —
            <strong>Show only once</strong> is not available for demos.
          </p>
        </div>
      </section>

      <section id="styling" class="mb-12 scroll-mt-24">
        <h2 class="mb-4 border-b border-slate-200 pb-2 text-xl font-bold">Step styling</h2>
        <div class="space-y-3 leading-relaxed text-slate-600">
          <p>Each step card can be styled independently of your app's CSS.</p>
          <ApiTable :rows="STYLING_ROWS" />
        </div>
      </section>
    </article>
  </DocLayout>
</template>
