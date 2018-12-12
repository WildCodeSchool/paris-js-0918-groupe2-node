const creanciers = require('../models').creancier;

module.exports = {
    list(req, res) {
        return creanciers
        .findAll()
        .then(list => res.status(200).send(list))
        .catch(error => res.status(404).send(error))
    },
    create(req, res) {
        return creanciers
        .create({
            denomination_sociale: req.body.denomination_sociale,
            forme_juridique: req.body.forme_juridique,
            nationalite_societe: req.body.nationalite_societe,
            adresse_siege: req.body.adresse_siege,
            code_postal_siege: req.body.code_postal_siege,
            ville_siege: req.body.ville_siege,
            pays_siege: req.body.pays_siege,
            ville_rcs: req.body.ville_rcs,
            num_rcs: req.body.num_rcs,
            num_CCIAA: req.body.num_CCIAA,
            num_reg_soc: req.body.num_reg_soc,
            num_cod_fisc_tva: req.body.num_cod_fisc_tva,
            capital_social: req.bodycapital_social,
            nom: req.body.nom,
            prenom: req.body.prenom,
            civilite: req.body.civilite,
            fonction: req.body.fonction,
            active: req.body.active
        })
        .then(creancier => res.status(201).send(creancier))
        .catch(error => res.status(400).send(error))
    }
    }