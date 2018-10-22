const Models = require("./index");
const id_generator = require('../custom_module/id_generator');
const clearTables = require('./setup');
const env = require("../const");

const { 
  Sondage, User, Reponse, Question, Remplissage, JourSondage, Keyword, Group, Post,
} = Models;

const simulationTime = 35;
const simulationDay = new Date();
simulationDay.setDate(simulationDay.getDate() - simulationTime);

const groupIds = [id_generator(), id_generator()];
const sondageIds = [id_generator(), id_generator()];
const fakeSurvey = {
  name: 'Condition de travail',
  thematiqueList: [
    {
      name: 'Cafétaria',
      questionList: [
        {
          text: 'Le repas était-il convenable?',
          keyWord: 'Qualité',
        },
        {
          text: "Comment était l'attente?",
          keyWord: 'Attente',
        },
        {
          text: 'Etait-ce trop bryuant?',
          keyWord: 'Bruit',
        },
        {
          text: 'Le prix convenait il?',
          keyWord: 'Prix',
        },
        {
          text: "Propreté de la cafeteria",
          keyWord: 'Propreté',
        },
        {
          text: "Propreté des sanitaires",
          keyWord: 'propreté',
        },
      ],
    },
    {
      name: 'Bureau',
      questionList: [
        {
          text: "Avez vous été productif aujourd'hui?",
          keyWord: 'Productivité',
        },
        {
          text: 'Comment était la température?',
          keyWord: 'Température',
        },
        {
          text: 'Etait-ce trop bryuant?',
          keyWord: 'Bruit',
        },
        {
          text: 'Votre bureau était il sale?',
          keyWord: 'Propreté',
        },
        {
          text: 'Ambiance',
          keyWord: 'Ambiance',
        },
        {
          text: 'Le materielle',
          keyWord: 'Materielle',
        },
      ],
    },
    {
      name: 'Espace de repos',
      questionList: [
        {
          text: 'Le lieux était il propre',
          keyWord: 'Propreté',
        },
        {
          text: "L'ambiance était elle convenable?",
          keyWord: 'Ambiance',
        },
        {
          text: 'Temperature convenable?',
          keyWord: 'Temperature',
        },
      ],
    },
  ],
};

const fakeSurvey2 = {
  name: 'Cours',
  thematiqueList: [
    {
      name: 'Amphithéatre',
      questionList: [
        {
          text: 'Les sièges sont confortable?',
          keyWord: 'Confort',
        },
        {
          text: "Le cours était trop long?",
          keyWord: 'Attente',
        },
        {
          text: 'Etait-ce trop bryuant?',
          keyWord: 'Bruit',
        },
        {
          text: 'Le cours était intéressant?',
          keyWord: 'Qualité',
        },
        {
          text: "Propreté de la l'amphithéatre",
          keyWord: 'Propreté',
        },
        {
          text: "Propreté des sanitaires",
          keyWord: 'propreté',
        },
      ],
    },
    {
      name: 'Salle de TD',
      questionList: [
        {
          text: 'Le lieux était il propre',
          keyWord: 'Propreté',
        },
        {
          text: "L'ambiance était elle convenable?",
          keyWord: 'Ambiance',
        },
        {
          text: 'Temperature convenable?',
          keyWord: 'Temperature',
        },
      ],
    },
  ],
};

const userList = [
  {
    firstName: "Jean",
    lastName: "Michel",
    pseudo: "Jean",
    email: "jean.michel@supukec.fr",
    password: "michel",
  },
  {
    firstName: "Charles",
    lastName: "Henry",
    pseudo: "Charles",
    email: "charles.henry@supukec.fr",
    password: "henry",
  },
  {
    firstName: "John",
    lastName: "Michelangelo",
    pseudo: "John",
    email: "john.michelangelo@supukec.fr",
    password: "michelangelo",
  },
  {
    firstName: "Martin",
    lastName: "Mystère",
    pseudo: "Martin",
    email: "martin.mystere@supukec.fr",
    password: "mystere",
  },
  {
    firstName: "Bob",
    lastName: "Laiponje",
    pseudo: "Bob",
    email: "bob.laiponje@supukec.fr",
    password: "laiponje",
  },
  {
    firstName: "Jacques",
    lastName: "Adi",
    pseudo: "Jacques",
    email: "jacques.adi@supukec.fr",
    password: "adi",
  },
  {
    firstName: "Jean",
    lastName: "Michel",
    pseudo: "Jean",
    email: "jean.michel@supukec.fr",
    password: "michel",
  },
  {
    firstName: "Goerge",
    lastName: "Michaels",
    pseudo: "Goerge",
    email: "goerge.michaels@supukec.fr",
    password: "michaels",
  },
  {
    firstName: "Merin",
    lastName: "Marlin",
    pseudo: "merin",
    email: "merin.marlin@supukec.fr",
    password: "marlin",
  },
  {
    firstName: "Marie",
    lastName: "Jeanne",
    pseudo: "Marie",
    email: "marie.jeanne@supukec.fr",
    password: "jeanne",
  },
  {
    firstName: "Claire",
    lastName: "Dejager",
    pseudo: "Claire",
    email: "claire.dejager@supukec.fr",
    password: "dejager",
  },
  {
    firstName: "Anne",
    lastName: "Collins",
    pseudo: "Anne",
    email: "anne.collins@supukec.fr",
    password: "anne",
  },
  {
    firstName: "Laure",
    lastName: "Bailleul",
    pseudo: "laure",
    email: "laure.bailleul@supukec.fr",
    password: "bailleul",
  },
  {
    firstName: "Camille",
    lastName: "Oswald",
    pseudo: "Camille",
    email: "camille.oswald@supukec.fr",
    password: "oswald",
  },
];

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

const fakeSurvey_id = null;
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

clearTables().then(() => {
  console.log("");
  console.log("------------------------------------------");
  console.log("");
  firstDay().then(() => {
    Alldays(simulationTime);
  });
});

const post_number = 6;
const fake_post = {
  title: "Good News !",
  text: "Et quia Montius inter dilancinantium manus spiritum efflaturus Epigonum et Eusebium nec professionem nec dignitatem ostendens aliquotiens increpabat, qui sint hi magna quaerebatur industria, et nequid intepesceret, Epigonus e Lycia philosophus ducitur et Eusebius ab Emissa Pittacas cognomento, concitatus orator, cum quaestor non hos sed tribunos fabricarum insimulasset promittentes armorum si novas res agitari conperissent.",
  linkURL: 'https://fr.wikipedia.org/wiki/Vincent_Martin',
};

console.log("Adding posts ...");
const postPromiseArray = [];
for (let index = 0; index < 6; index++) {
  postPromiseArray.push(Post.addPost(fake_post));
}
Promise.all(postPromiseArray).then(() => {
  console.log(post_number, " Posts added");
});