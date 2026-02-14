function sendError(res, { status = 400, code, title, message }) {
    return res.status(status).json({
        error_code: code,
        error_title: title,
        error_message: message,
    });
}
module.exports = { sendError }
