// Integração com o microsserviço de Estoque.
// Verificar se há estoque antes de fechar pedido e dar baixa após confirmação.
const fetch = require("node-fetch");

const BASE_URL = process.env.ESTOQUE_API_URL || "http://localhost:3004";

class EstoqueService {
  // GET /estoque/:idProduto -> deve retornar { idProduto, quantidade }
  static async verificar(idProduto) {
    try {
      const res = await fetch(`${BASE_URL}/estoque/${idProduto}`);
      if (!res.ok) return null;
      return await res.json();
    } catch (err) {
      console.error("Erro ao chamar EstoqueService.verificar:", err.message);
      return null;
    }
  }

  // POST /estoque/:idProduto/baixar  body: { quantidade }
  static async baixar(idProduto, quantidade) {
    try {
      const res = await fetch(`${BASE_URL}/estoque/${idProduto}/baixar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantidade })
      });
      return res.ok;
    } catch (err) {
      console.error("Erro ao chamar EstoqueService.baixar:", err.message);
      return false;
    }
  }
}

module.exports = EstoqueService;
