import path from 'path'
import { fileURLToPath } from 'url';
import { config  as dotenvconf} from 'dotenv'
dotenvconf()

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
    port : 3000,
    saltRounds: 10,
    jwtSecret: process.env.JWT_SECRET,
    adminEmail: process.env.ADMIN_EMAIL,
    adminPassword:process.env.ADMIN_PASSWORD,
    safetyToken: process.env.SAFETY_TOKEN,
    loginExpiry: 60 * 60 * 24 * 7,
    noticeStaticDirPath: path.join(__dirname,'static','notices'),
    complaintStaticDirPath: path.join(__dirname,'static','complaints'),
    allowedMimeTypes :{
        complaints:[
            'image/jpeg', 
            'image/png', 
            'application/pdf'
        ]
    }
}

export default config;