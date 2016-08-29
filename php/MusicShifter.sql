CREATE DATABASE MusicShifter;

CREATE TABLE EQ(
    id INT AUTO INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    playbackRate FLOAT NOT NULL,
    trebleLevel INT NOT NULL,
    midLevel INT NOT NULL,
    bassLevel INT NOT NULL
);