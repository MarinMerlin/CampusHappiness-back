const express = require('express');

const router = express.Router();

const fs = require('fs');

// Le body Parser permet d'acceder aux variable envoyés dans le body
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false }));

const morgan = require('morgan');

router.use(morgan('dev'));

// Récupère les models
const Models = require('../models');

router.use((req, res, next) => {
  if (!req.isAuthenticated() && req.url !== '/login') {
    res.status(401).json({ message: 'Not logged in' });
  } else {
    next();
  }
});

// --------- Routes protegées-------------

router.post('/updateUser', (req, res) => {
  const newCookie = Object.assign(req.user, req.body.updatedUser);
  req.login(newCookie, () => {
    console.log("Modified cookie: ", newCookie);
  });
  Models.User.updateUser(req.user.id, req.body.updatedUser).then(() => {
    res.status(200).json(req.body.updatedUser);
  });
});

router.post('/updatePhoto', (req, res) => {
  const base64Data = req.body.photo.replace(/^data:image\/jpeg;base64,/, "");
  console.log(base64Data);
  fs.writeFile(`./public/user/photo/${req.user.pseudo}`, base64Data, 'base64', (err) => {
    if (err) { 
      console.log(err);
    } else {
      Models.User.update(
        { photo: `/user/photo/${req.user.pseudo}.jpg` },
        { where: { id: req.user.id } },
      ).then(() => {
        res.status(200).json({ photo: `/user/photo/${req.user.pseudo}` });
      });
    }
  });
});

router.get('/getToken', (req, res) => {
  Models.Sondage.findOne({ where: { current: true } }).then((sondage) => {
    Models.Remplissage.findOne(
      { where: { user_id: req.user.id, date: Date.now(), sondage_id: sondage.dataValues.id } },
    )
      .then((remplissage) => {
        Models.User.findOne({ where: { id: req.user.id } })
          .then((user) => {
            const sondage_id = sondage.dataValues.id;
            let token;
            let alreadyAnswered = false;
            if (remplissage) {
              alreadyAnswered = true;
              token = user.generateJwt(sondage_id, remplissage.dataValues.id);
            } else {
              token = user.generateJwt(sondage_id);
            }
            res.status(200).send({ token: token, alreadyAnswered: alreadyAnswered });
          });
      });
  });
});


router.get('/userStat', (req, res) => {
  Models.User.findOne({ where: { id: req.user.id } }).then((user) => {
    user.getUserStat().then((data) => {
      res.status(200).send(data);
    });
  });
});
 
module.exports = router;