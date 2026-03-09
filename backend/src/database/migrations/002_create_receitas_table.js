const pool = require('../connection');

async function up() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS categorias (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                nome VARCHAR(100) NULL,
                PRIMARY KEY (id),
                UNIQUE INDEX nome_UNIQUE (nome ASC)
            )
        `);
        console.log('Tabela categorias criada com sucesso!');
    } finally {
        connection.release();
    }
}

async function down() {
    const connection = await pool.getConnection();
    try {
        await connection.query('DROP TABLE IF EXISTS categorias');
        console.log('Tabela categorias removida com sucesso!');
    } finally {
        connection.release();
    }
}

module.exports = { up, down };
