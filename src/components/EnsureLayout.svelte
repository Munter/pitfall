<script lang="ts">
  import { onMount } from "svelte";
  import { layoutStore } from "../stores/stores";
  import { wheel } from "../trapLayouts/wheel";
  import { LayoutSchema } from "../util/layout";

  let { children } = $props();

  let isLoading = $state(true);
  onMount(() => {
    try {
      layoutStore.set(
        LayoutSchema.parse(
          JSON.parse(new URLSearchParams(location.search).get("layout") ?? "{}")
        )
      );
    } catch (e) {
      layoutStore.set(wheel);
    } finally {
      isLoading = false;
    }
  });
</script>

{#if isLoading}
  <p>Loading...</p>
{:else}
  {@render children()}
{/if}
