import { eq } from "drizzle-orm";
import { DB } from "../db/db.connection";
import { orderLineItems, orders } from "../db/schema";
import { OrderWithLineItems } from "../dto/orderRequest.dto";

export type OrderRepositoryType = {
  createOrder: (lineItem: OrderWithLineItems) => Promise<Number>;
  findOrder: (orderId: number) => Promise<OrderWithLineItems | null>;
  updateOrder: (orderId: number, status: string) => Promise<OrderWithLineItems>;
  deleteOrder: (orderId: number) => Promise<boolean>;
  findOrdersByCustomerId: (customerId: number) => Promise<OrderWithLineItems[]>;
};

const createOrder = async (lineItem: OrderWithLineItems): Promise<Number> => {
  const result = await DB.insert(orders)
    .values({
      customerId: lineItem.customerId,
      orderNumber: lineItem.orderNumber,
      amount: lineItem.amount,
      status: lineItem.status,
      txnId: lineItem.txnId,
    })
    .returning();

  const [{ id }] = result;

  if (id > 0) {
    for (const item of lineItem.orderItems) {
      await DB.insert(orderLineItems)
        .values({
          itemName: item.itemName,
          qty: item.qty,
          price: item.price,
          orderId: id,
        })
        .execute();
    }
  }

  return id;
};

const findOrder = async (id: number): Promise<OrderWithLineItems | null> => {
  const order = await DB.query.orders.findFirst({
    where: (orders, { eq }) => eq(orders.id, id),
    with: {
      lineItems: true,
    },
  });

  if (!order) {
    throw new Error("Order not found");
  }

  return order as unknown as OrderWithLineItems;
};

const updateOrder = async (
  id: number,
  status: string
): Promise<OrderWithLineItems> => {
  await DB.update(orders).set({ status }).where(eq(orders.id, id)).returning();

  const order = await findOrder(id);

  if (!order) {
    throw new Error("Order not found");
  }

  return order;
};

const deleteOrder = async (id: number): Promise<boolean> => {
  await DB.delete(orders).where(eq(orders.id, id));
  return true;
};

const findOrdersByCustomerId = async (
  customerId: number
): Promise<OrderWithLineItems[]> => {
  const orders = await DB.query.orders.findMany({
    where: (orders, { eq }) => eq(orders.customerId, customerId),
    with: {
      lineItems: true,
    },
  });

  return orders as unknown as OrderWithLineItems[];
};

export const OrderRepository: OrderRepositoryType = {
  createOrder,
  findOrder,
  updateOrder,
  deleteOrder,
  findOrdersByCustomerId,
};
