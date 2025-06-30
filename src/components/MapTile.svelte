<script lang="ts">
  import { TILE_SIZE } from "../constants";
  import type { ItemType, QualifiedItem } from "../types/types";

  type Props = {
    tileSize: number;
    item: QualifiedItem<ItemType>;
    idx?: number;
    left: number;
    bottom: number;
    isometric: boolean;
  };

  let {
    tileSize = TILE_SIZE,
    item,
    idx,
    left,
    bottom,
    isometric,
  }: Props = $props();
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
