<script lang="ts">
  import type { SquareDescription } from './describe';

  let { description }: { description: SquareDescription | null } = $props();
</script>

<section>
  {#if description}
    <h2>{description.title}</h2>
    {#if description.rock}
      <p class="feature">Rock</p>
    {:else}
      <dl>
        {#each description.sides as [direction, text]}
          <dt>{direction}</dt>
          <dd>{text}</dd>
        {/each}
      </dl>
      {#if description.feature}
        <p class="feature">{description.feature}</p>
      {/if}
    {/if}
  {:else}
    <p class="hint">Point at a square to inspect it.</p>
  {/if}
</section>

<style>
  section {
    min-height: 150px;
  }
  h2 {
    margin: 0 0 8px;
    font-size: 13px;
    color: var(--accent);
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2px 12px;
    margin: 0;
    font-size: 13px;
  }
  dt {
    color: var(--muted);
  }
  dd {
    margin: 0;
  }
  .feature {
    margin: 10px 0 0;
    font-size: 13px;
    color: var(--accent);
  }
  .hint {
    margin: 0;
    font-size: 13px;
    color: var(--muted);
  }
</style>
