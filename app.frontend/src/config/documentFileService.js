import { API_ENDPOINTS, ApiClient } from './api';

export const DocumentFileService = {
	list: async (params = {}) => {
		const q = new URLSearchParams();
		Object.entries(params).forEach(([k,v]) => { if (v !== undefined && v !== null && v !== '') q.append(k, v); });
		const url = `${API_ENDPOINTS.DOCUMENT_FILES}?${q.toString()}`;
		const resp = await ApiClient.get(url);
		return resp.data;
	},
	getDownloadUrl: async (id) => {
		const resp = await ApiClient.get(API_ENDPOINTS.DOCUMENT_FILE_DOWNLOAD_URL(id));
		return resp.data.url;
	}
};

export default DocumentFileService;

