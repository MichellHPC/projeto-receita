const pool = require('../connection');

async function up() {
    const connection = await pool.getConnection();
    try {
        await connection.query(`
            CREATE TABLE IF NOT EXISTS receitas (
                id INT UNSIGNED NOT NULL AUTO_INCREMENT,
                id_usuarios INT(10) UNSIGNED NOT NULL,
                id_categorias INT(10) UNSIGNED NULL,
                nome VARCHAR(45) NULL,
                tempo_preparo_minutos INT UNSIGNED NULL,
                porcoes INT UNSIGNED NULL,
                modo_preparo TEXT NOT NULL,
                ingredientes TEXT NULL,
                criado_em DATETIME NOT NULL,
                alterado_em DATETIME NOT NULL,
                PRIMARY KEY (id),
                INDEX fk_receitas_1_idx (id_usuarios ASC),
                INDEX fk_receitas_2_idx (id_categorias ASC),
                CONSTRAINT fk_receitas_1
                    FOREIGN KEY (id_usuarios)
                    REFERENCES usuarios (id)
                    ON DELETE RESTRICT
                    ON UPDATE CASCADE,
                CONSTRAINT fk_receitas_2
                    FOREIGN KEY (id_categorias)
                    REFERENCES categorias (id)
                    ON DELETE CASCADE
                    ON UPDATE CASCADE
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
