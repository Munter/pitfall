export type TileType = "city" | "headquarters" | "banner" | "trap" | "mine" | "mountain" | "river" | "turret" | "castle" | "fort" | "sanctuary";
type ResourceType = "bread" | "wood" | "stone" | "iron";

export type GridItem<TType extends TileType> = {
  type: TType;
  x: number;
  y: number;
};

type Mine = GridItem<'mine'> & {
  resource: ResourceType;
};

export type MapTile = Mine | GridItem<'mountain' | 'river' | "turret" | "castle" | "fort" | "sanctuary">
export type KingshotMap = Array<MapTile>

export type ItemType = GridItem<TileType> | Mine;

export type PitfallMap = {
  map: KingshotMap,

  bearTrap: GridItem<'trap'>;
  beartrap2: GridItem<'trap'>;

  hq: GridItem<'headquarters'>;
  banners: Array<GridItem<'banner'>>;
  cities: Array<GridItem<'city'>>;
}

type TileData = { dx: number; dy: number, r: number, text: string, icon: string };

export type QualifiedItem<T extends ItemType> = T & TileData;
