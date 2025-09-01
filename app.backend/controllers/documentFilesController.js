const Document = require('../models/Document');
const S3Service = require('../services/s3Service');
const { validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = path.join(__dirname, '../uploads/temp');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)){
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    // Use original filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// File filter to validate file types
const fileFilter = (req, file, cb) => {
  // Accept document formats and images
  const allowedTypes = [
    'application/pdf', 
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/vnd.oasis.opendocument.text',
    'application/vnd.oasis.opendocument.spreadsheet'
  ];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Formatul fișierului nu este acceptat. Sunt permise doar PDF, Word, Excel și imagini.'), false);
  }
};

// Configure multer upload
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  }
});

// Helper function to get MIME type from file extension
const getMimeType = (filename) => {
  const extension = path.extname(filename).toLowerCase();
  const mimeTypes = {
    '.pdf': 'application/pdf',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.odt': 'application/vnd.oasis.opendocument.text',
    '.ods': 'application/vnd.oasis.opendocument.spreadsheet'
  };
  return mimeTypes[extension] || 'application/octet-stream';
};

class DocumentFilesController {
  // Upload file to document
  static async uploadFile(req, res) {
    try {
      // Multer will handle file upload and store in temp folder
      upload.single('file')(req, res, async (err) => {
        if (err) {
          return res.status(400).json({
            success: false,
            error: err.message
          });
        }

        if (!req.file) {
          return res.status(400).json({
            success: false,
            error: 'Nu s-a încărcat niciun fișier'
          });
        }

        try {
          const { documentId } = req.params;
          const { description, isMain } = req.body;
          const userId = req.user?.id;

          if (!userId) {
            await unlinkAsync(req.file.path);
            return res.status(401).json({
              success: false,
              error: 'Utilizator neautentificat'
            });
          }

          // Read file buffer
          const fileBuffer = fs.readFileSync(req.file.path);
          const fileSize = req.file.size;
          const fileType = req.file.mimetype;
          const originalFilename = req.file.originalname;

          // Upload to S3
          const s3Result = await S3Service.uploadFile(
            fileBuffer, 
            originalFilename,
            fileType,
            'documents'
          );

          // Delete temp file
          await unlinkAsync(req.file.path);

          // Create file record in database
          const fileRecord = await Document.uploadFile({
            documentId: parseInt(documentId),
            originalFilename,
            s3Key: s3Result.key,
            fileType,
            fileSize,
            userId,
            description: description || null,
            isMain: isMain === 'true' || isMain === true
          });

          // Generate signed URL for preview
          const signedUrl = await S3Service.getSignedUrl(s3Result.key);

          res.status(201).json({
            success: true,
            message: 'Fișierul a fost încărcat cu succes',
            data: {
              ...fileRecord,
              signed_url: signedUrl
            }
          });
        } catch (error) {
          // Clean up temp file in case of error
          if (req.file && req.file.path) {
            try {
              await unlinkAsync(req.file.path);
            } catch (e) {
              console.error('Error deleting temp file:', e);
            }
          }
          
          console.error('Error uploading file:', error);
          res.status(500).json({
            success: false,
            error: error.message || 'Eroare la încărcarea fișierului'
          });
        }
      });
    } catch (error) {
      console.error('Error in upload middleware:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Eroare la procesarea încărcării'
      });
    }
  }

  // Get all files for a document
  static async getFiles(req, res) {
    try {
      const { documentId } = req.params;
      
      const files = await Document.getFiles(parseInt(documentId));
      
      res.json({
        success: true,
        data: files
      });
    } catch (error) {
      console.error('Error fetching document files:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Eroare la încărcarea fișierelor'
      });
    }
  }

  // Delete file
  static async deleteFile(req, res) {
    try {
      const { fileId } = req.params;
      
      const deletedFile = await Document.deleteFile(parseInt(fileId));
      
      res.json({
        success: true,
        message: 'Fișierul a fost șters cu succes',
        data: deletedFile
      });
    } catch (error) {
      console.error('Error deleting file:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Eroare la ștergerea fișierului'
      });
    }
  }

  // Get signed URL for file preview/download
  static async getSignedUrl(req, res) {
    try {
      const { fileId } = req.params;
      const { expireSeconds = 3600 } = req.query;
      
      // Get file record from database
      const [file] = await Document.db.query(
        'SELECT * FROM document_files WHERE id = $1',
        [parseInt(fileId)]
      );
      
      if (!file) {
        return res.status(404).json({
          success: false,
          error: 'Fișierul nu a fost găsit'
        });
      }
      
      // Generate signed URL
      const signedUrl = await S3Service.getSignedUrl(file.s3_key, parseInt(expireSeconds));
      
      res.json({
        success: true,
        data: {
          signed_url: signedUrl,
          expires_in: parseInt(expireSeconds),
          file_type: file.file_type,
          original_filename: file.original_filename
        }
      });
    } catch (error) {
      console.error('Error generating signed URL:', error);
      res.status(500).json({
        success: false,
        error: error.message || 'Eroare la generarea URL-ului'
      });
    }
  }
}

module.exports = DocumentFilesController;
