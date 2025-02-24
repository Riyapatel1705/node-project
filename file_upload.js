const express = require("express");
const multer = require("multer");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const ratelimit=require('express-rate-limit');

const app = express();
app.use(cors());

const PORT = 8000;
const limit=ratelimit({
    WindowMs:2*60*1000,
    max:2,
})

const createFolders = () => {
    const folders = ["uploads", "uploads/photos", "uploads/files"];
    folders.forEach((folder) => {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
    });
};
createFolders();

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (file.fieldname === "photo") {
            cb(null, "uploads/photos/");
        } else if (file.fieldname === "file") {
            cb(null, "uploads/files/");
        }
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
    },
});

const fileFilter = (req, file, cb) => {
    const allowedTypes1 = /pdf|eps|docx/i; // Allow PDF, EPS, DOCX (case insensitive)
    const allowedTypes2 = /jpg|jpeg|png|gif/i; // Allow image types (case insensitive)

    const extname = path.extname(file.originalname).toLowerCase();
    const mimetype = file.mimetype;

    // Check if the file is a document or an image
    const isDocument = allowedTypes1.test(extname) && allowedTypes1.test(mimetype);
    const isImage = allowedTypes2.test(extname) && allowedTypes2.test(mimetype);

    if (file.fieldname === "file") {
        // If it's a file upload, check for document types
        if (isDocument) {
            return cb(null, true);
        } else {
            return cb(new Error('Invalid file type for documents! Allowed types are: pdf, EPS, DOCX.'), false);
        }
    } else if (file.fieldname === "photo") {
        // If it's a photo upload, check for image types
        if (isImage) {
            return cb(null, true);
        } else {
            return cb(new Error('Invalid file type for photos! Allowed types are: jpg, jpeg, png, gif.'), false);
        }
    } else {
        return cb(new Error('Invalid field name!'), false);
    }
};


const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }, // Limit to 5MB
});

// Upload route
app.post("/upload", upload.fields([{ name: "photo", maxCount: 1 }, { name: "file", maxCount: 1 }]), limit, (req, res)=> {
   
    if (!req.files || (!req.files.photo && !req.files.file)) {
        return res.status(400).json({ message: "No files uploaded" });
    }

    const photoUrl = req.files.photo ? `http://localhost:${PORT}/uploads/photos/${req.files.photo[0].filename}` : null;
    const fileUrl = req.files.file ? `http://localhost:${PORT}/uploads/files/${req.files.file[0].filename}` : null;

    res.json({
        message: "File uploaded successfully",
        photo_url: photoUrl,
        file_url: fileUrl,
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if(err.code==="LIMIT_FILE_SIZE"){
            return res.status(400).json({ error: "File size exceeds the 2MB limit!" });
        }
        return res.status(400).json({ error: err.message });
    } else if (err) {
        return res.status(400).json({ error: err.message || 'Invalid file type!' });
    }
    next();
});

// Serve static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
