const express = require('express');
const UserRoutes = express.Router();
let userController = require('../controllers/UserController')

userController = new userController();

UserRoutes.get('/v1/user/:id', userController.listar);
UserRoutes.post('/v1/user', userController.criar);
UserRoutes.put('/v1/user/:id', userController.atualizar);
UserRoutes.delete('/v1/user/:id', userController.deletar);

module.exports = UserRoutes;