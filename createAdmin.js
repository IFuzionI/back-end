const mongoose = require('mongoose');
const User = require('./models/User');
const bcrypt = require('bcryptjs');

const mongoURL = "mongodb+srv://viccenzo243515:tenera2025@cluster0.efkttba.mongodb.net/tarefasDB?retryWrites=true&w=majority&appName=Cluster0";

async function createAdmin() {
    try {
        await mongoose.connect(mongoURL);
        console.log('Conectado ao MongoDB');

        // Criar senha criptografada
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('123456', salt);

        // Criar usuário admin
        const adminUser = new User({
            nome: 'admin',
            senha: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        console.log('\nUsuário admin criado com sucesso!');
        console.log('Nome: admin');
        console.log('Senha: 123456');
        console.log('Role: admin');

    } catch (error) {
        console.error('Erro:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\nDesconectado do MongoDB');
    }
}

createAdmin(); 