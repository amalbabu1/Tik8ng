const Joi = require('joi');

const createEvent = {
  body: Joi.object().keys({
    name: Joi.string().required(),
    details: Joi.string(),
    active: Joi.boolean(),
  }),
};

const getEvent = {
  query: Joi.object().keys({
    active: Joi.boolean(),
    createdBy: Joi.number().integer(),
    limit: Joi.number().integer().min(1).max(10),
    skip: Joi.number().integer(),
  }),
};

const editEvent = {
  params: Joi.object().keys({
    id: Joi.number().integer().required(),
  }),
  body: Joi.object().keys({
    name: Joi.string(),
    details: Joi.string(),
    active: Joi.boolean(),
  }),
};

const getSingleEvent = {
  params: Joi.object().keys({
    id: Joi.number().integer(),
  }),
};
module.exports = {
  createEvent,
  getEvent,
  editEvent,
  getSingleEvent,
};
