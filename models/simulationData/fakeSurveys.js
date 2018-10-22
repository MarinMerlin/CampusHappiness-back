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

module.exports = { fakeSurvey, fakeSurvey2 };