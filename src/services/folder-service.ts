// services/folders-service.ts

import { Folder, readFolders, writeFolders } from "../models/folder-model";
const uuid = require('uuid')

interface FolderTree extends Folder {
  children: FolderTree[]; // Recursively define children
}
// Get Folder Tree for a User
export const getFolderStructure = async (
  userId: number = 1
): Promise<Folder[]> => {
  const folders = await readFolders();
  const folderTree = buildTree(folders, null, userId);
  return folderTree;
};

const buildTree = (
  folders: Folder[],
  parentId: string | null,
  userId: number
): FolderTree[] => {
  return folders
    .filter((folder) => folder.parentFolderId === parentId)
    .map((folder) => ({
      ...folder,
      children: buildTree(folders, folder.id, userId), // Recursively build children
    }));
};

// get Folder by Id

export const getFolderByID = async (
  id: string | null,
  userId = 1
): Promise<Folder> => {
  const folders = await readFolders();
  const reqFolder = folders.find((folder) => folder.id === id);
  if (!reqFolder) {
    throw new Error(`Folder with ID ${id} does not exist.`);
  }

  return reqFolder;
};

// Create a New Folder
export const createFolder = async (
  parentFolderId: string | null,
  folderName: string,
  userId = 1
): Promise<Folder> => {
  const folders = await readFolders();
  if (parentFolderId) {
    const doesParentFolderExist = folders.some(
      (folder) => folder.id === parentFolderId
    );
    if (!doesParentFolderExist) {
      throw new Error(
        `Parent folder with ID ${parentFolderId} does not exist.`
      );
    }
  }
  const newFolder: Folder = {
    id: uuid.v4(),
    parentFolderId: parentFolderId || null,
    name: folderName,
    userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  folders.push(newFolder);
  writeFolders(folders);
  return newFolder;
};

// Move a Folder to Another Folder
export const moveFolder = async (
  folderId: string,
  targetFolderId: string
): Promise<Folder | null> => {
  const folders = await readFolders();
  const folderIndex = folders.findIndex((folder) => folder.id === folderId);

  if (folderIndex === -1) {
    return null; // Folder not found
  }

  // Update the userId and updated timestamp
  folders[folderIndex].parentFolderId = targetFolderId;
  folders[folderIndex].updatedAt = new Date().toISOString();

  // Write the updated folders back to the file
  writeFolders(folders);
  return folders[folderIndex]; // Return the updated folder
};

// Rename a folder
export const renameFolder = async (
  folderId: string,
  newName: string
): Promise<Folder | null> => {
  // Logic to rename the folder
  const folders = await readFolders();
  const folderIndex = folders.findIndex((folder) => folder.id === folderId);

  if (folderIndex === -1) {
    return null; // Folder not found
  }

  // Update the folder name and updated timestamp
  folders[folderIndex].name = newName;
  folders[folderIndex].updatedAt = new Date().toISOString();

  // Write the updated folders back to the file
  writeFolders(folders);
  return folders[folderIndex];
};

// Delete a Folder
export const deleteFolder = async (folderId: string): Promise<boolean> => {
  const folders = await readFolders();
  const folderIndex = folders.findIndex((folder) => folder.id === folderId);

  if (folderIndex === -1) {
    return false; // Folder not found
  }

  // Remove the folder
  folders.splice(folderIndex, 1);
  writeFolders(folders);

  return true; // Indicate successful deletion
};
