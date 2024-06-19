import Joi from 'joi'
import { StatusChoices } from './models.js';

export const createComplaintSchema = Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().pattern(/^[0-9]+$/).required(),
    issue: Joi.string().required(),
    issueType:Joi.string().required(),
    description: Joi.string().required(),
    locationZone:Joi.string().required(),
})

export const createComplaintFileSchema =  Joi.object({
    originalname: Joi.string().required(),
    mimetype: Joi.string().valid(
        'image/jpeg', 
        'image/png', 
        'application/pdf'
    ).required(),
    size: Joi.number().max(20 *1024 * 1024).required()  // Max size: 20MB
}).unknown(true);


export const changeComplaintStatusSchema =  Joi.object({
    id:Joi.string().required(),
    status: Joi.string().valid(
        StatusChoices.PENDING,
        StatusChoices.RESOLVED
    ).required(),
});