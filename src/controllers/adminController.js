
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()

export const createAdmin = async (req, res) => {
    const admin = await prisma.AdminGov.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            senha: req.body.senha
        }
    });
    res.status(201).json(admin);
};

export const getAdmins = async (req, res) => {
    const admins = await prisma.AdminGov.findMany();
    res.status(200).json(admins);
};
