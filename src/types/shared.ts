import { DOORS_POSITION } from '../constants/doors';

export type Vector2 = {
  x: number;
  y: number;
} & { readonly Vector2: unique symbol };

export type Coords = {
  x: number;
  y: number;
} & { readonly Coords: unique symbol };

export type DoorsPosition =
  (typeof DOORS_POSITION)[keyof typeof DOORS_POSITION];

export type CollisionBox = {
  x: number;
  y: number;
  width: number;
  height: number;
};
