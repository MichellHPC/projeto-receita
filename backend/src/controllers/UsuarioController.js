const pool = require('../database/connection');
const bcrypt = require('bcryptjs');

// Login de usuário
async function login(request, response) {
    const { login, password } = request.body;

    if (!login || !password) {
        return response.status(400).json({ error: 'Login e senha são obrigatórios' });
    }

    try {
        const [users] = await pool.query(
            'SELECT id, nome, login, senha, criado_em, alterado_em FROM usuarios WHERE login = ?',
            [login]
        );

        if (users.length === 0) {
            return response.status(401).json({ error: 'Login ou senha inválidos' });
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.senha);

        if (!isPasswordValid) {
            return response.status(401).json({ error: 'Login ou senha inválidos' });
        }

        return response.status(200).json({
            message: 'Login realizado com sucesso',
            user: {
                id: user.id,
                nome: user.nome,
                login: user.login,
                criado_em: user.criado_em,
                alterado_em: user.alterado_em
            }
        });
    } catch (error) {
        return response.status(500).json({ error: 'Erro ao realizar login' });
    }
}

// Listar todos os usuários
async function index(request, response) {
    try {
        const [users] = await pool.query('SELECT id, nome, login, criado_em, alterado_em FROM usuarios');
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
            'SELECT id, nome, login, criado_em, alterado_em FROM usuarios WHERE id = ?',
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
    const { nome, login, password } = request.body;
    
    if (!login || !password) {
        return response.status(400).json({ error: 'Login e senha são obrigatórios' });
    }
    
    try {
        const hashedPassword = await bcrypt.hash(password, 12);

        await pool.query(
            'INSERT INTO usuarios (nome, login, senha, criado_em, alterado_em) VALUES (?, ?, ?, NOW(), NOW())',
            [nome || null, login, hashedPassword]
        );

        const [[createdUser]] = await pool.query(
            'SELECT id, nome, login, criado_em, alterado_em FROM usuarios WHERE login = ?',
            [login]
        );
        
        return response.status(201).json({
            message: 'Usuário criado com sucesso',
            user: createdUser
        });
    } catch (error) {
        console.error('Erro ao criar usuário:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({ error: 'Login já cadastrado' });
        }
        
        return response.status(500).json({ error: 'Erro ao criar usuário' });
    }
}

// Atualizar usuário
async function update(request, response) {
    const { id } = request.params;
    const { nome, login, password } = request.body;
    
    if (!nome && !login && !password) {
        return response.status(400).json({ error: 'Forneça ao menos um campo para atualizar' });
    }
    
    try {
        // Verifica se o usuário existe
        const [users] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id]);
        
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
        if (login) {
            fields.push('login = ?');
            values.push(login);
        }
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            fields.push('senha = ?');
            values.push(hashedPassword);
        }

        fields.push('alterado_em = NOW()');
        
        values.push(id);
        
        await pool.query(
            `UPDATE usuarios SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        
        return response.status(200).json({ message: 'Usuário atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar usuário:', error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return response.status(409).json({ error: 'Login já cadastrado' });
        }
        
        return response.status(500).json({ error: 'Erro ao atualizar usuário' });
    }
}

// Deletar usuário
async function destroy(request, response) {
    const { id } = request.params;
    
    try {
        const [result] = await pool.query('DELETE FROM usuarios WHERE id = ?', [id]);
        
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
    login,
    index,
    show,
    store,
    update,
    destroy
};
