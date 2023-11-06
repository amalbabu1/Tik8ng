const { StatusCodes } = require('http-status-codes');
const Event = require('../models/Event');

const createEvent = async (req, res) => {
  req.body.createdBy = req.user.id;
  try {
    const event = await Event.create(req.body);
    res.status(StatusCodes.CREATED).json(event);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.errors[0].message });
  }
};
const getSingleEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (event) res.status(StatusCodes.OK).json(event);
    res.status(StatusCodes.OK).json({ message: 'No event found' });
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

const getAllEvents = async (req, res) => {
  let attributes = {};

  if ('active' in req.query) attributes.active = req.query.active;
  if ('createdBy' in req.query) attributes.createdBy = req.query.createdBy;

  const limit = req.query.limit || 10;
  const skip = req.query.skip || 0;

  try {
    const events = await Event.findAll({
      where: attributes,
      limit: limit,
      offset: skip,
    });
    res.status(StatusCodes.OK).json({ data: events, length: events.length });
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};
const editEvent = async (req, res) => {
  try {
    const event = await Event.findOne({
      where: {
        id: req.params.id,
      },
    });
    await event.update({
      ...req.body,
    });
    const new_event = await event.save();
    return res.status(StatusCodes.OK).json(new_event);
  } catch (error) {
    res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
  console.log(req.params);
  res.send('Event editted');
};

const deleteEvent = async (req, res) => {
  console.log('delet');
  try {
    const event = await Event.findByPk(req.params.id);
    if (event.active) {
      await event.update({
        active: false,
      });
      await event.save();
      return res.status(StatusCodes.OK).json({ message: 'deleted' });
    } else {
      return res.status(StatusCodes.BAD_REQUEST).send({ message: 'No item found' });
    }
  } catch (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({ error: error.message });
  }
};

module.exports = {
  createEvent,
  getAllEvents,
  editEvent,
  getSingleEvent,
  deleteEvent,
};
