"use strict";
module.exports = (sequelize, DataTypes) => {
  const facture = sequelize.define(
    "facture",
    {
      num_commande: DataTypes.STRING,
      num_confirmation_commande: DataTypes.STRING,
      num_document_transport: DataTypes.STRING,
      num_facture: DataTypes.STRING,
      date_facture: DataTypes.STRING,
      montant_ht: DataTypes.FLOAT,
      montant_ttc: DataTypes.FLOAT,
      echeance_facture: DataTypes.STRING,
      paiement_echeance: DataTypes.BOOLEAN,
      paiement_livraison: DataTypes.BOOLEAN,
      taux_applicable: DataTypes.FLOAT,
      intérets_capitalises: DataTypes.FLOAT,
      active: DataTypes.BOOLEAN
    },
    {}
  );
  facture.associate = function(models) {
    // associations can be defined here
    facture.hasMany(models.acompte);
    facture.hasMany(models.avoir);
    facture.hasMany(models.partiel);
    facture.belongsTo(models.action);
  };
  return facture;
};
