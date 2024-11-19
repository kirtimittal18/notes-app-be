import { NextFunction, Request, Response } from "express";
import * as noteService from "../services/notes-service";
import { Note } from "../models/notes-model";
import { getFolderByID } from "../services/folder-service";

// Get Notes in Folder
export const getAllNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Note[] | void> => {
  try {
    const folderId = req.params.folderId;
    const notes = await noteService.getAllNotes(folderId);

    if (notes.length === 0) {
      return []
    } else {
      return notes;
    }
  } catch (error) {
    next(error);
  }
};


//get Note by id

export const getNoteByID = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Note[] | void> => {
  try {
    const noteId = req.params.noteId;
    const notes = await noteService.getNoteById(noteId);

    if (notes.length === 0) {
      return [];
    } else {
      return notes;
    }
  } catch (error) {
    next(error);
  }
};

// Create Note
export const createNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Note | void> => {
  try {
    const { folderId, content } = req.body;
    //const userId = req.userId!;
    if (!folderId || !content) {
      res.status(400).json({ message: "folderId and content are required" });
      throw new Error("Invalid input");
    }
    const folderExists = await getFolderByID(folderId);
    if (!folderExists) {
      throw new Error("Folder not found");
    }
    const newNote = await noteService.createNote(folderId, content);
    res.status(201).json(newNote);
  } catch (error) {
    next(error);
  }
};

// Update Note
export const updateNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Note | null> => {
  try {
    const noteId = req.params.noteId;
    const { content } = req.body;

    if (!content) {
      res.status(400).json({ message: "Content is required to update a note" });
      return null;
    }

    const updatedNote = await noteService.updateNote(noteId, content);
    if (!updatedNote) {
      res.status(404).json({ message: "Note not found" });
      return null;
    }

    res.status(200).json(updatedNote);
    return updatedNote;
  } catch (error) {
    next(error);
    return null;
  }
};

// Soft Delete Note (Move to Recycle Bin)
export const deleteNote = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<boolean | void> => {
  try {
    const noteId = req.params.noteId;

    const success = await noteService.deleteNote(noteId);
    if (!success) {
      res.status(404).json({ message: "Note not found" });
      return false;
    }

    res.status(200).json({ message: "Note moved to recycle bin" });
  } catch (error) {
    next(error);
    return false;
  }
};

// Move Note to Different Folder
export const moveNoteToFolder = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Note | void> => {
  try {
    const noteId = req.params.noteId;
    const { targetFolderId } = req.body;

    if (!targetFolderId) {
      res.status(400).json({ message: "targetFolderId is required" });
    }
    const folderExists = await getFolderByID(targetFolderId);
    if (!folderExists) {
      throw new Error("Folder not found");
    }
    const movedNote = await noteService.moveNoteToFolder(
      noteId,
      targetFolderId
    );
    if (!movedNote) {
      res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(movedNote);
  } catch (error) {
    next(error);
  }
};

// Get Deleted Notes (Recycle Bin)
export const getDeletedNotes = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Note[]| void> => {
  try {
    const deletedNotes = await noteService.getDeletedNotes();
    if (deletedNotes.length === 0) {
      res.status(404).json({ message: "No notes found in recycle bin" });
      return [];
    }

    res.status(200).json(deletedNotes);
  } catch (error) {
    next(error);
  }
};

// Restore Note from Recycle Bin
export const restoreNoteFromRecycleBin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Note | null> => {
  try {
    const noteId = req.params.noteId;

    const restoredNote = await noteService.restoreNoteFromRecycleBin(noteId);
    if (!restoredNote) {
      res.status(404).json({ message: "Note not found in recycle bin" });
      return null;
    }

    res.status(200).json(restoredNote);
    return restoredNote;
  } catch (error) {
    next(error);
    return null;
  }
};
