// const jwt = require("jsonwebtoken");

// const refreshTokenMiddleware = async (req, res, next) => {
//   const token = req.headers["authorization"];
//   const refreshToken = req.headers["x-refresh-token"];
// console.log(first)
//   if (!token) {
//     return res.status(401).json({ message: "Access token is required" });
//   }

//   // Verify access token
//   jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, user) => {
//     if (!err) {
//       req.user = user;
//       return next();
//     }

//     if (err.name !== "TokenExpiredError") {
//       return res.status(403).json({ message: "Invalid access token" });
//     }

//     // Handle expired access token
//     if (!refreshToken) {
//       return res.status(401).json({ message: "Refresh token is required" });
//     }

//     // Verify refresh token
//     jwt.verify(
//       refreshToken,
//       process.env.REFRESH_TOKEN_SECRET,
//       async (err, user) => {
//         if (err) {
//           return res
//             .status(403)
//             .json({ message: "Invalid or expired refresh token" });
//         }

//         // Issue new access token
//         const newAccessToken = jwt.sign(
//           { id: user.id },
//           process.env.ACCESS_TOKEN_SECRET,
//           { expiresIn: "15m" }
//         );
//         res.setHeader("x-access-token", newAccessToken);
//         req.user = user;
//         next();
//       }
//     );
//   });
// };

// module.exports = refreshTokenMiddleware;
