import jwt from 'jsonwebtoken';

export const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Verifica se o Authorization foi enviado
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: 'Acesso negado. Token não fornecido ou formato inválido.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Valida o JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Dados do usuário presentes no token
    req.user = decoded;

    next();

  } catch (error) {
    return res.status(401).json({
      error: 'Token inválido ou expirado.'
    });
  }
};


