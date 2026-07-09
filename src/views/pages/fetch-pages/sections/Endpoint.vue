<script setup lang="ts">
import Section from '../../../../components/doc/Section.vue';
import Code from '../../../../components/doc/Code.vue';
import DemoBlock from '../../../../components/DemoBlock.vue';
import { BASIC_CODE } from '../snippets';
</script>

<template>
  <Section id="endpoint" title="The endpoint">
    <p>
      Send a <Code>POST</Code> to <Code>/pagebyslug/{slug}</Code> with a JSON body. The
      body is where you describe what related content to pull in (see <Code>includes</Code> below).
      At its simplest, with no body, it just returns the page.
    </p>
    <DemoBlock
      title="Fetch a single page"
      description="Returns the page that matches the slug."
      :code="BASIC_CODE"
    />
    <p class="text-sm text-slate-600">
      The response contains the matched page under <Code>page</Code>, plus a key for each include
      you requested.
    </p>
  </Section>
</template>
