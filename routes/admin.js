const express = require('express');

const router = express.Router();

// Le body Parser permet d'acceder aux variable envoyés dans le body
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false }));

const morgan = require('morgan');

// Récupère les models
const Models = require('../models/index');

router.use(morgan('dev'));

router.use((req, res, next) => {
  if (req.url === '/login') {
    next();
  } else if (!req.isAuthenticated()) {
    res.status(401).json({ message: 'Not logged in' });
  } else if (req.user.auth !== 1) {
    res.status(401).json({ message: 'Not authorized' });
  } else {
    next();
  }
});

// --------- Routes protegées par token -------------

// firstName, lastName, email, pseudo, password, auth, photo
router.post('/postUsers',
  (req, res) => {
    const promises = [];
    req.body.userList.forEach((user) => {
      let authValue = 0;
      if (user.admin) {
        authValue = 1;
      }
      promises.push(Models.User.addUser(
        user.firstName,
        user.lastName,
        user.email,
        user.pseudo, 
        user.password, 
        authValue,
      ));
    });
    Promise.all(promises).then(() => {
      Models.User.findAll({ order: [['createdAt', 'DESC']] }).then((allUserData) => {
        const userArray = [];
        allUserData.forEach((user) => {
          const {
            firstName, lastName, email, pseudo, id, group_id,
          } = user.dataValues; 
          userArray.push({
            firstName: firstName,
            lastName: lastName,
            email: email,
            pseudo: pseudo,
            id: id,
            group_id: group_id,
          });
        });
        res.status(200).json({ userArray: userArray, success: true });
      });
    });
  });

router.get('/getUsers', (req, res) => {
  Models.User.findAll({ order: [['createdAt', 'DESC']] }).then((allUserData) => {
    const userArray = [];
    allUserData.forEach((user) => {
      const {
        firstName, lastName, email, pseudo, id, group_id,
      } = user.dataValues; 
      userArray.push({
        firstName: firstName,
        lastName: lastName,
        email: email,
        pseudo: pseudo,
        id: id,
        group_id: group_id,
      });
    });
    console.log(userArray);
    res.json(userArray);
  });
});

router.post('/postGroup', (req, res) => {
  Models.Sondage.findOne().then((sondage) => {
    Models.Group.addGroup(sondage.dataValues.id, req.body.groupName).then(() => {
      Models.User.findOne({ where: { id: req.user.id } }).then((user) => {
        user.getGroups().then((groupList) => {
          console.log("Sent all groups to client");
          res.status(200).json({ success: true, groupList: groupList });
        });
      });
    });
  });
});

router.post('/changeUserGroup', (req, res) => {
  const promises = [];
  req.body.selectedUsers.forEach((user) => {
    const promise = new Promise((resolve) => {
      if (user.check) {
        Models.User.update({ group_id: req.body.selectedGroup.id }, { where: { id: user.id } })
          .then(() => {
            resolve();
          });
      } else {
        resolve();
      }
    });
    promises.push(promise);
  });
  Promise.all(promises).then(() => {
    res.status(200).json({ success: true });
  });
});
// Route relative à l'affichage et la creation de sondage

router.get('/getSondage', (req, res) => {
  Models.User.findOne({ where: { id: req.user.id } }).then((user) => {
    user.getSondage().then((sondageList) => {
      res.status(200).json(sondageList);
    });
  });
});

router.get('/getGroups', (req, res) => {
  Models.User.findOne({ where: { id: req.user.id } }).then((user) => {
    user.getGroups().then((groupList) => {
      console.log("Sent all groups to client");
      res.status(200).json(groupList);
    });
  });
});

router.post('/postSondage', (req, res) => {
  Models.User.findOne({ where: { id: req.user.id } }).then((user) => {
    user.createSondage(req.body).then((sondageId) => {
      res.json({ sondageId: sondageId });
    });
  });
});

router.post('/changeNextSondage', (req, res) => {
  if (!req.body) {
    res.status(400).send("Bad Request : The body doesnt contain next_sondage ! ");
  } else {
    Models.Group.update({ sondage_id: req.body.sondage_id }, { where: { id: req.body.group_id } })
      .then(() => {
        console.log("Changed the sondage to sondage: ", req.body.sondage_id, " for the group: ", req.body.sondage_id);
        res.status(200).json(`Changed the sondage to sondage: ${req.body.sondage_name} for the group: ${req.body.sondage_name}`);
      });
  }
});

// Route relative aux statisques

router.get('/getCommentaireJour/:jour', (req, res) => {
  Models.User.findById(req.user.id).then((user) => {
    user.getCommentairesJour(req.params.jour).then((comments) => {
      res.status(200).json(comments);
    });
  });
});

router.get("/generalStatistics", (req, res) => {
  Models.User.findById(req.user.id).then((user) => {
    user.getStatistics((statisticTab) => {
      res.json(statisticTab);
    });
  });
});

router.get("/specificStatistics/:year/:month/:day/:group", (req, res) => {
  Models.User.findById(req.user.id).then((user) => {
    user.getStatisticsSpecific(req.params).then((sondageResult) => {
      res.json(sondageResult);
    });
  });
});

// Route relative aux aux mot clef

router.get("/getKeywords", (req, res) => {
  Models.Keyword.findAll().then((keywords) => {
    const keywordList = [];
    keywords.forEach((keyword) => {
      keywordList.push(keyword.dataValues.name);
    });
    res.status(200).json(keywordList);
  });
});

router.post("/addKeyWord", (req, res) => {
  Models.Keyword.addKeyword(req.body.name).then(() => {
    Models.Keyword.findAll().then((keywords) => {
      const keywordList = [];
      keywords.forEach((keyword) => {
        keywordList.push(keyword.dataValues.name);
      });
      res.status(200).json(keywordList);
    });
  });
});

// Route relative aux posts

router.post("/addPost", (req, res) => {
  Models.Post.addPost(req.body.post);
  res.json({
    success: true,
  });
});

module.exports = router;