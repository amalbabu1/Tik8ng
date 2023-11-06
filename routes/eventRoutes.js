const { Router } = require('express');
const { authenticateUser, authorizePermission } = require('../middleware/authenticate');
const { validate } = require('../middleware/validate');
const {
  createEvent,
  getAllEvents,
  editEvent,
  getSingleEvent,
  deleteEvent,
} = require('../controllers/eventController');
const eventValidation = require('../validations/eventValidation');

const eventRouter = Router();

eventRouter.post(
  '/',
  authenticateUser,
  authorizePermission('admin'),
  validate(eventValidation.createEvent),
  createEvent
);

eventRouter.get(
  '/',
  authenticateUser,
  authorizePermission('admin'),
  validate(eventValidation.getEvent),
  getAllEvents
);

eventRouter.patch(
  '/:id',
  authenticateUser,
  authorizePermission('admin'),
  validate(eventValidation.editEvent),
  editEvent
);

eventRouter.get('/:id', authenticateUser, validate(eventValidation.getSingleEvent), getSingleEvent);

eventRouter.delete(
  '/:id',
  authenticateUser,
  authorizePermission('admin'),
  validate(eventValidation.getSingleEvent),
  deleteEvent
);

module.exports = eventRouter;
