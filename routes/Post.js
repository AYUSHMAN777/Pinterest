const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  createdAt: {
    type: Date,
    default: Date.now
  },
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User'
  },
  likes: {
    type: Array,
    default: []
  },
  image: {
    type: String,
  },
  imageText: {
    type: String,
    required: true,
  }
  // postText: {
  //   type: String,
  //   required: true
  // }
  // Other fields specific to posts can be added as needed
});
//created a post model
module.exports = mongoose.model('Post', postSchema);

