import { CartLineItem } from "../db/schema";
import { CartRequestEditInput, CartRequestInput } from "../dto/cartRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { AuthorizeError, logger, NotFoundError } from "../utils";
import { GetProductDetails, GetStockDetails } from "../utils/broker";

export const CreateCart = async (
  input: CartRequestInput & { customerId: number },
  repo: CartRepositoryType
) => {
  // get product details from catalog microservice
  const product = await GetProductDetails(input.productId);
  logger.info(product);

  if (product.stock < input.qty) {
    throw new NotFoundError("product is out of stock");
  }

  const lineItem = await repo.findCartByProductId(
    input.customerId,
    input.productId
  );

  if (lineItem) {
    return repo.updateCart(lineItem.id, input.qty + lineItem.qty);
  }

  return await repo.createCart(input.customerId, {
    productId: product.id,
    price: product.price.toString(),
    qty: input.qty,
    itemName: product.name,
    variant: product.variant,
  } as CartLineItem);
};

export const GetCart = async (id: number, repo: CartRepositoryType) => {
  // get customer cart data
  const cart = await repo.findCart(id);
  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }

  // list out all the line items in the cart
  const lineItems = cart.lineItems;
  if (!lineItems.length) {
    throw new NotFoundError("cart does not have any items");
  }

  // verify with catalog microservice that the product is still in stock
  const stockDetails = await GetStockDetails(
    lineItems.map((item) => item.productId)
  );

  if (Array.isArray(stockDetails)) {
    // update the line items with the stock details
    lineItems.forEach((item) => {
      const stockItem = stockDetails.find(
        (stock) => stock.id === item.productId
      );
      if (stockItem) {
        item.availability = stockItem.stock;
      }
    });

    cart.lineItems = lineItems;
  }

  // return the cart data
  return cart;
};

const AuthorizeCart = async (
  lineItemId: number,
  customerId: number,
  repo: CartRepositoryType
) => {
  const cart = await repo.findCart(customerId);
  if (!cart) {
    throw new NotFoundError("cart does not exist");
  }

  const lineItem = cart.lineItems.find((item) => item.id === lineItemId);
  if (!lineItem) {
    throw new AuthorizeError("you are not authorized to edit this cart");
  }

  return lineItem;
};

export const EditCart = async (
  input: CartRequestEditInput & { customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorizeCart(input.id, input.customerId, repo);
  const data = await repo.updateCart(input.id, input.qty);
  return data;
};

export const DeleteCart = async (
  input: { id: number; customerId: number },
  repo: CartRepositoryType
) => {
  await AuthorizeCart(input.id, input.customerId, repo);
  const data = await repo.deleteCart(input.id);
  return data;
};
