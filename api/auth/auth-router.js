const router = require('express').Router()
const bcrypt = require('bcryptjs')
const model = require('../users/users-model')
const middleware = require('./auth-middleware')


// Require `checkUsernameFree`, `checkUsernameExists` and `checkPasswordLength`
// middleware functions from `auth-middleware.js`. You will need them here!

router.post('/register', async(req,res,next) => {
  try {
    const { username, password } = req.body
    const hash = bcrypt.hashSync(password,12)
    const user = { username, password: hash }
    await model.add(user)
    res.status(201).json({ message: `Congrats ${username}, you have successfully registered!`})
  }catch(err){
    next(err)
  }
})

router.post('/login', async(req,res,next) => {
  try{
    const { username, password } = req.body

    const user = await model.findBy({ username }).first()

    if (user === null){
      res.status(401).json('Invalid credentials')
      return
    }

    const success = bcrypt.compareSync(password, user.password)
    if(!success){
      res.status(401).json('Invalid credentials')
      return
    }

    req.session.user = user
    res.status(200).json({ message: `You are now logged in, ${username}`})
    }
    catch(err){
    next(err)
  }
})

router.get('/logout', (req,res,next) => {
  if(req.session.user){
    req.session.destroy(err => {
      if (err != null){
        next(err)
        return
      }
      res.status(200).json({ message: 'You are now logeed out!'})
    })
  } else {
    res.status(200).json({ message: 'You were already logged out'})
  }
})


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response on username taken:
  status 422
  {
    "message": "Username taken"
  }

  response on password three chars or less:
  status 422
  {
    "message": "Password must be longer than 3 chars"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  status 200
  {
    "message": "Welcome sue!"
  }

  response on invalid credentials:
  status 401
  {
    "message": "Invalid credentials"
  }
 */


/**
  3 [GET] /api/auth/logout

  response for logged-in users:
  status 200
  {
    "message": "logged out"
  }

  response for not-logged-in users:
  status 200
  {
    "message": "no session"
  }
 */

 
// Don't forget to add the router to the `exports` object so it can be required in other modules

module.exports = router