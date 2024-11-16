const jwt = require('jsonwebtoken');
require('dotenv').config();
const MD5 = require('crypto-js/md5');
const UserModel = require('../models/UserModel'); 

class AuthController {
    async login(login, senha) {

        const dados = await UserModel.findAll({
            where: {
                email: login,
                password: MD5(senha, process.env.SECRET_KEY).toString()
            }
        })

        return dados;
    }
}

module.exports = AuthController;
