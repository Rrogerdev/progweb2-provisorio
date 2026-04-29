const restify = require("restify"); 
const EstoquesController = require("./controllers/estoques.controller"); 


console.log("Controller carregado:", EstoquesController);

const server = restify.createServer({ 
  name: "api-estoques-restify" 
}); 

server.use(restify.plugins.queryParser()); 
server.use(restify.plugins.bodyParser()); 


if (EstoquesController && EstoquesController.listar) {
    server.get("/estoques", EstoquesController.listar);
    server.get("/estoques/produto/:produtoId", EstoquesController.buscarPorProdutoId);
    server.get("/estoques/:id", EstoquesController.buscarPorId);
    server.post("/estoques", EstoquesController.criar);
    server.patch("/estoques/:id", EstoquesController.atualizar);
    server.del("/estoques/:id", EstoquesController.deletar);
} else {
    console.error("ERRO CRÍTICO: As funções do EstoquesController não foram encontradas!");
    process.exit(1); 
}

// tratamento global de erro
server.on("restifyError", (req, res, err, callback) => {
  console.error(err);
  return callback();
});

const PORT = 3003; 
server.listen(PORT, () => { 
  console.log(`${server.name} rodando em ${server.url}`); 
});