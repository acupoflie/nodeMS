import app from "./expressApp";
import { logger } from "./utils";
import "dotenv/config";

const PORT = process.env.PORT || 8000;

export const StartServer = async () => {
  app.listen(PORT, () => {
    logger.info(`Listening to: ${PORT}`);
  });

  process.on("uncaughtException", async (err) => {
    logger.error(err);
    process.exit(1);
  });
};

StartServer().then(() => {
  logger.info("server is up");
});
