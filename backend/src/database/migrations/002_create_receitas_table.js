const pool = require('../connection');

async function up() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS receitas (
                id CHAR(36) PRIMARY KEY,
                criador_id CHAR(36) NOT NULL,
                nome VARCHAR(255) NOT NULL,
                descricao TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                FOREIGN KEY (criador_id) REFERENCES usuario(id) ON DELETE CASCADE
            )
        `);
        console.log('Tabela receitas criada com sucesso!');
    } finally {
        connection.release();
    }
}

async function down() {
    const connection = await pool.getConnection();
    try {
        await connection.query('DROP TABLE IF EXISTS receitas');
        console.log('Tabela receitas removida com sucesso!');
    } finally {
        connection.release();
    }
}

module.exports = { up, down };
