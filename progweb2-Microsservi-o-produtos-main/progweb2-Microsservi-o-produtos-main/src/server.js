const restify = require("restify");
const ProdutosController = require("./controllers/produtos.controller");

const server = restify.createServer({
  name: "api-produtos-restify"
});

server.use(restify.plugins.queryParser());
server.use(restify.plugins.bodyParser());

// 🔥 CRUD
server.get("/produtos", ProdutosController.getProdutos);
server.get("/produtos/:id", ProdutosController.getProdutoByID);
server.post("/produtos", ProdutosController.createProduto);
server.patch("/produtos/:id", ProdutosController.patchProduto);
server.del("/produtos/:id", ProdutosController.deleteProdutoById);

// 🔍 FILTROS (FALTAVAM)
server.get("/produtos/categoria/:categoria", ProdutosController.getByCategoria);
server.get("/produtos/nome/:nome", ProdutosController.getByName);
server.get("/produtos/preco/:preco", ProdutosController.getByPrice);
server.get("/produtos/data/:data", ProdutosController.getByPostDate);
server.get("/produtos/tamanho/:tamanho", ProdutosController.getByTam);
server.get("/produtos/genero/:genero", ProdutosController.getByGender);
server.get("/produtos/marca/:marca", ProdutosController.getByBrand);

// PORTA
const PORT = 3001;

server.listen(PORT, () => {
  console.log(`${server.name} rodando em ${server.url}`);
});