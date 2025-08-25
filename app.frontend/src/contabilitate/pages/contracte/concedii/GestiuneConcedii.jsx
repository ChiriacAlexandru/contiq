import React, { useState } from "react";
import {
  Calendar,
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
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  XCircle,
  CalendarDays,
  Plane,
  Heart,
  Users,
  MapPin,
  Grid3X3,
  List,
  FileText,
  Activity,
  TrendingUp,
  Briefcase,
  Coffee,
  Hospital,
} from "lucide-react";

const GestiuneConcedii = () => {
  const [concedii, setConcedii] = useState([
    {
      id: 1,
      angajat: "Popescu Ion",
      tip: "Concediu de odihnă",
      dataInceput: "2025-09-01",
      dataSfarsit: "2025-09-15",
      numarZile: 15,
      motiv: "Vacanță de vară cu familia",
      status: "aprobat",
      dataCreare: "2025-08-01",
      aprobatDe: "Mihăilescu Cristian",
      inlocuitor: "Ionescu Maria",
      departament: "IT",
      observatii: "Proiecte predate înaintea plecării",
      contact: "Disponibil în caz de urgență",
      prioritate: "normala",
      zileConcediuRamase: 8,
    },
    {
      id: 2,
      angajat: "Ionescu Maria",
      tip: "Concediu medical",
      dataInceput: "2025-08-25",
      dataSfarsit: "2025-08-29",
      numarZile: 5,
      motiv: "Tratament medical programat",
      status: "in_curs",
      dataCreare: "2025-08-20",
      aprobatDe: "Mihăilescu Cristian",
      inlocuitor: "Georgescu Andrei",
      departament: "Design",
      observatii: "Adeverință medicală anexată",
      contact: "Nu este disponibilă",
      prioritate: "urgenta",
      zileConcediuRamase: 12,
    },
    {
      id: 3,
      angajat: "Georgescu Andrei",
      tip: "Concediu de odihnă",
      dataInceput: "2025-09-20",
      dataSfarsit: "2025-09-27",
      numarZile: 8,
      motiv: "Excursie în străinătate",
      status: "in_asteptare",
      dataCreare: "2025-08-22",
      aprobatDe: null,
      inlocuitor: "Radu Alexandra",
      departament: "Financiar",
      observatii: "Așteaptă aprobare finală",
      contact: "Email disponibil",
      prioritate: "normala",
      zileConcediuRamase: 15,
    },
    {
      id: 4,
      angajat: "Radu Alexandra",
      tip: "Concediu maternal",
      dataInceput: "2025-10-01",
      dataSfarsit: "2026-01-31",
      numarZile: 120,
      motiv: "Naștere și îngrijirea copilului",
      status: "aprobat",
      dataCreare: "2025-07-15",
      aprobatDe: "Vasile Elena",
      inlocuitor: "Popescu Ion",
      departament: "Marketing",
      observatii: "Certificat medical și acte legale completate",
      contact: "Disponibilă pentru consultări",
      prioritate: "urgenta",
      zileConcediuRamase: 0,
    },
    {
      id: 5,
      angajat: "Vasile Elena",
      tip: "Concediu de odihnă",
      dataInceput: "2025-08-15",
      dataSfarsit: "2025-08-20",
      numarZile: 6,
      motiv: "Weekend prelungit cu familia",
      status: "respins",
      dataCreare: "2025-08-10",
      aprobatDe: null,
      inlocuitor: null,
      departament: "Resurse Umane",
      observatii: "Respins din cauza suprapunerii cu alte concedii",
      contact: "La birou conform programului",
      prioritate: "normala",
      zileConcediuRamase: 20,
    },
    {
      id: 6,
      angajat: "Mihăilescu Cristian",
      tip: "Concediu fără plată",
      dataInceput: "2025-11-15",
      dataSfarsit: "2025-11-22",
      numarZile: 8,
      motiv: "Studii de perfecționare",
      status: "aprobat",
      dataCreare: "2025-08-01",
      aprobatDe: "Vasile Elena",
      inlocuitor: "Popescu Ion",
      departament: "Management",
      observatii: "Curs de management avansat",
      contact: "Parțial disponibil telefonic",
      prioritate: "normala",
      zileConcediuRamase: 18,
    },
  ]);

  const [viewMode, setViewMode] = useState("grid");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedConcedii, setSelectedConcedii] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("toate");
  const [filterTip, setFilterTip] = useState("toate");
  const [filterDepartament, setFilterDepartament] = useState("toate");
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "aprobat":
        return "bg-green-100 text-green-700";
      case "in_curs":
        return "bg-blue-100 text-blue-700";
      case "in_asteptare":
        return "bg-yellow-100 text-white";
      case "respins":
        return "bg-red-100 text-red-700";
      case "anulat":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "aprobat":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "in_curs":
        return <Activity className="w-4 h-4 text-blue-600" />;
      case "in_asteptare":
        return <Clock className="w-4 h-4 text-white" />;
      case "respins":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "anulat":
        return <X className="w-4 h-4 text-gray-600" />;
      default:
        return null;
    }
  };

  const getTipIcon = (tip) => {
    switch (tip) {
      case "Concediu de odihnă":
        return <Plane className="w-5 h-5 text-blue-500" />;
      case "Concediu medical":
        return <Hospital className="w-5 h-5 text-red-500" />;
      case "Concediu maternal":
        return <Heart className="w-5 h-5 text-pink-500" />;
      case "Concediu fără plată":
        return <Coffee className="w-5 h-5 text-orange-500" />;
      default:
        return <Calendar className="w-5 h-5 text-gray-500" />;
    }
  };

  const getPrioritateColor = (prioritate) => {
    switch (prioritate) {
      case "urgenta":
        return "bg-red-100 text-red-700 border-red-200";
      case "importanta":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "normala":
        return "bg-gray-100 text-gray-700 border-gray-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredConcedii = concedii.filter((concediu) => {
    const matchesSearch =
      concediu.angajat.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concediu.tip.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concediu.motiv.toLowerCase().includes(searchTerm.toLowerCase()) ||
      concediu.departament.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "toate" || concediu.status === filterStatus;
    const matchesTip =
      filterTip === "toate" || concediu.tip === filterTip;
    const matchesDepartament =
      filterDepartament === "toate" ||
      concediu.departament.toLowerCase() === filterDepartament;
    return matchesSearch && matchesStatus && matchesTip && matchesDepartament;
  });

  const toggleSelectAll = () => {
    if (selectedConcedii.length === filteredConcedii.length) {
      setSelectedConcedii([]);
    } else {
      setSelectedConcedii(filteredConcedii.map((c) => c.id));
    }
  };

  const toggleSelectLeave = (id) => {
    if (selectedConcedii.includes(id)) {
      setSelectedConcedii(selectedConcedii.filter((cId) => cId !== id));
    } else {
      setSelectedConcedii([...selectedConcedii, id]);
    }
  };

  const getTipuriConcediu = () => {
    const tipuri = [...new Set(concedii.map((c) => c.tip))];
    return tipuri;
  };

  const getDepartamente = () => {
    const departamente = [...new Set(concedii.map((c) => c.departament))];
    return departamente;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("ro-RO");
  };

  const calculateDaysLeft = (dataInceput, dataSfarsit) => {
    const start = new Date(dataInceput);
    const end = new Date(dataSfarsit);
    const today = new Date();
    
    if (today < start) {
      return Math.ceil((start - today) / (1000 * 60 * 60 * 24));
    } else if (today >= start && today <= end) {
      return Math.ceil((end - today) / (1000 * 60 * 60 * 24));
    } else {
      return 0;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Gestiune Concedii
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administrează cererile și perioadele de concediu ale angajaților
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button 
              onClick={() => setShowLeaveModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Cerere Concediu
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
                placeholder="Caută după angajat, tip concediu, motiv sau departament..."
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
              <option value="aprobat">Aprobat</option>
              <option value="in_curs">În curs</option>
              <option value="in_asteptare">În așteptare</option>
              <option value="respins">Respins</option>
              <option value="anulat">Anulat</option>
            </select>
          </div>

          {/* Advanced Search Panel */}
          {showAdvancedSearch && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Tip Concediu
                  </label>
                  <select
                    value={filterTip}
                    onChange={(e) => setFilterTip(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="toate">Toate tipurile</option>
                    {getTipuriConcediu().map((tip) => (
                      <option key={tip} value={tip}>
                        {tip}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Departament
                  </label>
                  <select
                    value={filterDepartament}
                    onChange={(e) => setFilterDepartament(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="toate">Toate departamentele</option>
                    {getDepartamente().map((dept) => (
                      <option key={dept} value={dept.toLowerCase()}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Perioada
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="date"
                      className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Nr. Zile
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
                    setFilterTip("toate");
                    setFilterDepartament("toate");
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
                <p className="text-sm text-gray-600">Total Cereri</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {concedii.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Calendar className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Aprobate</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {concedii.filter((c) => c.status === "aprobat").length}
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
                <p className="text-sm text-gray-600">În Așteptare</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {concedii.filter((c) => c.status === "in_asteptare").length}
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
                <p className="text-sm text-gray-600">Zile Total</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {concedii.reduce((sum, c) => sum + c.numarZile, 0)}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <CalendarDays className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredConcedii.map((concediu) => (
              <div
                key={concediu.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900 mb-3">
                          {concediu.angajat}
                        </h3>
                        <p className="text-sm text-gray-600">{concediu.departament}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedConcedii.includes(concediu.id)}
                      onChange={() => toggleSelectLeave(concediu.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="flex items-center mb-3">
                    {getTipIcon(concediu.tip)}
                    <span className="ml-2 font-medium text-gray-900">
                      {concediu.tip}
                    </span>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Perioada:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatDate(concediu.dataInceput)} - {formatDate(concediu.dataSfarsit)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Zile:</span>
                      <span className="text-lg font-semibold text-gray-900 mb-3">
                        {concediu.numarZile}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Înlocuitor:</span>
                      <span className="text-sm font-medium text-gray-900">
                        {concediu.inlocuitor || "Neasignat"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Zile rămase:</span>
                      <span className={`text-sm font-medium ${
                        concediu.zileConcediuRamase <= 5 ? "text-red-600" : "text-green-600"
                      }`}>
                        {concediu.zileConcediuRamase}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {concediu.motiv}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(concediu.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                          concediu.status
                        )}`}
                      >
                        {concediu.status.replace('_', ' ')}
                      </span>
                    </div>
                    <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPrioritateColor(
                      concediu.prioritate
                    )}`}>
                      {concediu.prioritate}
                    </span>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <button 
                      onClick={() => {
                        setSelectedLeave(concediu);
                        setShowLeaveModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Calendar className="w-4 h-4 text-gray-600" />
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
                        checked={selectedConcedii.length === filteredConcedii.length}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 mb-1 block uppercase tracking-wider">
                      Angajat
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 mb-1 block uppercase tracking-wider">
                      Tip Concediu
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 mb-1 block uppercase tracking-wider">
                      Perioada
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 mb-1 block uppercase tracking-wider">
                      Zile
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 mb-1 block uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 mb-1 block uppercase tracking-wider">
                      Înlocuitor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-700 mb-1 block uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredConcedii.map((concediu) => (
                    <tr
                      key={concediu.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedConcedii.includes(concediu.id)}
                          onChange={() => toggleSelectLeave(concediu.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center mr-3">
                            <User className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {concediu.angajat}
                            </div>
                            <div className="text-sm text-gray-600 text-gray-500">
                              {concediu.departament}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getTipIcon(concediu.tip)}
                          <span className="ml-2 text-sm text-gray-900">
                            {concediu.tip}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {formatDate(concediu.dataInceput)}
                        </div>
                        <div className="text-sm text-gray-600 text-gray-500">
                          {formatDate(concediu.dataSfarsit)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {concediu.numarZile} zile
                        </div>
                        <div className={`text-sm ${
                          concediu.zileConcediuRamase <= 5 ? "text-red-600" : "text-gray-500"
                        }`}>
                          {concediu.zileConcediuRamase} rămase
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(concediu.status)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                              concediu.status
                            )}`}
                          >
                            {concediu.status.replace('_', ' ')}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {concediu.inlocuitor || "Neasignat"}
                        </div>
                        <div className="text-sm text-gray-600 text-gray-500">
                          {concediu.aprobatDe && `Aprobat: ${concediu.aprobatDe}`}
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
                            <Calendar className="w-4 h-4 text-gray-600" />
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

      {/* Bulk Actions */}
      {selectedConcedii.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
          <span className="text-sm text-gray-600">
            {selectedConcedii.length} selectate
          </span>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Exportă
          </button>
          <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
            Aprobare
          </button>
          <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
            Respinge
          </button>
          <button className="px-3 py-1 text-sm bg-gray-500 text-white rounded-lg hover:bg-gray-600">
            Anulează
          </button>
          <button
            onClick={() => setSelectedConcedii([])}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedLeave ? "Detalii Concediu" : "Cerere Nouă"}
                </h2>
                <button
                  onClick={() => {
                    setShowLeaveModal(false);
                    setSelectedLeave(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Angajat
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedLeave?.angajat || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Numele angajatului"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Tip Concediu
                    </label>
                    <select
                      defaultValue={selectedLeave?.tip || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Selectează tipul</option>
                      {getTipuriConcediu().map((tip) => (
                        <option key={tip} value={tip}>
                          {tip}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                        Data Început
                      </label>
                      <input
                        type="date"
                        defaultValue={selectedLeave?.dataInceput || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                        Data Sfârșit
                      </label>
                      <input
                        type="date"
                        defaultValue={selectedLeave?.dataSfarsit || ""}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Înlocuitor
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedLeave?.inlocuitor || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Numele înlocuitorului"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Număr Zile
                    </label>
                    <input
                      type="number"
                      defaultValue={selectedLeave?.numarZile || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Status
                    </label>
                    <select
                      defaultValue={selectedLeave?.status || "in_asteptare"}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="in_asteptare">În așteptare</option>
                      <option value="aprobat">Aprobat</option>
                      <option value="respins">Respins</option>
                      <option value="anulat">Anulat</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Prioritate
                    </label>
                    <select
                      defaultValue={selectedLeave?.prioritate || "normala"}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="normala">Normală</option>
                      <option value="importanta">Importantă</option>
                      <option value="urgenta">Urgentă</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Contact
                    </label>
                    <input
                      type="text"
                      defaultValue={selectedLeave?.contact || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Informații de contact"
                    />
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Motiv
                    </label>
                    <textarea
                      rows="3"
                      defaultValue={selectedLeave?.motiv || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Motivul pentru cererea de concediu..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                      Observații
                    </label>
                    <textarea
                      rows="2"
                      defaultValue={selectedLeave?.observatii || ""}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Observații suplimentare..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowLeaveModal(false);
                  setSelectedLeave(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Anulează
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                {selectedLeave ? "Actualizează" : "Creează Cererea"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestiuneConcedii;