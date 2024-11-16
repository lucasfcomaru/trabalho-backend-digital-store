const express = require('express');
const CategoriesRoutes = express.Router();
let categoriesController = require('../controllers/CategoriesController')

categoriesController = new categoriesController();

CategoriesRoutes.get('/v1/category/search', categoriesController.listarCategorias);
CategoriesRoutes.get('/v1/category/:id', categoriesController.informacaoCategoria);
CategoriesRoutes.post('/v1/category', categoriesController.criar);
CategoriesRoutes.put('/v1/category/:id', categoriesController.atualizar);
CategoriesRoutes.delete('/v1/category/:id', categoriesController.deletar);

module.exports = CategoriesRoutes;