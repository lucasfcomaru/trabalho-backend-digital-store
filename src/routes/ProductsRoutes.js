const express = require("express");
const ProductsRoutes = express.Router();
let productsController = require("../controllers/ProductsController");

productsController = new productsController();

ProductsRoutes.get("/v1/product/search", productsController.listarProdutos);
ProductsRoutes.get("/v1/product/:id", productsController.informacaoProduto);
ProductsRoutes.post("/v1/product", productsController.criar);
ProductsRoutes.put("/v1/product/:id", productsController.atualizar);
ProductsRoutes.delete("/v1/product/:id", productsController.deletar);

module.exports = ProductsRoutes;
