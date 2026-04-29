require("dotenv").config();

const restify = require("restify");
const CarrinhoController = require("./controllers/carrinho.controller");
const PedidoController = require("./controllers/pedido.controller");
const PagamentoController = require("./controllers/pagamento.controller");

const server = restify.createServer({
  name: "pedidos-service"
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

//-------------------------------------- CARRINHO ----------------------------------------------
server.get("/carrinhos/:idUsuario", CarrinhoController.get);
server.post("/carrinhos", CarrinhoController.post);
server.put("/carrinhos/:id", CarrinhoController.put);
server.post("/carrinhos/:id/produto", CarrinhoController.addProduct);
server.del("/carrinhos/:id/produto/:idProduto", CarrinhoController.deleteProduct);

//------------------------------------- PEDIDOS -----------------------------------------------
server.get("/pedidos", PedidoController.get);
server.post("/pedidos", PedidoController.post);

server.get("/pedidos/status/:status", PedidoController.getByStatus);
server.get("/pedidos/usuario/:idUsuario/status/:status", PedidoController.getByStatusIdUser);
server.get("/pedidos/usuario/:idUsuario", PedidoController.getByUsuario);

server.get("/pedidos/:id/tracking", PedidoController.tracking);
server.get("/pedidos/:id/status", PedidoController.getStatus);
server.patch("/pedidos/:id/status", PedidoController.patchStatus);
server.post("/pedidos/:id/cancelar", PedidoController.cancel);
server.get("/pedidos/:id/endereco", PedidoController.getAdress);
server.post("/pedidos/:id/endereco", PedidoController.postAdress);
server.put("/pedidos/:id/endereco/:idEndereco", PedidoController.putAdress);
server.del("/pedidos/:id/endereco/:idEndereco", PedidoController.deleteAdress);

server.put("/pedidos/:id", PedidoController.put);


//------------------------------------ PAGAMENTOS -----------------------------------------------
server.get("/pagamentos", PagamentoController.get);
server.post("/pagamentos", PagamentoController.post);

server.get("/pagamentos/data/:data", PagamentoController.getByDate);
server.get("/pagamentos/metodo/:metodo", PagamentoController.getPaymentMethod);
server.get("/pagamentos/bandeira/:bandeira", PagamentoController.getFlag);
server.get("/pagamentos/pedido/:pedidoId", PagamentoController.getByOrder);
server.get("/pagamentos/status/:status", PagamentoController.getByStatus);

server.get("/pagamentos/:id/status", PagamentoController.getStatus);
server.patch("/pagamentos/:id/status", PagamentoController.patchStatus);
server.get("/pagamentos/:id/endereco", PagamentoController.getAdress);
server.post("/pagamentos/:id/endereco", PagamentoController.postAdress);
server.put("/pagamentos/:id/endereco/:idEndereco", PagamentoController.putAdress);
server.patch("/pagamentos/:id/endereco/:idEndereco/status", PagamentoController.patchAdressStatus);

server.get("/pagamentos/:id", PagamentoController.getById);
server.put("/pagamentos/:id", PagamentoController.put);

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`${server.name} rodando em ${server.url}`);
});