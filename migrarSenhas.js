const mongoose = require('mongoose');
const { createHash, randomBytes } = require('crypto');
const userModel = require('./models/user');

mongoose.connect('mongodb+srv://viccenzo243515:tenera2025@cluster0.efkttba.mongodb.net/tarefasDB?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

async function migratePasswords() {
  const users = await userModel.find();

  for (let user of users) {
    const salt = randomBytes(16).toString('hex');
    const hash = createHash('sha256').update('1234' + salt).digest('hex'); // Aqui você coloca a senha padrão ou a atual de cada usuário

    user.hash = hash;
    user.salt = salt;

    await user.save();

    console.log(`Usuário ${user.nome} migrado com sucesso.`);
  }

  mongoose.connection.close();
}

migratePasswords().catch(err => console.error(err));
