import DataTypes from "sequelize";
import sequelize from "../../core/db.js";

export const Complaint = sequelize.define("complaint", {
    id: {
        type: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    issue: {
        type: DataTypes.STRING,
        allowNull: false,
    }, // subject
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    issueType:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull:false,
    },
    locationZone:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    fileName:{
        type:DataTypes.STRING,
        allowNull:true,
        defaultValue:null
    }
});

export const StatusChoices = {
    PENDING: "pending"
}