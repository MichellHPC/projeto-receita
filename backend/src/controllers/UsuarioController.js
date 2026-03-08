const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

// Listar todos os usuários
async function index(request, response) {
    try {
        const [users] = await pool.query('SELECT id, nome, email, created_at, updated_at FROM usuario');
        return response.status(200).json(users);
    } catch (error) {
        console.error('Erro ao listar usuários:', error);
        return response.status(500).json({ error: 'Erro ao listar usuários' });
    }
}

// Buscar usuário por ID
async function show(request, response) {
    const { id } = request.params;
    
    try {
        const [users] = await pool.query(
            'SELECT id, nome, email, created_at, updated_at FROM usuario WHERE id = ?',
            [id]
        );
        
        if (users.length === 0) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        return response.status(200).json(users[0]);
    } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        return response.status(500).json({ error: 'Erro ao buscar usuário' });
    }
}

// Criar novo usuário
async function store(request, response) {
    const { nome, email, senha } = request.body;
    
    if (!nome || !email || !senha) {
        return response.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
    }
    
    const id = uuidv4();
    
    try {
        await pool.query(
            'INSERT INTO usuario (id, nome, email, senha) VALUES (?, ?, ?, ?)',
            [id, nome, email, senha]
        );
        
        return response.status(201).json({
            message: 'Usuário criado com sucesso',
            user: { id, nome, email }
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({ error: 'Email já cadastrado' });
        }
        
        return response.status(500).json({ error: 'Erro ao criar usuário' });
    }
}

// Atualizar usuário
async function update(request, response) {
    const { id } = request.params;
    const { nome, email, senha } = request.body;
    
    if (!nome && !email && !senha) {
        return response.status(400).json({ error: 'Forneça ao menos um campo para atualizar' });
    }
    
    try {
        // Verifica se o usuário existe
        const [users] = await pool.query('SELECT id FROM usuario WHERE id = ?', [id]);
        
        if (users.length === 0) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        // Monta a query de atualização dinamicamente
        const fields = [];
        const values = [];
        
        if (nome) {
            fields.push('nome = ?');
            values.push(nome);
        }
        if (email) {
            fields.push('email = ?');
            values.push(email);
        }
        if (senha) {
            fields.push('senha = ?');
            values.push(senha);
        }
        
        values.push(id);
        
        await pool.query(
            `UPDATE usuario SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        
        return response.status(200).json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({ error: 'Email já cadastrado' });
        }
        
        return response.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
}

// Deletar usuário
async function destroy(request, response) {
    const { id } = request.params;
    
    try {
        const [result] = await pool.query('DELETE FROM usuario WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return response.status(404).json({ error: 'Usuário não encontrado' });
        }
        
        return response.status(200).json({ message: 'Usuário deletado com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar usuário:', error);
        return response.status(500).json({ error: 'Erro ao deletar usuário' });
    }
}

module.exports = {
    index,
    show,
    store,
    update,
    destroy
};
