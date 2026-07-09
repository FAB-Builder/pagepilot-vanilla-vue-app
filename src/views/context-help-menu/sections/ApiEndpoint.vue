<script setup lang="ts">
import Section from '../../../components/doc/Section.vue';
import Code from '../../../components/doc/Code.vue';
import DemoBlock from '../../../components/DemoBlock.vue';
import { FETCH_MENU_CODE } from '../snippets';
</script>

<template>
  <Section id="api-endpoint" title="The API endpoint">
    <p>
      Send a <Code>GET</Code> request to:
    </p>
    <pre class="rounded-lg bg-slate-100 px-4 py-3 font-mono text-sm text-slate-700">GET /api/tenant/{WORKSPACE_ID}/menu-by-name/{MENU_NAME}</pre>
    <ul class="ml-4 list-disc space-y-1">
      <li>
        <Code>WORKSPACE_ID</Code> — your Page Pilot workspace id. Find it in
        <strong>Page Pilot → Settings → General</strong>.
      </li>
      <li>
        <Code>MENU_NAME</Code> — the <strong>name</strong> you gave the menu when you created it
        in
        <a
          href="https://pagepilot.fabbuilder.com/menu"
          target="_blank"
          rel="noreferrer"
          class="font-medium text-brand underline underline-offset-2 hover:text-brand-dark"
        >
          Page Pilot → Menus
        </a>
        . For example, if your menu is named <Code>my-help-menu</Code>, the URL ends with
        <Code>/menu-by-name/my-help-menu</Code>.
      </li>
    </ul>
    <p>
      No request body is needed. The response is a menu object whose <Code>configuration</Code>
      field contains the root array of <Code>HelpItem</Code> nodes.
    </p>
    <DemoBlock title="Fetch a menu by name" :code="FETCH_MENU_CODE" language="js">
      <template #description>Replace YOUR_MENU_NAME with the name of your menu in Page Pilot.</template>
    </DemoBlock>
  </Section>
</template>
