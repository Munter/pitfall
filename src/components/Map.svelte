<script lang="ts">
  import { onMount, tick } from "svelte";
  import { TILE_SIZE } from "../constants";
  import type {
    KingshotMap,
    TrapLayout,
    Coordinate,
    QualifiedItem,
    AllianceBuildingType,
  } from "../types/types";
  import { layoutToMapTiles } from "../util/layout";
  import { getTileData, getTilesBounds } from "../util/tileData";
  import MapTile from "./MapTile.svelte";
  import { detectCollisions } from "../util/collisions";
  import { cityStore } from "../stores/stores";

  const gridPadding = 4; // Padding around the grid

  type Props = {
    trapCoords?: Coordinate;
    trapLayout: TrapLayout;
    kingshotMap?: KingshotMap;
    zoom?: number; // Zoom level for the map
    placePreview?: AllianceBuildingType;
    onPlace?: (coord: Coordinate) => void;
    onRemove?: (coord: Coordinate) => void;
    isometric?: boolean;
    names?: string[];
  };

  let {
    trapCoords = [545, 476],
    trapLayout,
    kingshotMap = [],
    zoom = 100,
    placePreview,
    onPlace,
    onRemove,
    isometric = true,
    names = [],
  }: Props = $props();

  let tileSize = $derived(TILE_SIZE * (zoom / 100));

  const mapTiles = kingshotMap.map((t) => getTileData(t));
  let trapTiles = $derived(layoutToMapTiles(trapLayout, trapCoords));
  let allTiles = $derived([...trapTiles, ...mapTiles]);

  let mapBounds = $derived(getTilesBounds(allTiles, gridPadding));

  let coords: { x: number; y: number } | null = $state(null);
  let selectedTile: { x: number; y: number } | null = $state(null);

  let hoverElement = $derived(
    coords ? findTileAtCoords(coords, allTiles) : null
  );
  let selectedElement = $derived(
    selectedTile ? findTileAtCoords(selectedTile, trapTiles) : null
  );
  let previewTile = $derived(
    coords && placePreview
      ? getTileData(Object.assign({}, coords, { type: placePreview }))
      : null
  );
  let previewCollisions = $derived(detectCollisions(previewTile, trapTiles));
  let collisions = $derived([
    ...detectCollisions(trapTiles, mapTiles),
    ...previewCollisions,
  ]);

  function mouseEventToMapCoords(e: MouseEvent): { x: number; y: number } {
    const mapElement = e.currentTarget as HTMLElement;

    const bounds = mapElement.getBoundingClientRect();
    const x = e.clientX - bounds.left;
    const y = e.clientY - bounds.top;

    const gridX = Math.floor(x / tileSize) + mapBounds.minX;
    const gridY = mapBounds.maxY - Math.floor(y / tileSize) - 1;
    return { x: gridX, y: gridY };
  }

  function itemToOffset(item: { x: number; y: number }) {
    return {
      left: (item.x - mapBounds.minX) * tileSize,
      bottom: (item.y - mapBounds.minY) * tileSize,
    };
  }

  function findTileAtCoords(
    coords: {
      x: number;
      y: number;
    },
    tiles: QualifiedItem[]
  ): QualifiedItem | null {
    return (
      tiles.find(
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

  function handleMouseDown(e: MouseEvent) {
    const coords = mouseEventToMapCoords(e);
    if (placePreview) {
      if (previewCollisions.length === 0 && onPlace) {
        onPlace([coords.x, coords.y]);
      } else {
        const tile = findTileAtCoords(coords, trapTiles);

        if (tile && tile.type === placePreview && onRemove) {
          onRemove([coords.x, coords.y]);
        }
      }
    } else {
      selectedTile = coords;
    }
  }

  onMount(() => {
    tick().then(() => {
      // Ensure the map is scrolled to the trap container after mount
      document
        .querySelector(".trap-container")
        ?.querySelector("[title='Trap']")
        ?.scrollIntoView({ block: "center", inline: "center" });
    });
  });
  $effect(() => {
    isometric;
    // Ensure the map is scrolled to the trap container after mount
    document
      .querySelector(".trap-container")
      ?.querySelector("[title='Trap']")
      ?.scrollIntoView({ block: "center", inline: "center" });
  });
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
      style:transform={isometric ? "rotate(-45deg) skew(10deg, 10deg)" : "none"}
      style:--tile-size={tileSize + "px"}
      style:--min-x={mapBounds.minX}
      style:--min-y={mapBounds.minY}
      style:width={mapBounds.width * tileSize + 1 + "px"}
      style:height={mapBounds.height * tileSize + 1 + "px"}
      onmousemove={handleMouseMove}
      onmousedown={handleMouseDown}
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
      {:else if coords && !placePreview}
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
        <MapTile {...itemToOffset(item)} {item} {tileSize} {idx} {isometric} />
      {/each}

      {#if trapTiles.length > 0}
        <div class="trap-container">
          {#each trapTiles.filter((t) => t.type !== "city") as item, idx}
            <MapTile
              {...itemToOffset(item)}
              {item}
              {tileSize}
              {idx}
              {isometric}
            />
          {/each}
          {#each $cityStore as city, idx}
            <MapTile
              {...itemToOffset(city)}
              item={city}
              {tileSize}
              {idx}
              {isometric}
              name={names?.[idx]}
            />
          {/each}

          <div class="preview">
            {#if previewTile}
              <MapTile
                {...itemToOffset(previewTile)}
                item={previewTile}
                {tileSize}
                {isometric}
              />
            {/if}
          </div>
        </div>
      {/if}

      <div class="collisions">
        {#each collisions as coord}
          {@const { left, bottom } = itemToOffset({ x: coord[0], y: coord[1] })}
          <div
            class="highlight"
            style:--highlight-color="red"
            style:left={left + 1 + "px"}
            style:bottom={bottom + 1 + "px"}
            style:width={tileSize - 2 + "px"}
            style:height={tileSize - 2 + "px"}
          ></div>
        {/each}
      </div>
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
    display: grid;
  }

  .map {
    --grid-line-color: #cce;
    position: absolute;
    background-image:
      repeating-linear-gradient(
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

  .trap-container {
    opacity: 1;
  }

  .preview {
    opacity: 0.5;
  }

  .highlight {
    --color: var(--highlight-color, #9ecaed);
    pointer-events: none;
    position: absolute;
    z-index: 10;
    outline: none;
    border: 1px solid var(--color);
    box-shadow: 0 0 10px var(--color);
    pointer-events: none;
  }
</style>
