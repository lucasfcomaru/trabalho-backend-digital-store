const { Sequelize } = require("sequelize");

const connection = new Sequelize({
    dialect: "mysql",
    database: "digital_store",
    host: "localhost",
    username: "root",
    password: "admin",
    port: "3306",
});

module.exports = connection;