const pool = require('../database/connection');

// Listar todas as receitas
async function index(request, response) {
    try {
        const [receitas] = await pool.query(`
            SELECT 
                r.id, 
                r.id_usuarios,
                r.id_categorias,
                r.nome, 
                r.tempo_preparo_minutos,
                r.porcoes,
                r.modo_preparo,
                r.ingredientes,
                r.criado_em,
                r.alterado_em,
                u.nome AS usuario_nome,
                u.login AS usuario_login,
                c.nome AS categoria_nome
            FROM receitas r
            INNER JOIN usuarios u ON r.id_usuarios = u.id
            LEFT JOIN categorias c ON r.id_categorias = c.id
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
                r.id_usuarios,
                r.id_categorias,
                r.nome, 
                r.tempo_preparo_minutos,
                r.porcoes,
                r.modo_preparo,
                r.ingredientes,
                r.criado_em,
                r.alterado_em,
                u.nome AS usuario_nome,
                u.login AS usuario_login,
                c.nome AS categoria_nome
            FROM receitas r
            INNER JOIN usuarios u ON r.id_usuarios = u.id
            LEFT JOIN categorias c ON r.id_categorias = c.id
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
    const userId = request.params.id_usuario || request.params.criador_id;
    
    try {
        const [receitas] = await pool.query(`
            SELECT 
                r.id, 
                r.id_usuarios,
                r.id_categorias,
                r.nome, 
                r.tempo_preparo_minutos,
                r.porcoes,
                r.modo_preparo,
                r.ingredientes,
                r.criado_em,
                r.alterado_em,
                u.nome AS usuario_nome,
                u.login AS usuario_login,
                c.nome AS categoria_nome
            FROM receitas r
            INNER JOIN usuarios u ON r.id_usuarios = u.id
            LEFT JOIN categorias c ON r.id_categorias = c.id
            WHERE r.id_usuarios = ?
        `, [userId]);
        
        return response.status(200).json(receitas);
    } catch (error) {
        console.error('Erro ao buscar receitas do usuário:', error);
        return response.status(500).json({ error: 'Erro ao buscar receitas do usuário' });
    }
}

// Criar nova receita
async function store(request, response) {
    const {
        id_usuarios,
        id_categorias,
        nome,
        tempo_preparo_minutos,
        porcoes,
        modo_preparo,
        ingredientes
    } = request.body;
    
    if (!id_usuarios || !modo_preparo) {
        return response.status(400).json({ error: 'id_usuarios e modo_preparo são obrigatórios' });
    }
    
    try {
        // Verifica se o usuário existe
        const [users] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id_usuarios]);
        
        if (users.length === 0) {
            return response.status(404).json({ error: 'Usuário criador não encontrado' });
        }

        if (id_categorias) {
            const [categorias] = await pool.query('SELECT id FROM categorias WHERE id = ?', [id_categorias]);
            if (categorias.length === 0) {
                return response.status(404).json({ error: 'Categoria não encontrada' });
            }
        }
        
        await pool.query(
            `INSERT INTO receitas (
                id_usuarios,
                id_categorias,
                nome,
                tempo_preparo_minutos,
                porcoes,
                modo_preparo,
                ingredientes,
                criado_em,
                alterado_em
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
            [
                id_usuarios,
                id_categorias || null,
                nome || null,
                tempo_preparo_minutos || null,
                porcoes || null,
                modo_preparo,
                ingredientes || null
            ]
        );

        const [insertedRows] = await pool.query('SELECT LAST_INSERT_ID() AS id');
        const receitaId = insertedRows[0].id;
        
        return response.status(201).json({
            message: 'Receita criada com sucesso',
            receita: {
                id: receitaId,
                id_usuarios,
                id_categorias: id_categorias || null,
                nome: nome || null,
                tempo_preparo_minutos: tempo_preparo_minutos || null,
                porcoes: porcoes || null,
                modo_preparo,
                ingredientes: ingredientes || null
            }
        });
    } catch (error) {
        console.error('Erro ao criar receita:', error);
        return response.status(500).json({ error: 'Erro ao criar receita' });
    }
}

// Atualizar receita
async function update(request, response) {
    const { id } = request.params;
    const {
        id_usuarios,
        id_categorias,
        nome,
        tempo_preparo_minutos,
        porcoes,
        modo_preparo,
        ingredientes
    } = request.body;
    
    if (
        id_usuarios === undefined &&
        id_categorias === undefined &&
        nome === undefined &&
        tempo_preparo_minutos === undefined &&
        porcoes === undefined &&
        modo_preparo === undefined &&
        ingredientes === undefined
    ) {
        return response.status(400).json({ error: 'Forneça ao menos um campo para atualizar' });
    }
    
    try {
        // Verifica se a receita existe
        const [receitas] = await pool.query('SELECT id FROM receitas WHERE id = ?', [id]);
        
        if (receitas.length === 0) {
            return response.status(404).json({ error: 'Receita não encontrada' });
        }

        if (id_usuarios !== undefined) {
            const [users] = await pool.query('SELECT id FROM usuarios WHERE id = ?', [id_usuarios]);
            if (users.length === 0) {
                return response.status(404).json({ error: 'Usuário não encontrado' });
            }
        }

        if (id_categorias !== undefined && id_categorias !== null) {
            const [categorias] = await pool.query('SELECT id FROM categorias WHERE id = ?', [id_categorias]);
            if (categorias.length === 0) {
                return response.status(404).json({ error: 'Categoria não encontrada' });
            }
        }
        
        // Monta a query de atualização dinamicamente
        const fields = [];
        const values = [];
        
        if (id_usuarios !== undefined) {
            fields.push('id_usuarios = ?');
            values.push(id_usuarios);
        }
        if (id_categorias !== undefined) {
            fields.push('id_categorias = ?');
            values.push(id_categorias);
        }
        if (nome !== undefined) {
            fields.push('nome = ?');
            values.push(nome);
        }
        if (tempo_preparo_minutos !== undefined) {
            fields.push('tempo_preparo_minutos = ?');
            values.push(tempo_preparo_minutos);
        }
        if (porcoes !== undefined) {
            fields.push('porcoes = ?');
            values.push(porcoes);
        }
        if (modo_preparo !== undefined) {
            fields.push('modo_preparo = ?');
            values.push(modo_preparo);
        }
        if (ingredientes !== undefined) {
            fields.push('ingredientes = ?');
            values.push(ingredientes);
        }

        fields.push('alterado_em = NOW()');
        
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
