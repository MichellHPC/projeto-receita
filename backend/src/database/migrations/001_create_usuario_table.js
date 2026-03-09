const pool = require('../connection');

async function up() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS usuarios (
                id INT(10) UNSIGNED NOT NULL AUTO_INCREMENT,
                nome VARCHAR(100) NULL,
                login VARCHAR(100) NOT NULL,
                senha VARCHAR(100) NOT NULL,
                criado_em DATETIME NOT NULL,
                alterado_em DATETIME NOT NULL,
                PRIMARY KEY (id),
                UNIQUE INDEX login_UNIQUE (login ASC)
            )
        `);
        console.log('Tabela usuarios criada com sucesso!');
    } finally {
        connection.release();
    }
}

async function down() {
    const connection = await pool.getConnection();
    try {
        await connection.query('DROP TABLE IF EXISTS usuarios');
        console.log('Tabela usuarios removida com sucesso!');
    } finally {
        connection.release();
    }
}

module.exports = { up, down };
