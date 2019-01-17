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
      taux_interets: DataTypes.FLOAT,
      honoraires: DataTypes.FLOAT,
      option_ttc_factures: DataTypes.BOOLEAN,
      option_ttc_hono: DataTypes.BOOLEAN,
      option_1: DataTypes.STRING,
      option_2: DataTypes.STRING,
      option_3: DataTypes.STRING,
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
