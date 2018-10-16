"use strict";

var Sequelize = require('sequelize');

var id_generator = require('../../custom_module/id_generator');

var keywordConstructor = function keywordConstructor(sequelize) {
  var Keyword = sequelize.define('keyword', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING
    }
  }, {
    timestamps: false
  });

  Keyword.addKeyword = function (name) {
    // id optionnal
    return new Promise(function (resolve) {
      Keyword.sync().then(function () {
        Keyword.findOrCreate({
          where: {
            name: name
          },
          defaults: {
            name: name,
            id: id_generator()
          }
        }).spread(function (keyword) {
          resolve(keyword.dataValues);
        });
      });
    });
  };

  return Keyword;
};

module.exports = keywordConstructor;
//# sourceMappingURL=keyword.js.map