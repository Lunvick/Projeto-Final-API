import { z } from 'zod';

export const paramsSchema = z.object({
    id: z.string({
        required_error: 'O parâmetro do ID é obrigatório',
        invalid_type_error: 'O ID deve ser uma string'
    })
        .length(24, {
            message: 'O ID deve possuir exatamente 24 caracteres'
        })
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: 'O ID informado não é um ObjectId válido do MongoDB'
        })
});

export const idParamsSchema = paramsSchema;

export const userIdParamsSchema = z.object({
    userId: z.string({
        required_error: 'O parâmetro do ID do usuário é obrigatório',
        invalid_type_error: 'O ID do usuário deve ser uma string'
    })
        .length(24, {
            message: 'O ID do usuário deve possuir exatamente 24 caracteres'
        })
        .regex(/^[0-9a-fA-F]{24}$/, {
            message: 'O ID do usuário informado não é um ObjectId válido do MongoDB'
        })
});

// Mantido caso seja utilizado em algum middleware ou controller
export const validateParams = (data) => {
    try {
        const validData = paramsSchema.parse(data);

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
