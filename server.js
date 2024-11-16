require('dotenv').config();
const express = require('express');
const PrivateRoutes = require('./src/routes/PrivateRoutes');
const PublicRoutes = require('./src/routes/PublicRoutes');
require('./src/database/syncforce');

const host = 'localhost';
const port = 3000;

const app = express();
app.use(express.json());

//Rotas Privadas
app.use(PrivateRoutes);
//Rotas Públicas
app.use(PublicRoutes);

app.listen(port, host, () => {
    console.log(`Servidor executando em http://${host}:${port}`);
    
});