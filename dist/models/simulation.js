"use strict";

var Models = require("./index");

var id_generator = require('../custom_module/id_generator');

var clearTables = require('./setup');

var env = require("../const");

var Sondage = Models.Sondage,
    User = Models.User,
    Reponse = Models.Reponse,
    Question = Models.Question,
    Remplissage = Models.Remplissage,
    JourSondage = Models.JourSondage,
    Keyword = Models.Keyword,
    Group = Models.Group,
    Post = Models.Post;
var simulationTime = 35;
var simulationDay = new Date();
simulationDay.setDate(simulationDay.getDate() - simulationTime);
var groupIds = [id_generator(), id_generator()];
var sondageIds = [id_generator(), id_generator()];
var fakeSurvey = {
  name: 'Condition de travail',
  thematiqueList: [{
    name: 'Cafétaria',
    questionList: [{
      text: 'Le repas était-il convenable?',
      keyWord: 'Qualité'
    }, {
      text: "Comment était l'attente?",
      keyWord: 'Attente'
    }, {
      text: 'Etait-ce trop bryuant?',
      keyWord: 'Bruit'
    }, {
      text: 'Le prix convenait il?',
      keyWord: 'Prix'
    }, {
      text: "Propreté de la cafeteria",
      keyWord: 'Propreté'
    }, {
      text: "Propreté des sanitaires",
      keyWord: 'propreté'
    }]
  }, {
    name: 'Bureau',
    questionList: [{
      text: "Avez vous été productif aujourd'hui?",
      keyWord: 'Productivité'
    }, {
      text: 'Comment était la température?',
      keyWord: 'Température'
    }, {
      text: 'Etait-ce trop bryuant?',
      keyWord: 'Bruit'
    }, {
      text: 'Votre bureau était il sale?',
      keyWord: 'Propreté'
    }, {
      text: 'Ambiance',
      keyWord: 'Ambiance'
    }, {
      text: 'Le materielle',
      keyWord: 'Materielle'
    }]
  }, {
    name: 'Espace de repos',
    questionList: [{
      text: 'Le lieux était il propre',
      keyWord: 'Propreté'
    }, {
      text: "L'ambiance était elle convenable?",
      keyWord: 'Ambiance'
    }, {
      text: 'Temperature convenable?',
      keyWord: 'Temperature'
    }]
  }]
};
var fakeSurvey2 = {
  name: 'Cours',
  thematiqueList: [{
    name: 'Amphithéatre',
    questionList: [{
      text: 'Les sièges sont confortable?',
      keyWord: 'Confort'
    }, {
      text: "Le cours était trop long?",
      keyWord: 'Attente'
    }, {
      text: 'Etait-ce trop bryuant?',
      keyWord: 'Bruit'
    }, {
      text: 'Le cours était intéressant?',
      keyWord: 'Qualité'
    }, {
      text: "Propreté de la l'amphithéatre",
      keyWord: 'Propreté'
    }, {
      text: "Propreté des sanitaires",
      keyWord: 'propreté'
    }]
  }, {
    name: 'Salle de TD',
    questionList: [{
      text: 'Le lieux était il propre',
      keyWord: 'Propreté'
    }, {
      text: "L'ambiance était elle convenable?",
      keyWord: 'Ambiance'
    }, {
      text: 'Temperature convenable?',
      keyWord: 'Temperature'
    }]
  }]
};
var userList = [{
  firstName: "Jean",
  lastName: "Michel",
  pseudo: "Jean",
  email: "jean.michel@supukec.fr",
  password: "michel"
}, {
  firstName: "Charles",
  lastName: "Henry",
  pseudo: "Charles",
  email: "charles.henry@supukec.fr",
  password: "henry"
}, {
  firstName: "John",
  lastName: "Michelangelo",
  pseudo: "John",
  email: "john.michelangelo@supukec.fr",
  password: "michelangelo"
}, {
  firstName: "Martin",
  lastName: "Mystère",
  pseudo: "Martin",
  email: "martin.mystere@supukec.fr",
  password: "mystere"
}, {
  firstName: "Bob",
  lastName: "Laiponje",
  pseudo: "Bob",
  email: "bob.laiponje@supukec.fr",
  password: "laiponje"
}, {
  firstName: "Jacques",
  lastName: "Adi",
  pseudo: "Jacques",
  email: "jacques.adi@supukec.fr",
  password: "adi"
}, {
  firstName: "Jean",
  lastName: "Michel",
  pseudo: "Jean",
  email: "jean.michel@supukec.fr",
  password: "michel"
}, {
  firstName: "Goerge",
  lastName: "Michaels",
  pseudo: "Goerge",
  email: "goerge.michaels@supukec.fr",
  password: "michaels"
}, {
  firstName: "Merin",
  lastName: "Marlin",
  pseudo: "merin",
  email: "merin.marlin@supukec.fr",
  password: "marlin"
}, {
  firstName: "Marie",
  lastName: "Jeanne",
  pseudo: "Marie",
  email: "marie.jeanne@supukec.fr",
  password: "jeanne"
}, {
  firstName: "Claire",
  lastName: "Dejager",
  pseudo: "Claire",
  email: "claire.dejager@supukec.fr",
  password: "dejager"
}, {
  firstName: "Anne",
  lastName: "Collins",
  pseudo: "Anne",
  email: "anne.collins@supukec.fr",
  password: "anne"
}, {
  firstName: "Laure",
  lastName: "Bailleul",
  pseudo: "laure",
  email: "laure.bailleul@supukec.fr",
  password: "bailleul"
}, {
  firstName: "Camille",
  lastName: "Oswald",
  pseudo: "Camille",
  email: "camille.oswald@supukec.fr",
  password: "oswald"
}];

var rand = function rand(max) {
  return Math.floor(Math.random() * Math.floor(max));
};

var randRep = function randRep(date) {
  var diff = simulationTime - Math.round((Date.now() - date) / (1000 * 60 * 60 * 24));
  var i = rand(44) + rand(diff);

  if (i >= 0 && i <= 14) {
    return -1;
  }

  if (i >= 15 && i <= 29) {
    return 0;
  }

  if (i >= 29) {
    return 1;
  }
};

var incrementDay = function incrementDay() {
  simulationDay.setDate(simulationDay.getDate() + 1);
};

var addManyUsers = function addManyUsers(userNumber) {
  return new Promise(function (resolve) {
    if (userNumber > 0) {
      var promiseArray = [];

      for (var i = 0; i < userNumber; i++) {
        var user = userList[rand(userList.length)];
        promiseArray.push(User.addUser(user.firstName, user.lastName, user.email, user.pseudo, user.password, 0, groupIds[rand(2)]));
      }

      Promise.all(promiseArray).then(resolve);
    } else {
      resolve();
    }
  });
};

var fakeSurvey_id = null;
var questionIdList = {};

var getQuestionIdList = function getQuestionIdList(fakeSurveyId1, fakeSurveyId2) {
  return new Promise(function (resolve) {
    Question.findAll({
      where: {
        sondage_id: fakeSurveyId1
      }
    }).then(function (questions) {
      questionIdList[fakeSurveyId1] = [];
      questions.forEach(function (question) {
        questionIdList[fakeSurveyId1].push(question.id);
      });
      console.log("nombre de question dans la base de donnée:", questionIdList[fakeSurveyId1].length, "  ", questions.length);
      Question.findAll({
        where: {
          sondage_id: fakeSurveyId2
        }
      }).then(function (questions2) {
        questionIdList[fakeSurveyId2] = [];
        questions2.forEach(function (question2) {
          questionIdList[fakeSurveyId2].push(question2.id);
        });
        console.log("nombre de question dans la base de donnée:", questionIdList[fakeSurveyId2].length, "  ", questions2.length);
        resolve();
      });
    });
  });
};

var answerSondage_simulation = function answerSondage_simulation(user, date, sondage_id) {
  return new Promise(function (resolve) {
    var fake_answer = {
      remplissage_id: id_generator(),
      sondage_id: sondage_id,
      answered_questions: [],
      answered_commentaires: []
    };
    questionIdList[sondage_id].forEach(function (question_id) {
      fake_answer.answered_questions.push({
        question_id: question_id,
        answer: randRep(date)
      });
    });
    user.answerSondage(fake_answer, date).then(function () {
      resolve();
    });
  });
};

var answerUserListSondage_simulation = function answerUserListSondage_simulation(users, date) {
  return new Promise(function (resolve) {
    console.log(simulationDay, " / ", date);
    var promiseArray = [];
    JourSondage.create({
      id: id_generator(),
      date_emmission: simulationDay,
      sondage_id: sondageIds[0],
      nombre_emission: 0
    }).then(function () {
      JourSondage.create({
        id: id_generator(),
        date_emmission: simulationDay,
        sondage_id: sondageIds[1],
        nombre_emission: 0
      }).then(function () {
        users.forEach(function (user) {
          var sondage_id = user.dataValues.group.dataValues.sondage_id;
          JourSondage.find({
            where: {
              sondage_id: sondage_id,
              date_emmission: simulationDay
            }
          }).then(function (jourSondage) {
            if (rand(3) !== 0) {
              promiseArray.push(answerSondage_simulation(user, date, sondage_id));
            }

            jourSondage.increment({
              nombre_emission: 1
            });
          });
        });
        Promise.all(promiseArray).then(function () {
          resolve();
        });
      });
    });
  });
};

var answerAll = function answerAll() {
  return new Promise(function (resolve) {
    User.findAll({
      include: [{
        model: Group
      }]
    }).then(function (users) {
      answerUserListSondage_simulation(users, simulationDay).then(function () {
        resolve();
      });
    });
  });
};

var firstDay = function firstDay() {
  return new Promise(function (resolve) {
    var sondage_id = sondageIds[0];
    var sondage_id2 = sondageIds[1];
    Sondage.addSondage(sondage_id, 'Admin', Date.now(), fakeSurvey.name).then(function () {
      Sondage.addSondage(sondage_id2, 'Admin', Date.now(), fakeSurvey2.name).then(function () {
        Group.addGroup(sondage_id, 'Professeurs', groupIds[0]).then(function () {
          Group.addGroup(sondage_id2, 'Eleves', groupIds[1]).then(function () {
            User.addUser('Admin', 'Admin', 'admin.admin@gmail.com', 'Admin', 'mdp', 1, groupIds[0]).then(function () {
              addManyUsers(10).then(function () {
                User.findOne({
                  where: {
                    pseudo: 'Admin'
                  }
                }).then(function (user) {
                  user.updateSondage(fakeSurvey, sondage_id).then(function () {
                    user.updateSondage(fakeSurvey2, sondage_id2).then(function () {
                      Keyword.addKeyword("Qualité");
                      Keyword.addKeyword("Attente");
                      Keyword.addKeyword("Bruit");
                      Keyword.addKeyword("Prix");
                      Keyword.addKeyword("Propreté");
                      Keyword.addKeyword("Materielle");
                      Keyword.addKeyword("Ambiance");
                      Keyword.addKeyword("Température");
                      Keyword.addKeyword("Confort");
                      getQuestionIdList(sondage_id, sondage_id2).then(function () {
                        answerAll().then(function () {
                          incrementDay();
                          resolve();
                        });
                      });
                    });
                  });
                });
              });
            });
          });
        });
      });
    });
  });
};

var day = function day(numberAddeduser) {
  return new Promise(function (resolve) {
    addManyUsers(numberAddeduser).then(function () {
      answerAll().then(function () {
        incrementDay();
        resolve();
      });
    });
  });
};

var Alldays = function Alldays(compteur) {
  if (compteur === 0) {
    console.log(' -- fin --');
    User.count().then(function (sum) {
      console.log("user :", sum);
    });
    Remplissage.count().then(function (sum) {
      console.log("remplissage :", sum);
    });
    Reponse.count().then(function (sum) {
      console.log("reponses :", sum);
    });
  } else {
    compteur--;
    console.log(compteur);

    if (compteur <= 15) {
      day(rand(2)).then(function () {
        Alldays(compteur);
      });
    } else {
      day(rand(5)).then(function () {
        Alldays(compteur);
      });
    }
  }
};

clearTables().then(function () {
  console.log("");
  console.log("------------------------------------------");
  console.log("");
  firstDay().then(function () {
    Alldays(simulationTime);
  });
});
var post_number = 6;
var fake_post = {
  title: "Good News !",
  text: "Et quia Montius inter dilancinantium manus spiritum efflaturus Epigonum et Eusebium nec professionem nec dignitatem ostendens aliquotiens increpabat, qui sint hi magna quaerebatur industria, et nequid intepesceret, Epigonus e Lycia philosophus ducitur et Eusebius ab Emissa Pittacas cognomento, concitatus orator, cum quaestor non hos sed tribunos fabricarum insimulasset promittentes armorum si novas res agitari conperissent.",
  linkURL: 'https://fr.wikipedia.org/wiki/Vincent_Martin'
};
console.log("Adding posts ...");
var postPromiseArray = [];

for (var index = 0; index < 6; index++) {
  postPromiseArray.push(Post.addPost(fake_post));
}

Promise.all(postPromiseArray).then(function () {
  console.log(post_number, " Posts added");
});
//# sourceMappingURL=simulation.js.map