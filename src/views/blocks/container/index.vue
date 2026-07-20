<script setup lang="ts">
import DocLayout from '../../../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import Section from '../../../components/doc/Section.vue';
import Code from '../../../components/doc/Code.vue';
import PropertyCard from '../../../components/PropertyCard.vue';
import BlockCallout from '../shared/BlockCallout.vue';
import { BLOCKS_SUBMODULES } from '../subModules';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'background', label: 'Background & border' },
  { id: 'size', label: 'Size & alignment' },
  { id: 'link', label: 'Link' },
  { id: 'accessibility', label: 'Accessibility' },
  { id: 'responsive', label: 'Per-device behaviour' },
];

const HTML_TAGS: string[] = ['div', 'section', 'article', 'nav', 'aside', 'header', 'footer', 'main'];
</script>

<template>
  <DocLayout title="Container" :sections="SECTIONS" :sub-modules="BLOCKS_SUBMODULES" sub-modules-label="Blocks">
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">
          Container Block
        </h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          A general-purpose wrapper — background, border, sizing, an optional link, and a
          choice of semantic HTML tag. The building block for page sections.
        </p>
      </header>

      <Section id="overview" title="Overview">
        <p>
          Container holds any other blocks and gives them a shared background, border, width,
          and padding. It's what you reach for when you want a visually distinct band or card on
          the page.
        </p>
      </Section>

      <Section id="background" title="Background & border">
        <PropertyCard type="media gallery">
          <strong>Add background image</strong> — opens the media gallery. Desktop-only.
        </PropertyCard>
        <PropertyCard type="color | null" default-value="#ffffff">
          <strong>Color</strong> — background color. Desktop-only.
        </PropertyCard>
        <PropertyCard type="boolean" default-value="true">
          <strong>No repeat</strong> — controls whether a background image tiles. On means
          <Code>no-repeat</Code>; off means <Code>repeat</Code>.
        </PropertyCard>
        <PropertyCard type="'cover' | 'contain' | …">
          <strong>Background size</strong> — how the image scales to fill the container.
        </PropertyCard>
        <PropertyCard type="number | per-corner" default-value="0">
          <strong>Radius</strong>
        </PropertyCard>
        <PropertyCard type="color | null" default-value="null">
          <strong>Border</strong> color. Setting it reveals a per-side
          <strong>Border width</strong> control, defaulting to 1px all round.
        </PropertyCard>
        <PropertyCard type="per-side spacing" default-value="0 on all sides">
          <strong>Padding</strong> and <strong>Margin</strong>
        </PropertyCard>
      </Section>

      <Section id="size" title="Size & alignment">
        <PropertyCard type="'fixed' | 'fill' | 'fit'" default-value="fit">
          <strong>Width</strong> — <Code>fit</Code> hugs the content, <Code>fill</Code> takes
          the full container width, <Code>fixed</Code> uses an exact value. The unit selector
          switches between <Code>px</Code> and <Code>%</Code>.
        </PropertyCard>
        <PropertyCard type="number | null" default-value="null">
          <strong>Height</strong> — in px. Leave empty to size to content.
        </PropertyCard>
        <PropertyCard type="boolean" default-value="false">
          <strong>Overflow</strong> — whether content that exceeds a fixed height is visible or
          clipped.
        </PropertyCard>
        <PropertyCard type="'left' | 'center' | 'right'" default-value="left">
          <strong>Horizontal align</strong> — where the container sits in its parent. Hidden
          when Width is <Code>fill</Code>, since a full-width container has nowhere to move.
        </PropertyCard>
      </Section>

      <Section id="link" title="Link">
        <PropertyCard type="boolean" default-value="false">
          <strong>Enable link</strong> — makes the whole container clickable. Turning it on
          reveals the URL and target controls.
        </PropertyCard>
        <PropertyCard type="string | null">
          <strong>Link URL</strong> — accepts <Code>&lbrace;&lbrace;tokens&rbrace;&rbrace;</Code>, substituted with
          template variables when the page is generated.
        </PropertyCard>
        <PropertyCard type="'_blank' | '_self'" default-value="_blank">
          <strong>Open in new tab</strong>
        </PropertyCard>
      </Section>

      <Section id="accessibility" title="Accessibility">
        <PropertyCard type="HTML tag" default-value="div">
          <strong>HTML tag</strong> — the element the container renders as. Choosing a
          meaningful tag gives screen-reader users landmarks to navigate by, rather than an
          undifferentiated pile of <Code>div</Code>s.
        </PropertyCard>
        <div class="mt-3 flex flex-wrap gap-1.5">
          <span
            v-for="t in HTML_TAGS"
            :key="t"
            class="rounded-md bg-slate-100 px-2 py-1 font-mono text-xs text-slate-600"
          >
            &lt;{{ t }}&gt;
          </span>
        </div>
        <PropertyCard type="string | null">
          <strong>Accessible label</strong> — names the landmark, e.g. "Primary navigation".
          Particularly worth setting when a page has more than one <Code>nav</Code> or
          <Code>aside</Code>, so they can be told apart.
        </PropertyCard>
        <BlockCallout variant="tip" title="Use one main per page">
          <Code>main</Code> should wrap the page's primary content and appear only once.
          <Code>header</Code>, <Code>footer</Code>, and <Code>nav</Code> can repeat, but each
          benefits from its own accessible label.
        </BlockCallout>
      </Section>

      <Section id="responsive" title="Per-device behaviour">
        <p>
          <strong>Width type</strong>, <strong>width</strong>, <strong>height</strong>, and
          <strong>horizontal alignment</strong> are per-device via <Code>*Tablet</Code> /
          <Code>*Mobile</Code> props. Border color, background size, background repeat, padding,
          margin, and overflow also differ per device.
        </p>
        <BlockCallout title="Not per-device">
          The background image and color, radius, the whole Link section, and the whole
          Accessibility section are shared across devices — the background upload and color
          picker only render on the Desktop tab.
        </BlockCallout>
      </Section>
    </article>
  </DocLayout>
</template>
