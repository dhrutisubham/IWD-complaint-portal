import { Router } from "express";
import { createNotice, deleteExpiredNotices, deleteNoticeById, getAllNotices, getNotices } from "./service.js";
import { createNoticeSchema } from "./schema.js";
import { validateBody } from "../middleware/validateBody.js";
import validateAdmin from "../middleware/validateAdmin.js";


const noticeRouter = Router();

// :TODO: add admin auth
noticeRouter.get("", getNotices);
noticeRouter.get("/all",validateAdmin(),getAllNotices);
noticeRouter.post("", validateBody(createNoticeSchema), createNotice)
noticeRouter.delete("/expired",deleteExpiredNotices);
noticeRouter.delete("/:id",validateAdmin(),deleteNoticeById);

export default noticeRouter;