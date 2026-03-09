# Requests cURL - Usuarios

Base URL:

```bash
http://localhost:3000
```

## 1. Login

Campos obrigatorios: `login`, `password`.

```bash
curl -X POST "http://localhost:3000/login" \
  -H "Content-Type: application/json" \
  -d '{
    "login": "usuario.teste",
    "password": "senha123"
  }'
```

## 2. Listar todos os usuarios

```bash
curl -X GET "http://localhost:3000/usuarios"
```

## 3. Buscar usuario por ID

Substitua `ID_USUARIO` por um ID numerico valido.

```bash
curl -X GET "http://localhost:3000/usuarios/ID_USUARIO"
```

## 4. Criar usuario

Campos obrigatorios: `login`, `password`.

```bash
curl -X POST "http://localhost:3000/usuarios" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "login": "maria.silva",
    "password": "123456"
  }'
```

## 5. Atualizar usuario

Substitua `ID_USUARIO` por um ID numerico valido.

```bash
curl -X PUT "http://localhost:3000/usuarios/ID_USUARIO" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva Atualizada",
    "login": "maria.silva.atualizada",
    "password": "novaSenha123"
  }'
```

## 6. Deletar usuario

Substitua `ID_USUARIO` por um ID numerico valido.

```bash
curl -X DELETE "http://localhost:3000/usuarios/ID_USUARIO"
```

## Dica rapida para pegar IDs

```bash
curl -X GET "http://localhost:3000/usuarios"
```
