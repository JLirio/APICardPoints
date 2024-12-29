import express from "express";
import cors from "cors";
import userRoutes from "./routers/userRoutes.js";
import adminRoutes from "./routers/adminRoutes.js";
import dotenv from "dotenv"

const app = express();

dotenv.config()
app.use(express.json());
app.use(cors());

// Rotas
app.use("/usuarios", userRoutes);
app.use("/admin", adminRoutes);

//console.log(process.env.DATABASE_URL)

export default app;
