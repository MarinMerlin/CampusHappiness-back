const fakeSurvey = {
  name: 'Working conditions',
  thematiqueList: [
    {
      name: 'Cafetaria',
      questionList: [
        {
          text: 'Was the meal satisfactory?',
          keyWord: 'Quality',
        },
        {
          text: "How was the wait?",
          keyWord: 'Wait',
        },
        {
          text: 'Was it too noisy?',
          keyWord: 'Noise',
        },
        {
          text: 'Was the price correct?',
          keyWord: 'Price',
        },
        {
          text: "Cleanliness of the cafetaria",
          keyWord: 'Cleanliness',
        },
        {
          text: "Cleanliness of the restrooms",
          keyWord: 'Cleanliness',
        },
      ],
    },
    {
      name: 'Office',
      questionList: [
        {
          text: "Were productive today?",
          keyWord: 'Productivty',
        },
        {
          text: 'How was the temperature?',
          keyWord: 'Temperature',
        },
        {
          text: 'Was it too noisy?',
          keyWord: 'Noise',
        },
        {
          text: 'Was your office dirty?',
          keyWord: 'Cleanliness',
        },
        {
          text: 'How was the mood?',
          keyWord: 'Mood',
        },
        {
          text: 'Was your computer performing good?',
          keyWord: 'Hardware',
        },
      ],
    },
    {
      name: 'Rest Space',
      questionList: [
        {
          text: 'Was the room clean?',
          keyWord: 'Cleanliness',
        },
        {
          text: "How was the mood?",
          keyWord: 'Mood',
        },
        {
          text: 'Was the temperature ok?',
          keyWord: 'Temperature',
        },
      ],
    },
  ],
};

const fakeSurvey2 = {
  name: 'Classes',
  thematiqueList: [
    {
      name: 'Auditorium',
      questionList: [
        {
          text: 'Were the seats comfortable?',
          keyWord: 'Comfort',
        },
        {
          text: "Was the class too long?",
          keyWord: 'Wait',
        },
        {
          text: 'Was it too noisy?',
          keyWord: 'Noise',
        },
        {
          text: 'Was the class interesting?',
          keyWord: 'Quality',
        },
        {
          text: "Was the auditorium clean?",
          keyWord: 'Cleanliness',
        },
        {
          text: "Cleanliness of the restrooms?",
          keyWord: 'Cleanliness',
        },
      ],
    },
    {
      name: 'Lab room',
      questionList: [
        {
          text: "Cleanliness of the lab?",
          keyWord: 'Cleanliness',
        },
        {
          text: "How was the mood?",
          keyWord: 'Mood',
        },
        {
          text: 'Was the temperature ok?',
          keyWord: 'Temperature',
        },
      ],
    },
  ],
};

module.exports = { fakeSurvey, fakeSurvey2 };