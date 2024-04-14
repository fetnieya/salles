const express = require('express');
const router = express.Router();
const Reserve = require('../models/reserve');
const authenticate = require('../middleware/auth');
const Salle = require('../models/salle');


// Ajouter une réservation dans la base de données
router.post("/ajouter-reserv", async(req, res) => {
    console.log(req.body);
    const { SalleName, Nom, Capacite, Equipments, Disponibilites, heure_debut, heure_fin, Tarif } = req.body;
    console.log({
        SalleName,
        Nom,
        Capacite,
        Equipments,
        Disponibilites,
        heure_debut,
        heure_fin,
        Tarif,
    });
    try {
        const nouvelleReserve = new Reserve({
            SalleName,
            Nom,
            Capacite,
            Equipments,
            Disponibilites,
            heure_debut,
            heure_fin,
            Tarif,
        });
        await nouvelleReserve.save();
        req.session.message = {
            type: 'success',
            message: 'Ajout avec succès'
        };
        res.redirect('/reserves');
    } catch (error) {
        res.json({ message: error.message, type: 'danger' });
    }
});

router.get('/reserves', async(req, res) => {
    try {
        // Récupérer toutes les réservations de la base de données
        const reserves = await Reserve.find();

        // Passer les données à la vue pour affichage
        res.render('reserves', { reserves });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des reservations', error: error.message });
    }
});

// Route pour afficher le formulaire de modification d'une réservation
router.get("/modifier-reserv/:id", async(req, res) => {
    try {
        // Recherche de la réservation par son ID
        const reserve = await Reserve.findById(req.params.id);
        // Rendu de la page de modification avec les données de la réservation
        res.render('modifier-reserv', { reserve });
    } catch (error) {
        // Gestion de l'erreur en cas de problème lors de la recherche de la réservation
        res.status(400).send('Erreur lors du chargement de la réservation à modifier');
    }
});

// Route Put pour modifier
router.put("/modifier-reserv/:id", async(req, res) => {
    const { id } = req.params;
    try {
        await Reserve.findByIdAndUpdate(id, req.body);
        req.flash('success_msg', 'Modification avec succès');
        res.redirect('/reserves');
    } catch (error) {
        console.error('Erreur lors de la mise à jour :', error.message);
        req.flash('error_msg', 'Erreur lors de la mise à jour');
        res.redirect('/modifier-reserv/' + id); // Redirige vers le formulaire de modification en cas d'erreur
    }
});

// Route Post pour ajouter a la base
router.post("/modifier-reserv/:id", async(req, res) => {
    const reserveId = req.params.id; // Utiliser req.params.id pour obtenir l'ID de la réservation
    try {
        const { Nom, Capacite, Equipments, Disponibilites, heureDebut, heureFin, Tarif } = req.body;
        const updatedReserve = await Reserve.findByIdAndUpdate(reserveId, {
            Nom: Nom,
            Capacite: Capacite,
            Equipments: Equipments,
            Disponibilites: Disponibilites,
            heure_debut: heureDebut,
            heure_fin: heureFin,
            Tarif: Tarif
        }, { new: true }); // Utiliser { new: true } pour retourner le document mis à jour

        if (!updatedReserve) {
            return res.status(404).send("Réservation introuvable");
        }

        req.session.message = {
            type: 'success',
            message: 'Modification de la réservation effectuée avec succès'
        };
        res.redirect('/reserves');
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la modification de la réservation', error: error.message });
    }
});


// GET pour la confirmation de suppression
router.get('/reserves/supprimer/:id', async(req, res) => {
    try {
        // Récupérer l'ID de la réservation à supprimer depuis les paramètres de l'URL
        const { id } = req.params;

        // Utiliser l'ID pour trouver la réservation dans la base de données
        const reserve = await Reserve.findById(id);

        // Vérifier si la réservation existe
        if (!reserve) {
            return res.status(404).send('Réservation non trouvée');
        }

        // Rendre la vue de confirmation de suppression avec les données de la réservation
        res.render('confirmation-suppressionUser', { reserve });
    } catch (error) {
        res.status(500).send('Erreur serveur lors de la récupération de la réservation');
    }
});

// Route DELETE pour la suppression de la réservation
router.delete("/reserves/supprimer/:id", async(req, res) => {
    const reservationId = req.params.id;

    try {
        // Trouver et supprimer la réservation de la base de données
        await Reserve.findByIdAndDelete(reservationId);

        // Redirection vers la page des réservations avec un message de succès
        req.session.message = {
            type: 'success',
            message: 'Réservation supprimée avec succès!'
        };
        res.redirect('/reserves');
    } catch (error) {
        // Gérer les erreurs en cas d'échec de la suppression
        console.error(error);
        req.session.message = {
            type: 'danger',
            message: 'Erreur lors de la suppression de la réservation'
        };
        res.redirect('/reserves');
    }
});





router.get('/indexUser', async(req, res) => {
    res.render('indexUser');
});
router.get('/ajouter-reserv/:id', async(req, res) => {
    const salle = await Salle.findOne({ _id: req.params.id });
    res.render('ajouter-reserv', { salle });
});

router.get('/reserves', (req, res) => {
    res.render('reserves');
});

router.get('/modifier-reserv', (req, res) => {
    res.render('modifier-reserv');
});

module.exports = router;