// routes/noteRoutes.ts

import express, { Request, Response, NextFunction } from 'express';
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  moveNoteToFolder,
  getDeletedNotes,
  restoreNoteFromRecycleBin,
  getNoteByID
} from '../controllers/notes-controller';

const router = express.Router();

/**
 * Define routes
 */


// get all notes within a folder
router.get('/folder/:folderId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const notes = await getAllNotes(req, res, next);
    res.status(200).json(notes); // Return notes
  } catch (error) {
    next(error); // Pass error to error handling middleware
  }
});

// router.get('/getNote/:noteId', async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const notes = await getNoteByID(req, res, next);
//     res.status(200).json(notes); // Return notes
//   } catch (error) {
//     next(error); // Pass error to error handling middleware
//   }
// });

// create a note
router.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newNote = await createNote(req, res, next);
    if (newNote) {
      res.status(201).json(newNote);
    }
  } catch (error) {
    next(error);
  }
});

// update a note
router.put('/:noteId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedNote = await updateNote(req, res, next);
    if (updatedNote) {
      res.status(200).json(updatedNote);
    }
  } catch (error) {
    next(error);
  }
});

// move note to a different folder
router.put('/:noteId/move', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const updatedNote = await moveNoteToFolder(req, res, next);
      if (updatedNote) {
        res.status(200).json(updatedNote);
      }
    } catch (error) {
      next(error);
    }
  });

// delete a note
router.delete('/:noteId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const success = await deleteNote(req, res, next);
    if (success) {
      res.status(200).json({ message: 'Note deleted successfully' });
    }
  } catch (error) {
    next(error);
  }
});

// get deleted notes
router.get('/recycled', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedNotes = await getDeletedNotes(req, res, next);
        res.status(200).json(deletedNotes); // Return notes
      } catch (error) {
        next(error); // Pass error to error handling middleware
      }
});

// restore a deleted note
router.put('/:noteId/restore', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deletedNotes = await restoreNoteFromRecycleBin(req, res, next);
        res.status(200).json(deletedNotes); // Return notes
      } catch (error) {
        next(error); // Pass error to error handling middleware
      }
});


export default router;
