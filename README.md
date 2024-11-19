# 📒 **Notes App Backend**
This project provides a backend service for a simple Notes app where users can create, update, delete, and organize notes in folders. It is built using Node.js and TypeScript, with data stored in JSON files (instead of a database). The backend provides several APIs for managing notes and folders.

----------------------------------------------

# 📝 **Requirements**

To run this project, you'll need:

Node.js (v14.x or later)
npm or yarn for package management
--------
## Core Functionalities
* Create a new note (text content only).
*  Create a folder to organize notes.
* Update an existing note.
* Move notes between folders.
* Delete notes.
* List all notes in a folder with metadata (size, creation date, modification date).


# Project Structure
notes-app/
│
├── src/
│   ├── controllers/          
│   ├── services/            
│   ├── models/              
│   ├── routes/              
│   ├── middleware/           
│   ├── data.json           
│   ├── server.ts           
│
├── .env                     
├── package.json              
├── tsconfig.json             
└── README.md               

-----------------------------------------------

# Tech Stack
* Node.js with Express for the backend.
* TypeScript for type safety and better developer experience.
* JSON file storage for data persistence.

-----------------------------------------------
# 🚀 Installation and Setup
### Step 1: Clone the repository
git clone https://github.com/yourusername/notes-app-backend.git
### Step 2: Navigate to the project directory
cd notes-app-backend
### Step 3: Install dependencies
npm install
### Set up environment variables
PORT=5000
### Step 5: Run the application in development mode
npm run dev


This will start the backend at http://localhost:5000.

# 📑 **API Documentation**

## Folder APIs
### Create a Folder
* POST /api/folders
* Description: Create a new folder to organize notes.
### Get Folder
* GET /api/folders
* Description: Retrieve the folders list.
### Rename Folder
* PUT /api/folders/:folderId/rename
* Description: Rename the folder
### Delete Folder
* DELETE /api/folders/:folderId
* Description: Delete a folder

## Notes APIs
### Get Notes within a Folder
* GET api/notes/folder/:folderId
* Description: Return all notes within a folder
### Create Note
* POST api/notes
* Description: create a new note within the folder
### Update Note
* PUT api/notes/:noteId
* Description: update a note within the folder
### Delete Notes
* DELETE api/:noteId
* Description: delete a note 
### Move Notes
* PUT /api/notes/:noteId/move
* Description: Move a note from one folder to another

--------------------------------------------------------

# 🛠️ **Testing the APIs**
You can test the APIs using:

🖥️ Postman or cURL
# Postman:

Download and install Postman.
Test your API endpoints by sending requests to http://localhost:5000.
cURL (examples):

1. Create a new note:
curl -X POST http://localhost:5000/api/notes \
-H "Content-Type: application/json" \
-d '{"content": "Test note", "folderId": "folder_id"}'
2. Get notes in a folder:
curl -X GET http://localhost:5000/api/notes/folder/folder_id


# 🧪 Automated Testing (Jest)
1. Install Jest and Supertest for automated tests:
2. Add test cases in the src/tests directory.
3. Run tests: `npm test`







