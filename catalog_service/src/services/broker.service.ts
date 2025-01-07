import { Consumer, Producer } from "kafkajs";
import { CatalogService } from "./catalog.service";
import { MessageBroker } from "../utils/broker/message-broker";
import { CatalogEvent } from "../types";

export class BrokerService {
  private producer: Producer | null = null;
  private consumer: Consumer | null = null;

  private catalogService: CatalogService;

  constructor(catalogService: CatalogService) {
    this.catalogService = catalogService;
  }

  public async initializeBroker() {
    this.producer = await MessageBroker.connectProducer<Producer>();
    this.producer.on("producer.connect", () => {
      console.log("Catalog Service : producer connected");
    });
    this.consumer = await MessageBroker.connectConsumer<Consumer>();
    this.consumer.on("consumer.connect", () => {
      console.log("Catalog Service : consumer connected");
    });

    // keep listening to consumer events
    // perform the action based on the event
    await MessageBroker.subscribe(
      this.catalogService.handleBrokerMessage.bind(this.catalogService),
      "CatalogEvents"
    );
  }

  //TODO publish discontinue product event
  public async sendDeleteProductMessage(data: any) {
    // await MessageBroker.publish({
    //   headers: {},
    //   topic: "CatalogEvents",
    //   event: CatalogEvent.CANCEL_ORDER,
    //   message: data,
    // });
  }
}
