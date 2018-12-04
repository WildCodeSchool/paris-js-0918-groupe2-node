'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('cabinets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titre: {
        type: Sequelize.STRING
      },
      nom: {
        type: Sequelize.STRING
      },
      prenom: {
        type: Sequelize.STRING
      },
      num_rue: {
        type: Sequelize.STRING
      },
      libelle_rue: {
        type: Sequelize.STRING
      },
      code_postal: {
        type: Sequelize.INTEGER
      },
      ville: {
        type: Sequelize.STRING
      },
      tel: {
        type: Sequelize.STRING
      },
      fax: {
        type: Sequelize.STRING
      },
      mail: {
        type: Sequelize.STRING
      },
      num_TVA: {
        type: Sequelize.STRING
      },
      login: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.STRING
      },
      logo: {
        type: Sequelize.STRING
      },
      signature: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('cabinets');
  }
};