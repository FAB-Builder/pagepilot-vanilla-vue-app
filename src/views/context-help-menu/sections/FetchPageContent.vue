<script setup lang="ts">
import Section from '../../../components/doc/Section.vue';
import Code from '../../../components/doc/Code.vue';
import DemoBlock from '../../../components/DemoBlock.vue';
import { FETCH_PAGE_CODE, FULL_DRAWER_CODE } from '../snippets';
</script>

<template>
  <Section id="fetch-page-content" title="Fetch page content on item click">
    <p>
      Each <Code>HelpItem</Code> has an <Code>href</Code> field — the slug of a Page Pilot page.
      When a user clicks a menu item you fetch that page by its slug using the
      <Code>/pagebypath</Code> endpoint and render its content inside the drawer.
    </p>
    <pre class="rounded-lg bg-slate-100 px-4 py-3 font-mono text-sm text-slate-700">GET /api/tenant/{WORKSPACE_ID}/pagebypath/{slug}</pre>
    <p>
      The response is a <strong>page object</strong> with a <Code>sections</Code> array. Each
      section has a <Code>content</Code> field containing either an HTML string or MDX — check
      <Code>page.editor</Code> to decide how to render it:
    </p>
    <p>
      Each <Code>section.content</Code> is an HTML string. Sanitize it with
      <Code>DOMPurify</Code> before injecting via <Code>v-html</Code>.
    </p>
    <DemoBlock title="Fetch page content when an item is clicked" :code="FETCH_PAGE_CODE" language="js">
      <template #description>Call /pagebypath/{slug} using the item's href, then render its sections.</template>
    </DemoBlock>
    <p>
      Items without an <Code>href</Code> are category headers — skip the fetch and just
      expand/collapse their children.
    </p>
    <DemoBlock title="Complete drawer — menu + page content" :code="FULL_DRAWER_CODE" language="vue">
      <template #description>Full end-to-end: fetch the menu, click an item, fetch and render its page.</template>
    </DemoBlock>
  </Section>
</template>
