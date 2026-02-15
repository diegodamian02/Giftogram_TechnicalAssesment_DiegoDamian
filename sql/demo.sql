-- Reset demo data
DELETE FROM messages;
DELETE FROM users;
ALTER TABLE users AUTO_INCREMENT = 1;
ALTER TABLE messages AUTO_INCREMENT = 1;

-- Demo users (plain passwords for assessment simplicity)
INSERT INTO users (email, password, first_name, last_name) VALUES
('diego@giftogram.com', 'diego123', 'Diego', 'Damian'),
('giftogram@giftogram.com', 'giftogram123', 'Gifto', 'Gram'),
('johnlennon@giftogram.com', 'johnlennon123', 'John', 'Lennon'),
('jimihendrix@giftogram.com', 'jimihendrix123', 'Jimi', 'Hendrix');

-- 8 demo messages (2 sent by each user)
INSERT INTO messages (sender_user_id, receiver_user_id, message) VALUES
(1, 2, 'Hey Giftogram — Diego here.'),
(1, 3, 'Yo John — Diego checking in.'),

(2, 1, 'Hi Diego, giftogram is so cool!'),
(2, 4, 'Hi Jimi — How are you?'),

(3, 4, 'John to Jimi: hello!'),
(3, 1, 'Hi Diego, whats up!.'),

(4, 2, 'Jimi here. Your music is great! User 2.'),
(4, 3, 'Jimi → John: awesome!');
