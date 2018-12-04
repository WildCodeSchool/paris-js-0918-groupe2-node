'use strict';
module.exports = (sequelize, DataTypes) => {
  const avoir = sequelize.define('avoir', {
    num_avoir: DataTypes.STRING,
    date_avoir: DataTypes.STRING,
    montant_ht: DataTypes.INTEGER,
    montant_ttc: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {});
  avoir.associate = function(models) {
    // associations can be defined here
  };
  return avoir;
};