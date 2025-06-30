<script lang="ts">
  import EditorForm from "./EditorForm.svelte";
  import type { EditorFormProps } from "../types/form";
  import Map from "./Map.svelte";

  import { kingdom129 } from "../maps/kingdom-129";
  import { orthogonalPrio } from "../trapLayouts/orthoginal-prio";
  import { flipX, flipY, rotateLeft, rotateRight } from "../util/layout";
  import type {
    AllianceBuildingType,
    Coordinate,
    TrapLayout,
  } from "../types/types";
  import { wheel } from "../trapLayouts/wheel";

  const cleanTrapLayout: TrapLayout = {
    cities: [],
    banners: [],
  };

  let editorValue: EditorFormProps = $state({
    isEditing: true,
    showCities: true,
    zoom: 200,
  });

  let trapLayout = $state(wheel);
  let bearX = $state(wheel.trap?.[0] ?? 0);
  let bearY = $state(wheel.trap?.[1] ?? 0);
  let trapCoords = $derived<Coordinate>([bearX, bearY]);
  let editType = $state<AllianceBuildingType | undefined>(undefined);

  function rotate(direction: "left" | "right") {
    if (direction === "left") {
      trapLayout = rotateLeft(trapLayout);
    } else {
      trapLayout = rotateRight(trapLayout);
    }
  }

  $effect(() => {
    // console.log(JSON.stringify(trapLayout));
  });

  function flip(axis: "horizontal" | "vertical") {
    if (axis === "horizontal") {
      trapLayout = flipX(trapLayout);
    } else if (axis === "vertical") {
      trapLayout = flipY(trapLayout);
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    switch (e.key) {
      case "b":
        editType = "banner";
        break;
      case "c":
        editType = "city";
        break;
      case "h":
        editType = "headquarter";
        break;
      case "Escape":
        editType = undefined;
        break;
    }
  }

  function handleTilePlacement(coord: Coordinate) {
    if (editType) {
      switch (editType) {
        case "city":
          trapLayout = { ...trapLayout, cities: [...trapLayout.cities, coord] };
          break;
        case "headquarter":
          trapLayout = { ...trapLayout, headquarter: coord };
          break;
        case "banner":
          trapLayout = {
            ...trapLayout,
            banners: [...trapLayout.banners, coord],
          };
          break;
        case "trap":
          trapLayout = { ...trapLayout };
          break;
      }
    }
  }

  function isSameCoord(a: Coordinate, b: Coordinate): boolean {
    return a[0] === b[0] && a[1] === b[1];
  }

  function handleTileRemoval(coord: Coordinate) {
    if (editType) {
      switch (editType) {
        case "city":
          trapLayout = {
            ...trapLayout,
            cities: trapLayout.cities.filter((c) => !isSameCoord(c, coord)),
          };
          break;
        case "headquarter":
          trapLayout = { ...trapLayout, headquarter: undefined };
          break;
        case "banner":
          trapLayout = {
            ...trapLayout,
            banners: trapLayout.banners.filter((b) => !isSameCoord(b, coord)),
          };
          break;
        case "trap":
          trapLayout = { ...trapLayout };
          break;
      }
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="grid-edit">
  <aside>
    <h3>Controls</h3>
    <EditorForm
      values={editorValue}
      onChange={(val) => {
        editorValue = val;
      }}
    />

    <label>Trap X<input type="number" bind:value={bearX} /></label>
    <label>Trap Y<input type="number" bind:value={bearY} /></label>

    <button onclick={() => (trapLayout = orthogonalPrio)}>
      Reset Trap Layout
    </button>
    <button onclick={() => rotate("left")}> Rotate left </button>
    <button onclick={() => rotate("right")}> Rotate right </button>
    <button onclick={() => flip("horizontal")}> Flip X</button>
    <button onclick={() => flip("vertical")}> Flip Y</button>

    <fieldset>
      <label
        ><input
          type="radio"
          name="type"
          value="headquarter"
          bind:group={editType}
        />HQ</label
      >
      <label
        ><input
          type="radio"
          name="type"
          value="banner"
          bind:group={editType}
        />Banner</label
      >
      <label
        ><input
          type="radio"
          name="type"
          value="city"
          bind:group={editType}
        />City</label
      >
    </fieldset>

    <hr />

    <button onclick={() => (trapLayout = cleanTrapLayout)}>Clear</button>
    <button
      onclick={() => navigator.clipboard.writeText(JSON.stringify(trapLayout))}
      >Copy</button
    >
  </aside>

  <div class="grid-container">
    <Map
      kingshotMap={kingdom129}
      {trapLayout}
      {trapCoords}
      zoom={editorValue.zoom}
      placePreview={editType}
      onPlace={handleTilePlacement}
      onRemove={handleTileRemoval}
    />
  </div>
</div>

<style>
  .grid-edit {
    display: grid;
    height: 100%;
    grid-template-areas: "aside grid";
    grid-template-columns: 300px auto;
  }
  aside {
    grid-area: aside;
    background-color: #f0f0f0;
    padding: 1rem;
    border-radius: 8px;
  }

  .grid-container {
    grid-area: grid;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
