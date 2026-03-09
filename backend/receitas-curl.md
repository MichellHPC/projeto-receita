# Requests cURL - Receitas

Base URL:

```bash
http://localhost:3000
```

## 1. Listar todas as receitas

```bash
curl -X GET "http://localhost:3000/receitas"
```

## 2. Buscar receita por ID

Substitua `RECEITA_ID` por um ID numerico valido.

```bash
curl -X GET "http://localhost:3000/receitas/RECEITA_ID"
```

## 3. Buscar receitas por usuario

Substitua `ID_USUARIO` por um ID numerico valido da tabela `usuarios`.

```bash
curl -X GET "http://localhost:3000/receitas/usuario/ID_USUARIO"
```

## 4. Criar receita

Campos obrigatorios: `id_usuarios`, `modo_preparo`.

```bash
curl -X POST "http://localhost:3000/receitas" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuarios": 1,
    "id_categorias": 1,
    "nome": "Bolo de Chocolate",
    "tempo_preparo_minutos": 60,
    "porcoes": 8,
    "modo_preparo": "Misture os ingredientes e asse por 40 minutos.",
    "ingredientes": "Farinha, ovos, leite, chocolate em po"
  }'
```

## 5. Atualizar receita

Substitua `RECEITA_ID` por um ID numerico valido.

```bash
curl -X PUT "http://localhost:3000/receitas/RECEITA_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "id_categorias": 9,
    "nome": "Bolo de Chocolate Atualizado",
    "tempo_preparo_minutos": 50,
    "porcoes": 10,
    "modo_preparo": "Atualize o modo de preparo aqui.",
    "ingredientes": "Ingredientes atualizados"
  }'
```

## 6. Deletar receita

Substitua `RECEITA_ID` por um ID numerico valido.

```bash
curl -X DELETE "http://localhost:3000/receitas/RECEITA_ID"
```

## Dica rapida para pegar IDs

```bash
# IDs de usuarios
curl -X GET "http://localhost:3000/usuarios"

# IDs de receitas
curl -X GET "http://localhost:3000/receitas"
```
