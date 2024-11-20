import { Request, Response, NextFunction } from "express";
import * as noteService from "../../services/notes-service";
import * as folderService from "../../services/folder-service";
import {
  getAllNotes,
  createNote,
  updateNote,
  deleteNote,
  moveNoteToFolder,
  getDeletedNotes,
  restoreNoteFromRecycleBin,
} from "../../controllers/notes-controller";

describe("Notes Controller", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockNext: NextFunction;

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe("getAllNotes", () => {
    it("should return notes for a folder", async () => {
      const mockNotes = [
        { id: '1', folderId: '1', content: "Note 1", isDeleted: false },
      ];
      jest.spyOn(noteService, "getAllNotes").mockResolvedValue(mockNotes);

      mockRequest.params = { folderId: "1" };

      const result = await getAllNotes(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(noteService.getAllNotes).toHaveBeenCalledWith("1");
      expect(result?.length).toBe(1);
      expect(result).toBe(mockNotes);
    });

    it("should return 404 if no notes are found", async () => {
      jest.spyOn(noteService, "getAllNotes").mockResolvedValue([]);

      mockRequest.params = { folderId: "1" };

      const result = await getAllNotes(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(noteService.getAllNotes).toHaveBeenCalledWith("1");
      expect(result).toEqual([]);
    });

    it("should call next with error if service throws", async () => {
      const error = new Error("Service Error");

      jest.spyOn(noteService, 'getAllNotes').mockRejectedValue(error);

      mockRequest.params = { folderId: "1" };

      await getAllNotes(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      // This ensures mockNext is correctly typed to accept an Error
      expect(mockNext).toHaveBeenCalledWith(error);
    });

    it("should create a new note", async () => {
      const mockNewNote = {
        id: '1',
        folderId: '1',
        content: "New Note",
        isDeleted: false,
      };
      const mockFolderTree = {
          id: "1",
          name: "Root Folder",
          parentFolderId: null,
          userId: 1,
          createdAt: "2024-10-10T07:00:00.000Z",
          updatedAt: "2024-10-10T07:00:00.000Z",
          children: [],
        };
      jest.spyOn(folderService, "getFolderByID").mockResolvedValue(mockFolderTree)
      jest.spyOn(noteService, "createNote").mockResolvedValue(mockNewNote);

      mockRequest.body = { folderId: "1", content: "New Note" };

      await createNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(noteService.createNote).toHaveBeenCalledWith("1", "New Note");
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockNewNote);
    });

    it("should update a note", async () => {
      const mockUpdatedNote = {
        id: '1',
        folderId: '1',
        content: "Updated Content",
        isDeleted: false,
      };
      jest.spyOn(noteService, "updateNote").mockResolvedValue(mockUpdatedNote);

      mockRequest.params = { noteId: "1" };
      mockRequest.body = { content: "Updated Content" };

      const result = await updateNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(noteService.updateNote).toHaveBeenCalledWith("1", "Updated Content");
      expect(result).toEqual(mockUpdatedNote);
    });

    it("should delete a note and return success", async () => {
      jest.spyOn(noteService, "deleteNote").mockResolvedValue(true);

      mockRequest.params = { noteId: "1" };

      await deleteNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(noteService.deleteNote).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Note moved to recycle bin",
      });
    });

    it("should return 404 if note is not found", async () => {
      jest.spyOn(noteService, "deleteNote").mockResolvedValue(false);

      mockRequest.params = { noteId: "1" };

      await deleteNote(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(noteService.deleteNote).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Note not found",
      });
    });

    it("should move a note to a different folder", async () => {
      const mockMovedNote = {
        id: '1',
        folderId: '2',
        content: "Moved Note",
        isDeleted: false,
      };
      jest
        .spyOn(noteService, "moveNoteToFolder")
        .mockResolvedValue(mockMovedNote);

      mockRequest.params = { noteId: "1" };
      mockRequest.body = { targetFolderId: "2" };

      await moveNoteToFolder(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(noteService.moveNoteToFolder).toHaveBeenCalledWith("1", "2");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockMovedNote);
    });
    it("should return 404 if note is not found", async () => {
      jest.spyOn(noteService, "moveNoteToFolder").mockResolvedValue(null);

      mockRequest.params = { noteId: "1" };
      mockRequest.body = { targetFolderId: 2 };

      await moveNoteToFolder(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: "Note not found",
      });
    });
    it("should return deleted notes", async () => {
      const mockDeletedNotes = [
        { id: '1', folderId: '1', content: "Deleted Note", isDeleted: true },
      ];
      jest
        .spyOn(noteService, "getDeletedNotes")
        .mockResolvedValue(mockDeletedNotes);

      await getDeletedNotes(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(noteService.getDeletedNotes).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockDeletedNotes);
    });

    it("should restore a note from the recycle bin", async () => {
      const mockRestoredNote = {
        id: '1',
        folderId: '2',
        content: "Restored Note",
        isDeleted: false,
      };
      jest
        .spyOn(noteService, "restoreNoteFromRecycleBin")
        .mockResolvedValue(mockRestoredNote);

      mockRequest.params = { noteId: "1" };

      await restoreNoteFromRecycleBin(
        mockRequest as Request,
        mockResponse as Response,
        mockNext
      );

      expect(noteService.restoreNoteFromRecycleBin).toHaveBeenCalledWith("1");
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockRestoredNote);
    });
  });
});
