const express = require('express');
const UsuarioController = require('./controllers/UsuarioController');
const ReceitaController = require('./controllers/ReceitaController');
const pool = require('./database/connection');

const routes = express.Router();

// Rota de login
routes.post('/login', async (request, response) => {
    const { email, senha } = request.body;

    // Verifica se o email e a senha foram fornecidos
    if (!email || !senha) {
        return response.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    try {
        const [users] = await pool.query(
            'SELECT id, nome, email FROM usuario WHERE email = ? AND senha = ?',
            [email, senha]
        );

        // Verifica se o usuário foi encontrado
        if (users.length === 0) {
            return response.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const user = users[0];

        return response.status(200).json({
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                nome: user.nome,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        return response.status(500).json({ error: 'Erro ao realizar login' });
    }
});

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