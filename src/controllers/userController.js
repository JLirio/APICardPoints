
import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt';  // Pacote para hashear senhas
import { google } from "googleapis";
import jwt from 'jsonwebtoken'; // Pacote para geração de tokens
import multer from "multer";
import fs from 'fs'
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const prisma = new PrismaClient()
const secretKey = "sua-chave-secreta"; // Deve ser um segredo seguro.

// Configuração do Multer para upload local antes de enviar para o Google Drive
export const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => cb(null, 'uploads/'),
        filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
    }),
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos PNG e JPEG são permitidos.'));
        }
    },
});

const keyPath = path.join(__dirname, '../../credentials.json'); // Caminho do arquivo JSON
const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ['https://www.googleapis.com/auth/drive.file'],  // Permissões necessárias
});

const drive = google.drive({ version: 'v3', auth });

// Função para fazer upload no Google Drive
export const uploadToGoogleDrive = async (filePath, fileName, folderId) => {
    
    const fileMetadata = {
        name: fileName,
        parents: [folderId],  // ID da pasta do Google Drive
    };
    const media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(filePath),
    };

    try {
        const file = await drive.files.create({
            resource: fileMetadata,
            media: media,
            fields: 'id, webViewLink',
        });

        console.log('File uploaded:', file.data);
        return file.data
    } catch (error) {
        console.error('Error uploading file:', error);
    }
};

export const uploadImage = async (req, res) => {
    console.log('>> upload');

    // Verifica se o arquivo foi enviado
    const file = req.file;
    if (!file) {
        return res.status(400).json({ message: 'Nenhum arquivo enviado.' });
    }

    console.log('Arquivo recebido:', file);

    try {
        const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID; // ID da pasta no Google Drive
        const driveResponse = await uploadToGoogleDrive(file.path, file.filename, folderId);

        // Excluir o arquivo local após o upload
        fs.unlinkSync(file.path);

        res.status(200).json({ imageUrl: driveResponse.webViewLink });
    } catch (error) {
        console.error('Erro no upload da imagem:', error);
        res.status(500).json({ message: 'Erro no upload da imagem.' });
    }
};




export const loginUser = async (req, res) => {
    const { email, password } = req.body;


    try {
        // Verificar se o usuário existe e recuperar as informações
        const user = await prisma.user.findFirst({
            where: {
                email: email
            }
        });
        console.log(user);
        if (!user) {
            return res.status(401).json({ message: 'Usuário ou senha incorretos.' });
        }

        // Verificar se a senha está correta
        const isPasswordValid = await bcrypt.compare(password, user.senha);

        if (!isPasswordValid) {
            console.log(email, "  ", password);
            return res.status(401).json({ message: 'Usuário ou senha incorretos.' });
        }

        // Gerar um token
        const token = jwt.sign(
            { id: user.id, email: user.email },  // Payload do token
            secretKey, // Chave secreta para assinatura
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        // Retornar o token e as informações do usuário
        res.status(200).json({
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                cargo: user.cargo,
                imgUser: user.imgUser,
                group: user.group,
                vendasTotais: user.vendasA + user.vendasB
            }
        });
    } catch (error) {
        console.error("Erro ao autenticar usuário:", error);
        res.status(500).json({ message: 'Erro interno no servidor.' });
    }
};

export const createUser = async (req, res) => {
    const { name, email, group, vendasA, vendasB, cargo, senha, imgUser } = req.body;

    try {
        // Hash da senha antes de salvar no banco
        const hashedPassword = await bcrypt.hash(senha, 10);

        // Criação do usuário no banco de dados
        const user = await prisma.user.create({
            data: {
                name,
                email,
                imgUser,
                group,
                vendasA,
                vendasB,
                vendasTotais: vendasA + vendasB, // Calcula o total das vendas
                cargo,
                senha: hashedPassword, // Armazena a senha hasheada
            },
        });

        res.status(201).json(user);
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        res.status(500).json({ message: 'Erro ao criar usuário. Tente novamente mais tarde.' });
    }
}

export const getUserInfo = async (req, res) => {
    console.log("entrou");

    const token = req.headers.authorization?.split(' ')[1]; // Obter o token da requisição
    console.log(token);

    if (!token) {
        return res.status(401).json({ message: 'Token não fornecido.' });
    }

    try {
        console.log("hahah");

        const decodedToken = jwt.verify(token, secretKey); // Decodificar o token
        const userId = decodedToken.id;

        // Buscar as informações do usuário no banco
        const user = await prisma.user.findUnique({
            where: { id: userId }
        });

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado.' });
        }

        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email,
            cargo: user.cargo,
            imgUser: user.imgUser,
            group: user.group,
            vendasTotais: user.vendasA + user.vendasB
        });
    } catch (error) {
        console.error("Erro ao verificar token ou buscar usuário:", error);
        res.status(500).json({ message: 'Erro ao recuperar informações do usuário.' });
    }
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
