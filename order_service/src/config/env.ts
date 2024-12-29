// import "dotenv/config";

export default {
  DB_URL:
    "postgresql://order_db:order_db_password@localhost:5433/order_service?schema=public",
  APP_PORT: 9002,
  CATALOG_BASE_URL: "http://localhost:9001",
  CLIENT_ID: "order-service",
  GROUP_ID: "order-service-group",
  BROKER_1: "localhost:9092",
};
