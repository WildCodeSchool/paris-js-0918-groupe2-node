"use strict";
module.exports = (sequelize, DataTypes) => {
  const action = sequelize.define(
    "action",
    {
      nom_action: DataTypes.STRING,
      date: DataTypes.STRING,
      type: DataTypes.STRING,
      ville_tc_requete: DataTypes.STRING,
      ville_tc_opposition: DataTypes.STRING,
      produits: DataTypes.BOOLEAN,
      services: DataTypes.BOOLEAN,
      calcul_acomptes_payes: DataTypes.FLOAT,
      calcul_solde_du: DataTypes.FLOAT,
      calcul_total_creance: DataTypes.FLOAT,
      calcul_total_interets: DataTypes.FLOAT,
      frais_recouvrement: DataTypes.FLOAT,
      honoraires: DataTypes.FLOAT,
      somme_totale_ttc: DataTypes.FLOAT,
      somme_totale_ht: DataTypes.FLOAT,
      date_mise_en_demeure: DataTypes.STRING,
      active: DataTypes.BOOLEAN
    },
    {}
  );
  action.associate = function(models) {
    // associations can be defined here
    action.belongsTo(models.creancier);
    action.belongsTo(models.debiteur);
    action.hasMany(models.facture);
  };
  return action;
};

// type: DataTypes.ENUM("TYPE1", "TYPE2"),
// and add in config.json:
// "typeValidation": true
// don't forget to modify in migrations
