const express = require("express");
const router = express.Router();
const modeloTarefa = require("../models/tarefa");
const userModel = require("../models/user");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcrypt');

// Criar nova tarefa
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

// Buscar todas as tarefas (requer login)
router.get("/getAll", verificaJWT, async (req, res) => {
  try {
    const resultados = await modeloTarefa.find();
    res.json(resultados);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Deletar tarefa
router.delete("/delete/:id", async (req, res) => {
  try {
    const resultado = await modeloTarefa.findByIdAndDelete(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Atualizar tarefa
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

// Autenticação JWT (verifica token)
function verificaJWT(req, res, next) {
  const token = req.headers["id-token"];
  if (!token)
    return res
      .status(401)
      .json({ auth: false, message: "Token não fornecido" });

  jwt.verify(token, "segredo", (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .json({ auth: false, message: "Falha na verificação do token" });
    }
    req.userId = decoded.id;
    req.isAdmin = decoded.admin;
    next();
  });
}

// Verifica se o usuário é admin
async function verificaAdmin(req, res, next) {
  const token = req.headers["id-token"];
  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  try {
    const decoded = jwt.verify(token, "segredo");
    const user = await userModel.findById(decoded.id);
    if (!user || !user.admin) {
      return res.status(403).json({ message: "Acesso negado. Não é admin." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ message: "Token inválido" });
  }
}

// Login (autenticação com MongoDB)
router.post("/login", async (req, res) => {
  try {
    const data = await userModel.findOne({ nome: req.body.nome });
    if (data != null) {
      const isPasswordValid = await bcrypt.compare(req.body.senha, data.senha);
      if (isPasswordValid) {
        const token = jwt.sign(
          {
            id: data._id,
            nome: data.nome,
            admin: data.admin === true,
          },
          "segredo",
          { expiresIn: 300 }
        );
        return res.json({ token: token });
      }
    }
    res.status(401).json({ message: "Login inválido!" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// CRUD de usuários (admin only)

// CREATE
router.post("/users", verificaJWT, verificaAdmin, async (req, res) => {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(req.body.senha, saltRounds);

    const user = new userModel({
      nome: req.body.nome,
      senha: hashedPassword,
      admin: req.body.admin || false
    });

    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// READ
router.get("/users", verificaJWT, verificaAdmin, async (req, res) => {
  try {
    const users = await userModel.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// UPDATE
router.patch("/users/:id", verificaJWT, verificaAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.body.senha) {
      const saltRounds = 10;
      updateData.senha = await bcrypt.hash(req.body.senha, saltRounds);
    }

    const user = await userModel.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
    });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE
router.delete("/users/:id", verificaJWT, verificaAdmin, async (req, res) => {
  try {
    await userModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuário deletado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
