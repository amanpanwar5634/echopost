const express = require("express");
const wrapAsync = require("../utils/wrapAsync");
const router = express.Router();
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
//signup
router.get("/signup", (req, res) => {
  res.render("./users/signup.ejs");
})
router.post("/signup", wrapAsync(async (req, res) => {
  try {
    let { username, email, password } = req.body;
    const newUser = new User({ email, username });
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.flash("success", "welcome to EchoPost");
    res.redirect("/posts");
  }
  catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
}))
//login
router.get("/login", (req, res) => {
  res.render("./users/login.ejs")
})

router.post("/login", saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
  async (req, res) => {
    req.flash("success", "You logged in!!");
    let redirectUrl = res.locals.redirectUrl || "/posts";
    res.redirect(redirectUrl);
  })
//logout 
router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    req.flash("success", "You successfully logout");
    res.redirect("/posts");
  });
})
module.exports = router;