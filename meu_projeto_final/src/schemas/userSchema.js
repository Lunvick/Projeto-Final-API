import { z } from 'zod';

export const registerSchema = z.object({
    name: z.string({
        required_error: 'O nome é obrigatório',
        invalid_type_error: 'O nome deve ser um texto'
    })
        .min(3, {
            message: 'O nome deve ter no mínimo 3 caracteres'
        }),

    email: z.string({
        required_error: 'O email é obrigatório',
        invalid_type_error: 'O e-mail deve ser um texto'
    })
        .email({
            message: 'Forneça um formato de e-mail válido'
        }),

    password: z.string({
        required_error: 'A senha é obrigatória',
        invalid_type_error: 'A senha deve ser um texto'
    })
        .min(6, {
            message: 'A senha deve ter no mínimo 6 caracteres'
        })
});

export const loginSchema = z.object({
    email: z.string({
        required_error: 'O e-mail é obrigatório',
        invalid_type_error: 'O e-mail deve ser um texto'
    })
        .email({
            message: 'Forneça um formato de e-mail válido'
        }),

    password: z.string({
        required_error: 'A senha é obrigatória',
        invalid_type_error: 'A senha deve ser um texto'
    })
});

export const updateUserSchema = z.object({
    name: z.string({
        invalid_type_error: 'O nome deve ser um texto'
    })
        .min(3, {
            message: 'O nome deve ter no mínimo 3 caracteres'
        })
        .optional(),

    email: z.string({
        invalid_type_error: 'O e-mail deve ser um texto'
    })
        .email({
            message: 'Forneça um formato de e-mail válido'
        })
        .optional(),

    password: z.string({
        invalid_type_error: 'A senha deve ser um texto'
    })
        .min(6, {
            message: 'A senha deve ter no mínimo 6 caracteres'
        })
        .optional()

}).refine(
    (data) => Object.keys(data).length > 0,
    {
        message: 'Informe ao menos um campo para atualizar'
    }
);

export const idSchema = z.object({
    id: z.string().regex(
        /^[0-9a-fA-F]{24}$/,
        'ID de usuário inválido'
    )
});
