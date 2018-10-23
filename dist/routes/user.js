"use strict";

var express = require('express');

var router = express.Router();

var fs = require('fs'); // Le body Parser permet d'acceder aux variable envoyés dans le body


var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(express.urlencoded({
  extended: false
}));

var morgan = require('morgan');

router.use(morgan('dev')); // Récupère les models

var Models = require('../models');

router.use(function (req, res, next) {
  if (!req.isAuthenticated() && req.url !== '/login') {
    res.status(401).json({
      message: 'Not logged in'
    });
  } else {
    next();
  }
}); // --------- Routes protegées-------------

router.post('/updateUser', function (req, res) {
  var newCookie = Object.assign(req.user, req.body.updatedUser);
  req.login(newCookie, function () {
    console.log("Modified cookie: ", newCookie);
  });
  Models.User.updateUser(req.user.id, req.body.updatedUser).then(function () {
    res.status(200).json(req.body.updatedUser);
  });
});
router.post('/updatePhoto', function (req, res) {
  var base64Data = req.body.photo.replace(/^data:image\/jpeg;base64,/, "");
  fs.writeFile("./public/user/photo/".concat(req.user.pseudo, ".jpg"), base64Data, 'base64', function (err) {
    if (err) {
      console.log(err);
    } else {
      Models.User.update({
        photo: "/user/photo/".concat(req.user.pseudo, ".jpg")
      }, {
        where: {
          id: req.user.id
        }
      }).then(function () {
        res.status(200).json({
          photo: "/user/photo/".concat(req.user.pseudo, ".jpg")
        });
      });
    }
  });
});
router.get('/getToken', function (req, res) {
  Models.User.findOne({
    include: [{
      model: Models.Group
    }],
    where: {
      id: req.user.id
    }
  }).then(function (user) {
    Models.Sondage.findOne({
      where: {
        id: user.dataValues.group.dataValues.sondage_id
      }
    }).then(function (sondage) {
      Models.Remplissage.findOne({
        where: {
          user_id: req.user.id,
          date: Date.now(),
          sondage_id: sondage.dataValues.id
        }
      }).then(function (remplissage) {
        var sondage_id = sondage.dataValues.id;
        var token;
        var alreadyAnswered = false;

        if (remplissage) {
          alreadyAnswered = true;
          token = user.generateJwt(sondage_id, remplissage.dataValues.id);
        } else {
          token = user.generateJwt(sondage_id);
        }

        res.status(200).send({
          token: token,
          alreadyAnswered: alreadyAnswered
        });
      });
    });
  });
});
router.get('/userStat', function (req, res) {
  Models.User.findOne({
    where: {
      id: req.user.id
    }
  }).then(function (user) {
    user.getUserStat().then(function (data) {
      res.status(200).send(data);
    });
  });
});
router.get("/getPosts", function (req, res) {
  Models.Post.findAll().then(function (posts) {
    res.json(posts);
  });
});
module.exports = router;
//# sourceMappingURL=user.js.map