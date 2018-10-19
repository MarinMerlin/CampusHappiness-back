const schedule = require('node-schedule');
const Models = require('../models/index.js');
const mailer = require('./mailer');
const id_generator = require('../custom_module/id_generator');

const scheduler = function () {
  schedule.scheduleJob('0 * * * * *', () => {
    Models.User.findAll({
      include: [
        {
          model: Models.Group,
        },
      ],
    }).then((users) => {
      users.forEach((data) => {
        const sondage_id = data.dataValues.group.dataValues.sondage_id;
        Models.JourSondage.findOrCreate({ 
          where: { date_emmission: Date.now(), sondage_id: sondage_id },
          defaults: { id: id_generator(), sondage_id: sondage_id, nombre_emission: 0 }, 
        }).spread((jourSondage, created) => {
          const token = data.generateJwt(sondage_id);
          const diff = Date.now() - data.dataValues.lastMailDate;
          if (data.dataValues.mailIntensity < diff / (1000 * 60 * 60 * 24) + 0.4) {
            mailer(data.dataValues, token);
            Models.User.update(
              { lastMailDate: Date.now() },
              { where: { id: data.dataValues.id } },
            );
            jourSondage.increment({ nombre_emission: 1 });
          }
        });
      });
    });
    /**/
  });
};
module.exports = scheduler;
