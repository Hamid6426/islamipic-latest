const jwt = require("jsonwebtoken");

const authMiddleware = (requiredRoles) => {
  return (req, res, next) => {
    const token = req.cookies.userToken || req.cookies.adminToken;

    if (!token) {
      return res.json({ message: "You are not Authorized. Please Login" });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      req.user = decoded; // Attach user/admin data to request

      if (requiredRoles && !requiredRoles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied" });
      }

      next();
    });
  };
};

module.exports = authMiddleware;
