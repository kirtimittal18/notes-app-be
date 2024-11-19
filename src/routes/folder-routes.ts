// routes/folderRoutes.ts

import express, { Request, Response, NextFunction } from 'express';
import {
  getFolderStructure,
  createFolder,
  moveFolder,
  deleteFolder,
  renameFolder
} from '../controllers/folder-controller';

const router = express.Router();

// Get Folder Tree Structure
router.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const folderStructure = await getFolderStructure(req, res, next);
    res.status(200).json(folderStructure);
  } catch (error) {
    next(error);
  }
});


// Create a New Folder
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newFolder =  await createFolder(req, res, next);
    res.status(201).json(newFolder);
  } catch (error) {
    next(error);
  }
});

// Move a Folder to a Different Folder
router.put('/:folderId/move', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await moveFolder(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Rename a Folder
router.put('/:folderId/rename', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await renameFolder(req, res, next);
  } catch (error) {
    next(error);
  }
});

// Delete a Folder
router.delete('/:folderId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    await deleteFolder(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router;
