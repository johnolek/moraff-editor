<script lang="ts">
  import { monsterKind, dungeonForLevel, killExperience, monsterTurnOdds } from '../../rev-bestiary/monsters';
  import { REV_POLLS_PER_TICK, REV_SPEED } from './clock';
  import { REV_ARMOUR_VALUE, REV_VALUE, REV_UNBANKED_EXPERIENCE_VALUE, revValue } from './record';
  import type { RevGame } from './state';
  import type { RevPlayView } from './engine';

  interface Props {
    game: RevGame;
    view: RevPlayView;
  }

  let { game, view }: Props = $props();

  /** Everything the game keeps and never prints, which is what debug mode is for. */
  const blocks = $derived.by(() => {
    void view;
    const pc = game.pc;
    const fight = game.fight;
    const rows: { title: string; lines: string[] }[] = [];
    rows.push({
      title: 'The character',
      lines: [
        `Strength ${pc.stats[0]}  Intelligence ${pc.stats[1]}  Wisdom ${pc.stats[2]}`,
        `Health ${pc.stats[3]}  Agility ${pc.stats[4]}  Laziness ${pc.stats[5]}`,
        `From strength ${pc.fromStrength}, from health ${pc.fromHealth}, from agility ${pc.fromAgility}`,
        `Armour ${revValue(pc, REV_ARMOUR_VALUE)}, sword +${revValue(pc, REV_VALUE.swordPlus)}, mace +${revValue(pc, REV_VALUE.macePlus)}`,
        `Unbanked experience ${revValue(pc, REV_UNBANKED_EXPERIENCE_VALUE)}`,
      ],
    });
    rows.push({
      title: 'The clock',
      lines: [
        `One pass in ${monsterTurnOdds(game.lastMonsterLevel, pc.level, REV_SPEED)} moves a monster`,
        `${REV_POLLS_PER_TICK} passes a tick, at the speed of the machine the game was written on`,
        `The clock reads the last monster met as level ${game.lastMonsterLevel}`,
        `Cursor at slot ${game.monsters.cursor}, awake ${game.monsters.awake1} and ${game.monsters.awake2}`,
      ],
    });
    if (fight) {
      const dungeon = dungeonForLevel(pc.dungeonLevel);
      rows.push({
        title: 'The monster',
        lines: [
          `Slot ${fight.slot}, name ${fight.name}, level ${fight.monsterLevel}`,
          `${fight.hitPoints} hit points left of ${game.monsters.strengths[fight.slot]} in the file`,
          `Kind ${monsterKind(fight.name, dungeon.number)}, ${fight.kindAdjust} to the number a swing beats`,
          `Worth ${killExperience(fight.monsterLevel, fight.kind)} experience`,
        ],
      });
    }
    rows.push({
      title: 'The square',
      lines: [
        `Feature code ${game.feature}`,
        game.chuteLanding
          ? `A chute last dropped you on ${game.chuteLanding.column}, ${game.chuteLanding.row} of level ${game.chuteLanding.level}`
          : 'No chute has dropped you anywhere yet',
      ],
    });
    return rows;
  });
</script>

<div class="panel">
  {#each blocks as block}
    <section>
      <h3>{block.title}</h3>
      {#each block.lines as line}<div class="line">{line}</div>{/each}
    </section>
  {/each}
</div>

<style>
  .panel {
    display: flex;
    flex-direction: column;
    gap: 12px;
    font-size: 12px;
    color: var(--muted);
  }
  h3 {
    margin: 0 0 4px;
    font-size: 12px;
    color: var(--accent);
    font-weight: 600;
  }
  .line {
    line-height: 1.5;
  }
</style>
