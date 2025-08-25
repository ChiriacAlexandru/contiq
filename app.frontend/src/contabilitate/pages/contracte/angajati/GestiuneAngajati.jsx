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
  Briefcase,
  DollarSign,
  Clock,
  Award,
  UserCheck,
  UserX,
  Grid3X3,
  List,
} from "lucide-react";

const GestiuneAngajati = () => {
  const [angajati, setAngajati] = useState([
    {
      id: 1,
      nume: "Popescu Ion",
      functie: "Dezvoltator Senior",
      departament: "IT",
      email: "ion.popescu@company.ro",
      telefon: "+40 721 123 456",
      adresa: "Str. Libertății nr. 15, București",
      dataAngajare: "2022-03-15",
      salariu: 8500,
      status: "activ",
      contract: "full-time",
      experienta: "5 ani",
      rating: 5,
      proiecte: 12,
    },
    {
      id: 2,
      nume: "Ionescu Maria",
      functie: "Designer UI/UX",
      departament: "Design",
      email: "maria.ionescu@company.ro",
      telefon: "+40 722 234 567",
      adresa: "Bd. Victoriei nr. 88, Cluj-Napoca",
      dataAngajare: "2023-01-20",
      salariu: 6500,
      status: "activ",
      contract: "full-time",
      experienta: "3 ani",
      rating: 4,
      proiecte: 8,
    },
    {
      id: 3,
      nume: "Georgescu Andrei",
      functie: "Analist Financiar",
      departament: "Financiar",
      email: "andrei.georgescu@company.ro",
      telefon: "+40 723 345 678",
      adresa: "Str. Mihai Viteazu nr. 42, Timișoara",
      dataAngajare: "2021-07-10",
      salariu: 5500,
      status: "concediu",
      contract: "full-time",
      experienta: "4 ani",
      rating: 4,
      proiecte: 6,
    },
    {
      id: 4,
      nume: "Radu Alexandra",
      functie: "Marketing Specialist",
      departament: "Marketing",
      email: "alexandra.radu@company.ro",
      telefon: "+40 724 456 789",
      adresa: "Str. Republicii nr. 123, Brașov",
      dataAngajare: "2024-02-01",
      salariu: 4500,
      status: "activ",
      contract: "part-time",
      experienta: "2 ani",
      rating: 3,
      proiecte: 4,
    },
    {
      id: 5,
      nume: "Mihăilescu Cristian",
      functie: "Manager Proiect",
      departament: "Management",
      email: "cristian.mihailescu@company.ro",
      telefon: "+40 725 567 890",
      adresa: "Bd. Carol I nr. 67, Iași",
      dataAngajare: "2020-11-15",
      salariu: 9500,
      status: "activ",
      contract: "full-time",
      experienta: "8 ani",
      rating: 5,
      proiecte: 15,
    },
    {
      id: 6,
      nume: "Vasile Elena",
      functie: "HR Specialist",
      departament: "Resurse Umane",
      email: "elena.vasile@company.ro",
      telefon: "+40 726 678 901",
      adresa: "Str. Unirii nr. 89, Constanța",
      dataAngajare: "2023-05-20",
      salariu: 5000,
      status: "inactiv",
      contract: "full-time",
      experienta: "3 ani",
      rating: 3,
      proiecte: 2,
    },
  ]);

  const [showAdvancedSearch, setShowAdvancedSearch] = useState(false);
  const [selectedAngajati, setSelectedAngajati] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("toti");
  const [filterDepartament, setFilterDepartament] = useState("toate");
  const [filterContract, setFilterContract] = useState("toate");
  const [viewMode, setViewMode] = useState("grid");
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "activ":
        return "bg-green-100 text-green-700";
      case "concediu":
        return "bg-yellow-100 text-yellow-700";
      case "inactiv":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "activ":
        return <UserCheck className="w-4 h-4 text-green-600" />;
      case "concediu":
        return <Clock className="w-4 h-4 text-white" />;
      case "inactiv":
        return <UserX className="w-4 h-4 text-red-600" />;
      default:
        return null;
    }
  };

  const getContractColor = (contract) => {
    switch (contract) {
      case "full-time":
        return "bg-blue-100 text-blue-700";
      case "part-time":
        return "bg-purple-100 text-purple-700";
      case "contract":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const filteredAngajati = angajati.filter((angajat) => {
    const matchesSearch =
      angajat.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
      angajat.functie.toLowerCase().includes(searchTerm.toLowerCase()) ||
      angajat.departament.toLowerCase().includes(searchTerm.toLowerCase()) ||
      angajat.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "toti" || angajat.status === filterStatus;
    const matchesDepartament =
      filterDepartament === "toate" ||
      angajat.departament.toLowerCase() === filterDepartament;
    const matchesContract =
      filterContract === "toate" || angajat.contract === filterContract;
    return matchesSearch && matchesStatus && matchesDepartament && matchesContract;
  });

  const toggleSelectAll = () => {
    if (selectedAngajati.length === filteredAngajati.length) {
      setSelectedAngajati([]);
    } else {
      setSelectedAngajati(filteredAngajati.map((a) => a.id));
    }
  };

  const toggleSelectAngajat = (id) => {
    if (selectedAngajati.includes(id)) {
      setSelectedAngajati(selectedAngajati.filter((aId) => aId !== id));
    } else {
      setSelectedAngajati([...selectedAngajati, id]);
    }
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

  const getDepartamente = () => {
    const departamente = [...new Set(angajati.map((a) => a.departament))];
    return departamente;
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
              Gestiune Angajați
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Administrează echipa și datele angajaților
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button 
              onClick={() => setShowEmployeeModal(true)}
              className="inline-flex items-center px-4 py-2 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg shadow-green-500/30 hover:shadow-xl hover:shadow-green-500/40 transition-all duration-200"
            >
              <Plus className="w-5 h-5 mr-2" />
              Adaugă Angajat
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
                placeholder="Caută după nume, funcție, departament sau email..."
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
              <option value="toti">Toți angajații</option>
              <option value="activ">Activi</option>
              <option value="concediu">În concediu</option>
              <option value="inactiv">Inactivi</option>
            </select>
          </div>

          {/* Advanced Search Panel */}
          {showAdvancedSearch && (
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    Tip Contract
                  </label>
                  <select
                    value={filterContract}
                    onChange={(e) => setFilterContract(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="toate">Toate contractele</option>
                    <option value="full-time">Full-time</option>
                    <option value="part-time">Part-time</option>
                    <option value="contract">Contract</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Salariu (RON)
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
                    setFilterStatus("toti");
                    setFilterDepartament("toate");
                    setFilterContract("toate");
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
                <p className="text-sm text-gray-600">Total Angajați</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {angajati.length}
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
                <p className="text-sm text-gray-600">Angajați Activi</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {angajati.filter((a) => a.status === "activ").length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                <UserCheck className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Salariu Mediu</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {Math.round(
                    angajati.reduce((sum, a) => sum + a.salariu, 0) /
                      angajati.length
                  ).toLocaleString("ro-RO")}{" "}
                  RON
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Departamente</p>
                <p className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
                  {getDepartamente().length}
                </p>
              </div>
              <div className="p-3 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 shadow-lg">
                <Building className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredAngajati.map((angajat) => (
            <div
              key={angajat.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">
                        {angajat.nume}
                      </h3>
                      <p className="text-sm text-gray-600">{angajat.functie}</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedAngajati.includes(angajat.id)}
                    onChange={() => toggleSelectAngajat(angajat.id)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="w-4 h-4 mr-2 text-gray-400" />
                    {angajat.departament}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {angajat.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Phone className="w-4 h-4 mr-2 text-gray-400" />
                    {angajat.telefon}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    Angajat din{" "}
                    {new Date(angajat.dataAngajare).toLocaleDateString("ro-RO")}
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    {getStatusIcon(angajat.status)}
                    <span
                      className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                        angajat.status
                      )}`}
                    >
                      {angajat.status}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-lg ${getContractColor(
                      angajat.contract
                    )}`}
                  >
                    {angajat.contract}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Salariu:</span>
                    <span className="text-sm font-medium">
                      {angajat.salariu.toLocaleString("ro-RO")} RON
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Experiență:</span>
                    <span className="text-sm font-medium">
                      {angajat.experienta}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Proiecte:</span>
                    <span className="text-sm font-medium">
                      {angajat.proiecte}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Rating:</span>
                    <div className="flex items-center">
                      {getRatingStars(angajat.rating)}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between">
                  <button 
                    onClick={() => {
                      setSelectedEmployee(angajat);
                      setShowEmployeeModal(true);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Eye className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <FileText className="w-4 h-4 text-gray-600" />
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
                      checked={selectedAngajati.length === filteredAngajati.length}
                      onChange={toggleSelectAll}
                      className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Angajat
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Funcție
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Departament
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-xs text-gray-500 uppercase tracking-wider">
                    Salariu
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
                {filteredAngajati.map((angajat) => (
                  <tr
                    key={angajat.id}
                    className="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedAngajati.includes(angajat.id)}
                        onChange={() => toggleSelectAngajat(angajat.id)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center mr-3">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <div className="text-sm font-medium">
                            {angajat.nume}
                          </div>
                          <div className="text-sm text-gray-600 text-gray-500">
                            {angajat.experienta} experiență
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{angajat.functie}</div>
                      <div className="text-sm text-gray-600 text-gray-500">
                        {getRatingStars(angajat.rating)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {angajat.departament}
                      </div>
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-lg ${getContractColor(
                          angajat.contract
                        )}`}
                      >
                        {angajat.contract}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{angajat.email}</div>
                      <div className="text-sm text-gray-600 text-gray-500">{angajat.telefon}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium">
                        {angajat.salariu.toLocaleString("ro-RO")} RON
                      </div>
                      <div className="text-sm text-gray-600 text-gray-500">
                        {angajat.proiecte} proiecte
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(angajat.status)}
                        <span
                          className={`ml-2 px-2 py-1 text-xs font-medium rounded-lg ${getStatusColor(
                            angajat.status
                          )}`}
                        >
                          {angajat.status}
                        </span>
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
                          <FileText className="w-4 h-4 text-gray-600" />
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
      {selectedAngajati.length > 0 && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 bg-white rounded-xl shadow-lg border border-gray-200 px-6 py-3 flex items-center space-x-4 z-20">
          <span className="text-sm text-gray-600">
            {selectedAngajati.length} selectați
          </span>
          <button className="px-3 py-1 text-sm text-gray-600 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Exportă
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 bg-green-500 text-white rounded-lg hover:bg-green-600">
            Activează
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
            Concediu
          </button>
          <button className="px-3 py-1 text-sm text-gray-600 bg-red-500 text-white rounded-lg hover:bg-red-600">
            Dezactivează
          </button>
          <button
            onClick={() => setSelectedAngajati([])}
            className="p-1 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}

      {/* Employee Modal (placeholder) */}
      {showEmployeeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                  {selectedEmployee ? "Detalii Angajat" : "Angajat Nou"}
                </h2>
                <button
                  onClick={() => {
                    setShowEmployeeModal(false);
                    setSelectedEmployee(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Nume Complet
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedEmployee?.nume || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nume și prenume"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Funcție
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedEmployee?.functie || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Funcția în cadrul companiei"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Departament
                  </label>
                  <select
                    defaultValue={selectedEmployee?.departament || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Selectează departamentul</option>
                    {getDepartamente().map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedEmployee?.email || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="email@company.ro"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Telefon
                  </label>
                  <input
                    type="tel"
                    defaultValue={selectedEmployee?.telefon || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+40 7XX XXX XXX"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Salariu (RON)
                  </label>
                  <input
                    type="number"
                    defaultValue={selectedEmployee?.salariu || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1 block mb-1">
                    Adresă
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedEmployee?.adresa || ""}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Adresa completă"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-100 flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowEmployeeModal(false);
                  setSelectedEmployee(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Anulează
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                {selectedEmployee ? "Actualizează" : "Adaugă Angajat"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GestiuneAngajati;