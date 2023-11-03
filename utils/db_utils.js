const { sequelize } = require('../db/connect');
const Event = require('../models/Event');
const EventOptions = require('../models/EventOptions');
const User = require('../models/User');

async function findOrCreateUser() {
  const user = await User.findOrCreate({
    where: { email: 'testuser@gmail.com' },
    defaults: {
      firstname: 'TestUser',
      lastname: 'admin',
      isAdmin: true,
    },
  });
  if (user) {
    console.log(user);
    return user[0];
  }
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
  // await findOrCreateEvent();
  await createEventOptions();
  console.log('INSERTING DATA TO MODELS');
};
