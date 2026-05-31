import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  findUserByEmail,
  createUser,
  createOrganization,
  createVolunteer
} from '../models/userModel.js';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

export async function register(req, res) {
  try {
    const { email, password, role, profile } = req.body;

    if (!email || !password || !role || !profile) {
      return res.status(400).json({ error: 'email, password, role e profile são obrigatórios' });
    }

    if (!['organization', 'volunteer'].includes(role)) {
      return res.status(400).json({ error: 'role deve ser organization ou volunteer' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: 'E-mail já cadastrado' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const user = await createUser({ email, password_hash, role });

    if (role === 'organization') {
      await createOrganization({
        user_id: user.id,
        name: profile.name,
        description: profile.description || null,
        website: profile.website || null,
        phone: profile.phone || null,
        address: profile.address || null,
        city: profile.city || null,
        state: profile.state || null,
        country: profile.country || null
      });
    } else {
      await createVolunteer({
        user_id: user.id,
        full_name: profile.full_name,
        bio: profile.bio || null,
        skills: profile.skills || null,
        interests: profile.interests || null,
        phone: profile.phone || null,
        city: profile.city || null,
        state: profile.state || null,
        country: profile.country || null
      });
    }

    return res.status(201).json({ message: 'Cadastro realizado com sucesso', userId: user.id });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor ao cadastrar usuário' });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'email e password são obrigatórios' });
    }

    const user = await findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: '8h'
    });

    return res.json({
      message: 'Login bem-sucedido',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erro no servidor ao fazer login' });
  }
}
