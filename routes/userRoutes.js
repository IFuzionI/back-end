const express = require('express');
const router = express.Router();
const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Middleware para verificar se o usuário está autenticado
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

// Middleware para verificar se o usuário é admin
const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.userId);
        if (user && user.role === 'admin') {
            next();
        } else {
            res.status(403).json({ message: 'Acesso negado. Apenas administradores podem realizar esta operação.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Erro ao verificar permissões' });
    }
};

// Rota para obter informações do usuário logado
router.get('/me', verificaJWT, async (req, res) => {
    try {
        const user = await User.findById(req.userId, { senha: 0 });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
});

// Rota especial para criar o primeiro usuário admin
router.post('/first-admin', async (req, res) => {
    try {
        // Verifica se já existe algum usuário admin
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            return res.status(400).json({ message: 'Já existe um usuário administrador no sistema.' });
        }

        const { nome, senha } = req.body;
        if (!nome || !senha) {
            return res.status(400).json({ message: 'Nome e senha são obrigatórios.' });
        }

        // Verifica se o nome já existe
        const existingUser = await User.findOne({ nome });
        if (existingUser) {
            return res.status(400).json({ message: 'Nome de usuário já cadastrado.' });
        }

        // Criptografa a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        // Cria o usuário admin
        const adminUser = new User({
            nome,
            senha: hashedPassword,
            role: 'admin'
        });

        await adminUser.save();
        res.status(201).json({ message: 'Usuário administrador criado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário administrador.' });
    }
});

// Listar todos os usuários (apenas admin)
router.get('/', isAdmin, async (req, res) => {
    try {
        const users = await User.find({}, { senha: 0 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
});

// Buscar usuário por ID (apenas admin)
router.get('/:id', isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id, { senha: 0 });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
});

// Criar novo usuário (apenas admin)
router.post('/', isAdmin, async (req, res) => {
    try {
        const { nome, senha, role } = req.body;

        // Verificar se o nome já existe
        const existingUser = await User.findOne({ nome });
        if (existingUser) {
            return res.status(400).json({ message: 'Nome de usuário já cadastrado' });
        }

        // Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const newUser = new User({
            nome,
            senha: hashedPassword,
            role: role || 'user'
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuário criado com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
});

// Atualizar usuário (apenas admin)
router.put('/:id', isAdmin, async (req, res) => {
    try {
        const { nome, senha, role } = req.body;
        const updateData = {};

        if (nome) updateData.nome = nome;
        if (role) updateData.role = role;

        if (senha) {
            const salt = await bcrypt.genSalt(10);
            updateData.senha = await bcrypt.hash(senha, salt);
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, select: '-senha' }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
});

// Remover usuário (apenas admin)
router.delete('/:id', isAdmin, async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json({ message: 'Usuário removido com sucesso' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao remover usuário' });
    }
});

module.exports = router; 