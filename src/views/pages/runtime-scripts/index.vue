<script setup lang="ts">
import DocLayout from '../../../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import Section from '@/components/doc/Section.vue';
import Code from '@/components/doc/Code.vue';
import CodeSnippet from '../../../components/CodeSnippet.vue';
import ApiTable from '../../../components/ApiTable.vue';
import { PAGES_SUBMODULES } from '../subModules';
import {
  SCRIPT_TAGS,
  NEXT_APP_ROUTER,
  VUE_APP,
  DANGEROUS_HTML,
  RE_INIT,
  CSP,
  ANIMATION_MARKUP,
} from './snippets';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Why scripts are needed' },
  { id: 'which', label: 'Which block needs which' },
  { id: 'enabling', label: 'Turning them on' },
  { id: 'embedding', label: 'Loading them yourself' },
  { id: 'dynamic', label: 'Content that loads late' },
  { id: 'animations', label: 'Animations' },
  { id: 'troubleshooting', label: 'Troubleshooting' },
];
</script>

<template>
  <DocLayout
    title="Runtime Scripts & Animations"
    :sections="SECTIONS"
    :sub-modules="PAGES_SUBMODULES"
    sub-modules-label="Pages"
  >
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">
          Runtime Scripts &amp; Animations
        </h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          Tabs, carousels, pagination, timers and animations need JavaScript to actually do
          something once published. Page Pilot hosts one small script per feature — this page
          covers when they're needed, how to include them, and what to do when your app injects
          the HTML itself.
        </p>
        <div class="mt-5 rounded-xl border border-indigo-200 bg-indigo-50 p-5">
          <p class="text-sm font-semibold text-ink">Applies to everything you publish</p>
          <p class="mt-1.5 text-sm leading-relaxed text-slate-600">
            Not just Pages. The same blocks — and therefore the same scripts — are available
            inside <strong>Tours</strong>, <strong>Tooltips</strong>,
            <strong>App Banners</strong>, <strong>Demos</strong> and <strong>FAQs</strong>. Every
            one of those has the same <strong>Scripts &amp; Styles</strong> tab in its publish
            dialog.
          </p>
        </div>
      </header>

      <Section id="overview" title="Why scripts are needed">
        <p>
          Everything Page Pilot publishes — a page, a tour step, a tooltip, an app banner, a demo
          — is <strong>static HTML</strong>. Most blocks need nothing more than that: text,
          images, layout and even per-device styling are all handled by markup and CSS.
        </p>
        <p>
          But some blocks are interactive. A carousel has to respond to a click on the arrow. A
          tab has to swap panels. Those behaviours can't be expressed in CSS, so Page Pilot ships
          a small script for each one, hosted at:
        </p>
        <div class="my-3 rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm text-slate-700">
          https://pagepilot.fabbuilder.com/scripts/
        </div>
        <p>
          Each script is independent and only touches its own blocks — it finds them by data
          attributes in the markup. Include only the ones your page actually uses.
        </p>
        <div class="my-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <strong class="text-ink">Blocks degrade rather than break.</strong> Without its script a
          carousel still shows its first slide and a tab still shows its first panel — you get a
          static version of the block, not an empty gap or an error.
        </div>
      </Section>

      <Section id="which" title="Which block needs which script">
        <ApiTable
          :rows="[
            {
              property: 'pagePilotTabs.js',
              description:
                'Tabs block — panel switching, keyboard navigation, and smooth scroll-to-section for tabs set to \'Scroll to selected section\'.',
              type: 'Tabs',
            },
            {
              property: 'pagePilotCarousel.js',
              description: 'Carousel block — arrows, dots, autoplay and touch swipe.',
              type: 'Carousel',
            },
            {
              property: 'pagePilotPagination.js',
              description:
                'Pagination block — page numbers, prev/next, and URL sync (?page=2) for deep links.',
              type: 'Pagination',
            },
            {
              property: 'pagePilotTimer.js',
              description:
                'Timer block — makes the countdown actually tick. Without it the timer renders the time remaining as at page load and stays there.',
              type: 'Timer',
            },
            {
              property: 'pagePilotAnimation.js',
              description:
                'Any animated block — entrance and scroll animations on Image, Container, Button, Avatar, Logo, Heading and Text.',
              type: 'Animations',
            },
            {
              property: 'pagePilotDemoScale.js',
              description: 'Demo block — scales the embedded demo to fit its container.',
              type: 'Demo',
            },
          ]"
        />
        <div class="my-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <strong class="text-ink">Accessibility Tools is the exception.</strong> That block
          bundles its own JavaScript inline with its markup, so it needs no separate script and
          no publish option.
        </div>
      </Section>

      <Section id="enabling" title="Turning them on">
        <p>
          Open the <strong>Publish</strong> dialog and switch to the
          <strong>Scripts &amp; Styles</strong> tab. Page Pilot scans the content and lists a
          checkbox only for the scripts it actually needs — content with no carousel never shows
          the carousel option.
        </p>
        <p>
          Each row shows the script's URL with a copy button. Leave the boxes ticked and the
          script tags go into the published HTML for you.
        </p>
        <div class="my-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <strong class="text-ink">Same tab wherever you publish.</strong> Pages, Tours,
          Tooltips, App Banners, Demos and FAQs all share this behaviour — if the content contains
          an interactive block, the matching option appears. A tour step with a carousel in it
          needs the carousel script exactly as a page would.
        </div>
        <div class="my-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-600">
          <strong class="text-ink">Ticking the box is not always enough.</strong> If your
          application renders the page by injecting raw HTML, those injected
          <Code>&lt;script&gt;</Code> tags will not run — see the next section. This is the
          single most common reason a carousel "doesn't work" on a live site.
        </div>
      </Section>

      <Section id="embedding" title="Loading them yourself">
        <p class="mb-2 mt-6 font-semibold text-ink">The problem</p>
        <p>
          Browsers deliberately ignore <Code>&lt;script&gt;</Code> tags inserted through
          <Code>innerHTML</Code> (Vue's <Code>v-html</Code> included). If you fetch a page's HTML
          and render it with <Code>v-html</Code> — the normal pattern when embedding Page Pilot
          content in your own app — the markup appears but the script never executes.
        </p>
        <CodeSnippet :code="DANGEROUS_HTML" language="html" title="the gotcha" />
        <p>
          The fix is simple: keep injecting the HTML exactly as you do now, and load the script
          once from your own app shell instead.
        </p>

        <div class="my-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-slate-600">
          <strong class="text-ink">This affects SDK-rendered content too.</strong> Tours,
          tooltips and app banners are injected into your app by AHDjs at runtime, which means
          their markup also arrives through the DOM rather than a page load. If a tour step
          contains a carousel or an animated block, load that script from your app shell — the
          same fix, for the same reason.
        </div>

        <p class="mb-2 mt-6 font-semibold text-ink">Plain HTML</p>
        <CodeSnippet :code="SCRIPT_TAGS" language="html" title="index.html" />

        <p class="mb-2 mt-6 font-semibold text-ink">Next.js</p>
        <CodeSnippet :code="NEXT_APP_ROUTER" language="tsx" title="app/layout.tsx" />

        <p class="mb-2 mt-6 font-semibold text-ink">Vue (Vite, Nuxt, any SPA)</p>
        <CodeSnippet :code="VUE_APP" language="vue" title="App.vue" />
        <div class="my-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <strong class="text-ink">Load once, at app level.</strong> Don't load these inside a
          component that mounts per page — you'd add a duplicate tag on every navigation. The
          guard in the example above makes that harmless, but app-level is still the right place.
        </div>
      </Section>

      <Section id="dynamic" title="Content that loads late">
        <p>
          A common worry: the script loads at startup, but your page content arrives afterwards
          — from a fetch, a client-side route change, or a modal opening. Does the block still
          get wired up?
        </p>
        <p>
          <strong>Yes, automatically.</strong> Every script attaches a
          <Code>MutationObserver</Code> to the document and re-runs its initialisation whenever
          new nodes appear. Elements it has already handled are skipped, so re-binding costs
          almost nothing.
        </p>
        <CodeSnippet :code="RE_INIT" language="vue" title="nothing extra to do" />
        <div class="my-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <strong class="text-ink">No init function to call.</strong> There's no
          <Code>window.PagePilot*.init()</Code> API — the scripts are self-contained and
          self-rebinding. If a block isn't working after a route change, the cause is something
          else; see Troubleshooting.
        </div>
      </Section>

      <Section id="animations" title="Animations">
        <p>
          Seven blocks — <strong>Image</strong>, <strong>Container</strong>,
          <strong>Button</strong>, <strong>Avatar</strong>, <strong>Logo</strong>,
          <strong>Heading</strong> and <strong>Text</strong> — have an animation section in their
          sidebar. All of them are driven by the single
          <Code>pagePilotAnimation.js</Code> script.
        </p>

        <p class="mb-2 mt-6 font-semibold text-ink">Options</p>
        <ApiTable
          :rows="[
            {
              property: 'type',
              description:
                'fade-in, slide-left, slide-right, slide-up, slide-down, zoom-in, or bounce. Set to none to disable.',
              type: 'enum',
              default: 'none',
            },
            {
              property: 'trigger',
              description:
                'load — plays immediately. scroll — plays when the element enters the viewport. hover / click — plays on interaction.',
              type: 'enum',
              default: 'load',
            },
            {
              property: 'speed',
              description: 'slow (1.2s), medium (0.7s), or fast (0.35s).',
              type: 'enum',
              default: 'medium',
            },
            {
              property: 'delay',
              description:
                'Milliseconds to wait before playing, up to 10000. Useful for staggering several elements.',
              type: 'number',
              default: '0',
            },
            {
              property: 'disableOnMobile',
              description:
                'Skips the animation at mobile width, where entrance motion is often more distracting than useful.',
              type: 'boolean',
              default: 'false',
            },
          ]"
        />

        <p class="mb-2 mt-6 font-semibold text-ink">How it renders</p>
        <p>
          The editor writes your settings onto the element as data attributes. The stylesheet
          defines the motion; the script reads the attributes and applies the timing.
        </p>
        <CodeSnippet :code="ANIMATION_MARKUP" language="html" title="published markup" />

        <div class="my-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <strong class="text-ink">Nothing shifts on the page.</strong> Animations only ever use
          <Code>transform</Code> and <Code>opacity</Code> — never width, height or margin — so
          playing one can't reflow the page or push content around.
        </div>

        <p class="mb-2 mt-6 font-semibold text-ink">Without the script</p>
        <p>
          This is the one case worth understanding properly. Elements set to animate on
          <strong>scroll</strong>, <strong>hover</strong> or <strong>click</strong> would
          normally start hidden, waiting for their trigger — so if the script never loaded, they
          would stay invisible forever.
        </p>
        <p>
          To prevent that, the "start hidden" rule is scoped behind a class that
          <em>only the script itself adds</em>, once it has loaded and bound. No script means the
          rule never applies and every element simply renders in its normal, visible state.
        </p>
        <div class="my-4 rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
          <strong class="text-ink">So a missing animation script costs you the animation, not
          the content.</strong> Worth knowing when deciding whether to bother including it — a
          page without it looks static, never broken.
        </div>

        <p class="mb-2 mt-6 font-semibold text-ink">Reduced motion</p>
        <p>
          Visitors who have asked their operating system to reduce motion get no animations. This
          is handled for you and isn't configurable.
        </p>
      </Section>

      <Section id="troubleshooting" title="Troubleshooting">
        <p class="mb-2 mt-6 font-semibold text-ink">The block renders but doesn't respond</p>
        <p>
          The script isn't running. Open your browser's Network tab and check whether the
          <Code>pagePilot*.js</Code> request appears and returns 200. If it isn't there at all,
          you're hitting the <Code>innerHTML</Code>/<Code>v-html</Code> problem — load the script
          from your app shell instead.
        </p>

        <p class="mb-2 mt-6 font-semibold text-ink">Works in preview, not on the live site</p>
        <p>
          Page Pilot's own preview renders the page directly, so injected script tags run
          normally. Your application probably embeds the HTML instead. Same fix as above.
        </p>

        <p class="mb-2 mt-6 font-semibold text-ink">Blocked by Content-Security-Policy</p>
        <p>
          If your site sets a CSP header, it must allow the Page Pilot script host. A blocked
          script shows as a console error naming the directive that rejected it.
        </p>
        <CodeSnippet :code="CSP" language="bash" title="CSP header" />

        <p class="mb-2 mt-6 font-semibold text-ink">Animations never play</p>
        <p>
          Check the trigger first — an element set to <Code>scroll</Code> only animates when
          scrolled into view, so one already visible on load may look like it did nothing. Then
          check <Code>disableOnMobile</Code>, and whether the visitor has reduced motion enabled.
        </p>

        <p class="mb-2 mt-6 font-semibold text-ink">Works on first load, breaks after navigating</p>
        <p>
          The scripts re-bind on DOM changes automatically, so this usually means the script tag
          was removed along with the previous page's markup — a sign it was loaded inside a
          per-page component rather than the app shell.
        </p>
      </Section>
    </article>
  </DocLayout>
</template>
