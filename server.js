import cors from "cors";
import morgan from "morgan";
import express from "express";
import sequelize from "./core/db.js";
import logger from './core/logger.js';
import config from "./core/config.js";
import cookieParser from 'cookie-parser'
import complaintRouter from "./app/complaint/routes.js";
import noticeRouter from "./app/notice/routes.js";
import adminRouter from "./app/admin/routes.js";

const app = express();

const allowedOrigins = []

// -----------MIDDLEWARE-------------
app.use(
    cors({
        origin: allowedOrigins,
        methods: 'GET,POST,DELETE',
        credentials: true,
    }),
)

app.use(express.json())
app.use(cookieParser())

morgan.token('pino-logger', (req, res) => {
    // all it does is print incoming http request
    logger.info({ method: req.method, url: req.originalUrl }, 'HTTP Request')
    return ''
})
app.use(morgan(':pino-logger'))

// -----------ROUTES---------------
app.use('/api/admin', adminRouter);
app.use('/api/notice', noticeRouter);
app.use('/api/complaint',complaintRouter);

app.use('*', (req, res, next) => {
    return res.status(404).json({
        message: 'Not found',
    })
})


app.listen(config.port, async () => {
    logger.info(`Server is running on port ${config.port}`);
    try{
        await sequelize.authenticate();
        logger.info(`Database connected`);
        await sequelize.sync({force: false});
        logger.info(`Database synced`);
    }
    catch(error){
        logger.error(error);
    }
});
