import express from "express";
import cors from "cors";
import AppError from "./utils/appError.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import homepageRoutes from "./routes/homepageRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const frontendURL = process.env.FRONTEND_URL;
const app = express();
app.use(
  cors({
    origin: frontendURL,
    methods: "GET,POST,PUT,PATCH,DELETE",
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
app.use(`/api/v1/categories`, categoryRoutes);
app.use(`/api/v1/cart`, cartRoutes);
app.use(`/api/v1/dashboard`, dashboardRoutes);
app.use(`/api/v1/admin`, adminDashboardRoutes);
app.use(`/api/v1/homepage`, homepageRoutes);
app.use(`/api/v1/review`, reviewRoutes);

export default app;
