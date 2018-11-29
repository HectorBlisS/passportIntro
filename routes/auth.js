const router = require("express").Router();
const User = require("../models/User");
const passport = require("passport");
const { welcomeMail } = require("../helpers/mailer");
const uploader = require('multer')({
  dest: './public/pics'
})

function checkIfIsHere(req, res, next) {
  console.log("polloyon?", req.isAuthenticated());
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/auth/login");
}

router.post('/profile', checkIfIsHere, uploader.single('photoURL'),(req,res)=>{
  let link
  if(req.file) link = "/pics/" + req.file.filename
  User.findByIdAndUpdate(req.user._id, {photoURL:link}, {new:true})
  .then(user=>{
    res.redirect('/auth/profile')
  })
})

router.get('/profile', checkIfIsHere, (req,res)=>{
  User.findById(req.user._id)
  .then(user=>{
    res.render('auth/profile', user)
  })
})

router.get('/users/:id', (req,res)=>{
  User.findById(req.params.id)
  .then(user=>{
    res.render('auth/profile', user)
  })
})

router.get(
  "/callback/facebook",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  (req, res) => {
    res.json(req.user);
  }
);

router.post("/facebook", passport.authenticate("facebook"), (req, res) => {});

router.get("/logout", (req, res) => {
  req.logOut();
  res.redirect("/auth/login");
});

router.get("/private", checkIfIsHere, (req, res) => {
  res.send("esto es privao");
});

router.post("/login", passport.authenticate("local"), (req, res, next) => {
  const email = req.user.email;
  req.app.locals.user = req.user;
  res.send("Tu eres un usuario real con email: " + email);
});

router.get("/login", (req, res, next) => {
  res.render("auth/login");
});

router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", (req, res, next) => {
  User.register(req.body, req.body.password)
    .then(user => {
      welcomeMail(user.email, user.username);
      res.json(user);
    })
    .catch(e => next(e));
});

module.exports = router;
