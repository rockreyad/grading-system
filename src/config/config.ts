import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

const SERVER_PORT = process.env.SERVER_PORT;

export const config = {
    mongo: {
        url: DATABASE_URL
    },
    server: {
        port: SERVER_PORT
    }
};
