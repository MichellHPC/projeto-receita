# Projeto Receita - Backend

Backend da API de receitas com Node.js, Express e MySQL.

## Como iniciar o projeto

### 1. Instalar dependencias

```bash
npm install
```

### 2. Subir o container do banco MySQL

```bash
# opcao 1 (script do projeto)
npm run db:up

# opcao 2 (comando docker direto)
docker compose up -d
```

Configuracao atual do container MySQL:

- host: `localhost`
- porta: `3306`
- database: `teste_receitas_rg_sistemas`
- usuario: `usuario_teste`
- senha: `senha123`
- root password: `root123`

### 3. Rodar migrations e seed

```bash
# cria as tabelas
npm run migrate

# popula dados iniciais
npm run seed

# ou executa os dois em sequencia
npm run db:setup
```

### 4. Iniciar a API

```bash
npm run dev
```

Aplicacao disponivel em:

- API: `http://localhost:3000`
- Swagger: `http://localhost:3000/api-docs`

### 5. Parar o container do banco

```bash
# opcao 1 (script do projeto)
npm run db:down

# opcao 2 (comando docker direto)
docker compose down
```

## Estrutura do banco de dados (migrations atuais)

### Migration `001_create_usuario_table.js`

Cria a tabela `usuarios`:

- `id` `INT UNSIGNED` auto incremento, PK
- `nome` `VARCHAR(100)`
- `login` `VARCHAR(100)` unico
- `senha` `VARCHAR(100)`
- `criado_em` `DATETIME`
- `alterado_em` `DATETIME`

### Migration `002_create_receitas_table.js`

Cria a tabela `categorias`:

- `id` `INT UNSIGNED` auto incremento, PK
- `nome` `VARCHAR(100)` unico

### Migration `003_create_receitas_table.js`

Cria a tabela `receitas`:

- `id` `INT UNSIGNED` auto incremento, PK
- `id_usuarios` `INT UNSIGNED` (FK para `usuarios.id`)
- `id_categorias` `INT UNSIGNED` (FK para `categorias.id`)
- `nome` `VARCHAR(45)`
- `tempo_preparo_minutos` `INT UNSIGNED`
- `porcoes` `INT UNSIGNED`
- `modo_preparo` `TEXT` (obrigatorio)
- `ingredientes` `TEXT`
- `criado_em` `DATETIME`
- `alterado_em` `DATETIME`

Regras de chave estrangeira da tabela `receitas`:

- `id_usuarios`: `ON DELETE RESTRICT`, `ON UPDATE CASCADE`
- `id_categorias`: `ON DELETE CASCADE`, `ON UPDATE CASCADE`

## Dados iniciais (seed atual)

Arquivo: `src/database/seeds/001_seed_initial_data.js`

- Insere/atualiza 13 categorias fixas (ex.: `Bolos e tortas doces`, `Carnes`, `Massas`, `Bebidas`, `Doces e sobremesas`).
- Cria/atualiza usuario de teste:
  - nome: `Usuario Teste`
  - login: `usuario.teste`
  - senha: `senha123`
- Insere uma receita de teste:
  - nome: `Bolo de Chocolate`
  - categoria: `Bolos e tortas doces` (id 1)
  - tempo de preparo: `60` minutos
  - porcoes: `8`

## Rotas da API

### Autenticacao

- `POST /login`
  - body: `{ "login": "string", "password": "string" }`

### Usuarios

- `GET /usuarios`
- `GET /usuarios/:id`
- `POST /usuarios`
  - body: `{ "nome": "string", "login": "string", "password": "string" }`
- `PUT /usuarios/:id`
  - body (campos opcionais): `{ "nome": "string", "login": "string", "password": "string" }`
- `DELETE /usuarios/:id`

### Receitas

- `GET /receitas`
- `GET /receitas/:id`
- `GET /receitas/usuario/:id_usuario`
- `POST /receitas`
  - body: `{ "id_usuarios": 1, "id_categorias": 1, "nome": "string", "tempo_preparo_minutos": 60, "porcoes": 8, "modo_preparo": "string", "ingredientes": "string" }`
- `PUT /receitas/:id`
  - body (campos opcionais): `{ "id_usuarios": 1, "id_categorias": 1, "nome": "string", "tempo_preparo_minutos": 60, "porcoes": 8, "modo_preparo": "string", "ingredientes": "string" }`
- `DELETE /receitas/:id`

## Scripts uteis

- `npm run dev`: inicia o servidor com `nodemon`
- `npm run migrate`: executa migrations
- `npm run seed`: executa seeds
- `npm run db:setup`: executa migrations + seeds
- `npm run db:up`: sobe o MySQL com Docker
- `npm run db:down`: derruba o MySQL com Docker
