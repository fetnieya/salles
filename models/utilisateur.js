const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const utilisateurSchema = new mongoose.Schema({
  Email: { type: String, required: true, unique: true },
  password : { type: String, required: true },
  isAdmin: {
    type: Boolean,
    default: false, // Par défaut, l'utilisateur n'est pas administrateur
  },
});

utilisateurSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
  };

const Utilisateur = mongoose.model('Utilisateur', utilisateurSchema);

module.exports = Utilisateur;
