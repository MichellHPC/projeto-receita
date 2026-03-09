const pool = require('../connection');
const bcrypt = require('bcryptjs');

async function seed() {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        // Categorias fixas conforme diagrama
        const categorias = [
            [1, 'Bolos e tortas doces'],
            [2, 'Carnes'],
            [3, 'Aves'],
            [4, 'Peixes e frutos do mar'],
            [5, 'Saladas, molhos e acompanhamentos'],
            [6, 'Sopas'],
            [7, 'Massas'],
            [8, 'Bebidas'],
            [9, 'Doces e sobremesas'],
            [10, 'Lanches'],
            [11, 'Prato Unico'],
            [12, 'Light'],
            [13, 'Alimentacao Saudavel']
        ];

        await connection.query(`
            INSERT INTO categorias (id, nome)
            VALUES ?
            ON DUPLICATE KEY UPDATE nome = VALUES(nome)
        `, [categorias]);

        // Criar usuário de teste
        const hashedPassword = await bcrypt.hash('senha123', 12);
        await connection.query(`
            INSERT INTO usuarios (nome, login, senha, criado_em, alterado_em)
            VALUES (?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE
                nome = VALUES(nome),
                senha = VALUES(senha),
                alterado_em = NOW()
        `, ['Usuario Teste', 'usuario.teste', hashedPassword]);

        const [[user]] = await connection.query(
            'SELECT id FROM usuarios WHERE login = ?',
            ['usuario.teste']
        );
        
        console.log('Usuário de teste criado!');

        // Criar receita de teste
        await connection.query(`
            INSERT INTO receitas (
                id_usuarios,
                id_categorias,
                nome,
                tempo_preparo_minutos,
                porcoes,
                modo_preparo,
                ingredientes,
                criado_em,
                alterado_em
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
        `, [
            user.id,
            1,
            'Bolo de Chocolate',
            60,
            8,
            'Misture os ingredientes, leve ao forno por 40 minutos e finalize com cobertura.',
            'Farinha, ovos, leite, chocolate em po, acucar, fermento'
        ]);

        await connection.commit();
        
        console.log('Receita de teste criada!');
        console.log('Seeds concluídos!');
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
}

module.exports = { seed };
