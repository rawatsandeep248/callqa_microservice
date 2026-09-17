const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Function to get a unique filename
const generateUniqueFilename = (filename, destination) => {
  let fileExtension = path.extname(filename);
  let baseName = path.basename(filename, fileExtension);
  let filePath = path.join(destination, filename);

  let counter = 1;
  // Keep checking if the file already exists and increment the counter until we find a unique name
  while (fs.existsSync(filePath)) {
    // Generate a new filename with a counter
    filename = `${baseName}(${counter})${fileExtension}`;
    filePath = path.join(destination, filename);
    counter++;
  }
  return filename;
};

// Set up storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "/../../uploads")); // Define the upload folder
  },
  filename: (req, file, cb) => {
    const uniqueFilename = generateUniqueFilename(
      file.originalname,
      path.join(__dirname, "/../../uploads")
    );
    cb(null, uniqueFilename); // Pass the unique filename to the callback
  },
});

// Create the multer instance with the storage configuration
const upload = multer({ storage: storage });

// In-memory upload (no disk write). Prefer for parse-and-discard flows such as AVA QC.
const uploadMemory = multer({ storage: multer.memoryStorage() });

module.exports = {
  upload,
  uploadMemory,
};
