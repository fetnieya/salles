const express = require('express');
const router = express.Router();
const Salle = require('../models/salle');
const authenticate = require('../middleware/auth');
const Reserve = require('../models/reserve');

router.get('/salles', authenticate, async(req, res) => {
    try {
        // Récupérer l'identifiant de l'administrateur connecté
        const adminId = req.user._id; // Assurez-vous que votre middleware d'authentification place l'identifiant de l'utilisateur dans req.user

        // Récupérer toutes les salles ajoutées par l'administrateur actuellement connecté depuis la base de données
        const salles = await Salle.find({ addedBy: adminId });

        res.render('salles', { salles }); // Passer les données des salles au template EJS
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des salles');
    }
});


//post de  ajout salle
router.post('/ajouter-salle', authenticate, async(req, res) => {
    try {

        const {
            Nom,
            Capacite,
            Equipments,
            dateDebut,
            heureDebut,
            dateFin,
            heureFin,
            Tarif
        } = req.body;

        // Vérifier si tous les champs requis sont présents dans la requête
        if (!Nom) {
            return res.status(400).json({ error: 'Le champ Nom est requis' });
        }

        if (!Capacite) {
            return res.status(400).json({ error: 'Le champ Capacite est requis' });
        }

        if (!dateDebut) {
            return res.status(400).json({ error: 'Le champ Date de début est requis' });
        }

        if (!heureDebut) {
            return res.status(400).json({ error: 'Le champ Heure de début est requis' });
        }

        if (!dateFin) {
            return res.status(400).json({ error: 'Le champ Date de fin est requis' });
        }

        if (!heureFin) {
            return res.status(400).json({ error: 'Le champ Heure de fin est requis' });
        }

        if (!Tarif) {
            return res.status(400).json({ error: 'Le champ Tarif est requis' });
        }




        // Créer une nouvelle salle en utilisant le modèle
        const nouvelleSalle = new Salle({
            Nom,
            Capacite,
            Equipments: Equipments ? Equipments.split(',').map(equipment => equipment.trim()) : [],
            Disponibilites: [{
                dateDebut,
                heureDebut,
                dateFin,
                heureFin,
            }],
            Tarif
        });

        // Enregistrer la nouvelle salle dans la base de données
        await nouvelleSalle.save();

        /*res.status(201).send('Salle ajoutée avec succès');*/
        res.redirect('/salles');

    } catch (error) {
        res.status(400).send('Erreur lors de l\'ajout de la salle');
    }
});
//get pour afficher les salle
router.get('/salles', authenticate, async(req, res) => {
    try {
        // Récupérer toutes les salles depuis la base de données
        const salles = await Salle.find();
        res.render('salles', { salles }); // Passer les données des salles au template EJS
    } catch (error) {
        res.status(500).send('Erreur lors de la récupération des salles');
    }
});



// Route GET pour afficher le formulaire de modification d'une salle
router.get('/modifier/:id', authenticate, async(req, res) => {
    try {
        const salle = await Salle.findById(req.params.id);
        res.render('modifier-salle', { salle }); // Passer la variable salle au rendu de la vue
    } catch (error) {
        res.status(400).send('Erreur lors du chargement de la salle à modifier');
    }
});


// Route PUT pour mettre à jour une salle dans la base de données
router.put('/maj/:id', authenticate, async(req, res) => {
    const { id } = req.params;
    try {
        await Salle.findByIdAndUpdate(id, req.body); // Met à jour la salle avec les données du formulaire
        req.flash('success_msg', 'Salle modifiée avec succès');
        res.redirect('/salles');
    } catch (error) {
        console.error('Erreur lors de la mise à jour de la salle :', error.message);
        req.flash('error_msg', 'Erreur lors de la mise à jour de la salle');
        res.redirect('/modifier/' + id); // Redirige vers le formulaire de modification en cas d'erreur
    }
});

// POST route pour la modification de la salle
router.post('/maj/:id', authenticate, async(req, res) => {
    const salleId = req.params.id;

    try {
        // Récupérer les données de la salle à modifier depuis le corps de la requête
        const { Nom, Capacite, Equipments, DateDebut, HeureDebut, DateFin, HeureFin, Tarif } = req.body;

        // Modifier la salle dans la base de données
        await Salle.findByIdAndUpdate(salleId, {
            Nom,
            Capacite,
            Equipments: Equipments ? Equipments.split(',').map(equipment => equipment.trim()) : [],
            Disponibilites: [{
                dateDebut: DateDebut,
                heureDebut: HeureDebut,
                dateFin: DateFin,
                heureFin: HeureFin,
            }],
            Tarif
        });

        res.redirect('/salles'); // Rediriger vers la liste des salles après la modification
    } catch (error) {
        res.status(400).send('Erreur lors de la modification de la salle');
    }
});


// GET pour la confirmation de suppression
router.get('/salle/supprimer/:id', authenticate, async(req, res) => {
    try {
        // Récupérer l'ID de la salle à supprimer depuis les paramètres de l'URL
        const { id } = req.params;

        // Utiliser l'ID pour trouver la salle dans la base de données
        const salle = await Salle.findById(id);

        // Vérifier si la salle existe
        if (!salle) {
            return res.status(404).send('Salle non trouvée');
        }

        // Rendre la vue de confirmation de suppression avec les données de la salle
        res.render('confirmation-suppression', { salle });
    } catch (error) {
        res.status(500).send('Erreur serveur lors de la récupération de la salle');
    }
});


router.delete('/supprimer/:id', authenticate, async(req, res) => {
    const salleId = req.params.id;

    try {
        // Supprimer la salle de la base de données en utilisant son ID
        await Salle.findByIdAndDelete(salleId);

        res.redirect('/salles'); // Rediriger vers la liste des salles après la suppression
    } catch (error) {
        res.status(400).send('Erreur lors de la suppression de la salle');
    }
});








router.get('/', authenticate, (req, res) => {
    res.render('index');
});

router.get('/ajouter-salle', (req, res) => {
    res.render('ajouter-salle');
});

router.get('/salles', (req, res) => {
    res.render('salles');
});
router.get('modifier/:id', (req, res) => {
    res.render('modifier-salle');
});

module.exports = router;