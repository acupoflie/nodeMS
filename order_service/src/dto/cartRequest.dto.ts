import { Type, Static } from "@sinclair/typebox";

export const CartRequestSchema = Type.Object({
  productId: Type.Integer(),
  qty: Type.Integer(),
});

export type CartRequestInput = Static<typeof CartRequestSchema>;

export const CartRequestEditSchema = Type.Object({
  id: Type.Integer(),
  qty: Type.Integer(),
});

export type CartRequestEditInput = Static<typeof CartRequestEditSchema>;

export type CartLineItem = {
  id: number;
  productId: number;
  qty: number;
  itemName: string;
  variant: string | null;
  price: string;
  createdAt: Date;
  updatedAt: Date;
  availability?: number;
};

export interface CartWithLineItems {
  id: number;
  customerId: number;
  lineItems: CartLineItem[];
  createdAt: Date;
  updatedAt: Date;
}

