import Episode from '../models/Episode.js';
import {
    episodeSchema,
    updateEpisodeSchema,
    episodeIdSchema
} from '../schemas/episodeSchema.js';

// Criar novo episódio
export const createEpisode = async (req, res) => {
    try {
        const data = episodeSchema.parse(req.body);

        const newEpisode = await Episode.create(data);

        return res.status(201).json(newEpisode);

    } catch (error) {
        if (error.name === 'ZodError') {
            return res.status(400).json({
                errors: error.issues
            });
        }

        return res.status(400).json({
            error: 'Erro ao criar episódio',
            details: error.message
        });
    }
};

// Buscar todos os episódios
export const getAllEpisodes = async (req, res) => {
    try {
        const episodes = await Episode
            .find()
            .populate('channel', 'title');

        return res.status(200).json(episodes);

    } catch (error) {
        return res.status(500).json({
            error: 'Erro ao buscar episódios'
        });
    }
};

// Buscar episódio por ID
export const getEpisodeById = async (req, res) => {
    try {
        // Validação do ID com Zod
        const { id } = episodeIdSchema.parse(req.params);

        const episode = await Episode
            .findById(id)
            .populate('channel', 'title');

        if (!episode) {
            return res.status(404).json({
                message: 'Episódio não encontrado'
            });
        }

        return res.status(200).json(episode);

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

// Atualizar episódio
export const updateEpisode = async (req, res) => {
    try {
        // Validação do ID
        const { id } = episodeIdSchema.parse(req.params);

        // Validação dos dados enviados
        const data = updateEpisodeSchema.parse(req.body);

        const episode = await Episode.findByIdAndUpdate(
            id,
            data,
            {
                new: true,
                runValidators: true
            }
        );

        if (!episode) {
            return res.status(404).json({
                message: 'Episódio não encontrado'
            });
        }

        return res.status(200).json(episode);

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

// Deletar episódio
export const deleteEpisode = async (req, res) => {
    try {
        // Validação do ID
        const { id } = episodeIdSchema.parse(req.params);

        const episode = await Episode.findByIdAndDelete(id);

        if (!episode) {
            return res.status(404).json({
                message: 'Episódio não encontrado'
            });
        }

        return res.status(200).json({
            message: 'Episódio removido com sucesso'
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