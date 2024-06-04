import dotenv from "dotenv";
import mongoose from "mongoose";
import app from "./app.js";

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Exception!");
  process.exit(1);
});

dotenv.config({ path: "./config.env" });

const port = process.env.PORT;
const dbUrl = process.env.DB_URI.replace("<password>", process.env.DB_PASS);

mongoose.connect(dbUrl).then(() => {
  console.log("Database is running");
});

const server = app.listen(port, () => {
  console.log("Server is running on the port ", port);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection!");
  server.close(() => {
    process.exit(1);
  });
});
