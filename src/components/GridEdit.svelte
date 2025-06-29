<script lang="ts">
  import EditorForm from "./EditorForm.svelte";
  import type { EditorFormProps } from "../types/form";
  import Map from "./Map.svelte";

  import { kingdom129 } from "../maps/kingdom-129";
  import { orthogonalPrio } from "../trapLayouts/orthoginal-prio";
  import { flipX, flipY, rotateLeft, rotateRight } from "../util/layout";
  import type { Coordinate } from "../types/types";

  let editorValue: EditorFormProps = $state({
    isEditing: true,
    showCities: true,
    zoom: 200,
  });

  let trapLayout = $state(orthogonalPrio);
  let bearX = $state(0);
  let bearY = $state(0);
  let trapCoords = $derived<Coordinate>([bearX, bearY]);

  function rotate(direction: "left" | "right") {
    if (direction === "left") {
      trapLayout = rotateLeft(trapLayout);
    } else {
      trapLayout = rotateRight(trapLayout);
    }
  }

  $effect(() => {
    console.log(JSON.stringify(trapLayout));
  });

  function flip(axis: "horizontal" | "vertical") {
    if (axis === "horizontal") {
      trapLayout = flipX(trapLayout);
    } else if (axis === "vertical") {
      trapLayout = flipY(trapLayout);
    }
  }
</script>

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
  </aside>

  <div class="grid-container">
    <Map
      kingshotMap={kingdom129}
      {trapLayout}
      {trapCoords}
      zoom={editorValue.zoom}
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
