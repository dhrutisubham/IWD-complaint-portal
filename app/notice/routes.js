import { Router } from "express";
import validateAdmin from "../middleware/validateAdmin.js";
import { createNotice, deleteNoticeById, getAllNotices, getNoticeById } from "./service.js";


const noticeRouter = Router();

noticeRouter.get("",getAllNotices);
noticeRouter.get("/:id",getNoticeById);
noticeRouter.post("", validateAdmin(), createNotice)
noticeRouter.delete("/:id",validateAdmin(),deleteNoticeById);

export default noticeRouter;