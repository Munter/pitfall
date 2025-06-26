<script lang="ts">
  import { TILE_SIZE } from "../constants";
  import type { ItemType, QualifiedItem } from "../types/grid";

  export let tileSize = TILE_SIZE;
  export let item: QualifiedItem<ItemType>;
  export let idx: number;
  export let left: number;
  export let bottom: number;

  export let isometric: boolean;
</script>

<div
  class="grid-item"
  title={item.text}
  style:left={left + "px"}
  style:bottom={bottom + "px"}
  style:width={item.dx * tileSize - 2 + "px"}
  style:height={item.dy * tileSize - 2 + "px"}
  style:outline-width={item.r * tileSize + "px"}
  class:isometric
>
  <span>
    {item.icon}
  </span>
</div>

<style>
  .grid-item {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    border: 1px solid black;
    outline-color: rgba(0, 0, 255, 0.05);
    outline-style: solid;
  }

  .grid-item > span {
    transform: rotate(0deg);
    transition: transform 0.3s ease-in-out;
  }

  .grid-item.isometric > span {
    transform: rotate(45deg);
  }
</style>
