const connection = require("../config/connection");

// Chamando os arquivos para sincronizar
require("../models/UserModel");
require("../models/CategoriesModel");
require("../models/ProductsModel");

//Força a criação de tabelas novas
connection.sync({force: true});