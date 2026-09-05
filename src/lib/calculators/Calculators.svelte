<script lang="ts">
  import './calculators.css';
  import CombatCalculator from './CombatCalculator.svelte';
  import DropCalculator from './DropCalculator.svelte';
  import EconomyCalculator from './EconomyCalculator.svelte';
  import ExperiencePlanner from './ExperiencePlanner.svelte';
  import LevelUpCalculator from './LevelUpCalculator.svelte';

  type Chosen = 'experience' | 'drops' | 'economy' | 'levelup' | 'combat';

  const entries: { id: Chosen; label: string }[] = [
    { id: 'experience', label: 'Experience' },
    { id: 'drops', label: 'Drops' },
    { id: 'economy', label: 'Economy' },
    { id: 'levelup', label: 'Level-up' },
    { id: 'combat', label: 'Combat' },
  ];

  let chosen = $state<Chosen>('experience');
</script>

<div class="calculators">
  <nav>
    {#each entries as entry}
      <button type="button" class:selected={chosen === entry.id} onclick={() => (chosen = entry.id)}>{entry.label}</button>
    {/each}
  </nav>
  <!-- Every calculator stays mounted so its inputs survive switching between them. -->
  <div class="body" class:hidden={chosen !== 'experience'}>
    <ExperiencePlanner />
  </div>
  <div class="body" class:hidden={chosen !== 'drops'}>
    <DropCalculator />
  </div>
  <div class="body" class:hidden={chosen !== 'economy'}>
    <EconomyCalculator />
  </div>
  <div class="body" class:hidden={chosen !== 'levelup'}>
    <LevelUpCalculator />
  </div>
  <div class="body" class:hidden={chosen !== 'combat'}>
    <CombatCalculator />
  </div>
</div>

<style>
  .calculators {
    display: flex;
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
  nav {
    width: 180px;
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 16px 12px;
    border-right: 1px solid var(--line);
    background: var(--panel);
  }
  nav button {
    text-align: left;
    padding: 7px 10px;
    border: none;
    border-radius: 6px;
    background: none;
    font: inherit;
    font-size: 13px;
    color: var(--muted);
    cursor: pointer;
  }
  nav button:hover {
    color: var(--ink);
  }
  nav button.selected {
    color: var(--ink);
    background: var(--panel-2);
  }
  .body {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
  }
  .body.hidden {
    display: none;
  }
</style>
