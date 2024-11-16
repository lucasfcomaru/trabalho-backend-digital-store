const express = require('express');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const UserRoutes = require('./UserRoutes');
const CategoriesRoutes = require('./CategoriesRoutes');
const ProductsRoutes = require('./ProductsRoutes');

const PrivateRoutes = express.Router();

PrivateRoutes.use(UserRoutes);
PrivateRoutes.use(CategoriesRoutes);
PrivateRoutes.use(ProductsRoutes);

module.exports = PrivateRoutes;