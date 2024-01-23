const mongoose = require('mongoose');
const plm =require("passport-local-mongoose")
mongoose.connect("mongodb://127.0.0.1:27017/Pinterest");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    // unique: true
  },
  password: {
    type: String,
   
  },
  posts: [
    {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Post'     //jiski model ki id use kr rhe h
    }
  ],
  dp: {
    type: String,
    default: 'default_avatar.jpg' // Default avatar image
  },
  email: {
    type: String,
    required: true,
    // unique: true
  },
  fullName: {
    type: String,
    required: true
  }
  // Other fields can be added as needed
});

userSchema.plugin(plm)
module.exports = mongoose.model('User', userSchema);


