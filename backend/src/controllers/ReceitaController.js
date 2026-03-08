const pool = require('../database/connection');
const { v4: uuidv4 } = require('uuid');

// Listar todas as receitas
async function index(request, response) {
    try {
        const [receitas] = await pool.query(`
            SELECT 
                r.id, 
                r.nome, 
                r.descricao, 
                r.criador_id,
                u.nome as criador_nome,
                u.email as criador_email,
                r.created_at, 
                r.updated_at 
            FROM receitas r
            INNER JOIN usuario u ON r.criador_id = u.id
        `);
        return response.status(200).json(receitas);
    } catch (error) {
        console.error('Erro ao listar receitas:', error);
        return response.status(500).json({ error: 'Erro ao listar receitas' });
    }
}

// Buscar receita por ID
async function show(request, response) {
    const { id } = request.params;
    
    try {
        const [receitas] = await pool.query(`
            SELECT 
                r.id, 
                r.nome, 
                r.descricao, 
                r.criador_id,
                u.nome as criador_nome,
                u.email as criador_email,
                r.created_at, 
                r.updated_at 
            FROM receitas r
            INNER JOIN usuario u ON r.criador_id = u.id
            WHERE r.id = ?
        `, [id]);
        
        if (receitas.length === 0) {
            return response.status(404).json({ error: 'Receita não encontrada' });
        }
        
        return response.status(200).json(receitas[0]);
    } catch (error) {
        console.error('Erro ao buscar receita:', error);
        return response.status(500).json({ error: 'Erro ao buscar receita' });
    }
}

// Buscar receitas por usuário
async function byUser(request, response) {
    const { criador_id } = request.params;
    
    try {
        const [receitas] = await pool.query(`
            SELECT 
                r.id, 
                r.nome, 
                r.descricao, 
                r.criador_id,
                u.nome as criador_nome,
                u.email as criador_email,
                r.created_at, 
                r.updated_at 
            FROM receitas r
            INNER JOIN usuario u ON r.criador_id = u.id
            WHERE r.criador_id = ?
        `, [criador_id]);
        
        return response.status(200).json(receitas);
    } catch (error) {
        console.error('Erro ao buscar receitas do usuário:', error);
        return response.status(500).json({ error: 'Erro ao buscar receitas do usuário' });
    }
}

// Criar nova receita
async function store(request, response) {
    const { criador_id, nome, descricao } = request.body;
    
    if (!criador_id || !nome) {
        return response.status(400).json({ error: 'Criador_id e nome são obrigatórios' });
    }
    
    const id = uuidv4();
    
    try {
        // Verifica se o usuário existe
        const [users] = await pool.query('SELECT id FROM usuario WHERE id = ?', [criador_id]);
        
        if (users.length === 0) {
            return response.status(404).json({ error: 'Usuário criador não encontrado' });
        }
        
        await pool.query(
            'INSERT INTO receitas (id, criador_id, nome, descricao) VALUES (?, ?, ?, ?)',
            [id, criador_id, nome, descricao]
        );
        
        return response.status(201).json({
            message: 'Receita criada com sucesso',
            receita: { id, criador_id, nome, descricao }
        });
    } catch (error) {
        console.error('Erro ao criar receita:', error);
        return response.status(500).json({ error: 'Erro ao criar receita' });
    }
}

// Atualizar receita
async function update(request, response) {
    const { id } = request.params;
    const { nome, descricao } = request.body;
    
    if (!nome && !descricao) {
        return response.status(400).json({ error: 'Forneça ao menos um campo para atualizar' });
    }
    
    try {
        // Verifica se a receita existe
        const [receitas] = await pool.query('SELECT id FROM receitas WHERE id = ?', [id]);
        
        if (receitas.length === 0) {
            return response.status(404).json({ error: 'Receita não encontrada' });
        }
        
        // Monta a query de atualização dinamicamente
        const fields = [];
        const values = [];
        
        if (nome) {
            fields.push('nome = ?');
            values.push(nome);
        }
        if (descricao !== undefined) {
            fields.push('descricao = ?');
            values.push(descricao);
        }
        
        values.push(id);
        
        await pool.query(
            `UPDATE receitas SET ${fields.join(', ')} WHERE id = ?`,
            values
        );
        
        return response.status(200).json({ message: 'Receita atualizada com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar receita:', error);
        return response.status(500).json({ error: 'Erro ao atualizar receita' });
    }
}

// Deletar receita
async function destroy(request, response) {
    const { id } = request.params;
    
    try {
        const [result] = await pool.query('DELETE FROM receitas WHERE id = ?', [id]);
        
        if (result.affectedRows === 0) {
            return response.status(404).json({ error: 'Receita não encontrada' });
        }
        
        return response.status(200).json({ message: 'Receita deletada com sucesso' });
    } catch (error) {
        console.error('Erro ao deletar receita:', error);
        return response.status(500).json({ error: 'Erro ao deletar receita' });
    }
}

module.exports = {
    index,
    show,
    byUser,
    store,
    update,
    destroy
};
