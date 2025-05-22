const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const mongoURL = "mongodb+srv://viccenzo243515:tenera2025@cluster0.efkttba.mongodb.net/tarefasDB?retryWrites=true&w=majority&appName=Cluster0";

async function createNewAdmin() {
    try {
        await mongoose.connect(mongoURL);
        console.log('Conectado ao MongoDB');

        // Primeiro, remover todos os usuários existentes
        await User.deleteMany({});
        console.log('Usuários antigos removidos');

        // Criar senha criptografada
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Criar usuário admin
        const adminUser = new User({
            nome: 'admin',
            senha: hashedPassword,
            role: 'admin'
        });

        const savedUser = await adminUser.save();
        console.log('\nNovo usuário admin criado com sucesso!');
        console.log('-------------------');
        console.log(`ID: ${savedUser._id}`);
        console.log(`Nome: ${savedUser.nome}`);
        console.log(`Role: ${savedUser.role}`);
        console.log(`Senha: 123456`);

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDesconectado do MongoDB');
    }
}

createNewAdmin(); 