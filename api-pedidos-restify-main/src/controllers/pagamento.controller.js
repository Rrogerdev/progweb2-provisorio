const prisma = require("../config/prisma");

class PagamentoController {
  // GET /pagamentos
  static async get(req, res) {
    try {
      const pagamentos = await prisma.pagamento.findMany({
        include: { enderecos: true },
        orderBy: { id: "desc" }
      });
      res.send(200, pagamentos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao listar pagamentos." });
    }
  }

  // POST /pagamentos    body: { pedidoId, metodo, bandeira?, valor }
  static async post(req, res) {
    try {
      const { pedidoId, metodo, bandeira, valor } = req.body;
      if (!pedidoId || !metodo || valor === undefined) {
        return res.send(400, { message: "pedidoId, metodo e valor são obrigatórios." });
      }
      const pedido = await prisma.pedido.findUnique({ where: { id: pedidoId } });
      if (!pedido) return res.send(404, { message: "Pedido não encontrado." });

      const pagamento = await prisma.pagamento.create({
        data: { pedidoId, metodo, bandeira, valor, status: "pendente" }
      });
      res.send(201, pagamento);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao criar pagamento." });
    }
  }

  // PUT /pagamentos/:id
  static async put(req, res) {
    try {
      const id = parseInt(req.params.id);
      const pagamento = await prisma.pagamento.update({
        where: { id },
        data: req.body
      });
      res.send(200, pagamento);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao atualizar pagamento." });
    }
  }

  // GET /pagamentos/:id
  static async getById(req, res) {
    try {
      const id = parseInt(req.params.id);
      const pagamento = await prisma.pagamento.findUnique({
        where: { id },
        include: { enderecos: true }
      });
      if (!pagamento) return res.send(404, { message: "Pagamento não encontrado." });
      res.send(200, pagamento);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar pagamento." });
    }
  }

  // GET /pagamentos/pedido/:pedidoId
  static async getByOrder(req, res) {
    try {
      const pedidoId = parseInt(req.params.pedidoId);
      const pagamentos = await prisma.pagamento.findMany({ where: { pedidoId } });
      res.send(200, pagamentos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar pagamentos do pedido." });
    }
  }

  // GET /pagamentos/status/:status
  static async getByStatus(req, res) {
    try {
      const { status } = req.params;
      const pagamentos = await prisma.pagamento.findMany({ where: { status } });
      res.send(200, pagamentos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar pagamentos por status." });
    }
  }

  // GET /pagamentos/:id/status
  static async getStatus(req, res) {
    try {
      const id = parseInt(req.params.id);
      const pagamento = await prisma.pagamento.findUnique({
        where: { id },
        select: { id: true, status: true }
      });
      if (!pagamento) return res.send(404, { message: "Pagamento não encontrado." });
      res.send(200, pagamento);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar status do pagamento." });
    }
  }

  // GET /pagamentos/data/:data    (formato esperado: YYYY-MM-DD)
  static async getByDate(req, res) {
    try {
      const data = req.params.data;
      const inicio = new Date(`${data}T00:00:00`);
      const fim = new Date(`${data}T23:59:59`);
      const pagamentos = await prisma.pagamento.findMany({
        where: { createdAt: { gte: inicio, lte: fim } }
      });
      res.send(200, pagamentos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar pagamentos por data." });
    }
  }

  // GET /pagamentos/metodo/:metodo
  static async getPaymentMethod(req, res) {
    try {
      const { metodo } = req.params;
      const pagamentos = await prisma.pagamento.findMany({ where: { metodo } });
      res.send(200, pagamentos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar pagamentos por método." });
    }
  }

  // GET /pagamentos/bandeira/:bandeira
  static async getFlag(req, res) {
    try {
      const { bandeira } = req.params;
      const pagamentos = await prisma.pagamento.findMany({ where: { bandeira } });
      res.send(200, pagamentos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar pagamentos por bandeira." });
    }
  }

  // GET /pagamentos/:id/endereco
  static async getAdress(req, res) {
    try {
      const pagamentoId = parseInt(req.params.id);
      const enderecos = await prisma.endereco.findMany({ where: { pagamentoId } });
      res.send(200, enderecos);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao buscar endereço do pagamento." });
    }
  }

  // POST /pagamentos/:id/endereco
  static async postAdress(req, res) {
    try {
      const pagamentoId = parseInt(req.params.id);
      const endereco = await prisma.endereco.create({
        data: { ...req.body, pagamentoId }
      });
      res.send(201, endereco);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao cadastrar endereço." });
    }
  }

  // PUT /pagamentos/:id/endereco/:idEndereco
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

  // PATCH /pagamentos/:id/endereco/:idEndereco/status    body: { status }
  static async patchAdressStatus(req, res) {
    try {
      const id = parseInt(req.params.idEndereco);
      const { status } = req.body;
      const endereco = await prisma.endereco.update({
        where: { id },
        data: { status }
      });
      res.send(200, endereco);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao atualizar status do endereço." });
    }
  }

  // PATCH /pagamentos/:id/status    body: { status }
  static async patchStatus(req, res) {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      const pagamento = await prisma.pagamento.update({
        where: { id },
        data: { status }
      });
      res.send(200, pagamento);
    } catch (error) {
      console.error(error);
      res.send(500, { message: "Erro ao atualizar status do pagamento." });
    }
  }
}

module.exports = PagamentoController;
