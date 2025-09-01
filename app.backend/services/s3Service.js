const { S3Client, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl: v3GetSignedUrl } = require('@aws-sdk/s3-request-presigner');
const multer = require('multer');
const multerS3 = require('multer-s3');
const path = require('path');

// Initialize AWS SDK v3 client from environment variables
const {
	AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY,
	AWS_REGION,
	AWS_S3_BUCKET_NAME
} = process.env;

const s3 = new S3Client({
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY_ID,
		secretAccessKey: AWS_SECRET_ACCESS_KEY
	}
});

function sanitizeFileName(name) {
	return name
		.replace(/[^a-zA-Z0-9_.-]/g, '_')
		.replace(/_+/g, '_')
		.toLowerCase();
}

// Multer S3 storage (v3)
const s3Storage = multerS3({
	s3,
	bucket: AWS_S3_BUCKET_NAME,
	contentType: multerS3.AUTO_CONTENT_TYPE,
	key: (req, file, cb) => {
		const userId = req.user?.userId || 'anonymous';
		const timestamp = Date.now();
		const base = path.basename(file.originalname);
		const key = `uploads/${userId}/${timestamp}_${sanitizeFileName(base)}`;
		cb(null, key);
	}
});

const upload = multer({
	storage: s3Storage,
	limits: {
		fileSize: 10 * 1024 * 1024, // 10MB
		files: 10
	}
});

async function getSignedUrl(key, expires = 600) { // seconds
	const command = new GetObjectCommand({ Bucket: AWS_S3_BUCKET_NAME, Key: key });
	return v3GetSignedUrl(s3, command, { expiresIn: expires });
}

async function deleteObject(key) {
	await s3.send(new DeleteObjectCommand({ Bucket: AWS_S3_BUCKET_NAME, Key: key }));
}

module.exports = {
	s3,
	upload,
	getSignedUrl,
	deleteObject,
	bucket: AWS_S3_BUCKET_NAME
};

