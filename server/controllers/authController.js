const User = require('../models/User');
const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const admin = require('firebase-admin');

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    })
  });
}

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
// const register = asyncHandler(async (req, res) => {
//   const { name, email, password, role, firebaseUid, photoURL } = req.body;
//   console.log(req.body);

//   // Check if user exists
//   const userExists = await User.findOne({ email });
//   if (userExists) {
//     res.status(400);
//     throw new Error('User already exists');
//   }
//   let hashedPassword=""
//   if(password){
//     hashedPassword = await bcrypt.hashSync(password, 10);
//     console.log(hashedPassword);
//   }
//   const pass=hashedPassword || "";
//   console.log(hashedPassword);
//   // Hash password if provided

//   // Create user
//   const user = await User.create({
//     name,
//     email,
//     password: pass,
//     role: role || 'user',
//     isAdmin: role === 'admin',
//     firebaseUid,
//     profilePicture: photoURL
//   });
//   console.log(user);

//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       role: user.role,
//       photoURL: user.profilePicture,
//       token: generateToken(user._id),
//     });
//   } else {
//     res.status(400);
//     throw new Error('Invalid user data');
//   }
// });

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email,role } = req.body;
  // console.log(email);
  // Find user
  const user = await User.findOne({ email: email,role: role });
  // console.log(user);
  if(user){
    res.status(200).json({...user._doc, token: generateToken(user._id)})
  } else {
    res.status(401);
    throw new Error('Email not registered');
  }
});

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = asyncHandler(async (req, res) => {
  // console.log(req.user);
  const user = await User.findById(req.user._id).select('-password');
  if (user) {
    res.status(200).json({...user, token: generateToken(user._id)});
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {

    
    // Only allow role update if user is admin
    if (req.body.role && user.isAdmin) {
      user.role = req.body.role;
      user.isAdmin = req.body.role === 'admin';
    }

    const updatedUser = await User.findByIdAndUpdate(req.user._id, req.body, {new: true});
    res.status(200).json(updatedUser._doc);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Authenticate with Google
// @route   POST /api/auth/google
// @access  Public
const googleAuth = asyncHandler(async (req, res) => {
  const { idToken } = req.body;

  try {
    // Verify the ID token
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    const { email, name, picture, uid } = decodedToken;

    // Check if user exists
    let user = await User.findOne({ email });

    if (!user) {
      // Create new user if doesn't exist
      user = await User.create({
        name,
        email,
        password: '', // No password needed for Google auth
        role: 'user',
        isAdmin: false,
        profilePicture: picture,
        firebaseUid: uid
      });
    } else {
      // Update existing user's Firebase UID and profile picture if needed
      user.firebaseUid = uid;
      user.profilePicture = picture;
      await user.save();
    }

    // Generate JWT token
    const token = generateToken(user._id);

    res.json({
      _id: user._id,
      id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      role: user.role,
      photoURL: user.profilePicture,
      firebaseUid: user.firebaseUid,
      token
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401);
    throw new Error('Invalid Google token');
  }
});

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

module.exports = {
  // register,
  login,
  getProfile,
  updateProfile,
  googleAuth
}; 