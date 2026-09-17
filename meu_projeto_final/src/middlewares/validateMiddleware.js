import { ZodError } from 'zod';

export const validate = (schema, source = 'body') => {
  return (req, res, next) => {
    try {
      req[source] = schema.parse(req[source]);
      next();

    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          error: 'Dados inválidos',
          details: error.issues
        });
      }

      next(error);
    }
  };
};
