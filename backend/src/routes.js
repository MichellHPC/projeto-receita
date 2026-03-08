const express = require('express');
const UsuarioController = require('./controllers/UsuarioController');
const ReceitaController = require('./controllers/ReceitaController');

const routes = express.Router();

// Rota de login
routes.post('/login', UsuarioController.login);

// Rotas de Usuário (CRUD completo)
routes.get('/usuarios', UsuarioController.index);           // Listar todos
routes.get('/usuarios/:id', UsuarioController.show);        // Buscar por ID
routes.post('/usuarios', UsuarioController.store);          // Criar
routes.put('/usuarios/:id', UsuarioController.update);      // Atualizar
routes.delete('/usuarios/:id', UsuarioController.destroy);  // Deletar

// Rotas de Receitas (CRUD completo)
routes.get('/receitas', ReceitaController.index);                        // Listar todas
routes.get('/receitas/:id', ReceitaController.show);                     // Buscar por ID
routes.get('/receitas/usuario/:criador_id', ReceitaController.byUser);  // Buscar por usuário
routes.post('/receitas', ReceitaController.store);                       // Criar
routes.put('/receitas/:id', ReceitaController.update);                   // Atualizar
routes.delete('/receitas/:id', ReceitaController.destroy);               // Deletar

module.exports = routes;