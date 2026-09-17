import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import {
  registerSchema,
  loginSchema
} from '../schemas/userSchema.js';

// POST /auth/register
export const register = async (req, res) => {
  try {
    // Validação com Zod usando .parse()
    const validatedData = registerSchema.parse(req.body);

    // Verifica se o usuário já existe
    const userExists = await User.findOne({
      email: validatedData.email
    });

    if (userExists) {
      return res.status(409).json({
        error: 'E-mail já cadastrado no sistema.'
      });
    }

    // Criptografa a senha antes de salvar
    const hashedPassword = await bcrypt.hash(
      validatedData.password,
      10
    );

    // Salva o usuário no MongoDB
    const newUser = await User.create({
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword
    });

    // Não retorna a senha
    return res.status(201).json({
      message: 'Usuário registrado com sucesso!',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        errors: error.issues
      });
    }

    return res.status(500).json({
      error: 'Erro ao registrar usuário.',
      details: error.message
    });
  }
};


// POST /auth/login
export const login = async (req, res) => {
  try {
    // Validação com Zod usando .parse()
    const validatedData = loginSchema.parse(req.body);

    // Busca o usuário e inclui a senha, pois o model usa select: false
    const user = await User
      .findOne({ email: validatedData.email })
      .select('+password');

    if (!user) {
      return res.status(401).json({
        error: 'Credenciais inválidas.'
      });
    }

    // Compara a senha informada com a senha criptografada
    const isMatch = await bcrypt.compare(
      validatedData.password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        error: 'Credenciais inválidas.'
      });
    }

    // Gera o JWT com validade de 8 horas
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '8h'
      }
    );

    return res.status(200).json({
      message: 'Login realizado com sucesso!',
      token
    });

  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({
        errors: error.issues
      });
    }

    return res.status(500).json({
      error: 'Erro ao realizar login.',
      details: error.message
    });
  }
};
