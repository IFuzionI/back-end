const mongoose = require('mongoose');
const User = require('./models/User');

const mongoURL = "mongodb+srv://viccenzo243515:tenera2025@cluster0.efkttba.mongodb.net/tarefasDB?retryWrites=true&w=majority&appName=Cluster0";

async function listAndRemoveUsers() {
    try {
        await mongoose.connect(mongoURL);
        console.log('Conectado ao MongoDB');

        // Listar todos os usuários
        const users = await User.find({}, { senha: 0 });
        console.log('\nUsuários encontrados:');
        users.forEach(user => {
            console.log(`ID: ${user._id}`);
            console.log(`Nome: ${user.nome}`);
            console.log(`Role: ${user.role}`);
            console.log('-------------------');
        });

        // Perguntar se deseja remover todos os usuários
        console.log('\nDeseja remover todos os usuários? (s/n)');
        process.stdin.once('data', async (data) => {
            const answer = data.toString().trim().toLowerCase();
            
            if (answer === 's') {
                await User.deleteMany({});
                console.log('Todos os usuários foram removidos com sucesso!');
            } else {
                console.log('Operação cancelada.');
            }
            
            await mongoose.disconnect();
            console.log('Desconectado do MongoDB');
            process.exit(0);
        });

    } catch (error) {
        console.error('Erro:', error);
        process.exit(1);
    }
}

listAndRemoveUsers(); 