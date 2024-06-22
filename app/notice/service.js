import fs from 'fs';
import path from 'path';
import busboy from "busboy";
import { v4 as uuidv4 } from 'uuid';
import fsPromises from 'fs/promises';
import { Notice } from "./models.js";
import config from "../../core/config.js";
import { createNoticeSchema } from "./schema.js";
import { getExtensionFromMimeType } from '../../core/utlis.js';

export const createNotice = async (req, res) => {
    try {
        const bb = busboy({ headers: req.headers });
        let fileName = null;

        bb.on('file', (name, file, info) => {
            fileName = `${uuidv4()}.${getExtensionFromMimeType(info.mimeType)}`;
            if (!config.allowedMimeTypes.notices.includes(info.mimeType)) {
                return res.status(400).json({
                    success: false,
                    message: "File format not supported",
                });
            }
    
            const saveTo = path.join(config.noticeStaticDirPath, fileName);
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
    
            const { error, value } = createNoticeSchema.validate(paramsObject);
    
            if (error) {
                const errorMessage = error.details
                    .map((detail) => detail.message)
                    .join('; ');
                return res.status(400).json({
                    success: false,
                    message: errorMessage,
                });
            }
            
            paramsObject['fileName'] = fileName;
            try {
                const newNotice = await Notice.create(paramsObject);
                return res.status(201).json({
                    success: true,
                    complaint: newNotice
                });
            } catch (error) {
                console.error('Error creating Notice:', error);
                return res.status(500).json({
                    success: false,
                    error: 'Failed to create Notice, please try again.'
                });
            }
        });
    
        req.pipe(bb);

    } catch (error) {
        console.error('Error creating notice:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error'
        });
    }
};

export const getAllNotices = async (req, res) => {
    try {
        const notices = await Notice.findAll();

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

export const getNoticeById = async (req, res) => {
    try{

        const id  = parseInt(req.params.id, null);
        
        if (!id) {
            return res.status(400).json({ success: false, error: 'Invalid ID provided' });
        }
    
        const notice = await Notice.findByPk(id);
    
        if (!notice) {
            return res.status(404).json({ success: false, error: 'Notice not found' });
        }

        res.status(200).json({
            success: true, 
            notice 
        });

    } catch (error) {
        console.error('Error getting notice by ID:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }

}

export const deleteNoticeById = async (req, res) => {
    try {
        const id  = parseInt(req.params.id, null);

        if (!id ) {
            return res.status(400).json({ success: false, error: 'Invalid ID provided' });
        }

        const notice = await Notice.findByPk(id);

        if (!notice) {
            return res.status(404).json({ success: false, error: 'Notice not found' });
        }

        await notice.destroy();
        
        try {
            if(fileName){
                const filePath = path.join(config.noticeStaticDirPath,notice.fileName);
                await fsPromises.unlink(filePath);
                console.log(`File deleted: ${filePath}`);
            }
        } catch (err) {
            if (err.code === 'ENOENT') {
                console.error(`File not found: ${filePath}`);
            } else {
                console.error(`Error deleting file: ${err}`);
            }
        }
        res.status(200).json({ success: true, message: 'Notice deleted successfully' });
    } catch (error) {
        console.error('Error deleting notice by ID:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
};
