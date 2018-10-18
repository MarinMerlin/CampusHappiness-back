const Sequelize = require('sequelize');
const id_generator = require('../../custom_module/id_generator');

const choiceConstructor = function (sequelize) {
  const Choice = sequelize.define('choice', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    text: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    value: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    question_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  }, {
    timestamps: false,
  });

  Choice.addChoice = function (text, value, question_id) {
    return new Promise(function (resolve) {
      Choice.sync().then(() => {
        Choice.create({
          id: id_generator(),
          text: text,
          value: value,
          question_id: question_id,
        }).then(() => { resolve(); });
      });
    });
  };
  return Choice;
};

module.exports = choiceConstructor;