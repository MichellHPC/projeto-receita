const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'usuario_teste',
    password: process.env.DB_PASSWORD || 'senha123',
    database: process.env.DB_NAME || 'teste_receitas_rg_sistemas',
    port: Number(process.env.DB_PORT || 3306),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
