import {Op} from "sequelize";
import { Complaint } from "./models.js";
import logger from "../../core/logger.js";

export const createComplaint = async (req,res) => {
    const {
        name,
        email,
        phone,
        subject,
        content
    } = req.body;

    try {
        const newComplaint = await Complaint.create({
            name,
            email,
            phone,
            subject,
            content
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

export const getComplaints = async (req, res) => {
    try {
        const { name, createdBefore, createdAfter, email, subject } = req.query;

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
            filter.subject = { [Op.like]: `%${subject}%` };
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