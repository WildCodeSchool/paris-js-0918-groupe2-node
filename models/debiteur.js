"use strict";
module.exports = (sequelize, DataTypes) => {
  const debiteur = sequelize.define(
    "debiteur",
    {
      denomination_sociale: DataTypes.STRING,
      forme_juridique: DataTypes.STRING,
      nationalite_societe: DataTypes.STRING,
      adresse_siege: DataTypes.STRING,
      code_postal_siege: DataTypes.INTEGER,
      ville_siege: DataTypes.STRING,
      pays_siege: DataTypes.STRING,
      ville_rcs: DataTypes.STRING,
      num_rcs: DataTypes.STRING,
      nom: DataTypes.STRING,
      prenom: DataTypes.STRING,
      civilite: DataTypes.STRING,
      fonction: DataTypes.STRING,
      active: DataTypes.BOOLEAN
    },
    {}
  );
  debiteur.associate = function(models) {
    // associations can be defined here
    debiteur.hasMany(models.action);
    // debiteur.hasMany(models.facture);
  };
  return debiteur;
};
