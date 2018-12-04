'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('actions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.STRING
      },
      type: {
        type: Sequelize.STRING
      },
      ville_tc_requete: {
        type: Sequelize.STRING
      },
      ville_tc_opposition: {
        type: Sequelize.STRING
      },
      produits: {
        type: Sequelize.BOOLEAN
      },
      services: {
        type: Sequelize.BOOLEAN
      },
      calcul_acomptes_payes: {
        type: Sequelize.INTEGER
      },
      calcul_solde_du: {
        type: Sequelize.INTEGER
      },
      calcul_total_creance: {
        type: Sequelize.INTEGER
      },
      calcul_total_interets: {
        type: Sequelize.INTEGER
      },
      frais_recouvrement: {
        type: Sequelize.INTEGER
      },
      honoraires: {
        type: Sequelize.INTEGER
      },
      somme_totale_ttc: {
        type: Sequelize.INTEGER
      },
      somme_totale_ht: {
        type: Sequelize.INTEGER
      },
      date_mise_en_demeure: {
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
    return queryInterface.dropTable('actions');
  }
};