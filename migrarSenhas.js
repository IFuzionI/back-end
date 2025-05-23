const mongoose = require('mongoose');
const { randomBytes, createHash } = require('crypto');
const userModel = require('./models/user.js'); // ajuste o caminho conforme necessário

mongoose.connect('mongodb+srv://viccenzo243515:tenera2025@cluster0.efkttba.mongodb.net/tarefasDB?retryWrites=true&w=majority&appName=Cluster0', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => {
    console.log('Conectado ao MongoDB');
    migrarUsuarios();
}).catch(err => {
    console.error('Erro ao conectar no MongoDB:', err);
});

async function migrarUsuarios() {
    try {
        const usuarios = await userModel.find({ senha: { $exists: true } });

        console.log(`Encontrado(s) ${usuarios.length} usuário(s) para migrar.`);

        for (const user of usuarios) {
            const salt = randomBytes(16).toString('hex');
            const hash = createHash('sha256').update(user.senha + salt).digest('hex');

            user.hash = hash;
            user.salt = salt;
            user.senha = undefined; // Remove o campo antigo

            await user.save();

            console.log(`Usuário ${user.nome} migrado com sucesso.`);
        }

        console.log('Migração concluída.');
    } catch (err) {
        console.error('Erro durante a migração:', err);
    } finally {
        mongoose.disconnect();
    }
}
