const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers["authorization"] || req.headers["Authorization"];

  if (!token) {
    return res.status(400).json({ error: "No token provided" });
  }
  if (!token.startsWith("Bearer")) {
    return res.status(400).json({ error: "Invalid token format" });
  }
  const accessToken = token.split(" ")[1];

  jwt.verify(accessToken, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired token" });
    }

    req.user = user;
    next();
  });
};

module.exports = authenticate;
