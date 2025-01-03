const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const accessToken = authHeader && authHeader.split(" ")[1];
  const refreshToken = req.headers["x-refresh-token"];

  if (!accessToken) {
    return res.status(401).json({ message: "Access token required" });
  }

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (!err) {
      req.user = user;
      return next();
    }

    if (err.name === "TokenExpiredError") {
      // Access token has expired, try to use the refresh token
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token required" });
      }

      // Verify the refresh token
      jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, user) => {
          if (err) {
            return res.status(403).json({ message: "Invalid refresh token" });
          }

          // Generate a new access token using the refresh token
          const newAccessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "15m" }
          );
          res.setHeader("x-access-token", newAccessToken);

          req.user = user;
          return next();
        }
      );
    } else {
      return res.status(403).json({ message: "Invalid access token" });
    }
  });
};

module.exports = authenticate;
