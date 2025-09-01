const DocumentFile = require('../models/DocumentFile');
const { getSignedUrl, deleteObject } = require('../services/s3Service');

class DocumentFilesController {
	static async upload(req, res) {
		try {
			console.log('Upload request received');
			console.log('req.user:', req.user);
			console.log('req.files:', req.files);
			console.log('req.body:', req.body);
			
			// multer-s3 populated req.files
			const userId = req.user?.userId;
			if (!userId) {
				return res.status(401).json({ success: false, error: 'Utilizator neautentificat' });
			}

			const { document_id = null, supplier_id = null, notes = null } = req.body;
			const files = req.files || [];
			if (!files.length) {
				return res.status(400).json({ success: false, error: 'Niciun fișier de încărcat' });
			}

			const saved = [];
			for (const f of files) {
				const row = await DocumentFile.create({
					original_name: f.originalname,
					s3_key: f.key,
					mime_type: f.mimetype,
					size_bytes: f.size,
					uploaded_by: userId,
					document_id: document_id ? Number(document_id) : null,
					supplier_id: supplier_id ? Number(supplier_id) : null,
					notes: notes || null
				});
				const url = await getSignedUrl(row.s3_key);
				saved.push({ ...row, url });
			}

			res.status(201).json({ success: true, data: saved });
		} catch (err) {
			console.error('Upload error:', err);
			console.error('Error details:', {
				message: err.message,
				code: err.code,
				statusCode: err.statusCode,
				stack: err.stack
			});
			res.status(500).json({ success: false, error: 'Eroare la încărcarea fișierelor', details: err.message });
		}
	}

	static async list(req, res) {
		try {
			const { search = '', limit = 50, offset = 0, supplier_id = null, document_id = null } = req.query;
			const result = await DocumentFile.list({ search, limit: Number(limit), offset: Number(offset), supplier_id, document_id });
			// attach signed urls
			const filesWithUrls = await Promise.all(result.files.map(async f => ({ ...f, url: await getSignedUrl(f.s3_key) })));
			result.files = filesWithUrls;
			res.json({ success: true, data: result });
		} catch (err) {
		console.error('List error:', err);
		res.status(500).json({ success: false, error: 'Eroare la listarea fișierelor', code: err.code });
		}
	}

	static async getDownloadUrl(req, res) {
		try {
			const { id } = req.params;
			const file = await DocumentFile.getById(id);
			if (!file) return res.status(404).json({ success: false, error: 'Fișierul nu există' });
			const url = getSignedUrl(file.s3_key);
			res.json({ success: true, data: { url } });
		} catch (err) {
			console.error('Presign error:', err);
			res.status(500).json({ success: false, error: 'Eroare la generarea linkului de descărcare' });
		}
	}

	static async remove(req, res) {
		try {
			const { id } = req.params;
			const file = await DocumentFile.getById(id);
			if (!file) return res.status(404).json({ success: false, error: 'Fișierul nu există' });
			await deleteObject(file.s3_key);
			await DocumentFile.delete(id);
			res.json({ success: true, message: 'Fișier șters' });
		} catch (err) {
			console.error('Delete error:', err);
			res.status(500).json({ success: false, error: 'Eroare la ștergerea fișierului' });
		}
	}
}

module.exports = DocumentFilesController;

