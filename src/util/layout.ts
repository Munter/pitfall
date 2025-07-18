import type {
  Coordinate,
  TrapLayout,
  TrapMap,
  VerboseCoordinate,
} from "../types/types";
import { getTileData } from "./tileData";

export function layoutToMapTiles(
  layout: TrapLayout,
  trapCoord: Coordinate = [0, 0],
): TrapMap {
  const map: TrapMap = [];

  // Add the trap
  map.push(getTileData({ type: "trap", x: trapCoord[0], y: trapCoord[1] }));

  // Add the headquarters
  if (layout.headquarter) {
    map.push(
      getTileData({
        type: "headquarter",
        ...relativeCoordToAbsolute(trapCoord, layout.headquarter),
      }),
    );
  }

  // Add banners
  for (const banner of layout.banners) {
    map.push(
      getTileData({
        type: "banner",
        ...relativeCoordToAbsolute(trapCoord, banner),
      }),
    );
  }

  // Add cities
  for (const city of layout.cities) {
    map.push(
      getTileData({
        type: "city",
        ...relativeCoordToAbsolute(trapCoord, city),
      }),
    );
  }

  return map;
}

export function relativeCoordToAbsolute(
  trapCoord: Coordinate,
  relativeCoord: Coordinate,
): VerboseCoordinate {
  return {
    x: trapCoord[0] + relativeCoord[0],
    y: trapCoord[1] + relativeCoord[1],
  };
}

export function rotateLeft(layout: TrapLayout): TrapLayout {
  const rotatedLayout: TrapLayout = {
    name: layout.name,
    description: layout.description,
    headquarter: layout.headquarter
      ? [-layout.headquarter[1], layout.headquarter[0]]
      : undefined,
    banners: layout.banners.map((coord) => [-coord[1] + 2, coord[0]]),
    cities: layout.cities.map((coord) => [-coord[1] + 1, coord[0]]),
  };

  return rotatedLayout;
}

export function rotateRight(layout: TrapLayout): TrapLayout {
  const rotatedLayout: TrapLayout = {
    name: layout.name,
    description: layout.description,
    headquarter: layout.headquarter
      ? [layout.headquarter[1], -layout.headquarter[0]]
      : undefined,
    banners: layout.banners.map((coord) => [coord[1], -coord[0] + 2]),
    cities: layout.cities.map((coord) => [coord[1], -coord[0] + 1]),
  };

  return rotatedLayout;
}

export function flipX(layout: TrapLayout): TrapLayout {
  const flippedLayout: TrapLayout = {
    name: layout.name,
    description: layout.description,
    headquarter: layout.headquarter
      ? [-layout.headquarter[0], layout.headquarter[1]]
      : undefined,
    banners: layout.banners.map((coord) => [-coord[0] + 2, coord[1]]),
    cities: layout.cities.map((coord) => [-coord[0] + 1, coord[1]]),
  };

  return flippedLayout;
}

export function flipY(layout: TrapLayout): TrapLayout {
  const flippedLayout: TrapLayout = {
    name: layout.name,
    description: layout.description,
    headquarter: layout.headquarter
      ? [layout.headquarter[0], -layout.headquarter[1]]
      : undefined,
    banners: layout.banners.map((coord) => [coord[0], -coord[1] + 2]),
    cities: layout.cities.map((coord) => [coord[0], -coord[1] + 1]),
  };

  return flippedLayout;
}
