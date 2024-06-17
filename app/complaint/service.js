import fs from 'fs'
import path from 'path';
import {Op} from "sequelize";
import { v4 as uuidv4 } from 'uuid';
import { Complaint, StatusChoices } from "./models.js";
import logger from "../../core/logger.js";
import config from "../../core/config.js";

export const createComplaint = async (req,res) => {

    const {
        name,
        address,
        email,
        phone,
        issue,
        issueType,
        description,
        locationZone
    } = req.body;
    let id =  uuidv4(), status = StatusChoices.PENDING, fileName = null;
    console.log(req.file);

    if (req.file) {
        try{ 
            req.file.originalname = uuidv4(); 
            fileName = req.file.originalname;
            const filePath = path.join(config.complaintStaticDirPath, req.file.originalname);
            fs.writeFile(filePath, req.file.buffer, err => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ error: 'Error saving file' });
                }});
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    try {
        const newComplaint = await Complaint.create({
            id,
            name,
            email,
            address,
            phone,
            issue,
            description,
            issueType,
            status,
            locationZone,
            fileName
        });
        res.status(201).json({
            success: true,
            complaint: newComplaint
        });
    } catch (error) {
        logger.error('Error creating complaint:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to create complaint, please try again.'
        });
    }
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