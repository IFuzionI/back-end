const express = require("express");
const router = express.Router();
const modeloTarefa = require("../models/tarefa");
const User = require("../models/UserModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

module.exports = router;

router.post("/post", async (req, res) => {
  const objetoTarefa = new modeloTarefa({
    descricao: req.body.descricao,
    statusRealizada: req.body.statusRealizada,
  });
  try {
    const tarefaSalva = await objetoTarefa.save();
    res.status(200).json(tarefaSalva);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/getAll", verificaJWT, async (req, res, next) => {
  try {
    const resultados = await modeloTarefa.find();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/delete/:id", async (req, res) => {
  try {
    const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const novaTarefa = req.body;
    const options = { new: true };
    const result = await modeloTarefa.findByIdAndUpdate(
      id,
      novaTarefa,
      options
    );
    res.json(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

function verificaUsuarioSenha(req, res, next) {
  if (req.body.nome !== "branqs" || req.body.senha !== "1234") {
    return res
      .status(401)
      .json({ auth: false, message: "Usuario ou Senha incorreta" });
  }
  next();
}

//Autenticacao
router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ 'nome': req.body.nome });
        if (!user) {
            return res.status(401).json({ message: 'Usuário não encontrado' });
        }

        const validPassword = await bcrypt.compare(req.body.senha, user.senha);
        if (!validPassword) {
            return res.status(401).json({ message: 'Senha inválida' });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            'segredo',
            { expiresIn: 300 }
        );

        res.json({
            token: token,
            user: {
                id: user._id,
                nome: user.nome,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Nova forma de Autorizacao
function verificaJWT(req, res, next) {
    const token = req.headers["id-token"];
    if (!token)
        return res
            .status(401)
            .json({ auth: false, message: "Token não fornecido" });

    jwt.verify(token, "segredo", function (err, decoded) {
        if (err) return res.status(500).json({ auth: false, message: "Falha na autenticação!" });
        req.userId = decoded.id;
        req.userRole = decoded.role;
        next();
    });
}
