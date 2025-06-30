import type { Coordinate, ItemType, QualifiedItem } from "../types/types";

export function getTileData<T extends ItemType>(
  item: T,
  bearCoords?: Coordinate,
): QualifiedItem<T> {
  switch (item.type) {
    case "city": {
      const city = { ...item, dx: 2, dy: 2, r: 0, text: "City", icon: "🏠" };

      return city;
    }
    case "headquarter":
      return { ...item, dx: 3, dy: 3, r: 6, text: "Headquarters", icon: "🏢" };
    case "banner":
      return { ...item, dx: 1, dy: 1, r: 3, text: "Banner", icon: "⚑" };
    case "trap":
      return { ...item, dx: 3, dy: 3, r: 0, text: "Trap", icon: "🧸" };
    case "mine": {
      const base = { dx: 2, dy: 2, r: 0 };

      switch (item.resource) {
        case "wood":
          return { ...item, ...base, text: "Alliance Woodmill", icon: "🪵" };
        case "stone":
          return { ...item, ...base, text: "Aliance Quarry", icon: "🪨" };
        case "iron":
          return { ...item, ...base, text: "Alliance Iron Mine", icon: "⛏️" };
        case "bread":
          return { ...item, ...base, text: "ALliance Mill", icon: "🍞" };
      }

      throw new Error(`Unknown resource type: ${item.resource}`);
    }
    case "mountain":
      return { ...item, dx: 1, dy: 1, r: 0, text: "Mountain", icon: "⛰" };
    case "river":
      return { ...item, dx: 1, dy: 1, r: 0, text: "River", icon: "🌊" };
    case "turret":
      return { ...item, dx: 2, dy: 2, r: 0, text: "Turret", icon: "🏹" };
    case "castle":
      return { ...item, dx: 6, dy: 6, r: 0, text: "Castle", icon: "🏰" };
    case "fort":
      return { ...item, dx: 6, dy: 6, r: 0, text: "Fort", icon: "⚔" };
    case "sanctuary":
      return { ...item, dx: 6, dy: 6, r: 0, text: "Sanctuary", icon: "⛪" };
    default:
      throw new Error(`Unknown tile type: ${item.type}`);
  }
}

export function getTilesBounds(
  tiles: QualifiedItem[],
  padding = 0,
): {
  width: number;
  height: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
} {
  if (tiles.length === 0) {
    return { width: 0, height: 0, minX: 0, minY: 0, maxX: 0, maxY: 0 };
  }

  const minX = Math.min(...tiles.map((item) => item.x - padding));

  const minY = Math.min(...tiles.map((item) => item.y - padding));

  const maxX = Math.max(...tiles.map((item) => item.x + item.dx + padding));
  const maxY = Math.max(...tiles.map((item) => item.y + item.dy + padding));

  const width = maxX - minX;
  const height = maxY - minY;

  return {
    width,
    height,
    maxX,
    maxY,
    minX,
    minY,
  };
}

function getCityDistance(offset: Coordinate): number {
  return Math.sqrt();
}
