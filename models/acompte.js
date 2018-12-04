'use strict';
module.exports = (sequelize, DataTypes) => {
  const acompte = sequelize.define('acompte', {
    num_acompte: DataTypes.STRING,
    date_acompte: DataTypes.STRING,
    montant_ht: DataTypes.INTEGER,
    montant_ttc: DataTypes.INTEGER,
    active: DataTypes.BOOLEAN
  }, {});
  acompte.associate = function(models) {
    // associations can be defined here
  };
  return acompte;
};