const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

// Konfigurasi Passport Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.API_URL}/api/auth/google/callback`,
      scope: ['profile', 'email']
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Cek apakah user sudah ada di database
        let user = await User.findOne({ email: profile.emails[0].value });
        
        if (!user) {
          // Jika user belum ada, buat user baru
          user = await User.create({
            username: profile.displayName.replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
            email: profile.emails[0].value,
            password: Math.random().toString(36).slice(-12) + Math.random().toString(36).slice(-12),
            profile: {
              firstName: profile.name.givenName || '',
              lastName: profile.name.familyName || '',
              avatar: profile.photos[0].value
            },
            googleId: profile.id,
            isActive: true
          });
          
          logger.info(`User registered via Google: ${user._id}`);
        } else if (!user.googleId) {
          // Jika user sudah ada tapi belum link dengan Google
          user.googleId = profile.id;
          if (!user.profile.avatar && profile.photos && profile.photos.length > 0) {
            user.profile.avatar = profile.photos[0].value;
          }
          await user.save();
          
          logger.info(`User linked Google account: ${user._id}`);
        }
        
        return done(null, user);
      } catch (error) {
        logger.error(`Google auth error: ${error.message}`);
        return done(error, null);
      }
    }
  )
);

// Serialize dan deserialize user untuk session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

/**
 * @desc    Register user
 * @route   POST /api/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res) => {
  const { username, email, password, firstName, lastName } = req.body;
  
  // Cek apakah email sudah digunakan
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Email sudah terdaftar'
      }
    });
  }
  
  // Buat user baru
  const user = await User.create({
    username,
    email,
    password,
    profile: {
      firstName: firstName || '',
      lastName: lastName || ''
    }
  });
  
  // Generate token
  const token = user.getSignedJwtToken();
  
  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  logger.info(`User registered: ${user._id}`);
  
  // Return response
  sendTokenResponse(user, token, refreshToken, 201, res);
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  
  // Validasi email & password
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Email dan password harus diisi'
      }
    });
  }
  
  // Cek user
  const user = await User.findOne({ email }).select('+password');
  
  if (!user) {
    logger.warn(`Login attempt with non-existent email: ${email}`);
    return res.status(401).json({
      success: false,
      error: {
        message: 'Email belum terdaftar. Silakan daftar terlebih dahulu.',
        code: 'EMAIL_NOT_FOUND'
      }
    });
  }
  
  // Cek password
  const isMatch = await user.matchPassword(password);
  
  if (!isMatch) {
    logger.warn(`Failed login attempt for user: ${user._id}`);
    return res.status(401).json({
      success: false,
      error: {
        message: 'Password yang Anda masukkan salah',
        code: 'INVALID_PASSWORD'
      }
    });
  }
  
  // Generate token
  const token = user.getSignedJwtToken();
  
  // Generate refresh token
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: '30d' }
  );
  
  logger.info(`User logged in: ${user._id}`);
  
  // Return response
  sendTokenResponse(user, token, refreshToken, 200, res);
});

/**
 * @desc    Inisiasi autentikasi dengan Google
 * @route   GET /api/auth/google
 * @access  Public
 */
exports.googleAuth = (req, res, next) => {
  // Selalu gunakan redirect, tidak perlu state untuk popup
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })(req, res, next);
};

/**
 * @desc    Callback untuk autentikasi Google
 * @route   GET /api/auth/google/callback
 * @access  Public
 */
exports.googleCallback = [
  passport.authenticate('google', { session: false, failureRedirect: '/login?error=google_auth_failed' }),
  asyncHandler(async (req, res) => {
    try {
      // Log untuk debugging
      console.log('Google callback params:', req.query);
      
      const user = req.user;
      
      // Generate token
      const token = user.getSignedJwtToken();
      
      // Generate refresh token
      const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
      );
      
      logger.info(`User logged in via Google: ${user._id}`);
      
      // Redirect ke frontend dengan token
      const redirectUrl = `${process.env.CLIENT_URL}/auth/callback?token=${token}&refreshToken=${refreshToken}&userId=${user._id}`;
      res.redirect(redirectUrl);
    } catch (error) {
      logger.error(`Google callback error: ${error.message}`);
      res.redirect(`${process.env.CLIENT_URL}/login?error=google_auth_error`);
    }
  })
];

/**
 * @desc    Logout user / clear cookie
 * @route   POST /api/auth/logout
 * @access  Private
 */
exports.logout = asyncHandler(async (req, res) => {
  if (req.user) {
    logger.info(`User logged out: ${req.user._id}`);
  }
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Get current logged in user
 * @route   GET /api/auth/me
 * @access  Private
 */
exports.getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.id);
  
  res.status(200).json({
    success: true,
    data: {
      user
    }
  });
});

/**
 * @desc    Refresh token
 * @route   POST /api/auth/refresh
 * @access  Public
 */
exports.refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  
  if (!refreshToken) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Refresh token harus diisi'
      }
    });
  }
  
  try {
    // Verifikasi refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Cari user berdasarkan ID dari token
    const user = await User.findById(decoded.id);
    
    if (!user) {
      logger.warn(`Refresh token attempt for non-existent user`);
      return res.status(401).json({
        success: false,
        error: {
          message: 'Refresh token tidak valid'
        }
      });
    }
    
    // Generate token baru
    const token = user.getSignedJwtToken();
    
    logger.info(`Token refreshed for user: ${user._id}`);
    
    res.status(200).json({
      success: true,
      data: {
        token
      }
    });
  } catch (error) {
    logger.error(`Refresh token error: ${error.message}`);
    
    return res.status(401).json({
      success: false,
      error: {
        message: 'Refresh token tidak valid atau kadaluarsa'
      }
    });
  }
});

/**
 * Helper function untuk mengirim token response
 */
const sendTokenResponse = (user, token, refreshToken, statusCode, res) => {
  // Hapus password dari output
  user.password = undefined;
  
  res.status(statusCode).json({
    success: true,
    data: {
      user,
      token,
      refreshToken
    }
  });
}; 