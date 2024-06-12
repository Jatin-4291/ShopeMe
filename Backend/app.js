import express from "express";
import cors from "cors";
import AppError from "./utils/AppError.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";

const app = express();
app.use(
  cors({
    origin: ["https://shope-me-aloj.vercel.app"],
    methods: ["POST", "GET", "PATCH", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use((req, res, next) => {
  next();
});
app.get("/", (req, res, next) => {
  return res.status(200).json({
    status: "ok",
  });
});

app.use(`/api/v1/users`, userRoutes);
app.use(`/api/v1/product`, productRoutes);
app.use(`/api/v1/orders`, orderRoutes);

export default app;
