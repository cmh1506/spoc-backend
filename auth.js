var User = require('./models/User')
var bcrypt = require('bcrypt-nodejs')
var jwt = require("jwt-simple")
var express = require('express')
var router = express.Router()

router.post('/register', (req, res) => {
  console.log("/register")
  var userData = req.body
  var newUser = new User(userData)
  try {
    newUser.save()
    createSendToken(res, newUser)
  } catch (error) {
    return res.status(500).send({ message: 'Registration not successful.' })
  }
})

router.post('/loginUser', async (req, res) => {
  console.log("/loginUser")
  var loginData = req.body
  var user = await User.findOne({ email: loginData.email })
  if (!user) res.status(401).send({ message: 'Login not successful!' })
  bcrypt.compare(loginData.pwd, user.pwd, (err, isMatch) => {
    if (!isMatch) return res.status(401).send({ message: 'Login not successful!' })
    createSendToken(res, user)
  })
})

function createSendToken(res, user){
  var payload = { sub: user._id }
    var token = jwt.encode(payload, "secret")
    console.log(token)
    res.status(200).send({ token: token })
}

var auth = {
  router,
  checkAuthenticated: (req, res, next) => {
    if (!req.header('authorization')) return res.status(401).semd({ message: "Authorization failed!" })
    var token = req.header('authorization').split(' ')[1]
    var payload = jwt.decode(token, 'secret')
    if (!payload) return res.status(401).semd({ message: "Authorization failed!" })
    req.userId = payload.sub
    next()
  }
}

module.exports = auth