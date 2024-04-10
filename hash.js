import bcrypt from "bcrypt";
import readline from "readline";
import config from "./core/config.js";

export async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(config.saltRounds)
        const hashedPassword = await bcrypt.hash(password, salt)
        return hashedPassword
    } catch (e) {
        throw e
    }
}

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question('Enter your string: ', async (input) => {
    const hashedString = await hashPassword(input)
    console.log('Hashed String: ', hashedString);
    rl.close();
});