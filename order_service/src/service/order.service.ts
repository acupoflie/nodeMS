import { OrderRepositoryType } from "../repository/order.repository";
import { OrderLineItemType, OrderWithLineItems } from "../dto/orderRequest.dto";
import { CartRepositoryType } from "../repository/cart.repository";
import { MessageType, OrderStatus } from "../types";
import { SendCreateOrderMessage } from "./broker.service";

export const CreateOrder = async (
  userId: number,
  repo: OrderRepositoryType,
  cartRepo: CartRepositoryType
) => {
  // find cart by user id
  const cart = await cartRepo.findCart(userId);
  if (!cart) {
    throw new Error("Cart not found");
  }

  // calculate total price
  let totalPrice = 0;
  let orderLineItems: OrderLineItemType[] = [];

  // create orderline items from cart
  cart.lineItems.forEach((lineItem) => {
    totalPrice += Number(lineItem.price) * Number(lineItem.qty);
    orderLineItems.push({
      productId: lineItem.productId,
      itemName: lineItem.itemName,
      qty: lineItem.qty,
      price: lineItem.price,
    } as OrderLineItemType);
  });

  const orderNumber = Math.floor(Math.random() * 1000000);

  // create order with lineitems
  const orderInput: OrderWithLineItems = {
    orderNumber: orderNumber,
    txnId: null,
    customerId: userId,
    amount: totalPrice.toString(),
    orderItems: orderLineItems,
    status: OrderStatus.PENDING,
  };

  //! TEMPORARY
  const order = await repo.createOrder(orderInput);
  await cartRepo.clearCartData(userId);
  console.log("Order created successfully", order);

  // fire a message to the subscription service [catalog service] to update the inventory
  await SendCreateOrderMessage(orderInput);

  // return success response
  return { message: "Order created successfully", orderNumber };
};

export const UpdateOrder = async (
  orderId: number,
  status: OrderStatus,
  repo: OrderRepositoryType
) => {
  await repo.updateOrder(orderId, status);

  // fire a message to the subscription service [catalog service] to update the inventory
  //TODO handle kafka calls
  if (status === OrderStatus.CANCELLED) {
    // await repo.publishOrderEvent(orderId, "ORDER_CANCELLED");
  }

  return { message: "Order updated successfully" };
};

export const GetOrder = async (orderId: number, repo: OrderRepositoryType) => {
  const order = await repo.findOrder(orderId);
  if (!order) {
    throw new Error("Order not found");
  }
  return order;
};

export const GetOrders = async (userId: number, repo: OrderRepositoryType) => {
  const orders = await repo.findOrdersByCustomerId(userId);
  if (Array.isArray(orders) && orders.length > 0) {
    return orders;
  }
  throw new Error("Orders not found");
};

export const DeleteOrder = async (
  orderId: number,
  repo: OrderRepositoryType
) => {
  await repo.deleteOrder(orderId);
  return true;
};

export const HandleSubscription = async (message: MessageType) => {
  console.log("Message received by order consumer", message);
  // if (message.event === OrderEvent.CREATE_ORDER)
  // call create order
  return {};
};
