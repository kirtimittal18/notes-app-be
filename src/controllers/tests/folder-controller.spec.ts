import { Request, Response, NextFunction } from "express";
import * as folderService from "../../services/folder-service";
import {
  getFolderStructure,
  createFolder,
  moveFolder,
  renameFolder,
  deleteFolder,
} from "../../controllers/folder-controller";

describe("Folders Controller", () => {
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

  it("should return folder structure for a user", async () => {
    const mockFolderTree = [
      {
        id: "1",
        name: "Root Folder",
        parentFolderId: null,
        userId: 1,
        createdAt: "2024-10-10T07:00:00.000Z",
        updatedAt: "2024-10-10T07:00:00.000Z",
        children: [],
      },
    ];
    jest
      .spyOn(folderService, "getFolderStructure")
      .mockResolvedValue(mockFolderTree);

    const result = await getFolderStructure(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(folderService.getFolderStructure).toHaveBeenCalled();
    expect(result).toEqual(mockFolderTree);
  });

  it("should return 404 if no folder tree is found", async () => {
    jest.spyOn(folderService, "getFolderStructure").mockResolvedValue([]);

    const result = await getFolderStructure(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(folderService.getFolderStructure).toHaveBeenCalled();
    expect(result).toEqual([]);
  });

  it("should call next with error if service throws", async () => {
    const error = new Error("Service error");
    jest.spyOn(folderService, "getFolderStructure").mockRejectedValue(error);

    await getFolderStructure(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith(error);
  });

  it("should create a new folder", async () => {
    mockRequest.body = { parentFolderId: null, folderName: "New Folder" };
    const mockNewFolder = {
      id: "1",
      name: "New Folder",
      parentFolderId: null,
      userId: 1,
      createdAt: "2024-10-10T07:00:00.000Z",
      updatedAt: "2024-10-10T07:00:00.000Z",
      children: [],
    };
    jest.spyOn(folderService, "createFolder").mockResolvedValue(mockNewFolder);

    await createFolder(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(folderService.createFolder).toHaveBeenCalledWith(null, "New Folder");
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith(mockNewFolder);
  });

  it("should return 400 if folderName is missing", async () => {
    mockRequest.body = { parentFolderId: null, folderName: "" };

    await createFolder(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith({
      statusCode: 400,
      message: "Folder name is required",
    });
  });

  it("should move a folder to a new target folder", async () => {
    mockRequest.params = { folderId: "1" };
    mockRequest.body = { targetFolderId: "2" };
    const mockMovedFolder = {
      id: "1",
      name: "Root Folder",
      parentFolderId: "2",
      userId: 1,
      createdAt: "2024-10-10T07:00:00.000Z",
      updatedAt: "2024-10-10T07:00:00.000Z",
      children: [],
    };
    jest.spyOn(folderService, "moveFolder").mockResolvedValue(mockMovedFolder);

    await moveFolder(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(folderService.moveFolder).toHaveBeenCalledWith("1", "2");
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockMovedFolder);
  });

  it("should return 404 if folder is not found", async () => {
    mockRequest.params = { folderId: "1" };
    mockRequest.body = { targetFolderId: 2 };
    jest.spyOn(folderService, "moveFolder").mockResolvedValue(null);

    await moveFolder(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockNext).toHaveBeenCalledWith({
      statusCode: 404,
      message: "Folder not found",
    });
  });

  it("should rename a folder", async () => {
    mockRequest.params = { folderId: "1" };
    mockRequest.body = { name: "Updated Folder" };
    const mockUpdatedFolder = {
      id: "1",
      name: "Updated Folder",
      parentFolderId: "2",
      userId: 1,
      createdAt: "2024-10-10T07:00:00.000Z",
      updatedAt: "2024-10-10T07:00:00.000Z",
      children: [],
    };
    jest
      .spyOn(folderService, "renameFolder")
      .mockResolvedValue(mockUpdatedFolder);

    await renameFolder(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(folderService.renameFolder).toHaveBeenCalledWith(
      "1",
      "Updated Folder"
    );
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedFolder);
  });

  it("should return 400 if newName is missing", async () => {
    mockRequest.params = { folderId: "1" };
    mockRequest.body = { newName: "" };

    await renameFolder(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(400);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "New folder name is required",
    });
  });

  it("should delete a folder", async () => {
    mockRequest.params = { folderId: "1" };
    jest.spyOn(folderService, "deleteFolder").mockResolvedValue(true);

    await deleteFolder(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(folderService.deleteFolder).toHaveBeenCalledWith("1");
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Folder deleted successfully",
    });
  });

  it("should return 404 if folder is not found", async () => {
    mockRequest.params = { folderId: "1" };
    jest.spyOn(folderService, "deleteFolder").mockResolvedValue(false);

    await deleteFolder(
      mockRequest as Request,
      mockResponse as Response,
      mockNext
    );

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Folder not found",
    });
  });
});
