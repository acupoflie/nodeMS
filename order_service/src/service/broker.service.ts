import { Producer } from "kafkajs";
import { Consumer } from "kafkajs";
import { MessageBroker } from "../utils";
import { HandleSubscription } from "./order.service";
import { OrderEvent } from "../types";

// initialize the broker
export const InitializeBroker = async () => {
  const producer = await MessageBroker.connectProducer<Producer>();
  producer.on("producer.connect", () => {
    console.log("producer connected");
  });
  const consumer = await MessageBroker.connectConsumer<Consumer>();
  consumer.on("consumer.connect", () => {
    console.log("consumer connected");
  });

  // keep listening to consumer events
  // perform the action based on the event
  await MessageBroker.subscribe(HandleSubscription, "OrderEvents");
};

// publish dedicated events based on the use cases
export const SendCreateOrderMessage = async (data: any) => {
  await MessageBroker.publish({
    headers: {},
    topic: "CatalogEvents",
    event: OrderEvent.CREATE_ORDER,
    message: data,
  });
};

export const SendOrderCancelledMessage = async (data: any) => {
  await MessageBroker.publish({
    headers: {},
    topic: "CatalogEvents",
    event: OrderEvent.CANCEL_ORDER,
    message: data,
  });
};
