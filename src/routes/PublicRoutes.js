const express = require('express');
const AuthRoutes = require('./AuthRoutes');

const PublicRoutes = express.Router();

PublicRoutes.use(AuthRoutes);

module.exports = PublicRoutes;