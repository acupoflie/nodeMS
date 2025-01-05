// import "dotenv/config";
// export * from "./env";
//! dotenv DOES NOT WORK?

process.env.DB_URL = "postgresql://order_db:order_db_password@localhost:5433/order_service?schema=public"

// console.log(process.env.DB_URL);
// console.log(process.env.APP_PORT);
// console.log(process.env.DATABASE_URL);

export const DB_URL = process.env.DB_URL;
// export const APP_PORT = process.env.APP_PORT;
