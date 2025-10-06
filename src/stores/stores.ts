import { derived, writable } from "svelte/store";
import type { Coordinate, TrapLayout } from "../types/types";
import { getTileData } from "../util/tileData";
import { relativeCoordToAbsolute } from "../util/layout";

function getBearCenter(bearCoords: Coordinate) {
  return [bearCoords[0] + 1.5, bearCoords[1] + 1.5];
}

export const layoutStore = writable<TrapLayout>();

export const cityStore = derived(layoutStore, (layout) => {
  const trap1Center: Coordinate = [0, 0];
  // const trap2Center = layout.trap2;

  const result = layout.cities.map(([x, y]) => {
    const data = getTileData({
      type: "city",
      ...relativeCoordToAbsolute(layout.trap ?? trap1Center, [x, y]),
    });

    const cityCenter = [x + data.dx / 2, y + data.dy / 2];

    const bearCenter = getBearCenter(trap1Center);
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
