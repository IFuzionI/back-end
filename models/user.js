var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
    senha: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
}, {
    versionKey: false
});

module.exports = mongoose.model('User', userSchema);