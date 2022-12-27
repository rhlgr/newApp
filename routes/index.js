var express = require('express');
var router = express.Router();

const User = require('../model/userModel');
const passport = require('passport');
const localStrategy = require('passport-local');
passport.use(new localStrategy(User.authenticate()));


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

router.get('/forget', function (req, res, next) {
  res.render('forget');
});

router.get('/reset', function (req, res, next) {
  res.render('reset');
});


router.post('/signup', function (req, res, next) {
  const { username, name, phone, password, email } = req.body;
  const newUser = {
    username, email, phone, name
  }
  User.register(newUser, password)
    .then((u) => {
      res.redirect('/signin');
    })
    .catch((err) => {
      res.send(err);
    });

});

router.post('/signin', passport.authenticate('local', {
  successRedirect: "/profile",
  failureRedirect: "/",
}),
  function (req, res, next) { }
);


router.post("/forget", function (req, res, next) {
  User.findOne({ username: req.body.username })
      .then((userFound) => {
          if (userFound === null)
              return res.send("not found <a href='/'>home</a>");

          userFound.setPassword(req.body.password, function (err, user) {
              userFound.save();
              res.redirect("/");
          });
      })
      .catch((err) => res.send(err));
});



router.get('/profile', isLoggedIn, function (req, res) {
  res.render("profile", { user: req.session.passport.user });
  // console.log(req.session);
  // console.log(req.session.passport);
});


router.post("/change", isLoggedIn, function (req, res, next) {
  // res.send(req.user);

  const { oldpassword, newpassword } = req.body;
  req.user.changePassword(oldpassword, newpassword, function (err, user) {
      if (err) {
          res.send(err);
      }
      res.redirect("/logout");
  });
});

// router.post("/reset", function (req, res, next) {
//   User.find({ username: req.body.username, oldpassword: req.body.oldpassword })
//   .then((userFound) => {
//       if (userFound === null)
//           return res.send("not found <a href='/'>home</a>");
//   userFound.changePassword(oldpassword, newpassword, function (err, user) {
//     userFound.save();
//       res.redirect("/");
//     })
//     .catch((err) => res.send(err));
// });
// });

router.get("/logout", isLoggedIn, function (req, res, next) {
  req.logout(function () {
      res.redirect("/");
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      next();
      return;
  }
  res.redirect("/");
}



module.exports = router;

