import { getTodosPosts, criarPost,atualizarPost, excluirPost} from "../models/postsModels.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/geminiService.js";

// Função assíncrona para listar todos os posts
export async function listarPosts(req, res) {
    // Chama a função 'getTodosPosts' para recuperar todos os posts e aguarda a resposta
    const posts =  await getTodosPosts();

    // Retorna a lista de posts com status 200 (OK) no formato JSON
    res.status(200).json(posts);
}

// Função assíncrona para criar um novo post
export async function postarNovoPost(req, res) {
    // Extrai os dados do novo post do corpo da requisição
    const novoPost = req.body;

    try {
        // Chama a função 'criarPost' para criar o post no banco de dados e aguarda a resposta
        const postCriado = await criarPost(novoPost);

        // Retorna o novo post com status 200 (OK) no formato JSON
        res.status(200).json(novoPost);
    } catch(erro) {
        // Em caso de erro, imprime a mensagem de erro no console
        console.error(erro.message);

        // Retorna uma resposta de erro com status 500 (erro no servidor) e uma mensagem de falha
        res.status(500).json({"Erro":"Falha na requisicao"});
    }
}

// Função assíncrona para fazer upload de uma imagem e criar um post relacionado
export async function uploadImagem(req, res) {
    // Cria um objeto 'novoPost' com os dados da imagem, com descrição e texto alternativo vazios
    const novoPost = {
        descricao: "",  // Descrição do post (vazia)
        imgUrl: req.file.originalname,  // Nome original da imagem recebida
        alt: ""  // Texto alternativo (vazio)
    }

    try {
        // Chama a função 'criarPost' para salvar o novo post no banco de dados e aguarda a resposta
        const postCriado = await criarPost(novoPost);

        // Define o caminho atualizado para a imagem com o ID gerado para o post
        const imagemAtualizada = `uploads/${postCriado.insertedId}.png`;

        // Move o arquivo da imagem para o diretório de uploads, renomeando o arquivo com o ID do post
        fs.renameSync(req.file.path, imagemAtualizada);

        // Retorna o post criado com status 200 (OK) no formato JSON
        res.status(200).json(postCriado);
    } catch(erro) {
        // Em caso de erro, imprime a mensagem de erro no console
        console.error(erro.message);

        // Retorna uma resposta de erro com status 500 (erro no servidor) e uma mensagem de falha
        res.status(500).json({"Erro":"Falha na requisicao"});
    }
}

export async function atualizarNovoPost(req, res) {
    const id = req.params.id;
    const urlImagem = `http://localhost:3000/${id}.png`
    try {
        //const imgBuffer = fs.readFileSync(`uploads/${id}.png`)
        //const descricao = await gerarDescricaoComGemini(imgBuffer)
        const post = {
            imgUrl: urlImagem,
            descricao: req.body.descricao,
            alt: req.body.alt
        }
        const postCriado = await atualizarPost(id, post);
        res.status(200).json(post);
    } catch(erro) {
        console.error(erro.message);
        res.status(500).json({"Erro":"Falha na requisicao"});
    }
}


export async function deletarPost(req, res) {
    const { id } = req.params; // Obtém o ID do post a ser excluído dos parâmetros da URL

    try {
        // Chama a função 'excluirPost' para remover o post do banco de dados
        const resultado = await excluirPost(id);

        // Verifica se o post foi encontrado e excluído
        if (resultado.deletedCount === 0) {
            return res.status(404).json({ mensagem: "Post não encontrado" });
        }

        // Retorna uma mensagem de sucesso
        res.status(200).json({ mensagem: "Post excluído com sucesso!" });
    } catch (erro) {
        // Em caso de erro, imprime a mensagem de erro no console
        console.error(erro.message);

        // Retorna uma resposta de erro com status 500 (erro no servidor)
        res.status(500).json({ erro: "Falha na exclusão do post" });
    }
}