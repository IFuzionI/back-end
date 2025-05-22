const mongoose = require('mongoose');
const User = require('./models/user.js');

const mongoURL = "mongodb+srv://viccenzo243515:tenera2025@cluster0.efkttba.mongodb.net/tarefasDB?retryWrites=true&w=majority&appName=Cluster0";

async function checkUsers() {
    try {
        await mongoose.connect(mongoURL);
        console.log('Conectado ao MongoDB');

        // Listar todos os usuários
        const users = await User.find({});
        console.log('\nUsuários encontrados:');
        users.forEach(user => {
            console.log('-------------------');
            console.log(`ID: ${user._id}`);
            console.log(`Nome: ${user.nome}`);
            console.log(`Role: ${user.role}`);
            console.log(`Senha (hash): ${user.senha}`);
        });

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDesconectado do MongoDB');
    }
}

checkUsers(); 