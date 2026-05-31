require('dotenv').config();
const app = require('./app');
const sequelize = require('./config/database');

require('./models/User');
require('./models/Post');

const PORT = process.env.PORT || 3000;

const start = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log(' Modelos sincronizados com o banco de dados.');

    app.listen(PORT, () => {
      console.log(` Servidor rodando em http://localhost:${PORT}`);
      console.log(`   Health check: http://localhost:${PORT}/health`);
    });
  } catch (err) {
    console.error(' Falha ao inicializar o servidor:', err);
    process.exit(1);
  }
};

start();