var mongoose = require("mongoose");

var userSchema = new mongoose.Schema(
  {
    nome: { unique: true, type: String, required: true }, //required: true	Impede que nome ou senha fiquem vazios no banco -------- unique: true	Garante que nomes não se repitam
    senha: { type: String, required: true },
    admin: { type: Boolean, default: false }
  },
  { versionKey: false } //versionKey: false	Remove campo inútil __v
);

module.exports = mongoose.model("User", userSchema);