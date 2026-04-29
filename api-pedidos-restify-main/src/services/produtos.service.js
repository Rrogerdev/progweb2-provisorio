// Integração com o microsserviço de Produtos.
// Usado para buscar o preço/dados do produto na hora de adicionar no carrinho.
const fetch = require("node-fetch");

const BASE_URL = process.env.PRODUTOS_API_URL || "http://localhost:3002";

class ProdutosService {
  static async buscarPorId(id) {
    try {
      const res = await fetch(`${BASE_URL}/produtos/${id}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("Erro ao chamar ProdutosService:", err.message);
      return null;
    }
  }
}

module.exports = ProdutosService;
