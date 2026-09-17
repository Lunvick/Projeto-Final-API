import Channel from '../models/Channel.js';
import {
    channelSchema,
    updateChannelSchema,
    channelIdSchema
} from '../schemas/channelSchema.js';

// Criar novo canal
export const createChannel = async (req, res) => {
    try {
        // ID do usuário autenticado como owner
        const dataToValidate = {
            ...req.body,
            owner: req.user.id
        };

        // Validação do Zod
        const data = channelSchema.parse(dataToValidate);

        // Criação no banco
        const newChannel = await Channel.create(data);

        return res.status(201).json(newChannel);

    } catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.issues
            });
        }

        return res.status(400).json({
            error: 'Erro ao criar canal',
            details: error.message
        });
    }
};

// Buscar todos os canais
export const getAllChannels = async (req, res) => {
    try {
        const channels = await Channel
            .find()
            .populate('owner', 'name email');

        return res.status(200).json(channels);

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};

// Buscar canal por ID
export const getChannelById = async (req, res) => {
    try {
        // Validação do parâmetro da URL
        const { id } = channelIdSchema.parse(req.params);

        const channel = await Channel
            .findById(id)
            .populate('owner', 'name email');

        if (!channel) {
            return res.status(404).json({
                message: 'Canal não encontrado'
            });
        }

        return res.status(200).json(channel);

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

// Atualizar canal
export const updateChannel = async (req, res) => {
    try {
        // Validação do ID
        const { id } = channelIdSchema.parse(req.params);

        // Validação dos dados enviados
        const data = updateChannelSchema.parse(req.body);

        const channel = await Channel.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        );

        if (!channel) {
            return res.status(404).json({
                message: 'Canal não encontrado'
            });
        }

        return res.status(200).json(channel);

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

// Deletar canal
export const deleteChannel = async (req, res) => {
    try {
        // Validação do ID
        const { id } = channelIdSchema.parse(req.params);

        const channel = await Channel.findByIdAndDelete(id);

        if (!channel) {
            return res.status(404).json({
                message: 'Canal não encontrado'
            });
        }

        return res.status(200).json({
            message: 'Canal removido com sucesso'
        });

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
};