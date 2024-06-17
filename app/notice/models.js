import DataTypes from "sequelize";
import sequelize from "../../core/db.js";

export const Notice = sequelize.define("notice", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    }, // subject
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    }, // body
    expiryDate: {
        type: DataTypes.DATE,
        allowNull: false,
    }, // remove
    link : {
        type: DataTypes.STRING,
        allowNull: false,
    }
});



