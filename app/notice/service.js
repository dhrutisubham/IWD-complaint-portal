import { Notice } from "./models.js";
import {Op} from "sequelize";

export const createNotice = async (req, res) => {
    try {
        const { title, content, expiryDate, link } = req.body;

        const newNotice = await Notice.create({
            title,
            content,
            expiryDate,
            link
        });

        res.status(201).json({
            success: true,
            notice: newNotice
        });
    } catch (error) {
        console.error('Error creating notice:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

export const getNotices = async (req, res) => {
    try {
        const notices = await Notice.findAll({
            where: {
                expiryDate: {
                    [Op.gt]: new Date()
                }
            },
            attributes: ['id', 'title', 'content', 'link']
        });

        res.status(200).json({
            success: true,
            notices
        });
    } catch (error) {

        console.error('Error fetching notices:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

export const getAllNotices = async (req, res) => {
    try {
        const { title, expiryDateBefore, expiryDateAfter } = req.query;

        const filter = {};
        if (title) {
            filter.title = { [Op.like]: `%${title}%` };
        }
        if (expiryDateBefore) {
            filter.expiryDate = { [Op.lt]: new Date(expiryDateBefore) };
        }
        if (expiryDateAfter) {
            filter.expiryDate = { [Op.gt]: new Date(expiryDateAfter) };
        }

        const notices = await Notice.findAll({
            where: filter
        });

        res.status(200).json({
            success: true,
            notices
        });
    } catch (error) {
        console.error('Error fetching notices:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};
export const deleteExpiredNotices = async (req, res) => {
    try {
        const expiredNotices = await Notice.findAll({
            where: {
                expiryDate: {
                    [Op.lt]: new Date()
                }
            }
        });

        const deleteResults = await Promise.all(expiredNotices.map(notice => notice.destroy()));
        const deletedCount = deleteResults.length;

        res.status(200).json({
            success: true,
            message: `${deletedCount} expired notices deleted successfully.`
        });
    } catch (error) {
        console.error('Error deleting expired notices:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

export const deleteNoticeById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id ) {
            return res.status(400).json({ success: false, error: 'Invalid ID provided' });
        }

        const notice = await Notice.findByPk(id);

        if (!notice) {
            return res.status(404).json({ success: false, error: 'Notice not found' });
        }

        await notice.destroy();

        res.status(200).json({ success: true, message: 'Notice deleted successfully' });
    } catch (error) {
        console.error('Error deleting notice by ID:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
