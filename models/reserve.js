const mongoose = require('mongoose');

const reserveSchema = new mongoose.Schema({
    Nom: { type: String, required: true },
    Capacite: { type: String, required: true },
    Equipments: [{ type: String }],
    Disponibilites: [{ type: Date, required: true }],
    heure_debut: { type: String, required: true }, // Utilisation de String pour l'heure de début
    heure_fin: { type: String, required: true }, // Utilisation de String pour l'heure de fin
    Tarif: { type: Number, required: true },
    addedByAdmin: {
        type: Boolean,
        default: false
    }

});


const Reserve = mongoose.model('Reserve', reserveSchema);

module.exports = Reserve;