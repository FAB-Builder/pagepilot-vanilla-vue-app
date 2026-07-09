<script setup lang="ts">
import Section from '../../../../components/doc/Section.vue';
import Code from '../../../../components/doc/Code.vue';
import DemoBlock from '../../../../components/DemoBlock.vue';
import ApiTable from '../../../../components/ApiTable.vue';
import { MENU_CODE } from '../snippets';

const rows = [
  {
    property: 'name',
    description:
      "The menu's name as set in Page Pilot, e.g. 'code-gen-header-features'. Each menu has a unique name.",
    type: 'string',
  },
];
</script>

<template>
  <Section id="menu" title="Fetch a menu">
    <p>
      Menus you build in Page Pilot (navigation, feature lists, footers, and similar) are fetched
      with the <Code>menu-by-name</Code> entity. Instead of a group or slug, you match a menu by
      its <Code>name</Code>. Each menu include returns its items under your chosen
      <Code>key</Code>.
    </p>
    <DemoBlock
      title="Fetch menus by name"
      description="Two menu includes — results land under data.headerMenu and data.featureMenu."
      :code="MENU_CODE"
      language="js"
    />
    <p>The menu filter accepts:</p>
    <ApiTable :rows="rows" />
    <p class="text-sm text-slate-600">
      Because <Code>includes</Code> is an array, you can request a page, its blogs, its FAQs, and
      several menus all in the same call.
    </p>
  </Section>
</template>
