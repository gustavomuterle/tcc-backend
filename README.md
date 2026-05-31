# TCC Back-end - Plataforma de ONGs e Voluntários

## Estrutura sugerida de pastas

- `controllers/` - lógica de controle das rotas
- `routes/` - definições de rotas HTTP
- `models/` - consultas SQL ou ORM
- `middlewares/` - autenticação, validação, tratamento de erros
- `config/` - configuração do banco, JWT, variáveis de ambiente
- `utils/` - helpers, validações, formatação

## Dependências iniciais

Instale estas dependências:

```bash
npm install express cors dotenv bcrypt jsonwebtoken pg
npm install -D nodemon
```

## Iniciar servidor

1. Crie um arquivo `.env` na pasta do projeto usando `.env.example` como referência.
2. Ajuste os valores de conexão com o PostgreSQL.

```bash
cd C:\Users\gusta\tcc-backend
npm install
npm run dev
```

## Rotas de autenticação

- `POST /api/auth/register` - cadastra usuário + perfil de ONG ou voluntário
- `POST /api/auth/login` - autentica e retorna token JWT

## Banco de dados

Use o arquivo `database.sql` para criar as tabelas no PostgreSQL.

Depois de criar o banco, abra `database.sql` no seu cliente PostgreSQL e execute o script para gerar as tabelas.
