var express = require('express');
var router = express.Router();
const User = require("../model/userModel");
const passport = require("passport");
const localStr = require("passport-local");

passport.use(new localStr(User.authenticate()))

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/signup', function (req, res, next) {
  res.render('signup');
});

router.get('/signin', function (req, res, next) {
  res.render('signin');
});

router.post('/signup', function (req, res, next) {

  const newuser = {
    username: req.body.username,
    email: req.body.email,
    name: req.body.name,
    phone: req.body.phone,
  }
  User.register(newuser, req.body.password)
    .then((registeruser) => {
      res.redirect('/signin');
    })
    .catch((err) => res.send(err))``
});

router.post('/signin', passport.authenticate("local", {
  successRedirect: "/profile",
  failureRedirect: "/"
}), function (req, res, next) {

  res.redirect('/profile');

});


router.get('/profile', isLoggedIn, function (req, res, next) {
  res.render("profile", { user: req.session.passport.user })
});

router.get('/logout', isLoggedIn, function (req, res, next) {
  req.logout(function () {
    res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();
  res.redirect("/")
}

router.get('/forget', function (req, res, next) {
  res.render('forget');
});

router.post('/forget', function (req, res, next) {
  User.findOne({ username: req.body.username })
    .then((userfound) => {
      if (userfound === null)
        return res.send("not found <a href='/'>home</a>")
      userfound.setPassword(req.body.password, function (err, user) {
        userfound.save();
        res.redirect("/")
      })
    })
    .catch((err) => res.send(err));
});

router.post('/reset', function (req, res, next) {
  const { oldpassword, password } = req.body;
  req.user.changePassword(oldpassword, password, function (err, user) {
    res.redirect("/")
  })
});








module.exports = router;
