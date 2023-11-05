const { sequelize } = require('../db/connect');
const Event = require('../models/Event');
const EventOptions = require('../models/EventOptions');
const User = require('../models/User');

async function findOrCreateUser() {
  const user = await User.create({
    firstname: 'TestUser',
    lastname: 'admin',
    email: 'testuser@gmail1.com',
    isAdmin: true,
    password: 'password',
  });
  console.log(user);
}

async function findOrCreateEvent() {
  const user = await findOrCreateUser();

  const event = await Event.findOrCreate({
    where: {
      id: user.id,
    },
    defaults: {
      name: 'MOVIE',
      createdBy: user.id,
      details: 'MOVIE SHOWS',
    },
  });
  console.log(event);
  return event[0];
}

async function createEventOptions() {
  const t = await sequelize.transaction();
  try {
    const event = await findOrCreateEvent();
    const user = await findOrCreateUser();

    const eventOptions = await EventOptions.create(
      {
        name: 'MOVIE_SHOW_GOLD',
        parentEvent: event.id,
        createdBy: user.id,
        class: 'GOLD',
        rate: 1000,
        location: 'TVM',
        maxOccupancy: 100,
        date: new Date().getUTCDate(),
        startTime: '11:00',
        endTime: '15:00',
      },
      { transaction: t }
    );

    t.commit();
  } catch (error) {
    console.log(error);
    await t.rollback();
  }
}

module.exports = async () => {
  // await findOrCreateUser();
  // await findOrCreateEvent();
  // await createEventOptions();
  const user = await User.findOne({
    where: {
      email: 'testuser@gmail1.com',
    },
  });
  console.log(user.comparePassword('password1'));
  // console.log(User.compare('password'));
  console.log('INSERTING DATA TO MODELS');
};
