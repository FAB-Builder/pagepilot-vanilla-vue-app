<script setup lang="ts">
import DocLayout from '../../../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import Section from '@/components/doc/Section.vue';
import Code from '@/components/doc/Code.vue';
import PropertyCard from '../../../components/PropertyCard.vue';
import BlockCallout from '../shared/BlockCallout.vue';
import { BLOCKS_SUBMODULES } from '../subModules';

const SECTIONS: DocSection[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'picking', label: 'Picking a banner' },
  { id: 'inline-vs-sdk', label: 'Inline vs SDK banners' },
  { id: 'spacing', label: 'Spacing' },
  { id: 'responsive', label: 'Per-device behaviour' },
];
</script>

<template>
  <DocLayout title="App Banner" :sections="SECTIONS" :sub-modules="BLOCKS_SUBMODULES" sub-modules-label="Blocks">
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">
          App Banner Block
        </h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          Places an announcement banner you've built in the App Banner module directly into a
          page's layout.
        </p>
      </header>

      <Section id="overview" title="Overview">
        <p>
          Banners are designed in the <strong>App Banner</strong> module — announcements,
          promotions, and notices. This block embeds one at a specific point in a page.
        </p>
        <p>
          You'll find it under <strong>Embeds/Integrations</strong> in the Add Block menu.
        </p>
      </Section>

      <Section id="picking" title="Picking a banner">
        <PropertyCard type="string">
          <strong>Banner</strong> — chosen from a dropdown of the banners in your workspace. The
          block stores the banner's id and name, plus a copy of its content document for
          rendering.
        </PropertyCard>
        <BlockCallout variant="tip" title="Design the banner first">
          The picker lists banners that already exist. Build yours in the App Banner module, then
          come back and select it here.
        </BlockCallout>
      </Section>

      <Section id="inline-vs-sdk" title="Inline vs SDK banners">
        <p>
          There are two ways to get a banner in front of visitors, and they suit different jobs:
        </p>
        <ul class="my-3 space-y-4 text-sm text-slate-600">
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">This block — inline, on one page</p>
            <p class="mt-1">
              The banner is part of the page's content, in the exact position you place it. It
              appears on that page only, and only for visitors who reach it. Good for a promotion
              that belongs to a specific landing page.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">The SDK — app-wide, by identifier</p>
            <p class="mt-1">
              <Code>renderAppBanner(identifier)</Code> injects a banner into your application at
              runtime — floating, modal, or carousel — across whatever pages you call it on.
              Good for site-wide notices. See the <strong>App Banner</strong> module for that
              approach.
            </p>
          </li>
        </ul>
        <BlockCallout variant="info" title="Same banners, two delivery routes">
          Both draw from the same set of banners. Choosing between them is about <em>where</em>
          the banner should appear, not about how it's designed.
        </BlockCallout>
      </Section>

      <Section id="spacing" title="Spacing">
        <PropertyCard type="per-side spacing">
          <strong>Padding</strong> — inside the block, around the banner.
        </PropertyCard>
        <PropertyCard type="per-side spacing">
          <strong>Margin</strong> — outside the block, separating it from surrounding content.
        </PropertyCard>
        <BlockCallout title="Appearance comes from the banner itself">
          Colors, typography, and layout are part of the banner's own design in the App Banner
          module. This block controls placement and spacing only — so one banner looks consistent
          everywhere it's used.
        </BlockCallout>
      </Section>

      <Section id="responsive" title="Per-device behaviour">
        <p>
          Padding and margin are stored on the block and can be adjusted to suit each device's
          layout.
        </p>
        <BlockCallout title="Not per-device">
          The selected banner is shared across devices — as is its design, which is governed by
          the banner itself rather than this block.
        </BlockCallout>
      </Section>
    </article>
  </DocLayout>
</template>
