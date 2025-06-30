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
    name?: string;
  };

  let {
    tileSize = TILE_SIZE,
    item,
    idx,
    left,
    bottom,
    isometric,
    name,
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
  <div>
    {#if item.type === "city"}
      <div class="title">
        {name ?? (typeof idx === "number" ? idx + 1 : "")}
      </div>
      <code>({item.x},{item.y})</code>
    {:else if item.type === "trap"}
      <div>{item.icon}</div>
      <code>({item.x},{item.y})</code>
    {:else}
      {item.icon}
    {/if}
  </div>
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
    overflow: hidden;
    font-size: 80%;
  }

  .grid-item > div {
    text-align: center;
    transform: rotate(0deg);
    /* transition: transform 0.3s ease-in-out; */
  }

  .grid-item.isometric > div {
    transform: skew(-10deg, -10deg) rotate(45deg);
  }

  .title {
    font-weight: normal;
  }

  code {
    white-space: pre;
    font-size: 90%;
  }
</style>
