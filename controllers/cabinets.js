const cabinet = require("../models").cabinet;

module.exports = {
  create(req, res) {
    return cabinet
      .create({
        titre: req.body.titre,
        nom: req.body.nom,
        prenom: req.body.prenom,
        num_rue: req.body.num_rue,
        libelle_rue: req.body.libelle_rue,
        code_postal: req.body.code_postal,
        ville: req.body.ville,
        tel: req.body.tel,
        fax: req.body.fax,
        mail: req.body.mail,
        num_TVA: req.body.num_TVA,
        login: req.body.login,
        password: req.body.password,
        logo: req.body.logo,
        signature: req.body.signature
      })
      .then(todo => res.status(201).send(todo))
      .catch(error => res.status(400).send(error));
  },
  list(req, res) {
    return cabinet
      .findAll()
      .then(cabinet => res.status(200).send(cabinet))
      .catch(error => res.status(400).send(error));
  },
  update(req, res) {
    return cabinet
      .findOne(
        { id: req.params.cabinetId },
        {
          include: [
            {
              model: cabinet,
              as: "cabinet"
            }
          ]
        }
      )
      .then(cabinet => {
        if (!cabinet) {
          return res.status(404).send({
            message: "Cabinet Not Found"
          });
        }
        return cabinet
          .update({
            titre: req.body.titre || cabinet.titre,
            nom: req.body.nom || cabinet.nom,
            prenom: req.body.prenom || cabinet.prenom,
            num_rue: req.body.num_rue || cabinet.num_rue,
            libelle_rue: req.body.libelle_rue || cabinet.libelle_rue,
            code_postal: req.body.code_postal || cabinet.code_postal,
            ville: req.body.ville || cabinet.ville,
            tel: req.body.tel || cabinet.tel,
            fax: req.body.fax || cabinet.fax,
            mail: req.body.mail || cabinet.mail,
            num_TVA: req.body.num_TVA || cabinet.num_TVA,
            login: req.body.login || cabinet.login,
            password: req.body.password || cabinet.password,
            logo: req.body.logo || cabinet.logo,
            signature: req.body.signature || cabinet.signature
          })
          .then(() => res.status(200).send(cabinet)) // Send back the updated Cabinet.
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  },
  destroy(req, res) {
    return cabinet
      .findOne({ id: req.params.cabinetId })
      .then(cabinet => {
        if (!cabinet) {
          return res.status(400).send({
            message: "Cabinet Not Found"
          });
        }
        return cabinet
          .destroy()
          .then(() => res.status(204).send())
          .catch(error => res.status(400).send(error));
      })
      .catch(error => res.status(400).send(error));
  }
};
