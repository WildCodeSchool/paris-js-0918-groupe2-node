"use strict";
module.exports = (sequelize, DataTypes) => {
  const cabinet = sequelize.define(
    "cabinet",
    {
      titre: DataTypes.STRING,
      nom: DataTypes.STRING,
      prenom: DataTypes.STRING,
      num_rue: DataTypes.STRING,
      libelle_rue: DataTypes.STRING,
      code_postal: DataTypes.STRING,
      ville: DataTypes.STRING,
      tel: DataTypes.STRING,
      fax: DataTypes.STRING,
      mail: DataTypes.STRING,
      num_TVA: DataTypes.STRING,
      login: DataTypes.STRING,
      password: DataTypes.STRING,
      logo: DataTypes.STRING,
      signature: DataTypes.STRING
    },
    {}
  );
  cabinet.associate = function(models) {
    // associations can be defined here
    cabinet.hasMany(models.creancier);
  };
  return cabinet;
};
