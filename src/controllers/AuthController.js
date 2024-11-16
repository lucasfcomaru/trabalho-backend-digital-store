const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const UserModel = require('./models/UserModel');  

const SECRET_KEY = 'seu-segredo-aqui'; // Altere isso para algo seguro

// Função para gerar o token
const generateToken = (userId) => {
  const payload = { id: userId }; // A informação que você quer codificar no token
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '1h' }); // Token com validade de 1 hora
};

// Endpoint para gerar o token
const generateTokenEndpoint = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ where: { email } });
    if (!user) {
      return res.status(400).json({ message: 'Email ou senha incorretos.' });
    }

    // Verificar se a senha fornecida é a mesma que a armazenada
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'Email ou senha incorretos.' });
    }

    // Gerar o token JWT
    const token = generateToken(user.id);
    return res.json({ token });
  } catch (error) {
    return res.status(400).json({ message: 'Erro ao gerar o token.', error: error.message });
  }
};

module.exports = { generateTokenEndpoint };