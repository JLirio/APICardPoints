import { Router } from "express";
import { createAdmin, getAdmins } from "../controllers/adminController.js";

const router = Router();

router.post("/", createAdmin);
router.get("/", getAdmins);
// Adicione outras rotas: PUT, DELETE...

export default router;
