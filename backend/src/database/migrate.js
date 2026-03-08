const fs = require('fs');
const path = require('path');
const pool = require('./connection');

async function runMigrations() {
    const migrationsDir = path.join(__dirname, 'migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    console.log('Iniciando migrations...');
    
    for (const file of files) {
        if (file.endsWith('.js')) {
            console.log(`Executando migration: ${file}`);
            const migration = require(path.join(migrationsDir, file));
            await migration.up();
        }
    }
    
    console.log('Migrations concluídas!');
    process.exit(0);
}

runMigrations().catch(err => {
    console.error('Erro ao executar migrations:', err);
    process.exit(1);
});
