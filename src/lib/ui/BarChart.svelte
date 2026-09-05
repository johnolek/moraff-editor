<script lang="ts">
  import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    LinearScale,
    Tooltip,
    type ChartConfiguration,
  } from 'chart.js';

  // Only the pieces a plain bar chart draws, so the single-file build stays small.
  Chart.register(BarController, BarElement, CategoryScale, LinearScale, Tooltip);

  interface Props {
    labels: string[];
    /** One percentage per label. */
    values: number[];
    tooltip: (index: number) => string;
    xLabel?: string;
  }

  let { labels, values, tooltip, xLabel }: Props = $props();

  let canvas: HTMLCanvasElement;
  // Chart.js owns the canvas itself, so this is deliberately outside Svelte's reactivity.
  let chart: Chart | undefined;

  const token = (name: string) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

  function configuration(): ChartConfiguration<'bar'> {
    const ink = token('--muted');
    const line = token('--line');
    return {
      type: 'bar',
      data: { labels, datasets: [{ data: values, backgroundColor: token('--accent'), borderWidth: 0 }] },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        animation: false,
        plugins: {
          tooltip: { displayColors: false, callbacks: { title: () => '', label: (item) => tooltip(item.dataIndex) } },
        },
        scales: {
          x: {
            title: { display: Boolean(xLabel), text: xLabel ?? '', color: ink },
            grid: { display: false },
            border: { color: line },
            ticks: { color: ink, maxRotation: 0, autoSkipPadding: 10 },
          },
          y: {
            beginAtZero: true,
            grid: { color: line },
            border: { color: line },
            ticks: { color: ink, callback: (value) => `${value}%` },
          },
        },
      },
    };
  }

  $effect(() => {
    const next = configuration();
    if (!chart) {
      chart = new Chart(canvas, next);
      return;
    }
    chart.data = next.data;
    chart.options = next.options!;
    chart.update();
  });

  // A chart built while its tab is hidden ends up with a zero-sized canvas, and Chart.js
  // does not measure the container again by itself once the tab is shown.
  $effect(() => {
    const watcher = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) chart?.resize();
    });
    watcher.observe(canvas);
    return () => watcher.disconnect();
  });

  $effect(() => () => {
    chart?.destroy();
    chart = undefined;
  });
</script>

<div class="chart">
  <canvas bind:this={canvas}></canvas>
</div>

<style>
  .chart {
    position: relative;
    width: 100%;
    max-width: 640px;
    height: 200px;
  }
</style>
