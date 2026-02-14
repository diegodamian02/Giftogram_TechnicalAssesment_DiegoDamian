const mysql = require("mysql2/promise");

function getEnv(name) {
    const value = process.env[name];
    if (!value) throw new Error(`Missing required env var: ${name}`);
    return value
}

const pool = mysql.createPool({
    host: getEnv("DB_HOST"),
    user: getEnv("DB_USER"),
    password: getEnv("DB_PASSWORD"),
    database: getEnv("DB_NAME"),
    port: Number(process.env.DB_PORT || 3306),
    waitForConnection: true,
    connectionLimit: 10,
    queueLimit: 0,

});

module.exports = { pool };

