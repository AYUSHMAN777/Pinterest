var express = require('express');
var router = express.Router();  //The Router() function is a method provided by Express to create a new router object. A router in Express is a way to modularize and organize your routes, middleware, and route handlers.
const userModel = require("./users");
const userPost = require("./Post");
const password = require('passport')
const localStrategy = require("passport-local");
const passport = require('passport');
password.use(new localStrategy(userModel.authenticate()));
const upload = require('./multer')
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.post('/upload', isLoggedIn, upload.single("file"), async function (req, res, next) { //Here, upload.single("file") specifies that the route expects a single file upload with the field name "file." This middleware will process the uploaded file and make it available in the req.file object.
  if (!req.file) {
    return res.status(400).send("no file were given")
  }
  // res.send("File Uploaded Succesfully");

  //  Data-Association
  const user = await userModel.findOne({
    username: req.session.passport.user,
  })
  const post = await userPost.create({
    image: req.file.filename,
    imageText: req.body.filecaption,
    user: user._id,
  })

  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});


router.get('/login', function (req, res, next) {
  // console.log(req.flash('error'))
  res.render('login', { error: req.flash('error') });
});

router.get('/feed', function (req, res, next) {
  res.render('feed');
});


router.get('/profile', isLoggedIn, async function (req, res, next) {
  const user = await userModel.findOne({
    username: req.session.passport.user  //In simple terms, this code is constructing a query to find a user in the database based on the username stored in the session. It's a way to retrieve the user's data from the database associated with the currently authenticated user.
  })
    .populate("posts")
  // console.log(user);
  res.render('profile', { user })
});


router.post("/register", function (req, res) {
  const userdata = new userModel({
    username: req.body.username,   //req.body is used to access the data sent in the request body during an HTTP POST request. The data is typically sent from an HTML form.
    email: req.body.email,   //You are assigning the value of req.body.email to the email property.
    fullName: req.body.fullName,//The name attributes of the form fields serve as keys in the req.body object. 
  }) 

  userModel.register(userdata, req.body.password)   //Passport provides a convenient method called register (often associated with the local strategy) that simplifies the process of creating a new user with hashed passwords.
    .then(function () {
      passport.authenticate("local")(req, res, function () {   // When you use passport.authenticate("local"), it means you are invoking the authentication middleware with the local strategy.
        res.redirect("/profile");
      })
    })
})

router.post("/login", passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash: true,
}), function (req, res) {
})

router.get('/logout', function (req, res, next) {
  req.logout(function (err) {  //req.logout is a method provided by Passport to log the user out of the application.
    if (err) { return next(err); }  //next(error) is used to pass any errors that occur during the asynchronous operation to the error-handling middleware
    res.redirect('/');
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect("/login");
}










// router.get('/userposts', async function (req, res, next) {
//   let user = await userModel
//   .findOne({ _id: "658aba2ce6378f7268fec4e7" })
//   .populate('posts');
//   res.send(user);
// });

// router.get('/createuser', async function (req, res, next) {
//   const createduser = await userModel.create({
//     username: "Ayushman",
//     password: "ayushman12700",
//     posts: [],
//     // dp: {
//     //   type: String,
//     //   default: 'default_avatar.jpg' // Default avatar image
//     // },
//     email: "Ayushman12700singh@gmail.com",
//     fullName: "Ayushman Aradhana Singh "
//   })
//   res.send(createduser);
// });

// router.get('/createpost', async function (req, res, next) {
//   let createdpost = await userPost.create({
//     postText: "Hello",
//     user: "658aba2ce6378f7268fec4e7"
//   })
//   let user = await userModel.findOne({ _id: "658aba2ce6378f7268fec4e7" });
//   user.posts.push(createdpost._id);
//   user.save();
//   res.send("Done");
// });



module.exports = router;
