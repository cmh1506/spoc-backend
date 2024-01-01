var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var mongoose = require("mongoose")
var app = express()
var User = require('./models/User.js')
var Post = require('./models/Post.js')
//mongoose.connect("mongodb+srv://cmh1506:spocburth@cluster0.eirag.mongodb.net/?retryWrites=true&w=majority") //mongodb://127.0.0.1/pssocial
const URL = process.env.URL
mongoose.connect(URL)


var auth = require('./auth')
var jwt = require("jwt-simple")

app.use(cors())
app.use(bodyParser.json())



app.get('/posts/:id', async (req, res) => {
  var author = req.params.id
  var posts = await Post.find({ author })
  res.json(posts)
})

app.post('/post', auth.checkAuthenticated, (req, res) => {
  var postData = req.body
  postData.author = req.userId
  var post = new Post(postData)
  post.save()
  console.log("Alles ok")
  res.status(200).json('Alles klar')
})

app.get('/users', async (req, res) => {
  try {
    var users = await User.find({}, "-pwd -__v")
    res.json(users)
  } catch (error) {
    console.log(error)
    res.sendStatus(500)
  }

})

app.get('/user/:_id', async (req, res) => {
  try {
    var user = await User.findById(req.params._id, '-pwd -__v')
    res.json(user)
  } catch (error) {
    console.error(error)
    res.sendStatus(500)
  }
  console.log(req.params._id)

})

app.use('/auth', auth.router)

app.listen(3000)