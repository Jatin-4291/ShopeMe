import express from "express";
import cors from "cors";
import AppError from "./utils/AppError.js";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import adminDashboardRoutes from "./routes/adminDashboardRoutes.js";
import homepageRoutes from "./routes/homepageRoutes.js";
const app = express();
app.use(cors());
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

export default app;
