import { ObjectId } from "mongodb";
import conectarAoBanco from "../config/dbConfig.js";

// Estabelece a conexão com o banco de dados usando a string de conexão fornecida no arquivo .env
const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

// Função assíncrona para recuperar todos os posts do banco de dados
export async function getTodosPosts() {
    // Acessa o banco de dados 'instabytes' usando a conexão estabelecida
    const db = conexao.db("instabytes");

    // Acessa a coleção 'posts' dentro do banco de dados
    const colecao = db.collection("posts");

    // Retorna todos os documentos da coleção 'posts' como um array
    return colecao.find().toArray();
}

// Função assíncrona para criar um novo post no banco de dados
export async function criarPost(novoPost) {
    // Acessa o banco de dados 'instabytes' usando a conexão estabelecida
    const db = conexao.db("instabytes");

    // Acessa a coleção 'posts' dentro do banco de dados
    const colecao = db.collection("posts");

    // Insere um novo post na coleção 'posts' e retorna a operação
    return colecao.insertOne(novoPost);
}

export async function atualizarPost(id, novoPost) {
    const db = conexao.db("instabytes");
    const colecao = db.collection("posts");
    const objID = ObjectId.createFromHexString(id);

    return colecao.updateOne({_id: new ObjectId(objID)}, {$set:novoPost});
}