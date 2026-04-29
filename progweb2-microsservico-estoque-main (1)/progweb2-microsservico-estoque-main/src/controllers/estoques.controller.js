const { PrismaClient } = require("@prisma/client/extension");
const prisma = require("../config/prisma");
const ProdutoService = require("../services/produtoService");

class EstoquesController {

  // GET /estoques
  static async listar(req, res) {
    try {
      console.log("--- Buscando estoques com relacionamentos completos ---");
      
      const estoques = await prisma.estoque.findMany({
        orderBy: { id: "asc" },
        include: {
          section: {
            include: {
              floor: {
                include: {
                  warehouse: true
                }
              }
            }
          }
        }
      });

      res.send(200, estoques);
      return;
    } catch (error) {
      console.error("DETALHE DO ERRO PRISMA NO LISTAR:", error);
      res.send(500, { 
        message: "Erro ao listar estoques.", 
        erroReal: error.message 
      });
      return;
    }
  }

  static async buscarPorId(req, res) {
    try {
      const id = Number(req.params.id);
      
      console.log(`--- Buscando estoque ID: ${id} ---`);

      const estoque = await prisma.estoque.findUnique({
        where: { id },
        include: {
          section: {
            include: {
              floor: {
                include: {
                  warehouse: true
                }
              }
            }
          }
        }
      });

      if (!estoque) {
        res.send(404, { message: "Estoque não encontrado." });
        return;
      }

      res.send(200, estoque);
      return;
    } catch (error) {
      console.error("ERRO AO BUSCAR POR ID:", error);
      res.send(500, { message: "Erro ao buscar estoque.", erroReal: error.message });
      return;
    }
  }

  static async buscarPorProdutoId(req, res) {
    try {
      const produtoId = Number(req.params.produtoId);
      
      console.log(`--- Buscando localizações para o Produto ID: ${produtoId} ---`);

      const estoques = await prisma.estoque.findMany({
        where: { produtoId },
        include: {
          section: {
            include: {
              floor: {
                include: {
                  warehouse: true
                }
              }
            }
          }
        }
      });

      if (estoques.length === 0) {
        res.send(404, { message: "Nenhum estoque encontrado para este produto." });
        return;
      }

      res.send(200, estoques);
      return;
    } catch (error) {
      console.error("ERRO AO BUSCAR POR PRODUTO ID:", error);
      res.send(500, { message: "Erro na busca por produto.", erroReal: error.message });
      return;
    }
  }

  static async criar(req, res) {
    try {
      const { produtoId, sectionId, quantidade, quantidadeMinima, observacao } = req.body;

      if (!produtoId || !sectionId || quantidade == null) {
        res.send(400, { message: "produtoId, sectionId e quantidade são obrigatórios." });
        return;
      }

      const produtoExisteNoCatalogo = await ProdutoService.buscarDadosProduto(Number(produtoId));

      if (!produtoExisteNoCatalogo) {
        res.send(404, { 
          message: `O produto com ID ${produtoId} não existe no Catálogo. Não é possível criar estoque para ele.` 
        });
        return;
      }

      const section = await prisma.section.findUnique({
        where: { id: Number(sectionId) }
      });

      if (!section) {
        res.send(404, { message: "Seção de estoque não encontrada no banco local." });
        return;
      }

      const novoEstoque = await prisma.estoque.create({
        data: {
          produtoId: Number(produtoId),
          sectionId: Number(sectionId),
          quantidade: Number(quantidade),
          quantidadeMinima: Number(quantidadeMinima || 0),
          observacao
        }
      });

      console.log("Estoque criado com sucesso após validar produto externo!");
      res.send(201, novoEstoque);
      return;

    } catch (error) {
      console.error("ERRO NO POST COM FETCH:", error);
      if (error.code === "P2002") {
        res.send(400, { message: "Já existe esse produto nessa seção." });
        return;
      }
      res.send(500, { message: "Erro ao cadastrar estoque.", erroReal: error.message });
      return;
    }
  }

  static async atualizar(req, res) {
    try {
      const id = Number(req.params.id);
      const dadosParaAtualizar = req.body;

      const existe = await prisma.estoque.findUnique({ where: { id } });
      if (!existe) {
        res.send(404, { message: "Estoque não encontrado." });
        return;
      }

      if (dadosParaAtualizar.quantidade !== undefined) dadosParaAtualizar.quantidade = Number(dadosParaAtualizar.quantidade);
      if (dadosParaAtualizar.quantidadeMinima !== undefined) dadosParaAtualizar.quantidadeMinima = Number(dadosParaAtualizar.quantidadeMinima);
      if (dadosParaAtualizar.sectionId !== undefined) dadosParaAtualizar.sectionId = Number(dadosParaAtualizar.sectionId);
      if (dadosParaAtualizar.produtoId !== undefined) dadosParaAtualizar.produtoId = Number(dadosParaAtualizar.produtoId);

      const estoqueAtualizado = await prisma.estoque.update({
        where: { id },
        data: dadosParaAtualizar,
        include: { section: true }
      });

      console.log(`Estoque ${id} atualizado com sucesso!`);
      res.send(200, estoqueAtualizado);
      return;
    } catch (error) {
      console.error("ERRO NO PATCH:", error);
      res.send(500, { message: "Erro ao atualizar estoque.", detalhe: error.message });
      return;
    }
  }

  static async deletar(req, res) {
    try {
      const id = Number(req.params.id);

      const existe = await prisma.estoque.findUnique({ where: { id } });
      
      if (!existe) {
        res.send(404, { message: "Estoque não encontrado ou já foi deletado." });
        return;
      }

      await prisma.estoque.delete({ where: { id } });
      
      res.send(204);
      return;
    } catch (error) {
      console.error("ERRO AO DELETAR:", error);
      res.send(500, { message: "Erro ao processar a exclusão." });
      return;
    }
  }
}

module.exports = EstoquesController;