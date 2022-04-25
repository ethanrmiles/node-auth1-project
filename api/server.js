const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const session = require('express-session')
const userRouter = require('./users/users-router')

const sessionConfig = {
  secret: 'hlkajshdfJLKHFfs',
  name: 'chocolatechip',
  cookie: {
    maxAge: 1000 * 60 * 5,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,
}

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(session(sessionConfig))

server.get("/", (req, res) => {
  res.json({ api: "up" });
});

server.use('/api/users', userRouter)

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
