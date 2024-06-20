import DataTypes from "sequelize";
import sequelize from "../../core/db.js";

export const Notice = sequelize.define("notice", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    subject: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    body: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    link : {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue:null
    },
    fileName:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:null
    }
});



