import memoize from "memoize";
import type { Coordinate, QualifiedItem } from "../types/types";

export function detectCollisions(proposals: QualifiedItem | null, reality: QualifiedItem[]): Coordinate[]
export function detectCollisions(proposals: QualifiedItem[], reality: QualifiedItem[]): Coordinate[]
export function detectCollisions(proposals: null | QualifiedItem | QualifiedItem[], reality: QualifiedItem[]): Coordinate[] {
  if (!proposals) {
    return []
  }

  if (!Array.isArray(proposals)) {
    proposals = [proposals]
  }

  const occupiedCoordinates = new Set(reality.flatMap(getOccupiedCoordinates).map((c => c.join(','))));
  const proposedCoordinates = new Set(proposals.flatMap(getOccupiedCoordinates).map((c => c.join(','))));

  const collisions = occupiedCoordinates.intersection(proposedCoordinates);

  return Array.from(collisions).map(c => c.split(',').map(Number) as Coordinate)
}

const getOccupiedCoordinates = memoize(function getOccupiedCoordinates(tile: QualifiedItem): Coordinate[] {
  const occupied: Coordinate[] = [];

  for (let x = 0; x < tile.dx; x += 1) {
    for (let y = 0; y < tile.dy; y += 1) {
      occupied.push([x + tile.x, y + tile.y])
    }
  }

  return occupied;
})
