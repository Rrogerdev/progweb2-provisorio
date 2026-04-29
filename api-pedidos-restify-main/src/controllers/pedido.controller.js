const prisma = require("../config/prisma");
const UsuariosService = require("../services/usuarios.service");
const EstoqueService = require("../services/estoque.service");

class PedidoController {
  // GET /pedidos
  static async get(req, res) {
    try {
      const pedidos = await prisma.pedido.findMany({
        include: { itens: true, pagamentos: true, enderecos: true },
        orderBy: { id: "desc" }
      });
      res.send(200, pedidos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao listar pedidos." });
    }
  }

  // POST /pedidos    body: { idUsuario }
  // Pega o carrinho do usuário, valida estoque, cria o pedido,
  // dá baixa no estoque e esvazia o carrinho.
  static async post(req, res) {
    try {
      const { idUsuario, total, itens } = req.body;
      if (!idUsuario) {
        return res.send(400, { message: "idUsuario é obrigatório." });
      }
      // Integração com Usuários
      // const usuario = await UsuariosService.buscarPorId(idUsuario);
      // if (!usuario) {
      //   return res.send(404, { message: "Usuário não encontrado." });
      // }
      // pega o carrinho
      const carrinho = await prisma.carrinho.findUnique({
        where: { idUsuario },
        include: { itens: true }
      });
      // if (!carrinho || carrinho.itens.length === 0) {
      //   return res.send(400, { message: "Carrinho vazio." });
      // }
      // Integração com Estoque: valida disponibilidade
      // for (const item of carrinho.itens) {
      //   const estoque = await EstoqueService.verificar(item.idProduto);
      //   if (!estoque || estoque.quantidade < item.quantidade) {
      //     return res.send(400, {
      //       message: `Estoque insuficiente para o produto ${item.idProduto}.`
      //     });
      //   }
      // }
      // calcula total
      // const total = carrinho.itens.reduce(
      //   (acc, it) => acc + Number(it.precoUnitario) * it.quantidade,
      //   0
      // );
      // cria pedido com seus itens
      console.log(total)
      const pedido = await prisma.pedido.create({
        data: {
          idUsuario,
          total,
          status: "pendente",
          itens: {
            // create: carrinho.itens.map(it => ({
            //   idProduto: it.idProduto,
            //   quantidade: it.quantidade,
            //   precoUnitario: it.precoUnitario
            // }))
          }
        },
        include: { itens: true }
      });
      // Integração com Estoque: dá baixa
      for (const item of carrinho.itens) {
        await EstoqueService.baixar(item.idProduto, item.quantidade);
      }
      // limpa carrinho
      await prisma.itemCarrinho.deleteMany({ where: { carrinhoId: carrinho.id } });
      res.send(201, pedido);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao criar pedido." });
    }
  }

  // PUT /pedidos/:id    body: { tracking?, status? }
  static async put(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { tracking, status } = req.body;
      const pedido = await prisma.pedido.update({
        where: { id },
        data: { tracking, status }
      });
      res.send(200, pedido);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao atualizar pedido." });
    }
  }

  // POST /pedidos/:id/cancelar
  static async cancel(req, res) {
    try {
      const id = parseInt(req.params.id);
      const pedido = await prisma.pedido.update({
        where: { id },
        data: { status: "cancelado" }
      });
      res.send(200, pedido);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao cancelar pedido." });
    }
  }

  // GET /pedidos/:id/tracking
  static async tracking(req, res) {
    try {
      const id = parseInt(req.params.id);
      const pedido = await prisma.pedido.findUnique({
        where: { id },
        select: { id: true, status: true, tracking: true }
      });
      if (!pedido) return res.send(404, { message: "Pedido não encontrado." });
      res.send(200, pedido);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar tracking." });
    }
  }

  // GET /pedidos/status/:status
  static async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const pedidos = await prisma.pedido.findMany({
        where: { status },
        include: { itens: true }
      });
      res.send(200, pedidos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar pedidos por status." });
    }
  }

  // GET /pedidos/usuario/:idUsuario/status/:status
  static async getByStatusIdUser(req, res) {
    try {
      const idUsuario = parseInt(req.params.idUsuario);
      const { status } = req.params;
      const pedidos = await prisma.pedido.findMany({
        where: { idUsuario, status },
        include: { itens: true }
      });
      res.send(200, pedidos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar pedidos do usuário por status." });
    }
  }

  // GET /pedidos/:id/status
  static async getStatus(req, res) {
    try {
      const id = parseInt(req.params.id);
      const pedido = await prisma.pedido.findUnique({
        where: { id },
        select: { id: true, status: true }
      });
      if (!pedido) return res.send(404, { message: "Pedido não encontrado." });
      res.send(200, pedido);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar status do pedido." });
    }
  }

  // PATCH /pedidos/:id/status    body: { status }
  static async patchStatus(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const pedido = await prisma.pedido.update({
        where: { id },
        data: { status }
      });
      res.send(200, pedido);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao atualizar status." });
    }
  }

  // GET /pedidos/:id/endereco
  static async getAdress(req, res) {
    try {
      const pedidoId = parseInt(req.params.id);
      const enderecos = await prisma.endereco.findMany({ where: { pedidoId } });
      res.send(200, enderecos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar endereços do pedido." });
    }
  }

  // POST /pedidos/:id/endereco
  static async postAdress(req, res) {
    try {
      const pedidoId = parseInt(req.params.id);
      const endereco = await prisma.endereco.create({
        data: { ...req.body, pedidoId }
      });
      res.send(201, endereco);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao cadastrar endereço." });
    }
  }

  // PUT /pedidos/:id/endereco/:idEndereco
  static async putAdress(req, res) {
    try {
      const id = parseInt(req.params.idEndereco);
      const endereco = await prisma.endereco.update({
        where: { id },
        data: req.body
      });
      res.send(200, endereco);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao atualizar endereço." });
    }
  }

  // DELETE /pedidos/:id/endereco/:idEndereco
  static async deleteAdress(req, res) {
    try {
      const id = parseInt(req.params.idEndereco);
      await prisma.endereco.delete({ where: { id } });
      res.send(204);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao remover endereço." });
    }
  }

  // GET /pedidos/usuario/:idUsuario
  // Endpoint pensado pra ser CONSUMIDO por outro microsserviço
  // (ex: o de Usuários pode mostrar quantos pedidos a pessoa fez).
  static async getByUsuario(req, res) {
    try {
      const idUsuario = parseInt(req.params.idUsuario);
      const pedidos = await prisma.pedido.findMany({
        where: { idUsuario },
        include: { itens: true },
        orderBy: { id: "desc" }
      });
      res.send(200, pedidos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar pedidos do usuário." });
    }
  }
}

module.exports = PedidoController;
