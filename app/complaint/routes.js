import multer from "multer";
import { Router } from "express";
import config from "../../core/config.js";
import { validateFile } from "../middleware/validateFile.js"
import validateAdmin from "../middleware/validateAdmin.js";
import { validateBody } from "../middleware/validateBody.js";
import { createComplaint, getComplaints } from "./service.js";
import { createComplaintFileSchema, createComplaintSchema } from "./schema.js";
const upload = multer({dest: config.complaintStaticDirPath});
const complaintRouter = Router();

complaintRouter.get("",validateAdmin(), getComplaints);
complaintRouter.post("", 
    // validateBody(createComplaintSchema), 
    // validateFile(createComplaintFileSchema),
    upload.single('file'),
    createComplaint
)

export default complaintRouter;