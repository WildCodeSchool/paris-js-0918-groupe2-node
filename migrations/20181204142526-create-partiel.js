"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("partiels", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      num_partiel: {
        type: Sequelize.STRING
      },
      date_partiel: {
        type: Sequelize.STRING
      },
      montant_ht: {
        type: Sequelize.FLOAT
      },
      montant_ttc: {
        type: Sequelize.FLOAT
      },
      active: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("partiels");
  }
};
