const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  try {
    const { name, email, password, role, bio } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado.' });
    }

    const user = await User.create({ name, email, password, role, bio });

    const { password: _, ...userData } = user.toJSON();

    return res.status(201).json({
      message: 'Usuário criado com sucesso.',
      user: userData,
      token: generateToken(user),
    });
  } catch (err) {
    console.error('Erro no registro:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios.' });
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const passwordMatch = await user.checkPassword(password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas.' });
    }

    const { password: _, ...userData } = user.toJSON();

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      user: userData,
      token: generateToken(user),
    });
  } catch (err) {
    console.error('Erro no login:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

const me = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId, {
      attributes: { exclude: ['password'] },
    });
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });
    return res.status(200).json(user);
  } catch (err) {
    console.error('Erro ao buscar usuário:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

// PUT /auth/profile — edita nome, bio e avatar do usuário autenticado
const updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar_url } = req.body;

    const user = await User.findByPk(req.userId);
    if (!user) return res.status(404).json({ error: 'Usuário não encontrado.' });

    await user.update({ name, bio, avatar_url });

    const { password: _, ...userData } = user.toJSON();
    return res.status(200).json({ message: 'Perfil atualizado.', user: userData });
  } catch (err) {
    console.error('Erro ao atualizar perfil:', err);
    return res.status(500).json({ error: 'Erro interno no servidor.' });
  }
};

module.exports = { register, login, me, updateProfile };