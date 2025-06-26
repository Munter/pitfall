<script lang="ts">
  import { TILE_SIZE } from "../constants";
  import type { KingshotMap } from "../types/grid";
  import { getTileData } from "../util/tileData";
  import MapTile from "./MapTile.svelte";

  const gridPadding = 4; // Padding around the grid

  export let kingshotMap: KingshotMap;
  export let zoom: number = 100; // Default zoom level

  $: tileSize = TILE_SIZE * (zoom / 100);

  const mapTiles = kingshotMap.map(getTileData);

  const minX = Math.max(
    Math.min(...mapTiles.map((item) => item.x - gridPadding)),
    0
  );
  const minY = Math.max(
    Math.min(...mapTiles.map((item) => item.y - gridPadding)),
    0
  );
  const maxX = Math.max(
    ...mapTiles.map((item) => item.x + item.dx + gridPadding)
  );
  const maxY = Math.max(
    ...mapTiles.map((item) => item.y + item.dy + gridPadding)
  );

  const width = maxX - minX;
  const height = maxY - minY;

  console.log({ minX, minY, maxX, maxY, width, height });

  let coords: { x: number; y: number } | null = null;
  let selectedTile: { x: number; y: number } | null = null;

  function mouseEventToMapCoords(e: MouseEvent): { x: number; y: number } {
    const mapElement = e.currentTarget as HTMLElement;
    const scrollContainer = mapElement.parentElement as HTMLElement;

    const bounds = mapElement.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    console.log({
      boundLeft: bounds.left,
      boundTop: bounds.top,
      scrollLeft: scrollContainer.scrollLeft,
      scrollTop: scrollContainer.scrollTop,
      clientX: e.clientX,
      clientY: e.clientY,
      x,
      y,
    });

    const gridX = Math.floor(x / tileSize) + minX;
    const gridY = maxY - Math.floor(y / tileSize) - 1;
    return { x: gridX, y: gridY };
  }

  function itemToOffset(item: { x: number; y: number; dy: number }) {
    // console.table([
    //   { x: item.x, y: item.y },
    //   { x: item.x - minX, y: item.y - minY },
    // ]);
    return {
      left: (item.x - minX) * tileSize,
      bottom: (item.y - minY) * tileSize,
    };
  }

  function handleMouseMove(e: MouseEvent) {
    coords = mouseEventToMapCoords(e);
  }

  function handleMouseClick(e: MouseEvent) {
    selectedTile = mouseEventToMapCoords(e);
  }
</script>

<div class="outer-container">
  <div class="coords">
    {#if coords}
      <span>x: {coords.x}</span>
      <span>y: {coords.y}</span>
    {/if}
  </div>

  <div class="selected-tile">
    {#if selectedTile}
      <span>Selected Tile: x: {selectedTile.x}</span>
      <span>y: {selectedTile.y}</span>
    {/if}
  </div>

  <div class="map-container">
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="map"
      style:--tile-size={tileSize + "px"}
      style:--min-x={minX}
      style:--min-y={minY}
      style:width={width * tileSize + 1 + "px"}
      style:height={height * tileSize + 1 + "px"}
      style:fontSize={tileSize + "px"}
      on:mousemove={handleMouseMove}
      on:click={handleMouseClick}
    >
      {#each mapTiles as item, idx}
        <MapTile
          {...itemToOffset(item)}
          {item}
          {tileSize}
          {idx}
          isometric={false}
        />
      {/each}
    </div>
  </div>
</div>

<style>
  .outer-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .coords {
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(255, 235, 255, 0.5);
    padding: 0.5rem;
    z-index: 10;
    font-size: 0.8rem;
    border-radius: 4px;
  }

  .selected-tile {
    right: 0;
    position: absolute;
    top: 0;
    background-color: rgba(255, 235, 255, 0.5);
    padding: 0.5rem;
    z-index: 10;
    font-size: 0.8rem;
    border-radius: 4px;
  }

  .map-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: scroll;
  }

  .map {
    --grid-line-color: #cce;
    position: absolute;
    background-image: repeating-linear-gradient(
        0deg,
        transparent,
        var(--grid-line-color) 1px,
        transparent 1px,
        transparent var(--tile-size)
      ),
      repeating-linear-gradient(
        90deg,
        transparent,
        var(--grid-line-color) 1px,
        transparent 1px,
        transparent var(--tile-size)
      );
    background-repeat: repeat;
  }
</style>
