<script setup lang="ts">
import Section from '../../../../components/doc/Section.vue';
import AiPromptBlock from '../../../../components/AiPromptBlock.vue';
import { AI_PROMPT } from '../snippets';
</script>

<template>
  <Section id="ai-prompt" title="Integrate using AI">
    <p class="text-sm text-slate-600">
      Want your AI assistant to wire this up? Copy the prompt below into Cursor, Claude, or GitHub
      Copilot and it will fetch the page and its related list, with filtering, for you.
    </p>
    <AiPromptBlock id="fetch-pages-ai-prompt" :prompt="AI_PROMPT" />
  </Section>
</template>
