// middlewares/adminMiddleware.js
module.exports = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Requires admin role.' });
    }
    next();
  };