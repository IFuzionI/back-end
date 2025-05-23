const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const userModel = require('./models/user');

mongoose.connect('mongodb+srv://viccenzo243515:tenera2025@cluster0.efkttba.mongodb.net/tarefasDB?retryWrites=true&w=majority&appName=Cluster0', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

async function updatePasswords() {
  const users = await userModel.find();

  for (let user of users) {
    if (!user.senha.startsWith('$2b$')) {  // Verifica se já é hash
      const hashed = await bcrypt.hash(user.senha, 10);
      user.senha = hashed;
      await user.save();
      console.log(`Senha atualizada para usuário: ${user.nome}`);
    } else {
      console.log(`Usuário ${user.nome} já está com senha hasheada.`);
    }
  }

  mongoose.disconnect();
}

updatePasswords();