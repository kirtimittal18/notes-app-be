import { readFolders, writeFolders } from '../../models/folder-model';
import {
  getFolderStructure,
  createFolder,
  moveFolder,
  renameFolder,
  deleteFolder,
} from '../folder-service';

jest.mock('../../models/folder-model', () => ({
  readFolders: jest.fn(),
  writeFolders: jest.fn(),
}));

describe('Folder Service', () => {
  let mockedReadFolders: jest.Mock;
  let mockedWriteFolders: jest.Mock;
  const mockFolders = [
    { id: "1", parentFolderId: null, name: 'Root', userId: 1, createdAt: '', updatedAt: '' },
    { id: "2", parentFolderId: "1", name: 'Subfolder1', userId: 1, createdAt: '', updatedAt: '' },
    { id: "3", parentFolderId: "1", name: 'Subfolder2', userId: 1, createdAt: '', updatedAt: '' },
  ];

  beforeEach(() => {
    mockedReadFolders = readFolders as jest.Mock;
    mockedWriteFolders = writeFolders as jest.Mock;

    // Reset mocks before each test
    mockedReadFolders.mockResolvedValue(mockFolders);
    mockedWriteFolders.mockClear();
  });

  describe('getFolderStructure', () => {
    it('should return the folder tree for a user', async () => {
      const folderTree = await getFolderStructure(1);

      expect(readFolders).toHaveBeenCalled();
      expect(folderTree).toEqual([
        {
          id: "1",
          parentFolderId: null,
          name: "Root",
          userId: 1,
          createdAt: "",
          updatedAt: "",
          children: [
            {
              id: "2",
              parentFolderId: "1",
              name: "Subfolder1",
              userId: 1,
              createdAt: "",
              updatedAt: "",
              children: [],
            },
            {
              id: "3",
              parentFolderId: "1",
              name: "Subfolder2",
              userId: 1,
              createdAt: "",
              updatedAt: "",
              children: [],
            },
          ],
        },
      ]);
    });
  });

  describe('createFolder', () => {
    it('should create a new folder under root', async () => {
      const newFolder = await createFolder(null, 'New Folder', 1);

      expect(readFolders).toHaveBeenCalled();
      expect(newFolder).toEqual(expect.objectContaining({ name: 'New Folder' }));
    });

    it('should throw an error if the parent folder does not exist', async () => {
      await expect(createFolder("999", 'New Folder', 1)).rejects.toThrow(
        'Parent folder with ID 999 does not exist.'
      );
    });
  });

  describe('moveFolder', () => {
    it('should move a folder to another folder', async () => {
      const updatedFolder = await moveFolder("2", "3");

      expect(readFolders).toHaveBeenCalled();
      expect(writeFolders).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "2", parentFolderId: "3" })])
      );
      expect(updatedFolder).toEqual(expect.objectContaining({ id: "2", parentFolderId: "3" }));
    });

    it('should return null if the folder does not exist', async () => {
      const result = await moveFolder("999", "3");
      expect(result).toBeNull();
    });
  });

  describe('renameFolder', () => {
    it('should rename the folder', async () => {
      const updatedFolder = await renameFolder("2", 'Renamed Folder');

      expect(readFolders).toHaveBeenCalled();
      expect(writeFolders).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ id: "2", name: 'Renamed Folder' })])
      );
      expect(updatedFolder).toEqual(expect.objectContaining({ id: "2", name: 'Renamed Folder' }));
    });

    it('should return null if the folder does not exist', async () => {
      const result = await renameFolder("999", 'New Name');
      expect(result).toBeNull();
    });
  });

  describe('deleteFolder', () => {
    it('should delete a folder and its subfolders', async () => {
      const result = await deleteFolder("1");

      expect(readFolders).toHaveBeenCalled();
      expect(writeFolders).toHaveBeenCalled();
      expect(result).toBe(true);
    });

    it('should return false if the folder does not exist', async () => {
      const result = await deleteFolder("999");

      expect(readFolders).toHaveBeenCalled();
      expect(result).toBe(false);
    });
  });
});
