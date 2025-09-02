const express = require('express');
const { authenticateToken } = require('../middleware/auth');
const DocumentFilesController = require('../controllers/documentFilesController');
const { upload } = require('../services/s3Service');

const router = express.Router();

// List files
router.get('/', authenticateToken, DocumentFilesController.list);

// Upload multiple files
router.post('/upload', authenticateToken, (req, res, next) => {
	console.log('Before multer middleware');
	upload.array('files', 10)(req, res, (err) => {
		if (err) {
			console.error('Multer error:', err);
			return res.status(500).json({ success: false, error: 'Multer upload error', details: err.message });
		}
		console.log('Multer middleware completed successfully');
		next();
	});
}, DocumentFilesController.upload);

// Get a presigned download URL
router.get('/:id/download-url', authenticateToken, DocumentFilesController.getDownloadUrl);

// Update a file
router.put('/:id', authenticateToken, DocumentFilesController.update);

// Delete a file
router.delete('/:id', authenticateToken, DocumentFilesController.remove);

module.exports = router;
