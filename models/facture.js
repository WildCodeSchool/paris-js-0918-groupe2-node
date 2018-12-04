'use strict';
module.exports = (sequelize, DataTypes) => {
  const facture = sequelize.define('facture', {
    num_commande: DataTypes.STRING,
    num_confirmation_commande: DataTypes.STRING,
    num_document_transport: DataTypes.STRING,
    num_facture: DataTypes.STRING,
    date_facture: DataTypes.STRING,
    montant_ht: DataTypes.INTEGER,
    montant_ttc: DataTypes.INTEGER,
    echeance_facture: DataTypes.STRING,
    taux_applicable: DataTypes.INTEGER,
    intérets_capitalises: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {});
  facture.associate = function(models) {
    // associations can be defined here
  };
  return facture;
};