import { z } from 'zod';

export const episodeSchema = z.object({
    title:
        z.string({
            required_error: 'O título do episódio é obrigatório',
            invalid_type_error: 'O título deve ser um texto'
        })
        .min(3, {
            message: 'O título deve ter no mínimo 3 caracteres'
        }),

    audioUrl:
        z.string({
            required_error: 'A URL do áudio é obrigatória',
            invalid_type_error: 'A URL do áudio deve ser um texto'
        })
        .url({
            message: 'Forneça uma URL válida para o arquivo de áudio'
        }),

    duration:
        z.number({
            required_error: 'A duração é obrigatória',
            invalid_type_error: 'A duração deve ser um número representando os segundos'
        })
        .positive({
            message: 'A duração deve ser um número positivo maior do que zero'
        }),

    channel:
        z.string({
            required_error: 'O ID do canal é obrigatório',
            invalid_type_error: 'O ID deve ser uma string'
        })
        .length(24, {
            message: 'O ID do canal deve ser um ObjectId válido do MongoDB (24 caracteres)'
        })
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: 'Formato de ID do MongoDB inválido'
        })
});

export const updateEpisodeSchema = episodeSchema.partial();

export const episodeIdSchema = z.object({
    id: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: 'Formato de ID do MongoDB inválido'
        })
});

export const validateEpisode = (data) => {
    try {
        const validData = episodeSchema.parse(data);

        return {
            success: true,
            data: validData
        };

    } catch (error) {
        if (error instanceof z.ZodError) {
            return {
                success: false,
                issues: error.issues
            };
        }

        throw error;
    }
};