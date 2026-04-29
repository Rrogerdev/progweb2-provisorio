const prisma = require("../config/prisma");
const ProdutosService = require("../services/produtos.service");
const UsuariosService = require("../services/usuarios.service");

class CarrinhoController {
  // GET /carrinhos/:idUsuario
  static async get(req, res) {
    try {
      const idUsuario = parseInt(req.params.idUsuario);
      const carrinho = await prisma.carrinho.findUnique({
        where: { idUsuario },
        include: { itens: true }
      });
      if (!carrinho) {
        return res.send(404, { message: "Carrinho não encontrado." });
      }
      res.send(200, carrinho);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar carrinho." });
    }
  }

  // POST /carrinhos    body: { idUsuario }
  static async post(req, res) {
    try {
      const { idUsuario } = req.body;
      if (!idUsuario) {
        return res.send(400, { message: "idUsuario é obrigatório." });
      }
      // Integração com Usuários: garante que o usuário existe
      // const usuario = await UsuariosService.buscarPorId(idUsuario);
      // if (!usuario) {
      //   return res.send(404, { message: "Usuário não encontrado." });
      // }
      const carrinho = await prisma.carrinho.create({
        data: { idUsuario }
      });
      res.send(201, carrinho);
    } catch (error) {
      if (error.code === "P2002") {
        return res.send(409, { message: "Usuário já possui carrinho." });
      }
      console.error(error);
      res.send(500, { message: "Erro ao criar carrinho." });
    }
  }

  // PUT /carrinhos/:id   body: { itens: [{ idProduto, quantidade }] }
  // Substitui todos os itens do carrinho.
  static async put(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { itens } = req.body;
      if (!Array.isArray(itens)) {
        return res.send(400, { message: "itens deve ser um array." });
      }
      await prisma.itemCarrinho.deleteMany({ where: { carrinhoId: id } });
      for (const item of itens) {
        const produto = await ProdutosService.buscarPorId(item.idProduto);
        if (!produto) continue;
        await prisma.itemCarrinho.create({
          data: {
            carrinhoId: id,
            idProduto: item.idProduto,
            quantidade: item.quantidade,
            precoUnitario: produto.preco
          }
        });
      }
      const carrinho = await prisma.carrinho.findUnique({
        where: { id },
        include: { itens: true }
      });
      res.send(200, carrinho);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao atualizar carrinho." });
    }
  }

  // POST /carrinhos/:id/produto    body: { idProduto, quantidade }
  static async addProduct(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { idProduto, quantidade } = req.body;
      if (!idProduto || !quantidade) {
        return res.send(400, { message: "idProduto e quantidade são obrigatórios." });
      }
      // Integração com Produtos: pega o preço atual do produto
      const produto = await ProdutosService.buscarPorId(idProduto);
      if (!produto) {
        return res.send(404, { message: "Produto não encontrado." });
      }
      const item = await prisma.itemCarrinho.create({
        data: {
          carrinhoId: id,
          idProduto,
          quantidade,
          precoUnitario: produto.preco
        }
      });
      res.send(201, item);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao adicionar produto ao carrinho." });
    }
  }

  // DELETE /carrinhos/:id/produto/:idProduto
  static async deleteProduct(req, res) {
    try {
      const id = parseInt(req.params.id);
      const idProduto = parseInt(req.params.idProduto);
      const result = await prisma.itemCarrinho.deleteMany({
        where: { carrinhoId: id, idProduto }
      });
      if (result.count === 0) {
        return res.send(404, { message: "Produto não estava no carrinho." });
      }
      res.send(204);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao remover produto do carrinho." });
    }
  }
}

module.exports = CarrinhoController;
