const express = require('express');
const router = express.Router();

router.get("/home/v1/", async (req, res) => {
  res.render('dashboard');
});

router.get("/Register/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("Register");
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
  res.render("add");
});

router.get("/transactionhistory/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("transactionhistory");
});

router.get("/transaction/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("transaction");
});

router.get("/charts/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("chart");
});

router.get("/Help/v1/", (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render("Help");
});

router.get("/notifications/v1/", async (req, res) => {
  if (!req.session.user) {
    return res.redirect('/');
  }
  res.render('notifications');
});

module.exports = router;
