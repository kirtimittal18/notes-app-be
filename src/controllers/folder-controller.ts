// controllers/foldersController.ts

import { NextFunction, Request, Response } from 'express';
import * as folderService from '../services/folder-service';
import { Folder } from '../models/folder-model';

// Get Folder Tree for a User
export const getFolderStructure = async (req: Request, res: Response, next: NextFunction): Promise<Folder[] | void> => {
  try {
    //const userId = req.userId!;   // Assuming folders are user-specific
    const folderTree = await folderService.getFolderStructure();

    if (!folderTree || !folderTree.length) {
       return [];
    }

    return folderTree;
  } catch (error) {
    next(error);
  }
};

// Create New Folder
export const createFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { parentFolderId, folderName } = req.body;
    // const userId = req.userId!;
    if (!folderName) {
      throw { statusCode: 400, message: 'Folder name is required' };
    }

    const newFolder = await folderService.createFolder(parentFolderId, folderName);
    res.status(201).json(newFolder);
  } catch (error) {
    next(error);
  }
};

// Move Folder to Another Folder
export const moveFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const folderId = req.params.folderId;
    const { targetFolderId } = req.body;

    if (!targetFolderId) {
      throw { statusCode: 400, message: 'targetFolderId is required' };
    }

    const movedFolder = await folderService.moveFolder(folderId, targetFolderId);

    if (!movedFolder) {
      throw { statusCode: 404, message: 'Folder not found' };
    }

    res.status(200).json(movedFolder);
  } catch (error) {
    next(error);
  }
};

//Rename Folder
export const renameFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const folderId = req.params.folderId;
      const { name } = req.body;
  
      if (!name) {
        res.status(400).json({ message: 'New folder name is required' });
        return;
      }
  
      const updatedFolder = await folderService.renameFolder(folderId, name);
      if (!updatedFolder) {
        res.status(404).json({ message: 'Folder not found' });
        return;
      }
      res.status(200).json(updatedFolder);
    } catch (error) {
      next(error);
    }
  };

// Delete Folder
export const deleteFolder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const folderId = req.params.folderId;

    const success = await folderService.deleteFolder(folderId);

    if (!success) {
      res.status(404).json({ message: 'Folder not found' });
      return;
    }

    res.status(200).json({ message: 'Folder deleted successfully' });
  } catch (error) {
    next(error);
  }
};
