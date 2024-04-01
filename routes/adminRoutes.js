// routes/adminRoutes.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Utilisateur = require('../models/utilisateur');
const isAdmin = require('../middleware/isAdmin'); // Importer le middleware isAdmin
const router = express.Router();

// Endpoint pour créer un utilisateur administrateur (accessible uniquement par un utilisateur admin)
router.post('/creer-admin', isAdmin, async (req, res) => {
  const { Email, password} = req.body;

  try {
    // Vérifier s'il existe déjà un utilisateur avec cet email
    const utilisateurExistant = await Utilisateur.findOne({ email });

    if (utilisateurExistant) {
      return res.status(400).send('Cet email est déjà utilisé.');
    }

    // Créer un hash du mot de passe pour des raisons de sécurité
    const motDePasseHash = await bcrypt.hash(motDePasse, 10);

    // Créer le nouvel utilisateur administrateur
    const nouvelAdmin = new Utilisateur({
      
      Email,
      password: motDePasseHash,
      isAdmin: true, // Définir comme administrateur
    });

    // Sauvegarder l'utilisateur dans la base de données
    await nouvelAdmin.save();

    res.status(201).send('Utilisateur administrateur créé avec succès.');
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur administrateur :', error.message);
    res.status(500).send('Erreur serveur lors de la création de l\'utilisateur administrateur.');
  }
});

module.exports = router;
