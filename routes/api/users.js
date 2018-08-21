const express = require('express');

const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Load User Model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users works' }));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
  User.findOne({ email: req.body.email })
    .then((user) => {
      if (user) {
        return res.status(400).json({ email: 'Email already exists' });
      }
      // a default gravatar profile
      const avatar = gravatar.url(req.body.email, {
        s: '200', // size
        r: 'pg', // rating
        d: 'mm', // default
      });
      // create new user
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar,
        password: req.body.password,
      });
      // encrypt password
      bcrypt.genSalt(10, (e, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then(savedUser => res.json(savedUser))
            .catch(error => console.log(error));
        });
      });
    });
});

// @route   GET api/users/login
// @desc    Login user / Returning JWT Token
// @access  Public
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  User.findOne({ email })
    .then((user) => {
      // Check for user
      if (!user) {
        return res.status(404).json({ email: 'User not found.' });
      }

      // Check Password
      bcrypt.compare(password, user.password)
        .then((isMatch) => {
          if (!isMatch) {
            return res.status(400).json({ password: 'Password incorrect' });
          }
          // User Matched

          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar,
          };
          // Sign Token
          jwt.sign();
        });
    });
});

module.exports = router;
