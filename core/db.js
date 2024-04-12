import { Sequelize, DataTypes } from 'sequelize';
import logger from './logger.js';

const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: './db/database.sqlite',
    logging: (msg) => {
        logger.info(msg); // Pass the log message to your Pino logger
    }
});

export default sequelize