const pool = require('../connection');

async function up() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuario (
                id CHAR(36) PRIMARY KEY,
                nome VARCHAR(255) NOT NULL,
                email VARCHAR(255) NOT NULL UNIQUE,
                senha VARCHAR(255) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            )
        `);
        console.log('Tabela usuario criada com sucesso!');
    } finally {
        connection.release();
    }
}

async function down() {
    const connection = await pool.getConnection();
    try {
        await connection.query('DROP TABLE IF EXISTS usuario');
        console.log('Tabela usuario removida com sucesso!');
    } finally {
        connection.release();
    }
}

module.exports = { up, down };
