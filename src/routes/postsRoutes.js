import express from "express";
import multer from "multer";
import { listarPosts, postarNovoPost, uploadImagem, atualizarNovoPost } from "../controllers/postsController.js";
import cors from "cors";

const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

// Importa o módulo 'multer' para gerenciar upload de arquivos
const storage = multer.diskStorage({
    // Configura o destino dos arquivos enviados
    destination: function (req, file, cb) {
        // Define o diretório onde os arquivos serão salvos
        cb(null, 'uploads/');
    },
    // Configura o nome do arquivo enviado
    filename: function (req, file, cb) {
        // Define o nome do arquivo como o nome original enviado
        cb(null, file.originalname);
    }
});

// Cria uma instância do multer com configurações de destino e armazenamento personalizadas
const upload = multer({ dest: "./uploads", storage });

// Define as rotas para a aplicação express
const routes = (app) => {
    // Habilita o uso do middleware para parsear JSON em requisições
    app.use(express.json());
    app.use(cors(corsOptions));
    // Define uma rota GET para listar posts, chamando a função 'listarPosts'
    app.get("/posts", listarPosts);
    // Define uma rota POST para adicionar um novo post, chamando a função 'postarNovoPost'
    app.post("/posts", postarNovoPost);
    // Define uma rota POST para fazer upload de uma imagem, chamando a função 'uploadImagem'
    // Utiliza o middleware 'upload.single' para processar um único arquivo enviado no campo "imagem"
    app.post("/upload", upload.single("imagem"), uploadImagem);

    app.put("/upload/:id", atualizarNovoPost);
}

// Exporta as rotas para serem utilizadas em outros módulos
export default routes;