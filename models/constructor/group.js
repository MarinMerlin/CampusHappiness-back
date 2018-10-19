const Sequelize = require('sequelize');
const id_generator = require('../../custom_module/id_generator');

const groupConstructor = function (sequelize) {
  const Group = sequelize.define('group', {
    id: {
      allowNull: false,
      type: Sequelize.STRING,
      primaryKey: true,
    },
    sondage_id: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING,
    },
  }, {
    timestamps: false,
  });
  Group.addGroup = function (sondage_id, name, id = id_generator()) {
    return new Promise(function (resolve) {
      Group.sync().then(() => {
        Group.create({
          id: id,
          sondage_id: sondage_id,
          name: name,
        }).then(() => {
          resolve();
        });
      });
    });
  };

  Group.updateGroup = function (group_id, newSondage) {
    Group.update(
      { sondage_id: newSondage },
      { where: { id: group_id } },
    );
  };
  return Group;
};

module.exports = groupConstructor;