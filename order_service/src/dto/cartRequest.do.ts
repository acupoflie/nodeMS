import { Type, Static } from "@sinclair/typebox";

export const CartRequestSchema = Type.Object({
  productId: Type.Integer(),
  customerId: Type.Integer(),
  qty: Type.Integer(),
});

export type CartRequestInput = Static<typeof CartRequestSchema>;

export const CartRequestEditSchema = Type.Object({
  id: Type.Integer(),
  qty: Type.Integer(),
});

export type CartRequestEditInput = Static<typeof CartRequestEditSchema>;
