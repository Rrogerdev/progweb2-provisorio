class ProdutoService {
  static async buscarDadosProduto(produtoId) {
    try {
      const url = `http://localhost:3001/produtos/${produtoId}`;
      
      console.log(`--- Integrando: Consultando produto ${produtoId} no catálogo ---`);
      
      const resposta = await fetch(url);

      if (resposta.ok) {
        const dadosProduto = await resposta.json();
        return dadosProduto; // Retorna os dados se o produto existir
      }

      return null; // Retorna null se o produto não existir (404)
    } catch (error) {
      console.error("ERRO DE CONEXÃO: O serviço de produtos está offline ou a URL está errada.");
      return null;
    }
  }
}

module.exports = ProdutoService;