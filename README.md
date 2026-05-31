bash

cat /home/claude/tcc-readme/README.md
Saída

# TCC Backend — Rede Social de ONGs e Voluntários

Backend da rede social que conecta ONGs e voluntários, desenvolvido em Node.js com Express, PostgreSQL e Sequelize.

---

## Tecnologias utilizadas

- **Node.js** — ambiente de execução JavaScript
- **Express** — framework web para criação da API
- **PostgreSQL** — banco de dados relacional
- **Sequelize** — ORM para modelagem e consulta ao banco
- **JWT (JSON Web Token)** — autenticação stateless
- **bcryptjs** — hash seguro de senhas
- **dotenv** — gerenciamento de variáveis de ambiente

---

## Como rodar o projeto

### Pré-requisitos
- Node.js instalado
- PostgreSQL instalado e rodando
- Banco de dados `tcc_ongs` criado

### Instalação

```bash
# Clone o repositório
git clone https://github.com/gustavomuterle/tcc-backend.git
cd tcc-backend

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com seus dados do PostgreSQL

# Inicie o servidor
npm run dev
```

O servidor sobe em `http://localhost:3000`

---

## Estrutura de pastas

```
tcc-backend/
├── src/
│   ├── config/
│   │   └── database.js        # Conexão com o PostgreSQL via Sequelize
│   ├── controllers/
│   │   ├── AuthController.js  # Cadastro, login e perfil
│   │   └── PostController.js  # CRUD de posts/campanhas
│   ├── middlewares/
│   │   └── authMiddleware.js  # Validação do token JWT
│   ├── models/
│   │   ├── User.js            # Model de usuários (voluntários e ONGs)
│   │   └── Post.js            # Model de posts/campanhas
│   ├── app.js                 # Configuração do Express
│   ├── routes.js              # Definição de todas as rotas
│   └── server.js              # Inicialização do servidor
├── .env.example               # Modelo de variáveis de ambiente
├── package.json
└── README.md
```

---

## Variáveis de ambiente

Crie um arquivo `.env` na raiz com base no `.env.example`:

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tcc_ongs
DB_USER=postgres
DB_PASS=sua_senha
JWT_SECRET=sua_chave_secreta
PORT=3000
```

---

## Rotas da API

Base URL: `http://localhost:3000/api`

Rotas protegidas exigem o header:
```
Authorization: Bearer <token>
```

---

### Autenticação

#### POST `/auth/register` — Cadastro de usuário
Cria um novo usuário (voluntário ou ONG).

**Body:**
```json
{
  "name": "Nome do usuário",
  "email": "email@exemplo.com",
  "password": "senha123",
  "role": "volunteer",
  "bio": "Descrição opcional"
}
```

> `role` aceita: `volunteer` ou `ong`

**Resposta 201:**
```json
{
  "message": "Usuário criado com sucesso.",
  "user": {
    "id": 1,
    "name": "Nome do usuário",
    "email": "email@exemplo.com",
    "role": "volunteer",
    "bio": "Descrição opcional",
    "avatar_url": null,
    "createdAt": "2026-05-31T20:20:18.157Z",
    "updatedAt": "2026-05-31T20:20:18.157Z"
  },
  "token": "<jwt_token>"
}
```

---

#### POST `/auth/login` — Login
Autentica o usuário e retorna um token JWT válido por 7 dias.

**Body:**
```json
{
  "email": "email@exemplo.com",
  "password": "senha123"
}
```

**Resposta 200:**
```json
{
  "message": "Login realizado com sucesso.",
  "user": { ... },
  "token": "<jwt_token>"
}
```

---

#### GET `/auth/me` — Dados do usuário autenticado 🔒
Retorna os dados do usuário logado.

**Resposta 200:**
```json
{
  "id": 1,
  "name": "Nome do usuário",
  "email": "email@exemplo.com",
  "role": "volunteer",
  "bio": "...",
  "avatar_url": null,
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

#### PUT `/auth/profile` — Editar perfil 🔒
Atualiza nome, bio e avatar do usuário autenticado.

**Body:**
```json
{
  "name": "Novo nome",
  "bio": "Nova bio",
  "avatar_url": "https://link-da-imagem.com/foto.jpg"
}
```

**Resposta 200:**
```json
{
  "message": "Perfil atualizado.",
  "user": { ... }
}
```

---

### Posts / Campanhas

#### GET `/posts` — Listar feed
Retorna todos os posts ordenados do mais recente ao mais antigo, com paginação.

**Query params opcionais:**
- `page` — número da página (padrão: 1)
- `limit` — posts por página (padrão: 10)

Exemplo: `GET /api/posts?page=1&limit=5`

**Resposta 200:**
```json
{
  "total": 2,
  "page": 1,
  "totalPages": 1,
  "posts": [
    {
      "id": 1,
      "title": "Título do post",
      "content": "Conteúdo...",
      "image_url": null,
      "category": "campanha",
      "user_id": 1,
      "createdAt": "...",
      "updatedAt": "...",
      "author": {
        "id": 1,
        "name": "Nome do autor",
        "role": "ong",
        "avatar_url": null
      }
    }
  ]
}
```

---

#### GET `/posts/:id` — Buscar post por ID
Retorna um post específico com dados completos do autor.

**Resposta 200:**
```json
{
  "id": 1,
  "title": "Título do post",
  "content": "Conteúdo...",
  "category": "campanha",
  "author": {
    "id": 1,
    "name": "Nome do autor",
    "role": "ong",
    "bio": "...",
    "avatar_url": null
  }
}
```

---

#### POST `/posts` — Criar post 🔒
Cria um novo post vinculado ao usuário autenticado.

**Body:**
```json
{
  "title": "Título da campanha",
  "content": "Descrição completa...",
  "image_url": "https://link-opcional.com/imagem.jpg",
  "category": "campanha"
}
```

> `category` aceita: `campanha`, `vaga`, `evento`, `noticia`

**Resposta 201:**
```json
{
  "message": "Post criado com sucesso.",
  "post": { ... }
}
```

---

#### PUT `/posts/:id` — Editar post 🔒
Edita um post. Somente o autor do post pode editar.

**Body:**
```json
{
  "title": "Novo título",
  "content": "Novo conteúdo",
  "category": "evento"
}
```

**Resposta 200:**
```json
{
  "message": "Post atualizado.",
  "post": { ... }
}
```

---

#### DELETE `/posts/:id` — Deletar post 🔒
Deleta um post. Somente o autor do post pode deletar.

**Resposta 200:**
```json
{
  "message": "Post deletado com sucesso."
}
```

---

## Códigos de erro

| Código | Significado |
|--------|-------------|
| 400 | Dados obrigatórios faltando |
| 401 | Token não fornecido ou inválido |
| 403 | Sem permissão para esta ação |
| 404 | Recurso não encontrado |
| 409 | Email já cadastrado |
| 500 | Erro interno no servidor |

---

## Autores

Desenvolvido como TCC do curso técnico de Desenvolvimento de Sistemas.