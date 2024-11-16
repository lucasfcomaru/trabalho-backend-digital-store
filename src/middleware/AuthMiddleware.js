const jwt = require('jsonwebtoken');

// Carregar a chave secreta do .env
const SECRET_KEY = process.env.SECRET_KEY;

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Extraí o token do cabeçalho Authorization

  if (!token) {
    return res.status(400).json({ message: 'Token não fornecido.' });
  }

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido.' });
    }

    req.user = user; // Adiciona as informações do usuário ao objeto da requisição
    next(); // Chama o próximo middleware ou controlador
  });
};

module.exports = { authenticateToken };
