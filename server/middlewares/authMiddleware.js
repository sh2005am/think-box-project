import jwt from 'jsonwebtoken';

const authMiddleware = async (req, res, next) => {
  try {
    // Get the token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to the request

    next(); // Pass control to the next middleware/route handler
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

export default authMiddleware;