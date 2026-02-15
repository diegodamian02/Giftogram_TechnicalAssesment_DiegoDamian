const express = require("express");
const bcrypt = require("bcryptjs");
const { pool } = require("../db")
const { sendError } = require("../utils/errors");
const send = require("send");
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

/**
 * POST /login
 * Body: { email, password }
 * Response: { user_id }
 */

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if(!email || !password ) {
            return sendError(res, {
                status: 400,
                code: 100,
                title: "Validation Error",
                message: "email and password are required."
            });
        }
        const [rows] = await pool.query(
            "SELECT id, password_hash FROM users WHERE email = ? LIMIT 1",
            [email]
        );

        if(rows.length === 0) {
            return sendError(res, {
                status: 401,
                code: 101,
                title: "Loign Failure",
                message: "Invalid email or password.",
            });
        }

        const user = rows[0];
        const ok = await bcrypt.compare(password, user.password_hash);

        if(!ok) {
            return sendError(res, {
                status: 401, 
                code: 101,
                title: "Login Failure",
                message: "Invalid email or password."
            });
        }

        return res.status(200).json({ user_id: user.user_id});
    } catch(err) {
        console.error("Login error:", err);
        return sendError(res, {
            status: 500,
            code: 500,
            title: "Server Error",
            message: "An unexpectede error occurred."
        });
    }
});

/**
 * GET /list_all_users
 * Query param: requeste_user_id
 */

router.get("/list_all_users", async (req, res) => {
    try {
        const { requester_user_id } = req.query;

        if(!requester_user_id) {
            return sendError(res, {
                status: 400,
                code: 100,
                title: "Validation Error",
                message: "requester_user_id is requiered.",
            });
        }

        const requesterID = Number(requester_user_id);

        if(!Number.isInteger(requesterID)) {
            return sendError(res, {
                status: 400,
                code: 100,
                title: "Validation Error",
                message: "requester_user_id is required."
            });
        }

        const [rows] = await pool.query(

            `
            SELECT
                id AS user_id,
                email,
                first_name,
                last_name
                FROM users
                WHERE id != ?
                ORDER BY id ASC
           
            `,
            [requesterID]
        );

        return res.status(200).json({ users: rows})

    } catch(err) {
        console.error("list_all_users error:". err);

        return sendError(res, {
            status: 500,
            code: 500, 
            title: "Server Error",
            message: "An unexpected error occurred."
        });
    }
});



module.exports = router;