import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

import {
    registerSchema,
    loginSchema,
    updateUserSchema,
    idSchema
} from '../schemas/userSchema.js';

// Cadastrar usuário
export const createUser = async (req, res) => {
    try {
        // Validação com Zod
        const data = registerSchema.parse(req.body);

        const existingUser = await User.findOne({
            email: data.email
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'E-mail já cadastrado.'
            });
        }

        // Criptografa a senha
        const hashedPassword = await bcrypt.hash(
            data.password,
            10
        );

        const user = await User.create({
            name: data.name,
            email: data.email,
            password: hashedPassword
        });

        return res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.issues
            });
        }

        return res.status(500).json({
            error: 'Erro ao criar usuário.',
            details: error.message
        });
    }
};

// Login
export const login = async (req, res) => {
    try {
        // Validação com Zod
        const data = loginSchema.parse(req.body);

        const user = await User
            .findOne({ email: data.email })
            .select('+password');

        if (!user) {
            return res.status(401).json({
                error: 'Credenciais inválidas.'
            });
        }

        const passwordValid = await bcrypt.compare(
            data.password,
            user.password
        );

        if (!passwordValid) {
            return res.status(401).json({
                error: 'Credenciais inválidas.'
            });
        }

        // Geração do JWT
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return res.status(200).json({
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.issues
            });
        }

        return res.status(500).json({
            error: 'Erro ao fazer login.',
            details: error.message
        });
    }
};

// Listar todos os usuários
export const getAllUsers = async (req, res) => {
    try {
        const users = await User
            .find()
            .select('-password');

        return res.status(200).json(users);

    } catch (error) {
        return res.status(500).json({
            error: 'Erro ao buscar usuários.',
            details: error.message
        });
    }
};

// Buscar usuário por ID
export const getUserById = async (req, res) => {
    try {
        // Validação do ID
        const { id } = idSchema.parse(req.params);

        const user = await User
            .findById(id)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado.'
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.issues
            });
        }

        return res.status(500).json({
            error: 'Erro ao buscar usuário.',
            details: error.message
        });
    }
};

// Atualizar usuário
export const updateUser = async (req, res) => {
    try {
        // Validação do ID
        const { id } = idSchema.parse(req.params);

        // Validação dos dados
        const updates = updateUserSchema.parse(req.body);

        // Criptografa a nova senha, caso tenha sido enviada
        if (updates.password) {
            updates.password = await bcrypt.hash(
                updates.password,
                10
            );
        }

        const user = await User.findByIdAndUpdate(
            id,
            updates,
            {
                new: true,
                runValidators: true
            }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado.'
            });
        }

        return res.status(200).json(user);

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.issues
            });
        }

        return res.status(400).json({
            error: 'Erro ao atualizar usuário.',
            details: error.message
        });
    }
};

// Deletar usuário
export const deleteUser = async (req, res) => {
    try {
        // Validação do ID
        const { id } = idSchema.parse(req.params);

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({
                error: 'Usuário não encontrado.'
            });
        }

        return res.status(200).json({
            message: 'Usuário removido com sucesso.'
        });

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                error: 'Erro ao remover usuário.',
                details: error.message
            });
        }

        return res.status(500).json({
            error: 'Erro ao remover usuário.',
            details: error.message
        });
    }
};
