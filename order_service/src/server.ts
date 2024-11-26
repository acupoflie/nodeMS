import app from "./express-app";

const PORT = process.env.PORT || 9000;

export const StartServer = async () => {
  app.listen(PORT, () => {
    console.log("Listening to: ", PORT);
  });

  process.on("uncaughtException", async (err) => {
    console.log(err);
    process.exit(1);
  });
};

StartServer().then(() => {
  console.log("server is up");
});
