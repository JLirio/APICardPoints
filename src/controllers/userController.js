
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient()


export const createUser = async (req, res) => {
    const user = await prisma.user.create({
        data: {
            name: req.body.name,
            email: req.body.email,
            imgUser: req.body.imgUser,
            group: req.body.group,
            vendasA: req.body.vendasA,
            vendasB: req.body.vendasB,
            vendasTotais: 0,
            cargo: req.body.cargo,
            senha: req.body.senha
        }
    });
    res.status(201).json(user);
};

export const getUsers = async (req, res) => {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
};

export const getUserByEmail = async (req, res) => {
    
    console.log(req.query);
    const users = await prisma.user.findFirst({
        where: {
            email: req.query.email
        }
    });
    res.status(200).json(users);
};

export const getUserById = async (req, res) => {
    console.log("ta indo");
    console.log(req.query);
    const users = await prisma.user.findFirst({
        where: {
            id: req.query.id
        }
    });
    res.status(200).json(users);
};


export const deleteUser = async (req, res) => {
    await prisma.user.delete({
        where: {
            id: req.params.id
        }
    })

    res.status(200).json({ message: "Usuario deletado com sucesso!" })
};

export const editUser = async (req, res) => {
    await prisma.user.update({
                where: {
                    id: req.params.id
                },
                data: {
                    name: req.body.name,
                    email: req.body.email,
                    imgUser: req.body.imgUser,
                    group: req.body.group,
                    vendasA: req.body.vendasA,
                    vendasB: req.body.vendasB,
                    vendasTotais: req.body.vendasB + req.body.vendasA,
                    cargo: req.body.cargo
                }
            })
        
            res.status(201).json(req.body)
};

// Outras funções: updateUser, deleteUser...
