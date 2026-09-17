import { z } from 'zod';

export const historySchema = z.object({
    user: z.string({
        required_error: 'O ID do usuário é obrigatório',
        invalid_type_error: 'O ID do usuário deve ser um texto'
    })
        .length(24, {
            message: 'O ID do usuário deve ser um ObjectId válido do MongoDB (24 caracteres)'
        })
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: 'Formato de ID do MongoDB inválido'
        })
        .optional(),

    episode: z.string({
        required_error: 'O ID do episódio é obrigatório',
        invalid_type_error: 'O ID do episódio deve ser um texto'
    })
        .length(24, {
            message: 'O ID do episódio deve ser um ObjectId válido do MongoDB (24 caracteres)'
        })
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: 'Formato de ID do MongoDB inválido'
        }),

    progress: z.number({
        invalid_type_error: 'O progresso deve ser um número em segundos'
    })
        .int({
            message: 'O progresso deve ser um número inteiro de segundos'
        })
        .nonnegative({
            message: 'O progresso em segundos não pode ser um número negativo'
        })
        .optional()
});

// Schema para atualização parcial
export const updateHistorySchema = historySchema.partial();

// Schema para validar o ID da URL
export const historyIdSchema = z.object({
    id: z.string()
        .length(24, {
            message: 'O ID do histórico deve ser um ObjectId válido do MongoDB (24 caracteres)'
        })
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: 'Formato de ID do MongoDB inválido'
        })
});

// Mantido caso você queira utilizar em outros lugares
export const validateHistory = (data) => {
    try {
        const validData = historySchema.parse(data);

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