-- Create DB (safe to run multiple times)
CREATE DATABASE IF NOT EXISTS giftogram_chat;
USE giftogram_chat;

-- Users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Messages
CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_user_id INT NOT NULL,
    receiver_user_id INT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_messages_sender
        FOREIGN KEY (sender_user_id) REFERENCES users(id)
        ON DELETE CASCADE,
    CONSTRAINT fk_messages_receiver
        FOREIGN KEY (receiver_user_id) REFERENCES users(id)
        ON DELETE CASCADE
);
 
-- helpful indexes
CREATE INDEX idx_messages_sender_received
ON messages(sender_user_id, receiver_user_id, created_at);

CREATE INDEX idx_messages_receiver_received
ON messages(receiver_user_id, sender_user_id, created_at);
