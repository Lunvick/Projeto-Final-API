import UserHistory from '../models/UserHistory.js';

import {
    historySchema,
    updateHistorySchema,
    historyIdSchema
} from '../schemas/userHistorySchema.js';

// Criar registro de histórico
export const createUserHistory = async (req, res) => {
    try {
        // Garante que o histórico pertence ao usuário autenticado
        const dataToValidate = {
            ...req.body,
            user: req.user.id
        };

        // Validação do Zod usando .parse()
        const data = historySchema.parse(dataToValidate);

        const newHistory = await UserHistory.create(data);

        return res.status(201).json(newHistory);

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.issues
            });
        }

        return res.status(400).json({
            error: 'Erro ao criar histórico',
            details: error.message
        });
    }
};

// Listar histórico
// Usuário comum vê apenas o seu; Admin vê todos
export const getAllUserHistories = async (req, res) => {
    try {
        const filter = req.user?.role === 'admin'
            ? {}
            : { user: req.user.id };

        const histories = await UserHistory
            .find(filter)
            .populate('user', 'name email')
            .populate('episode', 'title duration');

        return res.status(200).json(histories);

    } catch (error) {
        return res.status(500).json({
            error: 'Erro ao buscar histórico',
            details: error.message
        });
    }
};

// Buscar registro por ID
export const getUserHistoryById = async (req, res) => {
    try {
        // Validação do ID com Zod
        const { id } = historyIdSchema.parse(req.params);

        const history = await UserHistory
            .findById(id)
            .populate('user', 'name email')
            .populate('episode', 'title duration');

        if (!history) {
            return res.status(404).json({
                message: 'Histórico não encontrado'
            });
        }

        const historyUserId =
            history.user?._id?.toString() ||
            history.user?.toString();

        // Usuário comum só acessa o próprio histórico
        if (
            req.user.role !== 'admin' &&
            historyUserId !== req.user.id
        ) {
            return res.status(403).json({
                message: 'Acesso negado a este registro'
            });
        }

        return res.status(200).json(history);

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.issues
            });
        }

        return res.status(500).json({
            error: error.message
        });
    }
};

// Atualizar histórico por ID
export const updateUserHistory = async (req, res) => {
    try {
        // Validação do ID
        const { id } = historyIdSchema.parse(req.params);

        // Validação parcial dos dados
        const data = updateHistorySchema.parse(req.body);

        // Admin pode alterar qualquer histórico.
        // Usuário comum somente o próprio.
        const filter = req.user?.role === 'admin'
            ? { _id: id }
            : { _id: id, user: req.user.id };

        const history = await UserHistory.findOneAndUpdate(
            filter,
            data,
            {
                new: true,
                runValidators: true
            }
        );

        if (!history) {
            return res.status(404).json({
                message: 'Histórico não encontrado ou acesso negado'
            });
        }

        return res.status(200).json(history);

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.issues
            });
        }

        return res.status(400).json({
            error: error.message
        });
    }
};

// Deletar registro por ID
export const deleteUserHistory = async (req, res) => {
    try {
        // Validação do ID
        const { id } = historyIdSchema.parse(req.params);

        // Admin pode excluir qualquer histórico.
        // Usuário comum somente o próprio.
        const filter = req.user?.role === 'admin'
            ? { _id: id }
            : { _id: id, user: req.user.id };

        const history = await UserHistory.findOneAndDelete(filter);

        if (!history) {
            return res.status(404).json({
                message: 'Histórico não encontrado ou acesso negado'
            });
        }

        return res.status(200).json({
            message: 'Histórico removido com sucesso'
        });

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.issues
            });
        }

        return res.status(500).json({
            error: error.message
        });
    }
};
