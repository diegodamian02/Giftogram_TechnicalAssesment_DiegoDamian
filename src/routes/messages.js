const express = require("express");
const { pool } = require("../db");
const { sendError } = require("../utils/errors");
const send = require("send");
const router = express.Router();

/**
 * GET /view_messages
 * Query params: user_id_a, user_id_b
 * Response:
 * "messages:": [
 *      {"message_id": 1, "sender_user_id": 1, "message": "Hey", "epoch": 89542892389 }
 * ]
 */

router.get("/view_messages", async (req, res) => {
    try {
        const { user_id_a, user_id_b, user_id_sender, user_id_receiver } = req.query;
        const left = user_id_a ?? user_id_sender;
        const right = user_id_b ?? user_id_receiver;

        if(!left || !right) {
            return sendError(res, {
                status: 400,
                code: 100,
                title: "Validation Error",
                message: "user_id_a and user_id_b are required",
            });
        }

        const a = Number(left);
        const b = Number(right);

        if(!Number.isInteger(a) || !Number.isInteger(b)) {
            return sendError(res, {
                status: 400,
                code: 100,
                title: "Validation Error",
                message: "user_ids must be integers",
            });
        }

        // Pull messages between A and B in either direction, ordered by date
        const[rows] = await pool.query(
            `
            SELECT
                id AS message_id,
                sender_user_id,
                message,
                UNIX_TIMESTAMP(created_at) AS epoch
            FROM messages
            WHERE (sender_user_id = ? AND receiver_user_id = ?)
                OR (sender_user_id = ? AND receiver_user_id = ?)
            ORDER BY created_at ASC
            `,
            [a, b, b, a]
        );

        return res.status(200).json({ messages: rows });
    } catch(err) {
        console.error("view_messages error:", err);
        return sendError(res, {
            status: 500,
            code: 500,
            title: "Server Error",
            message: "An unexpected error occured.",
        });
    }
});

/**
 * POST /send_message
 * Body: { sender_user_id, receiver_user_id, message }
 * Success response:
 * {
 *   "success_code": 200,
 *   "success_title": "Message Sent",
 *   "success_message": "Message was sent successfully"
 * }
 */

router.post("/send_message", async (req, res) => {
    try {
        const { sender_user_id, receiver_user_id, message} = req.body;

        if(!sender_user_id || !receiver_user_id || !message) {
            return sendError(res, {
                status: 400,
                code: 100,
                title: "Validation Error",
                message: "All fields are required."
            });
        }

        const sender = Number(sender_user_id);
        const receiver = Number(receiver_user_id);

        if (!Number.isInteger(sender) || !Number.isInteger(receiver)) {
        return sendError(res, {
            status: 400,
            code: 100,
            title: "Validation Error",
            message: "sender_user_id and receiver_user_id must be integers.",
        });
        }

        if (sender === receiver) {
        return sendError(res, {
            status: 400,
            code: 102,
            title: "Message Failure",
            message: "sender_user_id and receiver_user_id must be different.",
        });
    
        }

        const [users] = await pool.query(
            "SELECT id FROM users WHERE id IN (?, ?)",
            [sender, receiver]
        );

        const userIds = new Set(users.map((u) => u.id));
        if (!userIds.has(sender) || !userIds.has(receiver)) {
            return sendError(res, {
                status: 404,
                code: 104,
                title: "User Not Found",
                message: "sender_user_id or receiver_user_id does not exist.",
            });
        }

        await pool.query(
            "INSERT INTO messages (sender_user_id, receiver_user_id, message) VALUES (?, ?, ?)",
            [sender, receiver, message]
        );

        return res.status(200).json({
            success_code: 200,
            success_title: "Message Sent",
            success_message: "Message was sent successfully",
        });

    } catch(err) {
        console.error("send_message_error:", err);
        return sendError(res, {
            status: 500,
            code: 500,
            title: "Server Error",
            message: "An unexcpected error occured."
        })
    }
});

module.exports = router;
