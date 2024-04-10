import { config  as dotenvconf} from 'dotenv'
dotenvconf()

const config = {
    port : 3000,
    saltRounds: 10,
    jwtSecret: process.env.JWT_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword:process.env.ADMIN_PASSWORD,
    safetyToken: process.env.SAFETY_TOKEN,
    loginExpiry: 60 * 60 * 24 * 7,
}

export default config;