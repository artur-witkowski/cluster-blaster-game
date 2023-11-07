export type Vector2 = {
  x: number;
  y: number;
} & { readonly Vector2: unique symbol };

export type Coords = {
  x: number;
  y: number;
} & { readonly Coords: unique symbol };
