import jwt from "jsonwebtoken";
import config from "../../core/config.js";
import logger from "../../core/logger.js";


function checkJwtToken(token) {
    try {
        const decoded = jwt.verify(token, config.jwtSecret)
        return decoded
    } catch (error) {
        throw error
    }
}

const validateAdmin = () => {
    return async (req, res, next) => {
        const token = req.cookies.access_token

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Unauthorised, Token not found',
            })
        }

        try {
            const payload = checkJwtToken(token)

            if (!payload.email || !payload.safetyToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorised, Invalid token',
                })
            }

            if ((payload.email !== config.adminEmail) || (payload.safetyToken !== config.safetyToken)) {
                return res.status(401).json({
                    success: false,
                    message: 'Unauthorised, Invalid token',
                })
            }
            next()

        } catch (e) {
            logger.error(e)
            return res.status(500).json({
                success: false,
                message: 'cant complete the action',
            })
        }
    }
}

export default validateAdmin;