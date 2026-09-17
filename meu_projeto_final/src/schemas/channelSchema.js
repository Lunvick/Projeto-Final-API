import { z } from 'zod';

const CATEGORIAS_PERMITIDAS = [
    'Tecnologia',
    'Entrevistas',
    'Humor',
    'Esportes',
    'Educacional',
    'Música'
];

export const channelSchema = z.object({
    title: z.string({
        required_error: 'O título do canal é obrigatório',
        invalid_type_error: 'O título deve ser um texto'
    })
        .trim()
        .min(3, {
            message: 'O título deve ter no mínimo 3 caracteres'
        }),

    description: z.string({
        required_error: 'A descrição é obrigatória',
        invalid_type_error: 'A descrição deve ser um texto'
    })
        .trim()
        .min(10, {
            message: 'A descrição deve ter no mínimo 10 caracteres'
        }),

    category: z.enum(CATEGORIAS_PERMITIDAS, {
        errorMap: () => ({
            message: `A categoria deve ser uma das seguintes: ${CATEGORIAS_PERMITIDAS.join(', ')}`
        })
    }),

    owner: z.string({
        required_error: 'O ID do proprietário é obrigatório',
        invalid_type_error: 'O ID do proprietário deve ser uma string'
    })
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: 'Formato de ID do MongoDB inválido'
        })
        .optional()
});

export const updateChannelSchema = channelSchema.partial();

export const channelIdSchema = z.object({
    id: z.string()
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: 'Formato de ID do MongoDB inválido'
        })
});

export const validateChannelData = (data) => {
    try {
        const validData = channelSchema.parse(data);

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