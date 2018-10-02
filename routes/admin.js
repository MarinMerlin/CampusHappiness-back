const express = require('express');
const passport = require('passport');

const router = express.Router();


// Le body Parser permet d'acceder aux variable envoyés dans le body
const bodyParser = require('body-parser');

router.use(bodyParser.json());
router.use(express.urlencoded({ extended: false }));

const morgan = require('morgan');

// Récupère les models
const Models = require('../models/index');

// Récupère les fonctions de recherche de données
const Data = require('../models/dataFetch');

router.use(morgan('dev'));

// Authentification
const adminLoginStrategy = require('../passport-config/adminStrategy');

passport.use(adminLoginStrategy);
passport.serializeUser((user, done) => {
  console.log('Inside serializeUser callback. User id is save to the session file store here');
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  done(null, id);
});

// Authentification controllers
const checkToken = require('../controllers/adminCheckToken');

router.use((req, res, next) => {
  if (!req.isAuthenticated() && req.url !== '/login') {
    res.status(401).json({ message: 'Unauthorized. User not logged in!' });
  } else {
    next();
  }
});

router.post('/login',
  passport.authenticate('local', { session: true }),
  (req, res) => {
    switch (req.user) {
      case "wrongUser":
        res.status(460).send("Wrong username");
        break;
      case "wrongPass":
        res.status(461).send("Wrong username");
        break;
      default:
        console.log("Correct authentification: ", req.user.dataValues.pseudo);
        req.login(req.user, (err) => {
          console.log('Inside req.login() callback');
          console.log(`req.session.passport: ${JSON.stringify(req.session.passport)}`);
          console.log(`req.user: ${JSON.stringify(req.user)}`);
        });
        const serverResponse = { 
          success: true, 
          admin: { pseudo: req.user.dataValues.pseudo },
        };
        res.json(serverResponse);
    }
  });

// --------- Routes protegées par token -------------

// Un administrateur peut ajouter un autre administrateur :
// Les attributs de l'admin sont dans le body de la requète
// TODO : Prendre en compte le cas où il y a une erreure au cours de la création de l'admin'

// Logout the session

router.get('/logout', (req, res) => {
  req.session.destroy();
  res.send("User logged out");
});

// Routes relatives a la gestion des admins et des users
router.post('/createAdmin', (req, res) => {
  console.log(`creating admin ${req.body.pseudo}`);
  // On vérifie que les données minmums pour créer un utilisateur sont bien présentes
  if (!req.body.pseudo || !req.body.mp) {
    console.log("/!\\ ERROR : The body of the create admin request doesnt contain pseudo or mp !");
    res.status(400).send("Bad Request : The body of the create admin request doesnt contain pseudo or mp ! ");
  } else {
    Models.Admin.addAdmin(req.body.pseudo, req.body.mp, Date.now()).then(() => {
      console.log(`Added admin: ${req.body.pseudo}`);
      res.status(200).send(`Admin ${req.body.pseudo} created`);
    });
  }
});

router.post('/csvPost',
  (req, res) => {
    req.body.userList.forEach((user) => {
      Models.User.addUser(user.firstName, user.lastName, user.email).then(() => { res.json("user list added"); });
    });
  });

router.post('/singlePost',
  (req, res) => {
    Models.User.addUser(req.body.user.firstName, req.body.user.lastName, req.body.user.email).then(() => {
      res.status(200).send(req.body.email);
      console.log("New user added: ", req.body.user);
    });
  }); 

// Route relative à l'affichage et la creation de sondage

router.get('/getSondage', (req, res) => {
  Models.Admin.findOne({ where: { id: req.user } }).then((admin) => {
    admin.getSondage().then((sondageList) => {
      console.log("Sent all sondages to client");
      res.status(200).json(sondageList);
    });
  });
});

/* Survey object sent from the front to /postSondage
  {
    name: sondagename,
    thematiqueList: [
      {
        name: thematiquename,
        questionList: [
          {
            keyWord: motclef,
            question: question,
          },
          { ... },
        ]
      },
      { ... },
    ]
  }
*/
router.post('/postSondage', (req, res) => {
  Models.Admin.findOne({ where: { id: req.user } }).then((admin) => {
    admin.createSondage(req.body).then(() => {
      console.log("New sondage created: ", req.body.name);
      res.status(200).send("New sondage created");
    });
  });
});

router.post('/changeNextSondage', (req, res) => {
  if (!req.body) {
    console.log("/!\\ ERROR : Inccorect body");
    res.status(400).send("Bad Request : The body doesnt contain next_sondage ! ");
  } else {
    Models.Sondage.update({ current: false }, { where: { current: true } }).then(() => {
      Models.Sondage.update({ current: true }, { where: { id: req.body.id } }).then((sondage) => {
        console.log("Changed the sondage to sondage: ", req.body.name);
        res.status(200).json(sondage.dataValues);
      });
    });
  }
});

// Route relative aux statisques

router.get('/numberRemplissages', (req, res) => {
  Data.getNumberRemplissages((count) => {
    console.log("Fetching total number of Remplissage");
    res.status(200).json(count);
  });
});

router.get('/numberRemplissagesJour/:jour', (req, res) => {
  Data.getNumberRemplissagesJour(req.params.jour, (count) => {
    console.log("Fetching total number of Remplissage on: ", req.params.jour);
    res.status(200).json(count);
  });
});

router.get('/getCommentaireJour/:jour', (req, res) => {
  Data.getCommentairesJour(req.params.jour, (comments) => {
    console.log("Fetching all Commentaires on: ", req.params.jour);
    res.status(200).json(comments);
  });
});

router.get('/numberReponses', (req, res) => {
  Data.getNumberReponses((count) => {
    console.log("Fetching total number of Reponse");
    res.status(200).json(count);
  });
});

router.get('/numberReponsesJour/:jour', (req, res) => {
  Data.getNumberReponsesJour(req.params.jour, (count) => {
    res.status(200).json(count);
    console.log("Fetching total number of Reponse on: ", req.params.jour);
  });
  res.json("ok");
});

router.get("/generalStatistics", (req, res) => {
  Models.Admin.findById(req.user).then((admin) => {
    admin.getStatistics((statisticTab) => {
      res.json(statisticTab);
    });
  });
});

router.get("/specificStatistics/:year/:month/:day", (req, res) => {
  Models.Admin.findById(req.user).then((admin) => {
    admin.getStatisticsSpecific(req.params).then((sondageResult) => {
      res.json(sondageResult);
    });
  });
});

module.exports = router;