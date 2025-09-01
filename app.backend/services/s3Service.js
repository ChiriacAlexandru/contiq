const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');

// Configure AWS
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION
});

const s3 = new AWS.S3();

class S3Service {
  static getBucketName() {
    return process.env.AWS_S3_BUCKET_NAME;
  }

  /**
   * Upload a file to S3
   * @param {Buffer} fileBuffer - The file buffer
   * @param {string} fileName - Original file name
   * @param {string} contentType - MIME type of the file
   * @param {string} [folder='documents'] - The folder to upload to in the bucket
   * @returns {Promise<{key: string, location: string, bucket: string}>} - Upload result
   */
  static async uploadFile(fileBuffer, fileName, contentType, folder = 'documents') {
    // Generate a unique file name to prevent collisions
    const fileExtension = fileName.split('.').pop().toLowerCase();
    const uniqueFileName = `${folder}/${uuidv4()}-${fileName}`;

    const params = {
      Bucket: this.getBucketName(),
      Key: uniqueFileName,
      Body: fileBuffer,
      ContentType: contentType,
      ACL: 'private', // Set to private for security
    };

    try {
      const result = await s3.upload(params).promise();
      return {
        key: result.Key,
        location: result.Location,
        bucket: result.Bucket,
      };
    } catch (error) {
      console.error('Error uploading file to S3:', error);
      throw new Error(`S3 upload failed: ${error.message}`);
    }
  }

  /**
   * Delete a file from S3
   * @param {string} key - The S3 object key
   * @returns {Promise<void>}
   */
  static async deleteFile(key) {
    const params = {
      Bucket: this.getBucketName(),
      Key: key,
    };

    try {
      await s3.deleteObject(params).promise();
    } catch (error) {
      console.error('Error deleting file from S3:', error);
      throw new Error(`S3 delete failed: ${error.message}`);
    }
  }

  /**
   * Generate a signed URL for viewing a file
   * @param {string} key - The S3 object key
   * @param {number} [expireSeconds=3600] - URL expiration time in seconds (default 1 hour)
   * @returns {Promise<string>} - Signed URL
   */
  static getSignedUrl(key, expireSeconds = 3600) {
    const params = {
      Bucket: this.getBucketName(),
      Key: key,
      Expires: expireSeconds
    };

    return s3.getSignedUrlPromise('getObject', params);
  }
}

module.exports = S3Service;
