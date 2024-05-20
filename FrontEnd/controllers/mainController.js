const express = require('express');
const router = express.Router();
const app = express();



router.get("/home/v1/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('dashboard');
});

router.get("/register/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("register");
});

router.get("/login/v1/", (req, res) => {
  res.render("login");
});

router.get("/settings/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("settings");
});

router.get("/rules/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("rules");
});

router.get("/add/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("add");
});

router.get("/transactionhistory/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("transactionHistory");
});

router.get("/transaction/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("transaction");
});

router.get("/reports/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("reports");
});

router.get("/help/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("help");
});

router.get("/notifications/v1/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('notifications');
});

module.exports = router;
