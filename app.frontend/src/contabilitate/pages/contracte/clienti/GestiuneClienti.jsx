import React, { useState } from "react";
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
} from "lucide-react";

const GestiuneClienti = () => {
  const [clienti, setClienti] = useState([
    {
      id: 1,
      nume: "SC Tech Solutions SRL",
      tip: "Persoană Juridică",
      cui: "RO12345678",
      email: "contact@techsolutions.ro",
      telefon: "+40 721 123 456",
      adresa: "Str. Tehnologiei nr. 15, București",
      dataInregistrare: "2024-01-15",
      totalFacturi: 25,
      valoareTotala: 125000,
      status: "activ",
      rating: 5,
      ultimaFactura: "2025-08-20",
      reprezentant: "Ion Popescu",
    },
    {
      id: 2,
      nume: "Digital Agency SRL",
      tip: "Persoană Juridică",
      cui: "RO87654321",
      email: "office@digitalagency.ro",
      telefon: "+40 722 234 567",
      adresa: "Bd. Victoriei nr. 88, Cluj-Napoca",
      dataInregistrare: "2023-05-20",
      totalFacturi: 18,
      valoareTotala: 87500,
      status: "activ",
      rating: 4,
      ultimaFactura: "2025-08-15",
      reprezentant: "Maria Ionescu",
    },
    {
      id: 3,
      nume: "Popescu Andrei PFA",
      tip: "Persoană Fizică",
      cui: "RO11223344",
      email: "andrei.popescu@email.com",
      telefon: "+40 723 345 678",
      adresa: "Str. Libertății nr. 42, Timișoara",
      dataInregistrare: "2024-03-10",
      totalFacturi: 8,
      valoareTotala: 35000,
      status: "inactiv",
      rating: 3,
      ultimaFactura: "2025-06-10",
      reprezentant: "Popescu Andrei",
    },
    {
      id: 4,
      nume: "Marketing Pro SRL",
      tip: "Persoană Juridică",
      cui: "RO99887766",
      email: "hello@marketingpro.ro",
      telefon: "+40 724 456 789",
      adresa: "Str. Creativității nr. 5, Iași",
      dataInregistrare: "2023-11-25",
      totalFacturi: 32,
      valoareTotala: 156000,
      status: "activ",
      rating: 5,
      ultimaFactura: "2025-08-22",
      reprezentant: "Elena Vasilescu",
    },
    {
      id: 5,
      nume: "Consulting Group SA",
      tip: "Persoană Juridică",
      cui: "RO55667788",
      email: "info@consultinggroup.ro",
      telefon: "+40 725 567 890",
      adresa: "Calea Dorobanți nr. 100, București",
      dataInregistrare: "2023-02-14",
      totalFacturi: 45,
      valoareTotala: 285000,
      status: "vip",
      rating: 5,
      ultimaFactura: "2025-08-24",
      reprezentant: "Alexandru Radu",
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("toate");
  const [filterTip, setFilterTip] = useState("toate");
  const [selectedClienti, setSelectedClienti] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case "activ":
        return "bg-green-100 text-green-700";
      case "inactiv":
        return "bg-gray-100 text-gray-700";
      case "vip":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "activ":
        return "bg-green-500";
      case "inactiv":
        return "bg-gray-500";
      case "vip":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getRatingStars = (rating) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${
          i < rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
        }`}
      />
    ));
  };

  const filteredClienti = clienti.filter((client) => {
    const matchesSearch =
      client.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.cui.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "toate" || client.status === filterStatus;
    const matchesTip =
      filterTip === "toate" ||
      (filterTip === "juridica" && client.tip === "Persoană Juridică") ||
      (filterTip === "fizica" && client.tip === "Persoană Fizică");
    return matchesSearch && matchesStatus && matchesTip;
  });

  const toggleSelectAll = () => {
    if (selectedClienti.length === filteredClienti.length) {
      setSelectedClienti([]);
    } else {
      setSelectedClienti(filteredClienti.map((c) => c.id));
    }
  };

  const toggleSelectClient = (id) => {
    if (selectedClienti.includes(id)) {
      setSelectedClienti(selectedClienti.filter((cId) => cId !== id));
    } else {
      setSelectedClienti([...selectedClienti, id]);
    }
  };

  const handleViewDetails = (client) => {
    setSelectedClient(client);
    setShowDetailsModal(true);
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Gestiune Clienți
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administrează baza de date cu clienți și parteneri
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button
              onClick={() => setShowAddModal(true)}
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
                <Users className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-3 py-2 rounded-r-xl transition-colors ${
                  viewMode === "list"
                    ? "bg-blue-500 text-white"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <FileText className="w-5 h-5" />
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
                placeholder="Caută după nume, email sau CUI..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterTip}
              onChange={(e) => setFilterTip(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="toate">Toate tipurile</option>
              <option value="juridica">Persoană Juridică</option>
              <option value="fizica">Persoană Fizică</option>
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="toate">Toate statusurile</option>
              <option value="activ">Activ</option>
              <option value="inactiv">Inactiv</option>
              <option value="vip">VIP</option>
            </select>
            <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-200">
              <Filter className="w-5 h-5 mr-2" />
              Mai multe filtre
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Clienți</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clienti.length}
                </p>
                <p className="text-xs text-green-600 mt-1">+12% luna aceasta</p>
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
                <p className="text-2xl font-bold text-gray-900">
                  {
                    clienti.filter(
                      (c) => c.status === "activ" || c.status === "vip"
                    ).length
                  }
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  {Math.round(
                    (clienti.filter(
                      (c) => c.status === "activ" || c.status === "vip"
                    ).length /
                      clienti.length) *
                      100
                  )}
                  % din total
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
                <p className="text-sm text-gray-600">Valoare Totală</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clienti
                    .reduce((sum, c) => sum + c.valoareTotala, 0)
                    .toLocaleString("ro-RO")}{" "}
                  RON
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +25% față de anul trecut
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Clienți VIP</p>
                <p className="text-2xl font-bold text-gray-900">
                  {clienti.filter((c) => c.status === "vip").length}
                </p>
                <p className="text-xs text-purple-600 mt-1">Premium</p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-lg">
                <Star className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClienti.map((client) => (
              <div
                key={client.id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        {client.tip === "Persoană Juridică" ? (
                          <Building className="w-6 h-6 text-white" />
                        ) : (
                          <User className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-semibold text-gray-900">
                          {client.nume}
                        </h3>
                        <p className="text-xs text-gray-500">{client.tip}</p>
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      checked={selectedClienti.includes(client.id)}
                      onChange={() => toggleSelectClient(client.id)}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Mail className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{client.email}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 mr-2 text-gray-400" />
                      {client.telefon}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                      <span className="truncate">{client.adresa}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Shield className="w-4 h-4 mr-2 text-gray-400" />
                      CUI: {client.cui}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      {getRatingStars(client.rating)}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                        client.status
                      )}`}
                    >
                      {client.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-500">Total Facturi</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {client.totalFacturi}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Valoare Totală</p>
                      <p className="text-sm font-semibold text-gray-900">
                        {client.valoareTotala.toLocaleString("ro-RO")} RON
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleViewDetails(client)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Vezi detalii
                    </button>
                    <div className="flex items-center space-x-2">
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <Mail className="w-4 h-4 text-gray-600" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreVertical className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
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
                          selectedClienti.length === filteredClienti.length
                        }
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
                      CUI
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Facturi
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Valoare Totală
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                      Rating
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
                  {filteredClienti.map((client) => (
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
                            {client.tip === "Persoană Juridică" ? (
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
                              {client.tip}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {client.email}
                        </div>
                        <div className="text-xs text-gray-500">
                          {client.telefon}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client.cui}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {client.totalFacturi}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {client.valoareTotala.toLocaleString("ro-RO")} RON
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {getRatingStars(client.rating)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${getStatusDot(
                              client.status
                            )}`}
                          ></div>
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                              client.status
                            )}`}
                          >
                            {client.status}
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
                          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                            <Edit className="w-4 h-4 text-gray-600" />
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

      {/* Add Client Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">
                  Adaugă Client Nou
                </h2>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tip Client *
                  </label>
                  <div className="flex gap-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tip"
                        value="juridica"
                        defaultChecked
                        className="mr-2"
                      />
                      <span className="text-sm">Persoană Juridică</span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="tip"
                        value="fizica"
                        className="mr-2"
                      />
                      <span className="text-sm">Persoană Fizică</span>
                    </label>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume Companie / Nume Complet *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Ex: SC Example SRL"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    CUI / CNP *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="RO12345678"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nr. Reg. Comerț
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="J40/1234/2020"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email *
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="contact@example.ro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Telefon *
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+40 7XX XXX XXX"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresă *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Strada, Nr., Oraș"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Persoană de Contact
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nume reprezentant"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Website
                  </label>
                  <input
                    type="url"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://www.example.ro"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cont Bancar
                  </label>
                  <input
                    type="text"
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
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Numele băncii"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observații
                  </label>
                  <textarea
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="3"
                    placeholder="Note adiționale despre client..."
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Anulează
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Salvează Client
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
                    {selectedClient.tip === "Persoană Juridică" ? (
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
                      {selectedClient.tip}
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
              {/* Client Info Tabs */}
              <div className="border-b border-gray-200 mb-6">
                <div className="flex space-x-8">
                  <button className="pb-2 border-b-2 border-blue-500 text-blue-600 font-medium">
                    Informații Generale
                  </button>
                  <button className="pb-2 text-gray-500 hover:text-gray-700">
                    Istoric Facturi
                  </button>
                  <button className="pb-2 text-gray-500 hover:text-gray-700">
                    Documente
                  </button>
                  <button className="pb-2 text-gray-500 hover:text-gray-700">
                    Activitate
                  </button>
                </div>
              </div>

              {/* General Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Date de Contact
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Mail className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Email
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedClient.email}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Phone className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Telefon
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedClient.telefon}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Adresă
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedClient.adresa}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <User className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Reprezentant
                        </p>
                        <p className="text-sm text-gray-600">
                          {selectedClient.reprezentant}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">
                    Date Fiscale
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <Shield className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">CUI</p>
                        <p className="text-sm text-gray-600">
                          {selectedClient.cui}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Calendar className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Client din
                        </p>
                        <p className="text-sm text-gray-600">
                          {new Date(
                            selectedClient.dataInregistrare
                          ).toLocaleDateString("ro-RO")}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Activity className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Status
                        </p>
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                            selectedClient.status
                          )}`}
                        >
                          {selectedClient.status}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Star className="w-4 h-4 text-gray-400 mt-0.5 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-700">
                          Rating
                        </p>
                        <div className="flex items-center mt-1">
                          {getRatingStars(selectedClient.rating)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                  Statistici
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Total Facturi</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedClient.totalFacturi}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Valoare Totală</p>
                    <p className="text-lg font-bold text-gray-900">
                      {selectedClient.valoareTotala.toLocaleString("ro-RO")} RON
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Ultima Factură</p>
                    <p className="text-lg font-bold text-gray-900">
                      {new Date(
                        selectedClient.ultimaFactura
                      ).toLocaleDateString("ro-RO")}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-500">Valoare Medie</p>
                    <p className="text-lg font-bold text-gray-900">
                      {Math.round(
                        selectedClient.valoareTotala /
                          selectedClient.totalFacturi
                      ).toLocaleString("ro-RO")}{" "}
                      RON
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-6 pt-6 border-t border-gray-100 flex flex-wrap gap-3">
                <button className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                  <FileText className="w-4 h-4 mr-2" />
                  Factură Nouă
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Mail className="w-4 h-4 mr-2" />
                  Trimite Email
                </button>
                <button className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <Edit className="w-4 h-4 mr-2" />
                  Editează
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

      {/* Bulk Actions */}
      {selectedClienti.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
          <span className="text-sm text-gray-600">
            {selectedClienti.length} selectați
          </span>
          <button className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Exportă
          </button>
          <button className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600">
            Email în masă
          </button>
          <button className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600">
            Șterge
          </button>
          <button
            onClick={() => setSelectedClienti([])}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default GestiuneClienti;
