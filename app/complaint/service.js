import fs from 'fs'
import path from 'path';
import busboy from 'busboy';
import {Op} from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import logger from "../../core/logger.js";
import config from "../../core/config.js";
import { Complaint, StatusChoices } from "./models.js";
import { createComplaintSchema } from './schema.js';
import { getExtensionFromMimeType } from '../../core/utlis.js';

export const createComplaint = async (req,res) => {

    let id = uuidv4(), status = StatusChoices.PENDING;
    let fileName = null;
        
    const bb = busboy({ headers: req.headers });
    bb.on('file', (name, file, info) => {
        fileName = `${uuidv4()}.${getExtensionFromMimeType(info.mimeType)}`;
        if (!config.allowedMimeTypes.complaints.includes(info.mimeType)) {
            return res.status(400).json({
                success: false,
                message: "File format not supported",
            });
        }

        const saveTo = path.join(config.complaintStaticDirPath, fileName);
        const writeStream = fs.createWriteStream(saveTo);
        file.pipe(writeStream);
    });

    let params = new Map();
    bb.on('field', (name, value, info) => {
        params.set(name, value);
    });

    bb.on('error', (err) => {
        console.error('Busboy error:', err.message);
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    });

    bb.on('finish', async () => {
        let paramsObject = Object.fromEntries(params);
        console.log(paramsObject);

        const { error, value } = createComplaintSchema.validate(paramsObject);

        if (error) {
            const errorMessage = error.details
                .map((detail) => detail.message)
                .join('; ');
            return res.status(400).json({
                success: false,
                message: errorMessage,
            });
        }
        
        paramsObject['id'] = id;
        paramsObject['status'] = status;
        paramsObject['fileName'] = fileName;
        try {
            const newComplaint = await Complaint.create(paramsObject);
            return res.status(201).json({
                success: true,
                complaint: newComplaint
            });
        } catch (error) {
            console.error('Error creating complaint:', error);
            return res.status(500).json({
                success: false,
                error: 'Failed to create complaint, please try again.'
            });
        }
    });

    req.pipe(bb);
};

//:TODO: add pagination and location and type filter
export const getComplaints = async (req, res) => {
    try {
        const { name, createdBefore, createdAfter, email, issue } = req.query;

        const filter = {};
        if (name) {
            filter.name = { [Op.like]: `%${name}%` };
        }
        if (createdBefore) {
            filter.createdAt = { [Op.lt]: new Date(createdBefore) };
        }
        if (createdAfter) {
            filter.createdAt = { [Op.gt]: new Date(createdAfter) };
        }
        if (email) {
            filter.email = { [Op.like]: `%${email}%` };
        }
        if (subject) {
            filter.issue = { [Op.like]: `%${issue}%` };
        }

        const complaints = await Complaint.findAll({
            where: filter
        });

        res.status(200).json({
            success: true,
            complaints
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};