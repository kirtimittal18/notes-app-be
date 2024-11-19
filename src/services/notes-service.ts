import { readNote, writeNotes, Note } from '../models/notes-model';
const uuid = require('uuid')

// Fetch all notes in a folder
export const getAllNotes = async (folderId: string): Promise<Note[]> => {
  const notes = await readNote();
  return notes.filter(note => note.folderId === folderId && !note.isDeleted);
};

export const getNoteById = async (noteId: string): Promise<Note[]> => {
  const notes = await readNote();
  return notes.filter(note => note.id === noteId);
};

// Create a new note
export const createNote = async(folderId: string, content: string, userId: number=1): Promise<Note> => {
  const notes = await readNote();
 
  const newNote: Note = {
    id: uuid.v4(),
    folderId,
    userId, // Simulated user ID
    content,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    size: content.length,
    isDeleted: false
  };

  notes.push(newNote);
  writeNotes(notes);
  return newNote;
};

// Update an existing note
export const updateNote = async (noteId: string, content: string): Promise<Note | null> => {
  const notes = await readNote();

  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex === -1) return null;

  notes[noteIndex].content = content;
  notes[noteIndex].updatedAt = new Date().toISOString();

  writeNotes(notes);
  return notes[noteIndex];
};

// Soft delete a note (move to recycle bin)
export const deleteNote = async (noteId: string): Promise<boolean> => {
  const notes = await readNote();

  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex === -1) return false;

  notes[noteIndex].isDeleted = true;
  notes[noteIndex].updatedAt = new Date().toISOString();

  writeNotes(notes);
  return true;
};

// Move a note to a different folder
export const moveNoteToFolder = async (noteId: string, targetFolderId: string): Promise<Note | null> => {
  const notes = await readNote();

  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex === -1) return null;

  notes[noteIndex].folderId = targetFolderId;
  notes[noteIndex].updatedAt = new Date().toISOString();

  writeNotes(notes);
  return notes[noteIndex];
};

// Get all deleted notes (recycle bin)
export const getDeletedNotes = async (): Promise<Note[]> => {
  const notes = await readNote();
  return notes.filter(note => note.isDeleted);
};

// Restore a note from the recycle bin
export const restoreNoteFromRecycleBin = async (noteId: string): Promise<Note | null> => {
  const notes = await readNote();

  const noteIndex = notes.findIndex(note => note.id === noteId);
  if (noteIndex === -1) return null;

  notes[noteIndex].isDeleted = false;
  notes[noteIndex].updatedAt = new Date().toISOString();

  writeNotes(notes);
  return notes[noteIndex];
};
