const express = require('express');
const UserRoutes = require('./UserRoutes');
const CategoriesRoutes = require('./CategoriesRoutes');
const ProductsRoutes = require('./ProductsRoutes');
const AuthRoutes = require('./AuthRoutes');

const PrivateRoutes = express.Router();
const PublicRoutes = express.Router();

PrivateRoutes.use(UserRoutes);
PrivateRoutes.use(CategoriesRoutes);
PrivateRoutes.use(ProductsRoutes);

PublicRoutes.use(AuthRoutes);

module.exports = PrivateRoutes;