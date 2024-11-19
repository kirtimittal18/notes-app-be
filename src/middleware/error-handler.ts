// middlewares/errorHandler.ts

import { Request, Response, NextFunction } from 'express';

// Define an interface for the error type
interface CustomError {
  statusCode?: number;
  message: string;
}

// Custom error handling middleware
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  // Log the error for debugging
  console.error(err);
  if (err.message === 'Access denied. No token provided.') {
      res.status(401).json({ message: 'Access denied. No token provided.' });
  } else if (err.message === 'Invalid token. User ID not found.') {
      res.status(400).json({ message: 'Invalid token. User ID not found.' });
  } else if(err.statusCode == 404){
    res.status(404).json({ message: err.message });
  }else {
    // Generic error handler for other cases
      res.status(500).json({ message: 'Internal Server Error', error: err.message || err });
  }
};

export default errorHandler;
