import { readNote, writeNotes, Note } from '../../models/notes-model';
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  moveNoteToFolder,
  getDeletedNotes,
  restoreNoteFromRecycleBin,
} from '../../services/notes-service';

// Mock the module to simulate reading and writing notes
jest.mock('../../models/notes-model', () => ({
  readNote: jest.fn(),
  writeNotes: jest.fn(),
}));

describe('Notes Service', () => {
  let mockNotes: Note[];

  beforeEach(() => {
    // Reset the mock data before each test
    mockNotes = [
      { id: '1', folderId: '1', userId: 1, content: 'Note 1', createdAt: '', updatedAt: '', size: 6, isDeleted: false },
      { id: '2', folderId: '1', userId: 1, content: 'Note 2', createdAt: '', updatedAt: '', size: 6, isDeleted: false },
      { id: '3', folderId: '2', userId: 2, content: 'Note 3', createdAt: '', updatedAt: '', size: 6, isDeleted: true },
    ];

    (readNote as jest.Mock).mockResolvedValue(mockNotes);
    (writeNotes as jest.Mock).mockClear();
  });

  describe('getAllNotes', () => {
    it('should return all notes in a folder that are not deleted', async () => {
      const result = await getAllNotes("1");

      expect(readNote).toHaveBeenCalled();
      expect(result).toEqual([
        expect.objectContaining({ id: "1" }),
        expect.objectContaining({ id: "2" }),
      ]);
    });

    it('should return an empty array if no notes are found in the folder', async () => {
      const result = await getAllNotes("999");
      expect(readNote).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('createNote', () => {
    it('should create a new note in the specified folder', async () => {
      const newNoteContent = 'New Note Content';
      const expectedNewNote = {
        id: mockNotes.length + 1,
        folderId: "1",
        userId: 1,
        content: newNoteContent,
        createdAt: expect.any(String),  
        updatedAt: expect.any(String),
        size: newNoteContent.length,
        isDeleted: false,
      };
      const result = await createNote("1", newNoteContent, 1);

      expect(readNote).toHaveBeenCalled();
      expect(result).toEqual(expect.objectContaining({ content: newNoteContent }));
    });
  });

  describe('updateNote', () => {
    it('should update an existing note', async () => {
      const updatedContent = 'Updated Content';
      const result = await updateNote('1', updatedContent);

      expect(readNote).toHaveBeenCalled();
      expect(writeNotes).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "1", content: updatedContent })])
      );
      expect(result).toEqual(expect.objectContaining({ id: "1", content: updatedContent }));
    });

    it('should return null if the note is not found', async () => {
      const result = await updateNote('999', 'Updated Content');
      expect(result).toBeNull();
    });
  });

  describe('deleteNote', () => {
    it('should mark a note as deleted', async () => {
      const result = await deleteNote("1");

      expect(readNote).toHaveBeenCalled();
      expect(writeNotes).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "1", isDeleted: true })])
      );
      expect(result).toBe(true);
    });

    it('should return false if the note is not found', async () => {
      const result = await deleteNote('999');
      expect(result).toBe(false);
    });
  });

  describe('moveNoteToFolder', () => {
    it('should move a note to a different folder', async () => {
      const result = await moveNoteToFolder('1', "2");

      expect(readNote).toHaveBeenCalled();
      expect(writeNotes).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "1", folderId: "2" })])
      );
      expect(result).toEqual(expect.objectContaining({ id: "1", folderId: "2" }));
    });

    it('should return null if the note is not found', async () => {
      const result = await moveNoteToFolder('999', '2');
      expect(result).toBeNull();
    });
  });

  describe('getDeletedNotes', () => {
    it('should return all notes that are marked as deleted', async () => {
      const result = await getDeletedNotes();

      expect(readNote).toHaveBeenCalled();
      expect(result).toEqual([expect.objectContaining({ id: "3", isDeleted: true })]);
    });

    it('should return an empty array if no notes are deleted', async () => {
      mockNotes = mockNotes.map(note => ({ ...note, isDeleted: false }));
      (readNote as jest.Mock).mockResolvedValue(mockNotes);

      const result = await getDeletedNotes();
      expect(result).toEqual([]);
    });
  });

  describe('restoreNoteFromRecycleBin', () => {
    it('should restore a deleted note', async () => {
      const result = await restoreNoteFromRecycleBin('3');

      expect(readNote).toHaveBeenCalled();
      expect(writeNotes).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "3", isDeleted: false })])
      );
      expect(result).toEqual(expect.objectContaining({ id: "3", isDeleted: false }));
    });

    it('should return null if the note is not found', async () => {
      const result = await restoreNoteFromRecycleBin('999');
      expect(result).toBeNull();
    });
  });
});

