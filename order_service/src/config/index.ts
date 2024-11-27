import dotenv from 'dotenv'
dotenv.config({path: '.env'})

console.log(process.env.DB_URL)
console.log(process.env.APP_PORT)

export const DB_URL = process.env.DB_URL
export const APP_PORT = process.env.APP_PORT

