import React, { useState } from "react";
import {
  FileText,
  Plus,
  Search,
  RefreshCw,
  Filter,
  Download,
  Edit,
  Eye,
  Trash2,
  MoreVertical,
  X,
  File,
  Copy,
  Share,
  Star,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Grid3X3,
  List,
  Calendar,
  Building,
  Users,
  Briefcase,
  Receipt,
  BookOpen,
  Layers,
  Tag,
  Activity,
  TrendingUp,
  Zap,
  Award,
  Shield,
} from "lucide-react";

const GestiuneSabloane = () => {
  const [sabloane, setSabloane] = useState([
    {
      id: 1,
      nume: "Contract de Muncă Standard",
      tip: "Contract Muncă",
      categorie: "Resurse Umane",
      descriere: "Template standard pentru contracte de muncă cu durată nedeterminată",
      autor: "Vasile Elena",
      dataCreare: "2024-01-15",
      dataModificare: "2025-08-20",
      versiune: "2.1",
      status: "activ",
      utilizari: 45,
      rating: 5,
      campuriPersonalizabile: [
        "nume_angajat", "functie", "salariu", "data_inceput", 
        "program_lucru", "departament", "manager_direct"
      ],
      dimensiune: "24 KB",
      format: "DOCX",
      estePublic: true,
      aprobare: "aprobat",
      tags: ["contract", "angajat", "standard", "hr"],
      ultimaUtilizare: "2025-08-22",
    },
    {
      id: 2,
      nume: "Factură Prestări Servicii",
      tip: "Factură",
      categorie: "Financiar",
      descriere: "Model de factură pentru prestări de servicii cu TVA",
      autor: "Georgescu Andrei", 
      dataCreare: "2024-02-10",
      dataModificare: "2025-08-18",
      versiune: "1.8",
      status: "activ",
      utilizari: 128,
      rating: 5,
      campuriPersonalizabile: [
        "client_nume", "client_adresa", "client_cui", "servicii",
        "valoare_neta", "tva", "total", "data_scadenta", "numar_factura"
      ],
      dimensiune: "18 KB",
      format: "PDF",
      estePublic: true,
      aprobare: "aprobat",
      tags: ["factură", "servicii", "tva", "financiar"],
      ultimaUtilizare: "2025-08-23",
    },
    {
      id: 3,
      nume: "Acord de Confidențialitate",
      tip: "Acord Legal",
      categorie: "Juridic",
      descriere: "Template pentru acorduri de confidențialitate (NDA) cu partenerii",
      autor: "Mihăilescu Cristian",
      dataCreare: "2024-03-05",
      dataModificare: "2025-07-30",
      versiune: "1.3",
      status: "draft",
      utilizari: 23,
      rating: 4,
      campuriPersonalizabile: [
        "partea_1", "partea_2", "obiectul_confidential", "durata_acord",
        "penalitati", "data_semnare", "reprezentanti_legali"
      ],
      dimensiune: "32 KB",
      format: "DOCX",
      estePublic: false,
      aprobare: "in_asteptare",
      tags: ["nda", "confidentialitate", "legal", "parteneri"],
      ultimaUtilizare: "2025-08-10",
    },
    {
      id: 4,
      nume: "Ofertă de Preț",
      tip: "Ofertă Comercială",
      categorie: "Vânzări",
      descriere: "Model profesional pentru oferte comerciale către potențiali clienți",
      autor: "Radu Alexandra",
      dataCreare: "2024-04-12",
      dataModificare: "2025-08-15",
      versiune: "2.0",
      status: "activ",
      utilizari: 67,
      rating: 4,
      campuriPersonalizabile: [
        "client_nume", "proiect_descriere", "servicii_lista", "preturi",
        "conditii_plata", "termen_valabilitate", "persoana_contact"
      ],
      dimensiune: "28 KB",
      format: "PDF",
      estePublic: true,
      aprobare: "aprobat",
      tags: ["ofertă", "comercial", "preț", "client"],
      ultimaUtilizare: "2025-08-21",
    },
    {
      id: 5,
      nume: "Proces Verbal Ședință",
      tip: "Document Intern",
      categorie: "Management",
      descriere: "Template pentru procese verbale ale ședințelor de echipă",
      autor: "Popescu Ion",
      dataCreare: "2024-05-20",
      dataModificare: "2025-08-12",
      versiune: "1.2",
      status: "activ",
      utilizari: 34,
      rating: 3,
      campuriPersonalizabile: [
        "data_sedinta", "participanti", "ordine_zi", "decizii",
        "responsabili", "termene", "urmatoarea_sedinta"
      ],
      dimensiune: "15 KB",
      format: "DOCX",
      estePublic: false,
      aprobare: "aprobat",
      tags: ["ședință", "proces verbal", "management", "echipă"],
      ultimaUtilizare: "2025-08-19",
    },
    {
      id: 6,
      nume: "Contract de Prestări Servicii",
      tip: "Contract Servicii",
      categorie: "Comercial",
      descriere: "Template pentru contracte de prestări servicii cu clienții",
      autor: "Ionescu Maria",
      dataCreare: "2024-06-08",
      dataModificare: "2025-08-05",
      versiune: "1.5",
      status: "inactiv",
      utilizari: 89,
      rating: 5,
      campuriPersonalizabile: [
        "prestator", "beneficiar", "servicii_detalii", "valoare_contract",
        "modalitate_plata", "termene_executie", "penalitati", "clauze_speciale"
      ],
      dimensiune: "45 KB",
      format: "DOCX",
      estePublic: true,
      aprobare: "aprobat",
      tags: ["contract", "servicii", "comercial", "client"],
      ultimaUtilizare: "2025-07-28",
    },
  ]);

  const [viewMode, setViewMode] = useState("grid");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedSabloane, setSelectedSabloane] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("toate");
  const [filterCategorie, setFilterCategorie] = useState("toate");
  const [filterTip, setFilterTip] = useState("toate");
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "activ":
        return "bg-green-100 text-green-700";
      case "draft":
        return "bg-yellow-100 text-white";
      case "inactiv":
        return "bg-gray-100 text-gray-700";
      case "arhivat":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "activ":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "draft":
        return <Clock className="w-4 h-4 text-white" />;
      case "inactiv":
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
      case "arhivat":
        return <X className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getTipIcon = (tip) => {
    switch (tip) {
      case "Contract Muncă":
        return <Users className="w-5 h-5 text-blue-500" />;
      case "Factură":
        return <Receipt className="w-5 h-5 text-green-500" />;
      case "Acord Legal":
        return <Shield className="w-5 h-5 text-purple-500" />;
      case "Ofertă Comercială":
        return <TrendingUp className="w-5 h-5 text-orange-500" />;
      case "Document Intern":
        return <Building className="w-5 h-5 text-gray-500" />;
      case "Contract Servicii":
        return <Briefcase className="w-5 h-5 text-indigo-500" />;
      default:
        return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getAprobareColor = (aprobare) => {
    switch (aprobare) {
      case "aprobat":
        return "bg-green-100 text-green-700 border-green-200";
      case "in_asteptare":
        return "bg-yellow-100 text-white border-yellow-200";
      case "respins":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredSabloane = sabloane.filter((sablon) => {
    const matchesSearch =
      sablon.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sablon.tip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sablon.descriere.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sablon.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
      sablon.autor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "toate" || sablon.status === filterStatus;
    const matchesCategorie =
      filterCategorie === "toate" ||
      sablon.categorie.toLowerCase() === filterCategorie;
    const matchesTip =
      filterTip === "toate" || sablon.tip === filterTip;
    return matchesSearch && matchesStatus && matchesCategorie && matchesTip;
  });

  const toggleSelectAll = () => {
    if (selectedSabloane.length === filteredSabloane.length) {
      setSelectedSabloane([]);
    } else {
      setSelectedSabloane(filteredSabloane.map((s) => s.id));
    }
  };

  const toggleSelectTemplate = (id) => {
    if (selectedSabloane.includes(id)) {
      setSelectedSabloane(selectedSabloane.filter((sId) => sId !== id));
    } else {
      setSelectedSabloane([...selectedSabloane, id]);
    }
  };

  const getCategorii = () => {
    const categorii = [...new Set(sabloane.map((s) => s.categorie))];
    return categorii;
  };

  const getTipuri = () => {
    const tipuri = [...new Set(sabloane.map((s) => s.tip))];
    return tipuri;
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-4 h-4 ${
          index < rating
            ? "text-white fill-current"
            : "text-gray-300"
        }`}
      />
    ));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ro-RO");
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="page-title">
              Gestiune Șabloane
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administrează modelele de documente, contracte și formulare
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button 
              onClick={() => setShowTemplateModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Șablon Nou
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
                <Grid3X3 className="w-5 h-5" />
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
              onClick={() => setShowAdvancedSearch(!showAdvancedSearch)}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
              <Filter className="w-5 h-5 mr-2" />
              Filtre
            </button>
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
                placeholder="Caută după nume șablon, tip, autor sau tags..."
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
              <option value="activ">Activ</option>
              <option value="draft">Draft</option>
              <option value="inactiv">Inactiv</option>
              <option value="arhivat">Arhivat</option>
            </select>
          </div>

          {/* Advanced Search Panel */}
          {showAdvancedSearch && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie
                  </label>
                  <select
                    value={filterCategorie}
                    onChange={(e) => setFilterCategorie(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="toate">Toate categoriile</option>
                    {getCategorii().map((cat) => (
                      <option key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tip Document
                  </label>
                  <select
                    value={filterTip}
                    onChange={(e) => setFilterTip(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="toate">Toate tipurile</option>
                    {getTipuri().map((tip) => (
                      <option key={tip} value={tip}>
                        {tip}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Autor
                  </label>
                  <input
                    type="text"
                    placeholder="Numele autorului"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Utilizări
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Min"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="number"
                      placeholder="Max"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setFilterStatus("toate");
                    setFilterCategorie("toate");
                    setFilterTip("toate");
                    setSearchTerm("");
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Resetează
                </button>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  Aplică Filtre
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Șabloane</p>
                <p className="page-title">
                  {sabloane.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <FileText className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active</p>
                <p className="page-title">
                  {sabloane.filter((s) => s.status === "activ").length}
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
                <p className="text-sm text-gray-600">Utilizări Total</p>
                <p className="page-title">
                  {sabloane.reduce((sum, s) => sum + s.utilizari, 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Categorii</p>
                <p className="page-title">
                  {getCategorii().length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <Layers className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredSabloane.map((sablon) => (
              <div
                key={sablon.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
                        {getTipIcon(sablon.tip)}
                      </div>
                      <div className="ml-3">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          v{sablon.versiune}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedSabloane.includes(sablon.id)}
                      onChange={() => toggleSelectTemplate(sablon.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 text-lg">
                    {sablon.nume}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {sablon.descriere}
                  </p>

                  <div className="flex items-center mb-3">
                    <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-lg">
                      {sablon.tip}
                    </span>
                    <span className="ml-2 text-xs text-gray-500">
                      • {sablon.categorie}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Utilizări:</span>
                      <span className="font-medium text-gray-900">
                        {sablon.utilizari}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Autor:</span>
                      <span className="font-medium text-gray-900">
                        {sablon.autor}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Modificat:</span>
                      <span className="text-gray-500">
                        {formatDate(sablon.dataModificare)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Rating:</span>
                      <div className="flex items-center">
                        {getRatingStars(sablon.rating)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(sablon.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                          sablon.status
                        )}`}
                      >
                        {sablon.status}
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <File className="w-3 h-3 mr-1" />
                      {sablon.format} • {sablon.dimensiune}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {sablon.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                    {sablon.tags.length > 3 && (
                      <span className="px-2 py-1 text-xs text-gray-500">
                        +{sablon.tags.length - 3}
                      </span>
                    )}
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <button 
                      onClick={() => {
                        setSelectedTemplate(sablon);
                        setShowPreviewModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => {
                        setSelectedTemplate(sablon);
                        setShowTemplateModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Copy className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Share className="w-4 h-4 text-gray-600" />
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
                        checked={selectedSabloane.length === filteredSabloane.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Șablon
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Tip
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Autor
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Utilizări
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Modificat
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSabloane.map((sablon) => (
                    <tr
                      key={sablon.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedSabloane.includes(sablon.id)}
                          onChange={() => toggleSelectTemplate(sablon.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center mr-3">
                            {getTipIcon(sablon.tip)}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {sablon.nume}
                            </div>
                            <div className="text-sm text-gray-500">
                              v{sablon.versiune} • {sablon.format}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{sablon.tip}</div>
                        <div className="text-sm text-gray-500">
                          {sablon.categorie}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{sablon.autor}</div>
                        <div className="text-sm text-gray-500">
                          {getRatingStars(sablon.rating)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {sablon.utilizari}
                        </div>
                        <div className="text-sm text-gray-500">
                          {formatDate(sablon.ultimaUtilizare)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(sablon.status)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                              sablon.status
                            )}`}
                          >
                            {sablon.status}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(sablon.dataModificare)}
                        </div>
                        <div className="text-sm text-gray-500">
                          {sablon.dimensiune}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Copy className="w-4 h-4 text-gray-600" />
                          </button>
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Download className="w-4 h-4 text-gray-600" />
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

      {/* Bulk Actions */}
      {selectedSabloane.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
          <span className="text-sm text-gray-600">
            {selectedSabloane.length} selectate
          </span>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Exportă
          </button>
          <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
            Activează
          </button>
          <button className="px-3 py-1 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            Duplică
          </button>
          <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
            Arhivează
          </button>
          <button
            onClick={() => setSelectedSabloane([])}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Template Modal */}
      {showTemplateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedTemplate ? "Editare Șablon" : "Șablon Nou"}
                </h2>
                <button
                  onClick={() => {
                    setShowTemplateModal(false);
                    setSelectedTemplate(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Form Section */}
                <div className="lg:col-span-2 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Nume Șablon
                      </label>
                      <input
                        type="text"
                        defaultValue={selectedTemplate?.nume || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Numele șablonului"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tip Document
                      </label>
                      <select
                        defaultValue={selectedTemplate?.tip || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selectează tipul</option>
                        {getTipuri().map((tip) => (
                          <option key={tip} value={tip}>
                            {tip}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Categorie
                      </label>
                      <select
                        defaultValue={selectedTemplate?.categorie || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Selectează categoria</option>
                        {getCategorii().map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Format
                      </label>
                      <select
                        defaultValue={selectedTemplate?.format || "DOCX"}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="DOCX">DOCX</option>
                        <option value="PDF">PDF</option>
                        <option value="HTML">HTML</option>
                        <option value="TXT">TXT</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Descriere
                    </label>
                    <textarea
                      rows="3"
                      defaultValue={selectedTemplate?.descriere || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Descrierea șablonului..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tags (separate prin virgulă)
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedTemplate?.tags?.join(", ") || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="contract, legal, standard..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Câmpuri Personalizabile
                    </label>
                    <div className="space-y-2">
                      {selectedTemplate?.campuriPersonalizabile?.map((camp, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <input
                            type="text"
                            defaultValue={camp}
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="nume_camp"
                          />
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )) || (
                        <div className="flex items-center gap-2">
                          <input
                            type="text"
                            className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="nume_camp"
                          />
                          <button className="p-2 text-red-600 hover:bg-red-50 rounded-lg">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      <button className="text-blue-600 text-sm hover:text-blue-800">
                        + Adaugă câmp
                      </button>
                    </div>
                  </div>
                </div>

                {/* Settings Section */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Setări Șablon
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          defaultValue={selectedTemplate?.status || "draft"}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="draft">Draft</option>
                          <option value="activ">Activ</option>
                          <option value="inactiv">Inactiv</option>
                        </select>
                      </div>

                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          defaultChecked={selectedTemplate?.estePublic || false}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label className="ml-2 text-sm text-gray-700">
                          Șablon public
                        </label>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Versiune
                        </label>
                        <input
                          type="text"
                          defaultValue={selectedTemplate?.versiune || "1.0"}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1.0"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Preview Document
                    </h4>
                    <div className="bg-white rounded border-2 border-dashed border-gray-300 p-4 text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-500">
                        Încarcă un fișier șablon sau
                      </p>
                      <button className="text-blue-600 text-sm hover:text-blue-800">
                        creează unul nou
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowTemplateModal(false);
                  setSelectedTemplate(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Anulează
              </button>
              <button className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors">
                Salvează ca Draft
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                {selectedTemplate ? "Actualizează" : "Creează Șablon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreviewModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {selectedTemplate.nume}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {selectedTemplate.tip} • v{selectedTemplate.versiune}
                  </p>
                </div>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Informații Șablon
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Descriere:</span>
                      <p className="text-sm text-gray-900">{selectedTemplate.descriere}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Autor:</span>
                      <p className="text-sm text-gray-900">{selectedTemplate.autor}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Utilizări:</span>
                      <p className="text-sm text-gray-900">{selectedTemplate.utilizari}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Tags:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedTemplate.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-lg"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    Câmpuri Personalizabile
                  </h3>
                  <div className="space-y-2">
                    {selectedTemplate.campuriPersonalizabile.map((camp, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <span className="text-sm font-mono text-gray-700">
                          {`{${camp}}`}
                        </span>
                        <input
                          type="text"
                          placeholder="Valoare..."
                          className="text-sm px-2 py-1 border border-gray-200 rounded"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Preview Document
                </h3>
                <div className="bg-gray-50 rounded-lg p-6 border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">
                      Previzualizarea documentului va apărea aici
                    </p>
                    <div className="flex justify-center gap-3">
                      <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                        Generează Document
                      </button>
                      <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">
                        Download Template
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestiuneSabloane;