import { Router } from "express";
import { createUser, getUsers, getUserByEmail, deleteUser, editUser, getUserById  } from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.get("/login/:email?", getUserByEmail);
router.get("/user/:id?", getUserById);
router.get("/", getUsers);
router.put("/:id?", editUser);
router.delete("/:id", deleteUser);
// Adicione outras rotas: PUT, DELETE...

export default router;
