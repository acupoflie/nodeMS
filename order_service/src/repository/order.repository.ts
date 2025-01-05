import { OrderWithLineItems } from "../dto/orderRequest.dto";

export type OrderRepositoryType = {
  createOrder: (lineItem: OrderWithLineItems) => Promise<Number>;
  findOrder: (orderId: number) => Promise<OrderWithLineItems | null>;
  updateOrder: (orderId: number, status: string) => Promise<OrderWithLineItems>;
  deleteOrder: (orderId: number) => Promise<boolean>;
  findOrdersByCustomerId: (customerId: number) => Promise<OrderWithLineItems[]>;
};

export const OrderRepository: OrderRepositoryType = {
  createOrder: function (lineItem: OrderWithLineItems): Promise<Number> {
    throw new Error("Function not implemented.");
  },
  findOrder: function (orderId: number): Promise<OrderWithLineItems | null> {
    throw new Error("Function not implemented.");
  },
  updateOrder: function (
    orderId: number,
    status: string
  ): Promise<OrderWithLineItems> {
    throw new Error("Function not implemented.");
  },
  deleteOrder: function (orderId: number): Promise<boolean> {
    throw new Error("Function not implemented.");
  },
  findOrdersByCustomerId: function (
    customerId: number
  ): Promise<OrderWithLineItems[]> {
    throw new Error("Function not implemented.");
  },
};
