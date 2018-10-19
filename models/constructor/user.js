const Sequelize = require('sequelize');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const id_generator = require('../../custom_module/id_generator');
const env = require("../../const");
const accountCreationMail = require('../../mail/accountCreation');

const userConstructor = function (sequelize) {
  const User = sequelize.define('user', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING,
    },
    pseudo: {
      type: Sequelize.STRING,
    },
    salt: {
      type: Sequelize.STRING,
    },
    hash: {
      type: Sequelize.STRING,
    },
    auth: {
      type: Sequelize.INTEGER,
    },
    photo: {
      type: Sequelize.STRING,
    },
    lastMailDate: {
      type: Sequelize.DATE,
    },
    mailIntensity: {
      type: Sequelize.INTEGER,
    },
    group_id: {
      type: Sequelize.STRING,
    },
  }, {
    timestamps: false,
  });

  // Class Methods
  User.addUser = function (firstName, lastName, email, pseudo, password, auth, group_id = env.default_group) {
    return new Promise(function (resolve) {
      const generatedID = id_generator();
      const salt = crypto.randomBytes(16).toString('hex');
      User.sync().then(() => {
        User.create({
          id: generatedID,
          firstName,
          lastName,
          email,
          pseudo,
          auth,
          salt,
          hash: crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex'),
          photo: '/user/photo/default.jpg',
          mailIntensity: 1,
          group_id: group_id,
          lastMailDate: Date.now() - 86400000,
        }).then((user) => {
          accountCreationMail({
            ...user.dataValues,
            password: password,
          });
          resolve();
        });
      });
    });
  };

  User.updateUser = function (id, data) {
    return new Promise(function (resolve) {
      const salt = crypto.randomBytes(16).toString('hex');
      if (data.password) {
        User.update(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            pseudo: data.pseudo,
            salt: salt,
            hash: crypto.pbkdf2Sync(data.password, salt, 1000, 64, 'sha512').toString('hex'),
          },
          { where: { id: id } },
        ).then(resolve());
      } else {
        User.update(
          {
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            pseudo: data.pseudo,
          },
          { where: { id: id } },
        ).then(resolve());
      }
    });
  };

  // Instance methods
  User.prototype.validPassword = function (password) {
    const hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
  };

  User.prototype.generateJwt = function (sondage_id, id_remplissage = null) {
    const expiry = new Date();
    const remplissage_id = id_remplissage || id_generator();
    expiry.setDate(expiry.getDate() + env.user_token_expiry_time);
    return jwt.sign({
      user_id: this.id,
      sondage_id: sondage_id,
      remplissage_id: remplissage_id,
      firstName: this.firstName,
      lastName: this.lastName,
      exp: parseInt(expiry.getTime() / 1000, 10),
    }, env.user_token_secret_key);
  };
  return User;
};

module.exports = userConstructor;
