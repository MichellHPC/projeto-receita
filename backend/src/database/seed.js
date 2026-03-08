const fs = require('fs');
const path = require('path');
const pool = require('./connection');

async function runSeeds() {
    const seedsDir = path.join(__dirname, 'seeds');
    const files = fs.readdirSync(seedsDir).sort();

    console.log('Iniciando seeds...');
    
    for (const file of files) {
        if (file.endsWith('.js')) {
            console.log(`Executando seed: ${file}`);
            const seed = require(path.join(seedsDir, file));
            await seed.seed();
        }
    }
    
    console.log('Seeds concluídos!');
    process.exit(0);
}

runSeeds().catch(err => {
    console.error('Erro ao executar seeds:', err);
    process.exit(1);
});
