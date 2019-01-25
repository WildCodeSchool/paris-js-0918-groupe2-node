"use strict";
module.exports = (sequelize, DataTypes) => {
  const partiel = sequelize.define(
    "partiel",
    {
      num_partiel: DataTypes.STRING,
      date_partiel: DataTypes.STRING,
      montant_ht: DataTypes.FLOAT,
      montant_ttc: DataTypes.FLOAT,
      active: DataTypes.BOOLEAN
    },
    {}
  );
  partiel.associate = function(models) {
    partiel.belongsTo(models.facture);
    // associations can be defined here
  };
  return partiel;
};
