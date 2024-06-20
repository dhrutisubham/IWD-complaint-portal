import Joi from 'joi'

export const createNoticeSchema = Joi.object({
    subject: Joi.string().required(),
    body: Joi.string().required(),
    link : Joi.string()
})