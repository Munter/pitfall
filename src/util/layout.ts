import type { Coordinate, TrapLayout, TrapMap, VerboseCoordinate } from "../types/types";
import { getTileData } from "./tileData";

export function layoutToMapTiles(layout: TrapLayout, trapCoord: Coordinate = [0, 0]): TrapMap {
  const map: TrapMap = [];

  // Add the trap
  map.push(getTileData({ type: 'trap', x: trapCoord[0], y: trapCoord[1] }));

  // Add the headquarters
  if (layout.headquarter) {
    map.push(getTileData({ type: 'headquarter', ...relativeCoordToAbsolute(trapCoord, layout.headquarter) }));
  }

  // Add banners
  for (const banner of layout.banners) {
    map.push(getTileData({ type: 'banner', ...relativeCoordToAbsolute(trapCoord, banner) }));
  }

  // Add cities
  for (const city of layout.cities) {
    map.push(getTileData({ type: 'city', ...relativeCoordToAbsolute(trapCoord, city) }));
  }

  return map;
}

function relativeCoordToAbsolute(trapCoord: Coordinate, relativeCoord: Coordinate): VerboseCoordinate {
  return {
    x: trapCoord[0] + relativeCoord[0],
    y: trapCoord[1] + relativeCoord[1]
  }
}
