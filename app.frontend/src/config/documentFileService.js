// Document file service
import { API_ENDPOINTS, ApiClient } from './api';

export class DocumentFileService {
  /**
   * Upload a file to a document
   * @param {number} documentId - The document ID
   * @param {File} file - The file to upload
   * @param {Object} options - Upload options
   * @returns {Promise<Object>} - The uploaded file record
   */
  static async uploadFile(documentId, file, options = {}) {
    const { description = '', isMain = false } = options;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('isMain', isMain);
    
    const token = localStorage.getItem('token');
    const response = await fetch(API_ENDPOINTS.DOCUMENTS + `/${documentId}/files`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData
    });
    
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Eroare la încărcarea fișierului: ${response.status}`);
    }
    
    return data;
  }
  
  /**
   * Get all files for a document
   * @param {number} documentId - The document ID
   * @returns {Promise<Array>} - Array of file records
   */
  static async getFiles(documentId) {
    const response = await ApiClient.get(API_ENDPOINTS.DOCUMENTS + `/${documentId}/files`);
    return response.data;
  }
  
  /**
   * Delete a file
   * @param {number} fileId - The file ID
   * @returns {Promise<Object>} - The deleted file record
   */
  static async deleteFile(fileId) {
    const response = await ApiClient.delete(API_ENDPOINTS.DOCUMENTS + `/files/${fileId}`);
    return response.data;
  }
  
  /**
   * Get a signed URL for file preview
   * @param {number} fileId - The file ID
   * @param {number} expireSeconds - URL expiration time in seconds
   * @returns {Promise<Object>} - Object containing the signed URL
   */
  static async getSignedUrl(fileId, expireSeconds = 3600) {
    const response = await ApiClient.get(
      API_ENDPOINTS.DOCUMENTS + `/files/${fileId}/signed-url?expireSeconds=${expireSeconds}`
    );
    return response.data;
  }
  
  /**
   * Get file type icon based on MIME type
   * @param {string} fileType - MIME type of the file
   * @returns {string} - Icon component name
   */
  static getFileIcon(fileType) {
    if (!fileType) return 'File';
    
    if (fileType.includes('pdf')) {
      return 'FileText';
    } else if (fileType.includes('word') || fileType.includes('opendocument.text')) {
      return 'FileText';
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return 'FileSpreadsheet';
    } else if (fileType.includes('image')) {
      return 'Image';
    } else {
      return 'File';
    }
  }
  
  /**
   * Format file size for display
   * @param {number} bytes - Size in bytes
   * @returns {string} - Formatted size
   */
  static formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else if (bytes < 1073741824) return (bytes / 1048576).toFixed(2) + ' MB';
    else return (bytes / 1073741824).toFixed(2) + ' GB';
  }
  
  /**
   * Check if a file can be previewed in browser
   * @param {string} fileType - MIME type of the file
   * @returns {boolean} - True if file is previewable
   */
  static isPreviewable(fileType) {
    if (!fileType) return false;
    
    const previewableTypes = [
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml'
    ];
    
    return previewableTypes.includes(fileType);
  }
}

export default DocumentFileService;
