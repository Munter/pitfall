export type AllianceBuildingType =
  | "city"
  | "headquarter"
  | "banner"
  | "trap"
  | "trap2";
export type MapTileType =
  | "mine"
  | "mountain"
  | "river"
  | "turret"
  | "castle"
  | "fort"
  | "sanctuary";
export type TileType = AllianceBuildingType | MapTileType;
type ResourceType = "bread" | "wood" | "stone" | "iron";

export type Coordinate = [number, number];
export type VerboseCoordinate = {
  x: number;
  y: number;
};

export type GridItem<TType extends TileType = TileType> = VerboseCoordinate & {
  type: TType;
};

export type Mine = GridItem<"mine"> & {
  resource: ResourceType;
};

export type MapTile = Mine | GridItem<MapTileType>;
export type KingshotMap = Array<MapTile>;

export type ItemType = GridItem<TileType> | Mine;

type TileData = {
  dx: number;
  dy: number;
  r: number;
  text: string;
  icon: string;
  playerName?: string;
  distance?: number;
};

export type QualifiedItem<T extends ItemType = ItemType> = T & TileData;

export type TrapLayout = {
  name?: string;
  description?: string;

  trap?: Coordinate;
  trap2?: Coordinate;
  headquarter?: Coordinate;
  banners: Array<Coordinate>;
  cities: Array<Coordinate>;
};
export type TrapMap = Array<QualifiedItem<GridItem<AllianceBuildingType>>>;
