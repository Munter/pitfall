export type TileType = "city" | "headquarters" | "banner" | "trap" | "mine" | "obstruction";

type GridItem = {
  type: TileType;
  x: number;
  y: number;
};

export type City = GridItem & { type: "city" };
export type Trap = GridItem & { type: "trap" };
export type Banner = GridItem & { type: "banner" };
export type HeadQuarters = GridItem & { type: "headquarters" };
export type Mine = GridItem & { type: "mine" };
export type Obstruction = GridItem & { type: "obstruction" };

export type ItemType = City | Trap | Banner | HeadQuarters | Mine | Obstruction;
