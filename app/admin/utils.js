import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import config from "../../core/config.js";

export function generateJwtToken(payload) {
    const options = {
        expiresIn: config.loginExpiry,
    }
    const token = jwt.sign(payload, config.jwtSecret, options)
    return token
}

export async function comparePassword(inputPassword, hashedPassword) {
    try {
        const match = await bcrypt.compare(inputPassword, hashedPassword)
        return match
    } catch (error) {
        throw error
    }
}
