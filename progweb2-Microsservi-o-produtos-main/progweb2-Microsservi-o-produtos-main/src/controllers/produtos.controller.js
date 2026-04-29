const prisma = require("../config/prisma");


// 🔗 INTEGRAÇÃO COM ESTOQUE
async function getEstoqueByProdutoID(produtoId) {
  try {
    const response = await fetch(`http://localhost:3003/estoques/${produtoId}`);

    if (!response.ok) {
      return { mensagem: "Estoque não encontrado" };
    }

    return await response.json();
  } catch (error) {
    return { mensagem: "Serviço de estoque offline" };
  }
}

// ✅ GET TODOS (SÓ ATIVOS)
async function getProdutos(req, res) {
  try {
    const produtos = await prisma.produto.findMany({
      where: { status: 1 }
    });

    res.send(produtos);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

// ✅ GET POR ID + ESTOQUE
async function getProdutoByID(req, res) {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.findFirst({
      where: {
        id: Number(id),
        status: 1
      }
    });

    if (!produto) {
      return res.send(404, { error: "Produto não encontrado" });
    }

    const estoque = await getEstoqueByProdutoID(id);

    res.send({ produto, estoque });
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

// ✅ CREATE
async function createProduto(req, res) {
  try {
    if (!req.body || !req.body.nome || !req.body.preco) {
      return res.send(400, { error: "nome e preco são obrigatórios" });
    }

    const {
      nome,
      preco,
      descricao,
      categoria,
      marca,
      tamanho,
      genero
    } = req.body;

    const produto = await prisma.produto.create({
      data: {
        nome,
        preco,
        descricao,
        categoria,
        marca,
        tamanho,
        genero
      }
    });

    res.send(201, produto);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

// ✅ UPDATE (PATCH)
async function patchProduto(req, res) {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.update({
      where: { id: Number(id) },
      data: req.body
    });

    res.send(produto);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

// ✅ DELETE (SOFT DELETE)
async function deleteProdutoById(req, res) {
  try {
    const { id } = req.params;

    await prisma.produto.update({
      where: { id: Number(id) },
      data: { status: 0 }
    });

    res.send({ message: "Produto desativado" });
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

// 🔍 FILTROS (SÓ ATIVOS)

async function getByCategoria(req, res) {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        categoria: req.params.categoria,
        status: 1
      }
    });
    res.send(produtos);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

async function getByName(req, res) {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        nome: { contains: req.params.nome },
        status: 1
      }
    });
    res.send(produtos);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

async function getByPrice(req, res) {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        preco: Number(req.params.preco),
        status: 1
      }
    });
    res.send(produtos);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

async function getByPostDate(req, res) {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        createdAt: new Date(req.params.data),
        status: 1
      }
    });
    res.send(produtos);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

async function getByTam(req, res) {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        tamanho: req.params.tamanho,
        status: 1
      }
    });
    res.send(produtos);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

async function getByGender(req, res) {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        genero: req.params.genero,
        status: 1
      }
    });
    res.send(produtos);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

async function getByBrand(req, res) {
  try {
    const produtos = await prisma.produto.findMany({
      where: {
        marca: req.params.marca,
        status: 1
      }
    });
    res.send(produtos);
  } catch (error) {
    console.log(error);
    res.send(500, { error: error.message });
  }
}

module.exports = {
  getProdutos,
  getProdutoByID,
  createProduto,
  patchProduto,
  deleteProdutoById,
  getByCategoria,
  getByName,
  getByPrice,
  getByPostDate,
  getByTam,
  getByGender,
  getByBrand
};