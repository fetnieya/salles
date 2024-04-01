// scripts/setup.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Utilisateur = require('../models/utilisateur');

// Connexion à la base de données MongoDB
mongoose.connect(process.env.DB_URI);

// Créer un nouvel utilisateur administrateur
const creerAdmin = async () => {
  try {
    // Vérifier s'il existe déjà un utilisateur administrateur
    const adminExistant = await Utilisateur.findOne({ isAdmin: true });

    if (adminExistant) {
      console.log('Un utilisateur administrateur existe déjà.');
    } else {
      // Créer un hash du mot de passe pour des raisons de sécurité
      const motDePasseHash = await bcrypt.hash('123456789', 10);

      // Créer le nouvel utilisateur administrateur
      const nouvelAdmin = new Utilisateur({
        
        Email: 'admin@gmail.com',
        password: motDePasseHash,
        isAdmin: true, 
      });

      // Sauvegarder l'utilisateur dans la base de données
      await nouvelAdmin.save();
      console.log('Utilisateur administrateur créé avec succès.');
    }

    // Déconnexion de la base de données après l'opération
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur administrateur :', error.message);
    mongoose.connection.close();
  }
};

// Appeler la fonction pour créer l'utilisateur administrateur
creerAdmin();
