const express = require('express');
const PrivateRoutes = require('./src/routes/PrivateRoutes');
require('./src/database/syncforce');
// const RotasPublicas = require('./routes/RotasPublicas');

const host = 'localhost';
const port = 3000;

const app = express();
app.use(express.json());

// app.get('/', (request, response) => {
//     return response.send('Olá! Eu sou o NodeJS + Express');
// })

//Rotas Públicas
// app.use(RotasPublicas);
//Rotas Privadas
app.use(PrivateRoutes);

// app.put("/teste/:codigo", (request, response) => {
//     // querys
//     const query = request.query;
//     let dados = "Rota de testes " + query.nome + " - " + query.sobrenome;

//     // params
//     const params = request.params;
//     dados += "<br> Params: " + params.codigo;

//     // body
//     const body = request.body;
//     dados += "<br> Params: " + JSON.stringify(body);

//     return response.send(dados);
// });

app.listen(port, host, () => {
    console.log(`Servidor executando em http://${host}:${port}`);
    
});