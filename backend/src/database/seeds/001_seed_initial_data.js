const pool = require('../connection');
const { v4: uuidv4 } = require('uuid');

async function seed() {
    const connection = await pool.getConnection();
    try {
        // Criar usuário de teste
        const userId = uuidv4();
        await connection.query(`
            INSERT INTO usuario (id, nome, email, senha)
            VALUES (?, ?, ?, ?)
        `, [userId, 'John Doe', 'michell.rv@gmail.com', 'senha123']);
        
        console.log('Usuário de teste criado!');

        // Criar receita de teste
        const receitaId = uuidv4();
        await connection.query(`
            INSERT INTO receitas (id, criador_id, nome, descricao)
            VALUES (?, ?, ?, ?)
        `, [
            receitaId, 
            userId, 
            'Bolo de Chocolate', 
            'Um delicioso bolo de chocolate com cobertura cremosa. Perfeito para qualquer ocasião!'
        ]);
        
        console.log('Receita de teste criada!');
        console.log('Seeds concluídos!');
    } finally {
        connection.release();
    }
}

module.exports = { seed };
