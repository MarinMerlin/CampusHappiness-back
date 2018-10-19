"use strict";

var Sequelize = require('sequelize');

var id_generator = require('../../custom_module/id_generator');

var choiceConstructor = function choiceConstructor(sequelize) {
  var Choice = sequelize.define('choice', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false
    },
    value: {
      type: Sequelize.INTEGER,
      allowNull: false
    },
    question_id: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    timestamps: false
  });

  Choice.addChoice = function (text, value, question_id) {
    return new Promise(function (resolve) {
      Choice.sync().then(function () {
        Choice.create({
          id: id_generator(),
          text: text,
          value: value,
          question_id: question_id
        }).then(function () {
          resolve();
        });
      });
    });
  };

  return Choice;
};

module.exports = choiceConstructor;
//# sourceMappingURL=choice.js.map