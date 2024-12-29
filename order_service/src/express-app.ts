import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import orderRoutes from "./routes/order.routes";
import cartRoutes from "./routes/cart.routes";
import { httpLogger, HandleErrorWithLogger } from "./utils";
import { MessageBroker } from "./utils/broker";
import { Consumer, Producer } from "kafkajs"

export const ExpressApp = async () => {

  const app = express();
  app.use(cors());
  app.use(express.json());
  app.use(httpLogger);

  // 1 part: connect consumer and producer
  const producer = await MessageBroker.connectProducer<Producer>();
  producer.on("producer.connect", () => {
    console.log("producer connected");
  });

  const consumer = await MessageBroker.connectConsumer<Consumer>();
  consumer.on("consumer.connect", () => {
    console.log("consumer connected");
  });

  // 2 part: subscribe or publish
  await MessageBroker.subscribe((message) => {
    console.log("Consumer received message");
    console.log("Received message:", message);
  }, "OrderEvents");

  app.use(cartRoutes);
  app.use(orderRoutes);

  app.use("/", (req: Request, res: Response, _: NextFunction) => {
    res.status(200).json({ message: "Hello, World!" });
  });

  app.use(HandleErrorWithLogger);

  return app;
};
