"use strict";
module.exports = (sequelize, DataTypes) => {
  const avoir = sequelize.define(
    "avoir",
    {
      num_avoir: DataTypes.STRING,
      date_avoir: DataTypes.STRING,
      montant_ht: DataTypes.FLOAT,
      montant_ttc: DataTypes.FLOAT,
      active: DataTypes.BOOLEAN
    },
    {}
  );
  avoir.associate = function(models) {
    // associations can be defined here
    avoir.belongsTo(models.facture);
  };
  return avoir;
};
