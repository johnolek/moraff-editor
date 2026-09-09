<!--
  The card all three games draw for the monster picked out of the list: the picture beside the
  name, the table of the monster's own numbers and the list of what it does to you. Everything
  under that is the game's own, and comes in as a snippet.
-->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import PixelText from '../ui/PixelText.svelte';
  import SectionHeading from '../ui/SectionHeading.svelte';
  import './monster-card.css';

  interface Props {
    /** The monster's name, drawn in the game's own font. */
    name: string;
    /** The line under the name: the list group it is under, and whatever else names it. */
    groupLine: string;
    /** What the game calls the table of the monster's own numbers. */
    numbersTitle: string;
    /** The rows of that table, each a label and the value beside it. */
    numbers: readonly (readonly string[])[];
    /** What the monster does to you beyond an ordinary hit, called out under the table. */
    effects?: readonly string[];
    /** The picture, and whatever belongs beside it. */
    art: Snippet;
    /** Sections of the facts column above the numbers, for DotU's type quote. */
    aboveNumbers?: Snippet;
    /** A line under the numbers table, above the effects. */
    tableNote?: Snippet;
    /** A line under the effects. */
    effectsNote?: Snippet;
    /** The rest of the card: where the monster turns up, and the game's own workings. */
    body: Snippet;
  }

  let {
    name,
    groupLine,
    numbersTitle,
    numbers,
    effects = [],
    art,
    aboveNumbers,
    tableNote,
    effectsNote,
    body,
  }: Props = $props();
</script>

<article class="monster-card">
  <div class="top">
    <div class="art">
      {@render art()}
    </div>
    <div class="facts">
      <h2 class="name"><PixelText text={name} scale={2} /></h2>
      <p class="group">{groupLine}</p>

      {@render aboveNumbers?.()}

      <section>
        <SectionHeading title={numbersTitle} />
        <dl>
          {#each numbers as [label, value]}
            <dt>{label}</dt>
            <dd>{value}</dd>
          {/each}
        </dl>
        {@render tableNote?.()}
        {#if effects.length > 0}
          <ul class="effects">
            {#each effects as effect}
              <li>{effect}</li>
            {/each}
          </ul>
        {/if}
        {@render effectsNote?.()}
      </section>
    </div>
  </div>

  {@render body()}
</article>
