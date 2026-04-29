// ============================================================
// MOCK DOS OUTROS MICROSSERVIÇOS
// ------------------------------------------------------------
// Sobe 3 servidores Restify falsos pra simular Produtos (3001),
// Usuários (3002) e Estoque (3003) enquanto os colegas ainda
// não terminaram. Assim você consegue testar o fluxo completo
// do seu serviço de Pagamento sozinho.
//
// Como rodar:
//   npm run mocks
//
// Deixa esse terminal aberto e roda o `npm start` em outro.
// ============================================================

const restify = require("restify");

// ------------------------------------------------------------
// MOCK: Produtos :3001 (Renan)
// ------------------------------------------------------------
const produtosServer = restify.createServer({ name: "mock-produtos" });
produtosServer.use(restify.plugins.bodyParser());

const produtosFake = {
  1: { id: 1, nome: "Mouse Logitech G Pro", preco: 599.90 },
  2: { id: 2, nome: "Teclado Keychron K2", preco: 899.00 },
  5: { id: 5, nome: "Joystick Logitech X52 Pro", preco: 1299.00 }
};

produtosServer.get("/produtos/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const p = produtosFake[id];
  if (!p) return res.send(404, { message: "Produto não encontrado" });
  console.log(`[mock-produtos] GET /produtos/${id}`);
  return res.send(200, p);
});

produtosServer.listen(3001, () => {
  console.log("[mock-produtos] rodando em http://localhost:3001");
});

// ------------------------------------------------------------
// MOCK: Usuários :3002 (Mell)
// ------------------------------------------------------------
const usuariosServer = restify.createServer({ name: "mock-usuarios" });
usuariosServer.use(restify.plugins.bodyParser());

const usuariosFake = {
  1: { id: 1, nome: "Victor Santos", email: "victor@oxcart.dev" },
  2: { id: 2, nome: "Mell", email: "mell@senac.br" },
  3: { id: 3, nome: "Renan Gomes", email: "renan@senac.br" }
};

usuariosServer.get("/usuarios/:id", async (req, res) => {
  const id = parseInt(req.params.id);
  const u = usuariosFake[id];
  if (!u) return res.send(404, { message: "Usuário não encontrado" });
  console.log(`[mock-usuarios] GET /usuarios/${id}`);
  return res.send(200, u);
});

usuariosServer.listen(3002, () => {
  console.log("[mock-usuarios] rodando em http://localhost:3002");
});

// ------------------------------------------------------------
// MOCK: Estoque :3003 (Vitor)
// ------------------------------------------------------------
const estoqueServer = restify.createServer({ name: "mock-estoque" });
estoqueServer.use(restify.plugins.bodyParser());

const estoqueFake = { 1: 50, 2: 30, 5: 10 };

estoqueServer.get("/estoque/:idProduto", async (req, res) => {
  const id = parseInt(req.params.idProduto);
  if (estoqueFake[id] === undefined) {
    return res.send(404, { message: "Produto não está no estoque" });
  }
  console.log(`[mock-estoque] GET /estoque/${id} -> ${estoqueFake[id]}`);
  return res.send(200, { idProduto: id, quantidade: estoqueFake[id] });
});

estoqueServer.post("/estoque/:idProduto/baixar", async (req, res) => {
  const id = parseInt(req.params.idProduto);
  const qtd = req.body && req.body.quantidade;
  if (estoqueFake[id] === undefined) {
    return res.send(404, { message: "Produto não está no estoque" });
  }
  if (estoqueFake[id] < qtd) {
    return res.send(400, { message: "Estoque insuficiente" });
  }
  estoqueFake[id] -= qtd;
  console.log(`[mock-estoque] POST /estoque/${id}/baixar (-${qtd}) -> ${estoqueFake[id]}`);
  return res.send(200, { idProduto: id, quantidade: estoqueFake[id] });
});

estoqueServer.listen(3003, () => {
  console.log("[mock-estoque] rodando em http://localhost:3003");
});

console.log("\n--- mocks prontos. Rode `npm start` em outro terminal. ---\n");