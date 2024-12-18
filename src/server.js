// import express from "express";
// import cors from 'cors';
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient()
// const app = express()

// app.use(express.json())
// app.use(cors())  

// app.post('/usuarios', async (req, res) => {
//     await prisma.user.create({
//         data: {
//             name: req.body.name,
//             email: req.body.email,
//             imgUser: req.body.imgUser,
//             group: req.body.group,
//             vendasA: req.body.vendasA,
//             vendasB: req.body.vendasB,
//             vendasTotais: 0,
//             cargo: req.body.cargo,
//             senha: req.body.senha

//         }
//     })

//     res.status(201).json(req.body)
// })

// app.put('/usuarios/:id', async (req, res) => {
//     await prisma.user.update({
//         where: {
//             id: req.params.id
//         },
//         data: {
//             name: req.body.name,
//             email: req.body.email,
//             imgUser: req.body.imgUser,
//             group: req.body.group,
//             vendasA: req.body.vendasA,
//             vendasB: req.body.vendasB,
//             vendasTotais: req.body.vendasB + req.body.vendasA,
//             cargo: req.body.cargo
//         }
//     })

//     res.status(201).json(req.body)
// })

// app.get('/usuarios', async (req, res) => {
//     let users = []
//     if (req.query) {
//         users = await prisma.user.findMany({
//             where: {
//                 name: req.query.name,
//                 id: req.query.id,
//                 email: req.query.email,
//                 group: req.query.group
//             }
//         })
//     } else {
//         users = await prisma.user.findMany()
//     }

//     res.status(200).json(users)

// })


// app.get('/usuarios/:id?', async (req, res) => {
//     let users = []
//     if (req.query) {
//         users = await prisma.user.findFirst({
//             where: {
//                 id: req.query.id,
//             }
//         })
//     } else {
//         users = await prisma.user.findMany()
//     }

//     res.status(200).json(users)

// })


// app.delete('/usuarios/:id', async (req, res) => {
//     await prisma.user.delete({
//         where: {
//             id: req.params.id
//         }
//     })

//     res.status(200).json({ message: "Usuario deletado com sucesso!" })
// })


// app.listen(3000)


// //cardPoints cardPoints





import app from "./app.js"; // Importa o app configurado com as rotas

const PORT = 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
});
