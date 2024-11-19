import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  userId?: number;
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return next(new Error('Access denied. No token provided.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string) as { userId: number };

    if (!decoded.userId) {
      throw new Error('Invalid token. User ID not found.');
    }

    req.userId = decoded.userId;  // Attach userId to the request object
    next();
  } catch (error) {
    next(error);  // Pass the error to the global error handler
  }
};

export default authMiddleware;
