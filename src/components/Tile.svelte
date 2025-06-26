<script lang="ts">
  import { TILE_SIZE } from "../constants";
  import type { ItemType, TileType } from "../types/grid";

  export let item: ItemType;
  export let idx: number;
  export let isometric: boolean;

  const sizeMap: Record<TileType, number> = {
    city: 2,
    headquarters: 3,
    banner: 1,
    trap: 3,
    mine: 2,
    mountain: 1,
    river: 1,
  };

  const coverageMap: Record<TileType, number> = {
    city: 0,
    headquarters: 6,
    banner: 3,
    trap: 0,
    mine: 0,
    mountain: 0,
    river: 0,
  };

  const nameMap: Record<TileType, string> = {
    city: "City",
    headquarters: "HQ",
    banner: "⚑",
    trap: "Trap",
    mine: "Mine",
    mountain: "Mountain",
    river: "River",
  };
</script>

<div
  class="grid-item"
  style:left={item.x * TILE_SIZE + 1 + "px"}
  style:top={item.y * TILE_SIZE + 1 + "px"}
  style:width={sizeMap[item.type] * TILE_SIZE - 3 + "px"}
  style:height={sizeMap[item.type] * TILE_SIZE - 3 + "px"}
  style:outline-width={coverageMap[item.type] * TILE_SIZE + "px"}
  class:isometric
>
  <span>
    {idx ?? nameMap[item.type]}
  </span>
</div>

<style>
  .grid-item {
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    /* background-color: white; */
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
