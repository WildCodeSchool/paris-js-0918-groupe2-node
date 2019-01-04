"use strict";
module.exports = (sequelize, DataTypes) => {
  const action = sequelize.define(
    "action",
    {
      date: DataTypes.STRING,
      type: DataTypes.STRING,
      ville_tc_requete: DataTypes.STRING,
      ville_tc_opposition: DataTypes.STRING,
      produits: DataTypes.BOOLEAN,
      services: DataTypes.BOOLEAN,
      calcul_acomptes_payes: DataTypes.INTEGER,
      calcul_solde_du: DataTypes.INTEGER,
      calcul_total_creance: DataTypes.INTEGER,
      calcul_total_interets: DataTypes.INTEGER,
      frais_recouvrement: DataTypes.INTEGER,
      honoraires: DataTypes.INTEGER,
      somme_totale_ttc: DataTypes.INTEGER,
      somme_totale_ht: DataTypes.INTEGER,
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
