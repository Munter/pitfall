<script>
  import { TILE_SIZE } from "../constants";
  import Tile from "./Tile.svelte";

  const GRID_SIZE = 31;
  const gridPx = TILE_SIZE * GRID_SIZE;

  export let items = [];
  export let isometric = false;
  export let showCities = true;

  $: cities = items.filter((i) => i.type === "city");
  $: nonCities = items.filter((i) => i.type !== "city");
</script>

<div
  class="grid-container"
  style:width="{gridPx}px"
  style:height="{gridPx}px"
  style:transform={isometric ? "rotate(-45deg) skew(5deg, 5deg)" : "none"}
  class:showCities
>
  {#each nonCities as item}
    <Tile {item} {isometric} />
  {/each}

  <div class="cities-container">
    {#each cities as city, idx}
      <Tile class="city" item={city} idx={idx + 1} {isometric} />
    {/each}
  </div>

  <svg class="grid-lines" width={gridPx} height={gridPx}>
    {#each Array.from({ length: GRID_SIZE + 1 }) as _, i}
      <!-- Vertical lines -->
      <line
        x1={i * TILE_SIZE}
        y1="0"
        x2={i * TILE_SIZE}
        y2={gridPx}
        stroke="#8885"
        stroke-dasharray="2 4"
        stroke-width="1"
      />
      <!-- Horizontal lines -->
      <line
        x1="0"
        y1={i * TILE_SIZE}
        x2={gridPx}
        y2={i * TILE_SIZE}
        stroke="#8885"
        stroke-dasharray="2 4"
        stroke-width="1"
      />
    {/each}
  </svg>
</div>

<style>
  .grid-container {
    overflow: hidden;
    position: relative;
    transition: transform 0.3s ease-in-out;
  }
  .grid-lines {
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    z-index: 1;
  }
  .grid-container :global(:not(.grid-lines)) {
    position: absolute;
    z-index: 2;
  }

  .cities-container {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
  }
  .showCities .cities-container {
    opacity: 1;
  }
</style>
