const express = require("express");
const bcrypt = require("bcryptjs");
const { pool } = require("../db")
const { sendError } = require("../utils/errors");
const router = express.Router();

/**
 * POST /register
 * Body: {email, password, emial, f_name, l_name}
 * Response: {user_id, email, f_name, l_name}
 */

router.post("/register", async (req, res) => {
    try {
        const { email, password, first_name, last_name} = req.body;

        if(!email || !password || !first_name || !last_name) {
            return sendError(res, {
                status: 400,
                code: 100,
                title: "Validation Error",
                message: "email, password, first_name, and last_name are required.",
            });
        }

        // Check if it already exists
        const [existing] = await pool.query(
            "SELECT id FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if(existing.length > 0){
            return sendError(res, {
                status: 409,
                code: 102,
                title: "Registration Failure",
                message: "A user with that email already exists.",
            });
        }

        // hash password - optional implementation
        const password_hash = await bcrypt.hash(password, 10);

        //Insert user
        const [result] = await pool.query(
           ` INSERT INTO users (email, password_hash, first_name, last_name)
           VAlues (?, ?, ?, ?)`,
           [email, password_hash, first_name, last_name]
        );

        return res.status(201).json({
            user_id: result.insertId,
            email,
            first_name,
            last_name
        });
    } catch(err) {
        console.error("Register error", err);
        return sendError(res, {
            status: 500,
            code: 500,
            title: "Server Error",
            message: "An unexpected error occurred.",
        });
    }
});

module.exports = router;