import mongoose from 'mongoose';

const connectDB = async () => {
  if (!process.env.DATABASE_URL || process.env.DATABASE_URL.includes('sua_string_de_conexao')) {
    throw new Error('DATABASE_URL não foi configurada corretamente.');
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL);
    console.log('Conectado ao MongoDB com sucesso!');
  } catch (error) {
    console.error('Erro ao conectar ao MongoDB:', error.message);
    throw error;
  }
};

export default connectDB;