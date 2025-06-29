export type TileType = "city" | "headquarter" | "banner" | "trap" | "mine" | "mountain" | "river" | "turret" | "castle" | "fort" | "sanctuary";
type ResourceType = "bread" | "wood" | "stone" | "iron";

export type Coordinate = [number, number];
export type VerboseCoordinate = {
  x: number;
  y: number;
}

export type GridItem<TType extends TileType = TileType> = VerboseCoordinate & {
  type: TType;
};

type Mine = GridItem<'mine'> & {
  resource: ResourceType;
};

export type MapTile = Mine | GridItem<'mountain' | 'river' | "turret" | "castle" | "fort" | "sanctuary">
export type KingshotMap = Array<MapTile>

export type ItemType = GridItem<TileType> | Mine;

type TileData = { dx: number; dy: number, r: number, text: string, icon: string };

export type QualifiedItem<T extends ItemType = ItemType> = T & TileData;

export type TrapLayout = {
  name: string;
  description: string;

  headquarter?: Coordinate;
  banners: Array<Coordinate>;
  cities: Array<Coordinate>;
}
export type TrapMap = Array<QualifiedItem<GridItem<"city" | "headquarter" | "banner" | "trap">>>
