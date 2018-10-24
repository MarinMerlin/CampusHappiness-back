"use strict";

var express = require('express');

var router = express.Router(); // Le body Parser permet d'acceder aux variable envoyés dans le body

var bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(express.urlencoded({
  extended: false
}));

var morgan = require('morgan'); // Récupère les models


var Models = require('../models/index');

router.use(morgan('dev'));
router.use(function (req, res, next) {
  if (req.url === '/login') {
    next();
  } else if (!req.isAuthenticated()) {
    res.status(401).json({
      message: 'Not logged in'
    });
  } else if (req.user.auth !== 1) {
    res.status(401).json({
      message: 'Not authorized'
    });
  } else {
    next();
  }
}); // --------- Routes protegées par token -------------
// firstName, lastName, email, pseudo, password, auth, photo

router.post('/postUsers', function (req, res) {
  var promises = [];
  req.body.userList.forEach(function (user) {
    var authValue = 0;

    if (user.admin) {
      authValue = 1;
    }

    promises.push(Models.User.addUser(user.firstName, user.lastName, user.email, user.pseudo, user.password, authValue));
  });
  Promise.all(promises).then(function () {
    Models.User.findAll({
      order: [['createdAt', 'DESC']]
    }).then(function (allUserData) {
      var userArray = [];
      allUserData.forEach(function (user) {
        var _user$dataValues = user.dataValues,
            firstName = _user$dataValues.firstName,
            lastName = _user$dataValues.lastName,
            email = _user$dataValues.email,
            pseudo = _user$dataValues.pseudo,
            id = _user$dataValues.id,
            group_id = _user$dataValues.group_id;
        userArray.push({
          firstName: firstName,
          lastName: lastName,
          email: email,
          pseudo: pseudo,
          id: id,
          group_id: group_id
        });
      });
      res.status(200).json({
        userArray: userArray,
        success: true
      });
    });
  });
});
router.get('/getUsers', function (req, res) {
  Models.User.findAll({
    order: [['createdAt', 'DESC']]
  }).then(function (allUserData) {
    var userArray = [];
    allUserData.forEach(function (user) {
      var _user$dataValues2 = user.dataValues,
          firstName = _user$dataValues2.firstName,
          lastName = _user$dataValues2.lastName,
          email = _user$dataValues2.email,
          pseudo = _user$dataValues2.pseudo,
          id = _user$dataValues2.id,
          group_id = _user$dataValues2.group_id;
      userArray.push({
        firstName: firstName,
        lastName: lastName,
        email: email,
        pseudo: pseudo,
        id: id,
        group_id: group_id
      });
    });
    console.log(userArray);
    res.json(userArray);
  });
});
router.post('/postGroup', function (req, res) {
  Models.Sondage.findOne().then(function (sondage) {
    Models.Group.addGroup(sondage.dataValues.id, req.body.groupName).then(function () {
      Models.User.findOne({
        where: {
          id: req.user.id
        }
      }).then(function (user) {
        user.getGroups().then(function (groupList) {
          console.log("Sent all groups to client");
          res.status(200).json({
            success: true,
            groupList: groupList
          });
        });
      });
    });
  });
});
router.post('/changeUserGroup', function (req, res) {
  var promises = [];
  req.body.selectedUsers.forEach(function (user) {
    var promise = new Promise(function (resolve) {
      if (user.check) {
        Models.User.update({
          group_id: req.body.selectedGroup.id
        }, {
          where: {
            id: user.id
          }
        }).then(function () {
          resolve();
        });
      } else {
        resolve();
      }
    });
    promises.push(promise);
  });
  Promise.all(promises).then(function () {
    res.status(200).json({
      success: true
    });
  });
}); // Route relative à l'affichage et la creation de sondage

router.get('/getSondage', function (req, res) {
  Models.User.findOne({
    where: {
      id: req.user.id
    }
  }).then(function (user) {
    user.getSondage().then(function (sondageList) {
      res.status(200).json(sondageList);
    });
  });
});
router.get('/getGroups', function (req, res) {
  Models.User.findOne({
    where: {
      id: req.user.id
    }
  }).then(function (user) {
    user.getGroups().then(function (groupList) {
      console.log("Sent all groups to client");
      res.status(200).json(groupList);
    });
  });
});
router.post('/postSondage', function (req, res) {
  Models.User.findOne({
    where: {
      id: req.user.id
    }
  }).then(function (user) {
    user.createSondage(req.body).then(function (sondageId) {
      res.json({
        sondageId: sondageId
      });
    });
  });
});
router.post('/changeNextSondage', function (req, res) {
  if (!req.body) {
    res.status(400).send("Bad Request : The body doesnt contain next_sondage ! ");
  } else {
    Models.Group.update({
      sondage_id: req.body.sondage_id
    }, {
      where: {
        id: req.body.group_id
      }
    }).then(function () {
      console.log("Changed the sondage to sondage: ", req.body.sondage_id, " for the group: ", req.body.sondage_id);
      res.status(200).json("Changed the sondage to sondage: ".concat(req.body.sondage_name, " for the group: ").concat(req.body.sondage_name));
    });
  }
}); // Route relative aux statisques

router.get('/getCommentaireJour/:jour', function (req, res) {
  Models.User.findById(req.user.id).then(function (user) {
    user.getCommentairesJour(req.params.jour).then(function (comments) {
      res.status(200).json(comments);
    });
  });
});
router.get("/generalStatistics", function (req, res) {
  Models.User.findById(req.user.id).then(function (user) {
    user.getStatistics(function (statisticTab) {
      res.json(statisticTab);
    });
  });
});
router.get("/specificStatistics/:year/:month/:day/:group", function (req, res) {
  Models.User.findById(req.user.id).then(function (user) {
    user.getStatisticsSpecific(req.params).then(function (sondageResult) {
      res.json(sondageResult);
    });
  });
}); // Route relative aux aux mot clef

router.get("/getKeywords", function (req, res) {
  Models.Keyword.findAll().then(function (keywords) {
    var keywordList = [];
    keywords.forEach(function (keyword) {
      keywordList.push(keyword.dataValues.name);
    });
    res.status(200).json(keywordList);
  });
});
router.post("/addKeyWord", function (req, res) {
  Models.Keyword.addKeyword(req.body.name).then(function () {
    Models.Keyword.findAll().then(function (keywords) {
      var keywordList = [];
      keywords.forEach(function (keyword) {
        keywordList.push(keyword.dataValues.name);
      });
      res.status(200).json(keywordList);
    });
  });
}); // Route relative aux posts

router.post("/addPost", function (req, res) {
  Models.Post.addPost(req.body.post);
  res.json({
    success: true
  });
});
module.exports = router;
//# sourceMappingURL=admin.js.map