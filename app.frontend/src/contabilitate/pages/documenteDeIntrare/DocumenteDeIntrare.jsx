import React, { useEffect, useState } from "react";
import {
  FileInput,
  Upload,
  Grid,
  List,
  Search,
  RefreshCw,
  Filter,
  Download,
  Eye,
  Trash2,
  MoreVertical,
  X,
  File,
  FileText,
  Image,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  CloudUpload,
  Folder,
  Edit,
} from "lucide-react";

import { DocumentFilesService, SuppliersService, DocumentsService } from "../../../config/api";

const formatSize = (bytes) => {
  if (!bytes && bytes !== 0) return '';
  const units = ['B','KB','MB','GB'];
  let i = 0; let v = Number(bytes);
  while (v >= 1024 && i < units.length-1) { v/=1024; i++; }
  return `${v.toFixed( (i>1) ? 2 : 0)} ${units[i]}`;
};

const DocumenteIntrare = () => {
  const [documente, setDocumente] = useState([]);

  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedDocumente, setSelectedDocumente] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("toate");
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFiles, setUploadingFiles] = useState([]);
  const [previewDocument, setPreviewDocument] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [documentToEdit, setDocumentToEdit] = useState(null);
  const [editFormData, setEditFormData] = useState({
    original_name: '',
    notes: '',
    supplier_id: '',
    document_id: ''
  });
  const [availableSuppliers, setAvailableSuppliers] = useState([]);
  const [availableDocuments, setAvailableDocuments] = useState([]);
  const [loadingDropdownData, setLoadingDropdownData] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "procesat":
        return "bg-green-100 text-green-700";
      case "în procesare":
        return "bg-yellow-100 text-white";
      case "eroare":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "procesat":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "în procesare":
        return <Clock className="w-4 h-4 text-white" />;
      case "eroare":
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getFileIcon = (tip) => {
    switch (tip) {
      case "PDF":
        return <FileText className="w-8 h-8 text-red-500" />;
      case "JPG":
      case "PNG":
        return <Image className="w-8 h-8 text-blue-500" />;
      case "XLSX":
      case "XLS":
        return <File className="w-8 h-8 text-green-500" />;
      default:
        return <File className="w-8 h-8 text-gray-500" />;
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const refreshList = async () => {
    try {
      setIsLoading(true);
      const res = await DocumentFilesService.list({ limit: 100 });
      const mapped = res.files.map(f => ({
        id: f.id,
        nume: f.original_name,
        tip: (f.mime_type || '').split('/')[1]?.toUpperCase() || 'FILE',
        dimensiune: formatSize(f.size_bytes),
        data: f.created_at,
        ora: new Date(f.created_at).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' }),
        furnizor: f.supplier_id ? `Furnizor #${f.supplier_id}` : '—',
        status: 'procesat',
        s3Url: f.url,
        thumbnail: null
      }));
      setDocumente(mapped);
    } catch (error) {
      console.error('Error refreshing list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { refreshList(); }, []);

  const handleFiles = async (files) => {
    const list = Array.from(files).map(f => ({ name: f.name, size: formatSize(f.size), progress: 0, status: 'uploading' }));
    setUploadingFiles(list);

    try {
      const uploaded = await DocumentFilesService.upload(files, {});
      // mark completed
      setUploadingFiles(prev => prev.map(f => ({ ...f, progress: 100, status: 'completed' })));
      await refreshList();
      
      // Show success message and close modal after delay
      setTimeout(() => {
        setUploadingFiles([]);
        setShowUploadModal(false);
      }, 2000);
    } catch (e) {
      console.error(e);
      setUploadingFiles(prev => prev.map(f => ({ ...f, status: 'eroare' })));
    }
  };

  const handlePreview = (document) => {
    setPreviewDocument(document);
    setShowPreviewModal(true);
  };

  const handleDelete = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await DocumentFilesService.remove(documentToDelete.id);
      await refreshList();
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    } catch (error) {
      console.error('Error deleting document:', error);
      alert('Eroare la ștergerea documentului');
    }
  };

  const handleDownload = async (document) => {
    try {
      const url = await DocumentFilesService.getDownloadUrl(document.id);
      const link = document.createElement('a');
      link.href = url;
      link.download = document.nume;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading document:', error);
      alert('Eroare la descărcarea documentului');
    }
  };

  const handleBulkDownload = async () => {
    const selectedDocs = documente.filter(doc => selectedDocumente.includes(doc.id));
    for (const doc of selectedDocs) {
      await handleDownload(doc);
      // Add small delay to avoid overwhelming the browser
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  };

  const handleBulkDelete = async () => {
    if (window.confirm(`Ești sigur că vrei să ștergi ${selectedDocumente.length} documente? Această acțiune nu poate fi anulată.`)) {
      try {
        const deletePromises = selectedDocumente.map(id => DocumentFilesService.remove(id));
        await Promise.all(deletePromises);
        await refreshList();
        setSelectedDocumente([]);
      } catch (error) {
        console.error('Error deleting documents:', error);
        alert('Eroare la ștergerea documentelor');
      }
    }
  };

  const loadDropdownData = async () => {
    try {
      setLoadingDropdownData(true);
      const [suppliers, documents] = await Promise.all([
        SuppliersService.getActiveSuppliers(),
        DocumentsService.getDocuments({ limit: 100 })
      ]);
      setAvailableSuppliers(suppliers);
      setAvailableDocuments(documents.documents || documents);
    } catch (error) {
      console.error('Error loading dropdown data:', error);
    } finally {
      setLoadingDropdownData(false);
    }
  };

  const handleEdit = (document) => {
    setDocumentToEdit(document);
    setEditFormData({
      original_name: document.nume || '',
      notes: document.notes || '',
      supplier_id: document.supplier_id || '',
      document_id: document.document_id || ''
    });
    loadDropdownData(); // Load dropdown data when modal opens
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    try {
      await DocumentFilesService.update(documentToEdit.id, editFormData);
      await refreshList();
      setShowEditModal(false);
      setDocumentToEdit(null);
      alert('Document editat cu succes!');
    } catch (error) {
      console.error('Error updating document:', error);
      const errorMessage = error.message || 'Eroare la editarea documentului';
      alert(errorMessage);
    }
  };

  const filteredDocumente = documente.filter((doc) => {
    const matchesSearch =
      doc.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.furnizor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "toate" || doc.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedDocumente.length === filteredDocumente.length) {
      setSelectedDocumente([]);
    } else {
      setSelectedDocumente(filteredDocumente.map((d) => d.id));
    }
  };

  const toggleSelectDocument = (id) => {
    if (selectedDocumente.includes(id)) {
      setSelectedDocumente(selectedDocumente.filter((dId) => dId !== id));
    } else {
      setSelectedDocumente([...selectedDocumente, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Documente de Intrare
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Încarcă și gestionează documentele primite
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => setShowUploadModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
            >
              <Upload className="w-5 h-5 mr-2" />
              Încarcă Document
            </button>
            <div className="inline-flex rounded-xl border border-gray-200 bg-white">
              <button
                onClick={() => setViewMode("grid")}
                className={`px-3 py-2 rounded-l-xl transition-colors ${
                  viewMode === "grid"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-r-xl transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
            <button 
              onClick={refreshList} 
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
            >
              <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? 'Se încarcă...' : 'Actualizare'}
            </button>
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 lg:p-8">
        {/* Search and Filters */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Caută după nume document sau furnizor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="toate">Toate statusurile</option>
              <option value="procesat">Procesat</option>
              <option value="în procesare">În procesare</option>
              <option value="eroare">Eroare</option>
            </select>
            <button
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtre
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Documente</p>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  {documente.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <FileInput className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Procesate</p>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  {documente.filter((d) => d.status === "procesat").length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">În Procesare</p>
                <p className="text-xl font-bold text-gray-900 mb-4">
                  {documente.filter((d) => d.status === "în procesare").length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
                <Clock className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Spațiu S3</p>
                <p className="text-xl font-bold text-gray-900 mb-4">12.5 GB</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <CloudUpload className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredDocumente.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      {getFileIcon(doc.tip)}
                      <span className="ml-2 px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                        {doc.tip}
                      </span>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedDocumente.includes(doc.id)}
                      onChange={() => toggleSelectDocument(doc.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1 truncate">
                    {doc.nume}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 truncate">
                    {doc.furnizor}
                  </p>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      {new Date(doc.data).toLocaleDateString("ro-RO")} •{" "}
                      {doc.ora}
                    </div>
                    <div className="flex items-center text-gray-500">
                      <File className="w-4 h-4 mr-2" />
                      {doc.dimensiune}
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(doc.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                    <button 
                      onClick={() => handlePreview(doc)}
                      className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                      title="Prevăzualizează"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleEdit(doc)}
                      className="p-2 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                      title="Editează"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDownload(doc)}
                      className="p-2 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                      title="Descarcă"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(doc)}
                      className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      title="Șterge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* List View */}
        {viewMode === "list" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left">
                      <input
                        type="checkbox"
                        checked={
                          selectedDocumente.length === filteredDocumente.length
                        }
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Nume Document
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Furnizor
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Dimensiune
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredDocumente.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedDocumente.includes(doc.id)}
                          onChange={() => toggleSelectDocument(doc.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="mr-3">{getFileIcon(doc.tip)}</div>
                          <div className="text-sm font-medium text-gray-900">
                            {doc.nume}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {doc.tip}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {doc.furnizor}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {new Date(doc.data).toLocaleDateString("ro-RO")} •{" "}
                          {doc.ora}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {doc.dimensiune}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(doc.status)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                              doc.status
                            )}`}
                          >
                            {doc.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handlePreview(doc)}
                            className="p-1 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                            title="Prevăzualizează"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEdit(doc)}
                            className="p-1 hover:bg-orange-50 hover:text-orange-600 rounded-lg transition-colors"
                            title="Editează"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDownload(doc)}
                            className="p-1 hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                            title="Descarcă"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(doc)}
                            className="p-1 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                            title="Șterge"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  Încarcă Documente
                </h2>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <CloudUpload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Trage fișierele aici sau
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  Acceptăm PDF, JPG, PNG, XLSX până la 10MB
                </p>
                <label className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 mr-2" />
                  Selectează Fișiere
                  <input
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                    accept=".pdf,.jpg,.jpeg,.png,.xlsx,.xls"
                  />
                </label>
              </div>

              {/* Upload Progress */}
              {uploadingFiles.length > 0 && (
                <div className="mt-6 space-y-3">
                  <h4 className="font-semibold text-gray-900">
                    Încărcare fișiere:
                  </h4>
                  {uploadingFiles.map((file, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center">
                          <File className="w-5 h-5 text-gray-600 mr-3" />
                          <span className="text-sm font-medium text-gray-900">
                            {file.name}
                          </span>
                          <span className="ml-2 text-xs text-gray-500">
                            {file.size}
                          </span>
                        </div>
                        {file.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <span className="text-xs text-gray-500">
                            {file.progress}%
                          </span>
                        )}
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full transition-all duration-300 ${
                            file.status === "completed"
                              ? "bg-green-500"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${file.progress}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Form Fields */}
              <div className="mt-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Furnizor
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Numele furnizorului"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie
                  </label>
                  <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>Factură</option>
                    <option>Contract</option>
                    <option>Aviz</option>
                    <option>Chitanță</option>
                    <option>Altele</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observații
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Observații opționale..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Anulează
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Încarcă în S3
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedDocumente.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
          <span className="text-sm text-gray-600">
            {selectedDocumente.length} selectate
          </span>
          <button 
            onClick={handleBulkDownload}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Descarcă
          </button>
          <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
            Procesează
          </button>
          <button 
            onClick={handleBulkDelete}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Șterge
          </button>
          <button
            onClick={() => setSelectedDocumente([])}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && previewDocument && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[80vh] flex flex-col">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Previzualizare Document
                </h3>
                <p className="text-sm text-gray-600 mt-1">{previewDocument.nume}</p>
              </div>
              <button
                onClick={() => setShowPreviewModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="flex-1 p-6">
              {previewDocument.tip === 'PDF' ? (
                <iframe
                  src={previewDocument.s3Url}
                  className="w-full h-full border border-gray-200 rounded-lg"
                  title="Document Preview"
                />
              ) : previewDocument.tip && ['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'].includes(previewDocument.tip.toUpperCase()) ? (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <img
                    src={previewDocument.s3Url}
                    alt={previewDocument.nume}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-sm"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <File className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-2">Previzualizarea nu este disponibilă pentru acest tip de fișier</p>
                    <p className="text-sm text-gray-500">Tip: {previewDocument.tip} • Dimensiune: {previewDocument.dimensiune}</p>
                    <button
                      onClick={() => handleDownload(previewDocument)}
                      className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Descarcă fișierul
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>Dimensiune: {previewDocument.dimensiune}</span>
                <span>Data: {previewDocument.data}</span>
                <span>Ora: {previewDocument.ora}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleDownload(previewDocument)}
                  className="inline-flex items-center px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Descarcă
                </button>
                <button
                  onClick={() => {
                    setShowPreviewModal(false);
                    handleDelete(previewDocument);
                  }}
                  className="inline-flex items-center px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Șterge
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && documentToEdit && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Editează Document
                </h3>
                <p className="text-sm text-gray-600 mt-1">{documentToEdit.nume}</p>
              </div>
              <button
                onClick={() => setShowEditModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nume Document
                </label>
                <input
                  type="text"
                  value={editFormData.original_name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, original_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nume document"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Furnizor
                  </label>
                  <select
                    value={editFormData.supplier_id}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, supplier_id: e.target.value }))}
                    disabled={loadingDropdownData}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50"
                  >
                    <option value="">{loadingDropdownData ? 'Se încarcă...' : 'Selectează furnizor (opțional)'}</option>
                    {availableSuppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.nume} - {supplier.cui || 'Fără CUI'}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Selectează pentru a lega de furnizor</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document
                  </label>
                  <select
                    value={editFormData.document_id}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, document_id: e.target.value }))}
                    disabled={loadingDropdownData}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white disabled:opacity-50"
                  >
                    <option value="">{loadingDropdownData ? 'Se încarcă...' : 'Selectează document (opțional)'}</option>
                    {availableDocuments.map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.tip_document?.toUpperCase()} #{doc.numar_document} - {doc.client_nume}
                      </option>
                    ))}
                  </select>
                  <p className="text-xs text-gray-500 mt-1">Selectează pentru a lega de document</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observații
                </label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, notes: e.target.value }))}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  placeholder="Observații despre document..."
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <p>Tip: {documentToEdit.tip} • Dimensiune: {documentToEdit.dimensiune}</p>
                <p>Creat: {documentToEdit.data} la {documentToEdit.ora}</p>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Anulează
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Salvează Modificările
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && documentToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mx-auto mb-4">
                <Trash2 className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 text-center mb-2">
                Confirmă ștergerea
              </h3>
              <p className="text-gray-600 text-center mb-6">
                Ești sigur că vrei să ștergi documentul "<strong>{documentToDelete.nume}</strong>"? 
                Această acțiune nu poate fi anulată.
              </p>
              <div className="flex items-center justify-center space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Anulează
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Șterge definitiv
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumenteIntrare;
