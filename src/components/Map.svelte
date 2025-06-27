<script lang="ts">
  import { TILE_SIZE } from "../constants";
  import type {
    KingshotMap,
    QualifiedItem,
    MapTile as MapTileType,
  } from "../types/grid";
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

  $: hoverElement = coords ? findTileAtCoords(coords) : null;
  $: selectedElement = selectedTile ? findTileAtCoords(selectedTile) : null;

  function mouseEventToMapCoords(e: MouseEvent): { x: number; y: number } {
    const mapElement = e.currentTarget as HTMLElement;

    const bounds = mapElement.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const gridX = Math.floor(x / tileSize) + minX;
    const gridY = maxY - Math.floor(y / tileSize) - 1;
    return { x: gridX, y: gridY };
  }

  function itemToOffset(item: { x: number; y: number }) {
    return {
      left: (item.x - minX) * tileSize,
      bottom: (item.y - minY) * tileSize,
    };
  }

  function findTileAtCoords(coords: {
    x: number;
    y: number;
  }): QualifiedItem<MapTileType> | null {
    return (
      mapTiles.find(
        (item) =>
          item.x <= coords.x &&
          item.x + item.dx > coords.x &&
          item.y <= coords.y &&
          item.y + item.dy > coords.y
      ) || null
    );
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
      {#if hoverElement}
        {@const { left, bottom } = itemToOffset(hoverElement)}
        <div
          class="highlight"
          style:left={left + "px"}
          style:bottom={bottom + "px"}
          style:width={hoverElement.dx * tileSize - 2 + "px"}
          style:height={hoverElement.dy * tileSize - 2 + "px"}
        ></div>
      {:else if coords}
        {@const { left, bottom } = itemToOffset(coords)}
        <div
          class="highlight"
          style:left={left + "px"}
          style:bottom={bottom + "px"}
          style:width={tileSize - 2 + "px"}
          style:height={tileSize - 2 + "px"}
        ></div>
      {/if}

      {#if selectedElement}
        {@const { left, bottom } = itemToOffset(selectedElement)}
        <div
          class="highlight"
          style:--highlight-color="#7ca1b9"
          style:left={left + 1 + "px"}
          style:bottom={bottom + 1 + "px"}
          style:width={selectedElement.dx * tileSize - 4 + "px"}
          style:height={selectedElement.dy * tileSize - 4 + "px"}
        ></div>
      {/if}

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
}

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

  .highlight {
    --color: var(--highlight-color, #9ecaed);
    pointer-events: none;
    position: absolute;
    z-index: 10;
    outline: none;
    border: 1px solid var(--color);
    box-shadow: 0 0 10px var(--color);
  }
</style>
