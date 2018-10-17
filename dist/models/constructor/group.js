"use strict";

var Sequelize = require('sequelize');

var id_generator = require('../../custom_module/id_generator');

var groupConstructor = function groupConstructor(sequelize) {
  var Group = sequelize.define('group', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true
    },
    sondage_id: {
      allowNull: false,
      type: Sequelize.STRING
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING
    }
  }, {
    timestamps: false
  });

  Group.addGroup = function (sondage_id, name) {
    var id = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : id_generator();
    return new Promise(function (resolve) {
      Group.sync().then(function () {
        Group.create({
          id: id,
          sondage_id: sondage_id,
          name: name
        }).then(function () {
          resolve();
        });
      });
    });
  };

  Group.updateGroup = function (group_id, newSondage) {
    Group.update({
      sondage_id: newSondage
    }, {
      where: {
        id: group_id
      }
    });
  };

  return Group;
};

module.exports = groupConstructor;
//# sourceMappingURL=group.js.map