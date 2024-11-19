import { UUID } from 'crypto';
import fs from 'fs';
import path from 'path';


export interface Folder {
    id: string;
    name: string;
    parentFolderId: string | null;
    userId: number;
    createdAt: string;
    updatedAt: string;
  }

const folderFilePath = path.join(__dirname, "../data/folders.json");

// Helper function to read the folders JSON file
export const readFolders = async () : Promise<Folder[]>=> {
  try {
    const data = await fs.readFileSync(folderFilePath, 'utf-8');
    
    // Make sure to return parsed data
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading folder structure:', error);
    throw new Error('Could not fetch folder structure');
  }
};

// Helper function to write data to the folders JSON file
export const writeFolders = (folders: Folder[]): void => {
  fs.writeFileSync(folderFilePath, JSON.stringify(folders, null, 2), "utf-8");
};