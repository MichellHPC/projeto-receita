# Projeto Receita - Frontend

Aplicacao web React para autenticacao de usuarios e gerenciamento de receitas.

## Funcionalidades

- Cadastro e login de usuario.
- Persistencia da sessao do usuario no navegador.
- Alternancia de tema claro/escuro.
- Edicao de perfil (nome, login e senha).
- CRUD de receitas:
  - Criar receita
  - Listar receitas do usuario
  - Buscar receitas por texto
  - Editar receita
  - Excluir receita
  - Imprimir receita
- Exibicao de notificacoes de sucesso e erro.

## Tecnologias

- React (Create React App)
- Axios (chamadas HTTP)
- Tailwind CSS (configurado no projeto)

## Requisitos

- Node.js 18+ (recomendado)
- npm 9+ (recomendado)
- API backend em execucao

## Configuracao

Este frontend consome uma API configurada por variavel de ambiente.

1. Crie um arquivo `.env` na raiz da pasta `app`.
2. Adicione:

```env
REACT_APP_API_URL=http://localhost:3000
```

Se a variavel nao for definida, o projeto usa `http://localhost:3000` por padrao.

## Instalacao

Na pasta `app`, execute:

```bash
npm install
```

## Execucao local

```bash
npm start
```

A aplicacao sera aberta em `http://localhost:3000`.

## Como usar

1. Acesse a tela inicial.
2. Se ainda nao tiver conta, alterne para modo de cadastro e crie um usuario.
3. Faca login com usuario e senha.
4. No menu superior, voce pode:
	- Abrir tela de receitas
	- Abrir tela de perfil
	- Alterar tema claro/escuro
	- Sair da conta
5. Na tela de receitas:
	- Clique em criar receita
	- Preencha os campos (nome, modo de preparo, categoria, tempo, porcoes, ingredientes)
	- Salve para cadastrar
	- Use a busca para filtrar resultados
	- Edite, exclua ou imprima receitas existentes

## Endpoints esperados da API

O frontend utiliza os seguintes endpoints:

- `POST /usuarios` - cadastro de usuario
- `POST /login` - autenticacao
- `PUT /usuarios/:id` - atualizacao de perfil
- `GET /receitas/usuario/:id` - listar receitas do usuario
- `POST /receitas` - criar receita
- `PUT /receitas/:id` - atualizar receita
- `DELETE /receitas/:id` - excluir receita

## Scripts disponiveis

- `npm start` - inicia o ambiente de desenvolvimento
- `npm test` - executa testes em modo interativo
- `npm run build` - gera build de producao em `build/`
- `npm run eject` - ejeta configuracoes do CRA (irreversivel)

## Estrutura principal

- `src/components/auth` - componentes de autenticacao e perfil
- `src/components/recipes` - componentes de listagem/formulario de receitas
- `src/components/common` - componentes compartilhados (menu, notificacao, tema)
- `src/hooks/useAuth.js` - regras de autenticacao e sessao
- `src/hooks/useRecipes.js` - regras de negocio das receitas
- `src/utils` - utilitarios (validacao, impressao, storage)

## Observacoes

- A sessao do usuario e a preferencia de tema ficam salvas no `localStorage`.
- Para impressao, o navegador precisa permitir abertura de nova janela/pop-up.
