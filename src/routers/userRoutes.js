import { Router } from "express";
import { createUser, getUsers, getUserByEmail, deleteUser, editUser, updateSales, getUserById, loginUser, getUserInfo, uploadImage } from "../controllers/userController.js";
import { upload } from "../controllers/userController.js";
const router = Router();

router.post("/", createUser);
router.post("/login", loginUser);
router.get("/login/:email?", getUserByEmail);
router.get("/user/:id?", getUserById);
router.get("/", getUsers);
router.put("/:id?", editUser);
router.put("/update/:id?", updateSales);
router.delete("/:id", deleteUser);
router.post("/img-user", upload.single('image'), uploadImage)

router.get("/user-info", getUserInfo);
// Adicione outras rotas: PUT, DELETE...

export default router;
