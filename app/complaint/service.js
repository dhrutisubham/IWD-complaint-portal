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

export const getComplaints = async (req, res) => {
    const DEFAULT_PAGE_SIZE = 10;
    try {
        const { name, createdBefore, createdAfter, email, subject, pageSize, pageNumber} = req.query;

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

        const limit = pageSize ? parseInt(pageSize, 10) : DEFAULT_PAGE_SIZE; 
        const page = pageNumber ? parseInt(pageNumber, 10) : 1; 
        const offset = (page - 1) * limit;

        const complaints = await Complaint.findAll({
            attributes:[
                'id',
                'locationZone',
                'status',
                'issue',
                'createdAt',
                'issueType',
                'fileName'
            ],
            where: filter,
            // limit: limit,
            // offset: offset
        });

        res.status(200).json({
            success: true,
            page,
            complaints,
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

export const getComplaintsByID = async (req, res) => {
    try {
        const id  = req.params.id;
        const complaint = await Complaint.findByPk(id);

        res.status(200).json({
            success: true,
            complaint,
        });
    } catch (error) {
        console.error('Error fetching complaints:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};


export const changeStatus = async (req, res) => {
    try {
        const {id,status} = req.body;

        const [updatedRows] = await Complaint.update(
            { status: status },
            { where: { id: id } }
        );

        if (updatedRows === 0) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found or no changes made.'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Complaint status updated successfully.'
        });

    } catch (error) {
        logger.error('Error fetching complaints:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};