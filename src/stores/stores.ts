import { derived, writable } from "svelte/store";
import type { TrapLayout } from "../types/types";
import { getTileData } from "../util/tileData";
import { relativeCoordToAbsolute } from "../util/layout";

const bearCenter = [1.5, 1.5];

export const layoutStore = writable<TrapLayout>();

export const cityStore = derived(layoutStore, (layout) => {
  const result = layout.cities.map(([x, y]) => {
    const data = getTileData({
      type: "city",
      ...relativeCoordToAbsolute(layout.trap ?? [0, 0], [x, y]),
    });
    const cityCenter = [x + data.dx / 2, y + data.dy / 2];
    const distance = Math.sqrt(
      Math.pow(cityCenter[0] - bearCenter[0], 2) +
        Math.pow(cityCenter[1] - bearCenter[1], 2),
    );
    const angle = Math.atan2(y - bearCenter[0], x - bearCenter[1]);

    return {
      ...data,
      distance,
      angle,
    };
  });

  return result.sort(sortCities);
});

type SortingCity = { distance: number; angle: number };
function sortCities(a: SortingCity, b: SortingCity) {
  const ddistance = a.distance - b.distance;

  // Unequal distance always wins
  if (ddistance !== 0) {
    return ddistance;
  }

  return b.angle - a.angle;
}
