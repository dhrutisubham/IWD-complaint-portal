import Joi from 'joi'

export const createNoticeSchema = Joi.object({
    title: Joi.string().required(),
    content: Joi.string().required(),
    expiryDate: Joi.date().required(),
    link : Joi.string().required()
})