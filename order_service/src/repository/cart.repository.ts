import { DB } from "../db/db.connection";
import { Cart, CartLineItem, cartLineItems, carts } from "../db/schema";
import { NotFoundError } from "../utils";
import { eq } from "drizzle-orm";

export type CartRepositoryType = {
  createCart: (customerId: number, lineItem: CartLineItem) => Promise<Number>,
  findCart: (id: number) => Promise<Cart>,
  updateCart: (id: number, qty: number) => Promise<CartLineItem>,
  deleteCart: (id: number) => Promise<Boolean>,
  clearCartData: (id: number) => Promise<Boolean>,
};

const createCart = async (
  customerId: number,
  { itemName, price, productId, qty, variant }: CartLineItem
) => {
  const result = await DB.insert(carts)
    .values({
      customerId: customerId,
    })
    .returning()
    .onConflictDoUpdate({
      target: carts.customerId,
      set: { updatedAt: new Date() },
    });

  const [{ id }] = result;

  if (id > 0) {
    await DB.insert(cartLineItems).values({
      cartId: id,
      productId: productId,
      itemName: itemName,
      price: price,
      qty: qty,
      variant: variant,
    });
  }

  return id;
};

const findCart = async (id: number): Promise<Cart> => {
  const cart = await DB.query.carts.findFirst({
    where: (carts, { eq }) => eq(carts.customerId, id),
    with: {
      lineItems: true,
    },
  });

  if (!cart) {
    throw new NotFoundError("cart not found");
  }

  return cart;
};

const updateCart = async (id: number, qty: number): Promise<CartLineItem> => {
  const [cartLineItem] = await DB.update(cartLineItems)
    .set({
      qty: qty,
    })
    .where(eq(cartLineItems.id, id))
    .returning();

  return cartLineItem;
};

const deleteCart = async (id: number): Promise<Boolean> => {
  await DB.delete(cartLineItems).where(eq(cartLineItems.id, id)).returning();
  return true;
};

const clearCartData = async (id: number): Promise<Boolean> => {
  await DB.delete(carts).where(eq(carts.id, id)).returning();
  return true;
};

export const CartRepository: CartRepositoryType = {
  createCart,
  findCart,
  updateCart,
  deleteCart,
  clearCartData,
};

// const createCart = async (input: any): Promise<{}> => {
//   // connect to db

//   const result = await DB.insert(carts)
//     .values({
//       customerId: 123,
//     })
//     .returning({ cartId: carts.id });

//   console.log(result);

//   // perform db operations
//   return Promise.resolve({ message: "fake response from cart repo", input });
// };

// const updateCart = async (input: any): Promise<{}> => {
//   return Promise.resolve({});
// };

// const findCart = async (input: any): Promise<{}> => {
//   return Promise.resolve({});
// };

// const deleteCart = async (input: any): Promise<{}> => {
//   return Promise.resolve({});
// };

// export const CartRepository: CartRepositoryType = {
//   create: createCart,
//   find: updateCart,
//   update: findCart,
//   delete: deleteCart,
// };
