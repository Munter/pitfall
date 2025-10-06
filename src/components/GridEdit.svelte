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
  import { layoutStore } from "../stores/stores";

  const cleanTrapLayout: TrapLayout = {
    cities: [],
    banners: [],
  };

  let editorValue: EditorFormProps = $state({
    isometric: false,
    showCities: true,
    zoom: 200,
  });

  let bearX = $state($layoutStore.trap?.[0] ?? 0);
  let bearY = $state($layoutStore.trap?.[1] ?? 0);
  let trapCoords = $derived<Coordinate>([bearX, bearY]);
  let editType = $state<AllianceBuildingType | undefined>(undefined);
  let namesInput = $state("");
  let names = $derived(
    namesInput
      .trim()
      .split(/\n+/)
      .map((n) => n.trim())
      .filter(Boolean)
  );

  function rotate(direction: "left" | "right") {
    if (direction === "left") {
      layoutStore.set(rotateLeft($layoutStore));
    } else {
      layoutStore.set(rotateRight($layoutStore));
    }
  }

  $effect(() => {
    if (
      bearX !== ($layoutStore.trap?.[0] ?? 0) ||
      bearY !== ($layoutStore.trap?.[1] ?? 0)
    ) {
      layoutStore.set({
        ...$layoutStore,
        trap: [bearX, bearY],
      });
    }
  });

  $effect(() => {
    const location = new URL(window.location.href);
    location.searchParams.set("layout", JSON.stringify($layoutStore));
    window.history.replaceState({}, "", location.href);
  });

  function flip(axis: "horizontal" | "vertical") {
    if (axis === "horizontal") {
      layoutStore.set(flipX($layoutStore));
    } else if (axis === "vertical") {
      layoutStore.set(flipY($layoutStore));
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
      case "t":
        editType = "trap2";
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
          layoutStore.set({
            ...$layoutStore,
            cities: [...$layoutStore.cities, coord],
          });
          break;
        case "headquarter":
          layoutStore.set({ ...$layoutStore, headquarter: coord });
          break;
        case "banner":
          layoutStore.set({
            ...$layoutStore,
            banners: [...$layoutStore.banners, coord],
          });
          break;
        case "trap":
          layoutStore.set({ ...$layoutStore, trap: coord });
          break;
        case "trap2":
          layoutStore.set({ ...$layoutStore, trap2: coord });
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
          layoutStore.set({
            ...$layoutStore,
            cities: $layoutStore.cities.filter((c) => !isSameCoord(c, coord)),
          });
          break;
        case "headquarter":
          layoutStore.set({ ...$layoutStore, headquarter: undefined });
          break;
        case "banner":
          layoutStore.set({
            ...$layoutStore,
            banners: $layoutStore.banners.filter((b) => !isSameCoord(b, coord)),
          });
          break;
        case "trap2":
          layoutStore.set({ ...$layoutStore, trap2: undefined });
          break;
      }
    }
  }

  function handleReset() {
    layoutStore.set(wheel);
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

    <fieldset>
      <legend>Trap 1 Position</legend>

      <label>X<input type="number" bind:value={bearX} width="5" /></label>
      <label>Y<input type="number" bind:value={bearY} /></label>
    </fieldset>

    <button onclick={handleReset}> Reset Trap Layout </button>
    <button onclick={() => rotate("left")}> Rotate left </button>
    <button onclick={() => rotate("right")}> Rotate right </button>
    <button onclick={() => flip("horizontal")}> Flip X</button>
    <button onclick={() => flip("vertical")}> Flip Y</button>

    <fieldset>
      <label
        ><input
          type="radio"
          name="type"
          value="trap2"
          bind:group={editType}
        />Trap 2</label
      >
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

    <button onclick={() => layoutStore.set(cleanTrapLayout)}>Clear</button>
    <button
      onclick={() =>
        navigator.clipboard.writeText(JSON.stringify($layoutStore))}
      >Copy</button
    >

    <hr />

    <label
      >Names, one per line
      <textarea name="names" bind:value={namesInput}></textarea>
    </label>
  </aside>

  <div class="grid-container">
    <Map
      trapLayout={$layoutStore}
      {trapCoords}
      zoom={editorValue.zoom}
      placePreview={editType}
      onPlace={handleTilePlacement}
      onRemove={handleTileRemoval}
      isometric={editorValue.isometric}
      {names}
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
    display: flex;
    flex-direction: column;

    h3 {
      margin: 0;
    }

    & > * + * {
      margin-top: 10px;
    }
  }

  .grid-container {
    grid-area: grid;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  label:has(textarea) {
    flex: 1;
    display: flex;
    flex-direction: column;

    textarea {
      padding: 5px;
      flex: 1;
    }
  }
</style>
