<script setup lang="ts">
import Section from '../../../../components/doc/Section.vue';
import Code from '../../../../components/doc/Code.vue';
import DemoBlock from '../../../../components/DemoBlock.vue';
import { COMBINED_CODE } from '../snippets';
</script>

<template>
  <Section id="all-together" title="Everything in one request">
    <p>
      You don't need separate calls for each type of content. List a <Code>pages</Code> include, a
      <Code>faq-group-list</Code> include, and a <Code>menu-by-name</Code> include together, and a
      single request returns them all — each under its own <Code>key</Code>.
    </p>
    <DemoBlock
      title="Fetch page + blogs + FAQs + menu"
      description="One call returns data.page, data.relatedBlogs, data.faqs and data.headerMenu."
      :code="COMBINED_CODE"
    />
    <p class="text-sm text-slate-600">
      The function returns a tidy object — <Code>pageInfo</Code>, <Code>blogs</Code>,
      <Code>faqs</Code>, and <Code>headerMenu</Code> — ready to drop into your page.
    </p>
  </Section>
</template>
