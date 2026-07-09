<script setup lang="ts">
import DocLayout from '../../../components/DocLayout.vue';
import type { DocSection } from '@/types/doc';
import Section from '../../../components/doc/Section.vue';
import Code from '../../../components/doc/Code.vue';
import CodeSnippet from '../../../components/CodeSnippet.vue';
import { PAGES_SUBMODULES } from '../subModules';

const SECTIONS: DocSection[] = [
  { id: 'what-is-a-template', label: 'What is a template?' },
  { id: 'how-variables-work', label: 'How variables work' },
  { id: 'the-dialog', label: 'The template details dialog' },
  { id: 'step-basic', label: '1. Save a basic template' },
  { id: 'step-text-field', label: '2. Add a text variable' },
  { id: 'step-image-field', label: '3. Add an image variable' },
  { id: 'step-number-field', label: '4. Add a number variable' },
  { id: 'step-textarea-field', label: '5. Add a long-text variable' },
  { id: 'step-repeat', label: '6. Add repeatable blocks' },
  { id: 'repeatable-containers', label: '7. Repeat across a grid/columns' },
  { id: 'data-reference', label: '8. Data Reference (JSON / API / Menu)' },
  { id: 'default-values', label: '9. Default values' },
  { id: 'using-variables', label: '10. Filling in variables' },
  { id: 'auto-cleanup', label: '11. Variables & the canvas stay in sync' },
  { id: 'field-reference', label: 'Field type reference' },
  { id: 'tips', label: 'Tips & common questions' },
];

const CALLOUT_COLORS: Record<'info' | 'tip' | 'warning', string> = {
  info: 'border-blue-200 bg-blue-50 text-blue-900',
  tip: 'border-green-200 bg-green-50 text-green-900',
  warning: 'border-amber-200 bg-amber-50 text-amber-900',
};
</script>

<template>
  <DocLayout
    title="Templates & Variables"
    :sections="SECTIONS"
    :subModules="PAGES_SUBMODULES"
    subModulesLabel="Pages"
  >
    <article>
      <header class="mb-8 border-b border-slate-200 pb-6">
        <h1 class="mt-1 text-3xl font-bold" style="width: fit-content">
          Templates & Variables
        </h1>
        <p class="mt-3 text-lg leading-relaxed text-slate-600">
          Design a page once, save it as a <strong>template</strong>, and let anyone reuse it by
          simply filling in a few fields — like a form. No design skills needed every time.
          Variables make templates smart: swap text, numbers, images, or even add whole new blocks,
          all from one friendly panel.
        </p>
      </header>

      <Section id="what-is-a-template" title="What is a template?">
        <p>
          A template is a saved design that anyone can reuse. Think of it like a blank form — the
          layout and style are already done, and the user just fills in their own words and images.
        </p>
        <p>
          For example, you could build a <strong>"Hero Section"</strong> template once — with a
          headline, a subtitle, and a button. The next time someone needs a hero section they just
          apply your template and type their own words in the Variables panel. The design stays
          perfect; only the content changes.
        </p>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.tip}`">
          <p class="mb-1 font-semibold">Who is this for?</p>
          <div class="leading-relaxed">
            Templates are created by <strong>designers or admins</strong> who set up the layout.
            Everyone else on the team just fills in the blanks — no design work needed.
          </div>
        </div>
      </Section>

      <Section id="how-variables-work" title="How variables work">
        <p>Variables are placeholders you put inside your design. They look like this:</p>
        <div class="my-3">
          <CodeSnippet language="text" code="Hello, {{firstName}}!  →  Hello, Sarah!" />
        </div>
        <p>
          When someone applies the template and types <em>Sarah</em> into the <strong>First Name</strong>
          field in the Variables panel, every spot that says <Code>{{ '{' + '{firstName}' + '}' }}</Code> on the
          page updates instantly — no editing, no hunting through blocks.
        </p>
        <p>
          Variables work inside <strong>Text</strong>, <strong>Heading</strong>, and
          <strong>Button</strong> blocks. You can use the same variable in as many blocks as you
          like — they all update together.
        </p>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.warning}`">
          <p class="mb-1 font-semibold">Rich-text blocks don't support variables</p>
          <div class="leading-relaxed">
            HTML and MDX blocks don't work with <Code>{{ '{' + '{ }' + '}' }}</Code> tokens. Stick to Text,
            Heading, and Button blocks when you want variables to work.
          </div>
        </div>
      </Section>

      <Section id="the-dialog" title="The template details dialog">
        <p>
          When you save something as a template, the <strong>Set template details</strong> dialog
          opens. It has two tabs at the top:
        </p>

        <div class="my-4 overflow-hidden rounded-xl border border-slate-200">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-left">
              <tr>
                <th class="px-4 py-3 font-semibold text-ink">Tab</th>
                <th class="px-4 py-3 font-semibold text-ink">What you do here</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">Basic Info</td>
                <td class="px-4 py-3">
                  Give the template a <strong>name</strong> (required), description, category,
                  visibility, and a preview image so others can find it easily.
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">Template Fields</td>
                <td class="px-4 py-3">
                  Define the variables users will fill in. Click <strong>+ Add Field</strong>
                  (top-right) to add one. You can add as many as you need, or leave this tab
                  empty for a plain template with no variables at all.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <p class="font-semibold text-ink">Every field you add has four settings:</p>
        <ul class="my-3 space-y-3 text-sm text-slate-600">
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">
              ID <span class="font-normal text-red-500">*</span>
            </p>
            <p class="mt-1">
              This is the internal name that links the field to its
              <Code>{{ '{' + '{token}' + '}' }}</Code> in the design. It must be written in
              <strong>camelCase</strong> — start with a lowercase letter, no spaces, no hyphens.
            </p>
            <p class="mt-2 text-slate-500">
              Good news: you don't have to think about this. Just type naturally — the editor
              converts it for you. Typing <em>first name</em> automatically becomes
              <Code>firstName</Code>.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">
              Name <span class="font-normal text-red-500">*</span>
            </p>
            <p class="mt-1">
              The friendly label users see in the Variables panel — for example
              <em>First Name</em>, <em>Hero Image</em>, or <em>Product Price</em>. Make it
              descriptive so anyone knows exactly what to type.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Field Type</p>
            <p class="mt-1">
              Controls what kind of input the user gets: a short text box, a multi-line area, a
              number, an image picker, or a repeatable list. See the
              <a href="#field-reference" class="text-primary underline">field type reference</a>
              below.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Default value</p>
            <p class="mt-1">
              An optional starting value. When someone applies the template, this value is
              pre-filled in the Variables panel so they immediately see something real instead of
              a blank field. They can always change it. For Image fields, use the
              <strong>gallery icon</strong> to pick a default image from your media library
              instead of typing a URL.
            </p>
          </li>
        </ul>
      </Section>

      <Section id="step-basic" title="1. Save a basic template (no variables)">
        <p>
          The simplest template is just a saved design — same content every time, no fill-in
          fields. Good for layouts you reuse exactly as-is.
        </p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Build your design</span>
            <p class="mt-1 ml-4">In the Page Pilot editor, create the section or page you want to save.</p>
          </li>
          <li>
            <span class="font-semibold text-ink">2. Open the menu</span>
            <p class="mt-1 ml-4">
              Select the block or section, click the <Code>⋯</Code> (more) icon on it, and choose
              <strong>Save as template</strong>. The template details dialog opens.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">3. Fill in Basic Info</span>
            <p class="mt-1 ml-4">
              Give your template a name. Optionally add a description, category, and preview image
              so it's easy to find later. Leave the <strong>Template Fields</strong> tab untouched.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">4. Click Save</span>
            <p class="mt-1 ml-4">
              Your template appears in the <strong>Saved Templates</strong> panel, ready to drop
              onto any page.
            </p>
          </li>
        </ol>
      </Section>

      <Section id="step-text-field" title="2. Add a text variable">
        <p>
          A text variable is the most common kind — it lets the user type a short value (a name,
          a headline, a date, a price…) that replaces the token wherever it appears on the page.
        </p>

        <p class="font-semibold text-ink">Step A — Put the token in your design first</p>
        <p>
          Inside any <strong>Text</strong>, <strong>Heading</strong>, or <strong>Button</strong>
          block, type the variable token surrounded by double curly braces:
        </p>
        <div class="my-3">
          <CodeSnippet language="text" code="Welcome back, {{firstName}}!&#10;Your plan renews on {{renewalDate}}." />
        </div>
        <p>
          On the canvas you'll see a purple chip like <Code>✎ Add First Name</Code> instead of
          the raw token. This chip is just a visual placeholder — it disappears as soon as the
          user fills in the value.
        </p>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.tip}`">
          <div class="leading-relaxed">
            You can use the same token in multiple blocks — <Code>{{ '{' + '{firstName}' + '}' }}</Code> in the
            heading <em>and</em> in the body text — and both update the moment the user types.
          </div>
        </div>

        <p class="mt-4 font-semibold text-ink">Step B — Declare the field in the dialog</p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Save as template → Template Fields tab → + Add Field</span>
          </li>
          <li>
            <span class="font-semibold text-ink">2. Set the ID</span>
            <p class="mt-1 ml-4">
              Type <Code>firstName</Code> — must exactly match the token in your design (the part
              inside the curly braces). The editor enforces camelCase automatically.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">3. Set the Name</span>
            <p class="mt-1 ml-4">Type something human-readable like <em>First Name</em>. This is what users see.</p>
          </li>
          <li>
            <span class="font-semibold text-ink">4. Keep Type as "Text"</span>
            <p class="mt-1 ml-4">Text is the default — no change needed for a short single-line value.</p>
          </li>
          <li>
            <span class="font-semibold text-ink">5. Switch to Basic Info, give the template a name, and Save</span>
          </li>
        </ol>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.info}`">
          <p class="mb-1 font-semibold">What the user sees</p>
          <div class="leading-relaxed">
            A labelled text box called <em>First Name</em> in the Variables panel. Whatever they
            type instantly replaces every <Code>{{ '{' + '{firstName}' + '}' }}</Code> on the canvas.
          </div>
        </div>
      </Section>

      <Section id="step-image-field" title="3. Add an image variable">
        <p>
          An image variable lets the user swap an image — like a profile photo, product shot, or
          hero banner — without touching the design. The variable holds a URL that flows into any
          Image, Avatar, or Logo block.
        </p>

        <p class="font-semibold text-ink">Step A — Add the token to your image block</p>
        <p>
          Click the Image (or Avatar / Logo) block, go to its settings, and replace the image URL
          with a token:
        </p>
        <div class="my-3">
          <CodeSnippet language="text" code="{{heroImage}}" />
        </div>

        <p class="mt-4 font-semibold text-ink">Step B — Declare the field</p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Save as template → Template Fields tab → + Add Field</span>
          </li>
          <li>
            <span class="font-semibold text-ink">2. Set ID to the token name</span>
            <p class="mt-1 ml-4">For example <Code>heroImage</Code>.</p>
          </li>
          <li>
            <span class="font-semibold text-ink">3. Set a clear Name</span>
            <p class="mt-1 ml-4">For example <em>Hero Image</em>.</p>
          </li>
          <li>
            <span class="font-semibold text-ink">4. Change Type to "Image"</span>
            <p class="mt-1 ml-4">
              This gives users an input field <strong>plus</strong> a gallery browse button so they
              can pick from their media library with one click — no URL-typing needed.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">5. Optionally set a Default value</span>
            <p class="mt-1 ml-4">
              Click the <strong>gallery icon</strong> next to the default value field to pick a
              placeholder image. Users will see it pre-loaded when they apply the template.
            </p>
          </li>
          <li><span class="font-semibold text-ink">6. Save</span></li>
        </ol>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.info}`">
          <p class="mb-1 font-semibold">What the user sees</p>
          <div class="leading-relaxed">
            An image input with a small gallery icon button. They can paste a URL or click the icon
            to browse and select an image from the media library.
          </div>
        </div>
      </Section>

      <Section id="step-number-field" title="4. Add a number variable">
        <p>
          A number variable is perfect for prices, counts, ratings, or any numeric value you want
          the user to fill in.
        </p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Place the token in a Text or Heading block</span>
            <p class="mt-1 ml-4">For example: <Code>Only {{ '{' + '{price}' + '}' }} left in stock!</Code></p>
          </li>
          <li>
            <span class="font-semibold text-ink">2. In the Template Fields tab add a field with ID matching the token</span>
            <p class="mt-1 ml-4">For example <Code>price</Code>.</p>
          </li>
          <li>
            <span class="font-semibold text-ink">3. Set Type to "Number"</span>
            <p class="mt-1 ml-4">
              The user sees a number-friendly input. They can still type a token like
              <Code>{{ '{' + '{anotherVariable}' + '}' }}</Code> in the field if needed.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">4. Set a Default value if useful — for example 0 or 99</span>
          </li>
          <li><span class="font-semibold text-ink">5. Save</span></li>
        </ol>
      </Section>

      <Section id="step-textarea-field" title="5. Add a long-text variable">
        <p>
          Use a Text Area variable when the content could be a paragraph — a bio, a product
          description, a disclaimer, or any multi-line copy.
        </p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Place the token in a Text block</span>
            <p class="mt-1 ml-4">For example: <Code>{{ '{' + '{productDescription}' + '}' }}</Code></p>
          </li>
          <li>
            <span class="font-semibold text-ink">2. In the Template Fields tab add a field with a matching ID</span>
          </li>
          <li>
            <span class="font-semibold text-ink">3. Set Type to "Text Area"</span>
            <p class="mt-1 ml-4">
              Instead of a one-line input, users get a larger box where they can write multiple
              sentences or paste longer content.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">4. Optionally add a Default value — for example a sample paragraph</span>
          </li>
          <li><span class="font-semibold text-ink">5. Save</span></li>
        </ol>
      </Section>

      <Section id="step-repeat" title="6. Add repeatable blocks (Array)">
        <p>
          Sometimes you don't know in advance how many items the user will need. A repeatable
          block solves this — the user can add as many copies as they want from the Variables
          panel. Classic uses: FAQ lists, feature cards, team members, testimonials.
        </p>

        <p class="font-semibold text-ink">How it works in plain English</p>
        <p>
          You build <em>one</em> copy of the repeatable block in the editor and bind it to an
          Array field. When the user clicks <strong>Add Block</strong> in the Variables panel, a
          brand-new copy of that block appears on the page — fully independent, with its own
          inputs. Remove a copy and it disappears from the canvas and the Variables panel at the
          same time.
        </p>

        <p class="mt-5 font-semibold text-ink">Step A — Build one copy of the repeatable block</p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Create an outer container</span>
            <p class="mt-1 ml-4">
              This holds everything. The shared parts — like an "FAQs" heading — go directly inside
              this outer container.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">2. Add an inner container inside it</span>
            <p class="mt-1 ml-4">
              This inner container is the thing that will be cloned. Put the repeatable content
              (accordion, card, etc.) inside here.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">3. Use {{ '{' + '{this.}' + '}' }} tokens inside the inner container</span>
            <p class="mt-1 ml-4">
              The <Code>this.</Code> prefix tells Page Pilot "this value belongs to the current copy":
            </p>
          </li>
        </ol>
        <div class="my-3">
          <CodeSnippet
            language="text"
            code="Outer Container&#10;  ├─ Heading &quot;FAQs&quot;              ← appears once, never repeats&#10;  └─ Inner Container              ← this is the block that gets cloned&#10;       └─ Accordion item&#10;            ├─ Title:  {{this.question}}&#10;            └─ Body:   {{this.answer}}"
          />
        </div>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.warning}`">
          <p class="mb-1 font-semibold">Keep shared content in the outer container</p>
          <div class="leading-relaxed">
            If you put your heading inside the inner container, it will be duplicated with every
            added block. Shared content (headings, intros, footers) always goes in the outer
            container.
          </div>
        </div>

        <p class="mt-5 font-semibold text-ink">Step B — Declare the Array field</p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Save as template → Template Fields tab → + Add Field</span>
          </li>
          <li><span class="font-semibold text-ink">2. Set Type to "Array (repeatable)"</span></li>
          <li>
            <span class="font-semibold text-ink">3. Give it an ID and Name</span>
            <p class="mt-1 ml-4">For example ID <Code>faqs</Code>, Name <em>FAQs</em>.</p>
          </li>
          <li>
            <span class="font-semibold text-ink">4. In "Repeat which block?" choose the inner container</span>
            <p class="mt-1 ml-4">
              This is the block that gets cloned when the user clicks Add Block. Choose the
              <em>inner</em> one — not the outer wrapper.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">5. Add Row Fields — one per {{ '{' + '{this.}' + '}' }} token</span>
            <p class="mt-1 ml-4">
              Under <strong>ROW FIELDS</strong> click <strong>+ Add Row Field</strong>. Each row
              field maps to one <Code>this.</Code> token inside the repeatable block. Give each
              row field an ID (matching the token), a Name, a Type, and optionally a Default value.
            </p>
          </li>
        </ol>

        <div class="my-4 overflow-hidden rounded-xl border border-slate-200">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-left">
              <tr>
                <th class="px-4 py-2 font-semibold text-ink">Token in design</th>
                <th class="px-4 py-2 font-semibold text-ink">Row Field ID</th>
                <th class="px-4 py-2 font-semibold text-ink">Row Field Name</th>
                <th class="px-4 py-2 font-semibold text-ink">Type</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td class="px-4 py-2"><Code>{{ '{' + '{this.question}' + '}' }}</Code></td>
                <td class="px-4 py-2"><Code>question</Code></td>
                <td class="px-4 py-2">Question</td>
                <td class="px-4 py-2">Text</td>
              </tr>
              <tr>
                <td class="px-4 py-2"><Code>{{ '{' + '{this.answer}' + '}' }}</Code></td>
                <td class="px-4 py-2"><Code>answer</Code></td>
                <td class="px-4 py-2">Answer</td>
                <td class="px-4 py-2">Text Area</td>
              </tr>
            </tbody>
          </table>
        </div>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li><span class="font-semibold text-ink">6. Save</span></li>
        </ol>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.info}`">
          <p class="mb-1 font-semibold">What the user sees</p>
          <div class="leading-relaxed">
            A <em>FAQs</em> section in the Variables panel showing <strong>Block 1</strong> with a
            Question input and an Answer textarea. They click <strong>Add Block</strong> to get
            Block 2, Block 3, and so on. Each block is fully independent. Deleting a block removes
            it from the canvas and from the Variables panel at the same time.
          </div>
        </div>
      </Section>

      <Section id="repeatable-containers" title="7. Repeat a template across a grid or columns">
        <p>
          Section 6 showed how to repeat <em>one</em> block. But often you want a whole
          <strong>grid or column layout</strong> where every cell holds the same design — a 3×2
          grid of testimonial cards, a row of pricing columns, a gallery of feature tiles. Instead
          of building each cell by hand, you build one, then stamp it into all the empty cells.
        </p>
        <p>
          This works with three layout blocks: <strong>Grid</strong>,
          <strong>Flex Columns</strong>, and <strong>Columns Container</strong>. Selecting any of
          them automatically opens the <strong>Variables</strong> tab and shows a
          <strong>Repeatable</strong> section scoped to that block.
        </p>

        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Drop a Grid / Flex Columns / Columns Container on the canvas</span>
            <p class="mt-1 ml-4">
              Or click an existing one. The Variables tab opens with the Repeatable controls for
              that block.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">2. Turn Repeatable on</span>
            <p class="mt-1 ml-4">This reveals the template controls for the block.</p>
          </li>
          <li>
            <span class="font-semibold text-ink">3. Choose Template → pick a design for the first slot</span>
            <p class="mt-1 ml-4">
              The Section Gallery opens. The template you pick lands in the container's
              <strong>first empty slot</strong> (cell 1 / column 1). If that template has
              <Code>{{ '{' + '{this.}' + '}' }}</Code> tokens, they become editable rows just like a normal
              array field.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">4. Repeat ×N → fill the remaining empty slots</span>
            <p class="mt-1 ml-4">
              Choose how many copies (capped at the number of empty slots) and click
              <strong>Repeat</strong>. Page Pilot clones the first slot's design into the next empty
              slots. Each copy is fully independent — its own text, its own values.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">5. Style cell 1, then Sync Styles to Copies</span>
            <p class="mt-1 ml-4">
              Restyle the first cell however you like — colors, font size, bold. Then click
              <strong>Sync Styles to Copies</strong> and that styling is pushed to every copy
              <em>while keeping each copy's own text</em>.
            </p>
          </li>
        </ol>

        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.warning}`">
          <p class="mb-1 font-semibold">Repeat only fills empty slots</p>
          <div class="leading-relaxed">
            Repeat never grows the container on its own. If every cell is already full, add more
            cells or columns (in the Inspect tab) first, then Repeat again. When there are no empty
            slots the panel tells you.
          </div>
        </div>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.tip}`">
          <p class="mb-1 font-semibold">Sync carries styling only, never text</p>
          <div class="leading-relaxed">
            <strong>Sync Styles to Copies</strong> copies both the block styling (background,
            padding) <em>and</em> the token formatting (a color you applied to
            <Code>{{ '{' + '{this.description}' + '}' }}</Code> in cell 1). It never overwrites the words each
            copy contains — only how they look.
          </div>
        </div>
      </Section>

      <Section id="data-reference" title="8. Data Reference — fill copies from JSON, an API, or a Menu">
        <p>
          When a field is repeatable, you don't have to type every copy by hand. The
          <strong>Data Reference</strong> section (at the top of a repeatable field in the
          Variables panel) lets you choose <em>where the repeated copies get their data</em>. Pick
          a source once and Page Pilot creates one copy per item, mapping each item's keys onto
          your row sub-fields.
        </p>

        <div class="my-4 overflow-hidden rounded-xl border border-slate-200">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-left">
              <tr>
                <th class="px-4 py-3 font-semibold text-ink">Source</th>
                <th class="px-4 py-3 font-semibold text-ink">What it does</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">Custom (edit each copy)</td>
                <td class="px-4 py-3">
                  The default. You add and fill each copy manually — the same repeatable rows from
                  section 6. Best when the content is one-off and won't change.
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">Custom JSON</td>
                <td class="px-4 py-3">
                  Paste a JSON <strong>array of objects</strong>. Each object becomes one copy;
                  its keys map to your sub-field IDs. Great for a fixed list you already have as
                  data.
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">API</td>
                <td class="px-4 py-3">
                  Enter an endpoint URL (GET). Page Pilot fetches it, pulls the array of objects
                  out of the response, and creates one copy per object.
                </td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">Through Menu</td>
                <td class="px-4 py-3">
                  Pick one of your Menus. Each menu item becomes one copy — item keys (name,
                  description, image, link) map to your sub-fields.
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.tip}`">
          <p class="mb-1 font-semibold">The one rule all data sources share</p>
          <div class="leading-relaxed">
            JSON, API, and Menu all need the same shape: an <strong>array of objects</strong> whose
            keys match your field's row sub-field IDs. Click <strong>View reference</strong> in the
            Data Reference header to see an example built from <em>your</em> exact sub-fields — copy
            it as a starting point.
          </div>
        </div>

        <p class="mt-5 font-semibold text-ink">Custom JSON, step by step</p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Set up a repeatable field with row sub-fields</span>
            <p class="mt-1 ml-4">
              For example a testimonials field with sub-fields <Code>name</Code> and
              <Code>rating</Code> (see section 6).
            </p>
          </li>
          <li><span class="font-semibold text-ink">2. Set Data Reference source to Custom JSON</span></li>
          <li>
            <span class="font-semibold text-ink">3. Paste an array of objects keyed by your sub-field IDs</span>
            <p class="mt-1 ml-4">For example:</p>
          </li>
        </ol>
        <div class="my-3">
          <CodeSnippet
            language="json"
            code="[&#10;  { &quot;name&quot;: &quot;Ajay&quot;, &quot;rating&quot;: &quot;5&quot; },&#10;  { &quot;name&quot;: &quot;Ishaan&quot;, &quot;rating&quot;: &quot;4&quot; }&#10;]"
          />
        </div>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">4. Click Apply JSON & Repeat</span>
            <p class="mt-1 ml-4">Two copies are created — one per object — with their fields already filled in.</p>
          </li>
        </ol>

        <p class="mt-5 font-semibold text-ink">API, step by step</p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li><span class="font-semibold text-ink">1. Set Data Reference source to API</span></li>
          <li>
            <span class="font-semibold text-ink">2. Enter the endpoint URL</span>
            <p class="mt-1 ml-4">
              Method is <strong>GET</strong> (POST is coming soon). The endpoint should return a
              JSON array of objects — or an object wrapping the array under a common key like
              <Code>data</Code>, <Code>rows</Code>, <Code>results</Code>, <Code>items</Code>, or
              <Code>records</Code>.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">3. Click Preview to inspect the raw response first</span>
            <p class="mt-1 ml-4">
              This shows exactly what the endpoint returns so you can confirm the shape and fix your
              URL or keys before applying.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">4. Click Fetch & Apply</span>
            <p class="mt-1 ml-4">
              Page Pilot fetches the data and creates one copy per object. The endpoint is saved
              with the page, so reopening keeps the binding.
            </p>
          </li>
        </ol>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.warning}`">
          <p class="mb-1 font-semibold">API notes</p>
          <div class="leading-relaxed">
            The endpoint must be reachable from the browser and allow
            <strong>CORS</strong>. If the response has no array of objects to map, Page Pilot tells
            you — use <strong>Preview</strong> to see what came back.
          </div>
        </div>

        <p class="mt-5 font-semibold text-ink">Through Menu, step by step</p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Create a menu in the Menu module first</span>
            <p class="mt-1 ml-4">The dropdown lists your existing menus. If there are none, it tells you to create one.</p>
          </li>
          <li><span class="font-semibold text-ink">2. Set Data Reference source to Through Menu, then pick a menu</span></li>
          <li>
            <span class="font-semibold text-ink">3. Click Apply Menu & Repeat</span>
            <p class="mt-1 ml-4">
              Each menu item becomes one copy. Item keys (name, description, image, link) map onto
              your matching sub-fields.
            </p>
          </li>
        </ol>

        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.info}`">
          <p class="mb-1 font-semibold">When there aren't enough cells</p>
          <div class="leading-relaxed">
            If your data has more items than the grid has cells, Page Pilot asks how to grow it —
            <strong>Add rows</strong> or <strong>Add columns</strong> — then seeds every item.
            Single-axis layouts (Flex Columns / Columns Container) grow automatically to fit.
          </div>
        </div>
      </Section>

      <Section id="default-values" title="9. Default values — pre-fill for a better start">
        <p>
          Every field (and every row sub-field) can have a <strong>default value</strong>. When
          someone applies the template, all defaults are automatically filled in — so the page
          looks great from the moment it's applied, not blank and empty.
        </p>
        <ul class="my-4 space-y-3 text-sm text-slate-600">
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Text, Text Area, Number</p>
            <p class="mt-1">
              Type the default directly in the <strong>Default value</strong> field on the field
              card. Example: default for a <em>Company Name</em> field could be
              <em>Acme Inc.</em>
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Image</p>
            <p class="mt-1">
              Click the <strong>gallery icon</strong> <span class="text-primary">🖼</span>
              next to the default value field to open your media library and pick a placeholder
              image. Or paste a URL directly.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Array row sub-fields</p>
            <p class="mt-1">
              Set a default value on any row sub-field and Block 1 will be pre-filled with that
              content when the template is applied — so the very first item already has example
              content to guide the user.
            </p>
          </li>
        </ul>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.tip}`">
          <p class="mb-1 font-semibold">Defaults only fill empty values</p>
          <div class="leading-relaxed">
            If a user has already filled in a field and saves the page, reopening the page later
            will never overwrite their work. Defaults only apply when the field is completely empty
            — typically right after a template is first applied.
          </div>
        </div>
      </Section>

      <Section id="using-variables" title="10. Filling in variables (the user's side)">
        <p>Once a template is applied, filling in variables is simple. Here's what a user does:</p>
        <ol class="my-4 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
          <li>
            <span class="font-semibold text-ink">1. Apply the template</span>
            <p class="mt-1 ml-4">
              Open the <strong>Saved Templates</strong> panel in the editor sidebar. Find the
              template and click it. Choose <strong>Choose design</strong> to replace the whole
              page, or <strong>Add this section</strong> to add it below what's already there.
              Page Pilot automatically switches to the <strong>Variables</strong> tab — no hunting
              around.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">2. Fill in the fields</span>
            <p class="mt-1 ml-4">
              Each variable appears as a labelled input. Just type — the canvas updates live as you
              go. No save button, no refresh. For image fields, click the gallery icon to browse
              and pick from your media library.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">3. For repeatable blocks — add as many as needed</span>
            <p class="mt-1 ml-4">
              Find the array field (e.g. <em>FAQs</em>) in the Variables panel. Block 1 is already
              there — fill in its fields. Click <strong>Add Block</strong> for each additional item.
              To remove a block, click the trash icon on that block's row.
            </p>
          </li>
          <li>
            <span class="font-semibold text-ink">4. Publish</span>
            <p class="mt-1 ml-4">
              When you're happy with the content, publish the page. The filled-in values are baked
              into the published version. The draft copy keeps all your field values so you can come
              back and edit them anytime.
            </p>
          </li>
        </ol>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.tip}`">
          <p class="mb-1 font-semibold">Click a chip to jump to its field</p>
          <div class="leading-relaxed">
            On the canvas, unfilled variables show as coloured chips (purple for text, teal for
            arrays). Clicking a chip takes you directly to that field in the Variables panel — no
            scrolling needed.
          </div>
        </div>
      </Section>

      <Section id="auto-cleanup" title="11. Variables & the canvas stay in sync automatically">
        <p>
          Page Pilot keeps the Variables panel and the canvas in sync at all times — you don't
          need to manage this manually.
        </p>
        <ul class="my-4 space-y-3 text-sm text-slate-600">
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Delete a block → its variable disappears too</p>
            <p class="mt-1">
              If you delete a block that contained a <Code>{{ '{' + '{token}' + '}' }}</Code>, the
              corresponding field is automatically removed from the Variables panel. You won't be
              left with orphaned fields for blocks that no longer exist.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Remove a repeatable block copy → that row disappears too</p>
            <p class="mt-1">
              Deleting a cloned block from the canvas removes its row from the Variables panel at
              the same time. Block numbers re-adjust automatically.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Save and reopen → everything is exactly as you left it</p>
            <p class="mt-1">
              Field values are saved with the page. When you reopen, every field shows the last
              value you entered — nothing is lost, nothing is reset.
            </p>
          </li>
        </ul>
      </Section>

      <Section id="field-reference" title="Field type reference">
        <div class="overflow-hidden rounded-xl border border-slate-200">
          <table class="w-full text-sm">
            <thead class="bg-slate-50 text-left">
              <tr>
                <th class="px-4 py-3 font-semibold text-ink">Type</th>
                <th class="px-4 py-3 font-semibold text-ink">Best for</th>
                <th class="px-4 py-3 font-semibold text-ink">Token syntax</th>
                <th class="px-4 py-3 font-semibold text-ink">Input shown to user</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200 text-slate-600">
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">Text</td>
                <td class="px-4 py-3">Names, headlines, short labels, dates</td>
                <td class="px-4 py-3"><Code>{{ '{' + '{id}' + '}' }}</Code></td>
                <td class="px-4 py-3">Single-line text input</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">Text Area</td>
                <td class="px-4 py-3">Descriptions, bios, multi-sentence copy</td>
                <td class="px-4 py-3"><Code>{{ '{' + '{id}' + '}' }}</Code></td>
                <td class="px-4 py-3">Multi-line text box</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">Number</td>
                <td class="px-4 py-3">Prices, counts, ratings, quantities</td>
                <td class="px-4 py-3"><Code>{{ '{' + '{id}' + '}' }}</Code></td>
                <td class="px-4 py-3">Number-friendly input</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">Image</td>
                <td class="px-4 py-3">Photos, logos, avatars, banners</td>
                <td class="px-4 py-3"><Code>{{ '{' + '{id}' + '}' }}</Code></td>
                <td class="px-4 py-3">URL input + gallery browse button 🖼</td>
              </tr>
              <tr>
                <td class="px-4 py-3 font-semibold text-ink">Array (repeatable)</td>
                <td class="px-4 py-3">FAQs, features, team members, testimonials</td>
                <td class="px-4 py-3">
                  <Code>{{ '{' + '{this.subField}' + '}' }}</Code> inside the bound container
                </td>
                <td class="px-4 py-3">
                  Repeatable block rows — Add Block / Remove Block. Sub-fields support all types
                  above. Copies can also be filled from
                  <a href="#data-reference" class="text-primary underline">Custom JSON, an API, or a Menu</a>.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div :class="`my-4 rounded-xl border p-4 text-sm ${CALLOUT_COLORS.info}`">
          <p class="mb-1 font-semibold">ID rules</p>
          <div class="leading-relaxed">
            The ID must start with a lowercase letter and use only letters, digits, and underscores
            — no spaces or hyphens. This is called <strong>camelCase</strong>. The editor converts
            automatically: type <em>hero image</em> → becomes <Code>heroImage</Code>.
          </div>
        </div>
      </Section>

      <Section id="tips" title="Tips & common questions">
        <ul class="space-y-4 text-sm text-slate-600">
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Can I use the same token in multiple blocks?</p>
            <p class="mt-1">
              Yes. Use <Code>{{ '{' + '{firstName}' + '}' }}</Code> in a heading, in a paragraph, and in a
              button — all three update the moment the user types a single value.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">
              What's the difference between <Code>{{ '{' + '{name}' + '}' }}</Code> and <Code>{{ '{' + '{this.name}' + '}' }}</Code>?
            </p>
            <p class="mt-1">
              <Code>{{ '{' + '{name}' + '}' }}</Code> is a top-level variable — one value for the whole page.
              <Code>{{ '{' + '{this.name}' + '}' }}</Code> is a <em>per-copy</em> variable — each repeated
              block has its own independent value. Only use <Code>this.</Code> inside a block
              that is bound to an Array (repeatable) field.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">My heading duplicates every time I add a block</p>
            <p class="mt-1">
              The heading is inside the inner (repeatable) container. Move it to the outer
              container so it only appears once. In the <strong>Repeat which block?</strong>
              dropdown, make sure you've selected the inner container — not the outer one.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">The token shows as raw text on the canvas</p>
            <p class="mt-1">
              This means the field ID in the Template Fields tab doesn't match the token in your
              design. Check that the ID is identical — including uppercase letters. For example,
              a token <Code>{{ '{' + '{productName}' + '}' }}</Code> needs a field with ID exactly
              <Code>productName</Code>, not <Code>productname</Code>.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Can I add more fields to a template after saving it?</p>
            <p class="mt-1">
              Yes. Open the template from the Saved Templates panel, choose
              <strong>Edit</strong>, go to the <strong>Template Fields</strong> tab, add your new
              fields, and save again. Pages that already used the template won't be affected
              until they re-apply it.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Will re-opening a saved page reset my field values?</p>
            <p class="mt-1">
              No. Field values are saved with the page. When you reopen, every field shows exactly
              what you typed before. Default values only fill <em>empty</em> fields — they never
              overwrite content you've already entered.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">Tokens in rich-text blocks don't work</p>
            <p class="mt-1">
              HTML and MDX blocks don't support <Code>{{ '{' + '{ }' + '}' }}</Code> tokens by design. If you
              need a variable, switch to a plain <strong>Text</strong> or <strong>Heading</strong>
              block instead.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">My data has more items than the grid has cells</p>
            <p class="mt-1">
              When a JSON / API / Menu source returns more items than the grid can hold, Page
              Pilot asks whether to grow the grid by <strong>rows</strong> or
              <strong>columns</strong>, then fits every item. Flex Columns and Columns Container
              grow automatically. See
              <a href="#data-reference" class="text-primary underline">Data Reference</a>.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">My API URL doesn't apply — nothing happens</p>
            <p class="mt-1">
              The endpoint must return an <strong>array of objects</strong> (or an object wrapping
              one under <Code>data</Code> / <Code>rows</Code> / <Code>results</Code> /
              <Code>items</Code> / <Code>records</Code>), be reachable from the browser, and allow
              <strong>CORS</strong>. Use the <strong>Preview</strong> button to see the raw
              response and confirm its shape.
            </p>
          </li>
          <li class="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p class="font-semibold text-ink">My copies look different after repeating a grid</p>
            <p class="mt-1">
              Style the first cell the way you want, then click
              <strong>Sync Styles to Copies</strong>. It pushes both block styling and token
              formatting to every copy without changing each copy's own text. See
              <a href="#repeatable-containers" class="text-primary underline">Repeat across a grid or columns</a>.
            </p>
          </li>
        </ul>
      </Section>
    </article>
  </DocLayout>
</template>
