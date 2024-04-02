const JWT = require("jsonwebtoken")
module.exports = async (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(400).json({ message: "No token found!" });
  }

  try {
    // Verify the JWT token
    let user = JWT.verify(token, 'secrete'); // Replace 'your-secret' with your actual secret key
    req.user = user.email; // Attach the user object to the request for future use
    next(); // Proceed to the next middleware
  } catch(err) {
    return res.status(401).json({ message: "Unauthorized" }); // Return Unauthorized if verification fails
  }
 
};
