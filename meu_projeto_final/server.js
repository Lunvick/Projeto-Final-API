import 'dotenv/config';
import express from 'express';
import connectDB from './src/config/db.js';

// Rotas
import userRoutes from './src/routes/userRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import channelRoutes from './src/routes/channelRoutes.js';
import episodeRoutes from './src/routes/episodeRoutes.js';
import userHistoryRoutes from './src/routes/userHistoryRoutes.js';

const app = express();

app.use(express.json());

// Rotas
app.use('/api/users', userRoutes);
app.use('/auth', authRoutes);
app.use('/api/channel', channelRoutes);
app.use('/api/episode', episodeRoutes);
app.use('/api/history', userHistoryRoutes);

app.get('/', (req, res) => {
  res.send('API e Schemas do Grupo 1 configurados com sucesso!');
});

// Tratamento de erros
app.use((error, req, res, next) => {
  console.error(error);

  res.status(500).json({
    error: 'Erro interno do servidor.'
  });
});

const PORT = process.env.PORT || 3000;

if (!process.env.JWT_SECRET || process.env.JWT_SECRET === 'sua_chave_secreta_aqui') {
  console.error('JWT_SECRET não foi configurada corretamente.');
  process.exit(1);
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1);
  });

export default app;
