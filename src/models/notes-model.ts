import fs from 'fs';
import path from 'path';

export interface Note {
    id: string;
    folderId: string;
    userId?: number;
    content: string;
    createdAt?: string;
    updatedAt?: string;
    size?: number;
    isDeleted: boolean;
  }
  
const noteFilePath = path.join(__dirname, '../data/notes.json');


// Read notes from JSON file
export const readNote = (): Note[] => {
  const data = fs.readFileSync(noteFilePath, 'utf-8');
  return JSON.parse(data);
};

// Write notes to JSON file
export const writeNotes = (notes: Note[]): void => {
  fs.writeFileSync(noteFilePath, JSON.stringify(notes, null, 2), 'utf-8');
};