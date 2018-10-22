"use strict";

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var Sequelize = require('sequelize');

var crypto = require('crypto');

var jwt = require('jsonwebtoken');

var id_generator = require('../../custom_module/id_generator');

var env = require("../../const");

var accountCreationMail = require('../../mail/accountCreation');

var userConstructor = function userConstructor(sequelize) {
  var User = sequelize.define('user', {
    id: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true
    },
    firstName: {
      allowNull: false,
      type: Sequelize.STRING
    },
    lastName: {
      allowNull: false,
      type: Sequelize.STRING
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING
    },
    pseudo: {
      type: Sequelize.STRING
    },
    salt: {
      type: Sequelize.STRING
    },
    hash: {
      type: Sequelize.STRING
    },
    auth: {
      type: Sequelize.INTEGER
    },
    photo: {
      type: Sequelize.STRING
    },
    lastMailDate: {
      type: Sequelize.DATE
    },
    mailIntensity: {
      type: Sequelize.INTEGER
    },
    group_id: {
      type: Sequelize.STRING
    }
  }, {
    timestamps: false
  }); // Class Methods

  User.addUser = function (firstName, lastName, email, pseudo, password, auth) {
    var group_id = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : env.default_group;
    return new Promise(function (resolve) {
      var generatedID = id_generator();
      var salt = crypto.randomBytes(16).toString('hex');
      User.sync().then(function () {
        User.create({
          id: generatedID,
          firstName: firstName,
          lastName: lastName,
          email: email,
          pseudo: pseudo,
          auth: auth,
          salt: salt,
          hash: crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex'),
          photo: '/user/photo/default.jpg',
          mailIntensity: 1,
          group_id: group_id,
          lastMailDate: Date.now()
        }).then(function (user) {
          accountCreationMail(_objectSpread({}, user.dataValues, {
            password: password
          }));
          resolve();
        });
      });
    });
  };

  User.updateUser = function (id, data) {
    return new Promise(function (resolve) {
      var salt = crypto.randomBytes(16).toString('hex');

      if (data.password) {
        User.update({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          pseudo: data.pseudo,
          salt: salt,
          hash: crypto.pbkdf2Sync(data.password, salt, 1000, 64, 'sha512').toString('hex')
        }, {
          where: {
            id: id
          }
        }).then(resolve());
      } else {
        User.update({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          pseudo: data.pseudo
        }, {
          where: {
            id: id
          }
        }).then(resolve());
      }
    });
  }; // Instance methods


  User.prototype.validPassword = function (password) {
    var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha512').toString('hex');
    return this.hash === hash;
  };

  User.prototype.generateJwt = function (sondage_id) {
    var id_remplissage = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
    var expiry = new Date();
    var remplissage_id = id_remplissage || id_generator();
    expiry.setDate(expiry.getDate() + env.user_token_expiry_time);
    return jwt.sign({
      user_id: this.id,
      sondage_id: sondage_id,
      remplissage_id: remplissage_id,
      firstName: this.firstName,
      lastName: this.lastName,
      exp: parseInt(expiry.getTime() / 1000, 10)
    }, env.user_token_secret_key);
  };

  return User;
};

module.exports = userConstructor;
//# sourceMappingURL=user.js.map