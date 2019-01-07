"use strict";
module.exports = (sequelize, DataTypes) => {
  const acompte = sequelize.define(
    "acompte",
    {
      num_acompte: DataTypes.STRING,
      date_acompte: DataTypes.STRING,
      montant_ht: DataTypes.FLOAT,
      montant_ttc: DataTypes.FLOAT,
      active: DataTypes.BOOLEAN
    },
    {}
  );
  acompte.associate = function(models) {
    acompte.belongsTo(models.facture);
    // associations can be defined here
  };
  return acompte;
};
