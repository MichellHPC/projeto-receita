# Requests cURL - ReceitaController

Base URL:

```bash
http://localhost:3000
```

## 1. Listar todas as receitas

```bash
curl -X GET "http://localhost:3000/receitas"
```

## 2. Buscar receita por ID

Substitua `RECEITA_ID` por um UUID valido.

```bash
curl -X GET "http://localhost:3000/receitas/RECEITA_ID"
```

## 3. Buscar receitas por usuario

Substitua `USUARIO_ID` por um UUID valido do criador.

```bash
curl -X GET "http://localhost:3000/receitas/usuario/USUARIO_ID"
```

## 4. Criar receita

Substitua `USUARIO_ID` por um UUID valido existente na tabela `usuario`.

```bash
curl -X POST "http://localhost:3000/receitas" \
  -H "Content-Type: application/json" \
  -d '{
    "criador_id": "USUARIO_ID",
    "nome": "Bolo de Cenoura",
    "descricao": "Bolo fofinho com cobertura de chocolate"
  }'
```

## 5. Atualizar receita

Substitua `RECEITA_ID` por um UUID valido da receita.

```bash
curl -X PUT "http://localhost:3000/receitas/RECEITA_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Bolo de Cenoura Atualizado",
    "descricao": "Descricao nova da receita"
  }'
```

## 6. Deletar receita

Substitua `RECEITA_ID` por um UUID valido da receita.

```bash
curl -X DELETE "http://localhost:3000/receitas/RECEITA_ID"
```

## Dica rapida

Se quiser testar com o usuario seedado, primeiro pegue o ID em:

```bash
curl -X GET "http://localhost:3000/usuarios"
```
