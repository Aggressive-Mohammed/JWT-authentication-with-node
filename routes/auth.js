// Import required modules
const router = require("express").Router(); // Importing Express Router
const { check, validationResult } = require("express-validator"); // Importing validation middleware
const bcrypt = require("bcrypt");
const { users } = require("../db"); // Importing users data
const jwt = require('jsonwebtoken');

// POST endpoint for user signup
router.post(
  "/signup",
  [
    // Validation middleware for email and password fields
    check("email")
      .isEmail()
      .withMessage("Please provide a valid email address."),
    check("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long."),
  ],
  async (req, res) => {
    const { email, password } = req.body;
    const result = validationResult(req);

    if (!result.isEmpty()) {
      return res.status(400).json({ errors: result.array() }); // Respond with validation errors if any
    }

    let user = users.find((user) => {
      return user.email === email;
    });

    if (user) {
      return res.status(400).json({ message: "User already exists" }); // Respond with error if user already exists
    }

    try {
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt); // Hashing password

      users.push({ email, password: hashedPassword }); // Adding user to the database

      const token = jwt.sign({
        email: email // Create JWT token with user's email
      }, 'secrete'); // Using 'secret' as the secret key to sign the token

      res.json({ token }); // Respond with token upon successful signup
      console.log(email, hashedPassword); // Log email and hashed password for debugging
    } catch (error) {
      console.error("Error occurred during signup:", error); // Log error if any during signup process
      res.status(500).json({ message: "Internal server error" }); // Respond with internal server error if signup fails
    }
  }
);

// POST endpoint for user login
router.post('/login', async (req, res)=>{
  const { email, password } = req.body; // Extract email and password from request body

  let user = users.find((user) => {
    return user.email === email;
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid Credentials" }); // Respond with error if user not found
  }

  const isMatch = await bcrypt.compare(password, user.password); // Compare password with hashed password from database

  if (!isMatch) {
    return res.status(400).json({ message: "Invalid Credentials" }); // Respond with error if password doesn't match
  }

  const token = jwt.sign({
    email: email // Create JWT token with user's email
  }, 'secrete'); // Using 'secret' as the secret key to sign the token

  res.json({ token }); // Respond with token upon successful login
});

// GET endpoint to retrieve all users
router.get('/all', (req, res) =>{
  res.json(users); // Respond with all users in the database
});

module.exports = router; // Export router for use in other files
