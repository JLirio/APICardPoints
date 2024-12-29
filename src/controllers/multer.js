import multer from 'multer';
import path from 'path';

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Pasta onde as imagens serão salvas temporariamente
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const allowedMimeTypes = ['image/jpeg', 'image/png'];
        if (allowedMimeTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Apenas arquivos PNG e JPEG são permitidos.'));
        }
    }
});

export { upload };
