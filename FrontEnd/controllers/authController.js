const express = require('express');
const router = express.Router();
const User = require('../models/user');
const otpGenerator = require('otp-generator');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

function generateOTP() {
  return otpGenerator.generate(6, { upperCase: false, specialChars: false });
}



router.get('/', (req, res) => {
  res.render('login');
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.render('tryagain');
    }

    if (user.password !== password) {
      return res.render('tryagain');
    }

    const otp = generateOTP();
    user.otp = otp;
    await user.save();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP Verification',
      text: `Your OTP is: ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email', error);
        return res.status(500).json({ message: 'Failed to send OTP' });
      }
      console.log('Email sent:', info.response);
    });

    req.session.user = user;

    res.render('otp', { otp });
  } catch (error) {
    console.error('Error during login', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// User registration route
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }


    const newUser = new User({
      name,
      email,
      password
    });

    // Save the new user to the database
    await newUser.save();

    res.redirect("/home/v1/");
  } catch (error) {
    console.error('Error during user registration', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;

  try {
    if (!req.session.user) {
      return res.render('tryagain');
    }

    if (req.session.user.otp !== otp) {
      return res.render('tryagain');
    }

    const user = await User.findOne({ _id: req.session.user._id });

    if (!user) {
      return res.render('tryagain');
    }

    user.otp = null;
    await user.save();

    res.redirect("/home/v1/");
  } catch (error) {
    console.error('Error during OTP verification', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error during session destruction', err);
      return res.status(500).json({ message: 'Internal server error' });
    }

    res.redirect('/');
  });
});


module.exports = router;