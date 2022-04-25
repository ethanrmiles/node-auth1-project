// Require the `restricted` middleware from `auth-middleware.js`. You will need it here!
const router = require('express').Router()
const bcrypt = require('bcryptjs')
const model = require('./users-model')
const restricted = require('../auth/auth-middleware')

router.get('/', (req,res,next) => {
  model.find()
  .then(users => {
    res.status(200).json(users)
  })
  .catch(next)
})


module.exports = router