const Models = require("./index");
const id_generator = require('../custom_module/id_generator');
const clearTables = require('./setup');

const { 
  Sondage, User, Reponse, Question, Remplissage, JourSondage, Keyword, Group, Post, Commentaire,
} = Models;

const simulationTime = 35;
const simulationDay = new Date();
simulationDay.setDate(simulationDay.getDate() - simulationTime);

const userList = require('./simulationData/userList');
const { fakeSurvey, fakeSurvey2 } = require('./simulationData/fakeSurveys');
const postList = require('./simulationData/postList');

const groupIds = [id_generator(), id_generator()];
const sondageIds = [id_generator(), id_generator()];


const rand = function (max) {
  return Math.floor(Math.random() * Math.floor(max));
};

const randRep = function (date) {
  const diff = simulationTime - Math.round((Date.now() - date) / (1000 * 60 * 60 * 24));
  const i = rand(44) + rand(diff);
  if (i >= 0 && i <= 14) {
    return (-1);
  } if (i >= 15 && i <= 29) {
    return (0);
  } if (i >= 29) {
    return (1);
  } 
};

const incrementDay = function () {
  simulationDay.setDate(simulationDay.getDate() + 1);
};

const addManyUsers = function (userNumber) {
  return new Promise(function (resolve) {
    if (userNumber > 0) {
      const promiseArray = [];
      for (let i = 0; i < userNumber; i++) {
        const user = userList[rand(userList.length)];
        promiseArray.push(User.addUser(user.firstName, user.lastName, user.email, user.pseudo, user.password, 0, groupIds[rand(2)]));
      }
      Promise.all(promiseArray).then(resolve);
    } else {
      resolve();
    }
  });
};

const questionIdList = {};

const getQuestionIdList = function (fakeSurveyId1, fakeSurveyId2) {
  return new Promise(function (resolve) {
    Question.findAll({ where: { sondage_id: fakeSurveyId1 } }).then((questions) => {
      questionIdList[fakeSurveyId1] = [];
      questions.forEach((question) => {
        questionIdList[fakeSurveyId1].push(question.id);
      });
      console.log("nombre de question dans la base de donnée:", questionIdList[fakeSurveyId1].length, "  ", questions.length);
      Question.findAll({ where: { sondage_id: fakeSurveyId2 } }).then((questions2) => {
        questionIdList[fakeSurveyId2] = [];
        questions2.forEach((question2) => {
          questionIdList[fakeSurveyId2].push(question2.id);
        });
        console.log("nombre de question dans la base de donnée:", questionIdList[fakeSurveyId2].length, "  ", questions2.length);
        resolve();
      });
    });
  });
};

const answerSondage_simulation = function (user, date, sondage_id) {
  return new Promise(function (resolve) {
    const fake_answer = {
      remplissage_id: id_generator(),
      sondage_id: sondage_id,
      answered_questions: [],
      answered_commentaires: [],
    };
    questionIdList[sondage_id].forEach((question_id) => {
      fake_answer.answered_questions.push({
        question_id: question_id,
        answer: randRep(date),
      });
    });
    user.answerSondage(fake_answer, date).then(() => {
      resolve();
    });
  });
};

const answerUserListSondage_simulation = function (users, date) {
  return new Promise(function (resolve) {
    console.log(simulationDay, " / ", date);
    const promiseArray = [];
    JourSondage.create({
      id: id_generator(), 
      date_emmission: simulationDay, 
      sondage_id: sondageIds[0], 
      nombre_emission: 0,
    }).then(() => {
      JourSondage.create({
        id: id_generator(), 
        date_emmission: simulationDay, 
        sondage_id: sondageIds[1], 
        nombre_emission: 0,
      }).then(() => {
        users.forEach((user) => {
          const sondage_id = user.dataValues.group.dataValues.sondage_id;
          JourSondage.find({ 
            where: { sondage_id: sondage_id, date_emmission: simulationDay },
          }).then((jourSondage) => {
            if (rand(3) !== 0) {
              promiseArray.push(answerSondage_simulation(user, date, sondage_id));
            }
            jourSondage.increment({ nombre_emission: 1 });
          });
        });
        Promise.all(promiseArray).then(() => {
          resolve();
        });
      });
    });
  });
};

const answerAll = function () {
  return new Promise(function (resolve) {
    User.findAll({ include: [{ model: Group }] }).then((users) => {
      answerUserListSondage_simulation(users, simulationDay).then(() => {
        resolve();
      });
    });
  });
};

const firstDay = function () {
  return new Promise(function (resolve) {
    const sondage_id = sondageIds[0];
    const sondage_id2 = sondageIds[1];
    Sondage.addSondage(sondage_id, 'Admin', Date.now(), fakeSurvey.name).then(() => {
      Sondage.addSondage(sondage_id2, 'Admin', Date.now(), fakeSurvey2.name).then(() => {
        Group.addGroup(sondage_id, 'Professeurs', groupIds[0]).then(() => {
          Group.addGroup(sondage_id2, 'Eleves', groupIds[1]).then(() => {
            User.addUser('Admin', 'Admin', 'admin.admin@gmail.com', 'Admin', 'mdp', 1, groupIds[0]).then(() => {
              addManyUsers(10).then(() => {
                User.findOne({ where: { pseudo: 'Admin' } }).then((user) => {
                  user.updateSondage(fakeSurvey, sondage_id).then(() => {
                    user.updateSondage(fakeSurvey2, sondage_id2).then(() => {
                      Keyword.addKeyword("Qualité");
                      Keyword.addKeyword("Attente");
                      Keyword.addKeyword("Bruit");
                      Keyword.addKeyword("Prix");
                      Keyword.addKeyword("Propreté");
                      Keyword.addKeyword("Materielle");
                      Keyword.addKeyword("Ambiance");
                      Keyword.addKeyword("Température");
                      Keyword.addKeyword("Confort");
                      getQuestionIdList(sondage_id, sondage_id2).then(() => {
                        answerAll().then(() => { 
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

const day = function (numberAddeduser) {
  return new Promise(function (resolve) {
    addManyUsers(numberAddeduser).then(() => {
      answerAll().then(() => {
        incrementDay();
        resolve();
      });
    });
  });
};

function comments() { 
  Remplissage.findAll().then((allRemplissages) => {
    allRemplissages.forEach((remplissage) => {
      if (Math.random() < 0.4) {
        Question.findAll({ where: { sondage_id: remplissage.sondage_id } }).then((questionList) => {
          const thematiqueIdArray = [];
          questionList.forEach((question) => {
            if (!thematiqueIdArray.includes(question.thematique_id)) {
              thematiqueIdArray.push(question.thematique_id);
            }
          });
          const index = Math.round(Math.random() * (thematiqueIdArray.length - 1));
          const remplissage_id = remplissage.id;
          const thematique_id = thematiqueIdArray[index];
          const commentaire = 'faux message';
          Commentaire.addCommentaire(remplissage_id, thematique_id, commentaire);
        });
      }
    });
  });
}

const Alldays = function (compteur) {
  if (compteur === 0) {
    console.log(' -- fin --');
    User.count().then((sum) => {
      console.log("user :", sum);
    });
    Remplissage.count().then((sum) => {
      console.log("remplissage :", sum);
    });
    Reponse.count().then((sum) => {
      console.log("reponses :", sum);
    });
    comments();
  } else {
    compteur--;
    console.log(compteur);
    if (compteur <= 15) {
      day(rand(2)).then(() => {
        Alldays(compteur);
      });
    } else {
      day(rand(5)).then(() => {
        Alldays(compteur);
      });
    }
  }
};

const ajoutPostes = () => {
  const post_number = 6;

  console.log("Adding posts ...");
  const postPromiseArray = [];
  postList.forEach((fake_post) => {
    postPromiseArray.push(Post.addPost(fake_post));
  });

  Promise.all(postPromiseArray).then(() => {
    console.log(post_number, " Posts added");
  });
}; 

clearTables().then(() => {
  console.log("");
  console.log("------------------------------------------");
  console.log("");
  firstDay().then(() => {
    Alldays(simulationTime);
    ajoutPostes();
  });
});