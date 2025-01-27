import express from "express";
import cors from "cors";
import userRoutes from "./routers/userRoutes.js";
import adminRoutes from "./routers/adminRoutes.js";
import dotenv from "dotenv"
dotenv.config()

const app = express();

app.use(express.json());
app.use(cors());

// Rotas
app.use("/usuarios", userRoutes);
app.use("/admin", adminRoutes);

export default app;
