import express, { Request, Response, NextFunction } from 'express';
import folderRoutes from './routes/folder-routes';
import notesRoutes from './routes/notes-routes';
import dotenv from 'dotenv';
import authMiddleware from './middleware/auth-middleware';  // Import the authentication middleware
import errorHandler from './middleware/error-handler';  // Import the global error handler

const app = express();

dotenv.config();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//app.use(authMiddleware);
// Protected routes (apply authMiddleware)
app.use('/api/folders', folderRoutes);  // Apply middleware to protect folder routes
app.use('/api/notes', notesRoutes);  // Apply middleware to protect notes routes

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Welcome to the Notes API!' });
});

// Global error handler (should be added after all routes)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
