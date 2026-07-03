/**
 * Authentication Middleware (Example)
 * TODO: Implement JWT verification logic
 */

const protect = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized, no token provided'
      });
    }

    // TODO: Verify JWT token
    // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized, token invalid'
    });
  }
};

/**
 * Role-based authorization middleware
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    next();
  };
};

module.exports = { protect, authorize };
