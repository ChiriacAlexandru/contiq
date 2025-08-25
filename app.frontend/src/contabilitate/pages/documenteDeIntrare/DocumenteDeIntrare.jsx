import React, { useState } from "react";
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
} from "lucide-react";

const DocumenteIntrare = () => {
  const [documente, setDocumente] = useState([
    {
      id: 1,
      nume: "Factura_Furnizor_001.pdf",
      tip: "PDF",
      dimensiune: "2.4 MB",
      data: "2025-08-24",
      ora: "14:30",
      furnizor: "SC Tech Supplies SRL",
      status: "procesat",
      s3Url: "https://s3.amazonaws.com/bucket/doc1.pdf",
      thumbnail: null,
    },
    {
      id: 2,
      nume: "Contract_Servicii_2025.pdf",
      tip: "PDF",
      dimensiune: "1.8 MB",
      data: "2025-08-23",
      ora: "10:15",
      furnizor: "Digital Services SRL",
      status: "în procesare",
      s3Url: "https://s3.amazonaws.com/bucket/doc2.pdf",
      thumbnail: null,
    },
    {
      id: 3,
      nume: "Aviz_Marfa_August.jpg",
      tip: "JPG",
      dimensiune: "856 KB",
      data: "2025-08-22",
      ora: "16:45",
      furnizor: "Logistics Partner SRL",
      status: "procesat",
      s3Url: "https://s3.amazonaws.com/bucket/doc3.jpg",
      thumbnail: "https://via.placeholder.com/150",
    },
    {
      id: 4,
      nume: "Nota_Contabila_Q3.xlsx",
      tip: "XLSX",
      dimensiune: "524 KB",
      data: "2025-08-21",
      ora: "09:20",
      furnizor: "Contabil Expert SRL",
      status: "eroare",
      s3Url: "https://s3.amazonaws.com/bucket/doc4.xlsx",
      thumbnail: null,
    },
    {
      id: 5,
      nume: "Chitanta_Plata_153.pdf",
      tip: "PDF",
      dimensiune: "312 KB",
      data: "2025-08-20",
      ora: "11:30",
      furnizor: "Utility Provider SA",
      status: "procesat",
      s3Url: "https://s3.amazonaws.com/bucket/doc5.pdf",
      thumbnail: null,
    },
  ]);

  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedDocumente, setSelectedDocumente] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("toate");
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFiles, setUploadingFiles] = useState([]);

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

  const handleFiles = (files) => {
    const newFiles = Array.from(files).map((file) => ({
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + " MB",
      progress: 0,
      status: "uploading",
    }));

    setUploadingFiles(newFiles);

    // Simulate upload progress
    newFiles.forEach((file, index) => {
      const interval = setInterval(() => {
        setUploadingFiles((prev) => {
          const updated = [...prev];
          if (updated[index].progress < 100) {
            updated[index].progress += 10;
          } else {
            updated[index].status = "completed";
            clearInterval(interval);
          }
          return updated;
        });
      }, 200);
    });
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
            <h1 className="page-title">
              Documente de Intrare
            </h1>
            <p className="mt-1 body-small">
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
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
              <RefreshCw className="w-5 h-5 mr-2" />
              Actualizare
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
                <p className="body-small">Total Documente</p>
                <p className="section-title">
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
                <p className="body-small">Procesate</p>
                <p className="section-title">
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
                <p className="body-small">În Procesare</p>
                <p className="section-title">
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
                <p className="body-small">Spațiu S3</p>
                <p className="section-title">12.5 GB</p>
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
                      <span className="ml-2 px-2 py-1 status-text bg-gray-100 text-gray-700 rounded-lg">
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
                  <p className="body-small mb-3 truncate">
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
                        className={`ml-2 px-2 py-1 status-text rounded-lg ${getStatusColor(
                          doc.status
                        )}`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Download className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Trash2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <MoreVertical className="w-4 h-4 text-gray-600" />
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
                    <th className="px-6 py-4 text-left meta-text uppercase tracking-wider">
                      Nume Document
                    </th>
                    <th className="px-6 py-4 text-left meta-text uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-4 text-left meta-text uppercase tracking-wider">
                      Furnizor
                    </th>
                    <th className="px-6 py-4 text-left meta-text uppercase tracking-wider">
                      Data
                    </th>
                    <th className="px-6 py-4 text-left meta-text uppercase tracking-wider">
                      Dimensiune
                    </th>
                    <th className="px-6 py-4 text-left meta-text uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left meta-text uppercase tracking-wider">
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
                          <div className="btn-text-normal text-gray-900">
                            {doc.nume}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 status-text bg-gray-100 text-gray-700 rounded-lg">
                          {doc.tip}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="body-small text-gray-900">
                          {doc.furnizor}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="body-small">
                          {new Date(doc.data).toLocaleDateString("ro-RO")} •{" "}
                          {doc.ora}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="body-small">
                          {doc.dimensiune}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(doc.status)}
                          <span
                            className={`ml-2 px-2 py-1 status-text rounded-lg ${getStatusColor(
                              doc.status
                            )}`}
                          >
                            {doc.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Trash2 className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <MoreVertical className="w-4 h-4 text-gray-600" />
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
                <h2 className="section-title">
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
                <h3 className="card-title mb-2">
                  Trage fișierele aici sau
                </h3>
                <p className="body-small mb-4">
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
                          <span className="btn-text-normal text-gray-900">
                            {file.name}
                          </span>
                          <span className="ml-2 body-xs text-muted">
                            {file.size}
                          </span>
                        </div>
                        {file.status === "completed" ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <span className="body-xs">
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
                  <label className="block form-label mb-1">
                    Furnizor
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Numele furnizorului"
                  />
                </div>
                <div>
                  <label className="block form-label mb-1">
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
                  <label className="block form-label mb-1">
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
          <span className="body-small">
            {selectedDocumente.length} selectate
          </span>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Descarcă
          </button>
          <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
            Procesează
          </button>
          <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
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
    </div>
  );
};

export default DocumenteIntrare;
