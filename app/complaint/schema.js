import Joi from 'joi'

export const createComplaintSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]+$/).required(),
    subject: Joi.string().required(),
    content: Joi.string().required(),
})