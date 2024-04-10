import config from "../../core/config.js"
import { comparePassword, generateJwtToken } from "./utils.js"



export const login = async (req, res) => {
    const {
        email,
        password
    } = req.body

    try {

        if (email !== config.adminEmail ) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const match = await comparePassword(password, config.adminPassword);

        if (!match) {
            return res.status(400).json({
                success: false,
                message: 'Invalid email or password',
            })
        }

        const payload = {
            email: email,
            safetyToken: config.safetyToken,
        }

        const acessToken = generateJwtToken(payload)

        res.cookie('access_token', acessToken, {
            maxAge: 24 * 60 * 60 * 1000,
            httpOnly: true,
            sameSite: 'None',
            path: '/',
            secure: true,
        })

        return res.status(200).json({
            success: true,
            message: 'Login successful',
        })
    } catch (e) {
        logger.error(e)
        return res.status(500).json({
            success: false,
            message: 'Login failed, server error',
        })
    }
}

export const logout = (req, res) => {
    try {
        res.clearCookie('access_token', {
            path: '/',
        })

        return res.status(200).json({
            success: true,
            message: 'Logged out successfully',
        })
    } catch (error) {
        logger.error(error)
        return res.status(500).json({
            success: false,
            message: 'Logout failed, server error',
        })
    }
}

