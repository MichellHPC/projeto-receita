# Requests cURL - UsuarioController

Base URL:

```bash
http://localhost:3000
```

## 1. Login

```bash
curl -X POST "http://localhost:3000/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "michell.rv@gmail.com",
    "password": "senha123"
  }'
```

## 2. Listar todos os usuarios

```bash
curl -X GET "http://localhost:3000/usuarios"
```

## 3. Buscar usuario por ID

Substitua `USUARIO_ID` por um UUID valido.

```bash
curl -X GET "http://localhost:3000/usuarios/USUARIO_ID"
```

## 4. Criar usuario

```bash
curl -X POST "http://localhost:3000/usuarios" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva",
    "email": "maria.silva@email.com",
    "password": "123456"
  }'
```

## 5. Atualizar usuario

Substitua `USUARIO_ID` por um UUID valido.

```bash
curl -X PUT "http://localhost:3000/usuarios/USUARIO_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Maria Silva Atualizada",
    "email": "maria.atualizada@email.com",
    "password": "novaSenha123"
  }'
```

## 6. Deletar usuario

Substitua `USUARIO_ID` por um UUID valido.

```bash
curl -X DELETE "http://localhost:3000/usuarios/USUARIO_ID"
```

## Dica rapida

Para pegar um ID real de usuario e testar os endpoints:

```bash
curl -X GET "http://localhost:3000/usuarios"
```
