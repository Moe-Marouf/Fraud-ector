const express = require('express');
const router = express.Router();
const User = require('../models/User');
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
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid password' });
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

router.post('/verify-otp', async (req, res) => {
  const { otp } = req.body;

  try {
    if (!req.session.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.session.user.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP' });
    }

    const user = await User.findOne({ _id: req.session.user._id });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.otp = null;
    await user.save();

    res.render("chart");
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
router.get('/add/v1', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); 
  }

  res.render('add'); 
});
router.get('/chart/v1', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); 
  }

  res.render('chart'); 
});
router.get('/dashboard/v1', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); 
  }

  res.render('dashboard'); 
});

router.get('/Help/v1', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); 
  }

  res.render('Help');  
});
router.get('/notifications/v1', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); 
  }

  res.render('notifications');  
});router.get('/rules/v1', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); 
  }

  res.render('rules');  
});router.get('/transaction/v1', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); 
  }

  res.render('transaction');  
});router.get('/transactionHistory/v1', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/'); 
  }

  res.render('transactionHistory');  
});


module.exports = router;