"use strict";
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("factures", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      num_commande: {
        type: Sequelize.STRING
      },
      num_confirmation_commande: {
        type: Sequelize.STRING
      },
      num_document_transport: {
        type: Sequelize.STRING
      },
      num_facture: {
        type: Sequelize.STRING
      },
      date_facture: {
        type: Sequelize.STRING
      },
      montant_ht: {
        type: Sequelize.FLOAT
      },
      montant_ttc: {
        type: Sequelize.FLOAT
      },
      echeance_facture: {
        type: Sequelize.STRING
      },
      taux_applicable: {
        type: Sequelize.FLOAT
      },
      intérets_capitalises: {
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
    return queryInterface.dropTable("factures");
  }
};
