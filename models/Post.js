var mongoose = require('mongoose')
const User = require('./User')

module.exports = mongoose.model('Post', {
  msg: String,
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
})