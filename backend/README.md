# Projeto Receita - Backend

## Configuração do Banco de Dados

### 1. Subir MySQL com Docker (localhost)

```bash
docker compose up -d
```

O container sobe com:

- host: localhost
- porta: 3306
- banco: projeto_receitas
- usuário: usuario_teste
- senha: senha123

### 2. Configure a conexão

Edite o arquivo `src/database/connection.js` com suas credenciais MySQL:

- **host**: localhost
- **user**: usuario_teste
- **password**: senha123
- **database**: projeto_receitas

### 3. Execute as migrations e seeds

```bash
# Executar migrations (criar tabelas)
npm run migrate

# Executar seeds (dados de teste)
npm run seed

# Ou executar ambos de uma vez
npm run db:setup
```

## Estrutura do Banco de Dados

### Tabela: usuario

- `id` (CHAR(36)) - UUID, chave primária
- `nome` (VARCHAR(255)) - Nome do usuário
- `email` (VARCHAR(255)) - Email único
- `senha` (VARCHAR(255)) - Senha
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

### Tabela: receitas

- `id` (CHAR(36)) - UUID, chave primária
- `criador_id` (CHAR(36)) - FK para usuario.id
- `nome` (VARCHAR(255)) - Nome da receita
- `descricao` (TEXT) - Descrição da receita
- `created_at` (TIMESTAMP) - Data de criação
- `updated_at` (TIMESTAMP) - Data de atualização

## Rotas da API

### Autenticação

- `POST /login` - Login de usuário
  - Body: `{ "email": "string", "senha": "string" }`

### Usuários (CRUD Completo)

- `GET /usuarios` - Listar todos os usuários
- `GET /usuarios/:id` - Buscar usuário por ID
- `POST /usuarios` - Criar novo usuário
  - Body: `{ "nome": "string", "email": "string", "senha": "string" }`
- `PUT /usuarios/:id` - Atualizar usuário
  - Body: `{ "nome": "string", "email": "string", "senha": "string" }` (todos opcionais)
- `DELETE /usuarios/:id` - Deletar usuário

### Receitas (CRUD Completo)

- `GET /receitas` - Listar todas as receitas
- `GET /receitas/:id` - Buscar receita por ID
- `GET /receitas/usuario/:criador_id` - Buscar receitas de um usuário específico
- `POST /receitas` - Criar nova receita
  - Body: `{ "criador_id": "string", "nome": "string", "descricao": "string" }`
- `PUT /receitas/:id` - Atualizar receita
  - Body: `{ "nome": "string", "descricao": "string" }` (ambos opcionais)
- `DELETE /receitas/:id` - Deletar receita

## Dados de Teste (Seeds)

**Usuário:**

- Email: <michell.rv@gmail.com>
- Senha: senha123

**Receita:**

- Nome: Bolo de Chocolate
- Descrição: Um delicioso bolo de chocolate com cobertura cremosa.

## Executar o Servidor

```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## Arquivos Docker/Env

- `docker-compose.yml` - MySQL local
- `.env.example` - exemplo de variáveis de conexão
