"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("creanciers", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      denomination_sociale: {
        type: Sequelize.STRING
      },
      forme_juridique: {
        type: Sequelize.STRING
      },
      nationalite_societe: {
        type: Sequelize.STRING
      },
      adresse_siege: {
        type: Sequelize.STRING
      },
      code_postal_siege: {
        type: Sequelize.STRING
      },
      ville_siege: {
        type: Sequelize.STRING
      },
      pays_siege: {
        type: Sequelize.STRING
      },
      ville_rcs: {
        type: Sequelize.STRING
      },
      num_rcs: {
        type: Sequelize.STRING
      },
      num_CCIAA: {
        type: Sequelize.STRING
      },
      num_reg_soc: {
        type: Sequelize.STRING
      },
      num_cod_fisc_tva: {
        type: Sequelize.STRING
      },
      capital_social: {
        type: Sequelize.STRING
      },
      nom: {
        type: Sequelize.STRING
      },
      prenom: {
        type: Sequelize.STRING
      },
      civilite: {
        type: Sequelize.STRING
      },
      fonction: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable("creanciers");
  }
};
