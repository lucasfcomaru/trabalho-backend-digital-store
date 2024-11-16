const express = require('express');
const AuthController = require('../controllers/AuthController');

const AuthRoutes = express.Router();
const authController = new AuthController();

AuthRoutes.post('/v1/user/token', async (request, response) => {
    const body = request.body;
    const auth = new AuthController();
    const dados = await auth.login(body.email, body.password);

    if(dados.length){
        return response.json({
            data: dados,
            // token: token
        });
    }
});

module.exports = AuthRoutes;
