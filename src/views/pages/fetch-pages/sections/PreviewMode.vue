<script setup lang="ts">
/**
 * Documents the `?mode=preview` convention: when a page URL carries it, the
 * site fetches that slug from the API at runtime instead of serving the copy
 * baked into its static build.
 */
import Section from '../../../../components/doc/Section.vue';
import Code from '../../../../components/doc/Code.vue';
import ApiTable from '../../../../components/ApiTable.vue';
import CodeSnippet from '../../../../components/CodeSnippet.vue';
import BlockCallout from '../../../blocks/shared/BlockCallout.vue';
import { PREVIEW_FETCH_CODE, PREVIEW_VUE_CODE, PREVIEW_NUXT_NOTE_CODE } from '../snippets';

const rows = [
  {
    property: 'mode',
    description:
      'Query parameter on any page URL. When set to "preview", the page is fetched from the API at runtime instead of served from the static build.',
    type: "'preview'",
    default: '—',
  },
  {
    property: 'includes',
    description:
      'Request body field. Pass an empty array in preview so the status filter is dropped and unpublished content is returned.',
    type: 'object[]',
    default: "[{ filter: { status: 'live' } }]",
  },
];
</script>

<template>
  <Section id="preview-mode" title="Preview mode">
    <p>
      <strong>The problem:</strong> most sites build Page Pilot content into static pages, so
      visitors get fast, cached HTML. The trade-off is staleness — edit a page in Page Pilot and
      the live site keeps serving the previous build until it redeploys. Authors have no way to
      see how a change actually looks on the real site until then.
    </p>
    <p>
      <strong>The fix:</strong> a query parameter that opts one page view out of the static copy.
      Append <Code>?mode=preview</Code> to any page URL and your site fetches that slug from the
      API at runtime, rendering the latest saved content — including edits still in draft. Page
      Pilot hands authors this URL in the publish dialog, next to the normal live URL.
    </p>
    <p>
      Nothing changes for real visitors. Without the parameter the static page renders exactly as
      before, so caching, build output, and SEO are untouched.
    </p>

    <ApiTable :rows="rows" />

    <p>
      <strong>Step 1 — fetch without the live filter.</strong> The endpoint is the same one you
      already use. The only difference is <Code>includes</Code>: normally you pass
      <Code>[{ filter: { status: 'live' } }]</Code> so drafts never reach visitors, but in preview
      you pass an empty array so unpublished content comes back too.
    </p>
    <CodeSnippet
      title="fetchPageBySlug with a preview flag"
      :code="PREVIEW_FETCH_CODE"
      language="js"
    />

    <p>
      <strong>Step 2 — detect the flag and swap the content.</strong> Read the query string after
      mount and fetch only when preview is on. The statically built page paints first, then the
      live copy replaces it once the request resolves, so there is no blank screen while the
      request is in flight.
    </p>
    <CodeSnippet
      title="Swap in live content when previewing"
      :code="PREVIEW_VUE_CODE"
      language="vue"
    />

    <BlockCallout title="Nuxt: do not read query params during SSR for this" variant="warning">
      If you're on Nuxt, resolving <Code>useRoute().query</Code> on the server treats the route as
      dynamic and can opt the page out of static prerendering (<Code>nuxt generate</Code> /
      Nitro prerender) — the same class of problem Next.js hits with
      <Code>useSearchParams()</Code>. Reading <Code>window.location.search</Code> inside
      <Code>onMounted</Code> runs client-only, after hydration, so the page still prerenders and
      still flips to preview once loaded.
    </BlockCallout>
    <CodeSnippet title="The pattern to use instead" :code="PREVIEW_NUXT_NOTE_CODE" language="js" />

    <BlockCallout title="Preview URLs expose drafts" variant="info">
      Because preview bypasses the <Code>status: 'live'</Code> filter, anyone holding the URL can
      read unpublished content for that page. Treat these links as internal review tools, not as
      something to share publicly or list in a sitemap.
    </BlockCallout>
  </Section>
</template>
