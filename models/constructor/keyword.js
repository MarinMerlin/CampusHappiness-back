const Sequelize = require('sequelize');
const id_generator = require('../../custom_module/id_generator');

const keywordConstructor = function (sequelize) {
  const Keyword = sequelize.define('keyword', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
  }, {
    timestamps: false,
  });
  Keyword.addKeyword = function (name) { // id optionnal
    return new Promise(function (resolve) {
      Keyword.sync().then(() => {
        Keyword.findOrCreate({ 
          where: { name: name },
          defaults: { name: name, id: id_generator() },
        }).spread((keyword) => {
          resolve(keyword.dataValues);
        });
      });
    });
  };
  return Keyword;
};

module.exports = keywordConstructor;