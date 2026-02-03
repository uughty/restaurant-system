// backend/middleware/authMiddleware.js
export const protect = (req, res, next) => {
  // For now, just allow everything
  next();
};
