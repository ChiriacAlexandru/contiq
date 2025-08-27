import React, { useState, useEffect } from "react";
import {
  Users,
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
  Mail,
  Phone,
  MapPin,
  Building,
  Calendar,
  TrendingUp,
  FileText,
  CreditCard,
  Star,
  Activity,
  User,
  Globe,
  Shield,
  ChevronDown,
  Check,
  AlertTriangle,
  CheckCircle,
  Clock,
  List,
  Grid3X3,
  Loader2,
} from "lucide-react";
import { ClientsService } from "../../../../config/api";

const GestiuneClienti = () => {
  // State management
  const [clienti, setClienti] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({});
  const [relatedData, setRelatedData] = useState({
    cities: [],
    counties: [],
    categories: [],
    sources: [],
    paymentTerms: [],
    clientTypes: [],
    statusOptions: [],
    paymentTermsOptions: []
  });
  
  // UI State
  const [viewMode, setViewMode] = useState("list");
  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedClienti, setSelectedClienti] = useState([]);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  
  // Filters
  const [filters, setFilters] = useState({
    search: "",
    tip_client: "",
    status: "",
    oras: "",
    judet: "",
    categorie: "",
    agent_vanzari: "",
    sortBy: "nume",
    sortOrder: "asc",
    limit: 50,
    offset: 0
  });

  // Form data for client modal
  const [formData, setFormData] = useState({
    nume: "",
    tip_client: "persoana_fizica",
    email: "",
    telefon: "",
    fax: "",
    website: "",
    adresa: "",
    oras: "",
    judet: "",
    cod_postal: "",
    tara: "Romania",
    cui: "",
    nr_reg_com: "",
    cont_bancar: "",
    banca: "",
    cnp: "",
    ci_serie: "",
    ci_numar: "",
    agent_vanzari: "",
    conditii_plata: "30_zile",
    limita_credit: "",
    discount_implicit: "",
    status: "activ",
    categorie: "",
    sursa: "",
    observatii: ""
  });

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, []);

  // Load clients when filters change
  useEffect(() => {
    if (!loading) {
      loadClients();
    }
  }, [filters]);

  const loadInitialData = async () => {
    try {
      setLoading(true);
      
      // Load all initial data in parallel
      const [clientsData, statsData, relatedData] = await Promise.all([
        ClientsService.getClients(filters),
        ClientsService.getStatistics(),
        ClientsService.getRelatedData()
      ]);

      setClienti(clientsData.clients || []);
      setStatistics(statsData || {});
      setRelatedData(relatedData || {
        cities: [],
        counties: [],
        categories: [],
        sources: [],
        paymentTerms: [],
        clientTypes: [],
        statusOptions: [],
        paymentTermsOptions: []
      });
      
    } catch (error) {
      console.error('Error loading initial data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadClients = async () => {
    try {
      const data = await ClientsService.getClients(filters);
      setClienti(data.clients || []);
    } catch (error) {
      console.error('Error loading clients:', error);
      setError(error.message);
    }
  };

  const refreshData = async () => {
    await loadInitialData();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: 0 // Reset pagination when filters change
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      tip_client: "",
      status: "",
      oras: "",
      judet: "",
      categorie: "",
      agent_vanzari: "",
      sortBy: "nume",
      sortOrder: "asc",
      limit: 50,
      offset: 0
    });
  };

  const openClientModal = (client = null) => {
    if (client) {
      setSelectedClient(client);
      setFormData({
        nume: client.nume || "",
        tip_client: client.tip_client || "persoana_fizica",
        email: client.email || "",
        telefon: client.telefon || "",
        fax: client.fax || "",
        website: client.website || "",
        adresa: client.adresa || "",
        oras: client.oras || "",
        judet: client.judet || "",
        cod_postal: client.cod_postal || "",
        tara: client.tara || "Romania",
        cui: client.cui || "",
        nr_reg_com: client.nr_reg_com || "",
        cont_bancar: client.cont_bancar || "",
        banca: client.banca || "",
        cnp: client.cnp || "",
        ci_serie: client.ci_serie || "",
        ci_numar: client.ci_numar || "",
        agent_vanzari: client.agent_vanzari || "",
        conditii_plata: client.conditii_plata || "30_zile",
        limita_credit: client.limita_credit || "",
        discount_implicit: client.discount_implicit || "",
        status: client.status || "activ",
        categorie: client.categorie || "",
        sursa: client.sursa || "",
        observatii: client.observatii || ""
      });
    } else {
      setSelectedClient(null);
      setFormData({
        nume: "",
        tip_client: "persoana_fizica",
        email: "",
        telefon: "",
        fax: "",
        website: "",
        adresa: "",
        oras: "",
        judet: "",
        cod_postal: "",
        tara: "Romania",
        cui: "",
        nr_reg_com: "",
        cont_bancar: "",
        banca: "",
        cnp: "",
        ci_serie: "",
        ci_numar: "",
        agent_vanzari: "",
        conditii_plata: "30_zile",
        limita_credit: "",
        discount_implicit: "",
        status: "activ",
        categorie: "",
        sursa: "",
        observatii: ""
      });
    }
    setShowClientModal(true);
  };

  const closeClientModal = () => {
    setShowClientModal(false);
    setSelectedClient(null);
    setFormData({});
  };

  const handleFormChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const saveClient = async () => {
    try {
      setIsModalLoading(true);
      
      // Transform form data - convert empty strings to null for optional fields
      const cleanedData = {
        ...formData,
        limita_credit: formData.limita_credit || null,
        discount_implicit: formData.discount_implicit || null,
        fax: formData.fax || null,
        website: formData.website || null,
        cod_postal: formData.cod_postal || null,
        cui: formData.cui || null,
        nr_reg_com: formData.nr_reg_com || null,
        cont_bancar: formData.cont_bancar || null,
        banca: formData.banca || null,
        cnp: formData.cnp || null,
        ci_serie: formData.ci_serie || null,
        ci_numar: formData.ci_numar || null,
        agent_vanzari: formData.agent_vanzari || null,
        categorie: formData.categorie || null,
        sursa: formData.sursa || null,
        observatii: formData.observatii || null
      };
      
      if (selectedClient) {
        // Update existing client
        await ClientsService.updateClient(selectedClient.id, cleanedData);
      } else {
        // Create new client
        await ClientsService.createClient(cleanedData);
      }
      
      // Refresh clients list
      await loadClients();
      closeClientModal();
      
    } catch (error) {
      console.error('Error saving client:', error);
      setError(error.message);
    } finally {
      setIsModalLoading(false);
    }
  };

  const deleteClient = async (clientId) => {
    if (!window.confirm('Sigur doriți să ștergeți acest client?')) {
      return;
    }
    
    try {
      await ClientsService.deleteClient(clientId);
      await loadClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      setError(error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "activ":
        return "bg-green-100 text-green-700";
      case "inactiv":
        return "bg-gray-100 text-gray-700";
      case "suspendat":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "activ":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "inactiv":
        return <X className="w-4 h-4 text-gray-600" />;
      case "suspendat":
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getClientTypeLabel = (tip_client) => {
    return tip_client === 'persoana_juridica' ? 'Persoană Juridică' : 'Persoană Fizică';
  };

  const toggleSelectAll = () => {
    if (selectedClienti.length === clienti.length) {
      setSelectedClienti([]);
    } else {
      setSelectedClienti(clienti.map((c) => c.id));
    }
  };

  const toggleSelectClient = (id) => {
    if (selectedClienti.includes(id)) {
      setSelectedClienti(selectedClienti.filter((cId) => cId !== id));
    } else {
      setSelectedClienti([...selectedClienti, id]);
    }
  };

  const bulkUpdateStatus = async (status) => {
    try {
      await ClientsService.bulkUpdateStatus(selectedClienti, status);
      await loadClients();
      setSelectedClienti([]);
    } catch (error) {
      console.error('Error bulk updating status:', error);
      setError(error.message);
    }
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-500" />
          <p className="text-gray-600">Se încarcă clienții...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50/50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-4 text-red-500" />
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={refreshData}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Gestiune Clienți
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administrează baza de date cu clienți și parteneri
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => openClientModal()}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Client Nou
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
            <button 
              onClick={refreshData}
              className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200"
            >
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
                placeholder="Caută după nume, email, CUI, CNP..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filters.tip_client}
              onChange={(e) => handleFilterChange('tip_client', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toate tipurile</option>
              <option value="persoana_fizica">Persoană Fizică</option>
              <option value="persoana_juridica">Persoană Juridică</option>
            </select>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Toate statusurile</option>
              <option value="activ">Activ</option>
              <option value="inactiv">Inactiv</option>
              <option value="suspendat">Suspendat</option>
            </select>
          </div>

          {/* Advanced Search Panel */}
          {showAdvancedSearch && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Oraș
                  </label>
                  <input
                    type="text"
                    value={filters.oras}
                    onChange={(e) => handleFilterChange('oras', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Caută după oraș"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Județ
                  </label>
                  <input
                    type="text"
                    value={filters.judet}
                    onChange={(e) => handleFilterChange('judet', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Caută după județ"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categorie
                  </label>
                  <input
                    type="text"
                    value={filters.categorie}
                    onChange={(e) => handleFilterChange('categorie', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Caută după categorie"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Agent de Vânzări
                  </label>
                  <input
                    type="text"
                    value={filters.agent_vanzari}
                    onChange={(e) => handleFilterChange('agent_vanzari', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Caută după agent"
                  />
                </div>
              </div>
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Resetează
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
                <p className="text-sm text-gray-600">Total Clienți</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {statistics.totalClients || clienti.length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                <Users className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clienți Activi</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {statistics.activeClients || clienti.filter(c => c.status === 'activ').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Persoane Juridice</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {statistics.companiesCount || clienti.filter(c => c.tip_client === 'persoana_juridica').length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <Building className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Orașe Acoperite</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900">
                  {statistics.citiesCount || new Set(clienti.map(c => c.oras).filter(Boolean)).size}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
                <MapPin className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clienti.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        {client.tip_client === "persoana_juridica" ? (
                          <Building className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="ml-3">
                        <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg">
                          {getClientTypeLabel(client.tip_client)}
                        </span>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedClienti.includes(client.id)}
                      onChange={() => toggleSelectClient(client.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {client.nume}
                  </h3>

                  <div className="space-y-2 mb-4">
                    {client.email && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{client.email}</span>
                      </div>
                    )}
                    {client.telefon && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="w-4 h-4 mr-2 text-gray-400" />
                        {client.telefon}
                      </div>
                    )}
                    {client.oras && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                        <span className="truncate">{client.oras}{client.judet && `, ${client.judet}`}</span>
                      </div>
                    )}
                    {(client.cui || client.cnp) && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Shield className="w-4 h-4 mr-2 text-gray-400" />
                        {client.cui ? `CUI: ${client.cui}` : `CNP: ${client.cnp}`}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getStatusIcon(client.status)}
                      <span
                        className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                          client.status
                        )}`}
                      >
                        {client.status?.charAt(0).toUpperCase() + client.status?.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => handleViewDetails(client)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => openClientModal(client)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button 
                      onClick={() => deleteClient(client.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
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
                        checked={selectedClienti.length === clienti.length && clienti.length > 0}
                        onChange={toggleSelectAll}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Locație
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      CUI/CNP
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Acțiuni
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {clienti.map((client) => (
                    <tr
                      key={client.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="px-6 py-4">
                        <input
                          type="checkbox"
                          checked={selectedClienti.includes(client.id)}
                          onChange={() => toggleSelectClient(client.id)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow">
                            {client.tip_client === "persoana_juridica" ? (
                              <Building className="w-5 h-5 text-white" />
                            ) : (
                              <User className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">
                              {client.nume}
                            </div>
                            <div className="text-xs text-gray-500">
                              {getClientTypeLabel(client.tip_client)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {client.email || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {client.telefon || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {client.oras || '-'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {client.judet || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client.cui || client.cnp || '-'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getStatusIcon(client.status)}
                          <span
                            className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                              client.status
                            )}`}
                          >
                            {client.status?.charAt(0).toUpperCase() + client.status?.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <button 
                            onClick={() => handleViewDetails(client)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Eye className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => openClientModal(client)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            <Edit className="w-4 h-4 text-gray-600" />
                          </button>
                          <button 
                            onClick={() => deleteClient(client.id)}
                            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
                          >
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
      {selectedClienti.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
          <span className="text-sm text-gray-600">
            {selectedClienti.length} selectați
          </span>
          <button 
            onClick={() => bulkUpdateStatus('activ')}
            className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
          >
            Activează
          </button>
          <button 
            onClick={() => bulkUpdateStatus('inactiv')}
            className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Dezactivează
          </button>
          <button
            onClick={() => setSelectedClienti([])}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Client Modal */}
      {showClientModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedClient ? "Editare Client" : "Client Nou"}
                </h2>
                <button
                  onClick={closeClientModal}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nume *
                    </label>
                    <input
                      type="text"
                      value={formData.nume}
                      onChange={(e) => handleFormChange('nume', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Nume client"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Tip Client *
                    </label>
                    <select
                      value={formData.tip_client}
                      onChange={(e) => handleFormChange('tip_client', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="persoana_fizica">Persoană Fizică</option>
                      <option value="persoana_juridica">Persoană Juridică</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Telefon
                    </label>
                    <input
                      type="tel"
                      value={formData.telefon}
                      onChange={(e) => handleFormChange('telefon', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="+40 7XX XXX XXX"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Adresă
                    </label>
                    <input
                      type="text"
                      value={formData.adresa}
                      onChange={(e) => handleFormChange('adresa', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Adresa completă"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Oraș
                      </label>
                      <input
                        type="text"
                        value={formData.oras}
                        onChange={(e) => handleFormChange('oras', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Orașul"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Județ
                      </label>
                      <input
                        type="text"
                        value={formData.judet}
                        onChange={(e) => handleFormChange('judet', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Județul"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  {formData.tip_client === 'persoana_juridica' ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CUI
                        </label>
                        <input
                          type="text"
                          value={formData.cui}
                          onChange={(e) => handleFormChange('cui', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="RO12345678"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Nr. Reg. Com.
                        </label>
                        <input
                          type="text"
                          value={formData.nr_reg_com}
                          onChange={(e) => handleFormChange('nr_reg_com', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="J40/1234/2020"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Cont Bancar
                        </label>
                        <input
                          type="text"
                          value={formData.cont_bancar}
                          onChange={(e) => handleFormChange('cont_bancar', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="ROXX XXXX XXXX XXXX XXXX XXXX"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Bancă
                        </label>
                        <input
                          type="text"
                          value={formData.banca}
                          onChange={(e) => handleFormChange('banca', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Numele băncii"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          CNP
                        </label>
                        <input
                          type="text"
                          value={formData.cnp}
                          onChange={(e) => handleFormChange('cnp', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="1234567890123"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Serie CI
                          </label>
                          <input
                            type="text"
                            value={formData.ci_serie}
                            onChange={(e) => handleFormChange('ci_serie', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="AB"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Număr CI
                          </label>
                          <input
                            type="text"
                            value={formData.ci_numar}
                            onChange={(e) => handleFormChange('ci_numar', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="123456"
                          />
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Condiții Plată
                    </label>
                    <select
                      value={formData.conditii_plata}
                      onChange={(e) => handleFormChange('conditii_plata', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="15_zile">15 zile</option>
                      <option value="30_zile">30 zile</option>
                      <option value="45_zile">45 zile</option>
                      <option value="60_zile">60 zile</option>
                      <option value="avans">Avans</option>
                      <option value="ramburs">Ramburs</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => handleFormChange('status', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="activ">Activ</option>
                      <option value="inactiv">Inactiv</option>
                      <option value="suspendat">Suspendat</option>
                    </select>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observații
                  </label>
                  <textarea
                    rows="3"
                    value={formData.observatii}
                    onChange={(e) => handleFormChange('observatii', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Note suplimentare despre client..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={closeClientModal}
                disabled={isModalLoading}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Anulează
              </button>
              <button 
                onClick={saveClient}
                disabled={isModalLoading || !formData.nume}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isModalLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                {selectedClient ? "Actualizează" : "Adaugă Client"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Client Details Modal */}
      {showDetailsModal && selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg mr-3">
                    {selectedClient.tip_client === "persoana_juridica" ? (
                      <Building className="w-6 h-6 text-white" />
                    ) : (
                      <User className="w-6 h-6 text-white" />
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {selectedClient.nume}
                    </h2>
                    <p className="text-sm text-gray-600">
                      {getClientTypeLabel(selectedClient.tip_client)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Date de Contact
                  </h3>
                  <div className="space-y-3">
                    {selectedClient.email && (
                      <div className="flex items-start">
                        <Mail className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Email</p>
                          <p className="text-sm text-gray-600">{selectedClient.email}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.telefon && (
                      <div className="flex items-start">
                        <Phone className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Telefon</p>
                          <p className="text-sm text-gray-600">{selectedClient.telefon}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.adresa && (
                      <div className="flex items-start">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">Adresă</p>
                          <p className="text-sm text-gray-600">{selectedClient.adresa}</p>
                          {(selectedClient.oras || selectedClient.judet) && (
                            <p className="text-xs text-gray-500 mt-1">
                              {selectedClient.oras}{selectedClient.judet && `, ${selectedClient.judet}`}
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Informații {selectedClient.tip_client === 'persoana_juridica' ? 'Fiscale' : 'Personale'}
                  </h3>
                  <div className="space-y-3">
                    {selectedClient.cui && (
                      <div className="flex items-start">
                        <Shield className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">CUI</p>
                          <p className="text-sm text-gray-600">{selectedClient.cui}</p>
                        </div>
                      </div>
                    )}
                    {selectedClient.cnp && (
                      <div className="flex items-start">
                        <Shield className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                        <div>
                          <p className="text-sm font-medium text-gray-700">CNP</p>
                          <p className="text-sm text-gray-600">{selectedClient.cnp}</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-start">
                      <Activity className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Status</p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                            selectedClient.status
                          )}`}
                        >
                          {selectedClient.status?.charAt(0).toUpperCase() + selectedClient.status?.slice(1)}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">Client din</p>
                        <p className="text-sm text-gray-600">
                          {new Date(selectedClient.created_at).toLocaleDateString("ro-RO")}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {selectedClient.observatii && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Observații</h3>
                  <p className="text-sm text-gray-600">{selectedClient.observatii}</p>
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                <button 
                  onClick={() => openClientModal(selectedClient)}
                  className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editează
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  Trimite Email
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4 mr-2" />
                  Exportă Date
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestiuneClienti;