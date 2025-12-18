const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createAccessToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '15m' });
const createRefreshToken = (user) => jwt.sign({ id: user._id }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRY || '7d' });

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);
    user.refreshToken = refreshToken;
    await user.save();
    res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email } });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: 'Invalid credentials' });
  const ok = await user.comparePassword(password);
  if (!ok) return res.status(400).json({ message: 'Invalid credentials' });
  const accessToken = createAccessToken(user);
  const refreshToken = createRefreshToken(user);
  user.refreshToken = refreshToken;
  await user.save();
  res.json({ accessToken, refreshToken, user: { id: user._id, email: user.email } });
});

// Refresh token
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No refresh token' });
  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(payload.id);
    if (!user || user.refreshToken !== refreshToken) return res.status(403).json({ message: 'Invalid refresh' });
    const accessToken = createAccessToken(user);
    res.json({ accessToken });
  } catch (err) {
    res.status(403).json({ message: 'Invalid refresh token' });
  }
});

// Logout (invalidate refresh token)
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body;
  if (refreshToken) {
    await User.updateOne({ refreshToken }, { $unset: { refreshToken: 1 } });
  }
  res.json({ ok: true });
});

module.exports = router;
