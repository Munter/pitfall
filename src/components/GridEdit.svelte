<script lang="ts">
  import Grid from "./Grid.svelte";
  import { gridItems } from "../placement";
  import EditorForm from "./EditorForm.svelte";
  import type { EditorFormProps } from "../types/form";

  let editorValue: EditorFormProps = {
    isEditing: false,
    showCities: true,
    zoom: 100,
  };
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
  </aside>

  <div class="grid-container">
    <Grid
      items={gridItems}
      isometric={!editorValue.isEditing}
      showCities={editorValue.showCities}
      zoom={editorValue.zoom}
    />
  </div>
</div>

<style>
  .grid-edit {
    display: grid;
    grid-template-areas: "aside grid";
    grid-template-columns: 300px auto;
  }

  h2 {
    grid-area: header;
    padding: 5px 20px;
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
