import { Router } from "express";
import { createUser, getUsers, getUserByEmail, deleteUser, editUser, getUserById, loginUser, getUserInfo  } from "../controllers/userController.js";

const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/login/:email?", getUserByEmail);
router.get("/user/:id?", getUserById);
router.get("/", getUsers);
router.put("/:id?", editUser);
router.delete("/:id", deleteUser);

router.get("/user-info", getUserInfo);
// Adicione outras rotas: PUT, DELETE...

export default router;
